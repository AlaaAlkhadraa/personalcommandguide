# Boekhouding — modules 1, 2 en 3

Boekhoudsysteem voor Nederlandse zzp'ers.
AI stelt voor, code valideert, mens beslist: niets wordt hier automatisch
geboekt — elke fout leidt tot status `review_nodig` met een leesbare reden.

- **Module 1** — factuur-schema, validatie en audit trail
- **Module 2** — PDF-tekstextractie en veilige bewaring van originelen
- **Module 3** — AI-extractie van factuurgegevens (het model stelt voor,
  de code controleert, de mens beslist)

## Installeren en testen

```
pip install -r requirements.txt
python -m pytest
```

## Wat zit erin (uitleg in eenvoudige taal)

### `boekhouding/btw_config.py` — de btw-tarieven per jaar

De toegestane btw-percentages (nu 21, 9 en 0) staan niet in de code maar in
een klein bestand per boekjaar: `config/btw_2024.json`, `btw_2025.json`,
`btw_2026.json`. Verandert de wet, dan maak je een nieuw bestand voor dat
jaar en blijft de code hetzelfde. De functie `btw_percentages_voor_jaar`
leest zo'n bestand. Bestaat er geen bestand voor het jaar van de factuur,
dan zegt de functie dat eerlijk (None) en wordt de factuur ter review
gelegd — er wordt nooit een tarief gegokt.

### `boekhouding/models.py` — het Factuur-schema

`Factuur` is het "formulier" dat beschrijft hoe een factuur eruit hoort te
zien: leverancier, factuurdatum, factuurnummer, bedrag exclusief btw,
btw-percentage, btw-bedrag en bedrag inclusief btw. Het schema bewaakt
drie dingen:

1. **Bedragen zijn altijd Decimal, nooit float.** Computers rekenen met
   floats net niet exact (0.1 + 0.2 is dan niet precies 0.3); met Decimal
   klopt elke cent. Komt er tóch een float binnen, dan wordt dat een
   review-reden. Nederlandse notatie wordt netjes begrepen: staat er
   punt én komma (`"1.250,00"`), dan is de punt duizendtalscheiding en
   de komma het decimaalteken; alleen een komma (`"100,00"`) of alleen
   een punt (`"100.00"`) is het decimaalteken. Eén uitzondering: alléén
   een punt gevolgd door precies 3 cijfers (`"1.250"`) is ambigu —
   dat kan 1250,00 (Nederlands duizendtal) of 1,250 (Engels decimaal)
   zijn. Dan wordt er niet gegokt maar wordt het `review_nodig`
   (Gouden regel 4); `"100.00"` en `"0.5"` blijven gewoon geldig.
2. **Het btw-percentage moet bestaan** in het config-bestand van het jaar
   van de factuurdatum (nu: 21, 9 of 0).
3. **Leverancier en factuurnummer mogen niet leeg zijn.**

`ValidatieResultaat` is het antwoord dat elke controle teruggeeft: de
status (`gevalideerd` of `review_nodig`), de lijst met redenen, de nette
factuur (als die te bouwen was) en altijd de originele input — er gaat
nooit data verloren.

### `boekhouding/validatie.py` — de controles

`valideer_factuur` neemt ruwe factuurgegevens (bijvoorbeeld straks uit
AI-extractie) en controleert ze stap voor stap. Belangrijk: deze functie
gooit **nooit** een exception naar buiten. Elke fout wordt een reden in
gewone taal, en alle fouten worden verzameld — niet alleen de eerste.

1. **Schema-controle**: past de data in het Factuur-formulier? Zo niet,
   dan per veld een reden en meteen status `review_nodig`.
2. **Optelling**: bedrag excl. + btw-bedrag moet het bedrag incl. zijn,
   met maximaal €0,02 speling voor afrondingen.
3. **Btw-berekening**: het btw-bedrag moet kloppen met percentage ×
   bedrag excl., ook met €0,02 speling. Deze sommen doet Python zelf met
   vaste formules — nooit een taalmodel.
