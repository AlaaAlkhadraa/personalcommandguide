import Link from "next/link";

import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { RevealGroup } from "@/components/ui/RevealGroup";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { FoundingCounter } from "@/components/campaign/FoundingCounter";
import { FoundingPricing } from "@/components/campaign/FoundingPricing";
import { claimHref } from "@/lib/campaign";
import { getFoundingStatus } from "@/lib/server/campaign";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { buildMetadata } from "@/lib/seo";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function generateMetadata() {
  const dict = getDictionary(await getLocale());
  return buildMetadata({
    title: dict.campaign.metaTitle,
    description: dict.campaign.metaDescription,
    path: "/founding-10",
  });
}

export default async function FoundingPage() {
  const dict = getDictionary(await getLocale());
  const c = dict.campaign;
  const status = await getFoundingStatus();

  return (
    <RevealGroup>
      <section className="relative overflow-hidden border-b border-white/5 bg-grid-glow py-20 sm:py-28">
        <div
          aria-hidden="true"
          data-parallax="-14"
          className="pointer-events-none absolute -right-40 -top-40 h-[32rem] w-[32rem] rounded-full bg-primary/20 blur-[140px]"
        />
        <Container className="relative grid items-center gap-14 lg:grid-cols-[1.2fr_1fr]">
          <div data-reveal className="flex flex-col gap-6">
            <span className="w-fit rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-xs font-medium uppercase tracking-[0.2em] text-accent">
              {c.eyebrow}
            </span>
            <h1 className="font-heading text-4xl font-semibold leading-[1.05] text-white sm:text-5xl lg:text-6xl">
              {c.title}
            </h1>
            <p className="text-xl text-accent">{c.subtitle}</p>
            <p className="max-w-xl text-lg leading-relaxed text-muted">{c.intro}</p>
            <p className="max-w-xl text-base leading-relaxed text-muted">{c.body}</p>
            <div className="flex flex-col gap-4 pt-2 sm:flex-row">
              {!status.soldOut && <Button href={claimHref()}>{c.cta}</Button>}
              <Button href="/projects" variant="secondary">
                {c.ctaSecondary}
              </Button>
            </div>
            <p className="pt-4 text-sm text-muted">{c.location}</p>
          </div>

          {/* Gradient ring, not a plain border: the counter is the reason
              this page exists, so its card gets the strongest frame. */}
          <div data-reveal data-reveal-delay="0.15" className="rounded-2xl bg-gradient-to-b from-accent/40 via-white/10 to-transparent p-px">
            <div className="rounded-[calc(1rem-1px)] border border-transparent bg-navy/90 p-7 sm:p-8">
              <FoundingCounter status={status} dict={c} />
            </div>
          </div>
        </Container>
      </section>

      <section className="border-b border-white/5 py-20">
        <Container className="flex flex-col gap-12">
          <SectionHeading
            eyebrow={c.pricingEyebrow}
            title={c.pricingTitle}
            description={c.body}
          />
          <FoundingPricing dict={c} pricingDict={dict.pricing} soldOut={status.soldOut} />
        </Container>
      </section>

      <section className="border-b border-white/5 bg-surface/30 py-20">
        <Container className="flex flex-col gap-12">
          <SectionHeading eyebrow={c.eyebrow} title={c.whatYouGet} />
          <div data-reveal-stagger className="grid gap-6 sm:grid-cols-3">
            {c.points.map((point) => (
              <div
                key={point.title}
                data-reveal-item
                data-tilt
                className="flex flex-col gap-3 rounded-2xl border border-white/10 bg-navy/40 p-7 transition-colors duration-300 hover:border-accent/40"
              >
                <span aria-hidden="true" className="flex h-9 w-9 items-center justify-center rounded-full border border-accent/30 bg-accent/10 text-accent">
                  <svg viewBox="0 0 16 16" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                    <path d="m3 8.5 3.5 3.5L13 5" />
                  </svg>
                </span>
                <h3 className="text-base font-semibold text-white">{point.title}</h3>
                <p className="text-sm leading-relaxed text-muted">{point.description}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      <section className="py-20">
        <Container className="flex flex-col items-center gap-6 text-center">
          <h2 className="max-w-xl font-heading text-3xl font-semibold text-white">
            {status.soldOut ? c.counterClosed : c.subtitle}
          </h2>
          <p className="max-w-lg text-muted">{c.pricingNote}</p>
          {!status.soldOut && (
            <div className="flex flex-col gap-4 sm:flex-row">
              <Button href={claimHref()}>{c.cta}</Button>
              <Link
                href="/services"
                className="flex items-center justify-center rounded-full border border-white/15 px-6 py-3 text-sm font-semibold text-white transition-colors hover:border-accent/60"
              >
                {c.ctaSecondary}
              </Link>
            </div>
          )}
          <p className="pt-4 text-sm text-muted">{c.location}</p>
        </Container>
      </section>
    </RevealGroup>
  );
}
