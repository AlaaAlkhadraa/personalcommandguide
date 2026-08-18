import Link from "next/link";

import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { FoundingCounter } from "@/components/campaign/FoundingCounter";
import { FOUNDING_PLANS, claimHref } from "@/lib/campaign";
import { getFoundingStatus } from "@/lib/server/campaign";
import type { Dictionary } from "@/lib/i18n/dictionary-type";

/**
 * Campaign block for the home page.
 *
 * The four founding prices are shown right here rather than behind a link:
 * a launch offer a visitor has to click through to understand is an offer
 * most visitors never see. The struck-through figures are the prices
 * published on the services page, read from the same dictionary, and the
 * saving is computed from those two numbers, never typed in by hand.
 */

/** "1.199" / "1,199" -> 1199. */
function parsePrice(formatted: string): number {
  return Number(formatted.replace(/[^\d]/g, ""));
}

/** Format a number with the same thousands separator the dictionary used. */
function formatLike(reference: string, value: number): string {
  const separator = reference.includes(".") ? "." : ",";
  return value.toLocaleString("en-US").replaceAll(",", separator);
}

export async function FoundingSection({
  dict,
  pricingDict,
}: {
  dict: Dictionary["campaign"];
  pricingDict: Dictionary["pricing"];
}) {
  const status = await getFoundingStatus();

  return (
    <section className="relative overflow-hidden border-y border-white/5 bg-surface/30 py-14 sm:py-24">
      {/* Twin glows, one per corner, so the band reads as a lit stage rather
          than a flat panel. */}
      <div
        aria-hidden="true"
        data-parallax="-12"
        className="pointer-events-none absolute -right-32 -top-32 h-[28rem] w-[28rem] rounded-full bg-primary/20 blur-[120px]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-40 -left-32 h-[24rem] w-[24rem] rounded-full bg-primary/10 blur-[120px]"
      />

      <Container className="relative flex flex-col gap-12">
        <div className="grid items-end gap-10 lg:grid-cols-[1.2fr_1fr] lg:gap-16">
          <div data-reveal className="flex flex-col gap-5">
            <span className="w-fit rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-xs font-medium uppercase tracking-[0.2em] text-accent">
              {dict.eyebrow}
            </span>
            <h2
              data-reveal-words
              className="font-heading text-3xl font-bold uppercase leading-[1.05] tracking-[-0.01em] text-white sm:text-4xl lg:text-[2.75rem]"
            >
              {dict.title}
            </h2>
            <p className="text-lg text-accent">{dict.subtitle}</p>
            <p className="max-w-xl text-base leading-relaxed text-muted">{dict.body}</p>
          </div>

          <div data-reveal data-reveal-delay="0.12" className="rounded-2xl bg-gradient-to-b from-accent/40 via-white/10 to-transparent p-px">
            <div className="flex flex-col gap-5 rounded-[calc(1rem-1px)] bg-navy/90 p-6 sm:p-7">
              <FoundingCounter status={status} dict={dict} compact />
            </div>
          </div>
        </div>

        {/* The four founding prices, in full view. */}
        <div data-reveal-stagger className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {FOUNDING_PLANS.map((plan) => {
            const copy = pricingDict.plans[plan.key];
            const saving = parsePrice(copy.price) - parsePrice(plan.foundingPrice);
            return (
              <Link
                key={plan.key}
                href={status.soldOut ? "/founding-10" : claimHref(plan.needs)}
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
                  {dict.regularLabel} <s className="text-muted/70">&euro;{copy.price}</s>
                </span>
                <span className="relative flex items-baseline gap-2">
                  <span className="font-heading text-[2rem] font-bold leading-none tracking-tight text-white">
                    &euro;{plan.foundingPrice}
                  </span>
                  <span className="text-[10px] font-medium uppercase tracking-[0.18em] text-accent">
                    {dict.foundingLabel}
                  </span>
                </span>
                <span className="relative flex items-center justify-between gap-2">
                  <span className="w-fit rounded-full border border-accent/30 bg-accent/10 px-2.5 py-1 text-[11px] font-semibold text-accent">
                    {dict.saveLabel} &euro;{formatLike(copy.price, saving)}
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

        <div data-reveal className="flex flex-col items-start gap-4 sm:flex-row sm:items-center">
          {!status.soldOut && <Button href={claimHref()}>{dict.cta}</Button>}
          <Link
            href="/founding-10"
            className="flex w-fit items-center gap-1.5 text-sm font-medium text-accent transition-transform hover:translate-x-0.5 rtl:hover:-translate-x-0.5"
          >
            {dict.pricingEyebrow}
            <span aria-hidden="true">&rarr;</span>
          </Link>
          <span className="text-sm text-muted sm:ms-auto">{dict.pricingNote}</span>
        </div>
      </Container>
    </section>
  );
}
