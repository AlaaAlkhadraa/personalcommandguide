# Verificatie 17 september 2026 — lanes A en B

Azzouz, verificatiedienst. Ik beoordeel uitsluitend `2026-09-17-a.md`
(Groningen/Friesland/Drenthe) en `2026-09-17-b.md` (Overijssel/Gelderland/Flevoland).
Lanes C en D worden in `-cd-verified.md` beoordeeld door een tweede sessie; ik heb
`2026-09-17-d.md` uitsluitend gelézen, voor de koppeling die mijn opdracht (2) vraagt,
en er geen oordeel over geschreven.

## De telling, zelf gedraaid

De opzichter meldt nul kaarten in beide lanes. Dat klopt, en ik heb het op de
werkboom én op `origin/main` nagedaan met het commando uit mijn opdracht:

```
$ for f in marketing/outreach/2026-09-17-a.md marketing/outreach/2026-09-17-b.md; do
    grep -cE '^## [0-9]+\. ' "$f"; done
  -> 0
  -> 0

$ git show origin/main:marketing/outreach/2026-09-17-a.md | grep -cE '^## [0-9]+\. '
  -> 0
$ git show origin/main:marketing/outreach/2026-09-17-b.md | grep -cE '^## [0-9]+\. '
  -> 0
```

Werkboom en `origin/main` staan op dezelfde commit (`5ca2f0d`), dus er is geen
lane-bestand dat nog onderweg is. **Nul kaarten uit 136 beoordeelde dossiers**
(53 + 83). De dagnorm van dertig is niet gehaald en beide lanes melden dat in de
vaste vorm, zonder de lat te verlagen. Dat laatste is het enige waar ik ze op kan
prijzen, en ik doe het: geen van beide heeft een zwakke kaart door de poort geduwd
om een getal te halen.

---

## GOEDGEKEURD — lane A, de dienst: elke telling is reproduceerbaar uit de regels erboven

Opdracht (1), eerste helft. Ik heb lane A's zes gronden niet geteld maar herteld, en
daarna gecontroleerd of de reeksen 1 tot en met 53 werkelijk partitioneren.

```
$ f=marketing/outreach/2026-09-17-a.md
$ grep -cE '^\| [0-9]+ \|' $f                              -> 53
$ grep -E '^\| [0-9]+ \|' $f | grep -c "GROND: te-lang"    -> 12
$ grep -E '^\| [0-9]+ \|' $f | grep -c "GROND: ledger"     -> 21
$ grep -E '^\| [0-9]+ \|' $f | grep -c "GROND: geen-lek"   ->  8
$ grep -E '^\| [0-9]+ \|' $f | grep -c "GROND: bestemming" ->  6
$ grep -E '^\| [0-9]+ \|' $f | grep -c "GROND: lead"       ->  5
$ grep -E '^\| [0-9]+ \|' $f | grep -c "GROND: buiten-cap" ->  1
                                         12+21+8+6+5+1      = 53
```

Alle zes getallen komen exact uit. Ik heb daarbij ook de **rijnummers** per grond
uitgedraaid en naast de tekorttabel gelegd; ze zijn identiek, en 1 t/m 53 komt precies
één keer voor. Geen dubbeltelling, geen gat.

De vormwijziging die lane A zelf meldt — één `GROND:`-token per rij in plaats van losse
woorden in de oordeelstekst — is de reden dát dit machinaal kan. Dat is winst en ik
neem hem als kandidaat mee naar zondag.

**De bestemmingsborden kloppen ook.** 35 ledgerrijen, 2 bellijstrijen, 7 rijen op
`geen-emailadres.md`, elk met het commando dat lane A erboven zette, en alle drie door
mij nagedraaid met dezelfde uitkomst. De rekensom 53 − 21 + 3 = 35 klopt.

**De sectorverdeling klopt tot op het getal dat lane A gisteren fout had.** Het
getal 126 uit botsing 1 heb ik uitgedraaid en het is 126; pedicure, hondenschool en
klusbedrijf staan alle drie op 0 in de laatste zeven dagen, dus de vrije keuze is
correct onderbouwd. De `slug:`-regels in `zevren/lib/local/sectors.ts` staan op
exact de tien regelnummers die lane A noemt.

---

## GOEDGEKEURD — lane A heeft de drie correcties van gisteren alle drie toegepast

Opdracht (1), tweede helft.

| Correctie van gisteren | Toegepast? | Waar ik dat zie |
|---|---|---|
| Verdeling herteld | **Ja** | De sectorplantabel noemt per quotum de rijnummers (1-9 en 16-40, 10-15, 41-53) en die drie reeksen zijn disjunct; ik heb het nagerekend, 34 + 6 + 13 = 53 |
| Quotum alleen op rijen van vandaag | **Ja, en tegen zijn eigen belang** | Bij ESB (rij 31) schrijft lane A geen nieuwe rij omdat de rij van 06-09 is, en bij de geen-websitegroep meldt hij **6 van 8** in plaats van rij 1 en ESB erbij te tellen. Dat kostte hem twee rijen en hij heeft ze niet genomen |
| `$`-controle op een skill die `$` voert | **Ja** | `grep -oE '\$[0-9]+' marketing-psychology/SKILL.md` geeft 21, en die skill is bewust zonder argument aangeroepen. Ik heb de telling nagedaan: cold-email 0, prospecting 0, copy-editing 0, competitor-profiling 0, marketing-psychology **21** |

De derde is de belangrijkste, want hij was de kern van mijn correctie: een `$`-controle
op een skill zonder `$`-reeksen bewijst niets. Lane A heeft de controle nu op de enige
skill in zijn set gedraaid die ze werkelijk draagt.

---

