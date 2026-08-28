#!/usr/bin/env python3
"""Genereer synthetische UBL-testbestanden (e-facturen).

    python tests/genereer_ubl_testbestanden.py

Er komen zes bestanden in tests/testfacturen/ubl/ te staan: vijf losse
UBL-bestanden en één PDF met een ingebedde e-factuur (Factur-X), zodat
ook dat pad echt getest kan worden.

Alles is verzonnen maar volgt UBL 2.1 zoals in NLCIUS en EN 16931.
Deterministisch: vaste datums en nummers, geen tijdstempel, geen
internet.
"""

import json
import sys
from decimal import Decimal
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent))

from boekhouding.pdf_schrijver import Pagina, schrijf_pdf_met_bijlage

DOELMAP = Path(__file__).parent / "testfacturen" / "ubl"

KOP = """<?xml version="1.0" encoding="UTF-8"?>
<{wortel} xmlns="urn:oasis:names:specification:ubl:schema:xsd:{wortel}-2"
  xmlns:cac="urn:oasis:names:specification:ubl:schema:xsd:CommonAggregateComponents-2"
  xmlns:cbc="urn:oasis:names:specification:ubl:schema:xsd:CommonBasicComponents-2">
  <cbc:CustomizationID>urn:cen.eu:en16931:2017#compliant#urn:fdc:nen.nl:nlcius:v1.0</cbc:CustomizationID>
  <cbc:ProfileID>urn:fdc:peppol.eu:2017:poacc:billing:01:1.0</cbc:ProfileID>
  <cbc:ID>{nummer}</cbc:ID>
  <cbc:IssueDate>{datum}</cbc:IssueDate>
  <cbc:DueDate>{vervaldatum}</cbc:DueDate>
  <cbc:DocumentCurrencyCode>EUR</cbc:DocumentCurrencyCode>"""

LEVERANCIER = """
  <cac:AccountingSupplierParty>
    <cac:Party>
      <cbc:EndpointID schemeID="0106">{kvk}</cbc:EndpointID>
      <cac:PartyName><cbc:Name>{naam}</cbc:Name></cac:PartyName>
      <cac:PostalAddress>
        <cbc:StreetName>{straat}</cbc:StreetName>
        <cbc:CityName>{plaats}</cbc:CityName>
        <cbc:PostalZone>{postcode}</cbc:PostalZone>
        <cac:Country><cbc:IdentificationCode>NL</cbc:IdentificationCode></cac:Country>
      </cac:PostalAddress>
      <cac:PartyTaxScheme>
        <cbc:CompanyID>{btw_id}</cbc:CompanyID>
        <cac:TaxScheme><cbc:ID>VAT</cbc:ID></cac:TaxScheme>
      </cac:PartyTaxScheme>
      <cac:PartyLegalEntity>
        <cbc:RegistrationName>{naam}</cbc:RegistrationName>
        <cbc:CompanyID schemeID="0106">{kvk}</cbc:CompanyID>
      </cac:PartyLegalEntity>
    </cac:Party>
  </cac:AccountingSupplierParty>"""

KLANT = """
  <cac:AccountingCustomerParty>
    <cac:Party>
      <cac:PartyName><cbc:Name>Alkhadraa Advies</cbc:Name></cac:PartyName>
      <cac:PostalAddress>
        <cbc:StreetName>Zonnebloemstraat 14</cbc:StreetName>
        <cbc:CityName>Rotterdam</cbc:CityName>
        <cbc:PostalZone>3011 AB</cbc:PostalZone>
        <cac:Country><cbc:IdentificationCode>NL</cbc:IdentificationCode></cac:Country>
      </cac:PostalAddress>
    </cac:Party>
  </cac:AccountingCustomerParty>"""

SUBTOTAAL = """
    <cac:TaxSubtotal>
      <cbc:TaxableAmount currencyID="EUR">{excl}</cbc:TaxableAmount>
      <cbc:TaxAmount currencyID="EUR">{btw}</cbc:TaxAmount>
      <cac:TaxCategory>
        <cbc:ID>{code}</cbc:ID>
        <cbc:Percent>{percentage}</cbc:Percent>
        <cac:TaxScheme><cbc:ID>VAT</cbc:ID></cac:TaxScheme>
      </cac:TaxCategory>
    </cac:TaxSubtotal>"""

