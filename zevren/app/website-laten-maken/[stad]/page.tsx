import type { Metadata } from "next";
import Link from "next/link";
import { headers } from "next/headers";
import { notFound } from "next/navigation";

import { CITIES, getCity } from "@/lib/local/cities";
import { SITE_CONFIG } from "@/lib/constants";
import { Container } from "@/components/ui/Container";
import { PackagesSection } from "@/components/pricing/PackagesSection";
import { FAQ } from "@/components/home/FAQ";
import { FinalCTA } from "@/components/home/FinalCTA";
import { JsonLd } from "@/components/seo/JsonLd";
import { RevealGroup } from "@/components/ui/RevealGroup";
import { breadcrumbJsonLd, buildMetadata } from "@/lib/seo";
import { getDictionary } from "@/lib/i18n/get-dictionary";

/**
 * The local landing pages: /website-laten-maken/<stad>.
 *
 * These pages target the Dutch search "website laten maken <stad>" and are
 * deliberately Dutch-only, whatever locale cookie the visitor carries: the
 * query is Dutch, so the answer is too. Each city gets its own hand-written
 * intro (see lib/local/cities.ts); prices, FAQ and the form are the same
 * components the rest of the site renders, so no figure can drift.
 */

interface PageProps {
  params: Promise<{ stad: string }>;
}

export const dynamicParams = false;

export function generateStaticParams() {
  return CITIES.map((city) => ({ stad: city.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { stad } = await params;
  const city = getCity(stad);
  if (!city) return {};
  return buildMetadata({
    title: `Website laten maken in ${city.name}`,
    description: city.metaDescription,
    path: `/website-laten-maken/${city.slug}`,
    locale: "nl",
  });
}

export default async function CityPage({ params }: PageProps) {
  const { stad } = await params;
  const city = getCity(stad);
  if (!city) notFound();

  const dict = getDictionary("nl");
  const nonce = (await headers()).get("x-nonce") ?? undefined;

  const serviceJsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: `Website laten maken in ${city.name}`,
    serviceType: "Webdesign en webdevelopment",
    provider: {
      "@type": "ProfessionalService",
      name: SITE_CONFIG.name,
      url: SITE_CONFIG.url,
    },
    areaServed: {
      "@type": "City",
      name: city.name,
    },
    url: `${SITE_CONFIG.url}/website-laten-maken/${city.slug}`,
  };

  const otherCities = CITIES.filter((c) => c.slug !== city.slug);

  return (
    <>
      <JsonLd data={serviceJsonLd} nonce={nonce} />
      <JsonLd
        data={breadcrumbJsonLd("Home", [
          { name: "Website laten maken", path: "/website-laten-maken" },
          { name: city.name, path: `/website-laten-maken/${city.slug}` },
        ])}
        nonce={nonce}
      />

      <section className="border-b border-white/5 bg-grid-glow py-16 sm:py-24">
        <Container className="flex max-w-3xl flex-col gap-6">
          <span className="text-sm font-semibold uppercase tracking-[0.2em] text-accent">
            {city.province}
          </span>
          <h1 className="font-heading text-4xl font-bold leading-[1.08] text-white sm:text-5xl">
            Website laten maken in {city.name}
          </h1>
          <p className="text-lg leading-relaxed text-muted">{city.intro}</p>
          <p className="text-base leading-relaxed text-muted">
            Wil je eerst zien hoe zoiets eruit kan zien? Op{" "}
            <Link href="/concept-bouwer" className="text-accent underline-offset-2 hover:underline">
              de conceptbouwer
            </Link>{" "}
            kies je een stijl en kleuren en zie je direct een voorbeeld van je eigen
            homepage, en{" "}
            <Link href="/projects" className="text-accent underline-offset-2 hover:underline">
              onze demo&apos;s
            </Link>{" "}
            kun je doorklikken alsof het echte sites zijn.
          </p>
        </Container>
      </section>

      <RevealGroup>
        <PackagesSection dict={dict.offer} pricingDict={dict.pricing} />

        <FAQ dict={dict.faq} homeDict={dict.home.faq} />

        <FinalCTA dict={dict.home.finalCta} contactDict={dict.contact} />

        {/* The other city pages, so every page in the cluster links every
            other and a crawler can reach them all from any one of them. */}
        <section className="border-t border-white/5 py-10">
          <Container className="flex flex-col gap-4">
            <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-muted">
              Ook actief in
            </h2>
            <p className="flex flex-wrap gap-x-4 gap-y-2 text-sm">
              {otherCities.map((other) => (
                <Link
                  key={other.slug}
                  href={`/website-laten-maken/${other.slug}`}
                  className="text-muted transition-colors hover:text-white"
                >
                  {other.name}
                </Link>
              ))}
            </p>
          </Container>
        </section>
      </RevealGroup>
    </>
  );
}
