# Directives — week of 2026-08-31 (set by Azzouz)

Deze orders gelden tot zondag 6 september. Ze vervangen die van 17 augustus
volledig. Waar ze botsen met een order van de owner in
`agents/outreach-agent.md`: de owner wint, en ik zeg het er hieronder bij.

## For John

- **Het artikel is deze week de eerste taak, niet de post.** Vorige week is
  het artikel uitgevallen omdat maandag niet draaide; dat mag niet twee weken
  op rij. Je bent er vanochtend al aan begonnen
  (`marketing/drafts/artikel-2026-08-31.md`) — maak het af en zet het in
  `zevren/lib/insights/articles.ts` volgens je playbook. Dat is de enige
  wijziging in `zevren/` die iemand deze week maakt.
- **Twee posts moeten hetzelfde verkopen als Sams kaarten.** Onze mails en
  onze posts richten zich op dezelfde ondernemer en verwijzen nu nergens naar
  elkaar. Wie deze week een mail van Alaa krijgt en hem daarna opzoekt, moet
  op LinkedIn hetzelfde argument terugvinden. Schrijf er dus minstens twee op
  de twee lekken die Sams goedgekeurde kaarten verkopen: **de boeking die 's
  avonds verloren gaat omdat er niemand opneemt**, en **de offerteaanvraag die
  half binnenkomt of nooit komt omdat de koper eerst afgerond werk wil zien.**
  Eén beeld per post, uit de zaak van de lezer, niet uit die van ons.
- **De prijscontrole die je vorige week zelf uitvoerde, wordt de vaste
  regel.** Je vond dat "extra taal 150" niet klopte (het is 150 voor drie
  talen), meldde het en repareerde je eigen post van 28-08 uit jezelf. Precies
  goed. Vanaf nu staat het als eis: elk getal in een post wordt vóór het
  pushen tegen `zevren/lib/offer.ts` en de dictionaries gelegd, en de controle
  staat in het bestand. Het fundament staat nu op 1.8 en is gecorrigeerd.
- **Formaatrotatie doorzetten.** Zes vormen in zes dagen was de reden dat de
  week las als zes posts en niet als één post zes keer. Geen vorm herhalen
  binnen zeven dagen.

## For Sam

**Het aantal.** De dagnorm van dertig goedgekeurde kaarten is een order van
de owner en die verlaag ik niet. Wat ik wél verander:

- **Vier lanes, geen bijspawns.** Lanes E/F/G zijn deze week opgeschort. Op
  30-08 leverden drie extra lanes samen twee kaarten waarvan één goedgekeurd;
  dat middel is op. Haal je de dertig niet, dan **meld je het tekort met het
  getal en de reden in je dagafsluiting** — je haalt het niet met een zwakkere
  kaart. De owner heeft mijn advies om de norm te vervangen door 8 tot 10
  verzendklare kaarten per dag; tot hij beslist, geldt dertig als norm en
  eerlijkheid als uitweg.
- **Niet soepeler keuren, in geen enkele richting.** Ook niet op een dag die
  op één kaart eindigt.

**De sectorcap telde verkeerd, en dat kostte je vorige week kaarten.**

Je paste de cap toe op elke ledgerrij. Er kwamen er in zeven dagen 584 bij,
dus stond elke sector die wérkt op slot: kapsalons 26 rijen, barbershops 27,
schilders 17, dakdekkers 16. Maar een afgewezen bedrijf put een sector niet
uit — het bewijst alleen dat dát bedrijf niet paste. **De cap telt vanaf nu
alleen rijen met status `drafted` of goedgekeurd, per sector én per
lane-regio.** Op die telling staat kapsalon op 2 en is gewoon open; alleen
barbershop en pedicure (beide 5) zijn deze week dicht. Vastgelegd in
`.agents/product-marketing.md` 1.8.

**Sectorplan — afspraakzaken eerst.** Het probleem dat wij oplossen is groot
én frequent waar een agenda het knelpunt is (elke avond een gemiste boeking)
en groot-maar-zeldzaam bij offertewerk. Dus in deze volgorde:

1. **Kapsalons en hondentrimsalons** — weer open op de juiste telling, en het
   zijn de twee sectoren met de hoogste bewezen opbrengst. Andere steden dan
   vorige week.
2. **Gastouders en kinderopvang aan huis** (1 en 0 kaarten) — en dit is de
   sector waar de nieuwe bewijsroute hieronder het hardst werkt, want GGD-
   inspectierapporten zijn openbaar én gedateerd.
3. **Schoonmaak- en glazenwassersbedrijven, mobiele fietsenmakers,
   dierenpensions, cateraars en foodtrucks** — alle vier nul of één kaart.
4. **Fitness/personal training is weer beschikbaar** (0 kaarten op de juiste
   telling). De boekingspoort sluit er ongeveer twee op drie, dus check Fresha
   en Momoyoga vóór het schrijven, niet erna.

**Permanent dicht — niet opnieuw inzetten:** rijscholen, maneges en
paardentrainers, zang- en muziekdocenten, tandtechniek, kledingherstel en
naaiateliers, keramiek- en bloemenateliers, tattoo-studio's, dansscholen en
yogastudio's. Allemaal gesloten op bewijs uit meerdere lanes: of het adres
staat nooit in de zoekresultaten, of de zaken zijn structureel 12 tot 59 jaar
oud.

**Nieuw: de bewijsroute voor bedrijven zónder website.** Je notitie van 22
augustus is toegewezen, met één correctie. Het onderscheid is niet
eigen-bron-versus-derde-partij maar: **legt het gedateerde feit een daad van
het BEDRIJF vast, of een daad van de uitgever?**

- **Telt wél:** een KvK-mutatie met datum · een gedateerde gemeentelijke of
  GGD-vergunning, -inspectie of -rapport · een SBB-erkenning of -verlenging
  binnen twaalf maanden · een vacature met plaatsingsdatum.
- **Telt niet:** "Updated ‹maand› ‹jaar›" op Yelp, wheree, oozo of drimble.
  Dat bewijst dat de gids leeft, niet het bedrijf.

Je eerste zoekopdracht bij een bedrijf zonder site is daarom
`"<naam>" <plaats> kvk mutatie` of `"<naam>" GGD OF vergunning OF inspectie`,
en niet een gidsenzoekopdracht. Loop je vast op het e-mailadres, dan blijft
`erkend leerbedrijf <sector> <stad> e-mail contactpersoon site:stagemarkt.nl`
de beste eerste zoekopdracht. Volledig in `.agents/product-marketing.md` 1.7.

**Drie velden in het ledger, vanaf je eerstvolgende dienst.** We kunnen op
dit moment niet uitrekenen wát werkt, omdat de invalshoek alleen in het
dagbestand staat en niet in het ledger. Zet er per kaart bij: **`Sector`,
`Pakket` (299/549/899) en `Hoek`** — die laatste in één woord uit een vaste
lijst: `review-bewijs`, `openingstijden`, `vindbaarheid`, `offertelek`,
`agendalek`. Het kost jou een regel en het is de enige manier waarop een
antwoord ooit een les wordt.

**Correctie 01-09: het worden geen echte kolommen.** Ik vroeg hier om drie
kolommen in de tabel. Drie lanes kozen op 01-09 onafhankelijk van elkaar de
notitiekolom in plaats daarvan, met dezelfde reden: 878 bestaande rijen
herschrijven om iets filterbaar te maken dat met één `grep` al filterbaar is,
in een week waarin de parser twee keer bijna een geldige kaart opat. Ze hebben
gelijk en ik trek het kolomdeel in. **De vorm is vanaf nu vast:
`Sector: … · Pakket: … · Hoek: …` vooraan het notitieveld**, en een streepje
waar het lek niet is vastgesteld — een hoek noteren bij een onbewezen lek maakt
het veld onbruikbaar voor precies de vraag waarvoor het bedacht is. Vastgelegd
in `.agents/product-marketing.md` 1.11.

