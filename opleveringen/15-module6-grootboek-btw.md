# Module 6 — Grootboek en btw-aangifte

Het hart van de boekhouding: een goedgekeurde factuur wordt een boeking, en de
boekingen van een kwartaal worden samen een voorstel voor de btw-aangifte.

## 1. Het rekeningschema

`config/rekeningen_2024.json`, `_2025.json`, `_2026.json` — per jaar een lijst
van 36 rekeningen die een zzp'er nodig heeft. Per rekening: een code, een
RGS-code, een omschrijving en een soort (kosten, opbrengsten, activa, passiva,
btw). Niets ervan staat in de code; `rekeningschema.py` leest het bestand van
het boekjaar van de factuur. Is er geen bestand voor dat jaar, dan zegt de
module dat eerlijk in plaats van het schema van een ander jaar te pakken.

Er kan alleen op een rekening uit die lijst worden geboekt. Een code die er
niet in staat wordt geweigerd met reden.

**Eén ding moet je weten voordat je hierop vertrouwt.** De RGS-codes in die
bestanden heb ik zelf samengesteld en ik heb ze **niet** kunnen controleren
tegen de officiële RGS-lijst — deze omgeving heeft daar geen toegang toe. De
code waarop het systeem boekt is het veld `code` (het gewone Nederlandse
rekeningnummer, 4100, 8000, 1600); `rgs_code` is alleen een verwijzing en
staat verder nergens in de logica. Loop die kolom een keer na met je
boekhouder voordat je er een export op baseert. Die waarschuwing staat ook
letterlijk in de configbestanden zelf.

## 2. Boekingen

### De eigenaar kiest de rekening, en die keuze bepaalt de richting

In het reviewscherm staat nu onder de bedragen een keuzelijst met alleen de
kosten- en opbrengstenrekeningen. Bank, crediteuren en btw staan er niet bij:
die vult de boeking zelf in.

| Gekozen rekening | Wat het wordt |
|---|---|
| een **kostenrekening** | inkoopfactuur: btw te vorderen, schuld aan de leverancier |
| een **opbrengstenrekening** | verkoopfactuur: btw af te dragen, vordering op de klant |

Zo weet het systeem of een factuur inkoop of verkoop is zonder het te raden:
het is het gevolg van één keuze van een mens. Zonder keuze ontstaat er geen
boeking, en het scherm zegt dat.

Een inkoopfactuur van 121 euro met 21 euro btw:

```
4100  Kantoorkosten                    100,00 debet
1520  Te vorderen btw                   21,00 debet
1600  Crediteuren                                    121,00 credit
```

Een verkoopfactuur van hetzelfde bedrag:

```
1300  Debiteuren                       121,00 debet
8000  Omzet diensten hoog tarief                     100,00 credit
1510  Te betalen btw hoog tarief                      21,00 credit
```

### Exact in balans, geen tolerantie

Dit is het verschil dat het meeste uitmaakt. Module 1 laat bij een factuur een
cent afronding toe (±0,02), want dat komt op echte facturen voor. Een boeking
niet: één cent verschil betekent dat de administratie niet meer klopt. Zo'n
factuur wordt dus **niet geboekt**:

> de bedragen tellen niet exact op: 100.00 + 21.00 = 121.00, maar er staat
> 121.01. De factuurcontrole laat een cent afronding toe, een boeking niet —
> corrigeer het bedrag eerst

De balans wordt twee keer gecontroleerd: bij het samenstellen, en nog een keer
vlak vóór het opslaan. Dat is met opzet dubbelop — een scheve boeking mag de
database niet in, ook niet als een aanroeper de eerste controle overslaat. Er
is een test die precies dat probeert.

### Nooit wijzigen, nooit verwijderen

Een fout wordt rechtgezet met een **tegenboeking**: dezelfde bedragen aan de
andere kant, met een verwijzing naar het origineel. Beide blijven staan en
samen zijn ze nul — daar is een test voor die per rekening optelt en op nul
uitkomt. Verder:

- dezelfde factuur kan maar één keer worden geboekt (`factuur_id` is UNIQUE);
- een boeking kan maar één keer worden gecorrigeerd;
- **de gekozen rekening ligt vast zodra er een boeking staat.** Dit vond ik
  pas door het scherm zelf te gebruiken: de keuzelijst bleef gewoon
  bewerkbaar na het boeken, terwijl de boeking niet meeverandert. Dan zou de
  factuur iets anders zeggen dan het grootboek. Nu weigert `kies_rekening`
  het en verwijst het scherm naar de tegenboeking.

Elke boeking gaat de audit trail in met haar volledige inhoud, en elke tabel
heeft een `administratie_id`.

## 3. De btw-aangifte per kwartaal

