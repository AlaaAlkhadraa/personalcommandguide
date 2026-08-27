"""Tests voor UBL / e-facturen (module 4).

Inclusief echte aanvalspogingen: een XML-bestand dat een bestand van de
schijf probeert te lezen (XXE) en een dat het geheugen probeert vol te
laten lopen. Beide horen geweigerd te worden.
"""

import xml.etree.ElementTree as ET
from datetime import date
from pathlib import Path

import pytest

from boekhouding import (
    XmlOnveilig,
    bestandssoort,
    lees_ubl,
    lees_ubl_bytes,
    lees_xml_veilig,
    routeer_document,
    verwerk_efactuur,
)
from conftest import maak_pdf

VANDAAG = date(2026, 8, 27)
UBLMAP = Path(__file__).parent / "testfacturen" / "ubl"

NS = (
    'xmlns="urn:oasis:names:specification:ubl:schema:xsd:Invoice-2" '
    'xmlns:cac="urn:oasis:names:specification:ubl:schema:xsd:CommonAggregateComponents-2" '
    'xmlns:cbc="urn:oasis:names:specification:ubl:schema:xsd:CommonBasicComponents-2"'
)


def kleine_ubl(nummer="F-1", datum="2026-07-14", excl="400.00", btw="84.00",
               percentage="21", incl="484.00", naam="Van Dijk ICT-diensten"):
    """Een minimale maar geldige UBL-factuur, voor losse gevallen."""
    return f"""<?xml version="1.0" encoding="UTF-8"?>
<Invoice {NS}>
  <cbc:ID>{nummer}</cbc:ID>
  <cbc:IssueDate>{datum}</cbc:IssueDate>
  <cac:AccountingSupplierParty><cac:Party>
    <cac:PartyName><cbc:Name>{naam}</cbc:Name></cac:PartyName>
  </cac:Party></cac:AccountingSupplierParty>
  <cac:TaxTotal><cac:TaxSubtotal>
    <cbc:TaxAmount currencyID="EUR">{btw}</cbc:TaxAmount>
    <cac:TaxCategory><cbc:Percent>{percentage}</cbc:Percent></cac:TaxCategory>
  </cac:TaxSubtotal></cac:TaxTotal>
  <cac:LegalMonetaryTotal>
    <cbc:TaxExclusiveAmount currencyID="EUR">{excl}</cbc:TaxExclusiveAmount>
    <cbc:TaxInclusiveAmount currencyID="EUR">{incl}</cbc:TaxInclusiveAmount>
  </cac:LegalMonetaryTotal>
</Invoice>""".encode("utf-8")


# --- XXE en andere XML-aanvallen ----------------------------------------

def test_xxe_kan_geen_bestand_lezen(tmp_path):
    """Een factuur die /etc/passwd probeert te lezen wordt geweigerd."""
    geheim = tmp_path / "geheim.txt"
    geheim.write_text("DIT-MAG-NOOIT-LEKKEN", encoding="utf-8")

    aanval = f"""<?xml version="1.0"?>
<!DOCTYPE Invoice [ <!ENTITY lek SYSTEM "file://{geheim}"> ]>
<Invoice><ID>&lek;</ID></Invoice>""".encode("utf-8")

    with pytest.raises(XmlOnveilig, match="DTD"):
        lees_xml_veilig(aanval)

    # En via de normale weg: review_nodig, geen exception, geen lek.
    bestand = tmp_path / "aanval.xml"
    bestand.write_bytes(aanval)
    resultaat = lees_ubl(bestand)
    assert resultaat.status == "review_nodig"
    assert any("onveilige XML" in reden for reden in resultaat.redenen)
    assert "DIT-MAG-NOOIT-LEKKEN" not in str(resultaat.model_dump())


