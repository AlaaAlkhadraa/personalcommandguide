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
  /** Three questions a visitor with this exact intent asks, answered with
   *  facts the rest of the site already states (prices from PLANS, the
   *  booking system in the 549 package, the care plan, remote delivery). */
  faq: Array<{ question: string; answer: string }>;
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
    faq: [
      {
        question: "Wat kost een website voor een kapsalon?",
        answer: "Het Business-pakket is 549 euro eenmalig, exclusief btw, inclusief het afsprakensysteem waarin klanten zelf hun tijd kiezen. Die prijs staat op de site en is de prijs op de factuur; een offertetraject is er niet.",
      },
      {
        question: "Kunnen klanten echt zelf online een afspraak boeken?",
        answer: "Ja. Ze kiezen een behandeling, een kapper en een tijd en krijgen een bevestiging. Hoe dat werkt kun je vooraf zelf proberen in onze barbershop-demo; jouw site krijgt dezelfde stappen met jouw behandelingen en tijden.",
      },
      {
        question: "Wie houdt de site na de lancering bij?",
        answer: "Dat kan optioneel via het onderhoudsplan van 49,99 euro per maand: hosting, back-ups, updates en kleine tekst- en beeldwijzigingen. Zonder plan kun je de teksten ook zelf aanpassen; de site is daarvoor gebouwd.",
      },
    ],
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
    faq: [
      {
        question: "Wat kost een website voor een trimsalon?",
        answer: "Het Business-pakket is 549 euro eenmalig, exclusief btw, met het afsprakensysteem erbij. De prijs staat op de site; wat op de kaart staat is wat op de factuur staat.",
      },
      {
        question: "Kan een klant buiten openingstijden een plek reserveren?",
        answer: "Ja, dat is precies waar de online agenda voor is: de klant kiest zelf een behandeling en een moment, ook 's avonds, en jij ziet de afspraak verschijnen zonder dat de telefoon hoeft te gaan. Probeer het vooraf in onze agenda-demo.",
      },
      {
        question: "Kan ik mijn beoordelingen op de site laten zien?",
        answer: "Ja. Beoordelingen die je al hebt verzameld kunnen op je eigen site staan, zodat een nieuwe klant ze ziet voordat hij kiest, in plaats van alleen op de pagina van een gids of platform.",
      },
    ],
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
    faq: [
      {
        question: "Wat kost een website voor een garage?",
        answer: "Het Business-pakket is 549 euro eenmalig, exclusief btw, inclusief het systeem waarmee klanten zelf een dienst kiezen en een afspraak plannen. Geen offertetraject: de prijs staat op de site.",
      },
      {
        question: "Kunnen klanten hun kenteken invullen bij het plannen?",
        answer: "In onze garage-demo kiest de klant een dienst, vult zijn kenteken in en plant een moment, tot en met de bevestiging. Die flow bouwen we voor jouw garage, met jouw diensten en openingstijden.",
      },
      {
        question: "Kan ik later diensten of prijzen zelf aanpassen?",
        answer: "Ja. De site is gebouwd zodat je teksten en diensten zelf kunt bewerken. Wil je het liever uit handen geven, dan zit dat in het optionele onderhoudsplan van 49,99 euro per maand.",
      },
    ],
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
    faq: [
      {
        question: "Wat kost een website voor een administratiekantoor?",
        answer: "Een duidelijke site met je diensten en tarieven valt onder het Business-pakket van 549 euro eenmalig, exclusief btw. Een klantportaal voor stukken en vragen is maatwerk, vanaf 1349 euro; wat bij jou past bespreken we vooraf en de prijs staat vast voordat we beginnen.",
      },
      {
        question: "Kunnen jullie een klantportaal bouwen?",
        answer: "Ja. In onze demo van Bergendal Accountants zie je een werkend klantportaal naast de gewone dienstenpresentatie. Maatwerkportalen bouwen we rond hoe jouw kantoor echt werkt en koppelen we waar nodig aan de systemen die je al gebruikt.",
      },
      {
        question: "Hoe zit het met vertrouwelijkheid en beveiliging?",
        answer: "De site wordt gebouwd met moderne techniek en veilige formulieren, en in het onderhoudsplan zitten beveiligings- en software-updates en back-ups. Wat een portaal precies moet beschermen, leggen we vooraf samen vast.",
      },
    ],
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
    faq: [
      {
        question: "Wat kost een website voor een schoonheidssalon?",
        answer: "Het Business-pakket is 549 euro eenmalig, exclusief btw, inclusief de online agenda waarin klanten zelf boeken. De prijs staat op de site; een offerte hoef je niet aan te vragen.",
      },
      {
        question: "Kan ik mijn behandelingen en prijzen op de site zetten?",
        answer: "Ja, en je kunt ze later zelf bijwerken: de site is gebouwd zodat je teksten zelf kunt bewerken. Klanten zien je behandelingen, kiezen er een en boeken direct een moment.",
      },
      {
        question: "Hoe ziet zo'n boeking er voor mijn klant uit?",
        answer: "Behandeling kiezen, moment kiezen, bevestiging: drie stappen. Probeer het vooraf in onze agenda-demo, dan weet je precies wat je klanten straks zien.",
      },
    ],
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
    faq: [
      {
        question: "Wat kost een website voor een nagelsalon?",
        answer: "Het Business-pakket is 549 euro eenmalig, exclusief btw, met online boeken erbij. De prijs staat gewoon op de site en is de prijs op de factuur.",
      },
      {
        question: "Kunnen vaste klanten zelf hun herhaalafspraak inplannen?",
        answer: "Ja. Ze kiezen een behandeling en een moment in jouw online agenda, ook 's avonds, en krijgen een bevestiging. Jij ziet de afspraak verschijnen zonder telefoontje.",
      },
      {
        question: "Kan ik foto's van mijn werk op de site zetten?",
        answer: "Ja. Je werk staat naast de agenda in beeld, en je kunt later zelf foto's toevoegen of vervangen; de site is daarvoor gebouwd. Kleine wijzigingen kunnen ook via het onderhoudsplan van 49,99 euro per maand.",
      },
    ],
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
    faq: [
      {
        question: "Wat kost een website voor een hoveniersbedrijf?",
        answer: "Het Starter-pakket is 299 euro eenmalig, exclusief btw: een gerichte site die je aangelegde tuinen laat zien en een offerteaanvraag mogelijk maakt. De prijs staat op de site; extra pagina's kosten 79 euro per stuk.",
      },
      {
        question: "Ik heb alleen foto's op mijn telefoon, is dat genoeg?",
        answer: "Ja. Foto's van afgerond werk zijn precies wat een klant wil zien voordat hij belt. Wij zetten ze in een pagina die ze groot en scherp laat zien, en je kunt later zelf nieuwe projecten toevoegen.",
      },
      {
        question: "Hoe snel zie ik hoe mijn site eruit kan zien?",
        answer: "Direct: in de conceptbouwer kies je een stijl en kleuren en zie je meteen een voorbeeld van je eigen homepage, gratis en zonder verplichtingen. Een concrete inschatting van de doorlooptijd krijg je voordat de ontwikkeling begint.",
      },
    ],
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
    faq: [
      {
        question: "Wat kost een website voor een schildersbedrijf?",
        answer: "Het Starter-pakket is 299 euro eenmalig, exclusief btw. Daarmee staat je afgeronde werk online en kan een klant een offerte aanvragen. De prijs staat op de site, niet in een offerte.",
      },
      {
        question: "Wat moet ik aanleveren?",
        answer: "Foto's van je werk en de diensten die je aanbiedt zijn de basis. Wat we verder van je nodig hebben, leggen we vooraf uit in de werkwijze, zodat je niet voor verrassingen komt te staan.",
      },
      {
        question: "Kan ik de site later uitbreiden?",
        answer: "Ja. Extra pagina's kosten 79 euro per pagina, en overstappen naar een groter pakket kan wanneer je zaak daarom vraagt. Je kunt teksten en foto's ook zelf aanpassen.",
      },
    ],
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
    faq: [
      {
        question: "Wat kost een website voor een dakdekkersbedrijf?",
        answer: "Het Starter-pakket is 299 euro eenmalig, exclusief btw: diensten, afgerond werk en een duidelijke manier om je te bereiken, ook bij spoed. De prijs staat op de site en is de prijs op de factuur.",
      },
      {
        question: "Kan een klant met een lekkage me snel bereiken via de site?",
        answer: "Ja. Je telefoonnummer en een korte aanvraag staan bovenaan, zodat iemand met haast in één keer kan bellen of een bericht sturen. Op mobiel werkt dat net zo, want de site wordt daarvoor gebouwd.",
      },
      {
        question: "Wie zorgt dat de site online blijft?",
        answer: "Optioneel het onderhoudsplan van 49,99 euro per maand: hosting, back-ups, updates en kleine wijzigingen. Zonder plan blijft de site van jou, inclusief je domein en bestanden.",
      },
    ],
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
    faq: [
      {
        question: "Wat kost een website voor een stukadoorsbedrijf?",
        answer: "Het Starter-pakket is 299 euro eenmalig, exclusief btw. Je strakke werk staat online, een klant kan een offerte aanvragen, en de prijs staat op de site in plaats van in een offerte.",
      },
      {
        question: "Ik sta al op een gidssite, heb ik dan nog een eigen site nodig?",
        answer: "Een gidsvermelding zet je tussen alle andere stukadoors uit de omgeving; een eigen site laat alleen jouw werk zien en is van jou. Beide kunnen naast elkaar, maar de vergelijking wint degene met foto's van afgerond werk.",
      },
      {
        question: "Hoe zie ik vooraf hoe mijn site eruit komt te zien?",
        answer: "In de conceptbouwer kies je een stijl en kleuren en zie je direct een voorbeeld van je eigen homepage, gratis en zonder verplichtingen. Daarna bespreken we wat er in je site moet komen.",
      },
    ],
  },
];

export function getSector(slug: string): Sector | undefined {
  return SECTORS.find((sector) => sector.slug === slug);
}