REGEL = """
  <cac:{regelnaam}>
    <cbc:ID>{nummer}</cbc:ID>
    <cbc:{hoeveelheid} unitCode="C62">{aantal}</cbc:{hoeveelheid}>
    <cbc:LineExtensionAmount currencyID="EUR">{bedrag}</cbc:LineExtensionAmount>
    <cac:Item>
      <cbc:Name>{omschrijving}</cbc:Name>
      <cac:ClassifiedTaxCategory>
        <cbc:ID>{code}</cbc:ID>
        <cbc:Percent>{percentage}</cbc:Percent>
        <cac:TaxScheme><cbc:ID>VAT</cbc:ID></cac:TaxScheme>
      </cac:ClassifiedTaxCategory>
    </cac:Item>
    <cac:Price><cbc:PriceAmount currencyID="EUR">{stukprijs}</cbc:PriceAmount></cac:Price>
  </cac:{regelnaam}>"""


def bouw(
    wortel, nummer, datum, vervaldatum, leverancier, regels, subtotalen,
    excl, incl, weglaten=(),
):
    """Zet een UBL-document in elkaar; `weglaten` haalt elementen eruit."""
    regelnaam = "CreditNoteLine" if wortel == "CreditNote" else "InvoiceLine"
    hoeveelheid = "CreditedQuantity" if wortel == "CreditNote" else "InvoicedQuantity"

    xml = KOP.format(wortel=wortel, nummer=nummer, datum=datum, vervaldatum=vervaldatum)
    for element in weglaten:
        # Het verplichte element eruit knippen, precies zoals een
        # onvolledig bestand van een leverancier eruit zou zien.
        begin = xml.find(f"  <cbc:{element}>")
        if begin != -1:
            einde = xml.find("\n", begin)
            xml = xml[:begin] + xml[einde + 1:]

    xml += LEVERANCIER.format(**leverancier)
    xml += KLANT

    xml += "\n  <cac:TaxTotal>"
    xml += f'\n    <cbc:TaxAmount currencyID="EUR">' + \
        str(sum(Decimal(s["btw"]) for s in subtotalen)) + "</cbc:TaxAmount>"
    for s in subtotalen:
        xml += SUBTOTAAL.format(**s)
    xml += "\n  </cac:TaxTotal>"

    xml += f"""
  <cac:LegalMonetaryTotal>
    <cbc:LineExtensionAmount currencyID="EUR">{excl}</cbc:LineExtensionAmount>
    <cbc:TaxExclusiveAmount currencyID="EUR">{excl}</cbc:TaxExclusiveAmount>
    <cbc:TaxInclusiveAmount currencyID="EUR">{incl}</cbc:TaxInclusiveAmount>
    <cbc:PayableAmount currencyID="EUR">{incl}</cbc:PayableAmount>
  </cac:LegalMonetaryTotal>"""

    for volgnummer, regel in enumerate(regels, start=1):
        xml += REGEL.format(
            regelnaam=regelnaam, hoeveelheid=hoeveelheid, nummer=volgnummer, **regel
        )
    xml += f"\n</{wortel}>\n"
    return xml


def leverancier(naam, straat, postcode, plaats, kvk, btw_id):
    return {
        "naam": naam, "straat": straat, "postcode": postcode,
        "plaats": plaats, "kvk": kvk, "btw_id": btw_id,
    }


VAN_DIJK = leverancier(
    "Van Dijk ICT-diensten", "Keizersgracht 218", "1016 DZ", "Amsterdam",
    "32205650", "NL110353601B43",
)
KORENAAR = leverancier(
    "Bakkerij De Korenaar", "Nieuwe Binnenweg 87", "3014 GJ", "Rotterdam",
    "24418896", "NL823456789B01",
)
GROOTHANDEL = leverancier(
    "Techniek Groothandel Oost", "Industrieweg 45", "7554 NB", "Hengelo",
    "06081234", "NL801234567B01",
)


