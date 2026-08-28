"""Tests voor module 9: accounts, rollen en toegang.

Twee soorten tests staan hier door elkaar, en dat is met opzet: de
onderste laag (wachtwoorden, sessies, de rem op mislukte pogingen) en de
webinterface (wie waar wel en niet binnenkomt). Ze horen bij elkaar,
want een goed bewaakte functie helpt niet als de route eromheen hem niet
gebruikt.
"""

import time
from datetime import timedelta
from urllib.parse import unquote
from pathlib import Path

import pytest
from fastapi.testclient import TestClient

from boekhouding import (
    Gebruiker,
    controleer_wachtwoord,
    hash_wachtwoord,
    lees_audit_trail,
    lees_factuur,
    lees_gebruiker,
    lees_sessie,
    lees_toegang_log,
    lees_verkoopfacturen,
    maak_administratie,
    maak_gebruiker,
    maak_verbinding,
    probeer_inloggen,
    trek_sessie_in,
)
from boekhouding.gebruikers import (
    INLOG_MISLUKT,
    MAX_PER_ACCOUNT,
    MAX_PER_IP,
    TE_VAAK,
    nu,
)
from boekhouding.web import maak_app
from conftest import TESTWACHTWOORD, VANDAAG, maak_ingelogde_client

UBLMAP = Path(__file__).parent / "testfacturen" / "ubl"
GOEDE_UBL = UBLMAP / "01-standaard-21procent.xml"


# --- wachtwoorden -------------------------------------------------------

def test_het_wachtwoord_is_nergens_terug_te_lezen(conn, administratie_id):
    maak_gebruiker(conn, "eig@test.nl", "Eigenaar", "geheim-1234",
                   rol="eigenaar")

    opgeslagen = conn.execute(
        "SELECT wachtwoord_hash FROM gebruikers"
    ).fetchone()[0]
    assert "geheim-1234" not in opgeslagen
    assert opgeslagen.startswith("$2")  # bcrypt

    # Ook niet in de audit trail of het toegangslogboek.
    alles = str(conn.execute("SELECT * FROM audit_log").fetchall()) + str(
        lees_toegang_log(conn)
    )
    assert "geheim-1234" not in alles


def test_dezelfde_hash_hoort_bij_dezelfde_gebruiker_niet_bij_dezelfde_tekst():
    """Twee keer hetzelfde wachtwoord geeft twee verschillende hashes."""
    een = hash_wachtwoord("geheim-1234")
    twee = hash_wachtwoord("geheim-1234")
    assert een != twee
    assert controleer_wachtwoord("geheim-1234", een)
    assert controleer_wachtwoord("geheim-1234", twee)
    assert not controleer_wachtwoord("geheim-12345", een)


def test_een_kort_wachtwoord_wordt_geweigerd():
    with pytest.raises(ValueError, match="te makkelijk te raden"):
        hash_wachtwoord("kort")


def test_een_kapotte_of_ontbrekende_hash_geeft_gewoon_false():
    assert not controleer_wachtwoord("geheim-1234", None)
    assert not controleer_wachtwoord("geheim-1234", "geen echte hash")


# --- inloggen: dezelfde melding, hetzelfde werk --------------------------

def test_onbekend_adres_en_fout_wachtwoord_geven_dezelfde_melding(conn):
    maak_gebruiker(conn, "eig@test.nl", "Eigenaar", TESTWACHTWOORD,
                   rol="eigenaar")

    onbekend = probeer_inloggen(conn, "niemand@test.nl", TESTWACHTWOORD)
    fout = probeer_inloggen(conn, "eig@test.nl", "verkeerd-1234")

    assert onbekend == (None, [INLOG_MISLUKT])
    assert fout == (None, [INLOG_MISLUKT])


