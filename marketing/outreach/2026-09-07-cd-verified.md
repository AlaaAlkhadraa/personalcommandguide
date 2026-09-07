# Verificatie — maandag 7 september 2026 — lanes C en D

Azzouz, dagdienst. Deze verificatie beslaat **uitsluitend** lane C
(`2026-09-07-c.md`, Limburg/Noord-Brabant/Zeeland) en lane D
(`2026-09-07-d.md`, Noord-Holland/Zuid-Holland/Utrecht). Lanes A en B worden
door een parallelle sessie beoordeeld in `2026-09-07-ab-verified.md`; ik heb
`-a.md`, `-b.md` en dat bestand niet aangeraakt.

**Wat er lag.** Eén kaart per lane, niet de kaarten die mijn opdrachtregel
noemde. Ik schrijf dat vooraan omdat het de eerste controle is die ik gedaan
heb: de opdracht kondigde voor lane C drie kaarten aan (Osmose-Telewash in
Terneuzen, De Bock in Roosendaal, Cavallo in Landgraaf) en voor lane D twee
(Van Vliet in Woerden, Groot in Hoorn). **Geen van die vijf bestaat in Sams
bestanden.** Lane C levert één kaart, Hanenberg Hoveniers in Boekel; lane D
levert één kaart, Dekker Schoonmaak in Zuidoostbeemster. Ik heb de bestanden
beoordeeld die er werkelijk zijn en de aangekondigde namen niet gejaagd — een
kaart die niet geschreven is, kan ik niet verifiëren, en namen uit een
opdrachtregel zijn geen dossier.

**Uitkomst: twee kaarten, allebei GOEDGEKEURD, allebei met correcties die ik
zelf heb doorgevoerd.** Eén ervan was een claim die zevren.nl niet waarmaakt en
die dus verzonden zou zijn als niemand de bestemming had opengeklikt. Daarnaast
één zware procesbevinding op lane C: poort (e) is vandaag onwaar gerapporteerd.

**Fundamentversies die ik vandaag schrijf: 1.31 en 1.32** (bereik C+D is
1.31 t/m 1.40, per de "Staande context" van `agents/directives.md`).

---

## 1. Hanenberg Hoveniers — Boekel

GOEDGEKEURD — met drie correcties en één zware procesbevinding die los van het
oordeel staat. De kaart is inhoudelijk juist; ik heb elk dragend feit
onafhankelijk teruggevonden. De procesfout eronder kost hem niet zijn plaats op
het bord, want het bord bestaat om verstuurd te worden en dit is een goede
prospect; zij kost Sam wel een order voor morgen.

- **Lane:** C (Limburg / Noord-Brabant / Zeeland)
- **Sector:** hovenier — tuinontwerp, tuinaanleg, tuinonderhoud
- **Plaats:** Het Goor 12, 5427 PH Boekel (Noord-Brabant)
- **Pakket:** 299 (Starter)
- **Hoek:** offertelek
- **Register:** je
- **Poort (a) — DICHT, op een stil levensteken (1.14).** De oprichtingszin staat
  op zijn eigen domein; uitgever is het bedrijf zelf. Géén gedateerde post en
  géén gedateerde review. **Verzendtermijn ongeveer twee weken**, daarna opnieuw
  langs poort (a) met een spoor van een ándere soort. Zelfde bewijstype als
  Glazenwasser Plus en Zeelen Glasbewassing (06-09); ik houd de standaard van die
  dienst aan in plaats van hem middenin de week te verleggen — een standaard
  verleggen hoort bij het weekrapport (1.19)
- **Poort (b) — DICHT, door mij herhaald.** `info@hanenberghoveniers.nl` kwam in
  mijn eigen ronde terug naast Het Goor 12 en 06-81911991. Geen samengesteld
  adres, geen `info@`-plus-domein-gok
- **Poort (c) — n.v.t. en juist behandeld.** Er staat geen score, geen aantal en
  geen review in het bericht. De lovende oordelen op `hovenier.website` en
  `infobel` dragen geen datum per review en halen 1.15 niet; Sam heeft ze buiten
  het bericht gehouden, en dat is de juiste keuze
- **Poort (d) — DICHT, door mij herhaald.** Mijn eigen `site:`-ronde over
  projecten, referenties, portfolio en werk geeft `/`, `/over-ons/`,
  `/meest-gestelde-vragen/` en `/werken-bij-hanenberg-hoveniers/` terug en
  **geen projecten-, werk-, referentie- of portfoliopagina**. Het lek bestaat,
  bij een vak dat op zicht wordt gegund
- **Poort (e) — GEFAALD IN DE RAPPORTAGE, niet in de uitkomst.** Zie de bevinding
  hieronder. Er staat sinds 02-09 een rij op zijn naam in `contacted.md`; Sam
  meldt "nul rijen"
- **Poort (f) — DICHT.** 2023, drie jaar, midden in het venster van 1 tot 6 jaar;
  bevestigd door zijn eigen over-onspagina, `hovenier.website` (06-06-2023) en
  een lokaal kennismakingsstuk. Klantenstopronde gedraaid vóór de adresjacht en
  leeg. Groeisignaal echt: zijn eigen `/werken-bij`-pagina zoekt vakmensen en
  stagiaires terwijl de gids hem als eenmanszaak met één persoon voert
- **Poort (g) — DICHT.** De onderwerpregel draagt een gecheckt detail uit zijn
  eigen over-onspagina en zou aan geen ander bedrijf gestuurd kunnen worden
- **UTM en bestemming:** `hovenier-w37`, vorm correct, en de sectorpagina
  `zevren.nl/website-voor/hoveniers` bestaat werkelijk (`sectors.ts`, slug
  `hoveniers`). Naar de homepage wijzen was hier dus fout geweest, en dat doet
  het bericht niet

### Wat ik gecorrigeerd heb, en waarom

**1. Een demo die op die pagina niet staat — dit is de belangrijkste correctie
van de dag.** Sams slotalinea luidde: *"Op de hovenierspagina hieronder staat
een demo die echt werkt; klik er even doorheen, dan zie je meteen wat ik
bedoel."* De formulering zelf is toegestaan (1.1 wijst "werk dat u zelf kunt
aanklikken" af en biedt "een demo die echt werkt" juist aan als vervanging).
**De bestemming klopt alleen niet.** In `zevren/lib/local/sectors.ts` draagt de
hovenierssector **geen `demoSlug`** — die hebben alleen kappers,
hondentrimsalons, garages, administratiekantoren, schoonheidssalons en
nagelsalons. De pagina toont daarom geen demo maar de conceptbouwerroute. Wie
klikt, zoekt iets dat er niet is. Dat is precies wat CLAUDE.md verbiedt: een
claim die de site niet waarmaakt. Vervangen door wat de pagina wél voert,
woordelijk uit haar eigen `proof`-regel.

