# Verificatie 4 september 2026 — lanes A en B

- **Verificateur:** Azzouz
- **Datum:** 2026-09-04 (vrijdag)
- **Opdracht:** uitsluitend lane A (`2026-09-04-a.md`) en lane B (`2026-09-04-b.md`)
- **Niet aangeraakt:** `2026-09-04-c.md`, `2026-09-04-d.md`, `2026-09-04-cd-verified.md`
- **Aangeboden kaarten:** 1 (lane A: 0 · lane B: 1)
- **Goedgekeurde kaarten:** 1
- **Afgekeurde kaarten:** 0
- **Zelf verzendklaar gemaakt:** 0 — drie wachtende dossiers nagejaagd, geen van drieën haalt de poort die openstond
- **Eigen zoekrondes vandaag:** 11 (drie op JF Hoveniers, vier op Trimsalon de Kattenvriendin, één op Rianne's Haarmode, één op R. de Leeuw, twee op de Groenlose gids en het complement)
- **Dagnorm:** 30 goedgekeurde kaarten · geleverd over A+B: 1 · tekort: het volle aandeel van deze twee lanes op één kaart na
- **Bijspawn:** lanes E/F/G staan deze week volgens de eigen directives opgeschort; er is niets bijgespawnd en het tekort wordt gemeld, niet opgevuld

**Eén kaart, en hij is goed.** JF Hoveniers is het eerste dossier in vier diensten van
deze twee lanes dat alle poorten sluit, en ik heb de drie feiten waarop het bericht rust
zelf nagelopen in plaats van ze van Sam aan te nemen: de drie geïndexeerde pagina's, de
zeventien in de Groenlose gids, en het adres op zijn eigen contactpagina. Alle drie
kloppen. De kaart gaat mét twee correcties het bord op, allebei klein en allebei genoteerd
zodat lane B ze morgen niet opnieuw maakt.

**Eén beperking van deze dienst die ik vooraf meld,** omdat hij het gewicht van mijn eigen
controles bepaalt: het ophalen van externe pagina's is vandaag door de netwerkproxy
geblokkeerd (`jfhoveniers.nl`, `trimsalondekattenvriendin.nl`, `rianneshaarmode.nl` gaven
alle drie EGRESS_BLOCKED). Ik heb dus uitsluitend met zoekopdrachten kunnen verifiëren en
geen enkele pagina zelf kunnen lezen. Waar dat het oordeel raakt, staat het erbij.

---

## 1. JF Hoveniers — Groenlo

GOEDGEKEURD — met twee correcties, allebei hieronder in één regel verantwoord.

- **Bedrijf:** JF Hoveniers, Winterswijkseweg 22, 7141 DN Groenlo (Oost Gelre, Gelderland)
- **Sector:** hovenier · **Pakket:** 299 · **Hoek:** offertelek · **Register:** "je"
- **Eigenaar:** Jesper Frank
- **E-mail:** info@jfhoveniers.nl
- **Verzendtermijn:** binnen ongeveer twee weken (poort (a) rust op een stil levensteken, 1.14)

**Poort (a) — gedateerd levensteken.** Sluit op een *stil* levensteken: de "sinds"-regel op
zijn eigen domein (hovenier sinds 2020, begin 2024 voor zichzelf). Dat is per 1.14 geldig —
de uitgever is het bedrijf zelf — en 1.14 eist er precies één ding bij, namelijk de
verzendtermijn op de kaart. Die staat er. Mijn eigen ronde zocht het steviger spoor dat 1.14
bij hercontrole vraagt: `hovenier.nl` meldt hem zonder beoordelingen, en de Werkspot-pagina
voor Groenlo geeft alleen een plaatsgemiddelde (4,7 uit 184 over álle hoveniers), geen losse
gedateerde review over dít bedrijf. Er is dus vandaag geen harder spoor dan het stille, en
de termijn van twee weken is daarmee geen formaliteit maar de hele houdbaarheid van de kaart.

**Poort (b) — openbaar e-mailadres.** `info@jfhoveniers.nl`, op zijn eigen contactpagina
`jfhoveniers.nl/contact/`. Mijn eigen zoekronde geeft dezelfde pagina en hetzelfde adres
terug. Eén harde eenbedrijfsbron, en Sam noteert er ook precies één — dat is de discipline
die "Welke bron een e-mailadres draagt" vraagt en die lane F op 30-08 niet had.
**En de domeincheck die sinds 25-08 verplicht is:** het adres staat op zijn eigen domein,
dat domein serveert een werkende site, en het bericht beweert nergens dat hij geen website
heeft. De opening gaat over wat er níet op die site staat. Correct.

**Poort (c) — rating- en reviewclaims.** Het bericht doet er geen enkele. Dat is hier de
juiste keuze: hij heeft nog geen beoordelingen op `hovenier.nl`, en een bericht dat op zijn
score zou leunen, zou moeten liegen.

**Poort (d) — elke claim gedekt.** Vier claims, alle vier gecontroleerd:

- *"in de hoveniersgids voor Groenlo staan er zeventien"* — de gidspagina heet letterlijk
  "Top 17 hoveniers uit Groenlo". Zelf teruggevonden. ✅ Let op wat Sam hier goed doet: het
  jaartal `(2026)` in die paginatitel is de verversingsstempel van de gids en die gebruikt
  hij níet als levensteken (1.7). ✅
- *"Op jouw site vindt hij drie pagina's"* — `site:jfhoveniers.nl` geeft er in mijn eigen
  ronde exact drie: de homepage, `/contact/` en `/services/`. Geen projecten-, foto- of
  referentiepagina. Het lek bestaat en is narekenbaar. ✅
- *"299 euro, eenmalig"* — Starter staat op 299 in `zevren/lib/offer.ts`, en
  `zevren/lib/local/sectors.ts` voert een eigen hovenierspagina die hetzelfde bedrag noemt.
  Zie de bevinding over btw verderop: gedekt, maar niet volledig. ✅
- *"een pagina die je afgeronde tuinen groot en scherp laat zien"* — **dit is correctie 1.**
  Sam schreef "foto's van voor en na". Die belofte staat nergens op zevren.nl: de
  hovenierspagina zegt "Foto's van afgerond werk zijn precies wat een klant wil zien voordat
  hij belt. Wij zetten ze in een pagina die ze groot en scherp laat zien." Een voor-en-na
  vraagt om een foto van vóór het werk, en die belofte kan de site niet waarmaken. Ik heb de
  zin vervangen door de formulering van de site zelf, die bovendien sterker is. ✅

**Poort (e) — ledger.** Staat sinds vandaag als `drafted` in `contacted.md` en nergens
eerder. Geen dubbeling. ✅

**Poort (f) — groeifaseprofiel.** Twee jaar als ondernemer, zes jaar in het vak, eenmanszaak,
eigen domein, geen klantenstop na de verplichte zoekopdracht van 1.14. Midden in het venster
van 1-6 jaar. Geen B.V., geen personeel, geen marketingafdeling. ✅

**Poort (g) — onderwerpregel.** `Zeventien hoveniers in Groenlo`, 30 tekens geteld, het
gecheckte detail staat op teken 1 tot en met 9. Geen "website", geen "ZEVREN", geen "gratis",
geen uitroepteken, geen valse vertrouwelijkheid. De swipe-test: een hovenier uit Groenlo
leest om 21:40 een regel over zíjn markt en niet over een verkoper, en de open lus zit in het
getal. Hij overleeft. **Eén ding dat Sam beter doet dan hij zelf opschrijft:** hij noemt de
skilldata "cijfers in onderwerpregels −46% opens" en zegt die bewust te laten verliezen van
de staande order — maar hij schrijft "Zeventien" voluit en niet "17", en daarmee draagt de
regel het gecheckte getal zónder de cijferpenalty op te lopen. Dat is de goede oplossing van
die botsing en hij hoort in de volgende dienst bewust herhaald te worden, niet toevallig.

**Poort (i) — handtekening.** Exact het voorgeschreven blok, inclusief 06-30958710. ✅

**Poort (ii) — de zeven eisen van 25 augustus.** Het lek staat in geld en in zicht (de
doorklik die hij nooit ziet), niet in techniek. Het bewijs komt uit zijn eigen zaak (drie
pagina's, zeventien concurrenten, twee jaar werk). Eén beeld: de man op de bank die kijkt in
plaats van leest, doorgetrokken van het verlies naar de uitkomst. De prijs staat er zonder
verontschuldiging. Geen schaarste, geen "wij zijn klein". Lengte 215 woorden inclusief aanhef
en handtekening, geteld met `wc -w`, binnen 160-220.
**Eén eis haalde de tekst niet, en dat is correctie 2: de demo als bewijslast.** Sams versie
linkt naar de sectorpagina met de zin "Wat het voor een hovenier inhoudt, staat hier" — dat
is een informatielink, geen aanklikbaar bewijs. Op precies díe pagina staat de conceptbouwer
(`zevren/app/website-voor/[sector]/page.tsx` linkt hem twee keer), waarin de bezoeker in een
paar klikken een voorbeeld van zijn eigen homepage ziet. Ik heb de zin daarom omgebogen tot
een concrete uitnodiging naar dat werkende ding, met dezelfde ene link en dezelfde UTM — één
link, één vraag, geen tweede kanaalzin.

**Wat er mis was, in één regel voor Sam:** een belofte die de site niet doet ("voor en na")
en een link die informeert waar hij had moeten bewijzen.

**Derde ingreep, en het is een verwijdering.** De regel "**Owner check:** open jfhoveniers.nl
en kijk of er inmiddels wél een projecten- of fotopagina bij staat" is van de kaart gehaald.
De poort is dicht — ik heb hem vandaag zelf dichtgevonden — en de veroudering wordt al gedekt
door de verzendtermijn die 1.14 voorschrijft. Een controleopdracht ernaast is het patroon
waarop 30-08 drie kaarten sneuvelden en dat de directives uitdrukkelijk hebben gesloten: de
owner betaalt om tijd te besparen, niet om tabbladen open te trekken.

**Onderwerp** (30 tekens, geteld)

```
Zeventien hoveniers in Groenlo
```

**Bericht** (215 woorden inclusief aanhef en handtekening, geteld met `wc -w`; de URL telt als één woord)

```
Hoi Jesper,

Iemand zit zondagavond op de bank en wil zijn tuin laten aanpakken. Hij
zoekt, en in de hoveniersgids voor Groenlo staan er zeventien. Wat hij
dan doet is niet lezen maar kijken: welke tuinen heeft die man af, en zit
daar iets bij dat op mijn tuin lijkt.

Op jouw site vindt hij drie pagina's. Wie je bent, wat je aanbiedt, en
hoe hij je kan bereiken. Geen enkele afgeronde tuin. Hij klikt dus door
naar de volgende, en dat is het vervelende eraan: jij merkt er niets van.
Je hebt die man nooit gesproken en weet niet dat hij er was.

Twee jaar voor jezelf, en het werk uit die twee jaar staat nergens. Wat
ik bouw is precies dat: een pagina die je afgeronde tuinen groot en
scherp laat zien, en eronder een aanvraag waarin iemand meteen kwijt kan
wat hij wil. Iemand die dat gezien heeft, hoeft niet meer te vragen of je
goed werk levert.

Zo'n site is 299 euro, eenmalig, en die prijs staat gewoon op de site.
Daar staat ook een bouwer waarin je in een paar klikken een voorbeeld van
je eigen homepage ziet:
zevren.nl/website-voor/hoveniers?utm_source=outreach&utm_medium=email&utm_campaign=hoveniers-w36

Zal ik laten zien hoe zo'n pagina er met jouw tuinen uitziet?

Met vriendelijke groet,
Alaa
ZEVREN, Maastricht
06-30958710 · zevren.nl
```

---

### Bevinding — het sterkste dossier van lane A blijft terecht buiten het bord, en ik heb poort (a) zelf niet dichtgekregen

Lane A legt voor **Trimsalon de Kattenvriendin (Eexterveen)** een volledig geschreven
onderwerpregel en bericht klaar en biedt het uitdrukkelijk NIET als kaart aan, omdat poort (a)
openstaat: het jongste eigen spoor zijn drie blogberichten uit april en mei 2021. Dat is de
vorm die ik op 3 september bij lane B heb goedgekeurd en die vorm is hier opnieuw juist
toegepast. Ik heb het oordeel niet overgenomen maar zelf getoetst, in vier zoekrondes met
andere vormen dan die van lane A.

**Wat mijn rondes opleverden.** Twee dingen die lane A niet noemt en één die haar oordeel
bevestigt. De zaak heeft naast de Facebookpagina ook een **Instagram-account
(`@trimsalon_de_kattenvriendin`)** en staat op **`kattenprofessionals.nl`**, een gids die lane
A niet gebruikt heeft. Dat zijn twee extra routes naar een gedateerd spoor. Maar: geen van
beide gaf een leesbare datum terug, de prijsaanpassingsroute van 1.13 gaf in mijn ronde niets,
en een vakantie- of seizoensmededeling met jaartal is er niet. **Poort (a) blijft open. Het
oordeel van lane A staat.**

**Eén tegenstrijdigheid die vóór een kaart opgelost moet worden, en die lane A niet ziet.**
Lane A dateert de zaak op "2020/2021 — vijf tot zes jaar" op grond van de omgebouwde caravan
en de opleiding kat-, huid- en vachtvriendelijk trimmen van februari 2021. Een bron in mijn
eigen ronde meldt echter een **trimdiploma uit 2019** met een salon aan huis. Als dat de start
van de zaak is, is zij zeven jaar bezig: de rand van het venster, en per 1.6 op zichzelf geen
afwijzing, maar wel iets anders dan "midden in het profiel". Twee lezingen kunnen allebei waar
zijn (een eerste diploma in 2019, de kattenspecialisatie in 2021) en juist daarom hoort dit
uitgezocht te zijn vóór er een bericht uitgaat, niet erna. Ik zet het in het ledger.

**De tekst zelf heb ik wel volledig getoetst**, zoals bij een klaarliggend bericht hoort:

- **Handtekening:** exact het blok, inclusief 06-30958710. ✅
- **Lengte:** 197 woorden met handtekeningblok, 188 zonder — precies de twee getallen die
  lane A opschrijft, en ik kom er zelf op uit met `wc -w`. Binnen 160-220. ✅
- **Onderwerp:** `Twaalf dorpen, één telefoonnummer`, 33 zichtbare tekens (geteld met
  Unicode-normalisatie; de "één" telt in bytes anders). Het gecheckte detail staat vooraan.
  Geen "website", geen "ZEVREN". ✅
- **Prijs:** 549 voor een boeking — Business staat op 549 in `zevren/lib/offer.ts` en de
  Nederlandse dictionary beschrijft dat pakket letterlijk als "inclusief een afsprakensysteem
  waarin klanten zelf hun tijd kiezen". Pitch en prijs zijn hetzelfde ding. ✅
- **"Er gaat meteen een bevestiging uit":** gedekt. `sectors.ts` schrijft voor
  hondentrimsalons letterlijk "Ze kiezen een behandeling en een moment in jouw online agenda,
  ook 's avonds, en krijgen een bevestiging." ✅
- **Link:** `zevren.nl/projects/barbershop-website` bestaat werkelijk (slug in
  `zevren/lib/constants.ts`). De UTM staat op sectorniveau, niet per ontvanger. ✅
- **Verboden formuleringen:** geen "werk dat u zelf kunt aanklikken", geen foto-upload, geen
  "adres op uw eigen naam". De demozin gaat over een tijdslot aanklikken, niet over klantwerk. ✅
- **De zeven eisen:** het lek staat in tijd en in een rit naar de dierenarts, één beeld
  (de zondagavond) dat wordt doorgetrokken in plaats van vervangen, de demo één keer met een
  concrete uitnodiging, de prijs zonder verontschuldiging, geen schaarste, en het slot is één
  vraag. ✅

Dit is verzendklaar werk. Het ligt stil op één ontbrekende datum, en dat is precies het
verschil tussen een kaart en een bevinding.

### Bevinding — Rianne's Haarmode en R. de Leeuw zijn allebei terecht geen kaart, en mijn eigen rondes bevestigen de grond

De opdracht was uitdrukkelijk om te toetsen of van deze twee wachtende dossiers alsnog een
verzendklare kaart te maken is. Het antwoord is bij allebei nee, en bij allebei op dezelfde
harde afkeurregel van 25 augustus: **geen geverifieerd openbaar e-mailadres, hoe goed de rest
ook is.**

- **Rianne's Haarmode (Waskemeer).** Eén eigen zoekronde over Facebook, `kappers.nl`, het
  streeknieuwsartikel en haar eigen domein. Alle vier de bronnen komen terug, geen enkele
  draagt een e-mailadres; het contactkanaal dat overal staat is 06-23483106, bellen of
  WhatsApp. Dat is na drie ronden van lane A en één van mij vier ronden zonder adres. Het
  profiel is intussen het sterkste van de lane (gestart maart 2023, boekingspoort dicht, eigen
  domein) en daarom hoort zij op de bellijst, waar lane A haar ook gezet heeft. Correct.
- **R. de Leeuw schildersbedrijf (Sneek).** Mijn eigen ronde geeft het adres opnieuw
  uitsluitend gemaskeerd terug — letterlijk `[email protected]` — en dat is geen bron maar
  een maskering, precies zoals lane A schrijft. **Eén ding kan ik wél oplossen:** de
  waarschuwing dat er twee adressen in omloop zijn (Wagenbrugge 18 en Marnezijlstraat 24). Mijn
  ronde geeft **Marnezijlstraat 24, 8608 CK Sneek** met het telefoonnummer 06-11139571 in
  dezelfde regel, op twee onafhankelijke gidsen. Dat is het adres om te gebruiken als de owner
  belt; ik zet het in het ledger zodat de volgende lane die vraag niet opnieuw stelt.

Geen van beide wordt dus een genummerde kaart in dit bestand. Ze zijn geen tekortkoming van
lane A maar het bewijs dat de harde regel doet wat hij moet doen.

### Bevinding — lane A's tekortverantwoording klopt nu tot op de rij, met één getal dat het niet doet

Gisteren was dit de zwaarste correctie op deze lane: 23 beoordeelde bedrijven waar er 21
stonden, en zeven adresgevallen waar er vier stonden. **Vandaag klopt het.** Ik heb het
narekenbaar gemaakt in plaats van het te geloven:

- De samenvattingstabel telt **32 datarijen** en de kop claimt 32 beoordeelde bedrijven. Sluit.
- De afwijzingstabel telt 11 + 7 + 6 + 3 + 2 + 1 + 1 + 1 = **32**. Sluit.
- Elke grond is per bedrijf terug te vinden in de tabel: elf op leeftijd (L & M, Studio
  Chantal, Hem & Haar, HAAR&DAAR, Tuinenga, Hair & Looks, Capelli, Salon 12a, Jolanda, Warber,
  ACS), zeven op het adres (Rianne's, R. de Leeuw, Schildersdirect, Maris, StucGroningen,
  Joling, R.F. de Jong), zes op de boekingspoort, drie op poort (a), twee op poort (e), en
  één elk op klantenstop, franchise en het ontbrekende lek. Sluit.
- De veertien onafgeronde namen staan **buiten** de telling en buiten de tabel, met de reden
  erbij. Dat is exact de discipline die ik gisteren van lane B naar lane A doorgaf.

**Eén getal houdt geen stand, en het is het getal waarmee de belangrijkste bevinding opent.**
Lane A schrijft: *"Elf van deze veertien heb ik door de leeftijdspoort gehaald."* De tabel
eronder heeft elf rijen, maar twee daarvan (Salon 12a en Kapsalon Hair & Looks) staan niet in
de lijst van veertien adressen — Salon 12a wordt zelfs zelf gemarkeerd als "zelfde route". Van
de veertien zijn er dus **negen** door de leeftijdspoort gegaan. Het aardige is dat lane A het
juiste getal zelf al opschrijft, twee alinea's verder: "zeven vielen op de leeftijd, twee
stonden op de rand" — zeven plus twee is negen, en de decompositie 7 + 2 + 2 + 3 = 14 klopt
precies. De conclusie *"nul van de veertien haalde de schrijffase"* blijft daarmee overeind;
alleen de elf is verkeerd overgeschreven.

Dat is een kleiner bezwaar dan dat van gisteren en ik noteer het toch, om dezelfde reden als
gisteren: op een dag zonder kaarten is de verantwoording het enige product, en een getal dat
het betoog draagt moet uit de eigen tabel te herleiden zijn.

### Bevinding — lane B's verantwoording klopt tot op het bedrijf, twee diensten op rij

De trechterberekening van lane B is de tweede dag op rij exact narekenbaar en ik heb hem
opnieuw nagelopen: 29 beoordeeld, min 8 op leeftijd en 3 buiten de regio = 18; min 2
boekingspoort, 1 klantenstop, 1 te ver gemarketeerd, 1 gesloten sector en 6 poort (a) = 7; min
6 zonder adres = **1**, en dat is de kaart. De namen achter elk getal staan er allemaal bij.
De vier onafgeronde dossiers staan in de tabel maar buiten de telling, met "Niet afgerond" als
uitkomst.

De vermenigvuldiging die eronder ligt is het hele verhaal van deze week: vier poorten die elk
ongeveer de helft wegnemen, laten van 29 bedrijven er één over. Dat is geen slappe dienst maar
een rekensom, en zolang die rekensom klopt is één kaart een eerlijke uitkomst en geen falen.

### Bevinding — de twee lanes stellen dezelfde diagnose in twee regio's op één dag, en daarmee is zij boven de één-lane-drempel

Lane A noemt het een **conjunctie**: wij eisen twee eigenschappen (jong én bereikbaar) die
gedragen worden door twee bronsoorten die elkaar systematisch uitsluiten — het register dat het
adres draagt selecteert op gevestigd zijn, en de gids die de leeftijd draagt verdient aan het
contactformulier en geeft het adres niet af. Lane B schrijft, zonder lane A's bestand te
kennen: *"De e-mailmuur en de leeftijdsmuur zijn dus niet twee losse poorten maar één en
dezelfde beperking, van twee kanten bekeken."*

Dat zijn dezelfde uitspraak, onafhankelijk gevonden, in verschillende provincies, met
verschillende sectoren en verschillende bronnen. Lane A onderbouwt hem bovendien met het
experiment dat ik gisteren zelf heb opgedragen: de bronvolgorde omdraaien leverde veertien
geverifieerde adressen op — meer dan de drie voorgaande diensten samen — en nul kaarten. Dat is
precies het antwoord dat een goed uitgevoerd experiment hoort te geven als de hypothese niet
klopt, en lane A meldt het als zodanig in plaats van het weg te schrijven.

**Mijn oordeel: de diagnose is nu bewezen genoeg om te sturen, en niet genoeg om iets aan het
profiel te veranderen — want dat is niet aan mij.** Wat ik er wél uit afleid, en wat morgen
uitvoerbaar is: de kaarten van deze week komen zonder uitzondering uit de groep **mét** eigen
domein (JF Hoveniers vandaag, Autospuiterij en Brinkveld eerder), terwijl het bericht juist is
geschreven voor de groep **zonder**. Dat is geen reden om de geen-website-groep op te geven,
maar wel om de zoektijd te verdelen naar waar hij kaarten oplevert. Zie de orders.

### Bevinding — elke kaart schrijft "299 euro, eenmalig" terwijl de site "exclusief btw" zegt

Dit raakt geen enkele kaart van vandaag hard genoeg om hem tegen te houden, en het raakt ze
allemaal, dus het hoort één keer opgeschreven te worden in plaats van elke dag opnieuw
half-gedacht.

De hovenierspagina op zevren.nl zegt: *"Het Starter-pakket is 299 euro eenmalig, exclusief
btw."* Het bericht van vandaag zegt: *"Zo'n site is 299 euro, eenmalig, en die prijs staat
gewoon op de site."* Het bedrag klopt, het woord "eenmalig" klopt, en de lezer die doorklikt
ziet de btw-regel meteen staan. Voor een ondernemer met een KvK-nummer is een prijs zonder btw
bovendien de normale lezing.

**Waarom ik het toch noteer:** de vastgelegde regel is niet "het bedrag klopt" maar "elke claim
is gedekt door wat op zevren.nl staat", en het verschil tussen 299 en 299 plus btw is 62,79
euro die de ontvanger pas ziet als hij klikt. Ik laat het vandaag staan — het corrigeren zou
elke kaart van deze week met terugwerkende kracht raken en dat is een beslissing, geen redactie
— en ik leg de regel vast in het fundament: **noem het bedrag zoals de site het noemt, en
schrijf de btw-vermelding nooit weg.** Wie "299 euro" schrijft doet dat goed; wie "299 euro,
verder niets" of "alles inbegrepen" zou schrijven, doet een belofte die de site niet doet.

### Bevinding — de Gebruikte-skills-tabellen van beide lanes zijn echt (poort h)

Poort (h) doe ik niet op vertrouwen af. Ik heb vier citaten letterlijk teruggezocht in
`.claude/skills/`, twee uit elke lane, en alle vier staan er woordelijk:

| Wat de lane citeert | Waar het werkelijk staat | Klopt |
|---|---|---|
| lane A: "source 2-3x more candidates than the final list, qualification will cull aggressively" | `prospecting/SKILL.md` regel 56 | ✅ |
| lane A: "High confidence vereist twee onafhankelijke bronnen" | `prospecting/SKILL.md` regel 68 ("confirmed by at least two independent sources or official business page") | ✅ |
| lane B: "cijfers in onderwerpregels −46%" | `cold-email/references/subject-lines.md`, tabel "Numbers and percentages · -46% opens" | ✅ |
| beide lanes: de sweepnamen Clarity / Prove It / Specificity | `copy-editing/SKILL.md` regels 31, 117 en 152 (Sweep 1, 4 en 5) | ✅ |

Belangrijker dan de citaten is of het gevolg controleerbaar is, en dat is het bij allebei.
Lane A's `copy-editing`-regel wijst drie ingrepen aan die in de eindtekst terug te lezen zijn
(de geknipte openingszin, "ziet zo iemand" in plaats van "zie je", "die eigenaar" in plaats van
"hij"). Lane B's `prospecting`-regel wijst een dossier aan dat erdoor omviel (Bast Hoveniers:
bron één gaf een KvK-nummer uit 2023, bron twee 30-03-2011 — één bron had hier een kaart op een
zaak van vijftien jaar opgeleverd). Beide lanes melden bovendien eerlijk welke skills zij
**niet** hebben ingezet en waarom, in plaats van er een etiket op te plakken. Dat is precies de
vorm die het fundament in "Een dag zonder kaarten is geen dag zonder skills" vraagt.

**Beide tabellen: ECHT.** Poort (h) gehaald door A en B.

### Bevinding — twee vondsten uit lane B die morgen direct tijd besparen, en één die dat niet doet

- **TransFirm draagt het KvK-nummer in de URL.** `transfirm.nl/nl/organisatie/<kvk>-<vestiging>-<naam>`
  maakt van één zoekopdracht een leeftijdszeef zonder ook maar één pagina te openen. Lane B
  gebruikt hem meteen goed en met de juiste grens erbij: een KvK-reeks is een indicatie, geen
  oprichtingsdatum, en 1.15 blijft gelden. Dit is de goedkoopste route van de dag en ik geef hem
  als order aan beide lanes door. Nog niet naar het fundament: één lane, één dienst.
- **De eigen over-onspagina verslaat de gidsdatum.** Vier keer op één dag droeg een gidsdatum
  uit 2023 of 2024 een zaak van tien tot zesentwintig jaar (Steengoed!, Bast, Steffens, BtH
  Groen). De toets die dat in één ronde afvangt is niet het KvK-nummer maar de eigen
  over-onspagina. Dat is dezelfde beweging als 1.15 en versterkt hem; ik neem hem als tweede
  regel op in 1.16.
- **En de vondst die er geen is:** lane A heeft mijn order uitgevoerd om `optios` aan de vaste
  platformzoekopdracht toe te voegen, in tien controles, met nul treffers in die regio. Dat is
  geen mislukking maar het antwoord: er is nog steeds geen tweede-lane-bevestiging voor Optios,
  dus het blijft staan waar het staat — als order, niet als fundamentregel. Lane A meldt dat uit
  zichzelf en dat hoort genoemd te worden: een order die niets oplevert, melden is hetzelfde
  werk als een order die wel iets oplevert.

---

## Conclusie per lane

### Lane A — Groningen, Friesland, Drenthe

Nul kaarten, en dat is de negende noordelijke dienst onder de norm. **Het oordeel is
niettemin: correct gewerkt.** Geen enkel bedrijf sloot vandaag alle poorten, er is geen kaart
met een open poort doorgelaten, en het sterkste dossier ligt met de tekst erbij klaar in
plaats van dat het op het bord is geduwd. De verantwoording is voor het eerst in drie diensten
tot op de rij narekenbaar; de enige fout is een overgeschreven getal dat de conclusie niet
raakt.

Wat deze dienst wél opleverde en wat meer waard is dan een dunne kaart: het experiment dat ik
gisteren opdroeg is uitgevoerd en heeft een duidelijk negatief antwoord gegeven, met veertien
adressen en negen leeftijdscontroles als bewijs. Daarmee weet ik iets wat ik gisteren niet
wist, en het kostte geen verbrand adres.

Wat mij zorgen baart is niet de nul maar de herhaling: acht van de negen laatste diensten van
deze lane eindigen op nul of één, en de lane blijft dezelfde twee vijvers leegvissen. De orders
hieronder zijn daarom voor het eerst niet "zoek beter" maar "zoek ergens anders".

### Lane B — Overijssel, Gelderland, Flevoland

Eén kaart, goedgekeurd, en de sterkste van deze week. Daarnaast een verantwoording die twee
dagen op rij exact klopt, vier klaarliggende namen die op mijn order als eerste zijn gecontro-
leerd en waarvan er drie op dezelfde val omvielen, een klantenstop die door de verplichte
zoekopdracht van 1.14 een verbrand adres heeft voorkomen, en twee boekingspoorten die vóór het
schrijven zijn gecontroleerd in plaats van erna.

Dat laatste is het verschil tussen deze lane en de rest van de week: lane B stelt vast in welke
volgorde het goedkoop is, en schrijft pas als er iets te schrijven valt. Twee volledige
dossiers aan verspild schrijfwerk bespaard, op één dag.

De tekortkoming is dezelfde als bij lane A en niet op te lossen met vlijt: negen tot elf kaarten
te weinig, en de trechter laat zien waarom.

---

## Orders voor de eerstvolgende dienst

Morgen is zaterdag; deze orders gelden voor de eerstvolgende dienst van elke lane.

- **Lane A — stop met de twee vijvers en begin bij de derde.** Kapsalons en trimsalons in
  Groningen, Friesland en Drenthe hebben in negen diensten twee goedgekeurde kaarten opgeleverd
  en de lane heeft vandaag zelf bewezen waarom (de conjunctie). Begin je volgende dienst met de
  vier sectoren die je vandaag als "niet serieus afgelopen" hebt gemeld — mobiele fietsenmakers,
  dierenpensions, catering, en daarnaast schoonmaak- en glazenwassersbedrijven — met minimaal
  vijftien zoekopdrachten per sector voordat je hem afschrijft. Eén zoekopdracht is geen oordeel.
- **Lane A — begin bij `kappers.nl/<dorp>` en bij TransFirm, niet bij Stagemarkt.** Je hebt zelf
  vastgesteld dat het register op gevestigd zijn selecteert. Gebruik de zeef van lane B
  (`site:transfirm.nl <sector> <steden>`, KvK-reeks in de URL) om de leeftijd te filteren vóórdat
  je één adresronde doet. En rond EsraVDMhair in Burgum af — dat is de enige vondst die je zelf
  als bruikbaar hebt doorgegeven en hij ligt er nu twee dagen.
- **Lane B — herhaal wat werkte, in deze volgorde:** eerst TransFirm als leeftijdszeef, dan de
  eigen over-onspagina als leeftijdsbewijs, dan pas het adres, en pas daarna een letter copy. Die
  volgorde leverde vandaag de enige kaart van beide lanes op en bespaarde twee dossiers aan
  verspild schrijfwerk.
- **Lane B — twee dossiers zijn met één zoekopdracht af te maken.** Trimsalon Terra (Vroomshoop):
  één ronde op haar Instagram of Facebook geeft het jaartal bij de verlofmelding, en dan is het
  een sterke kaart. Trimsalon Elburg: sluit eerst uit dat de Tipaw-pagina "Hondenkapsalon Elburg"
  dezelfde zaak is. Doe die twee vóór je nieuwe namen jaagt — een dossier dat op één ronde ligt te
  wachten is goedkoper dan een verse naam.
- **Lane A — bij Trimsalon de Kattenvriendin, twee dingen en in deze volgorde.** Eerst de
  leeftijdstegenstrijdigheid oplossen (het trimdiploma van 2019 tegenover de caravan van 2020 en
  de kattenopleiding van februari 2021), want als 2019 de start is, staat de zaak op de rand van
  het venster en verandert dat de toon van het bericht. Pas daarna poort (a): probeer haar
  **Instagram** (`@trimsalon_de_kattenvriendin`) en `kattenprofessionals.nl` — twee routes die
  vandaag niet zijn geprobeerd. De tekst mag ongewijzigd mee zodra beide rond zijn.
- **Beide lanes — schrijf getallen over uit je eigen tabel, niet uit je hoofd.** Lane A's "elf van
  de veertien" is negen, en het juiste getal stond twee alinea's verder al in hetzelfde bestand.
  Op een dag zonder kaarten is de verantwoording het product; een getal dat niet uit de eigen
  tabel te herleiden is, kost de hele bevinding zijn gewicht.
- **Beide lanes — houd de onderwerpregel-oplossing van lane B vast.** Schrijf het gecheckte getal
  voluit ("zeventien", niet "17"). Dat draagt het detail dat de staande order eist en ontloopt de
  cijferpenalty die `cold-email` meet. Doe dat voortaan bewust.

---

## Nog steeds bij de owner — drie beslispunten, nu vier dagen open

Ze staan sinds `marketing/reports/2026-08-30.md` open en `agents/inbox.md` is nog
leeg onder "New". Ik herhaal ze kort, omdat ze alle drie precies de beperking raken
die beide lanes vandaag onafhankelijk hebben beschreven — en omdat ik ze niet zelf
mag beslissen.

1. **Het leeftijdsvenster: 1-6 jaar oprekken naar 8-10?** Mijn advies blijft **nee**.
   Vandaag zou het twee dossiers hebben gescheeld (Kapsalon Henri en K & F hairstyle
   stonden op zeven jaar en vielen dáárnaast al op een tweede poort), dus het is geen
   oplossing voor het tekort — het is een verschuiving van de grens waarachter de
   zaken zitten die ons niet nodig hebben. Tot hij beslist geldt 1-6 met "grofweg"
   erbij: zeven jaar is de rand en op zichzelf geen afwijzing (1.6).
2. **De dagnorm van 30 goedgekeurde kaarten vervangen door 8-10 verzendklare
   kaarten?** Mijn advies blijft **ja**. Vier lanes leveren deze week samen één tot
   drie kaarten per dag; een norm die structureel met een factor tien wordt gemist,
   stuurt niets meer. Zolang hij niet beslist, blijft dertig de norm en eerlijkheid
   de uitweg — geen zwakkere kaart.
3. **Mag de bellijst gebeld worden?** Mijn advies blijft **ja**, en vandaag is het
   duurste voorbeeld tot nu toe: **Rianne's Haarmode** (gestart maart 2023,
   boekingspoort dicht, eigen domein, 06-23483106) en **R. de Leeuw schildersbedrijf**
   (KvK 82752982 van 21-05-2021, 9,6 uit 24 beoordelingen, 06-11139571) zijn allebei
   complete dossiers die uitsluitend op een ontbrekend e-mailadres stilliggen. Lane B
   legt er nog eens drie bij (Lansink, Heuven, Averesch). Dat zijn vijf zaken die aan
   alle inhoudelijke eisen voldoen en die niemand ooit zal horen.

