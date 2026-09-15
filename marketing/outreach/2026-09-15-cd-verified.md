# Verificatie — dinsdag 15 september 2026 — lanes C en D

Azzouz, verificatiedienst C+D. Lanes A en B worden in `-ab-verified.md` door een
tweede sessie beoordeeld; ik heb die bestanden niet aangeraakt.

**Uitkomst in één zin: nul kaarten in beide lanes, en dat is terecht.** Geen van
beide lanes bood een kaart aan, en na eigen ronden op het dossier dat het dichtst
bij een kaart stond, bied ik er ook geen aan. Wat er wél ligt: twee reeksen
tellingen die vrijwel volledig reproduceren, één geijkte rekenregel die ik
zelfstandig heb nagerekend, en twee poortfouten die geld kunnen kosten.

## De kaarttelling, met het commando

```
$ grep -cE '^## [0-9]+\. ' marketing/outreach/2026-09-15-c.md   → 0
$ grep -cE '^## [0-9]+\. ' marketing/outreach/2026-09-15-d.md   → 0
```

De telling van de opzichter klopt: nul genummerde kaarten in lane C en nul in
lane D. Beide lanes melden het tekort in de vaste vorm van de directives en
beide doen dat eerlijk — geen van beide heeft een open poort als kaart vermomd,
wat het verbod van deze week is.

---

## GOEDGEKEURD — de tellingen van lane C reproduceren, op één samenvattende regel na

Ik heb elk commando dat lane C opschrijft zelf gedraaid.

| Bewering van lane C | Mijn commando | Uitkomst |
|---|---|---|
| 47 dossiers | `grep -c "2026-09-15 lane C" contacted.md` | **47** ✓ |
| Glazenwasserij 22 | `grep "2026-09-15 lane C" contacted.md \| grep -oE "Sector: [^·\|]*" \| sort \| uniq -c` | 15+2+2+2+1 = **22** ✓ |
| Hovenier 12 | idem | 10+1+1 = **12** ✓ |
| Garages 7 · hondensector 6 | idem | **7** en **6** ✓ |
| Zes rijen naar `geen-emailadres.md` | `grep -c "^\| .*\| C \| 2026-09-15 \|" geen-emailadres.md` | **6** ✓ |
| 13 zonder openbaar adres | ledgerstatus `not fit - geen openbaar e-mailadres` | **13** ✓ |

De tien sectorlabels tellen op tot 47 en de grondentabel doet dat ook
(14+13+10+3+3+2+1+1). Lane C's noot dat de ledgerstatus 8 geeft waar de
grondentabel 10 telt, klopt en is met de meetwijze erbij verantwoord — dat is
precies wat de vormregel van deze week vraagt.

**Twee correcties, allebei op een samenvattende regel en niet op het werk.**

1. **De slotregel "41 overige dossiers" is niet reproduceerbaar.** Eronder staat
   de opsomming 14 · 13 · 10 · 3 · 3 · 2 · 1, en die telt op tot **46**, niet
   tot 41. De oorzaak is zichtbaar: het zijn de rijen van de grondentabel min de
   ene (a)-rij, terwijl de zes bij naam genoemde dossiers al ín die gronden
   zitten. De grondentabel zelf is correct; alleen deze slotregel telt dubbel.
   Schrijf hem als "41 overige dossiers" zonder de opsomming, of als "de 47 min
   de zes hierboven genoemde".
2. **De regel "Totaal 40" in de sectorminimatabel volgt niet uit de vier rijen
   erboven** (15+10+3+2 = 30). De geen-websitegroep (8) en Vrij (2) zitten er
   stilzwijgend in. Lane C legt dat in de lopende tekst eronder wél uit, dus het
   is een vormfout en geen telfout — maar de vormregel van deze week zegt
   uitdrukkelijk dat een samenvattende telling uit de regels erboven
   reproduceerbaar moet zijn. Zet die twee als eigen rijen in de tabel.

## GOEDGEKEURD — de tellingen van lane D reproduceren volledig, inclusief de twee correcties van gisteren

| Bewering van lane D | Mijn commando | Uitkomst |
|---|---|---|
| 37 dossiers | `grep -c "2026-09-15 lane D" contacted.md` | **37** ✓ |
| Glazenwasserij 21 | `grep -c "Sector: glazenwas.*2026-09-15 lane D" contacted.md` | **21** ✓ |
| Hondensector 8 | `grep -c "Sector: hondentrimsalon.*2026-09-15 lane D" contacted.md` | **8** ✓ |
| Hovenier 8 | `grep -c "Sector: hovenier.*2026-09-15 lane D" contacted.md` | **8** ✓ |
| Omgekeerde volgorde geeft nul | `grep -c "2026-09-15 lane D.*Sector: glazenwas" contacted.md` | **0** ✓ |
| Bellijst 6 | `grep -c "2026-09-15 lane D" bellijst.md` | **6** ✓ |
| Oude grep faalt op `geen-emailadres.md` | `grep -c "2026-09-15 lane D" geen-emailadres.md` | **0** ✓ |
| Nieuwe kolomvorm werkt | `grep -c "\| D \| 2026-09-15 \|" geen-emailadres.md` | **3** ✓ |

21+8+8 = 37, met rij 37 eenmaal in de 21. **Alle acht reproduceren, inclusief
de twee negatieve controles.** Dat is de zwaarste vorm waarin een telling kan
binnenkomen: lane D noemt niet alleen het commando dat werkt maar ook het
commando dat faalt, en allebei doen bij mij wat hij zegt.

**De twee correcties van 14-09 zijn uitgevoerd.** De gesplitste telling staat er
in twee zinnen met twee tellingen (11 op leeftijd als uitspraak over de zaak, 23
met een registergetal uit een URL-pad als uitspraak over de bron), en de meetwijze
staat naast élk sectorgetal en niet alleen naast het totaal. Beide correcties
haal ik af.

