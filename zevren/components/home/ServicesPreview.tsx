import Link from "next/link";
import { SERVICES } from "@/lib/constants";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Card } from "@/components/ui/Card";
import { Icon } from "@/components/ui/Icon";
import { Container } from "@/components/ui/Container";
import type { Dictionary } from "@/lib/i18n/dictionary-type";

interface ServicesPreviewProps {
  dict: Dictionary["services"];
  homeDict: Dictionary["home"]["services"];
}

export function ServicesPreview({ dict, homeDict }: ServicesPreviewProps) {
  return (
    <section className="py-24">
      <Container className="flex flex-col gap-12">
        <SectionHeading
          eyebrow={homeDict.eyebrow}
          title={homeDict.title}
          description={homeDict.subtitle}
        />
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {SERVICES.map((service) => {
            const copy = dict.list[service.slug as keyof typeof dict.list];
            return (
              <Card key={service.slug} className="group flex flex-col gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/15 text-accent">
                  <Icon name={service.icon} />
                </div>
                <h3 className="text-xl font-semibold text-white">{copy.title}</h3>
                <p className="text-sm leading-relaxed text-muted">{copy.summary}</p>
                <Link
                  href={`/services#${service.slug}`}
                  className="mt-auto flex items-center gap-1 text-sm font-medium text-accent transition-transform group-hover:translate-x-1"
                >
                  {homeDict.learnMore}
                  <span aria-hidden="true">&rarr;</span>
                </Link>
              </Card>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
