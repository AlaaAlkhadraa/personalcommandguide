"""Tests voor het afletteren: banktransacties aan facturen koppelen.

Drie dingen worden hier bewezen. Dat een exacte match ook echt exact is
(nummer én bedrag). Dat een deelbetaling of verzamelbetaling nooit
automatisch wordt gekoppeld. En dat een bevestiging een kloppende
boeking oplevert — crediteuren tegen bank, of andersom bij ontvangst.
"""

from datetime import date
from decimal import Decimal
from pathlib import Path

import pytest

from boekhouding import (
    boek_factuur,
    importeer_bankafschrift,
    keur_factuur_goed,
    kies_rekening,
    koppel_transactie,
    lees_audit_trail,
    lees_banktransacties,
    lees_boeking,
    maak_administratie,
    maak_tabellen,
    maak_verbinding,
    namen_lijken_op_elkaar,
    open_facturen,
    sla_factuur_op,
    zoek_voorstel,
)

BANKMAP = Path(__file__).parent / "testfacturen" / "bank"
VANDAAG = date(2026, 12, 31)


@pytest.fixture
def conn(tmp_path):
    verbinding = maak_verbinding(str(tmp_path / "boekhouding.sqlite"))
    maak_tabellen(verbinding)
    maak_administratie(verbinding, "Zaak van Alaa")
    yield verbinding
    verbinding.close()


@pytest.fixture
def opslag(tmp_path):
    return str(tmp_path / "opslag")


def zet_factuur(conn, leverancier, nummer, datum, excl, pct, btw, incl, rekening):
    """Een factuur van upload tot boeking, want alleen geboekte tellen mee."""
    factuur_id, _ = sla_factuur_op(
        conn, 1,
        {"leverancier": leverancier, "factuurdatum": datum,
         "factuurnummer": nummer, "bedrag_excl": excl,
         "btw_percentage": pct, "btw_bedrag": btw, "bedrag_incl": incl},
        vandaag=VANDAAG,
    )
    kies_rekening(conn, factuur_id, rekening)
    keur_factuur_goed(conn, factuur_id)
    boek_factuur(conn, factuur_id)
    return factuur_id


def inkoop(conn, nummer="EF-2026-0101", incl="484.00", excl="400.00",
           btw="84.00", leverancier="Van Dijk ICT-diensten"):
    return zet_factuur(conn, leverancier, nummer, "2026-07-01", excl, "21",
                       btw, incl, "4120")


def verkoop(conn, nummer="V-2026-014", incl="2904.00", excl="2400.00",
            btw="504.00", klant="Alkhadraa Advies"):
    return zet_factuur(conn, klant, nummer, "2026-07-02", excl, "21",
                       btw, incl, "8000")


def transactie(bedrag, omschrijving="", tegenpartij=None, kenmerk=None):
    return {
        "bedrag": bedrag, "omschrijving": omschrijving,
        "tegenpartij": tegenpartij, "betalingskenmerk": kenmerk,
        "boekdatum": "2026-07-10",
    }


# --- importeren in de database ------------------------------------------

def test_een_afschrift_inlezen_zet_de_transacties_erin(conn, opslag):
    inhoud = (BANKMAP / "01-mt940-ing.sta").read_bytes()

    samenvatting = importeer_bankafschrift(conn, 1, "juli.sta", inhoud, opslag)

    assert samenvatting["status"] == "gelezen"
    assert samenvatting["formaat"] == "mt940"
    assert samenvatting["nieuw"] == 4
    assert samenvatting["al_bekend"] == 0
    assert len(lees_banktransacties(conn, 1)) == 4


def test_hetzelfde_afschrift_twee_keer_voegt_niets_toe(conn, opslag):
    inhoud = (BANKMAP / "01-mt940-ing.sta").read_bytes()
    importeer_bankafschrift(conn, 1, "juli.sta", inhoud, opslag)

    tweede = importeer_bankafschrift(conn, 1, "juli-kopie.sta", inhoud, opslag)

    assert tweede["nieuw"] == 0
    assert tweede["al_bekend"] == 4
    assert any("stonden er al" in reden for reden in tweede["redenen"])
    assert len(lees_banktransacties(conn, 1)) == 4


