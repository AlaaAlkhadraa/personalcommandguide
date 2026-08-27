# Oplevering 2026-08-27 — Fix: ambigu bedrag "1.250" → review_nodig

ملخص سريع بالعربي، والتفاصيل بالهولندية تحت.

## الملخص بالعربي

**المشكلة**: مبلغ مثل `"1.250"` (نقطة واحدة و3 أرقام بعدها) غامض — ممكن يكون
1250 (صيغة هولندية، النقطة فاصل آلاف) أو 1.25 (صيغة إنجليزية). النظام كان
يقرأه 1.25، وبفاتورة ضريبتها 0% كان يمرّ من كل الفحوصات "صحيح" بمبلغ أقل
1000 مرة من الحقيقي.

**الحل** (القاعدة الذهبية 4: ممنوع التخمين): مبلغ فيه نقطة واحدة فقط متبوعة
بـ 3 أرقام بالضبط → ما ينقرأ أبداً، بيصير `review_nodig` مع السبب:
"ambigu bedrag: kan 1250,00 of 1,250 zijn — controleer het origineel".
أما `"100.00"` (رقمين بعد النقطة) و `"0.5"` و `"1.250,00"` فبتضل صالحة عادي.

**النتيجة**: 42 اختبار كلها ناجحة (3 اختبارات جديدة). الكومِت: `bc873f7`.

---

## Details (Nederlands)

### De bevinding

`"1.250"` (alleen een punt, precies 3 cijfers erna) is ambigu: Nederlands
duizendtal (1250) of Engels decimaal (1,250). Het werd als 1.25 gelezen —
bij een 0%-factuur glipte dat door alle rekencontroles heen als
"gevalideerd" met een 1000× te laag bedrag.

### De fix (`boekhouding/models.py`)

In de bedrag-parser: een bedrag met alléén een punt gevolgd door precies
3 cijfers (patroon `\d{1,3}\.\d{3}`) wordt NIET geparsed maar geeft
`review_nodig` met reden
"ambigu bedrag '…': kan 1250,00 of 1,250 zijn — controleer het origineel"
(conform Gouden regel 4: nooit gokken bij financiële velden).

Ongewijzigd geldig blijven:
- `"1.250,00"` → 1250,00 (punt én komma: punt is duizendtal)
- `"100.00"` → 100,00 (2 decimalen achter de punt)
- `"0.5"` → 0,50 (1 decimaal)
- `"100,00"` → 100,00 (komma als decimaalteken)

### Tests (3 nieuw, totaal 42)

| Test | Input | Verwacht |
|---|---|---|
| `test_ambigu_bedrag_geeft_review` | `"1.250"` | review_nodig, reden met "1250,00 of 1,250" |
| `test_groter_ambigu_bedrag_geeft_review` | `"12.500"` | review_nodig |
| `test_een_decimaal_achter_de_punt_blijft_geldig` | `"0.5"` | gevalideerd |
| bestaand: `test_nederlands_duizendtal_wordt_begrepen` | `"1.250,00"` | 1250.00 |
| bestaand: `test_punt_als_decimaalteken_wordt_begrepen` | `"100.00"` | 100.00 |

### Testresultaat

```
42 passed in 0.09s
```

### Commit

- `bc873f7` — Ambigu bedrag met alleen punt en 3 decimalen → review_nodig,
  nooit gokken (branch `claude/nl-accounting-invoice-module-f2vzr3`)

De README van de module is bijgewerkt met de nieuwe parseerregel.
Zie `module1-compleet.md` in deze map voor de actuele volledige code.
