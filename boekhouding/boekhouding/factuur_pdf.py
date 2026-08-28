"""De PDF van een verkoopfactuur.

Dezelfde schrijver als het testmateriaal (`pdf_schrijver.py`), zodat er
maar één plek is waar de opmaak van een factuur wordt bepaald. Geen
externe bibliotheek, geen build-stap.

Wat hier gebeurt is alleen opmaak: elk bedrag komt uit `bereken_totalen`
en `bereken_regel`, en wordt hier niet opnieuw uitgerekend. Er staat dus
nooit iets anders op de PDF dan in de boeking.

De PDF is deterministisch: geen tijdstempel erin, dus twee keer
genereren geeft byte-voor-byte hetzelfde bestand. Dat is precies wat de
documentopslag nodig heeft, want die herkent een bestand aan zijn hash.
"""

from decimal import Decimal
from typing import Any, Optional

from .pdf_schrijver import Pagina, pdf_bytes

# Kantlijnen in punten, vanaf linksboven.
LINKS = 56
RECHTS = 539
BOVEN = 60

# Waar de kolommen van de regeltabel beginnen en eindigen.
KOLOM_AANTAL = 330
KOLOM_PRIJS = 400
KOLOM_BTW = 452
KOLOM_BEDRAG = RECHTS


def _euro(bedrag: Decimal) -> str:
    """Een bedrag zoals het op een Nederlandse factuur staat: 1.234,56."""
    teken = "-" if bedrag < 0 else ""
    heel, _, centen = f"{abs(bedrag):.2f}".partition(".")
    met_punten = ""
    for plek, cijfer in enumerate(reversed(heel)):
        if plek and plek % 3 == 0:
            met_punten = "." + met_punten
        met_punten = cijfer + met_punten
    return f"{teken}{met_punten},{centen}"


def _getal(waarde: Decimal) -> str:
    """Een aantal zonder overbodige nullen: 7,5 in plaats van 7,50."""
    tekst = str(waarde.normalize())
    if "E" in tekst or "e" in tekst:  # heel grote of kleine getallen
        tekst = f"{waarde:f}".rstrip("0").rstrip(".")
    return tekst.replace(".", ",")


def _adresregels(partij: dict[str, Any]) -> list[str]:
    regels = [str(partij.get("naam") or "")]
    if partij.get("adres"):
        regels.append(str(partij["adres"]))
    postcode_plaats = " ".join(
        str(partij.get(veld)) for veld in ("postcode", "plaats") if partij.get(veld)
    )
    if postcode_plaats:
        regels.append(postcode_plaats)
    if partij.get("land") and str(partij["land"]).lower() != "nederland":
        regels.append(str(partij["land"]))
    return regels


