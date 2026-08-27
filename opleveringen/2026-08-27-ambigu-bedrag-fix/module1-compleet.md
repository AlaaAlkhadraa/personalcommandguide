# Boekhouding — Module 1: factuur-schema, validatie en audit trail

Eerste module van het boekhoudsysteem voor Nederlandse zzp'ers.
AI stelt voor, code valideert, mens beslist: niets wordt hier automatisch
geboekt — elke fout leidt tot status `review_nodig` met een leesbare reden.

## Installeren en testen

```
pip install -r requirements.txt
python -m pytest
```

## Wat zit erin (uitleg in eenvoudige taal)

### `boekhouding/btw_config.py` — de btw-tarieven per jaar

De toegestane btw-percentages (nu 21, 9 en 0) staan niet in de code maar in
een klein bestand per boekjaar: `config/btw_2024.json`, `btw_2025.json`,
`btw_2026.json`. Verandert de wet, dan maak je een nieuw bestand voor dat
jaar en blijft de code hetzelfde. De functie `btw_percentages_voor_jaar`
leest zo'n bestand. Bestaat er geen bestand voor het jaar van de factuur,
dan zegt de functie dat eerlijk (None) en wordt de factuur ter review
gelegd — er wordt nooit een tarief gegokt.

### `boekhouding/models.py` — het Factuur-schema

`Factuur` is het "formulier" dat beschrijft hoe een factuur eruit hoort te
zien: leverancier, factuurdatum, factuurnummer, bedrag exclusief btw,
btw-percentage, btw-bedrag en bedrag inclusief btw. Het schema bewaakt
drie dingen:

1. **Bedragen zijn altijd Decimal, nooit float.** Computers rekenen met
   floats net niet exact (0.1 + 0.2 is dan niet precies 0.3); met Decimal
   klopt elke cent. Komt er tóch een float binnen, dan wordt dat een
   review-reden. Nederlandse notatie wordt netjes begrepen: staat er
   punt én komma (`"1.250,00"`), dan is de punt duizendtalscheiding en
   de komma het decimaalteken; alleen een komma (`"100,00"`) of alleen
   een punt (`"100.00"`) is het decimaalteken. Eén uitzondering: alléén
   een punt gevolgd door precies 3 cijfers (`"1.250"`) is ambigu —
   dat kan 1250,00 (Nederlands duizendtal) of 1,250 (Engels decimaal)
   zijn. Dan wordt er niet gegokt maar wordt het `review_nodig`
   (Gouden regel 4); `"100.00"` en `"0.5"` blijven gewoon geldig.
2. **Het btw-percentage moet bestaan** in het config-bestand van het jaar
   van de factuurdatum (nu: 21, 9 of 0).
3. **Leverancier en factuurnummer mogen niet leeg zijn.**

`ValidatieResultaat` is het antwoord dat elke controle teruggeeft: de
status (`gevalideerd` of `review_nodig`), de lijst met redenen, de nette
factuur (als die te bouwen was) en altijd de originele input — er gaat
nooit data verloren.

### `boekhouding/validatie.py` — de controles

`valideer_factuur` neemt ruwe factuurgegevens (bijvoorbeeld straks uit
AI-extractie) en controleert ze stap voor stap. Belangrijk: deze functie
gooit **nooit** een exception naar buiten. Elke fout wordt een reden in
gewone taal, en alle fouten worden verzameld — niet alleen de eerste.

1. **Schema-controle**: past de data in het Factuur-formulier? Zo niet,
   dan per veld een reden en meteen status `review_nodig`.
2. **Optelling**: bedrag excl. + btw-bedrag moet het bedrag incl. zijn,
   met maximaal €0,02 speling voor afrondingen.
3. **Btw-berekening**: het btw-bedrag moet kloppen met percentage ×
   bedrag excl., ook met €0,02 speling. Deze sommen doet Python zelf met
   vaste formules — nooit een taalmodel.
4. **Datum**: niet in de toekomst en niet ouder dan 2 jaar. De peildatum
   is instelbaar (`vandaag=`) zodat tests niet van de echte klok afhangen.
5. **Duplicaat**: via een meegegeven controle-functie wordt gekeken of
   dezelfde leverancier + hetzelfde factuurnummer al in de database staat.

### `boekhouding/database.py` — opslag met audit trail

Drie SQLite-tabellen:

- **administraties** — elke boekhouding is een eigen administratie met een
  type (nu alleen `eenmanszaak`; de structuur is klaar voor later, maar
  BV-functionaliteit is bewust niet gebouwd).
- **facturen** — elke factuur hoort bij precies één administratie
  (`administratie_id`). Bedragen worden als tekst opgeslagen zodat de
  Decimal-waarde exact bewaard blijft. Ook de status, de review-redenen en
  de complete originele input staan erbij.
- **audit_log** — het logboek: wie-deed-wat-wanneer per veld, met oude en
  nieuwe waarde en een timestamp. Er is bewust géén verwijderfunctie.

De functies:

- `maak_verbinding` — opent de databaseverbinding én zet
  `PRAGMA foreign_keys = ON`. SQLite controleert foreign keys standaard
  niet; zonder deze pragma zou een factuur met een niet-bestaand
  `administratie_id` gewoon worden opgeslagen. Gebruik daarom altijd
  deze functie in plaats van `sqlite3.connect` rechtstreeks.
- `maak_tabellen` — maakt de drie tabellen aan (doet niets als ze al
  bestaan). Let op: het administratietype uitbreiden (bv. `bv`) vereist
  later een migratie, want SQLite kan een CHECK-constraint niet
  aanpassen met `ALTER TABLE`.
- `maak_administratie` — maakt een administratie aan; een ander type dan
  `eenmanszaak` wordt geweigerd.
- `sla_factuur_op` — valideert en bewaart een factuur. Ook een afgekeurde
  factuur wordt opgeslagen (met `review_nodig` en de redenen), zodat de
  eigenaar hem later kan beoordelen. Elk veld krijgt een
  "aangemaakt"-regel in het logboek. De duplicaatcheck kijkt binnen
  dezelfde administratie; dezelfde nummers in een andere administratie
  zijn geen duplicaat.
- `wijzig_factuur` — past velden aan. De oude waarde gaat eerst het
  logboek in, daarna wordt de factuur opnieuw gevalideerd: een correctie
  kan een factuur dus van `review_nodig` naar `gevalideerd` brengen (en
  andersom). De kolom met de originele input verandert nooit.
