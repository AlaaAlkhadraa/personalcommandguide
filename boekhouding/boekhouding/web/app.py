"""De routes van de webinterface.

Elke route doet drie dingen en niet meer: gegevens ophalen, een functie
uit de boekhoudmodules aanroepen, en het resultaat aan een sjabloon
geven. Er wordt hier niet gerekend, niet gevalideerd en niets bepaald
over btw — dat zit allemaal in de modules eronder.
"""

import sqlite3
from datetime import date
from pathlib import Path
from typing import Any, Optional

from fastapi import FastAPI, Form, Request, UploadFile
from fastapi.responses import FileResponse, HTMLResponse, RedirectResponse
from fastapi.templating import Jinja2Templates

from ..ai_extractie import VELDEN
from ..database import (
    FACTUUR_VELDEN,
    keur_factuur_goed,
    lees_document,
    lees_extractie_bij_document,
    lees_facturen,
    lees_factuur,
    maak_administratie,
    maak_tabellen,
    maak_verbinding,
    wijzig_factuur,
)
from ..verwerking import verwerk_upload

SJABLONEN = Jinja2Templates(directory=str(Path(__file__).parent / "templates"))

# Hoe de velden in het reviewscherm heten, in de volgorde waarin ze op
# een factuur staan.
VELDLABELS = {
    "leverancier": "Leverancier",
    "factuurdatum": "Factuurdatum",
    "factuurnummer": "Factuurnummer",
    "bedrag_excl": "Bedrag excl. btw",
    "btw_percentage": "Btw-percentage",
    "btw_bedrag": "Btw-bedrag",
    "bedrag_incl": "Totaal incl. btw",
}

MEDIATYPEN = {
    ".pdf": "application/pdf",
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
    ".png": "image/png",
    ".xml": "application/xml",
}


