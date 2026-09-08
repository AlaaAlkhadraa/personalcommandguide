# Verificatie — dinsdag 8 september 2026 — lanes C en D

Azzouz, verificatiedienst. Ik heb uitsluitend `marketing/outreach/2026-09-08-c.md`
en `marketing/outreach/2026-09-08-d.md` beoordeeld. `-a.md`, `-b.md` en
`2026-09-08-ab-verified.md` zijn van de parallelle sessie en ik heb ze niet
aangeraakt.

**Wat er lag.** Lane C: één genummerde kaart (Glazenwasserij Hoogers), elf
volledig beoordeelde dossiers, zeven op één poort gesloten. Lane D: **nul
genummerde kaarten**, eenendertig volledig beoordeelde dossiers, zeven op één
poort gesloten, plus één schrijfklare tekst voor Osmose-Telewash die Sam
uitdrukkelijk géén kaart noemt. De telling van de opzichter (nul kaarten in
beide lanes) klopt voor lane D en niet voor lane C: lane C draagt er één, in de
juiste kopvorm.

**Uitkomst in één regel.** Eén kaart aangeboden, één goedgekeurd — met twee
correcties, waarvan één een feitelijke fout in de tekst was. Geen enkel dossier
onder de bevindingen van beide lanes kan vandaag een verzendklare kaart worden;
de Osmose-Telewash-tekst voorop niet, en ik heb dat met eigen ronden getoetst in
plaats van het van Sam aan te nemen.

**Wat ik zelf heb gedraaid.** Prospectpagina's zijn in deze omgeving niet te
laden (`glazenwasserijhoogers.nl`, `klantenvertellen.nl` en `werkspot.nl` geven
alle drie een egress-blokkade), dus mijn eigen toetsing loopt via zoekronden en
via de repository. Zeven ronden: e-mailadres Hoogers, "sinds 3 april 2023",
zijn onderwijsverleden, de `site:`-lekronde op zijn domein, zijn
klantenstopronde, een poort-(a)-ronde op Osmose-Telewash en twee op QK
Glazenwasserij. Alle prijs- en vormclaims zijn tegen `zevren/lib/offer.ts`,
`zevren/lib/local/sectors.ts` en `zevren/lib/i18n/dictionaries/nl.ts` gelegd.

---

## 1. Glazenwasserij Hoogers — Rosmalen (gem. 's-Hertogenbosch)

GOEDGEKEURD, met twee correcties: één feitelijke fout in de eerste zin en een
scherpere onderwerpregel. De acht poorten staan hieronder met wat ik er zelf van
heb teruggezien.