def test_ook_bij_een_onbekend_adres_wordt_er_gerekend(conn, monkeypatch):
    """Anders verraadt de duur of een account bestaat.

    Geteld wordt hoe vaak de wachtwoordcontrole wordt aangeroepen: bij
    een onbekend adres hoort dat één keer te zijn, tegen een vaste
    onbruikbare hash, precies zoals bij een bestaand adres.
    """
    from boekhouding import gebruikers

    tellingen = []
    echt = gebruikers.controleer_wachtwoord

    def tellend(wachtwoord, hash_waarde):
        tellingen.append(hash_waarde)
        return echt(wachtwoord, hash_waarde)

    monkeypatch.setattr(gebruikers, "controleer_wachtwoord", tellend)
    maak_gebruiker(conn, "eig@test.nl", "Eigenaar", TESTWACHTWOORD,
                   rol="eigenaar")

    probeer_inloggen(conn, "niemand@test.nl", TESTWACHTWOORD)
    assert len(tellingen) == 1
    assert tellingen[0].startswith("$2")


def test_de_twee_mislukkingen_duren_ongeveer_even_lang(conn):
    """Grofmazig, want een testmachine is nooit stil — maar een
    onbekend adres mag niet meteen terugkomen terwijl een bestaand
    adres eerst een hash controleert."""
    maak_gebruiker(conn, "eig@test.nl", "Eigenaar", TESTWACHTWOORD,
                   rol="eigenaar")

    def duur(email):
        metingen = []
        for _ in range(5):
            conn.execute("DELETE FROM toegang_log")
            start = time.perf_counter()
            probeer_inloggen(conn, email, "verkeerd-1234")
            metingen.append(time.perf_counter() - start)
        return sorted(metingen)[2]

    bestaand = duur("eig@test.nl")
    onbekend = duur("niemand@test.nl")
    assert onbekend > bestaand * 0.5


def test_inloggen_lukt_ongeacht_hoofdletters(conn):
    maak_gebruiker(conn, "eig@test.nl", "Eigenaar", TESTWACHTWOORD,
                   rol="eigenaar")
    token, redenen = probeer_inloggen(conn, "  Eig@Test.NL ", TESTWACHTWOORD)
    assert token and redenen == []


def test_een_inactief_account_komt_er_niet_in(conn):
    gebruiker_id = maak_gebruiker(conn, "weg@test.nl", "Weg", TESTWACHTWOORD)
    conn.execute("UPDATE gebruikers SET actief = 0 WHERE id = ?", (gebruiker_id,))
    conn.commit()
    assert probeer_inloggen(conn, "weg@test.nl", TESTWACHTWOORD) == (
        None, [INLOG_MISLUKT]
    )


# --- de rem op mislukte pogingen ----------------------------------------

def test_de_rem_slaat_aan_per_account(conn):
    maak_gebruiker(conn, "eig@test.nl", "Eigenaar", TESTWACHTWOORD,
                   rol="eigenaar")

    for _ in range(MAX_PER_ACCOUNT):
        assert probeer_inloggen(conn, "eig@test.nl", "verkeerd-1234", "1.1.1.1") == (
            None, [INLOG_MISLUKT]
        )

    # Zelfs met het júíste wachtwoord komt hij er nu niet in.
    token, redenen = probeer_inloggen(conn, "eig@test.nl", TESTWACHTWOORD, "1.1.1.1")
    assert token is None
    assert redenen == [TE_VAAK]

    # Een ander account op hetzelfde IP kan nog wel.
    maak_gebruiker(conn, "twee@test.nl", "Twee", TESTWACHTWOORD)
    token, redenen = probeer_inloggen(conn, "twee@test.nl", TESTWACHTWOORD, "1.1.1.1")
    assert token and redenen == []


