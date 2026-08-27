# Oplevering 2026-08-27 — Review-fixes Module 2

ملخص سريع بالعربي، والتفاصيل بالهولندية تحت.

## الملخص بالعربي

ثلاث ملاحظات من المراجعة، كلها منفّذة:

1. **إصلاح خطأ التسمية المؤقتة**: كان الاسم المؤقت ثابت (`<hash>.tmp`)، فلو
   انطلبت نسخة نفس الملف مرتين بنفس اللحظة، كل وحدة بتكتب فوق الملف المؤقت
   للتانية. صار الاسم يجي من `tempfile.mkstemp` — فريد لكل استدعاء — والتنظيف
   بصير بـ `finally`. اختبرتها عملياً بـ 20 نسخة متزامنة: ما في أخطاء، المحتوى
   سليم، وما ضل أي ملف مؤقت.
2. **امتداد الملف كباراميتر مع قائمة بيضاء**: `.pdf`, `.jpg`, `.jpeg`, `.png`.
   الامتداد بينقرأ من الملف الأصلي وبينحوّل لأحرف صغيرة. امتداد غير معروف أو
   ناقص → `review_nodig` بدون تخمين، وبدون ما ينحفظ أو ينسجّل أي شي.
3. **توثيق (بدون بناء)**: لو صار crash بين نسخ الملف وبين الـ INSERT، ممكن يضل
   ملف يتيم بدون سطر بقاعدة البيانات. مش ضياع بيانات، بس مسجّلة كنقطة مفتوحة
   لدالة تنظيف مستقبلية **بتقرّر فقط، وما بتحذف أبداً**.

**النتيجة**: 75 اختبار كلها ناجحة (11 جديد + الـ 64 القديمة). الكومِت: `761037c`.

---

## Details (Nederlands)

### 1. BUG: vaste tijdelijke naam → `tempfile.mkstemp`

`kopieer_naar_opslag` gebruikte `<hash>.tmp` als tijdelijke naam. Twee
gelijktijdige aanroepen voor hetzelfde bestand schreven daardoor in hetzelfde
tijdelijke bestand, en de één kon het bestand van de ander hernoemen terwijl
die er nog in schreef.

Nu komt de naam van `tempfile.mkstemp(dir=doel.parent, prefix=f"{hash}-",
suffix=".tmp")` — uniek per aanroep, in dezelfde map zodat `os.replace`
atomair blijft. Het opruimen gebeurt in een `finally`, dus ook als het
kopiëren halverwege misgaat blijft er niets achter. De losse helper
`verwijder_tijdelijk_bestand` is daarmee overbodig en verwijderd (geen dode
code laten staan).

**Gecontroleerd, niet aangenomen** — 20 threads die tegelijk hetzelfde bestand
kopiëren:

```
fouten: []
inhoud identiek: True
hash van bewaard bestand klopt: True
achtergebleven .tmp-bestanden: []
aantal bestanden in opslag: 1
```

### 2. Extensie als parameter, met witte lijst

- `TOEGESTANE_EXTENSIES = (".pdf", ".jpg", ".jpeg", ".png")`
- `extensie_van(bron)` — leest de extensie, schrijft hem klein, toetst hem aan
  de lijst; staat hij er niet op (of ontbreekt hij) → `None`.
- `opslagpad_voor(hash, opslagmap, extensie)` — extensie is nu een verplichte
  parameter; een waarde buiten de lijst geeft een `ValueError`
  (programmeerfout, geen datafout).
- `kopieer_naar_opslag(bron, hash, opslagmap, extensie)` — idem.
- `bewaar_document` controleert de extensie **vóór** het hashen en kopiëren.
  Onbekend → `review_nodig` met reden "bestandssoort '.docx' wordt niet
  bewaard; toegestaan: .pdf, .jpg, .jpeg, .png — controleer het origineel".
  Er wordt dan niets gekopieerd en niets geregistreerd.

Een factuur die als foto binnenkomt wordt dus bewaard als
`<hash>.jpg` in plaats van als `.pdf`, zodat het bestand later ook echt te
openen is. De originele bestandsnaam blijft opgeslagen zoals de klant hem
aanleverde (`FACTUUR.PDF` blijft `FACTUUR.PDF` in de registratie, terwijl het
bewaarde bestand `<hash>.pdf` heet).

### 3. Weesbestanden gedocumenteerd (bewust niet gebouwd)

Comment bij `bewaar_document` in `database.py`: tussen het kopiëren en de
`INSERT` zit een klein venster. Crasht het proces daartussen, dan staat het
bestand wél in de opslagmap maar is er geen regel in `documenten`. Dat is geen
dataverlies — het origineel staat er nog en dezelfde PDF opnieuw aanbieden
slaat hem gewoon weer op onder dezelfde hash — maar het kost schijfruimte en
het bestand is niet terug te vinden via de administratie.

Genoteerd als openstaand punt: een latere opruimfunctie vergelijkt de
opslagmap met de tabel `documenten` en **rapporteert** weesbestanden, nooit
stilzwijgend verwijderen — de bewaarplicht geldt ook voor die bestanden. Ook
opgenomen in de README.

### Nieuwe tests (11, totaal 75)

| Test | Wat het bewijst |
|---|---|
| `test_extensie_van_accepteert_witte_lijst` | `.pdf`, `.jpg`, `.jpeg`, `.png` worden herkend |
| `test_extensie_van_is_hoofdletterongevoelig` | `FACTUUR.PDF` → `.pdf` |
| `test_extensie_van_weigert_onbekende_soort` | `.docx`, `.exe`, geen extensie → None |
| `test_opslagpad_gebruikt_de_meegegeven_extensie` | pad eindigt op `.jpg` |
| `test_opslagpad_weigert_extensie_buiten_de_witte_lijst` | `ValueError` |
| `test_foto_van_factuur_wordt_bewaard_als_jpg` | foto wordt bewaard als `.jpg` |
| `test_png_wordt_bewaard` | `.png` werkt |
| `test_hoofdletterextensie_wordt_kleingeschreven_bewaard` | opslag `.pdf`, originele naam blijft `FACTUUR.PDF` |
| `test_onbekende_bestandssoort_geeft_review` | review_nodig, niets opgeslagen, niets geregistreerd |
| `test_bestand_zonder_extensie_geeft_review` | review_nodig |
| `test_geen_tijdelijke_bestanden_blijven_achter` | geen `.tmp` na afloop |

### Testresultaat

```
75 passed in 0.19s
```

### Commit

- `761037c` — Review-fixes module 2 (branch
  `claude/nl-accounting-invoice-module-f2vzr3`)

Zie `module1-en-2-compleet.md` in deze map voor de volledige actuele code.
