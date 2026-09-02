import type { Metadata } from "next";
import { Link } from "@/components/ui/Link";
import { headers } from "next/headers";

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
 * Landing page for "webapplicatie laten maken" / "maatwerk webapplicatie":
 * the intent behind the from-1349 package. Dutch-only, price from PLANS.
 */

const CUSTOM_PRICE = PLANS.find((plan) => plan.key === "custom")!.price;

export async function generateMetadata(): Promise<Metadata> {
  return buildMetadata({
    title: `Webapplicatie laten maken vanaf ${CUSTOM_PRICE} euro`,
    description: `Dashboards, portalen en interne tools op maat, vanaf ${CUSTOM_PRICE} euro. Gebouwd rond hoe jouw bedrijf echt werkt, met werkende demo's online om zelf te proberen.`,
    path: "/webapplicatie-laten-maken",
    singleLocale: true,
    locale: "nl",
  });
}

export default async function WebapplicatieLatenMakenPage() {
  const dict = getDictionary("nl");
  const nonce = (await headers()).get("x-nonce") ?? undefined;

  const serviceJsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "Webapplicatie laten maken",
    serviceType: "Maatwerk webdevelopment",
    provider: {
      "@type": "ProfessionalService",
      name: SITE_CONFIG.name,
      url: SITE_CONFIG.url,
    },
    areaServed: "NL",
    offers: {
      "@type": "Offer",
      price: String(CUSTOM_PRICE),
      priceCurrency: "EUR",
      url: `${SITE_CONFIG.url}/webapplicatie-laten-maken`,
    },
    url: `${SITE_CONFIG.url}/webapplicatie-laten-maken`,
  };

  return (
    <>
      <JsonLd data={serviceJsonLd} nonce={nonce} />
      <JsonLd
        data={breadcrumbJsonLd("Home", [
          { name: "Webapplicatie laten maken", path: "/webapplicatie-laten-maken" },
        ])}
        nonce={nonce}
      />

      <section className="border-b border-white/5 bg-grid-glow py-16 sm:py-24">
        <Container className="flex max-w-3xl flex-col gap-6">
          <span className="text-sm font-semibold uppercase tracking-[0.2em] text-accent">
            Maatwerk
          </span>
          <h1 className="font-heading text-4xl font-bold leading-[1.08] text-white sm:text-5xl">
            Webapplicatie laten maken, vanaf {CUSTOM_PRICE} euro
          </h1>
          <p className="text-lg leading-relaxed text-muted">
            Dashboards, klantportalen, planningstools, interne systemen: als een
            standaardpakket niet past bij hoe jouw bedrijf echt werkt, bouwen wij iets
            dat dat wel doet. Gekoppeld aan de systemen die je al gebruikt, gebouwd
            rond je eigen proces, en met een startprijs die gewoon op de site staat.
          </p>
          <p className="text-base leading-relaxed text-muted">
            Wat zoiets kan zijn, zie je in onze demo&apos;s: het klantportaal van{" "}
            <Link
              href="/projects/accounting-firm"
              className="text-accent underline-offset-2 hover:underline"
            >
              Bergendal Accountants
            </Link>{" "}
            en de track-en-trace-omgeving van{" "}
            <Link
              href="/projects/tajex-logistics"
              className="text-accent underline-offset-2 hover:underline"
            >
              Tajex Logistics
            </Link>{" "}
            werken echt en kun je zelf doorklikken.
          </p>
        </Container>
      </section>

      <RevealGroup>
        <PackagesSection dict={dict.offer} pricingDict={dict.pricing} />

        <LocalFaq
          title="Veelgestelde vragen over maatwerk"
          nonce={nonce}
          items={[
            {
              question: "Wat kost een webapplicatie laten maken?",
              answer: `Maatwerk begint bij ${CUSTOM_PRICE} euro, exclusief btw. Omdat geen twee applicaties hetzelfde zijn, wordt een project vooraf op omvang geprijsd: je weet de prijs voordat we beginnen, en dat is de prijs op de factuur.`,
            },
            {
              question: "Kan de applicatie koppelen met wat ik al gebruik?",
              answer: "Ja. We bouwen rond hoe jouw bedrijf echt werkt en koppelen waar nodig aan de systemen die je al gebruikt, zodat gegevens niet twee keer ingevoerd hoeven te worden.",
            },
            {
              question: "Hoe weet ik vooraf of dit bij mijn bedrijf past?",
              answer: "Klik onze demo's door: het klantportaal van Bergendal Accountants en de track-en-trace-omgeving van Tajex Logistics werken echt. Vertel ons daarna kort wat je nodig hebt en je krijgt een eerlijk antwoord, ook als een standaardpakket toch volstaat.",
            },
          ]}
        />

        <FinalCTA dict={dict.home.finalCta} contactDict={dict.contact} />
      </RevealGroup>
    </>
  );
}
