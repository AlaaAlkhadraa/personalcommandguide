"""Btw-aangifte per kwartaal: een voorstel, geen aangifte.

Wat deze module doet: de rubrieken uitrekenen die een zzp'er in de
kwartaalaangifte invult, op basis van de boekingen die er staan. Wat hij
niet doet: iets indienen. Het resultaat is een voorstel dat de eigenaar
zelf overneemt bij de Belastingdienst.

De rubrieken:

    1a   omzet belast met het hoge tarief, en de btw daarover
    1b   omzet belast met het lage tarief, en de btw daarover
    5a   totaal verschuldigde omzetbelasting (de btw uit 1a en 1b)
    5b   voorbelasting (de btw op wat je zelf hebt ingekocht)
    saldo   5a min 5b: te betalen, of terug te vragen

Twee dingen zijn hier belangrijker dan het rekenwerk:

**Alles rekent de code uit, met vaste formules.** Er komt geen model aan
te pas — niet bij het optellen, niet bij het indelen in rubrieken
(Gouden regel 2).

**Wat er niet is, wordt apart gemeld.** Blokkeren kan alleen op
facturen die er zijn. Een factuur die nooit is aangeleverd staat
nergens, en dan rekent de aangifte een te laag bedrag uit dat er
correct uitziet. Daarom staan er bij het kwartaal ook signalen: vragen
over leveranciers die ineens ontbreken, gaten in factuurnummers en een
aantal dat afwijkt van eerdere kwartalen. Zie `volledigheid.py`. Die
signalen blokkeren niets.

**Bij twijfel geen getal.** Staat er in het kwartaal ook maar één
factuur die nog niet helemaal rond is, dan wordt er niets uitgerekend.
Je krijgt een lijst van wat er open staat. Een aangifte die "bijna
klopt" is gevaarlijker dan geen aangifte: hij ziet er af uit, en het
verschil merk je pas bij een controle.
"""

import sqlite3
from datetime import date
from decimal import Decimal
from typing import Any, Literal, Optional

from pydantic import BaseModel

from .database import boeking_bij_factuur, lees_boekingen
from .rekeningschema import Rekeningschema, rekeningschema_voor_jaar
from .volledigheid import Signaal, zoek_signalen

NUL = Decimal("0.00")

# Welke maanden bij welk kwartaal horen. 31 maart valt dus in K1 en
# 1 april in K2, en dat is precies waar het bij een kwartaalgrens om
# gaat.
KWARTAAL_MAANDEN = {1: (1, 3), 2: (4, 6), 3: (7, 9), 4: (10, 12)}

LAATSTE_DAG = {1: 31, 2: 28, 3: 31, 4: 30, 5: 31, 6: 30,
               7: 31, 8: 31, 9: 30, 10: 31, 11: 30, 12: 31}

VOORBEHOUD = (
    "Dit is een voorstel op basis van de boekingen in dit kwartaal. "
    "Het indienen doet u zelf bij de Belastingdienst; dit systeem "
    "verstuurt niets."
)


class Rubriek(BaseModel):
    """Eén rubriek van de aangifte."""

    code: str
    omschrijving: str
    grondslag: Decimal = NUL
    btw: Decimal = NUL


class Blokkade(BaseModel):
    """Eén factuur die de aangifte tegenhoudt."""

    factuur_id: int
    leverancier: Optional[str] = None
    factuurdatum: Optional[str] = None
    bedrag_incl: Optional[str] = None
    reden: str


class Aangifte(BaseModel):
    """Het voorstel voor één kwartaal.

    status "voorstel"    → de bedragen zijn uitgerekend
    status "geblokkeerd" → er is niets uitgerekend; zie blokkades/redenen
    """

    status: Literal["voorstel", "geblokkeerd"]
    jaar: int
    kwartaal: int
    van: date
    tot: date
    rubrieken: list[Rubriek] = []
    verschuldigd: Optional[Decimal] = None   # 5a
    voorbelasting: Optional[Decimal] = None  # 5b
    saldo: Optional[Decimal] = None          # 5a - 5b
    # Drie uitkomsten, niet twee: een saldo van precies nul is geen
    # teruggave. Dat verschil staat ook op het scherm.
    saldo_richting: Optional[Literal["betalen", "terugvragen", "niets"]] = None
    blokkades: list[Blokkade] = []
    redenen: list[str] = []
    waarschuwingen: list[str] = []
    # Vragen over wat er misschien ontbreekt. Deze blokkeren niets: een
    # factuur die nooit is aangeleverd staat nergens, dus er valt ook
    # niets op te blokkeren — alleen iets over op te merken.
    signalen: list[Signaal] = []
    aantal_boekingen: int = 0
    voorbehoud: str = VOORBEHOUD