def test_hetzelfde_afschrift_in_het_andere_formaat_ook_niet(conn, opslag):
    """MT940 en CAMT van dezelfde maand zijn dezelfde transacties."""
    importeer_bankafschrift(
        conn, 1, "juli.sta", (BANKMAP / "01-mt940-ing.sta").read_bytes(), opslag
    )
    tweede = importeer_bankafschrift(
        conn, 1, "juli.xml", (BANKMAP / "02-camt053.xml").read_bytes(), opslag
    )

    assert tweede["nieuw"] == 0
    assert len(lees_banktransacties(conn, 1)) == 4


def test_een_onleesbaar_bestand_zet_niets_in_de_database(conn, opslag):
    samenvatting = importeer_bankafschrift(
        conn, 1, "brief.txt",
        (BANKMAP / "04-geen-afschrift.txt").read_bytes(), opslag,
    )

    assert samenvatting["status"] == "review_nodig"
    assert samenvatting["afschrift_id"] is None
    assert lees_banktransacties(conn, 1) == []


def test_de_kapotte_regel_houdt_de_rest_niet_tegen(conn, opslag):
    samenvatting = importeer_bankafschrift(
        conn, 1, "augustus.sta",
        (BANKMAP / "03-mt940-kapotte-regel.sta").read_bytes(), opslag,
    )

    assert samenvatting["nieuw"] == 2
    assert any("overgeslagen" in reden for reden in samenvatting["redenen"])


def test_elke_transactie_komt_in_de_audit_trail(conn, opslag):
    importeer_bankafschrift(
        conn, 1, "juli.sta", (BANKMAP / "01-mt940-ing.sta").read_bytes(), opslag
    )
    eerste = lees_banktransacties(conn, 1)[0]

    trail = lees_audit_trail(conn, eerste["id"], tabel="banktransacties")
    assert trail and trail[0]["actie"] == "aangemaakt"


def test_het_originele_afschrift_wordt_bewaard(conn, opslag, tmp_path):
    importeer_bankafschrift(
        conn, 1, "juli.sta", (BANKMAP / "01-mt940-ing.sta").read_bytes(), opslag
    )

    bewaard = list(Path(opslag).rglob("*.sta"))
    assert len(bewaard) == 1
    assert bewaard[0].read_bytes() == (BANKMAP / "01-mt940-ing.sta").read_bytes()


# --- a. exacte match ----------------------------------------------------

def test_nummer_in_de_omschrijving_en_bedrag_klopt_is_een_exacte_match(conn):
    factuur_id = inkoop(conn)

    voorstel = zoek_voorstel(
        transactie("-484.00", "Factuur EF-2026-0101 onderhoud juli",
                   "Van Dijk ICT-diensten"),
        open_facturen(conn, 1),
    )

    assert voorstel.soort == "exact"
    assert voorstel.zekerheid == "hoog"
    assert voorstel.factuur_id == factuur_id


def test_het_nummer_mag_ook_in_het_betalingskenmerk_staan(conn):
    inkoop(conn)

    voorstel = zoek_voorstel(
        transactie("-484.00", "SEPA overboeking", "Van Dijk",
                   kenmerk="EF-2026-0101"),
        open_facturen(conn, 1),
    )
    assert voorstel.soort == "exact"


def test_de_schrijfwijze_van_het_nummer_maakt_niet_uit(conn):
    """'EF 2026 0101' en 'ef20260101' zijn hetzelfde nummer."""
    inkoop(conn)
    facturen = open_facturen(conn, 1)

    for geschreven in ("EF 2026 0101", "ef20260101", "ref: EF-2026-0101."):
        voorstel = zoek_voorstel(transactie("-484.00", geschreven), facturen)
        assert voorstel.soort == "exact", geschreven