- `lees_factuur` en `lees_audit_trail` — lezen een factuur en zijn
  volledige logboek terug.

### `tests/` — de bewijslast

35 pytest-tests, één of meer per controle, inclusief foute inputs:
floats, onzin-tekst, ontbrekende velden, verkeerde btw-percentages,
toekomst- en te oude datums, duplicaten, en de audit trail bij aanmaken
en wijzigen. `python -m pytest` in deze map draait alles.

---

# Volledige broncode

## `boekhouding/boekhouding/__init__.py`

```python
"""Boekhoudsysteem voor Nederlandse zzp'ers — Module 1: factuur-schema,
validatie en audit trail.

AI stelt voor, code valideert, mens beslist (Gouden regel 1).
"""

from .models import Factuur, ValidatieResultaat
from .validatie import valideer_factuur
from .database import (
    maak_verbinding,
    maak_tabellen,
    maak_administratie,
    sla_factuur_op,
    wijzig_factuur,
    lees_factuur,
    lees_audit_trail,
)

__all__ = [
    "Factuur",
    "ValidatieResultaat",
    "valideer_factuur",
    "maak_verbinding",
    "maak_tabellen",
    "maak_administratie",
    "sla_factuur_op",
    "wijzig_factuur",
    "lees_factuur",
    "lees_audit_trail",
]
```

## `boekhouding/boekhouding/btw_config.py`

```python
"""Btw-tarieven per boekjaar, geladen uit config-bestanden.

Gouden regel: tarieven staan in een apart config-bestand per jaar en zijn
nooit hardcoded in de logica. Ontbreekt het bestand voor een jaar, dan is
dat een reden voor "review_nodig" — er wordt nooit een default gegokt.
"""

import json
from decimal import Decimal
from pathlib import Path

CONFIG_MAP = Path(__file__).parent / "config"


def btw_percentages_voor_jaar(jaar: int) -> set[Decimal] | None:
    """Geef de toegestane btw-percentages voor een boekjaar.

    Retourneert None als er geen config-bestand voor dat jaar bestaat;
    de aanroeper beslist dan zelf (review_nodig, nooit gokken).
    """
    pad = CONFIG_MAP / f"btw_{jaar}.json"
    if not pad.is_file():
        return None
    with open(pad, encoding="utf-8") as f:
        data = json.load(f)
    return {Decimal(p) for p in data["btw_percentages"]}
```

## `boekhouding/boekhouding/models.py`

```python
"""Pydantic-schema's voor facturen.

Gouden regels die hier gelden:
- Bedragen altijd als Decimal, nooit float (regel 5). Floats worden
  geweigerd vóór conversie, omdat 0.1 + 0.2 als float niet 0.3 is.
- Toegestane btw-percentages komen uit het config-bestand van het
  boekjaar, nooit hardcoded (nu: 21, 9, 0).
"""

import re
from datetime import date
from decimal import Decimal, InvalidOperation
from typing import Any, Literal, Optional

from pydantic import BaseModel, ConfigDict, field_validator, model_validator

from .btw_config import btw_percentages_voor_jaar

GELD_VELDEN = {"bedrag_excl", "btw_bedrag", "bedrag_incl", "btw_percentage"}


class Factuur(BaseModel):
    """Eén inkoop- of verkoopfactuur zoals uitgelezen uit een document."""

    model_config = ConfigDict(extra="forbid")

    leverancier: str
    factuurdatum: date
    factuurnummer: str
    bedrag_excl: Decimal
    btw_percentage: Decimal
    btw_bedrag: Decimal
    bedrag_incl: Decimal

    @field_validator("leverancier", "factuurnummer")
    @classmethod
    def niet_leeg(cls, waarde: str) -> str:
        waarde = waarde.strip()
        if not waarde:
            raise ValueError("mag niet leeg zijn")
        return waarde

    @field_validator(*GELD_VELDEN, mode="before")
    @classmethod
    def geen_float(cls, waarde: Any) -> Any:
        if isinstance(waarde, float):
            raise ValueError(
                "float is niet toegestaan voor geldvelden; "
                "lever het bedrag aan als tekst of Decimal (Gouden regel 5)"
            )
        if isinstance(waarde, str):
            origineel = waarde.strip()
            waarde = origineel
            # Nederlandse notatie: punt én komma → punt is
            # duizendtalscheiding ("1.250,00"); alleen komma →
            # decimaalteken ("100,00"); alleen punt → decimaalteken.
            # Uitzondering (Gouden regel 4): alléén een punt gevolgd
            # door precies 3 cijfers ("1.250") kan zowel een Nederlands
            # duizendtal (1250) als een Engels decimaal (1,250) zijn —
            # dan nooit gokken, maar review.
            if "." in waarde and "," in waarde:
                waarde = waarde.replace(".", "").replace(",", ".")
            elif re.fullmatch(r"\d{1,3}\.\d{3}", waarde):
                raise ValueError(
                    f"ambigu bedrag '{origineel}': kan "
                    f"{waarde.replace('.', '')},00 of "
                    f"{waarde.replace('.', ',')} zijn — "
                    f"controleer het origineel"
                )
            else:
                waarde = waarde.replace(",", ".")
            try:
                return Decimal(waarde)
            except InvalidOperation:
                raise ValueError(f"'{origineel}' is geen geldig bedrag")
        return waarde

    @model_validator(mode="after")
    def btw_percentage_toegestaan(self) -> "Factuur":
        toegestaan = btw_percentages_voor_jaar(self.factuurdatum.year)
        if toegestaan is None:
            raise ValueError(
                f"geen btw-configuratie voor boekjaar {self.factuurdatum.year}"
            )
        if self.btw_percentage not in toegestaan:
            mooi = ", ".join(str(p) for p in sorted(toegestaan, reverse=True))
            raise ValueError(
                f"btw_percentage {self.btw_percentage} is niet toegestaan "
                f"in {self.factuurdatum.year}; toegestaan: {mooi}"
            )
        return self


class ValidatieResultaat(BaseModel):
    """Uitkomst van valideer_factuur.

    Er wordt nooit een exception naar buiten gegooid en er gaat nooit
    data verloren: bij elke fout is de status "review_nodig", staan de
    redenen erbij, en blijft de originele input bewaard.
    """

    status: Literal["gevalideerd", "review_nodig"]
    redenen: list[str] = []
    factuur: Optional[Factuur] = None
    originele_data: dict[str, Any]
```