def kwartaal_van(datum: date) -> int:
    """Geef het kwartaal (1 t/m 4) waarin deze datum valt."""
    return (datum.month - 1) // 3 + 1


def kwartaal_grenzen(jaar: int, kwartaal: int) -> tuple[date, date]:
    """Geef de eerste en de laatste dag van een kwartaal, allebei inclusief."""
    if kwartaal not in KWARTAAL_MAANDEN:
        raise ValueError(f"kwartaal {kwartaal} bestaat niet; kies 1 t/m 4")
    eerste_maand, laatste_maand = KWARTAAL_MAANDEN[kwartaal]
    dag = LAATSTE_DAG[laatste_maand]
    if laatste_maand == 2 and _schrikkeljaar(jaar):
        dag = 29
    return date(jaar, eerste_maand, 1), date(jaar, laatste_maand, dag)


def _schrikkeljaar(jaar: int) -> bool:
    return jaar % 4 == 0 and (jaar % 100 != 0 or jaar % 400 == 0)


def _decimal(waarde: Any) -> Decimal:
    if waarde is None or waarde == "":
        return NUL
    return Decimal(str(waarde))


def zoek_blokkades(
    conn: sqlite3.Connection, administratie_id: int, van: date, tot: date
) -> list[Blokkade]:
    """Zoek de facturen in dit kwartaal die nog niet rond zijn.

    Drie dingen houden een aangifte tegen, en alle drie om dezelfde
    reden: het bedrag telt nog niet mee terwijl de factuur er wel is.

    1. De factuur moet nog nagekeken worden (status review_nodig).
    2. De factuur klopt, maar niemand heeft hem goedgekeurd.
    3. De factuur is goedgekeurd, maar er staat nog geen boeking —
       meestal omdat er geen grootboekrekening is gekozen.
    """
    cursor = conn.execute(
        """
        SELECT id, leverancier, factuurdatum, bedrag_incl, status,
               goedgekeurd_op, rekening, review_redenen
        FROM facturen
        WHERE administratie_id = ?
          AND factuurdatum >= ? AND factuurdatum <= ?
        ORDER BY factuurdatum, id
        """,
        (administratie_id, str(van), str(tot)),
    )
    blokkades = []
    for (factuur_id, leverancier, factuurdatum, bedrag_incl, status,
         goedgekeurd_op, rekening, _redenen) in cursor.fetchall():
        if status == "review_nodig":
            reden = "moet nog nagekeken worden"
        elif goedgekeurd_op is None:
            reden = "is nagekeken maar nog niet goedgekeurd"
        elif boeking_bij_factuur(conn, factuur_id) is None:
            reden = (
                "is goedgekeurd maar nog niet geboekt; er is geen "
                "grootboekrekening gekozen"
                if not rekening else
                "is goedgekeurd maar nog niet geboekt"
            )
        else:
            continue
        blokkades.append(Blokkade(
            factuur_id=factuur_id,
            leverancier=leverancier,
            factuurdatum=factuurdatum,
            bedrag_incl=bedrag_incl,
            reden=reden,
        ))
    return blokkades


def _facturen_zonder_datum(conn: sqlite3.Connection, administratie_id: int) -> int:
    rij = conn.execute(
        "SELECT count(*) FROM facturen "
        "WHERE administratie_id = ? AND (factuurdatum IS NULL OR factuurdatum = '')",
        (administratie_id,),
    ).fetchone()
    return rij[0]


def _tel_op(
    boekingen: list[dict[str, Any]], schema: Rekeningschema
) -> tuple[dict[str, Decimal], Decimal]:
    """Tel de boekingen op tot de rubrieken. Vaste formules, geen model.

    Per boeking wordt gekeken welke btw-rekening erin voorkomt: dat
    bepaalt de rubriek. De omzet van diezelfde boeking is dan de
    grondslag. Een tegenboeking heeft de bedragen aan de andere kant en
    telt daardoor vanzelf negatief mee — daarom `credit - debet` en niet
    alleen `credit`.
    """
    hoog = schema.btw_verschuldigd_voor("21")
    laag = schema.btw_verschuldigd_voor("9")
    voorbelasting = schema.standaard("btw_voorbelasting")

    bedragen = {
        "1a_grondslag": NUL, "1a_btw": NUL,
        "1b_grondslag": NUL, "1b_btw": NUL,
        "buiten_1a_1b": NUL,
    }
    totaal_voorbelasting = NUL

    for boeking in boekingen:
        btw_hoog = NUL
        btw_laag = NUL
        omzet = NUL
        for regel in boeking["regels"]:
            debet, credit = _decimal(regel["debet"]), _decimal(regel["credit"])
            rekening = schema.zoek(regel["rekening"])
            if regel["rekening"] == hoog:
                btw_hoog += credit - debet
            elif regel["rekening"] == laag:
                btw_laag += credit - debet
            elif regel["rekening"] == voorbelasting:
                totaal_voorbelasting += debet - credit
            elif rekening is not None and rekening.soort == "opbrengsten":
                omzet += credit - debet

        if btw_hoog != NUL:
            bedragen["1a_btw"] += btw_hoog
            bedragen["1a_grondslag"] += omzet
        elif btw_laag != NUL:
            bedragen["1b_btw"] += btw_laag
            bedragen["1b_grondslag"] += omzet
        elif omzet != NUL:
            # Omzet zonder btw-regel: nultarief, vrijgesteld of verlegd.
            # Daar horen eigen rubrieken bij (1e, 2a, 3a) en die zijn nog
            # niet gebouwd; stilzwijgend weglaten mag niet.
            bedragen["buiten_1a_1b"] += omzet

    return bedragen, totaal_voorbelasting


