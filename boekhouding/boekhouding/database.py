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
from datetime import date, datetime, timedelta, timezone
from decimal import Decimal
from pathlib import Path
from typing import TYPE_CHECKING, Any, Optional

if TYPE_CHECKING:  # alleen voor de typeaanduidingen; geen kringverwijzing
    from .gebruikers import Gebruiker

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


class Verbinding(sqlite3.Connection):
    """Een gewone sqlite-verbinding met één extra: wie eraan werkt.

    Een kale sqlite3.Connection laat niet toe dat je er zelf iets op
    zet. Deze subklasse wel, en daar hangt zet_gebruiker de naam aan
    van degene die is ingelogd, zodat elke audit-regel die via deze
    verbinding wordt geschreven de echte gebruiker krijgt.
    """

    gebruiker: Optional[str] = None


def maak_verbinding(pad: str) -> sqlite3.Connection:
    """Open de databaseverbinding en zet foreign keys aan.

    SQLite dwingt foreign keys standaard NIET af; zonder deze pragma
    zou een factuur met een niet-bestaand administratie_id gewoon
    worden opgeslagen. Gebruik daarom altijd deze functie in plaats
    van sqlite3.connect rechtstreeks.
    """
    conn = sqlite3.connect(pad, factory=Verbinding)
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


def zet_gebruiker(conn: sqlite3.Connection, door: Optional[str]) -> None:
    """Leg vast wie er via deze verbinding werkt.

    De webinterface roept dit aan zodra bekend is wie er is ingelogd.
    Elke audit-regel die daarna via deze verbinding wordt geschreven,
    krijgt die naam — zonder dat elke functie er een parameter voor
    hoeft te hebben.
    """
    if isinstance(conn, Verbinding):
        conn.gebruiker = door or None


def huidige_gebruiker(conn: sqlite3.Connection) -> str:
    """Wie werkt er via deze verbinding? 'systeem' als niemand het zei."""
    return getattr(conn, "gebruiker", None) or "systeem"


