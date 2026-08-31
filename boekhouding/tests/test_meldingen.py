"""Tests voor de meldingen na een handeling ("Opgeslagen", "Klant toegevoegd").

Die meldingen stonden vroeger als tekst in het adres
(`?melding=Opgeslagen`). Dat is op twee manieren fout: zulke tekst belandt
in serverlogs en in de geschiedenis van de browser, en tekst uit een adres
die op de pagina komt is de klassieke manier om er javascript van iemand
anders in te krijgen. Ze horen nu bij de sessie; in het adres staat niets.
"""

import re
from pathlib import Path

import pytest

from boekhouding import (
    lees_sessie,
    maak_verbinding,
    zet_melding,
)
from boekhouding.web import maak_app
from conftest import maak_ingelogde_client, VANDAAG

WEBMAP = Path(__file__).parent.parent / "boekhouding" / "web"
BANKMAP = Path(__file__).parent / "testfacturen" / "bank"
UBLMAP = Path(__file__).parent / "testfacturen" / "ubl"

# Waar een adres na een handeling aan moet voldoen: een pad, en hoogstens
# een vaste code als vraagteken-stuk. Geen spaties, geen %20, geen zinnen.
SCHOON_ADRES = re.compile(r"^/[A-Za-z0-9/_.-]*(\?fout=[a-z_]+)?$")


@pytest.fixture
def web(tmp_path):
    db = tmp_path / "boekhouding.sqlite"
    app = maak_app(str(db), str(tmp_path / "opslag"), ai_client=None,
                   vandaag=VANDAAG)
    client = maak_ingelogde_client(app, db, "eigenaar@test.nl", rol="eigenaar")
    client.db = db
    return client


def upload_ubl(web, naam="01-standaard-21procent.xml"):
    return web.post(
        "/administratie/1/upload",
        files={"bestand": (naam, (UBLMAP / naam).read_bytes(), "application/xml")},
        follow_redirects=False,
    )


def alle_handelingen(web):
    """Doe zo ongeveer alles wat een melding oplevert; geef de adressen."""
    upload_ubl(web)
    web.post("/administratie/1/klanten", data={"naam": "  "},
             follow_redirects=False)
    web.post("/administratie/1/klanten", data={"naam": "Van Dijk"},
             follow_redirects=False)

    antwoorden = [
        # opslaan met een rekening die niet bestaat, en met een goede
        web.post("/administratie/1/factuur/1/opslaan",
                 data={"rekening": "9999"}, follow_redirects=False),
        web.post("/administratie/1/factuur/1/opslaan",
                 data={"rekening": "4100"}, follow_redirects=False),
        web.post("/administratie/1/factuur/1/goedkeuren", follow_redirects=False),
        web.post("/administratie/1/factuur/1/goedkeuren", follow_redirects=False),
        web.post("/administratie/1/instellingen",
                 data={"naam": "Alkhadraa Advies"}, follow_redirects=False),
        web.post("/administratie/1/klanten", data={"naam": "  "},
                 follow_redirects=False),
        web.post("/administratie/1/klant/1", data={"naam": "Van Dijk BV"},
                 follow_redirects=False),
        web.post("/administratie/1/verkoop", data={"klant_id": ""},
                 follow_redirects=False),
        web.post("/administratie/1/verkoop",
                 data={"klant_id": "1", "factuurdatum": "2026-07-14"},
                 follow_redirects=False),
        web.post("/administratie/1/verkoop/1/opslaan",
                 data={"factuurdatum": "2026-07-14", "betalingstermijn": "30",
                       "omschrijving": ["Advies", ""], "aantal": ["1", ""],
                       "prijs_per_stuk": ["95.00", ""],
                       "btw_percentage": ["21", ""]},
                 follow_redirects=False),
        web.post("/administratie/1/verkoop/1/definitief", follow_redirects=False),
        web.post("/administratie/1/verkoop/1/verwijderen", follow_redirects=False),
        web.post("/administratie/1/verkoop/1/crediteren", follow_redirects=False),
        web.post("/administratie/1/bank",
                 files={"bestand": ("01-mt940-ing.sta",
                                    (BANKMAP / "01-mt940-ing.sta").read_bytes(),
                                    "text/plain")},
                 follow_redirects=False),
        web.post("/administratie/1/bank/1/koppel", data={"factuur_id": ""},
                 follow_redirects=False),
        web.post("/administratie/1/bank/1/koppel", data={"factuur_id": "factuur:1"},
                 follow_redirects=False),
        web.post("/uitloggen", follow_redirects=False),
    ]
    return [a.headers["location"] for a in antwoorden if a.status_code == 303]


def test_geen_enkele_route_zet_vrije_tekst_in_het_adres(web):
    adressen = alle_handelingen(web)
    assert len(adressen) >= 15, "er zijn te weinig handelingen gedaan"
    for adres in adressen:
        assert SCHOON_ADRES.match(adres), adres
        assert "%" not in adres  # niets gecodeerd, dus ook geen tekst


