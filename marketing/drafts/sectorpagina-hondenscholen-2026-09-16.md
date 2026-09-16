# Voorstel — sectorpagina `/website-voor/hondenscholen`

**Status: VOORSTEL. Niets in `zevren/` is aangeraakt.** Dit bestand gaat pas de
code in nadat de eigenaar er een regel over schrijft onder "New" in
`agents/inbox.md`. Dat is de staande order van 24 augustus ("geen akkoord, geen
deploy") en de directive van deze week herhaalt hem: een directief van Azzouz is
nooit het akkoord van de eigenaar.

Geschreven door John op woensdag 16 september 2026, de eerste van de drie
pagina-diensten van week 38.

---

## Waarom deze pagina, en waarom vandaag

De directive geeft mij woensdag, vrijdag en zondag aan pagina's en noemt daarbij
een vaste eerste keus: hoveniers, daarna schilders en stukadoors. Die drie
pagina's bestaan alle drie al; dat heb ik gisteren gemeld en het is in één regel
na te rekenen (`grep -n "^    slug:" zevren/lib/local/sectors.ts` geeft er tien).
Wat níet verouderd is, is de **grond** onder die keus: Sam wijst deze week
dossiers naar een bestemming die hun vak niet noemt, terwijl kleinere sectoren
ernaast wél een eigen landing met FAQ, prijzen en JSON-LD hebben. Ik voer die
grond uit op de sectoren die er vandaag nog onder vallen.

Er zijn er nog twee: glazenwassers en de niet-trimmende hondensector. Voor
glazenwassers ligt het voorstel sinds 11-09 klaar en het wacht op de eigenaar,
dus vandaag is de hondensector aan de beurt.

**De hondenschool is geen trimsalon, en de pagina zegt "je trimsalon".** Dat is
de vondst van 14-09, hier herhaald met de vindplaats erbij. `agents/directives.md`
r.189-190 wijst de hele "Hondensector" naar `/website-voor/hondentrimsalons`, en
die pagina voert in de H1 `h1Noun: "je trimsalon"` (`zevren/lib/local/sectors.ts`
r.70, gerenderd in `zevren/app/website-voor/[sector]/page.tsx` r.96). Uit
`name: "hondentrimsalons"` (r.69) bouwt diezelfde component de paginatitel
"Website voor hondentrimsalons" (r.40) en de FAQ-kop "Veelgestelde vragen van
hondentrimsalons" (r.133). De eerste FAQ-vraag noemt het vak woordelijk: "Wat
kost een website voor een trimsalon?" (r.82). Een hondenschool trimt niet. Lane B
kwam daar op 02-09 zelf op uit (`marketing/outreach/2026-09-02-ab-verified.md`
r.373-378) en koos toen de directe demolink. Dat was de goede uitkomst en het is
nooit een pagina geworden.

**Het is geen randgeval.** Het aantal dossiers dat Sam al in de niet-trimmende
hondensector heeft gestoken, geteld op het sectorveld in het ledger:

```
grep -rhio "Sector: [^·|]*" marketing/outreach/ | sed 's/ *$//' | sort | uniq -c | sort -rn | grep -i "hond\|dieren"
```

Dat geeft hondentrimsalon 251, **hondenschool 39**, dierenpension 37 en
hondenuitlaatservice 5. Daarnaast staan er dertien notities op een gecombineerde
schrijfwijze met een schuine streep (elf verschillende vormen, waarvan elf rijen
een niet-trimmend vak noemen); die zitten in geen van die vier getallen en worden
in `marketing/social/2026-09-16.md` sectie 1 apart geteld. Hondenschool is
daarmee de grootste hondensector zonder pagina. Het weekplan zet er 14 dossiers per dienst
weg (`agents/directives.md` r.137, lane D: 12; r.129, lane C: 2), dus het is ook
een sector die Sam déze week bejaagt.

**En `zevren/` noemt het vak nergens.** Nul treffers:

```
grep -rn -i "hondenschool\|hondenscholen\|uitlaatservice\|hondenuitlaat\|puppy\|gehoorzaamheid\|dierenpension" zevren/ --include=*.ts --include=*.tsx
```

## Waarom hondenscholen en niet dierenpensions

De twee liggen dicht bij elkaar (39 tegen 37 dossiers), dus de keuze is gescoord
op de vier factoren van `content-strategy` (`SKILL.md` r.310-340: Customer Impact
40 / Content-Market Fit 30 / Search Potential 20 / Resources 10, en op r.340
"Score 1-10 per factor, multiply by the weight") in plaats van op gevoel:

| Kandidaat | Impact 40 | Fit 30 | Search 20 | Resources 10 | Totaal |
|---|---|---|---|---|---|
| `hondenscholen` | 8 | 9 | 7 | 9 | **8.2** |
| `dierenpensions` | 8 | 5 | 7 | 6 | 6.7 |

Impact is gelijk: 39 tegen 37 dossiers is binnen de ruis. Het verschil zit op
**Fit**, en het is een claimverschil, geen smaakverschil. Het Business-pakket
draagt volgens de site "een afsprakensysteem waarin klanten zelf hun tijd kiezen"
(`zevren/lib/i18n/dictionaries/nl.ts` r.314). Een hondenschool verkoopt een
kennismaking, een proefles of een privéles: dat is één moment dat iemand zelf
kiest, precies wat het pakket belooft en wat de demo doet. Een dierenpension
verkoopt een periode van vrijdag tot zondag, met twee data en een beschikbaarheid
per plek. Dat is niet wat het afsprakensysteem belooft en niet wat de demo toont,
dus een pensionpagina zou ofwel een belofte moeten lenen die nergens gedekt is
(fundament 1.40b), ofwel het Starter-pakket moeten nemen en daarmee haar eigen
beste argument kwijtraken. Resources volgt daaruit: voor hondenscholen bestaat de
demo al, voor pensions zou er iets gebouwd moeten worden.

Dierenpensions blijven de volgende kandidaat, maar met een open vraag erbij die
niet van mij is: welk pakket dekt een boeking over een periode. Die vraag staat
onderaan in "Wat er daarna nog moet gebeuren".

## Waarom mét demo, en waarom de pagina zelf zegt wat die demo is

`hondenscholen` draagt `demoSlug: "barbershop-website"` met
`demoName: "onze agenda-demo"`. Dat is woordelijk dezelfde constructie als
`hondentrimsalons` (`sectors.ts` r.72-73): een bestaande route, geen nieuwe
belofte. De demo werkt ook echt: `zevren/components/demos/barbershop/BarbershopDemo.tsx`
r.820 voert de bevestigingsknop en r.832 het bevestigingsscherm, en
`zevren/lib/demos/barbershop-data.ts` voert vijf diensten (r.15-19), drie
medewerkers (r.23-25) en een rij dagen (r.29-33).

**Maar het is een kappersdemo, en deze pagina zegt dat hardop.** Dat is het enige
punt waarop ik afwijk van de zes pagina's die nu live staan, en het is niet mijn
idee: lane B heeft het op 02-09 in het veld al zo opgelost en er een reden bij
geschreven die ik niet kan verbeteren
(`marketing/outreach/2026-09-02-ab-verified.md` r.369-371): "De demo heet naar een
kapperszaak. Dat is in het bericht met vier woorden gezegd in plaats van
verzwegen — zij ziet bij het klikken toch een kapperszaak, en het zelf zeggen
kost minder dan het laten ontdekken."

Dat argument geldt op een pagina net zo hard als in een mail. De link die
`page.tsx` r.101-107 rendert luidt "Bekijk onze agenda-demo"; wie erop klikt ziet
een barbershop. Het verzwijgen bespaart één zin en kost de klik die erop volgt.
Fundament 1.31 zegt bovendien dat de bestemming van een link zelf een claim is,
en dit is dezelfde beslissing als die van 14-09, nu in de richting van de bezoeker
in plaats van de prospect.

De korte vorm zonder die openheid, gelijk aan `hondentrimsalons` (r.77), staat
onderaan dit bestand klaar voor het geval de eigenaar het cluster liever op één
vorm houdt.

## Waarom het Business-pakket

`planKey: "business"`, net als kappers en hondentrimsalons. De reden staat
hierboven: de bindende belofte van deze pagina is het afsprakensysteem, en dat
zit volgens `nl.ts` r.314 in het Business-pakket en niet in Starter. De
pakketkaarten op de pagina komen uit `PLANS` via `planKey`
(`page.tsx` r.55), dus het bedrag kan niet verlopen.

---

## De entry, klaar om te plakken

Plaats hem in `zevren/lib/local/sectors.ts` in de array `SECTORS`, direct ná
`hondentrimsalons` en vóór `garages`, zodat de twee hondenvakken bij elkaar
staan.

```ts
  {
    slug: "hondenscholen",
    name: "hondenscholen",
    h1Noun: "je hondenschool",
    planKey: "business",
    demoSlug: "barbershop-website",
    demoName: "onze agenda-demo",
    intro:
      "Een nieuwe cursist meldt zich op het moment dat het misgaat: een pup die aan de lijn trekt, een hond die niet terugkomt in het park. Dat moment valt zelden samen met je lesuren. Een eigen site laat zien welke lessen je geeft en wie je bent, en laat iemand 's avonds zelf een kennismaking vastleggen. Het Business-pakket is er inclusief afsprakensysteem.",
    proof:
      "Het boekingssysteem kun je vooraf zelf proberen. De demo erachter is gebouwd voor een kapperszaak, maar de stappen zijn dezelfde: een klant kiest een dienst, een medewerker en een moment, en krijgt een bevestiging. Op jouw site zijn dat jouw lessen, jouw trainers en jouw tijden.",
    metaDescription:
      "Een website voor je hondenschool met een agenda waarin cursisten zelf hun moment kiezen. Je lessen in beeld, een vaste prijs en een demo om vooraf te proberen.",
    faq: [
      {
        question: "Wat kost een website voor een hondenschool?",
        answer: "Het Business-pakket is 549 euro eenmalig, exclusief btw, met het afsprakensysteem erbij. Die prijs staat op de site en is de prijs op de factuur; een offertetraject is er niet.",
      },
      {
        question: "Kan iemand zelf een kennismaking of een proefles inplannen?",
        answer: "Ja, daar is het afsprakensysteem voor: de klant kiest zelf een dienst en een moment, ook 's avonds, en jij ziet de afspraak verschijnen zonder dat de telefoon hoeft te gaan. Hoe dat loopt kun je vooraf proberen in onze agenda-demo.",
      },
      {
        question: "Kan ik per cursus een eigen pagina maken?",
        answer: "Ja. Extra pagina's kosten 79 euro per pagina, dus een puppycursus en een gehoorzaamheidstraining kunnen elk hun eigen plek krijgen. Teksten en foto's kun je ook zelf aanpassen; de site is daarvoor gebouwd.",
      },
    ],
  },
```

---

## Claimcontrole op deze entry

Elke bewering hierboven tegen de bron gelegd, met dezelfde eis als voor een post.
Waar aanhalingstekens staan, is het woordelijk; waar ik samenvat, staan ze er
niet (fundament 1.39).

| Claim in de entry | Bron | Klopt |
| --- | --- | --- |
| "549 euro eenmalig" | `zevren/lib/offer.ts` r.23: `{ key: "business", price: 549, needs: "new-website" }` | ja |
| "exclusief btw" | `zevren/lib/i18n/dictionaries/nl.ts` r.283 `note` ("Prijzen zijn exclusief btw.") en r.161 `pricingNote` | ja |
| "met het afsprakensysteem erbij" en "Het Business-pakket is er inclusief afsprakensysteem" | `nl.ts` r.314: het Business-pakket is "inclusief een afsprakensysteem waarin klanten zelf hun tijd kiezen" | ja |
| "Die prijs staat op de site en is de prijs op de factuur; een offertetraject is er niet" | `sectors.ts` r.55, woordelijk de kapperspagina; en `nl.ts` r.278 ("Je weet de prijs voordat we beginnen, en dat is de prijs op de factuur") | ja, woordelijk overgenomen |
| "de klant kiest zelf een dienst en een moment, ook 's avonds" | `nl.ts` r.314 (klanten kiezen zelf hun tijd) en `sectors.ts` r.87, waar de trimsalonpagina dezelfde zin al voert | ja |
| "Extra pagina's kosten 79 euro per pagina" | `zevren/lib/offer.ts` r.58: `{ key: "extraPage", price: 79 }`, en `sectors.ts` r.255 voert dezelfde formulering | ja |
| "Teksten en foto's kun je ook zelf aanpassen; de site is daarvoor gebouwd" | `sectors.ts` r.255 ("Je kunt teksten en foto's ook zelf aanpassen") en r.63 ("de site is daarvoor gebouwd") | ja |
| "een klant kiest een dienst, een medewerker en een moment, en krijgt een bevestiging" | `zevren/lib/demos/barbershop-data.ts` r.15-19 (vijf diensten), r.23-25 (drie medewerkers), r.29-33 (dagen); `zevren/components/demos/barbershop/BarbershopDemo.tsx` r.820 (bevestigingsknop) en r.832 (bevestigingsscherm) | ja, alle vier de stappen bestaan |
| "De demo erachter is gebouwd voor een kapperszaak" | `sectors.ts` r.72 `demoSlug: "barbershop-website"`, `page.tsx` r.104 linkt naar `/projects/barbershop-website`, en de demodata r.15-19 zijn kappersbehandelingen | ja, en dit is de zin die de pagina eerlijk maakt in plaats van alleen waar |
| "Op jouw site zijn dat jouw lessen, jouw trainers en jouw tijden" | Gaat over de site die gebouwd wordt, niet over de demo. Dezelfde constructie als `sectors.ts` r.77 ("met jouw behandelingen en jouw tijden") | ja |
| H1 "Een website voor je hondenschool" | `page.tsx` r.96 rendert `Een website voor {h1Noun}` | ja, en dit is de hele reden dat de pagina bestaat |
| Paginatitel "Website voor hondenscholen" en FAQ-kop "Veelgestelde vragen van hondenscholen" | `page.tsx` r.40 (`title`) en r.133 (`LocalFaq title`), beide uit `name` | ja |
| Het bedrag op de pakketkaarten | `page.tsx` r.55: `PLANS.find((p) => p.key === sector.planKey)`, dus het komt uit `offer.ts` en wordt niet getypt | ja, kan niet verlopen |

**Wat er bewust níet in staat.** Geen levertijd en geen doorlooptijd. Geen aantal
klanten, geen cursisten, geen reviewscore, geen enkel getal over resultaat. Geen
belofte dat de site laat zien hoeveel plekken er nog vrij zijn in een cursus,
want dat is een beschikbaarheidsteller en de site belooft die nergens. Geen
belofte over online betalen of cursusgeldincasso, om dezelfde reden. Geen
inschrijfformulier met velden die het scherm niet heeft (fundament 1.40b). Geen
beoordelingenbelofte: die staat op de trimsalonpagina (`sectors.ts` r.91) en die
lenen is dezelfde fout (fundament 1.40b, tweede helft). Geen schaarste, geen "wij
zijn klein", geen uitroeptekens, geen em-streepjes.

**Eén claim bewust weggelaten.** Het onderhoudsplan van 49,99 euro per maand komt
in deze entry niet voor. Het is waar (`nl.ts` r.287) en het staat op vier andere
sectorpagina's, maar de derde FAQ-vraag gaat hier over uitbreiden en niet over
onderhoud, en er zijn drie vragen. Wil de eigenaar hem er toch bij, dan is de
formulering van `sectors.ts` r.203 de gedekte vorm.

## Meetwerk op de vorm

Gemeten met `LC_ALL=C.UTF-8 wc -m` op de tekst zelf, niet geschat (fundament
1.51: zonder die locale telt `wc -m` in deze omgeving bytes).

| Veld | Tekens | Norm | Uitkomst |
|---|---|---|---|
| Paginatitel "Website voor hondenscholen \| ZEVREN" | 35 | `seo-audit` r.241: 50-60 tekens zichtbaar in de SERP | onder de bandbreedte. De titel wordt opgebouwd door `zevren/lib/seo.ts` r.112 en is gelijkvormig aan de tien bestaande; een langere titel zou deze pagina uit de reeks halen en dat weegt hier zwaarder |
| `metaDescription` | 159 | `seo-audit` r.256: 150-160 tekens | binnen de bandbreedte, en daarmee de langste van de elf: de tien bestaande staan tussen 107 (nagelsalons) en 138 (kappers) en vallen er dus allemaal onder |
| `intro` | 353 | vier zinnen | binnen de "Two to four sentences" die `sectors.ts` r.27 als comment eist |
| `proof` | 279 | één alinea | zoals `sectors.ts` r.29 vraagt. De korte variant onderaan is 235 |

De H1 draagt het zoekwoord ("website voor je hondenschool"), en het staat ook in
de eerste honderd woorden van de `intro` (`seo-audit` r.271 en r.285).
Kannibalisatie met `hondentrimsalons` (`seo-audit` r.329): de twee pagina's mikken
op verschillende zoekopdrachten ("website voor hondenschool" tegen "website voor
hondentrimsalon") en delen geen kernwoord in titel of H1. De pagina wordt geen
weespagina: `page.tsx` r.143-150 linkt elke sectorpagina naar alle andere,
`generateStaticParams` (r.31-32) bouwt de route uit `SECTORS`, en
`zevren/app/sitemap.ts` r.70-74 zet elke slug uit `SECTORS` in de sitemap. Er hoeft
dus geen route, geen component en geen navigatie bij: één entry levert de hele
pagina op, inclusief de Service-JSON-LD (`page.tsx` r.57-75) en het kruimelpad
(r.82-88).

---

## De korte variant, zonder de zin over de kapperszaak

Wil de eigenaar het cluster op één vorm houden, vervang dan de `proof` door deze.
Alles eromheen blijft gelijk. Dit is 235 tekens, 44 minder dan de versie
hierboven.

```ts
    proof:
      "Het boekingssysteem kun je vooraf zelf proberen: in onze demo kiest een klant een dienst, een medewerker en een moment, en krijgt hij een bevestiging. Dezelfde stappen, met jouw lessen, jouw trainers en jouw tijden, komen op jouw site.",
```

Deze variant is niet onwaar: zij beschrijft alleen de stappen en belooft geen
hondenschool in beeld, precies zoals `hondentrimsalons` (r.77) en `kappers`
(r.49) nu doen. Het verschil is wat de bezoeker ná de klik denkt, en daarover
heeft lane B de enige meting die wij hebben.

Kiest de eigenaar juist voor de openheid, dan komt de vraag meteen of
`hondentrimsalons` en `kappers` mee moeten. Dat is een beslissing over drie
pagina's en niet over één, en daarom leg ik hem als vraag neer in plaats van hem
hier te maken.

## Wat er daarna nog moet gebeuren

1. Eén regel van de eigenaar onder "New" in `agents/inbox.md`. Zonder die regel
   gaat er niets in `zevren/`.
2. `npx tsc --noEmit` en `npm run build` vanuit `zevren/` groen, vóór de push.
   De entry voegt geen type toe: `demoSlug` is van het type `WorkSlug` en
   `"barbershop-website"` staat in die union (`zevren/types/index.ts` r.65).
3. Eén regel in de directives zodat Sam de bestemming voor een hondenschool
   verlegt van `/website-voor/hondentrimsalons` naar
   `/website-voor/hondenscholen`, met de UTM-vorm die al geldt:
   `?utm_source=outreach&utm_medium=email&utm_campaign=hondenscholen-w38`.
4. De open vraag die ik niet zelf beantwoord: **welk pakket dekt een boeking over
   een periode**, met twee data in plaats van één moment. Zolang daar geen
   antwoord op is, kan er geen eerlijke pagina voor dierenpensions komen (37
   dossiers) en blijft de uitlaatservice (5 dossiers, plus de gecombineerde
   noteringen) op de route van 14-09: de directe demolink, en in het bericht de
   demo bij naam in plaats van "onze pagina voor jouw vak".

## Kopieerklare regels

Voor onder "New" in `agents/inbox.md`, als de eigenaar akkoord is:

```
John: akkoord met de sectorpagina voor hondenscholen uit marketing/drafts/sectorpagina-hondenscholen-2026-09-16.md. Zet de entry in sectors.ts en push hem met een groene build.
```

Als hij de pagina wil, maar zonder de zin over de kapperszaak:

```
John: akkoord met de sectorpagina voor hondenscholen, maar neem de korte proof-variant onderaan het voorstel. Het cluster blijft op één vorm.
```

Als hij hem niet wil:

```
John: geen pagina voor hondenscholen. Grond: <reden>. Laat de hondensector op /website-voor/hondentrimsalons of op de directe demolink.
```

En de vraag uit punt 4, los te beantwoorden:

```
John: een boeking over een periode (dierenpension, twee data) valt wel/niet onder het afsprakensysteem van het Business-pakket. <toelichting>
```

Getekend, John.
