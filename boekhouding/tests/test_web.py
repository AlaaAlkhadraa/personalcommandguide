"""Tests voor de webinterface (module 5).

Er gaat hier nooit een echt verzoek naar de API: waar de AI-route wordt
geraakt, krijgt de app een nagemaakte client mee.
"""

from datetime import date
from pathlib import Path

import pytest
from fastapi.testclient import TestClient

from boekhouding import (
    boeking_bij_factuur,
    lees_audit_trail,
    lees_banktransacties,
    lees_facturen,
    lees_verkoopfactuur,
    maak_verbinding,
)
from boekhouding.web import maak_app
from conftest import maak_pdf
from test_ai_extractie import NageaapteClient, NageaapteRespons, goede_extractie, veld

VANDAAG = date(2026, 8, 27)
UBLMAP = Path(__file__).parent / "testfacturen" / "ubl"


def client_met(extractie):
    return NageaapteClient(
        NageaapteRespons(extractie, ruwe_json=extractie.model_dump_json())
    )


@pytest.fixture
def werkmap(tmp_path):
    return tmp_path


@pytest.fixture
def app_en_client(werkmap):
    """Een app met een nagemaakte AI-client die altijd hetzelfde teruggeeft."""
    ai = client_met(goede_extractie())
    app = maak_app(
        str(werkmap / "boekhouding.sqlite"), str(werkmap / "opslag"),
        ai_client=ai, vandaag=VANDAAG,
    )
    return app, TestClient(app), ai


@pytest.fixture
def web(app_en_client):
    return app_en_client[1]


def upload(web, pad_of_bytes, naam="factuur.pdf"):
    inhoud = (
        pad_of_bytes.read_bytes()
        if isinstance(pad_of_bytes, Path) else pad_of_bytes
    )
    return web.post(
        "/administratie/1/upload",
        files={"bestand": (naam, inhoud, "application/octet-stream")},
        follow_redirects=False,
    )


# --- opstarten ----------------------------------------------------------

def test_startpagina_gaat_naar_de_lijst(web):
    antwoord = web.get("/", follow_redirects=False)
    assert antwoord.status_code == 303
    assert antwoord.headers["location"] == "/administratie/1"


def test_lege_lijst_zegt_dat_netjes(web):
    pagina = web.get("/administratie/1").text
    assert "Nog geen facturen" in pagina
    assert "Factuur toevoegen" in pagina


def test_onbekende_administratie_geeft_404(web):
    antwoord = web.get("/administratie/999")
    assert antwoord.status_code == 404
    assert "Niet gevonden" in antwoord.text


def test_de_pagina_is_mobiel_eerst(web):
    pagina = web.get("/administratie/1").text
    assert 'name="viewport"' in pagina
    assert "width=device-width" in pagina


# --- uploaden -----------------------------------------------------------

def test_efactuur_uploaden_levert_een_factuur_op(web):
    antwoord = upload(web, UBLMAP / "01-standaard-21procent.xml", "efactuur.xml")
    assert antwoord.status_code == 303
    assert antwoord.headers["location"] == "/administratie/1/factuur/1"

    pagina = web.get("/administratie/1/factuur/1").text
    assert "Van Dijk ICT-diensten" in pagina
    assert "484.00" in pagina


def test_efactuur_gebruikt_geen_ai(app_en_client):
    _, web, ai = app_en_client
    upload(web, UBLMAP / "01-standaard-21procent.xml", "efactuur.xml")
    assert ai.aanroepen == []  # een e-factuur hoeft niet uitgelezen te worden


def test_pdf_uploaden_gaat_wel_langs_het_model(app_en_client):
    _, web, ai = app_en_client
    antwoord = upload(web, maak_pdf("Factuur 2026-0412 Van Dijk"), "factuur.pdf")
    assert antwoord.status_code == 303
    assert len(ai.aanroepen) == 1


def test_uploadscherm_laat_een_foto_maken(web):
    pagina = web.get("/administratie/1/upload").text
    assert 'type="file"' in pagina
    assert 'accept="image/*,.pdf,.xml"' in pagina
    assert "capture" in pagina


def test_onbruikbaar_bestand_wordt_uitgelegd(web):
    antwoord = upload(web, b"PK\x03\x04 nep-docx", "factuur.docx")
    assert antwoord.status_code == 200
    assert "niet verwerkt" in antwoord.text
    assert "geen PDF, afbeelding of e-factuur" in antwoord.text


def test_leeg_bestand_wordt_uitgelegd(web):
    antwoord = upload(web, b"", "leeg.pdf")
    assert "leeg" in antwoord.text


def test_het_origineel_wordt_bewaard(app_en_client, werkmap):
    _, web, _ = app_en_client
    upload(web, UBLMAP / "01-standaard-21procent.xml", "efactuur.xml")
    bewaard = list((werkmap / "opslag").rglob("*.xml"))
    assert len(bewaard) == 1


# --- overzicht ----------------------------------------------------------

def test_review_staat_bovenaan(app_en_client, werkmap):
    _, web, _ = app_en_client
    # Eerst een goede e-factuur, daarna een met een ontbrekend veld.
    upload(web, UBLMAP / "01-standaard-21procent.xml", "goed.xml")
    upload(web, UBLMAP / "05-zonder-factuurdatum.xml", "fout.xml")

    conn = maak_verbinding(str(werkmap / "boekhouding.sqlite"))
    facturen = lees_facturen(conn, 1)
    conn.close()
    assert facturen[0]["status"] == "review_nodig"

    pagina = web.get("/administratie/1").text
    assert pagina.index("Review nodig") < pagina.index("Klaar om goed te keuren")


