import Link from "next/link";

import { SectionHeading } from "@/components/ui/SectionHeading";
import { Card } from "@/components/ui/Card";
import { Container } from "@/components/ui/Container";
import { FOUNDING_PLANS, claimHref } from "@/lib/campaign";
import { getFoundingStatus } from "@/lib/server/campaign";
import type { Dictionary } from "@/lib/i18n/dictionary-type";

interface PricingSectionProps {
  dict: Dictionary["services"];
  pricingDict: Dictionary["pricing"];
  campaignDict: Dictionary["campaign"];
}

/** "1.199" / "1,199" -> 1199. */
function parsePrice(formatted: string): number {
  return Number(formatted.replace(/[^\d]/g, ""));
}

/** Format a number with the same thousands separator the dictionary used. */
function formatLike(reference: string, value: number): string {
  const separator = reference.includes(".") ? "." : ",";
  return value.toLocaleString("en-US").replaceAll(",", separator);
}

/**
 * The services page price grid.
 *
 * While founding spots remain open this shows the same offer the campaign
 * shows: regular price struck through, founding price large, the computed
 * saving on a badge, and the card linking straight into the claim flow. A
 * visitor comparing services should not discover the launch price only
 * after navigating somewhere else. Once the ten spots are gone the grid
 * falls back to the plain published prices on its own.
 */
export async function PricingSection({ dict, pricingDict, campaignDict }: PricingSectionProps) {
  const status = await getFoundingStatus();

  return (
    <section className="border-t border-white/5 bg-surface/30 py-14 sm:py-20">
      <Container className="flex flex-col gap-12">
        <div data-reveal>
          <SectionHeading
            eyebrow={dict.pricingEyebrow}
            title={dict.pricingTitle}
            description={dict.pricingSubtitle}
          />
        </div>

        {status.soldOut ? (
          <div data-reveal-stagger className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {FOUNDING_PLANS.map((plan) => {
              const copy = pricingDict.plans[plan.key];
              return (
                <Card key={plan.key} data-reveal-item className="flex flex-col gap-3">
                  <h3 className="text-base font-semibold text-white">{copy.name}</h3>
                  <span className="text-2xl font-semibold text-white">
                    {dict.from} &euro;{copy.price}
                  </span>
                  <p className="text-sm leading-relaxed text-muted">{copy.description}</p>
                </Card>
              );
            })}
          </div>
        ) : (
          <div data-reveal-stagger className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {FOUNDING_PLANS.map((plan) => {
              const copy = pricingDict.plans[plan.key];
              const saving = parsePrice(copy.price) - parsePrice(plan.foundingPrice);
              return (
                <Link
                  key={plan.key}
                  href={claimHref(plan.needs)}
                  data-reveal-item
                  data-tilt
                  className="group relative flex flex-col gap-3 overflow-hidden rounded-2xl border border-white/10 bg-navy/70 p-5 transition-colors duration-300 hover:border-accent/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent sm:p-6"
                >
                  <span
                    aria-hidden="true"
                    className="pointer-events-none absolute -end-14 -top-14 h-36 w-36 rounded-full bg-primary/15 blur-3xl opacity-60 transition-opacity duration-500 group-hover:opacity-100"
                  />
                  <span className="relative text-sm font-semibold text-white">{copy.name}</span>
                  <span className="relative text-xs uppercase tracking-[0.16em] text-muted">
                    {campaignDict.regularLabel} <s className="text-muted/70">&euro;{copy.price}</s>
                  </span>
                  <span className="relative flex items-baseline gap-2">
                    <span className="font-heading text-[2rem] font-bold leading-none tracking-tight text-white">
                      &euro;{plan.foundingPrice}
                    </span>
                    <span className="text-[10px] font-medium uppercase tracking-[0.18em] text-accent">
                      {campaignDict.foundingLabel}
                    </span>
                  </span>
                  <p className="relative flex-1 text-sm leading-relaxed text-muted">
                    {copy.description}
                  </p>
                  <span className="relative flex items-center justify-between gap-2">
                    <span className="w-fit rounded-full border border-accent/30 bg-accent/10 px-2.5 py-1 text-[11px] font-semibold text-accent">
                      {campaignDict.saveLabel} &euro;{formatLike(copy.price, saving)}
                    </span>
                    <span
                      aria-hidden="true"
                      className="text-muted/60 transition-[color,transform] duration-300 group-hover:translate-x-0.5 group-hover:text-accent rtl:group-hover:-translate-x-0.5"
                    >
                      &rarr;
                    </span>
                  </span>
                </Link>
              );
            })}
          </div>
        )}

        {!status.soldOut && (
          <div data-reveal className="-mt-4 flex flex-wrap items-center gap-3">
            <span className="rounded-full border border-accent/30 bg-accent/10 px-3 py-1 text-xs font-semibold text-accent">
              {campaignDict.eyebrow}
            </span>
            <Link
              href="/founding-10"
              className="flex items-center gap-1.5 text-sm font-medium text-accent transition-transform hover:translate-x-0.5 rtl:hover:-translate-x-0.5"
            >
              {campaignDict.pricingEyebrow}
              <span aria-hidden="true">&rarr;</span>
            </Link>
          </div>
        )}

        <p className="text-sm text-muted">{dict.pricingNote}</p>
      </Container>
    </section>
  );
}
