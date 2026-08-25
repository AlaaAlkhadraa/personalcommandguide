# Het ZEVREN-agentsysteem

Hoe de agents samenwerken, wie wanneer draait, en wat er gebeurt als
iets faalt. Dit bestand is de waarheid over het systeem; de triggers
in Claude Code Remote voeren het uit.

## De rollen

| Agent | Ritme | Levert | Playbook |
|---|---|---|---|
| Sam (outreach) | dagelijks 07:03 | ≥10 prospects met e-mail in `marketing/outreach/` | `agents/outreach-agent.md` |
| Azzouz (verificatie) | dagelijks 08:30 | `YYYY-MM-DD-verified.md`: verdict per kaart + definitieve mails | triggerprompt |
| John (marketing) | dagelijks 06:45 | 1 LinkedIn-post + 1 actie in `marketing/social/`; ma: artikel-VOORSTEL in `marketing/drafts/` | `agents/marketing-agent.md` |
| Azzouz (CEO) | zondag 17:00 | weekrapport in `marketing/reports/` + directieven | `agents/ceo-agent.md` |
| Opzichter | dagelijks 09:15 | dashboard verversen + dekking + één notificatie | dit bestand |

## De orchestrator-architectuur (sinds 25-08)

**Waarom.** Acht diensten op rij stierven stil. Autopsie op de
sessies wees twee oorzaken aan: (1) trigger-geminte verse sessies
kregen de repository NIET mee — agents werden wakker in een lege
container en gingen in /mnt zoeken; (2) elk commando buiten de
werkdirectory opent een permissievraag die niemand ooit beantwoordt,
waarna de sessie eeuwig blokkeert (status REQUIRES_ACTION).
Kindsessies die de hoofdsessie met `create_session` + repository
aanmaakt, hebben geen van beide problemen en leverden aantoonbaar
(21-08 en 25-08).

**Hoe.** Drie orchestrator-beats vuren dagelijks in de hoofdsessie,
die uitsluitend SUPERVISEERT — de eigenaar heeft vastgelegd dat de
hoofdsessie nooit zelf agent-werk doet:

1. **06:40 — beat 1:** spawnt John- en Sam-kinderen met de repo,
   prompts uit `agents/prompts/john.md` en `sam.md`.
2. **08:30 — beat 2:** controleert of Sam pushte; zo ja: spawnt
   Azzouz-verificatiekind (`azzouz-dag.md`); zo nee: éénmalige
   herstart van Sam en uitstel van Azzouz.
3. **09:15 — beat 3:** eindcontrole van alle drie, éénmalige herstart
   van wat dood of geblokkeerd is, en ÉÉN Arabische notificatie aan de
   eigenaar met eerlijke status per agent. Op zondag spawnt deze beat
   ook het weekrapport-kind (`azzouz-week.md`).

De agentprompts leven als bestanden in `agents/prompts/` — één bron
van waarheid, versiebeheerd. Elke prompt opent met de overlevingsregel:
werk alleen binnen de repository, nooit commando's daarbuiten.

## Triggerregister

| Trigger | ID | Vuurt in |
|---|---|---|
| Beat 1 spawn 06:40 | `trig_01PmZPYdKEmuEYqqKBcZRjqM` | hoofdsessie |
| Beat 2 check+Azzouz 08:30 | `trig_01KGgCs6sqkx853PZEqR9xdX` | hoofdsessie |
| Beat 3 eindcontrole 09:15 | `trig_019kMKNFKwKRaWPr5LbWiVBa` | hoofdsessie |

De vier oude fresh-session-triggers (Sam, John, Azzouz dag + week)
zijn 25-08 verwijderd: ze mintten sessies zonder repository.

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