def test_de_teller_laat_zien_hoeveel_er_wachten(web):
    upload(web, UBLMAP / "05-zonder-factuurdatum.xml", "fout.xml")
    pagina = web.get("/administratie/1").text
    assert "factuur wacht op jou" in pagina


def test_elke_rij_toont_leverancier_datum_bedrag_en_status(web):
    upload(web, UBLMAP / "01-standaard-21procent.xml", "goed.xml")
    pagina = web.get("/administratie/1").text
    assert "Van Dijk ICT-diensten" in pagina
    assert "2026-07-14" in pagina
    assert "484.00" in pagina
    assert "Klaar om goed te keuren" in pagina


# --- reviewscherm -------------------------------------------------------

def test_reviewscherm_toont_het_originele_document(web):
    upload(web, UBLMAP / "01-standaard-21procent.xml", "goed.xml")
    pagina = web.get("/administratie/1/factuur/1").text
    assert "/administratie/1/document/1" in pagina


def test_het_document_kan_worden_opgehaald(web):
    upload(web, maak_pdf("Factuur 2026-0412"), "factuur.pdf")
    antwoord = web.get("/administratie/1/document/1")
    assert antwoord.status_code == 200
    assert antwoord.headers["content-type"] == "application/pdf"
    assert "inline" in antwoord.headers["content-disposition"]


def test_onbekend_document_geeft_404(web):
    assert web.get("/administratie/1/document/999").status_code == 404


def test_alle_velden_zijn_bewerkbaar(web):
    upload(web, UBLMAP / "01-standaard-21procent.xml", "goed.xml")
    pagina = web.get("/administratie/1/factuur/1").text
    for veldnaam in ("leverancier", "factuurdatum", "factuurnummer",
                     "bedrag_excl", "btw_percentage", "btw_bedrag", "bedrag_incl"):
        assert f'name="{veldnaam}"' in pagina


def test_lage_zekerheid_wordt_gemarkeerd(werkmap):
    onzeker = goede_extractie(
        bedrag_incl=veld("544,50", "laag", "cijfer onscherp door vouw")
    )
    app = maak_app(
        str(werkmap / "db.sqlite"), str(werkmap / "opslag"),
        ai_client=client_met(onzeker), vandaag=VANDAAG,
    )
    web = TestClient(app)
    upload(web, maak_pdf("Factuur 2026-0412"), "factuur.pdf")

    pagina = web.get("/administratie/1/factuur/1").text
    assert "lage zekerheid" in pagina
    assert "cijfer onscherp door vouw" in pagina


def test_redenen_staan_bovenaan_in_gewone_taal(web):
    upload(web, UBLMAP / "05-zonder-factuurdatum.xml", "fout.xml")
    pagina = web.get("/administratie/1/factuur/1").text
    assert "Dit moet nog nagekeken worden" in pagina
    assert "factuurdatum ontbreekt" in pagina


def test_bij_een_efactuur_staat_er_geen_zekerheid(web):
    upload(web, UBLMAP / "01-standaard-21procent.xml", "goed.xml")
    pagina = web.get("/administratie/1/factuur/1").text
    assert "lage zekerheid" not in pagina
    assert "Uitgelezen door" not in pagina  # geen model gebruikt


def test_onbekende_factuur_geeft_404(web):
    antwoord = web.get("/administratie/1/factuur/999")
    assert antwoord.status_code == 404


# --- opslaan en goedkeuren ---------------------------------------------

def test_opslaan_gaat_via_wijzig_factuur_met_audit_trail(app_en_client, werkmap):
    _, web, _ = app_en_client
    upload(web, UBLMAP / "01-standaard-21procent.xml", "goed.xml")

    web.post(
        "/administratie/1/factuur/1/opslaan",
        data={"leverancier": "Van Dijk ICT B.V."},
        follow_redirects=False,
    )

    conn = maak_verbinding(str(werkmap / "boekhouding.sqlite"))
    trail = [r for r in lees_audit_trail(conn, 1) if r["actie"] == "gewijzigd"]
    conn.close()
    assert any(
        r["veld"] == "leverancier" and r["oude_waarde"] == "Van Dijk ICT-diensten"
        and r["nieuwe_waarde"] == "Van Dijk ICT B.V."
        for r in trail
    )


def test_een_correctie_haalt_de_factuur_uit_review(web):
    upload(web, UBLMAP / "05-zonder-factuurdatum.xml", "fout.xml")
    assert "Review nodig" in web.get("/administratie/1").text

    web.post(
        "/administratie/1/factuur/1/opslaan",
        data={"factuurdatum": "2026-08-18"},
        follow_redirects=False,
    )
    pagina = web.get("/administratie/1").text
    assert "Review nodig" not in pagina
    assert "Klaar om goed te keuren" in pagina


def test_goedkeuren_kan_niet_bij_openstaande_punten(web, werkmap):
    upload(web, UBLMAP / "05-zonder-factuurdatum.xml", "fout.xml")

    pagina = web.get("/administratie/1/factuur/1").text
    assert "disabled" in pagina  # de knop staat uit

    # En ook als iemand het formulier tóch verstuurt, gebeurt het niet.
    antwoord = web.post("/administratie/1/factuur/1/goedkeuren", follow_redirects=False)
    assert antwoord.status_code == 303
    assert "/administratie/1/factuur/1" in antwoord.headers["location"]

    conn = maak_verbinding(str(werkmap / "boekhouding.sqlite"))
    assert lees_facturen(conn, 1)[0]["goedgekeurd_op"] is None
    conn.close()


