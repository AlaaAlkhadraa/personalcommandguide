# Verificatie 3 september 2026 — lanes C en D

Azzouz, verificatiedienst. Beoordeeld: `2026-09-03-c.md` (Limburg, Noord-Brabant,
Zeeland, 4 genummerde kaarten) en `2026-09-03-d.md` (Noord-Holland, Zuid-Holland,
Utrecht, 0 genummerde kaarten). Lanes A en B liggen bij een tweede
verificatiekind; `-a.md`, `-b.md` en `2026-09-03-ab-verified.md` heb ik niet
geopend en niet aangeraakt.

**Uitkomst in één zin: twee van de vier kaarten van lane C zijn GOEDGEKEURD en
twee AFGEKEURD, en beide afkeuringen vallen op hetzelfde soort fout — een
gedateerd spoor dat bij nakijken van de uitgever blijkt te zijn en niet van het
bedrijf, en een bewering over de prospect die Sam zelf al te dun vond voor de
onderwerpregel maar wél in het bericht heeft gezet.**

Lane D levert nul kaarten en dat is terecht: het enige complete dossier
(A&S Stukadoor en Schilder) heeft na vier zoekronden van Sam én een vijfde van
mij nog steeds geen openbaar e-mailadres, en de harde afkeurregel van 25 augustus
laat daar geen ruimte. De verantwoording van het tekort is de beste die deze week
door mijn handen is gegaan; de bevinding daarover staat hieronder.

Beide bestanden halen poort (h). De skilltabellen zijn echt en natrekbaar, met
één telfout in die van lane C die ik als correctie noteer.

Wat ik buiten de repo heb nagetrokken staat per claim met de bron erbij. De
eigen domeinen van de prospects (`trimsalonbypaulina.nl`, `mbtweewielers.nl`,
`drimble.nl`) zijn in deze omgeving niet direct op te halen — egress geblokkeerd
— dus waar dat speelt staat erbij langs welke bereikbare weg de claim wél is
bevestigd of onderuit gehaald.

---

## 1. Trimsalon by Paulina — Roosendaal

**GOEDGEKEURD**, met twee correcties in de tekst. Dit is de beste kaart van de
dag, en de reden is de invalshoek: Sam verkoopt haar geen agenda maar een
antwoord op de vraag die zij het vaakst krijgt en bewust niet op haar site zet.
Dat is de klus die haar klant inhuurt, en het is een detail dat op geen enkele
andere trimsalon past.

- **Sector:** hondentrimsalon
- **Pakket:** 549 (Business)
- **Hoek:** agendalek
- **Register:** "je" — eenmanszaak van tweeëneenhalf jaar, zij staat zelf aan de trimtafel. Terecht
- **Verzendtermijn:** binnen ongeveer twee weken (stil levensteken, zie poort (a))

**De poorten, met wat ik zelf heb nagetrokken:**

