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
  phone: "+31 6 30958710",
  phoneDisplay: "06 30 95 87 10",
  address: {
    city: "Maastricht",
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
    slug: "northgate-logistics",
    name: "NorthGate Logistics",
    category: "Logistics",
    summary:
      "A booking and tracking portal for a Benelux freight forwarder, replacing a spreadsheet-and-email quote process.",
    challenge:
      "NorthGate handled every quote request by phone or email, which meant a full day's turnaround during busy periods and no way for clients to track a shipment once it left the depot.",
    solution:
      "We built a client portal with a live quote calculator tied into their transport management system, plus shipment tracking clients can check themselves — cutting response time and support calls at once.",
    result: "Quote requests now processed in minutes instead of a full day.",
    year: "2025",
    features: [
      "Real-time shipment quote calculator",
      "Client portal with order tracking",
      "Multilingual support (NL/EN/DE)",
      "Integration with their transport management system",
      "Performance-tuned for low-bandwidth warehouse networks",
    ],
  },
  {
    slug: "van-dijk-accountancy",
    name: "Van Dijk Accountancy",
    category: "Accounting",
    summary:
      "Website and secure client portal for a mid-sized accountancy firm, replacing email attachments with structured document exchange.",
    challenge:
      "Sensitive financial documents were going back and forth by email, which made both the firm and their clients uneasy and left no clear audit trail.",
    solution:
      "We built a secure portal with two-factor login where clients upload and receive documents directly, plus a booking form for consultations so the front desk isn't fielding every scheduling call.",
    result: "85% of client document exchange now happens through the portal.",
    year: "2024",
    features: [
      "Secure client document portal",
      "Two-factor authentication",
      "Consultation booking form",
      "GDPR-compliant data handling",
      "SEO-optimised service pages",
    ],
  },
  {
    slug: "blueline-garage",
    name: "BlueLine Garage",
    category: "Automotive",
    summary:
      "A booking-first website for an independent garage, letting customers reserve a maintenance slot and get an instant price indication.",
    challenge:
      "Customers could only book by phone during opening hours, and BlueLine was losing appointments to competitors with online booking.",
    solution:
      "We built a booking flow that shows real garage availability and gives an instant price range per service, so customers can book a slot on a Sunday evening without picking up the phone.",
    result: "Online bookings now account for 40% of all appointments.",
    year: "2024",
    features: [
      "Live appointment booking with calendar sync",
      "Instant price indication by service type",
      "Mobile-first design for on-the-go bookings",
      "Automated confirmation & reminder emails",
      "Google Business Profile integration",
    ],
  },
  {
    slug: "urban-bistro-maastricht",
    name: "Urban Bistro Maastricht",
    category: "Restaurant",
    summary:
      "A menu-driven restaurant website with table reservations, built to load fast on mobile where most of their traffic comes from.",
    challenge:
      "Their old site was a single slow-loading page with a PDF menu, and reservations only came in by phone — a poor fit for a mostly mobile, often international audience.",
    solution:
      "We rebuilt the site around a fast, image-rich menu the kitchen can update themselves, with a reservation system that sends automatic reminders to cut down on no-shows.",
    result: "Mobile load time down to 1.1s; no-shows dropped after adding reminders.",
    year: "2023",
    features: [
      "Table reservations with automated reminders",
      "Seasonal menu management via CMS",
      "Mobile-first, image-heavy design without the slowdown",
      "Multilingual menu (NL/EN/FR)",
      "Google Maps & opening hours integration",
    ],
  },
  {
    slug: "delta-build-group",
    name: "Delta Build Group",
    category: "Construction",
    summary:
      "A project showcase and lead-generation site for a construction and renovation contractor, built to convert visitors researching a build.",
    challenge:
      "Delta had strong word-of-mouth but almost no online presence, and their few web leads were low quality — people who hadn't understood what the company actually does.",
    solution:
      "We built a site structured around their real services and project types, with a multi-step quote form that filters for serious enquiries before they land in the inbox.",
    result: "Quote requests up 55% in the first quarter after launch.",
    year: "2023",
    features: [
      "Project portfolio with before/after galleries",
      "Multi-step quote request form",
      "Service-area pages for local SEO",
      "Downloadable brochures per service",
      "Fast-loading galleries for large project photos",
    ],
  },
  {
    slug: "vitacare-clinic",
    name: "VitaCare Clinic",
    category: "Healthcare",
    summary:
      "A patient-facing website for a multi-practitioner health clinic, with online appointment booking and clear information per specialism.",
    challenge:
      "Patients had to call during narrow opening hours to book with a specific practitioner, and the phone lines were constantly busy.",
    solution:
      "We built online booking tied to each practitioner's real calendar, plus clear specialism pages so patients land on the right page instead of guessing over the phone.",
    result: "Phone volume for scheduling dropped by a third within two months.",
    year: "2022",
    features: [
      "Online appointment booking per practitioner",
      "Practitioner & specialism directory",
      "Accessible design (WCAG-aware)",
      "Multilingual patient information (NL/EN)",
      "Secure online intake form",
    ],
  },
];

export const TESTIMONIALS: Testimonial[] = [
  {
    name: "Mark Willemsen",
    role: "Operations Manager",
    company: "NorthGate Logistics",
    quote:
      "We used to quote by phone and email, which meant a full day's delay on busy weeks. ZEVREN built a portal tied into our own systems, and now a quote takes minutes. That's not a nice-to-have for us, that's the business.",
    rating: 5,
  },
  {
    name: "Sanne van Dijk",
    role: "Owner",
    company: "Van Dijk Accountancy",
    quote:
      "Client documents used to sit in email threads, which never sat right with me. ZEVREN built a proper portal with two-factor login, and explained the security choices in language I could actually evaluate.",
    rating: 5,
  },
  {
    name: "Kevin de Boer",
    role: "Owner",
    company: "BlueLine Garage",
    quote:
      "Online bookings are now almost half our appointments. ZEVREN asked how the garage actually runs before designing anything, which is why the booking flow matches how we work instead of the other way round.",
    rating: 5,
  },
  {
    name: "Lotte Peters",
    role: "Owner",
    company: "Urban Bistro Maastricht",
    quote:
      "Our old site took forever to load on a phone, which is how most guests find us. The new one is fast and I update the menu myself. No-shows dropped once the reminder emails went in.",
    rating: 5,
  },
  {
    name: "Sander Kok",
    role: "Director",
    company: "Delta Build Group",
    quote:
      "We had plenty of word-of-mouth but a website that did nothing for us. ZEVREN built something that actually filters enquiries, so the calls we get now are from people who know what we do.",
    rating: 5,
  },
  {
    name: "Fenna de Groot",
    role: "Practice Manager",
    company: "VitaCare Clinic",
    quote:
      "Our phone lines were constantly busy with scheduling calls. Online booking tied to each practitioner's calendar solved that almost immediately, and patients tell us it's easier too.",
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
