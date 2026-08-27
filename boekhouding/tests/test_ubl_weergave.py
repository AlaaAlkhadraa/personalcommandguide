"""Tests voor de leesbare weergave van een e-factuur (weergavelaag).

Deze laag mag niets bepalen: geen bedragen optellen, geen ontbrekend
veld invullen, geen bestand aanpassen. Wat hij wél moet doen is tonen
wat er in het bestand staat, met de UBL-plek erbij, zodat een mens het
naast de uitgelezen velden kan leggen.
"""

from pathlib import Path

import pytest

from boekhouding.ubl import MAX_XML_BYTES
from boekhouding.web.ubl_weergave import (
    GROEPEN,
    MAX_TOON_BYTES,
    NAAMRUIMTEN,
    _et_pad,
    leesbare_ubl,
)
from test_ubl import DTD_AANVAL, _als_utf16

UBLMAP = Path(__file__).parent / "testfacturen" / "ubl"


def lees(naam: str):
    return leesbare_ubl((UBLMAP / naam).read_bytes())


def _rijen(weergave, groep=None):
    """De rijen, eventueel beperkt tot één groep.

    Beperken kan nodig zijn: "Naam" staat zowel onder Leverancier als
    onder Afnemer, en op het scherm zegt de kop erboven welke het is.
    """
    return [
        rij
        for g in weergave.groepen
        if groep is None or g.titel == groep
        for rij in g.rijen
    ]


def rijen(weergave, groep=None) -> dict[str, object]:
    return {rij.label: rij.waarde for rij in _rijen(weergave, groep)}


def herkomsten(weergave, groep=None) -> dict[str, str]:
    return {rij.label: rij.herkomst for rij in _rijen(weergave, groep)}


# --- de gewone factuur --------------------------------------------------

def test_de_velden_komen_leesbaar_terug():
    weergave = lees("01-standaard-21procent.xml")
    assert weergave.status == "leesbaar"
    assert weergave.documentsoort == "factuur"

    waarden = rijen(weergave)
    assert waarden["Factuurnummer"] == "EF-2026-0101"
    assert waarden["Factuurdatum"] == "2026-07-14"
    assert rijen(weergave, "Leverancier")["Naam"] == "Van Dijk ICT-diensten"
    assert waarden["Bedrag excl. btw"] == "400.00"
    assert waarden["Totaal incl. btw"] == "484.00"
    assert waarden["Btw-percentage"] == "21.00%"
    assert waarden["Btw-bedrag"] == "84.00"


def test_bij_elk_veld_staat_waar_het_vandaan_komt():
    weergave = lees("01-standaard-21procent.xml")
    waar = herkomsten(weergave)
    assert waar["Factuurdatum"] == "cbc:IssueDate"
    assert waar["Bedrag excl. btw"] == "cac:LegalMonetaryTotal/cbc:TaxExclusiveAmount"
    assert herkomsten(weergave, "Leverancier")["Naam"] == (
        "cac:AccountingSupplierParty/cac:Party/cac:PartyName/cbc:Name"
    )


def test_de_getoonde_herkomst_is_het_pad_waarmee_gezocht_is():
    """Anders kan het label gaan afwijken van waar de waarde vandaan komt."""
    for _titel, velden in GROEPEN:
        for _label, paden, _kern in velden:
            for pad in paden:
                vertaald = _et_pad(pad)
                assert vertaald.count("{") == len(pad.split("/"))
                for voorvoegsel in pad.split("/"):
                    assert voorvoegsel.split(":")[0] in NAAMRUIMTEN


def test_de_factuurregels_komen_erbij():
    weergave = lees("01-standaard-21procent.xml")
    assert len(weergave.regels) == 1
    regel = weergave.regels[0]
    assert regel.omschrijving == "Onderhoud werkplekken juli 2026"
    assert regel.aantal == "1"
    assert regel.bedrag == "400.00"
    assert regel.btw_percentage == "21.00%"


def test_een_aanvullend_veld_zonder_waarde_wordt_weggelaten():
    """Anders wordt het scherm een lijst met lege regels."""
    weergave = lees("01-standaard-21procent.xml")
    # Deze factuur heeft geen cac:PaymentMeans, dus geen IBAN-regel.
    assert "IBAN" not in rijen(weergave)
    assert all(groep.titel != "Betaling" for groep in weergave.groepen)


# --- de lastige gevallen ------------------------------------------------

def test_een_ontbrekend_kernveld_blijft_zichtbaar():
    """Dat een verplicht veld er niet in staat, is juist wat je wilt zien."""
    weergave = lees("05-zonder-factuurdatum.xml")
    waarden = rijen(weergave)
    assert "Factuurdatum" in waarden
    assert waarden["Factuurdatum"] is None
    assert herkomsten(weergave)["Factuurdatum"] == "cbc:IssueDate"