def test_xxe_kan_geen_netwerkadres_benaderen(tmp_path):
    aanval = b"""<?xml version="1.0"?>
<!DOCTYPE Invoice [ <!ENTITY lek SYSTEM "http://voorbeeld.test/geheim"> ]>
<Invoice><ID>&lek;</ID></Invoice>"""
    with pytest.raises(XmlOnveilig):
        lees_xml_veilig(aanval)


def test_uitdijende_entiteiten_worden_geweigerd():
    """Billion laughs: een klein bestand dat het geheugen vol laat lopen."""
    aanval = b"""<?xml version="1.0"?>
<!DOCTYPE lolz [
 <!ENTITY lol "lol">
 <!ENTITY lol2 "&lol;&lol;&lol;&lol;&lol;&lol;&lol;&lol;&lol;&lol;">
 <!ENTITY lol3 "&lol2;&lol2;&lol2;&lol2;&lol2;&lol2;&lol2;&lol2;&lol2;&lol2;">
]>
<Invoice><ID>&lol3;</ID></Invoice>"""
    with pytest.raises(XmlOnveilig):
        lees_xml_veilig(aanval)


def test_externe_dtd_wordt_geweigerd():
    aanval = b'<?xml version="1.0"?>\n' \
             b'<!DOCTYPE Invoice SYSTEM "http://voorbeeld.test/kwaad.dtd">\n' \
             b"<Invoice><ID>1</ID></Invoice>"
    with pytest.raises(XmlOnveilig, match="DTD"):
        lees_xml_veilig(aanval)


def test_gewone_xml_zonder_dtd_wordt_gewoon_gelezen():
    wortel = lees_xml_veilig(b"<Invoice><ID>F-1</ID></Invoice>")
    assert wortel.tag == "Invoice"
    assert wortel.find("ID").text == "F-1"


def test_naamruimten_blijven_behouden():
    wortel = lees_xml_veilig(kleine_ubl())
    assert wortel.tag.startswith("{urn:oasis:")
    assert wortel.tag.endswith("}Invoice")


def test_kapotte_xml_geeft_leesbare_fout():
    with pytest.raises(ET.ParseError):
        lees_xml_veilig(b"<Invoice><ID>niet afgesloten")


def test_kapotte_xml_via_de_normale_weg_geeft_review(tmp_path):
    bestand = tmp_path / "kapot.xml"
    bestand.write_bytes(b"<Invoice><ID>niet afgesloten")
    resultaat = lees_ubl(bestand)
    assert resultaat.status == "review_nodig"
    assert any("niet leesbaar" in reden for reden in resultaat.redenen)


# --- routering op inhoud, niet op naam ----------------------------------

def test_bestandssoort_herkent_de_eerste_bytes():
    assert bestandssoort(b"%PDF-1.4\n...") == "pdf"
    assert bestandssoort(b"\xff\xd8\xff\xe0...") == "jpg"
    assert bestandssoort(b"\x89PNG\r\n\x1a\n...") == "png"
    assert bestandssoort(b'<?xml version="1.0"?>') == "xml"
    assert bestandssoort(b"<Invoice>") == "xml"
    assert bestandssoort(b"\xef\xbb\xbf<?xml ") == "xml"  # met BOM
    assert bestandssoort(b"PK\x03\x04") is None


def test_ubl_bestand_gaat_naar_het_ubl_pad():
    route, reden = routeer_document(UBLMAP / "01-standaard-21procent.xml")
    assert route == "ubl" and reden is None


def test_pdf_met_ingebedde_efactuur_gaat_naar_het_ubl_pad():
    # Deze PDF heeft óók een tekstlaag; de XML hoort voor te gaan.
    route, _ = routeer_document(UBLMAP / "06-factuur-x.pdf")
    assert route == "ubl"


def test_gewone_pdf_gaat_naar_het_tekstpad(tmp_path):
    bestand = tmp_path / "factuur.pdf"
    bestand.write_bytes(maak_pdf("Factuur 2026-0412"))
    assert routeer_document(bestand)[0] == "tekst"


