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
import tempfile
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

        CREATE TABLE IF NOT EXISTS boekingen (
            id                    INTEGER PRIMARY KEY,
            administratie_id      INTEGER NOT NULL REFERENCES administraties(id),
            -- Eén boeking per factuur: UNIQUE laat meerdere NULL toe, dus
            -- tegenboekingen (zonder factuur) blijven mogelijk, maar
            -- dezelfde factuur twee keer boeken kan niet.
            factuur_id            INTEGER UNIQUE REFERENCES facturen(id),
            corrigeert_boeking_id INTEGER REFERENCES boekingen(id),
            boekdatum             TEXT NOT NULL,
            omschrijving          TEXT NOT NULL,
            aangemaakt_op         TEXT NOT NULL,
            aangemaakt_door       TEXT NOT NULL
        );

        CREATE TABLE IF NOT EXISTS boekingsregels (
            id               INTEGER PRIMARY KEY,
            boeking_id       INTEGER NOT NULL REFERENCES boekingen(id),
            administratie_id INTEGER NOT NULL REFERENCES administraties(id),
            volgnummer       INTEGER NOT NULL,
            rekening         TEXT NOT NULL,
            omschrijving     TEXT NOT NULL,
            -- Bedragen als tekst, net als bij facturen: zo komt er nooit
            -- een float aan te pas en staat er precies wat er stond.
            debet            TEXT NOT NULL DEFAULT '0.00',
            credit           TEXT NOT NULL DEFAULT '0.00'
        );

        CREATE INDEX IF NOT EXISTS idx_boekingen_periode
            ON boekingen (administratie_id, boekdatum);

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
    # De grootboekrekening die de eigenaar bij deze factuur kiest. Geen
    # default: zonder keuze ontstaat er geen boeking (Gouden regel 4).
    _voeg_kolom_toe(conn, "facturen", "rekening", "TEXT")
    _voeg_kolom_toe(conn, "facturen", "goedgekeurd_op", "TEXT")
    _voeg_kolom_toe(conn, "facturen", "goedgekeurd_door", "TEXT")

    conn.commit()
    _bank_tabellen(conn)


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


# --- grootboek (module 6) ----------------------------------------------

def kies_rekening(
    conn: sqlite3.Connection, factuur_id: int, code: Optional[str]
) -> tuple[bool, list[str]]:
    """Leg vast op welke grootboekrekening deze factuur hoort.

    De keuze wordt getoetst aan het rekeningschema van het boekjaar van
    de factuur: een code die daar niet in staat wordt geweigerd, want er
    wordt nooit op een verzonnen rekening geboekt. De oude keuze gaat
    net als elke andere wijziging de audit trail in.
    """
    from .rekeningschema import KIESBARE_SOORTEN, rekeningschema_voor_jaar

    factuur = lees_factuur(conn, factuur_id)
    code = (code or "").strip() or None

    if code is not None:
        if not factuur["factuurdatum"]:
            return False, [
                "zonder factuurdatum is niet te bepalen welk rekeningschema "
                "geldt; vul eerst de datum in"
            ]
        jaar = date.fromisoformat(factuur["factuurdatum"]).year
        schema = rekeningschema_voor_jaar(jaar)
        if schema is None:
            return False, [f"er is geen rekeningschema voor boekjaar {jaar}"]
        rekening = schema.zoek(code)
        if rekening is None:
            return False, [f"rekening '{code}' staat niet in het schema van {jaar}"]
        if rekening.soort not in KIESBARE_SOORTEN:
            return False, [
                f"rekening {code} is van soort '{rekening.soort}'; kies een "
                f"kosten- of opbrengstenrekening"
            ]

    if factuur["rekening"] == code:
        return True, []

    # Staat de boeking er al, dan zou een andere rekening hier betekenen
    # dat de factuur iets anders zegt dan het grootboek. Een boeking
    # wordt nooit gewijzigd, dus de weg terug is een tegenboeking.
    boeking = boeking_bij_factuur(conn, factuur_id)
    if boeking is not None:
        return False, [
            f"deze factuur is al geboekt (boeking {boeking['id']}); een boeking "
            f"wordt niet gewijzigd. Maak een tegenboeking als de rekening niet "
            f"klopt"
        ]

    tijd = _nu()
    conn.execute(
        "UPDATE facturen SET rekening = ?, gewijzigd_op = ? WHERE id = ?",
        (code, tijd, factuur_id),
    )
    conn.execute(
        """
        INSERT INTO audit_log (
            administratie_id, tabel, record_id, actie,
            veld, oude_waarde, nieuwe_waarde, tijdstip
        ) VALUES (?, 'facturen', ?, 'gewijzigd', 'rekening', ?, ?, ?)
        """,
        (factuur["administratie_id"], factuur_id, factuur["rekening"], code, tijd),
    )
    conn.commit()
    return True, []


