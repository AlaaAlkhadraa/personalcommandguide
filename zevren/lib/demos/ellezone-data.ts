export interface EllezoneVariant {
  id: string;
  label: string;
}

export interface EllezoneProduct {
  id: string;
  slug: string;
  name: string;
  tagline: string;
  price: number;
  compareAtPrice?: number;
  description: string;
  jarCount: number;
  variants: EllezoneVariant[];
}

export const ELLEZONE_CATEGORY = "Kitchen Storage";

export const ELLEZONE_COLORS: EllezoneVariant[] = [
  { id: "white", label: "White" },
  { id: "charcoal", label: "Charcoal" },
];

export const ELLEZONE_PRODUCTS: EllezoneProduct[] = [
  {
    id: "single",
    slug: "spice-jar-single",
    name: "ElleZone Spice Jar",
    tagline: "One jar with a built-in portion scoop.",
    price: 12.95,
    description:
      "A BPA-free glass spice jar with a built-in scoop for easy, mess-free portioning. Food-safe glass and a snug, airtight lid keep spices fresh on the counter or in the cupboard.",
    jarCount: 1,
    variants: ELLEZONE_COLORS,
  },
  {
    id: "duo",
    slug: "spice-jar-duo-pack",
    name: "ElleZone Spice Jar Duo Pack",
    tagline: "Two jars, mix and match colours.",
    price: 22.95,
    compareAtPrice: 25.9,
    description:
      "Two ElleZone spice jars for the price of a discount. Ideal for your two most-used spices, or one for the counter and one for the cupboard.",
    jarCount: 2,
    variants: ELLEZONE_COLORS,
  },
  {
    id: "family",
    slug: "spice-jar-family-pack",
    name: "ElleZone Spice Jar Family Pack",
    tagline: "Four jars for a fully organised spice rack.",
    price: 39.95,
    compareAtPrice: 47.8,
    description:
      "Four ElleZone spice jars to organise your most-used spices in one go. The best value way to switch your whole spice rack over to portion-control jars.",
    jarCount: 4,
    variants: ELLEZONE_COLORS,
  },
];

export const ELLEZONE_FEATURES = [
  {
    title: "BPA-free glass",
    body: "A food-safe glass jar built to hold up to daily use in the kitchen.",
  },
  {
    title: "Built-in scoop",
    body: "Portion spices straight from the jar, no separate spoon needed.",
  },
  {
    title: "Airtight seal",
    body: "Keeps spices fresher for longer, on the counter or in a cupboard.",
  },
];
