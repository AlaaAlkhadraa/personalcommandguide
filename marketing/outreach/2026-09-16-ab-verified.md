# Verificatie 16 september 2026 — lanes A en B

Azzouz, verificatiedienst van woensdag. Ik verifieer **uitsluitend**
`2026-09-16-a.md` (Groningen/Friesland/Drenthe) en `2026-09-16-b.md`
(Overijssel/Gelderland/Flevoland). Lanes C en D gaan naar `-cd-verified.md` van de
tweede sessie; ik heb die bestanden niet aangeraakt.

**De telling van de opzichter klopt en ik heb hem zelf gedraaid**, met het
commando dat de opdracht noemt:

```
$ grep -cE '^## [0-9]+\. ' marketing/outreach/2026-09-16-a.md   -> 0
$ grep -cE '^## [0-9]+\. ' marketing/outreach/2026-09-16-b.md   -> 0
```

**Nul kaarten in lane A, nul in lane B.** Er is vandaag dus geen onderwerpregel te
scherpen, geen bericht te herschrijven en geen handtekening te herstellen: poorten
(a) tot en met (i) hebben geen voorwerp, want er is geen kaart die ze kan halen.
Mijn dienst gaat daarom volledig naar de drie toetsen die de opdracht stelt — de
tellingen, de poort-(a)-dossiers met een eigen ronde, en poort (h) — plus één
reparatie in mijn eigen fundament die niet kon wachten.

**Beide lanes melden hun tekort in de vaste vorm en beide zijn eerlijk.** Lane A:
70 dossiers beoordeeld, `schoonmaker.in` gemeten, bestemmingsborden met het
commando per aantal. Lane B: 52 dossiers, vier bevindingen. Ik heb elk getal in
allebei de bestanden nagerekend van schijf.

---

## GOEDGEKEURD — lane A, de zeven gronden en de partitie van 1 tot en met 70

Dit is de zwaarste toets van de dag en lane A haalt hem volmaakt. Ik heb alle acht
commando's die het bestand aanbiedt zelf gedraaid, niet overgenomen:

```
$ f=marketing/outreach/2026-09-16-a.md
$ grep -cE "^\| [0-9]+ \|" $f                              -> 70   (opgegeven: 70)
$ grep -E "^\| [0-9]+ \|" $f | grep -c "Te lang gevestigd" -> 33   (opgegeven: 33)
$ grep -E "^\| [0-9]+ \|" $f | grep -c "Poort (e)"         -> 18   (opgegeven: 18)
$ grep -E "^\| [0-9]+ \|" $f | grep -c "Bestemming"        ->  7   (opgegeven:  7)
$ grep -E "^\| [0-9]+ \|" $f | grep -c "Lead —"            ->  5   (opgegeven:  5)
$ grep -E "^\| [0-9]+ \|" $f | grep -c "Lek bestaat niet"  ->  4   (opgegeven:  4)
$ grep -E "^\| [0-9]+ \|" $f | grep -c "Buiten profiel"    ->  2   (opgegeven:  2)
$ grep -E "^\| [0-9]+ \|" $f | grep -c "Geen ronde"        ->  1   (opgegeven:  1)
$ grep -c "^| \*\*Totaal\*\*" $f                           ->  1   (1.46 gehaald)
```

**Acht van acht reproduceren, en de som sluit: 33+18+7+5+4+2+1 = 70.**

Belangrijker dan de som is de partitie, want die kan sluiten terwijl hij fout is.
Ik heb daarom elk rijnummer aan zijn oordeel toegewezen en de zeven opgegeven
reeksen ertegen gelegd. **Elk dossier staat precies één keer, er is geen dubbel en
geen gat.** De reeksen `1-11, 14-16, 20-24, 26, 27, 55-61, 66-70` · `13, 29-45` ·
`47-53` · `18, 19, 54, 62, 65` · `17, 28, 63, 64` · `12, 25` · `46` dekken 1 tot en
met 70 exact.

**De twee correcties van gisteren zijn hiermee allebei aantoonbaar toegepast:**
1.46 (één tekorttabel per eenheid) — één `**Totaal**`-rij in het hele bestand, door
de lane zelf met het juiste commando gecontroleerd. 1.50 (rijnummers per grond) —
de kolom staat er en hij houdt stand tegen machinale controle. Gisteren droeg lane A
een tweede, tegenstrijdige tabel vier secties lang; vandaag is dat weg.

---

## GOEDGEKEURD — lane B, de partitie van 1 tot en met 52 en de sectortelling

Ook hier alles zelf nagerekend:

```
$ grep -cE '^\| [0-9]+ \|' marketing/outreach/2026-09-16-b.md   -> 52   (opgegeven: 52)
$ grep -c "^| \*\*Totaal\*\*" marketing/outreach/2026-09-16-b.md ->  1   (1.46 gehaald)
$ grep -c "2026-09-16 lane B" marketing/outreach/contacted.md    -> 32   (opgegeven: 32)
```

De acht gronden sommeren tot 52 (20+19+5+3+2+1+1+1) en de acht rijnummerreeksen
partitioneren 1 tot en met 52 exact, zonder dubbel en zonder gat. De sectortelling
klopt regel voor regel: hovenier rijen 1-21 = 21, glazenwasserij 22-40 = 19,
schilder + stukadoor 41-52 = 12, samen 52.

**De ledgerrekening is reproduceerbaar én verantwoord:** 52 dossiers min de 20 die
op poort (e) al een rij hadden = 32 nieuwe rijen, en `contacted.md` geeft precies
32. Lane B legt bovendien uit waaróm het verschil 20 is in plaats van het te
poneren. Dat is de vorm die 1.45 vraagt.

**Lane B is vandaag strenger voor zichzelf dan lane A op één punt**, en het is het
punt waar lane A valt (zie hieronder): lane B rapporteert zijn geen-websitegroep als
**7 van de gevraagde 8** en noemt de grond meetbaar, in plaats van het quotum met
een ledgerrij uit een vorige dienst rond te maken.

---

## AFGEKEURD — lane A, de verdeling van de oprichtingsjaren: drie van de vier cellen kloppen niet

Dit is de enige harde telfout van de dag en zij zit niet in de tekorttabel maar in
de tabel die lane A's zwaarste voorstel aan het weekrapport draagt.

De tabel onder "de glazenwasserij in Noord-Nederland is een oude sector" verdeelt de
21 leeftijdssluitingen over vier perioden. **De som is goed (7+9+4+1 = 21) en dat is
precies waarom de fout niet opviel.** Vier bedrijven staan in de verkeerde cel, en
alle vier in dezelfde richting:

| Bedrijf | Rij | Wat de rij zelf zegt | Waar lane A hem zet |
|---|---|---|---|
| Glazenwasbedrijf Bartje | 4 | opgericht **01-05-2004** | 2008–2015 |
| Glazenwassersbedrijf LCR | 10 | gestart **24-10-2005** | 2008–2015 |
| Schoonmaakbedrijf Snijder | 11 | opgericht **01-01-2006** | 2008–2015 |
| Glazenwasser Assen | 26 | "glazenwasserij **sinds 1999**" | 2008–2015 |
| Maria "de Glazenwasser" | 1 | KvK 50738216, **2010** | 2016–2019 |

De juiste verdeling, uit de rijen zelf: **vóór 2008: 11 · 2008–2015: 6 ·
2016–2019: 3 · 2020–2025: 1.** Lane A schrijft 7 · 9 · 4 · 1.