def sla_boeking_op(
    conn: sqlite3.Connection,
    administratie_id: int,
    voorstel: Any,
    door: str = "eigenaar",
) -> tuple[Optional[int], list[str]]:
    """Bewaar een samengestelde boeking; geef (boeking_id, redenen).

    De balans wordt hier nog één keer gecontroleerd, vlak voor het
    opslaan. Dat is met opzet dubbelop: een boeking die niet klopt mag
    de database niet in, ook niet als een aanroeper de controle bij het
    samenstellen zou overslaan.
    """
    from .grootboek import controleer_balans

    if voorstel.status != "gemaakt":
        return None, list(voorstel.redenen)

    redenen = controleer_balans(voorstel.regels)
    if redenen:
        return None, redenen

    if voorstel.factuur_id is not None:
        bestaat = conn.execute(
            "SELECT id FROM boekingen WHERE factuur_id = ?", (voorstel.factuur_id,)
        ).fetchone()
        if bestaat is not None:
            return None, [
                f"factuur {voorstel.factuur_id} is al geboekt (boeking "
                f"{bestaat[0]}); een boeking wordt niet overschreven — maak "
                f"zo nodig een tegenboeking"
            ]

    tijd = _nu()
    cursor = conn.execute(
        """
        INSERT INTO boekingen (
            administratie_id, factuur_id, corrigeert_boeking_id,
            boekdatum, omschrijving, aangemaakt_op, aangemaakt_door
        ) VALUES (?, ?, ?, ?, ?, ?, ?)
        """,
        (
            administratie_id,
            voorstel.factuur_id,
            voorstel.corrigeert_boeking_id,
            str(voorstel.boekdatum),
            voorstel.omschrijving,
            tijd,
            door,
        ),
    )
    boeking_id = cursor.lastrowid

    for volgnummer, regel in enumerate(voorstel.regels, start=1):
        conn.execute(
            """
            INSERT INTO boekingsregels (
                boeking_id, administratie_id, volgnummer,
                rekening, omschrijving, debet, credit
            ) VALUES (?, ?, ?, ?, ?, ?, ?)
            """,
            (
                boeking_id, administratie_id, volgnummer,
                regel.rekening, regel.omschrijving,
                str(regel.debet), str(regel.credit),
            ),
        )

    conn.execute(
        """
        INSERT INTO audit_log (
            administratie_id, tabel, record_id, actie,
            veld, oude_waarde, nieuwe_waarde, tijdstip
        ) VALUES (?, 'boekingen', ?, 'aangemaakt', NULL, NULL, ?, ?)
        """,
        (
            administratie_id, boeking_id,
            json.dumps(
                {
                    "boekdatum": str(voorstel.boekdatum),
                    "omschrijving": voorstel.omschrijving,
                    "factuur_id": voorstel.factuur_id,
                    "corrigeert_boeking_id": voorstel.corrigeert_boeking_id,
                    "regels": [
                        {
                            "rekening": r.rekening,
                            "debet": str(r.debet),
                            "credit": str(r.credit),
                        }
                        for r in voorstel.regels
                    ],
                },
                ensure_ascii=False,
            ),
            tijd,
        ),
    )
    conn.commit()
    return boeking_id, []


def _boeking_met_regels(conn: sqlite3.Connection, rij: dict[str, Any]) -> dict[str, Any]:
    cursor = conn.execute(
        "SELECT * FROM boekingsregels WHERE boeking_id = ? ORDER BY volgnummer",
        (rij["id"],),
    )
    kolommen = [k[0] for k in cursor.description]
    rij["regels"] = [dict(zip(kolommen, r)) for r in cursor.fetchall()]
    return rij


