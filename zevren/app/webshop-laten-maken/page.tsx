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
 * Landing page for the search "webshop laten maken": the intent behind the
 * 899-euro package. Dutch-only on purpose, like the city pages. The price in
 * the copy comes from PLANS, so it can never differ from the pricing band
 * rendered below it.
 */

const STORE_PRICE = PLANS.find((plan) => plan.key === "store")!.price;

export async function generateMetadata(): Promise<Metadata> {
  return buildMetadata({
    title: `Webshop laten maken voor ${STORE_PRICE} euro`,
    description: `Een complete webshop met checkout, productbeheer en betalingen voor ${STORE_PRICE} euro. De prijs staat gewoon online, en de demo-webshops kun je zelf doorklikken tot en met het afrekenen.`,
    path: "/webshop-laten-maken",
    singleLocale: true,
    locale: "nl",
  });
}

export default async function WebshopLatenMakenPage() {
  const dict = getDictionary("nl");
  const nonce = (await headers()).get("x-nonce") ?? undefined;

  const serviceJsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "Webshop laten maken",
    serviceType: "E-commerce webdevelopment",
    provider: {
      "@type": "ProfessionalService",
      name: SITE_CONFIG.name,
      url: SITE_CONFIG.url,
    },
    areaServed: "NL",
    offers: {
      "@type": "Offer",
      price: String(STORE_PRICE),
      priceCurrency: "EUR",
      url: `${SITE_CONFIG.url}/webshop-laten-maken`,
    },
    url: `${SITE_CONFIG.url}/webshop-laten-maken`,
  };

  return (
    <>
      <JsonLd data={serviceJsonLd} nonce={nonce} />
      <JsonLd
        data={breadcrumbJsonLd("Home", [
          { name: "Webshop laten maken", path: "/webshop-laten-maken" },
        ])}
        nonce={nonce}
      />

      <section className="border-b border-white/5 bg-grid-glow py-16 sm:py-24">
        <Container className="flex max-w-3xl flex-col gap-6">
          <span className="text-sm font-semibold uppercase tracking-[0.2em] text-accent">
            E-commerce
          </span>
          <h1 className="font-heading text-4xl font-bold leading-[1.08] text-white sm:text-5xl">
            Webshop laten maken voor {STORE_PRICE} euro
          </h1>
          <p className="text-lg leading-relaxed text-muted">
            Een complete webshop: productpagina&apos;s die verkopen, een veilige checkout
            met betalingen, en productbeheer dat je zelf aankunt zodra de winkel live
            staat. Van de eerste productpagina tot het bevestigingsscherm is elke stap
            eenvoudig gehouden, en wat het kost staat hierboven, niet in een offerte.
          </p>
          <p className="text-base leading-relaxed text-muted">
            Het bewijs klik je zelf aan: onze demo-webshops{" "}
            <Link
              href="/projects/online-store"
              className="text-accent underline-offset-2 hover:underline"
            >
              Nordwave Audio
            </Link>{" "}
            en{" "}
            <Link
              href="/projects/ellezone"
              className="text-accent underline-offset-2 hover:underline"
            >
              ElleZone
            </Link>{" "}
            werken echt, tot en met de winkelwagen en het afrekenen. Zo weet je hoe je
            eigen shop straks voelt voordat je iets uitgeeft.
          </p>
        </Container>
      </section>

      <RevealGroup>
        <PackagesSection dict={dict.offer} pricingDict={dict.pricing} />

        <LocalFaq
          title="Veelgestelde vragen over een webshop"
          nonce={nonce}
          items={[
            {
              question: "Wat kost een webshop laten maken?",
              answer: `Het Webshop-pakket is ${STORE_PRICE} euro eenmalig, exclusief btw: productpagina's, winkelwagen, veilige checkout en betalingen, en productbeheer dat je zelf aankunt. De prijs staat op de site; grotere webshops worden vooraf op omvang geprijsd.`,
            },
            {
              question: "Kan ik zelf producten toevoegen en prijzen wijzigen?",
              answer: "Ja. De webshop wordt zo opgezet dat je hem zelf kunt beheren zodra hij live staat: producten, prijzen, voorraad en teksten. Wil je dat liever uitbesteden, dan kan dat via het onderhoudsplan van 49,99 euro per maand.",
            },
            {
              question: "Werkt de webshop ook goed op mobiel?",
              answer: "Ja, mobiel is het uitgangspunt: het grootste deel van de bezoekers komt via de telefoon, dus van productpagina tot afrekenen is elke stap daarop gebouwd. Probeer het zelf in onze demo-webshops.",
            },
          ]}
        />

        <FinalCTA dict={dict.home.finalCta} contactDict={dict.contact} />
      </RevealGroup>
    </>
  );
}
