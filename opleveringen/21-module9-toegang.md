# Module 9 — Gebruikersaccounts en toegang

Tot nu toe was de webinterface open: wie het adres kende, kon alles. Vanaf nu
moet je inloggen, en wat je te zien krijgt hangt af van wie je bent.

Twee rollen:

- **eigenaar** (jij): ziet en beheert alle administraties;
- **klant**: ziet en beheert uitsluitend de eigen administratie(s).

Alles hieronder is echt gedraaid: server gestart, ingelogd als eigenaar en als
klant, en met de hand geprobeerd wat een klant niet mag. De schermafbeeldingen
in `schermen/` komen uit die sessie.

---

## 1. Wachtwoorden en sessies

### Het wachtwoord staat nergens leesbaar

`boekhouding/gebruikers.py` hasht met **bcrypt**. In de database staat alleen de
hash (`$2b$…`), en die is niet terug te rekenen naar het wachtwoord. Het
wachtwoord komt niet in de audit trail, niet in het toegangslogboek en niet in
een foutmelding.

```python
def hash_wachtwoord(wachtwoord: str) -> str:
    if not wachtwoord or len(wachtwoord) < 10:
        raise ValueError("een wachtwoord van minder dan 10 tekens is te makkelijk te raden")
    return bcrypt.hashpw(_voorbereid(wachtwoord), bcrypt.gensalt(RONDES)).decode()
```

`_voorbereid` hasht het wachtwoord eerst met sha256. Dat is nodig omdat bcrypt
niet verder kijkt dan 72 tekens; zonder die stap zou een lange zin stilletjes
worden afgekapt.

Bcrypt is met opzet traag (twaalf rondes). Dat kost jou een tiende seconde bij
het inloggen en het kost iemand die wachtwoorden probeert te raden jaren.

### Sessies

Na het inloggen krijg je een cookie met een willekeurig token:

- **httponly** — javascript op de pagina kan er niet bij;
- **samesite=lax** — een andere website krijgt de cookie niet mee bij een POST;
- **verloopt** — na twaalf uur is de sessie voorbij;
- **in te trekken** — uitloggen zet `ingetrokken_op`, en daarna doet het token
  niets meer.

In de database staat niet het token zelf maar de sha256-hash ervan. Wie de
database steelt kan er dus niet mee inloggen — hetzelfde idee als bij
wachtwoorden.

### Fout wachtwoord en onbekend e-mailadres zijn niet te onderscheiden

Beide geven exact dezelfde zin:

```
E-mailadres of wachtwoord klopt niet.
```

En allebei duren ze even lang. Ook bij een onbekend adres wordt er een
wachtwoord gecontroleerd, tegen een vaste onbruikbare hash:

```python
hash_waarde = gegevens["wachtwoord_hash"] if gegevens else _LEGE_HASH()
klopt = controleer_wachtwoord(wachtwoord, hash_waarde)
```

Zonder die regel zou een onbekend adres meteen terugkomen en een bestaand adres
een tiende seconde later. Aan dat verschil kun je afleiden welke e-mailadressen
een account hebben, en dat is precies de lijst die je niet wilt weggeven.

### De rem op raden

Binnen een kwartier mag één account vijf keer misgaan en één IP-adres twintig
keer. Daarna:

```
Te veel mislukte pogingen. Wacht een kwartier en probeer het opnieuw.
```

Per account, want anders probeert iemand rustig duizend wachtwoorden op jouw
adres. Per IP, want anders probeert iemand één veelgebruikt wachtwoord op
duizend adressen. De rem geldt ook als het wachtwoord daarna klopt: dat is het
hele punt.

---

## 2. De toegangscontrole staat op één plek

Niet in de routes, maar in één functie waar **elk** verzoek langsgaat:

```python
app = FastAPI(title="Boekhouding — review", dependencies=[Depends(bewaak)])
```

`bewaak` doet vier dingen, in deze volgorde:

1. **Ben je ingelogd?** Zo niet → naar het inlogscherm.
2. **Klopt het formulier?** Bij elke POST moet het csrf-teken van je eigen
   sessie meekomen.
3. **Mag je bij deze administratie?** Het nummer staat in het adres
   (`/administratie/2/…`); de eigenaar mag overal bij, een klant alleen bij de
   zijne.