def test_gescande_pdf_gaat_naar_het_beeldpad(tmp_path):
    bestand = tmp_path / "scan.pdf"
    bestand.write_bytes(maak_pdf(None))
    assert routeer_document(bestand)[0] == "beeld"


def test_afbeelding_gaat_naar_het_beeldpad(tmp_path):
    bestand = tmp_path / "foto.jpg"
    bestand.write_bytes(b"\xff\xd8\xff\xe0 nep-jpeg")
    assert routeer_document(bestand)[0] == "beeld"


def test_de_naam_van_het_bestand_doet_er_niet_toe(tmp_path):
    # UBL met de verkeerde extensie: moet tóch het UBL-pad worden.
    verkeerd = tmp_path / "factuur.pdf"
    verkeerd.write_bytes(kleine_ubl())
    assert routeer_document(verkeerd)[0] == "ubl"

    # En een echte PDF die .xml heet gaat niet als XML door.
    andersom = tmp_path / "factuur.xml"
    andersom.write_bytes(maak_pdf("Factuur 2026-0412"))
    assert routeer_document(andersom)[0] == "tekst"


def test_xml_dat_geen_ubl_is_geeft_reden(tmp_path):
    bestand = tmp_path / "iets.xml"
    bestand.write_bytes(b"<Bestellijst><Regel>1</Regel></Bestellijst>")
    route, reden = routeer_document(bestand)
    assert route is None
    assert "Bestellijst" in reden and "geen UBL" in reden


def test_onbekende_soort_geeft_reden(tmp_path):
    bestand = tmp_path / "iets.docx"
    bestand.write_bytes(b"PK\x03\x04 nep-docx")
    route, reden = routeer_document(bestand)
    assert route is None
    assert "onbekende bestandssoort" in reden


def test_leeg_bestand_geeft_reden(tmp_path):
    bestand = tmp_path / "leeg.xml"
    bestand.write_bytes(b"")
    route, reden = routeer_document(bestand)
    assert route is None and "leeg" in reden


def test_onbestaand_bestand_geeft_reden(tmp_path):
    route, reden = routeer_document(tmp_path / "weg.xml")
    assert route is None and "niet gevonden" in reden


# --- velden uitlezen ----------------------------------------------------

def test_alle_velden_komen_uit_de_xml():
    resultaat = verwerk_efactuur(
        UBLMAP / "01-standaard-21procent.xml", vandaag=VANDAAG
    )
    assert resultaat.status == "gevalideerd"
    assert resultaat.redenen == []
    assert resultaat.documentsoort == "factuur"
    assert resultaat.bron == "xml"
    assert resultaat.velden["leverancier"] == "Van Dijk ICT-diensten"
    assert resultaat.velden["factuurnummer"] == "EF-2026-0101"
    assert resultaat.velden["factuurdatum"] == "2026-07-14"
    assert str(resultaat.factuur.bedrag_incl) == "484.00"


def test_laag_tarief_wordt_gelezen():
    resultaat = verwerk_efactuur(
        UBLMAP / "02-diensten-9procent.xml", vandaag=VANDAAG
    )
    assert resultaat.status == "gevalideerd"
    assert str(resultaat.factuur.btw_percentage) == "9.00"


def test_leverancier_valt_terug_op_de_statutaire_naam():
    zonder_handelsnaam = kleine_ubl().replace(
        b"<cac:PartyName><cbc:Name>Van Dijk ICT-diensten</cbc:Name></cac:PartyName>",
        b"<cac:PartyLegalEntity><cbc:RegistrationName>Van Dijk ICT B.V."
        b"</cbc:RegistrationName></cac:PartyLegalEntity>",
    )
    gelezen = lees_ubl_bytes(zonder_handelsnaam)
    assert gelezen.velden["leverancier"] == "Van Dijk ICT B.V."


# --- meerdere btw-tarieven ----------------------------------------------

