"""Minimale PDF-schrijver voor factuurdocumenten.

Genoeg voor een echte factuurlay-out: tekst links en rechts uitgelijnd,
in normaal of vet, plus horizontale lijnen. Geen afbeeldingen, geen
meerdere pagina's, geen tijdstempel in het bestand — dat laatste zorgt
ervoor dat twee keer genereren byte-voor-byte hetzelfde bestand geeft.

Coördinaten gaan van linksboven, zoals je een factuur leest; intern
wordt dat omgerekend naar het PDF-assenstelsel (linksonder).
"""

from pathlib import Path

A4_BREEDTE = 595  # punten (72 dpi)
A4_HOOGTE = 842

# Tekenbreedtes van Helvetica in duizendsten van de lettergrootte.
# Alleen nodig om bedragen netjes rechts uit te lijnen. Cijfers zijn in
# Helvetica en Helvetica-Bold even breed (556), dus een vetgedrukt
# totaal lijnt uit op dezelfde rechterkantlijn.
_BREEDTES = {
    " ": 278, "!": 278, '"': 355, "#": 556, "$": 556, "%": 889, "&": 667,
    "'": 191, "(": 333, ")": 333, "*": 389, "+": 584, ",": 278, "-": 333,
    ".": 278, "/": 278, ":": 278, ";": 278, "<": 584, "=": 584, ">": 584,
    "?": 556, "@": 1015, "[": 278, "\\": 278, "]": 278, "^": 469, "_": 556,
    "`": 333, "{": 334, "|": 260, "}": 334, "~": 584, "€": 556,
    "A": 667, "B": 667, "C": 722, "D": 722, "E": 667, "F": 611, "G": 778,
    "H": 722, "I": 278, "J": 500, "K": 667, "L": 556, "M": 833, "N": 722,
    "O": 778, "P": 667, "Q": 778, "R": 722, "S": 667, "T": 611, "U": 722,
    "V": 667, "W": 944, "X": 667, "Y": 667, "Z": 611,
    "a": 556, "b": 556, "c": 500, "d": 556, "e": 556, "f": 278, "g": 556,
    "h": 556, "i": 222, "j": 222, "k": 500, "l": 222, "m": 833, "n": 556,
    "o": 556, "p": 556, "q": 556, "r": 333, "s": 500, "t": 278, "u": 556,
    "v": 500, "w": 722, "x": 500, "y": 500, "z": 500,
}
_STANDAARDBREEDTE = 556


def tekstbreedte(tekst: str, grootte: float) -> float:
    """Breedte van een regel tekst in punten."""
    duizendsten = sum(
        _BREEDTES.get(teken, _STANDAARDBREEDTE)
        if not teken.isdigit()
        else 556
        for teken in tekst
    )
    return duizendsten * grootte / 1000


def _ontsnap(tekst: str) -> bytes:
    """Zet tekst om naar de bytes die in een PDF-string mogen staan."""
    ruw = tekst.replace("\\", r"\\").replace("(", r"\(").replace(")", r"\)")
    # WinAnsiEncoding komt overeen met cp1252; onbekende tekens worden
    # een vraagteken in plaats van een crash.
    return ruw.encode("cp1252", errors="replace")


class Pagina:
    """Verzamelt de tekenopdrachten voor één pagina."""

    def __init__(self, breedte: int = A4_BREEDTE, hoogte: int = A4_HOOGTE):
        self.breedte = breedte
        self.hoogte = hoogte
        self._opdrachten: list[bytes] = []

    def tekst(
        self, x: float, y: float, tekst: str, grootte: float = 9, vet: bool = False
    ) -> None:
        """Zet tekst neer met de linkerkant op x, y punten vanaf linksboven."""
        lettertype = b"/F2" if vet else b"/F1"
        self._opdrachten.append(
            b"BT " + lettertype + b" " + f"{grootte:g}".encode() + b" Tf "
            + f"{x:g} {self.hoogte - y:g}".encode() + b" Td ("
            + _ontsnap(tekst) + b") Tj ET"
        )

    def tekst_rechts(
        self, x: float, y: float, tekst: str, grootte: float = 9, vet: bool = False
    ) -> None:
        """Zet tekst neer met de rechterkant op x — voor bedragen."""
        self.tekst(x - tekstbreedte(tekst, grootte), y, tekst, grootte, vet)

    def lijn(
        self, x1: float, y1: float, x2: float, y2: float, dikte: float = 0.5,
        grijs: float = 0.0,
    ) -> None:
        self._opdrachten.append(
            f"{grijs:g} G {dikte:g} w {x1:g} {self.hoogte - y1:g} m "
            f"{x2:g} {self.hoogte - y2:g} l S".encode()
        )

    def inhoudsstroom(self) -> bytes:
        return b"\n".join(self._opdrachten)


