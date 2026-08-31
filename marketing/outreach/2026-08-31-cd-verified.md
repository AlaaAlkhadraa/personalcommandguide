# Verificatie — 31 augustus 2026, lanes C en D

Geverifieerd door Azzouz. Lanes A en B zijn vandaag door een tweede
verificatiekind gedaan en staan bewust niet in dit bestand.

**Aangeboden:** lane C 1 kaart, lane D 0 kaarten.
**Oordeel:** 1 GOEDGEKEURD (met correcties), 0 AFGEKEURD. Lane D's nul is
gecontroleerd en is discipline, geen ontbrekende levering — de motivering staat
onder *Lane D*.

Ik heb bij de enige kaart van vandaag de poort die Sam openliet zelf gesloten,
in plaats van hem op die grond af te keuren. Wat dat opleverde staat hieronder,
want het is de belangrijkste bevinding van deze dienst.

---

## 1. Hondentrimsalon Yuka — Rijsbergen

**GOEDGEKEURD**, met één gecorrigeerde onderwerpregel, één herschreven
openingszin en één geschrapt veld. Verstuur vóór 5 september 2026 — de reden
staat bij poort (a).

### De poorten

| Poort | Oordeel | Bewijs |
|---|---|---|
| (a) gedateerd levensteken <12 mnd | **JA, krap** | `rijsbergendigitaal.nl/2025/09/05/...` — 5 september 2025, 360 dagen oud. Legt een daad van het bedrijf vast (de opening per 01-08-2025), geen verversingsstempel van de uitgever. Haalt 1.7 dus, met vijf dagen over |
| (b) openbaar e-mailadres, hoort bij het bedrijf | **JA** | `info@hondentrimsalonyuka.nl`, door mij onafhankelijk teruggevonden naast naam, adres en 06-10971263. Draagt de handelsnaam zelf |
| (c) score-/reviewclaims kloppen | **N.v.t.** | De kaart en het bericht doen geen enkele score- of reviewbewering. Niets te weerleggen |
| (d) elke claim waar én gedekt door zevren.nl | **JA** | 549 = `offer.ts` `business`. De boekingsdemo bestaat echt: `components/demos/barbershop` is een werkende flow dienst → kapper → datum/tijd → gegevens → bevestiging, met vrije tijdsloten (`BARBER_TIME_SLOTS`, `isTimeSlotAvailable`). "Klanten kiezen zelf hun tijd" staat letterlijk in `nl.ts` bij het Business-pakket |
| (e) niet eerder benaderd | **JA** | Enige regel in `contacted.md` is Sams eigen `drafted`-regel van vandaag (r. 780) |
| (f) groeifaseprofiel, nooit klantenstop | **JA** | KvK 90089278, eenmanszaak, 1 werkzaam persoon; verhuisd uit Etten-Leur, opening nieuw pand 01-08-2025. Geen spoor van wachtlijst of klantenstop |
| (g) subject draagt gecheckt detail | **JA, na correctie** | Sams regel haalde de poort maar miste spanning; zie hieronder |
| (h) skilltabel gevuld en natrekbaar | **JA** | Vier rijen, alle vier met een aanwijsbaar gevolg. Zijn eigen mechanische controle klopt: `aanklikken` en `een foto van` komen in het bestand alleen voor in de zin waarin hij de controle beschrijft, niet in het bericht |

### Wat ik zelf heb gesloten, en waarom dat de kaart redde

Sam zette op de kaart een **Owner check**: "open `hondentrimsalonyuka.nl` en kijk
of daar inmiddels een boekingsknop staat." Dat is exact het patroon dat
`.agents/product-marketing.md` 1.5 verbiedt — een poort die de agent zelf niet
dicht kreeg, met de controle doorgeschoven naar de owner. Zijn eigen bewijs was
bovendien niet houdbaar: "geen boekingspagina geïndexeerd" terwijl er van dat
domein *geen enkele* pagina geïndexeerd is, is afwezigheid in de index en geen
afwezigheid van een boekingsknop. Dat is sinds 29-08 een afkeurgrond, en Sam
past hem in lane D vandaag zelf correct toe op Uw Bouw Nederland. Hier deed hij
het niet.

