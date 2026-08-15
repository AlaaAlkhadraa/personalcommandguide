import type {
  FaqItem,
  NavLink,
  PricingPlan,
  ProcessStep,
  Service,
  ValueItem,
  WorkItem,
} from "@/types";

export const SITE_CONFIG = {
  name: "ZEVREN",
  legalName: "ZEVREN",
  tagline: "Websites that make your business easier to choose.",
  description:
    "We design and build modern websites for businesses that want a clear, professional presence online.",
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
} as const;

export const NAV_LINKS: NavLink[] = [
  { label: "Work", href: "/work" },
  { label: "Services", href: "/services" },
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
    title: "Websites",
    summary:
      "Modern websites designed around your business, your customers and what you need the website to achieve.",
    description:
      "We start by understanding what your website needs to do, then design and build around that. Not a page builder theme with your logo on it.",
    features: [
      "Custom design, not a template",
      "Built with Next.js for speed",
      "Content you can edit yourself",
      "Works well on every device",
    ],
    icon: "code",
  },
  {
    slug: "online-stores",
    title: "Online Stores",
    summary:
      "Clean online stores that make it easy for customers to browse products and place orders.",
    description:
      "From browsing to checkout, every step is designed to be simple. We set up a store you can manage yourself once it is live.",
    features: [
      "Secure checkout and payments",
      "Easy product management",
      "Clear product pages",
      "Works well on mobile",
    ],
    icon: "cart",
  },
  {
    slug: "web-applications",
    title: "Web Applications",
    summary:
      "Custom dashboards, portals and web tools for businesses that need more than a standard website.",
    description:
      "When an off the shelf tool does not fit how your business works, we build something that does.",
    features: [
      "Client portals and dashboards",
      "Booking and scheduling tools",
      "Connects with the systems you use",
      "Built around your specific process",
    ],
    icon: "compass",
  },
  {
    slug: "ui-ux-design",
    title: "UI/UX Design",
    summary:
      "Interfaces that are easy to use, not just nice to look at.",
    description:
      "Before any code gets written, we work out how the site should feel to use. Clear layouts, sensible navigation, no guessing what to click.",
    features: [
      "Wireframes and layout planning",
      "Consistent visual system",
      "Designed for real content",
      "Built with accessibility in mind",
    ],
    icon: "layers",
  },
  {
    slug: "seo-foundations",
    title: "SEO Foundations",
    summary:
      "The technical basics that help your site get found on search engines.",
    description:
      "We handle the technical side of SEO, structure, page speed, metadata, so your content has a fair chance to rank.",
    features: [
      "Clean, semantic HTML structure",
      "Fast page load times",
      "Proper titles and meta descriptions",
      "Sitemap and search engine setup",
    ],
    icon: "search",
  },
  {
    slug: "website-support",
    title: "Website Support",
    summary:
      "Ongoing updates, fixes and improvements after your website goes live.",
    description:
      "A website needs upkeep after launch. We keep it updated, secure and running well.",
    features: [
      "Security updates",
      "Regular backups",
      "Small changes handled quickly",
      "One point of contact",
    ],
    icon: "wrench",
  },
];

export const PRICING_PLANS: PricingPlan[] = [
  {
    name: "Starter Website",
    price: "From €499",
    description: "A small, focused website to get your business online.",
  },
  {
    name: "Business Website",
    price: "From €799",
    description: "A complete website built around your business and content.",
  },
  {
    name: "Online Store",
    price: "From €1,199",
    description: "For businesses that want to sell products online.",
  },
  {
    name: "Custom Web Application",
    price: "From €1,999",
    description:
      "For web applications, portals and anything beyond a standard website.",
  },
];

