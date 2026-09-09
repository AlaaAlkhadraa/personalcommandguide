# Verificatie 9 september 2026 — lanes A en B

Azzouz, verificatiedienst woensdag 9 september 2026. Directiveweek 7 t/m 13 september.
Deze dienst verifieert **uitsluitend** `2026-09-09-a.md` en `2026-09-09-b.md`. Lanes C en D
worden door een parallelle sessie gedaan; `-c.md`, `-d.md` en `2026-09-09-cd-verified.md`
zijn niet aangeraakt.

**Uitkomst in één regel: nul goedgekeurde kaarten, en dat is de juiste uitkomst.** Beide
lanes boden er geen aan. Ik heb de vier dossiers die eronder liggen zelf nagejaagd om te
zien of er één alsnog verzendklaar kon worden; dat kan er geen, en de grond is bij alle
vier dezelfde poort. Beide lanes leverden hun veertig volledig beoordeelde dossiers, beide
voerden de orders van gisteren uit, en beide skillstabellen zijn echt.

**Fundamentversies uit mijn reeks (1.26 t/m 1.30): ik schrijf 1.26, 1.27 en 1.28.**

---

## Bevinding — de kaartkoptelling van de opzichter klopt niet, en het bedrijf bestaat niet in deze lanes

De opdracht meldt dat de opzichter machinaal één genummerde kaartkop in lane A telde:
`## 1. Van der Zee Hoveniersbedrijf — Rottevalle`. De opdracht zegt er zelf bij uit te gaan
van wat in de bestanden staat. Dat heb ik gedaan, en het volgende staat er:

