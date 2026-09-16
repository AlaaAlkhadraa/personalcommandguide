# Verificatie — woensdag 16 september 2026 — lanes C en D

Azzouz, verificatiedienst. Ik beoordeel uitsluitend
`marketing/outreach/2026-09-16-c.md` (Limburg / Noord-Brabant / Zeeland) en
`marketing/outreach/2026-09-16-d.md` (Noord-Holland / Zuid-Holland / Utrecht).
Lanes A en B liggen bij de tweede verificatiesessie in `-ab-verified.md`; ik heb
die bestanden niet aangeraakt.

**Nul goedgekeurde kaarten uit lanes C en D.** Geen van beide lanes heeft er een
aangeboden, en na eigen ronden bied ik er ook geen aan. De dagnorm van dertig
wordt vandaag niet gehaald en dat meld ik als tekort; ik heb geen poort verzet om
er een kaart doorheen te krijgen.

---

## De kaarttelling, met het commando

```
$ grep -cE '^## [0-9]+\. ' marketing/outreach/2026-09-16-c.md
0
$ grep -cE '^## [0-9]+\. ' marketing/outreach/2026-09-16-d.md
0
```

Nul genummerde kaarten in lane C en nul in lane D. Dat komt overeen met wat de
opzichter op `origin/main` telt en met wat beide lanes zelf in hun kop schrijven
(lane C: "75 dossiers beoordeeld · 0 kaarten"; lane D: "Nieuw beoordeeld vandaag:
48 · Geen kaart"). Er is dus geen kaart met een verzendklaar onderwerp en bericht
in dit bestand, en dat is een uitkomst en geen omissie.

Daarmee valt mijn opdracht vandaag op de drie toetsen die de order noemt: zijn de
tellingen reproduceerbaar, staan de open poort-(a)-dossiers compleet, en houdt
poort (h) stand.

---

## GOEDGEKEURD — lane C's tellingen reproduceren volledig, en alle vier de correcties van 15-09 zijn uitgevoerd

Ik heb elk commando dat lane C opschrijft zelf gedraaid.

| Bewering van lane C | Mijn uitkomst |
|---|---|
| 51 nieuwe ledgerrijen | `grep -c "2026-09-16 lane C" contacted.md` → **51** ✓ |
| Glazenwasserij/gevelreiniging 28 nieuw | sectorgrep: 13+7+4+1+1+1+1 = **28** ✓ |
| Hovenier 8 · garages 6 · administratie 6 · honden 2 · grondboringen 1 | **8 · 6 · 6 · 2 · 1** ✓ |
| 51 + 24 poort-(e) = 75 dossiers | 28+8+6+6+2+1 = 51 ✓, en de 24 staan bij naam in zijn eigen tabel ✓ |
| Acht belregels | `grep -cE '^\|.*2026-09-16 lane C' bellijst.md` → **8** ✓ |
| Grondentabel telt op tot 75 | ledgerstatussen: 30+24+(9+2)+3+2+2+1+1+1 = **75** ✓ |

De negen ledgerstatussen die ik uit `contacted.md` haal, vallen één op één op de
negen gronden in zijn tekorttabel. Elk dossier staat onder zijn eerste vallende
poort en geen enkel dossier staat er twee keer in. Dit is de schoonste
tekortverantwoording die deze lane heeft geleverd.

**De vier correcties van gisteren, stuk voor stuk nagelopen:**

1. **De slotregel telt nu uit haar eigen rijen.** "De overige 69 dossiers — 75 min
   de zes hierboven genoemde" — 75 − 6 = 69, en de dubbeltellende opsomming is
   weg. ✓
2. **De sectorminimatabel is gesplitst.** Quotum: 15+10+3+2+8+2 = **40**, met de
   geen-websitegroep en Vrij nu als eigen rijen. Het dossiertotaal staat in een
   tweede tabel over disjuncte rijen. ✓ Lane C schrijft er bovendien expliciet bij
   waaróm de kolom "Beoordeeld" niet optelt — de elf geen-websitedossiers zijn een
   dwarsdoorsnede — en dat is precies de dubbeltelling die 1.46 verbiedt, hier
   vooraf ontweken in plaats van achteraf gerepareerd.
3. **De `grep -n`-herkomstregel staat boven de skillstabel.** ✓
4. **De zeven `bellijst.md`-regels van 15-09 zijn omgezet naar `2026-09-15 lane C`.**
   `grep -oE '(2026-09-15 lane [A-D]|\(lane [A-D], 15-09\))' bellijst.md | sort | uniq -c`
   geeft nu **7 × `2026-09-15 lane C`** en nul lane C-rijen in de oude vorm. ✓

**En één ding dat beter is dan de correctie vroeg.** Lane C zag vooruit dat zijn
eigen telregel de tekenreeks draagt die hij telt, en schreef erbij: *"de kale
`grep -c` geeft 10, want de twee regels van deze alinea dragen de tekenreeks ook"*
(`bellijst.md` r. 837-839). Ik heb het nagerekend: onverankerd 10, verankerd 8.
Dat is 1.55 toegepast op de valkuil die 1.55 zelf opwerpt, en het is de eerste
keer dat een lane die valkuil vóór de meting benoemt in plaats van erna.

**Eén rest die niet van lane C is:** er staat nog één rij in de oude vorm
`(lane A, 15-09)` in `bellijst.md` (r. 755, De Knipkamer). 1.55 is een regel per
**bestand**, dus zolang die rij er staat is `bellijst.md` niet één vorm. Het is
lane A's rij en lane A ligt bij de andere sessie; ik raak hem niet aan en meld hem
hier zodat hij niet tussen twee sessies in verdwijnt.

---

## AFGEKEURD — lane C's derde rij in `geen-emailadres.md` stond onder de kop van lane A, en twee tellingen in dat bestand spraken zichzelf tegen

Dit is de enige inhoudelijke afkeuring op lane C en zij is precies de fout die de
directives bij naam noemen: *"een kop in `geen-emailadres.md` die 'Vijf zaken'
aankondigt met negen rijen eronder"*.

Wat ik aantrof:

- Lane C's eigen sectiekop op r. 1443 kondigde **"Twee zaken"** aan en zijn
  telregel eronder zei **"twee regels"**.
- Het verankerde commando gaf **drie**: `grep -cE '^\|.*\| C \| 2026-09-16 \|$'` → 3.
- De derde rij (Administratiekantoor Mans) stond niet in lane C's tabel maar als
  **losse regel onderaan het hele bestand** (r. 1520), pal onder de slotzin van de
  lane A-sectie: *"— twee regels, en de kop erboven zegt twee."* Daarmee stonden er
  drie rijen onder een kop die er twee aankondigde, en de lane A-slotzin las in
  zijn context onwaar terwijl hij over lane A's eigen twee rijen ging.

Lane C's eigen bestand (`2026-09-16-c.md`) noemt wél drie en noemt het juiste
commando. De fout zit dus uitsluitend in het bestemmingsbestand, en hij is van de
soort die niemand ziet die alleen het lane-bestand leest.

**Ik heb hem zelf gecorrigeerd in plaats van hem terug te leggen**, want deze rij
is van mijn lane en de kop loog zolang hij bleef staan. De rij staat nu in lane C's
eigen tabel, beide tellingen van lane C zijn bijgewerkt naar drie, en ik heb er in
één alinea bij gezet wat er mis was. Lane A's rijen en lane A's slotzin heb ik niet
aangeraakt; zijn eigen telling was en blijft twee. Na de correctie:

```
$ grep -cE '^\|.*\| C \| 2026-09-16 \|$' geen-emailadres.md   → 3
$ grep -cE '^\|.*\| A \| 2026-09-16 \|$' geen-emailadres.md   → 2
$ grep -cE '^\|.*\| D \| 2026-09-16 \|$' geen-emailadres.md   → 6
```

Elke kop dekt nu zijn eigen rijen.

**Wat deze fout waard is, en het is niet alleen een terechtwijzing.** De
lane-kolom stond wél goed op `C`. Dáárdoor gaf het verankerde commando de hele
tijd het juiste getal, ook toen de rij fysiek onder de verkeerde kop stond. Dat is
exact waarvoor de directives die kolom hebben ingevoerd — na tien lane A-rijen die
onder een lane C-kop belandden — en het is de eerste keer dat hij aantoonbaar een
misplaatste rij heeft opgevangen. De vormregel werkt; de discipline eromheen nog
niet.

---

## AFGEKEURD — lane C roept `marketing-psychology` met een argument aan, en dat is precies wat 1.44 verbiedt

Lane C schrijft boven zijn skillstabel: *"Alle vier de skills zijn met een argument
van één woord aangeroepen (`sources`, `subjects`, `constraints`, `sweep`), zodat de
`$N`-substitutie van 1.40(g) geen citaat kan vervuilen."*

Dat volgt 1.40(g) en negeert 1.44, die 1.40(g) uitdrukkelijk **afmaakt**:

> **De regel: heeft een skill een `$`-telling boven nul, roep hem dan zonder
> argument aan.** (`.agents/product-marketing.md:1421`)

Ik heb de tellingen zelf gemeten met
`grep -oE '\$[0-9]+' <skill>/SKILL.md | sort -u`:

| Skill | `$N`-dragers | Argument toegestaan? | Lane C | Lane D |
|---|---|---|---|---|
| `marketing-psychology` | `$0 $1 $2 $3 $16 $30 $50 $80 $90 $99 $100 $497 $500` | **nee** | `constraints` ✗ | geen ✓ |
| `prospecting` · `cold-email` · `copy-editing` | geen | ja | ✓ | ✓ |

Eén van lane C's vier aanroepen is dus fout, en het is juist de skill waar 1.44
over gaat. **De schade is nul en dat is geen toeval:** lane C haalde elk citaat met
`grep -n` van schijf, zoals de directives eisen, en ik heb alle zeven
`marketing-psychology`-citaten van schijf getoetst — alle zeven exact. De ene
veiligheidsmaatregel ving de andere op.

Voor morgen: `marketing-psychology`, `offers` en `customer-research` zonder
argument; de rest mag er een hebben.

**Ik heb 1.44 vandaag zelf in een vierde sessie gereproduceerd.** Mijn aanroep
zonder argument gaf `The jump from $1 to $0 is bigger than $2 to $1` binnen, met
`$99`, `$100`, `$497`, `$500`, `$80`, `$16`, `$50` en `$30` alle intact. De meting
staat daarmee op vier sessies.

---

## GOEDGEKEURD — SOLID Reiniging staat compleet op poort (a), en mijn eigen ronde bevestigt de afkeuring

Dit is het dossier waarop lane C gisteren viel (Poseidon SoftWash, vijf routes niet
gedraaid). Vandaag staat het er zoals de directives het eisen: **de vijf toegewezen
bewijsroutes, elk met één regel over wat zij gaf, plus de insolventieronde.**

| Route | Lane C | Mijn controle |
|---|---|---|
| KvK-mutatie met datum | Niets; naamswissel Rico's → SOLID zichtbaar, nergens gedateerd | bevestigd |
| Gemeentelijke / GGD-vergunning | Niets op beide handelsnamen | bevestigd |
| Inspectie of rapport | Niets op bedrijfsniveau | bevestigd |
| SBB-erkenning < 12 maanden | Geen leerbedrijfprofiel op `stagemarkt.nl` | bevestigd |
| Vacature met plaatsingsdatum | Vacature bestáát, draagt **geen** datum in URL of titel | **bevestigd, zie hieronder** |
| Insolventieronde (1.40a), KvK 80309216 | Schoon | bevestigd |

**Mijn eigen ronde, zodat morgen niemand hem overdoet.** Ik draaide
`"SOLID Reiniging" Middelburg glazenwasser gevelreiniging vacature`. Uitkomst:
`solidreiniging.nl/vacatures/` bestaat en voert twee functies (leidend glazenwasser
en een leerplek), **zonder datum in URL of titel**. De Facebook-pagina draait
inderdaad nog op de oude handle `/ricosreiniging/`. De twee Indeed-treffers die
wél een datum tonen (31 juli 2026, 30 oktober 2025) zijn generieke
sectorpagina's waar dit bedrijf niet in voorkomt — geen drager. Poort (a) blijft
dicht.

**Eén ding dat ik erbij vond en dat lane C niet had:**
`alleglazenwassers.nl/business/solid-reiniging-middelburg-mortiere-000046671900/`
voert **vestigingsnummer 000046671900**. Dat is een tweede, onafhankelijke
registerdrager naast KvK 80309216, en de reeks wijst dezelfde kant op als lane C's
2020-lezing. Het sluit poort (a) niet — het is geen gedateerd spoor — maar het
maakt de leeftijd van dit dossier steviger dan lane C hem noteerde, en dat is
relevant zodra poort (a) ooit sluit.

**Het oordeel van lane C is juist en ik neem het over: geen kaart en géén
klaargelegde tekst.** Twee open punten — poort (a) én een lek dat per 1.18 niet
positief is vastgesteld — en lane C weigert terecht de formulering "één ronde van
een kaart af". Dat is de correctie op Sportscar Service Tilburg, vooraf toegepast
en zonder dat ik erom hoefde te vragen.

---

## GOEDGEKEURD — lane D's tellingen reproduceren, en de rijnummers partitioneren 1 t/m 48 exact

Alle zes sectorcommando's van lane D gedraaid:

| Commando | Lane D | Mijn uitkomst |
|---|---|---|
| `grep -c "2026-09-16 lane D" contacted.md` | 33 | **33** ✓ |
| `grep -c "Sector: hondentrimsalon.*2026-09-16 lane D"` | 5 | **5** ✓ |
| `grep -cE "Sector: (glazenwas\|gevelreiniging).*2026-09-16 lane D"` | 20 | **20** ✓ |
| — het enkelvoudige patroon `Sector: glazenwas` | 17 | **17** ✓ |
| `grep -c "Sector: hovenier.*2026-09-16 lane D"` | 6 | **6** ✓ |
| `grep -c "Sector: kapsalon.*2026-09-16 lane D"` | 2 | **2** ✓ |

5+20+6+2 = 33 nieuwe ledgerrijen, plus 15 poort-(e)-dossiers = **48**. De aftrek is
in één ronde na te rekenen en lane D noemt de vijftien bij naam.

**De rijnummerpartitie heb ik apart getoetst** en dit is het beste stuk vormwerk
van beide bestanden. De zeven gronden dragen elk hun rijnummers; ik heb ze
uitgeschreven en geteld: 22+15+5+2+2+1+1 = 48, **48 unieke nummers, geen gat tussen
1 en 48, geen enkel dubbel**. Lane D zegt dat de reeksen 1 t/m 48 partitioneren
zonder dubbel en zonder gat, en dat is letterlijk waar. Dat is een sterkere
controle dan een optelling, want een optelling kan kloppen terwijl een dossier
twee keer meetelt.

**Ook goed:** lane D ving zelf twee meetfouten vóór het pushen — het enkelvoudige
sectorpatroon dat drie `Sector: gevelreiniging`-rijen mist, en de onverankerde
bestemmingsgreps die zichzelf meetellen. Allebei gecontroleerd, allebei juist
gediagnosticeerd. *"Een telling die per ongeluk klopt, is geen telling"* is de
goede formulering en zij is van hem.

---

## AFGEKEURD — twee illustratieve getallen van lane D reproduceren niet

De data-tellingen kloppen allemaal. Twee getallen in lane D's *uitleg* over die
tellingen kloppen niet, en 1.55 maakt geen onderscheid tussen een telling en de
illustratie ernaast — allebei zijn het getallen met een commando eronder.

| Lane D schrijft | Mijn uitkomst |
|---|---|
| onverankerd `grep -c "2026-09-16 lane D" bellijst.md` geeft **twee** waar één rij staat | **drie** — de rij plus **twee** regels van zijn eigen alinea |
| onverankerd `grep -c "\| D \| 2026-09-16 \|" geen-emailadres.md` geeft **zeven** waar zes staan | **zes** — de telregel schrijft het patroon met backslashes (`\| D \|`) en vangt zichzelf dus niet |

De oorzaak is in beide gevallen dezelfde en zij is eerlijk: dit zijn
zelfverwijzende tellingen, en het bestand verandert terwijl je de noot erover
schrijft. Lane D mat "twee" toen zijn alinea één regel besloeg en breidde de
alinea daarna uit; en hij mat "zeven" toen zijn telregel het patroon nog kaal
voerde, waarna hij het — terecht — met backslashes ging schrijven.

**Waarom ik het toch afkeur en niet wegwuif.** Het punt van 1.55 is dat een lezer
het getal kan nalopen. Deze twee kan hij niet nalopen; hij krijgt drie en zes. En
het is dezelfde klasse waarop ik lane C gisteren afkeurde, dus hij moet hier ook
vallen. **Wat lane C vandaag beter deed en wat de oplossing is:** lane C noteerde
zijn onverankerde getal (10) ná het schrijven van de alinea en controleerde het
opnieuw. Meet de zelfverwijzende telling als laatste handeling vóór de push, niet
op het moment dat je haar opschrijft.

De verankerde tellingen — de tellingen die er werkelijk toe doen — zijn bij lane D
alle acht juist.

---

## AFGEKEURD — lane D noemt de leeftijdspoort "(c)", en (c) is de reviewclaimpoort

In lane D's tekortblok staat: *"Bindende poort vandaag: **(c) leeftijd —
aantoonbaar buiten het venster**, bij 22 van de 48 dossiers."*

De poortletters liggen vast: (a) gedateerd levensteken · (b) openbaar e-mailadres ·
(c) reviewclaim · (d) claimdekking door zevren.nl · (e) ledger · (f) groeifase en
leeftijd · (g) onderwerpregel · (h) skillstabel. **De leeftijdspoort is (f).** Lane
C schrijft op dezelfde dag correct *"(f) leeftijd, bij 33 van de 75 dossiers"*.

Lane D gebruikt (a), (b) en (e) verderop in diezelfde tabel wél correct, dus dit is
één verschrijving en geen misverstand over het stelsel. Maar het staat in de
**bindende regel van het tekortblok** — de regel die in het weekrapport naast die
van de andere drie lanes wordt gelegd — en daar leest "(c)" als een lane die op
reviewclaims valt in plaats van op leeftijd. Twee lanes die op dezelfde dag
dezelfde poort verschillend benoemen, is precies de "twee maten"-klasse.

Correctie voor morgen: `(f) leeftijd`, ook in het tekortblok.

---

## GOEDGEKEURD — lane D heeft mijn order van gisteren uitgevoerd, allebei de helften

Gisteren stond hier: *"Order voor morgen: het vrije quotum vullen vóór er een
tweede bronmeting in gaat"*, en de zwaardere: de vijf toegewezen bewijsroutes op
elk dossier dat op poort (a) open blijft staan.

**Het vrije quotum.** Rijen 47 en 48 zijn kappers, `grep -c "Sector: kapsalon…"` → 2,
en lane D schrijft er expliciet bij dat hij ze als eerste heeft gedaan. Er is
vandaag geen nieuwe bronmeting gedraaid. **Uitgevoerd.**

Lane D draaide wél vier extra ronden in de post-datumroute, ná de twee pushes. Ik
heb gewogen of dat een tweede bronmeting is en concludeer van niet: het is een
**route**meting, niet een bronmeting, zij kwam ná een gevuld quotum en ná 48
dossiers, en zij is precies de volgorde die mijn order bedoelde — eerst de maat
halen, dan meten. Geen aanmerking.

**De vijf bewijsroutes.** Tien route-regels over twee dossiers, elk met wat de
route gaf, plus twee insolventieronden. Vorige week draaide deze lane er **nul** en
gisteren viel lane C hierop. Vandaag staat het er compleet, op allebei de open
dossiers, in de voorgeschreven vorm. Dit is de order die twee diensten lang niet
aankwam en die nu is aangekomen.

**De maat.** 48 beoordeelde dossiers tegen een norm van 40. Lane D zat gisteren op
37 en meldde dat als tekort; vandaag haalt hij de maat ruim, mét het vrije quotum
gevuld. Dat is de goede beweging en ik noteer hem als zodanig.

**Ook uitgevoerd:** nul ronden in de 1.13-route, nul in `kostenglazenwasser.nl`,
nul in de geparkeerde dossiers. *"Trimsalon Driemond kwam vandaag uit een
TransFirm-ronde naar boven en is ongeopend teruggelegd"* — dat is hoe het verbod
hoort te werken.

---

## GOEDGEKEURD — de twee open poort-(a)-dossiers van lane D, met mijn eigen ronde erop

### Glazenwasserij Schouwen — Sommelsdijk (ZH)

Zeven poorten dicht, (a) open. Ik heb de dragers zelf nagelopen met
`"Glazenwasserij Schouwen" Sommelsdijk`:

- KvK **84941464** én vestigingsnummer **000051027259**, allebei bevestigd, en
  allebei opnieuw in het Compadex-pad `glazenwasserij-schouwen-84941464-51027259` ✓
- `glazenwasserij-schouwen.nl/offerte-en-contact/` geïndexeerd ✓
- De eigen tekst *"een jong bedrijf met veel ervaring uit de familie"* ✓ — dit is
  de **positieve controle** op de ervaringsclaimregel, en zij is echt: dezelfde
  regel die elders een vers KvK-nummer ondermijnt, bevestigt het hier
- Trustoo 7,8 en Top-10, **zonder datum** ✓ — terecht niet als poort-(a)-drager
  geboekt
- Multatulilaan 5, Sommelsdijk, gemeente Goeree-Overflakkee; de Facebook-pagina
  voert **Bruinisse** (Zeeland) ✓ — lane D's 1.40(h)-waarschuwing klopt en hoort
  in het dossier vóór iemand "uw zaak in Sommelsdijk" schrijft

Mijn eigen poort-(a)-ronde (`… Goeree-Overflakkee nieuws 2026`) gaf geen enkel
gedateerd spoor: geen post-URL, geen gedateerd bericht, geen nieuwsitem op deze
zaak. **Poort (a) blijft open.** Lane D's oordeel is juist.

### Honden Trimsalon Paradise — Spijkenisse (ZH)

Zeven poorten dicht, (a) open. Nagelopen met `"Trimsalon Paradise" Spijkenisse honden`:

- KvK **85529001** en vestigingsnummer **000051569531** (Drimble-pad) ✓
- `Hondentrimsalonparadise@gmail.com` op de eigen Facebook-pagina van díe zaak ✓ —
  poort (b) haalt langs de enige route die bij facebook-only bestaat
- Karperveen 116, 3205 HG ✓
- **Nieuw en niet in lane D's dossier:** er staat ook een telefoonnummer,
  **+31 6 16303247**. Dat verandert de bestemming niet — deze zaak heeft een
  geverifieerd adres en hoort dus terecht in geen van beide bestemmingsbestanden —
  maar het is een tweede antwoordweg zodra de kaart ooit uitgaat, en het hoort in
  het dossier.

**En een positieve controle op lane D's eigen strengheid.** Lane D schrijft dat hij
"honderd procent aanbevolen op veertien reviews" uit een eerdere versie heeft
gehaald omdat het uitsluitend uit de samenvattende alinea komt (1.20a). Mijn ronde
bevestigt dat precies: die cijfers verschijnen in de samenvattende alinea en in
geen enkele URL of titel. **Lane D heeft een cijfer weggegooid dat zijn eigen
dossier mooier maakte, op de juiste grond.** Dat is de duurste soort discipline en
zij hoort genoemd te worden.

Mijn poort-(a)-ronde gaf alleen de profielpagina
(`facebook.com/p/HondenTrimsalon-Paradise-100079225833122/`), geen post-URL, geen
gedateerde review. **Poort (a) blijft open.**

### Wat mijn eigen ronde in totaal opleverde

Vier zoekopdrachten over drie dossiers, nul gedateerde sporen, nul kaarten. Dat
bevestigt alle drie de lane-oordelen en het betekent dat er vandaag **met een
eigen ronde geen verzendklare kaart uit deze dossiers te halen was.** Ik noteer het
zodat niemand deze ronden morgen overdoet: de drie dossiers zijn gemeten, niet
vermoed.

---

## GOEDGEKEURD — poort (h), met één correctie per lane, en de twee lanes hebben elk de andere helft goed

Ik heb **alle 21 citaten van lane C en alle citaten van lane D van schijf getoetst**
met `sed -n "<n>p" <skill>/SKILL.md`.

**Lane C: 21 van de 21 citaten exact.** Regelnummers, tekst, skillbestand — alles
klopt, inclusief de lange citaten uit `prospecting:210`, `copy-editing:137` en
`marketing-psychology:416`. De tabel is inhoudelijk de sterkste van de twee: de
`cold-email`-rij legt uit waarom er géén tekst is geschreven en laat `:25` expliciet
**verliezen** van de harde regel van 25-08, met de grond erbij. Dat is een skill die
een beslissing heeft gedragen in plaats van een citaat dat een rij vult.

**Lane D: alle citaten exact op één na — en die ene draagt geen regelnummer.** De
rij `marketing-psychology` voert *Jobs to Be Done* als
``(`SKILL.md`, `People don't buy products—they "hire" them to get a job done.`)``,
zonder nummer. Het citaat is juist — het staat op **regel 36** — maar de directives
zijn scherp: *"een citaat zonder `grep -n`-regelnummer telt niet als voorbeeld"*.
Dat voorbeeld telt dus niet. De tabel is daarmee niet hol: de overige citaten in
diezelfde rij (`:65`, `:66`, `:126`, `:127`, `:45`, `:46`, `:415`, `:416`) dragen
alle acht hun nummer en zijn alle acht exact. **Geen gefaalde dienst, wel een
correctie:** schrijf `SKILL.md:36`.

**De symmetrie is het werkelijke resultaat van deze poort vandaag.** Lane C heeft de
citaatvorm perfect en de aanroepvorm fout; lane D heeft de aanroepvorm perfect en
één citaat zonder nummer. Geen van beide lanes heeft de regel dus helemaal — en dat
komt doordat hij in twee documenten ligt: de aanroepvorm in 1.40(g)/1.44 van het
fundament, de citaatvorm in de directives. Dat hoort in het weekrapport als
vormpunt, niet als verwijt aan een lane.

| | Citaten met nummer | Citaten juist | Aanroep per 1.44 |
|---|---|---|---|
| Lane C | 21/21 ✓ | 21/21 ✓ | ✗ (`marketing-psychology` met argument) |
| Lane D | 30/31 | 31/31 ✓ | ✓ |

Beide tabellen dragen bovendien echte **"niet gebruikt"-rijen met een grond**, en
lane C's rij over `customer-research` — *"een gemis dat ik zelf noteer"* — is de
soort eerlijkheid die de poort moest opleveren. **Poort (h) gehaald door beide
lanes**, voor de eenenvijftigste dienst op rij.

---

## GOEDGEKEURD — lane D's bevinding over de post-datumroute, gewogen tegen 1.38 en 1.56

Dit is de belangrijkste bevinding van beide bestanden en de order vraagt mij hem
expliciet te wegen. Ik doe dat in drie stappen.

**Wat 1.38 en 1.56 zeggen.** 1.38 zegt dat de post-ID de datum draagt maar dat de
datum door de bruikbare laag moet lopen, met twee remmen. 1.56 — die ik gisteren
zelf heb vastgelegd — zegt dat rem 1 vervalt waar de posttitel de datum leesbaar
draagt, omdat er dan niets te decoderen valt; rem 2 en 1.40(e) blijven staan. Ik
heb daar lane C's eigen rem op gezet: het is een **bewijs**route en geen jaagroute.

**Wat lane D meet.** Niet de decodering, maar de **aanvoer**. Op
`@glazenwasserijschouwen` en op Paradise gaven vier ronden uitsluitend de
profiel-URL terug, terwijl **dezelfde zoekopdrachten in dezelfde ronde** wél
post-URL's mét ID gaven van andere accounts: `@delfseglazenwasser/video/7369868865766984992`,
`@schoonmaakservicewilde/video/7351030150366072097`,
`@omroepbrabant/video/7241652151020211483`,
`@jjvbglazenwasser/video/7581777152559910177`, plus Facebook-permalinks van vijf
ándere trimsalons. Twee dossiers, negen URL's, één dienst.

**Mijn weging, en zij valt in drie stukken uiteen.**

1. **Dit weerspreekt 1.56 niet — het vult hem aan, en dat is een belangrijk
   onderscheid.** 1.56 gaat over hoe je een post-URL *leest* als je er een hebt.
   Lane D gaat over of je er ooit een *krijgt*. De twee kunnen allebei waar zijn en
   zijn dat ook: de decodering die ik gisteren op acht dragers heb geijkt, blijft
   geldig. Wat erbij komt is dat zij voor ons profiel meestal geen voorwerp heeft.
2. **Het verschijnsel staat, de drempel niet.** Het meetontwerp is goed — identieke
   zoekopdrachten, negatieve én positieve controle in dezelfde ronde — en dat sluit
   "de zoekopdracht was verkeerd" uit. Maar de verklaring *"onder circa honderd
   volgers"* rust op **één gemeten account** (Schouwen, 67 volgers); van Paradise
   noemt lane D geen volgersaantal, en `@omroepbrabant` is een omroep en dus een
   uitschieter aan de andere kant. Het verschijnsel is dus stevig; het getal 100 is
   een hypothese. **Ik neem het verschijnsel op in het fundament en het getal
   uitdrukkelijk niet.**
3. **Mijn eigen sessie is een derde drager.** Mijn vier ronden van vandaag, met
   ándere zoekopdrachten dan die van lane D, gaven op allebei de dossiers eveneens
   uitsluitend de profielpagina. Dat is een onafhankelijke reproductie in een derde
   sessie, en zij is uitgevoerd vóór ik lane D's conclusie had gewogen.

**Waarom dit meer is dan een bevinding.** Zes diensten lang luidt de verklaring voor
poort (a) "de omgeving blokkeert `WebFetch`". Die verklaring is waar en zij is niet
volledig. De vervangende route die het fundament aanwijst, is structureel niet
beschikbaar voor precies de bedrijven die het profiel van 24 augustus definieert:
een groeifasezaak met een levende maar kleine Instagram is per definitie een account
dat te klein is om per post geïndexeerd te worden. **De route werkt voor bedrijven
die wij niet willen en faalt voor bedrijven die wij wel willen.** Dat verandert wat
het beslispunt bij de owner over het netwerkbeleid werkelijk inhoudt: het gaat niet
om gemak, het gaat om de enige overgebleven aanvoer voor de duurste poort.

Lane D's eigen conclusie — *"ik steek er morgen geen ronden meer in bij een account
onder de honderd volgers, en noteer in plaats daarvan de accountomvang"* — neem ik
over als werkwijze, met de kanttekening dat de honderd een werkgetal is en geen
grens.

---

## Wat ik in het fundament vastleg — 1.57, 1.58 en 1.59

De C+D-reeks stond op 1.56. Ik neem er **drie** en laat **1.60 vrij**, op dezelfde
grond als bij 1.53 en 1.56: het is woensdag, de week loopt tot en met zondag, en een
reeks in één dienst leegtrekken is even duur als een reeks die te krap is. De rest
staat geparkeerd in `## Voor het weekrapport`.

Beide lanes boden **nul kaarten** aan uit **123 volledig beoordeelde dossiers**
(lane C 75, lane D 48), dus alle drie de regels komen uit het werk eromheen.

**(a) 1.57 — een registergetal binnen het venster náást een vestigingsnummer uit een
tien of meer jaar oudere reeks is een leeftijds*botsing*, en de uitkomst is
"leeftijd niet vastgesteld" en nooit "binnen het venster".**
Bij "Een erkenningsdatum is een levensteken, nooit een leeftijdsbewijs".

Dit is de best gedragen regel van de dag omdat **twee lanes hem op dezelfde dag
onafhankelijk raakten**, in twee provincies en op drie verschillende bronnen.
Dragers: Hoveniersbedrijf Innemee, Elst Ut (96018542 uit 2025 náást 000001375741
uit de oude reeks); Tojina, Oegstgeest (90528417 náást 000005150019, plus *"sinds
2000"* op de eigen site — de enige van de drie die de botsing **sluit**); Centraal
Glazenwasserij, Zaandam (86101862 náást 000036320161 náást 678235210000 op een derde
gids); en uit lane C **Autogalerij Brabant, Kaatsheuvel of Waalwijk** — twee
KvK-nummers die vijfendertig jaar uit elkaar liggen (84220244 en 42068877), drie
vestigingsnummers en twee plaatsen onder één handelsnaam. Vier dragers, twee lanes.

**Wat de regel toevoegt boven 1.15, 1.16 en 1.40(c):** die drie zeggen dat een vers
registergetal een oude zaak kan verbergen en dat een vestigingsnummer mag begrenzen
waar het niet mag dateren. Wat hier bijkomt is de **uitkomst** bij tegenspraak, en
dat is de helft die in de praktijk misgaat: de verleiding is om het gunstigste getal
te kiezen. De regel verbiedt dat en laat de uitkomst per dossier verschillen —
Tojina sluit hard omdat de eigen pagina de oude kant bevestigt, Innemee en Centraal
sluiten niet maar mogen ook niet "binnen het venster" heten. De eenzijdige
kostentoets van 1.31, 1.34 en 1.37 geldt onverkort: deze regel kan geen goede kaart
doden, hij kan alleen een optimistisch oordeel tegenhouden.

**(b) 1.58 — voert TransFirm op hetzelfde vestigingsnummer twee verschillende
voorloopgetallen, dan draagt géén van beide de leeftijd; sluit het dossier pas op
een drager buiten TransFirm.**
Bij "Een gids die één getal toont, zegt niet welk getal het is (1.40d)".

Drager: **Cleaning Force, 's-Gravenhage.** Drie TransFirm-URL's in één dienst,
hetzelfde vestigingsnummer `000012433330`, twee verschillende getallen ervoor:
`96397330` (2025, ruim binnen het venster) en `65527631` (circa 2016, ruim erbuiten).
De onafhankelijke controle beslist: `glazenwassers.online/cleaning-force/65527631`
voert 65527631 en de eigen bedrijfstekst zegt *"sinds 2004"*. Eén dossier, maar met
drie URL's en een controle die het oordeel **omdraaide**: zonder haar was een zaak
van tweeëntwintig jaar als groeifasebedrijf geboekt.

**Waarom hij een eigen nummer krijgt naast 1.40(d).** 1.40(d) zegt dat een gids niet
zegt wélk register een getal draagt — dat is een vraag over de *soort* van het getal.
Hier toont één gids **twee verschillende getallen in dezelfde padpositie op dezelfde
zaak**, en dat is een vraag over de *betrouwbaarheid van het veld zelf*. Het gewicht
komt van de context: de directives wijzen `transfirm.nl` deze week aan als hoofdroute
voor **beide** lanes, en lane D haalt er 34 van zijn 48 dossiers uit. Een hoofdroute
die zichzelf tegenspreekt, verdient een eigen rem. De rem is goedkoop — hij eist één
drager buiten TransFirm en alleen op dossiers die *binnen* het venster vallen, wat
lane D uit zichzelf al zo heeft toegepast: *"dossiers die op leeftijd buiten het
venster vallen heb ik niet nagejaagd: daar zou een tweede drager het oordeel alleen
kunnen verzachten"*. Dat is de juiste asymmetrie en ik neem hem in de regel op.

**(c) 1.59 — de 1.38/1.56-route faalt op de aanvoer en niet op de decodering: voor
een klein account levert de zoekindex geen post-URL's, dus de route sluit poort (a)
structureel niet voor het profiel van 24 augustus. Noteer de accountomvang in plaats
van er ronden in te steken.**
Bij "Wiens daad draagt de datum — poort (a) beslist", direct onder 1.56.

Dragers: lane D's twee dossiers met negen URL's en een negatieve én positieve
controle in dezelfde ronden met identieke zoekopdrachten; plus **mijn eigen vier
ronden van vandaag met andere zoekopdrachten, die op allebei de dossiers eveneens
uitsluitend de profielpagina gaven**. Drie sessies, twee platforms.

**Uitdrukkelijk niet in de regel: het getal honderd.** De verklaring "onder circa
honderd volgers" rust op één gemeten account en blijft een werkhypothese; de regel
spreekt van een klein account en laat de drempel open tot iemand hem meet. **En de
rem van lane C op 1.56 blijft staan:** dit is een bewijsroute en geen jaagroute.

**Wat deze regel kost en wat zij oplevert.** Zij kost niets — zij verbiedt ronden die
aantoonbaar nul opleveren — en zij levert twee dingen op: de ronden gaan naar de vijf
toegewezen bewijssoorten, en het beslispunt bij de owner over het netwerkbeleid krijgt
zijn werkelijke gewicht. Zonder deze regel leest "poort (a) is de bindende poort" zes
diensten lang als een inzetprobleem. Met deze regel is het een aanvoerprobleem.

---

## Voor het weekrapport

Kandidaten die ik vandaag niet in het fundament zet, met hun dragers, zodat er niets
verdampt. 1.60 blijft vrij.

| Kandidaatregel | Dragers | De dragers zelf |
|---|---|---|
| Het gidsrecord is de eenheid en de handelsnaam is een etiket: één record-ID kan twee namen én twee plaatsen dragen, dus de poort-(e)-ronde draait ook op record-ID en KvK-nummer | 5 | `telefoonboek.nl/bedrijven/t8163404/` onder drie paden (solid-reiniging/Middelburg, ricos-glas-&-gevelreiniging/Middelburg, ricos-glas-&-gevelreiniging/Vlissingen), waarvan één met een titel die zijn eigen pad tegenspreekt; `oozo.nl` record `2805660` onder twee namen (15-09); transfirm-slug `luxe-renovaties-limburg` onder titel "Huis en Tuin Limburg Service"; transfirm-slug `mans-administratie` onder titel "Administratiekantoor Mans". **Mijn grond om te parkeren:** hij raakt de jaagvolgorde van 1.20(b), en 1.19 wijst dat naar het weekrapport — dezelfde grond waarop ik gisteren de nul-overlapregel parkeerde |
| Poort (e) op bijna een derde van een dienst ís de uitputtingsmeting van een bron, en zij is goedkoper dan een aparte bronmeting | 24 | 24 van lane C's 75 dossiers, alle vierentwintig eerder door lane C zélf afgewezen, uit de twee bronnen die het sectorplan als enige toestaat. Lane D's eigen getal ernaast: 15 van 48. **Sterk, en hij hoort bij het weekrapport thuis omdat hij een uitspraak doet over het sectorplan en niet over een dossier** |
| "Osmose" en "softwash" in een handelsnaam selecteren niet op het leeftijdsvenster maar op de uiteinden ervan | 5 | Robert van Dooren osmose glasbewassing (KvK 60694270, 2014 — twaalf jaar, mét "osmose" in de handelsnaam); te jong: Vastgoed onderhoud Brabant Limburg (95091823), Huis en Tuin Limburg Service (95420274); te oud: Gevelreiniging Benelux (74631497), Creemers (60400994). **Raakt rechtstreeks de gróndtekst van mijn eigen sectorplan van deze week** ("softwash en osmose zijn technieken van ná 2018"), dus hij hoort bij de herziening van dat plan en niet in een dossierregel |
| De KvK-band is aan de jonge kant systematisch te optimistisch: een B.V.-omzetting maakt een oude zaak jong en nooit andersom, dus een hoog nummer vraagt altijd de over-onsronde en een laag nummer nooit | 1 sterke | Autobedrijf Bram Schreven: KvK 89210689 (2023) tegenover een zaak die in 2011 begon en sinds 01-03-2015 in Mill zit. 1.15 en 1.16 beschrijven de val al; wat nieuw is, is de **asymmetrie**, en die staat op één drager. Gedeeltelijk opgevangen door 1.57 hierboven |
| De bronklasse beslist het kanaal, en de richting houdt aan beide kanten stand: registerbronnen geven ook géén telefoonnummer, niet alleen géén e-mailadres | 11 (vierde drager) | Acht tariefgidsdossiers mét nummer tegenover drie registerdossiers zónder (Zegyesmetjes, Autosloperij Limburg, Administratiekantoor Mans). Vierde drager onder de regel die ik op 15-09 parkeerde; hij staat nu op genoeg dragers om zondag vastgelegd te worden |
| 1.44's `$`-telling is te ruim: een `$` die niet door een cijfer wordt gevolgd, kan niet door de `$N`-substitutie worden vervangen | 1, met een positieve en een negatieve controle | 1.44 telt `competitor-profiling` op 1, maar zijn enige `$` is `$[estimated]` (r. 287) — geen `$N`, dus onvervangbaar, dus hoort hij in de nulgroep en is een argument daar toegestaan. `customer-research` telt wél echt (`$50`, `$5`, r. 184). **Dit is een correctie op mijn eigen regel**, gemeten met `grep -oE '\$[0-9]+'`; te klein voor een eigen nummer, te concreet om te laten verdampen |
| 1.54 (de insolventieronde bindt elke geparkeerde tekst) botst met het staande verbod om nog ronden te steken in de geparkeerde dossiers | 2 | Beide lanes melden het onafhankelijk. Bij Newfy & Co lost het zichzelf op (geen KvK-nummer), bij Roerdalen, Poseidon SoftWash, Driemond, Sander van Os, Westeinde en de vier van vorige week niet. **Lane C's voorstel is goed en ik onderschrijf het:** zonder één zoekopdracht uit het ronde-verbod, niet het hele verbod. Dit is een order van de owner tegen een regel van mij, dus hij beslist |
| De herkomstvorm in `bellijst.md` is nog niet één vorm | 1 | Eén rij van 15-09 staat nog als `(lane A, 15-09)` (r. 755, De Knipkamer). Lane C's zeven zijn omgezet, lane A's ene niet. 1.55 is een regel per bestand, dus het bestand haalt hem nog niet. Ligt bij de A+B-sessie |

---

## Botsingen die ik doorgeef

1. **De pushvorm.** `CLAUDE.md` en `agents/outreach-agent.md` schrijven
   `git push origin main:claude/…`; de directives eisen `HEAD:main` en
   `HEAD:claude/…`. Beide lanes melden het, ik volg de directives en meld het.
   **Zesde dienst op rij.** Het zijn de bestanden van de owner en het ligt als
   beslispunt bij hem.
2. **De sectorcap van `agents/beats.md` tegen het sectorplan van de directives.**
   Beide lanes melden hem onafhankelijk, met drie verschillende maten eronder. Lane
   C's maat is vandaag de hardste: van 42 glazenwasserij- en
   gevelreinigingsdossiers viel er niet één door naar een kaart, en **veertien
   ervan waren namen die deze lane er zelf al uit had gehaald.**
3. **1.54 tegen het ronde-verbod op geparkeerde dossiers.** Zie de tabel hierboven.
4. **De dagnorm.** Negende dienst waarin de poorten nul kaarten doorlaten in deze
   twee lanes. Er is geen soepelere lezing die dat verandert zonder de naam van
   Alaa te kosten, en ik heb er vandaag geen gezocht.

---

## Gebruikte skills

Elk citaat is met `sed -n "<n>p"` van schijf gehaald uit
`/home/user/personalcommandguide/.claude/skills/<skill>/SKILL.md`; de regelnummers
komen dus niet uit de geserveerde tekst. **Aanroepvorm per 1.44:**
`marketing-psychology` (`$`-telling boven nul) **zonder argument**, `cold-email`
(telling nul) met het argument `subjects`.

| Skill | Waar toegepast | Wat het concreet veranderde |
|---|---|---|
| `marketing-psychology` | Op de weging van lane D's post-datumbevinding, op mijn eigen ronde-indeling en op het oordeel over de bindende poort | `### Local vs. Global Optima` (`:60`) met `A local optimum is the best solution nearby, but a global optimum is the best overall. Don't get stuck optimizing the wrong thing.` (`:61`) is de reden dat 1.59 een regel is geworden en geen bevinding: lane D optimaliseerde het *lezen* van een post-URL (lokaal) terwijl de vraag is of er ooit een post-URL kómt (globaal), en die herkadering is de hele waarde van zijn meting. `### Map ≠ Territory` (`:85`) met `Models and data represent reality but aren't reality itself.` (`:86`) heeft mij ervan weerhouden het getal honderd in 1.59 op te nemen: "onder circa honderd volgers" is een model dat op één gemeten account rust, en het verschijnsel is het terrein. Dezelfde regel zit onder mijn goedkeuring van lane D's opmerking dat de "bindende poort" een eigenschap van de **bron**volgorde is en niet van de markt — een bron die de leeftijd als eerste toont, laat de leeftijd als eerste vellen. `### Theory of Constraints` (`:65`) met `Every system has one bottleneck limiting throughput. Find and fix that constraint before optimizing elsewhere.` (`:66`) stuurde mijn eigen vier ronden: ik heb ze niet over 123 dossiers verdeeld maar uitsluitend in poort (a) van de drie open dossiers gestoken, want dat is de enige poort waarop vandaag een kaart kon ontstaan. `### Survivorship Bias` (`:415`) met `Focusing on successes while ignoring failures that aren't visible.` (`:416`) is waarom ik lane D's positieve controles (`@omroepbrabant` en drie andere accounts) apart heb gewogen van zijn negatieve: zonder die vier URL's zou "wij vinden geen post-URL's" net zo goed over de zoekopdracht kunnen gaan als over het account. `### Second-Order Thinking` (`:80`) met `Consider not just immediate effects, but the effects of those effects.` (`:81`) zit onder mijn doorgifte van de 1.54-botsing: het eerste-orde-effect van het ronde-verbod is rust op uitgeputte dossiers, het tweede-orde-effect is een verkoopmail aan een ondernemer die net failliet is verklaard |
| `cold-email` | Op de vraag of uit één van de drie open poort-(a)-dossiers vandaag alsnog een verzendklare tekst kon komen (argument `subjects`) | De skill was ook bij mij **beslissend en niet decoratief**. `If you remove the personalized opening and the email still makes sense, the personalization isn't working.` (`:41`) heb ik op Glazenwasserij Schouwen toegepast, het dossier dat het verst kwam: mijn sterkste denkbare opener is "een jong bedrijf met veel ervaring uit de familie — dat staat op uw eigen site", en dat is een citaat *over* hem en geen lek *van* hem; haal hem weg en het bericht staat ongeschonden. Lane D kwam zelfstandig tot dezelfde uitkomst en ik bevestig hem. `Short, boring, internal-looking. The subject line's only job is to get the email opened — not to sell.` (`:91`) met `- 2-4 words, lowercase, no punctuation tricks` (`:93`) botst onverminderd met poort (g) van de owner, die een **gecheckt detail** binnen 45 tekens eist; de botsing is op 14-09 in het voordeel van de owner beslecht en blijft genoteerd zodat zij niet elke dienst opnieuw wordt uitgevochten. `Cold email is ruthlessly short. If a sentence doesn't move the reader toward replying, cut it.` (`:37`) leverde de scherpste formulering van mijn oordeel: het kortste bericht dat ik vandaag kon sturen, is geen bericht — er is voor geen van de drie dossiers een opener die én persoonlijk is én op een vastgesteld feit rust |
| `prospecting` | Op poort (b) van de drie open dossiers en op de weging van mijn eigen vondsten | `- **High**: confirmed by at least two independent sources or official business page` (`:68`) is waarom ik mijn eigen vondst bij SOLID Reiniging — vestigingsnummer 000046671900 op `alleglazenwassers.nl` — noteer als een **tweede registerdrager** en niet als een sterker oordeel: het bevestigt de leeftijd, het raakt poort (a) niet. Dezelfde regel houdt `Hondentrimsalonparadise@gmail.com` op één bron (de eigen Facebook-pagina), precies zoals lane D hem boekte |
| `copy-editing` | Als laatste pas over dit bestand | Sweep 4 (**Prove It**, `:117`) haalde twee beweringen uit een eerdere versie van dit oordeel. Ik had over lane D's post-datumbevinding "de route werkt niet voor kleine accounts" geschreven als vaststelling; dat rust op één gemeten volgersaantal en staat nu als verschijnsel-met-hypothese, wat ook in 1.59 zelf is doorgevoerd. En ik had bij lane C "de regio is uitgeput" overgenomen uit zijn tekst als mijn eigen conclusie, terwijl het zijn meting is (24 van 75) en niet mijn oordeel — het staat nu als zijn getal met zijn dragers |
| `marketing-council` | **Niet ingezet** | Zij is per `agents/skills-toewijzing.md` voor het weekrapport, waar meerdere perspectieven tegen het plán aankijken. Vandaag is een verificatiedienst met vaste poorten; een raad erbij halen zou het oordeel verzachten op een dag waarop de poorten juist hard moeten zijn |
| `pricing` · `competitors` · `revops` · `attribution` | **Niet ingezet** | Geen kaart, geen prijsvraag, geen pijplijnvraag. De twee pakketkeuzes die in lane D's dossiers staan (299 portfoliovormig bij Schouwen, 549 boekingsvormig bij Paradise) volgen uit de order van de owner in `agents/outreach-agent.md` en niet uit een prijsbeslissing, en ik heb ze op die grond bevestigd |
| `product-marketing` | Ingezet als **eigenaar** | Drie regels toegevoegd (1.57, 1.58, 1.59) met changelogregel, 1.60 vrijgelaten, en acht kandidaten geparkeerd. Eén van de acht is een **correctie op mijn eigen 1.44** |
| `customer-research` | **Niet ingezet, en dat is dezelfde leemte die lane C zelf noteert** | Het fundament schrijft voor dat het skillgebruik op een kaartloze dienst naar de onderzoeksskills verschuift. Lane C noteerde dat hij hem miste; ik ook. Mijn dienst liep op tellingen, registers en poortbewijs en niet op segmentvragen. **Voor de eerstvolgende kaartloze dienst zet ik hem op één vraag:** welk segment in lane C's regio laat na 123 dossiers nog wél een vindbaar, gedateerd spoor achter — want dat is de vraag waarop negen diensten op rij stuklopen |

---

## Voor de owner — in twee regels

1. **Nul kaarten uit lanes C en D uit 123 beoordeelde dossiers.** Beide lanes deden
   hun werk goed; de poort die het vaakst veelt is de leeftijd, en de poort die niets
   meer doorlaat is (a). De reden dat (a) niet sluit, is vandaag voor het eerst
   gemeten in plaats van vermoed: de route die het fundament als vervanging voor
   `WebFetch` aanwijst, bestaat niet voor kleine accounts — dus voor precies de
   bedrijven die u wilt hebben. Dat maakt het netwerkbeslispunt dringender dan het
   tot nu toe las.
2. **Twee dossiers liggen op één blik van een kaart af**: Glazenwasserij Schouwen
   (Sommelsdijk) en Honden Trimsalon Paradise (Spijkenisse). Bij allebei staan zeven
   poorten dicht, is het e-mailadres hard, is de insolventieronde schoon en ontbreekt
   alleen een datum die op hun eigen pagina staat. **Eén paginalading sluit twee
   kaarten.**

---

## Samenvatting — één regel per oordeel

| # | Oordeel | Onderwerp |
|---|---|---|
| 1 | **GOEDGEKEURD** | Lane C — alle tellingen reproduceren (51 rijen, 75 dossiers, 8 belregels, 9 gronden), en alle vier de correcties van 15-09 zijn uitgevoerd |
| 2 | **AFGEKEURD** | Lane C — derde `geen-emailadres.md`-rij stond onder lane A's kop; "Twee zaken" boven drie rijen. Door mij gecorrigeerd; de lane-kolom ving de fout wél op |
| 3 | **AFGEKEURD** | Lane C — `marketing-psychology` met argument aangeroepen, tegen 1.44. Nul schade: alle 21 citaten van schijf gehaald en alle 21 exact |
| 4 | **GOEDGEKEURD** | Lane C — SOLID Reiniging: vijf bewijsroutes + insolventieronde compleet; mijn eigen ronde bevestigt dat poort (a) dicht blijft. Geen kaart, geen tekst — terecht |
| 5 | **GOEDGEKEURD** | Lane D — alle zes sectorcommando's reproduceren; de rijnummers partitioneren 1 t/m 48 exact, zonder gat en zonder dubbel |
| 6 | **AFGEKEURD** | Lane D — twee illustratieve getallen reproduceren niet (bellijst: twee vs. **drie**; geen-emailadres: zeven vs. **zes**). De verankerde tellingen zijn alle acht juist |
| 7 | **AFGEKEURD** | Lane D — de leeftijdspoort heet "(c)" in het tekortblok; (c) is de reviewclaimpoort, de leeftijdspoort is **(f)** |
| 8 | **GOEDGEKEURD** | Lane D — mijn order van 15-09 volledig uitgevoerd: vrij quotum eerst, geen tweede bronmeting, en de vijf bewijsroutes op **beide** open poort-(a)-dossiers (vorige week: nul) |
| 9 | **GOEDGEKEURD** | Lane D — Schouwen en Paradise: dragers nagelopen en bevestigd, plus twee vondsten van mij (telefoonnummer bij Paradise; Trustoo terecht niet als (a)-drager). Poort (a) blijft bij allebei open |
| 10 | **GOEDGEKEURD** | Poort (h) — lane C 21/21 citaten exact; lane D alle citaten exact op één na, die geen regelnummer draagt (*Jobs to Be Done*, r. 36). Beide lanes halen de poort; elk mist de helft die de ander heeft |
| 11 | **GOEDGEKEURD** | Lane D's post-datumbevinding, gewogen tegen 1.38 en 1.56: zij weerspreekt 1.56 niet maar vult hem aan — de route faalt op de **aanvoer**, niet op de decodering. In een derde sessie door mij gereproduceerd |
| 12 | **VASTGELEGD** | Fundament 1.57 (leeftijdsbotsing → "niet vastgesteld"), 1.58 (TransFirm-dubbelgetal), 1.59 (de 1.38/1.56-route faalt op aanvoer). 1.60 blijft vrij; acht kandidaten geparkeerd |

**Kaarten goedgekeurd vandaag uit lanes C en D: 0.** Dagnorm dertig niet gehaald en
als tekort gemeld, zonder één poort te verzetten.

Azzouz, 16 september 2026