## `boekhouding/boekhouding/validatie.py`

```python
"""Validatie van facturen met vaste formules in Python-code.

Gouden regels die hier gelden:
- Alle berekeningen gebeuren hier, nooit door een taalmodel (regel 2).
- Elke fout leidt tot status "review_nodig" met reden; er wordt nooit
  een exception gegooid die data weggooit (regel 4).
"""

from datetime import date
from decimal import Decimal
from typing import Any, Callable, Optional

from pydantic import ValidationError

from .models import Factuur, ValidatieResultaat

TOLERANTIE = Decimal("0.02")
MAX_LEEFTIJD_JAREN = 2


def _twee_jaar_terug(vandaag: date) -> date:
    """Dezelfde dag, MAX_LEEFTIJD_JAREN jaar eerder (29 feb → 28 feb)."""
    try:
        return vandaag.replace(year=vandaag.year - MAX_LEEFTIJD_JAREN)
    except ValueError:
        return vandaag.replace(year=vandaag.year - MAX_LEEFTIJD_JAREN, day=28)


def valideer_factuur(
    data: dict[str, Any],
    *,
    vandaag: Optional[date] = None,
    is_duplicaat: Optional[Callable[[Factuur], bool]] = None,
) -> ValidatieResultaat:
    """Controleer één factuur en geef een status terug, nooit een exception.

    data          ruwe factuurgegevens (bijvoorbeeld uit AI-extractie)
    vandaag       peildatum voor de datumcontroles (default: date.today())
    is_duplicaat  callback die True geeft als leverancier+factuurnummer al
                  in de database staat (wordt door database.sla_factuur_op
                  meegegeven)
    """
    if vandaag is None:
        vandaag = date.today()

    redenen: list[str] = []

    # Stap 1: schema-controle (types, verplichte velden, btw-percentage).
    try:
        factuur = Factuur.model_validate(data)
    except ValidationError as fout:
        for f in fout.errors():
            veld = ".".join(str(p) for p in f["loc"]) or "factuur"
            redenen.append(f"{veld}: {f['msg']}")
        return ValidatieResultaat(
            status="review_nodig", redenen=redenen, originele_data=data
        )

    # Stap 2: rekencontroles met vaste formules (Gouden regel 2).
    som = factuur.bedrag_excl + factuur.btw_bedrag
    if abs(som - factuur.bedrag_incl) > TOLERANTIE:
        redenen.append(
            f"bedrag_excl ({factuur.bedrag_excl}) + btw_bedrag "
            f"({factuur.btw_bedrag}) = {som}, maar bedrag_incl is "
            f"{factuur.bedrag_incl} (verschil groter dan €{TOLERANTIE})"
        )

    verwachte_btw = (factuur.bedrag_excl * factuur.btw_percentage / 100).quantize(
        Decimal("0.01")
    )
    if abs(factuur.btw_bedrag - verwachte_btw) > TOLERANTIE:
        redenen.append(
            f"btw_bedrag ({factuur.btw_bedrag}) wijkt af van "
            f"{factuur.btw_percentage}% van {factuur.bedrag_excl} "
            f"(= {verwachte_btw}, verschil groter dan €{TOLERANTIE})"
        )

    # Stap 3: datumcontroles.
    if factuur.factuurdatum > vandaag:
        redenen.append(
            f"factuurdatum {factuur.factuurdatum} ligt in de toekomst "
            f"(vandaag is {vandaag})"
        )
    elif factuur.factuurdatum < _twee_jaar_terug(vandaag):
        redenen.append(
            f"factuurdatum {factuur.factuurdatum} is ouder dan "
            f"{MAX_LEEFTIJD_JAREN} jaar (grens: {_twee_jaar_terug(vandaag)})"
        )

    # Stap 4: duplicaatcheck op leverancier + factuurnummer.
    if is_duplicaat is not None and is_duplicaat(factuur):
        redenen.append(
            f"factuurnummer '{factuur.factuurnummer}' van leverancier "
            f"'{factuur.leverancier}' staat al in de database (duplicaat)"
        )

    status = "gevalideerd" if not redenen else "review_nodig"
    return ValidatieResultaat(
        status=status, redenen=redenen, factuur=factuur, originele_data=data
    )
```

## `boekhouding/boekhouding/database.py`

