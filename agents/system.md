# Het ZEVREN-agentsysteem

Hoe de agents samenwerken, wie wanneer draait, en wat er gebeurt als
iets faalt. Dit bestand is de waarheid over het systeem; de triggers
in Claude Code Remote voeren het uit.

## De rollen

| Agent | Ritme | Levert | Playbook |
|---|---|---|---|
| Sam (outreach) | dagelijks 07:03 | ≥10 prospects met e-mail in `marketing/outreach/` | `agents/outreach-agent.md` |
| Azzouz (verificatie) | dagelijks 08:30 | `YYYY-MM-DD-verified.md`: verdict per kaart + definitieve mails | triggerprompt |
| John (marketing) | maandag 09:00 | weekpack in `marketing/social/` + 1 artikel | `agents/marketing-agent.md` |
| Azzouz (CEO) | zondag 17:00 | weekrapport in `marketing/reports/` + directieven | `agents/ceo-agent.md` |
| Opzichter | dagelijks 09:15 | dashboard verversen + dekking + één notificatie | dit bestand |

## De keten van elke ochtend

1. **07:03 — Sam jaagt.** Minimaal 10 kaarten, pusht in batches.
2. **08:30 — Azzouz verifieert.** Loopt elke kaart na (levensteken,
   e-mailadres, reviewscore, claims gedekt door zevren.nl, niet al in
   het ledger) en schrijft `-verified.md`: GOEDGEKEURD met bewijs of
   AFGEKEURD met reden, plus per goedgekeurde kaart de definitieve
   onderwerp- en berichttekst. Kopjes: `## N. Naam — Plaats`, twee
   codeblokken per goedgekeurde kaart (het dashboard parseert dit).
3. **09:15 — Opzichter.** Dekt gaten (jaagt zelf bij <10, verifieert
   zelf bij ontbrekende verificatie), bouwt het dashboard opnieuw met
   `python3 tools/dashboard.py` en publiceert het naar de vaste
   artifact-URL, en stuurt Alaa één notificatie in het Arabisch.
4. **Alaa verstuurt.** Het dashboard toont per goedgekeurde prospect
   een Open-in-Mail-knop (onderwerp en bericht ingevuld) en
   kopieerknoppen. Verzenden doet uitsluitend Alaa, gespreid over de
   dag. Geen agent verstuurt ooit zelf — dat is een harde grens
   (spam, domeinreputatie, wetgeving), geen instelling.

## Het dashboard

Vaste URL: https://claude.ai/code/artifact/a98619a3-647e-4a4f-9326-b6d97aad1278
Generator: `tools/dashboard.py` + `tools/dashboard.template.html`.
Toont: kaarten van de nieuwste dag met verdicts, pipeline-tellers uit
het ledger, agentgezondheid uit de git-log, verzonden-vinkjes
(localStorage, geheugensteun — het ledger blijft de administratie).

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

1. controleert Sams bestand (≥10 kaarten) en Azzouz' verificatie;
2. dekt elk gat zelf, dezelfde ochtend, en meldt eerlijk dat er
   gedekt is;
3. ververst het dashboard op de vaste URL;
4. controleert op maandag John en Azzouz' weekrapport, vuurt hun
   trigger één keer opnieuw af bij uitblijven, en neemt het op
   dinsdag zelf over als ook die herkansing niets opleverde.

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
| Sam dagelijks 07:03 | `trig_013zeemRewwrivnmoRmBghs9` | verse sessie |
| Azzouz verificatie 08:30 | `trig_01FASgDNVo7pzKWSMfpJAMTK` | verse sessie |
| John wekelijks ma 09:00 | `trig_01X4H4b3QF3BPnR225vvhoQe` | verse sessie |
| Azzouz rapport zo 17:00 | `trig_014F2rP1Yc3fLLAGC85UxJoD` | verse sessie |
| Opzichter dagelijks 09:15 | `trig_019kMKNFKwKRaWPr5LbWiVBa` | hoofdsessie |

De oude persistente Sam-trigger (`trig_01TX9…`) is 24-08 verwijderd:
hij vuurde in een sessie die nooit wakker werd.
