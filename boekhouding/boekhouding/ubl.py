"""UBL / e-facturen lezen (module 4) — zonder AI.

Een e-factuur is XML: de velden staan er letterlijk in, met een naam
erbij. Er valt dus niets te herkennen, te raden of te extraheren. Dit
pad is daarmee nauwkeuriger dan zowel de tekstlaag als het model, en
het kost niets.

Wat hier geldt:
- Alleen lezen wat er staat. Ontbreekt een element, of staat er iets
  onverwachts, dan volgt "review_nodig" met reden — nooit een default
  (Gouden regel 4).
- De bedragen gaan daarna door dezelfde valideer_factuur als elke
  andere factuur. Ook een e-factuur wordt nagerekend (Gouden regel 2).
- XML wordt veilig gelezen: geen DTD, geen entiteiten, geen externe
  verwijzingen. Zie lees_xml_veilig.

Ondersteund: UBL 2.1 zoals gebruikt in NLCIUS en EN 16931, met
Invoice en CreditNote als hoofdelement.
"""

import xml.etree.ElementTree as ET
import xml.parsers.expat as expat
from decimal import Decimal, InvalidOperation
from pathlib import Path
from typing import Any, Literal, Optional

from pydantic import BaseModel

from .models import Factuur
from .validatie import valideer_factuur

# De naamruimten van UBL 2.1. Het hoofdelement bepaalt het soort
# document; cbc en cac zijn de bouwstenen waarin de velden staan.
NS_INVOICE = "urn:oasis:names:specification:ubl:schema:xsd:Invoice-2"
NS_CREDITNOTE = "urn:oasis:names:specification:ubl:schema:xsd:CreditNote-2"
CBC = "urn:oasis:names:specification:ubl:schema:xsd:CommonBasicComponents-2"
CAC = "urn:oasis:names:specification:ubl:schema:xsd:CommonAggregateComponents-2"

UBL_WORTELS = {
    f"{{{NS_INVOICE}}}Invoice": "factuur",
    f"{{{NS_CREDITNOTE}}}CreditNote": "creditnota",
}


class XmlOnveilig(Exception):
    """Het XML-bestand probeert iets wat we nooit toestaan."""


def _veilige_parser(bouwer: ET.TreeBuilder) -> "expat.XMLParserType":
    """Maak een expat-parser die elke DTD en elke entiteit weigert.

    Waarom dit nodig is, in gewone taal: XML kent "entiteiten", een soort
    afkortingen die je bovenaan het bestand kunt definiëren. Twee
    aanvallen maken daar misbruik van.

    1. XXE: een entiteit die naar een bestand of een netwerkadres wijst
       (`file:///etc/passwd`). De parser haalt die inhoud op en zet hem
       in het document. Zo laat een factuur die iemand je toestuurt de
       inhoud van je schijf weglekken.
    2. Een entiteit die zichzelf steeds herhaalt en exponentieel uitdijt
       ("billion laughs"). Een bestand van een paar regels vreet dan al
       het geheugen op.

    De standaardparser van Python haalt externe bestanden niet op, maar
    breidt interne entiteiten wél uit — de tweede aanval werkt daar dus
    gewoon. In plaats van per aanval een verdediging te bouwen weigeren
    we het hele stuk waarin entiteiten worden gedeclareerd: de DTD. Een
    UBL-factuur heeft nooit een DTD nodig, dus dat kost niets.

    Er wordt met expat gewerkt in plaats van met ET.XMLParser, omdat die
    laatste in CPython in C is geschreven en de handlers niet doorgeeft.
    """
    def weiger_dtd(naam, systeem_id, publiek_id, heeft_interne_subset):
        raise XmlOnveilig(
            "het bestand bevat een DTD (<!DOCTYPE ...>); dat staan we niet "
            "toe, omdat daar entiteiten in kunnen staan die bestanden of "
            "netwerkadressen opvragen"
        )

    def weiger_entiteit(*argumenten):
        raise XmlOnveilig("het bestand declareert een entiteit; niet toegestaan")

    def weiger_extern(*argumenten):
        raise XmlOnveilig(
            "het bestand verwijst naar een externe bron; niet toegestaan"
        )

    # De scheider '}' maakt van expat's "uri}naam" met een voorloopaccolade
    # precies de "{uri}naam" die ElementTree gebruikt.
    parser = expat.ParserCreate(None, "}")

    def haakjes(naam: str) -> str:
        return "{" + naam if "}" in naam else naam

    def begin(naam, kenmerken):
        bouwer.start(
            haakjes(naam), {haakjes(k): v for k, v in kenmerken.items()}
        )

    parser.StartElementHandler = begin
    parser.EndElementHandler = lambda naam: bouwer.end(haakjes(naam))
    parser.CharacterDataHandler = bouwer.data
    parser.StartDoctypeDeclHandler = weiger_dtd
    parser.EntityDeclHandler = weiger_entiteit
    parser.UnparsedEntityDeclHandler = weiger_entiteit
    parser.ExternalEntityRefHandler = weiger_extern
    return parser