```python
"""SQLite-opslag met multi-administratie en audit trail.

Gouden regels die hier gelden:
- Elke tabel met boekhouddata heeft een administratie_id (regel 8).
  Administraties hebben een type; nu alleen "eenmanszaak", de structuur
  is uitbreidbaar maar er wordt niets extra's gebouwd.
- Elke wijziging → audit trail met originele waarde, nieuwe waarde en
  timestamp; niets wordt ooit hard verwijderd (regel 3).
- Bedragen worden als tekst opgeslagen zodat de Decimal-waarde exact
  bewaard blijft (regel 5).
"""

import json
import sqlite3
from datetime import date, datetime, timezone
from decimal import Decimal
from typing import Any, Optional

from .validatie import valideer_factuur
from .models import ValidatieResultaat

ADMINISTRATIE_TYPEN = ("eenmanszaak",)  # later uitbreidbaar (bv. "bv")

FACTUUR_VELDEN = (
    "leverancier",
    "factuurdatum",
    "factuurnummer",
    "bedrag_excl",
    "btw_percentage",
    "btw_bedrag",
    "bedrag_incl",
)


def _nu() -> str:
    return datetime.now(timezone.utc).isoformat(timespec="seconds")


def _als_tekst(waarde: Any) -> Optional[str]:
    """Maak een waarde opslagbaar als tekst zonder informatie te verliezen."""
    if waarde is None:
        return None
    if isinstance(waarde, (Decimal, date)):
        return str(waarde)
    if isinstance(waarde, str):
        return waarde
    return json.dumps(waarde, ensure_ascii=False, default=str)


def maak_verbinding(pad: str) -> sqlite3.Connection:
    """Open de databaseverbinding en zet foreign keys aan.

    SQLite dwingt foreign keys standaard NIET af; zonder deze pragma
    zou een factuur met een niet-bestaand administratie_id gewoon
    worden opgeslagen. Gebruik daarom altijd deze functie in plaats
    van sqlite3.connect rechtstreeks.
    """
    conn = sqlite3.connect(pad)
    conn.execute("PRAGMA foreign_keys = ON")
    return conn


def maak_tabellen(conn: sqlite3.Connection) -> None:
    """Maak de tabellen aan als ze nog niet bestaan."""
    conn.executescript(
        """
        CREATE TABLE IF NOT EXISTS administraties (
            id             INTEGER PRIMARY KEY,
            naam           TEXT NOT NULL,
            -- Let op: een nieuw administratietype (bv. 'bv') toevoegen
            -- vereist een migratie van deze CHECK-constraint; SQLite
            -- kan een CHECK niet wijzigen met ALTER TABLE, dus dat
            -- betekent: nieuwe tabel aanmaken, data overzetten,
            -- hernoemen. CREATE TABLE IF NOT EXISTS past een bestaande
            -- database niet aan.
            type           TEXT NOT NULL DEFAULT 'eenmanszaak'
                           CHECK (type IN ('eenmanszaak')),
            aangemaakt_op  TEXT NOT NULL
        );

        CREATE TABLE IF NOT EXISTS facturen (
            id               INTEGER PRIMARY KEY,
            administratie_id INTEGER NOT NULL REFERENCES administraties(id),
            leverancier      TEXT,
            factuurdatum     TEXT,
            factuurnummer    TEXT,
            bedrag_excl      TEXT,
            btw_percentage   TEXT,
            btw_bedrag       TEXT,
            bedrag_incl      TEXT,
            status           TEXT NOT NULL
                             CHECK (status IN ('gevalideerd', 'review_nodig')),
            review_redenen   TEXT NOT NULL DEFAULT '[]',
            originele_data   TEXT NOT NULL,
            aangemaakt_op    TEXT NOT NULL,
            gewijzigd_op     TEXT NOT NULL
        );

        CREATE INDEX IF NOT EXISTS idx_facturen_duplicaat
            ON facturen (administratie_id, leverancier, factuurnummer);

        CREATE TABLE IF NOT EXISTS audit_log (
            id               INTEGER PRIMARY KEY,
            administratie_id INTEGER NOT NULL REFERENCES administraties(id),
            tabel            TEXT NOT NULL,
            record_id        INTEGER NOT NULL,
            actie            TEXT NOT NULL
                             CHECK (actie IN ('aangemaakt', 'gewijzigd')),
            veld             TEXT,
            oude_waarde      TEXT,
            nieuwe_waarde    TEXT,
            tijdstip         TEXT NOT NULL
        );
        """
    )
    conn.commit()


def maak_administratie(
    conn: sqlite3.Connection, naam: str, type: str = "eenmanszaak"
) -> int:
    """Maak een administratie aan en geef het id terug."""
    if type not in ADMINISTRATIE_TYPEN:
        raise ValueError(
            f"administratietype '{type}' wordt nog niet ondersteund; "
            f"toegestaan: {', '.join(ADMINISTRATIE_TYPEN)}"
        )
    cursor = conn.execute(
        "INSERT INTO administraties (naam, type, aangemaakt_op) VALUES (?, ?, ?)",
        (naam, type, _nu()),
    )
    conn.commit()
    return cursor.lastrowid


def _is_duplicaat_in_db(
    conn: sqlite3.Connection, administratie_id: int, leverancier: str, factuurnummer: str
) -> bool:
    rij = conn.execute(
        """
        SELECT 1 FROM facturen
        WHERE administratie_id = ?
          AND lower(trim(leverancier)) = lower(trim(?))
          AND lower(trim(factuurnummer)) = lower(trim(?))
        LIMIT 1
        """,
        (administratie_id, leverancier, factuurnummer),
    ).fetchone()
    return rij is not None


def sla_factuur_op(
    conn: sqlite3.Connection,
    administratie_id: int,
    data: dict[str, Any],
    *,
    vandaag: Optional[date] = None,
) -> tuple[int, ValidatieResultaat]:
    """Valideer en bewaar een factuur; geef (factuur_id, resultaat) terug.

    Ook een afgekeurde factuur wordt opgeslagen (status "review_nodig"
    met redenen) — er gaat nooit data verloren. De originele ruwe input
    wordt integraal bewaard en elk veld komt in de audit trail.
    """
    resultaat = valideer_factuur(
        data,
        vandaag=vandaag,
        is_duplicaat=lambda f: _is_duplicaat_in_db(
            conn, administratie_id, f.leverancier, f.factuurnummer
        ),
    )

    if resultaat.factuur is not None:
        velden = {v: _als_tekst(getattr(resultaat.factuur, v)) for v in FACTUUR_VELDEN}
    else:
        # Schema-fout: bewaar wat er wél aan ruwe data binnenkwam.
        velden = {v: _als_tekst(data.get(v)) for v in FACTUUR_VELDEN}

    tijd = _nu()
    cursor = conn.execute(
        """
        INSERT INTO facturen (
            administratie_id, leverancier, factuurdatum, factuurnummer,
            bedrag_excl, btw_percentage, btw_bedrag, bedrag_incl,
            status, review_redenen, originele_data, aangemaakt_op, gewijzigd_op
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """,
        (
            administratie_id,
            velden["leverancier"],
            velden["factuurdatum"],
            velden["factuurnummer"],
            velden["bedrag_excl"],
            velden["btw_percentage"],
            velden["btw_bedrag"],
            velden["bedrag_incl"],
            resultaat.status,
            json.dumps(resultaat.redenen, ensure_ascii=False),
            json.dumps(data, ensure_ascii=False, default=str),
            tijd,
            tijd,
        ),
    )
    factuur_id = cursor.lastrowid

    for veld, waarde in velden.items():
        conn.execute(
            """
            INSERT INTO audit_log (
                administratie_id, tabel, record_id, actie,
                veld, oude_waarde, nieuwe_waarde, tijdstip
            ) VALUES (?, 'facturen', ?, 'aangemaakt', ?, NULL, ?, ?)
            """,
            (administratie_id, factuur_id, veld, waarde, tijd),
        )
    conn.commit()
    return factuur_id, resultaat


def wijzig_factuur(
    conn: sqlite3.Connection,
    factuur_id: int,
    wijzigingen: dict[str, Any],
    *,
    vandaag: Optional[date] = None,
) -> ValidatieResultaat:
    """Pas velden van een bestaande factuur aan, met audit trail.

    Oude waarden blijven bewaard in de audit_log en de kolom
    originele_data blijft altijd de oorspronkelijke input. Na de
    wijziging wordt de factuur opnieuw gevalideerd en de status
    bijgewerkt.
    """
    onbekend = set(wijzigingen) - set(FACTUUR_VELDEN)
    if onbekend:
        raise ValueError(f"onbekende factuurvelden: {', '.join(sorted(onbekend))}")

    cursor = conn.execute("SELECT * FROM facturen WHERE id = ?", (factuur_id,))
    rij = cursor.fetchone()
    if rij is None:
        raise ValueError(f"factuur {factuur_id} bestaat niet")
    kolommen = [k[0] for k in cursor.description]
    huidig = dict(zip(kolommen, rij))

    tijd = _nu()
    nieuwe_velden = {v: huidig[v] for v in FACTUUR_VELDEN}
    for veld, nieuwe_waarde in wijzigingen.items():
        nieuwe_tekst = _als_tekst(nieuwe_waarde)
        conn.execute(
            """
            INSERT INTO audit_log (
                administratie_id, tabel, record_id, actie,
                veld, oude_waarde, nieuwe_waarde, tijdstip
            ) VALUES (?, 'facturen', ?, 'gewijzigd', ?, ?, ?, ?)
            """,
            (huidig["administratie_id"], factuur_id, veld, huidig[veld], nieuwe_tekst, tijd),
        )
        nieuwe_velden[veld] = nieuwe_tekst

    resultaat = valideer_factuur(
        {v: nieuwe_velden[v] for v in FACTUUR_VELDEN if nieuwe_velden[v] is not None},
        vandaag=vandaag,
        is_duplicaat=lambda f: _is_ander_duplicaat(
            conn, huidig["administratie_id"], factuur_id, f.leverancier, f.factuurnummer
        ),
    )

    conn.execute(
        """
        UPDATE facturen SET
            leverancier = ?, factuurdatum = ?, factuurnummer = ?,
            bedrag_excl = ?, btw_percentage = ?, btw_bedrag = ?, bedrag_incl = ?,
            status = ?, review_redenen = ?, gewijzigd_op = ?
        WHERE id = ?
        """,
        (
            nieuwe_velden["leverancier"],
            nieuwe_velden["factuurdatum"],
            nieuwe_velden["factuurnummer"],
            nieuwe_velden["bedrag_excl"],
            nieuwe_velden["btw_percentage"],
            nieuwe_velden["btw_bedrag"],
            nieuwe_velden["bedrag_incl"],
            resultaat.status,
            json.dumps(resultaat.redenen, ensure_ascii=False),
            tijd,
            factuur_id,
        ),
    )
    conn.commit()
    return resultaat


def _is_ander_duplicaat(
    conn: sqlite3.Connection,
    administratie_id: int,
    eigen_id: int,
    leverancier: str,
    factuurnummer: str,
) -> bool:
    rij = conn.execute(
        """
        SELECT 1 FROM facturen
        WHERE administratie_id = ?
          AND id != ?
          AND lower(trim(leverancier)) = lower(trim(?))
          AND lower(trim(factuurnummer)) = lower(trim(?))
        LIMIT 1
        """,
        (administratie_id, eigen_id, leverancier, factuurnummer),
    ).fetchone()
    return rij is not None


def lees_factuur(conn: sqlite3.Connection, factuur_id: int) -> dict[str, Any]:
    """Lees één factuur als dict (bedragen als tekst, exact zoals opgeslagen)."""
    cursor = conn.execute("SELECT * FROM facturen WHERE id = ?", (factuur_id,))
    rij = cursor.fetchone()
    if rij is None:
        raise ValueError(f"factuur {factuur_id} bestaat niet")
    kolommen = [k[0] for k in cursor.description]
    factuur = dict(zip(kolommen, rij))
    factuur["review_redenen"] = json.loads(factuur["review_redenen"])
    factuur["originele_data"] = json.loads(factuur["originele_data"])
    return factuur


def lees_audit_trail(
    conn: sqlite3.Connection, factuur_id: int
) -> list[dict[str, Any]]:
    """Lees de volledige audit trail van één factuur, oudste eerst."""
    cursor = conn.execute(
        """
        SELECT * FROM audit_log
        WHERE tabel = 'facturen' AND record_id = ?
        ORDER BY id
        """,
        (factuur_id,),
    )
    kolommen = [k[0] for k in cursor.description]
    return [dict(zip(kolommen, rij)) for rij in cursor.fetchall()]
```