4. **Datum**: niet in de toekomst en niet ouder dan 2 jaar. De peildatum
   is instelbaar (`vandaag=`) zodat tests niet van de echte klok afhangen.
5. **Duplicaat**: via een meegegeven controle-functie wordt gekeken of
   dezelfde leverancier + hetzelfde factuurnummer al in de database staat.

### `boekhouding/database.py` — opslag met audit trail

Drie SQLite-tabellen:

- **administraties** — elke boekhouding is een eigen administratie met een
  type (nu alleen `eenmanszaak`; de structuur is klaar voor later, maar
  BV-functionaliteit is bewust niet gebouwd).
- **facturen** — elke factuur hoort bij precies één administratie
  (`administratie_id`). Bedragen worden als tekst opgeslagen zodat de
  Decimal-waarde exact bewaard blijft. Ook de status, de review-redenen en
  de complete originele input staan erbij.
- **audit_log** — het logboek: wie-deed-wat-wanneer per veld, met oude en
  nieuwe waarde en een timestamp. Er is bewust géén verwijderfunctie.

De functies:

- `maak_verbinding` — opent de databaseverbinding én zet
  `PRAGMA foreign_keys = ON`. SQLite controleert foreign keys standaard
  niet; zonder deze pragma zou een factuur met een niet-bestaand
  `administratie_id` gewoon worden opgeslagen. Gebruik daarom altijd
  deze functie in plaats van `sqlite3.connect` rechtstreeks.
- `maak_tabellen` — maakt de drie tabellen aan (doet niets als ze al
  bestaan). Let op: het administratietype uitbreiden (bv. `bv`) vereist
  later een migratie, want SQLite kan een CHECK-constraint niet
  aanpassen met `ALTER TABLE`.
- `maak_administratie` — maakt een administratie aan; een ander type dan
  `eenmanszaak` wordt geweigerd.
- `sla_factuur_op` — valideert en bewaart een factuur. Ook een afgekeurde
  factuur wordt opgeslagen (met `review_nodig` en de redenen), zodat de
  eigenaar hem later kan beoordelen. Elk veld krijgt een
  "aangemaakt"-regel in het logboek. De duplicaatcheck kijkt binnen
  dezelfde administratie; dezelfde nummers in een andere administratie
  zijn geen duplicaat.
- `wijzig_factuur` — past velden aan. De oude waarde gaat eerst het
  logboek in, daarna wordt de factuur opnieuw gevalideerd: een correctie
  kan een factuur dus van `review_nodig` naar `gevalideerd` brengen (en
  andersom). De kolom met de originele input verandert nooit.
- `lees_factuur` en `lees_audit_trail` — lezen een factuur en zijn
  volledige logboek terug.

## Module 2 — PDF-tekstextractie en bewaarplicht

Deze module haalt de ruwe tekst uit een factuur-PDF en zet het originele
bestand veilig weg. Er komt nog géén AI aan te pas: er wordt niets
geïnterpreteerd, alleen gelezen en bewaard. Module 3 (AI-extractie) bouwt
daar later bovenop.

### `boekhouding/documenten.py` — lezen en bewaren

- `lees_pdf_tekst(pad)` — haalt met pypdf de tekstlaag uit een PDF en geeft
  altijd een resultaat terug, nooit een exception. Vier gevallen leiden tot
  `review_nodig` met een reden in gewone taal: het bestand bestaat niet, de
  PDF is kapot of is helemaal geen PDF, of de PDF bevat wel pagina's maar
  geen letters — dat laatste is meestal een scan (foto van papier), en de
  reden luidt dan letterlijk "geen tekstlaag gevonden, mogelijk een scan".
  Lukt het wel, dan is de status `gelezen` en zitten de tekst en het aantal
  pagina's in het resultaat.
