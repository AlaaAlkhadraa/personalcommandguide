# Fix: geen enkele melding meer via het adres

Feedback: de fix bij `/inloggen` was goed, maar hetzelfde patroon stond nog op
zestien andere plekken — `?melding=<vrije tekst>` in `app.py`. Klopt. Alle
`?melding=` zijn weg; er is nu één mechanisme voor alle meldingen.

## Waarom niet overal vaste codes

Bij `/inloggen` kon dat: daar zijn maar drie meldingen en die zijn altijd
hetzelfde. Elders niet, want de melding bevat gegevens:

```
Factuur 2026-0003 is definitief en geboekt
4 nieuwe transacties ingelezen, 2 stonden er al
Gekoppeld en geboekt (boeking 12)
rekening '9999' staat niet in het schema van 2026
```

Een vaste code kan dat niet dragen. Daarom de andere aanpak die je noemde: een
**flash-melding in de sessie**.

## Hoe het werkt

De melding hoort bij de sessie, niet bij het adres. Twee kolommen op `sessies`
(met migratie, dus ook in een bestaande database), en twee functies:

```python
def zet_melding(conn, token, tekst, soort="melding") -> None
def haal_melding(conn, token) -> tuple[str, str] | None   # lezen wist meteen
```

In de webinterface is dat één hulpfunctie:

```python
def naar(pad, tekst="", soort="melding") -> RedirectResponse:
    if tekst:
        zet_melding(conn, HUIDIGE_SESSIE.get(), tekst, soort)
    return RedirectResponse(pad, status_code=303)
```

Elke route die eerder `RedirectResponse(f"…?melding={tekst}")` deed, doet nu
`naar("…", tekst)` — of `naar("…", tekst, "fout")` als er iets misging. Het
adres blijft schoon:

```
voor : /administratie/1/verkoop/1?melding=Factuur%202026-0001%20is%20definitief%20en%20geboekt
na   : /administratie/1/verkoop/1
```

Het volgende scherm haalt de melding op in `toon()`, en **lezen wist hem
meteen** — anders staat "Opgeslagen" er bij elke verversing opnieuw.

Het tonen zelf is uit de zes losse sjablonen gehaald en staat nu één keer in
`basis.html`, net boven de inhoud. Zo kan geen enkel scherm het vergeten, en
staat de melding overal op dezelfde plek. Een fout is rood, een bevestiging is
groen; dat onderscheid was er eerder niet.

## Nog iets van dezelfde familie

`terug` (waar je na het inloggen heen gaat) komt ook uit het adres, en dat komt
op het inlogscherm in een verborgen veld terecht. Die controleerde alleen nog
op "begint met één schuine streep". Nu moet het pad ook echt op een pad lijken:

```python
VEILIG_PAD = re.compile(r"^/[A-Za-z0-9/_.-]*$")
```

`/inloggen?terug=/<script>alert(1)</script>` levert dus gewoon `/` op. Niets
uit het adres komt op de pagina — ook hier niet.

## Tests

Nieuw bestand `tests/test_meldingen.py`, elf tests. De twee die je vroeg:

- **`test_geen_enkele_route_zet_vrije_tekst_in_het_adres`** — doet zeventien
  handelingen (opslaan, goedkeuren, klant toevoegen, concept maken, definitief
  maken, weggooien, crediteren, afschrift inlezen, koppelen, uitloggen …) en
  legt elk adres waarheen wordt doorverwezen langs één regel:

  ```python
  SCHOON_ADRES = re.compile(r"^/[A-Za-z0-9/_.-]*(\?fout=[a-z_]+)?$")
  ```

  Geen spatie, geen `%`, geen zin. Alleen een pad, en hoogstens de vaste code
  van het inlogscherm.

- **`test_html_in_een_melding_komt_nooit_als_html_op_de_pagina`** — stuurt
  `<script>alert(1)</script>` als grootboekrekening in. De melding die
  terugkomt bevat die tekst letterlijk; op de pagina staat hij als tekst en
  niet als html.

Plus: een tweede escape-test voor een melding die rechtstreeks in de sessie
wordt gezet, een test dat elk scherm een melding kan tonen, dat hij na één keer
lezen weg is, dat rood en groen kloppen, dat de melding van de een niet bij de
ander verschijnt, en een broncodetest die faalt zodra iemand ergens weer een
`?melding=` intikt.

**Bewezen dat ze bijten:** `naar()` teruggezet naar `?melding={tekst}` in het
adres → 4 tests vallen om, waaronder de broncodetest. Daarna teruggedraaid.

**572 tests, allemaal groen.** En met de hand nagelopen op de draaiende server:
opslaan geeft een schoon adres met een groene "Opgeslagen" erboven, een
kwaadaardige rekening geeft een rode melding met de tekst ontsnapt, en na een
verversing is de melding weg.
