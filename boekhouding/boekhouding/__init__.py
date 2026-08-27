"""Boekhoudsysteem voor Nederlandse zzp'ers.

Module 1: factuur-schema, validatie en audit trail.
Module 2: PDF-tekstextractie en veilige bewaring van originelen.
Module 3: AI-extractie van factuurgegevens (voorstel, geen boeking).
Module 4: UBL / e-facturen rechtstreeks uitlezen (zonder AI).

AI stelt voor, code valideert, mens beslist (Gouden regel 1).
"""

from .models import Factuur, ValidatieResultaat
from .validatie import valideer_factuur
from .documenten import (
    TOEGESTANE_EXTENSIES,
    DocumentResultaat,
    TekstResultaat,
    bereken_hash,
    extensie_van,
    lees_pdf_tekst,
    opslagpad_voor,
)
from .ai_extractie import (
    PROMPT_VERSIE,
    STANDAARD_MODEL,
    ExtractieResultaat,
    FactuurExtractie,
    VeldExtractie,
    beoordeel_extractie,
    bepaal_invoerpad,
    extraheer_factuur,
    foutreden,
    standaard_model,
)
from .ubl import (
    MAX_XML_BYTES,
    EfactuurResultaat,
    UblResultaat,
    XmlOnveilig,
    beoordeel_ubl,
    is_ubl,
    lees_ubl,
    lees_ubl_bytes,
    lees_xml_veilig,
    te_groot,
    verwerk_efactuur,
)
from .routering import bestandssoort, routeer_document, zoek_ingebedde_efactuur
from .omgeving import api_sleutel, sleutel_aanwezig
from .database import (
    maak_verbinding,
    maak_tabellen,
    maak_administratie,
    sla_factuur_op,
    wijzig_factuur,
    lees_factuur,
    lees_audit_trail,
    bewaar_document,
    lees_document,
    sla_extractie_op,
    lees_extractie,
)

__all__ = [
    "Factuur",
    "ValidatieResultaat",
    "valideer_factuur",
    "TOEGESTANE_EXTENSIES",
    "DocumentResultaat",
    "TekstResultaat",
    "bereken_hash",
    "extensie_van",
    "lees_pdf_tekst",
    "opslagpad_voor",
    "maak_verbinding",
    "maak_tabellen",
    "maak_administratie",
    "sla_factuur_op",
    "wijzig_factuur",
    "lees_factuur",
    "lees_audit_trail",
    "bewaar_document",
    "lees_document",
    "sla_extractie_op",
    "lees_extractie",
    "ExtractieResultaat",
    "FactuurExtractie",
    "VeldExtractie",
    "beoordeel_extractie",
    "bepaal_invoerpad",
    "extraheer_factuur",
    "foutreden",
    "standaard_model",
    "PROMPT_VERSIE",
    "STANDAARD_MODEL",
    "EfactuurResultaat",
    "UblResultaat",
    "XmlOnveilig",
    "beoordeel_ubl",
    "is_ubl",
    "lees_ubl",
    "lees_ubl_bytes",
    "lees_xml_veilig",
    "te_groot",
    "verwerk_efactuur",
    "MAX_XML_BYTES",
    "bestandssoort",
    "routeer_document",
    "zoek_ingebedde_efactuur",
    "api_sleutel",
    "sleutel_aanwezig",
]
