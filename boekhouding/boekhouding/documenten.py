"""PDF-tekstextractie en veilige bewaring van originele bestanden.

Nog ZONDER AI: deze module haalt alleen de ruwe tekstlaag uit een PDF
en zet het originele bestand veilig weg. Module 3 (AI-extractie) bouwt
daar later bovenop.

Gouden regels die hier gelden:
- Geen tekstlaag, een kapot bestand of een ontbrekend bestand levert
  status "review_nodig" met reden op — nooit een exception die het
  verwerken van een stapel facturen afbreekt (regel 4).
- Bewaarplicht: het origineel wordt gekopieerd, nooit overschreven en
  nooit verwijderd. De bestandsnaam is de sha256-hash van de inhoud,
  zodat hetzelfde bestand niet twee keer op schijf komt.
"""

import hashlib
import os
import shutil
import tempfile
from pathlib import Path
from typing import Literal, Optional

from pydantic import BaseModel

# Blokgrootte voor het hashen; zo past ook een PDF van 100 MB in het
# geheugen zonder problemen.
BLOK = 1024 * 1024

# Bestandssoorten die we bewaren. Een factuur komt binnen als PDF, als
# foto/scan, of als e-factuur in XML; een bankafschrift als MT940 (.sta,
# .mt940 of gewoon .txt) of als CAMT.053 (.xml). Iets anders wordt niet
# gegokt maar ter review gelegd.
TOEGESTANE_EXTENSIES = (
    ".pdf", ".jpg", ".jpeg", ".png", ".xml", ".sta", ".mt940", ".txt",
)


class TekstResultaat(BaseModel):
    """Uitkomst van lees_pdf_tekst.

    status "gelezen"      → er is bruikbare tekst gevonden
    status "review_nodig" → geen tekst, of het bestand was niet te
                            lezen; de reden staat in redenen
    """

    status: Literal["gelezen", "review_nodig"]
    redenen: list[str] = []
    tekst: str = ""
    aantal_paginas: int = 0
    bestandsnaam: str


def lees_pdf_tekst(pad: str | Path) -> TekstResultaat:
    """Haal de tekstlaag uit een factuur-PDF.

    Geeft altijd een resultaat terug, nooit een exception: een scan
    zonder tekstlaag, een kapotte PDF of een ontbrekend bestand wordt
    "review_nodig" met een reden in gewone taal.
    """
    pad = Path(pad)

    if not pad.is_file():
        return TekstResultaat(
            status="review_nodig",
            redenen=[f"bestand niet gevonden: {pad}"],
            bestandsnaam=pad.name,
        )

    try:
        from pypdf import PdfReader

        lezer = PdfReader(str(pad))
        paginas = [(p.extract_text() or "") for p in lezer.pages]
    except Exception as fout:  # pypdf gooit uiteenlopende fouttypes
        return TekstResultaat(
            status="review_nodig",
            redenen=[f"kon de PDF niet lezen: {type(fout).__name__}: {fout}"],
            bestandsnaam=pad.name,
        )

    tekst = "\n".join(paginas).strip()
    if not tekst:
        return TekstResultaat(
            status="review_nodig",
            redenen=["geen tekstlaag gevonden, mogelijk een scan"],
            aantal_paginas=len(paginas),
            bestandsnaam=pad.name,
        )

    return TekstResultaat(
        status="gelezen",
        tekst=tekst,
        aantal_paginas=len(paginas),
        bestandsnaam=pad.name,
    )


def bereken_hash(pad: str | Path) -> str:
    """Bereken de sha256-hash van de bestandsinhoud (hex, 64 tekens).

    Twee keer hetzelfde bestand geeft dezelfde hash, ook als de
    bestandsnaam verschilt. Daarop rust de duplicaatherkenning.
    """
    hasher = hashlib.sha256()
    with open(pad, "rb") as bestand:
        for blok in iter(lambda: bestand.read(BLOK), b""):
            hasher.update(blok)
    return hasher.hexdigest()


def extensie_van(bron: str | Path) -> str | None:
    """Geef de gecontroleerde extensie van een bronbestand, of None.

    De extensie wordt kleingeschreven en getoetst aan een witte lijst.
    Staat hij daar niet op (of ontbreekt hij), dan geeft deze functie
    None terug: de aanroeper legt het document dan ter review en gokt
    nooit een bestandssoort (Gouden regel 4).
    """
    extensie = Path(bron).suffix.lower()
    return extensie if extensie in TOEGESTANE_EXTENSIES else None


def opslagpad_voor(
    hash_waarde: str, opslagmap: str | Path, extensie: str
) -> Path:
    """Bepaal waar een document met deze hash hoort te staan.

    De eerste twee tekens van de hash worden een submap, zodat één map
    niet volloopt met honderdduizenden bestanden. De extensie komt van
    het bronbestand: een factuur kan ook als foto worden aangeleverd,
    en dan moet het bewaarde bestand nog steeds te openen zijn.
    """
    if extensie not in TOEGESTANE_EXTENSIES:
        raise ValueError(
            f"extensie '{extensie}' staat niet op de witte lijst: "
            f"{', '.join(TOEGESTANE_EXTENSIES)}"
        )
    return Path(opslagmap) / hash_waarde[:2] / f"{hash_waarde}{extensie}"


def kopieer_naar_opslag(
    bron: str | Path, hash_waarde: str, opslagmap: str | Path, extensie: str
) -> tuple[Path, bool]:
    """Kopieer het origineel naar de opslagmap; geef (pad, is_nieuw).

    Bestaat het doelbestand al, dan wordt er niets overschreven: de
    inhoud is per definitie identiek, want de naam ís de hash van de
    inhoud. Het opgeslagen bestand wordt alleen-lezen gemaakt, zodat
    per ongeluk overschrijven ook technisch wordt tegengehouden
    (bewaarplicht: 7 jaar bewaren, nooit overschrijven).
    """
    doel = opslagpad_voor(hash_waarde, opslagmap, extensie)
    if doel.exists():
        return doel, False

    doel.parent.mkdir(parents=True, exist_ok=True)
    # Eerst naar een tijdelijk bestand in dezelfde map, dan hernoemen:
    # zo staat er nooit een half gekopieerd bestand op de definitieve
    # plek. os.replace is atomair binnen hetzelfde filesystem.
    #
    # De tijdelijke naam komt van tempfile.mkstemp en is dus uniek per
    # aanroep. Met een vaste naam (<hash>.tmp) zouden twee gelijktijdige
    # aanroepen voor hetzelfde bestand elkaars tijdelijke bestand
    # overschrijven, en zou de een het bestand van de ander kunnen
    # hernoemen terwijl die er nog in schrijft.
    beschrijving, tijdelijk = tempfile.mkstemp(
        dir=doel.parent, prefix=f"{hash_waarde}-", suffix=".tmp"
    )
    os.close(beschrijving)
    try:
        shutil.copyfile(bron, tijdelijk)
        os.replace(tijdelijk, doel)
    finally:
        # Na een geslaagde os.replace bestaat het tijdelijke bestand
        # niet meer; ging er iets mis, dan ruimen we het hier op.
        if os.path.exists(tijdelijk):
            os.unlink(tijdelijk)
    os.chmod(doel, 0o444)
    return doel, True


class DocumentResultaat(BaseModel):
    """Uitkomst van het opslaan van een origineel document."""

    status: Literal["opgeslagen", "bestond_al", "review_nodig"]
    redenen: list[str] = []
    document_id: Optional[int] = None
    hash: Optional[str] = None
    opslagpad: Optional[str] = None
