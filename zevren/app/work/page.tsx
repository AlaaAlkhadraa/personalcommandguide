import Link from "next/link";
import { PageHero } from "@/components/ui/PageHero";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { WORK_PREVIEWS } from "@/components/work/registry";
import { WORK_ITEMS } from "@/lib/constants";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Work",
  description:
    "A selection of website concepts created by ZEVREN to explore different industries, layouts and digital experiences.",
  path: "/work",
});

export default function WorkPage() {
  return (
    <>
      <PageHero
        eyebrow="Work"
        title="Website concepts"
        description="A selection of website concepts created by ZEVREN to explore different industries, layouts and digital experiences. Each one is a working demo, not a static screenshot."
      />
      <section className="py-20">
        <Container>
          <div className="grid gap-8 sm:grid-cols-2">
            {WORK_ITEMS.map((item) => {
              const Preview = WORK_PREVIEWS[item.slug];
              return (
                <Link
                  key={item.slug}
                  href={`/work/${item.slug}`}
                  className="group flex flex-col overflow-hidden rounded-2xl border border-white/10 bg-surface/50 transition-colors hover:border-primary/40"
                >
                  <div className="h-56 overflow-hidden">
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
                    <h2 className="text-lg font-semibold text-white">{item.name}</h2>
                    <p className="text-sm leading-relaxed text-muted">
                      {item.description}
                    </p>
                    <span className="mt-auto flex w-fit items-center gap-1.5 rounded-full border border-white/15 px-4 py-2 text-xs font-semibold text-white transition-colors group-hover:border-accent/60 group-hover:text-accent">
                      View concept
                      <span
                        aria-hidden="true"
                        className="transition-transform group-hover:translate-x-1"
                      >
                        &rarr;
                      </span>
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        </Container>
      </section>
      <section className="border-t border-white/5 bg-surface/30 py-20">
        <Container className="flex flex-col items-center gap-6 text-center">
          <h2 className="max-w-xl text-3xl font-semibold text-white">
            Your project could be next
          </h2>
          <Button href="/contact">Start a project</Button>
        </Container>
      </section>
    </>
  );
}