export const WORK_ITEMS: WorkItem[] = [
  {
    slug: "tajex-logistics",
    name: "Tajex Logistics",
    category: "Logistics",
    kind: "real",
    liveUrl: "https://tajexlogistics.nl",
    description:
      "The live website for Tajex Logistics, a logistics company. Designed and built by ZEVREN.",
    whatWeExplored:
      "This is a real, delivered project. ZEVREN designed and built the website for Tajex Logistics, focused on a clear, professional online presence for the business.",
    keyFeatures: [
      "Custom website design",
      "Responsive across devices",
      "Professional business presence",
      "Delivered for a real client",
    ],
  },
  {
    slug: "barbershop-website",
    name: "Barbershop Website",
    category: "Barbershop",
    description:
      "A modern barbershop website with online booking, service selection and a simple customer experience.",
    whatWeExplored:
      "This concept explores how a modern barbershop could make appointments easier for customers through a simple, mobile first website.",
    keyFeatures: [
      "Online appointment booking",
      "Service selection",
      "Barber selection",
      "Available time slots",
      "Mobile first design",
    ],
  },
  {
    slug: "garage-website",
    name: "Garage Website",
    category: "Automotive",
    description:
      "A professional garage website focused on servicing, inspections and online appointments.",
    whatWeExplored:
      "This concept explores how a garage could let customers book a service online and share their vehicle details in advance, instead of everything happening over the phone.",
    keyFeatures: [
      "Online service booking",
      "Vehicle registration field",
      "Vehicle details",
      "Appointment scheduling",
      "Service overview",
    ],
  },
  {
    slug: "online-store",
    name: "Online Store",
    category: "E-commerce",
    description:
      "A complete online store for premium home and lifestyle products, from browsing to checkout.",
    whatWeExplored:
      "This concept explores what a premium home goods store could look like online, from product discovery through to a simple, clear checkout.",
    keyFeatures: [
      "Product catalogue",
      "Product filtering",
      "Shopping cart",
      "Checkout flow",
      "Order confirmation",
    ],
  },
  {
    slug: "property-platform",
    name: "Property Management Platform",
    category: "Custom Web Application",
    description:
      "A property management dashboard for landlords, built as a custom web application: properties, bookings, calendar and messages in one place.",
    whatWeExplored:
      "This concept explores what a real internal tool could look like, not just a marketing website. A landlord managing several properties needs bookings, availability and guest messages in one dashboard instead of spreadsheets and email.",
    keyFeatures: [
      "Bookings and revenue overview",
      "Interactive availability calendar",
      "Booking request approvals",
      "Guest messaging",
      "Property management",
    ],
  },
  {
    slug: "ellezone",
    name: "ElleZone",
    category: "E-commerce",
    description:
      "A premium webshop concept for ElleZone, a portion-control glass spice jar with a built-in scoop.",
    whatWeExplored:
      "This concept explores what a focused, single-product webshop launch could look like, from a product page through to checkout, wishlist and a simple account view.",
    keyFeatures: [
      "Product variants",
      "Wishlist",
      "Shopping cart",
      "Checkout flow",
      "Account overview",
    ],
  },
  {
    slug: "accounting-firm",
    name: "Bergendal Accountants",
    category: "Professional Services",
    description:
      "A website and client portal concept for a Dutch accounting firm, from bookkeeping to VAT and annual accounts.",
    whatWeExplored:
      "This concept explores how an accounting firm could pair a clear marketing website with a simple client portal, so clients can see invoices, documents and deadlines in one place.",
    keyFeatures: [
      "Service and pricing pages",
      "Appointment request",
      "Client portal dashboard",
      "Invoices and documents",
      "VAT and financial overview",
    ],
  },
];

export const WHY_ZEVREN: ValueItem[] = [
  {
    title: "Small by design",
    description: "You work directly with the person building your website.",
  },
  {
    title: "No unnecessary extras",
    description: "We focus on what your business actually needs.",
  },
  {
    title: "Clear pricing",
    description: "You know what you are paying for before we start.",
  },
  {
    title: "Built properly",
    description:
      "Responsive design, clean structure and a website that works across devices.",
  },
];

export const PROCESS_STEPS: ProcessStep[] = [
  {
    step: "01",
    title: "Tell us what you need",
    description:
      "We learn about your business and what you want the website to do.",
  },
  {
    step: "02",
    title: "Plan",
    description:
      "We decide what pages, content and features are actually needed.",
  },
  {
    step: "03",
    title: "Design",
    description:
      "We create the visual direction and refine it with your feedback.",
  },
  {
    step: "04",
    title: "Build",
    description:
      "We develop the website and make sure everything works properly.",
  },
  {
    step: "05",
    title: "Launch",
    description: "We test the website and prepare it for launch.",
  },
];

export const FAQ_ITEMS: FaqItem[] = [
  {
    question: "How much does a website cost?",
    answer:
      "Most ZEVREN projects start from €499. The final price depends on the size and requirements of the project.",
  },
  {
    question: "How long does a website take?",
    answer:
      "The timeline depends on the project. We will give you a clear estimate before development starts.",
  },
  {
    question: "Can you redesign an existing website?",
    answer: "Yes. We can improve an existing website or rebuild it when necessary.",
  },
  {
    question: "Do you work with businesses outside the Netherlands?",
    answer:
      "Yes. Maastricht is where the studio is based, not a limit on who we work with. We work remotely with businesses anywhere.",
  },
  {
    question: "Can you build an online store?",
    answer:
      "Yes. From a simple product catalogue to a full store with checkout, we can build it and set it up so you can manage it yourself.",
  },
  {
    question: "Can you build custom web applications?",
    answer:
      "Yes. If a standard website is not enough, we build dashboards, portals and tools built around how your business actually works.",
  },
  {
    question: "Do you provide support after launch?",
    answer:
      "Yes. Support can be arranged after the website goes live, from small fixes to bigger changes.",
  },
  {
    question: "Can I update the website myself?",
    answer:
      "Yes. We build websites so you can edit the content yourself, and we are available if you need something changed for you.",
  },
];