def lees_boeking(conn: sqlite3.Connection, boeking_id: int) -> dict[str, Any]:
    """Lees één boeking met haar regels."""
    cursor = conn.execute("SELECT * FROM boekingen WHERE id = ?", (boeking_id,))
    rij = cursor.fetchone()
    if rij is None:
        raise ValueError(f"boeking {boeking_id} bestaat niet")
    kolommen = [k[0] for k in cursor.description]
    return _boeking_met_regels(conn, dict(zip(kolommen, rij)))


def lees_boekingen(
    conn: sqlite3.Connection,
    administratie_id: int,
    van: Optional[date] = None,
    tot: Optional[date] = None,
) -> list[dict[str, Any]]:
    """Lees de boekingen van een administratie, eventueel binnen een periode.

    `van` en `tot` zijn allebei inclusief; de boekdatum is de datum van
    de factuur, dus daarmee valt een factuur van 31 maart in het eerste
    kwartaal en een van 1 april in het tweede.
    """
    vraag = "SELECT * FROM boekingen WHERE administratie_id = ?"
    waarden: list[Any] = [administratie_id]
    if van is not None:
        vraag += " AND boekdatum >= ?"
        waarden.append(str(van))
    if tot is not None:
        vraag += " AND boekdatum <= ?"
        waarden.append(str(tot))
    vraag += " ORDER BY boekdatum, id"

    cursor = conn.execute(vraag, waarden)
    kolommen = [k[0] for k in cursor.description]
    return [
        _boeking_met_regels(conn, dict(zip(kolommen, rij)))
        for rij in cursor.fetchall()
    ]


def boeking_bij_factuur(
    conn: sqlite3.Connection, factuur_id: int
) -> Optional[dict[str, Any]]:
    """Geef de boeking van deze factuur, of None als hij nog niet geboekt is."""
    rij = conn.execute(
        "SELECT id FROM boekingen WHERE factuur_id = ?", (factuur_id,)
    ).fetchone()
    return None if rij is None else lees_boeking(conn, rij[0])


def boek_factuur(
    conn: sqlite3.Connection, factuur_id: int, door: str = "eigenaar"
) -> tuple[Optional[int], list[str]]:
    """Maak de boeking bij een goedgekeurde factuur.

    Alleen een goedgekeurde factuur wordt geboekt: de code controleert,
    de mens beslist, en pas daarna gaat het het grootboek in.
    """
    from .grootboek import stel_boeking_samen

    factuur = lees_factuur(conn, factuur_id)
    if factuur["goedgekeurd_op"] is None:
        return None, [
            "deze factuur is nog niet goedgekeurd; alleen een goedgekeurde "
            "factuur wordt geboekt"
        ]

    voorstel = stel_boeking_samen(factuur, factuur["rekening"])
    return sla_boeking_op(conn, factuur["administratie_id"], voorstel, door=door)


def maak_tegenboeking(
    conn: sqlite3.Connection,
    boeking_id: int,
    reden: str,
    door: str = "eigenaar",
    boekdatum: Optional[date] = None,
) -> tuple[Optional[int], list[str]]:
    """Zet een boeking recht met een tegenboeking.

    De oorspronkelijke boeking blijft ongewijzigd staan; dit is een
    nieuwe boeking met dezelfde bedragen aan de andere kant en een
    verwijzing naar het origineel.
    """
    from .grootboek import stel_tegenboeking_samen

    boeking = lees_boeking(conn, boeking_id)
    bestaat = conn.execute(
        "SELECT id FROM boekingen WHERE corrigeert_boeking_id = ?", (boeking_id,)
    ).fetchone()
    if bestaat is not None:
        return None, [
            f"boeking {boeking_id} is al gecorrigeerd met boeking {bestaat[0]}"
        ]

    voorstel = stel_tegenboeking_samen(boeking, reden, boekdatum)
    return sla_boeking_op(
        conn, boeking["administratie_id"], voorstel, door=door
    )


# --- bankafschriften en afletteren (module 7) ---------------------------

