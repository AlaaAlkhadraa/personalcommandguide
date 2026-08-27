# Boekhouding — modules 1 t/m 5

Boekhoudsysteem voor Nederlandse zzp'ers.
AI stelt voor, code valideert, mens beslist: niets wordt hier automatisch
geboekt — elke fout leidt tot status `review_nodig` met een leesbare reden.

- **Module 1** — factuur-schema, validatie en audit trail
- **Module 2** — PDF-tekstextractie en veilige bewaring van originelen
- **Module 3** — AI-extractie van factuurgegevens (het model stelt voor,
  de code controleert, de mens beslist)
- **Module 4** — UBL / e-facturen rechtstreeks uitlezen, zonder AI
- **Module 5** — webinterface, fase 1: de reviewschermen van de eigenaar

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
2. **De factuurdatum mag ook in de Nederlandse schrijfwijze.** `2026-07-31`
   werkt, en `31-07-2026` ook: 31 kan alleen een dag zijn, dus daar valt
   niets te gokken. Maar `03-04-2026` kan 3 april of 4 maart zijn — dan
   volgt `review_nodig` met een reden die beide lezingen noemt. Dezelfde
   regel als bij `"1.250"`.
3. **Het btw-percentage moet bestaan** in het config-bestand van het jaar
   van de factuurdatum (nu: 21, 9 of 0).
4. **Leverancier en factuurnummer mogen niet leeg zijn.**

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

### Als er iets misgaat met de dienst

Een netwerkstoring, een rate limit of een serverfout mag het verwerken van een
stapel facturen niet afbreken. De aanroep staat daarom in een `try/except` en
elke fout wordt een reden in gewone taal, met de status `review_nodig`:

| Wat er misgaat | Wat de eigenaar leest |
|---|---|
| 429 | "te veel verzoeken achter elkaar (rate limit) — later opnieuw proberen" |
| 401 / 403 | "geen toegang met deze API-sleutel; controleer de sleutel in .env" |
| 404 | "het opgegeven model bestaat niet of is niet beschikbaar" |
| 400 | "de dienst wees het verzoek af als ongeldig — fout in het verzoek, niet in de factuur" |
| 5xx | "de dienst gaf een serverfout — later opnieuw proberen" |
| geen antwoord | "geen verbinding met de dienst — later opnieuw proberen" |

Elke melding zegt erbij of het zin heeft het later nog eens te proberen. Er
gaat nooit een exception naar buiten, dus factuur 3 in een stapel van 20 laat
factuur 4 tot en met 20 gewoon doorlopen.

### Welk model, en met welke prompt

Het model is niet vastgezet in de code. De volgorde is: wat de aanroeper
meegeeft, anders `ANTHROPIC_MODEL` uit `.env`, anders `claude-opus-5`. Zo kan
de eval een goedkoper model ernaast leggen zonder dat er code verandert.

`PROMPT_VERSIE` (nu `"v1"`) hoort omhoog zodra `SYSTEEM_PROMPT` wijzigt. Die
versie gaat mee de audit trail in: leest hetzelfde model dezelfde factuur over
een half jaar anders uit, dan is terug te zien of dat aan het model lag of aan
een aangepaste instructie. Een extractie uit een database van vóór deze kolom
krijgt `"onbekend"` — niet de huidige versie, want dat zou de audit trail een
onwaarheid laten vertellen.

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
- **`python scripts/handmatige_api_proef.py [bestand]`** — één echte aanroep,
  om te controleren of de sleutel werkt en wat het model van een echt
  document maakt.
- **`python scripts/eval_extractie.py`** — haalt alle tien de testfacturen
  door de extractie en telt per veld correct / fout / gemist, met een
  totaalscore. Doet tien echte aanroepen en vraagt daarom eerst om
  bevestiging (`--ja` slaat de vraag over). Met `--model=...` leg je een
  goedkoper model ernaast; elk model krijgt zijn eigen rapportbestand.
  Bedragen worden als Decimal vergeleken en datums als datum, zodat de eval
  de inhoud meet en niet de schrijfwijze. Het tokenverbruik wordt geteld en,
  als de prijs van het model bekend is, omgerekend naar kosten per run en
  per factuur.

  De eval telt vier uitkomsten, en **verzonnen** staat bovenaan:

  | Uitkomst | Wat het betekent |
  |---|---|
  | `verzonnen` | het veld staat niet op het document, maar het model vulde toch iets in |
  | `fout` | er staat een andere waarde dan op het document |
  | `gemist` | het document heeft de waarde wel, het model geeft niets terug |
  | `correct` | de waarde klopt (ook: allebei leeg) |

  `verzonnen` staat vooraan omdat het de gevaarlijkste uitkomst is: de
  validatie van module 1 vangt hem niet. Een verzonnen factuurnummer telt
  gewoon op, klopt met de btw en glipt als `gevalideerd` langs elke controle.
  Factuur 09 (zonder factuurnummer) is daarvoor de testcase.