def test_de_rem_slaat_ook_aan_per_ip(conn):
    """Eén wachtwoord op honderd adressen proberen moet ook stoppen."""
    maak_gebruiker(conn, "eig@test.nl", "Eigenaar", TESTWACHTWOORD,
                   rol="eigenaar")

    for nummer in range(MAX_PER_IP):
        probeer_inloggen(conn, f"gok{nummer}@test.nl", "verkeerd-1234", "9.9.9.9")

    assert probeer_inloggen(conn, "eig@test.nl", TESTWACHTWOORD, "9.9.9.9") == (
        None, [TE_VAAK]
    )
    # Vanaf een ander IP-adres kan hetzelfde account gewoon inloggen.
    token, redenen = probeer_inloggen(conn, "eig@test.nl", TESTWACHTWOORD, "8.8.8.8")
    assert token and redenen == []


def test_oude_mislukkingen_tellen_niet_meer_mee(conn):
    maak_gebruiker(conn, "eig@test.nl", "Eigenaar", TESTWACHTWOORD,
                   rol="eigenaar")
    for _ in range(MAX_PER_ACCOUNT):
        probeer_inloggen(conn, "eig@test.nl", "verkeerd-1234", "1.1.1.1")

    # Zet de pogingen een uur terug: het venster is een kwartier.
    lang_geleden = (nu() - timedelta(hours=1)).isoformat(timespec="seconds")
    conn.execute("UPDATE toegang_log SET tijdstip = ?", (lang_geleden,))
    conn.commit()

    token, redenen = probeer_inloggen(conn, "eig@test.nl", TESTWACHTWOORD, "1.1.1.1")
    assert token and redenen == []


# --- sessies ------------------------------------------------------------

def test_een_sessie_kan_worden_ingetrokken(conn):
    maak_gebruiker(conn, "eig@test.nl", "Eigenaar", TESTWACHTWOORD,
                   rol="eigenaar")
    token, _ = probeer_inloggen(conn, "eig@test.nl", TESTWACHTWOORD)

    assert lees_sessie(conn, token) is not None
    trek_sessie_in(conn, token)
    assert lees_sessie(conn, token) is None


def test_een_verlopen_sessie_telt_niet_meer(conn):
    maak_gebruiker(conn, "eig@test.nl", "Eigenaar", TESTWACHTWOORD,
                   rol="eigenaar")
    token, _ = probeer_inloggen(conn, "eig@test.nl", TESTWACHTWOORD)

    verleden = (nu() - timedelta(minutes=1)).isoformat(timespec="seconds")
    conn.execute("UPDATE sessies SET verloopt_op = ?", (verleden,))
    conn.commit()

    assert lees_sessie(conn, token) is None


def test_het_token_zelf_staat_niet_in_de_database(conn):
    maak_gebruiker(conn, "eig@test.nl", "Eigenaar", TESTWACHTWOORD,
                   rol="eigenaar")
    token, _ = probeer_inloggen(conn, "eig@test.nl", TESTWACHTWOORD)

    opgeslagen = conn.execute("SELECT token_hash FROM sessies").fetchone()[0]
    assert token not in opgeslagen
    assert lees_sessie(conn, "iets-anders") is None


# --- rollen -------------------------------------------------------------

def test_de_eigenaar_mag_overal_bij_de_klant_alleen_bij_de_zijne():
    eigenaar = Gebruiker(id=1, email="e@x.nl", naam="E", rol="eigenaar")
    klant = Gebruiker(id=2, email="k@x.nl", naam="K", rol="klant",
                      administraties=[2])

    assert eigenaar.is_eigenaar() and eigenaar.mag_bij(1) and eigenaar.mag_bij(99)
    assert not klant.is_eigenaar()
    assert klant.mag_bij(2)
    assert not klant.mag_bij(1)


def test_een_onbekende_rol_wordt_geweigerd(conn):
    with pytest.raises(ValueError, match="onbekende rol"):
        maak_gebruiker(conn, "x@test.nl", "X", TESTWACHTWOORD, rol="beheerder")


# --- de webinterface ----------------------------------------------------

