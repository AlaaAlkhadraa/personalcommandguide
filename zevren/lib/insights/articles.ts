/**
 * The Insights article registry.
 *
 * Articles are written in English and Dutch; the other locales read the
 * English version with a note, because a machine-translated article would
 * read worse than an honest fallback. Content lives here as typed blocks
 * rather than markdown, so the article page renders it with the site's own
 * typography and nothing can inject markup.
 *
 * Dates are launch dates and only move forward: search engines treat
 * republished dates as a signal worth distrusting.
 */

export interface ArticleBlock {
  type: "p" | "h2" | "ul";
  text?: string;
  items?: string[];
}

export interface ArticleContent {
  title: string;
  excerpt: string;
  blocks: ArticleBlock[];
}

export interface Article {
  slug: string;
  /** ISO date the article was published. */
  date: string;
  readingMinutes: number;
  /** Short category label, shown on the card chip. */
  category: { en: string; nl: string };
  content: { en: ArticleContent; nl: ArticleContent };
}

export const ARTICLES: Article[] = [
  {
    slug: "what-does-a-website-cost",
    date: "2026-08-19",
    readingMinutes: 6,
    category: { en: "Pricing", nl: "Prijzen" },
    content: {
      en: {
        title: "What does a website cost in 2026? Honest numbers",
        excerpt:
          "Prices for a business website range from 200 to 20,000 euros, and most agencies will not tell you why. Here is what actually drives the price, with our own numbers on the table.",
        blocks: [
          {
            type: "p",
            text: "Ask five agencies what a website costs and you will get five answers, usually after a sales call you did not want. The honest answer is that the price follows three things: how much of the work is genuinely custom, who does the thinking, and what happens after launch.",
          },
          { type: "h2", text: "The three price ranges you will encounter" },
          {
            type: "ul",
            items: [
              "200 to 500 euros: a template with your logo and text dropped in. Fast and cheap, but you get the same site a thousand other businesses have, and changing anything structural later is painful.",
              "500 to 2,500 euros: custom design and development for a business site or small store. This is where most small businesses should be: the site is built around your content and goals, not squeezed into a theme.",
              "2,500 euros and up: web applications, portals, custom integrations. Here you are paying for engineering, not pages.",
            ],
          },
          { type: "h2", text: "What actually drives the price" },
          {
            type: "p",
            text: "Page count matters less than people think. What costs money is thinking: working out what the site has to achieve, writing content that sells, designing something distinct, and building it so it loads fast and ranks. A ten-page site assembled from a theme is cheaper than a five-page site designed from scratch, and it shows.",
          },
          {
            type: "p",
            text: "The second driver is what happens after launch. A website is not a one-off purchase: it needs updates, security patches and small changes as your business moves. Ask any agency what maintenance costs before you sign, not after.",
          },
          { type: "h2", text: "Our own numbers" },
          {
            type: "p",
            text: "We publish our prices, because asking for a quote just to learn a starting price wastes everyone's time. A starter website is 299 euros, a full business website 549, an online store 899 and custom web applications start at 1,349. The price we agree before the work starts is the price on the invoice.",
          },
          {
            type: "p",
            text: "Whatever you choose and whoever you choose, insist on two things: a fixed price agreed before work starts, and a clear answer on what maintenance costs. Those two questions filter out most bad surprises.",
          },
        ],
      },
      nl: {
        title: "Wat kost een website in 2026? Eerlijke cijfers",
        excerpt:
          "Prijzen voor een zakelijke website lopen van 200 tot 20.000 euro, en de meeste bureaus vertellen je niet waarom. Dit bepaalt de prijs echt, met onze eigen cijfers op tafel.",
        blocks: [
          {
            type: "p",
            text: "Vraag vijf bureaus wat een website kost en je krijgt vijf antwoorden, meestal na een verkoopgesprek waar je niet op zat te wachten. Het eerlijke antwoord: de prijs volgt uit drie dingen. Hoeveel van het werk echt maatwerk is, wie het denkwerk doet, en wat er na de lancering gebeurt.",
          },
          { type: "h2", text: "De drie prijsklassen die je tegenkomt" },
          {
            type: "ul",
            items: [
              "200 tot 500 euro: een template met jouw logo en tekst erin. Snel en goedkoop, maar je krijgt dezelfde site als duizend andere bedrijven, en structureel iets aanpassen is later lastig.",
              "500 tot 2.500 euro: eigen ontwerp en ontwikkeling voor een bedrijfssite of kleine webshop. Hier zitten de meeste mkb'ers goed: de site wordt om jouw content en doelen heen gebouwd, niet in een thema geperst.",
              "2.500 euro en meer: webapplicaties, portalen, maatwerkkoppelingen. Hier betaal je voor techniek, niet voor pagina's.",
            ],
          },
          { type: "h2", text: "Wat de prijs echt bepaalt" },
          {
            type: "p",
            text: "Het aantal pagina's doet er minder toe dan mensen denken. Wat geld kost is denkwerk: uitzoeken wat de site moet bereiken, teksten schrijven die verkopen, iets onderscheidends ontwerpen, en het zo bouwen dat het snel laadt en goed scoort in Google. Een site van tien pagina's uit een thema is goedkoper dan vijf pagina's vanaf nul ontworpen, en dat zie je terug.",
          },
          {
            type: "p",
            text: "De tweede factor is wat er na de lancering gebeurt. Een website is geen eenmalige aankoop: er zijn updates, beveiligingspatches en kleine aanpassingen nodig. Vraag elk bureau wat onderhoud kost voordat je tekent, niet erna.",
          },
          { type: "h2", text: "Onze eigen cijfers" },
          {
            type: "p",
            text: "Wij publiceren onze prijzen, want een offerte moeten aanvragen om een startprijs te horen is zonde van ieders tijd. Een starterswebsite is 299 euro, een volledige bedrijfswebsite 549, een webshop 899 en maatwerk webapplicaties beginnen bij 1.349 euro. De prijs die we vooraf afspreken is de prijs op de factuur.",
          },
          {
            type: "p",
            text: "Wat je ook kiest en wie je ook kiest: sta op twee dingen. Een vaste prijs die vóór de start is afgesproken, en een duidelijk antwoord op wat onderhoud kost. Die twee vragen filteren de meeste vervelende verrassingen eruit.",
          },
        ],
      },
    },
  },
  {
    slug: "website-builder-or-custom",
    date: "2026-08-19",
    readingMinutes: 5,
    category: { en: "Strategy", nl: "Strategie" },
    content: {
      en: {
        title: "Wix, WordPress or custom? An honest comparison",
        excerpt:
          "Website builders are genuinely good at some things. A custom build is genuinely better at others. Here is the honest split, from someone who builds custom sites for a living.",
        blocks: [
          {
            type: "p",
            text: "We build custom websites, so you would expect us to tell you builders are terrible. They are not. If you need a page online this weekend for a hobby project, use a builder and do not pay anyone. The interesting question is where the line sits for a business.",
          },
          { type: "h2", text: "Where builders genuinely win" },
          {
            type: "ul",
            items: [
              "Speed to launch: a Wix or Squarespace page can be live in a day.",
              "Upfront cost: 10 to 40 euros a month beats any agency invoice.",
              "Zero technical involvement: hosting, SSL and updates are handled for you.",
            ],
          },
          { type: "h2", text: "Where the bill comes later" },
          {
            type: "p",
            text: "Builders charge their real price in three currencies: speed, ranking and ceiling. Builder sites carry megabytes of code your page does not use, and Google measures that. They give you limited control over the technical details search engines read. And the day you need something the platform does not offer, a booking flow, a customer portal, a real integration, you hit a wall and start over.",
          },
          {
            type: "p",
            text: "There is also the sameness problem. Templates look fine until a visitor recognises the layout from three other businesses. Design that makes you easier to remember is precisely the thing a template cannot give you.",
          },
          { type: "h2", text: "The honest decision rule" },
          {
            type: "ul",
            items: [
              "Side project, testing an idea, no budget: use a builder, seriously.",
              "The website matters for how customers choose you: build custom, once, properly.",
              "Already on a builder and growing out of it: the move is easier than you fear, and your content comes with you.",
            ],
          },
          {
            type: "p",
            text: "A custom site from us starts at 299 euros, which is less than two years of a builder subscription, and it is yours.",
          },
        ],
      },
      nl: {
        title: "Wix, WordPress of maatwerk? Een eerlijke vergelijking",
        excerpt:
          "Websitebouwers zijn echt goed in sommige dingen. Maatwerk is echt beter in andere. Dit is de eerlijke verdeling, van iemand die van maatwerk zijn vak heeft gemaakt.",
        blocks: [
          {
            type: "p",
            text: "Wij bouwen maatwerkwebsites, dus je verwacht dat we zeggen dat bouwers waardeloos zijn. Dat zijn ze niet. Moet er dit weekend een pagina online voor een hobbyproject? Gebruik een bouwer en betaal niemand. De interessante vraag is waar de grens ligt voor een bedrijf.",
          },
          { type: "h2", text: "Waar bouwers echt winnen" },
          {
            type: "ul",
            items: [
              "Snelheid: een Wix- of Squarespace-pagina staat binnen een dag live.",
              "Instapkosten: 10 tot 40 euro per maand wint van elke bureaufactuur.",
              "Nul techniek: hosting, SSL en updates worden voor je geregeld.",
            ],
          },
          { type: "h2", text: "Waar de rekening later komt" },
          {
            type: "p",
            text: "Bouwers rekenen hun echte prijs in drie valuta: snelheid, vindbaarheid en plafond. Bouwersites slepen megabytes aan code mee die jouw pagina niet gebruikt, en Google meet dat. Je hebt beperkte controle over de technische details die zoekmachines lezen. En de dag dat je iets nodig hebt wat het platform niet biedt, een boekingssysteem, een klantportaal, een echte koppeling, loop je tegen een muur en begin je opnieuw.",
          },
          {
            type: "p",
            text: "En dan is er het eenheidsworstprobleem. Templates zien er prima uit, tot een bezoeker de lay-out herkent van drie andere bedrijven. Ontwerp dat je makkelijker te onthouden maakt is precies wat een template je niet kan geven.",
          },
          { type: "h2", text: "De eerlijke beslisregel" },
          {
            type: "ul",
            items: [
              "Bijproject, idee testen, geen budget: gebruik een bouwer, serieus.",
              "De website bepaalt mede hoe klanten je kiezen: bouw één keer goed, op maat.",
              "Al op een bouwer en eruit gegroeid: de overstap is makkelijker dan je vreest, en je content gaat mee.",
            ],
          },
          {
            type: "p",
            text: "Een maatwerksite van ons begint bij 299 euro. Dat is minder dan twee jaar bouwersabonnement, en hij is van jou.",
          },
        ],
      },
    },
  },
  {
    slug: "slow-website-costs-customers",
    date: "2026-08-19",
    readingMinutes: 5,
    category: { en: "Performance", nl: "Snelheid" },
    content: {
      en: {
        title: "Your website is slow, and it is costing you customers",
        excerpt:
          "More than half of visitors leave a page that takes over three seconds to load. Most business websites take longer. Here is why, and what actually fixes it.",
        blocks: [
          {
            type: "p",
            text: "Speed is not a technical vanity metric. Google's own research puts it plainly: as load time goes from one to three seconds, the chance a visitor leaves rises by a third. On a phone, on mobile data, standing in a queue, nobody waits for your hero image.",
          },
          { type: "h2", text: "Why business websites are slow" },
          {
            type: "ul",
            items: [
              "Photos uploaded straight from a phone: a single 4 MB image outweighs an entire well-built page.",
              "Theme and plugin bloat: sliders, builders and trackers each drag in scripts your visitor pays to download.",
              "Cheap hosting far from your visitors, adding delay to every single request.",
              "No caching strategy, so every visit rebuilds what could have been served instantly.",
            ],
          },
          { type: "h2", text: "What fast actually looks like" },
          {
            type: "p",
            text: "A well-built page shows meaningful content in under two seconds on a mid-range phone. Getting there is not magic: images compressed and sized to their containers, code split so the browser only loads what the page uses, static pages served from a network edge close to the visitor, and fonts that do not block the first paint.",
          },
          {
            type: "p",
            text: "This is also a ranking matter. Google's Core Web Vitals feed directly into search position, so the slow site does not just convert worse, it gets found less.",
          },
          { type: "h2", text: "How to check your own site in two minutes" },
          {
            type: "p",
            text: "Open pagespeed.web.dev, enter your address, and look at the mobile score, not the desktop one, because that is where your visitors are. Under 50 means you are losing people daily. This site scores in the green: not because of tricks, but because performance was a requirement from the first line of code, which is exactly how we build for clients.",
          },
        ],
      },
      nl: {
        title: "Je website is traag, en dat kost je klanten",
        excerpt:
          "Meer dan de helft van je bezoekers verlaat een pagina die langer dan drie seconden laadt. De meeste bedrijfswebsites doen er langer over. Dit is waarom, en wat het echt oplost.",
        blocks: [
          {
            type: "p",
            text: "Snelheid is geen technische ijdelheid. Googles eigen onderzoek zegt het onomwonden: stijgt de laadtijd van één naar drie seconden, dan neemt de kans dat een bezoeker vertrekt met een derde toe. Op een telefoon, op mobiele data, wachtend in de rij, wacht niemand op jouw hero-afbeelding.",
          },
          { type: "h2", text: "Waarom bedrijfswebsites traag zijn" },
          {
            type: "ul",
            items: [
              "Foto's rechtstreeks vanaf de telefoon geüpload: één afbeelding van 4 MB weegt meer dan een complete goed gebouwde pagina.",
              "Thema- en pluginballast: sliders, builders en trackers slepen elk scripts mee die jouw bezoeker moet downloaden.",
              "Goedkope hosting ver van je bezoekers, wat vertraging toevoegt aan elk verzoek.",
              "Geen cachingstrategie, waardoor elk bezoek opnieuw opbouwt wat direct geserveerd had kunnen worden.",
            ],
          },
          { type: "h2", text: "Hoe snel er echt uitziet" },
          {
            type: "p",
            text: "Een goed gebouwde pagina toont betekenisvolle content binnen twee seconden op een middenklasse-telefoon. Daar komen is geen magie: afbeeldingen gecomprimeerd en op maat, code opgesplitst zodat de browser alleen laadt wat de pagina gebruikt, statische pagina's geserveerd vanaf een edge-netwerk dicht bij de bezoeker, en lettertypen die de eerste weergave niet blokkeren.",
          },
          {
            type: "p",
            text: "Het is ook een vindbaarheidskwestie. Googles Core Web Vitals tellen rechtstreeks mee in je positie, dus de trage site converteert niet alleen slechter, hij wordt ook minder gevonden.",
          },
          { type: "h2", text: "Check je eigen site in twee minuten" },
          {
            type: "p",
            text: "Open pagespeed.web.dev, vul je adres in en kijk naar de mobiele score, niet de desktopscore, want daar zitten je bezoekers. Onder de 50 betekent dat je dagelijks mensen verliest. Deze site scoort groen: niet door trucs, maar omdat snelheid vanaf de eerste regel code een eis was. Precies zo bouwen we ook voor klanten.",
          },
        ],
      },
    },
  },
  {
    slug: "seo-basics-for-small-business",
    date: "2026-08-19",
    readingMinutes: 7,
    category: { en: "SEO", nl: "SEO" },
    content: {
      en: {
        title: "SEO for small businesses: what actually matters in 2026",
        excerpt:
          "Forget the jargon. Ranking on Google comes down to four things a small business can genuinely act on. Here they are, in order of impact.",
        blocks: [
          {
            type: "p",
            text: "SEO has a reputation for being a dark art sold by the month. Strip away the jargon and what Google rewards is boringly sensible: pages that load fast, answer real questions, come from a business that demonstrably exists, and are technically readable. Here is what that means in practice, in order of impact for a small business.",
          },
          { type: "h2", text: "1. Be the answer to a question someone types" },
          {
            type: "p",
            text: "Nobody searches your company name until they already know you. They search questions: what does a website cost, accountant near me, garage open on Saturday. Every page that answers a real question in plain language is a door into your site. This is why content beats tweaks: a services page can rank for a handful of terms, while every good article ranks for dozens.",
          },
          { type: "h2", text: "2. Local presence, if you serve an area" },
          {
            type: "ul",
            items: [
              "Create a free Google Business Profile with your real address, hours and photos.",
              "Use the same name, address and phone number everywhere they appear online.",
              "Ask satisfied customers for a Google review; a steady trickle beats a burst.",
            ],
          },
          { type: "h2", text: "3. Speed and mobile, measured not assumed" },
          {
            type: "p",
            text: "Google ranks the mobile version of your site and measures how it performs on real phones. A slow, pinch-to-zoom site is invisible past page two regardless of its content. Test on pagespeed.web.dev and believe the mobile number.",
          },
          { type: "h2", text: "4. The technical layer most sites skip" },
          {
            type: "p",
            text: "Search engines read more than your text: a sitemap that lists your pages, structured data that explains what your business is, what it sells and what it charges, canonical addresses, and titles that say what a page is about. None of this is visible to visitors, and most cheap sites skip all of it. It is the difference between Google guessing what you do and being told.",
          },
          {
            type: "p",
            text: "The honest timeline: technical fixes show in weeks, content compounds over months, and nobody serious promises a number-one spot. Anyone who does is charging you for a dice roll.",
          },
        ],
      },
      nl: {
        title: "SEO voor mkb: wat er in 2026 echt toe doet",
        excerpt:
          "Vergeet het jargon. Scoren in Google komt neer op vier dingen waar een klein bedrijf echt iets mee kan. Hier zijn ze, op volgorde van impact.",
        blocks: [
          {
            type: "p",
            text: "SEO heeft de reputatie van een duistere kunst die per maand wordt verkocht. Haal het jargon weg en wat Google beloont is saai verstandig: pagina's die snel laden, echte vragen beantwoorden, van een bedrijf komen dat aantoonbaar bestaat, en technisch leesbaar zijn. Dit betekent dat in de praktijk, op volgorde van impact voor een klein bedrijf.",
          },
          { type: "h2", text: "1. Wees het antwoord op een vraag die iemand intypt" },
          {
            type: "p",
            text: "Niemand zoekt op je bedrijfsnaam totdat ze je al kennen. Mensen zoeken vragen: wat kost een website, boekhouder in de buurt, garage op zaterdag open. Elke pagina die een echte vraag in gewone taal beantwoordt is een deur naar je site. Daarom wint content van trucjes: een dienstenpagina kan scoren op een handvol termen, elk goed artikel scoort op tientallen.",
          },
          { type: "h2", text: "2. Lokale aanwezigheid, als je een regio bedient" },
          {
            type: "ul",
            items: [
              "Maak een gratis Google Bedrijfsprofiel aan met je echte adres, openingstijden en foto's.",
              "Gebruik overal online exact dezelfde naam, hetzelfde adres en telefoonnummer.",
              "Vraag tevreden klanten om een Google-review; een gestage stroom werkt beter dan een piek.",
            ],
          },
          { type: "h2", text: "3. Snelheid en mobiel, gemeten in plaats van aangenomen" },
          {
            type: "p",
            text: "Google rangschikt de mobiele versie van je site en meet hoe die presteert op echte telefoons. Een trage site waar je moet inzoomen is onzichtbaar voorbij pagina twee, wat er ook op staat. Test op pagespeed.web.dev en geloof het mobiele cijfer.",
          },
          { type: "h2", text: "4. De technische laag die de meeste sites overslaan" },
          {
            type: "p",
            text: "Zoekmachines lezen meer dan je tekst: een sitemap die je pagina's opsomt, gestructureerde data die uitlegt wat je bedrijf is, wat het verkoopt en wat het rekent, canonieke adressen, en titels die zeggen waar een pagina over gaat. Niets hiervan is zichtbaar voor bezoekers, en de meeste goedkope sites slaan het allemaal over. Het is het verschil tussen Google die raadt wat je doet en Google die het verteld krijgt.",
          },
          {
            type: "p",
            text: "De eerlijke tijdlijn: technische fixes zie je in weken, content groeit over maanden, en niemand die serieus is belooft een eerste plek. Wie dat wel doet, laat je betalen voor een worp met de dobbelstenen.",
          },
        ],
      },
    },
  },
  {
    slug: "starting-an-online-store",
    date: "2026-08-19",
    readingMinutes: 6,
    category: { en: "E-commerce", nl: "E-commerce" },
    content: {
      en: {
        title: "Starting an online store: what you actually need",
        excerpt:
          "Most guides list forty tools and a dozen subscriptions. In reality, a first webshop needs five things done well, and several popular purchases can wait.",
        blocks: [
          {
            type: "p",
            text: "The e-commerce industry earns money by convincing you that starting a shop is complicated. It is work, but it is not forty tools' worth of work. Here is the short honest list, and the list of things that can wait.",
          },
          { type: "h2", text: "The five things a first shop needs" },
          {
            type: "ul",
            items: [
              "Product photos that look deliberate: one consistent style, clean background, no phone flash. This single factor moves sales more than any plugin.",
              "A checkout with iDEAL. In the Netherlands the majority of online purchases go through it; a shop without it loses Dutch customers at the last step.",
              "Delivery and returns in plain language before the checkout, not buried in terms. Surprise shipping costs are the top reason carts are abandoned.",
              "Legal basics: a privacy statement, terms, your KVK and VAT numbers visible. Dutch and EU law require them and customers check.",
              "A fast, mobile-first product page: most shop traffic is phones, and slow product images are unsold products.",
            ],
          },
          { type: "h2", text: "What can wait" },
          {
            type: "ul",
            items: [
              "Apps and plugins for upsells, popups and countdown timers: add nothing until the basics convert.",
              "Advertising: paying for traffic to an unproven shop is renting visitors you cannot yet keep.",
              "Multiple languages and currencies: sell well in one market first.",
            ],
          },
          { type: "h2", text: "Platform or custom build?" },
          {
            type: "p",
            text: "Shopify and WooCommerce are fine starting points, and for many first shops the right call. A custom store earns its price when the defaults stop fitting: your checkout needs to work differently, the design needs to carry a brand, or platform fees on every sale start to sting. We build custom stores from 899 euros, and our Nordwave concept in the projects section shows the standard: catalogue, cart and checkout, working end to end.",
          },
        ],
      },
      nl: {
        title: "Een webshop beginnen: wat je echt nodig hebt",
        excerpt:
          "De meeste gidsen noemen veertig tools en een dozijn abonnementen. In werkelijkheid heeft een eerste webshop vijf dingen nodig die goed geregeld zijn, en kan veel populairs wachten.",
        blocks: [
          {
            type: "p",
            text: "De e-commerce-industrie verdient aan het idee dat een webshop beginnen ingewikkeld is. Het is werk, maar geen veertig tools aan werk. Dit is de korte eerlijke lijst, en de lijst met dingen die kunnen wachten.",
          },
          { type: "h2", text: "De vijf dingen die een eerste shop nodig heeft" },
          {
            type: "ul",
            items: [
              "Productfoto's die doordacht ogen: één consistente stijl, rustige achtergrond, geen telefoonflitser. Deze ene factor doet meer voor je verkoop dan welke plugin ook.",
              "Een checkout met iDEAL. In Nederland loopt het merendeel van de online aankopen erdoorheen; een shop zonder verliest Nederlandse klanten bij de laatste stap.",
              "Bezorging en retouren in gewone taal vóór de checkout, niet verstopt in voorwaarden. Onverwachte verzendkosten zijn afhaakreden nummer één.",
              "De juridische basis: privacyverklaring, voorwaarden, je KVK- en btw-nummer zichtbaar. Nederlandse en Europese regels eisen het en klanten controleren het.",
              "Een snelle, mobile-first productpagina: het meeste shopverkeer is telefoon, en trage productfoto's zijn onverkochte producten.",
            ],
          },
          { type: "h2", text: "Wat kan wachten" },
          {
            type: "ul",
            items: [
              "Apps en plugins voor upsells, popups en afteltimers: voeg niets toe totdat de basis converteert.",
              "Adverteren: betalen voor verkeer naar een onbewezen shop is bezoekers huren die je nog niet kunt vasthouden.",
              "Meerdere talen en valuta: verkoop eerst goed in één markt.",
            ],
          },
          { type: "h2", text: "Platform of maatwerk?" },
          {
            type: "p",
            text: "Shopify en WooCommerce zijn prima startpunten, en voor veel eerste shops de juiste keuze. Een maatwerkshop verdient zijn prijs zodra de standaard knelt: je checkout moet anders werken, het ontwerp moet een merk dragen, of platformkosten op elke verkoop gaan opvallen. Wij bouwen maatwerkshops vanaf 899 euro, en ons Nordwave-concept bij de projecten laat de standaard zien: catalogus, winkelwagen en checkout, werkend van begin tot eind.",
          },
        ],
      },
    },
  },
];

export function getArticle(slug: string): Article | undefined {
  return ARTICLES.find((article) => article.slug === slug);
}

/** Locale-resolved content: Dutch readers get Dutch, everyone else English. */
export function resolveContent(article: Article, locale: string): {
  content: ArticleContent;
  category: string;
  isEnglishFallback: boolean;
} {
  if (locale === "nl") {
    return { content: article.content.nl, category: article.category.nl, isEnglishFallback: false };
  }
  return {
    content: article.content.en,
    category: article.category.en,
    isEnglishFallback: locale !== "en",
  };
}
