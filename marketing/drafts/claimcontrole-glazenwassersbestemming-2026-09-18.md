# Claimcontrole — de glazenwassersbestemming en haar 28 stadspagina's

**Voorstel, John, vrijdag 18 september 2026 (week 38). Raakt `zevren/` niet.**

---

## Waarom deze bestemming en niet een andere

Sam wijst deze week **63 glazenwasserijdossiers per dienst** naar één adres:
lane A 24, lane B 12, lane C 15, lane D 12. Opgeteld uit de vier sectorplannen,
niet geschat:

```
grep -n "^| Glazenwasserij" agents/directives.md
```

Dat geeft r.98 (24), r.117 (12), r.126 (15) en r.138 (12). Samen 63 — de
grootste bestemming van Sams week, groter dan hoveniers (28), hondensector (14),
schilders en stukadoors (8) en garages (3) bij elkaar.

En het is de enige bestemming van de zes uit
`marketing/drafts/linkregels-sectorpaginas-2026-09-17.md` die **geen
sectorpagina** is. Er bestaat geen `/website-voor/glazenwassers`; zolang het
voorstel van 11-09 zonder akkoord ligt, is de bestemming
`zevren.nl/website-laten-maken`. Die pagina is nooit regel voor regel
gecontroleerd. De tien sectorpagina's gisteren wél: het linkregelbestand van
17-09 legt ze alle tien langs hun demostatus en hun kopregel. Deze hubpagina
viel daar buiten, juist omdat zij geen sectorpagina is.

Daar komt dit bij: de bestemming is niet één pagina maar **29**. De hubpagina
linkt 28 stadspagina's, en elke stadspagina draagt een eigen, met de hand
geschreven introtekst met eigen claims erin. Die 28 teksten zijn tot vandaag door
niemand tegen `offer.ts` en de dictionaries gelegd.

**Wat dit vandaag concreet raakt.** De goedgekeurde kaart voor **Glasbewassing de
Hondsrug** (Emmen, 05-09) verloopt volgens haar eigen ledgernotitie rond
**19-09-2026** — morgen. Dat is een glazenwasser, pakket 299, en zijn bestemming
is precies de pagina hieronder.

---

## Wat er gemeten is

Alles van schijf, vandaag:

```
grep -n "h1\|<h1\|<h2\|Link href" zevren/app/website-laten-maken/page.tsx
grep -n "intro:\|metaDescription:\|province:" zevren/lib/local/cities.ts
grep -n "note:\|subscription:\|addOns:\|regularLabel\|saveLabel" zevren/lib/i18n/dictionaries/nl.ts
grep -n "PLANS\|ADD_ONS" zevren/lib/offer.ts
```

28 stadspagina's, 11 provincies:

```
grep -c '^    slug: "' zevren/lib/local/cities.ts
grep -o 'province: "[^"]*"' zevren/lib/local/cities.ts | sort -u | wc -l
```

---

## A. De hubpagina, claim voor claim

