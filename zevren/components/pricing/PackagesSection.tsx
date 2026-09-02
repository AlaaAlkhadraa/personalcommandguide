import { Link } from "@/components/ui/Link";

import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { PlanCards } from "@/components/pricing/PlanCards";
import { AddOnsRow } from "@/components/pricing/AddOnsRow";
import { SubscriptionCard } from "@/components/pricing/SubscriptionCard";
import { planHref } from "@/lib/offer";
import type { Dictionary } from "@/lib/i18n/dictionary-type";

/**
 * The packages band on the home page.
 *
 * Prices sit on the page itself rather than behind a link: a price a visitor
 * has to navigate to find is a price most visitors never see, and being able
 * to read it without asking is the whole point of publishing it.
 *
 * The band is white on purpose: the dark hero above it sets the brand, and
 * the prices read like ink on paper right after it.
 */
export function PackagesSection({
  dict,
  pricingDict,
}: {
  dict: Dictionary["offer"];
  pricingDict: Dictionary["pricing"];
}) {
  return (
    <section className="relative overflow-hidden bg-white py-14 sm:py-24">
      {/* A whisper of the brand blue in the corners, so the white band still
          belongs to the same site as the dark hero above it. */}
      <div
        aria-hidden="true"
        data-parallax="-12"
        className="pointer-events-none absolute -right-32 -top-32 h-[28rem] w-[28rem] rounded-full bg-primary/10 blur-[120px]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-40 -left-32 h-[24rem] w-[24rem] rounded-full bg-accent/10 blur-[120px]"
      />

      <Container className="relative flex flex-col gap-10 sm:gap-12">
        <div data-reveal className="flex max-w-3xl flex-col gap-5">
          <span className="w-fit rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-xs font-medium uppercase tracking-[0.2em] text-primary">
            {dict.eyebrow}
          </span>
          <h2
            data-reveal-words
            className="font-heading text-3xl font-bold uppercase leading-[1.05] tracking-[-0.01em] text-navy sm:text-4xl lg:text-[2.75rem]"
          >
            {dict.title}
          </h2>
          <p className="text-lg text-primary">{dict.subtitle}</p>
          <p className="text-base leading-relaxed text-slate-600">{dict.body}</p>
        </div>

        <PlanCards offerDict={dict} pricingDict={pricingDict} />

        <AddOnsRow dict={dict.addOns} />

        <SubscriptionCard dict={dict.subscription} />

        <div data-reveal className="flex flex-col items-start gap-4 sm:flex-row sm:items-center">
          <Button href={planHref()}>{dict.cta}</Button>
          <Link
            href="/projects"
            className="flex w-fit items-center gap-1.5 text-sm font-medium text-primary transition-transform hover:translate-x-0.5 rtl:hover:-translate-x-0.5"
          >
            {dict.ctaSecondary}
            <span aria-hidden="true">&rarr;</span>
          </Link>
          <span className="text-sm text-slate-500 sm:ms-auto">{dict.note}</span>
        </div>
      </Container>
    </section>
  );
}
