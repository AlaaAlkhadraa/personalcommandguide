#!/usr/bin/env python3
"""Genereer synthetische Nederlandse factuurdocumenten voor tests.

Draaien vanuit de map boekhouding/:

    python tests/genereer_testfacturen.py

Er komen tien bestanden in tests/testfacturen/ te staan. Alles is
verzonnen maar realistisch opgemaakt: KvK-nummer, btw-identificatie-
nummer, IBAN, "Factuurdatum", "Vervaldatum" en "Totaal incl. btw".

Deterministisch: dezelfde seed en vaste datums, geen tijdstempel in de
bestanden, geen internet. Twee keer draaien geeft byte-voor-byte
dezelfde bestanden.

Let op: dit is testmateriaal, geen productiecode. De bedragen in
factuur 10 kloppen bewust niet, en factuur 09 mist bewust een
factuurnummer — die horen door de validatie afgekeurd te worden.
"""

import json
import random
import sys
from dataclasses import dataclass, field
from decimal import Decimal
from pathlib import Path
from typing import Optional

sys.path.insert(0, str(Path(__file__).parent))

from testmateriaal.jpeg_schrijver import Bitmap, schrijf_jpeg
from testmateriaal.pdf_schrijver import Pagina, schrijf_pdf

SEED = 20260827
DOELMAP = Path(__file__).parent / "testfacturen"

# Kantlijnen van de PDF-lay-out, in punten vanaf linksboven.
LINKS = 56
RECHTS = 539
KOLOM_AANTAL = 330
KOLOM_PRIJS = 430
KOLOM_BEDRAG = RECHTS


def euro(bedrag: Decimal) -> str:
    """Nederlandse notatie: duizendtallen met punt, decimalen met komma."""
    negatief = bedrag < 0
    heel, _, decimalen = f"{abs(bedrag):.2f}".partition(".")
    groepen = []
    while len(heel) > 3:
        groepen.insert(0, heel[-3:])
        heel = heel[:-3]
    groepen.insert(0, heel)
    uit = ".".join(groepen) + "," + decimalen
    return ("-" if negatief else "") + uit


def maak_iban(rng: random.Random) -> str:
    """Een IBAN met kloppende controlegetallen (mod-97), maar verzonnen."""
    bank = rng.choice(["INGB", "RABO", "ABNA", "TRIO", "SNSB"])
    rekening = f"{rng.randrange(10**9, 10**10):010d}"
    # Controlegetal: land en '00' achteraan, letters naar cijfers (A=10).
    tijdelijk = bank + rekening + "NL00"
    getal = "".join(
        str(ord(teken) - 55) if teken.isalpha() else teken for teken in tijdelijk
    )
    controle = 98 - (int(getal) % 97)
    return f"NL{controle:02d}{bank}{rekening}"


@dataclass
class Regel:
    omschrijving: str
    aantal: Decimal
    stukprijs: Decimal

    @property
    def bedrag(self) -> Decimal:
        return (self.aantal * self.stukprijs).quantize(Decimal("0.01"))


@dataclass
class Factuur:
    bestandsnaam: str
    titel: str
    leverancier: str
    leverancier_adres: str
    leverancier_plaats: str
    kvk: str
    btw_id: str
    iban: str
    klant: str
    klant_adres: str
    klant_plaats: str
    factuurdatum: str
    vervaldatum: str
    regels: list[Regel]
    btw_percentage: Decimal
    bedrag_excl: Decimal
    btw_bedrag: Decimal
    bedrag_incl: Decimal
    factuurnummer: Optional[str] = None
    korting: Optional[tuple[str, Decimal]] = None
    opmerking: Optional[str] = None
    waarom: str = ""
    verwacht: str = "gevalideerd"


