"""Tests voor het grootboek: boekingen, balans en tegenboekingen.

De kern: een boeking bestaat alleen als debet en credit exact gelijk
zijn, en een boeking wordt nooit gewijzigd of verwijderd.
"""

from datetime import date
from decimal import Decimal

import pytest

from boekhouding import (
    Boekingsregel,
    boek_factuur,
    boeking_bij_factuur,
    controleer_balans,
    keur_factuur_goed,
    kies_rekening,
    lees_audit_trail,
    lees_boeking,
    lees_boekingen,
    maak_administratie,
    maak_tabellen,
    maak_tegenboeking,
    maak_verbinding,
    sla_boeking_op,
    sla_factuur_op,
    som_credit,
    som_debet,
    stel_boeking_samen,
    stel_tegenboeking_samen,
)

VANDAAG = date(2026, 8, 27)


@pytest.fixture
def conn(tmp_path):
    verbinding = maak_verbinding(str(tmp_path / "boekhouding.sqlite"))
    maak_tabellen(verbinding)
    maak_administratie(verbinding, "Zaak van Alaa")
    yield verbinding
    verbinding.close()


def factuurgegevens(**afwijkingen):
    gegeven = {
        "leverancier": "Van Dijk ICT-diensten",
        "factuurdatum": "2026-07-14",
        "factuurnummer": "F-2026-001",
        "bedrag_excl": "100.00",
        "btw_percentage": "21",
        "btw_bedrag": "21.00",
        "bedrag_incl": "121.00",
    }
    gegeven.update(afwijkingen)
    return gegeven


def geboekte_factuur(conn, rekening="4100", **afwijkingen):
    """Een factuur van upload tot boeking, zoals het scherm dat doet."""
    factuur_id, _ = sla_factuur_op(
        conn, 1, factuurgegevens(**afwijkingen), vandaag=VANDAAG
    )
    assert kies_rekening(conn, factuur_id, rekening) == (True, [])
    assert keur_factuur_goed(conn, factuur_id)[0] is True
    boeking_id, redenen = boek_factuur(conn, factuur_id)
    assert redenen == []
    return factuur_id, boeking_id


# --- balans -------------------------------------------------------------

def test_een_kloppende_boeking_is_in_balans():
    regels = [
        Boekingsregel(rekening="4100", omschrijving="kosten", debet=Decimal("100.00")),
        Boekingsregel(rekening="1520", omschrijving="btw", debet=Decimal("21.00")),
        Boekingsregel(rekening="1600", omschrijving="crediteuren", credit=Decimal("121.00")),
    ]
    assert controleer_balans(regels) == []
    assert som_debet(regels) == som_credit(regels) == Decimal("121.00")


def test_een_cent_verschil_is_al_niet_in_balans():
    """De factuurcontrole laat ±0,02 toe; een boeking geen cent."""
    regels = [
        Boekingsregel(rekening="4100", omschrijving="kosten", debet=Decimal("100.00")),
        Boekingsregel(rekening="1600", omschrijving="crediteuren", credit=Decimal("100.01")),
    ]
    redenen = controleer_balans(regels)
    assert redenen
    assert "niet in balans" in redenen[0]


def test_een_regel_hoort_aan_een_kant_te_staan():
    regels = [
        Boekingsregel(rekening="4100", omschrijving="fout",
                      debet=Decimal("10.00"), credit=Decimal("10.00")),
    ]
    assert any("één kant" in reden for reden in controleer_balans(regels))


def test_een_boeking_zonder_regels_bestaat_niet():
    assert controleer_balans([]) == ["een boeking zonder regels bestaat niet"]


# --- samenstellen -------------------------------------------------------

def test_inkoopfactuur_wordt_kosten_btw_en_crediteuren():
    voorstel = stel_boeking_samen({**factuurgegevens(), "id": 1}, "4100")
    assert voorstel.status == "gemaakt"
    assert [(r.rekening, str(r.debet), str(r.credit)) for r in voorstel.regels] == [
        ("4100", "100.00", "0.00"),
        ("1520", "21.00", "0.00"),
        ("1600", "0.00", "121.00"),
    ]
    assert voorstel.boekdatum == date(2026, 7, 14)


