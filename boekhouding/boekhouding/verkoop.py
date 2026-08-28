"""Verkoopfacturen: zelf een factuur opstellen en definitief maken.

Geen AI. Dit is invoer en rekenwerk: de eigenaar typt de regels, de code
rekent uit en controleert of de factuur voldoet aan wat de
Belastingdienst verplicht stelt.

De regels die hier gelden:

- **De bedragen worden nooit met de hand ingevoerd.** Je typt aantal en
  prijs per stuk; het regelbedrag, de btw en de totalen komen uit de code
  (Gouden regel 2). Zo kan er geen factuur de deur uit met een optelling
  die niet klopt.
- **Een nummer wordt pas toegekend bij het definitief maken.** Zou een
  concept al een nummer krijgen, dan ontstaat er een gat zodra iemand dat
  concept weggooit — en een gat in de nummering is precies waar de
  Belastingdienst naar kijkt.
- **Een definitieve factuur wordt nooit gewijzigd of verwijderd.** Een
  fout gaat eruit met een creditfactuur die naar het origineel verwijst.
  Een concept mag wél gewoon worden aangepast en weggegooid.
- **Ontbreekt er een verplicht gegeven, dan wordt de factuur niet
  definitief** — met de lijst erbij van wat er mist (Gouden regel 4).
"""

from datetime import date, timedelta
from decimal import Decimal, InvalidOperation, ROUND_HALF_UP
from typing import Any, Literal, Optional

from pydantic import BaseModel

from .btw_config import btw_percentages_voor_jaar
from .grootboek import Boekingsregel, BoekingVoorstel, controleer_balans
from .rekeningschema import Rekeningschema, rekeningschema_voor_jaar

NUL = Decimal("0.00")
CENT = Decimal("0.01")

# De standaard betalingstermijn van een nieuwe klant, in dagen.
STANDAARD_TERMIJN = 30

# Wat er op een verkoopfactuur moet staan volgens de Belastingdienst.
# Deze lijst is de reden dat een factuur niet definitief kan worden als
# er iets ontbreekt; de teksten komen op het scherm.
EIGEN_VELDEN = {
    "naam": "je eigen bedrijfsnaam",
    "adres": "je eigen adres",
    "plaats": "je eigen woonplaats",
    "btw_id": "je btw-identificatienummer",
}
KLANT_VELDEN = {
    "naam": "de naam van de klant",
    "adres": "het adres van de klant",
    "plaats": "de woonplaats van de klant",
}


def afronden(waarde: Decimal) -> Decimal:
    """Rond af op hele centen, zoals op een factuur.

    ROUND_HALF_UP: een halve cent gaat omhoog. Dat is wat mensen
    verwachten en wat op papier staat; Python rondt standaard naar even,
    en dan klopt de factuur niet met de handberekening van de klant.
    """
    return waarde.quantize(CENT, rounding=ROUND_HALF_UP)


def _getal(waarde: Any) -> Optional[Decimal]:
    if waarde is None or waarde == "":
        return None
    if isinstance(waarde, float):
        # Een float is hier net zo verboden als bij een inkoopfactuur.
        return None
    try:
        return Decimal(str(waarde).strip().replace(",", "."))
    except InvalidOperation:
        return None


class Regel(BaseModel):
    """Eén factuurregel, met de uitgerekende bedragen erbij."""

    volgnummer: int = 0
    omschrijving: str = ""
    aantal: Decimal = NUL
    prijs_per_stuk: Decimal = NUL
    btw_percentage: Decimal = NUL
    rekening: Optional[str] = None
    bedrag_excl: Decimal = NUL
    btw_bedrag: Decimal = NUL


class Totalen(BaseModel):
    """De totalen van een factuur, per btw-tarief uitgesplitst."""

    bedrag_excl: Decimal = NUL
    btw_bedrag: Decimal = NUL
    bedrag_incl: Decimal = NUL
    # {btw-percentage als tekst: (grondslag, btw)}
    per_tarief: dict[str, tuple[Decimal, Decimal]] = {}


