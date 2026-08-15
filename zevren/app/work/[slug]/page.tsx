import { notFound } from "next/navigation";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { WORK_DEMOS } from "@/components/work/registry";
import { WORK_ITEMS } from "@/lib/constants";
import { buildMetadata } from "@/lib/seo";
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
    title: `${project.name} (website concept)`,
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

  const Demo = WORK_DEMOS[project.slug];

  return (
    <>
      <section className="border-b border-white/5 bg-grid-glow py-20 sm:py-24">
        <Container className="flex flex-col gap-6">
          <Link
            href="/work"
            className="flex w-fit items-center gap-1.5 text-sm font-medium text-muted transition-colors hover:text-white"
          >
            <span aria-hidden="true">&larr;</span>
            All concepts
          </Link>
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-sm font-semibold uppercase tracking-[0.2em] text-accent">
              Website concept
            </span>
            <span className="rounded-full border border-white/15 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-muted">
              {project.category}
            </span>
          </div>
          <h1 className="max-w-3xl text-4xl font-semibold leading-tight text-white sm:text-5xl">
            {project.name}
          </h1>
          <p className="max-w-2xl text-lg leading-relaxed text-muted">
            {project.description}
          </p>
        </Container>
      </section>

      <section className="py-16">
        <Container>
          {Demo && <Demo />}
        </Container>
      </section>

      <section className="pb-20">
        <Container className="grid gap-12 lg:grid-cols-2 lg:gap-16">
          <div className="flex flex-col gap-3">
            <h2 className="text-xl font-semibold text-white">What we explored</h2>
            <p className="leading-relaxed text-muted">{project.whatWeExplored}</p>
          </div>
          <div className="flex flex-col gap-3">
            <h2 className="text-xl font-semibold text-white">Key features</h2>
            <ul className="grid gap-3">
              {project.keyFeatures.map((feature) => (
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
          </div>
        </Container>
      </section>

      <section className="border-t border-white/5 bg-surface/30 py-20">
        <Container className="flex flex-col items-center gap-6 text-center">
          <h2 className="max-w-xl text-3xl font-semibold text-white">
            Want something like this for your business?
          </h2>
          <p className="max-w-lg text-muted">
            Every project starts with a conversation about what you actually
            need, not a template we adapt.
          </p>
          <div className="flex flex-col gap-4 sm:flex-row">
            <Button href="/contact">Start a project</Button>
            <Button href="/work" variant="secondary">
              See more concepts
            </Button>
          </div>
          <p className="pt-6 text-xs text-muted">
            ZEVREN CONCEPT: a website concept created by ZEVREN to demonstrate
            how this type of digital experience could work.
          </p>
        </Container>
      </section>
    </>
  );
}
