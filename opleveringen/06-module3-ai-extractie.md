# Oplevering 2026-08-27 — Module 3: AI-extractie van factuurgegevens

ملخص سريع بالعربي، والتفاصيل بالهولندية تحت.

## الملخص بالعربي

الوحدة الثالثة: النموذج بيقرأ الفاتورة ويقترح القيم، والكود بيتحقق، والإنسان
بيقرر. النموذج **ما بيحسب أبداً** — كل العمليات الحسابية ضلّت بالوحدة الأولى.

- **مسارين للإدخال**: PDF فيه طبقة نص → النص بينبعت للنموذج. صورة أو PDF ممسوح
  → الملف نفسه بينبعت كـ base64 (Claude vision). الاختيار بيصير حسب نوع الملف
  أولاً، فالـ JPG ما بينعامل كـ PDF خربان.
- **مخرجات مهيكلة**: النموذج بيعبّي استمارة ثابتة، بدون أي نص حر.
- **حقل "zekerheid" إلزامي** لكل حقل (hoog/laag) مع سبب إجباري لما تكون laag.
  حقل واحد بزكرية منخفضة → الفاتورة كلها بتروح `review_nodig`.
- **ممنوع التخمين**: حقل مش موجود → `null` + review. النموذج بيتعلّم هالشي من
  الـ system prompt وبينتحقق منه بالكود.
- **الأمان**: المفتاح بس بملف `.env` محلي، وحطّيته بالـ `.gitignore`
  **قبل** ما أكتب أي كود ذكاء اصطناعي (كومِت منفصل `0b2f714`). ما في ولا
  تسلسل شبيه بمفتاح بكل المستودع.
- **الاختبارات ما بتعمل ولا اتصال حقيقي**: 29 اختبار جديد، الـ client متزيّف
  ومحقون. مجموع 104 اختبار كلها ناجحة.
- **سكربتين برّا pytest**: واحد لاتصال حقيقي واحد، وواحد للـ eval على كل
  الفواتير العشرة مع تقرير لكل حقل (correct / fout / gemist) ودرجة إجمالية.

**نقطة مهمة**: طلبت مني أبلّغ إنّ المبالغ السالبة (إشعار دائن، فاتورة 06) مش
مدعومة بالمخطط الحالي. تحققت عملياً: **هي مدعومة وشغالة** عبر الوحدة 1 والوحدة 3.
التفاصيل والدليل تحت.

**النتيجة**: 104 اختبار ناجح. الكومِت: `e48c336`.

---

## Details (Nederlands)

### Eerst de veiligheid, daarna de code

Voordat er één regel AI-code bestond is `.env` in `.gitignore` gezet en is dat
apart gecommit (`0b2f714`). Daarna is met `git check-ignore` bewezen dat een
`.env` daadwerkelijk genegeerd wordt. De repository bevat geen enkele
sleutelachtige tekenreeks — ook geen nepsleutel met het gebruikelijke voorvoegsel, want
die laat secretscanners onnodig afgaan. `.env.voorbeeld` toont alleen de vorm.

De sleutel wordt gelezen door `boekhouding/omgeving.py` (een eigen mini-lader
van tien regels, geen extra afhankelijkheid) en gaat rechtstreeks naar de
client. Hij komt niet in een log, niet in een `__repr__` en niet in een
foutmelding: ontbreekt hij, dan is de melding "ANTHROPIC_API_KEY is niet
ingesteld — zie .env.voorbeeld", zonder waarde. Daar is een test voor.

### Twee invoerpaden

`bepaal_invoerpad()` kiest eerst op bestandssoort, dan pas op inhoud:

| Document | Pad | Wat er meegaat |
|---|---|---|
| PDF met tekstlaag | `tekst` | de uitgelezen tekst uit module 2 |
| PDF zonder tekstlaag | `beeld` | het bestand als `document`-blok (base64) |
| `.jpg` / `.jpeg` / `.png` | `beeld` | het bestand als `image`-blok (base64) |
| iets anders | — | `review_nodig`, zonder aanroep |

Daarmee is de bevinding uit de vorige oplevering opgelost: een JPG werd
behandeld als kapotte PDF. Nu gaat een plaatje meteen langs het beeldpad.

### Het formulier (structured output)

`client.messages.parse(..., output_format=FactuurExtractie)` — het model kan
dus geen vrije tekst terugsturen. Per veld:

```python
class VeldExtractie(BaseModel):
    waarde: Optional[str]              # null als het er niet staat
    zekerheid: Literal["hoog", "laag"]
    reden: Optional[str]               # verplicht zodra zekerheid "laag" is
```

Die verplichting is een `model_validator`, geen belofte in de prompt: een veld
met `zekerheid="laag"` zonder reden wordt geweigerd.

### Van extractie naar oordeel

`beoordeel_extractie()` verzamelt drie soorten redenen en zet de status:

1. `waarde is None` → "extractie: … niet op het document gevonden"
2. `zekerheid == "laag"` → "extractie: … met lage zekerheid gelezen als '…' — reden"
3. alles wat `valideer_factuur` uit module 1 vindt

Eén reden is genoeg voor `review_nodig`. De AI raakt de rekenregels niet aan:
er is een test die bewijst dat een extractie waarin het model zéker is van
300,00 + 63,00 = 383,00 alsnog wordt afgekeurd door module 1.

### Audit trail (eis 6)

Nieuwe tabel `extracties`: `administratie_id`, `document_id`, `model`,
`invoerpad`, `ruwe_respons` (de letterlijke modelrespons), `status`, `redenen`
en `aangemaakt_op`, plus vier regels per extractie in `audit_log`. Ook een
afgekeurde extractie wordt bewaard.

### Tests doen nooit een echte aanroep (eis 7)

De client wordt geïnjecteerd (`extraheer_factuur(..., client=...)`), niet
gemonkeypatcht. In de tests is dat een `NageaapteClient` die elke aanroep
opslaat. Er is dus geen sleutel nodig om de suite te draaien, en tests
controleren onder meer:

- dat er precies één aanroep per document is
- dat een onleesbaar of ontbrekend bestand **nul** aanroepen kost
- dat `output_format` het schema is (dus geen vrije tekst)
- dat de systeemprompt "Verzin nooit" en "Reken niet" bevat
- dat het tekstpad de factuurtekst meestuurt en het beeldpad de base64

### De twee scripts (eis 7 en 8)

```
python scripts/handmatige_api_proef.py [bestand]   # één echte aanroep
python scripts/eval_extractie.py                  # de eval, vraagt bevestiging
python scripts/eval_extractie.py --ja 01 07       # zonder vraag, twee bestanden
```

De eval haalt alle tien testfacturen door de extractie en telt per veld
**correct / fout / gemist**, met een totaalscore, en schrijft
`tests/testfacturen/eval-rapport.json`. Bedragen worden als Decimal
vergeleken en datums als datum, zodat de eval de inhoud meet en niet de
schrijfwijze. Een waarde die het model invult terwijl die niet op het document
staat telt als **fout** met toelichting "verzonnen" — precies het gedrag dat
Gouden regel 4 verbiedt.

Omdat de eval tien betaalde aanroepen doet, vraagt hij eerst om bevestiging.
De vergelijkingslogica is los getest zonder API (tien gevallen, alle tien goed).

### Wat ik NIET heb kunnen meten

De eval is gebouwd en de logica is geverifieerd, maar hij is **niet gedraaid**:
daar is een echte API-sleutel voor nodig en die heb ik niet. Zodra jij een
`.env` neerzet is `python scripts/eval_extractie.py` genoeg voor de eerste
score. Ik heb dus geen cijfer over hoe goed het model deze facturen leest —
dat is meetwerk dat nog openstaat.

### Correctie op de opdracht: creditnota 06

De opdracht zegt: "factuur 06 (creditnota): negatieve bedragen worden door het
huidige schema nog niet ondersteund — rapporteer dat als bekende beperking".

Dat klopt niet. Ik heb het nagerekend en negatieve bedragen werken al, zowel
via module 1 als via de nieuwe extractie van module 3:

```
via valideer_factuur (module 1): gevalideerd []
via AI-extractie (module 3):     gevalideerd []
bedrag_incl als Decimal:         -544.50
```

`Factuur` legt geen ondergrens op de bedragen op, en de rekenregels werken met
Decimal en dus net zo goed met negatieve waarden: -450,00 × 21% = -94,50 en
-450,00 + -94,50 = -544,50. Er is dus geen beperking om te omzeilen en niets
op te lossen. In de eval wordt factuur 06 daarom gewoon meegenomen als
normaal geval.

Wat wél een echte openstaande vraag is — maar níét wat er gevraagd werd, en
dus nu niet gebouwd: het systeem kent geen apart *soort* document. Een
creditnota is nu een factuur met negatieve bedragen; er is geen veld dat zegt
"dit is een creditnota" en geen koppeling naar de oorspronkelijke factuur,
terwijl beide documenten dat wel vermelden. Dat is een keuze voor een latere
module.

### Nog een openstaand punt

Het model is `claude-opus-5`. Server-side refusal-fallbacks zijn **niet**
ingeschakeld: die vragen om de beta-namespace, en `messages.parse` (de nette
weg naar structured output) zit op de gewone namespace. In plaats daarvan
wordt `stop_reason == "refusal"` expliciet afgevangen en omgezet in
`review_nodig` met reden — passend bij de Gouden regels, want een geweigerd
document mag nooit stilzwijgend doorglippen. Er is een test voor.

### Testresultaat

```
104 passed in 0.34s
```

29 nieuw voor module 3, 75 bestaand en ongewijzigd groen.

### Commits

- `0b2f714` — `.env` in `.gitignore`, vóór alle AI-code
- `e48c336` — Module 3: AI-extractie van factuurgegevens
