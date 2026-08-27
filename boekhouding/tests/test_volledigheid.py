"""Tests voor de volledigheidscontroles.

Deze controles gaan over wat er níét is: een factuur die nooit is
aangeleverd staat nergens, dus er valt niets op te blokkeren. Ze
waarschuwen en houden de aangifte nooit tegen.

Bij elke controle staat ook de rustige situatie: als er niets aan de
hand is, hoort er ook niets te worden gemeld. Een systeem dat elk
kwartaal iets roept wordt weggeklikt.
"""

from datetime import date

import pytest

from boekhouding import (
    afwijkend_aantal,
    bereken_aangifte,
    gaten_in_factuurnummers,
    maak_administratie,
    maak_tabellen,
    maak_verbinding,
    ontbrekende_leveranciers,
    sla_factuur_op,
    zoek_signalen,
)

VANDAAG = date(2026, 12, 31)
Q3 = (date(2026, 7, 1), date(2026, 9, 30))


@pytest.fixture
def conn(tmp_path):
    verbinding = maak_verbinding(str(tmp_path / "boekhouding.sqlite"))
    maak_tabellen(verbinding)
    maak_administratie(verbinding, "Zaak van Alaa")
    yield verbinding
    verbinding.close()


def zet_factuur(conn, leverancier, nummer, datum, bedrag="100.00"):
    """Een gewone, kloppende factuur — status doet er hier niet toe."""
    btw = "21.00" if bedrag == "100.00" else "0.00"
    incl = "121.00" if bedrag == "100.00" else bedrag
    factuur_id, _ = sla_factuur_op(
        conn, 1,
        {
            "leverancier": leverancier, "factuurdatum": datum,
            "factuurnummer": nummer, "bedrag_excl": bedrag,
            "btw_percentage": "21" if btw != "0.00" else "0",
            "btw_bedrag": btw, "bedrag_incl": incl,
        },
        vandaag=VANDAAG,
    )
    return factuur_id


def maandelijks(conn, leverancier, maanden, jaar=2026, voorloop="KPN-"):
    """Zet elke maand één factuur neer voor deze leverancier."""
    for nummer, maand in enumerate(maanden, start=1):
        zet_factuur(
            conn, leverancier, f"{voorloop}{maand:02d}", f"{jaar}-{maand:02d}-05"
        )


# --- 1. leverancier die ineens ontbreekt --------------------------------

def test_een_maandelijkse_leverancier_die_ontbreekt_wordt_gemeld(conn):
    maandelijks(conn, "KPN", [3, 4, 5, 6])          # maart t/m juni
    zet_factuur(conn, "Van Dijk", "VD-1", "2026-08-04")   # kwartaal is niet leeg

    signalen = ontbrekende_leveranciers(conn, 1, *Q3)

    assert len(signalen) == 1
    signaal = signalen[0]
    assert signaal.soort == "ontbrekende_leverancier"
    assert signaal.leverancier == "KPN"
    assert signaal.laatste_factuurdatum == "2026-06-05"
    assert "KPN staat sinds maart 2026 elke maand op de lijst" in signaal.vraag
    assert signaal.vraag.endswith("?")


def test_een_leverancier_die_er_gewoon_is_wordt_niet_gemeld(conn):
    """De rustige situatie: niets aan de hand, dus niets melden."""
    maandelijks(conn, "KPN", [3, 4, 5, 6])
    zet_factuur(conn, "KPN", "KPN-07", "2026-07-05")

    assert ontbrekende_leveranciers(conn, 1, *Q3) == []


def test_twee_maanden_op_rij_is_nog_geen_patroon(conn):
    """Twee keer is toeval; daar hoort geen vraag bij."""
    maandelijks(conn, "Incidenteel BV", [5, 6])

    assert ontbrekende_leveranciers(conn, 1, *Q3) == []


def test_een_gat_in_de_reeks_breekt_het_patroon(conn):
    """Wie april oversloeg, kwam niet 'elke maand'."""
    maandelijks(conn, "Onregelmatig BV", [3, 5, 6])

    assert ontbrekende_leveranciers(conn, 1, *Q3) == []


def test_een_leverancier_die_al_langer_weg_is_wordt_niet_gemeld(conn):
    """De reeks moet doorlopen tot vlak vóór het kwartaal."""
    maandelijks(conn, "Oude Leverancier", [1, 2, 3])   # stopte in maart

    assert ontbrekende_leveranciers(conn, 1, *Q3) == []


