export type TajexLang = "nl" | "en";

export interface TajexService {
  id: string;
  /** Short mono tag shown in the services list, e.g. DOUANE / WEG / ZEE. */
  category: string;
  name: string;
  tagline: string;
  /** One-liner used in the services list rows. */
  summary: string;
  description: string;
  details: string[];
}

export interface TajexPost {
  date: string;
  read: string;
  title: string;
  excerpt: string;
  /** Which generated scene to draw as the thumbnail. */
  art: "aerial" | "crane" | "stack" | "roro" | "network" | "control";
}

export interface TajexCopy {
  nav: { home: string; about: string; services: string; blog: string; contact: string };
  trackingBtn: string;
  breadcrumbHome: string;
  hero: {
    since: string;
    departure: string;
    arrival: string;
    titleStart: string;
    titleAccent: string;
    titleEnd: string;
    intro: string;
    ctaQuote: string;
    ctaTrack: string;
    checks: string[];
    corridorLabel: string;
    corridorNote: string;
    stops: { code: string; name: string; role: string }[];
  };
  schedule: {
    eyebrow: string;
    title: string;
    bookBtn: string;
    nextLabel: string;
    thenLabel: string;
    sailings: { date: string; weekday: string; cutoff: string }[];
  };
  cargo: {
    eyebrow: string;
    title: string;
    subtitle: string;
    items: {
      id: string;
      title: string;
      description: string;
      link: string;
      serviceId: string;
      icon: "car" | "truck" | "container" | "pallet";
    }[];
  };
  about: {
    eyebrow: string;
    title: string;
    paragraphs: string[];
    checks: string[];
    badgeValue: string;
    badgeLabel: string;
    heroTitle: string;
    heroSubtitle: string;
    chips: string[];
    storyEyebrow: string;
    storyTitle: string;
    storyParagraphs: string[];
    storyChecks: string[];
  };
  stats: {
    eyebrow: string;
    title: string;
    items: { value: string; title: string; description: string }[];
  };
  process: {
    eyebrow: string;
    title: string;
    subtitle: string;
    steps: { number: string; title: string; description: string; meta: string }[];
  };
  why: {
    eyebrow: string;
    title: string;
    cards: { title: string; description: string; meta: string }[];
  };
  blog: {
    eyebrow: string;
    title: string;
    allBtn: string;
    heroSubtitle: string;
    intro: string;
    posts: TajexPost[];
  };
  faq: {
    eyebrow: string;
    title: string;
    subtitle: string;
    items: { question: string; answer: string }[];
  };
  ctaBanner: { title: string; body: string; button: string };
  contact: {
    eyebrow: string;
    title: string;
    subtitle: string;
    addressLabel: string;
    addressLines: string[];
    emailLabel: string;
    email: string;
    phoneLabel: string;
    phone: string;
    trackLabel: string;
    trackValue: string;
    openInMaps: string;
    checklistEyebrow: string;
    checklistTitle: string;
    checklistSubtitle: string;
    checklist: { number: string; title: string; description: string }[];
    afterEyebrow: string;
    afterTitle: string;
    afterBody: string;
  };
  services: {
    eyebrow: string;
    heroTitle: string;
    heroSubtitle: string;
    list: TajexService[];
    quoteBtn: string;
    backBtn: string;
    whatYouGet: string;
  };
  tracking: {
    panelTitle: string;
    panelEyebrow: string;
    inputLabel: string;
    placeholder: string;
    searchBtn: string;
    helper: string;
    helperTry: string;
    close: string;
    notFound: string;
    referenceLabel: string;
    routeLabel: string;
    cargoLabel: string;
    statusLabel: string;
    statusValue: string;
    events: string[];
    doneCount: number;
  };
  quote: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    comments: string;
    commentsPlaceholder: string;
    submit: string;
    successTitle: string;
    successBody: string;
    another: string;
    errors: { firstName: string; lastName: string; email: string; comments: string };
  };
  footer: {
    tagline: string;
    navTitle: string;
    servicesTitle: string;
    contactTitle: string;
    company: string;
    copyright: string;
    location: string;
  };
  demoNote: string;
}