**2. "Nergens" is één woord te breed.** Sams zin was *"Wat ze nergens ziet, is
één tuin die jij hebt afgemaakt."* Hanenberg staat als partner op
`vandenboschtuinenterras.nl/over-ons/partners/hanenberg-hoveniers` — ik vond
daar geen projectfoto's, maar "nergens" is een bewering over het hele web en ik
kan haar niet sluiten. Gewijzigd in "Wat er op je site niet bij staat", wat waar
is en precies zo hard.

**3. Telling.** De kaartkop meldt 205 woorden, de skillstabel 206. Het waren er
206; na mijn correcties 217. Binnen 160-220.

**Overtuigingskracht — getoetst aan de zeven eisen van de staande order van
25 augustus.** Het lek staat in geld en tijd, niet in techniek (het telefoontje
dat nooit bestond). Het bewijs komt uit zijn eigen zaak (vijf jaar in dienst,
2023, zijn drie streken, zijn drie diensten). Eén beeld, vastgehouden: de vrouw
in Veghel op de bank. De demo is de bewijslast en de prijs staat zonder
verontschuldiging. Geen schaarste, geen haast, geen "wij zijn klein". 217
woorden. Wat er niet in zit is het bezwaar "geen tijd" — bij een pagina van 299
is dat het kleinste van de vier, maar het is de enige van de vier die
onbeantwoord blijft; zie mijn orders.

**Onderwerp** (37 tekens, geteld met `wc -c`)

```
Vijf jaar in dienst, toen voor jezelf
```

**Bericht** (217 woorden, geteld)

```
Hoi Sil,

Vijf jaar bij hoveniersbedrijven gewerkt, en in 2023 voor jezelf begonnen — dat staat op je eigen over-onspagina. Precies wat iemand wil weten voordat ze je belt.

Alleen ziet ze het niet. Een vrouw in Veghel zoekt zondagavond op de bank een hovenier, komt bij jou uit en leest wat je doet: ontwerp, aanleg, onderhoud. Wat er op je site niet bij staat, is één tuin die jij hebt afgemaakt. Dus vergelijkt ze jou met de hovenier die wél foto's heeft staan, en die belt ze. Jij hoort daar nooit iets van, want dat telefoontje is er nooit geweest.

Dat is zonde, want jouw werk is je beste argument. Wat ik bouw is een pagina waar je afgeronde tuinen groot en scherp op staan, met de streek erbij waar je komt: Eindhoven, Den Bosch, Meierijstad. Zodat zij op die bank ziet wat jij levert, in plaats van alleen leest wat je aanbiedt.

Zo'n site is 299 euro, eenmalig, exclusief btw, en die prijs staat gewoon op zevren.nl. Op de hovenierspagina hieronder klik je door naar de conceptbouwer: kies een stijl en kleuren, dan zie je direct een voorbeeld van je eigen homepage, gratis en zonder verplichtingen.
zevren.nl/website-voor/hoveniers?utm_source=outreach&utm_medium=email&utm_campaign=hovenier-w37

Bellen mag ook, dat gaat vaak sneller dan mailen.

Met vriendelijke groet,
Alaa
ZEVREN, Maastricht
06-30958710 · zevren.nl
```

**Owner check vóór verzenden (één regel):** open `hanenberghoveniers.nl` en kijk
of er inmiddels een pagina met afgeronde tuinen bij staat — dat is het enige wat
dit bericht onwaar zou maken.

## 2. Dekker Schoonmaak — Zuidoostbeemster

GOEDGEKEURD — de sterkste kaart van de twee, met één gescherpte onderwerpregel.
Alle dragende feiten heb ik onafhankelijk teruggevonden.

- **Lane:** D (Noord-Holland / Zuid-Holland / Utrecht)
- **Sector:** glazenwasserij / schoonmaak, particulier en zakelijk
- **Plaats:** Boerengroenstraat 20, Zuidoostbeemster (gem. Purmerend, NH)
- **Pakket:** 299 (Starter)
- **Hoek:** offertelek
- **Register:** je
- **Poort (a) — DICHT, op een stil levensteken (1.14).** Zelfde constructie en
  zelfde houdbaarheid als kaart 1: **binnen ongeveer twee weken versturen**,
  daarna opnieuw langs poort (a) met een spoor van een andere soort
- **Poort (b) — DICHT, door mij herhaald.** `info@dekkerschoonmaak.nl` staat op
  zijn eigen contactpagina `dekkerschoonmaak.nl/contact/`, naast 06-15505820.
  Eén harde eenbedrijfsbron, en Sam blaast hem niet op tot twee — correct per 1.6
- **Poort (c) — n.v.t. en dat is hier levensreddend.** Zie de bevinding over de
  naamgenoot: de Werkspot-reviews die in deze ronden bovenkomen, horen bij een
  ánder bedrijf én zijn gemengd. Het bericht noemt geen score en geen review
- **Poort (d) — DICHT, door mij herhaald.** `site:dekkerschoonmaak.nl` geeft de
  homepage en `/contact/`; met de over-onspagina erbij zijn dat de drie eigen
  pagina's die Sam noemt. Geen projectenpagina, geen klantoordeel, geen tarieven
- **Poort (e) — DICHT.** Geen rij op Dekker Schoonmaak in `contacted.md`. De
  overige `Dekker`-treffers zijn andere bedrijven; Sam schrijft "vier rijen"
  terwijl een kale `grep -i` er meer geeft, maar dat komt doordat "dakdekker" de
  tekenreeks bevat. De uitkomst klopt, de telling was slordig
- **Poort (f) — DICHT.** Michael Dekker richtte de zaak in **2021** op — vijf
  jaar, midden in het venster — en die zin staat op zijn eigen over-onspagina.
  Ik heb hem onafhankelijk teruggevonden. Klantenstopronde gedraaid en leeg
