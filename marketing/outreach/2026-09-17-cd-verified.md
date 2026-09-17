# Verificatie — donderdag 17 september 2026 — lanes C en D

Azzouz, verificatiedienst. Beoordeeld: `marketing/outreach/2026-09-17-c.md`
(Limburg/Noord-Brabant/Zeeland, 54 dossiers) en `marketing/outreach/2026-09-17-d.md`
(Noord-Holland/Zuid-Holland/Utrecht, 76 dossiers). Lanes A en B liggen bij de tweede
sessie in `-ab-verified.md`; die bestanden heb ik niet aangeraakt.

**Uitkomst in één regel: nul kaarten, nul verzendklare teksten, en dat is bij beide
lanes de juiste uitkomst.** Er is vandaag niets voor de owner om te versturen. Wat er
wél is, staat hieronder: één leeftijdsfout die een kaart had kunnen kosten, één
vormfout die de opzichter blind maakte, en het antwoord op de vraag van de dag.

---

## De kaarttelling, met het commando

```
$ grep -cE '^## [0-9]+\. ' marketing/outreach/2026-09-17-c.md   → 0
$ grep -cE '^## [0-9]+\. ' marketing/outreach/2026-09-17-d.md   → 0
$ git show origin/main:marketing/outreach/2026-09-17-c.md | grep -cE '^## [0-9]+\. '   → 0
$ git show origin/main:marketing/outreach/2026-09-17-d.md | grep -cE '^## [0-9]+\. '   → 0
```

De telling van de opzichter is juist, in de werkdirectory en op `origin/main`: **nul
genummerde kaarten in lane C en nul in lane D.** Er is dus geen kaart om door de
poorten (a) t/m (g) te halen, geen onderwerpregel om te meten en geen handtekening om
te controleren. De dagnorm van dertig staat en mijn twee lanes leveren er nul aan.
Dat meld ik en ik verlaag de lat niet — dat is order, en het is ook het goedkoopste
wat ik vandaag kan doen.

---

## GOEDGEKEURD — lane C's tellingen reproduceren, en de partitie is exact

Elke verankerde telling nagelopen, elk commando zelf gedraaid:

```
$ grep -c "2026-09-17 lane C" contacted.md                                → 31   (lane C: 31) ✓
$ grep -cE '^\|.*2026-09-17 lane C' bellijst.md                           → 7    (lane C: 7)  ✓
$ grep -cE '^\|.*\| C \| 2026-09-17 \|$' geen-emailadres.md               → 6    (lane C: 6)  ✓
```

De dossiertabel telt over disjuncte rijen, zoals 1.46 eist: 8 + 5 + 8 + 10 = 31 nieuwe
rijen, 15 + 6 + 0 + 2 = 23 poort-(e)-rijen, 31 + 23 = 54. En lane C zegt er
uitdrukkelijk bij dat de kolom *Beoordeeld* in de quotumtabel met opzet níét optelt tot
54, omdat de dertien geen-websitedossiers een dwarsdoorsnede zijn die al onder hun
eigen sector staan. **Dat is precies de dubbeltelling die 1.46 verbiedt, en lane C
benoemt haar vóór iemand haar kan maken.** Dat is de goede vorm.

De tekorttabel partitioneert 1 t/m 54 exact. Nagerekend met een eigen script over de
zes opgegeven reeksen:

| Grond | Opgegeven | Lengte van de reeks |
|---|---|---|
| (e) ledger | 23 | 23 ✓ |
| (b) geen openbaar e-mailadres | 13 | 13 ✓ |
| (f) leeftijd open | 8 | 8 ✓ |
| (f) leeftijd buiten het venster | 6 | 6 ✓ |
| Buiten ICP — merkdealer | 3 | 3 ✓ |
| (a) open | 1 | 1 ✓ |

Geen gat, geen dubbel, elk opgegeven aantal gelijk aan het aantal nummers in zijn eigen
reeks. Rij 5 staat bij (e) en niet bij (f), met de grond erbij dat (e) de poort is die
hem als eerste velt — dat is 1.50 in de letter.

**En de zelfcontrole op de gemiste ledgertreffer is het beste werk van deze lane
vandaag.** Lane C schreef 32 nieuwe rijen, mat de naamindex vóór en ná, kreeg 31, en
heeft op dat verschil van één zijn eigen dubbele rij voor W.G. van Graven gevonden — een
zaak die deze lane gisteren zélf had afgewezen en die een `grep | head -1` had verborgen
achter `'s-Gravenpolder`. Dat is een controle die iets kan **weerleggen**, en dat is een
andere en zeldzamere soort dan een telling die iets bevestigt. Ik onderschrijf de regel
die lane C eronder voorstelt en hij gaat als kandidaat naar het weekrapport.

---

## AFGEKEURD — lane C's tekortblok staat in een codefence, en dat is precies waarom de opzichter de regel eronder niet kon lezen

Dit is de vraag die de opzichter meegaf en het antwoord is een verschil van twee regels.
Ruwe bytes, met `sed -n '406,412p' 2026-09-17-c.md | cat -A`:

```
r.406   ## Tekort van de dag$
r.407   $
r.408   ```$
r.409   Gevraagd: 30 (over vier lanes) · deze lane beoordeeld: 54 · kaarten: 0 · …$
```

En lane D, `sed -n '333,337p' 2026-09-17-d.md | cat -A`:

```
r.333   ## Tekort van de dag$
r.334   Gevraagd: 30 (over vier lanes) · deze lane beoordeeld: 76 · kaarten: 0 · …$
```

**De vaste vorm van de directives zet `Gevraagd:` op de regel direct ónder de kop. Lane
C zet er een witregel en een ``` -fence tussen.** Wie machinaal "de regel onder de kop"
leest, krijgt bij lane D het getal en bij lane C een leegte, en daarna een fence. Dat is
de hele storing, en zij is niet inhoudelijk: lane C's drie regels zijn woordelijk correct
en zijn getal (23 van de 54) klopt met zijn eigen tabel.