- **Sector:** glazenwasserij/gevelreiniging · **Pakket:** 299 (Starter) · **Hoek:** review-bewijs
- **Plaats:** Waterranonkel 25, 5236 TD, Rosmalen (gem. 's-Hertogenbosch, NB)
- **E-mail:** `info@glazenwasserijhoogers.nl`
- **Telefoon:** 06-30248596 · **Eigenaar:** Niki Hoogers
- **KvK:** 89794877 · vestigingsnummer 000055561020
- **Leeftijd:** eigenaar sinds 3 april 2023 — drie jaar
- **Poort (a) — DICHT op een stil levensteken (1.14), verzendtermijn ca. twee weken.** De regel "sinds 3 april 2023 de trotse eigenaar" staat op zijn eigen domein; uitgever is het bedrijf zelf. Mijn eigen ronde gaf die regel woordelijk terug, samen met de rest van zijn over-onstekst. **Wat ik er zelf bij vond en uitdrukkelijk NIET gebruik:** zijn Trustoo-profiel meldt "laatst bijgewerkt maandag 5 januari 2026". Dat is de verversingsstempel van de gids en precies wat 1.7 verbiedt — het bewijst dat Trustoo leeft. De twee reviews met leesbare datum blijven 13-04-2025 en 10-04-2025, zeventien maanden, buiten het venster. Sams beoordeling is dus juist en zijn hercontrole-instructie ("zoek een spoor van een ANDERE soort") blijft staan
- **Poort (b) — DICHT, onafhankelijk gereproduceerd.** Mijn eigen ronde gaf `info@glazenwasserijhoogers.nl` naast 06-30248596 terug, met zijn eigen home- en over-onspagina als vindplaats. Niet samengesteld uit `info@` plus domein: het adres kwam terug
- **Poort (c) — geen enkele score- of reviewclaim in het bericht.** Terecht: mijn eigen ronde kreeg opnieuw "Trustoo-score 8,5" en "Top 10 beste gevelreinigers in Rosmalen" aangeboden, en allebei uitsluitend uit de samenvattende alinea boven de zoekresultaten. Dat is 1.20(a) en het staat niet in het bericht
- **Poort (d) — alle claims waar en gedekt, na één correctie.** Zie hieronder. `site:`-lekronde onafhankelijk herhaald: mijn ronde gaf opnieuw alleen home en `/over-glazenwasserij-hoogers/` als geïndexeerde eigen pagina's naast de dienstenpagina's, en geen projecten-, referentie- of reviewspagina. Het lek bestaat
- **Poort (e) — DICHT.** `grep -i "Hoogers" marketing/outreach/contacted.md` geeft één rij en dat is de rij die deze dienst zelf vandaag schreef (regel 1493, `drafted`). Geen oudere rij, dus geen omkering te schrijven
- **Poort (f) — DICHT.** Groeifase, drie jaar, één werkzaam persoon, acht eigen dienstenpagina's. Mijn eigen klantenstopronde gaf niets — geen wachtlijst, geen volmelding, geen intakestop, en wél een uitnodiging om vrijblijvend een offerte aan te vragen. Sam meldt eerlijk dat hij die ronde één stap te laat draaide; de uitkomst is leeg, dus het heeft niets gekost
- **Poort (g) — NIET gehaald met de gekozen regel; gecorrigeerd.** Zie hieronder
- **Poort (h) — de skillstabel van lane C is echt.** Zie de bevinding daarover
- **Sectorcap:** glazenwasserij lane-C-regio 2 `drafted` in zeven dagen, met deze kaart 3. Binnen de cap (1.8: alleen `drafted` en goedgekeurd, per sector én per lane-regio)
- **Claimdekking, feit voor feit:** "299 euro, eenmalig, exclusief btw" = `offer.ts` (`starter: 299`) plus de formulering van de sectorpagina's · "afgeronde gevels en ramen groot en scherp" = `sectors.ts`, hoveniers-FAQ ("Wij zetten ze in een pagina die ze groot en scherp laat zien") · "met wat die klanten erover schreven ernaast" = `sectors.ts`, hondentrimsalon-FAQ ("Beoordelingen die je al hebt verzameld kunnen op je eigen site staan ... in plaats van alleen op de pagina van een gids of platform") · "de conceptsites die ik gebouwd heb, volledig aanklikbaar" = `nl.ts` regel 498 ("volledig interactief, geen statische screenshots, en geen van alle is klantwerk"). De verboden vorm "werk dat je kunt aanklikken" staat er niet · **1.31:** `zevren/app/projects` bestaat, en `sectors.ts` voert tien sectoren waarvan geen enkele glazenwasserij — de link belooft dus geen demo op een pagina die er geen draagt. UTM op sectorniveau

### Wat ik gecorrigeerd heb, en waarom

**1. Eén feitelijke fout, in de eerste zin, over zijn eigen leven.** Sams tekst
schreef: "acht jaar voor de klas, daarna het vak geleerd bij Patrick van Gerven".
Zijn eigen over-onspagina zegt iets anders, en mijn ronde gaf het woordelijk
terug: hij deed het glazenwassen als bijbaan tijdens zijn studie en **combineerde
het toen hij als docent begon**, bij Glazenwasserij van Gerven, waar hij het vak
van eigenaar Patrick van Gerven leerde. Het vak kwam dus *naast* het lesgeven en
niet *erna*. Dat is precies het soort fout dat een bericht doodt: hij leest een
vreemde die zijn verhaal navertelt en het mis heeft, in de zin die moest bewijzen
dat wij zijn pagina hebben gelezen. Gecorrigeerd naar "het vak naast het lesgeven
geleerd bij Patrick van Gerven". Bericht daarmee 216 woorden, geteld met `wc -w`,
binnen 160-220.

**2. De onderwerpregel haalde poort (g) niet, en ik heb hem vervangen.**
"Je verhaal staat er, je klanten niet" is een goede regel — hij opent een lus,
hij ruikt niet naar verkoop, en de openingszin pakt hem op. Maar hij draagt
**geen concreet, gecheckt detail uit het onderzoek**, en dat is letterlijk wat de
staande order van 24 augustus eist ("hun score, hun straat, hun drukste dag, hun
openingstijden, een woord uit hun eigen reviews"). Elke zaak met een over-onspagina
en reviews elders kan die regel krijgen; in het vierlagenmodel van
`personalization.md` is hij Level 3 en geen Level 4.

Sam had het scherpste detail zelf al gevonden (kandidaat 2, "Acht jaar voor de
klas, nu de ladder") en wees het af op twee gronden. De eerste — dat zijn pagina
meldt dat hij "wegens omstandigheden" met lesgeven moest stoppen — is een echte
overweging en ik neem haar over: ik gebruik het detail zonder het contrast dat op
dat stoppen zou kunnen wijzen. De tweede grond, dat de vorm lijkt op de kaart van
Hanenberg van 07-09, weeg ik anders, en dat is de les van vandaag: **gelijkenis
tussen twee kaarten is een probleem van het bord, en poort (g) is een regel van
de inbox.** Hanenberg en Hoogers lezen elkaars mail nooit. Een gecheckt detail
inruilen voor variatie op het bord is de verkeerde ruil.

De nieuwe regel is 40 tekens (geteld), het gecheckte detail staat in de eerste
tweeëntwintig, en hij is in mijn eigen ronde bevestigd: Niki Hoogers rondde in
2010 de hbo-opleiding Leraar Lichamelijke Opvoeding af en gaf daarna **acht jaar**
les op Sancta Maria Mavo in 's-Hertogenbosch. De eerste zin van het bericht pakt
hem letterlijk op. Geen "website", geen ZEVREN, geen cijfer dat wij niet kunnen
tonen.

**Onderwerp** (40 tekens, geteld)

```
Acht jaar voor de klas, nu je eigen zaak
```

**Bericht** (216 woorden, geteld met `wc -w`)

```
Hoi Niki,

Op je eigen pagina staat het hele verhaal: acht jaar voor de klas, het vak naast het lesgeven geleerd bij Patrick van Gerven, en sinds 3 april 2023 je eigen zaak. Wie kiest tussen jou en de volgende glazenwasser leest dat en denkt: die weet wat hij doet.

Wat diezelfde bezoeker niet leest, is wat je klanten van je werk vinden. Die oordelen bestaan wel, maar ze staan op Trustoo en niet op de plek waar hij binnenkomt. Iemand ziet zondagavond de groene aanslag op zijn gevel, zoekt een gevelreiniger in Den Bosch, en vergelijkt jouw diensten met andermans diensten. Dat is de vergelijking waarin niemand wint. Jij hoort er nooit iets van, want die aanvraag is er nooit geweest.

Zonde, want dat oordeel is het beste wat je hebt. Wat ik bouw is een pagina waar afgeronde gevels en ramen groot en scherp op staan, met wat die klanten erover schreven ernaast. Op je eigen adres, in plaats van op de pagina van een platform.

Zo'n site is 299 euro, eenmalig, exclusief btw, en die prijs staat gewoon op zevren.nl. Onder Projecten staan de conceptsites die ik gebouwd heb, volledig aanklikbaar. Kijk er even doorheen.
zevren.nl/projects?utm_source=outreach&utm_medium=email&utm_campaign=glazenwasser-w37

Bellen mag ook, dat gaat vaak sneller dan mailen.

Met vriendelijke groet,
Alaa
ZEVREN, Maastricht
06-30958710 · zevren.nl
```

**Overtuigingskracht — de zeven eisen van de staande order van 25 augustus.**
Het lek staat in geld en tijd ("die aanvraag is er nooit geweest"), niet in
techniek. Het bewijs komt uit zijn eigen zaak: zijn pagina, zijn Trustoo,
zijn dienstenaanbod. Eén beeld, en het is er een uit zijn eigen dienstenpagina's
(groene aanslag op een gevel op zondagavond). De demo draagt de bewijslast met
één bestemming en één uitnodiging. De prijs staat er zonder verontschuldiging en
zonder offertegesprek. Geen schaarste, geen haast, geen "wij zijn klein". 216
woorden. Handtekening exact, telefoonnummer erin.

**Verzendinstructie voor de owner.** Verstuur binnen ongeveer twee weken. Poort
(a) rust op een stil levensteken; bij hercontrole is de vraag niet "staat het er
nog" maar "is er een spoor van een andere soort" — een gedateerde review op zijn
Trustoo-pagina of een gedateerd bericht op zijn Facebookpagina.

---

## Bevinding — lane D leverde nul genummerde kaarten, en dat is hier de juiste uitkomst

Eén regel, zoals de opdracht vraagt: **lane D draagt geen enkele genummerde
kaart, dus er valt geen kaart door de poorten te halen.** De lane heeft
eenendertig dossiers volledig beoordeeld en er geen enkele kaart uit geschreven,
en dat is niet dezelfde uitkomst als een lege dienst — het is een lane die vier
verschillende poorten dicht vond zitten en dat per groep heeft gemeten.

Ik keur die keuze uitdrukkelijk goed. Sam schrijft zelf: "Eén kaart had ik kunnen
schrijven door een poort open te laten staan." Dat is exact de kaart die het
adres verbrandt, en de order van 25 augustus zegt dat zo'n mail duurder is dan
geen mail.

## Bevinding — Osmose-Telewash blijft afgekeurd als kaart, en ik heb poort (a) zelf nagejaagd

De opdracht zet dit dossier voorop: kan de klaargelegde tekst met een geverifieerd
openbaar e-mailadres en een gedateerd bedrijfsfeit alsnog een verzendklare kaart
worden? **Nee, en niet vandaag.**

- **Ledger op naam, over de volle lengte, letterlijk gedraaid.**
  `grep -in "Osmose\|Telewash" marketing/outreach/contacted.md` geeft **drie**
  rijen: regel 507 (Meerts Schoonmaakbedrijf, Breda, 30-08 lane C — een ándere
  zaak, die alleen het woord telewash in zijn dienstenpagina voert), regel 1370
  (07-09 lane D, `lead - poort open`) en regel 1530 (08-09 lane D, herbevestigd,
  `lead - poort open`). **Geen omkering te schrijven:** de oude grond is poort (a)
  en die geldt onverkort. De naam die eerder in lane C langskwam is dus een
  naamgenoot op één woord en niet dit bedrijf — dat is het opschrijven waard,
  want een volgende lane die op "telewash" grept, krijgt hem opnieuw
- **Poort (a), mijn eigen ronde.** Ik heb er zelf twee gedraaid (review 2026,
  vacature/nieuws/geplaatst-op). Geen enkel gedateerd spoor van dít bedrijf
  binnen twaalf maanden. Wat wél terugkomt is dezelfde "sinds 2023" van
  `alleglazenwassers.nl` — de daad van de uitgever, en bovendien buiten het
  venster. Zijn eigen domein voert geen sinds-regel, dus de route van 1.14 die
  bij Hoogers wél werkt, werkt hier niet
- **Verdict:** geen kaart. Ledgerstatus blijft `lead - poort open`. De tekst
  blijft klaarliggen waar hij ligt, in `2026-09-08-d.md`, en komt niet op het bord

**Over de tekst zelf, zodat de dienst die de datum vindt niet opnieuw hoeft te
kiezen.** Hij is beter dan gemiddeld en ik zou hem met twee wijzigingen laten
staan. Wat goed is: de onderwerpregel is Level 4 (osmosewater op zonne-energie
is zíjn keuze, staat op zíjn pagina), het lek staat als verlies en niet als
gemis ("jij hoort nooit welke van de vier ze koos"), en de vier glazenwassers in
de gids zijn geteld en niet geschat. Wat er vóór verzenden aan moet gebeuren:
**(i)** de aanhef is "Hoi," zonder naam — bij een eenmanszaak van één werkzaam
persoon is een naamloze aanhef precies het signaal van een lijstmail, dus zoek de
naam of herschrijf de aanhef; **(ii)** de claim "gratis en zonder verplichtingen"
is inhoudelijk gedekt, maar niet op de plek waar Sam hem toeschrijft. Op
`zevren/app/concept-bouwer/page.tsx` staat "vraag het concept gratis aan. Zonder
verplichtingen."; de letterlijke formulering "gratis en zonder verplichtingen"
staat in `sectors.ts`, in de `proof`-regel van de hoveniers- en schilderspagina's.
De claim mag dus blijven; de bronvermelding klopt niet en dat is bij een
claimcontrole geen detail.

## Bevinding — QK Glazenwasserij: de samenvattende alinea verzon vandaag opnieuw reviews uit 2026, nu in mijn ronde

Dit is het duurste openstaande dossier van beide lanes en het verdient een eigen
oordeel. Alles staat: KvK 87456109 (2022), `info@qkglazenwasserij.nl` op zijn
eigen privacyverklaringspagina, klantenstop schoon, en een lek dat positief is
vastgesteld — vier eigen pagina's, geen enkele met afgerond werk of een
klantoordeel, terwijl klantenvertellen en Werkspot zijn oordelen wél dragen.
Alleen poort (a) staat open.

Ik heb geprobeerd hem te sluiten en het is niet gelukt. `klantenvertellen.nl` en
`werkspot.nl` zijn allebei geblokkeerd in deze omgeving. Mijn zoekronde op
Facebook-berichten en maandaanduidingen gaf géén enkel resultaat met een leesbare
datum — **maar de samenvattende alinea boven die ronde schreef "customer reviews
from May and June 2026".** Sam kreeg gisteren in dezelfde vorm "customer reviews
from 2026" aangeboden en gebruikte hem niet.

Dat is de waarneming die deze bevinding waard is: **twee onafhankelijke agenten
kregen op hetzelfde dossier, in twee verschillende ronden, van de samenvatter een
reviewdatum aangereikt die in geen enkel resultaat staat — en de tweede keer was
de datum preciezer dan de eerste.** Dat is 1.20(a) in zijn gevaarlijkste vorm:
de alinea vult precies de poort die openstaat, en zij wordt specifieker naarmate
je er vaker naar vraagt. Verdict: geen kaart, `lead - poort open` blijft.

## Bevinding — mijn orders van gisteren, lane C: zeven van zeven uitgevoerd

| Order van 07-09 | Uitgevoerd | Bewijs |
|---|---|---|
| 1. Letterlijk `grep`-resultaat bij poort (e), omkering opschrijven | **ja** | De kaart draagt "nul rijen (het `grep`-resultaat is leeg)"; bij De Harige Vrienden staat de gevonden rij mét regelnummer én "GEEN OMKERING: beide gronden gelden onverkort" |
| 2. Controleer wat een sectorpagina voert vóór je hem belooft | **ja** | De kaart stelt vast dat er geen glazenwasserssectorpagina bestaat, telt de tien sectoren en zes `demoSlug`-dragers, en wijst naar `/projects`. Ik heb het nagerekend in `sectors.ts` en het klopt |
| 3. Hondensector: meld de cap als uitkomst | **ja, en beter dan gevraagd** | De cap is geteld (twee `drafted` in zeven dagen), vrijgelopen bevonden, en de omkering op Spaubeek is opgeschreven mét oude status en oude grond |
| 4. Schuif door binnen de sector, niet eruit | **ja** | Eén regel, met de vier hoveniersdossiers en de vijf lege ronden erbij, en de doorschuif naar glazenwasserij |
| 5. Leeters Dienstverlening dicht | **ja** | Komt in het bestand niet voor |
| 6. KvK-nummer vóór de adresjacht bij softwash-namen (1.33) | **ja** | Expliciet op Hoogers gedraaid (softwash is een eigen servicepagina, KvK 89794877 vooraf), en op Cleantec ("Clean" in de naam) |
| 7. Tekortblok in de vaste vorm, de op-één-poort-lijst eronder | **ja** | Het blok is woordelijk de voorgeschreven vorm; de zeven staan onder een eigen `## Bevinding`-kop |

Zeven van zeven. Dat is de eerste dienst van deze week waarin geen enkele order
is blijven liggen, en het is aan de kaart te zien: van de acht poorten van Hoogers
zijn er zes gesloten met bewijs dat ik zelf heb kunnen terugvinden.

## Bevinding — mijn orders van gisteren, lane D: drie uitgevoerd, één half, één niet van toepassing

| Order van 07-09 | Uitgevoerd | Bewijs |
|---|---|---|
| 1. Acht dossiers in de geen-websitegroep | **half — zes** | De sectie bestaat, draagt zes dossiers met naam, plaats, sector, telefoonkolom en reden, en De Oude Haven is er terecht buiten gehouden. Twee te weinig, en de telling erbij klopt niet met zichzelf — zie de volgende bevinding |
| 2. Begin met de hondensector | **ja** | De lane opent ermee, vier dossiers kwamen diep genoeg voor alle poorten, en de sector leverde de scherpste bevinding van de dienst |
| 3. Eenbedrijfsronde achter de `"sinds JAAR"`-zeef, noteer welke bron de leeftijd draagt | **ja, en met winst** | Per dossier staat welke bron de leeftijd draagt, en de ronde leverde de vestigingsnummertoets op |
| 4. KvK weglaten waar naamgenoten meedraaien (Dekker) | **n.v.t.** | Dekker komt in dit bestand niet terug; het nummer is nergens alsnog ingevuld |
| 5. Tekortblok in de vaste vorm | **ja** | Woordelijk de voorgeschreven vorm, met de driegroependiagnose in de regel "bindende poort" |

## Bevinding — het getal van de geen-websitegroep klopt niet met zichzelf, en juist dít getal beslist mee

Dit is de zwaarste tekortkoming van lane D en zij zit niet in het aantal maar in
de telling. De tabel draagt **zes** rijen. De alinea eronder schrijft "Vier van de
vijf hebben er **geen** dat openbaar te vinden is" en "Alleen Furmidabel is
belklaar ... van de zes". De aanvulling in `bellijst.md` schrijft weer iets anders:
"De geen-websitegroep van deze dienst telde **vijf** dossiers; vier ervan hebben
geen openbaar telefoonnummer."

De juiste telling is zes dossiers, waarvan **vijf** zonder openbaar
telefoonnummer en één met (Furmidabel). Drie plaatsen, drie getallen.

En dan de zin die eronder staat: "van de vijftien geen-websitedossiers die deze
lane in drie dagen heeft afgemaakt, is er **één** met een openbaar
telefoonnummer". Ik heb het nageteld, uit de bestanden zelf.
`2026-09-06-d.md` draagt geen geen-websitesectie, en de twee zaken die de zin
daaruit noemt (Hondentrimsalon Helen, Jodieh's Trimsalon) hebben **allebei een
eigen domein** — het zijn geen geen-websitedossiers. `2026-09-07-d.md` draagt er
vier (Lapland, Biggie Clean, Michael's Glasbewassing, Van Stekelenburg Service,
regel 267-269). Vier plus zes is **tien**, niet vijftien. En belklaar zijn er
minstens **twee**, niet één: Glazenwasserij Lapland staat sinds 07-09 met
06-48343440 in `bellijst.md`, naast Furmidabel van vandaag.

**Waarom ik hier streng op ben terwijl het rekenwerk is en geen kaart.** Dit is
precies het getal waarop de owner het beslispunt over een tweede verzendweg gaat
nemen — dat staat zo in mijn eigen bevinding van gisteren en in de directives.
Een geschat getal in een verantwoordingsblok is een gemiste kaart; een geschat
getal onder een beslispunt is een verkeerd besluit dat weken doorwerkt. **De
regel voor morgen: elk getal in de geen-websitesectie wordt geteld uit de rijen
die eronder staan, en een meerdaagse telling wordt uit de bestanden zelf
opgeteld, met de bestandsnamen erbij.**

De meting die eronder ligt, verandert overigens niet en is waardevol: het bedrijf
zonder eigen domein levert in deze omgeving vaak ook geen telefoonnummer, en
Furmidabel — het enige belklare van de zes — is óók het enige met een eigen
domein. Dat is 1.20(b) in versterkte vorm en het hoort in het weekrapport. Alleen
met de juiste getallen erbij.

## Bevinding — lane D's drie bevindingen op hun merites: twee gaan het fundament in, één met een rem erop

Sam biedt er drie aan en noemt ze alle drie uitdrukkelijk een voorstel. Ik heb
ze langs dezelfde drempel gelegd als altijd: twee onafhankelijke lanes of twee
onafhankelijke diensten, of anders een fout waarvan de kosten eenzijdig zijn
(dat is de grond waarop 1.31 op één dienst binnenkwam).

**1. De klantenstopronde moet in de hondensector het woord "honden" dragen —
OPGENOMEN als 1.34.** De ronde die 1.14 verplicht stelt
(`"<naam>" klantenstop OF "geen nieuwe klanten" OF wachtlijst`) gaf bij Saloon
Bark & Bubbles letterlijk niets, terwijl de eigen paginatekst luidt: "Momenteel
nemen wij geen nieuwe honden aan." Eén lane, één dienst — en toch gaat hij erin,
want de kosten zijn eenzijdig en 1.14 zegt dat zelf al met zoveel woorden: die
ronde "voorkomt geen gemiste kaart maar een verbrand adres". Een verplichte
zoekopdracht verbreden kost nul ronden en kan geen goede kaart doden; hem niet
verbreden kost het adres van een salon die vol zit. Dat is dezelfde asymmetrie
als bij 1.31. De tweede helft van Sams waarneming gaat mee: de melding staat
zelden op een eigen pagina en meestal in de eerste alinea van *afspraak maken* of
*contact*, dus draai de ronde op de contact- of afspraakpagina en niet op de naam
alleen.

**2. Het vestigingsnummer in de gids-URL als leeftijdstoets — OPGENOMEN als 1.35,
maar uitsluitend als negatieve vlag.** Sam legt hem neer op negen waarnemingen
uit één lane en noemt de monotonie van de reeks eerlijk een aanname. Hij heeft
meer dan hij denkt: **lane C leverde vandaag en gisteren dezelfde reeks op zonder
de hypothese te kennen**, en dat maakt haar getallen onafhankelijk. Op één rij
gezet:

| Vestigingsnummer | Leeftijd volgens een andere bron | Lane |
|---|---|---|
| 000009153578 | vóór 2008 (SoftWash Limburg, KvK 14114322) | C, 07-09 |
| 000046288384 | 2020 (Van de Ven) | C, 08-09 |
| 000053368576 | 2022 (QK, KvK 87456109) | D, 08-09 |
| 000053531477 | 2022 (Respect, KvK 87626616) | D, 08-09 |
| 000053641302 | 2022 (Hsd, KvK 87743159) | D, 08-09 |
| 000054063337 | 2022 (Potters, KvK 88183688) | C, 07-09 |
| 000054141958 | 2022 (Oleh, KvK 88266567) | D, 08-09 |
| 000055561020 | 2023 (Hoogers, KvK 89794877) | C, 08-09 |
| 000056062435 | 2023 (De Rooij, KvK 90325370) | D, 08-09 |
| 000057208867 | 2023 (Osmose-Telewash, KvK 91537878) | D, 08-09 |
| 000059262370 | 2024 (Cleantec, KvK 93740921) | C, 08-09 |

Elf waarnemingen uit twee lanes, geen enkele tegenspraak, en de KvK-reeks loopt
mee. Dat haalt de drempel. **Maar hij gaat er met een rem in**, en die rem is
niet Sams voorzichtigheid maar mijn eigen: hij is vandaag gebruikt om dossiers te
láten vallen (Verdam Groep, H. Kommer, geen adresronde meer in gestoken), en dat
is precies wat een heuristiek zonder bron niet mag doen. De regel wordt dus: een
tegenspraak tussen een laag vestigingsnummer en een recente gidsdatum maakt **de
gidsdatum onbruikbaar**, meer niet. Daarna staat of valt het dossier op de eigen
over-onspagina, net als elk ander (1.16b). Zo bespaart hij ronden zonder ooit
zelf een poort te sluiten.

**3. De samenvattende alinea verzint hele regels, niet alleen feiten — OPGENOMEN
als 1.36, en dit is de sterkste van de drie.** Lane D telt vijf verzonnen
hoveniersnamen (Geert Vink B.V., Van der Zalm Tuinen B.V., Snel Tuinaanleg,
Weelderige Tuinen, RH Tuinen) die in geen enkele resultaat-URL voorkomen, mét
oprichtingsdatum en KvK-nummer erbij, en twee weggegooide ronden. **Lane C vond
onafhankelijk dezelfde fout in een andere vorm**: de alinea zette Trimsalon De
Harige Vrienden in Vlissingen terwijl de zaak aan de Zwarte Zee 34 in Maassluis
zit, en dus in een andere lane. Twee lanes, één dag, twee verschijningsvormen
van dezelfde bronfout. Dat is de klassieke drempel en hij is gehaald.

Het scherpste zit in lane C's helft en het gaat mee het fundament in: **een
verzonnen jaartal valt op de leeftijdspoort, een verzonnen plaats valt nergens
op.** Geen enkele poort vraagt "klopt de provincie". Wat het vandaag ving was de
ledgerronde op naam, en die ving het bij toeval — omdat de zaak al bestond. Bij
een nieuwe naam was er niets geweest.

## Bevinding — veertig dossiers per lane: lane C elf, lane D eenendertig

De directives beoordelen de week op de trechter en niet op de uitkomst: veertig
volledig beoordeelde dossiers per lane per dienst.

| Lane | Volledig beoordeeld | Op één poort gesloten | Norm | Oordeel |
|---|---|---|---|---|
| C | 11 | 7 (+2 zonder dossier) | 40 | **niet gehaald**, ruim niet |
| D | 31 | 7 | 40 | **niet gehaald**, maar dichtbij en met de beste diagnose van de week |

Beide tellingen zijn nagerekend en kloppen met de bestanden: lane D's
samenvatting draagt exact eenendertig rijen en de zeven op-één-poort-zaken staan
er terecht níét in; lane C's samenvatting draagt de kaart plus elf rijen.

Lane C's elf is het lage getal van de week en de lane verantwoordt het met de
omgeving. Ik neem die verantwoording aan — vier van de elf vielen op poort (d)
ná de volledige leeftijds- en adresronde, en dat zijn de duurste dossiers die er
zijn — maar het blijft ver onder de norm, en de grond ervoor is deels een keuze:
twee ronden in de geen-websitegroep en toen doorschuiven.

## Bevinding — sectorminima: lane C draagt de tabel, lane D niet

De directives zetten per lane een minimum per sector. Lane C telt het zelf uit
en dat is de juiste vorm. Lane D doet dat niet, dus ik heb het geteld uit haar
eigen samenvatting:

| Lane | Sector | Minimum | Volledig beoordeeld |
|---|---|---|---|
| C | glazenwasserij/gevelreiniging | 15 | 5 |
| C | hovenier/groenonderhoud | 10 | 4 |
| C | hondensector | 5 | 2 (cap geteld en vrij) |
| C | geen-websitegroep → `bellijst.md` | 8 | **0** |
| D | glazenwasserij/gevelreiniging | 15 | 14 |
| D | hondensector | 10 | **11 — gehaald** |
| D | hovenier/groenonderhoud | 7 | 6 |
| D | geen-websitegroep → `bellijst.md` | 8 | 6 |

Eén sector van de acht is gehaald, en het is de sector waarvan ik lane D gisteren
opdroeg ermee te beginnen. Dat is het waard om vast te leggen: de order werkte.

**Twee dingen die de tabel niet laat zien en die er morgen bij horen.** Ten
eerste is lane D's geen-websitegroep geen aparte schijf maar een deelverzameling
— vijf van de zes staan ook in haar glazenwasserstelling en één in de
hondensectortelling. De directives zetten acht van de veertig apart; als die acht
uit dezelfde dossiers komen als de sectorminima, meet het quotum niet wat het
moet meten. Ten tweede is lane C's nul de zwaarste van de twee: het is de tweede
dienst op rij dat deze lane er geen enkele oplevert, en lane C is uitgerekend de
lane die de groep vorige week wél leverde, mét de bruikbaarste meting van de week
(nul van acht een e-mailadres, vijf van acht ook geen telefoon).

## Bevinding — de bellijst: één regel op zestien gevraagde

`bellijst.md` draagt vandaag drie nieuwe secties: lane A (vijf regels), lane B
(twee) en lane D (één, Furmidabel). Lane C draagt er geen. Van de zestien
dossiers die de twee lanes samen aan de bestemming `bellijst.md` moesten leveren,
staat er dus **één** op de lijst. De rest van lane D's groep heeft geen kanaal —
Sam vult de telefoonkolom terecht niet met een nummer dat hij niet heeft — en
lane C leverde de groep helemaal niet.

## Bevinding — poort (h): beide skillstabellen zijn echt, met in allebei dezelfde valse bronvermelding

Ik heb de aangehaalde regels opgezocht in `.claude/skills/` in plaats van ze te
geloven.

**Wat klopt.** `prospecting/SKILL.md` regel 68 draagt de confidence-eis
("**High**: confirmed by at least two independent sources or official business
page"). `cold-email/SKILL.md` draagt de verwijdertoets woordelijk ("If you remove
the personalized opening and the email still makes sense, the personalization
isn't working"), plus "Lead with their world, not yours" en "One ask, low
friction". `cold-email/references/personalization.md` draagt het vierlagenmodel
met Level 2 en Level 4 zoals lane D het gebruikt.
`cold-email/references/subject-lines.md` draagt de kleineletterdata die beide
lanes bewust overrulen ten gunste van poort (g), mét de overrule genoteerd.
`copy-editing` draagt de zeven sweeps met exact de nummers en namen die beide
lanes aanhalen. `customer-research/SKILL.md` regel 105 draagt het recency window
van twaalf maanden. `competitor-profiling/SKILL.md` regel 30-31 draagt "Facts
Over Opinions ... traceable to a source". `marketing-psychology` draagt Theory of
Constraints, survivorship bias, loss aversion, JTBD, second-order thinking en
fundamental attribution error, alle zes zoals gebruikt. Beide lanes melden
bovendien eerlijk een skill als *niet ingezet* (`copywriting` in allebei, `offers`
in lane D) mét de grond erbij, en dat is de standaard die de directives vragen.

**Wat niet klopt, in allebei.** Lane C schrijft: De regel **"never assemble an
email from a pattern like info@ plus the domain"** — met aanhalingstekens, als
citaat uit `prospecting`. Die zin staat daar niet. Ik heb de hele skill
doorzocht, inclusief alle zes referentiebestanden: `prospecting` noemt
pattern-guessing juist als gereedschapscategorie (Hunter, Snov) en schrijft
alleen voor dat je publieke zakelijke kanalen gebruikt. Lane D doet hetzelfde in
mildere vorm ("de regel dat je een adres nooit samenstelt"). **Het besluit is
goed en verplicht — maar de bron is óns fundament ("Welke bron een e-mailadres
draagt") en de harde regel van de owner van 25 augustus, niet de skill.** Ook de
confidence-eis wordt in beide tabellen als citaat gepresenteerd in een vorm die
net iets anders is dan de skilltekst.

**Oordeel: beide tabellen zijn echt en geen van beide is hol.** Ze dragen
concrete, naspeurbare voorbeelden die aantoonbaar iets veranderd hebben aan het
werk, en dat is wat poort (h) vraagt. De les eronder is smal en telt vanaf
morgen: **een citaat tussen aanhalingstekens is een bronclaim.** Wat je in de
skillstabel tussen aanhalingstekens zet, staat woordelijk in de skill; parafraseer
je, dan schrijf je het zonder aanhalingstekens. Een dienst die de skills echt
gebruikt heeft, hoeft daar niets voor in te leveren — en een tabel die zichzelf
op één citaat laat betrappen, ondergraaft de zeven rijen die wél kloppen.

## Orders voor de eerstvolgende dienst — lane C

1. **De geen-websitegroep is nul en dat is nu je zwaarste order.** Twee diensten
   op rij onder het quotum, en jij bent de lane die de bruikbaarste meting van de
   week leverde. Acht dossiers, met naam, plaats, sector, telefoon, gedateerd
   levensteken en de reden dat er geen kaart is. Loopt de gidsroute leeg zoals
   vandaag, dan is dat zelf de meting: schrijf op welke twee vormen je draaide en
   wat ze teruggaven, en ga daarna naar de route die het fundament voor deze
   groep voorschrijft — `"<naam>" <plaats> kvk mutatie` en
   `"<naam>" GGD OF vergunning OF inspectie`, niet opnieuw een gidsvorm.
2. **Je voorstel over de volgorde van de lekronde: niet doorvoeren, wél
   meebrengen.** Je hebt gelijk dat poort (d) bij Cleantec en Van de Ven twee
   adresronden weggooide en dat de lekronde ze voor één ronde had gesloten. Maar
   de volgorde is fundamentregel 1.20(b) en die rust op een telling van vijf tegen
   nul; ik verander hem niet op één dienst, en jij stelde dat zelf ook niet voor.
   Meet hem morgen nog een keer op dezelfde manier — hoevéél ronden zaten er in
   elk dossier vóór de poort die het sloot — dan ligt er zondag een telling in
   plaats van een indruk.
3. **ZeelandSchoon (Goes) afmaken.** Jouw eigen woorden: het goedkoopste
   openstaande dossier van de dienst, twee gerichte ronden staan open (een
   eenbedrijfsgidsronde en een exacte-domeinronde). Begin daar.
4. **Bij een citaat uit een skill: woordelijk of zonder aanhalingstekens.** Zie de
   poort-(h)-bevinding. Je tabel is echt en dat blijft zo; deze regel kost je
   niets.
5. **Blijf doen wat je vandaag deed bij poort (e), (d) en 1.33.** Het letterlijke
   `grep`-resultaat, de derde lekronde, en het KvK-nummer vóór de adresjacht bij
   een moderne dienstnaam: dat zijn samen de reden dat de enige kaart van vandaag
   op zes zelfstandig na te lopen poorten staat.

## Orders voor de eerstvolgende dienst — lane D

1. **Tel de geen-websitegroep uit de rijen die eronder staan.** Zes rijen, vijf
   zonder telefoon, één met — en een meerdaagse telling tel je op uit de
   bestanden, met de bestandsnamen erbij. Dit getal draagt een beslispunt van de
   owner; het is het enige getal in je bestand dat niet geschat mag worden. En
   houd de groep gescheiden van je sectorminima: acht van de veertig staan
   ernáást, niet erin.
2. **Twee van je drie bevindingen zijn fundamentregel geworden** (1.34 de
   hondenwoordkeus, 1.36 de verzonnen regels in de samenvattende alinea). **De
   derde ook, met een rem:** het vestigingsnummer mag vanaf nu een gidsdatum
   ongeldig verklaren, maar nooit zelf een dossier sluiten — na een tegenspraak
   draai je de eigen over-onspagina, precies zoals bij elk ander dossier. Verdam
   Groep en H. Kommer zijn dus niet af; ze staan op één ronde.
3. **Draai de klantenstopronde in de hondensector als eerste ronde**, met
   `"geen nieuwe honden" OF "geen nieuwe klanten" OF vol OF wachtlijst`, op de
   contact- of afspraakpagina. Dat is jouw eigen voorstel en het kost niets:
   vandaag zaten er elf ronden vóór de klantenstop in vier dossiers, en als eerste
   ronde waren dat er vier geweest.
4. **De poort-(a)-ronde direct achter de domeinzeef, vóór het lek.** Ook dat is
   jouw eigen voorstel en het is in je eigen cijfers gedekt: vier van vier met
   eigen domein vielen op (a), en bij QK kostte het vier ronden op een dossier dat
   verder compleet was. Ik neem hem niet in het fundament op — één lane, één
   dienst, en hij raakt aan de jaagvolgorde van 1.20(b) — maar draai hem morgen en
   meet wat hij bespaart.
5. **De aanhef van de klaargelegde Osmose-Telewash-tekst.** "Hoi," zonder naam is
   bij een eenmanszaak van één werkzaam persoon het signaal van een lijstmail.
   Zoek de naam van de eigenaar in dezelfde ronde die de datum moet vinden, of
   herschrijf de aanhef.
6. **Bij een citaat uit een skill: woordelijk of zonder aanhalingstekens.** Zie
   lane C, order 4.

## Tekort van de dag — verificatie C+D
Gevraagd: 30 (over vier lanes) · lanes C+D volledig beoordeeld: 42 dossiers · kaarten aangeboden: 1 · kaarten GOEDGEKEURD: **1** · tekort gemeld.
Bindende poort vandaag: **(a), het gedateerde levensteken**, bij 4 van de 4 dossiers met eigen domein in lane D en bij het enige dossier van lane C dat het zonder stil levensteken had moeten stellen — vier complete dossiers (Osmose-Telewash, QK Glazenwasserij, Contrast Glazenwasserij, De Oude Haven) staan op niets anders.
E/F/G opgeschort, dus niet opgevuld.

| Grond | Aantal |
|---|---|
| Te lang gevestigd (leeftijd) | 11 |
| Geen geverifieerd openbaar e-mailadres | 11 |
| Poort (a): geen gedateerd levensteken | 4 |
| Klantenstop of wachtlijst | 4 |
| Lek bestaat niet of niet vast te stellen | 5 |
| Al in het ledger / buiten de lane-regio | 6 |
| Kaart, goedgekeurd | 1 |

## Gebruikte skills

| Skill | Waar toegepast | Wat het concreet veranderde |
|---|---|---|
| `cold-email` | Op de onderwerpregel van kaart 1 en op de beoordeling van de klaargelegde Osmose-tekst | Het **vierlagenmodel** van `references/personalization.md` is de reden dat ik Sams gekozen onderwerp heb vervangen en niet alleen geprezen: "Je verhaal staat er, je klanten niet" overleeft de **verwijdertoets** wél, maar is Level 3 — elke zaak met een over-onspagina en reviews elders kan hem krijgen — terwijl poort (g) van de owner een gecheckt detail eist. "Acht jaar voor de klas" is Level 4 en in mijn eigen ronde bevestigd (hbo LO in 2010, acht jaar Sancta Maria Mavo). Dezelfde toets bevestigde Sams keuze bij Osmose-Telewash: `Osmosewater op zonne-energie` is Level 4 en `Dezelfde glazenwasser elke keer` Level 2, precies zoals hij schrijft. **"One ask, low friction"** hield mijn correctie weg van de verleiding om een tweede bestemming toe te voegen: het bericht houdt één link. De data van `references/subject-lines.md` ("2-4 words, lowercase") verliest opnieuw bewust van poort (g); ik noteer de overrule net als beide lanes |
| `marketing-psychology` | Op de vraag of kaart 1 iets losmaakt, en op de weging van de drie voorstellen | **Loss aversion zonder schaarste** is de reden dat ik het middenstuk van het bericht ongemoeid laat: "Jij hoort er nooit iets van, want die aanvraag is er nooit geweest" is een verlies dat hij nu al lijdt, zonder deadline en zonder plek-telling. **Social proof** in zijn omgekeerde vorm draagt het aanbod: zijn bewijs bestáát en staat op Trustoo, dus het bericht verkoopt geen nieuw bewijs maar de verhuizing ervan. **Theory of Constraints** gaf mijn eigen tekortblok zijn bindende poort: niet (b) zoals ik zou verwachten na twee weken, maar (a) — vier complete dossiers staan op niets anders dan een datum. **Second-order thinking** besliste de rem op 1.35: een heuristiek die ronden bespaart, gaat zich gedragen als een poort zodra hij dossiers mag sluiten, en dan kost hij precies de jonge zaken die hij moest vinden. **Survivorship bias** is waarom ik lane D's vier-op-vier klantenstops níét als sectoroordeel lees: de salons die onze zeef haalt zijn de goed vindbare, en dat zijn dezelfde die vol zitten |
| `copy-editing` | Als laatste pas over mijn eigen correctie in het bericht van kaart 1 | Sweep 1 (clarity) op de gecorrigeerde zin: "het vak naast het lesgeven geleerd bij Patrick van Gerven" houdt de chronologie waar en blijft één idee per zinsdeel; "daarnaast" of "tegelijkertijd" zou de zin een tweede werkwoordstijd geven. Sweep 4 (Prove It) hield mij ervan af de Trustoo-score 8,5 en de "Top 10"-vermelding alsnog toe te voegen die mijn eigen ronde aanbood — allebei uitsluitend uit de samenvattende alinea, dus 1.20(a). Sweep 2 (voice) bewaakte dat mijn correctie in Sams register blijft ("je", geen "u"). En de telling opnieuw gedaan in plaats van overgenomen: 216 woorden met `wc -w`, onderwerp 40 tekens met `${#s}` |
| `product-marketing` | Als eigenaar van `.agents/product-marketing.md`, vóór alles | Gelezen vóór het eerste oordeel en vandaag bijgewerkt naar **1.36** met drie regels binnen het bereik 1.31 t/m 1.40 dat het weekrapport aan C+D toewees; changelog-entry erbij, met de twee voorstellen die er níét in gaan en waarom. De regels die vandaag rechtstreeks een oordeel bepaalden: 1.14 (stil levensteken, verzendtermijn twee weken) bij poort (a) van Hoogers, 1.7 (de verversingsstempel van de gids) bij de Trustoo-datum van 5 januari 2026 die ik heb geweigerd, 1.16 en 1.31 bij de claim- en linkcontrole, 1.20(a) drie keer, en 1.8 bij de sectorcap |
| `prospecting`, `customer-research`, `competitor-profiling`, `offers`, `copywriting` | **Niet ingezet als denkraam** — wel geopend om de citaten van beide lanes te toetsen | Dat is een controle en geen toepassing, en ik meld het als zodanig in plaats van er een regel bij te verzinnen. Wat de controle opleverde staat in de poort-(h)-bevinding: acht aangehaalde regels bestaan woordelijk, één bestaat niet (`"never assemble an email from a pattern like info@ plus the domain"` staat niet in `prospecting`, in geen van de zes referentiebestanden) |

## Samenvatting

| Nr. | Bedrijf | Plaats | Lane | Verdict | In één regel |
|---|---|---|---|---|---|
| 1 | Glazenwasserij Hoogers | Rosmalen (NB) | C | **GOEDGEKEURD** | Acht poorten dicht, e-mailadres en oprichtingsdatum in mijn eigen ronde onafhankelijk teruggezien; twee correcties: de chronologie van zijn eigen loopbaan stond fout in de eerste zin, en de onderwerpregel droeg geen gecheckt detail. Verstuur binnen ca. twee weken — poort (a) rust op een stil levensteken |
| — | Osmose-Telewash | Hendrik-Ido-Ambacht (ZH) | D | **AFGEKEURD als kaart** | Poort (a) ook in mijn eigen ronde niet gesloten: geen gedateerd spoor binnen twaalf maanden. Ledger op naam gedraaid — drie rijen, waarvan één naamgenoot (Meerts, Breda, 30-08); geen omkering. Tekst blijft klaarliggen, `lead - poort open` |
| — | QK Glazenwasserij & Multidiensten | Dordrecht (ZH) | D | **AFGEKEURD als kaart** | Duurste openstaande dossier van beide lanes; alles dicht behalve poort (a). Mijn eigen ronde kreeg opnieuw verzonnen reviewdatums aangeboden ("May and June 2026"), preciezer dan die van gisteren. `lead - poort open` |
| — | Contrast Glazenwasserij · Hondentrimsalon De Oude Haven | Zaandam (NH) · Rotterdam (ZH) | D | **AFGEKEURD als kaart** | Beide op poort (a), allebei terecht geparkeerd door Sam zelf; geen kaart, `lead - poort open` |
| — | ZeelandSchoon | Goes (ZL) | C | **AFGEKEURD als kaart** | Twee gerichte ronden staan open; goedkoopste openstaande dossier van lane C en de eerste order voor morgen |
| — | Van de Ven Glazenwasserij · Cleantec · R de Jong Hoveniers | Boekel · Munstergeleen · Bodegraven | C/D | **terecht geen kaart** | Alle drie op poort (d): het lek bestaat niet, positief vastgesteld in plaats van aangenomen. Dit zijn de dossiers die het adres gered hebben |

**Verdict in cijfers.** Aangeboden: 1 kaart · goedgekeurd: **1** · afgekeurd: 0 ·
gecorrigeerd vóór goedkeuring: 2 (één feitelijke fout, één onderwerpregel) ·
dossiers beoordeeld door beide lanes samen: 42 · dossiers die onder de
bevindingen een kaart hadden kunnen worden en het vandaag niet zijn: 5, alle vijf
op poort (a) of op een openstaande ronde · tekort: gemeld, niet opgevuld.

**Fundament.** `.agents/product-marketing.md` staat na deze dienst op **1.36**,
met 1.34 (de hondenwoordkeus in de klantenstopronde), 1.35 (het vestigingsnummer
als negatieve vlag, nooit als poort) en 1.36 (de samenvattende alinea verzint
plaatsen en hele regels, niet alleen jaartallen). Binnen het bereik 1.31 t/m 1.40
dat aan C+D is toegewezen; geen botsing met de parallelle A+B-sessie.

**Wat de owner hiervan moet weten, in drie regels.** Er staat één nieuwe kaart
klaar en zij is verzendklaar binnen ongeveer twee weken. Er staan vier dossiers
compleet op één ontbrekende datum — dat is het duurste patroon van deze week en
het is geen inzetprobleem. En de zes beslispunten van 6 september liggen nog
onbeantwoord in `agents/inbox.md`; zolang dat zo is, blijft de dagnorm dertig,
blijft het profiel grofweg één tot zes jaar, en blijft de geen-websitegroep een
groep die wij meten maar niet kunnen bereiken.

Azzouz, 8 september 2026
