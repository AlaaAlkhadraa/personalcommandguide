# Fix: twijfel over de richting is geen "akkoord"

Feedback: `_past_de_richting` gaf `True` terug als de richting onbekend was.
Twijfel werd daarmee stilzwijgend akkoord, en zo kon er een voorstel met
zekerheid **hoog** ontstaan op basis van onvolledige gegevens. Dat botst met
Gouden regel 4.

Klopt. De functie had twee uitkomsten voor drie situaties, en de derde werd
bij de gunstigste ingedeeld.

## Wat er nu gebeurt

`past_de_richting` (nu zonder onderstreepje, want het is een echt begrip
geworden) geeft drie uitkomsten:

| Uitkomst | Wanneer | Gevolg |
|---|---|---|
| `past` | geld eraf bij een inkoopfactuur, geld erbij bij een verkoop | zoals eerst |
| `past_niet` | precies andersom | de factuur valt af als kandidaat |
| `onbekend` | geen boeking, of geen rekeningschema voor dat jaar | kandidaat blijft, maar **nooit hoge zekerheid** |

Bij `onbekend` blijft de factuur meedoen — misschien klopt het gewoon — maar
het voorstel zakt naar lage zekerheid met de reden erbij:

> het factuurnummer staat in de omschrijving en het bedrag klopt tot op de
> cent. Let op: de richting van deze factuur is niet bekend, controleer of dit
> een inkoop of verkoop is

Dat geldt voor allebei de soorten voorstel. Bij een exacte match zakt de
zekerheid van hoog naar laag; bij een voorstel dat al laag stond komt de reden
er alsnog bij, want die zegt iets anders dan "er staat geen factuurnummer
bij". Op het scherm betekent dat een geel merkje in plaats van een groen, en
de uitleg eronder vertelt precies wat er ontbreekt.

Wat níét verandert: een factuur waarvan de richting wél bekend is en **niet**
past, valt gewoon af. Twijfel is geen afwijzing, maar een tegenstrijdigheid
wel.

## Waar het vandaan kwam, en wat er al goed ging

`onbekend` ontstaat als `_richting_van_boeking` niets kan vaststellen: er is
geen boeking bij de factuur, of er is geen rekeningschema voor het boekjaar
van die boeking. In de webinterface komt dat zelden voor, omdat `open_facturen`
alleen geboekte facturen teruggeeft — maar het afletteren is een losse functie
die ook zonder die filter aangeroepen kan worden, en dan gold de zwakke regel.

Het bevestigen zelf was overigens al veilig: `stel_betaling_samen` weigert een
factuur zonder bekende richting met "boek de factuur eerst", want zonder
richting is niet te bepalen of er tegen crediteuren of tegen debiteuren geboekt
moet worden. Er kon dus geen verkeerde boeking ontstaan — wel een voorstel dat
zekerder oogde dan het was, en dat is precies het soort ding waar een mens op
afgaat. Daar is nu ook een test voor.

## Tests

7 tests erbij (450 in totaal):

- de drie uitkomsten van `past_de_richting` los;
- een onbekende richting verlaagt een exacte match naar laag, mét de reden;
- een onbekende richting verlaagt ook een voorstel dat al laag stond (de reden
  komt erbij);
- bij een bekende richting blijft het gedrag ongewijzigd — hoog blijft hoog en
  de reden staat er niet;
- een factuur met onbekende richting valt niet af als kandidaat;
- een factuur met de verkeerde richting valt wél af;
- koppelen blijft geweigerd zolang de richting onbekend is.

Ik heb de fix ook omgekeerd geprobeerd: met de oude regel (`onbekend` telt als
`past`) vallen vier van deze tests om. Ze bewijzen dus wat ze beweren.

```
450 passed in 9.32s
```