def test_een_ontvangst_matcht_op_een_verkoopfactuur(conn):
    factuur_id = verkoop(conn)

    voorstel = zoek_voorstel(
        transactie("2904.00", "Betaling factuur V-2026-014", "Alkhadraa Advies"),
        open_facturen(conn, 1),
    )

    assert voorstel.soort == "exact"
    assert voorstel.factuur_id == factuur_id


def test_een_afschrijving_matcht_niet_op_een_verkoopfactuur(conn):
    """Geld eraf hoort bij een inkoopfactuur; de richting moet kloppen."""
    verkoop(conn)

    voorstel = zoek_voorstel(
        transactie("-2904.00", "Betaling factuur V-2026-014", "Alkhadraa Advies"),
        open_facturen(conn, 1),
    )
    assert voorstel.soort == "geen"


def test_een_heel_kort_factuurnummer_wordt_niet_opgezocht(conn):
    """'7' komt in bijna elke omschrijving voor."""
    zet_factuur(conn, "Van Dijk ICT-diensten", "7", "2026-07-01",
                "400.00", "21", "84.00", "484.00", "4120")

    voorstel = zoek_voorstel(
        transactie("-484.00", "betaling week 7 2026"), open_facturen(conn, 1)
    )
    assert voorstel.soort != "exact"


# --- b. bedrag klopt, naam lijkt erop -----------------------------------

def test_bedrag_klopt_en_naam_lijkt_erop_geeft_lage_zekerheid(conn):
    factuur_id = inkoop(conn)

    voorstel = zoek_voorstel(
        transactie("-484.00", "SEPA overboeking", "Van Dijk ICT diensten BV"),
        open_facturen(conn, 1),
    )

    assert voorstel.soort == "waarschijnlijk"
    assert voorstel.zekerheid == "laag"
    assert voorstel.factuur_id == factuur_id
    assert "geen factuurnummer" in voorstel.uitleg


def test_bedrag_klopt_maar_naam_niet_geeft_geen_voorstel(conn):
    """Alleen een bedrag is te weinig; dan koppelt de eigenaar zelf."""
    inkoop(conn)

    voorstel = zoek_voorstel(
        transactie("-484.00", "SEPA overboeking", "Tuincentrum Zuid"),
        open_facturen(conn, 1),
    )

    assert voorstel.soort == "geen"
    assert voorstel.zekerheid is None
    assert voorstel.factuur_id is None
    assert "lijkt daar niet op" in voorstel.uitleg


def test_twee_facturen_met_hetzelfde_bedrag_worden_niet_geraden(conn):
    inkoop(conn, nummer="EF-2026-0101")
    inkoop(conn, nummer="EF-2026-0102")

    voorstel = zoek_voorstel(
        transactie("-484.00", "SEPA overboeking", "Van Dijk ICT-diensten"),
        open_facturen(conn, 1),
    )

    assert voorstel.soort == "handmatig"
    assert len(voorstel.kandidaten) == 2


def test_namen_vergelijken():
    assert namen_lijken_op_elkaar("KPN B.V.", "KPN")
    assert namen_lijken_op_elkaar("Bakkerij de Korenaar", "Bakkerij Korenaar B.V.")
    assert not namen_lijken_op_elkaar("KPN", "Van Dijk ICT-diensten")
    assert not namen_lijken_op_elkaar("", "Van Dijk")


# --- c. deelbetaling en verzamelbetaling --------------------------------

def test_een_deelbetaling_wordt_nooit_automatisch_gekoppeld(conn):
    factuur_id = inkoop(conn)

    voorstel = zoek_voorstel(
        transactie("-200.00", "Eerste termijn factuur EF-2026-0101"),
        open_facturen(conn, 1),
    )

    assert voorstel.soort == "handmatig"
    assert voorstel.zekerheid is None
    assert voorstel.kandidaten == [factuur_id]
    assert "deelbetaling" in voorstel.uitleg
    assert "met de hand" in voorstel.uitleg