## `boekhouding/boekhouding/config/btw_2024.json`

```json
{
  "jaar": 2024,
  "btw_percentages": ["21", "9", "0"]
}
```

## `boekhouding/boekhouding/config/btw_2025.json`

```json
{
  "jaar": 2025,
  "btw_percentages": ["21", "9", "0"]
}
```

## `boekhouding/boekhouding/config/btw_2026.json`

```json
{
  "jaar": 2026,
  "btw_percentages": ["21", "9", "0"]
}
```

## `boekhouding/tests/conftest.py`

```python
from datetime import date

import pytest

from boekhouding import maak_verbinding, maak_tabellen, maak_administratie

# Vaste peildatum zodat de tests niet afhangen van de echte klok.
VANDAAG = date(2026, 8, 26)


def geldige_factuur() -> dict:
    """Een factuur waar niets mis mee is: 100.00 + 21% = 121.00."""
    return {
        "leverancier": "KPN B.V.",
        "factuurdatum": "2026-08-01",
        "factuurnummer": "F2026-0001",
        "bedrag_excl": "100.00",
        "btw_percentage": "21",
        "btw_bedrag": "21.00",
        "bedrag_incl": "121.00",
    }


@pytest.fixture
def conn():
    verbinding = maak_verbinding(":memory:")
    maak_tabellen(verbinding)
    yield verbinding
    verbinding.close()


@pytest.fixture
def administratie_id(conn):
    return maak_administratie(conn, "Testzaak", "eenmanszaak")
```

## `boekhouding/tests/test_schema.py`

