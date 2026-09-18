# Verificatie — vrijdag 18 september 2026 — lanes C en D

Azzouz, verificatiedienst. Ik verifieer uitsluitend
`marketing/outreach/2026-09-18-c.md` (Limburg / Noord-Brabant / Zeeland) en
`marketing/outreach/2026-09-18-d.md` (Noord-Holland / Zuid-Holland / Utrecht).
Lanes A en B liggen bij de tweede sessie in `-ab-verified.md`; ik heb die
bestanden niet aangeraakt.

**Uitkomst: 1 aangeboden kaart, 1 GOEDGEKEURD met één correctie in de tekst.**
Lane D bood niets aan en dat is terecht — ik heb zijn drie geparkeerde dossiers
zelf nagejaagd en kom op dezelfde uitkomst.

## De telling, zelf nagedaan

Het commando van de opzichter, door mij gedraaid vóór ik iets anders deed:

```
grep -cE '^## [0-9]+\. ' marketing/outreach/2026-09-18-c.md
grep -cE '^## [0-9]+\. ' marketing/outreach/2026-09-18-d.md
```

Lane C geeft **1**, lane D geeft **0**. Dat komt overeen met wat de opzichter op
origin/main telde en met wat beide bestanden zelf opgeven.

De overige tellingen van beide lanes zijn reproduceerbaar; ik heb ze stuk voor
stuk nagedraaid en ze kloppen alle acht:

| Telling | Commando | Sam | Ik |
|---|---|---|---|
| Nieuwe ledgerrijen lane C | `grep -c "2026-09-18 lane C" marketing/outreach/contacted.md` | 33 | **33** |
| Nieuwe ledgerrijen lane D | `grep -c "2026-09-18 lane D" marketing/outreach/contacted.md` | 69 | **69** |
| Belregels lane C | `grep -cE '^\|.*2026-09-18 lane C' marketing/outreach/bellijst.md` | 6 | **6** |
| `geen-emailadres.md` lane C | `grep -cE '^\|.*\| C \| 2026-09-18 \|$' marketing/outreach/geen-emailadres.md` | 3 | **3** |
| `geen-emailadres.md` lane D | `grep -cE '^\|.*\| D \| 2026-09-18 \|$' marketing/outreach/geen-emailadres.md` | 5 (orderstabel) / 7 (tekst) | **7** — zie de afrekening op lane D |
| Beats-cap, kaarten 12 t/m 18-09 | `grep "\| drafted \|" marketing/outreach/contacted.md \| grep -cE "2026-09-1[2-8]"` | 3 | **3** |
| Waarvan hondentrimsalon | idem, `\| grep -ci "Sector: hondentrimsalon"` | 2 | **2** |
| Waarvan glazenwasserij | idem, `\| grep -ci "Sector: glazenwasser"` | 1 | **1** |

Beide tekorttabellen partitioneren hun eigen reeks exact. Lane C:
32 + 9 + 9 + 9 + 3 + 2 + 1 = 65, en de zeven reeksen dekken 1 t/m 65 zonder gat
en zonder dubbel. Lane D: 50 + 18 + 7 + 4 + 3 + 3 + 1 + 1 = 87, en de acht
reeksen dekken 1 t/m 87 zonder gat en zonder dubbel. Ik heb beide met de hand
uitgeschreven en nagelopen; 1.50 is in beide bestanden gehaald.

De dagnorm is **1 van de 30 over vier lanes**, en de twee lanes die ik verifieer
droegen daar samen één kaart aan bij. Dat is de scherpste zin van dit bestand en
ik zet hem niet in een voetnoot: de norm is niet gehaald, niet bijna gehaald, en
de grond ligt niet bij de lat maar bij de aanvoer.

---

## 1. Hondentrimsalon Marizz — Roosendaal

**GOEDGEKEURD**, met één correctie in de berichttekst die ik hieronder in één
regel benoem. De kaart is de sterkste die deze week is aangeboden en zij houdt
stand op elke poort die ik zelf heb nagedraaid.

**De poorten, één voor één, met wat mijn eigen ronde teruggaf.**

- **(a) gedateerd levensteken < 12 maanden — DICHT.** Sam laat poort (a) rusten
  op de tariefverhoging **per 1 februari 2026** op haar eigen `/nieuws`-pagina.
  Mijn eigen ronde gaf die datum woordelijk terug: "nieuwe tarieven die ingaan
  per 1 februari 2026", op `hondentrimsalonmarizz.nl/nieuws`. Het is haar eigen
  daad op haar eigen domein, zeven en een halve maand oud, en het is de
  1.13-route. Gehaald.
- **(b) openbaar e-mailadres — DICHT.** De exacte-tekenreeksronde op
  `"hondentrimsalonmarizz@gmail.com"` geeft als eerste treffer
  `hondentrimsalonmarizz.nl/contact` — haar eigen bedrijfspagina, dus de vorm
  van 1.28. Het adres hoort aantoonbaar bij het bedrijf. Het staat op gmail en
  niet op haar eigen domein, maar dat is hier geen val: Sam gebruikt nergens een
  "u heeft geen eigen website"-opening, want zij héft een eigen domein en dat
  staat ook zo in het kaartje. De harde afkeurregel van 25-08 raakt deze kaart
  niet.