- `bereken_hash(pad)` — berekent de sha256-vingerafdruk van de inhoud van
  het bestand. Twee keer hetzelfde bestand geeft dezelfde vingerafdruk, ook
  als de bestandsnaam anders is. Daar rust de duplicaatherkenning op. Het
  bestand wordt in blokken gelezen, dus ook een hele grote PDF past in het
  geheugen.
- `extensie_van(bron)` — leest de bestandssoort van het aangeleverde
  bestand, schrijft hem klein en toetst hem aan een witte lijst:
  `.pdf`, `.jpg`, `.jpeg`, `.png`. Een factuur komt namelijk ook wel eens
  binnen als foto. Staat de extensie er niet op, of ontbreekt hij, dan geeft
  deze functie niets terug en gaat het document ter review — de bestandssoort
  wordt nooit gegokt.
- `opslagpad_voor(hash, opslagmap, extensie)` — bepaalt waar een document
  hoort te staan: `<opslagmap>/<eerste twee tekens van de hash>/<hash><ext>`.
  Die submap voorkomt dat één map volloopt met honderdduizenden bestanden.
  De extensie komt van het bronbestand, zodat een bewaarde foto ook echt als
  foto te openen blijft.
- `kopieer_naar_opslag(bron, hash, opslagmap, extensie)` — kopieert het
  origineel daarheen. Staat het bestand er al, dan gebeurt er niets: de
  inhoud is per definitie identiek, want de naam ís de vingerafdruk van de
  inhoud. Er wordt eerst naar een tijdelijk bestand gekopieerd en daarna
  hernoemd, zodat er nooit een half bestand op de definitieve plek staat.
  Die tijdelijke naam komt van `tempfile.mkstemp` en is uniek per aanroep:
  met een vaste naam zouden twee gelijktijdige aanroepen voor hetzelfde
  bestand elkaars tijdelijke bestand overschrijven. Gaat er onderweg iets
  mis, dan wordt het tijdelijke bestand in een `finally` opgeruimd. Het
  bewaarde bestand wordt alleen-lezen gemaakt (bewaarplicht: 7 jaar bewaren,
  nooit overschrijven).

### Nieuwe tabel `documenten` en de koppeling

- **documenten** — per administratie (`administratie_id`, Gouden regel 8) de
  vingerafdruk, de originele bestandsnaam zoals de klant hem aanleverde, het
  opslagpad en het tijdstip. De combinatie administratie + hash is uniek.
- **facturen.document_id** — een factuur mag optioneel verwijzen naar het
  bewaarde origineel, zodat bij een controle altijd de bron terug te vinden
  is. Het is een foreign key: een verwijzing naar een niet-bestaand document
  wordt geweigerd.
- `bewaar_document(conn, administratie_id, pad, opslagmap)` — berekent de
  vingerafdruk, kijkt of dit document al bekend is in deze administratie, en
  slaat het anders op. Drie mogelijke uitkomsten: `opgeslagen` (nieuw),
  `bestond_al` (dezelfde PDF is al bewaard — geen tweede kopie, geen tweede
  regel, wel het id van het bestaande document) of `review_nodig` (bestand
  niet gevonden of niet op te slaan). Elk nieuw document krijgt regels in de
  audit trail.
- `lees_document(conn, document_id)` — leest de registratie terug.

Dezelfde PDF in twee verschillende administraties krijgt wél een eigen
registratie (het zijn aparte boekhoudingen), maar staat maar één keer op
schijf.

### Openstaand punt: weesbestanden

Tussen het kopiëren van het bestand en de regel in de tabel `documenten` zit
een klein venster. Crasht het proces precies daartussen, dan staat het
bestand wél in de opslagmap maar hoort er geen administratie bij — een
weesbestand. Dat is geen dataverlies: het origineel staat er nog, en dezelfde
PDF opnieuw aanbieden slaat hem gewoon weer op onder dezelfde vingerafdruk.
Het kost alleen schijfruimte en het bestand is niet terug te vinden via de
administratie. Een latere opruimfunctie zou de opslagmap moeten vergelijken
met de tabel `documenten` en weesbestanden moeten **rapporteren** — nooit
stilzwijgend verwijderen, want de bewaarplicht geldt ook voor die bestanden.
Bewust nog niet gebouwd (Gouden regel 7); het staat als comment in
`database.py` bij de betreffende plek.