**Waarom lane C deze fout maakte, want het is een begrijpelijke.** De directives tónen
het sjabloon zélf binnen een codefence (`agents/directives.md`, onder "De
tekortverantwoording houdt de korte vaste vorm"). Die fence is de markdown-presentatie
van het sjabloon en geen onderdeel ervan. Lane C heeft het sjabloon inclusief zijn
verpakking overgenomen. Dat is een val die elke lane kan inlopen en lane D heeft hem
vandaag ontlopen.

**Correctie voor morgen, in twee regels:** haal de witregel en de twee fences weg, en
zet `Gevraagd:` op de eerste regel onder de kop. Verder niets.

**En ik liep dezelfde val vandaag zelf bijna in.** Om deze bevinding te tónen moest ik
lane C's blok citeren, en daarmee stond er twee keer een regel die met `## ` begint in
mijn eigen bestand — binnen een codefence, maar het bord leest koppen en geen fences.
Ik heb de geciteerde regels daarom van een `r.<nummer>`-prefix voorzien, zodat geen
enkele regel van dit bestand op kolom nul met `## ` begint behalve mijn eigen koppen.
**Dat is dezelfde klasse fout als lane C's, één niveau hoger: wie een vormfout citeert,
importeert hem.**

**En de tegenkant, want elke lane heeft vandaag één helft van deze vorm goed.** Lane D
zet de regels wel plat, maar schrijft het poortveld als `**(e) ledger — het bedrijf
stond er al**`, met de asterisken ín het veld dat de opzichter uitleest; een strikte
lezer krijgt daar `**(e)`. Lane C's kale `(e) ledger` is op dát punt de schonere vorm.
**Lane C: haal de fence weg. Lane D: haal de asterisken uit het poortveld.** Dan dragen
beide lanes hetzelfde machinaal leesbare blok en is deze storing voorbij.

---

## AFGEKEURD — twee van lane C's getallen zijn niet lane-gebonden en reproduceren daarom niet meer

Twee getallen in lane C's bestand meten over het hele ledger in plaats van over de eigen
lane. Vier lanes schrijven vandaag in hetzelfde bestand, dus die getallen zijn houdbaar
tot de volgende push en daarna niet meer:

| Lane C schrijft | Mijn uitkomst nu |
|---|---|
| `grep -c "2026-09-17" contacted.md` geeft **32** en niet 31 | **159** — alle vier de lanes samen |
| De naamindex geeft **2.905** vóór en **2.936** ná het wegschrijven, verschil 31 | **3.054** — de index van vier lanes |

**Waarom ik dit afkeur en niet wegwuif.** 1.55 bestaat zodat een lezer het getal kan
nalopen. Deze twee kan hij niet nalopen, en het is dezelfde klasse waarop ik lane D
gisteren afkeurde. Dat lane C's getallen op het moment van meten juist wáren, verandert
dat niet: een telling die alleen klopt voor wie erbij stond, is geen verankerde telling.

**Waarom de schade nul is en de reparatie één woord.** Beide getallen dienen bij lane C
een zelfcontrole, niet een bewering over de markt, en de controle die er werkelijk toe
doet — 31 nieuwe rijen — is lane-gebonden en reproduceert exact. Zet `lane C` in het
patroon en de zelfcontrole overleeft de dag: `grep -c "2026-09-17 lane C"` geeft 31, en
voor de "32" is het lane-gebonden equivalent de 31 nieuwe rijen plus de één bijgewerkte
rij, die lane C bij naam noemt (rij 5, van Graven) en die ik in het ledger heb
teruggevonden op r. 2871 met zijn `AANVULLING 2026-09`. **De bewering klopt dus; alleen
haar commando meet te breed.**

**De generieke regel eronder, en hij geldt voor alle vier de lanes:** een lane die een
gedeeld bestand telt, telt met haar eigen lane in het patroon. Zonder dat meet zij de
andere drie lanes mee en is haar getal morgen onwaar. Dit is de derde dag op rij dat een
lane hierop valt — gisteren lane D, vandaag lane C — en dat maakt het een vormprobleem
en geen slordigheid.

---

## AFGEKEURD — lane C schreef vandaag de omzettingsregel en paste hem niet toe op het enige dossier waar hij geld kostte

Dit is de zwaarste bevinding van mijn dienst en zij komt uit mijn eigen ronde.

**Wat lane C vandaag voorstelt**, als kandidaatregel met twee dragers: *een omzetting of
herinschrijving maakt een oude zaak jong en nooit andersom, dus een hoog KvK-nummer
vraagt altijd de over-onsronde en een laag nummer nooit.* Lane C onderbouwt hem met
Bram Schreven (KvK 89210689 naast een zaak die in 2011 begon) en met zijn eigen
Britcleaning-meting (KvK 82694915 uit 2021 náást KvK 18032241 met oprichting 02-10-1989,
op één vestigingsnummer). De regel is goed en ik onderschrijf hem.

**Wat lane C met zijn enige kaartrijpe dossier deed.** TVM Works B.V. (Dongen, rij 35)
draagt KvK **77786718** — een 2020-nummer, dus een hoog nummer — en lane C sluit daarop
de leeftijd af op "oprichting 02-04-2020, dus zes jaar en vijf maanden, op de rand van
het venster". Het legt die rand uitdrukkelijk aan mij voor in plaats van hem zelf naar
zich toe te trekken, en dat is de goede houding. **Maar de over-onsronde die zijn eigen
regel eist, is niet gedraaid.**

**Ik heb hem gedraaid.** De eigen zaakbeschrijving voert dat TVM Works begon "als een
hobby die uit de hand liep", dat MINI er vanaf **2000** bij kwam, en dat de eigenaar "na
ongeveer **elf jaar** een solide bedrijf met een uitgebreide klantenkring" heeft
opgebouwd. Toon van Meer is een ex-MINI-monteur die voor zichzelf begon. **KvK 77786718
uit 2020 is dus de B.V.-omzetting en niet de start van de zaak** — exact de vorm die lane
C's eigen kandidaatregel beschrijft, op lane C's eigen dossier.

**Wat dat verandert, en wat het uitdrukkelijk niet verandert.** De elfjaaraanwijzing
staat in de samenvattende alinea en is per 1.20(a) geen harde bron; ik boek daarom géén
`not fit - te lang gevestigd`. Wat ik boek is `leeftijd niet vastgesteld (omzetting)`
mét de aanwijzing erbij, want de asymmetrie is de hele regel: een hoog KvK-nummer kan
jeugd nooit bewíjzen, en 1.57 zegt dat de uitkomst bij tegenspraak nooit "binnen het
venster" is. **De rand van het venster is dus geen rand: de leeftijd is onbekend en
alles wat ernaast staat wijst naar buiten.**

**Waarom dit een afkeuring is en geen voetnoot.** Lane C's oordeel — geen kaart — blijft
overeind, maar het rustte op poort (a) en op het niet vastgestelde lek. Was poort (a)
vandaag gesloten, dan had lane C een kaart geschreven naar een zaak van ongeveer elf
jaar, met de handtekening van Alaa eronder, tegen een profiel dat grofweg één tot zes
jaar bejaagt. Dat is precies de kaart waarvan de directives zeggen dat zij de owner
meer kost dan een kaart die er niet is. **De regel die dat had voorkomen, stond die
ochtend in het eigen bestand, twee secties boven het dossier.**

**Correctie voor morgen, in één regel:** een hoog KvK-nummer is geen leeftijd maar een
opdracht — draai de over-onsronde vóór je poort (f) sluit, op je eigen dossier het
eerst.

Ledgerrij bijgewerkt per 1.24, geen tweede rij: status van `lead - poort open (a) + lek
niet vastgesteld` naar `lead - poort open (a) + leeftijd niet vastgesteld (omzetting) +
lek niet vastgesteld`, met de elfjaaraanwijzing, haar 1.20(a)-status en mijn twee eigen
rondes in het notitieveld. **Drie poorten staan daar open, niet één — en daarom gaat er
geen ronde meer in.** Lane C's weigering van de formulering "één ronde van een kaart af"
was goed en is nu nog beter onderbouwd dan lane C wist.

---

## GOEDGEKEURD — lane C's routemetingen, getoetst aan "eerst een meting op tien namen, dan pas dossiers"

De order van de directives is: een derde route mag, mits zij **eerst** een meting op tien
namen oplevert — leeftijd, adres, gedateerd spoor — en pas daarna dossiers vult. Drie
metingen langsgelopen:

| Meting | Vorm | Dossiers gevuld | Oordeel |
|---|---|---|---|
| `trimsalon-zoeken.nl` | **Tien namen bij naam genoemd**, met leeftijd 0/10, adres 3/10, gedateerd spoor 0/10 | Ja, ná de meting | **Precies de opgedragen vorm.** De enige meting die de tienname-eis nodig had, en zij haalt haar |
| `glazenwasserkeurmerk.nl` | Twee ronden, vier ontbrekende velden benoemd | Nul | Toegestaan: de tienname-eis is een voorwaarde om dóssiers te vullen, en wie er nul vult heeft haar niet nodig |
| `WebFetch` op `tvmworks.nl/contact/` | Eén ronde, `EGRESS_BLOCKED` | n.v.t. | Een poort-(a)-routemeting, niet een jaagroute — de tienname-eis raakt haar niet |

Ik heb de tien namen geteld: Anique, Vachtissimo, van kop tot staart, Achterom, Het
Hondje, Freule, Does, Trimsalabim, Trim All-In, Woef & zo. **Tien.** En de meting noemt
de nullen (0/10 op leeftijd, 0/10 op gedateerd spoor) en niet alleen de drie adressen
die zij wél gaf. Dat is de zeldzame vorm: een lane die zijn eigen route afwaardeert op
de velden die zij mist.

**Twee correcties, allebei op de verpakking en niet op het werk.**

De kop van de keurmerkbevinding zegt *"afgekeurd vóór zij één dossier raakte"*, en de
alinea eronder zegt eerlijk dat de route twee namen opleverde waarvan één (W.G. van
Graven) als rij 5 in het bestand staat. Nul **nieuwe** dossiers is waar; "geen dossier
geraakt" is het niet. De kop overdrijft wat de alinea correct meldt.

En de commit-boodschap zegt `drie routemetingen`, terwijl de Uitvoeringstabel van het
bestand zelf `Twee routes gemeten` schrijft. Drie metingen zijn er wel — de derde is de
`EGRESS_BLOCKED`-meting — maar niet drie *routemetingen* in de zin van de order. **De
opzichter leest de commit-boodschap, dus daar hoort het getal van het bestand te staan.**

---

## GOEDGEKEURD — lane D's tellingen en partitie reproduceren exact, en de correcties van 16-09 zijn allebei uitgevoerd

```
$ grep -c "2026-09-17 lane D" contacted.md                                       → 44  (lane D: 44) ✓
$ grep "2026-09-17 lane D" contacted.md | grep -ci "transfirm"                   → 11  (lane D: 11) ✓
$ grep -cE '^\|.*\| D \| 2026-09-17 \|$' geen-emailadres.md                      → 12  (kop: twaalf) ✓
$ grep -cE '^\|.*GEEN-WEBSITEGROEP.*\| D \| 2026-09-17 \|$' geen-emailadres.md   → 8   (lane D: acht) ✓
```

De sectortabel sluit aan twee kanten: nieuw 16 + 19 + 6 + 3 = 44, poort (e) 16 + 15 + 1
+ 0 = 32, samen 76. De tekorttabel partitioneert 1 t/m 76 exact — acht gronden,
32 + 22 + 12 + 3 + 3 + 2 + 1 + 1 = 76, geen gat, geen dubbel, elk opgegeven aantal gelijk
aan de lengte van zijn eigen reeks. Nagerekend met een eigen script, niet op het oog.

**De twee correcties van gisteren, allebei nagelopen.**

*De leeftijdspoort heet (f).* Lane D's tekortblok schrijft `Poort (f) — leeftijd
aantoonbaar buiten het venster`, en de bindende regel erboven schrijft `(e) ledger`.
Beide correct. De verschrijving van gisteren — "(c) leeftijd", waar (c) de
reviewclaimpoort is — komt niet terug. **Uitgevoerd.**

*Elk getal aan een commando verankerd.* Lane D schrijft dat bovenaan als belofte en
lost hem in. Het mooiste voorbeeld is een correctie op zichzelf: lane D had "26 van de
44" op het kladblok, draaide het commando, kreeg **11**, en heeft het eigen getal
weggegooid in plaats van zijn conclusie te sparen — mét de uitleg waarom TransFirm toch
de hoofdroute was (hij leverde de námen; het oordeel sloot vaak op een andere bron, en
dan staat díé bron in de rij). Dat is 1.45 in de letter en het is het soort zelfcorrectie
dat een lezer vertrouwen geeft in de andere drieënveertig rijen. **Uitgevoerd.**

**En het bestemmingsbestand is bij lane D volledig in orde**, wat vorige week twee keer
niet zo was: de kop zegt *twaalf zaken, waarvan acht uit de geen-websitegroep*, er staan
twaalf rijen, en er staan **twee** telcommando's onder — één voor de twaalf en één voor
de acht. Elke kop dekt zijn eigen rijen en beide aantallen zijn machinaal te halen. Dat
is de vorm waarop ik lane C op 16-09 nog moest corrigeren.

---

## AFGEKEURD — lane D's `beats.md`-telling reproduceert niet meer, en de uitkomst staat nu óp de cap in plaats van eronder

Lane D schrijft: *"`grep "| drafted |" contacted.md | grep -cE "2026-09-1[1-7]"` geeft
**2** over alle vier de lanes samen … onder de cap van drie."*

```
$ grep "| drafted |" contacted.md | grep -cE "2026-09-1[1-7]"   → 3
```

De derde is **Glasbewassing de Hondsrug, Emmen (DR), 2026-09-17 lane A** — een kaart die
lane A ná lane D's meting heeft gepusht. Zelfde oorzaak als bij lane C hierboven: een
commando dat over alle vier de lanes meet, in een bestand waarin vier lanes dezelfde
ochtend schrijven.

**Wat het verschil is met lane C's geval, en waarom dit zwaarder weegt.** Bij lane C
diende het brede getal een zelfcontrole. Hier draagt het een **conclusie over een
staande order**: "onder de cap van drie". Met drie staat de uitkomst óp de cap en niet
eronder, en dat is een ander antwoord op de vraag die de order stelt.

**Wat de conclusie van lane D overeind houdt, en ik zeg het erbij omdat het eerlijk is.**
De regel van `beats.md` gaat over een **sector**, niet over een totaal, en het
sectorgebonden getal is onveranderd:

```
$ grep "| drafted |" contacted.md | grep -E "2026-09-1[1-7]" | grep -ci "Sector: hondentrimsalon"   → 2
```

Lane A's kaart is een glazenwasser en raakt de hondensectorcap niet. **De uitkomst
"geen botsing" blijft dus juist; het getal dat lane D ernaast zet, is het verkeerde
getal.** Correctie voor morgen: tel de cap op de sector waar de regel over gaat, niet op
het totaal — dan is het getal bovendien immuun voor wat de andere drie lanes die
ochtend nog pushen.

---

## AFGEKEURD — lane D schrijft "acht rijen" waar zijn eigen bestemmingsbestand twaalf voert

In de Uitvoeringstabel staat bij de order over de lane- en datumkolom: *"Uitgevoerd,
**acht rijen** in de kolomvorm van 16-09, met het telcommando eronder."*

Er staan **twaalf** rijen in de kolomvorm. De acht zijn de geen-websitegroep; de andere
vier (Glamour Pets, DGV, Intens, Nagelsalon Angela) vielen óók op poort (b) en staan er
met dezelfde kolommen bij. Lane D's eigen tekorttabel telt poort (b) correct op twaalf,
en het bestemmingsbestand voert twaalf met de kop en het commando erbij.

**Dit is dus geen dubbeltelling en geen verzinsel, maar een onderschatting van het eigen
werk op de ene plek waar de order wordt afgevinkt.** Wie de Uitvoeringstabel leest om te
controleren of de order is uitgevoerd, krijgt acht en vindt twaalf. De order ging over
álle rijen, niet over de geen-websitegroep.

Correctie: `twaalf rijen, waarvan acht uit de geen-websitegroep` — woordelijk wat de kop
in het bestemmingsbestand al zegt. De rest van het werk is in orde.

---

## GOEDGEKEURD — de vier dossiers op poort (a) zijn compleet gedraaid, en mijn eigen ronde sluit er geen

Vier dossiers staan vandaag op poort (a) open: TVM Works (lane C, rij 35), en
RC Glazenwasserij, 't Trimhuisje en Amstelgroen (lane D, rijen 33, 2 en 67). De order
vraagt of de vijf toegewezen bewijssoorten en de insolventieronde daadwerkelijk zijn
gedraaid en genoteerd. Nagelopen, per dossier:

| Dossier | Vijf bewijssoorten | Insolventieronde (1.40a) |
|---|---|---|
| TVM Works, Dongen | **Ja**, tabel met één regel per route. KvK-mutatie 02-04-2020 (oprichting zelf), nul vergunningen, nul inspecties, SBB-erkenning 22-02-2024 (buiten de twaalf maanden), levende vacature zonder plaatsingsdatum | **Ja**, KvK 77786718, schoon |
| RC Glazenwasserij, Hoogvliet | **Ja**, vijf genummerde regels mét de zoekopdracht per route | **Ja**, KvK 84792825, schoon |
| 't Trimhuisje, Zoetermeer | **Ja**, vijf genummerde regels. De omgevingsvergunning Industrieweg 4 van 22-06-2021 is correct afgewezen: dat is de daad van de pandeigenaar en niet van de salon | **Ja**, KvK 77906624, schoon |
| Amstelgroen, Amstelveen | **Ja**, vijf genummerde regels, met een contrastmeting: dezelfde vorm gaf bij Jaarrond Tuinen wél twee SBB-treffers, dus de route werkt in deze sector en ontbreekt bij dít bedrijf | **Ja**, KvK 81067518, schoon |

**Alle vier compleet.** Dit is de order waarop lane C op 15-09 nog viel (Poseidon
SoftWash, vijf routes niet gedraaid) en zij staat nu twee diensten op rij goed bij beide
lanes. Twee dingen die ik erbij aanteken omdat zij méér zijn dan afvinken: lane D wijst
bij vijf vacaturetreffers de **bankdatum** af per 1.48 in plaats van haar te gebruiken,
en de contrastmeting bij Amstelgroen is het bewijs dat een lege route leeg is en niet
verkeerd gezocht.

**Mijn eigen ronde, en zij sluit er geen.** Ik heb op alle vier de nieuwe datumroute van
vandaag gedraaid, plus twee gerichte ronden:

| Ronde | Uitkomst |
|---|---|
| LinkedIn-postroute, TVM Works | **Nul post-URL's.** Facebook-profiel, X-profiel, 123auto, eigen site, een adviseurs-klantpagina — geen enkele post-URL |
| LinkedIn-postroute, Amstelgroen | **Nul post-URL's.** Alleen gids- en keurmerkpagina's (hovenier.nl, TuinKeur, HovenierNederland, Trustoo, Werkspot) |
| LinkedIn-postroute, 't Trimhuisje | **Nul post-URL's.** Instagram- en Facebook-**profiel**, doggo, openingstijden, telefoonboek — geen post |
| X/Twitter als vierde platform, TVM Works | Het account `x.com/tvmworks` bestaat en geeft **nul post-URL's** in de bruikbare laag |
| RC Glazenwasserij, gerichte ronde op een nieuwere post | Dezelfde ene post-URL van 08-02-2024 en verder alleen profielpagina's van andere glazenwasserijen |
| TVM Works, gerichte ronde op de vacaturedatum | Geen plaatsingsdatum in de bruikbare laag. Zie hieronder |

**Nul van vier gesloten, en dat maakt het oordeel van beide lanes juist.** Ik heb er zes
ronden in gestoken en er geen enkele poort mee gesloten; de lanes hadden er al dertien
tot achttien in gezeten. Dat is de derde sessie op rij die vaststelt dat extra ronden dit
niet repareren, en het is de meting die het beslispunt van de owner over het netwerkbeleid
draagt.

**Eén vondst die het oordeel over TVM Works scherper maakt dan lane C het gaf.** Lane C
schrijft dat de vacatureroute "faalt op één ontbrekend veld" en dat het "scheelde om één
datum". Mijn ronde geeft geen plaatsingsdatum in de bruikbare laag — maar de
samenvattende alinea biedt er één aan, **06-10-2024**, en die is drieëntwintig maanden
oud. Ik gebruik dat getal niet als bron; 1.20(a) verbiedt het en ik boek het niet. Wat
het wel doet, is de richting wijzen: **als het veld leesbaar wás, zou de route op de
recentheid vallen en niet op de afwezigheid.** Het scheelde dus niet om één datum. Dat
is dezelfde vorm die de LinkedIn-route hieronder laat zien, en het is een aangenamere
uitkomst dan hij lijkt — want een dossier dat op recentheid valt, is af, en een dossier
dat op afwezigheid valt, blijft ronden vragen.

---

## GOEDGEKEURD — de LinkedIn-ID-datumroute, gewogen tegen 1.38, 1.56 en 1.59: zij sluit vandaag geen kaart, en zij verandert wél wat een poort-(a)-afwijzing betekent

Dit is de vraag van de dag. Lane D en lane B hebben vanochtend onafhankelijk dezelfde
route gevonden. Mijn antwoord in één regel: **nee, zij kan vandaag geen kaart sluiten,
en dat is niet de belangrijkste helft van het antwoord.**

### Wat ik zelf heb nagerekend, vóór ik de conclusies van de lanes las

Acht decoderingen, `unixtijd_in_ms = id >> 22`, met een eigen script:

| activity-ID | Mijn uitkomst | Wat de lane zegt | |
|---|---|---|---|
| `7405535688051347456` | 2025-12-13 | 1.56's eigen ijkdrager: 13 dec 2025 | ✓ |
| `7161317622083432448` | 2024-02-08 | lane D, RC Glazenwasserij: 8 feb 2024 | ✓ |
| `7087171262992510976` | 2023-07-18 | lane B, Rob Grobben: 18-07-2023 | ✓ |
| `7145359777055797248` | 2023-12-26 | lane B, `techzine-nl_terugblik-2023` | ✓ |
| `7137421920236367873` | 2023-12-04 | lane B, `afsluiting-van-2023` | ✓ |
| `7155131047360233472` | 2024-01-22 | lane B, `terugblik-op` | ✓ |
| `7072612908827860992` | 2023-06-08 | lane B, `terugblik-nl-ai-congres-2023` | ✓ |
| `7480883538444136448` | 2026-07-09 | lane B, slug zegt 2026 | ✓ |

**Acht van acht, tot op de dag.** En de schuifcontrole die lane B
bedacht, gereproduceerd op mijn eigen drie dragers in plaats van op zijn negen: schuif
21 geeft 2077–2081, schuif 23 geeft 1996–1997. Lane B kreeg 2072–2076 en 1995–1996 op
zijn eigen set. **De getallen verschillen omdat de dragers verschillen; de conclusie is
identiek en zij houdt op een derde set stand — 22 is de enige schuif die binnen het
bestaan van LinkedIn valt.** Daarmee staat de decodeerregel op zestien geijkte
decoderingen over drie platforms en vier sessies. **De decodering is geen open vraag
meer.**

### De onafhankelijkheid: de ene helft klopt, de andere kan een lezer niet nalopen

Lane D voert commit `c51feab` op 05:12:51 en zijn eigen commit `2d10324` op 05:17:38.
Beide tijdstippen kloppen exact — het zijn de *committer*-datums, `git log --format='%cd'`
geeft 05:12:51 en 05:17:38. Maar `git cat-file -t 2d10324` geeft *Not a valid object
name*: lane D's eigen rebase heeft die commit herschreven naar `0f36252`. **Lane D noemt
de rebase zelf als de gebeurtenis die de twee lanes bij elkaar bracht, dus dit is
zelf-consistent — maar de helft van zijn bewijs is voor een lezer niet meer te checken.**

**En dat is de minst belangrijke helft.** Commit-volgorde kan hoogstens aantonen wie
eerst pushte, nooit dat de één de ander niet las. Wat de onafhankelijkheid werkelijk
draagt, is dat de twee bewijssoorten **verschillend van aard zijn en elkaars gat
vullen**, en dat is aan de inhoud te zien zonder één timestamp:

| | Lane D | Lane B |
|---|---|---|
| Decoder geijkt op | 1.56's eigen drager (positief) | Een schuifcontrole die 21 en 23 uitsluit (negatief) |
| Semantische bevestiging (rem 1 van 1.38) | Niet getoetst — de slug draagt geen datum | **Vijf keer**, uit vijf accounts |
| Jaagroute? | Niet gemeten | **Gemeten en negatief** — drie ronden, nul post-URL's |
| Waarom de route bestaat waar Instagram faalt | **Vier negatieve controles** op drie eigen dossiers, óók voor een groot account | Zelfde conclusie van de andere kant |

Een positieve ijking naast een negatieve schuifcontrole, en vier negatieve controles
naast vijf semantische bevestigingen. **Dat is niet te fabriceren door af te kijken, en
het is de reden dat ik deze convergentie zwaarder weeg dan haar twee dragers.**

### Waar de route breekt, en het is niet waar 1.59 zegt

1.59 — mijn eigen regel van gisteren — zegt: *voor een klein account levert de zoekindex
geen post-URL's*, en verklaart de nuluitkomst uit **accountomvang**. Lane D weerlegt die
verklaring met een meting die ik niet kan wegwuiven: **Glamour Pets is geen klein
account** — een VVTN-erkende salon met 139 posts — en levert over drie ronden evengoed
nul Instagram-post-URL's. Lane D zet er correct géén volgersaantal bij, want de 12K die
het zag stond in de samenvattende alinea; wat het hard heeft is de nuluitkomst zelf.

En mijn eigen ronde staaft het van de andere kant: **nul post-URL's op vier platforms —
Instagram, Facebook, LinkedIn en X — op drie dossiers, in een derde sessie.**

**Dus: het verschijnsel is platformgebonden en niet omvanggebonden.** Dat is een
aanscherping van 1.59 en geen weerlegging — de regel dat de route niet aanvoert, staat er
alleen steviger door, en de verklaring eronder moet weg. De enige plek waar de route wél
aanvoert is LinkedIn, en juist voor het bedrijfstype dat het profiel van 24 augustus
definieert: RC Glazenwasserij is een eenmanszaak met 237 Facebook-likes en een
`wordpress.com`-subdomein, en dáárvan kwam een post-URL mét activity-ID en mét de handle
in het pad — de binding die 1.40(e) eist, in de vorm die 1.40(e) voorschrijft.

### Kan zij een kaart sluiten? Nee, en de grond is een mechanisme en geen pech

Twee dragers voor ons profiel, en **beide vallen buiten het venster van twaalf maanden**:
RC op 08-02-2024, Rob Grobben op 18-07-2023. Lane D noemt dat "één trekking en geen
eigenschap van de route". Ik denk dat het wél een eigenschap is, en 1.38 heeft het
mechanisme zelf al opgeschreven: *de zoekindex geeft de best gelinkte post terug en dat
is zelden de nieuwste.* Een eenmanszaak post zelden; haar best gelinkte post is haar
oudste-en-meest-gelinkte, niet haar nieuwste. **De route levert dus systematisch de
verkeerde post voor het doel waarvoor poort (a) haar nodig heeft.**

Daar komt de tweede-orde-rem bovenop die beide lanes uit zichzelf opschreven: de route
selecteert op bedrijven mét LinkedIn, en dat is een andere populatie dan de ICP.
Bewijsroute, geen profielbepaling. Ik onderschrijf die rem onverkort.

**Het antwoord op de vraag van de dag, in drie regels.** Zij kan geen kaart sluiten: nul
van vier vandaag, ook niet in mijn eigen ronde, en de twee dragers die er zijn vallen
buiten het venster om een reden die zich zal herhalen. Zij is wél een aanvoerroute waar
Instagram en TikTok dat niet zijn, en dat is de eerste keer in acht diensten dat poort
(a) een route ís. **En haar werkelijke opbrengst is dat zij de bételekenis van een
afwijzing verandert: van "niets gevonden" naar "gevonden, te oud".** Lane B formuleert
dat scherper dan ik het had: poort (a) valt daar op de **recentheid** en niet op de
**afwezigheid**. Dat verschil is geen semantiek — het is het verschil tussen een dossier
dat af is en een dossier dat elke dienst opnieuw ronden vraagt. Precies diezelfde vorm
zag ik vandaag bij TVM Works' vacatureroute, uit een heel andere hoek.

### Wat ik daarom opdraag, en wat ik níét opdraag

**Wel:** één ronde LinkedIn-postroute op elk dossier dat poort (a) bereikt, en noteer de
gedecodeerde datum **ook** als hij buiten het venster valt. De kosten zijn eenzijdig —
één zoekopdracht kan geen goede kaart doden — en de opbrengst is dat het dossier af is
in plaats van open.

**Niet:** een jaagroute. Lane B heeft dat gemeten en negatief bevonden; lane D heeft er
geen dossier mee gevuld. Beide correct.

**En niet: het laatste nummer van mijn reeks.** Zie hieronder. Deze regel gaat met volle
dragers naar het weekrapport, en de grond is een coördinatiegrond: de helft van haar
bewijs is lane B's en ligt vandaag bij de A+B-verificatie. Het laatste C+D-nummer
besteden aan een regel waarvan een andere sessie de andere helft weegt, is niet mijn
nummer om te besteden.

---

## GOEDGEKEURD — poort (h): achtendertig citaten over achtentwintig regelnummers, alle achtendertig exact

Eerst de telling, met het commando, want ik houd mij aan de eis die ik vandaag twee keer
op de lanes toepas:

```
$ grep -oE '(SKILL|local-prospecting)\.md:[0-9]+' 2026-09-17-c.md | wc -l   → 16
$ grep -oE 'SKILL\.md:[0-9]+|`:[0-9]+`'           2026-09-17-d.md | wc -l   → 22
```

**Achtendertig citaatinstanties**, die door de tien overlappingen tussen de twee lanes op
**achtentwintig unieke (bestand, regelnummer)-paren** neerkomen. Ik heb alle achtentwintig
paren met `sed -n '<n>p'` van schijf gehaald en letterlijk vergeleken met wat de lane
citeert. **Alle achtendertig citaten kloppen op het opgegeven regelnummer.** Geen enkel
citaat te ruim, geen enkel regelnummer verschoven, geen enkel `$N`-vervuild fragment.
Waar een lane maar een deel van een regel citeert (`cold-email:37` en `:41`,
`marketing-psychology:86` en `:127` lopen door na het citaat), is het geciteerde deel
woordelijk juist en op een zinsgrens afgebroken — dat is eerlijk deelciteren en geen te
ruim citaat. De eis van de directives — een citaat zonder `grep -n`-regelnummer telt niet
als voorbeeld — is bij beide lanes gehaald op elk citaat.

Lane C: `prospecting` 61, 68, 200 · `prospecting/references/local-prospecting.md` 13 ·
`cold-email` 37, 41, 91 · `marketing-psychology` 46, 61, 66, 86, 416 · `copy-editing`
20, 119, 137, 182.
Lane D: `prospecting` 56, 68, 200 · `cold-email` 37, 41, 91, 93 ·
`marketing-psychology` 35, 36, 45, 46, 65, 66, 85, 86, 126, 127, 415, 416 ·
`copy-editing` 94, 95, 182.

**De aanroepvorm van 1.44, nagemeten met `grep -oE '\$[0-9]+' <skill>/SKILL.md | sort -u`:**

| Skill | `$N`-dragers | Argument toegestaan | Lane C | Lane D |
|---|---|---|---|---|
| `marketing-psychology` | 13 | **nee** | zonder ✓ | zonder ✓ |
| `prospecting` · `cold-email` · `copy-editing` · `competitor-profiling` | geen | ja | zonder ✓ | zonder ✓ |
| `offers` | 5 | nee | n.v.t. | n.v.t. |
| `customer-research` | 2 | nee | n.v.t. | n.v.t. |

**Lane C's correctie van gisteren is uitgevoerd en ruimer dan ik hem gaf.** Ik droeg op:
`marketing-psychology` zonder argument. Lane C heeft alle vier de skills zonder argument
aangeroepen en zet er een eigen herkomstregel boven de tabel bij die dat vastlegt. Dat
is het goede antwoord op een correctie: niet het ene geval repareren maar de klasse.

**Lane C's tweede drager onder mijn eigen 1.44-correctie, nagemeten:**
`grep -oE '\$[0-9]+' competitor-profiling/SKILL.md` geeft **nul** regels, terwijl
dezelfde opdracht op `customer-research/SKILL.md` `$50` en `$5` geeft. Lane C heeft
gelijk: `competitor-profiling` hoort in de nulgroep en een argument was daar toegestaan.
Dat lane C hem alsnog argumentloos liet omdat het niets kost, is de juiste afweging.

**En een vijfde reproductie van 1.44, van mijzelf.** Mijn eigen argumentloze aanroep van
`marketing-psychology` gaf `The jump from $1 to $0 is bigger than $2 to $1` binnen, met
`$99`, `$100`, `$497`, `$500`, `$80`, `$16`, `$50` en `$30` alle intact. De meting staat
daarmee op vijf sessies en 1.44 is geen open vraag meer.

**Beide tabellen zijn vol en geen van beide is hol.** Lane C draagt vier gebruikte skills
en vier met de grond waarom niet; lane D vijf en vier. De "niet gebruikt"-rijen zijn de
eerlijke soort: lane C noteert bij `customer-research` zelfs een gemis van zichzelf
("zodra er weer een dossier op poort (a) sluit, hoort deze skill vóór de hoekkeuze te
draaien"). **Poort (h) gehaald door beide lanes.**

---

## GOEDGEKEURD — poort (g): lane D's vijf onderwerpregels, en één ervan haalt de poort zonder dat lane D het merkte

Er is geen kaart, dus er is geen onderwerpregel die verstuurd wordt. Maar lane D heeft
vijf kandidaatregels geschreven en vier zelf gedood, en dat is het enige copywerk van de
dienst. Ik heb ze door `cold-email` en `marketing-psychology` gehaald en met
`LC_ALL=C.UTF-8 wc -m` gemeten.

| Kandidaat | kaal | C.UTF-8 | Mijn oordeel |
|---|---|---|---|
| `Nieuwe Wetering, en dan wordpress.com` | 37 | 37 | **Terecht gedood.** Een technische waarneming over zijn adres — de fout die de owner op 25-08 bij naam verbood |
| `Sinds 2022 eigen zaak, geen eigen adres` | 39 | 39 | **Terecht gedood.** Zegt de eigenaar wat hij mist; op de swipe-test om 21:40 is dat dood |
| `Uw 8,8 staat op een pagina van een ander` | 40 | 40 | **Terecht gedood, en om de goede reden — maar het oordeel eronder is te hard** |
| `Drie zussen, één telefoon, zes dagen` | 38 | **36** | **Deze haalt poort (g).** Zie hieronder |

Alle vier de metingen reproduceren exact, en de vijfde regel reproduceert 1.51 zelf: 38
kaal tegen 36 onder `C.UTF-8`, twee tekens verschil door één `é`. **In mijn shell telt de
kale `wc -m` bytes** — precies wat 1.51 vastlegt en wat 1.40(f) zonder locale niet
dichtte. Vijfde drager, en hij is van lane D.

**Waarom ik lane D's derde oordeel te hard vind, en dit is de bruikbaarste regel die ik
vandaag voor Sam schrijf.** `Uw 8,8 staat op een pagina van een ander` is niet een
slechte regel. Het is bijna woordelijk het patroon dat de owner op 24 augustus als *goed*
opschreef ("Wat uw klanten op Google over u schrijven, staat nergens op uw site"): hún
eigen bewijs, hún eigen getal, geen verkooplucht, nieuwsgierigheid binnen 45 tekens.
Lane D heeft hem gedood omdat de 8,8 alleen in de samenvattende alinea van Trustoo stond,
en dát is onvermijdelijk juist — per 1.30 gaat elk getal in een onderwerpregel langs
dezelfde controle als een prijs, en mijn eigen ronde vond de 8,8 vandaag opnieuw
uitsluitend in de samenvattende alinea. **Maar de conclusie is niet "deze regel is fout",
zij is "deze regel is de juiste vorm en stierf op één onverifieerbaar cijfer".** Dat is
een heel ander bericht voor morgen: niet *schrijf dit soort regel niet*, maar *krijg het
cijfer in de bruikbare laag en de regel leeft*.

**En de regel die lane D niet als kandidaat aanbood.** `Drie zussen, één telefoon, zes
dagen` staat in het bestand alleen als tekenmeting. Getoetst aan poort (g) haalt hij
hem: 36 tekens, het gecheckte detail staat in de eerste 45, geen "ZEVREN" en geen
"website", geen schaarste, geen superlatief, en het is een detail dat op geen enkel
ander bedrijf past — drie zussen die samen één salon draaien, zes dagen open. Op de
swipe-test overleeft hij, want hij is nieuwsgierig zonder iets te verkopen.
`cold-email/SKILL.md:118` — `- Would YOU reply to this if you received it?` — geeft
daar ja. **Lane D heeft een regel geschreven die de poort haalt en heeft het niet
gemerkt, omdat het dossier eronder op poort (a) viel.** Dat is geen fout; het is een
aanwijzing dat de onderwerpregels van deze lane beter zijn dan het aantal kaarten
suggereert, en het hoort in het weekrapport naast de nul.

**Voor lane C is er geen poort (g) te toetsen**, en dat is correct: geen kaart, dus geen
onderwerpregel, dus `wc -m` niet van toepassing. Lane C schrijft dat ook zo in zijn
Uitvoeringstabel. Dat is beter dan een regel schrijven om de tabel te vullen.

---

## Wat ik in het fundament vastleg — 1.60, en daarmee is de C+D-reeks vol

De reeks 1.51 t/m 1.60 stond na gisteren op 1.59. Ik neem het laatste nummer, en ik
neem het **niet** voor de LinkedIn-route.

**1.60 — de over-onsronde stelt vast wíens jaartal een jaartal is, vóór enig jaartal de
leeftijd draagt.** Bij "Wiens daad draagt de datum", direct onder 1.59, en als
uitbreiding op 1.43/1.57.

> Een jaartal naast een bedrijfsnaam kan drie dingen zijn en maar één ervan is de
> leeftijd van de zaak: het **startjaar van de zaak**, het **loopbaanjaar van de
> eigenaar**, of het jaar van een **omzetting of herinschrijving**. Een registergetal
> voert het derde, een over-onspagina vaak het tweede. Daarom: een hoog KvK-nummer is
> geen leeftijd maar een **opdracht** — draai de over-onsronde vóór je poort (f) sluit,
> en lees in die ronde uitdrukkelijk wíens jaar er staat. Valt het jaartal buiten het
> venster en het registergetal erbinnen, dan is de leeftijd **niet vastgesteld** en per
> 1.57 nooit "binnen het venster". Een omzetting maakt een oude zaak jong en nooit
> andersom; een loopbaanjaar maakt een jonge zaak oud en nooit andersom.

**Dragers: twee, allebei van vandaag, en zij vallen naar tegengestelde kanten.** Dat is
wat de regel draagt, want een asymmetrie die maar één kant op is gemeten, is een
vermoeden.

1. **TVM Works B.V., Dongen (lane C, rij 35).** KvK 77786718 (2020) → zes jaar en vijf
   maanden, binnen het venster. Eigen zaakbeschrijving: "na ongeveer elf jaar een
   solide bedrijf", MINI vanaf 2000, ex-MINI-monteur. **Het registergetal is de
   omzetting; de zaak is ongeveer elf jaar.** Zonder de over-onsronde stond deze zaak
   op de rand van het venster in plaats van erbuiten.
2. **RC Glazenwasserij & Schoonmaak, Hoogvliet (lane D, rij 33).** Eigen zaakpagina:
   najaar 2014 het glazenwassen ontdekt, **zeven jaar in dienstverband**, per
   **01-01-2022** voor zichzelf begonnen. KvK 84792825 + vestigingsnummer 000050888730
   → 2021/22. **Het registergetal is hier juist en "sinds 2014" is het loopbaanjaar.**
   Wie 2014 overneemt, keurt een zaak van vier jaar en acht maanden af op twaalf jaar.

**Waarom dit nummer hieraan en niet aan de LinkedIn-route.** Twee gronden, en de eerste
is de duurste. **(1)** Wat kost het meest als het tot zondag ongeschreven blijft? De
LinkedIn-regel ongeschreven kost een paar gedateerde sporen die tot nu toe alle twee
buiten het venster vielen. Deze regel ongeschreven kostte vandaag bijna een kaart aan
een elfjarige garage met de naam van Alaa eronder — en het bewijs dat dat kan gebeuren
is dat lane C de regel zélf voorstelde en hem twee secties later niet toepaste. Een
regel die een lane uit zichzelf bedenkt maar niet uitvoert, hoort genummerd te worden;
dat is het verschil tussen een inzicht en een instructie. **(2)** De helft van het
LinkedIn-bewijs is lane B's en ligt vandaag bij de A+B-verificatie. Het laatste
C+D-nummer besteden aan een regel waarvan een andere sessie de andere helft weegt, is
niet mijn nummer om te besteden.

Ik werk `.agents/product-marketing.md` bij naar **1.60** met een changelogregel, zoals
de eigendomsregel van `agents/skills-toewijzing.md` voorschrijft. **De reeks is daarmee
vol en de vaste vorm geldt: alles wat hierna komt, gaat naar `## Voor het weekrapport`
met tekst, aantal dragers en de dragers zelf.**

---

## Voor het weekrapport

Kandidaten met dragers, in de vaste vorm, zodat geen meting verdampt omdat mijn reeks vol
is.

| Kandidaatregel | Dragers | De dragers zelf |
|---|---|---|
| **De LinkedIn-activity-URL is een aanvoerroute waar Instagram en TikTok dat niet zijn, en het verschijnsel van 1.59 is PLATFORMGEBONDEN en niet omvanggebonden. Draai één ronde op elk dossier dat poort (a) bereikt en noteer de gedecodeerde datum óók als hij buiten het venster valt. Nooit een jaagroute.** Bevat een correctie op mijn eigen 1.59: de verklaring uit accountomvang moet eruit | **Twee lanes onafhankelijk, plus mijn eigen derde sessie.** 16 geijkte decoderingen, 8 door mij nagerekend; 4+4 negatieve controles; 1 jaagroutemeting, negatief | Lane D: `rc-glazenwasserij-schoonmaak_...activity-7161317622083432448` → 08-02-2024, handle in het pad (1.40e); nul Instagram/Facebook-post-URL's voor Glamour Pets (3 ronden, **139 posts, dus geen klein account**), RC (4), 't Trimhuisje (2), generiek (1). Lane B: vijf semantische bevestigingen uit vijf accounts, schuifcontrole die 21 en 23 uitsluit, `site:linkedin.com/posts <sector> <provincie>` in drie ronden → nul post-URL's, `hoveniersbedrijf-rob-grobben_...activity-7087171262992510976` → 18-07-2023. **Ik**: nul post-URL's op vier platforms (Instagram, Facebook, LinkedIn, **X**) op TVM Works, Amstelgroen en 't Trimhuisje; schuifcontrole gereproduceerd op een derde dragerset (21 → 2077–2081, 23 → 1996–1997) |
| **Een lane die N nieuwe ledgerrijen wegschrijft, telt de naamindex vóór en ná en legt het verschil tegen N.** Het is de enige controle die een gemiste ledgertreffer kán vangen, want de ledgerronde zelf kan hem per definitie niet zien. **Mijn toevoeging: tel lane-gebonden, anders meet je de andere drie lanes mee** | 1, met de fout en de vangst allebei van vandaag | Lane C's dubbele rij voor W.G. van Graven, Heerlen: `grep -ih "Graven" … \| head -1` gaf `'s-Gravenpolder` als eerste treffer en verborg de rij van 16-09 van deze lane zelf. Gevangen door 2.936 − 2.905 = 31 tegenover 32 weggeschreven rijen, aangewezen met `comm -12`, gerepareerd per 1.24. Ik heb de gerepareerde rij teruggevonden op `contacted.md:2871` |
| **Een lane die een gedeeld bestand telt, zet haar eigen lane in het patroon.** Zonder dat meet zij de andere drie lanes mee en is haar getal na de volgende push onwaar — ook als het op het moment van meten juist was | **3, drie dagen op rij, twee lanes** | Lane D 16-09 (`bellijst.md` 2 tegen 3, `geen-emailadres.md` 7 tegen 6, beide zelfverwijzend); lane C vandaag (`grep -c "2026-09-17"` 32 tegen **159**; naamindex 2.936 tegen **3.054**); lane D vandaag (`grep -c` op `drafted` 2 tegen **3**, met een conclusie over een staande order eraan vast). Alle drie gemeten door mij in de sessie erna |
| **Poort (e) als uitputtingsmaat van een lane-regio**, niet als inzetmaat. Lane D noemt hem zelf en schuift hem zelf door; ik onderschrijf de doorschuiving en teken de tweede lane erbij aan | 2 lanes, 1 dienst | Lane D: 32 van 76 stonden al in het ledger, en de zestien hondensalons van rijen 17–32 zijn alle zestien door lane D zélf tussen 02-09 en 16-09 beoordeeld (telcommando in het bestand, uitkomst 16). Lane C: 23 van 54, waarvan tweeëntwintig namen die deze lane zelf al had afgewezen. **Twee lanes, twee regio's, dezelfde ochtend, bijna twee op de vijf** |
| **De garagesector velt aan de BOVENKANT van het venster, omdat starten er kapitaal kost.** Relevant voor het sectorplan, want dit is de sector met de sterkste bestemming (`/website-voor/garages` met werkende kentekencheck-demo) | 8, plus mijn correctie op de negende | Lane C's acht garagedossiers: 3 merkdealers buiten ICP, 3 op (f) (1968 · 17-reeks · 06-12-2018), 1 (f) open, 1 "op de rand". **Mijn correctie: die laatste is niet op de rand maar ongeveer elf jaar oud (TVM Works), dus het zijn nul jonge garages en niet één** |
| **`EGRESS_BLOCKED` staat op zeven van zeven externe domeinen, en extra ronden repareren poort (a) niet.** Dit is de meting onder het beslispunt van de owner over het netwerkbeleid | 7 domeinen + 3 sessies | Vier op 11-09, twee op 13-09, `tvmworks.nl/contact/` vandaag door lane C. Daarbovenop: de verificatie stak op 13-09 zeven extra ronden in poort (a) en sloot er nul; ik heb er vandaag zes in gestoken op vier dossiers en sloot er nul. **Drie sessies, nul sluitingen** |
| **Een gedateerd spoor dat buiten het venster valt, is een BETERE uitkomst dan geen spoor**, want het maakt een dossier af in plaats van open. Kandidaat voor een vorm in het tekortblok: scheid "(a) niets gevonden" van "(a) gevonden, te oud" | 3, uit twee lanes en twee routes | RC Glazenwasserij → 08-02-2024 (LinkedIn); Rob Grobben → 18-07-2023 (LinkedIn, lane B); TVM Works → de vacatureroute biedt alleen een datum van drieëntwintig maanden oud, en dan nog in de samenvattende alinea. **Drie keer valt poort (a) op recentheid en niet op afwezigheid, en drie keer noemt het tekortblok dat "geen gedateerd levensteken"** |
| **`glazenwasserkeurmerk.nl` afwijzen als poort-(a)-route**: een keurmerkregister voert het lidmaatschap en niet de datum ervan | 2 ronden, 0 treffers | Bedrijfsnaam en `/bedrijf/<slug>/`-pad, geen certificeringsdatum, geen KvK-nummer, geen bedrijfs-e-mailadres; het enige adres in de bruikbare laag is dat van het keurmerk zelf |
| **`trimsalon-zoeken.nl` toelaten als náámbron en uitsluiten voor poort (a) en (f)** | 10 namen | Leeftijd 0/10, adres 3/10, gedateerd spoor 0/10. De route voert openingstijden, wat een toestand is en geen datum |
| **`glazenwassers.online` voert het KvK-nummer in het URL-pad — de schoonste 1.40(d)-vorm die we hebben — maar indexeert ondiep.** Bronnotitie voor de jaagvolgorde van 1.20(b) | 5 namen in 3 ronden | `/brands-multidiensten/52397564`, `/uijterwaal-bedrijfsdiensten/64692981`, `/schoonmaakbedrijf-noord-holland/64173445`, `/dgr-dienstverlening-bv/64223493`, `/p-b-dienstverlening/37116374`. Lane D vulde er correct **nul** dossiers mee, want vijf is geen tien |
| **`goudengids.nl` voert het telefoonnummer AFGEKAPT in de URL-titel**: bruikbaar als bevestiging van een nummer uit een andere bron, nooit als het nummer zelf | 4 dragers, 1 dienst, 4 plaatsen | `Tel: 06-39531...` (Bubbles, Leidschendam), `Tel: +310306356...` (De Vos, Houten), `Tel: 0226-313...` (Doggy Look, Noord-Scharwoude), `Tel: 06-41228...` (Bekkies, Zeist). Positieve kant: Verhaar Glazenwasserij, waar een tweede bron het bellijstnummer van 15-09 bevestigde |
| **De bronklasse beslist het kanaal, niet het dossier** (tariefgids met nummer in de titel → `bellijst.md`; registerklasse → `geen-emailadres.md`) | **5, nu ook in een sector die de tariefgidsen niet voeren** | Lane C's dertien: zes van de zeven belregels uit `kostenglazenwasser.nl`/`kostentuinman.nl`, de zevende (Trimsalabim) uit `telefoonboek.nl` — dezelfde klasse; de zes zonder nummer alle zes uit registerklasse-bronnen (`trimsalon-zoeken.nl`, `openingstijden.com`, `oozo.nl`, Facebook) |
| **Een ledgerrij met de verkeerde provincie valt op geen enkele poort en zet het bedrijf in de verkeerde lane.** Kandidaat voor een negende poort of voor een plaatscontrole in de ledgerronde | 1, met vier bronnen | `Glazenwasserij Robijn \| Almere (FL) \| … 2026-09-12 lane B \| Vestigingsnummer 000030844282`. Vier onafhankelijke bronnen zetten datzelfde vestigingsnummer in **Zaandam**, Lijsterbesstraat 50, 1505 TL (transfirm, alleglazenwassers, oozo, zaanstad075). **Ik heb de rij niet aangeraakt** — het is lane B's rij, de omkering hoort bij wie hem draait (1.32), en de A+B-verificatie draait vandaag in een parallelle sessie op dezelfde branch. Dit is de derde schriftelijke vastlegging (lane D, lane B's eigen bestand, deze) |
| **Een CRM-GUID in een Stagemarkt-leerbedrijfsprofiel draagt mogelijk een jaartal.** Uitdrukkelijk zwak en uitdrukkelijk géén registergetal | 1, van mijzelf, met de rem eraan vast | TVM Works' leerbedrijfprofiel draagt `af91cba7-03ab-**e811**-80e7-0050568f0ca6`, en `e811` is in Dynamics-GUID's een tijdstempel die naar 2018 wijst — vóór KvK 77786718 uit 2020, en dus consistent met de elfjaaraanwijzing. **Rem: dit is geen register en per de geest van 1.40(d) draagt het de leeftijd niet.** Ik bied hem aan als signaal dat een omzetting vermóedelijk maakt, nooit als bewijs |

---

## Botsingen die ik doorgeef

- **Lane C meldt voor de derde dag op rij dat `agents/beats.md`' sectorcap botst met het
  sectorplan van de directives** op glazenwasserij, hovenier én de hondensector. Lane C
  volgt de directives, zoals de order voorschrijft, en meldt de botsing. **Lane D meldt
  géén botsing en heeft daarin gelijk**, want de cap telt per 1.8 alleen kaarten en er
  staan er twee in de hondensector. Beide lanes doen het goede en komen op verschillende
  uitkomsten omdat zij een andere teller gebruiken. **Dat is het werkelijke punt en het
  hoort op zondag beslecht: telt de cap dossiers of kaarten?** Zolang dat open staat,
  meldt de ene lane zeven dagen een botsing die de andere niet ziet.
- **`cold-email/SKILL.md:91` en `:93`** (`Short, boring, internal-looking` ·
  `- 2-4 words, lowercase, no punctuation tricks`) botsen onverminderd met poort (g) van
  de owner, die een gecheckt detail binnen 45 tekens eist. Beide lanes noteren de botsing
  en vechten hem niet opnieuw uit; hij is op 14-09 in het voordeel van de owner beslecht.
  Dat is de goede omgang met een beslechte botsing.
- **`prospecting/references/local-prospecting.md:13`** (`Google Business Profile updated,
  recent reviews, recent hours updates`) botst met 1.7, die de gidsenstempel verbiedt.
  Lane C volgt 1.7 en meldt de botsing. Correct.
- **De pushvorm** staat in `CLAUDE.md` en `agents/outreach-agent.md` nog in de kale vorm
  (`git push origin main`) en in de directives in de `HEAD:`-vorm. Ik volg de
  `HEAD:`-vorm en meld de botsing; die twee bestanden zijn van de owner en staan als
  beslispunt bij hem.

---

## Voor de owner — in twee regels

1. **Lanes C en D leveren vandaag samen 130 beoordeelde dossiers en nul kaarten, en ik
   keur die nul goed.** Vier dossiers stonden op één datum van een kaart af; ik heb er
   zelf zes ronden in gestoken en geen van de vier gesloten. Eén ervan (TVM Works) bleek
   bij mijn eigen ronde geen zes maar ongeveer elf jaar oud — dus zelfs met die datum was
   het geen kaart geweest. **De nul is geen inzetprobleem.**
2. **Het netwerkbeleid van de omgeving is nu op drie sessies gemeten en het is de
   bindende beperking.** `EGRESS_BLOCKED` op zeven van zeven domeinen; de vervangende
   datumroute werkt aantoonbaar wél op LinkedIn, maar levert systematisch de oudste post
   in plaats van de nieuwste. Dat beslispunt is de goedkoopste knop die u hebt: hij zit
   niet in de lat en niet in de lanes.

---

## Gebruikte skills

| Skill | Waar toegepast | Wat het concreet veranderde |
|---|---|---|
| `product-marketing` | Als **eigenaar** van `.agents/product-marketing.md`, vóór het eerste oordeel en na het laatste | Gelezen vóór ik één kaartsectie las, en **bijgewerkt naar 1.60** met changelogregel — de enige wijziging van de dienst en de enige die ik mag maken. De regels die vandaag rechtstreeks een oordeel bepaalden: **1.38/1.56/1.59** in de weging van de LinkedIn-route (de vraag van de dag); **1.20(a)** drie keer beslissend — bij de 8,8 van Trustoo, bij de vacaturedatum 06-10-2024 en bij de elfjaaraanwijzing van TVM Works, die ik alle drie wél heb gelezen en géén van drie heb geboekt; **1.57** bij de uitkomst dat een registertegenspraak nooit "binnen het venster" oplevert; **1.43** bij het hoge KvK-nummer boven een laag vestigingsnummer; **1.50** bij beide partities; **1.51** bij de vier tekenmetingen; **1.55** bij de vijf niet-reproducerende getallen; **1.44** bij de aanroepvorm van vijf skills; **1.40(e)** bij de handle in het LinkedIn-pad; **1.32** bij mijn weigering de Robijn-rij van lane B aan te raken |
| `cold-email` | Op lane D's vijf kandidaat-onderwerpregels, en op de vraag of uit één van de vier open poort-(a)-dossiers alsnog een verzendklare tekst kon komen (aangeroepen **zonder argument**) | `cold-email/SKILL.md:41` — `If you remove the personalized opening and the email still makes sense, the personalization isn't working.` heb ik op alle vier de open dossiers zelf gedraaid en ik kom op alle vier tot dezelfde uitkomst als de lanes: bij TVM Works is de sterkste opener "vier komma negen over honderdéén beoordelingen" en het bericht staat er ongeschonden zonder, want het lek eronder is niet vastgesteld. `cold-email/SKILL.md:118` — `- Would YOU reply to this if you received it?` is de toets die mijn belangrijkste afwijking van lane D opleverde: op `Drie zussen, één telefoon, zes dagen` is het antwoord ja, en lane D had die regel alleen als tekenmeting in het bestand staan. Daardoor staat er nu in mijn oordeel dat deze lane een poort-(g)-waardige regel schreef zonder het te merken. `cold-email/SKILL.md:37` — `Cold email is ruthlessly short. If a sentence doesn't move the reader toward replying, cut it.` gaf de scherpste formulering van de daguitkomst: het kortste bericht dat vandaag verstuurd kon worden, is geen bericht. `cold-email/SKILL.md:91` en `:93` staan als beslechte botsing genoteerd en zijn niet opnieuw uitgevochten |
| `marketing-psychology` | Op de keuze wat ik met het laatste fundamentnummer doe, op de volgorde van mijn eigen ronden, en op de weging van mijn eigen LinkedIn-oordeel (aangeroepen **zonder argument**, per 1.44) | `marketing-psychology/SKILL.md:66` — `Every system has one bottleneck limiting throughput. Find and fix that constraint before optimizing elsewhere.` besliste de 1.60-keuze: de bottleneck is niet het aantal regels maar poort (a), en de vraag werd "welke ongeschreven regel kost het meest tot zondag" — dat is de over-onsregel en niet de LinkedIn-regel, want de eerste kostte vandaag bijna een kaart en de tweede kost een paar sporen die toch buiten het venster vallen. `marketing-psychology/SKILL.md:81` — `Consider not just immediate effects, but the effects of those effects.` hield mij ervan af de Robijn-rij van lane B te repareren: het eerste-orde-effect is een juiste provincie, het tweede-orde-effect is een botsende edit met de A+B-sessie die vandaag op dezelfde branch draait. `marketing-psychology/SKILL.md:416` — `Focusing on successes while ignoring failures that aren't visible.` heb ik tegen mijn **eigen** LinkedIn-oordeel ingezet: dat twee dragers buiten het venster vallen, kan ook betekenen dat ik alleen de dragers zie die de index goed gelinkt heeft — en juist daaruit volgt het mechanisme dat 1.38 al noemt, dus de route levert stelselmatig de oudste post. `marketing-psychology/SKILL.md:86` — `Models and data represent reality but aren't reality itself.` is het oordeel achter mijn TVM Works-correctie: de KvK-band is een model, "ongeveer elf jaar" op de eigen zaakpagina is het terrein, en lane C heeft het model boven het terrein gezet. `marketing-psychology/SKILL.md:109` — `When customers don't convert, examine your process before blaming them. The problem is usually situational, not personal.` is de reden dat mijn drie afkeuringen op tellingen alle drie eindigen in een **vormcorrectie van één woord** (`lane C` in het patroon) en niet in een terechtwijzing: drie lanes op drie dagen dezelfde fout is een vorm, geen slordigheid. `marketing-psychology/SKILL.md:51` — `The simplest explanation is usually correct.` gaf het antwoord op de vraag van de opzichter: de opzichter kon de regel onder de kop niet lezen omdat er een codefence tussen stond, niet omdat lane C iets ingewikkelds deed |
| `prospecting` | Op de zekerheidsgraad van elk feit dat ik zelf binnenhaalde in mijn zes eigen ronden (zonder argument) | `prospecting/SKILL.md:200` — `- [ ] Confidence levels honest — "High" requires 2 independent sources, not just two of your own searches` is de reden dat ik de elfjaaraanwijzing van TVM Works **niet** als hard heb geboekt: zij komt uit één samenvattende alinea, en mijn tweede ronde op dezelfde zaak is mijn eigen zoekopdracht en geen tweede bron. Daarom staat er in het ledger `leeftijd niet vastgesteld (omzetting)` en niet `te lang gevestigd`. `prospecting/SKILL.md:68` — `- **High**: confirmed by at least two independent sources or official business page` liet de RC-bevestiging juist wél door: 01-01-2022 staat op de eigen zaakpagina, en dat is de `official business page` die deze regel als hoogste zekerheid kent. **Twee feiten, dezelfde ronde, tegengestelde uitkomst — en dat verschil is precies waarom 1.60 over de over-onsronde gaat** |
| `copy-editing` | **Niet gebruikt**, met de grond erbij | Er is geen bericht en geen onderwerpregel van mijzelf om te vegen. Het enige copywerk was lane D's vijf kandidaatregels, en die heb ik met `cold-email` en met poort (g) van de owner beoordeeld, niet met een redactieskill. Lane D heeft `copy-editing` er zelf correct op gedraaid |
| `marketing-council` | **Niet gebruikt**, met de grond erbij | Die skill is per `agents/skills-toewijzing.md` voor het weekrapport, waar meerdere perspectieven tegen het plán aankijken. Vandaag is een verificatiedienst: de vraag is of de feiten kloppen, niet of de strategie klopt. Zij hoort zondag te draaien op de kandidaten in mijn weekrapporttabel |
| `pricing` | **Niet gebruikt**, met de grond erbij | Nul kaarten betekent nul pakketkeuzes. Er is vandaag geen keuze tussen 299 en 549 gemaakt en dus niets te toetsen tegen `zevren/lib/offer.ts` |
| `customer-research` | **Niet gebruikt**, met de grond erbij | Beide lanes strandden op bewijs en bereikbaarheid, niet op de vraag wat de koper beweegt. Ik onderschrijf het gemis dat lane C zelf noteert: zodra er weer een dossier op poort (a) sluit, hoort deze skill vóór de hoekkeuze te draaien — en dat geldt voor mij net zo goed als voor Sam |
| `competitor-profiling` | **Niet gebruikt voor een dossier**, wel als meting | `grep -oE '\$[0-9]+' competitor-profiling/SKILL.md \| sort -u` geeft nul regels, en `grep -cE '\$[0-9]+'` geeft 0. Dat bevestigt lane C's tweede drager onder mijn eigen 1.44-correctie van gisteren: de skill hoort in de nulgroep en een argument was daar toegestaan |

---

## Samenvatting — één regel per oordeel

- **GOEDGEKEURD** — De kaarttelling van de opzichter: `grep -cE '^## [0-9]+\. '` geeft 0 in lane C en 0 in lane D, in de werkdirectory én op `origin/main`. Nul kaarten, nul verzendklare teksten, en bij beide lanes is dat de juiste uitkomst.
- **GOEDGEKEURD** — Lane C's tellingen: 31, 7 en 6 reproduceren exact; de dossiertabel telt over disjuncte rijen en benoemt de dubbeltelling van 1.46 vóór iemand haar kan maken; de tekorttabel partitioneert 1 t/m 54 zonder gat en zonder dubbel.
- **AFGEKEURD** — Lane C's tekortblok staat in een codefence met een witregel ervoor, en dát is waarom de opzichter de regel eronder niet machinaal kon lezen; de directives tónen het sjabloon zelf in een fence en lane C nam de verpakking mee. Fix: fence en witregel weg.
- **AFGEKEURD** — Twee van lane C's getallen meten over alle vier de lanes en reproduceren niet meer (32 → **159**; 2.936 → **3.054**). De bewering klopt, het commando meet te breed; zet `lane C` in het patroon.
- **AFGEKEURD** — Lane C stelde vandaag zelf de omzettingsregel voor en paste hem niet toe op zijn enige kaartrijpe dossier: TVM Works is geen zes jaar en vijf maanden maar ongeveer **elf jaar**, want KvK 77786718 (2020) is de B.V.-omzetting. Ledgerrij per 1.24 bijgewerkt; drie poorten staan daar open, niet één.
- **GOEDGEKEURD** — Lane C's routemetingen: `trimsalon-zoeken.nl` is op tien met naam genoemde namen gemeten mét de nullen (leeftijd 0/10, spoor 0/10) vóór zij één dossier vulde; `glazenwasserkeurmerk.nl` vulde nul dossiers en had de eis dus niet nodig. Twee correcties op de verpakking: de kop zegt "geen dossier geraakt" waar rij 5 uit die route komt, en de commit-boodschap zegt drie routemetingen waar het bestand twee schrijft.
- **GOEDGEKEURD** — Lane D's tellingen: 44, 11, 12 en 8 reproduceren exact; de tekorttabel partitioneert 1 t/m 76 over acht gronden zonder gat en zonder dubbel; het bestemmingsbestand voert twaalf rijen onder een kop die twaalf zegt, met twee telcommando's eronder.
- **GOEDGEKEURD** — Beide correcties van 16-09 zijn door lane D uitgevoerd: de leeftijdspoort heet nu `(f)`, ook in het tekortblok, en elk getal draagt zijn commando — met als beste voorbeeld dat lane D zijn eigen "26 van de 44" weggooide toen het commando **11** gaf.
- **AFGEKEURD** — Lane D's `beats.md`-telling geeft nu **3** in plaats van 2, omdat lane A ná de meting een kaart pushte; de uitkomst staat daarmee óp de cap in plaats van eronder. De conclusie "geen botsing" blijft juist, want de sectorgebonden telling is onveranderd 2 — maar tel de cap op de sector waar de regel over gaat.
- **AFGEKEURD** — Lane D schrijft "acht rijen in de kolomvorm" waar zijn eigen bestemmingsbestand **twaalf** voert; een onderschatting van het eigen werk op de ene plek waar de order wordt afgevinkt. Fix: `twaalf rijen, waarvan acht uit de geen-websitegroep`.
- **GOEDGEKEURD** — De vier dossiers op poort (a) zijn alle vier compleet gedraaid: vijf bewijssoorten met één regel per route en de insolventieronde schoon (KvK 77786718, 84792825, 77906624, 81067518). Mijn eigen zes ronden sluiten er **nul**, op vier platforms, en dat maakt het oordeel van beide lanes juist.
- **GOEDGEKEURD** — De LinkedIn-datumroute, gewogen tegen 1.38, 1.56 en 1.59: zij kan **geen kaart sluiten** — nul van vier vandaag, en beide bestaande dragers vallen buiten het venster om een mechanisme dat 1.38 zelf al noemt (de index geeft de best gelinkte post, niet de nieuwste). Zij is wél de eerste échte aanvoerroute, en 1.59's verklaring uit accountomvang is weerlegd: het verschijnsel is **platformgebonden**. Acht decoderingen door mij nagerekend, alle acht exact; de schuifcontrole gereproduceerd op een derde dragerset.
- **GOEDGEKEURD** — Poort (h): achtendertig citaatinstanties over achtentwintig unieke regelnummers (16 bij lane C, 22 bij lane D, met het telcommando erbij), alle achtendertig exact op hun opgegeven `grep -n`-regelnummer; geen hol voorbeeld, geen `$N`-vervuiling, en de aanroepvorm van 1.44 bij beide lanes correct. Lane C's correctie van gisteren is ruimer uitgevoerd dan ik hem gaf.
- **GOEDGEKEURD** — Poort (g): lane D's vier metingen reproduceren exact en zijn 1.51-reproductie klopt (38 kaal, 36 onder `C.UTF-8`, twee tekens door één `é`). Drie kandidaten terecht gedood — maar `Uw 8,8 …` stierf op één onverifieerbaar cijfer en niet op zijn vorm, en `Drie zussen, één telefoon, zes dagen` **haalt poort (g)** zonder dat lane D het merkte.

**Fundament:** bijgewerkt naar **1.60** — de over-onsronde stelt vast wíens jaartal een
jaartal is, vóór enig jaartal de leeftijd draagt. Twee dragers van vandaag, naar
tegengestelde kanten (TVM Works: omzetting maakt oud jong · RC Glazenwasserij:
loopbaanjaar maakt jong oud). **De C+D-reeks 1.51 t/m 1.60 is daarmee vol; alles wat
hierna komt gaat naar `## Voor het weekrapport`.**

**Tekort van de dag:** gevraagd 30 over vier lanes · lanes C+D beoordeeld 130 · kaarten
**0** · tekort gemeld, lat niet verlaagd.

Azzouz, 17 september 2026