def _audit(
    conn: sqlite3.Connection,
    administratie_id: int,
    tabel: str,
    record_id: int,
    actie: str,
    veld: Optional[str] = None,
    oude_waarde: Any = None,
    nieuwe_waarde: Any = None,
    door: Optional[str] = None,
    tijdstip: Optional[str] = None,
) -> None:
    """Schrijf één regel in de audit trail.

    Alle audit-regels lopen hierlangs, zodat er maar één plek is waar de
    kolommen worden ingevuld — en zodat "wie deed het" nooit vergeten kan
    worden.

    Wie dat is, hoeft niet door twintig functies heen te worden
    doorgegeven. De webinterface zet het één keer op de verbinding
    (`zet_gebruiker`), en een verbinding is precies één verzoek van
    precies één gebruiker. Staat er niets, dan komt er "systeem" te
    staan: dat is eerlijker dan een naam verzinnen.
    """
    conn.execute(
        """
        INSERT INTO audit_log (
            administratie_id, tabel, record_id, actie,
            veld, oude_waarde, nieuwe_waarde, door, tijdstip
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        """,
        (
            administratie_id, tabel, record_id, actie, veld,
            _als_tekst(oude_waarde), _als_tekst(nieuwe_waarde),
            door or huidige_gebruiker(conn), tijdstip or _nu(),
        ),
    )


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
            -- Wie de handeling deed. 'systeem' als er geen mens aan te
            -- pas kwam (een import bijvoorbeeld); anders het e-mailadres
            -- van de ingelogde gebruiker.
            door             TEXT NOT NULL DEFAULT 'systeem',
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
    _voeg_kolom_toe(conn, "audit_log", "door", "TEXT NOT NULL DEFAULT 'systeem'")

    conn.commit()
    _bank_tabellen(conn)
    _verkoop_tabellen(conn)
    _toegang_tabellen(conn)


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
        _audit(
            conn, administratie_id, 'facturen', factuur_id, 'aangemaakt',
            veld=veld,
            nieuwe_waarde=waarde,
            tijdstip=tijd,
        )

    # De koppeling naar het originele document is ook data en krijgt
    # dus een eigen auditregel — alleen als er echt een document is,
    # zodat een factuur zonder bron geen lege regel oplevert.
    if document_id is not None:
        _audit(
            conn, administratie_id, 'facturen', factuur_id, 'aangemaakt',
            veld='document_id',
            nieuwe_waarde=str(document_id),
            tijdstip=tijd,
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
        _audit(
            conn, huidig["administratie_id"], 'facturen', factuur_id, 'gewijzigd',
            veld=veld,
            oude_waarde=huidig[veld],
            nieuwe_waarde=nieuwe_tekst,
            tijdstip=tijd,
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
        _audit(
            conn, administratie_id, 'documenten', document_id, 'aangemaakt',
            veld=veld,
            nieuwe_waarde=waarde,
            tijdstip=tijd,
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
        _audit(
            conn, administratie_id, 'extracties', extractie_id, 'aangemaakt',
            veld=veld,
            nieuwe_waarde=waarde,
            tijdstip=tijd,
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
        _audit(
            conn, factuur["administratie_id"], 'facturen', factuur_id, 'gewijzigd',
            veld=veld,
            nieuwe_waarde=waarde,
            tijdstip=tijd,
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
    _audit(
        conn, factuur["administratie_id"], 'facturen', factuur_id, 'gewijzigd',
        veld='rekening',
        oude_waarde=factuur["rekening"],
        nieuwe_waarde=code,
        tijdstip=tijd,
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

    _audit(
        conn, administratie_id, 'boekingen', boeking_id, 'aangemaakt',
        nieuwe_waarde=json.dumps(
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
        tijdstip=tijd,
        door=door,
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
            verkoopfactuur_id INTEGER REFERENCES verkoopfacturen(id),
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
    # Voor databases van vóór module 8: een bijschrijving kan ook bij een
    # eigen verkoopfactuur horen.
    _voeg_kolom_toe(
        conn, "banktransacties", "verkoopfactuur_id",
        "INTEGER REFERENCES verkoopfacturen(id)",
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
        _audit(
            conn, administratie_id, 'banktransacties', regel.lastrowid, 'aangemaakt',
            nieuwe_waarde=json.dumps(
                    {
                        "boekdatum": str(transactie.boekdatum),
                        "bedrag": str(transactie.bedrag),
                        "tegenpartij": transactie.tegenpartij,
                        "omschrijving": transactie.omschrijving,
                        "afschrift": bestandsnaam,
                    },
                    ensure_ascii=False,
                ),
            tijdstip=tijd,
            door=door,
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
    """Alles wat nog op een betaling wacht: inkoop én verkoop.

    Alleen geboekte facturen doen mee: zolang er niets in het grootboek
    staat, is er ook geen schuld of vordering om af te letteren. Wat al
    aan een banktransactie hangt valt af.

    Elke regel heeft een `bron`: "factuur" voor een ontvangen factuur en
    "verkoopfactuur" voor een eigen factuur. Daarmee weet het koppelen
    later welke tabel het is; het afletteren zelf kijkt alleen naar
    nummer, bedrag, naam en richting.
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
        factuur["bron"] = "factuur"
        facturen.append(factuur)

    for verkoop in _openstaande_verkoopfacturen(conn, administratie_id):
        facturen.append({
            "id": verkoop["id"],
            "bron": "verkoopfactuur",
            "factuurnummer": verkoop["factuurnummer"],
            # Voor het afletteren is de klant de tegenpartij; het veld
            # heet leverancier omdat het afletteren niet hoeft te weten
            # of het een klant of een leverancier is.
            "leverancier": verkoop["klant_naam"],
            "factuurdatum": verkoop["factuurdatum"],
            "vervaldatum": verkoop["vervaldatum"],
            "bedrag_incl": str(verkoop["totalen"].bedrag_incl),
            "richting": "verkoop",
        })
    return facturen


def _openstaande_verkoopfacturen(
    conn: sqlite3.Connection, administratie_id: int
) -> list[dict[str, Any]]:
    """De definitieve verkoopfacturen waar nog geen betaling bij hoort."""
    cursor = conn.execute(
        """
        SELECT id FROM verkoopfacturen
        WHERE administratie_id = ? AND status = 'definitief'
          AND id NOT IN (
              SELECT verkoopfactuur_id FROM banktransacties
              WHERE administratie_id = ? AND verkoopfactuur_id IS NOT NULL
          )
        ORDER BY nummer_jaar, nummer_volg
        """,
        (administratie_id, administratie_id),
    )
    return [lees_verkoopfactuur(conn, rij[0]) for rij in cursor.fetchall()]


def openstaande_posten(
    conn: sqlite3.Connection,
    administratie_id: int,
    vandaag: Optional[date] = None,
) -> list[dict[str, Any]]:
    """Welke verkoopfacturen zijn nog niet betaald, en hoe lang al?

    `dagen_over` is het aantal dagen na de vervaldatum; negatief betekent
    dat de termijn nog loopt. Een factuur telt als betaald zodra er een
    banktransactie aan hangt — dat gebeurt bij het afletteren van module
    7, en dus pas als een mens de koppeling heeft bevestigd.
    """
    peildatum = vandaag or date.today()
    posten = []
    for factuur in _openstaande_verkoopfacturen(conn, administratie_id):
        dagen_over = None
        if factuur["vervaldatum"]:
            try:
                dagen_over = (
                    peildatum - date.fromisoformat(factuur["vervaldatum"])
                ).days
            except ValueError:
                dagen_over = None
        posten.append({
            "id": factuur["id"],
            "factuurnummer": factuur["factuurnummer"],
            "klant_naam": factuur["klant_naam"],
            "factuurdatum": factuur["factuurdatum"],
            "vervaldatum": factuur["vervaldatum"],
            "bedrag_incl": factuur["totalen"].bedrag_incl,
            "dagen_over": dagen_over,
            "te_laat": dagen_over is not None and dagen_over > 0,
        })
    posten.sort(key=lambda post: (post["dagen_over"] is None, -(post["dagen_over"] or 0)))
    return posten


def koppel_transactie(
    conn: sqlite3.Connection,
    transactie_id: int,
    factuur_id: int,
    door: str = "eigenaar",
    bron: str = "factuur",
) -> tuple[Optional[int], list[str]]:
    """Koppel een banktransactie aan een factuur en boek de betaling.

    `bron` zegt welke soort factuur het is: "factuur" voor een ontvangen
    factuur, "verkoopfactuur" voor een eigen factuur. Beide kanten gaan
    langs dezelfde controle en dezelfde boekingsfuncties.

    Dit gebeurt alleen op bevestiging van een mens: een voorstel uit het
    afletteren is nooit definitief. Geeft (boeking_id, redenen).
    """
    from .afletteren import stel_betaling_samen

    if bron not in ("factuur", "verkoopfactuur"):
        return None, [f"onbekende factuursoort '{bron}'"]

    transactie = lees_banktransactie(conn, transactie_id)
    if transactie["status"] != "open":
        return None, [
            f"deze transactie is al gekoppeld aan factuur "
            f"{transactie['factuur_id'] or transactie['verkoopfactuur_id']}"
        ]

    kolom = "factuur_id" if bron == "factuur" else "verkoopfactuur_id"
    if bron == "factuur":
        factuur = lees_factuur(conn, factuur_id)
        factuur["richting"] = _richting_van_boeking(conn, factuur_id)
    else:
        verkoop = lees_verkoopfactuur(conn, factuur_id)
        if verkoop["status"] != "definitief":
            return None, [
                "een concept is nog geen factuur; maak hem eerst definitief"
            ]
        factuur = {
            "id": verkoop["id"],
            "factuurnummer": verkoop["factuurnummer"],
            "administratie_id": verkoop["administratie_id"],
            "bedrag_incl": str(verkoop["totalen"].bedrag_incl),
            "richting": "verkoop",
        }

    if factuur["administratie_id"] != transactie["administratie_id"]:
        return None, ["deze factuur hoort bij een andere administratie"]

    al_gekoppeld = conn.execute(
        f"SELECT id FROM banktransacties WHERE {kolom} = ? AND id != ?",
        (factuur_id, transactie_id),
    ).fetchone()
    if al_gekoppeld is not None:
        return None, [
            f"factuur {factuur_id} hangt al aan banktransactie "
            f"{al_gekoppeld[0]}"
        ]

    voorstel = stel_betaling_samen(transactie, factuur)
    boeking_id, redenen = sla_boeking_op(
        conn, transactie["administratie_id"], voorstel, door=door
    )
    if boeking_id is None:
        return None, redenen

    tijd = _nu()
    conn.execute(
        f"""
        UPDATE banktransacties
        SET status = 'gekoppeld', {kolom} = ?, boeking_id = ?,
            gekoppeld_op = ?, gekoppeld_door = ?
        WHERE id = ?
        """,
        (factuur_id, boeking_id, tijd, door, transactie_id),
    )
    _audit(
        conn, transactie["administratie_id"], 'banktransacties', transactie_id, 'gewijzigd',
        veld=kolom,
        nieuwe_waarde=str(factuur_id),
        tijdstip=tijd,
        door=door,
    )
    conn.commit()
    return boeking_id, []


# --- klanten en verkoopfacturen (module 8) ------------------------------

# De eigen bedrijfsgegevens. Ze horen op elke verkoopfactuur te staan,
# dus ze staan bij de administratie en niet ergens in een configbestand.
EIGEN_GEGEVENS = (
    "adres", "postcode", "plaats", "land", "kvk_nummer", "btw_id",
    "iban", "email",
)

KLANT_VELDEN = (
    "naam", "adres", "postcode", "plaats", "land", "kvk_nummer",
    "btw_id", "email", "betalingstermijn",
)


def _verkoop_tabellen(conn: sqlite3.Connection) -> None:
    """De tabellen van module 8; aangeroepen vanuit maak_tabellen."""
    for kolom in EIGEN_GEGEVENS:
        _voeg_kolom_toe(conn, "administraties", kolom, "TEXT")

    conn.executescript(
        """
        CREATE TABLE IF NOT EXISTS klanten (
            id                INTEGER PRIMARY KEY,
            administratie_id  INTEGER NOT NULL REFERENCES administraties(id),
            naam              TEXT NOT NULL,
            adres             TEXT,
            postcode          TEXT,
            plaats            TEXT,
            land              TEXT NOT NULL DEFAULT 'Nederland',
            kvk_nummer        TEXT,
            btw_id            TEXT,
            email             TEXT,
            betalingstermijn  INTEGER NOT NULL DEFAULT 30,
            aangemaakt_op     TEXT NOT NULL,
            gewijzigd_op      TEXT NOT NULL
        );

        CREATE TABLE IF NOT EXISTS verkoopfacturen (
            id                INTEGER PRIMARY KEY,
            administratie_id  INTEGER NOT NULL REFERENCES administraties(id),
            klant_id          INTEGER NOT NULL REFERENCES klanten(id),
            status            TEXT NOT NULL DEFAULT 'concept'
                              CHECK (status IN ('concept', 'definitief')),
            soort             TEXT NOT NULL DEFAULT 'factuur'
                              CHECK (soort IN ('factuur', 'creditfactuur')),
            -- Blijft leeg zolang het een concept is: een nummer wordt pas
            -- toegekend bij het definitief maken, anders ontstaat er een
            -- gat zodra een concept wordt weggegooid.
            factuurnummer     TEXT,
            nummer_jaar       INTEGER,
            nummer_volg       INTEGER,
            factuurdatum      TEXT,
            vervaldatum       TEXT,
            betalingstermijn  INTEGER NOT NULL DEFAULT 30,
            opmerking         TEXT,
            corrigeert_id     INTEGER REFERENCES verkoopfacturen(id),
            -- Wie de klant wás en wie jij wás op het moment van
            -- definitief maken. Verhuist de klant later, dan verandert de
            -- verstuurde factuur niet mee.
            klant_gegevens    TEXT,
            eigen_gegevens    TEXT,
            boeking_id        INTEGER REFERENCES boekingen(id),
            -- De PDF zoals hij de deur uit ging, in de gewone
            -- documentopslag: onder zijn hash, alleen-lezen, 7 jaar.
            document_id       INTEGER REFERENCES documenten(id),
            definitief_op     TEXT,
            definitief_door   TEXT,
            aangemaakt_op     TEXT NOT NULL,
            gewijzigd_op      TEXT NOT NULL,
            UNIQUE (administratie_id, nummer_jaar, nummer_volg)
        );

        CREATE TABLE IF NOT EXISTS verkoopfactuurregels (
            id                INTEGER PRIMARY KEY,
            verkoopfactuur_id INTEGER NOT NULL REFERENCES verkoopfacturen(id),
            administratie_id  INTEGER NOT NULL REFERENCES administraties(id),
            volgnummer        INTEGER NOT NULL,
            omschrijving      TEXT NOT NULL DEFAULT '',
            -- Alle bedragen als tekst, nooit als float.
            aantal            TEXT NOT NULL DEFAULT '0',
            prijs_per_stuk    TEXT NOT NULL DEFAULT '0.00',
            btw_percentage    TEXT NOT NULL DEFAULT '0',
            rekening          TEXT,
            bedrag_excl       TEXT NOT NULL DEFAULT '0.00',
            btw_bedrag        TEXT NOT NULL DEFAULT '0.00'
        );
        """
    )
    _voeg_kolom_toe(
        conn, "verkoopfacturen", "document_id", "INTEGER REFERENCES documenten(id)"
    )
    # Dezelfde regel als de UNIQUE in CREATE TABLE hierboven, maar dan als
    # index — en die kan wél aan een bestaande tabel worden toegevoegd.
    # SQLite kan geen constraint bijzetten met ALTER TABLE, dus zonder dit
    # zou een database van vóór module 8 het dubbele nummer niet tegenhouden.
    # NULL telt in een index als "verschillend", dus concepten (die nog geen
    # nummer hebben) botsen hier niet op.
    conn.execute(
        """
        CREATE UNIQUE INDEX IF NOT EXISTS idx_verkoopfacturen_nummer
            ON verkoopfacturen (administratie_id, nummer_jaar, nummer_volg)
        """
    )
    conn.commit()


def lees_administratie(
    conn: sqlite3.Connection, administratie_id: int
) -> dict[str, Any]:
    """Lees een administratie met de eigen bedrijfsgegevens erbij."""
    cursor = conn.execute(
        "SELECT * FROM administraties WHERE id = ?", (administratie_id,)
    )
    rij = cursor.fetchone()
    if rij is None:
        raise ValueError(f"administratie {administratie_id} bestaat niet")
    kolommen = [k[0] for k in cursor.description]
    return dict(zip(kolommen, rij))


def wijzig_administratie(
    conn: sqlite3.Connection, administratie_id: int, gegevens: dict[str, Any]
) -> None:
    """Werk de eigen bedrijfsgegevens bij, met audit trail."""
    toegestaan = ("naam",) + EIGEN_GEGEVENS
    onbekend = set(gegevens) - set(toegestaan)
    if onbekend:
        raise ValueError(f"onbekende velden: {', '.join(sorted(onbekend))}")

    huidig = lees_administratie(conn, administratie_id)
    tijd = _nu()
    for veld, waarde in gegevens.items():
        nieuw = _als_tekst(waarde)
        if huidig.get(veld) == nieuw:
            continue
        conn.execute(
            f"UPDATE administraties SET {veld} = ? WHERE id = ?",
            (nieuw, administratie_id),
        )
        _audit(
            conn, administratie_id, 'administraties', administratie_id, 'gewijzigd',
            veld=veld,
            oude_waarde=huidig.get(veld),
            nieuwe_waarde=nieuw,
            tijdstip=tijd,
        )
    conn.commit()


def maak_klant(
    conn: sqlite3.Connection, administratie_id: int, gegevens: dict[str, Any]
) -> int:
    """Voeg een klant toe; geeft het id terug."""
    from .verkoop import STANDAARD_TERMIJN

    naam = str(gegevens.get("naam") or "").strip()
    if not naam:
        raise ValueError("een klant zonder naam bestaat niet")

    tijd = _nu()
    waarden = {veld: _als_tekst(gegevens.get(veld)) for veld in KLANT_VELDEN}
    waarden["naam"] = naam
    waarden["land"] = waarden["land"] or "Nederland"
    waarden["betalingstermijn"] = (
        waarden["betalingstermijn"] or str(STANDAARD_TERMIJN)
    )
    kolommen = ", ".join(KLANT_VELDEN)
    vraagtekens = ", ".join("?" for _ in KLANT_VELDEN)
    cursor = conn.execute(
        f"INSERT INTO klanten (administratie_id, {kolommen}, "
        f"aangemaakt_op, gewijzigd_op) VALUES (?, {vraagtekens}, ?, ?)",
        (administratie_id, *[waarden[v] for v in KLANT_VELDEN], tijd, tijd),
    )
    klant_id = cursor.lastrowid
    _audit(
        conn, administratie_id, 'klanten', klant_id, 'aangemaakt',
        nieuwe_waarde=json.dumps(waarden, ensure_ascii=False),
        tijdstip=tijd,
    )
    conn.commit()
    return klant_id


def wijzig_klant(
    conn: sqlite3.Connection, klant_id: int, gegevens: dict[str, Any]
) -> None:
    """Pas klantgegevens aan, met audit trail.

    Dit raakt verstuurde facturen niet: die bewaren bij het definitief
    maken een kopie van de klantgegevens zoals ze toen waren.
    """
    onbekend = set(gegevens) - set(KLANT_VELDEN)
    if onbekend:
        raise ValueError(f"onbekende klantvelden: {', '.join(sorted(onbekend))}")

    huidig = lees_klant(conn, klant_id)
    tijd = _nu()
    for veld, waarde in gegevens.items():
        nieuw = _als_tekst(waarde)
        if str(huidig.get(veld) or "") == str(nieuw or ""):
            continue
        conn.execute(
            f"UPDATE klanten SET {veld} = ?, gewijzigd_op = ? WHERE id = ?",
            (nieuw, tijd, klant_id),
        )
        _audit(
            conn, huidig["administratie_id"], 'klanten', klant_id, 'gewijzigd',
            veld=veld,
            oude_waarde=_als_tekst(huidig.get(veld)),
            nieuwe_waarde=nieuw,
            tijdstip=tijd,
        )
    conn.commit()


def lees_klant(conn: sqlite3.Connection, klant_id: int) -> dict[str, Any]:
    cursor = conn.execute("SELECT * FROM klanten WHERE id = ?", (klant_id,))
    rij = cursor.fetchone()
    if rij is None:
        raise ValueError(f"klant {klant_id} bestaat niet")
    kolommen = [k[0] for k in cursor.description]
    return dict(zip(kolommen, rij))


def lees_klanten(
    conn: sqlite3.Connection, administratie_id: int
) -> list[dict[str, Any]]:
    cursor = conn.execute(
        "SELECT * FROM klanten WHERE administratie_id = ? ORDER BY naam",
        (administratie_id,),
    )
    kolommen = [k[0] for k in cursor.description]
    return [dict(zip(kolommen, rij)) for rij in cursor.fetchall()]


def maak_verkoopfactuur(
    conn: sqlite3.Connection,
    administratie_id: int,
    klant_id: int,
    factuurdatum: Optional[str] = None,
) -> int:
    """Begin een nieuw concept voor deze klant.

    Er wordt hier bewust géén factuurnummer toegekend: dat gebeurt pas
    bij het definitief maken, zodat een weggegooid concept geen gat in
    de nummering achterlaat.
    """
    from .verkoop import STANDAARD_TERMIJN, vervaldatum

    klant = lees_klant(conn, klant_id)
    if klant["administratie_id"] != administratie_id:
        raise ValueError("deze klant hoort bij een andere administratie")

    termijn = int(klant["betalingstermijn"] or STANDAARD_TERMIJN)
    verval = None
    if factuurdatum:
        try:
            verval = str(vervaldatum(date.fromisoformat(factuurdatum), termijn))
        except ValueError:
            verval = None

    tijd = _nu()
    cursor = conn.execute(
        """
        INSERT INTO verkoopfacturen (
            administratie_id, klant_id, status, soort, factuurdatum,
            vervaldatum, betalingstermijn, aangemaakt_op, gewijzigd_op
        ) VALUES (?, ?, 'concept', 'factuur', ?, ?, ?, ?, ?)
        """,
        (administratie_id, klant_id, factuurdatum, verval, termijn, tijd, tijd),
    )
    factuur_id = cursor.lastrowid
    _audit(
        conn, administratie_id, 'verkoopfacturen', factuur_id, 'aangemaakt',
        nieuwe_waarde=json.dumps({"klant_id": klant_id, "factuurdatum": factuurdatum},
                    ensure_ascii=False),
        tijdstip=tijd,
    )
    conn.commit()
    return factuur_id


def _regels_van(
    conn: sqlite3.Connection, verkoopfactuur_id: int
) -> list[dict[str, Any]]:
    cursor = conn.execute(
        "SELECT * FROM verkoopfactuurregels WHERE verkoopfactuur_id = ? "
        "ORDER BY volgnummer",
        (verkoopfactuur_id,),
    )
    kolommen = [k[0] for k in cursor.description]
    return [dict(zip(kolommen, rij)) for rij in cursor.fetchall()]


def lees_verkoopfactuur(
    conn: sqlite3.Connection, verkoopfactuur_id: int
) -> dict[str, Any]:
    """Lees een verkoopfactuur met haar regels en de uitgerekende totalen.

    Bij een definitieve factuur komen de klant- en eigen gegevens uit de
    kopie die bij het definitief maken is bewaard; bij een concept uit
    de huidige gegevens, want die kunnen nog veranderen.
    """
    from .verkoop import bereken_regel, bereken_totalen

    cursor = conn.execute(
        "SELECT * FROM verkoopfacturen WHERE id = ?", (verkoopfactuur_id,)
    )
    rij = cursor.fetchone()
    if rij is None:
        raise ValueError(f"verkoopfactuur {verkoopfactuur_id} bestaat niet")
    kolommen = [k[0] for k in cursor.description]
    factuur = dict(zip(kolommen, rij))

    factuur["regels"] = [
        bereken_regel(regel, regel["volgnummer"])
        for regel in _regels_van(conn, verkoopfactuur_id)
    ]
    factuur["totalen"] = bereken_totalen(factuur["regels"])

    if factuur["status"] == "definitief":
        factuur["klant"] = json.loads(factuur["klant_gegevens"] or "{}")
        factuur["eigen"] = json.loads(factuur["eigen_gegevens"] or "{}")
    else:
        factuur["klant"] = lees_klant(conn, factuur["klant_id"])
        factuur["eigen"] = lees_administratie(conn, factuur["administratie_id"])
    factuur["klant_naam"] = factuur["klant"].get("naam")
    return factuur


def lees_verkoopfacturen(
    conn: sqlite3.Connection, administratie_id: int
) -> list[dict[str, Any]]:
    """De verkoopfacturen, concepten bovenaan en daarna de nieuwste eerst."""
    cursor = conn.execute(
        """
        SELECT id FROM verkoopfacturen
        WHERE administratie_id = ?
        ORDER BY CASE WHEN status = 'concept' THEN 0 ELSE 1 END,
                 nummer_jaar DESC, nummer_volg DESC, id DESC
        """,
        (administratie_id,),
    )
    return [lees_verkoopfactuur(conn, rij[0]) for rij in cursor.fetchall()]


def _alleen_concept(factuur: dict[str, Any]) -> Optional[str]:
    if factuur["status"] != "concept":
        return (
            f"factuur {factuur['factuurnummer']} is definitief; een "
            f"definitieve factuur wordt nooit gewijzigd of verwijderd. "
            f"Maak een creditfactuur als er iets niet klopt"
        )
    return None


def wijzig_verkoopfactuur(
    conn: sqlite3.Connection, verkoopfactuur_id: int, gegevens: dict[str, Any]
) -> tuple[bool, list[str]]:
    """Pas een concept aan. Een definitieve factuur wordt geweigerd."""
    from .verkoop import vervaldatum

    toegestaan = ("klant_id", "factuurdatum", "betalingstermijn", "opmerking")
    onbekend = set(gegevens) - set(toegestaan)
    if onbekend:
        raise ValueError(f"onbekende velden: {', '.join(sorted(onbekend))}")

    factuur = lees_verkoopfactuur(conn, verkoopfactuur_id)
    bezwaar = _alleen_concept(factuur)
    if bezwaar:
        return False, [bezwaar]

    tijd = _nu()
    for veld, waarde in gegevens.items():
        nieuw = _als_tekst(waarde)
        if str(factuur.get(veld) or "") == str(nieuw or ""):
            continue
        conn.execute(
            f"UPDATE verkoopfacturen SET {veld} = ?, gewijzigd_op = ? WHERE id = ?",
            (nieuw, tijd, verkoopfactuur_id),
        )
        _audit(
            conn, factuur["administratie_id"], 'verkoopfacturen', verkoopfactuur_id, 'gewijzigd',
            veld=veld,
            oude_waarde=_als_tekst(factuur.get(veld)),
            nieuwe_waarde=nieuw,
            tijdstip=tijd,
        )

    # De vervaldatum volgt uit de factuurdatum en de termijn; die wordt
    # dus nooit met de hand gezet.
    ververst = lees_verkoopfactuur(conn, verkoopfactuur_id)
    if ververst["factuurdatum"]:
        try:
            verval = str(vervaldatum(
                date.fromisoformat(ververst["factuurdatum"]),
                int(ververst["betalingstermijn"] or 30),
            ))
            conn.execute(
                "UPDATE verkoopfacturen SET vervaldatum = ? WHERE id = ?",
                (verval, verkoopfactuur_id),
            )
        except ValueError:
            pass
    conn.commit()
    return True, []


def zet_verkoopregels(
    conn: sqlite3.Connection,
    verkoopfactuur_id: int,
    regels: list[dict[str, Any]],
) -> tuple[bool, list[str]]:
    """Vervang de regels van een concept door deze lijst.

    De bedragen worden hier uitgerekend en niet overgenomen: wat de
    aanroeper aan bedragen meestuurt wordt genegeerd (Gouden regel 2).
    """
    from .verkoop import bereken_regel

    factuur = lees_verkoopfactuur(conn, verkoopfactuur_id)
    bezwaar = _alleen_concept(factuur)
    if bezwaar:
        return False, [bezwaar]

    tijd = _nu()
    conn.execute(
        "DELETE FROM verkoopfactuurregels WHERE verkoopfactuur_id = ?",
        (verkoopfactuur_id,),
    )
    for volgnummer, gegeven in enumerate(regels, start=1):
        regel = bereken_regel(gegeven, volgnummer)
        conn.execute(
            """
            INSERT INTO verkoopfactuurregels (
                verkoopfactuur_id, administratie_id, volgnummer, omschrijving,
                aantal, prijs_per_stuk, btw_percentage, rekening,
                bedrag_excl, btw_bedrag
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """,
            (
                verkoopfactuur_id, factuur["administratie_id"], volgnummer,
                regel.omschrijving, str(regel.aantal), str(regel.prijs_per_stuk),
                str(regel.btw_percentage), regel.rekening,
                str(regel.bedrag_excl), str(regel.btw_bedrag),
            ),
        )
    _audit(
        conn, factuur["administratie_id"], 'verkoopfacturen', verkoopfactuur_id, 'gewijzigd',
        veld='regels',
        oude_waarde=json.dumps([r.model_dump(mode="json") for r in factuur["regels"]],
                       ensure_ascii=False),
        nieuwe_waarde=json.dumps(regels, ensure_ascii=False, default=str),
        tijdstip=tijd,
    )
    conn.commit()
    return True, []


def verwijder_verkoopfactuur(
    conn: sqlite3.Connection, verkoopfactuur_id: int
) -> tuple[bool, list[str]]:
    """Gooi een concept weg. Een definitieve factuur blijft staan.

    Er ontstaat geen gat in de nummering: een concept heeft nog geen
    nummer.
    """
    factuur = lees_verkoopfactuur(conn, verkoopfactuur_id)
    bezwaar = _alleen_concept(factuur)
    if bezwaar:
        return False, [bezwaar]

    conn.execute(
        "DELETE FROM verkoopfactuurregels WHERE verkoopfactuur_id = ?",
        (verkoopfactuur_id,),
    )
    conn.execute("DELETE FROM verkoopfacturen WHERE id = ?", (verkoopfactuur_id,))
    _audit(
        conn, factuur["administratie_id"], 'verkoopfacturen', verkoopfactuur_id, 'gewijzigd',
        veld='status',
        oude_waarde='concept',
        nieuwe_waarde='verwijderd',
        tijdstip=_nu(),
    )
    conn.commit()
    return True, []


def controleer_verkoopfactuur(
    conn: sqlite3.Connection, verkoopfactuur_id: int
) -> list[str]:
    """Wat ontbreekt er nog voordat deze factuur definitief kan worden?"""
    from .verkoop import controleer_verplicht

    factuur = lees_verkoopfactuur(conn, verkoopfactuur_id)
    return controleer_verplicht(
        factuur, factuur["klant"], factuur["eigen"], factuur["regels"]
    )


def _bewaar_factuur_pdf(
    conn: sqlite3.Connection, factuur: dict[str, Any], opslagmap: str
) -> Optional[int]:
    """Maak de PDF van deze factuur en zet hem in de documentopslag.

    De PDF is deterministisch (geen tijdstempel erin), dus twee keer
    genereren geeft hetzelfde bestand en dezelfde hash. Hij gaat door
    dezelfde opslag als een ontvangen factuur: onder zijn hash,
    alleen-lezen, en nooit overschreven.
    """
    from .factuur_pdf import maak_factuur_pdf

    with tempfile.TemporaryDirectory() as tijdelijke_map:
        tijdelijk = Path(tijdelijke_map) / "factuur.pdf"
        tijdelijk.write_bytes(maak_factuur_pdf(factuur))
        document = bewaar_document(
            conn, factuur["administratie_id"], str(tijdelijk), opslagmap
        )
    return document.document_id


def maak_definitief(
    conn: sqlite3.Connection,
    verkoopfactuur_id: int,
    door: str = "eigenaar",
    opslagmap: Optional[str] = None,
) -> tuple[Optional[str], list[str]]:
    """Ken een factuurnummer toe, bewaar de gegevens en boek de factuur.

    Geeft (factuurnummer, redenen). Ontbreekt er een verplicht gegeven,
    dan gebeurt er niets en staat de lijst met wat er mist in redenen.

    Is er een opslagmap meegegeven, dan wordt de PDF gemaakt en bewaard
    zoals hij de deur uit gaat.
    """
    from .verkoop import stel_verkoopboeking_samen, volgend_nummer

    factuur = lees_verkoopfactuur(conn, verkoopfactuur_id)
    if factuur["status"] == "definitief":
        return None, [f"factuur {factuur['factuurnummer']} is al definitief"]

    ontbreekt = controleer_verkoopfactuur(conn, verkoopfactuur_id)
    if ontbreekt:
        return None, ontbreekt

    jaar = date.fromisoformat(factuur["factuurdatum"]).year

    # Vanaf hier tot het opslaan van de boeking geldt een schrijfslot.
    #
    # Zonder dat slot kunnen twee aanroepen tegelijk hetzelfde hoogste
    # nummer lezen en er allebei één bij optellen — dan krijgen twee
    # facturen hetzelfde nummer. Zodra er via het web wordt gewerkt
    # gebeurt dat vroeg of laat, en een dubbel factuurnummer is precies
    # wat niet mag.
    #
    # BEGIN IMMEDIATE pakt meteen het schrijfslot van de database. Een
    # tweede aanroep blijft daar wachten (tot de timeout van de
    # verbinding, standaard vijf seconden) en leest daarna het nummer dat
    # de eerste net heeft weggeschreven. De unieke index is de tweede
    # verdediging: mocht er ooit toch een tweede weg omheen zijn, dan
    # weigert de database het.
    eigen_slot = not conn.in_transaction
    if eigen_slot:
        conn.execute("BEGIN IMMEDIATE")

    hoogste = conn.execute(
        "SELECT max(nummer_volg) FROM verkoopfacturen "
        "WHERE administratie_id = ? AND nummer_jaar = ?",
        (factuur["administratie_id"], jaar),
    ).fetchone()[0]
    volgnummer, factuurnummer = volgend_nummer(jaar, hoogste)

    tijd = _nu()
    conn.execute(
        """
        UPDATE verkoopfacturen SET
            status = 'definitief', factuurnummer = ?, nummer_jaar = ?,
            nummer_volg = ?, klant_gegevens = ?, eigen_gegevens = ?,
            definitief_op = ?, definitief_door = ?, gewijzigd_op = ?
        WHERE id = ?
        """,
        (
            factuurnummer, jaar, volgnummer,
            json.dumps(factuur["klant"], ensure_ascii=False, default=str),
            json.dumps(factuur["eigen"], ensure_ascii=False, default=str),
            tijd, door, tijd, verkoopfactuur_id,
        ),
    )

    voorstel = stel_verkoopboeking_samen(
        {**factuur, "factuurnummer": factuurnummer}, factuur["regels"]
    )
    boeking_id, boekredenen = sla_boeking_op(
        conn, factuur["administratie_id"], voorstel, door=door
    )
    if boeking_id is None:
        # Zonder boeking geen definitieve factuur: anders staat er wel een
        # nummer maar niets in het grootboek. De rollback laat meteen het
        # schrijfslot los, zodat een wachtende aanroep verder kan — en die
        # krijgt dan hetzelfde nummer, want dit nummer is niet gebruikt.
        conn.rollback()
        return None, boekredenen

    conn.execute(
        "UPDATE verkoopfacturen SET boeking_id = ? WHERE id = ?",
        (boeking_id, verkoopfactuur_id),
    )

    if opslagmap is not None:
        definitief = lees_verkoopfactuur(conn, verkoopfactuur_id)
        if factuur.get("corrigeert_id"):
            origineel = lees_verkoopfactuur(conn, factuur["corrigeert_id"])
            definitief["corrigeert_nummer"] = origineel["factuurnummer"]
        document_id = _bewaar_factuur_pdf(conn, definitief, opslagmap)
        conn.execute(
            "UPDATE verkoopfacturen SET document_id = ? WHERE id = ?",
            (document_id, verkoopfactuur_id),
        )
    _audit(
        conn, factuur["administratie_id"], 'verkoopfacturen', verkoopfactuur_id, 'gewijzigd',
        veld='status',
        oude_waarde='concept',
        nieuwe_waarde=f"definitief {factuurnummer}",
        tijdstip=tijd,
        door=door,
    )
    conn.commit()
    return factuurnummer, []


def maak_creditfactuur(
    conn: sqlite3.Connection, verkoopfactuur_id: int
) -> tuple[Optional[int], list[str]]:
    """Maak een concept-creditfactuur bij een definitieve factuur.

    Dezelfde regels met een negatief aantal, en een verwijzing naar het
    origineel. Zo blijft de oorspronkelijke factuur staan zoals hij de
    deur uit is gegaan, en heffen de twee elkaar op zodra de
    creditfactuur definitief wordt.
    """
    factuur = lees_verkoopfactuur(conn, verkoopfactuur_id)
    if factuur["status"] != "definitief":
        return None, [
            "een concept crediteer je niet; pas het aan of gooi het weg"
        ]
    if factuur["soort"] == "creditfactuur":
        return None, ["een creditfactuur crediteer je niet nog een keer"]

    bestaat = conn.execute(
        "SELECT id FROM verkoopfacturen WHERE corrigeert_id = ?",
        (verkoopfactuur_id,),
    ).fetchone()
    if bestaat is not None:
        return None, [
            f"factuur {factuur['factuurnummer']} is al gecrediteerd met "
            f"factuur {bestaat[0]}"
        ]

    nieuw_id = maak_verkoopfactuur(
        conn, factuur["administratie_id"], factuur["klant_id"],
        factuur["factuurdatum"],
    )
    conn.execute(
        "UPDATE verkoopfacturen SET soort = 'creditfactuur', corrigeert_id = ?, "
        "opmerking = ? WHERE id = ?",
        (
            verkoopfactuur_id,
            f"Creditering van factuur {factuur['factuurnummer']}",
            nieuw_id,
        ),
    )
    zet_verkoopregels(conn, nieuw_id, [
        {
            "omschrijving": regel.omschrijving,
            "aantal": str(-regel.aantal),
            "prijs_per_stuk": str(regel.prijs_per_stuk),
            "btw_percentage": str(regel.btw_percentage),
            "rekening": regel.rekening,
        }
        for regel in factuur["regels"]
    ])
    conn.commit()
    return nieuw_id, []


# --- gebruikers, sessies en toegang (module 9) --------------------------

def _toegang_tabellen(conn: sqlite3.Connection) -> None:
    """De tabellen van module 9; aangeroepen vanuit maak_tabellen."""
    conn.executescript(
        """
        CREATE TABLE IF NOT EXISTS gebruikers (
            id               INTEGER PRIMARY KEY,
            email            TEXT NOT NULL UNIQUE,
            naam             TEXT NOT NULL,
            -- Alleen de bcrypt-hash. Het wachtwoord zelf staat nergens.
            wachtwoord_hash  TEXT NOT NULL,
            rol              TEXT NOT NULL
                             CHECK (rol IN ('eigenaar', 'klant')),
            actief           INTEGER NOT NULL DEFAULT 1,
            aangemaakt_op    TEXT NOT NULL,
            gewijzigd_op     TEXT NOT NULL
        );

        -- Welke klant bij welke administratie mag. De eigenaar staat hier
        -- niet in: die mag overal bij.
        CREATE TABLE IF NOT EXISTS gebruiker_administraties (
            gebruiker_id     INTEGER NOT NULL REFERENCES gebruikers(id),
            administratie_id INTEGER NOT NULL REFERENCES administraties(id),
            aangemaakt_op    TEXT NOT NULL,
            PRIMARY KEY (gebruiker_id, administratie_id)
        );

        CREATE TABLE IF NOT EXISTS sessies (
            id               INTEGER PRIMARY KEY,
            -- De hash van het sessietoken, niet het token zelf: wie de
            -- database leest kan er niet mee inloggen.
            token_hash       TEXT NOT NULL UNIQUE,
            gebruiker_id     INTEGER NOT NULL REFERENCES gebruikers(id),
            csrf_token       TEXT NOT NULL,
            ip               TEXT,
            aangemaakt_op    TEXT NOT NULL,
            verloopt_op      TEXT NOT NULL,
            ingetrokken_op   TEXT
        );

        -- Elke inlogpoging, gelukt of niet. Hierop rust de rem, en het is
        -- meteen de audit trail van het inloggen zelf: de audit_log gaat
        -- over een administratie, en een mislukte poging hoort bij geen
        -- enkele administratie.
        CREATE TABLE IF NOT EXISTS toegang_log (
            id               INTEGER PRIMARY KEY,
            soort            TEXT NOT NULL,
            email            TEXT,
            gebruiker_id     INTEGER REFERENCES gebruikers(id),
            ip               TEXT,
            gelukt           INTEGER NOT NULL DEFAULT 0,
            tijdstip         TEXT NOT NULL
        );

        CREATE INDEX IF NOT EXISTS idx_toegang_log_email
            ON toegang_log (email, tijdstip);
        CREATE INDEX IF NOT EXISTS idx_toegang_log_ip
            ON toegang_log (ip, tijdstip);
        """
    )
    # De melding na een handeling ("Opgeslagen", "Factuur 2026-0003 is
    # definitief") hangt aan de sessie en niet aan het adres. Zo komt hij
    # niet in serverlogs en niet in de geschiedenis van de browser, en
    # gaat er geen tekst via de adresbalk naar het scherm.
    _voeg_kolom_toe(conn, "sessies", "melding", "TEXT")
    _voeg_kolom_toe(conn, "sessies", "melding_soort", "TEXT")
    conn.commit()


def _gebruiker_van_rij(
    conn: sqlite3.Connection, rij: dict[str, Any]
) -> "Gebruiker":
    from .gebruikers import Gebruiker

    administraties = [
        r[0] for r in conn.execute(
            "SELECT administratie_id FROM gebruiker_administraties "
            "WHERE gebruiker_id = ? ORDER BY administratie_id",
            (rij["id"],),
        )
    ]
    return Gebruiker(
        id=rij["id"], email=rij["email"], naam=rij["naam"], rol=rij["rol"],
        actief=bool(rij["actief"]), administraties=administraties,
    )


def maak_gebruiker(
    conn: sqlite3.Connection,
    email: str,
    naam: str,
    wachtwoord: str,
    rol: str = "klant",
    administraties: Optional[list[int]] = None,
    door: str = "systeem",
) -> int:
    """Maak een gebruiker aan; geeft het id terug.

    Het wachtwoord wordt hier meteen gehasht en verder nergens bewaard —
    ook niet in de audit trail. Daar staat alleen dát er een gebruiker
    is aangemaakt, met welk e-mailadres en welke rol.
    """
    from .gebruikers import ROLLEN, hash_wachtwoord, normaliseer_email

    if rol not in ROLLEN:
        raise ValueError(f"onbekende rol '{rol}'; kies uit {', '.join(ROLLEN)}")
    adres = normaliseer_email(email)
    if not adres or "@" not in adres:
        raise ValueError(f"'{email}' is geen e-mailadres")
    if not (naam or "").strip():
        raise ValueError("een gebruiker zonder naam bestaat niet")

    tijd = _nu()
    cursor = conn.execute(
        """
        INSERT INTO gebruikers (
            email, naam, wachtwoord_hash, rol, actief, aangemaakt_op, gewijzigd_op
        ) VALUES (?, ?, ?, ?, 1, ?, ?)
        """,
        (adres, naam.strip(), hash_wachtwoord(wachtwoord), rol, tijd, tijd),
    )
    gebruiker_id = cursor.lastrowid

    for administratie_id in administraties or []:
        conn.execute(
            "INSERT OR IGNORE INTO gebruiker_administraties "
            "(gebruiker_id, administratie_id, aangemaakt_op) VALUES (?, ?, ?)",
            (gebruiker_id, administratie_id, tijd),
        )
        _audit(
            conn, administratie_id, "gebruikers", gebruiker_id, "aangemaakt",
            nieuwe_waarde=json.dumps(
                {"email": adres, "naam": naam.strip(), "rol": rol},
                ensure_ascii=False,
            ),
            door=door, tijdstip=tijd,
        )

    conn.execute(
        "INSERT INTO toegang_log (soort, email, gebruiker_id, gelukt, tijdstip) "
        "VALUES ('gebruiker_aangemaakt', ?, ?, 1, ?)",
        (adres, gebruiker_id, tijd),
    )
    conn.commit()
    return gebruiker_id


def lees_gebruiker(
    conn: sqlite3.Connection, gebruiker_id: int
) -> Optional["Gebruiker"]:
    cursor = conn.execute("SELECT * FROM gebruikers WHERE id = ?", (gebruiker_id,))
    rij = cursor.fetchone()
    if rij is None:
        return None
    kolommen = [k[0] for k in cursor.description]
    return _gebruiker_van_rij(conn, dict(zip(kolommen, rij)))


def lees_gebruikers(conn: sqlite3.Connection) -> list["Gebruiker"]:
    cursor = conn.execute("SELECT * FROM gebruikers ORDER BY rol, email")
    kolommen = [k[0] for k in cursor.description]
    return [
        _gebruiker_van_rij(conn, dict(zip(kolommen, rij)))
        for rij in cursor.fetchall()
    ]


def koppel_administratie(
    conn: sqlite3.Connection,
    gebruiker_id: int,
    administratie_id: int,
    door: str = "systeem",
) -> None:
    """Geef een klant toegang tot een administratie."""
    tijd = _nu()
    conn.execute(
        "INSERT OR IGNORE INTO gebruiker_administraties "
        "(gebruiker_id, administratie_id, aangemaakt_op) VALUES (?, ?, ?)",
        (gebruiker_id, administratie_id, tijd),
    )
    _audit(
        conn, administratie_id, "gebruiker_administraties", gebruiker_id,
        "aangemaakt", veld="toegang", nieuwe_waarde=str(administratie_id),
        door=door, tijdstip=tijd,
    )
    conn.commit()


def _tel_pogingen(
    conn: sqlite3.Connection, kolom: str, waarde: str, vanaf: str
) -> int:
    rij = conn.execute(
        f"SELECT count(*) FROM toegang_log WHERE soort = 'inlog' AND gelukt = 0 "
        f"AND {kolom} = ? AND tijdstip >= ?",
        (waarde, vanaf),
    ).fetchone()
    return rij[0]


def _log_poging(
    conn: sqlite3.Connection,
    email: str,
    ip: Optional[str],
    gelukt: bool,
    gebruiker_id: Optional[int] = None,
    soort: str = "inlog",
) -> None:
    conn.execute(
        "INSERT INTO toegang_log (soort, email, gebruiker_id, ip, gelukt, tijdstip) "
        "VALUES (?, ?, ?, ?, ?, ?)",
        (soort, email, gebruiker_id, ip, 1 if gelukt else 0, _nu()),
    )
    conn.commit()


def te_veel_pogingen(
    conn: sqlite3.Connection, email: str, ip: Optional[str]
) -> bool:
    """Zit dit account of dit IP-adres aan de rem?

    Geteld wordt per account én per IP-adres. Per account, want anders
    kan iemand rustig wachtwoorden proberen op één adres. Per IP, want
    anders probeert iemand één wachtwoord op duizend adressen.
    """
    from .gebruikers import (
        MAX_PER_ACCOUNT, MAX_PER_IP, VENSTER_MINUTEN, normaliseer_email, nu,
    )

    vanaf = (nu() - timedelta(minutes=VENSTER_MINUTEN)).isoformat(timespec="seconds")
    if _tel_pogingen(conn, "email", normaliseer_email(email), vanaf) >= MAX_PER_ACCOUNT:
        return True
    if ip and _tel_pogingen(conn, "ip", ip, vanaf) >= MAX_PER_IP:
        return True
    return False


def probeer_inloggen(
    conn: sqlite3.Connection,
    email: str,
    wachtwoord: str,
    ip: Optional[str] = None,
) -> tuple[Optional[str], list[str]]:
    """Log in en geef (sessietoken, redenen).

    Bij elke mislukking dezelfde melding en hetzelfde werk: ook als het
    e-mailadres niet bestaat wordt er een wachtwoord gecontroleerd, tegen
    een vaste onbruikbare hash. Zou dat niet gebeuren, dan is een
    bestaand account te herkennen aan hoe lang het antwoord duurt.
    """
    from .gebruikers import (
        INLOG_MISLUKT, TE_VAAK, controleer_wachtwoord, csrf_token, hash_token,
        hash_wachtwoord, nieuw_token, normaliseer_email, verlooptijd,
    )

    adres = normaliseer_email(email)
    if te_veel_pogingen(conn, adres, ip):
        _log_poging(conn, adres, ip, False, soort="inlog_geblokkeerd")
        return None, [TE_VAAK]

    cursor = conn.execute("SELECT * FROM gebruikers WHERE email = ?", (adres,))
    rij = cursor.fetchone()
    gegevens = None
    if rij is not None:
        gegevens = dict(zip([k[0] for k in cursor.description], rij))

    # Altijd hetzelfde rekenwerk, ook bij een onbekend adres.
    hash_waarde = gegevens["wachtwoord_hash"] if gegevens else _LEGE_HASH()
    klopt = controleer_wachtwoord(wachtwoord, hash_waarde)

    if gegevens is None or not klopt or not gegevens["actief"]:
        _log_poging(
            conn, adres, ip, False,
            gebruiker_id=gegevens["id"] if gegevens else None,
        )
        return None, [INLOG_MISLUKT]

    token = nieuw_token()
    tijd = _nu()
    conn.execute(
        """
        INSERT INTO sessies (
            token_hash, gebruiker_id, csrf_token, ip, aangemaakt_op, verloopt_op
        ) VALUES (?, ?, ?, ?, ?, ?)
        """,
        (
            hash_token(token), gegevens["id"], csrf_token(), ip, tijd,
            verlooptijd().isoformat(timespec="seconds"),
        ),
    )
    _log_poging(conn, adres, ip, True, gebruiker_id=gegevens["id"])
    conn.commit()
    return token, []


_LEGE_HASH_WAARDE: Optional[str] = None


def _LEGE_HASH() -> str:
    """Een hash die nooit klopt, om ook bij een onbekend adres te rekenen.

    Hij wordt één keer gemaakt en daarna hergebruikt; hem elke keer
    opnieuw maken zou juist tijd kosten en het verschil weer zichtbaar
    maken.
    """
    global _LEGE_HASH_WAARDE
    if _LEGE_HASH_WAARDE is None:
        from .gebruikers import hash_wachtwoord

        _LEGE_HASH_WAARDE = hash_wachtwoord("dit-wachtwoord-bestaat-niet")
    return _LEGE_HASH_WAARDE


def lees_sessie(
    conn: sqlite3.Connection, token: Optional[str]
) -> Optional[dict[str, Any]]:
    """Zoek de sessie bij dit token, als hij nog geldig is."""
    from .gebruikers import hash_token, is_verlopen

    if not token:
        return None
    cursor = conn.execute(
        "SELECT * FROM sessies WHERE token_hash = ?", (hash_token(token),)
    )
    rij = cursor.fetchone()
    if rij is None:
        return None
    sessie = dict(zip([k[0] for k in cursor.description], rij))
    if sessie["ingetrokken_op"] or is_verlopen(sessie["verloopt_op"]):
        return None

    gebruiker = lees_gebruiker(conn, sessie["gebruiker_id"])
    if gebruiker is None or not gebruiker.actief:
        return None
    sessie["gebruiker"] = gebruiker
    return sessie


def trek_sessie_in(
    conn: sqlite3.Connection, token: str, reden: str = "uitgelogd"
) -> None:
    """Beëindig een sessie. Uitloggen doet dit, en de eigenaar kan het ook."""
    from .gebruikers import hash_token

    tijd = _nu()
    cursor = conn.execute(
        "UPDATE sessies SET ingetrokken_op = ? WHERE token_hash = ? "
        "AND ingetrokken_op IS NULL",
        (tijd, hash_token(token)),
    )
    if cursor.rowcount:
        conn.execute(
            "INSERT INTO toegang_log (soort, gelukt, tijdstip) VALUES (?, 1, ?)",
            (reden, tijd),
        )
    conn.commit()


MELDING_SOORTEN = ("melding", "fout")


def zet_melding(
    conn: sqlite3.Connection,
    token: Optional[str],
    tekst: str,
    soort: str = "melding",
) -> None:
    """Bewaar één melding bij deze sessie, voor het volgende scherm.

    Dit is de vervanger van `?melding=…` in het adres. De tekst blijft
    op de server; de browser krijgt alleen een adres zonder tekst. Er is
    ruimte voor één melding per sessie: je doet één handeling en ziet
    daarna één antwoord.
    """
    from .gebruikers import hash_token

    if not token or not tekst:
        return
    if soort not in MELDING_SOORTEN:
        raise ValueError(
            f"onbekende soort melding '{soort}'; kies uit "
            f"{', '.join(MELDING_SOORTEN)}"
        )
    conn.execute(
        "UPDATE sessies SET melding = ?, melding_soort = ? WHERE token_hash = ?",
        (tekst, soort, hash_token(token)),
    )
    conn.commit()


def haal_melding(
    conn: sqlite3.Connection, token: Optional[str]
) -> Optional[tuple[str, str]]:
    """Lees de melding van deze sessie en wis hem meteen.

    Wissen hoort bij lezen: anders blijft dezelfde melding staan als je
    daarna nog een keer op ververs drukt.
    """
    from .gebruikers import hash_token

    if not token:
        return None
    sleutel = hash_token(token)
    rij = conn.execute(
        "SELECT melding, melding_soort FROM sessies WHERE token_hash = ?",
        (sleutel,),
    ).fetchone()
    if rij is None or not rij[0]:
        return None
    conn.execute(
        "UPDATE sessies SET melding = NULL, melding_soort = NULL "
        "WHERE token_hash = ?",
        (sleutel,),
    )
    conn.commit()
    return rij[0], rij[1] or "melding"


def lees_toegang_log(
    conn: sqlite3.Connection, limiet: int = 100
) -> list[dict[str, Any]]:
    """De laatste inlogpogingen en sessiegebeurtenissen, nieuwste eerst."""
    cursor = conn.execute(
        "SELECT * FROM toegang_log ORDER BY id DESC LIMIT ?", (limiet,)
    )
    kolommen = [k[0] for k in cursor.description]
    return [dict(zip(kolommen, rij)) for rij in cursor.fetchall()]