| Wat de pagina zegt | Waar | Bron | Uitkomst |
|---|---|---|---|
| H1 "Website laten maken, zonder offertecircus" | `app/website-laten-maken/page.tsx` r.49-51 | `nl.ts` r.277 "Wat het kost staat op de kaart", r.278 "Je weet de prijs voordat we beginnen" | Klopt, met één begrenzing: zie de volgende rij |
| "vier pakketten, vanaf 299 euro" | `page.tsx` r.54-55 | `offer.ts` `PLANS`: vier entries, laagste `{ key: "starter", price: 299 }` | Klopt |
| "wat op de kaart staat is wat op de factuur staat" | `page.tsx` r.55 | `nl.ts` r.278, en de begrenzing staat op dezelfde pagina: r.283 `note` "Prijzen zijn exclusief btw. Grotere projecten worden op scope geoffreerd." | **Klopt op de pagina, maar mag niet worden overgenomen als "alles inbegrepen"** (fundament 1.16, tweede helft) |
| "We werken vanuit Maastricht, volledig online" | `page.tsx` r.55-56 | `lib/constants.ts` r.16 `address.city: "Maastricht"` | Klopt |
| "voor ondernemers door heel Nederland" | `page.tsx` r.56 | 28 stadspagina's in 11 provincies; de zin claimt bereik, geen klanten | Klopt als bereik. **Zie bevinding 1** voor de plek waar dezelfde gedachte wél te ver gaat |
| "Bouw eerst zelf een concept met de conceptbouwer" | `page.tsx` r.59-62 | `app/concept-bouwer/page.tsx` bestaat en is bereikbaar | Klopt |
| "klik door onze werkende demo's" → `/projects` | `page.tsx` r.63-66 | `/projects` toont zes items uit `constants.ts` r.139-242; `nl.ts` r.498 zegt erbij: "Ze zijn volledig interactief, geen statische screenshots, en geen van alle is klantwerk" | Klopt als **demo's**, niet als klantwerk. Zie de verbodsregel in sectie B |
| "Zoek je specifiek een webshop of maatwerk webapplicatie? Die hebben hun eigen pagina" | `page.tsx` r.67-81 | `app/webshop-laten-maken/`, `app/webapplicatie-laten-maken/` | Klopt |
| De vier pakketkaarten met doorgestreepte prijs | `PackagesSection.tsx` r.57 → `PlanCards.tsx` r.44-47 | `nl.ts` r.313-316 (499 / 799 / 1.199 / 1.799) tegen `offer.ts` (299 / 549 / 899 / 1349) | Klopt; de doorgestreepte prijs staat bóven de prijs die je betaalt, gelabeld "Normaal" (`nl.ts` r.279) |
| Het onderhoudsabonnement van 49,99 per maand | `PackagesSection.tsx` r.61 | `nl.ts` r.287-289: "49,99", "per maand", "Optioneel bij elk pakket" | Klopt, en **optioneel** is het woord dat de site zelf gebruikt |
| "Actief in heel Nederland" + "Voor deze steden schreven we een eigen pagina" | `page.tsx` r.95 en r.99 | 28 steden in `cities.ts` | Klopt, en de formulering is zorgvuldig: zij claimt pagina's, geen vestigingen |
| "Per branche" met tien sectorlinks | `page.tsx` r.125-131 | `SECTORS` in `lib/local/sectors.ts` | Klopt — en **glazenwassers staat er niet tussen**. De lezer van deze link ziet tien andere vakken en het zijne niet |
| Het contactformulier onderaan | `FinalCTA.tsx` r.70 → `ContactForm` | `nl.ts` r.451-491: Naam, E-mailadres, Bedrijf (optioneel), "Wat heb je nodig?", **Budget** (optioneel, laagste band "Onder €800"), Projectinformatie, bericht | Klopt. **Relevant voor 1.40b:** wie "je hoeft alleen je naam achter te laten" schrijft, belooft een formulier dat hier niet staat |
| Telefoonnummer, e-mailadres en LinkedIn op de bestemming | `FinalCTA.tsx` r.83-107 | `constants.ts` r.13-14, r.22 | Klopt; de pagina publiceert 06 30 95 87 10 |

**Twee dingen die de hubpagina níét heeft en de stadspagina's wél.** De FAQ
(`app/website-laten-maken/[stad]/page.tsx` r.115 rendert `FAQ`, de hubpagina
rendert hem nergens) en de naam van de stad van de lezer. Gecontroleerd met:

```
grep -n "FAQ" zevren/app/website-laten-maken/page.tsx
```

Nul treffers. Een bericht dat "met de veelgestelde vragen" schrijft en naar de
hub linkt, belooft iets dat daar niet staat. Naar een stadspagina linken mag die
zin wél dragen.

---

## B. Wat op deze bestemming niet gedekt is

Zes zinnen die er voor een glazenwasser aantrekkelijk uitzien en die niet mogen.
Elk met de reden, niet alleen het verbod.

1. **"Onze pagina voor glazenwassers"** en elke variant die suggereert dat het
   vak genoemd wordt. Er is geen `/website-voor/glazenwassers`. De lezer die
   doorklikt ziet tien andere vakken in de lijst "Per branche" en het zijne
   niet — dat is de eenzijdige kostentoets van 1.31 in haar zuiverste vorm: het
   kost alleen de lezer die geïnteresseerd wás.
2. **"Bekijk ons werk voor klanten"** of "eerdere opdrachtgevers". `/projects`
   zegt in de eigen ondertitel "geen van alle is klantwerk" (`nl.ts` r.498).
   Toegestaan: "zes demo's die je kunt doorklikken alsof het echte sites zijn" —
   dat is de formulering die de stadspagina's zelf voeren
   (`[stad]/page.tsx` r.105-107).
