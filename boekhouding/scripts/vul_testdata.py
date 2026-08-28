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

En met `--bank` wordt er ook een bankafschrift ingelezen (MT940), zodat
het aflettersscherm gevuld is. `--verkoop` zet je eigen bedrijfsgegevens,
een klant en twee verkoopfacturen klaar:

    python scripts/vul_testdata.py --met-pdf --boek --bank --verkoop
"""

import sys
from pathlib import Path

BASIS = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(BASIS))

from boekhouding import (  # noqa: E402
    boek_factuur,
    importeer_bankafschrift,
    maak_definitief,
    maak_klant,
    maak_verkoopfactuur,
    wijzig_administratie,
    zet_verkoopregels,
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
BANKMAP = BASIS / "tests" / "testfacturen" / "bank"
AFSCHRIFT = "01-mt940-ing.sta"
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
    met_bank = "--bank" in sys.argv
    met_verkoop = "--verkoop" in sys.argv
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

    if met_bank:
        samenvatting = importeer_bankafschrift(
            conn, administratie_id, AFSCHRIFT,
            (BANKMAP / AFSCHRIFT).read_bytes(), str(GEGEVENS / "opslag"),
        )
        print(
            f"\n  {AFSCHRIFT:<28} -> {samenvatting['nieuw']} nieuwe transacties"
            f" ({samenvatting['formaat']})"
        )
        for reden in samenvatting["redenen"]:
            print(f"       {reden[:88]}")

    if met_verkoop:
        wijzig_administratie(conn, administratie_id, {
            "naam": "Alkhadraa Advies",
            "adres": "Zonnebloemstraat 14", "postcode": "3011 AB",
            "plaats": "Rotterdam", "btw_id": "NL002233445B01",
            "kvk_nummer": "87654321", "iban": "NL44RABO0123456789",
            "email": "post@alkhadraa.test",
        })
        klant_id = maak_klant(conn, administratie_id, {
            "naam": "Van Dijk ICT-diensten", "adres": "Keizersgracht 218",
            "postcode": "1016 DZ", "plaats": "Amsterdam",
            "btw_id": "NL110353601B43", "email": "administratie@vandijk.test",
        })
        print()
        for datum, regels in (
            ("2026-07-08", [
                ("Advies juli 2026", "7.5", "95.00", "21"),
                ("Vakliteratuur", "3", "24.95", "9"),
            ]),
            ("2026-08-12", [("Onderhoud augustus", "1", "2400.00", "21")]),
        ):
            factuur_id = maak_verkoopfactuur(
                conn, administratie_id, klant_id, datum
            )
            zet_verkoopregels(conn, factuur_id, [
                {"omschrijving": o, "aantal": a, "prijs_per_stuk": p,
                 "btw_percentage": b}
                for o, a, p, b in regels
            ])
            nummer, redenen = maak_definitief(
                conn, factuur_id, opslagmap=str(GEGEVENS / "opslag")
            )
            print(f"  verkoopfactuur {nummer or 'niet definitief'}"
                  f"{' — ' + redenen[0] if redenen else ''}")

    facturen = lees_facturen(conn, administratie_id)
    conn.close()

    review = sum(1 for f in facturen if f["status"] == "review_nodig")
    print(f"\n{len(facturen)} facturen in de administratie, {review} wachten op je.")
    print("Start nu de server:  python scripts/start_webinterface.py")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