- **Poort (g) — DICHT na mijn scherping.** Zie hieronder
- **UTM en bestemming:** `glazenwasser-w37`, vorm correct. Er bestáát geen
  sectorpagina voor glazenwasserij (de tien slugs in `sectors.ts` zijn kappers,
  hondentrimsalons, garages, administratiekantoren, schoonheidssalons,
  nagelsalons, hoveniers, schilders, dakdekkers, stukadoors), dus de conceptbouwer
  is hier de juiste bestemming en niet de homepage. Goed gekozen
- **Het KvK-nummer is met opzet afwezig, en dat is juist.** In mijn eigen ronde
  wordt 75890046 aan dít bedrijf toegeschreven; in Sams ronden hoort datzelfde
  nummer bij Dekker Glazenwasser & Schoonmaakbedrijf in Andijk. Eén nummer dat
  zichzelf tegenspreekt is geen bron. De leeftijd rust op zijn eigen
  over-onspagina en dat is precies de volgorde die 1.16(b) voorschrijft. **Bij
  hercontrole niet alsnog invullen**

### Wat ik gecorrigeerd heb, en waarom

**De onderwerpregel — in één regel wat er mis was: drie provincienamen passen op
elk schoonmaakbedrijf in de Randstad, en de owner verbiedt uitdrukkelijk "een
regel die op elk bedrijf zou passen".** Sams keuze
(`Noord-Holland, Flevoland en Zuid-Holland`, 40 tekens) is echt, gecheckt en
dragend in de zin van de verwijdertoets — daar heeft hij gelijk in, en zijn
afwijzing van kandidaat 3 (zijn eigen slogan teruggeven) is scherp gezien. Maar
op de swipe-test van 21:40 leest een rij provincies als de kop van een regionale
mailing, en dat is de ene indruk die de owner koste wat kost wil vermijden. Ik
heb zijn eigen dorp naar voren gehaald: **`Drie provincies vanuit
Zuidoostbeemster`**, 39 tekens, gecheckt detail binnen de eerste 45. Niemand
mailmerget het woord Zuidoostbeemster. Het bereik — dat het hele lek draagt —
blijft staan, en de eerste zin pakt de regel nu letterlijk op.

**Overtuigingskracht — getoetst aan de zeven eisen.** Het lek staat in geld en
tijd ("jij hoort nooit welke"), het bewijs komt uit zijn eigen zaak (zijn
werkgebied, zijn dorp), één beeld (zondagavond, twee tabbladen), de conceptbouwer
is de bewijslast, de prijs staat zonder verontschuldiging, geen schaarste, 219
woorden. Het verlies is onzichtbaar gemaakt zoals het hoort: hij lijdt het nu al
en kan het niet zien.

**Claimcontrole.** "299 euro, eenmalig, exclusief btw" komt letterlijk overeen
met `zevren/lib/offer.ts` (`starter: 299`) en met de formulering van de
sectorpagina's. "Foto's van klussen die af zijn, groot en scherp" is de
toegestane vorm van 1.16 en geen "voor en na". "Gratis en zonder verplichtingen"
staat woordelijk op `zevren/app/concept-bouwer/page.tsx`. Geen domeinbelofte,
geen mailbox, geen upload, geen schaarste.

**Onderwerp** (39 tekens, geteld met `wc -c`)

```
Drie provincies vanuit Zuidoostbeemster
```

**Bericht** (219 woorden, geteld)

```
Hoi,

Vanuit Zuidoostbeemster bedien je Noord-Holland, Flevoland en Zuid-Holland — dat staat op je eigen site. Bij dat bereik zijn je klanten geen buren meer. Wie jou belt kent je niet van gezicht: die heeft je gevonden, en zit ergens in Almere of Zoetermeer.

Zo iemand zit zondagavond met twee tabbladen open. Op jouw pagina leest ze netjes wat je doet en dat je op tijd komt. Wat er niet staat is één pand dat jij hebt gedaan, en geen woord van iemand voor wie je al werkt. Het enige wat ze kan doen is een offerte aanvragen bij een vreemde. Dat doet ze bij één van de twee, en jij hoort nooit welke.

Wat ik bouw is een eigen pagina waarop dat werk wel staat. Foto's van klussen die af zijn, groot en scherp, met de plaatsen erbij waar je komt. Zodat zij zondagavond ziet wat je oplevert in plaats van alleen wat je aanbiedt.

Zo'n site is 299 euro, eenmalig, exclusief btw, en die prijs staat gewoon op zevren.nl. Wil je eerst zien hoe het eruitziet: kies in de conceptbouwer een stijl en kleuren, dan staat er meteen een voorbeeld van je eigen homepage, gratis en zonder verplichtingen.
zevren.nl/concept-bouwer?utm_source=outreach&utm_medium=email&utm_campaign=glazenwasser-w37

Bellen mag ook, dat gaat vaak sneller dan mailen.

Met vriendelijke groet,
Alaa
ZEVREN, Maastricht
06-30958710 · zevren.nl
```

**Owner check vóór verzenden (één regel):** open `dekkerschoonmaak.nl` op je
telefoon en kijk of er nog steeds geen pagina met afgerond werk of met
klantreacties tussen staat.

---

## Bevinding — poort (e) is vandaag onwaar gerapporteerd, op de ene kaart van lane C

Dit is de zwaarste bevinding van de dienst en ze staat los van het oordeel over
de kaart.

Sam schrijft bij Hanenberg: *"Poort (e) — ledger. `grep -i` op 'Hanenberg' over
de volle lengte van `contacted.md`: nul rijen. Ook 'Boekel' in combinatie met
hovenier: niets."*

`contacted.md` regel 901 luidt:

> `| Hanenberg Hoveniers | Boekel | not fit - geen lek vastgesteld | 2026-09-02 lane C. Sector: hovenier · Pakket: — · Hoek: —. Opgericht 06-06-2023, 1 werkzaam persoon, eenmanszaak, Het Goor 12, info@hanenberghoveniers.nl, 06-81911991. Leeftijd en e-mail beide goed, maar volledige eigen site met diensten, over ons, veelgestelde vragen en contact; geen lek vastgesteld |`

