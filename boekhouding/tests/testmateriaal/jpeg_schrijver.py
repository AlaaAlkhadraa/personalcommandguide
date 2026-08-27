"""Minimale baseline-JPEG-schrijver in grijswaarden.

Nodig voor één ding: een factuur die als gescande foto binnenkomt, dus
een echt beeldbestand zonder tekstlaag. Bewust met de hand geschreven in
plaats van met een beeldbibliotheek, zodat het project geen extra
afhankelijkheid krijgt.

Het formaat volgt de standaardtabellen uit de JPEG-specificatie
(bijlage K): één component, 8 bits, geen subsampling.
"""

import math
from pathlib import Path

from .bitmapfont import BREEDTE as GLIEFBREEDTE, HOOGTE as GLIEFHOOGTE, glief

# Standaard kwantisatietabel voor helderheid (JPEG-bijlage K).
KWANTISATIE = [
    16, 11, 10, 16, 24, 40, 51, 61,
    12, 12, 14, 19, 26, 58, 60, 55,
    14, 13, 16, 24, 40, 57, 69, 56,
    14, 17, 22, 29, 51, 87, 80, 62,
    18, 22, 37, 56, 68, 109, 103, 77,
    24, 35, 55, 64, 81, 104, 113, 92,
    49, 64, 78, 87, 103, 121, 120, 101,
    72, 92, 95, 98, 112, 100, 103, 99,
]

ZIGZAG = [
    0, 1, 8, 16, 9, 2, 3, 10,
    17, 24, 32, 25, 18, 11, 4, 5,
    12, 19, 26, 33, 40, 48, 41, 34,
    27, 20, 13, 6, 7, 14, 21, 28,
    35, 42, 49, 56, 57, 50, 43, 36,
    29, 22, 15, 23, 30, 37, 44, 51,
    58, 59, 52, 45, 38, 31, 39, 46,
    53, 60, 61, 54, 47, 55, 62, 63,
]

DC_BITS = [0, 1, 5, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0]
DC_WAARDEN = list(range(12))

AC_BITS = [0, 2, 1, 3, 3, 2, 4, 3, 5, 5, 4, 4, 0, 0, 1, 0x7D]
AC_WAARDEN = [
    0x01, 0x02, 0x03, 0x00, 0x04, 0x11, 0x05, 0x12,
    0x21, 0x31, 0x41, 0x06, 0x13, 0x51, 0x61, 0x07,
    0x22, 0x71, 0x14, 0x32, 0x81, 0x91, 0xA1, 0x08,
    0x23, 0x42, 0xB1, 0xC1, 0x15, 0x52, 0xD1, 0xF0,
    0x24, 0x33, 0x62, 0x72, 0x82, 0x09, 0x0A, 0x16,
    0x17, 0x18, 0x19, 0x1A, 0x25, 0x26, 0x27, 0x28,
    0x29, 0x2A, 0x34, 0x35, 0x36, 0x37, 0x38, 0x39,
    0x3A, 0x43, 0x44, 0x45, 0x46, 0x47, 0x48, 0x49,
    0x4A, 0x53, 0x54, 0x55, 0x56, 0x57, 0x58, 0x59,
    0x5A, 0x63, 0x64, 0x65, 0x66, 0x67, 0x68, 0x69,
    0x6A, 0x73, 0x74, 0x75, 0x76, 0x77, 0x78, 0x79,
    0x7A, 0x83, 0x84, 0x85, 0x86, 0x87, 0x88, 0x89,
    0x8A, 0x92, 0x93, 0x94, 0x95, 0x96, 0x97, 0x98,
    0x99, 0x9A, 0xA2, 0xA3, 0xA4, 0xA5, 0xA6, 0xA7,
    0xA8, 0xA9, 0xAA, 0xB2, 0xB3, 0xB4, 0xB5, 0xB6,
    0xB7, 0xB8, 0xB9, 0xBA, 0xC2, 0xC3, 0xC4, 0xC5,
    0xC6, 0xC7, 0xC8, 0xC9, 0xCA, 0xD2, 0xD3, 0xD4,
    0xD5, 0xD6, 0xD7, 0xD8, 0xD9, 0xDA, 0xE1, 0xE2,
    0xE3, 0xE4, 0xE5, 0xE6, 0xE7, 0xE8, 0xE9, 0xEA,
    0xF1, 0xF2, 0xF3, 0xF4, 0xF5, 0xF6, 0xF7, 0xF8,
    0xF9, 0xFA,
]

