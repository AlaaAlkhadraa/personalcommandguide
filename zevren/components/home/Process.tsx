import Image from "next/image";

import { Container } from "@/components/ui/Container";
import { IMAGES } from "@/lib/assets";
import type { Dictionary } from "@/lib/i18n/dictionary-type";

interface ProcessProps {
  dict: Dictionary["process"];
  homeDict: Dictionary["home"]["process"];
  /** The detail paragraph belongs on the process page, not the home summary. */
  detailed?: boolean;
}

const STEP_ICONS = [
  // Discovery: magnifier
  "M11 19a8 8 0 1 0 0-16 8 8 0 0 0 0 16ZM21 21l-4.35-4.35",
  // Design: pen
  "M4 20h4L20 8a2.8 2.8 0 0 0-4-4L4 16v4Z",
  // Development: angle brackets
  "M9.5 6 4 12l5.5 6M14.5 6 20 12l-5.5 6",
  // Launch: rocket
  "M5 15c-1 2-1 4-1 4s2 0 4-1M9 15l-3-3 2-4a11 11 0 0 1 8-5 11 11 0 0 1-5 8l-4 2 2 2Z",
] as const;

/**
 * The four steps, as a connected run on desktop and a vertical timeline on a
 * phone. The connecting line is drawn behind the markers rather than between
 * them, so it never breaks when a label wraps to a different number of lines.
 */
export function Process({ dict, homeDict, detailed = false }: ProcessProps) {
  const backdrop = IMAGES["atmos-path"];

  return (
    <section className="relative overflow-hidden border-b border-white/5 bg-surface/20 py-16 lg:py-20">
      <Image
        src={backdrop.src}
        alt=""
        aria-hidden="true"
        fill
        loading="lazy"
        sizes="100vw"
        placeholder="blur"
        blurDataURL={backdrop.blurDataURL}
        className="pointer-events-none select-none object-cover opacity-[0.14] [mask-image:linear-gradient(to_bottom,transparent,black_40%,transparent)]"
      />

      <Container className="relative grid gap-10 lg:grid-cols-[15rem_1fr] lg:gap-12">
        <div className="flex flex-col gap-3">
          <span className="text-[11px] font-semibold uppercase tracking-[0.24em] text-accent">
            {homeDict.eyebrow}
          </span>
          <h2 className="font-heading text-2xl font-bold uppercase leading-tight tracking-[-0.01em] text-white sm:text-3xl">
            {homeDict.title}
          </h2>
          <span aria-hidden="true" className="h-0.5 w-12 bg-accent" />
          <p className="text-sm leading-relaxed text-muted">{homeDict.subtitle}</p>
        </div>

        <div className="relative">
          {/* The rail: horizontal across the markers on desktop, vertical down
              their centres on a phone. */}
          <span
            aria-hidden="true"
            className="absolute start-[1.4rem] top-0 h-full w-px bg-gradient-to-b from-primary/50 via-primary/30 to-transparent sm:start-0 sm:top-[1.4rem] sm:h-px sm:w-full sm:bg-gradient-to-r sm:from-transparent sm:via-primary/40 sm:to-transparent"
          />

          <ol className="relative grid gap-8 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
            {dict.steps.map((step, index) => (
              <li key={step.title} className="flex gap-4 sm:flex-col sm:gap-4">
                <span className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-primary/50 bg-navy text-accent">
                  <svg
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                    className="h-5 w-5"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={1.6}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d={STEP_ICONS[index] ?? STEP_ICONS[0]} />
                  </svg>
                </span>

                <div className="flex flex-col gap-1.5">
                  <h3 className="flex items-baseline gap-2.5 text-[13px] font-semibold uppercase tracking-[0.1em] text-white">
                    <span className="font-mono text-[11px] tracking-[0.14em] text-primary-light/70">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    {step.title}
                  </h3>
                  <p className="text-[13px] leading-relaxed text-muted">
                    {step.description}
                  </p>
                  {detailed && (
                    <p className="text-[13px] leading-relaxed text-muted/80">
                      {step.detail}
                    </p>
                  )}
                </div>
              </li>
            ))}
          </ol>
        </div>
      </Container>
    </section>
  );
}