def bereken_regel(gegeven: dict[str, Any], volgnummer: int = 0) -> Regel:
    """Reken één regel door: aantal × prijs, en de btw daarover.

    Ontbreekt of klopt er iets niet, dan blijft het bedrag nul. De
    controle op wat er mist doet `controleer_verplicht`; hier wordt
    alleen gerekend.
    """
    aantal = _getal(gegeven.get("aantal")) or NUL
    prijs = _getal(gegeven.get("prijs_per_stuk")) or NUL
    percentage = _getal(gegeven.get("btw_percentage")) or NUL

    bedrag_excl = afronden(aantal * prijs)
    return Regel(
        volgnummer=volgnummer or int(gegeven.get("volgnummer") or 0),
        omschrijving=str(gegeven.get("omschrijving") or "").strip(),
        aantal=aantal,
        prijs_per_stuk=prijs,
        btw_percentage=percentage,
        rekening=gegeven.get("rekening") or None,
        bedrag_excl=bedrag_excl,
        btw_bedrag=afronden(bedrag_excl * percentage / Decimal(100)),
    )


def bereken_totalen(regels: list[Regel]) -> Totalen:
    """Tel de regels op, per btw-tarief.

    De btw wordt per tarief berekend over het opgetelde bedrag, niet als
    som van de afgeronde regelbedragen. Anders loopt er per regel een
    halve cent weg en klopt het totaal op de factuur niet met wat de
    klant zelf uitrekent.
    """
    per_tarief: dict[str, list[Decimal]] = {}
    for regel in regels:
        sleutel = str(regel.btw_percentage.normalize())
        grondslag = per_tarief.setdefault(sleutel, [NUL, NUL])
        grondslag[0] += regel.bedrag_excl

    uitgesplitst: dict[str, tuple[Decimal, Decimal]] = {}
    totaal_excl = NUL
    totaal_btw = NUL
    for sleutel, (grondslag, _) in sorted(per_tarief.items()):
        btw = afronden(grondslag * Decimal(sleutel) / Decimal(100))
        uitgesplitst[sleutel] = (grondslag, btw)
        totaal_excl += grondslag
        totaal_btw += btw

    return Totalen(
        bedrag_excl=totaal_excl,
        btw_bedrag=totaal_btw,
        bedrag_incl=totaal_excl + totaal_btw,
        per_tarief=uitgesplitst,
    )


def vervaldatum(factuurdatum: date, betalingstermijn: int) -> date:
    return factuurdatum + timedelta(days=max(0, int(betalingstermijn)))


def controleer_verplicht(
    factuur: dict[str, Any],
    klant: Optional[dict[str, Any]],
    eigen: Optional[dict[str, Any]],
    regels: list[Regel],
) -> list[str]:
    """Wat ontbreekt er nog voordat deze factuur de deur uit kan?

    Een lege lijst betekent: compleet. De volgorde is die van de factuur
    zelf, zodat de lijst op het scherm meeleest met het formulier.
    """
    ontbreekt: list[str] = []

    datum = factuur.get("factuurdatum")
    if not datum:
        ontbreekt.append("de factuurdatum")
        boekjaar = None
    else:
        try:
            boekjaar = date.fromisoformat(str(datum)).year
        except ValueError:
            ontbreekt.append(f"een geldige factuurdatum ('{datum}' kan niet)")
            boekjaar = None

    for veld, omschrijving in EIGEN_VELDEN.items():
        if not (eigen or {}).get(veld):
            ontbreekt.append(omschrijving)
    for veld, omschrijving in KLANT_VELDEN.items():
        if not (klant or {}).get(veld):
            ontbreekt.append(omschrijving)

    if not regels:
        ontbreekt.append("minstens één factuurregel")

    toegestaan = btw_percentages_voor_jaar(boekjaar) if boekjaar else None
    for regel in regels:
        nummer = regel.volgnummer
        if not regel.omschrijving:
            ontbreekt.append(f"een omschrijving bij regel {nummer}")
        if regel.aantal == NUL:
            ontbreekt.append(f"een aantal bij regel {nummer}")
        if regel.prijs_per_stuk == NUL:
            ontbreekt.append(f"een prijs bij regel {nummer}")
        if toegestaan is not None and regel.btw_percentage not in toegestaan:
            tarieven = ", ".join(str(p.normalize()) for p in sorted(toegestaan))
            ontbreekt.append(
                f"een geldig btw-tarief bij regel {nummer} "
                f"({regel.btw_percentage.normalize()}% bestaat niet in "
                f"{boekjaar}; het mag {tarieven})"
            )
        elif toegestaan is None and boekjaar is not None:
            ontbreekt.append(
                f"een btw-config voor {boekjaar} (config/btw_{boekjaar}.json)"
            )
            break

    return ontbreekt