def test_facturen_zonder_leveranciersnaam_tellen_niet_mee(conn):
    for maand in (3, 4, 5, 6):
        zet_factuur(conn, "   ", f"X-{maand}", f"2026-{maand:02d}-05")

    assert ontbrekende_leveranciers(conn, 1, *Q3) == []


def test_de_status_van_de_factuur_doet_er_niet_toe(conn):
    """De vraag is of iets is aangeleverd, niet of het al is verwerkt."""
    maandelijks(conn, "KPN", [3, 4, 5, 6])
    # Een factuur die nog nagekeken moet worden telt gewoon mee als
    # 'aangeleverd'.
    sla_factuur_op(
        conn, 1,
        {"leverancier": "KPN", "factuurdatum": "2026-07-05",
         "factuurnummer": "KPN-07", "bedrag_excl": "100.00",
         "btw_percentage": "21", "btw_bedrag": "21.00", "bedrag_incl": "999.00"},
        vandaag=VANDAAG,
    )
    assert ontbrekende_leveranciers(conn, 1, *Q3) == []


# --- 2. gaten in factuurnummers -----------------------------------------

def test_een_overgeslagen_nummer_wordt_gemeld(conn):
    zet_factuur(conn, "Van Dijk", "F-2026-001", "2026-07-03")
    zet_factuur(conn, "Van Dijk", "F-2026-002", "2026-08-03")
    zet_factuur(conn, "Van Dijk", "F-2026-004", "2026-09-03")

    signalen = gaten_in_factuurnummers(conn, 1, *Q3)

    assert len(signalen) == 1
    assert signalen[0].ontbrekende_nummers == ["F-2026-003"]
    assert "F-2026-003" in signalen[0].vraag
    assert signalen[0].vraag.endswith("?")


def test_een_doorlopende_reeks_wordt_niet_gemeld(conn):
    """De rustige situatie."""
    for nummer, maand in ((1, 7), (2, 8), (3, 9)):
        zet_factuur(conn, "Van Dijk", f"F-2026-{nummer:03d}", f"2026-{maand:02d}-03")

    assert gaten_in_factuurnummers(conn, 1, *Q3) == []


def test_meerdere_gaten_worden_allemaal_genoemd(conn):
    zet_factuur(conn, "Van Dijk", "F-2026-001", "2026-07-03")
    zet_factuur(conn, "Van Dijk", "F-2026-005", "2026-09-03")

    signalen = gaten_in_factuurnummers(conn, 1, *Q3)
    assert signalen[0].ontbrekende_nummers == [
        "F-2026-002", "F-2026-003", "F-2026-004",
    ]


def test_heel_veel_gaten_worden_samengevat(conn):
    """Anders wordt het scherm een muur met nummers."""
    zet_factuur(conn, "Van Dijk", "F-001", "2026-07-03")
    zet_factuur(conn, "Van Dijk", "F-050", "2026-09-03")

    signaal = gaten_in_factuurnummers(conn, 1, *Q3)[0]
    assert len(signaal.ontbrekende_nummers) == 48
    assert "48 nummers tussen F-002 en F-049" in signaal.vraag


def test_nummers_van_verschillende_leveranciers_lopen_niet_door_elkaar(conn):
    zet_factuur(conn, "Van Dijk", "F-001", "2026-07-03")
    zet_factuur(conn, "Bakkerij", "F-002", "2026-07-04")
    zet_factuur(conn, "Van Dijk", "F-003", "2026-07-05")

    signalen = gaten_in_factuurnummers(conn, 1, *Q3)
    assert len(signalen) == 1
    assert signalen[0].leverancier == "Van Dijk"
    assert signalen[0].ontbrekende_nummers == ["F-002"]


def test_verschillende_voorlopen_zijn_verschillende_reeksen(conn):
    """2025-004 hoort niet in de reeks van 2026."""
    zet_factuur(conn, "Van Dijk", "F-2026-001", "2026-07-03")
    zet_factuur(conn, "Van Dijk", "F-2026-002", "2026-08-03")
    zet_factuur(conn, "Van Dijk", "F-2025-009", "2026-09-03")

    assert gaten_in_factuurnummers(conn, 1, *Q3) == []


