# Verificatie 18 september 2026 — lanes A en B

Azzouz, verificatiedienst van vrijdag 18 september 2026. Ik verifieer uitsluitend
`marketing/outreach/2026-09-18-a.md` (Groningen, Friesland, Drenthe) en
`marketing/outreach/2026-09-18-b.md` (Overijssel, Gelderland, Flevoland). Lanes C en D
liggen bij de tweede sessie en ik heb die bestanden niet aangeraakt.

**De telling, zelf gedraaid, met het commando dat de opzichter noemt:**

```
$ grep -cE '^## [0-9]+\. ' marketing/outreach/2026-09-18-a.md   -> 0
$ grep -cE '^## [0-9]+\. ' marketing/outreach/2026-09-18-b.md   -> 0
```

Nul genummerde kaarten in lane A, nul in lane B. Dat komt overeen met wat beide lanes
zelf melden en met de opgave van de opzichter. Er is vandaag dus geen kaart om door de
poorten (a) tot en met (i) te halen; mijn dienst bestaat uit de vier opdrachten die
daarvoor in de plaats komen, plus mijn eigen ronden op de enige poort waar vandaag nog
een kaart vandaan had kunnen komen.

Eén verzendklare tekst ligt er wél: lane B heeft Berkel Hoveniers met zeven dichte
poorten en één open poort in het bestand gelegd, uitdrukkelijk als bevinding en niet
als kaart. Ik beoordeel die tekst hieronder alsof hij een kaart was, want als poort (a)
morgen sluit gaat hij weg zoals hij daar ligt.

---

## GOEDGEKEURD — opdracht (1) voor lane A: elke samenvattende telling is reproduceerbaar uit de regels erboven

Ik heb alle tellingen van lane A zelf uitgedraaid, niet gecontroleerd op de uitkomst die
het bestand zelf noemt maar op de regels waaruit zij moet volgen.

```
$ f=marketing/outreach/2026-09-18-a.md
$ grep -cE "^\| [0-9]+ \|" $f                                   -> 64
$ grep -E "^\| [0-9]+ \|" $f | grep -c "GROND: ledger"          -> 31
$ grep -E "^\| [0-9]+ \|" $f | grep -c "GROND: te-lang"         -> 16
$ grep -E "^\| [0-9]+ \|" $f | grep -c "GROND: bestemming"      ->  7
$ grep -E "^\| [0-9]+ \|" $f | grep -c "GROND: lead"            ->  6
$ grep -E "^\| [0-9]+ \|" $f | grep -c "GROND: geen-lek"        ->  3
$ grep -E "^\| [0-9]+ \|" $f | grep -c "GROND: buiten-sector"   ->  1
$ grep -c "^| \*\*Totaal\*\*" $f                                ->  1
```

Alle zeven komen precies uit; 31+16+7+6+3+1 = 64.

**En ik ben een stap verder gegaan dan de som, want een kloppende som bewijst geen
kloppende toewijzing.** Ik heb de zes rijnummerreeksen uit de tekorttabel uitgeschreven
en elk rijnummer naast het `GROND:`-veld van díe rij gelegd:

| Reeks in de tekorttabel | Aantal | Klopt elk rijnummer met zijn eigen `GROND:`? |
|---|---|---|
| ledger: 3, 19-48 | 31 | ja, alle 31 |
| te-lang: 1, 6-16, 56-58, 60 | 16 | ja, alle 16 |
| bestemming: 49-55 | 7 | ja, alle 7 |
| lead: 17, 59, 61-64 | 6 | ja, alle 6 |
| geen-lek: 2, 4, 5 | 3 | ja, alle 3 |
| buiten-sector: 18 | 1 | ja |

Nul afwijkingen op 64 dossiers. De reeksen partitioneren 1 tot en met 64 zonder dubbel
en zonder gat; ik heb dat machinaal nagerekend en niet op het oog.

**De drie bestemmingsborden, ook zelf gedraaid:**

```
$ grep -c "2026-09-18 lane A" marketing/outreach/contacted.md                    -> 36
$ grep -cE "^\|.*\| 2026-09-18 lane A\. " marketing/outreach/bellijst.md         ->  1
$ grep -cE '^\|.*\| A \| 2026-09-18 \|$' marketing/outreach/geen-emailadres.md   ->  7
```

36 + 1 + 7 = 44, precies zoals lane A schrijft, en de 36 is uit de dossiertabel te
herleiden: 64 − 31 poort-(e)-dossiers = 33 die op een andere grond vielen, min Glimmers
(rij 16, draagt al een ledgerrij) = 32 nieuw, plus 4 rijen op bestaande namen = 36.

**De botsingsregel, het duurste getal van het bestand, reproduceert woordelijk:**

```
$ grep -E "2026-09-(11|12|13|14|15|16|17) lane A" marketing/outreach/contacted.md \
    | grep -oE "Sector: [^·]+" | sed 's/Sector: //' | sort | uniq -c | sort -rn | head -5
   70 glazenwasserij · 48 hovenier · 31 glazenwasser · 16 schilder
   15 glazenwasserij (geen-websitegroep)
```

Vijf van de vijf getallen komen uit. Ook de UTM-controle klopt van schijf: de tien
`slug:`-regels in `zevren/lib/local/sectors.ts` staan op 40, 68, 96, 124, 152, 180, 208,
234, 260 en 286, in exact de volgorde die lane A noteert. Er is geen sectorpagina voor
glazenwasserij en geen voor bestrating — lane A's derde botsing is feitelijk juist, en
de beslissing om geen belofte van de hoveniersspagina te lenen is 1.40(b) correct
toegepast.

**Twee onafhankelijke controles op de inhoud, niet op de telling.** Ik heb twee
bevindingen van lane A met een eigen zoekopdracht nagejaagd omdat zij het bestand
dragen:

- **`fis-kozijnen.nl` bestaat en voert het adres in de titel.** Mijn eigen ronde geeft
  woordelijk `ᐅ Glazenwas Service Friesland 06-10400553 gs-frl@hotmail.com` op
  `fis-kozijnen.nl/friesland/leeuwarden/glazenwas-service-friesland/`. Vierde lid van de
  1.52-familie, bevestigd door een tweede agent.
- **Glimmers, Winschoten, is terecht omgedraaid.** Mijn ronde geeft Watertorenstraat 69,
  9671 LH, een eigen domein met `/telescoopbewassing/`, `/nano-wax/` en `/privacy/`, en
  "sinds 2002" op de eigen site. Lane A's correctie op zijn eigen rij van 14-09 —
  van `lead - poort open (leeftijd)` naar `not fit - te lang gevestigd` — is juist.
  Bijvangst: `/telescoopbewassing/` is een zesde geïndexeerde pagina die lane A niet
  noemt, wat zijn lek-vaststelling alleen maar versterkt.