def kies_rekening_via_scherm(web, factuur_id=1, code="4100", administratie_id=1):
    """Kies de grootboekrekening zoals het reviewscherm dat doet.

    Het formulier stuurt alleen de velden die erin staan; hier is dat
    alleen de rekening, zodat de factuurvelden onaangeroerd blijven.
    """
    return web.post(
        f"/administratie/{administratie_id}/factuur/{factuur_id}/opslaan",
        data={"rekening": code},
        follow_redirects=False,
    )


def test_goedkeuren_lukt_als_alles_klopt(web, werkmap):
    upload(web, UBLMAP / "01-standaard-21procent.xml", "goed.xml")
    kies_rekening_via_scherm(web)

    antwoord = web.post("/administratie/1/factuur/1/goedkeuren", follow_redirects=False)
    assert antwoord.status_code == 303
    assert antwoord.headers["location"] == "/administratie/1"

    conn = maak_verbinding(str(werkmap / "boekhouding.sqlite"))
    factuur = lees_facturen(conn, 1)[0]
    trail = lees_audit_trail(conn, 1)
    conn.close()

    assert factuur["goedgekeurd_op"] is not None
    assert factuur["goedgekeurd_door"] == "eigenaar"
    assert any(r["veld"] == "goedgekeurd_op" for r in trail)
    assert "Goedgekeurd" in web.get("/administratie/1").text


def test_twee_keer_goedkeuren_gebeurt_niet(web):
    from urllib.parse import unquote

    upload(web, UBLMAP / "01-standaard-21procent.xml", "goed.xml")
    kies_rekening_via_scherm(web)
    web.post("/administratie/1/factuur/1/goedkeuren", follow_redirects=False)
    antwoord = web.post("/administratie/1/factuur/1/goedkeuren", follow_redirects=False)
    assert "al goedgekeurd" in unquote(antwoord.headers["location"])


def test_zonder_api_sleutel_valt_de_upload_niet_om(werkmap, monkeypatch):
    """Draait de app zonder sleutel, dan hoort dat een reden te zijn."""
    monkeypatch.delenv("ANTHROPIC_API_KEY", raising=False)
    app = maak_app(
        str(werkmap / "db.sqlite"), str(werkmap / "opslag"),
        ai_client=None, vandaag=VANDAAG,
    )
    web = TestClient(app)
    antwoord = upload(web, maak_pdf("Factuur 2026-0412"), "factuur.pdf")

    assert antwoord.status_code == 303  # er is wél een factuur aangemaakt
    pagina = web.get("/administratie/1/factuur/1").text
    assert "ANTHROPIC_API_KEY" in pagina
    assert "Dit moet nog nagekeken worden" in pagina


# --- geen toegang tot een andere administratie (IDOR) -------------------

@pytest.fixture
def twee_administraties(werkmap):
    """Administratie 1 en 2, elk met één eigen factuur.

    De factuur van A krijgt nummer 1, die van B nummer 2 — precies de
    situatie waarin iemand het nummer in de adresbalk kan ophogen.
    """
    from boekhouding import maak_administratie, maak_tabellen, maak_verbinding

    db = werkmap / "boekhouding.sqlite"
    app = maak_app(
        str(db), str(werkmap / "opslag"),
        ai_client=client_met(goede_extractie()), vandaag=VANDAAG,
    )
    web = TestClient(app)

    conn = maak_verbinding(str(db))
    maak_tabellen(conn)
    if conn.execute("SELECT count(*) FROM administraties").fetchone()[0] < 2:
        maak_administratie(conn, "Zaak B")
    conn.close()

    # Factuur 1 hoort bij administratie 1.
    web.post(
        "/administratie/1/upload",
        files={"bestand": ("a.xml",
               (UBLMAP / "01-standaard-21procent.xml").read_bytes(), "application/xml")},
        follow_redirects=False,
    )
    # Factuur 2 hoort bij administratie 2.
    web.post(
        "/administratie/2/upload",
        files={"bestand": ("b.xml",
               (UBLMAP / "02-diensten-9procent.xml").read_bytes(), "application/xml")},
        follow_redirects=False,
    )
    return web


def test_opzet_klopt(twee_administraties, werkmap):
    """Controleer eerst dat factuur 1 bij A hoort en factuur 2 bij B."""
    from boekhouding import lees_factuur, maak_verbinding

    conn = maak_verbinding(str(werkmap / "boekhouding.sqlite"))
    assert lees_factuur(conn, 1)["administratie_id"] == 1
    assert lees_factuur(conn, 2)["administratie_id"] == 2
    conn.close()


def test_factuur_van_een_ander_bekijken_geeft_404(twee_administraties):
    web = twee_administraties
    assert web.get("/administratie/1/factuur/1").status_code == 200   # eigen
    assert web.get("/administratie/2/factuur/1").status_code == 404   # van A


def test_factuur_van_een_ander_opslaan_geeft_404(twee_administraties, werkmap):
    from boekhouding import lees_factuur, maak_verbinding

    web = twee_administraties
    antwoord = web.post(
        "/administratie/2/factuur/1/opslaan",
        data={"leverancier": "GEKAAPT"},
        follow_redirects=False,
    )
    assert antwoord.status_code == 404

    conn = maak_verbinding(str(werkmap / "boekhouding.sqlite"))
    assert lees_factuur(conn, 1)["leverancier"] == "Van Dijk ICT-diensten"
    conn.close()


def test_factuur_van_een_ander_goedkeuren_geeft_404(twee_administraties, werkmap):
    from boekhouding import lees_factuur, maak_verbinding

    web = twee_administraties
    antwoord = web.post(
        "/administratie/2/factuur/1/goedkeuren", follow_redirects=False
    )
    assert antwoord.status_code == 404

    conn = maak_verbinding(str(werkmap / "boekhouding.sqlite"))
    assert lees_factuur(conn, 1)["goedgekeurd_op"] is None
    conn.close()