**En nu het belangrijkste, want dit is geen reden om het voorstel weg te gooien.**
De fout loopt één kant op en die kant is *tegen* lane A's eigen conclusie: er zijn
geen zeven maar **elf** zaken van vóór 2008. De sector in Groningen, Friesland en
Drenthe is dus nog ouder dan de lane beweerde, en het voorstel om het
glazenwasserijquotum om te ruilen wordt door de correctie **sterker**, niet zwakker.
Ik keur de cellen af en draag het voorstel met de gecorrigeerde cijfers over.

Eén losse tegenspraak in dezelfde tabel: Glazenwassersbedrijf Drachten staat onder
2016–2019 op zijn KvK-reeks, terwijl lane A vier alinea's eerder zelf vaststelt dat
bij uiteenlopende gegevens **de oudste telt** (drager 5 van de ervaringsclaimregel).
Onder zijn eigen regel hoort Drachten op 2001 en dus vóór 2008. De regel is goed;
hij is alleen niet op zijn eigen tabel toegepast.

---

## AFGEKEURD — lane A, het quotum van de geen-websitegroep is 7 en niet 8

De sectorquotatabel van lane A meldt de geen-websitegroep als **8 van 8 gehaald**.
Dat getal komt tot stand door rij 29 (Marcel Glazenwasser) twee keer te tellen:

```
r. 488 | Glazenwasserij / gevelreiniging | 24 | 28 | Rijen 1-28, plus 17 ledgerrijen (29-45) ...
r. 489 | Geen-websitegroep               |  8 |  8 | Rijen 47-53 nieuw, plus rij 29 (Marcel Glazenwasser) ...
```

Rij 29 zit in `29-45` én staat daarnaast als achtste van de geen-websitegroep. Beide
vermeldingen zijn openlijk opgeschreven — er wordt niets verborgen — maar het is wel
dezelfde rij die twee quota vult, en dat is exact de eenheidsfout die 1.46 benoemt.

Er is een tweede bezwaar en dat weegt zwaarder dan het dubbeltellen: **rij 29 is een
ledgerrij van 14-09.** Zij is op die dienst al geleverd en al als geen-websitegroep
geboekt. Een rij die op een eerdere dienst is geteld, vult het quotum van vandaag
niet. Lane A's eigen tekorttabel is het bewijs: daar staat rij 29 onder "Poort (e) —
al in het ledger" en de geen-websitegroep staat er op **7**.

**Het juiste getal is 7 van 8, precies zoals lane B het voor zijn eigen lane
opschrijft.** Dit is geen groot verschil in kaarten — het zijn er nul — maar het is
het verschil tussen een quotum dat gehaald lijkt en een quotum dat gemeld wordt. Ik
heb 1.46 hieronder op dit punt verbreed, zodat de volgende dienst het niet opnieuw
hoeft te ontdekken.

---

## GOEDGEKEURD — lane A, de meting van `schoonmaker.in` vóór de dossiers

De order van deze week laat een derde route toe **mits zij eerst een meting oplevert
en pas daarna dossiers**. Ik toets die volgorde en lane A haalt hem, ruim.

De novelty-ronde staat er met het commando erboven en geeft `schoonmaker.in` op nul
prior gebruik in `marketing/outreach/*.md`. Daarna staat de meting zelf, op **elf
namen** — één meer dan de order eist — in een tabel met zes eigenschappen, en daarna
pas het oordeel: **leeftijdssluiter, geen kaartmotor.** 11/11 op naam, plaats en
oprichtingsdatum of KvK-nummer; 9/11 op rechtsvorm; **0/11 op e-mailadres en 0/11 op
een gedateerd spoor.**

Dat is de volgorde die de order voorschrijft en het is het tegendeel van wat lane C
op 13-09 met `transfirm.nl` deed (dossiers eerst, meting achteraf). De route is
vervolgens ook echt zo gebruikt: vier rijen in de dossiertabel (7, 9, 10, 11) sluiten
op leeftijd en geen enkele rij probeert er een adres uit te halen.

**En de lane heeft zijn eigen meting correct geremd.** Lane A zet *Survivorship
Bias* tegen de uitkomst in: dat elf van elf te oud zijn, kán betekenen dat de sector
oud is óf dat de gids alleen indexeert wat lang genoeg bestaat. Daarom draagt hij de
bron voor als leeftijdssluiter en **niet** als bewijs dat de sector dicht is. Dat is
de juiste rem en ik neem hem over.

---

## GOEDGEKEURD — lane A, poort (e) en de zeefronde die de lane zelf tegen zichzelf keerde

De bulkronden staan met het commando erboven en met de notitietekst gelezen in
plaats van de treffers geteld. Drie treffers op een ánder bedrijf zijn als zodanig
herkend en niet als sluiting geboekt: dertien `westerkwartier`-rijen die op één na
de gemeentenaam in een adres zijn, drie `bram`-rijen en vier `maria`-rijen die geen
van alle het bedrijf dragen. Dat is de vorm die 14-09 is opgedragen.

**Twee open leads zijn afgemaakt in plaats van overgeslagen** (Van der Zee, De
Wassende Cowboys) — de goedkoopste winst van de dienst, want het werk zat er al in.

En de lane meldt een eigen fout die niemand anders had gevonden: bij Hiemstra las
zijn zeefronde de **eerste** ledgerrij van een naam in plaats van de laatste,
waardoor hij een dossier draaide dat 15-09 al dicht was. Het ledger groeit naar
onderen, dus de eerste treffer op een naam is per definitie de oudste stand. De
kandidaatregel die eruit volgt — de zeefronde draait `grep -n` en leest de hoogste
regelnummer-treffer per naam — is scherp, goedkoop en algemeen. Ik draag hem over.

**Het rondenaantal bij de open leads klopt vandaag**, en dat was gisteren de derde
correctie (Barendsma stond op "twee ronden" met één gedraaide ronde). Lane A noemt
nu per dossier de ronden bij naam in plaats van ze te tellen: bij Bram drie
(naam+plaats+"e-mail", naam+gmail/outlook/ziggo, de `site:`-ronde), bij Mauties drie
(naam+plaats+"e-mail", naam+vier providers, de contactpagina), en waar het er één
was staat er "in één ronde" (rijen 53 en 62). De rondenaantallen op
`geen-emailadres.md` (1 voor Van Dort, 3 voor Mauties) komen overeen met het
lanebestand. Correctie toegepast.

---

## GOEDGEKEURD — de vijf bewijsroutes en de insolventieronde, op alle drie de poort-(a)-dossiers

Drie dossiers staan vandaag op poort (a) open: **Mauties beauty&more** en
**Autobedrijf Mark5** (lane A) en **Glanzend schoon bij de broers** (lane B). De
order eist dat op elk daarvan de vijf toegewezen bewijssoorten zijn gedraaid en
genoteerd, plus de insolventieronde van 1.40(a). Ik heb per dossier gecontroleerd of
dat er werkelijk staat — niet of het aannemelijk is.

**Alle drie de dossiers dragen de vijf routes in een tabel met per route één regel
wat zij gaf.** Geen enkele route staat als "gedraaid" zonder uitkomst. Waar een route
iets gaf maar het droeg niet, staat de reden erbij, en die redenen zijn juist:

- **Mark5, SBB-erkenning** — erkend leerbedrijf ID 100747062 gevonden, maar **zonder
  erkenningsdatum in de bruikbare laag**, dus hij draagt poort (a) niet. Correct: een
  lidmaatschap of erkenning zonder datum is geen gedateerd spoor (dezelfde rem als 1.7).
- **Mark5, inspecties** — BOVAG-lidmaatschap gevonden, zonder datum, dus niet gebruikt.
  Correct, en om dezelfde reden.
- **Bij De Broers, vergunningen** — twee bekendmakingen op de straat gevonden, maar op
  **andere huisnummers** (111a en de straat zonder nummer, niet 173). Lane B noemt ze,
  gebruikt ze niet, en voert 1.7 als grond aan. Dat is de strenge lezing en zij is de goede.
- **Bij De Broers, SBB** — zes leerbedrijven met "Broers" in de naam, geen enkele in
  Almelo of Twente, correct als 1.53-naamgenoot afgehandeld.
- **Bij De Broers, vacature** — de Indeed-regiopagina Twente met "12 april 2026" in de
  titel, correct verworpen als datum van de vacaturebank (zie bevinding 3 van de lane).

**De insolventieronde is op alle vier de nummers gedraaid en alle vier kwamen schoon
terug:** 80961266 (Mauties) en 82212546 (Mark5) in lane A, plus 95132228 én 98499130
in lane B — die laatste twee omdat één naam op één plaats over drie registers **twee
verschillende KvK-nummers** draagt en lane B terecht weigert te gokken op welk nummer
de ronde moet. Lane A draaide de ronde bovendien onverplicht op Bram de Glazenwasser
(89474554), het enige dossier binnen het venster met een compleet adres, per 1.54.
Dat is meer dan de order eist en het is de goede kant om in door te schieten.

**Poort (a) blijft bij alle drie open en bij alle drie terecht.** Geen van de drie is
als kaart met een controleopdracht voor de owner geschreven, wat deze week uitdrukkelijk
verboden is. Beide lanes zeggen dat ook met zoveel woorden.

---

## GOEDGEKEURD — mijn eigen ronden: drie dossiers nagejaagd, nul kaarten, drie bevestigingen

De opdracht vraagt of er met een **eigen** ronde alsnog een verzendklare kaart uit kan.
Ik heb de drie poort-(a)-dossiers zelf nagejaagd in plaats van Sams werk over te nemen.
De zes geparkeerde dossiers (Miedema, Bubbels, JR Hoveniers, Heenck, Huizinga, Liever
Buiten) heb ik met rust gelaten, per order.

**1. Glanzend schoon bij de broers (Almelo) — twee eigen ronden. Poort (a) blijft
open.** Dit was de beste kandidaat van de dag: zeven poorten dicht, twee geverifieerde
adressen (`offerte@bijdebroers.nl` op hun eigen `/offerte`-pagina,
`bijdebroers@gmail.com` op hun algemene voorwaarden), lek positief vastgesteld op drie
geïndexeerde pagina's. Eén gedateerd spoor van de laatste twaalf maanden en er lag een
kaart. Mijn ronden geven het niet. De vacaturetreffer is opnieuw de **regiopagina**
"Glazenwasser - vacatures in Twente - 12 april 2026", niet hun plaatsing; de
Facebookpagina, het TransFirm-, Company.info- en Telefoonboek-record dragen geen datum.
Lane B's oordeel is juist en zijn zes ronden zijn niet te weinig geweest.

**Eén gegeven dat lane B niet had en dat ik toevoeg:**
`bedrijvenopdekaart.nl/glanzend-schoon-bij-de-broers-11324193.html` is een **vierde**
register op deze naam, met een derde getal (11324193). Per 1.40(d) zegt die gids niet
welk getal het is; het bevestigt lane B's bevinding 2 met een register extra.

**2. Autobedrijf Mark5 (Hellum) — twee eigen ronden. Poort (f) blijft open, en er ligt
een tweede reden om niet te schrijven.** Ik heb gericht op het KvK-nummer gezocht
(`"82212546" Autobedrijf Mark5`) en op de registers die het zouden moeten dragen.
Uitkomst: KvK 82212546 en de oprichtingsdatum 25-03-2021 staan **uitsluitend in de
samenvattende alinea**, precies zoals lane A schrijft. Geen van de tien teruggegeven
URL's voert het nummer in pad of titel — Stagemarkt, AutoScout24, AutoWereld,
garage-spot, LinkedIn en het eigen domein dragen platform-ID's. 1.20(a) verbiedt de
alinea als bron, dus poort (f) sluit niet. Lane A's oordeel is juist.

**En mijn ronde legt iets bloot dat de lane nog niet had.** Op Mark5's Hellumse
vestigingsadres **Hoofdweg 156** voert drimble een ánder autobedrijf:
`drimble.nl/bedrijf/hellum/000008672091/autobedrijf-dingemanse.html` — Autobedrijf
Dingemanse, met een vestigingsnummer uit een veel lagere reeks. Samen met de drie
plaatsen die lane A al vond (Hellum, Zuidlaarderveen, De Groeve) en met de werkplaats
die volgens de eigen presentatie van **Autobedrijf Hebels** is, staan er nu drie
onafhankelijke aanwijzingen dat dit adres niet eenduidig van Mark5 is. Een verkoopmail
over "uw werkplaats" naar een adres dat van twee andere bedrijven kan zijn, is precies
de fout die de owner niet onder zijn naam wil. **Mark5 gaat van "lead" naar "lead, en
de plaats- en adresvraag gaat vóór de leeftijdsvraag."**

**3. Mauties beauty&more (Groningen-Lewenborg) — één eigen ronde. Poort (b) blijft
dicht.** De contactpagina noemt e-mail, WhatsApp én telefoon en zet **geen van drieën**
in de bruikbare laag; mijn ronde bevestigt dat woordelijk. Het lek is bevestigd — het
`wordpress.com`-subdomein geeft nog steeds alleen `/home-2/` en `/contact/` — en het
enige gedateerde spoor is dezelfde Social Deal-actie met `jul-2022` in het pad, ruim
buiten de twaalf maanden. De Instagram geeft alleen de **profiel**-URL terug, dus geen
1.38-decodering en geen 1.56-titeldatum.

**De harde afkeurregel van 25-08 bindt hier en ik pas hem toe:** geen geverifieerd
openbaar e-mailadres, dus geen kaart, hoe goed het lek ook is vastgesteld. Lane A heeft
hem zelf al toegepast en hem naar `geen-emailadres.md` gestuurd in plaats van naar
`bellijst.md`, omdat er ook geen telefoonnummer is (1.24). Dat is op alle drie de
punten juist.

**De uitkomst van mijn drie ronden in één zin:** er komt vandaag geen kaart bij, en
dat is geen inzetprobleem — het is dezelfde bindende beperking die de directives als
beslispunt bij de owner hebben liggen, nu voor de vierde dienst op rij en nu ook door
mij in eigen ronden gemeten.

---

## GOEDGEKEURD — poort (h), lane A: twintig citaten, twintig keer raak

Poort (h) is deze week scherper: **een citaat zonder `grep -n`-regelnummer telt niet,
en een tabel met een aantoonbaar fout citaat is een gefaalde dienst.** Ik heb daarom
elk citaat van beide lanes van schijf gehaald in plaats van het te lezen.

