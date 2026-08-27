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

from fastapi import FastAPI, HTTPException, Request, UploadFile
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
from ..ubl import te_groot
from ..verwerking import verwerk_upload
from .ubl_weergave import Weergave, leesbare_ubl

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


class NietGevonden(HTTPException):
    """Eén antwoord voor twee gevallen, en dat is met opzet.

    Vraagt iemand een factuur op die niet bestaat, of een factuur die
    wel bestaat maar bij een andere administratie hoort, dan krijgt hij
    exact hetzelfde te zien: 404, niet gevonden. Een 403 ("mag niet")
    zou verklappen dat het record bestaat, en dan weet iemand die de
    nummers in de adresbalk aan het aflopen is precies waar wat zit.
    """

    def __init__(self, soort: str = "pagina"):
        super().__init__(status_code=404, detail=soort)


def hoort_bij_administratie(
    conn: sqlite3.Connection,
    lees: Any,
    record_id: int,
    administratie_id: int,
    soort: str,
) -> dict[str, Any]:
    """Haal een record op en controleer dat het bij deze administratie hoort.

    Dit is de enige plek waar die controle staat. Elke route die een
    factuur of een document aanraakt gaat hierlangs, zodat er straks —
    als er klantaccounts komen — geen route vergeten kan zijn.

    Nu is er nog één gebruiker en dus geen kwaad kunnen, maar het adres
    van een factuur is een nummer dat iedereen kan ophogen. Zonder deze
    controle zou klant B straks de facturen van klant A kunnen bekijken
    en aanpassen door het nummer in de adresbalk te veranderen.
    """
    try:
        record = lees(conn, record_id)
    except ValueError:
        raise NietGevonden(soort)
    if record.get("administratie_id") != administratie_id:
        raise NietGevonden(soort)
    return record


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

    @app.exception_handler(404)
    def niet_gevonden(request: Request, fout: HTTPException):
        """Een 404 is ook gewoon een pagina, geen brok JSON."""
        return SJABLONEN.TemplateResponse(
            request=request, name="fout.html", status_code=404,
            context={
                "titel": "Niet gevonden",
                "bericht": "Deze pagina bestaat niet, of hoort niet bij deze "
                           "administratie.",
                "terug": "/",
            },
        )

    def administratie_van(conn: sqlite3.Connection, administratie_id: int):
        rij = conn.execute(
            "SELECT id, naam FROM administraties WHERE id = ?", (administratie_id,)
        ).fetchone()
        if rij is None:
            raise NietGevonden("administratie")
        return rij

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
        try:
            administratie = administratie_van(conn, administratie_id)
            facturen = lees_facturen(conn, administratie_id)
        finally:
            conn.close()

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
        conn = verbinding()
        try:
            administratie_van(conn, administratie_id)
        finally:
            conn.close()
        return toon(request, "upload.html", administratie_id=administratie_id)

    @app.post("/administratie/{administratie_id}/upload")
    async def upload_ontvangen(
        request: Request, administratie_id: int, bestand: UploadFile
    ):
        inhoud = await bestand.read()
        conn = verbinding()
        try:
            administratie_van(conn, administratie_id)
            resultaat = verwerk_upload(
                conn, administratie_id, bestand.filename or "onbekend", inhoud,
                app.state.opslagmap,
                ai_client=app.state.ai_client, vandaag=app.state.vandaag,
            )
        finally:
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
        return RedirectResponse(
            f"/administratie/{administratie_id}/factuur/{resultaat.factuur_id}",
            status_code=303,
        )

    # --- reviewscherm ---------------------------------------------------

    @app.get(
        "/administratie/{administratie_id}/factuur/{factuur_id}",
        response_class=HTMLResponse,
    )
    def review(
        request: Request, administratie_id: int, factuur_id: int, melding: str = ""
    ):
        conn = verbinding()
        try:
            factuur = hoort_bij_administratie(
                conn, lees_factuur, factuur_id, administratie_id, "factuur"
            )
            extractie = lees_extractie_bij_document(conn, factuur["document_id"])
            # Het document gaat langs dezelfde eigenaarscontrole als de
            # factuur; ook voor het tonen ervan geldt dat een nummer in
            # de adresbalk niets van een andere administratie ontsluit.
            registratie = (
                hoort_bij_administratie(
                    conn, lees_document, factuur["document_id"],
                    administratie_id, "document",
                )
                if factuur["document_id"] else None
            )
        finally:
            conn.close()

        return toon(
            request, "review.html",
            administratie_id=administratie_id,
            factuur=factuur,
            velden=_veldregels(factuur, extractie),
            extractie=extractie,
            ubl=_ubl_weergave(registratie),
            melding=melding,
            mag_goedkeuren=(
                factuur["status"] == "gevalideerd"
                and factuur["goedgekeurd_op"] is None
            ),
        )

    @app.post("/administratie/{administratie_id}/factuur/{factuur_id}/opslaan")
    async def opslaan(request: Request, administratie_id: int, factuur_id: int):
        formulier = await request.form()
        wijzigingen = {
            veld: str(formulier[veld]).strip()
            for veld in FACTUUR_VELDEN
            if veld in formulier
        }
        conn = verbinding()
        try:
            hoort_bij_administratie(
                conn, lees_factuur, factuur_id, administratie_id, "factuur"
            )
            # Wijzigingen gaan altijd via wijzig_factuur: die bewaart de
            # oude waarde in de audit trail en hervalideert de factuur.
            wijzig_factuur(conn, factuur_id, wijzigingen, vandaag=app.state.vandaag)
        finally:
            conn.close()
        return RedirectResponse(
            f"/administratie/{administratie_id}/factuur/{factuur_id}"
            f"?melding=Opgeslagen",
            status_code=303,
        )

    @app.post("/administratie/{administratie_id}/factuur/{factuur_id}/goedkeuren")
    def goedkeuren(administratie_id: int, factuur_id: int):
        conn = verbinding()
        try:
            hoort_bij_administratie(
                conn, lees_factuur, factuur_id, administratie_id, "factuur"
            )
            gelukt, redenen = keur_factuur_goed(conn, factuur_id)
        finally:
            conn.close()

        if not gelukt:
            return RedirectResponse(
                f"/administratie/{administratie_id}/factuur/{factuur_id}"
                f"?melding={redenen[0]}",
                status_code=303,
            )
        return RedirectResponse(f"/administratie/{administratie_id}", status_code=303)

    # --- het originele document laten zien -------------------------------

    @app.get("/administratie/{administratie_id}/document/{document_id}")
    def document(administratie_id: int, document_id: int):
        conn = verbinding()
        try:
            registratie = hoort_bij_administratie(
                conn, lees_document, document_id, administratie_id, "document"
            )
        finally:
            conn.close()

        # Het pad komt uit de database, nooit uit het verzoek: een
        # bezoeker kan dus geen ander bestand van de schijf opvragen.
        pad = Path(registratie["opslagpad"])
        if not pad.is_file():
            raise NietGevonden("document")
        return FileResponse(
            pad,
            media_type=MEDIATYPEN.get(pad.suffix.lower(), "application/octet-stream"),
            filename=registratie["originele_bestandsnaam"],
            content_disposition_type="inline",
        )

    return app


def _ubl_weergave(registratie: Optional[dict]) -> Optional[Weergave]:
    """Maak de leesbare weergave als het bewaarde bestand een e-factuur is.

    Alleen voor XML: een PDF laat de browser zelf zien, en dat is precies
    wat je naast de velden wilt hebben. XML toonde de browser als ruwe
    tekst vol naamruimten, en daar valt niets mee te vergelijken.

    Het bewaarde bestand wordt alleen gelezen, nooit gewijzigd. De
    grootte wordt eerst op de schijf gecontroleerd, net als in module 4:
    een bestand van honderden megabytes hoort de reviewpagina niet op te
    houden.
    """
    if registratie is None:
        return None
    pad = Path(registratie["opslagpad"])
    if pad.suffix.lower() != ".xml" or not pad.is_file():
        return None

    reden = te_groot(pad.stat().st_size)
    if reden is not None:
        return Weergave(status="onleesbaar", reden=reden)
    try:
        return leesbare_ubl(pad.read_bytes())
    except OSError as fout:
        return Weergave(
            status="onleesbaar", reden=f"kon het bestand niet lezen: {fout}"
        )


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