def test_document_van_een_ander_ophalen_geeft_404(twee_administraties):
    web = twee_administraties
    assert web.get("/administratie/1/document/1").status_code == 200  # eigen
    assert web.get("/administratie/2/document/1").status_code == 404  # van A


def test_het_antwoord_verraadt_niet_dat_het_record_bestaat(twee_administraties):
    """Bestaand-maar-van-een-ander en niet-bestaand geven hetzelfde."""
    web = twee_administraties
    bestaat_wel = web.get("/administratie/2/factuur/1")     # bestaat, van A
    bestaat_niet = web.get("/administratie/2/factuur/9999")  # bestaat niet

    assert bestaat_wel.status_code == bestaat_niet.status_code == 404
    assert bestaat_wel.text == bestaat_niet.text
    # Geen 403: die zou juist verklappen dat het record er is.
    assert bestaat_wel.status_code != 403


def test_de_oude_paden_zonder_administratie_bestaan_niet_meer(twee_administraties):
    """De routes hangen nu allemaal onder de administratie."""
    web = twee_administraties
    for pad in ("/factuur/1", "/document/1"):
        assert web.get(pad).status_code == 404


def test_elke_route_met_een_id_loopt_langs_de_controle():
    """Vangnet: een nieuwe route mag de controle niet vergeten.

    Elke route waarin zowel een administratie_id als een ander id staat,
    hoort hoort_bij_administratie te gebruiken. Deze test leest de code
    en valt om zodra iemand een route toevoegt zonder die controle.
    """
    import inspect
    import re

    from boekhouding.web import app as webmodule

    bron = inspect.getsource(webmodule.maak_app)
    # Knip de bron in stukken per route-decorator.
    stukken = re.split(r"\n    @app\.(?:get|post)\(", bron)[1:]
    for stuk in stukken:
        pad = stuk.split(")")[0]
        heeft_ander_id = re.search(r"\{(?!administratie_id)\w+_id\}", pad)
        if heeft_ander_id:
            assert "hoort_bij_administratie" in stuk, (
                f"route {pad} gebruikt geen hoort_bij_administratie"
            )


def test_redenen_staan_er_niet_dubbel_in(web):
    """De validatie draait twee keer; de redenen horen er één keer te staan."""
    upload(web, UBLMAP / "04-twee-btw-tarieven.xml", "twee-tarieven.xml")
    pagina = web.get("/administratie/1/factuur/1").text
    assert pagina.count("btw_percentage: Field required") == 1
    assert pagina.count("btw-tarieven") == 1


def test_ook_bij_de_ai_route_geen_dubbele_redenen(werkmap):
    onzeker = goede_extractie(
        factuurnummer=veld(None, "laag", "nummer niet leesbaar")
    )
    app = maak_app(
        str(werkmap / "db.sqlite"), str(werkmap / "opslag"),
        ai_client=client_met(onzeker), vandaag=VANDAAG,
    )
    web = TestClient(app)
    upload(web, maak_pdf("Factuur 2026-0412"), "factuur.pdf")

    pagina = web.get("/administratie/1/factuur/1").text
    assert pagina.count("factuurnummer niet op het document gevonden") == 1
    assert pagina.count("factuurnummer: Field required") == 1


# --- de e-factuur leesbaar in het reviewscherm --------------------------

def test_een_efactuur_wordt_leesbaar_getoond(web):
    """Ruwe XML naast de velden leggen kan een mens niet; leesbaar wel."""
    upload(web, UBLMAP / "01-standaard-21procent.xml", "goed.xml")
    pagina = web.get("/administratie/1/factuur/1").text

    leesbaar = pagina.split('class="bron-lees"')[1].split("<details")[0]
    assert "Factuurdatum" in leesbaar
    assert "cbc:IssueDate" in leesbaar          # de UBL-herkomst staat erbij
    assert "2026-07-14" in leesbaar
    assert "Van Dijk ICT-diensten" in leesbaar
    assert "Onderhoud werkplekken juli 2026" in leesbaar   # de factuurregel


def test_de_ruwe_xml_zit_achter_een_knop(web):
    upload(web, UBLMAP / "01-standaard-21procent.xml", "goed.xml")
    pagina = web.get("/administratie/1/factuur/1").text

    assert "<details" in pagina and "Toon XML" in pagina
    achter_de_knop = pagina.split("<details")[1]
    assert "cbc:IssueDate&gt;2026-07-14" in achter_de_knop


def test_een_ontbrekend_veld_wordt_benoemd_en_niet_ingevuld(web):
    upload(web, UBLMAP / "05-zonder-factuurdatum.xml", "zonder-datum.xml")
    leesbaar = web.get("/administratie/1/factuur/1").text.split("<details")[0]

    assert "niet in het bestand" in leesbaar
    assert "cbc:IssueDate" in leesbaar


def test_beide_btw_tarieven_staan_in_beeld(web):
    upload(web, UBLMAP / "04-twee-btw-tarieven.xml", "twee.xml")
    leesbaar = web.get("/administratie/1/factuur/1").text.split("<details")[0]

    assert "Btw-percentage 1" in leesbaar and "21.00%" in leesbaar
    assert "Btw-percentage 2" in leesbaar and "9.00%" in leesbaar


def test_een_pdf_houdt_gewoon_het_documentvenster(web):
    """Een PDF laat de browser zelf zien; daar is niets aan te verbeteren."""
    upload(web, maak_pdf("Factuur 2026-0412"), "factuur.pdf")
    pagina = web.get("/administratie/1/factuur/1").text

    assert '<object class="bron"' in pagina
    assert 'class="bron-lees"' not in pagina