**Wat er ongemakkelijk aan is en wat ik erbij blijf zeggen:** het ledger telt vandaag **115 rijen met status `drafted`**
en nul `sent`, nul `replied` — er is er nog nooit één verstuurd. Mijn acht poorten
zijn dus nooit tegen één werkelijke uitkomst geijkt. Ik keur streng op een standaard die
niemand heeft kunnen toetsen, en de goedkoopste manier om dat op te lossen is niet nog
een lane maar één verstuurde mail.

---

## Fundament — wat ik vandaag heb toegevoegd (1.16)

`.agents/product-marketing.md` staat nu op **1.16**, met twee regels en een changelogregel.
Allebei komen ze uit een kaart van vandaag en allebei zijn ze met een concreet dossier bewezen:

1. **Een belofte over de vórm van het werk is net zo hard gedekt of niet gedekt als een prijs**,
   toegevoegd als vierde punt bij "Wat een bericht nooit mag beweren". Bewijs: "foto's van voor
   en na" bij JF Hoveniers. Het staat nergens op zevren.nl — de hovenierspagina zegt "groot en
   scherp" — en een voor-en-na vraagt om een foto van vóór het werk die niemand heeft toegezegd.
   Met de btw-regel als tweede helft van hetzelfde punt: noem het bedrag zoals de site het noemt
   en schrijf de btw-vermelding nooit weg.
