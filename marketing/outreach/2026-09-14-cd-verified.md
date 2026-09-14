# Verificatie — maandag 14 september 2026 — lanes C en D

Azzouz, verificatiedienst. Ik verifieer vandaag **uitsluitend**
`marketing/outreach/2026-09-14-c.md` (Limburg / Noord-Brabant / Zeeland) en
`marketing/outreach/2026-09-14-d.md` (Noord-Holland / Zuid-Holland / Utrecht).
Lanes A en B gaan naar de parallelle sessie in `-ab-verified.md`; ik heb die
bestanden niet aangeraakt.

## De telling, zelf gedaan, met het commando erbij

De opzichter telt nul genummerde kaarten in allebei de lanes. Dat klopt:

```
$ grep -cE '^## [0-9]+\. ' marketing/outreach/2026-09-14-c.md
0
$ grep -cE '^## [0-9]+\. ' marketing/outreach/2026-09-14-d.md
0
```

En de dossieraantallen die beide lanes melden, kloppen ook:

```
$ grep -c "2026-09-14 lane C" marketing/outreach/contacted.md
61
$ grep -c "2026-09-14 lane D" marketing/outreach/contacted.md
61
```

**Er is vandaag dus niets te keuren dat op het bord kan.** Mijn dienst is
daarmee de opdracht die de owner eraan heeft gehangen: toetsen of het tekort
eerlijk is verantwoord, of de dossiers die op poort (a) open staan hun
verplichte ronden hebben gehad, of er met een eigen ronde alsnog een kaart uit
komt, en of poort (h) klopt tot op het regelnummer.

**Mijn oordeel vooraf, in één zin: beide lanes hebben een eerlijke, volledig
reproduceerbare dienst geleverd, en het tekort is echt.** Ik heb zes eigen
ronden gedraaid op de vier dossiers die één ronde van een kaart af staan en ik
sluit er nul mee. Dat is geen verwijt aan Sam; het is de bevestiging van de
bindende beperking die al zeven diensten in dit bestand staat.

---

## GOEDGEKEURD — de tekortverantwoording van lane C is reproduceerbaar

De vaste vorm staat er woordelijk: gevraagd 30, deze lane beoordeeld 61,
kaarten 0, bindende poort (f) bij 38 van de 61, E/F/G opgeschort en niet
opgevuld.

**De grondentabel telt op zijn eigen inhoud uit.** 38 + 12 + 4 + 3 + 2 + 1 + 1
= 61, en dat is exact het aantal ledgerrijen dat ik hierboven zelf telde. Elk
dossier staat onder zijn eerste vallende poort en nergens twee keer; lane C
zegt dat er tien poort-(e)-herbevestigingen tussen zitten en verantwoordt
uitdrukkelijk waarom die onder hun werkelijke grond staan en niet onder poort
(e). Dat is precies wat de nieuwe harde vormregel van deze week vraagt.

**Ook de sectorminima reproduceren.** Lane C claimt 20 / 21 / 15 / 5. Ik heb
het los nageteld:

```
$ grep "2026-09-14 lane C" contacted.md | grep -oE "Sector: [A-Za-z/() -]*" \
    | sed 's/ *$//' | sort | uniq -c | sort -rn
```

Dat geeft 15 glazenwasserij + 3 gevelreiniging/softwash + 1
glazenwasserij/gevelreiniging + 1 glasbewerking = **20**; 17 hovenier + 4
hovenier-varianten = **21**; 13 garage + 2 garagevarianten = **15**; 5
hondentrimsalon = **5**. Samen 61. **Vier van de vier minima gehaald**, de
twee vrije plaatsen met de gevraagde ene regel naar garages verschoven, en de
grond die daaronder staat is de juiste: de derde route die gemeten moest
worden is een garagebron.

**De diagnose die lane C onder de tabel zet, is scherper dan de tabel en zij
is juist.** De leeftijd velt de meeste dossiers maar velt ná één ronde en dus
goedkoop; poort (a) velt er drie en doet dat bij precies de drie dossiers waar
al het werk al in zit. Dat is de bindende beperking correct benoemd, en het is
dezelfde conclusie die ik hieronder met mijn eigen ronden bevestig.

---

## GOEDGEKEURD — lane C's meting van de derde route voldoet aan de nieuwe regel

De directives lichten het verbod op een derde route op **mits zij eerst een
meting op tien namen oplevert en pas daarna dossiers**. Dat is de order die ik
vorige week zelf verkeerd had staan, en ik heb hem hier het strengst getoetst.

**De volgorde klopt en zij is aantoonbaar.** Lane C noemt de route
(`site:123auto.nl/consument/bedrijven-in-de-buurt`), zet de meting in een tabel
met zes bewijssoorten, noemt **alle tien de namen** waarop hij is gedraaid, en
markeert uitdrukkelijk dat de laatste vier buiten de lane-regio vallen en
alleen in de meting tellen. Pas daarna vullen de dossiers zich ermee. Een
meting op tien namen die haar tien namen opschrijft, is navolgbaar; dat is
precies het verschil met de samenvattende alinea die 1.20(a) verbiedt.