Op die grond alleen was dit een afkeuring geweest. Ik heb eerst gekeken of de
poort te sluiten was, en dat lukte:

**`hondentrimsalonyuka.nl` bestaat in DNS maar heeft geen A- of AAAA-record.**
Een controlemeting bevestigt dat het onderscheid echt is: een verzonnen domein
geeft errno -2 (bestaat niet), dit domein geeft errno -5 (bestaat, maar heeft
geen adres), en `zevren.nl` en `example.com` resolven normaal in dezelfde
omgeving. Er staat dus geen website. Daarmee is er geen pagina waarop een
boekingsknop kán staan, en het lek is niet langer aangenomen maar **bewezen**:
haar telefoon is aantoonbaar het enige kanaal. Een tweede zoekronde bevestigt
het van de andere kant — geen Fresha, Treatwell, Salonized of Tipaw, en de
gidsen noemen uitsluitend telefoon en e-mail.

De **Owner check** is daarmee vervallen en geschrapt. Het bord kost de owner
geen tabblad meer.

Let op wat dit *niet* zegt: het domein is geregistreerd en draagt haar
e-mailadres, dus zij heeft wél een domein. Sams keuze om nergens "je hebt geen
website" te schrijven blijft daarom juist — sterker nog, het is de enige veilige
vorm, want zij kan een site in aanbouw hebben. Dat verdient een compliment: dit
is precies de harde afkeurregel van 25-08 en hij is uit zichzelf nageleefd.

### De krappe poort: verstuur vóór 5 september

Het enige gedateerde spoor dat bestaat, is het openingsbericht van 5 september
2025. Alles daarnaast (TransFirm, Compadex, oozo, companyinfo,
hondenoppasgezocht) is een ongedateerde registervermelding en telt niet. Ik heb
geen recenter spoor kunnen vinden; haar Instagram bestaat wel maar is vanuit
deze omgeving niet te openen, dus "levende Instagram" is Sams karakterisering en
geen gedateerd bewijs. **Op 5 september 2026 valt deze kaart door poort (a).**
Dat is geen reden om hem nu af te keuren — 360 dagen is binnen de twaalf maanden
— maar wel om hem als eerste te versturen.

### De correcties

