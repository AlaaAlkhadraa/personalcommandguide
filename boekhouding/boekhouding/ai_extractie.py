"""AI-extractie van factuurgegevens (module 3).

Het model leest de factuur en vult alleen in wat het letterlijk ziet.
Daarna doet de code de rest: alle controles komen uit module 1, en niets
wordt geboekt zonder dat een mens ernaar heeft gekeken.

AI-module regels die hier gelden:
- Structured output via een JSON-schema; nooit vrije tekst (regel 1).
- Verplicht veld "zekerheid" per uitgelezen veld; bij lage zekerheid een
  reden. Eén veld met lage zekerheid → de hele factuur naar review.
- Het model vult NOOIT een veld in dat het niet ziet: dan null, en de
  factuur gaat naar review. Er wordt nooit gegokt (Gouden regel 4).
- Het model rekent niet. Bedragen worden overgenomen zoals ze op de
  factuur staan; optellen en btw controleren doet valideer_factuur
  (Gouden regel 2).

Twee invoerpaden:
A. PDF met tekstlaag → de uitgelezen tekst gaat naar het model.
B. Afbeelding of gescande PDF → het document zelf gaat mee als beeld.
"""

import base64
import json
from pathlib import Path
from typing import Any, Literal, Optional

from pydantic import BaseModel, model_validator

from .documenten import extensie_van, lees_pdf_tekst
from .models import Factuur
from .omgeving import SLEUTELNAAM, api_sleutel, instelling
from .validatie import valideer_factuur

# Het model is instelbaar. De volgorde is: wat de aanroeper meegeeft,
# anders ANTHROPIC_MODEL uit .env, anders dit standaardmodel. Zo kan de
# eval een goedkoper model ernaast leggen zonder code te wijzigen.
STANDAARD_MODEL = "claude-opus-5"
MODELNAAM_INSTELLING = "ANTHROPIC_MODEL"
MAX_TOKENS = 16000

# Versie van de systeemprompt. Hoog dit op zodra SYSTEEM_PROMPT wijzigt:
# het staat bij elke extractie in de audit trail, zodat later te zien is
# met welke instructie een factuur is uitgelezen.
PROMPT_VERSIE = "v1"

# Welke bestandssoort langs welk pad gaat.
BEELD_MEDIATYPEN = {
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
    ".png": "image/png",
}

VELDEN = (
    "leverancier",
    "factuurdatum",
    "factuurnummer",
    "bedrag_excl",
    "btw_percentage",
    "btw_bedrag",
    "bedrag_incl",
)

SYSTEEM_PROMPT = """\
Je leest Nederlandse inkoopfacturen voor een boekhoudsysteem van een \
zzp'er. Je vult een vast formulier in en doet verder niets.

Harde regels:
1. Vul alleen in wat je letterlijk op het document ziet staan. Zie je een \
veld niet, dan is de waarde null. Verzin nooit een waarde, leid nooit een \
waarde af uit een ander veld en gebruik nooit een standaardwaarde.
2. Reken niet. Neem bedragen exact over zoals ze op de factuur staan, \
inclusief de Nederlandse schrijfwijze (bijvoorbeeld "1.250,00"). Bereken \
geen btw, geen totaal en geen subtotaal. Een ander programma controleert \
de sommen.
3. Geef per veld een zekerheid: "hoog" of "laag". Gebruik "laag" zodra je \
twijfelt: onscherpe tekst, meerdere kandidaten op het document, een \
onduidelijke schrijfwijze, of een veld dat je maar half ziet. Bij "laag" \
schrijf je in "reden" in één zin waarom, in het Nederlands.
4. Twijfel je of een veld er überhaupt staat, dan is de waarde null met \
zekerheid "laag" en een reden. Liever null dan een gok.

Wat de velden betekenen:
- leverancier: de naam van het bedrijf dat de factuur stuurt (de \
afzender), niet de klant die hem ontvangt.
- factuurdatum: de datum die bij "Factuurdatum" staat, niet de \
vervaldatum. Schrijf hem als JJJJ-MM-DD. Dat is alleen een andere \
notatie van dezelfde datum; kun je niet zien of 03-04-2026 3 april of \
4 maart is, dan is de zekerheid "laag".
- factuurnummer: het nummer van deze factuur, zoals het er staat.
- bedrag_excl: het subtotaal exclusief btw.
- btw_percentage: alleen het getal, dus "21", "9" of "0".
- btw_bedrag: het btw-bedrag zoals het op de factuur staat.
- bedrag_incl: het totaal inclusief btw.
"""