## Module 4 — UBL / e-facturen

Een e-factuur is XML. De velden staan er letterlijk in mét hun naam:
`<cbc:IssueDate>2026-07-14</cbc:IssueDate>` is de factuurdatum, punt. Er valt
dus niets te herkennen, te lezen of te raden. Dit pad is daarmee nauwkeuriger
dan zowel de tekstlaag als het model, en het kost niets. Er komt geen AI aan
te pas.

### Routeren op inhoud, niet op naam

`routeer_document(pad)` kijkt naar de eerste bytes van het bestand en, bij
XML, naar het hoofdelement — niet naar de extensie. Een bestand dat
`factuur.pdf` heet maar UBL bevat gaat gewoon langs het UBL-pad.

| Wat er in het bestand staat | Route |
|---|---|
| XML met `Invoice` of `CreditNote` als hoofdelement | `ubl` |
| PDF mét ingebedde e-factuur (Factur-X / ZUGFeRD) | `ubl` |
| PDF met tekstlaag, zonder bijlage | `tekst` |
| PDF zonder tekstlaag, of een foto | `beeld` |
| iets anders | geen — `review_nodig` met reden |

De volgorde is bewust: zit er een e-factuur in de PDF, dan wint die van de
tekstlaag. Zo'n PDF is namelijk twee dingen tegelijk — leesbaar voor de mens,
en dezelfde factuur als XML voor de computer — en die XML is de betrouwbaarste
bron.

### Welke velden, en waar ze staan

Ondersteund is UBL 2.1 zoals gebruikt in NLCIUS en EN 16931:

| Veld | Waar het in het XML-bestand staat |
|---|---|
| factuurnummer | `cbc:ID` |
| factuurdatum | `cbc:IssueDate` |
| leverancier | `cac:AccountingSupplierParty/cac:Party/cac:PartyName/cbc:Name`, anders `cac:PartyLegalEntity/cbc:RegistrationName` |
| bedrag_excl | `cac:LegalMonetaryTotal/cbc:TaxExclusiveAmount` |
| bedrag_incl | `cac:LegalMonetaryTotal/cbc:TaxInclusiveAmount` |
| btw_bedrag | `cac:TaxTotal/cac:TaxSubtotal/cbc:TaxAmount` |
| btw_percentage | `cac:TaxSubtotal/cac:TaxCategory/cbc:Percent` |

Ontbreekt een element, of staat er iets onleesbaars in (een bedrag dat geen
getal is), dan volgt `review_nodig` met een reden die het element bij naam
noemt — er wordt nooit een standaardwaarde ingevuld.

**Meerdere btw-tarieven** op één factuur (meerdere `TaxSubtotal`-blokken)
worden **niet** opgeteld tot één percentage. Het schema kent er één, dus dan
gaat de factuur naar review met de gevonden tarieven erbij. Optellen zou een
getal opleveren dat op geen enkele regel van de factuur staat.

**Een creditnota** wordt herkend aan het hoofdelement `CreditNote`. UBL
schrijft daar positieve bedragen voor; het documentsoort draagt het minteken.
Ons schema kent geen documentsoort, dus die omkering doet de code niet zelf:
dat zou een teruggave als kosten kunnen boeken. De velden worden gelezen zoals
ze er staan en de factuur gaat naar review met de vraag of de tekens moeten
worden omgedraaid.

Daarna gaan alle bedragen door **dezelfde `valideer_factuur` van module 1**.
Ook een e-factuur wordt nagerekend: optelling, btw-berekening, datum en
duplicaatcheck.

### Veilig XML lezen (XXE)

XML kent "entiteiten": afkortingen die je bovenaan een bestand definieert.
Twee aanvallen misbruiken dat.

1. **XXE** — een entiteit die naar een bestand of netwerkadres wijst
   (`file:///etc/passwd`). De parser haalt die inhoud op en zet hem in het
   document. Zo laat een factuur die iemand je toestuurt je schijf leeglopen.