---

## GOEDGEKEURD MET ÉÉN CORRECTIE — opdracht (1) voor lane B: de tellingen kloppen, één interne telling spreekt zichzelf tegen

**Alles wat te tellen is, telt.** Ik heb het zelf gedraaid:

```
$ f=marketing/outreach/2026-09-18-b.md
$ grep -cE '^\| [0-9]+ \|' $f                                                   -> 74
$ grep -c "2026-09-18 lane B" marketing/outreach/contacted.md                   -> 37
$ grep -cE '^\|.*\| B \| 2026-09-18 \|$' marketing/outreach/geen-emailadres.md  ->  2
$ grep -cE "^\|.*\| 2026-09-18 lane B\. " marketing/outreach/bellijst.md        ->  0
```

74 − 34 (poort e) − 3 (geparkeerd) = 37 klopt. De tekorttabel telt
34 + 24 + 7 + 3 + 2 + 2 + 2 = 74. De sectorverdeling 24 + 26 + 22 + 2 = 74 klopt met de
rijnummers van de vier dossiertabellen (1-24, 25-50, 51-72, 73-74).

**En opnieuw de toewijzing en niet alleen de som.** Ik heb elk van de 74 rijnummers uit
de zeven reeksen naast de kolom *Bindende grond* van díe rij gelegd: nul afwijkingen. De
zeven reeksen partitioneren 1 tot en met 74 zonder dubbel en zonder gat, machinaal
nagerekend.

De botsingsregel reproduceert exact, alle vier de getallen:

```
$ for s in hovenier glazenwasser schilder stukadoor; do
>   grep "2026-09-\(11\|12\|13\|14\|15\|16\|17\)" marketing/outreach/contacted.md \
>     | grep -c "Sector: $s"; done
349 · 544 · 95 · 49
```

**CORRECTIE — één interne telling spreekt haar eigen lijst tegen, en het is precies het
gebrek waarop lane B gisteren correctie 3 kreeg.**

In de bevinding over `glazenwassertarieven.nl` schrijft lane B: *"Van de acht titels
hierboven stonden er **zes** al in mijn eigen ledger: Waalheuvel (rij 45), Joosten (46),
OFG (47), JF-Millingen (48), Schoonderbeek (49) en Stadshagen (43). Nieuw waren er
**twee**, Demalano (30) en Jordens Glasreiniging (28) — 6 + 2 = 8."*

Driehonderd regels lager, in de rem onder kandidaatregel 1, staat: *"**Zeven** van de
acht titels van vandaag stonden al in mijn eigen ledger."*

Zes of zeven, en het bestand kiest niet. Ik heb het ledger zelf gelezen en **zes** is
het juiste getal:

```
$ grep -in "Waalheuvel\|Joosten Glazenwasserij\|OFG\|JF-Millingen\|Schoonderbeek\|Stadshagen Glazenwasserij" \
    marketing/outreach/contacted.md
2803 Waalheuvel (15-09) · 2863 Joosten (15-09) · 2518 OFG (14-09)
2865 JF-Millingen · 2955 Stadshagen (16-09) · 2959 Schoonderbeek (16-09)
$ grep -in "Demalano\|Jordens" marketing/outreach/contacted.md
3275 Jordens (2026-09-18 lane B, rij 28) · 3277 Demalano (2026-09-18 lane B, rij 30)
```

De zes dragen een ledgerdatum van vóór vandaag; Demalano en Jordens dragen de rij die
lane B vandaag zélf heeft geschreven. Zes is dus hard, zeven is een schrijffout.

**Wat het wel en niet betekent, en ik ben daar precies in.** De conclusie van de
kandidaatregel verandert niet: bruikbare níeuwe namen levert de route hoe dan ook nul
op, want Jordens viel op de leeftijd (KvK 09171388, 25-05-2007) en Demalano gaf in twee
ronden geen registergetal. De rem staat dus overeind. Maar de rem is het enige deel van
een kandidaatregel dat de lezer tegen de regel beschermt, en een rem die zichzelf één
naam te zwaar maakt, wordt op zondag niet nagerekend maar overgenomen. **Correctie: het
getal in de rem is zes.**

**Voor morgen, één regel:** een getal dat twee keer in hetzelfde bestand staat, hoort
één keer geteld en één keer geciteerd — schrijf in de tweede vindplaats het rijnummer of
de sectie erbij waar de telling vandaan komt, zodat de twee niet los van elkaar kunnen
gaan lopen.

---

## GOEDGEKEURD MET ÉÉN UITZONDERING — opdracht (1), tweede helft: heeft lane B de drie correcties van gisteren toegepast?

| Correctie van 17-09 | Toegepast? | Wat ik van schijf zie |
|---|---|---|
| 1 — geen citaat op een lege regel; `grep -n` opnieuw draaien ná de laatste bewerking | **Ja, volledig** | Ik heb alle **24** citaten van lane B van schijf gehaald. Geen enkel wijst naar een lege regel, en alle 24 dragen de geciteerde tekst woordelijk. De twee die gisteren sneuvelden staan vandaag goed: `prospecting/SKILL.md:196` (`- [ ] Remove duplicates (by domain for SaaS/B2B, by business + address for Local SMB)`) en `:25` (de branchetabel, `| **Local SMB** | ...`) |
| 2 — regelnummers in de claimcontroletabel met `grep -n` genereren op het moment van schrijven | **Ja, volledig** | Alle zeven vindplaatsen kloppen nu: `offer.ts` r.22 = `{ key: "starter", price: 299, needs: "new-website" },`; `sectors.ts` r.208 = `slug: "hoveniers"`, r.211 = `planKey: "starter"`, r.213 = de `intro` met "Een tuin wordt gegund op zicht", r.215 = de `proof` met de conceptbouwer, r.221 = "299 euro eenmalig, exclusief btw … De prijs staat op de site", r.225 = "je kunt later zelf nieuwe projecten toevoegen". De drie die gisteren verschoven waren (219→221, 226→225, 213→215) zijn alle drie gerepareerd |
| 3 — interne tellingen moeten kloppen met hun eigen opsomming | **Nee — één nieuw geval** | De zes-tegen-zeven hierboven. Andere soort telling (een ledgerteller in plaats van een rijenopsomming), zelfde gebrek: het getal in de lopende tekst is niet opnieuw tegen de lijst gelegd |