def _bank_tabellen(conn: sqlite3.Connection) -> None:
    """De tabellen van module 7; aangeroepen vanuit maak_tabellen."""
    conn.executescript(
        """
        CREATE TABLE IF NOT EXISTS bankafschriften (
            id               INTEGER PRIMARY KEY,
            administratie_id INTEGER NOT NULL REFERENCES administraties(id),
            document_id      INTEGER REFERENCES documenten(id),
            bestandsnaam     TEXT NOT NULL,
            formaat          TEXT NOT NULL
                             CHECK (formaat IN ('mt940', 'camt053')),
            rekening         TEXT,
            aangemaakt_op    TEXT NOT NULL
        );

        CREATE TABLE IF NOT EXISTS banktransacties (
            id               INTEGER PRIMARY KEY,
            administratie_id INTEGER NOT NULL REFERENCES administraties(id),
            afschrift_id     INTEGER NOT NULL REFERENCES bankafschriften(id),
            volgnummer       INTEGER NOT NULL,
            boekdatum        TEXT NOT NULL,
            -- Ondertekend: negatief is eraf, positief is erbij. Als tekst
            -- opgeslagen, net als elk ander bedrag, zodat er nooit een
            -- float aan te pas komt.
            bedrag           TEXT NOT NULL,
            tegenrekening    TEXT,
            tegenpartij      TEXT,
            omschrijving     TEXT NOT NULL DEFAULT '',
            betalingskenmerk TEXT,
            bankreferentie   TEXT,
            -- De vingerafdruk van de transactie. Hierop rust de
            -- duplicaatherkenning: hetzelfde afschrift twee keer inlezen
            -- levert dezelfde vingerafdrukken op en voegt dus niets toe.
            kenmerk          TEXT NOT NULL,
            status           TEXT NOT NULL DEFAULT 'open'
                             CHECK (status IN ('open', 'gekoppeld')),
            factuur_id       INTEGER REFERENCES facturen(id),
            boeking_id       INTEGER REFERENCES boekingen(id),
            gekoppeld_op     TEXT,
            gekoppeld_door   TEXT,
            aangemaakt_op    TEXT NOT NULL,
            UNIQUE (administratie_id, kenmerk)
        );

        CREATE INDEX IF NOT EXISTS idx_banktransacties_status
            ON banktransacties (administratie_id, status, boekdatum);
        """
    )
    conn.commit()