def lees_xml_veilig(inhoud: bytes) -> ET.Element:
    """Lees XML zonder DTD en zonder entiteiten; geef het hoofdelement.

    Gooit XmlOnveilig bij een aanvalspoging en ET.ParseError bij kapotte
    XML. De aanroeper vertaalt dat naar review_nodig.
    """
    bouwer = ET.TreeBuilder()
    parser = _veilige_parser(bouwer)
    try:
        parser.Parse(inhoud, True)
    except expat.ExpatError as fout:
        # Als één fouttype naar buiten, zodat de aanroeper er maar één
        # hoeft te kennen.
        raise ET.ParseError(str(fout)) from fout
    return bouwer.close()


class UblResultaat(BaseModel):
    """Uitkomst van het lezen van een e-factuur."""

    status: Literal["gelezen", "review_nodig"]
    redenen: list[str] = []
    velden: dict[str, str] = {}
    documentsoort: Optional[str] = None
    bestandsnaam: str = ""


def _tekst(element: Optional[ET.Element]) -> Optional[str]:
    if element is None or element.text is None:
        return None
    waarde = element.text.strip()
    return waarde or None


def _bedrag(waarde: Optional[str]) -> Optional[str]:
    """Controleer dat een bedrag een getal is; geef het onveranderd terug.

    UBL schrijft de punt als decimaalteken voor. We rekenen hier niets
    om en niets uit: we controleren alleen dat het een getal is, zodat
    een onzinwaarde niet stilletjes doorgaat.
    """
    if waarde is None:
        return None
    try:
        Decimal(waarde)
    except InvalidOperation:
        return None
    return waarde


def is_ubl(wortel: ET.Element) -> Optional[str]:
    """Geef 'factuur' of 'creditnota' als dit een UBL-document is."""
    return UBL_WORTELS.get(wortel.tag)


