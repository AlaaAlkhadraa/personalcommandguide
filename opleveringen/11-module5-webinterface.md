# CLAUDE.md aangevuld + Module 5: webinterface fase 1

## الملخص بالعربي

**المهمة 1**: `CLAUDE.md` كان موجود (اتفاقيات العمل مع ZEVREN). أضفت أقسام
المشروع تحته **بدون ما أشيل ولا سطر** — تحققت بـ diff إن المحتوى الأصلي ضل
فوق زي ما هو.

**المهمة 2**: واجهة ويب بـ FastAPI + Jinja2، HTML من السيرفر، موبايل أولاً،
محلية وبدون تسجيل دخول. ثلاث شاشات:
- **القائمة**: عدّادات فوق (كم فاتورة تنطرك)، والفواتير مرتبة: اللي بدها
  مراجعة أولاً، بعدين الجاهزة للموافقة، وتحت الخالصة.
- **الرفع**: حقل واحد مع `capture` فبيفتح الكاميرا عالموبايل مباشرة.
- **المراجعة**: يسار المستند الأصلي مدمج بالصفحة، يمين الحقول قابلة للتعديل
  مع درجة اليقين لكل حقل (اليقين المنخفض بإطار أحمر وسبب تحته).

**الموافقة ما بتصير إلا إذا ما ضل أي ملاحظة**: الزر بينطفي، وكمان لو حدا بعت
الفورم بالقوة `keur_factuur_goed` بترفض. الكود بيقرر إذا **بيجوز**، والإنسان
بيقرر إذا **بيصير**.

**النتيجة**: 233 اختبار كلها ناجحة، وشغّلت الواجهة فعلياً وجرّبتها كاملة.

---

## TAAK 1 — CLAUDE.md

`CLAUDE.md` bestond al, met de werkafspraken voor ZEVREN. Ik heb de
projectsecties eronder toegevoegd en met een diff gecontroleerd dat de
oorspronkelijke inhoud er ongewijzigd boven staat:

```
=== bestaande regels nog intact? ===
ja — de oorspronkelijke inhoud staat er ongewijzigd boven
```

Nieuw erbij: Wat dit is, Gouden regels, Stack, Domeinregels, AI-module regels,
Bestandssoorten (routering), Webinterface, Werkwijze per sessie.

**Twee dingen uit die tekst zijn nog niet gebouwd** (Gouden regel 7 — alleen
bouwen wat gevraagd is, maar je moet het wel weten):

1. **btw "vrijgesteld" en "verlegd".** De domeinregels noemen ze; het schema
   kent alleen 21, 9 en 0. Een factuur met btw-verlegging valt nu dus af als
   ongeldig percentage. Dat is een echt gat voor iemand die aan een
   bouwbedrijf factureert.
2. **DOCX, XLSX en CSV.** De routeringssectie beschrijft ze; de routering kent
   ze niet en geeft "onbekende bestandssoort" — veilig, maar niet wat de
   sectie belooft. XLSX/CSV hoort volgens dezelfde sectie sowieso een aparte
   bulk-import te worden, geen factuurpad.

## TAAK 2 — Webinterface

```
python scripts/start_webinterface.py     # http://127.0.0.1:8000
```

### De drie schermen

| Scherm | Wat erop staat |
|---|---|
| Overzicht | drie tellers (wacht op jou / klaar om goed te keuren / totaal), daaronder de lijst in werkvolgorde: review_nodig eerst, dan wachtend op goedkeuring, dan afgerond. Per rij leverancier, datum, bedrag incl. en status; bij review de eerste reden eronder |
| Uploaden | één veld met `accept="image/*,.pdf,.xml" capture` — op een telefoon opent dat de camera |
| Review | links het originele document ingebed, rechts alle velden bewerkbaar met per veld de zekerheid; openstaande punten bovenaan in gewone taal |

Mobiel-eerst: één kolom op een telefoon, twee kolommen vanaf 860 pixels. De
opmaak staat in één `<style>`-blok, geen framework en geen build-stap.

### Goedkeuren

De knop staat uit zolang er openstaande punten zijn, én `keur_factuur_goed`
weigert het ook als iemand het formulier tóch verstuurt. Getest op allebei.

Goedkeuring is bewust een **aparte kolom** (`goedgekeurd_op`,
`goedgekeurd_door`) en geen derde status. `gevalideerd` zegt dat de sommen
kloppen; `goedgekeurd_op` zegt dat een mens ernaar heeft gekeken. Dat scheidt
"de code vindt het goed" van "de mens vindt het goed" — precies Gouden regel 1
— en het scheelt een tabelmigratie, want een CHECK-constraint is in SQLite niet
te wijzigen.

### Geen logica in de routes

CLAUDE.md is daar expliciet over. De routes halen gegevens op, roepen een
bestaande functie aan en geven het door aan een sjabloon:

- uploaden → `verwerk_upload` (nieuw, in `boekhouding/verwerking.py`) —
  bewaren, routeren, uitlezen, valideren en opslaan. Bewust búiten de
  webinterface, zodat dezelfde keten straks ook vanaf de opdrachtregel of een
  e-mailpostbus werkt.
- opslaan → `wijzig_factuur` — oude waarde de audit trail in, factuur opnieuw
  gevalideerd
- goedkeuren → `keur_factuur_goed`

Het originele document komt van `/document/{id}`, met het pad **uit de
database** en nooit uit het verzoek: een bezoeker kan dus geen ander bestand
van de schijf opvragen.

### Niet alleen getest maar ook echt gedraaid

Met uvicorn gestart en de hele stroom doorlopen:

```
goede e-factuur  -> /factuur/1
  knop goedkeuren: aan
onvolledige      -> /factuur/2
  knop goedkeuren: uit
  reden zichtbaar: True
  na correctie   : aan
lijst: goedgekeurd: True | volgorde review eerst: True
```

Onderweg maakte ik één meetfout die het vermelden waard is: mijn eerste
controle was `"disabled" not in pagina`, en die sloeg aan op de CSS-regel
`button[disabled]` in het stylesheet. De app deed het goed, mijn controle niet.
Daarna specifiek naar de knop zelf gekeken.

### Twee dingen die onderweg naar boven kwamen

1. **`extraheer_factuur` gooide nog een exception zonder API-sleutel.** Het
   bouwen van de client stond buiten de `try`. In de webinterface zou een
   upload dan het hele scherm laten omvallen in plaats van de factuur ter
   review te leggen. Nu is ook dat een reden. Er is een test die een upload
   doet zonder sleutel: er komt gewoon een factuur met de melding erbij.
2. **`scripts/handmatige_api_test.py` werd door pytest opgepikt** bij een run
   vanaf de repo-root, want de naam matcht het patroon `*_test.py`. Hernoemd
   naar `handmatige_api_proef.py`; `python -m pytest boekhouding` werkt nu ook
   vanaf de root.

### Eén aanname

Je bericht eindigde midden in punt 4: *"Wijzigingen gaan via de bestaande
wijzig"*. Ik heb dat gelezen als `wijzig_factuur`, inclusief audit trail en
hervalidatie — dat is ook wat er gebouwd is. Klopt dat niet, dan hoor ik het
graag.

### Testresultaat

```
233 passed in 1.94s
```

28 nieuw voor de webinterface, allemaal zonder echte API-aanroep: waar de
AI-route wordt geraakt krijgt de app een nagemaakte client mee.

### Commit

- `efc9c0f` — CLAUDE.md aangevuld en module 5: webinterface fase 1
