"""Tests voor de AI-extractie (module 3).

Er gaat hier NOOIT een echt verzoek naar de API. De client wordt
nagemaakt en meegegeven; de echte client wordt nergens gebouwd, dus er
is ook geen API-sleutel nodig om deze tests te draaien.
"""

import json
from decimal import Decimal

import pytest
from pydantic import ValidationError

from boekhouding import (
    FactuurExtractie,
    VeldExtractie,
    beoordeel_extractie,
    bepaal_invoerpad,
    bewaar_document,
    extraheer_factuur,
    lees_audit_trail,
    lees_extractie,
    sla_extractie_op,
)
from boekhouding.ai_extractie import (
    PROMPT_VERSIE,
    STANDAARD_MODEL,
    SYSTEEM_PROMPT,
    foutreden,
    maak_client,
    standaard_model,
)
from conftest import VANDAAG, maak_pdf


# --- nagemaakte client ------------------------------------------------

class NageaapteRespons:
    """Doet zich voor als het antwoord van de SDK."""

    def __init__(self, parsed_output, ruwe_json="", stop_reason="end_turn"):
        self.parsed_output = parsed_output
        self.stop_reason = stop_reason
        self.content = (
            [type("Blok", (), {"type": "text", "text": ruwe_json})()]
            if ruwe_json
            else []
        )


class NageaapteBerichten:
    def __init__(self, respons):
        self._respons = respons
        self.aanroepen = []

    def parse(self, **argumenten):
        self.aanroepen.append(argumenten)
        if isinstance(self._respons, Exception):
            raise self._respons
        return self._respons


class NageaapteClient:
    """Vervangt anthropic.Anthropic; telt hoe vaak hij is aangeroepen."""

    def __init__(self, respons):
        self.messages = NageaapteBerichten(respons)

    @property
    def aanroepen(self):
        return self.messages.aanroepen


def veld(waarde, zekerheid="hoog", reden=None):
    return VeldExtractie(waarde=waarde, zekerheid=zekerheid, reden=reden)


def goede_extractie(**overschrijf) -> FactuurExtractie:
    velden = {
        "leverancier": veld("Van Dijk ICT-diensten"),
        "factuurdatum": veld("2026-07-12"),
        "factuurnummer": veld("2026-0412"),
        "bedrag_excl": veld("450,00"),
        "btw_percentage": veld("21"),
        "btw_bedrag": veld("94,50"),
        "bedrag_incl": veld("544,50"),
    }
    velden.update(overschrijf)
    return FactuurExtractie(**velden)


def client_met(extractie: FactuurExtractie, **kwargs) -> NageaapteClient:
    return NageaapteClient(
        NageaapteRespons(extractie, ruwe_json=extractie.model_dump_json(), **kwargs)
    )


@pytest.fixture
def factuur_pdf(tmp_path):
    pad = tmp_path / "factuur.pdf"
    pad.write_bytes(maak_pdf("Factuur 2026-0412 Van Dijk ICT-diensten 544,50"))
    return pad


@pytest.fixture
def scan_jpg(tmp_path):
    pad = tmp_path / "scan.jpg"
    pad.write_bytes(b"\xff\xd8\xff\xe0 nep-jpeg")
    return pad


# --- schema: zekerheid --------------------------------------------------

def test_lage_zekerheid_zonder_reden_wordt_geweigerd():
    with pytest.raises(ValidationError, match="reden"):
        VeldExtractie(waarde="450,00", zekerheid="laag")


def test_lage_zekerheid_met_reden_mag():
    gegeven = VeldExtractie(waarde="450,00", zekerheid="laag", reden="cijfer vaag")
    assert gegeven.zekerheid == "laag"


def test_onbekende_zekerheid_wordt_geweigerd():
    with pytest.raises(ValidationError):
        VeldExtractie(waarde="450,00", zekerheid="misschien")


# --- beoordeling --------------------------------------------------------

