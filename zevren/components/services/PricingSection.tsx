import { SectionHeading } from "@/components/ui/SectionHeading";
import { Container } from "@/components/ui/Container";
import { PlanCards } from "@/components/pricing/PlanCards";
import { AddOnsRow } from "@/components/pricing/AddOnsRow";
import { SubscriptionCard } from "@/components/pricing/SubscriptionCard";
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
 * brought them in. White like the home band, for the same reason.
 */
export function PricingSection({ dict, pricingDict, offerDict }: PricingSectionProps) {
  return (
    <section className="border-y border-slate-200 bg-white py-14 sm:py-20">
      <Container className="flex flex-col gap-12">
        <div data-reveal>
          <SectionHeading
            light
            eyebrow={dict.pricingEyebrow}
            title={dict.pricingTitle}
            description={dict.pricingSubtitle}
          />
        </div>

        <PlanCards offerDict={offerDict} pricingDict={pricingDict} />

        <AddOnsRow dict={offerDict.addOns} />

        <SubscriptionCard dict={offerDict.subscription} />

        <p className="text-sm text-slate-500">{dict.pricingNote}</p>
      </Container>
    </section>
  );
}
