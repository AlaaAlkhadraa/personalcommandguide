"""Pydantic-schema's voor facturen.

Gouden regels die hier gelden:
- Bedragen altijd als Decimal, nooit float (regel 5). Floats worden
  geweigerd vóór conversie, omdat 0.1 + 0.2 als float niet 0.3 is.
- Toegestane btw-percentages komen uit het config-bestand van het
  boekjaar, nooit hardcoded (nu: 21, 9, 0).
"""

from datetime import date
from decimal import Decimal, InvalidOperation
from typing import Any, Literal, Optional

from pydantic import BaseModel, ConfigDict, field_validator, model_validator

from .btw_config import btw_percentages_voor_jaar

GELD_VELDEN = {"bedrag_excl", "btw_bedrag", "bedrag_incl", "btw_percentage"}


class Factuur(BaseModel):
    """Eén inkoop- of verkoopfactuur zoals uitgelezen uit een document."""

    model_config = ConfigDict(extra="forbid")

    leverancier: str
    factuurdatum: date
    factuurnummer: str
    bedrag_excl: Decimal
    btw_percentage: Decimal
    btw_bedrag: Decimal
    bedrag_incl: Decimal

    @field_validator("leverancier", "factuurnummer")
    @classmethod
    def niet_leeg(cls, waarde: str) -> str:
        waarde = waarde.strip()
        if not waarde:
            raise ValueError("mag niet leeg zijn")
        return waarde

    @field_validator(*GELD_VELDEN, mode="before")
    @classmethod
    def geen_float(cls, waarde: Any) -> Any:
        if isinstance(waarde, float):
            raise ValueError(
                "float is niet toegestaan voor geldvelden; "
                "lever het bedrag aan als tekst of Decimal (Gouden regel 5)"
            )
        if isinstance(waarde, str):
            waarde = waarde.strip().replace(",", ".")
            try:
                return Decimal(waarde)
            except InvalidOperation:
                raise ValueError(f"'{waarde}' is geen geldig bedrag")
        return waarde

    @model_validator(mode="after")
    def btw_percentage_toegestaan(self) -> "Factuur":
        toegestaan = btw_percentages_voor_jaar(self.factuurdatum.year)
        if toegestaan is None:
            raise ValueError(
                f"geen btw-configuratie voor boekjaar {self.factuurdatum.year}"
            )
        if self.btw_percentage not in toegestaan:
            mooi = ", ".join(str(p) for p in sorted(toegestaan, reverse=True))
            raise ValueError(
                f"btw_percentage {self.btw_percentage} is niet toegestaan "
                f"in {self.factuurdatum.year}; toegestaan: {mooi}"
            )
        return self


class ValidatieResultaat(BaseModel):
    """Uitkomst van valideer_factuur.

    Er wordt nooit een exception naar buiten gegooid en er gaat nooit
    data verloren: bij elke fout is de status "review_nodig", staan de
    redenen erbij, en blijft de originele input bewaard.
    """

    status: Literal["gevalideerd", "review_nodig"]
    redenen: list[str] = []
    factuur: Optional[Factuur] = None
    originele_data: dict[str, Any]
