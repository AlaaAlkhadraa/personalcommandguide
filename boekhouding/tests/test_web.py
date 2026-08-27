"""Tests voor de webinterface (module 5).

Er gaat hier nooit een echt verzoek naar de API: waar de AI-route wordt
geraakt, krijgt de app een nagemaakte client mee.
"""

from datetime import date
from pathlib import Path

import pytest
from fastapi.testclient import TestClient

from boekhouding import lees_audit_trail, lees_facturen, maak_verbinding
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


def test_goedkeuren_lukt_als_alles_klopt(web, werkmap):
    upload(web, UBLMAP / "01-standaard-21procent.xml", "goed.xml")

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
