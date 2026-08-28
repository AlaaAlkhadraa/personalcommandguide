#!/usr/bin/env python3
"""Maak het eerste account aan (de eigenaar), of later een klantaccount.

    python scripts/maak_eigenaar.py --email alaa@example.nl --naam "Alaa"

Het wachtwoord wordt gevraagd zodra het script draait; je typt het twee
keer en je ziet het niet in beeld. Het komt dus niet in je
terminalgeschiedenis, niet in een bestand en niet in de audit trail —
alleen de hash gaat de database in.

Een klantaccount maak je zo, met de administratie(s) waar hij bij mag:

    python scripts/maak_eigenaar.py --email klant@example.nl \
        --naam "Jan Jansen" --rol klant --administratie 1

Er is met opzet geen registratiepagina in de webinterface: accounts
ontstaan alleen hier, met de hand.
"""

import argparse
import getpass
import sys
from pathlib import Path

BASIS = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(BASIS))

from boekhouding import (  # noqa: E402
    lees_gebruikers,
    maak_administratie,
    maak_gebruiker,
    maak_tabellen,
    maak_verbinding,
)
from boekhouding.gebruikers import normaliseer_email  # noqa: E402

GEGEVENS = BASIS / "gegevens"


def vraag_wachtwoord() -> str | None:
    """Vraag het wachtwoord twee keer; geef None als het niet klopt."""
    eerste = getpass.getpass("Wachtwoord (minstens 10 tekens): ")
    if len(eerste) < 10:
        print("Te kort: minstens 10 tekens.")
        return None
    tweede = getpass.getpass("Nog een keer: ")
    if eerste != tweede:
        print("De twee wachtwoorden zijn niet hetzelfde.")
        return None
    return eerste


def main(argv: list[str] | None = None) -> int:
    ontleder = argparse.ArgumentParser(description=__doc__)
    ontleder.add_argument("--email", required=True)
    ontleder.add_argument("--naam", required=True)
    ontleder.add_argument("--rol", default="eigenaar", choices=("eigenaar", "klant"))
    ontleder.add_argument(
        "--administratie", type=int, action="append", default=[],
        help="administratie-id waar deze klant bij mag (mag meerdere keren)",
    )
    ontleder.add_argument(
        "--db", default=str(GEGEVENS / "boekhouding.sqlite"),
        help="pad naar de database",
    )
    keuzes = ontleder.parse_args(argv)

    if keuzes.rol == "klant" and not keuzes.administratie:
        print("Een klant zonder administratie kan nergens bij. "
              "Geef minstens één --administratie mee.")
        return 1

    Path(keuzes.db).parent.mkdir(parents=True, exist_ok=True)
    conn = maak_verbinding(keuzes.db)
    try:
        maak_tabellen(conn)
        adres = normaliseer_email(keuzes.email)
        bestaat = conn.execute(
            "SELECT 1 FROM gebruikers WHERE email = ?", (adres,)
        ).fetchone()
        if bestaat:
            print(f"Er is al een account met {adres}.")
            return 1

        # Zonder administratie kan zelfs de eigenaar nergens heen; is de
        # database nog leeg, dan zetten we er meteen een neer.
        aantal = conn.execute("SELECT count(*) FROM administraties").fetchone()[0]
        if aantal == 0:
            maak_administratie(conn, "Mijn eenmanszaak")
            print("Er was nog geen administratie; 'Mijn eenmanszaak' aangemaakt.")

        for administratie_id in keuzes.administratie:
            aanwezig = conn.execute(
                "SELECT 1 FROM administraties WHERE id = ?", (administratie_id,)
            ).fetchone()
            if not aanwezig:
                print(f"Administratie {administratie_id} bestaat niet.")
                return 1

        wachtwoord = vraag_wachtwoord()
        if wachtwoord is None:
            return 1

        maak_gebruiker(
            conn, adres, keuzes.naam, wachtwoord, rol=keuzes.rol,
            administraties=keuzes.administratie or None,
            door="script maak_eigenaar",
        )
        # Het wachtwoord staat alleen nog in deze variabele; verder is er
        # niets van bewaard, ook niet hieronder in de melding.
        print(f"\nAccount aangemaakt: {adres} ({keuzes.rol}).")
        if keuzes.rol == "klant":
            print("Toegang tot administratie(s): "
                  + ", ".join(str(i) for i in keuzes.administratie))
        print("\nAlle accounts nu:")
        for gebruiker in lees_gebruikers(conn):
            waar = (", administratie " + ", ".join(str(i) for i in gebruiker.administraties)
                    if gebruiker.administraties else "")
            print(f"  {gebruiker.email}  ({gebruiker.rol}{waar})")
        print("\nInloggen kan op http://127.0.0.1:8000/inloggen")
        return 0
    finally:
        conn.close()


if __name__ == "__main__":
    raise SystemExit(main())