def test_een_verzamelbetaling_met_meerdere_nummers_wordt_niet_gekoppeld(conn):
    inkoop(conn, nummer="EF-2026-0101", incl="484.00")
    inkoop(conn, nummer="EF-2026-0102", incl="242.00", excl="200.00", btw="42.00")

    voorstel = zoek_voorstel(
        transactie("-726.00", "Betaling EF-2026-0101 en EF-2026-0102"),
        open_facturen(conn, 1),
    )

    assert voorstel.soort == "handmatig"
    assert len(voorstel.kandidaten) == 2
    assert "meerdere factuurnummers" in voorstel.uitleg
    assert "samen zijn ze precies dit bedrag" in voorstel.uitleg


def test_een_verzamelbetaling_zonder_nummers_wordt_herkend_op_het_totaal(conn):
    inkoop(conn, nummer="EF-2026-0101", incl="484.00")
    inkoop(conn, nummer="EF-2026-0102", incl="242.00", excl="200.00", btw="42.00")

    voorstel = zoek_voorstel(
        transactie("-726.00", "SEPA verzamelbetaling", "Van Dijk ICT-diensten"),
        open_facturen(conn, 1),
    )

    assert voorstel.soort == "handmatig"
    assert "verzamelbetaling" in voorstel.uitleg
    assert len(voorstel.kandidaten) == 2


def test_een_bedrag_hoger_dan_de_factuur_wordt_ook_handmatig(conn):
    inkoop(conn)

    voorstel = zoek_voorstel(
        transactie("-600.00", "Factuur EF-2026-0101 plus iets"),
        open_facturen(conn, 1),
    )

    assert voorstel.soort == "handmatig"
    assert "hoger dan de factuur" in voorstel.uitleg


# --- d. geen match ------------------------------------------------------

def test_zonder_openstaande_facturen_is_er_geen_voorstel(conn):
    voorstel = zoek_voorstel(transactie("-75.00", "Maandnota KPN"), [])

    assert voorstel.soort == "geen"
    assert "geen openstaande factuur gevonden" in voorstel.uitleg


def test_een_transactie_die_nergens_bij_hoort_blijft_open(conn):
    inkoop(conn)

    voorstel = zoek_voorstel(
        transactie("-75.00", "Maandnota telefonie juli", "KPN B.V."),
        open_facturen(conn, 1),
    )
    assert voorstel.soort == "geen"


def test_een_al_gekoppelde_factuur_telt_niet_meer_mee(conn, opslag):
    factuur_id = inkoop(conn)
    importeer_bankafschrift(
        conn, 1, "juli.sta", (BANKMAP / "01-mt940-ing.sta").read_bytes(), opslag
    )
    betaling = [
        t for t in lees_banktransacties(conn, 1) if t["bedrag"] == "-484.00"
    ][0]
    koppel_transactie(conn, betaling["id"], factuur_id)

    assert [f["id"] for f in open_facturen(conn, 1)] == []


# --- de boeking bij bevestiging -----------------------------------------

def test_bevestigen_boekt_crediteuren_tegen_bank(conn, opslag):
    factuur_id = inkoop(conn)
    importeer_bankafschrift(
        conn, 1, "juli.sta", (BANKMAP / "01-mt940-ing.sta").read_bytes(), opslag
    )
    betaling = [
        t for t in lees_banktransacties(conn, 1) if t["bedrag"] == "-484.00"
    ][0]

    boeking_id, redenen = koppel_transactie(conn, betaling["id"], factuur_id)

    assert redenen == []
    boeking = lees_boeking(conn, boeking_id)
    assert [(r["rekening"], r["debet"], r["credit"]) for r in boeking["regels"]] == [
        ("1600", "484.00", "0.00"),     # crediteuren debet: de schuld is weg
        ("1100", "0.00", "484.00"),     # bank credit: het geld is eraf
    ]
    assert boeking["boekdatum"] == "2026-07-01"


