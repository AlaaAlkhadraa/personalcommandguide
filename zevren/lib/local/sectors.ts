import type { WorkSlug } from "@/types";
import type { PlanKey } from "@/lib/offer";

/**
 * The sector landing pages: /website-voor/<sector>, targeting searches like
 * "website voor kapsalon" and "website garage laten maken".
 *
 * Each sector is anchored on a demo that actually exists and actually works:
 * the page never promises anything the linked demo cannot show. The copy per
 * sector is hand-written and different, for the same reason the city intros
 * are: interchangeable pages rank nobody. The recommended package comes from
 * PLANS via `planKey`, so the price can never drift, and the "afspraken"
 * claim on the 549 package is the site's own pricing copy ("inclusief een
 * afsprakensysteem waarin klanten zelf hun tijd kiezen").
 */

export interface Sector {
  slug: string;
  /** "kappers" as in "website voor kappers". */
  name: string;
  /** H1: "Een website voor <h1Noun>". */
  h1Noun: string;
  planKey: PlanKey;
  /** Absent for portfolio trades: their proof is the concept builder. */
  demoSlug?: WorkSlug;
  demoName?: string;
  /** Two to four sentences, unique per sector. */
  intro: string;
  /** One paragraph: what the demo proves, in this sector's terms. */
  proof: string;
  metaDescription: string;
}