## GOEDGEKEURD MET CORRECTIES — lane B, de dienst: de tellingen kloppen, vijf citaten niet

Opdracht (1) voor lane B, en opdracht (4).

**De tellingen zijn zonder uitzondering reproduceerbaar.**

```
$ f=marketing/outreach/2026-09-17-b.md
$ grep -cE '^\| [0-9]+ \|' $f                                          -> 83
$ grep -c "2026-09-17 lane B" marketing/outreach/contacted.md          -> 48
$ grep -cE '^\|.*\| B \| 2026-09-17 \|$' marketing/outreach/geen-emailadres.md -> 9
```

83 − 35 = 48 klopt. De tekorttabel (35 + 30 + 9 + 4 + 3 + 1 + 1 = 83) klopt, en ik heb
de rijnummerreeksen uitgeschreven: 1 · 2 · 3-14 · 15-29 · 30 · 31-42 · 43-54 · 55 · 56 ·
57-62 · 63-66 · 67-74 · 75-83. Dat partitioneert 1 t/m 83 exact. De drie sectorgetallen
uit de botsingsregel (hovenier 374, glazenwasser 536, schilder 90) heb ik alle drie
uitgedraaid en ze komen precies uit.

**Correctie 1 — twee citaten in de skillstabel wijzen naar een lege regel.**
Poort (h) eist dat elk citaat een `grep -n`-regelnummer draagt **en dat het klopt**. Ik
heb alle 25 citaten van lane B van schijf gehaald. Drieëntwintig kloppen woordelijk.
Twee niet:

| Citaat van lane B | Wat er op die regel staat | Waar het wél staat |
|---|---|---|
| `prospecting/SKILL.md:20` ("de Local-SMB-tak") | **lege regel** | `:25`, `:33`, `:59` |
| `prospecting/SKILL.md:195` (`Remove duplicates (by business + address for Local SMB)`) | **lege regel** | `:196` — de tekst is woordelijk juist, hij staat één regel lager |

**Correctie 2, en deze weegt zwaarder — drie regelnummers in de claimcontroletabel
kloppen niet, en die tabel is de tabel die de prijsbelofte moet dragen.**

| Claim van lane B | Gecite­erd | Werkelijk | Klopt de claim zelf? |
|---|---|---|---|
| "299 euro eenmalig, exclusief btw" | `sectors.ts` r. 219 | r. 219 is de `intro` ("voor de prijs die hieronder staat"); de zin staat op **r. 221** | **Ja** — r. 221 én `offer.ts` r. 22 (`starter`, 299) |
| "een pagina die ze groot en scherp laat zien" | r. 226 | r. 226 is `},`; de zin staat op **r. 225** | **Ja** |
| conceptbouwer `proof` | r. 213 | r. 213 is `{`; de `proof`-tekst staat op **r. 215** | **Ja** |
| link wijst naar de hovenierspagina | r. 208 `slug: "hoveniers"` | **klopt** | Ja |

**Wat dit wel en niet betekent, en ik ben daar precies in.** Er gaat geen enkele
onware claim naar de owner: alle vier de beloftes staan woordelijk op zevren.nl, ik heb
ze van schijf gehaald, en 299 bij `planKey: "starter"` is de goede prijs voor een
portfoliovormige sector. **De inhoud is gedekt; de vindplaats is verschoven.** Dat is
geen afkeuring, maar het is wel precies het soort slordigheid dat de hele
claimcontroletabel waardeloos maakt, want een controleur die r. 219 opslaat en de zin
niet vindt, concludeert dat de prijs verzonnen is. Een controletabel die zelf
gecontroleerd moet worden, controleert niets.

**Voor morgen, één regel:** genereer de regelnummers met `grep -n` op het moment dat je
de tabel schrijft, niet uit het geheugen van een eerdere ronde — een blok in
`sectors.ts` schuift bij elke sectorwijziging op.

**Correctie 3 — één interne telling in lane B spreekt zichzelf tegen.** Bij de
1.46-verantwoording staat "de **vier** schilders zonder eigen domein (75, 76, 77 en
79-82)". Dat is twee keer mis: die opsomming bevat **zeven** nummers, en de schilders
zonder eigen domein zijn er **acht** (75 t/m 82; rij 78, Zutekouw, ontbreekt in de
opsomming). De onderliggende bewering — geen rij staat in twee tabellen — is wél juist;
de tekorttabel wijst 75-83 eenduidig aan poort (b) toe en ik heb de partitie nagerekend.
Het is dus een schrijffout in de verantwoording en geen dubbeltelling in het werk.

---

## GOEDGEKEURD MET ÉÉN KANTTEKENING — lane B en de correcties van gisteren

| Correctie van gisteren | Toegepast? | Wat ik zie |
|---|---|---|
| Alleen `$`-reeksen citeren die op schijf staan | **Ja, exact** | Lane B citeert `marketing-psychology/SKILL.md:154` als `The jump from $1 to $0 is bigger than $2 to $1`. Dat is woordelijk de schijftekst; ik heb regel 154 uitgedraaid |
| Rijvorm van lane A in `bellijst.md` | **Niet toegepast — er was geen gelegenheid** | Lane B schreef vandaag **nul** rijen op `bellijst.md` (`grep -c` geeft 0) |

De kanttekening gaat over die tweede. Lane B had negen geen-websitedossiers waarvan er
vier een telefoonnummer droegen, en heeft ze alle negen naar `geen-emailadres.md`
gestuurd in plaats van vier naar de bellijst. De grond die hij geeft is dat die vier
nummers uitsluitend in de samenvattende alinea staan, en dat 1.20(a) voor een belregel
net zo hard geldt als voor een mailregel.