3. **"Alles inbegrepen" / "299 euro en verder niets."** Fundament 1.16 wijst deze
   twee met zoveel woorden af. De pagina zelf zet er twee begrenzingen naast:
   exclusief btw en grotere projecten op scope (`nl.ts` r.283).
   Toegestaan: "299 euro eenmalig, exclusief btw".
4. **"Geen maandelijkse kosten."** Het abonnement is er wél, het is alleen
   optioneel. Toegestaan, en het is sterker: "het onderhoudsabonnement van 49,99
   per maand is optioneel bij elk pakket" (`nl.ts` r.289).
5. **"Je krijgt binnen één werkdag antwoord."** Die zin staat op `/contact`
   (`nl.ts` r.447) en in de bevestiging ná verzenden, waar hij "meestal binnen
   één werkdag" luidt (`nl.ts` r.487). Op de bestemming zelf staat hij nergens.
   Wie hem in een bericht zet dat naar de hub wijst, beschrijft een pagina die de
   lezer niet krijgt. Toegestaan zodra het bericht naar `/contact` wijst, en dan
   in de vorm met "meestal".
6. **"Een demo voor jouw vak."** De zes demo's zijn barbershop, garage, webshop,
   ElleZone, accountantskantoor en Tajex (`constants.ts` r.139-242). Geen ervan
   is glazenwasserij. Een glazenwasser die op "een demo voor jouw vak" klikt,
   vindt een kapper.

---

## C. De linkregels, kopieerklaar

### C1. De stad staat in de 28 — gebruik de stadspagina

Dit is de winst van deze controle die vandaag al bruikbaar is. Staat de plaats
van de prospect in de lijst hieronder, dan wijs je de link naar zijn stadspagina
in plaats van naar de hub. Die pagina noemt zijn stad in de H1, draagt een eigen
introtekst en heeft wél de FAQ.

```
Wat een site kost en hoe die eruitziet, staat gewoon op onze site, met de veelgestelde vragen erbij: https://zevren.nl/website-laten-maken/STADSSLUG?utm_source=outreach&utm_medium=email&utm_campaign=glazenwassers-w38
```

**De campagnewaarde blijft `glazenwassers-w38` en verandert niet mee met de
stad.** Een UTM-campagne is één actie, en dit is één actie op 63 dossiers; 28
campagnewaarden zouden diezelfde actie in 28 stukjes hakken en elk stukje te
klein maken om iets uit af te lezen. Wie later wil weten wélke stadspagina de
klik ving, heeft daar geen parameter voor nodig: het landingsadres staat
sowieso in het rapport. En een `utm_content` erbij zetten mag niet, want de
directive legt de outreachvorm vast op bron, medium en campagne.

De 28 slugs, per lane, uit `cities.ts`:

| Lane | Provincies | Stadsslugs met een pagina |
|---|---|---|
| A | Groningen, Friesland, Drenthe | `groningen`, `leeuwarden` — **Drenthe heeft er geen, zie bevinding 3** |
| B | Overijssel, Gelderland, Flevoland | `zwolle`, `enschede`, `nijmegen`, `arnhem`, `apeldoorn`, `almere` |
| C | Limburg, Noord-Brabant, Zeeland | `maastricht`, `heerlen`, `sittard-geleen`, `roermond`, `venlo`, `weert`, `kerkrade`, `eindhoven`, `tilburg`, `breda`, `den-bosch`, `middelburg` |
| D | Noord-Holland, Zuid-Holland, Utrecht | `amsterdam`, `haarlem`, `rotterdam`, `den-haag`, `leiden`, `dordrecht`, `utrecht`, `amersfoort` |

Twee plus zes plus twaalf plus acht is achtentwintig, en dat is ook het aantal
regels in `cities.ts`:

```
grep -c '^    slug: "' zevren/lib/local/cities.ts
```

**Eén regel die erbij hoort en die makkelijk fout gaat:** alleen wanneer de
plaats van de prospect de stad zelf ís. Emmen is geen Groningen. Wie een
Drentse zaak naar `/website-laten-maken/groningen` stuurt, belooft een pagina
over zijn stad en levert er een over een andere.

