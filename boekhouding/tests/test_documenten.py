"""Tests voor PDF-tekstextractie en de bewaarplicht-opslag.

Alle testbestanden worden hier zelf gegenereerd (zie maak_pdf in
conftest.py); er wordt niets gedownload.
"""

import sqlite3

import pytest

from boekhouding import (
    bereken_hash,
    bewaar_document,
    lees_audit_trail,
    lees_document,
    lees_factuur,
    lees_pdf_tekst,
    maak_administratie,
    opslagpad_voor,
    sla_factuur_op,
)
from conftest import VANDAAG, geldige_factuur, maak_pdf


@pytest.fixture
def factuur_pdf(tmp_path):
    """Een PDF met een echte tekstlaag."""
    pad = tmp_path / "factuur-kpn.pdf"
    pad.write_bytes(maak_pdf("Factuur F2026-0001 KPN B.V. 121,00"))
    return pad


@pytest.fixture
def opslagmap(tmp_path):
    return tmp_path / "opslag"


# --- lees_pdf_tekst ---------------------------------------------------

def test_tekst_uit_pdf_wordt_gelezen(factuur_pdf):
    resultaat = lees_pdf_tekst(factuur_pdf)
    assert resultaat.status == "gelezen"
    assert resultaat.redenen == []
    assert "F2026-0001" in resultaat.tekst
    assert "KPN" in resultaat.tekst
    assert resultaat.aantal_paginas == 1
    assert resultaat.bestandsnaam == "factuur-kpn.pdf"


def test_pdf_zonder_tekstlaag_geeft_review(tmp_path):
    scan = tmp_path / "scan.pdf"
    scan.write_bytes(maak_pdf(None))
    resultaat = lees_pdf_tekst(scan)
    assert resultaat.status == "review_nodig"
    assert resultaat.redenen == ["geen tekstlaag gevonden, mogelijk een scan"]
    assert resultaat.tekst == ""
    assert resultaat.aantal_paginas == 1


def test_kapotte_pdf_geeft_review(tmp_path):
    kapot = tmp_path / "kapot.pdf"
    kapot.write_bytes(b"%PDF-1.4\ndit is geen geldige pdf-inhoud\n")
    resultaat = lees_pdf_tekst(kapot)
    assert resultaat.status == "review_nodig"
    assert any("kon de PDF niet lezen" in reden for reden in resultaat.redenen)


def test_bestand_dat_geen_pdf_is_geeft_review(tmp_path):
    tekstbestand = tmp_path / "notitie.txt"
    tekstbestand.write_text("gewoon een tekstbestand", encoding="utf-8")
    resultaat = lees_pdf_tekst(tekstbestand)
    assert resultaat.status == "review_nodig"
    assert any("kon de PDF niet lezen" in reden for reden in resultaat.redenen)


def test_leeg_bestand_geeft_review(tmp_path):
    leeg = tmp_path / "leeg.pdf"
    leeg.write_bytes(b"")
    resultaat = lees_pdf_tekst(leeg)
    assert resultaat.status == "review_nodig"
    assert resultaat.redenen  # met reden, en zonder exception


def test_onbestaand_bestand_geeft_review(tmp_path):
    resultaat = lees_pdf_tekst(tmp_path / "bestaat-niet.pdf")
    assert resultaat.status == "review_nodig"
    assert any("niet gevonden" in reden for reden in resultaat.redenen)


# --- bereken_hash -----------------------------------------------------

def test_zelfde_inhoud_geeft_zelfde_hash(tmp_path):
    inhoud = maak_pdf("Factuur F2026-0001")
    (tmp_path / "a.pdf").write_bytes(inhoud)
    (tmp_path / "b.pdf").write_bytes(inhoud)  # andere naam, zelfde inhoud
    assert bereken_hash(tmp_path / "a.pdf") == bereken_hash(tmp_path / "b.pdf")


def test_andere_inhoud_geeft_andere_hash(tmp_path):
    (tmp_path / "a.pdf").write_bytes(maak_pdf("Factuur F2026-0001"))
    (tmp_path / "b.pdf").write_bytes(maak_pdf("Factuur F2026-0002"))
    assert bereken_hash(tmp_path / "a.pdf") != bereken_hash(tmp_path / "b.pdf")