def bereken_aangifte(
    conn: sqlite3.Connection, administratie_id: int, jaar: int, kwartaal: int
) -> Aangifte:
    """Reken het btw-voorstel voor één kwartaal uit.

    Staat er nog iets open in dat kwartaal, dan wordt er niets
    uitgerekend en krijg je de lijst met wat er mist.
    """
    van, tot = kwartaal_grenzen(jaar, kwartaal)
    aangifte = Aangifte(status="geblokkeerd", jaar=jaar, kwartaal=kwartaal,
                        van=van, tot=tot)

    # De volledigheidssignalen staan los van het rekenen: ze gaan over
    # wat er misschien níét is aangeleverd. Ze horen er dus ook bij als
    # de aangifte verderop wordt geblokkeerd.
    aangifte.signalen = zoek_signalen(conn, administratie_id, jaar, kwartaal)

    zonder_datum = _facturen_zonder_datum(conn, administratie_id)
    if zonder_datum:
        aangifte.waarschuwingen.append(
            f"er {'is' if zonder_datum == 1 else 'zijn'} {zonder_datum} "
            f"factu{'ur' if zonder_datum == 1 else 'ren'} zonder factuurdatum; "
            f"{'die valt' if zonder_datum == 1 else 'die vallen'} in geen enkel "
            f"kwartaal en tel{'t' if zonder_datum == 1 else 'len'} dus nergens mee"
        )

    schema = rekeningschema_voor_jaar(jaar)
    if schema is None:
        aangifte.redenen.append(
            f"er is geen rekeningschema voor boekjaar {jaar}; zonder schema is "
            f"niet te bepalen welke rekening welke rubriek is"
        )
        return aangifte

    aangifte.blokkades = zoek_blokkades(conn, administratie_id, van, tot)
    if aangifte.blokkades:
        aangifte.redenen.append(
            f"{len(aangifte.blokkades)} factu"
            f"{'ur' if len(aangifte.blokkades) == 1 else 'ren'} in dit kwartaal "
            f"{'is' if len(aangifte.blokkades) == 1 else 'zijn'} nog niet rond; "
            f"zolang dat zo is wordt er niets uitgerekend"
        )
        return aangifte

    boekingen = lees_boekingen(conn, administratie_id, van, tot)
    bedragen, voorbelasting = _tel_op(boekingen, schema)

    verschuldigd = bedragen["1a_btw"] + bedragen["1b_btw"]
    saldo = verschuldigd - voorbelasting

    if bedragen["buiten_1a_1b"] != NUL:
        aangifte.waarschuwingen.append(
            f"er staat {bedragen['buiten_1a_1b']} omzet in dit kwartaal zonder "
            f"btw (nultarief, vrijgesteld of verlegd). Die hoort in rubriek 1e, "
            f"2a of 3a, en die rubrieken zijn nog niet gebouwd — vul ze met de "
            f"hand aan"
        )

    aangifte.status = "voorstel"
    aangifte.aantal_boekingen = len(boekingen)
    aangifte.rubrieken = [
        Rubriek(
            code="1a", omschrijving="Leveringen/diensten belast met hoog tarief",
            grondslag=bedragen["1a_grondslag"], btw=bedragen["1a_btw"],
        ),
        Rubriek(
            code="1b", omschrijving="Leveringen/diensten belast met laag tarief",
            grondslag=bedragen["1b_grondslag"], btw=bedragen["1b_btw"],
        ),
    ]
    aangifte.verschuldigd = verschuldigd
    aangifte.voorbelasting = voorbelasting
    aangifte.saldo = saldo
    aangifte.saldo_richting = (
        "betalen" if saldo > NUL else "terugvragen" if saldo < NUL else "niets"
    )
    return aangifte
