import Link from "next/link";
import { PORTFOLIO_ITEMS } from "@/lib/constants";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { ProjectMockup } from "@/components/portfolio/ProjectMockup";

export function PortfolioPreview() {
  const items = PORTFOLIO_ITEMS.slice(0, 3);

  return (
    <section className="border-t border-white/5 bg-surface/30 py-24">
      <Container className="flex flex-col gap-12">
        <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
          <SectionHeading
            eyebrow="Portfolio"
            title="Recently delivered"
            description="A few projects we're proud of — and whose results we can back up."
          />
          <Button href="/portfolio" variant="secondary" className="shrink-0">
            All projects
          </Button>
        </div>
        <div className="grid gap-6 lg:grid-cols-3">
          {items.map((item, index) => (
            <Link
              key={item.slug}
              href={`/portfolio/${item.slug}`}
              className="group flex flex-col overflow-hidden rounded-2xl border border-white/10 bg-navy transition-colors hover:border-primary/40"
            >
              <ProjectMockup variant={index} className="h-44" />
              <div className="flex flex-1 flex-col gap-3 p-6">
                <span className="text-xs font-semibold uppercase tracking-wider text-accent">
                  {item.category} · {item.year}
                </span>
                <h3 className="text-lg font-semibold text-white">
                  {item.name}
                </h3>
                <p className="text-sm leading-relaxed text-muted">
                  {item.summary}
                </p>
                <p className="text-sm font-medium text-white">
                  {item.result}
                </p>
                <span className="mt-auto flex items-center gap-1 pt-2 text-sm font-medium text-accent transition-transform group-hover:translate-x-1">
                  View project
                  <span aria-hidden="true">&rarr;</span>
                </span>
              </div>
            </Link>
          ))}
        </div>
      </Container>
    </section>
  );
}