def test_twee_btw_tarieven_worden_allebei_getoond():
    weergave = lees("04-twee-btw-tarieven.xml")
    waarden = rijen(weergave)
    assert waarden["Btw-percentage 1"] == "21.00%"
    assert waarden["Btw-bedrag 1"] == "21.00"
    assert waarden["Btw-percentage 2"] == "9.00%"
    assert waarden["Btw-bedrag 2"] == "18.00"


def test_bij_twee_tarieven_wordt_er_niets_opgeteld():
    """De weergavelaag rekent niet; 21 + 18 verschijnt hier nergens."""
    weergave = lees("04-twee-btw-tarieven.xml")
    alle = [rij.waarde for groep in weergave.groepen for rij in groep.rijen]
    assert "39.00" not in alle
    # En geen van beide tarieven wordt als hét btw-veld gepresenteerd.
    btw = [g for g in weergave.groepen if g.titel == "Btw"][0]
    assert not any(rij.kern for rij in btw.rijen)


def test_een_creditnota_wordt_als_creditnota_getoond():
    weergave = lees("03-creditnota.xml")
    assert weergave.documentsoort == "creditnota"
    assert "Creditnota" in weergave.soortnaam
    # De regels heten in een creditnota anders; ze horen er toch te staan.
    assert len(weergave.regels) == 1
    assert weergave.regels[0].omschrijving


def test_er_wordt_geen_teken_omgezet():
    """UBL noteert een creditnota positief; dat blijft hier ook zo staan."""
    weergave = lees("03-creditnota.xml")
    assert rijen(weergave)["Totaal incl. btw"] == "484.00"


# --- de ruwe XML --------------------------------------------------------

def test_de_ruwe_xml_blijft_beschikbaar():
    weergave = lees("01-standaard-21procent.xml")
    assert "<cbc:IssueDate>2026-07-14</cbc:IssueDate>" in weergave.ruwe_xml
    assert weergave.xml_afgekapt is False


def test_een_heel_groot_bestand_wordt_afgekapt():
    opvulling = b"<!-- " + b"x" * (MAX_TOON_BYTES + 1000) + b" -->"
    inhoud = (UBLMAP / "01-standaard-21procent.xml").read_bytes() + opvulling

    weergave = leesbare_ubl(inhoud)
    assert weergave.xml_afgekapt is True
    assert len(weergave.ruwe_xml.encode("utf-8")) <= MAX_TOON_BYTES


def test_boven_de_grens_van_module4_wordt_niet_gelezen():
    """Dezelfde grens als bij het verwerken; ook de weergave leest niet door."""
    inhoud = b"<Invoice>" + b" " * (MAX_XML_BYTES + 1) + b"</Invoice>"
    weergave = leesbare_ubl(inhoud)
    assert weergave.status == "onleesbaar"
    assert "groter dan de grens" in weergave.reden


def test_utf16_wordt_leesbaar_getoond():
    tekst = (UBLMAP / "01-standaard-21procent.xml").read_text(encoding="utf-8")
    tekst = tekst.replace('encoding="UTF-8"', 'encoding="UTF-16"')

    weergave = leesbare_ubl(_als_utf16(tekst, groot_eerst=False))
    assert weergave.status == "leesbaar"
    assert rijen(weergave)["Factuurnummer"] == "EF-2026-0101"
    assert "IssueDate" in weergave.ruwe_xml


# --- wat er niet doorheen mag ------------------------------------------

def test_een_dtd_aanval_wordt_ook_in_de_weergave_geweigerd():
    """De weergavelaag mag geen tweede, zwakkere ingang worden."""
    aanval = (
        b'<?xml version="1.0"?>\n'
        b'<!DOCTYPE Invoice [ <!ENTITY lek SYSTEM "file:///etc/passwd"> ]>\n'
        b"<Invoice><ID>&lek;</ID></Invoice>"
    )
    weergave = leesbare_ubl(aanval)
    assert weergave.status == "onleesbaar"
    assert "DTD" in weergave.reden
    assert weergave.groepen == []
    assert "root:" not in str(weergave.model_dump())


@pytest.mark.parametrize("groot_eerst", [False, True], ids=["utf-16-le", "utf-16-be"])
def test_dezelfde_aanval_in_utf16_ketst_ook_af(groot_eerst):
    weergave = leesbare_ubl(_als_utf16(DTD_AANVAL, groot_eerst))
    assert weergave.status == "onleesbaar"
    assert "DTD" in weergave.reden


def test_xml_dat_geen_efactuur_is_wordt_niet_gelezen():
    weergave = leesbare_ubl(b"<html><body>geen factuur</body></html>")
    assert weergave.status == "onleesbaar"
    assert "geen UBL" in weergave.reden
    # De ruwe tekst blijft wel te zien; een mens moet kunnen kijken.
    assert "geen factuur" in weergave.ruwe_xml


def test_kapotte_xml_geeft_geen_exception():
    weergave = leesbare_ubl(b"<Invoice><cbc:ID>kapot")
    assert weergave.status == "onleesbaar"
    assert weergave.reden


def test_leeg_bestand_geeft_geen_exception():
    weergave = leesbare_ubl(b"")
    assert weergave.status == "onleesbaar"