def maak_factuur_pdf(factuur: dict[str, Any]) -> bytes:
    """Maak de PDF van een definitieve verkoopfactuur.

    Verwacht het resultaat van `lees_verkoopfactuur`: met `klant`,
    `eigen`, `regels` en `totalen` erin.
    """
    eigen = factuur.get("eigen") or {}
    klant = factuur.get("klant") or {}
    totalen = factuur["totalen"]
    creditfactuur = factuur.get("soort") == "creditfactuur"

    pagina = Pagina()
    y = BOVEN

    # --- kop: wie stuurt de factuur --------------------------------------
    pagina.tekst(LINKS, y, str(eigen.get("naam") or ""), 15, vet=True)
    pagina.tekst_rechts(
        RECHTS, y, "CREDITFACTUUR" if creditfactuur else "FACTUUR", 15, vet=True
    )
    y += 20
    for regel in _adresregels(eigen)[1:]:
        pagina.tekst(LINKS, y, regel, 9)
        y += 12

    for label, veld in (
        ("KvK", "kvk_nummer"), ("Btw-id", "btw_id"), ("IBAN", "iban"),
        ("E-mail", "email"),
    ):
        if eigen.get(veld):
            pagina.tekst(LINKS, y, f"{label} {eigen[veld]}", 9)
            y += 12

    # --- aan wie, en de kerngegevens rechts ------------------------------
    y = max(y + 24, 150)
    pagina.tekst(LINKS, y, "Aan", 9, vet=True)
    kopregel = y
    y += 14
    for regel in _adresregels(klant):
        pagina.tekst(LINKS, y, regel, 10)
        y += 13
    if klant.get("btw_id"):
        pagina.tekst(LINKS, y, f"Btw-id {klant['btw_id']}", 9)
        y += 13

    rechts_y = kopregel
    for label, waarde in (
        ("Factuurnummer", factuur.get("factuurnummer") or "concept"),
        ("Factuurdatum", factuur.get("factuurdatum") or ""),
        ("Vervaldatum", factuur.get("vervaldatum") or ""),
    ):
        pagina.tekst(KOLOM_AANTAL, rechts_y, label, 9, vet=True)
        pagina.tekst_rechts(RECHTS, rechts_y, str(waarde), 9)
        rechts_y += 14
    if factuur.get("corrigeert_nummer"):
        pagina.tekst(KOLOM_AANTAL, rechts_y, "Crediteert", 9, vet=True)
        pagina.tekst_rechts(RECHTS, rechts_y, str(factuur["corrigeert_nummer"]), 9)
        rechts_y += 14

    # --- de regels -------------------------------------------------------
    y = max(y, rechts_y) + 26
    pagina.tekst(LINKS, y, "Omschrijving", 9, vet=True)
    pagina.tekst_rechts(KOLOM_AANTAL + 40, y, "Aantal", 9, vet=True)
    pagina.tekst_rechts(KOLOM_PRIJS + 40, y, "Prijs", 9, vet=True)
    pagina.tekst_rechts(KOLOM_BTW + 30, y, "Btw", 9, vet=True)
    pagina.tekst_rechts(KOLOM_BEDRAG, y, "Bedrag", 9, vet=True)
    y += 6
    pagina.lijn(LINKS, y, RECHTS, y)
    y += 16

    for regel in factuur["regels"]:
        pagina.tekst(LINKS, y, regel.omschrijving, 9)
        pagina.tekst_rechts(KOLOM_AANTAL + 40, y, _getal(regel.aantal), 9)
        pagina.tekst_rechts(KOLOM_PRIJS + 40, y, _euro(regel.prijs_per_stuk), 9)
        pagina.tekst_rechts(
            KOLOM_BTW + 30, y, f"{_getal(regel.btw_percentage)}%", 9
        )
        pagina.tekst_rechts(KOLOM_BEDRAG, y, _euro(regel.bedrag_excl), 9)
        y += 15

    y += 4
    pagina.lijn(KOLOM_AANTAL, y, RECHTS, y)
    y += 16

    # --- totalen ---------------------------------------------------------
    pagina.tekst(KOLOM_AANTAL, y, "Totaal excl. btw", 9)
    pagina.tekst_rechts(KOLOM_BEDRAG, y, _euro(totalen.bedrag_excl), 9)
    y += 14
    for tarief, (grondslag, btw) in sorted(totalen.per_tarief.items()):
        pagina.tekst(
            KOLOM_AANTAL, y, f"Btw {tarief}% over {_euro(grondslag)}", 9
        )
        pagina.tekst_rechts(KOLOM_BEDRAG, y, _euro(btw), 9)
        y += 14

    y += 2
    pagina.lijn(KOLOM_AANTAL, y, RECHTS, y)
    y += 16
    pagina.tekst(KOLOM_AANTAL, y, "Totaal incl. btw", 10, vet=True)
    pagina.tekst_rechts(KOLOM_BEDRAG, y, _euro(totalen.bedrag_incl), 10, vet=True)
    y += 30

    # --- betaalgegevens --------------------------------------------------
    if factuur.get("opmerking"):
        pagina.tekst(LINKS, y, str(factuur["opmerking"]), 9)
        y += 16

    if creditfactuur:
        pagina.tekst(
            LINKS, y,
            "Dit bedrag wordt met u verrekend of aan u terugbetaald.", 9,
        )
    else:
        termijn = factuur.get("betalingstermijn") or 30
        zin = f"Betaling binnen {termijn} dagen"
        if factuur.get("vervaldatum"):
            zin += f", uiterlijk {factuur['vervaldatum']}"
        if eigen.get("iban"):
            zin += f", op {eigen['iban']}"
        pagina.tekst(LINKS, y, zin + ".", 9)
        y += 14
        if factuur.get("factuurnummer"):
            pagina.tekst(
                LINKS, y,
                f"Vermeld bij de betaling het factuurnummer "
                f"{factuur['factuurnummer']}.", 9,
            )

    return pdf_bytes(pagina)
