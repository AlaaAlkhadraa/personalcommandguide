"""Pydantic-schema's voor facturen.

Gouden regels die hier gelden:
- Bedragen altijd als Decimal, nooit float (regel 5). Floats worden
  geweigerd vóór conversie, omdat 0.1 + 0.2 als float niet 0.3 is.
- Toegestane btw-percentages komen uit het config-bestand van het
  boekjaar, nooit hardcoded (nu: 21, 9, 0).
"""

import re
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
            origineel = waarde.strip()
            waarde = origineel
            # Nederlandse notatie: punt én komma → punt is
            # duizendtalscheiding ("1.250,00"); alleen komma →
            # decimaalteken ("100,00"); alleen punt → decimaalteken.
            # Uitzondering (Gouden regel 4): alléén een punt gevolgd
            # door precies 3 cijfers ("1.250") kan zowel een Nederlands
            # duizendtal (1250) als een Engels decimaal (1,250) zijn —
            # dan nooit gokken, maar review.
            if "." in waarde and "," in waarde:
                waarde = waarde.replace(".", "").replace(",", ".")
            elif re.fullmatch(r"\d{1,3}\.\d{3}", waarde):
                raise ValueError(
                    f"ambigu bedrag '{origineel}': kan "
                    f"{waarde.replace('.', '')},00 of "
                    f"{waarde.replace('.', ',')} zijn — "
                    f"controleer het origineel"
                )
            else:
                waarde = waarde.replace(",", ".")
            try:
                return Decimal(waarde)
            except InvalidOperation:
                raise ValueError(f"'{origineel}' is geen geldig bedrag")
        return waarde

    @field_validator("factuurdatum", mode="before")
    @classmethod
    def nederlandse_datum(cls, waarde: Any) -> Any:
        """Accepteer JJJJ-MM-DD, en DD-MM-JJJJ alleen als die eenduidig is.

        Op een Nederlandse factuur staat "12-07-2026". De AI-module vraagt
        het model om JJJJ-MM-DD terug te geven, maar als er tóch de
        geschreven vorm binnenkomt moet dat geen onleesbare foutmelding
        opleveren.

        Is het eerste getal groter dan 12, dan kan het alleen een dag zijn
        en is de datum eenduidig. Is het 12 of lager, dan kan "03-04-2026"
        zowel 3 april als 4 maart zijn — dan wordt er niet gegokt maar
        volgt review (Gouden regel 4), met een reden die beide lezingen
        noemt.
        """
        if not isinstance(waarde, str):
            return waarde
        tekst = waarde.strip()
        gevonden = re.fullmatch(r"(\d{1,2})-(\d{1,2})-(\d{4})", tekst)
        if gevonden is None:
            return tekst
        eerste, tweede, jaar = (int(g) for g in gevonden.groups())
        if eerste > 12:
            return f"{jaar:04d}-{tweede:02d}-{eerste:02d}"
        raise ValueError(
            f"ambigue datum '{tekst}': kan {eerste} van maand {tweede} of "
            f"{tweede} van maand {eerste} zijn — noteer hem als "
            f"{jaar:04d}-{tweede:02d}-{eerste:02d} als het de Nederlandse "
            f"schrijfwijze is"
        )

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
