import Link from "next/link";

import { FOUNDING_TOTAL } from "@/lib/campaign";
import { WORK_ITEMS } from "@/lib/constants";
import { LOCALES } from "@/lib/i18n/config";
import { getFoundingStatus } from "@/lib/server/campaign";
import type { Dictionary } from "@/lib/i18n/dictionary-type";

/**
 * The figure strip under the hero.
 *
 * Every number here is derived from something real: the concepts in the
 * repository, the locales the site ships, and the live founding-spot count
 * from the database. There is deliberately no "projects completed", "happy
 * clients" or "average rating" figure, because ZEVREN has no client work yet
 * and inventing those numbers is the one thing this site must not do. When
 * there are real ones, they belong here.
 */
export async function HeroFacts({ dict }: { dict: Dictionary["heroFacts"] }) {
  const status = await getFoundingStatus();

  const facts = [
    { value: String(WORK_ITEMS.length), label: dict.conceptsLabel },
    { value: String(LOCALES.length), label: dict.languagesLabel },
    {
      value: status.known ? String(status.open) : "?",
      label: dict.spotsLabel,
    },
    { value: dict.basedValue, label: dict.basedLabel },
  ];

  return (
    <div className="relative border-t border-white/10 bg-navy/80">
      <div className="container-page flex flex-col gap-6 py-5 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center gap-2.5">
          <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-accent" />
          <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-muted">
            {dict.eyebrow}
          </span>
        </div>

        <dl className="grid grid-cols-2 gap-x-8 gap-y-5 sm:grid-cols-4 lg:flex lg:items-center lg:gap-10">
          {facts.map((fact) => (
            <div
              key={fact.label}
              className="flex flex-col gap-0.5 lg:border-s lg:border-white/10 lg:ps-10 lg:first:border-s-0 lg:first:ps-0"
            >
              <dt className="order-2 text-[10px] uppercase tracking-[0.14em] text-muted">
                {fact.label}
              </dt>
              <dd className="order-1 font-heading text-2xl font-semibold tabular-nums text-white">
                {fact.value}
              </dd>
            </div>
          ))}
        </dl>

        <Link
          href="/contact"
          className="group flex items-center gap-3 text-xs font-semibold uppercase leading-tight tracking-[0.14em] text-accent transition-colors hover:text-white"
        >
          {dict.cta}
          <svg
            viewBox="0 0 16 16"
            aria-hidden="true"
            className="h-3.5 w-3.5 shrink-0 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            fill="none"
            stroke="currentColor"
            strokeWidth={1.8}
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M4 12 12 4M6 4h6v6" />
          </svg>
        </Link>
      </div>

      <span className="sr-only">{dict.note.replace("{total}", String(FOUNDING_TOTAL))}</span>
    </div>
  );
}
