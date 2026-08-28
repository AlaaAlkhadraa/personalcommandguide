"""Tests voor verkoopfacturen (module 8).

De kern: de bedragen komen uit de code, de nummering heeft geen gaten,
en een definitieve factuur staat vast.
"""

from datetime import date
from decimal import Decimal

import pytest

from boekhouding import (
    afronden,
    bereken_regel,
    bereken_totalen,
    bereken_aangifte,
    controleer_verkoopfactuur,
    importeer_bankafschrift,
    koppel_transactie,
    lees_audit_trail,
    lees_banktransacties,
    lees_boeking,
    lees_document,
    lees_klant,
    lees_verkoopfactuur,
    lees_verkoopfacturen,
    maak_administratie,
    maak_creditfactuur,
    maak_definitief,
    maak_klant,
    maak_tabellen,
    maak_verbinding,
    maak_verkoopfactuur,
    open_facturen,
    openstaande_posten,
    verwijder_verkoopfactuur,
    vervaldatum,
    wijzig_administratie,
    wijzig_klant,
    wijzig_verkoopfactuur,
    zet_verkoopregels,
)
from boekhouding.factuur_pdf import maak_factuur_pdf

VANDAAG = date(2026, 12, 31)


@pytest.fixture
def opslag(tmp_path):
    return str(tmp_path / "opslag")


@pytest.fixture
def conn(tmp_path):
    verbinding = maak_verbinding(str(tmp_path / "boekhouding.sqlite"))
    maak_tabellen(verbinding)
    maak_administratie(verbinding, "Alkhadraa Advies")
    # De eigen gegevens horen op elke factuur; zonder deze drie kan een
    # factuur niet definitief worden.
    wijzig_administratie(verbinding, 1, {
        "adres": "Zonnebloemstraat 14", "postcode": "3011 AB",
        "plaats": "Rotterdam", "btw_id": "NL002233445B01",
        "kvk_nummer": "87654321", "iban": "NL44RABO0123456789",
    })
    yield verbinding
    verbinding.close()


def klant(conn, naam="Van Dijk ICT-diensten"):
    return maak_klant(conn, 1, {
        "naam": naam, "adres": "Keizersgracht 218", "postcode": "1016 DZ",
        "plaats": "Amsterdam", "email": "post@vandijk.test",
    })


REGELS = [
    {"omschrijving": "Advies juli 2026", "aantal": "7.5",
     "prijs_per_stuk": "95.00", "btw_percentage": "21"},
    {"omschrijving": "Vakliteratuur", "aantal": "3",
     "prijs_per_stuk": "24.95", "btw_percentage": "9"},
]


def concept(conn, klant_id=None, datum="2026-07-14", regels=None):
    factuur_id = maak_verkoopfactuur(
        conn, 1, klant_id or klant(conn), datum
    )
    zet_verkoopregels(conn, factuur_id, REGELS if regels is None else regels)
    return factuur_id


# --- klanten ------------------------------------------------------------

def test_een_klant_krijgt_standaard_dertig_dagen(conn):
    klant_id = maak_klant(conn, 1, {"naam": "Van Dijk"})

    assert lees_klant(conn, klant_id)["betalingstermijn"] == 30


def test_een_klant_zonder_naam_bestaat_niet(conn):
    with pytest.raises(ValueError, match="zonder naam"):
        maak_klant(conn, 1, {"naam": "   "})


def test_klantgegevens_wijzigen_komt_in_de_audit_trail(conn):
    klant_id = klant(conn)
    wijzig_klant(conn, klant_id, {"plaats": "Utrecht"})

    trail = lees_audit_trail(conn, klant_id, tabel="klanten")
    wijziging = [r for r in trail if r["veld"] == "plaats"][0]
    assert (wijziging["oude_waarde"], wijziging["nieuwe_waarde"]) == (
        "Amsterdam", "Utrecht"
    )


# --- rekenen ------------------------------------------------------------

def test_het_regelbedrag_komt_uit_aantal_maal_prijs():
    regel = bereken_regel(
        {"omschrijving": "Advies", "aantal": "7.5", "prijs_per_stuk": "95.00",
         "btw_percentage": "21"}, 1,
    )

    assert regel.bedrag_excl == Decimal("712.50")
    assert regel.btw_bedrag == Decimal("149.63")


def test_afronden_gaat_bij_een_halve_cent_omhoog():
    """Zoals op papier; Python rondt standaard naar even."""
    assert afronden(Decimal("0.125")) == Decimal("0.13")
    assert afronden(Decimal("0.135")) == Decimal("0.14")


