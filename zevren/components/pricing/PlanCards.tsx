import Link from "next/link";

import { PLANS, formatLike, parsePrice, planHref } from "@/lib/offer";
import type { Dictionary } from "@/lib/i18n/dictionary-type";

/**
 * The four package cards.
 *
 * Shared by the home band and the services page so the two can never quote
 * different figures. The struck-through price is the regular price from the
 * dictionary, the large one is the current price, and the saving is the
 * difference between them rather than a number written by hand.
 *
 * Styled for the white pricing bands: dark type on white cards, with the
 * blue reserved for the saving and the hover state.
 */
export function PlanCards({
  offerDict,
  pricingDict,
}: {
  offerDict: Dictionary["offer"];
  pricingDict: Dictionary["pricing"];
}) {
  return (
    <div data-reveal-stagger className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {PLANS.map((plan) => {
        const copy = pricingDict.plans[plan.key];
        const regular = parsePrice(copy.price);
        const saving = regular - plan.price;
        return (
          <Link
            key={plan.key}
            href={planHref(plan.needs)}
            data-reveal-item
            data-tilt
            className="group relative flex flex-col gap-3 overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-[border-color,box-shadow] duration-300 hover:border-primary/50 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-white sm:p-6"
          >
            <span
              aria-hidden="true"
              className="pointer-events-none absolute -end-14 -top-14 h-36 w-36 rounded-full bg-primary/10 blur-3xl opacity-60 transition-opacity duration-500 group-hover:opacity-100"
            />
            <span className="relative text-sm font-semibold text-navy">{copy.name}</span>
            <span className="relative text-xs uppercase tracking-[0.16em] text-slate-500">
              {offerDict.regularLabel} <s className="text-slate-400">&euro;{copy.price}</s>
            </span>
            <span className="relative font-heading text-[2rem] font-bold leading-none tracking-tight text-navy">
              &euro;{formatLike(copy.price, plan.price)}
            </span>
            <p className="relative flex-1 text-sm leading-relaxed text-slate-600">
              {copy.description}
            </p>
            <span className="relative flex items-center justify-between gap-2">
              {saving > 0 && (
                <span className="w-fit rounded-full border border-primary/20 bg-primary/10 px-2.5 py-1 text-[11px] font-semibold text-primary">
                  {offerDict.saveLabel} &euro;{formatLike(copy.price, saving)}
                </span>
              )}
              <span
                aria-hidden="true"
                className="ms-auto text-slate-400 transition-[color,transform] duration-300 group-hover:translate-x-0.5 group-hover:text-primary rtl:group-hover:-translate-x-0.5"
              >
                &rarr;
              </span>
            </span>
          </Link>
        );
      })}
    </div>
  );
}