const SERVICES_NL: TajexService[] = [
  {
    id: "customs",
    category: "Douane",
    name: "Douaneformaliteiten",
    tagline: "Aangiftes, classificatie en vergunningen",
    summary:
      "Aangiftes, classificatie en vergunningen, zodat je zending niet stilstaat aan de grens.",
    description:
      "Volledige douanedocumentatie en afhandeling voor zendingen de EU in en uit. Wij controleren de papieren voordat de lading vertrekt, niet als hij al bij de grens staat.",
    details: [
      "Invoer- en uitvoeraangiftes",
      "Classificatie en oorsprongsdocumenten",
      "Vergunningen en ontheffingen",
      "Afstemming met de douaneautoriteiten",
    ],
  },
  {
    id: "transport",
    category: "Weg",
    name: "Tajex Transport",
    tagline: "Volle en deelladingen door heel Europa",
    summary:
      "Volle en deelladingen door heel Europa, met eigen planning en een vast aanspreekpunt.",
    description:
      "Wegtransport voor voertuigen, machines en algemene lading door heel Europa, met materieel dat past bij wat er vervoerd moet worden.",
    details: [
      "Volle vrachten en deelladingen",
      "Voertuig- en machinetransport",
      "Flexibele ophaal- en afleverdagen",
      "Verzekerde ladingbehandeling",
    ],
  },
  {
    id: "containers",
    category: "Zee",
    name: "Tajex Containers",
    tagline: "FCL en LCL zeevracht via Rotterdam en Antwerpen",
    summary:
      "FCL en LCL zeevracht via Rotterdam en Antwerpen, inclusief opslag en overslag.",
    description:
      "Volle en gedeelde containerladingen, van het boeken van de container tot het coördineren van het zeetraject en de overslag in de haven.",
    details: [
      "FCL- en LCL-boekingen",
      "Coördinatie met de terminal",
      "Opslag en overslag",
      "Toezicht bij het laden en stuwen",
    ],
  },
  {
    id: "forwarding",
    category: "Multimodaal",
    name: "Forwarding",
    tagline: "Weg, zee en douane onder één verantwoordelijkheid",
    summary:
      "Weg, zee en douane gecombineerd tot één traject onder één verantwoordelijkheid.",
    description:
      "Wij coördineren de volledige route bij zendingen met meerdere trajecten of vervoerswijzen, zodat jij met één aanspreekpunt te maken hebt in plaats van met vier partijen.",
    details: [
      "Routeplanning over meerdere trajecten",
      "Afstemming tussen vervoerders",
      "Pallets en stukgoed",
      "Eén aanspreekpunt van begin tot eind",
    ],
  },
  {
    id: "roro",
    category: "RoRo",
    name: "RoRo & Automotive Shipping",
    tagline: "Rijdend aan boord, varend naar het Midden-Oosten",
    summary:
      "Auto's, vrachtwagens en machines rijden aan boord en varen mee naar het Midden-Oosten.",
    description:
      "Roll-on roll-off verscheping voor auto's, trucks en zware machines. Alles wat op eigen kracht rijdt, gaat rijdend het schip op.",
    details: [
      "Verscheping van auto's en trucks",
      "Transport van zware machines",
      "Boeking op RoRo-schepen",
      "Vastlegging van de staat van het voertuig",
    ],
  },
  {
    id: "trade-bridge",
    category: "Handel",
    name: "Handelsbrug Europa-Midden-Oosten",
    tagline: "Lokale kennis aan beide kanten van de route",
    summary:
      "Lokale kennis en afhandeling aan beide kanten van de route, met eigen kantoor in Latakia.",
    description:
      "Een vaste handelsroute die Europa verbindt met het Midden-Oosten. Bij aankomst staat er iemand van ons, niet een agent die we nog moeten briefen.",
    details: [
      "Vertrek vanuit Rotterdam en Antwerpen",
      "Routing over de Middellandse Zee",
      "Eigen afhandeling in Latakia",
      "Douaneondersteuning aan beide kanten",
    ],
  },
];

const SERVICES_EN: TajexService[] = [
  {
    id: "customs",
    category: "Customs",
    name: "Customs formalities",
    tagline: "Declarations, classification and permits",
    summary: "Declarations, classification and permits, so your shipment does not stall at the border.",
    description:
      "Complete customs documentation and clearance for shipments in and out of the EU. We check the paperwork before the cargo leaves, not once it is already at the border.",
    details: [
      "Import and export declarations",
      "Classification and certificates of origin",
      "Permits and exemptions",
      "Coordination with customs authorities",
    ],
  },
  {
    id: "transport",
    category: "Road",
    name: "Tajex Transport",
    tagline: "Full and part loads across Europe",
    summary: "Full and part loads across Europe, with our own planning and a fixed point of contact.",
    description:
      "Road transport for vehicles, machinery and general cargo across Europe, with equipment matched to what needs moving.",
    details: [
      "Full loads and part loads",
      "Vehicle and machinery transport",
      "Flexible pickup and delivery days",
      "Insured cargo handling",
    ],
  },
  {
    id: "containers",
    category: "Sea",
    name: "Tajex Containers",
    tagline: "FCL and LCL sea freight via Rotterdam and Antwerp",
    summary: "FCL and LCL sea freight via Rotterdam and Antwerp, including storage and transhipment.",
    description:
      "Full and shared container loads, from booking the container through to coordinating the sea leg and the transhipment in port.",
    details: [
      "FCL and LCL bookings",
      "Terminal coordination",
      "Storage and transhipment",
      "Supervision during loading and stuffing",
    ],
  },
  {
    id: "forwarding",
    category: "Multimodal",
    name: "Forwarding",
    tagline: "Road, sea and customs under one responsibility",
    summary: "Road, sea and customs combined into one route under a single responsibility.",
    description:
      "We coordinate the full route for shipments with several legs or modes of transport, so you deal with one point of contact instead of four parties.",
    details: [
      "Route planning across several legs",
      "Coordination between carriers",
      "Pallets and general cargo",
      "One point of contact end to end",
    ],
  },
  {
    id: "roro",
    category: "RoRo",
    name: "RoRo & Automotive Shipping",
    tagline: "Driven on board, shipped to the Middle East",
    summary: "Cars, trucks and machinery drive on board and sail with us to the Middle East.",
    description:
      "Roll-on roll-off shipping for cars, trucks and heavy machinery. Anything that moves under its own power drives straight onto the vessel.",
    details: [
      "Shipping cars and trucks",
      "Heavy machinery transport",
      "Booking on RoRo vessels",
      "Recording the condition of the vehicle",
    ],
  },
  {
    id: "trade-bridge",
    category: "Trade",
    name: "Europe to Middle East trade bridge",
    tagline: "Local knowledge on both ends of the route",
    summary: "Local knowledge and handling on both ends of the route, with our own office in Latakia.",
    description:
      "A fixed trade route connecting Europe with the Middle East. On arrival there is someone of ours waiting, not an agent we still have to brief.",
    details: [
      "Departures from Rotterdam and Antwerp",
      "Routing across the Mediterranean",
      "Our own handling in Latakia",
      "Customs support on both ends",
    ],
  },
];

