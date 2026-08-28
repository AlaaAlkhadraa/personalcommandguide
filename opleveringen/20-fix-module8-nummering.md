# Fix: twee tegelijk kunnen niet meer hetzelfde factuurnummer krijgen

Feedback: het factuurnummer wordt bepaald met `SELECT max(nummer_volg)` gevolgd
door een `UPDATE`, zonder slot. Twee gelijktijdige aanroepen van
`maak_definitief` geven dan hetzelfde nummer aan twee facturen.

Terecht, en het is inderdaad hard: een dubbel factuurnummer is precies wat niet
mag.

## Eén nuance vooraf

De `UNIQUE (administratie_id, nummer_jaar, nummer_volg)` stond er wél — in de
`CREATE TABLE` van `verkoopfacturen`. Maar dat helpt maar half:

- hij bereikt **geen bestaande database**, want SQLite kan een constraint niet
  met `ALTER TABLE` bijzetten;
- en een unieke constraint alléén lost de race niet op. Hij verhíndert het
  dubbele nummer, maar de tweede aanroep klapt er dan uit met een
  `IntegrityError` in plaats van gewoon het volgende nummer te krijgen.

Allebei je punten zijn dus alsnog gebouwd, en ze doen elk iets anders.

## 1. De unieke index, ook als migratie

```sql
CREATE UNIQUE INDEX IF NOT EXISTS idx_verkoopfacturen_nummer
    ON verkoopfacturen (administratie_id, nummer_jaar, nummer_volg);
```

Een index doet hetzelfde als de constraint en kán wél achteraf worden
toegevoegd. Hij draait mee in `maak_tabellen`, dus een database van vóór module
8 krijgt hem bij het eerste opstarten. NULL telt in een index als
"verschillend", dus concepten — die nog geen nummer hebben — botsen er niet op.
Daar zijn twee tests voor: één die de index droppt, `maak_tabellen` opnieuw
draait en controleert dat hij er weer is, en één die drie concepten naast
elkaar zet.

## 2. Het schrijfslot

Het toekennen gebeurt nu binnen één transactie die meteen het schrijfslot van
de database pakt:

```python
if not conn.in_transaction:
    conn.execute("BEGIN IMMEDIATE")

hoogste = conn.execute("SELECT max(nummer_volg) …").fetchone()[0]
volgnummer, factuurnummer = volgend_nummer(jaar, hoogste)
conn.execute("UPDATE verkoopfacturen SET … nummer_volg = ? …")
```

`BEGIN IMMEDIATE` neemt het slot bij de eerste regel in plaats van pas bij de
eerste schrijfactie. Een tweede aanroep blijft daar wachten (tot de timeout van
de verbinding, standaard vijf seconden) en leest daarna het nummer dat de
eerste net heeft weggeschreven. Het slot loopt door tot de boeking is
opgeslagen, want dat is één commit; mislukt de boeking, dan laat de rollback
het slot meteen los en is dat nummer ook niet gebruikt — de wachtende aanroep
krijgt het dan gewoon.

## De test, en wat hij bewijst

Twee threads met elk een eigen verbinding — net als twee verzoeken aan de
webinterface — die achter een `threading.Barrier` tegelijk losgaan op twee
klaargezette concepten. Daarna:

```python
assert nummers == ["2026-0001", "2026-0002"]
assert volgnummers == [1, 2]          # geen duplicaat en geen gat
```

Ik heb het slot er tijdelijk uit gehaald om te kijken of de test iets waard is.
Drie keer gedraaid, drie keer rood:

```
AssertionError: een thread liep vast: {1: ('2026-0001', [])}
```

De tweede thread haalt de finish niet, want de unieke index weigert zijn
nummer. Dat is precies het verschil tussen de twee maatregelen: zonder index
was het een dubbel nummer geweest, zonder slot is het een crash, en met allebei
is het gewoon 0001 en 0002.

## Tests

4 tests erbij (513 in totaal):

- twee threads tegelijk geven twee opeenvolgende nummers zonder gat;
- de database weigert een dubbel nummer, ook via rechtstreekse SQL;
- de unieke index komt er alsnog bij een bestaande database;
- concepten botsen niet op de index.

```
513 passed in 14.84s
```
