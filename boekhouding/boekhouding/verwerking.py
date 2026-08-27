"""Een aangeleverd bestand van upload tot factuur in de database.

Dit is de lijm tussen de modules, niet een nieuwe module: er wordt hier
geen enkele boekhoudregel bijbedacht. De volgorde is steeds dezelfde:

    bewaren  →  routeren  →  uitlezen  →  valideren en opslaan

De webinterface roept alleen deze functie aan. Zo staat er nooit
boekhoudlogica in een route, en werkt dezelfde keten straks ook vanaf
de opdrachtregel of een e-mailpostbus.
"""

import tempfile
from datetime import date
from pathlib import Path
from typing import Any, Literal, Optional

from pydantic import BaseModel

from .ai_extractie import VELDEN, extraheer_factuur
from .database import bewaar_document, sla_extractie_op, sla_factuur_op
from .routering import bestandssoort, routeer_document
from .ubl import verwerk_efactuur

# Welke extensie hoort bij welke herkende inhoud. De bestandsnaam van de
# gebruiker doet er niet toe: de inhoud bepaalt hoe we het bewaren.
EXTENSIE_BIJ_SOORT = {
    "pdf": ".pdf",
    "jpg": ".jpg",
    "png": ".png",
    "xml": ".xml",
}


class UploadResultaat(BaseModel):
    """Wat er van een aangeleverd bestand terechtkwam."""

    status: Literal["gevalideerd", "review_nodig"]
    redenen: list[str] = []
    factuur_id: Optional[int] = None
    document_id: Optional[int] = None
    extractie_id: Optional[int] = None
    route: Optional[str] = None
    bestandsnaam: str = ""


def verwerk_upload(
    conn,
    administratie_id: int,
    bestandsnaam: str,
    inhoud: bytes,
    opslagmap: str | Path,
    *,
    ai_client: Any = None,
    vandaag: Optional[date] = None,
) -> UploadResultaat:
    """Neem een aangeleverd bestand aan en zet het om in een factuur.

    Geeft altijd een resultaat terug, nooit een exception: gaat er iets
    mis, dan is dat een reden bij een factuur die op review wacht.
    """
    if not inhoud:
        return UploadResultaat(
            status="review_nodig",
            redenen=["het aangeleverde bestand is leeg"],
            bestandsnaam=bestandsnaam,
        )

    soort = bestandssoort(inhoud[:1024])
    extensie = EXTENSIE_BIJ_SOORT.get(soort or "")
    if extensie is None:
        return UploadResultaat(
            status="review_nodig",
            redenen=[
                f"'{bestandsnaam}' is geen PDF, afbeelding of e-factuur; "
                f"dit bestand wordt niet als factuur verwerkt"
            ],
            bestandsnaam=bestandsnaam,
        )

    # Het bestand komt binnen als bytes en moet als bestand op schijf
    # staan voordat het bewaard en gerouteerd kan worden.
    with tempfile.TemporaryDirectory() as tijdelijke_map:
        tijdelijk = Path(tijdelijke_map) / f"aangeleverd{extensie}"
        tijdelijk.write_bytes(inhoud)
        return _verwerk_bestand(
            conn, administratie_id, tijdelijk, bestandsnaam, opslagmap,
            ai_client=ai_client, vandaag=vandaag,
        )


def _verwerk_bestand(
    conn, administratie_id, pad: Path, bestandsnaam: str, opslagmap,
    *, ai_client, vandaag,
) -> UploadResultaat:
    # 1. Bewaren (bewaarplicht) — dit gebeurt vóór het uitlezen, zodat
    #    het origineel er ook staat als het uitlezen mislukt.
    document = bewaar_document(conn, administratie_id, str(pad), str(opslagmap))
    if document.status == "review_nodig":
        return UploadResultaat(
            status="review_nodig",
            redenen=document.redenen,
            bestandsnaam=bestandsnaam,
        )

    # 2. Routeren op werkelijke inhoud.
    route, routefout = routeer_document(pad)
    if route is None:
        return UploadResultaat(
            status="review_nodig",
            redenen=[routefout or "onbekende bestandssoort"],
            document_id=document.document_id,
            bestandsnaam=bestandsnaam,
        )

    # 3. Uitlezen: e-factuur rechtstreeks, anders via het model.
    extractie_id = None
    if route == "ubl":
        gelezen = verwerk_efactuur(pad, vandaag=vandaag)
        velden, redenen = gelezen.velden, gelezen.redenen
    else:
        gelezen = extraheer_factuur(
            pad, client=ai_client, vandaag=vandaag
        )
        redenen = gelezen.redenen
        velden = {}
        if gelezen.extractie is not None:
            for veld in VELDEN:
                waarde = getattr(gelezen.extractie, veld).waarde
                if waarde is not None and str(waarde).strip():
                    velden[veld] = waarde
        # De extractie zelf gaat de audit trail in: welk model, welke
        # prompt, welke ruwe respons.
        extractie_id = sla_extractie_op(
            conn, administratie_id, gelezen, document_id=document.document_id
        )

    # 4. Valideren en opslaan — altijd via sla_factuur_op, ook als er al
    #    redenen zijn. De factuur moet zichtbaar worden in de lijst.
    factuur_id, resultaat = sla_factuur_op(
        conn, administratie_id, velden,
        vandaag=vandaag,
        document_id=document.document_id,
        extra_redenen=tuple(redenen),
    )

    return UploadResultaat(
        status=resultaat.status,
        redenen=resultaat.redenen,
        factuur_id=factuur_id,
        document_id=document.document_id,
        extractie_id=extractie_id,
        route=route,
        bestandsnaam=bestandsnaam,
    )
