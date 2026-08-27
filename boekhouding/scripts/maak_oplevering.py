#!/usr/bin/env python3
"""Ververs de oplevering: CODE-COMPLEET.md en boekhouding-compleet.zip.

    python scripts/maak_oplevering.py

De map `opleveringen/` blijft plat: alleen genummerde rapporten plus de
drie vaste bestanden. Dit script maakt er twee van opnieuw, zodat ze na
elke taak echt bij de code passen en niet stilletjes verouderen:

- `CODE-COMPLEET.md` = de uitleg (README.md) plus alle broncode achter
  elkaar, zodat alles in één bestand te lezen is.
- `boekhouding-compleet.zip` = CLAUDE.md, de hele map `boekhouding/`
  (zonder rommel als __pycache__ en de lokale database) en alle
  rapporten uit `opleveringen/`.
"""

import sys
import zipfile
from pathlib import Path

BASIS = Path(__file__).resolve().parent.parent
WORTEL = BASIS.parent
OPLEVERINGEN = WORTEL / "opleveringen"

# De volgorde waarin de broncode in CODE-COMPLEET.md komt te staan:
# eerst de kern, dan de webinterface, dan de scripts en de tests.
BRONBESTANDEN = [
    "boekhouding/__init__.py",
    "boekhouding/btw_config.py",
    "boekhouding/models.py",
    "boekhouding/validatie.py",
    "boekhouding/rekeningschema.py",
    "boekhouding/documenten.py",
    "boekhouding/omgeving.py",
    "boekhouding/ubl.py",
    "boekhouding/routering.py",
    "boekhouding/ai_extractie.py",
    "boekhouding/verwerking.py",
    "boekhouding/database.py",
    "boekhouding/grootboek.py",
    "boekhouding/btw_aangifte.py",
    "boekhouding/web/__init__.py",
    "boekhouding/web/app.py",
    "boekhouding/web/ubl_weergave.py",
    "boekhouding/web/templates/basis.html",
    "boekhouding/web/templates/overzicht.html",
    "boekhouding/web/templates/upload.html",
    "boekhouding/web/templates/review.html",
    "boekhouding/web/templates/btw.html",
    "boekhouding/web/templates/fout.html",
    "boekhouding/config/btw_2024.json",
    "boekhouding/config/btw_2025.json",
    "boekhouding/config/btw_2026.json",
    "boekhouding/config/rekeningen_2024.json",
    "boekhouding/config/rekeningen_2025.json",
    "boekhouding/config/rekeningen_2026.json",
    "scripts/start_webinterface.py",
    "scripts/vul_testdata.py",
    "scripts/maak_oplevering.py",
    "scripts/handmatige_api_proef.py",
    "scripts/eval_extractie.py",
    "tests/genereer_testfacturen.py",
    "tests/genereer_ubl_testbestanden.py",
    "tests/testmateriaal/__init__.py",
    "tests/testmateriaal/pdf_schrijver.py",
    "tests/testmateriaal/bitmapfont.py",
    "tests/testmateriaal/jpeg_schrijver.py",
    "tests/conftest.py",
    "tests/test_schema.py",
    "tests/test_validatie.py",
    "tests/test_database.py",
    "tests/test_documenten.py",
    "tests/test_ai_extractie.py",
    "tests/test_eval_logica.py",
    "tests/test_ubl.py",
    "tests/test_ubl_weergave.py",
    "tests/test_rekeningschema.py",
    "tests/test_grootboek.py",
    "tests/test_btw_aangifte.py",
    "tests/test_web.py",
    "pytest.ini",
    "requirements.txt",
    ".gitignore",
    ".env.voorbeeld",
]

# Welk taalmerkje het codeblok krijgt, per extensie.
TAAL = {".py": "python", ".html": "html", ".json": "json", ".ini": "ini"}

# Wat nooit in het archief hoort: gecompileerde rommel, de lokale
# database met eigen gegevens, en een .env met een sleutel erin.
OVERSLAAN_MAPPEN = {"__pycache__", ".pytest_cache", "gegevens", ".git"}

# Wel in het archief, niet in CODE-COMPLEET.md: dit zijn testbestanden
# (facturen en hun grondwaarheid), geen code om te lezen.
GEEN_CODE = {"testfacturen"}
OVERSLAAN_NAMEN = {".env"}
OVERSLAAN_EXTENSIES = {".pyc", ".sqlite", ".db"}


