import { Hero } from "@/components/home/Hero";
import { ServicesPreview } from "@/components/home/ServicesPreview";
import { WorkPreview } from "@/components/home/WorkPreview";
import { WhyZevren } from "@/components/home/WhyZevren";
import { Process } from "@/components/home/Process";
import { FAQ } from "@/components/home/FAQ";
import { FinalCTA } from "@/components/home/FinalCTA";
import { buildMetadata } from "@/lib/seo";
import { SITE_CONFIG } from "@/lib/constants";
import { getLocale } from "@/lib/i18n/get-locale";
import { getDictionary } from "@/lib/i18n/get-dictionary";

export const metadata = buildMetadata({
  title: `${SITE_CONFIG.name} | ${SITE_CONFIG.tagline}`,
  description: SITE_CONFIG.description,
  path: "/",
});

export default async function HomePage() {
  const locale = await getLocale();
  const dict = getDictionary(locale);

  return (
    <>
      <Hero dict={dict.home.hero} />
      <ServicesPreview dict={dict.services} homeDict={dict.home.services} />
      <WorkPreview dict={dict.work} homeDict={dict.home.work} />
      <WhyZevren dict={dict.whyZevren} homeDict={dict.home.why} />
      <Process dict={dict.process} homeDict={dict.home.process} />
      <FAQ dict={dict.faq} homeDict={dict.home.faq} />
      <FinalCTA dict={dict.home.finalCta} />
    </>
  );
}
