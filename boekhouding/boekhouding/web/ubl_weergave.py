"""Een e-factuur leesbaar tonen in het reviewscherm.

Dit is puur weergave. Er wordt niets gerekend, niets gecorrigeerd en
niets opgeslagen: het bewaarde bestand blijft byte voor byte wat de
leverancier stuurde, want dat is wat de bewaarplicht en de audit trail
leidend maken.

Waarom dit nodig is: het reviewscherm bestaat om te vergelijken. Links
hoort te staan wat de leverancier stuurde, rechts wat het systeem eruit
heeft gehaald. Bij een PDF gaat dat vanzelf, maar een e-factuur is XML,
en die toonde de browser als een muur ruwe tekst vol naamruimten. Daar
valt niets mee te vergelijken.

Wat hier gebeurt is dus: dezelfde XML, maar dan als leesbare regels, met
bij elk veld de UBL-plek waar het vandaan komt ("Factuurdatum
(cbc:IssueDate): 2026-08-04"). Die herkomst staat erbij omdat een
leverancier zijn eigen indeling kiest: zie je waar een waarde vandaan
komt, dan zie je ook waarom het systeem hem zo heeft gelezen. De ruwe
XML blijft één klik weg.

De XML wordt hier met dezelfde veilige lezer geopend als in module 4:
geen DTD, geen entiteiten, geen externe verwijzingen. Een aanval mag
niet alsnog langs de weergavelaag binnenkomen.
"""

import xml.etree.ElementTree as ET
from typing import Literal, Optional

from pydantic import BaseModel

from ..ubl import CAC, CBC, XmlOnveilig, is_ubl, lees_xml_veilig

# Hoeveel ruwe XML we hoogstens in de pagina zetten. Een e-factuur is
# een paar kilobyte; is het bestand veel groter, dan tonen we het begin
# en verwijzen we naar het origineel. Anders zou één raar bestand de
# reviewpagina onbruikbaar traag maken.
MAX_TOON_BYTES = 100 * 1024

# De voorvoegsels die in een herkomstpad mogen staan.
NAAMRUIMTEN = {"cbc": CBC, "cac": CAC}

SOORTNAMEN = {
    "factuur": "Factuur (UBL Invoice)",
    "creditnota": "Creditnota (UBL CreditNote)",
}

# De velden per groep, in de volgorde waarin ze op een factuur staan.
# Per veld: het label op het scherm, waar het in UBL staat, en of het
# een kernveld is.
#
# Een kernveld is een veld dat het systeem zelf uitleest en rechts in
# het formulier zet. Die regel staat er altijd, ook als hij ontbreekt —
# dan juist: dat een verplicht veld er niet in staat, is precies wat de
# mens moet zien. De overige velden staan er alleen als ze in het
# bestand voorkomen, anders wordt het scherm een lijst lege regels.
#
# Sommige velden mogen op twee plekken staan; dan staan beide paden
# hier, in dezelfde volgorde waarin module 4 ze ook probeert.
GROEPEN: list[tuple[str, list[tuple[str, tuple[str, ...], bool]]]] = [
    ("Kop", [
        ("Factuurnummer", ("cbc:ID",), True),
        ("Factuurdatum", ("cbc:IssueDate",), True),
        ("Vervaldatum", ("cbc:DueDate",), False),
        ("Valuta", ("cbc:DocumentCurrencyCode",), False),
        ("Toelichting", ("cbc:Note",), False),
    ]),
    ("Leverancier", [
        ("Naam", (
            "cac:AccountingSupplierParty/cac:Party/cac:PartyName/cbc:Name",
            "cac:AccountingSupplierParty/cac:Party/cac:PartyLegalEntity"
            "/cbc:RegistrationName",
        ), True),
        ("Btw-nummer", (
            "cac:AccountingSupplierParty/cac:Party/cac:PartyTaxScheme"
            "/cbc:CompanyID",
        ), False),
        ("Handelsregister", (
            "cac:AccountingSupplierParty/cac:Party/cac:PartyLegalEntity"
            "/cbc:CompanyID",
        ), False),
        ("Plaats", (
            "cac:AccountingSupplierParty/cac:Party/cac:PostalAddress"
            "/cbc:CityName",
        ), False),
    ]),
    ("Afnemer", [
        ("Naam", (
            "cac:AccountingCustomerParty/cac:Party/cac:PartyName/cbc:Name",
            "cac:AccountingCustomerParty/cac:Party/cac:PartyLegalEntity"
            "/cbc:RegistrationName",
        ), False),
    ]),
    ("Bedragen", [
        ("Som van de regels", (
            "cac:LegalMonetaryTotal/cbc:LineExtensionAmount",
        ), False),
        ("Bedrag excl. btw", (
            "cac:LegalMonetaryTotal/cbc:TaxExclusiveAmount",
        ), True),
        ("Totaal incl. btw", (
            "cac:LegalMonetaryTotal/cbc:TaxInclusiveAmount",
        ), True),
        ("Te betalen", ("cac:LegalMonetaryTotal/cbc:PayableAmount",), False),
    ]),
    ("Betaling", [
        ("IBAN", (
            "cac:PaymentMeans/cac:PayeeFinancialAccount/cbc:ID",
        ), False),
        ("Betalingskenmerk", ("cac:PaymentMeans/cbc:PaymentID",), False),
    ]),
]