export const TAJEX_COPY: Record<TajexLang, TajexCopy> = {
  nl: {
    nav: { home: "Home", about: "Over ons", services: "Diensten", blog: "Blog", contact: "Contact" },
    trackingBtn: "Tracking",
    breadcrumbHome: "Home",
    hero: {
      since: "Sinds 2005",
      departure: "Vertrek Rotterdam · Antwerpen",
      arrival: "Aankomst Latakia",
      titleStart: "Jouw zending,",
      titleAccent: "betrouwbaar",
      titleEnd: "geregeld",
      intro:
        "Wij varen een vaste corridor tussen Noordwest-Europa en het Midden-Oosten. Auto's, machines, containers en stukgoed, inclusief de douaneafhandeling aan beide kanten.",
      ctaQuote: "Vraag een offerte aan",
      ctaTrack: "Volg een zending",
      checks: ["20+ jaar op deze route", "Eigen kantoor in Latakia", "Offerte binnen 1 werkdag", "NL · EN · AR"],
      corridorLabel: "Onze vaste corridor",
      corridorNote: "Afvaart elke 3 weken",
      stops: [
        { code: "NLRTM", name: "Rotterdam", role: "Laden" },
        { code: "BEANR", name: "Antwerpen", role: "Laden" },
        { code: "MED", name: "Middellandse Zee", role: "Transit" },
        { code: "SYLTK", name: "Latakia", role: "Lossen" },
      ],
    },
    schedule: {
      eyebrow: "Vaarschema",
      title: "Eerstvolgende afvaarten",
      bookBtn: "Plaats een boeking",
      nextLabel: "Eerstvolgende afvaart",
      thenLabel: "Daarna",
      sailings: [
        { date: "26 augustus", weekday: "woensdag · over 10 dagen", cutoff: "Lading bij ons vóór 21 augustus" },
        { date: "16 september", weekday: "woensdag · over 31 dagen", cutoff: "Lading bij ons vóór 11 september" },
        { date: "7 oktober", weekday: "woensdag · over 52 dagen", cutoff: "Lading bij ons vóór 2 oktober" },
      ],
    },
    cargo: {
      eyebrow: "Snel naar de juiste dienst",
      title: "Wat wil je verschepen?",
      subtitle: "Kies wat het dichtst in de buurt komt, dan zie je meteen hoe wij het aanpakken.",
      items: [
        {
          id: "auto",
          title: "Een auto",
          description: "Personenauto's en luxe voertuigen, per container of RoRo.",
          link: "RoRo & Automotive",
          serviceId: "roro",
          icon: "car",
        },
        {
          id: "machine",
          title: "Een machine of truck",
          description: "Vrachtwagens, bouwmachines en landbouwvoertuigen die zelf rijden.",
          link: "RoRo-transport",
          serviceId: "roro",
          icon: "truck",
        },
        {
          id: "container",
          title: "Containerlading",
          description: "Volle of gedeelde containers via Rotterdam en Antwerpen.",
          link: "Zeevracht",
          serviceId: "containers",
          icon: "container",
        },
        {
          id: "pallets",
          title: "Pallets of stukgoed",
          description: "Deelladingen en volle vrachten over de weg door heel Europa.",
          link: "Wegtransport",
          serviceId: "forwarding",
          icon: "pallet",
        },
      ],
    },
    about: {
      eyebrow: "Over ons",
      title: "Wie zijn wij en wat doen we?",
      paragraphs: [
        "Welkom bij Tajex Logistics, jouw betrouwbare partner voor internationale logistiek. Met meer dan 20 jaar ervaring in de logistieke sector bieden wij een uitgebreid scala aan diensten, waaronder douaneformaliteiten en containertransport.",
        "Gevestigd in Nederland, combineren wij lokale expertise met internationale kennis om jou optimaal van dienst te zijn.",
      ],
      checks: [
        "Eén aanspreekpunt van offerte tot aflevering",
        "Eigen tracking, dus geen giswerk over waar je lading is",
        "Volledig conform de geldende douanewetgeving",
      ],
      badgeValue: "20+",
      badgeLabel: "Jaar in de keten",
      heroTitle: "Twee decennia op dezelfde route",
      heroSubtitle: "Welkom bij Tajex Logistics, jouw betrouwbare partner voor internationale logistiek.",
      chips: ["Opgericht 2005", "Maastricht Airport", "Kantoor in Latakia"],
      storyEyebrow: "Ons verhaal",
      storyTitle: "Lokale expertise, internationaal netwerk",
      storyParagraphs: [
        "Met meer dan 20 jaar ervaring in de logistieke sector bieden wij een uitgebreid scala aan diensten, waaronder douaneformaliteiten en containertransport. Gevestigd in Nederland, combineren wij lokale expertise met internationale kennis om jou optimaal van dienst te zijn.",
        "Vanuit onze vestiging bij Maastricht Airport en ons kantoor in Latakia bedienen wij klanten in heel Europa en het Midden-Oosten. Dat tweede kantoor is het verschil: bij aankomst staat er iemand van ons, niet een agent die we nog moeten briefen.",
      ],
      storyChecks: [
        "Persoonlijk aanspreekpunt gedurende het hele traject",
        "Partners binnen én buiten de EU",
        "Eigen afhandeling bij aankomst in Latakia",
      ],
    },
    stats: {
      eyebrow: "Tajex in cijfers",
      title: "Twintig jaar opgeteld",
      items: [
        {
          value: "1760+",
          title: "Afgehandelde zendingen",
          description: "Sinds onze start jaarlijks meer dan 500 succesvol afgehandelde zendingen.",
        },
        {
          value: "80+",
          title: "Bedrijven geadviseerd",
          description: "Meer dan 40 bedrijven per jaar geadviseerd over import, export en douanewetgeving.",
        },
        {
          value: "30+",
          title: "Partners binnen de EU",
          description: "Een Europees partnernetwerk voor efficiënte en betrouwbare doorvoer.",
        },
        {
          value: "15+",
          title: "Partners buiten de EU",
          description: "Maatwerk buiten de EU voor een soepel handelsproces.",
        },
      ],
    },
    process: {
      eyebrow: "Werkwijze",
      title: "Van aanvraag tot aflevering",
      subtitle: "Elke zending doorloopt dezelfde vijf stappen. Je weet dus altijd waar we zijn.",
      steps: [
        {
          number: "01",
          title: "Aanvraag en offerte",
          description:
            "Je stuurt ons de details van je lading, herkomst en bestemming. Wij rekenen de route door en sturen een prijs met de gekozen vervoerswijze.",
          meta: "Doorgaans binnen 1 werkdag",
        },
        {
          number: "02",
          title: "Boeking en planning",
          description: "We reserveren ruimte op het schip of in de container en plannen de ophaling bij jou op locatie.",
          meta: "Afvaart elke 3 weken",
        },
        {
          number: "03",
          title: "Douaneformaliteiten",
          description:
            "Wij verzorgen de aangiftes, vergunningen en oorsprongsdocumenten, en controleren alles voordat de lading vertrekt.",
          meta: "Volledig douaneconform",
        },
        {
          number: "04",
          title: "Transport en transit",
          description:
            "De lading gaat via Rotterdam of Antwerpen de corridor op. Je volgt de status via je eigen referentienummer.",
          meta: "Eigen track en trace",
        },
        {
          number: "05",
          title: "Lossen en aflevering",
          description:
            "In Latakia handelt ons eigen kantoor het lossen en de inklaring af, tot de lading bij de ontvanger staat.",
          meta: "Eigen kantoor op bestemming",
        },
      ],
    },
    why: {
      eyebrow: "Waarom Tajex",
      title: "Waar bedrijven ons op afrekenen",
      cards: [
        {
          title: "Betrouwbaar",
          description:
            "Een vaste corridor met een voorspelbaar vaarschema, in plaats van per zending opnieuw ruimte zoeken.",
          meta: "20+ jaar · 1760+ zendingen",
        },
        {
          title: "Transparant",
          description: "Eigen tracking en directe lijnen met de mensen die je zending daadwerkelijk behandelen.",
          meta: "Eén vast aanspreekpunt",
        },
        {
          title: "Compliant",
          description:
            "Aangiftes, vergunningen en oorsprongsdocumenten die kloppen, ook bij wijzigende regelgeving.",
          meta: "Volledig douaneconform",
        },
      ],
    },
    blog: {
      eyebrow: "Blog & updates",
      title: "Uit de praktijk",
      allBtn: "Alle artikelen",
      heroSubtitle: "Nieuws en inzichten over internationale logistiek, douane en handel met het Midden-Oosten.",
      intro:
        "Wij schrijven over de dingen waar klanten ons het vaakst over bellen: douaneformaliteiten en wijzigende regelgeving, het verschil tussen RoRo en containervervoer, exporteren naar het Midden-Oosten en wat er in de praktijk misgaat bij een zending. Geen nieuwsberichten over onszelf, maar uitleg waar je iets aan hebt voordat je boekt.",
      posts: [
        {
          date: "21 okt 2025",
          read: "2 min lezen",
          title: "Zo wordt uw zending vervoerd met TAJEX Logistics",
          excerpt: "Een kijkje achter de schermen: hoe een zending van ophaling tot aflevering door onze handen gaat.",
          art: "aerial",
        },
        {
          date: "15 apr 2025",
          read: "1 min lezen",
          title: "Op weg naar een onzichtbare grenssluiting? De toekomst van douane en accijnzen in de EU",
          excerpt: "Wat de digitalisering van douaneprocessen betekent voor importeurs en exporteurs.",
          art: "crane",
        },
        {
          date: "8 apr 2025",
          read: "1 min lezen",
          title: "Handel met Syrië vanuit Nederland, exporteren met Tajex Logistics",
          excerpt: "Kansen en aandachtspunten bij het opzetten van handel met Syrië vanuit Nederland.",
          art: "stack",
        },
        {
          date: "2 mrt 2025",
          read: "1 min lezen",
          title: "RoRo transport naar het Midden-Oosten: wat je moet weten voordat je verscheept",
          excerpt: "De belangrijkste stappen en documenten voor een soepel RoRo-traject.",
          art: "roro",
        },
        {
          date: "14 feb 2025",
          read: "1 min lezen",
          title: "20 jaar Tajex Logistics: een terugblik op twee decennia logistiek",
          excerpt: "Van lokale expediteur tot handelsbrug tussen Europa en het Midden-Oosten.",
          art: "network",
        },
        {
          date: "20 jan 2025",
          read: "1 min lezen",
          title: "Wat verandert er in 2025 op het gebied van douanewetgeving?",
          excerpt: "Een overzicht van de belangrijkste wijzigingen voor import en export.",
          art: "control",
        },
      ],
    },
    faq: {
      eyebrow: "Vragen",
      title: "Veelgestelde vragen",
      subtitle: "Wat klanten ons het vaakst vragen voordat ze boeken.",
      items: [
        {
          question: "Naar welke landen verschepen jullie?",
          answer:
            "Onze vaste corridor loopt van Rotterdam en Antwerpen via de Middellandse Zee naar Latakia. Vanaf daar verzorgen we het natransport naar bestemmingen in de regio.",
        },
        {
          question: "Wat kost het verschepen van een auto?",
          answer:
            "Dat hangt af van de afmetingen, de waarde en of je kiest voor RoRo of een container. Vraag een offerte aan en je krijgt doorgaans binnen één werkdag een prijs.",
        },
        {
          question: "Hoe vaak vertrekt er een schip?",
          answer: "Elke drie weken. Je lading moet uiterlijk vijf dagen voor afvaart bij ons binnen zijn.",
        },
        {
          question: "Verzorgen jullie ook de douanepapieren?",
          answer:
            "Ja. Aangiftes, vergunningen en oorsprongsdocumenten regelen wij aan beide kanten van de route.",
        },
        {
          question: "Kan ik mijn zending volgen?",
          answer:
            "Ja. Bij de boeking krijg je een referentienummer waarmee je de status van je zending kunt opvragen.",
        },
        {
          question: "Waar zijn jullie gevestigd?",
          answer:
            "Ons kantoor staat op Europalaan 35-12 bij Maastricht Airport. Daarnaast hebben we een eigen kantoor in Latakia.",
        },
        {
          question: "In welke talen kan ik contact opnemen?",
          answer: "Nederlands, Engels en Arabisch.",
        },
        {
          question: "Werken jullie alleen voor grote bedrijven?",
          answer:
            "Nee. Een enkele auto of een pallet kan net zo goed mee als een volle containerlading, ook voor particulieren.",
        },
      ],
    },
    ctaBanner: {
      title: "Benieuwd wat we voor jou kunnen betekenen?",
      body: "Vertel ons over je zending, we denken mee over de route en de papieren.",
      button: "Neem contact op",
    },
    contact: {
      eyebrow: "Contact",
      title: "Ben je geïnteresseerd?",
      subtitle: "Vertel ons wat je wilt vervoeren en van waar naar waar. Wij rekenen de route door.",
      addressLabel: "Adres",
      addressLines: ["TAJEX LOGISTICS BV", "Europalaan 35-12, 6199 AB", "Maastricht Airport, Nederland"],
      emailLabel: "E-mail",
      email: "Info@tajexlogistics.nl",
      phoneLabel: "Telefoon",
      phone: "+31 (0) 6288 322 67",
      trackLabel: "Zending volgen",
      trackValue: "Open track & trace",
      openInMaps: "Bekijk op Google Maps",
      checklistEyebrow: "Een scherpe offerte",
      checklistTitle: "Wat we van je nodig hebben",
      checklistSubtitle:
        "Hoe completer je aanvraag, hoe minder heen-en-weer en hoe sneller je een prijs hebt. Weet je iets nog niet? Stuur het gerust zo op, we vullen de rest samen aan.",
      checklist: [
        {
          number: "01",
          title: "Wat je verstuurt",
          description:
            "Het soort goederen, de afmetingen, het gewicht en de waarde. Bij voertuigen: merk, model, bouwjaar en of het op eigen kracht rijdt. Die laatste vraag bepaalt of RoRo mogelijk is.",
        },
        {
          number: "02",
          title: "Van waar naar waar",
          description:
            "Het ophaaladres en de eindbestemming, en of er op beide adressen een laadklep of heftruck aanwezig is. Dat scheelt verrassingen op de dag zelf.",
        },
        {
          number: "03",
          title: "Wanneer het klaarstaat",
          description:
            "De datum waarop de lading opgehaald kan worden. Onze RoRo-afvaart gaat om de drie weken, dus die datum bepaalt vaak op welk schip je meegaat.",
        },
        {
          number: "04",
          title: "Gegevens van de ontvanger",
          description:
            "Naam, adres en contactgegevens van de partij die de zending in ontvangst neemt. Die hebben we sowieso nodig voor de uitvoeraangifte.",
        },
      ],
      afterEyebrow: "Daarna",
      afterTitle: "Wat er gebeurt na je aanvraag",
      afterBody:
        "Je krijgt doorgaans binnen één werkdag antwoord van een vaste contactpersoon, geen ticketsysteem. Bij eenvoudige zendingen sturen we direct een prijs. Is er iets onduidelijk aan de lading of de bestemming, dan bellen we eerst even. Ga je akkoord, dan boeken wij de ruimte, plannen de ophaling en starten we de douaneafhandeling. Vanaf dat moment kun je de zending volgen via je referentienummer.",
    },
    services: {
      eyebrow: "Diensten",
      heroTitle: "Wat we vervoeren en regelen",
      heroSubtitle: "Zes diensten die samen één keten vormen, van de aangifte tot de aflevering op bestemming.",
      list: SERVICES_NL,
      quoteBtn: "Vraag een offerte aan",
      backBtn: "Alle diensten",
      whatYouGet: "Wat je krijgt",
    },
    tracking: {
      panelTitle: "Zending volgen",
      panelEyebrow: "Track & trace",
      inputLabel: "Referentienummer",
      placeholder: "TJX-0000-0000",
      searchBtn: "Zoek zending",
      helper: "Je vindt het referentienummer in je boekingsbevestiging. Probeer",
      helperTry: "om een voorbeeld te zien.",
      close: "Sluiten",
      notFound: "Geen zending gevonden. Controleer je referentienummer.",
      referenceLabel: "Referentie",
      routeLabel: "Route",
      cargoLabel: "Lading",
      statusLabel: "Status",
      statusValue: "Onderweg",
      events: [
        "Boeking bevestigd",
        "Container ontvangen",
        "Douanedocumenten verwerkt",
        "Geladen in Rotterdam",
        "Onderweg over de Middellandse Zee",
        "Aangekomen in Latakia",
        "Afgeleverd",
      ],
      doneCount: 5,
    },
    quote: {
      firstName: "Voornaam",
      lastName: "Achternaam",
      email: "E-mail",
      phone: "Telefoon",
      comments: "Opmerkingen",
      commentsPlaceholder: "Wat wil je vervoeren, van waar naar waar?",
      submit: "Verstuur aanvraag",
      successTitle: "Bedankt, je aanvraag is verstuurd.",
      successBody: "We rekenen de route door en nemen doorgaans binnen één werkdag contact met je op.",
      another: "Nieuwe aanvraag",
      errors: {
        firstName: "Vul je voornaam in.",
        lastName: "Vul je achternaam in.",
        email: "Vul een geldig e-mailadres in.",
        comments: "Vertel kort wat je wilt vervoeren.",
      },
    },
    footer: {
      tagline:
        "Expediteur voor RoRo transport, zeevracht, containers en douaneformaliteiten tussen Europa en het Midden-Oosten.",
      navTitle: "Navigatie",
      servicesTitle: "Diensten",
      contactTitle: "Contact",
      company: "TAJEX LOGISTICS BV",
      copyright: "© 2026 Tajex Logistics BV",
      location: "Maastricht Airport · Nederland",
    },
    demoNote:
      "Interactief concept van ZEVREN. Het formulier en de track & trace werken, maar versturen niets en zijn niet gekoppeld aan een echt systeem.",
  },

  en: {
    nav: { home: "Home", about: "About", services: "Services", blog: "Blog", contact: "Contact" },
    trackingBtn: "Tracking",
    breadcrumbHome: "Home",
    hero: {
      since: "Since 2005",
      departure: "Departure Rotterdam · Antwerp",
      arrival: "Arrival Latakia",
      titleStart: "Your shipment,",
      titleAccent: "reliably",
      titleEnd: "handled",
      intro:
        "We run a fixed corridor between north-west Europe and the Middle East. Cars, machinery, containers and general cargo, including customs clearance on both ends.",
      ctaQuote: "Request a quote",
      ctaTrack: "Track a shipment",
      checks: ["20+ years on this route", "Own office in Latakia", "Quote within 1 working day", "NL · EN · AR"],
      corridorLabel: "Our fixed corridor",
      corridorNote: "Sailing every 3 weeks",
      stops: [
        { code: "NLRTM", name: "Rotterdam", role: "Loading" },
        { code: "BEANR", name: "Antwerp", role: "Loading" },
        { code: "MED", name: "Mediterranean", role: "Transit" },
        { code: "SYLTK", name: "Latakia", role: "Discharge" },
      ],
    },
    schedule: {
      eyebrow: "Sailing schedule",
      title: "Next departures",
      bookBtn: "Place a booking",
      nextLabel: "Next departure",
      thenLabel: "After that",
      sailings: [
        { date: "26 August", weekday: "Wednesday · in 10 days", cutoff: "Cargo with us before 21 August" },
        { date: "16 September", weekday: "Wednesday · in 31 days", cutoff: "Cargo with us before 11 September" },
        { date: "7 October", weekday: "Wednesday · in 52 days", cutoff: "Cargo with us before 2 October" },
      ],
    },
    cargo: {
      eyebrow: "Straight to the right service",
      title: "What are you shipping?",
      subtitle: "Pick whatever comes closest and you will see how we handle it.",
      items: [
        {
          id: "auto",
          title: "A car",
          description: "Passenger cars and luxury vehicles, by container or RoRo.",
          link: "RoRo & Automotive",
          serviceId: "roro",
          icon: "car",
        },
        {
          id: "machine",
          title: "A machine or truck",
          description: "Trucks, construction machinery and farm vehicles that drive themselves.",
          link: "RoRo transport",
          serviceId: "roro",
          icon: "truck",
        },
        {
          id: "container",
          title: "Container load",
          description: "Full or shared containers via Rotterdam and Antwerp.",
          link: "Sea freight",
          serviceId: "containers",
          icon: "container",
        },
        {
          id: "pallets",
          title: "Pallets or general cargo",
          description: "Part loads and full loads by road across Europe.",
          link: "Road transport",
          serviceId: "forwarding",
          icon: "pallet",
        },
      ],
    },
    about: {
      eyebrow: "About us",
      title: "Who we are and what we do",
      paragraphs: [
        "Welcome to Tajex Logistics, your reliable partner for international logistics. With more than 20 years in the sector we offer a broad range of services, including customs formalities and container transport.",
        "Based in the Netherlands, we combine local expertise with international knowledge to serve you properly.",
      ],
      checks: [
        "One point of contact from quote to delivery",
        "Our own tracking, so no guessing where your cargo is",
        "Fully compliant with current customs legislation",
      ],
      badgeValue: "20+",
      badgeLabel: "Years in the chain",
      heroTitle: "Two decades on the same route",
      heroSubtitle: "Welcome to Tajex Logistics, your reliable partner for international logistics.",
      chips: ["Founded 2005", "Maastricht Airport", "Office in Latakia"],
      storyEyebrow: "Our story",
      storyTitle: "Local expertise, international network",
      storyParagraphs: [
        "With more than 20 years in the logistics sector we offer a broad range of services, including customs formalities and container transport. Based in the Netherlands, we combine local expertise with international knowledge to serve you properly.",
        "From our site at Maastricht Airport and our office in Latakia we serve customers across Europe and the Middle East. That second office is the difference: on arrival there is someone of ours waiting, not an agent we still have to brief.",
      ],
      storyChecks: [
        "A personal point of contact throughout the route",
        "Partners inside and outside the EU",
        "Our own handling on arrival in Latakia",
      ],
    },
    stats: {
      eyebrow: "Tajex in numbers",
      title: "Twenty years added up",
      items: [
        {
          value: "1760+",
          title: "Shipments handled",
          description: "More than 500 shipments successfully handled every year since we started.",
        },
        {
          value: "80+",
          title: "Companies advised",
          description: "More than 40 companies a year advised on import, export and customs legislation.",
        },
        {
          value: "30+",
          title: "Partners inside the EU",
          description: "A European partner network for efficient and reliable transit.",
        },
        {
          value: "15+",
          title: "Partners outside the EU",
          description: "Tailored arrangements outside the EU for a smooth trade process.",
        },
      ],
    },
    process: {
      eyebrow: "How we work",
      title: "From request to delivery",
      subtitle: "Every shipment goes through the same five steps, so you always know where we are.",
      steps: [
        {
          number: "01",
          title: "Request and quote",
          description:
            "You send us the details of your cargo, origin and destination. We work out the route and send a price with the chosen mode of transport.",
          meta: "Usually within 1 working day",
        },
        {
          number: "02",
          title: "Booking and planning",
          description: "We reserve space on the vessel or in the container and plan the pickup at your location.",
          meta: "Sailing every 3 weeks",
        },
        {
          number: "03",
          title: "Customs formalities",
          description:
            "We take care of declarations, permits and certificates of origin, and check everything before the cargo leaves.",
          meta: "Fully customs compliant",
        },
        {
          number: "04",
          title: "Transport and transit",
          description:
            "The cargo enters the corridor via Rotterdam or Antwerp. You follow the status with your own reference number.",
          meta: "Our own track and trace",
        },
        {
          number: "05",
          title: "Discharge and delivery",
          description:
            "In Latakia our own office handles discharge and clearance, until the cargo is with the consignee.",
          meta: "Own office at destination",
        },
      ],
    },
    why: {
      eyebrow: "Why Tajex",
      title: "What companies hold us to",
      cards: [
        {
          title: "Reliable",
          description:
            "A fixed corridor with a predictable sailing schedule, instead of hunting for space on every shipment.",
          meta: "20+ years · 1760+ shipments",
        },
        {
          title: "Transparent",
          description: "Our own tracking and direct lines to the people actually handling your shipment.",
          meta: "One fixed point of contact",
        },
        {
          title: "Compliant",
          description: "Declarations, permits and certificates of origin that hold up, also when the rules change.",
          meta: "Fully customs compliant",
        },
      ],
    },
    blog: {
      eyebrow: "Blog & updates",
      title: "From practice",
      allBtn: "All articles",
      heroSubtitle: "News and insight on international logistics, customs and trade with the Middle East.",
      intro:
        "We write about the things customers call us about most: customs formalities and changing regulations, the difference between RoRo and container transport, exporting to the Middle East and what actually goes wrong on a shipment. Not news about ourselves, but explanations you can use before you book.",
      posts: [
        {
          date: "21 Oct 2025",
          read: "2 min read",
          title: "How your shipment travels with TAJEX Logistics",
          excerpt: "Behind the scenes: how a shipment passes through our hands from pickup to delivery.",
          art: "aerial",
        },
        {
          date: "15 Apr 2025",
          read: "1 min read",
          title: "Towards an invisible border? The future of customs and excise in the EU",
          excerpt: "What the digitalisation of customs processes means for importers and exporters.",
          art: "crane",
        },
        {
          date: "8 Apr 2025",
          read: "1 min read",
          title: "Trading with Syria from the Netherlands, exporting with Tajex Logistics",
          excerpt: "Opportunities and things to watch when setting up trade with Syria from the Netherlands.",
          art: "stack",
        },
        {
          date: "2 Mar 2025",
          read: "1 min read",
          title: "RoRo transport to the Middle East: what to know before you ship",
          excerpt: "The key steps and documents for a smooth RoRo shipment.",
          art: "roro",
        },
        {
          date: "14 Feb 2025",
          read: "1 min read",
          title: "20 years of Tajex Logistics: looking back on two decades",
          excerpt: "From local forwarder to trade bridge between Europe and the Middle East.",
          art: "network",
        },
        {
          date: "20 Jan 2025",
          read: "1 min read",
          title: "What changes in 2025 in customs legislation?",
          excerpt: "An overview of the main changes for import and export.",
          art: "control",
        },
      ],
    },
    faq: {
      eyebrow: "Questions",
      title: "Frequently asked questions",
      subtitle: "What customers ask us most before booking.",
      items: [
        {
          question: "Which countries do you ship to?",
          answer:
            "Our fixed corridor runs from Rotterdam and Antwerp across the Mediterranean to Latakia. From there we arrange onward transport to destinations in the region.",
        },
        {
          question: "What does shipping a car cost?",
          answer:
            "That depends on the dimensions, the value and whether you choose RoRo or a container. Request a quote and you will usually have a price within one working day.",
        },
        {
          question: "How often does a vessel depart?",
          answer: "Every three weeks. Your cargo needs to be with us at the latest five days before departure.",
        },
        {
          question: "Do you also handle the customs paperwork?",
          answer: "Yes. We arrange declarations, permits and certificates of origin on both ends of the route.",
        },
        {
          question: "Can I track my shipment?",
          answer:
            "Yes. On booking you receive a reference number you can use to check the status of your shipment.",
        },
        {
          question: "Where are you based?",
          answer:
            "Our office is at Europalaan 35-12 near Maastricht Airport. We also have our own office in Latakia.",
        },
        {
          question: "Which languages can I contact you in?",
          answer: "Dutch, English and Arabic.",
        },
        {
          question: "Do you only work for large companies?",
          answer:
            "No. A single car or one pallet travels just as well as a full container load, private individuals included.",
        },
      ],
    },
    ctaBanner: {
      title: "Curious what we can do for you?",
      body: "Tell us about your shipment and we will think along on the route and the paperwork.",
      button: "Get in touch",
    },
    contact: {
      eyebrow: "Contact",
      title: "Interested?",
      subtitle: "Tell us what you want to move and from where to where. We will work out the route.",
      addressLabel: "Address",
      addressLines: ["TAJEX LOGISTICS BV", "Europalaan 35-12, 6199 AB", "Maastricht Airport, Netherlands"],
      emailLabel: "Email",
      email: "Info@tajexlogistics.nl",
      phoneLabel: "Phone",
      phone: "+31 (0) 6288 322 67",
      trackLabel: "Track a shipment",
      trackValue: "Open track & trace",
      openInMaps: "View on Google Maps",
      checklistEyebrow: "A sharp quote",
      checklistTitle: "What we need from you",
      checklistSubtitle:
        "The more complete your request, the less back and forth and the sooner you have a price. Do not know something yet? Send it anyway, we will fill in the rest together.",
      checklist: [
        {
          number: "01",
          title: "What you are shipping",
          description:
            "The type of goods, dimensions, weight and value. For vehicles: make, model, year and whether it drives under its own power. That last question decides whether RoRo is possible.",
        },
        {
          number: "02",
          title: "From where to where",
          description:
            "The pickup address and the final destination, and whether both addresses have a tail lift or forklift. That avoids surprises on the day itself.",
        },
        {
          number: "03",
          title: "When it is ready",
          description:
            "The date the cargo can be collected. Our RoRo sailing goes every three weeks, so that date often decides which vessel you are on.",
        },
        {
          number: "04",
          title: "Consignee details",
          description:
            "Name, address and contact details of the party receiving the shipment. We need those for the export declaration anyway.",
        },
      ],
      afterEyebrow: "After that",
      afterTitle: "What happens after your request",
      afterBody:
        "You usually get an answer within one working day from a fixed contact person, not a ticket system. For straightforward shipments we send a price right away. If something about the cargo or the destination is unclear, we call you first. Once you agree we book the space, plan the pickup and start the customs clearance. From that moment you can follow the shipment with your reference number.",
    },
    services: {
      eyebrow: "Services",
      heroTitle: "What we move and arrange",
      heroSubtitle: "Six services that together form one chain, from the declaration to delivery at destination.",
      list: SERVICES_EN,
      quoteBtn: "Request a quote",
      backBtn: "All services",
      whatYouGet: "What you get",
    },
    tracking: {
      panelTitle: "Track a shipment",
      panelEyebrow: "Track & trace",
      inputLabel: "Reference number",
      placeholder: "TJX-0000-0000",
      searchBtn: "Find shipment",
      helper: "You will find the reference number on your booking confirmation. Try",
      helperTry: "to see an example.",
      close: "Close",
      notFound: "No shipment found. Please check your reference number.",
      referenceLabel: "Reference",
      routeLabel: "Route",
      cargoLabel: "Cargo",
      statusLabel: "Status",
      statusValue: "In transit",
      events: [
        "Booking confirmed",
        "Container received",
        "Customs documents processed",
        "Loaded in Rotterdam",
        "In transit across the Mediterranean",
        "Arrived in Latakia",
        "Delivered",
      ],
      doneCount: 5,
    },
    quote: {
      firstName: "First name",
      lastName: "Last name",
      email: "Email",
      phone: "Phone",
      comments: "Comments",
      commentsPlaceholder: "What do you want to move, from where to where?",
      submit: "Send request",
      successTitle: "Thank you, your request has been sent.",
      successBody: "We will work out the route and normally get back to you within one working day.",
      another: "New request",
      errors: {
        firstName: "Please enter your first name.",
        lastName: "Please enter your last name.",
        email: "Please enter a valid email address.",
        comments: "Tell us briefly what you want to move.",
      },
    },
    footer: {
      tagline:
        "Forwarder for RoRo transport, sea freight, containers and customs formalities between Europe and the Middle East.",
      navTitle: "Navigation",
      servicesTitle: "Services",
      contactTitle: "Contact",
      company: "TAJEX LOGISTICS BV",
      copyright: "© 2026 Tajex Logistics BV",
      location: "Maastricht Airport · Netherlands",
    },
    demoNote:
      "Interactive concept by ZEVREN. The form and the track & trace work, but nothing is sent and nothing is connected to a real system.",
  },
};

export const TAJEX_SHIPMENT = {
  reference: "TJX-2025-0448",
  origin: "Rotterdam",
  destination: "Latakia",
  cargo: "20ft container",
};

/** Address used for the Google Maps embed on the contact page. */
export const TAJEX_MAP_QUERY =
  "TAJEX LOGISTICS BV, Europalaan 35-12, 6199 AB Maastricht, Netherlands";