VRAAG_TEKST = (
    "Hieronder staat de tekst van een factuur. Vul het formulier in "
    "volgens de regels.\n\n--- begin factuurtekst ---\n{tekst}\n"
    "--- einde factuurtekst ---"
)
VRAAG_BEELD = (
    "Hierboven staat een afbeelding of scan van een factuur. Vul het "
    "formulier in volgens de regels. Kun je iets niet goed lezen, dan is "
    "de zekerheid van dat veld 'laag' met een reden."
)


class VeldExtractie(BaseModel):
    """Eén uitgelezen veld, met hoe zeker het model erover is."""

    waarde: Optional[str] = None
    zekerheid: Literal["hoog", "laag"]
    reden: Optional[str] = None

    @model_validator(mode="after")
    def reden_verplicht_bij_lage_zekerheid(self) -> "VeldExtractie":
        if self.zekerheid == "laag" and not (self.reden or "").strip():
            raise ValueError("bij zekerheid 'laag' is een reden verplicht")
        return self


class FactuurExtractie(BaseModel):
    """Het formulier dat het model invult: elk factuurveld met zekerheid."""

    leverancier: VeldExtractie
    factuurdatum: VeldExtractie
    factuurnummer: VeldExtractie
    bedrag_excl: VeldExtractie
    btw_percentage: VeldExtractie
    btw_bedrag: VeldExtractie
    bedrag_incl: VeldExtractie


class ExtractieResultaat(BaseModel):
    """Wat er uit een extractie komt, inclusief alles voor de audit trail."""

    status: Literal["gevalideerd", "review_nodig"]
    redenen: list[str] = []
    factuur: Optional[Factuur] = None
    extractie: Optional[FactuurExtractie] = None
    model: str = ""
    prompt_versie: str = PROMPT_VERSIE
    invoer_tokens: int = 0
    uitvoer_tokens: int = 0
    invoerpad: Optional[Literal["tekst", "beeld"]] = None
    ruwe_respons: str = ""
    bestandsnaam: str = ""


def standaard_model(env_pad: str | Path = ".env") -> str:
    """Welk model er gebruikt wordt als de aanroeper niets meegeeft.

    Zet ANTHROPIC_MODEL in .env om een ander model te kiezen, bijvoorbeeld
    om in de eval een goedkoper model ernaast te leggen.
    """
    return instelling(MODELNAAM_INSTELLING, STANDAARD_MODEL, env_pad)


def maak_client(env_pad: str | Path = ".env"):
    """Bouw een Anthropic-client met de sleutel uit .env.

    De sleutel wordt aan de client meegegeven en verder nergens bewaard,
    getoond of gelogd. Ontbreekt hij, dan volgt een duidelijke fout
    zonder de waarde te noemen (die is er immers niet).
    """
    sleutel = api_sleutel(env_pad)
    if sleutel is None:
        raise RuntimeError(
            f"{SLEUTELNAAM} is niet ingesteld. Zet hem in een .env-bestand "
            f"naast deze map (zie .env.voorbeeld). Dat bestand staat in "
            f".gitignore en hoort daar te blijven."
        )
    import anthropic  # pas hier importeren: tests draaien zonder de SDK

    return anthropic.Anthropic(api_key=sleutel)


def bepaal_invoerpad(pad: str | Path) -> tuple[Optional[str], Optional[str]]:
    """Kies pad A (tekst) of pad B (beeld); geef (invoerpad, reden-bij-fout).

    Eerst de bestandssoort, dan pas de inhoud: een JPG is geen kapotte
    PDF maar gewoon een plaatje, en hoort meteen langs het beeldpad.
    """
    pad = Path(pad)
    if not pad.is_file():
        return None, f"bestand niet gevonden: {pad}"

    extensie = extensie_van(pad)
    if extensie is None:
        gevonden = pad.suffix.lower() or "geen"
        return None, (
            f"bestandssoort '{gevonden}' wordt niet gelezen; "
            f"toegestaan: .pdf, .jpg, .jpeg, .png"
        )

    if extensie in BEELD_MEDIATYPEN:
        return "beeld", None

    # PDF: heeft hij een tekstlaag, dan is dat de betrouwbaarste bron.
    return ("tekst" if lees_pdf_tekst(pad).status == "gelezen" else "beeld"), None


