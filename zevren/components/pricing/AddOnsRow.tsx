import { ADD_ONS } from "@/lib/offer";
import type { Dictionary } from "@/lib/i18n/dictionary-type";

/**
 * Extras priced per unit, under the packages.
 *
 * These are deliberately quieter than the package cards: they answer "what if
 * I need more than that" for someone who has already picked a package, and
 * pulling attention away from the packages themselves would cost more than
 * they are worth. Styled for the white pricing bands.
 */
export function AddOnsRow({ dict }: { dict: Dictionary["offer"]["addOns"] }) {
  return (
    <div className="flex flex-col gap-5">
      <div data-reveal className="flex flex-wrap items-baseline gap-x-4 gap-y-2">
        <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-primary">
          {dict.eyebrow}
        </span>
        <h3 className="text-lg font-semibold text-navy">{dict.title}</h3>
      </div>

      <dl data-reveal-stagger className="grid gap-4 sm:grid-cols-2">
        {ADD_ONS.map((addOn) => {
          const copy = dict.items[addOn.key];
          return (
            <div
              key={addOn.key}
              data-reveal-item
              className="flex items-start justify-between gap-5 rounded-2xl border border-slate-200 bg-slate-50 p-5"
            >
              <div className="flex flex-col gap-1.5">
                <dt className="text-sm font-semibold text-navy">{copy.name}</dt>
                <dd className="text-sm leading-relaxed text-slate-600">{copy.description}</dd>
              </div>
              <div className="flex shrink-0 flex-col items-end">
                <span className="font-heading text-xl font-bold leading-none text-navy">
                  &euro;{addOn.price}
                </span>
                <span className="mt-1 text-[11px] uppercase tracking-[0.12em] text-slate-500">
                  {copy.unit}
                </span>
              </div>
            </div>
          );
        })}
      </dl>
    </div>
  );
}
