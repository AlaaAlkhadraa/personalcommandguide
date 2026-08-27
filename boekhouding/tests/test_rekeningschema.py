"""Tests voor het rekeningschema per boekjaar.

Er kan alleen op een rekening uit het schema worden geboekt, en het
schema komt uit een config-bestand per jaar — niet uit de code.
"""

import json

import pytest

from boekhouding.rekeningschema import (
    CONFIG_MAP,
    KIESBARE_SOORTEN,
    SOORTEN,
    rekeningschema_voor_jaar,
)


def test_er_is_een_schema_voor_elk_jaar_met_btw_tarieven():
    """Zonder rekeningschema kan een factuur van dat jaar niet geboekt worden."""
    jaren = {
        int(pad.stem.split("_")[1])
        for pad in CONFIG_MAP.glob("btw_*.json")
    }
    for jaar in jaren:
        assert rekeningschema_voor_jaar(jaar) is not None, f"geen schema voor {jaar}"


def test_een_jaar_zonder_bestand_geeft_none():
    """Nooit het schema van een ander jaar gebruiken."""
    assert rekeningschema_voor_jaar(1999) is None


def test_elke_rekening_heeft_een_bekende_soort():
    schema = rekeningschema_voor_jaar(2026)
    for rekening in schema.rekeningen.values():
        assert rekening.soort in SOORTEN
        assert rekening.omschrijving.strip()
        assert rekening.rgs_code.strip()


def test_er_zijn_ongeveer_dertig_rekeningen():
    """Genoeg voor een zzp'er, klein genoeg om uit een lijst te kiezen."""
    schema = rekeningschema_voor_jaar(2026)
    assert 25 <= len(schema.rekeningen) <= 45


def test_alleen_kosten_en_opbrengsten_zijn_kiesbaar():
    """Bank, crediteuren en btw vult de boeking zelf in; die kies je niet."""
    schema = rekeningschema_voor_jaar(2026)
    for rekening in schema.kiesbaar():
        assert rekening.soort in KIESBARE_SOORTEN
    assert schema.zoek("1600").soort == "passiva"
    assert schema.zoek("1600") not in schema.kiesbaar()


def test_de_standaardrekeningen_bestaan_ook_echt():
    schema = rekeningschema_voor_jaar(2026)
    for naam in ("crediteuren", "debiteuren", "btw_voorbelasting"):
        code = schema.standaard(naam)
        assert schema.zoek(code) is not None, naam


def test_btw_rekening_per_tarief():
    schema = rekeningschema_voor_jaar(2026)
    assert schema.zoek(schema.btw_verschuldigd_voor("21")).soort == "btw"
    assert schema.zoek(schema.btw_verschuldigd_voor("9")).soort == "btw"
    # Bij 0% hoort geen btw-rekening, en bij een onbekend tarief ook niet:
    # dan wordt er geweigerd in plaats van gegokt.
    assert schema.btw_verschuldigd_voor("0") is None
    assert schema.btw_verschuldigd_voor("13") is None


def test_een_onbekende_code_bestaat_niet():
    assert rekeningschema_voor_jaar(2026).zoek("9999") is None


def test_dubbele_code_in_de_config_wordt_gemeld(tmp_path, monkeypatch):
    """Twee rekeningen met dezelfde code zou stil de een overschrijven."""
    import boekhouding.rekeningschema as mod

    origineel = json.loads((CONFIG_MAP / "rekeningen_2026.json").read_text("utf-8"))
    origineel["rekeningen"].append(dict(origineel["rekeningen"][0]))
    origineel["jaar"] = 2099
    (tmp_path / "rekeningen_2099.json").write_text(
        json.dumps(origineel), encoding="utf-8"
    )
    monkeypatch.setattr(mod, "CONFIG_MAP", tmp_path)
    mod.rekeningschema_voor_jaar.cache_clear()

    with pytest.raises(ValueError, match="twee keer"):
        mod.rekeningschema_voor_jaar(2099)
    mod.rekeningschema_voor_jaar.cache_clear()


def test_ontbrekende_standaardrekening_wordt_gemeld(tmp_path, monkeypatch):
    import boekhouding.rekeningschema as mod

    data = json.loads((CONFIG_MAP / "rekeningen_2026.json").read_text("utf-8"))
    data["standaardrekeningen"]["crediteuren"] = "0000"
    (tmp_path / "rekeningen_2098.json").write_text(json.dumps(data), encoding="utf-8")
    monkeypatch.setattr(mod, "CONFIG_MAP", tmp_path)
    mod.rekeningschema_voor_jaar.cache_clear()

    with pytest.raises(ValueError, match="standaardrekeningen"):
        mod.rekeningschema_voor_jaar(2098)
    mod.rekeningschema_voor_jaar.cache_clear()