# --- bewaar_document --------------------------------------------------

def test_document_wordt_bewaard(conn, administratie_id, factuur_pdf, opslagmap):
    resultaat = bewaar_document(
        conn, administratie_id, str(factuur_pdf), str(opslagmap)
    )
    assert resultaat.status == "opgeslagen"
    assert resultaat.document_id is not None
    assert resultaat.hash == bereken_hash(factuur_pdf)

    bewaard = opslagpad_voor(resultaat.hash, opslagmap)
    assert bewaard.is_file()
    assert bewaard.read_bytes() == factuur_pdf.read_bytes()
    assert factuur_pdf.is_file()  # het origineel blijft staan

    registratie = lees_document(conn, resultaat.document_id)
    assert registratie["administratie_id"] == administratie_id
    assert registratie["originele_bestandsnaam"] == "factuur-kpn.pdf"
    assert registratie["opslagpad"] == str(bewaard)
    assert registratie["aangemaakt_op"]


def test_bewaard_bestand_is_alleen_lezen(
    conn, administratie_id, factuur_pdf, opslagmap
):
    # Bewaarplicht: nooit overschrijven, ook niet per ongeluk. We
    # controleren de rechten zelf en niet of schrijven een fout geeft:
    # als root draait, mag die namelijk alsnog schrijven.
    resultaat = bewaar_document(
        conn, administratie_id, str(factuur_pdf), str(opslagmap)
    )
    bewaard = opslagpad_voor(resultaat.hash, opslagmap)
    assert bewaard.stat().st_mode & 0o777 == 0o444


def test_tweede_keer_bewaren_laat_het_bestand_ongemoeid(
    conn, administratie_id, factuur_pdf, opslagmap
):
    eerste = bewaar_document(
        conn, administratie_id, str(factuur_pdf), str(opslagmap)
    )
    bewaard = opslagpad_voor(eerste.hash, opslagmap)
    gewijzigd_op = bewaard.stat().st_mtime_ns

    bewaar_document(conn, administratie_id, str(factuur_pdf), str(opslagmap))

    assert bewaard.stat().st_mtime_ns == gewijzigd_op
    assert bewaard.read_bytes() == factuur_pdf.read_bytes()


def test_zelfde_pdf_twee_keer_geeft_geen_tweede_kopie(
    conn, administratie_id, factuur_pdf, opslagmap
):
    eerste = bewaar_document(
        conn, administratie_id, str(factuur_pdf), str(opslagmap)
    )
    tweede = bewaar_document(
        conn, administratie_id, str(factuur_pdf), str(opslagmap)
    )

    assert eerste.status == "opgeslagen"
    assert tweede.status == "bestond_al"
    assert tweede.document_id == eerste.document_id
    assert tweede.hash == eerste.hash

    aantal_rijen = conn.execute("SELECT count(*) FROM documenten").fetchone()[0]
    assert aantal_rijen == 1
    bestanden = list(opslagmap.rglob("*.pdf"))
    assert len(bestanden) == 1


def test_zelfde_inhoud_andere_bestandsnaam_is_hetzelfde_document(
    conn, administratie_id, factuur_pdf, opslagmap, tmp_path
):
    kopie = tmp_path / "scan-van-dezelfde-factuur.pdf"
    kopie.write_bytes(factuur_pdf.read_bytes())

    eerste = bewaar_document(
        conn, administratie_id, str(factuur_pdf), str(opslagmap)
    )
    tweede = bewaar_document(conn, administratie_id, str(kopie), str(opslagmap))

    assert tweede.status == "bestond_al"
    assert tweede.document_id == eerste.document_id


def test_andere_pdf_wordt_apart_bewaard(
    conn, administratie_id, factuur_pdf, opslagmap, tmp_path
):
    andere = tmp_path / "factuur-coolblue.pdf"
    andere.write_bytes(maak_pdf("Factuur F2026-0002 Coolblue B.V. 242,00"))

    eerste = bewaar_document(
        conn, administratie_id, str(factuur_pdf), str(opslagmap)
    )
    tweede = bewaar_document(conn, administratie_id, str(andere), str(opslagmap))

    assert tweede.status == "opgeslagen"
    assert tweede.document_id != eerste.document_id
    assert len(list(opslagmap.rglob("*.pdf"))) == 2