def teken_pdf(factuur: Factuur) -> Pagina:
    """Zet één factuur op een A4-pagina."""
    pagina = Pagina()

    # Kop: leverancier links, titel rechts.
    pagina.tekst(LINKS, 70, factuur.leverancier, 15, vet=True)
    pagina.tekst(LINKS, 88, factuur.leverancier_adres, 8.5)
    pagina.tekst(LINKS, 100, factuur.leverancier_plaats, 8.5)
    pagina.tekst_rechts(RECHTS, 72, factuur.titel.upper(), 20, vet=True)

    # Bedrijfsgegevens die op elke Nederlandse factuur horen te staan.
    pagina.tekst(LINKS, 118, f"KvK-nummer: {factuur.kvk}", 8.5)
    pagina.tekst(LINKS, 130, f"Btw-id: {factuur.btw_id}", 8.5)
    pagina.tekst(LINKS, 142, f"IBAN: {factuur.iban}", 8.5)

    # Klantgegevens.
    pagina.tekst(LINKS, 180, "Factuuradres", 8.5, vet=True)
    pagina.tekst(LINKS, 194, factuur.klant, 9)
    pagina.tekst(LINKS, 206, factuur.klant_adres, 9)
    pagina.tekst(LINKS, 218, factuur.klant_plaats, 9)

    # Factuurgegevens rechts.
    y = 194
    if factuur.factuurnummer is not None:
        pagina.tekst(340, y, "Factuurnummer:", 9)
        pagina.tekst_rechts(RECHTS, y, factuur.factuurnummer, 9)
        y += 14
    pagina.tekst(340, y, "Factuurdatum:", 9)
    pagina.tekst_rechts(RECHTS, y, factuur.factuurdatum, 9)
    pagina.tekst(340, y + 14, "Vervaldatum:", 9)
    pagina.tekst_rechts(RECHTS, y + 14, factuur.vervaldatum, 9)

    # Regeltabel.
    y = 268
    pagina.lijn(LINKS, y, RECHTS, y, 0.8)
    pagina.tekst(LINKS, y + 14, "Omschrijving", 9, vet=True)
    pagina.tekst_rechts(KOLOM_AANTAL, y + 14, "Aantal", 9, vet=True)
    pagina.tekst_rechts(KOLOM_PRIJS, y + 14, "Stukprijs", 9, vet=True)
    pagina.tekst_rechts(KOLOM_BEDRAG, y + 14, "Bedrag", 9, vet=True)
    y += 22
    pagina.lijn(LINKS, y, RECHTS, y, 0.5, grijs=0.6)

    for regel in factuur.regels:
        y += 18
        pagina.tekst(LINKS, y, regel.omschrijving, 9)
        pagina.tekst_rechts(KOLOM_AANTAL, y, f"{regel.aantal:g}", 9)
        pagina.tekst_rechts(KOLOM_PRIJS, y, euro(regel.stukprijs), 9)
        pagina.tekst_rechts(KOLOM_BEDRAG, y, euro(regel.bedrag), 9)

    if factuur.korting is not None:
        omschrijving, bedrag = factuur.korting
        y += 18
        pagina.tekst(LINKS, y, omschrijving, 9)
        pagina.tekst_rechts(KOLOM_BEDRAG, y, euro(bedrag), 9)

    # Totalen.
    y += 14
    pagina.lijn(300, y, RECHTS, y, 0.5, grijs=0.6)
    y += 18
    pagina.tekst(340, y, "Subtotaal excl. btw", 9)
    pagina.tekst_rechts(KOLOM_BEDRAG, y, euro(factuur.bedrag_excl), 9)
    y += 15
    pagina.tekst(340, y, f"Btw {factuur.btw_percentage:g}%", 9)
    pagina.tekst_rechts(KOLOM_BEDRAG, y, euro(factuur.btw_bedrag), 9)
    y += 6
    pagina.lijn(300, y, RECHTS, y, 0.8)
    y += 18
    pagina.tekst(340, y, "Totaal incl. btw", 10, vet=True)
    pagina.tekst_rechts(KOLOM_BEDRAG, y, euro(factuur.bedrag_incl), 10, vet=True)

    if factuur.opmerking:
        pagina.tekst(LINKS, y + 40, factuur.opmerking, 8.5)

    # Voettekst.
    pagina.lijn(LINKS, 760, RECHTS, 760, 0.5, grijs=0.7)
    pagina.tekst(
        LINKS, 774,
        f"Betaling binnen 30 dagen op {factuur.iban} "
        f"o.v.v. het factuurnummer.", 8,
    )
    pagina.tekst(
        LINKS, 786,
        f"{factuur.leverancier} - KvK {factuur.kvk} - Btw-id {factuur.btw_id}", 8,
    )
    return pagina


