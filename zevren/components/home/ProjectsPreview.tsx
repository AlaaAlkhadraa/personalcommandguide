import { WORK_ITEMS } from "@/lib/constants";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Container } from "@/components/ui/Container";
import { ArrowButton } from "@/components/ui/ArrowButton";
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
    <section data-reveal
      className="border-t border-white/5 bg-surface/30 py-24">
      <Container className="flex flex-col gap-12">
        <SectionHeading
          eyebrow={homeDict.eyebrow}
          title={homeDict.title}
          description={homeDict.subtitle}
        />
        {/* Six across on a wide screen, as in the design; the compact tile
            drops the interface mockup, which is unreadable at that width. */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
          {featured.map((item) => (
            <ProjectCard key={item.slug} item={item} dict={dict} compact />
          ))}
        </div>

        <div className="flex justify-center">
          <ArrowButton href="/projects" variant="outline">
            {homeDict.allConcepts}
          </ArrowButton>
        </div>
      </Container>
    </section>
  );
}
