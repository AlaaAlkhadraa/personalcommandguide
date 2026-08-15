import { SectionHeading } from "@/components/ui/SectionHeading";
import { Card } from "@/components/ui/Card";
import { Container } from "@/components/ui/Container";
import type { Dictionary } from "@/lib/i18n/dictionary-type";

interface WhyZevrenProps {
  dict: Dictionary["whyZevren"];
  homeDict: Dictionary["home"]["why"];
}

export function WhyZevren({ dict, homeDict }: WhyZevrenProps) {
  return (
    <section className="py-24">
      <Container className="flex flex-col gap-12">
        <SectionHeading eyebrow={homeDict.eyebrow} title={homeDict.title} align="center" />
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {dict.items.map((item) => (
            <Card key={item.title} className="flex flex-col gap-2">
              <h3 className="text-base font-semibold text-white">{item.title}</h3>
              <p className="text-sm leading-relaxed text-muted">{item.description}</p>
            </Card>
          ))}
        </div>
      </Container>
    </section>
  );
}
