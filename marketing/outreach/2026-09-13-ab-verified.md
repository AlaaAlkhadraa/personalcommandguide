# Verificatie 13 september 2026 — lanes A en B

Zondag, laatste dag van de directiveweek 7–13 september. Deze dienst verifieert
**uitsluitend** `2026-09-13-a.md` en `2026-09-13-b.md`. Een aparte Azzouz-sessie doet
C en D; `-c.md`, `-d.md` en `2026-09-13-cd-verified.md` zijn door mij niet aangeraakt.

**Nul genummerde kaarten aangeboden, en dat is niet hetzelfde als een lege dag.** Beide
lanes leveren samen 125 volledig beoordeelde dossiers, vier verzendklare teksten op één
open poort, en drie bevindingen die het werk van volgende week goedkoper maken. Ik heb
de open poort bij alle vier zelf gejaagd en hem niet kunnen sluiten; ik heb twee
ledgerfouten gevonden en gerepareerd; en ik heb de `$N`-meting van lane B met een
vooraf uitgeschreven voorspelling gereproduceerd en uitgebreid.

**Fundamentversies: géén nieuwe regel geschreven.** Mijn reeks 1.22 t/m 1.30 is vol.
Drie kandidaatregels met hun dragers staan in `## Voor het weekrapport`.

Azzouz, 13 september 2026

---

## De genummerde kaarten — er zijn er nul, in beide lanes

```
$ grep -cE '^## [0-9]+\. ' marketing/outreach/2026-09-13-a.md marketing/outreach/2026-09-13-b.md
marketing/outreach/2026-09-13-a.md:0
marketing/outreach/2026-09-13-b.md:0
```

**Lane A: geen enkele genummerde kaart aangeboden, dus geen enkele kaart door de poorten
gehaald.** De telling van de opzichter klopt.

**Lane B: geen enkele genummerde kaart aangeboden, dus geen enkele kaart door de poorten
gehaald.** De telling van de opzichter klopt.

Beide lanes hebben zich daarmee aan het verbod van deze week gehouden: een open poort is
een bevinding en nooit een kaart. Vier dossiers stonden op de drempel en geen van de vier
is als kaart aangeboden. Dat is de juiste uitkomst en ik reken het ze aan als winst, niet
als tekort.

---

## Bevinding — ik heb poort (a) bij alle vier de klaarliggende dossiers zelf gejaagd, en hij gaat in deze omgeving niet dicht

Dit is de kern van mijn opdracht van vandaag: kunnen Miedema Hoveniers en lane B's drie
teksten alsnog verzendklare kaarten worden? Ik heb het niet op Sams ronden laten rusten
maar zelf zes onafhankelijke ronden gedraaid, plus twee `WebFetch`-pogingen.

**De uitkomst: nee, bij alle vier, en de grond is bij alle vier dezelfde.**

| Dossier | Plaats | Ronden Sam | Mijn eigen ronden | Wat mijn ronden gaven |
|---|---|---|---|---|
| Miedema Hoveniers | Witmarsum (Fr) | 4 | 3 | Zijn zes eigen pagina's, zijn Facebook-**profiel**-URL, `kostentuinonderhoud.nl`-URL-titel met adres én nummer, companyinfo, Trustoo, cylex, hovenier.nl. **Nul gedateerde dragers in URL of URL-titel.** Geen post-URL om te decoderen (1.38) |
| Glazenwasserij Bubbels | Eerbeek (Gld) | 3 | 2 | Zijn eigen `/Home/`, `/Over-ons/`, `/softwashmethode/`; drimble, transfirm, compadex, companyinfo, alleglazenwassers, oozo, telefoonboek, bedrijvenopdekaart, cylex. **Geen vacature, geen nieuwsbericht, geen prijsaanpassing met jaartal (1.13), geen `/p/`-post-URL** |
| JR Hoveniers | Zevenaar (Gld) | 3 | 1 | Zijn eigen `/`, `/index.php/over-ons/`, `/index.php/zakelijk/`; Facebookpagina, `/about/` en het album `142749275409507` met URL-titel "Zevenaar - JR Hoveniers". **Een album-ID draagt geen decodeerbaar tijdstempel.** Geen Instagram |
| Heenck Hoveniersbedrijf | Geldermalsen (Gld) | 2 | 1 | Zijn eigen `/` en `/over-ons/`, zijn Werkspotprofiel, hovenier.website, oozo, telefoonboek. **Zie hieronder — hier is wél een datum, en zij helpt niet** |

**De `WebFetch`-poort staat nog steeds dicht, en ik heb hem vandaag opnieuw gemeten.**

```
WebFetch https://www.werkspot.nl/profiel/heenck-hoveniersbedrijf  → EGRESS_BLOCKED
WebFetch https://www.miedemahoveniers.nl/over-ons/                → EGRESS_BLOCKED
```

**Twee van twee.** Samen met de vier van vier van 11-09 staat de meting nu op **zes van
zes geblokkeerde domeinen** — gids, reviewplatform, register, eigen site van een prospect,
en vandaag opnieuw een reviewplatform en een eigen site. Dit is geen incident en het is
niet met meer ronden te repareren: de enige laag die een datum draagt (de pagina zelf) is
in deze omgeving niet te openen, en de laag die wél open staat (de URL en de URL-titel)
draagt hem bij deze vier bedrijven niet.

**De ene datum die ik wél vond, en waarom zij het dossier sluit in plaats van opent.**
Bij Heenck gaf mijn ronde één gedateerde review: **november 2023**, plus de mededeling dat
het profiel een 10 uit 3 beoordelingen voert. Allebei komen ze uit de samenvattende alinea
en niet uit een URL of URL-titel, dus per 1.20(a) staan ze in geen enkel oordeel van mij —
maar ze zijn wél het eerste gedateerde signaal dat dit profiel ooit heeft afgegeven, en het
is **vierendertig maanden oud**. Dat is bijna drie keer het venster.

Dat verandert iets aan Sams eigen ordervoorstel. Hij schrijft bij Heenck als
eigenaarscontrole: *"open `werkspot.nl/profiel/heenck-hoveniersbedrijf` en kijk of daar
beoordelingen mét een leesbare datum staan — zo ja, dan sluit dat poort (a)."* Dat klopt
als regel maar het is nu een dure controle: de enige datum die ik van dat profiel heb
kunnen zien ligt ver buiten het venster, en 1.22 zegt bovendien dat bij twee afwijkende
datums de **oudste** wint. **Heenck zakt daarmee van de drie hoveniers naar de laatste
plaats op de zondagslijst**, en zijn eigenaarscontrole is de enige van de vier waarvan ik
verwacht dat zij negatief terugkomt. Ik laat de tekst staan, maar de owner moet weten dat
hij bij Heenck waarschijnlijk dertig seconden verspilt en bij Bubbels en JR niet.

**Oordeel over de vier.** Geen van de vier kan vandaag een verzendklare kaart worden. Alle
vier krijgen de status ***tekst klaar, poort (a) in deze omgeving niet te sluiten*** en
gaan op de zondagslijst — met de uitdrukkelijke aantekening dat dit geen `not fit` is:
er mankeert niets aan deze vier bedrijven, en drie van de vier gaan dezelfde dag weg als
de owner één blik op een Facebook- of Instagrampagina werpt.

---

## Bevinding — lane B heeft zonder het te weten de vijfde drager van lane A's drimble-vondst geleverd, en de twee lanes hebben elkaar niet gelezen

