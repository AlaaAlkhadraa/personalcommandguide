import Link from "next/link";

import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
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
    <>
      <section className="relative overflow-hidden border-b border-white/5 bg-grid-glow py-20 sm:py-28">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-40 -top-40 h-[32rem] w-[32rem] rounded-full bg-primary/20 blur-[140px]"
        />
        <Container className="relative grid items-center gap-14 lg:grid-cols-[1.2fr_1fr]">
          <div className="flex flex-col gap-6">
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
              <Button href="/work" variant="secondary">
                {c.ctaSecondary}
              </Button>
            </div>
            <p className="pt-4 text-sm text-muted">{c.location}</p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-navy/60 p-7 sm:p-8">
            <FoundingCounter status={status} dict={c} />
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
          <div className="grid gap-6 sm:grid-cols-3">
            {c.points.map((point) => (
              <div
                key={point.title}
                className="flex flex-col gap-3 rounded-2xl border border-white/10 bg-navy/40 p-7"
              >
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
    </>
  );
}
