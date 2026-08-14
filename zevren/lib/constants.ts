import type {
  FaqItem,
  NavLink,
  PortfolioItem,
  ProcessStep,
  Service,
  Testimonial,
} from "@/types";

export const SITE_CONFIG = {
  name: "ZEVREN",
  legalName: "ZEVREN Digital B.V.",
  tagline: "Websites die verkopen, niet alleen die er goed uitzien.",
  description:
    "ZEVREN bouwt websites en webshops voor ondernemers in Nederland en Europa. Snel, veilig en gemaakt om klanten op te leveren — geen sjablonen, geen ruis.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.zevren.nl",
  email: "hallo@zevren.nl",
  phone: "+31 20 123 4567",
  phoneDisplay: "020 123 4567",
  address: {
    street: "Keizersgracht 241",
    postalCode: "1016 EA",
    city: "Amsterdam",
    country: "Nederland",
  },
  kvk: "88123456",
  btw: "NL863456789B01",
  social: {
    linkedin: "https://www.linkedin.com/company/zevren",
    instagram: "https://www.instagram.com/zevren.nl",
  },
  foundedYear: 2021,
} as const;

export const NAV_LINKS: NavLink[] = [
  { label: "Home", href: "/" },
  { label: "Diensten", href: "/services" },
  { label: "Portfolio", href: "/portfolio" },
  { label: "Reviews", href: "/reviews" },
  { label: "Over ons", href: "/about" },
  { label: "Contact", href: "/contact" },
];

export const FOOTER_LEGAL_LINKS: NavLink[] = [
  { label: "Privacybeleid", href: "/privacy-policy" },
  { label: "Algemene voorwaarden", href: "/terms-and-conditions" },
];

export const SERVICES: Service[] = [
  {
    slug: "websites",
    title: "Maatwerk websites",
    summary:
      "Een website die is opgebouwd rond jouw aanbod, niet rond een thema.",
    description:
      "We beginnen bij wat je bezoeker moet doen — bellen, boeken, bestellen — en bouwen de site daaromheen. Geen bouwblokken-thema met jouw logo erop, maar een ontwerp en codebase die van jou zijn.",
    features: [
      "Ontwerp op maat, geen thema",
      "Next.js voor snelheid en betrouwbaarheid",
      "Zelf teksten en beelden aanpassen via een CMS naar keuze",
      "Volledig responsive, getest op echte apparaten",
    ],
    icon: "code",
  },
  {
    slug: "webshops",
    title: "Webshops",
    summary: "E-commerce die is ingericht op conversie, niet op vinkjes.",
    description:
      "Van productpagina tot afrekenen: elke stap is er een die we los durven te verantwoorden. We bouwen op een platform dat past bij je assortiment en volume, en houden het beheerbaar voor je eigen team.",
    features: [
      "Betaalproviders zoals iDEAL, Mollie en Stripe",
      "Voorraad- en ordersynchronisatie",
      "Snelle productpagina's, ook met veel varianten",
      "Ingericht op herhaalaankopen, niet alleen eerste verkoop",
    ],
    icon: "cart",
  },
  {
    slug: "ux-ui-design",
    title: "UX & UI design",
    summary: "Ontwerp dat beslissingen makkelijker maakt, niet mooier lijkt.",
    description:
      "Voordat er een pixel wordt getekend, brengen we de route van je bezoeker in kaart. Het resultaat is een interface die duidelijk maakt wat de volgende stap is — op elk schermformaat.",
    features: [
      "Wireframes en klikbare prototypes",
      "Design system met herbruikbare componenten",
      "Toegankelijkheid vanaf de eerste schets",
      "Gebruikerstests met echte bezoekers waar mogelijk",
    ],
    icon: "layers",
  },
  {
    slug: "seo",
    title: "SEO & vindbaarheid",
    summary: "Technisch fundament eerst, daarna pas de rest.",
    description:
      "Een snelle, technisch schone site is het beste startpunt voor SEO dat er is. We regelen de basis goed — structuur, snelheid, metadata — en geven je concrete vervolgstappen, geen dashboard vol vage scores.",
    features: [
      "Technische SEO-audit en directe fixes",
      "Structured data en metadata per pagina",
      "Core Web Vitals geoptimaliseerd",
      "Contentadvies gebaseerd op zoekintentie",
    ],
    icon: "search",
  },
  {
    slug: "onderhoud",
    title: "Onderhoud & support",
    summary: "Iemand die opneemt als de site een keer hapert.",
    description:
      "Een website is nooit echt 'klaar'. We monitoren uptime en beveiligingsupdates, maken back-ups en lossen kleine wijzigingen op zonder dat je daar een ticketsysteem voor hoeft te openen.",
    features: [
      "Beveiligingsupdates en dependency-onderhoud",
      "Dagelijkse back-ups met herstelgarantie",
      "Uptime-monitoring met directe melding",
      "Vast aanspreekpunt, geen wisselend supportteam",
    ],
    icon: "wrench",
  },
  {
    slug: "web-applicaties",
    title: "Webapplicaties",
    summary: "Maatwerk software voor processen die geen kant-en-klare tool aankan.",
    description:
      "Klantportalen, interne tools, boekingssystemen — als een bestaand pakket je proces niet past, bouwen we iets dat dat wel doet. Met dezelfde aandacht voor snelheid en beveiliging als onze websites.",
    features: [
      "Klantportalen en dashboards op maat",
      "Koppelingen met bestaande systemen via API's",
      "Rolgebaseerde toegang en autorisatie",
      "Schaalbare architectuur vanaf dag één",
    ],
    icon: "compass",
  },
];

