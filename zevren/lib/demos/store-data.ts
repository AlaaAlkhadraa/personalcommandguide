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
  /** Crafted studio render, consistent across the whole line. */
  image: ImageKey;
  variantLabel: string;
  variants: ProductVariant[];
}

export const STORE_CATEGORIES = ["All", "Headphones", "Speakers", "Hi-Fi"];

/**
 * Catalogue for the audio store concept.
 *
 * Prices and names are invented for the demo, which the concept badge on the
 * page says plainly. No real brand is named and no real shop is implied. The
 * product art is drawn in one studio style so the shelf reads as one line,
 * the way a real premium audio brand's catalogue does.
 */
export const PRODUCTS: Product[] = [
  {
    id: "p1",
    slug: "arc-one",
    name: "Arc One",
    category: "Headphones",
    price: 329,
    description:
      "Flagship over-ear headphones with adaptive noise cancelling and a 40 hour battery.",
    image: "nordwave-arc-one",
    variantLabel: "Colour",
    variants: [
      { id: "basalt", label: "Basalt" },
      { id: "fjord", label: "Fjord Blue" },
    ],
  },
  {
    id: "p2",
    slug: "arc-lite",
    name: "Arc Lite",
    category: "Headphones",
    price: 199,
    description:
      "The Arc, folded down: a lighter on-ear build for the commute, in a soft glacier finish.",
    image: "nordwave-arc-lite",
    variantLabel: "Colour",
    variants: [
      { id: "glacier", label: "Glacier" },
      { id: "basalt", label: "Basalt" },
    ],
  },
  {
    id: "p3",
    slug: "pulse",
    name: "Pulse",
    category: "Headphones",
    price: 169,
    description:
      "True wireless earbuds with active noise cancelling and a pocket-sized charging case.",
    image: "nordwave-pulse",
    variantLabel: "Colour",
    variants: [
      { id: "glacier", label: "Glacier" },
      { id: "basalt", label: "Basalt" },
    ],
  },
  {
    id: "p4",
    slug: "orbit",
    name: "Orbit",
    category: "Speakers",
    price: 279,
    description:
      "A room-filling speaker wrapped in acoustic fabric, tuned for shelves rather than stages.",
    image: "nordwave-orbit",
    variantLabel: "Finish",
    variants: [
      { id: "basalt", label: "Basalt" },
      { id: "slate", label: "Slate" },
    ],
  },
  {
    id: "p5",
    slug: "drift",
    name: "Drift",
    category: "Speakers",
    price: 139,
    description:
      "A splash-proof portable speaker with twelve hours of playtime and a loop for the bike bag.",
    image: "nordwave-drift",
    variantLabel: "Colour",
    variants: [
      { id: "fjord", label: "Fjord Blue" },
      { id: "basalt", label: "Basalt" },
    ],
  },
  {
    id: "p6",
    slug: "spin",
    name: "Spin",
    category: "Hi-Fi",
    price: 449,
    description:
      "A belt-driven turntable with a carbon tonearm, built-in phono stage and none of the fuss.",
    image: "nordwave-spin",
    variantLabel: "Finish",
    variants: [
      { id: "basalt", label: "Basalt" },
      { id: "walnut", label: "Walnut" },
    ],
  },
];
