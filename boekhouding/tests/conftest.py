from datetime import date

import pytest

from boekhouding import maak_verbinding, maak_tabellen, maak_administratie

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