4. **Mag je deze handeling?** Goedkeuren, definitief maken, crediteren,
   koppelen, de bank en de aangifte zijn van de eigenaar.

Dat het daar staat en niet in de routes is het hele punt: **een nieuwe route kan
de controle niet vergeten.** Je hoeft er bij het bouwen van scherm 40 niet meer
aan te denken.

### Geen toegang is 404, nooit 403

"Verboden" zegt: dit bestaat, maar niet voor jou. Dat is al informatie. Een klant
die `/administratie/1` intikt krijgt daarom hetzelfde te zien als bij een adres
dat niet bestaat:

> Deze pagina bestaat niet, of hoort niet bij deze administratie.

Er is een test die de twee antwoorden letterlijk met elkaar vergelijkt.

### Wat een klant nooit kan

- een andere administratie zien (404, en er lekt niets in de tekst);
- een factuur goedkeuren;
- iets definitief maken of crediteren;
- een banktransactie koppelen (dat is een boeking);
- de bank of de btw-aangifte openen;
- de uit een factuur gelezen bedragen wijzigen.

De knoppen ervoor staan er ook niet: het overzicht van een klant heeft geen
Bank en geen Btw-aangifte, en op het reviewscherm staat in plaats van de
goedkeurknop "Deze factuur wacht op goedkeuring door de boekhouder". Dat is
beleefdheid, geen beveiliging — de echte controle zit in `bewaak` en werkt ook
als iemand het adres zelf intikt.

---

## 3. Wat een klant wél mag

- **documenten aanleveren** — uploaden werkt precies zoals bij jou, inclusief
  de camera op de telefoon;
- **eigen facturen en status bekijken** — de lijst, het reviewscherm en de
  leesbare weergave van een e-factuur;
- **zien wat er nog nodig is** — de redenen waarom een factuur nog niet klaar
  is staan gewoon bij de factuur;
- **concept-verkoopfacturen opstellen** — klant kiezen, regels invullen,
  opslaan. Definitief maken doe jij.

---

## 4. Audit trail: de echte gebruiker

Elke wijziging werd tot nu toe opgeslagen met `door = "eigenaar"`, een vaste
waarde. Dat klopte niet meer zodra er twee soorten mensen inloggen.

Alle audit-regels lopen nu via één helper, en die vraagt aan de verbinding wie
er werkt:

```python
def _audit(conn, administratie_id, tabel, record_id, actie, …, door=None):
    conn.execute("INSERT INTO audit_log (…, door) VALUES (…)",
                 (…, door or huidige_gebruiker(conn)))
```

De webinterface zet dat één keer per verzoek:

```python
def verbinding():
    conn = maak_verbinding(app.state.db_pad)
    zet_gebruiker(conn, HUIDIGE_GEBRUIKER.get())
    return conn
```

Achttien plekken die eerst zelf een `INSERT INTO audit_log` deden zijn omgezet
naar die helper. Zo staat er nu bij elke regel wie het deed: `alaa@example.nl`
of `jan@example.nl`, en `systeem` alleen als er echt geen mens aan te pas kwam
(een script, een migratie).

Daarnaast is er een apart **toegangslogboek** (`toegang_log`): elke inlogpoging
(gelukt of niet, met e-mailadres, IP-adres en tijd), elke geblokkeerde poging,
elk uitloggen en elk aangemaakt account. Het wachtwoord staat er niet in — daar
is een test voor die het letterlijk in het hele logboek zoekt.

---

## 5. CSRF op alle formulieren

Zonder deze bescherming kan een andere website een verborgen formulier naar jouw
boekhouding sturen. Jouw browser stuurt de cookie netjes mee, en de boeking
gebeurt terwijl jij denkt dat je een kattenfilmpje kijkt.

Daarom heeft elke sessie een eigen teken, dat in elk formulier meekomt:

```html
<input type="hidden" name="csrf" value="{{ csrf }}">
```

