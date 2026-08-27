"""Volledigheidscontroles: merken wat er níét is.

De btw-aangifte blokkeert op facturen die er zijn maar nog niet rond
zijn. Het gevaarlijkste geval zit daar niet bij: een factuur die de
klant nooit heeft aangeleverd. Die staat nergens, dus er is niets om
op te blokkeren, en de aangifte rekent een te laag bedrag uit dat er
volkomen correct uitziet.

Deze module kijkt daarom naar het patroon in plaats van naar de
facturen zelf: wie kwam er elke maand en ontbreekt nu, welke
factuurnummers zijn overgeslagen, en zijn het er ineens veel minder dan
anders.

Drie dingen gelden hier:

- **Het zijn signalen, geen fouten.** Ze blokkeren niets. Een
  leverancier kan opgezegd zijn, een nummer kan bij een andere klant
  horen, een kwartaal kan gewoon rustig zijn geweest.
- **Elke melding is een vraag, geen conclusie.** "KPN staat sinds maart
  elke maand op de lijst maar ontbreekt dit kwartaal — is die factuur er
  wel?" Het systeem weet niet wat er ontbreekt; de eigenaar wel.
- **Alle facturen tellen mee**, ook die nog nagekeken of goedgekeurd
  moeten worden. De vraag is hier of iets is aangeleverd, niet of het al
  is verwerkt.
"""

import re
import sqlite3
from datetime import date
from decimal import Decimal
from typing import Any, Literal, Optional

from pydantic import BaseModel

# Hoeveel maanden vóór het kwartaal een leverancier gezien moet zijn om
# überhaupt mee te tellen. Wie langer dan een half jaar weg is, is geen
# vraag meer waard.
MAANDEN_TERUG = 6

# Hoe ver we terugkijken om de reeks zélf te bepalen. Dit staat los van
# het venster hierboven: staat een leverancier al twee jaar elke maand
# op de lijst, dan hoort de melding dat ook te zeggen en niet "sinds"
# de rand van het venster.
MAANDEN_HISTORIE = 24

# Hoeveel maanden op rij een leverancier moet zijn langsgekomen voordat
# we hem "maandelijks" noemen. Twee maanden is toeval, drie is een
# patroon.
MINIMAAL_OP_RIJ = 3

# Hoeveel kwartalen we vergelijken bij het aantal facturen, en vanaf
# welk gemiddelde dat zinnig is. Bij een gemiddelde van twee facturen
# zegt een verschil van één niets.
KWARTALEN_TERUG = 4
MINIMAAL_GEMIDDELDE = Decimal("3")

# Eén kwartaal is geen vergelijking: dan is elk verschil "afwijkend".
# Pas vanaf twee kwartalen historie zeggen we er iets van.
MINIMAAL_KWARTALEN = 2

# Wanneer een aantal "een groot verschil" is: minder dan 60% of meer dan
# 150% van het gemiddelde.
ONDERGRENS = Decimal("0.6")
BOVENGRENS = Decimal("1.5")

# Hoeveel ontbrekende factuurnummers we hoogstens opsommen voordat we
# er een bereik van maken.
MAX_NUMMERS = 8

MAANDNAMEN = (
    "januari", "februari", "maart", "april", "mei", "juni",
    "juli", "augustus", "september", "oktober", "november", "december",
)

# Een factuurnummer dat op cijfers eindigt: "F-2026-001" wordt
# ("F-2026-", "001"). Alleen zo'n nummer kan een gat hebben.
NUMMERPATROON = re.compile(r"^(.*?)(\d+)$")


class Signaal(BaseModel):
    """Eén vraag aan de eigenaar. Blokkeert niets."""

    soort: Literal["ontbrekende_leverancier", "gat_in_nummers", "aantal_facturen"]
    vraag: str
    leverancier: Optional[str] = None
    laatste_factuurdatum: Optional[str] = None
    ontbrekende_nummers: list[str] = []


def _maandsleutel(datum: str) -> str:
    """'2026-03-17' wordt '2026-03'."""
    return datum[:7]


def _maanden_voor(van: date, aantal: int) -> list[str]:
    """De `aantal` maanden vóór deze datum, oudste eerst."""
    maanden = []
    jaar, maand = van.year, van.month
    for _ in range(aantal):
        maand -= 1
        if maand == 0:
            jaar, maand = jaar - 1, 12
        maanden.append(f"{jaar:04d}-{maand:02d}")
    return list(reversed(maanden))


def _kwartaal_grenzen(jaar: int, kwartaal: int) -> tuple[date, date]:
    from .btw_aangifte import kwartaal_grenzen

    return kwartaal_grenzen(jaar, kwartaal)


