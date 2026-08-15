import Link from "next/link";
import { PageHero } from "@/components/ui/PageHero";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { WORK_PREVIEWS } from "@/components/work/registry";
import { WORK_ITEMS } from "@/lib/constants";
import { buildMetadata } from "@/lib/seo";
import { getLocale } from "@/lib/i18n/get-locale";
import { getDictionary } from "@/lib/i18n/get-dictionary";

export const metadata = buildMetadata({
  title: "Work",
  description:
    "A selection of websites built by ZEVREN across different industries and layouts.",
  path: "/work",
});

function WorkCard({
  item,
  w,
}: {
  item: (typeof WORK_ITEMS)[number];
  w: ReturnType<typeof getDictionary>["work"];
}) {
  const Preview = WORK_PREVIEWS[item.slug];
  const copy = w.items[item.slug as keyof typeof w.items];

  return (
    <Link
      href={`/work/${item.slug}`}
      className="group flex flex-col overflow-hidden rounded-2xl border border-white/10 bg-surface/50 transition-colors hover:border-primary/40"
    >
      <div className="h-56 overflow-hidden">
        {Preview && <Preview className="h-full w-full" />}
      </div>
      <div className="flex flex-1 flex-col gap-3 p-6">
        <span className="text-xs font-semibold uppercase tracking-wider text-accent">
          {copy.category}
        </span>
        <h2 className="text-lg font-semibold text-white">{item.name}</h2>
        <p className="text-sm leading-relaxed text-muted">{copy.description}</p>
        <span className="mt-auto flex w-fit items-center gap-1.5 rounded-full border border-white/15 px-4 py-2 text-xs font-semibold text-white transition-colors group-hover:border-accent/60 group-hover:text-accent">
          {w.viewProject}
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
}

export default async function WorkPage() {
  const locale = await getLocale();
  const dict = getDictionary(locale);
  const w = dict.work;

  return (
    <>
      <PageHero eyebrow={w.eyebrow} title={w.title} description={w.subtitle} />
      <section className="py-20">
        <Container className="grid gap-8 sm:grid-cols-2">
          {WORK_ITEMS.map((item) => (
            <WorkCard key={item.slug} item={item} w={w} />
          ))}
        </Container>
      </section>
      <section className="border-t border-white/5 bg-surface/30 py-20">
        <Container className="flex flex-col items-center gap-6 text-center">
          <h2 className="max-w-xl text-3xl font-semibold text-white">{w.ctaTitle}</h2>
          <Button href="/contact">{w.startProject}</Button>
        </Container>
      </section>
    </>
  );
}
