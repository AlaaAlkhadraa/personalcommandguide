# Module 7 — Bankafschriften importeren en afletteren

Geen AI. Een bankafschrift is een vast formaat en afletteren is regelwerk:
staat het factuurnummer in de omschrijving en klopt het bedrag, dan is het een
match. Meer zit er niet achter — en meer hoort er ook niet achter te zitten.

## 1. Importeren

`bank.py` leest allebei de formaten die Nederlandse banken leveren.

**MT940** — het oude SWIFT-formaat, platte tekst met `:20:`, `:61:` en `:86:`.
De gestructureerde tags die ING, Rabobank en ABN AMRO in de omschrijvingsregel
zetten (`/IBAN/`, `/NAME/`, `/REMI/`, `/EREF/`) worden herkend. Staan ze er
niet — sommige banken sturen gewoon een zin — dan is de hele regel de
omschrijving en wordt er nog een IBAN in gezocht. Afgebroken regels worden
weer aan elkaar geplakt, want MT940 knipt lange omschrijvingen af.

**CAMT.053** — de XML-opvolger, gelezen met dezelfde veilige parser als de
e-facturen van module 4: geen DTD, geen entiteiten, geen externe verwijzingen,
dezelfde grens van 20 MB die op de bestandsgrootte wordt gecontroleerd vóór
het lezen. De versie achter de naamruimte (.02, .04, .08) verschilt per bank
en per jaar, dus daar wordt op het begin vergeleken. De DTD-aanval uit module
4 ketst hier net zo af, ook in UTF-16.

Het formaat komt uit de **inhoud**, niet uit de bestandsnaam: een MT940 heet
bij de ene bank `.sta` en bij de andere `.txt`. Er is een test die een MT940
met de naam `afschrift.xml` toch als MT940 leest, en andersom.

Per transactie worden datum, bedrag, tegenrekening, tegenpartij, omschrijving
en betalingskenmerk uitgelezen. Bedragen zijn **ondertekend**: negatief is
eraf, positief is erbij. Zo hoeft er nergens anders een debet/credit-vlaggetje
meegesleept te worden. `NONREF` en `NOTPROVIDED` worden herkend als "geen
kenmerk": er staat wel iets, maar er staat niets in.

### Een kapotte regel breekt de import niet af

Een afschrift van 200 regels is onbruikbaar als één rare regel het hele
bestand tegenhoudt. Die regel wordt overgeslagen met een reden erbij, en de
rest wordt gewoon verwerkt. Is er niets te lezen, dan gaat het bestand als
geheel naar review — bijvoorbeeld als er per ongeluk een e-mail wordt
geüpload. Dan staat er ook wat je wél moet doen: een MT940- of
CAMT.053-download bij je bank opvragen.

### Twee keer inlezen voegt niets toe

Elke transactie krijgt een vingerafdruk: datum, bedrag, tegenrekening,
tegenpartij, omschrijving, kenmerk en de bankreferentie, samen gehasht en
uniek per administratie. Dat is sterker dan alleen op de bestandsnaam of het
bestand kijken:

- hetzelfde afschrift twee keer → niets nieuws;
- twee afschriften die elkaar overlappen → alleen wat er nieuw in zit;
- hetzelfde afschrift in het andere formaat → ook niets nieuws. Daar is een
  test voor: eerst de MT940, dan de CAMT van dezelfde maand, en er komt geen
  enkele regel bij.

Het originele afschrift wordt bewaard zoals elk aangeleverd bestand
(bewaarplicht), en elke transactie gaat de audit trail in.

## 2. Afletteren, van streng naar los

| Wat er wordt gevonden | Uitkomst |
|---|---|
| factuurnummer in de omschrijving **én** bedrag klopt exact | voorstel, **hoge** zekerheid |
| bedrag klopt exact **én** tegenpartij lijkt op de leverancier | voorstel, **lage** zekerheid |
| lijkt een deelbetaling of verzamelbetaling | **geen** voorstel, wel uitleg |
| niets gevonden | blijft open staan |

Bij het zoeken naar een factuurnummer worden leestekens weggelaten, dus
`EF-2026-0101`, `EF 2026 0101` en `ef20260101` zijn hetzelfde nummer. Een
nummer korter dan vier tekens wordt **niet** opgezocht: "7" komt in bijna elke
omschrijving voor, en dan koppel je de verkeerde factuur.

Namen vergelijken gebeurt na het weglaten van rechtsvormen en leestekens, dus
"KPN B.V." en "KPN" zijn dezelfde partij. Daarna telt een naam als gelijk
wanneer alle woorden van de kortste in de langste voorkomen, of wanneer de
namen als geheel genoeg op elkaar lijken (75%). Dat laatste vangt "Bakkerij
Korenaar" tegenover "Bakkerij de Korenaar" op.

**Klopt alleen het bedrag en niet de naam, dan komt er geen voorstel.** Er
staat wel bij dat het bedrag ergens bij past, zodat je zelf kunt beslissen —
maar het systeem stelt niets voor. Twee facturen met precies hetzelfde bedrag
van dezelfde leverancier worden ook niet geraden.

