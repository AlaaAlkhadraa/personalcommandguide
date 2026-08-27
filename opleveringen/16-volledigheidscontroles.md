# Volledigheidscontroles: merken wat er níét is

Feedback: de aangifte blokkeert op facturen die er zijn maar nog review nodig
hebben. Een factuur die de klant nooit heeft aangeleverd staat nergens — de
aangifte rekent dan een te laag bedrag uit dat er correct uitziet.

Dat klopt, en het is inderdaad het gevaarlijkste geval: blokkeren kan alleen op
wat je ziet. `volledigheid.py` kijkt daarom naar het patróón in plaats van naar
de facturen zelf.

## Drie controles

### 1. Een leverancier die ineens ontbreekt

Kwam iemand minstens drie maanden op rij langs, doorlopend tot vlak vóór het
kwartaal, en staat hij dit kwartaal nergens?

> KPN staat sinds oktober 2025 elke maand op de lijst maar ontbreekt dit
> kwartaal (laatste factuur 2026-06-05) — is die factuur er wel?

Drie maanden is de ondergrens: twee keer is toeval, drie is een patroon. Een
gat in de reeks breekt hem (wie april oversloeg kwam niet "elke maand"), en de
reeks moet doorlopen tot de maand vóór het kwartaal — wie al langer dan een
half jaar weg is, is geen vraag meer waard.

De startmaand in de melding is de échte startmaand. Dat was eerst niet zo: ik
keek zes maanden terug, dus KPN kreeg "sinds januari 2026" terwijl hij er al
sinds oktober 2025 elke maand was. Nu staat het venster (wie telt mee) los van
de historie waarin de reeks wordt bepaald (24 maanden), en zegt de melding wat
er werkelijk staat. Er is een test voor.

### 2. Gaten in de factuurnummers

Per leverancier en per voorloop worden de nummers van het kwartaal op een rij
gezet:

> Bij Van Dijk ICT-diensten loopt de nummering door maar ontbreekt F-2026-003 —
> is die factuur er wel?

`F-2026-001, -002, -004` meldt dus `-003`. Verschillende voorlopen zijn
verschillende reeksen (`F-2025-009` hoort niet in de reeks van 2026), nummers
van verschillende leveranciers lopen niet door elkaar, een nummer zonder
cijfers doet niet mee, en meer dan acht ontbrekende nummers worden samengevat
("48 nummers tussen F-002 en F-049") in plaats van opgesomd.

Dit werkt het best bij een leverancier die per klant doornummert en bij je
eigen verkoopfacturen. Nummert een leverancier over al zijn klanten heen, dan
zijn gaten normaal — reden te meer dat het een vraag is en geen fout.

### 3. Ineens veel minder (of meer) facturen

> Dit kwartaal staan er 4 facturen; de vorige 3 kwartalen waren het er
> gemiddeld 12.0. Dat is een stuk minder — is alles aangeleverd?

Het aantal van dit kwartaal tegenover het gemiddelde van de vorige vier, met
een grens op 60% en 150%. Drie keer wordt er niets gezegd, omdat een melding
daar alleen ruis zou zijn:

- **kwartalen van vóór de allereerste factuur tellen niet mee.** Anders krijgt
  iemand die net begonnen is meteen te horen dat het er "een stuk meer" zijn
  dan in de kwartalen waarin de administratie nog niet bestond. Dit kwam boven
  water doordat mijn eigen "er is niets aan de hand"-test omviel;
- **minder dan twee kwartalen historie**: één kwartaal is geen vergelijking,
  dan is elk verschil "afwijkend";
- **een gemiddelde onder de drie**: bij twee facturen zegt een verschil van één
  niets.

De melding noemt over hoeveel kwartalen er werkelijk is vergeleken, niet altijd
"vier".

## Vragen, geen conclusies

Elke melding eindigt op een vraagteken en gaat over wat het systeem zíét, niet
over wat er fout is. Een leverancier kan opgezegd zijn, een factuurnummer kan
bij een andere klant horen, en een rustig kwartaal bestaat gewoon. Er is een
test die van elk signaal controleert dat het een vraag is.

Op het scherm staan ze in een geel blok **"Even nakijken"**, met daaronder:

> Dit zijn vragen, geen fouten. Ze houden de aangifte niet tegen — het systeem
> ziet alleen dat er iets anders is dan anders.

Bewust een andere kleur dan de rode blokkades erboven: die houden de aangifte
wél tegen. De signalen staan er ook bij een geblokkeerde aangifte, want ze gaan
over iets anders.

Zijn er geen signalen, dan staat er ook geen kop. Een systeem dat elk kwartaal
iets roept wordt weggeklikt, dus bij elke controle zit een test voor de rustige
situatie waarin er niets gemeld hoort te worden.

Voor deze controles tellen álle facturen mee, ook die nog nagekeken of
goedgekeurd moeten worden: de vraag is of iets is aangeleverd, niet of het al
is verwerkt.

## Wat dit niet is

Deze controles vinden wat afwijkt van een patroon. Een leverancier die er nog
nooit is geweest, een eenmalige factuur die kwijt is, of een klant die nooit
iets aanlevert wordt hier niet gevonden — daar is geen patroon voor. Het is een
extra paar ogen, geen garantie dat de aangifte compleet is.

## Tests

32 tests erbij (378 in totaal), per controle inclusief de rustige situatie:

- **leverancier**: gemeld bij een maandelijkse reeks; niet gemeld als hij er
  gewoon is, bij twee maanden op rij, bij een gat in de reeks, bij een reeks
  die lang geleden stopte, en bij facturen zonder leveranciersnaam. Plus: de
  status van de factuur doet er niet toe, en de startmaand is de echte;
- **nummers**: één gat, meerdere gaten, heel veel gaten samengevat, geen gat
  bij een doorlopende reeks, leveranciers door elkaar, verschillende
  voorlopen, een nummer zonder cijfers, en één enkele factuur;
- **aantal**: veel minder, veel meer, ongeveer gelijk (geen melding), weinig
  historie, geen historie, kwartalen vóór de eerste factuur, één kwartaal
  historie, en of de melding het juiste aantal kwartalen noemt;
- **samen**: een rustig kwartaal geeft nul signalen, de signalen staan in de
  aangifte zonder iets te blokkeren, ze staan er ook bij een geblokkeerde
  aangifte, en elk signaal is een vraag;
- **scherm**: de vraag staat er, de aangifte wordt gewoon uitgerekend, en
  zonder signalen staat er geen lege kop.

```
378 passed in 6.05s
```

Schermafbeeldingen: `schermen/breed-btw-signalen.png` en
`telefoon-8-btw-signalen.png`.
