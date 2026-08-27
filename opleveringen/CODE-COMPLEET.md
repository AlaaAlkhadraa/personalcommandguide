# Volledige code — boekhoudsysteem, modules 1 t/m 3

Branch `claude/nl-accounting-invoice-module-f2vzr3`. Wordt bij elke oplevering ververst.

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
- **`python scripts/handmatige_api_test.py [bestand]`** — één echte aanroep,
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

157 pytest-tests, één of meer per controle, inclusief foute inputs: floats,
onzin-tekst, ontbrekende velden, verkeerde btw-percentages, ambigue
bedragen, toekomst- en te oude datums, duplicaten, de audit trail bij
aanmaken en wijzigen, en voor module 2: een PDF zonder tekstlaag, een
kapotte PDF, een bestand dat geen PDF is, een leeg bestand, een bestand dat
niet bestaat, dezelfde PDF twee keer aanbieden, en bestandssoorten binnen en
buiten de witte lijst (`.docx` en een bestand zonder extensie gaan ter
review). De test-PDF's worden in
de tests zelf gegenereerd (`maak_pdf` in `conftest.py`); er wordt niets
gedownload. `python -m pytest` in deze map draait alles.

---

# Broncode

## `boekhouding/boekhouding/__init__.py`

```python
"""Boekhoudsysteem voor Nederlandse zzp'ers.

Module 1: factuur-schema, validatie en audit trail.
Module 2: PDF-tekstextractie en veilige bewaring van originelen.
Module 3: AI-extractie van factuurgegevens (voorstel, geen boeking).

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
    "api_sleutel",
    "sleutel_aanwezig",
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

# Bestandssoorten die we bewaren. Een factuur komt binnen als PDF of
# als foto/scan; iets anders wordt niet gegokt maar ter review gelegd.
TOEGESTANE_EXTENSIES = (".pdf", ".jpg", ".jpeg", ".png")


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


def beoordeel_extractie(
    extractie: FactuurExtractie, *, vandaag=None, is_duplicaat=None
) -> tuple[str, list[str], Optional[Factuur]]:
    """Zet een extractie om in een status, redenen en een nette factuur.

    Twee soorten redenen komen samen: wat het model zelf aangeeft
    (ontbrekend veld of lage zekerheid, met prefix "extractie:") en wat
    de rekencontroles van module 1 vinden. De AI rekent niet mee.
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
        client = maak_client(env_pad)

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
    return ExtractieResultaat(
        status=status,
        redenen=redenen,
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
) -> tuple[int, ValidatieResultaat]:
    """Valideer en bewaar een factuur; geef (factuur_id, resultaat) terug.

    Ook een afgekeurde factuur wordt opgeslagen (status "review_nodig"
    met redenen) — er gaat nooit data verloren. De originele ruwe input
    wordt integraal bewaard en elk veld komt in de audit trail.

    document_id koppelt de factuur optioneel aan het bewaarde originele
    bestand (tabel documenten), zodat bij een controle altijd de bron
    terug te vinden is.
    """
    resultaat = valideer_factuur(
        data,
        vandaag=vandaag,
        is_duplicaat=lambda f: _is_duplicaat_in_db(
            conn, administratie_id, f.leverancier, f.factuurnummer
        ),
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

## `boekhouding/scripts/handmatige_api_test.py`

```python
#!/usr/bin/env python3
"""Eén echte API-aanroep, met de hand te draaien.

    python scripts/handmatige_api_test.py [pad-naar-factuur]

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


def schrijf_pdf(pagina: Pagina, pad: str | Path) -> Path:
    """Schrijf één pagina weg als PDF-bestand."""
    stroom = pagina.inhoudsstroom()
    objecten = [
        b"<< /Type /Catalog /Pages 2 0 R >>",
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

    pad = Path(pad)
    pad.parent.mkdir(parents=True, exist_ok=True)
    pad.write_bytes(bytes(uit))
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

---

# Testresultaat

```
........................................................................ [ 91%]
.............                                                            [100%]
157 passed in 0.35s
```
