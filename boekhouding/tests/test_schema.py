"""Tests voor het Pydantic-schema Factuur (types, floats, btw-percentages)."""

from decimal import Decimal

from boekhouding import valideer_factuur
from conftest import VANDAAG, geldige_factuur


def test_geldige_factuur_wordt_gevalideerd():
    resultaat = valideer_factuur(geldige_factuur(), vandaag=VANDAAG)
    assert resultaat.status == "gevalideerd"
    assert resultaat.redenen == []
    assert resultaat.factuur is not None


def test_bedragen_zijn_decimal_geen_float():
    resultaat = valideer_factuur(geldige_factuur(), vandaag=VANDAAG)
    assert isinstance(resultaat.factuur.bedrag_excl, Decimal)
    assert isinstance(resultaat.factuur.btw_bedrag, Decimal)
    assert isinstance(resultaat.factuur.bedrag_incl, Decimal)


def test_float_wordt_geweigerd():
    data = geldige_factuur()
    data["bedrag_excl"] = 100.00  # float — Gouden regel 5
    resultaat = valideer_factuur(data, vandaag=VANDAAG)
    assert resultaat.status == "review_nodig"
    assert any("float" in reden for reden in resultaat.redenen)


def test_komma_als_decimaalteken_wordt_begrepen():
    data = geldige_factuur()
    data["bedrag_excl"] = "100,00"
    resultaat = valideer_factuur(data, vandaag=VANDAAG)
    assert resultaat.status == "gevalideerd"
    assert resultaat.factuur.bedrag_excl == Decimal("100.00")


def test_btw_9_en_0_zijn_toegestaan():
    negen = geldige_factuur() | {
        "btw_percentage": "9", "btw_bedrag": "9.00", "bedrag_incl": "109.00",
    }
    nul = geldige_factuur() | {
        "btw_percentage": "0", "btw_bedrag": "0.00", "bedrag_incl": "100.00",
    }
    assert valideer_factuur(negen, vandaag=VANDAAG).status == "gevalideerd"
    assert valideer_factuur(nul, vandaag=VANDAAG).status == "gevalideerd"


def test_ongeldig_btw_percentage_geeft_review():
    data = geldige_factuur() | {
        "btw_percentage": "15", "btw_bedrag": "15.00", "bedrag_incl": "115.00",
    }
    resultaat = valideer_factuur(data, vandaag=VANDAAG)
    assert resultaat.status == "review_nodig"
    assert any("btw_percentage" in reden for reden in resultaat.redenen)


def test_jaar_zonder_btw_config_geeft_review():
    # 2023 heeft geen config-bestand; nooit gokken, dus review.
    data = geldige_factuur() | {"factuurdatum": "2023-01-15"}
    resultaat = valideer_factuur(data, vandaag=VANDAAG)
    assert resultaat.status == "review_nodig"
    assert any("btw-configuratie" in reden for reden in resultaat.redenen)


def test_lege_leverancier_geeft_review():
    data = geldige_factuur() | {"leverancier": "   "}
    resultaat = valideer_factuur(data, vandaag=VANDAAG)
    assert resultaat.status == "review_nodig"
    assert any("leverancier" in reden for reden in resultaat.redenen)


def test_ontbrekend_veld_geeft_review_en_bewaart_data():
    data = geldige_factuur()
    del data["factuurnummer"]
    resultaat = valideer_factuur(data, vandaag=VANDAAG)
    assert resultaat.status == "review_nodig"
    assert any("factuurnummer" in reden for reden in resultaat.redenen)
    assert resultaat.originele_data == data  # niets weggegooid


def test_onzin_input_gooit_nooit_een_exception():
    resultaat = valideer_factuur(
        {"leverancier": 42, "bedrag_excl": "abc", "factuurdatum": "gisteren"},
        vandaag=VANDAAG,
    )
    assert resultaat.status == "review_nodig"
    assert len(resultaat.redenen) >= 3
