import type { NavLink, Service, WorkItem } from "@/types";

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
  { key: "home", label: "Home", href: "/" },
  { key: "services", label: "Services", href: "/services" },
  { key: "projects", label: "Projects", href: "/projects" },
  { key: "about", label: "About Us", href: "/about" },
  { key: "process", label: "Process", href: "/process" },
  { key: "contact", label: "Contact", href: "/contact" },
];

export const FOOTER_LEGAL_LINKS: NavLink[] = [
  { label: "Privacy Policy", href: "/privacy-policy" },
  { label: "Terms & Conditions", href: "/terms-and-conditions" },
];

export const SERVICES: Service[] = [
  {
    slug: "web-design",
    title: "Web Design",
    summary:
      "Modern websites designed around your business, your customers and what the site has to achieve.",
    description:
      "We start by understanding what your website needs to do, then design and build around that. Not a page builder theme with your logo dropped on top.",
    features: [
      "Custom design, not a template",
      "Built with Next.js for speed",
      "Clean, semantic structure search engines can read",
      "Works properly on every screen size",
    ],
    icon: "code",
    image: "service-web-design",
  },
  {
    slug: "ecommerce",
    title: "E-commerce",
    summary:
      "Online stores that make it easy for customers to browse products and place an order.",
    description:
      "From the first product page to the confirmation screen, every step is designed to be simple. You get a store you can manage yourself once it is live.",
    features: [
      "Secure checkout and payments",
      "Product management you can handle",
      "Product pages built to convert",
      "Designed mobile first",
    ],
    icon: "cart",
    image: "store-audio",
  },
  {
    slug: "web-applications",
    title: "Web Applications",
    summary:
      "Dashboards, portals and internal tools for businesses that need more than a website.",
    description:
      "When an off the shelf tool does not fit how your business actually works, we build something that does.",
    features: [
      "Client portals and dashboards",
      "Booking and scheduling tools",
      "Connects with the systems you already use",
      "Built around your specific process",
    ],
    icon: "compass",
    image: "service-web-apps",
  },
  {
    slug: "ui-ux-design",
    title: "UI/UX Design",
    summary: "Interfaces that are easy to use, not only pleasant to look at.",
    description:
      "Before any code is written we work out how the site should feel to use. Clear layouts, sensible navigation, no guessing what to click.",
    features: [
      "Wireframes and layout planning",
      "A consistent visual system",
      "Designed around real content",
      "Accessibility considered from the start",
    ],
    icon: "layers",
    image: "service-uiux",
  },
  {
    slug: "maintenance",
    title: "Maintenance",
    summary: "Updates, fixes and improvements after your website goes live.",
    description:
      "A website needs upkeep after launch. We keep it updated, secure and running well, and handle changes as your business moves.",
    features: [
      "Security and dependency updates",
      "Regular backups",
      "Small changes handled quickly",
      "One point of contact",
    ],
    icon: "wrench",
    image: "service-maintenance",
  },
  {
    slug: "global-focus",
    title: "Global Focus",
    summary:
      "Based in Maastricht, working with businesses in other countries and other languages.",
    description:
      "Where your customers are does not have to match where we are. We build multilingual sites and work remotely across time zones, with the same direct contact either way.",
    features: [
      "Multilingual sites, right to left included",
      "Remote collaboration across time zones",
      "Clear communication in English and Dutch",
      "One person on your project throughout",
    ],
    icon: "globe",
    image: "global-globe",
  },
];


export const WORK_ITEMS: WorkItem[] = [
  {
    slug: "tajex-logistics",
    name: "Tajex Logistics",
    category: "Logistics",
    liveUrl: "https://tajexlogistics.nl",
    description:
      "International logistics, RoRo transport, containers, forwarding and customs, connecting Europe and the Middle East.",
    whatWeExplored:
      "This concept explores how an international logistics company could present transport, containers, forwarding and customs online, with track and trace and a quote request built straight into the site.",
    keyFeatures: [
      "Service pages for transport, containers and forwarding",
      "Track and trace with shipment status",
      "Quote request flow",
      "Customs and cross-border logistics",
    ],
    image: "project-tajex",
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
    image: "project-barbershop",
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
    image: "project-garage",
  },
  {
    slug: "online-store",
    name: "Nordwave Audio",
    category: "E-commerce",
    description:
      "A premium electronics store concept: headphones, speakers and wearables, from the product grid through to a confirmed order.",
    whatWeExplored:
      "This concept explores how a consumer electronics brand could sell directly online, with product photography carrying the page and a checkout that stays out of the customer's way.",
    keyFeatures: [
      "Product grid and detail pages",
      "Colour and variant selection",
      "Shopping cart",
      "Checkout flow",
      "Order confirmation",
    ],
    image: "store-hero",
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
    image: "project-property",
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
    image: "store-desk",
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
    image: "project-accounting",
  },
];