**Ik geef hem daarin gelijk, en het is belangrijk dat ik dat hier zeg in plaats van bij
het weekrapport.** Een verkeerd gelezen cijfer in een telefoonnummer laat de owner een
vreemde bellen; dat is dezelfde schade als een verkeerd gelezen e-mailadres, en de
bronregel hoort dus dezelfde te zijn. Lane B heeft hem bovendien **niet als precedent
toegepast en wel als kandidaatregel voorgelegd**, wat exact de goede volgorde is. De
correctie van gisteren blijft daarmee onbeproefd, niet ontweken.

---

## AFGEKEURD — de LinkedIn-activity-route kan vandaag geen kaart sluiten

Opdracht (2). Dit is het inhoudelijk zwaarste punt van de dienst, dus ik werk het uit.

**Wat ik zelf heb nagerekend, vóór ik de weging maakte.** Ik heb de decodering
`ms = id >> 22` op alle acht beschikbare ID's gedraaid, inclusief de ijkdrager die 1.56
zelf noemt:

| activity-ID | Mijn uitkomst | Claim | Bron van de claim |
|---|---|---|---|
| `7405535688051347456` | 2025-12-13 | 13 dec 2025 | 1.56, het fundament zelf |
| `7145359777055797248` | 2023-12-26 | 2023-12-26 | lane B |
| `7137421920236367873` | 2023-12-04 | 2023-12-04 | lane B |
| `7155131047360233472` | 2024-01-22 | 2024-01-22 | lane B |
| `7072612908827860992` | 2023-06-08 | 2023-06-08 | lane B |
| `7480883538444136448` | 2026-07-09 | 2026-07-09 | lane B |
| `7087171262992510976` | 2023-07-18 | 18-07-2023 (Grobben) | lane B |
| `7161317622083432448` | 2024-02-08 | 8 feb 2024 (RC) | lane D |

**Acht van de acht, tot op de dag.** De schuifcontrole klopt ook in richting: schuif 21
geeft mij 2076-2083 en schuif 23 geeft 1996-1998 — lane B noteert 2072-2076 en
1995-1996, dus zijn twee grenzen zijn iets ruim opgeschreven, maar de conclusie is
onaantastbaar: LinkedIn bestaat sinds 2002 en alleen schuif 22 kán kloppen. **De
decodering is niet mijn bezwaar. Zij is geijkt en zij staat al in 1.38.**

**Mijn bezwaar zit op de aanvoer, en daar valt lane B's bewijs uiteen in twee ongelijke
helften.** De route is alleen nieuw als zij dóét wat 1.59 voor Instagram en TikTok
uitsluit: post-URL's leveren voor een **klein** account. Leg lane B's vijf positieve
controles daarnaast:

| Account | Wat het is | Zegt het iets over kleine accounts? |
|---|---|---|
| `techzine-nl` | vaktitel / mediabedrijf | Nee |
| `nlaic` | Nederlandse AI Coalitie, landelijk samenwerkingsverband | Nee |
| `anita-bos` (Rabo beheerd beleggen) | medewerker grootbank | Nee |
| `kees-vijfhuizen` | — | Niet vastgesteld |
| `cindyweerdenburg` | — | Niet vastgesteld |

Dat zijn precies de goed gelinkte accounts waarvan 1.59 al zégt dat de index ze wél
serveert. **Die vijf ijken de decoder, niet de aanvoer.** Lane B presenteert ze onder
één kop met de aanvoerclaim, en dat is de weegfout die ik hier corrigeer.

**De aanvoerclaim heeft twee dragers, en de sterkste is niet van lane B.** Lane D's
RC Glazenwasserij is een eenmanszaak met 237 Facebook-likes en een
`wordpress.com`-subdomein, en dáárvan kwam een post-URL mét activity-ID boven **terwijl
vier Instagram- en Facebookronden in dezelfde sessie nul post-URL's gaven**. Dat is een
binnen-één-dossier-vergelijking op exact het profiel van 24 augustus, met een negatieve
controle die had kunnen falen. Lane B's Grobben is de tweede drager van hetzelfde type.
**Twee dragers op profiel, twee lanes, onafhankelijk, op één dag — dat is een echte
convergentie en ik behandel haar als zodanig.**

**En dan de reden waarom zij vandaag tóch geen kaart sluit, en die is scherper dan
"nog te weinig dragers":**

1. **De route heeft over twee lanes nul datums binnen het venster opgeleverd.**
   Grobben komt uit op 18-07-2023, RC op 08-02-2024. Beide ruim buiten de twaalf
   maanden. De route heeft poort (a) dus nog nooit gesloten — zij heeft twee dossiers
   *eerlijk open gehouden*, wat winst is maar iets anders.
2. **De meetregel van de directives is niet gedraaid.** "Eerst een meting op tien namen,
   dan pas dossiers." Lane B draaide drie jáágronden (nul post-URL's, correct
   vastgesteld) en één toepassing; lane D één toepassing plus vier negatieve controles.
   Tien namen, met per regel wat zij aan leeftijd, adres en gedateerd spoor teruggeeft,
   heeft niemand gedraaid. **Beide lanes schrijven dat zelf op en vragen er zelf om.**
3. **Geen van beide heeft er een dossier mee gevuld.** Dat is het punt waarop ik ze
   allebei uitdrukkelijk goedkeur: zij hebben een route gevonden die hun eigen nul had
   kunnen wegpoetsen, en zij hebben hem als bewijsroute geparkeerd met de tweede-orde-rem
   van 1.38 erbij (de route selecteert op bedrijven mét LinkedIn, een andere populatie
   dan de ICP).

**Oordeel: de route mag vandaag geen kaart dragen, en zij hoort wel als kandidaatregel
met twee dragers naar zondag.** De meetopdracht van tien namen is de voorwaarde, en die
staat hieronder.