**Eén waarschuwing die geen afkeuring is, maar wel de volgende val.** Lane B citeert in
de `cold-email`-rij `references/subject-lines.md:5` en daarna alleen `:18`. Dat `:18`
klopt — `## Capitalization: lowercase wins` staat op regel 18 van *subject-lines.md* —
maar `cold-email/SKILL.md:18` is **een lege regel**. Het citaat leunt dus op de
leesvolgorde van de zin om niet precies de fout van gisteren te zijn. **Schrijf het
bestand uit zodra het vorige citaat naar een referentiebestand wees.**

---

## GOEDGEKEURD — opdracht (2): de twee omgekeerde kaarten van lane B, en de omkering was terecht

**Welke twee, en op welke ronde.** De omkering staat op de verbrede lekronde van 1.41
(`projecten OR impressie OR gerealiseerd OR "ons werk" OR inspiratie OR portfolio OR
referenties OR contact`), níet op de smalle ronde van 1.20(b)
(`reviews OR referenties OR projecten OR ervaringen OR klanten OR tarieven`), die bij
allebei niets gaf:

| Dossier | Rij | Wat de verbrede ronde teruggaf | Is de ronde genoteerd? |
|---|---|---|---|
| Hoveniersbedrijf Borink, Enschede (OV) | 4 | `hoveniersbedrijfborink.nl/projecten/terrasaanleg/`, `/over-ons/`, `/contact/`, `/nieuws/groene-oase-in-enschede/` | **Ja, met vier exacte paden** |
| G.G. Schilderwerken, Deventer (OV) | 51 | `ggschilderwerken.nl/over-ons/` met reviews op naam en een projectenselectie | **Gedeeltelijk — één pad, en de projectenselectie zonder eigen pad** |

**De omkering was terecht, en zij is de goede uitkomst en niet de dure.** Dit is exact
de klasse van Stukadoorsbedrijf Kommerkamp in Diepenveen op 14-09: een dossier dat op de
smalle ronde een lek leek te dragen, waar één gerichte zoekopdracht `/impressie/` als
zijn portfolio bovenhaalde. Toen kostte dat een ingetrokken kaart; vandaag kost het er
twee, en allebei vóór het schrijven in plaats van erna. Bij Borink en G.G. stond de hoek
("je laat je afgeronde werk nergens zien") al vast toen de ronde hem omkeerde. Twee
mails die een ondernemer vertellen dat hij mist wat hij hééft, zijn twee verbrande
adressen; de kosten van de extra ronde zijn eenzijdig.

**Waarom ik de ronde ook echt geloof en niet alleen de uitkomst.** 1.41 eist een
negatieve controle en lane B levert die: dezelfde verbrede ronde op Buitenste Binnen
Hoveniers gaf uitsluitend `/`, `/tuinaanleg-3/` en `/tuinonderhoud/` — drie pagina's,
geen projectenpad. Een ronde die bij drie dossiers drie verschillende uitkomsten geeft,
onderscheidt; een ronde die overal hetzelfde geeft, zou alleen een rationalisatie zijn.
Dat is het verschil tussen een meting en een uitvlucht, en lane B staat aan de goede
kant.

**Twee dingen die beter moeten, geen van beide een afkeuring:**

1. **Het pad van de projectenselectie bij G.G. Schilderwerken ontbreekt.** "Reviews op
   naam en een projectenselectie" op `/over-ons/` is een waarneming over een pagina,
   geen tweede geïndexeerd pad. Bij Borink kan ik de omkering narekenen, bij G.G. moet
   ik lane B geloven. Noteer het pad, of noteer dat het lek op `/over-ons/` zelf staat.
2. **De zoekopdracht staat één keer in het bestand, bij de negatieve controle.** Zet hem
   per omgekeerd dossier, want de omkering is de duurste beslissing van de dag en moet
   los van de negatieve controle reproduceerbaar zijn.

---

## AFGEKEURD — opdracht (3): de dossiers op poort (a), na mijn eigen vier ronden

Twee dossiers staan vandaag in lanes A en B open op poort (a), allebei in lane B: rij 1
(Berkel Hoveniers) en rij 2 (Buitenste Binnen Hoveniers). In lane A staat geen enkel
dossier op poort (a) open — daar valt elk dossier eerder, en de vijf routes zijn op
sectorniveau gedraaid.

### GOEDGEKEURD als procesuitvoering — Berkel Hoveniers, Enschede (OV), rij 1

**Alle vijf de toegewezen bewijsroutes zijn gedraaid en per route staat er één regel**
(KvK-mutatie, gemeentelijke/GGD-vergunning, inspectie of rapport, SBB-erkenning binnen
twaalf maanden, vacature met plaatsingsdatum), **plus de insolventieronde van 1.40a**
("Eén ronde op de naam plus `faillissement`: niets"), **plus een zesde route** (1.38/1.56
op Facebook, die uitsluitend de profiel-URL gaf en geen permalink — de aanvoerkant van
1.59). Dat is meer dan de opdracht eist en het is per route leesbaar. Dit is hoe een
poort-(a)-dossier eruit hoort te zien.

### AFGEKEURD als kaart — mijn eigen vier ronden bevestigen dat poort (a) open blijft

Ik heb er zelf vier ronden in gestoken, op vier verschillende assen, omdat dit het enige
dossier van de dag was waar een ronde nog een kaart kon opleveren:

| Mijn ronde | Wat zij gaf |
|---|---|
| `"Berkel Hoveniers" Enschede hovenier` | TransFirm (KvK 76927059, Menadostraat 8, 7541 AL, 2-5 werkzame personen), oozo, telefoonboek, Facebook. Geen datum |
| `"berkelhoveniers" facebook 2026 tuin Enschede` | Alleen de profiel-URL `facebook.com/berkelhoveniers`. De samenvattende alinea noemt zichtbare berichten uit **2022** — onbruikbare laag (1.20a) én vier jaar oud |
| `"Berkel Hoveniers" OR "Hoveniersbedrijf Berkel" Enschede vacature OR overkapping OR project 2025 2026` | Uitsluitend Indeed-**regio**pagina's: "Hovenier - vacatures in Gemeente Enschede - 6 februari 2026" en "Hoveniers - vacatures in Enschede - 13 april 2026". Dat is de datum van de vacaturebank (1.48), niet van deze werkgever — **exact wat lane B route 5 noteert, door mij onafhankelijk gereproduceerd** |
| `trustoo.nl OR werkspot OR hovenier.nl "Berkel Hoveniers" Enschede beoordelingen` | Het bedrijf staat op **geen enkel** reviewplatform. Trustoo geeft Neinders Hoveniers voor Enschede, Werkspot geeft de stadspagina. Berkel komt er niet in voor |

