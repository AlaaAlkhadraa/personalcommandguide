# Boekhoudsysteem voor Nederlandse zzp'ers — alle opleveringen

كل شي بهالمجلد. ما في مجلدات فرعية — كل تسليمة ملف واحد، والكود الكامل
بملف `CODE-COMPLEET.md` وبينحدّث كل مرة.

Branch: `claude/nl-accounting-invoice-module-f2vzr3`

## De bestanden in deze map

| Bestand | Wat erin staat |
|---|---|
| `00-OVERZICHT.md` | dit bestand |
| `01-module1-facturen.md` | Module 1: factuur-schema, validatie, audit trail |
| `02-fix-ambigu-bedrag.md` | Fix: `"1.250"` is ambigu → review, nooit gokken |
| `03-module2-pdf-extractie.md` | Module 2: PDF-tekstextractie en bewaarplicht |
| `04-fix-module2-review.md` | Fixes: unieke tijdelijke naam, extensie-witte-lijst |
| `05-testmateriaal-facturen.md` | 10 synthetische Nederlandse factuurdocumenten |
| `06-module3-ai-extractie.md` | Module 3: AI-extractie met zekerheid per veld |
| `CODE-COMPLEET.md` | de volledige actuele code, uitleg en tests |
| `testfacturen-overzicht.json` | grondwaarheid bij de 10 testfacturen |

## Waar het nu staat

- **104 pytest-tests, allemaal groen.** De testsuite doet nooit een echte
  API-aanroep.
- **Module 1** — schema met Decimal-bedragen, alle rekencontroles, datum- en
  duplicaatcheck. Elke fout wordt `review_nodig` met reden, nooit een
  exception die data weggooit.
- **Module 2** — tekst uit PDF's, originelen bewaard onder hun sha256-hash,
  alleen-lezen, nooit overschreven of verwijderd. Multi-administratie en
  audit trail overal.
- **Module 3** — het model leest en stelt voor, de code rekent en controleert,
  de mens beslist. Twee invoerpaden (tekst en beeld), verplichte zekerheid per
  veld, nooit gokken.
- **Testmateriaal** — 10 facturen die deterministisch worden gegenereerd,
  inclusief de lastige gevallen (korting, creditnota, scan zonder tekstlaag,
  ontbrekend factuurnummer, bedragen die niet kloppen).

## Wat nog openstaat

1. **De eval is nooit gedraaid.** Hij is gebouwd en de vergelijkingslogica is
   getest, maar er is een echte API-sleutel voor nodig. Zet een `.env` neer en
   `python scripts/eval_extractie.py` geeft de eerste score.
2. **Weesbestanden.** Crasht het proces tussen het kopiëren van een origineel
   en de databaseregel, dan blijft er een bestand zonder registratie achter.
   Geen dataverlies; een opruimfunctie die rapporteert (nooit verwijdert) is
   nog niet gebouwd.
3. **Geen documentsoort.** Een creditnota is nu een factuur met negatieve
   bedragen. Er is geen veld "dit is een creditnota" en geen verwijzing naar
   de oorspronkelijke factuur.
4. **Administratietype uitbreiden vereist een migratie** — SQLite kan een
   CHECK-constraint niet aanpassen met `ALTER TABLE`.
