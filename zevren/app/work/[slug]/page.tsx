import { notFound } from "next/navigation";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { WORK_DEMOS } from "@/components/work/registry";
import { WORK_ITEMS } from "@/lib/constants";
import { buildMetadata } from "@/lib/seo";
import { getLocale } from "@/lib/i18n/get-locale";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import type { Metadata } from "next";

interface ProjectPageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return WORK_ITEMS.map((item) => ({ slug: item.slug }));
}

export async function generateMetadata({
  params,
}: ProjectPageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = WORK_ITEMS.find((item) => item.slug === slug);

  if (!project) {
    return buildMetadata({
      title: "Project not found",
      description: "This website concept could not be found.",
      path: `/work/${slug}`,
      noIndex: true,
    });
  }

  return buildMetadata({
    title: `${project.name} (${project.kind === "real" ? "project" : "website concept"})`,
    description: project.description,
    path: `/work/${project.slug}`,
  });
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { slug } = await params;
  const project = WORK_ITEMS.find((item) => item.slug === slug);

  if (!project) {
    notFound();
  }

  const locale = await getLocale();
  const { work: w } = getDictionary(locale);
  const copy = w.items[project.slug as keyof typeof w.items];

  const Demo = WORK_DEMOS[project.slug];
  const isReal = project.kind === "real";

  return (
    <>
      <section className="border-b border-white/5 bg-grid-glow py-20 sm:py-24">
        <Container className="flex flex-col gap-6">
          <Link
            href="/work"
            className="flex w-fit items-center gap-1.5 text-sm font-medium text-muted transition-colors hover:text-white"
          >
            <span aria-hidden="true">&larr;</span>
            {isReal ? w.allProjects : w.allConcepts}
          </Link>
          <div className="flex flex-wrap items-center gap-3">
            <span
              className={`text-sm font-semibold uppercase tracking-[0.2em] ${
                isReal ? "text-emerald-400" : "text-accent"
              }`}
            >
              {isReal ? w.realProject : w.websiteConcept}
            </span>
            <span className="rounded-full border border-white/15 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-muted">
              {copy.category}
            </span>
          </div>
          <h1 className="max-w-3xl text-4xl font-semibold leading-tight text-white sm:text-5xl">
            {project.name}
          </h1>
          <p className="max-w-2xl text-lg leading-relaxed text-muted">{copy.description}</p>
        </Container>
      </section>

      <section className="py-16">
        <Container>{Demo && <Demo />}</Container>
      </section>

      <section className="pb-20">
        <Container className="grid gap-12 lg:grid-cols-2 lg:gap-16">
          <div className="flex flex-col gap-3">
            <h2 className="text-xl font-semibold text-white">{w.whatWeExplored}</h2>
            <p className="leading-relaxed text-muted">{copy.whatWeExplored}</p>
          </div>
          <div className="flex flex-col gap-3">
            <h2 className="text-xl font-semibold text-white">{w.keyFeatures}</h2>
            <ul className="grid gap-3 sm:grid-cols-2">
              {copy.keyFeatures.map((feature) => (
                <li
                  key={feature}
                  className="flex items-start gap-2 text-sm text-white/85"
                >
                  <svg
                    viewBox="0 0 20 20"
                    className="mt-0.5 h-4 w-4 shrink-0 text-accent"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                    aria-hidden="true"
                  >
                    <path d="m4 10 4 4 8-8" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  {feature}
                </li>
              ))}
            </ul>
          </div>
        </Container>
      </section>

      <section className="border-t border-white/5 bg-surface/30 py-20">
        <Container className="flex flex-col items-center gap-6 text-center">
          <h2 className="max-w-xl text-3xl font-semibold text-white">{w.detailCtaTitle}</h2>
          <p className="max-w-lg text-muted">{w.detailCtaBody}</p>
          <div className="flex flex-col gap-4 sm:flex-row">
            <Button href="/contact">{w.startProject}</Button>
            <Button href="/work" variant="secondary">
              {isReal ? w.seeMoreWork : w.seeMoreConcepts}
            </Button>
          </div>
          <p className="pt-6 text-xs text-muted">
            {isReal ? w.realDisclaimer : w.conceptDisclaimer}
          </p>
        </Container>
      </section>
    </>
  );
}
