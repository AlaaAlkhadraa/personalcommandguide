# Module 4 — UBL / e-facturen (zonder AI)

ملخص سريع بالعربي، والتفاصيل بالهولندية تحت.

## الملخص بالعربي

الفاتورة الإلكترونية هي ملف XML: الحقول مكتوبة فيه بأسمائها. يعني ما في شي
لازم "نتعرف عليه" أو نخمّنه — هالمسار أدق من قراءة النص ومن الذكاء الاصطناعي،
ومجاني.

- **التوجيه حسب المحتوى الحقيقي** مش حسب الامتداد: أول بايتات الملف، وبالـ XML
  اسم العنصر الجذر. ملف اسمه `factuur.pdf` بس محتواه UBL بيروح لمسار UBL.
- **PDF فيه فاتورة إلكترونية مدمجة** (Factur-X / ZUGFeRD) → مسار UBL، لأن الـ
  XML أوثق من طبقة النص. جرّبتها فعلياً بملف PDF فيه الاثنين.
- **أكثر من نسبة ضريبة** بنفس الفاتورة → **ما بنجمعهن**، بيروح للمراجعة مع
  ذكر النسب. الجمع بيطلع رقم مش موجود على أي سطر بالفاتورة.
- **إشعار دائن (CreditNote)**: UBL بيكتب المبالغ موجبة والنوع هو اللي بيحمل
  الإشارة. نظامنا ما عنده حقل "نوع المستند"، فما بقلب الإشارة لحالي — بيروح
  للمراجعة مع السؤال.
- **حماية XXE**: قست أول شي شو بيعمل المحلل الافتراضي — بيرفض الكيانات
  الخارجية بس **بيوسّع الداخلية** (يعني هجوم "billion laughs" شغّال). فبدل ما
  أدافع عن كل هجوم لحاله، رفضت الـ DTD كلها. فاتورة UBL ما بتحتاجها أصلاً.
- كل المبالغ بتمر بنفس `valideer_factuur` تبع الوحدة الأولى.

**النتيجة**: 192 اختبار كلها ناجحة (35 جديد، منهم هجوم XXE حقيقي). الكومِت:
`ef38707`.

---

## Details (Nederlands)

### Vooraf: de sectie die niet bestaat

De opdracht verwijst naar `CLAUDE.md`, sectie "Bestandssoorten (routering)".
Die sectie staat niet in `CLAUDE.md` en ook niet in het projectdocument. De
eisen 1 t/m 7 zijn op zichzelf volledig, dus daar heb ik mee gewerkt. Als er
nog een document is dat ik zou moeten kennen, hoor ik het graag.

### 1. Routeren op inhoud

`routeer_document(pad)` leest de eerste bytes en, bij XML, het hoofdelement.
De extensie doet niet mee.

| Inhoud | Route |
|---|---|
| XML met `Invoice` of `CreditNote` | `ubl` |
| PDF mét ingebedde e-factuur | `ubl` |
| PDF met tekstlaag | `tekst` |
| PDF zonder tekstlaag, of foto | `beeld` |
| iets anders | geen — `review_nodig` met reden |

Er is een test die een UBL-bestand `factuur.pdf` noemt (gaat tóch naar `ubl`)
en een echte PDF `factuur.xml` (gaat tóch naar `tekst`).

De Factur-X-PDF in de testset heeft bewust **ook** een tekstlaag, zodat
bewezen is dat de XML voorgaat en niet alleen dat hij gevonden wordt.

### 2. Velden uit UBL 2.1 (NLCIUS / EN 16931)

| Veld | Waar |
|---|---|
| factuurnummer | `cbc:ID` |
| factuurdatum | `cbc:IssueDate` |
| leverancier | `AccountingSupplierParty/Party/PartyName/cbc:Name`, anders `PartyLegalEntity/cbc:RegistrationName` |
| bedrag_excl | `LegalMonetaryTotal/cbc:TaxExclusiveAmount` |
| bedrag_incl | `LegalMonetaryTotal/cbc:TaxInclusiveAmount` |
| btw_bedrag | `TaxTotal/TaxSubtotal/cbc:TaxAmount` |
| btw_percentage | `TaxSubtotal/TaxCategory/cbc:Percent` |

### 3. Meerdere btw-tarieven

Twee `TaxSubtotal`-blokken leveren `review_nodig` op met de gevonden tarieven
erbij, en de velden `btw_percentage` en `btw_bedrag` blijven leeg. Er wordt
niets opgeteld — dat zou een getal opleveren dat op geen enkele regel van de
factuur staat.

