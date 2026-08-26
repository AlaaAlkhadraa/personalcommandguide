"""Tests voor opslag, multi-administratie, duplicaatcheck en audit trail."""

import sqlite3

import pytest

from boekhouding import (
    maak_administratie,
    sla_factuur_op,
    wijzig_factuur,
    lees_factuur,
    lees_audit_trail,
)
from conftest import VANDAAG, geldige_factuur


def test_administratie_heeft_type_eenmanszaak(conn):
    admin_id = maak_administratie(conn, "Testzaak")
    rij = conn.execute(
        "SELECT naam, type FROM administraties WHERE id = ?", (admin_id,)
    ).fetchone()
    assert rij == ("Testzaak", "eenmanszaak")


def test_onbekend_administratietype_wordt_geweigerd(conn):
    with pytest.raises(ValueError, match="bv"):
        maak_administratie(conn, "Testzaak", "bv")


def test_onbestaand_administratie_id_wordt_geweigerd(conn):
    # Bewijst dat maak_verbinding foreign keys echt aanzet: zonder
    # "PRAGMA foreign_keys = ON" zou deze insert gewoon slagen.
    with pytest.raises(sqlite3.IntegrityError, match="FOREIGN KEY"):
        sla_factuur_op(conn, 999, geldige_factuur(), vandaag=VANDAAG)


def test_geldige_factuur_wordt_opgeslagen(conn, administratie_id):
    factuur_id, resultaat = sla_factuur_op(
        conn, administratie_id, geldige_factuur(), vandaag=VANDAAG
    )
    assert resultaat.status == "gevalideerd"
    opgeslagen = lees_factuur(conn, factuur_id)
    assert opgeslagen["administratie_id"] == administratie_id
    assert opgeslagen["status"] == "gevalideerd"
    assert opgeslagen["bedrag_excl"] == "100.00"  # exact, als tekst


def test_foute_factuur_wordt_bewaard_met_redenen(conn, administratie_id):
    data = geldige_factuur() | {"bedrag_incl": "999.00"}
    factuur_id, resultaat = sla_factuur_op(
        conn, administratie_id, data, vandaag=VANDAAG
    )
    assert resultaat.status == "review_nodig"
    opgeslagen = lees_factuur(conn, factuur_id)
    assert opgeslagen["status"] == "review_nodig"
    assert len(opgeslagen["review_redenen"]) == 1
    assert opgeslagen["originele_data"]["bedrag_incl"] == "999.00"


def test_onvolledige_factuur_wordt_toch_bewaard(conn, administratie_id):
    data = {"leverancier": "KPN B.V.", "bedrag_excl": "abc"}
    factuur_id, resultaat = sla_factuur_op(
        conn, administratie_id, data, vandaag=VANDAAG
    )
    assert resultaat.status == "review_nodig"
    opgeslagen = lees_factuur(conn, factuur_id)
    assert opgeslagen["leverancier"] == "KPN B.V."
    assert opgeslagen["originele_data"] == data


def test_duplicaat_in_zelfde_administratie(conn, administratie_id):
    sla_factuur_op(conn, administratie_id, geldige_factuur(), vandaag=VANDAAG)
    _, resultaat = sla_factuur_op(
        conn, administratie_id, geldige_factuur(), vandaag=VANDAAG
    )
    assert resultaat.status == "review_nodig"
    assert any("duplicaat" in reden for reden in resultaat.redenen)


def test_zelfde_nummer_in_andere_administratie_mag(conn):
    admin_a = maak_administratie(conn, "Zaak A")
    admin_b = maak_administratie(conn, "Zaak B")
    sla_factuur_op(conn, admin_a, geldige_factuur(), vandaag=VANDAAG)
    _, resultaat = sla_factuur_op(conn, admin_b, geldige_factuur(), vandaag=VANDAAG)
    assert resultaat.status == "gevalideerd"


def test_zelfde_nummer_andere_leverancier_mag(conn, administratie_id):
    sla_factuur_op(conn, administratie_id, geldige_factuur(), vandaag=VANDAAG)
    data = geldige_factuur() | {"leverancier": "Coolblue B.V."}
    _, resultaat = sla_factuur_op(conn, administratie_id, data, vandaag=VANDAAG)
    assert resultaat.status == "gevalideerd"


def test_audit_trail_bij_aanmaken(conn, administratie_id):
    factuur_id, _ = sla_factuur_op(
        conn, administratie_id, geldige_factuur(), vandaag=VANDAAG
    )
    trail = lees_audit_trail(conn, factuur_id)
    assert len(trail) == 7  # elk factuurveld één regel
    assert all(regel["actie"] == "aangemaakt" for regel in trail)
    assert all(regel["oude_waarde"] is None for regel in trail)
    assert all(regel["tijdstip"] for regel in trail)
    per_veld = {regel["veld"]: regel["nieuwe_waarde"] for regel in trail}
    assert per_veld["bedrag_excl"] == "100.00"


def test_wijziging_bewaart_oude_waarde_in_audit_trail(conn, administratie_id):
    factuur_id, _ = sla_factuur_op(
        conn, administratie_id, geldige_factuur(), vandaag=VANDAAG
    )
    resultaat = wijzig_factuur(
        conn, factuur_id, {"leverancier": "KPN Zakelijk B.V."}, vandaag=VANDAAG
    )
    assert resultaat.status == "gevalideerd"

    wijzigingen = [
        r for r in lees_audit_trail(conn, factuur_id) if r["actie"] == "gewijzigd"
    ]
    assert len(wijzigingen) == 1
    assert wijzigingen[0]["veld"] == "leverancier"
    assert wijzigingen[0]["oude_waarde"] == "KPN B.V."
    assert wijzigingen[0]["nieuwe_waarde"] == "KPN Zakelijk B.V."

    assert lees_factuur(conn, factuur_id)["leverancier"] == "KPN Zakelijk B.V."


def test_correctie_zet_status_terug_naar_gevalideerd(conn, administratie_id):
    data = geldige_factuur() | {"bedrag_incl": "999.00"}
    factuur_id, resultaat = sla_factuur_op(
        conn, administratie_id, data, vandaag=VANDAAG
    )
    assert resultaat.status == "review_nodig"

    resultaat = wijzig_factuur(
        conn, factuur_id, {"bedrag_incl": "121.00"}, vandaag=VANDAAG
    )
    assert resultaat.status == "gevalideerd"
    assert lees_factuur(conn, factuur_id)["status"] == "gevalideerd"


def test_wijziging_naar_foute_waarde_geeft_review(conn, administratie_id):
    factuur_id, _ = sla_factuur_op(
        conn, administratie_id, geldige_factuur(), vandaag=VANDAAG
    )
    resultaat = wijzig_factuur(
        conn, factuur_id, {"btw_bedrag": "5.00"}, vandaag=VANDAAG
    )
    assert resultaat.status == "review_nodig"
    assert lees_factuur(conn, factuur_id)["status"] == "review_nodig"


def test_wijziging_onbekend_veld_wordt_geweigerd(conn, administratie_id):
    factuur_id, _ = sla_factuur_op(
        conn, administratie_id, geldige_factuur(), vandaag=VANDAAG
    )
    with pytest.raises(ValueError, match="onbekende factuurvelden"):
        wijzig_factuur(conn, factuur_id, {"status": "gevalideerd"}, vandaag=VANDAAG)


def test_wijziging_onbestaande_factuur_wordt_geweigerd(conn, administratie_id):
    with pytest.raises(ValueError, match="bestaat niet"):
        wijzig_factuur(conn, 999, {"leverancier": "X"}, vandaag=VANDAAG)
