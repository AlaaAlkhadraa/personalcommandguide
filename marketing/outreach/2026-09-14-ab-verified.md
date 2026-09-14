# Verificatie 14 september 2026 — lanes A en B

Azzouz, verificatiedienst. Ik verifieer uitsluitend `2026-09-14-a.md`
(Groningen/Friesland/Drenthe) en `2026-09-14-b.md`
(Overijssel/Gelderland/Flevoland). Lanes C en D liggen bij de tweede
sessie in `-cd-verified.md`; ik heb die bestanden niet aangeraakt.

**Goedgekeurde kaarten vandaag: nul.** Niet omdat ik streng ben geweest,
maar omdat beide lanes nul kaarten hebben aangeboden. Er was niets om
goed te keuren en er is niets weggekeurd dat er wel had moeten staan.

---

## De telling, zelf nagedaan, met het commando erboven

De opzichter telt nul kaarten in beide lanes. Dat klopt, en hier is de
meting in plaats van de bewering:

```
$ grep -cE '^## [0-9]+\. ' marketing/outreach/2026-09-14-a.md
0
$ grep -cE '^## [0-9]+\. ' marketing/outreach/2026-09-14-b.md
0
```

Beide lanes melden hun tekort in de vaste vorm van de directives, en
beide noemen het aantal beoordeelde dossiers. Ook dat heb ik nageteld
met hun eigen commando's:

```
$ grep -c "^| [0-9]" marketing/outreach/2026-09-14-a.md
41                      (lane A claimt 41 — klopt)
$ grep -c '^| [0-9]\+ | ' marketing/outreach/2026-09-14-b.md
52                      (lane B claimt 52 — klopt)
```

Eenenveertig en tweeënvijftig dossiers, samen drieënnegentig, nul
kaarten. Dat is de zevende dag op rij voor lane A en het is geen
inzetprobleem: ik heb vandaag vijf eigen ronden gedraaid op de dossiers
die het verst kwamen, en ik kom op dezelfde muur uit als zij.

---

## Opdracht 1 — klopt de tekortverantwoording met de regels erboven?

De directives van deze week eisen: *elke samenvattende telling draagt de
meetwijze en is reproduceerbaar uit de regels erboven.* Ik heb elke
telling in beide bestanden nagerekend. Hieronder eerst wat klopt, dan wat
niet klopt, want het tweede is kort en het eerste is lang.

### Wat reproduceert (lane A)

De ledgerdelta van lane A is de zuiverste telling die ik deze week heb
gezien. Lane A claimt 2450 → 2478, dus 28 nieuwe rijen, en noemt het
commando. Nagedaan over de commitgrens heen:

```
$ git show ad51830~1:marketing/outreach/contacted.md | grep -c "^|"
2450
$ git show ad51830:marketing/outreach/contacted.md | grep -c "^|"
2478
$ grep -c "2026-09-14 lane A" marketing/outreach/contacted.md
28
```

Drie onafhankelijke wegen, hetzelfde getal. Zo hoort het.

### Wat reproduceert (lane B)

Lane B's rekenkunde sluit overal op de eenheid en ik heb elke som
nagerekend in plaats van geloofd:

- Sectorsom 17 + 14 + 21 = 52 — nageteld per sectiekop, komt uit op
  hovenier 17, glazenwasserij 14, schilder/stukadoor 21. Klopt.
- Ledgersom 46 verse rijen + 6 dossiers op een bestaande rij = 52.
  `grep -c "2026-09-14 lane B" contacted.md` geeft 46. Klopt.
- Tekorttabel 31 + 8 + 6 + 2 + 2 + 2 + 1 = 52. Klopt.
- Per-sector-subsplits (hovenier 10+3+2+1+1, glazenwasserij 7+4+1+1+1,
  schilder 14+1+3+1+2). Alle drie kloppen.
- De `$`-telling over acht skills, de kern van bevinding 8, reproduceert
  **exact** in mijn eigen sessie: prospecting 0, cold-email 0,
  marketing-psychology 8, copy-editing 0, copywriting 0,
  customer-research 1, offers 5, competitor-profiling 1. En de acht
  regelnummers (154, 204, 294, 299, 301, 304, 306, 316) kloppen alle acht
  woordelijk, `$1` staat er inderdaad twee keer.

Dat laatste is het model van de vorm die de directives bedoelen: een
getal, het commando eronder, en het commando doet wat het getal zegt.

### AFGEKEURD als meetwijze — lane B, één commando dat zijn eigen getal niet geeft

Lane B schrijft:

```
$ grep -c "| 14-09-2026 |" marketing/outreach/geen-emailadres.md
6
```

Dat commando geeft vandaag **21** en gaf op lane B's eigen commit
(`b37c749`) **12**. Nooit 6.

```
$ grep -c "| 14-09-2026 |" marketing/outreach/geen-emailadres.md
21
$ git show b37c749:marketing/outreach/geen-emailadres.md | grep -c "| 14-09-2026 |"
12
```

**Het getal zes is juist** — lane B heeft precies zes rijen in dat
bestand gezet (regels 1314-1319, alle zes met de lanekolom `B`). Het is
uitsluitend het commando dat niet meet wat het claimt te meten: het telt
alle vier de lanes en niet de eigen. De juiste vorm, die deze week
mogelijk werd doordat de lanekolom verplicht is geworden, is:

```
$ grep -c '| B | .*| 14-09-2026 |' marketing/outreach/geen-emailadres.md
```

Dit is geen slordigheid met gevolgen voor een kaart — er is geen kaart —
maar het is exact het gebrek waartegen de vormregel van deze week is
geschreven, en het staat in het bestand van de lane die verder de
zuiverste rekenkunde van de twee levert. Correctie genoteerd, geen
verwijt: de grond van de regel is dat een niet-reproduceerbare telling
de betrouwbaarheid kost van álle tellingen in hetzelfde bestand, en die
van lane B kloppen allemaal.

### AFGEKEURD als meetwijze — lane A, poort (c) telt dertien waar de regels er acht dragen

Dit is de zwaardere van de twee. Lane A's tekorttabel voert:

| Grond | Lane A claimt | Wat de regels erboven dragen |
|---|---|---|
| Poort (e): staat al in het ledger | 13 | 13 — klopt (19, 20, 21, 22, 26, 28, 29, 30, 31, 32, 35, 40, 41) |
| Poort (c): te lang gevestigd | **13** | **8** (2, 3, 6, 15, 27, 37, 38, 39) |
| Leeftijd niet vast te stellen | 7 | 7 — klopt (4, 5, 7, 8, 9, 23, 24) |
| Poort (b): in venster, geen adres | 6 | 6 — klopt (16, 17, 18, 33, 34, 36) |
| Poort (a) | 1 | 1 — klopt (dossier 1) |
| Plaats niet vast te stellen (1.40h) | 1 | 1 — klopt (dossier 25) |

De som sluit op 41 en dat is precies wat de fout verbergt. Om aan
dertien te komen zijn **vijf dossiers onder poort (c) geschoven die
zelf geen enkele leeftijdsuitspraak dragen**: 10 (Regtop), 11 (Dijk),
12 (Glazenwassersbedrijf Drachten), 13 (Postma Lolle) en 14 (Buist).
Lees hun eigen regels terug en er staat, woordelijk, alleen "geen adres"
en een telefoonnummer in de titel. Acht plus vijf is dertien; dat is de
hele herkomst van het getal.

Dezelfde overschrijding staat in het proza eronder: *"alle acht zijn
zaken van ver buiten het leeftijdsvenster"* over de acht titels met een
telefoonnummer. Dat is een leeftijdsvaststelling over acht bedrijven, en
in de dossierregels van diezelfde acht staat zes keer "leeftijd niet
vastgesteld" of "geen registerpagina". De bewering is niet gedekt door
het bestand waarin zij staat.

En een derde keer, bij dossier 35: *"Vijf rijen, door drie lanes
geschreven."* Nageteld:

```
$ grep -c -i "hondenhut" marketing/outreach/contacted.md
3
```

Drie rijen, waarvan er één de klantenstopgrond draagt (`2026-09-01 lane
A`) en twee "buiten deze lane" / "buiten lane-regio" zeggen. De
substantie van de bevinding is volledig juist — het bedrijf stond in het
ledger en had nooit zeven zoekopdrachten mogen krijgen — maar de
kwantificering eromheen reproduceert niet.

**Waarom ik hier gewicht aan hang terwijl er geen kaart op staat.** Lane
A's bevinding van vandaag is dat een *telling* van treffers geen
poortuitkomst is, en dat is een goede regel. Diezelfde dienst doet op
drie plaatsen precies dat: een telling neerzetten waar een lezing hoort.
Dat is geen tegenspraak die de bevinding ongeldig maakt, het is het
bewijs dat de bevinding ook op de auteur zelf van toepassing is — en zo
neem ik hem hieronder op in het fundament.

---

## Opdracht 2 — de vijf bewijsroutes en de insolventieronde op elk dossier dat op poort (a) openstaat

Er staan drie dossiers open op poort (a): Huizinga Schoonmaakservice
(lane A), Zoethout Hovenier en Stukadoorsbedrijf Kommerkamp (beide lane
B). Per dossier de toets, en daarna mijn eigen ronde.

### GOEDGEKEURD als procesuitvoering — lane A, Huizinga Schoonmaakservice

Lane A heeft de order letterlijk uitgevoerd. De vijf toegewezen
bewijssoorten staan in de vaste volgorde, met per route één regel wat zij
gaf: KvK-mutatie (niets, geen mutatiedatum in de companyinfo-URL),
gemeentelijke/GGD-vergunning (niet van toepassing op vorm, leeg op
uitkomst), inspectie of rapport (geen regime dat per bedrijf
publiceert), SBB-erkenning (uitsluitend voorlichtingspagina's — de
1.12-muur), vacature met plaatsingsdatum (niets, één werkzaam persoon).
Daarnaast gedraaid en leeg genoteerd: de 1.13-prijsaanpassingsroute en
de 1.38-postroute.

De insolventieronde (1.40a) is gedraaid op het enige kaartrijpe dossier
en schoon bevonden, mét het commando erboven, en uitdrukkelijk **niet**
op de overige veertig — kaartrijp of niets, precies zoals de regel het
wil. Dit is de eerste dienst deze week waarin ik de vijfroutetabel
compleet aantref.

### AFGEKEURD als procesuitvoering — lane B, Zoethout en Kommerkamp

Lane B laat twee dossiers op poort (a) openstaan en draait de vijf
routes bij geen van beide. Bij Zoethout staat er: *"Poort (a): OPEN.
Geen gedateerd spoor in de bruikbare laag na drie ronden."* Drie ronden,
niet vijf, en geen enkele regel per route. Bij Kommerkamp is de
Stagemarktroute (de SBB-erkenning) wél gedraaid en als bevinding
opgeschreven, maar de andere vier niet.

De order is expliciet: *vóór een dossier op poort (a) open mag blijven
staan, zijn deze vijf routes gedraaid en staat per route in één regel
wat zij gaf.* Dat is hier niet gebeurd. Ik weeg het als volgt: bij
Kommerkamp is het gevolg nul, want het dossier is los daarvan dood (het
lek bestaat niet, zie hieronder). Bij Zoethout is het gevolg óók nul,
maar om een reden die lane B niet kende en die ik hieronder lever. De
procesregel blijft geschonden en hoort morgen gedraaid te worden; de
uitkomst van vandaag verandert er niet door.

De insolventieronde is bij Kommerkamp wél gedraaid en schoon bevonden.
Bij Zoethout niet, en dat is correct: het dossier is niet kaartrijp, en
de regel is kaartrijp of niets.

### Mijn eigen ronde op poort (a) — Huizinga, en waarom hij ook vandaag niet dichtgaat

Ik heb het enige verzendklare dossier van beide lanes zelf gejaagd, met
formuleringen die lane A niet heeft gebruikt. De uitkomst is dat ik zijn
waarneming niet alleen bevestig maar versterk, en in de verkeerde
richting voor de kaart.

Twee eigen ronden op de reviewroute gaven **twee** gedateerde
klantbeoordelingen in plaats van één: 18 juni 2026 (dezelfde die lane A
drie keer kreeg) en daarnaast 5 mei 2026, met eigen tekst — ramen
gewassen, goten gereinigd, meteen een vervolgafspraak. Datum, tekst en
bedrijf staan bij elkaar, dus de 1.22-toets haalt hij.

**En alle vier de ronden geven het uitsluitend in de samenvattende
alinea.** Elke Werkspot-URL in de resultatenlijst is een stadsoverzicht
(`/schoonmaak/schoonmaakbedrijf-vakmannen/assen`,
`/schoonmaak/gevelreiniger-vakmannen/assen`); er is geen profielpad, en
geen URL-titel draagt een datum. De Facebookroute geeft
`facebook.com/p/Huizinga-Schoonmaak-en-Reiniging-61558366917550/` — een
pagina-ID, geen post-ID, geen datum. Dat is 1.40(e) woordelijk.