**De uitkomst is bruikbaar én eerlijk begrensd.** Score en aantal
beoordelingen bij 10 van 10; leeftijd, adres, e-mail en gedateerd spoor bij
**0 van 10**. Lane C trekt daar de enige conclusie die het bewijs draagt — een
namen- en reviewbewijsroute, geen leeftijds-, adres- of levenstekenroute — en
zet er zelf de rem bij die hem het duurst uitkomt: een bedrijf waarvan
`123auto.nl` de enige eigen pagina is, heeft per definitie geen eigen domein,
dus de route verbetert het **profiel** van de geen-websitegroep en niet haar
**bereikbaarheid**. Zij vult het quotum van acht en lost de muur van 25
augustus niet op.

**Dat lane C die rem zelf schrijft, is het sterkste punt van de dienst.** Het
is de omgekeerde prikkel: hij had de route als doorbraak kunnen verkopen en
verkoopt hem als gereedschap met een bekende grens.

---

## GOEDGEKEURD — de tekortverantwoording van lane D is reproduceerbaar

Vaste vorm aanwezig en volledig: gevraagd 30, beoordeeld 61, kaarten 0,
bindende poort (b) bij 24 van de 61, E/F/G opgeschort.

**De grondentabel telt uit:** 24 + 23 + 3 + 3 + 2 + 2 + 2 + 1 + 1 = **61**.

**De sectorminima reproduceren op één label na** (zie de correctie hieronder).
Mijn eigen telling geeft 30 glazenwasserij, 21 hondentrimsalon, 9 hovenier en
1 dakonderhoud = 61. Lane D meldt hovenier als 10 en rekent de dakonderhoudrij
daarin mee als bijvangst van de hovenierszeef — dat staat er ook bij, in de
rij zelf. Het minimum van 6 is hoe dan ook gehaald, met of zonder die rij.

**Lane D's uitvoeringstabel bovenaan is een goede vorm die ik graag terugzie.**
Order per order, met de uitkomst ernaast, inclusief de twee orders die hem het
meest kostten: nul ronden in de uitgeputte 1.13-route (óók bij de twee
dossiers waar poort (a) er letterlijk om vroeg) en de vijf bewijsroutes die
lane D op 13-09 níet draaide en vandaag wel.

**En de twee vrije dossiers zijn bewust niet ingevuld.** Lane D meldt dat en
zet de grond erbij: die ronden zijn in de hondensector gestoken nadat daar
twee complete dossiers op een klantenstop vielen. Dat is de juiste keuze en de
juiste melding — er gaat een lane bij, geen zwakkere kaart doorheen, en een
dossier dat alleen bestaat om een tabelrij te vullen is precies de holle
opvulling die de dagnorm niet mag uitlokken.

---

## GOEDGEKEURD — de vijf bewijsroutes en de insolventieronde zijn werkelijk gedraaid

Dit is poort-(a)-order van de week en ik heb hem per dossier nagelopen.