def test_in_de_broncode_staat_nergens_meer_een_melding_in_een_adres():
    """Een vangnet voor de volgende route die iemand erbij schrijft."""
    for pad in sorted(WEBMAP.rglob("*.py")) + sorted(WEBMAP.rglob("*.html")):
        bron = pad.read_text(encoding="utf-8")
        assert "?melding=" not in bron, pad
        assert "&melding=" not in bron, pad


def test_de_melding_staat_op_het_volgende_scherm(web):
    upload_ubl(web)
    antwoord = web.post("/administratie/1/factuur/1/opslaan",
                        data={"rekening": "4100"}, follow_redirects=False)

    assert antwoord.headers["location"] == "/administratie/1/factuur/1"
    assert "Opgeslagen" in web.get("/administratie/1/factuur/1").text


def test_de_melding_verdwijnt_als_je_ververst(web):
    upload_ubl(web)
    web.post("/administratie/1/factuur/1/opslaan", data={"rekening": "4100"},
             follow_redirects=False)

    assert "Opgeslagen" in web.get("/administratie/1/factuur/1").text
    assert "Opgeslagen" not in web.get("/administratie/1/factuur/1").text


def test_html_in_een_melding_komt_nooit_als_html_op_de_pagina(web):
    """De reden bevat hier letterlijk wat de gebruiker instuurde."""
    upload_ubl(web)
    kwaad = "<script>alert(1)</script>"
    web.post("/administratie/1/factuur/1/opslaan", data={"rekening": kwaad},
             follow_redirects=False)

    pagina = web.get("/administratie/1/factuur/1").text
    assert "staat niet in het schema" in pagina   # de melding staat er wel
    assert kwaad not in pagina                    # maar niet als html
    assert "&lt;script&gt;" in pagina             # als tekst, ontsnapt


def test_ook_een_melding_die_rechtstreeks_gezet_wordt_blijft_tekst(web):
    """Niet alleen deze ene route: alles wat in de sessie belandt."""
    conn = maak_verbinding(str(web.db))
    zet_melding(conn, web.cookies.get("sessie"),
                "<img src=x onerror=alert(1)> gelukt")
    conn.close()

    pagina = web.get("/administratie/1").text
    assert "<img src=x" not in pagina
    assert "&lt;img src=x" in pagina


def test_elk_scherm_kan_een_melding_tonen(web):
    """Hij staat in het basissjabloon, dus geen scherm kan hem vergeten."""
    upload_ubl(web)
    for pad in ("/administratie/1", "/administratie/1/upload",
                "/administratie/1/factuur/1", "/administratie/1/verkoop",
                "/administratie/1/klanten", "/administratie/1/bank",
                "/administratie/1/instellingen", "/administratie/1/btw/2026/3"):
        conn = maak_verbinding(str(web.db))
        zet_melding(conn, web.cookies.get("sessie"), "Even opletten", "fout")
        conn.close()
        assert "Even opletten" in web.get(pad).text, pad


def test_een_fout_is_rood_en_een_bevestiging_groen(web):
    upload_ubl(web)

    web.post("/administratie/1/factuur/1/opslaan", data={"rekening": "9999"},
             follow_redirects=False)
    fout = web.get("/administratie/1/factuur/1").text
    assert 'class="waarschuwing">rekening' in fout

    web.post("/administratie/1/factuur/1/opslaan", data={"rekening": "4100"},
             follow_redirects=False)
    goed = web.get("/administratie/1/factuur/1").text
    assert 'class="melding">Opgeslagen' in goed


def test_de_melding_van_de_een_komt_niet_bij_de_ander(web, tmp_path):
    """De melding hangt aan de sessie, niet aan het scherm."""
    app = web.app
    klant = maak_ingelogde_client(
        app, web.db, "klant@test.nl", rol="klant", administraties=[1],
    )
    upload_ubl(web)
    web.post("/administratie/1/factuur/1/opslaan", data={"rekening": "4100"},
             follow_redirects=False)

    assert "Opgeslagen" not in klant.get("/administratie/1").text
    assert "Opgeslagen" in web.get("/administratie/1/factuur/1").text


def test_een_onbekende_soort_melding_wordt_geweigerd(web):
    conn = maak_verbinding(str(web.db))
    try:
        with pytest.raises(ValueError, match="onbekende soort"):
            zet_melding(conn, web.cookies.get("sessie"), "Hallo", "knipperend")
    finally:
        conn.close()


def test_zonder_sessie_wordt_er_niets_bewaard(web):
    """Een melding zonder sessie verdwijnt gewoon; geen crash."""
    conn = maak_verbinding(str(web.db))
    try:
        zet_melding(conn, None, "Hallo")
        zet_melding(conn, "een token dat niet bestaat", "Hallo")
        assert lees_sessie(conn, "een token dat niet bestaat") is None
    finally:
        conn.close()