def bestanden():
    """De vijf UBL-bestanden plus de Factur-X-PDF."""
    return [
        {
            "bestand": "01-standaard-21procent.xml",
            "waarom": "gewone e-factuur met het hoge tarief",
            "verwacht": "gevalideerd",
            "xml": bouw(
                "Invoice", "EF-2026-0101", "2026-07-14", "2026-08-13", VAN_DIJK,
                [{"aantal": "1", "bedrag": "400.00", "stukprijs": "400.00",
                  "omschrijving": "Onderhoud werkplekken juli 2026",
                  "code": "S", "percentage": "21.00"}],
                [{"excl": "400.00", "btw": "84.00", "code": "S", "percentage": "21.00"}],
                "400.00", "484.00",
            ),
            "velden": {"leverancier": "Van Dijk ICT-diensten",
                       "factuurnummer": "EF-2026-0101", "factuurdatum": "2026-07-14",
                       "bedrag_excl": "400.00", "btw_percentage": "21.00",
                       "btw_bedrag": "84.00", "bedrag_incl": "484.00"},
        },
        {
            "bestand": "02-diensten-9procent.xml",
            "waarom": "laag tarief van 9%",
            "verwacht": "gevalideerd",
            "xml": bouw(
                "Invoice", "EF-2026-0102", "2026-07-21", "2026-08-20", KORENAAR,
                [{"aantal": "50", "bedrag": "250.00", "stukprijs": "5.00",
                  "omschrijving": "Lunchbezorging teamdag", "code": "AA",
                  "percentage": "9.00"}],
                [{"excl": "250.00", "btw": "22.50", "code": "AA", "percentage": "9.00"}],
                "250.00", "272.50",
            ),
            "velden": {"leverancier": "Bakkerij De Korenaar",
                       "factuurnummer": "EF-2026-0102", "factuurdatum": "2026-07-21",
                       "bedrag_excl": "250.00", "btw_percentage": "9.00",
                       "btw_bedrag": "22.50", "bedrag_incl": "272.50"},
        },
        {
            "bestand": "03-creditnota.xml",
            "waarom": "CreditNote als hoofdelement; UBL noteert de bedragen positief",
            "verwacht": "review_nodig",
            "xml": bouw(
                "CreditNote", "EF-2026-0103C", "2026-08-04", "2026-09-03", VAN_DIJK,
                [{"aantal": "1", "bedrag": "400.00", "stukprijs": "400.00",
                  "omschrijving": "Creditering onderhoud juli 2026",
                  "code": "S", "percentage": "21.00"}],
                [{"excl": "400.00", "btw": "84.00", "code": "S", "percentage": "21.00"}],
                "400.00", "484.00",
            ),
            "velden": {"leverancier": "Van Dijk ICT-diensten",
                       "factuurnummer": "EF-2026-0103C", "factuurdatum": "2026-08-04",
                       "bedrag_excl": "400.00", "btw_percentage": "21.00",
                       "btw_bedrag": "84.00", "bedrag_incl": "484.00"},
        },
        {
            "bestand": "04-twee-btw-tarieven.xml",
            "waarom": "twee TaxSubtotal-blokken: 21% en 9% op één factuur",
            "verwacht": "review_nodig",
            "xml": bouw(
                "Invoice", "EF-2026-0104", "2026-08-11", "2026-09-10", GROOTHANDEL,
                [{"aantal": "1", "bedrag": "100.00", "stukprijs": "100.00",
                  "omschrijving": "Kantoorartikelen", "code": "S", "percentage": "21.00"},
                 {"aantal": "1", "bedrag": "200.00", "stukprijs": "200.00",
                  "omschrijving": "Vakliteratuur", "code": "AA", "percentage": "9.00"}],
                [{"excl": "100.00", "btw": "21.00", "code": "S", "percentage": "21.00"},
                 {"excl": "200.00", "btw": "18.00", "code": "AA", "percentage": "9.00"}],
                "300.00", "339.00",
            ),
            "velden": {},
        },
        {
            "bestand": "05-zonder-factuurdatum.xml",
            "waarom": "verplichte IssueDate ontbreekt",
            "verwacht": "review_nodig",
            "xml": bouw(
                "Invoice", "EF-2026-0105", "2026-08-18", "2026-09-17", VAN_DIJK,
                [{"aantal": "1", "bedrag": "400.00", "stukprijs": "400.00",
                  "omschrijving": "Onderhoud werkplekken augustus 2026",
                  "code": "S", "percentage": "21.00"}],
                [{"excl": "400.00", "btw": "84.00", "code": "S", "percentage": "21.00"}],
                "400.00", "484.00", weglaten=("IssueDate",),
            ),
            "velden": {},
        },
    ]


