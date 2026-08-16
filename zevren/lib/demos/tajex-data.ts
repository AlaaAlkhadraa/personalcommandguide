export interface TajexService {
  id: string;
  name: string;
  tagline: string;
  description: string;
  details: string[];
}

export const TAJEX_SERVICES: TajexService[] = [
  {
    id: "customs",
    name: "Douaneformaliteiten",
    tagline: "Customs formalities",
    description:
      "Complete customs documentation and clearance for shipments in and out of the EU, so your cargo does not get held up at the border.",
    details: [
      "Import and export declarations",
      "EU customs clearance",
      "Documentation checks before departure",
      "Coordination with customs authorities",
    ],
  },
  {
    id: "transport",
    name: "Tajex Transport",
    tagline: "Road transport",
    description:
      "Road transport for vehicles, machinery and general cargo across Europe, with a fleet suited to the load you need moved.",
    details: [
      "Vehicle and machinery transport",
      "Cross-border road freight",
      "Flexible pickup and delivery windows",
      "Insured cargo handling",
    ],
  },
  {
    id: "containers",
    name: "Tajex Containers",
    tagline: "Container shipping",
    description:
      "Full and part container loads, from booking the container to coordinating the sea leg of the journey.",
    details: [
      "FCL and LCL container bookings",
      "Port coordination",
      "Container tracking",
      "Loading and stuffing supervision",
    ],
  },
  {
    id: "forwarding",
    name: "Forwarding",
    tagline: "Freight forwarding",
    description:
      "We coordinate the full route for shipments that involve more than one leg or mode of transport, so you deal with one point of contact.",
    details: [
      "Multi-leg route planning",
      "Carrier coordination",
      "Pallet and general cargo (stukgoed) handling",
      "Single point of contact end to end",
    ],
  },
  {
    id: "roro",
    name: "RoRo & Automotive Shipping",
    tagline: "Roll-on, roll-off vehicle shipping",
    description:
      "Roll-on roll-off shipping for cars, trucks and heavy machinery, built around the automotive and equipment trade.",
    details: [
      "Car and truck shipping",
      "Heavy machinery transport",
      "RoRo vessel booking",
      "Vehicle condition documentation",
    ],
  },
  {
    id: "trade-bridge",
    name: "Handelsbrug Europa-Midden-Oosten",
    tagline: "Europe - Middle East trade bridge",
    description:
      "A dedicated trade route connecting Europe with the Middle East, covering the Mediterranean crossing through to destinations like Latakia.",
    details: [
      "Rotterdam and Antwerp departures",
      "Mediterranean routing",
      "Middle East destination handling",
      "Customs support on both ends",
    ],
  },
];

export const TAJEX_ROUTE = ["Rotterdam", "Antwerp", "Mediterranean", "Latakia"];

export const TAJEX_STATS = [
  { value: "20+", label: "years of experience" },
  { value: "500+", label: "shipments per year" },
];

export const TAJEX_CARGO_TYPES = [
  { id: "auto", label: "Een auto", serviceId: "roro" },
  { id: "machine", label: "Een machine of truck", serviceId: "roro" },
  { id: "container", label: "Containerlading", serviceId: "containers" },
  { id: "pallets", label: "Pallets of stukgoed", serviceId: "forwarding" },
];

export interface ShipmentEvent {
  label: string;
  done: boolean;
}

export interface Shipment {
  reference: string;
  origin: string;
  destination: string;
  cargo: string;
  events: ShipmentEvent[];
}

export const TAJEX_DEMO_SHIPMENT: Shipment = {
  reference: "TJX-2025-0448",
  origin: "Rotterdam",
  destination: "Latakia",
  cargo: "20ft container - general cargo",
  events: [
    { label: "Booking confirmed", done: true },
    { label: "Container received", done: true },
    { label: "Customs documents processed", done: true },
    { label: "Loaded", done: true },
    { label: "In transit", done: true },
    { label: "Arrived", done: false },
    { label: "Delivered", done: false },
  ],
};

export const TAJEX_BLOG_POSTS = [
  {
    title: "Wat verandert er in de douaneprocedures voor 2026?",
    excerpt:
      "Een overzicht van de belangrijkste wijzigingen in de EU-douaneformaliteiten en wat dit betekent voor jouw zendingen.",
  },
  {
    title: "RoRo versus container: welke optie past bij jouw voertuig?",
    excerpt:
      "De keuze tussen RoRo en containervervoer hangt af van het type voertuig, de bestemming en het budget.",
  },
  {
    title: "De handelsroute tussen Europa en het Midden-Oosten",
    excerpt:
      "Waarom Rotterdam en Antwerpen belangrijke vertrekpunten blijven voor zendingen richting de Middellandse Zee en verder.",
  },
];
