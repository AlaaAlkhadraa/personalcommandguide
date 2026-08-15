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
  swatch: string;
  variantLabel: string;
  variants: ProductVariant[];
}

export const STORE_CATEGORIES = ["All", "Lighting", "Textiles", "Kitchen", "Decor"];

export const PRODUCTS: Product[] = [
  {
    id: "p1",
    slug: "arc-table-lamp",
    name: "Arc Table Lamp",
    category: "Lighting",
    price: 89,
    description:
      "A soft-glow table lamp with a hand-finished ceramic base and linen shade.",
    swatch: "from-amber-200 via-stone-200 to-stone-300",
    variantLabel: "Colour",
    variants: [
      { id: "sand", label: "Sand" },
      { id: "charcoal", label: "Charcoal" },
    ],
  },
  {
    id: "p2",
    slug: "linen-throw",
    name: "Linen Throw",
    category: "Textiles",
    price: 59,
    description: "A pre-washed linen throw that softens with every use.",
    swatch: "from-stone-100 via-stone-200 to-stone-300",
    variantLabel: "Colour",
    variants: [
      { id: "oat", label: "Oat" },
      { id: "clay", label: "Clay" },
      { id: "moss", label: "Moss" },
    ],
  },
  {
    id: "p3",
    slug: "ceramic-pour-over",
    name: "Ceramic Pour Over Set",
    category: "Kitchen",
    price: 45,
    description: "A slow-drip ceramic pour over set with a matching carafe.",
    swatch: "from-orange-100 via-stone-200 to-stone-300",
    variantLabel: "Colour",
    variants: [
      { id: "white", label: "White" },
      { id: "terracotta", label: "Terracotta" },
    ],
  },
  {
    id: "p4",
    slug: "walnut-tray",
    name: "Walnut Serving Tray",
    category: "Kitchen",
    price: 39,
    description: "A solid walnut tray with brass handles, finished by hand.",
    swatch: "from-amber-300 via-amber-200 to-stone-200",
    variantLabel: "Size",
    variants: [
      { id: "s", label: "Small" },
      { id: "l", label: "Large" },
    ],
  },
  {
    id: "p5",
    slug: "wool-cushion",
    name: "Wool Cushion Cover",
    category: "Textiles",
    price: 35,
    description: "A densely woven wool cushion cover with a hidden zip.",
    swatch: "from-emerald-100 via-stone-200 to-stone-300",
    variantLabel: "Colour",
    variants: [
      { id: "moss", label: "Moss" },
      { id: "rust", label: "Rust" },
      { id: "stone", label: "Stone" },
    ],
  },
  {
    id: "p6",
    slug: "pendant-light",
    name: "Rattan Pendant Light",
    category: "Lighting",
    price: 129,
    description: "A woven rattan pendant that casts warm, dappled light.",
    swatch: "from-amber-200 via-orange-100 to-stone-200",
    variantLabel: "Size",
    variants: [
      { id: "s", label: "Small" },
      { id: "m", label: "Medium" },
    ],
  },
  {
    id: "p7",
    slug: "stoneware-vase",
    name: "Stoneware Vase",
    category: "Decor",
    price: 49,
    description: "A hand-thrown stoneware vase with a matte reactive glaze.",
    swatch: "from-stone-200 via-stone-300 to-stone-400",
    variantLabel: "Colour",
    variants: [
      { id: "ash", label: "Ash" },
      { id: "olive", label: "Olive" },
    ],
  },
  {
    id: "p8",
    slug: "oak-mirror",
    name: "Oak Frame Mirror",
    category: "Decor",
    price: 149,
    description: "A round mirror in a solid oak frame, ready to hang.",
    swatch: "from-amber-100 via-stone-200 to-stone-300",
    variantLabel: "Size",
    variants: [
      { id: "60", label: "60 cm" },
      { id: "80", label: "80 cm" },
    ],
  },
];