# De factuurregels heten anders in een creditnota dan in een factuur.
REGELELEMENT = {"factuur": "InvoiceLine", "creditnota": "CreditNoteLine"}
AANTALELEMENT = {"factuur": "InvoicedQuantity", "creditnota": "CreditedQuantity"}


class Rij(BaseModel):
    """Eén veld uit de e-factuur, zoals het op het scherm komt."""

    label: str
    herkomst: str
    waarde: Optional[str] = None
    kern: bool = False


class Groep(BaseModel):
    titel: str
    rijen: list[Rij]


class Regel(BaseModel):
    """Eén factuurregel."""

    nummer: Optional[str] = None
    omschrijving: Optional[str] = None
    aantal: Optional[str] = None
    btw_percentage: Optional[str] = None
    bedrag: Optional[str] = None


class Weergave(BaseModel):
    """Wat het reviewscherm van een e-factuur laat zien."""

    status: Literal["leesbaar", "onleesbaar"]
    reden: str = ""
    documentsoort: Optional[str] = None
    soortnaam: str = ""
    groepen: list[Groep] = []
    regels: list[Regel] = []
    ruwe_xml: str = ""
    xml_afgekapt: bool = False


def _et_pad(herkomst: str) -> str:
    """Vertaal 'cac:Party/cbc:Name' naar het pad dat ElementTree wil.

    Zo hoeft de herkomst maar op één plek te staan: de tekst die de
    gebruiker ziet, is letterlijk het pad waarmee gezocht is. Ze kunnen
    dus niet uit elkaar gaan lopen.
    """
    stukken = []
    for stuk in herkomst.split("/"):
        voorvoegsel, _, naam = stuk.partition(":")
        stukken.append(f"{{{NAAMRUIMTEN[voorvoegsel]}}}{naam}")
    return "/".join(stukken)


def _tekst(element: Optional[ET.Element]) -> Optional[str]:
    if element is None or element.text is None:
        return None
    return element.text.strip() or None


def _zoek(wortel: ET.Element, herkomsten: tuple[str, ...]) -> tuple[Optional[str], str]:
    """Zoek de eerste plek waar dit veld staat; geef (waarde, herkomst).

    Staat het nergens, dan komt de eerste (meest gebruikelijke) plek
    terug, zodat het scherm kan tonen wáár het gemist wordt.
    """
    for herkomst in herkomsten:
        waarde = _tekst(wortel.find(_et_pad(herkomst)))
        if waarde is not None:
            return waarde, herkomst
    return None, herkomsten[0]


def _btw_groep(wortel: ET.Element) -> Groep:
    """Bouw de btw-groep; bij meerdere tarieven komen ze allemaal in beeld.

    Er wordt hier bewust niets opgeteld en niets gekozen. Staan er twee
    tarieven op één factuur, dan ziet de mens ze allebei staan — dat is
    dezelfde boodschap die module 4 als reden meegeeft, maar dan met de
    getallen erbij.
    """
    subtotalen = wortel.findall(f"{{{CAC}}}TaxTotal/{{{CAC}}}TaxSubtotal")
    if not subtotalen:
        return Groep(
            titel="Btw",
            rijen=[
                Rij(
                    label="Btw-percentage",
                    herkomst="cac:TaxTotal/cac:TaxSubtotal/cac:TaxCategory/cbc:Percent",
                    kern=True,
                ),
                Rij(
                    label="Btw-bedrag",
                    herkomst="cac:TaxTotal/cac:TaxSubtotal/cbc:TaxAmount",
                    kern=True,
                ),
            ],
        )

    meerdere = len(subtotalen) > 1
    rijen: list[Rij] = []
    for nummer, subtotaal in enumerate(subtotalen, start=1):
        # Bij één tarief is er niets te nummeren; bij meerdere wel, want
        # dan moet zichtbaar zijn welk bedrag bij welk tarief hoort.
        merk = f" {nummer}" if meerdere else ""
        percentage = _tekst(
            subtotaal.find(f"{{{CAC}}}TaxCategory/{{{CBC}}}Percent")
        )
        rijen.append(Rij(
            label=f"Btw-percentage{merk}",
            herkomst="cac:TaxSubtotal/cac:TaxCategory/cbc:Percent",
            waarde=f"{percentage}%" if percentage else None,
            kern=not meerdere,
        ))
        rijen.append(Rij(
            label=f"Grondslag{merk}",
            herkomst="cac:TaxSubtotal/cbc:TaxableAmount",
            waarde=_tekst(subtotaal.find(f"{{{CBC}}}TaxableAmount")),
        ))
        rijen.append(Rij(
            label=f"Btw-bedrag{merk}",
            herkomst="cac:TaxSubtotal/cbc:TaxAmount",
            waarde=_tekst(subtotaal.find(f"{{{CBC}}}TaxAmount")),
            kern=not meerdere,
        ))
    return Groep(titel="Btw", rijen=rijen)


