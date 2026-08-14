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
  tagline: "Websites that sell, not just websites that look good.",
  description:
    "ZEVREN builds websites and online stores for businesses in the Netherlands and across Europe. Fast, secure, and built to bring in customers — no templates, no filler.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.zevren.nl",
  email: "info@zevren.nl",
  phone: "+31 20 123 4567",
  phoneDisplay: "020 123 4567",
  address: {
    street: "Keizersgracht 241",
    postalCode: "1016 EA",
    city: "Amsterdam",
    country: "Netherlands",
  },
  kvk: "92008674",
  btw: "NL003953113B07",
  social: {
    linkedin: "https://www.linkedin.com/company/zevren/",
  },
  foundedYear: 2021,
} as const;

export const NAV_LINKS: NavLink[] = [
  { label: "Home", href: "/" },
  { label: "Services", href: "/services" },
  { label: "Portfolio", href: "/portfolio" },
  { label: "Reviews", href: "/reviews" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

export const FOOTER_LEGAL_LINKS: NavLink[] = [
  { label: "Privacy Policy", href: "/privacy-policy" },
  { label: "Terms & Conditions", href: "/terms-and-conditions" },
];

export const SERVICES: Service[] = [
  {
    slug: "websites",
    title: "Custom websites",
    summary: "A website built around what you sell, not around a theme.",
    description:
      "We start with what your visitor needs to do — call, book, buy — and build the site around that. Not a page-builder theme with your logo on it, but a design and codebase that are actually yours.",
    features: [
      "Custom design, no themes",
      "Next.js for speed and reliability",
      "Edit your own text and images through a CMS of your choice",
      "Fully responsive, tested on real devices",
    ],
    icon: "code",
  },
  {
    slug: "webshops",
    title: "Online stores",
    summary: "E-commerce set up to convert, not just to tick boxes.",
    description:
      "From product page to checkout: every step is one we can account for on its own. We build on a platform that fits your catalogue and volume, and keep it manageable for your own team.",
    features: [
      "Payment providers including iDEAL, Mollie and Stripe",
      "Stock and order syncing",
      "Fast product pages, even with many variants",
      "Built for repeat purchases, not just the first sale",
    ],
    icon: "cart",
  },
  {
    slug: "ux-ui-design",
    title: "UX & UI design",
    summary: "Design that makes decisions easier, not just nicer to look at.",
    description:
      "Before a single pixel is drawn, we map out your visitor's route. The result is an interface that makes the next step obvious — on every screen size.",
    features: [
      "Wireframes and clickable prototypes",
      "A design system with reusable components",
      "Accessibility considered from the first sketch",
      "User testing with real visitors wherever possible",
    ],
    icon: "layers",
  },
  {
    slug: "seo",
    title: "SEO & findability",
    summary: "The technical foundation first, everything else after.",
    description:
      "A fast, technically clean site is the best starting point for SEO there is. We get the fundamentals right — structure, speed, metadata — and give you concrete next steps, not a dashboard full of vague scores.",
    features: [
      "Technical SEO audit with fixes applied directly",
      "Structured data and metadata on every page",
      "Core Web Vitals optimised",
      "Content advice based on search intent",
    ],
    icon: "search",
  },
  {
    slug: "maintenance",
    title: "Maintenance & support",
    summary: "Someone who picks up when the site acts up.",
    description:
      "A website is never really 'finished'. We monitor uptime and security updates, take backups, and handle small changes without making you open a support ticket for it.",
    features: [
      "Security updates and dependency maintenance",
      "Daily backups with a recovery guarantee",
      "Uptime monitoring with instant alerts",
      "One point of contact, not a rotating support team",
    ],
    icon: "wrench",
  },
  {
    slug: "web-applications",
    title: "Web applications",
    summary: "Custom software for processes an off-the-shelf tool can't handle.",
    description:
      "Client portals, internal tools, booking systems — if an existing package doesn't fit your process, we build something that does. With the same attention to speed and security as our websites.",
    features: [
      "Custom client portals and dashboards",
      "Integrations with existing systems via APIs",
      "Role-based access and authorisation",
      "Scalable architecture from day one",
    ],
    icon: "compass",
  },
];

export const PORTFOLIO_ITEMS: PortfolioItem[] = [
  {
    slug: "noordkaap-makelaars",
    name: "Noordkaap Makelaars",
    category: "Real estate",
    summary:
      "A property listing site with a live feed from their CRM, so new listings go live without any manual work.",
    result: "43% more enquiries through the contact form within 3 months.",
    year: "2025",
    tags: ["Next.js", "CRM integration", "SEO"],
  },
  {
    slug: "havenlicht-koffie",
    name: "Havenlicht Koffie",
    category: "E-commerce",
    summary:
      "Online store for a coffee roastery in Rotterdam, with subscriptions and a stock system linked to their point of sale.",
    result: "Load time down from 4.1s to 0.9s, conversion up 27%.",
    year: "2024",
    tags: ["Online store", "Subscriptions", "Performance"],
  },
  {
    slug: "bureau-linden",
    name: "Bureau Linden",
    category: "Professional services",
    summary:
      "Redesign of an accountancy firm's website, with a client portal for exchanging documents securely.",
    result: "Portal now handles 90% of document exchange, no more email attachments.",
    year: "2024",
    tags: ["Client portal", "Security", "UX"],
  },
  {
    slug: "molenwerf-interieur",
    name: "Molenwerf Interieur",
    category: "E-commerce",
    summary:
      "Online store for custom furniture with a configurator that lets customers choose fabric, colour and dimensions.",
    result: "Average order value up €340 thanks to the configurator.",
    year: "2023",
    tags: ["Configurator", "Online store", "UI design"],
  },
  {
    slug: "studio-verhoeven",
    name: "Studio Verhoeven",
    category: "Architecture",
    summary:
      "Portfolio site for an architecture practice, built around large imagery without giving up load speed.",
    result: "Bounce rate down 31% after the relaunch.",
    year: "2023",
    tags: ["Portfolio", "Image optimisation", "Design"],
  },
  {
    slug: "de-vries-advocaten",
    name: "De Vries Advocaten",
    category: "Legal",
    summary:
      "New website with clear practice-area pages, so visitors land directly on the right lawyer.",
    result: "Direct phone enquiries doubled compared to the old site.",
    year: "2022",
    tags: ["Content structure", "SEO", "Accessibility"],
  },
];

export const TESTIMONIALS: Testimonial[] = [
  {
    name: "Rob Hendriksen",
    role: "Owner",
    company: "Noordkaap Makelaars",
    quote:
      "ZEVREN asked about our numbers in the first conversation, not our colour preferences. That built trust early on. The result simply works, and when something comes up they reply the same day.",
    rating: 5,
  },
  {
    name: "Merel Bakker",
    role: "Marketing",
    company: "Havenlicht Koffie",
    quote:
      "We'd already been through two agencies that mostly delivered nice pictures. ZEVREN delivered a store that actually loads faster and sells more, with explanations I could follow without an IT background.",
    rating: 5,
  },
  {
    name: "Thomas van Linden",
    role: "Partner",
    company: "Bureau Linden",
    quote:
      "The client portal had to meet strict security requirements. They took that seriously without turning it into a massive project. Straightforward, pleasant collaboration.",
    rating: 5,
  },
  {
    name: "Anouk Verhoeven",
    role: "Architect",
    company: "Studio Verhoeven",
    quote:
      "I wanted a site where our work takes centre stage without getting slow from all the imagery. That's exactly how they solved it. Maintenance has been smooth ever since.",
    rating: 5,
  },
  {
    name: "Daan de Vries",
    role: "Managing partner",
    company: "De Vries Advocaten",
    quote:
      "Concrete, down-to-earth, and they stick to the schedule. No surprises on the invoice afterwards. For a firm like ours, that matters just as much as the end result.",
    rating: 5,
  },
];

export const PROCESS_STEPS: ProcessStep[] = [
  {
    step: "01",
    title: "Discovery & scope",
    description:
      "We discuss what you need and what your visitor needs to do. That turns into a fixed proposal with price and timeline — no open-ended hours with no end point.",
  },
  {
    step: "02",
    title: "Structure & wireframes",
    description:
      "Before any design happens, we settle the structure: which pages, which content, which route to conversion. This gets laid out in wireframes for you to approve.",
  },
  {
    step: "03",
    title: "Design",
    description:
      "We design in your brand style, with attention to recognisability and readability. You see and react to designs before we start building.",
  },
  {
    step: "04",
    title: "Development",
    description:
      "We build the site with Next.js, test on real devices and browsers, and keep you updated along the way through a preview environment.",
  },
  {
    step: "05",
    title: "Launch & aftercare",
    description:
      "After launch we check everything again: speed, forms, tracking. After that we stay reachable for maintenance or future additions.",
  },
];

export const FAQ_ITEMS: FaqItem[] = [
  {
    question: "What does a website from ZEVREN cost?",
    answer:
      "That depends on scope. A custom website typically starts around €3,500, an online store around €6,500. After the first conversation you get a fixed proposal, so you know where you stand before we start.",
  },
  {
    question: "How long does a project take?",
    answer:
      "A custom website takes 4 to 6 weeks on average, an online store 6 to 10 weeks. This depends heavily on how quickly we receive content and feedback from your side.",
  },
  {
    question: "Can I edit the content myself after launch?",
    answer:
      "Yes. We connect a CMS of your choice so you can manage text, images and products yourself, without needing to write code.",
  },
  {
    question: "Who handles maintenance after launch?",
    answer:
      "That's up to you. You can choose a maintenance plan where we handle updates, backups and monitoring, or we hand the site over to you completely.",
  },
  {
    question: "Do you work with businesses outside the Netherlands?",
    answer:
      "Definitely. We work with clients across Europe and meet over video calls. Our documentation and communication are available in English as well.",
  },
  {
    question: "Do you also work on existing websites?",
    answer:
      "Yes, we regularly take over existing projects — for a redesign, a speed problem, or to keep building on an application someone else started.",
  },
];