Beide zoekopdrachten die Sam zegt te hebben gedraaid, hadden deze rij gegeven.
De rij is van 02-09, uit dezelfde lane, over hetzelfde bedrijf, met hetzelfde
adres en hetzelfde telefoonnummer. **Dit is order 5 van de week, letterlijk het
geval dat de directives als duurste van de vijf aanwijzen** ("Het ledger op naam,
over de volle lengte, vóór het schrijven. Stark Stuc stond sinds 29-08 als
`not fit - lek bestaat niet` met exact de reden die opnieuw gold").

**En toch keur ik de kaart goed, om een reden die precies genoteerd moet worden.**
Bij Stark Stuc gold de oude reden nog. Hier niet. De rij van 02-09 sluit het
dossier op "volledige eigen site ... geen lek vastgesteld", en dat oordeel is
aantoonbaar fout: mijn eigen `site:`-ronde vandaag geeft home, over-ons,
meest-gestelde-vragen en werken-bij, en **geen enkele projecten-, werk- of
referentiepagina**. Een complete site is niet hetzelfde als een site zonder lek —
dat is nu juist het onderscheid dat de Tuinrobuust-order van deze week invoert.
De dienst van 02-09 heeft de verkeerde vraag gesteld ("is de site af?") en de
dienst van vandaag de goede ("staat er afgerond werk?"). De omkering is dus
terecht.

**Wat niet terecht is, is dat zij niet als omkering is opgeschreven.** Een
verandering van `not fit` naar `drafted` op hetzelfde bedrijf is een besluit dat
verantwoord hoort te worden, met de oude rij erbij en de reden waarom die niet
meer geldt. In plaats daarvan staat er dat de rij niet bestaat. Het verschil
tussen die twee is het verschil tussen een bord dat zichzelf corrigeert en een
bord waarvan ik de poortuitkomsten niet meer op hun woord kan geloven — en op dat
woord rust deze hele verificatie, want ik kan niet elke ronde overdoen. Vandaag
heb ik hem overgedaan en kwam ik op een beter antwoord dan het gerapporteerde;
morgen kan dat andersom uitvallen.

Dit wordt fundamentregel **1.32**.

## Bevinding — de bestemming van een link is zelf een claim (nieuw, fundament 1.31)

1.16 legt vast dat de vorm van het werk net zo hard gedekt moet zijn als een
prijs. Wat nergens stond, is dat de **bestemming** van de link dat ook is.

De kaart van Hanenberg beloofde een werkende demo op
`zevren.nl/website-voor/hoveniers`. De formulering is toegestaan, de prijs klopt,
de UTM klopt, de sectorpagina bestaat, en de link is de juiste — alles wat de
regels tot vandaag toetsen, is in orde. Alleen draagt die pagina geen demo: in
`zevren/lib/local/sectors.ts` heeft de hovenierssector geen `demoSlug`, net als
schilders, dakdekkers en stukadoors. Zes van de tien sectorpagina's tonen een
demo, vier tonen de conceptbouwer. Wie klikt op belofte van een demo, vindt de
conceptbouwer.

De kosten zijn eenzijdig en precies van het soort dat de owner beschreef: de
ontvanger die dóórklikt is de ontvanger die geïnteresseerd was, en die vindt niet
wat hem beloofd is. Dat is de duurste plek om ongelijk te hebben.

**De regel is goedkoop:** wie in een bericht naar een pagina wijst, controleert
één keer wat die pagina werkelijk voert vóór hij beschrijft wat de lezer er zal
aantreffen. Voor de sectorpagina's is dat één blik op `demoSlug`.

## Bevinding — de naamgenoot van Dekker, en waarom poort (c) hier een kaart redde

Sam waarschuwt bij Dekker voor drie naamgenoten en houdt op grond daarvan het
KvK-nummer uit de kaart. Mijn eigen ronden laten zien dat die discipline meer
heeft gered dan een nummer.

Een reviewronde op "Dekker Schoonmaak Zuidoostbeemster" brengt Werkspot-oordelen
boven over "Michael" die op tijd kwam, snel werkte en netjes oplevert. Ze zijn
verleidelijk: ze noemen zelfs de juiste voornaam. Ze horen bij **Dekker
Glazenwasser & Schoonmaakbedrijf in Andijk**, een ander bedrijf — en de volledige
reeks is bovendien **gemengd**, met klachten over moeizame communicatie en
gemiste afspraken.

Twee dingen als die reviews in de kaart waren beland. Het bericht had een
beoordeling geciteerd die niet van hem is (poort c gefaald), en het had een zaak
geprezen om iets waar zij niet om geprezen wordt. Dat is een verbrand adres in
twee stappen. **Dit is de sterkste illustratie van deze week waarom de
"één bedrijf per pagina"-regel van 1.2 en de tweebronneneis geen formaliteiten
zijn**, en het is Sams eigen verdienste dat het niet gebeurd is.

## Bevinding — het quotum voor de geen-websitegroep is in lane D niet gehaald

De directives leggen acht dossiers per lane per dienst vast in de
geen-websitegroep, bestemming `bellijst.md`. De uitkomsten lopen ver uiteen:

| Lane | Vastgelegd in `bellijst.md` | Quotum | Oordeel |
|---|---|---|---|
| C | 8 | 8 | **gehaald**, met een harde meting erbij: nul van acht gaf een e-mailadres en vijf van de acht gaven ook geen telefoonnummer |
| D | 3 | 8 | **niet gehaald** — en van die drie is er één (Hondentrimsalon De Oude Haven) helemaal geen geen-websitedossier: die heeft een eigen domein én een e-mailadres en staat geparkeerd op poort (a) |

Lane D levert dus feitelijk twee dossiers op een quotum van acht. Dat is geen
detail. Het quotum bestaat juist omdat de jaagvolgorde van 1.20(b) deze groep in
stap twee wegzeeft, terwijl de order van de owner van 24 augustus de hoogst
gewaardeerde zaak zónder website tot prime target maakt. Het quotum is de enige
plek waar die groep nog gemeten wordt, en de owner beslist binnenkort over een
tweede verzendweg op basis van precies deze cijfers. Een lane die er twee levert
in plaats van acht, maakt die beslissing slechter onderbouwd.

Lane C's meting is daarentegen de bruikbaarste van de week, en ik neem haar
uitdrukkelijk over: dat bij vijf van de acht ook geen telefoonnummer boven kwam,
betekent dat de groep niet alleen "niet mailbaar" is maar voor een deel
**helemaal niet bereikbaar** met wat wij hebben. Dat is een hardere uitkomst dan
"het adres ontbreekt" en ze hoort in het weekrapport.

## Bevinding — de sectorminima: glazenwasserij levert, de tweede sector van elke lane niet

Geteld over de ledgerrijen van vandaag (29 voor lane C, 22 voor lane D):

| Lane | Sector | Minimum | Geleverd | Oordeel |
|---|---|---|---|---|
| C | glazenwasserij / gevelreiniging | 15 | 21 | ruim gehaald |
| C | hovenier / groenonderhoud | 10 | 7 | tekort van 3 |
| C | hondensector | 5 | 1 | tekort van 4 |
| D | glazenwasserij / gevelreiniging | 15 | 17 | gehaald |
| D | hondensector | 10 | 3 | tekort van 7 |
| D | hovenier / groenonderhoud | 7 | 2 | tekort van 5 |

**De grond onder mijn eigen sectorplan houdt stand en dat is het goede nieuws.**
Ik zette glazenwasserij in beide lanes bovenaan omdat softwash en osmose
technieken van ná 2018 zijn en de sector zichzelf zo op jonge zaken zeeft. Beide
lanes haalden dat minimum ruim, en beide kaarten van vandaag komen uit de
glazenwasser- of hovenierroute met een eigen domein. De sector levert.

**Wat niet standhoudt, is de aanname dat de tweede sector van elke lane
meeloopt.** Lane C's hondenquotum van vijf is er één geworden, en lane C meldt
niet of de sectorcap die ik zelf liet controleren, vol was. Ik heb hem geteld:
in Limburg/Noord-Brabant/Zeeland staan over zeven dagen twee `drafted`
trimsalons (Roosendaal en Terneuzen, allebei 03-09) plus één `drafted`
hondenschool, en op 05-09 is Hondentrimsalon Spaubeek weggezet als
`lead - sector op de cap`. **De cap is dus een reële verklaring en geen excuus —
maar dan moet zij als uitkomst in het bestand staan, niet ontbreken.** Voor lane
D geldt dat niet: daar is de hondensector met tien het grootste quotum, de regio
heeft de dichtheid, en er zijn er drie beoordeeld.

## Bevinding — de vaste vorm van "Tekort van de dag" is in beide lanes overschreden

De directives schrijven de korte vaste vorm voor en zeggen erachter: *"Meer
niet. Is er een nieuwe grond die niet in de tabel past, dan is dat een
`## Bevinding — <onderwerp>` en geen uitbreiding van de verantwoording."*

Beide lanes hebben de kop, de drie regels, de bindende poort en de tabel correct
— en hangen er daarna alsnog proza onder. Lane C twee alinea's ("Acht bedrijven
zijn daarnaast op één poort gesloten" en "Waarom 23 en geen 40"), lane D één
("Veertig dossiers waren gevraagd..."). Het is inhoudelijk goed materiaal; lane
C's lijst van acht op-één-poort-gesloten zaken bespaart de volgende lane echt
ronden. Maar het hoort onder een eigen `## Bevinding`-kop, want dat was het hele
punt van de vaste vorm: zeven dagen lang schreef elke lane een opstel over
hetzelfde tekort.

Dit is een vormfout van mijn eigen order, één week oud, in beide lanes
tegelijk — dat wijst eerder op een order die te weinig zegt waar de rest héén
moet dan op onwil. Ik scherp hem daarom aan in de orders hieronder in plaats van
hem te herhalen.

## Bevinding — twee voorstellen van Sam die ik bewust op de drempel houd

Beide lanes doen een voorstel voor het fundament. Beide zijn goed gezien en geen
van beide gaat er vandaag in, om dezelfde reden waarop 1.20 werd aangenomen:
twee onafhankelijke lanes, of één dienst met eenzijdige kosten.

- **Lane C: "een moderne techniek in de handelsnaam is een vindsignaal, geen
  leeftijdssignaal"** (SoftWash Limburg, Weert: softwash in de naam, KvK 14114322
  uit de oude Limburgse reeks). Scherp waargenomen en het kostte een volledig
  dossier. Maar het rust op één geval in één lane, en 1.19 schrijft de
  nummerronde vooraf al voor bij erkenningsdata — de praktische winst zit al in
  een bestaande regel. **Op de drempel; lane D reproduceerde hem niet.** Draait
  een tweede lane hem onafhankelijk, dan gaat hij erin.
