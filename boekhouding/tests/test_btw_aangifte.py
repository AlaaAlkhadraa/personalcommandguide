"""Tests voor de btw-aangifte per kwartaal.

Twee dingen worden hier bewezen: dat de rubrieken kloppen, en dat er
niets wordt uitgerekend zolang er in dat kwartaal nog een factuur open
staat.
"""

from datetime import date
from decimal import Decimal

import pytest

from boekhouding import (
    bereken_aangifte,
    boek_factuur,
    keur_factuur_goed,
    kies_rekening,
    kwartaal_grenzen,
    kwartaal_van,
    maak_administratie,
    maak_tabellen,
    maak_tegenboeking,
    maak_verbinding,
    sla_factuur_op,
    zoek_blokkades,
)

VANDAAG = date(2026, 12, 31)


@pytest.fixture
def conn(tmp_path):
    verbinding = maak_verbinding(str(tmp_path / "boekhouding.sqlite"))
    maak_tabellen(verbinding)
    maak_administratie(verbinding, "Zaak van Alaa")
    yield verbinding
    verbinding.close()


def zet_factuur(
    conn, nummer, datum, excl, percentage, btw, incl, rekening,
    goedkeuren=True, boeken=True, leverancier="Van Dijk ICT-diensten",
):
    """Zet een factuur neer en loop de keten af tot waar de test hem wil."""
    factuur_id, resultaat = sla_factuur_op(
        conn, 1,
        {
            "leverancier": leverancier, "factuurdatum": datum,
            "factuurnummer": nummer, "bedrag_excl": excl,
            "btw_percentage": percentage, "btw_bedrag": btw, "bedrag_incl": incl,
        },
        vandaag=VANDAAG,
    )
    if rekening:
        kies_rekening(conn, factuur_id, rekening)
    if goedkeuren and resultaat.status == "gevalideerd":
        keur_factuur_goed(conn, factuur_id)
        if boeken:
            boek_factuur(conn, factuur_id)
    return factuur_id


def volledig_kwartaal(conn):
    """Q3 2026: twee verkopen (21% en 9%) en een inkoop."""
    zet_factuur(conn, "V-1", "2026-07-10", "1000.00", "21", "210.00", "1210.00", "8000")
    zet_factuur(conn, "V-2", "2026-08-05", "500.00", "9", "45.00", "545.00", "8010")
    zet_factuur(conn, "I-1", "2026-07-20", "200.00", "21", "42.00", "242.00", "4100")


# --- kwartaalgrenzen ----------------------------------------------------

def test_eenendertig_maart_is_q1_en_een_april_is_q2():
    assert kwartaal_van(date(2026, 3, 31)) == 1
    assert kwartaal_van(date(2026, 4, 1)) == 2


def test_elke_maand_valt_in_het_juiste_kwartaal():
    verwacht = [1, 1, 1, 2, 2, 2, 3, 3, 3, 4, 4, 4]
    for maand, kwartaal in enumerate(verwacht, start=1):
        assert kwartaal_van(date(2026, maand, 1)) == kwartaal


def test_de_grenzen_van_elk_kwartaal():
    assert kwartaal_grenzen(2026, 1) == (date(2026, 1, 1), date(2026, 3, 31))
    assert kwartaal_grenzen(2026, 2) == (date(2026, 4, 1), date(2026, 6, 30))
    assert kwartaal_grenzen(2026, 3) == (date(2026, 7, 1), date(2026, 9, 30))
    assert kwartaal_grenzen(2026, 4) == (date(2026, 10, 1), date(2026, 12, 31))


def test_februari_in_een_schrikkeljaar():
    assert kwartaal_grenzen(2024, 1)[1] == date(2024, 3, 31)
    assert kwartaal_grenzen(2100, 1)[0] == date(2100, 1, 1)


def test_een_kwartaal_dat_niet_bestaat():
    with pytest.raises(ValueError, match="kwartaal 5"):
        kwartaal_grenzen(2026, 5)


def test_een_factuur_van_31_maart_telt_in_q1_en_niet_in_q2(conn):
    zet_factuur(conn, "V-1", "2026-03-31", "100.00", "21", "21.00", "121.00", "8000")

    q1 = bereken_aangifte(conn, 1, 2026, 1)
    q2 = bereken_aangifte(conn, 1, 2026, 2)
    assert q1.rubrieken[0].btw == Decimal("21.00")
    assert q2.rubrieken[0].btw == Decimal("0.00")