def test_een_nummer_zonder_cijfers_doet_niet_mee(conn):
    zet_factuur(conn, "Van Dijk", "spoedfactuur", "2026-07-03")
    zet_factuur(conn, "Van Dijk", "nog een", "2026-08-03")

    assert gaten_in_factuurnummers(conn, 1, *Q3) == []


def test_een_enkele_factuur_kan_geen_gat_hebben(conn):
    zet_factuur(conn, "Van Dijk", "F-2026-007", "2026-07-03")

    assert gaten_in_factuurnummers(conn, 1, *Q3) == []


# --- 3. afwijkend aantal facturen ---------------------------------------

def vier_kwartalen(conn, per_kwartaal=10):
    """Vul 2025 K3 t/m 2026 K2 met evenveel facturen per kwartaal."""
    maanden = [(2025, 8), (2025, 11), (2026, 2), (2026, 5)]
    for jaar, maand in maanden:
        for nummer in range(per_kwartaal):
            zet_factuur(
                conn, f"Leverancier {nummer}", f"A-{jaar}{maand:02d}-{nummer:03d}",
                f"{jaar}-{maand:02d}-10",
            )


def test_veel_minder_facturen_dan_normaal_wordt_gemeld(conn):
    vier_kwartalen(conn, per_kwartaal=12)
    zet_factuur(conn, "Leverancier 0", "Q3-1", "2026-07-10")

    signalen = afwijkend_aantal(conn, 1, 2026, 3)

    assert len(signalen) == 1
    assert signalen[0].soort == "aantal_facturen"
    assert "1 factuur" in signalen[0].vraag
    assert "gemiddeld 12.0" in signalen[0].vraag
    assert "minder" in signalen[0].vraag
    assert signalen[0].vraag.endswith("?")


def test_ongeveer_evenveel_facturen_wordt_niet_gemeld(conn):
    """De rustige situatie: tien tegenover twaalf is geen signaal."""
    vier_kwartalen(conn, per_kwartaal=12)
    for nummer in range(10):
        zet_factuur(conn, f"Leverancier {nummer}", f"Q3-{nummer}", "2026-07-10")

    assert afwijkend_aantal(conn, 1, 2026, 3) == []


def test_veel_meer_facturen_wordt_ook_gemeld(conn):
    vier_kwartalen(conn, per_kwartaal=4)
    for nummer in range(20):
        zet_factuur(conn, f"Leverancier {nummer}", f"Q3-{nummer}", "2026-07-10")

    signalen = afwijkend_aantal(conn, 1, 2026, 3)
    assert len(signalen) == 1
    assert "meer" in signalen[0].vraag


def test_bij_weinig_historie_wordt_er_niets_geroepen(conn):
    """Bij een gemiddelde van twee zegt een verschil van één niets."""
    vier_kwartalen(conn, per_kwartaal=2)

    assert afwijkend_aantal(conn, 1, 2026, 3) == []


def test_een_administratie_zonder_verleden_geeft_geen_signaal(conn):
    zet_factuur(conn, "Van Dijk", "F-1", "2026-07-10")

    assert afwijkend_aantal(conn, 1, 2026, 3) == []


# --- samen, en in de aangifte -------------------------------------------

def test_een_rustig_kwartaal_geeft_helemaal_geen_signalen(conn):
    """Alles normaal: geen enkele vraag."""
    for maand in (1, 2, 3, 4, 5, 6, 7, 8, 9):
        for nummer in (1, 2, 3):
            zet_factuur(
                conn, f"Leverancier {nummer}",
                f"L{nummer}-{maand:03d}", f"2026-{maand:02d}-10",
            )

    assert zoek_signalen(conn, 1, 2026, 3) == []


def test_de_signalen_staan_in_de_aangifte_en_blokkeren_niets(conn):
    maandelijks(conn, "KPN", [3, 4, 5, 6])
    aangifte = bereken_aangifte(conn, 1, 2026, 3)

    assert aangifte.status == "voorstel"      # niets tegengehouden
    assert aangifte.saldo is not None
    assert any(s.leverancier == "KPN" for s in aangifte.signalen)