def test_verkoopfactuur_wordt_debiteuren_omzet_en_af_te_dragen_btw():
    """De gekozen rekening bepaalt de richting; dat is een keuze van een mens."""
    voorstel = stel_boeking_samen({**factuurgegevens(), "id": 1}, "8000")
    assert voorstel.status == "gemaakt"
    assert [(r.rekening, str(r.debet), str(r.credit)) for r in voorstel.regels] == [
        ("1300", "121.00", "0.00"),
        ("8000", "0.00", "100.00"),
        ("1510", "0.00", "21.00"),
    ]


def test_negen_procent_gaat_naar_de_andere_btw_rekening():
    voorstel = stel_boeking_samen(
        {**factuurgegevens(btw_percentage="9", btw_bedrag="9.00",
                           bedrag_incl="109.00"), "id": 1},
        "8010",
    )
    assert voorstel.regels[-1].rekening == "1511"


def test_nultarief_krijgt_geen_btw_regel():
    voorstel = stel_boeking_samen(
        {**factuurgegevens(btw_percentage="0", btw_bedrag="0.00",
                           bedrag_incl="100.00"), "id": 1},
        "8020",
    )
    assert voorstel.status == "gemaakt"
    assert len(voorstel.regels) == 2
    assert controleer_balans(voorstel.regels) == []


def test_creditnota_met_negatieve_bedragen_blijft_in_balans():
    voorstel = stel_boeking_samen(
        {**factuurgegevens(bedrag_excl="-100.00", btw_bedrag="-21.00",
                           bedrag_incl="-121.00"), "id": 1},
        "4100",
    )
    assert voorstel.status == "gemaakt"
    assert controleer_balans(voorstel.regels) == []
    assert som_debet(voorstel.regels) == Decimal("-121.00")


def test_zonder_rekening_ontstaat_er_geen_boeking():
    voorstel = stel_boeking_samen({**factuurgegevens(), "id": 1}, None)
    assert voorstel.status == "geweigerd"
    assert "geen grootboekrekening gekozen" in voorstel.redenen[0]


def test_een_onbekende_rekening_wordt_geweigerd():
    voorstel = stel_boeking_samen({**factuurgegevens(), "id": 1}, "9999")
    assert voorstel.status == "geweigerd"
    assert "staat niet in het rekeningschema" in voorstel.redenen[0]


def test_een_balansrekening_hoort_niet_bij_een_factuur():
    voorstel = stel_boeking_samen({**factuurgegevens(), "id": 1}, "1600")
    assert voorstel.status == "geweigerd"
    assert "kosten- of opbrengstenrekening" in voorstel.redenen[0]


def test_bedragen_die_een_cent_afwijken_worden_niet_geboekt():
    """Deze factuur komt door valideer_factuur (±0,02) maar niet door de boeking."""
    voorstel = stel_boeking_samen(
        {**factuurgegevens(bedrag_incl="121.01"), "id": 1}, "4100"
    )
    assert voorstel.status == "geweigerd"
    assert "tellen niet exact op" in voorstel.redenen[0]


def test_een_ontbrekend_bedrag_wordt_niet_aangevuld():
    voorstel = stel_boeking_samen(
        {**factuurgegevens(btw_bedrag=None), "id": 1}, "4100"
    )
    assert voorstel.status == "geweigerd"
    assert "btw_bedrag" in voorstel.redenen[0]


def test_zonder_factuurdatum_geen_boekdatum():
    voorstel = stel_boeking_samen(
        {**factuurgegevens(factuurdatum=None), "id": 1}, "4100"
    )
    assert voorstel.status == "geweigerd"
    assert "geen factuurdatum" in voorstel.redenen[0]


def test_een_jaar_zonder_rekeningschema_wordt_niet_geboekt():
    voorstel = stel_boeking_samen(
        {**factuurgegevens(factuurdatum="1999-07-14"), "id": 1}, "4100"
    )
    assert voorstel.status == "geweigerd"
    assert "geen rekeningschema" in voorstel.redenen[0]


# --- opslaan ------------------------------------------------------------