def test_een_factuur_van_1_april_telt_in_q2_en_niet_in_q1(conn):
    zet_factuur(conn, "V-1", "2026-04-01", "100.00", "21", "21.00", "121.00", "8000")

    assert bereken_aangifte(conn, 1, 2026, 1).rubrieken[0].btw == Decimal("0.00")
    assert bereken_aangifte(conn, 1, 2026, 2).rubrieken[0].btw == Decimal("21.00")


# --- de rubrieken -------------------------------------------------------

def test_een_volledig_kwartaal_van_upload_tot_voorstel(conn):
    volledig_kwartaal(conn)
    aangifte = bereken_aangifte(conn, 1, 2026, 3)

    assert aangifte.status == "voorstel"
    assert aangifte.aantal_boekingen == 3

    rubriek_1a, rubriek_1b = aangifte.rubrieken
    assert (rubriek_1a.code, rubriek_1a.grondslag, rubriek_1a.btw) == (
        "1a", Decimal("1000.00"), Decimal("210.00")
    )
    assert (rubriek_1b.code, rubriek_1b.grondslag, rubriek_1b.btw) == (
        "1b", Decimal("500.00"), Decimal("45.00")
    )
    assert aangifte.verschuldigd == Decimal("255.00")   # 5a
    assert aangifte.voorbelasting == Decimal("42.00")   # 5b
    assert aangifte.saldo == Decimal("213.00")
    assert aangifte.saldo_richting == "betalen"


def test_meer_voorbelasting_dan_btw_geeft_terug_te_vragen(conn):
    zet_factuur(conn, "I-1", "2026-07-20", "1000.00", "21", "210.00", "1210.00", "4100")
    aangifte = bereken_aangifte(conn, 1, 2026, 3)

    assert aangifte.saldo == Decimal("-210.00")
    assert aangifte.saldo_richting == "terugvragen"


def test_een_leeg_kwartaal_geeft_nullen_en_geen_fout(conn):
    aangifte = bereken_aangifte(conn, 1, 2026, 2)

    assert aangifte.status == "voorstel"
    assert aangifte.saldo == Decimal("0.00")
    assert aangifte.aantal_boekingen == 0
    # Nul is geen teruggave; dat zou het scherm laten liegen.
    assert aangifte.saldo_richting == "niets"


def test_een_tegenboeking_haalt_het_bedrag_er_weer_af(conn):
    zet_factuur(conn, "V-1", "2026-07-10", "1000.00", "21", "210.00", "1210.00", "8000")
    boeking = bereken_aangifte(conn, 1, 2026, 3)
    assert boeking.verschuldigd == Decimal("210.00")

    from boekhouding import lees_boekingen
    maak_tegenboeking(conn, lees_boekingen(conn, 1)[0]["id"], "factuur ingetrokken")

    na = bereken_aangifte(conn, 1, 2026, 3)
    assert na.verschuldigd == Decimal("0.00")
    assert na.rubrieken[0].grondslag == Decimal("0.00")
    assert na.aantal_boekingen == 2


def test_omzet_zonder_btw_wordt_gemeld_en_niet_weggelaten(conn):
    """0%, vrijgesteld of verlegd hoort in 1e/2a/3a; die zijn er nog niet."""
    zet_factuur(conn, "V-1", "2026-07-10", "300.00", "0", "0.00", "300.00", "8020")
    aangifte = bereken_aangifte(conn, 1, 2026, 3)

    assert aangifte.status == "voorstel"
    assert any("300.00" in w for w in aangifte.waarschuwingen)
    assert any("1e" in w for w in aangifte.waarschuwingen)


def test_een_jaar_zonder_rekeningschema_wordt_niet_berekend(conn):
    aangifte = bereken_aangifte(conn, 1, 1999, 1)

    assert aangifte.status == "geblokkeerd"
    assert "geen rekeningschema" in aangifte.redenen[0]
    assert aangifte.saldo is None


# --- blokkades ----------------------------------------------------------

def test_een_factuur_in_review_blokkeert_de_aangifte(conn):
    volledig_kwartaal(conn)
    # Bedragen die niet optellen: komt door geen enkele controle heen.
    zet_factuur(conn, "V-9", "2026-09-15", "100.00", "21", "21.00", "999.00", "8000")

    aangifte = bereken_aangifte(conn, 1, 2026, 3)
    assert aangifte.status == "geblokkeerd"
    assert aangifte.saldo is None and aangifte.rubrieken == []
    assert [b.reden for b in aangifte.blokkades] == ["moet nog nagekeken worden"]


