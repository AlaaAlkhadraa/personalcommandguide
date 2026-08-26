"""Tests voor de rekenregels, datumcontroles en de duplicaatcheck."""

from boekhouding import valideer_factuur
from conftest import VANDAAG, geldige_factuur


# --- optelling: bedrag_excl + btw_bedrag == bedrag_incl (±€0.02) ---

def test_optelling_binnen_tolerantie_is_ok():
    data = geldige_factuur() | {"bedrag_incl": "121.02"}  # 2 cent afronding
    assert valideer_factuur(data, vandaag=VANDAAG).status == "gevalideerd"


def test_optelling_buiten_tolerantie_geeft_review():
    data = geldige_factuur() | {"bedrag_incl": "121.03"}  # 3 cent verschil
    resultaat = valideer_factuur(data, vandaag=VANDAAG)
    assert resultaat.status == "review_nodig"
    assert any("bedrag_incl" in reden for reden in resultaat.redenen)


# --- btw: btw_bedrag == bedrag_excl × pct/100 (±€0.02) ---

def test_btw_afronding_binnen_tolerantie_is_ok():
    # 9% van 33.33 = 2.9997 ≈ 3.00
    data = geldige_factuur() | {
        "bedrag_excl": "33.33",
        "btw_percentage": "9",
        "btw_bedrag": "3.00",
        "bedrag_incl": "36.33",
    }
    assert valideer_factuur(data, vandaag=VANDAAG).status == "gevalideerd"


def test_verkeerd_btw_bedrag_geeft_review():
    data = geldige_factuur() | {"btw_bedrag": "21.03", "bedrag_incl": "121.03"}
    resultaat = valideer_factuur(data, vandaag=VANDAAG)
    assert resultaat.status == "review_nodig"
    assert any("btw_bedrag" in reden for reden in resultaat.redenen)


# --- factuurdatum: niet in de toekomst, niet ouder dan 2 jaar ---

def test_datum_in_de_toekomst_geeft_review():
    data = geldige_factuur() | {"factuurdatum": "2026-08-27"}  # morgen
    resultaat = valideer_factuur(data, vandaag=VANDAAG)
    assert resultaat.status == "review_nodig"
    assert any("toekomst" in reden for reden in resultaat.redenen)


def test_datum_vandaag_is_ok():
    data = geldige_factuur() | {"factuurdatum": str(VANDAAG)}
    assert valideer_factuur(data, vandaag=VANDAAG).status == "gevalideerd"


def test_datum_precies_twee_jaar_geleden_is_ok():
    data = geldige_factuur() | {"factuurdatum": "2024-08-26"}
    assert valideer_factuur(data, vandaag=VANDAAG).status == "gevalideerd"


def test_datum_ouder_dan_twee_jaar_geeft_review():
    data = geldige_factuur() | {"factuurdatum": "2024-08-25"}
    resultaat = valideer_factuur(data, vandaag=VANDAAG)
    assert resultaat.status == "review_nodig"
    assert any("ouder dan" in reden for reden in resultaat.redenen)


# --- duplicaatcheck ---

def test_duplicaat_geeft_review():
    resultaat = valideer_factuur(
        geldige_factuur(), vandaag=VANDAAG, is_duplicaat=lambda f: True
    )
    assert resultaat.status == "review_nodig"
    assert any("duplicaat" in reden for reden in resultaat.redenen)


def test_geen_duplicaat_is_ok():
    resultaat = valideer_factuur(
        geldige_factuur(), vandaag=VANDAAG, is_duplicaat=lambda f: False
    )
    assert resultaat.status == "gevalideerd"


# --- meerdere fouten tegelijk ---

def test_alle_fouten_worden_verzameld():
    data = geldige_factuur() | {
        "factuurdatum": "2026-12-31",  # toekomst
        "btw_bedrag": "5.00",          # klopt niet met 21%
        "bedrag_incl": "999.00",       # optelling klopt niet
    }
    resultaat = valideer_factuur(
        data, vandaag=VANDAAG, is_duplicaat=lambda f: True
    )
    assert resultaat.status == "review_nodig"
    assert len(resultaat.redenen) == 4
    assert resultaat.factuur is not None  # data blijft bruikbaar voor review
