#!/usr/bin/env python3
"""Eval: haal alle testfacturen door de extractie en tel de score.

    python scripts/eval_extractie.py                       # vraagt bevestiging
    python scripts/eval_extractie.py --ja                  # meteen draaien
    python scripts/eval_extractie.py --ja 01 07            # alleen deze nummers
    python scripts/eval_extractie.py --ja --model=claude-haiku-4-5

Met --model leg je een goedkoper model naast het standaardmodel. Elk model
krijgt zijn eigen rapportbestand, zodat twee runs elkaar niet overschrijven.

Dit script staat buiten pytest en doet WEL echte API-aanroepen: één per
document, dus tien keer betalen bij een volledige run. Daarom vraagt het
eerst om bevestiging.

Per veld wordt geteld:
  verzonnen  het document heeft dit veld NIET, maar het model vulde toch iets
             in. Dit is de gevaarlijkste uitkomst en staat daarom bovenaan het
             rapport: de validatie van module 1 vangt hem niet. Een verzonnen
             factuurnummer telt gewoon op, klopt met de btw en glipt als
             "gevalideerd" langs elke controle. Factuur 09 (zonder
             factuurnummer) is hiervoor de testcase.
  fout       er staat een andere waarde dan op het document
  gemist     het document heeft de waarde wel, het model geeft niets terug
  correct    de waarde komt overeen met de grondwaarheid in overzicht.json
             (ook: allebei leeg — dan is "niets gevonden" het juiste antwoord)

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
from boekhouding.ai_extractie import VELDEN, standaard_model  # noqa: E402

TESTMAP = BASIS / "tests" / "testfacturen"
BEDRAGVELDEN = {"bedrag_excl", "btw_percentage", "btw_bedrag", "bedrag_incl"}

# Volgorde waarin de uitkomsten worden gerapporteerd: het gevaarlijkst eerst.
OORDELEN = ("verzonnen", "fout", "gemist", "correct")

# Prijs per miljoen tokens (invoer, uitvoer), in dollars. Dit is een
# momentopname en géén bron van waarheid: controleer hem tegen
# anthropic.com/pricing voordat je er een besluit op baseert. Staat een
# model er niet bij, dan worden alleen de tokens gerapporteerd.
PRIJZEN = {
    "claude-opus-5": (5.00, 25.00),
    "claude-sonnet-5": (2.00, 10.00),
    "claude-haiku-4-5": (1.00, 5.00),
}


def kosten(model: str, invoer_tokens: int, uitvoer_tokens: int):
    """Bereken de kosten in dollars, of None als de prijs onbekend is."""
    if model not in PRIJZEN:
        return None
    invoerprijs, uitvoerprijs = PRIJZEN[model]
    return invoer_tokens / 1_000_000 * invoerprijs + (
        uitvoer_tokens / 1_000_000 * uitvoerprijs
    )


def rapportpad(model: str) -> Path:
    veilig = "".join(t if t.isalnum() or t in "-_." else "-" for t in model)
    return TESTMAP / f"eval-rapport-{veilig}.json"


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
        # Het model vulde iets in wat er niet staat. Dit komt níét door de
        # validatie aan het licht, want een verzonnen waarde kan gewoon
        # kloppen met de rest van de factuur.
        return "verzonnen", f"'{gelezen}' staat niet op het document"
    if heeft_verwacht and not heeft_gelezen:
        return "gemist", f"verwacht '{verwacht}', niets teruggekregen"
    if gelijk(veld, gelezen, verwacht):
        return "correct", ""
    return "fout", f"gelezen '{gelezen}', verwacht '{verwacht}'"


def main() -> int:
    argumenten = sys.argv[1:]
    bevestigd = "--ja" in argumenten
    nummers = [a for a in argumenten if not a.startswith("--")]
    gekozen_model = next(
        (a.split("=", 1)[1] for a in argumenten if a.startswith("--model=")),
        None,
    ) or standaard_model()

    overzicht = json.loads((TESTMAP / "overzicht.json").read_text(encoding="utf-8"))
    if nummers:
        overzicht = [
            r for r in overzicht if any(r["bestand"].startswith(n) for n in nummers)
        ]

    if not sleutel_aanwezig():
        print("Geen ANTHROPIC_API_KEY gevonden (zie .env.voorbeeld).")
        return 1

    print(f"Eval van {len(overzicht)} document(en) met {gekozen_model}.")
    print(f"Dit doet {len(overzicht)} echte, betaalde API-aanroepen.")
    if not bevestigd:
        antwoord = input("Doorgaan? [j/N] ").strip().lower()
        if antwoord not in ("j", "ja", "y", "yes"):
            print("Afgebroken; er is niets aangeroepen.")
            return 0
    print()

    tellingen = {naam: 0 for naam in OORDELEN}
    invoer_tokens = uitvoer_tokens = 0
    status_goed = 0
    regels = []

    for verwacht in overzicht:
        pad = TESTMAP / verwacht["bestand"]
        resultaat = extraheer_factuur(
            pad, model=gekozen_model, vandaag=date.today()
        )

        oordelen = {}
        for veld in VELDEN:
            gelezen = None
            if resultaat.extractie is not None:
                gelezen = getattr(resultaat.extractie, veld).waarde
            oordeel, toelichting = beoordeel_veld(veld, gelezen, verwacht.get(veld))
            tellingen[oordeel] += 1
            oordelen[veld] = {"oordeel": oordeel, "toelichting": toelichting}

        invoer_tokens += resultaat.invoer_tokens
        uitvoer_tokens += resultaat.uitvoer_tokens
        statusklopt = resultaat.status == verwacht["verwachte_status"]
        status_goed += int(statusklopt)

        goed = sum(1 for o in oordelen.values() if o["oordeel"] == "correct")
        vinkje = "OK " if statusklopt else "MIS"
        print(
            f"{vinkje} {verwacht['bestand']:<34} velden {goed}/{len(VELDEN)}  "
            f"status {resultaat.status} (verwacht {verwacht['verwachte_status']})"
        )
        for soort in OORDELEN:
            if soort == "correct":
                continue
            for veld, oordeel in oordelen.items():
                if oordeel["oordeel"] == soort:
                    merk = "!!" if soort == "verzonnen" else "  "
                    print(
                        f"    {merk} {soort:<10} {veld}: {oordeel['toelichting']}"
                    )

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
    if tellingen["verzonnen"]:
        print(
            f"!! VERZONNEN: {tellingen['verzonnen']} veld(en) ingevuld die niet "
            f"op het document staan."
        )
        print(
            "   Dit is de gevaarlijkste uitkomst: de validatie vangt hem niet, "
            "want een"
        )
        print(
            "   verzonnen waarde kan prima kloppen met de rest van de factuur.\n"
        )
    else:
        print("Verzonnen: 0 — het model heeft niets ingevuld dat er niet staat.\n")

    print(f"Velden   : {totaal} beoordeeld")
    for naam in OORDELEN:
        deel = tellingen[naam] / totaal * 100 if totaal else 0
        print(f"  {naam:<10} {tellingen[naam]:>3}  ({deel:.0f}%)")
    print(f"Status   : {status_goed}/{len(overzicht)} documenten in de juiste bak")
    score = tellingen["correct"] / totaal * 100 if totaal else 0
    print(f"Score    : {score:.1f}% velden correct")

    print(f"Tokens   : {invoer_tokens} in, {uitvoer_tokens} uit")
    prijs = kosten(gekozen_model, invoer_tokens, uitvoer_tokens)
    if prijs is None:
        print(f"Kosten   : onbekend — geen prijs bekend voor {gekozen_model}")
    else:
        per_stuk = prijs / len(overzicht) if overzicht else 0
        print(f"Kosten   : ${prijs:.4f} voor deze run (${per_stuk:.4f} per factuur)")

    rapport = rapportpad(gekozen_model)
    rapport.write_text(
        json.dumps(
            {
                "model": gekozen_model,
                "verzonnen": tellingen["verzonnen"],
                "invoer_tokens": invoer_tokens,
                "uitvoer_tokens": uitvoer_tokens,
                "kosten_dollar": kosten(
                    gekozen_model, invoer_tokens, uitvoer_tokens
                ),
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
    print(f"\nRapport: {rapport}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
