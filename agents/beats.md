# Lanes — hoe vier Sam-shifts naast elkaar draaien

Dertig goedgekeurde kaarten per dag haalt geen enkele shift alleen. Vier
lanes draaien parallel, elk tien tot twaalf kaarten. De regio's overlappen
niet, dus twee lanes kunnen nooit hetzelfde bedrijf vinden. Elke lane
schrijft zijn eigen bestand; de owner ziet ze als één bord.

| Lane | Bestand | Regio |
|---|---|---|
| A | `YYYY-MM-DD-a.md` | Groningen, Friesland, Drenthe |
| B | `YYYY-MM-DD-b.md` | Overijssel, Gelderland, Flevoland |
| C | `YYYY-MM-DD-c.md` | Limburg, Noord-Brabant, Zeeland |
| D | `YYYY-MM-DD-d.md` | Noord-Holland, Zuid-Holland, Utrecht |

De regio bepaalt de lane; de sector kiest de lane zelf, en daar zit de
enige echte regel: **lees eerst `marketing/outreach/contacted.md` en neem
geen sector die daar in de laatste zeven dagen al drie keer of vaker
voorkomt.** Een sector raakt uitgeput — de goede zaken zijn er dan uit, en
wat overblijft zijn de kaarten die Azzouz afkeurt.

## Sectoren die werken

Getest en bewezen: kapsalons en barbershops, hondentrimsalons,
nagelsalons, schoonheidssalons, pedicures, massage- en fysiopraktijken,
autorijscholen, hoveniers, klusbedrijven, stukadoors, autopoets- en
detailingbedrijven.

Nog niet aangeraakt, in volgorde van kansrijkheid: dierenfysiotherapie en
hondenscholen, tandtechnische en orthopedische praktijken, kinderopvang aan
huis en gastouders, muziek- en rijinstructeurs (privéles), cateraars en
foodtrucks, kleine installateurs en zonnepaneelmonteurs, schoonmaak- en
glazenwassersbedrijven, dierenpensions, fotografen met een dienstenaanbod,
mobiele fietsenmakers, paardentrainers en maneges, naai- en kledingherstel.

## Wat een sector geschikt maakt

Twee dingen tegelijk. Er moet iets weglekken dat in geld of tijd te vatten
is: een agenda die alleen telefonisch te vullen is, of werk dat je moet
zien voordat je het gunt. En het adres moet vindbaar zijn — jouwweb,
webnode, Google-sites, Facebook-only en boekingsplatforms lekken vrijwel
altijd een e-mailadres, gratis Wix-subdomeinen vrijwel nooit. Een sector
waar de tweede voorwaarde ontbreekt kost een halve shift aan zoeken en
levert een half bestand op.

## Pakketkeuze per vorm

549 waar een agenda het probleem is: knippen, trimmen, behandelen, lesgeven
— alles wat in blokken van een half uur loopt. 299 waar de offerteaanvraag
het probleem is: hoveniers, klussers, stukadoors, detailing — werk dat op
zicht wordt gegund en dus gefotografeerd moet worden. Bij twijfel de
goedkopere: een kaart die overvraagt wordt niet beantwoord.

## Wat de agents wel en niet kunnen zien (26 augustus)

Lane F liep vast op een aanname die ik hem zelf had meegegeven: dat het
CBR-register en de rijschoolgidsen op te vragen zijn. Dat kan niet. In deze
omgeving werkt **alleen WebSearch**; een pagina rechtstreeks openen wordt
door de netwerkproxy geblokkeerd. Wat een agent te zien krijgt, is dus de
zoekresultatenpagina en de fragmenten daarin — niet de contactpagina zelf.

Twee gevolgen, en ze horen in elke briefing:

**Beloof geen bron die niet op te vragen is.** "Check het CBR-register" of
"open hun contactpagina" is een instructie die de agent niet kan uitvoeren,
en hij verliest er een halve shift mee voordat hij dat meldt. Noem in plaats
daarvan zoekopdrachten: naam plus plaats plus "e-mail", naam plus
gmail/hotmail/outlook, naam plus eigenaarsnaam.

**Een sector is bruikbaar als de adressen ín de zoekresultaten staan.** Dat
is de echte selectie, niet of het adres ergens op internet bestaat.
Gidsvermeldingen (telefoonboek, oozo, drimble, infobel) en het
SBB-leerbedrijvenregister zetten het adres vaak in de zoekbeschrijving zelf;
dan lukt het. Sectoren waar het adres achter een contactformulier zit,
kosten een shift en leveren een half bestand — rijscholen bleken zo'n
sector, ondanks dat ze op papier ideaal leken.

