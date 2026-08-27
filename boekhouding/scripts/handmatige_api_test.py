#!/usr/bin/env python3
"""Eén echte API-aanroep, met de hand te draaien.

    python scripts/handmatige_api_test.py [pad-naar-factuur]

Dit script staat bewust buiten pytest: de testsuite doet nooit een echte
aanroep. Gebruik dit om te controleren of de sleutel werkt en of het
model op een echt document doet wat je verwacht.

Er wordt één document verwerkt en dus één keer betaald. De API-sleutel
komt uit .env en wordt hier nooit afgedrukt.
"""

import sys
from datetime import date
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

from boekhouding import extraheer_factuur, sleutel_aanwezig  # noqa: E402
from boekhouding.ai_extractie import MODEL, VELDEN  # noqa: E402

STANDAARD = (
    Path(__file__).resolve().parent.parent
    / "tests" / "testfacturen" / "01-standaard-21procent.pdf"
)


def main() -> int:
    pad = Path(sys.argv[1]) if len(sys.argv) > 1 else STANDAARD

    if not sleutel_aanwezig():
        print("Geen ANTHROPIC_API_KEY gevonden.")
        print("Maak een .env-bestand naast de map boekhouding/ met:")
        print("    ANTHROPIC_API_KEY=...jouw sleutel...")
        print("Zie .env.voorbeeld. Dat bestand staat in .gitignore.")
        return 1

    if not pad.is_file():
        print(f"Bestand niet gevonden: {pad}")
        return 1

    print(f"Document : {pad.name}")
    print(f"Model    : {MODEL}")
    print("Dit doet één echte, betaalde API-aanroep.\n")

    resultaat = extraheer_factuur(pad, vandaag=date.today())

    print(f"Invoerpad: {resultaat.invoerpad}")
    print(f"Status   : {resultaat.status}\n")

    if resultaat.extractie is not None:
        breedte = max(len(veld) for veld in VELDEN)
        for veld in VELDEN:
            gegeven = getattr(resultaat.extractie, veld)
            waarde = "(niets gevonden)" if gegeven.waarde is None else gegeven.waarde
            regel = f"  {veld:<{breedte}}  {waarde:<28} [{gegeven.zekerheid}]"
            if gegeven.reden:
                regel += f"  {gegeven.reden}"
            print(regel)

    if resultaat.redenen:
        print("\nRedenen voor review:")
        for reden in resultaat.redenen:
            print(f"  - {reden}")

    print(f"\nRuwe modelrespons ({len(resultaat.ruwe_respons)} tekens):")
    print(resultaat.ruwe_respons[:600])
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
