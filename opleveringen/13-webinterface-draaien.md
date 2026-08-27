# De webinterface draaien met testdata erin

Vraag: administratie aanmaken, de vijf UBL-testbestanden inladen, de server
starten, en zeggen waar hij open te krijgen is — ook op de telefoon — met per
scherm wat je zou moeten zien.

## Wat je zelf moet typen

Twee commando's in de map `boekhouding`:

```
python scripts/vul_testdata.py --met-pdf
```

```
python scripts/start_webinterface.py
```

Het eerste maakt de administratie "Mijn eenmanszaak" aan (bestaat hij al, dan
gebruikt hij die) en laadt zes documenten in. Het tweede start de server. Wat
het eerste commando afdrukt:

```
Administratie aangemaakt: Mijn eenmanszaak (nummer 1)

  01-standaard-21procent.xml   -> factuur 1  [klopt]
  02-diensten-9procent.xml     -> factuur 2  [klopt]
  03-creditnota.xml            -> factuur 3  [review nodig]
  04-twee-btw-tarieven.xml     -> factuur 4  [review nodig]
  05-zonder-factuurdatum.xml   -> factuur 5  [review nodig]
  06-factuur-x.pdf             -> factuur 6  [klopt]

6 facturen in de administratie, 3 wachten op je.
```

Deze zes werken **zonder API-sleutel**: bij een e-factuur staan de velden
letterlijk als XML in het bestand, dus er komt geen model aan te pas. Ook de
PDF niet: daar zit de e-factuur als bijlage in (Factur-X), en die gaat langs
hetzelfde pad.

## Het adres

| Waar | Adres |
|---|---|
| Op de computer waar je het start | `http://127.0.0.1:8000` |
| Op je telefoon | `http://<ip-van-die-computer>:8000`, zelfde wifi |

Voor de telefoon moet je hem wél anders starten:

```
python scripts/start_webinterface.py --netwerk
```

Hij drukt dan zelf het adres af dat je op je telefoon intypt, bijvoorbeeld
`http://192.168.1.24:8000`.

**Dit was kapot en is nu gemaakt.** Het startscript zei in zijn eigen tekst dat
je hem op je telefoon kon openen, maar hij luisterde alleen op `127.0.0.1` —
dat adres betekent "alleen deze computer zelf". Je telefoon kreeg dus niets, en
je zou zijn gaan zoeken bij je wifi terwijl het aan het script lag. Nu is het
een keuze die je zelf maakt: standaard alleen deze computer, met `--netwerk`
ook de telefoon.

Fase 1 heeft **geen login**. Met `--netwerk` kan iedereen op datzelfde wifi bij
je facturen. Doe dat dus thuis of op kantoor, nooit op wifi van een café of een
hotel.

**Ik kan hem hier niet voor je open laten staan.** Deze sessie draait op een
computer in de cloud, niet op de jouwe. Ik heb de server hier gestart en alle
schermen zelf bekeken en gefotografeerd (die staan in `opleveringen/schermen/`),
maar dat adres is vanaf jouw browser of telefoon niet te bereiken — het bestaat
alleen binnen deze machine, en die wordt na de sessie opgeruimd. De twee
commando's hierboven zetten hem in een halve minuut op je eigen computer neer.

## Wat je op elk scherm ziet

### Overzicht — `http://127.0.0.1:8000`

Bovenaan drie tellers: **3 facturen wachten op jou**, **3 klaar om goed te
keuren**, **6 facturen totaal**. Daaronder de lijst in werkvolgorde, dus niet
op datum maar op wat je moet doen:

1. Eerst de drie met een oranje merkje **review nodig**, met de eerste reden er
   direct onder: bij de creditnota dat de bedragen negatief zijn, bij factuur 4
   dat er twee btw-tarieven op één factuur staan, bij factuur 5 dat de
   factuurdatum ontbreekt.
2. Daaronder de drie die kloppen, met een groen merkje **gevalideerd**.
3. Onderaan zou komen wat al is goedgekeurd — nu nog leeg.

Per rij: leverancier, datum, bedrag inclusief btw, status. Op een telefoon is
het één kolom; op een breed scherm staan de velden naast elkaar.

### Uploaden — knop "Factuur toevoegen"

Eén veld en één knop. Op een telefoon opent het veld meteen de camera, want er
staat `capture` bij; je kunt ook een bestand kiezen (PDF, foto of XML). Na het
versturen loopt hetzelfde pad als bij de testbestanden — bewaren, routeren,
uitlezen, controleren — en kom je terug op het overzicht met de nieuwe factuur
erin.

### Reviewscherm — klik op een rij

Het belangrijkste scherm. Op een breed scherm twee kolommen, op een telefoon
onder elkaar.

- **Links het originele document.** Bij de Factur-X-PDF (factuur 6) zie je de
  echte factuur, zoals de leverancier hem heeft opgemaakt. Bij de vijf
  XML-bestanden zie je platte tekst zonder de tags — technisch klopt het, maar
  leesbaar is het niet. Dat is een echt gebrek en het staat als openstaand punt
  genoteerd; daarom is `--met-pdf` de moeite waard, dan zie je één keer hoe het
  scherm bedoeld is.
- **Rechts alle uitgelezen velden**, stuk voor stuk te wijzigen: leverancier,
  factuurdatum, factuurnummer, bedrag exclusief, btw-percentage, btw-bedrag,
  bedrag inclusief. Bij elk veld staat hoe zeker het uitlezen was. Bij een
  e-factuur is dat overal "hoog" — het stond er immers letterlijk. Bij een
  factuur die door het model is gelezen krijgt een onzeker veld een rode rand
  en de reden eronder.
- **Bovenaan de openstaande punten** in gewone taal, elk één keer. (Ze stonden
  er tot vandaag dubbel in; zie hieronder.)
- **Twee knoppen.** "Opslaan en later beoordelen" bewaart je wijzigingen, zet
  de oude waarde in de audit trail en controleert opnieuw — een correctie kan
  een factuur dus vanzelf uit review halen. "Goedkeuren" kan alléén als er geen
  openstaande punten meer zijn: bij factuur 1 is de knop aan, bij de creditnota
  staat hij uit. Verstuurt iemand het formulier tóch, dan weigert de code het
  alsnog.

## Wat er onderweg stuk bleek

Het inladen van de testdata legde meteen een fout bloot die in geen enkele test
zat, omdat je hem alleen op het scherm ziet: **elke reden stond er twee keer**.
Bij factuur 4 stond er letterlijk twee keer "btw_percentage: Field required".

De oorzaak: de validatie draait twee keer. Eerst bij het uitlezen, daarna
nog eens bij het opslaan. Beide rondes leverden hun redenen aan, dus alles wat
in allebei de rondes werd geconstateerd kwam dubbel op het scherm. Het uitlezen
geeft nu apart terug wat het zélf zag (`leesredenen` bij een e-factuur,
`extractie_redenen` bij het model), en alleen dát gaat mee. De rekencontroles
komen van één plek. Twee tests erbij die de dubbeling zouden terugvinden.

Verder is `scripts/maak_oplevering.py` toegevoegd: dat maakt `CODE-COMPLEET.md`
en de zip in één commando opnieuw, zodat ze na een taak niet meer stilletjes
kunnen verouderen.

## Tests

```
243 passed in 2.05s
```
