/**
 * ZEVREN Founding 10.
 *
 * The regular prices here are read from the same pricing dictionary the
 * services page uses, so the "before" figure a visitor sees in the campaign is
 * the price actually published on the site. A campaign is not the place to
 * invent a higher original.
 */

export const FOUNDING_TOTAL = 10;

/** Slug used on submissions that came in through the campaign. */
export const FOUNDING_CAMPAIGN = "founding-10";

export type FoundingPlanKey = "starter" | "business" | "store" | "custom";

export interface FoundingPlan {
  key: FoundingPlanKey;
  /** Founding price in euros, without separators. */
  foundingPrice: string;
  /** Preselects the matching option in the project form. */
  needs: string;
}

export const FOUNDING_PLANS: FoundingPlan[] = [
  { key: "starter", foundingPrice: "150", needs: "new-website" },
  { key: "business", foundingPrice: "299", needs: "new-website" },
  { key: "store", foundingPrice: "499", needs: "online-store" },
  { key: "custom", foundingPrice: "799", needs: "web-application" },
];

/** Link into the project form with the plan preselected and the source tagged. */
export function claimHref(needs?: string): string {
  const params = new URLSearchParams({ campaign: FOUNDING_CAMPAIGN });
  if (needs) params.set("type", needs);
  return `/contact?${params.toString()}`;
}
