"""Banktransacties koppelen aan facturen — regelwerk, geen interpretatie.

Geen AI. Er wordt gezocht op wat er letterlijk staat: een factuurnummer
in de omschrijving, een bedrag dat exact klopt, een naam die op de
leverancier lijkt. Meer niet.

De volgorde is met opzet streng naar los:

1. **Exact** — het factuurnummer of betalingskenmerk staat in de
   omschrijving én het bedrag klopt tot op de cent. Hoge zekerheid.
2. **Waarschijnlijk** — het bedrag klopt exact en de tegenpartij lijkt op
   de leverancier, maar er staat geen nummer bij. Lage zekerheid.
3. **Handmatig** — het lijkt een deelbetaling of een verzamelbetaling.
   Dan wordt er niets voorgesteld, alleen uitgelegd wat er aan de hand
   lijkt.
4. **Geen** — niets gevonden; de transactie blijft open staan.

Een voorstel is nooit definitief. Het staat op het scherm met de
zekerheid erbij en de eigenaar bevestigt of koppelt zelf iets anders
(Gouden regel 1). Pas bij die bevestiging ontstaat er een boeking.
"""

import re
from decimal import Decimal, InvalidOperation
from difflib import SequenceMatcher
from typing import Any, Literal, Optional

from pydantic import BaseModel

from .grootboek import Boekingsregel, BoekingVoorstel, controleer_balans
from .rekeningschema import Rekeningschema, rekeningschema_voor_jaar

NUL = Decimal("0.00")

# Een factuurnummer korter dan dit zoeken we niet op in een omschrijving.
# "7" komt in bijna elke tekst voor; dan koppel je de verkeerde factuur.
MINIMALE_NUMMERLENGTE = 4

# Hoe sterk twee namen op elkaar moeten lijken voordat we ze hetzelfde
# noemen. Alleen gebruikt voor een voorstel met LAGE zekerheid.
NAAMGRENS = 0.75

# Wat erbij komt te staan als niet vast te stellen is of een factuur
# inkoop of verkoop is.
RICHTING_ONBEKEND = (
    "de richting van deze factuur is niet bekend, controleer of dit een "
    "inkoop of verkoop is"
)

# Woorden die niets zeggen over wie een bedrijf is. Ze worden weggelaten
# voordat twee namen worden vergeleken.
RECHTSVORMEN = {
    "bv", "b", "v", "nv", "n", "vof", "cv", "holding", "beheer",
    "eenmanszaak", "the", "de", "het", "een", "van", "der", "den",
}


class Voorstel(BaseModel):
    """Wat het afletteren van deze transactie oplevert."""

    soort: Literal["exact", "waarschijnlijk", "handmatig", "geen"]
    zekerheid: Optional[Literal["hoog", "laag"]] = None
    factuur_id: Optional[int] = None
    # "factuur" (ontvangen) of "verkoopfactuur" (zelf verstuurd); het
    # koppelen weet daarmee in welke tabel het moet kijken.
    bron: str = "factuur"
    factuurnummer: Optional[str] = None
    leverancier: Optional[str] = None
    uitleg: str = ""
    kandidaten: list[int] = []


def _decimal(waarde: Any) -> Optional[Decimal]:
    if waarde is None or waarde == "":
        return None
    try:
        return Decimal(str(waarde))
    except InvalidOperation:
        return None


def _plat(tekst: Optional[str]) -> str:
    """Alleen letters en cijfers, in hoofdletters.

    Zo maakt het niet uit of er 'EF-2026-0101', 'EF 2026 0101' of
    'ef20260101' in de omschrijving staat.
    """
    return re.sub(r"[^A-Z0-9]", "", (tekst or "").upper())


def _woorden(naam: Optional[str]) -> list[str]:
    stukken = re.split(r"[^a-z0-9]+", (naam or "").lower())
    return [s for s in stukken if s and s not in RECHTSVORMEN]


def namen_lijken_op_elkaar(links: Optional[str], rechts: Optional[str]) -> bool:
    """Lijkt de naam op het afschrift op die van de leverancier?

    Eerst worden rechtsvormen en leestekens weggelaten ('KPN B.V.' wordt
    'kpn'). Daarna telt een naam als gelijk wanneer alle woorden van de
    kortste naam in de andere voorkomen, of wanneer de namen als geheel
    genoeg op elkaar lijken. Dat laatste vangt tikfouten en afkortingen
    op zoals 'Bakkerij Korenaar' tegenover 'Bakkerij de Korenaar'.
    """
    a, b = _woorden(links), _woorden(rechts)
    if not a or not b:
        return False

    kort, lang = (a, b) if len(a) <= len(b) else (b, a)
    if all(woord in lang for woord in kort):
        return True
    return SequenceMatcher(None, " ".join(a), " ".join(b)).ratio() >= NAAMGRENS