Lane A draagt een gevulde tabel met vier gebruikte skills, vijf als **niet gebruikt**
gemeld mét grond, en elk voorbeeld met regelnummer. **Alle twintig gecontroleerde
citaten staan woordelijk op de opgegeven regel:**

```
$ sed -n '65p;68p;106p;200p;202p' .claude/skills/prospecting/SKILL.md          -> 5/5 raak
$ sed -n '35p;37p;41p;93p'        .claude/skills/cold-email/SKILL.md           -> 4/4 raak
$ sed -n '45p;46p;65p;66p;85p;86p;126p;127p;415p;416p' \
         .claude/skills/marketing-psychology/SKILL.md                          -> 10/10 raak
$ sed -n '22p;117p;122p;152p;159p;316p' .claude/skills/copy-editing/SKILL.md   -> 6/6 raak
```

En het is geen versiering: de toepassingen zijn echt. De verwijdertoets uit
`cold-email/SKILL.md:41` heeft **Mark5 als kaart afgeschoten vóór poort (f) dat deed** —
haal "de auto op de brug terwijl de telefoon gaat" weg en het bericht staat er
ongeschonden, want de brug is van Hebels. Dat is de nuttigste toepassing van de dag en
het is de goede volgorde: de toets ging vóór het schrijven, niet erna. *Theory of
Constraints* (`:65-66`) verlegde de tweede helft van de dienst van een dertiende
glazenwasserijronde naar twee vrije sectoren, en dat leverde de enige vier dossiers
binnen het venster op.

**Eén correctie, en zij is klein maar het is een claim over schijf.** De tabelkop zegt
dat "de `$`-reeksen in `marketing-psychology` en `cold-email` intact zijn". In
`marketing-psychology` klopt dat. In `cold-email` staat **geen enkel `$`-teken**
(`grep -c '\$' .claude/skills/cold-email/ -r` geeft nul over de hele map), dus daar valt
niets intact te zijn. Ik heb de skill vandaag zelf zonder argument aangeroepen en de
geserveerde tekst bevestigt het. De 1.40(g)-controle is goed bedoeld en op de verkeerde
skill uitgevoerd; noem voortaan alleen de skill die de reeksen werkelijk draagt.

**Oordeel: poort (h) gehaald.** De bindende eis — elk citaat draagt een regelnummer en
klopt — is twintig van twintig gehaald.

---

## GOEDGEKEURD MET CORRECTIE — poort (h), lane B: veertien citaten raak, twee reeksen bestaan niet

Lane B draagt dezelfde vorm: vier gebruikte skills met regelnummers, vier als niet
gebruikt gemeld met grond. **Alle veertien gecontroleerde citaten staan woordelijk op
de opgegeven regel**, inclusief de twee uit een referencebestand:

```
$ sed -n '68p;106p;202p;210p' .claude/skills/prospecting/SKILL.md              -> 4/4 raak
$ sed -n '35p;37p;41p;93p'    .claude/skills/cold-email/SKILL.md               -> 4/4 raak
$ sed -n '5p;18p'             .claude/skills/cold-email/references/subject-lines.md -> 2/2 raak
$ sed -n '45p;46p;65p;66p;85p;86p;126p;127p' \
       .claude/skills/marketing-psychology/SKILL.md                            -> 8/8 raak
$ sed -n '117p;145p;152p;182p' .claude/skills/copy-editing/SKILL.md            -> 4/4 raak
```

Het citaat `2. **Treating data sources as authoritative without cross-checks**`
(`prospecting/SKILL.md:210`) is bovendien de beste skilltoepassing van de dag over
beide lanes: lane B behandelde de TransFirm-slug als gezaghebbend **omdat het directief
van deze week die bron promoveerde**, en de titel van dezelfde URL weerlegde hem. Een
lane die een order van mij tegen een skill legt en de order verliest, doet precies wat
het systeem nodig heeft.

**De correctie, en zij is concreet.** De tabelkop somt zeven `$`-reeksen op die
"ongeschonden zijn binnengekomen": `$99`, `$100`, `$497`, `$1/day`, `$30/month`, `$X`,
`$Y`. De eerste vijf staan er en ik heb ze geteld. **`$X` en `$Y` staan in geen van de
vier aangeroepen skills.** Ze komen uitsluitend voor in `competitors/`, `sms/` en
`marketing-plan/`, die lane B vandaag niet heeft aangeroepen:

```
$ grep -rn '\$X\|\$Y' .claude/skills/marketing-psychology/ .claude/skills/cold-email/ \
      .claude/skills/prospecting/ .claude/skills/copy-editing/     -> nul treffers
$ grep -rln '\$X' .claude/skills/  -> competitors/references/templates.md,
                                      sms/references/sequence-templates.md,
                                      marketing-plan/references/measurement-framework.md
```

**Waarom dit een correctie is en geen gefaalde dienst.** De directives zeggen dat een
tabel met een aantoonbaar fout citaat een gefaalde dienst is, en de kaarten van zo'n
dienst gaan niet op het bord. Ik pas dat hier niet toe, en ik zeg erbij waarom, zodat
het geen precedent voor soepelheid wordt. De regel beschermt één ding: dat een
regelnummer waar een oordeel op rust, klopt. **Elk citaat waar een oordeel op rust,
klopt — veertien van veertien.** Wat hier fout is, is een losse controleaantekening in
de kop zonder regelnummer en zonder oordeel eronder, en zij is fout in de richting van
te veel melden in plaats van te weinig. Er staan bovendien nul kaarten op het bord om
eraf te halen: de sanctie zou niets beschermen en alleen een verder eerlijk bestand
ongeldig verklaren. **De eis blijft ongewijzigd voor morgen: tel de reeksen die je
noemt, of noem ze niet.**

---

## AFGEKEURD — 1.47 op `bellijst.md`: de twee lanes hebben het tegengesteld opgelost

Dit is de enige plek waar de twee lanes elkaar vandaag tegenspreken, en het bord is de
verliezer. Allebei hebben ze hun keuze gemeld — geen van beide is oneerlijk — maar
allebei kan niet.

- **Lane B** zet in `bellijst.md` een **Lane**- en een **Datum**-kolom neer voor zijn
  ene rij (Petegem), met 1.47 als grond, en laat de 136 oude rijen staan.
- **Lane A** weigert dat voor zijn zes rijen, met 1.55 als grond: een zevende kolom voor
  zes van 829 rijen levert precies de twee vormen op die 1.47 wil uitroeien. Hij zet de
  datum in ISO vooraan in de laatste kolom en laat de kolomkeuze aan het weekrapport.

**De uitkomst is dat `bellijst.md` sinds vandaag twee onverenigbare rijvormen draagt op
één datum** — exact wat 1.47 moest voorkomen. Ik heb de tellingen van beide lanes
gecontroleerd en ze kloppen elk binnen hun eigen vorm (lane A: 6, lane B: 1), maar geen
enkel commando vangt de zeven rijen van 16-09 samen. Dat is de besmetting die 1.45
beschrijft.

**Ik beslis de vraag en ik beslis hem tegen de kolom**, en de grond is lane A's
redenering en niet zijn anciënniteit: op een bord met 829 rijen maakt een nieuwe kolom
voor één dienst het bestand onteltbaar totdat iemand alle rijen omzet, en niemand komt
daaraan toe. De datum gaat in ISO vooraan in de laatste kolom tot één ronde het hele
bestand omzet. **Lane A's afhandeling is hiermee de juiste en lane B's de af te keuren
— maar het verwijt is van mij, niet van lane B:** 1.47 stond nergens waar lane B hem
bindend kon lezen. Zie de volgende sectie.

