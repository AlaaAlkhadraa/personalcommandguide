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