@pytest.fixture
def opzet(tmp_path):
    """Twee administraties, een eigenaar en een klant die alleen bij 2 mag."""
    db = tmp_path / "boekhouding.sqlite"
    app = maak_app(str(db), str(tmp_path / "opslag"), ai_client=None,
                   vandaag=VANDAAG)

    conn = maak_verbinding(str(db))
    if conn.execute("SELECT count(*) FROM administraties").fetchone()[0] < 2:
        maak_administratie(conn, "Zaak van de klant")
    conn.close()

    eigenaar = maak_ingelogde_client(app, db, "eigenaar@test.nl", rol="eigenaar")
    klant = maak_ingelogde_client(app, db, "klant@test.nl", rol="klant",
                                  administraties=[2], naam="Klant Twee")
    return app, db, eigenaar, klant


def upload_ubl(web, administratie_id=1, naam="factuur.xml"):
    return web.post(
        f"/administratie/{administratie_id}/upload",
        files={"bestand": (naam, GOEDE_UBL.read_bytes(), "application/xml")},
        follow_redirects=False,
    )


def test_uitgelogde_bezoeker_komt_nergens_binnen(opzet):
    app, _db, _eigenaar, _klant = opzet
    vreemde = TestClient(app)

    for pad in ("/", "/administratie/1", "/administratie/1/upload",
                "/administratie/1/factuur/1", "/administratie/1/btw",
                "/administratie/1/bank", "/administratie/1/verkoop"):
        antwoord = vreemde.get(pad, follow_redirects=False)
        assert antwoord.status_code == 303, pad
        assert antwoord.headers["location"].startswith("/inloggen"), pad

    # Ook posten kan hij niet: hij belandt op het inlogscherm en de
    # factuur wordt niet goedgekeurd.
    antwoord = vreemde.post("/administratie/1/factuur/1/goedkeuren",
                            follow_redirects=False)
    assert antwoord.status_code == 303
    assert antwoord.headers["location"].startswith("/inloggen")


def test_het_inlogscherm_is_wel_open(opzet):
    app, _db, _eigenaar, _klant = opzet
    pagina = TestClient(app).get("/inloggen")
    assert pagina.status_code == 200
    assert "Wachtwoord" in pagina.text
    # Geen zelfregistratie: er is geen weg om zelf een account te maken.
    assert "registreren" not in pagina.text.lower()


def test_uitloggen_maakt_de_sessie_ongeldig(opzet):
    _app, _db, eigenaar, _klant = opzet
    assert eigenaar.get("/administratie/1").status_code == 200

    antwoord = eigenaar.post("/uitloggen", follow_redirects=False)
    assert antwoord.status_code == 303

    daarna = eigenaar.get("/administratie/1", follow_redirects=False)
    assert daarna.status_code == 303
    assert daarna.headers["location"].startswith("/inloggen")


def test_een_verlopen_sessie_komt_er_niet_meer_in(opzet):
    _app, db, eigenaar, _klant = opzet
    assert eigenaar.get("/administratie/1").status_code == 200

    conn = maak_verbinding(str(db))
    verleden = (nu() - timedelta(minutes=1)).isoformat(timespec="seconds")
    conn.execute("UPDATE sessies SET verloopt_op = ?", (verleden,))
    conn.commit()
    conn.close()

    antwoord = eigenaar.get("/administratie/1", follow_redirects=False)
    assert antwoord.status_code == 303
    assert antwoord.headers["location"].startswith("/inloggen")


def test_een_klant_komt_niet_bij_een_andere_administratie(opzet):
    _app, _db, eigenaar, klant = opzet
    upload_ubl(eigenaar, 1)

    # De administratie zelf: 404, niet 403.
    antwoord = klant.get("/administratie/1", follow_redirects=False)
    assert antwoord.status_code == 404
    assert "403" not in antwoord.text

    # En ook geen enkel scherm eronder.
    for pad in ("/administratie/1/factuur/1", "/administratie/1/upload",
                "/administratie/1/verkoop", "/administratie/1/klanten"):
        assert klant.get(pad, follow_redirects=False).status_code == 404, pad