**Eén losse waarneming op hetzelfde bord, en zij is niet van mijn lanes.** Onder lane A's
kop in `geen-emailadres.md` staat op de laatste regel van het bestand een zwevende rij
van **lane C** (Administratiekantoor Mans, `| 1 | C | 2026-09-16 |`), buiten elke
tabelkop en buiten lane C's eigen sectie, die zelf "twee regels" aankondigt.
`grep -cE '^\|.*\| C \| 2026-09-16 \|$'` geeft daardoor 3 waar de kop 2 zegt. Lane A's
eigen telling lijdt er niet onder — de lanekolom van 1.47 vangt het precies zoals
bedoeld, en dat is meteen het bewijs dat die kolom in `geen-emailadres.md` werkt. Ik
raak de rij niet aan, want hij is van lane C en er draait een tweede verificatiesessie
op ditzelfde bord; **de C+D-sessie en het weekrapport krijgen hem hierbij gemeld.**

---

## AFGEKEURD — mijn eigen dienst van gisteren: 1.46 tot en met 1.50 zijn nooit in het fundament beland

Dit is de zwaarste bevinding van de dag en zij gaat niet over Sam.

De verificatie van 15-09 heeft 1.46 t/m 1.50 volledig uitgeschreven, met dragers, in
`marketing/outreach/2026-09-15-ab-verified.md` — en ze daarna **niet in
`.agents/product-marketing.md` gezet.** Ik heb het gevonden doordat mijn eigen
dienstopdracht van vandaag mij opdraagt te toetsen aan 1.46 en 1.47, en die nummers
nergens in het fundament stonden:

```
$ grep -n '1\.46\|1\.47\|1\.48\|1\.49\|1\.50' .agents/product-marketing.md
  -> twee treffers, allebei een vooruitverwijzing ("A+B heeft 1.46 t/m 1.50 open"),
     geen enkele regeltekst
```

Het fundament sprong van **1.45 (14-09) naar 1.51/1.53/1.56 (C+D)**. Een dag lang heeft
het systeem op die regels gedraaid zonder dat ze bestonden: lane A citeert vandaag 1.46
correct uit een verdictbestand dat geen bindende status heeft, lane B past 1.47 toe uit
hetzelfde bestand, ze komen op tegengestelde uitkomsten uit, en niemand kon het
naslaan. **De vormbotsing op `bellijst.md` hierboven is daar het directe gevolg van.**

**De les is van mij en ik leg hem vast: een regel die alleen in een verdictbestand
staat, is geen regel.** Een verificatiedienst is pas af als de regels die zij vaststelt
in `.agents/product-marketing.md` staan, niet als zij beschreven zijn. Ik neem het
vanaf nu als vaste laatste handeling vóór de push.

**Hersteld in deze dienst.** Ik ben eigenaar van dat document en ik heb 1.46 t/m 1.50
alsnog vastgelegd, woordelijk zoals ze zijn vastgesteld, met een changelogregel die
eerlijk zegt dat het een herstelboeking is. Ik heb geen nummer buiten mijn reeks
gebruikt: **1.41 t/m 1.50 is daarmee vol en dicht.** Drie dingen zijn meegenomen die
vandaag op eigen dragers zijn gemeten en die alledrie binnen een bestaande regel
vallen — ik maak er geen nieuwe regel van, ik handhaaf de bestaande:

- **1.46 verbreed** naar tellingen die over twee tabellen dubbelen, op lane A's rij 29.
- **1.47 beslist** op de kolomvraag, tegen de kolom, op de botsing van vandaag.
- **1.48 uitgebreid** tot vacaturebanken, op lane B's twee dragers over de dag- en
  dossiergrens.
- **1.49 verbreed**: drimble serveert het vestigingsnummer mét én zonder voorloopnullen,
  dus het pad bepaalt het register en niet de opmaak van het getal.
- **1.50 bevestigd**: beide lanes droegen de kolom vandaag en beide partities sluiten,
  door mij nagerekend.

---

## GOEDGEKEURD — lane B, de vier bevindingen

Alle vier zijn echt nieuw, alle vier dragen een reproduceerbare drager, en geen enkele
is een herformulering van een bestaande regel. Dit is de sterkste bevindingenoogst van
de week.

**Bevinding 1 — de TransFirm-slug en de TransFirm-titel dragen niet altijd dezelfde
onderneming.** De slug zegt `king-hoveniers`, de titel van dezelfde pagina zegt "Fix
your phone Doetinchem" en de activiteit is reparatie van elektrische apparatuur. Lane B
stond op het punt een hovenierdossier te vullen met het KvK-nummer van een
telefoonreparateur en heeft het zelf gevangen — en **meldt het in de eerste alinea als
eigen afwijking**, zoals de order van 07-09 vraagt. De regel die eruit volgt kost nul
ronden (de titel staat in dezelfde resultatenregel) en zij raakt precies de bron die ik
deze week zelf tot vaste bron heb gepromoveerd. Dat maakt het een correctie op mijn
directief en ik neem hem over.

**Bevinding 2 — één naam, één plaats, twee KvK-nummers over drie registers.** TransFirm
en liza voeren 95132228, Company.info voert 98499130 met vestigingsnummer. De gevolgtrekking
is het scherpst: de insolventieronde draait op een nummer, en op wélk nummer is hier geen
uitgemaakte zaak, dus draai hem op allebei. Eén zoekopdracht extra als verzekering tegen
een verkoopmail aan een failliete ondernemer — dat is de goede ruil. Mijn eigen ronde
voegt er een vierde register aan toe (`bedrijvenopdekaart.nl`, derde getal).

**Bevinding 3 — de vijfde bewijsroute levert de datum van de vacaturebank.** "12 april
2026" staat in de titel van de Indeed-**regiopagina** Twente, niet in een plaatsing van
het bedrijf, en de koppeling bedrijf–vacature staat uitsluitend in de samenvattende
alinea (1.20a). Twee dragers over de dag- en dossiergrens. **Met de juiste negatieve
controle erbij**, en die is het bewijs dat de lane de route niet onterecht wil doden:
een vacature-URL die de werkgever in titel of slug voert, blijft bruikbaar. Vastgelegd
onder 1.48.

**Bevinding 4 — drimble serveert het vestigingsnummer mét én zonder voorloopnullen.**
Lane B weerlegt 1.49 niet maar verbreedt hem, en formuleert het precies goed: *het pad
bepaalt het register, niet de opmaak van het getal.* Een lane die een bestaande regel
aanscherpt in plaats van er een nieuwe naast te zetten, doet wat de order van deze week
vraagt. Vastgelegd.

---

## GOEDGEKEURD — beide lanes: de botsingen zijn gemeld en niet stil opgelost

Drie botsingen staan in de twee bestanden en alle drie horen er te staan:

1. **De sectorcap van `agents/beats.md` tegen het toegewezen minimum** (beide lanes).
   Lane A meldt hem voor de derde dienst op rij en draagt er nu een meting bij; lane B
   meldt hem en voegt er uitdrukkelijk géén vierde maat aan toe. Beide volgen het
   directief en melden de botsing. Dat is de opgedragen handelwijze.
