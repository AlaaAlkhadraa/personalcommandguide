# Verificatie 2 september 2026 — lanes C en D

Azzouz, verificatiedienst. Beoordeeld: `2026-09-02-c.md` (Limburg, Noord-Brabant,
Zeeland, 1 kaart) en `2026-09-02-d.md` (Noord-Holland, Zuid-Holland, Utrecht,
0 kaarten). Lanes A en B liggen bij een tweede verificatiekind en zijn hier niet
geopend.

**Uitkomst in één zin: de ene kaart van lane C is GOEDGEKEURD na vier correcties,
de nul van lane D is echte discipline en geen uitgevallen levering, beide diensten
halen poort (h) — en de belangrijkste vondst van vandaag is dat lane C en lane D
in twee verschillende regio's onafhankelijk dezelfde nieuwe poort-(a)-route
hebben gevonden.**

Wat ik buiten de repo heb nagetrokken staat per claim met de bron erbij. Werkspot,
Trustoo, schilder-nu en het eigen domein van de prospect zijn in deze omgeving
niet direct op te halen (egress geblokkeerd); waar dat speelt, staat erbij welke
bereikbare bron de claim alsnog bevestigt.

---

## 1. van de Nieuwenhof Schilderwerken — Veghel

**GOEDGEKEURD**, met vier correcties in de tekst. Het dossier is het beste dat
deze week door mijn handen is gegaan, en de reden is niet de kaart zelf maar de
zoekopdracht die de kaart bijna sloopte: Sam had het portfoliolek al klaarliggen
en heeft het met één weerleggingszoekopdracht zelf onderuitgehaald in plaats van
het te versturen. Dat is precies het gedrag dat de 29-08-afkeuringen moesten
kweken.

**De poorten, met wat ik zelf heb nagetrokken:**

- **(a) Gedateerd levensteken — DICHT.** Sam noteert een Werkspot-profiel-
  beoordeling van 21-03-2026. `werkspot.nl` is hier niet op te halen, dus ik heb
  de datum langs een tweede weg bevestigd: de zoekresultaten op de zaak melden
  uitdrukkelijk een beoordeling van **maart 2026** over uitstekend geleverd werk
  met eerlijke communicatie over meerwerk. Vijf maanden oud, ruim binnen de twaalf.
  Het is een daad van een klant bij dít bedrijf, geen verversingsstempel van een
  gids — poort (a) haalt "Wiens daad draagt de datum" zonder discussie.
- **(b) Openbaar e-mailadres — DICHT.** `info@vdnieuwenhofschilderwerken.nl`,
  bevestigd in een onafhankelijke zoekronde, samen met telefoon +31633882652 en
  Dilleveld 32, 5467 KK Veghel. Het adres staat op zijn eigen domein en draagt
  exact de handelsnaam; er bestaat geen sterkere naam-adresmatch. **Correctie voor
  Sam: de bron van het adres staat wél in het ledger ("eigen contactpagina") maar
  niet op de kaart.** De volgende lane die dit dossier oppakt moet de bron op de
  kaart kunnen lezen zonder het ledger erbij te halen.
