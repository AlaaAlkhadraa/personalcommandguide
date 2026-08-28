"""Bankafschriften inlezen: MT940 en CAMT.053.

Geen AI in deze module. Een bankafschrift is een vast formaat: de velden
staan er met een naam bij, net als bij een e-factuur. Er valt niets te
herkennen en niets te interpreteren — alleen te lezen wat er staat.

Twee formaten, allebei standaard bij Nederlandse banken:

- **MT940**: het oude SWIFT-formaat, platte tekst met regels die met
  `:20:`, `:61:`, `:86:` beginnen. ING, Rabobank en ABN AMRO leveren het
  allemaal, met kleine onderlinge verschillen in de omschrijvingsregel.
- **CAMT.053**: de XML-opvolger. Wordt gelezen met dezelfde veilige
  parser als de e-facturen van module 4: geen DTD, geen entiteiten, geen
  externe verwijzingen, en dezelfde groottegrens.

Wat hier geldt:

- **Een onleesbare regel breekt de import niet af.** De rest van het
  bestand wordt gewoon verwerkt en de kapotte regel komt terug als reden
  (Gouden regel 4). Een afschrift van 200 regels is anders onbruikbaar
  door één rare regel.
- **Er wordt niets ingevuld.** Ontbreekt de tegenrekening of de
  omschrijving, dan blijft dat veld leeg. Leeg is informatie.
- **Bedragen zijn Decimal en ondertekend**: een afschrijving is negatief,
  een bijschrijving positief. Zo hoeft nergens anders een debet/credit-
  vlaggetje meegesleept te worden.
"""

import hashlib
import re
import xml.etree.ElementTree as ET
from datetime import date
from decimal import Decimal, InvalidOperation
from typing import Literal, Optional

from pydantic import BaseModel

from .ubl import XmlOnveilig, lees_xml_veilig, te_groot

# De naamruimte van CAMT.053. De versie erachter verschilt per bank en
# per jaar (.02, .04, .08), dus we vergelijken op het begin.
CAMT_NAAMRUIMTE = "urn:iso:std:iso:20022:tech:xsd:camt.053"

# De regel in een MT940 met het bedrag. Opgebouwd volgens de SWIFT-
# beschrijving: valutadatum, eventueel een boekdatum, D of C, eventueel
# een muntteken, het bedrag met een komma, de transactiesoort (N + drie
# tekens) en de referentie van de bank.
MT940_BEDRAGREGEL = re.compile(
    r"^(?P<valuta>\d{6})"
    r"(?P<boekdatum>\d{4})?"
    r"(?P<teken>RC|RD|C|D)"
    r"(?P<munt>[A-Z])?"
    r"(?P<bedrag>[\d.,]+)"
    r"(?P<soort>N[A-Z0-9]{3})"
    r"(?P<referentie>[^/\n]*)"
    r"(?://(?P<bankreferentie>.*))?$"
)

# De gestructureerde omschrijving die Nederlandse banken in :86: zetten:
# /TRTP/SEPA OVERBOEKING/IBAN/NL..../NAME/Van Dijk/REMI/Factuur 123
MT940_TAGS = re.compile(r"/(?P<tag>[A-Z]{2,8})/(?P<waarde>(?:(?!/[A-Z]{2,8}/).)*)")

# Welke tag welk veld vult. Meerdere namen per veld, want de banken
# gebruiken niet allemaal dezelfde.
TAG_TEGENREKENING = ("IBAN", "CNTP", "ACCT")
TAG_TEGENPARTIJ = ("NAME", "NAM", "BENM", "ORDP")
TAG_OMSCHRIJVING = ("REMI", "OMSCHRIJVING")
TAG_KENMERK = ("EREF", "PREF", "MARF")

# Waarden die "geen kenmerk" betekenen. Ze staan er wel, maar er staat
# niets in; ze overnemen zou een kenmerk suggereren dat er niet is.
GEEN_KENMERK = ("", "NONREF", "NOTPROVIDED")

# Een IBAN zoals die in een omschrijving kan staan.
IBAN_PATROON = re.compile(r"\b([A-Z]{2}\d{2}[A-Z0-9]{10,30})\b")


class Banktransactie(BaseModel):
    """Eén regel van een bankafschrift.

    bedrag is ondertekend: negatief is eraf, positief is erbij.
    """

    boekdatum: date
    bedrag: Decimal
    tegenrekening: Optional[str] = None
    tegenpartij: Optional[str] = None
    omschrijving: str = ""
    betalingskenmerk: Optional[str] = None
    bankreferentie: Optional[str] = None
    volgnummer: int = 0

    def kenmerk(self) -> str:
        """Een vingerafdruk van deze transactie, voor duplicaatherkenning.

        Alles wat de bank meestuurt telt mee. Twee keer hetzelfde
        afschrift inlezen levert dus twee keer dezelfde vingerafdrukken
        op, en dan wordt de tweede overgeslagen.
        """
        stukken = [
            str(self.boekdatum), str(self.bedrag), self.tegenrekening or "",
            self.tegenpartij or "", self.omschrijving,
            self.betalingskenmerk or "", self.bankreferentie or "",
        ]
        return hashlib.sha256("|".join(stukken).encode("utf-8")).hexdigest()


