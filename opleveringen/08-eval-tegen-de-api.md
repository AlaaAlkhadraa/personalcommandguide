# Eval tegen de API — wat wél kon, wat niet, en één echte vondst

## De korte versie

**De SDK-aanroep werkt.** `client.messages.parse(..., output_format=...)` bestaat
in de geïnstalleerde SDK (`anthropic 1.1.0`) en doet precies wat de code
verwacht. Geen aanpassing nodig.

**De runs zelf kon ik niet doen.** Er is geen `ANTHROPIC_API_KEY` in deze
omgeving, en een sleutel maken kan ik niet — die hoort van jou te komen en mag
volgens de werkafspraken nooit in een gesprek staan. De stappen 2, 3 en 4
(volledige run, sonnet, haiku, kosten per model) staan dus nog open. De
commando's staan onderaan; ze werken zodra je een `.env` neerzet.

**Wel gevonden en gerepareerd:** een fout die elke factuur zou hebben laten
stuklopen. Details onder punt 3.

---

## 1. Werkt de SDK-aanroep?

Ja. Eerst gecontroleerd zonder iets te versturen:

```
bestaat messages.parse?   True
accepteert output_format? True
```

Daarna de volledige aanroep verifieerd tegen een lokale server, dus met de
echte SDK maar zonder kosten. Dit is wat de SDK verstuurt:

```
endpoint      : /v1/messages
model         : claude-opus-5
max_tokens    : 16000
sleutels      : ['max_tokens', 'messages', 'model', 'output_config', 'system']
schema-velden : ['bedrag_excl', 'bedrag_incl', 'btw_bedrag', 'btw_percentage',
                 'factuurdatum', 'factuurnummer', 'leverancier']
```

`output_format=FactuurExtractie` wordt door de SDK omgezet naar
`output_config.format.schema` met alle zeven velden. Het antwoord komt terug
als `parsed_output`, gaat door `valideer_factuur` en levert `gevalideerd`. De
hele keten klopt dus — alleen het model zelf is nog niet gehoord.

## 2, 3 en 4. De runs — geblokkeerd

| Wat | Status |
|---|---|
| SDK geïnstalleerd | ja (`anthropic 1.1.0`) |
| `.env` met sleutel | **nee** |
| `ANTHROPIC_API_KEY` in de omgeving | **nee** |
| `ant`-CLI met profiel | **nee** |

Zonder sleutel geen aanroep, en dus geen cijfers over hoe goed opus, sonnet en
haiku deze facturen lezen. Ik ga geen scores verzinnen.

Zodra je een `.env` hebt (kopieer `.env.voorbeeld`, vul je sleutel in — dat
bestand staat in `.gitignore`):

```
python scripts/eval_extractie.py --ja 01                        # eerst één
python scripts/eval_extractie.py --ja                           # standaardmodel
python scripts/eval_extractie.py --ja --model=claude-sonnet-5
python scripts/eval_extractie.py --ja --model=claude-haiku-4-5
```

Elk model schrijft zijn eigen `eval-rapport-<model>.json`, dus de drie runs
overschrijven elkaar niet.

## 3. De vondst: Nederlandse datums lieten alles stuklopen

Bij het draaien van de eval tegen de lokale endpoint kwam **elke** factuur
terug als `review_nodig`, terwijl alle zeven velden correct waren. De reden:

```
factuurdatum: Input should be a valid date or datetime, invalid character in year
```

Mijn nepserver gaf de datum terug zoals die op de factuur staat —
`12-07-2026` — in plaats van als ISO. De systeemprompt vraagt het model wel om
`JJJJ-MM-DD`, maar regel 1 van diezelfde prompt zegt "vul alleen in wat je
letterlijk ziet". Geeft het model ooit de geschreven vorm terug, dan liep tot
nu toe élke factuur vast, met een melding waar de eigenaar niets aan heeft.

Dat is nu gerepareerd, met dezelfde redenering als bij ambigue bedragen:

| Invoer | Uitkomst |
|---|---|
| `2026-07-12` | 2026-07-12 |
| `31-07-2026` | 2026-07-31 — 31 kan alleen een dag zijn, niets te gokken |
| `12-07-2026` | `review_nodig`: "ambigue datum … kan 12 van maand 7 of 7 van maand 12 zijn" |
| `03-04-2026` | `review_nodig`, beide lezingen genoemd |
| `2026-13-01` | `review_nodig` (bestaat niet) |

Het is opvallend dat het schema Nederlandse *bedragen* al netjes aankon
(`1.250,00`) maar Nederlandse *datums* niet, terwijl beide gewoon op de
factuur staan. Die inconsistentie is nu weg. Vijf tests erbij.

## 4. Kosten meetbaar gemaakt

`ExtractieResultaat` draagt nu `invoer_tokens` en `uitvoer_tokens` uit de
`usage` van het antwoord. De eval telt die op en rekent ze om:

```
Tokens   : 24000 in, 1900 uit
Kosten   : $0.1675 voor deze run ($0.0167 per factuur)
```

De prijstabel (`$5/$25` voor opus-5, `$2/$10` voor sonnet-5, `$1/$5` voor
haiku-4.5, per miljoen tokens) staat mét waarschuwing in het script: het is
een momentopname en geen bron van waarheid. Een model dat er niet in staat
levert de tokens op met "kosten onbekend" — er wordt geen prijs verzonnen.

De bovenstaande cijfers komen uit de lokale simulatie en zeggen dus alleen dat
de berekening werkt, niet wat een echte run kost. Ruwe schatting voor tien
facturen: de tekstfacturen zijn klein (~2.500 tokens elk), de scan is groter.

## Wat de lokale proefrun liet zien

De volledige eval, met de echte SDK tegen een lokale endpoint die de
grondwaarheid teruggeeft met twee bewuste afwijkingen:

```
OK  01-standaard-21procent.pdf     velden 7/7  status gevalideerd
MIS 02-catering-9procent.pdf       velden 6/7  status review_nodig
       fout       bedrag_excl: gelezen '18,00', verwacht '180.00'
OK  09-zonder-factuurnummer.pdf    velden 6/7
    !! verzonnen  factuurnummer: '2026-VERZONNEN' staat niet op het document

!! VERZONNEN: 1 veld(en) ingevuld die niet op het document staan.
```

De verzonnen-detectie werkt, de kostenregel werkt, het rapport wordt
geschreven. Wat er in die uitdraai nog misging bij factuur 06 en 08 komt door
mijn ruwe nepserver (die koos bij 06 de gegevens van 01, omdat het
factuurnummer van 01 in de tekst van de creditnota staat als verwijzing) — dat
is geen fout in de code.

## Testresultaat

```
157 passed in 0.39s
```

## Commits

- `09c95b9` — Nederlandse datumnotatie accepteren, plus tokenverbruik en
  kosten in de eval
