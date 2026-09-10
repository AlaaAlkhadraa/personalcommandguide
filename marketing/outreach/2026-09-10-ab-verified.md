# Verificatie 10 september 2026 — lanes A en B

Azzouz, donderdag 10 september 2026, directiveweek 7 t/m 13 september.
Beoordeeld: `marketing/outreach/2026-09-10-a.md` (lane A, Groningen/Friesland/Drenthe)
en `marketing/outreach/2026-09-10-b.md` (lane B, Overijssel/Gelderland/Flevoland).
Lanes C en D worden door een parallelle sessie beoordeeld in
`2026-09-10-cd-verified.md`; ik heb die drie bestanden niet aangeraakt.

**Genummerde kaarten aangeboden: één.** Lane A nul uit 51 beoordeelde dossiers,
lane B één uit 48. De machinale telling van de opzichter klopt met wat er in de
bestanden staat.

**Uitkomst: één kaart goedgekeurd, mét een herschreven onderwerpregel.** De tekst
eronder was juist en is ongewijzigd gebleven; de onderwerpregel sprak het kaartje
tegen dat eronder stond. Zie de eerste bevinding en fundamentregel 1.30.

**Poort (h) — de skillstabellen: allebei echt.** Elk citaat met een regelnummer is
met `grep -n` over het hele bestand nagekeken en alle acht kloppen. Geen holle
tabel, en op beide bestanden staan de niet-ingezette skills eerlijk met hun grond
erbij. Beide diensten tellen.

**Één beperking van mijn eigen verificatie, meteen vooraan, want zij bepaalt hoe
zwaar mijn oordelen wegen.** `WebFetch` is in deze omgeving geblokkeerd voor
`werkspot.nl`, `jardinahoveniers.nl` en `hovenier.website` — ik kan dus geen enkele
pagina zelf openen en draai op precies dezelfde zoekroute als Sam. Waar ik hieronder
"onafhankelijk gereproduceerd" schrijf, betekent dat: een ánders geformuleerde
zoekopdracht gaf hetzelfde terug, niet dat ik de pagina heb gezien. Dat is de reden
dat 1.20(a) en 1.22 bestaan en het is de reden dat ik ze vandaag twee keer tegen
mijn eigen wens in heb toegepast.

---

## 1. Jardina Hoveniers — Nijmegen

GOEDGEKEURD, met één correctie: de onderwerpregel is vervangen. De tekst is
ongewijzigd.

- **Lane:** B · **Sector:** hovenier / groenonderhoud
- **Pakket:** 299 · **Hoek:** review-bewijs · **Register:** u
- **Adres:** Zwanenveld 2119, 6538 PJ Nijmegen · **Telefoon:** +31 6 84 66 97 33
- **E-mail:** `info@jardinahoveniers.nl`
- **UTM:** `hoveniers-w37` · **Verzendtermijn:** ongeveer twee weken vanaf 10-09

**Poort (a) — DICHT.** Twee Werkspot-reviews met leesbare datum: 21-08-2026
(vijf sterren, Arnhem, "Snel, netjes en erg meedenkend") en 23-08-2026 (vijf
sterren, Wijchen). Sam draaide twee onafhankelijk geformuleerde ronden; ik heb er
een derde bij gedraaid met een andere formulering en kreeg dezelfde datum bij
dezelfde tekst bij dezelfde plaats bij hetzelfde bedrijf. Geen afwijkende datum bij
dezelfde tekst, dus 1.22 kent geen oudste die wint. Drie weken oud. De klussen zijn
tuinwerk en vallen dus binnen zijn eigen pakket — de Gomar-val vuurt hier niet.

**Poort (b) — DICHT.** De exacte-tekenreeksronde op `"info@jardinahoveniers.nl"`
(1.28) geeft bij mij als eerste resultaat zijn **eigen** `/contact`-pagina, daarna
zijn Werkspot-profiel en zijn eenbedrijfspagina op `hovenier.website`. Drie dragers
waarvan één het eigen domein: "official business page" in de zin van
`prospecting` SKILL.md:68. Geen patroon geraden, geen afkapping.

**Poort (c) — DICHT.** KvK 98207504, vennootschap onder firma, vestigingsdatum
01-09-2025, Zwanenveld 2119, twee werkzame personen — bij mij in één ronde
gereproduceerd. Eén jaar en negen dagen: de onderrand van het venster, maar
erbinnen. 1.18(b) is juist toegepast: een `.website`-gids levert de
VESTIGINGSdatum, dus de zaak kan ouder zijn maar niet jonger, en beide kanten
blijven binnen 1 tot 6 jaar. Het bericht claimt nergens een leeftijd, en dat is de
juiste keuze.

**Poort (d) — DICHT, en het lek is positief vastgesteld.** `site:jardinahoveniers.nl`
geeft bij mij exact dezelfde vier eigen URL's als bij Sam: `/`, `/about`, `/contact`
en `/empty` ("Een passende offerte op basis van uw wensen"). Geen projecten-,
portfolio-, referentie- of reviewpagina. Vierenvijftig beoordelingen op Werkspot en
op zijn eigen vier pagina's geen tuin en geen klantwoord — dat is het lek zelf, bij
een vak dat op zicht wordt gegund.

**Claimcontrole.** "299 euro eenmalig, exclusief btw" staat woordelijk in
`zevren/lib/local/sectors.ts` regel 221 en het bedrag in `zevren/lib/offer.ts`
regel 22 (`{ key: "starter", price: 299, needs: "new-website" }`). "Groot en scherp
in beeld" staat op regel 225 van dezelfde sectorpagina. De demobelofte is correct
vermeden: `slug: "hoveniers"` draagt **geen** `demoSlug` — nagekeken — en het
bericht beschrijft de conceptbouwerroute die er werkelijk staat, woordelijk in lijn
met het `proof`-veld van die pagina. Dat is 1.31 goed toegepast.

**Poort (e) — DICHT.** `contacted.md`, `bellijst.md` en `geen-emailadres.md` dragen
op deze naam uitsluitend Sams eigen rij van vandaag. Geen eerdere rij, geen
omkering te schrijven.

**Poort (f) — DICHT.** V.o.f. van één jaar, twee vennoten, 54 beoordelingen, 4,7,
klussen in Nijmegen, Wijchen, Arnhem en Duiven — dus buiten de eigen stad. Dat is
groeifase op alle vier de signalen van de order van 24 augustus. Klantenstopronde
gedraaid vóór de adresjacht, niets gevonden.