class ImportResultaat(BaseModel):
    """Uitkomst van het inlezen van een bankbestand.

    status "gelezen"      → er zijn transacties gevonden
    status "review_nodig" → geen enkele bruikbare regel; zie redenen

    Ook bij "gelezen" kunnen er redenen zijn: dat zijn de regels die
    zijn overgeslagen omdat ze niet te lezen waren. De rest van het
    bestand is dan gewoon verwerkt.
    """

    status: Literal["gelezen", "review_nodig"]
    formaat: Optional[Literal["mt940", "camt053"]] = None
    transacties: list[Banktransactie] = []
    redenen: list[str] = []
    rekening: Optional[str] = None


def _bedrag_van(tekst: str, negatief: bool) -> Optional[Decimal]:
    """Lees een bedrag als '1.234,56' of '1234,56'; None als het geen getal is."""
    schoon = tekst.strip().replace(".", "").replace(",", ".")
    try:
        waarde = Decimal(schoon)
    except InvalidOperation:
        return None
    return -waarde if negatief else waarde


def _datum_van(jjmmdd: str) -> Optional[date]:
    """'260714' wordt 2026-07-14. Een bankafschrift kent geen eeuw."""
    try:
        return date(2000 + int(jjmmdd[:2]), int(jjmmdd[2:4]), int(jjmmdd[4:6]))
    except ValueError:
        return None


def _tags_van(regel: str) -> dict[str, str]:
    return {
        t.group("tag"): t.group("waarde").strip()
        for t in MT940_TAGS.finditer(regel)
    }


def _eerste(tags: dict[str, str], namen: tuple[str, ...]) -> Optional[str]:
    for naam in namen:
        waarde = tags.get(naam)
        if waarde:
            return waarde
    return None


def _lees_86(regel: str) -> dict[str, Optional[str]]:
    """Haal tegenrekening, tegenpartij, omschrijving en kenmerk uit :86:.

    Staan er geen tags in (sommige banken sturen gewoon een zin), dan is
    de hele regel de omschrijving en zoeken we er nog een IBAN in.
    """
    tags = _tags_van(regel)
    if not tags:
        gevonden = IBAN_PATROON.search(regel)
        return {
            "tegenrekening": gevonden.group(1) if gevonden else None,
            "tegenpartij": None,
            "omschrijving": regel.strip(),
            "betalingskenmerk": None,
        }
    return {
        "tegenrekening": _eerste(tags, TAG_TEGENREKENING),
        "tegenpartij": _eerste(tags, TAG_TEGENPARTIJ),
        "omschrijving": _eerste(tags, TAG_OMSCHRIJVING) or "",
        "betalingskenmerk": _eerste(tags, TAG_KENMERK),
    }


def is_mt940(tekst: str) -> bool:
    """Herken MT940 aan de kenmerkende veldcodes, niet aan de extensie."""
    return ":61:" in tekst and (":20:" in tekst or ":25:" in tekst)


