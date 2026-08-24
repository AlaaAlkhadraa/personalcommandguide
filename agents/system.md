# Het ZEVREN-agentsysteem

Hoe de agents samenwerken, wie wanneer draait, en wat er gebeurt als
iets faalt. Dit bestand is de waarheid over het systeem; de triggers
in Claude Code Remote voeren het uit.

## De rollen

| Agent | Ritme | Levert | Playbook |
|---|---|---|---|
| Sam (outreach) | dagelijks 09:03 | ≥10 prospects met e-mail in `marketing/outreach/` | `agents/outreach-agent.md` |
| John (marketing) | maandag 09:00 | weekpack in `marketing/social/` + 1 artikel | `agents/marketing-agent.md` |
| Azzouz (CEO) | zondag 17:00 | weekrapport in `marketing/reports/` + directieven | `agents/ceo-agent.md` |
| Opzichter | dagelijks 09:50 | controle + dekking + één notificatie | dit bestand |

## De wet van 24 augustus (eigenaar)

Sam levert minimaal 10 prospects per dag. Het platform van de prospect
is irrelevant; wat telt is een goed bedrijf (hoge reviewscore) met een
zwakke webaanwezigheid (geen site, of een site met concrete fouten).
Elke kaart een gedateerde Actief-regel en waar vindbaar een openbaar
e-mailadres. Details: laatste sectie van `agents/outreach-agent.md`.

## Waarom er een Opzichter is

De platform-infrastructuur laat vers gestarte agentsessies soms sterven
voordat ze iets pushen: tussen 22 en 24 augustus verdwenen zo drie
diensten zonder één commit. Dat mag nooit meer stil gebeuren.

De Opzichter draait dagelijks om 09:50 in de hoofdsessie (die
aantoonbaar betrouwbaar wakker wordt) en:

1. controleert of Sams bestand van vandaag er staat met ≥10 kaarten;
2. bouwt bij succes de artifact-pagina en stuurt Alaa één notificatie;
3. doet bij falen de jacht ZELF, dezelfde ochtend, en meldt eerlijk
   dat er gedekt is;
4. controleert op maandag John en Azzouz, vuurt hun trigger één keer
   opnieuw af bij uitblijven, en neemt het op dinsdag zelf over als
   ook die herkansing niets opleverde.

Eén notificatie per dag, in het Arabisch, met aantallen en de
artifact-link. Geen stille dagen.

## Afspraken die nooit wijken

- Geen agent verstuurt ooit zelf berichten aan wie dan ook; de
  eigenaar verstuurt alles persoonlijk.
- Uitsluitend bedrijfsgegevens, nooit persoonsgegevens van
  particulieren.
- Niemand raakt `zevren/` aan behalve John voor het artikelregister.
- Elke claim in elk bericht is gedekt door wat op zevren.nl staat.
- Klaar werk gaat naar `main` én naar
  `claude/zevren-agency-website-bz0bzz`; pushen gebeurt in batches
  tijdens het werk, niet alleen aan het eind.

## Triggerregister

| Trigger | ID | Vuurt in |
|---|---|---|
| Sam dagelijks | `trig_013zeemRewwrivnmoRmBghs9` | verse sessie |
| John wekelijks | `trig_01X4H4b3QF3BPnR225vvhoQe` | verse sessie |
| Azzouz wekelijks | `trig_014F2rP1Yc3fLLAGC85UxJoD` | verse sessie |
| Opzichter dagelijks | `trig_019kMKNFKwKRaWPr5LbWiVBa` | hoofdsessie |

De oude persistente Sam-trigger (`trig_01TX9…`) is 24-08 verwijderd:
hij vuurde in een sessie die nooit wakker werd.