def bouw_inhoud(pad: str | Path, invoerpad: str) -> list[dict[str, Any]]:
    """Zet het document om naar de inhoudsblokken voor het model."""
    pad = Path(pad)
    if invoerpad == "tekst":
        tekst = lees_pdf_tekst(pad).tekst
        return [{"type": "text", "text": VRAAG_TEKST.format(tekst=tekst)}]

    gegevens = base64.standard_b64encode(pad.read_bytes()).decode("ascii")
    extensie = extensie_van(pad)
    if extensie in BEELD_MEDIATYPEN:
        blok = {
            "type": "image",
            "source": {
                "type": "base64",
                "media_type": BEELD_MEDIATYPEN[extensie],
                "data": gegevens,
            },
        }
    else:
        # Gescande PDF: als document meesturen, dan leest het model de
        # pagina's als beeld.
        blok = {
            "type": "document",
            "source": {
                "type": "base64",
                "media_type": "application/pdf",
                "data": gegevens,
            },
        }
    return [blok, {"type": "text", "text": VRAAG_BEELD}]


def _tokens(respons: Any) -> tuple[int, int]:
    """Lees het tokenverbruik uit het antwoord, als de SDK dat meegeeft."""
    verbruik = getattr(respons, "usage", None)
    if verbruik is None:
        return 0, 0
    return (
        int(getattr(verbruik, "input_tokens", 0) or 0),
        int(getattr(verbruik, "output_tokens", 0) or 0),
    )


def _ruwe_tekst(respons: Any, extractie: Optional[FactuurExtractie]) -> str:
    """Haal de letterlijke modelrespons op voor de audit trail."""
    stukken = []
    for blok in getattr(respons, "content", []) or []:
        if getattr(blok, "type", None) == "text":
            stukken.append(blok.text)
    if stukken:
        return "\n".join(stukken)
    if extractie is not None:
        return extractie.model_dump_json()
    return ""


def beoordeel_extractie(
    extractie: FactuurExtractie, *, vandaag=None, is_duplicaat=None
) -> tuple[str, list[str], Optional[Factuur]]:
    """Zet een extractie om in een status, redenen en een nette factuur.

    Twee soorten redenen komen samen: wat het model zelf aangeeft
    (ontbrekend veld of lage zekerheid, met prefix "extractie:") en wat
    de rekencontroles van module 1 vinden. De AI rekent niet mee.
    """
    redenen: list[str] = []
    data: dict[str, Any] = {}

    for veld in VELDEN:
        gegeven: VeldExtractie = getattr(extractie, veld)
        if gegeven.waarde is None or not str(gegeven.waarde).strip():
            reden = (gegeven.reden or "").strip()
            staart = f" — {reden}" if reden else ""
            redenen.append(
                f"extractie: {veld} niet op het document gevonden{staart}"
            )
            continue

        if gegeven.zekerheid == "laag":
            redenen.append(
                f"extractie: {veld} met lage zekerheid gelezen als "
                f"'{gegeven.waarde}' — {gegeven.reden}"
            )
        data[veld] = gegeven.waarde

    # Alle rekenregels en datumcontroles blijven van module 1.
    resultaat = valideer_factuur(data, vandaag=vandaag, is_duplicaat=is_duplicaat)
    redenen.extend(resultaat.redenen)

    status = "gevalideerd" if not redenen else "review_nodig"
    return status, redenen, resultaat.factuur


def foutreden(fout: BaseException) -> str:
    """Vertaal een fout van de API naar een reden in gewone taal.

    We kijken naar `status_code` in plaats van naar de fouttypes van de
    SDK: elke APIStatusError van anthropic draagt dat veld, en zo werkt
    deze functie ook als de SDK niet geïnstalleerd is (in de tests).
    De boodschap zegt er steeds bij of het zin heeft om het later nog
    eens te proberen — dat scheelt de eigenaar zoekwerk.
    """
    code = getattr(fout, "status_code", None)
    soort = type(fout).__name__

    if code == 429:
        return (
            "te veel verzoeken achter elkaar (rate limit); "
            "deze factuur is niet uitgelezen — later opnieuw proberen"
        )
    if code in (401, 403):
        return (
            "geen toegang met deze API-sleutel; controleer de sleutel "
            "in .env (de factuur is niet uitgelezen)"
        )
    if code == 404:
        return (
            "het opgegeven model bestaat niet of is niet beschikbaar "
            "(de factuur is niet uitgelezen)"
        )
    if code == 400:
        return (
            f"de dienst wees het verzoek af als ongeldig ({soort}); "
            f"dit is een fout in het verzoek, niet in de factuur"
        )
    if isinstance(code, int) and code >= 500:
        return (
            f"de dienst gaf een serverfout ({code}); deze factuur is "
            f"niet uitgelezen — later opnieuw proberen"
        )
    if isinstance(code, int):
        return f"de dienst gaf foutcode {code}; deze factuur is niet uitgelezen"

    # Geen HTTP-antwoord: netwerk eruit, tijdslimiet, DNS, enzovoort.
    return (
        f"geen verbinding met de dienst ({soort}: {fout}); deze factuur "
        f"is niet uitgelezen — later opnieuw proberen"
    )


