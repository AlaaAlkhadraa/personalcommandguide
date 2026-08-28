"""Gebruikers, wachtwoorden en sessies.

Twee rollen: de **eigenaar** ziet en beheert alle administraties, een
**klant** uitsluitend de zijne. Wat een klant nooit mag — goedkeuren en
iets definitief maken — staat niet hier maar in één centrale controle in
de webinterface; hier staat alleen wie iemand is.

Wat hier geldt:

- **Een wachtwoord wordt nooit bewaard, alleen een hash.** Met bcrypt,
  dat met opzet traag is: wie de database steelt, kan er niet even een
  woordenboek doorheen halen. De hash gaat nergens heen: niet naar een
  logregel, niet naar een scherm, niet naar de audit trail.
- **Bij inloggen zegt het systeem nooit wat er mis was.** Een onbekend
  e-mailadres en een fout wachtwoord geven dezelfde melding en kosten
  even veel tijd. Anders kun je met een lijst e-mailadressen uitzoeken
  wie er klant is.
- **Een sessie verloopt en is in te trekken.** In de database staat
  alleen een hash van het sessietoken, om dezelfde reden als bij een
  wachtwoord: wie de database leest, kan er niet mee inloggen.
"""

import hashlib
import os
import secrets
from datetime import datetime, timedelta, timezone
from typing import Literal, Optional

from pydantic import BaseModel

ROLLEN = ("eigenaar", "klant")

# Hoe zwaar bcrypt mag rekenen. Twaalf rondes is ongeveer een kwart
# seconde: te traag om te raden, snel genoeg om op in te loggen. In de
# tests wordt dit omlaag gezet, want daar draaien er honderden achter
# elkaar — nooit in productie verlagen.
RONDES = int(os.environ.get("BOEKHOUDING_BCRYPT_RONDES", "12"))

# Hoe lang een sessie geldig is zonder opnieuw in te loggen.
SESSIE_UREN = 12

# De rem op mislukte inlogpogingen: binnen dit venster mag een account
# vijf keer misgaan en een IP-adres twintig keer. Daarna wordt er niet
# eens meer naar het wachtwoord gekeken.
VENSTER_MINUTEN = 15
MAX_PER_ACCOUNT = 5
MAX_PER_IP = 20

# Eén melding voor alle gevallen: onbekend adres, fout wachtwoord,
# geblokkeerd account. Wie hem leest weet niet welke van de drie het is.
INLOG_MISLUKT = "E-mailadres of wachtwoord klopt niet."
TE_VAAK = (
    "Te veel mislukte pogingen. Wacht een kwartier en probeer het opnieuw."
)


class Gebruiker(BaseModel):
    """Wie er is ingelogd. Bevat nooit het wachtwoord of de hash."""

    id: int
    email: str
    naam: str
    rol: Literal["eigenaar", "klant"]
    actief: bool = True
    # Bij een klant: de administraties waar hij bij mag. Bij de eigenaar
    # blijft dit leeg — die mag overal bij.
    administraties: list[int] = []

    def is_eigenaar(self) -> bool:
        return self.rol == "eigenaar"

    def mag_bij(self, administratie_id: int) -> bool:
        """Mag deze gebruiker bij deze administratie?

        De eigenaar mag overal bij. Een klant alleen bij de
        administraties die aan hem gekoppeld zijn.
        """
        if not self.actief:
            return False
        if self.is_eigenaar():
            return True
        return administratie_id in self.administraties


def normaliseer_email(email: str) -> str:
    """Een e-mailadres is niet hoofdlettergevoelig; sla het eenvormig op."""
    return (email or "").strip().lower()


def _voorbereid(wachtwoord: str) -> bytes:
    """Maak het wachtwoord klaar voor bcrypt.

    Bcrypt kijkt maar naar de eerste 72 bytes en weigert langere invoer.
    Door er eerst een sha256 overheen te halen past elk wachtwoord, hoe
    lang ook, en telt het hele wachtwoord mee.
    """
    return hashlib.sha256((wachtwoord or "").encode("utf-8")).digest()


def hash_wachtwoord(wachtwoord: str) -> str:
    """Maak de hash die in de database komt te staan."""
    import bcrypt

    if not wachtwoord or len(wachtwoord) < 10:
        raise ValueError(
            "een wachtwoord van minder dan 10 tekens is te makkelijk te raden"
        )
    return bcrypt.hashpw(_voorbereid(wachtwoord), bcrypt.gensalt(RONDES)).decode()


def controleer_wachtwoord(wachtwoord: str, hash_waarde: Optional[str]) -> bool:
    """Klopt dit wachtwoord bij deze hash?

    Geeft ook netjes False bij een ontbrekende of kapotte hash, zodat een
    account zonder wachtwoord niet per ongeluk toegang geeft.
    """
    import bcrypt

    if not hash_waarde:
        return False
    try:
        return bcrypt.checkpw(_voorbereid(wachtwoord), hash_waarde.encode())
    except (ValueError, TypeError):
        return False


def nieuw_token() -> str:
    """Een sessietoken: 32 willekeurige bytes, als tekst."""
    return secrets.token_urlsafe(32)


def hash_token(token: str) -> str:
    """De vorm waarin een sessietoken in de database staat.

    Een sessietoken is een sleutel: wie hem heeft, is binnen. Daarom
    staat in de database alleen een hash, net als bij een wachtwoord.
    Snel hashen mag hier wel — een token van 32 willekeurige bytes valt
    niet te raden, dus traag maken heeft geen zin.
    """
    return hashlib.sha256(token.encode("utf-8")).hexdigest()


def nu() -> datetime:
    return datetime.now(timezone.utc)


def verlooptijd(uren: int = SESSIE_UREN) -> datetime:
    return nu() + timedelta(hours=uren)


def is_verlopen(verloopt_op: Optional[str], peil: Optional[datetime] = None) -> bool:
    """Is deze sessie over de houdbaarheidsdatum?"""
    if not verloopt_op:
        return True
    try:
        grens = datetime.fromisoformat(verloopt_op)
    except ValueError:
        return True
    if grens.tzinfo is None:
        grens = grens.replace(tzinfo=timezone.utc)
    return (peil or nu()) >= grens


def csrf_token() -> str:
    """Een token tegen kwaadaardige formulieren van een andere site."""
    return secrets.token_urlsafe(24)


def gelijk(links: Optional[str], rechts: Optional[str]) -> bool:
    """Vergelijk twee tokens zonder te verraden waar ze gaan verschillen."""
    if not links or not rechts:
        return False
    return secrets.compare_digest(links, rechts)
