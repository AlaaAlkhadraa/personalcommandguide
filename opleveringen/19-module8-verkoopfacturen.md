# Module 8 — Verkoopfacturen

Geen AI. Jij typt de regels, de code rekent uit en controleert of de factuur
voldoet aan wat de Belastingdienst verplicht stelt.

**Eerst iets over de opdracht.** Je bericht kwam de eerste keer afgekapt binnen,
midden in punt 3 ("Definitief maken levert dire…"). Ik ben begonnen met wat er
volledig stond en heb daarna de complete opdracht gekregen; punt 4 tot en met 8
zitten er dus gewoon in.

## 1. Klanten en je eigen gegevens

Per administratie een klantenlijst: naam, adres, KvK-nummer, btw-id, e-mail en
een betalingstermijn (standaard 30 dagen). Je eigen bedrijfsgegevens staan bij
de administratie zelf, want ze horen op elke factuur: naam, adres, btw-id, KvK
en IBAN. Allebei met audit trail.

## 2. De bedragen komen uit de code

Per regel vul je omschrijving, aantal, prijs per stuk en btw-tarief in. Het
regelbedrag, de btw en de totalen worden berekend — er is geen invoerveld voor.
Zo kan er geen factuur de deur uit met een optelling die niet klopt.

Twee keuzes die je terugziet in de cijfers:

- **Afronden gaat bij een halve cent omhoog**, zoals op papier. Python rondt
  standaard naar even (0,125 wordt 0,12), en dan klopt de factuur niet met wat
  de klant zelf narekent.
- **De btw wordt per tarief over het opgetelde bedrag berekend**, niet als som
  van de afgeronde regelbedragen. Twee regels van 1,05: samen 2,10 en 21%
  daarvan is 0,44 — per regel afronden zou 0,22 + 0,22 = 0,44 geven, maar bij
  andere bedragen loopt er een cent weg.

### Nummering zonder gaten

Doorlopend per administratie per jaar: `2026-0001`, `2026-0002`, … Een concept
heeft nog géén nummer, en dat is precies waarom: zou een concept al genummerd
worden, dan ontstaat er een gat zodra je het weggooit. Er is een test die er
vijf concepten aanmaakt, er een paar tussenuit gooit en daarna controleert dat
de nummers 1, 2, 3 … zijn zonder onderbreking.

### Wat er verplicht op moet

Ontbreekt er iets, dan kan de factuur niet definitief worden en staat de lijst
erbij:

> Dit ontbreekt nog voordat de factuur definitief kan:
> je eigen adres · je btw-identificatienummer · het adres van de klant

Gecontroleerd worden: de factuurdatum, je eigen naam, adres en
btw-identificatienummer, naam en adres van de klant, minstens één regel, en per
regel een omschrijving, een aantal, een prijs en een btw-tarief dat in dat
boekjaar bestaat. Het nummer en de bedragen komen van het systeem, dus die
kunnen niet ontbreken.

Een boekjaar zonder btw-config (2027 bijvoorbeeld) wordt geweigerd met de naam
van het bestand dat mist — er worden geen tarieven van vorig jaar gebruikt.

## 3. Concept versus definitief

| | Wijzigen | Weggooien | Nummer | Boeking | PDF |
|---|---|---|---|---|---|
| Concept | ja | ja | nee | nee | nee |
| Definitief | **nooit** | **nooit** | ja | ja | ja |

Definitief maken doet vier dingen tegelijk: het nummer toekennen, de klant- en
eigen gegevens vastleggen zoals ze op dát moment zijn, de boeking maken en de
PDF genereren. Verhuist de klant later, dan verandert de verstuurde factuur
niet mee; daar is een test voor.

Lukt de boeking niet, dan wordt het hele definitief maken teruggedraaid. Anders
zou er een factuurnummer bestaan zonder dat er iets in het grootboek staat.

De boeking:

```
1300  Debiteuren                 943,72 debet
8000  Omzet hoog tarief                  712,50 credit
8010  Omzet laag tarief                   74,85 credit
1510  Te betalen btw hoog                149,63 credit
1511  Te betalen btw laag                  6,74 credit
```

Welke omzetrekening bij welk tarief hoort staat in het rekeningschema van dat
boekjaar en is per regel te overrulen — er wordt niets geraden.

Een fout zet je recht met een **creditfactuur**: dezelfde regels met een
negatief aantal en een verwijzing naar het origineel. Een test telt beide
boekingen per rekening op en komt op nul uit.

## 4. De PDF

`factuur_pdf.py` gebruikt dezelfde schrijver als het testmateriaal. Die is
daarvoor verhuisd van `tests/testmateriaal/` naar het pakket zelf, zodat er één
plek is waar de opmaak van een factuur wordt bepaald. Geen externe
bibliotheek.

De PDF gaat door de gewone documentopslag: onder de hash van de inhoud,
alleen-lezen, nooit overschreven, zeven jaar. Er zit geen tijdstempel in, dus
twee keer genereren geeft byte-voor-byte hetzelfde bestand — en daarmee
dezelfde hash. Een test leest de PDF terug en controleert dat alle verplichte
gegevens er letterlijk in staan.

## 5. Btw-aangifte — en een fout die dit blootlegde

Je vroeg om te controleren of de bestaande aangifte verkoopfacturen goed
meeneemt. Dat deed hij niet.