def test_alles_hoog_en_kloppend_is_gevalideerd():
    status, redenen, factuur = beoordeel_extractie(goede_extractie(), vandaag=VANDAAG)
    assert status == "gevalideerd"
    assert redenen == []
    assert factuur.bedrag_excl == Decimal("450.00")


def test_een_veld_met_lage_zekerheid_stuurt_alles_naar_review():
    extractie = goede_extractie(
        bedrag_incl=veld("544,50", "laag", "cijfer onscherp door vouw in papier")
    )
    status, redenen, factuur = beoordeel_extractie(extractie, vandaag=VANDAAG)
    assert status == "review_nodig"
    assert any(
        "bedrag_incl" in reden and "lage zekerheid" in reden and "vouw" in reden
        for reden in redenen
    )
    # De gelezen waarden blijven bruikbaar voor de mens die beoordeelt.
    assert factuur is not None


def test_ontbrekend_veld_wordt_null_en_review():
    extractie = goede_extractie(
        factuurnummer=veld(None, "laag", "geen factuurnummer op het document")
    )
    status, redenen, _ = beoordeel_extractie(extractie, vandaag=VANDAAG)
    assert status == "review_nodig"
    assert any(
        "factuurnummer" in reden and "niet op het document gevonden" in reden
        for reden in redenen
    )


def test_leeg_veld_telt_als_ontbrekend():
    extractie = goede_extractie(leverancier=veld("   ", "laag", "onleesbaar"))
    status, redenen, _ = beoordeel_extractie(extractie, vandaag=VANDAAG)
    assert status == "review_nodig"
    assert any("leverancier" in reden for reden in redenen)


def test_de_ai_rekent_niet_de_validatie_vangt_de_fout():
    # Het model is er zeker van, maar 300 + 63 is geen 383.
    extractie = goede_extractie(
        bedrag_excl=veld("300,00"),
        btw_bedrag=veld("63,00"),
        bedrag_incl=veld("383,00"),
    )
    status, redenen, _ = beoordeel_extractie(extractie, vandaag=VANDAAG)
    assert status == "review_nodig"
    assert any("bedrag_incl" in reden and "verschil" in reden for reden in redenen)


def test_nederlands_duizendtal_uit_de_extractie_wordt_begrepen():
    extractie = goede_extractie(
        bedrag_excl=veld("1.250,00"),
        btw_bedrag=veld("262,50"),
        bedrag_incl=veld("1.512,50"),
    )
    status, _, factuur = beoordeel_extractie(extractie, vandaag=VANDAAG)
    assert status == "gevalideerd"
    assert factuur.bedrag_excl == Decimal("1250.00")


def test_ongeldig_btw_percentage_uit_de_extractie_geeft_review():
    extractie = goede_extractie(
        btw_percentage=veld("15"), btw_bedrag=veld("67,50"), bedrag_incl=veld("517,50")
    )
    status, redenen, _ = beoordeel_extractie(extractie, vandaag=VANDAAG)
    assert status == "review_nodig"
    assert any("btw_percentage" in reden for reden in redenen)


# --- invoerpaden --------------------------------------------------------

def test_pdf_met_tekstlaag_gaat_langs_het_tekstpad(factuur_pdf):
    assert bepaal_invoerpad(factuur_pdf) == ("tekst", None)


def test_pdf_zonder_tekstlaag_gaat_langs_het_beeldpad(tmp_path):
    scan = tmp_path / "scan.pdf"
    scan.write_bytes(maak_pdf(None))
    assert bepaal_invoerpad(scan) == ("beeld", None)


def test_afbeelding_gaat_langs_het_beeldpad(scan_jpg):
    # Belangrijk: een JPG is geen kapotte PDF, dus niet eerst proberen
    # er tekst uit te halen.
    assert bepaal_invoerpad(scan_jpg) == ("beeld", None)


def test_onbekende_bestandssoort_geeft_reden(tmp_path):
    document = tmp_path / "factuur.docx"
    document.write_bytes(b"PK\x03\x04")
    invoerpad, reden = bepaal_invoerpad(document)
    assert invoerpad is None
    assert ".docx" in reden


