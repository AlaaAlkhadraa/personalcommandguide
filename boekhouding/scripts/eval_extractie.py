#!/usr/bin/env python3
"""Eval: haal alle testfacturen door de extractie en tel de score.

    python scripts/eval_extractie.py            # vraagt eerst om bevestiging
    python scripts/eval_extractie.py --ja       # meteen draaien
    python scripts/eval_extractie.py --ja 01 07 # alleen deze nummers

Dit script staat buiten pytest en doet WEL echte API-aanroepen: één per
document, dus tien keer betalen bij een volledige run. Daarom vraagt het
eerst om bevestiging.

Per veld wordt geteld:
  correct  de waarde komt overeen met de grondwaarheid in overzicht.json
           (ook: allebei leeg — dan is "niets gevonden" het juiste antwoord)
  fout     er staat een andere waarde dan verwacht, of het model heeft een
           waarde ingevuld die niet op het document staat (verzonnen)
  gemist   het document heeft de waarde wel, het model geeft niets terug

Bedragen worden als Decimal vergeleken (dus "1.250,00" telt gelijk aan
"1250.00"), datums als datum (dus "12-07-2026" telt gelijk aan
"2026-07-12"). Zo meet de eval de inhoud en niet de schrijfwijze.
"""

import json
import sys
from datetime import date, datetime
from decimal import Decimal, InvalidOperation
from pathlib import Path

BASIS = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(BASIS))

from boekhouding import extraheer_factuur, sleutel_aanwezig  # noqa: E402
from boekhouding.ai_extractie import MODEL, VELDEN  # noqa: E402

TESTMAP = BASIS / "tests" / "testfacturen"
RAPPORT = BASIS / "tests" / "testfacturen" / "eval-rapport.json"
BEDRAGVELDEN = {"bedrag_excl", "btw_percentage", "btw_bedrag", "bedrag_incl"}


def als_decimal(waarde: str) -> Decimal | None:
    """Lees een bedrag in Nederlandse of Engelse notatie."""
    tekst = str(waarde).strip().replace(" ", "")
    if "." in tekst and "," in tekst:
        tekst = tekst.replace(".", "").replace(",", ".")
    else:
        tekst = tekst.replace(",", ".")
    try:
        return Decimal(tekst)
    except InvalidOperation:
        return None


def als_datum(waarde: str) -> date | None:
    """Lees een datum in JJJJ-MM-DD of DD-MM-JJJJ."""
    tekst = str(waarde).strip()
    for vorm in ("%Y-%m-%d", "%d-%m-%Y"):
        try:
            return datetime.strptime(tekst, vorm).date()
        except ValueError:
            continue
    return None


def gelijk(veld: str, gelezen: str, verwacht: str) -> bool:
    if veld in BEDRAGVELDEN:
        a, b = als_decimal(gelezen), als_decimal(verwacht)
        return a is not None and b is not None and a == b
    if veld == "factuurdatum":
        a, b = als_datum(gelezen), als_datum(verwacht)
        return a is not None and a == b
    return gelezen.strip().lower() == str(verwacht).strip().lower()


def beoordeel_veld(veld: str, gelezen, verwacht) -> tuple[str, str]:
    """Geef (oordeel, toelichting) voor één veld."""
    heeft_gelezen = gelezen is not None and str(gelezen).strip() != ""
    heeft_verwacht = verwacht is not None and str(verwacht).strip() != ""

    if not heeft_verwacht and not heeft_gelezen:
        return "correct", "staat niet op het document en is niet ingevuld"
    if not heeft_verwacht and heeft_gelezen:
        return "fout", f"verzonnen: '{gelezen}' staat niet op het document"
    if heeft_verwacht and not heeft_gelezen:
        return "gemist", f"verwacht '{verwacht}', niets teruggekregen"
    if gelijk(veld, gelezen, verwacht):
        return "correct", ""
    return "fout", f"gelezen '{gelezen}', verwacht '{verwacht}'"


def main() -> int:
    argumenten = sys.argv[1:]
    bevestigd = "--ja" in argumenten
    nummers = [a for a in argumenten if not a.startswith("--")]

    overzicht = json.loads((TESTMAP / "overzicht.json").read_text(encoding="utf-8"))
    if nummers:
        overzicht = [
            r for r in overzicht if any(r["bestand"].startswith(n) for n in nummers)
        ]

    if not sleutel_aanwezig():
        print("Geen ANTHROPIC_API_KEY gevonden (zie .env.voorbeeld).")
        return 1

    print(f"Eval van {len(overzicht)} document(en) met {MODEL}.")
    print(f"Dit doet {len(overzicht)} echte, betaalde API-aanroepen.")
    if not bevestigd:
        antwoord = input("Doorgaan? [j/N] ").strip().lower()
        if antwoord not in ("j", "ja", "y", "yes"):
            print("Afgebroken; er is niets aangeroepen.")
            return 0
    print()

    tellingen = {"correct": 0, "fout": 0, "gemist": 0}
    status_goed = 0
    regels = []

    for verwacht in overzicht:
        pad = TESTMAP / verwacht["bestand"]
        resultaat = extraheer_factuur(pad, vandaag=date.today())

        oordelen = {}
        for veld in VELDEN:
            gelezen = None
            if resultaat.extractie is not None:
                gelezen = getattr(resultaat.extractie, veld).waarde
            oordeel, toelichting = beoordeel_veld(veld, gelezen, verwacht.get(veld))
            tellingen[oordeel] += 1
            oordelen[veld] = {"oordeel": oordeel, "toelichting": toelichting}

        statusklopt = resultaat.status == verwacht["verwachte_status"]
        status_goed += int(statusklopt)

        goed = sum(1 for o in oordelen.values() if o["oordeel"] == "correct")
        vinkje = "OK " if statusklopt else "MIS"
        print(
            f"{vinkje} {verwacht['bestand']:<34} velden {goed}/{len(VELDEN)}  "
            f"status {resultaat.status} (verwacht {verwacht['verwachte_status']})"
        )
        for veld, oordeel in oordelen.items():
            if oordeel["oordeel"] != "correct":
                print(f"      {oordeel['oordeel']:<8} {veld}: {oordeel['toelichting']}")

        regels.append(
            {
                "bestand": verwacht["bestand"],
                "invoerpad": resultaat.invoerpad,
                "status": resultaat.status,
                "verwachte_status": verwacht["verwachte_status"],
                "status_klopt": statusklopt,
                "velden": oordelen,
                "redenen": resultaat.redenen,
            }
        )

    totaal = sum(tellingen.values())
    print("\n" + "=" * 66)
    print(f"Velden   : {totaal} beoordeeld")
    for naam in ("correct", "fout", "gemist"):
        deel = tellingen[naam] / totaal * 100 if totaal else 0
        print(f"  {naam:<8} {tellingen[naam]:>3}  ({deel:.0f}%)")
    print(f"Status   : {status_goed}/{len(overzicht)} documenten in de juiste bak")
    score = tellingen["correct"] / totaal * 100 if totaal else 0
    print(f"Score    : {score:.1f}% velden correct")

    RAPPORT.write_text(
        json.dumps(
            {
                "model": MODEL,
                "tellingen": tellingen,
                "score_procent": round(score, 1),
                "status_goed": status_goed,
                "documenten": regels,
            },
            ensure_ascii=False,
            indent=2,
        )
        + "\n",
        encoding="utf-8",
    )
    print(f"\nRapport: {RAPPORT}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