## AFGEKEURD — 37 is onder de veertig, en de grond dekt maar een deel

De directives rekenen af op veertig volledig beoordeelde dossiers per lane. Lane D
levert er 37 en meldt dat eerlijk in de vaste vorm. De grond die hij geeft — de
hondensector bleef op 8 van 12 en het vrije quotum op 1 van 2 — is inhoudelijk
onderbouwd voor de hondensector (drie velpoorten die niets met inzet te maken
hebben: een klantenstop, een zaak die al via Salonized boekt, en een naamsverwarring
die 1.40(h) blootlegde). Voor het vrije quotum is de grond dunner: "de ronden die
daarheen zouden gaan, zijn in de hondensector gestoken" verklaart waar de tijd
bleef, maar niet waarom het resultaat drie dossiers onder de maat ligt.

**Waarom ik dit toch als tekort noteer en niet als gefaalde dienst:** lane C
beoordeelde er 47 in een regio die hij zelf als uitgeput heeft gemeten, dus de
veertig is haalbaar. Maar lane D's twee bronmetingen (de `kostenglazenwasser.nl`-
uitputting en de nul-overlap tussen venster-bron en bereikbaarheids-bron) zijn
werk dat dossiers heeft gekost en dat volgende week dossiers oplevert. Dat is de
goede ruil. **Order voor morgen: het vrije quotum vullen vóór er een tweede
bronmeting in gaat.**

---

## AFGEKEURD — Poseidon SoftWash staat op poort (a) open zonder de vijf toegewezen bewijsroutes

Dit is de zwaarste bevinding van mijn dienst en zij zit in lane C.

De directives zijn niet voor tweeërlei uitleg vatbaar: *"vóór een dossier op poort
(a) open mag blijven staan, zijn deze vijf routes gedraaid en staat per route in
één regel wat zij gaf."* De regel bindt **elk** dossier dat op poort (a) open
blijft staan, niet alleen de dossiers die de lane zelf kaartrijp noemt.

Lane C draaide de vijf routes voorbeeldig op Newfy & Co en op That's My Dog, met
per route één regel, en noemt dat in zijn uitvoeringstabel "de correctie van
gisteren" op Sportscar Service Tilburg. **Maar er staat een derde dossier op poort
(a) open en dat kreeg de vijf niet.** De ledgerrij (`contacted.md` r. 2737):

> Poseidon SoftWash · Eindhoven (NB) · `lead - poort open` · KvK 90272994,
> vestigingsnummer 000056012942, circa 2023, in het venster ·
> `info@poseidonsoftwash.nl`, eigen domein met eigen artikelen ·
> **Drie ronden op poort (a)** · de vacatureroute geeft een werkgeverspagina en
> een clubbericht, allebei zonder datum

Van de vijf toegewezen bewijssoorten is er precies één genoteerd (de vacature).
KvK-mutaties, vergunningen, inspecties en de SBB-erkenning ontbreken, en de
insolventieronde is niet gedraaid hoewel het KvK-nummer er is. Het is exact de
fout waarop ik lane C gisteren heb gecorrigeerd, één dossier verderop.

**En dit is het duurste dossier om te laten liggen**, want het is het enige van
de drie met een geverifieerd adres én een vastgestelde leeftijd in het venster.

### Mijn eigen ronde erop — drie routes, en poort (a) blijft dicht

Ik heb de ontbrekende routes zelf gedraaid in plaats van ze terug te leggen:

| Route | Commando | Uitkomst |
|---|---|---|
| Insolventieronde (1.40a) | `site:drimble.nl/faillissementen 90272994` | **SCHOON.** Geen faillissementsrecord op dit KvK-nummer; de treffers zijn andere zaken in andere provincies |
| SBB-erkenning | `Poseidon SoftWash Eindhoven stagemarkt.nl erkend leerbedrijf` | **NEGATIEF.** Geen stagemarkt-URL op naam; alleen generieke registerpagina's en hun eigen domein |
| Gedateerd eigen spoor | `"poseidonsoftwash.nl" 2026 project gevelreiniging Eindhoven` | **NEGATIEF.** Zeven eigen blog- en dienstpagina's, geen enkele met een datum in URL of titel |

**Oordeel: geen kaart, poort (a) blijft open na zes ronden.** De insolventieronde
is schoon en dat is winst — het dossier is veilig om op te parkeren. De andere twee
bevestigen wat acht diensten laten zien.

**Eén controle voor de owner, en zij is niet triviaal.** De samenvattende alinea
zegt "Poseidon SoftWash is gevestigd in **Hapert**" terwijl het ledger Eindhoven
en Koestraat 22 draagt. Die alinea is per 1.20(a) geen bron, dus ik stel er niets
mee vast — maar het is precies het plaatsverschil waar 1.40(h) voor bestaat, en
het staat nu genoteerd zodat het niet als vaststaand de volgende dienst in gaat.

## GOEDGEKEURD — Trimsalon Westeinde: de vijf routes staan er, en ik heb de ronde gedraaid die ontbrak

Lane D deed hier wat lane C bij Poseidon naliet: de vijf routes staan er met per
route één regel, routes 4 en 5 zijn vandaag voor het eerst gedraaid en allebei
negatief genoteerd. Poort (a) blijft open na zes ronden. Het voorstel om hem naast
Driemond en Sander van Os te parkeren neem ik over.

**Wat er ontbrak, en het is een gat in mijn eigen regel en niet lane D's fout.**
1.40(a) beperkt de insolventieronde tot *kaartrijpe* dossiers. Westeinde is niet
kaartrijp — poort (a) staat open — dus lane D's "nul kaartrijpe dossiers, dus nul
ronden" is letterlijk conform. Maar er ligt sinds 12-09 een **verzendklare tekst**
die de owner kan versturen, en daar beschermt geen enkele poort tegen. Ik heb de
ronde daarom zelf gedraaid:

```
site:drimble.nl/faillissementen 93410808 Trimsalon Westeinde Berkenwoude
→ SCHOON. Geen faillissementsrecord; de treffers zijn TransFirm, drimble,
  companyinfo, oozo, doggo, Instagram en haar eigen domein.
```

Dit gat wordt hieronder fundamentregel 1.54.

---

## GOEDGEKEURD — de 1.38-decodering is geijkt, en ik heb alle acht zelf nagerekend

Lane C bouwt hier een fundamentkandidaat op en lane D draagt er twee losse
metingen aan bij. Een rekenregel die een poort raakt, geloof ik niet — die reken
ik na. Ik heb de decoder zelf herbouwd (alfabet `A-Za-z0-9-_`,
`ts = (shortcode >> 23) + 1314220021721` ms) en elke shortcode uit beide bestanden
erdoor gehaald, vóór ik hun getallen naast de mijne legde:

| Shortcode | Mijn uitkomst | Bewering | Lane |
|---|---|---|---|
| `C-K-fcPo69M` | 2024-08-02 14:50 | 2 aug 2024 (staat zo in 1.38) | C |
| `DW1IMVUERGR` | 2026-04-07 12:16 | 7 apr 2026 12:16 | C |
| `DWqvFGpkURl` | 2026-04-03 11:24 | 3 apr 2026 11:24 | C |
| `DLOjticsUnM` | 2025-06-23 03:01 | 23 jun 2025 | C |
| `DSz8Q4ACPw4` | 2025-12-28 15:07 | 28 dec 2025 15:07 | C |
| `DScsDOSgqwN` | 2025-12-19 14:23 | 2025-12-19 14:23 UTC | D |
| `DbQ6VvOCtr5` | 2026-07-26 17:19 | 2026-07-26 17:19 UTC | D |
| LinkedIn `activity-7405535688051347456` (`>> 22`) | 2025-12-13 09:14 | 13 dec 2025 09:14 | C |

**Acht van de acht, tot op de minuut, over twee lanes en twee platforms.** Drie
ervan dragen een onafhankelijke controle die had kunnen falen: `C-K-fcPo69M`
reproduceert de datum die 1.38 zelf noemt, en de twee april-shortcodes
reproduceren de datum die in hun eigen titel staat. Dit is de best nagerekende
meting van de week.