Vier ronden, nul gedateerde sporen. **Poort (a) blijft open; lane B's besluit om de
tekst te laten liggen in plaats van te versturen is juist.**

**En ik heb een tweede grond gevonden die lane B niet noemt en die zwaarder weegt dan
de datum.** Mijn vierde ronde laat zien dat Berkel op geen enkel reviewplatform staat en
dat zijn Facebookpagina **nul reviews** draagt. De staande order van de owner van
24 augustus zegt: *"Het prime target is het hoog gewaardeerde bedrijf zonder website: zij
hebben de klanten en de reviews al, en nergens om iemand heen te sturen. Leid het bericht
met hun score — dat is hun eigen bewijs."* Berkel is geen hoog gewaardeerd bedrijf zonder
website; hij is een **onzichtbaar** bedrijf zonder website. Er is geen score, geen
recensie, geen vacature, geen verhuizing, geen tweede man — geen enkel groeisignaal uit
de lijst van de owner van 24 augustus avond. De regel die de owner per kaart eist
("WAAROM is dit een kans van formaat: wat groeit er, en wat lekt er") kan bij dit dossier
alleen de tweede helft invullen.

**Dat is geen schrijffout van lane B maar een eigenschap van het dossier**, en het hoort
in het dossier te staan: zodra poort (a) sluit, moet iemand alsnog beoordelen of een zaak
zonder één zichtbare klant het doelwit van de owner is. Ik zet dat hier zodat de
beslissing niet stilzwijgend op de datum alleen komt te liggen.

### GOEDGEKEURD — de verzendklare tekst zelf, tegen de zeven eisen en tegen poort (i)

Als poort (a) morgen sluit, kan deze tekst weg zoals hij ligt. Ik heb hem tegen de
zeven eisen van de STAANDE ORDER van 25 augustus avond gelegd en tegen de
handtekeningpoort:

| Eis | Oordeel |
|---|---|
| Het lek in geld of tijd, niet in techniek | **Ja.** "Dat lek zit niet in techniek maar in omzet … Je merkt het ook niet: die man heeft nooit gebeld." Het verlies is onzichtbaar gemaakt, en dat is precies wat het laat landen |
| Bewijs uit zijn eigen zaak | **Ja, maar dun — en aantoonbaar zo dun als het kan.** De enige bewering over zijn zaak is dat zijn werk uitsluitend op Facebook leeft. Mijn eigen ronde bevestigt dat er geen score en geen reviewprofiel bestaat om mee te leiden. Het is het enige eigen feit dat er ís |
| Eén concreet beeld | **Ja.** De man die langs een aangelegde tuin loopt en 's avonds op de bank zoekt. Eén beeld, door het hele bericht volgehouden, geen tweede |
| De demo als bewijslast | **Ja, en correct gekozen.** De hoveniers-sector draagt géén `demoSlug` (gecontroleerd van schijf), dus lane B belooft de conceptbouwer en geen demo — 1.31/1.40(b) juist toegepast, één keer genoemd, met een concrete uitnodiging |
| De prijs zonder verontschuldiging | **Ja.** "299 euro eenmalig, exclusief btw. Die prijs staat gewoon op de site, er hoeft geen gesprek voor ingepland te worden" |
| Geen schaarste, geen haast, geen "wij zijn klein" | **Ja.** Nul voorkomens |
| 160 tot 220 woorden | **Ja: 210**, door mij geteld met `sed -n '/^Iemand in Enschede/,/^Zegt het je iets/p' … \| wc -w` |
| Poort (i) — de handtekening | **Ja, exact.** `Met vriendelijke groet, / Alaa / ZEVREN, Maastricht / 06-30958710 · zevren.nl`, inclusief het nummer. Geen correctie nodig |

**De onderwerpregel haalt de swipe-test.** `Je tuinen staan alleen op Facebook` telt
**34 tekens** (`wc -m`, door mij nageteld), zet het gecheckte detail in de eerste 34, en
bevat niet "website", niet "ZEVREN", geen uitroepteken en niets dat naar een aanbieding
ruikt. Lane B's afweging klopt ook: kandidaat B (`Wie je werk wil zien, moet eerst
bellen`) valt terecht op de verwijdertoets van `cold-email/SKILL.md:41`, want er blijft
na verwijdering geen detail over; kandidaat C besteedt negen tekens aan een plaatsnaam
die de eigenaar al weet.

**De harde afkeurregel van 25-08 is niet geschonden.** Het adres
`berkelhoveniers@hotmail.com` staat **niet** op een eigen domein, dus de opening
"je hebt geen eigen site" botst niet met het adres. Dat is precies de feitelijke fout die
de regel bedoelt en zij doet zich hier niet voor. Poort (b) is bovendien op de juiste
grond dicht: de exacte-tekenreeksronde geeft zijn eigen Facebookpagina, wat de *official
business page*-route van `prospecting/SKILL.md:68` is en géén tweede onafhankelijke bron
— lane B noemt het ook zo en telt het niet tot "High" op.

### AFGEKEURD als procesuitvoering — Buitenste Binnen Hoveniers B.V., Wierden (OV), rij 2

**Dit dossier staat open op poort (a) en de vijf toegewezen routes zijn er niet per route
genoteerd.** De hele verantwoording is één regel in de dossiertabel: *"Poort (a) open
(enig gedateerd spoor 18-09-2024, vierentwintig maanden)"*. Dat is het Zoethout-gebrek van
14-09 dat terugkomt: een uitkomst zonder de routes die haar dragen. De opdracht van
vandaag vraagt uitdrukkelijk of de vijf bewijssoorten en de insolventieronde
**daadwerkelijk zijn gedraaid en genoteerd**, en bij dit dossier kan ik dat niet
vaststellen.

**Het gevolg is hier nul, en dat zeg ik erbij.** Het dossier is los daarvan dood: de
verbrede lekronde gaf drie pagina's en geen projectenpad, maar de samenvattende alinea
van diezelfde ronde meldt recente projectfoto's, dus het lek is **niet vastgesteld** —
en op een niet-vastgesteld lek ligt geen tekst. Lane B trekt die conclusie zelf en
gebruikt de onbruikbare laag in de enige richting die geen schade kan doen. Dat is
precies goed.

**Mijn eigen ronde voegt er één ding aan toe, en het maakt het dossier zwakker in plaats
van sterker.** Het gedateerde spoor waarop lane B zich beroept is vrijwel zeker het
artikel `dewiezer.nl/zakelijk/zakelijk/23144/tuinontwerp-is-helemaal-mijn-ding` over
Christian van Dijk. **Dat artikel draagt geen datum in zijn URL en geen datum in zijn
titel.** Per 1.20(a) staat die 18-09-2024 dus niet in de bruikbare laag. Het artikel
zegt bovendien dat hij het bedrijf "twee jaar" heeft, wat naast het B.V.-nummer van 2024
de omzettingsvraag van 1.43/1.60 oproept — de **vier jaar** die lane B in zijn
samenvatting noemt, rust op diezelfde onbruikbare datum. Uitkomst ongewijzigd, boeking
scherper: **leeftijd niet vastgesteld**, poort (a) open, geen kaart.

### GEEN RONDE — Stukadoorsbedrijf JdN, Zwolle (OV), rij 72, en de geparkeerde dossiers

Lane B heeft rij 72 als "geparkeerd (week 37) op poort (a) — geen ronden" geboekt. Ik heb
één controleronde gedraaid en die bevestigt dat dat juist is: het ledger draagt mijn eigen
sluiting van 13-09 letterlijk — *"Geen ronden meer in dit dossier tot de owner beslist over
de verruiming van poort (a) of over het belkanaal"*, na twaalf ronden over twee agenten en
`EGRESS_BLOCKED` op zes van zes domeinen. **Ik stop daar dus ook.**

**Eén punt voor de opzichter:** JdN staat niet op de lijst van tien geparkeerde dossiers
in mijn dienstopdracht, terwijl hij onder exact hetzelfde regime valt. Zet hem erbij, dan
hoeft de volgende dienst dat niet opnieuw af te leiden. De twee dossiers van lane B die
wél op die lijst staan — Liever Buiten (rij 24) en Bubbels (rij 50) — hebben correct nul
ronden gekregen.

---

## GOEDGEKEURD MET ÉÉN CORRECTIE — opdracht (4): poort (h), de skillstabel, met regelnummers die kloppen

Beide lanes sluiten af met een gevulde `## Gebruikte skills`-tabel, en beide
verantwoorden ook de skills die zij **niet** gebruikten met een grond in plaats van met
een holle regel. Dat is de vorm die de owner eist.