def test_de_klant_ziet_niets_van_de_andere_administratie_in_het_antwoord(opzet):
    _app, _db, eigenaar, klant = opzet
    upload_ubl(eigenaar, 1)

    pagina = klant.get("/administratie/1/factuur/1", follow_redirects=False)
    assert pagina.status_code == 404
    # Geen leveranciersnaam, geen bedrag: het antwoord is voor een factuur
    # die niet bestaat gelijk aan dat voor een factuur van een ander.
    assert "Bakker" not in pagina.text
    onbekend = klant.get("/administratie/2/factuur/999", follow_redirects=False)
    assert onbekend.status_code == 404
    assert onbekend.text == pagina.text


def test_een_klant_kan_niet_goedkeuren(opzet):
    _app, db, eigenaar, klant = opzet
    # Een factuur in de administratie van de klant zelf.
    upload_ubl(eigenaar, 2)

    antwoord = klant.post("/administratie/2/factuur/1/goedkeuren",
                          follow_redirects=False)
    assert antwoord.status_code == 404

    conn = maak_verbinding(str(db))
    factuur = lees_factuur(conn, 1)
    conn.close()
    assert factuur["goedgekeurd_op"] is None
    assert factuur["status"] != "goedgekeurd"


def test_een_klant_kan_de_gelezen_bedragen_niet_wijzigen(opzet):
    """Aanleveren en meekijken mag; de cijfers bijstellen niet."""
    _app, db, eigenaar, klant = opzet
    upload_ubl(eigenaar, 2)

    antwoord = klant.post("/administratie/2/factuur/1/opslaan",
                          data={"bedrag_incl": "1.00"}, follow_redirects=False)
    assert antwoord.status_code == 404

    conn = maak_verbinding(str(db))
    factuur = lees_factuur(conn, 1)
    conn.close()
    assert factuur["bedrag_incl"] != "1.00"

    # In het scherm zijn de velden alleen-lezen en is er geen opslaanknop.
    pagina = klant.get("/administratie/2/factuur/1").text
    assert "readonly" in pagina
    assert "Opslaan en later beoordelen" not in pagina


def test_de_knop_om_goed_te_keuren_staat_er_niet_eens(opzet):
    _app, _db, eigenaar, klant = opzet
    upload_ubl(eigenaar, 2)

    pagina = klant.get("/administratie/2/factuur/1").text
    assert "Goedkeuren" not in pagina
    assert "wacht op goedkeuring door de boekhouder" in pagina


def test_een_klant_kan_niets_definitief_maken(opzet):
    _app, db, eigenaar, klant = opzet
    conn = maak_verbinding(str(db))
    from boekhouding import maak_klant, maak_verkoopfactuur, zet_verkoopregels

    klant_id = maak_klant(conn, 2, {"naam": "Afnemer", "adres": "Straat 1",
                                    "postcode": "1234 AB", "plaats": "Delft"})
    factuur_id = maak_verkoopfactuur(conn, 2, klant_id, "2026-08-01")
    zet_verkoopregels(conn, factuur_id, [
        {"omschrijving": "Werk", "aantal": "1", "stukprijs": "100.00",
         "btw_percentage": "21"},
    ])
    conn.close()

    antwoord = klant.post(f"/administratie/2/verkoop/{factuur_id}/definitief",
                          follow_redirects=False)
    assert antwoord.status_code == 404

    conn = maak_verbinding(str(db))
    facturen = lees_verkoopfacturen(conn, 2)
    conn.close()
    assert facturen[0]["status"] == "concept"
    assert facturen[0]["factuurnummer"] is None


def test_de_klant_komt_niet_bij_de_bank_en_de_aangifte(opzet):
    _app, _db, _eigenaar, klant = opzet
    for pad in ("/administratie/2/bank", "/administratie/2/btw",
                "/administratie/2/btw/2026/3"):
        assert klant.get(pad, follow_redirects=False).status_code == 404, pad

    overzicht = klant.get("/administratie/2").text
    assert "Btw-aangifte" not in overzicht
    assert ">Bank<" not in overzicht