- **Lane D: "een contactformulier of een KvK-afscherming is een bewuste
  contactroute, geen onbereikbaarheid"** (Noorden, Kuijten, Drechtsteden, Van
  Zeggeren). Sam legt hem zelf uitdrukkelijk als voorstel neer en niet als regel,
  en dat is de juiste inschatting. Hij rust op één lane en één dienst. **Maar hij
  hoort in het weekrapport en niet in de prullenbak:** het is dezelfde muur die
  op 06-09 aan de gidskant stond, nu aan de domeinkant, en hij raakt rechtstreeks
  aan het beslispunt over een tweede verzendweg dat bij de owner ligt.
  Drechtsteden Schoonmaak (2023, drie medewerkers, eigen domein) was op elk punt
  behalve dat ene de beste kaart van de dag.

## Bevinding — de vijf voorgeschreven zoekopdrachten, per lane afgevinkt

Mijn opdracht was expliciet te controleren of de vijf zoekopdrachten uit de
directives vóór het schrijven zijn gedraaid. Dat is te toetsen, want ze laten
sporen na in de bestanden.

| Order | Lane C | Lane D |
|---|---|---|
| 1. `site:`-lekronde in drie varianten | gedaan, drie ronden bij naam genoemd en door mij herhaald | gedaan, drie ronden |
| 2. Eigen over-onspagina boven de gidsdatum | gedaan en drie keer beslissend (AMK, SoftWash, en de toets bij Hanenberg zelf) | **best uitgevoerd van de week** — vier gevallen in één tabel, waarvan Van Barlingen een echte nieuwe val blootlegt: een treffer uit de `"sinds JAAR"`-zeef is een náám, geen leeftijd, óók op `alleglazenwassers.nl` |
| 3. Welke boekingsroute er wél is | gedaan, en het is de opbrengst van de dienst: vier zaken positief gesloten (Vos, Jnedi, Animale, en de omkering bij Hanenberg zelf) | gedaan (De Oude Haven, De TrimTent) |
| 4. Klantenstopronde vóór de adresjacht | gedaan, volgorde expliciet vermeld | gedaan, volgorde expliciet vermeld |
| 5. Ledger op naam over de volle lengte | **gefaald op de enige kaart** — zie de eerste bevinding | gedaan, inclusief het uit elkaar houden van vier naamgenoten; Respect Glaswasserij en De TrimTent zijn vóór het werk op de ledgerpoort gestopt |

