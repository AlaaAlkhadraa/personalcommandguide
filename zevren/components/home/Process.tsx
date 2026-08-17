import { SectionHeading } from "@/components/ui/SectionHeading";
import { Container } from "@/components/ui/Container";
import type { Dictionary } from "@/lib/i18n/dictionary-type";

interface ProcessProps {
  dict: Dictionary["process"];
  homeDict: Dictionary["home"]["process"];
}

export function Process({ dict, homeDict }: ProcessProps) {
  return (
    <section className="border-t border-white/5 bg-surface/30 py-24">
      <Container className="flex flex-col gap-12">
        <SectionHeading
          eyebrow={homeDict.eyebrow}
          title={homeDict.title}
          description={homeDict.subtitle}
        />
        <ol className="grid gap-6 lg:grid-cols-5">
          {dict.steps.map((step, index) => (
            <li
              key={step.title}
              className="flex flex-col gap-3 border-t border-primary/40 pt-6"
            >
              <span className="font-heading text-3xl font-semibold text-primary-light/70">
                {String(index + 1).padStart(2, "0")}
              </span>
              <h3 className="text-base font-semibold text-white">{step.title}</h3>
              <p className="text-sm leading-relaxed text-muted">{step.description}</p>
            </li>
          ))}
        </ol>
      </Container>
    </section>
  );
}
