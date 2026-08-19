import Link from "next/link";

import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { PlanCards } from "@/components/pricing/PlanCards";
import { planHref } from "@/lib/offer";
import type { Dictionary } from "@/lib/i18n/dictionary-type";

/**
 * The packages band on the home page.
 *
 * Prices sit on the page itself rather than behind a link: a price a visitor
 * has to navigate to find is a price most visitors never see, and being able
 * to read it without asking is the whole point of publishing it.
 */
export function PackagesSection({
  dict,
  pricingDict,
}: {
  dict: Dictionary["offer"];
  pricingDict: Dictionary["pricing"];
}) {
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

      <Container className="relative flex flex-col gap-10 sm:gap-12">
        <div data-reveal className="flex max-w-3xl flex-col gap-5">
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
          <p className="text-base leading-relaxed text-muted">{dict.body}</p>
        </div>

        <PlanCards offerDict={dict} pricingDict={pricingDict} />

        <div data-reveal className="flex flex-col items-start gap-4 sm:flex-row sm:items-center">
          <Button href={planHref()}>{dict.cta}</Button>
          <Link
            href="/projects"
            className="flex w-fit items-center gap-1.5 text-sm font-medium text-accent transition-transform hover:translate-x-0.5 rtl:hover:-translate-x-0.5"
          >
            {dict.ctaSecondary}
            <span aria-hidden="true">&rarr;</span>
          </Link>
          <span className="text-sm text-muted sm:ms-auto">{dict.note}</span>
        </div>
      </Container>
    </section>
  );
}
