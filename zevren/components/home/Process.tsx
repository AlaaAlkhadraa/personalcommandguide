import { PROCESS_STEPS } from "@/lib/constants";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Container } from "@/components/ui/Container";

export function Process() {
  return (
    <section className="border-t border-white/5 bg-surface/30 py-24">
      <Container className="flex flex-col gap-12">
        <SectionHeading
          eyebrow="Process"
          title="How a project runs with us"
          description="Five steps, from first conversation to launch. Every step has a clear outcome, so you always know where your project stands."
        />
        <ol className="grid gap-6 lg:grid-cols-5">
          {PROCESS_STEPS.map((step) => (
            <li
              key={step.step}
              className="flex flex-col gap-3 border-t border-primary/40 pt-6"
            >
              <span className="font-heading text-3xl font-semibold text-primary-light/70">
                {step.step}
              </span>
              <h3 className="text-base font-semibold text-white">
                {step.title}
              </h3>
              <p className="text-sm leading-relaxed text-muted">
                {step.description}
              </p>
            </li>
          ))}
        </ol>
      </Container>
    </section>
  );
}