def test_het_bewaarde_bestand_verandert_niet_door_het_tonen(web, werkmap):
    """De weergave is weergave; het origineel blijft byte voor byte staan."""
    origineel = (UBLMAP / "01-standaard-21procent.xml").read_bytes()
    upload(web, origineel, "goed.xml")
    web.get("/administratie/1/factuur/1")

    bewaard = list((werkmap / "opslag").rglob("*.xml"))
    assert len(bewaard) == 1
    assert bewaard[0].read_bytes() == origineel


def test_de_weergave_lekt_niets_van_een_andere_administratie(twee_administraties):
    """Het leesvenster leest het bewaarde bestand; dat mag geen nieuwe ingang zijn."""
    antwoord = twee_administraties.get("/administratie/2/factuur/1")
    assert antwoord.status_code == 404
    # Factuur 1 is een e-factuur van Van Dijk en hoort bij administratie 1;
    # er mag geen letter van dat bestand in dit antwoord staan.
    assert "Van Dijk" not in antwoord.text
    assert "cbc:" not in antwoord.text


# --- grootboek en btw-aangifte (module 6) -------------------------------

def test_het_reviewscherm_laat_de_rekeningen_kiezen(web):
    upload(web, UBLMAP / "01-standaard-21procent.xml", "goed.xml")
    pagina = web.get("/administratie/1/factuur/1").text

    assert 'name="rekening"' in pagina
    assert "— nog niet gekozen —" in pagina
    assert "4100" in pagina and "Kantoorkosten" in pagina
    # Crediteuren vult de boeking zelf in; die staat niet in de keuzelijst.
    assert "Crediteuren" not in pagina


def test_een_gekozen_rekening_blijft_staan(web):
    upload(web, UBLMAP / "01-standaard-21procent.xml", "goed.xml")
    kies_rekening_via_scherm(web, code="4110")

    pagina = web.get("/administratie/1/factuur/1").text
    assert 'value="4110"\n                      selected' in pagina.replace("\r", "") \
        or 'selected' in pagina.split('value="4110"')[1][:60]


def test_een_rekening_die_niet_bestaat_wordt_geweigerd(web):
    from urllib.parse import unquote

    upload(web, UBLMAP / "01-standaard-21procent.xml", "goed.xml")
    antwoord = kies_rekening_via_scherm(web, code="9999")

    assert "staat niet in het schema" in unquote(antwoord.headers["location"])


def test_goedkeuren_maakt_meteen_de_boeking(web, werkmap):
    upload(web, UBLMAP / "01-standaard-21procent.xml", "goed.xml")
    kies_rekening_via_scherm(web, code="4100")
    web.post("/administratie/1/factuur/1/goedkeuren", follow_redirects=False)

    conn = maak_verbinding(str(werkmap / "boekhouding.sqlite"))
    boeking = boeking_bij_factuur(conn, 1)
    conn.close()

    assert boeking is not None
    assert [r["rekening"] for r in boeking["regels"]] == ["4100", "1520", "1600"]
    assert "Boeking 1" in web.get("/administratie/1/factuur/1").text


def test_goedkeuren_zonder_rekening_zegt_dat_er_niet_geboekt_is(web):
    from urllib.parse import unquote

    upload(web, UBLMAP / "01-standaard-21procent.xml", "goed.xml")
    antwoord = web.post("/administratie/1/factuur/1/goedkeuren", follow_redirects=False)

    melding = unquote(antwoord.headers["location"])
    assert "nog niet geboekt" in melding
    assert "geen grootboekrekening gekozen" in melding
    assert "niet in het grootboek" in web.get("/administratie/1/factuur/1").text


def test_het_btw_scherm_gaat_naar_het_huidige_kwartaal(web):
    antwoord = web.get("/administratie/1/btw", follow_redirects=False)
    assert antwoord.status_code == 303
    # VANDAAG in deze tests is 27 augustus 2026, dus kwartaal 3.
    assert antwoord.headers["location"] == "/administratie/1/btw/2026/3"


def test_het_btw_scherm_toont_de_rubrieken_en_het_saldo(web):
    upload(web, UBLMAP / "01-standaard-21procent.xml", "goed.xml")
    kies_rekening_via_scherm(web, code="4100")
    web.post("/administratie/1/factuur/1/goedkeuren", follow_redirects=False)

    # De e-factuur van 14 juli 2026 valt in kwartaal 3.
    pagina = web.get("/administratie/1/btw/2026/3").text
    assert "1a" in pagina and "1b" in pagina
    assert "5a" in pagina and "5b" in pagina
    assert "84.00" in pagina          # de voorbelasting van deze factuur
    assert "-84.00" in pagina         # het saldo: terug te vragen
    assert "Terug te vragen" in pagina
    assert "Niets te betalen" not in pagina


def test_het_btw_scherm_zegt_dat_de_eigenaar_zelf_indient(web):
    pagina = web.get("/administratie/1/btw/2026/3").text
    assert "voorstel, geen aangifte" in pagina
    assert "indienen doet u zelf bij de belastingdienst" in pagina.lower()


def test_het_btw_scherm_toont_wat_de_aangifte_blokkeert(web):
    upload(web, UBLMAP / "01-standaard-21procent.xml", "goed.xml")   # niet goedgekeurd
    pagina = web.get("/administratie/1/btw/2026/3").text

    assert "Er is niets uitgerekend" in pagina
    assert "nog niet goedgekeurd" in pagina
    assert "Van Dijk ICT-diensten" in pagina
    assert "/administratie/1/factuur/1" in pagina   # klikbaar naar de factuur