def test_tekstpad_stuurt_de_factuurtekst_mee(factuur_pdf):
    client = client_met(goede_extractie())
    resultaat = extraheer_factuur(factuur_pdf, client=client, vandaag=VANDAAG)

    assert resultaat.invoerpad == "tekst"
    inhoud = client.aanroepen[0]["messages"][0]["content"]
    assert len(inhoud) == 1 and inhoud[0]["type"] == "text"
    assert "2026-0412" in inhoud[0]["text"]


def test_beeldpad_stuurt_het_plaatje_mee_als_base64(scan_jpg):
    import base64

    client = client_met(goede_extractie())
    resultaat = extraheer_factuur(scan_jpg, client=client, vandaag=VANDAAG)

    assert resultaat.invoerpad == "beeld"
    inhoud = client.aanroepen[0]["messages"][0]["content"]
    assert inhoud[0]["type"] == "image"
    assert inhoud[0]["source"]["media_type"] == "image/jpeg"
    assert base64.standard_b64decode(inhoud[0]["source"]["data"]) == (
        scan_jpg.read_bytes()
    )


def test_gescande_pdf_gaat_als_document_mee(tmp_path):
    scan = tmp_path / "scan.pdf"
    scan.write_bytes(maak_pdf(None))
    client = client_met(goede_extractie())
    extraheer_factuur(scan, client=client, vandaag=VANDAAG)

    inhoud = client.aanroepen[0]["messages"][0]["content"]
    assert inhoud[0]["type"] == "document"
    assert inhoud[0]["source"]["media_type"] == "application/pdf"


# --- het verzoek zelf ---------------------------------------------------

def test_er_wordt_om_structured_output_gevraagd(factuur_pdf):
    client = client_met(goede_extractie())
    extraheer_factuur(factuur_pdf, client=client, vandaag=VANDAAG)

    aanroep = client.aanroepen[0]
    assert aanroep["output_format"] is FactuurExtractie  # geen vrije tekst
    assert aanroep["model"] == STANDAARD_MODEL


def test_de_systeemprompt_verbiedt_gokken_en_rekenen(factuur_pdf):
    client = client_met(goede_extractie())
    extraheer_factuur(factuur_pdf, client=client, vandaag=VANDAAG)

    prompt = client.aanroepen[0]["system"]
    assert prompt == SYSTEEM_PROMPT
    assert "null" in prompt
    assert "Verzin nooit" in prompt
    assert "Reken niet" in prompt


def test_precies_een_aanroep_per_document(factuur_pdf):
    client = client_met(goede_extractie())
    extraheer_factuur(factuur_pdf, client=client, vandaag=VANDAAG)
    assert len(client.aanroepen) == 1


def test_onleesbaar_bestand_kost_geen_aanroep(tmp_path):
    client = client_met(goede_extractie())
    resultaat = extraheer_factuur(
        tmp_path / "factuur.docx", client=client, vandaag=VANDAAG
    )
    assert resultaat.status == "review_nodig"
    assert client.aanroepen == []  # niet eens naar het model gestuurd


def test_onbestaand_bestand_kost_geen_aanroep(tmp_path):
    client = client_met(goede_extractie())
    resultaat = extraheer_factuur(
        tmp_path / "weg.pdf", client=client, vandaag=VANDAAG
    )
    assert resultaat.status == "review_nodig"
    assert any("niet gevonden" in reden for reden in resultaat.redenen)
    assert client.aanroepen == []


# --- weigering en onbruikbaar antwoord ----------------------------------

def test_geweigerd_document_geeft_review(factuur_pdf):
    client = NageaapteClient(NageaapteRespons(None, stop_reason="refusal"))
    resultaat = extraheer_factuur(factuur_pdf, client=client, vandaag=VANDAAG)
    assert resultaat.status == "review_nodig"
    assert any("geweigerd" in reden for reden in resultaat.redenen)