**De bellijst wordt een eigen bestand:
`marketing/outreach/bellijst.md`.** Jonge, op-profiel bedrijven zonder
vindbaar e-mailadres staan nu verspreid over dagbestanden en
sectorbevindingen. Verzamel ze in één tabel — naam, plaats, sector, telefoon,
het gedateerde levensteken, en waarom de kaart niet geschreven is. De owner
beslist zelf of hij belt; onze taak is dat het klaarligt.

**Drie dingen die vorige week kaarten kostten en die niet terugkomen:**

- **Een open poort is een bevinding, geen kaart.** Op 30-08 vielen alle drie
  de afkeuringen hierop. Krijg je de poort niet dicht, dan gaat het bedrijf
  naar de sectorbevindingen met ledgerstatus `lead - poort open` — niet naar
  het bord met een controleopdracht voor de owner erbij. Hij betaalt om tijd
  te besparen.
- **De exacte vormen, letterlijk.** Kaartkop `## N. Naam — Plaats`, metadata
  `- **Key:** waarde` mét het streepje. Twee keer is een geldige kaart vorige
  week bijna van het bord verdwenen omdat de parser de vorm niet kende.
- **Nummer bevindingssecties nooit.** Een genummerde bevindingskop kan het
  kaartpatroon nabootsen en liet bij lane F de laatste kaart doorlopen tot het
  einde van het bestand. De vastgelegde vorm is `## Bevinding — <onderwerp>`:
  ongenummerd, op `## `-niveau (`.agents/product-marketing.md` 1.10). **Deze
  regel schreef tot 01-09 `### 1.` t/m `### 5.` voor en sprak daarmee 1.10
  tegen; twee lanes zijn erover gestruikeld en de tegenstrijdigheid is hierbij
  opgeheven — 1.10 is leidend.**

**Eén toevoeging aan het bericht:** de link naar de conceptbouwer krijgt een
UTM, zodat we kunnen zien of een mail is aangekomen ook als niemand
antwoordt: `zevren.nl/concept-bouwer?utm_source=outreach&utm_medium=email&utm_campaign=<sector>-w36`.
Op sectorniveau, nooit per ontvanger — wie individueel meet in een
persoonlijke mail, meet iets wat hij niet mag meten.

## Standing context

- **Er zijn 106 kaarten klaar om te versturen en er is er nog nooit één
  verstuurd.** Nul `sent`, nul `replied`, sinds de start. Dat is de reden dat
  alles deze week op verzendklaarheid wordt beoordeeld en niet op aantal: een
  kaart die de owner nog moet nalopen, komt bovenop een stapel die al niet
  wegkomt. Het betekent ook iets ongemakkelijks over mijn eigen werk: mijn
  acht poorten zijn nooit tegen één werkelijke uitkomst geijkt, want die is er
  niet. Ik keur dus streng op een standaard die niemand heeft kunnen toetsen.
  Draag dat mee bij alles wat ik afkeur.
- **Kaarten bederven.** Een levensteken en een poortcontrole dragen een datum.
  Alles ouder dan ongeveer twee weken moet vóór verzenden opnieuw langs poort
  (a). Hoe langer de stapel staat, hoe duurder hij wordt.
- **Drie vragen liggen bij de owner** (`marketing/reports/2026-08-30.md`): de
  dagnorm van dertig vervangen door 8-10 verzendklare kaarten, de bellijst
  laten bellen, en het leeftijdsvenster oprekken naar 8-10 jaar. Mijn advies:
  ja, ja, nee. Zolang hij niet beslist heeft, verandert er niets aan het
  profiel van 1-6 jaar — met "grofweg" erbij, zoals 1.6 vastlegt: zeven jaar
  is de rand en op zichzelf geen afwijzing.
- **`.agents/product-marketing.md` staat op 1.8.** Nieuw sinds vorige week:
  de add-on-prijs (150 = drie talen), "Wiens daad draagt de datum" (1.7) en de
  gerepareerde sectorcap (1.8). Lees die drie voor je eerste dienst.
- **John levert deze week een artikel** over doorlooptijd. Zodra het live
  staat, mag een kaart ernaar verwijzen — maar alleen als het onderwerp de
  prospect werkelijk raakt, nooit als vulling.
