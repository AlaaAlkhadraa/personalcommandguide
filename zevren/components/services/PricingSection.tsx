import { SectionHeading } from "@/components/ui/SectionHeading";
import { Card } from "@/components/ui/Card";
import { Container } from "@/components/ui/Container";
import { PRICING_PLANS } from "@/lib/constants";

export function PricingSection() {
  return (
    <section className="border-t border-white/5 bg-surface/30 py-20">
      <Container className="flex flex-col gap-12">
        <SectionHeading
          eyebrow="Pricing"
          title="Starting prices"
          description="Every project is priced based on what you actually need."
        />
        <div className="grid gap-6 sm:grid-cols-3">
          {PRICING_PLANS.map((plan) => (
            <Card key={plan.name} className="flex flex-col gap-3">
              <h3 className="text-base font-semibold text-white">
                {plan.name}
              </h3>
              <span className="text-2xl font-semibold text-white">
                {plan.price}
              </span>
              <p className="text-sm leading-relaxed text-muted">
                {plan.description}
              </p>
            </Card>
          ))}
        </div>
        <p className="text-sm text-muted">
          Final pricing depends on the scope and requirements of the project.
        </p>
      </Container>
    </section>
  );
}