def test_de_btw_wordt_per_tarief_over_het_totaal_berekend():
    """Niet als som van afgeronde regels: dan loopt er per regel iets weg."""
    regels = [
        bereken_regel({"aantal": "3", "prijs_per_stuk": "0.35",
                       "btw_percentage": "21", "omschrijving": "a"}, 1),
        bereken_regel({"aantal": "3", "prijs_per_stuk": "0.35",
                       "btw_percentage": "21", "omschrijving": "b"}, 2),
    ]
    totalen = bereken_totalen(regels)

    # 2 × 1,05 = 2,10 en 21% daarvan is 0,441 → 0,44.
    assert totalen.bedrag_excl == Decimal("2.10")
    assert totalen.btw_bedrag == Decimal("0.44")
    assert totalen.bedrag_incl == Decimal("2.54")


def test_btw_over_meerdere_regels_met_verschillende_tarieven(conn):
    factuur_id = concept(conn)
    totalen = lees_verkoopfactuur(conn, factuur_id)["totalen"]

    assert totalen.per_tarief["21"] == (Decimal("712.50"), Decimal("149.63"))
    assert totalen.per_tarief["9"] == (Decimal("74.85"), Decimal("6.74"))
    assert totalen.bedrag_excl == Decimal("787.35")
    assert totalen.bedrag_incl == Decimal("943.72")


def test_een_float_wordt_niet_als_bedrag_geaccepteerd():
    """Net als bij een inkoopfactuur: geen float in de bedragen."""
    regel = bereken_regel(
        {"omschrijving": "a", "aantal": 2, "prijs_per_stuk": 9.95,
         "btw_percentage": "21"}, 1,
    )
    assert regel.bedrag_excl == Decimal("0.00")


def test_de_vervaldatum_volgt_uit_de_termijn():
    assert vervaldatum(date(2026, 7, 14), 30) == date(2026, 8, 13)


def test_de_vervaldatum_staat_ook_op_de_factuur(conn):
    factuur_id = concept(conn)

    assert lees_verkoopfactuur(conn, factuur_id)["vervaldatum"] == "2026-08-13"


def test_een_andere_termijn_verschuift_de_vervaldatum(conn):
    factuur_id = concept(conn)
    wijzig_verkoopfactuur(conn, factuur_id, {"betalingstermijn": "14"})

    assert lees_verkoopfactuur(conn, factuur_id)["vervaldatum"] == "2026-07-28"


# --- verplichte gegevens ------------------------------------------------

def test_zonder_eigen_gegevens_kan_een_factuur_niet_definitief(tmp_path):
    verbinding = maak_verbinding(str(tmp_path / "leeg.sqlite"))
    maak_tabellen(verbinding)
    maak_administratie(verbinding, "Zaak zonder gegevens")
    klant_id = maak_klant(verbinding, 1, {
        "naam": "Van Dijk", "adres": "Keizersgracht 218", "plaats": "Amsterdam"
    })
    factuur_id = maak_verkoopfactuur(verbinding, 1, klant_id, "2026-07-14")
    zet_verkoopregels(verbinding, factuur_id, REGELS)

    ontbreekt = controleer_verkoopfactuur(verbinding, factuur_id)
    assert "je eigen adres" in ontbreekt
    assert "je btw-identificatienummer" in ontbreekt

    nummer, redenen = maak_definitief(verbinding, factuur_id)
    assert nummer is None
    assert redenen == ontbreekt
    verbinding.close()


def test_zonder_klantadres_kan_het_ook_niet(conn):
    klant_id = maak_klant(conn, 1, {"naam": "Van Dijk"})
    factuur_id = concept(conn, klant_id)

    ontbreekt = controleer_verkoopfactuur(conn, factuur_id)
    assert "het adres van de klant" in ontbreekt
    assert "de woonplaats van de klant" in ontbreekt


def test_zonder_regels_kan_het_niet(conn):
    factuur_id = maak_verkoopfactuur(conn, 1, klant(conn), "2026-07-14")

    assert "minstens één factuurregel" in controleer_verkoopfactuur(conn, factuur_id)


def test_zonder_factuurdatum_kan_het_niet(conn):
    factuur_id = concept(conn, datum=None)

    assert "de factuurdatum" in controleer_verkoopfactuur(conn, factuur_id)


