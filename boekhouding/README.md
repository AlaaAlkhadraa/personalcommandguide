# Boekhouding — modules 1 en 2

Boekhoudsysteem voor Nederlandse zzp'ers.
AI stelt voor, code valideert, mens beslist: niets wordt hier automatisch
geboekt — elke fout leidt tot status `review_nodig` met een leesbare reden.

- **Module 1** — factuur-schema, validatie en audit trail
- **Module 2** — PDF-tekstextractie en veilige bewaring van originelen
  (nog zonder AI)

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
- `opslagpad_voor(hash, opslagmap)` — bepaalt waar een document hoort te
  staan: `<opslagmap>/<eerste twee tekens van de hash>/<hash>.pdf`. Die
  submap voorkomt dat één map volloopt met honderdduizenden bestanden.
- `kopieer_naar_opslag(bron, hash, opslagmap)` — kopieert het origineel
  daarheen. Staat het bestand er al, dan gebeurt er niets: de inhoud is per
  definitie identiek, want de naam ís de vingerafdruk van de inhoud. Er
  wordt eerst naar een tijdelijke naam gekopieerd en daarna hernoemd, zodat
  er nooit een half bestand op de definitieve plek staat. Het bewaarde
  bestand wordt alleen-lezen gemaakt (bewaarplicht: 7 jaar bewaren, nooit
  overschrijven).

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

### Migratie voor bestaande databases

Databases die vóór module 2 zijn aangemaakt, missen de kolom `document_id`.
`CREATE TABLE IF NOT EXISTS` past een bestaande tabel niet aan, dus
`maak_tabellen` zet die kolom er los bij met `ALTER TABLE ADD COLUMN` als
hij ontbreekt. Bestaande facturen houden gewoon `NULL` als document.

### `tests/` — de bewijslast

64 pytest-tests, één of meer per controle, inclusief foute inputs: floats,
onzin-tekst, ontbrekende velden, verkeerde btw-percentages, ambigue
bedragen, toekomst- en te oude datums, duplicaten, de audit trail bij
aanmaken en wijzigen, en voor module 2: een PDF zonder tekstlaag, een
kapotte PDF, een bestand dat geen PDF is, een leeg bestand, een bestand dat
niet bestaat, en dezelfde PDF twee keer aanbieden. De test-PDF's worden in
de tests zelf gegenereerd (`maak_pdf` in `conftest.py`); er wordt niets
gedownload. `python -m pytest` in deze map draait alles.