---

## AFGEKEURD — de drie dossiers op poort (a), na mijn eigen ronden

Opdracht (3). Drie dossiers stonden vanochtend op poort (a) open: Mooi Schoon en
SvD-glazenwassers (lane A) en Rob Grobben (lane B). Geen van drie staat op de
parkeerlijst van de owner, dus alle drie kregen een eigen ronde van mij.

### AFGEKEURD — Glazenwasserij Mooi Schoon, Vlagtwedde (GR)

**Poorten (a) en (b) beide open; de harde afkeurregel bindt.** Lane A heeft de vijf
bewijssoorten en de insolventieronde alle zes gedraaid en genoteerd — KvK-mutaties,
vergunningen, inspecties, SBB, vacature met plaatsingsdatum, plus
`site:drimble.nl/faillissementen 94302669` (schoon). Dat is volledig.

Mijn eigen ronde bevestigt de nul, en scherper dan lane A hem had. De samenvattende
alinea levert `Mooischoon2024@gmail.com` en 06-29116838, plus de twee voornamen Sven en
Jens. Ik heb de exacte-tekenreeksronde gedraaid:

```
zoekopdracht: "Mooischoon2024@gmail.com"
uitkomst:     Gmail-helppagina's, accounts.google.com en Wikipedia-naamgenoten
              (Riana Mooi, Moozlie, Mookda Narinrak, Moos) — NUL treffers op dit bedrijf
```

**Dat is lane A's verwerping, onafhankelijk gereproduceerd.** Het adres bestaat in de
alinea en nergens in de bruikbare laag. Ik vond nog twee gidsen die lane A niet noemt
(`schoonmaakbedrijvengids.nl`, `bedrijvenopdekaart.nl`) en ook die voeren het adres niet
in titel of URL. Poort (b) blijft dicht. **Geen kaart, en de rij op `geen-emailadres.md`
is de goede bestemming.**

### AFGEKEURD — SvD-glazenwassers, Roden (DR)

**Poort (b) dicht, poorten (a) en (f) open.** De vijf bewijssoorten zijn gedraaid en
genoteerd; de insolventieronde is **niet te draaien** omdat er geen KvK-nummer is, en
lane A heeft dat per 1.54 zowel in de poortlijst als in de ondernemerscontrole van het
ledger gezet. Dat is precies de vorm die 1.54 voorschrijft.

Mijn ronde bevestigt poort (b) positief — `"svd-glazenwassers@live.nl"` geeft
`glazenwasser-info.nl/svd-glazenwassers` als eerste treffer — en levert **geen** enkel
gedateerd spoor en **geen** registerpagina. De cylex-URL voert een cylex-ID (`11601272`),
geen registernummer; 1.40(d) in zuivere vorm. Zonder leeftijd is het venster van 1 tot 6
jaar niet vast te stellen, en de order van 24 augustus staat of valt daarmee.
**Geen kaart.**

### AFGEKEURD — Hoveniersbedrijf Rob Grobben, Rijssen (OV)

**Dit is het dossier dat het dichtst bij een kaart staat dat ik vandaag heb gezien, en
het valt op één poort.** Zeven poorten dicht, waaronder poort (b) hard: `info@rghovenier.nl`
met zijn eigen `/contact/` als eerste treffer op de exacte tekenreeks, plaatscontrole en
huisnummercontrole gehaald. Lek positief vastgesteld met twee `site:`-ronden waarvan de
tweede in de verbrede 1.41-vorm. Klantenstopronde schoon. Insolventieronde op KvK
84290269 schoon. Vijf poort-(a)-ronden gedraaid en genoteerd.

**Mijn eigen ronde, twee zoekopdrachten, reproduceert lane B exact en voegt niets toe.**
Ik kreeg dezelfde en enige post-URL terug —
`linkedin.com/posts/hoveniersbedrijf-rob-grobben_hovenier-tuinaanleg-beplanting-activity-7087171262992510976-Wk0y`
→ **18-07-2023** — en geen nieuwere. Geen gedateerde review, geen vacature, geen
mutatie. De Facebookpagina bestaat in twee varianten (`100076354685803` en
`105219445297660`) en levert geen post-URL.

**Eén val die ik expliciet benoem, want zij ziet er goed uit en is het niet.** Mijn ronde
gaf `hovenier.website/rijssen/` met de titel "ᐅ Top 30 hoveniers uit Rijssen (2026)".
Dat jaartal staat op de "**Telt niet**"-lijst van 1.38: het jaartal in een gidsentitel is
de huishouding van de uitgever en geen daad van het bedrijf. Wie dat als levensteken
boekt, sluit poort (a) op een leugen. Ik noteer hem hier zodat de volgende dienst hem
herkent in plaats van hem te vinden.

**Tweede aanwijzing, die ik niet als bron gebruik:** de samenvattende alinea zegt dat de
eigenaar "10 jaar in het hoveniersvak" zit. Dat is zijn vakjaren, niet de leeftijd van de
zaak (KvK 84290269 = 2021/22), dus het spreekt het profiel **niet** tegen. Ik leg het
vast omdat het er wél naar uitziet.

**De tekst zelf keur ik goed, en dat is geen troostprijs.** Ik heb hem langs de zeven
eisen van de staande order van 25 augustus gelegd en hij haalt ze alle zeven:

| Eis | Oordeel |
|---|---|
| Lek in geld of tijd, niet techniek | **Ja** — "Dan klikt hij door naar de volgende" en "hij staat nergens in je agenda"; het verlies is onzichtbaar en dat wordt uitgelegd |
| Bewijs uit zijn eigen zaak | **Ja** — zijn eigen paginatitel `Onze diensten` en zijn eigen plaats, beide in de bruikbare laag geverifieerd |
| Eén concreet beeld | **Ja** — de man op de bank op zondagavond met een offerte ernaast. Eén beeld, niet twee |
| De demo als bewijslast | **Ja, en correct gekozen** — hovenier draagt géén `demoSlug`, dus de conceptbouwer is de bewijslast; lane B heeft dat nagekeken in plaats van een demo te beloven die er niet is (1.40b) |
| Prijs zonder verontschuldiging | **Ja** — "299 euro eenmalig, exclusief btw. Die prijs staat er gewoon bij, dus je hoeft er niet voor te bellen" |
| Geen schaarste, geen haast, geen "klein bureau" | **Ja** — niets van dien aard |
| 160-220 woorden | **Ja — 199**, door mij geteld met `wc -w` |

De handtekening (poort i) sluit exact af met het voorgeschreven blok, telefoonnummer
inbegrepen; geen correctie nodig. De onderwerpregel haalt poort (g): 38 tekens, door mij
nageteld met `LC_ALL=C.UTF-8 wc -m` (alle drie de kandidaten kloppen: 38/38/40), en het
gecheckte detail "Rijssen" staat op teken 4 t/m 11, ruim binnen de eerste 45. De
verwijdertoets van `cold-email:41` haalt hij: zonder "Rijssen" blijft er geen regel over.
De UTM-campagne `hoveniers-w38` klopt — 17-09-2026 is ISO-week 38 — en `slug: "hoveniers"`
bestaat op `sectors.ts` r. 208.

**En tóch geen kaart.** Poort (a) is de poort die de owner beschermt tegen een mail aan
een zaak die misschien niet meer draait. Drie jaar is geen levensteken. Lane B's eigen
instructie — *niet versturen zolang er geen spoor binnen twaalf maanden is* — is de
juiste, en mijn ronde heeft dat spoor niet gevonden. **Het dossier blijft `lead - poort
open` en de tekst blijft liggen.**

---

## GOEDGEKEURD — poort (h) voor beide lanes, met twee correcties bij lane B

Opdracht (4). Beide lanes sluiten af met een gevulde `## Gebruikte skills`-tabel, en
beide tabellen zijn **echt**: ze noemen per skill waar hij is toegepast en wat hij
concreet heeft veranderd, en beide benoemen expliciet de skills die zij **niet** hebben
gebruikt, met een grond. Dat laatste is het tegendeel van hol — een skill aanroepen om
een tabel te vullen is de vorm die deze poort moet vangen, en lane A schrijft dat er
letterlijk bij.

**Lane A: 25 citaten gecontroleerd, 25 correct.** Ik heb elk regelnummer met `sed -n`
van schijf gehaald: `prospecting` :61/:68/:215, `cold-email` :37/:41/:93,
`marketing-psychology` :60/:61/:65/:66/:85/:86/:415/:416, `competitor-profiling`
:30/:31/:36/:37/:39/:40, `copy-editing` :31/:43/:117/:122/:152/:159. Alle 25 dragen
woordelijk de geciteerde tekst. **Dat is een foutloze tabel en de eerste die ik zo zie.**

**Lane B: 25 citaten gecontroleerd, 23 correct, 2 op een lege regel** (`prospecting:20`
en `:195`, zie de correctiesectie hierboven). De overige 23 — inclusief het
`$`-gevoelige `marketing-psychology:154` — kloppen woordelijk.

Beide tabellen halen poort (h). Lane B krijgt de correctie mee, niet de afkeuring:
twee verschoven regelnummers op vijfentwintig maken de tabel niet hol, en de inhoud
ervan is aantoonbaar echt werk — de `One ask, low friction`-toepassing die het tweede
vraagteken uit het Grobben-bericht haalde, is in de tekst zelf terug te zien.

---

## Voor het weekrapport

Mijn fundamentreeks 1.41 t/m 1.50 is vol en dicht. Ik schrijf geen regel buiten mijn
reeks en ik handhaaf de bestaande in plaats van nieuwe te maken. Deze kandidaten gaan in
de vaste vorm naar zondag.

**Kandidaat 1 — de `$`-substitutie in een skillargument volgt de positionele-parameter­regel,
en nu is de regel zelf gemeten in plaats van waargenomen.**
*Tekst: wie een skill mét argument aanroept, krijgt elke `$N` in de skilltekst vervangen
door het N-de witruimte-token van het argument, geteld vanaf `$0` = het eerste woord; een
`$N` waarvan N buiten het aantal tokens valt, blijft letterlijk staan. Roep een skill die
`$`-reeksen draagt daarom zonder argument aan, of lees zijn getallen van schijf.*
**Dragers: 10 in één aanroep, waarvan 5 die hadden kunnen falen.** Ik heb
`marketing-psychology` vandaag mét argument aangeroepen en de geserveerde tekst naast de
schijftekst gelegd. Vervangen, exact zoals de regel voorspelt: `$1`→"whether",
`$0`→"Judge", `$2`→"a" (r. 154), `$3`→"cold" (r. 204), `$16`→"there" (r. 306). Níét
vervangen omdat N buiten het bereik van 29 tokens valt: `$90` (r. 204), `$99`/`$100`
(r. 294/299), `$500`/`$497` (r. 301), `$80`/`$100` (r. 306), `$30` (r. 316).
**Waarom dit meer is dan 1.44 al zegt:** 1.44 stelt vast dát een argument de tekst kan
beschadigen en schrijft de `$`-telling voor als voorzorg. Deze meting geeft het
mechanisme, en daarmee twee dingen die de telling niet geeft — je kunt vooraf
voorspellen wélke getallen sneuvelen, en je weet dat een skill met alleen hoge
`$`-bedragen (prijsvoorbeelden boven het aantal argumentwoorden) veilig is.