2. **Uitdijende entiteiten** ("billion laughs") — een entiteit die zichzelf
   steeds herhaalt. Een bestand van een paar regels vreet dan al het geheugen.

De standaardparser van Python haalt externe bestanden niet op, maar breidt
interne entiteiten wél uit — de tweede aanval werkt daar dus gewoon. Ik heb
dat nagemeten voordat ik iets bouwde. In plaats van per aanval een
verdediging weigert `lees_xml_veilig` daarom het hele stuk waarin entiteiten
worden gedeclareerd: de DTD. Een UBL-factuur heeft er nooit een nodig, dus
dat kost niets. Er zijn tests met een echte XXE-poging (die een testbestand
met geheime inhoud probeert te lezen), een billion-laughs-poging en een
externe DTD.

### Testbestanden

`python tests/genereer_ubl_testbestanden.py` maakt zes bestanden in
`tests/testfacturen/ubl/`: 21%, 9%, een creditnota, één met twee btw-tarieven,
één zonder `IssueDate`, en een Factur-X-PDF met de e-factuur als bijlage —
die laatste heeft óók een tekstlaag, zodat te testen is dat de XML voorgaat.

## Module 5 — Webinterface (fase 1)

```
python scripts/vul_testdata.py --met-pdf     # eenmalig: testfacturen erin
python scripts/start_webinterface.py
```

Daarna staat hij op `http://127.0.0.1:8000`, alleen op deze computer. Wil je
hem op je telefoon openen, start hem dan met `--netwerk`: dan luistert hij op
alle netwerkkaarten en print hij het adres dat je op je telefoon intypt
(`http://<ip-van-deze-computer>:8000`, zelfde wifi). Fase 1 heeft **geen
login**, dus alleen op je eigen netwerk doen.

`scripts/vul_testdata.py` maakt de administratie aan en laadt de vijf
UBL-testbestanden in. Die werken zonder API-sleutel: bij een e-factuur staan
de velden letterlijk in het bestand. Met `--met-pdf` komt de Factur-X-PDF er
ook bij, en die is de moeite waard: een PDF wordt in het reviewscherm netjes
naast de velden getoond, terwijl een los XML-bestand daar als onleesbare
platte tekst verschijnt (de browser laat de tags weg). Voor XML is dat
documentvenster dus nog niet bruikbaar — een leesbare weergave van de
XML-velden is een openstaand punt.

FastAPI met server-side HTML (Jinja2). Geen React, geen build-stap: je start
hem en het werkt. De opmaak staat in één `<style>`-blok in `basis.html` en is
mobiel-eerst — één kolom op een telefoon, twee kolommen zodra het scherm breed
genoeg is.

### De drie schermen

**Overzicht** (`/administratie/1`) — bovenaan drie tellers: hoeveel facturen op
jou wachten, hoeveel er klaar zijn om goed te keuren, en hoeveel er in totaal
zijn. Daaronder de lijst, in werkvolgorde: eerst wat je aandacht nodig heeft,
dan wat al klopt maar nog niet is goedgekeurd, onderaan wat af is. Per rij de
leverancier, de datum, het bedrag inclusief btw en de status; bij een factuur
in review staat de eerste reden er meteen onder.

**Uploaden** (`/administratie/1/upload`) — één veld met
`accept="image/*,.pdf,.xml" capture`, zodat je op een telefoon direct de camera
krijgt. Wat er daarna gebeurt is precies de keten uit de vorige modules:
bewaren → routeren → uitlezen → valideren en opslaan. Een e-factuur gaat
rechtstreeks, een PDF of foto langs het model.

**Reviewscherm** (`/administratie/1/factuur/1`) — het belangrijkste scherm. Links het originele
document, ingebed in de pagina. Rechts alle uitgelezen velden, stuk voor stuk
bewerkbaar. Bij elk veld staat hoe zeker het model was; een veld met lage
zekerheid krijgt een rode rand, een merkje en de reden eronder. Bovenaan staan
alle openstaande punten in gewone taal.

Twee knoppen: **Opslaan en later beoordelen** en **Goedkeuren**. Goedkeuren kan
alleen als er geen openstaande punten meer zijn — de knop staat dan letterlijk
uit, en ook als iemand het formulier tóch verstuurt weigert
`keur_factuur_goed` het. De code bepaalt of het mág, de mens bepaalt of het
gebeurt.

### Waar de logica staat

De routes doen drie dingen en niet meer: gegevens ophalen, een bestaande
functie aanroepen, en het resultaat aan een sjabloon geven. Er wordt in een
route niet gerekend en niets over btw bepaald.