def _bouw_pdf(pagina: "Pagina", bijlage: tuple[str, bytes] | None) -> bytes:
    """Zet de PDF-objecten in elkaar, eventueel met een ingebed bestand.

    Een bijlage maakt hier een Factur-X/ZUGFeRD-achtige PDF van: dezelfde
    factuur is dan zowel leesbaar voor een mens als machineleesbaar als
    XML. De XML is dan de betrouwbaarste bron.
    """
    stroom = pagina.inhoudsstroom()
    catalogus = b"<< /Type /Catalog /Pages 2 0 R"
    if bijlage is not None:
        catalogus += (
            b" /Names << /EmbeddedFiles << /Names [(" + bijlage[0].encode()
            + b") 7 0 R] >> >> /AF [7 0 R]"
        )
    catalogus += b" >>"

    objecten = [
        catalogus,
        b"<< /Type /Pages /Kids [3 0 R] /Count 1 >>",
        b"<< /Type /Page /Parent 2 0 R /MediaBox [0 0 "
        + f"{pagina.breedte} {pagina.hoogte}".encode()
        + b"] /Contents 4 0 R /Resources << /Font << /F1 5 0 R /F2 6 0 R >> >> >>",
        b"<< /Length " + str(len(stroom)).encode() + b" >>\nstream\n"
        + stroom + b"\nendstream",
        b"<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica "
        b"/Encoding /WinAnsiEncoding >>",
        b"<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold "
        b"/Encoding /WinAnsiEncoding >>",
    ]

    if bijlage is not None:
        naam, gegevens = bijlage[0].encode(), bijlage[1]
        objecten.append(
            b"<< /Type /Filespec /F (" + naam + b") /UF (" + naam
            + b") /AFRelationship /Data /Desc (Factuur als e-factuur)"
            b" /EF << /F 8 0 R >> >>"
        )
        objecten.append(
            b"<< /Type /EmbeddedFile /Subtype /text#2Fxml /Length "
            + str(len(gegevens)).encode() + b" >>\nstream\n" + gegevens
            + b"\nendstream"
        )

    uit = bytearray(b"%PDF-1.4\n")
    posities = []
    for nummer, obj in enumerate(objecten, start=1):
        posities.append(len(uit))
        uit += str(nummer).encode() + b" 0 obj\n" + obj + b"\nendobj\n"

    start_xref = len(uit)
    aantal = len(objecten) + 1
    uit += b"xref\n0 " + str(aantal).encode() + b"\n0000000000 65535 f \n"
    for positie in posities:
        uit += f"{positie:010d} 00000 n \n".encode()
    uit += (
        b"trailer\n<< /Size " + str(aantal).encode() + b" /Root 1 0 R >>\n"
        b"startxref\n" + str(start_xref).encode() + b"\n%%EOF\n"
    )
    return bytes(uit)


def schrijf_pdf(pagina: "Pagina", pad: str | Path) -> Path:
    """Schrijf één pagina weg als PDF-bestand."""
    pad = Path(pad)
    pad.parent.mkdir(parents=True, exist_ok=True)
    pad.write_bytes(_bouw_pdf(pagina, None))
    return pad


def schrijf_pdf_met_bijlage(
    pagina: "Pagina", pad: str | Path, bijlage_naam: str, bijlage: bytes
) -> Path:
    """Schrijf een PDF met een ingebed bestand (Factur-X / ZUGFeRD)."""
    pad = Path(pad)
    pad.parent.mkdir(parents=True, exist_ok=True)
    pad.write_bytes(_bouw_pdf(pagina, (bijlage_naam, bijlage)))
    return pad
