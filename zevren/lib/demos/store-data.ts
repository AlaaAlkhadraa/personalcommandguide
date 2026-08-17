import type { ImageKey } from "@/lib/assets";

export interface ProductVariant {
  id: string;
  label: string;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  category: string;
  price: number;
  description: string;
  /** Real product photography, not a coloured placeholder. */
  image: ImageKey;
  variantLabel: string;
  variants: ProductVariant[];
}

export const STORE_CATEGORIES = ["All", "Audio", "Wearables", "Mobile"];

/**
 * Catalogue for the electronics store concept.
 *
 * Prices and names are invented for the demo, which the concept badge on the
 * page says plainly. No real brand is named and no real shop is implied.
 */
export const PRODUCTS: Product[] = [
  {
    id: "p1",
    slug: "studio-over-ear",
    name: "Studio Over-Ear",
    category: "Audio",
    price: 299,
    description:
      "Closed-back headphones with adaptive noise cancelling and a 40 hour battery.",
    image: "product-headphones",
    variantLabel: "Colour",
    variants: [
      { id: "midnight", label: "Midnight" },
      { id: "graphite", label: "Graphite" },
    ],
  },
  {
    id: "p2",
    slug: "wireless-earbuds",
    name: "Wireless Earbuds Pro",
    category: "Audio",
    price: 179,
    description:
      "In-ear buds with active noise cancelling and a pocket-sized charging case.",
    image: "product-earbuds",
    variantLabel: "Colour",
    variants: [
      { id: "midnight", label: "Midnight" },
      { id: "silver", label: "Silver" },
    ],
  },
  {
    id: "p3",
    slug: "smart-speaker",
    name: "Room Speaker",
    category: "Audio",
    price: 229,
    description:
      "A compact speaker that fills a room, with a woven acoustic shell.",
    image: "product-speaker",
    variantLabel: "Finish",
    variants: [
      { id: "navy", label: "Navy" },
      { id: "slate", label: "Slate" },
    ],
  },
  {
    id: "p4",
    slug: "smart-watch",
    name: "Series Watch",
    category: "Wearables",
    price: 349,
    description:
      "An always-on display, week-long battery and training metrics that make sense.",
    image: "product-watch",
    variantLabel: "Case size",
    variants: [
      { id: "41", label: "41 mm" },
      { id: "45", label: "45 mm" },
    ],
  },
  {
    id: "p5",
    slug: "handset",
    name: "Handset 12",
    category: "Mobile",
    price: 899,
    description:
      "A three-lens camera system in a matte ceramic body, built to last a few years.",
    image: "product-phone",
    variantLabel: "Storage",
    variants: [
      { id: "128", label: "128 GB" },
      { id: "256", label: "256 GB" },
      { id: "512", label: "512 GB" },
    ],
  },
  {
    id: "p6",
    slug: "travel-headset",
    name: "Travel Headset",
    category: "Audio",
    price: 199,
    description:
      "Folding over-ear headphones with a hard case, made for long flights.",
    image: "product-headset",
    variantLabel: "Colour",
    variants: [
      { id: "midnight", label: "Midnight" },
      { id: "sand", label: "Sand" },
    ],
  },
];