def lees_ubl_element(wortel: ET.Element, bestandsnaam: str = "") -> UblResultaat:
    """Haal de factuurvelden uit een ingelezen UBL-document."""
    soort = is_ubl(wortel)
    if soort is None:
        return UblResultaat(
            status="review_nodig",
            redenen=[
                f"het hoofdelement '{wortel.tag}' is geen UBL Invoice of "
                f"CreditNote; dit bestand wordt niet als e-factuur gelezen"
            ],
            bestandsnaam=bestandsnaam,
        )

    redenen: list[str] = []
    velden: dict[str, str] = {}

    def leg_vast(naam: str, waarde: Optional[str], waar: str) -> None:
        if waarde is None:
            redenen.append(f"{naam} ontbreekt in het bestand (verwacht bij {waar})")
        else:
            velden[naam] = waarde

    leg_vast("factuurnummer", _tekst(wortel.find(f"{{{CBC}}}ID")), "cbc:ID")
    leg_vast(
        "factuurdatum", _tekst(wortel.find(f"{{{CBC}}}IssueDate")), "cbc:IssueDate"
    )

    # Leverancier: eerst de handelsnaam, anders de statutaire naam.
    partij = wortel.find(
        f"{{{CAC}}}AccountingSupplierParty/{{{CAC}}}Party"
    )
    naam = None
    if partij is not None:
        naam = _tekst(partij.find(f"{{{CAC}}}PartyName/{{{CBC}}}Name")) or _tekst(
            partij.find(f"{{{CAC}}}PartyLegalEntity/{{{CBC}}}RegistrationName")
        )
    leg_vast(
        "leverancier", naam,
        "cac:AccountingSupplierParty/cac:Party/cac:PartyName/cbc:Name",
    )

    totalen = wortel.find(f"{{{CAC}}}LegalMonetaryTotal")
    excl = incl = None
    if totalen is not None:
        excl = _bedrag(_tekst(totalen.find(f"{{{CBC}}}TaxExclusiveAmount")))
        incl = _bedrag(_tekst(totalen.find(f"{{{CBC}}}TaxInclusiveAmount")))
    leg_vast("bedrag_excl", excl, "cac:LegalMonetaryTotal/cbc:TaxExclusiveAmount")
    leg_vast("bedrag_incl", incl, "cac:LegalMonetaryTotal/cbc:TaxInclusiveAmount")

    # Btw: meerdere TaxSubtotal betekent meerdere tarieven op één factuur.
    subtotalen = wortel.findall(f"{{{CAC}}}TaxTotal/{{{CAC}}}TaxSubtotal")
    if len(subtotalen) > 1:
        tarieven = [
            _tekst(s.find(f"{{{CAC}}}TaxCategory/{{{CBC}}}Percent")) or "?"
            for s in subtotalen
        ]
        redenen.append(
            f"de factuur heeft {len(subtotalen)} btw-tarieven ({', '.join(tarieven)}%); "
            f"het schema kent er één, dus de verdeling moet met de hand worden "
            f"beoordeeld — er wordt niets bij elkaar opgeteld"
        )
    elif len(subtotalen) == 0:
        redenen.append(
            "geen btw-gegevens gevonden (verwacht bij cac:TaxTotal/cac:TaxSubtotal)"
        )
    else:
        subtotaal = subtotalen[0]
        leg_vast(
            "btw_bedrag",
            _bedrag(_tekst(subtotaal.find(f"{{{CBC}}}TaxAmount"))),
            "cac:TaxSubtotal/cbc:TaxAmount",
        )
        leg_vast(
            "btw_percentage",
            _tekst(subtotaal.find(f"{{{CAC}}}TaxCategory/{{{CBC}}}Percent")),
            "cac:TaxCategory/cbc:Percent",
        )

    # Een creditnota heeft in UBL positieve bedragen; het documentsoort
    # draagt het minteken. Ons schema kent geen documentsoort, dus dat
    # zetten we niet zelf om: dan zou een teruggave als kosten worden
    # geboekt. De mens beslist (Gouden regel 1).
    if soort == "creditnota":
        redenen.append(
            "dit is een creditnota; UBL noteert de bedragen positief terwijl "
            "ze als negatief geboekt horen te worden — controleer de tekens "
            "voordat dit wordt vastgelegd"
        )

    return UblResultaat(
        status="gelezen" if not redenen else "review_nodig",
        redenen=redenen,
        velden=velden,
        documentsoort=soort,
        bestandsnaam=bestandsnaam,
    )


def lees_ubl(pad: str | Path) -> UblResultaat:
    """Lees een UBL-bestand van schijf; geeft nooit een exception."""
    pad = Path(pad)
    if not pad.is_file():
        return UblResultaat(
            status="review_nodig",
            redenen=[f"bestand niet gevonden: {pad}"],
            bestandsnaam=pad.name,
        )
    return lees_ubl_bytes(pad.read_bytes(), pad.name)