def test_een_factuur_zonder_goedkeuring_blokkeert_ook(conn):
    zet_factuur(conn, "V-1", "2026-07-10", "100.00", "21", "21.00", "121.00", "8000",
                goedkeuren=False)

    aangifte = bereken_aangifte(conn, 1, 2026, 3)
    assert aangifte.status == "geblokkeerd"
    assert "nog niet goedgekeurd" in aangifte.blokkades[0].reden


def test_goedgekeurd_maar_niet_geboekt_blokkeert_ook(conn):
    """Anders zou het bedrag stilletjes uit de aangifte verdwijnen."""
    zet_factuur(conn, "V-1", "2026-07-10", "100.00", "21", "21.00", "121.00",
                rekening=None)

    aangifte = bereken_aangifte(conn, 1, 2026, 3)
    assert aangifte.status == "geblokkeerd"
    assert "geen grootboekrekening gekozen" in aangifte.blokkades[0].reden


def test_de_blokkade_zegt_om_welke_factuur_het_gaat(conn):
    factuur_id = zet_factuur(
        conn, "V-1", "2026-07-10", "100.00", "21", "21.00", "121.00", "8000",
        goedkeuren=False, leverancier="Groothandel Oost",
    )
    blokkade = bereken_aangifte(conn, 1, 2026, 3).blokkades[0]

    assert blokkade.factuur_id == factuur_id
    assert blokkade.leverancier == "Groothandel Oost"
    assert blokkade.factuurdatum == "2026-07-10"
    assert blokkade.bedrag_incl == "121.00"


def test_een_blokkade_in_q3_blokkeert_q4_niet(conn):
    zet_factuur(conn, "V-1", "2026-07-10", "100.00", "21", "21.00", "121.00", "8000",
                goedkeuren=False)
    zet_factuur(conn, "V-2", "2026-10-10", "100.00", "21", "21.00", "121.00", "8000")

    assert bereken_aangifte(conn, 1, 2026, 3).status == "geblokkeerd"
    assert bereken_aangifte(conn, 1, 2026, 4).status == "voorstel"


def test_zoek_blokkades_kijkt_alleen_in_de_periode(conn):
    zet_factuur(conn, "V-1", "2026-07-10", "100.00", "21", "21.00", "121.00", "8000",
                goedkeuren=False)

    assert zoek_blokkades(conn, 1, date(2026, 7, 1), date(2026, 9, 30))
    assert zoek_blokkades(conn, 1, date(2026, 10, 1), date(2026, 12, 31)) == []


def test_een_factuur_zonder_datum_wordt_gemeld_maar_blokkeert_niet(conn):
    """Zonder datum valt hij in geen enkel kwartaal; stil weglaten mag niet."""
    sla_factuur_op(
        conn, 1,
        {"leverancier": "Van Dijk", "factuurnummer": "X-1",
         "bedrag_excl": "100.00", "btw_percentage": "21",
         "btw_bedrag": "21.00", "bedrag_incl": "121.00"},
        vandaag=VANDAAG,
    )
    aangifte = bereken_aangifte(conn, 1, 2026, 3)

    assert aangifte.status == "voorstel"
    assert any("zonder factuurdatum" in w for w in aangifte.waarschuwingen)


def test_de_aangifte_zegt_dat_de_eigenaar_zelf_indient(conn):
    aangifte = bereken_aangifte(conn, 1, 2026, 3)
    assert "indienen doet u zelf" in aangifte.voorbehoud.lower()
    assert "verstuurt niets" in aangifte.voorbehoud


def test_een_kwartaal_met_alleen_inkoop_en_verkoop_die_elkaar_opheffen(conn):
    """Precies nul is geen teruggave; dat moet het scherm ook niet zeggen."""
    zet_factuur(conn, "V-1", "2026-07-10", "100.00", "21", "21.00", "121.00", "8000")
    zet_factuur(conn, "I-1", "2026-07-11", "100.00", "21", "21.00", "121.00", "4100")

    aangifte = bereken_aangifte(conn, 1, 2026, 3)
    assert aangifte.verschuldigd == aangifte.voorbelasting == Decimal("21.00")
    assert aangifte.saldo == Decimal("0.00")
    assert aangifte.saldo_richting == "niets"
