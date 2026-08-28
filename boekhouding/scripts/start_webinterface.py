#!/usr/bin/env python3
"""Start de webinterface lokaal.

    python scripts/start_webinterface.py

Daarna staat hij op http://127.0.0.1:8000 — alleen op deze computer.

Wil je hem ook op je telefoon openen (zelfde wifi), start hem dan zo:

    python scripts/start_webinterface.py --netwerk

Dan luistert hij op alle netwerkkaarten en print hij het adres dat je op
je telefoon intypt. Inloggen is verplicht, dus wie het adres kent komt
er nog niet in — maar doe dit toch alleen op je eigen netwerk, niet op de
wifi van een café of een hotel.

Nog geen account? Maak er eerst een:

    python scripts/maak_eigenaar.py --email jij@example.nl --naam "Jouw naam"
"""

import socket
import sys
from pathlib import Path

BASIS = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(BASIS))

import uvicorn  # noqa: E402

from boekhouding import maak_verbinding  # noqa: E402
from boekhouding.web import maak_app  # noqa: E402

GEGEVENS = BASIS / "gegevens"
POORT = 8000


def eigen_ip() -> str | None:
    """Zoek het IP-adres van deze computer op het lokale netwerk.

    Er wordt niets verstuurd: een UDP-socket "verbinden" kiest alleen de
    netwerkkaart waarlangs verkeer naar buiten zou gaan. Lukt dat niet
    (geen netwerk), dan geven we None terug in plaats van te gokken.
    """
    peiler = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
    try:
        peiler.connect(("192.0.2.1", 9))  # adres uit het testbereik, gaat nergens heen
        return peiler.getsockname()[0]
    except OSError:
        return None
    finally:
        peiler.close()


def main() -> int:
    over_netwerk = "--netwerk" in sys.argv
    adres = "0.0.0.0" if over_netwerk else "127.0.0.1"

    GEGEVENS.mkdir(exist_ok=True)
    app = maak_app(str(GEGEVENS / "boekhouding.sqlite"), str(GEGEVENS / "opslag"))
    # Zonder account kom je nergens binnen; zeg dat meteen in plaats van
    # de gebruiker naar een inlogscherm te sturen waar niets werkt.
    conn = maak_verbinding(str(GEGEVENS / "boekhouding.sqlite"))
    try:
        accounts = conn.execute("SELECT count(*) FROM gebruikers").fetchone()[0]
    finally:
        conn.close()
    if accounts == 0:
        print("Er is nog geen account. Maak er eerst een:\n")
        print('  python scripts/maak_eigenaar.py --email jij@example.nl '
              '--naam "Jouw naam"\n')
        return 1

    print(f"Database  : {GEGEVENS / 'boekhouding.sqlite'}")
    print(f"Originelen: {GEGEVENS / 'opslag'}")
    print(f"\nOp deze computer : http://127.0.0.1:{POORT}")
    if over_netwerk:
        ip = eigen_ip()
        if ip:
            print(f"Op je telefoon   : http://{ip}:{POORT}   (zelfde wifi)")
        else:
            print("Op je telefoon   : geen netwerkadres gevonden, zit je op wifi?")
        print("\nLet op: alleen doen op je eigen netwerk.")
    else:
        print("Op je telefoon   : niet bereikbaar. Start met --netwerk als je dat wilt.")
    print("\nStoppen met Ctrl-C.\n")
    uvicorn.run(app, host=adres, port=POORT, log_level="warning")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