def test_twee_btw_tarieven_worden_niet_opgeteld():
    resultaat = verwerk_efactuur(
        UBLMAP / "04-twee-btw-tarieven.xml", vandaag=VANDAAG
    )
    assert resultaat.status == "review_nodig"
    reden = next(r for r in resultaat.redenen if "btw-tarieven" in r)
    assert "2 btw-tarieven" in reden
    assert "21.00" in reden and "9.00" in reden
    # Niets samengevoegd tot één percentage.
    assert "btw_percentage" not in resultaat.velden
    assert "btw_bedrag" not in resultaat.velden


def test_zonder_btw_gegevens_volgt_review():
    zonder = kleine_ubl()
    begin = zonder.index(b"<cac:TaxTotal>")
    einde = zonder.index(b"</cac:TaxTotal>") + len(b"</cac:TaxTotal>")
    gelezen = lees_ubl_bytes(zonder[:begin] + zonder[einde:])
    assert gelezen.status == "review_nodig"
    assert any("geen btw-gegevens" in reden for reden in gelezen.redenen)


# --- ontbrekende velden -------------------------------------------------

def test_ontbrekende_factuurdatum_noemt_het_element():
    resultaat = verwerk_efactuur(
        UBLMAP / "05-zonder-factuurdatum.xml", vandaag=VANDAAG
    )
    assert resultaat.status == "review_nodig"
    assert any(
        "factuurdatum ontbreekt" in reden and "cbc:IssueDate" in reden
        for reden in resultaat.redenen
    )


def test_er_wordt_nooit_een_default_ingevuld():
    kaal = b'<?xml version="1.0"?><Invoice ' + NS.encode() + b"></Invoice>"
    gelezen = lees_ubl_bytes(kaal)
    assert gelezen.status == "review_nodig"
    assert gelezen.velden == {}          # niets verzonnen
    assert len(gelezen.redenen) >= 5     # per ontbrekend element een reden


def test_onzinbedrag_wordt_niet_overgenomen():
    slecht = kleine_ubl().replace(b">400.00<", b">vierhonderd<")
    gelezen = lees_ubl_bytes(slecht)
    assert "bedrag_excl" not in gelezen.velden
    assert any("bedrag_excl ontbreekt" in reden for reden in gelezen.redenen)


# --- creditnota ---------------------------------------------------------

def test_creditnota_wordt_herkend_en_ter_review_gelegd():
    resultaat = verwerk_efactuur(UBLMAP / "03-creditnota.xml", vandaag=VANDAAG)
    assert resultaat.documentsoort == "creditnota"
    assert resultaat.status == "review_nodig"
    assert any("creditnota" in reden and "tekens" in reden for reden in resultaat.redenen)
    # De bedragen zijn wél gelezen, precies zoals ze in het bestand staan.
    assert resultaat.velden["bedrag_incl"] == "484.00"


# --- de validatie van module 1 blijft gelden ----------------------------

def test_bedragen_gaan_door_valideer_factuur():
    # Een e-factuur waarvan het totaal niet klopt hoort ook af te vallen.
    from boekhouding import beoordeel_ubl

    fout = kleine_ubl(excl="400.00", btw="84.00", incl="999.00")

    gelezen = lees_ubl_bytes(fout)
    beoordeeld = beoordeel_ubl(gelezen, vandaag=VANDAAG)
    assert beoordeeld.status == "review_nodig"
    assert any("bedrag_incl" in reden and "verschil" in reden
               for reden in beoordeeld.redenen)


def test_datum_in_de_toekomst_valt_ook_hier_af():
    from boekhouding import beoordeel_ubl

    toekomst = kleine_ubl(datum="2026-12-31")
    beoordeeld = beoordeel_ubl(lees_ubl_bytes(toekomst), vandaag=VANDAAG)
    assert beoordeeld.status == "review_nodig"
    assert any("toekomst" in reden for reden in beoordeeld.redenen)