def lees_ubl_bytes(inhoud: bytes, bestandsnaam: str = "") -> UblResultaat:
    """Lees UBL uit bytes (ook gebruikt voor XML uit een PDF-bijlage)."""
    try:
        wortel = lees_xml_veilig(inhoud)
    except XmlOnveilig as fout:
        return UblResultaat(
            status="review_nodig",
            redenen=[f"onveilige XML geweigerd: {fout}"],
            bestandsnaam=bestandsnaam,
        )
    except ET.ParseError as fout:
        return UblResultaat(
            status="review_nodig",
            redenen=[f"het XML-bestand is niet leesbaar: {fout}"],
            bestandsnaam=bestandsnaam,
        )
    except Exception as fout:  # nooit een exception naar buiten
        return UblResultaat(
            status="review_nodig",
            redenen=[f"kon het XML-bestand niet lezen: {type(fout).__name__}: {fout}"],
            bestandsnaam=bestandsnaam,
        )
    return lees_ubl_element(wortel, bestandsnaam)


class EfactuurResultaat(BaseModel):
    """Een gelezen e-factuur, nagerekend door de validatie van module 1."""

    status: Literal["gevalideerd", "review_nodig"]
    redenen: list[str] = []
    factuur: Optional[Factuur] = None
    velden: dict[str, str] = {}
    documentsoort: Optional[str] = None
    bron: Literal["xml", "pdf-bijlage"] = "xml"
    bestandsnaam: str = ""


def beoordeel_ubl(
    gelezen: UblResultaat, *, vandaag=None, is_duplicaat=None
) -> EfactuurResultaat:
    """Reken een gelezen e-factuur na met valideer_factuur.

    De redenen uit het lezen (ontbrekend element, meerdere btw-tarieven,
    creditnota) en de redenen uit de validatie (optelling, btw, datum,
    duplicaat) komen samen. Eén reden is genoeg voor review.
    """
    redenen = list(gelezen.redenen)
    resultaat = valideer_factuur(
        gelezen.velden, vandaag=vandaag, is_duplicaat=is_duplicaat
    )
    redenen.extend(resultaat.redenen)

    return EfactuurResultaat(
        status="gevalideerd" if not redenen else "review_nodig",
        redenen=redenen,
        factuur=resultaat.factuur,
        velden=gelezen.velden,
        documentsoort=gelezen.documentsoort,
        bestandsnaam=gelezen.bestandsnaam,
    )


def verwerk_efactuur(
    pad: str | Path, *, vandaag=None, is_duplicaat=None
) -> EfactuurResultaat:
    """Lees een e-factuur en reken hem na; geeft nooit een exception.

    Werkt zowel voor een los XML-bestand als voor een PDF met een
    ingebedde e-factuur (Factur-X / ZUGFeRD). In dat laatste geval
    wordt de XML uit de bijlage gelezen, want die is betrouwbaarder dan
    de tekstlaag.
    """
    from .routering import zoek_ingebedde_efactuur

    pad = Path(pad)
    if not pad.is_file():
        return EfactuurResultaat(
            status="review_nodig",
            redenen=[f"bestand niet gevonden: {pad}"],
            bestandsnaam=pad.name,
        )

    inhoud = pad.read_bytes()
    bron = "xml"
    if inhoud.startswith(b"%PDF-"):
        ingebed = zoek_ingebedde_efactuur(pad)
        if ingebed is None:
            return EfactuurResultaat(
                status="review_nodig",
                redenen=["deze PDF bevat geen ingebedde e-factuur"],
                bestandsnaam=pad.name,
            )
        inhoud, bron = ingebed, "pdf-bijlage"

    resultaat = beoordeel_ubl(
        lees_ubl_bytes(inhoud, pad.name),
        vandaag=vandaag,
        is_duplicaat=is_duplicaat,
    )
    return resultaat.model_copy(update={"bron": bron})