def lees_mt940(tekst: str) -> ImportResultaat:
    """Lees een MT940-afschrift; geeft nooit een exception.

    Een regel die niet te lezen is wordt overgeslagen met een reden; de
    rest van het bestand wordt gewoon verwerkt.
    """
    # Regels die niet met ':xx:' beginnen horen bij de vorige regel:
    # MT940 breekt lange omschrijvingen af.
    velden: list[tuple[str, str]] = []
    for ruwe_regel in tekst.replace("\r\n", "\n").split("\n"):
        treffer = re.match(r"^:(\d{2}[A-Z]?):(.*)$", ruwe_regel)
        if treffer:
            velden.append((treffer.group(1), treffer.group(2)))
        elif velden and ruwe_regel.strip():
            code, waarde = velden[-1]
            velden[-1] = (code, waarde + ruwe_regel.strip())

    transacties: list[Banktransactie] = []
    redenen: list[str] = []
    rekening: Optional[str] = None
    volgnummer = 0
    openstaand: Optional[Banktransactie] = None

    def rond_af() -> None:
        nonlocal openstaand
        if openstaand is not None:
            transacties.append(openstaand)
            openstaand = None

    for code, waarde in velden:
        if code == "25":
            gevonden = IBAN_PATROON.search(waarde)
            rekening = gevonden.group(1) if gevonden else waarde.strip() or None
        elif code == "61":
            rond_af()
            volgnummer += 1
            treffer = MT940_BEDRAGREGEL.match(waarde.strip())
            if treffer is None:
                redenen.append(
                    f"regel {volgnummer} van het afschrift is niet te lezen "
                    f"(:61:{waarde.strip()[:40]}); die is overgeslagen"
                )
                continue
            boekdatum = _datum_van(treffer.group("valuta"))
            bedrag = _bedrag_van(
                treffer.group("bedrag"), treffer.group("teken").endswith("D")
            )
            if boekdatum is None or bedrag is None:
                redenen.append(
                    f"regel {volgnummer} heeft een onleesbare datum of een "
                    f"onleesbaar bedrag; die is overgeslagen"
                )
                continue
            referentie = (treffer.group("referentie") or "").strip()
            openstaand = Banktransactie(
                boekdatum=boekdatum,
                bedrag=bedrag,
                betalingskenmerk=(
                    None if referentie.upper() in GEEN_KENMERK else referentie
                ),
                bankreferentie=(treffer.group("bankreferentie") or "").strip() or None,
                volgnummer=volgnummer,
            )
        elif code == "86" and openstaand is not None:
            gegevens = _lees_86(waarde)
            openstaand = openstaand.model_copy(update={
                "tegenrekening": gegevens["tegenrekening"],
                "tegenpartij": gegevens["tegenpartij"],
                "omschrijving": gegevens["omschrijving"] or "",
                "betalingskenmerk": gegevens["betalingskenmerk"]
                or openstaand.betalingskenmerk,
            })
    rond_af()

    if not transacties:
        return ImportResultaat(
            status="review_nodig",
            formaat="mt940",
            redenen=redenen or ["geen enkele boekingsregel (:61:) gevonden"],
            rekening=rekening,
        )
    return ImportResultaat(
        status="gelezen", formaat="mt940", transacties=transacties,
        redenen=redenen, rekening=rekening,
    )


def _lokaal(element: ET.Element) -> str:
    """De naam van een element zonder de naamruimte ervoor."""
    return element.tag.rsplit("}", 1)[-1]


def _kind(ouder: Optional[ET.Element], *namen: str) -> Optional[ET.Element]:
    """Loop een pad af op lokale naam, zodat de camt-versie niet uitmaakt."""
    huidig = ouder
    for naam in namen:
        if huidig is None:
            return None
        huidig = next((k for k in huidig if _lokaal(k) == naam), None)
    return huidig


def _tekst(element: Optional[ET.Element]) -> Optional[str]:
    if element is None or element.text is None:
        return None
    return element.text.strip() or None


def is_camt(wortel: ET.Element) -> bool:
    return CAMT_NAAMRUIMTE in wortel.tag and _lokaal(wortel) == "Document"


def _tekst_diep(ouder: ET.Element, naam: str) -> Optional[str]:
    """De eerste waarde met deze lokale naam, waar hij ook staat."""
    for element in ouder.iter():
        if _lokaal(element) == naam:
            waarde = _tekst(element)
            if waarde:
                return waarde
    return None


def _lees_ntry(
    ntry: ET.Element, volgnummer: int
) -> tuple[Optional[Banktransactie], Optional[str]]:
    """Lees één boeking uit een CAMT-afschrift; geef (transactie, reden)."""
    bedrag_tekst = _tekst(_kind(ntry, "Amt"))
    richting = _tekst(_kind(ntry, "CdtDbtInd"))
    datum_tekst = _tekst(_kind(ntry, "BookgDt", "Dt")) or _tekst(
        _kind(ntry, "ValDt", "Dt")
    )

    if bedrag_tekst is None or richting is None or datum_tekst is None:
        return None, (
            f"regel {volgnummer} mist een bedrag, een richting of een datum "
            f"(Amt / CdtDbtInd / BookgDt); die is overgeslagen"
        )
    try:
        bedrag = Decimal(bedrag_tekst)
        boekdatum = date.fromisoformat(datum_tekst[:10])
    except (InvalidOperation, ValueError):
        return None, (
            f"regel {volgnummer} heeft een onleesbaar bedrag of een "
            f"onleesbare datum; die is overgeslagen"
        )
    if richting == "DBIT":
        bedrag = -bedrag

    details = _kind(ntry, "NtryDtls", "TxDtls")
    partijen = _kind(details, "RltdPties") if details is not None else None

    tegenpartij = None
    tegenrekening = None
    if partijen is not None:
        # Bij een afschrijving is de tegenpartij de begunstigde (Cdtr),
        # bij een bijschrijving de betaler (Dbtr).
        volgorde = ("Cdtr", "Dbtr") if bedrag < 0 else ("Dbtr", "Cdtr")
        for rol in volgorde:
            tegenpartij = tegenpartij or _tekst(_kind(partijen, rol, "Nm"))
            tegenrekening = tegenrekening or _tekst(
                _kind(partijen, f"{rol}Acct", "Id", "IBAN")
            )

    omschrijving = ""
    kenmerk = None
    if details is not None:
        remi = _kind(details, "RmtInf")
        if remi is not None:
            regels = [_tekst(k) for k in remi if _lokaal(k) == "Ustrd"]
            omschrijving = " ".join(r for r in regels if r)
            kenmerk = _tekst_diep(remi, "Ref")
        kenmerk = kenmerk or _tekst(_kind(details, "Refs", "EndToEndId"))
        if kenmerk and kenmerk.upper() in GEEN_KENMERK:
            kenmerk = None

    return Banktransactie(
        boekdatum=boekdatum,
        bedrag=bedrag,
        tegenrekening=tegenrekening,
        tegenpartij=tegenpartij,
        omschrijving=omschrijving or (_tekst(_kind(ntry, "AddtlNtryInf")) or ""),
        betalingskenmerk=kenmerk,
        bankreferentie=_tekst(_kind(ntry, "AcctSvcrRef")),
        volgnummer=volgnummer,
    ), None


