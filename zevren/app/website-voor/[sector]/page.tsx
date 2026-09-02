import type { Metadata } from "next";
import Link from "next/link";
import { headers } from "next/headers";
import { notFound } from "next/navigation";

import { SECTORS, getSector } from "@/lib/local/sectors";
import { PLANS } from "@/lib/offer";
import { SITE_CONFIG } from "@/lib/constants";
import { Container } from "@/components/ui/Container";
import { PackagesSection } from "@/components/pricing/PackagesSection";
import { LocalFaq } from "@/components/local/LocalFaq";
import { FinalCTA } from "@/components/home/FinalCTA";
import { JsonLd } from "@/components/seo/JsonLd";
import { RevealGroup } from "@/components/ui/RevealGroup";
import { breadcrumbJsonLd, buildMetadata } from "@/lib/seo";
import { getDictionary } from "@/lib/i18n/get-dictionary";

/**
 * Sector landing pages: /website-voor/<sector>, for searches like "website
 * voor kapsalon". Each page is anchored on a demo that actually exists, so
 * the proof paragraph can invite the visitor to click instead of asking them
 * to believe. Dutch-only, like the rest of the landing cluster.
 */

interface PageProps {
  params: Promise<{ sector: string }>;
}

export const dynamicParams = false;

export function generateStaticParams() {
  return SECTORS.map((sector) => ({ sector: sector.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { sector: slug } = await params;
  const sector = getSector(slug);
  if (!sector) return {};
  return buildMetadata({
    title: `Website voor ${sector.name}`,
    description: sector.metaDescription,
    path: `/website-voor/${sector.slug}`,
    locale: "nl",
  });
}

export default async function SectorPage({ params }: PageProps) {
  const { sector: slug } = await params;
  const sector = getSector(slug);
  if (!sector) notFound();

  const dict = getDictionary("nl");
  const nonce = (await headers()).get("x-nonce") ?? undefined;
  const plan = PLANS.find((p) => p.key === sector.planKey)!;

  const serviceJsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: `Website voor ${sector.name}`,
    serviceType: "Webdesign en webdevelopment",
    provider: {
      "@type": "ProfessionalService",
      name: SITE_CONFIG.name,
      url: SITE_CONFIG.url,
    },
    areaServed: "NL",
    offers: {
      "@type": "Offer",
      price: String(plan.price),
      priceCurrency: "EUR",
      url: `${SITE_CONFIG.url}/website-voor/${sector.slug}`,
    },
    url: `${SITE_CONFIG.url}/website-voor/${sector.slug}`,
  };

  const otherSectors = SECTORS.filter((s) => s.slug !== sector.slug);

  return (
    <>
      <JsonLd data={serviceJsonLd} nonce={nonce} />
      <JsonLd
        data={breadcrumbJsonLd("Home", [
          { name: "Website laten maken", path: "/website-laten-maken" },
          { name: `Voor ${sector.name}`, path: `/website-voor/${sector.slug}` },
        ])}
        nonce={nonce}
      />

      <section className="border-b border-white/5 bg-grid-glow py-16 sm:py-24">
        <Container className="flex max-w-3xl flex-col gap-6">
          <span className="text-sm font-semibold uppercase tracking-[0.2em] text-accent">
            Per branche
          </span>
          <h1 className="font-heading text-4xl font-bold leading-[1.08] text-white sm:text-5xl">
            Een website voor {sector.h1Noun}
          </h1>
          <p className="text-lg leading-relaxed text-muted">{sector.intro}</p>
          <p className="text-base leading-relaxed text-muted">
            {sector.proof}{" "}
            {sector.demoSlug ? (
              <>
                <Link
                  href={`/projects/${sector.demoSlug}`}
                  className="text-accent underline-offset-2 hover:underline"
                >
                  Bekijk {sector.demoName}
                </Link>
                , of bouw eerst zelf een concept met{" "}
                <Link
                  href="/concept-bouwer"
                  className="text-accent underline-offset-2 hover:underline"
                >
                  de conceptbouwer
                </Link>
                .
              </>
            ) : (
              <Link
                href="/concept-bouwer"
                className="text-accent underline-offset-2 hover:underline"
              >
                Open de conceptbouwer
              </Link>
            )}
          </p>
        </Container>
      </section>

      <RevealGroup>
        <PackagesSection dict={dict.offer} pricingDict={dict.pricing} />

        <LocalFaq title={`Veelgestelde vragen van ${sector.name}`} items={sector.faq} nonce={nonce} />

        <FinalCTA dict={dict.home.finalCta} contactDict={dict.contact} />

        <section className="border-t border-white/5 py-10">
          <Container className="flex flex-col gap-4">
            <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-muted">
              Ook per branche
            </h2>
            <p className="flex flex-wrap gap-x-4 gap-y-2 text-sm">
              {otherSectors.map((other) => (
                <Link
                  key={other.slug}
                  href={`/website-voor/${other.slug}`}
                  className="text-muted transition-colors hover:text-white"
                >
                  Website voor {other.name}
                </Link>
              ))}
              <Link
                href="/website-laten-maken"
                className="text-muted transition-colors hover:text-white"
              >
                Alle steden
              </Link>
            </p>
          </Container>
        </section>
      </RevealGroup>
    </>
  );
}
