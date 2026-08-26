# Boekhouding — Module 1: factuur-schema, validatie en audit trail

Eerste module van het boekhoudsysteem voor Nederlandse zzp'ers.
AI stelt voor, code valideert, mens beslist: niets wordt hier automatisch
geboekt — elke fout leidt tot status `review_nodig` met een leesbare reden.

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
   een punt (`"100.00"`) is het decimaalteken.
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

### `tests/` — de bewijslast

35 pytest-tests, één of meer per controle, inclusief foute inputs:
floats, onzin-tekst, ontbrekende velden, verkeerde btw-percentages,
toekomst- en te oude datums, duplicaten, en de audit trail bij aanmaken
en wijzigen. `python -m pytest` in deze map draait alles.