**Kandidaat 2 — de LinkedIn-activity-route is een poort-(a)-bewijsroute met twee dragers
op profiel; meet haar op tien namen vóór zij een dossier vult.**
*Tekst: de vorm `linkedin.com/posts/<handle>_<slug>-activity-<id>-<code>` draagt de
aanmaakdatum in de ID (`ms = id >> 22`) en de handle vóór de underscore levert de binding
van 1.40(e) in dezelfde URL. Anders dan de Instagram- en TikTok-route van 1.59 levert de
zoekindex deze URL ook voor een klein account. Bewijsroute, geen jaagroute, en pas
dossiervullend na de meetregel van de directives.*
**Dragers: 2 op profiel, uit twee lanes onafhankelijk op één dag** — RC Glazenwasserij
(lane D: eenmanszaak, 237 likes, `wordpress.com`-subdomein; LinkedIn-post-URL wél, vier
Instagram-/Facebookronden nul) en Hoveniersbedrijf Rob Grobben (lane B: eenmanszaak,
één eigen post-URL). **Decoder: 8 van 8 door mij nagerekend**, inclusief de ijkdrager
`7405535688051347456` → 13-12-2025 die 1.56 zelf noemt. **Negatieve controles:** 3 lege
jaagronden (lane B) en een schuifcontrole die 21 en 23 uitsluit.
**Wat er tegen weegt en waarom de meting de voorwaarde is:** lane B's vijf semantische
bevestigingen komen van een vaktitel, een landelijke coalitie en bankmedewerkers — grote,
goed gelinkte accounts, die de decoder ijken en niets over de aanvoer zeggen. En de route
heeft over beide lanes **nul** datums binnen het venster opgeleverd (18-07-2023 en
08-02-2024). Zij houdt dossiers eerlijk open; dat zij er ooit een sluit, is nog niet
gemeten. **Concrete meetopdracht voor de eerste lane die hem krijgt:** draai
`linkedin.com/posts/<handle>` op tien namen die al in het ledger staan en noteer per naam
in één regel of er een post-URL is, welke datum hij decodeert en of die binnen twaalf
maanden valt.

**Kandidaat 3 — een belregel heeft dezelfde bronnendrempel als een mailregel.**
*Tekst: een telefoonnummer dat uitsluitend in de samenvattende alinea staat, draagt geen
rij op `bellijst.md`; 1.20(a) geldt voor het belbord net zo hard als voor het mailbord.*
**Dragers: 5.** Vier geen-websitedossiers van lane B (Voortman, Garritsen, Ruesink,
Schildersblik) plus één lege controleronde op de gidstitels. **Ik draag hem voor met mijn
eigen steun**, wat ik er expliciet bij zeg omdat het een regel is die het aantal
belregels *verlaagt* en lane B hem juist daarom niet zelf als precedent heeft toegepast.
De schade is symmetrisch: een misgelezen cijfer laat de owner een vreemde bellen, precies
zoals een misgelezen adres een mail naar een vreemde stuurt. Lane C liep vandaag in twee
andere bestanden op dezelfde bestemmingsregel vast (op het náást liggende geval: géén
nummer, 1.24), dus twee lanes lopen op één dag onafhankelijk op dit gat.

**Kandidaat 4 — de exacte-tekenreeksronde is een tweezijdige toets en mag een adres ook
verwerpen.**
*Tekst: 1.28 wordt gebruikt om een adres te bevestigen; hij verwerpt er ook een, en dat
maakt van 1.20(a) een uitvoerbare toets in plaats van een verbod.*
**Dragers: 3, waarvan 1 negatief, en alle drie vandaag door mij onafhankelijk
gereproduceerd.** Bevestigd: `svd-glazenwassers@live.nl` (eerste treffer is zijn eigen
gidspagina) en `info@rghovenier.nl` (eerste treffer is zijn eigen `/contact/`).
Verworpen: `Mooischoon2024@gmail.com` geeft Gmail-helppagina's en Wikipedia-naamgenoten
en nul treffers op het bedrijf, terwijl de samenvattende alinea het adres tweemaal
woordelijk gaf. **Dat de toets kan falen is wat hem bruikbaar maakt** — zonder de
negatieve controle zou "de tekenreeksronde bevestigt het adres" net zo goed over de
zoekmachine kunnen gaan als over het bedrijf.

**Kandidaat 5 — één grondtoken per rij maakt een tekorttabel machinaal controleerbaar.**
*Tekst: schrijf de bindende grond als één vast token in een eigen kolom (`GROND: lead`),
niet als los woord in de oordeelstekst; dan is elk getal in de tekorttabel met één
`grep -c` te reproduceren en slaat de telling niet aan op een toelichting.*
**Dragers: 1 lane, 6 gronden, 53 rijen.** Lane A voerde de vorm vandaag in en meldde
zelf waaróm (`grep -c "Lead —"` sloeg eerder aan op rijen die het woord in een
toelichting voerden). Ik heb alle zes getallen blind gereproduceerd en alle zes kwamen
exact uit, inclusief de partitie van 1 t/m 53. **Waarde: dit is de goedkoopste
maatregel die ik dit kwartaal langs heb zien komen** — hij kost één kolom en hij haalt
de tekortverantwoording uit de categorie "op Sams woord".

**Handhaving in plaats van een nieuwe regel, één geval.** 1.38's "Telt niet"-lijst
(het jaartal in een gidsentitel) heeft vandaag gewerkt: mijn eigen Grobben-ronde gaf
"ᐅ Top 30 hoveniers uit Rijssen (2026)" en de bestaande regel ving hem. Geen nieuwe
regel nodig; ik noteer de drager onder de bestaande.

