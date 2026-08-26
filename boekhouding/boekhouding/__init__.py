"""Boekhoudsysteem voor Nederlandse zzp'ers — Module 1: factuur-schema,
validatie en audit trail.

AI stelt voor, code valideert, mens beslist (Gouden regel 1).
"""

from .models import Factuur, ValidatieResultaat
from .validatie import valideer_factuur
from .database import (
    maak_verbinding,
    maak_tabellen,
    maak_administratie,
    sla_factuur_op,
    wijzig_factuur,
    lees_factuur,
    lees_audit_trail,
)

__all__ = [
    "Factuur",
    "ValidatieResultaat",
    "valideer_factuur",
    "maak_verbinding",
    "maak_tabellen",
    "maak_administratie",
    "sla_factuur_op",
    "wijzig_factuur",
    "lees_factuur",
    "lees_audit_trail",
]