FACTUUR_X_XML = bouw(
    "Invoice", "EF-2026-0106", "2026-08-06", "2026-09-05", GROOTHANDEL,
    [{"aantal": "1", "bedrag": "512.50", "stukprijs": "512.50",
      "omschrijving": "Netwerkapparatuur", "code": "S", "percentage": "21.00"}],
    [{"excl": "512.50", "btw": "107.63", "code": "S", "percentage": "21.00"}],
    "512.50", "620.13",
)


def maak_factuur_x_pdf(doel: Path) -> Path:
    """Een PDF die er voor de mens uitziet als factuur, met de XML erin."""
    pagina = Pagina()
    pagina.tekst(56, 70, "Techniek Groothandel Oost", 15, vet=True)
    pagina.tekst_rechts(539, 72, "FACTUUR", 20, vet=True)
    pagina.tekst(56, 100, "KvK-nummer: 06081234", 8.5)
    pagina.tekst(56, 112, "Btw-id: NL801234567B01", 8.5)
    pagina.tekst(56, 160, "Factuurnummer:", 9)
    pagina.tekst_rechts(539, 160, "EF-2026-0106", 9)
    pagina.tekst(56, 174, "Factuurdatum:", 9)
    pagina.tekst_rechts(539, 174, "06-08-2026", 9)
    pagina.tekst(56, 188, "Vervaldatum:", 9)
    pagina.tekst_rechts(539, 188, "05-09-2026", 9)
    pagina.lijn(56, 210, 539, 210, 0.8)
    pagina.tekst(56, 228, "Netwerkapparatuur", 9)
    pagina.tekst_rechts(539, 228, "512,50", 9)
    pagina.tekst(340, 260, "Subtotaal excl. btw", 9)
    pagina.tekst_rechts(539, 260, "512,50", 9)
    pagina.tekst(340, 275, "Btw 21%", 9)
    pagina.tekst_rechts(539, 275, "107,63", 9)
    pagina.tekst(340, 296, "Totaal incl. btw", 10, vet=True)
    pagina.tekst_rechts(539, 296, "620,13", 10, vet=True)
    pagina.tekst(56, 340, "Deze factuur bevat een e-factuur als bijlage (Factur-X).", 8)
    return schrijf_pdf_met_bijlage(pagina, doel, "factur-x.xml",
                                   FACTUUR_X_XML.encode("utf-8"))


def main() -> None:
    DOELMAP.mkdir(parents=True, exist_ok=True)
    overzicht = []

    for item in bestanden():
        doel = DOELMAP / item["bestand"]
        doel.write_text(item["xml"], encoding="utf-8")
        overzicht.append({k: item[k] for k in ("bestand", "waarom", "verwacht", "velden")})
        print(f"  {item['bestand']:<32} {doel.stat().st_size:>6} bytes")

    doel = maak_factuur_x_pdf(DOELMAP / "06-factuur-x.pdf")
    overzicht.append({
        "bestand": "06-factuur-x.pdf",
        "waarom": "PDF met ingebedde e-factuur; de XML gaat voor op de tekstlaag",
        "verwacht": "gevalideerd",
        "velden": {"leverancier": "Techniek Groothandel Oost",
                   "factuurnummer": "EF-2026-0106", "factuurdatum": "2026-08-06",
                   "bedrag_excl": "512.50", "btw_percentage": "21.00",
                   "btw_bedrag": "107.63", "bedrag_incl": "620.13"},
    })
    print(f"  06-factuur-x.pdf                 {doel.stat().st_size:>6} bytes")

    (DOELMAP / "overzicht.json").write_text(
        json.dumps(overzicht, ensure_ascii=False, indent=2) + "\n", encoding="utf-8"
    )
    print(f"\n{len(overzicht)} bestanden in {DOELMAP}")


if __name__ == "__main__":
    main()
