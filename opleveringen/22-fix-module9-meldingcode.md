# Fix: geen vrije tekst meer in het adres van het inlogscherm

Feedback: bij een mislukte login ging de melding als tekst mee in de URL
(`/inloggen?melding=<tekst>`). Twee bezwaren, allebei terecht: zo'n melding
belandt in serverlogs en in de geschiedenis van de browser, en tekst uit een
adres die op de pagina wordt getoond is de klassieke ingang voor javascript van
iemand anders. Dat Jinja standaard ontsnapt is prettig, maar het is één
instelling — en beveiliging die aan één instelling hangt, hangt aan een draadje.

## Wat er nu gebeurt

In het adres staat alleen nog een code:

```
/inloggen?fout=inloggegevens
/inloggen?fout=te_vaak
/inloggen?fout=uitgelogd
```

De zin staat in een vaste map in `boekhouding/gebruikers.py`:

```python
MELDINGEN: dict[str, tuple[str, str]] = {
    "inloggegevens": ("fout", INLOG_MISLUKT),
    "te_vaak": ("fout", TE_VAAK),
    "uitgelogd": ("melding", "Je bent uitgelogd."),
}

STANDAARDMELDING = "inloggegevens"
```

En het sjabloon zoekt hem daar zelf bij:

```jinja
{% if fout %}
  {% set soort, zin = meldingen.get(fout) or meldingen[standaardmelding] %}
  <div class="{{ 'waarschuwing' if soort == 'fout' else 'melding' }}">{{ zin }}</div>
{% endif %}
```

Een code die er niet in staat — verzonnen, verouderd, of geknoei in het adres —
geeft de standaardzin. **De waarde uit het adres wordt nooit getoond**, ook niet
ontsnapt. Er ís geen pad meer van de adresbalk naar de pagina.

Elke soort heeft zijn eigen opmaak: een fout is rood, uitloggen is groen. Dat
was eerder niet zo; "Je bent uitgelogd" stond in een rode waarschuwing.

## Nog iets wat hier vlak naast lag

`terug` komt uit hetzelfde adres en gaat na een geslaagde login rechtstreeks in
een redirect. Daar stond geen enkele controle op, dus
`/inloggen?terug=https://nep.example` stuurde je ná het inloggen naar een
vreemde site — precies het moment waarop je nergens meer op let. Dat is nu
dichtgezet:

```python
def veilig_terug(pad: Optional[str]) -> str:
    if not pad or not pad.startswith("/") or pad.startswith("//"):
        return "/"
    return pad
```

Eén schuine streep is een pad hier; twee schuine strepen is een adres op een
andere site. Alles wat daar niet aan voldoet wordt gewoon `/`.

## Tests

Zeven nieuwe tests in `tests/test_toegang.py`:

| Wat | Test |
|---|---|
| html in het adres komt nooit als html op de pagina | `test_html_in_het_adres_komt_nooit_als_html_op_de_pagina` |
| ook niet als de ontsnapping uit staat | `test_ook_zonder_de_ontsnappingsinstelling_blijft_het_veilig` |
| een onbekende code geeft de standaardzin | `test_een_onbekende_code_geeft_de_standaardzin` |
| in het adres staat een code, geen zin | `test_de_melding_staat_als_code_in_het_adres` |
| zonder code geen melding | `test_zonder_code_staat_er_geen_melding` |
| uitloggen is groen, geen rode waarschuwing | `test_uitloggen_geeft_een_nette_melding_geen_waarschuwing` |
| elke code in de map geeft ook echt een zin | `test_elke_code_in_de_map_geeft_een_zin` |
| na inloggen niet naar een andere website | `test_na_inloggen_ga_je_niet_naar_een_andere_website` |

De tweede is de belangrijkste: die rendert het sjabloon met opzet **zonder**
Jinja's ontsnapping en controleert dat `<script>alert(1)</script>` uit het adres
dan nog steeds nergens op de pagina staat. Dat is precies het punt uit je
feedback — het mag niet van die ene instelling afhangen, en dat hangt het nu
ook niet.

**Bewezen dat ze bijten:** het sjabloon teruggezet naar `{{ fout }}` en
`veilig_terug` uitgeschakeld → 8 tests vallen om. Daarna teruggedraaid.

**560 tests, allemaal groen.** En met de hand nagelopen op de draaiende server:

```
fout wachtwoord : /inloggen?fout=inloggegevens
onbekend adres  : /inloggen?fout=inloggegevens
?fout=<script>… : "E-mailadres of wachtwoord klopt niet."
terug=https://nep.example/ : /
```
