import { SectionHeading } from "@/components/ui/SectionHeading";
import { Container } from "@/components/ui/Container";
import { PlanCards } from "@/components/pricing/PlanCards";
import type { Dictionary } from "@/lib/i18n/dictionary-type";

interface PricingSectionProps {
  dict: Dictionary["services"];
  pricingDict: Dictionary["pricing"];
  offerDict: Dictionary["offer"];
}

/**
 * The services page price grid.
 *
 * Renders the same cards as the home band, from the same data, so a visitor
 * comparing services never finds a different figure here than the one that
 * brought them in.
 */
export function PricingSection({ dict, pricingDict, offerDict }: PricingSectionProps) {
  return (
    <section className="border-t border-white/5 bg-surface/30 py-14 sm:py-20">
      <Container className="flex flex-col gap-12">
        <div data-reveal>
          <SectionHeading
            eyebrow={dict.pricingEyebrow}
            title={dict.pricingTitle}
            description={dict.pricingSubtitle}
          />
        </div>

        <PlanCards offerDict={offerDict} pricingDict={pricingDict} />

        <p className="text-sm text-muted">{dict.pricingNote}</p>
      </Container>
    </section>
  );
}
