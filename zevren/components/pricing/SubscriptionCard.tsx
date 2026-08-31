import Link from "next/link";

import type { Dictionary } from "@/lib/i18n/dictionary-type";

/**
 * The optional monthly plan, shown under the package cards.
 *
 * A one-off build and a recurring plan answer different questions, so this
 * sits apart from the four cards rather than becoming a fifth: nobody should
 * read 49.99 as an alternative to buying a website.
 *
 * Deliberately the one dark card inside the white pricing band: the care
 * plan is the anchor offer, and the navy block is what the eye lands on.
 */
export function SubscriptionCard({ dict }: { dict: Dictionary["offer"]["subscription"] }) {
  return (
    <div
      data-reveal
      className="rounded-2xl bg-gradient-to-b from-primary/40 via-slate-200 to-transparent p-px"
    >
      <div className="grid gap-6 rounded-[calc(1rem-1px)] bg-navy p-6 sm:p-8 lg:grid-cols-[1fr_1.1fr] lg:items-center lg:gap-12">
        <div className="flex flex-col gap-3">
          <span className="w-fit rounded-full border border-accent/30 bg-accent/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-accent">
            {dict.eyebrow}
          </span>
          <h3 className="font-heading text-xl font-bold leading-tight text-white sm:text-2xl">
            {dict.title}
          </h3>
          <p className="flex items-baseline gap-2">
            <span className="font-heading text-[2.5rem] font-bold leading-none tracking-tight text-white">
              &euro;{dict.price}
            </span>
            <span className="text-sm text-muted">{dict.period}</span>
          </p>
          <p className="text-sm leading-relaxed text-muted">{dict.description}</p>
        </div>

        <ul className="grid gap-3 sm:grid-cols-2">
          {dict.items.map((item) => (
            <li key={item} className="flex items-start gap-2.5 text-sm text-white/90">
              <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-accent/15 text-accent">
                <svg
                  aria-hidden="true"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-3 w-3"
                >
                  <path d="M5 13l4 4L19 7" />
                </svg>
              </span>
              {item}
            </li>
          ))}
        </ul>

        {/* The plan is a contract, so its terms sit on the card rather than
            only in the conditions page a buyer has to go looking for. */}
        <p className="text-xs leading-relaxed text-muted/80 lg:col-span-2">
          {dict.terms}{" "}
          <Link href="/terms-and-conditions" className="text-accent underline-offset-2 hover:underline">
            {dict.termsLink}
          </Link>
        </p>
      </div>
    </div>
  );
}
