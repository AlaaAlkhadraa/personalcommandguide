"""De routes van de webinterface.

Elke route doet drie dingen en niet meer: gegevens ophalen, een functie
uit de boekhoudmodules aanroepen, en het resultaat aan een sjabloon
geven. Er wordt hier niet gerekend, niet gevalideerd en niets bepaald
over btw — dat zit allemaal in de modules eronder.
"""

import contextvars
import re
import sqlite3
from datetime import date
from decimal import Decimal
from pathlib import Path
from typing import Any, Optional

from fastapi import Depends, FastAPI, HTTPException, Request, UploadFile
from fastapi.responses import FileResponse, HTMLResponse, RedirectResponse
from fastapi.templating import Jinja2Templates

from ..afletteren import zoek_voorstel
from ..ai_extractie import VELDEN
from ..btw_aangifte import bereken_aangifte, kwartaal_van
from ..database import (
    FACTUUR_VELDEN,
    boek_factuur,
    boeking_bij_factuur,
    importeer_bankafschrift,
    keur_factuur_goed,
    kies_rekening,
    controleer_verkoopfactuur,
    koppel_transactie,
    lees_administratie,
    lees_banktransactie,
    lees_banktransacties,
    lees_klant,
    lees_klanten,
    lees_verkoopfactuur,
    lees_verkoopfacturen,
    maak_creditfactuur,
    maak_definitief,
    maak_klant,
    maak_verkoopfactuur,
    open_facturen,
    openstaande_posten,
    verwijder_verkoopfactuur,
    wijzig_administratie,
    wijzig_klant,
    wijzig_verkoopfactuur,
    zet_verkoopregels,
    lees_document,
    lees_extractie_bij_document,
    lees_facturen,
    lees_factuur,
    maak_administratie,
    maak_tabellen,
    maak_verbinding,
    wijzig_factuur,
)
from ..database import EIGEN_GEGEVENS, KLANT_VELDEN
from ..database import (
    lees_sessie,
    probeer_inloggen,
    trek_sessie_in,
    zet_gebruiker,
)
from ..gebruikers import (
    CODE_BIJ_REDEN,
    MELDINGEN,
    STANDAARDMELDING,
    csrf_token,
    gelijk,
)
from ..rekeningschema import rekeningschema_voor_jaar
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


# Wie er via dit verzoek werkt. Een contextvariabele hoort bij precies
# één verzoek, dus elke databaseverbinding die daarbinnen wordt geopend
# krijgt automatisch de juiste naam in de audit trail — zonder dat er
# door twintig functies een parameter heen hoeft.
HUIDIGE_GEBRUIKER: contextvars.ContextVar[Optional[str]] = contextvars.ContextVar(
    "huidige_gebruiker", default=None
)

# Paden waar je zonder inloggen bij mag. Meer dan dit is er niet: er is
# geen registratiepagina en geen "wachtwoord vergeten" — de eigenaar maakt
# de accounts aan.
OPEN_PADEN = ("/inloggen",)

# Wat alleen de eigenaar mag. Een klant levert aan en kijkt mee; hij keurt
# niets goed, maakt niets definitief en doet geen aangifte. De controle
# staat hier, op één plek, en niet in de routes zelf.
#
# Het zijn stukjes van het pad, geen hele paden: zo valt ook
# /administratie/1/btw/2026/3 en /administratie/1/bank/7/koppel eronder,
# zonder dat elke variant apart moet worden opgeschreven.
ALLEEN_EIGENAAR = frozenset({
    "goedkeuren",    # een factuur goedkeuren
    "definitief",    # een verkoopfactuur definitief maken
    "crediteren",    # een definitieve factuur crediteren
    "koppel",        # een banktransactie koppelen: dat is een boeking
    "bank",          # bankafschriften inlezen en afletteren
    "btw",           # de btw-aangifte
})

# Eén uitzondering die niet met een stukje pad te vangen is: het
# reviewformulier van een inkoopfactuur opslaan hoort bij de eigenaar,
# terwijl "opslaan" bij een verkoopfactuur juist iets is wat de klant mag
# (hij mag een concept opstellen).
ALLEEN_EIGENAAR_PADEN = (
    re.compile(r"^/administratie/\d+/factuur/\d+/opslaan$"),
)