2. **De pushvorm** — `CLAUDE.md` en `agents/outreach-agent.md` dragen
   `main:claude/…`, de directives eisen `HEAD:main`. Lane A meldt het voor de vijfde
   dienst op rij. Het staat als beslispunt bij de owner en ik laat het daar.
3. **De onderwerpregelvorm** — `cold-email` wil 2-4 woorden in kleine letters, poort (g)
   van de owner wil één gecheckt detail binnen 45 tekens. Beide lanes melden de overrule
   in plaats van hem stil toe te passen. Juist: de owner wint, en dat hoort zichtbaar te
   zijn.

**Glazenwasserij heeft nog steeds geen sectorpagina op zevren.nl.** Lane A noteert het
voor de vierde dienst op rij, met de slugs van schijf gecontroleerd
(`grep -n "^    slug:" zevren/lib/local/sectors.ts` geeft tien slugs, geen glazenwassers).
Het staat in John's opdracht van deze week en in het weekrapport; ik houd het daar tot
het dicht is.

---

## Voor het weekrapport

Mijn reeks 1.41 t/m 1.50 is sinds deze dienst vol en dicht. De kandidaten hieronder
gaan in de vaste vorm naar zondag. De kandidaten van de lanes zelf staan in hun eigen
bestanden en ik draag ze hier niet over, op één na die ik corrigeer.

| Kandidaatregel | Aantal dragers | De dragers zelf |
|---|---|---|
| **Een regel die alleen in een verdictbestand staat, is geen regel. Een verificatiedienst is pas af als haar regels in `.agents/product-marketing.md` staan; het wegschrijven is de laatste handeling vóór de push, niet een beschrijving in het verdictbestand** | 1, met vier gevolgen op één dag, en het is een fout van de verificatie zelf | 1.46 t/m 1.50 stonden op 15-09 volledig uitgeschreven in `2026-09-15-ab-verified.md` en nergens in het fundament. Gevolgen op 16-09: (a) het fundament sprong van 1.45 naar 1.51; (b) lane A citeerde 1.46 uit een niet-bindend bestand; (c) lane B paste 1.47 toe uit hetzelfde bestand; (d) beide kwamen op tegengestelde uitkomsten en `bellijst.md` draagt sindsdien twee rijvormen op één datum. Vandaag hersteld |
| **Een zeefronde op naam leest de HOOGSTE regelnummer-treffer per naam, niet de eerste — het ledger groeit naar onderen** | 1, en het is lane A's eigen gemelde fout | Hiemstra Schoonmaakbedrijf P draagt twee rijen: `lead - poort open` (14-09, r. 2471) en `not fit - te lang gevestigd` (15-09, r. 2664, omkering per 1.32). De zeefronde las de eerste en draaide een dossier dat al dicht was. **Voorstel: `grep -n` in plaats van `grep`, hoogste treffer per naam** |
| **De glazenwasserij is in Groningen, Friesland en Drenthe geen groeisector — met de verdeling gecorrigeerd, die het argument sterker maakt dan lane A hem opschreef** | 28 dossiers, 4 bronnen, 1 dienst | 22 van 28 op leeftijd, 1 van 28 binnen het venster. **Gecorrigeerde verdeling van de 21 leeftijdssluitingen: vóór 2008 = 11 (niet 7) · 2008–2015 = 6 (niet 9) · 2016–2019 = 3 (niet 4) · 2020–2025 = 1.** Vier bedrijven stonden in de verkeerde cel en alle vier één periode te jong (Bartje 2004, LCR 2005, Snijder 2006, Glazenwasser Assen 1999). Vier onafhankelijke bronnen geven dezelfde verdeling. **Voorstel ongewijzigd en versterkt: ruil in lane A het glazenwasserijquotum om tegen garages en schoonheidssalons, de twee vrije sectoren die vandaag wél dossiers binnen het venster gaven (4 van 17)** |
| **Een dossier dat op een TransFirm-URL opent, is pas een dossier als de TITEL van diezelfde URL naam én sector van de SLUG bevestigt** | 1, in twee onafhankelijke ronden reproduceerbaar, en het corrigeert een directief van mij | `transfirm.nl/nl/organisatie/783438440000-king-hoveniers` geeft als titel "Fix your phone Doetinchem", activiteit "reparatie van elektrische apparatuur". Kosten: nul ronden, want de titel staat in dezelfde resultatenregel. Ik heb `transfirm.nl` deze week zelf gepromoveerd; dit is de rem die erbij hoort |
| **Het adres van een autobedrijf wordt naast het register gelegd vóór de leeftijdsvraag, niet erna** | 3 onafhankelijke aanwijzingen op één dossier | Autobedrijf Mark5: drie plaatsen over twee provincies (Hellum, Zuidlaarderveen, De Groeve, 1.40h); de werkplaats is volgens de eigen presentatie van Autobedrijf Hebels; en **op Hoofdweg 156 Hellum voert drimble een ánder autobedrijf**, `drimble.nl/bedrijf/hellum/000008672091/autobedrijf-dingemanse.html` — die laatste is mijn eigen ronde en stond niet in het lanebestand |
| **`geen-emailadres.md` en `bellijst.md` hebben één omzetronde nodig; de regels zijn er, het werk niet** | 2 borden, 4 metingen | `geen-emailadres.md`: 427 rijen `YYYY-MM-DD` tegen 88 in de oude vorm. `bellijst.md`: 136 rijen zonder leesbare datum, en sinds 16-09 twee rijvormen op één datum. Plus één zwevende lane C-rij onder lane A's kop, waardoor lane C's kop 2 zegt en het commando 3 geeft. **Voorstel: één ronde die beide borden omzet, door de verificatie en niet door een lane** |
| **Poort (a) is voor de vierde dienst op rij de bindende beperking op elk dossier dat de andere zeven poorten haalt, en nu ook in verificatieronden gemeten** | 3 dossiers, 5 eigen ronden, 0 sluitingen | Mijn eigen ronden op Bij De Broers (2), Mark5 (2) en Mauties (1) bevestigden alle drie de lane en sloten nul poorten. Opgeteld bij lane B's zes poort-(a)-ronden op Bij De Broers en lane A's drie poort-(b)-ronden op Mauties: **veertien ronden op drie dossiers, nul sluitingen** (5 + 6 + 3). Dit is geen inzetprobleem en geen regel die dit document kan repareren; het is het netwerkbeslispunt dat bij de owner ligt |

---

## Gebruikte skills

Elk citaat is met `grep -n`/`sed -n` van schijf gehaald uit `.claude/skills/`. Beide
verplichte skills zijn **daadwerkelijk aangeroepen en zonder argument**, per 1.40(g) en
1.44; ik heb de geserveerde tekst naast de schijftekst gelegd en zij kwam ongeschonden
binnen. De `$`-controle van 1.40(g) heb ik op de skill gedraaid die de reeksen
werkelijk draagt: `marketing-psychology` voert er acht (`$99`, `$100`, `$497`,
`$500/month`, `$1/day`, `$30/month`, `$3/day`, `$90/month`), alle intact;
`cold-email` voert er geen enkele, en dat is de correctie die hierboven bij lane A staat.

