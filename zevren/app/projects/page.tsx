import { PageHero } from "@/components/ui/PageHero";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { ProjectCard } from "@/components/projects/ProjectCard";
import { WORK_ITEMS } from "@/lib/constants";
import { buildMetadata } from "@/lib/seo";
import { getLocale } from "@/lib/i18n/get-locale";
import { getDictionary } from "@/lib/i18n/get-dictionary";

export const metadata = buildMetadata({
  title: "Projects",
  description:
    "Concept projects by ZEVREN across logistics, retail, automotive, hospitality and professional services.",
  path: "/projects",
});

export default async function ProjectsPage() {
  const locale = await getLocale();
  const dict = getDictionary(locale);
  const w = dict.work;

  return (
    <>
      <PageHero eyebrow={w.eyebrow} title={w.title} description={w.subtitle} />
      <section className="py-20">
        <Container className="grid gap-8 sm:grid-cols-2">
          {WORK_ITEMS.map((item, index) => (
            <ProjectCard key={item.slug} item={item} dict={w} priority={index < 2} />
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
