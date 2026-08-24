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

Vaste plek: **https://zevren.nl/admin/outreach**, achter de bestaande
adminlogin van de site. De pagina leest `marketing/outreach/` uit de
repository bij elke aanvraag; omdat elke push naar `main` de site
opnieuw deployt, is het bord automatisch actueel zodra een agent pusht.
Code: `zevren/lib/server/outreach.ts` (parser) en
`zevren/components/admin/OutreachBoard.tsx` (weergave).
Toont: kaarten van de nieuwste dag met Azzouz' verdicts,
pipeline-tellers uit het ledger, leveringsdata per agent, per prospect
Open-in-Mail en kopieerknoppen, en verzonden-vinkjes (localStorage,
geheugensteun — het ledger blijft de administratie).

Het admin-account wordt tijdens de Vercel-build aangemaakt of ververst
wanneer ADMIN_EMAIL en ADMIN_PASSWORD als environment variables in
Vercel staan; wachtwoorden horen in Vercel, nooit in een chat.
De oude artifact-versie (`tools/dashboard.py`) blijft als offline
reserve maar wordt niet meer dagelijks gepubliceerd.

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
3. dekt met zijn pushes automatisch het bord op zevren.nl/admin/outreach af;
4. controleert op maandag John en Azzouz' weekrapport, vuurt hun
   trigger één keer opnieuw af bij uitblijven, en neemt het op
   dinsdag zelf over als ook die herkansing niets opleverde.

Eén notificatie per dag, in het Arabisch, met aantallen en de
artifact-link. Geen stille dagen.

## De skillsbibliotheek

Sinds 24-08 draagt de repo de volledige marketingskills-bibliotheek
(50 skills, MIT) in `.claude/skills/`, aanroepbaar in elke sessie.
`.agents/product-marketing.md` is het fundament dat elke skill eerst
leest; alleen Azzouz werkt het bij. Wie welke skills gebruikt staat in
`agents/skills-toewijzing.md`: Sam de cold-email/prospecting-set,
John de content/SEO/ads-set, Azzouz de strategie/pricing-set met
marketing-council voor het weekrapport. Skills zijn frameworks; de
harde regels hieronder verslaan elk skill-advies.

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