def test_een_kwartaal_dat_niet_bestaat_geeft_404(web):
    assert web.get("/administratie/1/btw/2026/5").status_code == 404
    assert web.get("/administratie/1/btw/1500/1").status_code == 404


def test_het_btw_scherm_van_een_andere_administratie(twee_administraties):
    """Ook hier: een administratie die niet bestaat is 404, geen lege pagina."""
    assert twee_administraties.get("/administratie/9/btw/2026/3").status_code == 404


def test_na_het_boeken_ligt_de_rekening_vast_op_het_scherm(web):
    upload(web, UBLMAP / "01-standaard-21procent.xml", "goed.xml")
    kies_rekening_via_scherm(web, code="4100")
    web.post("/administratie/1/factuur/1/goedkeuren", follow_redirects=False)

    pagina = web.get("/administratie/1/factuur/1").text
    assert "<select" not in pagina
    assert "de rekening ligt vast" in pagina
    assert "tegenboeking" in pagina


# --- volledigheidssignalen op het btw-scherm ----------------------------

def maandelijkse_facturen(werkmap, leverancier, maanden, jaar=2026):
    """Zet rechtstreeks facturen in de database, zonder upload.

    Voor deze tests doet het document er niet toe; het gaat om het
    patroon over de maanden heen.
    """
    from boekhouding import maak_tabellen, sla_factuur_op

    conn = maak_verbinding(str(werkmap / "boekhouding.sqlite"))
    maak_tabellen(conn)
    for maand in maanden:
        sla_factuur_op(
            conn, 1,
            {"leverancier": leverancier, "factuurdatum": f"{jaar}-{maand:02d}-05",
             "factuurnummer": f"{leverancier}-{maand:02d}",
             "bedrag_excl": "100.00", "btw_percentage": "21",
             "btw_bedrag": "21.00", "bedrag_incl": "121.00"},
            vandaag=VANDAAG,
        )
    conn.close()


def test_het_btw_scherm_stelt_de_vraag_over_een_ontbrekende_leverancier(web, werkmap):
    maandelijkse_facturen(werkmap, "KPN", [3, 4, 5, 6])

    pagina = web.get("/administratie/1/btw/2026/3").text
    assert "Even nakijken" in pagina
    assert "KPN staat sinds maart 2026 elke maand op de lijst" in pagina
    assert "is die factuur er wel?" in pagina
    assert "vragen, geen fouten" in pagina


def test_signalen_houden_de_aangifte_niet_tegen(web, werkmap):
    maandelijkse_facturen(werkmap, "KPN", [3, 4, 5, 6])

    pagina = web.get("/administratie/1/btw/2026/3").text
    assert "Even nakijken" in pagina
    assert "Er is niets uitgerekend" not in pagina
    assert "5a · Verschuldigde omzetbelasting" in pagina


def test_zonder_signalen_staat_er_geen_lege_kop(web):
    """Een systeem dat elk kwartaal iets roept wordt weggeklikt."""
    pagina = web.get("/administratie/1/btw/2026/3").text
    assert "Even nakijken" not in pagina


# --- bankafschriften en afletteren (module 7) ---------------------------

BANKMAP = Path(__file__).parent / "testfacturen" / "bank"


def lees_afschrift_in(web, naam="01-mt940-ing.sta", administratie_id=1):
    return web.post(
        f"/administratie/{administratie_id}/bank",
        files={"bestand": (naam, (BANKMAP / naam).read_bytes(), "text/plain")},
        follow_redirects=False,
    )


def geboekte_factuur_via_scherm(web, rekening="4120"):
    """Upload de e-factuur van Van Dijk (484,00) en boek hem."""
    upload(web, UBLMAP / "01-standaard-21procent.xml", "goed.xml")
    kies_rekening_via_scherm(web, code=rekening)
    web.post("/administratie/1/factuur/1/goedkeuren", follow_redirects=False)


def test_het_bankscherm_is_leeg_tot_je_een_afschrift_inleest(web):
    pagina = web.get("/administratie/1/bank").text
    assert "Nog geen banktransacties" in pagina
    assert 'name="bestand"' in pagina


def test_een_afschrift_inlezen_zet_de_transacties_op_het_scherm(web):
    from urllib.parse import unquote

    antwoord = lees_afschrift_in(web)
    assert antwoord.status_code == 303
    assert "4 nieuwe transacties" in unquote(antwoord.headers["location"])

    pagina = web.get("/administratie/1/bank").text
    assert "Van Dijk ICT-diensten" in pagina
    assert "-484.00" in pagina
    assert "4" in pagina  # de teller met openstaande transacties


def test_hetzelfde_afschrift_twee_keer_zegt_dat_er_niets_bij_komt(web):
    from urllib.parse import unquote

    lees_afschrift_in(web)
    antwoord = lees_afschrift_in(web)

    melding = unquote(antwoord.headers["location"])
    assert "0 nieuwe transacties" in melding
    assert "4 stonden er al" in melding


def test_een_bestand_dat_geen_afschrift_is_wordt_uitgelegd(web):
    antwoord = web.post(
        "/administratie/1/bank",
        files={"bestand": ("brief.txt", b"Beste Alaa,\n\ngroeten", "text/plain")},
        follow_redirects=False,
    )
    assert antwoord.status_code == 200
    assert "niet ingelezen" in antwoord.text
    assert "geen MT940 en geen CAMT.053" in antwoord.text


def test_het_scherm_toont_het_voorstel_met_de_zekerheid(web):
    geboekte_factuur_via_scherm(web)
    lees_afschrift_in(web)

    pagina = web.get("/administratie/1/bank").text
    assert "Voorstel:" in pagina
    assert "hoge zekerheid" in pagina
    assert "Bevestigen en boeken" in pagina