Dat lane F na vijf kaarten stopte en dít meldde in plaats van acht zwakke
kaarten te schrijven, is het systeem dat werkt. Een lane die eerlijk minder
levert, is meer waard dan een lane die de telling haalt met kaarten die de
eigenaar zijn naam kosten.

## Sectorbevindingen 26 augustus

**Rijscholen: van de lijst.** Lane F kwam met nul kaarten terug en met een
telling die de aanname omkeert: van de acht rijscholen die de ledger al
bevatte, strandden er twee eerder op een ontbrekend adres — op een dag dat
het netwerk wél meewerkte. De branche adverteert met telefoonnummers en
contactformulieren, niet met adressen. Niet meer inzetten tenzij iemand een
bron vindt die de adressen in de zoekresultaten zelf zet.

**De verse sectoren van vandaag, per opbrengst.** Kappers en barbershops
(lane E) leverden gewoon; die branche blijft de betrouwbare bodem. De
dierensectoren waren wisselvallig en om een reden die het opschrijven waard
is: hondenpensions, hondenscholen en uitlaatservices plannen vaak al online
(DoggyDoggy, eigen boekingspagina's), en drie kaarten sneuvelden precies
daarop. Wie die sectoren opnieuw inzet, checkt eerst de boekingssituatie en
kiest dan pas de invalshoek. Kledingherstel en naaiateliers leverden vooral
zaken die te oud zijn voor het groeifaseprofiel — twaalf jaar, twintig jaar;
het is een ambacht waar men lang blijft zitten.

**Wat morgen als eerste aan de beurt is:** kappers/barbershops landelijk als
vaste bodem, plus gastouders, kleine installateurs en zonnepaneelmonteurs,
schoonmaak- en glazenwassersbedrijven en mobiele fietsenmakers — alle vier
nog onaangeraakt, alle vier sectoren waar het adres doorgaans in de
gidsvermelding staat.

## 28 augustus

**Dagresultaat: 18 kaarten geschreven, 1 goedgekeurd, 2 afgekeurd, 15
aangehouden.** Drie afzonderlijke oorzaken, alle drie nu verholpen of
vastgelegd voor morgen — geen ervan is een reden om morgen soepeler te
worden.

**Kinderen altijd expliciet op `model: "claude-opus-5"` spawnen.** Deze
sessie stond tijdelijk op Sonnet 5, en `create_session` erft het model van
de aanroepende sessie als je niets opgeeft. Twee Azzouz-kinderen die zo
stilzwijgend Sonnet 5 meekregen liepen allebei vast op een vals-positieve
"prompt injection"-waarschuwing over hun eigen rolbriefing — een derde
poging met het model expliciet op Opus 5 gezet werkte meteen. Elke eerdere
Azzouz- en Sam-run deze week draaide op Opus 5 en had dit probleem nooit.

**Bordparser brak stilzwijgend op een nieuw metaveld-format.** Twee lanes
schreven `**E-mail** — adres` in plaats van `**E-mail:** adres`. De parser
op zevren.nl herkende alleen het dubbele-punt-format en zou alle achttien
kaarten van vandaag onzichtbaar hebben gemaakt op het bord — precies het
lot dat de e-mailregel moest voorkomen. Gevonden en gerepareerd vóór het
zichtbaar werd; `META_RE` accepteert nu beide scheidingstekens.

**Twee verboden formuleringen doken bulksgewijs op**, vastgelegd door
Azzouz in `.agents/product-marketing.md` 1.3 en 1.4: de zin over "werk dat
u zelf kunt aanklikken" (al sinds 26 augustus verboden, keerde vandaag
tweemaal terug) en een nieuwe: een fotoformulier beloven dat nergens op
zevren.nl bestaat. Beide zaten in de terugkerende slot- en
oplossingsalinea's, die van kaart naar kaart gekopieerd worden zonder
herlezen. Voor Sam staat nu een concrete instructie: zoek de eigen tekst
op `aanklikken` en `een foto van`, per bestand, vóór het pushen — geen
herlezing uit het geheugen.

