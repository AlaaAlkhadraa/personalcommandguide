#!/usr/bin/env python3
"""Genereer synthetische bankafschriften voor de tests van module 7.

    python tests/genereer_banktestbestanden.py

Vier bestanden in tests/testfacturen/bank/, deterministisch en zonder
internet:

    01-mt940-ing.sta          MT940 met vier regels, Nederlandse opmaak
    02-camt053.xml            hetzelfde afschrift als CAMT.053 (XML)
    03-mt940-kapotte-regel.sta  één onleesbare regel, de rest klopt
    04-geen-afschrift.txt     geen bankbestand; hoort geweigerd te worden

De bedragen sluiten aan op de UBL-testfacturen, zodat het afletteren op
echte gevallen getest kan worden: een exacte match op factuurnummer, een
betaling waarvan alleen het bedrag klopt, een deelbetaling en een
verzamelbetaling.
"""

import sys
from pathlib import Path

BASIS = Path(__file__).resolve().parent
DOEL = BASIS / "testfacturen" / "bank"

MT940 = """:20:250701ING
:25:NL91INGB0417164300 EUR
:28C:1/1
:60F:C260701EUR2500,00
:61:2607010701D484,00N123EF-2026-0101//INGB0001
:86:/TRTP/SEPA OVERBOEKING/IBAN/NL02VDIJ0123456789/BIC/INGBNL2A/NAME/Van Dijk ICT-diensten/EREF/EF-2026-0101/REMI/Factuur EF-2026-0101 onderhoud juli
:61:2607050705C2904,00N123NOTPROVIDED//INGB0002
:86:/TRTP/SEPA OVERBOEKING/IBAN/NL44RABO0123456789/NAME/Alkhadraa Advies/REMI/Betaling factuur V-2026-014
:61:2607080708D272,50N123NONREF//INGB0003
:86:/TRTP/SEPA OVERBOEKING/IBAN/NL18BAKK0123456789/NAME/Bakkerij de Korenaar/REMI/Bestelling week 28
:61:2607120712D75,00N123NONREF//INGB0004
:86:/TRTP/SEPA INCASSO/IBAN/NL30KPNN0123456789/NAME/KPN B.V./REMI/Maandnota telefonie juli
:62F:C260731EUR4627,00
"""

MT940_KAPOT = """:20:250801ING
:25:NL91INGB0417164300 EUR
:28C:2/1
:60F:C260801EUR1000,00
:61:2608010801D242,00N123EF-2026-0102//INGB0101
:86:/TRTP/SEPA OVERBOEKING/IBAN/NL02VDIJ0123456789/NAME/Van Dijk ICT-diensten/REMI/Factuur EF-2026-0102
:61:dit is geen geldige boekingsregel
:86:/TRTP/ONBEKEND/REMI/hier hoort niets van terecht te komen
:61:2608050805C500,00N123NONREF//INGB0103
:86:/TRTP/SEPA OVERBOEKING/IBAN/NL44RABO0123456789/NAME/Alkhadraa Advies/REMI/Deelbetaling V-2026-015
:62F:C260831EUR1258,00
"""

GEEN_AFSCHRIFT = """Beste Alaa,

Hierbij het overzicht van juli. De bedragen staan in de bijlage.

Met vriendelijke groet,
Van Dijk ICT-diensten
"""


def camt_regel(
    referentie: str, bedrag: str, richting: str, datum: str,
    iban: str, naam: str, omschrijving: str, kenmerk: str,
) -> str:
    return f"""    <Ntry>
      <Amt Ccy="EUR">{bedrag}</Amt>
      <CdtDbtInd>{richting}</CdtDbtInd>
      <Sts>BOOK</Sts>
      <BookgDt><Dt>{datum}</Dt></BookgDt>
      <ValDt><Dt>{datum}</Dt></ValDt>
      <AcctSvcrRef>{referentie}</AcctSvcrRef>
      <NtryDtls>
        <TxDtls>
          <Refs><EndToEndId>{kenmerk}</EndToEndId></Refs>
          <RltdPties>
            <{"Cdtr" if richting == "DBIT" else "Dbtr"}><Nm>{naam}</Nm></{"Cdtr" if richting == "DBIT" else "Dbtr"}>
            <{"Cdtr" if richting == "DBIT" else "Dbtr"}Acct><Id><IBAN>{iban}</IBAN></Id></{"Cdtr" if richting == "DBIT" else "Dbtr"}Acct>
          </RltdPties>
          <RmtInf><Ustrd>{omschrijving}</Ustrd></RmtInf>
        </TxDtls>
      </NtryDtls>
    </Ntry>
"""


CAMT_REGELS = [
    camt_regel("INGB0001", "484.00", "DBIT", "2026-07-01",
               "NL02VDIJ0123456789", "Van Dijk ICT-diensten",
               "Factuur EF-2026-0101 onderhoud juli", "EF-2026-0101"),
    camt_regel("INGB0002", "2904.00", "CRDT", "2026-07-05",
               "NL44RABO0123456789", "Alkhadraa Advies",
               "Betaling factuur V-2026-014", "NOTPROVIDED"),
    camt_regel("INGB0003", "272.50", "DBIT", "2026-07-08",
               "NL18BAKK0123456789", "Bakkerij de Korenaar",
               "Bestelling week 28", "NOTPROVIDED"),
    camt_regel("INGB0004", "75.00", "DBIT", "2026-07-12",
               "NL30KPNN0123456789", "KPN B.V.",
               "Maandnota telefonie juli", "NOTPROVIDED"),
]

CAMT = f"""<?xml version="1.0" encoding="UTF-8"?>
<Document xmlns="urn:iso:std:iso:20022:tech:xsd:camt.053.001.02">
  <BkToCstmrStmt>
    <GrpHdr>
      <MsgId>AFSCHRIFT-2026-07</MsgId>
      <CreDtTm>2026-08-01T06:00:00</CreDtTm>
    </GrpHdr>
    <Stmt>
      <Id>NL91INGB0417164300-2026-07</Id>
      <Acct><Id><IBAN>NL91INGB0417164300</IBAN></Id><Ccy>EUR</Ccy></Acct>
      <Bal>
        <Tp><CdOrPrtry><Cd>OPBD</Cd></CdOrPrtry></Tp>
        <Amt Ccy="EUR">2500.00</Amt>
        <CdtDbtInd>CRDT</CdtDbtInd>
        <Dt><Dt>2026-07-01</Dt></Dt>
      </Bal>
{"".join(CAMT_REGELS)}    </Stmt>
  </BkToCstmrStmt>
</Document>
"""

BESTANDEN = {
    "01-mt940-ing.sta": MT940,
    "02-camt053.xml": CAMT,
    "03-mt940-kapotte-regel.sta": MT940_KAPOT,
    "04-geen-afschrift.txt": GEEN_AFSCHRIFT,
}


def main() -> int:
    DOEL.mkdir(parents=True, exist_ok=True)
    for naam, inhoud in BESTANDEN.items():
        pad = DOEL / naam
        pad.write_text(inhoud, encoding="utf-8", newline="\n")
        print(f"  {naam:<28} {pad.stat().st_size:>6} bytes")
    print(f"\n{len(BESTANDEN)} bestanden in {DOEL}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