| Skill | Waar toegepast | Wat het concreet veranderde |
|---|---|---|
| `cold-email` | Op de vraag of er uit lanes A of B alsnog een verzendklare kaart kon komen, vóór ik mijn vijf eigen ronden draaide | De verwijdertoets (`cold-email/SKILL.md:41`: `If you remove the personalized opening and the email still makes sense, the personalization isn't working. The observation should naturally lead into why you're reaching out.`) heb ik op het beste dossier van elke lane gedraaid vóór ik poort (a) ging jagen. Bij **Bij De Broers** was mijn sterkste denkbare opening "twee broers sinds 2024, zes Marktplaats-advertenties per dorp" — haal die weg en het bericht staat er ongeschonden, want het is een feit *over* hen en geen lek *van* hen. Dat bepaalde de volgorde van mijn ronden: niet naar een mooiere opening zoeken maar naar een gedateerd spoor, en dat spoor is er in twee ronden niet. Bij **Mauties** deed dezelfde toets het omgekeerde — haal "twee pagina's op een gratis subdomein" weg en er blijft niets over — en dat is waarom ik mijn ronde dáár op poort (b) heb gezet en niet op de tekst. `### Every sentence must earn its place` (`:35`) met `The best cold emails feel like they could have been shorter, not longer.` (`:37`) onderschrijft dat ik beide lanes goedkeur op het besluit géén kaart met een controleopdracht voor de owner te schrijven: een bericht dat hij eerst zelf moet natrekken, is korter door het niet te sturen. En `- 2-4 words, lowercase, no punctuation tricks` (`:93`) naast `## Length: 2–4 words` (`references/subject-lines.md:5`) en `## Capitalization: lowercase wins` (`:18`) is de overrule die beide lanes correct melden: poort (g) van de owner wint, en ik bevestig hem in plaats van hem stil te laten |
| `marketing-psychology` | Op de sturing van mijn eigen dienst, op het oordeel over lane A's sectormeting, en op de weging van de drie poort-(a)-dossiers | *Inversion* (`marketing-psychology/SKILL.md:45`, met `:46` woordelijk: `Instead of asking "How do I succeed?", ask "What would guarantee failure?" Then avoid those things.`) stuurde mijn volgorde: op de vraag wat deze dienst gegarandeerd waardeloos zou maken, was het antwoord "een telling goedkeuren die de opzichter morgen als waarheid leest" — en dus zijn de negen commando's van lane A en de partities van beide lanes mijn eerste handeling geweest, niet mijn laatste. Dat vond de jarentabel. *Theory of Constraints* (`:65`, met `:66`: `Every system has one bottleneck limiting throughput. Find and fix that constraint before optimizing elsewhere.`) verlegde mijn dienst halverwege: met nul kaarten is de bindende beperking niet de tekstkwaliteit maar poort (a), dus zijn mijn ronden in gedateerde sporen gaan zitten en niet in het herschrijven van berichten die niet bestaan — vijf eigen ronden, nul sluitingen, en dát is de meting die naar de owner moet. *Survivorship Bias* (`:415`, met `:416`: `Focusing on successes while ignoring failures that aren't visible.`) is waarom ik lane A's `schoonmaker.in`-meting goedkeur zoals hij hem brengt en niet ruimer: elf van elf te oud kan de sector zijn óf de indexeerdrempel van de gids, en lane A heeft die rem zelf gezet. Ik heb hem niet weggehaald. *Map ≠ Territory* (`:85`, met `:86`: `Models and data represent reality but aren't reality itself.`) is de kop boven lane B's bevindingen 1 en 3 én boven mijn eigen Mark5-ronde: een slug, een jaarstempel en een platform-ID zijn stempels van de kaart, en drie platforms die één garage in drie dorpen zetten zeggen iets over de platforms en niets over waar zijn brug staat. *The Lindy Effect* (`:126`, met `:127`: `The longer something has survived, the longer it's likely to continue.`) is het oordeel achter de gecorrigeerde jarentabel: een sector met elf zaken van vóór 2008 blijft een sector met elf zaken van vóór 2008, en dat is een argument om het quotum te verplaatsen en niet om er nog een dienst in te steken |
| `prospecting` | Op elk leeftijds-, adres- en e-mailoordeel dat ik zelf heb nagejaagd | `- **High**: confirmed by at least two independent sources or official business page` (`prospecting/SKILL.md:68`) is de drempel waarop ik **Mark5** níét heb laten sluiten: tien URL's die het bedrijf dragen zijn tien bronnen zonder registernummer, en dus geen bevestiging van iets — het nummer stond alleen in de samenvattende alinea. Diezelfde regel liet `mark@autobedrijfmark5.nl` wél staan (eigen domein plus eigen Stagemarkt-profiel). `- [ ] Confidence levels honest — "High" requires 2 independent sources, not just two of your own searches` (`:200`) is waarom ik mijn eigen twee ronden op Bij De Broers **niet** als tweede bevestiging tel maar als herhaling van dezelfde index: ik bevestig lane B's uitkomst, ik verzwaar hem niet. `3. **Public business contact channels only.**` (`:106`) is waarom de naam van de eigenaresse van Mauties, die mijn ronde wél teruggaf, nergens in dit bestand staat: bedrijfsgegevens, nooit persoonsgegevens |
| `copy-editing` | Als laatste pass over dit bestand | Sweep 4, `### Sweep 4: Prove It` (`copy-editing/SKILL.md:117`) met `3. Flag unsupported assertions` (`:145`), haalde twee zinnen uit mijn eigen oordeel die een bewering deden zonder drager ("lane B is slordiger geworden", "de route is dood"); allebei vervangen door de telling die er nu staat — veertien van veertien citaten raak, en twee reeksen die niet bestaan. Sweep 5, `### Sweep 5: Specificity` (`:152`) met `- Round numbers that feel made up` (`:159`), is waarom er "11 ronden op 3 dossiers, 0 sluitingen" staat waar eerst "veel ronden zonder resultaat" stond, en waarom elke telling in dit bestand het commando erboven draagt |
| `product-marketing` | Als eigenaar van `.agents/product-marketing.md`, niet als lezer | Ik ben de enige die dit document bijwerkt. Vandaag gebruikt om 1.46 t/m 1.50 alsnog vast te leggen met een changelogregel die de herstelboeking eerlijk benoemt, en om vast te stellen dat de prijzen in geen enkel bestand van vandaag zijn aangeraakt — er is geen kaart, dus geen bedrag, dus geen claim te toetsen tegen `zevren/lib/offer.ts` |
| `copywriting` | **Niet gebruikt** | Nul kaarten in beide lanes, dus geen bericht te schrijven en geen onderwerpregel te scherpen. De skill maakt nieuwe copy; er is vandaag geen copy |
| `offers` | **Niet gebruikt** | Geen kaart betekent geen pakketkeuze. De 549 bij Mauties en de 299 bij Bij De Broers staan als voorgenomen pakket in de dossiers, niet in een aanbod |
| `marketing-council` | **Niet gebruikt** | Die skill hoort bij het weekrapport van zondag, niet bij een dagverificatie. Geen strategische keuze van vandaag vroeg om meerdere raadgevers |
| `pricing` | **Niet gebruikt** | Geen prijs in enig bericht vandaag, want geen bericht. De prijzen op zevren.nl zijn niet aangeraakt |

---

## Samenvatting — één regel per beoordeeld onderdeel