def test_zelfde_pdf_in_andere_administratie_is_eigen_registratie(
    conn, factuur_pdf, opslagmap
):
    admin_a = maak_administratie(conn, "Zaak A")
    admin_b = maak_administratie(conn, "Zaak B")

    eerste = bewaar_document(conn, admin_a, str(factuur_pdf), str(opslagmap))
    tweede = bewaar_document(conn, admin_b, str(factuur_pdf), str(opslagmap))

    # Aparte boekhoudingen, dus een eigen registratie per administratie...
    assert tweede.status == "opgeslagen"
    assert tweede.document_id != eerste.document_id
    # ...maar het bestand staat er maar één keer.
    assert len(list(opslagmap.rglob("*.pdf"))) == 1


def test_bewaren_van_onbestaand_bestand_geeft_review(
    conn, administratie_id, opslagmap, tmp_path
):
    resultaat = bewaar_document(
        conn, administratie_id, str(tmp_path / "weg.pdf"), str(opslagmap)
    )
    assert resultaat.status == "review_nodig"
    assert any("niet gevonden" in reden for reden in resultaat.redenen)
    assert resultaat.document_id is None
    assert conn.execute("SELECT count(*) FROM documenten").fetchone()[0] == 0


def test_audit_trail_bij_bewaren(conn, administratie_id, factuur_pdf, opslagmap):
    resultaat = bewaar_document(
        conn, administratie_id, str(factuur_pdf), str(opslagmap)
    )
    trail = lees_audit_trail(conn, resultaat.document_id, tabel="documenten")
    assert len(trail) == 3
    assert all(regel["actie"] == "aangemaakt" for regel in trail)
    per_veld = {regel["veld"]: regel["nieuwe_waarde"] for regel in trail}
    assert per_veld["hash"] == resultaat.hash
    assert per_veld["originele_bestandsnaam"] == "factuur-kpn.pdf"


# --- koppeling factuur <-> document -----------------------------------

def test_factuur_kan_aan_document_gekoppeld_worden(
    conn, administratie_id, factuur_pdf, opslagmap
):
    document = bewaar_document(
        conn, administratie_id, str(factuur_pdf), str(opslagmap)
    )
    factuur_id, resultaat = sla_factuur_op(
        conn,
        administratie_id,
        geldige_factuur(),
        vandaag=VANDAAG,
        document_id=document.document_id,
    )
    assert resultaat.status == "gevalideerd"
    assert lees_factuur(conn, factuur_id)["document_id"] == document.document_id


def test_factuur_zonder_document_blijft_toegestaan(conn, administratie_id):
    factuur_id, _ = sla_factuur_op(
        conn, administratie_id, geldige_factuur(), vandaag=VANDAAG
    )
    assert lees_factuur(conn, factuur_id)["document_id"] is None


def test_onbestaand_document_id_wordt_geweigerd(conn, administratie_id):
    with pytest.raises(sqlite3.IntegrityError, match="FOREIGN KEY"):
        sla_factuur_op(
            conn,
            administratie_id,
            geldige_factuur(),
            vandaag=VANDAAG,
            document_id=999,
        )


def test_koppeling_staat_in_de_audit_trail(
    conn, administratie_id, factuur_pdf, opslagmap
):
    document = bewaar_document(
        conn, administratie_id, str(factuur_pdf), str(opslagmap)
    )
    factuur_id, _ = sla_factuur_op(
        conn,
        administratie_id,
        geldige_factuur(),
        vandaag=VANDAAG,
        document_id=document.document_id,
    )
    trail = lees_audit_trail(conn, factuur_id)
    koppeling = [regel for regel in trail if regel["veld"] == "document_id"]
    assert len(koppeling) == 1
    assert koppeling[0]["nieuwe_waarde"] == str(document.document_id)
