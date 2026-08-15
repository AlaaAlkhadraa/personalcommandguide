import { WHY_ZEVREN } from "@/lib/constants";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Card } from "@/components/ui/Card";
import { Container } from "@/components/ui/Container";

export function WhyZevren() {
  return (
    <section className="py-24">
      <Container className="flex flex-col gap-12">
        <SectionHeading
          eyebrow="Why ZEVREN"
          title="Why work with ZEVREN?"
          align="center"
        />
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {WHY_ZEVREN.map((item) => (
            <Card key={item.title} className="flex flex-col gap-2">
              <h3 className="text-base font-semibold text-white">
                {item.title}
              </h3>
              <p className="text-sm leading-relaxed text-muted">
                {item.description}
              </p>
            </Card>
          ))}
        </div>
      </Container>
    </section>
  );
}
