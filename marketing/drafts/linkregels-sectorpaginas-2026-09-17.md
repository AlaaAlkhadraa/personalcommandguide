# Linkregels per sectorpagina — week 38 (voorstel, John, 17-09-2026)

**Waarvoor dit bestand dient.** Sam wijst per dienst tientallen dossiers naar een
bestemming. De bestemming van een link is zelf een claim (fundament 1.31), en op
vier van de tien sectorpagina's staat géén demo. Hieronder staat per pagina één
kopieerklare linkregel die klopt met wat de lezer daar werkelijk aantreft, plus de
zin die er voor die pagina niet bij mag.

**Gemeten van schijf, vandaag:**

```
grep -n "slug:\|h1Noun:\|demoSlug:\|demoName:" zevren/lib/local/sectors.ts
```

Tien pagina's (r.40 t/m r.288). Zes dragen een `demoSlug`, vier niet. De pagina
toont dan "Open de conceptbouwer" in plaats van een demolink
(`zevren/app/website-voor/[sector]/page.tsx` r.101-123).

**UTM-vorm voor outreach** (directives r.187-190):
`?utm_source=outreach&utm_medium=email&utm_campaign=<slug>-w38`, de slug
woordelijk.

---

## De zes bestemmingen die Sams week-38-plan raakt

Vijf bestaande sectorpagina's en een sector zonder pagina. De aantallen zijn de
sectorplannen uit `agents/directives.md` r.98-140, opgeteld over de vier lanes:

```
grep -n "^| Hovenier\|^| Schilder\|^| Garages\|^| Hondensector\|^| Glazenwasserij" agents/directives.md
```

**Register:** de regels hieronder staan in de u-vorm. Bij de jonge eenmanszaak
waar de eigenaar zelf op het veld staat, zet Sam ze om naar "je"; die keuze staat
per kaart in een regel (fundament, sectie "Toon en taal").

### 1. hoveniers — 28 dossiers per dienst (lane B 12, C 10, D 6). Géén demo.

```
Hoe zo'n site eruitziet voor een hoveniersbedrijf, staat hier, met de prijzen en de conceptbouwer waarin u zelf een stijl kiest: https://zevren.nl/website-voor/hoveniers?utm_source=outreach&utm_medium=email&utm_campaign=hoveniers-w38
```

Niet schrijven: "een demo die u kunt aanklikken". Die staat op deze pagina niet.

### 2. schilders — 8 dossiers per dienst (lane B, met stukadoors). Géén demo.

```
De pagina voor schildersbedrijven staat hier, met de vier pakketprijzen en de conceptbouwer: https://zevren.nl/website-voor/schilders?utm_source=outreach&utm_medium=email&utm_campaign=schilders-w38
```

### 3. stukadoors — 8 dossiers per dienst (lane B, met schilders). Géén demo.

```
De pagina voor stukadoorsbedrijven staat hier, met de vier pakketprijzen en de conceptbouwer: https://zevren.nl/website-voor/stukadoors?utm_source=outreach&utm_medium=email&utm_campaign=stukadoors-w38
```

### 4. garages — 3 dossiers per dienst (lane C). Mét demo (`garage-website`).

```
In onze garage-demo kiest de klant een dienst, vult zijn kenteken in en plant een moment, tot en met de bevestiging: https://zevren.nl/website-voor/garages?utm_source=outreach&utm_medium=email&utm_campaign=garages-w38
```

### 5. hondentrimsalons — 14 dossiers per dienst (lane C 2, lane D 12). Mét demo, maar let op de kop.

```
De pagina voor hondentrimsalons staat hier, met de online agenda die u vooraf zelf kunt proberen: https://zevren.nl/website-voor/hondentrimsalons?utm_source=outreach&utm_medium=email&utm_campaign=hondentrimsalons-w38
```

**Alleen voor zaken die trimmen.** De H1 luidt "Een website voor je trimsalon"
(`sectors.ts` r.70). Een hondenschool, uitlaatservice of pension krijgt deze link
niet met de woorden "onze pagina voor uw vak" erbij; zie
`marketing/social/2026-09-14.md` sectie 2 en het voorstel
`marketing/drafts/sectorpagina-hondenscholen-2026-09-16.md`.

### 6. Glazenwasserij / gevelreiniging — 63 dossiers per dienst. **Geen pagina.**

Er bestaat geen `/website-voor/glazenwassers`. Zolang het voorstel van 11-09
zonder akkoord ligt, is de bestemming de algemene pagina, en dan mag het bericht
niet "onze pagina voor glazenwassers" zeggen:

```
Wat een site kost en hoe die eruitziet, staat gewoon op onze site: https://zevren.nl/website-laten-maken?utm_source=outreach&utm_medium=email&utm_campaign=glazenwassers-w38
```

---

## De overige vijf pagina's, voor volledigheid

| Slug | H1 zegt | Demo op de pagina | Toegestane omschrijving |
|---|---|---|---|
| `kappers` | je kapsalon | ja, de barbershop-demo | "in onze barbershop-demo kiest de klant een behandeling, een kapper en een tijd" |
| `administratiekantoren` | je administratiekantoor | ja, de demo van Bergendal Accountants | "de demo van Bergendal Accountants" |
| `schoonheidssalons` | je schoonheidssalon | ja, onze agenda-demo | "onze agenda-demo" |
| `nagelsalons` | je nagelsalon | ja, onze agenda-demo | "onze agenda-demo" |
| `dakdekkers` | je dakdekkersbedrijf | **nee** | "de conceptbouwer" |

---

## Wat hiervoor nodig is van Azzouz (één regel, kopieerklaar)

```
Azzouz: vervang in de directives onder "UTM in het bericht" het rijtje (kappers, hondentrimsalons, garages, administratiekantoren) door alle tien de slugs uit zevren/lib/local/sectors.ts, en verwijs voor de linkregels naar marketing/drafts/linkregels-sectorpaginas-2026-09-17.md.
```

John, 17 september 2026
