# Oplevering 2026-08-26 — Boekhouding Module 1: factuur-schema, validatie en audit trail

ملخص سريع بالعربي، والتفاصيل بالهولندية تحت.

## الملخص بالعربي

بنيت أول وحدة من نظام المحاسبة للـ zzp'ers، بمجلد `boekhouding/` على البرانش
`claude/nl-accounting-invoice-module-f2vzr3`:

- **مخطط الفاتورة (Pydantic)**: المورّد، التاريخ، رقم الفاتورة، المبلغ بدون
  ضريبة، نسبة الـ btw (فقط 21 / 9 / 0 من ملف إعدادات لكل سنة)، مبلغ الضريبة،
  والمبلغ الإجمالي. المبالغ دائماً Decimal — الـ float مرفوض. الصيغة
  الهولندية مفهومة: `"1.250,00"` = 1250.00.
- **التحقق**: جمع المبالغ ونسبة الضريبة (سماحية ±€0.02)، التاريخ مش
  بالمستقبل ولا أقدم من سنتين، وفحص التكرار (مورّد + رقم فاتورة). أي خطأ
  → حالة `review_nodig` مع السبب، بدون ما تنرمي أي بيانات.
- **قاعدة البيانات (SQLite)**: كل جدول فيه `administratie_id`، وسجل تدقيق
  (audit trail) يحفظ القيم الأصلية وكل تعديل مع الوقت. ما في حذف نهائي.
  الـ foreign keys مفعّلة عبر `maak_verbinding`.
- **الاختبارات**: 39 اختبار pytest، كلها ناجحة، بما فيها المدخلات الخاطئة.

الكومِتات: `8160ad8` (البناء الأساسي) و `8bbf783` (إصلاحات المراجعة الثلاثة:
foreign keys، قراءة الأرقام الهولندية، توثيق الـ migration عند الـ CHECK).

---

## Wat is gebouwd (Nederlands)

Eerste module van het boekhoudsysteem voor Nederlandse zzp'ers, in de map
`boekhouding/` op branch `claude/nl-accounting-invoice-module-f2vzr3`.

### Onderdelen

| Bestand | Wat het doet |
|---|---|
| `boekhouding/models.py` | Pydantic v2-schema `Factuur` + `ValidatieResultaat`; Decimal verplicht, floats geweigerd, NL-notatie (`1.250,00`) begrepen |
| `boekhouding/validatie.py` | `valideer_factuur`: optelling en btw-berekening (±€0,02), datumcontroles, duplicaatcheck; elke fout → `review_nodig` met reden, nooit een exception |
| `boekhouding/btw_config.py` + `config/btw_2024..2026.json` | Toegestane btw-percentages per boekjaar in config, niet hardcoded |
| `boekhouding/database.py` | `maak_verbinding` (PRAGMA foreign_keys ON), tabellen `administraties` / `facturen` / `audit_log`, opslaan en wijzigen met volledige audit trail, geen hard delete |
| `tests/` | 39 pytest-tests inclusief foute inputs |

### Commits

- `8160ad8` — module 1: schema, validatie, SQLite-opslag met audit trail (35 tests)
- `8bbf783` — review-fixes: foreign keys afdwingen via `maak_verbinding`,
  Nederlands duizendtal-parsing, migratie-comment bij de CHECK-constraint
  (4 tests erbij)

### Testresultaat

```
39 passed in 0.10s
```

### Bewuste keuzes

- Duplicaatcheck op **leverancier + factuurnummer** binnen dezelfde
  administratie (strenger dan alleen het nummer, conform het projectdocument).
- Administratietype nu alleen `eenmanszaak`; uitbreiden vereist later een
  migratie (SQLite kan een CHECK-constraint niet wijzigen met ALTER TABLE).
- Alleen gepusht naar de aangewezen branch, niet naar `main` — mergen kan na
  review.

Zie `module1-compleet.md` in deze map voor de uitleg in eenvoudige taal plus
de volledige broncode en alle tests in één document.