**Ik heb alle vijftig citaten van schijf gehaald — 26 in lane A, 24 in lane B — en elk
regelnummer naast zijn regel gelegd. Alle vijftig kloppen: geen lege regel, geen
verschoven blok, en de geciteerde tekst staat er woordelijk.** Steekproef van de
zwaarste:

```
$ sed -n '68p;200p;61p' .claude/skills/prospecting/SKILL.md
$ sed -n '37p;41p;45p;49p;93p' .claude/skills/cold-email/SKILL.md
$ sed -n '5p;18p'  .claude/skills/cold-email/references/subject-lines.md
$ sed -n '65p;66p;80p;81p;85p;86p;415p;416p' .claude/skills/marketing-psychology/SKILL.md
$ sed -n '30p;31p;36p;37p;39p;40p' .claude/skills/competitor-profiling/SKILL.md
$ sed -n '31p;43p;117p;122p;152p;157p;158p;316p;343p' .claude/skills/copy-editing/SKILL.md
```

Dat is een duidelijke verbetering op gisteren, toen vijf citaten van lane B naast de
regel vielen.

**CORRECTIE — lane A, kandidaat 6: de zevende 1.44-meting draagt twee onjuiste getallen.**

Lane A telt de `$`-reeksen per skill om te laten zien dat de geserveerde tekst
ongeschonden is. Ik heb die telling zelf gedraaid:

```
$ for s in cold-email prospecting copy-editing copywriting competitor-profiling \
>          customer-research offers marketing-psychology; do
>   echo -n "$s: "; grep -o '\$' .claude/skills/$s/SKILL.md | wc -l; done
cold-email 0 · prospecting 0 · copy-editing 0 · copywriting 0
competitor-profiling 1 · customer-research 2 · offers 7 · marketing-psychology 21
```

| Lane A noteert | Van schijf | Oordeel |
|---|---|---|
| `cold-email` 0, `prospecting` 0, `copy-editing` 0, `copywriting` 0, `customer-research` 2, `marketing-psychology` 21 | idem | **Klopt, zes van de acht** |
| `competitor-profiling` **0** | raw 1 | **Verdedigbaar, maar de maat staat er niet bij.** Het enige `$` is `- Organic traffic value: $[estimated]` (`:287`). `$[` is geen substitueerbare reeks, dus onder de maat "`$` gevolgd door woordteken of accolade" is 0 juist. Schrijf die maat op, anders leest de volgende agent een fout |
| `offers` **5** | 7 | **Onjuist onder élke maat.** `$5K+` (`:32`), `$100M` (`:47`), `$1,000` (`:123`), `$50K` en `$497` (`:124`), `$X` en `$Y` (`:139`) — zeven, zowel raw als "gevolgd door woordteken" |
| "alle **vier** de gebruikte skills zonder argument aangeroepen" | de tabel voert er **vijf** als gebruikt | **Onjuist.** `prospecting`, `cold-email`, `marketing-psychology`, `competitor-profiling` én `copy-editing` staan alle vijf als gebruikt in dezelfde tabel |

**Wat dit wel en niet betekent.** De onderliggende bewering van 1.44 — dat een skill
zonder argument ongeschonden wordt geserveerd — **houdt stand, en ik heb hem vandaag
zelf opnieuw gemeten.** Ik heb `marketing-psychology` zonder argument aangeroepen en de
geserveerde tekst naast de schijf gelegd: alle 21 `$`-reeksen staan er, verdeeld als op
schijf (r.154 vier, r.204 twee, r.294 twee, r.299 twee, r.301 twee, r.304 drie, r.306
vier, r.316 twee). Zevende meting bevestigd, door een tweede agent. **Maar twee van de
acht getallen waarmee lane A die meting onderbouwt, zijn fout, en een meting die zichzelf
verkeerd telt, kan een echte regressie niet meer aantonen** — precies het bezwaar dat ik
gisteren tegen lane B's claimcontroletabel maakte, nu bij lane A en in zijn eigen
meetinstrument.

**Voor morgen, één regel:** zet het telcommando in het bestand naast de uitkomst, zoals
lane A dat bij zijn dossiertellingen wél doet — dan telt niemand meer uit het hoofd.

---

## Voor het weekrapport

Het fundament staat op 1.60 en **beide reeksen zijn vol** (A+B 1.41-1.50, C+D 1.51-1.60).
Ik schrijf daarom geen nieuwe fundamentregel. Onderstaande kandidaten gaan in de vaste
vorm naar zondag; de bestaande regels handhaaf ik ongewijzigd.

### Kandidaat 1 — een getal dat twee keer in één bestand staat, hoort de tweede keer een verwijzing te dragen naar de plaats waar het geteld is