**1. De onderwerpregel.** Sams regel haalt poort (g) en is netjes: 35 tekens,
geen verkoop, geen cijfers, haar eigen straat. Maar hij is *gesloten* — hij
maakt een mededeling die zij al weet en laat niets open. De owner-voorbeelden
koppelen het gecheckte detail steeds aan een gat ("Donderdag tot 21:00 open —
maar wie 's avonds zoekt, vindt u niet"); die tweede helft ontbreekt hier.
Met `marketing-psychology` is dat het **Zeigarnik-effect**: een afgeronde zin
geeft geen reden om te openen.

Drie kandidaten getoetst, de twee afvallers staan hier alleen zodat de keuze
navolgbaar is:

| Kandidaat | Tekens | Oordeel |
|---|---|---|
| `Eén hond tegelijk, één telefoon` | 31 | **gekozen** |
| `De telefoon aan de Laguitensebaan` | 33 | draagt de straat, maar de spanning is zwakker |
| `Ruim een jaar aan de Laguitensebaan` (Sam) | 35 | gecheckt detail, geen open lus |

*Subject gekozen omdat* hij haar eigen verkoopregel terugleest — "één hond
tegelijk" is haar eigen positionering, openbaar terug te vinden als rustige
één-op-één behandelingen — en die in de tweede helft tegen haar knelpunt zet
zonder het te benoemen; het detail staat in de eerste 17 tekens en de hele regel
overleeft ook een afkapping op 30.

**2. De openingszin.** Omgedraaid, zodat de eerste drie woorden de draad van de
subject direct oppakken zoals de order voorschrijft. Beide gecheckte feiten
blijven staan.

**3. Eén regel voor Sam,** zodat het morgen beter gaat: *het bewijs dat een lek
bestaat mag nooit "ik vond niets" zijn als je van dat domein sowieso niets kunt
vinden — dat is dezelfde denkfout die je in lane D bij Uw Bouw Nederland zelf
correct benoemt.*

### De zeven eisen

Het lek staat in tijd en gemiste klanten, niet in techniek ✓ · het bewijs komt
volledig uit haar eigen zaak (straat, openingsdatum, één hond tegelijk) ✓ · één
beeld, doorgetrokken in plaats van verdubbeld: dezelfde beller, eerst afgehaakt
en dan om kwart over acht 's avonds boekend, expliciet verbonden met "diezelfde
persoon" ✓ · de demo draagt de bewijslast en wordt één keer genoemd, met een
concrete uitnodiging ✓ · de prijs staat er zonder verontschuldiging en zonder
offertegesprek ✓ · geen schaarste, geen haast, geen "wij zijn klein" ✓ · **178
woorden** zonder handtekening, 187 met ✓. Handtekening exact, telefoonnummer
aanwezig ✓.

### Verzendklaar

```
Eén hond tegelijk, één telefoon
```

```
Hallo,

Je werkt één hond tegelijk, en sinds 1 augustus vorig jaar doe je dat
aan de Laguitensebaan. Je handen zitten dus het grootste deel van de
dag in een vacht. Gaat de telefoon op zo'n moment, dan gaat hij gewoon
over.

Wie er belt, krijgt niemand te pakken, hangt op en zoekt de volgende
trimsalon in de buurt. Jij merkt daar niets van: je hebt die persoon
nooit gesproken en weet niet dat hij er was. En dat is het lastige
eraan — het is geen probleem dat je ziet gebeuren, het staat alleen
niet in je agenda.

Op een eigen pagina ziet diezelfde persoon welke tijden vrij zijn,
kiest er één en vult zijn naam in. Om kwart over acht 's avonds,
terwijl jij al thuis bent. Hij krijgt meteen een bevestiging, en jij
ziet 's ochtends wie erbij staat.

Dat kost 549 euro, eenmalig. Die prijs staat gewoon op zevren.nl,
samen met een boekingsdemo die echt werkt: kies er een tijd en kijk
wat er gebeurt.

Bellen mag ook, dat gaat vaak sneller dan mailen.

Met vriendelijke groet,
Alaa
ZEVREN, Maastricht
06-30958710 · zevren.nl
```

---

## Lane D — nul kaarten, en waarom dat de juiste uitkomst is

Gevraagd om te bevestigen of lane D's nul echte discipline is of een
ontbrekende levering. **Het is discipline, en het is de duurste soort: hij heeft
twee kaarten die hij had kunnen schrijven bewust niet geschreven.**

Waarop ik dat baseer:

- **Hij hield twee complete zaken tegen op precies de regel die lane C liet
  lopen.** Huiswerkbegeleiding Amersfoort en Uw Bouw Nederland hebben allebei
  adres, leeftijd, profiel en e-mail rond. Bij Uw Bouw schrijft hij op dat een
  lege zoekopdracht op `"uwbouw.nl" projecten referenties foto's` "afwezigheid
  in de index is en geen afwezigheid van een projectenpagina" — exact de
  redenering die lane C bij Yuka oversloeg. Beide op `lead - poort open` gezet
  conform 1.5. Twee kaarten die hij had kunnen inleveren, niet ingeleverd.
- **De staande order verbiedt het alternatief.** `beats.md` 30-08 sluit af met
  "Tot die knoop doorgehakt is: niet soepeler keuren." Cijfers halen door achter
  een open poort te schrijven is precies wat daar verboden wordt.
- **De muur is echt en dit is de vierde onafhankelijke bevestiging.**
  `beats.md` 30-08 en het weekrapport leggen vast dat jong-genoeg én
  bereikbaar in dit segment nauwelijks samenkomt: de bronnen die een adres
  dragen, selecteren op gevestigd-zijn. Lane D voegt er een scherpere
  formulering aan toe die ik in de eerdere verslagen inderdaad niet las: **het
  is geen verdeling met een staart die je met méér zoeken bereikt** — meer
  zoeken binnen zo'n bron levert meer gevestigde zaken, niet meer jonge. Dat is
  een echt argument, geen excuus.
- **De dienst is niet leeg.** Negenenveertig bedrijven beoordeeld,
  zesentwintig openbare adressen geverifieerd, vijf herjachten uit
  `geen-emailadres.md` alle vijf bevestigd als terecht geparkeerd, en twee
  nieuwe poortnamen vastgelegd die elke volgende lane tijd besparen:
  reserveringswidgets in horeca (TheFork, Formitable, Couverts, Resengo,
  Zenchef, Bookdinners) en `foodtruckbooking.nl` bij catering. Het onderscheid
  dat hij daarbij maakt — een **aanvraagformulier** is het lek, een **widget met
  tijdsloten** is een gesloten poort — is juist en scherp genoeg om over te
  nemen.
- **Hij meldt zijn eigen fout in plaats van hem te verbergen.** Een halve dienst
  op de directives van 17 augustus, waardoor zeven sectoren ten onrechte als vol
  golden. Dat is een dure fout, en hij staat er met de mechanische remedie bij
  (`git log -1` op de directives vóór de eerste zoekopdracht).

Twee dingen om te corrigeren, geen van beide een reden tot afkeuring:

1. **De tellingen in het bestand spreken elkaar tegen.** De kop zegt
   negenenveertig bedrijven en zesentwintig adressen; de bevinding "de muur zat
   op leeftijd" zegt tweeënveertig en achttien. Dat komt doordat de kop na de
   tweede helft is bijgewerkt en de bevinding niet. Verklaarbaar, maar een lezer
   die alleen de bevinding leest, krijgt het verkeerde getal. Werk bij een dienst
   in twee helften álle getallen bij, of zet het aantal er per helft bij.
2. **De erkend-sinds-2026-route is goud waard maar staat verkeerd geframed.**
   Hij schrijft dat de zoekopdracht "de twee moeilijkste poorten oplost en het
   probleem naar de sectorkeuze verplaatst". Dat klopt, en juist daarom hoort
   het sectorwoord er niet als tip achteraf bij te staan maar in de
   standaardvorm zelf. Ik neem hem morgen in die vorm op.

Lane D's advies om deze regio morgen te jagen op plaatsen met lage
Fresha-dichtheid, met de platformcheck als eerste zoekopdracht in plaats van als
laatste, is de beste concrete aanbeveling die er vandaag uit beide lanes komt.

## De vraag van lane C over de kopvorm — hierbij beantwoord

Sam vraagt terecht om één keer vast te leggen welke kopvorm bevindingen krijgen,
omdat de directives `### 1.` t/m `### 5.` voorschrijven terwijl `beats.md` 30-08
vastlegt dat juist een genummerde vorm bij lane F de laatste kaart liet
doorlopen. **Zijn keuze is de juiste en wordt de norm: bevindingen krijgen een
`## `-kop zonder nummer** (`## Bevinding — ...`). Kaarten houden
`## N. Naam — Plaats`. Zo kan een bevindingskop nooit met het kaartpatroon
botsen, ongeacht welk niveau de parser leest. Vastgelegd in
`.agents/product-marketing.md` 1.10, samen met de samenvattingstabel-regel.

## Gebruikte skills

| Skill | Waar toegepast | Wat het concreet veranderde |
|---|---|---|
| `cold-email` | Op de onderwerpregel van kaart 1, en op de vraag of ik hem moest laten staan | `subject-lines.md` geeft twee dingen die Sams regel raken: mobiel kapt af op 30-35 tekens, en zijn gecheckte detail ("Laguitensebaan") stond op teken 21-35 — precies op de klif. Mijn vervanging zet het detail op teken 1-17 en overleeft een afkapping op 30. Het tweede was de eis dat een subject er intern uitziet en niets pitcht; daarop haalt Sams regel het juist wél, en dat is de reden dat ik hem heb aangescherpt in plaats van vervangen door iets met meer spanning maar meer verkoopgeur. De centrale toets van de skill ("haal de personalisatie weg en kijk of de mail nog werkt") heb ik op de gekozen regel teruggelegd: zonder "één hond tegelijk" blijft er niets over, want dat is háár formulering |
| `marketing-psychology` | Op de onderwerpregel, en als controle op het bericht | Het **Zeigarnik-effect** gaf de precieze diagnose die ik anders als "hij is een beetje vlak" had opgeschreven: Sams regel is een afgeronde mededeling en laat geen lus open, en open lussen zijn wat een regel laat openen. Dat werd de enige echte correctie van vandaag. Verder als controle, niet als wijziging: **Loss Aversion** verklaart waarom de tweede alinea (het verlies) vóór de derde (de oplossing) moet staan — die volgorde stond al goed; **Theory of Constraints** bevestigt dat het bericht het knelpunt aanvalt (het enige kanaal) en niet de vraag; en **Fundamental Attribution Error**, omgekeerd, is aantoonbaar wat "je hebt die persoon nooit gesproken" doet werken. Bewust níét toegevoegd: Anchoring met de doorgestreepte 799 — dat wint misschien op papier en botst met "de prijs zonder verontschuldiging" |
| `prospecting` | Op de vraag of ik Sams poort zelf mocht sluiten | De eis dat een claim traceerbaar is naar een controleerbare bron, en niet naar het uitblijven van een zoekresultaat, is precies waarom "geen boekingspagina geïndexeerd" bij Yuka niet volstond. Dat dwong de DNS-controle af — inclusief de controlemeting met een verzonnen domein en twee bekende domeinen, want zonder die vergelijking is errno -5 net zo goed een storing in mijn eigen omgeving als een feit over haar domein |
| `product-marketing` | `.agents/product-marketing.md` als toetssteen | Ik ben eigenaar van dat bestand en heb het vandaag naar **1.10** gebracht: de kopvormregel hierboven vastgelegd, en bij "een open poort is een bevinding" de formulering toegevoegd die deze dienst opleverde — *"ik heb niets gevonden" is geen bewijs van afwezigheid wanneer je van die bron sowieso niets kunt vinden*. Verder tweemaal als beslissende toets gebruikt: 1.5 ("een open poort is een bevinding, geen kaart") tegen Sams Owner check, en 1.7 ("wiens daad draagt de datum") om te bepalen dat een openingsbericht in het dorpsnieuws wél telt en een ongedateerde gidsvermelding niet |

**Mechanische controle vóór het pushen:** het verzendklare bericht is gegrepd op
`aanklikken`, `een foto van`, `eigen naam`, `gratis` en `!` — alle vijf nul
treffers. Handtekeningblok teken voor teken vergeleken met de staande order:
identiek. Woordtelling geteld, niet geschat: 178 zonder handtekening.

---

## Samenvatting

| # | Prospect | Oordeel | Grond |
|---|---|---|---|
| 1 | Hondentrimsalon Yuka — Rijsbergen | **GOEDGEKEURD** (subject vervangen, openingszin omgedraaid, Owner check geschrapt) | Alle acht poorten dicht. De boekingspoort heb ik zelf gesloten: het domein heeft geen A-record, dus er is geen site en het lek is bewezen. Verstuur vóór 5 september, dan verloopt poort (a) |
| — | Lane D — 0 kaarten | **GEEN AFKEURING — discipline bevestigd** | Hield twee complete zaken tegen op poort (a) conform 1.5, in lijn met "niet soepeler keuren" uit `beats.md` 30-08. 49 bedrijven beoordeeld, twee nieuwe poortnamen en één herbruikbare adresroute opgeleverd |

**Dagnorm.** Eén goedgekeurde kaart uit deze twee lanes, op een norm van dertig
over alle lanes. Lanes A en B leverden vandaag volgens `2026-08-31-ab-verified.md`
allebei nul, door het tweede verificatiekind gecontroleerd en verdiend bevonden;
de dag komt daarmee op één goedgekeurde kaart over vier lanes. Dat getal wordt vandaag niet gehaald en ik heb het niet gehaald
door soepeler te keuren — conform de order. Voor de vierde dag op rij melden
onafhankelijke lanes dezelfde muur; het weekrapport van 30-08 legt drie uitwegen
voor waarvan er twee jouw beslissing zijn. Zolang die knoop niet door is, blijft
de opbrengst van vier lanes structureel onder de norm liggen.

Azzouz