### C2. De stad staat er niet in — de hub, zonder de FAQ-zin

```
Wat een site kost en hoe die eruitziet, staat gewoon op onze site: https://zevren.nl/website-laten-maken?utm_source=outreach&utm_medium=email&utm_campaign=glazenwassers-w38
```

Dit is de regel uit het bestand van 17-09, ongewijzigd. Hij blijft goed; hij is
nu alleen niet meer de enige.

### C3. Drie zinnen die op beide bestemmingen gedekt zijn

Voor wie in het bericht iets over de bestemming wil zeggen zonder te veel te
beloven:

```
Vier pakketten met de prijs erbij, vanaf 299 euro eenmalig, exclusief btw.
```

```
Het onderhoudsabonnement van 49,99 per maand is optioneel bij elk pakket.
```

```
De demo's kunt u doorklikken alsof het echte sites zijn, voordat u ons iets vraagt.
```

---

## D. Drie bevindingen op de stadspagina's, voor de eigenaar

Deze drie raken de live site. Ik wijzig er niets aan; onder "New" in
`agents/inbox.md` staat `(leeg)`.

### Bevinding 1 — de pagina van Groningen claimt klanten door het hele land

`zevren/lib/local/cities.ts` r.162, woordelijk: *"het hele traject loopt online,
van kennismaking tot livegang, en dat doen we voor klanten door het hele land."*

Dat is een claim over bestaande klanten in het meervoud, verspreid over het land.
Op zevren.nl staat er niets onder. `/projects` zegt in dezelfde adem het
tegenovergestelde: *"geen van alle is klantwerk"* (`nl.ts` r.498). Het enige
klantproject dat de repo kent is Tajex Logistics, en dat is er één, en het staat
op de site zelf als concept — de tegenstrijdigheid die op 04-09 is gemeld en die
sinds 13-09 als beslispunt bij de eigenaar ligt (`agents/directives.md` r.350).

Wat dit erger maakt dan de Tajex-kwestie: Groningen is de bestemming van lane A,
en lane A heeft deze week de meeste glazenwasserijdossiers van alle vier (24 per
dienst). De zin staat dus in de bestemming van de grootste stapel.

De vervanging houdt de gedachte en laat de claim vallen. Kopieerklaar, alleen
voor de eigenaar om in te zetten:

```
Groningen is ver van Maastricht, en voor het werk maakt dat exact niets uit: het hele traject loopt online, van kennismaking tot livegang, waar in het land je zaak ook staat. De afstand die wél telt is die tussen jou en je klant, en die overbrugt je site.
```

Verschil: "en dat doen we voor klanten door het hele land" wordt "waar in het
land je zaak ook staat". Bereik in plaats van klantenbestand. Dezelfde belofte
over afstand, zonder een klant te verzinnen.

### Bevinding 2 — twee marktcijfers zonder bron

- `cities.ts` r.90 (Tilburg): *"Tilburg heeft een van de jongste
  ondernemersbestanden van het land"*.
- `cities.ts` r.261 (Middelburg): *"Zeeland heeft relatief de minste webbureaus
  van het land"*.

Allebei onbevestigd en allebei zonder aanhalingsteken of bronvermelding
gepresenteerd als feit. Harde regel 1 in `agents/marketing-agent.md` r.27 verbiedt
verzonnen statistieken; deze zijn niet verzonnen in de zin van kwaadwillend, maar
ze zijn wel onnaspeurbaar, en dat is voor een lezer hetzelfde.

Ter vergelijking, en dit is waarom ik ze eruit licht en niet alle zeventien
sfeerzinnen: `cities.ts` r.135 (Utrecht) schrijft *"misschien wel de hoogste van
het land"* en r.207 (Almere) *"de jongste grote stad van het land"* — de eerste
is gemarkeerd als vermoeden, de tweede is een openbaar feit over de stichting van
de stad. Die twee kunnen blijven staan. De twee hierboven zijn stellig én
onnaspeurbaar.

Voor Sam is er intussen één regel die geen besluit nodig heeft: **neem geen van
deze twee zinnen over in een bericht.** Een marktcijfer in een verkoopmail is de
zin waarop een ondernemer je terugschrijft met "waar staat dat dan".

### Bevinding 3 — Drenthe is de enige provincie zonder stadspagina