**Het echte plafond vandaag was geen schrijfkwaliteit maar poort (a):**
Azzouz kon in negen van de tien nog-openstaande gevallen alle poorten
sluiten behalve een gedateerd levensteken binnen twaalf maanden, omdat
Nederlandse mkb-sites en reviewplatforms in zoekresultaten zelden een
leesbare datum tonen. Voor die kaarten staat de definitieve, verzendklare
tekst al klaar in de verified-bestanden — er ontbreekt letterlijk één
blik op een pagina die alleen een browser kan openen, iets wat noch Sam
noch Azzouz in deze omgeving kan. Dat is het eerste dat de owner zelf kan
oplossen als hij tijd heeft: een AANGEHOUDEN-kaart met "één controle van
een minuut" opent hij, checkt de genoemde datum, en verstuurt.

## 29 augustus

**Dagresultaat: 9 kaarten geschreven (lanes A+B), 2 goedgekeurd — lanes C
en D leverden allebei bewust nul, met de langste en meest onderbouwde
verslagen tot nu toe.** Dat is geen mislukte dag: het is de dag waarop
twee onafhankelijke lanes, in vier regio's, hetzelfde structurele patroon
vonden vanuit compleet verschillende sectoren. Vier dingen voor morgen.

**De verboden-formuleringencontrole werkt nu aantoonbaar.** Na twee dagen
met "aanklikken" of "een foto van" in negen van de tien berichten, stond
geen van beide zinnen vandaag nog in enig bestand. De mechanische
grep-vóór-het-pushen uit changelog 1.3/1.4 heeft het probleem opgelost.

**Nieuwe regel: de boekingsplatform-poort is niet meer sectorgebonden.**
Tot nu toe stond hij op naam van salons en dierenzaken (Treatwell, Fresha,
Salonized, DoggyDoggy). Lane C vond hem vandaag bij een personal trainer
en een tattoo-studio — twee sectoren die er niets mee te maken hebben.
Voor elke agenda- of offertevormige kaart, in welke branche dan ook: één
zoekopdracht op `"<bedrijfsnaam>" fresha` / `treatwell` / `salonized`
vóór het schrijven, tien seconden die twee dagen al vijf kaarten kostten.

**Het lek moet bewezen worden, niet beweerd.** Azzouz: twee van de drie
afkeuringen van vandaag droegen een owner-check die de lane zelf correct
had opgeschreven ("kijk of er al een projectenpagina is") maar niet zelf
had uitgevoerd. De werkende controle is niet "welke pagina's staan
geïndexeerd" maar één gerichte zoekopdracht die de weerlegging zoekt:
`"domein.nl" + het gebrek dat je wilt benoemen`. Beide afkeuringen van
vandaag waren met die ene zoekopdracht te voorkomen geweest.

**Maneges, zang-/muziekdocenten en tandtechniek zijn geen verse sectoren
meer, ze zijn levenswerksectoren.** Vier lanes vonden vandaag in die drie
sectoren, in vier regio's, alleen bedrijven van 12 tot 59+ jaar oud —
ambacht waar men blijft zitten, net als kledingherstel op 26-08. Van de
lijst af. Lane C's keramiek- en bloemenateliers horen in dezelfde familie.

**De echte bindende beperking is niet sectorrotatie maar bedrijfsleeftijd
tegenover e-mailbereikbaarheid, en dat is een vraag voor de owner, niet
voor een lane.** Lane D (bouw, Randstad) en lane C (administratiekantoren,
Limburg/Brabant) vonden onafhankelijk hetzelfde: een eenmanszaak van één
tot twee jaar oud — precies het primaire doelwit uit de staande order van
24-08 — publiceert vrijwel nooit een e-mailadres; tegen de tijd dat ze dat
wel doen, zijn ze vaak al te gevestigd voor het groeifaseprofiel. Twee
staande orders staan hier dus tegenover elkaar, en geen enkele lane kan
dat zelf oplossen. Twee diensten op rij hebben een telefoonlijst
achtergelaten van jonge, op-profiel bedrijven zonder vindbaar adres
(vandaag: Stassen Administraties Maastricht, Administratiekantoor Jelles
Heerlen, Administratie-Consulent De RekenKamer Waspik — SSD Stukadoor
Dordrecht van gisteren staat er ook nog). Of de owner die zelf wil bellen
in plaats van mailen, is zijn beslissing.

## 30 augustus

