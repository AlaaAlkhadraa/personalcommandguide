import Link from "next/link";

import { Card } from "@/components/ui/Card";
import { FOUNDING_PLANS, claimHref } from "@/lib/campaign";
import type { Dictionary } from "@/lib/i18n/dictionary-type";

/**
 * The four founding prices.
 *
 * The struck-through figure is the price published on the services page, read
 * from the same dictionary, so the two pages cannot drift apart and the
 * comparison stays truthful. No percentages are shown anywhere: this is a
 * launch price for the first ten projects, not a sale.
 */
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
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {FOUNDING_PLANS.map((plan) => {
          const copy = pricingDict.plans[plan.key];
          return (
            <Card key={plan.key} className="flex flex-col gap-4">
              <h3 className="text-base font-semibold text-white">{copy.name}</h3>

              <div className="flex flex-col gap-1">
                <span className="text-xs uppercase tracking-[0.18em] text-muted">
                  {dict.regularLabel}{" "}
                  <s className="text-muted/70">&euro;{copy.price}</s>
                </span>
                <span className="flex items-baseline gap-2">
                  <span className="font-heading text-3xl font-semibold text-white">
                    &euro;{plan.foundingPrice}
                  </span>
                  <span className="text-xs font-medium uppercase tracking-[0.18em] text-accent">
                    {dict.foundingLabel}
                  </span>
                </span>
              </div>

              <p className="flex-1 text-sm leading-relaxed text-muted">
                {copy.description}
              </p>

              {!soldOut && (
                <Link
                  href={claimHref(plan.needs)}
                  className="mt-auto flex w-fit items-center gap-1.5 rounded-full border border-white/15 px-4 py-2 text-xs font-semibold text-white transition-colors hover:border-accent/60 hover:text-accent"
                >
                  {dict.cta}
                  <span aria-hidden="true">&rarr;</span>
                </Link>
              )}
            </Card>
          );
        })}
      </div>

      <p className="text-sm text-muted">{dict.pricingNote}</p>
    </div>
  );
}
