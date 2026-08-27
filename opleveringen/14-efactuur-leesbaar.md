# Een e-factuur leesbaar in het reviewscherm

Feedback: bij UBL-facturen toonde het documentvak de ruwe XML
(`urn:cen.eu:en16931…`). Daar kan een mens niets mee vergelijken, en
vergelijken is het hele doel van dat scherm.

## Wat er nu staat

Links, waar eerst de XML-brij stond, staan de velden onder elkaar met bij elk
veld de UBL-plek waar het vandaan komt:

```
Factuurnummer           EF-2026-0101
cbc:ID

Factuurdatum            2026-07-14
cbc:IssueDate

Bedrag excl. btw              400.00
cac:LegalMonetaryTotal/cbc:TaxExclusiveAmount
```

Gegroepeerd zoals een factuur is opgebouwd: **Kop**, **Leverancier**,
**Afnemer**, **Bedragen**, **Btw**, **Betaling**, en daaronder de
**Factuurregels** met omschrijving, aantal, btw-percentage en bedrag.

Die herkomst staat er niet voor de sier. Een leverancier kiest zijn eigen
indeling, en zie je waar een waarde vandaan komt, dan zie je ook waarom het
systeem hem zo heeft gelezen. Staat de naam van de leverancier bij
`cac:PartyName/cbc:Name` of bij `cac:PartyLegalEntity/cbc:RegistrationName`?
Het scherm laat zien welke van de twee het is geworden.

De getoonde tekst ís bovendien het pad waarmee gezocht wordt: `_et_pad` zet
`cbc:IssueDate` om naar wat ElementTree nodig heeft. Label en werkelijkheid
kunnen dus niet uit elkaar gaan lopen, en daar is een test voor.

De ruwe XML zit achter **Toon XML**, met daaronder een knop om het origineel
te downloaden. Bij een bestand dat groter is dan 100 kB wordt alleen het begin
getoond met een verwijzing naar het hele bestand.

## Twee keuzes die het gedrag bepalen

**Een kernveld staat er altijd, ook als het ontbreekt.** Bij de factuur zonder
datum staat er letterlijk:

```
Factuurdatum            niet in het bestand
cbc:IssueDate
```

Dat een verplicht veld ontbreekt is precies wat je moet zien; dat wegmoffelen
zou het scherm laten liegen. Aanvullende velden (vervaldatum, IBAN,
KvK-nummer, plaats) staan er alleen als ze in het bestand voorkomen — anders
wordt het scherm een lijst met strepen.

**Er wordt niets opgeteld en niets omgezet.** Bij twee btw-tarieven op één
factuur staan ze allebei in beeld, elk met grondslag en bedrag:

```
Btw-percentage 1        21.00%      Btw-percentage 2         9.00%
Grondslag 1             100.00      Grondslag 2             200.00
Btw-bedrag 1             21.00      Btw-bedrag 2             18.00
```

Geen van beide wordt als hét btw-veld gepresenteerd, en 21 + 18 = 39 komt
nergens voor. Bij een creditnota blijven de bedragen positief staan zoals UBL
ze noteert; het omzetten naar een negatieve boeking blijft een beslissing van
de mens. Dat is dezelfde regel als in module 4, nu ook zichtbaar op het
scherm. Er is een test die faalt zodra er tóch iets wordt opgeteld.

## Wat er niet verandert

- **Het bewaarde bestand.** Er wordt alleen gelezen. Een test vergelijkt het
  opgeslagen bestand byte voor byte met wat er is geüpload, ná het openen van
  het reviewscherm. Voor de bewaarplicht en de audit trail blijft het
  origineel leidend.
- **Een PDF.** Die laat de browser zelf zien, en dat is precies wat je naast
  de velden wilt hebben. Ook een Factur-X-PDF (met de e-factuur als bijlage)
  houdt dus gewoon het PDF-venster.
- **De veiligheid.** De weergave leest de XML met dezelfde `lees_xml_veilig`
  als module 4: geen DTD, geen entiteiten, geen externe verwijzingen, en
  dezelfde groottegrens van 20 MB, gecontroleerd op de schijf vóór het lezen.
  Een leesvenster mag geen tweede, zwakkere ingang worden. De DTD-aanval uit
  module 4 wordt hier net zo geweigerd, ook in UTF-16.
- **De eigenaarscontrole.** Het document gaat langs dezelfde
  `hoort_bij_administratie` als de factuur. Een e-factuur van administratie A
  opvragen via het pad van B geeft 404, en in dat antwoord staat geen letter
  uit het bestand.

## Waar het staat

`boekhouding/web/ubl_weergave.py` — een nieuwe module in de weergavelaag, want
dit is tonen en geen boekhoudlogica. `ubl.py` (module 4) is niet aangeraakt:
wat er geboekt wordt, wordt nog steeds daar bepaald.

Het sjabloon `review.html` kiest tussen drie gevallen: geen document, een
e-factuur (leesbaar + Toon XML), of een ander bestand (het bestaande
documentvenster).

## Onderweg gevonden en meegenomen

- De brede XML in het uitklapvak duwde de linkerkolom op, waardoor de
  formulierkolom ernaast smaller werd. Opgelost met `min-width: 0` op de
  kolommen van het raster.
- `maak_oplevering.py` neemt nu ook bestanden mee die niet in de lijst staan,
  met een melding erbij. Anders zou een nieuw bestand stilletjes uit
  `CODE-COMPLEET.md` vallen — precies wat er met dit bestand had kunnen
  gebeuren.

## Tests

27 tests erbij: 20 op de weergavelaag zelf en 7 op het scherm.

```
270 passed in 2.53s
```

Nieuwe schermafbeeldingen staan in `opleveringen/schermen/`, waaronder
`breed-review-twee-tarieven.png` (beide tarieven in beeld terwijl de
btw-velden rechts leeg zijn) en `breed-review-ontbrekend-veld.png`.