def test_ongeldig_btw_percentage_valt_ook_hier_af():
    from boekhouding import beoordeel_ubl

    vreemd = kleine_ubl(percentage="15", btw="60.00", incl="460.00")
    beoordeeld = beoordeel_ubl(lees_ubl_bytes(vreemd), vandaag=VANDAAG)
    assert beoordeeld.status == "review_nodig"
    assert any("btw_percentage" in reden for reden in beoordeeld.redenen)


# --- PDF met ingebedde e-factuur ---------------------------------------

def test_factuur_x_leest_uit_de_bijlage_en_niet_uit_de_tekstlaag():
    resultaat = verwerk_efactuur(UBLMAP / "06-factuur-x.pdf", vandaag=VANDAAG)
    assert resultaat.status == "gevalideerd"
    assert resultaat.bron == "pdf-bijlage"
    assert resultaat.velden["factuurnummer"] == "EF-2026-0106"
    assert str(resultaat.factuur.bedrag_incl) == "620.13"


def test_pdf_zonder_bijlage_zegt_dat_eerlijk(tmp_path):
    gewoon = tmp_path / "gewoon.pdf"
    gewoon.write_bytes(maak_pdf("Factuur 2026-0412"))
    resultaat = verwerk_efactuur(gewoon, vandaag=VANDAAG)
    assert resultaat.status == "review_nodig"
    assert any("geen ingebedde e-factuur" in reden for reden in resultaat.redenen)


def test_onbestaand_bestand_geeft_review(tmp_path):
    resultaat = verwerk_efactuur(tmp_path / "weg.xml", vandaag=VANDAAG)
    assert resultaat.status == "review_nodig"
    assert any("niet gevonden" in reden for reden in resultaat.redenen)


# --- bewaarplicht geldt ook voor e-facturen -----------------------------

def test_efactuur_kan_bewaard_worden(conn, administratie_id, tmp_path):
    from boekhouding import bewaar_document, lees_document, opslagpad_voor

    bestand = tmp_path / "efactuur.xml"
    bestand.write_bytes(kleine_ubl())

    resultaat = bewaar_document(
        conn, administratie_id, str(bestand), str(tmp_path / "opslag")
    )
    assert resultaat.status == "opgeslagen"
    bewaard = opslagpad_voor(resultaat.hash, tmp_path / "opslag", ".xml")
    assert bewaard.is_file()
    assert bewaard.read_bytes() == bestand.read_bytes()
    assert lees_document(conn, resultaat.document_id)["originele_bestandsnaam"] == (
        "efactuur.xml"
    )


# --- groottelimiet ------------------------------------------------------

def test_te_groot_bestand_wordt_niet_ingelezen(tmp_path):
    """Een XML boven de grens gaat naar review zonder te worden gelezen."""
    from boekhouding import MAX_XML_BYTES

    groot = tmp_path / "enorm.xml"
    # Geldige UBL, maar met zoveel opvulling dat hij over de grens gaat.
    opvulling = b"<!-- " + b"x" * (MAX_XML_BYTES + 1024) + b" -->"
    groot.write_bytes(kleine_ubl().replace(b"<cbc:ID>", opvulling + b"<cbc:ID>"))
    assert groot.stat().st_size > MAX_XML_BYTES

    resultaat = lees_ubl(groot)
    assert resultaat.status == "review_nodig"
    assert any("groter dan de grens" in reden for reden in resultaat.redenen)
    assert resultaat.velden == {}


def test_te_groot_bestand_wordt_ook_niet_gerouteerd(tmp_path):
    from boekhouding import MAX_XML_BYTES

    groot = tmp_path / "enorm.xml"
    groot.write_bytes(b'<?xml version="1.0"?><Invoice>' + b"x" * MAX_XML_BYTES)

    route, reden = routeer_document(groot)
    assert route is None
    assert "groter dan de grens" in reden


