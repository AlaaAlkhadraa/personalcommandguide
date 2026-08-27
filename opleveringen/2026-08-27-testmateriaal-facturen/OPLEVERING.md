# Oplevering 2026-08-27 — Testmateriaal: 10 synthetische factuurdocumenten

ملخص سريع بالعربي، والتفاصيل بالهولندية تحت.

## الملخص بالعربي

عملت سكربت بيولّد **10 فواتير هولندية اصطناعية** بمجلد `tests/testfacturen/`،
جاهزة للوحدة الثالثة (استخراج بالذكاء الاصطناعي).

كل فاتورة فيها العناصر اللي بتكون بفاتورة هولندية حقيقية: رقم غرفة التجارة
(KvK)، الرقم الضريبي (btw-id)، رقم الآيبان (IBAN بأرقام تحقق صحيحة فعلاً)،
و"Factuurdatum" و"Vervaldatum" و"Totaal incl. btw".

**التغطية**: ضريبة 21% و9% و0%، فاتورة بعدة أسطر، فاتورة فيها خصم، إشعار دائن
بمبالغ سالبة، فاتورة بصيغة الآلاف الهولندية (1.250,00)، صورة JPG بدون طبقة نص،
فاتورة بدون رقم فاتورة، وفاتورة مبالغها ما بتجمع (خطأ مقصود).

**نقطتين مهمتين**:
- السكربت **حتمي**: نفس البذرة، تواريخ ثابتة، بدون طابع زمني بالملفات، وبدون
  إنترنت. شغّلته مرتين وقارنت البصمات: الملفات متطابقة بايت ببايت.
- كتبت مولّد الـ PDF ومرمّز الـ JPEG **بيدي** بدون أي مكتبة خارجية، لأن
  الـ stack بالمستند محدّدة (Python, SQLite, Pydantic, pytest) والانحراف عنها
  بدّه استشارة.

**النتيجة**: 10 ملفات + `overzicht.json` بالقيم الصحيحة، والـ 75 اختبار ضلّوا
ناجحين. الكومِت: `16e745e`.

---

## Details (Nederlands)

### Wat het script maakt

`python tests/genereer_testfacturen.py` → tien bestanden in
`tests/testfacturen/`:

| Bestand | Waarvoor | Verwacht |
|---|---|---|
| `01-standaard-21procent.pdf` | gewone inkoopfactuur, hoog tarief | gevalideerd |
| `02-catering-9procent.pdf` | laag tarief van 9% | gevalideerd |
| `03-verzekering-0procent.pdf` | nultarief, btw-bedrag 0,00 | gevalideerd |
| `04-meerdere-regels-21procent.pdf` | vier regels samen 663,90 | gevalideerd |
| `05-met-korting-21procent.pdf` | kortingsregel van -61,90 | gevalideerd |
| `06-creditnota-21procent.pdf` | negatieve bedragen (-544,50) | gevalideerd |
| `07-duizendtal-21procent.pdf` | `1.250,00` met punt als duizendtal | gevalideerd |
| `08-scan-zonder-tekstlaag.jpg` | foto/scan, geen tekstlaag | review_nodig |
| `09-zonder-factuurnummer.pdf` | factuurnummer ontbreekt | review_nodig |
| `10-bedragen-kloppen-niet.pdf` | 300,00 + 63,00 staat als 383,00 | review_nodig |

Elk document heeft KvK-nummer, btw-identificatienummer, IBAN, "Factuurdatum",
"Vervaldatum", een regeltabel en een totalenblok met "Totaal incl. btw".

### Gecontroleerd, niet aangenomen

**Determinisme** — twee keer gedraaid en de sha256 van elk bestand vergeleken:

```
DETERMINISME: identiek
```

**IBAN's** — de controlegetallen zijn narekend met mod-97; alle negen IBAN's
geven rest 1, dus ze zijn formeel geldig (de rekeningnummers zijn verzonnen).

