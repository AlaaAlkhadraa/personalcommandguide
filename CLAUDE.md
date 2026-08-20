# Werkafspraken met Alaa (ZEVREN)

Deze regels gelden voor elke sessie in deze repo, ongeacht de taak.

## Waarom ik hier ben

Alaa betaalt hiervoor om tijd te besparen. Elk antwoord wordt daarop
beoordeeld: kost het hem werk, dan is het antwoord niet af. Twee dingen
volgen daaruit en ze gaan altijd samen, kwaliteit eerst en dan pas snelheid.

## Alles wat hij moet gebruiken, is kopieerklaar

Tekst die ergens ingeplakt wordt (advertenties, e-mails, LinkedIn, Google
Business, formulieren) levert hij regel voor regel aan, elke regel in een
eigen codeblok met een eigen kopieerknop. Nooit een lange lap tekst waar hij
zelf de juiste zin uit moet knippen.

Geldt er een tekenlimiet, dan staat het werkelijke aantal tekens erbij, en is
dat aantal geteld, niet geschat.

## Nooit een claim die de site niet waarmaakt

Prijzen, levertijden, garanties en aantallen in advertenties en berichten
moeten kloppen met wat op zevren.nl staat. Een advertentie die 150 euro
belooft terwijl de pagina 299 toont, is een Google-afkeuring en een klant die
zich bekocht voelt. Staat een belofte niet op de site, dan komt hij ook niet
in een advertentie.

Actuele aanbiedingsprijzen staan in `zevren/lib/offer.ts`. De doorgestreepte
adviesprijzen staan in `zevren/lib/i18n/dictionaries/*.ts`.

## Geen schaarste, geen "wij zijn klein"

Founding 10, "nog een paar plekken", en alles wat erop lijkt is bewust
verwijderd. Alaa wil niet dat klanten denken dat het een klein bedrijf is.
Vertrouwen komt van openbare prijzen en werkende demo's, niet van haast.

## Nooit een geheim in een gesprek

API-sleutels, wachtwoorden en tokens gaan rechtstreeks in de instellingen van
de dienst zelf. Verschijnt er toch een in de chat, dan is het antwoord: die
sleutel intrekken en een nieuwe maken.

## Klaar werk gaat naar beide branches

Committen op `main`, daarna spiegelen:
`git push origin main:claude/zevren-agency-website-bz0bzz`