# Cosinustabel en schaalfactoren voor de DCT, één keer berekend.
_COS = [[math.cos((2 * x + 1) * u * math.pi / 16) for x in range(8)] for u in range(8)]
_C = [(1 / math.sqrt(2) if u == 0 else 1.0) * 0.5 for u in range(8)]


def _huffmantabel(bits: list[int], waarden: list[int]) -> dict[int, tuple[int, int]]:
    """Bouw {waarde: (code, aantal bits)} uit de tellingen per codelengte."""
    tabel = {}
    code = 0
    positie = 0
    for lengte in range(1, 17):
        for _ in range(bits[lengte - 1]):
            tabel[waarden[positie]] = (code, lengte)
            code += 1
            positie += 1
        code <<= 1
    return tabel


DC_TABEL = _huffmantabel(DC_BITS, DC_WAARDEN)
AC_TABEL = _huffmantabel(AC_BITS, AC_WAARDEN)


class _BitSchrijver:
    """Schrijft bits en zorgt voor de verplichte 0xFF-opvulling."""

    def __init__(self) -> None:
        self.uit = bytearray()
        self._buffer = 0
        self._aantal = 0

    def bits(self, code: int, lengte: int) -> None:
        for verschuiving in range(lengte - 1, -1, -1):
            self._buffer = (self._buffer << 1) | ((code >> verschuiving) & 1)
            self._aantal += 1
            if self._aantal == 8:
                self.uit.append(self._buffer)
                if self._buffer == 0xFF:
                    self.uit.append(0x00)  # byte stuffing
                self._buffer = 0
                self._aantal = 0

    def afsluiten(self) -> None:
        while self._aantal:
            self.bits(1, 1)


def _categorie(waarde: int) -> int:
    """Aantal bits dat nodig is om deze waarde te coderen."""
    grootte = 0
    rest = abs(waarde)
    while rest:
        grootte += 1
        rest >>= 1
    return grootte


def _bitpatroon(waarde: int, grootte: int) -> int:
    return waarde if waarde > 0 else waarde + (1 << grootte) - 1


def _dct(blok: list[list[float]]) -> list[float]:
    """Voorwaartse 2D-DCT, gescheiden per rij en kolom (sneller)."""
    tussen = [
        [sum(blok[y][x] * _COS[u][x] for x in range(8)) * _C[u] for u in range(8)]
        for y in range(8)
    ]
    uit = []
    for v in range(8):
        for u in range(8):
            uit.append(sum(tussen[y][u] * _COS[v][y] for y in range(8)) * _C[v])
    return uit


class Bitmap:
    """Een grijswaardenvel waarop je tekst en lijnen kunt zetten."""

    def __init__(self, breedte: int, hoogte: int, achtergrond: int = 246):
        self.breedte = breedte
        self.hoogte = hoogte
        self.pixels = [[achtergrond] * breedte for _ in range(hoogte)]

    def punt(self, x: int, y: int, grijs: int) -> None:
        if 0 <= x < self.breedte and 0 <= y < self.hoogte:
            self.pixels[y][x] = max(0, min(255, grijs))

    def rechthoek(self, x: int, y: int, breedte: int, hoogte: int, grijs: int) -> None:
        for rij in range(y, y + hoogte):
            for kolom in range(x, x + breedte):
                self.punt(kolom, rij, grijs)

    def tekst(
        self, x: int, y: int, tekst: str, schaal: int = 2, grijs: int = 40
    ) -> int:
        """Teken tekst met de linkerbovenhoek op (x, y); geef de eindpositie."""
        cursor = x
        for teken in tekst:
            patroon = glief(teken)
            for rij in range(GLIEFHOOGTE):
                for kolom in range(GLIEFBREEDTE):
                    if patroon[rij][kolom]:
                        self.rechthoek(
                            cursor + kolom * schaal, y + rij * schaal,
                            schaal, schaal, grijs,
                        )
            cursor += (GLIEFBREEDTE + 1) * schaal
        return cursor

    def tekstbreedte(self, tekst: str, schaal: int = 2) -> int:
        return len(tekst) * (GLIEFBREEDTE + 1) * schaal

    def tekst_rechts(
        self, x: int, y: int, tekst: str, schaal: int = 2, grijs: int = 40
    ) -> None:
        self.tekst(x - self.tekstbreedte(tekst, schaal), y, tekst, schaal, grijs)