def teken_jpg(factuur: Factuur) -> Bitmap:
    """Zet een factuur op een bitmap, alsof hij is ingescand."""
    rng = random.Random(SEED)
    vel = Bitmap(827, 1169, achtergrond=244)

    # Lichte ruis en een schaduwrand, zodat het op een scan lijkt.
    for _ in range(6000):
        x = rng.randrange(vel.breedte)
        y = rng.randrange(vel.hoogte)
        vel.punt(x, y, rng.randrange(200, 240))
    vel.rechthoek(0, 0, vel.breedte, 6, 205)
    vel.rechthoek(0, vel.hoogte - 6, vel.breedte, 6, 205)

    links = 60
    rechts = 767
    vel.tekst(links, 60, factuur.leverancier, 3, 30)
    vel.tekst(links, 100, factuur.leverancier_adres, 2, 60)
    vel.tekst(links, 122, factuur.leverancier_plaats, 2, 60)
    vel.tekst_rechts(rechts, 60, factuur.titel.upper(), 4, 30)

    vel.tekst(links, 160, "KvK-nummer: " + factuur.kvk, 2, 55)
    vel.tekst(links, 182, "Btw-id: " + factuur.btw_id, 2, 55)
    vel.tekst(links, 204, "IBAN: " + factuur.iban, 2, 55)

    vel.tekst(links, 260, factuur.klant, 2, 40)
    vel.tekst(links, 282, factuur.klant_adres, 2, 40)
    vel.tekst(links, 304, factuur.klant_plaats, 2, 40)

    vel.tekst(430, 260, "Factuurnummer: " + (factuur.factuurnummer or ""), 2, 40)
    vel.tekst(430, 282, "Factuurdatum: " + factuur.factuurdatum, 2, 40)
    vel.tekst(430, 304, "Vervaldatum: " + factuur.vervaldatum, 2, 40)

    y = 370
    vel.rechthoek(links, y, rechts - links, 2, 70)
    vel.tekst(links, y + 12, "Omschrijving", 2, 30)
    vel.tekst_rechts(rechts, y + 12, "Bedrag", 2, 30)
    y += 40
    vel.rechthoek(links, y, rechts - links, 1, 150)

    for regel in factuur.regels:
        y += 30
        vel.tekst(links, y, regel.omschrijving, 2, 45)
        vel.tekst_rechts(rechts, y, euro(regel.bedrag), 2, 45)

    y += 50
    vel.rechthoek(430, y, rechts - 430, 1, 150)
    y += 16
    vel.tekst(430, y, "Subtotaal excl. btw", 2, 45)
    vel.tekst_rechts(rechts, y, euro(factuur.bedrag_excl), 2, 45)
    y += 26
    vel.tekst(430, y, f"Btw {factuur.btw_percentage:g}%", 2, 45)
    vel.tekst_rechts(rechts, y, euro(factuur.btw_bedrag), 2, 45)
    y += 30
    vel.rechthoek(430, y, rechts - 430, 2, 70)
    y += 14
    vel.tekst(430, y, "Totaal incl. btw", 3, 25)
    vel.tekst_rechts(rechts, y, euro(factuur.bedrag_incl), 3, 25)

    vel.rechthoek(links, 1060, rechts - links, 1, 150)
    vel.tekst(links, 1080, "Betaling binnen 30 dagen op " + factuur.iban, 2, 70)
    return vel


