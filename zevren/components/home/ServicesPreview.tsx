import Link from "next/link";

import { SERVICES } from "@/lib/constants";
import { Container } from "@/components/ui/Container";
import { Icon } from "@/components/ui/Icon";
import type { Dictionary } from "@/lib/i18n/dictionary-type";

interface ServicesPreviewProps {
  dict: Dictionary["services"];
  homeDict: Dictionary["home"]["services"];
}

/**
 * Six service cards in one row on desktop, stacked on a phone.
 *
 * The heading sits beside the grid rather than above it, which is what keeps
 * the row from looking like a generic three-across card wall.
 */
export function ServicesPreview({ dict, homeDict }: ServicesPreviewProps) {
  return (
    <section className="border-y border-white/5 bg-surface/20 py-16 lg:py-20">
      <Container className="grid gap-10 lg:grid-cols-[13rem_1fr] lg:gap-12">
        <div data-reveal className="flex flex-col gap-3">
          <span className="text-[11px] font-semibold uppercase tracking-[0.24em] text-accent">
            {homeDict.eyebrow}
          </span>
          <h2 data-reveal-words className="font-heading text-2xl font-bold uppercase leading-tight tracking-[-0.01em] text-white sm:text-3xl">
            {homeDict.title}
          </h2>
          <span aria-hidden="true" data-draw-line className="h-0.5 w-12 bg-accent" />
        </div>

        {/* Each card fades and rises on its own beat instead of the row
            arriving as one block, which is what makes six identical cards
            read as designed rather than templated. */}
        <ul data-reveal-stagger className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
          {SERVICES.map((service) => {
            const copy = dict.list[service.slug];
            return (
              <li key={service.slug} data-reveal-item>
                <Link
                  href={`/services#${service.slug}`}
                  className="group relative flex h-full items-start gap-4 rounded-xl border border-white/10 bg-navy/60 p-4 transition-[border-color,background-color,transform] duration-300 hover:border-accent/50 hover:bg-navy focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent sm:flex-col sm:gap-3 sm:p-5 sm:hover:-translate-y-1"
                >
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-primary/15 text-accent sm:h-auto sm:w-auto sm:bg-transparent">
                    <Icon name={service.icon} className="h-6 w-6 sm:h-7 sm:w-7" />
                  </span>
                  <span className="flex flex-col gap-1 sm:contents">
                    <span className="text-[12px] font-semibold uppercase leading-tight tracking-[0.1em] text-white sm:text-[11px]">
                      {copy.title}
                    </span>
                    <span className="text-[12px] leading-relaxed text-muted sm:text-[11px]">
                      {copy.summary}
                    </span>
                  </span>
                  <svg
                    viewBox="0 0 16 16"
                    aria-hidden="true"
                    className="ms-auto mt-1 h-3.5 w-3.5 shrink-0 text-muted/50 transition-[transform,color] duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-accent sm:ms-0 sm:mt-auto sm:h-3 sm:w-3 sm:self-end"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={1.8}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M4 12 12 4M6 4h6v6" />
                  </svg>
                </Link>
              </li>
            );
          })}
        </ul>
      </Container>
    </section>
  );
}