def test_wat_een_klant_wel_mag(opzet):
    """Aanleveren, meekijken en een concept-verkoopfactuur opstellen."""
    _app, db, _eigenaar, klant = opzet

    assert upload_ubl(klant, 2).status_code == 303
    overzicht = klant.get("/administratie/2").text
    assert "Factuur toevoegen" in overzicht

    # De eigen factuur en de status ervan zijn te zien.
    detail = klant.get("/administratie/2/factuur/1")
    assert detail.status_code == 200

    # En hij kan een concept-verkoopfactuur klaarzetten.
    conn = maak_verbinding(str(db))
    from boekhouding import maak_klant

    klant_id = maak_klant(conn, 2, {"naam": "Afnemer", "adres": "Straat 1",
                                    "postcode": "1234 AB", "plaats": "Delft"})
    conn.close()
    antwoord = klant.post("/administratie/2/verkoop",
                          data={"klant_id": str(klant_id),
                                "factuurdatum": "2026-08-01"},
                          follow_redirects=False)
    assert antwoord.status_code == 303

    conn = maak_verbinding(str(db))
    facturen = lees_verkoopfacturen(conn, 2)
    conn.close()
    assert len(facturen) == 1 and facturen[0]["status"] == "concept"


# --- csrf ---------------------------------------------------------------

def test_zonder_csrf_teken_gebeurt_er_niets(opzet):
    _app, db, eigenaar, _klant = opzet
    upload_ubl(eigenaar, 1)

    # Rechtstreeks posten zonder het teken: dat is precies wat een andere
    # website zou doen met de cookie van de browser.
    rauw = TestClient(eigenaar.app)
    rauw.cookies.update(eigenaar.cookies)
    antwoord = rauw.post("/administratie/1/factuur/1/goedkeuren",
                         follow_redirects=False)
    assert antwoord.status_code == 404

    conn = maak_verbinding(str(db))
    factuur = lees_factuur(conn, 1)
    conn.close()
    assert factuur["goedgekeurd_op"] is None


def test_een_verkeerd_csrf_teken_telt_ook_niet(opzet):
    _app, db, eigenaar, _klant = opzet
    upload_ubl(eigenaar, 1)

    rauw = TestClient(eigenaar.app)
    rauw.cookies.update(eigenaar.cookies)
    antwoord = rauw.post("/administratie/1/factuur/1/goedkeuren",
                         data={"csrf": "het-teken-van-iemand-anders"},
                         follow_redirects=False)
    assert antwoord.status_code == 404

    conn = maak_verbinding(str(db))
    assert lees_factuur(conn, 1)["goedgekeurd_op"] is None
    conn.close()


def test_elk_formulier_heeft_het_teken(opzet):
    _app, _db, eigenaar, _klant = opzet
    upload_ubl(eigenaar, 1)

    for pad in ("/administratie/1", "/administratie/1/upload",
                "/administratie/1/factuur/1", "/administratie/1/verkoop",
                "/administratie/1/klanten", "/administratie/1/bank",
                "/administratie/1/instellingen"):
        pagina = eigenaar.get(pad).text
        assert pagina.count("<form") == pagina.count('name="csrf"'), pad


def test_ook_het_inlogformulier_heeft_een_teken(opzet):
    app, _db, _eigenaar, _klant = opzet
    vreemde = TestClient(app)
    pagina = vreemde.get("/inloggen")
    assert 'name="csrf"' in pagina.text
    assert "aanmeldteken" in pagina.cookies

    # Zonder dat teken wordt er niet ingelogd, ook niet met het juiste
    # wachtwoord.
    schoon = TestClient(app)
    antwoord = schoon.post(
        "/inloggen",
        data={"email": "eigenaar@test.nl", "wachtwoord": TESTWACHTWOORD},
        follow_redirects=False,
    )
    assert antwoord.status_code == 303
    assert antwoord.headers["location"].startswith("/inloggen")
    assert "sessie" not in schoon.cookies


# --- inloggen via het scherm --------------------------------------------

