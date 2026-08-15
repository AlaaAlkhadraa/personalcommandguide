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
  legalName: "ZEVREN Digital B.V.",
  tagline: "Websites built to make your business look serious.",
  description:
    "ZEVREN creates modern, fast and user friendly websites for businesses that want a stronger online presence.",
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
    slug: "custom-websites",
    title: "Custom Websites",
    summary:
      "Modern websites designed around your business, your customers and what you actually need.",
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
      "Clean and easy to use online stores designed to make products simple to discover and purchase.",
    description:
      "From browsing to checkout, every step is designed to be simple. We set up a store you can manage yourself once it is live.",
    features: [
      "Secure checkout and payments",
      "Easy product management",
      "Built to handle growth",
      "Works well on mobile",
    ],
    icon: "cart",
  },
  {
    slug: "web-applications",
    title: "Web Applications",
    summary:
      "Custom dashboards, portals and web tools when a normal website is not enough.",
    description:
      "When an off the shelf tool does not fit how your business works, we build something that does.",
    features: [
      "Client portals and dashboards",
      "Booking and scheduling tools",
      "Connects with the systems you use",
      "Built to be maintained long term",
    ],
    icon: "compass",
  },
  {
    slug: "ux-ui-design",
    title: "UX and UI Design",
    summary:
      "Clear interfaces that make websites easier to understand, navigate and use.",
    description:
      "Good design is not just how it looks. We design around how people actually use a website.",
    features: [
      "Wireframes before visual design",
      "A consistent design system",
      "Designed with accessibility in mind",
      "Tested across screen sizes",
    ],
    icon: "layers",
  },
  {
    slug: "seo-foundations",
    title: "SEO Foundations",
    summary:
      "A technically solid website with a clear structure and a strong starting point for search engines.",
    description:
      "We build every site with clean structure, fast loading and proper metadata, the foundation search engines look for.",
    features: [
      "Clean site structure",
      "Metadata on every page",
      "Fast loading pages",
      "Built to be found",
    ],
    icon: "search",
  },
  {
    slug: "maintenance-support",
    title: "Maintenance and Support",
    summary:
      "Ongoing updates, improvements and technical support after launch.",
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
    description: "For smaller websites and simple business needs.",
  },
  {
    name: "Business Website",
    price: "From €899",
    description: "For a complete professional business website.",
  },
  {
    name: "Online Store",
    price: "From €1,299",
    description: "For businesses that need an online shop.",
  },
  {
    name: "Custom Web Application",
    price: "From €1,999",
    description:
      "For dashboards, portals, booking systems and other custom web applications.",
  },
];

export const WORK_ITEMS: WorkItem[] = [
  {
    slug: "northgate-logistics",
    name: "NorthGate Logistics",
    industry: "Logistics",
    summary:
      "A concept exploring how a logistics company could offer a clearer online experience for requesting quotes and tracking shipments.",
    idea: "This concept explores how a logistics company could give customers a clearer way to request quotes and track shipments online, instead of relying on phone calls and emails.",
    approach:
      "We focused on a simple quote request flow and a clean way to present shipment information, so the important details are easy to find.",
    whatWeBuilt: [
      "Quote request form",
      "Service overview pages",
      "Shipment tracking layout",
      "Responsive design",
    ],
  },
  {
    slug: "van-dijk-accountancy",
    name: "Van Dijk Accountancy",
    industry: "Accounting",
    summary:
      "A concept for an accountancy firm that needed a more secure and structured way to exchange documents with clients.",
    idea: "This concept looks at how an accountancy firm could move away from emailing sensitive documents back and forth, towards a more structured, secure process.",
    approach:
      "We designed a simple client portal concept alongside a straightforward booking flow for consultations.",
    whatWeBuilt: [
      "Client portal concept",
      "Consultation booking form",
      "Service pages",
      "Responsive design",
    ],
  },
  {
    slug: "blueline-garage",
    name: "BlueLine Garage",
    industry: "Automotive",
    summary:
      "A concept for an independent garage that wanted customers to book appointments online instead of by phone.",
    idea: "This concept explores how a garage could let customers book a maintenance slot and see an estimated price without calling during opening hours.",
    approach:
      "We focused on a simple booking flow with clear service pricing, designed to work well on mobile.",
    whatWeBuilt: [
      "Appointment booking flow",
      "Service pricing overview",
      "Mobile first design",
      "Contact experience",
    ],
  },
  {
    slug: "urban-bistro-maastricht",
    name: "Urban Bistro Maastricht",
    industry: "Restaurant",
    summary:
      "A concept for a restaurant that needed a fast, mobile friendly site with an easy way to manage the menu.",
    idea: "This concept explores how a restaurant could present its menu and take reservations without a slow, hard to update website.",
    approach:
      "We kept the design fast and image led, with a menu structure that is easy to update and a simple reservation flow.",
    whatWeBuilt: [
      "Reservation flow",
      "Menu presentation",
      "Mobile first, image led design",
      "Contact and location details",
    ],
  },
  {
    slug: "delta-build-group",
    name: "Delta Build Group",
    industry: "Construction",
    summary:
      "A concept for a construction company that wanted its project work to actually generate enquiries online.",
    idea: "This concept explores how a construction company could showcase project types and turn website visitors into real enquiries.",
    approach:
      "We structured the site around clear service and project categories, with a quote form designed to filter serious enquiries.",
    whatWeBuilt: [
      "Project showcase layout",
      "Multi step quote form",
      "Service pages",
      "Responsive design",
    ],
  },
  {
    slug: "vitacare-clinic",
    name: "VitaCare Clinic",
    industry: "Healthcare",
    summary:
      "A concept for a multi practitioner clinic that wanted patients to book appointments online.",
    idea: "This concept explores how a clinic could let patients book directly with the right practitioner, instead of everyone calling the same front desk.",
    approach:
      "We focused on a clear practitioner and specialism overview, with a straightforward booking flow.",
    whatWeBuilt: [
      "Practitioner booking flow",
      "Specialism directory",
      "Accessible design",
      "Secure intake form",
    ],
  },
];

export const WHY_ZEVREN: ValueItem[] = [
  {
    title: "Direct communication",
    description:
      "You communicate directly with the people working on your project.",
  },
  {
    title: "Built around your business",
    description:
      "We design the website around your business instead of forcing you into a generic layout.",
  },
  {
    title: "Clear communication",
    description:
      "You know what is being built, what it costs and what happens next.",
  },
  {
    title: "Built to grow",
    description: "The website is built with room for future improvements.",
  },
];

export const PROCESS_STEPS: ProcessStep[] = [
  {
    step: "01",
    title: "Discovery",
    description:
      "We learn about your business, your customers and what the website needs to achieve.",
  },
  {
    step: "02",
    title: "Structure",
    description:
      "We plan the pages, content and user flow before development starts.",
  },
  {
    step: "03",
    title: "Design",
    description:
      "We create the visual direction and refine it with your feedback.",
  },
  {
    step: "04",
    title: "Development",
    description:
      "We build the website and make sure it works properly across devices.",
  },
  {
    step: "05",
    title: "Launch",
    description: "We test everything and prepare the website for launch.",
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
    question: "Do you work with businesses outside Maastricht?",
    answer:
      "Yes. ZEVREN is based in Maastricht and works remotely with businesses across the Netherlands.",
  },
  {
    question: "Do you provide support after launch?",
    answer:
      "Yes. Maintenance and support can be arranged after the website goes live.",
  },
];