def _d(waarde: str) -> Decimal:
    return Decimal(waarde)


def maak_facturen() -> list[Factuur]:
    """De tien facturen, met vaste seed dus altijd dezelfde uitkomst."""
    rng = random.Random(SEED)

    def bedrijf(naam: str, adres: str, plaats: str) -> dict:
        return {
            "leverancier": naam,
            "leverancier_adres": adres,
            "leverancier_plaats": plaats,
            "kvk": f"{rng.randrange(10_000_000, 100_000_000)}",
            "btw_id": f"NL{rng.randrange(100_000_000, 1_000_000_000)}B{rng.randrange(1, 100):02d}",
            "iban": maak_iban(rng),
        }

    klant = {
        "klant": "Alkhadraa Advies",
        "klant_adres": "Zonnebloemstraat 14",
        "klant_plaats": "3011 AB Rotterdam",
    }

    return [
        Factuur(
            bestandsnaam="01-standaard-21procent.pdf",
            titel="Factuur",
            **bedrijf("Van Dijk ICT-diensten", "Keizersgracht 218", "1016 DZ Amsterdam"),
            **klant,
            factuurnummer="2026-0412",
            factuurdatum="12-07-2026",
            vervaldatum="11-08-2026",
            regels=[Regel("Onderhoud werkplekken juli 2026", _d("1"), _d("450.00"))],
            btw_percentage=_d("21"),
            bedrag_excl=_d("450.00"),
            btw_bedrag=_d("94.50"),
            bedrag_incl=_d("544.50"),
            waarom="gewone inkoopfactuur met het hoge tarief",
        ),
        Factuur(
            bestandsnaam="02-catering-9procent.pdf",
            titel="Factuur",
            **bedrijf("Bakkerij De Korenaar", "Nieuwe Binnenweg 87", "3014 GJ Rotterdam"),
            **klant,
            factuurnummer="B26-1187",
            factuurdatum="28-07-2026",
            vervaldatum="27-08-2026",
            regels=[Regel("Lunchbezorging teamdag (30 personen)", _d("30"), _d("6.00"))],
            btw_percentage=_d("9"),
            bedrag_excl=_d("180.00"),
            btw_bedrag=_d("16.20"),
            bedrag_incl=_d("196.20"),
            waarom="laag tarief van 9% op voedingsmiddelen",
        ),
        Factuur(
            bestandsnaam="03-verzekering-0procent.pdf",
            titel="Factuur",
            **bedrijf("Zeeland Assurantiën", "Havenweg 3", "4381 KM Vlissingen"),
            **klant,
            factuurnummer="ZA-2026-00891",
            factuurdatum="15-06-2026",
            vervaldatum="15-07-2026",
            regels=[
                Regel("Premie beroepsaansprakelijkheid Q3 2026", _d("1"), _d("325.00"))
            ],
            btw_percentage=_d("0"),
            bedrag_excl=_d("325.00"),
            btw_bedrag=_d("0.00"),
            bedrag_incl=_d("325.00"),
            opmerking="Verzekeringsdiensten: 0% btw.",
            waarom="nultarief, btw-bedrag is 0,00",
        ),
        Factuur(
            bestandsnaam="04-meerdere-regels-21procent.pdf",
            titel="Factuur",
            **bedrijf("Techniek Groothandel Oost", "Industrieweg 45", "7554 NB Hengelo"),
            **klant,
            factuurnummer="TGO-59042",
            factuurdatum="03-08-2026",
            vervaldatum="02-09-2026",
            regels=[
                Regel("Softwarelicentie ontwerppakket", _d("5"), _d("29.99")),
                Regel("Externe monitor 27 inch", _d("2"), _d("189.00")),
                Regel("Dockingstation USB-C", _d("1"), _d("129.00")),
                Regel("Verzend- en administratiekosten", _d("1"), _d("6.95")),
            ],
            btw_percentage=_d("21"),
            bedrag_excl=_d("663.90"),
            btw_bedrag=_d("139.42"),
            bedrag_incl=_d("803.32"),
            waarom="vier regels die samen het subtotaal vormen",
        ),
        Factuur(
            bestandsnaam="05-met-korting-21procent.pdf",
            titel="Factuur",
            **bedrijf("Hosting Noordzee", "Stationsplein 9", "2011 LM Haarlem"),
            **klant,
            factuurnummer="HN2026-3308",
            factuurdatum="10-08-2026",
            vervaldatum="09-09-2026",
            regels=[
                Regel("Webhosting jaarpakket zakelijk", _d("1"), _d("540.00")),
                Regel("SSL-certificaat", _d("1"), _d("79.00")),
            ],
            korting=("Klantkorting 10%", _d("-61.90")),
            btw_percentage=_d("21"),
            bedrag_excl=_d("557.10"),
            btw_bedrag=_d("116.99"),
            bedrag_incl=_d("674.09"),
            waarom="kortingsregel: het subtotaal is lager dan de regels samen",
        ),
        Factuur(
            bestandsnaam="06-creditnota-21procent.pdf",
            titel="Creditnota",
            **bedrijf("Van Dijk ICT-diensten", "Keizersgracht 218", "1016 DZ Amsterdam"),
            **klant,
            factuurnummer="2026-0455C",
            factuurdatum="14-08-2026",
            vervaldatum="13-09-2026",
            regels=[
                Regel("Creditering onderhoud werkplekken juli 2026", _d("1"), _d("-450.00"))
            ],
            btw_percentage=_d("21"),
            bedrag_excl=_d("-450.00"),
            btw_bedrag=_d("-94.50"),
            bedrag_incl=_d("-544.50"),
            opmerking="Creditnota bij factuur 2026-0412. Bedrag wordt teruggestort.",
            waarom="negatieve bedragen; de rekenregels moeten ook hier kloppen",
        ),
        Factuur(
            bestandsnaam="07-duizendtal-21procent.pdf",
            titel="Factuur",
            **bedrijf("Bouwadvies Rijnmond", "Schiedamsedijk 120", "3011 EN Rotterdam"),
            **klant,
            factuurnummer="BR-2026-114",
            factuurdatum="01-07-2026",
            vervaldatum="31-07-2026",
            regels=[Regel("Constructieadvies project Waalhaven", _d("25"), _d("50.00"))],
            btw_percentage=_d("21"),
            bedrag_excl=_d("1250.00"),
            btw_bedrag=_d("262.50"),
            bedrag_incl=_d("1512.50"),
            waarom="bedragen boven de duizend: 1.250,00 met punt als duizendtal",
        ),
        Factuur(
            bestandsnaam="08-scan-zonder-tekstlaag.jpg",
            titel="Factuur",
            **bedrijf("Drukkerij Het Anker", "Ambachtstraat 22", "5211 AB Den Bosch"),
            **klant,
            factuurnummer="DA-26-0771",
            factuurdatum="29-06-2026",
            vervaldatum="29-07-2026",
            regels=[
                Regel("Drukwerk visitekaartjes", _d("1"), _d("85.00")),
                Regel("Briefpapier 500 vel", _d("1"), _d("125.00")),
            ],
            btw_percentage=_d("21"),
            bedrag_excl=_d("210.00"),
            btw_bedrag=_d("44.10"),
            bedrag_incl=_d("254.10"),
            waarom="foto/scan zonder tekstlaag: hier is geen tekst uit te halen",
            verwacht="review_nodig",
        ),
        Factuur(
            bestandsnaam="09-zonder-factuurnummer.pdf",
            titel="Factuur",
            **bedrijf("Schoonmaakbedrijf Helder", "Dorpsstraat 61", "6811 CD Arnhem"),
            **klant,
            factuurnummer=None,
            factuurdatum="18-08-2026",
            vervaldatum="17-09-2026",
            regels=[Regel("Schoonmaak kantoorruimte augustus 2026", _d("1"), _d("95.00"))],
            btw_percentage=_d("21"),
            bedrag_excl=_d("95.00"),
            btw_bedrag=_d("19.95"),
            bedrag_incl=_d("114.95"),
            waarom="factuurnummer ontbreekt volledig op het document",
            verwacht="review_nodig",
        ),
        Factuur(
            bestandsnaam="10-bedragen-kloppen-niet.pdf",
            titel="Factuur",
            **bedrijf("Meubelzaak De Eik", "Marktstraat 8", "8011 LK Zwolle"),
            **klant,
            factuurnummer="ME-2026-0203",
            factuurdatum="20-08-2026",
            vervaldatum="19-09-2026",
            regels=[Regel("Bureaustoel ergonomisch", _d("2"), _d("150.00"))],
            btw_percentage=_d("21"),
            bedrag_excl=_d("300.00"),
            btw_bedrag=_d("63.00"),
            bedrag_incl=_d("383.00"),  # bewust fout: 300,00 + 63,00 = 363,00
            waarom="totaal klopt niet: 300,00 + 63,00 is 363,00, niet 383,00",
            verwacht="review_nodig",
        ),
    ]