**De richting moet kloppen.** Geld eraf hoort bij een inkoopfactuur, geld
erbij bij een verkoopfactuur. Of een factuur inkoop of verkoop is, staat niet
in de factuur maar in haar boeking: staat er crediteuren in, dan is het
inkoop. Geen gok dus, maar het gevolg van de rekening die de eigenaar in
module 6 koos.

## 3. Deelbetalingen en verzamelbetalingen

Drie gevallen leveren met opzet **geen** voorstel op, alleen een uitleg:

- er staan meerdere factuurnummers in de omschrijving — en er staat bij of ze
  samen precies dit bedrag zijn;
- er is minder betaald dan de factuur: een termijn;
- het bedrag is precies het totaal van meerdere openstaande facturen van
  dezelfde partij.

In alle drie de gevallen weet het systeem niet hoe het bedrag verdeeld moet
worden. Gokken zou een factuur op betaald zetten die dat niet is, en dat merk
je pas als de leverancier belt.

## 4. Bevestigen is boeken

Een voorstel is nooit definitief. Pas als de eigenaar bevestigt — of zelf een
factuur kiest — ontstaat de boeking, via dezelfde grootboekfuncties als module
6, dus met balanscontrole en audit trail:

```
Betaling van een inkoopfactuur          Ontvangst op een verkoopfactuur
1600  Crediteuren      484,00 debet     1100  Bankrekening   2904,00 debet
1100  Bankrekening            484,00    1300  Debiteuren            2904,00
                              credit                                credit
```

Een factuur hangt aan hoogstens één transactie en een transactie aan hoogstens
één factuur. Een tweede poging wordt geweigerd met de reden erbij, en een
factuur die nog niet geboekt is kan niet gekoppeld worden ("boek de factuur
eerst").

## 5. Het scherm

`/administratie/1/bank`, ook bereikbaar met de knop **Bank** op het overzicht.
Bovenaan drie tellers: hoeveel transacties nog open staan, hoeveel er een
voorstel hebben, en hoeveel facturen op betaling wachten. Daaronder het
uploadveld en de transacties, openstaande bovenaan.

Per transactie staat het voorstel met een merkje **hoge zekerheid** (groen) of
**lage zekerheid** (geel), de uitleg waarom, en een knop "Bevestigen en
boeken". Daaronder altijd een keuzelijst om zelf te koppelen — maar alleen met
facturen die qua richting kunnen. Bij een afschrijving staan er dus geen
verkoopfacturen in; een keuze aanbieden die daarna alsnog wordt geweigerd is
geen keuze. Er is een test die dat afdwingt, en die omvalt zodra de filtering
eruit gehaald wordt (ik heb het geprobeerd).

Zelf bekijken:

```
python scripts/vul_testdata.py --met-pdf --boek --bank
python scripts/start_webinterface.py
```

Schermafbeeldingen: `schermen/breed-bank.png` en `telefoon-9-bank.png`.

## Wat dit niet doet

- **Een transactie die bij geen enkele factuur hoort** (bankkosten, een
  privé-opname, een abonnement zonder factuur) blijft open staan. Rechtstreeks
  op een grootboekrekening boeken zonder factuur kan nog niet.
- **Ontkoppelen** kan niet. Een verkeerde koppeling zet je recht met een
  tegenboeking op de betaling; de koppeling zelf blijft staan.
- **Deelbetalingen splitsen** kan niet: je kunt de transactie wel met de hand
  aan één factuur koppelen, maar het restant blijft dan als openstaand bedrag
  onzichtbaar.

## Tests

64 tests erbij (442 in totaal):

- **inlezen**: MT940 en CAMT allebei, alle velden, ondertekende bedragen,
  `NONREF`/`NOTPROVIDED`, een duizendtal, een omschrijving zonder tags, een
  afgebroken omschrijving, een andere CAMT-versie, en dat beide formaten
  dezelfde transacties opleveren;
- **weigeren**: geen boekingsregels, XML dat geen afschrift is, een
  DTD-aanval (ook in UTF-16), een te groot bestand, een leeg bestand, kapotte
  XML, en een bestand dat geen afschrift is;
- **duplicaten**: hetzelfde afschrift twee keer, hetzelfde afschrift in het
  andere formaat, en dat de vingerafdrukken per transactie verschillen;
- **matchen**: exacte match (nummer in omschrijving én in kenmerk, in drie
  schrijfwijzen), ontvangst op een verkoopfactuur, verkeerde richting, te kort
  factuurnummer, bedrag met naam (laag), bedrag zonder naam (geen), twee
  facturen met hetzelfde bedrag, deelbetaling, twee soorten
  verzamelbetaling, bedrag hoger dan de factuur, en geen match;
- **koppelen**: de boeking in beide richtingen, de audit trail, twee keer
  koppelen, één factuur per transactie, een ongeboekte factuur, en dat een
  gekoppelde factuur niet meer meedoet;
- **scherm**: leeg scherm, inlezen, dubbel inlezen, een bestand dat geen
  afschrift is, het voorstel met zekerheid, bevestigen, koppelen zonder keuze,
  de keuzelijst per richting, en 404 bij een transactie of factuur van een
  andere administratie.

```
442 passed in 9.69s
```