Daarmee staat de waarneming van lane A op **vijf onafhankelijk
geformuleerde ronden over twee agenten**, met twee verschillende
gedateerde beoordelingen, altijd in de alinea en nooit in de bruikbare
laag. Per 1.20(a) sluit dat poort (a) niet, en het verbod van deze week
op een kaart met een open poort is onvoorwaardelijk. **Geen kaart.**

Ik heb daarnaast de leeftijd en het adres zelf nagelopen en beide
kloppen: de companyinfo-URL
`handelsonderneming-huizinga-assen-93508603-000059043962` voert beide
nummers gescheiden in het pad, dus 1.40(d) is hier positief opgelost, en
`Info@nhuizinga.nl` komt terug naast zijn eigen `/over-ons`. De
paginatitel luidt "Huizinga Schoonmaakservice | Softwash & schoonmaak in
Assen (Drenthe)", dus de plaatscontrole van 1.40(h) haalt hij ook.

### Mijn eigen ronde op Zoethout — en hier sla ik lane B's lezing om

Dit is de belangrijkste vondst van mijn dienst en zij gaat tegen een
conclusie van lane B in.

Lane B houdt poort (c) open met de lezing: KvK 81958471, opgericht
04-03-2021, **vijf jaar, midden in het venster**, en de handelsnaam op
de site (Hoveniersbedrijf Bauer) spreekt het register tegen. De
over-onspagina die zo'n tegenspraak zou beslissen, bestaat niet.

Eén eigen ronde geeft wat die pagina zou hebben gezegd: **de eigenaar,
Niels Bauer, werkt ongeveer vijfentwintig jaar als hovenier.** Daarnaast
komt het uurtarief van 48 euro inclusief btw en het werkgebied
(30 km rond Zutphen en Almere) mee, plus `Info@zoethouthovenier.nl` en
06-26286766.

**Hoe zwaar weegt dat.** De vijfentwintig jaar staat in de
samenvattende alinea en niet in een URL-titel, dus per 1.20(a) is het
geen bron. Maar de richting is hier **afwijzing** en niet het sluiten
van een poort, en dat is de veilige kant van diezelfde regel — precies
de redenering waarmee lane A vandaag Trimsalon Kwispel op 2005 heeft
laten vallen. Wat het verandert is de verwachtingswaarde van dit
dossier: lane B laat hem achter als een zaak van vijf jaar midden in het
venster met alleen poort (a) en de naamkwestie open, en dat leest als
een dossier dat morgen af te maken is. Het is vrijwel zeker een
1.15-geval — papieren uit 2021 over een vakman van vijfentwintig jaar —
en dus buiten profiel.

Ik zet de ledgerstatus daarom om (zie de ledgernotities) zodat de
volgende lane er geen dienst in steekt op een verkeerde verwachting.
Dit is ook de reden dat het ontbreken van de vijf bewijsroutes hier geen
praktisch gevolg heeft: die vijf ronden zouden in een dossier zijn
gegaan dat op leeftijd valt.

### Mijn eigen ronde op Kommerkamp — lane B's duurste bevinding is hard

Lane B trok een bijna-verzonden bericht terug omdat
`stukadoorsbedrijfkommerkamp.nl/impressie/` zijn portfolio blijkt te
zijn. Ik heb dat niet geloofd maar nagekeken, want er hangt een
ingetrokken kaart aan.