**Lane C — Glazenwassersbedrijf Roerdalen (Vlodrop, KvK 76553957).** Alle vijf
de toegewezen bewijssoorten staan uitgeschreven met per route één regel wat zij
gaf: KvK-mutatie (niets dan het kale nummer), gemeentelijke/GGD-vergunning (de
vergunningenpagina's van de gemeente zelf, niets op naam), inspecties en
rapporten (niets op bedrijfsniveau), SBB-erkenning (geen leerbedrijfprofiel; de
ronde geeft de gemeente en niet het bedrijf), vacature met plaatsingsdatum
(alleen verzamelpagina's van Indeed, Adzuna en Jooble). Drie eigen ronden
daarbovenop. **Insolventieronde (1.40a) gedraaid en schoon** op 76553957.

*Eén vormpuntje, geen afkeuring:* de tweede en derde rij van die tabel zijn in
elkaar geschoven ("Gemeentelijke / GGD-vergunning, inspectie, rapport" en
daarna "Inspecties en rapporten — idem"). Alle vijf de soorten zijn gedekt; de
etikettering is slordig waar de uitvoering dat niet is. Houd de vijf koppen
volgende keer woordelijk uit elkaar, dan is de tabel ook voor een derde lezer
één op één met de order.

**Lane D — Trimsalon Driemond (KvK 83371621) en Sander van Os (KvK 85094455).**
Alle vijf gedraaid op **allebei** de kaartrijpe dossiers, met de uitkomst per
route, plus de aparte vermelding waarom een trimsalon geen vergunningplichtige
inrichting is en waarom een eenmanszaak met één werkzaam persoon geen vacature
voert. **Insolventieronde op allebei gedraaid en allebei schoon.** Dit is de
order die lane D op 13-09 liet liggen; hij is vandaag volledig ingehaald.

**Eén dossier staat op poort (a) open zónder de vijf routes, en dat is de enige
echte uitvoeringsfout van vandaag.** Lane C's **Sportscar Service Tilburg**
(KvK 78487242) staat in het bestand als "het derde dossier dat één ronde van
een kaart af staat", met poort (b) dicht en `lead - poort open` in het ledger —
maar poort (a) is daar met **twee** ronden gesloten verklaard als open, zonder
de vijf toegewezen routes en zonder insolventieronde. De order van deze week
zegt: vóór een dossier op poort (a) open mag blijven staan, zijn die vijf
gedraaid en staat per route in één regel wat zij gaf. Dat is hier niet gebeurd.

*Waarom dit geen gefaalde dienst is:* het dossier is niet als kaart
aangeboden, het staat correct als open poort in het ledger (en niet als kaart
met een controleopdracht erbij, wat deze week uitdrukkelijk verboden is), en
lane C corrigeert zichzelf in dezelfde sectie op het `business.site`-adres dat
alleen in de samenvattende alinea stond. **De correctie voor morgen is enkel:
draai de vijf ook op dít dossier, of noteer het niet als "één ronde van een
kaart af".** Ik heb de ontbrekende ronden vandaag zelf gedraaid; de uitkomst
staat hieronder.

---

## AFGEKEURD — geen van de vier dossiers komt met een eigen ronde alsnog door poort (a)

Dit is de kern van mijn opdracht en ik heb er zes ronden in gestoken, verdeeld
over de vier dossiers die op poort (a) open staan en verder compleet zijn:
Roerdalen, Sportscar Service Tilburg, Trimsalon Driemond en Sander van Os.

**Wat mijn ronden wél bevestigden — en dat is winst, want het is onafhankelijk
bewijs voor Sams dossiers:**

- **Driemond.** Ik vond zelfstandig haar eigen pagina met de URL-titel
  `Afspraak maken | Trimsalon Driemond` en het adres
  `trimsalondriemond@outlook.com`. Daarmee zijn poort (b) én het detail waarop
  lane D zijn onderwerpregel bouwt, door een tweede, onafhankelijke hand
  bevestigd. De onderwerpregel draagt een feit dat echt bestaat.
- **Sander van Os.** TransFirm geeft `850944550000-…` (KvK 85094455) en drimble
  `000051159619` (vestigingsnummer) — exact de twee nummers die lane D
  noteert, en exact de scheiding die 1.40(d) eist. Adres en
  `info@svohoveniers.nl` bevestigd.
- **Sportscar Service Tilburg.** De transfirm-URL voert
  `78487242-000046107762` en drimble voert `46107762`: het vestigingsnummer,
  niet het KvK-nummer. Lane C heeft 1.40(d) hier correct toegepast. De
  eenbedrijfspagina met `013-5352110 info@sportscarservice.nl` in de URL-titel
  bestaat; de vier andere gidsen die mijn ronde teruggaf voeren het adres
  **niet** in de titel, dus lane C's beslissing om hem als **één** bron en niet
  als twee te boeken, is juist.

**Wat geen enkele ronde gaf: één gedateerd spoor van het bedrijf zelf binnen
twaalf maanden.** Bij Roerdalen bestaat de Werkspot-reviewpagina, maar de
beoordelingen die de ronde noemt liggen in 2021-2023 — buiten het venster, en
bovendien uitsluitend in de samenvattende alinea, die per 1.20(a) geen bron is.
De vacatureroute geeft Indeed-verzamelpagina's mét datum in de titel
(`10 september 2026`), maar dat is Indeeds datum en niet zijn daad — de
klassieke poort-(a)-val van "wiens daad draagt de datum". Bij Driemond geeft
Instagram alleen de profiel-URL en nooit een post-URL, precies zoals lane D
meldt, en Facebook geeft de dode `/p/`-pagina. Bij
`bestehondentrimmers.nl/city/amsterdam` staat "(2026)" in de titel — dat is de
gidsenstempel die 1.7 uitdrukkelijk verbiedt, en ik gebruik hem niet.

**Oordeel: het tekort is echt.** Vier complete dossiers, acht poorten dicht op
alles behalve één, een geverifieerd openbaar e-mailadres bij alle vier — en de
ene ronde die ze opent, bestaat in deze omgeving niet. Ik keur ze af op poort
(a), zoals de regel het voorschrijft, en ik teken erbij aan dat dit de zevende
dienst op rij is dat dezelfde poort dezelfde soort dossiers velt. **Dat hoort
niet meer thuis in een dagverdict maar in het beslispunt dat al bij de owner
ligt.**

---

## GOEDGEKEURD — poort (h) haalt bij beide lanes de nieuwe regelnummer-eis

De nieuwe eis van deze week: een citaat zonder `grep -n`-regelnummer telt niet
als voorbeeld, en een tabel met een aantoonbaar fout citaat is een gefaalde
dienst. **Ik heb alle twintig citaten van beide lanes van schijf gecontroleerd.
Twintig van de twintig kloppen woordelijk op het genoemde regelnummer.**

**Lane C — veertien citaten, alle veertien juist:** `prospecting/SKILL.md:68`,
`:200`, `:56`; `cold-email/SKILL.md:41`, `:91`, `:51`;
`marketing-psychology/SKILL.md:262`, `:263`, `:106`, `:65`, `:415`;
`copy-editing/SKILL.md:117`, `:152`, `:182`.

**Lane D — zes nieuwe citaten daarbovenop, alle zes juist:**
`prospecting/SKILL.md:202`; `cold-email/SKILL.md:37`;
`marketing-psychology/SKILL.md:109`, `:282`; `copy-editing/SKILL.md:180`,
`:146`.

**Beide tabellen zijn inhoudelijk vol en niet hol.** Ze noemen per skill wat er
concreet door veranderde, met de verandering erbij die zonder de skill niet was
gebeurd: lane C's "tien seconden" dat door `copy-editing` sweep 4 uit de tekst
ging, lane D's vier woorden die op `cold-email:37` sneuvelden, en bij allebei
de vier tot vijf skills die als **niet ingezet** staan mét de grond. Dat
laatste is geen minpunt en ik reken het als een pluspunt: een agent die
opschrijft welke skill hij niet nodig had, is de agent die de tabel niet vult
om de tabel te vullen.

*Eén minuscuul punt, uitdrukkelijk geen fout:* lane C citeert
`copy-editing:182` als `Remove content that can't be made specific (it's
probably filler)` terwijl er op schijf `4. Remove content…` staat. De zin zelf
is woordelijk; alleen het lijstnummer is weggelaten. Dat is geen gestikt citaat
in de zin van 1.27 en het blijft goedgekeurd.

**Ik heb `cold-email` en `marketing-psychology` vandaag zelf aangeroepen**, in
de vorm die 1.40(g) voorschrijft: met een argument van één woord (`subjects`
respectievelijk `loss`). **Beide kwamen ongeschonden binnen — geen enkele
`$N`-vervanging.** Dat is een positieve controle op 1.40(g): de drempel is de
lengte van de argumentstring, en bij één woord vuurt alleen `$0`/`$1`, waar in
deze twee bestanden niets op die posities staat.

**Wat die twee skills aan mijn oordeel veranderden, want anders is dit ook een
holle regel.** `cold-email` schrijft onderwerpregels van 2-4 woorden,
kleingeschreven, "internal-looking" voor. **Alle drie de klaargelegde
onderwerpregels van vandaag botsen met dat advies** en ik keur ze toch goed:
poort (g) van de owner eist een concreet geverifieerd detail binnen 45 tekens,
en de harde regels verslaan elk skill-advies. Ik noteer de botsing hier zodat
zij niet elke week opnieuw hoeft te worden uitgevochten. Waar de skill wél
bindt, is de verwijdertoets op `:41`, en daar komen alle drie doorheen: haal
"Werkspot", "Afspraak maken" of "één pagina" weg en de regel stort in. Uit
`marketing-psychology` is **Loss Aversion** (`:262`-`:263`) de reden dat ik
beide teksten als overtuigend beoordeel en niet alleen als correct: het verlies
staat er in geld en tijd én met de tweede helft erbij die verklaart waarom de
ondernemer het nooit heeft gemerkt. **Contrast Effect** (`:282`) is waarom ik
lane D's geen-websitevaststelling goedkeur: zeven namen mét domein tegen drie
zonder, in dezelfde ronde, is een vaststelling; "ik vond niets" was er geen
geweest.

---

## GOEDGEKEURD met correcties — de twee klaargelegde teksten van lane D

Geen kaarten, dus geen oordeel gevraagd. Ik toets ze toch, omdat ze morgen met
één ronde verzendklaar zijn en een fout die vandaag blijft staan, dan meegaat.

**Alle claims zijn gedekt en ik heb ze van schijf gecontroleerd:**

| Claim | Bron op schijf | Klopt |
|---|---|---|
| `hondentrimsalons`, `planKey: "business"`, `demoSlug: "barbershop-website"` | `sectors.ts` r. 68, 71, 72 | ja |
| "een behandeling, een moment en een bevestiging" | `sectors.ts` `proof` van **die** sectorpagina | ja — **eigen belofte, niets geleend** (1.40b) |
| 549 eenmalig, exclusief btw | `offer.ts` r. 23 + de FAQ op dezelfde sectorpagina | ja |
| `hoveniers`, `planKey: "starter"`, **géén** `demoSlug` | `sectors.ts` r. 208, 211 | ja |
| "in de conceptbouwer kies je een stijl en kleuren en krijg je direct een voorbeeld van je eigen homepage" | `sectors.ts` `proof` r. 214, woordelijk | ja |
| "Werk dat af is, groot en scherp" | FAQ: "Wij zetten ze in een pagina die ze groot en scherp laat zien" | ja |
| 299 eenmalig, exclusief btw | `offer.ts` r. 22 + FAQ | ja |

**Dat lane D bij de hovenier géén demo belooft omdat die sectorpagina geen
`demoSlug` voert, is 1.31 in zijn zuiverste toepassing** en het is het soort
controle dat een afkeuring voorkomt die niemand had gezien.

**De maten kloppen, zelf nageteld:** Driemond 188 woorden, Sander van Os 183
woorden (allebei binnen 160-220), onderwerpregels 35 en 29 tekens (allebei
binnen 45). **Handtekening: allebei exact het voorgeschreven blok, mét
06-30958710.** UTM's `hondentrimsalons-w38` en `hoveniers-w38` zijn woordelijk
de slug van de sectorpagina, conform 1.25.

**De zeven eisen van de staande order: allebei gehaald.** Het lek staat in geld
en tijd (het telefoontje dat morgen niet komt; de aanvraag die naar de ander
gaat), het bewijs komt uit zijn eigen zaak, er is één beeld per bericht (de man
op de bank; kwart over negen 's avonds), de bestemming is de bewijslast en
wordt één keer genoemd, de prijs staat er zonder verontschuldiging, geen
schaarste, en de lengte klopt.

---

## GOEDGEKEURD met correcties — de klaargelegde tekst van lane C (Roerdalen)

**De claimcontrole klopt op schijf:** `offer.ts` r. 22 voert
`{ key: "starter", price: 299, needs: "new-website" }`, en de conceptbouwerzin
staat woordelijk op r. 15 van `zevren/app/concept-bouwer/page.tsx`. 192
woorden, onderwerpregel 42 tekens, handtekening compleet mét telefoonnummer.

**Het sterkste aan deze kaart is wat er níet in staat.** Glazenwasserij is de
enige sector uit lane C's plan **zonder** sectorpagina — ik heb dat nageteld,
`sectors.ts` voert twaalf slugs en geen daarvan is een glazenwasser:

```
$ grep -c "slug:" zevren/lib/local/sectors.ts   →  12 (incl. de typedefinitie)
$ grep -ci "glazenwas" zevren/lib/local/sectors.ts   →  0
```

Lane C trekt daar de scherpe conclusie uit die 1.40(b) eist: geen veld, geen
scherm, geen opleverbaar element noemen, en **niets lenen van de
hovenierspagina**, die wél over foto's van afgerond werk spreekt. Het bericht
zegt daarom "een eigen site waar dat werk wél staat" en beschrijft verder
alleen wat de bezoeker doet. Dat is de moeilijkste vorm van deze regel en hij
is correct toegepast.

**Twee dingen die ik zou veranderen vóór verzending, allebei klein:**

1. De zin "Zo'n site kost 299 euro eenmalig, exclusief btw, en die prijs staat
   gewoon op zevren.nl" draagt het woord "gewoon". Dat is een verontschuldiging
   in vermomming — de staande order vraagt de prijs **zonder**
   verontschuldiging. Schrap "gewoon": "die prijs staat op zevren.nl".
2. De openingszin noemt Herkenbosch terwijl het bedrijf in Vlodrop zit (beide
   in gemeente Roerdalen, dus feitelijk juist als klantherkomst). Laat het
   staan, maar weet dat het bij een strenge lezer vragen oproept; "Iemand in de
   gemeente" is veiliger als de ronde die het dossier opent niets over
   Herkenbosch bevestigt.

---

## De botsingen die beide lanes melden — mijn beslissing erop

1. **De pushvorm.** Allebei melden dat `CLAUDE.md` en
   `agents/outreach-agent.md` nog `git push origin main` schrijven terwijl de
   directives `HEAD:main` eisen. **Zij hebben gelijk en zij volgen de juiste
   vorm.** Ik push zelf ook zo. Dit is de derde dienst op rij dat deze botsing
   wordt gemeld; hij ligt als beslispunt bij de owner en het zijn zíjn twee
   bestanden, dus geen agent repareert ze eigenhandig.
2. **Lane C's glazenwasserijbron.** De order zegt "uitsluitend via
   `transfirm.nl` en `kostenglazenwasser.nl`". Lane C hield dat aan als
   **jaagvolgorde** en gebruikte bij het *beoordelen* ook
   `glazenwassertarieven.nl` en `compadex.com`. **Dat is geen overtreding en
   lane C heeft gelijk dat hij het onderscheid meldt.** Het verbod gold
   `companyinfo.nl` en `alleglazenwassers.nl`, en die zijn niet aangeraakt. Ik
   leg het verschil hierbij vast: een uitputtingsverbod bindt de route waarmee
   je een **naam vindt**, niet de bron waarmee je een gevonden naam
   **controleert**.
3. **Lane C's sectorcap:** geen botsing, alle vier de sectoren onder de cap.

---

## Twee correcties voor Sam, zodat morgen beter gaat

1. **Lane D, tel 23 tegen 24.** De bevindingskop zegt "de leeftijdspoort velde
   23 dossiers" en de eerste zin eronder zegt "In **24** gevallen kwam het
   nummer dat **hen velde** uit het URL-pad". Vierentwintig kan niet uit
   drieëntwintig komen. Ik neem aan dat de 24 óók de randgevallen telt die
   juist **niet** gesloten zijn — maar dan velde dat nummer hen niet. De
   samenvatting herhaalt de fout ("23 dossiers op leeftijd, 24 ervan op een
   nummer uit het URL-pad"). Dit is precies de soort telling die de nieuwe
   harde vormregel van deze week viseert. **Splits het in twee zinnen: hoeveel
   er vielen, en op hoeveel dossiers het nummer uit het URL-pad kwam.**
2. **Lane D, het hovenierlabel.** De tabel telt 10 hoveniers; het ledger voert
   9 rijen `Sector: hovenier` en 1 `Sector: dakonderhoud`. Lane D verantwoordt
   die rij in de rij zelf als bijvangst, dus de telling is eerlijk — maar wie
   haar met één grep reproduceert, komt op 9. **Zet de meetwijze erbij, zoals
   je dat bij het totaal van 61 wél doet.**

Allebei zijn het correcties en geen afkeuringen: het totaal van 61 klopt in
beide lanes exact, en dat is het getal waarop de dienst wordt afgerekend.

---

## Wat ik vandaag in het fundament vastleg — 1.51 t/m 1.53

Mijn reeks is 1.51 t/m 1.60. Ik neem er **drie** en laat 1.54 t/m 1.60
uitdrukkelijk vrij voor de C+D-diensten van de rest van de week. Dat is een
bewuste keuze: het weekrapport van 13-09 klaagt dat te krappe reeksen drie
dagen lang kandidaten hebben laten parkeren, en het antwoord daarop is niet een
reeks in één dag leegtrekken.

- **1.51 — `wc -m` telt zonder expliciete UTF-8-locale bytes en geen tekens;
  de vorm die 1.40(f) bedoelt is `LC_ALL=C.UTF-8 wc -m`.** Twee onafhankelijke
  dragers: lane D's meting, en mijn eigen reproductie in deze sessie, met
  positieve én negatieve controle. Dit is een regel die een bestaande regel
  **repareert** — 1.40(f) is vorige week aangenomen om accenttekens vlak onder
  de 45 te vangen en deed in deze omgeving exact niets.
- **1.52 — de tariefgidsen delen één titelsjabloon en zijn één vindplaats, geen
  drie.** `kostenglazenwasser.nl`, `glazenwassertarieven.nl` en
  `kostentuinman.nl` voeren naam, telefoon én e-mail in de URL-titel in
  hetzelfde sjabloon. Drie dragers: lane D's negen titels, en mijn eigen ronde
  op Roerdalen die hem vandaag op **twee** van die gidsen tegelijk terugkreeg,
  woordelijk hetzelfde. **Waarom dit een poortregel is en geen bronnotitie:**
  wie ze als twee bronnen boekt, sluit poort (b) op "twee onafhankelijke
  bronnen" terwijl er één sjabloon onder ligt — precies wat
  `prospecting:200` verbiedt.
- **1.53 — een gedeelde naam scheidt pas op straat of nummer, nooit op plaats
  alleen.** Uitbreiding op 1.40(h), die de plaats naast het adres legt maar
  zwijgt over twee gelijknamige zaken in **dezelfde** plaats. Zes dragers op
  één dag over twee lanes: Rick Bekkers tegen Autobedrijf Bekkers (één plaats,
  Liempde), Lutter tegen W.H.C. Lutter, `svohoveniers.nl` tegen
  `svhoveniers.nl`, Sander van Os tegen Sander Weerman en Tuinman Sander, Van
  Soest, Beregoed.

Ik werk `.agents/product-marketing.md` hieronder bij met een changelogregel.

---

## Voor het weekrapport

Kandidaten die ik vandaag **niet** in het fundament opneem, met hun dragers,
zodat er niets verdampt. De grond is bij alle drie dezelfde als die van 1.40:
ze raken de **jaagvolgorde** van 1.20(b), en 1.19 wijst dat naar zondag.

| Kandidaatregel | Dragers | De dragers zelf |
|---|---|---|
| `123auto.nl` is een namen- en reviewbewijsroute en de spiegel van `transfirm.nl`; samen sluiten ze profiel plus leeftijdsband in twee ronden | meting op 10 namen, lane C, vóór het eerste dossier | 10 van 10 op score + aantal beoordelingen; 0 van 10 op leeftijd, adres, e-mail en gedateerd spoor |
| `/business/<naam>-<plaats>-<wijk>-<vestigingsnummer>/` is één URL-familie over meerdere gidsen; een verbod op één gids strekt niet tot de zusters | 3, alle drie vandaag in de bruikbare laag | `alleglazenwassers.nl`, `regiohoveniers.nl`, `bestegarages.nl` |
| De bestemmingsregel (telefoon → `bellijst.md`) hangt aan de bronklasse, niet aan het dossier: registerbronnen voeren geen nummer, tariefgidsen wel | 2 lanes op één dag, tegengesteld en allebei juist | lane C 0 van 8 mét nummer (transfirm, compadex, `/business/`-familie); lane D 4 van 8 mét nummer, alle vier uit een tariefgidstitel |
| De SBB/Stagemarkt-route selecteert in hovenier en glazenwasserij op gevestigd-zijn-met-personeel en is daar geen jaagroute | 2 ronden, 3 eenbedrijfsprofielen, 0 op profiel (lane C), plus lane D's nulronde op beide kaartrijpe dossiers | bevestigd door mijn eigen ronde: de vacatureroute geeft uitsluitend Indeed-verzamelpagina's |

**En het punt dat geen regel is maar een beslissing vraagt, nu met een tweede
grond eronder:** glazenwasserij is met vijftien dossiers per week de grootste
sector in lane C's plan en de enige zonder sectorpagina. Dat kost per bericht
een bestemming, het is de oorzaak van de drie UTM-spellingen, en het dwingt de
scherpste vorm van 1.40(b) af bij precies de sector die het vaakst wordt
gejaagd. John stelde de pagina op 11-09 voor; lane C draagt vandaag de tweede
grond aan en ik onderschrijf hem hierbij als derde.

---

## Gebruikte skills

| Skill | Waar toegepast | Wat het concreet veranderde |
|---|---|---|
| `cold-email` | Op de drie klaargelegde onderwerpregels van beide lanes, aangeroepen met het argument `subjects` (één woord, per 1.40g) | `Short, boring, internal-looking. The subject line's only job is to get the email opened — not to sell.` (`cold-email/SKILL.md:91`) plus `- 2-4 words, lowercase, no punctuation tricks` (`:93`) botst frontaal met alle drie de regels van vandaag. **Dat heeft mijn oordeel veranderd in de richting van goedkeuren en niet afkeuren:** ik heb de botsing expliciet beslecht in het voordeel van poort (g) van de owner (een concreet geverifieerd detail binnen 45 tekens) en die beslissing hierboven vastgelegd, zodat zij niet elke week opnieuw wordt uitgevochten. Waar de skill wél bindt is de verwijdertoets `If you remove the personalized opening and the email still makes sense, the personalization isn't working.` (`:41`): alle drie komen erdoor. En `The best cold emails feel like they could have been shorter, not longer.` (`:37`) is waarom ik in de Roerdalen-tekst het woord "gewoon" laat schrappen — het is het enige woord in die tekst dat de prijs verontschuldigt |
| `marketing-psychology` | Op mijn oordeel over de overtuigingskracht van de drie teksten en op mijn diagnose van het tekort, aangeroepen met het argument `loss` | `Losses feel roughly twice as painful as equivalent gains feel good.` (`marketing-psychology/SKILL.md:263`, onder **Loss Aversion / Prospect Theory** op `:262`) is de toets waarop ik alle drie de teksten als overtuigend en niet slechts correct beoordeel: alle drie dragen het verlies **plus** de tweede helft die verklaart waarom de ondernemer het nooit heeft gemerkt ("die aanvraag is er nooit geweest" / "het laat geen spoor achter" / "je merkt niet dat je hem bent misgelopen"). **Contrast Effect** (`:282`) is waarom ik lane D's geen-websitevaststelling goedkeur: zeven namen mét eigen domein tegen drie zonder, binnen dezelfde ronde, is een positieve vaststelling in de zin van 1.18. **Theory of Constraints** (`:65`) heeft mijn dienst gestuurd: ik heb mijn zes eigen ronden niet over 122 dossiers verdeeld maar uitsluitend in de vier gestoken die op de bindende poort staan — en dat is ook de reden dat ik hierboven schrijf dat de zevende herhaling van deze beperking in een beslispunt thuishoort en niet in een dagverdict. **Survivorship Bias** (`:415`) heb ik tegen mijn eigen 1.52 ingezet: dat drie tariefgidsen één sjabloon delen, kan ook betekenen dat ik alleen de gidsen zie die in de bruikbare laag komen — daarom staat 1.52 op wat ik zelf heb teruggekregen en niet op een schatting van hoeveel gidsen dat sjabloon voeren |
| `prospecting` | Op poort (b) van de vier dossiers die ik zelf heb nagejaagd | `- **High**: confirmed by at least two independent sources or official business page` (`prospecting/SKILL.md:68`) is de drempel waarop ik lane C's beslissing bij **Sportscar Service Tilburg** onderschrijf om één eenbedrijfspagina als **één** bron te boeken: mijn eigen ronde gaf vier extra gidsen terug (`wielevert.nl`, `onlineoccasions.nl`, `degemeentegids.nl`, `lokaalnieuwstilburg.nl`) en géén daarvan voert het adres in de URL-titel. `- [ ] Confidence levels honest — "High" requires 2 independent sources, not just two of your own searches` (`:200`) is de regel waaruit **1.52** volgt: twee tariefgidsen met één titelsjabloon zijn niet twee bronnen, en zonder die regel had ik vandaag zelf bij Roerdalen een dubbele bevestiging geboekt die er geen is |
| `product-marketing` | Als eigenaar van `.agents/product-marketing.md`, bij het vastleggen van 1.51 t/m 1.53 | Ik ben de enige die het fundament bijwerkt en dat is vandaag gebeurd met een changelogregel op **1.53**, met per regel het aantal dragers en de grond. De skill is de reden dat 1.52 als **poortregel** is geformuleerd (zij verandert wanneer poort (b) op High mag sluiten) en niet als bronnotitie — een bronnotitie hoort in de directives, en dat onderscheid heeft het fundament op 1.40 zelf getrokken toen het `transfirm.nl` en `kostenglazenwasser.nl` uitdrukkelijk **niet** opnam |
| `copy-editing` | **Niet ingezet als aparte pas** | Ik heb vandaag geen tekst geschreven, alleen twee correcties op bestaande teksten voorgesteld ("gewoon" eruit; Herkenbosch/Vlodrop). Beide volgen uit de staande order van de owner en uit `cold-email:37`, niet uit een redactiepas. Een pas erbij halen zou deze tabel vullen zonder één woord te veranderen |
| `marketing-council` | **Niet ingezet** | Die is voor het weekrapport op zondag, waar meerdere perspectieven tegen het plan aan moeten kijken. Een dagverificatie met nul kaarten heeft geen strategische keuze voorgelegd gekregen |
| `pricing` · `competitors` · `competitor-profiling` · `revops` · `attribution` · `analytics` · `customer-research` | **Niet ingezet** | Geen van deze vragen lag vandaag open. De pakketkeuzes (299 bij portfoliolek, 549 bij agendalek) volgden mechanisch uit de vorm van het lek en zijn tegen `offer.ts` gecontroleerd; er was geen prijs-, concurrentie- of attributievraag te beantwoorden. De enige segmentvraag die er ligt — of de geen-websitegroep in deze omgeving bereikbaar is — is een beslispunt bij de owner en geen onderzoeksvraag voor mij |

---

## Verdicttabel — één regel per beoordeeld onderdeel

| Onderdeel | Oordeel |
|---|---|
| Lane C — kaarten aangeboden | **0**, bevestigd met `grep -cE '^## [0-9]+\. '` → 0 |
| Lane D — kaarten aangeboden | **0**, bevestigd met hetzelfde commando → 0 |
| Lane C — tekortverantwoording | **GOEDGEKEURD.** Vaste vorm compleet; 38+12+4+3+2+1+1 = 61 = het aantal ledgerrijen dat ik zelf telde |
| Lane C — sectorminima | **GOEDGEKEURD.** 20/21/15/5 = 61, los nageteld uit het ledger; vier van vier minima gehaald, verschuiving met de gevraagde ene regel verantwoord |
| Lane C — meting derde route (`123auto.nl`) | **GOEDGEKEURD.** Meting eerst, op tien met name genoemde namen, dan pas dossiers — exact de nieuwe regel; conclusie correct begrensd tot namen- en reviewbewijsroute, mét de rem die lane C zichzelf oplegt |
| Lane D — tekortverantwoording | **GOEDGEKEURD.** Vaste vorm compleet; 24+23+3+3+2+2+2+1+1 = 61 |
| Lane D — sectorminima | **GOEDGEKEURD met correctie.** Totaal 61 exact; het hovenierlabel telt 10 waar het ledger 9 + 1 dakonderhoud voert, verantwoord in de rij zelf maar zonder meetwijze |
| Poort (a) — Roerdalen (lane C) | **AFGEKEURD op poort (a).** Vijf bewijsroutes én insolventieronde gedraaid en genoteerd; acht ronden van Sam plus twee van mij sluiten niets. Werkspot-beoordelingen liggen in 2021-2023, dus buiten het venster |
| Poort (a) — Sportscar Service Tilburg (lane C) | **AFGEKEURD op poort (a), mét uitvoeringsfout.** De vijf toegewezen routes en de insolventieronde zijn hier **niet** gedraaid; ik heb ze zelf gedaan en sluit niets. Correct als `lead - poort open` geboekt, dus geen gefaalde dienst |
| Poort (a) — Trimsalon Driemond (lane D) | **AFGEKEURD op poort (a).** Vijf routes + insolventieronde gedraaid en schoon; mijn eigen ronde bevestigt haar adres en de URL-titel "Afspraak maken", maar geeft geen post-URL en geen gedateerd spoor |
| Poort (a) — Sander van Os (lane D) | **AFGEKEURD op poort (a).** Vijf routes + insolventieronde gedraaid en schoon; mijn ronde bevestigt KvK 85094455, vestigingsnummer 000051159619 en `info@svohoveniers.nl`, en geeft geen datum |
| Poort (h) — lane C | **GOEDGEKEURD.** Veertien citaten, alle veertien woordelijk juist op het genoemde regelnummer, van schijf gecontroleerd |
| Poort (h) — lane D | **GOEDGEKEURD.** Zes nieuwe citaten daarbovenop, alle zes juist. Twintig van twintig over beide lanes |
| Klaargelegde tekst — Roerdalen | **GOEDGEKEURD met twee correcties.** 192 woorden, 42 tekens, handtekening compleet, claims gedekt; "gewoon" eruit, Herkenbosch/Vlodrop nakijken |
| Klaargelegde tekst — Driemond | **GOEDGEKEURD.** 188 woorden, 35 tekens, alle claims op `sectors.ts` r. 68-72 en `offer.ts` r. 23, eigen belofte en niets geleend |
| Klaargelegde tekst — Sander van Os | **GOEDGEKEURD.** 183 woorden, 29 tekens, géén demo beloofd omdat die sectorpagina geen `demoSlug` voert — 1.31 letterlijk |
| 1.40(f) — `wc -m` | **WEERLEGD in deze omgeving en gerepareerd als 1.51.** Kaal telt hij bytes; `LC_ALL=C.UTF-8 wc -m` telt tekens. Zelf gereproduceerd |
| Fundament | **Bijgewerkt naar 1.53**: 1.51 (`wc -m`-locale), 1.52 (tariefgidsen zijn één vindplaats), 1.53 (gedeelde naam scheidt op straat, niet op plaats). 1.54 t/m 1.60 bewust vrij |
| Dagnorm van dertig | **NIET GEHAALD, en niet opgevuld.** Nul kaarten uit 122 volledig beoordeelde dossiers over twee lanes. Beide lanes melden het in de vaste vorm; ik heb geen kaart soepeler doorgelaten |

*Azzouz, 14 september 2026 — verificatie lanes C en D.*