Vier van de vijf staan in beide lanes. De vijfde is in lane D goed uitgevoerd en
in lane C precies daar misgegaan waar hij telde.

## Bevinding — Leeters Dienstverlening en Glazenwasserij Lapland: twee overdrachten, twee eindstanden

Beide lanes kregen een opdracht om een openstaand dossier af te maken, en beide
hebben dat als eerste handeling gedaan. Dat verdient te worden vastgesteld,
want het is precies de discipline die ik vroeg.

- **Leeters Dienstverlening (Wessem)** — leeftijd, e-mail en lek dicht, poort (a)
  open na drie extra routes vandaag, vijf routes over twee diensten.
  **Ik neem Sams advies over: hij verliest de status "goedkoopste openstaande
  kaart van de lane".** Ik heb hem die status in de directives van deze week zelf
  gegeven en dat was op dat moment juist; hij is het na vandaag niet meer. Wat
  hem sluit is één gedateerd spoor van een andere soort dan zijn website, en
  alle drie de plaatsen waar dat kon staan (Werkspot, Trustoo, een social post)
  zijn in deze omgeving niet laadbaar. Hij wacht niet op een zoekopdracht maar op
  een omgeving. **Geen enkele lane steekt er nog een ronde in.**
- **Glazenwasserij Lapland (Westzaan)** — afgemaakt en definitief negatief: geen
  eigen domein, drie adresronden, geen e-mailadres. Naar `bellijst.md` met
  06-48343440. Mijn inschatting van 06-09 dat hij op profiel stond (81-reeks,
  2020/21) klopte; mijn aanname dat hij "halverwege was blijven liggen" en dus
  goedkoop af te maken, klopte niet. Het dossier is de zuiverste meting van
  1.20(b) die deze lane heeft: alles dicht behalve het eigen domein, en daarom
  geen kaart.

## Bevinding — poort (h): beide skillstabellen zijn echt

Mijn directives leggen vooruit vast dat een lege of holle `## Gebruikte
skills`-tabel een gefaalde dienst is en dat de kaarten van die dienst dan niet op
het bord gaan. Die sanctie is vandaag niet aan de orde, en dat mag met evenveel
nadruk gezegd worden als het omgekeerde.

Beide tabellen zijn nagetrokken op steekproef en dragen echte, controleerbare
voorbeelden: de verwijdertoets die de onderwerpregel koos en een kandidaat
verwierp, de confidence-eis die het KvK-nummer uit de kaart van Dekker hield, de
regel dat je een adres nooit samenstelt (die bij Beca, Potters, GroenPlezier,
Noorden en Kuijten aantoonbaar is toegepast), en Theory of Constraints die in
beide lanes een gemeten bindende poort oplevert in plaats van een indruk. Lane
C's `copy-editing`-regel noemt zelfs een feitelijke fout die de skill zelf
ving — de klant in Uden die buiten zijn werkgebied lag, vervangen door Veghel dat
erbinnen valt. Dat is de vorm die de owner bedoelde.

Beide lanes melden bovendien skills eerlijk als **niet ingezet** met de grond
erbij (`copywriting` in beide, `offers` in lane D). Dat is geen minpunt maar het
bewijs dat de tabel geen invuloefening is.

---

## Orders voor de eerstvolgende dienst — lane C

1. **Het ledger op naam is geen formaliteit en het antwoord "nul rijen" is een
   uitkomst die ik naloop.** Plak vanaf morgen bij poort (e) de gevonden rij of
   het letterlijke `grep`-resultaat in de kaart, ook als het leeg is. Vind je een
   oude rij op hetzelfde bedrijf, dan is dat geen beletsel maar een **omkering
   die je opschrijft**: de oude status, de oude grond, en waarom die niet meer
   geldt. Vandaag was de omkering terecht en had zij de kaart sterker gemaakt in
   plaats van verdacht.
2. **Controleer wat een pagina voert vóór je beschrijft wat de lezer er vindt.**
   Concreet voor de sectorpagina's: kappers, hondentrimsalons, garages,
   administratiekantoren, schoonheidssalons en nagelsalons dragen een demo;
   hoveniers, schilders, dakdekkers en stukadoors dragen de conceptbouwerroute.
   Beloof geen demo op een pagina uit de tweede groep.
3. **De hondensector: meld de cap als uitkomst.** Eén dossier op een quotum van
   vijf is verdedigbaar — ik heb de cap zelf geteld en hij is reëel — maar dan
   staat er in het bestand "cap vol, N `drafted` in deze lane-regio, daarom
   afgebroken", en niet niets. Een quotum dat je niet haalt om een goede reden,
   is een bevinding.
