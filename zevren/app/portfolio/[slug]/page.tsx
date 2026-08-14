import { notFound } from "next/navigation";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { ProjectMockup } from "@/components/portfolio/ProjectMockup";
import { PORTFOLIO_ITEMS } from "@/lib/constants";
import { buildMetadata } from "@/lib/seo";
import type { Metadata } from "next";

interface ProjectPageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return PORTFOLIO_ITEMS.map((item) => ({ slug: item.slug }));
}

export async function generateMetadata({
  params,
}: ProjectPageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = PORTFOLIO_ITEMS.find((item) => item.slug === slug);

  if (!project) {
    return buildMetadata({
      title: "Project not found",
      description: "This portfolio project could not be found.",
      path: `/portfolio/${slug}`,
      noIndex: true,
    });
  }

  return buildMetadata({
    title: `${project.name} — case study`,
    description: project.summary,
    path: `/portfolio/${project.slug}`,
  });
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { slug } = await params;
  const project = PORTFOLIO_ITEMS.find((item) => item.slug === slug);

  if (!project) {
    notFound();
  }

  const index = PORTFOLIO_ITEMS.findIndex((item) => item.slug === slug);

  return (
    <>
      <section className="border-b border-white/5 bg-grid-glow py-20 sm:py-24">
        <Container className="flex flex-col gap-6">
          <Link
            href="/portfolio"
            className="flex w-fit items-center gap-1.5 text-sm font-medium text-muted transition-colors hover:text-white"
          >
            <span aria-hidden="true">&larr;</span>
            All projects
          </Link>
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-sm font-semibold uppercase tracking-[0.2em] text-accent">
              {project.category}
            </span>
            <span className="text-sm text-muted">{project.year}</span>
          </div>
          <h1 className="max-w-3xl text-4xl font-semibold leading-tight text-white sm:text-5xl">
            {project.name}
          </h1>
          <p className="max-w-2xl text-lg leading-relaxed text-muted">
            {project.summary}
          </p>
        </Container>
      </section>

      <section className="py-16">
        <Container>
          <ProjectMockup
            variant={index}
            className="h-64 rounded-2xl border border-white/10 sm:h-96"
          />
        </Container>
      </section>

      <section className="pb-20">
        <Container className="grid gap-12 lg:grid-cols-2 lg:gap-16">
          <div className="flex flex-col gap-3">
            <h2 className="text-xl font-semibold text-white">
              The challenge
            </h2>
            <p className="leading-relaxed text-muted">{project.challenge}</p>
          </div>
          <div className="flex flex-col gap-3">
            <h2 className="text-xl font-semibold text-white">
              Our approach
            </h2>
            <p className="leading-relaxed text-muted">{project.solution}</p>
          </div>
        </Container>
      </section>

      <section className="border-t border-white/5 bg-surface/30 py-20">
        <Container className="grid gap-12 lg:grid-cols-[1fr_1fr] lg:gap-16">
          <div className="flex flex-col gap-4">
            <h2 className="text-xl font-semibold text-white">
              Key features delivered
            </h2>
            <ul className="grid gap-3">
              {project.features.map((feature) => (
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
          <div className="flex flex-col justify-center gap-3 rounded-2xl border border-primary/30 bg-primary/10 p-8">
            <span className="text-sm font-semibold uppercase tracking-wider text-accent">
              Result
            </span>
            <p className="text-xl font-semibold leading-snug text-white">
              {project.result}
            </p>
          </div>
        </Container>
      </section>

      <section className="py-20">
        <Container className="flex flex-col items-center gap-6 text-center">
          <h2 className="max-w-xl text-3xl font-semibold text-white">
            Want something like this for your business?
          </h2>
          <p className="max-w-lg text-muted">
            Every project starts with a conversation about what you actually
            need — not a template we adapt.
          </p>
          <div className="flex flex-col gap-4 sm:flex-row">
            <Button href="/contact">Request a quote</Button>
            <Button href="/portfolio" variant="secondary">
              See more projects
            </Button>
          </div>
        </Container>
      </section>
    </>
  );
}
