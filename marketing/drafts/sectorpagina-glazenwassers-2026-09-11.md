# Voorstel — sectorpagina `/website-voor/glazenwassers`

**Status: VOORSTEL. Niets in `zevren/` is aangeraakt.** Dit bestand gaat pas de
code in nadat de eigenaar er een regel over schrijft onder "New" in
`agents/inbox.md`. Dat is de staande order van 24 augustus ("geen akkoord, geen
deploy") en de directive van deze week herhaalt hem: een directief van Azzouz is
nooit het akkoord van de eigenaar.

Geschreven door John op 11 september 2026.

---

## Waarom deze pagina er zou moeten zijn

`grep -rn -i "glazenwas\|gevelreinig" zevren/` geeft **nul treffers**. De
sectorpagina's die wél bestaan zijn de tien in `zevren/lib/local/sectors.ts`:
kappers, hondentrimsalons, garages, administratiekantoren, schoonheidssalons,
nagelsalons, hoveniers, schilders, dakdekkers, stukadoors.

Tegelijk is glazenwasserij/gevelreiniging deze week de **grootste sector in Sams
jachtplan**: het minimum per lane uit `agents/directives.md` is 10 (lane A) + 10
(lane B) + 15 (lane C) + 15 (lane D) = **50 dossiers**, meer dan hoveniers (39) en
meer dan schilders plus stukadoors samen (16). In lane C staat de sector met zoveel
woorden bovenaan.

De directive draagt Sam op de link in zijn bericht naar een sectorpagina te wijzen
als die bestaat, en anders naar de homepage. Voor zijn grootste sector bestaat hij
niet. Vijftig dossiers lang wijst het best gejaagde bericht van de week dus naar
een algemene pagina, terwijl de kleinere sectoren ernaast wel een eigen landing
hebben.

De pagina is bovendien goedkoop om te maken: `generateStaticParams()` in
`zevren/app/website-voor/[sector]/page.tsx` bouwt alle routes uit `SECTORS`, dus
één entry in de array levert de hele pagina op, inclusief de JSON-LD, de
pakketkaarten, de FAQ-schema en de onderlinge links. Er hoeft geen route, geen
component en geen tekst elders bij.

## Waarom zonder demo

`Sector.demoSlug` is optioneel en het commentaar erboven zegt waarom: voor de
ambachten zonder demo is de conceptbouwer het bewijs. Er is geen demo voor een
glazenwasserij en die verzinnen wij niet. Deze entry draagt daarom **geen**
`demoSlug`, waardoor `page.tsx` automatisch "Open de conceptbouwer" rendert in
plaats van een demolink. Dat is dezelfde route als hoveniers, schilders,
dakdekkers en stukadoors.

## Waarom het Starter-pakket

Een glazenwasserij verkoopt geen online geboekte tijdsloten maar een ronde en een
aanvraag. Het afsprakensysteem dat het Business-pakket van 549 rechtvaardigt (zie
`zevren/lib/i18n/dictionaries/nl.ts` r. 314: "inclusief een afsprakensysteem waarin
klanten zelf hun tijd kiezen") voegt daar niets toe. `planKey: "starter"` dus,
net als bij de vier andere ambachtspagina's.

---

## De entry, klaar om te plakken

Plaats hem in `zevren/lib/local/sectors.ts` in de array `SECTORS`. Voorstel voor
de plek: direct ná `dakdekkers` en vóór `stukadoors`, zodat de ambachten bij
elkaar blijven staan.

```ts
  {
    slug: "glazenwassers",
    name: "glazenwassers",
    h1Noun: "je glazenwasserij",
    planKey: "starter",
    intro:
      "Een glazenwasserij draait op vaste rondes, maar de groei zit in de aanvragen die er tussendoor bij komen: een VvE die een nieuwe partij zoekt, een kantoor dat verhuist, een horecazaak die na de verbouwing schone ruiten wil. Die vraag begint tegenwoordig bij een zoekopdracht, en wie dan een eigen pagina heeft met zijn werkgebied en zijn diensten, staat voor op wie alleen tussen alle anderen in een gids staat. Het Starter-pakket zet die pagina neer voor de prijs die hieronder staat.",
    proof:
      "Hoe jouw site eruit kan zien, bepaal je eerst zelf in de conceptbouwer: stijl en kleuren kiezen, direct een voorbeeld van je eigen homepage zien. Gratis en zonder verplichtingen.",
    metaDescription:
      "Een website voor je glazenwasserij: je diensten, je werkgebied en een duidelijke aanvraag. Vaste prijs, voorbeeld direct te bekijken.",
    faq: [
      {
        question: "Wat kost een website voor een glazenwasserij?",
        answer: "Het Starter-pakket is 299 euro eenmalig, exclusief btw: je diensten, je werkgebied en een duidelijke manier om een aanvraag te doen. De prijs staat op de site in plaats van in een offerte; extra pagina's kosten 79 euro per stuk.",
      },
      {
        question: "Ik heb mijn rondes vol, heb ik dan een site nodig?",
        answer: "Dan is een site vooral de plek waar een nieuwe aanvraag binnenkomt op het moment dat er ruimte is, en waar iemand zelf kan zien of jouw werkgebied en jouw diensten bij zijn vraag passen. Een gidsvermelding zet je tussen alle andere glazenwassers uit de omgeving; een eigen pagina is van jou.",
      },
      {
        question: "Kan ik er later gevelreiniging of zonnepanelen bij zetten?",
        answer: "Ja. Extra pagina's kosten 79 euro per pagina, en je kunt teksten en foto's ook zelf aanpassen; de site is daarvoor gebouwd. Kleine wijzigingen kunnen ook via het onderhoudsplan van 49,99 euro per maand.",
      },
    ],
  },
```

## Claimcontrole op deze entry

Elke bewering hierboven is tegen de bron gelegd, met dezelfde eis als voor een
post. Waar aanhalingstekens staan, is het woordelijk; waar ik samenvat, staan ze
er niet (fundament 1.39).

| Claim in de entry | Bron | Klopt |
| --- | --- | --- |
| 299 euro eenmalig | `zevren/lib/offer.ts`, `PLANS`: `{ key: "starter", price: 299 }` | ja |
| exclusief btw | `zevren/lib/i18n/dictionaries/nl.ts` r. 161 `pricingNote` en r. 283 `note`: "Prijzen zijn exclusief btw." | ja |
| extra pagina's 79 euro per stuk | `zevren/lib/offer.ts`, `ADD_ONS`: `{ key: "extraPage", price: 79 }` | ja |
| onderhoudsplan 49,99 euro per maand, kleine wijzigingen | `nl.ts` r. 284-291, `offer.subscription` (r. 287 `price: "49,99"`) | ja |
| "de prijs staat op de site in plaats van in een offerte" | `zevren/lib/local/sectors.ts` r. 299, woordelijk dezelfde formulering als de stukadoorspagina | ja |
| "Gratis en zonder verplichtingen." bij de conceptbouwer | `sectors.ts` r. 241, 267, 293 (schilders, dakdekkers, stukadoors) | ja |
| je kunt teksten en foto's zelf aanpassen, de site is daarvoor gebouwd | `sectors.ts` r. 255 ("Je kunt teksten en foto's ook zelf aanpassen.", schilders) en r. 63 ("de site is daarvoor gebouwd", kappers) | ja |
| een gidsvermelding zet je tussen alle andere bedrijven uit de omgeving | `sectors.ts` r. 303, de stukadoorsformulering, hier op glazenwassers toegepast | ja |
| geen demo voor deze sector | de entry draagt geen `demoSlug`, dus `page.tsx` rendert "Open de conceptbouwer" | ja |

**Wat er bewust níet in staat.** Geen levertijd, geen aantal klanten, geen
resultaatbelofte, geen schaarste, geen "alles inbegrepen" en geen enkele belofte
over de vórm van het opgeleverde werk (fundament 1.16): er staat niet dat wij
foto's "groot en scherp" tonen, want die formulering is op de hovenierspagina
gedekt en niet hier. Er staat evenmin dat er een demo te zien is, want die is er
niet (fundament 1.31).

## Wat er daarna nog moet gebeuren

1. `npx tsc --noEmit` en `npm run build` vanuit `zevren/` groen, vóór de push.
2. Eén regel in `agents/directives.md` of in het weekrapport, zodat Sam weet dat
   de bestemming voor zijn grootste sector verandert van de homepage naar
   `zevren.nl/website-voor/glazenwassers`, met de UTM-vorm die al geldt:
   `?utm_source=outreach&utm_medium=email&utm_campaign=glazenwassers-w37`.
3. De sector toevoegen aan de lijst die de directive noemt (die noemt er nu vier,
   terwijl er tien bestaan). Zie sectie 4 van `marketing/social/2026-09-11.md`.

Getekend, John.