def test_bevestigen_koppelt_en_boekt(web, werkmap):
    from urllib.parse import unquote

    geboekte_factuur_via_scherm(web)
    lees_afschrift_in(web)

    conn = maak_verbinding(str(werkmap / "boekhouding.sqlite"))
    betaling = [
        t for t in lees_banktransacties(conn, 1) if t["bedrag"] == "-484.00"
    ][0]
    conn.close()

    antwoord = web.post(
        f"/administratie/1/bank/{betaling['id']}/koppel",
        data={"factuur_id": "1"}, follow_redirects=False,
    )
    assert "Gekoppeld en geboekt" in unquote(antwoord.headers["location"])

    pagina = web.get("/administratie/1/bank").text
    assert "Gekoppeld aan factuur 1" in pagina


def test_koppelen_zonder_factuur_te_kiezen_zegt_dat(web, werkmap):
    from urllib.parse import unquote

    lees_afschrift_in(web)
    conn = maak_verbinding(str(werkmap / "boekhouding.sqlite"))
    eerste = lees_banktransacties(conn, 1)[0]
    conn.close()

    antwoord = web.post(
        f"/administratie/1/bank/{eerste['id']}/koppel",
        data={"factuur_id": ""}, follow_redirects=False,
    )
    assert "Kies eerst een factuur" in unquote(antwoord.headers["location"])


def test_een_transactie_van_een_ander_koppelen_geeft_404(twee_administraties, werkmap):
    web = twee_administraties
    lees_afschrift_in(web, administratie_id=1)

    conn = maak_verbinding(str(werkmap / "boekhouding.sqlite"))
    eerste = lees_banktransacties(conn, 1)[0]
    conn.close()

    antwoord = web.post(
        f"/administratie/2/bank/{eerste['id']}/koppel",
        data={"factuur_id": "1"}, follow_redirects=False,
    )
    assert antwoord.status_code == 404


def test_een_factuur_van_een_ander_koppelen_geeft_ook_404(twee_administraties, werkmap):
    """Een nummer in een verborgen veld is net zo goed te veranderen."""
    web = twee_administraties
    lees_afschrift_in(web, administratie_id=2)

    conn = maak_verbinding(str(werkmap / "boekhouding.sqlite"))
    van_b = lees_banktransacties(conn, 2)[0]
    conn.close()

    # Factuur 1 hoort bij administratie 1, de transactie bij administratie 2.
    antwoord = web.post(
        f"/administratie/2/bank/{van_b['id']}/koppel",
        data={"factuur_id": "1"}, follow_redirects=False,
    )
    assert antwoord.status_code == 404


def test_de_keuzelijst_toont_alleen_facturen_die_kunnen_kloppen(web, werkmap):
    """Geld eraf hoort bij een inkoopfactuur; een verkoopfactuur hoort er niet in."""
    upload(web, UBLMAP / "01-standaard-21procent.xml", "inkoop.xml")
    kies_rekening_via_scherm(web, factuur_id=1, code="4120")     # kosten
    web.post("/administratie/1/factuur/1/goedkeuren", follow_redirects=False)
    upload(web, UBLMAP / "02-diensten-9procent.xml", "verkoop.xml")
    kies_rekening_via_scherm(web, factuur_id=2, code="8000")     # omzet
    web.post("/administratie/1/factuur/2/goedkeuren", follow_redirects=False)

    lees_afschrift_in(web)

    conn = maak_verbinding(str(werkmap / "boekhouding.sqlite"))
    betaling = [
        t for t in lees_banktransacties(conn, 1) if t["bedrag"] == "-484.00"
    ][0]
    conn.close()

    # Pak precies het formulier van deze ene transactie.
    pagina = web.get("/administratie/1/bank").text
    formulier = pagina.split(
        f"/administratie/1/bank/{betaling['id']}/koppel"
    )[-1].split("</form>")[0]

    assert 'value="factuur:1"' in formulier      # de inkoopfactuur mag
    assert 'value="factuur:2"' not in formulier  # de verkoopfactuur niet


# --- verkoopfacturen (module 8) -----------------------------------------

def zet_eigen_gegevens(web, administratie_id=1):
    return web.post(
        f"/administratie/{administratie_id}/instellingen",
        data={
            "naam": "Alkhadraa Advies", "adres": "Zonnebloemstraat 14",
            "postcode": "3011 AB", "plaats": "Rotterdam",
            "btw_id": "NL002233445B01", "kvk_nummer": "87654321",
            "iban": "NL44RABO0123456789", "email": "post@alkhadraa.test",
            "land": "Nederland",
        },
        follow_redirects=False,
    )


def voeg_klant_toe(web, naam="Van Dijk ICT-diensten", administratie_id=1):
    return web.post(
        f"/administratie/{administratie_id}/klanten",
        data={
            "naam": naam, "adres": "Keizersgracht 218", "postcode": "1016 DZ",
            "plaats": "Amsterdam", "land": "Nederland", "kvk_nummer": "",
            "btw_id": "", "email": "", "betalingstermijn": "30",
        },
        follow_redirects=False,
    )


def nieuw_concept(web, klant_id=1, datum="2026-07-14", administratie_id=1):
    return web.post(
        f"/administratie/{administratie_id}/verkoop",
        data={"klant_id": str(klant_id), "factuurdatum": datum},
        follow_redirects=False,
    )


