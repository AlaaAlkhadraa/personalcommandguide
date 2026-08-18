import { notFound } from "next/navigation";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { WORK_DEMOS } from "@/components/projects/registry";
import { TajexDemo } from "@/components/demos/tajex/TajexDemo";
import { JsonLd } from "@/components/seo/JsonLd";
import { WORK_ITEMS, SITE_CONFIG } from "@/lib/constants";
import { buildMetadata } from "@/lib/seo";
import { getLocale } from "@/lib/i18n/get-locale";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { headers } from "next/headers";
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
      description: "This project could not be found.",
      path: `/projects/${slug}`,
      noIndex: true,
    });
  }

  return buildMetadata({
    title: project.name,
    description: project.description,
    path: `/projects/${project.slug}`,
  });
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { slug } = await params;
  const project = WORK_ITEMS.find((item) => item.slug === slug);

  if (!project) {
    notFound();
  }

  const locale = await getLocale();
  const dict = getDictionary(locale);
  const w = dict.work;
  const copy = w.items[project.slug as keyof typeof w.items];

  const Demo = WORK_DEMOS[project.slug];
  const demoDictKey: Record<string, keyof typeof dict.demos> = {
    "barbershop-website": "barbershop",
    "garage-website": "garage",
    "online-store": "store",
    ellezone: "ellezone",
    "accounting-firm": "accounting",
  };
  const demoDict = dict.demos[demoDictKey[project.slug]!];
  const nonce = (await headers()).get("x-nonce") ?? undefined;

  // Breadcrumbs so a search result shows Home > Projects > this project
  // rather than a bare URL.
  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: dict.nav.home, item: SITE_CONFIG.url },
      {
        "@type": "ListItem",
        position: 2,
        name: dict.nav.projects,
        item: `${SITE_CONFIG.url}/projects`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: project.name,
        item: `${SITE_CONFIG.url}/projects/${project.slug}`,
      },
    ],
  };

  return (
    <>
      <JsonLd data={breadcrumbJsonLd} nonce={nonce} />
      <section className="border-b border-white/5 bg-grid-glow py-20 sm:py-24">
        <Container className="flex flex-col gap-6">
          <Link
            href="/projects"
            className="flex w-fit items-center gap-1.5 text-sm font-medium text-muted transition-colors hover:text-white"
          >
            <span aria-hidden="true">&larr;</span>
            {w.allProjects}
          </Link>
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-sm font-semibold uppercase tracking-[0.2em] text-accent">
              {w.websiteConcept}
            </span>
            <span className="rounded-full border border-white/15 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-muted">
              {copy.category}
            </span>
          </div>
          <h1 className="max-w-3xl text-4xl font-semibold leading-tight text-white sm:text-5xl">
            {project.name}
          </h1>
          <p className="max-w-2xl text-lg leading-relaxed text-muted">{copy.description}</p>

          {/* The features as chips, so the header says what the concept covers
              before the demo below is scrolled into view. */}
          <ul className="flex flex-wrap gap-2 pt-2">
            {copy.keyFeatures.map((feature) => (
              <li
                key={feature}
                className="rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2 text-xs text-white/80"
              >
                {feature}
              </li>
            ))}
          </ul>
        </Container>
      </section>

      <section className="py-16">
        <Container>
          {project.slug === "tajex-logistics" ? (
            <TajexDemo />
          ) : (
            Demo && demoDict && <Demo dict={demoDict} common={dict.demoCommon} />
          )}
        </Container>
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
            <Button href="/projects" variant="secondary">
              {w.seeMoreConcepts}
            </Button>
          </div>
          <p className="pt-6 text-xs text-muted">
            {w.conceptDisclaimer}
          </p>
        </Container>
      </section>
    </>
  );
}
