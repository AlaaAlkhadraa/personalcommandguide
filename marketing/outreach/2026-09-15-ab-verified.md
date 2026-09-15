# Verificatie 15 september 2026 — lanes A en B

Azzouz, dinsdagdienst. Ik verifieer uitsluitend `2026-09-15-a.md` (Groningen,
Friesland, Drenthe) en `2026-09-15-b.md` (Overijssel, Gelderland, Flevoland).
Lanes C en D liggen bij de tweede sessie in `-cd-verified.md`; die bestanden
heb ik niet aangeraakt.

## De telling, zelf gedaan, met het commando

```
$ grep -cE '^## [0-9]+\. ' marketing/outreach/2026-09-15-a.md marketing/outreach/2026-09-15-b.md
  -> 2026-09-15-a.md:0
  -> 2026-09-15-b.md:0
```

**Nul genummerde kaarten in lane A, nul in lane B.** De opzichter telt goed.
Er is vandaag dus niets te keuren op de kaartpoorten (a) tot en met (i) — er
is geen onderwerpregel, geen bericht en geen handtekening geschreven. Beide
lanes melden het tekort in de vaste vorm en doen dat eerlijk.

Daarmee valt mijn dienst op de drie opdrachten van vandaag: zijn de tellingen
reproduceerbaar, zijn de bewijsroutes werkelijk gedraaid, en klopt poort (h).
Ik heb bij alle drie mijn eigen ronden gedraaid in plaats van Sams werk over
te schrijven, en dat heeft op twee plaatsen iets veranderd.

---

## AFGEKEURD — lane A, de tekorttabel: twee tellingen, en zij spreken elkaar tegen

Dit is de zwaarste bevinding van de dienst en zij staat los van de nul kaarten.

`2026-09-15-a.md` draagt **twee** tekorttabellen over dezelfde 49 dossiers.
De eerste staat op regel 247-255, de tweede op regel 273-280. Ze sluiten
allebei op 49 en ze geven allebei andere gronden:

| Grond | Tabel 1 (r. 247) | Tabel 2 (r. 273) |
|---|---|---|
| Poort (e) | 15 | 15 |
| Poort (f) te lang gevestigd | **10** | **14** |
| Buiten profiel | **5** | **6** |
| Lek bestaat niet | 5 | 5 |
| Poort (b) geen adres | — | **2** |
| Lead | **12** | **7** |
| Geen-websitegroep, bestemming | **2** | — |
| Totaal | 49 | 49 |

**Tabel 1 is reproduceerbaar. Tabel 2 is het niet.** Ik heb ze allebei
nagerekend:

```
$ grep -cE "^\| [0-9]+ \|" 2026-09-15-a.md                              -> 49
$ grep -E "^\| [0-9]+ \|" 2026-09-15-a.md | grep -c "Poort (e)"         -> 15
$ grep -E "^\| [0-9]+ \|" 2026-09-15-a.md | grep -ci "te lang gevestigd" -> 11
$ grep -nE "^\| [0-9]+ \|" 2026-09-15-a.md | grep -i "te lang gevestigd" \
    | awk -F'|' '{print $2}'   -> rijen 1 3 5 7 12 15 18 22 25 29 44
```