def test_een_regel_zonder_omschrijving_of_prijs_wordt_genoemd(conn):
    factuur_id = concept(conn, regels=[
        {"omschrijving": "", "aantal": "1", "prijs_per_stuk": "0",
         "btw_percentage": "21"},
    ])
    ontbreekt = controleer_verkoopfactuur(conn, factuur_id)

    assert "een omschrijving bij regel 1" in ontbreekt
    assert "een prijs bij regel 1" in ontbreekt


def test_een_btw_tarief_dat_niet_bestaat_wordt_geweigerd(conn):
    factuur_id = concept(conn, regels=[
        {"omschrijving": "Advies", "aantal": "1", "prijs_per_stuk": "100",
         "btw_percentage": "13"},
    ])
    ontbreekt = controleer_verkoopfactuur(conn, factuur_id)

    assert any("13% bestaat niet in 2026" in punt for punt in ontbreekt)


def test_een_complete_factuur_heeft_niets_openstaan(conn):
    assert controleer_verkoopfactuur(conn, concept(conn)) == []


# --- nummering ----------------------------------------------------------

def test_de_nummering_loopt_door_per_jaar(conn, opslag):
    klant_id = klant(conn)
    nummers = []
    for _ in range(3):
        nummers.append(
            maak_definitief(conn, concept(conn, klant_id), opslagmap=opslag)[0]
        )

    assert nummers == ["2026-0001", "2026-0002", "2026-0003"]


def test_elk_jaar_begint_de_nummering_opnieuw(conn, opslag):
    klant_id = klant(conn)
    eerste = maak_definitief(
        conn, concept(conn, klant_id, "2025-12-30"), opslagmap=opslag
    )[0]
    tweede = maak_definitief(
        conn, concept(conn, klant_id, "2026-01-05"), opslagmap=opslag
    )[0]

    assert eerste == "2025-0001"
    assert tweede == "2026-0001"


def test_een_jaar_zonder_config_wordt_geweigerd(conn, opslag):
    """Er is geen btw-config voor 2027, en dat wordt gezegd in plaats van
    de tarieven van vorig jaar te gebruiken."""
    factuur_id = concept(conn, klant(conn), "2027-01-05")

    ontbreekt = controleer_verkoopfactuur(conn, factuur_id)
    assert any("btw_2027.json" in punt for punt in ontbreekt)
    assert maak_definitief(conn, factuur_id, opslagmap=opslag)[0] is None


def test_een_concept_heeft_nog_geen_nummer(conn):
    assert lees_verkoopfactuur(conn, concept(conn))["factuurnummer"] is None


def test_een_weggegooid_concept_laat_geen_gat_achter(conn, opslag):
    """De reden dat een nummer pas bij het definitief maken wordt gegeven."""
    klant_id = klant(conn)
    eerste = maak_definitief(
        conn, concept(conn, klant_id), opslagmap=opslag
    )[0]

    weg = concept(conn, klant_id)
    assert verwijder_verkoopfactuur(conn, weg) == (True, [])

    derde = maak_definitief(conn, concept(conn, klant_id), opslagmap=opslag)[0]
    assert (eerste, derde) == ("2026-0001", "2026-0002")


def test_de_nummers_van_een_jaar_hebben_geen_gaten(conn, opslag):
    klant_id = klant(conn)
    for _ in range(5):
        factuur_id = concept(conn, klant_id)
        if factuur_id % 2 == 0:          # gooi er een paar tussenuit
            verwijder_verkoopfactuur(conn, factuur_id)
        else:
            maak_definitief(conn, factuur_id, opslagmap=opslag)

    nummers = sorted(
        f["nummer_volg"] for f in lees_verkoopfacturen(conn, 1)
        if f["status"] == "definitief"
    )
    assert nummers == list(range(1, len(nummers) + 1))


# --- concept versus definitief ------------------------------------------

def test_een_concept_mag_worden_gewijzigd(conn):
    factuur_id = concept(conn)

    gelukt, redenen = zet_verkoopregels(conn, factuur_id, [
        {"omschrijving": "Iets anders", "aantal": "1",
         "prijs_per_stuk": "50.00", "btw_percentage": "21"},
    ])
    assert (gelukt, redenen) == (True, [])
    assert len(lees_verkoopfactuur(conn, factuur_id)["regels"]) == 1


