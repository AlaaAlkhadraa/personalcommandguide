/**
 * The published packages and what they currently cost.
 *
 * `pricing.plans[].price` in the dictionaries is the regular price, shown
 * struck through. The current price lives here as a plain number so it can be
 * formatted with whichever thousands separator the locale's dictionary uses,
 * and so the saving is always computed from the two figures rather than typed
 * in by hand and left to drift.
 */

export type PlanKey = "starter" | "business" | "store" | "custom";

export interface Plan {
  key: PlanKey;
  /** Current price in euros. */
  price: number;
  /** Preselects the matching option in the project form. */
  needs: string;
}

export const PLANS: Plan[] = [
  { key: "starter", price: 299, needs: "new-website" },
  { key: "business", price: 549, needs: "new-website" },
  { key: "store", price: 899, needs: "online-store" },
  { key: "custom", price: 1349, needs: "web-application" },
];

/** "1.199" / "1,199" / "1 199" -> 1199. */
export function parsePrice(formatted: string): number {
  return Number(formatted.replace(/\D/g, ""));
}

/** Format a number the way the reference string separates its thousands. */
export function formatLike(reference: string, value: number): string {
  const separator = reference.includes(".")
    ? "."
    : reference.includes(" ")
      ? " "
      : ",";
  return value.toLocaleString("en-US").replaceAll(",", separator);
}

/** Link into the project form with the package preselected. */
export function planHref(needs?: string): string {
  return needs ? `/contact?type=${encodeURIComponent(needs)}` : "/contact";
}

export type AddOnKey = "extraPage" | "language";

export interface AddOn {
  key: AddOnKey;
  /** Price in euros, charged per unit named in the dictionary. */
  price: number;
}

/** Extras a package can grow by, priced per unit rather than per project. */
export const ADD_ONS: AddOn[] = [
  { key: "extraPage", price: 79 },
  { key: "language", price: 149 },
];