def test_de_signalen_staan_er_ook_bij_een_geblokkeerde_aangifte(conn):
    maandelijks(conn, "KPN", [3, 4, 5, 6])
    # Een factuur die niet klopt blokkeert de aangifte.
    sla_factuur_op(
        conn, 1,
        {"leverancier": "Van Dijk", "factuurdatum": "2026-07-05",
         "factuurnummer": "VD-1", "bedrag_excl": "100.00",
         "btw_percentage": "21", "btw_bedrag": "21.00", "bedrag_incl": "999.00"},
        vandaag=VANDAAG,
    )
    aangifte = bereken_aangifte(conn, 1, 2026, 3)

    assert aangifte.status == "geblokkeerd"
    assert any(s.leverancier == "KPN" for s in aangifte.signalen)


def test_elk_signaal_is_een_vraag_en_geen_conclusie(conn):
    """Het systeem weet niet wat er ontbreekt; de eigenaar wel."""
    maandelijks(conn, "KPN", [3, 4, 5, 6])
    zet_factuur(conn, "Van Dijk", "F-2026-001", "2026-07-03")
    zet_factuur(conn, "Van Dijk", "F-2026-003", "2026-08-03")
    vier_kwartalen(conn, per_kwartaal=12)

    signalen = zoek_signalen(conn, 1, 2026, 3)
    assert len(signalen) == 3
    for signaal in signalen:
        assert signaal.vraag.endswith("?")
        for verboden in ("fout", "ontbreekt een factuur", "moet"):
            assert verboden not in signaal.vraag.lower()


def test_kwartalen_van_voor_de_eerste_factuur_tellen_niet_mee(conn):
    """Wie net begonnen is, hoort niet te horen dat het er 'meer' zijn."""
    for maand in (1, 2, 4, 5):         # de administratie begint in januari
        for nummer in range(6):
            zet_factuur(
                conn, f"Leverancier {nummer}", f"L{nummer}-{maand:02d}",
                f"2026-{maand:02d}-10",
            )
    for nummer in range(12):            # en gaat in Q3 gewoon door
        zet_factuur(conn, f"Leverancier {nummer}", f"Q3-{nummer}", "2026-07-10")

    # Q1 en Q2 hadden er allebei 12; Q3 ook. De kwartalen van 2025 tellen
    # niet mee, anders zou het gemiddelde 6 zijn en zou dit "veel meer" heten.
    assert afwijkend_aantal(conn, 1, 2026, 3) == []


def test_met_maar_een_kwartaal_historie_zegt_het_systeem_niets(conn):
    """Eén kwartaal is geen vergelijking; dan is elk verschil 'afwijkend'."""
    for nummer in range(12):
        zet_factuur(conn, f"Leverancier {nummer}", f"Q2-{nummer}", "2026-05-10")
    zet_factuur(conn, "Leverancier 0", "Q3-1", "2026-07-10")

    assert afwijkend_aantal(conn, 1, 2026, 3) == []


def test_de_melding_noemt_hoeveel_kwartalen_er_zijn_vergeleken(conn):
    """Zijn het er maar twee, dan zegt de tekst dat ook."""
    for maand in (2, 5):
        for nummer in range(12):
            zet_factuur(
                conn, f"Leverancier {nummer}", f"L{nummer}-{maand:02d}",
                f"2026-{maand:02d}-10",
            )
    zet_factuur(conn, "Leverancier 0", "Q3-1", "2026-07-10")

    signaal = afwijkend_aantal(conn, 1, 2026, 3)[0]
    assert "de vorige 2 kwartalen" in signaal.vraag


def test_de_melding_noemt_de_echte_startmaand_en_niet_de_rand_van_het_venster(conn):
    """Wie er al sinds oktober elke maand is, hoort niet 'sinds januari' te krijgen."""
    maandelijks(conn, "KPN", [10, 11, 12], jaar=2025)
    maandelijks(conn, "KPN", [1, 2, 3, 4, 5, 6], jaar=2026)

    signaal = ontbrekende_leveranciers(conn, 1, *Q3)[0]
    assert "sinds oktober 2025" in signaal.vraag


def test_een_leverancier_die_al_een_half_jaar_weg_is_telt_niet_meer(conn):
    """Een reeks die lang geleden eindigde is geen vraag meer."""
    maandelijks(conn, "Oude Leverancier", [1, 2, 3, 4, 5, 6], jaar=2025)

    assert ontbrekende_leveranciers(conn, 1, *Q3) == []