def test_een_definitieve_factuur_wordt_niet_gewijzigd(conn, opslag):
    factuur_id = concept(conn)
    maak_definitief(conn, factuur_id, opslagmap=opslag)

    gelukt, redenen = zet_verkoopregels(conn, factuur_id, [])
    assert gelukt is False
    assert "nooit gewijzigd of verwijderd" in redenen[0]
    assert len(lees_verkoopfactuur(conn, factuur_id)["regels"]) == 2


def test_een_definitieve_factuur_wordt_niet_verwijderd(conn, opslag):
    factuur_id = concept(conn)
    maak_definitief(conn, factuur_id, opslagmap=opslag)

    gelukt, redenen = verwijder_verkoopfactuur(conn, factuur_id)
    assert gelukt is False
    assert "creditfactuur" in redenen[0]
    assert lees_verkoopfactuur(conn, factuur_id)["status"] == "definitief"


def test_twee_keer_definitief_maken_gebeurt_niet(conn, opslag):
    factuur_id = concept(conn)
    maak_definitief(conn, factuur_id, opslagmap=opslag)

    nummer, redenen = maak_definitief(conn, factuur_id, opslagmap=opslag)
    assert nummer is None
    assert "al definitief" in redenen[0]


def test_de_klantgegevens_worden_vastgelegd(conn, opslag):
    """Verhuist de klant later, dan verandert de verstuurde factuur niet."""
    klant_id = klant(conn)
    factuur_id = concept(conn, klant_id)
    maak_definitief(conn, factuur_id, opslagmap=opslag)

    wijzig_klant(conn, klant_id, {"adres": "Nieuwe Gracht 1", "plaats": "Utrecht"})

    factuur = lees_verkoopfactuur(conn, factuur_id)
    assert factuur["klant"]["adres"] == "Keizersgracht 218"
    assert factuur["klant"]["plaats"] == "Amsterdam"


# --- de boeking ---------------------------------------------------------

def test_definitief_maken_levert_de_boeking_op(conn, opslag):
    factuur_id = concept(conn)
    maak_definitief(conn, factuur_id, opslagmap=opslag)

    factuur = lees_verkoopfactuur(conn, factuur_id)
    boeking = lees_boeking(conn, factuur["boeking_id"])
    assert [(r["rekening"], r["debet"], r["credit"]) for r in boeking["regels"]] == [
        ("1300", "943.72", "0.00"),     # debiteuren
        ("8000", "0.00", "712.50"),     # omzet hoog
        ("8010", "0.00", "74.85"),      # omzet laag
        ("1510", "0.00", "149.63"),     # btw hoog
        ("1511", "0.00", "6.74"),       # btw laag
    ]


def test_de_boeking_is_in_balans(conn, opslag):
    factuur_id = concept(conn)
    maak_definitief(conn, factuur_id, opslagmap=opslag)
    boeking = lees_boeking(conn, lees_verkoopfactuur(conn, factuur_id)["boeking_id"])

    debet = sum(Decimal(r["debet"]) for r in boeking["regels"])
    credit = sum(Decimal(r["credit"]) for r in boeking["regels"])
    assert debet == credit == Decimal("943.72")


# --- creditfactuur ------------------------------------------------------

def test_een_creditfactuur_spiegelt_de_regels(conn, opslag):
    factuur_id = concept(conn)
    maak_definitief(conn, factuur_id, opslagmap=opslag)

    credit_id, redenen = maak_creditfactuur(conn, factuur_id)
    assert redenen == []

    credit = lees_verkoopfactuur(conn, credit_id)
    assert credit["status"] == "concept"
    assert credit["soort"] == "creditfactuur"
    assert credit["corrigeert_id"] == factuur_id
    assert credit["totalen"].bedrag_incl == Decimal("-943.72")


def test_de_creditfactuur_krijgt_het_volgende_nummer(conn, opslag):
    factuur_id = concept(conn)
    maak_definitief(conn, factuur_id, opslagmap=opslag)
    credit_id, _ = maak_creditfactuur(conn, factuur_id)

    nummer, redenen = maak_definitief(conn, credit_id, opslagmap=opslag)
    assert (nummer, redenen) == ("2026-0002", [])


