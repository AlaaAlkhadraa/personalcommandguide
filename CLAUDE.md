# Werkafspraken met Alaa (ZEVREN)

Deze regels gelden voor elke sessie in deze repo, ongeacht de taak.

## Waarom ik hier ben

Alaa betaalt hiervoor om tijd te besparen. Elk antwoord wordt daarop
beoordeeld: kost het hem werk, dan is het antwoord niet af. Twee dingen
volgen daaruit en ze gaan altijd samen, kwaliteit eerst en dan pas snelheid.

## Alles wat hij moet gebruiken, is kopieerklaar

Tekst die ergens ingeplakt wordt (advertenties, e-mails, LinkedIn, Google
Business, formulieren) levert hij regel voor regel aan, elke regel in een
eigen codeblok met een eigen kopieerknop. Nooit een lange lap tekst waar hij
zelf de juiste zin uit moet knippen.

Geldt er een tekenlimiet, dan staat het werkelijke aantal tekens erbij, en is
dat aantal geteld, niet geschat.

## Nooit een claim die de site niet waarmaakt

Prijzen, levertijden, garanties en aantallen in advertenties en berichten
moeten kloppen met wat op zevren.nl staat. Een advertentie die 150 euro
belooft terwijl de pagina 299 toont, is een Google-afkeuring en een klant die
zich bekocht voelt. Staat een belofte niet op de site, dan komt hij ook niet
in een advertentie.

Actuele aanbiedingsprijzen staan in `zevren/lib/offer.ts`. De doorgestreepte
adviesprijzen staan in `zevren/lib/i18n/dictionaries/*.ts`.

## Geen schaarste, geen "wij zijn klein"

Founding 10, "nog een paar plekken", en alles wat erop lijkt is bewust
verwijderd. Alaa wil niet dat klanten denken dat het een klein bedrijf is.
Vertrouwen komt van openbare prijzen en werkende demo's, niet van haast.

## Nooit een geheim in een gesprek

API-sleutels, wachtwoorden en tokens gaan rechtstreeks in de instellingen van
de dienst zelf. Verschijnt er toch een in de chat, dan is het antwoord: die
sleutel intrekken en een nieuwe maken.

## Alles wat af is, gaat in `opleveringen/`

Eén map, plat, geen submappen en geen map per keer. Elke afgeronde taak is
één genummerd bestand erbij (`09-...`, `10-...`), en `00-OVERZICHT.md`,
`CODE-COMPLEET.md` en `boekhouding-compleet.zip` worden ververst. Ook
tussenresultaten, rapporten en archieven horen daar en nergens anders.

## Klaar werk gaat naar beide branches

Committen op `main`, daarna spiegelen:
`git push origin main:claude/zevren-agency-website-bz0bzz`

---

# Project: Boekhoudsysteem voor Nederlandse zzp'ers

## Wat dit is
Een boekhoudsysteem waarbij AI facturen uitleest en boekingen
voorstelt, maar ALTIJD een mens (de eigenaar) goedkeurt voordat
iets definitief wordt. Doelgroep: simpele eenmanszaken, geen
personeel, geen EU-handel.

## Gouden regels (NOOIT overtreden)
1. AI stelt voor, code valideert, mens beslist. AI-output wordt
   NOOIT direct geboekt zonder review-status.
2. Alle berekeningen (btw, totalen, aftrekposten) gebeuren in
   Python-code met vaste formules — NOOIT door een taalmodel.
3. Elke wijziging aan data → audit trail (wie/wat/wanneer,
   originele waarde bewaren). Niets wordt ooit hard verwijderd.
4. Bij twijfel of ontbrekende data: status "review_nodig" met
   reden. NOOIT gokken, NOOIT defaults invullen bij financiële
   velden.
5. Bedragen altijd als Decimal, nooit float.
6. Elke functie krijgt pytest tests, inclusief foute inputs.
7. Bouw alleen wat gevraagd wordt in de huidige taak.
   Geen extra features "alvast" toevoegen.
8. Multi-administratie vanaf dag 1: elke tabel met boekhouddata
   heeft een administratie_id. Elke administratie heeft een type
   (nu alleen "eenmanszaak"; later uitbreidbaar naar BV etc.).
   Functionaliteit voor andere typen wordt NIET nu gebouwd —
   alleen de structuur maakt uitbreiding mogelijk.

## Stack (niet van afwijken zonder overleg)
- Python 3.12+, SQLite, Pydantic v2, pytest
- Alles lokaal, geen cloud-diensten zonder expliciete opdracht
- Webinterface: FastAPI + Jinja2, AI via Anthropic API

## Domeinregels (Nederlands belastingrecht)
- btw-percentages: alleen 21, 9, 0, "vrijgesteld", "verlegd"
- Validatie: bedrag_excl + btw_bedrag == bedrag_incl (±€0.02)
- Validatie: btw_bedrag == bedrag_excl × pct/100 (±€0.02)
- Factuurdatum: niet in de toekomst, niet ouder dan 2 jaar
- Factuurnummer + leverancier: duplicaatcheck verplicht
- Bewaarplicht: originele bestanden 7 jaar bewaren, nooit
  overschrijven
- Boekjaar/btw-tarieven in een apart config-bestand per jaar,
  nooit hardcoded

## AI-module regels
- Structured output via JSON schema, geen vrije tekst
- Verplicht veld "zekerheid" per extractie; bij onzekerheid →
  review
- AI mag alleen kiezen uit bestaande rekeningenlijst
  (RGS-subset), nooit zelf rekeningen verzinnen
- Fiscale uitleg alleen met bronvermelding; geen bron gevonden
  = "geen bron gevonden" zeggen

## Bestandssoorten (routering)
Elk aangeleverd bestand krijgt een route op basis van soort:
- UBL/XML (e-factuur): velden direct uitlezen, GEEN AI
- PDF met tekstlaag: tekst → AI-extractie
- PDF zonder tekstlaag, JPG, PNG: beeld → AI-extractie
- DOCX: tekst uitlezen → AI-extractie
- XLSX/CSV: NIET als factuur behandelen — aparte bulk-import
  met kolomtoewijzing die de gebruiker bevestigt
- Onbekende soort: review_nodig, nooit gokken
De route wordt bepaald door de werkelijke inhoud (magic bytes),
niet alleen door de extensie.

## Webinterface
- FastAPI + server-side HTML (Jinja2). Geen React, geen SPA,
  geen build-stap.
- Mobiel-eerst: de eigenaar en de klant werken op een telefoon.
- De interface roept alleen bestaande functies aan. Er wordt
  nooit boekhoudlogica in een route geschreven.
- Fase 1 = alleen de reviewschermen van de eigenaar, lokaal,
  zonder login. Klantaccounts komen later.

## Werkwijze per sessie
1. Eén taak per sessie, klein en afgebakend
2. Na elke taak: leg de code in eenvoudige taal uit
3. Draai alle bestaande tests voordat je klaar meldt
4. Als een taak conflicteert met de Gouden regels: stop en meld
   het
