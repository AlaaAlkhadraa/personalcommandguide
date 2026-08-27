#!/usr/bin/env python3
"""Start de webinterface lokaal.

    python scripts/start_webinterface.py

Daarna staat hij op http://127.0.0.1:8000 — ook te openen op je telefoon
als die op hetzelfde wifi-netwerk zit (gebruik dan het IP-adres van deze
computer in plaats van 127.0.0.1).

Fase 1 heeft geen login. Draai hem dus alleen op je eigen netwerk.
"""

import sys
from pathlib import Path

BASIS = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(BASIS))

import uvicorn  # noqa: E402

from boekhouding.web import maak_app  # noqa: E402

GEGEVENS = BASIS / "gegevens"


def main() -> int:
    GEGEVENS.mkdir(exist_ok=True)
    app = maak_app(str(GEGEVENS / "boekhouding.sqlite"), str(GEGEVENS / "opslag"))
    print(f"Database  : {GEGEVENS / 'boekhouding.sqlite'}")
    print(f"Originelen: {GEGEVENS / 'opslag'}")
    print("Open http://127.0.0.1:8000 in je browser. Stoppen met Ctrl-C.\n")
    uvicorn.run(app, host="127.0.0.1", port=8000, log_level="warning")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