```python
"""Tests voor het Pydantic-schema Factuur (types, floats, btw-percentages)."""

from decimal import Decimal

from boekhouding import valideer_factuur
from conftest import VANDAAG, geldige_factuur


def test_geldige_factuur_wordt_gevalideerd():
    resultaat = valideer_factuur(geldige_factuur(), vandaag=VANDAAG)
    assert resultaat.status == "gevalideerd"
    assert resultaat.redenen == []
    assert resultaat.factuur is not None


def test_bedragen_zijn_decimal_geen_float():
    resultaat = valideer_factuur(geldige_factuur(), vandaag=VANDAAG)
    assert isinstance(resultaat.factuur.bedrag_excl, Decimal)
    assert isinstance(resultaat.factuur.btw_bedrag, Decimal)
    assert isinstance(resultaat.factuur.bedrag_incl, Decimal)


def test_float_wordt_geweigerd():
    data = geldige_factuur()
    data["bedrag_excl"] = 100.00  # float — Gouden regel 5
    resultaat = valideer_factuur(data, vandaag=VANDAAG)
    assert resultaat.status == "review_nodig"
    assert any("float" in reden for reden in resultaat.redenen)


def test_komma_als_decimaalteken_wordt_begrepen():
    data = geldige_factuur()
    data["bedrag_excl"] = "100,00"
    resultaat = valideer_factuur(data, vandaag=VANDAAG)
    assert resultaat.status == "gevalideerd"
    assert resultaat.factuur.bedrag_excl == Decimal("100.00")


def test_punt_als_decimaalteken_wordt_begrepen():
    data = geldige_factuur()
    data["bedrag_excl"] = "100.00"
    resultaat = valideer_factuur(data, vandaag=VANDAAG)
    assert resultaat.status == "gevalideerd"
    assert resultaat.factuur.bedrag_excl == Decimal("100.00")


def test_nederlands_duizendtal_wordt_begrepen():
    # Punt én komma aanwezig → punt is duizendtalscheiding.
    data = geldige_factuur() | {
        "bedrag_excl": "1.250,00",
        "btw_bedrag": "262,50",
        "bedrag_incl": "1.512,50",
    }
    resultaat = valideer_factuur(data, vandaag=VANDAAG)
    assert resultaat.status == "gevalideerd"
    assert resultaat.factuur.bedrag_excl == Decimal("1250.00")
    assert resultaat.factuur.bedrag_incl == Decimal("1512.50")


def test_ambigu_bedrag_geeft_review():
    # "1.250" kan 1250,00 (NL duizendtal) of 1,250 (Engels decimaal)
    # zijn — nooit gokken (Gouden regel 4), dus review. Zonder deze
    # check zou een 0%-factuur met 1.25 i.p.v. 1250 gewoon door alle
    # rekencontroles glippen.
    data = geldige_factuur() | {
        "bedrag_excl": "1.250",
        "btw_percentage": "0",
        "btw_bedrag": "0",
        "bedrag_incl": "1.250",
    }
    resultaat = valideer_factuur(data, vandaag=VANDAAG)
    assert resultaat.status == "review_nodig"
    assert any(
        "ambigu bedrag" in reden and "1250,00" in reden and "1,250" in reden
        for reden in resultaat.redenen
    )


def test_groter_ambigu_bedrag_geeft_review():
    data = geldige_factuur() | {
        "bedrag_excl": "12.500",
        "btw_percentage": "0",
        "btw_bedrag": "0",
        "bedrag_incl": "12.500",
    }
    resultaat = valideer_factuur(data, vandaag=VANDAAG)
    assert resultaat.status == "review_nodig"
    assert any("ambigu bedrag" in reden for reden in resultaat.redenen)


def test_een_decimaal_achter_de_punt_blijft_geldig():
    data = geldige_factuur() | {
        "bedrag_excl": "0.5",
        "btw_percentage": "0",
        "btw_bedrag": "0.00",
        "bedrag_incl": "0.5",
    }
    resultaat = valideer_factuur(data, vandaag=VANDAAG)
    assert resultaat.status == "gevalideerd"
    assert resultaat.factuur.bedrag_excl == Decimal("0.5")


def test_groter_nederlands_duizendtal_wordt_begrepen():
    data = geldige_factuur() | {
        "bedrag_excl": "12.500,50",
        "btw_percentage": "0",
        "btw_bedrag": "0,00",
        "bedrag_incl": "12.500,50",
    }
    resultaat = valideer_factuur(data, vandaag=VANDAAG)
    assert resultaat.status == "gevalideerd"
    assert resultaat.factuur.bedrag_excl == Decimal("12500.50")


def test_btw_9_en_0_zijn_toegestaan():
    negen = geldige_factuur() | {
        "btw_percentage": "9", "btw_bedrag": "9.00", "bedrag_incl": "109.00",
    }
    nul = geldige_factuur() | {
        "btw_percentage": "0", "btw_bedrag": "0.00", "bedrag_incl": "100.00",
    }
    assert valideer_factuur(negen, vandaag=VANDAAG).status == "gevalideerd"
    assert valideer_factuur(nul, vandaag=VANDAAG).status == "gevalideerd"


def test_ongeldig_btw_percentage_geeft_review():
    data = geldige_factuur() | {
        "btw_percentage": "15", "btw_bedrag": "15.00", "bedrag_incl": "115.00",
    }
    resultaat = valideer_factuur(data, vandaag=VANDAAG)
    assert resultaat.status == "review_nodig"
    assert any("btw_percentage" in reden for reden in resultaat.redenen)


def test_jaar_zonder_btw_config_geeft_review():
    # 2023 heeft geen config-bestand; nooit gokken, dus review.
    data = geldige_factuur() | {"factuurdatum": "2023-01-15"}
    resultaat = valideer_factuur(data, vandaag=VANDAAG)
    assert resultaat.status == "review_nodig"
    assert any("btw-configuratie" in reden for reden in resultaat.redenen)


def test_lege_leverancier_geeft_review():
    data = geldige_factuur() | {"leverancier": "   "}
    resultaat = valideer_factuur(data, vandaag=VANDAAG)
    assert resultaat.status == "review_nodig"
    assert any("leverancier" in reden for reden in resultaat.redenen)


def test_ontbrekend_veld_geeft_review_en_bewaart_data():
    data = geldige_factuur()
    del data["factuurnummer"]
    resultaat = valideer_factuur(data, vandaag=VANDAAG)
    assert resultaat.status == "review_nodig"
    assert any("factuurnummer" in reden for reden in resultaat.redenen)
    assert resultaat.originele_data == data  # niets weggegooid


def test_onzin_input_gooit_nooit_een_exception():
    resultaat = valideer_factuur(
        {"leverancier": 42, "bedrag_excl": "abc", "factuurdatum": "gisteren"},
        vandaag=VANDAAG,
    )
    assert resultaat.status == "review_nodig"
    assert len(resultaat.redenen) >= 3
```

