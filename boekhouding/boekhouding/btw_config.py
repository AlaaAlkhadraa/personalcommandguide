"""Btw-tarieven per boekjaar, geladen uit config-bestanden.

Gouden regel: tarieven staan in een apart config-bestand per jaar en zijn
nooit hardcoded in de logica. Ontbreekt het bestand voor een jaar, dan is
dat een reden voor "review_nodig" — er wordt nooit een default gegokt.
"""

import json
from decimal import Decimal
from pathlib import Path

CONFIG_MAP = Path(__file__).parent / "config"


def btw_percentages_voor_jaar(jaar: int) -> set[Decimal] | None:
    """Geef de toegestane btw-percentages voor een boekjaar.

    Retourneert None als er geen config-bestand voor dat jaar bestaat;
    de aanroeper beslist dan zelf (review_nodig, nooit gokken).
    """
    pad = CONFIG_MAP / f"btw_{jaar}.json"
    if not pad.is_file():
        return None
    with open(pad, encoding="utf-8") as f:
        data = json.load(f)
    return {Decimal(p) for p in data["btw_percentages"]}
