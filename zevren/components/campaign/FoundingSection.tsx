import Link from "next/link";

import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { FoundingCounter } from "@/components/campaign/FoundingCounter";
import { claimHref } from "@/lib/campaign";
import { getFoundingStatus } from "@/lib/server/campaign";
import type { Dictionary } from "@/lib/i18n/dictionary-type";

/**
 * Campaign block for the home page.
 *
 * Deliberately restrained: it reuses the site's own surfaces, type scale and
 * blue accent rather than shouting in a different visual language. A launch
 * that looks like a clearance banner reads as cheap, which is the opposite of
 * what a founding offer is for.
 */
export async function FoundingSection({ dict }: { dict: Dictionary["campaign"] }) {
  const status = await getFoundingStatus();

  return (
    <section className="relative overflow-hidden border-y border-white/5 bg-surface/30 py-20 sm:py-24">
      {/* Same blue glow the hero uses, so the section reads as part of the site. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-32 -top-32 h-[28rem] w-[28rem] rounded-full bg-primary/20 blur-[120px]"
      />

      <Container className="relative grid items-center gap-12 lg:grid-cols-[1.25fr_1fr]">
        <div className="flex flex-col gap-6">
          <span className="w-fit rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-xs font-medium uppercase tracking-[0.2em] text-accent">
            {dict.eyebrow}
          </span>

          <div>
            <h2 className="font-heading text-3xl font-semibold leading-tight text-white sm:text-4xl">
              {dict.title}
            </h2>
            <p className="mt-3 text-lg text-accent">{dict.subtitle}</p>
          </div>

          <p className="max-w-xl text-base leading-relaxed text-muted">{dict.intro}</p>
          <p className="max-w-xl text-base leading-relaxed text-muted">{dict.body}</p>

          <div className="flex flex-col gap-4 pt-2 sm:flex-row">
            {!status.soldOut && <Button href={claimHref()}>{dict.cta}</Button>}
            <Button href="/projects" variant="secondary">
              {dict.ctaSecondary}
            </Button>
          </div>

          <p className="pt-2 text-sm text-muted">{dict.location}</p>
        </div>

        <div className="flex flex-col gap-6 rounded-2xl border border-white/10 bg-navy/60 p-7 sm:p-8">
          <FoundingCounter status={status} dict={dict} />
          <Link
            href="/founding-10"
            className="flex w-fit items-center gap-1.5 text-sm font-medium text-accent transition-transform hover:translate-x-0.5"
          >
            {dict.pricingEyebrow}
            <span aria-hidden="true">&rarr;</span>
          </Link>
        </div>
      </Container>
    </section>
  );
}