def test_origineel_en_creditfactuur_zijn_samen_nul(conn, opslag):
    factuur_id = concept(conn)
    maak_definitief(conn, factuur_id, opslagmap=opslag)
    credit_id, _ = maak_creditfactuur(conn, factuur_id)
    maak_definitief(conn, credit_id, opslagmap=opslag)

    saldo: dict[str, Decimal] = {}
    for factuur in (factuur_id, credit_id):
        boeking = lees_boeking(
            conn, lees_verkoopfactuur(conn, factuur)["boeking_id"]
        )
        for regel in boeking["regels"]:
            saldo[regel["rekening"]] = saldo.get(regel["rekening"], Decimal("0")) + (
                Decimal(regel["debet"]) - Decimal(regel["credit"])
            )
    assert set(saldo.values()) == {Decimal("0.00")}


def test_een_concept_crediteer_je_niet(conn):
    credit_id, redenen = maak_creditfactuur(conn, concept(conn))

    assert credit_id is None
    assert "concept crediteer je niet" in redenen[0]


def test_twee_keer_crediteren_gebeurt_niet(conn, opslag):
    factuur_id = concept(conn)
    maak_definitief(conn, factuur_id, opslagmap=opslag)
    maak_creditfactuur(conn, factuur_id)

    tweede, redenen = maak_creditfactuur(conn, factuur_id)
    assert tweede is None
    assert "al gecrediteerd" in redenen[0]


# --- de PDF -------------------------------------------------------------

def test_de_pdf_gaat_door_de_documentopslag(conn, opslag):
    from pathlib import Path

    factuur_id = concept(conn)
    maak_definitief(conn, factuur_id, opslagmap=opslag)

    factuur = lees_verkoopfactuur(conn, factuur_id)
    assert factuur["document_id"] is not None

    document = lees_document(conn, factuur["document_id"])
    bewaard = Path(document["opslagpad"])
    assert bewaard.is_file()
    assert bewaard.read_bytes().startswith(b"%PDF-")
    # De naam is de hash van de inhoud, net als bij een ontvangen factuur.
    assert bewaard.stem == document["hash"]


def test_alles_wat_verplicht_is_staat_op_de_pdf(conn, opslag):
    from pypdf import PdfReader
    from io import BytesIO

    factuur_id = concept(conn)
    maak_definitief(conn, factuur_id, opslagmap=opslag)
    pdf = maak_factuur_pdf(lees_verkoopfactuur(conn, factuur_id))
    tekst = PdfReader(BytesIO(pdf)).pages[0].extract_text()

    for verplicht in (
        "2026-0001",                 # uniek nummer
        "2026-07-14",                # factuurdatum
        "Alkhadraa Advies",          # naam van de ondernemer
        "Zonnebloemstraat 14",       # adres van de ondernemer
        "NL002233445B01",            # btw-identificatienummer
        "Van Dijk ICT-diensten",     # naam van de klant
        "Keizersgracht 218",         # adres van de klant
        "Advies juli 2026",          # omschrijving
        "787,35",                    # bedrag exclusief btw
        "21%",                       # btw-tarief
        "149,63",                    # btw-bedrag
        "943,72",                    # totaal
    ):
        assert verplicht in tekst, verplicht


def test_de_pdf_is_twee_keer_hetzelfde(conn, opslag):
    """Geen tijdstempel erin, dus dezelfde inhoud geeft dezelfde hash."""
    factuur_id = concept(conn)
    maak_definitief(conn, factuur_id, opslagmap=opslag)
    factuur = lees_verkoopfactuur(conn, factuur_id)

    assert maak_factuur_pdf(factuur) == maak_factuur_pdf(factuur)


def test_op_een_creditfactuur_staat_dat_het_er_een_is(conn, opslag):
    from pypdf import PdfReader
    from io import BytesIO

    factuur_id = concept(conn)
    maak_definitief(conn, factuur_id, opslagmap=opslag)
    credit_id, _ = maak_creditfactuur(conn, factuur_id)
    maak_definitief(conn, credit_id, opslagmap=opslag)

    pdf = maak_factuur_pdf(lees_verkoopfactuur(conn, credit_id))
    tekst = PdfReader(BytesIO(pdf)).pages[0].extract_text()
    assert "CREDITFACTUUR" in tekst
    assert "-943,72" in tekst


# --- btw-aangifte -------------------------------------------------------

def test_een_verkoopfactuur_telt_mee_in_1a_en_1b(conn, opslag):
    """Twee tarieven op één factuur horen ook in twee rubrieken."""
    maak_definitief(conn, concept(conn), opslagmap=opslag)

    aangifte = bereken_aangifte(conn, 1, 2026, 3)
    rubriek_1a, rubriek_1b = aangifte.rubrieken

    assert (rubriek_1a.grondslag, rubriek_1a.btw) == (
        Decimal("712.50"), Decimal("149.63")
    )
    assert (rubriek_1b.grondslag, rubriek_1b.btw) == (
        Decimal("74.85"), Decimal("6.74")
    )
    assert aangifte.verschuldigd == Decimal("156.37")
    assert aangifte.waarschuwingen == []