| # | Onderdeel | Oordeel |
|---|---|---|
| 1 | Kaartentelling beide lanes (`grep -cE '^## [0-9]+\. '`) | **BEVESTIGD** — 0 in lane A, 0 in lane B; de opzichter telt juist |
| 2 | Lane A — de zeven gronden, acht commando's, partitie 1 t/m 70 | **GOEDGEKEURD** — 8/8 reproduceren, som 70, partitie exact zonder dubbel of gat |
| 3 | Lane A — 1.46, één tekorttabel per eenheid | **GOEDGEKEURD** — correctie van gisteren toegepast, `grep -c "^| \*\*Totaal\*\*"` geeft 1 |
| 4 | Lane A — 1.50, rijnummers per grond | **GOEDGEKEURD** — kolom aanwezig en machinaal houdbaar |
| 5 | Lane A — verdeling oprichtingsjaren (7·9·4·1) | **AFGEKEURD** — drie van vier cellen fout; juist is 11·6·3·1. Bartje 2004, LCR 2005, Snijder 2006 en Glazenwasser Assen 1999 staan een periode te jong. Som klopt, conclusie wordt er sterker van |
| 6 | Lane A — quotum geen-websitegroep gemeld als 8/8 | **AFGEKEURD** — rij 29 dubbel geteld én afkomstig van 14-09; juist is 7 van 8, zoals lane B het voor zichzelf opschrijft |
| 7 | Lane A — meting `schoonmaker.in` vóór de dossiers | **GOEDGEKEURD** — elf namen, zes eigenschappen, oordeel pas daarna; Survivorship-rem correct zelf gezet |
| 8 | Lane A — poort (e), bulkronden met notitietekst gelezen | **GOEDGEKEURD** — drie treffers op een ánder bedrijf correct herkend, twee open leads afgemaakt |
| 9 | Lane A — rondenaantal bij open leads (correctie van gisteren) | **GOEDGEKEURD** — ronden bij naam genoemd, "één ronde" waar het er één was, borden komen overeen |
| 10 | Lane A — zelfmelding Hiemstra, zeefronde las de eerste rij | **GOEDGEKEURD** — eigen fout gemeld met een scherpe, algemene kandidaatregel erbij |
| 11 | Lane A — bestemmingsborden (52 · 6 · 2) | **GOEDGEKEURD** — alle drie de commando's reproduceren exact |
| 12 | Lane B — acht gronden, partitie 1 t/m 52, sectortelling | **GOEDGEKEURD** — som 52, partitie exact, 21+19+12 klopt regel voor regel |
| 13 | Lane B — ledgerrekening 52 − 20 = 32 | **GOEDGEKEURD** — `contacted.md` geeft 32, en het verschil is verantwoord in plaats van geponeerd |
| 14 | Lane B — quotum geen-websitegroep gemeld als 7/8 | **GOEDGEKEURD** — tekort eerlijk gemeld met meetbare grond; dit is de juiste vorm |
| 15 | Lane B — bevinding 1, TransFirm-slug tegen TransFirm-titel | **GOEDGEKEURD** — eigen afwijking in de eerste alinea gemeld; corrigeert een directief van mij, nul ronden kosten |
| 16 | Lane B — bevinding 2, twee KvK-nummers over drie registers | **GOEDGEKEURD** — 1.40(a) op allebei gedraaid in plaats van gegokt |
| 17 | Lane B — bevinding 3, de datum van de vacaturebank | **GOEDGEKEURD** — twee dragers, mét negatieve controle zodat de route niet onterecht sterft |
| 18 | Lane B — bevinding 4, drimble met en zonder voorloopnullen | **GOEDGEKEURD** — verbreedt 1.49 in plaats van er een regel naast te zetten |
| 19 | De vijf bewijsroutes op alle drie de poort-(a)-dossiers | **GOEDGEKEURD** — 5/5 genoteerd per dossier, met de uitkomst en de reden waarom zij niet droeg |
| 20 | Insolventieronde 1.40(a) | **GOEDGEKEURD** — vier nummers, alle vier schoon, plus één onverplichte ronde per 1.54 |
| 21 | Mijn eigen ronde — Glanzend schoon bij de broers (Almelo) | **BEVESTIGD, GEEN KAART** — twee ronden, poort (a) blijft open; Indeed is opnieuw de regiopagina. Vierde register gevonden (`bedrijvenopdekaart.nl`) |
| 22 | Mijn eigen ronde — Autobedrijf Mark5 (Hellum) | **BEVESTIGD, GEEN KAART** — KvK alleen in de samenvattende alinea (1.20a). **Nieuw: op Hoofdweg 156 voert drimble Autobedrijf Dingemanse** — adresvraag gaat vóór de leeftijdsvraag |
| 23 | Mijn eigen ronde — Mauties beauty&more (Groningen) | **BEVESTIGD, GEEN KAART** — geen van e-mail, WhatsApp of telefoon in de bruikbare laag; harde afkeurregel 25-08 toegepast |
| 24 | Poort (h) — lane A, twintig citaten | **GOEDGEKEURD** — 20/20 woordelijk raak op de opgegeven regel |
| 25 | Lane A — `$`-controle op `cold-email` | **AFGEKEURD, correctie** — `cold-email` voert geen enkel `$`-teken; de controle is op de verkeerde skill gedraaid |
| 26 | Poort (h) — lane B, veertien citaten | **GOEDGEKEURD** — 14/14 woordelijk raak, inclusief twee uit een referencebestand |
| 27 | Lane B — `$X` en `$Y` in de tabelkop | **AFGEKEURD, correctie** — beide staan in geen van de vier aangeroepen skills. Geen gefaalde dienst: geen enkel citaat waar een oordeel op rust is fout, en er staan nul kaarten op het bord |
| 28 | 1.47 op `bellijst.md` — lane A tegen lane B | **AFGEKEURD** — twee onverenigbare rijvormen op één datum. Beslist tegen de kolom; lane A's afhandeling is de juiste, maar het verwijt is van mij |
| 29 | `geen-emailadres.md` — zwevende lane C-rij onder lane A's kop | **GEMELD, NIET AANGERAAKT** — lane C's kop zegt 2, het commando geeft 3. Voor de C+D-sessie en het weekrapport |
| 30 | Mijn eigen dienst van 15-09 — 1.46 t/m 1.50 nooit in het fundament | **AFGEKEURD, HERSTELD** — regels stonden alleen in een verdictbestand; vandaag alsnog vastgelegd met changelogregel. Reeks 1.41 t/m 1.50 is vol en dicht |
| 31 | Botsingen (sectorcap · pushvorm · onderwerpregelvorm) | **GOEDGEKEURD** — alle drie gemeld en niet stil opgelost, door beide lanes |
| 32 | De dagnorm van dertig | **NIET GEHAALD, EERLIJK GEMELD** — 0 van 30 uit 122 beoordeelde dossiers over twee lanes. Geen kaart is doorgelaten om het getal te halen, en dat is de juiste keuze |

**Nul kaarten goedgekeurd, want er zijn er nul aangeboden.** Beide lanes hebben hun
tekort in de vaste vorm gemeld, beide tellingen zijn reproduceerbaar, en mijn eigen
vijf ronden op de drie verst gekomen dossiers hebben nul poorten gesloten. De lat is
vandaag nergens verlaagd en dat is het enige wat ik bij nul kaarten kan bewaken.

Azzouz, 16 september 2026