### Migratie voor bestaande databases

Databases die vóór module 2 zijn aangemaakt, missen de kolom `document_id`.
`CREATE TABLE IF NOT EXISTS` past een bestaande tabel niet aan, dus
`maak_tabellen` zet die kolom er los bij met `ALTER TABLE ADD COLUMN` als
hij ontbreekt. Bestaande facturen houden gewoon `NULL` als document.

## Module 3 — AI-extractie

Hier komt voor het eerst een taalmodel in beeld. Het doet precies één ding:
lezen wat er op de factuur staat. Het rekent niet, het gokt niet, en het
boekt niets. Alle sommen blijven van `valideer_factuur` uit module 1.

### De sleutel

De API-sleutel staat in een bestand `.env` naast deze README:

```
ANTHROPIC_API_KEY=...jouw sleutel...
```

Dat bestand staat in `.gitignore` en hoort daar te blijven. Zie
`.env.voorbeeld` voor de vorm. De sleutel komt nooit in code, tests, logs
of foutmeldingen. Komt hij ooit ergens anders terecht — een chat, een
screenshot, een commit — dan is het antwoord: intrekken en een nieuwe maken.

### Twee invoerpaden

`bepaal_invoerpad(pad)` kiest eerst op bestandssoort en pas daarna op inhoud:

- **Pad A (tekst)** — een PDF mét tekstlaag. De uitgelezen tekst uit module 2
  gaat naar het model. Dit is het betrouwbaarste pad: de letters staan al
  vast, het model hoeft niets te herkennen.
- **Pad B (beeld)** — een foto (`.jpg`, `.jpeg`, `.png`) of een gescande PDF
  zonder tekstlaag. Het document zelf gaat mee als base64. Een JPG wordt dus
  meteen als plaatje behandeld en niet eerst als kapotte PDF.

Een bestandssoort die we niet lezen levert `review_nodig` op zonder dat er
ook maar één aanroep naar het model gaat.

### Het formulier dat het model invult

Het model krijgt geen vrije tekst maar een vast formulier
(`FactuurExtractie`), en per veld drie dingen:

- `waarde` — wat er staat, of `null` als het er niet staat
- `zekerheid` — `hoog` of `laag`
- `reden` — verplicht zodra de zekerheid `laag` is

Regels die het model in de systeemprompt meekrijgt: vul alleen in wat je
letterlijk ziet, verzin nooit een waarde, leid nooit iets af, reken niets uit,
en neem bedragen exact over zoals ze op de factuur staan (dus `1.250,00`
blijft `1.250,00`). Twijfel je of een veld er staat → `null` met een reden.

### Van extractie naar oordeel

`beoordeel_extractie` legt drie soorten redenen naast elkaar:

1. een veld met `waarde: null` → "extractie: … niet op het document gevonden"
2. een veld met `zekerheid: laag` → "extractie: … met lage zekerheid gelezen"
3. alles wat `valideer_factuur` uit module 1 vindt: optelling, btw-berekening,
   datum, duplicaat

Eén reden is genoeg: dan is de hele factuur `review_nodig`. Alleen als er geen
enkele reden is, staat er `gevalideerd` — en zelfs dan is dat een voorstel,
geen boeking.

### Audit trail

`sla_extractie_op` bewaart per extractie het gebruikte model, het invoerpad,
de letterlijke modelrespons, de status met redenen en het `document_id` van
het bewaarde origineel. Zo is later na te gaan waar een boeking vandaan komt,
ook als het model intussen is vervangen.

### Testen en meten