def _genoemd(tekst: str, factuur: dict[str, Any]) -> bool:
    """Staat het factuurnummer van deze factuur in de tekst?"""
    nummer = _plat(factuur.get("factuurnummer"))
    if len(nummer) < MINIMALE_NUMMERLENGTE:
        return False
    return nummer in tekst


def verwacht_negatief(factuur: dict[str, Any]) -> Optional[bool]:
    """Hoort er bij deze factuur geld af of geld bij te komen?

    Bij een inkoopfactuur betaal je: geld eraf. Bij een verkoopfactuur
    ontvang je: geld erbij. Bij een creditnota is het precies andersom,
    en dat is aan het teken van het factuurbedrag te zien.

    None betekent: niet vast te stellen.
    """
    richting = factuur.get("richting")
    if richting not in ("inkoop", "verkoop"):
        return None
    bedrag = _decimal(factuur.get("bedrag_incl"))
    negatieve_factuur = bedrag is not None and bedrag < NUL
    if richting == "inkoop":
        return not negatieve_factuur
    return negatieve_factuur


def past_de_richting(
    bedrag: Decimal, factuur: dict[str, Any]
) -> Literal["past", "past_niet", "onbekend"]:
    """Past deze transactie qua richting bij deze factuur?

    Geld eraf hoort bij een inkoopfactuur, geld erbij bij een verkoop —
    en bij een creditnota andersom. De richting komt uit de boeking die
    bij de factuur hoort, niet uit een gok: staat er crediteuren in, dan
    is het een inkoopfactuur.

    Drie uitkomsten, en "onbekend" is er met opzet een aparte van. Is er
    geen boeking of geen rekeningschema voor dat jaar, dan wéten we het
    niet — en dan mag dat niet stilzwijgend als "past" doorgaan. De
    factuur blijft wel een kandidaat (misschien klopt het), maar het
    voorstel dat eruit komt krijgt nooit hoge zekerheid.
    """
    negatief = verwacht_negatief(factuur)
    if negatief is None:
        return "onbekend"
    return "past" if (bedrag < NUL) == negatief else "past_niet"


def _bij_twijfel_verlagen(
    voorstel: Voorstel, factuur: dict[str, Any], bedrag: Decimal
) -> Voorstel:
    """Zet een voorstel op lage zekerheid als de richting onbekend is.

    Het bedrag en het nummer kunnen kloppen terwijl we niet weten of dit
    een inkoop- of een verkoopfactuur is. Dan is het voorstel bruikbaar,
    maar "hoge zekerheid" zou het meer zeggen dan we kunnen waarmaken
    (Gouden regel 4).
    """
    if past_de_richting(bedrag, factuur) != "onbekend":
        return voorstel
    return voorstel.model_copy(update={
        "zekerheid": "laag",
        "uitleg": f"{voorstel.uitleg}. Let op: {RICHTING_ONBEKEND}",
    })


