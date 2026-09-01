/**
 * The local landing pages: one per city, targeting the search
 * "website laten maken <stad>".
 *
 * Every intro is written by hand and says something different, because
 * sixteen pages that only swap the city name are doorway pages and Google
 * treats them accordingly. Nothing here claims local clients or a local
 * office we do not have: the studio is in Maastricht, the work is remote,
 * and the pages say so.
 */

export interface City {
  slug: string;
  name: string;
  province: string;
  /** Two to four sentences, unique per city, shown under the H1. */
  intro: string;
  metaDescription: string;
}

export const CITIES: City[] = [
  {
    slug: "maastricht",
    name: "Maastricht",
    province: "Limburg",
    intro:
      "ZEVREN is gevestigd in Maastricht, dus dit is de enige stad waar een kennismaking ook gewoon aan een tafel kan. Voor ondernemers hier geldt verder hetzelfde als overal: de prijzen staan op de site, de demo's werken echt, en je weet wat je krijgt voordat we beginnen.",
    metaDescription:
      "Webstudio in Maastricht. Websites vanaf 299 euro, prijzen staan online, demo's die echt werken. Kennismaken kan in de stad zelf.",
  },
  {
    slug: "heerlen",
    name: "Heerlen",
    province: "Limburg",
    intro:
      "Heerlen zit op een half uur van onze studio in Maastricht, en dat halfuur hoef je nooit af te leggen: het hele traject loopt online, van eerste gesprek tot livegang. Wat je vooraf wél kunt doen is onze demo's doorklikken en de prijzen lezen, die staan er allemaal.",
    metaDescription:
      "Website laten maken in Heerlen? Vaste prijzen vanaf 299 euro, werkende demo's, gebouwd vanuit Maastricht. Het hele traject loopt online.",
  },
  {
    slug: "sittard-geleen",
    name: "Sittard-Geleen",
    province: "Limburg",
    intro:
      "Tussen Sittard, Geleen en Born zit een dichtheid aan zelfstandigen en klusbedrijven waar een vindbare website het verschil maakt tussen gebeld worden en overgeslagen worden. Wij bouwen die site vanuit Maastricht, twintig minuten verderop, met de prijs vooraf op tafel.",
    metaDescription:
      "Website laten maken in Sittard-Geleen. Vaste prijzen vanaf 299 euro, ontworpen en gebouwd in Limburg, alles online geregeld.",
  },
  {
    slug: "roermond",
    name: "Roermond",
    province: "Limburg",
    intro:
      "Roermond leeft van bezoekers die eerst zoeken en dan pas komen, en dat geldt net zo hard voor de zaken buiten het outlet: wie niet gevonden wordt, bestaat voor die bezoeker niet. Een eigen site met je werk, je tijden en je prijzen is daarvoor de basis, en bij ons weet je vooraf wat die kost.",
    metaDescription:
      "Website laten maken in Roermond? Websites en webshops met openbare prijzen vanaf 299 euro, gebouwd door een Limburgse studio.",
  },
  {
    slug: "venlo",
    name: "Venlo",
    province: "Limburg",
    intro:
      "Venlo is logistiek en handel, en handel gunt men aan wie er verzorgd uitziet. Een verouderde of ontbrekende site kost hier stilletjes offertes. Wij bouwen websites en webshops met de prijs gewoon op de pagina, zodat je die rekensom vooraf kunt maken.",
    metaDescription:
      "Website of webshop laten maken in Venlo. Vaste prijzen, vanaf 299 euro, webshop 899 euro. Bekijk eerst de werkende demo's.",
  },
  {
    slug: "weert",
    name: "Weert",
    province: "Limburg",
    intro:
      "In een stad als Weert komt nieuw werk vooral via twee routes binnen: mond-tot-mond en de zoekmachine. De eerste heb je zelf in de hand, voor de tweede bouwen wij de site. Vanuit Maastricht, volledig online, met vaste prijzen die op de site staan.",
    metaDescription:
      "Website laten maken in Weert? Vaste prijzen vanaf 299 euro, geen offertetraject, demo's die je zelf kunt proberen.",
  },
  {
    slug: "eindhoven",
    name: "Eindhoven",
    province: "Noord-Brabant",
    intro:
      "In Eindhoven is de lat hoog: je klanten zien dagelijks het werk van de technologiebedrijven om de hoek, en jouw site wordt daaraan afgemeten. Wij bouwen met dezelfde moderne techniek (Next.js), maar tegen een prijs die voor een eenmanszaak klopt en die vooraf vaststaat.",
    metaDescription:
      "Website laten maken in Eindhoven. Modern gebouwd met Next.js, vaste prijzen vanaf 299 euro, werkende demo's om zelf te proberen.",
  },
  {
    slug: "tilburg",
    name: "Tilburg",
    province: "Noord-Brabant",
    intro:
      "Tilburg heeft een van de jongste ondernemersbestanden van het land, en jonge zaken hebben zelden tijd én budget voor een lang offertetraject. Daarom staat bij ons alles vooraf vast: de prijs op de site, een demo om te proberen, en een oplevering waar je niet achteraan hoeft te bellen.",
    metaDescription:
      "Website laten maken in Tilburg? Vaste prijzen vanaf 299 euro, geen offertes, geen verrassingen. Volledig online geregeld.",
  },
  {
    slug: "breda",
    name: "Breda",
    province: "Noord-Brabant",
    intro:
      "Van horeca in het centrum tot hoveniers in de dorpen eromheen: in Breda wordt werk gegund op zicht. Een site die je afgeronde werk laat zien doet dat gunnen voor jou, ook 's avonds. Wij bouwen hem op afstand, met de prijs vooraf op de pagina.",
    metaDescription:
      "Website laten maken in Breda. Laat je werk zien met een site met vaste prijs, vanaf 299 euro. Demo's staan online.",
  },
  {
    slug: "den-bosch",
    name: "Den Bosch",
    province: "Noord-Brabant",
    intro:
      "Den Bosch is een stad van dienstverleners, en dienstverleners worden vergeleken voordat ze gebeld worden. De vergelijking gebeurt online, meestal buiten kantoortijd. Een verzorgde site met duidelijke prijzen wint die vergelijking; wij bouwen hem met onze eigen prijzen net zo open op tafel.",
    metaDescription:
      "Website laten maken in Den Bosch? Duidelijke pakketten met openbare prijzen vanaf 299 euro. Volledig online, snel geregeld.",
  },
  {
    slug: "nijmegen",
    name: "Nijmegen",
    province: "Gelderland",
    intro:
      "Nijmegen kijkt kritisch, dus zeggen we precies wat je krijgt: een site die vanaf nul rond jouw zaak wordt ontworpen, geen template met je logo erop. Wat het kost staat op de site, en onze demo's kun je doorklikken voordat je ons ook maar een mail stuurt.",
    metaDescription:
      "Website laten maken in Nijmegen. Geen templates: ontworpen rond jouw zaak, met vaste prijzen vanaf 299 euro.",
  },
  {
    slug: "arnhem",
    name: "Arnhem",
    province: "Gelderland",
    intro:
      "Arnhem is een stad van makers en ateliers, en makers verkopen op beeld. Een site die je werk groot en scherp laat zien is voor jou geen luxe maar gereedschap. Wij bouwen hem op afstand en rekenen daarvoor de prijs die op onze site staat, niet de prijs die uit een offerte komt.",
    metaDescription:
      "Website laten maken in Arnhem? Sites die je werk laten zien, met vaste prijzen vanaf 299 euro. Bekijk de demo's online.",
  },
  {
    slug: "utrecht",
    name: "Utrecht",
    province: "Utrecht",
    intro:
      "In Utrecht is de concurrentie per branche misschien wel de hoogste van het land, en juist dan telt de eerste indruk online. Wij bouwen sites die snel laden en er serieus uitzien, tegen prijzen die openbaar zijn, zodat je ons kunt vergelijken zoals jouw klanten jou vergelijken.",
    metaDescription:
      "Website laten maken in Utrecht. Snel, modern, met openbare prijzen vanaf 299 euro. Vergelijk gerust: onze demo's staan online.",
  },
  {
    slug: "rotterdam",
    name: "Rotterdam",
    province: "Zuid-Holland",
    intro:
      "Rotterdam heeft geen geduld voor mooie praatjes, dus houden we het bij feiten: vier pakketten, prijzen op de site, demo's die echt werken, en een oplevering zonder kleine lettertjes. Niet lullen maar bouwen, op afstand geregeld.",
    metaDescription:
      "Website laten maken in Rotterdam? Vier pakketten, prijzen gewoon online vanaf 299 euro, demo's die echt werken.",
  },
  {
    slug: "amsterdam",
    name: "Amsterdam",
    province: "Noord-Holland",
    intro:
      "In Amsterdam betaal je voor een bureau al snel de huur van de Herengracht mee. Wij zitten in Maastricht, werken volledig op afstand, en rekenen de prijzen die op onze site staan. Dezelfde moderne techniek, zonder de grachtengordel-toeslag.",
    metaDescription:
      "Website laten maken in Amsterdam zonder bureautarieven? Vaste prijzen vanaf 299 euro, op afstand gebouwd vanuit Maastricht.",
  },
  {
    slug: "groningen",
    name: "Groningen",
    province: "Groningen",
    intro:
      "Groningen is ver van Maastricht, en voor het werk maakt dat exact niets uit: het hele traject loopt online, van kennismaking tot livegang, en dat doen we voor klanten door het hele land. De afstand die wél telt is die tussen jou en je klant, en die overbrugt je site.",
    metaDescription:
      "Website laten maken in Groningen. Volledig online geregeld, vaste prijzen vanaf 299 euro, demo's om zelf te proberen.",
  },
  {
    slug: "den-haag",
    name: "Den Haag",
    province: "Zuid-Holland",
    intro:
      "Den Haag is naast regeringsstad vooral een stad van honderdduizenden gewone klanten die hun kapper, klusser of boekhouder online zoeken. Wie daar niet tussen staat, bestaat voor hen niet. Wij bouwen de site die dat oplost, op afstand vanuit Maastricht, met de prijs vooraf op tafel.",
    metaDescription:
      "Website laten maken in Den Haag. Vaste prijzen vanaf 299 euro, volledig online geregeld, met werkende demo's om zelf te proberen.",
  },
  {
    slug: "haarlem",
    name: "Haarlem",
    province: "Noord-Holland",
    intro:
      "Haarlem zit vol kleine zaken met een trouwe buurt, en juist die zaken verliezen stilletjes klanten aan wie beter vindbaar is. Een eigen site met je werk en je tijden houdt de buurt bij jou. Wat die kost staat op onze site, niet in een offerte achteraf.",
    metaDescription:
      "Website laten maken in Haarlem? Openbare prijzen vanaf 299 euro, geen offertetraject, demo's online te proberen.",
  },
  {
    slug: "leiden",
    name: "Leiden",
    province: "Zuid-Holland",
    intro:
      "In een studentenstad als Leiden zoekt vrijwel iedereen alles eerst online, van de fietsenmaker tot de tandarts. Voor een ondernemer is de rekensom simpel: vindbaar zijn of overgeslagen worden. Wij bouwen de site die je vindbaar maakt, tegen een prijs die vooraf vaststaat.",
    metaDescription:
      "Website laten maken in Leiden. Vaste prijzen vanaf 299 euro, snel en volledig online geregeld vanuit Maastricht.",
  },
  {
    slug: "dordrecht",
    name: "Dordrecht",
    province: "Zuid-Holland",
    intro:
      "Dordrecht is een stad van vakmensen, en vakwerk wordt gegund op wat je kunt laten zien. Een site met je afgeronde projecten doet dat tonen voor jou, ook buiten werktijd. Wij bouwen hem op afstand en rekenen de prijs die op onze site staat.",
    metaDescription:
      "Website laten maken in Dordrecht? Laat je vakwerk zien met een eigen site, vaste prijs vanaf 299 euro.",
  },
  {
    slug: "almere",
    name: "Almere",
    province: "Flevoland",
    intro:
      "Almere is de jongste grote stad van het land, met ondernemers die net zo jong zijn en geen zin hebben in bureaus met lange trajecten. Daarom houden wij het kort: prijs op de site, demo om te proberen, en een oplevering zonder verrassingen.",
    metaDescription:
      "Website laten maken in Almere. Vaste prijzen vanaf 299 euro, geen lang traject, alles online geregeld.",
  },
  {
    slug: "zwolle",
    name: "Zwolle",
    province: "Overijssel",
    intro:
      "Zwolle groeit hard, en met de stad groeit de concurrentie per branche. De zaak die er online verzorgd uitziet wint de klant die vandaag nog niet weet waar hij heen gaat. Wij bouwen die verzorgde site, met openbare prijzen en werkende demo's als bewijs.",
    metaDescription:
      "Website laten maken in Zwolle? Verzorgde sites met vaste prijzen vanaf 299 euro. Demo's staan online.",
  },
  {
    slug: "enschede",
    name: "Enschede",
    province: "Overijssel",
    intro:
      "Enschede heeft de nuchterheid van het oosten: niet te veel woorden, gewoon laten zien wat iets kost en wat je ervoor krijgt. Dat is toevallig precies hoe wij werken. Vier pakketten, prijzen op de site, en demo's die je kunt doorklikken voordat je iets beslist.",
    metaDescription:
      "Website laten maken in Enschede. Gewoon duidelijk: vier pakketten, prijzen online vanaf 299 euro, werkende demo's.",
  },
  {
    slug: "apeldoorn",
    name: "Apeldoorn",
    province: "Gelderland",
    intro:
      "Apeldoorn en de dorpen op de Veluwe eromheen draaien op lokale dienstverleners, en die worden gevonden via de zoekmachine of niet. Een eigen site met je diensten en je werk is daarvoor de basis. Wij bouwen hem op afstand, met de prijs vooraf op de pagina.",
    metaDescription:
      "Website laten maken in Apeldoorn? Vaste prijzen vanaf 299 euro, volledig online, met demo's om te proberen.",
  },
  {
    slug: "amersfoort",
    name: "Amersfoort",
    province: "Utrecht",
    intro:
      "Amersfoort zit precies in het midden van het land, en voor ons maakt dat niets uit: het hele traject loopt toch online. Wat wél telt is dat je klanten je vinden voordat ze je concurrent vinden, en daar is de site voor. De prijs staat vooraf vast.",
    metaDescription:
      "Website laten maken in Amersfoort. Openbare prijzen vanaf 299 euro, volledig online geregeld, demo's beschikbaar.",
  },
  {
    slug: "leeuwarden",
    name: "Leeuwarden",
    province: "Friesland",
    intro:
      "In Friesland wordt zaken doen nog op vertrouwen gedaan, en dat vertrouwen begint tegenwoordig bij wat iemand online van je ziet. Een verzorgde site met je werk en je prijzen zet dat vertrouwen neer voordat het eerste gesprek plaatsvindt. Wij bouwen hem op afstand, voor de prijs die op onze site staat.",
    metaDescription:
      "Website laten maken in Leeuwarden? Vaste prijzen vanaf 299 euro, volledig online, met werkende demo's als bewijs.",
  },
  {
    slug: "middelburg",
    name: "Middelburg",
    province: "Zeeland",
    intro:
      "Zeeland heeft relatief de minste webbureaus van het land, en ondernemers in Middelburg en omstreken betalen daar vaak de prijs voor: lange wachttijden of hoge tarieven van ver weg. Bij ons maakt afstand niet uit en staat de prijs gewoon online.",
    metaDescription:
      "Website laten maken in Middelburg. Vaste prijzen vanaf 299 euro, geen wachttijden, volledig online geregeld.",
  },
  {
    slug: "kerkrade",
    name: "Kerkrade",
    province: "Limburg",
    intro:
      "Kerkrade en Parkstad zitten vol eenmanszaken die hun werk via via krijgen, tot de via-via opdroogt. Een site die je vindbaar maakt is dan geen luxe. Wij zitten zelf in Limburg, bouwen alles online, en wat het kost staat hieronder gewoon op de kaart.",
    metaDescription:
      "Website laten maken in Kerkrade? Limburgse studio, vaste prijzen vanaf 299 euro, alles online geregeld.",
  },
];

export function getCity(slug: string): City | undefined {
  return CITIES.find((city) => city.slug === slug);
}