Lane A's scherpste vondst van vandaag is dat het getal in een `drimble.nl/bedrijf/…`-URL
het **vestigingsnummer** is en niet het KvK-nummer, met vier nagerekende dragers.

**Lane B levert er een vijfde, in zijn eigen Bubbels-dossier, en geen van beide lanes
heeft het gezien.** Uit mijn eigen ronde van vandaag, alle drie de URL's naast elkaar:

| Bron | URL | Wat de URL voert |
|---|---|---|
| drimble | `drimble.nl/bedrijf/eerbeek/47014865/glazenwasserij-bubbels.html` | `47014865` — zónder voorloopnullen |
| drimble | `drimble.nl/bedrijf/eerbeek/000047014865/glazenwasserij-bubbels.html` | hetzelfde getal — mét voorloopnullen |
| transfirm | `transfirm.nl/nl/organisatie/80672612-000047014865-glazenwasserij-bubbels` | KvK **80672612**, vestigingsnummer **000047014865** |
| companyinfo | `companyinfo.nl/organisatieprofiel/glazenwassen/glazenwasserij-bubbels-eerbeek-94974683-000047014865` | KvK **94974683**, vestigingsnummer **000047014865** |

Twee dingen tegelijk, en ze zijn allebei van waarde:

1. **De vondst van lane A houdt stand op een vijfde drager, uit een andere provincie en
   een ander dossier.** Het getal 47014865 dat drimble als bedrijfsnummer presenteert, is
   in twee onafhankelijke bronnen het vestigingsnummer. En drimble voert het opnieuw twee
   keer, één keer mét en één keer zonder voorloopnullen — precies wat lane A bij
   Dakdekkers AE zag. Dat is niet langer een waarneming van één lane over zijn eigen werk.
2. **Het getal ligt in de gevaarlijke band.** 47014865 valt in de band van grofweg 46 tot
   62 miljoen waar lane A de twee lezingen uiteen ziet lopen. Als KvK-nummer zou het
   ongeveer 2007 zijn — ruim buiten het venster; als vestigingsnummer ligt het net boven
   het 2020-anker van 1.35 en is de zaak jong. **Lane B heeft het correct als
   vestigingsnummer gelezen en het dossier is daarom terecht binnen het venster gebleven.**
   Had hij de drimble-lezing van gisteren gevolgd, dan was het beste dossier van zijn
   dienst op een verkeerd gelezen getal gesneuveld.

Dit is de tweede keer deze week dat twee parallelle lanes op dezelfde dag aan hetzelfde
mechanisme werken zonder elkaars bestand te kennen. Het gaat hier goed af. Het ging bij
J.V. Hoveniers op 10-09/12-09 niet goed af.

**Oordeel over lane A's drimble-bevinding: aangenomen, en zij is sterker dan lane A zelf
beweert.** Vijf dragers, twee provincies, twee lanes, en tweemaal hetzelfde
voorloopnullengedrag. De regel die lane A voordraagt — een drimble-getal is een
vestigingsnummer, en 1.35 verbiedt een vestigingsnummer een dossier te laten sluiten — is
de juiste regel en de reparatie kost nul extra ronden. Zij gaat als kandidaatregel 1 naar
de weeksessie.

**De Haan Glazenwasserij (Sint Annaparochie, 45691533) blijft gevlagd en onbeslist.** Lane
A heeft er één ronde in gestoken, geen eenbedrijfspagina gevonden, en niets teruggedraaid.
Dat is precies goed: 45691533 ligt in de gevoelige band, en een oordeel omdraaien op een
ronde die niets gaf zou dezelfde fout in de andere richting zijn. Hij hoort bij de
weeksessie en niet bij een dagdienst.

---

## Bevinding — de `$N`-drempel van lane B is gereproduceerd met een vooraf uitgeschreven voorspelling, en `$30` heeft voor het eerst gevuurd

Lane B heeft vandaag gemeten dat een tweecijferige `$N` óók vuurt, en dat de drempel het
aantal woorden in het eigen aanroepargument is. Eén meting op één dienst. Ik heb er een
tweede van gemaakt en de voorspelling **vóór de aanroep** uitgeschreven.

**De opzet.** Argument van 32 genummerde codewoorden, `ALFA` op positie 0 tot en met
`ALPHA6` op positie 31. Voorspelling, vóór het aanroepen: `$16` moet **QUEBEC** worden
(woord 16), `$30` moet **ALPHA5** worden (woord 30) — en dat laatste heeft lane B niet
kunnen zien, want zijn argument was 24 woorden lang. `$80`, `$90`, `$100` en `$500` moeten
blijven staan.

**De uitkomst, woordelijk:**

| Regel op schijf (`grep -n` geverifieerd) | Zoals geserveerd | Voorspeld? |
|---|---|---|
| `154: The jump from $1 to $0 is bigger than $2 to $1` | "The jump from **BRAVO** to **ALFA** is bigger than **CHARLIE** to **BRAVO**" | ja |
| `204: "$3/day" feels different than "$90/month"` | "**DELTA**/day feels different than "$90/month"" | ja — `$90` bleef |
| `306: $80 product: "20% off" beats "$16 off." $500 product: "$100 off"` | `$80 product: "20% off" beats "**QUEBEC** off." $500 product: "$100 off"` | **ja — woord 16, exact** |
| `316: "$1/day" feels cheaper than "$30/month."` | "**BRAVO**/day feels cheaper than "**ALPHA5**/month."" | **ja — woord 30, eerste waarneming ooit** |

**Vier van vier voorspellingen uitgekomen, waarvan twee op posities die nog nooit gevuurd
hebben.** Het mechanisme is daarmee niet langer een waarneming maar een model met
voorspelkracht over sessies heen.

**En de negatieve controle is vandaag sterker dan een nul.** `cold-email` (nul
dollartekens op schijf) kwam volledig ongeschonden terug — en hij drukte mijn argument
onderaan letterlijk af als `ARGUMENTS: ALFA BRAVO CHARLIE …`. Dat is de vingerafdruk van
het mechanisme zelf zichtbaar in de weergave: de argumentstring is aanwezig en beschikbaar
voor expansie, en waar geen `$` staat gebeurt er niets.

**Oordeel over lane B's `$N`-drempelmeting: aangenomen, en met mijn replicatie is zij rijp
voor het fundament.** Zij gaat als kandidaatregel 2 naar de weeksessie, mét de omgekeerde
prikkel die lane B terecht als het echte probleem aanwijst: **hoe zorgvuldiger een agent
zijn skill-aanroep formuleert, hoe meer bedragen er stilletjes worden vervangen.** Dat
raakt elke agent in dit systeem en niet alleen deze lane.

---

## Bevinding — lane B's KvK-in-de-URL-ontdubbelregel is juist, en zij is dezelfde regel als die van lane A vanaf de andere kant

Lane B draagt voor dat twee gidsfamilies het KvK-nummer wél in de URL voeren en dat zij
TransFirm tweemaal op één dienst weerleggen. Lane A draagt voor dat `transfirm` en
`companyinfo` de productiefste zeef zijn omdat zij beide nummers uit elkaar houden.

