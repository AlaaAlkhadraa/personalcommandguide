import Image from "next/image";
import Link from "next/link";

import { WORK_PREVIEWS } from "@/components/projects/registry";
import { IMAGES } from "@/lib/assets";
import type { WorkItem } from "@/types";
import type { Dictionary } from "@/lib/i18n/dictionary-type";

/**
 * One project card.
 *
 * Two shapes from one component. `compact` is the photo-led tile used in a
 * six-across row, where a UI mockup would be too small to read; the full
 * card adds the interface preview and the description, and is what the
 * projects page uses at two-across.
 *
 * The concept badge is on every card without exception: none of these are
 * client work, and the card should say so before anyone clicks.
 */
export function ProjectCard({
  item,
  dict,
  priority = false,
  compact = false,
  headingLevel = "h3",
}: {
  item: WorkItem;
  dict: Dictionary["work"];
  priority?: boolean;
  compact?: boolean;
  /**
   * The projects page puts these cards directly under its h1, so they are h2
   * there; on the home page a section h2 comes first, so they are h3. Passing
   * the level keeps the outline unbroken either way.
   */
  headingLevel?: "h2" | "h3";
}) {
  const Heading = headingLevel;
  const Preview = WORK_PREVIEWS[item.slug];
  const copy = dict.items[item.slug];
  const art = IMAGES[item.image];

  return (
    <Link
      href={`/projects/${item.slug}`}
      className="group flex h-full flex-col overflow-hidden rounded-xl border border-white/10 bg-surface/50 transition-[border-color,transform] duration-300 hover:-translate-y-1 hover:border-accent/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
    >
      <div className={`relative overflow-hidden ${compact ? "h-48 sm:h-40" : "h-60"}`}>
        <Image
          src={art.src}
          alt=""
          aria-hidden="true"
          fill
          priority={priority}
          loading={priority ? undefined : "lazy"}
          sizes={compact ? "(max-width: 640px) 90vw, 17vw" : "(max-width: 640px) 100vw, 50vw"}
          placeholder="blur"
          blurDataURL={art.blurDataURL}
          className={`object-cover transition-transform duration-700 group-hover:scale-105 ${
            compact ? "opacity-80" : "opacity-45"
          }`}
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-t from-surface via-navy/40 to-transparent"
        />

        {!compact && Preview && (
          <div className="absolute inset-x-6 bottom-0 top-8 overflow-hidden rounded-t-xl border border-white/10 shadow-card transition-transform duration-500 group-hover:-translate-y-1">
            <Preview className="h-full w-full" />
          </div>
        )}

        <span className="absolute start-3 top-3 rounded border border-white/20 bg-navy/80 px-2 py-1 text-[9px] font-semibold uppercase tracking-[0.14em] text-accent backdrop-blur-sm">
          {dict.websiteConcept}
        </span>
      </div>

      <div className={`flex flex-1 flex-col gap-2 ${compact ? "p-4" : "p-6 gap-3"}`}>
        {!compact && (
          <span className="text-xs font-semibold uppercase tracking-wider text-accent">
            {copy.category}
          </span>
        )}

        <Heading
          className={`font-heading font-semibold text-white ${
            compact ? "text-[13px] uppercase tracking-[0.06em]" : "text-lg"
          }`}
        >
          {item.name}
        </Heading>

        <p
          className={`leading-relaxed text-muted ${
            compact ? "text-[12px] sm:text-[11px]" : "text-sm"
          }`}
        >
          {compact ? copy.category : copy.description}
        </p>

        <span
          className={`flex items-center gap-1.5 text-accent ${
            compact
              ? "mt-auto justify-between text-[11px] font-medium sm:justify-end"
              : "mt-auto w-fit rounded-full border border-white/15 px-4 py-2 text-xs font-semibold text-white group-hover:border-accent/60 group-hover:text-accent"
          }`}
        >
          {compact ? <span className="sm:hidden">{dict.viewConcept}</span> : dict.viewConcept}
          <svg
            viewBox="0 0 16 16"
            aria-hidden="true"
            className="h-3 w-3 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            fill="none"
            stroke="currentColor"
            strokeWidth={1.8}
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M4 12 12 4M6 4h6v6" />
          </svg>
        </span>
      </div>
    </Link>
  );
}