**Tekstextractie** — alle negen PDF's geven `gelezen` via `lees_pdf_tekst`; de
JPG geeft `review_nodig`. Voorbeeld van de uitgelezen tekst (factuur 07):

```
Bouwadvies Rijnmond
FACTUUR
KvK-nummer: 32205650
Btw-id: NL110353601B43
IBAN: NL61RABO7278844716
Factuurnummer: BR-2026-114
Factuurdatum: 01-07-2026
Vervaldatum: 31-07-2026
Omschrijving Aantal Stukprijs Bedrag
Constructieadvies project Waalhaven 25 50,00 1.250,00
Subtotaal excl. btw 1.250,00
Btw 21% 262,50
Totaal incl. btw 1.512,50
```

**Validatie** — de grondwaarheid van alle tien door `valideer_factuur` gehaald:
zeven keer `gevalideerd`, drie keer `review_nodig`, precies zoals bedoeld. De
creditnota met negatieve bedragen komt er netjes doorheen.

**De JPEG** — gedecodeerd en teruggelezen: het bestand is een geldige
baseline-JPEG van 827×1169 waarin "Drukkerij Het Anker", "FACTUUR" en
"Totaal incl. btw" leesbaar in de pixels staan.

### Geen nieuwe afhankelijkheid

PIL, reportlab en fpdf zijn geen van alle beschikbaar, en de stack ligt vast
in het projectdocument (Python, SQLite, Pydantic v2, pytest — "niet van
afwijken zonder overleg"). Daarom zijn de schrijvers met de hand gemaakt:

- `tests/testmateriaal/pdf_schrijver.py` — tekst links/rechts uitgelijnd, vet,
  lijnen; Helvetica met WinAnsiEncoding zodat het euroteken werkt.
- `tests/testmateriaal/bitmapfont.py` — 5×7 bitmapfont (76 tekens).
- `tests/testmateriaal/jpeg_schrijver.py` — baseline-JPEG in grijswaarden met
  de standaardtabellen uit de specificatie (bijlage K), inclusief DCT,
  kwantisatie, Huffman-codering en 0xFF-opvulling.

`requirements.txt` is dus onveranderd: `pydantic`, `pypdf`, `pytest`.

### Twee keuzes die ik zelf heb gemaakt

1. **`overzicht.json` toegevoegd.** Naast de tien bestanden schrijft het script
   een JSON met per bestand: waar het voor bedoeld is, de verwachte status en
   de juiste waarden. Zonder die grondwaarheid kan module 3 straks nergens
   tegen worden afgerekend. Niet expliciet gevraagd — zeg het als je het er
   liever uit hebt.
2. **Het script rekent zijn eigen facturen na.** `controleer()` valideert vóór
   het schrijven dat de regels optellen tot het subtotaal, dat het btw-bedrag
   klopt met het percentage en dat excl + btw = incl — behalve bij factuur 10,
   waar juist wordt afgedwongen dat het *niet* klopt. Zo kan een typefout in
   het testmateriaal niet ongemerkt doorglippen.

### Bevinding voor module 3 (niet gefixt, conform Gouden regel 7)

De JPG geeft `review_nodig` met reden *"kon de PDF niet lezen: PdfStreamError"*
in plaats van *"geen tekstlaag gevonden, mogelijk een scan"*. Functioneel klopt
het — het document gaat naar review — maar de reden is misleidend: een foto is
geen kapotte PDF. De opslag accepteert `.jpg` wél (witte lijst), dus dit is een
reëel pad. Voorstel voor module 3: `lees_pdf_tekst` laten kijken naar de
bestandssoort en bij een afbeelding de scan-reden geven. Nu niet gebouwd.

### Testresultaat

```
75 passed in 0.20s
```

### Commit

- `16e745e` — Testmateriaal: script dat 10 synthetische Nederlandse
  factuur-PDF's genereert (branch `claude/nl-accounting-invoice-module-f2vzr3`)
