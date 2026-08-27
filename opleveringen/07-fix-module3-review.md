# Review-fixes Module 3 — foutafhandeling, promptversie, verzonnen, model instelbaar

ملخص سريع بالعربي، والتفاصيل بالهولندية تحت.

## الملخص بالعربي

أربع ملاحظات، كلها منفّذة:

1. **الاتصال بالـ API صار داخل `try/except`.** خطأ شبكة أو rate limit أو خطأ
   سيرفر بيصير `review_nodig` مع سبب بلغة واضحة، وما بيطلع أي استثناء برّا.
   يعني لو وقفت الفاتورة رقم 3 من كومة 20، الباقي بيكمّل عادي.
2. **`PROMPT_VERSIE`** ثابت بالكود + عمود `prompt_versie` بالجدول مع سطر
   بسجل التدقيق. قواعد البيانات القديمة بتاخد `'onbekend'` — مش النسخة
   الحالية، لأنه ما منعرف فعلاً بأي prompt انقرأت.
3. **`verzonnen` صارت فئة مستقلة** بالـ eval وفوق بالتقرير، لأنها أخطر حالة:
   التحقق ما بيمسكها. الفاتورة 09 (بدون رقم فاتورة) هي حالة الاختبار.
4. **الموديل صار قابل للتغيير**: باراميتر، وإلا `ANTHROPIC_MODEL` من `.env`،
   وإلا `claude-opus-5`. والـ eval بيقبل `--model=` وبيكتب تقرير لكل موديل.

**النتيجة**: 147 اختبار كلها ناجحة (22 جديد). الكومِت: `c5fcf7a`.

---

## Details (Nederlands)

### 1. Nooit een exception naar buiten (Gouden regel 4)

`client.messages.parse` staat nu in een `try/except`. Elke fout wordt
`review_nodig` met een reden die erbij zegt of later opnieuw proberen zin
heeft:

| Wat er misgaat | Wat de eigenaar leest |
|---|---|
| 429 | "te veel verzoeken achter elkaar (rate limit) — later opnieuw proberen" |
| 401 / 403 | "geen toegang met deze API-sleutel; controleer de sleutel in .env" |
| 404 | "het opgegeven model bestaat niet of is niet beschikbaar" |
| 400 | "de dienst wees het verzoek af als ongeldig — fout in het verzoek, niet in de factuur" |
| 5xx | "de dienst gaf een serverfout — later opnieuw proberen" |
| geen antwoord | "geen verbinding met de dienst — later opnieuw proberen" |

`foutreden()` classificeert op `status_code` in plaats van op de fouttypes van
de SDK. Elke `APIStatusError` van anthropic draagt dat veld, en zo werkt de
functie ook als de SDK niet geïnstalleerd is — wat in de testsuite het geval
is. Er is ook een test die bewijst dat een stapel doorloopt: factuur 1 faalt
op een rate limit, factuur 2 komt gewoon als `gevalideerd` binnen.

Nog een detail: de melding bij 401 zegt wél dat het aan de sleutel ligt, maar
noemt de waarde nooit. Daar is een aparte test voor.

### 2. Promptversie in de audit trail

`PROMPT_VERSIE = "v1"` staat naast `SYSTEEM_PROMPT` met de instructie hem op
te hogen zodra de prompt wijzigt. De waarde gaat de tabel `extracties` in
(nieuwe kolom `prompt_versie`) én de audit trail.

Bestaande databases krijgen de kolom via een generieke migratiehelper
`_voeg_kolom_toe()`, die nu ook de bestaande `document_id`-migratie draagt.
De default is bewust `'onbekend'` en niet `'v1'`: van een extractie van vóór
deze kolom weten we níét met welke prompt hij is gemaakt, en dat invullen zou
de audit trail een onwaarheid laten vertellen. Daar is een test voor die een
database van vóór de kolom opzet en controleert dat er `onbekend` uit komt.

### 3. `verzonnen` als eigen categorie, bovenaan

De eval telt nu vier uitkomsten in deze volgorde:

| Uitkomst | Wat het betekent |
|---|---|
| `verzonnen` | het veld staat niet op het document, maar het model vulde toch iets in |
| `fout` | er staat een andere waarde dan op het document |
| `gemist` | het document heeft de waarde wel, het model geeft niets terug |
| `correct` | de waarde klopt (ook: allebei leeg) |

`verzonnen` staat vooraan met een waarschuwing in de samenvatting en een
`!!`-markering per regel, omdat de validatie van module 1 dit type fout níét
vangt: een verzonnen factuurnummer telt gewoon op, klopt met de btw en glipt
als `gevalideerd` langs elke controle.

Uitgeprobeerd met een nagemaakte extractie (dus zonder API), waarin het model
bij factuur 09 een nummer verzint:

```
MIS 09-zonder-factuurnummer.pdf       velden 6/7  status gevalideerd (verwacht review_nodig)
    !! verzonnen  factuurnummer: '2026-VERZONNEN' staat niet op het document

==================================================================
!! VERZONNEN: 1 veld(en) ingevuld die niet op het document staan.
   Dit is de gevaarlijkste uitkomst: de validatie vangt hem niet, want een
   verzonnen waarde kan prima kloppen met de rest van de factuur.

Velden   : 70 beoordeeld
  verzonnen    1  (1%)
  fout         1  (1%)
  gemist       1  (1%)
  correct     67  (96%)
```

### 4. Model instelbaar

Volgorde: wat de aanroeper meegeeft → `ANTHROPIC_MODEL` uit `.env` →
`claude-opus-5`. De eval accepteert `--model=claude-haiku-4-5` en schrijft per
model een eigen rapportbestand (`eval-rapport-<model>.json`), zodat twee runs
elkaar niet overschrijven. `.env.voorbeeld` noemt de instelling.

### Iets wat ik erbij heb gedaan

De vergelijkingslogica van de eval staat nu óók in pytest
(`tests/test_eval_logica.py`, 21 tests). Het evalscript zelf blijft buiten
pytest omdat het echte aanroepen doet, maar hoe het een gelezen waarde met de
grondwaarheid vergelijkt is gewone rekenkunde zonder API — en juist dat moet
kloppen, anders meet de eval het verkeerde. Getest: Nederlands duizendtal
tegen Engelse notatie, ISO-datum tegen Nederlandse datum, negatieve bedragen,
onleesbare invoer die niet stiekem als goed mag tellen, en alle vier de
categorieën.

### Testresultaat

```
147 passed in 0.35s
```

### Commit

- `c5fcf7a` — Review-fixes module 3 (branch
  `claude/nl-accounting-invoice-module-f2vzr3`)