Elf rijen dragen de woorden *te lang gevestigd*; twee daarvan (#1 Maanwater,
#25 Briljant) sloten vandaag op poort (e) en tellen daar. 11 − 2 = 9, plus #39
Gents Barbershop = **10**. Dat is precies wat tabel 1 zegt en Sam rekent het er
zelf onder voor. **De 14 van tabel 2 is onbereikbaar**: er zijn maar elf rijen
die de grond dragen. Ook de 7 leads van tabel 2 zijn fout — ik heb ze geteld:

```
$ grep -E "^\| [0-9]+ \|" 2026-09-15-a.md | grep -c "→ lead"  -> 12
   (#9 #13 #19 #30 #32 #36 #37 #38 #45 #47 #48 #49)
```

Twaalf, zoals tabel 1 zegt. De vier rijen *open lead gesloten* (#3 #7 #22 #29)
zijn afgemaakt en geen openstaande lead; #46 matcht alleen op het woord
"leadgennetwerk".

Daar komt een vormfout bij. Regel 273 luidt letterlijk `---|---|`: de
sectiestreep `---` is vastgelopen tegen een tabelscheiding. Tabel 2 heeft
daardoor **geen kopregel** en rendert kapot. Zij is een restant van een eerdere
versie dat is blijven staan.

**Waarom dit hard telt.** Dit is dezelfde fout die de order van deze week als
vormregel beschrijft, maar een slag erger: niet een telling zonder commando,
maar twee tellingen die elkaar tegenspreken in één bestand. Wie het bestand van
onder naar boven leest — en de opzichter leest van onder naar boven — krijgt de
verkeerde. Tabel 1 blijft staan, **tabel 2 moet weg**, en de correctie staat als
1.46 in mijn fundamentreeks hieronder.

---

## GOEDGEKEURD — lane A, de overige tellingen

Alles wat niet in tabel 2 staat, klopt. Nagerekend:

```
$ grep -cE "^\| [0-9]+ \|" 2026-09-15-a.md              -> 49  (claim: 49)
$ grep -c "2026-09-15 lane A" contacted.md              -> 34  (49 − 15 op poort (e) = 34)
```

De 34 ledgerrijen zijn exact 49 min de vijftien poort-(e)-dossiers die al een
rij hadden. De bulkronden van poort (e) staan met hun commando erboven en met
de notitietekst gelezen, niet alleen geteld — dat is de correctie van 14-09 en
zij is nagekomen. De drie treffers die op een ánder bedrijf stonden
(Schoonmaakbedrijf Briljant te Raalte, Briljant Stukadoors te Sloten,
BrainWash/Provalliance te Doetinchem) zijn als zodanig herkend en niet als
sluiting geboekt. Dat is precies goed werk.

De `wc -m`-meting van 1.51 is onafhankelijk gereproduceerd in plaats van
overgenomen. Ik heb haar niet nog een derde keer gedraaid; twee onafhankelijke
metingen op twee dagen zijn genoeg.

---

## AFGEKEURD — lane A, poort (a) en de vijf routes: de vrijstelling klopt formeel, maar zij dekt de verkeerde rij

Sam schrijft: *"Geen enkel dossier is vandaag kaartrijp geworden en geen enkel
dossier blijft op poort (a) open staan"*, en concludeert dat de vijf toegewezen
bewijsroutes formeel niet verschuldigd zijn. Op de letter klopt dat: wat de
leeftijdspoort haalde viel op (b) of (f), en de rest is gesloten in plaats van
geparkeerd. De insolventieronde is toch op de twee verst gekomen dossiers
gedraaid, met het commando erbij. Dat siert hem.

**Maar er staat één dossier open dat de vrijstelling niet had mogen krijgen.**
Rij #9, Barendsma Schoonmaakbedrijf te Leeuwarden, is het enige lane-A-dossier
met een **geverifieerd openbaar e-mailadres** (`schoonmaak@barendsma.nl`, in de
URL-titel van `kostenglazenwasser.nl`) dat vandaag als lead blijft staan. Dat
is per definitie de kandidaat die morgen als eerste een kaart wordt.

En de rij spreekt de tabel tegen. Rij #9 zegt *"Leeftijd in **één** ronde niet
vastgesteld"*; de tekorttabel boekt hem onder *"Lead — leeftijd of webstatus in
**twee** ronden niet vastgesteld"*. Eén van de twee is onjuist, en het is de
tabel: er is één ronde gedraaid.

### Ik heb de ontbrekende ronde zelf gedraaid, en zij sluit het dossier

```
$ Barendsma Schoonmaakbedrijf Leeuwarden KvK opgericht glazenwasserij
```

- `transfirm.nl/nl/organisatie/917806590000-barendsma-schoonmaakbedrijf-b.v.`
  → KvK **91780659**, een 91-reeks, dus 2023/24. Op het nummer alleen zou dit
  binnen het venster vallen.
- De eigen site `barendsma.nl` voert het bedrijf als **vierde generatie
  familiebedrijf**, opgericht door Jan Barendsma, met **1900/1903** als
  oprichtingsjaar.
- `alleglazenwassers.nl/business/barendsma-schoonmaakbedrijf-leeuwarden-aldlan-de-hemrik-000015062902/`
  → vestigingsnummer **000015062902**, een lage reeks die niet bij 2023 hoort.

**Honderdzesentwintig jaar. Te lang gevestigd, hard.** Het verse KvK-nummer is
een omzetting naar B.V., geen oprichting.

Dat is pijnlijk precies, want **Sam heeft de regel die dit dossier sluit vandaag
zélf voorgedragen**, twee secties hoger in zijn eigen bestand: *"een recent
KvK-nummer sluit poort (f) niet zolang de eigen site een ervaringsclaim van meer
dan zes jaar voert."* Hij vuurde die regel op BKSC en op Borstel Cleaning en
paste hem niet toe op zijn eigen openstaande lead met het enige werkende
e-mailadres van de lane. Barendsma is de derde drager van zijn eigen regel.

**Gevolg voor de telling:** lane A staat op **11 leads en 11 op poort (f)**, niet
op 12 en 10. Ik heb de ledgernotitie hieronder bijgewerkt.

**Antwoord op de vraag of er met een eigen ronde alsnog een verzendklare kaart
uit lane A kan komen: nee.** Het beste openstaande dossier is met één ronde
gesloten in plaats van geopend. De overige elf leads staan op leeftijd of
webstatus, niet op een schrijfbaar lek.

---

## GOEDGEKEURD — lane B, de telling van 98: de hoogste tot nu toe, en zij houdt stand

98 dossiers in één dienst verdient een eigen nameting, zoals de order zegt. Ik
heb hem gedaan en hij klopt tot op de rij.

```
$ grep -cE "^\| [0-9]+ \|" 2026-09-15-b.md                       -> 98
$ sed -n '194,240p' 2026-09-15-b.md | grep -cE "^\| [0-9]+ \|"   -> 42  (hovenier)
$ sed -n '241,281p' 2026-09-15-b.md | grep -cE "^\| [0-9]+ \|"   -> 36  (glazenwasserij)
$ sed -n '282,313p' 2026-09-15-b.md | grep -cE "^\| [0-9]+ \|"   -> 20  (schilder + stukadoor)
```

42 + 36 + 20 = 98, en de nummering loopt onafgebroken van 1 tot en met 98 —
geen hergebruikte nummers, geen gaten.

**En lane B doet iets wat lane A niet doet: hij zet per grond de rijnummers in
de tekorttabel.** Daardoor is de hele telling met één ronde machinaal te
controleren in plaats van op zijn woord te geloven. Ik heb de zeven
nummerreeksen uitgeschreven en tegen elkaar gelegd:

```
leeftijd (44)      13-34, 56, 66-70, 72-76, 88-98   -> 44 nummers
poort (b) (22)     3, 9-11, 40-48, 50-53, 77,78,81,82,84 -> 22
poort (e) (16)     4-8, 49, 57-65, 87              -> 16
niet afgerond (11) 12, 35-39, 54, 55, 83, 85, 86   -> 11
lek bestaat niet (2) 79, 80                        -> 2
poort (a)/(c) (2)  1, 2                            -> 2
1.43-tegenspraak (1) 71                            -> 1
                                                      ---
                                                       98
dubbel geboekt : GEEN
ontbrekend uit 1-98 : GEEN
```

**Een volmaakte partitie van 1 tot en met 98: elk dossier precies één keer, geen
overlap, geen gat.** Elk opgegeven aantal is gelijk aan het werkelijke aantal
nummers in zijn eigen reeks. Dit is de best controleerbare tekorttabel die deze
lanes tot nu toe hebben geleverd, en ik leg de vorm hieronder als 1.50 vast.

De drie afgeleide tellingen kloppen ook:

```
$ grep -c "2026-09-15 lane B" contacted.md                      -> 82  (98 − 16 = 82) ✓
$ grep -cE '^\|.*2026-09-15 lane B' bellijst.md                 ->  6  ✓
$ grep -cE '^\|.*\| B \| 15-09-2026 \|$' geen-emailadres.md     ->  8  ✓
```

Ledger 82, bellijst 6, geen-emailadres 8 — alle drie exact zoals gemeld. De
zestien poort-(e)-dossiers zijn niet gedupliceerd, en de omkering op Paradijs
Glazenwassersbedrijf (1.32) staat met oude status, oude grond en reden erbij.

Nog een aantekening die Sam siert: hij heeft het getal "13 ledger rows" uit zijn
eigen briefing **niet overgeschreven** maar nagerekend, kreeg er 364 uit, en legt
nu drie maten met hun commando neer in plaats van er één te kiezen. Dat is exact
de houding waarvoor de order over reproduceerbare tellingen is geschreven.

---

## GOEDGEKEURD — lane B, de vijf bewijsroutes en de insolventieronde

De order eist de vijf routes op elk dossier dat op poort (a) open blijft staan,
en 1.40(a) op elk kaartrijp dossier. Lane B heeft er twee die open staan (rij 1
Liever Buiten op poort (a), rij 2 LW Hoveniers) en draait de vijf routes op
allebei, **elk met de uitkomst erbij en niet als afvinklijst**:

| Route | Liever Buiten | LW Hoveniers |
|---|---|---|
| KvK-mutaties | genoteerd, geen datum | genoteerd, twee handelsnamen op één nummer |
| Vergunningen | genoteerd, nul | genoteerd — en **afgewezen op 1.7 + persoonsgegeven** |
| Inspecties | genoteerd, nul | genoteerd, nul |
| SBB binnen 12 mnd | genoteerd — **naamgenoot in Deurne herkend (1.53)** | genoteerd, nul |
| Vacature met datum | genoteerd, nul | genoteerd, nul |
| 1.40(a) insolventie | `site:drimble.nl/faillissementen 81650817` → schoon | drie nummers → alle schoon |

Twee dingen daarin zijn meer dan afvinkwerk. De SBB-treffer voor "Liever Buiten"
wees naar **Liever Buiten in Deurne**, een naamgenoot in Noord-Brabant; die is
herkend en niet geboekt. En de omgevingsvergunning bij LW Hoveniers stond op het
**woonadres** van de eigenaar: Sam noemt hem, wijst hem af als daad van een
particulier én als persoonsgegeven, en gebruikt hem niet — ook al had die
vergunning poort (a) kunnen dragen. Dat is precies de verleiding waar een agent
met nul kaarten voor bezwijkt, en hij is er niet voor bezweken. Dat weegt zwaar
voor mij.

De zes poort-(a)-ronden op Liever Buiten staan letterlijk uitgeschreven in
plaats van als "meerdere ronden gedraaid". De 1.38-decoder is op drie bekende
shortcodes geijkt (`DScsDOSgqwN` → 19-12-2025, `C-K-fcPo69M` → 02-08-2024,
`DbQ6VvOCtr5` → 26-07-2026) en werkt; de rem zit in de zoekindex, niet in het
gereedschap. Die diagnose is juist en zij is nuttig.

---

## GOEDGEKEURD — lane B, mijn eigen ronde op Liever Buiten: de conclusie houdt, en zij levert twee harde feiten op

De order vraagt of er met een eigen ronde alsnog een verzendklare kaart uit kan.
Ik heb drie ronden gedraaid op het beste dossier van de dag.

**Wat ik vond dat Sam niet had:**

1. `somonline.nl/jasper-dekker-is-liever-buiten-en-dat-gunt-hij-iedereen/` — een
   redactioneel portret van de eigenaar in het Sallands Ondernemers Magazine,
   rubriek Starter, door Michelle Wolfkamp. **Gepubliceerd 31 maart 2022.**
   Ruim vier jaar oud. Draagt bovendien geen datum in titel of URL. Poort (a)
   vraagt een gedateerd levensteken binnen twaalf maanden: **dit is het niet.**
2. **De oprichtingsdatum, hard: 28 januari 2021**, KvK 81650817, eenmanszaak,
   1 werkzame persoon. Sam had het nummer maar niet de datum.

Dat tweede feit is winst: het zet Liever Buiten op **vijf jaar en acht maanden**
en dus stevig binnen het profiel van grofweg één tot zes jaar. Poort (f) is
daarmee niet langer een schatting uit een nummerreeks maar een vastgestelde
datum. Poort (b) bevestigde ik opnieuw: `info@lieverbuitenhoveniers.nl` op de
eigen contactpagina.

**En toch: geen kaart.** In drie ronden kwam er geen enkel gedateerd spoor
binnen twaalf maanden in een titel of URL-pad. Wat er is, is een reviewregel in
een samenvattende alinea (door 1.20(a) verboden), een Instagramprofiel zonder
ophaalbare post-URL, en gidspagina's. **Sams oordeel staat: poort (a) blijft
open, het dossier gaat als `lead - poort open` het ledger in en er wordt geen
kaart geschreven met een controleopdracht voor de owner erbij.** Dat is de
juiste keuze en ik bevestig hem na eigen werk.

### Uit die ronde kwam wel een bevinding die ik vastleg

`hovenier.website/lemelerveld/` gaf mij in **twee ronden van dezelfde dienst
twee verschillende titels**:

```
ronde 1 -> "ᐅ Top 20 hoveniers Lemelerveld in ① gids [2025]!"
ronde 3 -> "ᐅ Top 15 hoveniers uit Lemelerveld (2026)"
```

Zelfde URL, ander jaartal, ander aantal. Een jaartal in een gidstitel is dus een
rollend stempel van de gids en zegt **niets** over het bedrijf eronder. Wie
"(2026)" in zo'n titel als gedateerd levensteken boekt, haalt poort (a) met het
jaartal van de gids. Dat is 1.48 hieronder.

En de drimble-URL van dit dossier bevestigt 1.40(d) over de lanegrens:
`drimble.nl/bedrijf/lemelerveld/47927879/` naast vestigingsnummer
**000047927879** en KvK **81650817**. Het getal in het pad is het
vestigingsnummer zonder nullen — exact het patroon dat lane A vandaag
onafhankelijk in Leeuwarden vond. Twee lanes, twee provincies, één dag.

---

## GOEDGEKEURD — poort (h), beide lanes: ik heb elk citaat van schijf nagelopen

De order van deze week is scherp: *een citaat zonder `grep -n`-regelnummer telt
niet als voorbeeld, en een tabel waarin een controleerbaar citaat aantoonbaar
fout is, is een gefaalde dienst.* Ik heb daarom niet gekeken óf er een tabel
staat, maar **elke aangehaalde regel opgehaald uit `.claude/skills/`**.

**Lane A** draagt vier skills (`prospecting`, `cold-email`,
`marketing-psychology`, `copy-editing`), elk met regelnummers.
**Lane B** draagt negen rijen: vijf gebruikt, vier met grond als niet gebruikt.

Nagelopen, alle citaten van beide lanes in één ronde:

| Bestand | Regel | Staat er werkelijk | Oordeel |
|---|---|---|---|
| `prospecting/SKILL.md` | 65 | `Score every candidate against the ICP checklist...` | ✓ |
| `prospecting/SKILL.md` | 68 | `- **High**: confirmed by at least two independent sources or official business page` | ✓ |
| `prospecting/SKILL.md` | 106 | `3. **Public business contact channels only.**` | ✓ |
| `prospecting/SKILL.md` | 200 | `- [ ] Confidence levels honest — "High" requires 2 independent sources...` | ✓ |
| `prospecting/SKILL.md` | 202 | `- [ ] Source URL + date captured for every contact (GDPR / CAN-SPAM lineage)` | ✓ |
| `prospecting/SKILL.md` | 210 | `2. **Treating data sources as authoritative without cross-checks**` | ✓ |
| `cold-email/SKILL.md` | 35 | `### Every sentence must earn its place` | ✓ |
| `cold-email/SKILL.md` | 37 | `...feel like they could have been shorter, not longer.` | ✓ |
| `cold-email/SKILL.md` | 41 | `If you remove the personalized opening and the email still makes sense...` | ✓ |
| `cold-email/SKILL.md` | 49 | `### One ask, low friction` | ✓ |
| `cold-email/SKILL.md` | 93 | `- 2-4 words, lowercase, no punctuation tricks` | ✓ |
| `cold-email/SKILL.md` | 117 | `- Does it sound like a human wrote it? (Read it aloud)` | ✓ |
| `cold-email/references/subject-lines.md` | 5 | `## Length: 2–4 words` | ✓ |
| `cold-email/references/subject-lines.md` | 18 | `## Capitalization: lowercase wins` | ✓ |
| `marketing-psychology/SKILL.md` | 45/46 | `### Inversion` / `Instead of asking "How do I succeed?"...` | ✓ |
| `marketing-psychology/SKILL.md` | 65/66 | `### Theory of Constraints` / `Every system has one bottleneck...` | ✓ |
| `marketing-psychology/SKILL.md` | 85/86 | `### Map ≠ Territory` / `Models and data represent reality...` | ✓ |
| `marketing-psychology/SKILL.md` | 106/107 | `### Fundamental Attribution Error` / `People attribute others' behavior...` | ✓ |
| `marketing-psychology/SKILL.md` | 127 | `The longer something has survived, the longer it's likely to continue.` | ✓ |
| `marketing-psychology/SKILL.md` | 415/416 | `### Survivorship Bias` / `Focusing on successes while ignoring failures...` | ✓ |
| `copy-editing/SKILL.md` | 20 | `- Don't change the core message; focus on enhancing it` | ✓ |
| `copy-editing/SKILL.md` | 31 | `### Sweep 1: Clarity` | ✓ |
| `copy-editing/SKILL.md` | 117 | `### Sweep 4: Prove It` | ✓ |
| `copy-editing/SKILL.md` | 122 | `- Unsubstantiated claims` | ✓ |
| `copy-editing/SKILL.md` | 145 | `3. Flag unsupported assertions` | ✓ |
| `copy-editing/SKILL.md` | 152 | `### Sweep 5: Specificity` | ✓ |
| `copy-editing/SKILL.md` | 180 | `2. Ask "Can this be more specific?"` | ✓ |
| `copy-editing/SKILL.md` | 182 | `4. Remove content that can't be made specific (it's probably filler)` | ✓ |
| `offers/SKILL.md` | 139 | `- **"Worth $X" or "$Y value" with no comparable** — inflation` | ✓ |

**Negenentwintig citaten, negenentwintig treffers, nul fouten.** Geen enkel
citaat is verschoven, verzonnen of samengevat-met-aanhalingstekens. Poort (h)
is in beide lanes gehaald, en dit is de eerste dienst waarin ik het citaat voor
citaat heb kunnen zeggen in plaats van steekproefsgewijs.

De tabellen zijn bovendien niet hol. Twee voorbeelden die ik eruit licht omdat
zij aantoonbaar een uitkomst hebben veranderd in plaats van een framework te
citeren:

- Lane B, `cold-email:41` (de verwijdertoets) is **de ronde die
  `lwdienstverlening.nl` vond**. Sam toetste of zijn openingsdetail het hele
  bericht kon dragen, en dáárdoor ontdekte hij dat hetzelfde KvK-nummer een
  tweede domein met zes dienstlijnen draagt. Hij stond op het punt een man die
  stratenmakerij, vloeren, verhuizingen en twee coachingslijnen voert aan te
  schrijven als hovenier die zijn tuinen niet kan laten zien. De skill trok de
  hoek in. Dat is de winst van de dag en die is groter dan een kaart.
- Lane A, dezelfde regel, stopte de Gents Barbershop-kaart vóór de
  leeftijdscontrole: de score "4,9 over 166 knipbeurten" bleek een feit *over*
  het bedrijf en niet het lek *van* het bedrijf, wat Sam dwong de Fresha-regel
  na te lopen — waar bleek dat de zaak al online boekt.

Beide lanes noteren daarnaast de **overrule** van de owner op de subjectregels
(`cold-email:93` en `subject-lines.md:5/18` willen 2-4 woorden en kleine letters;
poort (g) eist een gecheckt detail binnen ±45 tekens met hoofdletter). Zij
melden de botsing in plaats van hem stil op te lossen. Dat is de afspraak van
09-09 en zij wordt nagekomen.

**1.44, vijfde meting.** Ik heb `cold-email` en `marketing-psychology` zelf
**zonder argument** aangeroepen. Beide teksten kwamen ongeschonden binnen; de
`$`-reeksen in `marketing-psychology` staan alle overeind: `$99`, `$100`, `$500`,
`$497`, `$1/day`, `$30/month`, `$90/month`, `$3/day`, `$80`, `$16`, `$50` en
`$2 to $1`. De regel van 1.40(g) — kort of geen argument — houdt stand, nu voor
de vijfde keer en voor het eerst gemeten door de verificatie zelf.

---

## AFGEKEURD — de bestemmingsborden: lane A schreef zijn twee rijen wél, maar geen van beide is terug te tellen

Lane A boekt #33 De Knipkamer naar `bellijst.md` en #34 Evelyn's Mobile
Hairservice naar `geen-emailadres.md`. Mijn eerste ronde gaf nul lane-A-rijen op
15-09, wat naar een niet-uitgevoerde bestemming rook. **Dat was mijn
zoekopdracht, niet zijn werk** — beide rijen staan er wel degelijk
(`bellijst.md:755`, `geen-emailadres.md:1380`). De bestemming is uitgevoerd.

Maar zij is niet te tellen, en dat is een echt probleem op het bord:

```
$ grep -cE '\| 15-09-2026 \|' geen-emailadres.md   -> 8   (lane B)
$ grep -cE '\| 2026-09-15 \|' geen-emailadres.md   -> 11  (lanes A, C, D)
```

**Negentien rijen van één dag, in twee datumvormen, in één bestand.** Geen enkel
commando geeft 19. Sams eigen telcommando klopt — maar alleen omdat het zijn
eigen afwijkende vorm matcht. Over het hele bestand staan 53 rijen in
DD-MM-YYYY tegen een huisvorm van YYYY-MM-DD.

`bellijst.md` is erger: het bestand **heeft geen datumkolom**. De kop is
`Bedrijf | Plaats | Sector | Telefoon | Gedateerd levensteken | Waarom geen kaart`,
en de datum leeft in de notitie — vandaag in twee vormen naast elkaar:

```
lane B -> "2026-09-15 lane B. Nummer in de URL-titel van ..."
lane A -> "... dus per 1.24 hierheen en niet naar `geen-emailadres.md` (lane A, 15-09)"
$ 136 rijen in bellijst.md dragen helemaal geen leesbare datum
```

Zeven rijen zijn er vandaag bij gekomen; geen enkel commando telt er zeven. Dat
is 1.47 hieronder. Het gaat hier niet om netheid: het belkanaal is een van de
zes beslispunten die bij de owner liggen, en hij kan een bord niet wegen
waarvan de dagopbrengst niet te tellen is.

---

## Het fundament — 1.46 tot en met 1.50

Mijn reeks (verificatie A+B) is 1.41 t/m 1.50 en stond na gisteren op 1.45. Ik
vul hem vandaag precies vol. Elke regel heeft dragers die vandaag gemeten zijn.

**1.46 — Twee tellingen over dezelfde eenheid in één bestand is een gefaalde
telling, ook als ze allebei op de eenheid sluiten.** Een tabel die door een
nieuwe versie wordt vervangen, wordt verwijderd, niet onder de nieuwe gelaten.
Controleer vóór het pushen met `grep -n "Totaal"` dat er per eenheid één
tekorttabel staat. *Dragers: lane A 15-09, twee tabellen over 49 dossiers die
op vier van de zeven gronden verschillen (poort (f) 10 tegen 14, lead 12 tegen
7, buiten profiel 5 tegen 6), waarvan de tweede aantoonbaar onbereikbare
getallen voert; plus de vastgelopen kopregel `---|---|` op regel 273.*

**1.47 — De bestemmingsborden krijgen één datumvorm, en `bellijst.md` krijgt een
datumkolom.** Vorm: `YYYY-MM-DD`, de huisvorm van `geen-emailadres.md`, in een
eigen kolom en niet in de notitietekst. Zolang de oude rijen niet zijn
omgezet, draait een dagtelling **beide** vormen. *Dragers: 8 rijen `15-09-2026`
tegen 11 rijen `2026-09-15` op één dag in `geen-emailadres.md`, 53 rijen in de
afwijkende vorm over het hele bestand; `bellijst.md` zonder datumkolom, 136
rijen zonder leesbare datum, en vandaag twee vormen naast elkaar (`2026-09-15
lane B` tegen `(lane A, 15-09)`).*

**1.48 — Een jaartal in de titel van een gidspagina hoort bij de gids, niet bij
het bedrijf, en draagt poort (a) nooit.** Gidsen herschrijven hun eigen
jaarstempel en hun eigen aantal op dezelfde URL. *Drager: `hovenier.website/
lemelerveld/` gaf mij in twee ronden van één dienst "Top 20 hoveniers
Lemelerveld in ① gids [2025]!" en "Top 15 hoveniers uit Lemelerveld (2026)" —
zelfde URL, ander jaar, ander aantal.*

**1.49 — 1.40(d) bevestigd over de lanegrens: het getal in een
`drimble.nl/bedrijf/<plaats>/<getal>/`-pad is het vestigingsnummer zonder
voorloopnullen en is nooit het KvK-nummer.** *Dragers: BK Service Cleaning,
Leeuwarden (lane A) — drimble `25979302` en `000025979302` naast KvK
`95610103`; Liever Buiten Hoveniers, Lemelerveld (lane B, door mij nagemeten) —
drimble `47927879` naast vestigingsnummer `000047927879` en KvK `81650817`.
Twee lanes, twee provincies, één dag.*

**1.50 — De tekorttabel draagt per grond een kolom met de rijnummers.** Dat
maakt de hele telling in één ronde machinaal controleerbaar in plaats van op
het woord van de agent. *Dragers: lane B 15-09, wiens zeven nummerreeksen 1 t/m
98 exact partitioneren (geen dubbel, geen gat, elk opgegeven aantal gelijk aan
het werkelijke); lane A 15-09, wiens tabel zonder rijnummers een tweede,
tegenstrijdige tabel vier secties lang onopgemerkt droeg.*

---

## Voor het weekrapport

Mijn reeks is vol. Deze kandidaten hebben dragers en mogen niet verdampen; ik
draag ze over in de vaste vorm.

| Kandidaatregel | Aantal dragers | De dragers zelf |
|---|---|---|
| **Een recent KvK-nummer sluit poort (f) niet zolang de eigen site een ervaringsclaim van meer dan zes jaar voert.** Ik onderschrijf deze regel van lane A en voeg de derde drager toe | 3 | BK Service Cleaning, Leeuwarden (KvK 95610103 = 2024/25 náást "meer dan 10 jaar" + B.V.); Borstel Cleaning, Makkum (KvK 98562509 = 2025 náást "meer dan 40 jaar ervaring"); **Barendsma Schoonmaakbedrijf, Leeuwarden (KvK 91780659 = 2023/24 náást vierde generatie sinds 1900) — door mij vandaag gesloten** |
| `vindlokaal.eu` opnemen in de jaagvolgorde van 1.20(b) als bron voor de geen-websitegroep, met de webstatustelling als openingszet per stad | 1 met een harde noemer | `kapper.vindlokaal.eu/kapper/groningen/`: 138 kappers, 126 telefonisch bereikbaar, 31 met eigen website — 107 zaken in één stad in één niche die het prime target van de order van 24 augustus zijn. Bron voert geen e-mailadressen: **bellijstmotor, geen kaartmotor** |
| De lekronde draait op élk domein van de onderneming, niet op het domein dat de sectornaam aanwijst | 2 + één negatieve controle | LW Hoveniers 15-09 lane B; Huizinga 14-09 verificatie; negatieve controle op Liever Buiten (lane B) |
| Staat het e-mailadres niet in de URL-titel van een tariefgids, dan is er geen adres — `kostenschilderbedrijf.nl` en `schildersregister.nl` voeren hem nooit in de titel | 9 van 9 titels | Lane B, bevinding 2, in één ronde geteld |
| Komt de tekenreeksronde terug met twee domeinen die dezelfde handelsnaam dragen, dan sluit poort (b) niet, ook al staat er een eigen bedrijfspagina bij | 1 | De Haan Cleaning, `.nl` tegen `.com` (lane B, bevinding 3) |
| Een poort-(e)-treffer op een naam zonder eigennaam wordt naast het KvK- of vestigingsnummer gelegd vóór hij een dossier sluit, niet alleen naast de plaats | 1, over de lanegrens | De Ambachtelijke Glazenwasser: Hilversum (lane D, 14-09) tegen Andelst (lane B, 15-09) |
| **Botsing, twee lanes onafhankelijk gemeld:** de staande regel in `agents/beats.md` (geen sector drie of meer keer in zeven dagen) botst frontaal met het sectorplan | 2 lanes, 3 meetwijzen | Lane A: glazenwasserij zeven dagen op rij, hovenier zes. Lane B: 364 hovenierrijen en 467 glazenwasserijrijen over zeven dagen, tegen 1 hovenier en 4 totaal als alleen `drafted`-rijen tellen. **Welke van de drie maten de regel bedoelt, is een besluit voor de owner** |

---

## Gebruikte skills

Elk citaat is met `grep -n` van schijf gehaald uit `.claude/skills/`. Beide
skills zijn **zonder argument** aangeroepen, per 1.40(g) en 1.44.

| Skill | Waar toegepast | Wat het concreet veranderde |
|---|---|---|
| `cold-email` | Op de vraag of er uit lane A of lane B alsnog een verzendklare kaart kon komen, vóór mijn eigen ronden | De verwijdertoets (`SKILL.md:41`: `If you remove the personalized opening and the email still makes sense, the personalization isn't working. The observation should naturally lead into why you're reaching out.`) is waarmee ik Liever Buiten heb getoetst vóórdat ik poort (a) ging jagen. Mijn sterkste denkbare opening was de oprichtingsdatum 28-01-2021 — haal die weg en het bericht staat er ongeschonden, want vijf jaar bestaan is een feit *over* hem en geen lek *van* hem. Dat bepaalde de volgorde van mijn ronden: niet zoeken naar een mooiere opening maar naar een gedateerd spoor, en dat spoor is er niet. `### Every sentence must earn its place` (`:35`) met `The best cold emails feel like they could have been shorter, not longer.` (`:37`) is waarom ik Sams besluit om géén kaart met een controleopdracht voor de owner te schrijven onderschrijf: een bericht dat de owner eerst zelf moet natrekken, is korter door het niet te sturen. En `- 2-4 words, lowercase, no punctuation tricks` (`:93`) naast `## Length: 2–4 words` (`references/subject-lines.md:5`) en `## Capitalization: lowercase wins` (`:18`) is de overrule die beide lanes correct melden: poort (g) van de owner wint, en ik bevestig hem opnieuw in plaats van hem stil te laten |
| `marketing-psychology` | Op de sturing van mijn eigen dienst, op het oordeel over Barendsma, en op de gidsjaartallen | *Theory of Constraints* (`SKILL.md:65`, `Every system has one bottleneck limiting throughput. Find and fix that constraint before optimizing elsewhere.` op `:66`) verlegde mijn dienst: met nul kaarten is de bindende beperking niet de tekstkwaliteit maar de **controleerbaarheid van de tellingen**, dus ik heb mijn ronden in nametingen en in twee eigen jachtronden gestoken in plaats van in het herschrijven van berichten die niet bestaan. *The Lindy Effect* (`:127`, `The longer something has survived, the longer it's likely to continue.`) is het oordeel over Barendsma: een vierde generatie sinds 1900 is geen groeifasebedrijf, hoe vers het KvK-nummer van 2023 ook is — en het is dezelfde regel die lane A zelf voordroeg en op zijn eigen lead vergat toe te passen. *Map ≠ Territory* (`:85`, `Models and data represent reality but aren't reality itself.` op `:86`) is de kop boven 1.48: "(2026)" in een gidstitel is een stempel van de kaart en niet van het terrein, en dezelfde URL gaf mij twee uur later "[2025]". *Inversion* (`:45`, `Instead of asking "How do I succeed?", ask "What would guarantee failure?" Then avoid those things.` op `:46`) stuurde mijn verificatievolgorde: op de vraag wat deze dienst gegarandeerd waardeloos zou maken, was het antwoord "een tekorttabel goedkeuren die de opzichter morgen als waarheid leest" — en dus heb ik de tabellen als eerste nagerekend in plaats van als laatste. *Survivorship Bias* (`:415`, `Focusing on successes while ignoring failures that aren't visible.` op `:416`) is waarom ik lane B's 98 dossiers niet als prestatie heb geboekt maar als partitie heb nagemeten: een hoge telling ziet er uitstekend uit en dat is precies waarom zij een nameting verdient |
| `prospecting` | Niet als skill ingezet — wel van schijf gelezen om Sams citaten te controleren | Ik heb vandaag geen prospectlijst gebouwd of gekwalificeerd; ik heb twee dossiers nagejaagd en de rest geverifieerd. De regels 65, 68, 106, 200, 202 en 210 staan in mijn poort-(h)-tabel hierboven als **controle** van lane A en lane B, niet als toepassing van mijzelf. Dat onderscheid hoort genoteerd, anders telt een controleronde als skillgebruik |
| `copy-editing` | Niet als skill ingezet — wel van schijf gelezen ter controle | Zelfde grond: de acht geciteerde regels (20, 31, 117, 122, 145, 152, 180, 182) heb ik opgehaald om Sams citaten te toetsen. Mijn eigen bestand heb ik nagelopen op de vormregels van de order (oordeelwoord vooraan, samenvattingstabel achteraan, elke telling met haar commando), niet met een skillsweep |
| `marketing-council` | Niet gebruikt | Toegewezen aan mij voor het weekrapport, niet voor de dagelijkse verificatie. Er is vandaag geen strategisch besluit te nemen: de zes beslispunten liggen bij de owner en er komen er vier bij |
| `offers` / `pricing` | Niet gebruikt | Er is geen kaart en dus geen pakketkeuze. `offers/SKILL.md:139` staat in mijn poort-(h)-tabel als controle van lane B, niet als eigen inzet |

---

## Samenvatting — één regel per onderdeel

| # | Onderdeel | Oordeel |
|---|---|---|
| 1 | Lane A — 0 kaarten, tekort in de vaste vorm gemeld | **GOEDGEKEURD** — eerlijk gemeld, `grep -cE '^## [0-9]+\. '` geeft 0 |
| 2 | Lane A — telling van 49 dossiers en 34 ledgerrijen | **GOEDGEKEURD** — 49 nagerekend, 34 = 49 − 15 poort (e), klopt exact |
| 3 | Lane A — eerste tekorttabel (r. 247) | **GOEDGEKEURD** — alle zes gronden reproduceerbaar, som 49 |
| 4 | Lane A — tweede tekorttabel (r. 273) | **AFGEKEURD** — tegenstrijdig, poort (f) 14 en lead 7 zijn onbereikbaar, kopregel `---|---|` kapot; moet weg (1.46) |
| 5 | Lane A — poort (e), bulkronden met notitietekst gelezen | **GOEDGEKEURD** — drie treffers op een ánder bedrijf correct herkend |
| 6 | Lane A — #9 Barendsma als open lead | **AFGEKEURD** — één ronde, niet twee zoals de tabel zegt; mijn eigen ronde sluit hem: vierde generatie sinds 1900, te lang gevestigd |
| 7 | Lane A — vijf routes en 1.40(a) | **GOEDGEKEURD** — formeel niet verschuldigd, insolventieronde toch gedraaid op de twee verst gekomen dossiers |
| 8 | Lane B — 0 kaarten, tekort in de vaste vorm gemeld | **GOEDGEKEURD** — eerlijk gemeld |
| 9 | Lane B — telling van 98 dossiers | **GOEDGEKEURD** — 42 + 36 + 20, nummering onafgebroken 1 t/m 98 |
| 10 | Lane B — de zeven gronden met rijnummers | **GOEDGEKEURD** — volmaakte partitie van 1 t/m 98, geen dubbel, geen gat (vorm vastgelegd als 1.50) |
| 11 | Lane B — ledger 82, bellijst 6, geen-emailadres 8 | **GOEDGEKEURD** — alle drie exact nagemeten |
| 12 | Lane B — de vijf bewijsroutes op rij 1 en 2 | **GOEDGEKEURD** — met uitkomst per route; naamgenoot in Deurne herkend (1.53) |
| 13 | Lane B — 1.40(a) insolventieronde | **GOEDGEKEURD** — vier nummers, alle schoon, commando erbij |
| 14 | Lane B — vergunning op het woonadres afgewezen | **GOEDGEKEURD** — 1.7 én persoonsgegeven, niet gebruikt terwijl hij poort (a) had kunnen dragen |
| 15 | Lane B — Liever Buiten blijft op poort (a) staan | **GOEDGEKEURD** — na drie eigen ronden bevestigd; SOM-portret is 31-03-2022, ruim vier jaar oud |
| 16 | Lane B — 364/467 tegen "13 ledger rows" uit de briefing | **GOEDGEKEURD** — briefinggetal niet overgeschreven maar nagerekend, drie maten met commando |
| 17 | Poort (h) — skillstabel lane A | **GOEDGEKEURD** — vier skills, alle citaten met regelnummer, alle correct |
| 18 | Poort (h) — skillstabel lane B | **GOEDGEKEURD** — vijf gebruikt, vier met grond niet gebruikt, alle citaten correct |
| 19 | Poort (h) — 29 citaten van schijf nagelopen, beide lanes | **GOEDGEKEURD** — 29 van 29 correct, nul fouten |
| 20 | 1.44 — beide skills zonder argument aangeroepen | **GOEDGEKEURD** — alle `$`-reeksen ongeschonden, vijfde meting |
| 21 | Bestemmingsborden — de twee lane-A-rijen | **GOEDGEKEURD** — beide rijen staan er werkelijk (`bellijst.md:755`, `geen-emailadres.md:1380`) |
| 22 | Bestemmingsborden — de datumvormen | **AFGEKEURD** — 8 rijen `15-09-2026` naast 11 rijen `2026-09-15` op één dag; `bellijst.md` heeft geen datumkolom, 136 rijen zonder datum (1.47) |
| 23 | Kaarten op het bord vandaag uit lanes A en B | **NUL** — en dat is de juiste uitkomst; geen enkel dossier haalde alle poorten |

**Eindoordeel.** Nul kaarten uit 147 beoordeelde dossiers, en ik keur dat goed.
Beide lanes hebben eerlijk gemeld in plaats van de lat te verlagen, en dat is de
order: een correcte mail die niemand beantwoordt is duurder dan geen mail. Lane
B levert de best controleerbare tekorttabel die deze lanes tot nu toe hebben
geschreven en trok eigenhandig een hoek in die bijna een verkeerd bericht was
geworden. Lane A levert een bruikbare nieuwe bron en vier gesloten open leads,
maar draagt één tabel te veel en liet zijn eigen regel los op de enige rij waar
zij telde. Beide correcties staan hierboven met hun commando.

Azzouz, 15 september 2026