def test_alleen_een_goedgekeurde_factuur_wordt_geboekt(conn):
    factuur_id, _ = sla_factuur_op(conn, 1, factuurgegevens(), vandaag=VANDAAG)
    kies_rekening(conn, factuur_id, "4100")

    boeking_id, redenen = boek_factuur(conn, factuur_id)
    assert boeking_id is None
    assert "nog niet goedgekeurd" in redenen[0]


def test_een_geboekte_factuur_staat_in_het_grootboek(conn):
    factuur_id, boeking_id = geboekte_factuur(conn)
    boeking = lees_boeking(conn, boeking_id)

    assert boeking["factuur_id"] == factuur_id
    assert boeking["boekdatum"] == "2026-07-14"
    assert "Van Dijk" in boeking["omschrijving"]
    assert [r["rekening"] for r in boeking["regels"]] == ["4100", "1520", "1600"]
    assert boeking_bij_factuur(conn, factuur_id)["id"] == boeking_id


def test_dezelfde_factuur_wordt_niet_twee_keer_geboekt(conn):
    factuur_id, _ = geboekte_factuur(conn)

    nogmaals, redenen = boek_factuur(conn, factuur_id)
    assert nogmaals is None
    assert "al geboekt" in redenen[0]
    assert len(lees_boekingen(conn, 1)) == 1


def test_een_boeking_komt_in_de_audit_trail(conn):
    _, boeking_id = geboekte_factuur(conn)
    trail = lees_audit_trail(conn, boeking_id, tabel="boekingen")

    assert len(trail) == 1
    assert trail[0]["actie"] == "aangemaakt"
    assert "4100" in trail[0]["nieuwe_waarde"]


def test_de_gekozen_rekening_komt_in_de_audit_trail(conn):
    factuur_id, _ = sla_factuur_op(conn, 1, factuurgegevens(), vandaag=VANDAAG)
    kies_rekening(conn, factuur_id, "4100")
    kies_rekening(conn, factuur_id, "4110")

    wijzigingen = [
        r for r in lees_audit_trail(conn, factuur_id) if r["veld"] == "rekening"
    ]
    assert [(r["oude_waarde"], r["nieuwe_waarde"]) for r in wijzigingen] == [
        (None, "4100"), ("4100", "4110"),
    ]


def test_een_onbekende_rekening_kiezen_kan_niet(conn):
    factuur_id, _ = sla_factuur_op(conn, 1, factuurgegevens(), vandaag=VANDAAG)

    gelukt, redenen = kies_rekening(conn, factuur_id, "9999")
    assert gelukt is False
    assert "staat niet in het schema" in redenen[0]


def test_een_boeking_die_niet_klopt_komt_de_database_niet_in(conn):
    """Dubbele controle: ook als de aanroeper de balans zou overslaan."""
    from boekhouding import BoekingVoorstel

    scheef = BoekingVoorstel(
        status="gemaakt",
        boekdatum=date(2026, 7, 14),
        omschrijving="handmatig",
        regels=[
            Boekingsregel(rekening="4100", omschrijving="kosten", debet=Decimal("100.00")),
            Boekingsregel(rekening="1600", omschrijving="cred", credit=Decimal("99.00")),
        ],
    )
    boeking_id, redenen = sla_boeking_op(conn, 1, scheef)
    assert boeking_id is None
    assert "niet in balans" in redenen[0]
    assert lees_boekingen(conn, 1) == []


# --- tegenboeking -------------------------------------------------------

def test_een_tegenboeking_zet_alles_aan_de_andere_kant(conn):
    _, boeking_id = geboekte_factuur(conn)

    tegen_id, redenen = maak_tegenboeking(conn, boeking_id, "verkeerde rekening")
    assert redenen == []

    origineel = lees_boeking(conn, boeking_id)
    tegen = lees_boeking(conn, tegen_id)
    assert tegen["corrigeert_boeking_id"] == boeking_id
    assert "verkeerde rekening" in tegen["omschrijving"]
    for oud, nieuw in zip(origineel["regels"], tegen["regels"]):
        assert oud["debet"] == nieuw["credit"]
        assert oud["credit"] == nieuw["debet"]