- **(c) Review- en scoreclaims — ECHT.** 44 beoordelingen met een 10,0, in twee
  onafhankelijke zoekrondes teruggekomen ("more than 44 reviews and a 10/10
  rating"), plus Trustoo 9,6 en top 10 van Veghel. Een gemiddelde van precies 10,0
  op een schaal tot 10 kan alleen ontstaan als alle beoordelingen een tien zijn,
  dus "allemaal een tien" is gedekt door wat de bronnen publiceren. **Wel dit:**
  gaat een volgende lane dit getal hergebruiken en staat er dan 9,9, dan vervalt
  "allemaal" onmiddellijk en wordt het "gemiddeld een tien".
- **(d) Elke claim gedekt door zevren.nl — DICHT, en ik heb het in de code
  nagelegd.** `zevren/lib/local/sectors.ts` voert `slug: "schilders"` met
  `planKey: "starter"`, en `zevren/lib/offer.ts` zet starter op **299**. De pagina
  rendert `PackagesSection`, dus "met de prijs er gewoon bij" is letterlijk waar.
  De schilderspagina heeft géén `demoSlug` — haar bewijs is de conceptbouwer, en
  het paginasjabloon zet daar "Open de conceptbouwer" neer. Dat is precies wat mijn
  vierde correctie hieronder de tekst in trekt.
- **(e) Niet eerder benaderd — DICHT.** Eén rij in `contacted.md` (regel 897,
  status `drafted`, vandaag door lane C zelf gezet). Geen eerdere vermelding.
- **(f) Groeifaseprofiel — DICHT.** Actief sinds **juni 2022**, extern bevestigd
  ("since June 2022"), dus vier jaar en drie maanden: midden in het venster van
  grofweg 1 tot 6 jaar. Eén werkzaam persoon, erkend leerbedrijf op Stagemarkt,
  en de zaak omschrijft zichzelf als jong en dynamisch. Geen enkel klantenstop- of
  wachtlijstsignaal. Dit is het profiel dat de order van 24 augustus wil raken.
- **(g) Onderwerpregel draagt een concreet gecheckt detail — DICHT.** "44 tienen"
  is zijn eigen getal, het staat in de eerste veertien tekens, de regel is 40
  tekens en dus binnen de ±45 die op een telefoon zichtbaar zijn, en er staat geen
  "website" of "ZEVREN" in.
- **De sectorcap:** één `drafted` schildersrij in lane C in zeven dagen. De cap
  (drie per sector per lane-regio, en alleen kaarten tellen) is niet in zicht.
- **De portfoliopoort:** ik heb Sams weerleggingszoekopdracht overgedaan en
  `vdnieuwenhofschilderwerken.nl/projecten/kozijnen/` bestaat inderdaad — een
  projectpagina over het plaatsen van neuslatten. Het "hij kan zijn werk niet
  laten zien"-lek bestaat bij deze man aantoonbaar niet, en het staat terecht
  nergens in het bericht.
- **De leadkostenclaim:** nagetrokken bij de bron. Werkspots eigen helpdesk
  ("Hoe worden de leadkosten berekend?") zegt letterlijk dat de leadprijs kan
  variëren **van € 3,00 tot € 75,00** en dat de kosten in rekening worden gebracht
  **wanneer een consument bij wederzijdse interesse contactgegevens deelt**. De
  zin in het bericht is woordelijk correct, inclusief het afrekenmoment. Mijn
  correctie van 01-09 (75 in plaats van 60) is dus juist en is hier goed toegepast.

**De vier correcties, en waarom elke ervan nodig was:**

1. **De demo ontbrak, en dat is de enige echte tekortkoming in deze tekst.** De
   staande order van 25 augustus eist "de demo is de bewijslast, niet de prijs —
   noem hem één keer, met een concrete uitnodiging". De tekst noemde hem nul keer;
   Sams eigen skillslog geeft toe dat de verwijzing naar de conceptbouwer er ónder
   de regel "one ask, low friction" is uitgehaald. Dat is één regel te ver
   doorgevoerd: het weglaten kostte niet een tweede vraag maar het enige
   bewijsstuk dat wij zonder klantnamen kunnen tonen. Gedragsmatig is het nog
   duurder — het bericht eindigde op een prijs en een kale link, dus op maximale
   *activation energy*: er was niets wat hij vanavond in dertig seconden kón doen.
   De conceptbouwer verlaagt die drempel én zet het *IKEA-effect* aan, want wat
   hij zelf bouwt waardeert hij hoger. Opgelost zónder tweede link: de
   conceptbouwer stáát op de schilderspagina waar de link al heen wijst, dus de
   uitnodiging kost één zin en nul extra klikpaden.
2. **"geen rekening per klant" wordt "geen kosten per klant".** Dat is niet
   smaak: 1.11 legt die formulering vast als de toegestane vorm, juist omdat
   domein en hosting via het optionele verzorgingsplan lopen en de zin anders
   meer belooft dan de site waarmaakt.
3. **Er stond geen aanhef.** Een Nederlandse zakelijke mail die koud met een
   scène begint leest als een nieuwsbrief. Ik zet er "Hoi," boven en bewust
   **geen voornaam**: de contactpersoon komt in één zoekronde als Chicardo van de
   Nieuwenhof boven, en één bron is voor een aanhef te weinig — een verkeerde
   voornaam in regel één is duurder dan geen voornaam.
4. **Het registerregeltje ontbreekt op de kaart.** Het fundament eist dat de keuze
   "u" of "je" per kaart in één regel verantwoord staat. De keuze zelf is juist —
   "je" bij een eenmanszaak van vier jaar waar de eigenaar zelf op de ladder staat
   — maar hij is niet opgeschreven. Ik noteer hem hierbij namens Sam.

**Wat ik uitdrukkelijk NIET heb veranderd.** De onderwerpregel blijft zoals Sam
hem koos. De `cold-email`-data zegt dat cijfers in een subject de opens met 46%
drukken en dat twee tot vier woorden winnen; die data verliest hier van de owner,
die in zijn eigen voorbeeldenlijst "Uw 47 vijfsterrenreviews verdienen meer dan
een Facebookpagina" als gòed patroon neerzet en in poort (g) een concreet gecheckt
detail eist. Sams afweging tussen de drie kandidaten is bovendien de juiste om de
juiste reden: "Uw 44 tienen staan op Werkspot" sluit de lus in de regel zelf en
haalt het *Zeigarnik*-effect eruit dat de gekozen regel wél openhoudt.

De persuasietoets langs de zeven eisen: het lek staat in geld en tijd (3 tot 75
euro per lead, plus de man die nooit belt), het bewijs komt uit zijn eigen zaak
(zijn 44 tienen, zijn vier jaar, zijn kozijnen), er is één beeld (de buurman die
's avonds zijn naam intypt), de demo staat er ná correctie 1 in, de prijs staat
er zonder verontschuldiging, er is geen schaarste en geen "wij zijn klein", en de
tekst telt **207 woorden** (geteld) tegen de eis van 160-220. De handtekening is
exact het voorgeschreven blok, telefoonnummer inbegrepen.

Onderwerp (40 tekens, geteld):

```
44 tienen, en ze staan bij iemand anders
```

Bericht (207 woorden, geteld):

```
Hoi,

Iemand hoort van de buren dat jij hun kozijnen hebt geschilderd en typt 's avonds je naam in bij Google. Wat hij als eerste ziet is je profiel op Werkspot: 44 beoordelingen, allemaal een tien. Daar staat een knop naast om vier offertes aan te vragen, en zo staan er ineens drie andere schilders naast jou.

Van die man hoor je nooit iets — hij belt niet, dus je weet niet eens dat hij er was. En komt hij er wél via Werkspot doorheen, dan betaal je ervoor: dat platform rekent 3 tot 75 euro per lead, op het moment dat jullie elkaars gegevens uitwisselen. Je hebt in vier jaar 44 keer een tien opgehaald, en dat bewijs staat op de pagina van een ander.

Wat er ook kan: hij typt je naam in en komt op jouw eigen pagina uit. Geen offerteknop ernaast die er drie concurrenten bij haalt, en geen kosten per klant.

Op zevren.nl staat een pagina voor schilders met de prijs er gewoon bij: eenmalig 299 euro. Op diezelfde pagina kies je in de conceptbouwer een stijl en kleuren, en zie je meteen een voorbeeld van je eigen homepage. Gratis en zonder verplichtingen.

zevren.nl/website-voor/schilders?utm_source=outreach&utm_medium=email&utm_campaign=schilders-w36

Bellen mag ook, dat gaat vaak sneller dan mailen.

Met vriendelijke groet,
Alaa
ZEVREN, Maastricht
06-30958710 · zevren.nl
```

**Register:** `je`. Eenmanszaak van vier jaar, één werkzaam persoon, de eigenaar
staat zelf op de ladder — dat is de kant van de scheidslijn waar "je" hoort.

**De UTM en de branchepagina:** goedgekeurd. `zevren.nl/website-voor/schilders`
bestaat (`SECTORS`, slug `schilders`) en 2 september 2026 valt in ISO-week 36
(die maandag 31 augustus begint), dus `schilders-w36` klopt. De link staat op
sectorniveau en nooit per ontvanger, precies zoals de directives eisen.

## Lane D — nul kaarten GOEDGEKEURD als eerlijk tekort

Ik heb de vraag gesteld die het briefingsdocument stelt: is dit discipline of is
dit een uitgevallen levering? **Het is discipline, en het is aantoonbaar.**

De toets is niet of er nul kaarten staan maar of elk dossier dat de andere poorten
haalde, op een genoemde en controleerbare grond is gestrand. Dat is per dossier
na te lopen en het klopt zestien keer:

- **Elk dossier met een e-mailadres valt op een ándere poort.** Trimsalon
  Wassenaar heeft een adres en is negen jaar (buiten venster). Anne's kWAFure
  heeft een adres en heeft als jongste daad 01-07-2024, zesentwintig maanden
  (poort a open). Fietsmobiele heeft een adres én een gedateerde beoordeling van
  april 2026 én een telefonisch-alleen afsprakenlijn — drie poorten dicht — en
  staat zeventien jaar op Marktplaats. Dat is de zuiverste van de zestien: alles
  dicht behalve de leeftijd, en die ene beslist.
- **Elk dossier dat de andere poorten haalt, mist het adres.** Jodieh's Trimsalon
  is een kaart op één regel na en de vier zoekronden staan er benoemd bij (naam +
  stad, naam + gmail/hotmail/outlook, naam + oozo/drimble/infobel/cylex, naam +
  stagemarkt/socials). Sinds 25 augustus is dat een harde afkeuring en geen
  afweging, hoe goed de tekst ook is. Lane D past die regel toe op zijn eigen
  beste dossier van de dag, en dat is precies waar zo'n regel voor bestaat.
- **Er is geen enkele controleopdracht voor de owner doorgeschoven.** Geen "kijk
  jij even of". Dat was in augustus twee keer de reden dat kaarten sneuvelden.

Twee dingen die deze nuldienst boven die van gisteren tillen:

- **De lane geeft een eigen fout toe met naam en toenaam.** "De poort die ik
  gisteren onsluitbaar noemde, is sluitbaar, en ik had ongelijk" — inclusief de
  vaststelling dat die verkeerde conclusie de aanbeveling voor vandaag heeft
  gestuurd. Een lane die zijn eigen gisteren corrigeert, is meer waard dan een
  lane die een kaart forceert.
- **De drie Purmerendse trimsalons zijn afgesloten en niet voor de derde keer
  doorgeschoven.** Dat is de juiste beslissing en de lane noemt hem bij naam: nog
  een dag dezelfde drie zaken langslopen is het lokale optimum. Ze staan nu in
  `bellijst.md` met telefoonnummer, waar ze in tien seconden te sluiten zijn door
  iemand die kan bellen.

**De vorm is goed.** Alle koppen zijn `## Bevinding — <onderwerp>`, ongenummerd,
dus geen enkele kop kan het kaartpatroon `## N. Naam — Plaats` nabootsen. De voor
Jodieh's klaargelegde tekst staat uitdrukkelijk niet in de kaartvorm en de lane
zegt dat er zelf bij. Dat is 1.10 correct toegepast.

**De klaargelegde tekst van Jodieh's is geen kaart en krijgt dus geen oordeel,
maar ik heb hem wel nagelegd, want hij wordt er ooit een.** 211 woorden (binnen
de band), handtekening exact, register `je` verantwoord, pakket 549 omdat het
bericht een agenda verkoopt. De claim die ik apart heb nagetrokken is "hij krijgt
meteen een bevestiging": `zevren/lib/local/sectors.ts` laat de
hondentrimsalonpagina zeggen dat de demo "een behandeling, een moment en een
bevestiging" laat doorlopen, dus de claim is gedekt. De pagina draagt
`planKey: "business"` (549) en de barbershop-agendademo, dus ook "een agenda die
echt werkt" is waar. Er wordt nergens een herinnering beloofd. **Als het adres
ooit boven water komt, kan deze tekst zonder herschrijven de kaartvorm in.**

## Bevinding — twee lanes vonden vandaag onafhankelijk dezelfde nieuwe poort-(a)-route

Dit is het waardevolste dat vandaag op het bord staat, en het is alleen vanaf
deze stoel zichtbaar omdat geen van beide lanes het bestand van de ander kent.

- **Lane C, Noord-Brabant/Limburg/Zeeland:** "de eigen prijsaanpassing met het
  lopende jaartal", zoekopdracht `<sector> "per 1 januari 2026" prijzen verhoogd
  OF aangepast`. Eén opdracht, vijf salons met een leesbare datum op hun eigen
  domein.
- **Lane D, Noord-Holland/Zuid-Holland/Utrecht:** "de tarievenpagina van het
  lopende jaar", zoekopdracht `trimsalon "per 1 januari 2026" tarieven verhoogd
  hond <provincie>`. Eén opdracht, zes salons.

Dezelfde route, dezelfde dag, twee regio's, geen contact — en drie namen komen in
beide lijsten terug (Woeffie, Trim Salabim, TRIM ME!). Dat is precies de bar die
het fundament stelt voor een wijziging: bewijs uit meer dan één lane. De route
gaat vandaag als **1.13** het fundament in.

Twee dingen horen er bij, en beide komen van de lanes zelf:

- **Het jaartal moet het lopende jaar zijn.** "Per 1 januari 2025" is twintig
  maanden en telt niet. Een kale prijslijst met "2026" erboven telt evenmin: de
  **aankondiging van de wijziging** is de daad met de datum, de lijst zelf niet.
  Hondentrimsalon Dinges (tarieven per 01-07-2026) is het bewijs dat de route niet
  toevallig één keer aansloeg.
- **Hij werkt in elke afspraaksector die met uurtarieven werkt** en die dus in
  januari aanpast: trimsalons, kapsalons, pedicures, schoonheidssalons, fysio.
  Dat is een jaarlijks terugkerend, zelf gepubliceerd, gedateerd feit in precies
  de sectoren waar het agendabericht op past.

## Bevinding — lane C en lane D vinden ook dezelfde jaagregel, van twee kanten

Minder hard dan de route hierboven, maar het patroon is te scherp om te laten
liggen, dus het gaat als advies mee en niet als vastgelegde regel.

Lane C: zeven jonge schilders opgehaald via de oprichtingsdatum in de vakgidsen,
zeven van zeven zonder één beoordeling — dus zeven van zeven zonder gedateerd
levensteken én zonder de "aantoonbaar lopende zaak" die de order van 24 augustus
eist. Voorstel van lane C: zoek op véél beoordelingen en controleer daarna de
leeftijd.

Lane D: twaalf zoekopdrachten op de sector leverden alleen te oude of al boekende
zaken; één omgekeerde opdracht op de woorden van de ondernemer zelf ("eigen
trimsalon gestart", "nieuw geopend", "sinds 2023") bracht twee zaken binnen het
venster boven die de twaalf eerdere hadden gemist.

Ze wijzen naar hetzelfde: **de gidsenroute selecteert op overlevingsduur en dus
tegen ons profiel in.** Ze wijzen naar een verschillende uitweg — lane C via het
reviewvolume, lane D via de eigen woorden van de starter — en die twee sluiten
elkaar niet uit maar vangen de twee helften van de doelgroep. Ik neem ze nog niet
als regel op: één dag, en beide lanes hebben hun eigen route maar één keer
gedraaid. **Order: draai ze morgen allebei, elk in de lane waar hij níet vandaan
komt.** Werkt lane C's volgorde ook in het noorden en lane D's vorm ook in het
zuiden, dan is het 1.14 waard.

## Bevinding — de bindende beperking van lane D ligt niet in lane D

Lane D past *Theory of Constraints* correct toe en komt uit op het e-mailadres.
Dat klopt binnen de dienst. Eén laag hoger klopt het niet, en dat moet gezegd,
want anders krijgt deze lane morgen weer een opdracht die haar eigen probleem
niet kan raken.

Drie diensten, nul kaarten, en de vorm van het tekort is elke keer dezelfde: een
zaak die op alles klopt behalve het adres, mét een telefoonnummer. Dat zijn nu
vijf regels op de lane D-bellijst, waarvan twee met een gedateerd levensteken en
dus belklaar. Meer zoekopdrachten kunnen daar niets aan doen — dat is het lokale
optimum, en lane D benoemt het zelf. De beperking is **beslissing 2 bij de owner**
(laten we de bellijst bellen), en die staat sinds 30 augustus open.

Ik zeg er het ongemakkelijke deel bij, want het is ook van mij: ik keur streng op
acht poorten die nooit tegen één werkelijke uitkomst zijn geijkt, want er is nog
geen enkele kaart verstuurd. Een lane die drie dagen nul levert omdat ze mijn
poorten eerbiedigt, is geen zwakke lane. **Fundamental attribution error, op
mezelf toegepast:** het ligt aan de omstandigheid, niet aan het karakter van deze
lane — en de omstandigheid is dat het beste werk van deze lane in een bestand
belandt in plaats van in een gesprek.

## Correcties die mee moeten naar de volgende dienst

Vier, klein en concreet.

1. **Lane C: bevindingskoppen op `## `-niveau, niet `### `.** Dit is geen vormpunt
   maar een parserrisico, en het is er vandaag echt een. In `2026-09-02-c.md` staat
   de kaartkop op regel 15 en de eerstvolgende `## `-kop op regel 311: alles
   daartussen — negen bevindingen — valt voor een bord dat op `## ` leest binnen de
   sectie van kaart 1. Dat is precies de manier waarop bij lane F een kaart tot het
   einde van het bestand doorliep. De vorm ligt vast in 1.10 en lane C koos hem op
   31-08 zelf; hij is vandaag teruggezakt naar `### `.
2. **Lane C: zet de bron van het e-mailadres op de kaart**, niet alleen in het
   ledger. Eén woord tussen haakjes is genoeg.
3. **Lane C: zet de registerregel op de kaart.** Eén regel, zoals het fundament
   eist. De keuze was goed; het bewijs van de keuze ontbrak.
4. **Beide lanes: de demo blijft in het bericht staan, ook als "one ask, low
   friction" hem eruit wil hebben.** De regel uit `cold-email` gaat over het aantal
   *vragen*, niet over het aantal *bewijsstukken*. Eén vraag en één bewijs is de
   vorm; nul bewijs is een tekort tegen de staande order van 25 augustus.

## Poort (h) — de skillslogs van beide lanes

Beide gehaald, en geen van beide hol.

**Lane C** logt zes skills met natrekbare voorbeelden. De sterkste is
`prospecting`: de regel over twee onafhankelijke bronnen wordt niet als vlag
gebruikt maar als rem, twee keer, met een aanwijsbaar gevolg (bestBuddys niet als
"geen boekingsroute" op één zoekronde, TRIM ME! niet als "veertien jaar" op één
getal waarvan de bron zelf niet weet wat het is). `copy-editing` noemt drie
woordwijzigingen met de reden erbij. Eén ding klopt niet: de log presenteert het
schrappen van de conceptbouwer als een verbetering onder "one ask, low friction",
en dat is de correctie hierboven — de skill is goed toegepast, op het verkeerde
element.

**Lane D** logt zeven skills en meldt er één eerlijk als **niet ingezet**
(`offers`, met de reden: er is geen kaart waarop een aanbod is samengesteld).
Dat is de rij die de poort bedoelt. `marketing-psychology` staat op de plek waar
1.11 hem op een kaartloze dag wil hebben — op de diagnose van het tekort — en
`cold-email` is toegepast op de klaargelegde tekst, ook precies zoals 1.11 het
sinds gisteren voorschrijft. De `customer-research`-rij levert bovendien de
inhoudelijke vondst van de dienst op ("waar laat dit segment dan wél een datum
achter") en hield tegelijk de "laatst bijgewerkt maart 2026" van Pawfect Trims
buiten de deur als technische stempel. Dat is een skill die werk heeft gedaan.

## Gebruikte skills

| Skill | Waar toegepast | Wat het concreet veranderde |
|---|---|---|
| `cold-email` | Op Sams drie kandidaat-onderwerpregels, op zijn bericht, en op de voor Jodieh's klaargelegde tekst | Twee dingen, in tegengestelde richting. De skilldata zegt dat cijfers in een subject de opens met 46% drukken en dat twee tot vier woorden winnen; op grond daarvan had ik "44 tienen, en ze staan bij iemand anders" moeten afkeuren. Ik doe dat niet, en de reden staat nu op de kaart: de owner eist in poort (g) een concreet gecheckt detail en zet in zijn eigen voorbeeldenlijst "Uw 47 vijfsterrenreviews…" als goed patroon neer. De skill verliest hier van de order, expliciet en niet stilzwijgend. In de andere richting hield **"personalization must connect to the problem"** Sams openingszin overeind: haal de buurman weg en het bericht valt om, dus de personalisatie draagt. En **"one ask, low friction"** heb ik tegen Sams eigen toepassing ingezet — de regel begrenst het aantal vragen, niet het aantal bewijsstukken, en dat verschil is correctie 1 |
| `marketing-psychology` | Op de invalshoek van kaart 1 en op beide tekortdiagnoses | Op de kaart: *loss aversion* is goed gekozen en goed uitgevoerd, maar de tekst eindigde op prijs plus kale link en dus op maximale **activation energy** — er was niets wat hij vanavond kón doen. Dat is de gedragsgrond onder correctie 1, naast de staande order, en de conceptbouwer zet er meteen het **IKEA-effect** bij. Het *Zeigarnik*-effect verklaart waarom Sams gekozen subject de twee afvallers verslaat: die sluiten de lus in de regel zelf. De **pratfall**-toets bevestigt dat het bericht Werkspot niet zwartmaakt en daardoor geloofwaardig blijft. Op lane D: hun *Theory of Constraints* klopt binnen de dienst, maar **lokaal versus globaal optimum** legt bloot dat de echte beperking beslissing 2 is en dus buiten de lane ligt. En **fundamental attribution error**, op mezelf gedraaid: drie nuldiensten verleiden tot "zwakke lane", terwijl deze lane vandaag de route leverde die lane C onafhankelijk bevestigde |
| `prospecting` | Op de vraag of ik de poorten van beide lanes zelf opnieuw zou sluiten | De eis van twee onafhankelijke bronnen dwong mij bij poort (a) van kaart 1: Werkspot is hier niet op te halen, dus "Sam zegt 21-03-2026" was geen bewijs. De tweede bron (een zoekronde die zelfstandig een maart-2026-beoordeling meldt) is wat de poort werkelijk sluit, en die stap staat nu op de kaart in plaats van als vertrouwen in het bestand van gisteren |
| `copy-editing` | Slotpas over de vier correcties in het bericht | De vervanging "geen rekening per klant" → "geen kosten per klant" komt niet uit smaak maar uit 1.11; de toegevoegde conceptbouwerzin is bewust in de woorden van de sectorpagina zelf geschreven ("stijl en kleuren kiezen", "een voorbeeld van je eigen homepage", "gratis en zonder verplichtingen"), zodat de mail en de landingspagina elkaar niet tegenspreken. Mechanisch nagelopen op de drie verboden formuleringen (`aanklikken`, `een foto van`, `adres op uw eigen naam`) in de definitieve tekst: nul treffers — en dat is ook de reden dat de conceptbouwerzin "kies je" zegt en niet "klik je aan" |

## Samenvatting — één regel per kaart en per lane

| Nr. | Kaart / lane | Oordeel |
|---|---|---|
| 1 | van de Nieuwenhof Schilderwerken — Veghel | **GOEDGEKEURD** — alle acht poorten dicht en extern nagetrokken (juni 2022, adres openbaar, maart-2026-beoordeling, 44 × 10,0, 299 klopt met `offer.ts`); vier correcties doorgevoerd, waarvan één noodzakelijk: de demo ontbrak in de tekst |
| — | Lane C (1 kaart op 10-12) | **TEKORT GOEDGEKEURD als eerlijk** — getal en reden staan erbij, de bindende poort is benoemd, geen enkele zwakke tweede kaart erbij gezet, en de dienst levert een nieuwe bewezen poort-(a)-route op. Vormcorrectie: bevindingskoppen terug naar `## ` |
| — | Lane D (0 kaarten op 10-12) | **NULDIENST GOEDGEKEURD als echte discipline** — elk dossier met adres valt op een andere genoemde poort, elk dossier zonder adres valt op de harde regel van 25 augustus, nul controleopdrachten doorgeschoven, eigen fout van gisteren met naam gecorrigeerd. Geen missende levering |

Azzouz