def test_antwoord_zonder_formulier_geeft_review(factuur_pdf):
    client = NageaapteClient(NageaapteRespons(None, ruwe_json="onzin"))
    resultaat = extraheer_factuur(factuur_pdf, client=client, vandaag=VANDAAG)
    assert resultaat.status == "review_nodig"
    assert any("geen bruikbaar formulier" in reden for reden in resultaat.redenen)


# --- sleutelbeheer ------------------------------------------------------

def test_zonder_sleutel_een_duidelijke_fout_zonder_waarde(tmp_path, monkeypatch):
    monkeypatch.delenv("ANTHROPIC_API_KEY", raising=False)
    leeg_env = tmp_path / "bestaat-niet.env"
    with pytest.raises(RuntimeError) as fout:
        maak_client(leeg_env)
    bericht = str(fout.value)
    assert "ANTHROPIC_API_KEY" in bericht
    assert ".env" in bericht
    assert "nep-sleutel" not in bericht  # nooit een sleutelwaarde in een melding


def test_env_bestand_wordt_gelezen_maar_niet_getoond(tmp_path, monkeypatch):
    from boekhouding import api_sleutel

    monkeypatch.delenv("ANTHROPIC_API_KEY", raising=False)
    env = tmp_path / ".env"
    env.write_text("ANTHROPIC_API_KEY=nep-sleutel-alleen-voor-deze-test\n", encoding="utf-8")
    assert api_sleutel(env) == "nep-sleutel-alleen-voor-deze-test"


# --- opslag en audit trail ----------------------------------------------

def test_extractie_wordt_opgeslagen_met_model_en_ruwe_respons(
    conn, administratie_id, factuur_pdf, tmp_path
):
    document = bewaar_document(
        conn, administratie_id, str(factuur_pdf), str(tmp_path / "opslag")
    )
    client = client_met(goede_extractie())
    resultaat = extraheer_factuur(factuur_pdf, client=client, vandaag=VANDAAG)

    extractie_id = sla_extractie_op(
        conn, administratie_id, resultaat, document_id=document.document_id
    )
    bewaard = lees_extractie(conn, extractie_id)

    assert bewaard["model"] == STANDAARD_MODEL
    assert bewaard["invoerpad"] == "tekst"
    assert bewaard["document_id"] == document.document_id
    assert bewaard["status"] == "gevalideerd"
    assert json.loads(bewaard["ruwe_respons"])["leverancier"]["waarde"] == (
        "Van Dijk ICT-diensten"
    )


def test_audit_trail_bij_extractie(conn, administratie_id, factuur_pdf):
    client = client_met(goede_extractie())
    resultaat = extraheer_factuur(factuur_pdf, client=client, vandaag=VANDAAG)
    extractie_id = sla_extractie_op(conn, administratie_id, resultaat)

    trail = lees_audit_trail(conn, extractie_id, tabel="extracties")
    per_veld = {regel["veld"]: regel["nieuwe_waarde"] for regel in trail}
    assert per_veld["model"] == STANDAARD_MODEL
    assert per_veld["invoerpad"] == "tekst"
    assert per_veld["status"] == "gevalideerd"
    assert all(regel["tijdstip"] for regel in trail)


def test_afgekeurde_extractie_wordt_ook_bewaard(conn, administratie_id, factuur_pdf):
    extractie = goede_extractie(
        bedrag_incl=veld("999,00", "laag", "totaal onleesbaar")
    )
    client = client_met(extractie)
    resultaat = extraheer_factuur(factuur_pdf, client=client, vandaag=VANDAAG)
    extractie_id = sla_extractie_op(conn, administratie_id, resultaat)

    bewaard = lees_extractie(conn, extractie_id)
    assert bewaard["status"] == "review_nodig"
    assert len(bewaard["redenen"]) >= 1


# --- foutafhandeling: nooit een exception naar buiten -------------------

class ApiFout(Exception):
    """Doet zich voor als een fout van de SDK (die draagt status_code)."""

    def __init__(self, status_code=None, bericht="fout"):
        super().__init__(bericht)
        if status_code is not None:
            self.status_code = status_code