def _facturen(
    conn: sqlite3.Connection, administratie_id: int, van: date, tot: date
) -> list[dict[str, Any]]:
    """Alle facturen met een datum in deze periode, welke status ook."""
    cursor = conn.execute(
        """
        SELECT id, leverancier, factuurdatum, factuurnummer
        FROM facturen
        WHERE administratie_id = ?
          AND factuurdatum IS NOT NULL AND factuurdatum != ''
          AND factuurdatum >= ? AND factuurdatum <= ?
        ORDER BY factuurdatum, id
        """,
        (administratie_id, str(van), str(tot)),
    )
    kolommen = [k[0] for k in cursor.description]
    return [dict(zip(kolommen, rij)) for rij in cursor.fetchall()]


def _eerste_factuurdatum(
    conn: sqlite3.Connection, administratie_id: int
) -> Optional[str]:
    """De oudste factuurdatum in deze administratie, of None."""
    rij = conn.execute(
        "SELECT min(factuurdatum) FROM facturen "
        "WHERE administratie_id = ? AND factuurdatum IS NOT NULL "
        "AND factuurdatum != ''",
        (administratie_id,),
    ).fetchone()
    return rij[0]


def _naam(leverancier: Optional[str]) -> str:
    return (leverancier or "").strip()


# --- 1. leveranciers die ineens ontbreken -------------------------------

def ontbrekende_leveranciers(
    conn: sqlite3.Connection, administratie_id: int, van: date, tot: date
) -> list[Signaal]:
    """Wie kwam er elke maand langs en ontbreekt dit kwartaal?

    We kijken naar de maanden vlak vóór het kwartaal en zoeken per
    leverancier de reeks maanden op rij waarin hij voorkwam, eindigend
    in de laatste maand vóór het kwartaal. Is die reeks lang genoeg en
    staat hij dit kwartaal nergens, dan is dat een vraag waard.
    """
    maanden = _maanden_voor(van, MAANDEN_HISTORIE)
    if not maanden:
        return []
    # De laatste maanden van dat venster: alleen wie hier voorkwam is een
    # vraag waard.
    recent = set(maanden[-MAANDEN_TERUG:])

    eerste_maand = date(int(maanden[0][:4]), int(maanden[0][5:7]), 1)
    eerder = _facturen(conn, administratie_id, eerste_maand, van)
    # `van` zelf hoort al bij het kwartaal, dus die dag valt af.
    eerder = [f for f in eerder if f["factuurdatum"] < str(van)]
    nu = {_naam(f["leverancier"]) for f in _facturen(conn, administratie_id, van, tot)}

    per_leverancier: dict[str, dict[str, str]] = {}
    for factuur in eerder:
        naam = _naam(factuur["leverancier"])
        if not naam:
            continue
        maand = _maandsleutel(factuur["factuurdatum"])
        gezien = per_leverancier.setdefault(naam, {})
        # Per maand de laatste factuurdatum bewaren.
        if maand not in gezien or factuur["factuurdatum"] > gezien[maand]:
            gezien[maand] = factuur["factuurdatum"]

    signalen = []
    for naam, gezien in sorted(per_leverancier.items()):
        if naam in nu:
            continue

        if not (recent & set(gezien)):
            continue

        # Tel terug vanaf de laatste maand vóór het kwartaal zolang er
        # elke maand een factuur was. Dat kan verder terug lopen dan het
        # venster van MAANDEN_TERUG, en dan zegt de melding dat ook.
        op_rij = 0
        for maand in reversed(maanden):
            if maand not in gezien:
                break
            op_rij += 1
        if op_rij < MINIMAAL_OP_RIJ:
            continue

        start = maanden[len(maanden) - op_rij]
        laatste = max(gezien.values())
        signalen.append(Signaal(
            soort="ontbrekende_leverancier",
            leverancier=naam,
            laatste_factuurdatum=laatste,
            vraag=(
                f"{naam} staat sinds {MAANDNAMEN[int(start[5:7]) - 1]} "
                f"{start[:4]} elke maand op de lijst maar ontbreekt dit "
                f"kwartaal (laatste factuur {laatste}) — is die factuur er wel?"
            ),
        ))
    return signalen


# --- 2. gaten in een reeks factuurnummers -------------------------------

def _splits_nummer(nummer: Optional[str]) -> Optional[tuple[str, int, int]]:
    """Splits 'F-2026-001' in ('F-2026-', 1, 3): voorloop, getal, breedte."""
    if not nummer:
        return None
    treffer = NUMMERPATROON.match(nummer.strip())
    if treffer is None:
        return None
    cijfers = treffer.group(2)
    return treffer.group(1), int(cijfers), len(cijfers)