**Poort (g) — GEFAALD op de aangeboden regel, gerepareerd in de verzendklare.**
`54 keer vijf sterren op Werkspot` draagt het gecheckte detail op teken 1 en haalt
de swipe-test — maar hij is onwaar, en het kaartje eronder bewijst dat zelf: 4,7
uit 54 betekent per definitie dat niet alle 54 vijf sterren zijn, en de bron noemt
zelfs een ontevreden klant. Zie de eerste bevinding. De vervangende regel draagt
twee van zijn eigen getallen, allebei waar, allebei op teken 4.

**Poort (h) — DICHT.** Zie de opmerking bovenaan.

**Overtuigingskracht — de zeven eisen van de staande order van 25 augustus avond,
alle zeven gehaald.** Het lek staat in de opdracht die naar een ander gaat en niet
in techniek. Het bewijs komt volledig uit zijn eigen zaak (4,7, 54, de review van
21 augustus, zijn eigen vier pagina's). Eén beeld: de man in Wijchen die 's avonds
zijn naam intypt, en dat beeld staat vóór het aanbod. De demo is de bewijslast en
staat er één keer, met een concrete uitnodiging. De prijs staat zonder
verontschuldiging en zonder offertegesprek. Geen schaarste, geen haast, geen "wij
zijn klein". 219 woorden zonder het handtekeningblok, geteld — binnen 1.23.
Eén vraag, één vraagteken, en de belregel ernaast als tweede weg en niet als tweede
vraag. Handtekening exact, telefoonnummer aanwezig.

**Onderwerp** (25 tekens, geteld met `printf | wc -c`)

```
Uw 4,7 uit 54 op Werkspot
```

**Bericht** (219 woorden zonder het handtekeningblok, ongewijzigd overgenomen van
lane B)

```
Goedemiddag,

Iemand in Wijchen krijgt uw naam door van de buren. 's Avonds pakt hij zijn
telefoon en typt Jardina Hoveniers in. Op dat moment beslist hij of hij belt.

Hij komt op uw site. Daar staat wie u bent, wat u doet en hoe hij een offerte
aanvraagt. Wat er niet staat, is een tuin die u heeft aangelegd, of een woord
van de 54 mensen die u al beoordeelden. Vier pagina's, en op geen ervan iets om
naar te kijken.

Dat bewijs bestaat wel, alleen ligt het ergens anders. Op Werkspot staat u op
4,7 uit 54, en de beoordeling van 21 augustus vat het samen: snel, netjes en
erg meedenkend. Die zin doet zijn werk op een pagina die niet van u is.

Wat ik bouw is de plek waar dat wel bij elkaar staat: uw opgeleverde tuinen
groot en scherp in beeld, daaronder wat uw klanten schreven, en een formulier
waarin iemand kwijt kan om welke tuin het gaat. Op de hovenierspagina kiest u
zelf stijl en kleuren en ziet u direct een voorbeeld van uw eigen homepage:
zevren.nl/website-voor/hoveniers?utm_source=outreach&utm_medium=email&utm_campaign=hoveniers-w37

Zo'n site is 299 euro eenmalig, exclusief btw. Die prijs staat gewoon op die
pagina.

Heeft u foto's liggen van de laatste tuin die u heeft opgeleverd? Bellen mag
ook, dat gaat vaak sneller dan mailen.

Met vriendelijke groet,
Alaa
ZEVREN, Maastricht
06-30958710 · zevren.nl
```

**Owner check, één regel:** open `jardinahoveniers.nl` en kijk of er inmiddels wél
een pagina met aangelegde tuinen of met klantoordelen op staat. Zo ja: niet
versturen. Verstuur je 's ochtends, maak dan van "Goedemiddag" een "Goedemorgen".

---

## Bevinding — de onderwerpregel van de enige kaart sprak het kaartje eronder tegen

Dit is de duurste vondst van de dag en zij zat in de regel die als eerste gelezen
wordt.

Lane B bood aan: `54 keer vijf sterren op Werkspot`. Het kaartje eronder meldt
**4,7 uit 54**, en Sam schrijft dat cijfer ook zo in zijn eigen berichttekst. Een
gemiddelde van 4,7 betekent dat niet alle vierenvijftig beoordelingen vijf sterren
zijn — mijn eigen ronde op zijn profiel noemt bovendien uitdrukkelijk één klant die
vond dat het werk zwaarder uitpakte dan geraamd. De subject was dus onwaar, hij
werd door zijn eigen kaartje weerlegd, en hij ging naar de ene persoon op aarde die
zijn eigen score uit zijn hoofd kent.

**Waarom geen enkele poort hem tegenhield.** Poort (g) vraagt of de subject een
concreet, *gecontroleerd* detail draagt. Dat is een vraag naar herkomst. Het getal
54 kwam werkelijk uit het onderzoek en stond werkelijk in het kaartje — alleen niet
met de betekenis die de subject eraan gaf. Poort (d) toetst de claims in het
bericht, en niemand had opgeschreven dat de onderwerpregel daar ook onder valt.
Vastgelegd als **fundamentregel 1.30**.

**Waarom de kaart toch doorgaat.** Het lek is echt, het bewijs is van hemzelf, de
tekst is juist tot in de bestandsverwijzingen, en de fout zit in vijf woorden die ik
kan vervangen zonder één zin van het bericht aan te raken. Een kaart wegen op zijn
tekst en hem dan op zijn kop afkeuren zou het werk van een hele dienst weggooien
voor iets wat in tien seconden te herstellen is.

**Wat er nu staat en waarom.** `Uw 4,7 uit 54 op Werkspot` — 25 tekens, twee eigen
getallen, allebei waar, allebei binnen de eerste vijfentwintig tekens. De
verwijdertoets van `cold-email` (SKILL.md:41) haalt hij even goed als het origineel:
haal "4,7", "54" en "Werkspot" weg en er blijft niets over. Hij zegt niets over wat
hij fout doet, dus hij opent niet met kritiek — de fout waarop deze lane op 09-09
zelf al viel. En de swipe-test om 21:40 wordt eerder sterker dan zwakker: een
hovenier die zijn exacte gemiddelde én zijn exacte aantal in een onderwerpregel ziet
staan, weet in één seconde dat iemand op zijn profiel heeft gekeken. Het aantal
alleen kan nog toeval zijn; het gemiddelde erbij kan dat niet.

Sams afvaller `Vier pagina's en 54 reviews` blijft terecht afgevallen, en zijn
oordeel over `Marcel uit Arnhem, 21 augustus` is het beste dat vandaag in beide
bestanden staat: dat was de scherpste regel van de dag en hij liet hem liggen omdat
hij de voornaam van een particuliere klant in een koude onderwerpregel zou zetten.
Dat is de privacyregel van de owner die zichzelf handhaaft zonder dat ik eraan te
pas kom.

## Bevinding — de verminking van een skill is een `$n`-invulling van je eigen argumenten, en dat is nu bewezen in plaats van vermoed

Sinds 09-09 staat 1.26 in het fundament: een verminkte skillweergave is geen
bestandsdefect. Wat er niet stond is *waarom*, en daardoor bleef het een
onverklaarbaar verschijnsel dat elke lezer opnieuw laat twijfelen. Vandaag is het
mechanisme rond.

**Wat ik zag.** Ik riep `marketing-psychology` aan met de argumenten *"Toets of drie
koude e-mails werkelijk iets losmaken: …"*. Regel 154 kwam terug als "The jump from
**of** to **Toets** is bigger than **drie** to **of**" en regel 204 als
"**koude**/day". Dat zijn woord voor woord de eerste vier woorden van mijn eigen
argumentenreeks, op de plaatsen waar op schijf `$1`, `$0`, `$2` en `$3` staan.

**De toets.** Ik heb daarop vóóraf opgeschreven wat er zou komen te staan bij de
argumenten `ALFA BRAVO CHARLIE DELTA ECHO`, en toen die aanroep gedaan. Voorspeld:
"The jump from BRAVO to ALFA is bigger than CHARLIE to BRAVO" en "DELTA/day".
Geserveerd: exact dat. `$90`, `$30`, `$100` en `$80` bleven in beide aanroepen
onaangeroerd, want dat volgnummer bestaat niet.

**Wat dat verklaart, en het is alles wat openstond.** Waarom lane A en ik op 09-09
dezelfde drie regels verminkt zagen mét verschillende vervangingen: verschillende
argumentenreeksen. Waarom lane A ze vandaag ongeschonden zag en dat eerlijk meldde:
hij riep de skill zonder bruikbare argumenten aan, en dan vuurt het gebrek niet. En
waarom het altijd juist de bedragen zijn: alleen daar staat een dollarteken.

**De consequentie is één handeling en zij was er al.** Citeer nooit uit de
geserveerde weergave, ook niet als zij er ongeschonden uitziet, maar haal elk citaat
met `grep -n` van schijf. Lane A kwam vandaag op eigen kracht bij precies die regel
uit. Vastgelegd als **fundamentregel 1.29**, en het is de eerste regel in dat
document die op een voorspelling is aangenomen in plaats van op een telling.

## Bevinding — lane A heeft gelijk over het citaat van gisteren, en de fout was van mij

Lane A draagt zijn zevende bevinding voorzichtig voor omdat zij een verdict van
gisteren raakt. Die voorzichtigheid was niet nodig: hij heeft gelijk, en ik heb het
nagekeken met `grep -n` over het hele bestand.

`prospecting` voert op **regel 68** `- **High**: confirmed by at least two
independent sources or official business page` en op **regel 200**
`- [ ] Confidence levels honest — "High" requires 2 independent sources, not just
two of your own searches`. De woorden "not just two of your own searches" zijn dus
geen aanscherping van Sam. Mijn verificatie van 09-09 schreef dat ze dat wel waren,
en op die grond is 1.27 mede aangenomen. Erger: de parallelle C+D-sessie citeerde
regel 200 diezelfde dag wél woordelijk in het fundament, zodat het document zichzelf
een dag lang tegensprak zonder dat iemand het zag.

**Wat blijft staan.** 1.27 zelf, en lane A zegt zelf waarom: het aangeboden citaat
was `"High confidence requires two independent sources, not just two of your own
searches"`, terwijl regel 200 `"High" requires 2 independent sources` voert. Dat is
een citaat dat twee regels aan elkaar stikt en er onderweg woorden in verandert, en
dat is op de maat van 1.27 geen citaat — ook niet als de gedachte erin klopt. Wat
vervalt is uitsluitend de bewering dat Sam de tweede helft verzon.

De correctie staat in `.agents/product-marketing.md` bij 1.27, met de reden erbij,
zodat niemand hem opnieuw hoeft te vinden.

**Nagekomen, en het maakt de zaak sterker: de parallelle C+D-sessie is vandaag
onafhankelijk op precies dezelfde fout uitgekomen** en schrijft hem in
`2026-09-10-cd-verified.md` onder de kop "1.27 is op verkeerd bewijs geschreven, en
de fout is van mij". Twee verificatiesessies, twee lanesets, één conclusie, en
allebei komen we uit op dezelfde werkregel: `grep -n` over het hele bestand in
plaats van de regel waar je hem verwacht. C+D draagt hem terecht als kandidaat voor
zondag voor omdat zij het fundament vandaag niet wijzigen; **ik heb hem al
doorgevoerd**, dus voor het weekrapport is dit punt afgehandeld en geen openstaande
kandidaat meer. Dat is precies de dubbeling die het gescheiden nummerbereik moet
voorkomen, en zij is hier voorkomen. Lane A's eigen conclusie — een citaat
zoeken met `grep -n` over het hele bestand en niet op de regel waar je hem verwacht
— is de goede en zij is nu de regel.

## Bevinding — Marcel Hof en Trimsalon Leona blijven bevindingen, en ik heb het zelf geprobeerd

Mijn opdracht van vandaag vraagt uitdrukkelijk of er onder de bevindingen een
dossier zit dat met een geverifieerd openbaar e-mailadres en een gedateerd
bedrijfsfeit alsnog een verzendklare kaart kan worden, met lane A's tweede dossier
op een open poort voorop. Ik heb het geprobeerd, met eigen ronden, en het antwoord
is nee.

**Schoorsteenveger Marcel Hof (Oosterwolde).** Twee eigen ronden erbij, dus de
stand is negen. Gezocht op zijn Trustpilot-eenbedrijfspagina, op zijn
Trustoo-eenbedrijfspagina en op een gedateerd seizoensspoor op zijn eigen domein.
Geen enkele ronde gaf datum, tekst en bedrijf in één resultaat. Wat ik wél kreeg is
de bekende val: de samenvattende alinea bood opnieuw reviewteksten aan zonder datum
en de Trustoo-9,2 zonder drager, precies zoals lane A hem beschrijft en terecht
laat liggen. **Poort (a) blijft open. Geen kaart.**

**Wat ik er wél aan toevoeg, en het staat niet in lane A's dossier.** Zijn
Trustpilot-pagina `nl.trustpilot.com/review/schoorsteenvegerhofjr.nl` voert een
**TrustScore van 3,7 met één review**. Dat weerspreekt zijn kaartje niet — het
bericht noemt geen enkel cijfer, precies zoals het hoort — maar het raakt wel de
kern van de pitch. De vierde alinea verkoopt "de beoordelingen die je al verzameld
hebt" naar zijn eigen site, en één van de vier platforms waar die op staan zet hem
op een 3,7. Dat is een feit dat de owner moet kennen vóór hij op verzenden drukt,
en het is een reden om bij dit dossier eerder op Trustoo en op
`schoorsteenvegergids.nl` te wijzen dan op "vier sites". Voor een volgende lane: de
verwijzing naar vier beoordelingsplatforms in de derde alinea is waar, maar niet
alle vier zeggen hetzelfde.

**Trimsalon Leona (Assen).** Twee eigen ronden erbij. Haar Stagemarkt-profiel
bestaat op de URL die lane A noemt, maar de erkenningsdatum komt in geen resultaat
naar boven; op haar Facebookpagina kwam geen gedateerde post terug. **Poort (a)
blijft open. Geen kaart.** Lane A's besluit om hier géén tekst klaar te leggen is
juist en goed beargumenteerd: bij Marcel Hof is de invalshoek een vondst die een
volgende lane niet hoeft over te doen, bij Leona is de vorm standaard en is juist
het ontbrekende detail wat de tekst persoonlijk zou maken.

**Hoorn en Hoevens (Hengelo), lane B.** Zie de volgende bevinding — die is de
moeite waard.

## Bevinding — bij Hoorn en Hoevens gaf mijn zesde ronde twee gedateerde reviews, en de bevestigingsronde nam ze terug

Dit is 1.22 in werking, tegen mijn eigen wens in, en ik schrijf hem op omdat het
precies de val is waarvoor de regel geschreven is.

Lane B draaide vier ronden op poort (a) en meldde: geen enkele ronde gaf datum,
tekst en bedrijf in één resultaat. Ik draaide een vijfde, met de formulering die
lane B zelf aanwijst als de goedkoopste route (het Werkspot-profiel mét de
plaatsnaam erbij), en kreeg **twee gedateerde reviews met tekst**: 02-04-2026
"Fijne man en super netjes afgeleverd!" en 13-04-2026 "Vriendelijk, netjes en goeie
kwaliteit!". Allebei ruim binnen de twaalf maanden. Op dat moment lag er een tweede
goedgekeurde kaart van vandaag, met de tekst al klaargelegd.

**De bevestigingsronde reproduceerde geen van beide.** Een ronde op de reviewtekst
zelf plus de profiel-URL gaf het profiel wél terug en de review niet. De datums
staan dus uitsluitend in de samenvattende alinea, en dat is 1.20(a): geen bron. Per
1.22 gaat de poort daarmee niet dicht.

**Poort (a) blijft open. Geen kaart.** Lane B's oordeel houdt stand na vijf ronden
in plaats van vier, en dat is een sterker resultaat voor hem dan wanneer ik niets
had gevonden. Het verschil met Jardina is precies waar 1.22 om vraagt en het is
zichtbaar: daar reproduceerde de derde, anders geformuleerde ronde dezelfde datum
bij dezelfde tekst bij dezelfde plaats; hier niet.

**Wat een volgende dienst hieraan heeft.** De vindplaats bestaat en de reviews
bestaan bijna zeker ook — wat ontbreekt is een resultaat waarin datum en tekst
samen staan. Dat is één ronde waard en niet meer dan één: zoek op de reviewtekst
als exacte tekenreeks samen met de bedrijfsnaam. Geeft die het profiel terug zonder
de review, dan is het spoor er niet en gaat dit dossier naar de sluiting.

## Bevinding — De Lapperij staat niet in twee plaatsen, maar één keer op twee gidspagina's

Lane A meldt terug dat het ledger Glazenwas en Schoonmaak De Lapperij in **Assen**
zet en het lanebestand van gisteren in **Borger**, en dat hij de bron van de tweede
niet heeft. Ik heb het in één ronde opgelost, en de uitkomst is beter dan "een van
beide is fout".

`alleglazenwassers.nl` voert dit bedrijf **twee keer**, op
`.../de-lapperij-assen-marsdijk-000029824133/` en op
`.../de-lapperij-borger-borger-000029824133/`. **Hetzelfde vestigingsnummer,
000029824133, in allebei de URL's.** Dat is per 1.35 één vestiging, en dus één
onderneming die de gids op twee plaatsnamen uitsplitst. Geen van beide bestanden
heeft ongelijk; ze lazen twee pagina's van dezelfde zaak.

**Dat is de derde drager op één dag voor iets wat lane B vandaag zelf opschreef.**
Lane B vond exact dezelfde vorm bij Evers Cleaning Deventer (000047650524 op
"Rivierenwijk En Bergweide" én "Voorstad/Adelaarstraat") en bij Marco de Graaf
Dienstverlening in Lelystad (000050013319 op "Galjoen 04" én "Stadshart"). Wie deze
gids op wijk of op plaats telt, telt bedrijven dubbel — en bij De Lapperij kostte
dat twee lanes een tegenspraak die er niet was.

De samenvattende alinea bood mij daarbij nog twee verschillende KvK-nummers aan
voor de twee pagina's (95298940 en 60646411). Die heb ik niet overgenomen: het is
1.20(a), en het vestigingsnummer in de URL's zegt het tegendeel. Het is een aardige
illustratie van 1.35 — het nummer in de URL is een gratis tegenspraaktoets, en hij
won hier van de alinea.

## Bevinding — het jaartal van Feline Care in het ledger spreekt zijn eigen KvK-nummer tegen

Lane A's derde terugmelding klopt. De ledgerrij van 04-09 noteert "opgericht april
2021"; het KvK-nummer dat lane A vandaag terugkreeg is 60803827, en ik heb dat
nummer in een eigen ronde bevestigd bij dit bedrijf op deze naam en dit adres. Een
60-reeks hoort bij 2014.

Voor de uitkomst maakt het niets uit — die rij staat op `not fit - boekt al online`
en dat is de hardere grond, zoals lane A zelf zegt. Maar een fout jaartal in het
ledger zet een volgende lane op het verkeerde been op precies de poort die deze week
het vaakst kaarten kost. De rij is bijgewerkt met de tegenspraak erin, niet met een
nieuw jaartal: ik heb geen eigen over-onspagina gezien en 1.16(b) zegt dat die het
laatste woord heeft.

## Bevinding — lane B draaide poort (e) als fase en viel erop, lane A draaide hem als controle en ving er negen

Beide lanes kregen dezelfde order en de uitkomst staat naast elkaar in één dienst.

Lane A draaide poort (e) in vier bulkronden over `contacted.md`, `bellijst.md` én
`geen-emailadres.md` vóór het werk en ving er negen dossiers mee af vóór er één
adresronde in zat — waaronder Stark Stuc, de naam waarvoor de vijfde order van de
week geschreven is. Nul ronden verspild.

Lane B draaide hem in twee batches over 26 en 33 namen, en drie namen kwamen ná die
batches de trechter in: Hezeman Cleaning Service, Hondenpension Entré en
Dierenpension Welgelegen. Alle drie stonden al in het ledger. Hezeman kostte vijf
ronden die woordelijk reproduceerden wat deze lane op 07-09 zelf had opgeschreven.

**Sam meldt het zelf, in zijn eerste alinea, als een fout van hemzelf, en zijn
diagnose is beter dan de fout groot is.** De namenlijst is niet af aan het begin van
de dienst; elke sweep voegt namen toe, en juist de late namen dragen de haast. Een
batchcontrole lekt dus per definitie. Zijn voorstel — de ronde draait op de naam op
het moment dat de naam de trechter in gaat — is juist, kost één `grep` en kan geen
goede kaart doden.

**Ik neem hem niet op als fundamentregel, en de reden is administratief en niet
inhoudelijk:** mijn reeks 1.22 t/m 1.30 is met 1.29 en 1.30 vol. Hij gaat als
kandidaatregel mee naar het weekrapport van zondag, met de tekst hieronder, en
lane B mag hem intussen gewoon toepassen — een werkwijze die niets kost heeft geen
fundamentnummer nodig om vandaag al gedraaid te worden.

## Bevinding — drie kandidaatregels voor zondag, omdat mijn reeks vol is

Mijn opdracht schrijft voor dat ik bij een volle reeks géén nieuwe regel schrijf
maar de kandidaattekst hier neerleg. Dat zijn er drie, en alle drie zijn ze het
werk van Sam.

**Kandidaat 1 — het vestigingsnummer scheidt twee handelsnamen even hard als het ze
verbindt (lane B, order van gisteren uitgevoerd).** Voorgestelde tekst: *bij twee
handelsnamen in dezelfde streek en hetzelfde vak is het twaalfcijferige
vestigingsnummer de beslisser — hetzelfde nummer betekent één onderneming,
verschillende nummers betekenen twee, en de titel van een zoekresultaat betekent
niets.* Dragers: DeHult / Turtle SoftWash / SoftWash Vechtdal op 09-09 (verbinder,
drie kaarten voor één eigenaar afgewend), Hezeman Cleaning Service 000051943476
tegen Glazenwasserij T. Hezeman 000006810969 in Apeldoorn op 10-09 (scheider, één
plaats, één achternaam, één vak), en De Lapperij vandaag door mij (verbinder, twee
plaatsnamen). Lane B levert er zelf de begrenzing bij en die hoort in de regel: bij
Boswijk Hoveniers voert één nummer twee plaatsnamen én twee rubrieken, dus het
nummer bewijst welke vestiging het is en niets over hoe zij heet of wat zij doet.
Dat is 1.35 in zijn eigen woorden — een tegenspraaktoets, nooit een poort. **Mijn
oordeel: rijp, en de order van gisteren is precies uitgevoerd zoals gevraagd.**

**Kandidaat 2 — de poort-(e)-ronde is een controle per naam en geen fase.** Zie de
vorige bevinding. Drie gevallen op één dag, één ervan vijf ronden duur, kosten
eenzijdig in de zin van 1.31 en 1.34. **Mijn oordeel: rijp.**

**Kandidaat 3 — de KvK-in-de-URL-zeef op `hoveniers.online` en `schilder.site`
(lane A).** Achttien leeftijden in vier ronden waar een stadszoekopdracht er vier
tot vijf per leeftijd kost, en immuun voor 1.20(a) en 1.36 omdat de leeftijd in de
URL-titel zelf staat. Lane A levert de twee grenzen er zelf bij en ze zijn goed:
het nummer is een ondergrens en geen leeftijd (Bernd Schulte, KvK 77855213 naast een
eigen `/historie` die in 1975 begint), en een hoog nummer sluit niets. **Mijn
oordeel: rijp maar niet voor een dagverificatie.** Hij verandert de jaagvolgorde van
1.20(b) en raakt daarmee twee onbeantwoorde beslispunten van de owner; 1.19 legt
vast dat zo'n besluit bij het weekrapport hoort. Dat is dezelfde grond waarop ik op
08-09 lane A's paginateller-zeef heb doorgeschoven, en die twee horen zondag samen
behandeld te worden.

## Bevinding — de orders van gisteren, afgevinkt

**Lane A — vijf van vijf uitgevoerd.**

| Order | Uitkomst |
|---|---|
| Lawand één Instagramronde | Gedraaid in twee formuleringen die samen die ene ronde zijn. Geen post met leesbare datum, geen post-URL met ID, dus de 1.38-route kon niet starten. Geen letter aan zijn tekst veranderd, zoals opgedragen. Stand: zeven ronden |
| Geen-websitegroep: acht beoordeelde dossiers, geen belregeldoel | Acht beoordeeld, twee belregels, en hij meldt dat aantal uitdrukkelijk als uitkomst en niet als gemist doel. Precies de vorm die de order vroeg |
| Tien vestigingsnummernamen afgemaakt, één KvK-ronde per naam | Tien afgemaakt, tien van tien buiten het venster, met KvK en bron per naam in een tabel |
| Citaten per 1.27 | Gehaald, en scherper dan gevraagd: zijn eigen aanscherping op `prospecting` staat buiten de aanhalingstekens en op zijn naam |
| Defectmelding per 1.26 | Gehaald. Skill aangeroepen, drie passages ongeschonden, en dat eerlijk gemeld in plaats van te zwijgen |

Ook de gedeelde orders staan: poort (e) vóór het werk over drie bestanden (vier
bulkronden, negen afvangsten), de exacte-tekenreeksronde van 1.28 op elk adres, de
UTM-slug (`schoorsteenvegers-w37`, correct beredeneerd omdat er geen sectorpagina
bestaat en 1.25 dan de sectornaam voorschrijft), de woordtelling (208, door mij
nageteld) en één vraag.

**Het beste stuk werk van lane A vandaag** is niet een van de vijf orders maar de
tweede bevinding: tien van tien voorspellingen klopten en hij draagt het nadrukkelijk
**niet** voor als grond om de ronde over te slaan, met Bonnema als bewijs — het lage
nummer voorspelde "oud", maar wat het dossier werkelijk sloot was zijn eigen
over-onspagina, en die leverde er een tweede grond bij (bewust klein blijven, geen
personeel, werkgebied wegens drukte beperkt) die geen enkel nummer had kunnen geven.
Dat is een agent die tegen zijn eigen belang in redeneert, en het is de reden dat ik
zijn poortuitkomsten op hun woord lees.

**Lane B — vier van vijf uitgevoerd, één gefaald en zelf gemeld.**

| Order | Uitkomst |
|---|---|
| RS Hovenier één ronde mét lookalike-waarschuwing en 1.31-correctie | Ronde gedraaid, lookalike in een nieuwe gedaante gevonden (een derde Roel, op de Facebookpagina van Van den Berg Hoveniers en Montage). De 1.31-correctie is **niet** uitgevoerd, met opzet en met de juiste grond: de order zegt "gaat de poort dicht, dan eerst de correctie", en de poort gaat niet dicht. De vervangende zin ligt klaar en is door mij tegen `sectors.ts` gelegd — hij klopt woordelijk. Goed gehandeld |
| Back to Eden gelaten | Gehaald. Nul vermeldingen in het bestand |
| Vestigingsnummer-sleutel op een tweede geval | Gehaald, en het tweede geval wijst de andere kant op, wat de sleutel sterker maakt. Zie kandidaat 1 |
| `## Sectorminima`-tabel | Aanwezig, vijf sectoren, met de leeggelopen stukadoorshelft in één regel gemeld zoals de directives vragen |
| Geen kaartrij met nul in de tekorttabel | Gehaald, in allebei de bestanden |
| Poort (e) vóór het werk | **Gefaald**, en door Sam zelf in zijn eerste alinea gemeld met de diagnose erbij. Zie de bevinding hierboven |

De overige gedeelde orders staan: 1.28 op elk adres (en hij liet er twee kaarten op
sneuvelen), de UTM-slug (`hoveniers-w37`, nagekeken tegen `slug: "hoveniers"`), de
woordtelling (219, door mij nageteld) en één vraag.

**Het beste stuk werk van lane B vandaag** is de `site:`-lekronde die twee dossiers
tegenhield die op alle andere poorten dicht stonden — WP Hoveniers met tien eigen
pagina's waaronder zes regiopagina's, en Hezeman met een `/galerij/` die "Resultaten"
heet. Dat zijn twee kaarten die een ondernemer zouden vertellen dat hij mist wat hij
al heeft, en dat is volgens het fundament de mail die het adres verbrandt. Sam
noteert het zelf als winst en niet als verlies, en dat is de juiste boekhouding.

## Bevinding — beide lanes haalden veertig dossiers en de sectorminima, en het tekort staat in de korte vaste vorm

| | Lane A | Lane B |
|---|---|---|
| Volledig beoordeelde dossiers | 51 | 48 |
| Gevraagd | 40 | 40 |
| Sectorminima | vijf sectoren, alle vijf gehaald of ruim overschreden | vijf sectoren, alle vijf gehaald |
| Kaarten | 0 | 1 |
| `## Tekort van de dag` in de vorm van de directives | ja | ja |
| Bindende poort | (c) te lang gevestigd, 31 van 51 | (a) geen gedateerd spoor, 5 van 6 kaartrijpe dossiers |

Allebei ruim boven de veertig, allebei met de tabel en zonder de honderden regels
verantwoording die de directives hebben afgeschaft. De geen-websitegroep haalde in
beide lanes het quotum van acht en leverde samen twee harde belregels plus twee met
een waarschuwing erbij — precies zoals de order zegt is dat de uitkomst die gemeld
wordt en niet het doel dat gehaald moet worden.

**Eén kanttekening bij de telling van lane B, en zij is in zijn voordeel.** Hij
schrijft "negenenveertig rijen, achtenveertig bedrijven" en legt uit waarom: nummer
7 en 8 dragen dezelfde achternaam en plaats maar zijn twee ondernemingen, gescheiden
op het vestigingsnummer. Dat is de eerlijke telling en hij noemt haar uit zichzelf.

**Het tekort zelf.** Gevraagd 30 over vier lanes, geleverd door A+B: één kaart. Ik
vul niets op en ik keur niets soepeler; E/F/G blijven opgeschort. De bindende poort
verschilt per lane en dat is op zichzelf informatie: in lane A valt de trechter op
leeftijd (31 van 51) en in lane B valt het bórd op poort (a) — vijf van de zes
dossiers die alle andere poorten haalden, stranden op een gedateerd spoor. Vier van
die vijf hebben een hard e-mailadres en een vastgesteld lek. Dat is de duurste
plaats waar een dienst kan stranden, want al het werk is dan al gedaan.

---

## Orders voor de eerstvolgende dienst

### Lane A

1. **Marcel Hof: één ronde, en dan is het genoeg.** Zoek de reviewtekst als exacte
   tekenreeks samen met "Hof" en "Oosterwolde", op Trustoo of Trustpilot. Geeft die
   het profiel terug zonder de review erbij, dan is poort (a) er niet en gaat het
   dossier zondag mee ter sluiting, net als Lawand, Kanninga en Gomar. Negen ronden
   is de grens, niet het begin.
2. **Zet in het kaartje van Marcel Hof de Trustpilot-3,7 erbij.** Zie mijn
   bevinding. Het bericht wordt er niet onwaar van, maar de owner moet weten dat
   één van de vier platforms hem op een 3,7 zet vóór hij een mail verstuurt die
   "de beoordelingen die je al verzameld hebt" verkoopt.
3. **Trimsalon Leona: één ronde op de erkenningsdatum via SBB in plaats van via
   Stagemarkt**, en anders niets. Het profiel bestaat, de datum komt niet in het
   resultaat. Lukt dat niet, dan blijft het een bevinding en schrijf je er geen
   tekst voor — je eigen redenering daarover was juist.
4. **De KvK-in-de-URL-zeef mag je gewoon blijven draaien**, hij kost niets. Maar
   draag hem niet opnieuw voor: hij ligt bij het weekrapport, samen met je
   paginateller-zeef, en daar hoort hij.
5. **De tien resterende vestigingsnummernamen afmaken**, één KvK-ronde per naam,
   zelfde vorm als vandaag. Plus de vier die je vandaag niet als dossier telde
   (Mollema, Hoveniersbedrijf T&D, Harrie Boerhof, Groenmaat).
6. **Blijf citeren met `grep -n` over het hele bestand.** Je hebt daar vandaag
   zelfstandig de goede regel voor bedacht en zij staat nu als 1.29 in het
   fundament, met de oorzaak erbij. Lees die passage één keer: hij verklaart ook
   waarom je vandaag géén defect zag.

### Lane B

1. **Poort (e) draait vanaf nu op de naam, op het moment dat de naam de trechter in
   gaat.** Je eigen voorstel, en je mag het toepassen zonder op het weekrapport te
   wachten. Draai hem ook opnieuw over elke naam die ná een batch binnenkomt.
2. **Hoorn en Hoevens: één ronde, exact deze.** Zoek de reviewtekst als exacte
   tekenreeks samen met de bedrijfsnaam. Mijn vijfde ronde gaf twee gedateerde
   reviews (02-04-2026 en 13-04-2026) die de bevestigingsronde niet reproduceerde;
   dat is 1.20(a) en de poort blijft dus dicht. Reproduceert jouw ronde ze wél, dan
   is poort (a) dicht, ligt je tekst er al en is het een kaart. Reproduceert hij ze
   niet, dan gaat het dossier zondag mee ter sluiting.
3. **RS Hovenier gaat zondag ter sluiting mee, met jouw voorstel.** Draai er geen
   negende ronde in. De 1.31-vervangzin die je hebt klaargelegd is door mij tegen
   `sectors.ts` gelegd en klopt woordelijk; hij blijft klaarliggen.
4. **Atlas Hoveniers eerst afmaken vóór er een ronde in poort (a) gaat.** Je hebt
   zelf de goede volgorde opgeschreven: het tweede domein `atlashoveniers.nl` op
   dezelfde handelsnaam moet eerst worden opgelost, want een projectenpagina daar
   keert het lek om. Dat is één ronde op het vestigingsnummer, en die sleutel heb je
   vandaag zelf aangescherpt.
5. **Het dierenpension blijft open tot zondag.** Je vier afgemaakte dossiers vallen
   vier van vier op leeftijd en je legt ze eerlijk op tafel zonder zelf te sluiten.
   Dat is de goede vorm; het besluit hoort per 1.19 bij het weekrapport.
6. **Eén ding uit de directives dat vandaag onder is gebleven:** het quotum
   glazenwasserij van lane B staat op tien en je haalde er dertien, maar elf ervan
   vielen op leeftijd of op poort (e). Draai in deze sector één ronde op
   `alleglazenwassers.nl` met het vestigingsnummer als eerste zeef in plaats van de
   stad — je hebt vandaag zelf laten zien dat dat nummer gratis in de URL staat.

### Voor beide lanes

7. **De onderwerpregel gaat vanaf nu langs de claimcontrole van het bericht.**
   Nieuw als 1.30. Concreet: elk getal in de subject naast het kaartje leggen dat je
   zojuist zelf hebt geschreven. Een aantal beoordelingen is geen aantal
   vijfsterrenbeoordelingen, een gemiddelde is geen minimum, een top-tienpositie is
   geen eerste plaats.

---

## Gebruikte skills

| Skill | Waar toegepast | Wat het concreet veranderde |
|---|---|---|
| `cold-email` | Op de aangeboden onderwerpregel van Jardina, op de vervangende regel, en op beide klaargelegde teksten | De verwijdertoets `If you remove the personalized opening and the email still makes sense, the personalization isn't working.` (SKILL.md:41, met `grep -n` van schijf gehaald) is de toets waarmee ik heb vastgesteld dat mijn vervangende regel niet zwakker is dan Sams origineel: haal "4,7", "54" en "Werkspot" weg en er blijft geen regel over — dezelfde uitkomst als bij `54 keer vijf sterren op Werkspot`, waardoor de correctie alleen waarheid toevoegt en geen kracht wegneemt. `One ask, low friction` (SKILL.md:49) is waarom ik de slotvraag van het Jardina-bericht ongemoeid heb gelaten hoewel de belregel er als tweede weg naast staat: één vraagteken, en de belregel is een weg en geen tweede vraag. `Lead with their world, not yours` (SKILL.md:45) toetste de eerste alinea van Jardina — de man in Wijchen met zijn telefoon staat vóór alles wat ZEVREN doet, en het bericht haalt die toets. De subjectsectie wil `## Length: 2–4 words` (references/subject-lines.md:5) en `## Capitalization: lowercase wins` (:18); mijn vervangende regel is zes woorden met een hoofdletter en verliest daarmee bewust van poort (g), die een gecheckt detail binnen 45 tekens eist. Ik noteer die overrule zoals ik hem op 09-09 al heb goedgekeurd |
| `marketing-psychology` | Op de vraag of de vervangende onderwerpregel iets losmaakt, op de drie berichten, en op mijn eigen dagdiagnose | *Bandwagon / social proof* is precies de reden dat de correctie van de subject geen verzwakking is: sociaal bewijs werkt doordat de ontvanger het herkent als het zijne, en een getal dat hij als onjuist herkent doet het omgekeerde van wat de heuristiek moet doen. Dat is de scherpste toepassing van vandaag en zij besliste dat ik de kaart niet hoefde af te keuren. *Loss aversion* toetste de derde alinea van Jardina: het verlies staat in de opdracht die naar een ander gaat, zonder verzonnen bedrag — gehaald. *Availability heuristic* toetste of er precies één beeld in staat; bij alle drie de teksten is dat zo. *Theory of Constraints* op de dag zelf: de bindende beperking verschilt per lane (in A de leeftijd, 31 van 51; in B poort (a), 5 van de 6 kaartrijpe dossiers), en dat is de reden dat mijn orders voor lane A over de zeef gaan en die voor lane B over één specifieke bevestigingsronde per dossier. *Fundamental attribution error* op mezelf, bij lane A's citaatcorrectie: de eerste neiging was de bevinding te lezen als een lane die zijn eigen fout goedpraat, en de directe lezing van regels 68 en 200 liet zien dat de fout van mij was. **En deze skill leverde vandaag zijn eigen bevinding op:** de twee aanroepen waarmee het `$n`-mechanisme van 1.29 is vastgesteld, waren aanroepen van dít bestand |
| `product-marketing` | Als eigenaar van `.agents/product-marketing.md` | Twee regels toegevoegd binnen mijn reeks — 1.29 (de `$n`-invulling) bij "Een dag zonder kaarten is geen dag zonder skills", 1.30 (de onderwerpregel is een bewering) bij "Wat een bericht nooit mag beweren" — met changelogregel. Daarnaast twee gronden van mijzelf gecorrigeerd: de helft van de grond onder 1.27 die lane A weerlegde, en het regelnummer 306 → 316 in 1.26. De reeks 1.22 t/m 1.30 is daarmee vol; drie rijpe kandidaatregels staan hierboven voor zondag in plaats van buiten mijn reeks te worden geschreven |
| `prospecting` | Op poort (b) van de kaart en van de drie open dossiers | `- **High**: confirmed by at least two independent sources or official business page` (SKILL.md:68) is de drempel waarop `info@jardinahoveniers.nl` als hard geldt: eigen `/contact`-pagina plus twee onafhankelijke dragers, in mijn eigen exacte-tekenreeksronde gereproduceerd. `- [ ] Confidence levels honest — "High" requires 2 independent sources, not just two of your own searches` (SKILL.md:200) is de regel die lane A vandaag terugvond en die mijn verdict van 09-09 corrigeert; hij is ook de reden dat ik mijn eigen bevestigingsronde bij Hoorn en Hoevens als tweede ronde en niet als tweede bron heb geteld |
| `copy-editing` | Op de vervangende onderwerpregel en op dit bestand | Sweep 4 (Prove It) is de sweep die de hele dag draagt: hij haalde `54 keer vijf sterren` eruit omdat het niet te bewijzen is, en hij hield mij vervolgens tegen bij Hoorn en Hoevens toen ik twee gedateerde reviews had die de bevestigingsronde niet gaf. Sweep 5 (Specificity) is waarom mijn orders voor de volgende dienst per lane genummerd zijn met de zoekvorm erin in plaats van "draai nog een ronde" |
| `competitors` / `competitor-profiling` | Niet ingezet | Er lag geen vergelijkingsvraag. Beide lanes overwogen vandaag serieus om te toetsen of concurrenten in dezelfde stad hun reviews wél op het eigen domein voeren, en beide lieten het om dezelfde reden liggen: dat is een claim over derden die de owner niet in tien seconden kan nalopen. Dat oordeel is juist en ik heb er niets aan toe te voegen |
| `pricing` | Niet ingezet | De pakketkeuze was in alle drie de dossiers mechanisch en positief vastgesteld: offertewerk zonder tijdslot is 299 (Jardina, Marcel Hof, Hoorn en Hoevens), een boekingsroute die aantoonbaar ontbreekt is 549 (Trimsalon Leona). Nagekeken tegen `zevren/lib/offer.ts` regel 22 en 23. Er lag geen prijsvraag |
| `marketing-council` | Niet ingezet | Die hoort bij het weekrapport, waar de drie kandidaatregels en de twee doorgeschoven zeven tegen elkaar afgewogen moeten worden. Vandaag is een dagverificatie |

---

## Samenvatting

| # | Dossier | Plaats | Lane | Verdict |
|---|---|---|---|---|
| 1 | Jardina Hoveniers | Nijmegen | B | **GOEDGEKEURD** — acht poorten dicht, alle vier de harde feiten door mij onafhankelijk gereproduceerd; onderwerpregel vervangen omdat `54 keer vijf sterren` het eigen kaartje (4,7 uit 54) tegensprak |
| — | Schoorsteenveger Marcel Hof | Oosterwolde | A | AFGEKEURD als kaart, blijft bevinding — poort (a) na negen ronden open, twee ervan van mij; tekst blijft klaarliggen, Trustpilot-3,7 toegevoegd aan het dossier |
| — | Trimsalon Leona | Assen | A | AFGEKEURD als kaart, blijft bevinding — poort (a) na vijf ronden open, twee ervan van mij; geen tekst klaarleggen, dat besluit van lane A is juist |
| — | Hoorn en Hoevens | Hengelo (Ov) | B | AFGEKEURD als kaart, blijft bevinding — mijn vijfde ronde gaf twee gedateerde reviews, de bevestigingsronde nam ze terug (1.20a/1.22); tekst blijft klaarliggen |
| — | RS Hovenier | Borculo | B | Blijft bevinding — poort (a) na acht ronden open, nieuwe lookalike gevonden; **voorstel lane B overgenomen: zondag sluiten** |
| — | Stukadoor Lawand | Stadskanaal | A | Blijft bevinding — poort (a) na zeven ronden open; **rijp voor sluiting zondag**, geen achtste ronde |
| — | Dersim Glazenwasserij | Ede | B | Blijft bevinding — omkering van 06-09 correct opgeschreven per 1.32, poort (a) open |
| — | Atlas Hoveniers | Lelystad | B | Blijft bevinding — eerst het tweede domein oplossen, dan pas poort (a) |
| — | Evers Cleaning Deventer | Deventer | B | Terecht gesloten — enige gedateerde spoor is 24-09-2024, bijna twee jaar |
| — | M.Y. Schildersbedrijf | Almelo | B | Terecht afgekeurd op 1.28 — adres komt twee keer terug, exacte tekenreeks geeft nul dragers. Naar `bellijst.md` |
| — | WP Hoveniers · Hezeman Cleaning | Ermelo · Apeldoorn | B | Terecht tegengehouden door de `site:`-lekronde — twee kaarten die een ondernemer zouden vertellen dat hij mist wat hij al heeft |
| — | Boswijk Hoveniers | IJsselmuiden | B | Terecht buiten het venster — de gidsdatum 30-06-2025 is een B.V.-omzetting, 1.18(b) en 1.15 samen |

**Lane A: 51 dossiers, 0 kaarten, alle vijf orders uitgevoerd, skillstabel echt.**
**Lane B: 48 dossiers, 1 kaart (goedgekeurd), vier van vijf orders uitgevoerd met de
vijfde zelf gemeld als fout, skillstabel echt.**
**Fundament: 1.29 en 1.30 geschreven, reeks 1.22 t/m 1.30 vol, twee eigen gronden
gecorrigeerd, drie kandidaatregels doorgeschoven naar zondag.**
**Tekort gemeld, niet opgevuld. E/F/G blijven opgeschort.**

Azzouz, 10 september 2026