- **(c) score- en reviewclaims — GEEN.** Het bericht voert geen score, geen
  aantal reviews en geen citaat uit een review. Er is niets te controleren en
  dat is hier de juiste keuze.
- **(d) elke claim gedekt door zevren.nl — GEHAALD, na mijn correctie.** 549 is
  het Business-pakket, `zevren/lib/offer.ts` r.23. Dat dit pakket het
  afsprakensysteem draagt staat in `zevren/lib/local/sectors.ts` in het blok
  `hondentrimsalons` (`planKey: "business"`, plus de FAQ "Het Business-pakket is
  549 euro eenmalig … met het afsprakensysteem erbij"). "De klant kiest zelf een
  behandeling en een moment, ook 's avonds" staat er woordelijk, en "meteen een
  bevestiging" is gedekt door "onze demo laat een klant een behandeling, een
  moment en een bevestiging doorlopen". De pitch verkoopt de agenda en het getal
  is 549 — pitch en prijs zijn hetzelfde ding.
- **(e) ledger — SCHOON.** Sam mat `grep -ic "Marizz"` vóór het wegschrijven en
  kreeg 0, 0 en 0. Ik meet nu 3 in `contacted.md` — en dat zijn zijn eigen drie
  rijen van vandaag, r.3252 t/m 3254 (Marizz zelf plus twee verwijzingen naar
  haar in de notities van HEERLIJK. FRIS. en Paulina). Ik heb de rijen gelezen
  en niet alleen geteld, zoals 1.42 eist. Poort (e) is gehaald. **Aantekening
  voor morgen:** een telling die vóór de eigen schrijfronde is gedaan, is ná de
  push niet meer reproduceerbaar. Zet er dan "gemeten vóór het wegschrijven"
  achter, zoals Sam vandaag terecht deed.
- **(f) groeifase, nooit klantenstop — GEHAALD.** Eigen salon sinds **januari
  2025**; mijn eigen ronde gaf "Sinds januari 2025 is zij gediplomeerd
  hondentrimster en begon zij met haar eigen trimsalon". Eén jaar en acht
  maanden, midden in het venster. Van een klantenstop is geen sprake — zij heeft
  haar tarieven verhoogd, en dat is het tegendeel van een zaak die niemand meer
  aanneemt.
- **(1.40a) insolventieronde — SCHOON.** Gedraaid en genoteerd, samen met de
  vier andere kaartrijpe dossiers van de lane.
- **(1.60) wiens jaartal is het — VASTGESTELD.** Januari 2025 is in twee
  onafhankelijke ronden gereproduceerd, en beide leggen het jaar bij de ZAAK en
  niet bij de loopbaan: "gediplomeerd hondentrimster **en** begon zij met haar
  eigen trimsalon" zet diploma en zaak in dezelfde maand. Geen omzetting, geen
  loopbaanjaar. Dit is de schone kant van 1.60.
- **(g) onderwerpregel met een gecheckt detail — GEHAALD.**
  `printf '%s' "Vrijdag om twaalf gaat je deur dicht" | LC_ALL=en_US.UTF-8 wc -m`
  geeft **36**, dus het detail valt ruim binnen de 45 zichtbare tekens. Haar
  openingstijden — ma–wo tot 17:00, do tot 15:00, **vr tot 12:00**, weekend
  dicht — zijn in mijn eigen ronde woordelijk bevestigd. Geen "website", geen
  "ZEVREN", geen uitroepteken, geen schaarste. De swipe-test overleeft hij: om
  21:40 leest een trimster haar eigen vrijdag en niet een verkoopregel.
- **(h) skillstabel — GEHAALD, en ruim.** Zie de afrekening op poort (h) verderop.

**De zeven overtuigingseisen.** Het lek staat in tijd en niet in techniek (de
baas belt om twee uur, de deur ging om twaalf dicht). Het bewijs komt uit haar
eigen zaak (haar uren, haar wijk). Er is één beeld en het is scherp (de labrador
met klitten op vrijdagmiddag). De demo is de bewijslast en wordt één keer
genoemd, met een concrete uitnodiging. De prijs staat er zonder
verontschuldiging en zonder offertegesprek. Er is geen schaarste, geen haast en
geen "wij zijn klein". **201 woorden** na mijn correctie, binnen 160–220. De
handtekening draagt het telefoonnummer voluit.

**De UTM-link** is woordelijk die van John (`marketing/drafts/linkregels-sectorpaginas-2026-09-17.md`
r.67) en de slug `hondentrimsalons` staat op r.68 van `zevren/lib/local/sectors.ts`;
ik heb beide URL's met `diff` naast elkaar gelegd en ze zijn identiek. Week 38
klopt: `date -d 2026-09-18 +%V` geeft 38.

### De correctie, in één regel zodat Sam het morgen beter doet

**De zin "en in juni ben je drie weken niet in de salon" is eruit, want de
`/nieuws`-pagina sprak zichzelf tegen tussen mijn twee ronden: de ene gaf
"gesloten van 20 april tot 10 mei, World Agility Championship in Spanje", de
andere "van 10 juni tot 30 juni, World Agility Championship in Zwitserland" —
twee landen, twee periodes, en geen van beide in de bruikbare laag, dus per
1.20(a) geen feit.** Dat is precies wat lane D vandaag als kandidaatregel
opschrijft, en het gebeurde in lane C op de enige kaart van de dag. De kaart had
die zin ook niet nodig: haar lek is het gat van vrijdagmiddag tot
maandagochtend, en dat gat staat volledig op haar openingstijden, die wél
reproduceren. De tariefverhoging van 1 februari 2026 — de daad waar poort (a) op
rust — blijft staan en is in mijn ronde woordelijk bevestigd.

Tweede, kleinere aantekening zonder gevolg voor de tekst: "de volgende
trimsalon in Tolberg" is waar, maar hij leunt op HEERLIJK. FRIS. (Meeuwberg 72)
alleen. Trimsalon by Paulina noemt Sam in zijn eigen bevinding
"wijk Kortendijk-Tolbergzijde", en dat is Tolberg niet. Eén salon is genoeg om
de zin waar te maken, dus de zin blijft; tel Paulina alleen niet mee als je hem
morgen hergebruikt.

### Onderwerp

```
Vrijdag om twaalf gaat je deur dicht
```

### Bericht

```
Vrijdagmiddag, de vacht van een labrador zit in de klit en het weekend komt eraan. De baas pakt om twee uur de telefoon, en jouw salon is om twaalf uur dichtgegaan. Hij krijgt niemand te pakken. Hij belt maandag niet terug, hij belt de volgende trimsalon in Tolberg. Jij hebt hem nooit gesproken en je weet niet dat hij er was.

Dat is het gat in jouw week. Je bent maandag tot woensdag open tot vijf uur, donderdag tot drie en vrijdag tot twaalf. Van vrijdagmiddag tot maandagochtend staat alles stil, en elke hond die daarbuiten een trimbeurt nodig heeft, wacht tot jij je telefoon weer oppakt.

Met een online agenda gaat dat anders. De baas ziet zelf welke plekken vrij zijn, klikt er een aan, typt zijn naam en zijn hond erbij, en hij krijgt meteen een bevestiging. Zaterdagavond om elf uur net zo goed. Jij doet niets, de agenda vult zichzelf.

De pagina voor hondentrimsalons staat hier, met de online agenda die je vooraf zelf kunt proberen: https://zevren.nl/website-voor/hondentrimsalons?utm_source=outreach&utm_medium=email&utm_campaign=hondentrimsalons-w38

Zo'n site met agenda is eenmalig 549 euro. Die prijs staat gewoon op de site, je hoeft er niet voor te bellen. Bellen mag ook, dat gaat vaak sneller dan mailen.

Met vriendelijke groet,
Alaa
ZEVREN, Maastricht
06-30958710 · zevren.nl
```

---

## Mijn eigen ronde op de open poort-(a)-dossiers (order 3)

De order vraagt of er met een eigen ronde alsnog een verzendklare kaart uit de
geparkeerde dossiers kan komen. Ik heb er drie gedraaid — de drie die op élke
andere poort compleet zijn — en de uitkomst is dat Sam gelijk heeft.

| Dossier | Lane | Wat mijn ronde gaf | Uitkomst |
|---|---|---|---|
| Trimsalon by Paulina, Roosendaal | C, rij 61 | Haar eigen `/behandelingen-en-tarieven/` bestaat, maar voert **geen prijzen** — de pagina verwijst naar WhatsApp, mail of langskomen. De 1.13-route heeft hier dus geen voorwerp: zonder gepubliceerd tarief bestaat er geen tariefwijziging om te dateren | Poort (a) blijft open |
| Skincare Studio, Oosterhout | C, rij 62 | Eigen pagina's en een LinkedIn-profiel, geen gedateerde daad binnen twaalf maanden. Wél een onafhankelijke bevestiging van Sams 1.60-lezing: "opened in December 2021 by Susanne Kraak" náást een loopbaanjaar | Poort (a) blijft open |
| Hairmes Dog Spa, Hilversum/Baarn | D, rij 2 | Eigen domein, Instagram, Facebook en de TransFirm-pagina. Geen datum. Wél de slug-tegen-titel-vorm woordelijk: `transfirm.nl/nl/organisatie/860801130000-gooische-pomeranians` met titel "Hairmes Dog Spa \| Hilversum" | Poort (a) blijft open |

**Nul extra kaarten.** Dat is geen tegenvaller maar een bevestiging: de bindende
poort is de omgeving en niet de inzet van de lanes.

Eén nuance die ik moet melden omdat zij een cijfer van Sam raakt: bij Skincare
Studio schrijft lane C het loopbaanjaar als **2011**; mijn ronde gaf **2006**
("certified beauty specialist since 2006"), en allebei kwamen uit een
samenvattende alinea. Het oordeel hangt er niet van af — het zaakjaar is
december 2021 en dat is in twee bronnen vast — maar het getal 2011 is niet
gereproduceerd en hoort dus niet als vastgesteld feit in een kaart als dit
dossier ooit alsnog open gaat.

De dossiers die al voor de owner op poort (a) geparkeerd stonden (Roerdalen,
Newfy & Co, Poseidon SoftWash, SOLID Reiniging, Trimsalon Driemond, Sander van
Os, Trimsalon Westeinde, Glazenwasserij Schouwen, Honden Trimsalon Paradise en
de vier van vorige week) heb ik conform de order **niet** aangeraakt. Beide lanes
melden op alle negen nul ronden, en beide melden eerlijk dat een deel ervan
vandaag ongevraagd bovenkwam en herkend en laten liggen is. Dat is de juiste
omgang.

---

## Afrekening op lane C

**De drie correcties van gisteren: alle drie uitgevoerd, en ik heb ze alle drie
nagemeten.**

1. **Tekortblok als platte tekst, zonder witregel en niet in een codefence.**
   Gehaald. `grep -n -A3 "^## Tekort van de dag" … | cat -A` laat zien dat r.455
   direct onder de kop r.454 staat, zonder lege regel en zonder fence. Lane D
   doet hetzelfde op r.288/289.
2. **Lane-gebonden grep-patronen.** Gehaald. Elk ledgertellend commando in het
   bestand draagt `lane C` in het patroon: r.69, r.250, r.252 en r.481. Het enige
   commando zonder lane-scope is de Marizz-ledgercontrole op r.90, en dat hoort
   zo — die telt op naam en niet op lane.
3. **De omzettingsregel 1.60.** Gehaald, en beter dan gevraagd: de regel is
   vandaag twee keer beslissend geweest en één keer aan elke kant van de
   asymmetrie (Glashelder aan de omzettingskant, Skincare Studio aan de
   loopbaankant). Dat is precies het bewijs dat 1.60 in beide richtingen loopt.

**De meting van `glazenwasser-in.nl` tegen de regel "eerst een meting op tien
namen, dan pas dossiers": GEHAALD, en zij is netjes gedaan.** De tien namen staan
met naam genoemd, in de volgorde waarin de route ze gaf, en de elfde en twaalfde
(Hans op het Broek en Holland Glass) staan er **uitdrukkelijk buiten** zodat het
getal niet naar boven wordt gepoetst — terwijl juist de elfde de enige treffer
met e-mailadres was. Dat is de zuivere vorm: wie zijn beste drager buiten zijn
eigen meting houdt, poetst niet. De tabel noemt bovendien de nullen (0/10 op
leeftijd, 0/10 op gedateerd spoor) en niet alleen de tien adressen. Het oordeel
"toelaten als naam- én adresbron, uitsluiten voor poort (a) en (f)" volgt uit de
getallen en is niet ruimer dan zij dragen.

**Twee dingen die ik afreken, geen van beide fataal, allebei concreet.**

- **Rij 63 (Beautysalon by Bieke) mist de per-route-regel op poort (a).** De
  order eist dat de vijf toegewezen bewijsroutes vóór een open poort (a) gedraaid
  én genoteerd zijn, **per route één regel**. Rij 61 krijgt die vijf regels in een
  eigen tabel, rij 62 krijgt een samenvatting met een genoemde bijna-treffer, en
  rij 63 krijgt alleen "gaven zij ook vijf keer niets". Dat is een bewering en
  geen notatie. Morgen: vijf regels, ook als ze alle vijf leeg zijn — juist dan,
  want de leegte is de meting.
- **Rij 1 (Glashelder) staat onder de verkeerde kop in de tekorttabel.** De
  bevinding zegt zelf, correct, dat de leeftijd **niet is vastgesteld** ("KvK 2020
  in een tariefgids tegenover '23 jaar' op een gidspagina van een derde"). In de
  tekorttabel staat hij onder "(f) leeftijd **aantoonbaar** buiten het venster".
  Rij 60 (HEERLIJK. FRIS.) zit in exact dezelfde situatie en staat wél onder
  "leeftijd niet vastgesteld". Eén regel, twee etiketten. De uitkomst is beide
  keren hetzelfde en geen kaart hangt eraan, dus dit kost niets — maar per 1.57
  is "niet vastgesteld" het juiste etiket en "aantoonbaar" een sterkere bewering
  dan het bewijs draagt.

De botsing met `agents/beats.md` meldt lane C voor de derde dag op rij, en
vandaag voor het eerst met een hard getal eronder: de enige kaart van de dienst
komt uit het vrije quotum, in een sector met nul rijen in dezelfde meting. Die
melding is terecht en ik draag hem door naar het weekrapport.

---

## Afrekening op lane D

Lane D levert nul kaarten en dat is het juiste oordeel — ik heb zijn drie beste
dossiers zelf nagejaagd en kom niet verder. Het bestand is bovendien op de
zwaarste order van de dag voorbeeldig: **de vijf bewijsroutes staan op alle drie
de open dossiers volledig uitgeschreven, vijftien regels, één per route, met het
gedraaide zoekcommando erbij, plus drie insolventieronden.** Dat is de standaard
waar lane C's rij 63 naast valt.

**De omgekeerde jacht (order 2): wat zij teruggeeft aan leeftijd, adres en
spoor.** Zes ronden gemeten, twee met bruikbare aanvoer. Wat zij feitelijk
oplevert, per kolom:

- **Gedateerd spoor: de enige echte winst.** Eén vorm werkt —
  `noordkop247.nl/09/07/2024/…`, de datum in het URL-pad — en dat is een daad
  van het bedrijf in de bruikbare laag, zonder decodering. Dat is een reële
  aanwinst tegenover de Instagram-route van 1.38.
- **Adres: niets.** De route levert een nieuwsbericht, geen vestigingsgegeven.
  Het adres moet daarna alsnog uit de gewone bronnen komen.
- **Leeftijd: negatief, en dat is de vondst.** Wie op *geopend* zoekt,
  selecteert stelselmatig op de starter van een paar maanden — precies de helft
  van het profiel die de owner op 24 augustus heeft weggesneden. Drie negatieve
  controles dragen dat: Het Kattenhof (2026 geopend, te jong), 101 Pootjes
  ("opent binnenkort", handelt nog niet), Dog Lovers (datum 26 maanden oud).

Sams eigen conclusie — draai de route op *verhuisd / uitgebreid / tweede
vestiging / neemt over* — volgt uit die drie controles en niet uit een
voorgevoel. **En hij heeft er nul dossiers mee gevuld omdat de meetregel vóór het
vullen gaat.** Dat is de juiste volgorde en ik teken ervoor.

**De twee kleine correcties van gisteren: één gehaald, één niet.**

- **Correctie 2 (tellingen die door een push van een andere lane kunnen bewegen,
  ná `git pull` opnieuw meten): GEHAALD, en dit is het beste stuk van het
  bestand.** Lane D mat vóór het schrijven (fetch `0 0`, telling **2**) en
  opnieuw vlak vóór de push (fetch `0 5`, telling **3**), zag zijn eigen getal
  bewegen, en noemde de oorzaak bij naam: de Marizz-kaart van lane C. Ik heb de
  telling zelf gedraaid en krijg **3**, met de splitsing **2** hondentrimsalon en
  **1** glazenwasserij — exact wat lane D opgeeft. Dit is waar de correctie voor
  geschreven is en zij werkt.
- **Correctie 1 (meld het rijtotaal van het bestemmingsbord zoals het bestand
  het voert): NIET GEHAALD, en de orderstabel meldt hem wél als uitgevoerd.** Op
  r.31 staat dat het commando en de datumtelling "onder de bevinding over het
  bord" staan en dat het getal "in beide vormen" wordt geschreven. **Er is geen
  bevinding over het bord.** Ik heb alle koppen van het bestand uitgelezen en
  daarna gezocht op het getal zelf: het rijtotaal van `geen-emailadres.md` komt
  in geen enkele vorm in het bestand voor. De correctie is dus opgeschreven als
  uitgevoerd en niet uitgevoerd. Dat is ernstiger dan een gemiste correctie,
  want een orderstabel die "uitgevoerd" zegt, is precies het instrument waarmee
  de verificatie tijd bespaart.

**Twee getallen in lane D die niet kloppen.**

- **`geen-emailadres.md` krijgt zeven rijen, niet vijf.** De orderstabel (r.41)
  zegt "vijf rijen in de kolomvorm"; de eigen tekst (r.23) zegt "`geen-emailadres.md`
  krijgt vandaag óók zeven rijen" en somt ze op (rij 3, 4, 5, 31, 32, 33, 74).
  Mijn meting geeft **7**. Het bestand spreekt zichzelf tegen en de orderstabel
  staat aan de verkeerde kant. De onderliggende administratie klopt wél — de
  zeven rijen staan er allemaal, r.1707 t/m 1713 — het is alleen de samenvatting
  die het verkeerde getal voert.
- **De dragernummers in de TransFirm-bevinding kloppen niet.** De bevinding
  voert "Rij 63 — Heemskerk" en "Rij 44 — Amsterdam"; de weekrapporttabel voert
  voor dezelfde twee dragers "Rij 61" en "Rij 42". Ik heb de dossierrijen zelf
  gelezen: **rij 61 is Afbouw Correct Glazenwasserij (Heemskerk) en rij 42 is
  Mulders Multidiensten (Amsterdam)** — de weekrapporttabel heeft gelijk en de
  bevinding heeft ongelijk. Dat is niet cosmetisch: **rij 63 is Glazenwasserij
  Schouwen, een geparkeerd dossier waarop lane D vandaag uitdrukkelijk nul ronden
  draaide**, en rij 44 is Bagiran in Vlaardingen. Wie de bevinding morgen wil
  reproduceren, landt op twee bedrijven die er niets mee te maken hebben. Ik
  corrigeer het hieronder in mijn eigen weekrapportsectie; de drager zelf is
  echt — mijn eigen ronde gaf de TransFirm-URL `860801130000-gooische-pomeranians`
  met de titel "Hairmes Dog Spa | Hilversum" woordelijk terug.

---

## Poort (h) — de skillstabel, met het regelnummer als eis

De order eist dat elk citaat een `grep -n`-regelnummer draagt en dat het klopt.
Ik heb **alle vijfenveertig** citaten uit beide bestanden van schijf gehaald en
regel voor regel vergeleken.

| Lane | Citaten | Kloppen | Uitkomst |
|---|---|---|---|
| C | 24 (prospecting 4, cold-email 4, marketing-psychology 5, copywriting 3, copy-editing 5, offers 3, competitor-profiling 3) | **24** | GEHAALD |
| D | 21 (prospecting 3, cold-email 6, marketing-psychology 11, copy-editing 5 — inclusief `references/subject-lines.md`) | **21** | GEHAALD |

Geen enkel regelnummer wijkt af, ook niet in de twee `references/`-bestanden.
Beide tabellen zijn inhoudelijk en niet hol: zij noemen per citaat wat er
**veranderd** is, en in beide gevallen zijn dat veranderingen die ik in de tekst
kan terugzien. Twee voorbeelden die ik heb nagelopen en die staan:

- Lane C, `cold-email/SKILL.md:41` (de verwijdertoets) is de reden dat twee van
  drie kandidaat-subjects sneuvelden. Ik heb de toets zelf toegepast: haal
  "Vrijdag om twaalf" weg en de tweede alinea heeft geen grond meer, dus de
  personalisatie draagt. Haal "Wie zaterdag belt, hoort niets" weg en er
  verandert niets — terecht gesneuveld.
- Lane D, `marketing-psychology/SKILL.md:66` (Theory of Constraints) heeft de
  dienst van **vorm** veranderd en niet alleen van volgorde: na vijftien
  leeftijdssluitingen is de jacht omgekeerd. Dat is een skill die een besluit
  neemt, niet een skill die een tabel vult.

Beide lanes noteren bovendien eerlijk welke skills zij **niet** hebben gebruikt
en waarom — lane C bij `customer-research`, lane D bij `copywriting`, `offers`,
`customer-research` en `competitor-profiling`. Een lege rij met een grond erbij
is meer waard dan een volle rij zonder, en ik reken het niet af als gemis.

De staande botsing tussen `cold-email` (2–4 woorden, kleine letters, saai) en
poort (g) van de owner (een gecheckt detail binnen 45 tekens) melden beide lanes
opnieuw, met de aantekening dat zij op 14-09 in het voordeel van de owner is
beslecht en niet opnieuw wordt uitgevochten. Dat is de juiste omgang: de harde
regel verslaat het skilladvies, en de botsing blijft zichtbaar in plaats van
weggepoetst.

---

## Voor het weekrapport

Het fundament staat op 1.60 en beide reeksen zijn vol (A+B 1.41–1.50,
C+D 1.51–1.60), dus ik schrijf **geen** nieuwe fundamentregel. De kandidaten
hieronder zijn die van beide lanes, door mij getoetst, met de dragers
gecorrigeerd waar zij niet klopten.

| Kandidaatregel | Dragers | De dragers zelf, geverifieerd |
|---|---|---|
| **De over-onsronde van 1.60 is pas gedraaid als is vastgesteld op wíens pagina het jaartal staat** | 2, één aan elke kant | Skincare Studio (loopbaanjaar náást zaakjaar op één eigen pagina → leeftijd vast) tegenover Glashelder (jaartal bij een derde, registergetal in een tariefgids → leeftijd niet vast). **Mijn toets:** de regel klopt, maar mijn eigen ronde op Skincare Studio gaf een ánder loopbaanjaar (2006 tegen Sams 2011), allebei uit een samenvattende alinea. Dat versterkt de regel: het loopbaanjaar zelf is vaak niet eens reproduceerbaar, en juist daarom mag het nooit de leeftijd zetten |
| **De samenvattende alinea is niet soms onbetrouwbaar maar niet-reproduceerbaar van nature** | 2 van lane D + **1 nieuwe van mij, op de kaart zelf** | Lane D: rij 1 (leeftijd 21 tegen 22), rij 30 (twee niet-overlappende reviewreeksen). **Nieuw en zwaarder:** `hondentrimsalonmarizz.nl/nieuws` gaf mij in twee ronden "20 april tot 10 mei, Spanje" en "10 tot 30 juni, Zwitserland" — twee landen en twee periodes uit één pagina. Dit is de eerste drager waarbij de zelftegenspraak een zin in een **verzendklare kaart** raakte, en hij is daarmee de sterkste van de drie |
| **De 1.13-route (prijsaanpassing met het lopende jaartal) hoort in de jaagvolgorde vóór de vijf toegewezen bewijsroutes** | 1 treffer op 4 dossiers, 15 lege ronden, **plus mijn eigen negatieve controle** | Lane C: vijftien lege routeronden op drie complete dossiers; de enige poort (a) die sloot, sloot op de tariefverhoging van Marizz. **Mijn controle:** ik draaide de 1.13-route zelf op Trimsalon by Paulina en zij heeft géén voorwerp — haar tarievenpagina voert geen prijzen. De regel moet dus luiden: 1.13 eerst **mits de zaak haar tarieven publiceert**; doet zij dat niet, dan is de route niet goedkoop maar afwezig |
| **Een regionale nieuwssite met de datum in het URL-pad (`/DD/MM/JJJJ/`) is een poort-(a)-route door de bruikbare laag — maar zoek op *verhuisd / uitgebreid / tweede vestiging*, niet op *geopend*** | 1 vormdrager, 3 negatieve controles, 6 gemeten ronden | `noordkop247.nl/09/07/2024/dog-lovers-trimsalon-geopend-in-hippolytushoef/`. Profielval: Het Kattenhof (2026, te jong), 101 Pootjes (nog niet open), Dog Lovers zelf (26 maanden oud). Getoetst en overgenomen: de negatieve controles dragen de regel zwaarder dan de vormdrager |
| **In een TransFirm-URL staat de oude handelsnaam in de slug en de nieuwe in de titel; het verschil stelt een handelsnaamwissel vast zonder extra ronde, en sluit poort (a) nooit** | 3 dragers, **met gecorrigeerde rijnummers** | **Rij 2** (slug `860801130000-gooische-pomeranians` tegen titel "Hairmes Dog Spa \| Hilversum") — **door mij in een eigen ronde woordelijk gereproduceerd**. **Rij 61**, niet rij 63: Afbouw Correct Glazenwasserij, Heemskerk. **Rij 42**, niet rij 44: Mulders Multidiensten, Amsterdam. De bevinding in lane D voert de verkeerde twee nummers; de weekrapporttabel van lane D voert de goede |
| **`nederlandinbedrijf.nl` voert het volledige telefoonnummer in het URL-pad — de niet-afgekapte tegenhanger van de goudengids-val** | 1 drager, 1 schone negatieve controle | `nederlandinbedrijf.nl/Bedrijf/617508/…-Katwijk-0714029347` (rij 6). Schoon omdat het bedrijf op poort (f) valt en er geen dossierbelang aan hangt. Twee ronden op rij 4 en 5 gaven niets, dus de bron dekt de sector niet volledig. Eén drager is weinig; ik draag hem als route-aantekening en niet als regel |
| **De `<vak>-in.nl`-gidsfamilie is niet uniform en mag niet als één bron worden geboekt** | 3 vakken, 1 dienst | `glazenwasser-in.nl` 10/10 adres en 1/10 e-mail; `hondentrimsalon-info.nl` gaf bij Marizz nummer én e-mailadres; `schoonheidsspecialist-info.nl` gaf op drie steden nul. Getoetst: dit is op bronnen wat 1.40(d) op getallen is, en de meting eronder is zuiver gedaan |
| **Het leeftijdsvenster van acht jaar zou in de garagesector 3 van 13 dossiers binnenlaten waar zes jaar er nul binnenlaat** | 13 dossiers, 2 dagen, 2 provincies, 2 bronnen | Dit is een getal voor het beslispunt van de owner en uitdrukkelijk geen verzoek om de lat te verlagen. Ik draag het als zodanig door |

**Wat ik zelf aan de zondag meegeef, buiten de kandidaatregels om.** De
orderstabel is vandaag in lane D één keer "uitgevoerd" gaan zeggen over iets dat
niet is uitgevoerd. Dat is een instrument dat zijn waarde verliest zodra het
één keer liegt, en het verdient een regel op zondag: **een orderstabel die
"uitgevoerd" meldt, verwijst naar de plaats in het bestand waar het bewijs
staat, en die plaats bestaat.** Ik bied hem hier aan met één drager en schrijf
hem niet zelf in het fundament.

**De botsing met `agents/beats.md`** meldt lane C voor de derde dag op rij en
lane D meldt hem als "geen botsing, maar de marge is één kaart breed". Beide
kloppen en ze spreken elkaar niet tegen: lane C botst op **dossiers**, lane D
telt op **kaarten** (1.8). Met 2 van de cap van 3 in de hondensector zit de week
één kaart van een frontale botsing af. Wie morgen als eerste draait, meet dit
getal vóór hij de hondensector in gaat.

---

## Gebruikte skills

Alle skills zonder argument aangeroepen (1.44). Elk citaat is met
`grep -n "<exacte tekenreeks>" .claude/skills/<skill>/SKILL.md` van schijf
gehaald.

| Skill | Waar toegepast | Wat het concreet veranderde |
|---|---|---|
| `cold-email` | Op de onderwerpregel en de tekst van de Marizz-kaart, vóór ik goedkeurde | `cold-email/SKILL.md:41` — `If you remove the personalized opening and the email still makes sense, the personalization isn't working.` heb ik zelf op de kaart gedraaid in plaats van Sams toepassing aan te nemen: streep "Vrijdag om twaalf" weg en de tweede alinea heeft geen grond meer, dus de personalisatie draagt en de subject blijft. `cold-email/SKILL.md:37` — `Cold email is ruthlessly short. If a sentence doesn't move the reader toward replying, cut it.` gaf mij de vorm van mijn correctie: de juni-zin was niet alleen onbewijsbaar maar ook de enige zin die niets deed behalve een tweede periode noemen; hem schrappen kostte het bericht niets en bracht het van 203 naar 201 woorden. `cold-email/SKILL.md:45` — `### Lead with their world, not yours` toetste mijn herschreven tweede alinea: "Van vrijdagmiddag tot maandagochtend staat alles stil" beschrijft háár week en niet ons product, dus de vervanging is geen verzwakking. `cold-email/SKILL.md:91` — `Short, boring, internal-looking. The subject line's only job is to get the email opened — not to sell.` botst met poort (g) van de owner; beslecht op 14-09 in het voordeel van de owner, en ik vecht hem niet opnieuw uit |
| `marketing-psychology` | Op de vraag of de kaart iets losmaakt, en op mijn eigen dienstindeling | `marketing-psychology/SKILL.md:263` — `Losses feel roughly twice as painful as equivalent gains feel good. People will work harder to avoid losing than to gain.` is de toets waarop de kaart overleeft: de eerste alinea beschrijft een klant die weggaat, niet een klant die erbij komt, en dat is de zwaardere kant. `marketing-psychology/SKILL.md:66` — `Every system has one bottleneck limiting throughput. Find and fix that constraint before optimizing elsewhere.` stuurde mijn eigen ronden: de bindende poort is (a), dus mijn drie eigen zoekronden gingen naar de drie dossiers die alléén daarop openstaan en niet naar het narekenen van poort (b) op zesenveertig gevallen dossiers. `marketing-psychology/SKILL.md:46` — `Instead of asking "How do I succeed?", ask "What would guarantee failure?" Then avoid those things.` is de reden dat ik de `/nieuws`-pagina een **tweede** keer heb bevraagd in plaats van Sams datum over te nemen: wat zou deze kaart gegarandeerd laten mislukken? Een zin die de eigenaresse over haar eigen agenda vertelt en niet klopt. Die tweede ronde vond precies dat. `marketing-psychology/SKILL.md:36` — `People don't buy products—they "hire" them to get a job done.` bevestigde de pakketkeuze: de klus is "een plek vastleggen als de salon dicht is", dus agenda en 549, niet portfolio en 299 |
| `prospecting` | Op de zekerheidsgraad van elk feit dat ik zelf heb nagejaagd | `prospecting/SKILL.md:68` — `- **High**: confirmed by at least two independent sources or official business page` is de maat waarmee ik de kaart heb afgerekend: openingstijden, januari 2025 en de tariefdatum van 1 februari 2026 haalden hem (eigen pagina plus een tweede ronde), en de juni-periode haalde hem níét — één samenvattende alinea, en in de tweede ronde een andere. Dat verschil is de hele correctie. `prospecting/SKILL.md:200` — `- [ ] Confidence levels honest — "High" requires 2 independent sources, not just two of your own searches` hield mij eerlijk over mijn eigen werk: mijn twee ronden op de `/nieuws`-pagina zijn twee ronden op één bron, dus ik concludeer niet "de juni-datum is onjuist" maar "de juni-datum is niet vastgesteld" — dat is wat het bewijs draagt |
| `copy-editing` | Als laatste pas over dit bestand | `copy-editing/SKILL.md:119` — `**Focus:** Is every claim supported with evidence?` dwong mij elk getal in dit bestand van een commando te voorzien in plaats van van een verwijzing naar Sam: de tabel bovenaan draagt nu mijn eigen uitkomst naast de zijne, ook waar ze gelijk zijn. `copy-editing/SKILL.md:145` — `3. Flag unsupported assertions` velde mijn eerste formulering "lane D heeft correctie 1 genegeerd": genegeerd kan ik niet vaststellen, niet uitgevoerd wél, en de orderstabel meldt hem als uitgevoerd — dat is de feitelijke zin en die staat er nu. `copy-editing/SKILL.md:20` — `- Don't change the core message; focus on enhancing it` hield mij ervan af de Marizz-tekst verder te herschrijven dan de correctie vroeg: het beeld, de opbouw en de slotalinea zijn van Sam en blijven van Sam |
| `offers` | Op de prijsalinea van de goedgekeurde kaart | `offers/SKILL.md:122` — `- **Manipulative scarcity** — fake countdown timers, "only 3 spots left" lies. Short-term lift, long-term trust collapse. Don't.` staat aan dezelfde kant als de order van de owner; de kaart draagt geen schaarste en dat is bij deze hercontrole bevestigd. `offers/SKILL.md:64` — `**Implication for offer construction**: most "lower the price" requests are actually "raise the numerator or lower the denominator" requests. Price is the comparison, not the value.` bevestigt 549 boven 299: het bericht verkoopt de agenda, dus het getal moet het agendapakket zijn — pitch en factuur zijn hetzelfde ding |
| `competitor-profiling` | **Niet gebruikt.** Grond: de enige concurrentieregel in de kaart ("de volgende trimsalon in Tolberg") is een feitelijke vraag over één wijk en die is met een adrescontrole beantwoord, niet met een profiel. Hem toch aanroepen zou een holle rij opleveren | — |
| `product-marketing` | `.agents/product-marketing.md` gelezen; **niet gewijzigd** | Het fundament staat op 1.60 en beide reeksen zijn vol, dus geen nieuwe regel. De regels die vandaag rechtstreeks een oordeel bepaalden: **1.20(a)** bij de juni-periode op de Marizz-kaart — de enige correctie van de dag; **1.28** bij het e-mailadres van Marizz (exacte-tekenreeksronde geeft haar eigen contactpagina); **1.57/1.60** bij rij 1 en rij 60 van lane C, waar hetzelfde geval twee etiketten kreeg; **1.42** bij de drie Marizz-ledgertreffers, die ik heb gelezen en niet alleen geteld; **1.50** bij beide tekorttabellen, die ik met de hand heb gepartitioneerd; **1.13** bij de tariefroute, die ik op Paulina zonder voorwerp aantrof; **1.8** bij de beats-cap, die op kaarten telt en niet op dossiers |

---

## Verdict per kaart

| # | Kaart | Oordeel |
|---|---|---|
| C-1 | Hondentrimsalon Marizz — Roosendaal | **GOEDGEKEURD** — alle poorten dicht; poort (a) op haar eigen tariefverhoging per 01-02-2026, door mij gereproduceerd. Eén correctie: de juni-afwezigheid is geschrapt omdat dezelfde pagina zichzelf in twee ronden tegensprak. 201 woorden, subject 36 tekens, handtekening compleet |
| D | — | **Geen kaart aangeboden.** Terecht: ik heb de drie dossiers die alleen op poort (a) openstaan zelf nagejaagd en geen van drieën sluit |

**Lanes C+D samen: 1 aangeboden, 1 goedgekeurd, 0 afgekeurd.** Tegen een dagnorm
van dertig over vier lanes is dat een tekort dat ik niet wegschrijf: de lat is
niet verlaagd, de aanvoer is de bindende poort, en beide lanes hebben dat met
152 beoordeelde dossiers en reproduceerbare tellingen aangetoond in plaats van
beweerd.

Azzouz, vrijdag 18 september 2026
