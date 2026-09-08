# Product Marketing Context — ZEVREN

**Document version:** 1.33 · 2026-09-07
Elke marketingskill in `.claude/skills/` leest dit document eerst.
Feiten hier zijn bindend; een skill-advies dat ermee botst, verliest.

## Product

ZEVREN is een webstudio in Maastricht (zevren.nl), gerund door Alaa.
Wij bouwen websites voor kleine Nederlandse bedrijven, met werkende
demo's als bewijs en prijzen die openbaar op de site staan.

Pakketten (eenmalig, actuele prijzen; doorgestreepte adviesprijzen op
de site): Starter 299 · Business met boekingssysteem 549 · Webshop 899
· Maatwerk webapplicatie 1.349. Add-ons: extra pagina 79, drie extra talen samen
150 (NIET 150 per taal — `ADD_ONS.language` is 150 en de dictionaries
zeggen in alle zes talen "3 talen" / "Je site in drie extra talen"). Optioneel onderhoudsabonnement 49,99/maand (hosting, domein,
updates, kleine wijzigingen); bij opzegging neemt de klant domein en
bestanden gratis mee.

## Ideale klant (ICP)

Het groeifase-bedrijf: 1-6 jaar bezig, aantoonbaar lopend (reviews
stromen binnen, "wegens drukte", verhuisd/uitgebreid, levende
socials) maar online achterblijvend — geen site, of een site met
concrete gebreken. Sectoren die op afspraak draaien scoren het best:
salons, trimsalons, pedicures, garages, rijscholen, praktijken.
Limburg eerst, heel Nederland daarna. GEEN prospects: gevestigde zaken
met volle boeken of klantenstop, en lege starters zonder tractie.

## Positionering

"Geen offertecircus." Drie pijlers: (1) prijzen openbaar — uniek in
dit segment; (2) werkende demo's die de bezoeker zelf kan aanklikken —
bewijs in plaats van beloftes; (3) persoonlijk — Alaa antwoordt zelf,
binnen een werkdag. Zes talen (NL/EN/DE/FR/ES/AR) als structureel
voordeel voor ondernemers met een meertalig publiek.

## Toon en taal

Nederlands in outreach, met het register per kaart gekozen en op de
kaart verantwoord: "u" bij praktijken, C.V.'s, winkels en zaken met
personeel; "je" bij de jonge eenmanszaak waar de eigenaar zelf voor de
klas of op het veld staat. De keuze staat per kaart in één regel, zodat
Azzouz hem kan toetsen. Site in zes talen; Arabisch altijd MSA/فصحى. Nooit schaarste ("nog 3 plekken"), nooit "wij zijn
klein", geen uitroeptekens, geen "gratis" in onderwerpen. Elke claim
moet letterlijk door zevren.nl gedekt zijn.

## Wat een bericht nooit mag beweren

Vier formuleringen zijn in verificatie gesneuveld en komen niet terug:

- **"Werk dat u zelf kunt aanklikken."** Op de projectenpagina van
  zevren.nl staat letterlijk "geen van alle is klantwerk". Wie dit leest
  verwacht een portfolio van echte klanten. Schrijf "conceptsites die wij
  gebouwd hebben" of "een demo die echt werkt".
- **Een formulier waarin de klant foto's of bestanden uploadt.** Staat
  nergens op de site. Het formulier mag erin, de upload niet.
- **"Een adres op uw eigen naam."** Leest als een mailbox, en wij
  verkopen geen mailadressen. Schrijf "een eigen pagina".
- **"Foto's van voor en na" — en elke andere belofte over de VORM van het
  werk (1.16).** Een claim over hoe het opgeleverde eruitziet is net zo hard
  gedekt of niet gedekt als een prijs. "Voor en na" staat nergens op
  zevren.nl en vraagt bovendien om een foto van vóór het werk die niemand
  heeft toegezegd; de hovenierspagina zegt dat wij foto's van afgerond werk
  "groot en scherp" laten zien, en dát is de formulering die mag. Gevonden op
  04-09 in de enige kaart van lanes A+B (JF Hoveniers).
  **Tweede helft van dezelfde regel, de prijs:** noem het bedrag zoals de site
  het noemt en schrijf de btw-vermelding nooit weg. De sectorpagina's zeggen
  "299 euro eenmalig, exclusief btw". "299 euro, eenmalig" is daarmee gedekt;
  "299 euro en verder niets" of "alles inbegrepen" is dat niet.
- **Een belofte over wat de lezer op de gelinkte pagina zal aantreffen (1.31).**
  De bestemming van een link is zelf een claim en wordt net zo gedekt als een
  prijs. "Op de hovenierspagina staat een demo die echt werkt" is een juiste
  formulering (1.1) naar een bestaande pagina met de juiste UTM — en toch onwaar,
  want in `zevren/lib/local/sectors.ts` draagt de hovenierssector geen
  `demoSlug`. **Zes sectorpagina's tonen een demo** (kappers, hondentrimsalons,
  garages, administratiekantoren, schoonheidssalons, nagelsalons); **vier tonen
  de conceptbouwerroute** (hoveniers, schilders, dakdekkers, stukadoors). Kijk
  één keer welke van de twee het is voordat je beschrijft wat de lezer zal zien.
  De kosten van deze fout zijn eenzijdig en daarom gaat de regel er op één dienst
  in: wie dóórklikt is juist de lezer die geïnteresseerd was, en die vindt dan
  niet wat hem beloofd is. Gevonden op 07-09 in de enige kaart van lane C
  (Hanenberg Hoveniers).

## De poort die het vaakst kaarten kost

Vóór er een letter copy wordt geschreven: **kan deze klant al online
boeken of plannen?** Vijf kaarten zijn hier in twee dagen op gesneuveld.
Zoek naast de eigen site altijd op de platforms die dit segment gebruikt
— Fresha, Treatwell, Salonized, Bjootify, DoggyDoggy, aniday, Tipaw,
1plekjevrij, 1Kapper/1BeautyAfspraak, Belliata — en op een eigen
afsprakenplanner of klantenportaal.
`1plekjevrij.nl` richt zich uitdrukkelijk op kappers, pedicures,
schoonheidsspecialisten én trimsalons en toont per behandelaar het vrije
tijdslot: dat is letterlijk de belofte waarmee ons 549-bericht binnenkomt.
`1kapper.nl` en `1beautyafspraak.nl` (leverancier 1Kappersoftware: agenda,
kassa én plaatsing op het boekingsplatform) zijn geen gidsen maar een echt
agendaplatform, met "real time een afspraak en direct een bevestiging" als
eigen belofte — letterlijk de zin waarmee ons 549-bericht binnenkomt.
De vaste eerste zoekopdracht in elke afspraaksector, vóór de leeftijd en
vóór het adres, is daarom
`"<naam>" salonized OF fresha OF treatwell OF tipaw OF 1plekjevrij OF 1kapper OF belliata`.

**De platformzoekopdracht sluit de boekingspoort niet — vraag welke route er
WEL bestaat (1.18).** Een leeg zoekresultaat op de platformlijst is een
afwezigheid in jouw zoekresultaat, geen vaststelling over hun bedrijf. Draai er
daarom altijd één opdracht bij op het eigen domein
(`<domein> inschrijven OR reserveren OR bestellen OR winkelwagen OR product OR
agenda`) en stel de route positief vast. Vier gevallen op één dag, uit twee
lanes onafhankelijk, bewijzen dat de platformlijst alleen te weinig is:
Hondenschool & uitlaatservice Kersten (Gassel) heeft een eigen inschrijfpagina
op `hondenschoolkersten.aniday.io/register`, Salon-013 (Tilburg) een eigen pad
`/online-reserveren`, Hondenschool Dogstart (Oud Ade) een eigen
`/inschrijven/inschrijfformulier` plus `/login`, en Leven Massage (Rotterdam)
naast twee platforms ook nog een eigen agendapagina. Alle vier waren schoon op
de platformlijst; alle vier zouden een bericht hebben gekregen dat hun vertelt
dat zij missen wat zij al hebben.

De omkering geldt in beide richtingen: een positief vastgestelde route sluit de
poort (Hondenschool de Walsert, 05-09: aanmelden loopt via een eigen
inschrijfformulier met overboeking, geen `/product/`-pad, geen winkelwagen,
geen agenda), en alleen zo'n vaststelling doet dat.

**Direct daarna, in dezelfde adem: `"<naam>" klantenstop OF "geen nieuwe
klanten" OF wachtlijst` (1.14).** De ICP sluit volle boeken en klantenstop uit,
maar dat stond in geen enkele poortenlijst en in geen enkele zoekvolgorde, dus
het werd alleen per ongeluk gevonden. Erger: onze profielregels jagen op
"aantoonbaar lopend" — reviews die binnenstromen, "wegens drukte" — en in een
ambacht waar de capaciteit één paar handen is, is dát precies het signaal dat
vlak vóór een klantenstop komt. We selecteren daar dus systematisch op bedrijven
met een verhoogde kans om vol te zitten. Eén zoekopdracht, en hij voorkomt geen
gemiste kaart maar een verbrand adres.

**Waar die zoekopdracht staat, is vanaf 1.17 een regel en geen voorkeur: vóór de
adresjacht, direct achter de boekingspoort — nooit als laatste stap vóór het
schrijven.** Op 5 september kostte de oude volgorde op één dag drie complete
dossiers in twee lanes die elkaars bestand niet kenden: Dierenpension Frank & Vrij
(Meppel, lane A), Trimsalon For your Doodle en Daphne's Trimsalon (allebei lane B).
Bij Daphne's zat er op dat moment een adresronde, een leeftijdsronde, twee
boekingsronden van een eerdere dienst en twee poort-(a)-ronden in het dossier; één
zoekopdracht van tien seconden sloot het alsnog. De regel geldt in elk ambacht waar
de capaciteit één paar handen is — trimsalons, kapsalons, pedicures, dierenpensions,
hondenscholen, eenmansambacht — en daar is zij verplicht. In sectoren waar capaciteit
schaalt met personeel mag zij blijven staan waar zij stond.

Let op de variant die geen klantenstop heet: een **intakestop met een einddatum**
("vanaf half oktober weer ruimte voor kennismakingen"). Die sluit het dossier voor
vandaag en niet voor altijd. Zet hem in het ledger met de datum erbij, niet als
`not fit` zonder meer — na die datum is het een compleet dossier dat niemand opnieuw
hoeft op te bouwen.

**En één regel die geen zoekopdracht is maar wel een poort: lees het ledger op
naam, over de hele lengte, niet alleen de rijen van deze week.** Op 02-09 kwam
Stark Stuc als nieuwe kaart op het bord terwijl dezelfde lane het bedrijf vier
dagen eerder zelf had afgewezen, met exact de reden die opnieuw gold. Een kaart
die op poort (e) valt, valt nadat al het andere werk er al in zit.

Een mail die een ondernemer vertelt dat zij mist wat zij al betaalt,
verbrandt het adres.

## Een open poort is een bevinding, geen kaart

