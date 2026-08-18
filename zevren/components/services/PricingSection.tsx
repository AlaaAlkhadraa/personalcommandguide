import { SectionHeading } from "@/components/ui/SectionHeading";
import { Card } from "@/components/ui/Card";
import { Container } from "@/components/ui/Container";
import type { Dictionary } from "@/lib/i18n/dictionary-type";

interface PricingSectionProps {
  dict: Dictionary["services"];
  pricingDict: Dictionary["pricing"];
}

const PLAN_KEYS = ["starter", "business", "store", "custom"] as const;

export function PricingSection({ dict, pricingDict }: PricingSectionProps) {
  return (
    <section className="border-t border-white/5 bg-surface/30 py-20">
      <Container className="flex flex-col gap-12">
        <div data-reveal>
          <SectionHeading
            eyebrow={dict.pricingEyebrow}
            title={dict.pricingTitle}
            description={dict.pricingSubtitle}
          />
        </div>
        <div data-reveal-stagger className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {PLAN_KEYS.map((key) => {
            const plan = pricingDict.plans[key];
            return (
              <Card key={key} data-reveal-item className="flex flex-col gap-3">
                <h3 className="text-base font-semibold text-white">{plan.name}</h3>
                <span className="text-2xl font-semibold text-white">
                  {dict.from} €{plan.price}
                </span>
                <p className="text-sm leading-relaxed text-muted">{plan.description}</p>
              </Card>
            );
          })}
        </div>
        <p className="text-sm text-muted">{dict.pricingNote}</p>
      </Container>
    </section>
  );
}
