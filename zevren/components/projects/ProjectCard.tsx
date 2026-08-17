import Image from "next/image";
import Link from "next/link";

import { WORK_PREVIEWS } from "@/components/projects/registry";
import { IMAGES } from "@/lib/assets";
import type { WorkItem } from "@/types";
import type { Dictionary } from "@/lib/i18n/dictionary-type";

/**
 * One project card.
 *
 * The photograph sets the scene and the interface mockup sits on top of it,
 * so a card shows both what the business is and what was actually built. The
 * concept badge is on every card without exception: none of these are client
 * work, and the card should say so before anyone clicks.
 */
export function ProjectCard({
  item,
  dict,
  priority = false,
}: {
  item: WorkItem;
  dict: Dictionary["work"];
  priority?: boolean;
}) {
  const Preview = WORK_PREVIEWS[item.slug];
  const copy = dict.items[item.slug];
  const art = IMAGES[item.image];

  return (
    <Link
      href={`/projects/${item.slug}`}
      className="group flex flex-col overflow-hidden rounded-2xl border border-white/10 bg-surface/50 transition-colors duration-300 hover:border-accent/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
    >
      <div className="relative h-60 overflow-hidden">
        <Image
          src={art.src}
          alt=""
          aria-hidden="true"
          fill
          priority={priority}
          loading={priority ? undefined : "lazy"}
          sizes="(max-width: 640px) 100vw, 50vw"
          placeholder="blur"
          blurDataURL={art.blurDataURL}
          className="object-cover opacity-45 transition-transform duration-700 group-hover:scale-105"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-t from-surface via-navy/50 to-transparent"
        />
        {Preview && (
          <div className="absolute inset-x-6 bottom-0 top-8 overflow-hidden rounded-t-xl border border-white/10 shadow-card transition-transform duration-500 group-hover:-translate-y-1">
            <Preview className="h-full w-full" />
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-3 p-6">
        <div className="flex items-center justify-between gap-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-accent">
            {copy.category}
          </span>
          <span className="rounded-full border border-white/10 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-muted">
            {dict.websiteConcept}
          </span>
        </div>
        <h2 className="font-heading text-lg font-semibold text-white">{item.name}</h2>
        <p className="text-sm leading-relaxed text-muted">{copy.description}</p>
        <span className="mt-auto flex w-fit items-center gap-1.5 rounded-full border border-white/15 px-4 py-2 text-xs font-semibold text-white transition-colors group-hover:border-accent/60 group-hover:text-accent">
          {dict.viewConcept}
          <span
            aria-hidden="true"
            className="transition-transform group-hover:translate-x-1"
          >
            &rarr;
          </span>
        </span>
      </div>
    </Link>
  );
}
