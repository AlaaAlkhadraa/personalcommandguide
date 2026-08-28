import os
import re

# Bcrypt is met opzet traag: dat is precies waarom het goed is tegen
# wachtwoorden raden. Voor de tests zetten we het aantal rondes zo laag
# mogelijk, anders duurt de suite minuten. Dit staat bovenaan omdat de
# module de waarde bij het importeren leest.
os.environ.setdefault("BOEKHOUDING_BCRYPT_RONDES", "4")

from datetime import date  # noqa: E402

import pytest  # noqa: E402
from fastapi.testclient import TestClient  # noqa: E402

from boekhouding import (  # noqa: E402
    maak_verbinding,
    maak_tabellen,
    maak_administratie,
    maak_gebruiker,
)
from boekhouding.database import lees_sessie  # noqa: E402

# Het wachtwoord dat elke testgebruiker krijgt. Tien tekens, want korter
# accepteert hash_wachtwoord niet.
TESTWACHTWOORD = "geheim-1234"

# Vaste peildatum zodat de tests niet afhangen van de echte klok.
VANDAAG = date(2026, 8, 26)


def geldige_factuur() -> dict:
    """Een factuur waar niets mis mee is: 100.00 + 21% = 121.00."""
    return {
        "leverancier": "KPN B.V.",
        "factuurdatum": "2026-08-01",
        "factuurnummer": "F2026-0001",
        "bedrag_excl": "100.00",
        "btw_percentage": "21",
        "btw_bedrag": "21.00",
        "bedrag_incl": "121.00",
    }


def maak_pdf(tekst: str | None) -> bytes:
    """Bouw een minimale, geldige PDF van één pagina.

    Zo hoeven de tests geen bestand te downloaden. Met `tekst` krijgt de
    pagina een echte tekstlaag; met None wordt alleen een rechthoek
    getekend — dat is het geval dat een scan nabootst: een geldige PDF
    zonder tekstlaag.
    """
    if tekst is None:
        stroom = b"1 0 0 RG 100 100 200 300 re S"
        resources = b"<< >>"
    else:
        veilig = tekst.replace("\\", r"\\").replace("(", r"\(").replace(")", r"\)")
        stroom = (
            b"BT /F1 12 Tf 72 720 Td (" + veilig.encode("latin-1") + b") Tj ET"
        )
        resources = b"<< /Font << /F1 5 0 R >> >>"

    objecten = [
        b"<< /Type /Catalog /Pages 2 0 R >>",
        b"<< /Type /Pages /Kids [3 0 R] /Count 1 >>",
        b"<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] "
        b"/Contents 4 0 R /Resources " + resources + b" >>",
        b"<< /Length " + str(len(stroom)).encode() + b" >>\nstream\n"
        + stroom
        + b"\nendstream",
        b"<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>",
    ]

    uit = bytearray(b"%PDF-1.4\n")
    posities = []
    for nummer, obj in enumerate(objecten, start=1):
        posities.append(len(uit))
        uit += str(nummer).encode() + b" 0 obj\n" + obj + b"\nendobj\n"

    start_xref = len(uit)
    aantal = len(objecten) + 1
    uit += b"xref\n0 " + str(aantal).encode() + b"\n0000000000 65535 f \n"
    for positie in posities:
        uit += f"{positie:010d} 00000 n \n".encode()
    uit += (
        b"trailer\n<< /Size " + str(aantal).encode() + b" /Root 1 0 R >>\n"
        b"startxref\n" + str(start_xref).encode() + b"\n%%EOF\n"
    )
    return bytes(uit)


@pytest.fixture
def conn():
    verbinding = maak_verbinding(":memory:")
    maak_tabellen(verbinding)
    yield verbinding
    verbinding.close()


@pytest.fixture
def administratie_id(conn):
    return maak_administratie(conn, "Testzaak", "eenmanszaak")


# --- ingelogd testen ----------------------------------------------------

class IngelogdeClient(TestClient):
    """Een TestClient die het csrf-teken bij elk formulier meestuurt.

    In de browser zit dat teken in een verborgen veld dat het sjabloon
    invult; een test post rechtstreeks en zou het elke keer zelf moeten
    meegeven. Dat gebeurt hier één keer, zodat de tests over boekhouden
    blijven gaan en niet over formuliertechniek.
    """

    csrf = ""

    def post(self, url, **rest):
        if self.csrf:
            gegevens = rest.get("data")
            if gegevens is None:
                gegevens = {}
            elif isinstance(gegevens, dict):
                gegevens = dict(gegevens)
            else:  # een lijst met paren
                gegevens = list(gegevens)
            if isinstance(gegevens, dict):
                gegevens.setdefault("csrf", self.csrf)
            else:
                gegevens.append(("csrf", self.csrf))
            rest["data"] = gegevens
        return super().post(url, **rest)


def log_in(client, db_pad, email, wachtwoord=TESTWACHTWOORD):
    """Log deze client in en onthoud het csrf-teken van de sessie."""
    pagina = client.get("/inloggen")
    teken = re.search(r'name="csrf" value="([^"]+)"', pagina.text).group(1)
    antwoord = client.post(
        "/inloggen",
        data={"email": email, "wachtwoord": wachtwoord, "csrf": teken},
        follow_redirects=False,
    )
    assert antwoord.status_code == 303, "inloggen mislukt in de test-opzet"
    conn = maak_verbinding(str(db_pad))
    try:
        sessie = lees_sessie(conn, client.cookies.get("sessie"))
    finally:
        conn.close()
    assert sessie is not None, "geen sessie na inloggen"
    client.csrf = sessie["csrf_token"]
    return client


def maak_ingelogde_client(app, db_pad, email, rol="eigenaar",
                          administraties=None, naam=None):
    """Maak een gebruiker aan (als die er nog niet is) en log hem in."""
    conn = maak_verbinding(str(db_pad))
    try:
        bestaat = conn.execute(
            "SELECT 1 FROM gebruikers WHERE email = ?", (email.lower(),)
        ).fetchone()
        if bestaat is None:
            maak_gebruiker(
                conn, email, naam or email.split("@")[0], TESTWACHTWOORD,
                rol=rol, administraties=administraties,
            )
    finally:
        conn.close()
    return log_in(IngelogdeClient(app), db_pad, email)