def importeer_bankafschrift(
    conn: sqlite3.Connection,
    administratie_id: int,
    bestandsnaam: str,
    inhoud: bytes,
    opslagmap: str,
    door: str = "eigenaar",
) -> dict[str, Any]:
    """Lees een bankafschrift in en bewaar de nieuwe transacties.

    Geeft een samenvatting terug: hoeveel er nieuw zijn, hoeveel er al
    stonden en welke regels zijn overgeslagen. Gooit nooit een
    exception: een onleesbaar bestand is een reden, geen crash.

    Hetzelfde afschrift twee keer inlezen voegt niets toe. Dat gaat niet
    op de bestandsnaam maar op de inhoud van elke transactie, zodat ook
    twee afschriften die elkaar overlappen geen dubbele regels opleveren.
    """
    from .bank import lees_bankbestand

    gelezen = lees_bankbestand(inhoud, bestandsnaam)
    samenvatting: dict[str, Any] = {
        "status": gelezen.status,
        "formaat": gelezen.formaat,
        "afschrift_id": None,
        "nieuw": 0,
        "al_bekend": 0,
        "redenen": list(gelezen.redenen),
    }
    if gelezen.status != "gelezen":
        return samenvatting

    # Het origineel wordt bewaard vóór het verwerken (bewaarplicht), net
    # als bij een factuur. Lukt dat niet, dan gaat de import wel door:
    # de transacties zelf zijn belangrijker dan het bronbestand, en het
    # mislukken staat als reden in de samenvatting.
    document_id = None
    extensie = ".xml" if gelezen.formaat == "camt053" else ".sta"
    with tempfile.TemporaryDirectory() as tijdelijke_map:
        tijdelijk = Path(tijdelijke_map) / f"afschrift{extensie}"
        tijdelijk.write_bytes(inhoud)
        document = bewaar_document(
            conn, administratie_id, str(tijdelijk), str(opslagmap)
        )
    if document.status == "review_nodig":
        samenvatting["redenen"].append(
            f"het originele afschrift kon niet worden bewaard: "
            f"{'; '.join(document.redenen)}"
        )
    else:
        document_id = document.document_id

    tijd = _nu()
    cursor = conn.execute(
        """
        INSERT INTO bankafschriften (
            administratie_id, document_id, bestandsnaam, formaat,
            rekening, aangemaakt_op
        ) VALUES (?, ?, ?, ?, ?, ?)
        """,
        (
            administratie_id, document_id, bestandsnaam, gelezen.formaat,
            gelezen.rekening, tijd,
        ),
    )
    afschrift_id = cursor.lastrowid
    samenvatting["afschrift_id"] = afschrift_id

    for transactie in gelezen.transacties:
        kenmerk = transactie.kenmerk()
        bestaat = conn.execute(
            "SELECT id FROM banktransacties WHERE administratie_id = ? "
            "AND kenmerk = ?",
            (administratie_id, kenmerk),
        ).fetchone()
        if bestaat is not None:
            samenvatting["al_bekend"] += 1
            continue

        regel = conn.execute(
            """
            INSERT INTO banktransacties (
                administratie_id, afschrift_id, volgnummer, boekdatum,
                bedrag, tegenrekening, tegenpartij, omschrijving,
                betalingskenmerk, bankreferentie, kenmerk, aangemaakt_op
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """,
            (
                administratie_id, afschrift_id, transactie.volgnummer,
                str(transactie.boekdatum), str(transactie.bedrag),
                transactie.tegenrekening, transactie.tegenpartij,
                transactie.omschrijving, transactie.betalingskenmerk,
                transactie.bankreferentie, kenmerk, tijd,
            ),
        )
        samenvatting["nieuw"] += 1
        conn.execute(
            """
            INSERT INTO audit_log (
                administratie_id, tabel, record_id, actie,
                veld, oude_waarde, nieuwe_waarde, tijdstip
            ) VALUES (?, 'banktransacties', ?, 'aangemaakt', NULL, NULL, ?, ?)
            """,
            (
                administratie_id, regel.lastrowid,
                json.dumps(
                    {
                        "boekdatum": str(transactie.boekdatum),
                        "bedrag": str(transactie.bedrag),
                        "tegenpartij": transactie.tegenpartij,
                        "omschrijving": transactie.omschrijving,
                        "afschrift": bestandsnaam,
                    },
                    ensure_ascii=False,
                ),
                tijd,
            ),
        )

    conn.commit()
    if samenvatting["nieuw"] == 0 and samenvatting["al_bekend"]:
        samenvatting["redenen"].append(
            f"alle {samenvatting['al_bekend']} transacties uit dit afschrift "
            f"stonden er al; er is niets bijgekomen"
        )
    return samenvatting


def lees_banktransacties(
    conn: sqlite3.Connection, administratie_id: int
) -> list[dict[str, Any]]:
    """De banktransacties van een administratie, openstaande bovenaan."""
    cursor = conn.execute(
        """
        SELECT * FROM banktransacties
        WHERE administratie_id = ?
        ORDER BY CASE WHEN status = 'open' THEN 0 ELSE 1 END,
                 boekdatum DESC, id DESC
        """,
        (administratie_id,),
    )
    kolommen = [k[0] for k in cursor.description]
    return [dict(zip(kolommen, rij)) for rij in cursor.fetchall()]


def lees_banktransactie(
    conn: sqlite3.Connection, transactie_id: int
) -> dict[str, Any]:
    cursor = conn.execute(
        "SELECT * FROM banktransacties WHERE id = ?", (transactie_id,)
    )
    rij = cursor.fetchone()
    if rij is None:
        raise ValueError(f"banktransactie {transactie_id} bestaat niet")
    kolommen = [k[0] for k in cursor.description]
    return dict(zip(kolommen, rij))