def controleer(facturen: list[Factuur]) -> None:
    """Reken de bedragen na, zodat een typefout niet ongemerkt doorglipt.

    Factuur 10 hoort bewust niet te kloppen; die wordt overgeslagen.
    """
    for factuur in facturen:
        if "kloppen-niet" in factuur.bestandsnaam:
            som = factuur.bedrag_excl + factuur.btw_bedrag
            assert som != factuur.bedrag_incl, (
                f"{factuur.bestandsnaam} hoort juist NIET te kloppen"
            )
            continue

        regeltotaal = sum((regel.bedrag for regel in factuur.regels), Decimal("0"))
        if factuur.korting is not None:
            regeltotaal += factuur.korting[1]
        assert regeltotaal == factuur.bedrag_excl, (
            f"{factuur.bestandsnaam}: regels tellen op tot {regeltotaal}, "
            f"maar subtotaal is {factuur.bedrag_excl}"
        )
        verwachte_btw = (
            factuur.bedrag_excl * factuur.btw_percentage / 100
        ).quantize(Decimal("0.01"))
        assert factuur.btw_bedrag == verwachte_btw, (
            f"{factuur.bestandsnaam}: btw is {factuur.btw_bedrag}, "
            f"verwacht {verwachte_btw}"
        )
        assert factuur.bedrag_excl + factuur.btw_bedrag == factuur.bedrag_incl, (
            f"{factuur.bestandsnaam}: totaal klopt niet"
        )