def gaten_in_factuurnummers(
    conn: sqlite3.Connection, administratie_id: int, van: date, tot: date
) -> list[Signaal]:
    """Welke nummers zijn overgeslagen in een oplopende reeks?

    Per leverancier en per voorloop ("F-2026-") worden de nummers van dit
    kwartaal op een rij gezet. Zit er een gat tussen het laagste en het
    hoogste nummer, dan is dat een vraag waard.

    Dit werkt alleen bij een leverancier die per klant doornummert, en
    bij je eigen verkoopfacturen. Nummert een leverancier over al zijn
    klanten heen, dan zijn gaten normaal — vandaar dat dit een vraag is
    en geen fout.
    """
    reeksen: dict[tuple[str, str], list[tuple[int, int]]] = {}
    for factuur in _facturen(conn, administratie_id, van, tot):
        naam = _naam(factuur["leverancier"])
        gesplitst = _splits_nummer(factuur["factuurnummer"])
        if not naam or gesplitst is None:
            continue
        voorloop, getal, breedte = gesplitst
        reeksen.setdefault((naam, voorloop), []).append((getal, breedte))

    signalen = []
    for (naam, voorloop), nummers in sorted(reeksen.items()):
        if len(nummers) < 2:
            continue
        aanwezig = {getal for getal, _ in nummers}
        breedte = min(b for _, b in nummers)
        ontbreekt = sorted(set(range(min(aanwezig), max(aanwezig) + 1)) - aanwezig)
        if not ontbreekt:
            continue

        namen = [f"{voorloop}{getal:0{breedte}d}" for getal in ontbreekt]
        if len(namen) <= MAX_NUMMERS:
            opsomming = ", ".join(namen)
        else:
            opsomming = (
                f"{len(namen)} nummers tussen {namen[0]} en {namen[-1]}"
            )
        signalen.append(Signaal(
            soort="gat_in_nummers",
            leverancier=naam,
            ontbrekende_nummers=namen,
            vraag=(
                f"Bij {naam} loopt de nummering door maar ontbreekt "
                f"{opsomming} — {'is die factuur' if len(namen) == 1 else 'zijn die facturen'} "
                f"er wel?"
            ),
        ))
    return signalen


# --- 3. ineens veel minder (of meer) facturen ---------------------------

def afwijkend_aantal(
    conn: sqlite3.Connection, administratie_id: int, jaar: int, kwartaal: int
) -> list[Signaal]:
    """Staan er dit kwartaal ineens veel minder facturen dan normaal?

    Vergeleken wordt met het gemiddelde van de vorige vier kwartalen.
    Bij een laag gemiddelde zegt een verschil niets, dus dan houden we
    onze mond.
    """
    van, tot = _kwartaal_grenzen(jaar, kwartaal)
    nu = len(_facturen(conn, administratie_id, van, tot))

    # Kwartalen van vóór de allereerste factuur tellen niet mee. Anders
    # krijgt iemand die net begonnen is meteen de melding dat het er
    # "een stuk meer" zijn dan de kwartalen waarin de administratie nog
    # niet bestond.
    begin = _eerste_factuurdatum(conn, administratie_id)

    aantallen = []
    vorig_jaar, vorig_kwartaal = jaar, kwartaal
    for _ in range(KWARTALEN_TERUG):
        vorig_kwartaal -= 1
        if vorig_kwartaal == 0:
            vorig_jaar, vorig_kwartaal = vorig_jaar - 1, 4
        eerder_van, eerder_tot = _kwartaal_grenzen(vorig_jaar, vorig_kwartaal)
        if begin is None or str(eerder_tot) < begin:
            continue
        aantallen.append(len(_facturen(conn, administratie_id, eerder_van, eerder_tot)))

    if len(aantallen) < MINIMAAL_KWARTALEN:
        return []

    gemiddelde = Decimal(sum(aantallen)) / Decimal(len(aantallen))
    if gemiddelde < MINIMAAL_GEMIDDELDE:
        return []

    if ONDERGRENS * gemiddelde <= nu <= BOVENGRENS * gemiddelde:
        return []

    afgerond = gemiddelde.quantize(Decimal("0.1"))
    richting = "minder" if nu < gemiddelde else "meer"
    return [Signaal(
        soort="aantal_facturen",
        vraag=(
            f"Dit kwartaal staan er {nu} factu{'ur' if nu == 1 else 'ren'}; "
            f"de vorige {len(aantallen)} kwartalen waren het er gemiddeld "
            f"{afgerond}. Dat is een stuk {richting} — is alles aangeleverd?"
        ),
    )]


def zoek_signalen(
    conn: sqlite3.Connection, administratie_id: int, jaar: int, kwartaal: int
) -> list[Signaal]:
    """Alle volledigheidssignalen voor één kwartaal, in leesvolgorde."""
    van, tot = _kwartaal_grenzen(jaar, kwartaal)
    return (
        ontbrekende_leveranciers(conn, administratie_id, van, tot)
        + gaten_in_factuurnummers(conn, administratie_id, van, tot)
        + afwijkend_aantal(conn, administratie_id, jaar, kwartaal)
    )