def lees_camt(inhoud: bytes) -> ImportResultaat:
    """Lees een CAMT.053-afschrift; geeft nooit een exception.

    Gebruikt dezelfde veilige XML-lezer als module 4: geen DTD, geen
    entiteiten, geen externe verwijzingen, en dezelfde groottegrens van
    20 MB die vóór het lezen wordt gecontroleerd.
    """
    try:
        wortel = lees_xml_veilig(inhoud)
    except XmlOnveilig as fout:
        return ImportResultaat(
            status="review_nodig", formaat="camt053",
            redenen=[f"onveilige XML geweigerd: {fout}"],
        )
    except ET.ParseError as fout:
        return ImportResultaat(
            status="review_nodig", formaat="camt053",
            redenen=[f"het XML-bestand is niet leesbaar: {fout}"],
        )
    except Exception as fout:  # nooit een exception naar buiten
        return ImportResultaat(
            status="review_nodig", formaat="camt053",
            redenen=[f"kon het bestand niet lezen: {type(fout).__name__}: {fout}"],
        )

    if not is_camt(wortel):
        return ImportResultaat(
            status="review_nodig",
            redenen=[
                f"het hoofdelement '{wortel.tag}' is geen CAMT.053-afschrift"
            ],
        )

    rekening = None
    for element in wortel.iter():
        if _lokaal(element) == "Acct":
            rekening = _tekst(_kind(element, "Id", "IBAN"))
            break

    transacties: list[Banktransactie] = []
    redenen: list[str] = []
    volgnummer = 0
    for element in wortel.iter():
        if _lokaal(element) != "Ntry":
            continue
        volgnummer += 1
        transactie, reden = _lees_ntry(element, volgnummer)
        if transactie is None:
            redenen.append(reden or "onleesbare regel")
        else:
            transacties.append(transactie)

    if not transacties:
        return ImportResultaat(
            status="review_nodig", formaat="camt053",
            redenen=redenen or ["geen enkele boeking (Ntry) gevonden"],
            rekening=rekening,
        )
    return ImportResultaat(
        status="gelezen", formaat="camt053", transacties=transacties,
        redenen=redenen, rekening=rekening,
    )


def lees_bankbestand(inhoud: bytes, bestandsnaam: str = "") -> ImportResultaat:
    """Bepaal het formaat op inhoud en lees het afschrift.

    De bestandsnaam doet er niet toe: een MT940 heet bij de ene bank
    .sta en bij de andere .txt. Er wordt gekeken wat erin staat.
    """
    reden = te_groot(len(inhoud))
    if reden is not None:
        return ImportResultaat(status="review_nodig", redenen=[reden])

    begin = inhoud[:512].lstrip()
    if begin.startswith((b"<", b"\xef\xbb\xbf<", b"\xff\xfe<", b"\xfe\xff\x00<")):
        return lees_camt(inhoud)

    try:
        tekst = inhoud.decode("utf-8")
    except UnicodeDecodeError:
        # MT940 van oudere systemen is vaak latin-1.
        tekst = inhoud.decode("latin-1")

    if is_mt940(tekst):
        return lees_mt940(tekst)

    naam = f" ({bestandsnaam})" if bestandsnaam else ""
    return ImportResultaat(
        status="review_nodig",
        redenen=[
            f"dit bestand{naam} is geen MT940 en geen CAMT.053; er is geen "
            f"regel met :61: en geen XML gevonden. Vraag bij je bank om een "
            f"MT940- of CAMT.053-download"
        ],
    )