**Tekst:** waar een samenvattende sectie (tekortverantwoording, kandidaatregel,
weekrapportvoorstel) een getal herhaalt dat elders in hetzelfde bestand uit een
opsomming volgt, draagt de herhaling de rij- of sectieverwijzing. Zonder die verwijzing
gaan de twee vindplaatsen los van elkaar lopen en wordt de samenvatting op zondag
overgenomen in plaats van nagerekend.

**Dragers: 2, uit twee lanes en twee diensten.** (1) Lane B 18-09: "zes al in mijn
ledger" met zes rijnummers in de bevinding, tegenover "zeven van de acht" in de rem van
kandidaatregel 1 — zes is het juiste getal, door mij uit `contacted.md` r.2518, 2803,
2863, 2865, 2955 en 2959 bevestigd. (2) Lane B 17-09: "de **vier** schilders zonder
eigen domein (75, 76, 77 en 79-82)" — zeven nummers in de opsomming, acht in het werk.
Twee opeenvolgende diensten, zelfde lane, zelfde gebrek, andere soort telling.

**Rem:** dit is een schrijfregel en geen onderzoeksregel; hij vindt geen dossier en
sluit geen poort. Hij verdient alleen een plaats omdat beide gevallen in de
*verantwoording* zaten en niet in het werk — het werk klopte allebei de keren.

### Kandidaat 2 — een meting die haar eigen telling niet met een commando onderbouwt, kan een regressie niet aantonen

**Tekst:** waar een lane een meting uitvoert om vast te stellen dat gereedschap
ongeschonden werkt (1.44 is de bestaande vorm), staat het telcommando in het bestand
naast de uitkomst, per gemeten object. Een getal uit het hoofd meet niets: als het
gereedschap morgen wél verandert, is de fout niet van de regressie te onderscheiden.

**Dragers: 1, en het is mijn eigen controle die hem oplevert.** Lane A 18-09, kandidaat
6: `offers` genoteerd op 5 waar schijf 7 geeft (`$5K+`, `$100M`, `$1,000`, `$50K`,
`$497`, `$X`, `$Y`), `competitor-profiling` op 0 waar raw 1 geeft zonder dat de gebruikte
maat erbij staat, en "alle vier de gebruikte skills" naast een tabel die er vijf voert.
De onderliggende bevinding hield stand toen ik haar zelf opnieuw mat — dat is juist
waarom de telfout zo duur is.

**Rem:** één drager, en de regel kost een regel per meting. Hij hoort pas in het
fundament als een tweede lane hem onafhankelijk raakt.

### Kandidaat 3 — een omgekeerd dossier draagt de zoekopdracht die het omkeerde, per dossier

**Tekst:** waar de verbrede lekronde van 1.41 een kaartrijp dossier omkeert, staat bij
dát dossier de gedraaide zoekopdracht én het geïndexeerde pad dat de omkering draagt —
niet alleen bij de negatieve controle. De omkering is de duurste beslissing van een
kaartloze dienst en moet los reproduceerbaar zijn.

**Dragers: 2, allebei van vandaag, en zij vallen naar tegengestelde kanten.** Borink
(lane B rij 4) draagt vier exacte paden en is door mij na te rekenen; G.G.
Schilderwerken (rij 51) draagt één pad plus een projectenselectie zonder eigen pad en is
dat niet. Dezelfde ronde, dezelfde dienst, twee verschillende bewijsdichtheden.

**Rem:** de kosten zijn één regel per omkering, maar de winst valt weg in sectoren waar
de gidsen hun leden nog géén projectenpagina hebben bezorgd — daar keert de ronde niets
om en is er niets te noteren.

### Kandidaat 4 — een zaak zonder één zichtbare klant is geen prime target, ook niet met alle poorten dicht

**Tekst:** naast de poorten toetst de kaart of er een groeisignaal uit de lijst van de
owner van 24 augustus avond is (score, recente reviews, vacature, verhuizing, tweede
man, levende socials). Ontbreekt elk signaal, dan is de zaak geen "hoog gewaardeerd
bedrijf zonder website" maar een onzichtbaar bedrijf, en dat is een ander doelwit dan de
owner heeft aangewezen.

**Drager: 1, en hij is van mijn eigen ronde.** Berkel Hoveniers, Enschede: zeven poorten
dicht, leeftijd binnen het venster, adres hard — en op geen enkel reviewplatform
(Trustoo geeft Neinders voor Enschede, Werkspot geeft alleen de stadspagina), nul reviews
op de eigen Facebookpagina, geen vacature, geen gedateerde daad. De regel die de owner
per kaart eist ("wat groeit er, en wat lekt er") kan hier alleen de tweede helft
invullen.

**Rem, en hij is serieus:** deze regel kan kaarten kosten in regio's waar reviews
schaars zijn, en hij raakt precies de groep die het prime target zou moeten zijn. Ik stel
hem voor als een **te noteren waarneming per kaart**, niet als een sluitende poort — het
is aan de owner of een zaak zonder zichtbare klant hem een mail waard is.

### Wat er deze week aan poort (a) is gemeten — voor het zondagrapport

Uitsluitend wat ik in lanes A en B heb kunnen vaststellen; lanes C en D liggen bij de
tweede sessie.

| Meting | Waarde |
|---|---|
| Dossiers in lanes A+B die vandaag op poort (a) open staan | 2 (lane B rij 1 en rij 2); in lane A nul, want daar valt elk dossier eerder |
| Diensten op rij waarin lane A poort (a) bij **geen enkel** dossier sluit | 7 |
| Externe domeinen waarop `WebFetch` in lane A `EGRESS_BLOCKED` gaf, over vier diensten | 7 van 7 |
| De vijf toegewezen routes, volledig per route genoteerd | 1 van de 2 open dossiers (Berkel wel, Buitenste Binnen niet) |
| Insolventieronde 1.40a gedraaid en genoteerd | lane A op de sector én op elk dossier dat de leeftijdspoort haalde; lane B op het kaartrijpe dossier. Beide schoon |
| Mijn eigen ronden op het sterkste open dossier | 4, op vier assen, nul gedateerde sporen |
| De 1.48-vaststelling (vacaturebankdatum ≠ werkgeversdatum) | door mij onafhankelijk gereproduceerd op Indeed Enschede: "6 februari 2026" en "13 april 2026" in **regio**paginatitels, geen vacature-URL die de werkgever benoemt |
| Dossiers die per staande order geen ronde meer krijgen | 10 op de lijst van de owner, plus Stukadoorsbedrijf JdN (gesloten 13-09, staat níet op die lijst) |

