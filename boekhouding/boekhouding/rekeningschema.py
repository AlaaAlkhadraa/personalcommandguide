"""Het rekeningschema per boekjaar, geladen uit een config-bestand.

Zoals de btw-tarieven staan ook de rekeningen niet in de code maar in
`config/rekeningen_<jaar>.json`. Verandert er iets aan het schema, dan
komt er een nieuw bestand voor dat jaar bij en blijft de code hetzelfde.

Twee regels die hier gelden:
- Er kan alleen op een rekening uit deze lijst worden geboekt. Een code
  die er niet in staat wordt geweigerd met reden; er wordt nooit een
  rekening bijgemaakt of geraden (Gouden regel 4, en de AI-regel dat het
  model alleen uit de bestaande lijst mag kiezen).
- Bestaat er geen bestand voor het boekjaar van een factuur, dan zegt
  deze module dat eerlijk (None) in plaats van het schema van een ander
  jaar te gebruiken.
"""

import json
from functools import lru_cache
from pathlib import Path
from typing import Literal, Optional

from pydantic import BaseModel

CONFIG_MAP = Path(__file__).parent / "config"

# De soorten die een rekening kan hebben. "btw" staat apart van activa en
# passiva omdat de btw-aangifte die rekeningen los moet kunnen vinden.
SOORTEN = ("kosten", "opbrengsten", "activa", "passiva", "btw")

# Welke soorten een mens mag kiezen als tegenrekening bij een factuur.
# De rest (bank, crediteuren, btw) vult de boeking zelf in.
KIESBARE_SOORTEN = ("kosten", "opbrengsten")


class Rekening(BaseModel):
    """Eén grootboekrekening uit het schema."""

    code: str
    rgs_code: str
    omschrijving: str
    soort: Literal["kosten", "opbrengsten", "activa", "passiva", "btw"]


class Rekeningschema(BaseModel):
    """Het hele schema van één boekjaar."""

    jaar: int
    rekeningen: dict[str, Rekening]
    # De rekeningen die de boeking zelf invult: crediteuren, debiteuren,
    # de voorbelasting en de af te dragen btw per tarief.
    standaardrekeningen: dict[str, object]

    def zoek(self, code: str) -> Optional[Rekening]:
        return self.rekeningen.get(code)

    def kiesbaar(self) -> list[Rekening]:
        """De rekeningen die een mens bij een factuur mag kiezen."""
        return [
            rekening for rekening in self.rekeningen.values()
            if rekening.soort in KIESBARE_SOORTEN
        ]

    def standaard(self, naam: str) -> Optional[str]:
        """Geef de code van een standaardrekening, of None."""
        waarde = self.standaardrekeningen.get(naam)
        return waarde if isinstance(waarde, str) else None

    def omzet_voor(self, percentage: str) -> Optional[str]:
        """Geef de omzetrekening bij dit btw-tarief, of None.

        Staat het tarief niet in de config, dan is None het juiste
        antwoord: dan wordt er geweigerd in plaats van op een
        willekeurige omzetrekening geboekt.
        """
        tabel = self.standaardrekeningen.get("omzet")
        if not isinstance(tabel, dict):
            return None
        waarde = tabel.get(percentage)
        return waarde if isinstance(waarde, str) else None

    def btw_verschuldigd_voor(self, percentage: str) -> Optional[str]:
        """Geef de rekening voor af te dragen btw bij dit tarief, of None.

        Bij 0% hoort geen btw-rekening; dan is None het juiste antwoord
        en maakt de boeking simpelweg geen btw-regel. Bij een tarief dat
        niet in de config staat is None óók juist: dan wordt de boeking
        geweigerd in plaats van op een willekeurige rekening geboekt.
        """
        tabel = self.standaardrekeningen.get("btw_verschuldigd")
        if not isinstance(tabel, dict):
            return None
        waarde = tabel.get(percentage)
        return waarde if isinstance(waarde, str) else None


@lru_cache(maxsize=None)
def rekeningschema_voor_jaar(jaar: int) -> Optional[Rekeningschema]:
    """Laad het rekeningschema van een boekjaar, of None als het ontbreekt."""
    pad = CONFIG_MAP / f"rekeningen_{jaar}.json"
    if not pad.is_file():
        return None
    with open(pad, encoding="utf-8") as bestand:
        data = json.load(bestand)

    rekeningen = {}
    for gegeven in data["rekeningen"]:
        rekening = Rekening(**gegeven)
        if rekening.code in rekeningen:
            raise ValueError(
                f"rekening {rekening.code} staat twee keer in "
                f"rekeningen_{jaar}.json"
            )
        rekeningen[rekening.code] = rekening

    schema = Rekeningschema(
        jaar=data["jaar"],
        rekeningen=rekeningen,
        standaardrekeningen=data["standaardrekeningen"],
    )
    ontbreekt = [
        naam for naam in ("crediteuren", "debiteuren", "btw_voorbelasting")
        if schema.standaard(naam) is None or schema.zoek(schema.standaard(naam)) is None
    ]
    if ontbreekt:
        raise ValueError(
            f"rekeningen_{jaar}.json mist bruikbare standaardrekeningen: "
            f"{', '.join(ontbreekt)}"
        )
    return schema