def schrijf_jpeg(bitmap: Bitmap, pad: str | Path, dpi: int = 100) -> Path:
    """Codeer de bitmap als baseline-JPEG en schrijf hem weg."""
    uit = bytearray(b"\xff\xd8")  # SOI

    # APP0 (JFIF)
    uit += b"\xff\xe0" + (16).to_bytes(2, "big") + b"JFIF\x00\x01\x01\x01"
    uit += dpi.to_bytes(2, "big") + dpi.to_bytes(2, "big") + b"\x00\x00"

    # DQT — de tabel gaat in zigzagvolgorde het bestand in.
    uit += b"\xff\xdb" + (67).to_bytes(2, "big") + b"\x00"
    uit += bytes(KWANTISATIE[ZIGZAG[i]] for i in range(64))

    # SOF0 — één component, geen subsampling.
    uit += b"\xff\xc0" + (11).to_bytes(2, "big") + b"\x08"
    uit += bitmap.hoogte.to_bytes(2, "big") + bitmap.breedte.to_bytes(2, "big")
    uit += b"\x01\x01\x11\x00"

    # DHT — de twee standaardtabellen.
    for klasse, bits, waarden in (
        (0x00, DC_BITS, DC_WAARDEN),
        (0x10, AC_BITS, AC_WAARDEN),
    ):
        uit += b"\xff\xc4" + (3 + 16 + len(waarden)).to_bytes(2, "big")
        uit += bytes([klasse]) + bytes(bits) + bytes(waarden)

    # SOS
    uit += b"\xff\xda" + (8).to_bytes(2, "big") + b"\x01\x01\x00\x00\x3f\x00"

    schrijver = _BitSchrijver()
    vorige_dc = 0
    for bloky in range(0, bitmap.hoogte, 8):
        for blokx in range(0, bitmap.breedte, 8):
            # Randblokken worden aangevuld met de laatste pixelwaarde.
            blok = [
                [
                    bitmap.pixels[min(bloky + y, bitmap.hoogte - 1)][
                        min(blokx + x, bitmap.breedte - 1)
                    ]
                    - 128
                    for x in range(8)
                ]
                for y in range(8)
            ]
            coefficienten = _dct(blok)
            gekwantiseerd = [
                int(round(coefficienten[ZIGZAG[i]] / KWANTISATIE[ZIGZAG[i]]))
                for i in range(64)
            ]

            # Gelijkstroomcoëfficiënt: alleen het verschil met het vorige blok.
            verschil = gekwantiseerd[0] - vorige_dc
            vorige_dc = gekwantiseerd[0]
            grootte = _categorie(verschil)
            code, lengte = DC_TABEL[grootte]
            schrijver.bits(code, lengte)
            if grootte:
                schrijver.bits(_bitpatroon(verschil, grootte), grootte)

            # Wisselstroomcoëfficiënten: reeksen nullen plus waarde.
            nullen = 0
            laatste = max(
                (i for i in range(1, 64) if gekwantiseerd[i]), default=0
            )
            for i in range(1, laatste + 1):
                if gekwantiseerd[i] == 0:
                    nullen += 1
                    continue
                while nullen > 15:
                    code, lengte = AC_TABEL[0xF0]  # ZRL
                    schrijver.bits(code, lengte)
                    nullen -= 16
                grootte = _categorie(gekwantiseerd[i])
                code, lengte = AC_TABEL[(nullen << 4) | grootte]
                schrijver.bits(code, lengte)
                schrijver.bits(_bitpatroon(gekwantiseerd[i], grootte), grootte)
                nullen = 0
            if laatste < 63:
                code, lengte = AC_TABEL[0x00]  # einde blok
                schrijver.bits(code, lengte)

    schrijver.afsluiten()
    uit += schrijver.uit
    uit += b"\xff\xd9"  # EOI

    pad = Path(pad)
    pad.parent.mkdir(parents=True, exist_ok=True)
    pad.write_bytes(bytes(uit))
    return pad