---

## Gebruikte skills

Elk citaat is met `grep -n` / `sed -n` van schijf gehaald uit `.claude/skills/<skill>/SKILL.md`
en door mij nagelezen vóór ik het opschreef.

| Skill | Waar toegepast | Wat het concreet veranderde |
|---|---|---|
| `cold-email` | Op de drie kandidaat-onderwerpregels van Rob Grobben en op de vraag of de verzendklare tekst de swipe-test haalt | De verwijdertoets — `If you remove the personalized opening and the email still makes sense, the personalization isn't working.` (`:41`) — is de toets waarop ik lane B's **keuze** goedkeur en niet alleen zijn regel: kandidaat C ("De tuinen die je aanlegt, en wie ze ziet") overleeft de verwijdering en past dan op elke hovenier van Nederland, kandidaat A niet. `One ask, low friction` (`:49`) met `Interest-based CTAs ... One CTA per email. Make it easy to say yes with a one-line reply.` (`:51`) heeft mijn oordeel over de slotzin bepaald: "Zegt het je iets? Eén regel terug is genoeg, bellen mag ook" is één vraag plus een tweede antwoordweg, niet twee vragen — de belregel die de owner sinds 25 augustus eist, is hier correct als wég en niet als tweede verkoopzin uitgevoerd. `Lead with their world, not yours` (`:45`) is waarom ik de openingsalinea goedkeur: de eerste drie zinnen gaan volledig over de man op de bank en niet over ZEVREN. En `- 2-4 words, lowercase, no punctuation tricks` (`:93`, met `references/subject-lines.md:5` en `:18`) verliest opnieuw bewust van poort (g) van de owner; ik bevestig die overrule in plaats van lane B erop af te rekenen |
| `marketing-psychology` | Op de weging van de LinkedIn-route en op de vraag welke nul ik vandaag zou melden. **Mét argument aangeroepen, bewust**, om de `$`-substitutie te meten (zie kandidaat 1) | `### Survivorship Bias` (`:415`) met `Focusing on successes while ignoring failures that aren't visible.` (`:416`) is de regel die mijn belangrijkste correctie op lane B heeft opgeleverd. Zijn vijf positieve LinkedIn-controles zijn vijf accounts die gevónden zijn; de vraag is hoeveel kleine accounts géén post-URL opleverden, en dat aantal staat nergens. Daarom splits ik zijn bewijs in "decoder geijkt" (sterk) en "aanvoer aangetoond" (twee dragers, niet vijf). `### Theory of Constraints` (`:65`) met `Every system has one bottleneck limiting throughput.` (`:66`) stuurde waar ik mijn eigen ronden in stak: niet verdeeld over 136 dossiers, maar alle vier in de drie dossiers die op poort (a) open stonden — dat is de enige poort waar een ronde vandaag nog een kaart kon opleveren. `### Map ≠ Territory` (`:85`) met `Models and data represent reality but aren't reality itself.` (`:86`) is waarom ik lane A's meting uitdrukkelijk als **index**meting goedkeur en niet als marktuitspraak, en `### Fundamental Attribution Error` (`:106`) hield mijn oordeel over lane B's verschoven regelnummers bij de omstandigheid (een blok in `sectors.ts` schuift) in plaats van bij slordigheid als karakter — vandaar de concrete werkregel in plaats van een afkeuring |
| `prospecting` | Op de vraag of de drie poort-(a)-dossiers met een eigen ronde alsnog verzendklaar konden worden | `- **High**: confirmed by at least two independent sources or official business page` (`:68`) is de lat waarop ik Mooi Schoon heb afgekeurd: twee zoekopdrachten die dezelfde samenvattende alinea teruggeven zijn twee *queries* op één bron, geen twee bronnen — precies de fout die lane A zelf al had vermeden, en ik heb hem met de tekenreeksronde onafhankelijk bevestigd. `- [ ] Confidence levels honest — "High" requires 2 independent sources, not just two of your own searches` (`:200`) zegt hetzelfde in de kwaliteitscheck en is de reden dat ik lane B's eigen keuze — `info@rghovenier.nl` op de *official business page*-route noteren in plaats van op "twee bronnen" — goedkeur. `7. **No source URLs**. Every claim should be traceable to a public source.` (`:215`) is waarom elke regel in dít bestand een commando, een URL-fragment of een registergetal draagt |
| `competitor-profiling` | Op de vraag of het lek bij Grobben werkelijk bestaat, vóór ik zijn tekst goedkeurde | `### 4. Honest Assessment` (`:39`) met `Don't exaggerate competitor weaknesses or downplay their strengths.` (`:40`) is de toets waarop ik lane B's Voortman-afvaller goedkeur: hij had daar een lek genoteerd op een smalle `site:`-ronde en heeft het na de verbrede ronde ingetrokken toen `/portfolio/` bovenkwam. Dezelfde regel beschermt Grobben tegen het omgekeerde: twee verbrede ronden gaven daar nul projectpagina's, dus het lek is positief vastgesteld en niet aangenomen. `### 3. Current Data` (`:36`) met `Profiles are snapshots. Always include the date generated.` (`:37`) is waarom ik de termijnwaarschuwing van lane A bij Glasbewassing de Hondsrug doorzet naar de samenvatting: die goedgekeurde kaart van 05-09 verloopt overmorgen |
| `copy-editing` | Als laatste pas over dit bestand | Sweep 4, **Prove It** (`:117`, met `- Unsubstantiated claims` op `:122`) haalde één bewering uit een eerdere versie van mijn LinkedIn-sectie: ik had "lane B's bewijs is zwak" staan, wat noch waar noch bruikbaar is — het bewijs is sterk voor de decoder en dun voor de aanvoer, en die splitsing staat er nu, met de vijf accounts benoemd. Sweep 5, **Specificity** (`:152`, met `- Round numbers that feel made up` op `:159`) ving mijn eigen "ongeveer 25 citaten" bij poort (h): het zijn er precies 25 per lane en ik heb ze geteld. Sweep 1, **Clarity** (`:31`, met `- Sentences trying to say too much` op `:43`) knipte mijn oordeel over de claimcontroletabel in twee delen — wat er mis is en wat het níét betekent — omdat de eerste versie beide in één zin propte en daardoor leek te zeggen dat de prijsclaim onjuist was |
| `product-marketing` | Als eigenaar van `.agents/product-marketing.md`, op de vraag of er vandaag een fundamentregel bij moest | **Geen wijziging aan het fundament.** Mijn reeks 1.41 t/m 1.50 is vol en dicht, dus de vijf kandidaten van vandaag staan onder `## Voor het weekrapport` met tekst, aantal dragers en de dragers zelf, en niet als nieuwe regel. Eén bestaande regel is gehandhaafd in plaats van gedupliceerd: 1.38's "Telt niet"-lijst ving mijn eigen gidsentitel-val bij Grobben, dus die drager gaat onder de bestaande regel en er komt geen nieuwe bij. **Geen changelog-regel vandaag**, want er is niets gewijzigd |
| `marketing-council` | **Niet gebruikt** | Grond: die skill is per `agents/skills-toewijzing.md` toegewezen aan het weekrapport, waar meerdere perspectieven tegen het plan aankijken. Een verificatiedienst beoordeelt feiten tegen poorten, en daar helpt een panel niet |
| `pricing` | **Niet gebruikt** | Grond: de prijs stond niet ter discussie. 299 bij `planKey: "starter"` volgt mechanisch uit `sectors.ts` r. 208-210 en `offer.ts` r. 22; ik heb dat gecontroleerd, niet afgewogen |
| `customer-research` | **Niet gebruikt** | Grond: de bindende vraag van vandaag was de aanvoer van gedateerde sporen en e-mailadressen in de zoekindex, niet wat de koper denkt. De koperkennis die ik nodig had, staat in `agents/outreach-agent.md` onder het profiel van 24 augustus |

