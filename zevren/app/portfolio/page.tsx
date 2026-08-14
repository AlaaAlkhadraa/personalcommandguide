import { PageHero } from "@/components/ui/PageHero";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { PORTFOLIO_ITEMS } from "@/lib/constants";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Portfolio",
  description:
    "Een overzicht van websites en webshops die ZEVREN heeft gebouwd voor ondernemers in Nederland, met de resultaten die ze hebben opgeleverd.",
  path: "/portfolio",
});

export default function PortfolioPage() {
  return (
    <>
      <PageHero
        eyebrow="Portfolio"
        title="Projecten waar we de cijfers bij durven te noemen"
        description="Geen portfolio vol mooie plaatjes zonder context. Bij elk project laten we zien wat het daadwerkelijk heeft opgeleverd."
      />
      <section className="py-20">
        <Container>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {PORTFOLIO_ITEMS.map((item) => (
              <article
                key={item.slug}
                className="flex flex-col overflow-hidden rounded-2xl border border-white/10 bg-surface/50 transition-colors hover:border-primary/40"
              >
                <div className="flex h-40 items-center justify-center bg-gradient-to-br from-primary/25 via-surface to-navy">
                  <span className="font-heading text-xl font-semibold text-white/80">
                    {item.name}
                  </span>
                </div>
                <div className="flex flex-1 flex-col gap-3 p-6">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold uppercase tracking-wider text-accent">
                      {item.category}
                    </span>
                    <span className="text-xs text-muted">{item.year}</span>
                  </div>
                  <p className="text-sm leading-relaxed text-muted">
                    {item.summary}
                  </p>
                  <p className="text-sm font-medium text-white">
                    {item.result}
                  </p>
                  <ul className="mt-auto flex flex-wrap gap-2 pt-2">
                    {item.tags.map((tag) => (
                      <li
                        key={tag}
                        className="rounded-full border border-white/10 px-3 py-1 text-xs text-muted"
                      >
                        {tag}
                      </li>
                    ))}
                  </ul>
                </div>
              </article>
            ))}
          </div>
        </Container>
      </section>
      <section className="border-t border-white/5 bg-surface/30 py-20">
        <Container className="flex flex-col items-center gap-6 text-center">
          <h2 className="max-w-xl text-3xl font-semibold text-white">
            Jouw project kan de volgende zijn
          </h2>
          <Button href="/contact">Vraag een offerte aan</Button>
        </Container>
      </section>
    </>
  );
}