De aangifte keek per boeking naar de btw-rekening en zette **alle** omzet van
die boeking in één rubriek. Bij een inkoopfactuur klopt dat, want die heeft één
tarief. Een verkoopfactuur kan er twee hebben — en dan belandde de hele omzet
in 1a en viel de 9%-btw helemaal weg. Op een factuur van 712,50 (21%) plus
74,85 (9%) stond er dan 787,35 omzet in 1a en 6,74 btw nergens.

De aangifte deelt de omzet nu in op de omzetrekening: 8000 hoort bij 21%, 8010
bij 9%, en die koppeling staat in het rekeningschema. Terugrekenen uit het
btw-bedrag zou ook kunnen, maar dan gaat het bij de eerste afronding mis. Staat
er omzet op een rekening die niet aan een tarief hangt terwijl er meerdere
tarieven in de boeking zitten, dan wordt dat gemeld in plaats van ergens bij
opgeteld.

## 6. Openstaande posten

Een definitieve verkoopfactuur staat open tot er een bijschrijving aan
gekoppeld is. Het verkoopscherm toont het totaal, per factuur hoeveel dagen die
over de vervaldatum is, en hoeveel er te laat zijn:

> **Openstaand: 3847,72 · 1 te laat**
> 2026-0001 · Van Dijk ICT-diensten — 21 dagen over de vervaldatum · 943,72
> 2026-0002 · Van Dijk ICT-diensten — vervalt over 14 dagen · 2904,00

Het afletteren van module 7 kent nu twee soorten kandidaten: ontvangen facturen
en eigen verkoopfacturen. Elke kandidaat draagt een `bron`, de keuzelijst op het
bankscherm zet er "(eigen factuur)" achter, en bevestigen boekt bank debet
tegen debiteuren credit.

Daarbij is de richtingcontrole scherper geworden. Die keek naar inkoop of
verkoop; nu kijkt hij naar het **teken van het factuurbedrag**. Bij een
creditfactuur gaat het geld de andere kant op, en dat werd eerder geweigerd met
"richting klopt niet".

## 7. De schermen

- **Verkoopfacturen** (`/administratie/1/verkoop`) — tellers, de openstaande
  posten, een formulier om een concept te beginnen, en de lijst met concepten
  bovenaan.
- **Factuur opstellen** — kop plus regels; per regel vier velden en het
  uitgerekende bedrag ernaast. Er staan altijd drie lege regels onder, zodat er
  iets bij kan zonder javascript. "Definitief maken" staat uit zolang er iets
  ontbreekt.
- **Klanten** en **Eigen gegevens** — twee eenvoudige formulierschermen.

Schermafbeeldingen: `schermen/breed-verkoop.png`,
`telefoon-10-verkoop.png`, `breed-verkoopfactuur.png`.

Zelf bekijken:

```
python scripts/vul_testdata.py --met-pdf --boek --bank --verkoop
python scripts/start_webinterface.py
```

## Wat dit niet doet

- **Versturen.** De PDF staat klaar en is te downloaden; e-mailen doet het
  systeem niet.
- **Een e-factuur (UBL) maken.** Inlezen kan wel (module 4), zelf opstellen
  niet.
- **Deelbetalingen op een verkoopfactuur.** Zoals bij inkoop: koppelen kan aan
  één transactie, het restant blijft onzichtbaar.
- **Herinneringen sturen.** De openstaande posten laten wel zien wat te laat
  is.

## Tests

59 tests erbij (509 in totaal):

- **klanten**: standaardtermijn, geen naam, wijziging in de audit trail;
- **rekenen**: regelbedrag, afronden bij een halve cent, btw per tarief over
  het totaal, twee tarieven op één factuur, een float wordt geweigerd, de
  vervaldatum volgt uit de termijn;
- **verplichte gegevens**: zonder eigen gegevens, zonder klantadres, zonder
  regels, zonder datum, een regel zonder omschrijving of prijs, een tarief dat
  niet bestaat, een jaar zonder config, en een complete factuur;
- **nummering**: doorlopend, per jaar opnieuw, een concept heeft geen nummer,
  een weggegooid concept laat geen gat, en de reeks van een jaar heeft geen
  gaten;
- **concept versus definitief**: wijzigen mag, definitief wijzigen niet,
  verwijderen niet, twee keer definitief niet, en de klantgegevens liggen vast;
- **boeking**: de vijf regels, en de balans;
- **creditfactuur**: spiegelen, het volgende nummer, samen nul, een concept
  crediteer je niet, twee keer crediteren niet;
- **PDF**: door de documentopslag, alle verplichte gegevens erin, twee keer
  hetzelfde bestand, en "CREDITFACTUUR" op een creditfactuur;
- **btw-aangifte**: 1a én 1b van één factuur, en een creditfactuur die het er
  weer af haalt;
- **openstaande posten**: te laat, binnen de termijn, een concept telt niet
  mee, de hele keten van factuur tot afgeletterde bijschrijving, en een concept
  dat niet afgeletterd kan worden;
- **schermen**: eigen gegevens, klant toevoegen, klant zonder naam, geen klant
  geen factuur, concept maken en regels invullen, lege regels overslaan,
  definitief maken geblokkeerd, definitief maken gelukt, de PDF ophalen, een
  definitieve factuur niet meer bewerkbaar, de openstaande post op het
  overzicht, en 404 bij een factuur of klant van een andere administratie.

```
509 passed in 12.91s
```
