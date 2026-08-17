import { WORK_ITEMS } from "@/lib/constants";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { ProjectCard } from "@/components/projects/ProjectCard";
import type { Dictionary } from "@/lib/i18n/dictionary-type";

interface ProjectsPreviewProps {
  dict: Dictionary["work"];
  homeDict: Dictionary["home"]["work"];
}

/**
 * Home page projects section. Shows a subset; the full set lives on
 * /projects, so the home page stays a summary rather than a second listing.
 */
export function ProjectsPreview({ dict, homeDict }: ProjectsPreviewProps) {
  const featured = WORK_ITEMS.slice(0, 6);

  return (
    <section className="border-t border-white/5 bg-surface/30 py-24">
      <Container className="flex flex-col gap-12">
        <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
          <SectionHeading
            eyebrow={homeDict.eyebrow}
            title={homeDict.title}
            description={homeDict.subtitle}
          />
          <Button href="/projects" variant="secondary" className="shrink-0">
            {homeDict.allConcepts}
          </Button>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((item) => (
            <ProjectCard key={item.slug} item={item} dict={dict} />
          ))}
        </div>
      </Container>
    </section>
  );
}