**Wat lane C bij 1.38 goed heeft gezien.** In de titelvorm
`Photo by <naam> (@<handle>) · <datum>` is er geen decodering meer: de datum staat
leesbaar in de bruikbare laag. Rem 1 van 1.38 ("een decodering is rekenkunde en
geen bron, dus eis een semantische bevestiging") is dan niet versoepeld maar
**vervallen door de vorm** — er valt niets te bevestigen wat niet al gelezen is.
Rem 2 blijft onverkort staan, en lane C citeert 1.40(e) daarbij correct: de handle
in de titel van de post-URL bewijst de binding. Ik heb 1.40(e) nagelezen
(`product-marketing.md` r. 741) en de lezing klopt woordelijk.

**Waar ik lane C corrigeer, en het kost hem de route niet.** De meetregel van de
directives voor een nieuwe route is hard: *"draai de route op tien namen, noteer
in één regel wat zij aan leeftijd, adres en gedateerd spoor teruggeeft, en pas dán
vullen de dossiers zich ermee."* Twee gevonden titels plus twee nulronden is geen
meting op tien namen. **Lane C heeft er dan ook geen dossier mee gevuld** en
concludeert zelf dat het een bewijsroute is en geen jaagroute — precies de
tweede-orde-rem van 1.38. Dat is de juiste terughoudendheid en ik keur hem er
uitdrukkelijk op goed. Maar de route mag pas dossiers vullen nadat de meting op
tien namen is gedraaid, en dat is zij niet.

## GOEDGEKEURD — de Instagram-post die bij niemand hoort, en de LinkedIn-activity

Twee bevindingen waarin een lane bewijs weggooit dat hij had kunnen gebruiken.

Lane C vond `instagram.com/p/DSz8Q4ACPw4/` met de titel *"Vanaf 1 januari 2026 zijn
onze Trimtarieven verhoogd"*. De shortcode decodeert bij mij naar **28 december
2025, 15:07** — vier dagen vóór de aangekondigde datum, in de goede richting. Dat
is rem 1 van 1.38 in haar sterkste vorm. Lane C keurt hem af op rem 2: drie ronden
geven het account niet terug, en zonder vastgesteld bedrijf is een datum geen
levensteken van een prospect. **Dat is de juiste uitkomst** en het is de scherpste
illustratie van de bindende beperking die ik in acht diensten heb gelezen.

Dezelfde discipline bij de LinkedIn-activity: de decodering klopt (ik reken 13
december 2025, 09:14), de post draagt de paginatitel van Newfy & Co woordelijk, en
lane C sluit poort (a) er tóch niet mee omdat het account op *Maaike* van Santvoort
staat terwijl het Instagram-account van de zaak op *Peggy* staat. Dezelfde
achternaam is geen vastgestelde binding — dat is 1.53 en 1.38 rem 2 correct
toegepast tegen het eigen belang in.

## GOEDGEKEURD — de KvK-band, de dubbele registratie en de 1.13-meting in garages

Drie metingen van lane C die ik nareken op vorm en die alle drie staan.

**De KvK-band uit het ledger** (78M als ondergrens van het groeifaseprofiel) is een
afgeleide en geen register, en lane C zegt dat er zelf bij: zij ordent kandidaten
en sluit geen poort. De twee randgevallen (van Otten 73534129, Huberts 73970867)
zijn uitdrukkelijk afgewezen "op een geschatte leeftijd, niet op een vastgestelde"
en zo genoteerd. **Dat is de eerlijkste vorm waarin een schatting een dienst in
kan komen.** Dat de band aan de onderkant net zo hard velt (drie dossiers in de
95-97M-band) is de helft van het profiel die in de praktijk wordt vergeten, en zij
staat hier terecht.

**Glazenwasser Rene = Glazenwassersbedrijf Potters** op KvK 88183688 en op één
oozo-record-ID (`2805660`) onder twee wijken en twee namen. Lane C trekt er de
goede conclusie uit: de ledgerronde moet ook op KvK-nummer draaien, want een
*verschillende* naam scheidt niet als het nummer hetzelfde is. Dat is de spiegel
van 1.53 en het is een echte poort-(e)-val. De opmerking erbij is de waardevolste:
was Rene op zijn oozo-record als geen-websitegeval ingeboekt, dan had het bericht
een zaak verteld dat zij geen site heeft terwijl Potters een eigen domein voert —
en dat is precies de harde afkeurregel van 25-08 in werking.

**1.13 in garages: nul bedrijfsniveau**, en de diagnose is scherper dan de meting.
Niet de cao velt de route maar het wóórd: "garage" en "tarief per 1 januari" zijn
in het Nederlandse indexeringsnieuws bezet door parkeergarages en cao-loontabellen.
Dat voorspelt hetzelfde gedrag bij elke sector wier vakterm met een
overheidsonderwerp samenvalt, en dat is bruikbaarder dan de nulmeting zelf.

## GOEDGEKEURD — lane D's twee bronmetingen, en de duurste afwijzing

**`kostenglazenwasser.nl` is voor lane D uitgeput**, en lane D toont het in plaats
van het te beweren: zes adressen uit URL-titels, waarvan vier al in het ledger, alle
vier door lane D zelf gezet, met datum en status per rij. Netto nul bruikbare
adressen op zes vondsten. **Zijn voorstel neem ik over**: in de lane-D-regio
afwaarderen van e-mailbron naar belnummerbron — de titelroute voor telefoon levert
daar wél (zes nummers vandaag).

**Contrast Glazenwasserij** is de bevinding die het meeste waard is. Poort (b) gaat
dicht op zeven eigen pagina's uit één exacte-tekenreeksronde — de hardste vorm die
dit fundament kent — en precies díe zeven pagina's vellen het dossier op *lek
bestaat niet*. Lane D trekt er de goede regel uit: de poort die een dossier redt,
is dezelfde poort die het velt. Ik neem hem hieronder niet op als fundamentregel,
en de grond staat bij `## Voor het weekrapport`.

## AFGEKEURD — de herkomstnotatie in `bellijst.md` staat in twee onverenigbare vormen, en één lane telt zonder commando

Lane C schrijft: *"zeven belregels en zes parkeerregels vandaag"*, zonder commando.
Ik heb het nageteld en het **klopt** — de zeven rijen staan er (`bellijst.md`
r. 789-795: Ster Glazenwasserij De, Ribaldus, ERA Boomverzorging, Henselmans, Van
Bokhoven, Timmers, Bruggen). Maar het standaardcommando vindt ze niet:

```
$ grep -c "2026-09-15 lane C" marketing/outreach/bellijst.md
0
```

De reden is de notatie. Lane C schrijft de herkomst als `(lane C, 15-09)`, lanes B
en D als `2026-09-15 lane B` respectievelijk `... lane D`. Op één dag:

```
$ grep -E '^\|' bellijst.md | grep -oE '(2026-09-15 lane [A-D]|\(lane [A-D], 15-09\))' | sort | uniq -c
      1 (lane A, 15-09)
      7 (lane C, 15-09)
      6 2026-09-15 lane B
      6 2026-09-15 lane D
```

**Twintig rijen van vandaag in twee onverenigbare vormen, en geen enkel commando
vangt ze alle twintig.** `grep -c "2026-09-15"` geeft 13, `grep -c "15-09"` geeft 11.
Wie de bellijst van een dag wil tellen, telt structureel verkeerd. Dat is dezelfde
klasse fout die lane D vandaag zélf in `geen-emailadres.md` opspoorde en netjes
meldde — maar daar was de oorzaak een order van mij, en hier is het een lane die
zijn eigen vorm koos. Dit wordt fundamentregel 1.55.

**Wat lane C moet corrigeren:** de zeven rijen in `bellijst.md` omzetten naar
`2026-09-15 lane C` en zijn telling voortaan mét commando opschrijven. De rijen
zelf zijn inhoudelijk in orde en blijven staan.

---

## GOEDGEKEURD — poort (h), en ik heb alle eenentwintig citaten van schijf getoetst

De extra poort van deze dienst: elk citaat draagt een `grep -n`-regelnummer en dat
nummer moet kloppen. Ik heb elk cijfer uit beide tabellen opgehaald met `sed -n
'Np'` uit `.claude/skills/<skill>/SKILL.md`:

| Skill | Getoetste regels | Uitkomst |
|---|---|---|
| `prospecting` | 68, 106, 200, 202 | **4/4 woordelijk correct** |
| `cold-email` | 37, 41, 91, 93 | **4/4 woordelijk correct** |
| `marketing-psychology` | 65, 106, 262, 263, 415 | **5/5 woordelijk correct** |
| `copy-editing` | 37, 117, 122, 137, 145, 152, 159, 182 | **8/8 woordelijk correct** |

**Eenentwintig van eenentwintig.** Geen enkel verzonnen regelnummer, geen enkel
citaat dat van zijn regel afwijkt. De `$N`-val van 1.40(g) heeft niemand te pakken
gekregen; beide lanes riepen met een kort argument aan (`sources`, `subjects`,
`loss`, `sweep`, `hondentrimsalons`, `glazenwasser`).

Beide tabellen zijn ook inhoudelijk gevuld en niet hol. Lane D's `copy-editing`-rij
is de sterkste van de twee: hij noemt **vier getallen die de skill vóór het pushen
heeft gecorrigeerd** (11 naast 19 werd 23, de terminale telling 20 → 17, de
bindende poort 24 → 17, en "meer dan 37" → exact 37), plus een nul die na
hercontrole een 1 bleek (de bronoverlap). Dat is een skill die aantoonbaar iets
heeft veranderd in plaats van een skill die is aangeroepen. Lane C's `cold-email`-rij
doet hetzelfde met een gedode kandidaat-subject en een geschrapte zin.

**Eén correctie, aan lane C.** Lane D schrijft boven zijn tabel dat elk citaat met
`grep -n` van schijf is gehaald; lane C schrijft dat niet. Zijn citaten kloppen alle
dertien, dus het is geen gefaalde dienst — maar de poort van deze week vraagt de
herkomstregel expliciet. Zet hem erboven.

## GOEDGEKEURD — de klaargelegde tekst voor Newfy & Co, met één correctie

Dit is geen kaart en lane C biedt hem ook niet zo aan — poort (a) en poort (f)
staan open, en een kaart op een open poort is deze week uitdrukkelijk verboden. Ik
beoordeel hem daarom niet als kaart maar op wat hij is: een tekst die klaarligt
voor de dag dat de poorten sluiten. Ik heb hem volledig nagelopen omdat een tekst
die maanden blijft liggen, ongecontroleerd de deur uit gaat.

**Elke claim is gedekt, en ik heb elk regelnummer nagekeken:**

| Claim | Bron | Nagekeken |
|---|---|---|
| Sectorpagina `hondentrimsalons` bestaat | `zevren/lib/local/sectors.ts` r. **68** | ✓ |
| `planKey: "business"` · `demoSlug` · `demoName` | r. **71, 72, 73** | ✓ |
| "een behandeling, een moment en een bevestiging" | r. **77**, `proof` van díe pagina, woordelijk | ✓ eigen belofte, niets geleend (1.40b) |
| "ook 's avonds" buiten openingstijden | r. **87**, FAQ van díe pagina | ✓ |
| 549 euro eenmalig, exclusief btw | `zevren/lib/offer.ts` r. **23** | ✓ |
| UTM-slug `hondentrimsalons-w38` | slug woordelijk (1.25); 15-09-2026 is ISO-week **38** | ✓ |
| Route `/website-voor/` bestaat | `zevren/app/website-voor` | ✓ |

**De vormpoorten:**

- **Onderwerp: 40 tekens**, `printf '%s' "..." | LC_ALL=C.UTF-8 wc -m` → **40** ✓,
  binnen de 45 en met het gecheckte detail vooraan. 1.51 correct toegepast.
- **Bericht: 185 woorden** ✓, binnen 160-220.
- **Handtekening**: het blok staat er exact, mét 06-30958710 ✓. Geen correctie nodig.
- **Drie kandidaat-subjects** met de keuzeregel erbij ✓ — en de twee afvallers zijn
  om de goede redenen gevallen. Ik heb ze alle drie gemeten: alle drie 40 tekens,
  dus de keuze ging op kracht en niet op lengte. "Repelaerstraat, en de telefoon
  gaat door" is terecht gedood op valse vertrouwelijkheid; dat is de owner-regel
  van 24-08 letterlijk.

**De zeven eisen van de staande order van 25-08, mijn oordeel per stuk:**

| Eis | Oordeel |
|---|---|
| Lek in geld of tijd | ✓ "belt de volgende salon" — een klant die weggaat, geen ontbrekende functie |
| Bewijs uit zijn eigen zaak | ✓ haar eigen paginatitel over grote honden |
| Eén concreet beeld | ✓ twee handen in een natte vacht terwijl de telefoon gaat, doorgevoerd |
| De demo is de bewijslast | ✓ één keer, met een concrete uitnodiging |
| Prijs zonder verontschuldiging | ✓ "kost 549 euro eenmalig, exclusief btw" |
| Geen schaarste | ✓ niets van dien aard |
| 160-220 woorden | ✓ 185 |

**Waar hij het sterkst is**, en dat is de reden dat ik hem ongewijzigd laat: de
tweede alinea draagt het verlies én de verklaring waarom zij het nooit gemerkt
heeft ("Er is niets gebeurd dat je kunt zien"). Zonder die tweede helft is
verliesframing een verwijt; mét die helft is het een vaststelling die de lezer
zelf al vermoedde. Dat is Loss Aversion goed toegepast in plaats van hard
toegepast.

**De correctie, en zij is klein maar hij gaat de deur uit.** De ondernemerscontrole
noemt twee dingen. Er hoort een derde bij, en het is de duurste: **de
insolventieronde is op dit dossier niet te draaien** omdat de zaak niet in
`transfirm.nl` staat en er dus geen KvK-nummer is. Lane C noteert dat correct als
open in zijn poortlijst, maar het staat níét in de ondernemerscontrole — en dat is
het lijstje dat de owner leest vlak vóór verzenden. Zet het erbij, in deze vorm:

```
3. Deze zaak heeft geen KvK-nummer in de bruikbare laag, dus de insolventieronde
   is nooit gedraaid. Controleer vóór verzenden zelf of de zaak nog draait.
```

## AFGEKEURD — That's My Dog krijgt terecht geen tekst, en dat is de goede afkeuring

Lane C weigert hier een leeftijd te gebruiken die alle rondes noemen ("opende in
2024", "gecertificeerd trimmer sinds 2023") omdat zij uitsluitend in de
samenvattende alinea staat, en die is per 1.20(a) geen bron. Drie keer dezelfde
zoekopdracht op dezelfde alinea is één bron en geen drie — lane C citeert
`prospecting` r. 200 daar exact voor.

**Hij had die leeftijd kunnen gebruiken en het dossier was dan precies in het
venster gevallen.** Hij deed het niet, en hij legt er bovendien géén tekst bij neer
met het argument dat een dossier met twee open poorten niet "één ronde van een kaart
af staat". Dat is mijn correctie van gisteren op Sportscar Service Tilburg, vooraf
en tegen het eigen belang in toegepast. **Dit is de beste beslissing in beide
bestanden** en ik noteer hem als zodanig: de afkeuring is de prestatie, niet het
gebrek.

---

## De twee botsingen die beide lanes melden

Beide lanes melden dezelfde twee en ik bevestig ze allebei.

1. **De pushvorm.** `CLAUDE.md` en `agents/outreach-agent.md` schrijven
   `git push origin main:claude/…`; de directives eisen `HEAD:main`. De lanes
   volgen de directives en melden het — correct, en het is de vierde dienst op rij.
   Het is een beslispunt bij de owner en het zijn zijn bestanden; ik wijzig ze niet.
2. **De sectorcap van `agents/beats.md`.** Geen sector die in zeven dagen al drie
   keer voorkwam, tegen een toegewezen minimum van vijftien respectievelijk twaalf
   glazenwasserij. Beide lanes volgen de directives en melden de botsing, zoals de
   order voorschrijft. **Lane C's aantekening erbij is de waardevolste van de twee**:
   van zijn twintig glazenwasserijdossiers viel er niet één door naar een kaart, en
   de regio geeft op de twee toegestane bronnen vrijwel alleen namen terug die al in
   het ledger staan of tien jaar oud zijn. De cap beschrijft de werkelijkheid dus
   beter dan mijn sectorplan. **Ik neem lane D's voorstel over om het
   hondensectorquotum voor lane D opnieuw te wegen** — op dezelfde grond waarop lane
   C het zijne van vijf naar twee kwijtraakte — en zet beide in het weekrapport.

---

## Wat ik in het fundament vastleg — 1.54, 1.55 en 1.56

Mijn reeks is 1.51 t/m 1.60 en stond op 1.53. Ik neem er **drie** en laat 1.57 t/m
1.60 vrij, op dezelfde grond als bij 1.53: een reeks in één dienst leegtrekken is
even duur als een reeks die te krap is, en de week loopt tot en met zondag.

**1.54 — De insolventieronde bindt elke tekst die voor de owner wordt geparkeerd,
niet alleen een kaartrijp dossier.** 1.40(a) beperkt de ronde tot kaartrijpe
dossiers, en dat gat is vandaag zichtbaar geworden: er liggen verzendklare teksten
op `geparkeerd - tekst klaar, owner-controle poort (a)` die de owner morgen kan
versturen en waarop de ronde nooit is gedraaid. Dragers: `grep "geparkeerd - tekst
klaar" contacted.md` geeft vijf rijen en **nul** ervan draagt een insolventieronde,
terwijl drie ervan een KvK-nummer dragen waarop zij te draaien was (Bubbels
80672612, JR Hoveniers 89575946, Heenck 90416619); Westeinde (93410808) stond
vandaag op het punt de zesde te worden. Positieve controle van mijzelf: ik heb de
ronde op Westeinde en op Poseidon (90272994) gedraaid en allebei kwamen schoon
terug, dus de regel is uitvoerbaar en kost één zoekopdracht. Waar de ronde niet te
draaien is omdat er geen KvK-nummer is, staat dat in de **ondernemerscontrole** van
de tekst en niet alleen in de poortlijst — een parkering duurt weken en de
poortlijst leest niemand vlak voor verzenden.

**1.55 — Eén herkomstvorm per bestand, en een telling zonder commando telt niet.**
De herkomst van een rij staat in `bellijst.md`, `contacted.md` en
`geen-emailadres.md` in de vorm die dat bestand voert, en een lane die een aantal
rapporteert, noemt het commando. Dragers: twintig bellijst-rijen van 15-09 in twee
onverenigbare vormen (lanes A en C schrijven `(lane X, 15-09)`, lanes B en D
`2026-09-15 lane X`), waardoor geen enkel commando ze alle twintig vangt —
`grep -c "2026-09-15"` geeft 13 en `grep -c "15-09"` geeft 11; plus lane D's eigen
meting dat de kolomvorm in `geen-emailadres.md` de oude grep op nul zet. **De
tweede helft van de regel is de belangrijkste**: lane C's telling van zeven
belregels wás juist en bleek alleen juist doordat ik hem met de hand natelde. Een
telling die alleen met de hand te controleren is, is geen telling.

**1.56 — Draagt de post-titel de datum leesbaar, dan vervalt rem 1 van 1.38 door de
vorm; rem 2 en 1.40(e) blijven onverkort.** In de titelvorm `Photo by <naam>
(@<handle>) · <datum>` staat de datum in de bruikbare laag en is er geen
decodering, dus de semantische bevestiging die rem 1 eist, heeft geen voorwerp
meer. De binding tussen account en bedrijf blijft vereist en wordt bewezen zoals
1.40(e) zegt: de handle in de titel van de post-URL. Dragers: acht decoderingen
over twee lanes en twee platforms, door mij zelfstandig nagerekend vóór ik de
lanegetallen las, waarvan drie met een onafhankelijke controle die had kunnen falen
(`C-K-fcPo69M` reproduceert de datum in 1.38 zelf; `DW1IMVUERGR` en `DWqvFGpkURl`
reproduceren de datum in hun eigen titel). **Met de rem die lane C er zelf op zet
en die ik overneem:** dit is een bewijsroute en geen jaagroute — zij mag pas
dossiers vullen nadat de meetregel van de directives is gedraaid (tien namen), en
dat is vandaag niet gebeurd.

---

## Voor het weekrapport

Kandidaten die ik bewust niet in het fundament zet, met tekst, aantal dragers en de
dragers zelf.

| Kandidaatregel | Dragers | De dragers zelf |
|---|---|---|
| De rijkdom van een exacte-tekenreeksronde voorspelt dat het lek niet bestaat: geeft zij drie of meer eigen pagina's van hetzelfde domein terug, dan is poort (b) dicht én is het lek vrijwel zeker afwezig — noteer het als één uitkomst en niet als twee | 3 | Contrast Glazenwasserij (zeven eigen pagina's), Glazenwasserij JSL (vier dienstpagina's), Vachtwellness (vier eigen pagina's); lane D zocht een tegenvoorbeeld in zijn 37 en vond het niet. **Mijn grond om te wachten:** drie dragers uit één lane op één dag, en de regel raakt poort (b) — de duurste poort om te versoepelen |
| De venster-bron en de bereikbaarheids-bron overlappen niet: `transfirm.nl` levert leeftijd en nooit een adres, `kostenglazenwasser.nl` een adres en nooit een leeftijd | 27 | 21 TransFirm-dossiers met registergetal en nul adressen tegenover 6 kostenglazenwasser-dossiers met adres en nul registergetallen; overlap 1 van 37 (JSL), en juist die viel op beide poorten. **Grond om te wachten:** hij raakt de jaagvolgorde van 1.20(b) en 1.19 wijst dat naar het weekrapport |
| De ledgerronde moet ook op KvK-nummer draaien: één registratie kan onder twee handelsnamen in twee gidsen staan | 2 | KvK 88183688 draagt "Glazenwasser Rene" (transfirm) én "Glazenwassersbedrijf Potters" (al in het ledger); oozo voert beide namen onder record-ID `2805660`, in twee verschillende wijken |
| 1.13 faalt ook waar geen cao geldt, zodra de vakterm met een overheidsonderwerp samenvalt | 1 | "garage" + "tarief per 1 januari" vult zich met parkeertarieven (Maastricht, CVDR) en FNV-loontabellen; nul bedrijfsniveau in lane C |
| De KvK-band uit het ledger (78M als ondergrens van het groeifaseprofiel) ordent kandidaten in nul extra ronden en velt aan de onderkant net zo hard als aan de bovenkant | 47 | Lane C's volledige dienst: 14 te oud onder de band, 3 te jong boven 95M, 2 randgevallen op de band afgewezen (73534129, 73970867) |
| Een LinkedIn-activity-ID decodeert met `id >> 22` naar ms sinds epoch | 2 | `activity-7405535688051347456` → 13 dec 2025 09:14, door lane C gemeten en door mij zelfstandig gereproduceerd |
| `kostenglazenwasser.nl` in de lane-D-regio afwaarderen van e-mailbron naar belnummerbron | 6 | Zes adressen uit URL-titels, vier al in het ledger en terminaal, twee overgebleven en allebei gevallen; dezelfde bron leverde wél zes telefoonnummers |
| Het hondensectorquotum van 12 voor lane D opnieuw wegen | 3 | Klantenstop bij Poms In Style, Britt's Trimsalon boekt al via Salonized, Roxy's viel op een naamsverwarring; lane C raakte zijn eigen hondensectorquotum op vergelijkbaar bewijs kwijt |
| De sectorcap van `agents/beats.md` botst met het sectorplan en beschrijft de werkelijkheid beter | 20 | Lane C's twintig glazenwasserijdossiers, nul kaarten, vrijwel alleen namen die al in het ledger staan of tien jaar oud zijn |

---

## Gebruikte skills

Elk citaat is met `sed -n 'Np'` van schijf gehaald uit
`/home/user/personalcommandguide/.claude/skills/<skill>/SKILL.md`. Beide skills zijn
met een kort argument van één woord aangeroepen (`subjects`, `loss`), zodat de
`$N`-substitutie van 1.40(g) geen citaat kan vervuilen.

| Skill | Waar toegepast | Wat het concreet veranderde |
|---|---|---|
| `cold-email` | Op lane C's drie kandidaat-subjects en op de vraag of ik lane D's beslissing om géén tekst te schrijven moest terugdraaien | `If you remove the personalized opening and the email still makes sense, the personalization isn't working.` (`cold-email/SKILL.md:41`) is de toets waarmee ik lane C's keuze heb nagelopen in plaats van geloofd: haal "grote honden" uit de gekozen regel en er blijft niets over, haal het uit `Wie grote honden trimt, mist de telefoon` en er staat een regel die op elke salon past — lane C's motivering houdt dus stand en ik laat het subject ongewijzigd. Dezelfde regel bevestigt **lane D's weigering om bij Studio Vacht een tekst te schrijven**: het enige gecheckte detail daar is haar e-mailadres en haar `/contact-1`-pad, en een opener daarop is precies de opener die je kunt weghalen. Ik had die weigering kunnen terugdraaien en doe het niet. `Short, boring, internal-looking. The subject line's only job is to get the email opened — not to sell.` (`:91`) met `- 2-4 words, lowercase, no punctuation tricks` (`:93`) **botst frontaal met poort (g) van de owner**, die een gecheckt detail binnen 45 tekens eist; ik beslecht die botsing zoals op 14-09 — de owner wint, de skill verliest, en de botsing blijft genoteerd zodat zij niet elke dienst opnieuw wordt uitgevochten. `The best cold emails feel like they could have been shorter, not longer.` (`:37`) heeft mij bij mijn eigen correctie op de ondernemerscontrole van drie zinnen naar één geduwd |
| `marketing-psychology` | Op mijn oordeel over lane C's tweede alinea, en op de volgorde waarin ik mijn eigen ronden heb gestoken | `Losses feel roughly twice as painful as equivalent gains feel good.` (`marketing-psychology/SKILL.md:263`, onder **Loss Aversion / Prospect Theory** op `:262`) is de maat waarop ik de Newfy-tekst ongewijzigd laat: de tweede alinea draagt het verlies én de verklaring waarom zij het nooit gemerkt heeft, en zonder die tweede helft is verliesframing een verwijt. Diezelfde regel is de grond onder **1.54**: een verkoopmail aan een failliete ondernemer kost de owner veelvoudig wat een extra kaart oplevert, dus een ronde van één zoekopdracht die dat voorkomt, is een eenzijdige kost. `### Theory of Constraints` (`:65`) heeft mijn dienst gestuurd: ik heb mijn drie eigen zoekronden niet over 84 dossiers verdeeld maar uitsluitend in het enige dossier gestoken dat een geverifieerd adres én een leeftijd in het venster draagt (Poseidon SoftWash), plus de twee insolventierondes die de owner beschermen. `### Fundamental Attribution Error` (`:106`) heeft mijn eerste oordeel over lane D omgedraaid: mijn reflex was "37 is onder de maat, dat is inzet" — een uitspraak over de lane — terwijl zijn eigen meting laat zien dat twee bronnen elkaar nul keer overlappen, wat een uitspraak is over het proces. Daarom staat er hierboven een tekortnotitie met een order voor morgen en geen gefaalde dienst. `### Survivorship Bias` (`:415`) heb ik tegen **mijn eigen 1.56** ingezet: dat acht decoderingen kloppen, kan ook betekenen dat ik alleen de shortcodes zie die een lane de moeite waard vond op te schrijven — daarom staat 1.56 op wat ik heb nagerekend, mét de rem dat het een bewijsroute is en geen jaagroute, en niet op een schatting van hoe vaak die titelvorm voorkomt |
| `prospecting` | Op poort (b) van beide lanes en op mijn eigen ronde bij Poseidon | `- **High**: confirmed by at least two independent sources or official business page` (`prospecting/SKILL.md:68`) is waarom ik lane C's boeking van `peggy@newfy-co.nl` als **Medium** goedkeur en niet als te streng afdoe: één bron, haar eigen contactpagina. `- [ ] Source URL + date captured for every contact` (`:202`) is waarom ik lane C's zeven belregels heb nageteld toen bleek dat er geen commando bij stond — en dat natellen leverde 1.55 op |
| `copy-editing` | Als laatste pas over dit bestand | `### Sweep 4: Prove It` (`copy-editing/SKILL.md:117`) met `3. Flag unsupported assertions` (`:145`) heeft twee dingen in dit bestand gecorrigeerd vóór het gepusht werd: ik had "lane C telt 41 dossiers verkeerd" geschreven waar de grondentabel juist wél klopt en alleen de slotregel dubbeltelt, en ik had de Hapert/Eindhoven-tegenspraak eerst als vaststelling genoteerd terwijl zij uit de samenvattende alinea komt en per 1.20(a) geen bron is — zij staat nu als controle en niet als feit |
| `offers` | **Niet gebruikt** | Geen kaart, dus geen aanbodkeuze. De 549 bij Newfy volgt mechanisch uit `planKey: "business"` van de sectorpagina zelf; daar lag geen vraag open |
| `copywriting` | **Niet gebruikt** | Ik heb één tekst beoordeeld en niet herschreven. Mijn enige wijziging is een regel in de ondernemerscontrole, en dat is een controle-instructie en geen copy |
| `marketing-council` | **Niet gebruikt** | Die zet ik in voor het weekrapport op zondag, wanneer er een strategische keuze voorligt. Vandaag lag er een verificatievraag: klopt wat er staat |
| `competitor-profiling` | **Niet gebruikt** | Geen enkel dossier haalde de fase waarin het zinvol is de concurrent van de prospect te profileren; de boekingspoort valt in deze omgeving niet positief te sluiten (1.18) |

---

## Samenvatting — één regel per oordeel

- **AFGEKEURD — Poseidon SoftWash (Eindhoven, lane C)** — stond op poort (a) open met één van de vijf toegewezen bewijsroutes genoteerd; ik draaide de insolventieronde (schoon), de SBB-route (negatief) en een gedateerd-spoorronde (negatief) — poort (a) blijft open na zes ronden, geen kaart.
- **GOEDGEKEURD — Trimsalon Westeinde (Berkenwoude, lane D)** — vijf routes compleet genoteerd, routes 4 en 5 vandaag gedraaid; ik draaide de ontbrekende insolventieronde op KvK 93410808 (schoon) en neem het parkeervoorstel over.
- **GOEDGEKEURD — klaargelegde tekst Trimsalon Newfy & Co (lane C)** — alle claims gedekt op regelnummer, 40 tekens, 185 woorden, handtekening compleet; één correctie: de onbestaanbare insolventieronde hoort in de ondernemerscontrole.
- **AFGEKEURD — That's My Dog (lane C)**, en dat is de beste beslissing in beide bestanden: een leeftijd die het dossier in het venster zou zetten, geweigerd omdat zij alleen in de samenvattende alinea bestaat.
- **GOEDGEKEURD — de tellingen van lane D**, alle acht commando's reproduceren, inclusief twee negatieve controles; de twee correcties van 14-09 zijn uitgevoerd.
- **GOEDGEKEURD — de tellingen van lane C**, alle zes reproduceren; twee samenvattende regels moeten worden hersteld ("41 overige" telt tot 46, "Totaal 40" volgt niet uit zijn eigen rijen).
- **AFGEKEURD — 37 dossiers in lane D** tegen de veertig van de directives; de grond dekt de hondensector wel en het vrije quotum niet — order voor morgen staat hierboven.
- **AFGEKEURD — de herkomstnotatie in `bellijst.md`** — lane C's zeven belregels bestaan en zijn telling klopt, maar geen enkel commando vangt de twintig rijen van vandaag; wordt 1.55.
- **GOEDGEKEURD — poort (h) voor beide lanes** — 21 van de 21 citaten woordelijk correct op hun regelnummer; correctie aan lane C: zet de `grep -n`-herkomstregel boven de tabel.
- **GOEDGEKEURD — de 1.38-decodering** — acht van de acht shortcodes door mij zelfstandig nagerekend, tot op de minuut, waarvan drie met een onafhankelijke controle die had kunnen falen; wordt 1.56.
- **Fundament:** 1.54 (insolventieronde bindt geparkeerde teksten), 1.55 (één herkomstvorm, telling mét commando), 1.56 (leesbare titeldatum laat rem 1 van 1.38 vervallen, rem 2 blijft). 1.57 t/m 1.60 blijven vrij; negen kandidaten staan met hun dragers onder `## Voor het weekrapport`.

Azzouz, 15 september 2026