export const PORTFOLIO_ITEMS: PortfolioItem[] = [
  {
    slug: "noordkaap-makelaars",
    name: "Noordkaap Makelaars",
    category: "Vastgoed",
    summary:
      "Een woningaanbod-site met live koppeling naar hun CRM, zodat nieuwe woningen zonder handmatig werk online staan.",
    result: "43% meer aanvragen via het contactformulier binnen 3 maanden.",
    year: "2025",
    tags: ["Next.js", "CRM-koppeling", "SEO"],
  },
  {
    slug: "havenlicht-koffie",
    name: "Havenlicht Koffie",
    category: "E-commerce",
    summary:
      "Webshop voor een koffiebranderij uit Rotterdam, met abonnementen en een voorraadsysteem gekoppeld aan hun kassasysteem.",
    result: "Laadtijd van 4,1s naar 0,9s, conversie steeg met 27%.",
    year: "2024",
    tags: ["Webshop", "Abonnementen", "Performance"],
  },
  {
    slug: "bureau-linden",
    name: "Bureau Linden",
    category: "Zakelijke dienstverlening",
    summary:
      "Herontwerp van de website van een accountantskantoor, met een klantportaal voor het uitwisselen van documenten.",
    result: "Portaal verwerkt nu 90% van de documentuitwisseling, geen e-mailbijlagen meer.",
    year: "2024",
    tags: ["Klantportaal", "Beveiliging", "UX"],
  },
  {
    slug: "molenwerf-interieur",
    name: "Molenwerf Interieur",
    category: "E-commerce",
    summary:
      "Webshop voor maatwerk meubels met een configurator waarmee klanten stof, kleur en afmetingen kunnen kiezen.",
    result: "Gemiddelde bestelwaarde met €340 gestegen door de configurator.",
    year: "2023",
    tags: ["Configurator", "Webshop", "UI design"],
  },
  {
    slug: "studio-verhoeven",
    name: "Studio Verhoeven",
    category: "Architectuur",
    summary:
      "Portfolio-site voor een architectenbureau, gebouwd rond grote beeldvoering zonder in te leveren op laadtijd.",
    result: "Bounce rate met 31% verlaagd na de relaunch.",
    year: "2023",
    tags: ["Portfolio", "Beeldoptimalisatie", "Design"],
  },
  {
    slug: "de-vries-advocaten",
    name: "De Vries Advocaten",
    category: "Juridisch",
    summary:
      "Nieuwe website met heldere specialisatiepagina's, zodat bezoekers direct bij de juiste advocaat terechtkomen.",
    result: "Directe telefonische aanvragen verdubbeld ten opzichte van de oude site.",
    year: "2022",
    tags: ["Content-structuur", "SEO", "Toegankelijkheid"],
  },
];