```
1a   omzet belast met het hoge tarief, en de btw daarover
1b   omzet belast met het lage tarief, en de btw daarover
5a   totaal verschuldigde omzetbelasting (de btw uit 1a en 1b)
5b   voorbelasting
saldo   5a min 5b
```

Vaste formules in Python, geen model. Per boeking wordt gekeken welke
btw-rekening erin voorkomt — dat bepaalt de rubriek — en de omzet van
diezelfde boeking is de grondslag. Een tegenboeking heeft de bedragen aan de
andere kant en telt daardoor vanzelf negatief mee; daarom `credit - debet` en
niet alleen `credit`.

Kwartaalgrenzen lopen op de factuurdatum: 31 maart in K1, 1 april in K2.

### Bij twijfel geen getal

Staat er in het kwartaal ook maar één factuur die nog niet rond is, dan wordt
er **niets** uitgerekend — geen rubrieken, geen saldo. Je krijgt een lijst van
wat er open staat, elk met een link naar de factuur. Drie dingen blokkeren:

1. de factuur moet nog nagekeken worden (`review_nodig`);
2. de factuur klopt, maar niemand heeft hem goedgekeurd;
3. de factuur is goedgekeurd, maar er staat geen boeking — meestal omdat er
   geen rekening is gekozen.

**Punt 2 en 3 stonden niet in de opdracht.** Ik heb ze er toch bij gezet omdat
het gevolg hetzelfde is: de factuur bestaat wel en het bedrag telt niet mee.
Wil je alleen op `review_nodig` blokkeren, dan is dat één regel in
`zoek_blokkades` — zeg het en ik haal ze eruit.

Twee dingen worden gemeld zónder te blokkeren, omdat blokkeren daar niet
helpt:

- **facturen zonder factuurdatum** vallen in geen enkel kwartaal en zouden
  anders overal blokkeren of nergens opvallen;
- **omzet zonder btw** (0%, vrijgesteld of verlegd) hoort in rubriek 1e, 2a of
  3a, en die zijn niet gebouwd. Stilzwijgend weglaten mag niet, dus staat het
  bedrag als waarschuwing op het scherm.

## 4. Het scherm

`/administratie/1/btw` gaat naar het kwartaal waar je nu in zit; met de
knoppen erboven loop je terug en vooruit. Op het overzicht staat een knop
"Btw-aangifte" naast "Factuur toevoegen".

Onderaan staat, altijd:

> **Dit is een voorstel, geen aangifte.** Het indienen doet u zelf bij de
> Belastingdienst; dit systeem verstuurt niets.

Schermafbeeldingen: `schermen/breed-btw-voorstel.png` en
`telefoon-6-btw-voorstel.png` (uitgerekend), `telefoon-7-btw-geblokkeerd.png`
(geblokkeerd, met wat er open staat), `breed-review-rekening.png` (de
keuzelijst in het reviewscherm).

Zelf bekijken:

```
python scripts/vul_testdata.py --met-pdf --boek
python scripts/start_webinterface.py
```

Met `--boek` kiest het script bij de facturen die kloppen een rekening, keurt
ze goed en boekt ze — normaal is dat handwerk, hier gebeurt het zodat er iets
te zien is.

## 5. Ook op het scherm gevonden

Een saldo van precies 0,00 meldde "Terug te vragen", want de code kende maar
twee uitkomsten (`saldo > 0` of niet). Nul is geen teruggave. Er zijn nu drie:
te betalen, terug te vragen, of niets — met een test die het vastlegt.

## Tests

76 tests erbij, verdeeld over drie nieuwe bestanden plus de webtests:

- **balans**: kloppende boeking, één cent verschil, een regel die zowel debet
  als credit is, een boeking zonder regels, en een scheve boeking die
  rechtstreeks wordt aangeboden aan de database;
- **richting**: inkoop, verkoop, 9% naar de andere btw-rekening, nultarief
  zonder btw-regel, creditnota met negatieve bedragen;
- **weigeren**: geen rekening, onbekende rekening, balansrekening, ontbrekend
  bedrag, geen factuurdatum, jaar zonder rekeningschema;
- **tegenboeking**: alles aan de andere kant, samen nul, origineel
  ongewijzigd, twee keer corrigeren kan niet, zonder reden kan niet, en een
  correctie in een ander kwartaal;
- **kwartaalgrenzen**: elke maand in het juiste kwartaal, 31 maart in K1,
  1 april in K2, een schrikkeljaar, en kwartaal 5 bestaat niet;
- **aangifte**: een volledig kwartaal van upload tot voorstel, terug te
  vragen, precies nul, een leeg kwartaal, en een tegenboeking die het bedrag
  er weer af haalt;
- **blokkades**: alle drie de oorzaken, dat een blokkade in K3 niets doet met
  K4, en dat er dan echt niets wordt uitgerekend.

```
346 passed in 4.00s
```