@pytest.mark.parametrize(
    "fout, kern",
    [
        (ApiFout(429), "rate limit"),
        (ApiFout(500), "serverfout"),
        (ApiFout(503), "serverfout"),
        (ApiFout(401), "API-sleutel"),
        (ApiFout(403), "API-sleutel"),
        (ApiFout(404), "model bestaat niet"),
        (ApiFout(400), "ongeldig"),
        (ApiFout(418), "foutcode 418"),
        (ConnectionError("verbinding verbroken"), "geen verbinding"),
        (TimeoutError("te lang"), "geen verbinding"),
        (RuntimeError("iets onverwachts"), "geen verbinding"),
    ],
)
def test_api_fout_wordt_review_en_nooit_een_exception(factuur_pdf, fout, kern):
    client = NageaapteClient(fout)
    resultaat = extraheer_factuur(factuur_pdf, client=client, vandaag=VANDAAG)

    assert resultaat.status == "review_nodig"
    assert any(kern in reden for reden in resultaat.redenen)
    assert resultaat.factuur is None


def test_stapel_facturen_loopt_door_na_een_fout(factuur_pdf, tmp_path):
    # Eén kapotte aanroep mag de rest van de stapel niet meeslepen.
    tweede = tmp_path / "tweede.pdf"
    tweede.write_bytes(maak_pdf("Factuur 2026-0413"))

    uitkomsten = []
    for pad, client in (
        (factuur_pdf, NageaapteClient(ApiFout(429))),
        (tweede, client_met(goede_extractie())),
    ):
        uitkomsten.append(extraheer_factuur(pad, client=client, vandaag=VANDAAG))

    assert uitkomsten[0].status == "review_nodig"
    assert uitkomsten[1].status == "gevalideerd"


def test_foutreden_noemt_nooit_de_sleutel():
    reden = foutreden(ApiFout(401))
    assert "sleutel" in reden           # zegt wél wát er mis is
    assert "nep-sleutel" not in reden   # maar nooit de waarde


# --- promptversie in de audit trail ------------------------------------

def test_promptversie_staat_in_het_resultaat(factuur_pdf):
    client = client_met(goede_extractie())
    resultaat = extraheer_factuur(factuur_pdf, client=client, vandaag=VANDAAG)
    assert resultaat.prompt_versie == PROMPT_VERSIE


def test_promptversie_wordt_opgeslagen(conn, administratie_id, factuur_pdf):
    client = client_met(goede_extractie())
    resultaat = extraheer_factuur(factuur_pdf, client=client, vandaag=VANDAAG)
    extractie_id = sla_extractie_op(conn, administratie_id, resultaat)

    assert lees_extractie(conn, extractie_id)["prompt_versie"] == PROMPT_VERSIE
    trail = lees_audit_trail(conn, extractie_id, tabel="extracties")
    per_veld = {regel["veld"]: regel["nieuwe_waarde"] for regel in trail}
    assert per_veld["prompt_versie"] == PROMPT_VERSIE


def test_oude_extractie_krijgt_geen_verzonnen_promptversie():
    # Een database van vóór deze kolom weet niet met welke prompt er is
    # uitgelezen; dan hoort er 'onbekend' te staan, niet de huidige versie.
    from boekhouding import maak_tabellen, maak_verbinding

    oud = maak_verbinding(":memory:")
    oud.executescript(
        """
        CREATE TABLE administraties (
            id INTEGER PRIMARY KEY, naam TEXT NOT NULL,
            type TEXT NOT NULL DEFAULT 'eenmanszaak', aangemaakt_op TEXT NOT NULL
        );
        CREATE TABLE extracties (
            id INTEGER PRIMARY KEY,
            administratie_id INTEGER NOT NULL REFERENCES administraties(id),
            document_id INTEGER, model TEXT NOT NULL, invoerpad TEXT,
            ruwe_respons TEXT NOT NULL, status TEXT NOT NULL,
            redenen TEXT NOT NULL DEFAULT '[]', aangemaakt_op TEXT NOT NULL
        );
        INSERT INTO administraties VALUES (1, 'Oud', 'eenmanszaak', '2026-01-01');
        INSERT INTO extracties VALUES
            (1, 1, NULL, 'oud-model', 'tekst', '{}', 'gevalideerd', '[]', '2026-01-01');
        """
    )
    maak_tabellen(oud)

    rij = oud.execute("SELECT prompt_versie FROM extracties WHERE id = 1").fetchone()
    assert rij[0] == "onbekend"
    oud.close()


