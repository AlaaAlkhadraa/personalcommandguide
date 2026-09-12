# Voorstel — één FAQ over beoordelingen op drie salonpagina's

**Status: VOORSTEL. Niets in `zevren/` is aangeraakt.** Dit bestand gaat pas de
code in nadat de eigenaar er een regel over schrijft onder "New" in
`agents/inbox.md`. Staande order van 24 augustus: geen akkoord, geen deploy. Een
directief van Azzouz is dat akkoord niet.

Geschreven door John op 12 september 2026.

---

## Wat er ontbreekt

`zevren/lib/local/sectors.ts` geeft elke sector drie FAQ-items. Bij
**hondentrimsalons** gaat het derde item over beoordelingen (regel 89-92):

> question: "Kan ik mijn beoordelingen op de site laten zien?"
> answer: "Ja. Beoordelingen die je al hebt verzameld kunnen op je eigen site
> staan, zodat een nieuwe klant ze ziet voordat hij kiest, in plaats van alleen
> op de pagina van een gids of platform."

Bij **kappers** (r.40), **schoonheidssalons** (r.152) en **nagelsalons**
(r.180) bestaat dat item niet. Hun drie vragen gaan over prijs, over zelf
teksten of foto's bijwerken en over de boekingsflow.

Ook de `intro` van de trimsalonpagina noemt de beoordelingen expliciet ("laat
nieuwe klanten je beoordelingen zien voordat ze kiezen", r.75). De drie
salonpagina's noemen ze nergens.

## Waarom dat één van de vier bestemmingen van vandaag kostte

De directive van deze week staat de hoek `review-bewijs` alleen toe in een
sector waar reviews de koopreden zijn: salons, trimsalons, pedicures. Dat zijn
op papier vier bruikbare bestemmingen. `pedicures` heeft geen sectorpagina, en
fundament 1.31 zegt dat de bestemming van een link zelf een claim is: een post
die belooft dat de lezer daar antwoord vindt op de reviewvraag, mag niet landen
op een pagina waar die vraag niet staat. Daarmee bleef er precies één over.

De `cro`-skill plaatst dit onder bezwaarafhandeling (punt 6 van het framework):
de FAQ is de plek voor de vraag die de koper niet hardop stelt. In een
schoonheidssalon of nagelsalon is dat niet de prijs maar het vertrouwen, en het
bewijs daarvoor zijn de beoordelingen.

Het antwoord hoeft niet bedacht te worden. Het staat er al, in gebruik en
goedgekeurd, op de trimsalonpagina.

## Het voorstel

Eén extra FAQ-item per pagina, achter de bestaande drie. Geen andere wijziging:
geen nieuwe belofte, geen tweede prijsvermelding, geen claim over verzamelen of
overzetten van reviews. Alleen de vraag beantwoorden die er al ligt.

### `kappers` (als vierde item, na r.64)

```ts
      {
        question: "Kan ik mijn beoordelingen op mijn eigen site laten zien?",
        answer: "Ja. Beoordelingen die je al hebt verzameld kunnen op je eigen site staan, naast je prijzen en je agenda, zodat een nieuwe klant ze ziet voordat hij een tijd kiest in plaats van alleen op de pagina van een gids of platform.",
      },
```

### `schoonheidssalons` (als vierde item, na r.176)

```ts
      {
        question: "Kan ik mijn beoordelingen op mijn eigen site laten zien?",
        answer: "Ja. Beoordelingen die je al hebt verzameld kunnen op je eigen site staan, bij de behandeling waar ze over gaan, zodat een nieuwe klant ze leest voordat ze kiest in plaats van alleen op de pagina van een gids of platform.",
      },
```

### `nagelsalons` (als vierde item, na r.204)

```ts
      {
        question: "Kan ik mijn beoordelingen op mijn eigen site laten zien?",
        answer: "Ja. Beoordelingen die je al hebt verzameld kunnen op je eigen site staan, naast de foto's van je werk, zodat een nieuwe klant ze ziet voordat ze boekt in plaats van alleen op de pagina van een gids of platform.",
      },
```

De regelnummers zijn die van vandaag; wijzigt het bestand, dan plaats je het
item simpelweg als vierde element van de `faq`-array van die sector.

## Wat het oplevert, en wat het niet is

- **Drie extra bestemmingen** voor de hoek `review-bewijs`, die nu op één
  sectorpagina is aangewezen. `schoonheidssalons` heeft nog nooit een post
  ontvangen en ligt daarmee klaar als bestemming voor volgende week.
- **Drie extra vindbare vragen.** De FAQ's staan al in de paginastructuur; een
  vierde vraag per sector is drie zoekvragen erbij, in de woorden waarin
  saloneigenaren ze stellen.
- **Wat het niet is:** geen nieuwe functionaliteit en geen nieuwe belofte. De
  mogelijkheid bestaat al en wordt op de trimsalonpagina al zo beschreven. Dit
  voorstel zet hetzelfde antwoord op drie pagina's waar dezelfde vraag leeft.

## Als de eigenaar akkoord geeft

Dan is de uitvoering: vier regels per sector in `zevren/lib/local/sectors.ts`,
daarna vanuit `zevren/` `npm install`, `npx tsc --noEmit` en `npm run build`,
allebei schoon, en pas dan committen en spiegelen. Er is geen ander bestand bij
betrokken; de FAQ's worden uit dit bestand gerenderd.

Getekend, John.