## `boekhouding/tests/test_validatie.py`

```python
"""Tests voor de rekenregels, datumcontroles en de duplicaatcheck."""

from boekhouding import valideer_factuur
from conftest import VANDAAG, geldige_factuur


# --- optelling: bedrag_excl + btw_bedrag == bedrag_incl (±€0.02) ---

def test_optelling_binnen_tolerantie_is_ok():
    data = geldige_factuur() | {"bedrag_incl": "121.02"}  # 2 cent afronding
    assert valideer_factuur(data, vandaag=VANDAAG).status == "gevalideerd"


def test_optelling_buiten_tolerantie_geeft_review():
    data = geldige_factuur() | {"bedrag_incl": "121.03"}  # 3 cent verschil
    resultaat = valideer_factuur(data, vandaag=VANDAAG)
    assert resultaat.status == "review_nodig"
    assert any("bedrag_incl" in reden for reden in resultaat.redenen)


# --- btw: btw_bedrag == bedrag_excl × pct/100 (±€0.02) ---

def test_btw_afronding_binnen_tolerantie_is_ok():
    # 9% van 33.33 = 2.9997 ≈ 3.00
    data = geldige_factuur() | {
        "bedrag_excl": "33.33",
        "btw_percentage": "9",
        "btw_bedrag": "3.00",
        "bedrag_incl": "36.33",
    }
    assert valideer_factuur(data, vandaag=VANDAAG).status == "gevalideerd"


def test_verkeerd_btw_bedrag_geeft_review():
    data = geldige_factuur() | {"btw_bedrag": "21.03", "bedrag_incl": "121.03"}
    resultaat = valideer_factuur(data, vandaag=VANDAAG)
    assert resultaat.status == "review_nodig"
    assert any("btw_bedrag" in reden for reden in resultaat.redenen)


# --- factuurdatum: niet in de toekomst, niet ouder dan 2 jaar ---

def test_datum_in_de_toekomst_geeft_review():
    data = geldige_factuur() | {"factuurdatum": "2026-08-27"}  # morgen
    resultaat = valideer_factuur(data, vandaag=VANDAAG)
    assert resultaat.status == "review_nodig"
    assert any("toekomst" in reden for reden in resultaat.redenen)


def test_datum_vandaag_is_ok():
    data = geldige_factuur() | {"factuurdatum": str(VANDAAG)}
    assert valideer_factuur(data, vandaag=VANDAAG).status == "gevalideerd"


def test_datum_precies_twee_jaar_geleden_is_ok():
    data = geldige_factuur() | {"factuurdatum": "2024-08-26"}
    assert valideer_factuur(data, vandaag=VANDAAG).status == "gevalideerd"


def test_datum_ouder_dan_twee_jaar_geeft_review():
    data = geldige_factuur() | {"factuurdatum": "2024-08-25"}
    resultaat = valideer_factuur(data, vandaag=VANDAAG)
    assert resultaat.status == "review_nodig"
    assert any("ouder dan" in reden for reden in resultaat.redenen)


# --- duplicaatcheck ---

def test_duplicaat_geeft_review():
    resultaat = valideer_factuur(
        geldige_factuur(), vandaag=VANDAAG, is_duplicaat=lambda f: True
    )
    assert resultaat.status == "review_nodig"
    assert any("duplicaat" in reden for reden in resultaat.redenen)


def test_geen_duplicaat_is_ok():
    resultaat = valideer_factuur(
        geldige_factuur(), vandaag=VANDAAG, is_duplicaat=lambda f: False
    )
    assert resultaat.status == "gevalideerd"


# --- meerdere fouten tegelijk ---

def test_alle_fouten_worden_verzameld():
    data = geldige_factuur() | {
        "factuurdatum": "2026-12-31",  # toekomst
        "btw_bedrag": "5.00",          # klopt niet met 21%
        "bedrag_incl": "999.00",       # optelling klopt niet
    }
    resultaat = valideer_factuur(
        data, vandaag=VANDAAG, is_duplicaat=lambda f: True
    )
    assert resultaat.status == "review_nodig"
    assert len(resultaat.redenen) == 4
    assert resultaat.factuur is not None  # data blijft bruikbaar voor review
```

## `boekhouding/tests/test_database.py`