ADMINISTRATIE_IN_PAD = re.compile(r"^/administratie/(\d+)(?:/|$)")

COOKIE = "sessie"
COOKIE_CSRF = "aanmeldteken"


def veilig_terug(pad: Optional[str]) -> str:
    """Waar mag je na het inloggen heen? Alleen naar een pagina hier.

    `terug` komt uit het adres en gaat na het inloggen in een redirect.
    Zou daar een heel ander adres in mogen staan, dan is een link naar
    /inloggen?terug=https://nep.example genoeg om iemand na een geslaagde
    login op een nagemaakte site te laten belanden. Dus: het moet met één
    schuine streep beginnen (een pad hier), en niet met twee (dat is een
    adres op een andere site).
    """
    if not pad or not pad.startswith("/") or pad.startswith("//"):
        return "/"
    return pad


class NaarInloggen(HTTPException):
    """Niet ingelogd: stuur de bezoeker naar het inlogscherm."""

    def __init__(self, terug: str = "/"):
        super().__init__(
            status_code=303, headers={"Location": f"/inloggen?terug={terug}"}
        )


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
    async def bewaak(request: Request) -> None:
        """De enige toegangscontrole. Elke route loopt hierlangs.

        Vier dingen, in deze volgorde:

        1. **Ben je ingelogd?** Zo niet, dan naar het inlogscherm. Er is
           geen pagina die zonder sessie iets van de administratie laat
           zien.
        2. **Klopt het formulier?** Bij elk POST-verzoek moet het
           csrf-teken van deze sessie meekomen. Zonder dat teken kan een
           andere website jouw browser niet namens jou iets laten
           versturen.
        3. **Mag je bij deze administratie?** De eigenaar mag overal bij,
           een klant alleen bij de zijne. Zo niet: 404, nooit 403 — een
           403 zou verklappen dat de administratie bestaat.
        4. **Mag je dit doen?** Goedkeuren, definitief maken, crediteren
           en koppelen zijn van de eigenaar. Ook hier 404.

        Dat het hier staat en niet in de routes is het hele punt: een
        nieuwe route kan de controle niet vergeten.
        """
        pad = request.url.path
        if pad in OPEN_PADEN:
            if request.method == "POST":
                formulier = await request.form()
                if not gelijk(
                    str(formulier.get("csrf") or ""),
                    request.cookies.get(COOKIE_CSRF),
                ):
                    raise NaarInloggen("/")
            return

        conn = maak_verbinding(app.state.db_pad)
        try:
            sessie = lees_sessie(conn, request.cookies.get(COOKIE))
        finally:
            conn.close()
        if sessie is None:
            raise NaarInloggen(pad)

        gebruiker = sessie["gebruiker"]
        request.state.gebruiker = gebruiker
        request.state.csrf = sessie["csrf_token"]
        HUIDIGE_GEBRUIKER.set(gebruiker.email)

        if request.method == "POST":
            formulier = await request.form()
            if not gelijk(str(formulier.get("csrf") or ""), sessie["csrf_token"]):
                raise NietGevonden("formulier")

        treffer = ADMINISTRATIE_IN_PAD.match(pad)
        if treffer and not gebruiker.mag_bij(int(treffer.group(1))):
            raise NietGevonden("administratie")

        if not gebruiker.is_eigenaar() and (
            ALLEEN_EIGENAAR & set(pad.split("/"))
            or any(patroon.match(pad) for patroon in ALLEEN_EIGENAAR_PADEN)
        ):
            raise NietGevonden("handeling")

    app = FastAPI(title="Boekhouding — review", dependencies=[Depends(bewaak)])
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
        conn = maak_verbinding(app.state.db_pad)
        # Wie er werkt staat in de contextvariabele van dit verzoek; elke
        # audit-regel die zo meteen wordt geschreven krijgt die naam.
        zet_gebruiker(conn, HUIDIGE_GEBRUIKER.get())
        return conn

    def toon(request: Request, sjabloon: str, **gegevens) -> HTMLResponse:
        # Elk sjabloon krijgt het csrf-teken en wie er is ingelogd, zodat
        # een formulier het niet kan vergeten en een scherm knoppen kan
        # verbergen die deze gebruiker toch niet mag.
        gegevens.setdefault("csrf", getattr(request.state, "csrf", ""))
        wie = getattr(request.state, "gebruiker", None)
        gegevens.setdefault("gebruiker", wie)
        # Knoppen die deze gebruiker toch niet mag, worden niet getoond.
        # Dat is beleefdheid, geen beveiliging: de echte controle staat in
        # bewaak() en geeft 404, ook als iemand het adres zelf intikt.
        gegevens.setdefault("eigenaar", bool(wie) and wie.is_eigenaar())
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

    # --- inloggen en uitloggen -------------------------------------------

    @app.get("/inloggen", response_class=HTMLResponse)
    def inlogscherm(request: Request, terug: str = "/", fout: str = ""):
        # In het adres staat alleen een code; het sjabloon zoekt de zin er
        # zelf bij in MELDINGEN. Wat hier binnenkomt wordt dus nooit
        # getoond, hoe het er ook uitziet.
        teken = csrf_token()
        antwoord = toon(
            request, "inloggen.html", csrf=teken, terug=veilig_terug(terug),
            fout=fout, meldingen=MELDINGEN, standaardmelding=STANDAARDMELDING,
            gebruiker=None,
        )
        antwoord.set_cookie(
            COOKIE_CSRF, teken, httponly=True, samesite="lax", max_age=900
        )
        return antwoord

    @app.post("/inloggen")
    async def inloggen(request: Request):
        formulier = await request.form()
        terug = str(formulier.get("terug") or "/")
        conn = maak_verbinding(app.state.db_pad)
        try:
            token, redenen = probeer_inloggen(
                conn,
                str(formulier.get("email") or ""),
                str(formulier.get("wachtwoord") or ""),
                request.client.host if request.client else None,
            )
        finally:
            conn.close()

        if token is None:
            code = CODE_BIJ_REDEN.get(redenen[0], STANDAARDMELDING)
            return RedirectResponse(f"/inloggen?fout={code}", status_code=303)

        antwoord = RedirectResponse(veilig_terug(terug), status_code=303)
        # httponly: javascript komt er niet bij. samesite=lax: een andere
        # site krijgt de cookie niet mee bij een POST. secure hoort erbij
        # zodra dit achter https draait; lokaal op http zou de cookie dan
        # nooit worden gezet.
        antwoord.set_cookie(
            COOKIE, token, httponly=True, samesite="lax", path="/"
        )
        antwoord.delete_cookie(COOKIE_CSRF)
        return antwoord

    @app.post("/uitloggen")
    def uitloggen(request: Request):
        token = request.cookies.get(COOKIE)
        if token:
            conn = verbinding()
            try:
                trek_sessie_in(conn, token)
            finally:
                conn.close()
        antwoord = RedirectResponse("/inloggen?fout=uitgelogd", status_code=303)
        antwoord.delete_cookie(COOKIE, path="/")
        return antwoord

    # --- overzicht ------------------------------------------------------

    @app.get("/", response_class=HTMLResponse)
    def start_pagina(request: Request):
        gebruiker = request.state.gebruiker
        conn = verbinding()
        try:
            rijen = [
                rij[0] for rij in
                conn.execute("SELECT id FROM administraties ORDER BY id")
            ]
        finally:
            conn.close()
        toegestaan = [nummer for nummer in rijen if gebruiker.mag_bij(nummer)]
        if not toegestaan:
            raise NietGevonden("administratie")
        return RedirectResponse(
            f"/administratie/{toegestaan[0]}", status_code=303
        )

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
            boeking = boeking_bij_factuur(conn, factuur_id)
        finally:
            conn.close()

        return toon(
            request, "review.html",
            administratie_id=administratie_id,
            factuur=factuur,
            velden=_veldregels(factuur, extractie),
            extractie=extractie,
            ubl=_ubl_weergave(registratie),
            rekeningen=_kiesbare_rekeningen(factuur),
            boeking=boeking,
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
            # De grootboekrekening staat los van de factuurvelden: die
            # wordt niet uit het document gelezen maar door de eigenaar
            # gekozen, en gaat langs het rekeningschema van dat jaar.
            melding = "Opgeslagen"
            if "rekening" in formulier:
                gelukt, redenen = kies_rekening(
                    conn, factuur_id, str(formulier["rekening"])
                )
                if not gelukt:
                    melding = redenen[0]
        finally:
            conn.close()
        return RedirectResponse(
            f"/administratie/{administratie_id}/factuur/{factuur_id}"
            f"?melding={melding}",
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

        # Goedgekeurd, dus mag hij het grootboek in. Lukt dat niet — meestal
        # omdat er nog geen rekening is gekozen — dan blijft de factuur
        # goedgekeurd maar ongeboekt, en zegt het scherm waarom. Stil laten
        # verdwijnen mag niet: bij de btw-aangifte zou het bedrag dan
        # ontbreken zonder dat iemand het ziet.
        conn = verbinding()
        try:
            boeking_id, boekredenen = boek_factuur(conn, factuur_id)
        finally:
            conn.close()
        if boeking_id is None:
            return RedirectResponse(
                f"/administratie/{administratie_id}/factuur/{factuur_id}"
                f"?melding=Goedgekeurd, maar nog niet geboekt: {boekredenen[0]}",
                status_code=303,
            )
        return RedirectResponse(f"/administratie/{administratie_id}", status_code=303)

    # --- btw-aangifte per kwartaal ---------------------------------------

    @app.get("/administratie/{administratie_id}/btw", response_class=HTMLResponse)
    def btw_nu(administratie_id: int):
        """Ga naar het kwartaal waar we nu in zitten."""
        vandaag = app.state.vandaag or date.today()
        return RedirectResponse(
            f"/administratie/{administratie_id}/btw/{vandaag.year}/"
            f"{kwartaal_van(vandaag)}",
            status_code=303,
        )

    @app.get(
        "/administratie/{administratie_id}/btw/{jaar}/{kwartaal}",
        response_class=HTMLResponse,
    )
    def btw_kwartaal(
        request: Request, administratie_id: int, jaar: int, kwartaal: int
    ):
        if kwartaal not in (1, 2, 3, 4) or not (2000 <= jaar <= 2100):
            raise NietGevonden("kwartaal")

        conn = verbinding()
        try:
            administratie = administratie_van(conn, administratie_id)
            aangifte = bereken_aangifte(conn, administratie_id, jaar, kwartaal)
        finally:
            conn.close()

        vorig = (jaar - 1, 4) if kwartaal == 1 else (jaar, kwartaal - 1)
        volgend = (jaar + 1, 1) if kwartaal == 4 else (jaar, kwartaal + 1)
        return toon(
            request, "btw.html",
            administratie_id=administratie_id,
            administratie_naam=administratie[1],
            aangifte=aangifte,
            vorig=vorig,
            volgend=volgend,
        )

    # --- eigen gegevens, klanten en verkoopfacturen -----------------------

    @app.get(
        "/administratie/{administratie_id}/instellingen",
        response_class=HTMLResponse,
    )
    def instellingen(request: Request, administratie_id: int, melding: str = ""):
        conn = verbinding()
        try:
            administratie_van(conn, administratie_id)
            eigen = lees_administratie(conn, administratie_id)
        finally:
            conn.close()
        return toon(
            request, "instellingen.html",
            administratie_id=administratie_id, eigen=eigen, melding=melding,
            velden=("naam",) + EIGEN_GEGEVENS,
        )

    @app.post("/administratie/{administratie_id}/instellingen")
    async def instellingen_opslaan(request: Request, administratie_id: int):
        formulier = await request.form()
        gegevens = {
            veld: str(formulier[veld]).strip()
            for veld in ("naam",) + EIGEN_GEGEVENS
            if veld in formulier
        }
        conn = verbinding()
        try:
            administratie_van(conn, administratie_id)
            wijzig_administratie(conn, administratie_id, gegevens)
        finally:
            conn.close()
        return RedirectResponse(
            f"/administratie/{administratie_id}/instellingen?melding=Opgeslagen",
            status_code=303,
        )

    @app.get("/administratie/{administratie_id}/klanten", response_class=HTMLResponse)
    def klanten(request: Request, administratie_id: int, melding: str = ""):
        conn = verbinding()
        try:
            administratie_van(conn, administratie_id)
            lijst = lees_klanten(conn, administratie_id)
        finally:
            conn.close()
        return toon(
            request, "klanten.html",
            administratie_id=administratie_id, klanten=lijst,
            velden=KLANT_VELDEN, melding=melding,
        )

    @app.post("/administratie/{administratie_id}/klanten")
    async def klant_toevoegen(request: Request, administratie_id: int):
        formulier = await request.form()
        gegevens = {
            veld: str(formulier.get(veld) or "").strip() for veld in KLANT_VELDEN
        }
        if not gegevens["naam"]:
            return RedirectResponse(
                f"/administratie/{administratie_id}/klanten"
                f"?melding=Een klant zonder naam kan niet",
                status_code=303,
            )
        conn = verbinding()
        try:
            administratie_van(conn, administratie_id)
            maak_klant(conn, administratie_id, gegevens)
        finally:
            conn.close()
        return RedirectResponse(
            f"/administratie/{administratie_id}/klanten?melding=Klant toegevoegd",
            status_code=303,
        )

    @app.post("/administratie/{administratie_id}/klant/{klant_id}")
    async def klant_opslaan(request: Request, administratie_id: int, klant_id: int):
        formulier = await request.form()
        gegevens = {
            veld: str(formulier[veld]).strip()
            for veld in KLANT_VELDEN if veld in formulier
        }
        conn = verbinding()
        try:
            hoort_bij_administratie(
                conn, lees_klant, klant_id, administratie_id, "klant"
            )
            wijzig_klant(conn, klant_id, gegevens)
        finally:
            conn.close()
        return RedirectResponse(
            f"/administratie/{administratie_id}/klanten?melding=Klant bijgewerkt",
            status_code=303,
        )

    @app.get("/administratie/{administratie_id}/verkoop", response_class=HTMLResponse)
    def verkoop(request: Request, administratie_id: int, melding: str = ""):
        conn = verbinding()
        try:
            administratie = administratie_van(conn, administratie_id)
            facturen = lees_verkoopfacturen(conn, administratie_id)
            klanten_lijst = lees_klanten(conn, administratie_id)
            posten = openstaande_posten(
                conn, administratie_id, app.state.vandaag
            )
        finally:
            conn.close()
        return toon(
            request, "verkoop.html",
            administratie_id=administratie_id,
            administratie_naam=administratie[1],
            facturen=facturen, klanten=klanten_lijst, melding=melding,
            posten=posten,
            openstaand=sum((p["bedrag_incl"] for p in posten), Decimal("0.00")),
            te_laat=sum(1 for p in posten if p["te_laat"]),
            vandaag=str(app.state.vandaag or date.today()),
            aantal_concept=sum(1 for f in facturen if f["status"] == "concept"),
        )

    @app.post("/administratie/{administratie_id}/verkoop")
    async def verkoop_nieuw(request: Request, administratie_id: int):
        formulier = await request.form()
        klant = str(formulier.get("klant_id") or "").strip()
        if not klant.isdigit():
            return RedirectResponse(
                f"/administratie/{administratie_id}/verkoop"
                f"?melding=Kies eerst een klant",
                status_code=303,
            )
        conn = verbinding()
        try:
            hoort_bij_administratie(
                conn, lees_klant, int(klant), administratie_id, "klant"
            )
            factuur_id = maak_verkoopfactuur(
                conn, administratie_id, int(klant),
                str(formulier.get("factuurdatum") or "").strip() or None,
            )
        finally:
            conn.close()
        return RedirectResponse(
            f"/administratie/{administratie_id}/verkoop/{factuur_id}",
            status_code=303,
        )

    @app.get(
        "/administratie/{administratie_id}/verkoop/{verkoopfactuur_id}",
        response_class=HTMLResponse,
    )
    def verkoopfactuur(
        request: Request, administratie_id: int, verkoopfactuur_id: int,
        melding: str = "",
    ):
        conn = verbinding()
        try:
            factuur = hoort_bij_administratie(
                conn, lees_verkoopfactuur, verkoopfactuur_id, administratie_id,
                "verkoopfactuur",
            )
            klanten_lijst = lees_klanten(conn, administratie_id)
            ontbreekt = (
                controleer_verkoopfactuur(conn, verkoopfactuur_id)
                if factuur["status"] == "concept" else []
            )
        finally:
            conn.close()
        return toon(
            request, "verkoopfactuur.html",
            administratie_id=administratie_id, factuur=factuur,
            klanten=klanten_lijst, ontbreekt=ontbreekt, melding=melding,
            # Drie lege regels erbij, zodat er altijd iets bij kan zonder
            # dat er javascript aan te pas komt.
            lege_regels=range(3),
        )

    @app.post("/administratie/{administratie_id}/verkoop/{verkoopfactuur_id}/opslaan")
    async def verkoopfactuur_opslaan(
        request: Request, administratie_id: int, verkoopfactuur_id: int
    ):
        formulier = await request.form()
        conn = verbinding()
        try:
            hoort_bij_administratie(
                conn, lees_verkoopfactuur, verkoopfactuur_id, administratie_id,
                "verkoopfactuur",
            )
            kop = {
                veld: str(formulier[veld]).strip()
                for veld in ("factuurdatum", "betalingstermijn", "opmerking")
                if veld in formulier
            }
            gelukt, redenen = wijzig_verkoopfactuur(conn, verkoopfactuur_id, kop)
            if gelukt:
                gelukt, redenen = zet_verkoopregels(
                    conn, verkoopfactuur_id, _regels_uit_formulier(formulier)
                )
        finally:
            conn.close()
        melding = "Opgeslagen" if gelukt else redenen[0]
        return RedirectResponse(
            f"/administratie/{administratie_id}/verkoop/{verkoopfactuur_id}"
            f"?melding={melding}",
            status_code=303,
        )

    @app.post(
        "/administratie/{administratie_id}/verkoop/{verkoopfactuur_id}/definitief"
    )
    def verkoopfactuur_definitief(
        administratie_id: int, verkoopfactuur_id: int
    ):
        conn = verbinding()
        try:
            hoort_bij_administratie(
                conn, lees_verkoopfactuur, verkoopfactuur_id, administratie_id,
                "verkoopfactuur",
            )
            nummer, redenen = maak_definitief(
                conn, verkoopfactuur_id, opslagmap=app.state.opslagmap
            )
        finally:
            conn.close()
        if nummer is None:
            return RedirectResponse(
                f"/administratie/{administratie_id}/verkoop/{verkoopfactuur_id}"
                f"?melding={redenen[0]}",
                status_code=303,
            )
        return RedirectResponse(
            f"/administratie/{administratie_id}/verkoop/{verkoopfactuur_id}"
            f"?melding=Factuur {nummer} is definitief en geboekt",
            status_code=303,
        )

    @app.post(
        "/administratie/{administratie_id}/verkoop/{verkoopfactuur_id}/verwijderen"
    )
    def verkoopfactuur_verwijderen(administratie_id: int, verkoopfactuur_id: int):
        conn = verbinding()
        try:
            hoort_bij_administratie(
                conn, lees_verkoopfactuur, verkoopfactuur_id, administratie_id,
                "verkoopfactuur",
            )
            gelukt, redenen = verwijder_verkoopfactuur(conn, verkoopfactuur_id)
        finally:
            conn.close()
        if not gelukt:
            return RedirectResponse(
                f"/administratie/{administratie_id}/verkoop/{verkoopfactuur_id}"
                f"?melding={redenen[0]}",
                status_code=303,
            )
        return RedirectResponse(
            f"/administratie/{administratie_id}/verkoop?melding=Concept weggegooid",
            status_code=303,
        )

    @app.post(
        "/administratie/{administratie_id}/verkoop/{verkoopfactuur_id}/crediteren"
    )
    def verkoopfactuur_crediteren(administratie_id: int, verkoopfactuur_id: int):
        conn = verbinding()
        try:
            hoort_bij_administratie(
                conn, lees_verkoopfactuur, verkoopfactuur_id, administratie_id,
                "verkoopfactuur",
            )
            nieuw_id, redenen = maak_creditfactuur(conn, verkoopfactuur_id)
        finally:
            conn.close()
        if nieuw_id is None:
            return RedirectResponse(
                f"/administratie/{administratie_id}/verkoop/{verkoopfactuur_id}"
                f"?melding={redenen[0]}",
                status_code=303,
            )
        return RedirectResponse(
            f"/administratie/{administratie_id}/verkoop/{nieuw_id}"
            f"?melding=Creditfactuur klaargezet; controleer hem en maak hem definitief",
            status_code=303,
        )

    # --- bankafschriften en afletteren -----------------------------------

    @app.get("/administratie/{administratie_id}/bank", response_class=HTMLResponse)
    def bank(request: Request, administratie_id: int, melding: str = ""):
        conn = verbinding()
        try:
            administratie = administratie_van(conn, administratie_id)
            transacties = lees_banktransacties(conn, administratie_id)
            facturen = open_facturen(conn, administratie_id)
        finally:
            conn.close()

        # Het voorstel wordt hier uitgerekend en niet bewaard: het is een
        # voorstel, geen besluit. Verandert er iets aan de facturen, dan
        # klopt het voorstel de volgende keer vanzelf weer.
        regels = []
        for transactie in transacties:
            # Alleen facturen die qua richting kunnen: geld eraf hoort bij
            # een inkoopfactuur, geld erbij bij een verkoopfactuur. Ze toch
            # in de lijst zetten zou de eigenaar een keuze laten maken die
            # daarna alsnog wordt geweigerd.
            eraf = str(transactie["bedrag"]).startswith("-")
            koppelbaar = [
                factuur for factuur in facturen
                if factuur["richting"] == ("inkoop" if eraf else "verkoop")
            ]
            regels.append({
                "transactie": transactie,
                "koppelbaar": koppelbaar,
                "voorstel": (
                    zoek_voorstel(transactie, facturen)
                    if transactie["status"] == "open" else None
                ),
            })

        return toon(
            request, "bank.html",
            administratie_id=administratie_id,
            administratie_naam=administratie[1],
            regels=regels,
            facturen=facturen,
            melding=melding,
            aantal_open=sum(1 for t in transacties if t["status"] == "open"),
            aantal_voorstel=sum(
                1 for r in regels
                if r["voorstel"] is not None
                and r["voorstel"].soort in ("exact", "waarschijnlijk")
            ),
        )

    @app.post("/administratie/{administratie_id}/bank")
    async def bank_import(request: Request, administratie_id: int, bestand: UploadFile):
        inhoud = await bestand.read()
        conn = verbinding()
        try:
            administratie_van(conn, administratie_id)
            samenvatting = importeer_bankafschrift(
                conn, administratie_id, bestand.filename or "afschrift",
                inhoud, app.state.opslagmap,
            )
        finally:
            conn.close()

        if samenvatting["status"] != "gelezen":
            return toon(
                request, "fout.html",
                titel="Dit afschrift is niet ingelezen",
                bericht=" ".join(samenvatting["redenen"]),
                terug=f"/administratie/{administratie_id}/bank",
            )
        melding = (
            f"{samenvatting['nieuw']} nieuwe transacties ingelezen"
            + (f", {samenvatting['al_bekend']} stonden er al"
               if samenvatting["al_bekend"] else "")
        )
        if samenvatting["redenen"]:
            melding += ". " + " ".join(samenvatting["redenen"])
        return RedirectResponse(
            f"/administratie/{administratie_id}/bank?melding={melding}",
            status_code=303,
        )

    @app.post("/administratie/{administratie_id}/bank/{transactie_id}/koppel")
    async def bank_koppel(
        request: Request, administratie_id: int, transactie_id: int
    ):
        formulier = await request.form()
        # De keuzelijst stuurt "soort:nummer", want één select kan maar
        # één waarde versturen en we moeten weten of het een ontvangen of
        # een eigen factuur is.
        bron, _, gekozen = str(formulier.get("factuur_id") or "").strip().rpartition(":")
        bron = bron or "factuur"
        if not gekozen.isdigit() or bron not in ("factuur", "verkoopfactuur"):
            return RedirectResponse(
                f"/administratie/{administratie_id}/bank"
                f"?melding=Kies eerst een factuur om aan te koppelen",
                status_code=303,
            )

        conn = verbinding()
        try:
            hoort_bij_administratie(
                conn, lees_banktransactie, transactie_id, administratie_id,
                "banktransactie",
            )
            # Ook de factuur uit het formulier gaat langs de controle: een
            # nummer in een verborgen veld is net zo goed te veranderen als
            # een nummer in de adresbalk.
            hoort_bij_administratie(
                conn,
                lees_factuur if bron == "factuur" else lees_verkoopfactuur,
                int(gekozen), administratie_id, bron,
            )
            boeking_id, redenen = koppel_transactie(
                conn, transactie_id, int(gekozen), bron=bron
            )
        finally:
            conn.close()

        melding = (
            f"Gekoppeld en geboekt (boeking {boeking_id})"
            if boeking_id is not None else redenen[0]
        )
        return RedirectResponse(
            f"/administratie/{administratie_id}/bank?melding={melding}",
            status_code=303,
        )

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


def _regels_uit_formulier(formulier) -> list[dict[str, str]]:
    """Haal de factuurregels uit het formulier.

    Het formulier stuurt vier lijstjes van gelijke lengte (omschrijving,
    aantal, prijs, btw). Een regel waarin niets is ingevuld wordt
    overgeslagen, zodat de lege regels onderaan het scherm geen lege
    regels op de factuur worden.
    """
    omschrijvingen = formulier.getlist("omschrijving")
    aantallen = formulier.getlist("aantal")
    prijzen = formulier.getlist("prijs_per_stuk")
    percentages = formulier.getlist("btw_percentage")

    regels = []
    for nummer in range(len(omschrijvingen)):
        gegeven = {
            "omschrijving": str(omschrijvingen[nummer]).strip(),
            "aantal": str(aantallen[nummer] if nummer < len(aantallen) else "").strip(),
            "prijs_per_stuk": str(
                prijzen[nummer] if nummer < len(prijzen) else ""
            ).strip(),
            "btw_percentage": str(
                percentages[nummer] if nummer < len(percentages) else ""
            ).strip(),
        }
        if any(gegeven[veld] for veld in ("omschrijving", "aantal", "prijs_per_stuk")):
            regels.append(gegeven)
    return regels


def _kiesbare_rekeningen(factuur: dict) -> list[dict]:
    """De rekeningen die bij deze factuur gekozen mogen worden.

    Welk schema geldt, hangt af van het boekjaar van de factuur. Is er
    geen datum of geen schema voor dat jaar, dan is de lijst leeg en
    toont het scherm dat — er wordt geen schema van een ander jaar
    gebruikt.
    """
    if not factuur.get("factuurdatum"):
        return []
    try:
        jaar = date.fromisoformat(str(factuur["factuurdatum"])).year
    except ValueError:
        return []
    schema = rekeningschema_voor_jaar(jaar)
    if schema is None:
        return []
    return [
        {
            "code": rekening.code,
            "omschrijving": rekening.omschrijving,
            "soort": rekening.soort,
        }
        for rekening in sorted(schema.kiesbaar(), key=lambda r: (r.soort, r.code))
    ]


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