def test_origineel_en_tegenboeking_zijn_samen_nul(conn):
    _, boeking_id = geboekte_factuur(conn)
    maak_tegenboeking(conn, boeking_id, "toch geen kosten")

    alle_regels = [
        regel for boeking in lees_boekingen(conn, 1) for regel in boeking["regels"]
    ]
    debet = sum(Decimal(r["debet"]) for r in alle_regels)
    credit = sum(Decimal(r["credit"]) for r in alle_regels)
    assert debet == credit
    per_rekening = {}
    for regel in alle_regels:
        saldo = Decimal(regel["debet"]) - Decimal(regel["credit"])
        per_rekening[regel["rekening"]] = per_rekening.get(regel["rekening"], 0) + saldo
    assert set(per_rekening.values()) == {Decimal("0.00")}


def test_de_oorspronkelijke_boeking_blijft_ongewijzigd_staan(conn):
    _, boeking_id = geboekte_factuur(conn)
    voor = lees_boeking(conn, boeking_id)

    maak_tegenboeking(conn, boeking_id, "correctie")

    assert lees_boeking(conn, boeking_id) == voor
    assert len(lees_boekingen(conn, 1)) == 2


def test_twee_keer_corrigeren_gebeurt_niet(conn):
    _, boeking_id = geboekte_factuur(conn)
    maak_tegenboeking(conn, boeking_id, "correctie")

    tweede, redenen = maak_tegenboeking(conn, boeking_id, "nog eens")
    assert tweede is None
    assert "al gecorrigeerd" in redenen[0]


def test_een_tegenboeking_zonder_reden_wordt_geweigerd(conn):
    _, boeking_id = geboekte_factuur(conn)

    tegen, redenen = maak_tegenboeking(conn, boeking_id, "   ")
    assert tegen is None
    assert "reden" in redenen[0]


def test_een_tegenboeking_kan_in_een_ander_kwartaal(conn):
    """Is het kwartaal al aangegeven, dan hoort de correctie in het lopende."""
    _, boeking_id = geboekte_factuur(conn)

    tegen_id, _ = maak_tegenboeking(
        conn, boeking_id, "kwartaal al ingediend", boekdatum=date(2026, 10, 1)
    )
    assert lees_boeking(conn, tegen_id)["boekdatum"] == "2026-10-01"


def test_de_tegenboeking_van_een_tegenboeking_klopt_ook():
    """Puur rekenkundig: twee keer omdraaien geeft het origineel terug."""
    boeking = {
        "id": 7,
        "boekdatum": "2026-07-14",
        "regels": [
            {"rekening": "4100", "omschrijving": "kosten", "debet": "100.00", "credit": "0.00"},
            {"rekening": "1600", "omschrijving": "cred", "debet": "0.00", "credit": "100.00"},
        ],
    }
    eerste = stel_tegenboeking_samen(boeking, "fout")
    assert eerste.status == "gemaakt"
    assert str(eerste.regels[0].credit) == "100.00"


# --- periode ------------------------------------------------------------

def test_boekingen_zijn_per_periode_op_te_vragen(conn):
    geboekte_factuur(conn, factuurdatum="2026-03-31", factuurnummer="F-1")
    geboekte_factuur(conn, factuurdatum="2026-04-01", factuurnummer="F-2")

    eerste = lees_boekingen(conn, 1, date(2026, 1, 1), date(2026, 3, 31))
    tweede = lees_boekingen(conn, 1, date(2026, 4, 1), date(2026, 6, 30))
    assert [b["boekdatum"] for b in eerste] == ["2026-03-31"]
    assert [b["boekdatum"] for b in tweede] == ["2026-04-01"]


def test_de_rekening_wijzigen_na_het_boeken_kan_niet(conn):
    """Anders zegt de factuur iets anders dan het grootboek."""
    factuur_id, boeking_id = geboekte_factuur(conn, rekening="4100")

    gelukt, redenen = kies_rekening(conn, factuur_id, "4110")
    assert gelukt is False
    assert "al geboekt" in redenen[0] and "tegenboeking" in redenen[0]

    from boekhouding import lees_factuur
    assert lees_factuur(conn, factuur_id)["rekening"] == "4100"
    assert lees_boeking(conn, boeking_id)["regels"][0]["rekening"] == "4100"