def zoek_voorstel(
    transactie: dict[str, Any], facturen: list[dict[str, Any]]
) -> Voorstel:
    """Zoek de factuur bij een banktransactie.

    `facturen` zijn de openstaande facturen: geboekt, nog niet betaald.
    Elke factuur is een dict met minstens id, factuurnummer, leverancier,
    bedrag_incl en richting ('inkoop' of 'verkoop').
    """
    bedrag = _decimal(transactie.get("bedrag"))
    if bedrag is None:
        return Voorstel(
            soort="geen", uitleg="deze transactie heeft geen leesbaar bedrag"
        )

    tekst = _plat(
        f"{transactie.get('omschrijving') or ''} "
        f"{transactie.get('betalingskenmerk') or ''}"
    )
    tegenpartij = transactie.get("tegenpartij")
    open_bedrag = abs(bedrag)

    # Een factuur waarvan de richting niet past valt af. Een factuur
    # waarvan de richting onbekend is blijft meedoen — maar wat daaruit
    # komt, wordt hieronder nooit "hoge zekerheid".
    passend = [
        f for f in facturen if past_de_richting(bedrag, f) != "past_niet"
    ]
    genoemd = [f for f in passend if _genoemd(tekst, f)]

    # --- 1. het factuurnummer staat er letterlijk in --------------------
    if len(genoemd) > 1:
        totaal = sum(
            (abs(_decimal(f.get("bedrag_incl")) or NUL) for f in genoemd), NUL
        )
        klopt = " en samen zijn ze precies dit bedrag" if totaal == open_bedrag else ""
        nummers = ", ".join(str(f.get("factuurnummer")) for f in genoemd)
        return Voorstel(
            soort="handmatig",
            kandidaten=[f["id"] for f in genoemd],
            uitleg=(
                f"er staan meerdere factuurnummers in de omschrijving "
                f"({nummers}){klopt}. Een verzamelbetaling wordt niet "
                f"automatisch gekoppeld — koppel de facturen met de hand"
            ),
        )

    if len(genoemd) == 1:
        factuur = genoemd[0]
        factuurbedrag = abs(_decimal(factuur.get("bedrag_incl")) or NUL)
        gedeeld = {
            "factuur_id": factuur["id"],
            "bron": factuur.get("bron") or "factuur",
            "factuurnummer": factuur.get("factuurnummer"),
            "leverancier": factuur.get("leverancier"),
        }
        if factuurbedrag == open_bedrag:
            return _bij_twijfel_verlagen(
                Voorstel(
                    soort="exact", zekerheid="hoog", **gedeeld,
                    uitleg=(
                        f"het factuurnummer staat in de omschrijving en het "
                        f"bedrag klopt tot op de cent"
                    ),
                ),
                factuur, bedrag,
            )
        if open_bedrag < factuurbedrag:
            return Voorstel(
                soort="handmatig", kandidaten=[factuur["id"]], **gedeeld,
                uitleg=(
                    f"dit lijkt een deelbetaling: er is {open_bedrag} betaald "
                    f"op een factuur van {factuurbedrag}. Termijnen worden niet "
                    f"automatisch gekoppeld — bevestig het met de hand"
                ),
            )
        return Voorstel(
            soort="handmatig", kandidaten=[factuur["id"]], **gedeeld,
            uitleg=(
                f"het bedrag ({open_bedrag}) is hoger dan de factuur "
                f"({factuurbedrag}). Mogelijk zijn er meer facturen mee betaald "
                f"— koppel het met de hand"
            ),
        )

    # --- 2. het bedrag klopt exact -------------------------------------
    zelfde_bedrag = [
        f for f in passend
        if abs(_decimal(f.get("bedrag_incl")) or NUL) == open_bedrag
    ]
    gelijkende_naam = [
        f for f in zelfde_bedrag
        if namen_lijken_op_elkaar(tegenpartij, f.get("leverancier"))
    ]

    if len(gelijkende_naam) == 1:
        factuur = gelijkende_naam[0]
        return _bij_twijfel_verlagen(
            Voorstel(
                soort="waarschijnlijk", zekerheid="laag",
                factuur_id=factuur["id"],
                bron=factuur.get("bron") or "factuur",
                factuurnummer=factuur.get("factuurnummer"),
                leverancier=factuur.get("leverancier"),
                uitleg=(
                    f"het bedrag klopt exact en '{tegenpartij}' lijkt op "
                    f"'{factuur.get('leverancier')}', maar er staat geen "
                    f"factuurnummer bij. Controleer of dit de juiste factuur is"
                ),
            ),
            factuur, bedrag,
        )

    if len(gelijkende_naam) > 1:
        return Voorstel(
            soort="handmatig",
            kandidaten=[f["id"] for f in gelijkende_naam],
            uitleg=(
                f"er staan {len(gelijkende_naam)} facturen open met precies dit "
                f"bedrag van dezelfde leverancier; welke het is valt niet uit het "
                f"afschrift op te maken"
            ),
        )

    # --- 3. lijkt dit een verzamelbetaling? -----------------------------
    van_deze_partij = [
        f for f in passend
        if namen_lijken_op_elkaar(tegenpartij, f.get("leverancier"))
    ]
    if len(van_deze_partij) > 1:
        totaal = sum(
            (abs(_decimal(f.get("bedrag_incl")) or NUL) for f in van_deze_partij),
            NUL,
        )
        if totaal == open_bedrag:
            return Voorstel(
                soort="handmatig",
                kandidaten=[f["id"] for f in van_deze_partij],
                uitleg=(
                    f"dit bedrag is precies het totaal van {len(van_deze_partij)} "
                    f"openstaande facturen van '{tegenpartij}'. Een "
                    f"verzamelbetaling wordt niet automatisch gekoppeld — koppel "
                    f"ze met de hand"
                ),
            )

    if zelfde_bedrag:
        namen = ", ".join(
            str(f.get("leverancier")) for f in zelfde_bedrag[:3]
        )
        return Voorstel(
            soort="geen",
            kandidaten=[f["id"] for f in zelfde_bedrag],
            uitleg=(
                f"het bedrag klopt bij {namen}, maar '{tegenpartij}' lijkt daar "
                f"niet op en er staat geen factuurnummer bij. Er wordt niets "
                f"voorgesteld; koppel het zelf als het toch klopt"
            ),
        )

    return Voorstel(
        soort="geen",
        uitleg="geen openstaande factuur gevonden met dit bedrag of nummer",
    )


