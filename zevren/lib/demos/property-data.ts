export interface Property {
  id: string;
  slug: string;
  title: string;
  type: "Apartment" | "House" | "Studio";
  location: string;
  price: number;
  bedrooms: number;
  bathrooms: number;
  size: number;
  amenities: string[];
  description: string;
  available: string;
  swatch: string;
}

export const PROPERTY_LOCATIONS = ["Maastricht", "Heerlen", "Sittard", "Roermond"];
export const PROPERTY_TYPES = ["Apartment", "House", "Studio"] as const;

export const PROPERTIES: Property[] = [
  {
    id: "pr1",
    slug: "wyck-apartment",
    title: "3 bedroom apartment",
    type: "Apartment",
    location: "Maastricht",
    price: 1850,
    bedrooms: 3,
    bathrooms: 1,
    size: 95,
    amenities: ["Balcony", "Dishwasher", "Bike storage", "Elevator"],
    description:
      "A bright 3 bedroom apartment in Wyck, a short walk from the station and the Maas riverside.",
    available: "Available from 1 September",
    swatch: "from-teal-500/30 via-slate-700 to-slate-900",
  },
  {
    id: "pr2",
    slug: "centre-studio",
    title: "Studio near the centre",
    type: "Studio",
    location: "Maastricht",
    price: 950,
    bedrooms: 0,
    bathrooms: 1,
    size: 38,
    amenities: ["Furnished", "Washing machine", "Fibre internet"],
    description:
      "A compact, fully furnished studio a five minute walk from Vrijthof and the shopping streets.",
    available: "Available now",
    swatch: "from-indigo-500/30 via-slate-700 to-slate-900",
  },
  {
    id: "pr3",
    slug: "family-house-heerlen",
    title: "4 bedroom family house",
    type: "House",
    location: "Heerlen",
    price: 1650,
    bedrooms: 4,
    bathrooms: 2,
    size: 140,
    amenities: ["Garden", "Garage", "Storage room", "Pets allowed"],
    description:
      "A spacious family house with a private garden and garage in a quiet residential street.",
    available: "Available from 15 September",
    swatch: "from-teal-500/25 via-slate-700 to-slate-900",
  },
  {
    id: "pr4",
    slug: "sittard-apartment",
    title: "2 bedroom apartment",
    type: "Apartment",
    location: "Sittard",
    price: 1150,
    bedrooms: 2,
    bathrooms: 1,
    size: 68,
    amenities: ["Balcony", "Parking", "Storage room"],
    description:
      "A well maintained apartment close to Sittard station, with a private parking space included.",
    available: "Available from 1 October",
    swatch: "from-indigo-500/25 via-slate-700 to-slate-900",
  },
  {
    id: "pr5",
    slug: "roermond-house",
    title: "3 bedroom house",
    type: "House",
    location: "Roermond",
    price: 1400,
    bedrooms: 3,
    bathrooms: 2,
    size: 118,
    amenities: ["Garden", "Dishwasher", "Bike storage"],
    description:
      "A modern terraced house near Roermond city centre with a low maintenance garden.",
    available: "Available now",
    swatch: "from-teal-500/20 via-slate-700 to-slate-900",
  },
  {
    id: "pr6",
    slug: "maastricht-studio-2",
    title: "Studio with balcony",
    type: "Studio",
    location: "Maastricht",
    price: 975,
    bedrooms: 0,
    bathrooms: 1,
    size: 42,
    amenities: ["Balcony", "Furnished", "Elevator"],
    description:
      "A quiet studio with a private balcony, a few minutes from Maastricht University.",
    available: "Available from 1 September",
    swatch: "from-indigo-500/20 via-slate-700 to-slate-900",
  },
];

export const VIEWING_TIME_SLOTS = [
  "09:00",
  "10:00",
  "11:00",
  "13:00",
  "14:00",
  "15:00",
  "16:00",
];

export const VIEWING_DATES = [
  { id: "mon-24", label: "Mon 24 Aug" },
  { id: "tue-25", label: "Tue 25 Aug" },
  { id: "wed-26", label: "Wed 26 Aug" },
  { id: "thu-27", label: "Thu 27 Aug" },
];