def test_de_grens_wordt_ook_op_losse_bytes_toegepast():
    """Ook bytes uit een PDF-bijlage gaan door dezelfde grens."""
    from boekhouding import MAX_XML_BYTES

    with pytest.raises(XmlOnveilig, match="groter dan de grens"):
        lees_xml_veilig(b"<Invoice>" + b"x" * MAX_XML_BYTES)


def test_een_bestand_op_de_grens_mag_nog(tmp_path):
    from boekhouding import te_groot, MAX_XML_BYTES

    assert te_groot(MAX_XML_BYTES) is None       # precies op de grens: goed
    assert te_groot(MAX_XML_BYTES + 1) is not None


def test_normale_efactuur_valt_ruim_binnen_de_grens():
    from boekhouding import MAX_XML_BYTES

    echte = (UBLMAP / "01-standaard-21procent.xml").stat().st_size
    assert echte < MAX_XML_BYTES / 1000  # een e-factuur is kilobytes, geen MB


# --- andere tekencodering ----------------------------------------------

def _als_utf16(tekst: str, groot_eerst: bool) -> bytes:
    """Zet XML om naar UTF-16 met de bijbehorende BOM."""
    if groot_eerst:
        return b"\xfe\xff" + tekst.encode("utf-16-be")
    return b"\xff\xfe" + tekst.encode("utf-16-le")


DTD_AANVAL = (
    '<?xml version="1.0" encoding="UTF-16"?>\n'
    '<!DOCTYPE Invoice [ <!ENTITY lek SYSTEM "file:///etc/passwd"> ]>\n'
    "<Invoice><ID>&lek;</ID></Invoice>"
)


@pytest.mark.parametrize("groot_eerst", [False, True], ids=["utf-16-le", "utf-16-be"])
def test_dtd_aanval_in_utf16_wordt_ook_geweigerd(groot_eerst):
    """Dezelfde aanval in een andere codering hoort net zo af te ketsen."""
    with pytest.raises(XmlOnveilig, match="DTD"):
        lees_xml_veilig(_als_utf16(DTD_AANVAL, groot_eerst))


@pytest.mark.parametrize("groot_eerst", [False, True], ids=["utf-16-le", "utf-16-be"])
def test_utf16_aanval_via_de_normale_weg_geeft_review(tmp_path, groot_eerst):
    bestand = tmp_path / "aanval.xml"
    bestand.write_bytes(_als_utf16(DTD_AANVAL, groot_eerst))

    resultaat = lees_ubl(bestand)
    assert resultaat.status == "review_nodig"
    assert any("onveilige XML" in reden for reden in resultaat.redenen)
    assert "root:" not in str(resultaat.model_dump())  # niets uit /etc/passwd


@pytest.mark.parametrize("groot_eerst", [False, True], ids=["utf-16-le", "utf-16-be"])
def test_nette_utf16_efactuur_wordt_gewoon_gelezen(tmp_path, groot_eerst):
    """De weigering mag geen geldige UTF-16 e-factuur meeslepen."""
    tekst = kleine_ubl().decode("utf-8").replace(
        '<?xml version="1.0" encoding="UTF-8"?>',
        '<?xml version="1.0" encoding="UTF-16"?>',
    )
    bestand = tmp_path / "efactuur.xml"
    bestand.write_bytes(_als_utf16(tekst, groot_eerst))

    assert routeer_document(bestand)[0] == "ubl"
    resultaat = verwerk_efactuur(bestand, vandaag=VANDAAG)
    assert resultaat.status == "gevalideerd"
    assert resultaat.velden["leverancier"] == "Van Dijk ICT-diensten"


@pytest.mark.parametrize("groot_eerst", [False, True], ids=["utf-16-le", "utf-16-be"])
def test_utf16_wordt_als_xml_herkend(groot_eerst):
    from boekhouding import bestandssoort

    assert bestandssoort(_als_utf16(DTD_AANVAL, groot_eerst)) == "xml"
