import Link from "next/link";

import { FOUNDING_PLANS, claimHref } from "@/lib/campaign";
import type { Dictionary } from "@/lib/i18n/dictionary-type";

/**
 * The four founding prices.
 *
 * The struck-through figure is the price published on the services page, read
 * from the same dictionary, so the two pages cannot drift apart and the
 * comparison stays truthful. The saving shown on each card is computed from
 * those same two figures, never typed in by hand, for the same reason. No
 * percentages are shown anywhere: this is a launch price for the first ten
 * projects, not a sale.
 */

/** "1,199" -> 1199. The dictionaries format prices with separators. */
function parsePrice(formatted: string): number {
  return Number(formatted.replace(/[^\d]/g, ""));
}

/**
 * Formats a number with the same thousands separator the dictionary used for
 * the reference price ("1.199" in Dutch, "1,199" in English), so the computed
 * saving matches the locale's own formatting on the card next to it.
 */
function formatLike(reference: string, value: number): string {
  const separator = reference.includes(".") ? "." : ",";
  return value.toLocaleString("en-US").replaceAll(",", separator);
}

export function FoundingPricing({
  dict,
  pricingDict,
  soldOut,
}: {
  dict: Dictionary["campaign"];
  pricingDict: Dictionary["pricing"];
  soldOut: boolean;
}) {
  return (
    <div className="flex flex-col gap-8">
      <div data-reveal-stagger className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {FOUNDING_PLANS.map((plan) => {
          const copy = pricingDict.plans[plan.key];
          const saving = parsePrice(copy.price) - parsePrice(plan.foundingPrice);

          return (
            <div
              key={plan.key}
              data-reveal-item
              data-tilt
              className="group relative flex flex-col gap-4 overflow-hidden rounded-2xl border border-white/10 bg-navy/60 p-6 transition-colors duration-300 hover:border-accent/50 sm:p-7"
            >
              {/* Soft blue pool behind the price, stronger on hover. */}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute -end-16 -top-16 h-44 w-44 rounded-full bg-primary/15 blur-3xl transition-opacity duration-500 group-hover:opacity-100 sm:opacity-60"
              />

              <div className="relative flex items-start justify-between gap-3">
                <h3 className="text-base font-semibold text-white">{copy.name}</h3>
              </div>

              <div className="relative flex flex-col gap-2">
                <span className="text-xs uppercase tracking-[0.18em] text-muted">
                  {dict.regularLabel}{" "}
                  <s className="text-muted/70">&euro;{copy.price}</s>
                </span>
                <span className="flex items-baseline gap-2">
                  <span className="font-heading text-4xl font-bold tracking-tight text-white">
                    &euro;{plan.foundingPrice}
                  </span>
                  <span className="text-xs font-medium uppercase tracking-[0.18em] text-accent">
                    {dict.foundingLabel}
                  </span>
                </span>
                <span className="w-fit rounded-full border border-accent/30 bg-accent/10 px-3 py-1 text-xs font-semibold text-accent">
                  {dict.saveLabel} &euro;{formatLike(copy.price, saving)}
                </span>
              </div>

              <p className="relative flex-1 text-sm leading-relaxed text-muted">
                {copy.description}
              </p>

              {!soldOut && (
                <Link
                  href={claimHref(plan.needs)}
                  className="relative mt-auto flex w-fit items-center gap-1.5 rounded-full border border-white/15 px-4 py-2 text-xs font-semibold text-white transition-colors hover:border-accent/60 hover:text-accent"
                >
                  {dict.cta}
                  <span aria-hidden="true">&rarr;</span>
                </Link>
              )}
            </div>
          );
        })}
      </div>

      <p className="text-sm text-muted">{dict.pricingNote}</p>
    </div>
  );
}
