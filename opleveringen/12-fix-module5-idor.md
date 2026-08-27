# Review-fix Module 5 — elk adres hoort bij één administratie (IDOR)

## الملخص بالعربي

ملاحظة صح ومهمة، وبالوقت الصح: كل مسارات الفواتير والمستندات صارت تحت
`/administratie/{id}/...`، وكل مسار بيمر على **دالة مشتركة وحدة**
(`hoort_bij_administratie`) بتتأكد إنّ السجل فعلاً تابع لهالإدارة.

إذا لأ → **404 مش 403**. لأن 403 ("ممنوع") بيفضح إنّ السجل موجود، وهيك اللي
عم يزيد الأرقام بشريط العنوان بيعرف وين كل شي. "مش موجود" و"تابع لغيرك"
بيعطوا **نفس الجواب بالحرف** — في اختبار بيقارن الصفحتين حرفياً.

**تحقق حي**: أنشأت إدارتين، رفعت فاتورة للأولى، وجرّبت من الثانية:

```
A بيشوف فاتورته        : 200
B بيشوف فاتورة A       : 404
B بيجيب مستند A        : 404
B بيعدّل فاتورة A      : 404
B بيوافق على فاتورة A  : 404
فاتورة A ضلت زي ما هي : leverancier='Van Dijk ICT-diensten', goedgekeurd=None
```

**النتيجة**: 241 اختبار كلها ناجحة (8 جديد).

---

## Details (Nederlands)

### Wat er is veranderd

Alle routes die een factuur of document aanraken hangen onder de
administratie:

```
/administratie/{a}/factuur/{f}
/administratie/{a}/factuur/{f}/opslaan
/administratie/{a}/factuur/{f}/goedkeuren
/administratie/{a}/document/{d}
```

### De controle staat op één plek

```python
def hoort_bij_administratie(conn, lees, record_id, administratie_id, soort):
    try:
        record = lees(conn, record_id)
    except ValueError:
        raise NietGevonden(soort)
    if record.get("administratie_id") != administratie_id:
        raise NietGevonden(soort)
    return record
```

Eén functie, gebruikt door alle vier de routes — niet per route gekopieerd.
Ze krijgt de leesfunctie mee (`lees_factuur` of `lees_document`), dus ze werkt
voor elke tabel die een `administratie_id` heeft.

### 404, niet 403

Een 403 ("mag niet") zou verklappen dát het record bestaat. Iemand die de
nummers in de adresbalk afloopt zou dan precies weten waar wat zit, ook zonder
de inhoud te zien. Bestaat-niet en hoort-bij-een-ander geven daarom hetzelfde
antwoord. Er is een test die de twee antwoordpagina's letterlijk vergelijkt:

```python
assert bestaat_wel.status_code == bestaat_niet.status_code == 404
assert bestaat_wel.text == bestaat_niet.text
assert bestaat_wel.status_code != 403
```

Een 404 rendert nu ook als gewone pagina in plaats van als brok JSON, en een
niet-bestaande administratie geeft 404 in plaats van een 200 met een melding.

### Een vangnet tegen vergeten routes

Naast de vier gevraagde tests staat er één die de code zelf leest: elke route
met een ander id dan `administratie_id` in het pad **moet**
`hoort_bij_administratie` gebruiken. Voegt iemand later een route toe en
vergeet die controle, dan valt die test om — dat is waardevoller dan vier
losse tests die alleen de routes van vandaag dekken.

### Geen omleiding van de oude paden

`/factuur/{id}` en `/document/{id}` geven nu 404. Dat is met opzet: een
omleiding zou het administratienummer uit het record moeten opzoeken, en dat
opzoeken zonder te weten wie het vraagt ís precies het lek dat we dichten.

### Live nagemeten

Twee administraties gemaakt, een factuur geüpload bij de eerste, en vanuit de
tweede geprobeerd erbij te komen:

```
  A bekijkt eigen factuur : 200
  B bekijkt factuur van A : 404
  B haalt document van A  : 404
  B slaat factuur van A op: 404
  B keurt factuur van A   : 404
  niet-bestaande factuur  : 404
  oud pad /factuur/1      : 404
  factuur A ongewijzigd   : leverancier='Van Dijk ICT-diensten', goedgekeurd=None
```

Die laatste regel is de belangrijkste: er is niet alleen een 404 teruggegeven,
er is ook werkelijk niets gewijzigd.

### Testresultaat

```
241 passed in 2.65s
```

### Commit

- `2ad0e88` — Review-fix module 5: elk adres hoort bij een administratie (IDOR)