def vul_regels(web, factuur_id=1, administratie_id=1):
    return web.post(
        f"/administratie/{administratie_id}/verkoop/{factuur_id}/opslaan",
        data={
            "factuurdatum": "2026-07-14",
            "betalingstermijn": "30",
            # Het formulier stuurt per veld een lijstje; de lege regel
            # onderaan hoort te worden overgeslagen.
            "omschrijving": ["Advies juli 2026", ""],
            "aantal": ["7.5", ""],
            "prijs_per_stuk": ["95.00", ""],
            "btw_percentage": ["21", ""],
        },
        follow_redirects=False,
    )


def test_de_eigen_gegevens_zijn_in_te_vullen(web):
    zet_eigen_gegevens(web)
    pagina = web.get("/administratie/1/instellingen").text

    assert "NL002233445B01" in pagina
    assert "Zonnebloemstraat 14" in pagina


def test_een_klant_toevoegen_en_terugzien(web):
    voeg_klant_toe(web)
    pagina = web.get("/administratie/1/klanten").text

    assert "Van Dijk ICT-diensten" in pagina
    assert "Keizersgracht 218" in pagina


def test_een_klant_zonder_naam_wordt_geweigerd(web):
    from urllib.parse import unquote

    antwoord = web.post(
        "/administratie/1/klanten", data={"naam": "  "}, follow_redirects=False
    )
    assert "zonder naam kan niet" in unquote(antwoord.headers["location"])


def test_zonder_klant_kan_er_geen_factuur_gemaakt_worden(web):
    pagina = web.get("/administratie/1/verkoop").text
    assert "Voeg eerst een klant toe" in pagina


def test_een_concept_maken_en_regels_invullen(web):
    voeg_klant_toe(web)
    antwoord = nieuw_concept(web)
    assert antwoord.headers["location"] == "/administratie/1/verkoop/1"

    vul_regels(web)
    pagina = web.get("/administratie/1/verkoop/1").text
    assert "Advies juli 2026" in pagina
    assert "712.50" in pagina        # het uitgerekende regelbedrag
    assert "862.13" in pagina        # totaal inclusief btw


def test_lege_regels_worden_niet_opgeslagen(web, werkmap):
    voeg_klant_toe(web)
    nieuw_concept(web)
    vul_regels(web)

    conn = maak_verbinding(str(werkmap / "boekhouding.sqlite"))
    factuur = lees_verkoopfactuur(conn, 1)
    conn.close()
    assert len(factuur["regels"]) == 1


def test_definitief_maken_kan_niet_zonder_eigen_gegevens(web):
    voeg_klant_toe(web)
    nieuw_concept(web)
    vul_regels(web)

    pagina = web.get("/administratie/1/verkoop/1").text
    assert "Dit ontbreekt nog" in pagina
    assert "je btw-identificatienummer" in pagina
    assert "disabled" in pagina.split("Definitief maken")[0][-200:]


def test_definitief_maken_geeft_een_nummer_en_een_boeking(web, werkmap):
    from urllib.parse import unquote

    zet_eigen_gegevens(web)
    voeg_klant_toe(web)
    nieuw_concept(web)
    vul_regels(web)

    antwoord = web.post(
        "/administratie/1/verkoop/1/definitief", follow_redirects=False
    )
    assert "2026-0001 is definitief en geboekt" in unquote(
        antwoord.headers["location"]
    )

    conn = maak_verbinding(str(werkmap / "boekhouding.sqlite"))
    factuur = lees_verkoopfactuur(conn, 1)
    conn.close()
    assert factuur["boeking_id"] is not None
    assert factuur["document_id"] is not None


def test_de_pdf_is_op_te_halen(web, werkmap):
    zet_eigen_gegevens(web)
    voeg_klant_toe(web)
    nieuw_concept(web)
    vul_regels(web)
    web.post("/administratie/1/verkoop/1/definitief", follow_redirects=False)

    conn = maak_verbinding(str(werkmap / "boekhouding.sqlite"))
    document_id = lees_verkoopfactuur(conn, 1)["document_id"]
    conn.close()

    antwoord = web.get(f"/administratie/1/document/{document_id}")
    assert antwoord.status_code == 200
    assert antwoord.headers["content-type"] == "application/pdf"
    assert antwoord.content.startswith(b"%PDF-")


def test_een_definitieve_factuur_is_niet_meer_te_bewerken(web):
    zet_eigen_gegevens(web)
    voeg_klant_toe(web)
    nieuw_concept(web)
    vul_regels(web)
    web.post("/administratie/1/verkoop/1/definitief", follow_redirects=False)

    pagina = web.get("/administratie/1/verkoop/1").text
    assert 'name="omschrijving"' not in pagina
    assert "Concept weggooien" not in pagina
    assert "Creditfactuur maken" in pagina


def test_de_openstaande_post_staat_op_het_overzicht(web):
    zet_eigen_gegevens(web)
    voeg_klant_toe(web)
    nieuw_concept(web)
    vul_regels(web)
    web.post("/administratie/1/verkoop/1/definitief", follow_redirects=False)

    pagina = web.get("/administratie/1/verkoop").text
    assert "Openstaand: 862.13" in pagina
    assert "dagen over de vervaldatum" in pagina


def test_een_factuur_van_een_ander_geeft_404(twee_administraties):
    web = twee_administraties
    web.post(
        "/administratie/1/klanten", data={"naam": "Klant van A"},
        follow_redirects=False,
    )
    web.post(
        "/administratie/1/verkoop", data={"klant_id": "1",
                                          "factuurdatum": "2026-07-14"},
        follow_redirects=False,
    )
    assert web.get("/administratie/2/verkoop/1").status_code == 404
    assert web.post(
        "/administratie/2/verkoop/1/definitief", follow_redirects=False
    ).status_code == 404
    assert web.post(
        "/administratie/2/klant/1", data={"plaats": "Utrecht"},
        follow_redirects=False,
    ).status_code == 404