def test_bevestigen_van_een_ontvangst_boekt_bank_tegen_debiteuren(conn, opslag):
    factuur_id = verkoop(conn)
    importeer_bankafschrift(
        conn, 1, "juli.sta", (BANKMAP / "01-mt940-ing.sta").read_bytes(), opslag
    )
    ontvangst = [
        t for t in lees_banktransacties(conn, 1) if t["bedrag"] == "2904.00"
    ][0]

    boeking_id, _ = koppel_transactie(conn, ontvangst["id"], factuur_id)

    boeking = lees_boeking(conn, boeking_id)
    assert [(r["rekening"], r["debet"], r["credit"]) for r in boeking["regels"]] == [
        ("1100", "2904.00", "0.00"),
        ("1300", "0.00", "2904.00"),
    ]


def test_de_koppeling_komt_in_de_audit_trail(conn, opslag):
    factuur_id = inkoop(conn)
    importeer_bankafschrift(
        conn, 1, "juli.sta", (BANKMAP / "01-mt940-ing.sta").read_bytes(), opslag
    )
    betaling = [
        t for t in lees_banktransacties(conn, 1) if t["bedrag"] == "-484.00"
    ][0]
    koppel_transactie(conn, betaling["id"], factuur_id)

    velden = [
        r["veld"]
        for r in lees_audit_trail(conn, betaling["id"], tabel="banktransacties")
    ]
    assert "factuur_id" in velden


def test_twee_keer_koppelen_gebeurt_niet(conn, opslag):
    factuur_id = inkoop(conn)
    importeer_bankafschrift(
        conn, 1, "juli.sta", (BANKMAP / "01-mt940-ing.sta").read_bytes(), opslag
    )
    betaling = [
        t for t in lees_banktransacties(conn, 1) if t["bedrag"] == "-484.00"
    ][0]
    koppel_transactie(conn, betaling["id"], factuur_id)

    nogmaals, redenen = koppel_transactie(conn, betaling["id"], factuur_id)
    assert nogmaals is None
    assert "al gekoppeld" in redenen[0]


def test_een_factuur_hangt_maar_aan_een_transactie(conn, opslag):
    factuur_id = inkoop(conn)
    importeer_bankafschrift(
        conn, 1, "juli.sta", (BANKMAP / "01-mt940-ing.sta").read_bytes(), opslag
    )
    transacties = lees_banktransacties(conn, 1)
    betaling = [t for t in transacties if t["bedrag"] == "-484.00"][0]
    andere = [t for t in transacties if t["bedrag"] == "-272.50"][0]
    koppel_transactie(conn, betaling["id"], factuur_id)

    tweede, redenen = koppel_transactie(conn, andere["id"], factuur_id)
    assert tweede is None
    assert "hangt al aan banktransactie" in redenen[0]


def test_de_verkeerde_richting_wordt_geweigerd(conn, opslag):
    """Een afschrijving koppelen aan een verkoopfactuur klopt niet."""
    factuur_id = verkoop(conn)
    importeer_bankafschrift(
        conn, 1, "juli.sta", (BANKMAP / "01-mt940-ing.sta").read_bytes(), opslag
    )
    betaling = [
        t for t in lees_banktransacties(conn, 1) if t["bedrag"] == "-484.00"
    ][0]

    boeking_id, redenen = koppel_transactie(conn, betaling["id"], factuur_id)
    assert boeking_id is None
    assert "richting klopt niet" in redenen[0]


def test_een_ongeboekte_factuur_kan_niet_worden_gekoppeld(conn, opslag):
    factuur_id, _ = sla_factuur_op(
        conn, 1,
        {"leverancier": "Van Dijk ICT-diensten", "factuurdatum": "2026-07-01",
         "factuurnummer": "EF-2026-0199", "bedrag_excl": "400.00",
         "btw_percentage": "21", "btw_bedrag": "84.00", "bedrag_incl": "484.00"},
        vandaag=VANDAAG,
    )
    importeer_bankafschrift(
        conn, 1, "juli.sta", (BANKMAP / "01-mt940-ing.sta").read_bytes(), opslag
    )
    betaling = [
        t for t in lees_banktransacties(conn, 1) if t["bedrag"] == "-484.00"
    ][0]

    boeking_id, redenen = koppel_transactie(conn, betaling["id"], factuur_id)
    assert boeking_id is None
    assert "boek de factuur eerst" in redenen[0]