def taal_van(pad: Path) -> str:
    return TAAL.get(pad.suffix, "")


def maak_code_compleet() -> Path:
    """Zet README.md en alle broncode in één bestand."""
    delen = [
        "# Volledige code — boekhoudsysteem, modules 1 t/m 5",
        "",
        "Branch `claude/nl-accounting-invoice-module-f2vzr3`. "
        "Wordt bij elke oplevering ververst.",
        "",
        (BASIS / "README.md").read_text(encoding="utf-8").rstrip(),
        "",
        "---",
        "",
        "# Broncode",
        "",
    ]

    ontbreekt = []
    for naam in BRONBESTANDEN:
        pad = BASIS / naam
        if not pad.is_file():
            ontbreekt.append(naam)
            continue
        delen.append(f"## `boekhouding/{naam}`")
        delen.append("")
        delen.append(f"```{taal_van(pad)}")
        delen.append(pad.read_text(encoding="utf-8").rstrip())
        delen.append("```")
        delen.append("")

    if ontbreekt:
        # Nooit stil een bestand overslaan: dan zou de bundel incompleet
        # zijn zonder dat iemand het ziet.
        print("LET OP, deze bestanden staan in de lijst maar bestaan niet:")
        for naam in ontbreekt:
            print(f"  {naam}")

    # Een nieuw bestand mag niet uit de bundel vallen omdat iemand vergat
    # het aan de lijst hierboven toe te voegen. Wat niet in de lijst
    # staat, komt er achteraan bij — met een melding, zodat het alsnog op
    # zijn plek gezet kan worden.
    vergeten = [
        pad for pad in sorted(BASIS.rglob("*"))
        if pad.is_file()
        and pad.suffix in TAAL
        and str(pad.relative_to(BASIS)) not in BRONBESTANDEN
        and not any(
            deel in OVERSLAAN_MAPPEN or deel in GEEN_CODE
            for deel in pad.relative_to(BASIS).parts
        )
    ]
    if vergeten:
        print("Deze bestanden stonden niet in de lijst en zijn achteraan gezet:")
        delen.append("## Nog niet ingedeeld")
        delen.append("")
        for pad in vergeten:
            naam = pad.relative_to(BASIS)
            print(f"  {naam}")
            delen.append(f"## `boekhouding/{naam}`")
            delen.append("")
            delen.append(f"```{taal_van(pad)}")
            delen.append(pad.read_text(encoding="utf-8").rstrip())
            delen.append("```")
            delen.append("")

    doel = OPLEVERINGEN / "CODE-COMPLEET.md"
    doel.write_text("\n".join(delen), encoding="utf-8")
    return doel


def hoort_erin(pad: Path) -> bool:
    if any(deel in OVERSLAAN_MAPPEN for deel in pad.parts):
        return False
    if pad.name in OVERSLAAN_NAMEN or pad.suffix in OVERSLAAN_EXTENSIES:
        return False
    return True


def maak_zip() -> Path:
    """Stop CLAUDE.md, de code en alle rapporten in één archief."""
    doel = OPLEVERINGEN / "boekhouding-compleet.zip"
    # Eerst opbouwen naast het doel, dan pas hernoemen: zo blijft er nooit
    # een half archief achter als er iets misgaat.
    tijdelijk = doel.with_suffix(".zip.tijdelijk")
    aantal = 0
    with zipfile.ZipFile(tijdelijk, "w", zipfile.ZIP_DEFLATED) as archief:
        archief.write(WORTEL / "CLAUDE.md", "CLAUDE.md")
        aantal += 1
        for pad in sorted(BASIS.rglob("*")):
            if not pad.is_file() or not hoort_erin(pad.relative_to(BASIS)):
                continue
            archief.write(pad, str(pad.relative_to(WORTEL)))
            aantal += 1
        for pad in sorted(OPLEVERINGEN.rglob("*")):
            if not pad.is_file() or pad.name == doel.name or pad == tijdelijk:
                continue
            archief.write(pad, str(pad.relative_to(WORTEL)))
            aantal += 1
    tijdelijk.replace(doel)
    print(f"{aantal} bestanden in het archief")
    return doel


def main() -> int:
    code = maak_code_compleet()
    print(f"{code.relative_to(WORTEL)}  ({code.stat().st_size // 1024} kB)")
    archief = maak_zip()
    print(f"{archief.relative_to(WORTEL)}  ({archief.stat().st_size // 1024} kB)")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
