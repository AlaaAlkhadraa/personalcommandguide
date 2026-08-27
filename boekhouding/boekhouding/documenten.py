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
from pathlib import Path
from typing import Literal, Optional

from pydantic import BaseModel

# Blokgrootte voor het hashen; zo past ook een PDF van 100 MB in het
# geheugen zonder problemen.
BLOK = 1024 * 1024


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


def opslagpad_voor(hash_waarde: str, opslagmap: str | Path) -> Path:
    """Bepaal waar een document met deze hash hoort te staan.

    De eerste twee tekens van de hash worden een submap, zodat één map
    niet volloopt met honderdduizenden bestanden.
    """
    return Path(opslagmap) / hash_waarde[:2] / f"{hash_waarde}.pdf"


def kopieer_naar_opslag(
    bron: str | Path, hash_waarde: str, opslagmap: str | Path
) -> tuple[Path, bool]:
    """Kopieer het origineel naar de opslagmap; geef (pad, is_nieuw).

    Bestaat het doelbestand al, dan wordt er niets overschreven: de
    inhoud is per definitie identiek, want de naam ís de hash van de
    inhoud. Het opgeslagen bestand wordt alleen-lezen gemaakt, zodat
    per ongeluk overschrijven ook technisch wordt tegengehouden
    (bewaarplicht: 7 jaar bewaren, nooit overschrijven).
    """
    doel = opslagpad_voor(hash_waarde, opslagmap)
    if doel.exists():
        return doel, False

    doel.parent.mkdir(parents=True, exist_ok=True)
    # Eerst naar een tijdelijke naam in dezelfde map, dan hernoemen:
    # zo staat er nooit een half gekopieerd bestand op de definitieve
    # plek. os.replace is atomair binnen hetzelfde filesystem.
    tijdelijk = doel.with_suffix(".tmp")
    shutil.copyfile(bron, tijdelijk)
    os.replace(tijdelijk, doel)
    os.chmod(doel, 0o444)
    return doel, True


def verwijder_tijdelijk_bestand(pad: str | Path) -> None:
    """Ruim een half gekopieerd tijdelijk bestand op na een fout.

    Alleen bedoeld voor `.tmp`-bestanden van kopieer_naar_opslag;
    opgeslagen originelen worden nooit verwijderd.
    """
    pad = Path(pad)
    if pad.suffix == ".tmp" and pad.is_file():
        pad.unlink()


class DocumentResultaat(BaseModel):
    """Uitkomst van het opslaan van een origineel document."""

    status: Literal["opgeslagen", "bestond_al", "review_nodig"]
    redenen: list[str] = []
    document_id: Optional[int] = None
    hash: Optional[str] = None
    opslagpad: Optional[str] = None