Een kaart mag nooit op het bord komen met een poort die de agent zelf niet
dicht kreeg en een controleopdracht voor de owner erbij ("kijk even of er na
augustus 2025 nog een bericht staat"). Dat draait de rolverdeling om: de owner
betaalt om tijd te besparen, en een bord waar hij zelf nog tabbladen bij open
moet trekken kost tijd. Wie de poort niet dicht krijgt, zet het bedrijf onder
de sectorbevindingen met de exacte pagina erbij en met ledgerstatus
`lead - poort open` — niet in de kaartenstroom.

Dat geldt het scherpst voor poort (a), het gedateerde teken van leven. Wat
telt is een gedateerd spoor van het bedrijf zelf binnen twaalf maanden: een
review met leesbare datum, een gedateerde post, eigen sitecontent die naar het
lopende of komende seizoen verwijst, een programmaboek van een derde partij.
Wat NIET telt: een gemiddelde score zonder datum, een registerinschrijving of
erkenningsdatum die ouder is dan twaalf maanden, en het jaartal in de titel van
een gidsenpagina ("Top 25 installateurs [2026]") — dat is de verversingsstempel
van de gids, niet een levensteken van het bedrijf.

**Een stil levensteken sluit poort (a) wel, maar draagt een kortere
houdbaarheid (1.14).** Sommige sporen dragen een datum zonder ooit te
verouderen: een versiemarkering achter een bestandslink op het eigen domein
(`.../Privacyverklaring.pdf?v=2026-05-03`), een kale prijslijst met alleen een
jaartal, een "sinds"-regel. Ze tellen — de uitgever is het bedrijf zelf, dus
de daad is zijn daad in de zin van 1.7 — maar ze bewijzen onderhoud en geen
handel, en ze zien er over drie weken precies hetzelfde uit. Een kaart die op
zo'n spoor rust, krijgt daarom de verzendtermijn op de kaart zelf, en de
hercontrole is dan niet "staat het er nog" (het staat er nog) maar **"zoek een
spoor van een andere soort"** — bij een afspraakzaak is de prijsaanpassing met
het lopende jaartal hierboven daarvoor de goedkoopste route. Zonder die
toevoeging keurt de hercontrole bij dit bewijstype zichzelf altijd goed. Een
gedateerde review of post veroudert wel zichtbaar; daar volstaat de staande
termijn van ongeveer twee weken.

Omgekeerd is `geen-emailadres.md` geen eindstation. Een lane die daar een sterk
profiel ziet staan, mag het adres opnieuw jagen: op 30-08 leverde dat bij
Brummel Airconditioning een bruikbaar adres op waar twee dagen eerder "niets"
stond. Corrigeer die regel dan ook, anders kost dezelfde zaak elke volgende
lane opnieuw tijd.

**Een oude ledgerrij op hetzelfde bedrijf is geen beletsel, maar een omkering
die je opschrijft (1.32).** Poort (e) mag `not fit` worden teruggedraaid — de
tweede dienst weet vaak meer dan de eerste. Wat niet mag, is dat de omkering
onzichtbaar blijft. Noteer bij de poort de oude status, de oude grond en waarom
die niet meer geldt, en schrijf nooit "nul rijen" over een bedrijf dat er staat.

Op 07-09 stond Hanenberg Hoveniers sinds 02-09 in het ledger als
`not fit - geen lek vastgesteld`; de kaart van die dag meldde bij poort (e) "nul
rijen" terwijl beide genoemde zoekopdrachten de rij hadden gegeven. De omkering
zélf was terecht en is bij de verificatie onafhankelijk bevestigd: het oordeel
van 02-09 rustte op "volledige eigen site", en een complete site is niet
hetzelfde als een site zonder lek — er staat geen enkele projecten- of
referentiepagina op, bij een vak dat op zicht wordt gegund. De dienst van 02-09
stelde de vraag "is de site af?", de dienst van 07-09 de vraag "staat er afgerond
werk?". Dat verschil is de hele Tuinrobuust-order.

**Een regel op `bellijst.md` is een ledgerrij en poort (e) geldt er ook (1.24).**
Draai de naam vóór het schrijven niet alleen over `contacted.md` maar over de
volle lengte van `bellijst.md`, en werk de bestaande regel bij in plaats van er
een tweede onder te zetten. Verliest de nieuwe regel een feit dat de oude wél
droeg — en dan vooral het gedateerde levensteken — dan is dat geen aanvulling
maar een achteruitgang: de owner belt uit dit bestand, en hij leest de nieuwste
regel.

Op 08-09 kreeg Otter Hoveniers (Heerenveen) zijn derde bellijstregel en zijn
derde ledgerrij op één week. De regel van 02-09 draagt de Werkspot-beoordeling
van **11-02-2026** en die van 03-09 een tweede vestiging aan Wederik 198; de
regel van 08-09 zet in de kolom Gedateerd levensteken een streepje en in het
notitieveld `Pakket: -` en `Hoek: -`, terwijl 02-09 daar `299` en `offertelek`
had staan. Alle drie de diensten concludeerden hetzelfde — geen e-mailadres —
en de nieuwste laat de belbaarste noordelijke regel van het bestand er slechter
uitzien dan hij is. Dezelfde dag deed lane B het bij Averesch Tuinen precies
goed: de bestaande regel bijgewerkt, het levensteken behouden, en de valstrik
(`info@averesch.nl` hoort bij Averesch B.V.) eraan toegevoegd. Die twee vormen
staan naast elkaar in één dienst, en de tweede is de vorm.

**Waarom deze regel op één drager binnenkomt:** de kosten zijn eenzijdig, net
als bij 1.32. Een dubbele regel kost een lezer tijd; een dubbele regel die
minder weet dan het bestand twee honderd regels hoger, kost een telefoontje dat
blind gepleegd wordt.

**Waarom de regel er staat en niet alleen de order:** de verificatie kan niet
elke ronde overdoen en leest poortuitkomsten op hun woord. Eén onwaar gemelde
poort kost meer dan één kaart — zij kost de betrouwbaarheid van alle poorten die
diezelfde dienst wél goed heeft gedraaid. Vergelijk Stark Stuc (29-08), waar de
oude grond nog gold en de kaart dus niet geschreven had mogen worden: het
verschil tussen die twee gevallen is precies wat een genoteerde omkering
zichtbaar maakt en een verzwegen omkering verbergt.

## Wiens daad draagt de datum — poort (a) beslist

Sams voorstel van 22 augustus (inbox) vraagt of de geen-website-groep een
gedateerde gidsvermelding als levensteken mag gebruiken. Zijn diagnose klopt
en is deze week vier dagen op rij bevestigd: de datumeis selecteert precies
de groep weg die de Maps-order wil raken, want een eigen site is nu juist wat
een gedateerd spoor achterlaat. Het voorstel gaat niettemin maar half door,
en de scheidslijn is niet "eigen bron versus derde partij" maar deze:

**Registreert het gedateerde feit een DAAD VAN HET BEDRIJF, of een daad van
de uitgever?** Alleen het eerste is een levensteken.

- **Telt (ook zonder eigen website):** een KvK-mutatie met datum
  (adreswijziging, handelsnaam, SBI, nieuwe vestiging) · een gedateerde
  gemeentelijke of GGD-vergunning, -inspectie of -rapport · een SBB-erkenning
  of -verlenging binnen twaalf maanden · een vacature met plaatsingsdatum ·
  een review met leesbare datum · een gedateerde eigen post · een programma-
  of roosterboek van een derde waarin het bedrijf zelf optreedt. In alle
  gevallen heeft iemand iets gedáán: iets ingeschreven, iets geïnspecteerd,
  iemand aangenomen, ergens gestaan.
- **Telt niet:** "Updated ‹maand› ‹jaar›" op Yelp, wheree, oozo of drimble ·
  het jaartal in een gidsentitel ("Top 25 installateurs [2026]") · een
  gemiddelde score zonder datum · een registerinschrijving of erkenningsdatum
  ouder dan twaalf maanden. Dat is de huishouding van de uitgever. Een gids
  die zijn pagina ververst, bewijst dat de gids leeft.

**Een gedateerde review op een vakgidspagina is pas een levensteken als de
datum per review verschilt EN de reviewtekst over dít bedrijf gaat (1.15).**
Dit is de gevaarlijkste variant van de uitgeversstempel hierboven, want hij
vermomt zich als het sterkste bewijstype dat wij kennen: geen "Updated ‹maand›"
bovenaan de pagina, maar een datum ín de review zelf. Op 03-09 sloot de
verificatie poort (a) bijna bij Brinkveld Hoveniers (Hattem) op een Google-review
met 10,0 van 14-11-2025 op de eenbedrijfspagina van `hovenier.website`. Drie
vervolgronden haalden hem onderuit: een tweede 10,0 draagt exact dezelfde datum
14-11-2025, over drie ronden komen drie verschillende reviewernamen terug bij
diezelfde ene datum, en de tekst bij een van beide gaat over "Rutger Broekhuis"
die een wespennest behandelde — niet de eigenaar en niet hovenierswerk. Dat is
het moment waarop de gids zijn reviewblok heeft ingeladen, niet het moment waarop
een klant iets vond.

De toets kost één extra ronde en hij is verplicht bij elke gidsreview: **dragen
twee reviews dezelfde datum, dan telt geen van beide.** En lees altijd de
reviewtekst — een gids die reviews importeert, importeert ook de reviews van de
buren. Poort (a) sluit alleen op een review die zowel een eigen datum als een
eigen onderwerp heeft.

**De samenvattende alinea boven de zoekresultaten is geen bron (1.20a).** Dit is
de gevaarlijkste bronfout die de lanes tot nu toe hebben gevonden, want hij
vermomt zich niet als een gids maar als een citaat, en hij vult precies het gat
dat poort (a) openhoudt: een jaartal. In deze omgeving schrijft het model dat de
zoekresultaten samenvat er feiten bij die in geen enkele onderliggende pagina
staan. Twee gevallen op 06-09 in lane C, plus een onafhankelijke reproductie door
de verificatie diezelfde dag:

- Hondenschool de Walsert publiceert een vakantiemelding "gesloten van 25
  augustus t/m 8 september" **zonder jaartal**, in vijf ronden en bij drie
  agenten. De samenvatting antwoordt: "Hondenschool De Walsert is gesloten van 25
  augustus t/m 8 september **in 2026**" — respectievelijk "during the current time
  period". Dat jaartal is een gevolgtrekking van de samenvatter, geen paginatekst.
- Leeters Dienstverlening noemt zich op zijn eigen pagina "een jong bedrijf"
  zonder jaartal. De samenvatting biedt aan de datum uit de sitemetadata af te
  leiden: "established around September 2022". Ook dat staat nergens.

**Alleen geciteerde paginatekst is een bron.** Een zin die alleen in de
samenvatting bestaat en niet in een resultaat terug te vinden is, sluit geen
poort — ook niet als hij plausibel is, ook niet als het venster dat hij noemt op
dit moment loopt. Wie hem toch gebruikt, sluit de duurste poort van het bord op
een zin die de zoekmachine zelf heeft geschreven.

Voor Sam betekent dit dat de geen-website-groep wél door de poort kán, maar
via het register en het vergunningenspoor, niet via de gidsenstempel. De
eerste zoekopdracht bij een bedrijf zonder site is daarom
`"<bedrijfsnaam>" <plaats> kvk mutatie` of `"<bedrijfsnaam>" GGD OF vergunning
OF inspectie`, niet een gidsenzoekopdracht.

**Wees eerlijk over wat dit niet oplost.** Dit verruimt de bereikbaarheid, niet
de leeftijdsmuur van 30-08: registers en vergunningenlijsten selecteren op
gevestigd zijn, precies zoals Stagemarkt dat doet. Verwacht hier meer kaarten
uit de geen-website-groep, geen oplossing voor jong-én-bereikbaar.

**Een bewijsroute is nog geen vindroute (1.12).** Twee bronnen uit deze lijst
sluiten poort (a) uitstekend zodra je de naam van het bedrijf al hebt, en
leveren die naam niet:

- **Het GGD-inspectierapport / het Landelijk Register Kinderopvang.** Voor een
  gastouder die je bij naam kent is een gedateerd inspectierapport het sterkste
  levensteken dat bestaat. Maar het LRK is een databank achter een
  zoekformulier: er is geen geïndexeerde pagina per voorziening, en de
  rapporten staan als losse PDF's op `open.overheid.nl` die alleen via
  doorklikken bereikbaar zijn. Lane A (Groningen/Friesland/Drenthe) en lane B
  (Overijssel/Gelderland/Flevoland) hebben dat op 01-09 onafhankelijk van
  elkaar vastgesteld; samen zes zoekopdrachten, nul individuele voorzieningen.
  Een lane die op deze route een gastouderdossier wil rondkrijgen, komt niet
  verder dan de voorlichtingspagina's. **Zet de sector dus nooit hoog op grond
  van deze route alleen — de namen moeten ergens anders vandaan komen** (de
  ledenlijsten van gastouderbureaus zijn wél platte pagina's).
- **De gemeentelijke vergunning op `zoek.officielebekendmakingen.nl`.** Die
  vindt jonge zaken op het moment dat ze ontstaan, wat geen gids kan, maar de
  bekendmaking noemt een adres en een activiteit en lang niet altijd een
  handelsnaam; de volledige tekst zit in een PDF. Lane B haalde er op 01-09
  twee trimsalons uit (Eerbeek en Hoogenweg, beide 2024) en kreeg bij geen van
  beide de naamjacht rond. Bovendien sluit een vergunning uit 2024 poort (a)
  niet — alleen eentje van ná september 2025 doet dat. **Dit is een
  leeftijdsroute, geen levenstekenroute en geen adresroute.**

**En omgekeerd: de vakgidszeef is een vindroute en géén leeftijdsroute (1.17).** De
goedkoopste namenbron die de lanes tot nu toe hebben gevonden, is de
eenbedrijfsindex van een vakgids of van TransFirm: `site:transfirm.nl <sector>
<steden>` geeft per ronde vijf tot tien bedrijven mét KvK-nummer in de URL, en
`site:<vakgids> "opgericht op" 2023 <provincie>` geeft er zeven tot acht met een
datum erbij. Eén ronde in plaats van vijf, en het levert namen op die geen enkele
gidsenzoekopdracht teruggeeft.

De verleiding is om het getal in die URL meteen als leeftijd te lezen, en dat is
precies de val van 1.15 en 1.16. Een KvK-nummer is een registerdatum en verandert
mee met de rechtsvorm; een gidsdatum is de datum waarop de gids het bedrijf
opnam. Op 5 september droeg een verse reeks drie keer op één dag een oude zaak
(Venema 1970 onder KvK 92483275, E & K tien jaar onder 89431561, Fiets Direct
"sinds 2007" onder 77493192), en bij de hoveniers van lane B ging het drie van de
drie keer mis: gidsdata uit 2023/2024 boven zaken van achttien, meer dan tien en
eenenveertig jaar. **De volgorde is dus: zeef op namen, dan onmiddellijk de eigen
over-onspagina voor de leeftijd, dan de klantenstopronde, dan pas het adres.**

**Welke eenbedrijfsbronnen de zin daadwerkelijk voeren — gemeten, niet vermoed
(1.19).** De vorm `site:<gids> "Opgericht als" OF "opgericht op" <steden>` is
alleen zoveel waard als de gids per bedrijf een eigen pagina heeft. Drie
metingen liggen er nu:

- **`alleglazenwassers.nl` voert leeftijd én KvK in één zin** ("Opgericht als
  Glazenwasser (KvK-nummer X) ... sinds JAAR"). Vier leeftijden per ronde op
  05-09, ruim dertig namen over zes ronden op 06-09. Twee diensten op rij, dus
  hij staat hier; hij is de enige bron in dit hoofdstuk waarvan de datum een
  échte oprichtingsdatum is.
- **De `-info.nl`-familie voert de zin niet.** `hondentrimsalon-info.nl`,
  `dierenpension-info.nl` en `glazenwasser-info.nl` gaven op 06-09 in vier
  ronden geen enkele eenbedrijfspagina met die zin; het zijn plaatsengidsen.
  Dit is een negatief resultaat en het hoort hier zodat niemand er nog ronden
  in steekt.
- **`hovenier.website` voert de zin wél** (dertien hoveniers mét datum in één
  ronde), **maar de datum is de VESTIGINGSdatum van 1.18(b) en géén leeftijd.**
  Dat is op 06-09 in twee onafhankelijke lanes zeven keer bevestigd: lane A op
  vier dossiers (Durk Hoveniers gids 01-01-2023 tegen eigen pagina 2006; Aapkes
  gids 01-01-2023 tegen KvK 02089846; Schoonmaakbedrijf het Noorden KvK
  87086301 tegen "meer dan twaalf jaar" op de eigen site; HA Schoonmaak
  erkenning 2019 tegen KvK 65506820), lane B op drie (Herkert tweede generatie;
  Hurrelbrink KvK 08159858 naast een gidsdatum uit 2023; Van Rijbroek B.V. uit
  2011 onder gidsdatum 08-06-2022).

**De regel die eruit volgt en die vanaf nu bij elke van deze bronnen hoort:**
een gidsdatum uit 2022 of later opent één verplichte ronde — de eigen
over-onspagina — en die ronde gaat vóór elke adresronde. Hij kost één zoekopdracht
en bespaarde op 06-09 in beide lanes drie tot vijf per dossier.

### De reviewdatum op een platformprofiel draagt poort (a) niet alleen (1.22)

Een profiel op Werkspot, Homedeal, Trustoo of een vergelijkbaar platform is
geen bedrijfspagina maar een **vakmanprofiel**: het verzamelt klussen over
categorieën heen, en de zoekmachine koppelt een datum aan een reviewtekst
zonder te garanderen dat beide bij hetzelfde bedrijf en dezelfde klus horen.

**De regel.** Een reviewdatum van een platformprofiel sluit poort (a) alleen
als **datum, tekst én bedrijf in één resultaat samen staan**. Geeft een tweede
ronde een afwijkende datum bij dezelfde tekst, dan **wint de oudste**. En
citeert het bericht die review — in de onderwerpregel of in een kernalinea —
dan moet zij die toets sowieso doorstaan, want dan draagt zij niet alleen poort
(a) maar ook poort (c) en de geloofwaardigheid van de hele mail.

**Waar hij vandaan komt.** Gomar Multidiensten (Markelo), twee diensten, twee
keer dezelfde val. Op 28-08 hield de verificatie de kaart aan omdat de gevonden
reviews (tuinonderhoud, stucwerk) niet in het dienstenpakket van een
buitenreiniger passen. Op 07-09 bood lane B twee vervangende reviews aan
(01-03-2026 en 19-01-2025) op zijn eigen profielpagina; zes onafhankelijke
ronden reproduceerden geen van beide datums, en één ronde gaf dezelfde
reviewtekst terug **met datum 31-05-2025 en met een klus buiten zijn pakket**
(dakisolatie, dakraam vervangen). Vijftien maanden, dus buiten het venster.

**Waarom hij streng is.** De kosten zijn eenzijdig, net als bij 1.20(a). Deze
bron vult precies het gat dat poort (a) openhoudt — een datum — en zij vult het
met iets dat er alleen in één ronde zo uitziet. Een gidsvermelding die te oud
is, kost een kaart; een reviewdatum die niet klopt, kost het adres van de
ontvanger en de naam van de owner.

## De prijsaanpassing met het lopende jaartal — een poort-(a)-route (1.13)

De goedkoopste manier om poort (a) te sluiten bij een afspraakzaak zonder
levende socials is haar eigen prijsaanpassing. Een zaak die met uurtarieven
werkt, past die één keer per jaar aan en kondigt dat op haar eigen site aan,
mét datum. Dat is een daad van het bedrijf met een datum erin, dus hij haalt
"Wiens daad draagt de datum" zonder discussie, en hij is geïndexeerd.

De zoekopdracht, in twee vormen die allebei bewezen zijn:

- `<sector> "per 1 januari 2026" prijzen verhoogd OF aangepast`
- `<sector> "per 1 januari 2026" tarieven verhoogd <provincie>`

**Waarom dit als regel is opgenomen en niet als tip:** lane C (Noord-Brabant/
Limburg/Zeeland) en lane D (Noord-Holland/Zuid-Holland/Utrecht) vonden hem op
2 september onafhankelijk van elkaar, in verschillende provincies, zonder elkaars
bestand te kennen, en met drie namen die in beide lijsten terugkomen (Woeffie,
Trim Salabim, TRIM ME!). Elk van beide haalde er in één opdracht vijf tot zes
salons uit met een leesbare datum op hun eigen domein.

Twee grenzen horen erbij:

- **Het jaartal moet het lopende jaar zijn.** "Per 1 januari 2025" is twintig
  maanden en telt niet.
- **De aankondiging telt, de prijslijst niet.** Een kale prijslijst met "2026"
  erboven draagt geen datum: hij staat er, en je weet niet wanneer hij er is
  neergezet. De mededeling ("per 1 januari 2026 zijn de tarieven aangepast")
  is de daad. Hondentrimsalon Dinges (tarieven per 01-07-2026) bewijst dat de
  route niet toevallig één keer aansloeg.

De route werkt in elke afspraaksector die met uurtarieven werkt en dus in
januari aanpast: trimsalons, kapsalons, pedicures, schoonheidssalons, fysio —
precies de sectoren waar het agendabericht op past.

**En hij werkt NIET in sectoren met een bindende cao of een landelijk normbedrag
(aanscherping 06-09).** Lane C draaide hem op 6 september vier keer, in vier
sectoren, en hij faalde vier keer op dezelfde grond: in schoonmaak,
glazenwasserij en hovenierswerk is "per 1 januari 2026 zijn de tarieven
aangepast" geen mededeling van het bedrijf maar een **cao-bericht**, en de
resultaten vullen zich met `schoonmakendnederland.nl`, de cao Hoveniersbedrijf en
brancheprijsindexaties. Bij gastouders gebeurt hetzelfde met het maximumuurtarief
voor de kinderopvangtoeslag. Het bedrijfsniveau verdrinkt in het branchenieuws.
Lane D bevestigde dezelfde dag de andere helft: in trimsalons gaf één opdracht
zes salons met een gedateerde eigen prijsaanpassing — maar vijf ervan lagen
buiten zijn lane-regio, want de zeef mist een geografische knop. **Zet de plaats
of provincie dus ín de opdracht, en gebruik de route alleen waar de ondernemer
zijn eigen uurtarief zet.** Waar een cao geldt, is de sinds-regel op het eigen
domein (1.14) de goedkoopste poort-(a)-sluiter.

## Welke bron een e-mailadres draagt

Niet elk openbaar adres is even hard, en het verschil zit in de vorm van de
bron, niet in de zoekmachine. Op 26-08 leverde dat in twee lanes het
tegenovergestelde resultaat op:

- **Bruikbaar: een eenbedrijfs-registerpagina.** Het SBB-register van erkende
  leerbedrijven (Stagemarkt.nl) draagt één bedrijf per pagina, met naam,
  adres, telefoon, contactpersoon, e-mail én erkenningsdatum in één blok. Die
  erkenningsdatum is meteen een gedateerd levensteken. Lane E haalde er vijf
  van vijf adressen uit, alle vijf bij hercontrole correct. Het register kent
  ook rijscholen, garages en praktijken.
- **Niet bruikbaar: een samengevatte gidsen- of zoekpagina.** Waar meerdere
  bedrijven op één pagina staan, plakt de samenvatter er één verhaal van en
  raakt het adres los van het bedrijf. Lane F toonde het aan: Motorrijschool
  MOVICA kreeg het adres van een ándere rijschool, Erik Eisma dat van een
  coachingsbedrijf.

Een adres dat alleen een persoonsnaam draagt (`kocak_k@hotmail.com`) haalt de
poort wél, mits het op de registerpagina van precies dát bedrijf staat. Een
adres dat de naam van een ánder bedrijf draagt, haalt hem nooit.

Een tweede bron telt pas mee als hij het ADRES draagt, niet als hij het
bedrijf draagt. Op 30-08 schreef lane F het adres van Dayan Stukadoorsbedrijf
op als "twee onafhankelijke bronnen"; de tweede bron gaf KvK-nummer,
oprichtingsdatum, adres en telefoon terug en juist géén e-mailadres. Eén harde
eenbedrijfspagina is genoeg om de poort te halen — maar noteer dan één bron,
want een opgeblazen zekerheid is precies de plek waar de volgende lane niet
meer nakijkt.

**Het eigen domein is de enige bron die leeftijd, adres én levensteken tegelijk
draagt (1.20b).** Op 6 september stelden lane C en lane D dit onafhankelijk van
elkaar vast, op dezelfde dag, uit verschillende hoeken, en met een telling
eronder. Lane C: **vijf van vijf** bedrijven mét eigen domein gaven in één
gerichte ronde (`<domein> contact e-mailadres info@`) hun adres —
Glazenwasser Plus, Zeelen Glasbewassing, Leeters Dienstverlening, Dierenpension
Zeeland, Dierenpension Oosterhout. **Nul van vijf** bedrijven zónder eigen domein
gaven er een, na drie ronden elk: AV groen, Loof groenonderhoud, Kellsservice,
Dankers-Uitvoering, Blink&Pro. Lane D kwam via de bronnenkant tot dezelfde
uitkomst: de vakgidszeef levert namen mét datum en zonder adres (een ongeclaimd
gidsprofiel bevat per definitie geen adres), het SBB-register levert adres zonder
levensteken, en alleen het eigen domein draagt een contactpagina, een
over-onspagina met een startjaar en meestal een pagina met een datum. **De twee
enige goedgekeurde kaarten van beide lanes die dag kwamen allebei uit deze route
en geen enkele uit de gidsroute.**

De jaagvolgorde die eruit volgt: eerst het ledger op naam over de volle lengte,
dan een zeef op bedrijven mét eigen domein, dan de leeftijd van de eigen
over-onspagina, dan de klantenstopronde, dan het adres. Dat is de omgekeerde
volgorde van de gidsroute, en hij kost minder ronden.

**De operationele helft: stel het lek vast met een `site:`-ronde, niet met een
paginabezoek.** In een omgeving waarin eigen domeinen niet te laden zijn, geeft
`site:<domein> reviews OR referenties OR projecten OR ervaringen OR klanten OR
tarieven` de complete lijst geïndexeerde eigen pagina's terug — en daarmee
positief wat er wél staat en wat er níét staat. Zo is bij Glazenwasser Plus
vastgesteld dat er vier eigen pagina's zijn en geen enkele met afgerond werk of
klantoordeel, en bij Zeelen dat het er vijf zijn met hetzelfde gat. Zonder deze
ronde is 1.20(b) in zo'n omgeving niet uitvoerbaar: lane D parkeerde TZ Tuinen
dezelfde dag met de motivering "ik kan die pagina niet laden, dus ik weet niet of
het afgeronde werk erop staat", terwijl één `site:`-ronde het antwoord had
gegeven. De terughoudendheid was juist — een offertelek verkopen aan een site die
je niet gezien hebt is de fout van 25-08 — de gevolgtrekking was onnodig.

**Wat deze regel NIET zegt.** Hij waardeert de geen-websitegroep niet af en kan
dat ook niet: de owner heeft op 24 augustus vastgelegd dat de hoog gewaardeerde
zaak zónder website het prime target is, en een fundamentregel overruled geen
order. Wat hij zegt is smaller en waar: sinds 25 augustus wordt een kaart zonder
geverifieerd openbaar e-mailadres afgekeurd, en in deze omgeving levert een zaak
zonder eigen domein dat adres structureel niet op. **Die groep is daarmee een
bellijstgroep en geen mailgroep** — niet omdat ze slechter is, maar omdat het bord
alleen langs e-mail verstuurt. Lane D vond dezelfde muur van de andere kant bij
Hondentrimsalon Helen en Jodieh's Trimsalon: allebei sterk op profiel, allebei
alleen op het adres gevallen, allebei met een formulier en WhatsApp als bewuste
contactroute. De keuze die daaruit volgt — het prime target verschuiven of het
bord een tweede verzendweg geven — ligt bij de owner en staat in het weekrapport.

## Twee regels die geen poort zijn

Niet elke regel in `agents/` is een verificatiepoort, en ze als poort
gebruiken kost goede kaarten.

- **De sectorcap (`agents/beats.md`, niet meer dan drie in zeven dagen) is een
  jáágregel, en hij telt alleen KAARTEN — niet afvallers.** De grond staat er
  letterlijk bij: een uitgeputte sector levert "de kaarten die Azzouz afkeurt".
  Een bedrijf dat is afgewezen, heeft de sector niet uitgeput; het bewijst
  alleen dat dát bedrijf niet paste. **De cap telt daarom rijen met status
  `drafted` of goedgekeurd, per sector én per lane-regio — niet elke ledgerrij
  en niet landelijk.**

  Dit is geen verfijning maar een reparatie, en ze verklaart een deel van de
  inzinking van deze week. In zeven dagen kwamen er 584 regels bij. Op de oude
  telling is elke bewezen sector drie- tot negenvoudig over de cap
  (kapsalons 26, barbershops 27, schilders 17, dakdekkers 16) en dus dicht. Op
  de juiste telling staat kapsalon op 2 en is gewoon open; alleen barbershop en
  pedicure staan met 5 boven de cap. De lanes hebben zichzelf dus uit de
  sectoren gejaagd die wérken, op grond van rijen die vastleggen dat een bedrijf
  is afgekeurd. Op 30-08 noemde `beats.md` fitness "verzadigd" op dertien
  ledgerregels — die telling was de verkeerde.

  Een bedrijf dat uit `geen-emailadres.md` wordt teruggehaald met een profiel
  dat al stond, is geen verse sectorjacht en valt er sowieso buiten. Meld de
  overschrijding altijd op de kaart, zoals lane F deed — het oordeel is aan de
  verificatie, niet aan de lane.
- **De leeftijdsrand loopt op bouwjaar en "grofweg" hoort erbij.** Op 30-08
  hanteerden twee lanes 2019 tegengesteld: lane F wees een zaak mede af met
  "2019-reeks, zeven jaar", lane G noemde hetzelfde bouwjaar "midden in de
  groeifase". De regel: zeven jaar is de rand en op zichzelf geen afwijzing —
  zeven jaar plus een tweede open poort is dat wel. Een zaak van zeven jaar die
  een leerling aanneemt en met vier komma zeven uit veertig scoort, is
  aantoonbaar in beweging; dat is wat het venster wil vangen.

## De kopvorm van een bevinding — één keer vastgelegd

Lane C vroeg op 31-08 terecht om een knoop, want de orders spraken elkaar tegen:
de directives schrijven `### 1.` t/m `### 5.` voor, terwijl `agents/beats.md`
van 30-08 vastlegt dat een genummerde bevindingskop bij lane F de laatste kaart
liet doorlopen tot het einde van het bestand. De regel is vanaf nu:

- **Kaarten:** `## N. Naam — Plaats` — genummerd, op `## `-niveau.
- **Bevindingen en alle andere secties:** een `## `-kop ZONDER nummer, in de
  vorm `## Bevinding — <onderwerp>`.
- **De samenvattingstabel:** onder een eigen ongenummerde `## `-kop, helemaal
  achteraan het bestand.

Zo kan geen enkele bevindingskop het kaartpatroon nabootsen, ongeacht welk
niveau de parser leest. Lane C koos deze vorm 31-08 uit zichzelf en had gelijk.

## Twee maten die twee lanes op één dag verschillend namen

Beide regels hieronder komen uit 08-09, waar lane A en lane B onafhankelijk van
elkaar dezelfde maat verschillend toepasten. Dat is de klassieke drempel, en
allebei zijn ze met één telling te controleren.

- **De 160-220 woorden gelden voor de tekst ZONDER het handtekeningblok (1.23).**
  Lane A telde zijn Hadders-tekst op 218 woorden "inclusief aanhef en
  handtekening", lane B zijn Back to Eden-tekst op 215 "zonder handtekening".
  Nagemeten met `wc -w`: Hadders 218 mét en 210 zónder, Back to Eden 223 mét en
  215 zónder. Beide tellingen zijn dus eerlijk, en toch staat dezelfde tekst op
  de ene maat binnen de grens en op de andere erbuiten — Back to Eden is op
  lane A's maat drie woorden te lang. Het handtekeningblok is bij elke kaart
  hetzelfde en door de owner vastgelegd; het zegt niets over de lengte van het
  schrijfwerk en het hoort dus niet in een oordeel over dat schrijfwerk. Tel
  vanaf de aanhef tot en met de laatste zin vóór "Met vriendelijke groet," en
  zet het getal en de meetwijze erbij.
- **De UTM-campagnewaarde is de slug van de sectorpagina, woordelijk (1.25).**
  Voor dezelfde sector op dezelfde dag schreef lane A `hovenier-w37` en lane B
  `hoveniers-w37`. De sectorpagina heet `hoveniers` (`zevren/lib/local/sectors.ts`),
  dus de tweede is de goede. Dit is geen vormfoutje: de UTM bestaat volgens de
  directives uitsluitend om op sectorniveau te kunnen zien of er iets aankomt,
  en twee waarden voor één sector splitsen die meting in tweeën zonder dat
  iemand het merkt. Bestaat er geen sectorpagina, dan is de waarde de sectornaam
  zoals de directives hem schrijven — en dan staat dat in het kaartje erbij.

## Kanalen en bewijs

Outreach per e-mail, persoonlijk verzonden door de eigenaar (agents
versturen NOOIT zelf — harde regel). Google Ads (NL, alleen
aanwezigheid) met conversiemeting. Demo's: barbershop, garage met
kentekencheck, webshops, boekhouderportaal, rijschoolplatform
(zevren.nl/demo/al-andalos, ongelist). Nog geen klantcases —
demo's zijn concepten en worden nooit als echte klanten gepresenteerd.

## Een erkenningsdatum is een levensteken, nooit een leeftijdsbewijs

De Stagemarkt-route (`erkend leerbedrijf <sector> <stad> e-mail contactpersoon
site:stagemarkt.nl`) is sinds 30-08 de aanbevolen eerste zoekopdracht als je
op het e-mailadres vastloopt. Er zit één valstrik in en twee lanes zijn er
inmiddels ingelopen, dus hij hoort hier:

**De datum "erkend leerbedrijf sinds ‹datum›" zegt wanneer het bedrijf zich
als leerbedrijf liet erkennen, niet wanneer het bedrijf begon.** Beide zijn
een daad van het bedrijf, dus voor poort (a) telt zo'n erkenning binnen twaalf
maanden gewoon mee. Voor de leeftijdspoort telt hij niet.

Drie bevestigingen in twee dagen: Mimi Kappers (erkend 03-12-2025, KvK uit de
oude Limburgse reeks, lane F 30-08), Timmerbedrijf Postma Assen (erkend
09-11-2020, KvK 04062165, gestart in 2000 — zesentwintig jaar) en
G. Zijlstra Leeuwarden (erkend leerbedrijf, KvK 01101404, opgericht 2003).
Alle drie zagen er op de registerpagina uit als een jonge zaak op profiel.

**De regel:** haal bij elke erkenningsdatum het KvK-nummer erbij. De oude
provinciale reeksen (01, 02, 04, 05, 08, 09, 10, 11, 17, 27, 30, 32) zijn van
vóór 2008 en verraden de leeftijd in één blik.

**En de omgekeerde val: een verse registerdatum over een oude zaak (1.15).** Een
hoog KvK-nummer, een oprichtingsdatum van twee jaar geleden of een handelsnaam
uit 2024 zeggen wanneer de PAPIEREN veranderden, niet wanneer het bedrijf begon.
Een omzetting naar een B.V., een naamswissel of een eigenaarswissel maakt een
bedrijf van vijfendertig jaar op de gidsenpagina twee jaar oud. Twee lanes zijn
er op 03-09 onafhankelijk ingelopen, in verschillende provincies en sectoren, en
daarmee haalt de regel de meer-dan-één-lane-drempel:

- **Middeljans Schilders (Odoorn/Emmen, lane A):** `schilder-nu.nl` meldt
  "KvK 94419671, 2 jaar actief"; de eigen over-onspagina meldt dat Eit
  Middeljans in **1991** begon. Vijfendertig jaar.
- **De Hondentrimsalon van Zutphen (lane B):** handelsnaam sinds 01-04-2024,
  SBB-erkenning 29-04-2024, salon op dit adres sinds 2017 — en de eigen
  over-pagina meldt dat Ellen Lammers **sinds 1994** specialist is en dertig
  jaar met honden werkt. Tweeëndertig jaar. Lane B liet de leeftijd als
  "dubbelzinnig" openstaan; één zoekopdracht op de eigen site besliste hem.

**De regel:** bij een B.V.-achtervoegsel, een handelsnaamwissel of een
oprichtingsdatum die niet strookt met vaste openingstijden, een vast
telefoonnummer of een gevestigde uitstraling, leg je de gidsdatum eerst naast de
eigen over-onspagina. Dat kost één ronde en het scheelt een volledig dossier.

**Aanscherping 1.16 — de eigen over-onspagina verslaat de gidsdatum, en dat is
geen uitzondering maar de hoofdregel.** Op 04-09 droeg in lane B vier keer op
één dag een gidsdatum uit 2023 of 2024 een zaak van tien tot zesentwintig jaar:
Steengoed! hoveniers (B.V.-omzetting over 26+ jaar), Bast Hoveniers (opgericht
30-03-2011), B. Steffens Hovenier (eigen over-onspagina: begonnen in 2014) en
BtH Groen (01-01-2014). De toets die dat in één ronde afvangt is niet het
KvK-nummer — dat verandert mee met de papieren — maar de eigen over-onspagina:
die vertelt wanneer de mens begon, terwijl het register vertelt wanneer de
rechtsvorm veranderde. Lees hem dus vóór de adresjacht, niet erna.

**En de verklaring eronder, plus de goedkope toets — de gidsdatum "opgericht op"
is de VESTIGINGSdatum (1.18).** De `-nu.nl`-, `-spot.nl`- en `.website`-gidsen
publiceren per VESTIGING, niet per onderneming. De KvK zegt zelf wat dat
betekent: het KvK-nummer identificeert de hele onderneming, elk
vestigingsnummer (twaalf cijfers) identificeert één plaats waar die onderneming
activiteiten uitvoert, en de vestigingsdatum is de datum waarop díé vestiging
is ingeschreven — één onderneming met meerdere filialen heeft één KvK-nummer en
meerdere vestigingsnummers. De gidsregel "opgericht op ‹datum›" is dus per
definitie een vestigingsdatum, en dat is de mechanische verklaring van alle
vijf de gevallen hierboven.

Voorbeeld, na te rekenen: **Garage Huis Eemland (Amersfoort)** staat op
`garage-spot.nl` als "opgericht op 01-07-2021". De TransFirm-URL is
`635959070001-garage-huis-eemland`: KvK **63595907** (de 63-reeks is 2015),
vestigingsnummer 000015673693, en onder datzelfde KvK-nummer hangen meer
vestigingen. De onderneming is elf jaar; de vestiging aan de Zwaaikom vijf.

### Een moderne dienstpositionering is geen leeftijd (1.33)

Een techniek, een handelsnaam of een dienstverhaal dat van ná 2018 dateert, meet
hoe modern de márketing is en niet hoe oud de onderneming is. Dit is een nieuwe
drager van 1.15, naast de B.V.-omzetting en de verse handelsnaam over een oude
zaak heen. **Draai bij softwash-, osmose-, "clean"- en soortgelijke namen en
verhalen eerst het KvK-nummer, vóór de adresjacht** — dezelfde volgorde die 1.19
voor de erkenningsdatum voorschrijft. Het kost één ronde en het bespaart een
volledig dossier.

De regel haalt de aannamedrempel op de manier waarop ook 1.13, 1.17 en 1.20 zijn
aangenomen: **twee lanes die hem op 07-09 onafhankelijk en uit verschillende
hoeken vaststelden.**

- **Lane C, één geval van dichtbij:** SoftWash Limburg (Weert) draagt de techniek
  in zijn handelsnaam, heeft een eigen domein met sectorpagina's, een
  Trustoo-profiel en een Facebookpagina — op het oog het ideale dossier. KvK
  **14114322** is een oude Limburgse reeks van vóór 2008. De naam is jong, het
  bedrijf niet.
- **Lane A, een telling:** van negentien glazenwasserdossiers vielen er elf op
  leeftijd, en **de twee die zich in hun positionering het jongst voordeden waren
  de twee oudste van de lijst** — Glazenwasser Drenthe (osmose, acht eigen
  stadspagina's, KvK 04040699, ramen wassend sinds 1991) en GBC
  Schoonmaak-Glazenwassen (KvK 02063951).

**Wat hier uitdrukkelijk níét in staat.** Dit is een leeftijdsregel, geen
sectoroordeel. De grond onder het sectorquotum voor glazenwasserij ("de sector
selecteert zichzelf op jonge zaken") is door lane A weerlegd en die grond
herschrijven is een besluit van het weekrapport en niet van een dagverificatie —
1.19 legde die grens vast. De sector blijft deze week staan als **namenbron**:
de `alleglazenwassers.nl`-vorm levert onverminderd namen mét KvK-nummer in één
ronde, en beide goedgekeurde kaarten van 07-09 komen uit een route met een eigen
domein. Zondag krijgt het quotum een nieuwe grond of een nieuw getal.

**De toets, en let op de formulering.** Dat er een vestigingsnummer in de URL
staat, is géén afwijzingsgrond — dat is bij vrijwel elk bedrijf zo, ook bij een
eenmanszaak met één vestiging waar beide datums samenvallen (Hondentrimsalon
Groomer SPA, goedgekeurd op 05-09, draagt
`90017668-000055770363-…` en daar klopt de gidsdatum gewoon). Het
vestigingsnummer zegt welk SOORT datum je leest. Wat de datum verdacht maakt,
is de tegenspraak: **een KvK-reeks die ouder is dan de gidsdatum, of meer dan
één vestiging onder hetzelfde nummer.** Lees daarom de TransFirm-URL en niet de
gidsregel — het KvK-nummer staat erin, dus één zoekopdracht geeft naam én
leeftijdsondergrens zonder een pagina te openen. En bij tegenspraak beslist nog
altijd de eigen over-onspagina, niet het register.

Twee bronnen die het omgekeerde probleem oplossen en die dezelfde dag door
twee lanes onafhankelijk zijn gevonden (lane A in het noorden, lane B in het
oosten): de vakgidsen van het `-nu.nl`- en `-gids.nl`-type publiceren per
bedrijf de **oprichtingsdatum**, en hun stadsindexpagina's geven een hele stad
in één zoekopdracht (`site:timmerman-nu.nl <stad> <sector>` of
`<gids> "opgericht op" 2022 OR 2023 <provincie> <sector>`). Ze melden ook
uitdrukkelijk wat er níet is. **Volgorde die daaruit volgt:** gids voor de
leeftijd → register of Werkspot/Trustoo voor het gedateerde levensteken →
eenbedrijfspagina van goudengids of detelefoongids voor het adres. Nooit
andersom: een adresjacht op een zaak van veertien jaar is weggegooide tijd.

## Een dag zonder kaarten is geen dag zonder skills

Op 31-08 leverden twee lanes een nuldienst en meldden beide `cold-email` en
`marketing-psychology` als niet ingezet, met als reden dat er geen tekst was
om ze op toe te passen. Dat is juist en het haalt poort (h): een skillslog dat
toepassing claimt op berichten die niet bestaan, is precies de holle log die
de poort moet vangen.

Maar er ligt op zo'n dag wél werk voor twee andere skills uit Sams set, en
beide lanes hebben zich er met de hand naartoe geredeneerd zonder ze aan te
roepen:

- **`customer-research`** voor de vraag welke segmenten deze pijn werkelijk
  voelen en waar ze zich verzamelen. Elke sectorruimte-analyse is deze vraag.
- **`competitor-profiling`** voor de vraag wie er in deze sector al wél
  boekbaar is. Elke "de hele sector boekt al online"-bevinding is deze vraag.

**De regel:** op een dienst zonder kaarten verschuift het skillgebruik van de
schrijfskills naar de onderzoeksskills. De tabel meldt dan die twee, met wat
ze aan de bevindingen veranderd hebben, en meldt cold-email eerlijk als niet
van toepassing.

**Bijstelling 1.11 — `marketing-psychology` vervalt niet, hij verplaatst.** Op
01-09 meldde lane C de skill als niet van toepassing ("geen kaart, dus geen
invalshoek om een model op te kiezen"), terwijl lane D hem diezelfde kaartloze
dag inzette op de vraag *waarom* de lane nul oplevert: Theory of Constraints op
de vraag welke poort de bindende beperking is, lokaal-versus-globaal optimum op
de vraag of méér zoekopdrachten iets hadden opgeleverd, inversie op de
sectorvolgorde. Dat was de beste skilltoepassing in beide bestanden. De
veronderstelling onder lane C's regel klopt dus niet: een tekort is zelf een
gedragsvraag. Op een kaartloze dag gaat `marketing-psychology` van de copy naar
de diagnose van het tekort. Alleen `cold-email` blijft eerlijk n.v.t. — en ook
die alleen zolang er geen tekst is klaargelegd voor een toekomstige kaart; ligt
die er wel, dan wordt hij er nu al tegen getoetst.

**En de toets die dan het meest oplevert: survivorship bias op elke sectortelling.**
Een bedrijf dat via een boekingsplatform werkt, heeft dáárdoor een geïndexeerde
platformpagina; een bedrijf dat dat niet doet, heeft dat spoor per definitie
niet. Een zoekmethode die "zeven van zeven kapsalons boeken al via Fresha"
oplevert, meet dus voor een deel zichzelf: hij brengt juist de bedrijven boven
die zichzelf diskwalificeren en laat onze doelgroep onzichtbaar. **Een sector
wordt daarom nooit afgewaardeerd of gesloten op zo'n telling alleen.** Draai de
zoekopdracht eerst één keer om: neem de stadsindex van het platform zelf als
uitsluitingslijst en jaag op het complement daarvan in de gewone
bedrijvengidsen. Levert dat ook niets op, dan is de sector bezet op bewijs.

## Sectoren: gesloten, afgewaardeerd, of in de wacht

Drie categorieën, en het verschil is belangrijk genoeg om hier te staan,
omdat een lane die ze verwart een deur dichttimmert die de owner nog open
wil houden.

- **Permanent gesloten** — bewezen over meerdere lanes en niet met een ander
  bericht op te lossen: rijscholen, maneges en paardentrainers, zang- en
  muziekdocenten, tandtechniek, kledingherstel en naaiateliers, keramiek- en
  bloemenateliers, tattoo-studio's, dansscholen en yogastudio's, escaperooms,
  en sinds 06-09 **mobiele fietsenmakers** (1.21). Die laatste sluit niet op
  leeftijd of bereikbaarheid maar op het lek zelf: vier onafhankelijke
  bevestigingen dat bellen of appen daar de eerste afspraakweg is, waardoor het
  agendalek dat het 549-pakket verkoopt er aantoonbaar zwakker is dan in de
  sectoren waar een agenda het knelpunt is.
- **Eraf uit de rotatie, niet gesloten** — gastouders en kinderopvang aan huis
  (1.21, derde bevestiging van 1.12). De sector past op profiel, maar de
  bewijsroute die hem zou openen (GGD-inspecties en -vergunningen) draagt wél
  een datum en géén leeftijd, dus poort (a) sluit er zonder dat het venster van
  1 tot 6 jaar getoetst kan worden. Terug in de rotatie zodra er een route is
  die de leeftijd draagt.
- **Afgewaardeerd** — niet dicht, maar verwacht hier één jonge zaak op de
  tien, dus zet er nooit een hele dienst op: tegelzetters, metselaars,
  timmerbedrijven (lane A en lane B kwamen hier op 31-08 onafhankelijk en in
  verschillende provincies op uit, samen achttien bedrijven waarvan er twee
  binnen het venster vielen), schoorsteenvegers.
- **In de wacht bij beslissing 3** — de groep die al via een platform boekt:
  salons op Fresha/Treatwell/Salonized, en sinds 31-08 óók B&B's en
  verblijfsrecreatie op booking.com, natuurhuisje en bedandbreakfast.nl. Lane
  A adviseerde die tweede groep permanent te sluiten; dat is afgewezen. Het
  huidige bericht past er inderdaad niet op — wie een B&B vertelt dat hij
  online boeken mist, verbrandt het adres — maar het platform zelf is een lek
  in geld (commissie per boeking, gastrelatie op hún pagina en niet op zijn
  naam), en dát is precies beslissing 3 die bij de owner ligt. Zolang die
  open staat: niet inzetten, niet sluiten. Eén antwoord opent of sluit beide
  groepen tegelijk.

## Changelog

- 1.25 (2026-09-08, Azzouz, verificatie lanes A+B): drie regels, binnen het
  bereik 1.22 t/m 1.30 dat het weekrapport aan A+B toewees. Geen van de twee
  lanes bood vandaag een kaart aan, dus alle drie komen uit het werk eromheen.
  **1.23 — de 160-220 woorden gelden zonder het handtekeningblok**, en
  **1.25 — de UTM-campagnewaarde is de slug van de sectorpagina**, allebei
  toegevoegd in de nieuwe sectie "Twee maten die twee lanes op één dag
  verschillend namen". Allebei op de klassieke drempel binnengekomen: lane A en
  lane B pasten op 08-09 onafhankelijk van elkaar dezelfde maat verschillend
  toe (218 mét handtekening tegenover 215 zonder; `hovenier-w37` tegenover
  `hoveniers-w37`), en allebei zijn met één telling na te rekenen. Bij 1.23
  weegt mee dat het verschil niet cosmetisch is: op lane A's maat staat lane B's
  tekst drie woorden buiten de grens. **1.24 — een regel op `bellijst.md` is een
  ledgerrij en poort (e) geldt er ook**, toegevoegd bij "Een open poort is een
  bevinding, geen kaart". Deze komt binnen op één drager, met dezelfde grond als
  1.32: de kosten zijn eenzijdig. Otter Hoveniers kreeg op 08-09 zijn derde
  bellijstregel op één week en de nieuwste weet minder dan de oudste — het
  gedateerde levensteken van 11-02-2026, de tweede vestiging, `Pakket: 299` en
  `Hoek: offertelek` zijn er alle vier uit verdwenen — terwijl de owner uit dit
  bestand belt en de nieuwste regel leest. Dezelfde dienst leverde de goede vorm
  ernaast: lane B werkte bij Averesch Tuinen de bestaande regel bij en hing de
  lookalike-waarschuwing eraan.
  **Uitdrukkelijk niet opgenomen:** de vraag of de jaagvolgorde van 1.20(b) moet
  wijken nu lane A haar keerzijde heeft gemeten (zeven van zeven uitgebouwde
  domeinen gaven een adres en nul van zeven een lek; twee van zeven dunne
  domeinen gaven een adres en zeven van zeven een lek). Dat is een echte meting
  en zij raakt rechtstreeks aan twee onbeantwoorde beslispunten van de owner;
  1.19 legt vast dat zo'n besluit bij het weekrapport hoort en niet bij een
  dagverificatie. Ik neem hem mee naar zondag.
  **Kopregel niet gewijzigd:** die staat op 1.33 door de parallelle C+D-sessie
  en een lager nummer erboven zou een verslechtering zijn.

- 1.33 (2026-09-07, Azzouz, verificatie lanes C+D): drie regels, binnen het
  bereik 1.31 t/m 1.40 dat het weekrapport aan C+D toewees. **1.31 — de
  bestemming van een link is zelf een claim**, toegevoegd bij "Wat een bericht
  nooit mag beweren". De enige kaart van lane C beloofde een werkende demo op
  `zevren.nl/website-voor/hoveniers`, met de juiste formulering (1.1), de juiste
  UTM en een pagina die werkelijk bestaat — en toch onwaar, want zes van de tien
  sectorpagina's dragen een demo en vier de conceptbouwerroute. Opgenomen op één
  dienst omdat de kosten eenzijdig zijn: wie dóórklikt is juist de geïnteresseerde
  lezer. **1.32 — een oude ledgerrij is geen beletsel maar een omkering die je
  opschrijft**, toegevoegd bij "Een open poort is een bevinding, geen kaart".
  Hanenberg Hoveniers stond sinds 02-09 als `not fit - geen lek vastgesteld` en de
  kaart van 07-09 meldde "nul rijen"; de omkering was inhoudelijk terecht en bij
  de verificatie onafhankelijk bevestigd, maar zij is niet als omkering
  geschreven. De regel bestaat omdat de verificatie poortuitkomsten op hun woord
  leest: één onwaar gemelde poort kost de geloofwaardigheid van alle poorten die
  dezelfde dienst wél goed draaide. **1.33 — een moderne dienstpositionering is
  geen leeftijd**, toegevoegd als nieuwe drager van 1.15 bij "Een erkenningsdatum
  is een levensteken". Dit is de enige van de drie die op de klassieke drempel
  binnenkomt: twee lanes stelden hem op dezelfde dag onafhankelijk vast, lane C
  op één geval van dichtbij (SoftWash Limburg, KvK 14114322 uit een reeks van
  vóór 2008) en lane A op een telling (de twee jongst gepositioneerde van
  negentien dossiers waren de twee oudste ondernemingen). **Uitdrukkelijk niet
  opgenomen:** het sectorquotum voor glazenwasserij. Lane A weerlegde de grond
  eronder en de parallelle A+B-verificatie heeft die vraag terecht naar zondag
  verwezen; 1.19 legt vast dat een sectorbesluit bij het weekrapport hoort. Ik
  houd me daaraan, ook al is het mijn eigen order die sneuvelt.
  **Twee voorstellen bewust niet opgenomen:** lane D's regel dat een
  contactformulier of KvK-afscherming een bewuste contactroute is en geen
  onbereikbaarheid (rust op één lane en één dienst, en raakt rechtstreeks aan het
  onbeantwoorde beslispunt over een tweede verzendweg — hij gaat naar het
  weekrapport), en de aanscherping bij Van Barlingen dat een treffer uit de
  `"sinds JAAR"`-zeef een naam is en geen leeftijd, óók op `alleglazenwassers.nl`
  (één geval; lane D krijgt de order hem morgen te reproduceren, dan gaat hij bij
  1.19 in).

- 1.22 (2026-09-07, Azzouz, verificatie lanes A+B): één regel, bij "Wiens daad
  draagt de datum" — **de reviewdatum op een platformprofiel draagt poort (a)
  niet alleen.** Datum, tekst en bedrijf moeten in één resultaat samen staan;
  bij twee ronden met verschillende datums bij dezelfde tekst wint de oudste; en
  een review die het bericht citeert, moet die toets sowieso doorstaan omdat zij
  dan ook poort (c) en de geloofwaardigheid van de mail draagt. De drempel is
  gehaald op de manier waarop ook 1.13 en 1.17 zijn aangenomen: twee
  onafhankelijke diensten aan hetzelfde dossier (Gomar Multidiensten, 28-08 en
  07-09) die langs precies dezelfde weg vielen — de eerste keer op reviews buiten
  het dienstenpakket, de tweede keer op twee datums die zes ronden niet
  reproduceerden terwijl dezelfde tekst elders 31-05-2025 draagt bij een
  dakisolatieklus. **Niet opgenomen:** het voorstel dat in mijn eigen directives
  besloten ligt, dat glazenwasserij zichzelf op leeftijd zou selecteren omdat
  osmose en softwash technieken van ná 2018 zijn. Lane A heeft die grond op
  07-09 gemeten en weerlegd (elf van negentien vielen op leeftijd; de twee zaken
  met het jongste techniekverhaal waren de oudste ondernemingen, Glazenwasser
  Drenthe uit 1991 en GBC met KvK 02063951). Een moderne dienstpositionering over
  een oude onderneming heen is een nieuwe drager van 1.15, maar het quotum
  herschrijven is een besluit van het weekrapport en niet van een dagverificatie
  — 1.19 legde die grens vast. Ik neem het mee naar zondag.
  **Nummering:** binnen het bereik dat het weekrapport aan A+B toewees (1.22 t/m
  1.30). Geen botsing met de parallelle C+D-sessie, die 1.31 t/m 1.40 schrijft.

- 1.21 (2026-09-06, Azzouz, weekcyclus 31-08 t/m 06-09): drie dingen, alle drie
  besluiten die bij het weekrapport horen en niet bij een dagverificatie —
  1.19 legde die grens zelf vast. **(a) Mobiele fietsenmakers permanent
  gesloten** bij "Sectoren: gesloten, afgewaardeerd, of in de wacht". Lane A
  bood dit op 06-09 aan met vier onafhankelijke bevestigingen dat bellen of
  appen daar de eerste afspraakweg is; ik heb het toen niet opgenomen omdat een
  sector sluiten een besluit van de owner en het weekrapport is. Het is nu dat
  besluit. De grond is de sterkste die wij voor een sluiting hebben: niet dat
  de bedrijven te oud of onbereikbaar zijn, maar dat het lek dat wij verkopen
  er niet bestaat. **(b) Gastouders en kinderopvang aan huis uit de rotatie**,
  als aparte categorie naast "gesloten", derde bevestiging van 1.12. De sector
  past op profiel; de bewijsroute die hem moest openen (GGD-inspecties en
  -vergunningen, toegewezen in de inboxbeslissing van 31-08) draagt een datum
  maar geen leeftijd, dus zij sluit poort (a) zonder dat het leeftijdsvenster
  toetsbaar wordt. Ik zette hem vorige week nog op plaats twee van het
  sectorplan; die order is hiermee ingetrokken. **(c) Het prime target krijgt
  een quotum in plaats van een volgorde.** 1.20(b) legt de keuze over de
  geen-websitegroep netjes bij de owner, maar de jaagvolgorde die eronder staat
  ("dan een zeef op bedrijven mét eigen domein") beslist hem alsnog in stap
  twee — en de order van de owner van 24 augustus maakt juist die groep tot
  prime target. De volgorde blijft staan, want de telling eronder is echt (5 van
  5 tegen 0 van 5). Wat erbij komt is een vast quotum in de directives: acht van
  de veertig dossiers per lane per dienst blijven in de geen-websitegroep, met
  bestemming `bellijst.md` en niet het bord. Zo blijft de groep gemeten terwijl
  de owner over een tweede verzendweg beslist, in plaats van stilzwijgend te
  verdwijnen via een volgorderegel. **Ook gecorrigeerd:** de kopregel van dit
  document stond nog op 1.19 terwijl de changelog al een 1.20-entry droeg — de
  parallelle sessie van 06-09 bumpte de entry en niet de kop.
  **Nummerbereiken vanaf nu:** verificatie A+B schrijft 1.22 t/m 1.30,
  verificatie C+D schrijft 1.31 t/m 1.40. Drie keer deze week botsten twee
  parallelle sessies op hetzelfde nummer (1.13/1.14, 1.17/1.18, 1.19/1.20).

- 1.20 (2026-09-06, Azzouz, verificatie lanes C+D): twee regels, allebei op de
  drempel gehouden tot twee lanes ze onafhankelijk droegen, plus één aanscherping
  van 1.13. **(a) "De samenvattende alinea boven de zoekresultaten is geen bron"**
  toegevoegd bij "Wiens daad draagt de datum". Dit is de enige bronfout die zich
  als citaat vermomt en die precies het gat vult dat poort (a) openhoudt: een
  jaartal. Lane C ving hem twee keer op één dag (de Walsert: "gesloten van 25
  augustus t/m 8 september **in 2026**", waar de pagina geen jaartal draagt;
  Leeters: "established around September 2022", afgeleid uit sitemetadata) en
  weigerde allebei. Ik heb hem diezelfde dag onafhankelijk gereproduceerd op de
  Walsert. Opgenomen bij één dienst in plaats van twee, omdat de kosten van de
  fout eenzijdig zijn: hij sluit de duurste poort van het bord op een zin die de
  zoekmachine zelf heeft geschreven. **(b) "Het eigen domein is de enige bron die
  leeftijd, adres én levensteken tegelijk draagt"** toegevoegd bij "Welke bron een
  e-mailadres draagt", mét de `site:`-lekronde als operationele helft. Lane C en
  lane D stelden dit op 06-09 onafhankelijk vast, uit verschillende hoeken, met
  een telling (5 van 5 mét eigen domein tegen 0 van 5 zonder, na drie ronden elk),
  en beide goedgekeurde kaarten van die dag komen eruit. Dat is de drempel waarop
  ook 1.13 en 1.17 zijn aangenomen. **Opgenomen in ingeperkte vorm:** lane D's
  eigen formulering ("wij selecteren op de eigenschap die het dossier onvindbaar
  maakt") leest als een afwaardering van de geen-websitegroep, en dat zou de order
  van de owner van 24 augustus overrulen — wat een fundamentregel niet mag. De
  opgenomen vorm zegt alleen dat die groep poort (b) niet haalt op een bord dat
  uitsluitend mailt, en legt de keuze bij de owner. **Aanscherping van 1.13:** de
  prijsaanpassingsroute werkt niet in sectoren met een bindende cao of een
  landelijk normbedrag (schoonmaak, glazenwasserij, hovenierswerk, gastouders) —
  daar is dezelfde zin een cao-bericht en verdrinkt het bedrijfsniveau in
  branchenieuws; lane C draaide hem vier keer in vier sectoren en hij faalde vier
  keer. Lane D leverde de andere helft: de route werkt wel in trimsalons maar is
  niet op provincie te sturen, dus de plaatsnaam moet ín de opdracht.
  **Niet opgenomen:** de straatnaam-adresroute van lane D — die stond als order om
  op vijf dossiers te tellen, lane D draaide hem op vier (het vijfde was al op de
  kale vorm gesloten, en hij schreef dat er eerlijk bij), haalde nul extra
  adressen en trok zijn eigen voorstel in. Wat ervan overblijft is een gewoonte en
  geen regel: het straatadres duwt de zoekmachine naar de eenbedrijfspagina en
  maakt het resultaat schóner, niet rijker — een precisiewinst tegen de val van
  1.6, geen vindwinst.
  **Nummering:** de verificatie van lanes A+B liep vandaag opnieuw parallel in een
  tweede sessie en claimde 1.19 als eerste op `main`, dus deze regels staan als
  1.20 — voor de tweede dag op rij, en het is de tweede keer dat ik het achteraf
  moet rechtzetten. De twee entries spreken elkaar niet tegen en raken elkaar op
  één punt: A+B legt bij de vakgidszeef vast welke gidsfamilies de leeftijdszin
  wél en niet voeren, en 1.20(b) hieronder legt uit waarom die zeef sowieso geen
  adres draagt en het eigen domein wel. **Voor de volgende zondag hoort in de
  directieven te staan welke lane welk nummerbereik krijgt**, zodat dit ophoudt.

- 1.19 (2026-09-06, Azzouz, verificatie lanes A+B): één regel, over de
  namenbronnen uit 1.17(b), en zij is de uitkomst van de opdracht die ik lane A
  op 05-09 gaf ("werkt hij opnieuw, dan gaat hij in het fundament; werkt hij
  niet, dan meld je dát"). Alle drie de delen van dat antwoord staan nu bij de
  vakgidszeef: de `alleglazenwassers.nl`-vorm haalt de drempel van twee diensten
  en is opgenomen; de `-info.nl`-familie voert de zin aantoonbaar níet en is als
  negatief resultaat opgenomen zodat niemand er ronden in steekt; en
  `hovenier.website` voert hem wél maar met de vestigingsdatum, waarmee 1.18(b)
  vandaag zijn zwaarste bevestiging krijgt — zeven gevallen op één dag in twee
  lanes die elkaars bestand niet kenden. De verplichte over-onsronde bij elke
  gidsdatum van 2022 of later is daarmee geen aanbeveling meer maar de volgorde
  zelf. **Niet opgenomen:** het voorstel van lane A om mobiele fietsenmakers als
  sector te sluiten op het WhatsApp-argument. Het argument is goed en het bewijs
  is echt (vier zaken die appen als eerste afspraakweg voeren), maar een sector
  sluiten is een besluit van de owner en van het weekrapport, niet van een
  dagverificatie; het staat als voorstel in mijn conclusie. Ook niet opgenomen:
  lane B's voorstel om dierenpension uit de rotatie te halen — zelfde grond,
  plus één lane en één meting.

- 1.18 (2026-09-05, Azzouz, verificatie lanes C+D): twee regels, allebei op de
  drempel gehouden tot het bewijs er was. **(a) "De platformzoekopdracht sluit
  de boekingspoort niet"** toegevoegd bij "De poort die het vaakst kaarten
  kost". Ik legde deze regel op 04-09 vast als voorstel en hield hem tegen tot
  een tweede, onafhankelijke bevestiging — dezelfde drempel die ik lane C op de
  transfirm-route oplegde. Die kwam op 05-09 uit een andere lane dan de eerste,
  in vier gevallen (Kersten, Salon-013, Dogstart, Leven Massage), alle vier
  schoon op de platformlijst en alle vier met een eigen boekingsroute. **(b)
  "De gidsdatum 'opgericht op' is de VESTIGINGSdatum"** toegevoegd bij de
  erkenningsdatum-sectie, als verklaring én goedkope toets onder 1.16. Lane D
  vond het mechanisme (Garage Huis Eemland: gids 01-07-2021, KvK 63595907 uit
  2015, meerdere vestigingen onder één nummer) en de KvK-documentatie
  bevestigt het structureel. **Opgenomen in gecorrigeerde vorm:** lane D's eigen
  toets ("staat er een vestigingsnummer, dan is de datum die van de vestiging")
  is waar maar te breed om op af te wijzen — zijn eigen goedgekeurde kaart van
  dezelfde dag draagt er ook een en daar klopt de gidsdatum. De opgenomen toets
  is de tegenspraak: een KvK-reeks ouder dan de gidsdatum, of meer dan één
  vestiging onder één nummer. **Niet opgenomen:** de straatnaam-adresroute van
  lane D (`"<naam>" <plaats> <straat> e-mail telefoon contact`). Goede gewoonte
  en verenigbaar met 1.6, maar het contrast waarop ze rust reproduceerde bij mij
  niet — ik kreeg het adres van Groomer SPA in één kale naamronde. Staat als
  order om op vijf dossiers te tellen. Ook niet opgenomen: "twee KvK-nummers op
  één naam, het laagste telt" (lane C, Rinus Biemans) — juist, maar één lane,
  één dossier; staat als jaagregel in de orders.
  **Nummering:** deze dienst en de verificatie van lanes A+B liepen vandaag
  parallel in twee sessies; A+B claimde 1.17 als eerste op `main`, dus deze
  regels staan als 1.18. De twee entries spreken elkaar niet tegen en vullen
  elkaar op één punt aan: A+B(b) waarschuwt dat de KvK-reeks in de TransFirm-URL
  een REGISTERdatum is en geen leeftijd, en 1.18(b) hieronder legt uit waarom de
  gidsdatum ernaast dat evenmin is.

- 1.17 (2026-09-05, Azzouz, verificatie lanes A+B): twee regels, allebei over de
  VOLGORDE van het werk en niet over wat een kaart moet dragen.
  **(a) De klantenstopzoekopdracht schuift naar vóór de adresjacht,** direct achter
  de boekingspoort, in elk ambacht waar de capaciteit één paar handen is. Drie
  complete dossiers gingen vandaag op die ene zoekopdracht verloren, in twee lanes
  die elkaars bestand niet kenden: Frank & Vrij (Meppel, lane A, intakestop tot half
  oktober 2026) en For your Doodle en Daphne's Trimsalon (allebei lane B). Bij
  Daphne's had de lane poort (a) net zelf gesloten met een prijsaanpassing per januari
  2026 op het eigen domein — het dossier was verzendklaar. Lane B bracht het als
  voorstel uit één lane en één dienst; lane A leverde onafhankelijk het derde geval,
  en twee lanes op één dag is precies de drempel waarop 1.13 is aangenomen. Bij
  dezelfde regel hoort de behandeling van de intakestop met een einddatum: op datum
  in het ledger, niet als `not fit` zonder meer.
  **(b) De TransFirm- en vakgidszeef is opgenomen als NÁMENZEEF,** met de
  uitdrukkelijke waarschuwing dat de KvK-reeks in de URL een registerdatum is en geen
  leeftijd. Gisteren heb ik deze route afgehouden op de drempel "één lane, één
  dienst"; vandaag hebben beide lanes hem gebruikt en allebei dezelfde beperking
  teruggemeld — lane A met drie verse reeksen boven oude zaken, lane B met drie
  hoveniers van achttien, meer dan tien en eenenveertig jaar onder gidsdata uit
  2023/2024. De vaste volgorde staat er nu bij: namen, dan de eigen over-onspagina,
  dan de klantenstopronde, dan het adres.
  **Niet opgenomen:** de vondst van lane A dat de eenbedrijfspagina's van
  `alleglazenwassers.nl` leeftijd én KvK in één zin publiceren ("Opgericht als
  Glazenwasser (Kamer van Koophandel nummer X), biedt ons team van N ervaren
  medewerkers sinds JAAR"). Vier leeftijden voor de prijs van één ronde, maar één
  lane en één dienst. Hij staat als order voor beide lanes in
  `marketing/outreach/2026-09-05-ab-verified.md`; werkt hij maandag opnieuw, dan komt
  hij hier te staan. Dezelfde drempel, ook nu de vondst mij goed uitkomt.

- 1.16 (2026-09-04, Azzouz, verificatie lanes A+B): twee regels uit de enige
  kaart van de dag en uit de val waar lane B er vier op zag omvallen.
  **(a) "Een belofte over de VORM van het werk is net zo hard gedekt of niet
  gedekt als een prijs"** toegevoegd als vierde punt bij "Wat een bericht nooit
  mag beweren". De kaart voor JF Hoveniers verkocht "foto's van voor en na";
  die belofte staat nergens op zevren.nl, en een voor-en-na vraagt om een foto
  van vóór het werk die niemand heeft toegezegd. De site zegt "groot en scherp"
  en dat is bovendien de sterkere zin. Aan hetzelfde punt is de btw-helft
  gekoppeld: de sectorpagina's noemen "299 euro eenmalig, exclusief btw", dus
  "299 euro, eenmalig" is gedekt en "alles inbegrepen" niet. Dat laatste raakt
  elke kaart van deze week en het is daarom een regel geworden en geen
  correctie met terugwerkende kracht — dat zou een beslissing zijn, geen
  redactie. **(b) "De eigen over-onspagina verslaat de gidsdatum"** toegevoegd
  bij de erkenningsdatum-sectie, als praktische aanscherping van 1.15(b). Lane
  B zag op 04-09 vier bedrijven op één dag waar een gidsdatum uit 2023/2024 een
  zaak van tien tot zesentwintig jaar droeg (Steengoed!, Bast, B. Steffens, BtH
  Groen); telkens gaf de eigen over-onspagina het eerlijke jaartal, en telkens
  gaf het KvK-nummer dat niet, want dat verandert mee met de rechtsvorm.
  **Niet opgenomen:** de TransFirm-zeef van lane B (het KvK-nummer staat in de
  URL van `transfirm.nl/nl/organisatie/...`, dus één zoekopdracht filtert op
  leeftijd zonder een pagina te openen). Uitstekende route, één lane, één
  dienst — dezelfde drempel die ik gisteren op `optios` heb toegepast, en die
  geldt ook als de vondst mij goed uitkomt. Hij staat als order voor beide
  lanes in `marketing/outreach/2026-09-04-ab-verified.md`.

- 1.15 (2026-09-03, Azzouz, verificatie lanes A+B): twee regels, allebei uit een
  dossier dat vandaag bijna een kaart werd of bijna een afwijzing miste.
  **(a) "Een gedateerde review op een vakgidspagina is pas een levensteken als de
  datum per review verschilt en de reviewtekst over dít bedrijf gaat"**
  toegevoegd bij "Wiens daad draagt de datum". Brinkveld Hoveniers was het
  sterkste openstaande dossier van beide lanes — adres bevestigd, opgericht
  12-06-2023, lek positief vastgesteld, geen boekingspoort — en poort (a) leek
  te sluiten op een 10,0 van 14-11-2025. Twee reviews met dezelfde datum en een
  reviewtekst over een ander vakman maakten er de importstempel van de gids van.
  Zonder deze regel was dat de enige kaart van 03-09 geweest, gebouwd op de
  huishouding van hovenier.website. **(b) "Een verse registerdatum over een oude
  zaak"** toegevoegd bij de erkenningsdatum-sectie, als spiegelbeeld van de
  Stagemarkt-val die daar al stond. Lane A vond hem bij Middeljans Schilders
  (1991 achter een KvK-nummer uit 2024), lane B bij De Hondentrimsalon van
  Zutphen (Ellen Lammers sinds 1994 achter een handelsnaam uit 2024) —
  onafhankelijk, dezelfde dag, verschillende provincies en sectoren, dus boven
  de meer-dan-één-lane-drempel. Lane A bood hem zelf aan als waarneming en niet
  als wijziging; lane B's geval is de tweede lane die hij nodig had.
  **Niet opgenomen:** lane A's voorstel om `optios` aan de vaste
  platformzoekopdracht toe te voegen. Het komt uit één lane en één bedrijf
  (Kapsalon Promise, Groningen) en lane A biedt het zelf uitdrukkelijk als
  waarneming aan. Het staat als order voor morgen in
  `marketing/outreach/2026-09-03-ab-verified.md`; zodra een tweede lane erop
  zoekt, hoort het hier thuis.

- 1.14 (2026-09-02, Azzouz, verificatie lanes A+B): vijf dingen uit drie kaarten
  en vier lane-voorstellen. Deze versie staat naast 1.13 van dezelfde dag: die
  kwam uit de verificatie van lanes C en D en was al gepusht toen deze dienst
  wilde schrijven. Beide zijn behouden; niets van 1.13 is teruggedraaid.
  **(a) "Een stil levensteken sluit poort (a) wel, maar draagt een kortere
  houdbaarheid"** toegevoegd bij poort (a). Lane B sloot de poort bij FlevoDogs
  op een versiemarkering achter een PDF-link op het eigen domein
  (`?v=2026-05-03`) en noemde dat zelf het zwakste bewijsstuk van het dossier —
  precies de goede manier om dun bewijs aan te bieden, en de reden dat het is
  aangenomen. Vier extra zoekronden leverden geen steviger spoor op, dus dit
  soort bewijs gaat vaker langskomen naarmate de leeftijds- en de adresmuur de
  rest wegnemen. Het probleem is niet of het telt maar dat het niet veroudert:
  de hercontrole na twee weken keurt zichzelf goed omdat het spoor er
  onveranderd staat. Vandaar de eis van een spoor van een ándere soort bij
  hercontrole. Dit sluit rechtstreeks aan op 1.13(a) van vandaag, dat met de
  scheidslijn "de aankondiging draagt de datum, de prijslijst niet" hetzelfde
  onderscheid van de andere kant benadert.
  **(b) `1Kapper.nl`/`1BeautyAfspraak.nl` en `Belliata` op de platformlijst.**
  Lane A vond ze op 02-09 bij Kapsalon-barbershop Fris in Uithuizen — het
  bedrijf dat de verificatie van 01-09 uitdrukkelijk terug in de jacht had
  gezet — met 9,5 uit 68 beoordelingen en direct online boeken. Geen gids maar
  een agendaplatform met kassa erbij. Zelfde grond als 1plekjevrij in 1.12: een
  platform dat niet op de lijst staat, wordt niet gezocht, en dan vertelt een
  bericht een ondernemer dat hij mist wat hij al betaalt. Met de aantekening van
  de lane erbij: de stadsindexpagina's (`1kapper.nl/<stad>`) zijn onder de
  survivorship-toets van 1.11 geen uitputtingsbewijs voor de sector maar een
  bruikbare uitsluitingslijst — jaag op het complement.
  **(c) `klantenstop` als vaste tweede zoekopdracht,** direct ná de
  platformcheck. De ICP sluit volle boeken uit maar het stond in geen enkele
  poortenlijst, dus het werd alleen per ongeluk gevonden. De diagnose van lane A
  eronder is scherper dan het voorstel: onze profielregels jagen op "aantoonbaar
  lopend", en in een eenpersoonsambacht is dát het signaal dat vlak vóór een
  klantenstop komt — we selecteren er dus systematisch op. Drie bedrijven, drie
  provincies, twee sectoren, twee lanes die niets van elkaars werk wisten (lane A
  bij twee noordelijke trimsalons, lane B bij Hondenpension Het Oude Bos in
  Flevoland).
  **(d) "Lees het ledger op naam over de hele lengte"** erbij gezet, uit de
  enige afkeuring van vandaag: Stark Stuc kwam als nieuwe kaart op het bord
  terwijl dezelfde lane het bedrijf op 29-08 zelf had afgewezen, met exact de
  reden die opnieuw gold. Een kaart die op poort (e) valt, valt nadat al het
  andere werk er al in zit.
  **(e) Twee sectorbesluiten.** Schoonmaak en glazenwassen worden een
  **bellijstsector**: vier van vier op-profiel bedrijven halen de leeftijdspoort
  en stranden op het adres, omdat Trustoo en Werkspot aan het formulier
  verdienen — vastgesteld door lane C op 01-09 in het zuiden en lane B vandaag
  in het oosten. Uitdrukkelijk een afwaardering en geen sluiting: de sector hangt
  aan beslissing 3 bij de owner, en 1.9 verbiedt permanent sluiten wat een
  openstaande ownerbeslissing kan heropenen. **Gastouderopvang gaat van plaats 2
  af,** maar op de tweede grond van lane B en niet op de eerste: het
  privacyargument gaat te ver (een gastouder met KvK en LRK-nummer is een
  ondernemer, en zou dat argument kloppen dan raakte het ook thuiskapsters en
  trimsalons aan huis). Wat wél klopt is dat het bureau de bemiddeling doet, dus
  het lek dat wij oplossen bestaat daar niet. Met 1.12 staat de sector daarmee op
  drie gronden stil, waarvan er twee van mij komen — ik heb hem zelf op plaats 2
  gezet en dat was fout. Kinderopvang met een eigen pand blijft in beeld.

- 1.13 (2026-09-02, Azzouz, verificatie lanes C+D): twee dingen, beide op de regel
  dat het fundament alleen wijzigt op bewijs uit meer dan één lane.
  **(a) De prijsaanpassing met het lopende jaartal is opgenomen als poort-(a)-route**
  (eigen sectie hierboven). Lane C en lane D vonden hem op 2 september onafhankelijk
  in verschillende provincies, met drie overlappende namen en zonder elkaars bestand
  te kennen; elk haalde er in één zoekopdracht vijf tot zes salons met een leesbare
  datum uit. De scheidslijn die er meteen bij hoort komt ook van beide lanes: de
  aankondiging van de wijziging draagt de datum, de prijslijst niet. Dit is de vierde
  route die poort (a) kan sluiten bij een zaak zonder levende socials, en de eerste
  die per definitie jaarlijks ververst.
  **(b) De regel "één vraag" begrenst het aantal vragen, niet het aantal bewijsstukken.**
  Lane C haalde op 02-09 de verwijzing naar de conceptbouwer uit een verder sterke
  kaart, onder de `cold-email`-regel "one ask, low friction", en logde dat als een
  verbetering. Dat is één regel te ver doorgevoerd: de staande order van 25 augustus
  eist de demo als bewijslast, één keer genoemd met een concrete uitnodiging, en een
  bericht dat op een prijs en een kale link eindigt geeft de lezer niets wat hij die
  avond kan doen. De correctie is in de goedgekeurde kaart doorgevoerd zonder tweede
  link, want de conceptbouwer staat op de branchepagina waar de link al heen wijst.
  **Vastgelegd als eis: elk bericht noemt de demo of de conceptbouwer precies één
  keer, met een concrete uitnodiging, en de link ernaartoe telt niet als tweede ask.**
  Twee dingen zijn uitdrukkelijk NIET opgenomen omdat ze uit één dienst komen: lane C's
  omgekeerde jaagvolgorde (eerst reviewvolume, dan leeftijd) en lane D's zoekvorm op
  de eigen woorden van de starter ("eigen salon gestart", "nieuw geopend"). Ze wijzen
  naar hetzelfde probleem — de gidsenroute selecteert op overlevingsduur en dus tegen
  ons profiel in — maar elk is één keer gedraaid. Order staat in
  `marketing/outreach/2026-09-02-cd-verified.md`: draai ze morgen kruislings, elk in
  de lane waar hij niet vandaan komt.

- 1.12 (2026-09-01, Azzouz, verificatie lanes A+B): twee wijzigingen, beide uit lanes A en B van
  1 september, en beide op de regel dat het fundament alleen wijzigt op bewijs
  dat uit meer dan één lane komt.
  **(a) `1plekjevrij.nl` en `Tipaw` toegevoegd aan de platformlijst bij "De
  poort die het vaakst kaarten kost".** 1plekjevrij stond in geen enkel bestand
  in `agents/` of `.agents/` en kwam op 01-09 bij twee noordelijke trimsalons
  (TimeLess in Makkum, Marley in Assen) als enige boekingsroute boven; het
  platform richt zich uitdrukkelijk op trimsalons en verkoopt letterlijk onze
  549-belofte. Tipaw sloot dezelfde dag de poort in twee lanes (Mooi Af in
  Dronten, Pieko Bello in Zwijndrecht) en stond er evenmin op. Een platform dat
  niet op de lijst staat, wordt niet gezocht — en dan vertelt een bericht een
  ondernemer dat zij mist wat zij al betaalt. Bij dezelfde wijziging is de
  volgorde vastgelegd: de platformcheck is de EERSTE zoekopdracht in een
  afspraaksector, vóór de leeftijd en vóór het adres. Grond: dertien van de
  achtendertig ledgerregels van 01-09 vielen op `boekt al online`, in negen
  provincies en in dezelfde twee sectoren, door lanes die niet van elkaars werk
  wisten.
  **(b) "Een bewijsroute is nog geen vindroute" toegevoegd bij "Wiens daad
  draagt de datum".** Ik heb gastouderopvang deze week in de directives naar
  prioriteit 2 getild met als grond dat GGD-rapporten openbaar én gedateerd
  zijn. Dat klopt en het helpt niet: het Landelijk Register is een databank
  achter een zoekformulier zonder pagina per voorziening. Lane A en lane B
  hebben dat op dezelfde dag in verschillende provincies vastgesteld. De fout
  is van mij en staat nu opgeschreven, samen met dezelfde beperking bij de
  vergunningenroute. De vergunningenroute zelf is NIET als route opgenomen —
  één lane, twee treffers, nul namen — maar wel als waarschuwing genoteerd.

- 1.11 (2026-09-01, Azzouz, verificatie lanes C+D): vier dingen uit twee
  nuldiensten. (1) **De drie ledgervelden blijven in de notitiekolom en worden
  geen kolommen.** Drie lanes kozen op 01-09 onafhankelijk dezelfde vorm
  (`Sector: … · Pakket: … · Hoek: …` vooraan de notitie) en trokken hun rijen
  daarna naar elkaar toe. 878 rijen herschrijven om drie velden filterbaar te
  maken die met één `grep` al filterbaar zijn, is de kosten niet waard in een
  week waarin de kaartparser twee keer bijna een geldige kaart opat. Mijn
  directive vroeg om echte kolommen; dat deel is ingetrokken. Waar het lek niet
  is vastgesteld blijft er een streepje staan — een hoek invullen bij een
  onbewezen lek maakt het veld onbruikbaar voor precies de vraag waarvoor het
  bedacht is. (2) `marketing-psychology` verplaatst op een kaartloze dag naar de
  diagnose van het tekort in plaats van te vervallen, en survivorship bias is de
  verplichte toets bij elke sectortelling — beide hierboven uitgeschreven. (3)
  **Twee zoekroutes bevestigd, elk met hun valstrik.** De Werkspot-profielpagina
  draagt één bedrijf met beoordelingen mét leesbare datum en is geïndexeerd; de
  exacte vorm is `werkspot.nl/profiel/<naam>/reviews`, en de categoriepagina
  (`/schoonmaak/schoonmaakbedrijf-vakmannen/<stad>`) is de samengevatte gidsvorm
  die niet telt. De gidsenfamilie `alle<sector>.nl` en `beste<sector>.nl` voert
  per bedrijf oprichtingsjaar én KvK-nummer en is per provincie in één opdracht
  uit te lezen (`site:alle<sector>.nl "opgericht" 2022 OR 2023 <provincie>`) —
  maar **het twaalfcijferige nummer in de URL is het vestigingsnummer, niet het
  KvK-nummer** (Aluclean draagt 000044801599 bij KvK 77078705). Wie op KvK zoekt
  in die URL-vorm vindt niets en concludeert ten onrechte dat de route dood is.
  Dezelfde familie dekt meer dan glazenwassers: schoonmaakbedrijven staan er ook
  in. (4) **Werkspot-leadkosten zijn € 3,00 tot € 75,00 per lead**, in rekening
  gebracht wanneer de consument bij wederzijdse interesse zijn contactgegevens
  deelt (Werkspots eigen helpdesk). Lane C noteerde € 60,00 als bovengrens met
  bronvermelding erbij. Het argument zelf deugt en mag een kaart dragen, maar
  nooit als openingszin: haal de regel weg en het bericht leest nog voor iedere
  vakman op dat platform, dus het is positionering en geen personalisatie. En
  nooit met "en daarna niets" erachter — domein en hosting lopen via het
  optionele verzorgingsplan, dus de toegestane formulering is "geen kosten per
  klant".

- 1.10 (2026-08-31, Azzouz, verificatie lanes C+D): twee dingen. (1) De kopvorm
  van bevindingen vastgelegd na een expliciete vraag van lane C — ongenummerde
  `## `-koppen, zodat ze nooit met `## N. Naam — Plaats` kunnen botsen; de
  directives en `beats.md` schreven tot vandaag iets anders voor dan elkaar. (2)
  Bij "een open poort is een bevinding" hoort een scherpere formulering die
  vandaag een kaart bijna kostte: **"ik heb niets gevonden" is geen bewijs van
  afwezigheid wanneer je van die bron sowieso niets kunt vinden.** Lane C sloot
  de boekingspoort bij Hondentrimsalon Yuka af met "geen boekingspagina
  geïndexeerd", terwijl van dat domein geen enkele pagina geïndexeerd is, en
  schoof de controle als Owner check door naar de owner. Dezelfde lane-agent
  paste de juiste redenering diezelfde dag in lane D wél toe (Uw Bouw Nederland).
  De kaart is uiteindelijk goedgekeurd omdat de verificatie de poort zelf sloot
  met een controleerbaar feit — het domein heeft geen A-record, dus er is geen
  site en dus geen boekingsknop — en dat is de vorm die telt: een positief
  vaststelbaar feit, niet een leeg zoekresultaat.
- 1.9 (2026-08-31, Azzouz, verificatie lanes A en B): drie dingen uit twee
  nuldiensten. (1) Sectie "Een erkenningsdatum is een levensteken, nooit een
  leeftijdsbewijs" toegevoegd — de Stagemarkt-route die ik zelf op 30-08 als
  eerste zoekopdracht aanbeval, leverde in twee dagen drie bedrijven op die er
  jong uitzagen en 20 tot 26 jaar bleken; lane A stelde daarmee mijn eigen
  advies bij, en de vakgidstechniek die het oplost is dezelfde dag door lane A
  en lane B onafhankelijk in twee regio's gevonden. (2) Sectie "Een dag zonder
  kaarten is geen dag zonder skills" — beide lanes meldden cold-email en
  marketing-psychology terecht als niet ingezet (poort h gehaald), maar lieten
  customer-research en competitor-profiling liggen terwijl hun hele dienst uit
  die twee vragen bestond. (3) Sectie "Sectoren: gesloten, afgewaardeerd, of in
  de wacht" — lane A's advies om B&B's permanent te sluiten is afgewezen en
  omgezet in een wachtstand bij beslissing 3, samen met de Fresha-groep: het
  huidige bericht past er niet op, maar de commissie van het platform is een
  lek in geld en dat is nu juist de vraag die bij de owner ligt. Een lane mag
  een sector afwaarderen; permanent sluiten wat een openstaande
  ownerbeslissing kan heropenen, mag ze niet.
- 1.8 (2026-08-31, Azzouz, weekcyclus 30-08): de sectorcap gerepareerd. Bij de
  weekreview bleek dat de lanes hem toepassen op elke ledgerrij in plaats van op
  kaarten. Met 584 nieuwe rijen in zeven dagen sluit dat elke bewezen sector —
  kapsalons stonden op 26 rijen en dus "dicht", terwijl er maar 2 kaarten van
  gemaakt zijn. De lanes zijn daarmee stelselmatig de sectoren uit gejaagd die
  werken, richting sectoren die dat niet doen, en dat is een deel van de
  verklaring waarom de opbrengst van 35 kaarten (dinsdag, 4 lanes) naar 8
  (zondag, 7 lanes) zakte. De cap telt vanaf nu `drafted`/goedgekeurd, per
  sector én per lane-regio.
- 1.7 (2026-08-31, Azzouz, weekcyclus 30-08): drie dingen. (1) De add-on-regel
  stond fout: "extra taal 150" suggereert 150 per taal, terwijl `ADD_ONS.language`
  in `zevren/lib/offer.ts` 150 is voor DRIE extra talen en de dictionaries dat in
  alle zes talen zo zeggen. John vond het zelf op 29-08 en meldde het in plaats van
  het stil te laten staan; de fout stond ook tweemaal in zijn eigen kopieerklare
  post van 28-08, die daarmee een claim droeg die de site niet waarmaakt. (2)
  Sectie "Wiens daad draagt de datum" toegevoegd, die Sams inboxnotitie van 22-08
  afhandelt: het onderscheid is niet eigen-bron-versus-derde maar daad-van-het-
  bedrijf versus daad-van-de-uitgever. KvK-mutaties, GGD- en gemeentevergunningen
  en vacatures tellen dus wél voor de geen-website-groep; "Updated ‹maand› ‹jaar›"
  op een gids telt niet — dat is de verversingsstempel die 1.5 al afwees, nu met
  de reden erbij zodat hij niet terugkeert. (3) Kopregel stond nog op 1.5 terwijl
  de changelog al op 1.6 stond; rechtgezet.
- 1.6 (2026-08-30, Azzouz, avonddienst): sectie "Twee regels die geen poort
  zijn" toegevoegd. De drie extra lanes van vandaag (E, F, G) leverden samen
  twee kaarten, en bij allebei botste de verificatie op een regel die als poort
  werd gelezen terwijl hij dat niet is: de sectorcap uit `agents/beats.md` en de
  leeftijdsrand van "grofweg 1 tot 6 jaar". Twee lanes hanteerden 2019
  tegengesteld op dezelfde dag, wat betekent dat de regel niet scherp genoeg
  opgeschreven stond. Daarnaast bij "Welke bron een e-mailadres draagt"
  vastgelegd dat een tweede bron pas meetelt als hij het adres zelf draagt.
- 1.5 (2026-08-30, Azzouz): sectie "Een open poort is een bevinding, geen kaart"
  toegevoegd. In lanes A en B van vandaag droegen twee van de vier kaarten een
  poort die de agent zelf niet kon sluiten — beide keren poort (a) — met de
  controle doorgeschoven naar de owner. Beide zijn afgekeurd (Brummel
  Airconditioning: geen gedateerd spoor na aug 2025; Aircogenie: jongste spoor
  sep 2024). De uren die in die twee berichten gingen zitten, waren beter naar
  een extra lane gegaan: eerst de poort, dan de copy. Bij die sectie staat nu
  ook wat wél en niet als gedateerd levensteken telt, omdat drie verschillende
  soorten niet-bewijs vandaag als bewijs werden aangeboden (een gemiddelde
  zonder datum, een erkenningsdatum van 22 maanden oud, en het jaartal in een
  gidsentitel). Verder vastgelegd dat `geen-emailadres.md` corrigeerbaar is:
  lane B draaide de parkering van Brummel terecht om met één gerichte
  zoekactie. Tot slot voor Sam, uit kaart B1: een bewering over de zaak van de
  prospect ("de eerste proefles is bij jou gratis") hoort met bron in de
  kaartvelden, niet pas in de derde alinea van het bericht — deze bleek waar,
  maar dat was toeval en geen verdienste van de kaart.
- 1.4 (2026-08-28, Azzouz): dezelfde dag, twee lanes verder, dezelfde regel
  opnieuw. In lane B en C stond "werk dat u/je zelf kunt aanklikken" in negen van
  de tien berichten, ondanks de mechanische controle die 1.3 vanochtend
  voorschreef. Daarnaast beloofden zeven van de tien een formulier waarin de
  klant een foto uploadt ("een foto van de plek/het dak/de ruimte/de schade") —
  de tweede verboden formulering, die tot vandaag nooit eerder in bulk opdook.
  Beide zaten in de SLOTALINEA en de OPLOSSINGSALINEA, die van kaart naar kaart
  worden overgenomen zonder opnieuw gelezen te worden. Voor Sam: de controle is
  geen herlezing maar een zoekopdracht in de eigen tekst op `aanklikken` en
  `een foto van`, per bestand, vóór het pushen. Wat de slotalinea wél mag zeggen
  bij offertevormig werk: `zevren.nl/concept-bouwer`, waar de bezoeker stijl en
  kleuren kiest en direct een voorbeeld van zijn eigen homepage ziet — volledig
  door de site gedekt.
  Verder kostte de poort "kan deze klant het al?" vandaag opnieuw twee kaarten,
  nu buiten de boekingssector: Saartje Timmermans Fotografie kreeg een
  contactformulier en een prijs aangeboden die allebei al op haar site staan, en
  Photos by Jill kreeg openbare prijzen aangeboden terwijl zij een eigen
  tarievenpagina voert. De poort is dus breder dan boeken alleen: **voordat het
  bericht het lek benoemt, moet vaststaan dat het lek bestaat** — één zoekopdracht
  op het eigen domein (`"domein.nl" prijzen contact`) haalde bij beide de
  weerlegging boven.
- 1.3 (2026-08-28, Azzouz): de verboden formulering "werk dat u zelf kunt
  aanklikken" (verboden sinds 1.1) dook vandaag opnieuw op — in alle vijf
  berichten van lane D (installateurs, Zuid-/Noord-Holland), geschreven
  door dezelfde agent die de regel al kent. De regel stond er dus, maar
  werd niet tegen elke individuele zin gelegd vóór het bericht de kaart in
  ging. Voor Sam: controleer de drie verboden formuleringen hieronder
  mechanisch, zin voor zin, per bericht — niet uit herinnering dat de regel
  bekend is.
- 1.2 (2026-08-26, Azzouz): sectie "Welke bron een e-mailadres draagt"
  toegevoegd. Lane E en lane F kwamen op dezelfde dag tot tegengestelde
  conclusies over adressen uit zoekresultaten; het verschil bleek de vorm van
  de bron te zijn (één bedrijf per pagina versus een samengevatte gidsenpagina)
  en niet de zoekmachine. Daarnaast bij "Wat een bericht nooit mag beweren"
  bevestigd dat "een adres op uw eigen naam" vier van de vijf lane-E-berichten
  raakte en overal is vervangen door "een eigen pagina".
- 1.1 (2026-08-26, Azzouz): register per kaart vastgelegd in plaats van
  altijd "u"; sectie "Wat een bericht nooit mag beweren" toegevoegd met de
  drie formuleringen die in de verificatie van 25 en 26 augustus
  sneuvelden; sectie "De poort die het vaakst kaarten kost" toegevoegd,
  omdat de al-boekt-online-check in twee dagen vijf kaarten kostte
  (Dierenpension Zeeland, Dogdiscipline, Op goede voet by M,
  Hondencentrum Brabant, DogFit).
- 1.0 (2026-08-24): eerste versie, opgesteld uit zevren.nl-data en de
  werkafspraken in CLAUDE.md en agents/.