def inlogpoging(client, email, wachtwoord):
    teken = client.get("/inloggen").cookies["aanmeldteken"]
    return client.post(
        "/inloggen",
        data={"email": email, "wachtwoord": wachtwoord, "csrf": teken},
        follow_redirects=False,
    )


def test_de_rem_werkt_ook_via_het_scherm(opzet):
    app, _db, _eigenaar, _klant = opzet
    vreemde = TestClient(app)

    for _ in range(MAX_PER_ACCOUNT):
        antwoord = inlogpoging(vreemde, "eigenaar@test.nl", "verkeerd-1234")
        assert INLOG_MISLUKT in unquote(antwoord.headers["location"])

    # Nu ook met het goede wachtwoord niet meer.
    antwoord = inlogpoging(vreemde, "eigenaar@test.nl", TESTWACHTWOORD)
    assert "sessie" not in vreemde.cookies
    assert TE_VAAK in unquote(antwoord.headers["location"])


def test_na_inloggen_kom_je_op_de_pagina_die_je_wilde(opzet):
    app, _db, _eigenaar, _klant = opzet
    vreemde = TestClient(app)

    geweigerd = vreemde.get("/administratie/1/verkoop", follow_redirects=False)
    terug = geweigerd.headers["location"].split("terug=")[1]

    teken = vreemde.get("/inloggen").cookies["aanmeldteken"]
    antwoord = vreemde.post(
        "/inloggen",
        data={"email": "eigenaar@test.nl", "wachtwoord": TESTWACHTWOORD,
              "csrf": teken, "terug": terug},
        follow_redirects=False,
    )
    assert antwoord.headers["location"] == "/administratie/1/verkoop"


def test_de_klant_belandt_op_zijn_eigen_administratie(opzet):
    _app, _db, _eigenaar, klant = opzet
    antwoord = klant.get("/", follow_redirects=False)
    assert antwoord.status_code == 303
    assert antwoord.headers["location"] == "/administratie/2"


# --- audit trail --------------------------------------------------------

def test_de_audit_trail_noemt_de_echte_gebruiker(opzet):
    _app, db, eigenaar, klant = opzet
    upload_ubl(klant, 2)
    eigenaar.post("/administratie/2/factuur/1/opslaan",
                  data={"rekening": "4100"}, follow_redirects=False)

    conn = maak_verbinding(str(db))
    regels = lees_audit_trail(conn, 1)  # de audit trail van factuur 1
    conn.close()

    wie = {regel["door"] for regel in regels}
    assert "klant@test.nl" in wie
    assert "eigenaar@test.nl" in wie
    assert "eigenaar" not in wie  # de oude vaste waarde


def test_elke_inlogpoging_wordt_vastgelegd(opzet):
    app, db, _eigenaar, _klant = opzet
    vreemde = TestClient(app)
    inlogpoging(vreemde, "eigenaar@test.nl", "verkeerd-1234")
    inlogpoging(vreemde, "eigenaar@test.nl", TESTWACHTWOORD)

    conn = maak_verbinding(str(db))
    regels = lees_toegang_log(conn)
    conn.close()

    pogingen = [r for r in regels if r["soort"] == "inlog"]
    assert any(r["gelukt"] == 0 and r["email"] == "eigenaar@test.nl"
               for r in pogingen)
    assert any(r["gelukt"] == 1 and r["email"] == "eigenaar@test.nl"
               for r in pogingen)
    assert all(r["tijdstip"] for r in pogingen)
    # Het wachtwoord staat er nergens in.
    assert TESTWACHTWOORD not in str(regels)


def test_uitloggen_staat_ook_in_het_logboek(opzet):
    _app, db, eigenaar, _klant = opzet
    eigenaar.post("/uitloggen", follow_redirects=False)

    conn = maak_verbinding(str(db))
    soorten = [regel["soort"] for regel in lees_toegang_log(conn)]
    conn.close()
    assert "uitgelogd" in soorten
