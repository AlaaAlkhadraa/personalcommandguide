import type { Metadata } from "next";
import { PageHero } from "@/components/ui/PageHero";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { ProjectCard } from "@/components/projects/ProjectCard";
import { RevealGroup } from "@/components/ui/RevealGroup";
import { WORK_ITEMS } from "@/lib/constants";
import { buildMetadata } from "@/lib/seo";
import { getLocale } from "@/lib/i18n/get-locale";
import { getDictionary } from "@/lib/i18n/get-dictionary";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const meta = getDictionary(locale).meta.projects;
  return buildMetadata({
    title: meta.title,
    description: meta.description,
    path: "/projects",
    locale,
  });
}

export default async function ProjectsPage() {
  const locale = await getLocale();
  const dict = getDictionary(locale);
  const w = dict.work;

  return (
    <>
      <PageHero eyebrow={w.eyebrow} title={w.title} description={w.subtitle} />
      <RevealGroup>
      <section className="py-20">
        <Container data-reveal-stagger className="grid gap-8 sm:grid-cols-2">
          {WORK_ITEMS.map((item, index) => (
            <div key={item.slug} data-reveal-item data-tilt>
              <ProjectCard
                item={item}
                dict={w}
                priority={index < 2}
                headingLevel="h2"
              />
            </div>
          ))}
        </Container>
      </section>
      <section className="border-t border-white/5 bg-surface/30 py-20">
        <Container data-reveal className="flex flex-col items-center gap-6 text-center">
          <h2 className="max-w-xl text-3xl font-semibold text-white">{w.ctaTitle}</h2>
          <Button href="/contact">{w.startProject}</Button>
        </Container>
      </section>
      </RevealGroup>
    </>
  );
}