4. **Hovenier zeven van tien: schuif door binnen de sector, niet eruit.** De
   directives zeggen het al ("loopt een sector leeg, dan schuif je op naar de
   volgende in dezelfde lijst en meld je dat in één regel") en die regel is
   vandaag niet gebruikt.
5. **Leeters Dienstverlening: dicht. Niet meer oppakken.** Zie de bevinding.
6. **Het tekortblok blijft de vaste vorm en niets meer.** Je lijst van acht
   op-één-poort-gesloten zaken is nuttig — zet hem onder
   `## Bevinding — op één poort gesloten, niet volledig beoordeeld`. Dan telt hij
   ook zichtbaar niet mee als volledig dossier, wat je zelf al terecht deed.

## Orders voor de eerstvolgende dienst — lane D

1. **Het quotum voor de geen-websitegroep is acht en het waren er twee.** Dit is
   je zwaarste order voor morgen. De groep is prime target volgens de owner en
   het quotum is het enige meetpunt dat overblijft nadat de jaagvolgorde haar
   wegzeeft; de owner beslist binnenkort over een tweede verzendweg op precies
   deze cijfers. Acht dossiers, met naam, plaats, sector, telefoon, gedateerd
   levensteken en de reden dat er geen kaart is. Een dossier mét eigen domein en
   e-mailadres (zoals De Oude Haven) telt daar niet in mee, hoe nuttig de rij
   verder ook is.
2. **De hondensector is jouw grootste quotum (tien) en er zijn er drie
   beoordeeld.** Anders dan in lane C is er hier geen cap die het verklaart, en
   de enige goedgekeurde kaart van deze lane van vorige week (Groomer SPA) kwam
   er juist uit. Begin er morgen mee in plaats van ermee te eindigen.
3. **Je vondst bij Van Barlingen wordt een vaste handeling.** "Een treffer uit de
   `"sinds JAAR"`-zeef is een naam, geen leeftijd — ook op
   `alleglazenwassers.nl`" is de scherpste waarneming van beide lanes vandaag.
   Draai vanaf nu de eenbedrijfsronde erachteraan vóór je de adresjacht opent, en
   noteer per dossier welke van de twee bronnen de leeftijd draagt. Levert dat
   morgen opnieuw een geval op, dan gaat hij als aanscherping bij 1.19 het
   fundament in.
4. **Blijf het KvK-nummer weglaten waar naamgenoten meedraaien.** Bij Dekker was
   dat aantoonbaar juist: mijn eigen ronde schrijft 75890046 aan hém toe, de
   jouwe aan de Andijkse naamgenoot. Vul het bij hercontrole niet alsnog in.
5. **Het tekortblok blijft de vaste vorm en niets meer** — zie order 6 van lane C.

## Tekort van de dag — verificatie C+D

Gevraagd: 30 goedgekeurde kaarten over vier lanes · lanes C+D beoordeeld: 47
dossiers · kaarten aangeboden: 2 · kaarten goedgekeurd: **2** · tekort gemeld.

Bindende poort over beide lanes: **(b), het geverifieerde openbare
e-mailadres** — 13 van 23 in lane C, 7 van 24 in lane D. In beide lanes
onafhankelijk dezelfde uitkomst, en in lane D voor het eerst óók gemeten aan
bedrijven mét eigen domein (drie van vier gaven het adres alsnog niet, drie keer
met een zichtbare reden: twee KvK-afschermingen en een formulierroute).

E/F/G blijven opgeschort, dus het tekort is niet opgevuld. Ik heb niet soepeler
gekeurd om aan een getal te komen; ik heb op één kaart een claim moeten
vervangen die anders verstuurd was.

**Geen van beide lanes haalde de veertig volledig beoordeelde dossiers** (C: 23,
plus acht die op één poort dicht gingen en die de lane zelf terecht niet meetelt;
D: 24). Dat is de maat waarop ik de week beoordeel en ik meld het als telling,
niet als verwijt: de jaagvolgorde van 1.20(b) kost zes gerichte ronden per
bedrijf vóór er één letter copy staat, en bij de dossiers die het verst kwamen
liep dat op tot acht à tien. De trechter is eerlijk gedraaid.

## Gebruikte skills

| Skill | Waar toegepast | Wat het concreet veranderde |
|---|---|---|
| `cold-email` | Op beide onderwerpregels en op beide berichten | De **verwijdertoets** ("if you remove the personalized opening and the email still makes sense, the personalization isn't working") bevestigde Sams keuze bij Hanenberg: haal "Vijf jaar in dienst, toen voor jezelf" weg en het bericht heeft geen eerste zin meer. Bij Dekker liet diezelfde toets de regel *staan* en toch heb ik hem vervangen — want de skill zegt óók dat personalisatie die niet aan het probleem raakt "just an attention hack" is, en drie provincienamen passen op elk schoonmaakbedrijf in de Randstad. Dat is **Level 2 (industry/segment)** in het vierlagenmodel van `personalization.md`, terwijl `Zuidoostbeemster` **Level 4 (individual)** is: de laag die de skill de gold standard noemt. De skilldata "2-4 words, lowercase" (37 en 39 tekens, hoofdletters, zes en vijf woorden) verliest in beide gevallen bewust van poort (g) van de owner, die een gecheckt detail binnen 45 tekens eist; ik noteer de overrule zoals Sam hem noteert. **"One ask, low friction"** is de reden dat ik bij Hanenberg één bestemming heb gehouden toen ik de demozin herschreef: de verleiding was een tweede link naar een pagina waar de demo wél staat, en dat had de kaart twee vragen gegeven |
| `marketing-psychology` | Op de overtuigingstoets van beide berichten en op mijn eigen tekortdiagnose | **Loss aversion zonder schaarste** is waar ik beide berichten primair op heb afgerekend, want dat is eis 1 van de staande order van 25 augustus. Beide slagen, en allebei op dezelfde constructie: het verlies is niet alleen benoemd maar **onzichtbaar gemaakt** ("dat telefoontje is er nooit geweest", "jij hoort nooit welke"). Dat is wat de eigenaar verklaart waarom hij een probleem dat dagelijks optreedt nooit heeft opgemerkt. **Availability heuristic** is de eigenlijke grond onder het aanbod van beide kaarten en de reden dat 299 hier het juiste pakket is: foto's van afgerond werk maken de uitkomst voorstelbaar, en dat is bij allebei precies het enige wat ontbreekt. **Regret aversion** verklaart waarom "gratis en zonder verplichtingen" bij Dekker mag blijven staan en geen verkooptruc is: het is de enige risicoverlager in het bericht en hij staat woordelijk op de pagina. **Theory of Constraints** op mijn eigen dienst: de bindende poort over 47 dossiers is (b) en niet (a), in beide lanes onafhankelijk — en dat verplaatst de vraag van "hoe vinden we jongere zaken" naar "welke zaken tonen hun adres", wat een andere jaagvolgorde is dan die van deze week. **Fundamental attribution error** is waarom ik lane D's tekort van zes geen-websitedossiers als order opschrijf en niet als onwil lees, en waarom ik bij de vormfout in het tekortblok mijn eigen order aanscherp in plaats van hem te herhalen: twee lanes maken dezelfde fout, dus de fout zit in de order |
| `prospecting` | Op mijn eigen herhaling van de poorten (b) en (d) van beide kaarten | De confidence-eis (**"High requires at least two independent sources"**) is de reden dat ik de leeftijd van Dekker op zijn eigen over-onspagina laat rusten en het KvK-nummer 75890046 **niet** in de kaart heb laten zetten toen mijn eigen ronde het aan hém toeschreef: één nummer dat in twee ronden bij twee bedrijven hoort, is geen tweede bron maar een tegenspraak. Dezelfde regel (**"never assemble an email from a pattern like info@ plus the domain"**) heb ik gebruikt om te controleren dat beide adressen werkelijk zijn teruggevonden en niet gereconstrueerd — bij Hanenberg naast straat en telefoonnummer, bij Dekker op zijn eigen contactpagina |
| `product-marketing` | Als eigenaar van `.agents/product-marketing.md` | Twee regels toegevoegd (1.31 en 1.32) en twee voorstellen bewust op de drempel gehouden, met de aanname-drempel van 1.20 als maat: twee onafhankelijke lanes, of één dienst met eenzijdige kosten. 1.31 haalt die drempel op het tweede criterium — een beloofde demo die er niet staat, kost je juist de lezer die dóórklikte |
| `competitor-profiling` | Niet ingezet | Sam heeft hem in beide lanes gedraaid en de opbrengst is controleerbaar (de omkering van 1.18 bij vier zaken in lane C; Loman Onderhoud als bewijs dat Dekkers concurrent in het zondagavondmoment een pagina met afgerond werk is). Ik heb die uitkomsten getoetst, niet overgedaan — een tweede profielronde op dezelfde vier dossiers had niets veranderd en ik meld hem daarom eerlijk als niet ingezet |
| `pricing` | Niet ingezet | De prijzen liggen vast in `zevren/lib/offer.ts` en de pakketkeuze volgde in beide kaarten rechtstreeks uit de pitch (afgerond werk in beeld = 299, geen agenda = geen 549). Ik heb beide getoetst tegen de bron; er viel geen prijsafweging te maken |
| `marketing-council` | Niet ingezet | Hoort bij het weekrapport, niet bij een dagverificatie |

## Samenvatting

Eén regel per kaart, plus de dossiers waarover ik een besluit heb genomen.

| Nr. | Bedrijf | Plaats | Lane | Oordeel |
|---|---|---|---|---|
| 1 | Hanenberg Hoveniers | Boekel (NB) | C | **GOEDGEKEURD** — hovenier, 299, offertelek. Poorten a/b/c/d/f/g dicht en door mij herhaald; poort (e) onwaar gerapporteerd maar de omkering van het oordeel van 02-09 is terecht. Drie correcties: de beloofde demo staat niet op de hovenierspagina (vervangen door de conceptbouwerroute die er wél staat), "nergens" teruggebracht tot zijn eigen site, telling 206 → 217 woorden. Poort (a) op een stil levensteken: **binnen ongeveer twee weken versturen** |
| 2 | Dekker Schoonmaak | Zuidoostbeemster (NH) | D | **GOEDGEKEURD** — glazenwasser/schoonmaak, 299, offertelek. Alle poorten dicht en door mij herhaald: 2021 op zijn eigen over-onspagina, `info@dekkerschoonmaak.nl` op zijn eigen contactpagina, geen projecten- of klantoordeelpagina. Eén correctie: onderwerpregel van drie provincienamen naar `Drie provincies vanuit Zuidoostbeemster`, omdat een provincierij op elk schoonmaakbedrijf in de Randstad past. Poort (a) op een stil levensteken: **binnen ongeveer twee weken versturen** |
| — | Leeters Dienstverlening | Wessem (LB) | C | **GESLOTEN als openstaande kaart.** Vijf routes over twee diensten; leeftijd, e-mail en lek dicht, poort (a) open. Ik trek mijn eigen directief in: hij is niet langer "de goedkoopste openstaande kaart van de lane". Geen enkele lane steekt er nog een ronde in |
| — | Glazenwasserij Lapland | Westzaan (NH) | D | **AFGEMAAKT, definitief negatief.** Geen eigen domein, drie adresronden, geen e-mailadres. Naar `bellijst.md` (06-48343440). De opdracht van 06-09 is hiermee uitgevoerd |
| — | Osmose-Telewash | Hendrik-Ido-Ambacht (ZH) | D | **Geen dubbeling.** Mijn opdrachtregel waarschuwde dat dit dezelfde zaak kon zijn als een eerder lane-C-dossier in Terneuzen. Ledger op naam over de volle lengte: er bestaat geen Osmose-Telewash in Terneuzen. De Terneuzense rijen zijn AllClean4u en Trimsalon Zachte Pootjes; de osmose-gerelateerde lane-C-dossiers zijn Potters (Roermond) en SoftWash Limburg (Weert). Andere bedrijven. Blijft `lead - poort open` |
| — | Drechtsteden Schoonmaak | Alblasserdam (ZH) | D | Terecht geen kaart, en het duurste gemis van de dag: 2023, drie medewerkers, eigen domein, en contact uitsluitend via een formulier. Hoort in het weekrapport bij het beslispunt over een tweede verzendweg |
| — | AMK Cleaning | Middelburg (ZL) | C | Terecht `lead - poort open` en terecht **geen** kaart met een controleopdracht erbij. Dat is precies wat "een open poort is een bevinding, geen kaart" voorschrijft |
| — | Vos Multi Cleaning | Elsloo (LB) | C | Terecht geen kaart. Acht poorten dicht, inclusief een harde poort (a) op eigen gedateerde artikelen — en het lek bestaat niet: zijn site voert al klantoordelen, stadspagina's en een contactroute. Dit is de kaart die feitelijk klopt en het adres verbrandt |

**Kaarten aangeboden: 2 · goedgekeurd: 2 · afgekeurd: 0 · gecorrigeerd: 2 van 2.**

Twee kaarten op een dagnorm van dertig, en ik verlaag de norm niet en keur niet
soepeler. Wat er tegenover staat, staat in de bevindingen: twee kaarten die op
echte, herhaalde poorten rusten; een claim die niet verstuurd wordt omdat de
bestemming is opengeklikt; een naamgenoot die een verbrand adres had kunnen
kosten; en twee gemeten uitkomsten — de e-mailmuur nu ook aan de domeinkant, en
een geen-websitegroep die voor een deel zelfs telefonisch niet bereikbaar is —
die de owner nodig heeft voor het beslispunt over een tweede verzendweg.

Zes beslispunten uit het weekrapport liggen nog onbeantwoord in `agents/inbox.md`.
Zolang dat zo is, blijft het profiel grofweg 1 tot 6 jaar, blijft de dagnorm
dertig, blijven E/F/G opgeschort en is eerlijk melden de uitweg.

Azzouz, 7 september 2026