```
de factuur heeft 2 btw-tarieven (21.00, 9.00%); het schema kent er één, dus
de verdeling moet met de hand worden beoordeeld — er wordt niets bij elkaar
opgeteld
```

### 4. Ontbrekend element

Elk ontbrekend of onleesbaar element geeft een reden die het element bij naam
noemt: *"factuurdatum ontbreekt in het bestand (verwacht bij cbc:IssueDate)"*.
Een bedrag dat geen getal is (`vierhonderd`) wordt niet overgenomen. Een leeg
`<Invoice/>` levert vijf redenen op en géén enkel ingevuld veld.

### 5. De validatie van module 1 blijft gelden

Getest met een e-factuur waarvan het totaal niet klopt, één met een datum in
de toekomst en één met 15% btw — alle drie vallen af.

### 6. XXE en uitdijende entiteiten

Ik heb eerst gemeten wat de standaardparser doet in plaats van het aan te
nemen:

```
--- standaard ElementTree op een XXE-poging ---
exception : ParseError undefined entity &lek;

--- interne entiteiten (billion laughs, klein) ---
lengte ID : 300
```

Externe entiteiten worden dus al geweigerd, maar interne worden **wel**
uitgebreid: 300 tekens uit drie regels, en dat schaalt exponentieel. In plaats
van per aanval een verdediging weigert `lees_xml_veilig` het hele stuk waarin
entiteiten worden gedeclareerd — de DTD. Een UBL-factuur heeft er nooit een
nodig.

Onderweg liep ik ertegenaan dat `ET.XMLParser` in CPython in C is geschreven
en zijn expat-handlers niet doorgeeft (`'VeiligeParser' object has no
attribute 'parser'`). De parser draait daarom rechtstreeks op `expat` met een
`TreeBuilder`; naamruimten blijven daarbij gewoon behouden, daar is een test
voor.

Vier aanvalstests: een XXE die een testbestand met de inhoud
`DIT-MAG-NOOIT-LEKKEN` probeert te lezen (en er wordt gecontroleerd dat die
tekst nergens in het resultaat opduikt), een XXE naar een netwerkadres, een
billion-laughs, en een externe DTD.

### 7. Zes testbestanden

`python tests/genereer_ubl_testbestanden.py` maakt in
`tests/testfacturen/ubl/`:

| Bestand | Waarvoor | Verwacht |
|---|---|---|
| `01-standaard-21procent.xml` | hoog tarief | gevalideerd |
| `02-diensten-9procent.xml` | laag tarief | gevalideerd |
| `03-creditnota.xml` | `CreditNote` als hoofdelement | review_nodig |
| `04-twee-btw-tarieven.xml` | 21% en 9% op één factuur | review_nodig |
| `05-zonder-factuurdatum.xml` | verplichte `IssueDate` ontbreekt | review_nodig |
| `06-factuur-x.pdf` | PDF met ingebedde e-factuur | gevalideerd |

Alle zes doorlopen:

```
OK  01-standaard-21procent.xml     route=ubl  bron=xml          gevalideerd
OK  02-diensten-9procent.xml       route=ubl  bron=xml          gevalideerd
OK  03-creditnota.xml              route=ubl  bron=xml          review_nodig
OK  04-twee-btw-tarieven.xml       route=ubl  bron=xml          review_nodig
OK  05-zonder-factuurdatum.xml     route=ubl  bron=xml          review_nodig
OK  06-factuur-x.pdf               route=ubl  bron=pdf-bijlage  gevalideerd
```

### Twee dingen die ik zelf heb ingevuld

1. **De creditnota wordt niet automatisch negatief gemaakt.** UBL noteert die
   bedragen positief; het documentsoort draagt het minteken. Ons schema kent
   geen documentsoort, dus zelf omkeren zou betekenen dat de code een
   interpretatie vastlegt die nergens te controleren is — en een verkeerd
   teken boekt een teruggave als kosten. De velden worden gelezen zoals ze er
   staan en de factuur gaat naar review met de vraag erbij. Dit is dezelfde
   openstaande kwestie als eerder gemeld: het systeem kent geen documentsoort.
2. **`.xml` staat nu op de witte lijst voor de bewaarplicht.** Een e-factuur
   is het origineel en moet net als een PDF zeven jaar bewaard kunnen worden.
   Er is een test die dat aantoont.

### Testresultaat

```
192 passed in 0.47s
```

### Commit

- `ef38707` — Module 4: UBL / e-facturen rechtstreeks uitlezen, zonder AI