def test_een_creditfactuur_haalt_de_btw_er_weer_af(conn, opslag):
    factuur_id = concept(conn)
    maak_definitief(conn, factuur_id, opslagmap=opslag)
    credit_id, _ = maak_creditfactuur(conn, factuur_id)
    maak_definitief(conn, credit_id, opslagmap=opslag)

    aangifte = bereken_aangifte(conn, 1, 2026, 3)
    assert aangifte.verschuldigd == Decimal("0.00")
    assert aangifte.rubrieken[0].grondslag == Decimal("0.00")


# --- openstaande posten en afletteren -----------------------------------

def test_een_definitieve_factuur_staat_open(conn, opslag):
    maak_definitief(conn, concept(conn), opslagmap=opslag)

    posten = openstaande_posten(conn, 1, date(2026, 8, 20))
    assert len(posten) == 1
    assert posten[0]["factuurnummer"] == "2026-0001"
    assert posten[0]["bedrag_incl"] == Decimal("943.72")
    assert posten[0]["dagen_over"] == 7          # verviel op 13 augustus
    assert posten[0]["te_laat"] is True


def test_binnen_de_termijn_is_een_factuur_niet_te_laat(conn, opslag):
    maak_definitief(conn, concept(conn), opslagmap=opslag)

    post = openstaande_posten(conn, 1, date(2026, 8, 1))[0]
    assert post["dagen_over"] == -12
    assert post["te_laat"] is False


def test_een_concept_staat_niet_open(conn):
    concept(conn)

    assert openstaande_posten(conn, 1, VANDAAG) == []


def test_een_verkoopfactuur_wordt_via_de_bank_afgeletterd(conn, opslag):
    """De hele keten: factuur maken, geld ontvangen, koppelen, geboekt."""
    from pathlib import Path

    klant_id = klant(conn, "Alkhadraa Advies")
    factuur_id = concept(conn, klant_id, regels=[
        {"omschrijving": "Advies juli", "aantal": "1",
         "prijs_per_stuk": "2400.00", "btw_percentage": "21"},
    ])
    nummer, _ = maak_definitief(conn, factuur_id, opslagmap=opslag)
    assert nummer == "2026-0001"

    afschrift = (
        Path(__file__).parent / "testfacturen" / "bank" / "01-mt940-ing.sta"
    ).read_bytes()
    importeer_bankafschrift(conn, 1, "juli.sta", afschrift, opslag)
    ontvangst = [
        t for t in lees_banktransacties(conn, 1) if t["bedrag"] == "2904.00"
    ][0]

    # Het afletteren ziet de eigen factuur als kandidaat.
    kandidaten = [
        f for f in open_facturen(conn, 1) if f["bron"] == "verkoopfactuur"
    ]
    assert [f["factuurnummer"] for f in kandidaten] == ["2026-0001"]

    boeking_id, redenen = koppel_transactie(
        conn, ontvangst["id"], factuur_id, bron="verkoopfactuur"
    )
    assert redenen == []
    boeking = lees_boeking(conn, boeking_id)
    assert [(r["rekening"], r["debet"], r["credit"]) for r in boeking["regels"]] == [
        ("1100", "2904.00", "0.00"),   # bank erbij
        ("1300", "0.00", "2904.00"),   # debiteuren eraf
    ]

    # En daarmee staat hij niet meer open.
    assert openstaande_posten(conn, 1, VANDAAG) == []


def test_een_concept_kan_niet_worden_afgeletterd(conn, opslag):
    from pathlib import Path

    factuur_id = concept(conn)
    afschrift = (
        Path(__file__).parent / "testfacturen" / "bank" / "01-mt940-ing.sta"
    ).read_bytes()
    importeer_bankafschrift(conn, 1, "juli.sta", afschrift, opslag)
    ontvangst = [
        t for t in lees_banktransacties(conn, 1) if t["bedrag"] == "2904.00"
    ][0]

    boeking_id, redenen = koppel_transactie(
        conn, ontvangst["id"], factuur_id, bron="verkoopfactuur"
    )
    assert boeking_id is None
    assert "eerst definitief" in redenen[0]