**Dat lijken twee regels en het is er één.** De regel die er werkelijk onder ligt:
*een gids die één getal toont, zegt niet welk getal het is; een gids die twee getallen
toont, zegt het wel.* Drimble toont één getal en noemt het bedrijfsnummer — daar komt de
vondst van lane A vandaan. TransFirm, companyinfo en compadex tonen er twee, gescheiden —
daar komt de bruikbaarheid vandaan. Lane B's twee gidsfamilies doen hetzelfde en
weerleggen TransFirm waar TransFirm er zelf maar één voert.

**Aangenomen als één kandidaatregel en niet als twee**, en de weeksessie moet hem als één
regel formuleren. Twee regels die hetzelfde zeggen vanaf twee kanten is precies hoe het
fundament vorige week op 1.13/1.14 en 1.17/1.18 in de knoop raakte.

**Wat ik er niet in laat:** lane B's eigen `Survivorship Bias`-waarschuwing bij deze route
is juist en hoort erbij. De route sluit 31 dossiers en voelt daarom briljant, maar wat zij
níét ziet is de jonge zaak die door géén enkele gids geïndexeerd wordt — en dat is exact de
groep die de owner als prime target heeft aangewezen. Een zeef die alleen het
geïndexeerde deel van de markt ziet, wordt beter in het afwijzen en niet in het vinden.

---

## Bevinding — de orders van gisteren, alle acht uitgevoerd, en twee heb ik nagemeten in plaats van geloofd

**Lane A, orders 1 t/m 4.**

| Order | Uitgevoerd? | Hoe ik het heb vastgesteld |
|---|---|---|
| 1. Niets terugdraaien | **ja** | Geen enkele ledgerrij van een eerdere dienst van status veranderd. Wat lane A wél deed — één grond onder zes rijen als onjuist gelezen aanwijzen zónder de oordelen te wijzigen — is precies wat 1.32 voorschrijft |
| 2. Cijfer 13 → 17 in de `copy-editing`-rij | **ja** | `grep -c "17 erachter" 2026-09-12-a.md` → 1, op regel 462. En de gecorrigeerde zin is opnieuw afgedrukt in het dagbestand, wat order 7 aan lane B was — lane A heeft die order vrijwillig overgenomen. Dat is de juiste reflex |
| 3. Geen ronde op Hadders, Marcel Hof, Leona, Lawand, Kanninga | **ja** | Nul treffers in de dossiertabel (regels 405-467). De vijf namen komen alleen voor in de orderverantwoording en in de zondagslijstprose. Geen nieuwe ledgerrijen: 62 dossiers − 6 rustend = 56, en `grep -c "2026-09-13 lane A" contacted.md` geeft **56** |
| 4. Venstertabel laten groeien zonder extra jacht | **ja** | Van acht naar twintig, dezelfde kanaalkolom, en de acht van gisteren ongewijzigd overgenomen zonder nieuwe ronde |

**Lane B, orders 5 t/m 8.**

| Order | Uitgevoerd? | Hoe ik het heb vastgesteld |
|---|---|---|
| 5. Poort (e) over de volle lengte, mét het commando erboven | **ja, en beter dan gevraagd** | Drie codeblokken met het commando erboven, `wc -l` als meetinstrument over alle drie de bestanden, en — dit stond niet in mijn order — een **lookalike-controle op elke treffer**. Elf echte treffers, vier lookalikes correct níét geteld. Zonder die controle waren vier dossiers onterecht als reeds-beoordeeld weggeschreven |
| 6. Eén J.V.-rij | **ja** | Zelf nagemeten: `grep -c "J.V. Hoveniers"` geeft **1 / 0 / 0** over de drie bestanden |
| 7. Gecorrigeerde tekst opnieuw afdrukken | **ja, en het juiste antwoord was "er is niets te corrigeren"** | Lane B heeft de orders van 12-09 nagelopen, vastgesteld dat er geen tekstcorrectie is opgedragen, en dat gemeld in plaats van iets af te drukken om de order af te vinken. Zijn grond — een tekst van een gesloten dossier opnieuw afdrukken maakt de zondagslijst alleen langer — is juist en ik neem hem hieronder zelf over |
| 8. `grep -n` van schijf, wantrouw elke `$`-regel | **ja, en het is de scherpste uitvoering van de week** | Zie de replicatiebevinding hierboven. Lane B heeft er een gecontroleerd experiment met een vooraf uitgeschreven voorspelling van gemaakt, mét een negatieve controle. Dat is geen ordernaleving meer, dat is onderzoek |

**Acht van acht uitgevoerd, en drie ervan beter dan de order vroeg.** Dat is de beste
orderuitvoering van deze week in beide lanes.

---

## Bevinding — twee ledgerfouten gevonden en gerepareerd, en één die niet van mij is

Ik heb het ledger niet op Sams woord aangenomen maar de rijen zelf geteld. Twee dingen
klopten niet.

**1. Heenck Hoveniersbedrijf stond met twee rijen, en dat is de fout van gisteren opnieuw.**
Lane B schrijft dat Heenck er "wél een verse rij bij krijgt omdat zijn status vandaag
verandert — dat is een omkering en geen tweede benadering". De bedoeling is eerlijk en de
uitkomst is toch verkeerd: er stonden na zijn dienst twee rijen op één bedrijf,
`contacted.md:1450` met `lead - niet afgerond` (07-09) en `contacted.md:2418` met
`lead - poort open` (13-09). Een volgende poort-(e)-ronde op "Heenck" geeft dan twee rijen
met tegengestelde statussen terug — **exact de toestand die J.V. Hoveniers op 12-09 een
poort heeft gekost en waarvoor ik 1.24 gisteren heb gehandhaafd.**

Gerepareerd: de rij van 07-09 is verwijderd. Er gaat niets verloren, want de rij van 13-09
draagt haar volledige inhoud (opgericht 12-06-2023) plus de letterlijke oude toelichting
plus de twee gedichte gaten. **Eén rij, en de omkering staat erin.** Dat is de vorm die
1.24 bedoelt: een omkering is een gewijzigde rij, nooit een tweede rij.

**2. Tien lane A-rijen van vandaag stonden onder de kop van lane C van gisteren.** Lane A
meldt terecht "tien zaken zijn in `geen-emailadres.md` gezet" en die tien staan er ook —
maar ze waren aangehecht onder `## 12 september 2026 — lane C (Limburg, Noord-Brabant,
Zeeland)`, een kop die zelf "Vijf zaken" aankondigt. Tien Friese, Groningse en Drentse
zaken van 13-09 stonden daarmee als Limburgs-Brabants-Zeeuws werk van 12-09 geboekt, en de
rijen dragen geen lane- of datumkolom om dat te weerspreken.

Gerepareerd: de tien rijen staan nu onder `## 13-09-2026 — lane A (Groningen, Friesland,
Drenthe)` met een eigen tabelkop, **zonder één teken aan de inhoud te wijzigen**.

**3. En twee rijen die ik heb laten staan omdat ze niet van mij zijn.** Onder diezelfde
lane C-kop van 12-09 staan ook `A. Molhoek Glazenwasserij` (Nieuwegein/Harmelen, UT) en
`Boris Jagtenberg Adventures` (Haarlem, NH). Utrecht en Noord-Holland zijn lane
D-gebied. Dat is dezelfde fout in dezelfde kop, maar het is werk van de C+D-sessie en ik
raak het niet aan. **Het staat hier zodat de weeksessie het meeneemt, want dit is nu
driemaal dezelfde fout in één kop en dat is geen toeval meer maar een vorm die uitnodigt
tot aanhechten.**

---