- **(a) Gedateerd levensteken — DICHT, als stil spoor.** De openingsregel "in
  maart 2024 geopend" staat op haar eigen domein; ik heb hem in twee
  onafhankelijke zoekronden teruggekregen ("Paulina opened a dog grooming salon
  called Trimsalon by Paulina in Roosendaal in March 2024"). De uitgever is het
  bedrijf zelf, dus de daad is haar daad in de zin van 1.7. Het is wel precies
  het bewijstype van 1.14: het veroudert niet zichtbaar. Sam heeft dat uit
  zichzelf zo benoemd en de verzendtermijn op de kaart gezet — dat is de goede
  manier om dun bewijs aan te bieden en de reden dat het staat.
- **(b) Openbaar e-mailadres — DICHT.** `trimsalonbypaulina@gmail.com`, in twee
  onafhankelijke zoekronden teruggekomen, in hetzelfde blok als Tanzanietdijk 67,
  4706 TG, telefoon 06-42229004 en KvK 93266618. Het adres staat op haar eigen
  contactpagina en draagt de handelsnaam. Sterkste vorm die er is.
- **(c) Review- en scoreclaims — N.V.T. en juist afgehandeld.** De 9,0 uit de
  gidsen staat wél op de kaart en niet in het bericht, omdat er geen datum en geen
  aantal bij staat. Dat is precies goed; ik had hem er anders uit gehaald.
- **(d) Elke claim gedekt door zevren.nl — DICHT, in de code nagelegd.**
  `zevren/lib/local/sectors.ts` voert `slug: "hondentrimsalons"` met
  `planKey: "business"`, en `zevren/lib/offer.ts` zet business op **549**. De
  route `zevren/app/website-voor/[sector]` bestaat, dus de link werkt. De pagina
  voert `demoSlug: "barbershop-website"` als agenda-demo, dus "een demo die echt
  werkt: klik gewoon een tijd aan" is letterlijk waar. De verboden formuleringen
  ("werk dat u zelf kunt aanklikken", een upload, "een adres op je eigen naam")
  komen er geen van drie in voor.
- **(e) Niet eerder benaderd — DICHT.** Eén rij in `contacted.md` (regel 1010),
  van vandaag, door deze lane. Over de volle lengte op naam gecontroleerd.
- **(f) Groeifase — DICHT.** Geopend maart 2024, KvK 93266618 uit de 93-reeks
  die daarop aansluit: twee jaar en zes maanden, midden in het venster. Gezocht
  op klantenstop, wachtlijst en "geen nieuwe klanten": niets, en haar eigen site
  zegt dat alle rassen welkom zijn. Boekingspoort positief dicht — geen profiel
  op Fresha, Treatwell, Salonized, Tipaw, 1plekjevrij, en ik heb er 1kapper,
  1beautyafspraak, Belliata, DoggyDoggy en aniday bij gezocht, ook niets. Haar
  tarievenpagina noemt appen, mailen en bellen als enige routes.
- **(g) Onderwerpregel — DICHT na correctie.** Zie hieronder.

**De twee correcties, zodat Sam ze morgen zelf maakt:**

1. **De onderwerpregel sprak het bericht tegen.** De subject zei "Appje van
   21:40", het bericht zegt twee keer "om tien voor tien 's avonds" — dat is
   21:50. De eerste zin van het bericht moet de draad van de subject direct
   oppakken, en dat kan niet als de klok verspringt. Beide staan nu op 21:50.
2. **"Die vraag krijg je een paar keer per week" is een frequentie die wij niet
   kunnen tonen.** Het is geen percentage, maar het is wel een getal over háár
   week dat uit niets volgt. Eén verkeerd geraden getal in de eerste zin kost het
   hele bericht zijn geloofwaardigheid. Vervangen door "steeds opnieuw", dat
   hetzelfde doet zonder iets te beweren.

**Onderwerp** (38 tekens, geteld)

```
Wat kost een wasbeurt? Appje van 21:50
```

**Bericht** (213 woorden, inclusief aanhef en handtekening, geteld)

```
Hoi Paulina,

Die vraag krijg je steeds opnieuw: wat kost een wasbeurt voor mijn hond. Op je
tarievenpagina staat bewust geen bedrag, want het hangt af van de vacht en van
hoeveel werk het is. Eronder staat dat mensen even mogen appen, mailen of bellen.

Dat is ook logisch. Alleen komt die vraag binnen terwijl jij met twee handen in
een vacht zit en de tondeuse loopt. Je ziet hem 's avonds pas. Wie hem om tien
voor tien 's avonds stuurde, heeft de vraag intussen bij de volgende salon
neergelegd. Het vervelende is dat je er niets van merkt: die mensen praten nooit
met je.

Wat ik bouw is een pagina waarop de klant zelf zijn hond en zijn behandeling
aanklikt, een vrij moment kiest en zijn naam invult. Hij krijgt meteen een
bevestiging, jij ziet het in je agenda staan. Ook om tien voor tien 's avonds,
terwijl jij op de bank zit.

Op zevren.nl staat een demo die echt werkt: klik gewoon een tijd aan en kijk wat
er gebeurt. Wat het voor een trimsalon inhoudt, staat hier:
zevren.nl/website-voor/hondentrimsalons?utm_source=outreach&utm_medium=email&utm_campaign=hondentrimsalon-w36

Zo'n site is 549 euro, eenmalig, en die prijs staat gewoon op de site. Bellen mag
ook, dat gaat vaak sneller dan mailen.

Met vriendelijke groet,
Alaa
ZEVREN, Maastricht
06-30958710 · zevren.nl
```

## 2. Trimsalon Zachte Pootjes — Terneuzen

**GOEDGEKEURD**, met één correctie. Het bericht doet wat de staande order van 25
augustus vraagt: het lek staat in tijd en niet in techniek, het beeld is er één
en het is van haar, en de prijs staat er zonder verontschuldiging.

- **Sector:** hondentrimsalon
- **Pakket:** 549 (Business)
- **Hoek:** agendalek
- **Register:** "je" — eenmanszaak, zij staat zelf aan de tafel. Terecht
- **Verzendtermijn:** binnen ongeveer twee weken (stil levensteken)

**De poorten, met wat ik zelf heb nagetrokken:**

- **(a) Gedateerd levensteken — DICHT, als stil spoor.** "Since January 1, 2024,
  this is an official grooming salon" kwam in mijn eigen zoekronde woordelijk
  terug van haar eigen domein. Daad van het bedrijf, dus 1.7 haalt hij; 1.14 geldt
  en de termijn staat op de kaart. Haar Facebookpagina bestaat en draagt posts
  (permalink `story_fbid=587217757531699`), maar ik kreeg er in twee ronden geen
  leesbare datum uit — dat is dus géén tweede spoor, alleen de plek waar de
  hercontrole over twee weken moet beginnen.
- **(b) Openbaar e-mailadres — DICHT.** `trimsalon.zachte.pootjes@gmail.com`,
  onafhankelijk bevestigd naast Roerstraat 50, 4535 GM en 06-14467907.
- **(c) Claims over de zaak — ECHT.** Dat zij honden én katten doet is geen
  aanname: haar eigen site meldt dat katten op een aparte kattendag komen of op
  uren voordat er een hond in de salon is geweest, en dat zij scholing volgde bij
  Kat Sense (katten) en HKI (honden). Het zeldzame specialisme dat de
  onderwerpregel draagt, is dus gecheckt.
- **(d) Elke claim gedekt door zevren.nl — DICHT.** Zelfde sectorpagina, zelfde
  `planKey: "business"`, zelfde 549. Zie kaart 1.
- **(e) Niet eerder benaderd — DICHT.** Eén rij (`contacted.md` regel 1011), van
  vandaag.
- **(f) Groeifase — DICHT.** Trimsalon sinds 01-01-2024, twee jaar en acht
  maanden. Sam meldt uit zichzelf dat de ondernemer geen beginner is (negentien
  jaar cattery Dragon's Smoke) en dat het bericht daar niets over claimt — dat is
  de eerlijkheid die het profiel bedoelt, want het profiel gaat over het bedrijf.
  Boekingspoort: geen profiel op de volledige platformlijst, ook niet op DoggyDoggy,
  aniday of Tipaw. Klantenstop: niets.
- **(g) Onderwerpregel — DICHT.** "Een kat op de tafel, en de telefoon gaat" (40
  tekens) draagt haar eigen, geverifieerde specialisme in een beeld dat zij
  dagelijks meemaakt. Hij staat op het randje — hij zou op elke kattentrimmer
  passen — maar kattentrimmers zijn in haar streek juist het onderscheidende
  feit, en de regel overleeft de swipe-test: geen verkoopwoord, geen "website",
  geen ZEVREN, nieuwsgierigheid plus haar eigen detail binnen de eerste 40 tekens.

**De correctie:**

**"heeft al een paar keer te horen gekregen dat ze geen katten doen" is een
bewering over andere salons die wij niet hebben nagetrokken.** Het is een mooie
zin en precies daarom gevaarlijk: hij vertelt haar wat háár klanten elders is
overkomen, op gezag van een vreemde. Als zij toevallig de derde kattentrimmer in
de regio is, is het bericht meteen ongeloofwaardig. Vervangen door een zin die in
haar eigen waarneming blijft ("is meestal al even aan het zoeken, en doet dat 's
avonds") — hetzelfde effect, nul risico.

**Onderwerp** (40 tekens, geteld)

```
Een kat op de tafel, en de telefoon gaat
```

**Bericht** (204 woorden, inclusief aanhef en handtekening, geteld)

```
Hoi Michelle,

Een kat trimmen is niet iets wat je even onderbreekt. Twee handen, rust in de
ruimte, en dan gaat de telefoon. Je kunt niet opnemen, dus je belt terug als de
kat weg is.

Dat is de reden dat ik je schrijf. Op je site staan twee routes naar een
afspraak: bellen of mailen. Voor honden is dat al lastig, voor katten helemaal.
Wie in Zeeuws-Vlaanderen een kattentrimmer zoekt, is meestal al even aan het
zoeken, en doet dat 's avonds. Die persoon spreekt jou nooit, en jij weet niet
dat hij er was.

Wat ik bouw is een pagina waarop hij het zelf kiest: hond of kat, welke
behandeling, en welk vrij moment jij nog hebt. Hij typt zijn naam en krijgt
meteen een bevestiging. Jij ziet het in je agenda staan zonder dat je iets hebt
hoeven doen, ook als het half elf 's avonds is en jij allang klaar bent.

Op zevren.nl staat een demo die echt werkt: klik gewoon een tijd aan en kijk wat
er gebeurt. Wat het voor een trimsalon inhoudt, staat hier:
zevren.nl/website-voor/hondentrimsalons?utm_source=outreach&utm_medium=email&utm_campaign=hondentrimsalon-w36

Zo'n site is 549 euro, eenmalig, en die prijs staat gewoon op de site.

Met vriendelijke groet,
Alaa
ZEVREN, Maastricht
06-30958710 · zevren.nl
```

## 3. AC Fietstechnicus — Breda

**AFGEKEURD.** Poort (a) is niet dicht. Het gedateerde spoor waarop deze kaart
rust is de verversingsstempel van een gidsensite, en het is er één die de
directives van deze week bij naam noemen.

**De concrete reden.** Sam schrijft: "de registerpagina bij dit vestigingsnummer
draagt de datum **17-05-2026** — een gedateerde registermutatie, wat per 1.7
telt." Die pagina is `drimble.nl/bedrijf/breda/000046282793/ac-fietstechnicus.html`,
en ik heb hem in een eigen zoekronde teruggehaald. Twee dingen:

1. **De directives van deze week zeggen letterlijk: "Telt niet: 'Updated ‹maand›
   ‹jaar›' op Yelp, wheree, oozo of drimble. Dat bewijst dat de gids leeft, niet
   het bedrijf."** Fundament 1.7 herhaalt het met dezelfde vier namen. Er is geen
   ruimte voor uitleg: dit is de uitgesloten bron, met de datum die daar hoort.
2. **En het bewijs keert zich tegen zichzelf.** De titel van diezelfde
   Drimble-pagina is "over Ac Fietstechnicus **Lange Hil 30**" — het oude adres.
   Sam leidt de datum juist af uit een verhuizing naar Aardenhoek 16. Maar als het
   register op 17-05-2026 een adreswijziging had verwerkt, zou deze pagina
   Aardenhoek voeren. Hij voert Lange Hil. De stempel van 17 mei is dus
   aantoonbaar níet de verhuizing; het is de dag waarop de gids zijn pagina heeft
   ververst. Het adresverschil dat Sam als ondersteuning opvoert, weerlegt zijn
   eigen conclusie.

**Wat er wél staat, en waarom het niet genoeg is.** 5,0 uit 48 beoordelingen is
in mijn eigen zoekronde bevestigd, samen met `info@acfietstechnicus.nl`,
06-21186586, Aardenhoek 16 A40 en de openingstijden ma-vr 09:00-17:30 en za
13:30-17:00. Poorten (b), (d), (e) en de boekingspoort zijn dicht. Maar een
gemiddelde score zonder datum is per 1.7 uitdrukkelijk géén levensteken, en het
Facebookprofiel (`facebook.com/ACFietstechnicus`) en het Werkspot-profiel
bestaan wel maar gaven in twee ronden geen leesbare datum prijs. Het dossier is
niet zwak — het mist één ding, en dat ene ding is de poort.

**Dit is geen kaart en ook geen controleopdracht voor de owner.** Naar de
sectorbevindingen met ledgerstatus `lead - poort open`. De poort is goedkoop te
sluiten voor de volgende lane-C-dienst: één gedateerde beoordeling op zijn
Werkspot-profiel, of één gedateerde eigen post op zijn Facebookpagina, en de
kaart kan zo terug op het bord — de rest ligt er al.

**Aan Sam, in één regel:** een aggregator die een datum toont, toont bijna altijd
zijn eigen datum. Vraag bij elk gedateerd spoor eerst wie de uitgever is, en pas
daarna wat er staat.

## 4. MB2Wielers — Ospel (gemeente Nederweert)

**AFGEKEURD**, op twee onafhankelijke gronden. Dit is de pijnlijkste van de dag,
want poort (a) is hier juist het sterkste bewijs van de hele dienst — de drie
Nederweert24-artikelen bestaan en de data staan in de URL's zelf: `2026/05/22`,
`2026/06/14` en `2026/07/30`. Vijf weken oud, drie keer een daad van het bedrijf.
Die poort is hard dicht. Twee andere zijn dat niet.

**Grond 1 — het bedrijf voert een formulenaam, en dezelfde lane wijst dáárop af.**
De handelsnaam **"FietsNED Martijn Binnekamp"** staat in het handelsregister op
Hennesweg 1, en er loopt een Instagram-account `fietsned_martijn_binnekamp`,
naast een Facebookalbum met de titel "FietsNED Martijn Binnekamp gaat per 21 …".
FietsNED B.V. is een landelijke formule van mobiele werkplaatsen met regionale
partners. Sams eigen uitvaltabel in dit bestand voert **"Franchise, keten of te
grote schaal (FietsNed, De Ridder-groep, Vebego-klasse)"** als afwijsreden voor
drie andere bedrijven — en op de kaart die hij wél schrijft komt het woord
FietsNED niet voor. Ik kan uit de openbare bronnen niet vaststellen of hij nog
partner is of onder eigen naam is verdergegaan; de Nederweert24-stukken, zijn
eigen domein en Welzorg noemen hem consequent zelfstandig, het register en het
Instagram-account doen dat niet. **Dat is een open poort, en een open poort is
een bevinding en geen kaart.** Het is bovendien de poort die de hele pitch
bepaalt: koopt het hoofdkantoor zijn web-aanwezigheid, dan is er niets te
verkopen.

**Grond 2 — het bericht staat of valt met een bewering die Sam zelf te dun vond.**
Bij de subjectkeuze schrijft hij dat hij "Je e-bikes staan in Ospel, niet online"
heeft laten vallen, want die "doet een bewering die ik niet heb gecontroleerd —
ik weet niet of hij ze op Marktplaats zet". Vervolgens draagt het bericht
diezelfde ongecontroleerde bewering: "Wie 's avonds naar een tweedehands e-bike
kijkt, wil eerst zien welke er staan. … Kan hij dat niet zien, dan scrolt hij
door." Een claim die te zwak is voor de onderwerpregel is niet sterker in de
derde alinea; hij is daar alleen minder zichtbaar. En er is tegenbewijs: er lopen
een Facebookpagina met foto-albums en een Instagram-account, precies de plek waar
een eenmanszaak zijn voorraad laat zien. Fundament 1.10 is hier hard: "ik vond
niets" is geen bewijs van afwezigheid. Een mail die een ondernemer vertelt dat
hij mist wat hij al heeft, verbrandt het adres.

**Wat er wél klopt en bewaard blijft:** het levensteken (drie gedateerde
artikelen), het groeisignaal (Tomos-dealerschap in juni, tweedehands e-bikes vanaf
850 euro in juli, Welzorg-servicepunt), `martijnmarga@gmail.com`, 06-30892002,
Hennesweg 1. Ook nieuw uit mijn eigen ronde: een **Social Deal-actie van mei
2026** onder "Martijn Binnekamp 2-wielers", een vierde gedateerd spoor. Leeftijd
zeven jaar (sinds 2019) is de rand en op zichzelf geen afwijzing; hij speelt hier
geen rol.

**Twee dingen sluiten deze poorten, allebei goedkoop.** Eén: stel vast of de
handelsnaam FietsNED nog actueel is en of de formule zijn web-aanwezigheid
levert. Twee: kijk op zijn Facebook en Instagram of de tweedehands e-bikes daar
mét foto en prijs staan. Staan ze er, dan is dit geen vindbaarheidskaart maar een
kaart over bewijs dat op een platform van een ander staat — een andere en
waarschijnlijk betere invalshoek, maar wel een andere. Naar de sectorbevindingen
met ledgerstatus `lead - poort open`.

**Correctie die los van dit alles staat, voor de volgende keer dat 49,99 in een
bericht komt.** Het bericht zegt "Fietsen erbij zetten hoort bij het
onderhoudsabonnement van 49,99 per maand". De dictionary
(`zevren/lib/i18n/dictionaries/nl.ts`) omschrijft dat abonnement als "Tekst- en
beeldwijzigingen, **tot 1 uur per maand**". Een wisselende voorraad tweedehands
fietsen bijhouden is precies het werk dat over dat uur heen gaat. De claim moet
de grens meedragen, anders belooft de mail iets wat de factuur niet kan houden.

---

## Bevinding — A&S Stukadoor en Schilder, Velsen-Noord: terecht geen kaart

Lane D legt in `2026-09-03-d.md` een volledig dossier met een verzendklare tekst
neer en biedt het uitdrukkelijk **niet** als kaart aan. Dat is de juiste
beslissing en ik bevestig hem, met een eigen zoekronde erbovenop.

**Verdict: GEEN KAART.** De harde afkeurregel van 25 augustus is absoluut — geen
geverifieerd, openbaar e-mailadres, dus geen kaart, hoe goed de tekst ook is. Ik
heb een vijfde ronde gedraaid boven op Sams vier (naam + plaats + e-mail +
contact, gericht op de eigenaarsnaam) en kreeg opnieuw alleen Pancrasplantsoen 3,
1951 CA en 06-18894022 terug. Het bord is er om vanuit te versturen; dit adres
bestaat niet.

**Wat ik wél heb kunnen bevestigen**, zodat de volgende lane het niet overdoet:
het Werkspot-profiel bestaat en zijn beoordelingenpagina loopt door tot
**pagina 4** (`werkspot.nl/profiel/a-s-stukadoor-en-schilder/reviews?page=4`) —
Sams lek is dus positief vastgesteld en niet aangenomen. Het Zoofy-profiel
bestaat eveneens, en stukadoorgids voert de eenbedrijfspagina met KvK 89714849 en
oprichting 01-04-2023. Poorten (a), (d), (e) en (f) zijn dicht; alleen (b) staat
open.

**Twee dingen die deze lane goed heeft gedaan en die ik als voorbeeld noteer.**
Ten eerste: nergens in de tekst staat dat hij geen eigen website heeft, met de
expliciete verantwoording erbij dat vier lege zoekronden per 1.10 geen bewijs van
afwezigheid zijn. Dat is precies de fout die de owner op 25 augustus tot een
afkeuring heeft gemaakt, en hier is hij vooraf vermeden. Ten tweede: de
`info@`-gok bij StukadoorNoordHolland is niet gemaakt, terwijl het adres daar
zichtbaar bestond maar door de zoeklaag werd afgeschermd. Dat onderscheid —
afgeschermd versus afwezig — is bruikbaar en hoort in het fundament.

De tekst blijft liggen waar hij ligt: in het dagbestand, met de regel op
`bellijst.md` (regel 318) en in `geen-emailadres.md` (regel 610). Zodra beslissing
2 bij de owner valt, is dit de eerste regel die gebeld wordt.

## Bevinding — poort (h): beide skilltabellen halen hem, met één telfout

**Lane C: GEHAALD.** De tabel is echt en natrekbaar. De sterkste regels zijn die
waar een skill iets heeft tegengehouden in plaats van iets te versieren:
`competitor-profiling` hield Zam Zam van het bord omdat een inloopkapper geen
agenda heeft om te lekken, `prospecting` dwong de eerlijke formulering "op één
registerbron, twee keer uitgelezen" bij kaart 3, en `offers` verplaatste AC
Fietstechnicus van 299 naar 549 omdat het bericht een boeking verkoopt. Dat is
geen holle log.

**De telfout, en waarom ik hem noteer.** De skilltabel zegt "39 namen aangeraakt
voor 3 kaarten" en "(14 leeftijd tegen 9 poort (a))". De kop van het bestand zegt
55 bedrijven en 4 kaarten, en de uitvaltabel zegt 18 leeftijd tegen 9 poort (a).
Drie getallen die in hetzelfde bestand niet met elkaar kloppen. De owner handhaaft
skillgebruik juist op controleerbaarheid; een tabel waarvan de eigen cijfers de
toets niet doorstaan, ondergraaft precies dat. Corrigeer bij de volgende dienst
naar de telling die in de uitvaltabel staat.

**Lane D: GEHAALD, en dit is de betere van de twee.** Twee dingen springen eruit.
`offers` wordt eerlijk als "niet ingezet" gemeld mét de reden — dat is het gedrag
dat fundament 1.11 wil, en niet de holle claim die de poort moet vangen. En bij
`cold-email` noteert de lane dat de skilldata (2-4 woorden, kleine letters, géén
cijfers) botst met poort (g) van de owner, kiest voor de order, en zégt dat hij
kiest. Een agent die weet wanneer hij een skill overrulet en waarom, is precies
wat "skills zijn frameworks, geen bevelen" betekent.

## Bevinding — het tekort van vandaag, en de verantwoording

**De cijfers, zonder verzachting.** Lane C: 4 kaarten gevraagd 10 tot 12,
2 goedgekeurd. Lane D: 0 kaarten gevraagd 10 tot 12. Samen op mijn helft van de
dag: **2 goedgekeurde kaarten op een gevraagde 20 tot 24**, tegen een dagnorm van
dertig over alle vier de lanes. Lanes E/F/G zijn deze week volgens mijn eigen
directives opgeschort en de opzichter heeft er dus geen gespawnd; het tekort
wordt gemeld, niet opgevuld. Dat is de uitweg die de directives voorschrijven en
de enige die er is: een kaart die ik zou afkeuren kost de owner meer dan een kaart
die er niet is.

**De verantwoording van beide lanes voldoet, en die van lane D is de beste van de
week.** De directives eisen "het tekort met het getal en de reden". Lane C levert
een uitvaltabel over 47 dossiers, gesorteerd op de poort waarop ze als eerste
vielen, en komt daarmee tot een conclusie die zijn eigen diagnose van gisteren
omkeert: niet poort (a) maar de **leeftijd** is de bindende beperking, 18 van de
47. Lane D gaat een stap verder en legt twee tellingen naast elkaar — het
SBB-register geeft elf adressen en nul jonge zaken, de vakgids geeft zeven jonge
zaken en nul adressen — en concludeert dat de twee bronsoorten elkaar structureel
uitsluiten. Dat is geen excuus maar een meting.

**Waar ik het niet mee eens ben, en dat is belangrijker dan de instemming.** Lane
D noemt dit "geen zoekprobleem meer" en verwijst het naar beslissing 2 bij de
owner. Dat is te snel. Beide lanes meten dat de bronnen die een adres dragen op
overlevingsduur selecteren — maar allebei jagen ze nog steeds op de zaak vanuit
een bron die het bedrijf beschrijft. De enige route die vandaag een compleet, jong
dossier heeft opgeleverd, kwam van de andere kant: **een streeknieuwssite die over
de zaak schrijft.** Nederweert24 leverde in één zoekopdracht drie gedateerde
artikelen over één bedrijf, inclusief het groeisignaal. Lane C ziet dat zelf en
stelt de route voor; lane D heeft hem niet geprobeerd, terwijl de Randstad er
dichter mee bezaaid is dan Limburg. De kruisproef van morgen is dus niet nóg een
gidsroute maar deze: **`"<sector>" <streeknieuwssite> 2026` in plaats van
`<gids> <sector> <stad>`.** Ik zet hem in de directives van zondag.

**En één ding dat ik over mijn eigen werk moet zeggen.** Er zijn 106 kaarten
verzendklaar en er is er nog nooit één verstuurd — nul `sent`, nul `replied`. Ik
keur vandaag twee van de vier kaarten van lane C af op poorten die nooit tegen een
werkelijke uitkomst zijn geijkt, omdat die uitkomst er niet is. Bij kaart 3 en 4
draag ik dat zonder aarzeling: een drimble-stempel is bij naam uitgesloten en een
onbewezen negatieve bewering over een prospect is de fout die het adres verbrandt.
Maar het blijft waar dat mijn strengheid ongetoetst is, en dat hoort in het
dossier te staan.

## Bevinding — ledgercorrecties uit deze verificatie

Doorgevoerd in `contacted.md` tijdens deze dienst:

- **AC Fietstechnicus (Breda)** — van `drafted` naar `lead - poort open`. Reden
  erbij: poort (a) rust op een drimble-verversingsstempel van 17-05-2026, per
  directives en 1.7 uitdrukkelijk uitgesloten, en de pagina voert nog het oude
  adres Lange Hil 30, wat de veronderstelde adresmutatie weerlegt. Rest van het
  dossier is compleet; één gedateerde Werkspot-beoordeling of Facebookpost sluit
  de poort.
- **MB2Wielers (Ospel)** — van `drafted` naar `lead - poort open`. Reden erbij:
  handelsnaam "FietsNED Martijn Binnekamp" in het register plus Instagram
  `fietsned_martijn_binnekamp`, terwijl dezelfde lane FietsNed als
  franchise-afwijsreden voert; en het vindbaarheidslek is niet vastgesteld
  (levende Facebook met foto-albums en Instagram). Levensteken blijft hard: drie
  Nederweert24-artikelen 22-05, 14-06 en 30-07-2026, plus een Social Deal-actie
  van mei 2026.

De twee goedgekeurde kaarten blijven op `drafted` staan, met de verzendtermijn van
ongeveer twee weken die er al bij stond.

## Gebruikte skills

| Skill | Waar toegepast | Wat het concreet veranderde |
|---|---|---|
| `cold-email` | Op de vier onderwerpregels en op de vier berichten van lane C | **"If you remove the personalized opening and the email still makes sense, the personalization isn't working"** is de toets waarop kaart 1 als beste van de dag uitkwam en kaart 4 als zwakste: haal "wat kost een wasbeurt" uit Paulina's opening en er blijft niets over, haal "tweedehands e-bikes" uit die van MB2Wielers en het bericht staat er nog — want de rest van dat bericht gaat over een lek dat niet is vastgesteld. **"The subject's only job is to get the email opened, not to sell"** gaf de tegenspraak van kaart 1 gewicht: een subject die 21:40 zegt terwijl het bericht 21:50 zegt, verliest bij het openen precies wat hij had gewonnen, dus is de klok gelijkgetrokken in plaats van de zin herschreven. En de subjectdata (géén cijfers, 2-4 woorden) heb ik bewust laten verliezen van poort (g) van de owner — dezelfde afweging die lane D zelf noteert; ik bevestig die keuze zodat er geen twijfel over bestaat |
| `marketing-psychology` | Op de overtuigingskracht van de vier berichten en op de diagnose van het tekort | **Jobs to Be Done** verklaart waarom kaart 1 en kaart 4 tegengesteld scoren op precies dezelfde poortenlijst: Paulina's klant huurt geen agenda in maar "weten wat het kost", en dáár begint haar bericht; Martijns klant huurt "zien welke fiets er staat" in, en of die klus onvervuld is, weet Sam niet. **Loss aversion** staat in alle vier de berichten correct (wat er nú weglekt, niet wat er te winnen valt) en heeft geen enkele afkeuring veroorzaakt. **Theory of Constraints** op de tekortdiagnose van beide lanes: allebei wijzen ze de bindende beperking aan (leeftijd respectievelijk de elkaar uitsluitende bronsoorten), maar allebei blijven ze binnen bronnen die het bedrijf beschrijven — de streeknieuwsroute is de enige die vandaag de beperking heeft doorbroken, en daarmee is het een **lokaal-versus-globaal-optimum**-fout en geen zoekprobleem. **Pratfall** ten slotte op mijn eigen bestand: de regel dat mijn acht poorten nooit tegen een verzonden mail zijn geijkt, hoort erin — een verificatie die haar eigen ongetoetstheid verzwijgt, vraagt vertrouwen dat ze niet heeft verdiend |
| `prospecting` | Op de bewijskracht van de drie levenstekens die ik heb nagetrokken | De regel dat vertrouwen "High" twee ónafhankelijke bronnen vraagt, is precies wat kaart 3 sloopte: Sam had zelf al eerlijk genoteerd dat 17-05-2026 op één bron staat, twee keer uitgelezen. Die eerlijkheid maakte de controle mogelijk — ik wist waar ik moest kijken — en daar bleek de bron een gids te zijn die zijn eigen pagina ververst. Dezelfde regel liet kaart 4 struikelen op de omgekeerde manier: drie onafhankelijke gedateerde artikelen maken poort (a) hard, maar geen enkele bron bevestigt het lek, en één harde poort compenseert geen open poort |
| `competitor-profiling` | Op de vraag wie het lek bij deze vier prospects al bezet | Bij de twee trimsalons heb ik de platformlijst van het fundament volledig afgelopen, inclusief de namen die Sam niet noemde (1kapper, 1beautyafspraak, Belliata, DoggyDoggy, aniday) — geen van beide staat ergens, dus de boekingspoort is dicht op bewijs en niet op een halve lijst. Bij MB2Wielers leverde dezelfde vraag de afkeurgrond: de "concurrent" die zijn voorraad al toont, zou hijzelf kunnen zijn, op zijn eigen Facebook en Instagram — en dat is precies het geval dat een mail verbrandt |
| `customer-research` | Op de weging van de bronnen achter de tekortdiagnoses | **Sample bias** is wat beide lanes zelf al goed hadden, en het is de reden dat ik hun verantwoording accepteer: Stagemarkt, Trustoo en Werkspot zijn geen steekproef van kleine bedrijven maar van bedrijven die lang genoeg bestaan om erin te komen. Wat de skill hier toevoegde is de vervolgvraag die geen van beide lanes stelde: welke bron beschrijft het bedrijf niet, maar schrijft eróver? Dat is de streeknieuwssite, en dat is de enige bron die vandaag een jong, compleet en gedateerd dossier heeft opgeleverd |
| `product-marketing` | Als eigenaar van `.agents/product-marketing.md`, bij elke poortbeslissing | Het fundament heeft vandaag twee keer zelf de afkeuring geleverd zonder dat ik iets hoefde toe te voegen: 1.7 noemt drimble bij naam als niet-tellende bron, en 1.10 verbiedt "ik vond niets" als bewijs van afwezigheid. Dat is wat een fundament hoort te doen. **Ik werk het document vandaag niet bij** en dat is een besluit: de twee kandidaten uit lane D (Setmore op de platformlijst, en het onderscheid afgeschermd-versus-afwezig e-mailadres) staan allebei op één lane en één dag, en de bewijslat van het fundament is bevestiging uit meer dan één lane. Ze gaan naar het weekrapport van zondag, samen met de streeknieuwsroute — die staat inmiddels wél op twee lanes (Kapsalon Bager eerder, MB2Wielers vandaag) en is dus de eerste kandidaat voor 1.15 |

**Mechanische controle vóór het pushen:** de twee goedgekeurde berichten geteld op
**213** en **204** woorden, inclusief aanhef en handtekening, beide binnen 160-220.
Onderwerpregels geteld op **38** en **40** tekens. `grep` op `aanklikken`,
`een foto van`, `eigen domein zit`, `adres op je naam`, `gratis` en het
uitroepteken: nul treffers in beide. Twee handtekeningblokken geteld, beide met
`06-30958710 · zevren.nl`. Prijzen tegen `zevren/lib/offer.ts` gelegd: business
549, starter 299, add-ons 79 en 150, onderhoud 49,99 — alle vier de berichten
noemden een prijs die met het verkochte pakket overeenkomt. Sectorroute
`zevren/app/website-voor/[sector]` bestaat en `slug: "hondentrimsalons"` staat in
`zevren/lib/local/sectors.ts` met `planKey: "business"`.

## Samenvatting

| Nr. | Kaart | Lane | Verdict | In één regel |
|---|---|---|---|---|
| 1 | Trimsalon by Paulina — Roosendaal | C | **GOEDGEKEURD** | Alle acht poorten dicht; twee correcties (klok in subject en bericht gelijkgetrokken op 21:50, verzonnen frequentie "een paar keer per week" eruit). Stil levensteken: verstuur binnen ca. twee weken |
| 2 | Trimsalon Zachte Pootjes — Terneuzen | C | **GOEDGEKEURD** | Alle acht poorten dicht; één correctie (bewering over wat andere salons tegen haar klanten zeggen, vervangen door haar eigen waarneming). Stil levensteken: verstuur binnen ca. twee weken |
| 3 | AC Fietstechnicus — Breda | C | **AFGEKEURD** | Poort (a) rust op een drimble-verversingsstempel (17-05-2026), bij naam uitgesloten in de directives en in 1.7 — en diezelfde pagina voert nog het oude adres, wat de veronderstelde registermutatie weerlegt. `lead - poort open` |
| 4 | MB2Wielers — Ospel (gem. Nederweert) | C | **AFGEKEURD** | Twee gronden: handelsnaam "FietsNED Martijn Binnekamp" in het register terwijl dezelfde lane FietsNed als franchise-afwijsreden voert, en een vindbaarheidslek dat niet is vastgesteld — de bewering die Sam zelf te dun vond voor de subject, draagt het hele bericht. `lead - poort open` |
| — | A&S Stukadoor en Schilder — Velsen-Noord | D | **GEEN KAART, terecht** | Vijfde zoekronde bevestigt Sams vier: geen openbaar e-mailadres. Harde afkeurregel 25-08. Tekst blijft liggen, regel staat op `bellijst.md` |
| — | Poort (h), lane C | C | **GEHAALD** | Echte, natrekbare tabel; één telfout te corrigeren (39/3/14 tegen 55/4/18 elders in hetzelfde bestand) |
| — | Poort (h), lane D | D | **GEHAALD** | De betere van de twee: `offers` eerlijk als niet ingezet gemeld, en het conflict tussen de cold-email-data en poort (g) benoemd in plaats van weggemoffeld |
| — | Tekort van de dag | C+D | **EERLIJK GEMELD** | 2 goedgekeurd op een gevraagde 20-24 in deze twee lanes. E/F/G opgeschort, dus niet opgevuld. Verantwoording van beide lanes voldoet; lane D's diagnose is de beste van de week, maar haar conclusie "geen zoekprobleem meer" is te snel — de streeknieuwsroute is niet geprobeerd |

Azzouz
