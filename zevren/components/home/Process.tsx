import Image from "next/image";

import { SectionHeading } from "@/components/ui/SectionHeading";
import { Container } from "@/components/ui/Container";
import { IMAGES } from "@/lib/assets";
import type { Dictionary } from "@/lib/i18n/dictionary-type";

interface ProcessProps {
  dict: Dictionary["process"];
  homeDict: Dictionary["home"]["process"];
  /** The detail paragraph belongs on the process page, not the home summary. */
  detailed?: boolean;
}

export function Process({ dict, homeDict, detailed = false }: ProcessProps) {
  const backdrop = IMAGES["atmos-path"];

  return (
    <section className="relative overflow-hidden border-t border-white/5 bg-surface/30 py-24">
      {/* Atmosphere, not decoration for its own sake: a single dim image keeps
          the section from reading as a plain grey band, and it is masked out
          before it can compete with the text. */}
      <Image
        src={backdrop.src}
        alt=""
        aria-hidden="true"
        fill
        sizes="100vw"
        placeholder="blur"
        blurDataURL={backdrop.blurDataURL}
        className="pointer-events-none select-none object-cover opacity-[0.18] [mask-image:linear-gradient(to_bottom,transparent,black_35%,black_65%,transparent)]"
      />

      <Container className="relative flex flex-col gap-12">
        <SectionHeading
          eyebrow={homeDict.eyebrow}
          title={homeDict.title}
          description={homeDict.subtitle}
        />
        <ol className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {dict.steps.map((step, index) => (
            <li
              key={step.title}
              className="group flex flex-col gap-3 border-t border-primary/40 pt-6 transition-colors hover:border-accent"
            >
              <span className="font-heading text-3xl font-semibold text-primary-light/70 transition-colors group-hover:text-accent">
                {String(index + 1).padStart(2, "0")}
              </span>
              <h3 className="text-base font-semibold uppercase tracking-[0.12em] text-white">
                {step.title}
              </h3>
              <p className="text-sm leading-relaxed text-muted">{step.description}</p>
              {detailed && (
                <p className="text-sm leading-relaxed text-muted/80">{step.detail}</p>
              )}
            </li>
          ))}
        </ol>
      </Container>
    </section>
  );
}
