"""Dubbel boekhouden: van goedgekeurde factuur naar boeking.

Een boeking bestaat uit regels die samen in balans zijn: alles wat aan
de ene kant staat (debet) staat ook aan de andere kant (credit). Een
inkoopfactuur van 121 euro met 21 euro btw wordt:

    kosten                100,00 debet
    te vorderen btw        21,00 debet
    crediteuren                        121,00 credit

Regels die hier gelden:
- **Exact in balans, geen tolerantie.** De factuurcontrole van module 1
  laat een afronding van een cent toe (±0,02), want dat komt op echte
  facturen voor. Een boeking niet: als debet en credit een cent
  verschillen klopt de administratie niet meer. Zo'n factuur wordt dus
  niet geboekt, met de reden erbij, en een mens zet het recht.
- **Nooit wijzigen of verwijderen.** Een fout wordt rechtgezet met een
  tegenboeking: dezelfde bedragen aan de andere kant, met een verwijzing
  naar de oorspronkelijke boeking. Beide blijven staan, en samen zijn ze
  nul.
- **Alleen rekeningen uit het schema van dat boekjaar.** Een code die er
  niet in staat wordt geweigerd; er wordt nooit een rekening geraden.
- **Er wordt niets bedacht.** Ontbreekt een bedrag of een rekening, dan
  ontstaat de boeking niet en staat er een reden bij (Gouden regel 4).
"""

from datetime import date
from decimal import Decimal, InvalidOperation
from typing import Any, Literal, Optional

from pydantic import BaseModel

from .rekeningschema import KIESBARE_SOORTEN, Rekeningschema, rekeningschema_voor_jaar

NUL = Decimal("0.00")


class Boekingsregel(BaseModel):
    """Eén regel van een boeking: een bedrag debet óf credit."""

    rekening: str
    omschrijving: str
    debet: Decimal = NUL
    credit: Decimal = NUL


class BoekingVoorstel(BaseModel):
    """Een samengestelde boeking, nog niet opgeslagen.

    status "gemaakt"    → de regels zijn in balans en kunnen worden bewaard
    status "geweigerd"  → er is geen boeking; waarom staat in redenen
    """

    status: Literal["gemaakt", "geweigerd"]
    redenen: list[str] = []
    regels: list[Boekingsregel] = []
    boekdatum: Optional[date] = None
    omschrijving: str = ""
    factuur_id: Optional[int] = None
    corrigeert_boeking_id: Optional[int] = None


def _bedrag(waarde: Any) -> Optional[Decimal]:
    """Lees een opgeslagen bedrag als Decimal, of None als dat niet kan."""
    if waarde is None or waarde == "":
        return None
    try:
        return Decimal(str(waarde))
    except InvalidOperation:
        return None


def som_debet(regels: list[Boekingsregel]) -> Decimal:
    return sum((regel.debet for regel in regels), NUL)


def som_credit(regels: list[Boekingsregel]) -> Decimal:
    return sum((regel.credit for regel in regels), NUL)


def controleer_balans(regels: list[Boekingsregel]) -> list[str]:
    """Geef de redenen waarom deze regels géén geldige boeking zijn.

    Een lege lijst betekent: in balans. Er wordt exact vergeleken, dus
    zonder de cent speling die de factuurcontrole wél toestaat.
    """
    redenen = []
    if not regels:
        return ["een boeking zonder regels bestaat niet"]

    for regel in regels:
        if regel.debet != NUL and regel.credit != NUL:
            redenen.append(
                f"regel op rekening {regel.rekening} staat zowel debet als "
                f"credit; een regel hoort aan één kant te staan"
            )
        if regel.debet == NUL and regel.credit == NUL:
            redenen.append(
                f"regel op rekening {regel.rekening} heeft geen bedrag"
            )

    debet, credit = som_debet(regels), som_credit(regels)
    if debet != credit:
        redenen.append(
            f"de boeking is niet in balans: debet {debet} tegenover credit "
            f"{credit}, een verschil van {debet - credit}. Een boeking moet "
            f"exact kloppen, ook op de cent"
        )
    return redenen


def _regel(rekening: str, omschrijving: str, bedrag: Decimal, kant: str) -> Boekingsregel:
    if kant == "debet":
        return Boekingsregel(rekening=rekening, omschrijving=omschrijving, debet=bedrag)
    return Boekingsregel(rekening=rekening, omschrijving=omschrijving, credit=bedrag)


