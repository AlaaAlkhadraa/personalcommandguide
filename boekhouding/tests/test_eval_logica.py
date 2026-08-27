"""Tests voor de vergelijkingslogica van de eval.

Het evalscript zelf draait buiten pytest omdat het echte API-aanroepen
doet. De manier waarop het een gelezen waarde met de grondwaarheid
vergelijkt is echter gewone rekenkunde zonder API, en juist die moet
kloppen: anders meet de eval het verkeerde.
"""

import sys
from pathlib import Path

import pytest

sys.path.insert(0, str(Path(__file__).resolve().parent.parent / "scripts"))

from eval_extractie import (  # noqa: E402
    OORDELEN,
    als_datum,
    als_decimal,
    beoordeel_veld,
    rapportpad,
)


def test_gevaarlijkste_oordeel_staat_vooraan():
    assert OORDELEN[0] == "verzonnen"


# --- verzonnen: het model vult iets in dat er niet staat ---------------

def test_verzonnen_is_een_eigen_categorie():
    # Factuur 09 heeft geen factuurnummer. Vult het model er toch een in,
    # dan telt dat niet als "fout" maar als "verzonnen": de validatie van
    # module 1 vangt dit namelijk niet.
    oordeel, toelichting = beoordeel_veld("factuurnummer", "2026-9999", None)
    assert oordeel == "verzonnen"
    assert "2026-9999" in toelichting
    assert "staat niet op het document" in toelichting


def test_verzonnen_bij_lege_grondwaarheid():
    assert beoordeel_veld("factuurnummer", "X-1", "")[0] == "verzonnen"


def test_niets_invullen_bij_ontbrekend_veld_is_correct():
    # Dit is het gewenste gedrag bij factuur 09.
    oordeel, toelichting = beoordeel_veld("factuurnummer", None, None)
    assert oordeel == "correct"
    assert "niet ingevuld" in toelichting


# --- de andere drie ----------------------------------------------------

def test_gemist_als_het_veld_er_wel_staat():
    oordeel, toelichting = beoordeel_veld("factuurnummer", None, "2026-0412")
    assert oordeel == "gemist"
    assert "2026-0412" in toelichting


def test_fout_bij_een_andere_waarde():
    oordeel, _ = beoordeel_veld("factuurnummer", "2026-0413", "2026-0412")
    assert oordeel == "fout"


def test_gelijke_waarde_is_correct():
    assert beoordeel_veld("leverancier", "KPN B.V.", "KPN B.V.")[0] == "correct"


def test_hoofdletters_en_spaties_tellen_niet_mee():
    oordeel, _ = beoordeel_veld(
        "leverancier", "  van dijk ICT-diensten ", "Van Dijk ICT-diensten"
    )
    assert oordeel == "correct"


# --- notatie mag verschillen, de waarde niet ---------------------------

@pytest.mark.parametrize(
    "gelezen, verwacht, verwachting",
    [
        ("1.250,00", "1250.00", "correct"),   # Nederlands duizendtal
        ("1250,00", "1250.00", "correct"),
        ("1250.00", "1250.00", "correct"),
        ("-544,50", "-544.50", "correct"),    # creditnota
        ("125,00", "1250.00", "fout"),        # factor 10 mis
        ("1.250", "1250.00", "fout"),         # ambigu, dus niet zomaar goed
    ],
)
def test_bedragen_worden_op_waarde_vergeleken(gelezen, verwacht, verwachting):
    assert beoordeel_veld("bedrag_excl", gelezen, verwacht)[0] == verwachting


@pytest.mark.parametrize(
    "gelezen, verwacht, verwachting",
    [
        ("2026-07-12", "12-07-2026", "correct"),  # ISO tegen Nederlands
        ("12-07-2026", "12-07-2026", "correct"),
        ("2026-07-11", "12-07-2026", "fout"),
        ("12 juli 2026", "12-07-2026", "fout"),   # onleesbare notatie
    ],
)
def test_datums_worden_op_datum_vergeleken(gelezen, verwacht, verwachting):
    assert beoordeel_veld("factuurdatum", gelezen, verwacht)[0] == verwachting


def test_onleesbaar_bedrag_telt_niet_stiekem_als_goed():
    assert als_decimal("geen bedrag") is None
    assert beoordeel_veld("bedrag_excl", "geen bedrag", "450.00")[0] == "fout"


def test_onleesbare_datum_telt_niet_stiekem_als_goed():
    assert als_datum("gisteren") is None


# --- rapport per model -------------------------------------------------

def test_elk_model_krijgt_een_eigen_rapportbestand():
    een = rapportpad("claude-opus-5")
    twee = rapportpad("claude-haiku-4-5")
    assert een != twee
    assert een.name == "eval-rapport-claude-opus-5.json"


def test_rapportnaam_blijft_een_veilige_bestandsnaam():
    naam = rapportpad("raar/model:naam").name
    assert "/" not in naam and ":" not in naam