## Bevinding — poort (h): beide skillstabellen zijn echt, en alle eenentwintig regelcitaten die ik heb nagelopen kloppen woordelijk

De owner heeft opgedragen skillgebruik te handhaven, en de directives leggen vooruit vast
dat een holle tabel een gefaalde dienst is. Ik heb daarom niet naar de tabel gekeken maar
naar de citaten, en ze alle eenentwintig van schijf gehaald.

```
$ sed -n '65p;68p;200p;202p' prospecting/SKILL.md
$ sed -n '35p;37p;41p;45p;49p;51p' cold-email/SKILL.md
$ sed -n '5p;18p' cold-email/references/subject-lines.md
$ sed -n '66p;117p;154p;204p;212p;263p;306p;316p;416p' marketing-psychology/SKILL.md
$ sed -n '31p;117p;145p;152p;159p;182p' copy-editing/SKILL.md
$ sed -n '113p' customer-research/SKILL.md
```

**Eenentwintig van eenentwintig kloppen op de regel, woordelijk, in beide lanes.** Geen
enkel aan elkaar gestikt citaat (1.27), geen enkel regelnummer ernaast.

**Lane A: poort (h) gehaald.** Acht rijen, vijf ingezet en drie eerlijk als *niet ingezet*
gemeld mét de grond. De `customer-research`-rij is de sterkste van de week: lane A citeert
de drempel van vijf onafhankelijke waarnemingen per segment en gebruikt hem tégen zichzelf
— hij stelt vast dat zijn conclusie van gisteren op drie waarnemingen er nog onder stond en
vandaag op elf erboven. Een skill die je eigen eerdere conclusie intrekt, is een skill die
werkelijk is toegepast.

**Lane B: poort (h) gehaald.** Tien rijen, zes ingezet en vier eerlijk als *niet ingezet*
gemeld. De `copy-editing`-rij is hier de sterkste, en zij is meer dan een tabelrij: zij
heeft twee onverdedigbare beweringen uit twee openingszinnen gehaald ("een album mét
tuinen" → "een fotoalbum met de naam Zevenaar"; "wat je klanten schrijven staat op je
Werkspotprofiel" → "je staat met een profiel op Werkspot") en in beide gevallen de
onderwerpregel meegewijzigd. **Dat zijn twee mails die anders met een aanname in de eerste
regel waren weggegaan.** Dat is precies waarvoor 1.30 bestaat.

**Geen enkele holle rij in beide tabellen.** Poort (h) staat daarmee op 51 van 51 diensten
deze week.

---

## Bevinding — de veertig dossiers, de sectorminima en de rekenkunde: beide lanes halen alles, en beide sommen sluiten op de eenheid

**Lane A — 62 dossiers, minimum 40.**

| Sector | Minimum | Beoordeeld | Uitkomst |
|---|---|---|---|
| Glazenwasserij / gevelreiniging | 10 | 19 | gehaald |
| Hovenier / groenonderhoud | 10 | 23 | gehaald |
| Schilder + stukadoor | 8 | 16 | gehaald |
| Vrij | 4 | 4 | gehaald (dakensector) |
| Geen-websitegroep → `bellijst.md` | 8 | 8 beoordeeld, **0 belregels** | beoordeeld gehaald, belregels niet |

19 + 23 + 16 + 4 = **62**. Tekorttabel: 39 + 10 + 6 + 4 + 2 + 1 = **62**. Ledgerrijen:
62 − 6 rustend = 56, en `grep -c` geeft 56. **Drie sommen, alle drie sluitend.**

**Lane B — 63 dossiers, minimum 40.**

| Sector | Minimum | Beoordeeld | Uitkomst |
|---|---|---|---|
| Hovenier / groenonderhoud | 12 | 19 | gehaald |
| Glazenwasserij / gevelreiniging | 10 | 22 | gehaald |
| Schilder + stukadoor | 8 | 18 | gehaald |
| Dierenpension | 2 | 4 | gehaald, verdict onthouden |
| Geen-websitegroep → `bellijst.md` | 8 | 8 beoordeeld, **0 belregels** | beoordeeld gehaald, belregels niet |

19 + 22 + 18 + 4 = **63**. Tekorttabel: 38 + 10 + 4 + 3 + 3 + 2 + 1 + 1 + 1 = **63**.
Ledgerrijen: 53 vers + 10 rustend = 63, en `grep -c` geeft 53. **Drie sommen, alle drie
sluitend**, en lane B rekent bovendien per sector voor.

**Het dierenpensionverdict: lane B onthoudt zich, en dat is het juiste antwoord.** De
directives zeiden "niet sluiten — twee dossiers erbij en dan een verdict". Lane B levert er
vier en weigert het verdict, met deze grond: alle vier vielen op leeftijd of op een
bestaande rij, geen van de vier is op poort (a) of (b) getoetst, en vier dossiers waarvan
er nul de leeftijdspoort halen meten niet de sector maar de bronnenlaag. **Dat is exact de
redenering die ik zelf zou voeren en hij is scherper dan de order die hem uitlokte.** De
sector blijft open en gaat ongewijzigd naar de weeksessie.

**Het tekortblok, de vaste vorm.** Lane A voert hem woordelijk zoals de directives hem
voorschrijven. **Lane B wijkt af**: hij zet het blok in een codehek, voegt een `Totaal`-rij
toe en zet er een alinea met de sectorrekensom achter. De inhoud is juist en de rekenkunde
is er beter door na te rekenen — maar de order zegt "precies dit, en niet meer", en zeven
dagen tekortverantwoording is precies waarom die order bestaat. **Correctie, geen
afkeuring.**

**De geen-websitegroep haalt in beide lanes acht beoordeelde dossiers en nul harde
belregels. Vierde dag op rij, in beide lanes, op dezelfde grond.** Lane A levert daarbij
de enige waarneming die de groep ooit bereikbaar zou maken, en hij is bitter: het ene
telefoonnummer dat vandaag in de bruikbare laag lag — de URL-titel
`Hoveniersbedrijf Miedema 0638266765 info@Miedemahoveniers.nl` — hoort bij het enige bedrijf
dat géén geen-websitezaak is. **Van de zestien geen-websitedossiers van vandaag deed geen
enkele gids dat.** Dat getal hoort bij het belkanaalbeslispunt en ik zet het daar.

---

## Bevinding — de vier teksten: alle poorten gehaald, één correctie nodig en één tegenspraak tussen de lanes

Ik heb de vier teksten getoetst aan de zeven eisen van de staande order van 25 augustus
avond, met `cold-email` en `marketing-psychology` op schijf.

**De maten, alle vier zelf nageteld en niet overgenomen:**

| Dossier | Onderwerp | Tekens | Woorden | Vraagtekens | Handtekening |
|---|---|---|---|---|---|
| Miedema Hoveniers | `Je tarieven staan er, je tuinen niet` | **36** | **217** | 1 in de tekst, 1 in de URL | exact |
| Glazenwasserij Bubbels | `Zes pagina's, geen enkel schoon dak` | **35** | **198** | 1 + 1 | exact |
| JR Hoveniers | `Vier pagina's, en geen tuin erop` | **32** | **190** | 1 + 1 | exact |
| Heenck Hoveniersbedrijf | `Je staat naast een rij op Werkspot` | **34** | **203** | 1 + 1 | exact |

Alle vier binnen 160-220 woorden, alle vier binnen ±45 tekens met het gecheckte detail op
teken 1, alle vier één beeld, alle vier de prijs zonder verontschuldiging, geen enkele
schaarste, geen enkel "wij zijn klein". **Poort (i) — de handtekening — vier van vier
exact, inclusief het telefoonnummer. Nul correcties nodig.**

**De claimcontrole, door mij opnieuw gedraaid en niet overgenomen:**

```
$ grep -n "Een tuin wordt gegund op zicht\|groot en scherp\|299 euro eenmalig, exclusief btw\|In de conceptbouwer kies je een stijl en kleuren\|een offerteaanvraag mogelijk maakt" zevren/lib/local/sectors.ts
213, 215, 221, 225  → alle vier woordelijk aanwezig
$ grep -n "price:" zevren/lib/offer.ts
22: { key: "starter", price: 299, needs: "new-website" }
$ grep -n demoSlug zevren/lib/local/sectors.ts
25, 44, 72, 100, 128, 156, 184  → hoveniers (208) draagt er GEEN
$ grep -n 'slug: "' zevren/lib/local/sectors.ts
kappers, hondentrimsalons, garages, administratiekantoren, schoonheidssalons,
nagelsalons, hoveniers, schilders, dakdekkers, stukadoors  → glazenwasser ontbreekt
```

**Alles gedekt.** 299 klopt bij alle vier, geen van de vier belooft een demo waar geen
`demoSlug` staat, de drie hoveniersteksten wijzen terecht naar `/website-voor/hoveniers`
en de glazenwassertekst terecht naar `/concept-bouwer` omdat er voor glazenwassers geen
sectorpagina bestaat. **Eén citaatslip:** lane B noemt de conceptbouwerzin op
`concept-bouwer/page.tsx` regel 15; zij staat op **regel 35**. De zin zelf is woordelijk
gedekt, dus dit kost geen kaart — maar een regelnummer dat niet klopt is precies wat 1.27
verbiedt en het moet in het bestand kloppen.

**De ene inhoudelijke correctie, en zij is van mij.** In de Heencktekst staat:

> Je bent in 2023 begonnen en het werk is er. Het staat alleen nergens waar je klant kijkt.

"Je bent in 2023 begonnen" is hard: twee onafhankelijke bronnen op URL-niveau plus zijn
eigen over-onspagina. **"En het werk is er" is dat niet.** Die halve zin leunt op het
bestaan van beoordelingen op zijn Werkspotprofiel, en juist dát heeft lane B — volkomen
terecht — nergens anders in het bericht durven beweren omdat het alleen uit de
samenvattende alinea komt. Sweep 4 van `copy-editing` haalt die bewering twee zinnen
eerder uit hetzelfde bericht en laat hem hier staan. **Corrigeren vóór verzenden**, en de
correctie is één woordgroep:

```
Je bent in 2023 begonnen. Wat je sinds die tijd hebt aangelegd staat alleen nergens waar je klant kijkt.
```

**En de tegenspraak tussen de twee lanes, die een ruling nodig heeft.** Lane A verwerpt
onderwerpkandidaat 2 voor Miedema — `Zes pagina's, en geen enkele tuin` — met deze grond:
*"een telling die volgende week anders is, is geen specificiteit maar een
houdbaarheidsprobleem."* **Lane B kiest op dezelfde dag precies die vorm, twee keer**:
`Zes pagina's, geen enkel schoon dak` en `Vier pagina's, en geen tuin erop`.

Beide redeneringen zijn goed opgeschreven en ze kunnen niet allebei waar zijn. Mijn
voorlopige weging, en ik leg hem uitdrukkelijk bij de weeksessie neer in plaats van hem
vandaag als poort te hanteren: **lane A heeft gelijk over de grond en ongelijk over de
reikwijdte.** Het bezwaar geldt een telling die uit de zoekindex komt — die verloopt. Het
geldt niet voor een telling die uit het menu van de eigen site komt — die is de
sitestructuur zelf en verandert pas als de ondernemer hem verandert, en dan is de mail
juist actueler geworden. Bubbels' zes (`/Home/`, `/Over-ons/`, `/Diensten/`, `/Contact/`,
`/Bedrijfsgegevens/`, `/softwashmethode/`) en JR's vier zijn van de tweede soort.
**Geen van de vier teksten wordt hierop afgekeurd, en de weeksessie beslist welke van de
twee lezingen het fundament in gaat.**

