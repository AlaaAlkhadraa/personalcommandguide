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
from pathlib import Path
from typing import Any, Optional

from .validatie import valideer_factuur
from .models import ValidatieResultaat
from .documenten import (
    TOEGESTANE_EXTENSIES,
    DocumentResultaat,
    bereken_hash,
    extensie_van,
    kopieer_naar_opslag,
)

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


def _voeg_kolom_toe(
    conn: sqlite3.Connection, tabel: str, kolom: str, definitie: str
) -> bool:
    """Voeg een kolom toe als die nog ontbreekt; geef terug of dat gebeurde.

    Bestaande rijen krijgen de default. Bij prompt_versie is dat bewust
    'onbekend' en niet de huidige versie: van een extractie van vóór deze
    kolom weten we níét met welke prompt hij is gemaakt, en dat invullen
    zou de audit trail een onwaarheid laten vertellen.
    """
    kolommen = {rij[1] for rij in conn.execute(f"PRAGMA table_info({tabel})")}
    if kolom in kolommen:
        return False
    conn.execute(f"ALTER TABLE {tabel} ADD COLUMN {kolom} {definitie}")
    return True


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

        CREATE TABLE IF NOT EXISTS documenten (
            id                   INTEGER PRIMARY KEY,
            administratie_id     INTEGER NOT NULL REFERENCES administraties(id),
            hash                 TEXT NOT NULL,
            originele_bestandsnaam TEXT NOT NULL,
            opslagpad            TEXT NOT NULL,
            aangemaakt_op        TEXT NOT NULL,
            UNIQUE (administratie_id, hash)
        );

        CREATE TABLE IF NOT EXISTS facturen (
            id               INTEGER PRIMARY KEY,
            administratie_id INTEGER NOT NULL REFERENCES administraties(id),
            document_id      INTEGER REFERENCES documenten(id),
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

        CREATE TABLE IF NOT EXISTS extracties (
            id               INTEGER PRIMARY KEY,
            administratie_id INTEGER NOT NULL REFERENCES administraties(id),
            document_id      INTEGER REFERENCES documenten(id),
            model            TEXT NOT NULL,
            prompt_versie    TEXT NOT NULL DEFAULT 'onbekend',
            invoerpad        TEXT
                             CHECK (invoerpad IS NULL
                                    OR invoerpad IN ('tekst', 'beeld')),
            ruwe_respons     TEXT NOT NULL,
            status           TEXT NOT NULL
                             CHECK (status IN ('gevalideerd', 'review_nodig')),
            redenen          TEXT NOT NULL DEFAULT '[]',
            aangemaakt_op    TEXT NOT NULL
        );

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

    # Migraties voor databases die eerder zijn aangemaakt.
    # CREATE TABLE IF NOT EXISTS raakt een bestaande tabel niet aan, dus
    # een nieuwe kolom moet er los bij met ALTER TABLE ADD COLUMN.
    # SQLite staat dat toe zolang de default NULL is, of bij NOT NULL een
    # vaste waarde heeft.
    _voeg_kolom_toe(
        conn, "facturen", "document_id",
        "INTEGER REFERENCES documenten(id)",
    )
    _voeg_kolom_toe(
        conn, "extracties", "prompt_versie",
        "TEXT NOT NULL DEFAULT 'onbekend'",
    )
    # Goedkeuring is een aparte handeling van de mens, los van de
    # status die de code bepaalt. Daarom twee eigen kolommen in plaats
    # van een derde status: "gevalideerd" zegt dat de sommen kloppen,
    # "goedgekeurd_op" zegt dat een mens ernaar heeft gekeken en ja
    # heeft gezegd. Dat scheelt bovendien een tabelmigratie, want een
    # CHECK-constraint is in SQLite niet te wijzigen.
    _voeg_kolom_toe(conn, "facturen", "goedgekeurd_op", "TEXT")
    _voeg_kolom_toe(conn, "facturen", "goedgekeurd_door", "TEXT")

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
    document_id: Optional[int] = None,
    extra_redenen: tuple[str, ...] = (),
) -> tuple[int, ValidatieResultaat]:
    """Valideer en bewaar een factuur; geef (factuur_id, resultaat) terug.

    Ook een afgekeurde factuur wordt opgeslagen (status "review_nodig"
    met redenen) — er gaat nooit data verloren. De originele ruwe input
    wordt integraal bewaard en elk veld komt in de audit trail.

    document_id koppelt de factuur optioneel aan het bewaarde originele
    bestand (tabel documenten), zodat bij een controle altijd de bron
    terug te vinden is.

    extra_redenen zijn redenen die niet uit de rekencontroles komen maar
    van eerder in de keten — bijvoorbeeld een veld dat het model met
    lage zekerheid heeft gelezen. Die horen bij de factuur bewaard te
    worden, anders zou de eigenaar in het reviewscherm niet zien waarom
    er twijfel was.
    """
    resultaat = valideer_factuur(
        data,
        vandaag=vandaag,
        is_duplicaat=lambda f: _is_duplicaat_in_db(
            conn, administratie_id, f.leverancier, f.factuurnummer
        ),
    )
    if extra_redenen:
        resultaat = resultaat.model_copy(
            update={
                "redenen": list(extra_redenen) + resultaat.redenen,
                "status": "review_nodig",
            }
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
            administratie_id, document_id, leverancier, factuurdatum,
            factuurnummer, bedrag_excl, btw_percentage, btw_bedrag,
            bedrag_incl, status, review_redenen, originele_data,
            aangemaakt_op, gewijzigd_op
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """,
        (
            administratie_id,
            document_id,
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

    # De koppeling naar het originele document is ook data en krijgt
    # dus een eigen auditregel — alleen als er echt een document is,
    # zodat een factuur zonder bron geen lege regel oplevert.
    if document_id is not None:
        conn.execute(
            """
            INSERT INTO audit_log (
                administratie_id, tabel, record_id, actie,
                veld, oude_waarde, nieuwe_waarde, tijdstip
            ) VALUES (?, 'facturen', ?, 'aangemaakt', 'document_id', NULL, ?, ?)
            """,
            (administratie_id, factuur_id, str(document_id), tijd),
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
    conn: sqlite3.Connection, record_id: int, tabel: str = "facturen"
) -> list[dict[str, Any]]:
    """Lees de volledige audit trail van één record, oudste eerst."""
    cursor = conn.execute(
        """
        SELECT * FROM audit_log
        WHERE tabel = ? AND record_id = ?
        ORDER BY id
        """,
        (tabel, record_id),
    )
    kolommen = [k[0] for k in cursor.description]
    return [dict(zip(kolommen, rij)) for rij in cursor.fetchall()]


def bewaar_document(
    conn: sqlite3.Connection,
    administratie_id: int,
    pad: str,
    opslagmap: str,
) -> DocumentResultaat:
    """Bewaar een origineel factuurbestand en registreer het.

    Werkwijze: eerst de sha256-hash van de inhoud berekenen, dan kijken
    of dit document al in deze administratie bekend is. Zo ja, dan komt
    er geen tweede kopie en geen tweede regel — het resultaat is
    "bestond_al" met het id van het bestaande document. Zo nee, dan
    wordt het bestand gekopieerd naar de opslagmap (naam = de hash) en
    geregistreerd in de tabel documenten, met een regel in de audit
    trail.

    Bestaat het bronbestand niet, heeft het een bestandssoort die we
    niet bewaren, of is het niet te lezen, dan volgt status
    "review_nodig" met reden — geen exception (Gouden regel 4).
    """
    bron = Path(pad)
    if not bron.is_file():
        return DocumentResultaat(
            status="review_nodig", redenen=[f"bestand niet gevonden: {pad}"]
        )

    # De bestandssoort wordt niet gegokt: staat de extensie niet op de
    # witte lijst, dan gaat het document ter review.
    extensie = extensie_van(bron)
    if extensie is None:
        gevonden = bron.suffix.lower() or "geen"
        return DocumentResultaat(
            status="review_nodig",
            redenen=[
                f"bestandssoort '{gevonden}' wordt niet bewaard; "
                f"toegestaan: {', '.join(TOEGESTANE_EXTENSIES)} — "
                f"controleer het origineel"
            ],
        )

    try:
        hash_waarde = bereken_hash(bron)
    except OSError as fout:
        return DocumentResultaat(
            status="review_nodig",
            redenen=[f"kon het bestand niet lezen: {fout}"],
        )

    bestaand = conn.execute(
        "SELECT id, opslagpad FROM documenten "
        "WHERE administratie_id = ? AND hash = ?",
        (administratie_id, hash_waarde),
    ).fetchone()
    if bestaand is not None:
        return DocumentResultaat(
            status="bestond_al",
            document_id=bestaand[0],
            hash=hash_waarde,
            opslagpad=bestaand[1],
        )

    try:
        doel, _ = kopieer_naar_opslag(bron, hash_waarde, opslagmap, extensie)
    except OSError as fout:
        return DocumentResultaat(
            status="review_nodig",
            redenen=[f"kon het bestand niet opslaan: {fout}"],
        )

    # OPENSTAAND PUNT (bewust nog niet gebouwd): tussen het kopiëren
    # hierboven en de INSERT hieronder zit een klein venster. Crasht het
    # proces daartussen, dan staat het bestand wél in de opslagmap maar
    # is er geen regel in de tabel documenten — een "weesbestand".
    # Dat is geen dataverlies (het origineel staat er nog, en een
    # volgende aanbieding van dezelfde PDF slaat hem gewoon opnieuw op
    # onder dezelfde hash), maar het kost schijfruimte en het bestand is
    # niet meer terug te vinden via de administratie. Een latere
    # opruimfunctie zou de opslagmap moeten vergelijken met de tabel
    # documenten en weesbestanden moeten rapporteren — nooit stilzwijgend
    # verwijderen, want de bewaarplicht geldt ook voor deze bestanden.

    tijd = _nu()
    cursor = conn.execute(
        """
        INSERT INTO documenten (
            administratie_id, hash, originele_bestandsnaam,
            opslagpad, aangemaakt_op
        ) VALUES (?, ?, ?, ?, ?)
        """,
        (administratie_id, hash_waarde, bron.name, str(doel), tijd),
    )
    document_id = cursor.lastrowid

    for veld, waarde in (
        ("hash", hash_waarde),
        ("originele_bestandsnaam", bron.name),
        ("opslagpad", str(doel)),
    ):
        conn.execute(
            """
            INSERT INTO audit_log (
                administratie_id, tabel, record_id, actie,
                veld, oude_waarde, nieuwe_waarde, tijdstip
            ) VALUES (?, 'documenten', ?, 'aangemaakt', ?, NULL, ?, ?)
            """,
            (administratie_id, document_id, veld, waarde, tijd),
        )
    conn.commit()

    return DocumentResultaat(
        status="opgeslagen",
        document_id=document_id,
        hash=hash_waarde,
        opslagpad=str(doel),
    )


def lees_document(conn: sqlite3.Connection, document_id: int) -> dict[str, Any]:
    """Lees één documentregistratie als dict."""
    cursor = conn.execute("SELECT * FROM documenten WHERE id = ?", (document_id,))
    rij = cursor.fetchone()
    if rij is None:
        raise ValueError(f"document {document_id} bestaat niet")
    kolommen = [k[0] for k in cursor.description]
    return dict(zip(kolommen, rij))


def sla_extractie_op(
    conn: sqlite3.Connection,
    administratie_id: int,
    resultaat: Any,
    *,
    document_id: Optional[int] = None,
) -> int:
    """Bewaar een AI-extractie met model, ruwe respons en document_id.

    De volledige audit trail: welk model het was, met welke versie van
    de systeemprompt, wat het letterlijk terugstuurde, welk invoerpad is
    gebruikt en bij welk bewaarde document het hoort. Zo is later na te gaan waar een boeking vandaan
    komt — ook als het model intussen is vervangen.
    """
    tijd = _nu()
    cursor = conn.execute(
        """
        INSERT INTO extracties (
            administratie_id, document_id, model, prompt_versie, invoerpad,
            ruwe_respons, status, redenen, aangemaakt_op
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        """,
        (
            administratie_id,
            document_id,
            resultaat.model,
            resultaat.prompt_versie,
            resultaat.invoerpad,
            resultaat.ruwe_respons,
            resultaat.status,
            json.dumps(resultaat.redenen, ensure_ascii=False),
            tijd,
        ),
    )
    extractie_id = cursor.lastrowid

    for veld, waarde in (
        ("model", resultaat.model),
        ("prompt_versie", resultaat.prompt_versie),
        ("invoerpad", resultaat.invoerpad),
        ("status", resultaat.status),
        ("document_id", None if document_id is None else str(document_id)),
    ):
        conn.execute(
            """
            INSERT INTO audit_log (
                administratie_id, tabel, record_id, actie,
                veld, oude_waarde, nieuwe_waarde, tijdstip
            ) VALUES (?, 'extracties', ?, 'aangemaakt', ?, NULL, ?, ?)
            """,
            (administratie_id, extractie_id, veld, waarde, tijd),
        )
    conn.commit()
    return extractie_id


def lees_extractie(conn: sqlite3.Connection, extractie_id: int) -> dict[str, Any]:
    """Lees één extractie terug, met de redenen als lijst."""
    cursor = conn.execute("SELECT * FROM extracties WHERE id = ?", (extractie_id,))
    rij = cursor.fetchone()
    if rij is None:
        raise ValueError(f"extractie {extractie_id} bestaat niet")
    kolommen = [k[0] for k in cursor.description]
    extractie = dict(zip(kolommen, rij))
    extractie["redenen"] = json.loads(extractie["redenen"])
    return extractie


def lees_facturen(
    conn: sqlite3.Connection, administratie_id: int
) -> list[dict[str, Any]]:
    """Alle facturen van een administratie, review_nodig bovenaan.

    De volgorde is de werkvolgorde van de eigenaar: eerst wat zijn
    aandacht nodig heeft, daarna wat al klopt maar nog niet is
    goedgekeurd, en onderaan wat af is. Binnen elke groep de nieuwste
    factuur eerst.
    """
    cursor = conn.execute(
        """
        SELECT * FROM facturen
        WHERE administratie_id = ?
        ORDER BY
            CASE
                WHEN status = 'review_nodig' THEN 0
                WHEN goedgekeurd_op IS NULL THEN 1
                ELSE 2
            END,
            id DESC
        """,
        (administratie_id,),
    )
    kolommen = [k[0] for k in cursor.description]
    facturen = []
    for rij in cursor.fetchall():
        factuur = dict(zip(kolommen, rij))
        factuur["review_redenen"] = json.loads(factuur["review_redenen"])
        factuur["originele_data"] = json.loads(factuur["originele_data"])
        facturen.append(factuur)
    return facturen


def keur_factuur_goed(
    conn: sqlite3.Connection, factuur_id: int, door: str = "eigenaar"
) -> tuple[bool, list[str]]:
    """Leg vast dat een mens deze factuur heeft goedgekeurd.

    Geeft (gelukt, redenen). Goedkeuren kan alleen als er geen
    openstaande validatiefouten meer zijn: de code bepaalt of het mág,
    de mens bepaalt of het gebeurt (Gouden regel 1). Een factuur die
    al is goedgekeurd wordt niet nog een keer goedgekeurd.
    """
    factuur = lees_factuur(conn, factuur_id)

    if factuur["status"] != "gevalideerd":
        return False, [
            "deze factuur kan nog niet worden goedgekeurd; los eerst de "
            "openstaande punten op"
        ] + factuur["review_redenen"]

    if factuur["goedgekeurd_op"] is not None:
        return False, ["deze factuur is al goedgekeurd"]

    tijd = _nu()
    conn.execute(
        "UPDATE facturen SET goedgekeurd_op = ?, goedgekeurd_door = ?, "
        "gewijzigd_op = ? WHERE id = ?",
        (tijd, door, tijd, factuur_id),
    )
    for veld, waarde in (("goedgekeurd_op", tijd), ("goedgekeurd_door", door)):
        conn.execute(
            """
            INSERT INTO audit_log (
                administratie_id, tabel, record_id, actie,
                veld, oude_waarde, nieuwe_waarde, tijdstip
            ) VALUES (?, 'facturen', ?, 'gewijzigd', ?, NULL, ?, ?)
            """,
            (factuur["administratie_id"], factuur_id, veld, waarde, tijd),
        )
    conn.commit()
    return True, []


def lees_extractie_bij_document(
    conn: sqlite3.Connection, document_id: Optional[int]
) -> Optional[dict[str, Any]]:
    """Zoek de laatste AI-extractie bij een document, of None.

    Het reviewscherm gebruikt dit om per veld de zekerheid te tonen.
    Bij een e-factuur is er geen extractie; dan is er ook niets
    onzekers, want de velden stonden letterlijk in het bestand.
    """
    if document_id is None:
        return None
    cursor = conn.execute(
        "SELECT * FROM extracties WHERE document_id = ? ORDER BY id DESC LIMIT 1",
        (document_id,),
    )
    rij = cursor.fetchone()
    if rij is None:
        return None
    kolommen = [k[0] for k in cursor.description]
    extractie = dict(zip(kolommen, rij))
    extractie["redenen"] = json.loads(extractie["redenen"])
    return extractie
