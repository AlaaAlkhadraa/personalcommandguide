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
| `07-fix-module3-review.md` | Fixes: foutafhandeling, promptversie, verzonnen, model instelbaar |
| `08-eval-tegen-de-api.md` | SDK-aanroep geverifieerd, datumfout gevonden, runs geblokkeerd op de sleutel |
| `09-module4-ubl-efacturen.md` | Module 4: UBL / e-facturen, routering op inhoud, XXE-bescherming |
| `10-fix-module4-review.md` | Fixes: groottelimiet vóór het parsen, UTF-16 herkennen |
| `11-module5-webinterface.md` | CLAUDE.md aangevuld + Module 5: webinterface fase 1 |
| `12-fix-module5-idor.md` | Fix: elk adres hoort bij één administratie (404, niet 403) |
| `13-webinterface-draaien.md` | De webinterface starten met testdata: adres, telefoon, elk scherm |
| `14-efactuur-leesbaar.md` | Fix: een e-factuur leesbaar in het reviewscherm, ruwe XML achter een knop |
| `CODE-COMPLEET.md` | de volledige actuele code, uitleg en tests |
| `testfacturen-overzicht.json` | grondwaarheid bij de 10 testfacturen |
| `schermen/` | schermafbeeldingen van de draaiende webinterface |
| `boekhouding-compleet.zip` | alles in één archief: code, tests, facturen, rapporten |

## Waar het nu staat

- **270 pytest-tests, allemaal groen.** De testsuite doet nooit een echte
  API-aanroep.
- **Module 1** — schema met Decimal-bedragen, alle rekencontroles, datum- en
  duplicaatcheck. Elke fout wordt `review_nodig` met reden, nooit een
  exception die data weggooit.
- **Module 2** — tekst uit PDF's, originelen bewaard onder hun sha256-hash,
  alleen-lezen, nooit overschreven of verwijderd. Multi-administratie en
  audit trail overal.
- **Module 3** — het model leest en stelt voor, de code rekent en controleert,
  de mens beslist. Twee invoerpaden (tekst en beeld), verplichte zekerheid per
  veld, nooit gokken. Een storing bij de dienst breekt een stapel facturen niet
  af: elke fout wordt een reden. Model en promptversie staan in de audit trail.
- **Module 4** — e-facturen (UBL) worden rechtstreeks uitgelezen: de velden
  staan als XML in het bestand, dus niets te raden en gratis. Routering kijkt
  naar de werkelijke inhoud, een PDF met ingebedde e-factuur gaat langs het
  XML-pad, en XML wordt veilig gelezen (geen DTD, dus geen XXE).
- **Module 5** — webinterface (FastAPI + Jinja2, mobiel-eerst, lokaal, geen
  login): overzicht met review bovenaan, uploaden met camera, en het
  reviewscherm met het origineel links en de bewerkbare velden rechts.
  Goedkeuren kan alleen zonder openstaande punten. Alle adressen hangen
  onder een administratie en worden op eigenaarschap gecontroleerd (404,
  niet 403), zodat klantaccounts er later veilig op kunnen. Hij is echt
  gestart en scherm voor scherm nagelopen: `scripts/vul_testdata.py` zet
  de administratie en zes e-facturen klaar, `scripts/start_webinterface.py`
  start hem (met `--netwerk` ook bereikbaar vanaf je telefoon). Een e-factuur
  wordt links leesbaar getoond — velden onder elkaar met hun UBL-herkomst en
  de factuurregels — met de ruwe XML achter een knop; het bewaarde bestand
  verandert niet.
- **Testmateriaal** — 10 facturen die deterministisch worden gegenereerd,
  inclusief de lastige gevallen (korting, creditnota, scan zonder tekstlaag,
  ontbrekend factuurnummer, bedragen die niet kloppen).

## Wat nog openstaat

1. **De eval is nooit tegen de echte API gedraaid.** De SDK-aanroep is wél
   geverifieerd (tegen een lokale endpoint, met de echte SDK) en de
   kostenberekening werkt, maar er is geen API-sleutel in deze omgeving. Zet
   een `.env` neer en de vier commando's in `08-eval-tegen-de-api.md` geven de
   eerste scores voor opus, sonnet en haiku.
2. **Weesbestanden.** Crasht het proces tussen het kopiëren van een origineel
   en de databaseregel, dan blijft er een bestand zonder registratie achter.
   Geen dataverlies; een opruimfunctie die rapporteert (nooit verwijdert) is
   nog niet gebouwd.
3. **Geen documentsoort.** Een creditnota is nu een factuur met negatieve
   bedragen. Er is geen veld "dit is een creditnota" en geen verwijzing naar
   de oorspronkelijke factuur.
4. **btw "vrijgesteld" en "verlegd"** staan in CLAUDE.md maar zijn niet
   gebouwd; het schema kent alleen 21, 9 en 0.
5. **DOCX, XLSX en CSV** staan in de routeringssectie van CLAUDE.md maar
   worden nog als onbekende soort afgewezen.
6. **Administratietype uitbreiden vereist een migratie** — SQLite kan een
   CHECK-constraint niet aanpassen met `ALTER TABLE`.