def maak_app(
    db_pad: str,
    opslagmap: str,
    *,
    ai_client: Any = None,
    vandaag: Optional[date] = None,
    administratie_naam: str = "Mijn eenmanszaak",
) -> FastAPI:
    """Bouw de applicatie.

    ai_client en vandaag zijn er om te kunnen testen zonder echte
    API-aanroepen en zonder afhankelijk te zijn van de klok.
    """
    app = FastAPI(title="Boekhouding — review")
    app.state.db_pad = db_pad
    app.state.opslagmap = opslagmap
    app.state.ai_client = ai_client
    app.state.vandaag = vandaag

    # Zorg dat er een database en minstens één administratie is.
    Path(opslagmap).mkdir(parents=True, exist_ok=True)
    start = maak_verbinding(db_pad)
    maak_tabellen(start)
    if start.execute("SELECT count(*) FROM administraties").fetchone()[0] == 0:
        maak_administratie(start, administratie_naam)
    start.close()

    def verbinding() -> sqlite3.Connection:
        return maak_verbinding(app.state.db_pad)

    def toon(request: Request, sjabloon: str, **gegevens) -> HTMLResponse:
        return SJABLONEN.TemplateResponse(
            request=request, name=sjabloon, context=gegevens
        )

    # --- overzicht ------------------------------------------------------

    @app.get("/", response_class=HTMLResponse)
    def start_pagina():
        conn = verbinding()
        eerste = conn.execute("SELECT id FROM administraties ORDER BY id").fetchone()
        conn.close()
        return RedirectResponse(f"/administratie/{eerste[0]}", status_code=303)

    @app.get("/administratie/{administratie_id}", response_class=HTMLResponse)
    def overzicht(request: Request, administratie_id: int):
        conn = verbinding()
        administratie = conn.execute(
            "SELECT id, naam FROM administraties WHERE id = ?", (administratie_id,)
        ).fetchone()
        facturen = lees_facturen(conn, administratie_id) if administratie else []
        conn.close()

        if administratie is None:
            return toon(
                request, "fout.html",
                titel="Administratie niet gevonden",
                bericht=f"Er is geen administratie met nummer {administratie_id}.",
            )

        return toon(
            request, "overzicht.html",
            administratie_id=administratie_id,
            administratie_naam=administratie[1],
            facturen=facturen,
            aantal_review=sum(1 for f in facturen if f["status"] == "review_nodig"),
            aantal_wacht=sum(
                1 for f in facturen
                if f["status"] == "gevalideerd" and f["goedgekeurd_op"] is None
            ),
        )

    # --- uploaden -------------------------------------------------------

    @app.get("/administratie/{administratie_id}/upload", response_class=HTMLResponse)
    def uploadscherm(request: Request, administratie_id: int):
        return toon(request, "upload.html", administratie_id=administratie_id)

    @app.post("/administratie/{administratie_id}/upload")
    async def upload_ontvangen(
        request: Request, administratie_id: int, bestand: UploadFile
    ):
        inhoud = await bestand.read()
        conn = verbinding()
        resultaat = verwerk_upload(
            conn, administratie_id, bestand.filename or "onbekend", inhoud,
            app.state.opslagmap,
            ai_client=app.state.ai_client, vandaag=app.state.vandaag,
        )
        conn.close()

        if resultaat.factuur_id is None:
            # Er is geen factuur ontstaan; laat zien waarom, in plaats
            # van de gebruiker terug te sturen naar een lege lijst.
            return toon(
                request, "fout.html",
                titel="Dit bestand is niet verwerkt",
                bericht=" ".join(resultaat.redenen),
                terug=f"/administratie/{administratie_id}/upload",
            )
        return RedirectResponse(f"/factuur/{resultaat.factuur_id}", status_code=303)

    # --- reviewscherm ---------------------------------------------------

    @app.get("/factuur/{factuur_id}", response_class=HTMLResponse)
    def review(request: Request, factuur_id: int, melding: str = ""):
        conn = verbinding()
        try:
            factuur = lees_factuur(conn, factuur_id)
        except ValueError:
            conn.close()
            return toon(
                request, "fout.html",
                titel="Factuur niet gevonden",
                bericht=f"Er is geen factuur met nummer {factuur_id}.",
            )
        extractie = lees_extractie_bij_document(conn, factuur["document_id"])
        conn.close()

        return toon(
            request, "review.html",
            factuur=factuur,
            velden=_veldregels(factuur, extractie),
            extractie=extractie,
            melding=melding,
            mag_goedkeuren=(
                factuur["status"] == "gevalideerd"
                and factuur["goedgekeurd_op"] is None
            ),
        )

    @app.post("/factuur/{factuur_id}/opslaan")
    async def opslaan(request: Request, factuur_id: int):
        formulier = await request.form()
        wijzigingen = {
            veld: str(formulier[veld]).strip()
            for veld in FACTUUR_VELDEN
            if veld in formulier
        }
        conn = verbinding()
        # Wijzigingen gaan altijd via wijzig_factuur: die bewaart de
        # oude waarde in de audit trail en hervalideert de factuur.
        wijzig_factuur(conn, factuur_id, wijzigingen, vandaag=app.state.vandaag)
        conn.close()
        return RedirectResponse(
            f"/factuur/{factuur_id}?melding=Opgeslagen", status_code=303
        )

    @app.post("/factuur/{factuur_id}/goedkeuren")
    def goedkeuren(factuur_id: int):
        conn = verbinding()
        gelukt, redenen = keur_factuur_goed(conn, factuur_id)
        administratie_id = lees_factuur(conn, factuur_id)["administratie_id"]
        conn.close()

        if not gelukt:
            return RedirectResponse(
                f"/factuur/{factuur_id}?melding={redenen[0]}", status_code=303
            )
        return RedirectResponse(f"/administratie/{administratie_id}", status_code=303)

    # --- het originele document laten zien -------------------------------

    @app.get("/document/{document_id}")
    def document(document_id: int):
        conn = verbinding()
        try:
            registratie = lees_document(conn, document_id)
        except ValueError:
            conn.close()
            return HTMLResponse("Document niet gevonden", status_code=404)
        conn.close()

        # Het pad komt uit de database, nooit uit het verzoek: een
        # bezoeker kan dus geen ander bestand van de schijf opvragen.
        pad = Path(registratie["opslagpad"])
        if not pad.is_file():
            return HTMLResponse("Bestand niet meer gevonden", status_code=404)
        return FileResponse(
            pad,
            media_type=MEDIATYPEN.get(pad.suffix.lower(), "application/octet-stream"),
            filename=registratie["originele_bestandsnaam"],
            content_disposition_type="inline",
        )

    return app


def _veldregels(factuur: dict, extractie: Optional[dict]) -> list[dict]:
    """Zet de velden klaar voor het scherm, met zekerheid per veld."""
    zekerheden = _zekerheden(extractie)
    regels = []
    for veld in VELDEN:
        gegeven = zekerheden.get(veld, {})
        regels.append(
            {
                "naam": veld,
                "label": VELDLABELS.get(veld, veld),
                "waarde": factuur.get(veld) or "",
                "zekerheid": gegeven.get("zekerheid"),
                "reden": gegeven.get("reden"),
            }
        )
    return regels


def _zekerheden(extractie: Optional[dict]) -> dict[str, dict]:
    """Haal de zekerheid per veld uit de bewaarde modelrespons.

    Bij een e-factuur is er geen extractie: dan is er ook niets
    onzekers, want de velden stonden letterlijk in het XML-bestand.
    """
    if extractie is None:
        return {}
    import json

    try:
        ruw = json.loads(extractie["ruwe_respons"])
    except (ValueError, TypeError):
        return {}
    if not isinstance(ruw, dict):
        return {}
    return {
        veld: gegeven
        for veld, gegeven in ruw.items()
        if isinstance(gegeven, dict) and "zekerheid" in gegeven
    }
