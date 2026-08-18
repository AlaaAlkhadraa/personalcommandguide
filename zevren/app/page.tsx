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
import { buildMetadata } from "@/lib/seo";
import { SITE_CONFIG } from "@/lib/constants";
import { getLocale } from "@/lib/i18n/get-locale";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { RevealGroup } from "@/components/ui/RevealGroup";

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
      {/* The hero is above the fold and animates itself, so it stays outside
          the reveal group: fading in what the visitor is already looking at
          only delays the page. */}
      <Hero dict={dict.home.hero} />

      {/* One reveal scope for the whole page. Each section opts in through
          `data-reveal` on its own root, so no extra wrapper lands inside a
          grid or flex parent and disturbs a layout. */}
      <RevealGroup>
        <ServicesPreview dict={dict.services} homeDict={dict.home.services} />
        <Mission dict={dict.mission} />
        <ProjectsPreview dict={dict.work} homeDict={dict.home.work} />
        <AboutBand dict={dict.home.about} />
        <Process dict={dict.process} homeDict={dict.home.process} />
        <GlobalFocus dict={dict.globalFocus} />
        <WhyZevren dict={dict.whyZevren} homeDict={dict.home.why} />
        <FoundingSection dict={dict.campaign} />
        <FAQ dict={dict.faq} homeDict={dict.home.faq} />
        <FinalCTA dict={dict.home.finalCta} contactDict={dict.contact} />
      </RevealGroup>
    </>
  );
}
