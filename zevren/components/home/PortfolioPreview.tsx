import Link from "next/link";
import { PORTFOLIO_ITEMS } from "@/lib/constants";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";

export function PortfolioPreview() {
  const items = PORTFOLIO_ITEMS.slice(0, 3);

  return (
    <section className="border-t border-white/5 bg-surface/30 py-24">
      <Container className="flex flex-col gap-12">
        <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
          <SectionHeading
            eyebrow="Portfolio"
            title="Recent opgeleverd"
            description="Een paar projecten waar we trots op zijn — en waarvan we de resultaten kunnen onderbouwen."
          />
          <Button href="/portfolio" variant="secondary" className="shrink-0">
            Alle projecten
          </Button>
        </div>
        <div className="grid gap-6 lg:grid-cols-3">
          {items.map((item) => (
            <Link
              key={item.slug}
              href="/portfolio"
              className="group flex flex-col overflow-hidden rounded-2xl border border-white/10 bg-navy transition-colors hover:border-primary/40"
            >
              <div className="flex h-44 items-center justify-center bg-gradient-to-br from-primary/25 via-surface to-navy">
                <span className="font-heading text-2xl font-semibold text-white/80">
                  {item.name}
                </span>
              </div>
              <div className="flex flex-1 flex-col gap-3 p-6">
                <span className="text-xs font-semibold uppercase tracking-wider text-accent">
                  {item.category} · {item.year}
                </span>
                <p className="text-sm leading-relaxed text-muted">
                  {item.summary}
                </p>
                <p className="mt-auto text-sm font-medium text-white">
                  {item.result}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </Container>
    </section>
  );
}