def _richting_van_boeking(conn: sqlite3.Connection, factuur_id: int) -> Optional[str]:
    """Is dit een inkoop- of een verkoopfactuur?

    Dat staat niet in de factuur maar in haar boeking: staat er
    crediteuren in, dan is het inkoop; staat er debiteuren in, dan
    verkoop. Zo hoeft er nergens iets geraden te worden.
    """
    from .rekeningschema import rekeningschema_voor_jaar

    boeking = boeking_bij_factuur(conn, factuur_id)
    if boeking is None:
        return None
    jaar = int(str(boeking["boekdatum"])[:4])
    schema = rekeningschema_voor_jaar(jaar)
    if schema is None:
        return None
    rekeningen = {regel["rekening"] for regel in boeking["regels"]}
    if schema.standaard("crediteuren") in rekeningen:
        return "inkoop"
    if schema.standaard("debiteuren") in rekeningen:
        return "verkoop"
    return None


def open_facturen(
    conn: sqlite3.Connection, administratie_id: int
) -> list[dict[str, Any]]:
    """De facturen die nog op een betaling wachten.

    Alleen geboekte facturen doen mee: zolang een factuur niet in het
    grootboek staat, is er ook geen schuld of vordering om af te
    letteren. Facturen die al aan een transactie hangen vallen af.
    """
    cursor = conn.execute(
        """
        SELECT f.* FROM facturen f
        JOIN boekingen b ON b.factuur_id = f.id
        WHERE f.administratie_id = ?
          AND f.id NOT IN (
              SELECT factuur_id FROM banktransacties
              WHERE administratie_id = ? AND factuur_id IS NOT NULL
          )
        ORDER BY f.factuurdatum, f.id
        """,
        (administratie_id, administratie_id),
    )
    kolommen = [k[0] for k in cursor.description]
    facturen = []
    for rij in cursor.fetchall():
        factuur = dict(zip(kolommen, rij))
        factuur["review_redenen"] = json.loads(factuur["review_redenen"])
        factuur["originele_data"] = json.loads(factuur["originele_data"])
        factuur["richting"] = _richting_van_boeking(conn, factuur["id"])
        facturen.append(factuur)
    return facturen


def koppel_transactie(
    conn: sqlite3.Connection,
    transactie_id: int,
    factuur_id: int,
    door: str = "eigenaar",
) -> tuple[Optional[int], list[str]]:
    """Koppel een banktransactie aan een factuur en boek de betaling.

    Dit gebeurt alleen op bevestiging van een mens: een voorstel uit het
    afletteren is nooit definitief. Geeft (boeking_id, redenen).
    """
    from .afletteren import stel_betaling_samen

    transactie = lees_banktransactie(conn, transactie_id)
    if transactie["status"] != "open":
        return None, [
            f"deze transactie is al gekoppeld aan factuur "
            f"{transactie['factuur_id']}"
        ]

    factuur = lees_factuur(conn, factuur_id)
    if factuur["administratie_id"] != transactie["administratie_id"]:
        return None, ["deze factuur hoort bij een andere administratie"]

    al_gekoppeld = conn.execute(
        "SELECT id FROM banktransacties WHERE factuur_id = ? AND id != ?",
        (factuur_id, transactie_id),
    ).fetchone()
    if al_gekoppeld is not None:
        return None, [
            f"factuur {factuur_id} hangt al aan banktransactie "
            f"{al_gekoppeld[0]}"
        ]

    factuur["richting"] = _richting_van_boeking(conn, factuur_id)
    voorstel = stel_betaling_samen(transactie, factuur)
    boeking_id, redenen = sla_boeking_op(
        conn, transactie["administratie_id"], voorstel, door=door
    )
    if boeking_id is None:
        return None, redenen

    tijd = _nu()
    conn.execute(
        """
        UPDATE banktransacties
        SET status = 'gekoppeld', factuur_id = ?, boeking_id = ?,
            gekoppeld_op = ?, gekoppeld_door = ?
        WHERE id = ?
        """,
        (factuur_id, boeking_id, tijd, door, transactie_id),
    )
    conn.execute(
        """
        INSERT INTO audit_log (
            administratie_id, tabel, record_id, actie,
            veld, oude_waarde, nieuwe_waarde, tijdstip
        ) VALUES (?, 'banktransacties', ?, 'gewijzigd', 'factuur_id', NULL, ?, ?)
        """,
        (transactie["administratie_id"], transactie_id, str(factuur_id), tijd),
    )
    conn.commit()
    return boeking_id, []