def volgend_nummer(jaar: int, hoogste: Optional[int]) -> tuple[int, str]:
    """Geef het volgende volgnummer en het factuurnummer voor dat jaar.

    Doorlopend per jaar, zonder gaten: 2026-0001, 2026-0002, … Het
    nummer wordt pas hier bepaald, op het moment van definitief maken.
    """
    volgnummer = (hoogste or 0) + 1
    return volgnummer, f"{jaar}-{volgnummer:04d}"


def stel_verkoopboeking_samen(
    factuur: dict[str, Any],
    regels: list[Regel],
    schema: Optional[Rekeningschema] = None,
) -> BoekingVoorstel:
    """Maak de boeking bij een definitief gemaakte verkoopfactuur.

        debiteuren        totaal incl.  debet
        omzet                           credit  (per rekening)
        te betalen btw                  credit  (per tarief)

    Welke omzetrekening erbij hoort komt uit het rekeningschema van dat
    boekjaar (`standaardrekeningen.omzet`, per btw-tarief) — of uit de
    rekening die de eigenaar zelf bij een regel heeft gezet. Er wordt
    dus niets geraden.
    """
    def weiger(*redenen: str) -> BoekingVoorstel:
        return BoekingVoorstel(status="geweigerd", redenen=list(redenen))

    datum = factuur.get("factuurdatum")
    try:
        boekdatum = date.fromisoformat(str(datum))
    except (TypeError, ValueError):
        return weiger(f"'{datum}' is geen geldige factuurdatum")

    if schema is None:
        schema = rekeningschema_voor_jaar(boekdatum.year)
    if schema is None:
        return weiger(
            f"er is geen rekeningschema voor boekjaar {boekdatum.year}"
        )
    if not regels:
        return weiger("een factuur zonder regels wordt niet geboekt")

    debiteuren = schema.standaard("debiteuren")
    totalen = bereken_totalen(regels)

    boekingsregels = [Boekingsregel(
        rekening=debiteuren,
        omschrijving=schema.zoek(debiteuren).omschrijving,
        debet=totalen.bedrag_incl,
    )]

    # De omzet per rekening, zodat twee tarieven op één factuur niet op
    # één hoop belanden.
    per_rekening: dict[str, Decimal] = {}
    for regel in regels:
        code = regel.rekening or schema.omzet_voor(
            str(regel.btw_percentage.normalize())
        )
        if code is None or schema.zoek(code) is None:
            return weiger(
                f"voor btw-tarief {regel.btw_percentage.normalize()}% staat geen "
                f"omzetrekening in het schema van {schema.jaar}; deze omzet "
                f"wordt niet op een willekeurige rekening geboekt"
            )
        per_rekening[code] = per_rekening.get(code, NUL) + regel.bedrag_excl

    for code, bedrag in sorted(per_rekening.items()):
        boekingsregels.append(Boekingsregel(
            rekening=code, omschrijving=schema.zoek(code).omschrijving,
            credit=bedrag,
        ))

    for tarief, (_, btw) in sorted(totalen.per_tarief.items()):
        if btw == NUL:
            continue
        code = schema.btw_verschuldigd_voor(tarief)
        if code is None or schema.zoek(code) is None:
            return weiger(
                f"voor btw-tarief {tarief}% staat geen rekening voor af te "
                f"dragen btw in het schema van {schema.jaar}"
            )
        boekingsregels.append(Boekingsregel(
            rekening=code, omschrijving=schema.zoek(code).omschrijving,
            credit=btw,
        ))

    redenen = controleer_balans(boekingsregels)
    if redenen:
        return weiger(*redenen)

    soort = factuur.get("soort") or "factuur"
    naam = (factuur.get("klant_naam") or "klant").strip()
    return BoekingVoorstel(
        status="gemaakt",
        regels=boekingsregels,
        boekdatum=boekdatum,
        omschrijving=(
            f"{'Creditfactuur' if soort == 'creditfactuur' else 'Verkoopfactuur'} "
            f"{factuur.get('factuurnummer') or ''} {naam}".strip()
        ),
    )
