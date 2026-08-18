import { Hero } from "@/components/home/Hero";
import { FoundingSection } from "@/components/campaign/FoundingSection";
import { ServicesPreview } from "@/components/home/ServicesPreview";
import { ProjectsPreview } from "@/components/home/ProjectsPreview";
import { GlobalFocus } from "@/components/home/GlobalFocus";
import { WhyZevren } from "@/components/home/WhyZevren";
import { Process } from "@/components/home/Process";
import { FAQ } from "@/components/home/FAQ";
import { AboutBand } from "@/components/home/AboutBand";
import { Mission } from "@/components/home/Mission";
import { FinalCTA } from "@/components/home/FinalCTA";
import { headers } from "next/headers";

import { buildMetadata } from "@/lib/seo";
import { SITE_CONFIG } from "@/lib/constants";
import { getLocale } from "@/lib/i18n/get-locale";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { JsonLd } from "@/components/seo/JsonLd";
import { RevealGroup } from "@/components/ui/RevealGroup";

export const metadata = buildMetadata({
  title: `${SITE_CONFIG.name} | ${SITE_CONFIG.tagline}`,
  description: SITE_CONFIG.description,
  path: "/",
});

export default async function HomePage() {
  const locale = await getLocale();
  const dict = getDictionary(locale);
  const nonce = (await headers()).get("x-nonce") ?? undefined;

  // The FAQ rendered further down, in the language actually served, so a
  // search result can show the questions directly under the listing.
  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    inLanguage: locale,
    mainEntity: dict.faq.items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: { "@type": "Answer", text: item.answer },
    })),
  };

  return (
    <>
      <JsonLd data={faqJsonLd} nonce={nonce} />
      {/* The hero is above the fold and animates itself, so it stays outside
          the reveal group: fading in what the visitor is already looking at
          only delays the page. */}
      <Hero dict={dict.home.hero} />

      {/* One reveal scope for the whole page. Each section opts in through
          `data-reveal` on its own root, so no extra wrapper lands inside a
          grid or flex parent and disturbs a layout. */}
      <RevealGroup>
        <ServicesPreview dict={dict.services} homeDict={dict.home.services} />
        {/* The launch offer sits right behind the services it prices, high on
            the page: an offer nobody scrolls to is an offer nobody takes. */}
        <FoundingSection dict={dict.campaign} pricingDict={dict.pricing} />
        <Mission dict={dict.mission} />
        <ProjectsPreview dict={dict.work} homeDict={dict.home.work} />
        <AboutBand dict={dict.home.about} />
        <Process dict={dict.process} homeDict={dict.home.process} />
        <GlobalFocus dict={dict.globalFocus} />
        <WhyZevren dict={dict.whyZevren} homeDict={dict.home.why} />
        <FAQ dict={dict.faq} homeDict={dict.home.faq} />
        <FinalCTA dict={dict.home.finalCta} contactDict={dict.contact} />
      </RevealGroup>
    </>
  );
}