def extraheer_factuur(
    pad: str | Path,
    *,
    client: Any = None,
    model: Optional[str] = None,
    vandaag=None,
    is_duplicaat=None,
    env_pad: str | Path = ".env",
) -> ExtractieResultaat:
    """Lees een factuurdocument uit met het model en beoordeel het.

    Geeft altijd een resultaat terug, nooit een exception door een
    onleesbaar document of een weigerend model: dan volgt review_nodig
    met reden.

    `client` is bedoeld om er in tests een nagemaakte client in te
    hangen; laat je hem weg, dan wordt de echte client gebouwd.
    """
    pad = Path(pad)
    model = model or standaard_model(env_pad)
    invoerpad, fout = bepaal_invoerpad(pad)
    if invoerpad is None:
        return ExtractieResultaat(
            status="review_nodig",
            redenen=[fout or "document kon niet worden gelezen"],
            model=model,
            bestandsnaam=pad.name,
        )

    if client is None:
        # Ook dit hoort geen exception te worden: draait de webinterface
        # zonder sleutel, dan moet de factuur ter review komen en niet
        # het hele scherm omvallen (Gouden regel 4).
        try:
            client = maak_client(env_pad)
        except Exception as fout:
            return ExtractieResultaat(
                status="review_nodig",
                redenen=[str(fout)],
                model=model,
                invoerpad=invoerpad,
                bestandsnaam=pad.name,
            )

    # Alles wat hier misgaat wordt een reden, nooit een exception: een
    # rate limit of een netwerkstoring mag het verwerken van een stapel
    # facturen niet afbreken (Gouden regel 4).
    try:
        respons = client.messages.parse(
            model=model,
            max_tokens=MAX_TOKENS,
            system=SYSTEEM_PROMPT,
            messages=[{"role": "user", "content": bouw_inhoud(pad, invoerpad)}],
            output_format=FactuurExtractie,
        )
    except Exception as fout:
        return ExtractieResultaat(
            status="review_nodig",
            redenen=[foutreden(fout)],
            model=model,
            invoerpad=invoerpad,
            bestandsnaam=pad.name,
        )

    # Het model kan een verzoek weigeren; dan is er geen inhoud om te
    # lezen. Nooit doorgaan alsof er wel iets stond.
    if getattr(respons, "stop_reason", None) == "refusal":
        return ExtractieResultaat(
            status="review_nodig",
            redenen=["het model heeft dit document geweigerd te verwerken"],
            model=model,
            invoerpad=invoerpad,
            ruwe_respons=_ruwe_tekst(respons, None),
            bestandsnaam=pad.name,
        )

    extractie = getattr(respons, "parsed_output", None)
    if extractie is None:
        return ExtractieResultaat(
            status="review_nodig",
            redenen=["het model gaf geen bruikbaar formulier terug"],
            model=model,
            invoerpad=invoerpad,
            ruwe_respons=_ruwe_tekst(respons, None),
            bestandsnaam=pad.name,
        )

    status, redenen, factuur = beoordeel_extractie(
        extractie, vandaag=vandaag, is_duplicaat=is_duplicaat
    )
    invoer_tokens, uitvoer_tokens = _tokens(respons)
    return ExtractieResultaat(
        status=status,
        redenen=redenen,
        factuur=factuur,
        extractie=extractie,
        model=model,
        invoerpad=invoerpad,
        ruwe_respons=_ruwe_tekst(respons, extractie),
        invoer_tokens=invoer_tokens,
        uitvoer_tokens=uitvoer_tokens,
        bestandsnaam=pad.name,
    )