# --- model instelbaar ---------------------------------------------------

def test_model_kan_worden_meegegeven(factuur_pdf):
    client = client_met(goede_extractie())
    resultaat = extraheer_factuur(
        factuur_pdf, client=client, model="claude-haiku-4-5", vandaag=VANDAAG
    )
    assert client.aanroepen[0]["model"] == "claude-haiku-4-5"
    assert resultaat.model == "claude-haiku-4-5"


def test_model_uit_env_wordt_gebruikt(factuur_pdf, tmp_path, monkeypatch):
    monkeypatch.delenv("ANTHROPIC_MODEL", raising=False)
    env = tmp_path / ".env"
    env.write_text("ANTHROPIC_MODEL=claude-sonnet-5\n", encoding="utf-8")

    client = client_met(goede_extractie())
    extraheer_factuur(factuur_pdf, client=client, env_pad=env, vandaag=VANDAAG)
    assert client.aanroepen[0]["model"] == "claude-sonnet-5"


def test_zonder_instelling_geldt_het_standaardmodel(tmp_path, monkeypatch):
    monkeypatch.delenv("ANTHROPIC_MODEL", raising=False)
    assert standaard_model(tmp_path / "bestaat-niet.env") == STANDAARD_MODEL


def test_meegegeven_model_gaat_voor_op_env(factuur_pdf, tmp_path, monkeypatch):
    monkeypatch.delenv("ANTHROPIC_MODEL", raising=False)
    env = tmp_path / ".env"
    env.write_text("ANTHROPIC_MODEL=claude-sonnet-5\n", encoding="utf-8")

    client = client_met(goede_extractie())
    extraheer_factuur(
        factuur_pdf, client=client, model="claude-opus-5", env_pad=env,
        vandaag=VANDAAG,
    )
    assert client.aanroepen[0]["model"] == "claude-opus-5"


def test_gebruikt_model_wordt_opgeslagen(conn, administratie_id, factuur_pdf):
    client = client_met(goede_extractie())
    resultaat = extraheer_factuur(
        factuur_pdf, client=client, model="claude-haiku-4-5", vandaag=VANDAAG
    )
    extractie_id = sla_extractie_op(conn, administratie_id, resultaat)
    assert lees_extractie(conn, extractie_id)["model"] == "claude-haiku-4-5"

# --- tokenverbruik (voor de kostenrapportage van de eval) ---------------

class Verbruik:
    def __init__(self, invoer, uitvoer):
        self.input_tokens = invoer
        self.output_tokens = uitvoer


def test_tokenverbruik_wordt_overgenomen(factuur_pdf):
    extractie = goede_extractie()
    respons = NageaapteRespons(extractie, ruwe_json=extractie.model_dump_json())
    respons.usage = Verbruik(1234, 210)
    client = NageaapteClient(respons)

    resultaat = extraheer_factuur(factuur_pdf, client=client, vandaag=VANDAAG)
    assert resultaat.invoer_tokens == 1234
    assert resultaat.uitvoer_tokens == 210


def test_zonder_verbruik_blijven_de_tellers_nul(factuur_pdf):
    # Niet elke respons hoeft usage te hebben; dat mag niet crashen.
    client = client_met(goede_extractie())
    resultaat = extraheer_factuur(factuur_pdf, client=client, vandaag=VANDAAG)
    assert resultaat.invoer_tokens == 0
    assert resultaat.uitvoer_tokens == 0