```python
"""Tests voor opslag, multi-administratie, duplicaatcheck en audit trail."""

import sqlite3

import pytest

from boekhouding import (
    maak_administratie,
    sla_factuur_op,
    wijzig_factuur,
    lees_factuur,
    lees_audit_trail,
)
from conftest import VANDAAG, geldige_factuur


def test_administratie_heeft_type_eenmanszaak(conn):
    admin_id = maak_administratie(conn, "Testzaak")
    rij = conn.execute(
        "SELECT naam, type FROM administraties WHERE id = ?", (admin_id,)
    ).fetchone()
    assert rij == ("Testzaak", "eenmanszaak")


def test_onbekend_administratietype_wordt_geweigerd(conn):
    with pytest.raises(ValueError, match="bv"):
        maak_administratie(conn, "Testzaak", "bv")


def test_onbestaand_administratie_id_wordt_geweigerd(conn):
    # Bewijst dat maak_verbinding foreign keys echt aanzet: zonder
    # "PRAGMA foreign_keys = ON" zou deze insert gewoon slagen.
    with pytest.raises(sqlite3.IntegrityError, match="FOREIGN KEY"):
        sla_factuur_op(conn, 999, geldige_factuur(), vandaag=VANDAAG)


def test_geldige_factuur_wordt_opgeslagen(conn, administratie_id):
    factuur_id, resultaat = sla_factuur_op(
        conn, administratie_id, geldige_factuur(), vandaag=VANDAAG
    )
    assert resultaat.status == "gevalideerd"
    opgeslagen = lees_factuur(conn, factuur_id)
    assert opgeslagen["administratie_id"] == administratie_id
    assert opgeslagen["status"] == "gevalideerd"
    assert opgeslagen["bedrag_excl"] == "100.00"  # exact, als tekst


def test_foute_factuur_wordt_bewaard_met_redenen(conn, administratie_id):
    data = geldige_factuur() | {"bedrag_incl": "999.00"}
    factuur_id, resultaat = sla_factuur_op(
        conn, administratie_id, data, vandaag=VANDAAG
    )
    assert resultaat.status == "review_nodig"
    opgeslagen = lees_factuur(conn, factuur_id)
    assert opgeslagen["status"] == "review_nodig"
    assert len(opgeslagen["review_redenen"]) == 1
    assert opgeslagen["originele_data"]["bedrag_incl"] == "999.00"


def test_onvolledige_factuur_wordt_toch_bewaard(conn, administratie_id):
    data = {"leverancier": "KPN B.V.", "bedrag_excl": "abc"}
    factuur_id, resultaat = sla_factuur_op(
        conn, administratie_id, data, vandaag=VANDAAG
    )
    assert resultaat.status == "review_nodig"
    opgeslagen = lees_factuur(conn, factuur_id)
    assert opgeslagen["leverancier"] == "KPN B.V."
    assert opgeslagen["originele_data"] == data


def test_duplicaat_in_zelfde_administratie(conn, administratie_id):
    sla_factuur_op(conn, administratie_id, geldige_factuur(), vandaag=VANDAAG)
    _, resultaat = sla_factuur_op(
        conn, administratie_id, geldige_factuur(), vandaag=VANDAAG
    )
    assert resultaat.status == "review_nodig"
    assert any("duplicaat" in reden for reden in resultaat.redenen)


def test_zelfde_nummer_in_andere_administratie_mag(conn):
    admin_a = maak_administratie(conn, "Zaak A")
    admin_b = maak_administratie(conn, "Zaak B")
    sla_factuur_op(conn, admin_a, geldige_factuur(), vandaag=VANDAAG)
    _, resultaat = sla_factuur_op(conn, admin_b, geldige_factuur(), vandaag=VANDAAG)
    assert resultaat.status == "gevalideerd"


def test_zelfde_nummer_andere_leverancier_mag(conn, administratie_id):
    sla_factuur_op(conn, administratie_id, geldige_factuur(), vandaag=VANDAAG)
    data = geldige_factuur() | {"leverancier": "Coolblue B.V."}
    _, resultaat = sla_factuur_op(conn, administratie_id, data, vandaag=VANDAAG)
    assert resultaat.status == "gevalideerd"


def test_audit_trail_bij_aanmaken(conn, administratie_id):
    factuur_id, _ = sla_factuur_op(
        conn, administratie_id, geldige_factuur(), vandaag=VANDAAG
    )
    trail = lees_audit_trail(conn, factuur_id)
    assert len(trail) == 7  # elk factuurveld één regel
    assert all(regel["actie"] == "aangemaakt" for regel in trail)
    assert all(regel["oude_waarde"] is None for regel in trail)
    assert all(regel["tijdstip"] for regel in trail)
    per_veld = {regel["veld"]: regel["nieuwe_waarde"] for regel in trail}
    assert per_veld["bedrag_excl"] == "100.00"


def test_wijziging_bewaart_oude_waarde_in_audit_trail(conn, administratie_id):
    factuur_id, _ = sla_factuur_op(
        conn, administratie_id, geldige_factuur(), vandaag=VANDAAG
    )
    resultaat = wijzig_factuur(
        conn, factuur_id, {"leverancier": "KPN Zakelijk B.V."}, vandaag=VANDAAG
    )
    assert resultaat.status == "gevalideerd"

    wijzigingen = [
        r for r in lees_audit_trail(conn, factuur_id) if r["actie"] == "gewijzigd"
    ]
    assert len(wijzigingen) == 1
    assert wijzigingen[0]["veld"] == "leverancier"
    assert wijzigingen[0]["oude_waarde"] == "KPN B.V."
    assert wijzigingen[0]["nieuwe_waarde"] == "KPN Zakelijk B.V."

    assert lees_factuur(conn, factuur_id)["leverancier"] == "KPN Zakelijk B.V."


def test_correctie_zet_status_terug_naar_gevalideerd(conn, administratie_id):
    data = geldige_factuur() | {"bedrag_incl": "999.00"}
    factuur_id, resultaat = sla_factuur_op(
        conn, administratie_id, data, vandaag=VANDAAG
    )
    assert resultaat.status == "review_nodig"

    resultaat = wijzig_factuur(
        conn, factuur_id, {"bedrag_incl": "121.00"}, vandaag=VANDAAG
    )
    assert resultaat.status == "gevalideerd"
    assert lees_factuur(conn, factuur_id)["status"] == "gevalideerd"


def test_wijziging_naar_foute_waarde_geeft_review(conn, administratie_id):
    factuur_id, _ = sla_factuur_op(
        conn, administratie_id, geldige_factuur(), vandaag=VANDAAG
    )
    resultaat = wijzig_factuur(
        conn, factuur_id, {"btw_bedrag": "5.00"}, vandaag=VANDAAG
    )
    assert resultaat.status == "review_nodig"
    assert lees_factuur(conn, factuur_id)["status"] == "review_nodig"


def test_wijziging_onbekend_veld_wordt_geweigerd(conn, administratie_id):
    factuur_id, _ = sla_factuur_op(
        conn, administratie_id, geldige_factuur(), vandaag=VANDAAG
    )
    with pytest.raises(ValueError, match="onbekende factuurvelden"):
        wijzig_factuur(conn, factuur_id, {"status": "gevalideerd"}, vandaag=VANDAAG)


def test_wijziging_onbestaande_factuur_wordt_geweigerd(conn, administratie_id):
    with pytest.raises(ValueError, match="bestaat niet"):
        wijzig_factuur(conn, 999, {"leverancier": "X"}, vandaag=VANDAAG)
```

## `boekhouding/pytest.ini`

```
[pytest]
pythonpath = .
testpaths = tests
```

## `boekhouding/requirements.txt`

```
pydantic>=2
pytest>=8
```

---

# Testresultaat

```
..........................................                               [100%]
42 passed in 0.06s
```
