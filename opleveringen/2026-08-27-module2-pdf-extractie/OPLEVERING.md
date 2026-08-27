# Oplevering 2026-08-27 — Module 2: PDF-tekstextractie en bewaarplicht

ملخص سريع بالعربي، والتفاصيل بالهولندية تحت.

## الملخص بالعربي

بنيت الوحدة الثانية: قراءة نص الفاتورة من ملف PDF وحفظ الملف الأصلي بأمان،
**بدون أي ذكاء اصطناعي** — الوحدة الثالثة بتبني فوقها لاحقاً.

- **`lees_pdf_tekst(pad)`**: بتقرأ النص من الـ PDF بواسطة pypdf. ما بترمي أي
  استثناء أبداً: ملف مش موجود، ملف خربان، ملف مو PDF، أو PDF بدون طبقة نص
  (يعني صورة ممسوحة) → كلها بترجع `review_nodig` مع السبب. سبب الصورة
  الممسوحة حرفياً: "geen tekstlaag gevonden, mogelijk een scan".
- **حفظ الملفات حسب واجب الحفظ (7 سنين)**: الملف الأصلي بينسخ لمجلد تخزين،
  واسمه بيصير بصمة sha256 لمحتواه. ما بينكتب فوقه أبداً، وما بينحذف أبداً،
  وبيصير للقراءة فقط. نفس الـ PDF مرتين → بينعرف إنه نفس الملف، وما بينحفظ
  نسخة ثانية.
- **جدول جديد `documenten`** فيه `administratie_id` والبصمة واسم الملف الأصلي
  ومسار التخزين والوقت.
- **`facturen.document_id`**: ربط اختياري بين الفاتورة والملف الأصلي
  (foreign key)، مع سطر بسجل التدقيق.

**النتيجة**: 64 اختبار كلها ناجحة (22 اختبار جديد + الـ 42 القديمة). ملفات
الاختبار (الـ PDF) بتتولد داخل الاختبار نفسه — بدون أي تحميل من الإنترنت.
الكومِت: `43aa73e`.

---

## Details (Nederlands)

### Nieuwe bestanden en wijzigingen

| Bestand | Wat er is gebeurd |
|---|---|
| `boekhouding/documenten.py` | Nieuw: `lees_pdf_tekst`, `bereken_hash`, `opslagpad_voor`, `kopieer_naar_opslag`, en de resultaatmodellen `TekstResultaat` en `DocumentResultaat` |
| `boekhouding/database.py` | Tabel `documenten`, kolom `facturen.document_id` (foreign key), `bewaar_document`, `lees_document`, `sla_factuur_op(..., document_id=)`, `lees_audit_trail(..., tabel=)`, ALTER TABLE-migratie |
| `tests/test_documenten.py` | Nieuw: 21 tests voor extractie, hashing, opslag en koppeling |
| `tests/conftest.py` | `maak_pdf(tekst)` — bouwt in de test zelf een geldige PDF, met of zonder tekstlaag |
| `tests/test_database.py` | Test voor de migratie van een database van vóór module 2 |
| `README.md` | Uitleg van module 2 in eenvoudige taal |
| `requirements.txt` | `pypdf>=5` erbij |

### 1. `lees_pdf_tekst(pad)`

Geeft altijd een `TekstResultaat` terug, nooit een exception (Gouden regel 4).

| Situatie | Status | Reden |
|---|---|---|
| PDF met tekstlaag | `gelezen` | — |
| PDF zonder tekstlaag | `review_nodig` | "geen tekstlaag gevonden, mogelijk een scan" |
| Kapotte PDF | `review_nodig` | "kon de PDF niet lezen: …" |
| Geen PDF (bv. .txt) | `review_nodig` | "kon de PDF niet lezen: …" |
| Leeg bestand | `review_nodig` | "kon de PDF niet lezen: …" |
| Bestand bestaat niet | `review_nodig` | "bestand niet gevonden: …" |

**Afwijking van de taakomschrijving, bewust:** de opdracht noemde
`lees_pdf_tekst(pad) -> str`, maar een `str` kan geen status en reden
dragen. Om eis 1 (geen exception, wél een status met reden) te halen geeft
de functie een `TekstResultaat` terug, met de tekst in `.tekst`.

### 2. Bestandsopslag conform bewaarplicht

- Naam = sha256-hash van de inhoud, opgeslagen als
  `<opslagmap>/<hash[:2]>/<hash>.pdf` (submap zodat één map niet volloopt).
- Bestaat het doelbestand al, dan wordt er niets overschreven — de inhoud is
  per definitie identiek, want de naam ís de hash van de inhoud.
- Kopiëren gaat via een tijdelijke naam plus een atomaire rename, zodat er
  nooit een half bestand op de definitieve plek staat.
- Het bewaarde bestand wordt alleen-lezen gezet (`0o444`).
- Het origineel op de aanleverplek blijft onaangetast staan.

### 3. Tabel `documenten` en de koppeling

```
documenten(id, administratie_id, hash, originele_bestandsnaam,
           opslagpad, aangemaakt_op)   UNIQUE (administratie_id, hash)
facturen.document_id  INTEGER REFERENCES documenten(id)   -- optioneel
```

`bewaar_document` geeft drie mogelijke uitkomsten: `opgeslagen`,
`bestond_al` (dezelfde PDF, dus geen tweede kopie en geen tweede regel) of
`review_nodig`. Dezelfde PDF in twee administraties krijgt wél een eigen
registratie — het zijn aparte boekhoudingen — maar staat één keer op schijf.

### 4. Migratie

Databases van vóór module 2 missen `facturen.document_id`.
`CREATE TABLE IF NOT EXISTS` past een bestaande tabel niet aan, dus
`maak_tabellen` voegt de kolom toe met `ALTER TABLE ADD COLUMN` als hij
ontbreekt. Er is een test die precies dat pad afloopt.

### Tests (22 nieuw, 64 totaal)

Nieuw voor module 2: tekst uit PDF, PDF zonder tekstlaag, kapotte PDF,
niet-PDF, leeg bestand, ontbrekend bestand, hash-gelijkheid en -verschil,
opslaan, alleen-lezen rechten, tweede keer bewaren laat het bestand
ongemoeid, dezelfde PDF twee keer, zelfde inhoud met andere bestandsnaam,
andere PDF apart, zelfde PDF in andere administratie, ontbrekend bronbestand,
audit trail bij bewaren, koppeling factuur↔document, factuur zonder document,
niet-bestaand `document_id` geweigerd, koppeling in de audit trail, en de
migratietest.

Eén test is onderweg aangepast: de controle of het bewaarde bestand
alleen-lezen is, kijkt naar de rechten (`0o444`) en niet of schrijven een
fout geeft — de tests draaien hier als root, en root mag altijd schrijven.
Een test die "slaagt omdat niemand root is" zou een schijnzekerheid zijn.

### Testresultaat

```
64 passed in 0.17s
```

### Commit

- `43aa73e` — Module 2: PDF-tekstextractie en veilige bewaring van
  originelen (branch `claude/nl-accounting-invoice-module-f2vzr3`)

Zie `module1-en-2-compleet.md` in deze map voor de volledige actuele code.
