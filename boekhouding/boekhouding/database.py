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