Het klopt, en harder dan lane B het opschrijft: de pagina staat in de
**bruikbare laag**, met URL én titel ("Stukadoor Diepenveen — Mike
Kommerkamp"), en zij voert een selectie van afgerond werk in Deventer en
omgeving. In dezelfde ronde komt ook zijn TransFirm-record
`86089773-000052086755-stukadoorsbedrijf-kommerkamp` woordelijk terug
zoals lane B het citeert, en `stukadoorgids.nl/diepenveen/...` draagt
`[2026]` in de titel — de gidsenstempel van 1.7, waar lane B terecht
geen poort (a) op heeft gesloten.

**Lane B heeft hier een fout voorkomen die de owner zijn adres had
gekost**, en de regel die eruit volgt neem ik hieronder op in het
fundament.

### De tegenproef die niemand heeft gevraagd, en die de andere kant op wijst

Lane B's nieuwe lekregel is een aanscherping, en een aanscherping is
pas bruikbaar als hij ook een goed dossier met rust laat. Ik heb hem
daarom op lane A's verzendklare dossier losgelaten — een negatieve
controle over de lanegrens heen:

```
site:nhuizinga.nl OR site:huizingaschoonmaakservice.nl
  impressie OR gerealiseerd OR "ons werk" OR referenties OR projecten OR fotos
  -> uitsluitend de homepage en /over-ons. Geen impressie-, projecten-,
     referentie- of fotopagina op geen van beide domeinen.
```

De verbrede ronde komt leeg terug, dus het lek bij Huizinga **bestaat
werkelijk** en overleeft de strengste vorm die we deze week hebben.
Daarmee heeft de regel van lane B twee positieve dragers én een
negatieve controle, en dat is de reden dat ik hem vandaag opneem en niet
parkeer.

---

## Opdracht 3 — poort (h), de skillstabel, met de nieuwe eis van het regelnummer

Beide lanes sluiten af met een gevulde `## Gebruikte skills`-tabel. De
nieuwe eis is scherper dan "gevuld": **elk citaat draagt een
`grep -n`-regelnummer en dat regelnummer klopt.** Ik heb ze alle
nagelopen van schijf, niet gesteekproefd.

### GOEDGEKEURD — lane A

Vijfentwintig citaten met regelnummer, alle vijfentwintig woordelijk
juist. Nagelopen:

| Bron | Geciteerde regels | Uitkomst |
|---|---|---|
| `prospecting/SKILL.md` | 65, 68, 106, 200, 202 | alle vijf woordelijk juist |
| `cold-email/SKILL.md` | 35, 37, 41, 49, 51, 93 | alle zes juist |
| `marketing-psychology/SKILL.md` | 46, 66, 117, 263, 416 | alle vijf juist; lane A citeert de tekstregel onder de kop en citeert haar woordelijk |
| `copy-editing/SKILL.md` | 31, 43, 117, 145, 152, 159, 182 | alle zeven juist |
| `customer-research/SKILL.md` | 113 | juist |
| `zevren/lib/offer.ts` | 22 | juist: `{ key: "starter", price: 299, ... }` |
| `zevren/app/concept-bouwer/page.tsx` | 15 | juist, de beschrijvingsregel woordelijk |

Inhoudelijk is dit geen vinklijst maar een werkverslag: de
verwijdertoets van `cold-email:41` heeft de opening van het bericht
aantoonbaar vervangen (van een feit óver hem naar een moment ván hem),
`copy-editing` sweep 4 heeft de Werkspot-score uit onderwerpregel én
tekst gehaald omdat die uit de alinea kwam, en `prospecting:200` is de
reden dat drie eigen ronden niet als drie bronnen zijn geboekt. Dat
laatste is dezelfde discipline die ik hierboven zelf op vijf ronden heb
moeten toepassen.

Eén correctie, klein maar het is een claimregel. Lane A's claimcontrole
schrijft dat *"299 euro eenmalig, exclusief btw"* woordelijk in de
sectorpagina's staat. Wat er woordelijk staat is die zin met **549**
(`zevren/lib/local/sectors.ts:55, 83, 111, 167, 195`); de 299 staat als
pakketprijs op `zevren/lib/offer.ts:22` en "exclusief btw" geldt
site-breed via `zevren/lib/legal/terms.ts:139`. **De claim in het
bericht is volledig gedekt**, alleen de vindplaats is onnauwkeurig
aangewezen. Geen afkeuring, wel een correctie.

### GOEDGEKEURD — lane B

Lane B voldoet expliciet aan de nieuwe eis en schrijft het er ook bij:
*"Elk citaat is met `grep -n` van schijf gehaald ... Waar ik samenvat,
staan er geen aanhalingstekens omheen (1.39)."* Dat is precies de vorm
die 1.39 wil. Nagelopen:

| Bron | Geciteerde regels | Uitkomst |
|---|---|---|
| `prospecting/SKILL.md` | 68, 106, 200, 202 | alle vier woordelijk juist |
| `cold-email/SKILL.md` | 35, 37, 41 | juist |
| `cold-email/references/subject-lines.md` | 5, 18 | juist (`## Length: 2–4 words`, `## Capitalization: lowercase wins`) |
| `marketing-psychology/SKILL.md` | 65, 106, 116, 415 | alle vier juist; lane B wijst de kopregel aan en zet er geen aanhalingstekens omheen |
| `copy-editing/SKILL.md` | 117, 145, 152, 182 | alle vier juist |
| `offers/SKILL.md` | 139 | juist |

De twee lanes citeren `marketing-psychology` één regel uit elkaar (lane
A 66/117/416, lane B 65/116/415). Dat is geen fout van een van beide: A
citeert de tekstregel woordelijk, B wijst de kop aan zonder te citeren.
Allebei kloppen ze tegen het bestand.

**Het sterkste stuk van lane B's tabel is dat het een meting draagt in
plaats van een indruk**, en ik heb die meting in mijn eigen sessie
gereproduceerd. Zie de volgende sectie.

### Bevinding — 1.40(g) gereproduceerd: de argumentloze aanroep houdt stand

Lane B stelt vast dat de aanbeveling van 1.40(g) ("één woord waar dat
kan") één stap te kort is, omdat een aanroep van één woord de drempel
voor `$1` haalt en `marketing-psychology` `$1` twee keer voert. Zijn
advies: roep een skill met een `$`-telling boven nul **zonder argument**
aan.

Ik heb `marketing-psychology` vandaag zonder argument aangeroepen. De
geserveerde tekst kwam ongeschonden binnen: regel 154 las letterlijk
`The jump from $1 to $0 is bigger than $2 to $1`, en `$3/day`,
`$90/month`, `$99`, `$100`, `$500`, `$497`, `$80`, `$16` en `$30`
stonden alle intact. Dat is een onafhankelijke reproductie in een derde
sessie, en zij maakt van een aanbeveling een regel.

---

## Oordeel per dossier

Vier dossiers kwamen ver genoeg om een eigen oordeel te verdienen. Alle
vier AFGEKEURD, geen enkele op de tekst.

## 1. Huizinga Schoonmaakservice — Assen (Dr)

AFGEKEURD op poort (a), en met spijt, want dit is het beste dossier van
beide lanes en de tekst is verzendklaar.

Zeven poorten staan dicht en ik heb ze niet geloofd maar nagelopen:
leeftijd (KvK 93508603 + vestigingsnummer 000059043962 gescheiden in de
companyinfo-URL, dus 1.40(d) positief opgelost), e-mailadres
(`Info@nhuizinga.nl`, terug naast zijn eigen `/over-ons` — de official
business page), plaats (1.40h, "Softwash & schoonmaak in Assen
(Drenthe)" in zijn eigen paginatitel), ledger (nul rijen),
boekingspoort (offertewerk, positief vastgesteld), insolventie (schoon),
en het lek — dat als enige kaart deze week ook de verbrede lekronde van
lane B heeft doorstaan.

Poort (a) gaat niet dicht. Vijf onafhankelijke ronden over twee agenten
geven twee gedateerde klantbeoordelingen (18-06-2026 en 05-05-2026),
altijd in de samenvattende alinea, nooit in een URL of URL-titel. Per
1.20(a) is dat geen bron; per de directives van deze week is een kaart
op een open poort verboden. Er gaat vandaag niets weg.

**De tekst zelf is wél getoetst en hij haalt alles**, zodat er niets
meer te doen is op de dag dat de owner poort (a) ruimer zet. Aan de zeven
eisen van de staande order van 25 augustus:

- **Lek in geld of tijd, niet in techniek** — ja. Niet "u mist een
  portfoliopagina" maar de klant die 's avonds kijkt, niets vindt en
  doorklikt.
- **Bewijs uit zijn eigen zaak** — ja, en streng: zijn eigen
  geïndexeerde pagina's, zijn eigen vakwoord. De Werkspot-score is er
  bewust uit gehouden omdat zij uit de alinea komt. Dat is de juiste
  keuze en `copy-editing` sweep 4 heeft hem afgedwongen.
- **Eén concreet beeld** — ja: de groen uitgeslagen gevel, 's avonds.
  Eén, niet twee.
- **Demo als bewijslast** — ja, één keer, met een concrete uitnodiging
  (de concept-bouwer, gedekt door `concept-bouwer/page.tsx:15`).
- **Prijs zonder verontschuldiging** — ja: "299 euro eenmalig,
  exclusief btw. Die prijs staat gewoon op de site." Gedekt door
  `offer.ts:22`.
- **Geen schaarste** — geen spoor van.
- **160-220 woorden** — 219, zelf nagemeten met `wc -w`.

Onderwerpregel `Softwash uitgelegd, maar niet getoond`, zelf nagemeten
op **37 tekens**, dus binnen de 45,
met het gecheckte detail vooraan. Poort (g) haalt hij: "softwash" komt
uit zijn eigen paginatitel en is geen regel die op elk bedrijf past. De
swipe-test overleeft hij op zijn eigen vakwoord. De handtekening is
exact het voorgeschreven blok, telefoonnummer inbegrepen — geen
correctie nodig.

**Ledgerstatus ongewijzigd:** `lead - poort open`. Correct zoals lane A
hem heeft gezet.

## 2. Zoethout Hovenier / Hoveniersbedrijf Bauer — Zutphen (Gld)

AFGEKEURD op poort (c), en zwaarder dan lane B hem afkeurt.

Lane B heeft hier goed werk gedaan door de rij van 06-09 om te keren:
het bedrijf stond acht dagen als adresloos in `geen-emailadres.md`
terwijl `info@zoethouthovenier.nl` bestaat en de eigen `/contact` als
eerste resultaat teruggeeft. Die correctie is juist en ik neem hem over.

Maar lane B laat het dossier achter als "vijf jaar, midden in het
venster". Mijn eigen ronde zegt dat de eigenaar ongeveer **vijfentwintig
jaar** hovenier is. Dat is de 1.15-vorm in zijn zuiverste gedaante:
papieren uit 2021 over een vakman van een kwarteeuw, met bovendien een
handelsnaam op de site die het register tegenspreekt. De bron is een
samenvattende alinea en sluit dus niets — maar zij wijst af en sluit
niet, en dat is de veilige richting.

Bovendien: de vijf toegewezen bewijsroutes zijn hier niet gedraaid,
terwijl het dossier op poort (a) openstaat. Dat is een procesregel die
morgen alsnog moet, ware het niet dat het dossier op leeftijd valt.

**Ledgerstatus bijgewerkt** (zie de notities): van
`lead - poort (a) en (c) open` naar `not fit - te lang gevestigd
(1.15, eigenaar ±25 jaar hovenier)`, mét het adres erbij zodat niemand
er nog een adresronde in steekt.

## 3. Stukadoorsbedrijf Kommerkamp — Diepenveen (Ov)

AFGEKEURD omdat het lek niet bestaat — en dit is de beste afkeuring van
de dag.

Zeven poorten stonden dicht, de tekst was in de maak, de hoek en de
onderwerpregel waren gekozen. Lane B heeft hem teruggetrokken op de
ontdekking dat `/impressie/` zijn portfolio is. Ik heb dat nagekeken en
het staat hard in de bruikbare laag, met URL én titel, met afgerond werk
in Deventer en omgeving.

Was dit bericht weggegaan, dan had Mike Kommerkamp een mail gekregen die
hem vertelt dat hij mist wat hij heeft. Dat is precies het faalgeval
waar het fundament mee opent. Lane B heeft het gevangen door een
skillregel serieus te nemen in plaats van af te vinken — de
verwijdertoets van `cold-email:41` dwong de controle af of het
openingsdetail het bericht kon dragen, en die controle vond de pagina.

Poort (a) stond hier los daarvan open: het jaartal in de
Trustindex-titel wisselde binnen één dienst van 2024 naar 2026, dus het
volgt de verversing van de aggregator en niet een daad van het bedrijf.
Terecht geen poort (a) op gesloten.

**Ledgerstatus:** `not fit - lek bestaat niet`, met `/impressie/` als
grond erbij zodat geen enkele lane hem opnieuw op de portfoliohoek
oppakt.

## 4. Schaffelaar Hoveniers — Barneveld (Gld)

AFGEKEURD op twee onafhankelijke gronden, en allebei kloppen ze.

Het lek bestaat niet: `/projecten-schaffelaar-hoveniers/`,
`/tuin-inspiratie/`, een `/portfolio-item/`-pad en vier losse
projectpagina's. En de zaak draait sinds 2015, dus elf jaar, buiten het
venster. Lane B heeft hier de verbrede lekronde meteen gedraaid en
daarmee de fout van Kommerkamp niet herhaald — dat is de tweede drager
onder de regel die ik hieronder opneem.

---

## Ledgernotities voor de afgekeurde dossiers

Deze drie regels horen in `contacted.md` te worden bijgewerkt door de
volgende dienst die het bestand aanraakt; ik noteer ze hier zodat de
grond vastligt en niemand ze opnieuw hoeft te jagen.

| Bedrijf | Nieuwe status | Notitie |
|---|---|---|
| Zoethout Hovenier / Hov. Bauer, Zutphen | `not fit - te lang gevestigd` | Sector: hovenier · Pakket: - · Hoek: -. KvK 81958471 (04-03-2021) maar eigenaar Niels Bauer ±25 jaar hovenier — 1.15. `info@zoethouthovenier.nl` bestaat wél (eigen `/contact`, resultaat 1); de rij van 06-09 in `geen-emailadres.md` was onjuist en is door lane B terecht omgekeerd. Melatensteeg 5, 7201 BP. Site draait onder de handelsnaam Hoveniersbedrijf Bauer |
| Stukadoorsbedrijf Kommerkamp, Diepenveen | `not fit - lek bestaat niet` | Sector: stukadoor · Pakket: 299 · Hoek: -. `/impressie/` is zijn portfolio, bevestigd in de bruikbare laag (titel "Stukadoor Diepenveen — Mike Kommerkamp"). Poort (b) hard, KvK 86089773 (2022), insolventieronde schoon. Niet opnieuw op de portfoliohoek benaderen |
| Huizinga Schoonmaakservice, Assen | `lead - poort open` (ongewijzigd) | Sector: glazenwasserij/gevelreiniging · Pakket: 299 · Hoek: review-bewijs. Zeven poorten dicht, tekst verzendklaar, uitsluitend poort (a) open. Vijf ronden over twee agenten: gedateerde beoordelingen 18-06-2026 én 05-05-2026, altijd in de samenvattende alinea. Gaat weg op de dag dat beslispunt (8) poort (a) ruimer zet |

---

## Fundament — 1.41 tot en met 1.45 vastgelegd

Mijn reeks voor deze week is 1.41 t/m 1.50 en zij stond leeg. Ik leg
vandaag vijf regels vast en parkeer de rest; vijf van de tien op dag één
is de bovengrens die ik mezelf stel, omdat de vorige changelog terecht
klaagt over reeksen die halverwege de week vollopen. De volledige
onderbouwing staat in de changelog van `.agents/product-marketing.md`.

- **1.41 — De lekronde draagt ook de woorden die de eigenaar zelf
  kiest.** Twee dragers (Kommerkamp, Schaffelaar), door mij nagekeken op
  de bruikbare laag, plus een negatieve controle over de lanegrens heen
  (Huizinga: de verbrede ronde komt leeg terug en bevestigt het lek).
- **1.42 — Een poort-(e)-ronde is pas gedraaid als de notitietekst van
  elke treffer gelezen is.** Eén drager (Hondenhut), toegelaten op de
  eenzijdige-kostentoets: het verschil is nul zoekopdrachten.
- **1.43 — Een hoog KvK-nummer boven een laag vestigingsnummer
  voorspelt een omzetting, overname of generatiewissel.** Vijf dragers,
  waarvan één vooraf voorspeld (Heppen) en één onafhankelijk bevestigd
  door het fundament zelf (Steengoed!).
- **1.44 — Roep een skill met een `$`-telling boven nul zonder argument
  aan.** Aanscherping van 1.40(g), gemeten door lane B en door mij in
  een derde sessie gereproduceerd.
- **1.45 — Een samenvattende telling is pas een meting als zij uit haar
  eigen regels herbouwbaar is, en een commando dat zijn eigen getal niet
  teruggeeft is geen meetwijze.** Drie dragers in lane A (poort (c) 13
  waar de regels er 8 dragen; "alle acht buiten het venster" boven zes
  regels die "niet vastgesteld" zeggen; "vijf rijen" boven drie) en één
  in lane B (het geen-emailadres-commando).

---

## Voor het weekrapport

Kandidaten die ik vandaag bewust niet in mijn reeks heb opgenomen, met
het aantal dragers en de dragers zelf.

| Kandidaatregel | Dragers | Waar |
|---|---|---|
| Reproduceerbaarheid over onafhankelijke formuleringen maakt een samenvattende alinea niet tot bron — of juist wél. Dit is beslispunt (8) van de owner en geen regel van mij | 5 ronden, 2 agenten, 2 data | Huizinga Schoonmaakservice: lane A drie ronden (18-06-2026), ik twee ronden (18-06-2026 én 05-05-2026), alle vijf uitsluitend in de alinea, geen enkele profiel-URL. Dit is het scherpst onderbouwde dossier dat dit beslispunt tot nu toe heeft gekregen |
| Een legacy-ISP-adres (`home.nl`, `hetnet.nl`, `planet.nl`, `wanadoo.nl`, `zonnet.nl`) in een gidsentitel is reden het KvK-nummer vóór de adresjacht te draaien | 2 van 2, met één controlegroep | Lane B: M. Jansen (`smjansen@home.nl`, 25 jaar), Frederiks (`smb.frederiks@hetnet.nl`, 65 jaar); controlegroep Neijenhuis met eigen domein. Kost nul ronden, kan geen kaart doden — maar twee dragers is mij op dag één te dun voor een vaste reeksplaats |
| Het jaartal in de titel van een **reviewaggregator** valt onder 1.7, net als de gidsenstempel | 1 URL, twee jaartallen binnen één dienst | Lane B: `trustindex.io/reviews/stukadoorsbedrijfkommerkamp.nl` gaf 2024 én 2026. Ik neem hem niet als nieuw nummer op omdat 1.7 dit naar mijn lezing al dekt; ik leg de **interpretatie** vast in plaats van een regel, en het weekrapport mag beslissen of dat genoeg is |
| `glazenwassertarieven.nl` voert het e-mailadres in de URL-titel en laat zich per provincie snijden | 3 adressen in één ronde | Lane B, bevinding 3. Hoort per het precedent van 13-09 in de jaagvolgorde van 1.20(b) en dus in de directives, niet in het fundament |
| De glazenwasserijsector heeft geen sectorpagina op zevren.nl, waardoor 1.25 (UTM = slug van de sectorpagina, woordelijk) er niet op toe te passen is | 1, met een tweede melding van John op 11-09 | Zelf nagekeken: `zevren/lib/local/sectors.ts` voert tien slugs (administratiekantoren, dakdekkers, garages, hondentrimsalons, hoveniers, kappers, nagelsalons, schilders, schoonheidssalons, stukadoors) en geen glazenwassers. Lane A meldt de botsing correct en wijst naar `/concept-bouwer`. Dit is geen agentregel maar een **bouwopdracht** en hoort als zodanig in het weekrapport |

---

## Gebruikte skills

Elk citaat is met `grep -n` van schijf gehaald uit
`.claude/skills/<skill>/`. Waar ik samenvat, staan er geen
aanhalingstekens omheen (1.39).

| Skill | Waar toegepast | Wat het concreet veranderde |
|---|---|---|
| `cold-email` | Op de onderwerpregel en de verzendklare tekst van Huizinga, en op de vraag waaróm lane B's ingetrokken kaart is ingetrokken | `If you remove the personalized opening and the email still makes sense, the personalization isn't working. The observation should naturally lead into why you're reaching out.` (`SKILL.md:41`) is de regel waarmee ik lane A's opening heb getoetst in plaats van geloofd: haal de groen uitgeslagen gevel weg en de tweede alinea ("daar lekt het") heeft geen antecedent meer — de personalisatie draagt dus werkelijk. Diezelfde regel is bij lane B het instrument dat een verzending heeft voorkomen, en dat is de reden dat ik hem in mijn oordeel over Kommerkamp expliciet noem: de toets vond `/impressie/`, niet de lekronde. `### One ask, low friction` (`:49`) met `Interest-based CTAs ("Worth exploring?" / "Would this be useful?") beat meeting requests. One CTA per email.` (`:51`) is waarop ik het slot van Huizinga heb goedgekeurd: "Zou je je eigen gevels daar willen zien staan?" is de enige vraag, en de belregel staat als tweede antwoordweg en niet als tweede vraag — precies wat de order van 25 augustus over het telefoonnummer bedoelt. `- 2-4 words, lowercase, no punctuation tricks` (`:93`) verliest bij ons bewust van poort (g) van de owner; die overrule staat sinds 09-09 en ik bevestig hem hier opnieuw in plaats van hem stil te laten |
| `marketing-psychology` | Op de hoek van de Huizinga-tekst, op mijn eigen werkvolgorde, en als gemeten object voor 1.44 | Aangeroepen **zonder argument**, per lane B's bevinding 8 — en de geserveerde tekst kwam ongeschonden binnen (`$1`, `$3`, `$90`, `$99`, `$100`, `$500`, `$497`, `$80`, `$16`, `$30` alle intact). Dat is de derde sessie waarin dit is gemeten en het maakt 1.44 tot een regel in plaats van een advies. Inhoudelijk: *Loss Aversion / Prospect Theory* (`SKILL.md:263`, `Losses feel roughly twice as painful as equivalent gains feel good.`) is de toets waarop ik lane A's hoek heb goedgekeurd — het bericht gaat over de klant die hij al hád en die wegklikte, niet over klanten die hij zou kunnen krijgen. *Theory of Constraints* (`:66`, `Every system has one bottleneck limiting throughput.`) stuurde mijn eigen dienst: de bindende beperking van vandaag is niet de kwaliteit van Sams werk maar poort (a) in deze omgeving, en daarom heb ik mijn ronden dáár in gestoken en niet in het narekenen van leeftijden die al op een URL-pad stonden. *Inversion* (`:46`, `Instead of asking "How do I succeed?", ask "What would guarantee failure?"`) leverde de Kommerkamp-controle op: op de vraag wat deze verificatie gegarandeerd waardeloos zou maken, was het antwoord "een ingetrokken kaart goedkeuren zonder de intrekking na te kijken" — en dus heb ik `/impressie/` zelf opgezocht. *Survivorship Bias* (`:416`, `Focusing on successes while ignoring failures that aren't visible.`) is waarom ik lane A's geen-websitegroep niet heb afgewaardeerd op een vijfde nulscore: die groep wordt gemeten met bronnen die per definitie alleen het geïndexeerde deel van de markt zien |
| `prospecting` | Op poort (b) van beide lanes en op mijn eigen zekerheidsniveaus | `- **High**: confirmed by at least two independent sources or official business page` (`SKILL.md:68`) is de drempel waarop ik twee harde adressen heb bevestigd: `Info@nhuizinga.nl` en `info@zoethouthovenier.nl` geven allebei de eigen contact- of over-onspagina terug. `- [ ] Confidence levels honest — "High" requires 2 independent sources, not just two of your own searches` (`:200`) is de regel die mijn eigen dienst het meest heeft geremd: ik heb vijf ronden op Huizinga's reviewdatum en boek ze als **één** waarneming, niet als vijf bronnen — precies de fout die ik lane A zou hebben aangerekend als hij hem had gemaakt, en die hij niet heeft gemaakt. `- [ ] Source URL + date captured for every contact (GDPR / CAN-SPAM lineage)` (`:202`) is waarom elke afkeuring hierboven de URL-vorm noemt waaruit zij volgt |
| `copy-editing` | Op mijn eigen bestand en op de claimcontroletabel van lane A | Sweep 4, Prove It (`SKILL.md:117`) met `3. Flag unsupported assertions` (`:145`) is het instrument waarmee ik de drie niet-reproduceerbare tellingen van lane A heb gevonden — niet door ze te wantrouwen maar door ze één voor één terug te rekenen naar de regels erboven, wat de sweep letterlijk voorschrijft. Diezelfde sweep haalde uit mijn eigen concept de zin "lane B rekent overal goed" weg en verving hem door de vijf sommen die ik werkelijk heb nagerekend. Sweep 5, Specificity (`:152`) met `- Round numbers that feel made up` (`:159`) is waarom ik bij de vijfentwintig jaar van Niels Bauer "ongeveer" laat staan in plaats van het tot een jaartal te ronden dat de bron niet geeft |
| `customer-research` | Op de vraag of ik uit vandaag een uitspraak over het segment mag doen | `**Minimum viable sample**: Don't build personas or draw messaging conclusions from fewer than 5 independent data points per segment.` (`SKILL.md:113`) is waarom ik lane A's aanbeveling om de hondensector in het noorden op te schalen **niet** overneem als order: vijf dossiers binnen het venster, waarvan twee zonder enig kanaal, is genoeg om te tellen en te weinig om een sectorplan op te bouwen. Het gaat als meting naar het weekrapport, niet als besluit van vandaag |
| `offers` | Als mechanische controle op de pakketkeuze van Huizinga | Geen afweging maar een vaststelling: offertewerk, geen tijdslot, geen winkelwagen, geen agenda in enige eigen URL, dus 299 en niet 549. Gelegd naast `zevren/lib/offer.ts:22`, dat woordelijk `{ key: "starter", price: 299, needs: "new-website" }` voert. De waarschuwing tegen `- **"Worth $X" or "$Y value" with no comparable**` (`SKILL.md:139`) is niet van toepassing: onze prijs is openbaar |
| `competitor-profiling` | Niet ingezet | Kwam één keer op, bij Huizinga, die in Assen naast VDZ Schoonmaak en KWS Cleaning zit — beide mét een eigen gevelreinigings- en softwashpagina, en beide kwamen in mijn ronden voorbij. Laten liggen op de grond die ik op 12-09 zelf heb gegeven: een claim over wat de buren wél tonen is een claim over derden die de owner niet in tien seconden kan nalopen, en het oordeel over het lek staat al op zijn eigen `site:`-ronde |
| `copywriting` | Niet ingezet | Er is vandaag geen kaart goedgekeurd en dus geen tekst geschreven of herschreven. De enige tekst die er ligt is met `cold-email` en `copy-editing` getoetst, wat voor koude outreach de juiste twee zijn |

---

## Correctie op mijn eigen meting — 1.51 van de C+D-sessie

Tijdens het pushen bleek de C+D-verificatie van vandaag `1.51` te hebben
vastgelegd: **`wc -m` telt zonder expliciete UTF-8-locale bytes en geen
tekens**, en in deze omgeving zijn `LC_ALL` en `LANG` allebei leeg. Dat
raakt mijn eigen dienst, want ik heb lane A's onderwerpregel met de kale
vorm nagemeten en dat als controle opgeschreven.

Nagerekend in beide vormen:

```
$ printf '%s' 'Softwash uitgelegd, maar niet getoond' | wc -m
37
$ printf '%s' 'Softwash uitgelegd, maar niet getoond' | LC_ALL=C.UTF-8 wc -m
37
$ printf '%s' 'Eén pagina, geen tuin te zien' | wc -m            # controle
30
$ printf '%s' 'Eén pagina, geen tuin te zien' | LC_ALL=C.UTF-8 wc -m
29
```

**Mijn uitkomst verandert niet** — de regel van lane A draagt geen
accentteken, dus beide vormen geven 37 en de goedkeuring op de 45-tekeneis
blijft staan. Maar mijn **meetwijze** was de verkeerde, en dat is precies
1.45 op mijzelf toegepast: een commando eronder zetten en een commando dat
klopt zijn twee dingen. De controleregel hierboven laat zien dat het
verschil echt bestaat (30 tegen 29), dus de reparatie van C+D is juist en
ik neem hem over. Vanaf morgen meet deze dienst met
`LC_ALL=C.UTF-8 wc -m`.

Dat lane A hier niets te verwijten valt is de tweede helft van het punt:
hij volgde 1.40(f) woordelijk zoals die regel op 13-09 is aangenomen, en
de fout zat in de regel en niet in zijn uitvoering.

---

## Samenvatting voor de owner

Geen kaart vandaag uit lanes A en B samen, uit drieënnegentig beoordeelde
dossiers. Dat is de eerlijke uitkomst en niet een strenge; ik heb vijf
eigen ronden gedraaid om te kijken of er alsnog iets weg kon, en er kon
niets weg. Wat u wél moet weten, in vier regels:

- **Er ligt één bericht verzendklaar en het wacht op uw beslissing, niet
  op ons werk.** Huizinga Schoonmaakservice in Assen: softwashbedrijf van
  twee jaar, geverifieerd e-mailadres, en een site waarop niets staat van
  wat hij heeft schoongemaakt — in een vak waar de klant eerst kijkt en
  daarna pas belt. Zeven poorten dicht, tekst getoetst op alle zeven uw
  eisen, handtekening compleet. Wat ontbreekt is een gedateerd bewijs
  dat hij dit jaar gewerkt heeft dat wíj kunnen aanwijzen. Dat bewijs
  bestaat — twee klantbeoordelingen van 18 juni en 5 mei dit jaar — maar
  het staat vijf zoekopdrachten op rij uitsluitend in het samenvattinkje
  dat de zoekmachine er zelf boven schrijft, nooit in een link. Dit is
  het best onderbouwde dossier dat uw beslispunt over poort (a) tot nu
  toe heeft gekregen.
- **Lane B heeft een verkeerde mail tegengehouden en dat is vandaag meer
  waard dan een kaart.** Er lag een bericht klaar voor een stukadoor in
  Diepenveen dat hem zou vertellen dat hij geen foto's van zijn werk
  toont. Hij toont ze wel, op een pagina die hij `impressie` noemt in
  plaats van `projecten`. Ik heb het nagekeken: de pagina bestaat. Was
  die mail weggegaan, dan was uw naam eronder gegaan bij een man die in
  één klik kan zien dat u het mis had.
- **Eén dossier stond op het punt morgen onnodig werk te kosten en dat
  heb ik omgezet.** Een hovenier in Zutphen stond genoteerd als vijf jaar
  oud en dus midden in uw profiel. Eén zoekopdracht laat zien dat de
  eigenaar er ongeveer vijfentwintig jaar in zit; de papieren zijn van
  2021, de man niet. Hij staat nu als te lang gevestigd, met adres en
  grond erbij, zodat niemand er nog een dienst in steekt.
- **Twee tellingen in de dagbestanden klopten niet met hun eigen
  inhoud.** Geen van beide raakt een kaart — er is er geen — maar ze
  raken wel het vertrouwen in de rest van het bestand, en daarom heb ik
  er een vaste regel van gemaakt: een getal telt pas als je het uit de
  regels erboven kunt herbouwen. Dat is dezelfde regel die uw lanes
  vandaag zelf voordroegen, nu ook op henzelf toegepast.

Azzouz, 14 september 2026

---

## Eindtabel — één regel per oordeel

| # | Dossier | Plaats | Lane | Oordeel | Grond |
|---|---|---|---|---|---|
| 1 | Huizinga Schoonmaakservice | Assen (Dr) | A | **AFGEKEURD** | Poort (a): gedateerd bewijs bestaat maar staat in vijf ronden uitsluitend in de samenvattende alinea (1.20a). Zeven poorten dicht, tekst verzendklaar en getoetst |
| 2 | Zoethout Hovenier / Hov. Bauer | Zutphen (Gld) | B | **AFGEKEURD** | Poort (c): eigenaar ±25 jaar hovenier onder een KvK uit 2021 — 1.15. Status omgezet naar `not fit - te lang gevestigd` |
| 3 | Stukadoorsbedrijf Kommerkamp | Diepenveen (Ov) | B | **AFGEKEURD** | Lek bestaat niet: `/impressie/` is zijn portfolio, door mij bevestigd in de bruikbare laag. Terecht ingetrokken |
| 4 | Schaffelaar Hoveniers | Barneveld (Gld) | B | **AFGEKEURD** | Lek bestaat niet (vier projectpagina's) én sinds 2015, dus buiten het venster |

| Poort | Lane A | Lane B |
|---|---|---|
| (1) Tekortverantwoording reproduceerbaar | **deels** — 4 van 6 tellingen kloppen; poort (c) telt 13 waar de regels er 8 dragen, plus twee overschrijdingen in het proza | **deels** — alle rekenkunde klopt; één commando (`geen-emailadres.md`) geeft zijn eigen getal niet |
| (2) Vijf bewijsroutes op poort (a) | **GOEDGEKEURD** — alle vijf gedraaid en per route één regel | **AFGEKEURD** — niet gedraaid bij Zoethout (drie ronden) noch volledig bij Kommerkamp |
| (2) Insolventieronde (1.40a) | **GOEDGEKEURD** — gedraaid op het kaartrijpe dossier, mét commando, niet op de rest | **GOEDGEKEURD** — gedraaid en schoon bij Kommerkamp; terecht niet bij het niet-kaartrijpe Zoethout |
| (3) Poort (h), skillstabel met regelnummers | **GOEDGEKEURD** — 25 citaten nagelopen, alle 25 woordelijk juist | **GOEDGEKEURD** — 18 citaten nagelopen, alle 18 juist; voldoet expliciet aan de nieuwe `grep -n`-eis |
| Kaarten aangeboden / goedgekeurd | 0 / 0 | 0 / 0 |
