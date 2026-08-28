"""Tests voor het inlezen van bankafschriften (module 7).

MT940 en CAMT.053 horen hetzelfde afschrift op dezelfde manier te
lezen. Een onleesbare regel mag de rest van het bestand niet meenemen,
en een bestand dat geen afschrift is wordt geweigerd met een reden.
"""

from datetime import date
from decimal import Decimal
from pathlib import Path

import pytest

from boekhouding import lees_bankbestand, lees_camt, lees_mt940
from boekhouding.ubl import MAX_XML_BYTES
from test_ubl import DTD_AANVAL, _als_utf16

BANKMAP = Path(__file__).parent / "testfacturen" / "bank"


def lees(naam: str):
    return lees_bankbestand((BANKMAP / naam).read_bytes(), naam)


# --- MT940 --------------------------------------------------------------

def test_mt940_wordt_gelezen():
    resultaat = lees("01-mt940-ing.sta")

    assert resultaat.status == "gelezen"
    assert resultaat.formaat == "mt940"
    assert resultaat.rekening == "NL91INGB0417164300"
    assert len(resultaat.transacties) == 4
    assert resultaat.redenen == []


def test_alle_velden_van_een_transactie_komen_terug():
    eerste = lees("01-mt940-ing.sta").transacties[0]

    assert eerste.boekdatum == date(2026, 7, 1)
    assert eerste.bedrag == Decimal("-484.00")
    assert eerste.tegenrekening == "NL02VDIJ0123456789"
    assert eerste.tegenpartij == "Van Dijk ICT-diensten"
    assert "EF-2026-0101" in eerste.omschrijving
    assert eerste.betalingskenmerk == "EF-2026-0101"
    assert eerste.bankreferentie == "INGB0001"


def test_een_afschrijving_is_negatief_en_een_bijschrijving_positief():
    bedragen = [t.bedrag for t in lees("01-mt940-ing.sta").transacties]

    assert bedragen[0] < 0          # betaling aan Van Dijk
    assert bedragen[1] > 0          # ontvangst van een klant
    assert bedragen == [
        Decimal("-484.00"), Decimal("2904.00"),
        Decimal("-272.50"), Decimal("-75.00"),
    ]


def test_nonref_en_notprovided_zijn_geen_kenmerk():
    """Er staat wel iets, maar het betekent 'geen kenmerk'."""
    transacties = lees("01-mt940-ing.sta").transacties

    assert transacties[1].betalingskenmerk is None
    assert transacties[2].betalingskenmerk is None


def test_een_onleesbare_regel_wordt_overgeslagen_en_de_rest_verwerkt():
    resultaat = lees("03-mt940-kapotte-regel.sta")

    assert resultaat.status == "gelezen"
    assert len(resultaat.transacties) == 2
    assert len(resultaat.redenen) == 1
    assert "niet te lezen" in resultaat.redenen[0]
    assert "overgeslagen" in resultaat.redenen[0]


def test_een_omschrijving_zonder_tags_wordt_gewoon_overgenomen():
    tekst = (
        ":20:TEST\n:25:NL91INGB0417164300\n"
        ":61:2607010701D50,00N123NONREF\n"
        ":86:Betaling aan NL02VDIJ0123456789 voor onderhoud\n"
    )
    transactie = lees_mt940(tekst).transacties[0]

    assert transactie.omschrijving == "Betaling aan NL02VDIJ0123456789 voor onderhoud"
    assert transactie.tegenrekening == "NL02VDIJ0123456789"


def test_een_afgebroken_omschrijving_wordt_weer_aan_elkaar_geplakt():
    """MT940 knipt lange regels af; die horen bij elkaar te blijven."""
    tekst = (
        ":20:TEST\n:25:NL91INGB0417164300\n"
        ":61:2607010701D50,00N123NONREF\n"
        ":86:/TRTP/SEPA/NAME/Van Dijk ICT-diensten/REMI/Factuur EF-2026\n"
        "-0101 onderhoud juli\n"
    )
    transactie = lees_mt940(tekst).transacties[0]

    assert transactie.omschrijving == "Factuur EF-2026-0101 onderhoud juli"


def test_een_bestand_zonder_boekingsregels_gaat_naar_review():
    resultaat = lees_mt940(":20:TEST\n:25:NL91INGB0417164300\n:62F:C260731EUR0,00\n")

    assert resultaat.status == "review_nodig"
    assert "geen enkele boekingsregel" in resultaat.redenen[0]


def test_een_bedrag_met_duizendtal():
    tekst = (
        ":20:TEST\n:25:NL91INGB0417164300\n"
        ":61:2607010701C1.250,50N123NONREF\n:86:/REMI/test\n"
    )
    assert lees_mt940(tekst).transacties[0].bedrag == Decimal("1250.50")


# --- CAMT.053 -----------------------------------------------------------

def test_camt_wordt_gelezen():
    resultaat = lees("02-camt053.xml")

    assert resultaat.status == "gelezen"
    assert resultaat.formaat == "camt053"
    assert resultaat.rekening == "NL91INGB0417164300"
    assert len(resultaat.transacties) == 4


