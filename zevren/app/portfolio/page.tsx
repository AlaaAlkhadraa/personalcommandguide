import Link from "next/link";
import { PageHero } from "@/components/ui/PageHero";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { ProjectMockup } from "@/components/portfolio/ProjectMockup";
import { PORTFOLIO_ITEMS } from "@/lib/constants";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Portfolio",
  description:
    "An overview of websites and online stores ZEVREN has built for businesses in the Netherlands, with the results they delivered.",
  path: "/portfolio",
});

export default function PortfolioPage() {
  return (
    <>
      <PageHero
        eyebrow="Portfolio"
        title="Projects where we back up the numbers"
        description="ZEVREN builds custom websites and web applications for businesses across the Netherlands — from logistics and healthcare to hospitality and construction. No portfolio full of pretty pictures without context: for every project below, we show what it actually delivered."
      />
      <section className="py-20">
        <Container>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {PORTFOLIO_ITEMS.map((item, index) => (
              <Link
                key={item.slug}
                href={`/portfolio/${item.slug}`}
                className="group flex flex-col overflow-hidden rounded-2xl border border-white/10 bg-surface/50 transition-colors hover:border-primary/40"
              >
                <ProjectMockup variant={index} className="h-40" />
                <div className="flex flex-1 flex-col gap-3 p-6">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold uppercase tracking-wider text-accent">
                      {item.category}
                    </span>
                    <span className="text-xs text-muted">{item.year}</span>
                  </div>
                  <h2 className="text-lg font-semibold text-white">
                    {item.name}
                  </h2>
                  <p className="text-sm leading-relaxed text-muted">
                    {item.summary}
                  </p>
                  <p className="text-sm font-medium text-white">
                    {item.result}
                  </p>
                  <ul className="flex flex-col gap-1.5 pt-1">
                    {item.features.slice(0, 3).map((feature) => (
                      <li
                        key={feature}
                        className="flex items-start gap-2 text-xs text-white/70"
                      >
                        <svg
                          viewBox="0 0 20 20"
                          className="mt-0.5 h-3.5 w-3.5 shrink-0 text-accent"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth={2}
                          aria-hidden="true"
                        >
                          <path
                            d="m4 10 4 4 8-8"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <span className="mt-auto flex w-fit items-center gap-1.5 rounded-full border border-white/15 px-4 py-2 text-xs font-semibold text-white transition-colors group-hover:border-accent/60 group-hover:text-accent">
                    View project
                    <span
                      aria-hidden="true"
                      className="transition-transform group-hover:translate-x-1"
                    >
                      &rarr;
                    </span>
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </Container>
      </section>
      <section className="border-t border-white/5 bg-surface/30 py-20">
        <Container className="flex flex-col items-center gap-6 text-center">
          <h2 className="max-w-xl text-3xl font-semibold text-white">
            Your project could be next
          </h2>
          <Button href="/contact">Request a quote</Button>
        </Container>
      </section>
    </>
  );
}
