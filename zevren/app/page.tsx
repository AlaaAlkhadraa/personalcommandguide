import { Hero } from "@/components/home/Hero";
import { ServicesPreview } from "@/components/home/ServicesPreview";
import { WorkPreview } from "@/components/home/WorkPreview";
import { WhyZevren } from "@/components/home/WhyZevren";
import { Process } from "@/components/home/Process";
import { FAQ } from "@/components/home/FAQ";
import { FinalCTA } from "@/components/home/FinalCTA";
import { buildMetadata } from "@/lib/seo";
import { SITE_CONFIG } from "@/lib/constants";

export const metadata = buildMetadata({
  title: `${SITE_CONFIG.name} | ${SITE_CONFIG.tagline}`,
  description: SITE_CONFIG.description,
  path: "/",
});

export default function HomePage() {
  return (
    <>
      <Hero />
      <ServicesPreview />
      <WorkPreview />
      <WhyZevren />
      <Process />
      <FAQ />
      <FinalCTA />
    </>
  );
}
