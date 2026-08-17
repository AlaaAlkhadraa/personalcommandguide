import Link from "next/link";

import { Icon } from "@/components/ui/Icon";
import { SERVICES } from "@/lib/constants";
import type { Dictionary } from "@/lib/i18n/dictionary-type";

/**
 * The six services as a strip across the foot of the hero.
 *
 * On a phone this becomes a horizontal scroller rather than a six-row stack,
 * so the hero does not turn into a wall of cards before the visitor has read
 * the headline.
 */
export function HeroServiceStrip({ dict }: { dict: Dictionary["services"] }) {
  return (
    <div className="relative border-t border-white/10 bg-navy/60 backdrop-blur-sm">
      <div className="container-page">
        <ul className="-mx-6 flex snap-x snap-mandatory gap-3 overflow-x-auto px-6 py-5 sm:mx-0 sm:grid sm:grid-cols-2 sm:overflow-visible sm:px-0 md:grid-cols-3 lg:grid-cols-6">
          {SERVICES.map((service) => {
            const copy = dict.list[service.slug];
            return (
              <li key={service.slug} className="min-w-[15rem] shrink-0 snap-start sm:min-w-0">
                <Link
                  href={`/services#${service.slug}`}
                  className="group flex h-full items-start gap-3 rounded-lg border border-white/10 bg-white/[0.02] p-4 transition-colors duration-200 hover:border-accent/50 hover:bg-white/[0.05] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                >
                  <span className="mt-0.5 text-accent">
                    <Icon name={service.icon} className="h-5 w-5" />
                  </span>
                  <span className="flex flex-col gap-1">
                    {/* Fixed height so a title that wraps to two lines does not
                        push its tagline out of line with its neighbours. */}
                    <span className="flex min-h-[1.85rem] items-start text-[11px] font-semibold uppercase leading-tight tracking-[0.12em] text-white">
                      {copy.title}
                    </span>
                    <span className="text-[11px] leading-snug text-muted">
                      {copy.tagline}
                    </span>
                  </span>
                  <svg
                    viewBox="0 0 16 16"
                    aria-hidden="true"
                    className="ms-auto mt-1 h-3 w-3 shrink-0 text-muted/60 transition-[transform,color] duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-accent"
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
      </div>
    </div>
  );
}