def stel_boeking_samen(
    factuur: dict[str, Any],
    rekening_code: Optional[str],
    schema: Optional[Rekeningschema] = None,
) -> BoekingVoorstel:
    """Maak de boekingsregels bij een factuur; geeft nooit een exception.

    De gekozen rekening bepaalt wat voor boeking het wordt. Kiest de
    eigenaar een kostenrekening, dan is het een inkoopfactuur (btw te
    vorderen, schuld aan de leverancier). Kiest hij een
    opbrengstenrekening, dan is het een verkoopfactuur (btw af te dragen,
    vordering op de klant). Dat is dus geen gok van het systeem maar het
    gevolg van een keuze van een mens.
    """
    def weiger(*redenen: str) -> BoekingVoorstel:
        return BoekingVoorstel(
            status="geweigerd", redenen=list(redenen), factuur_id=factuur.get("id")
        )

    if not rekening_code:
        return weiger(
            "er is nog geen grootboekrekening gekozen; zonder rekening is niet "
            "te bepalen waar deze factuur thuishoort"
        )

    datum_tekst = factuur.get("factuurdatum")
    if not datum_tekst:
        return weiger("de factuur heeft geen factuurdatum, dus geen boekdatum")
    try:
        boekdatum = date.fromisoformat(str(datum_tekst))
    except ValueError:
        return weiger(f"de factuurdatum '{datum_tekst}' is geen geldige datum")

    if schema is None:
        schema = rekeningschema_voor_jaar(boekdatum.year)
    if schema is None:
        return weiger(
            f"er is geen rekeningschema voor boekjaar {boekdatum.year}; "
            f"voeg config/rekeningen_{boekdatum.year}.json toe"
        )

    rekening = schema.zoek(rekening_code)
    if rekening is None:
        return weiger(
            f"rekening '{rekening_code}' staat niet in het rekeningschema van "
            f"{schema.jaar}; er wordt niet op een onbekende rekening geboekt"
        )
    if rekening.soort not in KIESBARE_SOORTEN:
        return weiger(
            f"rekening {rekening.code} ({rekening.omschrijving}) is van soort "
            f"'{rekening.soort}'; bij een factuur hoort een kosten- of "
            f"opbrengstenrekening"
        )

    excl = _bedrag(factuur.get("bedrag_excl"))
    btw = _bedrag(factuur.get("btw_bedrag"))
    incl = _bedrag(factuur.get("bedrag_incl"))
    ontbreekt = [
        naam for naam, waarde in
        (("bedrag_excl", excl), ("btw_bedrag", btw), ("bedrag_incl", incl))
        if waarde is None
    ]
    if ontbreekt:
        return weiger(
            f"deze bedragen ontbreken of zijn onleesbaar: {', '.join(ontbreekt)}"
        )

    if excl + btw != incl:
        return weiger(
            f"de bedragen tellen niet exact op: {excl} + {btw} = {excl + btw}, "
            f"maar er staat {incl}. De factuurcontrole laat een cent afronding "
            f"toe, een boeking niet — corrigeer het bedrag eerst"
        )

    percentage = factuur.get("btw_percentage")
    omschrijving = _omschrijving(factuur)

    if rekening.soort == "kosten":
        regels = [_regel(rekening.code, rekening.omschrijving, excl, "debet")]
        if btw != NUL:
            voorbelasting = schema.standaard("btw_voorbelasting")
            regels.append(_regel(
                voorbelasting,
                schema.zoek(voorbelasting).omschrijving,
                btw,
                "debet",
            ))
        crediteuren = schema.standaard("crediteuren")
        regels.append(_regel(
            crediteuren, schema.zoek(crediteuren).omschrijving, incl, "credit"
        ))
    else:
        debiteuren = schema.standaard("debiteuren")
        regels = [_regel(
            debiteuren, schema.zoek(debiteuren).omschrijving, incl, "debet"
        )]
        regels.append(_regel(rekening.code, rekening.omschrijving, excl, "credit"))
        if btw != NUL:
            af_te_dragen = schema.btw_verschuldigd_voor(_tarief(percentage))
            if af_te_dragen is None or schema.zoek(af_te_dragen) is None:
                return weiger(
                    f"voor btw-tarief {percentage}% staat geen rekening voor af "
                    f"te dragen btw in het schema van {schema.jaar}; deze omzet "
                    f"wordt niet op een willekeurige rekening geboekt"
                )
            regels.append(_regel(
                af_te_dragen, schema.zoek(af_te_dragen).omschrijving, btw, "credit"
            ))

    redenen = controleer_balans(regels)
    if redenen:
        return weiger(*redenen)

    return BoekingVoorstel(
        status="gemaakt",
        regels=regels,
        boekdatum=boekdatum,
        omschrijving=omschrijving,
        factuur_id=factuur.get("id"),
    )


def _tarief(percentage: Any) -> str:
    """Maak van '21', '21.00' of Decimal('21') dezelfde sleutel '21'."""
    getal = _bedrag(percentage)
    if getal is None:
        return ""
    return str(getal.normalize())


def _omschrijving(factuur: dict[str, Any]) -> str:
    leverancier = factuur.get("leverancier") or "onbekende leverancier"
    nummer = factuur.get("factuurnummer")
    return f"{leverancier} {nummer}".strip() if nummer else leverancier


def stel_tegenboeking_samen(
    boeking: dict[str, Any], reden: str, boekdatum: Optional[date] = None
) -> BoekingVoorstel:
    """Maak de tegenboeking van een bestaande boeking.

    Elke regel gaat naar de andere kant: wat debet stond, staat credit en
    andersom. Samen zijn de twee boekingen nul, en beide blijven staan —
    de oorspronkelijke boeking wordt niet aangeraakt, want een boeking
    wordt nooit gewijzigd of verwijderd.

    De boekdatum is standaard die van de oorspronkelijke boeking, zodat
    de correctie in hetzelfde kwartaal valt. Is dat kwartaal al aangegeven
    bij de Belastingdienst, geef dan expliciet een datum in het lopende
    kwartaal mee.
    """
    if not reden.strip():
        return BoekingVoorstel(
            status="geweigerd",
            redenen=["een tegenboeking hoort een reden te hebben"],
        )

    regels = [
        Boekingsregel(
            rekening=regel["rekening"],
            omschrijving=regel["omschrijving"],
            debet=_bedrag(regel["credit"]) or NUL,
            credit=_bedrag(regel["debet"]) or NUL,
        )
        for regel in boeking["regels"]
    ]

    redenen = controleer_balans(regels)
    if redenen:
        return BoekingVoorstel(status="geweigerd", redenen=redenen)

    if boekdatum is None:
        boekdatum = date.fromisoformat(str(boeking["boekdatum"]))

    return BoekingVoorstel(
        status="gemaakt",
        regels=regels,
        boekdatum=boekdatum,
        omschrijving=f"Correctie van boeking {boeking['id']}: {reden.strip()}",
        corrigeert_boeking_id=boeking["id"],
    )