export const SECTORS: Sector[] = [
  {
    slug: "kappers",
    name: "kappers",
    h1Noun: "je kapsalon",
    planKey: "business",
    demoSlug: "barbershop-website",
    demoName: "de barbershop-demo",
    intro:
      "Een kapsalon leeft op de agenda, en de meeste afspraken ontstaan buiten openingstijden: 's avonds op de bank, wanneer bellen geen optie is. Een site waarop klanten zelf een tijd kiezen vangt precies die momenten op. Het Business-pakket is er inclusief afsprakensysteem, voor de prijs die hieronder op de kaart staat.",
    proof:
      "Hoe dat voelt voor je klant hoef je niet te geloven, dat kun je proberen: in onze demo kies je een behandeling, een kapper en een tijd, en je krijgt een bevestiging. Wat daar werkt voor een denkbeeldige zaak, bouwen we voor die van jou.",
    metaDescription:
      "Een website voor je kapsalon met een afsprakensysteem waarin klanten zelf hun tijd kiezen. Vaste prijs, werkende demo om zelf te proberen.",
  },
  {
    slug: "hondentrimsalons",
    name: "hondentrimsalons",
    h1Noun: "je trimsalon",
    planKey: "business",
    demoSlug: "barbershop-website",
    demoName: "onze agenda-demo",
    intro:
      "Trimsalons zitten vaak wekenlang vol, en juist dan lekt er omzet weg: wie belt en niet direct geholpen wordt, belt de volgende. Een agenda op je eigen site laat klanten buiten openingstijden een plek pakken, en laat nieuwe klanten je beoordelingen zien voordat ze kiezen. Het Business-pakket is er inclusief afsprakensysteem.",
    proof:
      "Het boekingssysteem kun je zelf proberen: onze demo laat een klant een behandeling, een moment en een bevestiging doorlopen. Dezelfde stappen, met jouw behandelingen en jouw tijden, komen op jouw site.",
    metaDescription:
      "Een website voor je hondentrimsalon met online agenda: klanten kiezen zelf hun tijd, ook buiten openingstijden. Vaste prijs, demo online.",
  },
  {
    slug: "garages",
    name: "garages",
    h1Noun: "je garage",
    planKey: "business",
    demoSlug: "garage-website",
    demoName: "de garage-demo",
    intro:
      "Voor een garage is de telefoon de flessenhals: wie onder een auto ligt neemt niet op, en de klant met een piepende rem zoekt intussen verder. Een site waarop klanten zelf een dienst kiezen en een moment plannen neemt dat werk over. Het Business-pakket is er inclusief afsprakensysteem.",
    proof:
      "We bouwden een complete garage-demo waarin je een dienst kiest, je kenteken invult en een afspraak plant, tot en met de bevestiging. Klik hem door en je weet precies wat je klanten straks zien.",
    metaDescription:
      "Een website voor je garage met online afspraken plannen: dienst kiezen, kenteken invullen, moment plannen. Vaste prijs, werkende demo.",
  },
  {
    slug: "administratiekantoren",
    name: "administratiekantoren",
    h1Noun: "je administratiekantoor",
    planKey: "business",
    demoSlug: "accounting-firm",
    demoName: "de demo van Bergendal Accountants",
    intro:
      "Een administratiekantoor wordt gekozen op vertrouwen, en vertrouwen begint tegenwoordig bij een verzorgde site: wie je naam googelt en niets vindt, belt het kantoor dat wel vindbaar is. Een duidelijke site met je diensten en tarieven staat er met het Business-pakket; wie verder wil, met een klantportaal voor stukken en vragen, zit bij maatwerk.",
    proof:
      "Beide kun je bekijken in onze demo van een denkbeeldig kantoor: een heldere dienstenpresentatie én een werkend klantportaal. Zo zie je vooraf welk niveau bij jouw kantoor past.",
    metaDescription:
      "Een website voor je administratiekantoor: vindbaar, verzorgd, met desgewenst een klantportaal. Vaste prijzen, demo online te bekijken.",
  },
  {
    slug: "schoonheidssalons",
    name: "schoonheidssalons",
    h1Noun: "je schoonheidssalon",
    planKey: "business",
    demoSlug: "barbershop-website",
    demoName: "onze agenda-demo",
    intro:
      "Een schoonheidssalon verkoopt rust en verzorging, en de eerste indruk daarvan is tegenwoordig je site. Een verzorgde pagina met je behandelingen, je prijzen en een agenda waarin klanten zelf boeken straalt precies uit wat je cabine ook doet. Het Business-pakket is er inclusief afsprakensysteem.",
    proof:
      "Hoe zo'n boeking voelt, probeer je in onze demo: behandeling kiezen, moment kiezen, bevestiging. Dezelfde flow, in de stijl van jouw salon, komt op jouw site.",
    metaDescription:
      "Een website voor je schoonheidssalon met online agenda en je behandelingen. Vaste prijs, werkende demo om te proberen.",
  },
  {
    slug: "nagelsalons",
    name: "nagelsalons",
    h1Noun: "je nagelsalon",
    planKey: "business",
    demoSlug: "barbershop-website",
    demoName: "onze agenda-demo",
    intro:
      "Nagelsalons leven van herhaalafspraken, en elke herhaalafspraak die telefonisch moet, is er een die 's avonds niet gemaakt wordt. Een agenda op je eigen site vangt die avondboekingen op, en je werk staat er meteen naast in beeld. Het Business-pakket is er inclusief afsprakensysteem.",
    proof:
      "In onze demo doorloop je precies zo'n boeking, van behandeling tot bevestiging. Dat systeem, met jouw behandelingen en jouw huisstijl, zetten wij op jouw site.",
    metaDescription:
      "Een website voor je nagelsalon met online boeken en je werk in beeld. Vaste prijs, demo online te proberen.",
  },
  {
    slug: "hoveniers",
    name: "hoveniers",
    h1Noun: "je hoveniersbedrijf",
    planKey: "starter",
    intro:
      "Een tuin wordt gegund op zicht: wie jouw aangelegde tuinen kan bekijken, belt eerder dan wie alleen een telefoonnummer in een gids vindt. Een eigen site met je projecten doet dat tonen voor jou, het hele jaar door. Het Starter-pakket is daarvoor gebouwd, voor de prijs die hieronder staat.",
    proof:
      "Wil je eerst zien hoe jouw site eruit kan zien? In de conceptbouwer kies je een stijl en kleuren en krijg je direct een voorbeeld van je eigen homepage, gratis en zonder verplichtingen.",
    metaDescription:
      "Een website voor je hoveniersbedrijf die je aangelegde tuinen laat zien. Vaste prijs, voorbeeld direct te bekijken.",
  },
  {
    slug: "schilders",
    name: "schilders",
    h1Noun: "je schildersbedrijf",
    planKey: "starter",
    intro:
      "Strak schilderwerk verkoopt zichzelf, maar alleen als iemand het kan zien. Wie 's avonds twee of drie schilders vergelijkt, kiest degene met foto's van afgerond werk, niet degene met alleen een vermelding. Een eigen site met je projecten is daarvoor genoeg, en die is er al voor de Starter-prijs.",
    proof:
      "Hoe die site eruit kan zien, bepaal je zelf in de conceptbouwer: stijl en kleuren kiezen, direct een voorbeeld van je eigen homepage zien. Gratis en zonder verplichtingen.",
    metaDescription:
      "Een website voor je schildersbedrijf met je afgeronde werk in beeld. Vaste prijs, voorbeeld direct online te maken.",
  },
  {
    slug: "dakdekkers",
    name: "dakdekkers",
    h1Noun: "je dakdekkersbedrijf",
    planKey: "starter",
    intro:
      "Bij een lekkage zoekt de klant met haast, en belt hij wie er betrouwbaar uitziet: afgeronde daken, duidelijke diensten, een telefoonnummer bovenaan. Een gidsvermelding wint die race niet van een eigen site. Het Starter-pakket zet die site neer voor een vaste prijs.",
    proof:
      "In de conceptbouwer zie je binnen een paar minuten hoe jouw site eruit kan zien: stijl kiezen, kleuren kiezen, voorbeeld bekijken. Gratis en zonder verplichtingen.",
    metaDescription:
      "Een website voor je dakdekkersbedrijf: betrouwbaar vindbaar bij spoed en gepland werk. Vaste prijs, voorbeeld direct te zien.",
  },
  {
    slug: "stukadoors",
    name: "stukadoors",
    h1Noun: "je stukadoorsbedrijf",
    planKey: "starter",
    intro:
      "Stucwerk beoordeel je met je ogen, en dus wint de stukadoor wiens strakke wanden en plafonds online staan het van de stukadoor die alleen op een gidssite te vinden is. Een eigen pagina met je werk kost eenmalig de Starter-prijs die hieronder staat, en daarna doet hij elke avond zijn werk.",
    proof:
      "Bouw in de conceptbouwer eerst zelf een voorbeeld van je eigen homepage: stijl en kleuren kiezen, direct resultaat zien. Gratis en zonder verplichtingen.",
    metaDescription:
      "Een website voor je stukadoorsbedrijf die je strakke werk laat zien. Vaste prijs, voorbeeld direct online te bekijken.",
  },
];

export function getSector(slug: string): Sector | undefined {
  return SECTORS.find((sector) => sector.slug === slug);
}