def test_camt_en_mt940_geven_hetzelfde_afschrift():
    """Hetzelfde afschrift in twee formaten hoort hetzelfde te zijn."""
    velden = ("boekdatum", "bedrag", "tegenrekening", "tegenpartij",
              "omschrijving", "betalingskenmerk")
    uit_mt940 = lees("01-mt940-ing.sta").transacties
    uit_camt = lees("02-camt053.xml").transacties

    for links, rechts in zip(uit_mt940, uit_camt):
        for veld in velden:
            assert getattr(links, veld) == getattr(rechts, veld), veld


def test_camt_zonder_bedrag_slaat_die_regel_over():
    xml = b"""<?xml version="1.0"?>
    <Document xmlns="urn:iso:std:iso:20022:tech:xsd:camt.053.001.02">
      <BkToCstmrStmt><Stmt>
        <Acct><Id><IBAN>NL91INGB0417164300</IBAN></Id></Acct>
        <Ntry><CdtDbtInd>DBIT</CdtDbtInd></Ntry>
        <Ntry>
          <Amt Ccy="EUR">10.00</Amt><CdtDbtInd>DBIT</CdtDbtInd>
          <BookgDt><Dt>2026-07-01</Dt></BookgDt>
        </Ntry>
      </Stmt></BkToCstmrStmt>
    </Document>"""
    resultaat = lees_camt(xml)

    assert resultaat.status == "gelezen"
    assert len(resultaat.transacties) == 1
    assert "mist een bedrag" in resultaat.redenen[0]


def test_een_andere_camt_versie_wordt_ook_gelezen():
    """De versie achter de naamruimte verschilt per bank en per jaar."""
    xml = (BANKMAP / "02-camt053.xml").read_bytes().replace(
        b"camt.053.001.02", b"camt.053.001.08"
    )
    assert lees_camt(xml).status == "gelezen"


def test_xml_dat_geen_afschrift_is_wordt_geweigerd():
    resultaat = lees_camt(b"<Invoice><ID>1</ID></Invoice>")

    assert resultaat.status == "review_nodig"
    assert "geen CAMT.053-afschrift" in resultaat.redenen[0]


# --- veiligheid: dezelfde lezer als module 4 ----------------------------

def test_een_dtd_aanval_in_een_afschrift_wordt_geweigerd():
    aanval = (
        b'<?xml version="1.0"?>\n'
        b'<!DOCTYPE Document [ <!ENTITY lek SYSTEM "file:///etc/passwd"> ]>\n'
        b'<Document xmlns="urn:iso:std:iso:20022:tech:xsd:camt.053.001.02">'
        b"<Ntry>&lek;</Ntry></Document>"
    )
    resultaat = lees_bankbestand(aanval, "aanval.xml")

    assert resultaat.status == "review_nodig"
    assert "onveilige XML" in resultaat.redenen[0]
    assert "root:" not in str(resultaat.model_dump())


@pytest.mark.parametrize("groot_eerst", [False, True], ids=["utf-16-le", "utf-16-be"])
def test_dezelfde_aanval_in_utf16_ketst_ook_af(groot_eerst):
    resultaat = lees_bankbestand(_als_utf16(DTD_AANVAL, groot_eerst), "aanval.xml")

    assert resultaat.status == "review_nodig"
    assert any("onveilige XML" in reden for reden in resultaat.redenen)


def test_een_te_groot_bestand_wordt_niet_gelezen():
    resultaat = lees_bankbestand(b"x" * (MAX_XML_BYTES + 1), "groot.sta")

    assert resultaat.status == "review_nodig"
    assert "groter dan de grens" in resultaat.redenen[0]


# --- geen afschrift -----------------------------------------------------

def test_een_bestand_dat_geen_afschrift_is_wordt_geweigerd():
    resultaat = lees("04-geen-afschrift.txt")

    assert resultaat.status == "review_nodig"
    assert resultaat.transacties == []
    assert "geen MT940 en geen CAMT.053" in resultaat.redenen[0]
    assert "vraag bij je bank" in resultaat.redenen[0].lower()


def test_een_leeg_bestand_geeft_geen_exception():
    assert lees_bankbestand(b"", "leeg.sta").status == "review_nodig"


def test_kapotte_xml_geeft_geen_exception():
    resultaat = lees_bankbestand(b"<Document><Ntry>", "kapot.xml")

    assert resultaat.status == "review_nodig"
    assert resultaat.redenen


def test_het_formaat_komt_uit_de_inhoud_en_niet_uit_de_naam():
    """Een MT940 heet bij de ene bank .sta en bij de andere .txt."""
    inhoud = (BANKMAP / "01-mt940-ing.sta").read_bytes()

    assert lees_bankbestand(inhoud, "afschrift.xml").formaat == "mt940"
    assert lees_bankbestand(
        (BANKMAP / "02-camt053.xml").read_bytes(), "afschrift.sta"
    ).formaat == "camt053"


# --- vingerafdruk voor duplicaten ---------------------------------------

def test_dezelfde_transactie_geeft_dezelfde_vingerafdruk():
    eerste = lees("01-mt940-ing.sta").transacties
    tweede = lees("01-mt940-ing.sta").transacties

    assert [t.kenmerk() for t in eerste] == [t.kenmerk() for t in tweede]


def test_verschillende_transacties_geven_verschillende_vingerafdrukken():
    kenmerken = {t.kenmerk() for t in lees("01-mt940-ing.sta").transacties}

    assert len(kenmerken) == 4