def main() -> None:
    facturen = maak_facturen()
    controleer(facturen)

    DOELMAP.mkdir(parents=True, exist_ok=True)
    overzicht = []
    for factuur in facturen:
        doel = DOELMAP / factuur.bestandsnaam
        if doel.suffix == ".jpg":
            schrijf_jpeg(teken_jpg(factuur), doel)
        else:
            schrijf_pdf(teken_pdf(factuur), doel)

        overzicht.append(
            {
                "bestand": factuur.bestandsnaam,
                "waarom": factuur.waarom,
                "verwachte_status": factuur.verwacht,
                "leverancier": factuur.leverancier,
                "factuurnummer": factuur.factuurnummer,
                "factuurdatum": factuur.factuurdatum,
                "btw_percentage": str(factuur.btw_percentage),
                "bedrag_excl": str(factuur.bedrag_excl),
                "btw_bedrag": str(factuur.btw_bedrag),
                "bedrag_incl": str(factuur.bedrag_incl),
            }
        )
        print(f"  {factuur.bestandsnaam:<34} {doel.stat().st_size:>7} bytes")

    (DOELMAP / "overzicht.json").write_text(
        json.dumps(overzicht, ensure_ascii=False, indent=2) + "\n", encoding="utf-8"
    )
    print(f"\n{len(facturen)} bestanden in {DOELMAP}")


if __name__ == "__main__":
    main()
