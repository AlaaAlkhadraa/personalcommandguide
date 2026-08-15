import Link from "next/link";
import { WORK_ITEMS } from "@/lib/constants";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { WORK_PREVIEWS } from "@/components/work/registry";

export function WorkPreview() {
  return (
    <section className="border-t border-white/5 bg-surface/30 py-24">
      <Container className="flex flex-col gap-12">
        <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
          <SectionHeading
            eyebrow="Work"
            title="Website concepts"
            description="A selection of website concepts created by ZEVREN to explore different industries, layouts and digital experiences."
          />
          <Button href="/work" variant="secondary" className="shrink-0">
            All concepts
          </Button>
        </div>
        <div className="grid gap-6 sm:grid-cols-2">
          {WORK_ITEMS.map((item) => {
            const Preview = WORK_PREVIEWS[item.slug];
            return (
              <Link
                key={item.slug}
                href={`/work/${item.slug}`}
                className="group flex flex-col overflow-hidden rounded-2xl border border-white/10 bg-navy transition-colors hover:border-primary/40"
              >
                <div className="h-48 overflow-hidden">
                  {Preview && <Preview className="h-full w-full" />}
                </div>
                <div className="flex flex-1 flex-col gap-3 p-6">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-semibold uppercase tracking-wider text-accent">
                      {item.category}
                    </span>
                    <span className="rounded-full border border-white/10 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-muted">
                      Website concept
                    </span>
                  </div>
                  <h3 className="text-lg font-semibold text-white">{item.name}</h3>
                  <p className="text-sm leading-relaxed text-muted">
                    {item.description}
                  </p>
                  <span className="mt-auto flex items-center gap-1 pt-2 text-sm font-medium text-accent transition-transform group-hover:translate-x-1">
                    View concept
                    <span aria-hidden="true">&rarr;</span>
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