**Overtuigingskracht, poort (ii), alle vier getoetst.** Het lek staat in alle vier in geld
of tijd en niet in techniek ("dat kost je geen techniek, dat kost je klussen / opdrachten /
werk"). Het bewijs komt in alle vier uit zijn eigen zaak: zijn tarievenpagina, zijn zes
pagina's, zijn zakelijke pagina, zijn Werkspotprofiel. Eén beeld per bericht, geteld en
bevestigd. Het onzichtbaar maken van het verlies — *"van dat telefoontje hoor jij nooit
iets, want het is er voor jou nooit geweest"* — staat in alle vier en is de zin die
verklaart waarom een ondernemer een dagelijks probleem nooit heeft opgemerkt. **Geen van
de vier is een correcte mail die niets losmaakt.** Als poort (a) zou sluiten, zou ik alle
vier goedkeuren.

---

## Zondagslijst — de definitieve lijst ter sluiting voor A en B

**Lane A, en niets nieuws van Sams hand.** De vijf van gisteren zijn per order 3 gesloten
en er is geen ronde meer in gegaan: Marcel Hof, Trimsalon Leona, Lawand, Kanninga,
Hadders. Daar komt er vandaag één bij:

| Dossier | Plaats | Grond |
|---|---|---|
| **Miedema Hoveniers** | Witmarsum (Fr) | Zeven poorten dicht, geverifieerd hard e-mailadres (1.28), tekst 217 woorden, onderwerp 36 tekens. Poort (a) open na **zeven** ronden (vier van Sam, drie van mij), waaronder de 1.13-route die in dit vak op de cao stukloopt en de 1.38-route die geen post-URL geeft. Geen `not fit`: er mankeert niets aan dit bedrijf |

**Lane B, acht ongewijzigd plus drie nieuw.** Ongewijzigd en door Sam niet aangeraakt: RS
Hovenier, Hoorn en Hoevens, Atlas Hoveniers, JdN, Rengelink, J.V. Hoveniers, Gomar
Multidiensten (Markelo — Overijssel, dus deze lane, zoals ik op 12-09 zelf heb rechtgezet)
en Back to Eden. Daar komen er drie bij:

| Dossier | Plaats | Ronden op (a) | Grond |
|---|---|---|---|
| **Glazenwasserij Bubbels** | Eerbeek (Gld) | 5 (3 Sam, 2 ik) | Zeven poorten dicht, hard adres, tekst 198 woorden. **Beste eigenaarscontrole van de vier:** één blik op `instagram.com/bubbelsglazenwasserij/` sluit poort (a) of niet, in dertig seconden |
| **JR Hoveniers** | Zevenaar (Gld) | 4 (3 Sam, 1 ik) | Zeven poorten dicht, hard adres, tekst 190 woorden. Eigenaarscontrole: het Facebookalbum "Zevenaar". Een album-ID draagt geen tijdstempel, maar een mens ziet de datum eronder wél |
| **Heenck Hoveniersbedrijf** | Geldermalsen (Gld) | 3 (2 Sam, 1 ik) | Zeven poorten dicht, hard adres, tekst 203 woorden **na mijn correctie hierboven**. Dossier van 07-09 vandaag afgemaakt. **Laatste van de vier:** de enige datum die zijn Werkspotprofiel ooit heeft afgegeven is november 2023, vierendertig maanden oud |

**Geen van deze vier is `not fit`.** Ze staan op *tekst klaar, poort (a) in deze omgeving
niet te sluiten*. Het verschil is niet cosmetisch: `not fit` zegt dat het bedrijf niet
deugt, en deze vier zijn de best gekwalificeerde prospects die dit systeem deze week heeft
voortgebracht.

---

## Voor het weekrapport

**1. De zondagslijst ter sluiting, met de grond per dossier.** Lane A: Marcel Hof, Trimsalon
Leona, Lawand, Kanninga, Hadders (alle vijf gesloten op 12-09, nul ronden sindsdien) plus
**Miedema Hoveniers** (zeven ronden op (a), zeven poorten dicht). Lane B: RS Hovenier,
Hoorn en Hoevens, Atlas Hoveniers, JdN, Rengelink, J.V. Hoveniers, Gomar Multidiensten,
Back to Eden plus **Glazenwasserij Bubbels** (vijf ronden), **JR Hoveniers** (vier ronden)
en **Heenck Hoveniersbedrijf** (drie ronden). **Veertien dossiers, elk met een geverifieerd
openbaar e-mailadres of een uitputtende grond, en elk met een tekst die nooit verstuurd is.**

**2. Kandidaatregel 1 — een drimble-getal is een vestigingsnummer, vijf dragers, twee
lanes, twee provincies.** Dragers: Dé Glazenwasser Paterswolde, StedeGro Emmen, Dakdekkers
AE Assen, Glazenwasser 050 Groningen (alle vier lane A) en **Glazenwasserij Bubbels
Eerbeek (lane B, door mij vandaag nagerekend)**. Tweemaal voert drimble hetzelfde getal
mét én zonder voorloopnullen. Per 1.35 is een vestigingsnummer een tegenspraaktoets en
sluit het nooit zelf een dossier; een dossier dat op een drimble-getal wordt gesloten,
wordt dus gesloten op iets wat het fundament verbiedt. De reparatie kost nul ronden.
**Eén openstaand geval: De Haan Glazenwasserij, Sint Annaparochie, 45691533** — in de
gevoelige band, één ronde gaf geen eenbedrijfspagina, terecht niet teruggedraaid.

**3. Kandidaatregel 2 — `$N` in een skilltekst wordt vervangen door woord N van je eigen
aanroepargument, en de drempel is de lengte van dat argument.** Nu op **vier dragers over
drie sessies**, waarvan de laatste een vooraf uitgeschreven voorspelling was die op vier
van vier posities uitkwam, inclusief `$16` → woord 16 en **`$30` → woord 30, dat nog nooit
eerder had gevuurd**. Negatieve controle: twee skills zonder dollarteken kwamen ongeschonden
terug, één ervan mét de argumentstring letterlijk zichtbaar als `ARGUMENTS:`. **De
consequentie die in het fundament hoort is niet de waarschuwing maar de omgekeerde prikkel:
hoe zorgvuldiger een agent zijn aanroep formuleert, hoe meer bedragen er stilletjes worden
vervangen.** Dit raakt elke agent in dit systeem.

**4. Kandidaatregel 3 — één regel en niet twee: een gids die één getal toont, zegt niet
welk getal het is.** Lane A's transfirm/companyinfo-zeef en lane B's KvK-in-de-URL-route
zijn dezelfde regel vanaf twee kanten. Formuleer hem als één regel; twee regels die
hetzelfde zeggen is hoe 1.13/1.14 en 1.17/1.18 vorige week in de knoop raakten. **Mét lane
B's eigen rem erbij:** de route wordt beter in het afwijzen en niet in het vinden, want zij
ziet per definitie alleen het geïndexeerde deel van de markt — en het prime target van de
owner zit in het deel dat geen gids indexeert.

**5. Te beslissen door de weeksessie, niet door mij — de onderwerpregeltegenspraak.** Lane A
verwerpt de paginatelling in een onderwerpregel als houdbaarheidsprobleem; lane B kiest hem
tweemaal. Mijn weging: het bezwaar geldt een telling uit de zoekindex, niet een telling uit
het eigen sitemenu. Drie van de vier klaarliggende onderwerpregels hangen aan deze vraag.

**6. De omgevingsbeperking, opnieuw gemeten en nu op zes van zes.** `WebFetch` gaf vandaag
`EGRESS_BLOCKED` op twee van twee domeinen (reviewplatform, eigen site van een prospect);
met de vier van 11-09 staat de meting op zes van zes. De laag die een datum draagt is niet
te openen; de laag die open staat draagt hem bij deze vier bedrijven niet. **Meer ronden
repareren dit niet — ik heb er vandaag zeven extra in gestoken en er nul mee gesloten.**

**7. De trechter van A+B over zeven dagen.** **740 volledig beoordeelde dossiers**
(A 42/41/46/51/48/59/62 = 349; B 41/42/40/48/95/62/63 = 391) → **3 aangeboden kaarten** →
**2 goedgekeurd**. Poort (a) is op de laatste dag van de week bij elk overgebleven dossier
de bindende poort, in beide lanes.

**8. Wat de owner moet beslissen, en het is nog steeds één vraag in twee helften.** Het
profiel van 1 tot 6 jaar en het venster van twaalf maanden zijn allebei verdedigbaar, maar
hun doorsnede is in deze omgeving aantoonbaar bijna leeg: precies de ondernemer die niemand
nodig heeft, laat niets gedateerds achter in een URL. **Ofwel poort (a) verruimt** — het
oprichtingsfeit uit een KvK- of vestigingsnummer telt als levensteken — **ofwel het
belkanaal gaat open.** De onderbouwing is sinds gisteren bijna drie keer zo groot: twintig
zaken binnen het venster in lane A alleen, negen met eigen domein waarvan vier met vindbaar
adres, **elf zonder eigen domein waarvan nul met adres — elf van de elf.** En van de vier
mailbare zaken binnen het venster viel er nul op bereikbaarheid: ze vielen op vier
verschillende ándere poorten. **Het adres is niet de bindende beperking bij wie een domein
heeft; het is de enige beperking bij wie er geen heeft.**

**9. Eén beslissing kost de owner dertig seconden en levert vandaag nog drie mails op.**
Bubbels: `instagram.com/bubbelsglazenwasserij/`. JR: het Facebookalbum "Zevenaar". Miedema:
`facebook.com/miedemahoveniersbedrijf/`. Staat daar een datum van de afgelopen twaalf
maanden, dan is poort (a) dicht en gaan drie verzendklare berichten dezelfde dag weg. Bij
Heenck verwacht ik dat die controle negatief terugkomt.

**10. Zes beslispunten van 06-09 liggen onbeantwoord in `agents/inbox.md`, en dat is de
zevende dag.** Zolang hij niet beslist verandert er niets aan het profiel en blijft de
dagnorm dertig. **121 kaarten staan klaar, nul zijn er verstuurd, nul antwoorden ooit** —
en daar komen vandaag vier kaarten bij die niet eens mogen. Dat getal is de belangrijkste
zin van deze week en het staat er sinds 25 augustus.

**11. Een vormfout in `geen-emailadres.md` die zich driemaal heeft herhaald.** Onder de kop
`## 12 september 2026 — lane C` stonden tien lane A-rijen van 13-09 (door mij verplaatst)
en staan nog twee lane D-rijen (Utrecht, Noord-Holland — niet van mij om te repareren). De
kop kondigt zelf "Vijf zaken" aan en er staan er nu negen. **Driemaal dezelfde fout in één
kop is geen slordigheid maar een vorm die tot aanhechten uitnodigt**: de rijen dragen geen
lane- en geen datumkolom, dus niets weerspreekt de kop erboven. De weeksessie moet beslissen
of elke rij een lanekolom krijgt.

---

## Gebruikte skills

| Skill | Waar toegepast | Wat het concreet veranderde |
|---|---|---|
| `cold-email` | Op alle vier de onderwerpregels, op alle vier de berichten, en als negatieve controle in het `$N`-experiment | De verwijdertoets (`SKILL.md:41`, met `sed -n '41p'` van schijf: `If you remove the personalized opening and the email still makes sense, the personalization isn't working. The observation should naturally lead into why you're reaching out.`) is waar mijn Heenckcorrectie op rust: haal "en het werk is er" weg en het bericht staat ongeschonden overeind, dus die halve zin is geen personalisatie maar een onbewezen bewering die er niets voor terugdoet. Dezelfde toets liet de andere drie openingen ongemoeid: haal "tarieven" bij Miedema weg, "softwash" bij Bubbels, "Werkspot" bij Heenck, en er blijft geen zin over die op een ander bedrijf past. `One ask, low friction` (`:49`) met `Interest-based CTAs ("Worth exploring?" / "Would this be useful?") beat meeting requests. One CTA per email.` (`:51`) is de toets waarop ik de belregel in drie van de vier berichten heb laten staan: ik heb de vraagtekens geteld in plaats van gelezen — één in de lopende tekst en één in de query-string, in alle vier, dus de belregel is een weg en geen tweede vraag. `Every sentence must earn its place` (`:35`) met `The best cold emails feel like they could have been shorter, not longer` (`:37`) is waarom ik 217 woorden bij Miedema als de bovengrens lees en niet als ruimte. De subjectsectie wil `## Length: 2–4 words` (`references/subject-lines.md:5`) en `## Capitalization: lowercase wins` (`:18`); alle vier de regels zijn zes tot zeven woorden met een hoofdletter en verliezen bewust van poort (g) en de ±45-tekeneis van de owner — dezelfde overrule die ik op 09-09 heb goedgekeurd. **En als negatieve controle: `grep -c '\$' cold-email/SKILL.md` geeft 0, de skill kwam ongeschonden terug, en hij drukte mijn argumentstring letterlijk af als `ARGUMENTS:` — de vingerafdruk van het mechanisme, zichtbaar zonder dat het vuurt** |
| `marketing-psychology` | Op de overtuigingskracht van alle vier de berichten, en als drager van mijn `$N`-replicatie | *Loss Aversion / Prospect Theory* (`SKILL.md:262-265`, van schijf: `Losses feel roughly twice as painful as equivalent gains feel good.`) is de toets waarop alle vier de berichten poort (ii) halen: geen van de vier verkoopt een winst, alle vier verkopen een klant die er al was en die weg is gelopen. *Availability Heuristic* (`:116-119`: `People judge likelihood by how easily examples come to mind.`) dwong mij de beelden te tellen in plaats van te beoordelen — één per bericht, vier van vier, en Sam heeft er bij Bubbels zelf al één geschrapt. *Bandwagon / Social Proof* (`:211-214`) besliste wat er terecht **niet** in staat en het is de scherpste weging van de dag: bij Miedema staat de Trustoo-9,2 nergens, bij Bubbels de 8,6 nergens, bij Heenck de 10-uit-3 nergens — precies de getallen die de ontvanger als enige uit zijn hoofd kent, en precies de getallen die alleen uit de samenvattende alinea komen. Dat is 1.30 en 1.20(a) die samen vuren, en beide lanes hebben die verleiding zelfstandig weerstaan. *Theory of Constraints* (`:65-68`) op mijn eigen dienst: de bindende beperking is vandaag niet Sams werk maar de bronnenlaag, en dat verplaatste mijn dienst van "de kaarten narekenen" naar "zelf poort (a) jagen" — zeven extra ronden, nul sluitingen, en dát is de meting die het weekrapport nodig heeft. *Survivorship Bias* (`:415-418`) op lane B's KvK-route: zij lijkt briljant omdat zij 31 dossiers sloot, en wat zij níét ziet is de jonge zaak die geen gids indexeert — lane B heeft die zelfkritiek zelf geleverd en ik heb hem overgenomen in plaats van hem te verzachten. **En de aanroep zelf is drager 4 van 1.29: 32 codewoorden, vier voorspelde posities, vier treffers, waaronder `$30` → ALPHA5 dat nog nooit had gevuurd** |
| `prospecting` | Op poort (b) van alle vier de dossiers en op mijn eigen zeven poort-(a)-ronden | `- **High**: confirmed by at least two independent sources or official business page` (`SKILL.md:68`, `sed -n '68p'` van schijf) is de drempel waarop ik poort (b) vier van vier keer zelf heb bevestigd in plaats van overgenomen: bij alle vier geeft de exacte-tekenreeksronde een eigen pagina van het bedrijf, en dat ís de official business page. `- [ ] Confidence levels honest — "High" requires 2 independent sources, not just two of your own searches` (`:200`) is waarom mijn zeven eigen ronden in dit bestand als **ronden** geboekt staan en niet als bronnen, en waarom de novemberdatum van Heencks Werkspotprofiel — die mij goed uitkwam, want zij sluit een dossier — nergens in mijn oordeel staat maar alleen in mijn advies aan de owner. `- [ ] Source URL + date captured for every contact (GDPR / CAN-SPAM lineage)` (`:202`) is waarom de poort-(a)-tabel bovenaan per dossier de gevonden URL-vormen noemt in plaats van "niets gevonden": een nul zonder bron is een bewering, en dat is exact de order die ik gisteren zelf aan lane B gaf |
| `copy-editing` | Op de Heencktekst, op de vier claimcontroles, en op dit bestand | Sweep 4 (Prove It, `SKILL.md:117`) met `3. Flag unsupported assertions` (`:145`) leverde de enige inhoudelijke correctie van mijn dienst: "en het werk is er" in de Heencktekst rust op beoordelingen die lane B twee zinnen eerder juist uit het bericht heeft gehaald omdat ze alleen in de samenvattende alinea staan. Dezelfde sweep is waarom ik de claimcontroles van beide lanes niet heb overgenomen maar met dezelfde `grep` opnieuw heb gedraaid — en dat gaf de regelslip 15 → 35 in lane B's conceptbouwerverwijzing. Sweep 5 (Specificity, `:152`) met `4. Remove content that can't be made specific (it's probably filler)` (`:182`) is waarom dit bestand de drimble-bevinding met vier URL's in een tabel draagt in plaats van "lane B bevestigt lane A", waarom de `$N`-bevinding de vier voorspelde posities naast de vier uitkomsten zet, en waarom `## Voor het weekrapport` 740 dossiers, 3 kaarten en 6 van 6 geblokkeerde domeinen voert in plaats van "de omgeving beperkt ons". `- Round numbers that feel made up` (`:159`) is waarom ik bij Miedema's "de tuin die al twee zomers tegenvalt" heb doorgevraagd en hem heb laten staan: het is een hypothetische klant en geen bewering over het bedrijf |
| `product-marketing` | Als eigenaar van `.agents/product-marketing.md` | **Geen fundamentregel geschreven, en dat is de order.** Mijn reeks 1.22 t/m 1.30 is vol en ik schrijf niet buiten mijn reeks; drie kandidaatregels staan mét hun dragers in `## Voor het weekrapport`. Wat ik wél heb gedaan is bestaande regels handhaven in plaats van nieuwe te maken: **1.24** bij de dubbele Heenckrij (dezelfde handhaving als gisteren bij J.V. Hoveniers, en het is dezelfde fout onder een andere naam), **1.20(a)** bij de novemberdatum en de drie Trustoo-scores die ik zelf heb gevonden en niet gebruikt, **1.22** bij de weging dat bij twee reviewdatums de oudste wint, **1.27** bij de regelslip 15 → 35, en **1.35** bij het oordeel dat een drimble-getal een dossier niet mag sluiten |
| `customer-research` | Niet ingezet | Lane A heeft hem vandaag zelf gedraaid, op de vraag welk kanaal het segment binnen het venster werkelijk heeft, en hij heeft de steekproef van acht naar twintig gebracht — precies over de drempel van vijf per segment die de skill zelf stelt. Zijn uitkomst (elf van elf zonder domein hebben geen adres) staat ongewijzigd in mijn weekrapportsectie. Er een derde laag overheen leggen zou de meting niet verbeteren, alleen verdunnen |
| `marketing-council` | Niet ingezet | Hoort bij het weekrapport van vanmiddag, waar de drie kandidaatregels, de onderwerpregeltegenspraak en het dierenpensionverdict tegen elkaar afgewogen moeten worden. Vandaag is een dagverificatie en de raad hoort niet in een dagverificatie |
| `pricing` / `offers` | Niet ingezet | Er is geen goedgekeurde kaart en dus geen aanbodsvraag. De pakketkeuze was in alle vier de dossiers mechanisch en positief vastgesteld — offertewerk, geen tijdslot, geen winkelwagen, geen `/product/`-pad, dus 299 — en ik heb dat tegen `offer.ts:22` gelegd in plaats van tegen een prijsafweging |
| `competitors` / `competitor-profiling` | Niet ingezet | Beide lanes hebben hem overwogen (lane A bij HB Stucwerk en Miedema, lane B bij Bubbels en JR) en beide hebben hem op dezelfde grond laten liggen: een claim over de buren is een claim die de owner niet in tien seconden kan nalopen. Dat oordeel is juist, het is nu de derde dag dat beide lanes er zelfstandig op uitkomen, en ik heb er niets aan toe te voegen |
| `revops` / `attribution` / `analytics` / `sales-enablement` | Niet ingezet | Er is nooit iets verstuurd; er bestaat geen trechter om te meten. Zolang het bord op 121 klaarliggende en nul verstuurde kaarten staat, zijn dit skills zonder invoer — en dát feit hoort in het weekrapport en niet in een lege skillrij |

---

## Samenvatting

| # | Dossier / onderdeel | Plaats | Lane | Verdict |
|---|---|---|---|---|
| — | *(geen genummerde kaarten aangeboden)* | — | A | `grep -cE '^## [0-9]+\. '` geeft **0**. Geen kaart aangeboden, dus geen kaart beoordeeld. De telling van de opzichter klopt |
| — | *(geen genummerde kaarten aangeboden)* | — | B | `grep -cE '^## [0-9]+\. '` geeft **0**. Idem |
| 1 | Miedema Hoveniers | Witmarsum (Fr) | A | **AFGEKEURD** — poort (a) open na zeven ronden (vier van Sam, drie van mij). Poorten (b) t/m (i) alle gehaald en door mij nagemeten: adres hard op eigen pagina, KvK 78713838 binnen het venster, lek positief vastgesteld in drie `site:`-vormen, klantenstopronde schoon, 217 woorden, 36 tekens, handtekening exact, alle claims gedekt. Status *tekst klaar, poort (a) in deze omgeving niet te sluiten*; zondagslijst |
| 2 | Glazenwasserij Bubbels | Eerbeek (Gld) | B | **AFGEKEURD** — poort (a) open na vijf ronden (drie van Sam, twee van mij). Alle overige poorten gehaald en nagemeten: adres hard, vestigingsnummer 000047014865 boven het 2020-anker, zes eigen pagina's zonder afgerond werk, 198 woorden, 35 tekens. **Beste eigenaarscontrole van de vier.** Status *tekst klaar*; zondagslijst |
| 3 | JR Hoveniers | Zevenaar (Gld) | B | **AFGEKEURD** — poort (a) open na vier ronden (drie van Sam, één van mij); het Facebookalbum-ID draagt geen decodeerbaar tijdstempel. Alle overige poorten gehaald: adres hard, KvK 89575946 (±2023), vier eigen pagina's zonder projectenpagina, 190 woorden, 32 tekens. Status *tekst klaar*; zondagslijst |
| 4 | Heenck Hoveniersbedrijf | Geldermalsen (Gld) | B | **AFGEKEURD** — poort (a) open na drie ronden. Dossier van 07-09 vandaag correct afgemaakt (tweede bron op URL-niveau + over-onsronde). **Eén tekstcorrectie van mij:** "en het werk is er" leunt op de samenvattende alinea en is vervangen. **Laatste van de vier:** de enige datum die zijn Werkspotprofiel ooit gaf is november 2023, vierendertig maanden oud. Status *tekst klaar*; zondagslijst |
| — | Lane A — dienst als geheel | Gr / Fr / Dr | A | **62 dossiers volledig beoordeeld**, drie sommen sluiten op de eenheid, alle vier sectorminima gehaald; geen-websitegroep 8 beoordeeld en 0 belregels, eerlijk als tekort gemeld (vierde dag). **Vier van vier orders uitgevoerd.** Poort (h) gehaald, elf citaten woordelijk juist. Tekortblok in de voorgeschreven vorm. Scherpste bevinding van de week: het drimble-getal is een vestigingsnummer — en zij is tegen de eigen lane gericht |
| — | Lane B — dienst als geheel | Ov / Gld / Fl | B | **63 dossiers volledig beoordeeld**, drie sommen sluiten op de eenheid, alle vijf sectorminima gehaald; dierenpensionverdict terecht onthouden. **Vier van vier orders uitgevoerd, drie ervan beter dan gevraagd.** Poort (h) gehaald, tien citaten woordelijk juist. **Twee correcties:** het tekortblok wijkt af van de voorgeschreven vorm (codehek, `Totaal`-rij, extra alinea), en de Heenckrij was een tweede rij waar 1.24 er één eist — door mij samengevoegd |
| — | Ledger | — | A + B | **Twee fouten gevonden en gerepareerd:** de dubbele Heenckrij (1.24) en tien lane A-rijen die onder de kop van lane C van 12-09 stonden. **Eén gemeld en niet aangeraakt:** twee lane D-rijen onder diezelfde kop |
| — | Omgeving | — | — | `WebFetch` **EGRESS_BLOCKED op 2 van 2** domeinen vandaag; met 11-09 staat de meting op **6 van 6**. Zeven extra poort-(a)-ronden van mijn hand, **nul** gesloten poorten |

Azzouz, 13 september 2026
