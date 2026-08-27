"""Bepalen wat voor document er binnenkomt, op inhoud en niet op naam.

Een bestand dat `factuur.pdf` heet hoeft geen PDF te zijn, en een PDF
kan een complete e-factuur als bijlage bevatten. Daarom wordt hier naar
de werkelijke inhoud gekeken: de eerste bytes van het bestand, en bij
XML naar het hoofdelement.

De vier uitkomsten:
  "ubl"    een e-factuur; de velden staan er letterlijk in
  "tekst"  een PDF met tekstlaag; die tekst kan naar het model
  "beeld"  een foto of een gescande PDF; het beeld moet naar het model
  None     onbekend — review_nodig met reden, nooit gokken

De volgorde is bewust: staat er een e-factuur in, dan is dat altijd de
beste bron. Een PDF met Factur-X- of ZUGFeRD-bijlage gaat dus langs het
UBL-pad en niet langs de tekstlaag, ook al is die er wel.
"""

from pathlib import Path
from typing import Literal, Optional

from .ubl import is_ubl, lees_xml_veilig

Route = Optional[Literal["ubl", "tekst", "beeld"]]

# Eerste bytes waaraan een bestandssoort te herkennen is.
MAGISCHE_BYTES = {
    b"%PDF-": "pdf",
    b"\xff\xd8\xff": "jpg",
    b"\x89PNG\r\n\x1a\n": "png",
}

# Namen die Factur-X en ZUGFeRD aan hun ingebedde XML geven.
EFACTUUR_BIJLAGEN = (
    "factur-x.xml",
    "zugferd-invoice.xml",
    "xrechnung.xml",
    "facturx.xml",
    "ubl.xml",
)


def bestandssoort(begin: bytes) -> Optional[str]:
    """Herken de bestandssoort aan de eerste bytes; None als onbekend."""
    for handtekening, naam in MAGISCHE_BYTES.items():
        if begin.startswith(handtekening):
            return naam
    # XML mag beginnen met een declaratie, een BOM of meteen met '<'.
    kop = begin.lstrip(b"\xef\xbb\xbf").lstrip()
    if kop.startswith(b"<?xml") or kop.startswith(b"<"):
        return "xml"
    return None


def zoek_ingebedde_efactuur(pad: str | Path) -> Optional[bytes]:
    """Geef de XML-bijlage uit een PDF (Factur-X / ZUGFeRD), of None.

    Zulke PDF's zijn twee dingen tegelijk: een leesbare factuur voor de
    mens, en dezelfde factuur als XML voor de computer. Die XML is de
    betrouwbaarste bron, dus daar kijken we eerst naar.
    """
    try:
        from pypdf import PdfReader

        bijlagen = PdfReader(str(pad)).attachments or {}
    except Exception:
        # Geen bijlagen kunnen lezen is geen fout: dan is het gewoon
        # een PDF zonder e-factuur en gaat hij langs het normale pad.
        return None

    # Eerst op de bekende namen, daarna op elk .xml-bestand.
    for naam in list(bijlagen):
        if naam.lower() in EFACTUUR_BIJLAGEN:
            return _eerste(bijlagen[naam])
    for naam in list(bijlagen):
        if naam.lower().endswith(".xml"):
            return _eerste(bijlagen[naam])
    return None


def _eerste(inhoud) -> Optional[bytes]:
    """pypdf geeft per naam een lijst met versies; pak de eerste."""
    if isinstance(inhoud, (bytes, bytearray)):
        return bytes(inhoud)
    if isinstance(inhoud, list) and inhoud:
        return bytes(inhoud[0])
    return None


def routeer_document(pad: str | Path) -> tuple[Route, Optional[str]]:
    """Bepaal het verwerkingspad; geef (route, reden-bij-onbekend).

    Er wordt niet op de extensie afgegaan maar op wat er in het bestand
    staat. Een onbekende soort levert None op met een reden, zodat de
    aanroeper hem ter review kan leggen (Gouden regel 4).
    """
    pad = Path(pad)
    if not pad.is_file():
        return None, f"bestand niet gevonden: {pad}"

    with open(pad, "rb") as bestand:
        begin = bestand.read(1024)
    if not begin:
        return None, f"het bestand is leeg: {pad.name}"

    soort = bestandssoort(begin)

    if soort == "xml":
        try:
            wortel = lees_xml_veilig(pad.read_bytes())
        except Exception as fout:
            return None, (
                f"het bestand begint als XML maar is niet veilig te lezen: "
                f"{type(fout).__name__}: {fout}"
            )
        if is_ubl(wortel) is None:
            return None, (
                f"XML met hoofdelement '{wortel.tag}'; dat is geen UBL "
                f"Invoice of CreditNote"
            )
        return "ubl", None

    if soort == "pdf":
        # Zit er een e-factuur in de PDF, dan is dat de beste bron —
        # betrouwbaarder dan de tekstlaag, want daar staan de velden
        # met naam en al in.
        ingebed = zoek_ingebedde_efactuur(pad)
        if ingebed is not None:
            try:
                if is_ubl(lees_xml_veilig(ingebed)) is not None:
                    return "ubl", None
            except Exception:
                pass  # onbruikbare bijlage: gewoon verder als PDF
        from .documenten import lees_pdf_tekst

        return ("tekst" if lees_pdf_tekst(pad).status == "gelezen" else "beeld"), None

    if soort in ("jpg", "png"):
        return "beeld", None

    return None, (
        f"onbekende bestandssoort: de inhoud van {pad.name} is geen PDF, "
        f"geen afbeelding en geen XML"
    )