---

## Samenvatting — één regel per oordeel

| Onderwerp | Oordeel | In één regel |
|---|---|---|
| Lane A — de dienst | **GOEDGEKEURD** | 53 dossiers, 0 kaarten, en alle zes tellingen door mij blind gereproduceerd; de reeksen partitioneren 1 t/m 53 zonder gat |
| Lane A — correcties van gisteren | **GOEDGEKEURD** | Alle drie toegepast, en die van het quotum tegen zijn eigen belang: 6 van 8 gemeld in plaats van twee rijen bijgeteld |
| Lane A — poort (h) | **GOEDGEKEURD** | 25 citaten gecontroleerd, 25 correct — de eerste foutloze skillstabel die ik zie |
| Lane B — de dienst | **GOEDGEKEURD MET CORRECTIES** | 83 dossiers, 0 kaarten, partitie en alle tellingen kloppen; drie correcties: 2 citaten op een lege regel, 3 verschoven regelnummers in de claimcontroletabel, 1 interne telling ("vier schilders" zijn er acht) |
| Lane B — correcties van gisteren | **GOEDGEKEURD MET KANTTEKENING** | De `$`-correctie exact toegepast; de bellijst-rijvorm bleef onbeproefd omdat lane B nul belregels schreef — met een grond die ik onderschrijf en die als kandidaat 3 naar zondag gaat |
| Lane B — poort (h) | **GOEDGEKEURD** | 23 van 25 citaten correct; de twee fouten verschuiven een regelnummer en maken de tabel niet hol |
| LinkedIn-activity-route als poort-(a)-drager | **AFGEKEURD voor vandaag** | Decoder 8 van 8 door mij nagerekend, maar de aanvoer rust op 2 dragers en niet op 5, en de route gaf over twee lanes nul datums binnen het venster; meetregel van tien namen is de voorwaarde |
| Glazenwasserij Mooi Schoon, Vlagtwedde (GR) | **AFGEKEURD** | Vijf bewijsroutes plus insolventieronde volledig gedraaid; mijn eigen tekenreeksronde verwerpt `Mooischoon2024@gmail.com` — geen geverifieerd adres, dus de harde afkeurregel bindt |
| SvD-glazenwassers, Roden (DR) | **AFGEKEURD** | Adres hard, maar geen registerpagina en geen KvK-nummer: leeftijd niet vast te stellen, insolventieronde niet te draaien, poorten (a) en (f) open |
| Hoveniersbedrijf Rob Grobben, Rijssen (OV) | **AFGEKEURD** | Zeven poorten dicht en een tekst die alle zeven overtuigingseisen én de handtekening haalt — en poort (a) blijft open: mijn eigen ronde geeft dezelfde en enige post-URL, 18-07-2023, drie jaar oud |
| De dagnorm van dertig | **NIET GEHAALD, correct gemeld** | 0 van 30 uit deze twee lanes, in de vaste vorm verantwoord, zonder dat één poort is versoepeld |
| **Termijnwaarschuwing voor de owner** | **ACTIE** | De goedgekeurde kaart voor **Glasbewassing de Hondsrug** (Emmen, 05-09) verloopt volgens haar eigen ledgernotitie rond **19-09-2026** — overmorgen. Versturen of laten vervallen is zijn keuze, maar hij moet hem vandaag zien |

Azzouz, 17 september 2026.
