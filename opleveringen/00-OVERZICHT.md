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
| `15-module6-grootboek-btw.md` | Module 6: grootboek, dubbel boekhouden en de btw-aangifte per kwartaal |
| `16-volledigheidscontroles.md` | Signalen over wat er níét is aangeleverd: waarschuwen, nooit blokkeren |
| `17-module7-bank-afletteren.md` | Module 7: MT940 en CAMT.053 inlezen en afletteren tegen de facturen |
| `18-fix-module7-richting.md` | Fix: een onbekende richting geeft nooit hoge zekerheid |
| `CODE-COMPLEET.md` | de volledige actuele code, uitleg en tests |
| `testfacturen-overzicht.json` | grondwaarheid bij de 10 testfacturen |
| `schermen/` | schermafbeeldingen van de draaiende webinterface |
| `boekhouding-compleet.zip` | alles in één archief: code, tests, facturen, rapporten |

## Waar het nu staat

- **450 pytest-tests, allemaal groen.** De testsuite doet nooit een echte
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
- **Module 6** — het grootboek en de btw. Een goedgekeurde factuur wordt een
  boeking die exact in balans moet zijn, zonder de cent speling die een
  factuur wél krijgt. Boekingen worden nooit gewijzigd of verwijderd: een fout
  gaat er met een tegenboeking uit. Het rekeningschema staat per jaar in een
  configbestand. De btw-aangifte rekent 1a, 1b, 5a, 5b en het saldo uit met
  vaste formules, en rekent níéts uit zolang er in dat kwartaal nog een
  factuur open staat — dan krijg je de lijst met wat er mist. Het resultaat is
  een voorstel; indienen doet de eigenaar zelf.
- **Module 7** — bankafschriften. MT940 en CAMT.053 worden allebei gelezen,
  op inhoud herkend en niet op bestandsnaam; een kapotte regel breekt de
  import niet af en hetzelfde afschrift twee keer inlezen voegt niets toe.
  Afletteren gaat van streng naar los: nummer én bedrag is hoge zekerheid,
  bedrag én naam is lage zekerheid, en een deelbetaling of verzamelbetaling
  wordt nooit automatisch gekoppeld. Pas bij bevestiging ontstaat de boeking
  (crediteuren tegen bank, of andersom bij ontvangst). Is niet vast te stellen
  of een factuur inkoop of verkoop is, dan blijft hij kandidaat maar krijgt het
  voorstel nooit hoge zekerheid.
- **Volledigheidssignalen** — blokkeren kan alleen op facturen die er zijn. Een
  factuur die nooit is aangeleverd staat nergens, en dan klopt de aangifte
  ogenschijnlijk gewoon. Daarom drie controles die het patroon bekijken: een
  leverancier die elke maand kwam en nu ontbreekt, een gat in een oplopende
  factuurnummering, en een aantal facturen dat afwijkt van de vorige kwartalen.
  Ze staan als vragen op het scherm en houden niets tegen.
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
6. **Een banktransactie zonder factuur blijft open staan.** Bankkosten, een
   privé-opname of een abonnement zonder factuur kunnen nog niet rechtstreeks
   op een grootboekrekening worden geboekt.
7. **Ontkoppelen kan niet.** Een verkeerde koppeling zet je recht met een
   tegenboeking; de koppeling zelf blijft staan.
8. **Deelbetalingen splitsen kan niet.** Je kunt de transactie met de hand aan
   één factuur koppelen, maar het restant blijft onzichtbaar.
9. **De RGS-codes zijn niet geverifieerd.** Ze zijn met de hand samengesteld
   en niet vergeleken met de officiële RGS-lijst. Het systeem boekt op het
   veld `code` (4100, 8000, 1600); `rgs_code` is alleen een verwijzing.
   Controleer die kolom voordat je er een export op baseert.
10. **Btw-rubriek 1e, 2a en 3a zijn er niet.** Omzet met 0%, vrijgesteld of
   verlegd wordt wél gemeld op het aangiftescherm, maar niet in een rubriek
   gezet.
11. **Bedragen worden niet afgerond naar hele euro's.** De Belastingdienst
   vraagt hele euro's in de aangifte; het voorstel toont centen.
12. **Administratietype uitbreiden vereist een migratie** — SQLite kan een
   CHECK-constraint niet aanpassen met `ALTER TABLE`.