Een andere site kan dat teken niet lezen (hij mag niet bij jouw pagina's) en dus
niet meesturen. Bij het inloggen zelf — daar is nog geen sessie — staat het teken
in een korte cookie en in het formulier; die twee moeten aan elkaar gelijk zijn.

Vijftien formulieren hebben het gekregen, en er is een test die elke pagina
opent en telt: **evenveel `<form>`s als csrf-velden**. Vergeet je het bij een
nieuw scherm, dan valt die test om.

---

## 6. Het eerste account

Er is geen registratiepagina en geen "maak zelf een account". Accounts ontstaan
alleen met de hand:

```
python scripts/maak_eigenaar.py --email jij@example.nl --naam "Jouw naam"
```

Het wachtwoord wordt gevraagd zodra het script draait, je typt het twee keer en
je ziet het niet in beeld. Het komt dus niet in je terminalgeschiedenis en niet
in een bestand terecht.

Een klantaccount maak je met hetzelfde script:

```
python scripts/maak_eigenaar.py --email klant@example.nl --naam "Jan Jansen" --rol klant --administratie 2
```

Een klant zonder administratie wordt geweigerd — die zou nergens bij kunnen.

`start_webinterface.py` weigert nu te starten als er nog geen account is, en
zegt welk commando je moet draaien. Anders krijg je een inlogscherm waar niets
werkt.

---

## 7. Tests

**39 nieuwe tests** in `tests/test_toegang.py`, en alle bestaande webtests
loggen nu in (dat gaat via één hulpje in `conftest.py`, zodat de tests over
boekhouden blijven gaan en niet over formuliertechniek).

De zeven die je noemde, plus wat er omheen hoort:

| Wat | Test |
|---|---|
| klant kan niet bij een andere administratie | `test_een_klant_komt_niet_bij_een_andere_administratie` (404 op elk scherm) |
| en het antwoord verraadt niets | `test_de_klant_ziet_niets_van_de_andere_administratie_in_het_antwoord` |
| klant kan niet goedkeuren | `test_een_klant_kan_niet_goedkeuren` (404 én de factuur blijft ongoedgekeurd) |
| klant kan niets definitief maken | `test_een_klant_kan_niets_definitief_maken` (blijft concept, zonder nummer) |
| uitgelogde bezoeker komt nergens binnen | `test_uitgelogde_bezoeker_komt_nergens_binnen` |
| sessie verlopen | `test_een_verlopen_sessie_komt_er_niet_meer_in` |
| csrf ontbreekt | `test_zonder_csrf_teken_gebeurt_er_niets` |
| csrf klopt niet | `test_een_verkeerd_csrf_teken_telt_ook_niet` |
| rem op mislukte pogingen | `test_de_rem_slaat_aan_per_account`, `…_per_ip`, `test_de_rem_werkt_ook_via_het_scherm` |
| dezelfde melding, hetzelfde werk | `test_onbekend_adres_en_fout_wachtwoord_geven_dezelfde_melding`, `test_ook_bij_een_onbekend_adres_wordt_er_gerekend` |
| audit trail noemt de echte gebruiker | `test_de_audit_trail_noemt_de_echte_gebruiker` |
| wat een klant wél mag | `test_wat_een_klant_wel_mag` |

**Bewezen dat ze bijten.** Elke bescherming is er één voor één uitgesloopt om te
zien of de tests het merken:

| Weggehaald | Falende tests |
|---|---|
| de csrf-controle | 2 |
| de rolcontrole | 3 |
| de administratiecontrole | 2 |
| de rem op mislukte pogingen | 3 |
| gelijke behandeling van onbekend adres | 3 |

Daarna alles teruggezet: **551 tests, allemaal groen.**

---

## Wat je nu doet

```
python scripts/maak_eigenaar.py --email jij@example.nl --naam "Alaa"
python scripts/start_webinterface.py
```

Open `http://127.0.0.1:8000`, log in, en verder werkt alles zoals je gewend
bent — met je naam en een uitlogknop rechtsboven.

## Wat er nog niet is

- **Geen scherm om accounts te beheren.** Aanmaken, wachtwoord wijzigen en een
  account blokkeren gaan via het script en de database.
- **Geen "wachtwoord vergeten".** Bewust: dat is een e-mailstroom, en die
  hoort bij een keuze over hosting.
- **`secure` op de cookie staat uit.** Dat moet aan zodra dit achter https
  draait; lokaal op http zou de cookie dan nooit worden gezet.
- **Geen tweestapsverificatie.**
- **Sessies zijn twaalf uur geldig**, niet verlengbaar en niet in te zien in
  een scherm; intrekken kan alleen door uit te loggen of via de database.