def stel_betaling_samen(
    transactie: dict[str, Any],
    factuur: dict[str, Any],
    schema: Optional[Rekeningschema] = None,
) -> BoekingVoorstel:
    """Maak de boeking bij een bevestigde koppeling.

    Bij een betaalde inkoopfactuur verdwijnt de schuld aan de leverancier
    en gaat er geld van de bank af:

        crediteuren   debet
        bank                    credit

    Bij een ontvangen verkoopfactuur precies andersom. Welke van de twee
    het is, komt uit de boeking van de factuur zelf — niet uit een gok.
    """
    def weiger(*redenen: str) -> BoekingVoorstel:
        return BoekingVoorstel(status="geweigerd", redenen=list(redenen))

    from datetime import date

    bedrag = _decimal(transactie.get("bedrag"))
    if bedrag is None or bedrag == NUL:
        return weiger("deze transactie heeft geen bruikbaar bedrag")

    boekdatum = transactie.get("boekdatum")
    if isinstance(boekdatum, str):
        try:
            boekdatum = date.fromisoformat(boekdatum)
        except ValueError:
            return weiger(f"'{boekdatum}' is geen geldige boekdatum")
    if boekdatum is None:
        return weiger("deze transactie heeft geen boekdatum")

    richting = factuur.get("richting")
    negatief = verwacht_negatief(factuur)
    if negatief is None:
        return weiger(
            "van deze factuur is niet bekend of het inkoop of verkoop is; "
            "boek de factuur eerst"
        )
    if (bedrag < NUL) != negatief:
        return weiger(
            f"de richting klopt niet: dit is een "
            f"{'afschrijving' if bedrag < NUL else 'bijschrijving'} terwijl bij "
            f"deze {richting}factuur geld "
            f"{'eraf' if negatief else 'erbij'} hoort te komen"
        )

    if schema is None:
        schema = rekeningschema_voor_jaar(boekdatum.year)
    if schema is None:
        return weiger(
            f"er is geen rekeningschema voor boekjaar {boekdatum.year}"
        )

    bank = schema.standaard("bank")
    tegenover = schema.standaard(
        "crediteuren" if richting == "inkoop" else "debiteuren"
    )
    if bank is None or schema.zoek(bank) is None:
        return weiger(
            f"er staat geen bankrekening in het schema van {schema.jaar}; "
            f"vul 'bank' aan bij de standaardrekeningen"
        )

    som = abs(bedrag)
    if richting == "inkoop":
        regels = [
            Boekingsregel(
                rekening=tegenover, omschrijving=schema.zoek(tegenover).omschrijving,
                debet=som,
            ),
            Boekingsregel(
                rekening=bank, omschrijving=schema.zoek(bank).omschrijving,
                credit=som,
            ),
        ]
    else:
        regels = [
            Boekingsregel(
                rekening=bank, omschrijving=schema.zoek(bank).omschrijving,
                debet=som,
            ),
            Boekingsregel(
                rekening=tegenover, omschrijving=schema.zoek(tegenover).omschrijving,
                credit=som,
            ),
        ]

    redenen = controleer_balans(regels)
    if redenen:
        return weiger(*redenen)

    nummer = factuur.get("factuurnummer") or f"factuur {factuur.get('id')}"
    return BoekingVoorstel(
        status="gemaakt",
        regels=regels,
        boekdatum=boekdatum,
        omschrijving=(
            f"{'Betaling' if richting == 'inkoop' else 'Ontvangst'} {nummer}"
        ),
    )