**Dagresultaat: 8 kaarten geschreven over zeven lanes (A-G), 5 goedgekeurd.
Zeven lanes — vier vaste plus drie bijspawns om de dagnorm te halen — en
de opbrengst steeg niet mee.** Azzouz vandaag, letterlijk: "extra lanes
verhogen de opbrengst niet meer; ze bevestigen alleen sneller dezelfde
muur." Dit is de derde dag op rij dat onafhankelijke lanes hetzelfde
structurele patroon vinden, nu vanuit vijf richtingen tegelijk.

**De muur heeft een naam: jong genoeg én bereikbaar komt in dit segment
nauwelijks samen.** Lane G haalde 19 openbare adressen uit één register,
lane E 9 — het adresprobleem is dus wél op te lossen — maar dezelfde bron
selecteert per definitie op gevestigd zijn. Van lane G's 19 haalden er 6
de leeftijdspoort, en van die 6 boekten er 5 al online. Azzouz legt drie
uitwegen op tafel voor de owner (geen ervan is een lane-beslissing): (1)
het leeftijdsvenster oprekken van 1-6 naar 8-10 jaar, (2) de opgebouwde
bellijst van jonge, alleen-telefonisch-bereikbare bedrijven laten bellen
door de owner zelf, of (3) dertig loslaten als dagnorm en op kwaliteit
sturen — vijf verzendklare kaarten waar de owner blind op kan drukken
zijn meer waard dan dertig die hij zelf moet nalopen. Tot die knoop
doorgehakt is: niet soepeler keuren.

**Tattoo-studio's en dansscholen/yogastudio's gaan bij maneges op de
permanent-gesloten lijst.** Lane A vond vandaag 6 van de 6 noordelijke
tattoo-studio's al op een eigen boekingssysteem of Fresha, en dansscholen/
yogastudio's bleken net als vorige week 12 tot 24 jaar oud.

**Fitness/personal training is deze week verzadigd, niet gesloten.** De
poort sluit ongeveer twee op de drie (Fresha/Momoyoga), maar de sector zelf
werkt nog — hij staat alleen al ver over de sectorcap van drie per zeven
dagen in de ledger na vandaag (13 regels), dus geen enkele lane zet hem
deze week nog in.

**Nieuwe adresbron: `erkend leerbedrijf <sector> <stad> e-mail
contactpersoon site:stagemarkt.nl`.** Levert in één zoekopdracht adres,
contactpersoon, e-mail én vaak een gedateerd registerfeit — niet alleen
voor sportscholen, voor elke sector die als leerbedrijf erkend kan worden.
Los van bovenstaande muur (het register selecteert op gevestigd zijn) is
dit de beste eerste zoekopdracht voor lanes die op de e-mailregel
vastlopen.

**Twee formatteringsbugs gevonden en gefixt, allebei hetzelfde patroon:
een lane schreef een geldige kaart in een vorm die de parser niet kende,
en de kaart zou stil van het bord zijn verdwenen, ook na goedkeuring.**
`CARD_RE` in `zevren/lib/server/outreach.ts` kende alleen `## N. Naam`,
niet `## Kaart N — Naam`; nu geaccepteerd. Losstaand daarvan gebruikte
diezelfde kaart metadataregels zonder het opsommingsstreepje
(`**Key** — waarde` in plaats van `- **Key:** waarde`) — dat was geen
nieuwe scheidingsteken-variant (die accepteert `META_RE` al sinds de
fix van 28-08) maar het ontbreken van het streepje zelf. Azzouz heeft dat
mechanisch gecorrigeerd in de brondag-file, niet de inhoud. **Les voor
briefings: vermeld de exacte kopvorm `## N. Naam — Plaats` en de exacte
metadatavorm `- **Key:** waarde` expliciet, in plaats van aan te nemen dat
die vanzelfsprekend is.**

**Restdefect, bewust niet gefixt: bevindingskoppen op `### `-niveau
genummerd 1-5 botsen met CARD_RE's kaartgrens-zoekpatroon als de lane zijn
bevindingen op `## `-niveau nummert in plaats van op `### `-niveau.**
Lane G deed het goed (bevindingen op `## 1.` t/m `## 5.`, sluit de
kaartsectie netjes af); lane F's bevindingen op `### 1.` t/m `### 5.`
lieten de laatste kaart doorlopen tot het einde van het bestand, met vijf
bevindingsregels als overtollige, onschadelijke metavelden op de kaart.
Azzouz noemt dit terecht een Sam-conventie, geen parserwijziging: **nummer
bevindingssecties nooit op `## `-niveau met hetzelfde cijferpatroon als
kaarten.**