Elf provincies hebben er een, Drenthe niet:

```
grep -o 'province: "[^"]*"' zevren/lib/local/cities.ts | sort -u
```

Dat geeft Flevoland, Friesland, Gelderland, Groningen, Limburg, Noord-Brabant,
Noord-Holland, Overijssel, Utrecht, Zeeland en Zuid-Holland. Drenthe ontbreekt.

Lane A jaagt deze week 24 glazenwasserijdossiers per dienst in Groningen,
Friesland en Drenthe, en de enige goedgekeurde kaart in die stapel — Glasbewassing
de Hondsrug — staat in **Emmen (DR)**. Zijn bericht kan naar geen enkele pagina
wijzen die zijn provincie noemt, laat staan zijn stad, laat staan zijn vak.

Dit is géén verzoek om een pagina erbij. Ik heb al zes voorstellen bij de
eigenaar liggen en een zevende maakt die stapel niet korter. Het is een
vaststelling met een prijskaartje eraan: twee entries in `cities.ts` (Assen en
Emmen, met een eigen introtekst zoals de 28 andere) zouden de twaalfde provincie
sluiten en de stadsroute uit sectie C1 landelijk dekkend maken. Wat dat waard is,
beslist de eigenaar en niet ik.

---

## E. Vier technische bevindingen op de bestemming

Uit de `seo-audit`-controle, omdat een bestemming die niet indexeerbaar is of
zichzelf dupliceert ook een claim breekt.

1. **De UTM vouwt netjes weg.** `buildMetadata` zet de canonical op het kale pad
   (`lib/seo.ts` r.96, `singleLocale: true` in `page.tsx` r.27). Sams
   `?utm_source=...` maakt dus geen tweede geïndexeerde URL aan. Dit was de
   enige echte technische twijfel bij de linkregels van 17-09 en hij is nu
   positief beantwoord.
2. **De bestemming is altijd Nederlands.** `singleLocale: true` betekent dat de
   pagina één taal serveert, ongeacht de taalcookie van de bezoeker. Een
   Nederlandse ondernemer krijgt nooit per ongeluk de Engelse versie.
3. **De metabeschrijving zit op 159 van de 160 tekens** en is daarmee één teken
   van een afkapping met puntjes verwijderd (`lib/seo.ts` r.75-81 kapt boven 160).
   Geteld met `LC_ALL=C.UTF-8 wc -m`. Geen fout, wel een marge van niets: wie er
   ooit één woord bij zet, krijgt een afgekapte zin in de zoekresultaten.
   De titel is 50 tekens en wordt met het sjabloon uit `app/layout.tsx` r.71
   ` | ZEVREN` precies 59 — binnen de 50 tot 60 die zichtbaar blijven.
4. **De hubpagina is geen weespagina en de stadspagina's ook niet.** De hub staat
   met prioriteit 0.9 in `app/sitemap.ts` r.13, alle 28 steden staan er
   afzonderlijk in (r.65), en elke stadspagina linkt alle 27 andere
   (`[stad]/page.tsx` r.124-127). De ankertekst draagt de stadsnaam, wat precies
   de zoekopdracht is die elke pagina bedient.

---

## F. Wat hiervoor nodig is (kopieerklaar)

**Voor Azzouz, één regel, voor onder "Voor Sam":**

```
Azzouz: voeg aan de linkregels toe dat een glazenwasserijdossier in een van de 28 steden uit zevren/lib/local/cities.ts naar zijn eigen stadspagina wijst (/website-laten-maken/<stad>), met campagnewaarde glazenwassers-w38 ongewijzigd, en alleen wanneer de plaats de stad zelf is.
```

**Voor de eigenaar, drie losse regels — ja of nee volstaat:**

```
Bevinding 1, Groningen: ja, vervang r.162 van zevren/lib/local/cities.ts door de zin uit sectie D van claimcontrole-glazenwassersbestemming-2026-09-18.md.
```

```
Bevinding 2, Tilburg en Middelburg: ja, haal de twee marktcijfers uit r.90 en r.261 van zevren/lib/local/cities.ts; John levert de vervangende zinnen bij akkoord.
```

```
Bevinding 3, Drenthe: ja, schrijf een stadspagina voor Assen en Emmen; John levert het voorstel.
```

John, 18 september 2026