2. **De eigen over-onspagina verslaat de gidsdatum**, toegevoegd bij de erkenningsdatum-sectie
   als praktische aanscherping van 1.15. Bewijs: vier bedrijven op één dag in lane B waar een
   gidsdatum uit 2023/2024 een zaak van tien tot zesentwintig jaar droeg, en waar telkens de
   eigen over-onspagina het eerlijke jaartal gaf.

**Niet opgenomen:** de TransFirm-zeef van lane B. Hij is uitstekend en hij staat hierboven als
order voor beide lanes, maar hij komt uit één lane en één dienst — dezelfde drempel die ik
gisteren op `optios` heb toegepast, en die geldt ook als de vondst mij goed uitkomt.

---

## Gebruikte skills

| Skill | Waar toegepast | Wat het concreet veranderde |
|---|---|---|
| `cold-email` | Op beide onderwerpregels en op elke alinea van de goedgekeurde kaart | Drie dingen met een zichtbaar gevolg. (1) De regel "One ask, low friction — interest-based CTAs beat meeting requests" is de reden dat ik de linkzin van lane B heb omgebouwd in plaats van er een tweede zin naast te zetten: de kaart houdt één link, één vraag en geen tweede kanaalzin. (2) "If you remove the personalized opening and the email still makes sense, the personalization isn't working" is de toets waarmee ik "Zeventien hoveniers in Groenlo" heb goedgekeurd: haal de zeventien weg en de tweede alinea (drie pagina's, geen tuin) hangt in de lucht, dus de personalisatie draagt. (3) De data in `references/subject-lines.md` gaf de vondst die ik als order doorgeef: cijfers in onderwerpregels kosten −46% opens, en lane B ontloopt dat door "Zeventien" voluit te schrijven zonder de staande order van 24 augustus te breken. Ik heb dat citaat letterlijk teruggezocht om poort (h) niet op vertrouwen af te doen |
| `marketing-psychology` | Op de overtuigingskracht van de goedgekeurde kaart en op de diagnose van beide tekorten | Drie modellen, elk met een gevolg. *BJ Fogg (gedrag = motivatie × vermogen × prompt)* wees correctie 2 aan: motivatie stond in de tekst (zeventien concurrenten, twee jaar werk dat nergens staat) en de drempel was laag (prijs openbaar), maar het aanklikbare bewijs ontbrak — de link informeerde waar hij moest bewijzen. *Jobs to Be Done* bevestigde de hoek: de klant van een hovenier huurt geen tuinman maar wil zien of deze man tuinen aflevert zoals de zijne, en dat is precies waarom "geen enkele afgeronde tuin" het lek is en niet "je site is klein". En *Theory of Constraints* op de twee tekortdiagnoses: lane A noemt het een conjunctie, lane B noemt het één beperking van twee kanten — het model laat zien dat dat dezelfde uitspraak is, en dat maakt haar boven de één-lane-drempel bruikbaar om mee te sturen |
| `prospecting` | Op mijn eigen elf verificatierondes | De eis "High requires two independent sources" is de reden dat ik bij JF Hoveniers niet ben gestopt bij de contactpagina maar ook `site:jfhoveniers.nl` heb gedraaid: die tweede ronde leverde het bewijs onder het lék (exact drie geïndexeerde pagina's, geen projectenpagina), niet onder het adres. Dezelfde eis is de reden dat ik R. de Leeuw NIET heb doorgelaten — mijn eigen ronde gaf het adres opnieuw uitsluitend gemaskeerd — en dat ik bij de Kattenvriendin twee bronnen naast elkaar heb gelegd die elkaar over de leeftijd tegenspreken (diploma 2019 tegenover caravan 2020), in plaats van de eerste te noteren |
| `copy-editing` | Als laatste pass over de goedgekeurde tekst en over dit bestand | Sweep 4 (Prove It) haalde de enige onbewezen belofte uit de kaart: "foto's van voor en na" beweert een fotosoort die niemand heeft toegezegd, en is vervangen door de formulering die op zevren.nl zelf staat ("groot en scherp"). Diezelfde sweep op mijn eigen verwijten: de "negen in plaats van elf" bij lane A staat met de rijen erbij die het aantonen, en de vier skill-citaten staan met bestand en regelnummer, zodat Sam beide kan natrekken zonder mij te geloven. Sweep 1 (Clarity) knipte in de kaart één zin van 15 naar 11 woorden ("het werk uit die twee jaar staat nergens"), wat de tekst op 215 woorden bracht en binnen de bandbreedte hield |
| `competitor-profiling` | Op de "zeventien" in de onderwerpregel | De eis dat elke claim naar een bron herleidbaar is, veranderde het belangrijkste getal van de kaart van een aanname in een waarneming: de gidspagina voor Groenlo heet letterlijk "Top 17 hoveniers uit Groenlo", en de twee concurrenten die lane B als contrast gebruikt (`kramer-molenveld.nl`, `hgrk.nl`) komen in dezelfde ronde terug met onderliggende pagina's. Diezelfde toets is de reden dat die twee namen NIET in het bericht staan: ik kan aantonen dat zij meer pagina's hebben, niet wat hun klanten daarvan vinden |
| `customer-research` | Niet ingezet | Er lag vandaag geen segmentvraag op mijn bord: de sectorverschuiving die lane B halverwege maakte, is met de eigen trechtercijfers verantwoord en niet met een doelgroepanalyse, en mijn werk was verifiëren. Ik noteer dat liever dan er een etiket op te plakken |
| `offers` en `pricing` | Niet ingezet | Het pakket volgde bij beide teksten rechtstreeks uit de vastgelegde regel (boeking = 549, offertewerk = 299) en niet uit een afweging. De btw-bevinding is een dekkingsvraag, geen prijsvraag: hij gaat over wat de site zegt, niet over wat de prijs zou moeten zijn |

---

## Samenvatting

| Kaart / dossier | Lane | Plaats | Oordeel |
|---|---|---|---|
| JF Hoveniers | B | Groenlo | **GOEDGEKEURD** — alle poorten dicht, drie feiten zelf nagelopen. Twee correcties: "voor en na" vervangen door de formulering van de site, en de informatielink omgebouwd tot een aanklikbare uitnodiging. Owner check verwijderd; verzendtermijn ca. twee weken |
| Trimsalon de Kattenvriendin | A | Eexterveen | **GEEN KAART, terecht** — zelf nagejaagd in vier rondes, poort (a) blijft open. Tekst is verzendklaar. Nieuw: Instagram en `kattenprofessionals.nl` als routes; leeftijdstegenstrijdigheid 2019 tegenover 2020/2021 eerst oplossen |
| Rianne's Haarmode | A | Waskemeer | **GEEN KAART, terecht** — vierde ronde zonder openbaar e-mailadres; harde afkeurregel van 25-08. Bellijst is de juiste plaats |
| R. de Leeuw schildersbedrijf | A | Sneek | **GEEN KAART, terecht** — adres in mijn eigen ronde opnieuw uitsluitend gemaskeerd. Wel opgelost: Marnezijlstraat 24, 8608 CK is het adres dat twee bronnen dragen |
| — geen enkele kaart aangeboden — | A | Gr/Fr/Dr | **0 kaarten, terecht** — 32 bedrijven beoordeeld, geen enkel bedrijf sloot alle poorten |
| Verantwoording van het tekort | A | — | **JUIST, met één fout getal** — tabel en telling sluiten op 32; "elf van de veertien" moet negen zijn, de conclusie blijft staan |
| Verantwoording van het tekort | B | — | **JUIST** — trechter narekenbaar tot op het bedrijf, tweede dienst op rij |
| Gebruikte-skills-tabel | A | — | **ECHT** — poort (h) gehaald; twee citaten letterlijk teruggevonden in `prospecting/SKILL.md` |
| Gebruikte-skills-tabel | B | — | **ECHT** — poort (h) gehaald; de −46%-cijferregel letterlijk teruggevonden in `cold-email` |
| De conjunctie-diagnose | A + B | — | **AANGENOMEN als waarneming** — twee lanes, twee regio's, één dag, dezelfde uitspraak; stuurt de orders, verandert het profiel niet |
| TransFirm als leeftijdszeef | B | — | **ORDER, geen fundamentregel** — één lane, één dienst; dezelfde drempel als gisteren op `optios` |

Azzouz, 4 september 2026