- `grep -n "^## [0-9]"` over `2026-09-09-a.md` → **nul treffers**. Over `2026-09-09-b.md` →
  **nul treffers**. Beide lanes bieden nul genummerde kaarten aan, precies zoals hun eigen
  kop- en samenvattingsregels zeggen ("**Kaarten: 0**" en "Aantal: **0 kaarten** uit 40
  beoordeelde dossiers").
- `grep -rn "Van der Zee"` over de volle `marketing/outreach/` geeft twee treffers en geen
  van beide is dit bedrijf: **Schoonmaakbedrijf Van der Zee**, een glazenwasser, gezet door
  lane A op **08-09** als `lead - niet afgerond`. Geen hoveniersbedrijf, geen Rottevalle,
  geen kaart, en niet van vandaag.

**Wat ik eruit meeneem.** De naam in de telling is een samenstelling van een bedrijf dat
gisteren in deze lane langskwam en een plaats die nergens in deze twee bestanden voorkomt.
Dat is dezelfde vorm als 1.36 — een verzonnen plaats valt nergens op, want geen enkele
poort vraagt "klopt de plaats". Ik trek er geen fundamentregel uit, want ik ken de
telroute van de opzichter niet en dit is één waarneming over gereedschap dat niet van mij
is. Ik meld het waar het thuishoort: **een machinale kaarttelling is geen bron voor wat er
op het bord hoort, het bestand is dat.** Was ik van de telling uitgegaan, dan had ik een
kaart geverifieerd die niet bestaat.

---

# Lane A — Groningen, Friesland, Drenthe

**Kaarten aangeboden: 0. Goedgekeurd: 0. Afgekeurd: 0** (er is niets afgekeurd, want er is
niets aangeboden — dat is iets anders dan een lane die faalde).
**Dossiers volledig beoordeeld: 46** tegen een norm van veertig. Gehaald.

## Bevinding — de orders van gisteren voor lane A: vier van de vijf uitgevoerd, de vijfde gemeten in plaats van gehaald

Ik heb alle vijf in het ledger nagelopen in plaats van op het woord van de lane af te gaan.

- **Otter-regels samengevoegd — uitgevoerd, letterlijk nageteld.**
  `grep -c "^| Otter Hoveniers"` over `contacted.md` → **1**. Over `bellijst.md` → **1**.
  Eén ledgerrij, één bellijstregel. De samengevoegde rij is bovendien de rijkste van de
  drie: `Pakket: 299`, `Hoek: offertelek`, de tweede vestiging aan Wederik 198
  (vestigingsnummer 000049499432) én het gedateerde levensteken van 11-02-2026 staan er
  alle vier in. Dat is precies wat 1.24 verlangt en waar de regel voor geschreven is.
  *(De vier regels in `bellijst.md` rond regel 298 zijn een prozanotitie van 03-09, geen
  tweede tabelregel. Ik heb dat gecontroleerd voordat ik het een dubbeling noemde.)*
- **Poort (e) ook over `bellijst.md` — uitgevoerd**, en niet als vinkje. De lane meldt dat
  de poort daar twee keer vuurde, en de bulk-`grep` over de drie bestanden staat vóór de
  verdere ronden in plaats van erna. Dat ving dertien dossiers af vóór er één adresronde
  in zat. Dit is 1.24 zoals hij bedoeld is.
- **Kanninga dicht — correct behandeld.** De order was hem dicht te laten; de lane schrijft
  "Kanninga is niet aangeraakt". Het ledger bevestigt dat: de rij van 08-09 draagt nog
  steeds `AZZOUZ 08-09: GESLOTEN` en is niet bijgewerkt. Niets doen was hier het werk.
- **Hadders precies één ronde — uitgevoerd, en in de voorgeschreven vorm.** Eén ronde
  (`"Hadders Hoveniers" Assen instagram OF google review 2026`), uitkomst leeg,
  `lead - poort open` ongewijzigd, en de lane is doorgegaan in plaats van door te jagen.
  Dat is exact wat de order vroeg. Ter vergelijking: op 08-09 draaide dezelfde lane er bij
  Kanninga vier waar één gevraagd was. Dat is nu gecorrigeerd gedrag en ik noteer het als
  zodanig.
- **Acht bellijstregels mét telefoonnummer — NIET gehaald: één.** En dit is de enige order
  van de dag die niet uitgevoerd is. De lane vult hem niet op en meet hem in plaats
  daarvan: zes bedrijven, alle zes op profiel, elk twee tot drie gerichte ronden, nul
  nummers, met de bron van de muur erbij (Telefoonboek.nl en De Telefoongids zetten het
  nummer achter "Telefoonnummer tonen"; oozo en drimble voeren het niet). **Dat is de
  juiste keuze en ik keur hem goed.** Twee extra ronden per bedrijf gaven nul extra
  nummers; een negende ronde zou het getal niet hebben veranderd. De order is niet gehaald,
  en de lane heeft precies opgeschreven waarom, met zes KvK-nummers die ik kan natellen.

**Oordeel over de orderuitvoering van lane A: goed.** Vier uitgevoerd, één eerlijk gemeten
in plaats van gehaald, geen enkele opgevuld.

## Bevinding — Stukadoor Lawand kan vandaag geen kaart worden, en ik heb het zelf geprobeerd

Dit is het dossier waar order (3) van mijn opdracht over gaat: kan een dossier onder de
bevindingen met een geverifieerd openbaar e-mailadres en een gedateerd bedrijfsfeit alsnog
een verzendklare kaart worden? Voor Lawand is het antwoord **nee**, en ik heb er twee eigen
ronden in gestoken voordat ik dat opschreef.

- **Poort (b) — DICHT, en harder dan de lane hem zelf opschreef.** Ik heb de
  exacte-tekenreeksronde gedraaid die lane B vandaag voorstelt (zie 1.28 hieronder):
  `"info@stukadoorlawand.nl"`. Die geeft **`www.stukadoorlawand.nl/Contact/`** terug — zijn
  eigen contactpagina — naast hetzelfde nummer 06-27284957. Het adres staat dus op zijn
  eigen domein en is niet samengesteld. Lane A had gelijk en hoefde dat niet te weten:
  ik heb de toets van de andere lane op zijn dossier toegepast en hij houdt.
- **Poort (a) — OPEN, en na mijn eigen ronden nog steeds.** Twee ronden:
  `"Stukadoor Lawand" Stadskanaal instagram 2026` en een ronde op zijn Facebookpagina met
  jaartal. Wat terugkomt: zijn Instagramprofiel `@stukadoorlawand` bestaat, zijn
  Facebookpagina bestaat, `schilder-nu.nl`, `stukadoorgids.nl`, `stucadoor.net`, Werkspot
  en Drimble bestaan — **en geen van alle levert een bericht of een review met een leesbare
  datum.** De tevredenheidszinnen die terugkomen ("het werk is netjes en zorgvuldig") staan
  in de samenvattende alinea zonder datum en zonder vindbare drager: 1.20(a), niet te
  gebruiken. De tweede ronde gaf uitsluitend landelijke prijspagina's over stucwerk — de
  zoekopdracht liep leeg op de sector in plaats van op het bedrijf.

**Verdict: geen kaart.** Zes ronden staan er nu op dit dossier (vier van lane A, twee van
mij) en poort (a) gaat niet dicht. Het blijft `lead - poort open` en de schrijfklare tekst
blijft geldig. **Wat hem opent, ongewijzigd:** één Instagrampost met jaartal of één
Google-review met tekst en datum.

**Over de tekst zelf, want die is af en dat hoort gezegd.** Ik heb het bericht getoetst met
`cold-email` en `marketing-psychology` alsof het wél verstuurd zou worden, zodat de lane die
poort (a) sluit niets meer hoeft te herschrijven:

- **Onderwerp `Je oordelen staan op stukadoorgids` — houdt.** 34 tekens, nageteld met
  `printf` en niet geschat. Het gecheckte detail staat op teken 1. De verwijdertoets van
  `cold-email` ("If you remove the personalized opening and the email still makes sense,
  the personalization isn't working", SKILL.md:41) haalt hij: haal die regel weg en de
  eerste alinea heeft geen aanleiding. Geen "website", geen ZEVREN, geen cijfer.
  **De motivering waarom kandidaat 2 afviel is de scherpste redenering die ik deze week in
  een lanebestand heb gelezen** — "een oordeel over zijn werk door een vreemde die dat werk
  niet gezien heeft" is precies waarom die regel sterft, en die toets stond in geen enkel
  handboek. Die neem ik over als leesregel.
- **Bericht — 201 woorden, meetwijze erbij, en de zeven eisen van de staande order gehaald.**
  Het lek staat in geld ("de opdracht gaat naar degene wiens werk hij heeft gezien"), niet
  in techniek. Het bewijs komt uit zijn eigen zaak (zijn drie profielpagina's, zijn drie
  eigen pagina's, zijn vijf jaar). Eén beeld, en het is er één die hij heeft geleefd.
  Prijs zonder verontschuldiging. Geen schaarste. Eén vraag. Handtekening compleet mét
  nummer. **Geen correctie nodig** — dat is vandaag de enige tekst in beide lanes waarvan
  ik dat kan zeggen.

## Bevinding — het skillbestand is NIET stuk, en dat is belangrijker dan het lijkt

Lane A meldt dat drie regels in `.claude/skills/marketing-psychology/SKILL.md` kapot zijn
door een zoek-en-vervangactie, en gebruikt dat als reden om die regels niet aan te halen.
Ik heb het bestand direct gelezen. **Alle drie de regels zijn intact:**

| Wat lane A las | Wat er werkelijk staat |
|---|---|
| "The jump from hoek to Welke is bigger than voor to hoek" | `The jump from $1 to $0 is bigger than $2 to $1.` (regel 154) |
| "$80 product: '20% off' beats 'vak off'" | `$80 product: "20% off" beats "$16 off."` (regel 306) |
| "'een/day' feels different than '$90/month'" | `"$3/day" feels different than "$90/month"` (regel 204) |

**En nu het deel dat de waarneming van lane A redt in plaats van hem afserveert.** Toen ik
de skill vandaag zelf aanriep, kreeg ik in dezelfde drie passages óók vervangen woorden —
maar **andere**: "The jump from **van** to **Toetsen** is bigger than **twee** to **van**",
"**klaargelegde**/day feels different than $90/month", "**van**/day feels cheaper than
$30/month". De Rule-of-100-regel die lane A verminkt zag, kwam bij mij wél goed door.

Dezelfde passages, verschillende vervangingen, hetzelfde bestand op schijf ongeschonden.
**Het gebrek zit niet in het bestand maar in wat de skill-aanroep serveert.** De waarneming
van lane A was dus echt en zijn diagnose was fout, en het verschil kost werk: hij heeft op
grond van een bestandsdefect dat niet bestaat citaten achtergehouden waar hij recht op had,
en hij heeft mij een meldpunt gestuurd over een bestand dat niets mankeert. Vastgelegd als
**1.26**.

## Bevinding — lane A's paginateller-zeef is een echte meting en hij gaat naar zondag, niet naar het fundament

De tweede bevinding van lane A meet iets dat ik serieus neem: van de tien noordelijke
bedrijven mét eigen domein die de leeftijdspoort haalden, gaven er acht een adres en bij zes
van die acht bestaat het bewijslek niet. De voorgestelde zeef — tel de geïndexeerde
pagina's, onder de drie geen adres, boven de zes geen lek — is goedkoop en toetsbaar.

**Ik neem hem niet op, en de grond is dezelfde als bij 1.25.** Hij raakt rechtstreeks aan de
jaagvolgorde van 1.20(b), die op een telling van vijf tegen nul rust, en hij raakt aan twee
beslispunten die sinds vorige week bij de owner liggen. 1.19 legt vast dat zo'n besluit bij
het weekrapport hoort en niet bij een dagverificatie. **Hij staat nu op twee diensten en
twee metingen** (08-09 zeven tegen zeven, 09-09 tien dossiers) en dat is genoeg om er zondag
een besluit over te nemen in plaats van nog een meting te vragen. Ik draag hem mee.

## Bevinding — de dossiernorm en de sectorminima van lane A

**46 volledig beoordeeld tegen een norm van veertig. Gehaald.** De twintig namen die alleen
op het vestigingsnummer zijn gezeefd, telt de lane uitdrukkelijk **niet** als dossier, met
1.35 erbij. Dat is de juiste toepassing: 1.35 zegt dat dat nummer nooit zelf een dossier mag
sluiten, en een naam die je op dat nummer hebt bekeken is dus geen beoordeeld dossier. Dat
de lane die twintig namen toch opschrijft mét wat er nog moet gebeuren (één KvK-ronde per
naam), is winst voor de volgende dienst en geen opvulling.

| Sector | Gevraagd | Beoordeeld | Oordeel |
|---|---|---|---|
| Glazenwasserij / gevelreiniging | 10 | 16 | gehaald |
| Schilder + stukadoor | 8 | 12 | gehaald |
| Hovenier / groenonderhoud | 10 | 10 | gehaald |
| Geen-websitegroep → `bellijst.md` | 8 | 6 (1 belklaar) | **niet gehaald, wél gemeten** |
| Vrij | 4 | 4 | gehaald |

Vier van vijf gehaald. De sectortabel telt op tot 48 tegen 46 dossiers; dat verschil is de
overlap tussen de geen-websitegroep en de glazenwassers (Siepol, SiZo, F. de Wit, Michael's,
Extra Clean, Total Cleaning zijn schoonmaakzaken en tellen in beide rijen). Geen fout, wel
iets dat de lane in één regel had kunnen zeggen.

**De tekortverantwoording staat in de voorgeschreven korte vorm**, met de tweede regel die de
bindende poort voor trechter én bord apart noemt: "(d) bij 15 van de 46" voor de trechter,
"(a)" voor het bord. Dat is precies de vorm die de directives deze week vragen. Geen
uitweiding, geen tweede verantwoording.

## Bevinding — de Gebruikte-skills-tabel van lane A is echt (poort h gehaald), met één citaatfout

Acht rijen: vier skills ingezet, vier eerlijk als *niet ingezet* gemeld met de grond erbij.
Dat laatste is de standaard die de directives vastleggen en het is geen minpunt. Ik heb de
citaten nageslagen in plaats van ze te geloven:

| Citaat | Uitkomst |
|---|---|
| `cold-email`: "if you remove the personalized opening and the email still makes sense, the personalization isn't working" | **Woordelijk juist**, SKILL.md:41 |
| `cold-email`: "One ask, low friction" | **Woordelijk juist**, SKILL.md:49 |
| `prospecting`: "capture and retain the source URL and date for every contact" | **Woordelijk juist**, SKILL.md:107 |
| `prospecting`: "High confidence requires two independent sources, **not just two of your own searches**" | **FOUT** — er staat: "**High**: confirmed by at least two independent sources or official business page" (SKILL.md:68). Het tweede deel is een eigen aanscherping van Sam, tussen aanhalingstekens gezet |
| `copy-editing`: sweeps Clarity / Prove It / Specificity | **Bestaan**, sweeps 1, 4 en 5 |
| `marketing-psychology`: Contrast effect, Availability heuristic, Loss aversion, Theory of Constraints | **Bestaan alle vier** in de skill |

Eén citaatfout op zes. **Poort (h): GEHAALD.** De tabel is niet hol — hij noemt per rij wat
er concreet veranderde en die veranderingen zijn in het bestand terug te vinden (de
geschrapte passieve zin, de verplaatste openingsalinea, de dertien afgevangen dossiers). Maar
de citaatfout is niet vrijblijvend: hij staat in **beide** lanes, met dezelfde zin, één dienst
nadat ik hem op 08-09 al als vormfout had opgeschreven. Zie 1.27.

---

# Lane B — Overijssel, Gelderland, Flevoland

**Kaarten aangeboden: 0. Goedgekeurd: 0. Afgekeurd: 0.**
**Dossiers volledig beoordeeld: 40** tegen een norm van veertig. Precies gehaald.

## Bevinding — de orders van gisteren voor lane B: allebei uitgevoerd, en de tweede leverde meer op dan gevraagd

- **Gomar dicht met "gesloten na drie diensten" — uitgevoerd, woordelijk.** De ledgerrij
  draagt `AZZOUZ 08-09 / uitgevoerd 09-09 lane B: **GESLOTEN NA DRIE DIENSTEN.** Geen vierde
  ronde, door geen enkele lane.` `grep -c "^| Gomar"` → **1**: de tweede rij van 08-09 is
  samengevoegd conform 1.24. De grond staat er compleet bij (de review van 16-03-2026 staat
  op de Werkspot-**stads**pagina van Markelo en gaat over tuinonderhoud, dus valt op 1.22).
  Dat is een correcte toepassing van een regel die ik gisteren zelf schreef.
- **Back to Eden één ronde via Kers met KvK 84925043 — uitgevoerd, met drie ronden extra en
  een gemelde afwijking.** De lane meldt de afwijking in de eerste alinea, zoals de order van
  07-09 vraagt, met de grond erbij. **Ik keur de overschrijding goed.** De extra ronden
  raakten de dragende zin van een klaargelegde tekst; drie ronden zijn goedkoper dan een
  verstuurde mail die een ondernemer vertelt dat hij mist wat hij al heeft.
  - KvK 84925043 als derde onafhankelijke leeftijdsdrager: **bevestigd**, januari 2022, vier
    jaar, midden in het venster.
  - De samenwerking met Kers: **bestaat niet.** Twee KvK-nummers (53791355 tegen 84925043),
    twee adressen, twee dorpen, vijftien jaar tegen vier. De order van gisteren noemde ze
    samenwerkingspartners; dat was fout en de lane heeft het rechtgezet met nummers erbij.
    **Dat is precies waarvoor deze controle bestaat en het is een correctie op mij.**

## Bevinding — Back to Eden: de lane weigert zijn eigen kaart, en dat is het beste oordeel van de dag

De order van 08-09 zei dat de klaargelegde tekst goed genoeg was om te versturen zodra poort
(a) sloot. De lane draagt hem niet voor, omdat de portfoliopagina van zijn eigen webontwerper
(`wiljanvandalen.nl/project/back-to-eden-hoveniers/`) meldt dat de site projecten laat
bekijken — precies wat de dragende zin van het bericht ontkent.

**Ik bevestig dit oordeel en het gaat verder dan poort (d).** De lane leidt er correct níét
uit af dát er een projectenpagina is (die formulering komt uit een samenvattende alinea,
1.20a, en vier `site:`-ronden over twee diensten gaven nooit zo'n URL). Wat zij eruit
afleidt is dat **de claim niet langer positief vaststaat**, en dat is genoeg om geen kaart te
schrijven. Een kaart mag niet rusten op een lek dat een onafhankelijke bron tegenspreekt.

De tweede grond die de lane noemt weegt commercieel zwaarder en ik onderschrijf hem: deze
ondernemer **heeft** een webleverancier en is er blijkens de klantregel tevreden over. Het
profiel van 24 augustus jaagt op de zaak die achterblijft, niet op de zaak die net geleverd
heeft gekregen. **Uitkomst: van één open poort naar twee. Geen kaart, en de tekst gaat niet
mee zonder herschreven tweede alinea.**

Dat een lane een eigen, complete, klaargelegde tekst intrekt op bewijs dat zij zelf heeft
opgegraven — terwijl een order van mij zei dat hij verzendklaar was — is het gedrag dat dit
hele systeem moet opleveren. Genoteerd als zodanig.

## Bevinding — RS Hovenier kan vandaag geen kaart worden, en de lookalike-val vuurde op mij

Het tweede dossier van order (3). Alles dicht behalve poort (a). Ik heb er twee eigen ronden
in gestoken.

- **Poort (b) — DICHT en bevestigd.** Mijn ronde geeft `info@rshovenier.nl` terug naast het
  kloppende adres (Ruurloseweg 25, 7271 RS Borculo) en het kloppende nummer (06-20675052),
  met `rshovenier.nl` als drager. Geen samenstelling.
- **Leeftijd — bevestigd.** Opgericht 01-07-2021, eenmanszaak, 1 werkzaam persoon. Vijf jaar.
  De lane noteert terecht "vijf jaar" en niet de "meer dan 8 jaar ervaring" die in de
  samenvatting opduikt: dat is de ervaring van de man, niet de leeftijd van de zaak — de
  Kanninga-vorm, correct herkend.
- **Poort (a) — OPEN, en mijn eigen ronde liep in de val waar de lane voor waarschuwt.**
  Mijn eerste ronde gaf een review terug ("de tuin netjes gemaakt met snoeien en
  reinigen, harde werker") die in de samenvattende alinea aan RS Hovenier werd geplakt.
  **Die review staat op het Werkspot-profiel van "Hovenier Roel" in Ederveen** — honderd
  kilometer verderop, een ander bedrijf, precies de lookalike die de lane in zijn kaartje
  had opgeschreven. Zonder die waarschuwing had ik hier een kaart op gebouwd.
  `hovenier.website` meldt zelf nul reviews voor RS Hovenier. De tweede ronde gaf geen
  Facebook- of Instagrampagina.

**Verdict: geen kaart.** Zeven ronden staan er nu op (vijf van de lane, twee van mij).

**Over de tekst, met twee correcties die de volgende dienst moet doorvoeren.** Het bericht
haalt de zeven eisen: het verlies staat in de opdracht die naar een ander gaat, het bewijs
komt uit zijn eigen zaak (zijn startleeftijd, zijn vier pagina's, zijn vier diensten), één
beeld, prijs zonder verontschuldiging, geen schaarste, 216 woorden zonder handtekening
(1.23), handtekening compleet mét nummer. Het onderwerp `Sinds je 21e voor jezelf` is 24
tekens, het detail staat op teken 1, en de motivering van de twee afvallers is deugdelijk.

Twee dingen kloppen niet en ze zijn allebei klein:

1. **"Op zevren.nl staan conceptsites die wij gebouwd hebben en die echt werken; klik er een
   aan."** De hovenierspagina draagt volgens 1.31 de **conceptbouwerroute en geen demo** —
   dat heeft de lane zelf correct nagekeken en in de UTM-noot opgeschreven. Maar de zin in
   het bericht wijst naar "conceptsites op zevren.nl" terwijl de link ernaast naar de
   hovenierspagina gaat. Dat is precies de vorm die 1.31 verbiedt: **de bestemming van een
   link is zelf een claim.** De lane belooft geen demo op die pagina, maar zet de
   bewijsuitnodiging en de link zo dicht op elkaar dat de lezer ze als één ding leest.
   **Correctie voor de volgende dienst:** laat de bewijszin de conceptbouwer noemen die op
   die pagina staat, in de vorm die lane A vandaag wél goed had ("kies zelf stijl en kleuren
   en zie direct een voorbeeld van je eigen homepage"), of haal de klik-uitnodiging weg.
2. **Twee vraagtekens in de slotalinea.** "Heb je foto's liggen van de laatste tuin die je
   hebt aangelegd?" is de ene vraag, en dat is de goede. "Bellen mag ook, dat gaat vaak
   sneller dan mailen" staat er terecht naast als tweede weg en niet als tweede vraag — dat
   is correct uitgevoerd. **Geen correctie, wel bevestigd**, want dit is de order waarop
   lane A op 08-09 viel.

## Bevinding — de dossiernorm en de sectorminima van lane B

**40 volledig beoordeeld tegen een norm van veertig. Precies gehaald.** Ik heb de
sectorverdeling zelf uit de dossiertabel geteld, want lane B levert — anders dan lane A —
**geen `## Sectorminima`-tabel**:

| Sector | Gevraagd | Geteld uit de dossiertabel | Oordeel |
|---|---|---|---|
| Hovenier / groenonderhoud | 12 | 14 (#1-3, #19-29) | gehaald |
| Glazenwasserij / gevelreiniging | 10 | 15 (#4-18) | gehaald |
| Schilder + stukadoor | 8 | 9 (#30-38) | gehaald |
| Dierenpension | 2 | 2 (#39, #40) | gehaald — **niet gesloten**, zoals de order vroeg |
| Geen-websitegroep → `bellijst.md` | 8 | 11 beoordeeld, 1 belklaar | quotum gehaald, belregels niet |

**Alle vijf de sectorminima gehaald.** Het dierenpensionquotum is uitgevoerd zoals de order
het bedoelde: twee dossiers erbij en een verdict, niet sluiten. Beide vielen op leeftijd
(39-reeks van vóór 2008; "al 30 jaar een begrip"). Dat is twee dossiers en nog geen verdict
over de sector — terecht doorgeschoven.

**De tekortverantwoording staat in de korte vorm**, met de tweede regel over de bindende
poort voor trechter én bord: "(b) bij 15 van de 40 — maar de twee kaartrijpe dossiers vielen
allebei op poort (a)". Dat is de vorm. Eén vormnit: de grondentabel voert een rij
`| Kaart | 0 |`, en een kaart is geen grond. Die hoort er niet in.

## Bevinding — de Gebruikte-skills-tabel van lane B is echt (poort h gehaald), met dezelfde citaatfout

Acht rijen, vier ingezet, vier eerlijk als niet ingezet. De aangehaalde regels bestaan
(verwijdertoets SKILL.md:41, "One ask, low friction" SKILL.md:49, de vier lagen in
`references/personalization.md`, "2-4 words, lowercase" in de subjectsectie, "Remove
duplicates" in `prospecting` SKILL.md:196, sweeps 1/4/5 in `copy-editing`). De rij over
*Fundamental Attribution Error* is de sterkste van beide lanes vandaag: de lane past de
skill op **zichzelf** toe — de verleiding om de tegenspraak bij Back to Eden weg te redeneren
omdat het eigen dossier van gisteren zo compleet was — en die zelftoepassing is in het
bestand terug te zien, want poort (d) staat open in plaats van dat de zin is bijgeschaafd.

**Poort (h): GEHAALD.** Ook hier de citaatfout uit 1.27: `"High confidence requires two
independent sources, not just two of your own searches"` staat zo niet in `prospecting`. En
één punt dat de lane vóór heeft op zichzelf: hij noteert zijn eigen gemiste poort (e) bij
Clean4You in de skillstabel **als fout en niet als vondst**. Dat is de eerlijkheid die deze
tabellen bruikbaar maakt.

---

# Wat ik in het fundament vastleg

Drie regels, binnen mijn reeks 1.26 t/m 1.30. Alle drie komen uit het werk van vandaag en
alle drie halen de drempel die dit document voor zichzelf hanteert.

**1.26 — een gebrek in de tekst van een skill is een gebrek in wat je geserveerd kreeg, niet
automatisch in het bestand.** Twee dragers op één dag: lane A las drie verminkte passages in
`marketing-psychology` en meldde een zoek-en-vervangactie op het bestand; ik las bij dezelfde
aanroep dezelfde drie passages verminkt, maar met **andere** vervangingen, en een directe
`grep` toont alle drie de regels ongeschonden op schijf. De kosten zijn eenzijdig: één `grep`
kost nul ronden, en de fout kost twee dingen tegelijk — citaten die worden achtergehouden
waar de agent recht op had, en een meldpunt aan mij over een bestand dat niets mankeert.
Regel: **controleer een vermoed bestandsdefect met een directe lezing vóór je het meldt, en
laat een verminkte weergave nooit het gebruik van de skill onderdrukken.**

**1.27 — een aanscherping van jezelf hoort buiten de aanhalingstekens.** Op 08-09 legde ik
dit vast als vormfout zonder er een regel van te maken. Vandaag herhalen **beide** lanes hem
met dezelfde zin: `"High confidence requires two independent sources, not just two of your
own searches"` — waarvan alleen het eerste deel in `prospecting` staat (SKILL.md:68) en het
tweede deel Sams eigen, en overigens juiste, aanscherping is. Tweede dienst op rij, twee
onafhankelijke lanes: dat is de klassieke drempel. Regel: **een citaat tussen aanhalingstekens
in de `## Gebruikte skills`-tabel is een bronclaim en moet woordelijk in de skill staan; een
eigen aanscherping zet je erbuiten en schrijf je op eigen naam.** De aanscherping zelf is
goed en mag blijven — alleen niet als citaat.

**1.28 — de exacte-tekenreeksronde is een verplichte controle op elk gevonden e-mailadres.**
Voorgedragen door lane B en door mij onafhankelijk toegepast. Drie dragers: Back to Eden
(08-09, zichtbaar afgekapt tot `info@backtoedenhoveniers`), Clean4You (09-09, **onzichtbaar**
afgekapt tot `younw@gmail.com` — een geldig adresformaat dat op geen enkele poort valt en in
een vreemde mailbox landt), en Stukadoor Lawand (mijn eigen ronde vandaag, waar dezelfde
toets het adres juist **hard maakte** door `stukadoorlawand.nl/Contact/` terug te geven). De
kosten zijn eenzijdig, zoals bij 1.31 en 1.34: één ronde per adres, en zij kan geen goed
adres doden. Regel: **elk e-mailadres dat niet van een eenbedrijfsregisterpagina komt, wordt
gezocht als exacte tekenreeks; geëist wordt een URL van het bedrijf zelf of een
eenbedrijfspagina. Komt er niets terug, dan is het adres niet fout bewezen — dan is de
volgende stap het ledger en de eigen contactpagina, niet de conclusie "geen e-mailadres".**

**Uitdrukkelijk niet opgenomen, en waarom:**
- **Lane A's paginateller-zeef** (onder drie pagina's geen adres, boven zes geen lek). Echte
  meting op twee diensten, maar hij raakt de jaagvolgorde van 1.20(b) en twee onbeantwoorde
  beslispunten van de owner. 1.19: dat hoort bij het weekrapport. Meegenomen naar zondag,
  met de meting van 08-09 erbij — hij is nu rijp voor een besluit, niet voor nog een meting.
- **Lane B's vestigingsnummer-als-sleutel** (twee handelsnamen op één twaalfcijferig nummer
  is één onderneming; DeHult / Turtle SoftWash / SoftWash Vechtdal). Overtuigend en een
  natuurlijke uitbreiding van 1.35, maar hij staat op één drager en één dienst. Lane B krijgt
  de order hem morgen te draaien op een tweede geval.
- **Lane B's regel dat een zoekresultaattitel bij een gedeelde achternaam niet zegt wie het
  domein voert** (Kers / Back to Eden). Ik heb vandaag zelf een naaste variant meegemaakt —
  de Ederveen-review die in de samenvatting aan RS Hovenier werd geplakt — maar dat is
  1.20(a) plus 1.22 die samen vuren, niet dezelfde claim. De regel is versterkt, niet
  gedragen. Naar zondag.

---

# Orders voor de eerstvolgende dienst

## Lane A

1. **Stukadoor Lawand: nog één ronde, en dan is het klaar.** Zes ronden staan er nu op
   poort (a) (jouw vier, mijn twee). Draai er **één**, en wel deze: zijn Instagramprofiel
   `@stukadoorlawand` op een post met jaartal. Zijn Google-profiel voert één review, dus
   Instagram is de kansrijkste — dat is jouw eigen analyse en zij klopt. Levert die niets op,
   dan sluit ik dit dossier zondag zoals ik Kanninga en Gomar heb gesloten. **De tekst is af
   en heeft geen correctie nodig; schrijf er niets nieuws voor.**
2. **De geen-websitegroep: acht dossiers blijven de order, belregels niet.** Je hebt de muur
   gemeten en ik neem hem aan. Vanaf nu geldt: acht **beoordeelde** dossiers in die groep is
   de norm, en het aantal belregels is de uitkomst die je meldt, niet het doel dat je haalt.
   Steek geen derde ronde meer in een gids die "Telefoonnummer tonen" voert. Wat wél werkt is
   de eenbedrijfspagina van een vakgids die het nummer in de paginatekst zet — `schilder-nu.nl`
   en `alleglazenwassers.nl` — en daar mag je op zeven.
3. **De twintig namen op het vestigingsnummer: draai er tien af, met één KvK-ronde per naam.**
   Je hebt ze correct níét als dossier geteld en correct opgeschreven wat er nog moet
   gebeuren. Tien ervan afmaken is de goedkoopste dossiers van je hele week, want het
   zoekwerk is al gedaan.
4. **Citaten: haal je eigen aanscherpingen buiten de aanhalingstekens** (1.27). Je aanscherping
   op `prospecting` is juist en waardevol — schrijf hem op je eigen naam.
5. **Meld een vermoed bestandsdefect pas na een directe lezing** (1.26). Het skillbestand
   mankeert niets; het was de weergave. Houd geen citaten meer achter op die grond.

## Lane B

1. **RS Hovenier: nog één ronde op poort (a), en corrigeer de bewijszin vóór hij de deur
   uitgaat.** Zeven ronden staan er nu op. Draai er één: een gedateerde Google-review of een
   Facebook-/Instagrampagina die in een resultaat terugkomt. **Let op de lookalike** — het
   Werkspot-profiel "Hovenier Roel" in **Ederveen** is niet dit bedrijf, en de samenvattende
   alinea plakt zijn review aan RS Hovenier; ik ben er vandaag zelf ingelopen ondanks jouw
   waarschuwing. Gaat de poort dicht, dan **eerst de correctie van 1.31**: de zin over
   conceptsites op zevren.nl staat te dicht op een link naar een pagina die de
   conceptbouwerroute draagt. Neem de vorm die lane A vandaag goed had.
2. **Back to Eden: laten liggen.** Twee open poorten, een tevreden webleverancier en een zaak
   die net geleverd heeft gekregen. Geen ronde meer, door geen enkele lane. Je weigering van
   je eigen tekst was juist en ik draai hem niet terug.
3. **Draai de vestigingsnummer-sleutel op een tweede geval** (twee handelsnamen, één
   twaalfcijferig nummer). Eén drager is te weinig voor het fundament; twee is genoeg. Dit is
   de goedkoopste manier om je eigen voorstel zondag door te krijgen.
4. **Schrijf een `## Sectorminima`-tabel zoals lane A dat doet.** Je hebt alle vijf de minima
   gehaald, maar ik moest het uit je dossiertabel tellen. Eén tabel scheelt mij dat en jou een
   discussie.
5. **Haal de rij `| Kaart | 0 |` uit de grondentabel** — een kaart is geen afkeurgrond. En
   citaten: zie 1.27, dezelfde zin als lane A.

## Beide lanes

- **De poort-(e)-ronde staat vóór het werk, over alle drie de bestanden.** Lane A deed dit
  vandaag goed en bespaarde er dertien dossiers mee; lane B viel er precies op bij Clean4You
  en heeft dat zelf opgeschreven. Dat is de vijfde order van de week en hij blijft staan.
- **De exacte-tekenreeksronde is vanaf nu verplicht op elk gevonden e-mailadres** (1.28).
- **De dagnorm blijft dertig en ik verlaag hem niet.** Twee lanes, 86 volledig beoordeelde
  dossiers, nul kaarten — en beide lanes hebben de norm gehaald die ik ze deze week
  werkelijk oplegde: veertig beoordeelde dossiers per lane. Het tekort is gemeld en niet
  opgevuld. Dat is de uitweg en jullie hebben hem allebei genomen.

---

## Bevinding — ik ben zelf op poort (e) gevallen, bij precies de twee dossiers die ik het scherpst heb bekeken

Dit noteer ik als fout en niet als vondst, met dezelfde woorden waarmee lane B vandaag zijn
eigen gemiste poort (e) opschreef. Anders is de norm die ik beide lanes oplegde niet de norm
waaraan ik mezelf houd.

Lane A meldt bij Stukadoor Lawand `grep -ic "Lawand"` → 0, 0, 0 over de drie bestanden. Lane B
meldt bij RS Hovenier zes deeltreffers en nul rijen op het bedrijf zelf. **Beide meldingen
waren juist op het moment dat de lanes ze deden** — en beide lanes schreven hun ledgerrij
daarna, aan het eind van hun eigen dienst. Ik heb dat niet gecontroleerd. Ik las "nul rijen",
concludeerde dat een dossier met een klaargelegde tekst onvindbaar was voor poort (e), en zette
er een tweede rij onder. Daarmee maakte ik in één handeling de dubbeling die 1.24 verbiedt, bij
allebei de bedrijven, op de dag dat ik lane A prees voor het opruimen van precies zo'n
dubbeling bij Otter en lane B voor het samenvoegen van Gomar en Clean4You.

**Hersteld:** `grep -c "^| Stukadoor Lawand |"` → 1, `grep -c "^| RS Hovenier |"` → 1. De rijen
van de lanes zijn behouden — zij waren de rijkere — en wat de verificatie toevoegde is eraan
gehangen in plaats van ernaast gezet: de hard gemaakte poort (b) bij Lawand (1.28), de stand
van poort (a) op zes respectievelijk zeven ronden, de lookalike die op mij vuurde, en de twee
correcties voor RS Hovenier.

**Wat het leert, en het is niet wat ik zou verwachten.** De poort-(e)-ronde van een lane meet
de toestand aan het begin van haar dienst; de rij die zij schrijft ontstaat aan het eind. Wie
diezelfde dag ná de lane in het ledger schrijft — de verificatie, of een parallelle sessie —
leest een nul die intussen een één is. **Voor een lane is "eerst het ledger" de juiste
volgorde; voor mij is het de verkeerde: ik moet het ledger draaien vlak vóór ik schrijf, niet
op het woord van het bestand dat ik verifieer.** Dat is één `grep` en hij kost niets.

Ik draag er geen fundamentregel voor voor. Dit is één waarneming, van één sessie, over mijn
eigen werkvolgorde en niet over die van Sam, en 1.19 zegt dat ik dat soort besluiten bij het
weekrapport neem. Staat het zondag nog, dan schrijf ik hem op.

# Aan de owner — één regel, want de zes beslispunten liggen er nog

Twee lanes, 86 volledig beoordeelde dossiers, nul verzendklare kaarten, en de bindende poort
was bij **vier van de vier kaartrijpe dossiers dezelfde**: poort (a), het gedateerde
levensteken binnen twaalf maanden. Niet het e-mailadres, niet de leeftijd, niet het lek —
die stonden bij Lawand en RS Hovenier alle drie dicht. Ik heb er vandaag zelf zes ronden in
gestoken bovenop de negen van de lanes en geen ervan gaat open. Dat is geen inzetprobleem en
het is met soepeler keuren niet op te lossen; het is het derde beslispunt in
`marketing/reports/week-2026-09-06.md` dat op een antwoord wacht.

## Gebruikte skills

| Skill | Waar toegepast | Wat het concreet veranderde |
|---|---|---|
| `cold-email` | Op de onderwerpregels en berichten van Lawand (lane A) en RS Hovenier (lane B), en op de controle van beide citaattabellen | De verwijdertoets (SKILL.md:41, woordelijk nageslagen) bevestigde beide gekozen subjects en doodde beide afvallers om de reden die de lanes zelf noemden. "One ask, low friction" (SKILL.md:49) is waarop ik het RS-bericht heb goedgekeurd op het punt waar lane A op 08-09 viel: één vraag, en de belregel ernaast als tweede wég en niet als tweede vraag. De skill leverde ook de fout die ik in beide tabellen aanwijs: ik heb de vier aangehaalde regels in `SKILL.md` en `references/personalization.md` opgezocht in plaats van ze te geloven, en de `prospecting`-regel bleek half citaat en half eigen aanscherping (1.27). En de subjectsectie ("2-4 words, lowercase") is de reden dat ik de bewuste overrule van beide lanes **goedkeur** in plaats van hem als afwijking te noteren: poort (g) van de owner eist een gecheckt detail binnen 45 tekens en dat verslaat een skill-vormregel — dat staat nu vast in plaats van dat elke lane het opnieuw moet verantwoorden |
| `marketing-psychology` | Op de zeven eisen van de staande order bij beide berichten, en op mijn eigen verificatiebeslissingen | *Loss aversion / prospect theory* is de toets waarop ik beide berichten heb goedgekeurd: bij Lawand staat het verlies in de opdracht die naar een ander gaat, bij RS Hovenier in dezelfde vorm, en in geen van beide staat een verzonnen bedrag. *Availability heuristic* is waarop ik heb geteld dat er precies één beeld in staat — één per bericht, en beide lanes hebben een tweede geschrapt. *Fundamental Attribution Error* stuurde mijn oordeel over lane A's skillmelding: de verleiding was te concluderen dat de lane slordig had gelezen; de skill zegt eerst de situatie onderzoeken, en dat leverde de werkelijke oorzaak op — de aanroep serveert iets anders dan het bestand, en dat kon ik alleen zien door de skill zélf aan te roepen en mijn eigen weergave met de `grep` te vergelijken. Dat is 1.26 en zonder deze skill had ik hem als leesfout van Sam afgedaan. *Theory of Constraints* is de reden dat mijn ordertabel geen enkele lane om méér ronden vraagt: de beperking staat bij vier van de vier kaartrijpe dossiers op poort (a), en meer inzet op de andere poorten verandert daar niets aan |
| `product-marketing` | Als eigenaar van `.agents/product-marketing.md`, op de drie nieuwe regels en op de drie afgewezen voorstellen | Het fundament bepaalde welke van de zes voorstellen van vandaag erin komen. De drempel "kosten eenzijdig" (uit 1.31/1.34) liet 1.26 en 1.28 toe op respectievelijk twee en drie dragers; de klassieke drempel "twee lanes, onafhankelijk, dezelfde dienst" liet 1.27 toe. Dezelfde toets hield lane A's paginateller-zeef en lane B's vestigingsnummer-sleutel **buiten** het fundament, want 1.19 wijst besluiten die aan de jaagvolgorde raken naar het weekrapport — dat is concreet: twee goede voorstellen zijn vandaag níét doorgevoerd en gaan zondag mee, met de meting erbij |
| `prospecting` | Op mijn eigen zes verificatieronden bij Lawand en RS Hovenier | "**High**: confirmed by at least two independent sources or official business page" (SKILL.md:68, woordelijk) is de norm waarop ik poort (b) bij Lawand hard heb verklaard: de exacte-tekenreeksronde gaf zijn eigen `/Contact/`-pagina, en dat is de "official business page" van de skill. Diezelfde regel is waarom ik de review die mijn eerste RS-ronde teruggaf **niet** als levensteken heb aangenomen: één samenvattende alinea is geen bron, en de drager bleek een ander bedrijf in Ederveen. Zonder deze toets had ik vandaag een kaart goedgekeurd op de review van een lookalike |
| `copy-editing` | Als laatste pass over dit bestand | Sweep 4 (Prove It) is waarom elke orderuitvoering hierboven het `grep`-resultaat of het ledgercitaat noemt in plaats van het woord "uitgevoerd" — de vijf orders van lane A staan er met hun telling, niet met een vinkje. Sweep 5 (Specificity) maakte van "de skillmelding klopt niet" de driekolomstabel met wat er gelezen werd naast wat er staat, met regelnummers; dat verschil is wat Sam morgen kan natellen. Sweep 1 (Clarity) haalde twee vergoelijkende constructies uit mijn orders ("het zou goed zijn als je...") en maakte er opdrachten van |
| `marketing-council` | Niet ingezet | Die is voor het weekrapport, waar meerdere perspectieven tegen het plan aan moeten kijken. Een dagverificatie beslist geen strategie: de twee voorstellen die daar wél aan raken heb ik juist doorgeschoven naar zondag |
| `pricing` | Niet ingezet | Er lag geen prijsvraag. Beide pakketbesluiten waren mechanisch en allebei juist: offertewerk zonder tijdslot is 299, nagekeken tegen `zevren/lib/offer.ts` (299/549/899/1349, ongewijzigd) |
| `competitors` / `competitor-profiling` | Niet ingezet | Beide lanes overwogen een concurrentievergelijking en lieten hem om dezelfde, juiste reden liggen: het brengt een claim over derden in een bericht die de owner niet in tien seconden kan nalopen. Ik had geen aanleiding om dat oordeel te herzien |
| `revops` / `attribution` / `analytics` / `sales-enablement` / `customer-research` | Niet ingezet | Er is vandaag niets verstuurd en er is nooit iets verstuurd — 121 kaarten, nul verzonden, nul antwoorden. Zonder één werkelijke uitkomst is er geen trechter te meten en geen toeschrijving te doen. Dat is de eerlijke reden en zij staat ook in de directives |

## Samenvatting

| Lane | Kaart / dossier | Uitkomst |
|---|---|---|
| — | **Kaarten aangeboden: 0. Goedgekeurd: 0. Afgekeurd: 0.** Beide lanes boden terecht niets aan; er is niets afgekeurd omdat er niets voorlag | |
| A | Stukadoor Lawand — Stadskanaal | **GEEN KAART** — poort (a) open na zes ronden (vier van de lane, twee van mij). Poort (b) door mij hard gemaakt met de exacte-tekenreeksronde. Tekst is af en behoeft geen correctie |
| A | Hadders Hoveniers — Assen | **GEEN KAART** — order van één ronde correct uitgevoerd, poort (a) blijft open |
| A | Orders van gisteren | Vier van vijf uitgevoerd; de achtste bellijstregel is gemeten in plaats van opgevuld, en dat keur ik goed |
| A | Dossiernorm 46/40, sectorminima 4 van 5 | **GEHAALD.** Alleen de geen-websitegroep bleef op 6 van 8, met een gemeten muur erbij |
| A | Poort (h) skillstabel | **GEHAALD** — echt en natrekbaar, met één citaatfout (1.27) |
| B | RS Hovenier — Borculo | **GEEN KAART** — poort (a) open na zeven ronden. Twee correcties genoteerd voor de dienst die hem opent (1.31-bewijszin; de ene vraag is correct) |
| B | Back to Eden Hoveniers — Luttelgeest | **GEEN KAART** — de lane trok zijn eigen klaargelegde tekst in op eigen bewijs. Bevestigd: poort (a) én (d) open. Het beste oordeel van de dag |
| B | Orders van gisteren | Allebei uitgevoerd; de Kers-order van mij was feitelijk fout en is door de lane rechtgezet met KvK-nummers erbij |
| B | Dossiernorm 40/40, sectorminima 5 van 5 | **GEHAALD** — zelf geteld, want de lane levert geen sectorminimatabel |
| B | Poort (h) skillstabel | **GEHAALD** — echt en natrekbaar, met dezelfde citaatfout (1.27) |
| Azzouz | Eigen fout | **Poort (e) gemist bij Lawand én RS Hovenier**: ik zette een tweede ledgerrij onder rijen die de lanes na hun eigen grep hadden geschreven. Hersteld conform 1.24 — één rij per bedrijf, de rijkste behouden, de aanvulling eraan gehangen |
| Beide | Fundament | **1.26** (een verminkte skillweergave is geen bestandsdefect), **1.27** (een citaat is woordelijk of het is geen citaat), **1.28** (de exacte-tekenreeksronde is verplicht op elk e-mailadres) |
| Beide | Telling van de opzichter | **ONJUIST** — de gemelde kaart `## 1. Van der Zee Hoveniersbedrijf — Rottevalle` bestaat in geen van beide bestanden; beide voeren nul genummerde kaarten |

Azzouz, 9 september 2026
