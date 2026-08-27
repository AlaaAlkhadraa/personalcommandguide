"""Instellingen uit een lokaal .env-bestand lezen.

De API-sleutel hoort nergens anders te staan dan in .env, en dat bestand
staat in .gitignore. Deze module leest hem in het geheugen en geeft hem
nooit terug in een foutmelding, log of __repr__.

Bewust een eigen mini-lader in plaats van python-dotenv: de stack ligt
vast (Python, SQLite, Pydantic, pytest, plus de Anthropic-SDK) en dit is
tien regels.
"""

import os
from pathlib import Path

SLEUTELNAAM = "ANTHROPIC_API_KEY"


def laad_env(pad: str | Path = ".env") -> int:
    """Lees KEY=VALUE-regels uit .env in de omgeving; geef het aantal.

    Een variabele die al in de omgeving staat wordt niet overschreven,
    zodat een expliciet gezette waarde altijd voorgaat.
    """
    pad = Path(pad)
    if not pad.is_file():
        return 0

    aantal = 0
    for regel in pad.read_text(encoding="utf-8").splitlines():
        regel = regel.strip()
        if not regel or regel.startswith("#") or "=" not in regel:
            continue
        naam, _, waarde = regel.partition("=")
        naam = naam.strip()
        waarde = waarde.strip().strip('"').strip("'")
        if naam and naam not in os.environ:
            os.environ[naam] = waarde
            aantal += 1
    return aantal


def api_sleutel(env_pad: str | Path = ".env") -> str | None:
    """Geef de API-sleutel, of None als hij niet is ingesteld.

    De waarde wordt nooit gelogd of in een foutmelding gezet.
    """
    laad_env(env_pad)
    sleutel = os.environ.get(SLEUTELNAAM, "").strip()
    return sleutel or None


def sleutel_aanwezig(env_pad: str | Path = ".env") -> bool:
    """Alleen ja of nee — handig voor scripts, zonder de waarde te tonen."""
    return api_sleutel(env_pad) is not None