export const TESTIMONIALS: Testimonial[] = [
  {
    name: "Rob Hendriksen",
    role: "Eigenaar",
    company: "Noordkaap Makelaars",
    quote:
      "ZEVREN vroeg in het eerste gesprek al naar onze cijfers, niet naar onze kleurvoorkeur. Dat gaf vertrouwen. Het resultaat werkt gewoon, en als er iets is reageren ze dezelfde dag.",
    rating: 5,
  },
  {
    name: "Merel Bakker",
    role: "Marketing",
    company: "Havenlicht Koffie",
    quote:
      "We hadden al twee bureaus gehad die vooral mooie plaatjes leverden. ZEVREN leverde een shop die daadwerkelijk sneller laadt en meer omzet, met uitleg die ik zonder IT-achtergrond kon volgen.",
    rating: 5,
  },
  {
    name: "Thomas van Linden",
    role: "Partner",
    company: "Bureau Linden",
    quote:
      "Het klantportaal moest aan strenge eisen voldoen wat betreft beveiliging. Ze hebben dat serieus genomen zonder er een heel project van te maken. Prettige, directe samenwerking.",
    rating: 5,
  },
  {
    name: "Anouk Verhoeven",
    role: "Architect",
    company: "Studio Verhoeven",
    quote:
      "Ik wilde een site waarop ons werk centraal staat zonder dat die traag wordt van alle beelden. Dat hebben ze precies zo opgelost. Onderhoud loopt sindsdien soepel.",
    rating: 5,
  },
  {
    name: "Daan de Vries",
    role: "Managing partner",
    company: "De Vries Advocaten",
    quote:
      "Concreet, nuchter en ze houden zich aan planning. Geen verrassingen achteraf op de factuur. Voor een kantoor als het onze is dat net zo belangrijk als het eindresultaat.",
    rating: 5,
  },
];

export const PROCESS_STEPS: ProcessStep[] = [
  {
    step: "01",
    title: "Kennismaking & scope",
    description:
      "We bespreken wat je nodig hebt en wat je bezoeker moet doen. Daaruit volgt een vast voorstel met prijs en planning — geen losse uren zonder eindpunt.",
  },
  {
    step: "02",
    title: "Structuur & wireframes",
    description:
      "Voordat er design komt, bepalen we de opbouw: welke pagina's, welke content, welke route naar conversie. Dit leggen we vast in wireframes die je kunt goedkeuren.",
  },
  {
    step: "03",
    title: "Design",
    description:
      "We ontwerpen in jouw huisstijl, met aandacht voor herkenbaarheid en leesbaarheid. Je ziet en reageert op ontwerpen voordat we beginnen met bouwen.",
  },
  {
    step: "04",
    title: "Development",
    description:
      "We bouwen de site met Next.js, testen op echte apparaten en browsers, en houden je tussentijds op de hoogte via een preview-omgeving.",
  },
  {
    step: "05",
    title: "Lancering & nazorg",
    description:
      "Na livegang controleren we alles nogmaals: snelheid, formulieren, tracking. Daarna blijven we bereikbaar voor onderhoud of uitbreidingen.",
  },
];

export const FAQ_ITEMS: FaqItem[] = [
  {
    question: "Wat kost een website bij ZEVREN?",
    answer:
      "Dat hangt af van de omvang. Een website op maat begint doorgaans rond €3.500, een webshop rond €6.500. Na het eerste gesprek ontvang je een vast voorstel, zodat je vooraf weet waar je aan toe bent.",
  },
  {
    question: "Hoe lang duurt een project?",
    answer:
      "Een website op maat duurt gemiddeld 4 tot 6 weken, een webshop 6 tot 10 weken. Dit hangt sterk af van hoe snel we content en feedback van jouw kant ontvangen.",
  },
  {
    question: "Kan ik zelf de content aanpassen na oplevering?",
    answer:
      "Ja. We koppelen een CMS naar keuze zodat je teksten, afbeeldingen en producten zelf kunt beheren, zonder dat je daarvoor moet kunnen programmeren.",
  },
  {
    question: "Bij wie ligt het onderhoud na livegang?",
    answer:
      "Dat is aan jou. Je kunt kiezen voor een onderhoudsabonnement waarbij wij updates, back-ups en monitoring verzorgen, of we dragen de site volledig aan je over.",
  },
  {
    question: "Werken jullie ook met bedrijven buiten Nederland?",
    answer:
      "Zeker. We werken met klanten in heel Europa en vergaderen dan via videobellen. Onze documentatie en communicatie zijn ook in het Engels beschikbaar.",
  },
  {
    question: "Bouwen jullie ook mee aan bestaande websites?",
    answer:
      "Ja, we nemen regelmatig bestaande projecten over — voor een redesign, een snelheidsprobleem of om verder te bouwen aan een applicatie die iemand anders is gestart.",
  },
];
