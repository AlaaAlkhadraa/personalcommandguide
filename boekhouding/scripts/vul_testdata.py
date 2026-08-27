#!/usr/bin/env python3
"""Zet testdata klaar in de webinterface.

    python scripts/vul_testdata.py

Maakt de administratie aan (als die er nog niet is) en laadt de vijf
UBL-testbestanden in. Die werken zonder API-sleutel: bij een e-factuur
staan de velden letterlijk in het bestand, dus er komt geen model aan te
pas.

Wil je ook zien hoe het reviewscherm eruitziet met een échte PDF ernaast:

    python scripts/vul_testdata.py --met-pdf

Dat laadt ook de Factur-X-PDF in (ook zonder sleutel — de e-factuur zit
als bijlage in de PDF).

Wil je ook het btw-scherm met cijfers zien in plaats van met blokkades:

    python scripts/vul_testdata.py --met-pdf --boek

Dan wordt bij elke factuur die klopt een grootboekrekening gekozen, wordt
hij goedgekeurd en geboekt. Dat is normaal handwerk van de eigenaar; hier
gebeurt het zodat er iets te zien is.
"""

import sys
from pathlib import Path

BASIS = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(BASIS))

from boekhouding import (  # noqa: E402
    boek_factuur,
    keur_factuur_goed,
    kies_rekening,
    lees_facturen,
    maak_administratie,
    maak_tabellen,
    maak_verbinding,
)
from boekhouding.verwerking import verwerk_upload  # noqa: E402

GEGEVENS = BASIS / "gegevens"
UBLMAP = BASIS / "tests" / "testfacturen" / "ubl"
BESTANDEN = [
    "01-standaard-21procent.xml",
    "02-diensten-9procent.xml",
    "03-creditnota.xml",
    "04-twee-btw-tarieven.xml",
    "05-zonder-factuurdatum.xml",
]


# Welke rekening bij welk testbestand hoort. Normaal kiest de eigenaar
# die zelf in het reviewscherm; voor de demo staat het hier.
REKENINGEN = {
    "01-standaard-21procent.xml": "4100",   # kantoorkosten
    "02-diensten-9procent.xml": "4310",     # advieskosten
    "06-factuur-x.pdf": "4120",             # software
}


def main() -> int:
    met_pdf = "--met-pdf" in sys.argv
    boeken = "--boek" in sys.argv
    bestanden = BESTANDEN + (["06-factuur-x.pdf"] if met_pdf else [])

    GEGEVENS.mkdir(exist_ok=True)
    conn = maak_verbinding(str(GEGEVENS / "boekhouding.sqlite"))
    maak_tabellen(conn)

    rij = conn.execute("SELECT id, naam FROM administraties ORDER BY id").fetchone()
    if rij is None:
        administratie_id = maak_administratie(conn, "Mijn eenmanszaak")
        print(f"Administratie aangemaakt: Mijn eenmanszaak (nummer {administratie_id})")
    else:
        administratie_id, naam = rij
        print(f"Administratie bestaat al: {naam} (nummer {administratie_id})")

    print()
    for naam in bestanden:
        pad = UBLMAP / naam
        resultaat = verwerk_upload(
            conn, administratie_id, naam, pad.read_bytes(),
            str(GEGEVENS / "opslag"),
        )
        merk = "review nodig" if resultaat.status == "review_nodig" else "klopt"
        print(f"  {naam:<28} -> factuur {resultaat.factuur_id}  [{merk}]")
        for reden in resultaat.redenen:
            print(f"       {reden[:88]}")

        if boeken and resultaat.status != "review_nodig" and naam in REKENINGEN:
            kies_rekening(conn, resultaat.factuur_id, REKENINGEN[naam])
            keur_factuur_goed(conn, resultaat.factuur_id)
            boeking_id, redenen = boek_factuur(conn, resultaat.factuur_id)
            if boeking_id is None:
                print(f"       niet geboekt: {redenen[0][:78]}")
            else:
                print(f"       geboekt op {REKENINGEN[naam]} (boeking {boeking_id})")

    facturen = lees_facturen(conn, administratie_id)
    conn.close()

    review = sum(1 for f in facturen if f["status"] == "review_nodig")
    print(f"\n{len(facturen)} facturen in de administratie, {review} wachten op je.")
    print("Start nu de server:  python scripts/start_webinterface.py")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
