import Link from "next/link";
import { SERVICES } from "@/lib/constants";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Card } from "@/components/ui/Card";
import { Icon } from "@/components/ui/Icon";
import { Container } from "@/components/ui/Container";

export function ServicesPreview() {
  return (
    <section className="py-24">
      <Container className="flex flex-col gap-12">
        <SectionHeading
          eyebrow="Services"
          title="What we're good at"
          description="From a first website to an online store or custom application — we work with a small team so the lines stay short."
        />
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {SERVICES.map((service) => (
            <Card key={service.slug} className="group flex flex-col gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/15 text-accent">
                <Icon name={service.icon} />
              </div>
              <h3 className="text-xl font-semibold text-white">
                {service.title}
              </h3>
              <p className="text-sm leading-relaxed text-muted">
                {service.summary}
              </p>
              <Link
                href={`/services#${service.slug}`}
                className="mt-auto flex items-center gap-1 text-sm font-medium text-accent transition-transform group-hover:translate-x-1"
              >
                Learn more
                <span aria-hidden="true">&rarr;</span>
              </Link>
            </Card>
          ))}
        </div>
      </Container>
    </section>
  );
}
