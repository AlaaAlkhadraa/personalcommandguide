import type { Metadata } from "next";
import { Hero } from "@/components/home/Hero";
import { PackagesSection } from "@/components/pricing/PackagesSection";
import { ProjectsPreview } from "@/components/home/ProjectsPreview";
import { FAQ } from "@/components/home/FAQ";
import { FinalCTA } from "@/components/home/FinalCTA";
import { headers } from "next/headers";

import { buildMetadata } from "@/lib/seo";
import { getLocale } from "@/lib/i18n/get-locale";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { JsonLd } from "@/components/seo/JsonLd";
import { RevealGroup } from "@/components/ui/RevealGroup";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const meta = getDictionary(locale).meta.home;
  return buildMetadata({
    title: meta.title,
    description: meta.description,
    path: "/",
    locale,
  });
}

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
      {/* Five sections, one job: a visitor from an ad decides in half a
          minute. Prices first because published prices are the pitch, the
          demos as proof, the FAQ for objections, and one ask at the end.
          Services, about, process and the trust bands live on their own
          pages behind the nav; repeating them here only buried the ask. */}
      <RevealGroup>
        <PackagesSection dict={dict.offer} pricingDict={dict.pricing} />
        <ProjectsPreview dict={dict.work} homeDict={dict.home.work} />
        <FAQ dict={dict.faq} homeDict={dict.home.faq} />
        <FinalCTA dict={dict.home.finalCta} contactDict={dict.contact} />
      </RevealGroup>
    </>
  );
}