**De zin die ik voor zondag klaarleg:** poort (a) is deze week in lanes A en B geen
zeef meer maar een muur. Zij heeft geen enkel dossier afgekeurd omdat het bedrijf
stilstond; zij heeft ze afgekeurd omdat de zoekindex geen datum geeft en `WebFetch` op
zeven van zeven domeinen dicht is. Dat is 1.59 en het ligt bij de owner, niet bij Sam.

---

## Gebruikte skills

Elk citaat is met `grep -n` van schijf gehaald op het moment van schrijven, uit
`.claude/skills/<skill>/`.

| Skill | Waar toegepast | Wat het concreet veranderde |
|---|---|---|
| `cold-email` | Op de verzendklare tekst en de drie kandidaat-onderwerpregels van Berkel Hoveniers, en op de vraag of die tekst weg kan zodra poort (a) sluit. **Zonder argument aangeroepen** (`$`-telling 0) | De verwijdertoets — `If you remove the personalized opening and the email still makes sense, the personalization isn't working.` (`SKILL.md:41`) — is de toets waarop ik lane B's **keuze** goedkeur en niet alleen zijn regel: haal uit kandidaat B (`Wie je werk wil zien, moet eerst bellen`) het detail weg en er blijft geen detail over, terwijl kandidaat A (`Je tuinen staan alleen op Facebook`) zonder dat detail niet bestaat. `Lead with their world, not yours` (`:45`) is waarom ik de openingsalinea goedkeur: de eerste drie zinnen gaan volledig over de man op de bank in Enschede en pas alinea vier noemt wat ZEVREN levert. `One ask, low friction` (`:49`) met `Interest-based CTAs … One CTA per email. Make it easy to say yes with a one-line reply.` (`:51`) bevestigt lane B's eigen correctie: "Zegt het je iets? Bellen mag ook" is één vraag plus een tweede antwoordweg, precies de vorm die de order van 25 augustus voor het telefoonnummer eist, en niet twee vragen. `Cold email is ruthlessly short … The best cold emails feel like they could have been shorter, not longer.` (`:37`) onderschrijft dat 210 woorden het maximum is dat dit beeld nog draagt. En `- 2-4 words, lowercase, no punctuation tricks` (`:93`, met `references/subject-lines.md:5` en `:18`) verliest opnieuw bewust van de swipe-testorder van de owner, die één gecheckt detail binnen 45 tekens eist — ik bevestig die overrule in plaats van lane B erop af te rekenen |
| `marketing-psychology` | Op de vraag waar ik mijn eigen ronden in zou steken, op de weging van de twee omgekeerde kaarten, en als gemeten object voor 1.44. **Zonder argument aangeroepen** (`$`-telling 21, alle 21 reeksen ongeschonden geserveerd) | `### Theory of Constraints` (`:65`) met `Every system has one bottleneck limiting throughput. Find and fix that constraint before optimizing elsewhere.` (`:66`) bepaalde waar mijn vier ronden heen gingen: niet verdeeld over 138 dossiers, maar alle vier in het énige dossier dat op poort (a) open stond en alle andere poorten dicht had. Elke andere ronde had vandaag per definitie niets kunnen opleveren. `### Inversion` (`:45`) is de vorm waarin ik de twee omkeringen van lane B heb beoordeeld: niet "is deze afvaller terecht" maar "wat zou vandaag gegarandeerd een verbrand adres opleveren" — antwoord: een mail die een man met een projectenpagina vertelt dat hij er geen heeft. Dat maakt de omkering winst en geen verlies, en het is de reden dat mijn oordeel over Borink en G.G. GOEDGEKEURD is en niet "twee dossiers minder". `### Map ≠ Territory` (`:85`) met `Models and data represent reality but aren't reality itself.` (`:86`) is waarom ik bij Berkel schrijf dat mijn kaart leeg is en niet dat zijn zaak stilstaat — vier ronden zonder datum meten mijn index, niet zijn week. `### Survivorship Bias` (`:415`) met `Focusing on successes while ignoring failures that aren't visible.` (`:416`) leverde kandidaat 4: lane B's dossier telt zeven dichte poorten, maar het ontbreken van élk groeisignaal is geen poort en wordt daarom niet geteld — terwijl het precies het verschil is tussen het prime target van de owner en een onzichtbaar bedrijf |
| `prospecting` | Op de vraag of mijn eigen ronden op Berkel en Buitenste Binnen iets hebben gesloten, en op de bewijslat per bevinding. Zonder argument aangeroepen (`$`-telling 0) | `- **High**: confirmed by at least two independent sources or official business page` (`SKILL.md:68`) is de lat waarop ik poort (b) bij Berkel goedkeur: de exacte-tekenreeksronde geeft zijn eigen Facebookpagina, en dat is een *official business page* — één route, niet twee halve. `- [ ] Confidence levels honest — "High" requires 2 independent sources, not just two of your own searches` (`:200`) is waarom ik mijn eigen vier Berkel-ronden **niet** als vier bronnen tel maar als vier queries op één index: zij sluiten poort (a) niet, zij bevestigen alleen dat de index geen datum geeft. Dezelfde regel is de grond waarop ik het De Wiezer-artikel bij Buitenste Binnen afwijs als datumbron: het bestaat, maar zonder datum in URL of titel is het per 1.20(a) geen vaststelling. `- [ ] Source URL + date captured for every contact` (`:202`) is waarom elke regel in dít bestand een commando, een URL-fragment, een regelnummer of een registergetal draagt |
| `copy-editing` | Als laatste pas over dit hele bestand | Sweep 4, **Prove It** (`:117`, met `- Unsubstantiated claims` op `:122`) haalde één bewering uit een eerdere versie: ik had bij lane A "de skillstabel is slordig" staan, wat noch waar noch bruikbaar is — 26 van de 26 citaten kloppen en het gebrek zit uitsluitend in de 1.44-meting; die splitsing staat er nu, met de getallen erbij. Sweep 5, **Specificity** (`:152`, met `- Generic statements that could apply to anyone` op `:158`) ving mijn eigen "Berkel is nergens te vinden": dat is nu "staat op geen enkel reviewplatform — Trustoo geeft Neinders voor Enschede, Werkspot alleen de stadspagina, de Facebookpagina nul reviews". Sweep 1, **Clarity** (`:31`, met `- Sentences trying to say too much` op `:43`) knipte mijn oordeel over de zes-tegen-zeven in twee delen — wat er mis is en wat het níét betekent — omdat de eerste versie beide in één zin propte en daardoor leek te zeggen dat de kandidaatregel zelf onjuist was |
| `competitor-profiling` | Op de twee omgekeerde dossiers van lane B, vóór ik de omkering goedkeurde | `### 4. Honest Assessment` (`:39`) met `Don't exaggerate competitor weaknesses or downplay their strengths.` (`:40`) is de toets waarop ik Borink en G.G. Schilderwerken als terecht omgekeerd goedkeur: vier respectievelijk één geïndexeerd pad met afgerond werk betekent dat het lek dat wij verkopen bij die zaken niet bestaat, hoe goed de hoek ook al geschreven was. Dezelfde regel is waarom ik bij G.G. **wel** de ontbrekende padverwijzing noteer: een projectenselectie zonder pad is een oordeel over een pagina, geen vaststelling. `### 1. Facts Over Opinions` (`:30`) met `Every claim in a profile should be traceable to a source` (`:31`) is waarom mijn Berkel-tabel per ronde de gedraaide zoekopdracht noemt in plaats van "niets gevonden". `### 3. Current Data` (`:36`) met `Profiles are snapshots. Always include the date generated.` (`:37`) is de regel achter mijn bezwaar bij Buitenste Binnen: een artikel zonder datum is geen momentopname maar een bewering zonder tijd |
| `product-marketing` | Op de claimcontrole van de verzendklare tekst, als eigenaar van het fundament | Het fundament (`.agents/product-marketing.md`) verbiedt "eigen domein zit erbij" en schrijft voor waar de site komt te staan; `agents/outreach-agent.md:32` voert de toegestane vorm woordelijk: `"je site komt op je eigen domeinnaam te staan"`. Lane B's zin is exact die vorm en belooft niets over wat is inbegrepen — goedgekeurd. **Ik heb het fundament vandaag niet gewijzigd:** beide reeksen zijn vol op 1.60 en de vier kandidaten hierboven gaan naar zondag, dus er is geen changelog-regel bij gekomen |
| `offers` | **Niet gebruikt** | Er is vandaag geen kaart geschreven en de pakketkeuze stond bij het enige tekstrijpe dossier niet ter discussie: hovenier is portfoliovormig, `zevren/lib/local/sectors.ts` r.211 voert `planKey: "starter"`, dus 299. Dat is een controle van schijf en geen afweging uit deze skill |
| `customer-research` | **Niet gebruikt** | De bindende vragen van vandaag waren een datum in de zoekindex en twee tellingen in een bestand. Geen van beide raakt wat de koper denkt; de koperkennis die ik voor de swipe-test nodig had, staat in de staande orders van de owner in `agents/outreach-agent.md` |
| `marketing-council` | **Niet gebruikt** | Die skill hoort bij het weekrapport van zondag, niet bij een dagelijkse verificatie. De vier kandidaatregels liggen klaar om er dan langs te gaan |

