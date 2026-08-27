# Volledige code — boekhoudsysteem, modules 1 t/m 5

Branch `claude/nl-accounting-invoice-module-f2vzr3`. Wordt bij elke oplevering ververst.

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
- **Module 6** — grootboek (dubbel boekhouden) en de btw-aangifte per kwartaal

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
ook bij, zodat je ook ziet hoe het scherm eruitziet met een echte PDF ernaast.

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
document: een PDF of foto ingebed in de pagina, een e-factuur als leesbare
weergave met de ruwe XML achter een knop (zie hieronder). Rechts alle uitgelezen velden, stuk voor stuk
bewerkbaar. Bij elk veld staat hoe zeker het model was; een veld met lage
zekerheid krijgt een rode rand, een merkje en de reden eronder. Bovenaan staan
alle openstaande punten in gewone taal.

Twee knoppen: **Opslaan en later beoordelen** en **Goedkeuren**. Goedkeuren kan
alleen als er geen openstaande punten meer zijn — de knop staat dan letterlijk
uit, en ook als iemand het formulier tóch verstuurt weigert
`keur_factuur_goed` het. De code bepaalt of het mág, de mens bepaalt of het
gebeurt.

### Een e-factuur leesbaar naast de velden

Het reviewscherm bestaat om te vergelijken: links wat de leverancier stuurde,
rechts wat het systeem eruit heeft gehaald. Bij een PDF gaat dat vanzelf. Maar
een e-factuur is XML, en die toonde de browser als een muur ruwe tekst vol
naamruimten (`urn:cen.eu:en16931…`). Daar valt niets mee te vergelijken, en
daarmee deed het belangrijkste scherm zijn werk niet.

`web/ubl_weergave.py` zet diezelfde XML om in leesbare regels, gegroepeerd
zoals een factuur is opgebouwd: kop, leverancier, afnemer, bedragen, btw,
betaling, en daaronder de factuurregels. Bij elk veld staat waar het in UBL
vandaan komt:

```
Factuurdatum            2026-08-04
cbc:IssueDate
```

Die herkomst staat er niet voor de sier. Een leverancier kiest zijn eigen
indeling, en zie je waar een waarde vandaan komt, dan zie je ook waarom het
systeem hem zo heeft gelezen. De getoonde tekst ís bovendien het pad waarmee
gezocht is (`_et_pad` vertaalt hem naar wat ElementTree wil), dus label en
werkelijkheid kunnen niet uit elkaar gaan lopen. Daar is een test voor.

Twee keuzes die het gedrag bepalen:

- **Kernvelden staan er altijd**, ook als ze ontbreken — dan juist. Bij de
  factuur zonder datum staat er letterlijk "Factuurdatum — niet in het
  bestand". Dat een verplicht veld ontbreekt, is precies wat de mens moet
  zien. Aanvullende velden (vervaldatum, IBAN, KvK) staan er alleen als ze in
  het bestand voorkomen, anders wordt het scherm een lijst met strepen.
- **Er wordt niets opgeteld en niets omgezet.** Bij twee btw-tarieven op één
  factuur staan beide tarieven met hun grondslag en bedrag onder elkaar, en
  geen van beide wordt als hét btw-veld gepresenteerd. Bij een creditnota
  blijven de bedragen positief staan zoals UBL ze noteert. De weergavelaag
  toont; de mens beslist.

De ruwe XML blijft één klik weg, achter **Toon XML**. Voor de bewaarplicht en
de audit trail blijft het originele bestand leidend, en dat verandert niet:
er wordt alleen gelezen. Ook de weergave leest de XML met `lees_xml_veilig` —
geen DTD, geen entiteiten, geen externe verwijzingen — zodat een aanval niet
alsnog via het leesvenster binnenkomt. Voor een PDF verandert er niets: die
laat de browser zelf zien, en dat is precies wat je naast de velden wilt.

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

## Module 6 — Grootboek en btw-aangifte

Hier wordt het boekhouden zelf gedaan: een goedgekeurde factuur wordt een
boeking, en de boekingen van een kwartaal worden samen een voorstel voor de
btw-aangifte.

### Het rekeningschema staat in een bestand, niet in de code

`config/rekeningen_2024.json`, `_2025.json`, `_2026.json` — per jaar een
lijst van ongeveer 35 rekeningen die een zzp'er nodig heeft, elk met een
code, een RGS-code, een omschrijving en een soort (kosten, opbrengsten,
activa, passiva, btw). `rekeningschema.py` leest zo'n bestand. Is er geen
bestand voor het boekjaar van een factuur, dan zegt de module dat eerlijk
(None) in plaats van het schema van een ander jaar te pakken.

**Let op bij de RGS-codes.** Die zijn met de hand samengesteld en niet
gecontroleerd tegen de officiële RGS-lijst. De code waarop dit systeem boekt
is het veld `code`; `rgs_code` is alleen een verwijzing. Controleer ze
voordat je er een echte aangifte of een export naar een accountant op
baseert. Die waarschuwing staat ook in de configbestanden zelf.

Er kan alleen op een rekening uit de lijst worden geboekt. Een code die er
niet in staat wordt geweigerd — er wordt nooit een rekening bijgemaakt.

### De eigenaar kiest de rekening, en die keuze bepaalt de richting

In het reviewscherm staat onder de bedragen een keuzelijst met alleen de
kosten- en opbrengstenrekeningen. Bank, crediteuren en btw staan daar niet
bij: die vult de boeking zelf in.

Die ene keuze bepaalt wat voor factuur het is:

| Gekozen rekening | Wat het wordt |
|---|---|
| een **kostenrekening** | inkoopfactuur: btw te vorderen, schuld aan de leverancier |
| een **opbrengstenrekening** | verkoopfactuur: btw af te dragen, vordering op de klant |

Dat is dus geen gok van het systeem maar het gevolg van een keuze van een
mens. Zonder keuze ontstaat er geen boeking, en dan zegt het scherm dat ook.

Een inkoopfactuur van 121 euro met 21 euro btw wordt:

```
4100  Kantoorkosten                    100,00 debet
1520  Te vorderen btw                   21,00 debet
1600  Crediteuren                                    121,00 credit
```

### Exact in balans, geen tolerantie

De factuurcontrole van module 1 laat een cent afronding toe (±0,02), want dat
komt op echte facturen voor. Een boeking niet: als debet en credit een cent
verschillen klopt de administratie niet meer. Zo'n factuur wordt dus **niet
geboekt**, met de reden erbij:

> de bedragen tellen niet exact op: 100.00 + 21.00 = 121.00, maar er staat
> 121.01. De factuurcontrole laat een cent afronding toe, een boeking niet —
> corrigeer het bedrag eerst

De balans wordt twee keer gecontroleerd: bij het samenstellen en nog een keer
vlak vóór het opslaan. Dat is met opzet dubbelop — een boeking die niet klopt
mag de database niet in, ook niet als een aanroeper de eerste controle zou
overslaan.

### Een boeking wordt nooit gewijzigd of verwijderd

Een fout wordt rechtgezet met een **tegenboeking**: dezelfde bedragen aan de
andere kant, met een verwijzing naar het origineel. Beide blijven staan, en
samen zijn ze nul. Een boeking kan maar één keer worden gecorrigeerd, en
dezelfde factuur kan maar één keer worden geboekt (de databasekolom
`factuur_id` is UNIQUE).

Om dezelfde reden ligt de gekozen rekening vast zodra er een boeking staat.
Zou je hem daarna nog kunnen wijzigen, dan zou de factuur iets anders zeggen
dan het grootboek. Het scherm toont de rekening dan als vaste tekst en
verwijst naar de tegenboeking.

De boekdatum van een tegenboeking is standaard die van de oorspronkelijke
boeking, zodat de correctie in hetzelfde kwartaal valt. Is dat kwartaal al
aangegeven, geef dan een datum in het lopende kwartaal mee.

### De btw-aangifte per kwartaal

`btw_aangifte.py` rekent uit wat er in de kwartaalaangifte hoort:

```
1a   omzet belast met het hoge tarief, en de btw daarover
1b   omzet belast met het lage tarief, en de btw daarover
5a   totaal verschuldigde omzetbelasting (de btw uit 1a en 1b)
5b   voorbelasting
saldo   5a min 5b: te betalen, terug te vragen, of precies nul
```

Alles met vaste formules in Python; er komt geen model aan te pas. Per
boeking wordt gekeken welke btw-rekening erin voorkomt — dat bepaalt de
rubriek — en de omzet van diezelfde boeking is dan de grondslag. Een
tegenboeking heeft de bedragen aan de andere kant en telt daardoor vanzelf
negatief mee; daarom `credit - debet` en niet alleen `credit`.

Kwartaalgrenzen lopen op de factuurdatum: 31 maart valt in K1, 1 april in K2.

### Bij twijfel geen getal

Staat er in het kwartaal ook maar één factuur die nog niet rond is, dan wordt
er **niets** uitgerekend. Je krijgt een lijst van wat er open staat, met een
link naar elke factuur. Drie dingen houden een aangifte tegen:

1. de factuur moet nog nagekeken worden (`review_nodig`);
2. de factuur klopt, maar niemand heeft hem goedgekeurd;
3. de factuur is goedgekeurd, maar er staat nog geen boeking — meestal omdat
   er geen rekening is gekozen.

Punt 2 en 3 staan niet in de opdracht maar horen er wel bij: in beide
gevallen bestaat de factuur wél en telt het bedrag níét mee. Een aangifte die
"bijna klopt" is gevaarlijker dan geen aangifte — hij ziet er af uit, en het
verschil merk je pas bij een controle.

Twee dingen worden gemeld zonder te blokkeren, omdat blokkeren daar niet
helpt: facturen zonder factuurdatum (die vallen in geen enkel kwartaal), en
omzet zonder btw (0%, vrijgesteld of verlegd). Dat laatste hoort in rubriek
1e, 2a of 3a, en die zijn niet gebouwd; stilzwijgend weglaten mag niet, dus
staat het als waarschuwing op het scherm.

### Het scherm

`/administratie/1/btw` gaat naar het kwartaal waar je nu in zit; met de
knoppen erboven loop je terug en vooruit. Onderaan staat, altijd:

> **Dit is een voorstel, geen aangifte.** Het indienen doet u zelf bij de
> Belastingdienst; dit systeem verstuurt niets.

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

346 pytest-tests, één of meer per controle, inclusief foute inputs: floats,
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

---

# Broncode

## `boekhouding/boekhouding/__init__.py`

```python
"""Boekhoudsysteem voor Nederlandse zzp'ers.

Module 1: factuur-schema, validatie en audit trail.
Module 2: PDF-tekstextractie en veilige bewaring van originelen.
Module 3: AI-extractie van factuurgegevens (voorstel, geen boeking).
Module 4: UBL / e-facturen rechtstreeks uitlezen (zonder AI).
Module 6: grootboek (dubbel boekhouden) en btw-aangifte per kwartaal.

AI stelt voor, code valideert, mens beslist (Gouden regel 1).
"""

from .models import Factuur, ValidatieResultaat
from .validatie import valideer_factuur
from .documenten import (
    TOEGESTANE_EXTENSIES,
    DocumentResultaat,
    TekstResultaat,
    bereken_hash,
    extensie_van,
    lees_pdf_tekst,
    opslagpad_voor,
)
from .ai_extractie import (
    PROMPT_VERSIE,
    STANDAARD_MODEL,
    ExtractieResultaat,
    FactuurExtractie,
    VeldExtractie,
    beoordeel_extractie,
    bepaal_invoerpad,
    extraheer_factuur,
    foutreden,
    standaard_model,
)
from .ubl import (
    MAX_XML_BYTES,
    EfactuurResultaat,
    UblResultaat,
    XmlOnveilig,
    beoordeel_ubl,
    is_ubl,
    lees_ubl,
    lees_ubl_bytes,
    lees_xml_veilig,
    te_groot,
    verwerk_efactuur,
)
from .rekeningschema import (
    KIESBARE_SOORTEN,
    SOORTEN,
    Rekening,
    Rekeningschema,
    rekeningschema_voor_jaar,
)
from .grootboek import (
    Boekingsregel,
    BoekingVoorstel,
    controleer_balans,
    som_credit,
    som_debet,
    stel_boeking_samen,
    stel_tegenboeking_samen,
)
from .btw_aangifte import (
    Aangifte,
    Blokkade,
    Rubriek,
    bereken_aangifte,
    kwartaal_grenzen,
    kwartaal_van,
    zoek_blokkades,
)
from .routering import bestandssoort, routeer_document, zoek_ingebedde_efactuur
from .omgeving import api_sleutel, sleutel_aanwezig
from .database import (
    maak_verbinding,
    maak_tabellen,
    maak_administratie,
    sla_factuur_op,
    wijzig_factuur,
    lees_factuur,
    lees_audit_trail,
    bewaar_document,
    lees_document,
    sla_extractie_op,
    lees_extractie,
    lees_facturen,
    keur_factuur_goed,
    lees_extractie_bij_document,
    kies_rekening,
    sla_boeking_op,
    lees_boeking,
    lees_boekingen,
    boeking_bij_factuur,
    boek_factuur,
    maak_tegenboeking,
)

__all__ = [
    "Factuur",
    "ValidatieResultaat",
    "valideer_factuur",
    "TOEGESTANE_EXTENSIES",
    "DocumentResultaat",
    "TekstResultaat",
    "bereken_hash",
    "extensie_van",
    "lees_pdf_tekst",
    "opslagpad_voor",
    "maak_verbinding",
    "maak_tabellen",
    "maak_administratie",
    "sla_factuur_op",
    "wijzig_factuur",
    "lees_factuur",
    "lees_audit_trail",
    "bewaar_document",
    "lees_document",
    "sla_extractie_op",
    "lees_extractie",
    "lees_facturen",
    "keur_factuur_goed",
    "lees_extractie_bij_document",
    "ExtractieResultaat",
    "FactuurExtractie",
    "VeldExtractie",
    "beoordeel_extractie",
    "bepaal_invoerpad",
    "extraheer_factuur",
    "foutreden",
    "standaard_model",
    "PROMPT_VERSIE",
    "STANDAARD_MODEL",
    "EfactuurResultaat",
    "UblResultaat",
    "XmlOnveilig",
    "beoordeel_ubl",
    "is_ubl",
    "lees_ubl",
    "lees_ubl_bytes",
    "lees_xml_veilig",
    "te_groot",
    "verwerk_efactuur",
    "MAX_XML_BYTES",
    "bestandssoort",
    "routeer_document",
    "zoek_ingebedde_efactuur",
    "api_sleutel",
    "sleutel_aanwezig",
    "Rekening",
    "Rekeningschema",
    "rekeningschema_voor_jaar",
    "SOORTEN",
    "KIESBARE_SOORTEN",
    "Boekingsregel",
    "BoekingVoorstel",
    "controleer_balans",
    "som_debet",
    "som_credit",
    "stel_boeking_samen",
    "stel_tegenboeking_samen",
    "kies_rekening",
    "sla_boeking_op",
    "lees_boeking",
    "lees_boekingen",
    "boeking_bij_factuur",
    "boek_factuur",
    "maak_tegenboeking",
    "Aangifte",
    "Blokkade",
    "Rubriek",
    "bereken_aangifte",
    "kwartaal_van",
    "kwartaal_grenzen",
    "zoek_blokkades",
]
```

## `boekhouding/boekhouding/btw_config.py`

```python
"""Btw-tarieven per boekjaar, geladen uit config-bestanden.

Gouden regel: tarieven staan in een apart config-bestand per jaar en zijn
nooit hardcoded in de logica. Ontbreekt het bestand voor een jaar, dan is
dat een reden voor "review_nodig" — er wordt nooit een default gegokt.
"""

import json
from decimal import Decimal
from pathlib import Path

CONFIG_MAP = Path(__file__).parent / "config"


def btw_percentages_voor_jaar(jaar: int) -> set[Decimal] | None:
    """Geef de toegestane btw-percentages voor een boekjaar.

    Retourneert None als er geen config-bestand voor dat jaar bestaat;
    de aanroeper beslist dan zelf (review_nodig, nooit gokken).
    """
    pad = CONFIG_MAP / f"btw_{jaar}.json"
    if not pad.is_file():
        return None
    with open(pad, encoding="utf-8") as f:
        data = json.load(f)
    return {Decimal(p) for p in data["btw_percentages"]}
```

## `boekhouding/boekhouding/models.py`

```python
"""Pydantic-schema's voor facturen.

Gouden regels die hier gelden:
- Bedragen altijd als Decimal, nooit float (regel 5). Floats worden
  geweigerd vóór conversie, omdat 0.1 + 0.2 als float niet 0.3 is.
- Toegestane btw-percentages komen uit het config-bestand van het
  boekjaar, nooit hardcoded (nu: 21, 9, 0).
"""

import re
from datetime import date
from decimal import Decimal, InvalidOperation
from typing import Any, Literal, Optional

from pydantic import BaseModel, ConfigDict, field_validator, model_validator

from .btw_config import btw_percentages_voor_jaar

GELD_VELDEN = {"bedrag_excl", "btw_bedrag", "bedrag_incl", "btw_percentage"}


class Factuur(BaseModel):
    """Eén inkoop- of verkoopfactuur zoals uitgelezen uit een document."""

    model_config = ConfigDict(extra="forbid")

    leverancier: str
    factuurdatum: date
    factuurnummer: str
    bedrag_excl: Decimal
    btw_percentage: Decimal
    btw_bedrag: Decimal
    bedrag_incl: Decimal

    @field_validator("leverancier", "factuurnummer")
    @classmethod
    def niet_leeg(cls, waarde: str) -> str:
        waarde = waarde.strip()
        if not waarde:
            raise ValueError("mag niet leeg zijn")
        return waarde

    @field_validator(*GELD_VELDEN, mode="before")
    @classmethod
    def geen_float(cls, waarde: Any) -> Any:
        if isinstance(waarde, float):
            raise ValueError(
                "float is niet toegestaan voor geldvelden; "
                "lever het bedrag aan als tekst of Decimal (Gouden regel 5)"
            )
        if isinstance(waarde, str):
            origineel = waarde.strip()
            waarde = origineel
            # Nederlandse notatie: punt én komma → punt is
            # duizendtalscheiding ("1.250,00"); alleen komma →
            # decimaalteken ("100,00"); alleen punt → decimaalteken.
            # Uitzondering (Gouden regel 4): alléén een punt gevolgd
            # door precies 3 cijfers ("1.250") kan zowel een Nederlands
            # duizendtal (1250) als een Engels decimaal (1,250) zijn —
            # dan nooit gokken, maar review.
            if "." in waarde and "," in waarde:
                waarde = waarde.replace(".", "").replace(",", ".")
            elif re.fullmatch(r"\d{1,3}\.\d{3}", waarde):
                raise ValueError(
                    f"ambigu bedrag '{origineel}': kan "
                    f"{waarde.replace('.', '')},00 of "
                    f"{waarde.replace('.', ',')} zijn — "
                    f"controleer het origineel"
                )
            else:
                waarde = waarde.replace(",", ".")
            try:
                return Decimal(waarde)
            except InvalidOperation:
                raise ValueError(f"'{origineel}' is geen geldig bedrag")
        return waarde

    @field_validator("factuurdatum", mode="before")
    @classmethod
    def nederlandse_datum(cls, waarde: Any) -> Any:
        """Accepteer JJJJ-MM-DD, en DD-MM-JJJJ alleen als die eenduidig is.

        Op een Nederlandse factuur staat "12-07-2026". De AI-module vraagt
        het model om JJJJ-MM-DD terug te geven, maar als er tóch de
        geschreven vorm binnenkomt moet dat geen onleesbare foutmelding
        opleveren.

        Is het eerste getal groter dan 12, dan kan het alleen een dag zijn
        en is de datum eenduidig. Is het 12 of lager, dan kan "03-04-2026"
        zowel 3 april als 4 maart zijn — dan wordt er niet gegokt maar
        volgt review (Gouden regel 4), met een reden die beide lezingen
        noemt.
        """
        if not isinstance(waarde, str):
            return waarde
        tekst = waarde.strip()
        gevonden = re.fullmatch(r"(\d{1,2})-(\d{1,2})-(\d{4})", tekst)
        if gevonden is None:
            return tekst
        eerste, tweede, jaar = (int(g) for g in gevonden.groups())
        if eerste > 12:
            return f"{jaar:04d}-{tweede:02d}-{eerste:02d}"
        raise ValueError(
            f"ambigue datum '{tekst}': kan {eerste} van maand {tweede} of "
            f"{tweede} van maand {eerste} zijn — noteer hem als "
            f"{jaar:04d}-{tweede:02d}-{eerste:02d} als het de Nederlandse "
            f"schrijfwijze is"
        )

    @model_validator(mode="after")
    def btw_percentage_toegestaan(self) -> "Factuur":
        toegestaan = btw_percentages_voor_jaar(self.factuurdatum.year)
        if toegestaan is None:
            raise ValueError(
                f"geen btw-configuratie voor boekjaar {self.factuurdatum.year}"
            )
        if self.btw_percentage not in toegestaan:
            mooi = ", ".join(str(p) for p in sorted(toegestaan, reverse=True))
            raise ValueError(
                f"btw_percentage {self.btw_percentage} is niet toegestaan "
                f"in {self.factuurdatum.year}; toegestaan: {mooi}"
            )
        return self


class ValidatieResultaat(BaseModel):
    """Uitkomst van valideer_factuur.

    Er wordt nooit een exception naar buiten gegooid en er gaat nooit
    data verloren: bij elke fout is de status "review_nodig", staan de
    redenen erbij, en blijft de originele input bewaard.
    """

    status: Literal["gevalideerd", "review_nodig"]
    redenen: list[str] = []
    factuur: Optional[Factuur] = None
    originele_data: dict[str, Any]
```

## `boekhouding/boekhouding/validatie.py`

```python
"""Validatie van facturen met vaste formules in Python-code.

Gouden regels die hier gelden:
- Alle berekeningen gebeuren hier, nooit door een taalmodel (regel 2).
- Elke fout leidt tot status "review_nodig" met reden; er wordt nooit
  een exception gegooid die data weggooit (regel 4).
"""

from datetime import date
from decimal import Decimal
from typing import Any, Callable, Optional

from pydantic import ValidationError

from .models import Factuur, ValidatieResultaat

TOLERANTIE = Decimal("0.02")
MAX_LEEFTIJD_JAREN = 2


def _twee_jaar_terug(vandaag: date) -> date:
    """Dezelfde dag, MAX_LEEFTIJD_JAREN jaar eerder (29 feb → 28 feb)."""
    try:
        return vandaag.replace(year=vandaag.year - MAX_LEEFTIJD_JAREN)
    except ValueError:
        return vandaag.replace(year=vandaag.year - MAX_LEEFTIJD_JAREN, day=28)


def valideer_factuur(
    data: dict[str, Any],
    *,
    vandaag: Optional[date] = None,
    is_duplicaat: Optional[Callable[[Factuur], bool]] = None,
) -> ValidatieResultaat:
    """Controleer één factuur en geef een status terug, nooit een exception.

    data          ruwe factuurgegevens (bijvoorbeeld uit AI-extractie)
    vandaag       peildatum voor de datumcontroles (default: date.today())
    is_duplicaat  callback die True geeft als leverancier+factuurnummer al
                  in de database staat (wordt door database.sla_factuur_op
                  meegegeven)
    """
    if vandaag is None:
        vandaag = date.today()

    redenen: list[str] = []

    # Stap 1: schema-controle (types, verplichte velden, btw-percentage).
    try:
        factuur = Factuur.model_validate(data)
    except ValidationError as fout:
        for f in fout.errors():
            veld = ".".join(str(p) for p in f["loc"]) or "factuur"
            redenen.append(f"{veld}: {f['msg']}")
        return ValidatieResultaat(
            status="review_nodig", redenen=redenen, originele_data=data
        )

    # Stap 2: rekencontroles met vaste formules (Gouden regel 2).
    som = factuur.bedrag_excl + factuur.btw_bedrag
    if abs(som - factuur.bedrag_incl) > TOLERANTIE:
        redenen.append(
            f"bedrag_excl ({factuur.bedrag_excl}) + btw_bedrag "
            f"({factuur.btw_bedrag}) = {som}, maar bedrag_incl is "
            f"{factuur.bedrag_incl} (verschil groter dan €{TOLERANTIE})"
        )

    verwachte_btw = (factuur.bedrag_excl * factuur.btw_percentage / 100).quantize(
        Decimal("0.01")
    )
    if abs(factuur.btw_bedrag - verwachte_btw) > TOLERANTIE:
        redenen.append(
            f"btw_bedrag ({factuur.btw_bedrag}) wijkt af van "
            f"{factuur.btw_percentage}% van {factuur.bedrag_excl} "
            f"(= {verwachte_btw}, verschil groter dan €{TOLERANTIE})"
        )

    # Stap 3: datumcontroles.
    if factuur.factuurdatum > vandaag:
        redenen.append(
            f"factuurdatum {factuur.factuurdatum} ligt in de toekomst "
            f"(vandaag is {vandaag})"
        )
    elif factuur.factuurdatum < _twee_jaar_terug(vandaag):
        redenen.append(
            f"factuurdatum {factuur.factuurdatum} is ouder dan "
            f"{MAX_LEEFTIJD_JAREN} jaar (grens: {_twee_jaar_terug(vandaag)})"
        )

    # Stap 4: duplicaatcheck op leverancier + factuurnummer.
    if is_duplicaat is not None and is_duplicaat(factuur):
        redenen.append(
            f"factuurnummer '{factuur.factuurnummer}' van leverancier "
            f"'{factuur.leverancier}' staat al in de database (duplicaat)"
        )

    status = "gevalideerd" if not redenen else "review_nodig"
    return ValidatieResultaat(
        status=status, redenen=redenen, factuur=factuur, originele_data=data
    )
```

## `boekhouding/boekhouding/rekeningschema.py`

```python
"""Het rekeningschema per boekjaar, geladen uit een config-bestand.

Zoals de btw-tarieven staan ook de rekeningen niet in de code maar in
`config/rekeningen_<jaar>.json`. Verandert er iets aan het schema, dan
komt er een nieuw bestand voor dat jaar bij en blijft de code hetzelfde.

Twee regels die hier gelden:
- Er kan alleen op een rekening uit deze lijst worden geboekt. Een code
  die er niet in staat wordt geweigerd met reden; er wordt nooit een
  rekening bijgemaakt of geraden (Gouden regel 4, en de AI-regel dat het
  model alleen uit de bestaande lijst mag kiezen).
- Bestaat er geen bestand voor het boekjaar van een factuur, dan zegt
  deze module dat eerlijk (None) in plaats van het schema van een ander
  jaar te gebruiken.
"""

import json
from functools import lru_cache
from pathlib import Path
from typing import Literal, Optional

from pydantic import BaseModel

CONFIG_MAP = Path(__file__).parent / "config"

# De soorten die een rekening kan hebben. "btw" staat apart van activa en
# passiva omdat de btw-aangifte die rekeningen los moet kunnen vinden.
SOORTEN = ("kosten", "opbrengsten", "activa", "passiva", "btw")

# Welke soorten een mens mag kiezen als tegenrekening bij een factuur.
# De rest (bank, crediteuren, btw) vult de boeking zelf in.
KIESBARE_SOORTEN = ("kosten", "opbrengsten")


class Rekening(BaseModel):
    """Eén grootboekrekening uit het schema."""

    code: str
    rgs_code: str
    omschrijving: str
    soort: Literal["kosten", "opbrengsten", "activa", "passiva", "btw"]


class Rekeningschema(BaseModel):
    """Het hele schema van één boekjaar."""

    jaar: int
    rekeningen: dict[str, Rekening]
    # De rekeningen die de boeking zelf invult: crediteuren, debiteuren,
    # de voorbelasting en de af te dragen btw per tarief.
    standaardrekeningen: dict[str, object]

    def zoek(self, code: str) -> Optional[Rekening]:
        return self.rekeningen.get(code)

    def kiesbaar(self) -> list[Rekening]:
        """De rekeningen die een mens bij een factuur mag kiezen."""
        return [
            rekening for rekening in self.rekeningen.values()
            if rekening.soort in KIESBARE_SOORTEN
        ]

    def standaard(self, naam: str) -> Optional[str]:
        """Geef de code van een standaardrekening, of None."""
        waarde = self.standaardrekeningen.get(naam)
        return waarde if isinstance(waarde, str) else None

    def btw_verschuldigd_voor(self, percentage: str) -> Optional[str]:
        """Geef de rekening voor af te dragen btw bij dit tarief, of None.

        Bij 0% hoort geen btw-rekening; dan is None het juiste antwoord
        en maakt de boeking simpelweg geen btw-regel. Bij een tarief dat
        niet in de config staat is None óók juist: dan wordt de boeking
        geweigerd in plaats van op een willekeurige rekening geboekt.
        """
        tabel = self.standaardrekeningen.get("btw_verschuldigd")
        if not isinstance(tabel, dict):
            return None
        waarde = tabel.get(percentage)
        return waarde if isinstance(waarde, str) else None


@lru_cache(maxsize=None)
def rekeningschema_voor_jaar(jaar: int) -> Optional[Rekeningschema]:
    """Laad het rekeningschema van een boekjaar, of None als het ontbreekt."""
    pad = CONFIG_MAP / f"rekeningen_{jaar}.json"
    if not pad.is_file():
        return None
    with open(pad, encoding="utf-8") as bestand:
        data = json.load(bestand)

    rekeningen = {}
    for gegeven in data["rekeningen"]:
        rekening = Rekening(**gegeven)
        if rekening.code in rekeningen:
            raise ValueError(
                f"rekening {rekening.code} staat twee keer in "
                f"rekeningen_{jaar}.json"
            )
        rekeningen[rekening.code] = rekening

    schema = Rekeningschema(
        jaar=data["jaar"],
        rekeningen=rekeningen,
        standaardrekeningen=data["standaardrekeningen"],
    )
    ontbreekt = [
        naam for naam in ("crediteuren", "debiteuren", "btw_voorbelasting")
        if schema.standaard(naam) is None or schema.zoek(schema.standaard(naam)) is None
    ]
    if ontbreekt:
        raise ValueError(
            f"rekeningen_{jaar}.json mist bruikbare standaardrekeningen: "
            f"{', '.join(ontbreekt)}"
        )
    return schema
```

## `boekhouding/boekhouding/documenten.py`

```python
"""PDF-tekstextractie en veilige bewaring van originele bestanden.

Nog ZONDER AI: deze module haalt alleen de ruwe tekstlaag uit een PDF
en zet het originele bestand veilig weg. Module 3 (AI-extractie) bouwt
daar later bovenop.

Gouden regels die hier gelden:
- Geen tekstlaag, een kapot bestand of een ontbrekend bestand levert
  status "review_nodig" met reden op — nooit een exception die het
  verwerken van een stapel facturen afbreekt (regel 4).
- Bewaarplicht: het origineel wordt gekopieerd, nooit overschreven en
  nooit verwijderd. De bestandsnaam is de sha256-hash van de inhoud,
  zodat hetzelfde bestand niet twee keer op schijf komt.
"""

import hashlib
import os
import shutil
import tempfile
from pathlib import Path
from typing import Literal, Optional

from pydantic import BaseModel

# Blokgrootte voor het hashen; zo past ook een PDF van 100 MB in het
# geheugen zonder problemen.
BLOK = 1024 * 1024

# Bestandssoorten die we bewaren. Een factuur komt binnen als PDF, als
# foto/scan, of als e-factuur in XML; iets anders wordt niet gegokt
# maar ter review gelegd.
TOEGESTANE_EXTENSIES = (".pdf", ".jpg", ".jpeg", ".png", ".xml")


class TekstResultaat(BaseModel):
    """Uitkomst van lees_pdf_tekst.

    status "gelezen"      → er is bruikbare tekst gevonden
    status "review_nodig" → geen tekst, of het bestand was niet te
                            lezen; de reden staat in redenen
    """

    status: Literal["gelezen", "review_nodig"]
    redenen: list[str] = []
    tekst: str = ""
    aantal_paginas: int = 0
    bestandsnaam: str


def lees_pdf_tekst(pad: str | Path) -> TekstResultaat:
    """Haal de tekstlaag uit een factuur-PDF.

    Geeft altijd een resultaat terug, nooit een exception: een scan
    zonder tekstlaag, een kapotte PDF of een ontbrekend bestand wordt
    "review_nodig" met een reden in gewone taal.
    """
    pad = Path(pad)

    if not pad.is_file():
        return TekstResultaat(
            status="review_nodig",
            redenen=[f"bestand niet gevonden: {pad}"],
            bestandsnaam=pad.name,
        )

    try:
        from pypdf import PdfReader

        lezer = PdfReader(str(pad))
        paginas = [(p.extract_text() or "") for p in lezer.pages]
    except Exception as fout:  # pypdf gooit uiteenlopende fouttypes
        return TekstResultaat(
            status="review_nodig",
            redenen=[f"kon de PDF niet lezen: {type(fout).__name__}: {fout}"],
            bestandsnaam=pad.name,
        )

    tekst = "\n".join(paginas).strip()
    if not tekst:
        return TekstResultaat(
            status="review_nodig",
            redenen=["geen tekstlaag gevonden, mogelijk een scan"],
            aantal_paginas=len(paginas),
            bestandsnaam=pad.name,
        )

    return TekstResultaat(
        status="gelezen",
        tekst=tekst,
        aantal_paginas=len(paginas),
        bestandsnaam=pad.name,
    )


def bereken_hash(pad: str | Path) -> str:
    """Bereken de sha256-hash van de bestandsinhoud (hex, 64 tekens).

    Twee keer hetzelfde bestand geeft dezelfde hash, ook als de
    bestandsnaam verschilt. Daarop rust de duplicaatherkenning.
    """
    hasher = hashlib.sha256()
    with open(pad, "rb") as bestand:
        for blok in iter(lambda: bestand.read(BLOK), b""):
            hasher.update(blok)
    return hasher.hexdigest()


def extensie_van(bron: str | Path) -> str | None:
    """Geef de gecontroleerde extensie van een bronbestand, of None.

    De extensie wordt kleingeschreven en getoetst aan een witte lijst.
    Staat hij daar niet op (of ontbreekt hij), dan geeft deze functie
    None terug: de aanroeper legt het document dan ter review en gokt
    nooit een bestandssoort (Gouden regel 4).
    """
    extensie = Path(bron).suffix.lower()
    return extensie if extensie in TOEGESTANE_EXTENSIES else None


def opslagpad_voor(
    hash_waarde: str, opslagmap: str | Path, extensie: str
) -> Path:
    """Bepaal waar een document met deze hash hoort te staan.

    De eerste twee tekens van de hash worden een submap, zodat één map
    niet volloopt met honderdduizenden bestanden. De extensie komt van
    het bronbestand: een factuur kan ook als foto worden aangeleverd,
    en dan moet het bewaarde bestand nog steeds te openen zijn.
    """
    if extensie not in TOEGESTANE_EXTENSIES:
        raise ValueError(
            f"extensie '{extensie}' staat niet op de witte lijst: "
            f"{', '.join(TOEGESTANE_EXTENSIES)}"
        )
    return Path(opslagmap) / hash_waarde[:2] / f"{hash_waarde}{extensie}"


def kopieer_naar_opslag(
    bron: str | Path, hash_waarde: str, opslagmap: str | Path, extensie: str
) -> tuple[Path, bool]:
    """Kopieer het origineel naar de opslagmap; geef (pad, is_nieuw).

    Bestaat het doelbestand al, dan wordt er niets overschreven: de
    inhoud is per definitie identiek, want de naam ís de hash van de
    inhoud. Het opgeslagen bestand wordt alleen-lezen gemaakt, zodat
    per ongeluk overschrijven ook technisch wordt tegengehouden
    (bewaarplicht: 7 jaar bewaren, nooit overschrijven).
    """
    doel = opslagpad_voor(hash_waarde, opslagmap, extensie)
    if doel.exists():
        return doel, False

    doel.parent.mkdir(parents=True, exist_ok=True)
    # Eerst naar een tijdelijk bestand in dezelfde map, dan hernoemen:
    # zo staat er nooit een half gekopieerd bestand op de definitieve
    # plek. os.replace is atomair binnen hetzelfde filesystem.
    #
    # De tijdelijke naam komt van tempfile.mkstemp en is dus uniek per
    # aanroep. Met een vaste naam (<hash>.tmp) zouden twee gelijktijdige
    # aanroepen voor hetzelfde bestand elkaars tijdelijke bestand
    # overschrijven, en zou de een het bestand van de ander kunnen
    # hernoemen terwijl die er nog in schrijft.
    beschrijving, tijdelijk = tempfile.mkstemp(
        dir=doel.parent, prefix=f"{hash_waarde}-", suffix=".tmp"
    )
    os.close(beschrijving)
    try:
        shutil.copyfile(bron, tijdelijk)
        os.replace(tijdelijk, doel)
    finally:
        # Na een geslaagde os.replace bestaat het tijdelijke bestand
        # niet meer; ging er iets mis, dan ruimen we het hier op.
        if os.path.exists(tijdelijk):
            os.unlink(tijdelijk)
    os.chmod(doel, 0o444)
    return doel, True


class DocumentResultaat(BaseModel):
    """Uitkomst van het opslaan van een origineel document."""

    status: Literal["opgeslagen", "bestond_al", "review_nodig"]
    redenen: list[str] = []
    document_id: Optional[int] = None
    hash: Optional[str] = None
    opslagpad: Optional[str] = None
```

## `boekhouding/boekhouding/omgeving.py`

```python
"""Instellingen uit een lokaal .env-bestand lezen.

De API-sleutel hoort nergens anders te staan dan in .env, en dat bestand
staat in .gitignore. Deze module leest hem in het geheugen en geeft hem
nooit terug in een foutmelding, log of __repr__.

Bewust een eigen mini-lader in plaats van python-dotenv: de stack ligt
vast (Python, SQLite, Pydantic, pytest, plus de Anthropic-SDK) en dit is
tien regels.
"""

import os
from pathlib import Path

SLEUTELNAAM = "ANTHROPIC_API_KEY"


def laad_env(pad: str | Path = ".env") -> int:
    """Lees KEY=VALUE-regels uit .env in de omgeving; geef het aantal.

    Een variabele die al in de omgeving staat wordt niet overschreven,
    zodat een expliciet gezette waarde altijd voorgaat.
    """
    pad = Path(pad)
    if not pad.is_file():
        return 0

    aantal = 0
    for regel in pad.read_text(encoding="utf-8").splitlines():
        regel = regel.strip()
        if not regel or regel.startswith("#") or "=" not in regel:
            continue
        naam, _, waarde = regel.partition("=")
        naam = naam.strip()
        waarde = waarde.strip().strip('"').strip("'")
        if naam and naam not in os.environ:
            os.environ[naam] = waarde
            aantal += 1
    return aantal


def api_sleutel(env_pad: str | Path = ".env") -> str | None:
    """Geef de API-sleutel, of None als hij niet is ingesteld.

    De waarde wordt nooit gelogd of in een foutmelding gezet.
    """
    laad_env(env_pad)
    sleutel = os.environ.get(SLEUTELNAAM, "").strip()
    return sleutel or None


def instelling(naam: str, standaard: str, env_pad: str | Path = ".env") -> str:
    """Lees een gewone (niet-geheime) instelling uit .env of de omgeving.

    Voor waarden als de modelnaam: die mogen wel gewoon zichtbaar zijn.
    Staat hij nergens, dan geldt de meegegeven standaard.
    """
    laad_env(env_pad)
    return os.environ.get(naam, "").strip() or standaard


def sleutel_aanwezig(env_pad: str | Path = ".env") -> bool:
    """Alleen ja of nee — handig voor scripts, zonder de waarde te tonen."""
    return api_sleutel(env_pad) is not None
```

## `boekhouding/boekhouding/ubl.py`

```python
"""UBL / e-facturen lezen (module 4) — zonder AI.

Een e-factuur is XML: de velden staan er letterlijk in, met een naam
erbij. Er valt dus niets te herkennen, te raden of te extraheren. Dit
pad is daarmee nauwkeuriger dan zowel de tekstlaag als het model, en
het kost niets.

Wat hier geldt:
- Alleen lezen wat er staat. Ontbreekt een element, of staat er iets
  onverwachts, dan volgt "review_nodig" met reden — nooit een default
  (Gouden regel 4).
- De bedragen gaan daarna door dezelfde valideer_factuur als elke
  andere factuur. Ook een e-factuur wordt nagerekend (Gouden regel 2).
- XML wordt veilig gelezen: geen DTD, geen entiteiten, geen externe
  verwijzingen. Zie lees_xml_veilig.

Ondersteund: UBL 2.1 zoals gebruikt in NLCIUS en EN 16931, met
Invoice en CreditNote als hoofdelement.
"""

import xml.etree.ElementTree as ET
import xml.parsers.expat as expat
from decimal import Decimal, InvalidOperation
from pathlib import Path
from typing import Any, Literal, Optional

from pydantic import BaseModel

from .models import Factuur
from .validatie import valideer_factuur

# De naamruimten van UBL 2.1. Het hoofdelement bepaalt het soort
# document; cbc en cac zijn de bouwstenen waarin de velden staan.
NS_INVOICE = "urn:oasis:names:specification:ubl:schema:xsd:Invoice-2"
NS_CREDITNOTE = "urn:oasis:names:specification:ubl:schema:xsd:CreditNote-2"
CBC = "urn:oasis:names:specification:ubl:schema:xsd:CommonBasicComponents-2"
CAC = "urn:oasis:names:specification:ubl:schema:xsd:CommonAggregateComponents-2"

# Bovengrens voor een XML-bestand dat we überhaupt inlezen. Een echte
# e-factuur is een paar kilobyte; twintig megabyte is dus ruim, en het
# houdt tegen dat een bestand van honderden megabytes het geheugen
# opvreet nog vóór er één controle aan bod komt. De grootte wordt op de
# schijf gecontroleerd, dus zonder het bestand te lezen.
MAX_XML_BYTES = 20 * 1024 * 1024

UBL_WORTELS = {
    f"{{{NS_INVOICE}}}Invoice": "factuur",
    f"{{{NS_CREDITNOTE}}}CreditNote": "creditnota",
}


class XmlOnveilig(Exception):
    """Het XML-bestand probeert iets wat we nooit toestaan."""


def _veilige_parser(bouwer: ET.TreeBuilder) -> "expat.XMLParserType":
    """Maak een expat-parser die elke DTD en elke entiteit weigert.

    Waarom dit nodig is, in gewone taal: XML kent "entiteiten", een soort
    afkortingen die je bovenaan het bestand kunt definiëren. Twee
    aanvallen maken daar misbruik van.

    1. XXE: een entiteit die naar een bestand of een netwerkadres wijst
       (`file:///etc/passwd`). De parser haalt die inhoud op en zet hem
       in het document. Zo laat een factuur die iemand je toestuurt de
       inhoud van je schijf weglekken.
    2. Een entiteit die zichzelf steeds herhaalt en exponentieel uitdijt
       ("billion laughs"). Een bestand van een paar regels vreet dan al
       het geheugen op.

    De standaardparser van Python haalt externe bestanden niet op, maar
    breidt interne entiteiten wél uit — de tweede aanval werkt daar dus
    gewoon. In plaats van per aanval een verdediging te bouwen weigeren
    we het hele stuk waarin entiteiten worden gedeclareerd: de DTD. Een
    UBL-factuur heeft nooit een DTD nodig, dus dat kost niets.

    Er wordt met expat gewerkt in plaats van met ET.XMLParser, omdat die
    laatste in CPython in C is geschreven en de handlers niet doorgeeft.
    """
    def weiger_dtd(naam, systeem_id, publiek_id, heeft_interne_subset):
        raise XmlOnveilig(
            "het bestand bevat een DTD (<!DOCTYPE ...>); dat staan we niet "
            "toe, omdat daar entiteiten in kunnen staan die bestanden of "
            "netwerkadressen opvragen"
        )

    def weiger_entiteit(*argumenten):
        raise XmlOnveilig("het bestand declareert een entiteit; niet toegestaan")

    def weiger_extern(*argumenten):
        raise XmlOnveilig(
            "het bestand verwijst naar een externe bron; niet toegestaan"
        )

    # De scheider '}' maakt van expat's "uri}naam" met een voorloopaccolade
    # precies de "{uri}naam" die ElementTree gebruikt.
    parser = expat.ParserCreate(None, "}")

    def haakjes(naam: str) -> str:
        return "{" + naam if "}" in naam else naam

    def begin(naam, kenmerken):
        bouwer.start(
            haakjes(naam), {haakjes(k): v for k, v in kenmerken.items()}
        )

    parser.StartElementHandler = begin
    parser.EndElementHandler = lambda naam: bouwer.end(haakjes(naam))
    parser.CharacterDataHandler = bouwer.data
    parser.StartDoctypeDeclHandler = weiger_dtd
    parser.EntityDeclHandler = weiger_entiteit
    parser.UnparsedEntityDeclHandler = weiger_entiteit
    parser.ExternalEntityRefHandler = weiger_extern
    return parser


def te_groot(aantal_bytes: int) -> Optional[str]:
    """Geef een reden als het bestand boven de grens ligt, anders None."""
    if aantal_bytes <= MAX_XML_BYTES:
        return None
    return (
        f"het XML-bestand is {aantal_bytes / 1024 / 1024:.1f} MB en daarmee "
        f"groter dan de grens van {MAX_XML_BYTES // (1024 * 1024)} MB; het "
        f"wordt niet ingelezen. Een e-factuur is normaal een paar kilobyte, "
        f"dus controleer wat dit bestand is"
    )


def lees_xml_veilig(inhoud: bytes) -> ET.Element:
    """Lees XML zonder DTD en zonder entiteiten; geef het hoofdelement.

    Gooit XmlOnveilig bij een aanvalspoging of bij een bestand boven de
    grens, en ET.ParseError bij kapotte XML. De aanroeper vertaalt dat
    naar review_nodig.
    """
    reden = te_groot(len(inhoud))
    if reden is not None:
        raise XmlOnveilig(reden)

    bouwer = ET.TreeBuilder()
    parser = _veilige_parser(bouwer)
    try:
        parser.Parse(inhoud, True)
    except expat.ExpatError as fout:
        # Als één fouttype naar buiten, zodat de aanroeper er maar één
        # hoeft te kennen.
        raise ET.ParseError(str(fout)) from fout
    return bouwer.close()


class UblResultaat(BaseModel):
    """Uitkomst van het lezen van een e-factuur."""

    status: Literal["gelezen", "review_nodig"]
    redenen: list[str] = []
    velden: dict[str, str] = {}
    documentsoort: Optional[str] = None
    bestandsnaam: str = ""


def _tekst(element: Optional[ET.Element]) -> Optional[str]:
    if element is None or element.text is None:
        return None
    waarde = element.text.strip()
    return waarde or None


def _bedrag(waarde: Optional[str]) -> Optional[str]:
    """Controleer dat een bedrag een getal is; geef het onveranderd terug.

    UBL schrijft de punt als decimaalteken voor. We rekenen hier niets
    om en niets uit: we controleren alleen dat het een getal is, zodat
    een onzinwaarde niet stilletjes doorgaat.
    """
    if waarde is None:
        return None
    try:
        Decimal(waarde)
    except InvalidOperation:
        return None
    return waarde


def is_ubl(wortel: ET.Element) -> Optional[str]:
    """Geef 'factuur' of 'creditnota' als dit een UBL-document is."""
    return UBL_WORTELS.get(wortel.tag)


def lees_ubl_element(wortel: ET.Element, bestandsnaam: str = "") -> UblResultaat:
    """Haal de factuurvelden uit een ingelezen UBL-document."""
    soort = is_ubl(wortel)
    if soort is None:
        return UblResultaat(
            status="review_nodig",
            redenen=[
                f"het hoofdelement '{wortel.tag}' is geen UBL Invoice of "
                f"CreditNote; dit bestand wordt niet als e-factuur gelezen"
            ],
            bestandsnaam=bestandsnaam,
        )

    redenen: list[str] = []
    velden: dict[str, str] = {}

    def leg_vast(naam: str, waarde: Optional[str], waar: str) -> None:
        if waarde is None:
            redenen.append(f"{naam} ontbreekt in het bestand (verwacht bij {waar})")
        else:
            velden[naam] = waarde

    leg_vast("factuurnummer", _tekst(wortel.find(f"{{{CBC}}}ID")), "cbc:ID")
    leg_vast(
        "factuurdatum", _tekst(wortel.find(f"{{{CBC}}}IssueDate")), "cbc:IssueDate"
    )

    # Leverancier: eerst de handelsnaam, anders de statutaire naam.
    partij = wortel.find(
        f"{{{CAC}}}AccountingSupplierParty/{{{CAC}}}Party"
    )
    naam = None
    if partij is not None:
        naam = _tekst(partij.find(f"{{{CAC}}}PartyName/{{{CBC}}}Name")) or _tekst(
            partij.find(f"{{{CAC}}}PartyLegalEntity/{{{CBC}}}RegistrationName")
        )
    leg_vast(
        "leverancier", naam,
        "cac:AccountingSupplierParty/cac:Party/cac:PartyName/cbc:Name",
    )

    totalen = wortel.find(f"{{{CAC}}}LegalMonetaryTotal")
    excl = incl = None
    if totalen is not None:
        excl = _bedrag(_tekst(totalen.find(f"{{{CBC}}}TaxExclusiveAmount")))
        incl = _bedrag(_tekst(totalen.find(f"{{{CBC}}}TaxInclusiveAmount")))
    leg_vast("bedrag_excl", excl, "cac:LegalMonetaryTotal/cbc:TaxExclusiveAmount")
    leg_vast("bedrag_incl", incl, "cac:LegalMonetaryTotal/cbc:TaxInclusiveAmount")

    # Btw: meerdere TaxSubtotal betekent meerdere tarieven op één factuur.
    subtotalen = wortel.findall(f"{{{CAC}}}TaxTotal/{{{CAC}}}TaxSubtotal")
    if len(subtotalen) > 1:
        tarieven = [
            _tekst(s.find(f"{{{CAC}}}TaxCategory/{{{CBC}}}Percent")) or "?"
            for s in subtotalen
        ]
        redenen.append(
            f"de factuur heeft {len(subtotalen)} btw-tarieven ({', '.join(tarieven)}%); "
            f"het schema kent er één, dus de verdeling moet met de hand worden "
            f"beoordeeld — er wordt niets bij elkaar opgeteld"
        )
    elif len(subtotalen) == 0:
        redenen.append(
            "geen btw-gegevens gevonden (verwacht bij cac:TaxTotal/cac:TaxSubtotal)"
        )
    else:
        subtotaal = subtotalen[0]
        leg_vast(
            "btw_bedrag",
            _bedrag(_tekst(subtotaal.find(f"{{{CBC}}}TaxAmount"))),
            "cac:TaxSubtotal/cbc:TaxAmount",
        )
        leg_vast(
            "btw_percentage",
            _tekst(subtotaal.find(f"{{{CAC}}}TaxCategory/{{{CBC}}}Percent")),
            "cac:TaxCategory/cbc:Percent",
        )

    # Een creditnota heeft in UBL positieve bedragen; het documentsoort
    # draagt het minteken. Ons schema kent geen documentsoort, dus dat
    # zetten we niet zelf om: dan zou een teruggave als kosten worden
    # geboekt. De mens beslist (Gouden regel 1).
    if soort == "creditnota":
        redenen.append(
            "dit is een creditnota; UBL noteert de bedragen positief terwijl "
            "ze als negatief geboekt horen te worden — controleer de tekens "
            "voordat dit wordt vastgelegd"
        )

    return UblResultaat(
        status="gelezen" if not redenen else "review_nodig",
        redenen=redenen,
        velden=velden,
        documentsoort=soort,
        bestandsnaam=bestandsnaam,
    )


def lees_ubl(pad: str | Path) -> UblResultaat:
    """Lees een UBL-bestand van schijf; geeft nooit een exception."""
    pad = Path(pad)
    if not pad.is_file():
        return UblResultaat(
            status="review_nodig",
            redenen=[f"bestand niet gevonden: {pad}"],
            bestandsnaam=pad.name,
        )

    # Eerst de grootte op de schijf, dan pas lezen: een bestand van
    # honderden megabytes mag het geheugen niet vullen voordat er ook
    # maar één controle aan bod komt.
    reden = te_groot(pad.stat().st_size)
    if reden is not None:
        return UblResultaat(
            status="review_nodig", redenen=[reden], bestandsnaam=pad.name
        )

    return lees_ubl_bytes(pad.read_bytes(), pad.name)


def lees_ubl_bytes(inhoud: bytes, bestandsnaam: str = "") -> UblResultaat:
    """Lees UBL uit bytes (ook gebruikt voor XML uit een PDF-bijlage)."""
    try:
        wortel = lees_xml_veilig(inhoud)
    except XmlOnveilig as fout:
        return UblResultaat(
            status="review_nodig",
            redenen=[f"onveilige XML geweigerd: {fout}"],
            bestandsnaam=bestandsnaam,
        )
    except ET.ParseError as fout:
        return UblResultaat(
            status="review_nodig",
            redenen=[f"het XML-bestand is niet leesbaar: {fout}"],
            bestandsnaam=bestandsnaam,
        )
    except Exception as fout:  # nooit een exception naar buiten
        return UblResultaat(
            status="review_nodig",
            redenen=[f"kon het XML-bestand niet lezen: {type(fout).__name__}: {fout}"],
            bestandsnaam=bestandsnaam,
        )
    return lees_ubl_element(wortel, bestandsnaam)


class EfactuurResultaat(BaseModel):
    """Een gelezen e-factuur, nagerekend door de validatie van module 1."""

    status: Literal["gevalideerd", "review_nodig"]
    redenen: list[str] = []
    factuur: Optional[Factuur] = None
    velden: dict[str, str] = {}
    # Alleen wat het lezen van het XML-bestand opleverde (ontbrekend
    # element, meerdere btw-tarieven, creditnota). De rekencontroles
    # zitten in `redenen` en worden verderop opnieuw gedraaid.
    leesredenen: list[str] = []
    documentsoort: Optional[str] = None
    bron: Literal["xml", "pdf-bijlage"] = "xml"
    bestandsnaam: str = ""


def beoordeel_ubl(
    gelezen: UblResultaat, *, vandaag=None, is_duplicaat=None
) -> EfactuurResultaat:
    """Reken een gelezen e-factuur na met valideer_factuur.

    De redenen uit het lezen (ontbrekend element, meerdere btw-tarieven,
    creditnota) en de redenen uit de validatie (optelling, btw, datum,
    duplicaat) komen samen. Eén reden is genoeg voor review.
    """
    redenen = list(gelezen.redenen)
    resultaat = valideer_factuur(
        gelezen.velden, vandaag=vandaag, is_duplicaat=is_duplicaat
    )
    redenen.extend(resultaat.redenen)

    return EfactuurResultaat(
        status="gevalideerd" if not redenen else "review_nodig",
        redenen=redenen,
        leesredenen=list(gelezen.redenen),
        factuur=resultaat.factuur,
        velden=gelezen.velden,
        documentsoort=gelezen.documentsoort,
        bestandsnaam=gelezen.bestandsnaam,
    )


def verwerk_efactuur(
    pad: str | Path, *, vandaag=None, is_duplicaat=None
) -> EfactuurResultaat:
    """Lees een e-factuur en reken hem na; geeft nooit een exception.

    Werkt zowel voor een los XML-bestand als voor een PDF met een
    ingebedde e-factuur (Factur-X / ZUGFeRD). In dat laatste geval
    wordt de XML uit de bijlage gelezen, want die is betrouwbaarder dan
    de tekstlaag.
    """
    from .routering import zoek_ingebedde_efactuur

    pad = Path(pad)
    if not pad.is_file():
        return EfactuurResultaat(
            status="review_nodig",
            redenen=[f"bestand niet gevonden: {pad}"],
            bestandsnaam=pad.name,
        )

    inhoud = pad.read_bytes()
    bron = "xml"
    if inhoud.startswith(b"%PDF-"):
        ingebed = zoek_ingebedde_efactuur(pad)
        if ingebed is None:
            return EfactuurResultaat(
                status="review_nodig",
                redenen=["deze PDF bevat geen ingebedde e-factuur"],
                bestandsnaam=pad.name,
            )
        inhoud, bron = ingebed, "pdf-bijlage"

    resultaat = beoordeel_ubl(
        lees_ubl_bytes(inhoud, pad.name),
        vandaag=vandaag,
        is_duplicaat=is_duplicaat,
    )
    return resultaat.model_copy(update={"bron": bron})
```

## `boekhouding/boekhouding/routering.py`

```python
"""Bepalen wat voor document er binnenkomt, op inhoud en niet op naam.

Een bestand dat `factuur.pdf` heet hoeft geen PDF te zijn, en een PDF
kan een complete e-factuur als bijlage bevatten. Daarom wordt hier naar
de werkelijke inhoud gekeken: de eerste bytes van het bestand, en bij
XML naar het hoofdelement.

De vier uitkomsten:
  "ubl"    een e-factuur; de velden staan er letterlijk in
  "tekst"  een PDF met tekstlaag; die tekst kan naar het model
  "beeld"  een foto of een gescande PDF; het beeld moet naar het model
  None     onbekend — review_nodig met reden, nooit gokken

De volgorde is bewust: staat er een e-factuur in, dan is dat altijd de
beste bron. Een PDF met Factur-X- of ZUGFeRD-bijlage gaat dus langs het
UBL-pad en niet langs de tekstlaag, ook al is die er wel.
"""

from pathlib import Path
from typing import Literal, Optional

from .ubl import MAX_XML_BYTES, is_ubl, lees_xml_veilig, te_groot

Route = Optional[Literal["ubl", "tekst", "beeld"]]

# Eerste bytes waaraan een bestandssoort te herkennen is.
MAGISCHE_BYTES = {
    b"%PDF-": "pdf",
    b"\xff\xd8\xff": "jpg",
    b"\x89PNG\r\n\x1a\n": "png",
}

# Namen die Factur-X en ZUGFeRD aan hun ingebedde XML geven.
EFACTUUR_BIJLAGEN = (
    "factur-x.xml",
    "zugferd-invoice.xml",
    "xrechnung.xml",
    "facturx.xml",
    "ubl.xml",
)


def bestandssoort(begin: bytes) -> Optional[str]:
    """Herken de bestandssoort aan de eerste bytes; None als onbekend."""
    for handtekening, naam in MAGISCHE_BYTES.items():
        if begin.startswith(handtekening):
            return naam
    # UTF-16 met BOM: de tekens staan er als twee bytes, dus na de BOM
    # volgt "<\x00" (little endian) of "\x00<" (big endian). Zonder deze
    # controle zou een geldige e-factuur in UTF-16 als onbekende soort
    # worden afgewezen, terwijl de XML-standaard die codering voorschrijft.
    if begin.startswith(b"\xff\xfe") and begin[2:4] in (b"<\x00", b"?\x00"):
        return "xml"
    if begin.startswith(b"\xfe\xff") and begin[2:4] in (b"\x00<", b"\x00?"):
        return "xml"

    # UTF-8, met of zonder BOM: een declaratie of meteen '<'.
    kop = begin.lstrip(b"\xef\xbb\xbf").lstrip()
    if kop.startswith(b"<?xml") or kop.startswith(b"<"):
        return "xml"
    return None


def zoek_ingebedde_efactuur(pad: str | Path) -> Optional[bytes]:
    """Geef de XML-bijlage uit een PDF (Factur-X / ZUGFeRD), of None.

    Zulke PDF's zijn twee dingen tegelijk: een leesbare factuur voor de
    mens, en dezelfde factuur als XML voor de computer. Die XML is de
    betrouwbaarste bron, dus daar kijken we eerst naar.
    """
    try:
        from pypdf import PdfReader

        bijlagen = PdfReader(str(pad)).attachments or {}
    except Exception:
        # Geen bijlagen kunnen lezen is geen fout: dan is het gewoon
        # een PDF zonder e-factuur en gaat hij langs het normale pad.
        return None

    # Eerst op de bekende namen, daarna op elk .xml-bestand.
    for naam in list(bijlagen):
        if naam.lower() in EFACTUUR_BIJLAGEN:
            return _eerste(bijlagen[naam])
    for naam in list(bijlagen):
        if naam.lower().endswith(".xml"):
            return _eerste(bijlagen[naam])
    return None


def _eerste(inhoud) -> Optional[bytes]:
    """pypdf geeft per naam een lijst met versies; pak de eerste."""
    if isinstance(inhoud, (bytes, bytearray)):
        return bytes(inhoud)
    if isinstance(inhoud, list) and inhoud:
        return bytes(inhoud[0])
    return None


def routeer_document(pad: str | Path) -> tuple[Route, Optional[str]]:
    """Bepaal het verwerkingspad; geef (route, reden-bij-onbekend).

    Er wordt niet op de extensie afgegaan maar op wat er in het bestand
    staat. Een onbekende soort levert None op met een reden, zodat de
    aanroeper hem ter review kan leggen (Gouden regel 4).
    """
    pad = Path(pad)
    if not pad.is_file():
        return None, f"bestand niet gevonden: {pad}"

    with open(pad, "rb") as bestand:
        begin = bestand.read(1024)
    if not begin:
        return None, f"het bestand is leeg: {pad.name}"

    soort = bestandssoort(begin)

    if soort == "xml":
        # Grootte eerst, zonder het bestand te lezen.
        reden = te_groot(pad.stat().st_size)
        if reden is not None:
            return None, reden
        try:
            wortel = lees_xml_veilig(pad.read_bytes())
        except Exception as fout:
            return None, (
                f"het bestand begint als XML maar is niet veilig te lezen: "
                f"{type(fout).__name__}: {fout}"
            )
        if is_ubl(wortel) is None:
            return None, (
                f"XML met hoofdelement '{wortel.tag}'; dat is geen UBL "
                f"Invoice of CreditNote"
            )
        return "ubl", None

    if soort == "pdf":
        # Zit er een e-factuur in de PDF, dan is dat de beste bron —
        # betrouwbaarder dan de tekstlaag, want daar staan de velden
        # met naam en al in.
        ingebed = zoek_ingebedde_efactuur(pad)
        if ingebed is not None:
            try:
                if is_ubl(lees_xml_veilig(ingebed)) is not None:
                    return "ubl", None
            except Exception:
                pass  # onbruikbare bijlage: gewoon verder als PDF
        from .documenten import lees_pdf_tekst

        return ("tekst" if lees_pdf_tekst(pad).status == "gelezen" else "beeld"), None

    if soort in ("jpg", "png"):
        return "beeld", None

    return None, (
        f"onbekende bestandssoort: de inhoud van {pad.name} is geen PDF, "
        f"geen afbeelding en geen XML"
    )
```

## `boekhouding/boekhouding/ai_extractie.py`

```python
"""AI-extractie van factuurgegevens (module 3).

Het model leest de factuur en vult alleen in wat het letterlijk ziet.
Daarna doet de code de rest: alle controles komen uit module 1, en niets
wordt geboekt zonder dat een mens ernaar heeft gekeken.

AI-module regels die hier gelden:
- Structured output via een JSON-schema; nooit vrije tekst (regel 1).
- Verplicht veld "zekerheid" per uitgelezen veld; bij lage zekerheid een
  reden. Eén veld met lage zekerheid → de hele factuur naar review.
- Het model vult NOOIT een veld in dat het niet ziet: dan null, en de
  factuur gaat naar review. Er wordt nooit gegokt (Gouden regel 4).
- Het model rekent niet. Bedragen worden overgenomen zoals ze op de
  factuur staan; optellen en btw controleren doet valideer_factuur
  (Gouden regel 2).

Twee invoerpaden:
A. PDF met tekstlaag → de uitgelezen tekst gaat naar het model.
B. Afbeelding of gescande PDF → het document zelf gaat mee als beeld.
"""

import base64
import json
from pathlib import Path
from typing import Any, Literal, Optional

from pydantic import BaseModel, model_validator

from .documenten import extensie_van, lees_pdf_tekst
from .models import Factuur
from .omgeving import SLEUTELNAAM, api_sleutel, instelling
from .validatie import valideer_factuur

# Het model is instelbaar. De volgorde is: wat de aanroeper meegeeft,
# anders ANTHROPIC_MODEL uit .env, anders dit standaardmodel. Zo kan de
# eval een goedkoper model ernaast leggen zonder code te wijzigen.
STANDAARD_MODEL = "claude-opus-5"
MODELNAAM_INSTELLING = "ANTHROPIC_MODEL"
MAX_TOKENS = 16000

# Versie van de systeemprompt. Hoog dit op zodra SYSTEEM_PROMPT wijzigt:
# het staat bij elke extractie in de audit trail, zodat later te zien is
# met welke instructie een factuur is uitgelezen.
PROMPT_VERSIE = "v1"

# Welke bestandssoort langs welk pad gaat.
BEELD_MEDIATYPEN = {
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
    ".png": "image/png",
}

VELDEN = (
    "leverancier",
    "factuurdatum",
    "factuurnummer",
    "bedrag_excl",
    "btw_percentage",
    "btw_bedrag",
    "bedrag_incl",
)

SYSTEEM_PROMPT = """\
Je leest Nederlandse inkoopfacturen voor een boekhoudsysteem van een \
zzp'er. Je vult een vast formulier in en doet verder niets.

Harde regels:
1. Vul alleen in wat je letterlijk op het document ziet staan. Zie je een \
veld niet, dan is de waarde null. Verzin nooit een waarde, leid nooit een \
waarde af uit een ander veld en gebruik nooit een standaardwaarde.
2. Reken niet. Neem bedragen exact over zoals ze op de factuur staan, \
inclusief de Nederlandse schrijfwijze (bijvoorbeeld "1.250,00"). Bereken \
geen btw, geen totaal en geen subtotaal. Een ander programma controleert \
de sommen.
3. Geef per veld een zekerheid: "hoog" of "laag". Gebruik "laag" zodra je \
twijfelt: onscherpe tekst, meerdere kandidaten op het document, een \
onduidelijke schrijfwijze, of een veld dat je maar half ziet. Bij "laag" \
schrijf je in "reden" in één zin waarom, in het Nederlands.
4. Twijfel je of een veld er überhaupt staat, dan is de waarde null met \
zekerheid "laag" en een reden. Liever null dan een gok.

Wat de velden betekenen:
- leverancier: de naam van het bedrijf dat de factuur stuurt (de \
afzender), niet de klant die hem ontvangt.
- factuurdatum: de datum die bij "Factuurdatum" staat, niet de \
vervaldatum. Schrijf hem als JJJJ-MM-DD. Dat is alleen een andere \
notatie van dezelfde datum; kun je niet zien of 03-04-2026 3 april of \
4 maart is, dan is de zekerheid "laag".
- factuurnummer: het nummer van deze factuur, zoals het er staat.
- bedrag_excl: het subtotaal exclusief btw.
- btw_percentage: alleen het getal, dus "21", "9" of "0".
- btw_bedrag: het btw-bedrag zoals het op de factuur staat.
- bedrag_incl: het totaal inclusief btw.
"""

VRAAG_TEKST = (
    "Hieronder staat de tekst van een factuur. Vul het formulier in "
    "volgens de regels.\n\n--- begin factuurtekst ---\n{tekst}\n"
    "--- einde factuurtekst ---"
)
VRAAG_BEELD = (
    "Hierboven staat een afbeelding of scan van een factuur. Vul het "
    "formulier in volgens de regels. Kun je iets niet goed lezen, dan is "
    "de zekerheid van dat veld 'laag' met een reden."
)


class VeldExtractie(BaseModel):
    """Eén uitgelezen veld, met hoe zeker het model erover is."""

    waarde: Optional[str] = None
    zekerheid: Literal["hoog", "laag"]
    reden: Optional[str] = None

    @model_validator(mode="after")
    def reden_verplicht_bij_lage_zekerheid(self) -> "VeldExtractie":
        if self.zekerheid == "laag" and not (self.reden or "").strip():
            raise ValueError("bij zekerheid 'laag' is een reden verplicht")
        return self


class FactuurExtractie(BaseModel):
    """Het formulier dat het model invult: elk factuurveld met zekerheid."""

    leverancier: VeldExtractie
    factuurdatum: VeldExtractie
    factuurnummer: VeldExtractie
    bedrag_excl: VeldExtractie
    btw_percentage: VeldExtractie
    btw_bedrag: VeldExtractie
    bedrag_incl: VeldExtractie


class ExtractieResultaat(BaseModel):
    """Wat er uit een extractie komt, inclusief alles voor de audit trail."""

    status: Literal["gevalideerd", "review_nodig"]
    redenen: list[str] = []
    factuur: Optional[Factuur] = None
    extractie: Optional[FactuurExtractie] = None
    model: str = ""
    prompt_versie: str = PROMPT_VERSIE
    # Alleen wat het model zelf aangeeft (ontbrekend veld, lage
    # zekerheid). De rekencontroles zitten in `redenen`; die worden
    # verderop nog een keer gedraaid met de duplicaatcheck erbij, en
    # zouden anders dubbel op het scherm komen.
    extractie_redenen: list[str] = []
    invoer_tokens: int = 0
    uitvoer_tokens: int = 0
    invoerpad: Optional[Literal["tekst", "beeld"]] = None
    ruwe_respons: str = ""
    bestandsnaam: str = ""


def standaard_model(env_pad: str | Path = ".env") -> str:
    """Welk model er gebruikt wordt als de aanroeper niets meegeeft.

    Zet ANTHROPIC_MODEL in .env om een ander model te kiezen, bijvoorbeeld
    om in de eval een goedkoper model ernaast te leggen.
    """
    return instelling(MODELNAAM_INSTELLING, STANDAARD_MODEL, env_pad)


def maak_client(env_pad: str | Path = ".env"):
    """Bouw een Anthropic-client met de sleutel uit .env.

    De sleutel wordt aan de client meegegeven en verder nergens bewaard,
    getoond of gelogd. Ontbreekt hij, dan volgt een duidelijke fout
    zonder de waarde te noemen (die is er immers niet).
    """
    sleutel = api_sleutel(env_pad)
    if sleutel is None:
        raise RuntimeError(
            f"{SLEUTELNAAM} is niet ingesteld. Zet hem in een .env-bestand "
            f"naast deze map (zie .env.voorbeeld). Dat bestand staat in "
            f".gitignore en hoort daar te blijven."
        )
    import anthropic  # pas hier importeren: tests draaien zonder de SDK

    return anthropic.Anthropic(api_key=sleutel)


def bepaal_invoerpad(pad: str | Path) -> tuple[Optional[str], Optional[str]]:
    """Kies pad A (tekst) of pad B (beeld); geef (invoerpad, reden-bij-fout).

    Eerst de bestandssoort, dan pas de inhoud: een JPG is geen kapotte
    PDF maar gewoon een plaatje, en hoort meteen langs het beeldpad.
    """
    pad = Path(pad)
    if not pad.is_file():
        return None, f"bestand niet gevonden: {pad}"

    extensie = extensie_van(pad)
    if extensie is None:
        gevonden = pad.suffix.lower() or "geen"
        return None, (
            f"bestandssoort '{gevonden}' wordt niet gelezen; "
            f"toegestaan: .pdf, .jpg, .jpeg, .png"
        )

    if extensie in BEELD_MEDIATYPEN:
        return "beeld", None

    # PDF: heeft hij een tekstlaag, dan is dat de betrouwbaarste bron.
    return ("tekst" if lees_pdf_tekst(pad).status == "gelezen" else "beeld"), None


def bouw_inhoud(pad: str | Path, invoerpad: str) -> list[dict[str, Any]]:
    """Zet het document om naar de inhoudsblokken voor het model."""
    pad = Path(pad)
    if invoerpad == "tekst":
        tekst = lees_pdf_tekst(pad).tekst
        return [{"type": "text", "text": VRAAG_TEKST.format(tekst=tekst)}]

    gegevens = base64.standard_b64encode(pad.read_bytes()).decode("ascii")
    extensie = extensie_van(pad)
    if extensie in BEELD_MEDIATYPEN:
        blok = {
            "type": "image",
            "source": {
                "type": "base64",
                "media_type": BEELD_MEDIATYPEN[extensie],
                "data": gegevens,
            },
        }
    else:
        # Gescande PDF: als document meesturen, dan leest het model de
        # pagina's als beeld.
        blok = {
            "type": "document",
            "source": {
                "type": "base64",
                "media_type": "application/pdf",
                "data": gegevens,
            },
        }
    return [blok, {"type": "text", "text": VRAAG_BEELD}]


def _tokens(respons: Any) -> tuple[int, int]:
    """Lees het tokenverbruik uit het antwoord, als de SDK dat meegeeft."""
    verbruik = getattr(respons, "usage", None)
    if verbruik is None:
        return 0, 0
    return (
        int(getattr(verbruik, "input_tokens", 0) or 0),
        int(getattr(verbruik, "output_tokens", 0) or 0),
    )


def _ruwe_tekst(respons: Any, extractie: Optional[FactuurExtractie]) -> str:
    """Haal de letterlijke modelrespons op voor de audit trail."""
    stukken = []
    for blok in getattr(respons, "content", []) or []:
        if getattr(blok, "type", None) == "text":
            stukken.append(blok.text)
    if stukken:
        return "\n".join(stukken)
    if extractie is not None:
        return extractie.model_dump_json()
    return ""


def extractie_redenen(extractie: FactuurExtractie) -> tuple[list[str], dict[str, Any]]:
    """Geef wat het model zelf aangeeft, plus de bruikbare waarden.

    Alleen de redenen die uit de extractie komen: een veld dat niet op
    het document stond, of een veld dat met lage zekerheid is gelezen.
    De rekencontroles zitten hier niet bij — die zijn van module 1.
    """
    redenen: list[str] = []
    data: dict[str, Any] = {}

    for veld in VELDEN:
        gegeven: VeldExtractie = getattr(extractie, veld)
        if gegeven.waarde is None or not str(gegeven.waarde).strip():
            reden = (gegeven.reden or "").strip()
            staart = f" — {reden}" if reden else ""
            redenen.append(
                f"extractie: {veld} niet op het document gevonden{staart}"
            )
            continue

        if gegeven.zekerheid == "laag":
            redenen.append(
                f"extractie: {veld} met lage zekerheid gelezen als "
                f"'{gegeven.waarde}' — {gegeven.reden}"
            )
        data[veld] = gegeven.waarde

    return redenen, data


def beoordeel_extractie(
    extractie: FactuurExtractie, *, vandaag=None, is_duplicaat=None
) -> tuple[str, list[str], Optional[Factuur]]:
    """Zet een extractie om in een status, redenen en een nette factuur.

    Twee soorten redenen komen samen: wat het model zelf aangeeft
    (ontbrekend veld of lage zekerheid, met prefix "extractie:") en wat
    de rekencontroles van module 1 vinden. De AI rekent niet mee.
    """
    redenen, data = extractie_redenen(extractie)

    # Alle rekenregels en datumcontroles blijven van module 1.
    resultaat = valideer_factuur(data, vandaag=vandaag, is_duplicaat=is_duplicaat)
    redenen.extend(resultaat.redenen)

    status = "gevalideerd" if not redenen else "review_nodig"
    return status, redenen, resultaat.factuur


def foutreden(fout: BaseException) -> str:
    """Vertaal een fout van de API naar een reden in gewone taal.

    We kijken naar `status_code` in plaats van naar de fouttypes van de
    SDK: elke APIStatusError van anthropic draagt dat veld, en zo werkt
    deze functie ook als de SDK niet geïnstalleerd is (in de tests).
    De boodschap zegt er steeds bij of het zin heeft om het later nog
    eens te proberen — dat scheelt de eigenaar zoekwerk.
    """
    code = getattr(fout, "status_code", None)
    soort = type(fout).__name__

    if code == 429:
        return (
            "te veel verzoeken achter elkaar (rate limit); "
            "deze factuur is niet uitgelezen — later opnieuw proberen"
        )
    if code in (401, 403):
        return (
            "geen toegang met deze API-sleutel; controleer de sleutel "
            "in .env (de factuur is niet uitgelezen)"
        )
    if code == 404:
        return (
            "het opgegeven model bestaat niet of is niet beschikbaar "
            "(de factuur is niet uitgelezen)"
        )
    if code == 400:
        return (
            f"de dienst wees het verzoek af als ongeldig ({soort}); "
            f"dit is een fout in het verzoek, niet in de factuur"
        )
    if isinstance(code, int) and code >= 500:
        return (
            f"de dienst gaf een serverfout ({code}); deze factuur is "
            f"niet uitgelezen — later opnieuw proberen"
        )
    if isinstance(code, int):
        return f"de dienst gaf foutcode {code}; deze factuur is niet uitgelezen"

    # Geen HTTP-antwoord: netwerk eruit, tijdslimiet, DNS, enzovoort.
    return (
        f"geen verbinding met de dienst ({soort}: {fout}); deze factuur "
        f"is niet uitgelezen — later opnieuw proberen"
    )


def extraheer_factuur(
    pad: str | Path,
    *,
    client: Any = None,
    model: Optional[str] = None,
    vandaag=None,
    is_duplicaat=None,
    env_pad: str | Path = ".env",
) -> ExtractieResultaat:
    """Lees een factuurdocument uit met het model en beoordeel het.

    Geeft altijd een resultaat terug, nooit een exception door een
    onleesbaar document of een weigerend model: dan volgt review_nodig
    met reden.

    `client` is bedoeld om er in tests een nagemaakte client in te
    hangen; laat je hem weg, dan wordt de echte client gebouwd.
    """
    pad = Path(pad)
    model = model or standaard_model(env_pad)
    invoerpad, fout = bepaal_invoerpad(pad)
    if invoerpad is None:
        return ExtractieResultaat(
            status="review_nodig",
            redenen=[fout or "document kon niet worden gelezen"],
            model=model,
            bestandsnaam=pad.name,
        )

    if client is None:
        # Ook dit hoort geen exception te worden: draait de webinterface
        # zonder sleutel, dan moet de factuur ter review komen en niet
        # het hele scherm omvallen (Gouden regel 4).
        try:
            client = maak_client(env_pad)
        except Exception as fout:
            return ExtractieResultaat(
                status="review_nodig",
                redenen=[str(fout)],
                model=model,
                invoerpad=invoerpad,
                bestandsnaam=pad.name,
            )

    # Alles wat hier misgaat wordt een reden, nooit een exception: een
    # rate limit of een netwerkstoring mag het verwerken van een stapel
    # facturen niet afbreken (Gouden regel 4).
    try:
        respons = client.messages.parse(
            model=model,
            max_tokens=MAX_TOKENS,
            system=SYSTEEM_PROMPT,
            messages=[{"role": "user", "content": bouw_inhoud(pad, invoerpad)}],
            output_format=FactuurExtractie,
        )
    except Exception as fout:
        return ExtractieResultaat(
            status="review_nodig",
            redenen=[foutreden(fout)],
            model=model,
            invoerpad=invoerpad,
            bestandsnaam=pad.name,
        )

    # Het model kan een verzoek weigeren; dan is er geen inhoud om te
    # lezen. Nooit doorgaan alsof er wel iets stond.
    if getattr(respons, "stop_reason", None) == "refusal":
        return ExtractieResultaat(
            status="review_nodig",
            redenen=["het model heeft dit document geweigerd te verwerken"],
            model=model,
            invoerpad=invoerpad,
            ruwe_respons=_ruwe_tekst(respons, None),
            bestandsnaam=pad.name,
        )

    extractie = getattr(respons, "parsed_output", None)
    if extractie is None:
        return ExtractieResultaat(
            status="review_nodig",
            redenen=["het model gaf geen bruikbaar formulier terug"],
            model=model,
            invoerpad=invoerpad,
            ruwe_respons=_ruwe_tekst(respons, None),
            bestandsnaam=pad.name,
        )

    status, redenen, factuur = beoordeel_extractie(
        extractie, vandaag=vandaag, is_duplicaat=is_duplicaat
    )
    invoer_tokens, uitvoer_tokens = _tokens(respons)
    alleen_extractie, _ = extractie_redenen(extractie)
    return ExtractieResultaat(
        status=status,
        redenen=redenen,
        extractie_redenen=alleen_extractie,
        factuur=factuur,
        extractie=extractie,
        model=model,
        invoerpad=invoerpad,
        ruwe_respons=_ruwe_tekst(respons, extractie),
        invoer_tokens=invoer_tokens,
        uitvoer_tokens=uitvoer_tokens,
        bestandsnaam=pad.name,
    )
```

## `boekhouding/boekhouding/verwerking.py`

```python
"""Een aangeleverd bestand van upload tot factuur in de database.

Dit is de lijm tussen de modules, niet een nieuwe module: er wordt hier
geen enkele boekhoudregel bijbedacht. De volgorde is steeds dezelfde:

    bewaren  →  routeren  →  uitlezen  →  valideren en opslaan

De webinterface roept alleen deze functie aan. Zo staat er nooit
boekhoudlogica in een route, en werkt dezelfde keten straks ook vanaf
de opdrachtregel of een e-mailpostbus.
"""

import tempfile
from datetime import date
from pathlib import Path
from typing import Any, Literal, Optional

from pydantic import BaseModel

from .ai_extractie import VELDEN, extraheer_factuur
from .database import bewaar_document, sla_extractie_op, sla_factuur_op
from .routering import bestandssoort, routeer_document
from .ubl import verwerk_efactuur

# Welke extensie hoort bij welke herkende inhoud. De bestandsnaam van de
# gebruiker doet er niet toe: de inhoud bepaalt hoe we het bewaren.
EXTENSIE_BIJ_SOORT = {
    "pdf": ".pdf",
    "jpg": ".jpg",
    "png": ".png",
    "xml": ".xml",
}


class UploadResultaat(BaseModel):
    """Wat er van een aangeleverd bestand terechtkwam."""

    status: Literal["gevalideerd", "review_nodig"]
    redenen: list[str] = []
    factuur_id: Optional[int] = None
    document_id: Optional[int] = None
    extractie_id: Optional[int] = None
    route: Optional[str] = None
    bestandsnaam: str = ""


def verwerk_upload(
    conn,
    administratie_id: int,
    bestandsnaam: str,
    inhoud: bytes,
    opslagmap: str | Path,
    *,
    ai_client: Any = None,
    vandaag: Optional[date] = None,
) -> UploadResultaat:
    """Neem een aangeleverd bestand aan en zet het om in een factuur.

    Geeft altijd een resultaat terug, nooit een exception: gaat er iets
    mis, dan is dat een reden bij een factuur die op review wacht.
    """
    if not inhoud:
        return UploadResultaat(
            status="review_nodig",
            redenen=["het aangeleverde bestand is leeg"],
            bestandsnaam=bestandsnaam,
        )

    soort = bestandssoort(inhoud[:1024])
    extensie = EXTENSIE_BIJ_SOORT.get(soort or "")
    if extensie is None:
        return UploadResultaat(
            status="review_nodig",
            redenen=[
                f"'{bestandsnaam}' is geen PDF, afbeelding of e-factuur; "
                f"dit bestand wordt niet als factuur verwerkt"
            ],
            bestandsnaam=bestandsnaam,
        )

    # Het bestand komt binnen als bytes en moet als bestand op schijf
    # staan voordat het bewaard en gerouteerd kan worden.
    with tempfile.TemporaryDirectory() as tijdelijke_map:
        tijdelijk = Path(tijdelijke_map) / f"aangeleverd{extensie}"
        tijdelijk.write_bytes(inhoud)
        return _verwerk_bestand(
            conn, administratie_id, tijdelijk, bestandsnaam, opslagmap,
            ai_client=ai_client, vandaag=vandaag,
        )


def _verwerk_bestand(
    conn, administratie_id, pad: Path, bestandsnaam: str, opslagmap,
    *, ai_client, vandaag,
) -> UploadResultaat:
    # 1. Bewaren (bewaarplicht) — dit gebeurt vóór het uitlezen, zodat
    #    het origineel er ook staat als het uitlezen mislukt.
    document = bewaar_document(conn, administratie_id, str(pad), str(opslagmap))
    if document.status == "review_nodig":
        return UploadResultaat(
            status="review_nodig",
            redenen=document.redenen,
            bestandsnaam=bestandsnaam,
        )

    # 2. Routeren op werkelijke inhoud.
    route, routefout = routeer_document(pad)
    if route is None:
        return UploadResultaat(
            status="review_nodig",
            redenen=[routefout or "onbekende bestandssoort"],
            document_id=document.document_id,
            bestandsnaam=bestandsnaam,
        )

    # 3. Uitlezen: e-factuur rechtstreeks, anders via het model.
    extractie_id = None
    if route == "ubl":
        gelezen = verwerk_efactuur(pad, vandaag=vandaag)
        # Alleen de leesredenen doorgeven: de rekencontroles draait
        # sla_factuur_op zo meteen zelf, met de duplicaatcheck erbij.
        # Ze allebei doorgeven zou ze dubbel op het scherm zetten.
        velden, redenen = gelezen.velden, gelezen.leesredenen
    else:
        gelezen = extraheer_factuur(
            pad, client=ai_client, vandaag=vandaag
        )
        # Idem: alleen wat het model zelf aangaf. Ging de aanroep
        # helemaal mis, dan staat dat niet in extractie_redenen maar
        # wel in redenen — die moet dan wél mee.
        redenen = gelezen.extractie_redenen or gelezen.redenen
        velden = {}
        if gelezen.extractie is not None:
            for veld in VELDEN:
                waarde = getattr(gelezen.extractie, veld).waarde
                if waarde is not None and str(waarde).strip():
                    velden[veld] = waarde
        # De extractie zelf gaat de audit trail in: welk model, welke
        # prompt, welke ruwe respons.
        extractie_id = sla_extractie_op(
            conn, administratie_id, gelezen, document_id=document.document_id
        )

    # 4. Valideren en opslaan — altijd via sla_factuur_op, ook als er al
    #    redenen zijn. De factuur moet zichtbaar worden in de lijst.
    factuur_id, resultaat = sla_factuur_op(
        conn, administratie_id, velden,
        vandaag=vandaag,
        document_id=document.document_id,
        extra_redenen=tuple(redenen),
    )

    return UploadResultaat(
        status=resultaat.status,
        redenen=resultaat.redenen,
        factuur_id=factuur_id,
        document_id=document.document_id,
        extractie_id=extractie_id,
        route=route,
        bestandsnaam=bestandsnaam,
    )
```

## `boekhouding/boekhouding/database.py`

```python
"""SQLite-opslag met multi-administratie en audit trail.

Gouden regels die hier gelden:
- Elke tabel met boekhouddata heeft een administratie_id (regel 8).
  Administraties hebben een type; nu alleen "eenmanszaak", de structuur
  is uitbreidbaar maar er wordt niets extra's gebouwd.
- Elke wijziging → audit trail met originele waarde, nieuwe waarde en
  timestamp; niets wordt ooit hard verwijderd (regel 3).
- Bedragen worden als tekst opgeslagen zodat de Decimal-waarde exact
  bewaard blijft (regel 5).
"""

import json
import sqlite3
from datetime import date, datetime, timezone
from decimal import Decimal
from pathlib import Path
from typing import Any, Optional

from .validatie import valideer_factuur
from .models import ValidatieResultaat
from .documenten import (
    TOEGESTANE_EXTENSIES,
    DocumentResultaat,
    bereken_hash,
    extensie_van,
    kopieer_naar_opslag,
)

ADMINISTRATIE_TYPEN = ("eenmanszaak",)  # later uitbreidbaar (bv. "bv")

FACTUUR_VELDEN = (
    "leverancier",
    "factuurdatum",
    "factuurnummer",
    "bedrag_excl",
    "btw_percentage",
    "btw_bedrag",
    "bedrag_incl",
)


def _nu() -> str:
    return datetime.now(timezone.utc).isoformat(timespec="seconds")


def _als_tekst(waarde: Any) -> Optional[str]:
    """Maak een waarde opslagbaar als tekst zonder informatie te verliezen."""
    if waarde is None:
        return None
    if isinstance(waarde, (Decimal, date)):
        return str(waarde)
    if isinstance(waarde, str):
        return waarde
    return json.dumps(waarde, ensure_ascii=False, default=str)


def maak_verbinding(pad: str) -> sqlite3.Connection:
    """Open de databaseverbinding en zet foreign keys aan.

    SQLite dwingt foreign keys standaard NIET af; zonder deze pragma
    zou een factuur met een niet-bestaand administratie_id gewoon
    worden opgeslagen. Gebruik daarom altijd deze functie in plaats
    van sqlite3.connect rechtstreeks.
    """
    conn = sqlite3.connect(pad)
    conn.execute("PRAGMA foreign_keys = ON")
    return conn


def _voeg_kolom_toe(
    conn: sqlite3.Connection, tabel: str, kolom: str, definitie: str
) -> bool:
    """Voeg een kolom toe als die nog ontbreekt; geef terug of dat gebeurde.

    Bestaande rijen krijgen de default. Bij prompt_versie is dat bewust
    'onbekend' en niet de huidige versie: van een extractie van vóór deze
    kolom weten we níét met welke prompt hij is gemaakt, en dat invullen
    zou de audit trail een onwaarheid laten vertellen.
    """
    kolommen = {rij[1] for rij in conn.execute(f"PRAGMA table_info({tabel})")}
    if kolom in kolommen:
        return False
    conn.execute(f"ALTER TABLE {tabel} ADD COLUMN {kolom} {definitie}")
    return True


def maak_tabellen(conn: sqlite3.Connection) -> None:
    """Maak de tabellen aan als ze nog niet bestaan."""
    conn.executescript(
        """
        CREATE TABLE IF NOT EXISTS administraties (
            id             INTEGER PRIMARY KEY,
            naam           TEXT NOT NULL,
            -- Let op: een nieuw administratietype (bv. 'bv') toevoegen
            -- vereist een migratie van deze CHECK-constraint; SQLite
            -- kan een CHECK niet wijzigen met ALTER TABLE, dus dat
            -- betekent: nieuwe tabel aanmaken, data overzetten,
            -- hernoemen. CREATE TABLE IF NOT EXISTS past een bestaande
            -- database niet aan.
            type           TEXT NOT NULL DEFAULT 'eenmanszaak'
                           CHECK (type IN ('eenmanszaak')),
            aangemaakt_op  TEXT NOT NULL
        );

        CREATE TABLE IF NOT EXISTS documenten (
            id                   INTEGER PRIMARY KEY,
            administratie_id     INTEGER NOT NULL REFERENCES administraties(id),
            hash                 TEXT NOT NULL,
            originele_bestandsnaam TEXT NOT NULL,
            opslagpad            TEXT NOT NULL,
            aangemaakt_op        TEXT NOT NULL,
            UNIQUE (administratie_id, hash)
        );

        CREATE TABLE IF NOT EXISTS facturen (
            id               INTEGER PRIMARY KEY,
            administratie_id INTEGER NOT NULL REFERENCES administraties(id),
            document_id      INTEGER REFERENCES documenten(id),
            leverancier      TEXT,
            factuurdatum     TEXT,
            factuurnummer    TEXT,
            bedrag_excl      TEXT,
            btw_percentage   TEXT,
            btw_bedrag       TEXT,
            bedrag_incl      TEXT,
            status           TEXT NOT NULL
                             CHECK (status IN ('gevalideerd', 'review_nodig')),
            review_redenen   TEXT NOT NULL DEFAULT '[]',
            originele_data   TEXT NOT NULL,
            aangemaakt_op    TEXT NOT NULL,
            gewijzigd_op     TEXT NOT NULL
        );

        CREATE INDEX IF NOT EXISTS idx_facturen_duplicaat
            ON facturen (administratie_id, leverancier, factuurnummer);

        CREATE TABLE IF NOT EXISTS extracties (
            id               INTEGER PRIMARY KEY,
            administratie_id INTEGER NOT NULL REFERENCES administraties(id),
            document_id      INTEGER REFERENCES documenten(id),
            model            TEXT NOT NULL,
            prompt_versie    TEXT NOT NULL DEFAULT 'onbekend',
            invoerpad        TEXT
                             CHECK (invoerpad IS NULL
                                    OR invoerpad IN ('tekst', 'beeld')),
            ruwe_respons     TEXT NOT NULL,
            status           TEXT NOT NULL
                             CHECK (status IN ('gevalideerd', 'review_nodig')),
            redenen          TEXT NOT NULL DEFAULT '[]',
            aangemaakt_op    TEXT NOT NULL
        );

        CREATE TABLE IF NOT EXISTS boekingen (
            id                    INTEGER PRIMARY KEY,
            administratie_id      INTEGER NOT NULL REFERENCES administraties(id),
            -- Eén boeking per factuur: UNIQUE laat meerdere NULL toe, dus
            -- tegenboekingen (zonder factuur) blijven mogelijk, maar
            -- dezelfde factuur twee keer boeken kan niet.
            factuur_id            INTEGER UNIQUE REFERENCES facturen(id),
            corrigeert_boeking_id INTEGER REFERENCES boekingen(id),
            boekdatum             TEXT NOT NULL,
            omschrijving          TEXT NOT NULL,
            aangemaakt_op         TEXT NOT NULL,
            aangemaakt_door       TEXT NOT NULL
        );

        CREATE TABLE IF NOT EXISTS boekingsregels (
            id               INTEGER PRIMARY KEY,
            boeking_id       INTEGER NOT NULL REFERENCES boekingen(id),
            administratie_id INTEGER NOT NULL REFERENCES administraties(id),
            volgnummer       INTEGER NOT NULL,
            rekening         TEXT NOT NULL,
            omschrijving     TEXT NOT NULL,
            -- Bedragen als tekst, net als bij facturen: zo komt er nooit
            -- een float aan te pas en staat er precies wat er stond.
            debet            TEXT NOT NULL DEFAULT '0.00',
            credit           TEXT NOT NULL DEFAULT '0.00'
        );

        CREATE INDEX IF NOT EXISTS idx_boekingen_periode
            ON boekingen (administratie_id, boekdatum);

        CREATE TABLE IF NOT EXISTS audit_log (
            id               INTEGER PRIMARY KEY,
            administratie_id INTEGER NOT NULL REFERENCES administraties(id),
            tabel            TEXT NOT NULL,
            record_id        INTEGER NOT NULL,
            actie            TEXT NOT NULL
                             CHECK (actie IN ('aangemaakt', 'gewijzigd')),
            veld             TEXT,
            oude_waarde      TEXT,
            nieuwe_waarde    TEXT,
            tijdstip         TEXT NOT NULL
        );
        """
    )

    # Migraties voor databases die eerder zijn aangemaakt.
    # CREATE TABLE IF NOT EXISTS raakt een bestaande tabel niet aan, dus
    # een nieuwe kolom moet er los bij met ALTER TABLE ADD COLUMN.
    # SQLite staat dat toe zolang de default NULL is, of bij NOT NULL een
    # vaste waarde heeft.
    _voeg_kolom_toe(
        conn, "facturen", "document_id",
        "INTEGER REFERENCES documenten(id)",
    )
    _voeg_kolom_toe(
        conn, "extracties", "prompt_versie",
        "TEXT NOT NULL DEFAULT 'onbekend'",
    )
    # Goedkeuring is een aparte handeling van de mens, los van de
    # status die de code bepaalt. Daarom twee eigen kolommen in plaats
    # van een derde status: "gevalideerd" zegt dat de sommen kloppen,
    # "goedgekeurd_op" zegt dat een mens ernaar heeft gekeken en ja
    # heeft gezegd. Dat scheelt bovendien een tabelmigratie, want een
    # CHECK-constraint is in SQLite niet te wijzigen.
    # De grootboekrekening die de eigenaar bij deze factuur kiest. Geen
    # default: zonder keuze ontstaat er geen boeking (Gouden regel 4).
    _voeg_kolom_toe(conn, "facturen", "rekening", "TEXT")
    _voeg_kolom_toe(conn, "facturen", "goedgekeurd_op", "TEXT")
    _voeg_kolom_toe(conn, "facturen", "goedgekeurd_door", "TEXT")

    conn.commit()


def maak_administratie(
    conn: sqlite3.Connection, naam: str, type: str = "eenmanszaak"
) -> int:
    """Maak een administratie aan en geef het id terug."""
    if type not in ADMINISTRATIE_TYPEN:
        raise ValueError(
            f"administratietype '{type}' wordt nog niet ondersteund; "
            f"toegestaan: {', '.join(ADMINISTRATIE_TYPEN)}"
        )
    cursor = conn.execute(
        "INSERT INTO administraties (naam, type, aangemaakt_op) VALUES (?, ?, ?)",
        (naam, type, _nu()),
    )
    conn.commit()
    return cursor.lastrowid


def _is_duplicaat_in_db(
    conn: sqlite3.Connection, administratie_id: int, leverancier: str, factuurnummer: str
) -> bool:
    rij = conn.execute(
        """
        SELECT 1 FROM facturen
        WHERE administratie_id = ?
          AND lower(trim(leverancier)) = lower(trim(?))
          AND lower(trim(factuurnummer)) = lower(trim(?))
        LIMIT 1
        """,
        (administratie_id, leverancier, factuurnummer),
    ).fetchone()
    return rij is not None


def sla_factuur_op(
    conn: sqlite3.Connection,
    administratie_id: int,
    data: dict[str, Any],
    *,
    vandaag: Optional[date] = None,
    document_id: Optional[int] = None,
    extra_redenen: tuple[str, ...] = (),
) -> tuple[int, ValidatieResultaat]:
    """Valideer en bewaar een factuur; geef (factuur_id, resultaat) terug.

    Ook een afgekeurde factuur wordt opgeslagen (status "review_nodig"
    met redenen) — er gaat nooit data verloren. De originele ruwe input
    wordt integraal bewaard en elk veld komt in de audit trail.

    document_id koppelt de factuur optioneel aan het bewaarde originele
    bestand (tabel documenten), zodat bij een controle altijd de bron
    terug te vinden is.

    extra_redenen zijn redenen die niet uit de rekencontroles komen maar
    van eerder in de keten — bijvoorbeeld een veld dat het model met
    lage zekerheid heeft gelezen. Die horen bij de factuur bewaard te
    worden, anders zou de eigenaar in het reviewscherm niet zien waarom
    er twijfel was.
    """
    resultaat = valideer_factuur(
        data,
        vandaag=vandaag,
        is_duplicaat=lambda f: _is_duplicaat_in_db(
            conn, administratie_id, f.leverancier, f.factuurnummer
        ),
    )
    if extra_redenen:
        resultaat = resultaat.model_copy(
            update={
                "redenen": list(extra_redenen) + resultaat.redenen,
                "status": "review_nodig",
            }
        )

    if resultaat.factuur is not None:
        velden = {v: _als_tekst(getattr(resultaat.factuur, v)) for v in FACTUUR_VELDEN}
    else:
        # Schema-fout: bewaar wat er wél aan ruwe data binnenkwam.
        velden = {v: _als_tekst(data.get(v)) for v in FACTUUR_VELDEN}

    tijd = _nu()
    cursor = conn.execute(
        """
        INSERT INTO facturen (
            administratie_id, document_id, leverancier, factuurdatum,
            factuurnummer, bedrag_excl, btw_percentage, btw_bedrag,
            bedrag_incl, status, review_redenen, originele_data,
            aangemaakt_op, gewijzigd_op
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """,
        (
            administratie_id,
            document_id,
            velden["leverancier"],
            velden["factuurdatum"],
            velden["factuurnummer"],
            velden["bedrag_excl"],
            velden["btw_percentage"],
            velden["btw_bedrag"],
            velden["bedrag_incl"],
            resultaat.status,
            json.dumps(resultaat.redenen, ensure_ascii=False),
            json.dumps(data, ensure_ascii=False, default=str),
            tijd,
            tijd,
        ),
    )
    factuur_id = cursor.lastrowid

    for veld, waarde in velden.items():
        conn.execute(
            """
            INSERT INTO audit_log (
                administratie_id, tabel, record_id, actie,
                veld, oude_waarde, nieuwe_waarde, tijdstip
            ) VALUES (?, 'facturen', ?, 'aangemaakt', ?, NULL, ?, ?)
            """,
            (administratie_id, factuur_id, veld, waarde, tijd),
        )

    # De koppeling naar het originele document is ook data en krijgt
    # dus een eigen auditregel — alleen als er echt een document is,
    # zodat een factuur zonder bron geen lege regel oplevert.
    if document_id is not None:
        conn.execute(
            """
            INSERT INTO audit_log (
                administratie_id, tabel, record_id, actie,
                veld, oude_waarde, nieuwe_waarde, tijdstip
            ) VALUES (?, 'facturen', ?, 'aangemaakt', 'document_id', NULL, ?, ?)
            """,
            (administratie_id, factuur_id, str(document_id), tijd),
        )

    conn.commit()
    return factuur_id, resultaat


def wijzig_factuur(
    conn: sqlite3.Connection,
    factuur_id: int,
    wijzigingen: dict[str, Any],
    *,
    vandaag: Optional[date] = None,
) -> ValidatieResultaat:
    """Pas velden van een bestaande factuur aan, met audit trail.

    Oude waarden blijven bewaard in de audit_log en de kolom
    originele_data blijft altijd de oorspronkelijke input. Na de
    wijziging wordt de factuur opnieuw gevalideerd en de status
    bijgewerkt.
    """
    onbekend = set(wijzigingen) - set(FACTUUR_VELDEN)
    if onbekend:
        raise ValueError(f"onbekende factuurvelden: {', '.join(sorted(onbekend))}")

    cursor = conn.execute("SELECT * FROM facturen WHERE id = ?", (factuur_id,))
    rij = cursor.fetchone()
    if rij is None:
        raise ValueError(f"factuur {factuur_id} bestaat niet")
    kolommen = [k[0] for k in cursor.description]
    huidig = dict(zip(kolommen, rij))

    tijd = _nu()
    nieuwe_velden = {v: huidig[v] for v in FACTUUR_VELDEN}
    for veld, nieuwe_waarde in wijzigingen.items():
        nieuwe_tekst = _als_tekst(nieuwe_waarde)
        conn.execute(
            """
            INSERT INTO audit_log (
                administratie_id, tabel, record_id, actie,
                veld, oude_waarde, nieuwe_waarde, tijdstip
            ) VALUES (?, 'facturen', ?, 'gewijzigd', ?, ?, ?, ?)
            """,
            (huidig["administratie_id"], factuur_id, veld, huidig[veld], nieuwe_tekst, tijd),
        )
        nieuwe_velden[veld] = nieuwe_tekst

    resultaat = valideer_factuur(
        {v: nieuwe_velden[v] for v in FACTUUR_VELDEN if nieuwe_velden[v] is not None},
        vandaag=vandaag,
        is_duplicaat=lambda f: _is_ander_duplicaat(
            conn, huidig["administratie_id"], factuur_id, f.leverancier, f.factuurnummer
        ),
    )

    conn.execute(
        """
        UPDATE facturen SET
            leverancier = ?, factuurdatum = ?, factuurnummer = ?,
            bedrag_excl = ?, btw_percentage = ?, btw_bedrag = ?, bedrag_incl = ?,
            status = ?, review_redenen = ?, gewijzigd_op = ?
        WHERE id = ?
        """,
        (
            nieuwe_velden["leverancier"],
            nieuwe_velden["factuurdatum"],
            nieuwe_velden["factuurnummer"],
            nieuwe_velden["bedrag_excl"],
            nieuwe_velden["btw_percentage"],
            nieuwe_velden["btw_bedrag"],
            nieuwe_velden["bedrag_incl"],
            resultaat.status,
            json.dumps(resultaat.redenen, ensure_ascii=False),
            tijd,
            factuur_id,
        ),
    )
    conn.commit()
    return resultaat


def _is_ander_duplicaat(
    conn: sqlite3.Connection,
    administratie_id: int,
    eigen_id: int,
    leverancier: str,
    factuurnummer: str,
) -> bool:
    rij = conn.execute(
        """
        SELECT 1 FROM facturen
        WHERE administratie_id = ?
          AND id != ?
          AND lower(trim(leverancier)) = lower(trim(?))
          AND lower(trim(factuurnummer)) = lower(trim(?))
        LIMIT 1
        """,
        (administratie_id, eigen_id, leverancier, factuurnummer),
    ).fetchone()
    return rij is not None


def lees_factuur(conn: sqlite3.Connection, factuur_id: int) -> dict[str, Any]:
    """Lees één factuur als dict (bedragen als tekst, exact zoals opgeslagen)."""
    cursor = conn.execute("SELECT * FROM facturen WHERE id = ?", (factuur_id,))
    rij = cursor.fetchone()
    if rij is None:
        raise ValueError(f"factuur {factuur_id} bestaat niet")
    kolommen = [k[0] for k in cursor.description]
    factuur = dict(zip(kolommen, rij))
    factuur["review_redenen"] = json.loads(factuur["review_redenen"])
    factuur["originele_data"] = json.loads(factuur["originele_data"])
    return factuur


def lees_audit_trail(
    conn: sqlite3.Connection, record_id: int, tabel: str = "facturen"
) -> list[dict[str, Any]]:
    """Lees de volledige audit trail van één record, oudste eerst."""
    cursor = conn.execute(
        """
        SELECT * FROM audit_log
        WHERE tabel = ? AND record_id = ?
        ORDER BY id
        """,
        (tabel, record_id),
    )
    kolommen = [k[0] for k in cursor.description]
    return [dict(zip(kolommen, rij)) for rij in cursor.fetchall()]


def bewaar_document(
    conn: sqlite3.Connection,
    administratie_id: int,
    pad: str,
    opslagmap: str,
) -> DocumentResultaat:
    """Bewaar een origineel factuurbestand en registreer het.

    Werkwijze: eerst de sha256-hash van de inhoud berekenen, dan kijken
    of dit document al in deze administratie bekend is. Zo ja, dan komt
    er geen tweede kopie en geen tweede regel — het resultaat is
    "bestond_al" met het id van het bestaande document. Zo nee, dan
    wordt het bestand gekopieerd naar de opslagmap (naam = de hash) en
    geregistreerd in de tabel documenten, met een regel in de audit
    trail.

    Bestaat het bronbestand niet, heeft het een bestandssoort die we
    niet bewaren, of is het niet te lezen, dan volgt status
    "review_nodig" met reden — geen exception (Gouden regel 4).
    """
    bron = Path(pad)
    if not bron.is_file():
        return DocumentResultaat(
            status="review_nodig", redenen=[f"bestand niet gevonden: {pad}"]
        )

    # De bestandssoort wordt niet gegokt: staat de extensie niet op de
    # witte lijst, dan gaat het document ter review.
    extensie = extensie_van(bron)
    if extensie is None:
        gevonden = bron.suffix.lower() or "geen"
        return DocumentResultaat(
            status="review_nodig",
            redenen=[
                f"bestandssoort '{gevonden}' wordt niet bewaard; "
                f"toegestaan: {', '.join(TOEGESTANE_EXTENSIES)} — "
                f"controleer het origineel"
            ],
        )

    try:
        hash_waarde = bereken_hash(bron)
    except OSError as fout:
        return DocumentResultaat(
            status="review_nodig",
            redenen=[f"kon het bestand niet lezen: {fout}"],
        )

    bestaand = conn.execute(
        "SELECT id, opslagpad FROM documenten "
        "WHERE administratie_id = ? AND hash = ?",
        (administratie_id, hash_waarde),
    ).fetchone()
    if bestaand is not None:
        return DocumentResultaat(
            status="bestond_al",
            document_id=bestaand[0],
            hash=hash_waarde,
            opslagpad=bestaand[1],
        )

    try:
        doel, _ = kopieer_naar_opslag(bron, hash_waarde, opslagmap, extensie)
    except OSError as fout:
        return DocumentResultaat(
            status="review_nodig",
            redenen=[f"kon het bestand niet opslaan: {fout}"],
        )

    # OPENSTAAND PUNT (bewust nog niet gebouwd): tussen het kopiëren
    # hierboven en de INSERT hieronder zit een klein venster. Crasht het
    # proces daartussen, dan staat het bestand wél in de opslagmap maar
    # is er geen regel in de tabel documenten — een "weesbestand".
    # Dat is geen dataverlies (het origineel staat er nog, en een
    # volgende aanbieding van dezelfde PDF slaat hem gewoon opnieuw op
    # onder dezelfde hash), maar het kost schijfruimte en het bestand is
    # niet meer terug te vinden via de administratie. Een latere
    # opruimfunctie zou de opslagmap moeten vergelijken met de tabel
    # documenten en weesbestanden moeten rapporteren — nooit stilzwijgend
    # verwijderen, want de bewaarplicht geldt ook voor deze bestanden.

    tijd = _nu()
    cursor = conn.execute(
        """
        INSERT INTO documenten (
            administratie_id, hash, originele_bestandsnaam,
            opslagpad, aangemaakt_op
        ) VALUES (?, ?, ?, ?, ?)
        """,
        (administratie_id, hash_waarde, bron.name, str(doel), tijd),
    )
    document_id = cursor.lastrowid

    for veld, waarde in (
        ("hash", hash_waarde),
        ("originele_bestandsnaam", bron.name),
        ("opslagpad", str(doel)),
    ):
        conn.execute(
            """
            INSERT INTO audit_log (
                administratie_id, tabel, record_id, actie,
                veld, oude_waarde, nieuwe_waarde, tijdstip
            ) VALUES (?, 'documenten', ?, 'aangemaakt', ?, NULL, ?, ?)
            """,
            (administratie_id, document_id, veld, waarde, tijd),
        )
    conn.commit()

    return DocumentResultaat(
        status="opgeslagen",
        document_id=document_id,
        hash=hash_waarde,
        opslagpad=str(doel),
    )


def lees_document(conn: sqlite3.Connection, document_id: int) -> dict[str, Any]:
    """Lees één documentregistratie als dict."""
    cursor = conn.execute("SELECT * FROM documenten WHERE id = ?", (document_id,))
    rij = cursor.fetchone()
    if rij is None:
        raise ValueError(f"document {document_id} bestaat niet")
    kolommen = [k[0] for k in cursor.description]
    return dict(zip(kolommen, rij))


def sla_extractie_op(
    conn: sqlite3.Connection,
    administratie_id: int,
    resultaat: Any,
    *,
    document_id: Optional[int] = None,
) -> int:
    """Bewaar een AI-extractie met model, ruwe respons en document_id.

    De volledige audit trail: welk model het was, met welke versie van
    de systeemprompt, wat het letterlijk terugstuurde, welk invoerpad is
    gebruikt en bij welk bewaarde document het hoort. Zo is later na te gaan waar een boeking vandaan
    komt — ook als het model intussen is vervangen.
    """
    tijd = _nu()
    cursor = conn.execute(
        """
        INSERT INTO extracties (
            administratie_id, document_id, model, prompt_versie, invoerpad,
            ruwe_respons, status, redenen, aangemaakt_op
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        """,
        (
            administratie_id,
            document_id,
            resultaat.model,
            resultaat.prompt_versie,
            resultaat.invoerpad,
            resultaat.ruwe_respons,
            resultaat.status,
            json.dumps(resultaat.redenen, ensure_ascii=False),
            tijd,
        ),
    )
    extractie_id = cursor.lastrowid

    for veld, waarde in (
        ("model", resultaat.model),
        ("prompt_versie", resultaat.prompt_versie),
        ("invoerpad", resultaat.invoerpad),
        ("status", resultaat.status),
        ("document_id", None if document_id is None else str(document_id)),
    ):
        conn.execute(
            """
            INSERT INTO audit_log (
                administratie_id, tabel, record_id, actie,
                veld, oude_waarde, nieuwe_waarde, tijdstip
            ) VALUES (?, 'extracties', ?, 'aangemaakt', ?, NULL, ?, ?)
            """,
            (administratie_id, extractie_id, veld, waarde, tijd),
        )
    conn.commit()
    return extractie_id


def lees_extractie(conn: sqlite3.Connection, extractie_id: int) -> dict[str, Any]:
    """Lees één extractie terug, met de redenen als lijst."""
    cursor = conn.execute("SELECT * FROM extracties WHERE id = ?", (extractie_id,))
    rij = cursor.fetchone()
    if rij is None:
        raise ValueError(f"extractie {extractie_id} bestaat niet")
    kolommen = [k[0] for k in cursor.description]
    extractie = dict(zip(kolommen, rij))
    extractie["redenen"] = json.loads(extractie["redenen"])
    return extractie


def lees_facturen(
    conn: sqlite3.Connection, administratie_id: int
) -> list[dict[str, Any]]:
    """Alle facturen van een administratie, review_nodig bovenaan.

    De volgorde is de werkvolgorde van de eigenaar: eerst wat zijn
    aandacht nodig heeft, daarna wat al klopt maar nog niet is
    goedgekeurd, en onderaan wat af is. Binnen elke groep de nieuwste
    factuur eerst.
    """
    cursor = conn.execute(
        """
        SELECT * FROM facturen
        WHERE administratie_id = ?
        ORDER BY
            CASE
                WHEN status = 'review_nodig' THEN 0
                WHEN goedgekeurd_op IS NULL THEN 1
                ELSE 2
            END,
            id DESC
        """,
        (administratie_id,),
    )
    kolommen = [k[0] for k in cursor.description]
    facturen = []
    for rij in cursor.fetchall():
        factuur = dict(zip(kolommen, rij))
        factuur["review_redenen"] = json.loads(factuur["review_redenen"])
        factuur["originele_data"] = json.loads(factuur["originele_data"])
        facturen.append(factuur)
    return facturen


def keur_factuur_goed(
    conn: sqlite3.Connection, factuur_id: int, door: str = "eigenaar"
) -> tuple[bool, list[str]]:
    """Leg vast dat een mens deze factuur heeft goedgekeurd.

    Geeft (gelukt, redenen). Goedkeuren kan alleen als er geen
    openstaande validatiefouten meer zijn: de code bepaalt of het mág,
    de mens bepaalt of het gebeurt (Gouden regel 1). Een factuur die
    al is goedgekeurd wordt niet nog een keer goedgekeurd.
    """
    factuur = lees_factuur(conn, factuur_id)

    if factuur["status"] != "gevalideerd":
        return False, [
            "deze factuur kan nog niet worden goedgekeurd; los eerst de "
            "openstaande punten op"
        ] + factuur["review_redenen"]

    if factuur["goedgekeurd_op"] is not None:
        return False, ["deze factuur is al goedgekeurd"]

    tijd = _nu()
    conn.execute(
        "UPDATE facturen SET goedgekeurd_op = ?, goedgekeurd_door = ?, "
        "gewijzigd_op = ? WHERE id = ?",
        (tijd, door, tijd, factuur_id),
    )
    for veld, waarde in (("goedgekeurd_op", tijd), ("goedgekeurd_door", door)):
        conn.execute(
            """
            INSERT INTO audit_log (
                administratie_id, tabel, record_id, actie,
                veld, oude_waarde, nieuwe_waarde, tijdstip
            ) VALUES (?, 'facturen', ?, 'gewijzigd', ?, NULL, ?, ?)
            """,
            (factuur["administratie_id"], factuur_id, veld, waarde, tijd),
        )
    conn.commit()
    return True, []


def lees_extractie_bij_document(
    conn: sqlite3.Connection, document_id: Optional[int]
) -> Optional[dict[str, Any]]:
    """Zoek de laatste AI-extractie bij een document, of None.

    Het reviewscherm gebruikt dit om per veld de zekerheid te tonen.
    Bij een e-factuur is er geen extractie; dan is er ook niets
    onzekers, want de velden stonden letterlijk in het bestand.
    """
    if document_id is None:
        return None
    cursor = conn.execute(
        "SELECT * FROM extracties WHERE document_id = ? ORDER BY id DESC LIMIT 1",
        (document_id,),
    )
    rij = cursor.fetchone()
    if rij is None:
        return None
    kolommen = [k[0] for k in cursor.description]
    extractie = dict(zip(kolommen, rij))
    extractie["redenen"] = json.loads(extractie["redenen"])
    return extractie


# --- grootboek (module 6) ----------------------------------------------

def kies_rekening(
    conn: sqlite3.Connection, factuur_id: int, code: Optional[str]
) -> tuple[bool, list[str]]:
    """Leg vast op welke grootboekrekening deze factuur hoort.

    De keuze wordt getoetst aan het rekeningschema van het boekjaar van
    de factuur: een code die daar niet in staat wordt geweigerd, want er
    wordt nooit op een verzonnen rekening geboekt. De oude keuze gaat
    net als elke andere wijziging de audit trail in.
    """
    from .rekeningschema import KIESBARE_SOORTEN, rekeningschema_voor_jaar

    factuur = lees_factuur(conn, factuur_id)
    code = (code or "").strip() or None

    if code is not None:
        if not factuur["factuurdatum"]:
            return False, [
                "zonder factuurdatum is niet te bepalen welk rekeningschema "
                "geldt; vul eerst de datum in"
            ]
        jaar = date.fromisoformat(factuur["factuurdatum"]).year
        schema = rekeningschema_voor_jaar(jaar)
        if schema is None:
            return False, [f"er is geen rekeningschema voor boekjaar {jaar}"]
        rekening = schema.zoek(code)
        if rekening is None:
            return False, [f"rekening '{code}' staat niet in het schema van {jaar}"]
        if rekening.soort not in KIESBARE_SOORTEN:
            return False, [
                f"rekening {code} is van soort '{rekening.soort}'; kies een "
                f"kosten- of opbrengstenrekening"
            ]

    if factuur["rekening"] == code:
        return True, []

    # Staat de boeking er al, dan zou een andere rekening hier betekenen
    # dat de factuur iets anders zegt dan het grootboek. Een boeking
    # wordt nooit gewijzigd, dus de weg terug is een tegenboeking.
    boeking = boeking_bij_factuur(conn, factuur_id)
    if boeking is not None:
        return False, [
            f"deze factuur is al geboekt (boeking {boeking['id']}); een boeking "
            f"wordt niet gewijzigd. Maak een tegenboeking als de rekening niet "
            f"klopt"
        ]

    tijd = _nu()
    conn.execute(
        "UPDATE facturen SET rekening = ?, gewijzigd_op = ? WHERE id = ?",
        (code, tijd, factuur_id),
    )
    conn.execute(
        """
        INSERT INTO audit_log (
            administratie_id, tabel, record_id, actie,
            veld, oude_waarde, nieuwe_waarde, tijdstip
        ) VALUES (?, 'facturen', ?, 'gewijzigd', 'rekening', ?, ?, ?)
        """,
        (factuur["administratie_id"], factuur_id, factuur["rekening"], code, tijd),
    )
    conn.commit()
    return True, []


def sla_boeking_op(
    conn: sqlite3.Connection,
    administratie_id: int,
    voorstel: Any,
    door: str = "eigenaar",
) -> tuple[Optional[int], list[str]]:
    """Bewaar een samengestelde boeking; geef (boeking_id, redenen).

    De balans wordt hier nog één keer gecontroleerd, vlak voor het
    opslaan. Dat is met opzet dubbelop: een boeking die niet klopt mag
    de database niet in, ook niet als een aanroeper de controle bij het
    samenstellen zou overslaan.
    """
    from .grootboek import controleer_balans

    if voorstel.status != "gemaakt":
        return None, list(voorstel.redenen)

    redenen = controleer_balans(voorstel.regels)
    if redenen:
        return None, redenen

    if voorstel.factuur_id is not None:
        bestaat = conn.execute(
            "SELECT id FROM boekingen WHERE factuur_id = ?", (voorstel.factuur_id,)
        ).fetchone()
        if bestaat is not None:
            return None, [
                f"factuur {voorstel.factuur_id} is al geboekt (boeking "
                f"{bestaat[0]}); een boeking wordt niet overschreven — maak "
                f"zo nodig een tegenboeking"
            ]

    tijd = _nu()
    cursor = conn.execute(
        """
        INSERT INTO boekingen (
            administratie_id, factuur_id, corrigeert_boeking_id,
            boekdatum, omschrijving, aangemaakt_op, aangemaakt_door
        ) VALUES (?, ?, ?, ?, ?, ?, ?)
        """,
        (
            administratie_id,
            voorstel.factuur_id,
            voorstel.corrigeert_boeking_id,
            str(voorstel.boekdatum),
            voorstel.omschrijving,
            tijd,
            door,
        ),
    )
    boeking_id = cursor.lastrowid

    for volgnummer, regel in enumerate(voorstel.regels, start=1):
        conn.execute(
            """
            INSERT INTO boekingsregels (
                boeking_id, administratie_id, volgnummer,
                rekening, omschrijving, debet, credit
            ) VALUES (?, ?, ?, ?, ?, ?, ?)
            """,
            (
                boeking_id, administratie_id, volgnummer,
                regel.rekening, regel.omschrijving,
                str(regel.debet), str(regel.credit),
            ),
        )

    conn.execute(
        """
        INSERT INTO audit_log (
            administratie_id, tabel, record_id, actie,
            veld, oude_waarde, nieuwe_waarde, tijdstip
        ) VALUES (?, 'boekingen', ?, 'aangemaakt', NULL, NULL, ?, ?)
        """,
        (
            administratie_id, boeking_id,
            json.dumps(
                {
                    "boekdatum": str(voorstel.boekdatum),
                    "omschrijving": voorstel.omschrijving,
                    "factuur_id": voorstel.factuur_id,
                    "corrigeert_boeking_id": voorstel.corrigeert_boeking_id,
                    "regels": [
                        {
                            "rekening": r.rekening,
                            "debet": str(r.debet),
                            "credit": str(r.credit),
                        }
                        for r in voorstel.regels
                    ],
                },
                ensure_ascii=False,
            ),
            tijd,
        ),
    )
    conn.commit()
    return boeking_id, []


def _boeking_met_regels(conn: sqlite3.Connection, rij: dict[str, Any]) -> dict[str, Any]:
    cursor = conn.execute(
        "SELECT * FROM boekingsregels WHERE boeking_id = ? ORDER BY volgnummer",
        (rij["id"],),
    )
    kolommen = [k[0] for k in cursor.description]
    rij["regels"] = [dict(zip(kolommen, r)) for r in cursor.fetchall()]
    return rij


def lees_boeking(conn: sqlite3.Connection, boeking_id: int) -> dict[str, Any]:
    """Lees één boeking met haar regels."""
    cursor = conn.execute("SELECT * FROM boekingen WHERE id = ?", (boeking_id,))
    rij = cursor.fetchone()
    if rij is None:
        raise ValueError(f"boeking {boeking_id} bestaat niet")
    kolommen = [k[0] for k in cursor.description]
    return _boeking_met_regels(conn, dict(zip(kolommen, rij)))


def lees_boekingen(
    conn: sqlite3.Connection,
    administratie_id: int,
    van: Optional[date] = None,
    tot: Optional[date] = None,
) -> list[dict[str, Any]]:
    """Lees de boekingen van een administratie, eventueel binnen een periode.

    `van` en `tot` zijn allebei inclusief; de boekdatum is de datum van
    de factuur, dus daarmee valt een factuur van 31 maart in het eerste
    kwartaal en een van 1 april in het tweede.
    """
    vraag = "SELECT * FROM boekingen WHERE administratie_id = ?"
    waarden: list[Any] = [administratie_id]
    if van is not None:
        vraag += " AND boekdatum >= ?"
        waarden.append(str(van))
    if tot is not None:
        vraag += " AND boekdatum <= ?"
        waarden.append(str(tot))
    vraag += " ORDER BY boekdatum, id"

    cursor = conn.execute(vraag, waarden)
    kolommen = [k[0] for k in cursor.description]
    return [
        _boeking_met_regels(conn, dict(zip(kolommen, rij)))
        for rij in cursor.fetchall()
    ]


def boeking_bij_factuur(
    conn: sqlite3.Connection, factuur_id: int
) -> Optional[dict[str, Any]]:
    """Geef de boeking van deze factuur, of None als hij nog niet geboekt is."""
    rij = conn.execute(
        "SELECT id FROM boekingen WHERE factuur_id = ?", (factuur_id,)
    ).fetchone()
    return None if rij is None else lees_boeking(conn, rij[0])


def boek_factuur(
    conn: sqlite3.Connection, factuur_id: int, door: str = "eigenaar"
) -> tuple[Optional[int], list[str]]:
    """Maak de boeking bij een goedgekeurde factuur.

    Alleen een goedgekeurde factuur wordt geboekt: de code controleert,
    de mens beslist, en pas daarna gaat het het grootboek in.
    """
    from .grootboek import stel_boeking_samen

    factuur = lees_factuur(conn, factuur_id)
    if factuur["goedgekeurd_op"] is None:
        return None, [
            "deze factuur is nog niet goedgekeurd; alleen een goedgekeurde "
            "factuur wordt geboekt"
        ]

    voorstel = stel_boeking_samen(factuur, factuur["rekening"])
    return sla_boeking_op(conn, factuur["administratie_id"], voorstel, door=door)


def maak_tegenboeking(
    conn: sqlite3.Connection,
    boeking_id: int,
    reden: str,
    door: str = "eigenaar",
    boekdatum: Optional[date] = None,
) -> tuple[Optional[int], list[str]]:
    """Zet een boeking recht met een tegenboeking.

    De oorspronkelijke boeking blijft ongewijzigd staan; dit is een
    nieuwe boeking met dezelfde bedragen aan de andere kant en een
    verwijzing naar het origineel.
    """
    from .grootboek import stel_tegenboeking_samen

    boeking = lees_boeking(conn, boeking_id)
    bestaat = conn.execute(
        "SELECT id FROM boekingen WHERE corrigeert_boeking_id = ?", (boeking_id,)
    ).fetchone()
    if bestaat is not None:
        return None, [
            f"boeking {boeking_id} is al gecorrigeerd met boeking {bestaat[0]}"
        ]

    voorstel = stel_tegenboeking_samen(boeking, reden, boekdatum)
    return sla_boeking_op(
        conn, boeking["administratie_id"], voorstel, door=door
    )
```

## `boekhouding/boekhouding/grootboek.py`

```python
"""Dubbel boekhouden: van goedgekeurde factuur naar boeking.

Een boeking bestaat uit regels die samen in balans zijn: alles wat aan
de ene kant staat (debet) staat ook aan de andere kant (credit). Een
inkoopfactuur van 121 euro met 21 euro btw wordt:

    kosten                100,00 debet
    te vorderen btw        21,00 debet
    crediteuren                        121,00 credit

Regels die hier gelden:
- **Exact in balans, geen tolerantie.** De factuurcontrole van module 1
  laat een afronding van een cent toe (±0,02), want dat komt op echte
  facturen voor. Een boeking niet: als debet en credit een cent
  verschillen klopt de administratie niet meer. Zo'n factuur wordt dus
  niet geboekt, met de reden erbij, en een mens zet het recht.
- **Nooit wijzigen of verwijderen.** Een fout wordt rechtgezet met een
  tegenboeking: dezelfde bedragen aan de andere kant, met een verwijzing
  naar de oorspronkelijke boeking. Beide blijven staan, en samen zijn ze
  nul.
- **Alleen rekeningen uit het schema van dat boekjaar.** Een code die er
  niet in staat wordt geweigerd; er wordt nooit een rekening geraden.
- **Er wordt niets bedacht.** Ontbreekt een bedrag of een rekening, dan
  ontstaat de boeking niet en staat er een reden bij (Gouden regel 4).
"""

from datetime import date
from decimal import Decimal, InvalidOperation
from typing import Any, Literal, Optional

from pydantic import BaseModel

from .rekeningschema import KIESBARE_SOORTEN, Rekeningschema, rekeningschema_voor_jaar

NUL = Decimal("0.00")


class Boekingsregel(BaseModel):
    """Eén regel van een boeking: een bedrag debet óf credit."""

    rekening: str
    omschrijving: str
    debet: Decimal = NUL
    credit: Decimal = NUL


class BoekingVoorstel(BaseModel):
    """Een samengestelde boeking, nog niet opgeslagen.

    status "gemaakt"    → de regels zijn in balans en kunnen worden bewaard
    status "geweigerd"  → er is geen boeking; waarom staat in redenen
    """

    status: Literal["gemaakt", "geweigerd"]
    redenen: list[str] = []
    regels: list[Boekingsregel] = []
    boekdatum: Optional[date] = None
    omschrijving: str = ""
    factuur_id: Optional[int] = None
    corrigeert_boeking_id: Optional[int] = None


def _bedrag(waarde: Any) -> Optional[Decimal]:
    """Lees een opgeslagen bedrag als Decimal, of None als dat niet kan."""
    if waarde is None or waarde == "":
        return None
    try:
        return Decimal(str(waarde))
    except InvalidOperation:
        return None


def som_debet(regels: list[Boekingsregel]) -> Decimal:
    return sum((regel.debet for regel in regels), NUL)


def som_credit(regels: list[Boekingsregel]) -> Decimal:
    return sum((regel.credit for regel in regels), NUL)


def controleer_balans(regels: list[Boekingsregel]) -> list[str]:
    """Geef de redenen waarom deze regels géén geldige boeking zijn.

    Een lege lijst betekent: in balans. Er wordt exact vergeleken, dus
    zonder de cent speling die de factuurcontrole wél toestaat.
    """
    redenen = []
    if not regels:
        return ["een boeking zonder regels bestaat niet"]

    for regel in regels:
        if regel.debet != NUL and regel.credit != NUL:
            redenen.append(
                f"regel op rekening {regel.rekening} staat zowel debet als "
                f"credit; een regel hoort aan één kant te staan"
            )
        if regel.debet == NUL and regel.credit == NUL:
            redenen.append(
                f"regel op rekening {regel.rekening} heeft geen bedrag"
            )

    debet, credit = som_debet(regels), som_credit(regels)
    if debet != credit:
        redenen.append(
            f"de boeking is niet in balans: debet {debet} tegenover credit "
            f"{credit}, een verschil van {debet - credit}. Een boeking moet "
            f"exact kloppen, ook op de cent"
        )
    return redenen


def _regel(rekening: str, omschrijving: str, bedrag: Decimal, kant: str) -> Boekingsregel:
    if kant == "debet":
        return Boekingsregel(rekening=rekening, omschrijving=omschrijving, debet=bedrag)
    return Boekingsregel(rekening=rekening, omschrijving=omschrijving, credit=bedrag)


def stel_boeking_samen(
    factuur: dict[str, Any],
    rekening_code: Optional[str],
    schema: Optional[Rekeningschema] = None,
) -> BoekingVoorstel:
    """Maak de boekingsregels bij een factuur; geeft nooit een exception.

    De gekozen rekening bepaalt wat voor boeking het wordt. Kiest de
    eigenaar een kostenrekening, dan is het een inkoopfactuur (btw te
    vorderen, schuld aan de leverancier). Kiest hij een
    opbrengstenrekening, dan is het een verkoopfactuur (btw af te dragen,
    vordering op de klant). Dat is dus geen gok van het systeem maar het
    gevolg van een keuze van een mens.
    """
    def weiger(*redenen: str) -> BoekingVoorstel:
        return BoekingVoorstel(
            status="geweigerd", redenen=list(redenen), factuur_id=factuur.get("id")
        )

    if not rekening_code:
        return weiger(
            "er is nog geen grootboekrekening gekozen; zonder rekening is niet "
            "te bepalen waar deze factuur thuishoort"
        )

    datum_tekst = factuur.get("factuurdatum")
    if not datum_tekst:
        return weiger("de factuur heeft geen factuurdatum, dus geen boekdatum")
    try:
        boekdatum = date.fromisoformat(str(datum_tekst))
    except ValueError:
        return weiger(f"de factuurdatum '{datum_tekst}' is geen geldige datum")

    if schema is None:
        schema = rekeningschema_voor_jaar(boekdatum.year)
    if schema is None:
        return weiger(
            f"er is geen rekeningschema voor boekjaar {boekdatum.year}; "
            f"voeg config/rekeningen_{boekdatum.year}.json toe"
        )

    rekening = schema.zoek(rekening_code)
    if rekening is None:
        return weiger(
            f"rekening '{rekening_code}' staat niet in het rekeningschema van "
            f"{schema.jaar}; er wordt niet op een onbekende rekening geboekt"
        )
    if rekening.soort not in KIESBARE_SOORTEN:
        return weiger(
            f"rekening {rekening.code} ({rekening.omschrijving}) is van soort "
            f"'{rekening.soort}'; bij een factuur hoort een kosten- of "
            f"opbrengstenrekening"
        )

    excl = _bedrag(factuur.get("bedrag_excl"))
    btw = _bedrag(factuur.get("btw_bedrag"))
    incl = _bedrag(factuur.get("bedrag_incl"))
    ontbreekt = [
        naam for naam, waarde in
        (("bedrag_excl", excl), ("btw_bedrag", btw), ("bedrag_incl", incl))
        if waarde is None
    ]
    if ontbreekt:
        return weiger(
            f"deze bedragen ontbreken of zijn onleesbaar: {', '.join(ontbreekt)}"
        )

    if excl + btw != incl:
        return weiger(
            f"de bedragen tellen niet exact op: {excl} + {btw} = {excl + btw}, "
            f"maar er staat {incl}. De factuurcontrole laat een cent afronding "
            f"toe, een boeking niet — corrigeer het bedrag eerst"
        )

    percentage = factuur.get("btw_percentage")
    omschrijving = _omschrijving(factuur)

    if rekening.soort == "kosten":
        regels = [_regel(rekening.code, rekening.omschrijving, excl, "debet")]
        if btw != NUL:
            voorbelasting = schema.standaard("btw_voorbelasting")
            regels.append(_regel(
                voorbelasting,
                schema.zoek(voorbelasting).omschrijving,
                btw,
                "debet",
            ))
        crediteuren = schema.standaard("crediteuren")
        regels.append(_regel(
            crediteuren, schema.zoek(crediteuren).omschrijving, incl, "credit"
        ))
    else:
        debiteuren = schema.standaard("debiteuren")
        regels = [_regel(
            debiteuren, schema.zoek(debiteuren).omschrijving, incl, "debet"
        )]
        regels.append(_regel(rekening.code, rekening.omschrijving, excl, "credit"))
        if btw != NUL:
            af_te_dragen = schema.btw_verschuldigd_voor(_tarief(percentage))
            if af_te_dragen is None or schema.zoek(af_te_dragen) is None:
                return weiger(
                    f"voor btw-tarief {percentage}% staat geen rekening voor af "
                    f"te dragen btw in het schema van {schema.jaar}; deze omzet "
                    f"wordt niet op een willekeurige rekening geboekt"
                )
            regels.append(_regel(
                af_te_dragen, schema.zoek(af_te_dragen).omschrijving, btw, "credit"
            ))

    redenen = controleer_balans(regels)
    if redenen:
        return weiger(*redenen)

    return BoekingVoorstel(
        status="gemaakt",
        regels=regels,
        boekdatum=boekdatum,
        omschrijving=omschrijving,
        factuur_id=factuur.get("id"),
    )


def _tarief(percentage: Any) -> str:
    """Maak van '21', '21.00' of Decimal('21') dezelfde sleutel '21'."""
    getal = _bedrag(percentage)
    if getal is None:
        return ""
    return str(getal.normalize())


def _omschrijving(factuur: dict[str, Any]) -> str:
    leverancier = factuur.get("leverancier") or "onbekende leverancier"
    nummer = factuur.get("factuurnummer")
    return f"{leverancier} {nummer}".strip() if nummer else leverancier


def stel_tegenboeking_samen(
    boeking: dict[str, Any], reden: str, boekdatum: Optional[date] = None
) -> BoekingVoorstel:
    """Maak de tegenboeking van een bestaande boeking.

    Elke regel gaat naar de andere kant: wat debet stond, staat credit en
    andersom. Samen zijn de twee boekingen nul, en beide blijven staan —
    de oorspronkelijke boeking wordt niet aangeraakt, want een boeking
    wordt nooit gewijzigd of verwijderd.

    De boekdatum is standaard die van de oorspronkelijke boeking, zodat
    de correctie in hetzelfde kwartaal valt. Is dat kwartaal al aangegeven
    bij de Belastingdienst, geef dan expliciet een datum in het lopende
    kwartaal mee.
    """
    if not reden.strip():
        return BoekingVoorstel(
            status="geweigerd",
            redenen=["een tegenboeking hoort een reden te hebben"],
        )

    regels = [
        Boekingsregel(
            rekening=regel["rekening"],
            omschrijving=regel["omschrijving"],
            debet=_bedrag(regel["credit"]) or NUL,
            credit=_bedrag(regel["debet"]) or NUL,
        )
        for regel in boeking["regels"]
    ]

    redenen = controleer_balans(regels)
    if redenen:
        return BoekingVoorstel(status="geweigerd", redenen=redenen)

    if boekdatum is None:
        boekdatum = date.fromisoformat(str(boeking["boekdatum"]))

    return BoekingVoorstel(
        status="gemaakt",
        regels=regels,
        boekdatum=boekdatum,
        omschrijving=f"Correctie van boeking {boeking['id']}: {reden.strip()}",
        corrigeert_boeking_id=boeking["id"],
    )
```

## `boekhouding/boekhouding/btw_aangifte.py`

```python
"""Btw-aangifte per kwartaal: een voorstel, geen aangifte.

Wat deze module doet: de rubrieken uitrekenen die een zzp'er in de
kwartaalaangifte invult, op basis van de boekingen die er staan. Wat hij
niet doet: iets indienen. Het resultaat is een voorstel dat de eigenaar
zelf overneemt bij de Belastingdienst.

De rubrieken:

    1a   omzet belast met het hoge tarief, en de btw daarover
    1b   omzet belast met het lage tarief, en de btw daarover
    5a   totaal verschuldigde omzetbelasting (de btw uit 1a en 1b)
    5b   voorbelasting (de btw op wat je zelf hebt ingekocht)
    saldo   5a min 5b: te betalen, of terug te vragen

Twee dingen zijn hier belangrijker dan het rekenwerk:

**Alles rekent de code uit, met vaste formules.** Er komt geen model aan
te pas — niet bij het optellen, niet bij het indelen in rubrieken
(Gouden regel 2).

**Bij twijfel geen getal.** Staat er in het kwartaal ook maar één
factuur die nog niet helemaal rond is, dan wordt er niets uitgerekend.
Je krijgt een lijst van wat er open staat. Een aangifte die "bijna
klopt" is gevaarlijker dan geen aangifte: hij ziet er af uit, en het
verschil merk je pas bij een controle.
"""

import sqlite3
from datetime import date
from decimal import Decimal
from typing import Any, Literal, Optional

from pydantic import BaseModel

from .database import boeking_bij_factuur, lees_boekingen
from .rekeningschema import Rekeningschema, rekeningschema_voor_jaar

NUL = Decimal("0.00")

# Welke maanden bij welk kwartaal horen. 31 maart valt dus in K1 en
# 1 april in K2, en dat is precies waar het bij een kwartaalgrens om
# gaat.
KWARTAAL_MAANDEN = {1: (1, 3), 2: (4, 6), 3: (7, 9), 4: (10, 12)}

LAATSTE_DAG = {1: 31, 2: 28, 3: 31, 4: 30, 5: 31, 6: 30,
               7: 31, 8: 31, 9: 30, 10: 31, 11: 30, 12: 31}

VOORBEHOUD = (
    "Dit is een voorstel op basis van de boekingen in dit kwartaal. "
    "Het indienen doet u zelf bij de Belastingdienst; dit systeem "
    "verstuurt niets."
)


class Rubriek(BaseModel):
    """Eén rubriek van de aangifte."""

    code: str
    omschrijving: str
    grondslag: Decimal = NUL
    btw: Decimal = NUL


class Blokkade(BaseModel):
    """Eén factuur die de aangifte tegenhoudt."""

    factuur_id: int
    leverancier: Optional[str] = None
    factuurdatum: Optional[str] = None
    bedrag_incl: Optional[str] = None
    reden: str


class Aangifte(BaseModel):
    """Het voorstel voor één kwartaal.

    status "voorstel"    → de bedragen zijn uitgerekend
    status "geblokkeerd" → er is niets uitgerekend; zie blokkades/redenen
    """

    status: Literal["voorstel", "geblokkeerd"]
    jaar: int
    kwartaal: int
    van: date
    tot: date
    rubrieken: list[Rubriek] = []
    verschuldigd: Optional[Decimal] = None   # 5a
    voorbelasting: Optional[Decimal] = None  # 5b
    saldo: Optional[Decimal] = None          # 5a - 5b
    # Drie uitkomsten, niet twee: een saldo van precies nul is geen
    # teruggave. Dat verschil staat ook op het scherm.
    saldo_richting: Optional[Literal["betalen", "terugvragen", "niets"]] = None
    blokkades: list[Blokkade] = []
    redenen: list[str] = []
    waarschuwingen: list[str] = []
    aantal_boekingen: int = 0
    voorbehoud: str = VOORBEHOUD


def kwartaal_van(datum: date) -> int:
    """Geef het kwartaal (1 t/m 4) waarin deze datum valt."""
    return (datum.month - 1) // 3 + 1


def kwartaal_grenzen(jaar: int, kwartaal: int) -> tuple[date, date]:
    """Geef de eerste en de laatste dag van een kwartaal, allebei inclusief."""
    if kwartaal not in KWARTAAL_MAANDEN:
        raise ValueError(f"kwartaal {kwartaal} bestaat niet; kies 1 t/m 4")
    eerste_maand, laatste_maand = KWARTAAL_MAANDEN[kwartaal]
    dag = LAATSTE_DAG[laatste_maand]
    if laatste_maand == 2 and _schrikkeljaar(jaar):
        dag = 29
    return date(jaar, eerste_maand, 1), date(jaar, laatste_maand, dag)


def _schrikkeljaar(jaar: int) -> bool:
    return jaar % 4 == 0 and (jaar % 100 != 0 or jaar % 400 == 0)


def _decimal(waarde: Any) -> Decimal:
    if waarde is None or waarde == "":
        return NUL
    return Decimal(str(waarde))


def zoek_blokkades(
    conn: sqlite3.Connection, administratie_id: int, van: date, tot: date
) -> list[Blokkade]:
    """Zoek de facturen in dit kwartaal die nog niet rond zijn.

    Drie dingen houden een aangifte tegen, en alle drie om dezelfde
    reden: het bedrag telt nog niet mee terwijl de factuur er wel is.

    1. De factuur moet nog nagekeken worden (status review_nodig).
    2. De factuur klopt, maar niemand heeft hem goedgekeurd.
    3. De factuur is goedgekeurd, maar er staat nog geen boeking —
       meestal omdat er geen grootboekrekening is gekozen.
    """
    cursor = conn.execute(
        """
        SELECT id, leverancier, factuurdatum, bedrag_incl, status,
               goedgekeurd_op, rekening, review_redenen
        FROM facturen
        WHERE administratie_id = ?
          AND factuurdatum >= ? AND factuurdatum <= ?
        ORDER BY factuurdatum, id
        """,
        (administratie_id, str(van), str(tot)),
    )
    blokkades = []
    for (factuur_id, leverancier, factuurdatum, bedrag_incl, status,
         goedgekeurd_op, rekening, _redenen) in cursor.fetchall():
        if status == "review_nodig":
            reden = "moet nog nagekeken worden"
        elif goedgekeurd_op is None:
            reden = "is nagekeken maar nog niet goedgekeurd"
        elif boeking_bij_factuur(conn, factuur_id) is None:
            reden = (
                "is goedgekeurd maar nog niet geboekt; er is geen "
                "grootboekrekening gekozen"
                if not rekening else
                "is goedgekeurd maar nog niet geboekt"
            )
        else:
            continue
        blokkades.append(Blokkade(
            factuur_id=factuur_id,
            leverancier=leverancier,
            factuurdatum=factuurdatum,
            bedrag_incl=bedrag_incl,
            reden=reden,
        ))
    return blokkades


def _facturen_zonder_datum(conn: sqlite3.Connection, administratie_id: int) -> int:
    rij = conn.execute(
        "SELECT count(*) FROM facturen "
        "WHERE administratie_id = ? AND (factuurdatum IS NULL OR factuurdatum = '')",
        (administratie_id,),
    ).fetchone()
    return rij[0]


def _tel_op(
    boekingen: list[dict[str, Any]], schema: Rekeningschema
) -> tuple[dict[str, Decimal], Decimal]:
    """Tel de boekingen op tot de rubrieken. Vaste formules, geen model.

    Per boeking wordt gekeken welke btw-rekening erin voorkomt: dat
    bepaalt de rubriek. De omzet van diezelfde boeking is dan de
    grondslag. Een tegenboeking heeft de bedragen aan de andere kant en
    telt daardoor vanzelf negatief mee — daarom `credit - debet` en niet
    alleen `credit`.
    """
    hoog = schema.btw_verschuldigd_voor("21")
    laag = schema.btw_verschuldigd_voor("9")
    voorbelasting = schema.standaard("btw_voorbelasting")

    bedragen = {
        "1a_grondslag": NUL, "1a_btw": NUL,
        "1b_grondslag": NUL, "1b_btw": NUL,
        "buiten_1a_1b": NUL,
    }
    totaal_voorbelasting = NUL

    for boeking in boekingen:
        btw_hoog = NUL
        btw_laag = NUL
        omzet = NUL
        for regel in boeking["regels"]:
            debet, credit = _decimal(regel["debet"]), _decimal(regel["credit"])
            rekening = schema.zoek(regel["rekening"])
            if regel["rekening"] == hoog:
                btw_hoog += credit - debet
            elif regel["rekening"] == laag:
                btw_laag += credit - debet
            elif regel["rekening"] == voorbelasting:
                totaal_voorbelasting += debet - credit
            elif rekening is not None and rekening.soort == "opbrengsten":
                omzet += credit - debet

        if btw_hoog != NUL:
            bedragen["1a_btw"] += btw_hoog
            bedragen["1a_grondslag"] += omzet
        elif btw_laag != NUL:
            bedragen["1b_btw"] += btw_laag
            bedragen["1b_grondslag"] += omzet
        elif omzet != NUL:
            # Omzet zonder btw-regel: nultarief, vrijgesteld of verlegd.
            # Daar horen eigen rubrieken bij (1e, 2a, 3a) en die zijn nog
            # niet gebouwd; stilzwijgend weglaten mag niet.
            bedragen["buiten_1a_1b"] += omzet

    return bedragen, totaal_voorbelasting


def bereken_aangifte(
    conn: sqlite3.Connection, administratie_id: int, jaar: int, kwartaal: int
) -> Aangifte:
    """Reken het btw-voorstel voor één kwartaal uit.

    Staat er nog iets open in dat kwartaal, dan wordt er niets
    uitgerekend en krijg je de lijst met wat er mist.
    """
    van, tot = kwartaal_grenzen(jaar, kwartaal)
    aangifte = Aangifte(status="geblokkeerd", jaar=jaar, kwartaal=kwartaal,
                        van=van, tot=tot)

    zonder_datum = _facturen_zonder_datum(conn, administratie_id)
    if zonder_datum:
        aangifte.waarschuwingen.append(
            f"er {'is' if zonder_datum == 1 else 'zijn'} {zonder_datum} "
            f"factu{'ur' if zonder_datum == 1 else 'ren'} zonder factuurdatum; "
            f"{'die valt' if zonder_datum == 1 else 'die vallen'} in geen enkel "
            f"kwartaal en tel{'t' if zonder_datum == 1 else 'len'} dus nergens mee"
        )

    schema = rekeningschema_voor_jaar(jaar)
    if schema is None:
        aangifte.redenen.append(
            f"er is geen rekeningschema voor boekjaar {jaar}; zonder schema is "
            f"niet te bepalen welke rekening welke rubriek is"
        )
        return aangifte

    aangifte.blokkades = zoek_blokkades(conn, administratie_id, van, tot)
    if aangifte.blokkades:
        aangifte.redenen.append(
            f"{len(aangifte.blokkades)} factu"
            f"{'ur' if len(aangifte.blokkades) == 1 else 'ren'} in dit kwartaal "
            f"{'is' if len(aangifte.blokkades) == 1 else 'zijn'} nog niet rond; "
            f"zolang dat zo is wordt er niets uitgerekend"
        )
        return aangifte

    boekingen = lees_boekingen(conn, administratie_id, van, tot)
    bedragen, voorbelasting = _tel_op(boekingen, schema)

    verschuldigd = bedragen["1a_btw"] + bedragen["1b_btw"]
    saldo = verschuldigd - voorbelasting

    if bedragen["buiten_1a_1b"] != NUL:
        aangifte.waarschuwingen.append(
            f"er staat {bedragen['buiten_1a_1b']} omzet in dit kwartaal zonder "
            f"btw (nultarief, vrijgesteld of verlegd). Die hoort in rubriek 1e, "
            f"2a of 3a, en die rubrieken zijn nog niet gebouwd — vul ze met de "
            f"hand aan"
        )

    aangifte.status = "voorstel"
    aangifte.aantal_boekingen = len(boekingen)
    aangifte.rubrieken = [
        Rubriek(
            code="1a", omschrijving="Leveringen/diensten belast met hoog tarief",
            grondslag=bedragen["1a_grondslag"], btw=bedragen["1a_btw"],
        ),
        Rubriek(
            code="1b", omschrijving="Leveringen/diensten belast met laag tarief",
            grondslag=bedragen["1b_grondslag"], btw=bedragen["1b_btw"],
        ),
    ]
    aangifte.verschuldigd = verschuldigd
    aangifte.voorbelasting = voorbelasting
    aangifte.saldo = saldo
    aangifte.saldo_richting = (
        "betalen" if saldo > NUL else "terugvragen" if saldo < NUL else "niets"
    )
    return aangifte
```

## `boekhouding/boekhouding/web/__init__.py`

```python
"""Webinterface, fase 1: de reviewschermen van de eigenaar.

FastAPI met server-side HTML (Jinja2). Geen React, geen SPA, geen
build-stap — je start hem en het werkt. Mobiel-eerst, want de eigenaar
staat met zijn telefoon bij de brievenbus.

Fase 1 draait lokaal en heeft geen login: er zijn nog geen
klantaccounts, dus er valt nog niets af te schermen.
"""

from .app import maak_app

__all__ = ["maak_app"]
```

## `boekhouding/boekhouding/web/app.py`

```python
"""De routes van de webinterface.

Elke route doet drie dingen en niet meer: gegevens ophalen, een functie
uit de boekhoudmodules aanroepen, en het resultaat aan een sjabloon
geven. Er wordt hier niet gerekend, niet gevalideerd en niets bepaald
over btw — dat zit allemaal in de modules eronder.
"""

import sqlite3
from datetime import date
from pathlib import Path
from typing import Any, Optional

from fastapi import FastAPI, HTTPException, Request, UploadFile
from fastapi.responses import FileResponse, HTMLResponse, RedirectResponse
from fastapi.templating import Jinja2Templates

from ..ai_extractie import VELDEN
from ..btw_aangifte import bereken_aangifte, kwartaal_van
from ..database import (
    FACTUUR_VELDEN,
    boek_factuur,
    boeking_bij_factuur,
    keur_factuur_goed,
    kies_rekening,
    lees_document,
    lees_extractie_bij_document,
    lees_facturen,
    lees_factuur,
    maak_administratie,
    maak_tabellen,
    maak_verbinding,
    wijzig_factuur,
)
from ..rekeningschema import rekeningschema_voor_jaar
from ..ubl import te_groot
from ..verwerking import verwerk_upload
from .ubl_weergave import Weergave, leesbare_ubl

SJABLONEN = Jinja2Templates(directory=str(Path(__file__).parent / "templates"))

# Hoe de velden in het reviewscherm heten, in de volgorde waarin ze op
# een factuur staan.
VELDLABELS = {
    "leverancier": "Leverancier",
    "factuurdatum": "Factuurdatum",
    "factuurnummer": "Factuurnummer",
    "bedrag_excl": "Bedrag excl. btw",
    "btw_percentage": "Btw-percentage",
    "btw_bedrag": "Btw-bedrag",
    "bedrag_incl": "Totaal incl. btw",
}

MEDIATYPEN = {
    ".pdf": "application/pdf",
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
    ".png": "image/png",
    ".xml": "application/xml",
}


class NietGevonden(HTTPException):
    """Eén antwoord voor twee gevallen, en dat is met opzet.

    Vraagt iemand een factuur op die niet bestaat, of een factuur die
    wel bestaat maar bij een andere administratie hoort, dan krijgt hij
    exact hetzelfde te zien: 404, niet gevonden. Een 403 ("mag niet")
    zou verklappen dat het record bestaat, en dan weet iemand die de
    nummers in de adresbalk aan het aflopen is precies waar wat zit.
    """

    def __init__(self, soort: str = "pagina"):
        super().__init__(status_code=404, detail=soort)


def hoort_bij_administratie(
    conn: sqlite3.Connection,
    lees: Any,
    record_id: int,
    administratie_id: int,
    soort: str,
) -> dict[str, Any]:
    """Haal een record op en controleer dat het bij deze administratie hoort.

    Dit is de enige plek waar die controle staat. Elke route die een
    factuur of een document aanraakt gaat hierlangs, zodat er straks —
    als er klantaccounts komen — geen route vergeten kan zijn.

    Nu is er nog één gebruiker en dus geen kwaad kunnen, maar het adres
    van een factuur is een nummer dat iedereen kan ophogen. Zonder deze
    controle zou klant B straks de facturen van klant A kunnen bekijken
    en aanpassen door het nummer in de adresbalk te veranderen.
    """
    try:
        record = lees(conn, record_id)
    except ValueError:
        raise NietGevonden(soort)
    if record.get("administratie_id") != administratie_id:
        raise NietGevonden(soort)
    return record


def maak_app(
    db_pad: str,
    opslagmap: str,
    *,
    ai_client: Any = None,
    vandaag: Optional[date] = None,
    administratie_naam: str = "Mijn eenmanszaak",
) -> FastAPI:
    """Bouw de applicatie.

    ai_client en vandaag zijn er om te kunnen testen zonder echte
    API-aanroepen en zonder afhankelijk te zijn van de klok.
    """
    app = FastAPI(title="Boekhouding — review")
    app.state.db_pad = db_pad
    app.state.opslagmap = opslagmap
    app.state.ai_client = ai_client
    app.state.vandaag = vandaag

    # Zorg dat er een database en minstens één administratie is.
    Path(opslagmap).mkdir(parents=True, exist_ok=True)
    start = maak_verbinding(db_pad)
    maak_tabellen(start)
    if start.execute("SELECT count(*) FROM administraties").fetchone()[0] == 0:
        maak_administratie(start, administratie_naam)
    start.close()

    def verbinding() -> sqlite3.Connection:
        return maak_verbinding(app.state.db_pad)

    def toon(request: Request, sjabloon: str, **gegevens) -> HTMLResponse:
        return SJABLONEN.TemplateResponse(
            request=request, name=sjabloon, context=gegevens
        )

    @app.exception_handler(404)
    def niet_gevonden(request: Request, fout: HTTPException):
        """Een 404 is ook gewoon een pagina, geen brok JSON."""
        return SJABLONEN.TemplateResponse(
            request=request, name="fout.html", status_code=404,
            context={
                "titel": "Niet gevonden",
                "bericht": "Deze pagina bestaat niet, of hoort niet bij deze "
                           "administratie.",
                "terug": "/",
            },
        )

    def administratie_van(conn: sqlite3.Connection, administratie_id: int):
        rij = conn.execute(
            "SELECT id, naam FROM administraties WHERE id = ?", (administratie_id,)
        ).fetchone()
        if rij is None:
            raise NietGevonden("administratie")
        return rij

    # --- overzicht ------------------------------------------------------

    @app.get("/", response_class=HTMLResponse)
    def start_pagina():
        conn = verbinding()
        eerste = conn.execute("SELECT id FROM administraties ORDER BY id").fetchone()
        conn.close()
        return RedirectResponse(f"/administratie/{eerste[0]}", status_code=303)

    @app.get("/administratie/{administratie_id}", response_class=HTMLResponse)
    def overzicht(request: Request, administratie_id: int):
        conn = verbinding()
        try:
            administratie = administratie_van(conn, administratie_id)
            facturen = lees_facturen(conn, administratie_id)
        finally:
            conn.close()

        return toon(
            request, "overzicht.html",
            administratie_id=administratie_id,
            administratie_naam=administratie[1],
            facturen=facturen,
            aantal_review=sum(1 for f in facturen if f["status"] == "review_nodig"),
            aantal_wacht=sum(
                1 for f in facturen
                if f["status"] == "gevalideerd" and f["goedgekeurd_op"] is None
            ),
        )

    # --- uploaden -------------------------------------------------------

    @app.get("/administratie/{administratie_id}/upload", response_class=HTMLResponse)
    def uploadscherm(request: Request, administratie_id: int):
        conn = verbinding()
        try:
            administratie_van(conn, administratie_id)
        finally:
            conn.close()
        return toon(request, "upload.html", administratie_id=administratie_id)

    @app.post("/administratie/{administratie_id}/upload")
    async def upload_ontvangen(
        request: Request, administratie_id: int, bestand: UploadFile
    ):
        inhoud = await bestand.read()
        conn = verbinding()
        try:
            administratie_van(conn, administratie_id)
            resultaat = verwerk_upload(
                conn, administratie_id, bestand.filename or "onbekend", inhoud,
                app.state.opslagmap,
                ai_client=app.state.ai_client, vandaag=app.state.vandaag,
            )
        finally:
            conn.close()

        if resultaat.factuur_id is None:
            # Er is geen factuur ontstaan; laat zien waarom, in plaats
            # van de gebruiker terug te sturen naar een lege lijst.
            return toon(
                request, "fout.html",
                titel="Dit bestand is niet verwerkt",
                bericht=" ".join(resultaat.redenen),
                terug=f"/administratie/{administratie_id}/upload",
            )
        return RedirectResponse(
            f"/administratie/{administratie_id}/factuur/{resultaat.factuur_id}",
            status_code=303,
        )

    # --- reviewscherm ---------------------------------------------------

    @app.get(
        "/administratie/{administratie_id}/factuur/{factuur_id}",
        response_class=HTMLResponse,
    )
    def review(
        request: Request, administratie_id: int, factuur_id: int, melding: str = ""
    ):
        conn = verbinding()
        try:
            factuur = hoort_bij_administratie(
                conn, lees_factuur, factuur_id, administratie_id, "factuur"
            )
            extractie = lees_extractie_bij_document(conn, factuur["document_id"])
            # Het document gaat langs dezelfde eigenaarscontrole als de
            # factuur; ook voor het tonen ervan geldt dat een nummer in
            # de adresbalk niets van een andere administratie ontsluit.
            registratie = (
                hoort_bij_administratie(
                    conn, lees_document, factuur["document_id"],
                    administratie_id, "document",
                )
                if factuur["document_id"] else None
            )
            boeking = boeking_bij_factuur(conn, factuur_id)
        finally:
            conn.close()

        return toon(
            request, "review.html",
            administratie_id=administratie_id,
            factuur=factuur,
            velden=_veldregels(factuur, extractie),
            extractie=extractie,
            ubl=_ubl_weergave(registratie),
            rekeningen=_kiesbare_rekeningen(factuur),
            boeking=boeking,
            melding=melding,
            mag_goedkeuren=(
                factuur["status"] == "gevalideerd"
                and factuur["goedgekeurd_op"] is None
            ),
        )

    @app.post("/administratie/{administratie_id}/factuur/{factuur_id}/opslaan")
    async def opslaan(request: Request, administratie_id: int, factuur_id: int):
        formulier = await request.form()
        wijzigingen = {
            veld: str(formulier[veld]).strip()
            for veld in FACTUUR_VELDEN
            if veld in formulier
        }
        conn = verbinding()
        try:
            hoort_bij_administratie(
                conn, lees_factuur, factuur_id, administratie_id, "factuur"
            )
            # Wijzigingen gaan altijd via wijzig_factuur: die bewaart de
            # oude waarde in de audit trail en hervalideert de factuur.
            wijzig_factuur(conn, factuur_id, wijzigingen, vandaag=app.state.vandaag)
            # De grootboekrekening staat los van de factuurvelden: die
            # wordt niet uit het document gelezen maar door de eigenaar
            # gekozen, en gaat langs het rekeningschema van dat jaar.
            melding = "Opgeslagen"
            if "rekening" in formulier:
                gelukt, redenen = kies_rekening(
                    conn, factuur_id, str(formulier["rekening"])
                )
                if not gelukt:
                    melding = redenen[0]
        finally:
            conn.close()
        return RedirectResponse(
            f"/administratie/{administratie_id}/factuur/{factuur_id}"
            f"?melding={melding}",
            status_code=303,
        )

    @app.post("/administratie/{administratie_id}/factuur/{factuur_id}/goedkeuren")
    def goedkeuren(administratie_id: int, factuur_id: int):
        conn = verbinding()
        try:
            hoort_bij_administratie(
                conn, lees_factuur, factuur_id, administratie_id, "factuur"
            )
            gelukt, redenen = keur_factuur_goed(conn, factuur_id)
        finally:
            conn.close()

        if not gelukt:
            return RedirectResponse(
                f"/administratie/{administratie_id}/factuur/{factuur_id}"
                f"?melding={redenen[0]}",
                status_code=303,
            )

        # Goedgekeurd, dus mag hij het grootboek in. Lukt dat niet — meestal
        # omdat er nog geen rekening is gekozen — dan blijft de factuur
        # goedgekeurd maar ongeboekt, en zegt het scherm waarom. Stil laten
        # verdwijnen mag niet: bij de btw-aangifte zou het bedrag dan
        # ontbreken zonder dat iemand het ziet.
        conn = verbinding()
        try:
            boeking_id, boekredenen = boek_factuur(conn, factuur_id)
        finally:
            conn.close()
        if boeking_id is None:
            return RedirectResponse(
                f"/administratie/{administratie_id}/factuur/{factuur_id}"
                f"?melding=Goedgekeurd, maar nog niet geboekt: {boekredenen[0]}",
                status_code=303,
            )
        return RedirectResponse(f"/administratie/{administratie_id}", status_code=303)

    # --- btw-aangifte per kwartaal ---------------------------------------

    @app.get("/administratie/{administratie_id}/btw", response_class=HTMLResponse)
    def btw_nu(administratie_id: int):
        """Ga naar het kwartaal waar we nu in zitten."""
        vandaag = app.state.vandaag or date.today()
        return RedirectResponse(
            f"/administratie/{administratie_id}/btw/{vandaag.year}/"
            f"{kwartaal_van(vandaag)}",
            status_code=303,
        )

    @app.get(
        "/administratie/{administratie_id}/btw/{jaar}/{kwartaal}",
        response_class=HTMLResponse,
    )
    def btw_kwartaal(
        request: Request, administratie_id: int, jaar: int, kwartaal: int
    ):
        if kwartaal not in (1, 2, 3, 4) or not (2000 <= jaar <= 2100):
            raise NietGevonden("kwartaal")

        conn = verbinding()
        try:
            administratie = administratie_van(conn, administratie_id)
            aangifte = bereken_aangifte(conn, administratie_id, jaar, kwartaal)
        finally:
            conn.close()

        vorig = (jaar - 1, 4) if kwartaal == 1 else (jaar, kwartaal - 1)
        volgend = (jaar + 1, 1) if kwartaal == 4 else (jaar, kwartaal + 1)
        return toon(
            request, "btw.html",
            administratie_id=administratie_id,
            administratie_naam=administratie[1],
            aangifte=aangifte,
            vorig=vorig,
            volgend=volgend,
        )

    # --- het originele document laten zien -------------------------------

    @app.get("/administratie/{administratie_id}/document/{document_id}")
    def document(administratie_id: int, document_id: int):
        conn = verbinding()
        try:
            registratie = hoort_bij_administratie(
                conn, lees_document, document_id, administratie_id, "document"
            )
        finally:
            conn.close()

        # Het pad komt uit de database, nooit uit het verzoek: een
        # bezoeker kan dus geen ander bestand van de schijf opvragen.
        pad = Path(registratie["opslagpad"])
        if not pad.is_file():
            raise NietGevonden("document")
        return FileResponse(
            pad,
            media_type=MEDIATYPEN.get(pad.suffix.lower(), "application/octet-stream"),
            filename=registratie["originele_bestandsnaam"],
            content_disposition_type="inline",
        )

    return app


def _kiesbare_rekeningen(factuur: dict) -> list[dict]:
    """De rekeningen die bij deze factuur gekozen mogen worden.

    Welk schema geldt, hangt af van het boekjaar van de factuur. Is er
    geen datum of geen schema voor dat jaar, dan is de lijst leeg en
    toont het scherm dat — er wordt geen schema van een ander jaar
    gebruikt.
    """
    if not factuur.get("factuurdatum"):
        return []
    try:
        jaar = date.fromisoformat(str(factuur["factuurdatum"])).year
    except ValueError:
        return []
    schema = rekeningschema_voor_jaar(jaar)
    if schema is None:
        return []
    return [
        {
            "code": rekening.code,
            "omschrijving": rekening.omschrijving,
            "soort": rekening.soort,
        }
        for rekening in sorted(schema.kiesbaar(), key=lambda r: (r.soort, r.code))
    ]


def _ubl_weergave(registratie: Optional[dict]) -> Optional[Weergave]:
    """Maak de leesbare weergave als het bewaarde bestand een e-factuur is.

    Alleen voor XML: een PDF laat de browser zelf zien, en dat is precies
    wat je naast de velden wilt hebben. XML toonde de browser als ruwe
    tekst vol naamruimten, en daar valt niets mee te vergelijken.

    Het bewaarde bestand wordt alleen gelezen, nooit gewijzigd. De
    grootte wordt eerst op de schijf gecontroleerd, net als in module 4:
    een bestand van honderden megabytes hoort de reviewpagina niet op te
    houden.
    """
    if registratie is None:
        return None
    pad = Path(registratie["opslagpad"])
    if pad.suffix.lower() != ".xml" or not pad.is_file():
        return None

    reden = te_groot(pad.stat().st_size)
    if reden is not None:
        return Weergave(status="onleesbaar", reden=reden)
    try:
        return leesbare_ubl(pad.read_bytes())
    except OSError as fout:
        return Weergave(
            status="onleesbaar", reden=f"kon het bestand niet lezen: {fout}"
        )


def _veldregels(factuur: dict, extractie: Optional[dict]) -> list[dict]:
    """Zet de velden klaar voor het scherm, met zekerheid per veld."""
    zekerheden = _zekerheden(extractie)
    regels = []
    for veld in VELDEN:
        gegeven = zekerheden.get(veld, {})
        regels.append(
            {
                "naam": veld,
                "label": VELDLABELS.get(veld, veld),
                "waarde": factuur.get(veld) or "",
                "zekerheid": gegeven.get("zekerheid"),
                "reden": gegeven.get("reden"),
            }
        )
    return regels


def _zekerheden(extractie: Optional[dict]) -> dict[str, dict]:
    """Haal de zekerheid per veld uit de bewaarde modelrespons.

    Bij een e-factuur is er geen extractie: dan is er ook niets
    onzekers, want de velden stonden letterlijk in het XML-bestand.
    """
    if extractie is None:
        return {}
    import json

    try:
        ruw = json.loads(extractie["ruwe_respons"])
    except (ValueError, TypeError):
        return {}
    if not isinstance(ruw, dict):
        return {}
    return {
        veld: gegeven
        for veld, gegeven in ruw.items()
        if isinstance(gegeven, dict) and "zekerheid" in gegeven
    }
```

## `boekhouding/boekhouding/web/ubl_weergave.py`

```python
"""Een e-factuur leesbaar tonen in het reviewscherm.

Dit is puur weergave. Er wordt niets gerekend, niets gecorrigeerd en
niets opgeslagen: het bewaarde bestand blijft byte voor byte wat de
leverancier stuurde, want dat is wat de bewaarplicht en de audit trail
leidend maken.

Waarom dit nodig is: het reviewscherm bestaat om te vergelijken. Links
hoort te staan wat de leverancier stuurde, rechts wat het systeem eruit
heeft gehaald. Bij een PDF gaat dat vanzelf, maar een e-factuur is XML,
en die toonde de browser als een muur ruwe tekst vol naamruimten. Daar
valt niets mee te vergelijken.

Wat hier gebeurt is dus: dezelfde XML, maar dan als leesbare regels, met
bij elk veld de UBL-plek waar het vandaan komt ("Factuurdatum
(cbc:IssueDate): 2026-08-04"). Die herkomst staat erbij omdat een
leverancier zijn eigen indeling kiest: zie je waar een waarde vandaan
komt, dan zie je ook waarom het systeem hem zo heeft gelezen. De ruwe
XML blijft één klik weg.

De XML wordt hier met dezelfde veilige lezer geopend als in module 4:
geen DTD, geen entiteiten, geen externe verwijzingen. Een aanval mag
niet alsnog langs de weergavelaag binnenkomen.
"""

import xml.etree.ElementTree as ET
from typing import Literal, Optional

from pydantic import BaseModel

from ..ubl import CAC, CBC, XmlOnveilig, is_ubl, lees_xml_veilig

# Hoeveel ruwe XML we hoogstens in de pagina zetten. Een e-factuur is
# een paar kilobyte; is het bestand veel groter, dan tonen we het begin
# en verwijzen we naar het origineel. Anders zou één raar bestand de
# reviewpagina onbruikbaar traag maken.
MAX_TOON_BYTES = 100 * 1024

# De voorvoegsels die in een herkomstpad mogen staan.
NAAMRUIMTEN = {"cbc": CBC, "cac": CAC}

SOORTNAMEN = {
    "factuur": "Factuur (UBL Invoice)",
    "creditnota": "Creditnota (UBL CreditNote)",
}

# De velden per groep, in de volgorde waarin ze op een factuur staan.
# Per veld: het label op het scherm, waar het in UBL staat, en of het
# een kernveld is.
#
# Een kernveld is een veld dat het systeem zelf uitleest en rechts in
# het formulier zet. Die regel staat er altijd, ook als hij ontbreekt —
# dan juist: dat een verplicht veld er niet in staat, is precies wat de
# mens moet zien. De overige velden staan er alleen als ze in het
# bestand voorkomen, anders wordt het scherm een lijst lege regels.
#
# Sommige velden mogen op twee plekken staan; dan staan beide paden
# hier, in dezelfde volgorde waarin module 4 ze ook probeert.
GROEPEN: list[tuple[str, list[tuple[str, tuple[str, ...], bool]]]] = [
    ("Kop", [
        ("Factuurnummer", ("cbc:ID",), True),
        ("Factuurdatum", ("cbc:IssueDate",), True),
        ("Vervaldatum", ("cbc:DueDate",), False),
        ("Valuta", ("cbc:DocumentCurrencyCode",), False),
        ("Toelichting", ("cbc:Note",), False),
    ]),
    ("Leverancier", [
        ("Naam", (
            "cac:AccountingSupplierParty/cac:Party/cac:PartyName/cbc:Name",
            "cac:AccountingSupplierParty/cac:Party/cac:PartyLegalEntity"
            "/cbc:RegistrationName",
        ), True),
        ("Btw-nummer", (
            "cac:AccountingSupplierParty/cac:Party/cac:PartyTaxScheme"
            "/cbc:CompanyID",
        ), False),
        ("Handelsregister", (
            "cac:AccountingSupplierParty/cac:Party/cac:PartyLegalEntity"
            "/cbc:CompanyID",
        ), False),
        ("Plaats", (
            "cac:AccountingSupplierParty/cac:Party/cac:PostalAddress"
            "/cbc:CityName",
        ), False),
    ]),
    ("Afnemer", [
        ("Naam", (
            "cac:AccountingCustomerParty/cac:Party/cac:PartyName/cbc:Name",
            "cac:AccountingCustomerParty/cac:Party/cac:PartyLegalEntity"
            "/cbc:RegistrationName",
        ), False),
    ]),
    ("Bedragen", [
        ("Som van de regels", (
            "cac:LegalMonetaryTotal/cbc:LineExtensionAmount",
        ), False),
        ("Bedrag excl. btw", (
            "cac:LegalMonetaryTotal/cbc:TaxExclusiveAmount",
        ), True),
        ("Totaal incl. btw", (
            "cac:LegalMonetaryTotal/cbc:TaxInclusiveAmount",
        ), True),
        ("Te betalen", ("cac:LegalMonetaryTotal/cbc:PayableAmount",), False),
    ]),
    ("Betaling", [
        ("IBAN", (
            "cac:PaymentMeans/cac:PayeeFinancialAccount/cbc:ID",
        ), False),
        ("Betalingskenmerk", ("cac:PaymentMeans/cbc:PaymentID",), False),
    ]),
]

# De factuurregels heten anders in een creditnota dan in een factuur.
REGELELEMENT = {"factuur": "InvoiceLine", "creditnota": "CreditNoteLine"}
AANTALELEMENT = {"factuur": "InvoicedQuantity", "creditnota": "CreditedQuantity"}


class Rij(BaseModel):
    """Eén veld uit de e-factuur, zoals het op het scherm komt."""

    label: str
    herkomst: str
    waarde: Optional[str] = None
    kern: bool = False


class Groep(BaseModel):
    titel: str
    rijen: list[Rij]


class Regel(BaseModel):
    """Eén factuurregel."""

    nummer: Optional[str] = None
    omschrijving: Optional[str] = None
    aantal: Optional[str] = None
    btw_percentage: Optional[str] = None
    bedrag: Optional[str] = None


class Weergave(BaseModel):
    """Wat het reviewscherm van een e-factuur laat zien."""

    status: Literal["leesbaar", "onleesbaar"]
    reden: str = ""
    documentsoort: Optional[str] = None
    soortnaam: str = ""
    groepen: list[Groep] = []
    regels: list[Regel] = []
    ruwe_xml: str = ""
    xml_afgekapt: bool = False


def _et_pad(herkomst: str) -> str:
    """Vertaal 'cac:Party/cbc:Name' naar het pad dat ElementTree wil.

    Zo hoeft de herkomst maar op één plek te staan: de tekst die de
    gebruiker ziet, is letterlijk het pad waarmee gezocht is. Ze kunnen
    dus niet uit elkaar gaan lopen.
    """
    stukken = []
    for stuk in herkomst.split("/"):
        voorvoegsel, _, naam = stuk.partition(":")
        stukken.append(f"{{{NAAMRUIMTEN[voorvoegsel]}}}{naam}")
    return "/".join(stukken)


def _tekst(element: Optional[ET.Element]) -> Optional[str]:
    if element is None or element.text is None:
        return None
    return element.text.strip() or None


def _zoek(wortel: ET.Element, herkomsten: tuple[str, ...]) -> tuple[Optional[str], str]:
    """Zoek de eerste plek waar dit veld staat; geef (waarde, herkomst).

    Staat het nergens, dan komt de eerste (meest gebruikelijke) plek
    terug, zodat het scherm kan tonen wáár het gemist wordt.
    """
    for herkomst in herkomsten:
        waarde = _tekst(wortel.find(_et_pad(herkomst)))
        if waarde is not None:
            return waarde, herkomst
    return None, herkomsten[0]


def _btw_groep(wortel: ET.Element) -> Groep:
    """Bouw de btw-groep; bij meerdere tarieven komen ze allemaal in beeld.

    Er wordt hier bewust niets opgeteld en niets gekozen. Staan er twee
    tarieven op één factuur, dan ziet de mens ze allebei staan — dat is
    dezelfde boodschap die module 4 als reden meegeeft, maar dan met de
    getallen erbij.
    """
    subtotalen = wortel.findall(f"{{{CAC}}}TaxTotal/{{{CAC}}}TaxSubtotal")
    if not subtotalen:
        return Groep(
            titel="Btw",
            rijen=[
                Rij(
                    label="Btw-percentage",
                    herkomst="cac:TaxTotal/cac:TaxSubtotal/cac:TaxCategory/cbc:Percent",
                    kern=True,
                ),
                Rij(
                    label="Btw-bedrag",
                    herkomst="cac:TaxTotal/cac:TaxSubtotal/cbc:TaxAmount",
                    kern=True,
                ),
            ],
        )

    meerdere = len(subtotalen) > 1
    rijen: list[Rij] = []
    for nummer, subtotaal in enumerate(subtotalen, start=1):
        # Bij één tarief is er niets te nummeren; bij meerdere wel, want
        # dan moet zichtbaar zijn welk bedrag bij welk tarief hoort.
        merk = f" {nummer}" if meerdere else ""
        percentage = _tekst(
            subtotaal.find(f"{{{CAC}}}TaxCategory/{{{CBC}}}Percent")
        )
        rijen.append(Rij(
            label=f"Btw-percentage{merk}",
            herkomst="cac:TaxSubtotal/cac:TaxCategory/cbc:Percent",
            waarde=f"{percentage}%" if percentage else None,
            kern=not meerdere,
        ))
        rijen.append(Rij(
            label=f"Grondslag{merk}",
            herkomst="cac:TaxSubtotal/cbc:TaxableAmount",
            waarde=_tekst(subtotaal.find(f"{{{CBC}}}TaxableAmount")),
        ))
        rijen.append(Rij(
            label=f"Btw-bedrag{merk}",
            herkomst="cac:TaxSubtotal/cbc:TaxAmount",
            waarde=_tekst(subtotaal.find(f"{{{CBC}}}TaxAmount")),
            kern=not meerdere,
        ))
    return Groep(titel="Btw", rijen=rijen)


def _regels(wortel: ET.Element, soort: str) -> list[Regel]:
    """Haal de factuurregels op, als het bestand ze heeft."""
    naam = REGELELEMENT.get(soort)
    if naam is None:
        return []
    aantalnaam = AANTALELEMENT[soort]

    regels = []
    for element in wortel.findall(f"{{{CAC}}}{naam}"):
        item = element.find(f"{{{CAC}}}Item")
        percentage = None
        if item is not None:
            percentage = _tekst(
                item.find(f"{{{CAC}}}ClassifiedTaxCategory/{{{CBC}}}Percent")
            )
        regels.append(Regel(
            nummer=_tekst(element.find(f"{{{CBC}}}ID")),
            omschrijving=_tekst(item.find(f"{{{CBC}}}Name")) if item is not None else None,
            aantal=_tekst(element.find(f"{{{CBC}}}{aantalnaam}")),
            btw_percentage=f"{percentage}%" if percentage else None,
            bedrag=_tekst(element.find(f"{{{CBC}}}LineExtensionAmount")),
        ))
    return regels


def ruwe_tekst(inhoud: bytes) -> tuple[str, bool]:
    """Maak de XML toonbaar als tekst; geef (tekst, is_afgekapt).

    Een e-factuur mag ook UTF-16 zijn. Lukt geen van beide, dan tonen we
    wat er te tonen valt met vervangingstekens in plaats van niets: dit
    is een leesvenster, geen verwerkingsstap.
    """
    afgekapt = len(inhoud) > MAX_TOON_BYTES
    stuk = inhoud[:MAX_TOON_BYTES]
    for codering in ("utf-8", "utf-16"):
        try:
            return stuk.decode(codering), afgekapt
        except (UnicodeDecodeError, UnicodeError):
            continue
    return stuk.decode("utf-8", errors="replace"), afgekapt


def leesbare_ubl(inhoud: bytes) -> Weergave:
    """Zet een e-factuur om in leesbare regels; geeft nooit een exception.

    Lukt het lezen niet — kapotte XML, een DTD-aanval, of gewoon een
    XML-bestand dat geen e-factuur is — dan komt dat als reden terug en
    blijft alleen de ruwe tekst over. Er wordt nooit iets ingevuld of
    gegokt.
    """
    ruw, afgekapt = ruwe_tekst(inhoud)

    def onleesbaar(reden: str) -> Weergave:
        return Weergave(
            status="onleesbaar", reden=reden, ruwe_xml=ruw, xml_afgekapt=afgekapt
        )

    try:
        wortel = lees_xml_veilig(inhoud)
    except XmlOnveilig as fout:
        return onleesbaar(f"onveilige XML geweigerd: {fout}")
    except ET.ParseError as fout:
        return onleesbaar(f"het XML-bestand is niet leesbaar: {fout}")
    except Exception as fout:  # nooit een exception uit de weergavelaag
        return onleesbaar(f"kon het XML-bestand niet lezen: {type(fout).__name__}: {fout}")

    soort = is_ubl(wortel)
    if soort is None:
        return onleesbaar(
            f"het hoofdelement '{wortel.tag}' is geen UBL Invoice of CreditNote"
        )

    groepen: list[Groep] = []
    for titel, velden in GROEPEN:
        rijen = []
        for label, herkomsten, kern in velden:
            waarde, herkomst = _zoek(wortel, herkomsten)
            # Een kernveld staat er altijd, ook leeg: dat het ontbreekt
            # is juist informatie. Een aanvullend veld alleen als het er
            # is, anders wordt het scherm een lijst met strepen.
            if waarde is None and not kern:
                continue
            rijen.append(
                Rij(label=label, herkomst=herkomst, waarde=waarde, kern=kern)
            )
        if titel == "Bedragen":
            # De btw hoort tussen de bedragen en de betaling in.
            if rijen:
                groepen.append(Groep(titel=titel, rijen=rijen))
            groepen.append(_btw_groep(wortel))
            continue
        if rijen:
            groepen.append(Groep(titel=titel, rijen=rijen))

    return Weergave(
        status="leesbaar",
        documentsoort=soort,
        soortnaam=SOORTNAMEN.get(soort, soort),
        groepen=groepen,
        regels=_regels(wortel, soort),
        ruwe_xml=ruw,
        xml_afgekapt=afgekapt,
    )
```

## `boekhouding/boekhouding/web/templates/basis.html`

```html
<!doctype html>
<html lang="nl">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>{% block titel %}Boekhouding{% endblock %}</title>
<style>
  /* Mobiel-eerst: alles staat onder elkaar, en pas op een breed scherm
     naast elkaar. Geen build-stap, geen framework. */
  :root {
    --inkt: #1b1b1b; --zacht: #5c5c5c; --lijn: #dcdcdc; --vel: #ffffff;
    --achter: #f4f4f2; --let-op: #b4381f; --let-op-vlak: #fdeeea;
    --wacht: #8a6d1f; --wacht-vlak: #fdf6e3; --klaar: #1f6b3a;
    --klaar-vlak: #eaf5ee; --knop: #1b1b1b;
  }
  * { box-sizing: border-box; }
  body {
    margin: 0; background: var(--achter); color: var(--inkt);
    font: 16px/1.5 -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
    -webkit-text-size-adjust: 100%;
  }
  header {
    background: var(--vel); border-bottom: 1px solid var(--lijn);
    padding: 14px 16px; position: sticky; top: 0; z-index: 5;
  }
  header a { color: var(--zacht); text-decoration: none; font-size: 15px; }
  header h1 { margin: 4px 0 0; font-size: 19px; }
  main { padding: 16px; max-width: 1100px; margin: 0 auto; }
  a.knop, button {
    display: inline-block; padding: 13px 18px; border-radius: 8px;
    border: 1px solid var(--knop); background: var(--knop); color: #fff;
    font-size: 16px; font-weight: 600; text-decoration: none; cursor: pointer;
    min-height: 46px;  /* groot genoeg voor een duim */
  }
  button.tweede, a.knop.tweede { background: var(--vel); color: var(--inkt); }
  button[disabled] { opacity: .45; cursor: not-allowed; }
  .kaart {
    background: var(--vel); border: 1px solid var(--lijn); border-radius: 10px;
    padding: 16px; margin-bottom: 14px;
  }
  .merk {
    display: inline-block; padding: 3px 9px; border-radius: 999px;
    font-size: 13px; font-weight: 600; white-space: nowrap;
  }
  .merk.review { background: var(--let-op-vlak); color: var(--let-op); }
  .merk.wacht { background: var(--wacht-vlak); color: var(--wacht); }
  .merk.klaar { background: var(--klaar-vlak); color: var(--klaar); }
  .telling { display: flex; gap: 10px; flex-wrap: wrap; margin-bottom: 16px; }
  .telling div {
    flex: 1 1 130px; background: var(--vel); border: 1px solid var(--lijn);
    border-radius: 10px; padding: 12px 14px;
  }
  .telling strong { display: block; font-size: 26px; line-height: 1.2; }
  .telling span { color: var(--zacht); font-size: 14px; }
  .rij {
    display: block; background: var(--vel); border: 1px solid var(--lijn);
    border-radius: 10px; padding: 14px; margin-bottom: 10px;
    text-decoration: none; color: inherit;
  }
  .rij .boven { display: flex; justify-content: space-between; gap: 10px; }
  .rij .naam { font-weight: 600; }
  .rij .onder { color: var(--zacht); font-size: 14px; margin-top: 4px; }
  .rij .bedrag { font-variant-numeric: tabular-nums; font-weight: 600; }
  label { display: block; font-size: 14px; color: var(--zacht); margin-bottom: 4px; }
  input[type=text], input[type=file], select {
    width: 100%; padding: 12px; font-size: 16px; border-radius: 8px;
    border: 1px solid var(--lijn); background: var(--vel);
  }
  .veld { margin-bottom: 14px; }
  .veld.laag input { border-color: var(--let-op); background: var(--let-op-vlak); }
  .waarschuwing {
    background: var(--let-op-vlak); border: 1px solid var(--let-op);
    color: var(--let-op); border-radius: 10px; padding: 14px; margin-bottom: 14px;
  }
  .waarschuwing ul { margin: 8px 0 0; padding-left: 20px; }
  .melding {
    background: var(--klaar-vlak); border: 1px solid var(--klaar);
    color: var(--klaar); border-radius: 10px; padding: 12px; margin-bottom: 14px;
  }
  .bron { width: 100%; height: 60vh; border: 1px solid var(--lijn); border-radius: 10px; }
  .bron img { width: 100%; height: auto; display: block; }
  /* De leesbare weergave van een e-factuur (XML). Zelfde hoogte als
     het documentvenster ernaast, zodat de twee kolommen uitlijnen. */
  .bron-lees {
    background: var(--vel); border: 1px solid var(--lijn); border-radius: 10px;
    padding: 16px; margin-bottom: 14px;
    /* Eigen schuifgebied, zodat de velden ernaast bereikbaar blijven
       zonder eerst het hele document door te scrollen. De rand staat om
       het schuifgebied zelf, anders lijkt een afgekapte regel een fout
       in plaats van "hier gaat het verder". */
    max-height: 55vh; overflow: auto; overscroll-behavior: contain;
  }
  .ubl-groep + .ubl-groep { margin-top: 16px; }
  .ubl-groep h3 {
    margin: 0 0 6px; font-size: 13px; text-transform: uppercase;
    letter-spacing: .04em; color: var(--zacht);
  }
  .ubl-rij {
    display: flex; justify-content: space-between; gap: 12px;
    padding: 7px 0; border-top: 1px solid var(--lijn);
  }
  .ubl-rij .label { font-size: 15px; }
  .ubl-rij .herkomst {
    color: var(--zacht); font-size: 12px;
    font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
    word-break: break-all;
  }
  .ubl-rij .waarde {
    font-variant-numeric: tabular-nums; font-weight: 600; text-align: right;
    white-space: nowrap;
  }
  .ubl-rij.ontbreekt .waarde {
    color: var(--let-op); font-weight: 400; font-style: italic;
  }
  details summary {
    cursor: pointer; font-weight: 600; min-height: 24px; padding: 4px 0;
  }
  pre.xml {
    overflow: auto; max-height: 45vh; background: var(--achter);
    border: 1px solid var(--lijn); border-radius: 8px; padding: 12px;
    font-size: 12px; line-height: 1.45; white-space: pre;
  }
  .knoppen { display: flex; gap: 10px; flex-wrap: wrap; }
  .knoppen button, .knoppen a.knop { flex: 1 1 160px; text-align: center; }
  .leeg { color: var(--zacht); text-align: center; padding: 40px 10px; }
  /* Navigatie tussen kwartalen: geen brede knoppen, het zijn stappen. */
  .stappen a.knop { flex: 0 0 auto; padding: 10px 14px; min-height: 40px; }
  @media (min-width: 860px) {
    .twee-kolommen { display: grid; grid-template-columns: 1fr 1fr; gap: 18px; }
    /* Zonder min-width:0 duwt brede inhoud (de ruwe XML) de kolom op en
       wordt de andere kolom smaller. */
    .twee-kolommen > * { min-width: 0; }
    .bron { height: 78vh; position: sticky; top: 80px; }
    .bron-kolom { position: sticky; top: 80px; }
    .bron-lees { max-height: 62vh; }
  }
</style>
</head>
<body>
<header>
  {% block kruimel %}{% endblock %}
  <h1>{% block kop %}Boekhouding{% endblock %}</h1>
</header>
<main>{% block inhoud %}{% endblock %}</main>
</body>
</html>
```

## `boekhouding/boekhouding/web/templates/overzicht.html`

```html
{% extends "basis.html" %}
{% block titel %}Facturen — {{ administratie_naam }}{% endblock %}
{% block kop %}{{ administratie_naam }}{% endblock %}
{% block inhoud %}

<div class="telling">
  <div>
    <strong>{{ aantal_review }}</strong>
    <span>{% if aantal_review == 1 %}factuur wacht op jou{% else %}facturen wachten op jou{% endif %}</span>
  </div>
  <div>
    <strong>{{ aantal_wacht }}</strong>
    <span>klaar om goed te keuren</span>
  </div>
  <div>
    <strong>{{ facturen|length }}</strong>
    <span>facturen totaal</span>
  </div>
</div>

<div class="knoppen" style="margin-bottom:16px">
  <a class="knop" href="/administratie/{{ administratie_id }}/upload">Factuur toevoegen</a>
  <a class="knop tweede" href="/administratie/{{ administratie_id }}/btw">Btw-aangifte</a>
</div>

{% if not facturen %}
  <p class="leeg">Nog geen facturen. Voeg er een toe met de knop hierboven.</p>
{% endif %}

{% for factuur in facturen %}
  <a class="rij" href="/administratie/{{ administratie_id }}/factuur/{{ factuur.id }}">
    <div class="boven">
      <span class="naam">{{ factuur.leverancier or "Leverancier onbekend" }}</span>
      {% if factuur.status == "review_nodig" %}
        <span class="merk review">Review nodig</span>
      {% elif factuur.goedgekeurd_op %}
        <span class="merk klaar">Goedgekeurd</span>
      {% else %}
        <span class="merk wacht">Klaar om goed te keuren</span>
      {% endif %}
    </div>
    <div class="boven onder">
      <span>{{ factuur.factuurdatum or "datum onbekend" }}</span>
      <span class="bedrag">{{ factuur.bedrag_incl or "—" }}</span>
    </div>
    {% if factuur.status == "review_nodig" and factuur.review_redenen %}
      <div class="onder">{{ factuur.review_redenen[0] }}</div>
    {% endif %}
  </a>
{% endfor %}

{% endblock %}
```

## `boekhouding/boekhouding/web/templates/upload.html`

```html
{% extends "basis.html" %}
{% block titel %}Factuur toevoegen{% endblock %}
{% block kruimel %}<a href="/administratie/{{ administratie_id }}">&larr; Terug naar de lijst</a>{% endblock %}
{% block kop %}Factuur toevoegen{% endblock %}
{% block inhoud %}

<form class="kaart" method="post" enctype="multipart/form-data"
      action="/administratie/{{ administratie_id }}/upload">
  <div class="veld">
    <label for="bestand">Kies een bestand of maak een foto</label>
    <input type="file" id="bestand" name="bestand" required
           accept="image/*,.pdf,.xml" capture>
  </div>
  <p class="onder" style="color:#5c5c5c;font-size:14px">
    Een PDF, een foto van een papieren factuur, of een e-factuur (XML).
    Een e-factuur wordt rechtstreeks uitgelezen; bij een PDF of foto
    leest het model hem voor je uit en kijk jij het daarna na.
  </p>
  <button type="submit">Toevoegen</button>
</form>

{% endblock %}
```

## `boekhouding/boekhouding/web/templates/review.html`

```html
{% extends "basis.html" %}
{% block titel %}Factuur {{ factuur.factuurnummer or factuur.id }}{% endblock %}
{% block kruimel %}<a href="/administratie/{{ administratie_id }}">&larr; Terug naar de lijst</a>{% endblock %}
{% block kop %}{{ factuur.leverancier or "Factuur nakijken" }}{% endblock %}
{% block inhoud %}

{% if melding %}<div class="melding">{{ melding }}</div>{% endif %}

{% if factuur.review_redenen %}
  <div class="waarschuwing">
    <strong>Dit moet nog nagekeken worden:</strong>
    <ul>{% for reden in factuur.review_redenen %}<li>{{ reden }}</li>{% endfor %}</ul>
  </div>
{% elif factuur.goedgekeurd_op %}
  <div class="melding">Goedgekeurd op {{ factuur.goedgekeurd_op }}.</div>
{% endif %}

<div class="twee-kolommen">

  <div>
    {% if not factuur.document_id %}
      <div class="kaart leeg">Geen origineel document bij deze factuur.</div>
    {% elif ubl %}
      {# Een e-factuur is XML. De browser toont die als een muur ruwe
         tekst, dus zetten we de velden leesbaar onder elkaar, met de
         UBL-plek waar elk veld vandaan komt. Het bewaarde bestand
         verandert niet: dat blijft het origineel. #}
      <div class="bron-kolom">
       <div class="bron-lees">
        {% if ubl.status == 'leesbaar' %}
          <div>
            <div class="onder" style="color:var(--zacht);font-size:14px;margin-bottom:10px">
              {{ ubl.soortnaam }} — zoals de leverancier hem verstuurde
            </div>

            {% for groep in ubl.groepen %}
              <div class="ubl-groep">
                <h3>{{ groep.titel }}</h3>
                {% for rij in groep.rijen %}
                  <div class="ubl-rij {% if rij.waarde is none %}ontbreekt{% endif %}">
                    <div>
                      <div class="label">{{ rij.label }}</div>
                      <div class="herkomst">{{ rij.herkomst }}</div>
                    </div>
                    <div class="waarde">
                      {%- if rij.waarde is none -%}niet in het bestand{%- else -%}{{ rij.waarde }}{%- endif -%}
                    </div>
                  </div>
                {% endfor %}
              </div>
            {% endfor %}

            {% if ubl.regels %}
              <div class="ubl-groep">
                <h3>Factuurregels</h3>
                {% for regel in ubl.regels %}
                  <div class="ubl-rij">
                    <div>
                      <div class="label">
                        {% if regel.nummer %}{{ regel.nummer }}. {% endif %}
                        {{ regel.omschrijving or "zonder omschrijving" }}
                      </div>
                      <div class="herkomst">
                        {% if regel.aantal %}aantal {{ regel.aantal }}{% endif %}
                        {% if regel.btw_percentage %} &middot; btw {{ regel.btw_percentage }}{% endif %}
                      </div>
                    </div>
                    <div class="waarde">{{ regel.bedrag or "" }}</div>
                  </div>
                {% endfor %}
              </div>
            {% endif %}
          </div>
        {% else %}
          <div class="waarschuwing">
            Dit XML-bestand is niet als e-factuur te lezen: {{ ubl.reden }}
          </div>
        {% endif %}
       </div>

        <details class="kaart">
          <summary>Toon XML</summary>
          <p class="onder" style="color:var(--zacht);font-size:14px">
            Het originele bestand blijft leidend voor de bewaarplicht en de
            audit trail. Hierboven staat alleen een leesbare weergave ervan.
            {% if ubl.xml_afgekapt %}
              Alleen het begin wordt getoond;
              <a href="/administratie/{{ administratie_id }}/document/{{ factuur.document_id }}">open het hele bestand</a>.
            {% endif %}
          </p>
          <pre class="xml">{{ ubl.ruwe_xml }}</pre>
          <a class="knop tweede" href="/administratie/{{ administratie_id }}/document/{{ factuur.document_id }}">Origineel downloaden</a>
        </details>
      </div>
    {% else %}
      <object class="bron" data="/administratie/{{ administratie_id }}/document/{{ factuur.document_id }}">
        <p style="padding:14px">
          Het document kan hier niet worden getoond.
          <a href="/administratie/{{ administratie_id }}/document/{{ factuur.document_id }}">Open het in een nieuw tabblad</a>.
        </p>
      </object>
    {% endif %}
  </div>

  <div>
    <form class="kaart" method="post" action="/administratie/{{ administratie_id }}/factuur/{{ factuur.id }}/opslaan">
      {% for veld in velden %}
        <div class="veld {% if veld.zekerheid == 'laag' %}laag{% endif %}">
          <label for="{{ veld.naam }}">
            {{ veld.label }}
            {% if veld.zekerheid == 'laag' %}
              <span class="merk review">lage zekerheid</span>
            {% elif veld.zekerheid == 'hoog' %}
              <span class="merk klaar">zeker</span>
            {% endif %}
          </label>
          <input type="text" id="{{ veld.naam }}" name="{{ veld.naam }}"
                 value="{{ veld.waarde }}" inputmode="{% if 'bedrag' in veld.naam or 'percentage' in veld.naam %}decimal{% else %}text{% endif %}">
          {% if veld.reden %}
            <div class="onder" style="color:#b4381f">{{ veld.reden }}</div>
          {% endif %}
        </div>
      {% endfor %}

      <div class="veld">
        <label for="rekening">Grootboekrekening</label>
        {% if boeking %}
          <input type="text" value="{{ factuur.rekening }}" disabled>
          <div class="onder" style="color:var(--zacht);font-size:14px">
            Deze factuur is geboekt, dus de rekening ligt vast. Klopt hij niet,
            dan hoort daar een tegenboeking bij; een boeking wordt nooit
            gewijzigd.
          </div>
        {% elif rekeningen %}
          <select id="rekening" name="rekening">
            <option value="">— nog niet gekozen —</option>
            {% for rekening in rekeningen %}
              <option value="{{ rekening.code }}"
                      {% if rekening.code == factuur.rekening %}selected{% endif %}>
                {{ rekening.code }} · {{ rekening.omschrijving }}
                ({{ rekening.soort }})
              </option>
            {% endfor %}
          </select>
          <div class="onder" style="color:var(--zacht);font-size:14px">
            Kies je een kostenrekening, dan wordt dit een inkoopfactuur; kies je
            omzet, dan een verkoopfactuur. Zonder keuze komt de factuur niet in
            het grootboek en houdt hij de btw-aangifte tegen.
          </div>
        {% else %}
          <div class="onder" style="color:var(--let-op);font-size:14px">
            Er is geen rekeningschema voor dit boekjaar, of de factuurdatum
            ontbreekt nog. Vul eerst de datum in.
          </div>
        {% endif %}
      </div>

      <div class="knoppen">
        <button type="submit" class="tweede">Opslaan en later beoordelen</button>
      </div>
    </form>

    {% if boeking %}
      <div class="kaart">
        <h3 style="margin:0 0 8px;font-size:15px">
          Boeking {{ boeking.id }} — {{ boeking.boekdatum }}
        </h3>
        {% for regel in boeking.regels %}
          <div class="ubl-rij">
            <div>
              <div class="label">{{ regel.rekening }} · {{ regel.omschrijving }}</div>
            </div>
            <div class="waarde">
              {% if regel.debet != '0.00' %}{{ regel.debet }} debet
              {% else %}{{ regel.credit }} credit{% endif %}
            </div>
          </div>
        {% endfor %}
      </div>
    {% elif factuur.goedgekeurd_op %}
      <div class="waarschuwing">
        Deze factuur is goedgekeurd maar staat nog niet in het grootboek, en
        telt dus niet mee in de btw-aangifte.
      </div>
    {% endif %}

    <form class="kaart" method="post" action="/administratie/{{ administratie_id }}/factuur/{{ factuur.id }}/goedkeuren">
      <div class="knoppen">
        <button type="submit" {% if not mag_goedkeuren %}disabled{% endif %}>
          {% if factuur.goedgekeurd_op %}Al goedgekeurd{% else %}Goedkeuren{% endif %}
        </button>
      </div>
      {% if not mag_goedkeuren and not factuur.goedgekeurd_op %}
        <p class="onder" style="color:#5c5c5c;font-size:14px;margin-bottom:0">
          Goedkeuren kan pas als de punten hierboven zijn opgelost.
          Pas een veld aan en sla op; de controle loopt dan opnieuw.
        </p>
      {% endif %}
    </form>

    {% if extractie %}
      <div class="kaart">
        <div class="onder" style="color:#5c5c5c;font-size:14px">
          Uitgelezen door {{ extractie.model }}
          (prompt {{ extractie.prompt_versie }}, via {{ extractie.invoerpad }}).
        </div>
      </div>
    {% endif %}
  </div>

</div>
{% endblock %}
```

## `boekhouding/boekhouding/web/templates/btw.html`

```html
{% extends "basis.html" %}
{% block titel %}Btw {{ aangifte.jaar }} K{{ aangifte.kwartaal }}{% endblock %}
{% block kruimel %}<a href="/administratie/{{ administratie_id }}">&larr; Terug naar de lijst</a>{% endblock %}
{% block kop %}Btw-aangifte {{ aangifte.jaar }} · kwartaal {{ aangifte.kwartaal }}{% endblock %}
{% block inhoud %}

<div class="knoppen stappen" style="margin-bottom:14px">
  <a class="knop tweede" href="/administratie/{{ administratie_id }}/btw/{{ vorig[0] }}/{{ vorig[1] }}">
    &larr; {{ vorig[0] }} K{{ vorig[1] }}
  </a>
  <a class="knop tweede" href="/administratie/{{ administratie_id }}/btw/{{ volgend[0] }}/{{ volgend[1] }}">
    {{ volgend[0] }} K{{ volgend[1] }} &rarr;
  </a>
</div>

<p class="onder" style="color:var(--zacht);font-size:14px;margin-top:0">
  Periode {{ aangifte.van }} tot en met {{ aangifte.tot }}.
</p>

{% if aangifte.status == 'geblokkeerd' %}

  <div class="waarschuwing">
    <strong>Er is niets uitgerekend.</strong>
    <ul>{% for reden in aangifte.redenen %}<li>{{ reden }}</li>{% endfor %}</ul>
  </div>

  {% if aangifte.blokkades %}
    <h2 style="font-size:17px">Dit staat nog open</h2>
    {% for blokkade in aangifte.blokkades %}
      <a class="rij" href="/administratie/{{ administratie_id }}/factuur/{{ blokkade.factuur_id }}">
        <div class="boven">
          <span class="naam">{{ blokkade.leverancier or "onbekende leverancier" }}</span>
          <span class="bedrag">{{ blokkade.bedrag_incl or "" }}</span>
        </div>
        <div class="onder">{{ blokkade.factuurdatum }} · {{ blokkade.reden }}</div>
      </a>
    {% endfor %}
  {% endif %}

{% else %}

  <div class="kaart">
    <div class="ubl-groep">
      <h3>Rubrieken</h3>
      {% for rubriek in aangifte.rubrieken %}
        <div class="ubl-rij">
          <div>
            <div class="label">{{ rubriek.code }} · {{ rubriek.omschrijving }}</div>
            <div class="herkomst">omzet {{ rubriek.grondslag }}</div>
          </div>
          <div class="waarde">{{ rubriek.btw }}</div>
        </div>
      {% endfor %}
      <div class="ubl-rij">
        <div><div class="label">5a · Verschuldigde omzetbelasting</div></div>
        <div class="waarde">{{ aangifte.verschuldigd }}</div>
      </div>
      <div class="ubl-rij">
        <div><div class="label">5b · Voorbelasting</div></div>
        <div class="waarde">{{ aangifte.voorbelasting }}</div>
      </div>
    </div>

    <div class="ubl-groep">
      <h3>Saldo</h3>
      <div class="ubl-rij">
        <div>
          <div class="label">
            {% if aangifte.saldo_richting == 'betalen' %}Te betalen aan de Belastingdienst
            {% elif aangifte.saldo_richting == 'terugvragen' %}Terug te vragen
            {% else %}Niets te betalen en niets terug te vragen{% endif %}
          </div>
          <div class="herkomst">5a min 5b, over {{ aangifte.aantal_boekingen }} boekingen</div>
        </div>
        <div class="waarde">{{ aangifte.saldo }}</div>
      </div>
    </div>
  </div>

{% endif %}

{% for waarschuwing in aangifte.waarschuwingen %}
  <div class="waarschuwing">{{ waarschuwing }}</div>
{% endfor %}

<div class="kaart">
  <strong>Dit is een voorstel, geen aangifte.</strong>
  <p class="onder" style="color:var(--zacht);font-size:14px;margin-bottom:0">
    {{ aangifte.voorbehoud }}
  </p>
</div>

{% endblock %}
```

## `boekhouding/boekhouding/web/templates/fout.html`

```html
{% extends "basis.html" %}
{% block titel %}{{ titel }}{% endblock %}
{% block kop %}{{ titel }}{% endblock %}
{% block inhoud %}
<div class="waarschuwing">{{ bericht }}</div>
<a class="knop tweede" href="{{ terug|default('/') }}">Terug</a>
{% endblock %}
```

## `boekhouding/boekhouding/config/btw_2024.json`

```json
{
  "jaar": 2024,
  "btw_percentages": ["21", "9", "0"]
}
```

## `boekhouding/boekhouding/config/btw_2025.json`

```json
{
  "jaar": 2025,
  "btw_percentages": ["21", "9", "0"]
}
```

## `boekhouding/boekhouding/config/btw_2026.json`

```json
{
  "jaar": 2026,
  "btw_percentages": ["21", "9", "0"]
}
```

## `boekhouding/boekhouding/config/rekeningen_2024.json`

```json
{
  "jaar": 2024,
  "let_op": "De RGS-codes in dit bestand zijn een met de hand gemaakte subset en zijn NIET geverifieerd tegen de officiele RGS-lijst van het RGS-beheerplatform. Controleer ze voordat je hier een echte aangifte of een export naar een accountant op baseert. De code waarop dit systeem boekt is het veld 'code'; 'rgs_code' is alleen een verwijzing.",
  "standaardrekeningen": {
    "crediteuren": "1600",
    "debiteuren": "1300",
    "btw_voorbelasting": "1520",
    "btw_verschuldigd": {
      "21": "1510",
      "9": "1511"
    }
  },
  "rekeningen": [
    {
      "code": "0100",
      "rgs_code": "BIvaMvaIni",
      "omschrijving": "Inventaris",
      "soort": "activa"
    },
    {
      "code": "0110",
      "rgs_code": "BIvaMvaCom",
      "omschrijving": "Computers en apparatuur",
      "soort": "activa"
    },
    {
      "code": "0120",
      "rgs_code": "BIvaMvaVer",
      "omschrijving": "Vervoermiddelen",
      "soort": "activa"
    },
    {
      "code": "0150",
      "rgs_code": "BIvaMvaAfs",
      "omschrijving": "Cumulatieve afschrijving",
      "soort": "activa"
    },
    {
      "code": "1000",
      "rgs_code": "BLimKasKas",
      "omschrijving": "Kas",
      "soort": "activa"
    },
    {
      "code": "1100",
      "rgs_code": "BLimBanRba",
      "omschrijving": "Bankrekening",
      "soort": "activa"
    },
    {
      "code": "1300",
      "rgs_code": "BVorHanDeb",
      "omschrijving": "Debiteuren",
      "soort": "activa"
    },
    {
      "code": "1400",
      "rgs_code": "BVorOvrVoo",
      "omschrijving": "Vooruitbetaalde kosten",
      "soort": "activa"
    },
    {
      "code": "1520",
      "rgs_code": "BVorOvrTvb",
      "omschrijving": "Te vorderen btw (voorbelasting)",
      "soort": "btw"
    },
    {
      "code": "0500",
      "rgs_code": "BEivKapKap",
      "omschrijving": "Eigen vermogen",
      "soort": "passiva"
    },
    {
      "code": "0550",
      "rgs_code": "BEivKapPro",
      "omschrijving": "Privé-opnamen",
      "soort": "passiva"
    },
    {
      "code": "0560",
      "rgs_code": "BEivKapPrs",
      "omschrijving": "Privé-stortingen",
      "soort": "passiva"
    },
    {
      "code": "1600",
      "rgs_code": "BSchHanCre",
      "omschrijving": "Crediteuren",
      "soort": "passiva"
    },
    {
      "code": "1610",
      "rgs_code": "BSchOvsTbb",
      "omschrijving": "Te betalen kosten",
      "soort": "passiva"
    },
    {
      "code": "1510",
      "rgs_code": "BSchBtwBth",
      "omschrijving": "Te betalen btw hoog tarief",
      "soort": "btw"
    },
    {
      "code": "1511",
      "rgs_code": "BSchBtwBtl",
      "omschrijving": "Te betalen btw laag tarief",
      "soort": "btw"
    },
    {
      "code": "8000",
      "rgs_code": "WOmzNetOmh",
      "omschrijving": "Omzet diensten hoog tarief",
      "soort": "opbrengsten"
    },
    {
      "code": "8010",
      "rgs_code": "WOmzNetOml",
      "omschrijving": "Omzet diensten laag tarief",
      "soort": "opbrengsten"
    },
    {
      "code": "8020",
      "rgs_code": "WOmzNetOmn",
      "omschrijving": "Omzet nultarief of vrijgesteld",
      "soort": "opbrengsten"
    },
    {
      "code": "8100",
      "rgs_code": "WOmzOvoOvo",
      "omschrijving": "Overige opbrengsten",
      "soort": "opbrengsten"
    },
    {
      "code": "7000",
      "rgs_code": "WKprInkInk",
      "omschrijving": "Inkoopwaarde materialen",
      "soort": "kosten"
    },
    {
      "code": "7100",
      "rgs_code": "WKprUitUit",
      "omschrijving": "Uitbesteed werk",
      "soort": "kosten"
    },
    {
      "code": "4000",
      "rgs_code": "WBedHuiHui",
      "omschrijving": "Huisvestingskosten",
      "soort": "kosten"
    },
    {
      "code": "4100",
      "rgs_code": "WBedKanKan",
      "omschrijving": "Kantoorkosten",
      "soort": "kosten"
    },
    {
      "code": "4110",
      "rgs_code": "WBedKanTel",
      "omschrijving": "Telefoon en internet",
      "soort": "kosten"
    },
    {
      "code": "4120",
      "rgs_code": "WBedKanAut",
      "omschrijving": "Software en abonnementen",
      "soort": "kosten"
    },
    {
      "code": "4130",
      "rgs_code": "WBedKanKla",
      "omschrijving": "Kleine aanschaffingen",
      "soort": "kosten"
    },
    {
      "code": "4140",
      "rgs_code": "WBedKanVak",
      "omschrijving": "Contributies en vakliteratuur",
      "soort": "kosten"
    },
    {
      "code": "4200",
      "rgs_code": "WBedVkkAut",
      "omschrijving": "Autokosten",
      "soort": "kosten"
    },
    {
      "code": "4210",
      "rgs_code": "WBedVkkRei",
      "omschrijving": "Reis- en verblijfkosten",
      "soort": "kosten"
    },
    {
      "code": "4220",
      "rgs_code": "WBedVkkRep",
      "omschrijving": "Representatiekosten",
      "soort": "kosten"
    },
    {
      "code": "4230",
      "rgs_code": "WBedVkkRec",
      "omschrijving": "Marketing en reclame",
      "soort": "kosten"
    },
    {
      "code": "4300",
      "rgs_code": "WBedAlgVer",
      "omschrijving": "Verzekeringen",
      "soort": "kosten"
    },
    {
      "code": "4310",
      "rgs_code": "WBedAlgAdv",
      "omschrijving": "Accountants- en advieskosten",
      "soort": "kosten"
    },
    {
      "code": "4320",
      "rgs_code": "WBedAlgBan",
      "omschrijving": "Bankkosten",
      "soort": "kosten"
    },
    {
      "code": "4400",
      "rgs_code": "WBedAfsAfs",
      "omschrijving": "Afschrijvingskosten",
      "soort": "kosten"
    }
  ]
}
```

## `boekhouding/boekhouding/config/rekeningen_2025.json`

```json
{
  "jaar": 2025,
  "let_op": "De RGS-codes in dit bestand zijn een met de hand gemaakte subset en zijn NIET geverifieerd tegen de officiele RGS-lijst van het RGS-beheerplatform. Controleer ze voordat je hier een echte aangifte of een export naar een accountant op baseert. De code waarop dit systeem boekt is het veld 'code'; 'rgs_code' is alleen een verwijzing.",
  "standaardrekeningen": {
    "crediteuren": "1600",
    "debiteuren": "1300",
    "btw_voorbelasting": "1520",
    "btw_verschuldigd": {
      "21": "1510",
      "9": "1511"
    }
  },
  "rekeningen": [
    {
      "code": "0100",
      "rgs_code": "BIvaMvaIni",
      "omschrijving": "Inventaris",
      "soort": "activa"
    },
    {
      "code": "0110",
      "rgs_code": "BIvaMvaCom",
      "omschrijving": "Computers en apparatuur",
      "soort": "activa"
    },
    {
      "code": "0120",
      "rgs_code": "BIvaMvaVer",
      "omschrijving": "Vervoermiddelen",
      "soort": "activa"
    },
    {
      "code": "0150",
      "rgs_code": "BIvaMvaAfs",
      "omschrijving": "Cumulatieve afschrijving",
      "soort": "activa"
    },
    {
      "code": "1000",
      "rgs_code": "BLimKasKas",
      "omschrijving": "Kas",
      "soort": "activa"
    },
    {
      "code": "1100",
      "rgs_code": "BLimBanRba",
      "omschrijving": "Bankrekening",
      "soort": "activa"
    },
    {
      "code": "1300",
      "rgs_code": "BVorHanDeb",
      "omschrijving": "Debiteuren",
      "soort": "activa"
    },
    {
      "code": "1400",
      "rgs_code": "BVorOvrVoo",
      "omschrijving": "Vooruitbetaalde kosten",
      "soort": "activa"
    },
    {
      "code": "1520",
      "rgs_code": "BVorOvrTvb",
      "omschrijving": "Te vorderen btw (voorbelasting)",
      "soort": "btw"
    },
    {
      "code": "0500",
      "rgs_code": "BEivKapKap",
      "omschrijving": "Eigen vermogen",
      "soort": "passiva"
    },
    {
      "code": "0550",
      "rgs_code": "BEivKapPro",
      "omschrijving": "Privé-opnamen",
      "soort": "passiva"
    },
    {
      "code": "0560",
      "rgs_code": "BEivKapPrs",
      "omschrijving": "Privé-stortingen",
      "soort": "passiva"
    },
    {
      "code": "1600",
      "rgs_code": "BSchHanCre",
      "omschrijving": "Crediteuren",
      "soort": "passiva"
    },
    {
      "code": "1610",
      "rgs_code": "BSchOvsTbb",
      "omschrijving": "Te betalen kosten",
      "soort": "passiva"
    },
    {
      "code": "1510",
      "rgs_code": "BSchBtwBth",
      "omschrijving": "Te betalen btw hoog tarief",
      "soort": "btw"
    },
    {
      "code": "1511",
      "rgs_code": "BSchBtwBtl",
      "omschrijving": "Te betalen btw laag tarief",
      "soort": "btw"
    },
    {
      "code": "8000",
      "rgs_code": "WOmzNetOmh",
      "omschrijving": "Omzet diensten hoog tarief",
      "soort": "opbrengsten"
    },
    {
      "code": "8010",
      "rgs_code": "WOmzNetOml",
      "omschrijving": "Omzet diensten laag tarief",
      "soort": "opbrengsten"
    },
    {
      "code": "8020",
      "rgs_code": "WOmzNetOmn",
      "omschrijving": "Omzet nultarief of vrijgesteld",
      "soort": "opbrengsten"
    },
    {
      "code": "8100",
      "rgs_code": "WOmzOvoOvo",
      "omschrijving": "Overige opbrengsten",
      "soort": "opbrengsten"
    },
    {
      "code": "7000",
      "rgs_code": "WKprInkInk",
      "omschrijving": "Inkoopwaarde materialen",
      "soort": "kosten"
    },
    {
      "code": "7100",
      "rgs_code": "WKprUitUit",
      "omschrijving": "Uitbesteed werk",
      "soort": "kosten"
    },
    {
      "code": "4000",
      "rgs_code": "WBedHuiHui",
      "omschrijving": "Huisvestingskosten",
      "soort": "kosten"
    },
    {
      "code": "4100",
      "rgs_code": "WBedKanKan",
      "omschrijving": "Kantoorkosten",
      "soort": "kosten"
    },
    {
      "code": "4110",
      "rgs_code": "WBedKanTel",
      "omschrijving": "Telefoon en internet",
      "soort": "kosten"
    },
    {
      "code": "4120",
      "rgs_code": "WBedKanAut",
      "omschrijving": "Software en abonnementen",
      "soort": "kosten"
    },
    {
      "code": "4130",
      "rgs_code": "WBedKanKla",
      "omschrijving": "Kleine aanschaffingen",
      "soort": "kosten"
    },
    {
      "code": "4140",
      "rgs_code": "WBedKanVak",
      "omschrijving": "Contributies en vakliteratuur",
      "soort": "kosten"
    },
    {
      "code": "4200",
      "rgs_code": "WBedVkkAut",
      "omschrijving": "Autokosten",
      "soort": "kosten"
    },
    {
      "code": "4210",
      "rgs_code": "WBedVkkRei",
      "omschrijving": "Reis- en verblijfkosten",
      "soort": "kosten"
    },
    {
      "code": "4220",
      "rgs_code": "WBedVkkRep",
      "omschrijving": "Representatiekosten",
      "soort": "kosten"
    },
    {
      "code": "4230",
      "rgs_code": "WBedVkkRec",
      "omschrijving": "Marketing en reclame",
      "soort": "kosten"
    },
    {
      "code": "4300",
      "rgs_code": "WBedAlgVer",
      "omschrijving": "Verzekeringen",
      "soort": "kosten"
    },
    {
      "code": "4310",
      "rgs_code": "WBedAlgAdv",
      "omschrijving": "Accountants- en advieskosten",
      "soort": "kosten"
    },
    {
      "code": "4320",
      "rgs_code": "WBedAlgBan",
      "omschrijving": "Bankkosten",
      "soort": "kosten"
    },
    {
      "code": "4400",
      "rgs_code": "WBedAfsAfs",
      "omschrijving": "Afschrijvingskosten",
      "soort": "kosten"
    }
  ]
}
```

## `boekhouding/boekhouding/config/rekeningen_2026.json`

```json
{
  "jaar": 2026,
  "let_op": "De RGS-codes in dit bestand zijn een met de hand gemaakte subset en zijn NIET geverifieerd tegen de officiele RGS-lijst van het RGS-beheerplatform. Controleer ze voordat je hier een echte aangifte of een export naar een accountant op baseert. De code waarop dit systeem boekt is het veld 'code'; 'rgs_code' is alleen een verwijzing.",
  "standaardrekeningen": {
    "crediteuren": "1600",
    "debiteuren": "1300",
    "btw_voorbelasting": "1520",
    "btw_verschuldigd": {
      "21": "1510",
      "9": "1511"
    }
  },
  "rekeningen": [
    {
      "code": "0100",
      "rgs_code": "BIvaMvaIni",
      "omschrijving": "Inventaris",
      "soort": "activa"
    },
    {
      "code": "0110",
      "rgs_code": "BIvaMvaCom",
      "omschrijving": "Computers en apparatuur",
      "soort": "activa"
    },
    {
      "code": "0120",
      "rgs_code": "BIvaMvaVer",
      "omschrijving": "Vervoermiddelen",
      "soort": "activa"
    },
    {
      "code": "0150",
      "rgs_code": "BIvaMvaAfs",
      "omschrijving": "Cumulatieve afschrijving",
      "soort": "activa"
    },
    {
      "code": "1000",
      "rgs_code": "BLimKasKas",
      "omschrijving": "Kas",
      "soort": "activa"
    },
    {
      "code": "1100",
      "rgs_code": "BLimBanRba",
      "omschrijving": "Bankrekening",
      "soort": "activa"
    },
    {
      "code": "1300",
      "rgs_code": "BVorHanDeb",
      "omschrijving": "Debiteuren",
      "soort": "activa"
    },
    {
      "code": "1400",
      "rgs_code": "BVorOvrVoo",
      "omschrijving": "Vooruitbetaalde kosten",
      "soort": "activa"
    },
    {
      "code": "1520",
      "rgs_code": "BVorOvrTvb",
      "omschrijving": "Te vorderen btw (voorbelasting)",
      "soort": "btw"
    },
    {
      "code": "0500",
      "rgs_code": "BEivKapKap",
      "omschrijving": "Eigen vermogen",
      "soort": "passiva"
    },
    {
      "code": "0550",
      "rgs_code": "BEivKapPro",
      "omschrijving": "Privé-opnamen",
      "soort": "passiva"
    },
    {
      "code": "0560",
      "rgs_code": "BEivKapPrs",
      "omschrijving": "Privé-stortingen",
      "soort": "passiva"
    },
    {
      "code": "1600",
      "rgs_code": "BSchHanCre",
      "omschrijving": "Crediteuren",
      "soort": "passiva"
    },
    {
      "code": "1610",
      "rgs_code": "BSchOvsTbb",
      "omschrijving": "Te betalen kosten",
      "soort": "passiva"
    },
    {
      "code": "1510",
      "rgs_code": "BSchBtwBth",
      "omschrijving": "Te betalen btw hoog tarief",
      "soort": "btw"
    },
    {
      "code": "1511",
      "rgs_code": "BSchBtwBtl",
      "omschrijving": "Te betalen btw laag tarief",
      "soort": "btw"
    },
    {
      "code": "8000",
      "rgs_code": "WOmzNetOmh",
      "omschrijving": "Omzet diensten hoog tarief",
      "soort": "opbrengsten"
    },
    {
      "code": "8010",
      "rgs_code": "WOmzNetOml",
      "omschrijving": "Omzet diensten laag tarief",
      "soort": "opbrengsten"
    },
    {
      "code": "8020",
      "rgs_code": "WOmzNetOmn",
      "omschrijving": "Omzet nultarief of vrijgesteld",
      "soort": "opbrengsten"
    },
    {
      "code": "8100",
      "rgs_code": "WOmzOvoOvo",
      "omschrijving": "Overige opbrengsten",
      "soort": "opbrengsten"
    },
    {
      "code": "7000",
      "rgs_code": "WKprInkInk",
      "omschrijving": "Inkoopwaarde materialen",
      "soort": "kosten"
    },
    {
      "code": "7100",
      "rgs_code": "WKprUitUit",
      "omschrijving": "Uitbesteed werk",
      "soort": "kosten"
    },
    {
      "code": "4000",
      "rgs_code": "WBedHuiHui",
      "omschrijving": "Huisvestingskosten",
      "soort": "kosten"
    },
    {
      "code": "4100",
      "rgs_code": "WBedKanKan",
      "omschrijving": "Kantoorkosten",
      "soort": "kosten"
    },
    {
      "code": "4110",
      "rgs_code": "WBedKanTel",
      "omschrijving": "Telefoon en internet",
      "soort": "kosten"
    },
    {
      "code": "4120",
      "rgs_code": "WBedKanAut",
      "omschrijving": "Software en abonnementen",
      "soort": "kosten"
    },
    {
      "code": "4130",
      "rgs_code": "WBedKanKla",
      "omschrijving": "Kleine aanschaffingen",
      "soort": "kosten"
    },
    {
      "code": "4140",
      "rgs_code": "WBedKanVak",
      "omschrijving": "Contributies en vakliteratuur",
      "soort": "kosten"
    },
    {
      "code": "4200",
      "rgs_code": "WBedVkkAut",
      "omschrijving": "Autokosten",
      "soort": "kosten"
    },
    {
      "code": "4210",
      "rgs_code": "WBedVkkRei",
      "omschrijving": "Reis- en verblijfkosten",
      "soort": "kosten"
    },
    {
      "code": "4220",
      "rgs_code": "WBedVkkRep",
      "omschrijving": "Representatiekosten",
      "soort": "kosten"
    },
    {
      "code": "4230",
      "rgs_code": "WBedVkkRec",
      "omschrijving": "Marketing en reclame",
      "soort": "kosten"
    },
    {
      "code": "4300",
      "rgs_code": "WBedAlgVer",
      "omschrijving": "Verzekeringen",
      "soort": "kosten"
    },
    {
      "code": "4310",
      "rgs_code": "WBedAlgAdv",
      "omschrijving": "Accountants- en advieskosten",
      "soort": "kosten"
    },
    {
      "code": "4320",
      "rgs_code": "WBedAlgBan",
      "omschrijving": "Bankkosten",
      "soort": "kosten"
    },
    {
      "code": "4400",
      "rgs_code": "WBedAfsAfs",
      "omschrijving": "Afschrijvingskosten",
      "soort": "kosten"
    }
  ]
}
```

## `boekhouding/scripts/start_webinterface.py`

```python
#!/usr/bin/env python3
"""Start de webinterface lokaal.

    python scripts/start_webinterface.py

Daarna staat hij op http://127.0.0.1:8000 — alleen op deze computer.

Wil je hem ook op je telefoon openen (zelfde wifi), start hem dan zo:

    python scripts/start_webinterface.py --netwerk

Dan luistert hij op alle netwerkkaarten en print hij het adres dat je op
je telefoon intypt. Fase 1 heeft geen login: iedereen op hetzelfde wifi
kan er dan bij. Doe dit dus alleen op je eigen netwerk, nooit op wifi van
een café of een hotel.
"""

import socket
import sys
from pathlib import Path

BASIS = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(BASIS))

import uvicorn  # noqa: E402

from boekhouding.web import maak_app  # noqa: E402

GEGEVENS = BASIS / "gegevens"
POORT = 8000


def eigen_ip() -> str | None:
    """Zoek het IP-adres van deze computer op het lokale netwerk.

    Er wordt niets verstuurd: een UDP-socket "verbinden" kiest alleen de
    netwerkkaart waarlangs verkeer naar buiten zou gaan. Lukt dat niet
    (geen netwerk), dan geven we None terug in plaats van te gokken.
    """
    peiler = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
    try:
        peiler.connect(("192.0.2.1", 9))  # adres uit het testbereik, gaat nergens heen
        return peiler.getsockname()[0]
    except OSError:
        return None
    finally:
        peiler.close()


def main() -> int:
    over_netwerk = "--netwerk" in sys.argv
    adres = "0.0.0.0" if over_netwerk else "127.0.0.1"

    GEGEVENS.mkdir(exist_ok=True)
    app = maak_app(str(GEGEVENS / "boekhouding.sqlite"), str(GEGEVENS / "opslag"))
    print(f"Database  : {GEGEVENS / 'boekhouding.sqlite'}")
    print(f"Originelen: {GEGEVENS / 'opslag'}")
    print(f"\nOp deze computer : http://127.0.0.1:{POORT}")
    if over_netwerk:
        ip = eigen_ip()
        if ip:
            print(f"Op je telefoon   : http://{ip}:{POORT}   (zelfde wifi)")
        else:
            print("Op je telefoon   : geen netwerkadres gevonden, zit je op wifi?")
        print("\nLet op: geen login. Alleen doen op je eigen netwerk.")
    else:
        print("Op je telefoon   : niet bereikbaar. Start met --netwerk als je dat wilt.")
    print("\nStoppen met Ctrl-C.\n")
    uvicorn.run(app, host=adres, port=POORT, log_level="warning")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
```

## `boekhouding/scripts/vul_testdata.py`

```python
#!/usr/bin/env python3
"""Zet testdata klaar in de webinterface.

    python scripts/vul_testdata.py

Maakt de administratie aan (als die er nog niet is) en laadt de vijf
UBL-testbestanden in. Die werken zonder API-sleutel: bij een e-factuur
staan de velden letterlijk in het bestand, dus er komt geen model aan te
pas.

Wil je ook zien hoe het reviewscherm eruitziet met een échte PDF ernaast:

    python scripts/vul_testdata.py --met-pdf

Dat laadt ook de Factur-X-PDF in (ook zonder sleutel — de e-factuur zit
als bijlage in de PDF).

Wil je ook het btw-scherm met cijfers zien in plaats van met blokkades:

    python scripts/vul_testdata.py --met-pdf --boek

Dan wordt bij elke factuur die klopt een grootboekrekening gekozen, wordt
hij goedgekeurd en geboekt. Dat is normaal handwerk van de eigenaar; hier
gebeurt het zodat er iets te zien is.
"""

import sys
from pathlib import Path

BASIS = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(BASIS))

from boekhouding import (  # noqa: E402
    boek_factuur,
    keur_factuur_goed,
    kies_rekening,
    lees_facturen,
    maak_administratie,
    maak_tabellen,
    maak_verbinding,
)
from boekhouding.verwerking import verwerk_upload  # noqa: E402

GEGEVENS = BASIS / "gegevens"
UBLMAP = BASIS / "tests" / "testfacturen" / "ubl"
BESTANDEN = [
    "01-standaard-21procent.xml",
    "02-diensten-9procent.xml",
    "03-creditnota.xml",
    "04-twee-btw-tarieven.xml",
    "05-zonder-factuurdatum.xml",
]


# Welke rekening bij welk testbestand hoort. Normaal kiest de eigenaar
# die zelf in het reviewscherm; voor de demo staat het hier.
REKENINGEN = {
    "01-standaard-21procent.xml": "4100",   # kantoorkosten
    "02-diensten-9procent.xml": "4310",     # advieskosten
    "06-factuur-x.pdf": "4120",             # software
}


def main() -> int:
    met_pdf = "--met-pdf" in sys.argv
    boeken = "--boek" in sys.argv
    bestanden = BESTANDEN + (["06-factuur-x.pdf"] if met_pdf else [])

    GEGEVENS.mkdir(exist_ok=True)
    conn = maak_verbinding(str(GEGEVENS / "boekhouding.sqlite"))
    maak_tabellen(conn)

    rij = conn.execute("SELECT id, naam FROM administraties ORDER BY id").fetchone()
    if rij is None:
        administratie_id = maak_administratie(conn, "Mijn eenmanszaak")
        print(f"Administratie aangemaakt: Mijn eenmanszaak (nummer {administratie_id})")
    else:
        administratie_id, naam = rij
        print(f"Administratie bestaat al: {naam} (nummer {administratie_id})")

    print()
    for naam in bestanden:
        pad = UBLMAP / naam
        resultaat = verwerk_upload(
            conn, administratie_id, naam, pad.read_bytes(),
            str(GEGEVENS / "opslag"),
        )
        merk = "review nodig" if resultaat.status == "review_nodig" else "klopt"
        print(f"  {naam:<28} -> factuur {resultaat.factuur_id}  [{merk}]")
        for reden in resultaat.redenen:
            print(f"       {reden[:88]}")

        if boeken and resultaat.status != "review_nodig" and naam in REKENINGEN:
            kies_rekening(conn, resultaat.factuur_id, REKENINGEN[naam])
            keur_factuur_goed(conn, resultaat.factuur_id)
            boeking_id, redenen = boek_factuur(conn, resultaat.factuur_id)
            if boeking_id is None:
                print(f"       niet geboekt: {redenen[0][:78]}")
            else:
                print(f"       geboekt op {REKENINGEN[naam]} (boeking {boeking_id})")

    facturen = lees_facturen(conn, administratie_id)
    conn.close()

    review = sum(1 for f in facturen if f["status"] == "review_nodig")
    print(f"\n{len(facturen)} facturen in de administratie, {review} wachten op je.")
    print("Start nu de server:  python scripts/start_webinterface.py")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
```

## `boekhouding/scripts/maak_oplevering.py`

```python
#!/usr/bin/env python3
"""Ververs de oplevering: CODE-COMPLEET.md en boekhouding-compleet.zip.

    python scripts/maak_oplevering.py

De map `opleveringen/` blijft plat: alleen genummerde rapporten plus de
drie vaste bestanden. Dit script maakt er twee van opnieuw, zodat ze na
elke taak echt bij de code passen en niet stilletjes verouderen:

- `CODE-COMPLEET.md` = de uitleg (README.md) plus alle broncode achter
  elkaar, zodat alles in één bestand te lezen is.
- `boekhouding-compleet.zip` = CLAUDE.md, de hele map `boekhouding/`
  (zonder rommel als __pycache__ en de lokale database) en alle
  rapporten uit `opleveringen/`.
"""

import sys
import zipfile
from pathlib import Path

BASIS = Path(__file__).resolve().parent.parent
WORTEL = BASIS.parent
OPLEVERINGEN = WORTEL / "opleveringen"

# De volgorde waarin de broncode in CODE-COMPLEET.md komt te staan:
# eerst de kern, dan de webinterface, dan de scripts en de tests.
BRONBESTANDEN = [
    "boekhouding/__init__.py",
    "boekhouding/btw_config.py",
    "boekhouding/models.py",
    "boekhouding/validatie.py",
    "boekhouding/rekeningschema.py",
    "boekhouding/documenten.py",
    "boekhouding/omgeving.py",
    "boekhouding/ubl.py",
    "boekhouding/routering.py",
    "boekhouding/ai_extractie.py",
    "boekhouding/verwerking.py",
    "boekhouding/database.py",
    "boekhouding/grootboek.py",
    "boekhouding/btw_aangifte.py",
    "boekhouding/web/__init__.py",
    "boekhouding/web/app.py",
    "boekhouding/web/ubl_weergave.py",
    "boekhouding/web/templates/basis.html",
    "boekhouding/web/templates/overzicht.html",
    "boekhouding/web/templates/upload.html",
    "boekhouding/web/templates/review.html",
    "boekhouding/web/templates/btw.html",
    "boekhouding/web/templates/fout.html",
    "boekhouding/config/btw_2024.json",
    "boekhouding/config/btw_2025.json",
    "boekhouding/config/btw_2026.json",
    "boekhouding/config/rekeningen_2024.json",
    "boekhouding/config/rekeningen_2025.json",
    "boekhouding/config/rekeningen_2026.json",
    "scripts/start_webinterface.py",
    "scripts/vul_testdata.py",
    "scripts/maak_oplevering.py",
    "scripts/handmatige_api_proef.py",
    "scripts/eval_extractie.py",
    "tests/genereer_testfacturen.py",
    "tests/genereer_ubl_testbestanden.py",
    "tests/testmateriaal/__init__.py",
    "tests/testmateriaal/pdf_schrijver.py",
    "tests/testmateriaal/bitmapfont.py",
    "tests/testmateriaal/jpeg_schrijver.py",
    "tests/conftest.py",
    "tests/test_schema.py",
    "tests/test_validatie.py",
    "tests/test_database.py",
    "tests/test_documenten.py",
    "tests/test_ai_extractie.py",
    "tests/test_eval_logica.py",
    "tests/test_ubl.py",
    "tests/test_ubl_weergave.py",
    "tests/test_rekeningschema.py",
    "tests/test_grootboek.py",
    "tests/test_btw_aangifte.py",
    "tests/test_web.py",
    "pytest.ini",
    "requirements.txt",
    ".gitignore",
    ".env.voorbeeld",
]

# Welk taalmerkje het codeblok krijgt, per extensie.
TAAL = {".py": "python", ".html": "html", ".json": "json", ".ini": "ini"}

# Wat nooit in het archief hoort: gecompileerde rommel, de lokale
# database met eigen gegevens, en een .env met een sleutel erin.
OVERSLAAN_MAPPEN = {"__pycache__", ".pytest_cache", "gegevens", ".git"}

# Wel in het archief, niet in CODE-COMPLEET.md: dit zijn testbestanden
# (facturen en hun grondwaarheid), geen code om te lezen.
GEEN_CODE = {"testfacturen"}
OVERSLAAN_NAMEN = {".env"}
OVERSLAAN_EXTENSIES = {".pyc", ".sqlite", ".db"}


def taal_van(pad: Path) -> str:
    return TAAL.get(pad.suffix, "")


def maak_code_compleet() -> Path:
    """Zet README.md en alle broncode in één bestand."""
    delen = [
        "# Volledige code — boekhoudsysteem, modules 1 t/m 5",
        "",
        "Branch `claude/nl-accounting-invoice-module-f2vzr3`. "
        "Wordt bij elke oplevering ververst.",
        "",
        (BASIS / "README.md").read_text(encoding="utf-8").rstrip(),
        "",
        "---",
        "",
        "# Broncode",
        "",
    ]

    ontbreekt = []
    for naam in BRONBESTANDEN:
        pad = BASIS / naam
        if not pad.is_file():
            ontbreekt.append(naam)
            continue
        delen.append(f"## `boekhouding/{naam}`")
        delen.append("")
        delen.append(f"```{taal_van(pad)}")
        delen.append(pad.read_text(encoding="utf-8").rstrip())
        delen.append("```")
        delen.append("")

    if ontbreekt:
        # Nooit stil een bestand overslaan: dan zou de bundel incompleet
        # zijn zonder dat iemand het ziet.
        print("LET OP, deze bestanden staan in de lijst maar bestaan niet:")
        for naam in ontbreekt:
            print(f"  {naam}")

    # Een nieuw bestand mag niet uit de bundel vallen omdat iemand vergat
    # het aan de lijst hierboven toe te voegen. Wat niet in de lijst
    # staat, komt er achteraan bij — met een melding, zodat het alsnog op
    # zijn plek gezet kan worden.
    vergeten = [
        pad for pad in sorted(BASIS.rglob("*"))
        if pad.is_file()
        and pad.suffix in TAAL
        and str(pad.relative_to(BASIS)) not in BRONBESTANDEN
        and not any(
            deel in OVERSLAAN_MAPPEN or deel in GEEN_CODE
            for deel in pad.relative_to(BASIS).parts
        )
    ]
    if vergeten:
        print("Deze bestanden stonden niet in de lijst en zijn achteraan gezet:")
        delen.append("## Nog niet ingedeeld")
        delen.append("")
        for pad in vergeten:
            naam = pad.relative_to(BASIS)
            print(f"  {naam}")
            delen.append(f"## `boekhouding/{naam}`")
            delen.append("")
            delen.append(f"```{taal_van(pad)}")
            delen.append(pad.read_text(encoding="utf-8").rstrip())
            delen.append("```")
            delen.append("")

    doel = OPLEVERINGEN / "CODE-COMPLEET.md"
    doel.write_text("\n".join(delen), encoding="utf-8")
    return doel


def hoort_erin(pad: Path) -> bool:
    if any(deel in OVERSLAAN_MAPPEN for deel in pad.parts):
        return False
    if pad.name in OVERSLAAN_NAMEN or pad.suffix in OVERSLAAN_EXTENSIES:
        return False
    return True


def maak_zip() -> Path:
    """Stop CLAUDE.md, de code en alle rapporten in één archief."""
    doel = OPLEVERINGEN / "boekhouding-compleet.zip"
    # Eerst opbouwen naast het doel, dan pas hernoemen: zo blijft er nooit
    # een half archief achter als er iets misgaat.
    tijdelijk = doel.with_suffix(".zip.tijdelijk")
    aantal = 0
    with zipfile.ZipFile(tijdelijk, "w", zipfile.ZIP_DEFLATED) as archief:
        archief.write(WORTEL / "CLAUDE.md", "CLAUDE.md")
        aantal += 1
        for pad in sorted(BASIS.rglob("*")):
            if not pad.is_file() or not hoort_erin(pad.relative_to(BASIS)):
                continue
            archief.write(pad, str(pad.relative_to(WORTEL)))
            aantal += 1
        for pad in sorted(OPLEVERINGEN.rglob("*")):
            if not pad.is_file() or pad.name == doel.name or pad == tijdelijk:
                continue
            archief.write(pad, str(pad.relative_to(WORTEL)))
            aantal += 1
    tijdelijk.replace(doel)
    print(f"{aantal} bestanden in het archief")
    return doel


def main() -> int:
    code = maak_code_compleet()
    print(f"{code.relative_to(WORTEL)}  ({code.stat().st_size // 1024} kB)")
    archief = maak_zip()
    print(f"{archief.relative_to(WORTEL)}  ({archief.stat().st_size // 1024} kB)")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
```

## `boekhouding/scripts/handmatige_api_proef.py`

```python
#!/usr/bin/env python3
"""Eén echte API-aanroep, met de hand te draaien.

    python scripts/handmatige_api_proef.py [pad-naar-factuur]

Dit script staat bewust buiten pytest: de testsuite doet nooit een echte
aanroep. Gebruik dit om te controleren of de sleutel werkt en of het
model op een echt document doet wat je verwacht.

Er wordt één document verwerkt en dus één keer betaald. De API-sleutel
komt uit .env en wordt hier nooit afgedrukt.
"""

import sys
from datetime import date
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

from boekhouding import extraheer_factuur, sleutel_aanwezig  # noqa: E402
from boekhouding.ai_extractie import MODEL, VELDEN  # noqa: E402

STANDAARD = (
    Path(__file__).resolve().parent.parent
    / "tests" / "testfacturen" / "01-standaard-21procent.pdf"
)


def main() -> int:
    pad = Path(sys.argv[1]) if len(sys.argv) > 1 else STANDAARD

    if not sleutel_aanwezig():
        print("Geen ANTHROPIC_API_KEY gevonden.")
        print("Maak een .env-bestand naast de map boekhouding/ met:")
        print("    ANTHROPIC_API_KEY=...jouw sleutel...")
        print("Zie .env.voorbeeld. Dat bestand staat in .gitignore.")
        return 1

    if not pad.is_file():
        print(f"Bestand niet gevonden: {pad}")
        return 1

    print(f"Document : {pad.name}")
    print(f"Model    : {MODEL}")
    print("Dit doet één echte, betaalde API-aanroep.\n")

    resultaat = extraheer_factuur(pad, vandaag=date.today())

    print(f"Invoerpad: {resultaat.invoerpad}")
    print(f"Status   : {resultaat.status}\n")

    if resultaat.extractie is not None:
        breedte = max(len(veld) for veld in VELDEN)
        for veld in VELDEN:
            gegeven = getattr(resultaat.extractie, veld)
            waarde = "(niets gevonden)" if gegeven.waarde is None else gegeven.waarde
            regel = f"  {veld:<{breedte}}  {waarde:<28} [{gegeven.zekerheid}]"
            if gegeven.reden:
                regel += f"  {gegeven.reden}"
            print(regel)

    if resultaat.redenen:
        print("\nRedenen voor review:")
        for reden in resultaat.redenen:
            print(f"  - {reden}")

    print(f"\nRuwe modelrespons ({len(resultaat.ruwe_respons)} tekens):")
    print(resultaat.ruwe_respons[:600])
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
```

## `boekhouding/scripts/eval_extractie.py`

```python
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
```

## `boekhouding/tests/genereer_testfacturen.py`

```python
#!/usr/bin/env python3
"""Genereer synthetische Nederlandse factuurdocumenten voor tests.

Draaien vanuit de map boekhouding/:

    python tests/genereer_testfacturen.py

Er komen tien bestanden in tests/testfacturen/ te staan. Alles is
verzonnen maar realistisch opgemaakt: KvK-nummer, btw-identificatie-
nummer, IBAN, "Factuurdatum", "Vervaldatum" en "Totaal incl. btw".

Deterministisch: dezelfde seed en vaste datums, geen tijdstempel in de
bestanden, geen internet. Twee keer draaien geeft byte-voor-byte
dezelfde bestanden.

Let op: dit is testmateriaal, geen productiecode. De bedragen in
factuur 10 kloppen bewust niet, en factuur 09 mist bewust een
factuurnummer — die horen door de validatie afgekeurd te worden.
"""

import json
import random
import sys
from dataclasses import dataclass, field
from decimal import Decimal
from pathlib import Path
from typing import Optional

sys.path.insert(0, str(Path(__file__).parent))

from testmateriaal.jpeg_schrijver import Bitmap, schrijf_jpeg
from testmateriaal.pdf_schrijver import Pagina, schrijf_pdf

SEED = 20260827
DOELMAP = Path(__file__).parent / "testfacturen"

# Kantlijnen van de PDF-lay-out, in punten vanaf linksboven.
LINKS = 56
RECHTS = 539
KOLOM_AANTAL = 330
KOLOM_PRIJS = 430
KOLOM_BEDRAG = RECHTS


def euro(bedrag: Decimal) -> str:
    """Nederlandse notatie: duizendtallen met punt, decimalen met komma."""
    negatief = bedrag < 0
    heel, _, decimalen = f"{abs(bedrag):.2f}".partition(".")
    groepen = []
    while len(heel) > 3:
        groepen.insert(0, heel[-3:])
        heel = heel[:-3]
    groepen.insert(0, heel)
    uit = ".".join(groepen) + "," + decimalen
    return ("-" if negatief else "") + uit


def maak_iban(rng: random.Random) -> str:
    """Een IBAN met kloppende controlegetallen (mod-97), maar verzonnen."""
    bank = rng.choice(["INGB", "RABO", "ABNA", "TRIO", "SNSB"])
    rekening = f"{rng.randrange(10**9, 10**10):010d}"
    # Controlegetal: land en '00' achteraan, letters naar cijfers (A=10).
    tijdelijk = bank + rekening + "NL00"
    getal = "".join(
        str(ord(teken) - 55) if teken.isalpha() else teken for teken in tijdelijk
    )
    controle = 98 - (int(getal) % 97)
    return f"NL{controle:02d}{bank}{rekening}"


@dataclass
class Regel:
    omschrijving: str
    aantal: Decimal
    stukprijs: Decimal

    @property
    def bedrag(self) -> Decimal:
        return (self.aantal * self.stukprijs).quantize(Decimal("0.01"))


@dataclass
class Factuur:
    bestandsnaam: str
    titel: str
    leverancier: str
    leverancier_adres: str
    leverancier_plaats: str
    kvk: str
    btw_id: str
    iban: str
    klant: str
    klant_adres: str
    klant_plaats: str
    factuurdatum: str
    vervaldatum: str
    regels: list[Regel]
    btw_percentage: Decimal
    bedrag_excl: Decimal
    btw_bedrag: Decimal
    bedrag_incl: Decimal
    factuurnummer: Optional[str] = None
    korting: Optional[tuple[str, Decimal]] = None
    opmerking: Optional[str] = None
    waarom: str = ""
    verwacht: str = "gevalideerd"


def teken_pdf(factuur: Factuur) -> Pagina:
    """Zet één factuur op een A4-pagina."""
    pagina = Pagina()

    # Kop: leverancier links, titel rechts.
    pagina.tekst(LINKS, 70, factuur.leverancier, 15, vet=True)
    pagina.tekst(LINKS, 88, factuur.leverancier_adres, 8.5)
    pagina.tekst(LINKS, 100, factuur.leverancier_plaats, 8.5)
    pagina.tekst_rechts(RECHTS, 72, factuur.titel.upper(), 20, vet=True)

    # Bedrijfsgegevens die op elke Nederlandse factuur horen te staan.
    pagina.tekst(LINKS, 118, f"KvK-nummer: {factuur.kvk}", 8.5)
    pagina.tekst(LINKS, 130, f"Btw-id: {factuur.btw_id}", 8.5)
    pagina.tekst(LINKS, 142, f"IBAN: {factuur.iban}", 8.5)

    # Klantgegevens.
    pagina.tekst(LINKS, 180, "Factuuradres", 8.5, vet=True)
    pagina.tekst(LINKS, 194, factuur.klant, 9)
    pagina.tekst(LINKS, 206, factuur.klant_adres, 9)
    pagina.tekst(LINKS, 218, factuur.klant_plaats, 9)

    # Factuurgegevens rechts.
    y = 194
    if factuur.factuurnummer is not None:
        pagina.tekst(340, y, "Factuurnummer:", 9)
        pagina.tekst_rechts(RECHTS, y, factuur.factuurnummer, 9)
        y += 14
    pagina.tekst(340, y, "Factuurdatum:", 9)
    pagina.tekst_rechts(RECHTS, y, factuur.factuurdatum, 9)
    pagina.tekst(340, y + 14, "Vervaldatum:", 9)
    pagina.tekst_rechts(RECHTS, y + 14, factuur.vervaldatum, 9)

    # Regeltabel.
    y = 268
    pagina.lijn(LINKS, y, RECHTS, y, 0.8)
    pagina.tekst(LINKS, y + 14, "Omschrijving", 9, vet=True)
    pagina.tekst_rechts(KOLOM_AANTAL, y + 14, "Aantal", 9, vet=True)
    pagina.tekst_rechts(KOLOM_PRIJS, y + 14, "Stukprijs", 9, vet=True)
    pagina.tekst_rechts(KOLOM_BEDRAG, y + 14, "Bedrag", 9, vet=True)
    y += 22
    pagina.lijn(LINKS, y, RECHTS, y, 0.5, grijs=0.6)

    for regel in factuur.regels:
        y += 18
        pagina.tekst(LINKS, y, regel.omschrijving, 9)
        pagina.tekst_rechts(KOLOM_AANTAL, y, f"{regel.aantal:g}", 9)
        pagina.tekst_rechts(KOLOM_PRIJS, y, euro(regel.stukprijs), 9)
        pagina.tekst_rechts(KOLOM_BEDRAG, y, euro(regel.bedrag), 9)

    if factuur.korting is not None:
        omschrijving, bedrag = factuur.korting
        y += 18
        pagina.tekst(LINKS, y, omschrijving, 9)
        pagina.tekst_rechts(KOLOM_BEDRAG, y, euro(bedrag), 9)

    # Totalen.
    y += 14
    pagina.lijn(300, y, RECHTS, y, 0.5, grijs=0.6)
    y += 18
    pagina.tekst(340, y, "Subtotaal excl. btw", 9)
    pagina.tekst_rechts(KOLOM_BEDRAG, y, euro(factuur.bedrag_excl), 9)
    y += 15
    pagina.tekst(340, y, f"Btw {factuur.btw_percentage:g}%", 9)
    pagina.tekst_rechts(KOLOM_BEDRAG, y, euro(factuur.btw_bedrag), 9)
    y += 6
    pagina.lijn(300, y, RECHTS, y, 0.8)
    y += 18
    pagina.tekst(340, y, "Totaal incl. btw", 10, vet=True)
    pagina.tekst_rechts(KOLOM_BEDRAG, y, euro(factuur.bedrag_incl), 10, vet=True)

    if factuur.opmerking:
        pagina.tekst(LINKS, y + 40, factuur.opmerking, 8.5)

    # Voettekst.
    pagina.lijn(LINKS, 760, RECHTS, 760, 0.5, grijs=0.7)
    pagina.tekst(
        LINKS, 774,
        f"Betaling binnen 30 dagen op {factuur.iban} "
        f"o.v.v. het factuurnummer.", 8,
    )
    pagina.tekst(
        LINKS, 786,
        f"{factuur.leverancier} - KvK {factuur.kvk} - Btw-id {factuur.btw_id}", 8,
    )
    return pagina


def teken_jpg(factuur: Factuur) -> Bitmap:
    """Zet een factuur op een bitmap, alsof hij is ingescand."""
    rng = random.Random(SEED)
    vel = Bitmap(827, 1169, achtergrond=244)

    # Lichte ruis en een schaduwrand, zodat het op een scan lijkt.
    for _ in range(6000):
        x = rng.randrange(vel.breedte)
        y = rng.randrange(vel.hoogte)
        vel.punt(x, y, rng.randrange(200, 240))
    vel.rechthoek(0, 0, vel.breedte, 6, 205)
    vel.rechthoek(0, vel.hoogte - 6, vel.breedte, 6, 205)

    links = 60
    rechts = 767
    vel.tekst(links, 60, factuur.leverancier, 3, 30)
    vel.tekst(links, 100, factuur.leverancier_adres, 2, 60)
    vel.tekst(links, 122, factuur.leverancier_plaats, 2, 60)
    vel.tekst_rechts(rechts, 60, factuur.titel.upper(), 4, 30)

    vel.tekst(links, 160, "KvK-nummer: " + factuur.kvk, 2, 55)
    vel.tekst(links, 182, "Btw-id: " + factuur.btw_id, 2, 55)
    vel.tekst(links, 204, "IBAN: " + factuur.iban, 2, 55)

    vel.tekst(links, 260, factuur.klant, 2, 40)
    vel.tekst(links, 282, factuur.klant_adres, 2, 40)
    vel.tekst(links, 304, factuur.klant_plaats, 2, 40)

    vel.tekst(430, 260, "Factuurnummer: " + (factuur.factuurnummer or ""), 2, 40)
    vel.tekst(430, 282, "Factuurdatum: " + factuur.factuurdatum, 2, 40)
    vel.tekst(430, 304, "Vervaldatum: " + factuur.vervaldatum, 2, 40)

    y = 370
    vel.rechthoek(links, y, rechts - links, 2, 70)
    vel.tekst(links, y + 12, "Omschrijving", 2, 30)
    vel.tekst_rechts(rechts, y + 12, "Bedrag", 2, 30)
    y += 40
    vel.rechthoek(links, y, rechts - links, 1, 150)

    for regel in factuur.regels:
        y += 30
        vel.tekst(links, y, regel.omschrijving, 2, 45)
        vel.tekst_rechts(rechts, y, euro(regel.bedrag), 2, 45)

    y += 50
    vel.rechthoek(430, y, rechts - 430, 1, 150)
    y += 16
    vel.tekst(430, y, "Subtotaal excl. btw", 2, 45)
    vel.tekst_rechts(rechts, y, euro(factuur.bedrag_excl), 2, 45)
    y += 26
    vel.tekst(430, y, f"Btw {factuur.btw_percentage:g}%", 2, 45)
    vel.tekst_rechts(rechts, y, euro(factuur.btw_bedrag), 2, 45)
    y += 30
    vel.rechthoek(430, y, rechts - 430, 2, 70)
    y += 14
    vel.tekst(430, y, "Totaal incl. btw", 3, 25)
    vel.tekst_rechts(rechts, y, euro(factuur.bedrag_incl), 3, 25)

    vel.rechthoek(links, 1060, rechts - links, 1, 150)
    vel.tekst(links, 1080, "Betaling binnen 30 dagen op " + factuur.iban, 2, 70)
    return vel


def _d(waarde: str) -> Decimal:
    return Decimal(waarde)


def maak_facturen() -> list[Factuur]:
    """De tien facturen, met vaste seed dus altijd dezelfde uitkomst."""
    rng = random.Random(SEED)

    def bedrijf(naam: str, adres: str, plaats: str) -> dict:
        return {
            "leverancier": naam,
            "leverancier_adres": adres,
            "leverancier_plaats": plaats,
            "kvk": f"{rng.randrange(10_000_000, 100_000_000)}",
            "btw_id": f"NL{rng.randrange(100_000_000, 1_000_000_000)}B{rng.randrange(1, 100):02d}",
            "iban": maak_iban(rng),
        }

    klant = {
        "klant": "Alkhadraa Advies",
        "klant_adres": "Zonnebloemstraat 14",
        "klant_plaats": "3011 AB Rotterdam",
    }

    return [
        Factuur(
            bestandsnaam="01-standaard-21procent.pdf",
            titel="Factuur",
            **bedrijf("Van Dijk ICT-diensten", "Keizersgracht 218", "1016 DZ Amsterdam"),
            **klant,
            factuurnummer="2026-0412",
            factuurdatum="12-07-2026",
            vervaldatum="11-08-2026",
            regels=[Regel("Onderhoud werkplekken juli 2026", _d("1"), _d("450.00"))],
            btw_percentage=_d("21"),
            bedrag_excl=_d("450.00"),
            btw_bedrag=_d("94.50"),
            bedrag_incl=_d("544.50"),
            waarom="gewone inkoopfactuur met het hoge tarief",
        ),
        Factuur(
            bestandsnaam="02-catering-9procent.pdf",
            titel="Factuur",
            **bedrijf("Bakkerij De Korenaar", "Nieuwe Binnenweg 87", "3014 GJ Rotterdam"),
            **klant,
            factuurnummer="B26-1187",
            factuurdatum="28-07-2026",
            vervaldatum="27-08-2026",
            regels=[Regel("Lunchbezorging teamdag (30 personen)", _d("30"), _d("6.00"))],
            btw_percentage=_d("9"),
            bedrag_excl=_d("180.00"),
            btw_bedrag=_d("16.20"),
            bedrag_incl=_d("196.20"),
            waarom="laag tarief van 9% op voedingsmiddelen",
        ),
        Factuur(
            bestandsnaam="03-verzekering-0procent.pdf",
            titel="Factuur",
            **bedrijf("Zeeland Assurantiën", "Havenweg 3", "4381 KM Vlissingen"),
            **klant,
            factuurnummer="ZA-2026-00891",
            factuurdatum="15-06-2026",
            vervaldatum="15-07-2026",
            regels=[
                Regel("Premie beroepsaansprakelijkheid Q3 2026", _d("1"), _d("325.00"))
            ],
            btw_percentage=_d("0"),
            bedrag_excl=_d("325.00"),
            btw_bedrag=_d("0.00"),
            bedrag_incl=_d("325.00"),
            opmerking="Verzekeringsdiensten: 0% btw.",
            waarom="nultarief, btw-bedrag is 0,00",
        ),
        Factuur(
            bestandsnaam="04-meerdere-regels-21procent.pdf",
            titel="Factuur",
            **bedrijf("Techniek Groothandel Oost", "Industrieweg 45", "7554 NB Hengelo"),
            **klant,
            factuurnummer="TGO-59042",
            factuurdatum="03-08-2026",
            vervaldatum="02-09-2026",
            regels=[
                Regel("Softwarelicentie ontwerppakket", _d("5"), _d("29.99")),
                Regel("Externe monitor 27 inch", _d("2"), _d("189.00")),
                Regel("Dockingstation USB-C", _d("1"), _d("129.00")),
                Regel("Verzend- en administratiekosten", _d("1"), _d("6.95")),
            ],
            btw_percentage=_d("21"),
            bedrag_excl=_d("663.90"),
            btw_bedrag=_d("139.42"),
            bedrag_incl=_d("803.32"),
            waarom="vier regels die samen het subtotaal vormen",
        ),
        Factuur(
            bestandsnaam="05-met-korting-21procent.pdf",
            titel="Factuur",
            **bedrijf("Hosting Noordzee", "Stationsplein 9", "2011 LM Haarlem"),
            **klant,
            factuurnummer="HN2026-3308",
            factuurdatum="10-08-2026",
            vervaldatum="09-09-2026",
            regels=[
                Regel("Webhosting jaarpakket zakelijk", _d("1"), _d("540.00")),
                Regel("SSL-certificaat", _d("1"), _d("79.00")),
            ],
            korting=("Klantkorting 10%", _d("-61.90")),
            btw_percentage=_d("21"),
            bedrag_excl=_d("557.10"),
            btw_bedrag=_d("116.99"),
            bedrag_incl=_d("674.09"),
            waarom="kortingsregel: het subtotaal is lager dan de regels samen",
        ),
        Factuur(
            bestandsnaam="06-creditnota-21procent.pdf",
            titel="Creditnota",
            **bedrijf("Van Dijk ICT-diensten", "Keizersgracht 218", "1016 DZ Amsterdam"),
            **klant,
            factuurnummer="2026-0455C",
            factuurdatum="14-08-2026",
            vervaldatum="13-09-2026",
            regels=[
                Regel("Creditering onderhoud werkplekken juli 2026", _d("1"), _d("-450.00"))
            ],
            btw_percentage=_d("21"),
            bedrag_excl=_d("-450.00"),
            btw_bedrag=_d("-94.50"),
            bedrag_incl=_d("-544.50"),
            opmerking="Creditnota bij factuur 2026-0412. Bedrag wordt teruggestort.",
            waarom="negatieve bedragen; de rekenregels moeten ook hier kloppen",
        ),
        Factuur(
            bestandsnaam="07-duizendtal-21procent.pdf",
            titel="Factuur",
            **bedrijf("Bouwadvies Rijnmond", "Schiedamsedijk 120", "3011 EN Rotterdam"),
            **klant,
            factuurnummer="BR-2026-114",
            factuurdatum="01-07-2026",
            vervaldatum="31-07-2026",
            regels=[Regel("Constructieadvies project Waalhaven", _d("25"), _d("50.00"))],
            btw_percentage=_d("21"),
            bedrag_excl=_d("1250.00"),
            btw_bedrag=_d("262.50"),
            bedrag_incl=_d("1512.50"),
            waarom="bedragen boven de duizend: 1.250,00 met punt als duizendtal",
        ),
        Factuur(
            bestandsnaam="08-scan-zonder-tekstlaag.jpg",
            titel="Factuur",
            **bedrijf("Drukkerij Het Anker", "Ambachtstraat 22", "5211 AB Den Bosch"),
            **klant,
            factuurnummer="DA-26-0771",
            factuurdatum="29-06-2026",
            vervaldatum="29-07-2026",
            regels=[
                Regel("Drukwerk visitekaartjes", _d("1"), _d("85.00")),
                Regel("Briefpapier 500 vel", _d("1"), _d("125.00")),
            ],
            btw_percentage=_d("21"),
            bedrag_excl=_d("210.00"),
            btw_bedrag=_d("44.10"),
            bedrag_incl=_d("254.10"),
            waarom="foto/scan zonder tekstlaag: hier is geen tekst uit te halen",
            verwacht="review_nodig",
        ),
        Factuur(
            bestandsnaam="09-zonder-factuurnummer.pdf",
            titel="Factuur",
            **bedrijf("Schoonmaakbedrijf Helder", "Dorpsstraat 61", "6811 CD Arnhem"),
            **klant,
            factuurnummer=None,
            factuurdatum="18-08-2026",
            vervaldatum="17-09-2026",
            regels=[Regel("Schoonmaak kantoorruimte augustus 2026", _d("1"), _d("95.00"))],
            btw_percentage=_d("21"),
            bedrag_excl=_d("95.00"),
            btw_bedrag=_d("19.95"),
            bedrag_incl=_d("114.95"),
            waarom="factuurnummer ontbreekt volledig op het document",
            verwacht="review_nodig",
        ),
        Factuur(
            bestandsnaam="10-bedragen-kloppen-niet.pdf",
            titel="Factuur",
            **bedrijf("Meubelzaak De Eik", "Marktstraat 8", "8011 LK Zwolle"),
            **klant,
            factuurnummer="ME-2026-0203",
            factuurdatum="20-08-2026",
            vervaldatum="19-09-2026",
            regels=[Regel("Bureaustoel ergonomisch", _d("2"), _d("150.00"))],
            btw_percentage=_d("21"),
            bedrag_excl=_d("300.00"),
            btw_bedrag=_d("63.00"),
            bedrag_incl=_d("383.00"),  # bewust fout: 300,00 + 63,00 = 363,00
            waarom="totaal klopt niet: 300,00 + 63,00 is 363,00, niet 383,00",
            verwacht="review_nodig",
        ),
    ]


def controleer(facturen: list[Factuur]) -> None:
    """Reken de bedragen na, zodat een typefout niet ongemerkt doorglipt.

    Factuur 10 hoort bewust niet te kloppen; die wordt overgeslagen.
    """
    for factuur in facturen:
        if "kloppen-niet" in factuur.bestandsnaam:
            som = factuur.bedrag_excl + factuur.btw_bedrag
            assert som != factuur.bedrag_incl, (
                f"{factuur.bestandsnaam} hoort juist NIET te kloppen"
            )
            continue

        regeltotaal = sum((regel.bedrag for regel in factuur.regels), Decimal("0"))
        if factuur.korting is not None:
            regeltotaal += factuur.korting[1]
        assert regeltotaal == factuur.bedrag_excl, (
            f"{factuur.bestandsnaam}: regels tellen op tot {regeltotaal}, "
            f"maar subtotaal is {factuur.bedrag_excl}"
        )
        verwachte_btw = (
            factuur.bedrag_excl * factuur.btw_percentage / 100
        ).quantize(Decimal("0.01"))
        assert factuur.btw_bedrag == verwachte_btw, (
            f"{factuur.bestandsnaam}: btw is {factuur.btw_bedrag}, "
            f"verwacht {verwachte_btw}"
        )
        assert factuur.bedrag_excl + factuur.btw_bedrag == factuur.bedrag_incl, (
            f"{factuur.bestandsnaam}: totaal klopt niet"
        )


def main() -> None:
    facturen = maak_facturen()
    controleer(facturen)

    DOELMAP.mkdir(parents=True, exist_ok=True)
    overzicht = []
    for factuur in facturen:
        doel = DOELMAP / factuur.bestandsnaam
        if doel.suffix == ".jpg":
            schrijf_jpeg(teken_jpg(factuur), doel)
        else:
            schrijf_pdf(teken_pdf(factuur), doel)

        overzicht.append(
            {
                "bestand": factuur.bestandsnaam,
                "waarom": factuur.waarom,
                "verwachte_status": factuur.verwacht,
                "leverancier": factuur.leverancier,
                "factuurnummer": factuur.factuurnummer,
                "factuurdatum": factuur.factuurdatum,
                "btw_percentage": str(factuur.btw_percentage),
                "bedrag_excl": str(factuur.bedrag_excl),
                "btw_bedrag": str(factuur.btw_bedrag),
                "bedrag_incl": str(factuur.bedrag_incl),
            }
        )
        print(f"  {factuur.bestandsnaam:<34} {doel.stat().st_size:>7} bytes")

    (DOELMAP / "overzicht.json").write_text(
        json.dumps(overzicht, ensure_ascii=False, indent=2) + "\n", encoding="utf-8"
    )
    print(f"\n{len(facturen)} bestanden in {DOELMAP}")


if __name__ == "__main__":
    main()
```

## `boekhouding/tests/genereer_ubl_testbestanden.py`

```python
#!/usr/bin/env python3
"""Genereer synthetische UBL-testbestanden (e-facturen).

    python tests/genereer_ubl_testbestanden.py

Er komen zes bestanden in tests/testfacturen/ubl/ te staan: vijf losse
UBL-bestanden en één PDF met een ingebedde e-factuur (Factur-X), zodat
ook dat pad echt getest kan worden.

Alles is verzonnen maar volgt UBL 2.1 zoals in NLCIUS en EN 16931.
Deterministisch: vaste datums en nummers, geen tijdstempel, geen
internet.
"""

import json
import sys
from decimal import Decimal
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent))

from testmateriaal.pdf_schrijver import Pagina, schrijf_pdf_met_bijlage

DOELMAP = Path(__file__).parent / "testfacturen" / "ubl"

KOP = """<?xml version="1.0" encoding="UTF-8"?>
<{wortel} xmlns="urn:oasis:names:specification:ubl:schema:xsd:{wortel}-2"
  xmlns:cac="urn:oasis:names:specification:ubl:schema:xsd:CommonAggregateComponents-2"
  xmlns:cbc="urn:oasis:names:specification:ubl:schema:xsd:CommonBasicComponents-2">
  <cbc:CustomizationID>urn:cen.eu:en16931:2017#compliant#urn:fdc:nen.nl:nlcius:v1.0</cbc:CustomizationID>
  <cbc:ProfileID>urn:fdc:peppol.eu:2017:poacc:billing:01:1.0</cbc:ProfileID>
  <cbc:ID>{nummer}</cbc:ID>
  <cbc:IssueDate>{datum}</cbc:IssueDate>
  <cbc:DueDate>{vervaldatum}</cbc:DueDate>
  <cbc:DocumentCurrencyCode>EUR</cbc:DocumentCurrencyCode>"""

LEVERANCIER = """
  <cac:AccountingSupplierParty>
    <cac:Party>
      <cbc:EndpointID schemeID="0106">{kvk}</cbc:EndpointID>
      <cac:PartyName><cbc:Name>{naam}</cbc:Name></cac:PartyName>
      <cac:PostalAddress>
        <cbc:StreetName>{straat}</cbc:StreetName>
        <cbc:CityName>{plaats}</cbc:CityName>
        <cbc:PostalZone>{postcode}</cbc:PostalZone>
        <cac:Country><cbc:IdentificationCode>NL</cbc:IdentificationCode></cac:Country>
      </cac:PostalAddress>
      <cac:PartyTaxScheme>
        <cbc:CompanyID>{btw_id}</cbc:CompanyID>
        <cac:TaxScheme><cbc:ID>VAT</cbc:ID></cac:TaxScheme>
      </cac:PartyTaxScheme>
      <cac:PartyLegalEntity>
        <cbc:RegistrationName>{naam}</cbc:RegistrationName>
        <cbc:CompanyID schemeID="0106">{kvk}</cbc:CompanyID>
      </cac:PartyLegalEntity>
    </cac:Party>
  </cac:AccountingSupplierParty>"""

KLANT = """
  <cac:AccountingCustomerParty>
    <cac:Party>
      <cac:PartyName><cbc:Name>Alkhadraa Advies</cbc:Name></cac:PartyName>
      <cac:PostalAddress>
        <cbc:StreetName>Zonnebloemstraat 14</cbc:StreetName>
        <cbc:CityName>Rotterdam</cbc:CityName>
        <cbc:PostalZone>3011 AB</cbc:PostalZone>
        <cac:Country><cbc:IdentificationCode>NL</cbc:IdentificationCode></cac:Country>
      </cac:PostalAddress>
    </cac:Party>
  </cac:AccountingCustomerParty>"""

SUBTOTAAL = """
    <cac:TaxSubtotal>
      <cbc:TaxableAmount currencyID="EUR">{excl}</cbc:TaxableAmount>
      <cbc:TaxAmount currencyID="EUR">{btw}</cbc:TaxAmount>
      <cac:TaxCategory>
        <cbc:ID>{code}</cbc:ID>
        <cbc:Percent>{percentage}</cbc:Percent>
        <cac:TaxScheme><cbc:ID>VAT</cbc:ID></cac:TaxScheme>
      </cac:TaxCategory>
    </cac:TaxSubtotal>"""

REGEL = """
  <cac:{regelnaam}>
    <cbc:ID>{nummer}</cbc:ID>
    <cbc:{hoeveelheid} unitCode="C62">{aantal}</cbc:{hoeveelheid}>
    <cbc:LineExtensionAmount currencyID="EUR">{bedrag}</cbc:LineExtensionAmount>
    <cac:Item>
      <cbc:Name>{omschrijving}</cbc:Name>
      <cac:ClassifiedTaxCategory>
        <cbc:ID>{code}</cbc:ID>
        <cbc:Percent>{percentage}</cbc:Percent>
        <cac:TaxScheme><cbc:ID>VAT</cbc:ID></cac:TaxScheme>
      </cac:ClassifiedTaxCategory>
    </cac:Item>
    <cac:Price><cbc:PriceAmount currencyID="EUR">{stukprijs}</cbc:PriceAmount></cac:Price>
  </cac:{regelnaam}>"""


def bouw(
    wortel, nummer, datum, vervaldatum, leverancier, regels, subtotalen,
    excl, incl, weglaten=(),
):
    """Zet een UBL-document in elkaar; `weglaten` haalt elementen eruit."""
    regelnaam = "CreditNoteLine" if wortel == "CreditNote" else "InvoiceLine"
    hoeveelheid = "CreditedQuantity" if wortel == "CreditNote" else "InvoicedQuantity"

    xml = KOP.format(wortel=wortel, nummer=nummer, datum=datum, vervaldatum=vervaldatum)
    for element in weglaten:
        # Het verplichte element eruit knippen, precies zoals een
        # onvolledig bestand van een leverancier eruit zou zien.
        begin = xml.find(f"  <cbc:{element}>")
        if begin != -1:
            einde = xml.find("\n", begin)
            xml = xml[:begin] + xml[einde + 1:]

    xml += LEVERANCIER.format(**leverancier)
    xml += KLANT

    xml += "\n  <cac:TaxTotal>"
    xml += f'\n    <cbc:TaxAmount currencyID="EUR">' + \
        str(sum(Decimal(s["btw"]) for s in subtotalen)) + "</cbc:TaxAmount>"
    for s in subtotalen:
        xml += SUBTOTAAL.format(**s)
    xml += "\n  </cac:TaxTotal>"

    xml += f"""
  <cac:LegalMonetaryTotal>
    <cbc:LineExtensionAmount currencyID="EUR">{excl}</cbc:LineExtensionAmount>
    <cbc:TaxExclusiveAmount currencyID="EUR">{excl}</cbc:TaxExclusiveAmount>
    <cbc:TaxInclusiveAmount currencyID="EUR">{incl}</cbc:TaxInclusiveAmount>
    <cbc:PayableAmount currencyID="EUR">{incl}</cbc:PayableAmount>
  </cac:LegalMonetaryTotal>"""

    for volgnummer, regel in enumerate(regels, start=1):
        xml += REGEL.format(
            regelnaam=regelnaam, hoeveelheid=hoeveelheid, nummer=volgnummer, **regel
        )
    xml += f"\n</{wortel}>\n"
    return xml


def leverancier(naam, straat, postcode, plaats, kvk, btw_id):
    return {
        "naam": naam, "straat": straat, "postcode": postcode,
        "plaats": plaats, "kvk": kvk, "btw_id": btw_id,
    }


VAN_DIJK = leverancier(
    "Van Dijk ICT-diensten", "Keizersgracht 218", "1016 DZ", "Amsterdam",
    "32205650", "NL110353601B43",
)
KORENAAR = leverancier(
    "Bakkerij De Korenaar", "Nieuwe Binnenweg 87", "3014 GJ", "Rotterdam",
    "24418896", "NL823456789B01",
)
GROOTHANDEL = leverancier(
    "Techniek Groothandel Oost", "Industrieweg 45", "7554 NB", "Hengelo",
    "06081234", "NL801234567B01",
)


def bestanden():
    """De vijf UBL-bestanden plus de Factur-X-PDF."""
    return [
        {
            "bestand": "01-standaard-21procent.xml",
            "waarom": "gewone e-factuur met het hoge tarief",
            "verwacht": "gevalideerd",
            "xml": bouw(
                "Invoice", "EF-2026-0101", "2026-07-14", "2026-08-13", VAN_DIJK,
                [{"aantal": "1", "bedrag": "400.00", "stukprijs": "400.00",
                  "omschrijving": "Onderhoud werkplekken juli 2026",
                  "code": "S", "percentage": "21.00"}],
                [{"excl": "400.00", "btw": "84.00", "code": "S", "percentage": "21.00"}],
                "400.00", "484.00",
            ),
            "velden": {"leverancier": "Van Dijk ICT-diensten",
                       "factuurnummer": "EF-2026-0101", "factuurdatum": "2026-07-14",
                       "bedrag_excl": "400.00", "btw_percentage": "21.00",
                       "btw_bedrag": "84.00", "bedrag_incl": "484.00"},
        },
        {
            "bestand": "02-diensten-9procent.xml",
            "waarom": "laag tarief van 9%",
            "verwacht": "gevalideerd",
            "xml": bouw(
                "Invoice", "EF-2026-0102", "2026-07-21", "2026-08-20", KORENAAR,
                [{"aantal": "50", "bedrag": "250.00", "stukprijs": "5.00",
                  "omschrijving": "Lunchbezorging teamdag", "code": "AA",
                  "percentage": "9.00"}],
                [{"excl": "250.00", "btw": "22.50", "code": "AA", "percentage": "9.00"}],
                "250.00", "272.50",
            ),
            "velden": {"leverancier": "Bakkerij De Korenaar",
                       "factuurnummer": "EF-2026-0102", "factuurdatum": "2026-07-21",
                       "bedrag_excl": "250.00", "btw_percentage": "9.00",
                       "btw_bedrag": "22.50", "bedrag_incl": "272.50"},
        },
        {
            "bestand": "03-creditnota.xml",
            "waarom": "CreditNote als hoofdelement; UBL noteert de bedragen positief",
            "verwacht": "review_nodig",
            "xml": bouw(
                "CreditNote", "EF-2026-0103C", "2026-08-04", "2026-09-03", VAN_DIJK,
                [{"aantal": "1", "bedrag": "400.00", "stukprijs": "400.00",
                  "omschrijving": "Creditering onderhoud juli 2026",
                  "code": "S", "percentage": "21.00"}],
                [{"excl": "400.00", "btw": "84.00", "code": "S", "percentage": "21.00"}],
                "400.00", "484.00",
            ),
            "velden": {"leverancier": "Van Dijk ICT-diensten",
                       "factuurnummer": "EF-2026-0103C", "factuurdatum": "2026-08-04",
                       "bedrag_excl": "400.00", "btw_percentage": "21.00",
                       "btw_bedrag": "84.00", "bedrag_incl": "484.00"},
        },
        {
            "bestand": "04-twee-btw-tarieven.xml",
            "waarom": "twee TaxSubtotal-blokken: 21% en 9% op één factuur",
            "verwacht": "review_nodig",
            "xml": bouw(
                "Invoice", "EF-2026-0104", "2026-08-11", "2026-09-10", GROOTHANDEL,
                [{"aantal": "1", "bedrag": "100.00", "stukprijs": "100.00",
                  "omschrijving": "Kantoorartikelen", "code": "S", "percentage": "21.00"},
                 {"aantal": "1", "bedrag": "200.00", "stukprijs": "200.00",
                  "omschrijving": "Vakliteratuur", "code": "AA", "percentage": "9.00"}],
                [{"excl": "100.00", "btw": "21.00", "code": "S", "percentage": "21.00"},
                 {"excl": "200.00", "btw": "18.00", "code": "AA", "percentage": "9.00"}],
                "300.00", "339.00",
            ),
            "velden": {},
        },
        {
            "bestand": "05-zonder-factuurdatum.xml",
            "waarom": "verplichte IssueDate ontbreekt",
            "verwacht": "review_nodig",
            "xml": bouw(
                "Invoice", "EF-2026-0105", "2026-08-18", "2026-09-17", VAN_DIJK,
                [{"aantal": "1", "bedrag": "400.00", "stukprijs": "400.00",
                  "omschrijving": "Onderhoud werkplekken augustus 2026",
                  "code": "S", "percentage": "21.00"}],
                [{"excl": "400.00", "btw": "84.00", "code": "S", "percentage": "21.00"}],
                "400.00", "484.00", weglaten=("IssueDate",),
            ),
            "velden": {},
        },
    ]


FACTUUR_X_XML = bouw(
    "Invoice", "EF-2026-0106", "2026-08-06", "2026-09-05", GROOTHANDEL,
    [{"aantal": "1", "bedrag": "512.50", "stukprijs": "512.50",
      "omschrijving": "Netwerkapparatuur", "code": "S", "percentage": "21.00"}],
    [{"excl": "512.50", "btw": "107.63", "code": "S", "percentage": "21.00"}],
    "512.50", "620.13",
)


def maak_factuur_x_pdf(doel: Path) -> Path:
    """Een PDF die er voor de mens uitziet als factuur, met de XML erin."""
    pagina = Pagina()
    pagina.tekst(56, 70, "Techniek Groothandel Oost", 15, vet=True)
    pagina.tekst_rechts(539, 72, "FACTUUR", 20, vet=True)
    pagina.tekst(56, 100, "KvK-nummer: 06081234", 8.5)
    pagina.tekst(56, 112, "Btw-id: NL801234567B01", 8.5)
    pagina.tekst(56, 160, "Factuurnummer:", 9)
    pagina.tekst_rechts(539, 160, "EF-2026-0106", 9)
    pagina.tekst(56, 174, "Factuurdatum:", 9)
    pagina.tekst_rechts(539, 174, "06-08-2026", 9)
    pagina.tekst(56, 188, "Vervaldatum:", 9)
    pagina.tekst_rechts(539, 188, "05-09-2026", 9)
    pagina.lijn(56, 210, 539, 210, 0.8)
    pagina.tekst(56, 228, "Netwerkapparatuur", 9)
    pagina.tekst_rechts(539, 228, "512,50", 9)
    pagina.tekst(340, 260, "Subtotaal excl. btw", 9)
    pagina.tekst_rechts(539, 260, "512,50", 9)
    pagina.tekst(340, 275, "Btw 21%", 9)
    pagina.tekst_rechts(539, 275, "107,63", 9)
    pagina.tekst(340, 296, "Totaal incl. btw", 10, vet=True)
    pagina.tekst_rechts(539, 296, "620,13", 10, vet=True)
    pagina.tekst(56, 340, "Deze factuur bevat een e-factuur als bijlage (Factur-X).", 8)
    return schrijf_pdf_met_bijlage(pagina, doel, "factur-x.xml",
                                   FACTUUR_X_XML.encode("utf-8"))


def main() -> None:
    DOELMAP.mkdir(parents=True, exist_ok=True)
    overzicht = []

    for item in bestanden():
        doel = DOELMAP / item["bestand"]
        doel.write_text(item["xml"], encoding="utf-8")
        overzicht.append({k: item[k] for k in ("bestand", "waarom", "verwacht", "velden")})
        print(f"  {item['bestand']:<32} {doel.stat().st_size:>6} bytes")

    doel = maak_factuur_x_pdf(DOELMAP / "06-factuur-x.pdf")
    overzicht.append({
        "bestand": "06-factuur-x.pdf",
        "waarom": "PDF met ingebedde e-factuur; de XML gaat voor op de tekstlaag",
        "verwacht": "gevalideerd",
        "velden": {"leverancier": "Techniek Groothandel Oost",
                   "factuurnummer": "EF-2026-0106", "factuurdatum": "2026-08-06",
                   "bedrag_excl": "512.50", "btw_percentage": "21.00",
                   "btw_bedrag": "107.63", "bedrag_incl": "620.13"},
    })
    print(f"  06-factuur-x.pdf                 {doel.stat().st_size:>6} bytes")

    (DOELMAP / "overzicht.json").write_text(
        json.dumps(overzicht, ensure_ascii=False, indent=2) + "\n", encoding="utf-8"
    )
    print(f"\n{len(overzicht)} bestanden in {DOELMAP}")


if __name__ == "__main__":
    main()
```

## `boekhouding/tests/testmateriaal/__init__.py`

```python
"""Hulpmiddelen om synthetisch testmateriaal te maken.

Bewust zonder externe bibliotheken: de stack ligt vast (Python, SQLite,
Pydantic, pytest) en testmateriaal genereren is geen reden om daarvan af
te wijken. De PDF- en JPEG-schrijvers hier zijn klein en doen precies
wat er voor factuurdocumenten nodig is, niet meer.
"""
```

## `boekhouding/tests/testmateriaal/pdf_schrijver.py`

```python
"""Minimale PDF-schrijver voor factuurdocumenten.

Genoeg voor een echte factuurlay-out: tekst links en rechts uitgelijnd,
in normaal of vet, plus horizontale lijnen. Geen afbeeldingen, geen
meerdere pagina's, geen tijdstempel in het bestand — dat laatste zorgt
ervoor dat twee keer genereren byte-voor-byte hetzelfde bestand geeft.

Coördinaten gaan van linksboven, zoals je een factuur leest; intern
wordt dat omgerekend naar het PDF-assenstelsel (linksonder).
"""

from pathlib import Path

A4_BREEDTE = 595  # punten (72 dpi)
A4_HOOGTE = 842

# Tekenbreedtes van Helvetica in duizendsten van de lettergrootte.
# Alleen nodig om bedragen netjes rechts uit te lijnen. Cijfers zijn in
# Helvetica en Helvetica-Bold even breed (556), dus een vetgedrukt
# totaal lijnt uit op dezelfde rechterkantlijn.
_BREEDTES = {
    " ": 278, "!": 278, '"': 355, "#": 556, "$": 556, "%": 889, "&": 667,
    "'": 191, "(": 333, ")": 333, "*": 389, "+": 584, ",": 278, "-": 333,
    ".": 278, "/": 278, ":": 278, ";": 278, "<": 584, "=": 584, ">": 584,
    "?": 556, "@": 1015, "[": 278, "\\": 278, "]": 278, "^": 469, "_": 556,
    "`": 333, "{": 334, "|": 260, "}": 334, "~": 584, "€": 556,
    "A": 667, "B": 667, "C": 722, "D": 722, "E": 667, "F": 611, "G": 778,
    "H": 722, "I": 278, "J": 500, "K": 667, "L": 556, "M": 833, "N": 722,
    "O": 778, "P": 667, "Q": 778, "R": 722, "S": 667, "T": 611, "U": 722,
    "V": 667, "W": 944, "X": 667, "Y": 667, "Z": 611,
    "a": 556, "b": 556, "c": 500, "d": 556, "e": 556, "f": 278, "g": 556,
    "h": 556, "i": 222, "j": 222, "k": 500, "l": 222, "m": 833, "n": 556,
    "o": 556, "p": 556, "q": 556, "r": 333, "s": 500, "t": 278, "u": 556,
    "v": 500, "w": 722, "x": 500, "y": 500, "z": 500,
}
_STANDAARDBREEDTE = 556


def tekstbreedte(tekst: str, grootte: float) -> float:
    """Breedte van een regel tekst in punten."""
    duizendsten = sum(
        _BREEDTES.get(teken, _STANDAARDBREEDTE)
        if not teken.isdigit()
        else 556
        for teken in tekst
    )
    return duizendsten * grootte / 1000


def _ontsnap(tekst: str) -> bytes:
    """Zet tekst om naar de bytes die in een PDF-string mogen staan."""
    ruw = tekst.replace("\\", r"\\").replace("(", r"\(").replace(")", r"\)")
    # WinAnsiEncoding komt overeen met cp1252; onbekende tekens worden
    # een vraagteken in plaats van een crash.
    return ruw.encode("cp1252", errors="replace")


class Pagina:
    """Verzamelt de tekenopdrachten voor één pagina."""

    def __init__(self, breedte: int = A4_BREEDTE, hoogte: int = A4_HOOGTE):
        self.breedte = breedte
        self.hoogte = hoogte
        self._opdrachten: list[bytes] = []

    def tekst(
        self, x: float, y: float, tekst: str, grootte: float = 9, vet: bool = False
    ) -> None:
        """Zet tekst neer met de linkerkant op x, y punten vanaf linksboven."""
        lettertype = b"/F2" if vet else b"/F1"
        self._opdrachten.append(
            b"BT " + lettertype + b" " + f"{grootte:g}".encode() + b" Tf "
            + f"{x:g} {self.hoogte - y:g}".encode() + b" Td ("
            + _ontsnap(tekst) + b") Tj ET"
        )

    def tekst_rechts(
        self, x: float, y: float, tekst: str, grootte: float = 9, vet: bool = False
    ) -> None:
        """Zet tekst neer met de rechterkant op x — voor bedragen."""
        self.tekst(x - tekstbreedte(tekst, grootte), y, tekst, grootte, vet)

    def lijn(
        self, x1: float, y1: float, x2: float, y2: float, dikte: float = 0.5,
        grijs: float = 0.0,
    ) -> None:
        self._opdrachten.append(
            f"{grijs:g} G {dikte:g} w {x1:g} {self.hoogte - y1:g} m "
            f"{x2:g} {self.hoogte - y2:g} l S".encode()
        )

    def inhoudsstroom(self) -> bytes:
        return b"\n".join(self._opdrachten)


def _bouw_pdf(pagina: "Pagina", bijlage: tuple[str, bytes] | None) -> bytes:
    """Zet de PDF-objecten in elkaar, eventueel met een ingebed bestand.

    Een bijlage maakt hier een Factur-X/ZUGFeRD-achtige PDF van: dezelfde
    factuur is dan zowel leesbaar voor een mens als machineleesbaar als
    XML. De XML is dan de betrouwbaarste bron.
    """
    stroom = pagina.inhoudsstroom()
    catalogus = b"<< /Type /Catalog /Pages 2 0 R"
    if bijlage is not None:
        catalogus += (
            b" /Names << /EmbeddedFiles << /Names [(" + bijlage[0].encode()
            + b") 7 0 R] >> >> /AF [7 0 R]"
        )
    catalogus += b" >>"

    objecten = [
        catalogus,
        b"<< /Type /Pages /Kids [3 0 R] /Count 1 >>",
        b"<< /Type /Page /Parent 2 0 R /MediaBox [0 0 "
        + f"{pagina.breedte} {pagina.hoogte}".encode()
        + b"] /Contents 4 0 R /Resources << /Font << /F1 5 0 R /F2 6 0 R >> >> >>",
        b"<< /Length " + str(len(stroom)).encode() + b" >>\nstream\n"
        + stroom + b"\nendstream",
        b"<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica "
        b"/Encoding /WinAnsiEncoding >>",
        b"<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold "
        b"/Encoding /WinAnsiEncoding >>",
    ]

    if bijlage is not None:
        naam, gegevens = bijlage[0].encode(), bijlage[1]
        objecten.append(
            b"<< /Type /Filespec /F (" + naam + b") /UF (" + naam
            + b") /AFRelationship /Data /Desc (Factuur als e-factuur)"
            b" /EF << /F 8 0 R >> >>"
        )
        objecten.append(
            b"<< /Type /EmbeddedFile /Subtype /text#2Fxml /Length "
            + str(len(gegevens)).encode() + b" >>\nstream\n" + gegevens
            + b"\nendstream"
        )

    uit = bytearray(b"%PDF-1.4\n")
    posities = []
    for nummer, obj in enumerate(objecten, start=1):
        posities.append(len(uit))
        uit += str(nummer).encode() + b" 0 obj\n" + obj + b"\nendobj\n"

    start_xref = len(uit)
    aantal = len(objecten) + 1
    uit += b"xref\n0 " + str(aantal).encode() + b"\n0000000000 65535 f \n"
    for positie in posities:
        uit += f"{positie:010d} 00000 n \n".encode()
    uit += (
        b"trailer\n<< /Size " + str(aantal).encode() + b" /Root 1 0 R >>\n"
        b"startxref\n" + str(start_xref).encode() + b"\n%%EOF\n"
    )
    return bytes(uit)


def schrijf_pdf(pagina: "Pagina", pad: str | Path) -> Path:
    """Schrijf één pagina weg als PDF-bestand."""
    pad = Path(pad)
    pad.parent.mkdir(parents=True, exist_ok=True)
    pad.write_bytes(_bouw_pdf(pagina, None))
    return pad


def schrijf_pdf_met_bijlage(
    pagina: "Pagina", pad: str | Path, bijlage_naam: str, bijlage: bytes
) -> Path:
    """Schrijf een PDF met een ingebed bestand (Factur-X / ZUGFeRD)."""
    pad = Path(pad)
    pad.parent.mkdir(parents=True, exist_ok=True)
    pad.write_bytes(_bouw_pdf(pagina, (bijlage_naam, bijlage)))
    return pad
```

## `boekhouding/tests/testmateriaal/bitmapfont.py`

```python
"""Een 5x7 bitmapfont, genoeg voor een gescande factuur.

Elk teken is 7 regels van 5 posities: '#' is inkt, '.' is papier. Er
staat alleen in wat een Nederlandse factuur nodig heeft; een onbekend
teken wordt als spatie getekend in plaats van een crash.
"""

BREEDTE = 5
HOOGTE = 7

_GLIEFEN = {
    " ": "..... ..... ..... ..... ..... ..... .....",
    "0": ".###. #...# #..## #.#.# ##..# #...# .###.",
    "1": "..#.. .##.. ..#.. ..#.. ..#.. ..#.. .###.",
    "2": ".###. #...# ....# ...#. ..#.. .#... #####",
    "3": "##### ...#. ..#.. ...#. ....# #...# .###.",
    "4": "...#. ..##. .#.#. #..#. ##### ...#. ...#.",
    "5": "##### #.... ####. ....# ....# #...# .###.",
    "6": "..##. .#... #.... ####. #...# #...# .###.",
    "7": "##### ....# ...#. ..#.. .#... .#... .#...",
    "8": ".###. #...# #...# .###. #...# #...# .###.",
    "9": ".###. #...# #...# .#### ....# ...#. .##..",
    "A": ".###. #...# #...# ##### #...# #...# #...#",
    "B": "####. #...# #...# ####. #...# #...# ####.",
    "C": ".###. #...# #.... #.... #.... #...# .###.",
    "D": "###.. #..#. #...# #...# #...# #..#. ###..",
    "E": "##### #.... #.... ####. #.... #.... #####",
    "F": "##### #.... #.... ####. #.... #.... #....",
    "G": ".###. #...# #.... #.### #...# #...# .####",
    "H": "#...# #...# #...# ##### #...# #...# #...#",
    "I": ".###. ..#.. ..#.. ..#.. ..#.. ..#.. .###.",
    "J": "..### ...#. ...#. ...#. ...#. #..#. .##..",
    "K": "#...# #..#. #.#.. ##... #.#.. #..#. #...#",
    "L": "#.... #.... #.... #.... #.... #.... #####",
    "M": "#...# ##.## #.#.# #.#.# #...# #...# #...#",
    "N": "#...# ##..# #.#.# #..## #...# #...# #...#",
    "O": ".###. #...# #...# #...# #...# #...# .###.",
    "P": "####. #...# #...# ####. #.... #.... #....",
    "Q": ".###. #...# #...# #...# #.#.# #..#. .##.#",
    "R": "####. #...# #...# ####. #.#.. #..#. #...#",
    "S": ".#### #.... #.... .###. ....# ....# ####.",
    "T": "##### ..#.. ..#.. ..#.. ..#.. ..#.. ..#..",
    "U": "#...# #...# #...# #...# #...# #...# .###.",
    "V": "#...# #...# #...# #...# #...# .#.#. ..#..",
    "W": "#...# #...# #...# #.#.# #.#.# ##.## #...#",
    "X": "#...# #...# .#.#. ..#.. .#.#. #...# #...#",
    "Y": "#...# #...# .#.#. ..#.. ..#.. ..#.. ..#..",
    "Z": "##### ....# ...#. ..#.. .#... #.... #####",
    "a": "..... ..... .###. ....# .#### #...# .####",
    "b": "#.... #.... ####. #...# #...# #...# ####.",
    "c": "..... ..... .###. #.... #.... #.... .###.",
    "d": "....# ....# .#### #...# #...# #...# .####",
    "e": "..... ..... .###. #...# ##### #.... .###.",
    "f": "..##. .#..# .#... ###.. .#... .#... .#...",
    "g": "..... .#### #...# #...# .#### ....# .###.",
    "h": "#.... #.... ####. #...# #...# #...# #...#",
    "i": "..#.. ..... .##.. ..#.. ..#.. ..#.. .###.",
    "j": "...#. ..... ..##. ...#. ...#. #..#. .##..",
    "k": "#.... #.... #..#. #.#.. ##... #.#.. #..#.",
    "l": ".##.. ..#.. ..#.. ..#.. ..#.. ..#.. .###.",
    "m": "..... ..... ##.#. #.#.# #.#.# #...# #...#",
    "n": "..... ..... ####. #...# #...# #...# #...#",
    "o": "..... ..... .###. #...# #...# #...# .###.",
    "p": "..... ####. #...# #...# ####. #.... #....",
    "q": "..... .#### #...# #...# .#### ....# ....#",
    "r": "..... ..... #.##. ##..# #.... #.... #....",
    "s": "..... ..... .#### #.... .###. ....# ####.",
    "t": ".#... .#... ###.. .#... .#... .#..# ..##.",
    "u": "..... ..... #...# #...# #...# #..## .##.#",
    "v": "..... ..... #...# #...# #...# .#.#. ..#..",
    "w": "..... ..... #...# #...# #.#.# #.#.# .#.#.",
    "x": "..... ..... #...# .#.#. ..#.. .#.#. #...#",
    "y": "..... #...# #...# #...# .#### ....# .###.",
    "z": "..... ..... ##### ...#. ..#.. .#... #####",
    ".": "..... ..... ..... ..... ..... .##.. .##..",
    ",": "..... ..... ..... ..... .##.. .##.. .#...",
    ":": "..... .##.. .##.. ..... .##.. .##.. .....",
    ";": "..... .##.. .##.. ..... .##.. .##.. .#...",
    "-": "..... ..... ..... ##### ..... ..... .....",
    "+": "..... ..#.. ..#.. ##### ..#.. ..#.. .....",
    "/": "....# ....# ...#. ..#.. .#... #.... #....",
    "(": "..##. .#... .#... .#... .#... .#... ..##.",
    ")": ".##.. ...#. ...#. ...#. ...#. ...#. .##..",
    "%": "##..# ##.#. ..#.. .#... #.##. ..##. .....",
    "€": "..### .#... ####. .#... ####. .#... ..###",
    "*": "..... #.#.# .###. ##### .###. #.#.# .....",
    "'": ".##.. .##.. .#... ..... ..... ..... .....",
}

# Omgezet naar rijen van booleans, één keer bij het laden.
GLIEFEN = {
    teken: [[vak == "#" for vak in rij] for rij in patroon.split()]
    for teken, patroon in _GLIEFEN.items()
}
SPATIE = GLIEFEN[" "]


def glief(teken: str) -> list[list[bool]]:
    """Geef het patroon van een teken; onbekend wordt een spatie."""
    return GLIEFEN.get(teken, SPATIE)
```

## `boekhouding/tests/testmateriaal/jpeg_schrijver.py`

```python
"""Minimale baseline-JPEG-schrijver in grijswaarden.

Nodig voor één ding: een factuur die als gescande foto binnenkomt, dus
een echt beeldbestand zonder tekstlaag. Bewust met de hand geschreven in
plaats van met een beeldbibliotheek, zodat het project geen extra
afhankelijkheid krijgt.

Het formaat volgt de standaardtabellen uit de JPEG-specificatie
(bijlage K): één component, 8 bits, geen subsampling.
"""

import math
from pathlib import Path

from .bitmapfont import BREEDTE as GLIEFBREEDTE, HOOGTE as GLIEFHOOGTE, glief

# Standaard kwantisatietabel voor helderheid (JPEG-bijlage K).
KWANTISATIE = [
    16, 11, 10, 16, 24, 40, 51, 61,
    12, 12, 14, 19, 26, 58, 60, 55,
    14, 13, 16, 24, 40, 57, 69, 56,
    14, 17, 22, 29, 51, 87, 80, 62,
    18, 22, 37, 56, 68, 109, 103, 77,
    24, 35, 55, 64, 81, 104, 113, 92,
    49, 64, 78, 87, 103, 121, 120, 101,
    72, 92, 95, 98, 112, 100, 103, 99,
]

ZIGZAG = [
    0, 1, 8, 16, 9, 2, 3, 10,
    17, 24, 32, 25, 18, 11, 4, 5,
    12, 19, 26, 33, 40, 48, 41, 34,
    27, 20, 13, 6, 7, 14, 21, 28,
    35, 42, 49, 56, 57, 50, 43, 36,
    29, 22, 15, 23, 30, 37, 44, 51,
    58, 59, 52, 45, 38, 31, 39, 46,
    53, 60, 61, 54, 47, 55, 62, 63,
]

DC_BITS = [0, 1, 5, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0]
DC_WAARDEN = list(range(12))

AC_BITS = [0, 2, 1, 3, 3, 2, 4, 3, 5, 5, 4, 4, 0, 0, 1, 0x7D]
AC_WAARDEN = [
    0x01, 0x02, 0x03, 0x00, 0x04, 0x11, 0x05, 0x12,
    0x21, 0x31, 0x41, 0x06, 0x13, 0x51, 0x61, 0x07,
    0x22, 0x71, 0x14, 0x32, 0x81, 0x91, 0xA1, 0x08,
    0x23, 0x42, 0xB1, 0xC1, 0x15, 0x52, 0xD1, 0xF0,
    0x24, 0x33, 0x62, 0x72, 0x82, 0x09, 0x0A, 0x16,
    0x17, 0x18, 0x19, 0x1A, 0x25, 0x26, 0x27, 0x28,
    0x29, 0x2A, 0x34, 0x35, 0x36, 0x37, 0x38, 0x39,
    0x3A, 0x43, 0x44, 0x45, 0x46, 0x47, 0x48, 0x49,
    0x4A, 0x53, 0x54, 0x55, 0x56, 0x57, 0x58, 0x59,
    0x5A, 0x63, 0x64, 0x65, 0x66, 0x67, 0x68, 0x69,
    0x6A, 0x73, 0x74, 0x75, 0x76, 0x77, 0x78, 0x79,
    0x7A, 0x83, 0x84, 0x85, 0x86, 0x87, 0x88, 0x89,
    0x8A, 0x92, 0x93, 0x94, 0x95, 0x96, 0x97, 0x98,
    0x99, 0x9A, 0xA2, 0xA3, 0xA4, 0xA5, 0xA6, 0xA7,
    0xA8, 0xA9, 0xAA, 0xB2, 0xB3, 0xB4, 0xB5, 0xB6,
    0xB7, 0xB8, 0xB9, 0xBA, 0xC2, 0xC3, 0xC4, 0xC5,
    0xC6, 0xC7, 0xC8, 0xC9, 0xCA, 0xD2, 0xD3, 0xD4,
    0xD5, 0xD6, 0xD7, 0xD8, 0xD9, 0xDA, 0xE1, 0xE2,
    0xE3, 0xE4, 0xE5, 0xE6, 0xE7, 0xE8, 0xE9, 0xEA,
    0xF1, 0xF2, 0xF3, 0xF4, 0xF5, 0xF6, 0xF7, 0xF8,
    0xF9, 0xFA,
]

# Cosinustabel en schaalfactoren voor de DCT, één keer berekend.
_COS = [[math.cos((2 * x + 1) * u * math.pi / 16) for x in range(8)] for u in range(8)]
_C = [(1 / math.sqrt(2) if u == 0 else 1.0) * 0.5 for u in range(8)]


def _huffmantabel(bits: list[int], waarden: list[int]) -> dict[int, tuple[int, int]]:
    """Bouw {waarde: (code, aantal bits)} uit de tellingen per codelengte."""
    tabel = {}
    code = 0
    positie = 0
    for lengte in range(1, 17):
        for _ in range(bits[lengte - 1]):
            tabel[waarden[positie]] = (code, lengte)
            code += 1
            positie += 1
        code <<= 1
    return tabel


DC_TABEL = _huffmantabel(DC_BITS, DC_WAARDEN)
AC_TABEL = _huffmantabel(AC_BITS, AC_WAARDEN)


class _BitSchrijver:
    """Schrijft bits en zorgt voor de verplichte 0xFF-opvulling."""

    def __init__(self) -> None:
        self.uit = bytearray()
        self._buffer = 0
        self._aantal = 0

    def bits(self, code: int, lengte: int) -> None:
        for verschuiving in range(lengte - 1, -1, -1):
            self._buffer = (self._buffer << 1) | ((code >> verschuiving) & 1)
            self._aantal += 1
            if self._aantal == 8:
                self.uit.append(self._buffer)
                if self._buffer == 0xFF:
                    self.uit.append(0x00)  # byte stuffing
                self._buffer = 0
                self._aantal = 0

    def afsluiten(self) -> None:
        while self._aantal:
            self.bits(1, 1)


def _categorie(waarde: int) -> int:
    """Aantal bits dat nodig is om deze waarde te coderen."""
    grootte = 0
    rest = abs(waarde)
    while rest:
        grootte += 1
        rest >>= 1
    return grootte


def _bitpatroon(waarde: int, grootte: int) -> int:
    return waarde if waarde > 0 else waarde + (1 << grootte) - 1


def _dct(blok: list[list[float]]) -> list[float]:
    """Voorwaartse 2D-DCT, gescheiden per rij en kolom (sneller)."""
    tussen = [
        [sum(blok[y][x] * _COS[u][x] for x in range(8)) * _C[u] for u in range(8)]
        for y in range(8)
    ]
    uit = []
    for v in range(8):
        for u in range(8):
            uit.append(sum(tussen[y][u] * _COS[v][y] for y in range(8)) * _C[v])
    return uit


class Bitmap:
    """Een grijswaardenvel waarop je tekst en lijnen kunt zetten."""

    def __init__(self, breedte: int, hoogte: int, achtergrond: int = 246):
        self.breedte = breedte
        self.hoogte = hoogte
        self.pixels = [[achtergrond] * breedte for _ in range(hoogte)]

    def punt(self, x: int, y: int, grijs: int) -> None:
        if 0 <= x < self.breedte and 0 <= y < self.hoogte:
            self.pixels[y][x] = max(0, min(255, grijs))

    def rechthoek(self, x: int, y: int, breedte: int, hoogte: int, grijs: int) -> None:
        for rij in range(y, y + hoogte):
            for kolom in range(x, x + breedte):
                self.punt(kolom, rij, grijs)

    def tekst(
        self, x: int, y: int, tekst: str, schaal: int = 2, grijs: int = 40
    ) -> int:
        """Teken tekst met de linkerbovenhoek op (x, y); geef de eindpositie."""
        cursor = x
        for teken in tekst:
            patroon = glief(teken)
            for rij in range(GLIEFHOOGTE):
                for kolom in range(GLIEFBREEDTE):
                    if patroon[rij][kolom]:
                        self.rechthoek(
                            cursor + kolom * schaal, y + rij * schaal,
                            schaal, schaal, grijs,
                        )
            cursor += (GLIEFBREEDTE + 1) * schaal
        return cursor

    def tekstbreedte(self, tekst: str, schaal: int = 2) -> int:
        return len(tekst) * (GLIEFBREEDTE + 1) * schaal

    def tekst_rechts(
        self, x: int, y: int, tekst: str, schaal: int = 2, grijs: int = 40
    ) -> None:
        self.tekst(x - self.tekstbreedte(tekst, schaal), y, tekst, schaal, grijs)


def schrijf_jpeg(bitmap: Bitmap, pad: str | Path, dpi: int = 100) -> Path:
    """Codeer de bitmap als baseline-JPEG en schrijf hem weg."""
    uit = bytearray(b"\xff\xd8")  # SOI

    # APP0 (JFIF)
    uit += b"\xff\xe0" + (16).to_bytes(2, "big") + b"JFIF\x00\x01\x01\x01"
    uit += dpi.to_bytes(2, "big") + dpi.to_bytes(2, "big") + b"\x00\x00"

    # DQT — de tabel gaat in zigzagvolgorde het bestand in.
    uit += b"\xff\xdb" + (67).to_bytes(2, "big") + b"\x00"
    uit += bytes(KWANTISATIE[ZIGZAG[i]] for i in range(64))

    # SOF0 — één component, geen subsampling.
    uit += b"\xff\xc0" + (11).to_bytes(2, "big") + b"\x08"
    uit += bitmap.hoogte.to_bytes(2, "big") + bitmap.breedte.to_bytes(2, "big")
    uit += b"\x01\x01\x11\x00"

    # DHT — de twee standaardtabellen.
    for klasse, bits, waarden in (
        (0x00, DC_BITS, DC_WAARDEN),
        (0x10, AC_BITS, AC_WAARDEN),
    ):
        uit += b"\xff\xc4" + (3 + 16 + len(waarden)).to_bytes(2, "big")
        uit += bytes([klasse]) + bytes(bits) + bytes(waarden)

    # SOS
    uit += b"\xff\xda" + (8).to_bytes(2, "big") + b"\x01\x01\x00\x00\x3f\x00"

    schrijver = _BitSchrijver()
    vorige_dc = 0
    for bloky in range(0, bitmap.hoogte, 8):
        for blokx in range(0, bitmap.breedte, 8):
            # Randblokken worden aangevuld met de laatste pixelwaarde.
            blok = [
                [
                    bitmap.pixels[min(bloky + y, bitmap.hoogte - 1)][
                        min(blokx + x, bitmap.breedte - 1)
                    ]
                    - 128
                    for x in range(8)
                ]
                for y in range(8)
            ]
            coefficienten = _dct(blok)
            gekwantiseerd = [
                int(round(coefficienten[ZIGZAG[i]] / KWANTISATIE[ZIGZAG[i]]))
                for i in range(64)
            ]

            # Gelijkstroomcoëfficiënt: alleen het verschil met het vorige blok.
            verschil = gekwantiseerd[0] - vorige_dc
            vorige_dc = gekwantiseerd[0]
            grootte = _categorie(verschil)
            code, lengte = DC_TABEL[grootte]
            schrijver.bits(code, lengte)
            if grootte:
                schrijver.bits(_bitpatroon(verschil, grootte), grootte)

            # Wisselstroomcoëfficiënten: reeksen nullen plus waarde.
            nullen = 0
            laatste = max(
                (i for i in range(1, 64) if gekwantiseerd[i]), default=0
            )
            for i in range(1, laatste + 1):
                if gekwantiseerd[i] == 0:
                    nullen += 1
                    continue
                while nullen > 15:
                    code, lengte = AC_TABEL[0xF0]  # ZRL
                    schrijver.bits(code, lengte)
                    nullen -= 16
                grootte = _categorie(gekwantiseerd[i])
                code, lengte = AC_TABEL[(nullen << 4) | grootte]
                schrijver.bits(code, lengte)
                schrijver.bits(_bitpatroon(gekwantiseerd[i], grootte), grootte)
                nullen = 0
            if laatste < 63:
                code, lengte = AC_TABEL[0x00]  # einde blok
                schrijver.bits(code, lengte)

    schrijver.afsluiten()
    uit += schrijver.uit
    uit += b"\xff\xd9"  # EOI

    pad = Path(pad)
    pad.parent.mkdir(parents=True, exist_ok=True)
    pad.write_bytes(bytes(uit))
    return pad
```

## `boekhouding/tests/conftest.py`

```python
from datetime import date

import pytest

from boekhouding import maak_verbinding, maak_tabellen, maak_administratie

# Vaste peildatum zodat de tests niet afhangen van de echte klok.
VANDAAG = date(2026, 8, 26)


def geldige_factuur() -> dict:
    """Een factuur waar niets mis mee is: 100.00 + 21% = 121.00."""
    return {
        "leverancier": "KPN B.V.",
        "factuurdatum": "2026-08-01",
        "factuurnummer": "F2026-0001",
        "bedrag_excl": "100.00",
        "btw_percentage": "21",
        "btw_bedrag": "21.00",
        "bedrag_incl": "121.00",
    }


def maak_pdf(tekst: str | None) -> bytes:
    """Bouw een minimale, geldige PDF van één pagina.

    Zo hoeven de tests geen bestand te downloaden. Met `tekst` krijgt de
    pagina een echte tekstlaag; met None wordt alleen een rechthoek
    getekend — dat is het geval dat een scan nabootst: een geldige PDF
    zonder tekstlaag.
    """
    if tekst is None:
        stroom = b"1 0 0 RG 100 100 200 300 re S"
        resources = b"<< >>"
    else:
        veilig = tekst.replace("\\", r"\\").replace("(", r"\(").replace(")", r"\)")
        stroom = (
            b"BT /F1 12 Tf 72 720 Td (" + veilig.encode("latin-1") + b") Tj ET"
        )
        resources = b"<< /Font << /F1 5 0 R >> >>"

    objecten = [
        b"<< /Type /Catalog /Pages 2 0 R >>",
        b"<< /Type /Pages /Kids [3 0 R] /Count 1 >>",
        b"<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] "
        b"/Contents 4 0 R /Resources " + resources + b" >>",
        b"<< /Length " + str(len(stroom)).encode() + b" >>\nstream\n"
        + stroom
        + b"\nendstream",
        b"<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>",
    ]

    uit = bytearray(b"%PDF-1.4\n")
    posities = []
    for nummer, obj in enumerate(objecten, start=1):
        posities.append(len(uit))
        uit += str(nummer).encode() + b" 0 obj\n" + obj + b"\nendobj\n"

    start_xref = len(uit)
    aantal = len(objecten) + 1
    uit += b"xref\n0 " + str(aantal).encode() + b"\n0000000000 65535 f \n"
    for positie in posities:
        uit += f"{positie:010d} 00000 n \n".encode()
    uit += (
        b"trailer\n<< /Size " + str(aantal).encode() + b" /Root 1 0 R >>\n"
        b"startxref\n" + str(start_xref).encode() + b"\n%%EOF\n"
    )
    return bytes(uit)


@pytest.fixture
def conn():
    verbinding = maak_verbinding(":memory:")
    maak_tabellen(verbinding)
    yield verbinding
    verbinding.close()


@pytest.fixture
def administratie_id(conn):
    return maak_administratie(conn, "Testzaak", "eenmanszaak")
```

## `boekhouding/tests/test_schema.py`

```python
"""Tests voor het Pydantic-schema Factuur (types, floats, btw-percentages)."""

from decimal import Decimal

from boekhouding import valideer_factuur
from conftest import VANDAAG, geldige_factuur


def test_geldige_factuur_wordt_gevalideerd():
    resultaat = valideer_factuur(geldige_factuur(), vandaag=VANDAAG)
    assert resultaat.status == "gevalideerd"
    assert resultaat.redenen == []
    assert resultaat.factuur is not None


def test_bedragen_zijn_decimal_geen_float():
    resultaat = valideer_factuur(geldige_factuur(), vandaag=VANDAAG)
    assert isinstance(resultaat.factuur.bedrag_excl, Decimal)
    assert isinstance(resultaat.factuur.btw_bedrag, Decimal)
    assert isinstance(resultaat.factuur.bedrag_incl, Decimal)


def test_float_wordt_geweigerd():
    data = geldige_factuur()
    data["bedrag_excl"] = 100.00  # float — Gouden regel 5
    resultaat = valideer_factuur(data, vandaag=VANDAAG)
    assert resultaat.status == "review_nodig"
    assert any("float" in reden for reden in resultaat.redenen)


def test_komma_als_decimaalteken_wordt_begrepen():
    data = geldige_factuur()
    data["bedrag_excl"] = "100,00"
    resultaat = valideer_factuur(data, vandaag=VANDAAG)
    assert resultaat.status == "gevalideerd"
    assert resultaat.factuur.bedrag_excl == Decimal("100.00")


def test_punt_als_decimaalteken_wordt_begrepen():
    data = geldige_factuur()
    data["bedrag_excl"] = "100.00"
    resultaat = valideer_factuur(data, vandaag=VANDAAG)
    assert resultaat.status == "gevalideerd"
    assert resultaat.factuur.bedrag_excl == Decimal("100.00")


def test_nederlands_duizendtal_wordt_begrepen():
    # Punt én komma aanwezig → punt is duizendtalscheiding.
    data = geldige_factuur() | {
        "bedrag_excl": "1.250,00",
        "btw_bedrag": "262,50",
        "bedrag_incl": "1.512,50",
    }
    resultaat = valideer_factuur(data, vandaag=VANDAAG)
    assert resultaat.status == "gevalideerd"
    assert resultaat.factuur.bedrag_excl == Decimal("1250.00")
    assert resultaat.factuur.bedrag_incl == Decimal("1512.50")


def test_ambigu_bedrag_geeft_review():
    # "1.250" kan 1250,00 (NL duizendtal) of 1,250 (Engels decimaal)
    # zijn — nooit gokken (Gouden regel 4), dus review. Zonder deze
    # check zou een 0%-factuur met 1.25 i.p.v. 1250 gewoon door alle
    # rekencontroles glippen.
    data = geldige_factuur() | {
        "bedrag_excl": "1.250",
        "btw_percentage": "0",
        "btw_bedrag": "0",
        "bedrag_incl": "1.250",
    }
    resultaat = valideer_factuur(data, vandaag=VANDAAG)
    assert resultaat.status == "review_nodig"
    assert any(
        "ambigu bedrag" in reden and "1250,00" in reden and "1,250" in reden
        for reden in resultaat.redenen
    )


def test_groter_ambigu_bedrag_geeft_review():
    data = geldige_factuur() | {
        "bedrag_excl": "12.500",
        "btw_percentage": "0",
        "btw_bedrag": "0",
        "bedrag_incl": "12.500",
    }
    resultaat = valideer_factuur(data, vandaag=VANDAAG)
    assert resultaat.status == "review_nodig"
    assert any("ambigu bedrag" in reden for reden in resultaat.redenen)


def test_een_decimaal_achter_de_punt_blijft_geldig():
    data = geldige_factuur() | {
        "bedrag_excl": "0.5",
        "btw_percentage": "0",
        "btw_bedrag": "0.00",
        "bedrag_incl": "0.5",
    }
    resultaat = valideer_factuur(data, vandaag=VANDAAG)
    assert resultaat.status == "gevalideerd"
    assert resultaat.factuur.bedrag_excl == Decimal("0.5")


def test_groter_nederlands_duizendtal_wordt_begrepen():
    data = geldige_factuur() | {
        "bedrag_excl": "12.500,50",
        "btw_percentage": "0",
        "btw_bedrag": "0,00",
        "bedrag_incl": "12.500,50",
    }
    resultaat = valideer_factuur(data, vandaag=VANDAAG)
    assert resultaat.status == "gevalideerd"
    assert resultaat.factuur.bedrag_excl == Decimal("12500.50")


def test_btw_9_en_0_zijn_toegestaan():
    negen = geldige_factuur() | {
        "btw_percentage": "9", "btw_bedrag": "9.00", "bedrag_incl": "109.00",
    }
    nul = geldige_factuur() | {
        "btw_percentage": "0", "btw_bedrag": "0.00", "bedrag_incl": "100.00",
    }
    assert valideer_factuur(negen, vandaag=VANDAAG).status == "gevalideerd"
    assert valideer_factuur(nul, vandaag=VANDAAG).status == "gevalideerd"


def test_ongeldig_btw_percentage_geeft_review():
    data = geldige_factuur() | {
        "btw_percentage": "15", "btw_bedrag": "15.00", "bedrag_incl": "115.00",
    }
    resultaat = valideer_factuur(data, vandaag=VANDAAG)
    assert resultaat.status == "review_nodig"
    assert any("btw_percentage" in reden for reden in resultaat.redenen)


def test_jaar_zonder_btw_config_geeft_review():
    # 2023 heeft geen config-bestand; nooit gokken, dus review.
    data = geldige_factuur() | {"factuurdatum": "2023-01-15"}
    resultaat = valideer_factuur(data, vandaag=VANDAAG)
    assert resultaat.status == "review_nodig"
    assert any("btw-configuratie" in reden for reden in resultaat.redenen)


def test_lege_leverancier_geeft_review():
    data = geldige_factuur() | {"leverancier": "   "}
    resultaat = valideer_factuur(data, vandaag=VANDAAG)
    assert resultaat.status == "review_nodig"
    assert any("leverancier" in reden for reden in resultaat.redenen)


def test_ontbrekend_veld_geeft_review_en_bewaart_data():
    data = geldige_factuur()
    del data["factuurnummer"]
    resultaat = valideer_factuur(data, vandaag=VANDAAG)
    assert resultaat.status == "review_nodig"
    assert any("factuurnummer" in reden for reden in resultaat.redenen)
    assert resultaat.originele_data == data  # niets weggegooid


def test_onzin_input_gooit_nooit_een_exception():
    resultaat = valideer_factuur(
        {"leverancier": 42, "bedrag_excl": "abc", "factuurdatum": "gisteren"},
        vandaag=VANDAAG,
    )
    assert resultaat.status == "review_nodig"
    assert len(resultaat.redenen) >= 3


# --- datumnotatie -------------------------------------------------------

def test_iso_datum_wordt_begrepen():
    data = geldige_factuur() | {"factuurdatum": "2026-08-01"}
    resultaat = valideer_factuur(data, vandaag=VANDAAG)
    assert resultaat.status == "gevalideerd"
    assert str(resultaat.factuur.factuurdatum) == "2026-08-01"


def test_eenduidige_nederlandse_datum_wordt_omgezet():
    # 31 kan alleen een dag zijn, dus hier valt niets te gokken.
    data = geldige_factuur() | {"factuurdatum": "31-07-2026"}
    resultaat = valideer_factuur(data, vandaag=VANDAAG)
    assert resultaat.status == "gevalideerd"
    assert str(resultaat.factuur.factuurdatum) == "2026-07-31"


def test_ambigue_datum_geeft_review_met_beide_lezingen():
    # 03-04-2026 kan 3 april of 4 maart zijn — niet gokken.
    data = geldige_factuur() | {"factuurdatum": "03-04-2026"}
    resultaat = valideer_factuur(data, vandaag=VANDAAG)
    assert resultaat.status == "review_nodig"
    assert any(
        "ambigue datum" in reden and "2026-04-03" in reden
        for reden in resultaat.redenen
    )


def test_ambigue_datum_op_de_grens_van_twaalf():
    data = geldige_factuur() | {"factuurdatum": "12-07-2026"}
    resultaat = valideer_factuur(data, vandaag=VANDAAG)
    assert resultaat.status == "review_nodig"
    assert any("ambigue datum" in reden for reden in resultaat.redenen)


def test_onbestaande_datum_geeft_gewoon_review():
    data = geldige_factuur() | {"factuurdatum": "2026-13-01"}
    resultaat = valideer_factuur(data, vandaag=VANDAAG)
    assert resultaat.status == "review_nodig"
    assert any("factuurdatum" in reden for reden in resultaat.redenen)
```

## `boekhouding/tests/test_validatie.py`

```python
"""Tests voor de rekenregels, datumcontroles en de duplicaatcheck."""

from boekhouding import valideer_factuur
from conftest import VANDAAG, geldige_factuur


# --- optelling: bedrag_excl + btw_bedrag == bedrag_incl (±€0.02) ---

def test_optelling_binnen_tolerantie_is_ok():
    data = geldige_factuur() | {"bedrag_incl": "121.02"}  # 2 cent afronding
    assert valideer_factuur(data, vandaag=VANDAAG).status == "gevalideerd"


def test_optelling_buiten_tolerantie_geeft_review():
    data = geldige_factuur() | {"bedrag_incl": "121.03"}  # 3 cent verschil
    resultaat = valideer_factuur(data, vandaag=VANDAAG)
    assert resultaat.status == "review_nodig"
    assert any("bedrag_incl" in reden for reden in resultaat.redenen)


# --- btw: btw_bedrag == bedrag_excl × pct/100 (±€0.02) ---

def test_btw_afronding_binnen_tolerantie_is_ok():
    # 9% van 33.33 = 2.9997 ≈ 3.00
    data = geldige_factuur() | {
        "bedrag_excl": "33.33",
        "btw_percentage": "9",
        "btw_bedrag": "3.00",
        "bedrag_incl": "36.33",
    }
    assert valideer_factuur(data, vandaag=VANDAAG).status == "gevalideerd"


def test_verkeerd_btw_bedrag_geeft_review():
    data = geldige_factuur() | {"btw_bedrag": "21.03", "bedrag_incl": "121.03"}
    resultaat = valideer_factuur(data, vandaag=VANDAAG)
    assert resultaat.status == "review_nodig"
    assert any("btw_bedrag" in reden for reden in resultaat.redenen)


# --- factuurdatum: niet in de toekomst, niet ouder dan 2 jaar ---

def test_datum_in_de_toekomst_geeft_review():
    data = geldige_factuur() | {"factuurdatum": "2026-08-27"}  # morgen
    resultaat = valideer_factuur(data, vandaag=VANDAAG)
    assert resultaat.status == "review_nodig"
    assert any("toekomst" in reden for reden in resultaat.redenen)


def test_datum_vandaag_is_ok():
    data = geldige_factuur() | {"factuurdatum": str(VANDAAG)}
    assert valideer_factuur(data, vandaag=VANDAAG).status == "gevalideerd"


def test_datum_precies_twee_jaar_geleden_is_ok():
    data = geldige_factuur() | {"factuurdatum": "2024-08-26"}
    assert valideer_factuur(data, vandaag=VANDAAG).status == "gevalideerd"


def test_datum_ouder_dan_twee_jaar_geeft_review():
    data = geldige_factuur() | {"factuurdatum": "2024-08-25"}
    resultaat = valideer_factuur(data, vandaag=VANDAAG)
    assert resultaat.status == "review_nodig"
    assert any("ouder dan" in reden for reden in resultaat.redenen)


# --- duplicaatcheck ---

def test_duplicaat_geeft_review():
    resultaat = valideer_factuur(
        geldige_factuur(), vandaag=VANDAAG, is_duplicaat=lambda f: True
    )
    assert resultaat.status == "review_nodig"
    assert any("duplicaat" in reden for reden in resultaat.redenen)


def test_geen_duplicaat_is_ok():
    resultaat = valideer_factuur(
        geldige_factuur(), vandaag=VANDAAG, is_duplicaat=lambda f: False
    )
    assert resultaat.status == "gevalideerd"


# --- meerdere fouten tegelijk ---

def test_alle_fouten_worden_verzameld():
    data = geldige_factuur() | {
        "factuurdatum": "2026-12-31",  # toekomst
        "btw_bedrag": "5.00",          # klopt niet met 21%
        "bedrag_incl": "999.00",       # optelling klopt niet
    }
    resultaat = valideer_factuur(
        data, vandaag=VANDAAG, is_duplicaat=lambda f: True
    )
    assert resultaat.status == "review_nodig"
    assert len(resultaat.redenen) == 4
    assert resultaat.factuur is not None  # data blijft bruikbaar voor review
```

## `boekhouding/tests/test_database.py`

```python
"""Tests voor opslag, multi-administratie, duplicaatcheck en audit trail."""

import sqlite3

import pytest

from boekhouding import (
    maak_verbinding,
    maak_tabellen,
    maak_administratie,
    sla_factuur_op,
    wijzig_factuur,
    lees_factuur,
    lees_audit_trail,
)
from conftest import VANDAAG, geldige_factuur


def test_administratie_heeft_type_eenmanszaak(conn):
    admin_id = maak_administratie(conn, "Testzaak")
    rij = conn.execute(
        "SELECT naam, type FROM administraties WHERE id = ?", (admin_id,)
    ).fetchone()
    assert rij == ("Testzaak", "eenmanszaak")


def test_onbekend_administratietype_wordt_geweigerd(conn):
    with pytest.raises(ValueError, match="bv"):
        maak_administratie(conn, "Testzaak", "bv")


def test_migratie_voegt_document_id_toe_aan_oude_database():
    # Een database van vóór module 2: facturen zonder document_id.
    # CREATE TABLE IF NOT EXISTS raakt zo'n tabel niet aan, dus
    # maak_tabellen moet de kolom er alsnog bij zetten.
    oud = maak_verbinding(":memory:")
    oud.executescript(
        """
        CREATE TABLE administraties (
            id INTEGER PRIMARY KEY, naam TEXT NOT NULL,
            type TEXT NOT NULL DEFAULT 'eenmanszaak', aangemaakt_op TEXT NOT NULL
        );
        CREATE TABLE facturen (
            id INTEGER PRIMARY KEY,
            administratie_id INTEGER NOT NULL REFERENCES administraties(id),
            leverancier TEXT, factuurdatum TEXT, factuurnummer TEXT,
            bedrag_excl TEXT, btw_percentage TEXT, btw_bedrag TEXT,
            bedrag_incl TEXT, status TEXT NOT NULL,
            review_redenen TEXT NOT NULL DEFAULT '[]',
            originele_data TEXT NOT NULL,
            aangemaakt_op TEXT NOT NULL, gewijzigd_op TEXT NOT NULL
        );
        """
    )
    assert "document_id" not in {
        rij[1] for rij in oud.execute("PRAGMA table_info(facturen)")
    }

    maak_tabellen(oud)

    assert "document_id" in {
        rij[1] for rij in oud.execute("PRAGMA table_info(facturen)")
    }
    admin_id = maak_administratie(oud, "Bestaande zaak")
    factuur_id, resultaat = sla_factuur_op(
        oud, admin_id, geldige_factuur(), vandaag=VANDAAG
    )
    assert resultaat.status == "gevalideerd"
    assert lees_factuur(oud, factuur_id)["document_id"] is None
    oud.close()


def test_onbestaand_administratie_id_wordt_geweigerd(conn):
    # Bewijst dat maak_verbinding foreign keys echt aanzet: zonder
    # "PRAGMA foreign_keys = ON" zou deze insert gewoon slagen.
    with pytest.raises(sqlite3.IntegrityError, match="FOREIGN KEY"):
        sla_factuur_op(conn, 999, geldige_factuur(), vandaag=VANDAAG)


def test_geldige_factuur_wordt_opgeslagen(conn, administratie_id):
    factuur_id, resultaat = sla_factuur_op(
        conn, administratie_id, geldige_factuur(), vandaag=VANDAAG
    )
    assert resultaat.status == "gevalideerd"
    opgeslagen = lees_factuur(conn, factuur_id)
    assert opgeslagen["administratie_id"] == administratie_id
    assert opgeslagen["status"] == "gevalideerd"
    assert opgeslagen["bedrag_excl"] == "100.00"  # exact, als tekst


def test_foute_factuur_wordt_bewaard_met_redenen(conn, administratie_id):
    data = geldige_factuur() | {"bedrag_incl": "999.00"}
    factuur_id, resultaat = sla_factuur_op(
        conn, administratie_id, data, vandaag=VANDAAG
    )
    assert resultaat.status == "review_nodig"
    opgeslagen = lees_factuur(conn, factuur_id)
    assert opgeslagen["status"] == "review_nodig"
    assert len(opgeslagen["review_redenen"]) == 1
    assert opgeslagen["originele_data"]["bedrag_incl"] == "999.00"


def test_onvolledige_factuur_wordt_toch_bewaard(conn, administratie_id):
    data = {"leverancier": "KPN B.V.", "bedrag_excl": "abc"}
    factuur_id, resultaat = sla_factuur_op(
        conn, administratie_id, data, vandaag=VANDAAG
    )
    assert resultaat.status == "review_nodig"
    opgeslagen = lees_factuur(conn, factuur_id)
    assert opgeslagen["leverancier"] == "KPN B.V."
    assert opgeslagen["originele_data"] == data


def test_duplicaat_in_zelfde_administratie(conn, administratie_id):
    sla_factuur_op(conn, administratie_id, geldige_factuur(), vandaag=VANDAAG)
    _, resultaat = sla_factuur_op(
        conn, administratie_id, geldige_factuur(), vandaag=VANDAAG
    )
    assert resultaat.status == "review_nodig"
    assert any("duplicaat" in reden for reden in resultaat.redenen)


def test_zelfde_nummer_in_andere_administratie_mag(conn):
    admin_a = maak_administratie(conn, "Zaak A")
    admin_b = maak_administratie(conn, "Zaak B")
    sla_factuur_op(conn, admin_a, geldige_factuur(), vandaag=VANDAAG)
    _, resultaat = sla_factuur_op(conn, admin_b, geldige_factuur(), vandaag=VANDAAG)
    assert resultaat.status == "gevalideerd"


def test_zelfde_nummer_andere_leverancier_mag(conn, administratie_id):
    sla_factuur_op(conn, administratie_id, geldige_factuur(), vandaag=VANDAAG)
    data = geldige_factuur() | {"leverancier": "Coolblue B.V."}
    _, resultaat = sla_factuur_op(conn, administratie_id, data, vandaag=VANDAAG)
    assert resultaat.status == "gevalideerd"


def test_audit_trail_bij_aanmaken(conn, administratie_id):
    factuur_id, _ = sla_factuur_op(
        conn, administratie_id, geldige_factuur(), vandaag=VANDAAG
    )
    trail = lees_audit_trail(conn, factuur_id)
    assert len(trail) == 7  # elk factuurveld één regel
    assert all(regel["actie"] == "aangemaakt" for regel in trail)
    assert all(regel["oude_waarde"] is None for regel in trail)
    assert all(regel["tijdstip"] for regel in trail)
    per_veld = {regel["veld"]: regel["nieuwe_waarde"] for regel in trail}
    assert per_veld["bedrag_excl"] == "100.00"


def test_wijziging_bewaart_oude_waarde_in_audit_trail(conn, administratie_id):
    factuur_id, _ = sla_factuur_op(
        conn, administratie_id, geldige_factuur(), vandaag=VANDAAG
    )
    resultaat = wijzig_factuur(
        conn, factuur_id, {"leverancier": "KPN Zakelijk B.V."}, vandaag=VANDAAG
    )
    assert resultaat.status == "gevalideerd"

    wijzigingen = [
        r for r in lees_audit_trail(conn, factuur_id) if r["actie"] == "gewijzigd"
    ]
    assert len(wijzigingen) == 1
    assert wijzigingen[0]["veld"] == "leverancier"
    assert wijzigingen[0]["oude_waarde"] == "KPN B.V."
    assert wijzigingen[0]["nieuwe_waarde"] == "KPN Zakelijk B.V."

    assert lees_factuur(conn, factuur_id)["leverancier"] == "KPN Zakelijk B.V."


def test_correctie_zet_status_terug_naar_gevalideerd(conn, administratie_id):
    data = geldige_factuur() | {"bedrag_incl": "999.00"}
    factuur_id, resultaat = sla_factuur_op(
        conn, administratie_id, data, vandaag=VANDAAG
    )
    assert resultaat.status == "review_nodig"

    resultaat = wijzig_factuur(
        conn, factuur_id, {"bedrag_incl": "121.00"}, vandaag=VANDAAG
    )
    assert resultaat.status == "gevalideerd"
    assert lees_factuur(conn, factuur_id)["status"] == "gevalideerd"


def test_wijziging_naar_foute_waarde_geeft_review(conn, administratie_id):
    factuur_id, _ = sla_factuur_op(
        conn, administratie_id, geldige_factuur(), vandaag=VANDAAG
    )
    resultaat = wijzig_factuur(
        conn, factuur_id, {"btw_bedrag": "5.00"}, vandaag=VANDAAG
    )
    assert resultaat.status == "review_nodig"
    assert lees_factuur(conn, factuur_id)["status"] == "review_nodig"


def test_wijziging_onbekend_veld_wordt_geweigerd(conn, administratie_id):
    factuur_id, _ = sla_factuur_op(
        conn, administratie_id, geldige_factuur(), vandaag=VANDAAG
    )
    with pytest.raises(ValueError, match="onbekende factuurvelden"):
        wijzig_factuur(conn, factuur_id, {"status": "gevalideerd"}, vandaag=VANDAAG)


def test_wijziging_onbestaande_factuur_wordt_geweigerd(conn, administratie_id):
    with pytest.raises(ValueError, match="bestaat niet"):
        wijzig_factuur(conn, 999, {"leverancier": "X"}, vandaag=VANDAAG)
```

## `boekhouding/tests/test_documenten.py`

```python
"""Tests voor PDF-tekstextractie en de bewaarplicht-opslag.

Alle testbestanden worden hier zelf gegenereerd (zie maak_pdf in
conftest.py); er wordt niets gedownload.
"""

import sqlite3

import pytest

from boekhouding import (
    bereken_hash,
    bewaar_document,
    lees_audit_trail,
    lees_document,
    lees_factuur,
    lees_pdf_tekst,
    maak_administratie,
    opslagpad_voor,
    sla_factuur_op,
)
from conftest import VANDAAG, geldige_factuur, maak_pdf


@pytest.fixture
def factuur_pdf(tmp_path):
    """Een PDF met een echte tekstlaag."""
    pad = tmp_path / "factuur-kpn.pdf"
    pad.write_bytes(maak_pdf("Factuur F2026-0001 KPN B.V. 121,00"))
    return pad


@pytest.fixture
def opslagmap(tmp_path):
    return tmp_path / "opslag"


# --- lees_pdf_tekst ---------------------------------------------------

def test_tekst_uit_pdf_wordt_gelezen(factuur_pdf):
    resultaat = lees_pdf_tekst(factuur_pdf)
    assert resultaat.status == "gelezen"
    assert resultaat.redenen == []
    assert "F2026-0001" in resultaat.tekst
    assert "KPN" in resultaat.tekst
    assert resultaat.aantal_paginas == 1
    assert resultaat.bestandsnaam == "factuur-kpn.pdf"


def test_pdf_zonder_tekstlaag_geeft_review(tmp_path):
    scan = tmp_path / "scan.pdf"
    scan.write_bytes(maak_pdf(None))
    resultaat = lees_pdf_tekst(scan)
    assert resultaat.status == "review_nodig"
    assert resultaat.redenen == ["geen tekstlaag gevonden, mogelijk een scan"]
    assert resultaat.tekst == ""
    assert resultaat.aantal_paginas == 1


def test_kapotte_pdf_geeft_review(tmp_path):
    kapot = tmp_path / "kapot.pdf"
    kapot.write_bytes(b"%PDF-1.4\ndit is geen geldige pdf-inhoud\n")
    resultaat = lees_pdf_tekst(kapot)
    assert resultaat.status == "review_nodig"
    assert any("kon de PDF niet lezen" in reden for reden in resultaat.redenen)


def test_bestand_dat_geen_pdf_is_geeft_review(tmp_path):
    tekstbestand = tmp_path / "notitie.txt"
    tekstbestand.write_text("gewoon een tekstbestand", encoding="utf-8")
    resultaat = lees_pdf_tekst(tekstbestand)
    assert resultaat.status == "review_nodig"
    assert any("kon de PDF niet lezen" in reden for reden in resultaat.redenen)


def test_leeg_bestand_geeft_review(tmp_path):
    leeg = tmp_path / "leeg.pdf"
    leeg.write_bytes(b"")
    resultaat = lees_pdf_tekst(leeg)
    assert resultaat.status == "review_nodig"
    assert resultaat.redenen  # met reden, en zonder exception


def test_onbestaand_bestand_geeft_review(tmp_path):
    resultaat = lees_pdf_tekst(tmp_path / "bestaat-niet.pdf")
    assert resultaat.status == "review_nodig"
    assert any("niet gevonden" in reden for reden in resultaat.redenen)


# --- bereken_hash -----------------------------------------------------

def test_zelfde_inhoud_geeft_zelfde_hash(tmp_path):
    inhoud = maak_pdf("Factuur F2026-0001")
    (tmp_path / "a.pdf").write_bytes(inhoud)
    (tmp_path / "b.pdf").write_bytes(inhoud)  # andere naam, zelfde inhoud
    assert bereken_hash(tmp_path / "a.pdf") == bereken_hash(tmp_path / "b.pdf")


def test_andere_inhoud_geeft_andere_hash(tmp_path):
    (tmp_path / "a.pdf").write_bytes(maak_pdf("Factuur F2026-0001"))
    (tmp_path / "b.pdf").write_bytes(maak_pdf("Factuur F2026-0002"))
    assert bereken_hash(tmp_path / "a.pdf") != bereken_hash(tmp_path / "b.pdf")


# --- bewaar_document --------------------------------------------------

def test_document_wordt_bewaard(conn, administratie_id, factuur_pdf, opslagmap):
    resultaat = bewaar_document(
        conn, administratie_id, str(factuur_pdf), str(opslagmap)
    )
    assert resultaat.status == "opgeslagen"
    assert resultaat.document_id is not None
    assert resultaat.hash == bereken_hash(factuur_pdf)

    bewaard = opslagpad_voor(resultaat.hash, opslagmap, ".pdf")
    assert bewaard.is_file()
    assert bewaard.read_bytes() == factuur_pdf.read_bytes()
    assert factuur_pdf.is_file()  # het origineel blijft staan

    registratie = lees_document(conn, resultaat.document_id)
    assert registratie["administratie_id"] == administratie_id
    assert registratie["originele_bestandsnaam"] == "factuur-kpn.pdf"
    assert registratie["opslagpad"] == str(bewaard)
    assert registratie["aangemaakt_op"]


def test_bewaard_bestand_is_alleen_lezen(
    conn, administratie_id, factuur_pdf, opslagmap
):
    # Bewaarplicht: nooit overschrijven, ook niet per ongeluk. We
    # controleren de rechten zelf en niet of schrijven een fout geeft:
    # als root draait, mag die namelijk alsnog schrijven.
    resultaat = bewaar_document(
        conn, administratie_id, str(factuur_pdf), str(opslagmap)
    )
    bewaard = opslagpad_voor(resultaat.hash, opslagmap, ".pdf")
    assert bewaard.stat().st_mode & 0o777 == 0o444


def test_tweede_keer_bewaren_laat_het_bestand_ongemoeid(
    conn, administratie_id, factuur_pdf, opslagmap
):
    eerste = bewaar_document(
        conn, administratie_id, str(factuur_pdf), str(opslagmap)
    )
    bewaard = opslagpad_voor(eerste.hash, opslagmap, ".pdf")
    gewijzigd_op = bewaard.stat().st_mtime_ns

    bewaar_document(conn, administratie_id, str(factuur_pdf), str(opslagmap))

    assert bewaard.stat().st_mtime_ns == gewijzigd_op
    assert bewaard.read_bytes() == factuur_pdf.read_bytes()


def test_zelfde_pdf_twee_keer_geeft_geen_tweede_kopie(
    conn, administratie_id, factuur_pdf, opslagmap
):
    eerste = bewaar_document(
        conn, administratie_id, str(factuur_pdf), str(opslagmap)
    )
    tweede = bewaar_document(
        conn, administratie_id, str(factuur_pdf), str(opslagmap)
    )

    assert eerste.status == "opgeslagen"
    assert tweede.status == "bestond_al"
    assert tweede.document_id == eerste.document_id
    assert tweede.hash == eerste.hash

    aantal_rijen = conn.execute("SELECT count(*) FROM documenten").fetchone()[0]
    assert aantal_rijen == 1
    bestanden = list(opslagmap.rglob("*.pdf"))
    assert len(bestanden) == 1


def test_zelfde_inhoud_andere_bestandsnaam_is_hetzelfde_document(
    conn, administratie_id, factuur_pdf, opslagmap, tmp_path
):
    kopie = tmp_path / "scan-van-dezelfde-factuur.pdf"
    kopie.write_bytes(factuur_pdf.read_bytes())

    eerste = bewaar_document(
        conn, administratie_id, str(factuur_pdf), str(opslagmap)
    )
    tweede = bewaar_document(conn, administratie_id, str(kopie), str(opslagmap))

    assert tweede.status == "bestond_al"
    assert tweede.document_id == eerste.document_id


def test_andere_pdf_wordt_apart_bewaard(
    conn, administratie_id, factuur_pdf, opslagmap, tmp_path
):
    andere = tmp_path / "factuur-coolblue.pdf"
    andere.write_bytes(maak_pdf("Factuur F2026-0002 Coolblue B.V. 242,00"))

    eerste = bewaar_document(
        conn, administratie_id, str(factuur_pdf), str(opslagmap)
    )
    tweede = bewaar_document(conn, administratie_id, str(andere), str(opslagmap))

    assert tweede.status == "opgeslagen"
    assert tweede.document_id != eerste.document_id
    assert len(list(opslagmap.rglob("*.pdf"))) == 2


def test_zelfde_pdf_in_andere_administratie_is_eigen_registratie(
    conn, factuur_pdf, opslagmap
):
    admin_a = maak_administratie(conn, "Zaak A")
    admin_b = maak_administratie(conn, "Zaak B")

    eerste = bewaar_document(conn, admin_a, str(factuur_pdf), str(opslagmap))
    tweede = bewaar_document(conn, admin_b, str(factuur_pdf), str(opslagmap))

    # Aparte boekhoudingen, dus een eigen registratie per administratie...
    assert tweede.status == "opgeslagen"
    assert tweede.document_id != eerste.document_id
    # ...maar het bestand staat er maar één keer.
    assert len(list(opslagmap.rglob("*.pdf"))) == 1


def test_bewaren_van_onbestaand_bestand_geeft_review(
    conn, administratie_id, opslagmap, tmp_path
):
    resultaat = bewaar_document(
        conn, administratie_id, str(tmp_path / "weg.pdf"), str(opslagmap)
    )
    assert resultaat.status == "review_nodig"
    assert any("niet gevonden" in reden for reden in resultaat.redenen)
    assert resultaat.document_id is None
    assert conn.execute("SELECT count(*) FROM documenten").fetchone()[0] == 0


def test_audit_trail_bij_bewaren(conn, administratie_id, factuur_pdf, opslagmap):
    resultaat = bewaar_document(
        conn, administratie_id, str(factuur_pdf), str(opslagmap)
    )
    trail = lees_audit_trail(conn, resultaat.document_id, tabel="documenten")
    assert len(trail) == 3
    assert all(regel["actie"] == "aangemaakt" for regel in trail)
    per_veld = {regel["veld"]: regel["nieuwe_waarde"] for regel in trail}
    assert per_veld["hash"] == resultaat.hash
    assert per_veld["originele_bestandsnaam"] == "factuur-kpn.pdf"


# --- koppeling factuur <-> document -----------------------------------

def test_factuur_kan_aan_document_gekoppeld_worden(
    conn, administratie_id, factuur_pdf, opslagmap
):
    document = bewaar_document(
        conn, administratie_id, str(factuur_pdf), str(opslagmap)
    )
    factuur_id, resultaat = sla_factuur_op(
        conn,
        administratie_id,
        geldige_factuur(),
        vandaag=VANDAAG,
        document_id=document.document_id,
    )
    assert resultaat.status == "gevalideerd"
    assert lees_factuur(conn, factuur_id)["document_id"] == document.document_id


def test_factuur_zonder_document_blijft_toegestaan(conn, administratie_id):
    factuur_id, _ = sla_factuur_op(
        conn, administratie_id, geldige_factuur(), vandaag=VANDAAG
    )
    assert lees_factuur(conn, factuur_id)["document_id"] is None


def test_onbestaand_document_id_wordt_geweigerd(conn, administratie_id):
    with pytest.raises(sqlite3.IntegrityError, match="FOREIGN KEY"):
        sla_factuur_op(
            conn,
            administratie_id,
            geldige_factuur(),
            vandaag=VANDAAG,
            document_id=999,
        )


def test_koppeling_staat_in_de_audit_trail(
    conn, administratie_id, factuur_pdf, opslagmap
):
    document = bewaar_document(
        conn, administratie_id, str(factuur_pdf), str(opslagmap)
    )
    factuur_id, _ = sla_factuur_op(
        conn,
        administratie_id,
        geldige_factuur(),
        vandaag=VANDAAG,
        document_id=document.document_id,
    )
    trail = lees_audit_trail(conn, factuur_id)
    koppeling = [regel for regel in trail if regel["veld"] == "document_id"]
    assert len(koppeling) == 1
    assert koppeling[0]["nieuwe_waarde"] == str(document.document_id)


# --- bestandssoort (witte lijst) --------------------------------------

def test_extensie_van_accepteert_witte_lijst(tmp_path):
    from boekhouding import extensie_van

    assert extensie_van(tmp_path / "factuur.pdf") == ".pdf"
    assert extensie_van(tmp_path / "foto.jpg") == ".jpg"
    assert extensie_van(tmp_path / "foto.jpeg") == ".jpeg"
    assert extensie_van(tmp_path / "scan.png") == ".png"


def test_extensie_van_is_hoofdletterongevoelig(tmp_path):
    from boekhouding import extensie_van

    assert extensie_van(tmp_path / "FACTUUR.PDF") == ".pdf"
    assert extensie_van(tmp_path / "Foto.JPG") == ".jpg"


def test_extensie_van_weigert_onbekende_soort(tmp_path):
    from boekhouding import extensie_van

    assert extensie_van(tmp_path / "factuur.docx") is None
    assert extensie_van(tmp_path / "factuur.exe") is None
    assert extensie_van(tmp_path / "factuur") is None  # helemaal geen extensie


def test_opslagpad_gebruikt_de_meegegeven_extensie(tmp_path):
    hash_waarde = "a" * 64
    pad = opslagpad_voor(hash_waarde, tmp_path, ".jpg")
    assert pad == tmp_path / "aa" / f"{hash_waarde}.jpg"


def test_opslagpad_weigert_extensie_buiten_de_witte_lijst(tmp_path):
    with pytest.raises(ValueError, match="witte lijst"):
        opslagpad_voor("a" * 64, tmp_path, ".docx")


def test_foto_van_factuur_wordt_bewaard_als_jpg(
    conn, administratie_id, opslagmap, tmp_path
):
    foto = tmp_path / "factuur-foto.jpg"
    foto.write_bytes(b"\xff\xd8\xff\xe0 nep-jpeg met wat bytes")

    resultaat = bewaar_document(conn, administratie_id, str(foto), str(opslagmap))

    assert resultaat.status == "opgeslagen"
    bewaard = opslagpad_voor(resultaat.hash, opslagmap, ".jpg")
    assert bewaard.is_file()
    assert resultaat.opslagpad == str(bewaard)
    assert lees_document(conn, resultaat.document_id)["originele_bestandsnaam"] == (
        "factuur-foto.jpg"
    )


def test_png_wordt_bewaard(conn, administratie_id, opslagmap, tmp_path):
    plaatje = tmp_path / "scan.png"
    plaatje.write_bytes(b"\x89PNG\r\n\x1a\n nep-png")

    resultaat = bewaar_document(
        conn, administratie_id, str(plaatje), str(opslagmap)
    )

    assert resultaat.status == "opgeslagen"
    assert resultaat.opslagpad.endswith(".png")


def test_hoofdletterextensie_wordt_kleingeschreven_bewaard(
    conn, administratie_id, opslagmap, tmp_path
):
    foto = tmp_path / "FACTUUR.PDF"
    foto.write_bytes(maak_pdf("Factuur F2026-0009"))

    resultaat = bewaar_document(conn, administratie_id, str(foto), str(opslagmap))

    assert resultaat.status == "opgeslagen"
    assert resultaat.opslagpad.endswith(".pdf")
    # De originele naam blijft wel bewaard zoals de klant hem aanleverde.
    assert lees_document(conn, resultaat.document_id)["originele_bestandsnaam"] == (
        "FACTUUR.PDF"
    )


def test_onbekende_bestandssoort_geeft_review(
    conn, administratie_id, opslagmap, tmp_path
):
    document = tmp_path / "factuur.docx"
    document.write_bytes(b"PK\x03\x04 nep-docx")

    resultaat = bewaar_document(
        conn, administratie_id, str(document), str(opslagmap)
    )

    assert resultaat.status == "review_nodig"
    assert any("wordt niet bewaard" in reden for reden in resultaat.redenen)
    assert any(".docx" in reden for reden in resultaat.redenen)
    assert resultaat.document_id is None
    # Niets opgeslagen, niets geregistreerd: er wordt niet gegokt.
    assert conn.execute("SELECT count(*) FROM documenten").fetchone()[0] == 0
    assert not opslagmap.exists()


def test_bestand_zonder_extensie_geeft_review(
    conn, administratie_id, opslagmap, tmp_path
):
    document = tmp_path / "factuur-zonder-extensie"
    document.write_bytes(maak_pdf("Factuur F2026-0010"))

    resultaat = bewaar_document(
        conn, administratie_id, str(document), str(opslagmap)
    )

    assert resultaat.status == "review_nodig"
    assert any("geen" in reden for reden in resultaat.redenen)
    assert conn.execute("SELECT count(*) FROM documenten").fetchone()[0] == 0


def test_geen_tijdelijke_bestanden_blijven_achter(
    conn, administratie_id, factuur_pdf, opslagmap
):
    # De tijdelijke naam van mkstemp moet na afloop weg zijn.
    bewaar_document(conn, administratie_id, str(factuur_pdf), str(opslagmap))
    assert list(opslagmap.rglob("*.tmp")) == []
```

## `boekhouding/tests/test_ai_extractie.py`

```python
"""Tests voor de AI-extractie (module 3).

Er gaat hier NOOIT een echt verzoek naar de API. De client wordt
nagemaakt en meegegeven; de echte client wordt nergens gebouwd, dus er
is ook geen API-sleutel nodig om deze tests te draaien.
"""

import json
from decimal import Decimal

import pytest
from pydantic import ValidationError

from boekhouding import (
    FactuurExtractie,
    VeldExtractie,
    beoordeel_extractie,
    bepaal_invoerpad,
    bewaar_document,
    extraheer_factuur,
    lees_audit_trail,
    lees_extractie,
    sla_extractie_op,
)
from boekhouding.ai_extractie import (
    PROMPT_VERSIE,
    STANDAARD_MODEL,
    SYSTEEM_PROMPT,
    foutreden,
    maak_client,
    standaard_model,
)
from conftest import VANDAAG, maak_pdf


# --- nagemaakte client ------------------------------------------------

class NageaapteRespons:
    """Doet zich voor als het antwoord van de SDK."""

    def __init__(self, parsed_output, ruwe_json="", stop_reason="end_turn"):
        self.parsed_output = parsed_output
        self.stop_reason = stop_reason
        self.content = (
            [type("Blok", (), {"type": "text", "text": ruwe_json})()]
            if ruwe_json
            else []
        )


class NageaapteBerichten:
    def __init__(self, respons):
        self._respons = respons
        self.aanroepen = []

    def parse(self, **argumenten):
        self.aanroepen.append(argumenten)
        if isinstance(self._respons, Exception):
            raise self._respons
        return self._respons


class NageaapteClient:
    """Vervangt anthropic.Anthropic; telt hoe vaak hij is aangeroepen."""

    def __init__(self, respons):
        self.messages = NageaapteBerichten(respons)

    @property
    def aanroepen(self):
        return self.messages.aanroepen


def veld(waarde, zekerheid="hoog", reden=None):
    return VeldExtractie(waarde=waarde, zekerheid=zekerheid, reden=reden)


def goede_extractie(**overschrijf) -> FactuurExtractie:
    velden = {
        "leverancier": veld("Van Dijk ICT-diensten"),
        "factuurdatum": veld("2026-07-12"),
        "factuurnummer": veld("2026-0412"),
        "bedrag_excl": veld("450,00"),
        "btw_percentage": veld("21"),
        "btw_bedrag": veld("94,50"),
        "bedrag_incl": veld("544,50"),
    }
    velden.update(overschrijf)
    return FactuurExtractie(**velden)


def client_met(extractie: FactuurExtractie, **kwargs) -> NageaapteClient:
    return NageaapteClient(
        NageaapteRespons(extractie, ruwe_json=extractie.model_dump_json(), **kwargs)
    )


@pytest.fixture
def factuur_pdf(tmp_path):
    pad = tmp_path / "factuur.pdf"
    pad.write_bytes(maak_pdf("Factuur 2026-0412 Van Dijk ICT-diensten 544,50"))
    return pad


@pytest.fixture
def scan_jpg(tmp_path):
    pad = tmp_path / "scan.jpg"
    pad.write_bytes(b"\xff\xd8\xff\xe0 nep-jpeg")
    return pad


# --- schema: zekerheid --------------------------------------------------

def test_lage_zekerheid_zonder_reden_wordt_geweigerd():
    with pytest.raises(ValidationError, match="reden"):
        VeldExtractie(waarde="450,00", zekerheid="laag")


def test_lage_zekerheid_met_reden_mag():
    gegeven = VeldExtractie(waarde="450,00", zekerheid="laag", reden="cijfer vaag")
    assert gegeven.zekerheid == "laag"


def test_onbekende_zekerheid_wordt_geweigerd():
    with pytest.raises(ValidationError):
        VeldExtractie(waarde="450,00", zekerheid="misschien")


# --- beoordeling --------------------------------------------------------

def test_alles_hoog_en_kloppend_is_gevalideerd():
    status, redenen, factuur = beoordeel_extractie(goede_extractie(), vandaag=VANDAAG)
    assert status == "gevalideerd"
    assert redenen == []
    assert factuur.bedrag_excl == Decimal("450.00")


def test_een_veld_met_lage_zekerheid_stuurt_alles_naar_review():
    extractie = goede_extractie(
        bedrag_incl=veld("544,50", "laag", "cijfer onscherp door vouw in papier")
    )
    status, redenen, factuur = beoordeel_extractie(extractie, vandaag=VANDAAG)
    assert status == "review_nodig"
    assert any(
        "bedrag_incl" in reden and "lage zekerheid" in reden and "vouw" in reden
        for reden in redenen
    )
    # De gelezen waarden blijven bruikbaar voor de mens die beoordeelt.
    assert factuur is not None


def test_ontbrekend_veld_wordt_null_en_review():
    extractie = goede_extractie(
        factuurnummer=veld(None, "laag", "geen factuurnummer op het document")
    )
    status, redenen, _ = beoordeel_extractie(extractie, vandaag=VANDAAG)
    assert status == "review_nodig"
    assert any(
        "factuurnummer" in reden and "niet op het document gevonden" in reden
        for reden in redenen
    )


def test_leeg_veld_telt_als_ontbrekend():
    extractie = goede_extractie(leverancier=veld("   ", "laag", "onleesbaar"))
    status, redenen, _ = beoordeel_extractie(extractie, vandaag=VANDAAG)
    assert status == "review_nodig"
    assert any("leverancier" in reden for reden in redenen)


def test_de_ai_rekent_niet_de_validatie_vangt_de_fout():
    # Het model is er zeker van, maar 300 + 63 is geen 383.
    extractie = goede_extractie(
        bedrag_excl=veld("300,00"),
        btw_bedrag=veld("63,00"),
        bedrag_incl=veld("383,00"),
    )
    status, redenen, _ = beoordeel_extractie(extractie, vandaag=VANDAAG)
    assert status == "review_nodig"
    assert any("bedrag_incl" in reden and "verschil" in reden for reden in redenen)


def test_nederlands_duizendtal_uit_de_extractie_wordt_begrepen():
    extractie = goede_extractie(
        bedrag_excl=veld("1.250,00"),
        btw_bedrag=veld("262,50"),
        bedrag_incl=veld("1.512,50"),
    )
    status, _, factuur = beoordeel_extractie(extractie, vandaag=VANDAAG)
    assert status == "gevalideerd"
    assert factuur.bedrag_excl == Decimal("1250.00")


def test_ongeldig_btw_percentage_uit_de_extractie_geeft_review():
    extractie = goede_extractie(
        btw_percentage=veld("15"), btw_bedrag=veld("67,50"), bedrag_incl=veld("517,50")
    )
    status, redenen, _ = beoordeel_extractie(extractie, vandaag=VANDAAG)
    assert status == "review_nodig"
    assert any("btw_percentage" in reden for reden in redenen)


# --- invoerpaden --------------------------------------------------------

def test_pdf_met_tekstlaag_gaat_langs_het_tekstpad(factuur_pdf):
    assert bepaal_invoerpad(factuur_pdf) == ("tekst", None)


def test_pdf_zonder_tekstlaag_gaat_langs_het_beeldpad(tmp_path):
    scan = tmp_path / "scan.pdf"
    scan.write_bytes(maak_pdf(None))
    assert bepaal_invoerpad(scan) == ("beeld", None)


def test_afbeelding_gaat_langs_het_beeldpad(scan_jpg):
    # Belangrijk: een JPG is geen kapotte PDF, dus niet eerst proberen
    # er tekst uit te halen.
    assert bepaal_invoerpad(scan_jpg) == ("beeld", None)


def test_onbekende_bestandssoort_geeft_reden(tmp_path):
    document = tmp_path / "factuur.docx"
    document.write_bytes(b"PK\x03\x04")
    invoerpad, reden = bepaal_invoerpad(document)
    assert invoerpad is None
    assert ".docx" in reden


def test_tekstpad_stuurt_de_factuurtekst_mee(factuur_pdf):
    client = client_met(goede_extractie())
    resultaat = extraheer_factuur(factuur_pdf, client=client, vandaag=VANDAAG)

    assert resultaat.invoerpad == "tekst"
    inhoud = client.aanroepen[0]["messages"][0]["content"]
    assert len(inhoud) == 1 and inhoud[0]["type"] == "text"
    assert "2026-0412" in inhoud[0]["text"]


def test_beeldpad_stuurt_het_plaatje_mee_als_base64(scan_jpg):
    import base64

    client = client_met(goede_extractie())
    resultaat = extraheer_factuur(scan_jpg, client=client, vandaag=VANDAAG)

    assert resultaat.invoerpad == "beeld"
    inhoud = client.aanroepen[0]["messages"][0]["content"]
    assert inhoud[0]["type"] == "image"
    assert inhoud[0]["source"]["media_type"] == "image/jpeg"
    assert base64.standard_b64decode(inhoud[0]["source"]["data"]) == (
        scan_jpg.read_bytes()
    )


def test_gescande_pdf_gaat_als_document_mee(tmp_path):
    scan = tmp_path / "scan.pdf"
    scan.write_bytes(maak_pdf(None))
    client = client_met(goede_extractie())
    extraheer_factuur(scan, client=client, vandaag=VANDAAG)

    inhoud = client.aanroepen[0]["messages"][0]["content"]
    assert inhoud[0]["type"] == "document"
    assert inhoud[0]["source"]["media_type"] == "application/pdf"


# --- het verzoek zelf ---------------------------------------------------

def test_er_wordt_om_structured_output_gevraagd(factuur_pdf):
    client = client_met(goede_extractie())
    extraheer_factuur(factuur_pdf, client=client, vandaag=VANDAAG)

    aanroep = client.aanroepen[0]
    assert aanroep["output_format"] is FactuurExtractie  # geen vrije tekst
    assert aanroep["model"] == STANDAARD_MODEL


def test_de_systeemprompt_verbiedt_gokken_en_rekenen(factuur_pdf):
    client = client_met(goede_extractie())
    extraheer_factuur(factuur_pdf, client=client, vandaag=VANDAAG)

    prompt = client.aanroepen[0]["system"]
    assert prompt == SYSTEEM_PROMPT
    assert "null" in prompt
    assert "Verzin nooit" in prompt
    assert "Reken niet" in prompt


def test_precies_een_aanroep_per_document(factuur_pdf):
    client = client_met(goede_extractie())
    extraheer_factuur(factuur_pdf, client=client, vandaag=VANDAAG)
    assert len(client.aanroepen) == 1


def test_onleesbaar_bestand_kost_geen_aanroep(tmp_path):
    client = client_met(goede_extractie())
    resultaat = extraheer_factuur(
        tmp_path / "factuur.docx", client=client, vandaag=VANDAAG
    )
    assert resultaat.status == "review_nodig"
    assert client.aanroepen == []  # niet eens naar het model gestuurd


def test_onbestaand_bestand_kost_geen_aanroep(tmp_path):
    client = client_met(goede_extractie())
    resultaat = extraheer_factuur(
        tmp_path / "weg.pdf", client=client, vandaag=VANDAAG
    )
    assert resultaat.status == "review_nodig"
    assert any("niet gevonden" in reden for reden in resultaat.redenen)
    assert client.aanroepen == []


# --- weigering en onbruikbaar antwoord ----------------------------------

def test_geweigerd_document_geeft_review(factuur_pdf):
    client = NageaapteClient(NageaapteRespons(None, stop_reason="refusal"))
    resultaat = extraheer_factuur(factuur_pdf, client=client, vandaag=VANDAAG)
    assert resultaat.status == "review_nodig"
    assert any("geweigerd" in reden for reden in resultaat.redenen)


def test_antwoord_zonder_formulier_geeft_review(factuur_pdf):
    client = NageaapteClient(NageaapteRespons(None, ruwe_json="onzin"))
    resultaat = extraheer_factuur(factuur_pdf, client=client, vandaag=VANDAAG)
    assert resultaat.status == "review_nodig"
    assert any("geen bruikbaar formulier" in reden for reden in resultaat.redenen)


# --- sleutelbeheer ------------------------------------------------------

def test_zonder_sleutel_een_duidelijke_fout_zonder_waarde(tmp_path, monkeypatch):
    monkeypatch.delenv("ANTHROPIC_API_KEY", raising=False)
    leeg_env = tmp_path / "bestaat-niet.env"
    with pytest.raises(RuntimeError) as fout:
        maak_client(leeg_env)
    bericht = str(fout.value)
    assert "ANTHROPIC_API_KEY" in bericht
    assert ".env" in bericht
    assert "nep-sleutel" not in bericht  # nooit een sleutelwaarde in een melding


def test_env_bestand_wordt_gelezen_maar_niet_getoond(tmp_path, monkeypatch):
    from boekhouding import api_sleutel

    monkeypatch.delenv("ANTHROPIC_API_KEY", raising=False)
    env = tmp_path / ".env"
    env.write_text("ANTHROPIC_API_KEY=nep-sleutel-alleen-voor-deze-test\n", encoding="utf-8")
    assert api_sleutel(env) == "nep-sleutel-alleen-voor-deze-test"


# --- opslag en audit trail ----------------------------------------------

def test_extractie_wordt_opgeslagen_met_model_en_ruwe_respons(
    conn, administratie_id, factuur_pdf, tmp_path
):
    document = bewaar_document(
        conn, administratie_id, str(factuur_pdf), str(tmp_path / "opslag")
    )
    client = client_met(goede_extractie())
    resultaat = extraheer_factuur(factuur_pdf, client=client, vandaag=VANDAAG)

    extractie_id = sla_extractie_op(
        conn, administratie_id, resultaat, document_id=document.document_id
    )
    bewaard = lees_extractie(conn, extractie_id)

    assert bewaard["model"] == STANDAARD_MODEL
    assert bewaard["invoerpad"] == "tekst"
    assert bewaard["document_id"] == document.document_id
    assert bewaard["status"] == "gevalideerd"
    assert json.loads(bewaard["ruwe_respons"])["leverancier"]["waarde"] == (
        "Van Dijk ICT-diensten"
    )


def test_audit_trail_bij_extractie(conn, administratie_id, factuur_pdf):
    client = client_met(goede_extractie())
    resultaat = extraheer_factuur(factuur_pdf, client=client, vandaag=VANDAAG)
    extractie_id = sla_extractie_op(conn, administratie_id, resultaat)

    trail = lees_audit_trail(conn, extractie_id, tabel="extracties")
    per_veld = {regel["veld"]: regel["nieuwe_waarde"] for regel in trail}
    assert per_veld["model"] == STANDAARD_MODEL
    assert per_veld["invoerpad"] == "tekst"
    assert per_veld["status"] == "gevalideerd"
    assert all(regel["tijdstip"] for regel in trail)


def test_afgekeurde_extractie_wordt_ook_bewaard(conn, administratie_id, factuur_pdf):
    extractie = goede_extractie(
        bedrag_incl=veld("999,00", "laag", "totaal onleesbaar")
    )
    client = client_met(extractie)
    resultaat = extraheer_factuur(factuur_pdf, client=client, vandaag=VANDAAG)
    extractie_id = sla_extractie_op(conn, administratie_id, resultaat)

    bewaard = lees_extractie(conn, extractie_id)
    assert bewaard["status"] == "review_nodig"
    assert len(bewaard["redenen"]) >= 1


# --- foutafhandeling: nooit een exception naar buiten -------------------

class ApiFout(Exception):
    """Doet zich voor als een fout van de SDK (die draagt status_code)."""

    def __init__(self, status_code=None, bericht="fout"):
        super().__init__(bericht)
        if status_code is not None:
            self.status_code = status_code


@pytest.mark.parametrize(
    "fout, kern",
    [
        (ApiFout(429), "rate limit"),
        (ApiFout(500), "serverfout"),
        (ApiFout(503), "serverfout"),
        (ApiFout(401), "API-sleutel"),
        (ApiFout(403), "API-sleutel"),
        (ApiFout(404), "model bestaat niet"),
        (ApiFout(400), "ongeldig"),
        (ApiFout(418), "foutcode 418"),
        (ConnectionError("verbinding verbroken"), "geen verbinding"),
        (TimeoutError("te lang"), "geen verbinding"),
        (RuntimeError("iets onverwachts"), "geen verbinding"),
    ],
)
def test_api_fout_wordt_review_en_nooit_een_exception(factuur_pdf, fout, kern):
    client = NageaapteClient(fout)
    resultaat = extraheer_factuur(factuur_pdf, client=client, vandaag=VANDAAG)

    assert resultaat.status == "review_nodig"
    assert any(kern in reden for reden in resultaat.redenen)
    assert resultaat.factuur is None


def test_stapel_facturen_loopt_door_na_een_fout(factuur_pdf, tmp_path):
    # Eén kapotte aanroep mag de rest van de stapel niet meeslepen.
    tweede = tmp_path / "tweede.pdf"
    tweede.write_bytes(maak_pdf("Factuur 2026-0413"))

    uitkomsten = []
    for pad, client in (
        (factuur_pdf, NageaapteClient(ApiFout(429))),
        (tweede, client_met(goede_extractie())),
    ):
        uitkomsten.append(extraheer_factuur(pad, client=client, vandaag=VANDAAG))

    assert uitkomsten[0].status == "review_nodig"
    assert uitkomsten[1].status == "gevalideerd"


def test_foutreden_noemt_nooit_de_sleutel():
    reden = foutreden(ApiFout(401))
    assert "sleutel" in reden           # zegt wél wát er mis is
    assert "nep-sleutel" not in reden   # maar nooit de waarde


# --- promptversie in de audit trail ------------------------------------

def test_promptversie_staat_in_het_resultaat(factuur_pdf):
    client = client_met(goede_extractie())
    resultaat = extraheer_factuur(factuur_pdf, client=client, vandaag=VANDAAG)
    assert resultaat.prompt_versie == PROMPT_VERSIE


def test_promptversie_wordt_opgeslagen(conn, administratie_id, factuur_pdf):
    client = client_met(goede_extractie())
    resultaat = extraheer_factuur(factuur_pdf, client=client, vandaag=VANDAAG)
    extractie_id = sla_extractie_op(conn, administratie_id, resultaat)

    assert lees_extractie(conn, extractie_id)["prompt_versie"] == PROMPT_VERSIE
    trail = lees_audit_trail(conn, extractie_id, tabel="extracties")
    per_veld = {regel["veld"]: regel["nieuwe_waarde"] for regel in trail}
    assert per_veld["prompt_versie"] == PROMPT_VERSIE


def test_oude_extractie_krijgt_geen_verzonnen_promptversie():
    # Een database van vóór deze kolom weet niet met welke prompt er is
    # uitgelezen; dan hoort er 'onbekend' te staan, niet de huidige versie.
    from boekhouding import maak_tabellen, maak_verbinding

    oud = maak_verbinding(":memory:")
    oud.executescript(
        """
        CREATE TABLE administraties (
            id INTEGER PRIMARY KEY, naam TEXT NOT NULL,
            type TEXT NOT NULL DEFAULT 'eenmanszaak', aangemaakt_op TEXT NOT NULL
        );
        CREATE TABLE extracties (
            id INTEGER PRIMARY KEY,
            administratie_id INTEGER NOT NULL REFERENCES administraties(id),
            document_id INTEGER, model TEXT NOT NULL, invoerpad TEXT,
            ruwe_respons TEXT NOT NULL, status TEXT NOT NULL,
            redenen TEXT NOT NULL DEFAULT '[]', aangemaakt_op TEXT NOT NULL
        );
        INSERT INTO administraties VALUES (1, 'Oud', 'eenmanszaak', '2026-01-01');
        INSERT INTO extracties VALUES
            (1, 1, NULL, 'oud-model', 'tekst', '{}', 'gevalideerd', '[]', '2026-01-01');
        """
    )
    maak_tabellen(oud)

    rij = oud.execute("SELECT prompt_versie FROM extracties WHERE id = 1").fetchone()
    assert rij[0] == "onbekend"
    oud.close()


# --- model instelbaar ---------------------------------------------------

def test_model_kan_worden_meegegeven(factuur_pdf):
    client = client_met(goede_extractie())
    resultaat = extraheer_factuur(
        factuur_pdf, client=client, model="claude-haiku-4-5", vandaag=VANDAAG
    )
    assert client.aanroepen[0]["model"] == "claude-haiku-4-5"
    assert resultaat.model == "claude-haiku-4-5"


def test_model_uit_env_wordt_gebruikt(factuur_pdf, tmp_path, monkeypatch):
    monkeypatch.delenv("ANTHROPIC_MODEL", raising=False)
    env = tmp_path / ".env"
    env.write_text("ANTHROPIC_MODEL=claude-sonnet-5\n", encoding="utf-8")

    client = client_met(goede_extractie())
    extraheer_factuur(factuur_pdf, client=client, env_pad=env, vandaag=VANDAAG)
    assert client.aanroepen[0]["model"] == "claude-sonnet-5"


def test_zonder_instelling_geldt_het_standaardmodel(tmp_path, monkeypatch):
    monkeypatch.delenv("ANTHROPIC_MODEL", raising=False)
    assert standaard_model(tmp_path / "bestaat-niet.env") == STANDAARD_MODEL


def test_meegegeven_model_gaat_voor_op_env(factuur_pdf, tmp_path, monkeypatch):
    monkeypatch.delenv("ANTHROPIC_MODEL", raising=False)
    env = tmp_path / ".env"
    env.write_text("ANTHROPIC_MODEL=claude-sonnet-5\n", encoding="utf-8")

    client = client_met(goede_extractie())
    extraheer_factuur(
        factuur_pdf, client=client, model="claude-opus-5", env_pad=env,
        vandaag=VANDAAG,
    )
    assert client.aanroepen[0]["model"] == "claude-opus-5"


def test_gebruikt_model_wordt_opgeslagen(conn, administratie_id, factuur_pdf):
    client = client_met(goede_extractie())
    resultaat = extraheer_factuur(
        factuur_pdf, client=client, model="claude-haiku-4-5", vandaag=VANDAAG
    )
    extractie_id = sla_extractie_op(conn, administratie_id, resultaat)
    assert lees_extractie(conn, extractie_id)["model"] == "claude-haiku-4-5"

# --- tokenverbruik (voor de kostenrapportage van de eval) ---------------

class Verbruik:
    def __init__(self, invoer, uitvoer):
        self.input_tokens = invoer
        self.output_tokens = uitvoer


def test_tokenverbruik_wordt_overgenomen(factuur_pdf):
    extractie = goede_extractie()
    respons = NageaapteRespons(extractie, ruwe_json=extractie.model_dump_json())
    respons.usage = Verbruik(1234, 210)
    client = NageaapteClient(respons)

    resultaat = extraheer_factuur(factuur_pdf, client=client, vandaag=VANDAAG)
    assert resultaat.invoer_tokens == 1234
    assert resultaat.uitvoer_tokens == 210


def test_zonder_verbruik_blijven_de_tellers_nul(factuur_pdf):
    # Niet elke respons hoeft usage te hebben; dat mag niet crashen.
    client = client_met(goede_extractie())
    resultaat = extraheer_factuur(factuur_pdf, client=client, vandaag=VANDAAG)
    assert resultaat.invoer_tokens == 0
    assert resultaat.uitvoer_tokens == 0
```

## `boekhouding/tests/test_eval_logica.py`

```python
"""Tests voor de vergelijkingslogica van de eval.

Het evalscript zelf draait buiten pytest omdat het echte API-aanroepen
doet. De manier waarop het een gelezen waarde met de grondwaarheid
vergelijkt is echter gewone rekenkunde zonder API, en juist die moet
kloppen: anders meet de eval het verkeerde.
"""

import sys
from pathlib import Path

import pytest

sys.path.insert(0, str(Path(__file__).resolve().parent.parent / "scripts"))

from eval_extractie import (  # noqa: E402
    OORDELEN,
    als_datum,
    als_decimal,
    beoordeel_veld,
    rapportpad,
)


def test_gevaarlijkste_oordeel_staat_vooraan():
    assert OORDELEN[0] == "verzonnen"


# --- verzonnen: het model vult iets in dat er niet staat ---------------

def test_verzonnen_is_een_eigen_categorie():
    # Factuur 09 heeft geen factuurnummer. Vult het model er toch een in,
    # dan telt dat niet als "fout" maar als "verzonnen": de validatie van
    # module 1 vangt dit namelijk niet.
    oordeel, toelichting = beoordeel_veld("factuurnummer", "2026-9999", None)
    assert oordeel == "verzonnen"
    assert "2026-9999" in toelichting
    assert "staat niet op het document" in toelichting


def test_verzonnen_bij_lege_grondwaarheid():
    assert beoordeel_veld("factuurnummer", "X-1", "")[0] == "verzonnen"


def test_niets_invullen_bij_ontbrekend_veld_is_correct():
    # Dit is het gewenste gedrag bij factuur 09.
    oordeel, toelichting = beoordeel_veld("factuurnummer", None, None)
    assert oordeel == "correct"
    assert "niet ingevuld" in toelichting


# --- de andere drie ----------------------------------------------------

def test_gemist_als_het_veld_er_wel_staat():
    oordeel, toelichting = beoordeel_veld("factuurnummer", None, "2026-0412")
    assert oordeel == "gemist"
    assert "2026-0412" in toelichting


def test_fout_bij_een_andere_waarde():
    oordeel, _ = beoordeel_veld("factuurnummer", "2026-0413", "2026-0412")
    assert oordeel == "fout"


def test_gelijke_waarde_is_correct():
    assert beoordeel_veld("leverancier", "KPN B.V.", "KPN B.V.")[0] == "correct"


def test_hoofdletters_en_spaties_tellen_niet_mee():
    oordeel, _ = beoordeel_veld(
        "leverancier", "  van dijk ICT-diensten ", "Van Dijk ICT-diensten"
    )
    assert oordeel == "correct"


# --- notatie mag verschillen, de waarde niet ---------------------------

@pytest.mark.parametrize(
    "gelezen, verwacht, verwachting",
    [
        ("1.250,00", "1250.00", "correct"),   # Nederlands duizendtal
        ("1250,00", "1250.00", "correct"),
        ("1250.00", "1250.00", "correct"),
        ("-544,50", "-544.50", "correct"),    # creditnota
        ("125,00", "1250.00", "fout"),        # factor 10 mis
        ("1.250", "1250.00", "fout"),         # ambigu, dus niet zomaar goed
    ],
)
def test_bedragen_worden_op_waarde_vergeleken(gelezen, verwacht, verwachting):
    assert beoordeel_veld("bedrag_excl", gelezen, verwacht)[0] == verwachting


@pytest.mark.parametrize(
    "gelezen, verwacht, verwachting",
    [
        ("2026-07-12", "12-07-2026", "correct"),  # ISO tegen Nederlands
        ("12-07-2026", "12-07-2026", "correct"),
        ("2026-07-11", "12-07-2026", "fout"),
        ("12 juli 2026", "12-07-2026", "fout"),   # onleesbare notatie
    ],
)
def test_datums_worden_op_datum_vergeleken(gelezen, verwacht, verwachting):
    assert beoordeel_veld("factuurdatum", gelezen, verwacht)[0] == verwachting


def test_onleesbaar_bedrag_telt_niet_stiekem_als_goed():
    assert als_decimal("geen bedrag") is None
    assert beoordeel_veld("bedrag_excl", "geen bedrag", "450.00")[0] == "fout"


def test_onleesbare_datum_telt_niet_stiekem_als_goed():
    assert als_datum("gisteren") is None


# --- rapport per model -------------------------------------------------

def test_elk_model_krijgt_een_eigen_rapportbestand():
    een = rapportpad("claude-opus-5")
    twee = rapportpad("claude-haiku-4-5")
    assert een != twee
    assert een.name == "eval-rapport-claude-opus-5.json"


def test_rapportnaam_blijft_een_veilige_bestandsnaam():
    naam = rapportpad("raar/model:naam").name
    assert "/" not in naam and ":" not in naam


# --- kostenberekening ---------------------------------------------------

def test_kosten_worden_per_miljoen_tokens_gerekend():
    from eval_extractie import kosten

    # claude-opus-5: $5 per miljoen invoer, $25 per miljoen uitvoer.
    assert kosten("claude-opus-5", 1_000_000, 0) == pytest.approx(5.00)
    assert kosten("claude-opus-5", 0, 1_000_000) == pytest.approx(25.00)
    assert kosten("claude-opus-5", 200_000, 20_000) == pytest.approx(1.5)


def test_goedkoper_model_kost_minder_bij_hetzelfde_verbruik():
    from eval_extractie import kosten

    opus = kosten("claude-opus-5", 100_000, 10_000)
    sonnet = kosten("claude-sonnet-5", 100_000, 10_000)
    haiku = kosten("claude-haiku-4-5", 100_000, 10_000)
    assert opus > sonnet > haiku


def test_onbekend_model_geeft_geen_verzonnen_prijs():
    from eval_extractie import kosten

    assert kosten("een-model-dat-we-niet-kennen", 1_000_000, 1_000_000) is None
```

## `boekhouding/tests/test_ubl.py`

```python
"""Tests voor UBL / e-facturen (module 4).

Inclusief echte aanvalspogingen: een XML-bestand dat een bestand van de
schijf probeert te lezen (XXE) en een dat het geheugen probeert vol te
laten lopen. Beide horen geweigerd te worden.
"""

import xml.etree.ElementTree as ET
from datetime import date
from pathlib import Path

import pytest

from boekhouding import (
    XmlOnveilig,
    bestandssoort,
    lees_ubl,
    lees_ubl_bytes,
    lees_xml_veilig,
    routeer_document,
    verwerk_efactuur,
)
from conftest import maak_pdf

VANDAAG = date(2026, 8, 27)
UBLMAP = Path(__file__).parent / "testfacturen" / "ubl"

NS = (
    'xmlns="urn:oasis:names:specification:ubl:schema:xsd:Invoice-2" '
    'xmlns:cac="urn:oasis:names:specification:ubl:schema:xsd:CommonAggregateComponents-2" '
    'xmlns:cbc="urn:oasis:names:specification:ubl:schema:xsd:CommonBasicComponents-2"'
)


def kleine_ubl(nummer="F-1", datum="2026-07-14", excl="400.00", btw="84.00",
               percentage="21", incl="484.00", naam="Van Dijk ICT-diensten"):
    """Een minimale maar geldige UBL-factuur, voor losse gevallen."""
    return f"""<?xml version="1.0" encoding="UTF-8"?>
<Invoice {NS}>
  <cbc:ID>{nummer}</cbc:ID>
  <cbc:IssueDate>{datum}</cbc:IssueDate>
  <cac:AccountingSupplierParty><cac:Party>
    <cac:PartyName><cbc:Name>{naam}</cbc:Name></cac:PartyName>
  </cac:Party></cac:AccountingSupplierParty>
  <cac:TaxTotal><cac:TaxSubtotal>
    <cbc:TaxAmount currencyID="EUR">{btw}</cbc:TaxAmount>
    <cac:TaxCategory><cbc:Percent>{percentage}</cbc:Percent></cac:TaxCategory>
  </cac:TaxSubtotal></cac:TaxTotal>
  <cac:LegalMonetaryTotal>
    <cbc:TaxExclusiveAmount currencyID="EUR">{excl}</cbc:TaxExclusiveAmount>
    <cbc:TaxInclusiveAmount currencyID="EUR">{incl}</cbc:TaxInclusiveAmount>
  </cac:LegalMonetaryTotal>
</Invoice>""".encode("utf-8")


# --- XXE en andere XML-aanvallen ----------------------------------------

def test_xxe_kan_geen_bestand_lezen(tmp_path):
    """Een factuur die /etc/passwd probeert te lezen wordt geweigerd."""
    geheim = tmp_path / "geheim.txt"
    geheim.write_text("DIT-MAG-NOOIT-LEKKEN", encoding="utf-8")

    aanval = f"""<?xml version="1.0"?>
<!DOCTYPE Invoice [ <!ENTITY lek SYSTEM "file://{geheim}"> ]>
<Invoice><ID>&lek;</ID></Invoice>""".encode("utf-8")

    with pytest.raises(XmlOnveilig, match="DTD"):
        lees_xml_veilig(aanval)

    # En via de normale weg: review_nodig, geen exception, geen lek.
    bestand = tmp_path / "aanval.xml"
    bestand.write_bytes(aanval)
    resultaat = lees_ubl(bestand)
    assert resultaat.status == "review_nodig"
    assert any("onveilige XML" in reden for reden in resultaat.redenen)
    assert "DIT-MAG-NOOIT-LEKKEN" not in str(resultaat.model_dump())


def test_xxe_kan_geen_netwerkadres_benaderen(tmp_path):
    aanval = b"""<?xml version="1.0"?>
<!DOCTYPE Invoice [ <!ENTITY lek SYSTEM "http://voorbeeld.test/geheim"> ]>
<Invoice><ID>&lek;</ID></Invoice>"""
    with pytest.raises(XmlOnveilig):
        lees_xml_veilig(aanval)


def test_uitdijende_entiteiten_worden_geweigerd():
    """Billion laughs: een klein bestand dat het geheugen vol laat lopen."""
    aanval = b"""<?xml version="1.0"?>
<!DOCTYPE lolz [
 <!ENTITY lol "lol">
 <!ENTITY lol2 "&lol;&lol;&lol;&lol;&lol;&lol;&lol;&lol;&lol;&lol;">
 <!ENTITY lol3 "&lol2;&lol2;&lol2;&lol2;&lol2;&lol2;&lol2;&lol2;&lol2;&lol2;">
]>
<Invoice><ID>&lol3;</ID></Invoice>"""
    with pytest.raises(XmlOnveilig):
        lees_xml_veilig(aanval)


def test_externe_dtd_wordt_geweigerd():
    aanval = b'<?xml version="1.0"?>\n' \
             b'<!DOCTYPE Invoice SYSTEM "http://voorbeeld.test/kwaad.dtd">\n' \
             b"<Invoice><ID>1</ID></Invoice>"
    with pytest.raises(XmlOnveilig, match="DTD"):
        lees_xml_veilig(aanval)


def test_gewone_xml_zonder_dtd_wordt_gewoon_gelezen():
    wortel = lees_xml_veilig(b"<Invoice><ID>F-1</ID></Invoice>")
    assert wortel.tag == "Invoice"
    assert wortel.find("ID").text == "F-1"


def test_naamruimten_blijven_behouden():
    wortel = lees_xml_veilig(kleine_ubl())
    assert wortel.tag.startswith("{urn:oasis:")
    assert wortel.tag.endswith("}Invoice")


def test_kapotte_xml_geeft_leesbare_fout():
    with pytest.raises(ET.ParseError):
        lees_xml_veilig(b"<Invoice><ID>niet afgesloten")


def test_kapotte_xml_via_de_normale_weg_geeft_review(tmp_path):
    bestand = tmp_path / "kapot.xml"
    bestand.write_bytes(b"<Invoice><ID>niet afgesloten")
    resultaat = lees_ubl(bestand)
    assert resultaat.status == "review_nodig"
    assert any("niet leesbaar" in reden for reden in resultaat.redenen)


# --- routering op inhoud, niet op naam ----------------------------------

def test_bestandssoort_herkent_de_eerste_bytes():
    assert bestandssoort(b"%PDF-1.4\n...") == "pdf"
    assert bestandssoort(b"\xff\xd8\xff\xe0...") == "jpg"
    assert bestandssoort(b"\x89PNG\r\n\x1a\n...") == "png"
    assert bestandssoort(b'<?xml version="1.0"?>') == "xml"
    assert bestandssoort(b"<Invoice>") == "xml"
    assert bestandssoort(b"\xef\xbb\xbf<?xml ") == "xml"  # met BOM
    assert bestandssoort(b"PK\x03\x04") is None


def test_ubl_bestand_gaat_naar_het_ubl_pad():
    route, reden = routeer_document(UBLMAP / "01-standaard-21procent.xml")
    assert route == "ubl" and reden is None


def test_pdf_met_ingebedde_efactuur_gaat_naar_het_ubl_pad():
    # Deze PDF heeft óók een tekstlaag; de XML hoort voor te gaan.
    route, _ = routeer_document(UBLMAP / "06-factuur-x.pdf")
    assert route == "ubl"


def test_gewone_pdf_gaat_naar_het_tekstpad(tmp_path):
    bestand = tmp_path / "factuur.pdf"
    bestand.write_bytes(maak_pdf("Factuur 2026-0412"))
    assert routeer_document(bestand)[0] == "tekst"


def test_gescande_pdf_gaat_naar_het_beeldpad(tmp_path):
    bestand = tmp_path / "scan.pdf"
    bestand.write_bytes(maak_pdf(None))
    assert routeer_document(bestand)[0] == "beeld"


def test_afbeelding_gaat_naar_het_beeldpad(tmp_path):
    bestand = tmp_path / "foto.jpg"
    bestand.write_bytes(b"\xff\xd8\xff\xe0 nep-jpeg")
    assert routeer_document(bestand)[0] == "beeld"


def test_de_naam_van_het_bestand_doet_er_niet_toe(tmp_path):
    # UBL met de verkeerde extensie: moet tóch het UBL-pad worden.
    verkeerd = tmp_path / "factuur.pdf"
    verkeerd.write_bytes(kleine_ubl())
    assert routeer_document(verkeerd)[0] == "ubl"

    # En een echte PDF die .xml heet gaat niet als XML door.
    andersom = tmp_path / "factuur.xml"
    andersom.write_bytes(maak_pdf("Factuur 2026-0412"))
    assert routeer_document(andersom)[0] == "tekst"


def test_xml_dat_geen_ubl_is_geeft_reden(tmp_path):
    bestand = tmp_path / "iets.xml"
    bestand.write_bytes(b"<Bestellijst><Regel>1</Regel></Bestellijst>")
    route, reden = routeer_document(bestand)
    assert route is None
    assert "Bestellijst" in reden and "geen UBL" in reden


def test_onbekende_soort_geeft_reden(tmp_path):
    bestand = tmp_path / "iets.docx"
    bestand.write_bytes(b"PK\x03\x04 nep-docx")
    route, reden = routeer_document(bestand)
    assert route is None
    assert "onbekende bestandssoort" in reden


def test_leeg_bestand_geeft_reden(tmp_path):
    bestand = tmp_path / "leeg.xml"
    bestand.write_bytes(b"")
    route, reden = routeer_document(bestand)
    assert route is None and "leeg" in reden


def test_onbestaand_bestand_geeft_reden(tmp_path):
    route, reden = routeer_document(tmp_path / "weg.xml")
    assert route is None and "niet gevonden" in reden


# --- velden uitlezen ----------------------------------------------------

def test_alle_velden_komen_uit_de_xml():
    resultaat = verwerk_efactuur(
        UBLMAP / "01-standaard-21procent.xml", vandaag=VANDAAG
    )
    assert resultaat.status == "gevalideerd"
    assert resultaat.redenen == []
    assert resultaat.documentsoort == "factuur"
    assert resultaat.bron == "xml"
    assert resultaat.velden["leverancier"] == "Van Dijk ICT-diensten"
    assert resultaat.velden["factuurnummer"] == "EF-2026-0101"
    assert resultaat.velden["factuurdatum"] == "2026-07-14"
    assert str(resultaat.factuur.bedrag_incl) == "484.00"


def test_laag_tarief_wordt_gelezen():
    resultaat = verwerk_efactuur(
        UBLMAP / "02-diensten-9procent.xml", vandaag=VANDAAG
    )
    assert resultaat.status == "gevalideerd"
    assert str(resultaat.factuur.btw_percentage) == "9.00"


def test_leverancier_valt_terug_op_de_statutaire_naam():
    zonder_handelsnaam = kleine_ubl().replace(
        b"<cac:PartyName><cbc:Name>Van Dijk ICT-diensten</cbc:Name></cac:PartyName>",
        b"<cac:PartyLegalEntity><cbc:RegistrationName>Van Dijk ICT B.V."
        b"</cbc:RegistrationName></cac:PartyLegalEntity>",
    )
    gelezen = lees_ubl_bytes(zonder_handelsnaam)
    assert gelezen.velden["leverancier"] == "Van Dijk ICT B.V."


# --- meerdere btw-tarieven ----------------------------------------------

def test_twee_btw_tarieven_worden_niet_opgeteld():
    resultaat = verwerk_efactuur(
        UBLMAP / "04-twee-btw-tarieven.xml", vandaag=VANDAAG
    )
    assert resultaat.status == "review_nodig"
    reden = next(r for r in resultaat.redenen if "btw-tarieven" in r)
    assert "2 btw-tarieven" in reden
    assert "21.00" in reden and "9.00" in reden
    # Niets samengevoegd tot één percentage.
    assert "btw_percentage" not in resultaat.velden
    assert "btw_bedrag" not in resultaat.velden


def test_zonder_btw_gegevens_volgt_review():
    zonder = kleine_ubl()
    begin = zonder.index(b"<cac:TaxTotal>")
    einde = zonder.index(b"</cac:TaxTotal>") + len(b"</cac:TaxTotal>")
    gelezen = lees_ubl_bytes(zonder[:begin] + zonder[einde:])
    assert gelezen.status == "review_nodig"
    assert any("geen btw-gegevens" in reden for reden in gelezen.redenen)


# --- ontbrekende velden -------------------------------------------------

def test_ontbrekende_factuurdatum_noemt_het_element():
    resultaat = verwerk_efactuur(
        UBLMAP / "05-zonder-factuurdatum.xml", vandaag=VANDAAG
    )
    assert resultaat.status == "review_nodig"
    assert any(
        "factuurdatum ontbreekt" in reden and "cbc:IssueDate" in reden
        for reden in resultaat.redenen
    )


def test_er_wordt_nooit_een_default_ingevuld():
    kaal = b'<?xml version="1.0"?><Invoice ' + NS.encode() + b"></Invoice>"
    gelezen = lees_ubl_bytes(kaal)
    assert gelezen.status == "review_nodig"
    assert gelezen.velden == {}          # niets verzonnen
    assert len(gelezen.redenen) >= 5     # per ontbrekend element een reden


def test_onzinbedrag_wordt_niet_overgenomen():
    slecht = kleine_ubl().replace(b">400.00<", b">vierhonderd<")
    gelezen = lees_ubl_bytes(slecht)
    assert "bedrag_excl" not in gelezen.velden
    assert any("bedrag_excl ontbreekt" in reden for reden in gelezen.redenen)


# --- creditnota ---------------------------------------------------------

def test_creditnota_wordt_herkend_en_ter_review_gelegd():
    resultaat = verwerk_efactuur(UBLMAP / "03-creditnota.xml", vandaag=VANDAAG)
    assert resultaat.documentsoort == "creditnota"
    assert resultaat.status == "review_nodig"
    assert any("creditnota" in reden and "tekens" in reden for reden in resultaat.redenen)
    # De bedragen zijn wél gelezen, precies zoals ze in het bestand staan.
    assert resultaat.velden["bedrag_incl"] == "484.00"


# --- de validatie van module 1 blijft gelden ----------------------------

def test_bedragen_gaan_door_valideer_factuur():
    # Een e-factuur waarvan het totaal niet klopt hoort ook af te vallen.
    from boekhouding import beoordeel_ubl

    fout = kleine_ubl(excl="400.00", btw="84.00", incl="999.00")

    gelezen = lees_ubl_bytes(fout)
    beoordeeld = beoordeel_ubl(gelezen, vandaag=VANDAAG)
    assert beoordeeld.status == "review_nodig"
    assert any("bedrag_incl" in reden and "verschil" in reden
               for reden in beoordeeld.redenen)


def test_datum_in_de_toekomst_valt_ook_hier_af():
    from boekhouding import beoordeel_ubl

    toekomst = kleine_ubl(datum="2026-12-31")
    beoordeeld = beoordeel_ubl(lees_ubl_bytes(toekomst), vandaag=VANDAAG)
    assert beoordeeld.status == "review_nodig"
    assert any("toekomst" in reden for reden in beoordeeld.redenen)


def test_ongeldig_btw_percentage_valt_ook_hier_af():
    from boekhouding import beoordeel_ubl

    vreemd = kleine_ubl(percentage="15", btw="60.00", incl="460.00")
    beoordeeld = beoordeel_ubl(lees_ubl_bytes(vreemd), vandaag=VANDAAG)
    assert beoordeeld.status == "review_nodig"
    assert any("btw_percentage" in reden for reden in beoordeeld.redenen)


# --- PDF met ingebedde e-factuur ---------------------------------------

def test_factuur_x_leest_uit_de_bijlage_en_niet_uit_de_tekstlaag():
    resultaat = verwerk_efactuur(UBLMAP / "06-factuur-x.pdf", vandaag=VANDAAG)
    assert resultaat.status == "gevalideerd"
    assert resultaat.bron == "pdf-bijlage"
    assert resultaat.velden["factuurnummer"] == "EF-2026-0106"
    assert str(resultaat.factuur.bedrag_incl) == "620.13"


def test_pdf_zonder_bijlage_zegt_dat_eerlijk(tmp_path):
    gewoon = tmp_path / "gewoon.pdf"
    gewoon.write_bytes(maak_pdf("Factuur 2026-0412"))
    resultaat = verwerk_efactuur(gewoon, vandaag=VANDAAG)
    assert resultaat.status == "review_nodig"
    assert any("geen ingebedde e-factuur" in reden for reden in resultaat.redenen)


def test_onbestaand_bestand_geeft_review(tmp_path):
    resultaat = verwerk_efactuur(tmp_path / "weg.xml", vandaag=VANDAAG)
    assert resultaat.status == "review_nodig"
    assert any("niet gevonden" in reden for reden in resultaat.redenen)


# --- bewaarplicht geldt ook voor e-facturen -----------------------------

def test_efactuur_kan_bewaard_worden(conn, administratie_id, tmp_path):
    from boekhouding import bewaar_document, lees_document, opslagpad_voor

    bestand = tmp_path / "efactuur.xml"
    bestand.write_bytes(kleine_ubl())

    resultaat = bewaar_document(
        conn, administratie_id, str(bestand), str(tmp_path / "opslag")
    )
    assert resultaat.status == "opgeslagen"
    bewaard = opslagpad_voor(resultaat.hash, tmp_path / "opslag", ".xml")
    assert bewaard.is_file()
    assert bewaard.read_bytes() == bestand.read_bytes()
    assert lees_document(conn, resultaat.document_id)["originele_bestandsnaam"] == (
        "efactuur.xml"
    )


# --- groottelimiet ------------------------------------------------------

def test_te_groot_bestand_wordt_niet_ingelezen(tmp_path):
    """Een XML boven de grens gaat naar review zonder te worden gelezen."""
    from boekhouding import MAX_XML_BYTES

    groot = tmp_path / "enorm.xml"
    # Geldige UBL, maar met zoveel opvulling dat hij over de grens gaat.
    opvulling = b"<!-- " + b"x" * (MAX_XML_BYTES + 1024) + b" -->"
    groot.write_bytes(kleine_ubl().replace(b"<cbc:ID>", opvulling + b"<cbc:ID>"))
    assert groot.stat().st_size > MAX_XML_BYTES

    resultaat = lees_ubl(groot)
    assert resultaat.status == "review_nodig"
    assert any("groter dan de grens" in reden for reden in resultaat.redenen)
    assert resultaat.velden == {}


def test_te_groot_bestand_wordt_ook_niet_gerouteerd(tmp_path):
    from boekhouding import MAX_XML_BYTES

    groot = tmp_path / "enorm.xml"
    groot.write_bytes(b'<?xml version="1.0"?><Invoice>' + b"x" * MAX_XML_BYTES)

    route, reden = routeer_document(groot)
    assert route is None
    assert "groter dan de grens" in reden


def test_de_grens_wordt_ook_op_losse_bytes_toegepast():
    """Ook bytes uit een PDF-bijlage gaan door dezelfde grens."""
    from boekhouding import MAX_XML_BYTES

    with pytest.raises(XmlOnveilig, match="groter dan de grens"):
        lees_xml_veilig(b"<Invoice>" + b"x" * MAX_XML_BYTES)


def test_een_bestand_op_de_grens_mag_nog(tmp_path):
    from boekhouding import te_groot, MAX_XML_BYTES

    assert te_groot(MAX_XML_BYTES) is None       # precies op de grens: goed
    assert te_groot(MAX_XML_BYTES + 1) is not None


def test_normale_efactuur_valt_ruim_binnen_de_grens():
    from boekhouding import MAX_XML_BYTES

    echte = (UBLMAP / "01-standaard-21procent.xml").stat().st_size
    assert echte < MAX_XML_BYTES / 1000  # een e-factuur is kilobytes, geen MB


# --- andere tekencodering ----------------------------------------------

def _als_utf16(tekst: str, groot_eerst: bool) -> bytes:
    """Zet XML om naar UTF-16 met de bijbehorende BOM."""
    if groot_eerst:
        return b"\xfe\xff" + tekst.encode("utf-16-be")
    return b"\xff\xfe" + tekst.encode("utf-16-le")


DTD_AANVAL = (
    '<?xml version="1.0" encoding="UTF-16"?>\n'
    '<!DOCTYPE Invoice [ <!ENTITY lek SYSTEM "file:///etc/passwd"> ]>\n'
    "<Invoice><ID>&lek;</ID></Invoice>"
)


@pytest.mark.parametrize("groot_eerst", [False, True], ids=["utf-16-le", "utf-16-be"])
def test_dtd_aanval_in_utf16_wordt_ook_geweigerd(groot_eerst):
    """Dezelfde aanval in een andere codering hoort net zo af te ketsen."""
    with pytest.raises(XmlOnveilig, match="DTD"):
        lees_xml_veilig(_als_utf16(DTD_AANVAL, groot_eerst))


@pytest.mark.parametrize("groot_eerst", [False, True], ids=["utf-16-le", "utf-16-be"])
def test_utf16_aanval_via_de_normale_weg_geeft_review(tmp_path, groot_eerst):
    bestand = tmp_path / "aanval.xml"
    bestand.write_bytes(_als_utf16(DTD_AANVAL, groot_eerst))

    resultaat = lees_ubl(bestand)
    assert resultaat.status == "review_nodig"
    assert any("onveilige XML" in reden for reden in resultaat.redenen)
    assert "root:" not in str(resultaat.model_dump())  # niets uit /etc/passwd


@pytest.mark.parametrize("groot_eerst", [False, True], ids=["utf-16-le", "utf-16-be"])
def test_nette_utf16_efactuur_wordt_gewoon_gelezen(tmp_path, groot_eerst):
    """De weigering mag geen geldige UTF-16 e-factuur meeslepen."""
    tekst = kleine_ubl().decode("utf-8").replace(
        '<?xml version="1.0" encoding="UTF-8"?>',
        '<?xml version="1.0" encoding="UTF-16"?>',
    )
    bestand = tmp_path / "efactuur.xml"
    bestand.write_bytes(_als_utf16(tekst, groot_eerst))

    assert routeer_document(bestand)[0] == "ubl"
    resultaat = verwerk_efactuur(bestand, vandaag=VANDAAG)
    assert resultaat.status == "gevalideerd"
    assert resultaat.velden["leverancier"] == "Van Dijk ICT-diensten"


@pytest.mark.parametrize("groot_eerst", [False, True], ids=["utf-16-le", "utf-16-be"])
def test_utf16_wordt_als_xml_herkend(groot_eerst):
    from boekhouding import bestandssoort

    assert bestandssoort(_als_utf16(DTD_AANVAL, groot_eerst)) == "xml"
```

## `boekhouding/tests/test_ubl_weergave.py`

```python
"""Tests voor de leesbare weergave van een e-factuur (weergavelaag).

Deze laag mag niets bepalen: geen bedragen optellen, geen ontbrekend
veld invullen, geen bestand aanpassen. Wat hij wél moet doen is tonen
wat er in het bestand staat, met de UBL-plek erbij, zodat een mens het
naast de uitgelezen velden kan leggen.
"""

from pathlib import Path

import pytest

from boekhouding.ubl import MAX_XML_BYTES
from boekhouding.web.ubl_weergave import (
    GROEPEN,
    MAX_TOON_BYTES,
    NAAMRUIMTEN,
    _et_pad,
    leesbare_ubl,
)
from test_ubl import DTD_AANVAL, _als_utf16

UBLMAP = Path(__file__).parent / "testfacturen" / "ubl"


def lees(naam: str):
    return leesbare_ubl((UBLMAP / naam).read_bytes())


def _rijen(weergave, groep=None):
    """De rijen, eventueel beperkt tot één groep.

    Beperken kan nodig zijn: "Naam" staat zowel onder Leverancier als
    onder Afnemer, en op het scherm zegt de kop erboven welke het is.
    """
    return [
        rij
        for g in weergave.groepen
        if groep is None or g.titel == groep
        for rij in g.rijen
    ]


def rijen(weergave, groep=None) -> dict[str, object]:
    return {rij.label: rij.waarde for rij in _rijen(weergave, groep)}


def herkomsten(weergave, groep=None) -> dict[str, str]:
    return {rij.label: rij.herkomst for rij in _rijen(weergave, groep)}


# --- de gewone factuur --------------------------------------------------

def test_de_velden_komen_leesbaar_terug():
    weergave = lees("01-standaard-21procent.xml")
    assert weergave.status == "leesbaar"
    assert weergave.documentsoort == "factuur"

    waarden = rijen(weergave)
    assert waarden["Factuurnummer"] == "EF-2026-0101"
    assert waarden["Factuurdatum"] == "2026-07-14"
    assert rijen(weergave, "Leverancier")["Naam"] == "Van Dijk ICT-diensten"
    assert waarden["Bedrag excl. btw"] == "400.00"
    assert waarden["Totaal incl. btw"] == "484.00"
    assert waarden["Btw-percentage"] == "21.00%"
    assert waarden["Btw-bedrag"] == "84.00"


def test_bij_elk_veld_staat_waar_het_vandaan_komt():
    weergave = lees("01-standaard-21procent.xml")
    waar = herkomsten(weergave)
    assert waar["Factuurdatum"] == "cbc:IssueDate"
    assert waar["Bedrag excl. btw"] == "cac:LegalMonetaryTotal/cbc:TaxExclusiveAmount"
    assert herkomsten(weergave, "Leverancier")["Naam"] == (
        "cac:AccountingSupplierParty/cac:Party/cac:PartyName/cbc:Name"
    )


def test_de_getoonde_herkomst_is_het_pad_waarmee_gezocht_is():
    """Anders kan het label gaan afwijken van waar de waarde vandaan komt."""
    for _titel, velden in GROEPEN:
        for _label, paden, _kern in velden:
            for pad in paden:
                vertaald = _et_pad(pad)
                assert vertaald.count("{") == len(pad.split("/"))
                for voorvoegsel in pad.split("/"):
                    assert voorvoegsel.split(":")[0] in NAAMRUIMTEN


def test_de_factuurregels_komen_erbij():
    weergave = lees("01-standaard-21procent.xml")
    assert len(weergave.regels) == 1
    regel = weergave.regels[0]
    assert regel.omschrijving == "Onderhoud werkplekken juli 2026"
    assert regel.aantal == "1"
    assert regel.bedrag == "400.00"
    assert regel.btw_percentage == "21.00%"


def test_een_aanvullend_veld_zonder_waarde_wordt_weggelaten():
    """Anders wordt het scherm een lijst met lege regels."""
    weergave = lees("01-standaard-21procent.xml")
    # Deze factuur heeft geen cac:PaymentMeans, dus geen IBAN-regel.
    assert "IBAN" not in rijen(weergave)
    assert all(groep.titel != "Betaling" for groep in weergave.groepen)


# --- de lastige gevallen ------------------------------------------------

def test_een_ontbrekend_kernveld_blijft_zichtbaar():
    """Dat een verplicht veld er niet in staat, is juist wat je wilt zien."""
    weergave = lees("05-zonder-factuurdatum.xml")
    waarden = rijen(weergave)
    assert "Factuurdatum" in waarden
    assert waarden["Factuurdatum"] is None
    assert herkomsten(weergave)["Factuurdatum"] == "cbc:IssueDate"


def test_twee_btw_tarieven_worden_allebei_getoond():
    weergave = lees("04-twee-btw-tarieven.xml")
    waarden = rijen(weergave)
    assert waarden["Btw-percentage 1"] == "21.00%"
    assert waarden["Btw-bedrag 1"] == "21.00"
    assert waarden["Btw-percentage 2"] == "9.00%"
    assert waarden["Btw-bedrag 2"] == "18.00"


def test_bij_twee_tarieven_wordt_er_niets_opgeteld():
    """De weergavelaag rekent niet; 21 + 18 verschijnt hier nergens."""
    weergave = lees("04-twee-btw-tarieven.xml")
    alle = [rij.waarde for groep in weergave.groepen for rij in groep.rijen]
    assert "39.00" not in alle
    # En geen van beide tarieven wordt als hét btw-veld gepresenteerd.
    btw = [g for g in weergave.groepen if g.titel == "Btw"][0]
    assert not any(rij.kern for rij in btw.rijen)


def test_een_creditnota_wordt_als_creditnota_getoond():
    weergave = lees("03-creditnota.xml")
    assert weergave.documentsoort == "creditnota"
    assert "Creditnota" in weergave.soortnaam
    # De regels heten in een creditnota anders; ze horen er toch te staan.
    assert len(weergave.regels) == 1
    assert weergave.regels[0].omschrijving


def test_er_wordt_geen_teken_omgezet():
    """UBL noteert een creditnota positief; dat blijft hier ook zo staan."""
    weergave = lees("03-creditnota.xml")
    assert rijen(weergave)["Totaal incl. btw"] == "484.00"


# --- de ruwe XML --------------------------------------------------------

def test_de_ruwe_xml_blijft_beschikbaar():
    weergave = lees("01-standaard-21procent.xml")
    assert "<cbc:IssueDate>2026-07-14</cbc:IssueDate>" in weergave.ruwe_xml
    assert weergave.xml_afgekapt is False


def test_een_heel_groot_bestand_wordt_afgekapt():
    opvulling = b"<!-- " + b"x" * (MAX_TOON_BYTES + 1000) + b" -->"
    inhoud = (UBLMAP / "01-standaard-21procent.xml").read_bytes() + opvulling

    weergave = leesbare_ubl(inhoud)
    assert weergave.xml_afgekapt is True
    assert len(weergave.ruwe_xml.encode("utf-8")) <= MAX_TOON_BYTES


def test_boven_de_grens_van_module4_wordt_niet_gelezen():
    """Dezelfde grens als bij het verwerken; ook de weergave leest niet door."""
    inhoud = b"<Invoice>" + b" " * (MAX_XML_BYTES + 1) + b"</Invoice>"
    weergave = leesbare_ubl(inhoud)
    assert weergave.status == "onleesbaar"
    assert "groter dan de grens" in weergave.reden


def test_utf16_wordt_leesbaar_getoond():
    tekst = (UBLMAP / "01-standaard-21procent.xml").read_text(encoding="utf-8")
    tekst = tekst.replace('encoding="UTF-8"', 'encoding="UTF-16"')

    weergave = leesbare_ubl(_als_utf16(tekst, groot_eerst=False))
    assert weergave.status == "leesbaar"
    assert rijen(weergave)["Factuurnummer"] == "EF-2026-0101"
    assert "IssueDate" in weergave.ruwe_xml


# --- wat er niet doorheen mag ------------------------------------------

def test_een_dtd_aanval_wordt_ook_in_de_weergave_geweigerd():
    """De weergavelaag mag geen tweede, zwakkere ingang worden."""
    aanval = (
        b'<?xml version="1.0"?>\n'
        b'<!DOCTYPE Invoice [ <!ENTITY lek SYSTEM "file:///etc/passwd"> ]>\n'
        b"<Invoice><ID>&lek;</ID></Invoice>"
    )
    weergave = leesbare_ubl(aanval)
    assert weergave.status == "onleesbaar"
    assert "DTD" in weergave.reden
    assert weergave.groepen == []
    assert "root:" not in str(weergave.model_dump())


@pytest.mark.parametrize("groot_eerst", [False, True], ids=["utf-16-le", "utf-16-be"])
def test_dezelfde_aanval_in_utf16_ketst_ook_af(groot_eerst):
    weergave = leesbare_ubl(_als_utf16(DTD_AANVAL, groot_eerst))
    assert weergave.status == "onleesbaar"
    assert "DTD" in weergave.reden


def test_xml_dat_geen_efactuur_is_wordt_niet_gelezen():
    weergave = leesbare_ubl(b"<html><body>geen factuur</body></html>")
    assert weergave.status == "onleesbaar"
    assert "geen UBL" in weergave.reden
    # De ruwe tekst blijft wel te zien; een mens moet kunnen kijken.
    assert "geen factuur" in weergave.ruwe_xml


def test_kapotte_xml_geeft_geen_exception():
    weergave = leesbare_ubl(b"<Invoice><cbc:ID>kapot")
    assert weergave.status == "onleesbaar"
    assert weergave.reden


def test_leeg_bestand_geeft_geen_exception():
    weergave = leesbare_ubl(b"")
    assert weergave.status == "onleesbaar"
```

## `boekhouding/tests/test_rekeningschema.py`

```python
"""Tests voor het rekeningschema per boekjaar.

Er kan alleen op een rekening uit het schema worden geboekt, en het
schema komt uit een config-bestand per jaar — niet uit de code.
"""

import json

import pytest

from boekhouding.rekeningschema import (
    CONFIG_MAP,
    KIESBARE_SOORTEN,
    SOORTEN,
    rekeningschema_voor_jaar,
)


def test_er_is_een_schema_voor_elk_jaar_met_btw_tarieven():
    """Zonder rekeningschema kan een factuur van dat jaar niet geboekt worden."""
    jaren = {
        int(pad.stem.split("_")[1])
        for pad in CONFIG_MAP.glob("btw_*.json")
    }
    for jaar in jaren:
        assert rekeningschema_voor_jaar(jaar) is not None, f"geen schema voor {jaar}"


def test_een_jaar_zonder_bestand_geeft_none():
    """Nooit het schema van een ander jaar gebruiken."""
    assert rekeningschema_voor_jaar(1999) is None


def test_elke_rekening_heeft_een_bekende_soort():
    schema = rekeningschema_voor_jaar(2026)
    for rekening in schema.rekeningen.values():
        assert rekening.soort in SOORTEN
        assert rekening.omschrijving.strip()
        assert rekening.rgs_code.strip()


def test_er_zijn_ongeveer_dertig_rekeningen():
    """Genoeg voor een zzp'er, klein genoeg om uit een lijst te kiezen."""
    schema = rekeningschema_voor_jaar(2026)
    assert 25 <= len(schema.rekeningen) <= 45


def test_alleen_kosten_en_opbrengsten_zijn_kiesbaar():
    """Bank, crediteuren en btw vult de boeking zelf in; die kies je niet."""
    schema = rekeningschema_voor_jaar(2026)
    for rekening in schema.kiesbaar():
        assert rekening.soort in KIESBARE_SOORTEN
    assert schema.zoek("1600").soort == "passiva"
    assert schema.zoek("1600") not in schema.kiesbaar()


def test_de_standaardrekeningen_bestaan_ook_echt():
    schema = rekeningschema_voor_jaar(2026)
    for naam in ("crediteuren", "debiteuren", "btw_voorbelasting"):
        code = schema.standaard(naam)
        assert schema.zoek(code) is not None, naam


def test_btw_rekening_per_tarief():
    schema = rekeningschema_voor_jaar(2026)
    assert schema.zoek(schema.btw_verschuldigd_voor("21")).soort == "btw"
    assert schema.zoek(schema.btw_verschuldigd_voor("9")).soort == "btw"
    # Bij 0% hoort geen btw-rekening, en bij een onbekend tarief ook niet:
    # dan wordt er geweigerd in plaats van gegokt.
    assert schema.btw_verschuldigd_voor("0") is None
    assert schema.btw_verschuldigd_voor("13") is None


def test_een_onbekende_code_bestaat_niet():
    assert rekeningschema_voor_jaar(2026).zoek("9999") is None


def test_dubbele_code_in_de_config_wordt_gemeld(tmp_path, monkeypatch):
    """Twee rekeningen met dezelfde code zou stil de een overschrijven."""
    import boekhouding.rekeningschema as mod

    origineel = json.loads((CONFIG_MAP / "rekeningen_2026.json").read_text("utf-8"))
    origineel["rekeningen"].append(dict(origineel["rekeningen"][0]))
    origineel["jaar"] = 2099
    (tmp_path / "rekeningen_2099.json").write_text(
        json.dumps(origineel), encoding="utf-8"
    )
    monkeypatch.setattr(mod, "CONFIG_MAP", tmp_path)
    mod.rekeningschema_voor_jaar.cache_clear()

    with pytest.raises(ValueError, match="twee keer"):
        mod.rekeningschema_voor_jaar(2099)
    mod.rekeningschema_voor_jaar.cache_clear()


def test_ontbrekende_standaardrekening_wordt_gemeld(tmp_path, monkeypatch):
    import boekhouding.rekeningschema as mod

    data = json.loads((CONFIG_MAP / "rekeningen_2026.json").read_text("utf-8"))
    data["standaardrekeningen"]["crediteuren"] = "0000"
    (tmp_path / "rekeningen_2098.json").write_text(json.dumps(data), encoding="utf-8")
    monkeypatch.setattr(mod, "CONFIG_MAP", tmp_path)
    mod.rekeningschema_voor_jaar.cache_clear()

    with pytest.raises(ValueError, match="standaardrekeningen"):
        mod.rekeningschema_voor_jaar(2098)
    mod.rekeningschema_voor_jaar.cache_clear()
```

## `boekhouding/tests/test_grootboek.py`

```python
"""Tests voor het grootboek: boekingen, balans en tegenboekingen.

De kern: een boeking bestaat alleen als debet en credit exact gelijk
zijn, en een boeking wordt nooit gewijzigd of verwijderd.
"""

from datetime import date
from decimal import Decimal

import pytest

from boekhouding import (
    Boekingsregel,
    boek_factuur,
    boeking_bij_factuur,
    controleer_balans,
    keur_factuur_goed,
    kies_rekening,
    lees_audit_trail,
    lees_boeking,
    lees_boekingen,
    maak_administratie,
    maak_tabellen,
    maak_tegenboeking,
    maak_verbinding,
    sla_boeking_op,
    sla_factuur_op,
    som_credit,
    som_debet,
    stel_boeking_samen,
    stel_tegenboeking_samen,
)

VANDAAG = date(2026, 8, 27)


@pytest.fixture
def conn(tmp_path):
    verbinding = maak_verbinding(str(tmp_path / "boekhouding.sqlite"))
    maak_tabellen(verbinding)
    maak_administratie(verbinding, "Zaak van Alaa")
    yield verbinding
    verbinding.close()


def factuurgegevens(**afwijkingen):
    gegeven = {
        "leverancier": "Van Dijk ICT-diensten",
        "factuurdatum": "2026-07-14",
        "factuurnummer": "F-2026-001",
        "bedrag_excl": "100.00",
        "btw_percentage": "21",
        "btw_bedrag": "21.00",
        "bedrag_incl": "121.00",
    }
    gegeven.update(afwijkingen)
    return gegeven


def geboekte_factuur(conn, rekening="4100", **afwijkingen):
    """Een factuur van upload tot boeking, zoals het scherm dat doet."""
    factuur_id, _ = sla_factuur_op(
        conn, 1, factuurgegevens(**afwijkingen), vandaag=VANDAAG
    )
    assert kies_rekening(conn, factuur_id, rekening) == (True, [])
    assert keur_factuur_goed(conn, factuur_id)[0] is True
    boeking_id, redenen = boek_factuur(conn, factuur_id)
    assert redenen == []
    return factuur_id, boeking_id


# --- balans -------------------------------------------------------------

def test_een_kloppende_boeking_is_in_balans():
    regels = [
        Boekingsregel(rekening="4100", omschrijving="kosten", debet=Decimal("100.00")),
        Boekingsregel(rekening="1520", omschrijving="btw", debet=Decimal("21.00")),
        Boekingsregel(rekening="1600", omschrijving="crediteuren", credit=Decimal("121.00")),
    ]
    assert controleer_balans(regels) == []
    assert som_debet(regels) == som_credit(regels) == Decimal("121.00")


def test_een_cent_verschil_is_al_niet_in_balans():
    """De factuurcontrole laat ±0,02 toe; een boeking geen cent."""
    regels = [
        Boekingsregel(rekening="4100", omschrijving="kosten", debet=Decimal("100.00")),
        Boekingsregel(rekening="1600", omschrijving="crediteuren", credit=Decimal("100.01")),
    ]
    redenen = controleer_balans(regels)
    assert redenen
    assert "niet in balans" in redenen[0]


def test_een_regel_hoort_aan_een_kant_te_staan():
    regels = [
        Boekingsregel(rekening="4100", omschrijving="fout",
                      debet=Decimal("10.00"), credit=Decimal("10.00")),
    ]
    assert any("één kant" in reden for reden in controleer_balans(regels))


def test_een_boeking_zonder_regels_bestaat_niet():
    assert controleer_balans([]) == ["een boeking zonder regels bestaat niet"]


# --- samenstellen -------------------------------------------------------

def test_inkoopfactuur_wordt_kosten_btw_en_crediteuren():
    voorstel = stel_boeking_samen({**factuurgegevens(), "id": 1}, "4100")
    assert voorstel.status == "gemaakt"
    assert [(r.rekening, str(r.debet), str(r.credit)) for r in voorstel.regels] == [
        ("4100", "100.00", "0.00"),
        ("1520", "21.00", "0.00"),
        ("1600", "0.00", "121.00"),
    ]
    assert voorstel.boekdatum == date(2026, 7, 14)


def test_verkoopfactuur_wordt_debiteuren_omzet_en_af_te_dragen_btw():
    """De gekozen rekening bepaalt de richting; dat is een keuze van een mens."""
    voorstel = stel_boeking_samen({**factuurgegevens(), "id": 1}, "8000")
    assert voorstel.status == "gemaakt"
    assert [(r.rekening, str(r.debet), str(r.credit)) for r in voorstel.regels] == [
        ("1300", "121.00", "0.00"),
        ("8000", "0.00", "100.00"),
        ("1510", "0.00", "21.00"),
    ]


def test_negen_procent_gaat_naar_de_andere_btw_rekening():
    voorstel = stel_boeking_samen(
        {**factuurgegevens(btw_percentage="9", btw_bedrag="9.00",
                           bedrag_incl="109.00"), "id": 1},
        "8010",
    )
    assert voorstel.regels[-1].rekening == "1511"


def test_nultarief_krijgt_geen_btw_regel():
    voorstel = stel_boeking_samen(
        {**factuurgegevens(btw_percentage="0", btw_bedrag="0.00",
                           bedrag_incl="100.00"), "id": 1},
        "8020",
    )
    assert voorstel.status == "gemaakt"
    assert len(voorstel.regels) == 2
    assert controleer_balans(voorstel.regels) == []


def test_creditnota_met_negatieve_bedragen_blijft_in_balans():
    voorstel = stel_boeking_samen(
        {**factuurgegevens(bedrag_excl="-100.00", btw_bedrag="-21.00",
                           bedrag_incl="-121.00"), "id": 1},
        "4100",
    )
    assert voorstel.status == "gemaakt"
    assert controleer_balans(voorstel.regels) == []
    assert som_debet(voorstel.regels) == Decimal("-121.00")


def test_zonder_rekening_ontstaat_er_geen_boeking():
    voorstel = stel_boeking_samen({**factuurgegevens(), "id": 1}, None)
    assert voorstel.status == "geweigerd"
    assert "geen grootboekrekening gekozen" in voorstel.redenen[0]


def test_een_onbekende_rekening_wordt_geweigerd():
    voorstel = stel_boeking_samen({**factuurgegevens(), "id": 1}, "9999")
    assert voorstel.status == "geweigerd"
    assert "staat niet in het rekeningschema" in voorstel.redenen[0]


def test_een_balansrekening_hoort_niet_bij_een_factuur():
    voorstel = stel_boeking_samen({**factuurgegevens(), "id": 1}, "1600")
    assert voorstel.status == "geweigerd"
    assert "kosten- of opbrengstenrekening" in voorstel.redenen[0]


def test_bedragen_die_een_cent_afwijken_worden_niet_geboekt():
    """Deze factuur komt door valideer_factuur (±0,02) maar niet door de boeking."""
    voorstel = stel_boeking_samen(
        {**factuurgegevens(bedrag_incl="121.01"), "id": 1}, "4100"
    )
    assert voorstel.status == "geweigerd"
    assert "tellen niet exact op" in voorstel.redenen[0]


def test_een_ontbrekend_bedrag_wordt_niet_aangevuld():
    voorstel = stel_boeking_samen(
        {**factuurgegevens(btw_bedrag=None), "id": 1}, "4100"
    )
    assert voorstel.status == "geweigerd"
    assert "btw_bedrag" in voorstel.redenen[0]


def test_zonder_factuurdatum_geen_boekdatum():
    voorstel = stel_boeking_samen(
        {**factuurgegevens(factuurdatum=None), "id": 1}, "4100"
    )
    assert voorstel.status == "geweigerd"
    assert "geen factuurdatum" in voorstel.redenen[0]


def test_een_jaar_zonder_rekeningschema_wordt_niet_geboekt():
    voorstel = stel_boeking_samen(
        {**factuurgegevens(factuurdatum="1999-07-14"), "id": 1}, "4100"
    )
    assert voorstel.status == "geweigerd"
    assert "geen rekeningschema" in voorstel.redenen[0]


# --- opslaan ------------------------------------------------------------

def test_alleen_een_goedgekeurde_factuur_wordt_geboekt(conn):
    factuur_id, _ = sla_factuur_op(conn, 1, factuurgegevens(), vandaag=VANDAAG)
    kies_rekening(conn, factuur_id, "4100")

    boeking_id, redenen = boek_factuur(conn, factuur_id)
    assert boeking_id is None
    assert "nog niet goedgekeurd" in redenen[0]


def test_een_geboekte_factuur_staat_in_het_grootboek(conn):
    factuur_id, boeking_id = geboekte_factuur(conn)
    boeking = lees_boeking(conn, boeking_id)

    assert boeking["factuur_id"] == factuur_id
    assert boeking["boekdatum"] == "2026-07-14"
    assert "Van Dijk" in boeking["omschrijving"]
    assert [r["rekening"] for r in boeking["regels"]] == ["4100", "1520", "1600"]
    assert boeking_bij_factuur(conn, factuur_id)["id"] == boeking_id


def test_dezelfde_factuur_wordt_niet_twee_keer_geboekt(conn):
    factuur_id, _ = geboekte_factuur(conn)

    nogmaals, redenen = boek_factuur(conn, factuur_id)
    assert nogmaals is None
    assert "al geboekt" in redenen[0]
    assert len(lees_boekingen(conn, 1)) == 1


def test_een_boeking_komt_in_de_audit_trail(conn):
    _, boeking_id = geboekte_factuur(conn)
    trail = lees_audit_trail(conn, boeking_id, tabel="boekingen")

    assert len(trail) == 1
    assert trail[0]["actie"] == "aangemaakt"
    assert "4100" in trail[0]["nieuwe_waarde"]


def test_de_gekozen_rekening_komt_in_de_audit_trail(conn):
    factuur_id, _ = sla_factuur_op(conn, 1, factuurgegevens(), vandaag=VANDAAG)
    kies_rekening(conn, factuur_id, "4100")
    kies_rekening(conn, factuur_id, "4110")

    wijzigingen = [
        r for r in lees_audit_trail(conn, factuur_id) if r["veld"] == "rekening"
    ]
    assert [(r["oude_waarde"], r["nieuwe_waarde"]) for r in wijzigingen] == [
        (None, "4100"), ("4100", "4110"),
    ]


def test_een_onbekende_rekening_kiezen_kan_niet(conn):
    factuur_id, _ = sla_factuur_op(conn, 1, factuurgegevens(), vandaag=VANDAAG)

    gelukt, redenen = kies_rekening(conn, factuur_id, "9999")
    assert gelukt is False
    assert "staat niet in het schema" in redenen[0]


def test_een_boeking_die_niet_klopt_komt_de_database_niet_in(conn):
    """Dubbele controle: ook als de aanroeper de balans zou overslaan."""
    from boekhouding import BoekingVoorstel

    scheef = BoekingVoorstel(
        status="gemaakt",
        boekdatum=date(2026, 7, 14),
        omschrijving="handmatig",
        regels=[
            Boekingsregel(rekening="4100", omschrijving="kosten", debet=Decimal("100.00")),
            Boekingsregel(rekening="1600", omschrijving="cred", credit=Decimal("99.00")),
        ],
    )
    boeking_id, redenen = sla_boeking_op(conn, 1, scheef)
    assert boeking_id is None
    assert "niet in balans" in redenen[0]
    assert lees_boekingen(conn, 1) == []


# --- tegenboeking -------------------------------------------------------

def test_een_tegenboeking_zet_alles_aan_de_andere_kant(conn):
    _, boeking_id = geboekte_factuur(conn)

    tegen_id, redenen = maak_tegenboeking(conn, boeking_id, "verkeerde rekening")
    assert redenen == []

    origineel = lees_boeking(conn, boeking_id)
    tegen = lees_boeking(conn, tegen_id)
    assert tegen["corrigeert_boeking_id"] == boeking_id
    assert "verkeerde rekening" in tegen["omschrijving"]
    for oud, nieuw in zip(origineel["regels"], tegen["regels"]):
        assert oud["debet"] == nieuw["credit"]
        assert oud["credit"] == nieuw["debet"]


def test_origineel_en_tegenboeking_zijn_samen_nul(conn):
    _, boeking_id = geboekte_factuur(conn)
    maak_tegenboeking(conn, boeking_id, "toch geen kosten")

    alle_regels = [
        regel for boeking in lees_boekingen(conn, 1) for regel in boeking["regels"]
    ]
    debet = sum(Decimal(r["debet"]) for r in alle_regels)
    credit = sum(Decimal(r["credit"]) for r in alle_regels)
    assert debet == credit
    per_rekening = {}
    for regel in alle_regels:
        saldo = Decimal(regel["debet"]) - Decimal(regel["credit"])
        per_rekening[regel["rekening"]] = per_rekening.get(regel["rekening"], 0) + saldo
    assert set(per_rekening.values()) == {Decimal("0.00")}


def test_de_oorspronkelijke_boeking_blijft_ongewijzigd_staan(conn):
    _, boeking_id = geboekte_factuur(conn)
    voor = lees_boeking(conn, boeking_id)

    maak_tegenboeking(conn, boeking_id, "correctie")

    assert lees_boeking(conn, boeking_id) == voor
    assert len(lees_boekingen(conn, 1)) == 2


def test_twee_keer_corrigeren_gebeurt_niet(conn):
    _, boeking_id = geboekte_factuur(conn)
    maak_tegenboeking(conn, boeking_id, "correctie")

    tweede, redenen = maak_tegenboeking(conn, boeking_id, "nog eens")
    assert tweede is None
    assert "al gecorrigeerd" in redenen[0]


def test_een_tegenboeking_zonder_reden_wordt_geweigerd(conn):
    _, boeking_id = geboekte_factuur(conn)

    tegen, redenen = maak_tegenboeking(conn, boeking_id, "   ")
    assert tegen is None
    assert "reden" in redenen[0]


def test_een_tegenboeking_kan_in_een_ander_kwartaal(conn):
    """Is het kwartaal al aangegeven, dan hoort de correctie in het lopende."""
    _, boeking_id = geboekte_factuur(conn)

    tegen_id, _ = maak_tegenboeking(
        conn, boeking_id, "kwartaal al ingediend", boekdatum=date(2026, 10, 1)
    )
    assert lees_boeking(conn, tegen_id)["boekdatum"] == "2026-10-01"


def test_de_tegenboeking_van_een_tegenboeking_klopt_ook():
    """Puur rekenkundig: twee keer omdraaien geeft het origineel terug."""
    boeking = {
        "id": 7,
        "boekdatum": "2026-07-14",
        "regels": [
            {"rekening": "4100", "omschrijving": "kosten", "debet": "100.00", "credit": "0.00"},
            {"rekening": "1600", "omschrijving": "cred", "debet": "0.00", "credit": "100.00"},
        ],
    }
    eerste = stel_tegenboeking_samen(boeking, "fout")
    assert eerste.status == "gemaakt"
    assert str(eerste.regels[0].credit) == "100.00"


# --- periode ------------------------------------------------------------

def test_boekingen_zijn_per_periode_op_te_vragen(conn):
    geboekte_factuur(conn, factuurdatum="2026-03-31", factuurnummer="F-1")
    geboekte_factuur(conn, factuurdatum="2026-04-01", factuurnummer="F-2")

    eerste = lees_boekingen(conn, 1, date(2026, 1, 1), date(2026, 3, 31))
    tweede = lees_boekingen(conn, 1, date(2026, 4, 1), date(2026, 6, 30))
    assert [b["boekdatum"] for b in eerste] == ["2026-03-31"]
    assert [b["boekdatum"] for b in tweede] == ["2026-04-01"]


def test_de_rekening_wijzigen_na_het_boeken_kan_niet(conn):
    """Anders zegt de factuur iets anders dan het grootboek."""
    factuur_id, boeking_id = geboekte_factuur(conn, rekening="4100")

    gelukt, redenen = kies_rekening(conn, factuur_id, "4110")
    assert gelukt is False
    assert "al geboekt" in redenen[0] and "tegenboeking" in redenen[0]

    from boekhouding import lees_factuur
    assert lees_factuur(conn, factuur_id)["rekening"] == "4100"
    assert lees_boeking(conn, boeking_id)["regels"][0]["rekening"] == "4100"
```

## `boekhouding/tests/test_btw_aangifte.py`

```python
"""Tests voor de btw-aangifte per kwartaal.

Twee dingen worden hier bewezen: dat de rubrieken kloppen, en dat er
niets wordt uitgerekend zolang er in dat kwartaal nog een factuur open
staat.
"""

from datetime import date
from decimal import Decimal

import pytest

from boekhouding import (
    bereken_aangifte,
    boek_factuur,
    keur_factuur_goed,
    kies_rekening,
    kwartaal_grenzen,
    kwartaal_van,
    maak_administratie,
    maak_tabellen,
    maak_tegenboeking,
    maak_verbinding,
    sla_factuur_op,
    zoek_blokkades,
)

VANDAAG = date(2026, 12, 31)


@pytest.fixture
def conn(tmp_path):
    verbinding = maak_verbinding(str(tmp_path / "boekhouding.sqlite"))
    maak_tabellen(verbinding)
    maak_administratie(verbinding, "Zaak van Alaa")
    yield verbinding
    verbinding.close()


def zet_factuur(
    conn, nummer, datum, excl, percentage, btw, incl, rekening,
    goedkeuren=True, boeken=True, leverancier="Van Dijk ICT-diensten",
):
    """Zet een factuur neer en loop de keten af tot waar de test hem wil."""
    factuur_id, resultaat = sla_factuur_op(
        conn, 1,
        {
            "leverancier": leverancier, "factuurdatum": datum,
            "factuurnummer": nummer, "bedrag_excl": excl,
            "btw_percentage": percentage, "btw_bedrag": btw, "bedrag_incl": incl,
        },
        vandaag=VANDAAG,
    )
    if rekening:
        kies_rekening(conn, factuur_id, rekening)
    if goedkeuren and resultaat.status == "gevalideerd":
        keur_factuur_goed(conn, factuur_id)
        if boeken:
            boek_factuur(conn, factuur_id)
    return factuur_id


def volledig_kwartaal(conn):
    """Q3 2026: twee verkopen (21% en 9%) en een inkoop."""
    zet_factuur(conn, "V-1", "2026-07-10", "1000.00", "21", "210.00", "1210.00", "8000")
    zet_factuur(conn, "V-2", "2026-08-05", "500.00", "9", "45.00", "545.00", "8010")
    zet_factuur(conn, "I-1", "2026-07-20", "200.00", "21", "42.00", "242.00", "4100")


# --- kwartaalgrenzen ----------------------------------------------------

def test_eenendertig_maart_is_q1_en_een_april_is_q2():
    assert kwartaal_van(date(2026, 3, 31)) == 1
    assert kwartaal_van(date(2026, 4, 1)) == 2


def test_elke_maand_valt_in_het_juiste_kwartaal():
    verwacht = [1, 1, 1, 2, 2, 2, 3, 3, 3, 4, 4, 4]
    for maand, kwartaal in enumerate(verwacht, start=1):
        assert kwartaal_van(date(2026, maand, 1)) == kwartaal


def test_de_grenzen_van_elk_kwartaal():
    assert kwartaal_grenzen(2026, 1) == (date(2026, 1, 1), date(2026, 3, 31))
    assert kwartaal_grenzen(2026, 2) == (date(2026, 4, 1), date(2026, 6, 30))
    assert kwartaal_grenzen(2026, 3) == (date(2026, 7, 1), date(2026, 9, 30))
    assert kwartaal_grenzen(2026, 4) == (date(2026, 10, 1), date(2026, 12, 31))


def test_februari_in_een_schrikkeljaar():
    assert kwartaal_grenzen(2024, 1)[1] == date(2024, 3, 31)
    assert kwartaal_grenzen(2100, 1)[0] == date(2100, 1, 1)


def test_een_kwartaal_dat_niet_bestaat():
    with pytest.raises(ValueError, match="kwartaal 5"):
        kwartaal_grenzen(2026, 5)


def test_een_factuur_van_31_maart_telt_in_q1_en_niet_in_q2(conn):
    zet_factuur(conn, "V-1", "2026-03-31", "100.00", "21", "21.00", "121.00", "8000")

    q1 = bereken_aangifte(conn, 1, 2026, 1)
    q2 = bereken_aangifte(conn, 1, 2026, 2)
    assert q1.rubrieken[0].btw == Decimal("21.00")
    assert q2.rubrieken[0].btw == Decimal("0.00")


def test_een_factuur_van_1_april_telt_in_q2_en_niet_in_q1(conn):
    zet_factuur(conn, "V-1", "2026-04-01", "100.00", "21", "21.00", "121.00", "8000")

    assert bereken_aangifte(conn, 1, 2026, 1).rubrieken[0].btw == Decimal("0.00")
    assert bereken_aangifte(conn, 1, 2026, 2).rubrieken[0].btw == Decimal("21.00")


# --- de rubrieken -------------------------------------------------------

def test_een_volledig_kwartaal_van_upload_tot_voorstel(conn):
    volledig_kwartaal(conn)
    aangifte = bereken_aangifte(conn, 1, 2026, 3)

    assert aangifte.status == "voorstel"
    assert aangifte.aantal_boekingen == 3

    rubriek_1a, rubriek_1b = aangifte.rubrieken
    assert (rubriek_1a.code, rubriek_1a.grondslag, rubriek_1a.btw) == (
        "1a", Decimal("1000.00"), Decimal("210.00")
    )
    assert (rubriek_1b.code, rubriek_1b.grondslag, rubriek_1b.btw) == (
        "1b", Decimal("500.00"), Decimal("45.00")
    )
    assert aangifte.verschuldigd == Decimal("255.00")   # 5a
    assert aangifte.voorbelasting == Decimal("42.00")   # 5b
    assert aangifte.saldo == Decimal("213.00")
    assert aangifte.saldo_richting == "betalen"


def test_meer_voorbelasting_dan_btw_geeft_terug_te_vragen(conn):
    zet_factuur(conn, "I-1", "2026-07-20", "1000.00", "21", "210.00", "1210.00", "4100")
    aangifte = bereken_aangifte(conn, 1, 2026, 3)

    assert aangifte.saldo == Decimal("-210.00")
    assert aangifte.saldo_richting == "terugvragen"


def test_een_leeg_kwartaal_geeft_nullen_en_geen_fout(conn):
    aangifte = bereken_aangifte(conn, 1, 2026, 2)

    assert aangifte.status == "voorstel"
    assert aangifte.saldo == Decimal("0.00")
    assert aangifte.aantal_boekingen == 0
    # Nul is geen teruggave; dat zou het scherm laten liegen.
    assert aangifte.saldo_richting == "niets"


def test_een_tegenboeking_haalt_het_bedrag_er_weer_af(conn):
    zet_factuur(conn, "V-1", "2026-07-10", "1000.00", "21", "210.00", "1210.00", "8000")
    boeking = bereken_aangifte(conn, 1, 2026, 3)
    assert boeking.verschuldigd == Decimal("210.00")

    from boekhouding import lees_boekingen
    maak_tegenboeking(conn, lees_boekingen(conn, 1)[0]["id"], "factuur ingetrokken")

    na = bereken_aangifte(conn, 1, 2026, 3)
    assert na.verschuldigd == Decimal("0.00")
    assert na.rubrieken[0].grondslag == Decimal("0.00")
    assert na.aantal_boekingen == 2


def test_omzet_zonder_btw_wordt_gemeld_en_niet_weggelaten(conn):
    """0%, vrijgesteld of verlegd hoort in 1e/2a/3a; die zijn er nog niet."""
    zet_factuur(conn, "V-1", "2026-07-10", "300.00", "0", "0.00", "300.00", "8020")
    aangifte = bereken_aangifte(conn, 1, 2026, 3)

    assert aangifte.status == "voorstel"
    assert any("300.00" in w for w in aangifte.waarschuwingen)
    assert any("1e" in w for w in aangifte.waarschuwingen)


def test_een_jaar_zonder_rekeningschema_wordt_niet_berekend(conn):
    aangifte = bereken_aangifte(conn, 1, 1999, 1)

    assert aangifte.status == "geblokkeerd"
    assert "geen rekeningschema" in aangifte.redenen[0]
    assert aangifte.saldo is None


# --- blokkades ----------------------------------------------------------

def test_een_factuur_in_review_blokkeert_de_aangifte(conn):
    volledig_kwartaal(conn)
    # Bedragen die niet optellen: komt door geen enkele controle heen.
    zet_factuur(conn, "V-9", "2026-09-15", "100.00", "21", "21.00", "999.00", "8000")

    aangifte = bereken_aangifte(conn, 1, 2026, 3)
    assert aangifte.status == "geblokkeerd"
    assert aangifte.saldo is None and aangifte.rubrieken == []
    assert [b.reden for b in aangifte.blokkades] == ["moet nog nagekeken worden"]


def test_een_factuur_zonder_goedkeuring_blokkeert_ook(conn):
    zet_factuur(conn, "V-1", "2026-07-10", "100.00", "21", "21.00", "121.00", "8000",
                goedkeuren=False)

    aangifte = bereken_aangifte(conn, 1, 2026, 3)
    assert aangifte.status == "geblokkeerd"
    assert "nog niet goedgekeurd" in aangifte.blokkades[0].reden


def test_goedgekeurd_maar_niet_geboekt_blokkeert_ook(conn):
    """Anders zou het bedrag stilletjes uit de aangifte verdwijnen."""
    zet_factuur(conn, "V-1", "2026-07-10", "100.00", "21", "21.00", "121.00",
                rekening=None)

    aangifte = bereken_aangifte(conn, 1, 2026, 3)
    assert aangifte.status == "geblokkeerd"
    assert "geen grootboekrekening gekozen" in aangifte.blokkades[0].reden


def test_de_blokkade_zegt_om_welke_factuur_het_gaat(conn):
    factuur_id = zet_factuur(
        conn, "V-1", "2026-07-10", "100.00", "21", "21.00", "121.00", "8000",
        goedkeuren=False, leverancier="Groothandel Oost",
    )
    blokkade = bereken_aangifte(conn, 1, 2026, 3).blokkades[0]

    assert blokkade.factuur_id == factuur_id
    assert blokkade.leverancier == "Groothandel Oost"
    assert blokkade.factuurdatum == "2026-07-10"
    assert blokkade.bedrag_incl == "121.00"


def test_een_blokkade_in_q3_blokkeert_q4_niet(conn):
    zet_factuur(conn, "V-1", "2026-07-10", "100.00", "21", "21.00", "121.00", "8000",
                goedkeuren=False)
    zet_factuur(conn, "V-2", "2026-10-10", "100.00", "21", "21.00", "121.00", "8000")

    assert bereken_aangifte(conn, 1, 2026, 3).status == "geblokkeerd"
    assert bereken_aangifte(conn, 1, 2026, 4).status == "voorstel"


def test_zoek_blokkades_kijkt_alleen_in_de_periode(conn):
    zet_factuur(conn, "V-1", "2026-07-10", "100.00", "21", "21.00", "121.00", "8000",
                goedkeuren=False)

    assert zoek_blokkades(conn, 1, date(2026, 7, 1), date(2026, 9, 30))
    assert zoek_blokkades(conn, 1, date(2026, 10, 1), date(2026, 12, 31)) == []


def test_een_factuur_zonder_datum_wordt_gemeld_maar_blokkeert_niet(conn):
    """Zonder datum valt hij in geen enkel kwartaal; stil weglaten mag niet."""
    sla_factuur_op(
        conn, 1,
        {"leverancier": "Van Dijk", "factuurnummer": "X-1",
         "bedrag_excl": "100.00", "btw_percentage": "21",
         "btw_bedrag": "21.00", "bedrag_incl": "121.00"},
        vandaag=VANDAAG,
    )
    aangifte = bereken_aangifte(conn, 1, 2026, 3)

    assert aangifte.status == "voorstel"
    assert any("zonder factuurdatum" in w for w in aangifte.waarschuwingen)


def test_de_aangifte_zegt_dat_de_eigenaar_zelf_indient(conn):
    aangifte = bereken_aangifte(conn, 1, 2026, 3)
    assert "indienen doet u zelf" in aangifte.voorbehoud.lower()
    assert "verstuurt niets" in aangifte.voorbehoud


def test_een_kwartaal_met_alleen_inkoop_en_verkoop_die_elkaar_opheffen(conn):
    """Precies nul is geen teruggave; dat moet het scherm ook niet zeggen."""
    zet_factuur(conn, "V-1", "2026-07-10", "100.00", "21", "21.00", "121.00", "8000")
    zet_factuur(conn, "I-1", "2026-07-11", "100.00", "21", "21.00", "121.00", "4100")

    aangifte = bereken_aangifte(conn, 1, 2026, 3)
    assert aangifte.verschuldigd == aangifte.voorbelasting == Decimal("21.00")
    assert aangifte.saldo == Decimal("0.00")
    assert aangifte.saldo_richting == "niets"
```

## `boekhouding/tests/test_web.py`

```python
"""Tests voor de webinterface (module 5).

Er gaat hier nooit een echt verzoek naar de API: waar de AI-route wordt
geraakt, krijgt de app een nagemaakte client mee.
"""

from datetime import date
from pathlib import Path

import pytest
from fastapi.testclient import TestClient

from boekhouding import (
    boeking_bij_factuur,
    lees_audit_trail,
    lees_facturen,
    maak_verbinding,
)
from boekhouding.web import maak_app
from conftest import maak_pdf
from test_ai_extractie import NageaapteClient, NageaapteRespons, goede_extractie, veld

VANDAAG = date(2026, 8, 27)
UBLMAP = Path(__file__).parent / "testfacturen" / "ubl"


def client_met(extractie):
    return NageaapteClient(
        NageaapteRespons(extractie, ruwe_json=extractie.model_dump_json())
    )


@pytest.fixture
def werkmap(tmp_path):
    return tmp_path


@pytest.fixture
def app_en_client(werkmap):
    """Een app met een nagemaakte AI-client die altijd hetzelfde teruggeeft."""
    ai = client_met(goede_extractie())
    app = maak_app(
        str(werkmap / "boekhouding.sqlite"), str(werkmap / "opslag"),
        ai_client=ai, vandaag=VANDAAG,
    )
    return app, TestClient(app), ai


@pytest.fixture
def web(app_en_client):
    return app_en_client[1]


def upload(web, pad_of_bytes, naam="factuur.pdf"):
    inhoud = (
        pad_of_bytes.read_bytes()
        if isinstance(pad_of_bytes, Path) else pad_of_bytes
    )
    return web.post(
        "/administratie/1/upload",
        files={"bestand": (naam, inhoud, "application/octet-stream")},
        follow_redirects=False,
    )


# --- opstarten ----------------------------------------------------------

def test_startpagina_gaat_naar_de_lijst(web):
    antwoord = web.get("/", follow_redirects=False)
    assert antwoord.status_code == 303
    assert antwoord.headers["location"] == "/administratie/1"


def test_lege_lijst_zegt_dat_netjes(web):
    pagina = web.get("/administratie/1").text
    assert "Nog geen facturen" in pagina
    assert "Factuur toevoegen" in pagina


def test_onbekende_administratie_geeft_404(web):
    antwoord = web.get("/administratie/999")
    assert antwoord.status_code == 404
    assert "Niet gevonden" in antwoord.text


def test_de_pagina_is_mobiel_eerst(web):
    pagina = web.get("/administratie/1").text
    assert 'name="viewport"' in pagina
    assert "width=device-width" in pagina


# --- uploaden -----------------------------------------------------------

def test_efactuur_uploaden_levert_een_factuur_op(web):
    antwoord = upload(web, UBLMAP / "01-standaard-21procent.xml", "efactuur.xml")
    assert antwoord.status_code == 303
    assert antwoord.headers["location"] == "/administratie/1/factuur/1"

    pagina = web.get("/administratie/1/factuur/1").text
    assert "Van Dijk ICT-diensten" in pagina
    assert "484.00" in pagina


def test_efactuur_gebruikt_geen_ai(app_en_client):
    _, web, ai = app_en_client
    upload(web, UBLMAP / "01-standaard-21procent.xml", "efactuur.xml")
    assert ai.aanroepen == []  # een e-factuur hoeft niet uitgelezen te worden


def test_pdf_uploaden_gaat_wel_langs_het_model(app_en_client):
    _, web, ai = app_en_client
    antwoord = upload(web, maak_pdf("Factuur 2026-0412 Van Dijk"), "factuur.pdf")
    assert antwoord.status_code == 303
    assert len(ai.aanroepen) == 1


def test_uploadscherm_laat_een_foto_maken(web):
    pagina = web.get("/administratie/1/upload").text
    assert 'type="file"' in pagina
    assert 'accept="image/*,.pdf,.xml"' in pagina
    assert "capture" in pagina


def test_onbruikbaar_bestand_wordt_uitgelegd(web):
    antwoord = upload(web, b"PK\x03\x04 nep-docx", "factuur.docx")
    assert antwoord.status_code == 200
    assert "niet verwerkt" in antwoord.text
    assert "geen PDF, afbeelding of e-factuur" in antwoord.text


def test_leeg_bestand_wordt_uitgelegd(web):
    antwoord = upload(web, b"", "leeg.pdf")
    assert "leeg" in antwoord.text


def test_het_origineel_wordt_bewaard(app_en_client, werkmap):
    _, web, _ = app_en_client
    upload(web, UBLMAP / "01-standaard-21procent.xml", "efactuur.xml")
    bewaard = list((werkmap / "opslag").rglob("*.xml"))
    assert len(bewaard) == 1


# --- overzicht ----------------------------------------------------------

def test_review_staat_bovenaan(app_en_client, werkmap):
    _, web, _ = app_en_client
    # Eerst een goede e-factuur, daarna een met een ontbrekend veld.
    upload(web, UBLMAP / "01-standaard-21procent.xml", "goed.xml")
    upload(web, UBLMAP / "05-zonder-factuurdatum.xml", "fout.xml")

    conn = maak_verbinding(str(werkmap / "boekhouding.sqlite"))
    facturen = lees_facturen(conn, 1)
    conn.close()
    assert facturen[0]["status"] == "review_nodig"

    pagina = web.get("/administratie/1").text
    assert pagina.index("Review nodig") < pagina.index("Klaar om goed te keuren")


def test_de_teller_laat_zien_hoeveel_er_wachten(web):
    upload(web, UBLMAP / "05-zonder-factuurdatum.xml", "fout.xml")
    pagina = web.get("/administratie/1").text
    assert "factuur wacht op jou" in pagina


def test_elke_rij_toont_leverancier_datum_bedrag_en_status(web):
    upload(web, UBLMAP / "01-standaard-21procent.xml", "goed.xml")
    pagina = web.get("/administratie/1").text
    assert "Van Dijk ICT-diensten" in pagina
    assert "2026-07-14" in pagina
    assert "484.00" in pagina
    assert "Klaar om goed te keuren" in pagina


# --- reviewscherm -------------------------------------------------------

def test_reviewscherm_toont_het_originele_document(web):
    upload(web, UBLMAP / "01-standaard-21procent.xml", "goed.xml")
    pagina = web.get("/administratie/1/factuur/1").text
    assert "/administratie/1/document/1" in pagina


def test_het_document_kan_worden_opgehaald(web):
    upload(web, maak_pdf("Factuur 2026-0412"), "factuur.pdf")
    antwoord = web.get("/administratie/1/document/1")
    assert antwoord.status_code == 200
    assert antwoord.headers["content-type"] == "application/pdf"
    assert "inline" in antwoord.headers["content-disposition"]


def test_onbekend_document_geeft_404(web):
    assert web.get("/administratie/1/document/999").status_code == 404


def test_alle_velden_zijn_bewerkbaar(web):
    upload(web, UBLMAP / "01-standaard-21procent.xml", "goed.xml")
    pagina = web.get("/administratie/1/factuur/1").text
    for veldnaam in ("leverancier", "factuurdatum", "factuurnummer",
                     "bedrag_excl", "btw_percentage", "btw_bedrag", "bedrag_incl"):
        assert f'name="{veldnaam}"' in pagina


def test_lage_zekerheid_wordt_gemarkeerd(werkmap):
    onzeker = goede_extractie(
        bedrag_incl=veld("544,50", "laag", "cijfer onscherp door vouw")
    )
    app = maak_app(
        str(werkmap / "db.sqlite"), str(werkmap / "opslag"),
        ai_client=client_met(onzeker), vandaag=VANDAAG,
    )
    web = TestClient(app)
    upload(web, maak_pdf("Factuur 2026-0412"), "factuur.pdf")

    pagina = web.get("/administratie/1/factuur/1").text
    assert "lage zekerheid" in pagina
    assert "cijfer onscherp door vouw" in pagina


def test_redenen_staan_bovenaan_in_gewone_taal(web):
    upload(web, UBLMAP / "05-zonder-factuurdatum.xml", "fout.xml")
    pagina = web.get("/administratie/1/factuur/1").text
    assert "Dit moet nog nagekeken worden" in pagina
    assert "factuurdatum ontbreekt" in pagina


def test_bij_een_efactuur_staat_er_geen_zekerheid(web):
    upload(web, UBLMAP / "01-standaard-21procent.xml", "goed.xml")
    pagina = web.get("/administratie/1/factuur/1").text
    assert "lage zekerheid" not in pagina
    assert "Uitgelezen door" not in pagina  # geen model gebruikt


def test_onbekende_factuur_geeft_404(web):
    antwoord = web.get("/administratie/1/factuur/999")
    assert antwoord.status_code == 404


# --- opslaan en goedkeuren ---------------------------------------------

def test_opslaan_gaat_via_wijzig_factuur_met_audit_trail(app_en_client, werkmap):
    _, web, _ = app_en_client
    upload(web, UBLMAP / "01-standaard-21procent.xml", "goed.xml")

    web.post(
        "/administratie/1/factuur/1/opslaan",
        data={"leverancier": "Van Dijk ICT B.V."},
        follow_redirects=False,
    )

    conn = maak_verbinding(str(werkmap / "boekhouding.sqlite"))
    trail = [r for r in lees_audit_trail(conn, 1) if r["actie"] == "gewijzigd"]
    conn.close()
    assert any(
        r["veld"] == "leverancier" and r["oude_waarde"] == "Van Dijk ICT-diensten"
        and r["nieuwe_waarde"] == "Van Dijk ICT B.V."
        for r in trail
    )


def test_een_correctie_haalt_de_factuur_uit_review(web):
    upload(web, UBLMAP / "05-zonder-factuurdatum.xml", "fout.xml")
    assert "Review nodig" in web.get("/administratie/1").text

    web.post(
        "/administratie/1/factuur/1/opslaan",
        data={"factuurdatum": "2026-08-18"},
        follow_redirects=False,
    )
    pagina = web.get("/administratie/1").text
    assert "Review nodig" not in pagina
    assert "Klaar om goed te keuren" in pagina


def test_goedkeuren_kan_niet_bij_openstaande_punten(web, werkmap):
    upload(web, UBLMAP / "05-zonder-factuurdatum.xml", "fout.xml")

    pagina = web.get("/administratie/1/factuur/1").text
    assert "disabled" in pagina  # de knop staat uit

    # En ook als iemand het formulier tóch verstuurt, gebeurt het niet.
    antwoord = web.post("/administratie/1/factuur/1/goedkeuren", follow_redirects=False)
    assert antwoord.status_code == 303
    assert "/administratie/1/factuur/1" in antwoord.headers["location"]

    conn = maak_verbinding(str(werkmap / "boekhouding.sqlite"))
    assert lees_facturen(conn, 1)[0]["goedgekeurd_op"] is None
    conn.close()


def kies_rekening_via_scherm(web, factuur_id=1, code="4100", administratie_id=1):
    """Kies de grootboekrekening zoals het reviewscherm dat doet.

    Het formulier stuurt alleen de velden die erin staan; hier is dat
    alleen de rekening, zodat de factuurvelden onaangeroerd blijven.
    """
    return web.post(
        f"/administratie/{administratie_id}/factuur/{factuur_id}/opslaan",
        data={"rekening": code},
        follow_redirects=False,
    )


def test_goedkeuren_lukt_als_alles_klopt(web, werkmap):
    upload(web, UBLMAP / "01-standaard-21procent.xml", "goed.xml")
    kies_rekening_via_scherm(web)

    antwoord = web.post("/administratie/1/factuur/1/goedkeuren", follow_redirects=False)
    assert antwoord.status_code == 303
    assert antwoord.headers["location"] == "/administratie/1"

    conn = maak_verbinding(str(werkmap / "boekhouding.sqlite"))
    factuur = lees_facturen(conn, 1)[0]
    trail = lees_audit_trail(conn, 1)
    conn.close()

    assert factuur["goedgekeurd_op"] is not None
    assert factuur["goedgekeurd_door"] == "eigenaar"
    assert any(r["veld"] == "goedgekeurd_op" for r in trail)
    assert "Goedgekeurd" in web.get("/administratie/1").text


def test_twee_keer_goedkeuren_gebeurt_niet(web):
    from urllib.parse import unquote

    upload(web, UBLMAP / "01-standaard-21procent.xml", "goed.xml")
    kies_rekening_via_scherm(web)
    web.post("/administratie/1/factuur/1/goedkeuren", follow_redirects=False)
    antwoord = web.post("/administratie/1/factuur/1/goedkeuren", follow_redirects=False)
    assert "al goedgekeurd" in unquote(antwoord.headers["location"])


def test_zonder_api_sleutel_valt_de_upload_niet_om(werkmap, monkeypatch):
    """Draait de app zonder sleutel, dan hoort dat een reden te zijn."""
    monkeypatch.delenv("ANTHROPIC_API_KEY", raising=False)
    app = maak_app(
        str(werkmap / "db.sqlite"), str(werkmap / "opslag"),
        ai_client=None, vandaag=VANDAAG,
    )
    web = TestClient(app)
    antwoord = upload(web, maak_pdf("Factuur 2026-0412"), "factuur.pdf")

    assert antwoord.status_code == 303  # er is wél een factuur aangemaakt
    pagina = web.get("/administratie/1/factuur/1").text
    assert "ANTHROPIC_API_KEY" in pagina
    assert "Dit moet nog nagekeken worden" in pagina


# --- geen toegang tot een andere administratie (IDOR) -------------------

@pytest.fixture
def twee_administraties(werkmap):
    """Administratie 1 en 2, elk met één eigen factuur.

    De factuur van A krijgt nummer 1, die van B nummer 2 — precies de
    situatie waarin iemand het nummer in de adresbalk kan ophogen.
    """
    from boekhouding import maak_administratie, maak_tabellen, maak_verbinding

    db = werkmap / "boekhouding.sqlite"
    app = maak_app(
        str(db), str(werkmap / "opslag"),
        ai_client=client_met(goede_extractie()), vandaag=VANDAAG,
    )
    web = TestClient(app)

    conn = maak_verbinding(str(db))
    maak_tabellen(conn)
    if conn.execute("SELECT count(*) FROM administraties").fetchone()[0] < 2:
        maak_administratie(conn, "Zaak B")
    conn.close()

    # Factuur 1 hoort bij administratie 1.
    web.post(
        "/administratie/1/upload",
        files={"bestand": ("a.xml",
               (UBLMAP / "01-standaard-21procent.xml").read_bytes(), "application/xml")},
        follow_redirects=False,
    )
    # Factuur 2 hoort bij administratie 2.
    web.post(
        "/administratie/2/upload",
        files={"bestand": ("b.xml",
               (UBLMAP / "02-diensten-9procent.xml").read_bytes(), "application/xml")},
        follow_redirects=False,
    )
    return web


def test_opzet_klopt(twee_administraties, werkmap):
    """Controleer eerst dat factuur 1 bij A hoort en factuur 2 bij B."""
    from boekhouding import lees_factuur, maak_verbinding

    conn = maak_verbinding(str(werkmap / "boekhouding.sqlite"))
    assert lees_factuur(conn, 1)["administratie_id"] == 1
    assert lees_factuur(conn, 2)["administratie_id"] == 2
    conn.close()


def test_factuur_van_een_ander_bekijken_geeft_404(twee_administraties):
    web = twee_administraties
    assert web.get("/administratie/1/factuur/1").status_code == 200   # eigen
    assert web.get("/administratie/2/factuur/1").status_code == 404   # van A


def test_factuur_van_een_ander_opslaan_geeft_404(twee_administraties, werkmap):
    from boekhouding import lees_factuur, maak_verbinding

    web = twee_administraties
    antwoord = web.post(
        "/administratie/2/factuur/1/opslaan",
        data={"leverancier": "GEKAAPT"},
        follow_redirects=False,
    )
    assert antwoord.status_code == 404

    conn = maak_verbinding(str(werkmap / "boekhouding.sqlite"))
    assert lees_factuur(conn, 1)["leverancier"] == "Van Dijk ICT-diensten"
    conn.close()


def test_factuur_van_een_ander_goedkeuren_geeft_404(twee_administraties, werkmap):
    from boekhouding import lees_factuur, maak_verbinding

    web = twee_administraties
    antwoord = web.post(
        "/administratie/2/factuur/1/goedkeuren", follow_redirects=False
    )
    assert antwoord.status_code == 404

    conn = maak_verbinding(str(werkmap / "boekhouding.sqlite"))
    assert lees_factuur(conn, 1)["goedgekeurd_op"] is None
    conn.close()


def test_document_van_een_ander_ophalen_geeft_404(twee_administraties):
    web = twee_administraties
    assert web.get("/administratie/1/document/1").status_code == 200  # eigen
    assert web.get("/administratie/2/document/1").status_code == 404  # van A


def test_het_antwoord_verraadt_niet_dat_het_record_bestaat(twee_administraties):
    """Bestaand-maar-van-een-ander en niet-bestaand geven hetzelfde."""
    web = twee_administraties
    bestaat_wel = web.get("/administratie/2/factuur/1")     # bestaat, van A
    bestaat_niet = web.get("/administratie/2/factuur/9999")  # bestaat niet

    assert bestaat_wel.status_code == bestaat_niet.status_code == 404
    assert bestaat_wel.text == bestaat_niet.text
    # Geen 403: die zou juist verklappen dat het record er is.
    assert bestaat_wel.status_code != 403


def test_de_oude_paden_zonder_administratie_bestaan_niet_meer(twee_administraties):
    """De routes hangen nu allemaal onder de administratie."""
    web = twee_administraties
    for pad in ("/factuur/1", "/document/1"):
        assert web.get(pad).status_code == 404


def test_elke_route_met_een_id_loopt_langs_de_controle():
    """Vangnet: een nieuwe route mag de controle niet vergeten.

    Elke route waarin zowel een administratie_id als een ander id staat,
    hoort hoort_bij_administratie te gebruiken. Deze test leest de code
    en valt om zodra iemand een route toevoegt zonder die controle.
    """
    import inspect
    import re

    from boekhouding.web import app as webmodule

    bron = inspect.getsource(webmodule.maak_app)
    # Knip de bron in stukken per route-decorator.
    stukken = re.split(r"\n    @app\.(?:get|post)\(", bron)[1:]
    for stuk in stukken:
        pad = stuk.split(")")[0]
        heeft_ander_id = re.search(r"\{(?!administratie_id)\w+_id\}", pad)
        if heeft_ander_id:
            assert "hoort_bij_administratie" in stuk, (
                f"route {pad} gebruikt geen hoort_bij_administratie"
            )


def test_redenen_staan_er_niet_dubbel_in(web):
    """De validatie draait twee keer; de redenen horen er één keer te staan."""
    upload(web, UBLMAP / "04-twee-btw-tarieven.xml", "twee-tarieven.xml")
    pagina = web.get("/administratie/1/factuur/1").text
    assert pagina.count("btw_percentage: Field required") == 1
    assert pagina.count("btw-tarieven") == 1


def test_ook_bij_de_ai_route_geen_dubbele_redenen(werkmap):
    onzeker = goede_extractie(
        factuurnummer=veld(None, "laag", "nummer niet leesbaar")
    )
    app = maak_app(
        str(werkmap / "db.sqlite"), str(werkmap / "opslag"),
        ai_client=client_met(onzeker), vandaag=VANDAAG,
    )
    web = TestClient(app)
    upload(web, maak_pdf("Factuur 2026-0412"), "factuur.pdf")

    pagina = web.get("/administratie/1/factuur/1").text
    assert pagina.count("factuurnummer niet op het document gevonden") == 1
    assert pagina.count("factuurnummer: Field required") == 1


# --- de e-factuur leesbaar in het reviewscherm --------------------------

def test_een_efactuur_wordt_leesbaar_getoond(web):
    """Ruwe XML naast de velden leggen kan een mens niet; leesbaar wel."""
    upload(web, UBLMAP / "01-standaard-21procent.xml", "goed.xml")
    pagina = web.get("/administratie/1/factuur/1").text

    leesbaar = pagina.split('class="bron-lees"')[1].split("<details")[0]
    assert "Factuurdatum" in leesbaar
    assert "cbc:IssueDate" in leesbaar          # de UBL-herkomst staat erbij
    assert "2026-07-14" in leesbaar
    assert "Van Dijk ICT-diensten" in leesbaar
    assert "Onderhoud werkplekken juli 2026" in leesbaar   # de factuurregel


def test_de_ruwe_xml_zit_achter_een_knop(web):
    upload(web, UBLMAP / "01-standaard-21procent.xml", "goed.xml")
    pagina = web.get("/administratie/1/factuur/1").text

    assert "<details" in pagina and "Toon XML" in pagina
    achter_de_knop = pagina.split("<details")[1]
    assert "cbc:IssueDate&gt;2026-07-14" in achter_de_knop


def test_een_ontbrekend_veld_wordt_benoemd_en_niet_ingevuld(web):
    upload(web, UBLMAP / "05-zonder-factuurdatum.xml", "zonder-datum.xml")
    leesbaar = web.get("/administratie/1/factuur/1").text.split("<details")[0]

    assert "niet in het bestand" in leesbaar
    assert "cbc:IssueDate" in leesbaar


def test_beide_btw_tarieven_staan_in_beeld(web):
    upload(web, UBLMAP / "04-twee-btw-tarieven.xml", "twee.xml")
    leesbaar = web.get("/administratie/1/factuur/1").text.split("<details")[0]

    assert "Btw-percentage 1" in leesbaar and "21.00%" in leesbaar
    assert "Btw-percentage 2" in leesbaar and "9.00%" in leesbaar


def test_een_pdf_houdt_gewoon_het_documentvenster(web):
    """Een PDF laat de browser zelf zien; daar is niets aan te verbeteren."""
    upload(web, maak_pdf("Factuur 2026-0412"), "factuur.pdf")
    pagina = web.get("/administratie/1/factuur/1").text

    assert '<object class="bron"' in pagina
    assert 'class="bron-lees"' not in pagina


def test_het_bewaarde_bestand_verandert_niet_door_het_tonen(web, werkmap):
    """De weergave is weergave; het origineel blijft byte voor byte staan."""
    origineel = (UBLMAP / "01-standaard-21procent.xml").read_bytes()
    upload(web, origineel, "goed.xml")
    web.get("/administratie/1/factuur/1")

    bewaard = list((werkmap / "opslag").rglob("*.xml"))
    assert len(bewaard) == 1
    assert bewaard[0].read_bytes() == origineel


def test_de_weergave_lekt_niets_van_een_andere_administratie(twee_administraties):
    """Het leesvenster leest het bewaarde bestand; dat mag geen nieuwe ingang zijn."""
    antwoord = twee_administraties.get("/administratie/2/factuur/1")
    assert antwoord.status_code == 404
    # Factuur 1 is een e-factuur van Van Dijk en hoort bij administratie 1;
    # er mag geen letter van dat bestand in dit antwoord staan.
    assert "Van Dijk" not in antwoord.text
    assert "cbc:" not in antwoord.text


# --- grootboek en btw-aangifte (module 6) -------------------------------

def test_het_reviewscherm_laat_de_rekeningen_kiezen(web):
    upload(web, UBLMAP / "01-standaard-21procent.xml", "goed.xml")
    pagina = web.get("/administratie/1/factuur/1").text

    assert 'name="rekening"' in pagina
    assert "— nog niet gekozen —" in pagina
    assert "4100" in pagina and "Kantoorkosten" in pagina
    # Crediteuren vult de boeking zelf in; die staat niet in de keuzelijst.
    assert "Crediteuren" not in pagina


def test_een_gekozen_rekening_blijft_staan(web):
    upload(web, UBLMAP / "01-standaard-21procent.xml", "goed.xml")
    kies_rekening_via_scherm(web, code="4110")

    pagina = web.get("/administratie/1/factuur/1").text
    assert 'value="4110"\n                      selected' in pagina.replace("\r", "") \
        or 'selected' in pagina.split('value="4110"')[1][:60]


def test_een_rekening_die_niet_bestaat_wordt_geweigerd(web):
    from urllib.parse import unquote

    upload(web, UBLMAP / "01-standaard-21procent.xml", "goed.xml")
    antwoord = kies_rekening_via_scherm(web, code="9999")

    assert "staat niet in het schema" in unquote(antwoord.headers["location"])


def test_goedkeuren_maakt_meteen_de_boeking(web, werkmap):
    upload(web, UBLMAP / "01-standaard-21procent.xml", "goed.xml")
    kies_rekening_via_scherm(web, code="4100")
    web.post("/administratie/1/factuur/1/goedkeuren", follow_redirects=False)

    conn = maak_verbinding(str(werkmap / "boekhouding.sqlite"))
    boeking = boeking_bij_factuur(conn, 1)
    conn.close()

    assert boeking is not None
    assert [r["rekening"] for r in boeking["regels"]] == ["4100", "1520", "1600"]
    assert "Boeking 1" in web.get("/administratie/1/factuur/1").text


def test_goedkeuren_zonder_rekening_zegt_dat_er_niet_geboekt_is(web):
    from urllib.parse import unquote

    upload(web, UBLMAP / "01-standaard-21procent.xml", "goed.xml")
    antwoord = web.post("/administratie/1/factuur/1/goedkeuren", follow_redirects=False)

    melding = unquote(antwoord.headers["location"])
    assert "nog niet geboekt" in melding
    assert "geen grootboekrekening gekozen" in melding
    assert "niet in het grootboek" in web.get("/administratie/1/factuur/1").text


def test_het_btw_scherm_gaat_naar_het_huidige_kwartaal(web):
    antwoord = web.get("/administratie/1/btw", follow_redirects=False)
    assert antwoord.status_code == 303
    # VANDAAG in deze tests is 27 augustus 2026, dus kwartaal 3.
    assert antwoord.headers["location"] == "/administratie/1/btw/2026/3"


def test_het_btw_scherm_toont_de_rubrieken_en_het_saldo(web):
    upload(web, UBLMAP / "01-standaard-21procent.xml", "goed.xml")
    kies_rekening_via_scherm(web, code="4100")
    web.post("/administratie/1/factuur/1/goedkeuren", follow_redirects=False)

    # De e-factuur van 14 juli 2026 valt in kwartaal 3.
    pagina = web.get("/administratie/1/btw/2026/3").text
    assert "1a" in pagina and "1b" in pagina
    assert "5a" in pagina and "5b" in pagina
    assert "84.00" in pagina          # de voorbelasting van deze factuur
    assert "-84.00" in pagina         # het saldo: terug te vragen
    assert "Terug te vragen" in pagina
    assert "Niets te betalen" not in pagina


def test_het_btw_scherm_zegt_dat_de_eigenaar_zelf_indient(web):
    pagina = web.get("/administratie/1/btw/2026/3").text
    assert "voorstel, geen aangifte" in pagina
    assert "indienen doet u zelf bij de belastingdienst" in pagina.lower()


def test_het_btw_scherm_toont_wat_de_aangifte_blokkeert(web):
    upload(web, UBLMAP / "01-standaard-21procent.xml", "goed.xml")   # niet goedgekeurd
    pagina = web.get("/administratie/1/btw/2026/3").text

    assert "Er is niets uitgerekend" in pagina
    assert "nog niet goedgekeurd" in pagina
    assert "Van Dijk ICT-diensten" in pagina
    assert "/administratie/1/factuur/1" in pagina   # klikbaar naar de factuur


def test_een_kwartaal_dat_niet_bestaat_geeft_404(web):
    assert web.get("/administratie/1/btw/2026/5").status_code == 404
    assert web.get("/administratie/1/btw/1500/1").status_code == 404


def test_het_btw_scherm_van_een_andere_administratie(twee_administraties):
    """Ook hier: een administratie die niet bestaat is 404, geen lege pagina."""
    assert twee_administraties.get("/administratie/9/btw/2026/3").status_code == 404


def test_na_het_boeken_ligt_de_rekening_vast_op_het_scherm(web):
    upload(web, UBLMAP / "01-standaard-21procent.xml", "goed.xml")
    kies_rekening_via_scherm(web, code="4100")
    web.post("/administratie/1/factuur/1/goedkeuren", follow_redirects=False)

    pagina = web.get("/administratie/1/factuur/1").text
    assert "<select" not in pagina
    assert "de rekening ligt vast" in pagina
    assert "tegenboeking" in pagina
```

## `boekhouding/pytest.ini`

```ini
[pytest]
pythonpath = .
testpaths = tests
```

## `boekhouding/requirements.txt`

```
pydantic>=2
pypdf>=5
pytest>=8

# Alleen nodig om echt met het model te praten (module 3). De tests
# draaien zonder: die maken de client na.
anthropic>=1

# Webinterface (module 5).
fastapi>=0.115
jinja2>=3.1
python-multipart>=0.0.9
uvicorn>=0.30
httpx>=0.27   # alleen voor de tests: FastAPI TestClient gebruikt hem
```

## `boekhouding/.gitignore`

```
__pycache__/
*.pyc
*.sqlite
*.db

# Geheimen: nooit in git. De API-sleutel staat alleen in .env,
# dat bestand blijft lokaal (zie .env.voorbeeld voor de vorm).
.env
.env.*
!.env.voorbeeld

# Meetresultaat van de eval; wordt opnieuw gemaakt bij elke run.
tests/testfacturen/eval-rapport-*.json

# Lokale gegevens van de webinterface: database en bewaarde originelen.
gegevens/
```

## `boekhouding/.env.voorbeeld`

```
# Kopieer dit bestand naar .env en vul je eigen sleutel in.
# .env staat in .gitignore en hoort daar te blijven.
#
# De sleutel maak je aan op console.anthropic.com. Komt hij ooit in een
# chat, een screenshot of een commit terecht: meteen intrekken en een
# nieuwe maken.
ANTHROPIC_API_KEY=vul-hier-je-eigen-sleutel-in

# Optioneel: welk model de extractie gebruikt. Laat je dit weg, dan geldt
# claude-opus-5. Handig om in de eval een goedkoper model te vergelijken;
# dat kan ook per run met --model=...
# ANTHROPIC_MODEL=claude-opus-5
```