- **`python -m pytest`** — de testsuite doet **nooit** een echte API-aanroep.
  De client wordt nagemaakt en meegegeven; er is geen sleutel voor nodig.
- **`python scripts/handmatige_api_test.py [bestand]`** — één echte aanroep,
  om te controleren of de sleutel werkt en wat het model van een echt
  document maakt.
- **`python scripts/eval_extractie.py`** — haalt alle tien de testfacturen
  door de extractie en telt per veld correct / fout / gemist, met een
  totaalscore. Doet tien echte aanroepen en vraagt daarom eerst om
  bevestiging (`--ja` slaat de vraag over). Bedragen worden als Decimal
  vergeleken en datums als datum, zodat de eval de inhoud meet en niet de
  schrijfwijze. Een waarde die het model invult terwijl die niet op het
  document staat, telt als fout met de toelichting "verzonnen" — dat is
  precies het gedrag dat Gouden regel 4 verbiedt.

## Testmateriaal: synthetische facturen

Voor module 3 (AI-extractie) is materiaal nodig om op te oefenen. Het script
`tests/genereer_testfacturen.py` maakt tien verzonnen maar realistisch
opgemaakte Nederlandse facturen in `tests/testfacturen/`:

```
python tests/genereer_testfacturen.py
```

Elke factuur heeft de gegevens die op een Nederlandse factuur horen te staan:
KvK-nummer, btw-identificatienummer, IBAN (met kloppende controlegetallen),
"Factuurdatum", "Vervaldatum" en "Totaal incl. btw".

| Bestand | Waarvoor |
|---|---|
| `01-standaard-21procent.pdf` | gewone inkoopfactuur, hoog tarief |
| `02-catering-9procent.pdf` | laag tarief van 9% |
| `03-verzekering-0procent.pdf` | nultarief, btw-bedrag 0,00 |
| `04-meerdere-regels-21procent.pdf` | vier regels die samen het subtotaal vormen |
| `05-met-korting-21procent.pdf` | kortingsregel onder de factuurregels |
| `06-creditnota-21procent.pdf` | negatieve bedragen |
| `07-duizendtal-21procent.pdf` | bedragen boven de duizend: `1.250,00` |
| `08-scan-zonder-tekstlaag.jpg` | foto/scan, geen tekst uit te halen |
| `09-zonder-factuurnummer.pdf` | factuurnummer ontbreekt (hoort afgekeurd) |
| `10-bedragen-kloppen-niet.pdf` | totaal klopt niet (hoort afgekeurd) |

Naast de bestanden schrijft het script `overzicht.json`: per bestand waar het
voor bedoeld is, de verwachte status en de juiste waarden. Dat is de
grondwaarheid waartegen module 3 straks kan worden afgerekend.

Het script is **deterministisch**: vaste seed, vaste datums, geen tijdstempel
in de bestanden en geen internet. Twee keer draaien geeft byte-voor-byte
dezelfde bestanden. De PDF- en JPEG-schrijvers in `tests/testmateriaal/` zijn
met de hand geschreven, zodat het project geen extra afhankelijkheid krijgt:
de stack blijft Python, SQLite, Pydantic en pytest.

### `tests/` — de bewijslast

104 pytest-tests, één of meer per controle, inclusief foute inputs: floats,
onzin-tekst, ontbrekende velden, verkeerde btw-percentages, ambigue
bedragen, toekomst- en te oude datums, duplicaten, de audit trail bij
aanmaken en wijzigen, en voor module 2: een PDF zonder tekstlaag, een
kapotte PDF, een bestand dat geen PDF is, een leeg bestand, een bestand dat
niet bestaat, dezelfde PDF twee keer aanbieden, en bestandssoorten binnen en
buiten de witte lijst (`.docx` en een bestand zonder extensie gaan ter
review). De test-PDF's worden in
de tests zelf gegenereerd (`maak_pdf` in `conftest.py`); er wordt niets
gedownload. `python -m pytest` in deze map draait alles.