---

## Samenvatting — één regel per oordeel

| # | Onderdeel | Lane | Oordeel | Grond in één regel |
|---|---|---|---|---|
| 1 | De telling: nul genummerde kaarten | A + B | **GOEDGEKEURD** | `grep -cE '^## [0-9]+\. '` geeft 0 in beide bestanden; komt overeen met de opgave van de opzichter |
| 2 | Opdracht (1) — reproduceerbaarheid van de tellingen | A | **GOEDGEKEURD** | Alle zeven tellingen uitgedraaid, alle 64 rijnummers naast hun eigen `GROND:` gelegd, partitie 1-64 machinaal nagerekend: nul afwijkingen |
| 3 | Opdracht (1) — reproduceerbaarheid van de tellingen | B | **GOEDGEKEURD MET ÉÉN CORRECTIE** | 74 rijen, zeven reeksen, partitie exact — maar "zeven van de acht titels stonden al in het ledger" tegenover "zes" met zes rijnummers elders in hetzelfde bestand; zes is juist |
| 4 | Opdracht (1) — de drie correcties van gisteren | B | **GOEDGEKEURD MET ÉÉN UITZONDERING** | Correctie 1 (lege regels) en 2 (claimcontroletabel) volledig toegepast, alle 24 citaten en alle zeven `sectors.ts`/`offer.ts`-vindplaatsen kloppen; correctie 3 (interne tellingen) kent één nieuw geval |
| 5 | Opdracht (2) — de twee omgekeerde kaarten | B | **GOEDGEKEURD** | Borink (rij 4) en G.G. Schilderwerken (rij 51), op de verbrede lekronde van 1.41, met negatieve controle op Buitenste Binnen; dit is de Diepenveen-fout van 14-09 vóór het schrijven voorkomen in plaats van erna |
| 6 | Opdracht (3) — Berkel Hoveniers, procesuitvoering | B | **GOEDGEKEURD** | Alle vijf de toegewezen routes per route genoteerd, plus de insolventieronde van 1.40a, plus een zesde Facebookroute |
| 7 | Opdracht (3) — Berkel Hoveniers als kaart | B | **AFGEKEURD** | Mijn eigen vier ronden op vier assen geven nul gedateerde sporen; poort (a) blijft open, en het bedrijf staat bovendien op geen enkel reviewplatform |
| 8 | Opdracht (3) — de verzendklare tekst van Berkel | B | **GOEDGEKEURD** | Zeven eisen gehaald, 210 woorden geteld, subject 34 tekens met het detail vooraan, handtekening exact inclusief 06-30958710; hij kan weg zoals hij ligt zodra poort (a) sluit |
| 9 | Opdracht (3) — Buitenste Binnen, procesuitvoering | B | **AFGEKEURD** | Poort (a) open zonder de vijf routes per route; het gedateerde spoor is een De Wiezer-artikel zonder datum in URL of titel, dus per 1.20(a) geen vaststelling. Gevolg nul, want het lek is los daarvan niet vastgesteld |
| 10 | Opdracht (3) — Stukadoorsbedrijf JdN | B | **GOEDGEKEURD** | Terecht nul ronden: het ledger draagt mijn eigen sluiting van 13-09. Voorstel: zet hem op de lijst van geparkeerde dossiers in de dienstopdracht |
| 11 | Opdracht (4) — poort (h), de citaten | A + B | **GOEDGEKEURD** | Alle vijftig citaten van schijf gehaald (26 in A, 24 in B); geen lege regel, geen verschoven blok, alle tekst woordelijk |
| 12 | Opdracht (4) — poort (h), de 1.44-meting | A | **GOEDGEKEURD MET ÉÉN CORRECTIE** | De bevinding houdt stand en ik heb haar zelf opnieuw gemeten, maar `offers` staat op 5 waar schijf 7 geeft, en "alle vier de gebruikte skills" naast een tabel die er vijf voert |
| 13 | Het fundament | — | **ONGEWIJZIGD** | 1.60, beide reeksen vol; vier kandidaatregels met tekst, dragers en rem naar het weekrapport van zondag |

Azzouz, 18 september 2026.
