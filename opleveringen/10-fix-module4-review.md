# Review-fixes Module 4 — groottelimiet en tekencodering

## الملخص بالعربي

ملاحظتين، الاثنتين منفّذتين:

1. **حد أقصى للحجم قبل القراءة**: `MAX_XML_BYTES` = 20 ميغابايت، بينتفحص من
   حجم الملف على القرص **قبل** ما ينقرأ. جرّبتها بملف 30 ميغابايت: ذروة
   الذاكرة **1 كيلوبايت** فقط، والحالة `review_nodig`. الفاتورة الإلكترونية
   الحقيقية حجمها كيلوبايتات، فالحد ما بيأثر على أي ملف سليم.
2. **UTF-16**: نفس هجوم الـ DTD محفوظ بـ UTF-16 (بالاتجاهين) — **بينرفض
   عادي**، ما احتاج إصلاح. بس طلع شي جنبه: `bestandssoort()` كان ما بيعرف
   UTF-16 أصلاً، يعني فاتورة إلكترونية سليمة بهالترميز كانت رح تنرفض كـ"نوع
   مجهول". معيار XML بيفرض دعم UTF-16، فصلّحتها.

**النتيجة**: 205 اختبار كلها ناجحة (13 جديد).

---

## Details (Nederlands)

### 1. Groottelimiet vóór het parsen

`MAX_XML_BYTES = 20 * 1024 * 1024` en een functie `te_groot(aantal_bytes)`.
De controle staat op drie plaatsen, zodat er geen weg omheen is:

| Waar | Wat er gecontroleerd wordt |
|---|---|
| `lees_ubl(pad)` | `pad.stat().st_size` — de grootte op de schijf, vóór `read_bytes()` |
| `routeer_document(pad)` | idem, vóórdat de XML wordt ingelezen om het hoofdelement te bepalen |
| `lees_xml_veilig(bytes)` | `len(inhoud)` — dekt de XML die uit een PDF-bijlage komt |

Nagemeten in plaats van aangenomen, met een bestand van 30 MB:

```
bestand op schijf : 30 MB
geheugenpiek      : 1 KB
status            : review_nodig
reden             : het XML-bestand is 29.5 MB en daarmee groter dan de grens
                    van 20 MB; het wordt niet ingelezen...
```

Een kilobyte piek betekent dat het bestand werkelijk niet is aangeraakt. De
grens is ruim: de echte e-facturen in de testset zijn 3 tot 4 kilobyte, en er
is een test die vastlegt dat een normale e-factuur ruimschoots binnen de grens
valt — zodat een latere verlaging van de grens meteen opvalt.

Het tweede geval uit de feedback ("een klein bestand dat naar een enorme
structuur uitpakt") wordt al gedekt door de DTD-weigering uit de vorige
oplevering: zonder entiteitsdeclaraties valt er niets uit te pakken.

### 2. De aanval in UTF-16

**De weigering werkte al.** Expat herkent de BOM en de handler vuurt gewoon,
in beide byte-volgordes. Dat is nu vastgelegd in vier tests: de DTD-aanval als
UTF-16 LE en BE (rechtstreeks en via `lees_ubl`), inclusief een controle dat er
niets uit `/etc/passwd` in het resultaat terechtkomt.

**Maar er lag een gat naast.** `bestandssoort()` keek alleen naar een
UTF-8-BOM en naar `<?xml` / `<` als losse bytes. Een UTF-16-bestand begint met
`\xff\xfe` gevolgd door `<\x00` — dat werd dus niet als XML herkend, en
`routeer_document` gaf "onbekende bestandssoort". Voor de aanval maakte dat
niets uit (die werd sowieso geweigerd), maar een **geldige** e-factuur in
UTF-16 zou zijn afgewezen. De XML-standaard schrijft ondersteuning voor die
codering voor, dus dat is een echte fout.

Nu:

```
  UTF-8      -> xml
  UTF-8 BOM  -> xml
  UTF-16 LE  -> xml
  UTF-16 BE  -> xml
  PDF        -> pdf
  zip        -> None
```

Met een test die een nette UTF-16 e-factuur er helemaal doorheen haalt: route
`ubl`, status `gevalideerd`, leverancier correct uitgelezen. De weigering mag
namelijk geen geldige bestanden meeslepen.

### Testresultaat

```
205 passed in 1.14s
```

13 nieuw: vijf voor de groottelimiet en acht voor de tekencodering.

### Commit

- `b92efcd` — Review-fixes module 4: groottelimiet voor het parsen en UTF-16
  herkennen