- Uploaden roept `verwerk_upload` aan (`boekhouding/verwerking.py`) — de lijm
  tussen de modules, bewust buiten de webinterface zodat dezelfde keten
  straks ook vanaf de opdrachtregel of een e-mailpostbus werkt.
- Opslaan roept `wijzig_factuur` aan: de oude waarde gaat de audit trail in en
  de factuur wordt opnieuw gevalideerd. Een correctie kan een factuur dus
  vanzelf uit review halen.
- Goedkeuren roept `keur_factuur_goed` aan, die twee kolommen vult
  (`goedgekeurd_op`, `goedgekeurd_door`) en dat ook in de audit trail zet.

Bij het inladen van de testfacturen bleek iets dat alleen op het scherm te
zien was: elke reden stond er **twee keer**. De validatie draait namelijk twee
keer — één keer bij het uitlezen (`verwerk_efactuur` of `extraheer_factuur`) en
één keer bij het opslaan (`sla_factuur_op`) — en beide rondes leverden hun
redenen aan. Het uitlezen geeft nu apart terug wat het zélf constateerde
(`leesredenen` bij een e-factuur, `extractie_redenen` bij het model), en alleen
dát gaat mee als extra reden. De rekencontroles komen van `sla_factuur_op`, en
verder van niemand. Er zijn twee tests bij die de dubbeling zouden terugvinden.

Goedkeuring is bewust een aparte kolom en geen derde status: `gevalideerd`
zegt dat de sommen kloppen, `goedgekeurd_op` zegt dat een mens ja heeft
gezegd. Dat scheelt bovendien een tabelmigratie, want een CHECK-constraint is
in SQLite niet te wijzigen.

### Elk adres hoort bij één administratie

Alle routes die een factuur of document aanraken hangen onder de
administratie:

```
/administratie/{a}/factuur/{f}
/administratie/{a}/factuur/{f}/opslaan
/administratie/{a}/factuur/{f}/goedkeuren
/administratie/{a}/document/{d}
```

Elke route gaat langs één gedeelde functie, `hoort_bij_administratie`, die het
record ophaalt én controleert of het werkelijk bij die administratie hoort. Zo
niet, dan volgt **404** — niet 403. Een 403 ("mag niet") zou verklappen dat het
record bestaat, en dan weet iemand die de nummers in de adresbalk aan het
aflopen is precies waar wat zit. Bestaat-niet en hoort-bij-een-ander geven
daarom exact hetzelfde antwoord; daar is een test voor die de twee
antwoordpagina's letterlijk vergelijkt.

Nu is er nog één gebruiker en kan dit geen kwaad. Maar het adres van een
factuur is een nummer dat iedereen kan ophogen, en zodra er klantaccounts
komen zou klant B anders de facturen van klant A kunnen bekijken én aanpassen.
Dat is makkelijker nu goed te zetten dan later.

Er is ook een test die de routes zelf leest: elke route met een ander id dan
`administratie_id` in het pad móét `hoort_bij_administratie` gebruiken. Voegt
iemand later een route toe en vergeet die controle, dan valt die test om.

Het originele document wordt geserveerd met het pad **uit de database** —
nooit uit het verzoek. Een bezoeker kan dus ook geen ander bestand van de
schijf opvragen.

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

243 pytest-tests, één of meer per controle, inclusief foute inputs: floats,
onzin-tekst, ontbrekende velden, verkeerde btw-percentages, ambigue
bedragen, toekomst- en te oude datums, duplicaten, de audit trail bij
aanmaken en wijzigen, en voor module 2: een PDF zonder tekstlaag, een
kapotte PDF, een bestand dat geen PDF is, een leeg bestand, een bestand dat
niet bestaat, dezelfde PDF twee keer aanbieden, en bestandssoorten binnen en
buiten de witte lijst (`.docx` en een bestand zonder extensie gaan ter
review). De test-PDF's worden in
de tests zelf gegenereerd (`maak_pdf` in `conftest.py`); er wordt niets
gedownload. `python -m pytest` in deze map draait alles.

## De oplevering verversen

```
python scripts/maak_oplevering.py
```

Maakt `opleveringen/CODE-COMPLEET.md` (deze uitleg plus alle broncode achter
elkaar) en `opleveringen/boekhouding-compleet.zip` opnieuw. De map blijft plat:
genummerde rapporten plus die twee bestanden en het overzicht. De lokale
database, `__pycache__` en een `.env` gaan er nooit in.