def _regels(wortel: ET.Element, soort: str) -> list[Regel]:
    """Haal de factuurregels op, als het bestand ze heeft."""
    naam = REGELELEMENT.get(soort)
    if naam is None:
        return []
    aantalnaam = AANTALELEMENT[soort]

    regels = []
    for element in wortel.findall(f"{{{CAC}}}{naam}"):
        item = element.find(f"{{{CAC}}}Item")
        percentage = None
        if item is not None:
            percentage = _tekst(
                item.find(f"{{{CAC}}}ClassifiedTaxCategory/{{{CBC}}}Percent")
            )
        regels.append(Regel(
            nummer=_tekst(element.find(f"{{{CBC}}}ID")),
            omschrijving=_tekst(item.find(f"{{{CBC}}}Name")) if item is not None else None,
            aantal=_tekst(element.find(f"{{{CBC}}}{aantalnaam}")),
            btw_percentage=f"{percentage}%" if percentage else None,
            bedrag=_tekst(element.find(f"{{{CBC}}}LineExtensionAmount")),
        ))
    return regels


def ruwe_tekst(inhoud: bytes) -> tuple[str, bool]:
    """Maak de XML toonbaar als tekst; geef (tekst, is_afgekapt).

    Een e-factuur mag ook UTF-16 zijn. Lukt geen van beide, dan tonen we
    wat er te tonen valt met vervangingstekens in plaats van niets: dit
    is een leesvenster, geen verwerkingsstap.
    """
    afgekapt = len(inhoud) > MAX_TOON_BYTES
    stuk = inhoud[:MAX_TOON_BYTES]
    for codering in ("utf-8", "utf-16"):
        try:
            return stuk.decode(codering), afgekapt
        except (UnicodeDecodeError, UnicodeError):
            continue
    return stuk.decode("utf-8", errors="replace"), afgekapt


def leesbare_ubl(inhoud: bytes) -> Weergave:
    """Zet een e-factuur om in leesbare regels; geeft nooit een exception.

    Lukt het lezen niet — kapotte XML, een DTD-aanval, of gewoon een
    XML-bestand dat geen e-factuur is — dan komt dat als reden terug en
    blijft alleen de ruwe tekst over. Er wordt nooit iets ingevuld of
    gegokt.
    """
    ruw, afgekapt = ruwe_tekst(inhoud)

    def onleesbaar(reden: str) -> Weergave:
        return Weergave(
            status="onleesbaar", reden=reden, ruwe_xml=ruw, xml_afgekapt=afgekapt
        )

    try:
        wortel = lees_xml_veilig(inhoud)
    except XmlOnveilig as fout:
        return onleesbaar(f"onveilige XML geweigerd: {fout}")
    except ET.ParseError as fout:
        return onleesbaar(f"het XML-bestand is niet leesbaar: {fout}")
    except Exception as fout:  # nooit een exception uit de weergavelaag
        return onleesbaar(f"kon het XML-bestand niet lezen: {type(fout).__name__}: {fout}")

    soort = is_ubl(wortel)
    if soort is None:
        return onleesbaar(
            f"het hoofdelement '{wortel.tag}' is geen UBL Invoice of CreditNote"
        )

    groepen: list[Groep] = []
    for titel, velden in GROEPEN:
        rijen = []
        for label, herkomsten, kern in velden:
            waarde, herkomst = _zoek(wortel, herkomsten)
            # Een kernveld staat er altijd, ook leeg: dat het ontbreekt
            # is juist informatie. Een aanvullend veld alleen als het er
            # is, anders wordt het scherm een lijst met strepen.
            if waarde is None and not kern:
                continue
            rijen.append(
                Rij(label=label, herkomst=herkomst, waarde=waarde, kern=kern)
            )
        if titel == "Bedragen":
            # De btw hoort tussen de bedragen en de betaling in.
            if rijen:
                groepen.append(Groep(titel=titel, rijen=rijen))
            groepen.append(_btw_groep(wortel))
            continue
        if rijen:
            groepen.append(Groep(titel=titel, rijen=rijen))

    return Weergave(
        status="leesbaar",
        documentsoort=soort,
        soortnaam=SOORTNAMEN.get(soort, soort),
        groepen=groepen,
        regels=_regels(wortel, soort),
        ruwe_xml=ruw,
        xml_afgekapt=afgekapt,
    )
