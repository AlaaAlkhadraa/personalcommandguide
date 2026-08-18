import type { FoundingStatus } from "@/lib/server/campaign";
import type { Dictionary } from "@/lib/i18n/dictionary-type";

/**
 * The spots counter.
 *
 * It renders whatever the database reports and nothing else. There is no
 * animation counting up from a fake starting point, no "only 2 left" when
 * ten are open, and when the count cannot be read the component says the
 * number is unavailable rather than showing a comfortable guess.
 */
export function FoundingCounter({
  status,
  dict,
  compact = false,
}: {
  status: FoundingStatus;
  dict: Dictionary["campaign"];
  compact?: boolean;
}) {
  const { claimed, total, open, soldOut, known } = status;

  return (
    <div className={compact ? "flex flex-col gap-3" : "flex flex-col gap-4"}>
      <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
        <span
          className={`font-heading font-semibold tabular-nums text-white ${
            compact ? "text-3xl" : "text-4xl sm:text-5xl"
          }`}
        >
          {known ? claimed : "?"}
          <span className="text-muted"> / {total}</span>
        </span>
        <span className="text-sm text-muted">{dict.counterClaimed}</span>
      </div>

      {/* Ten segments, one per spot. A bar would blur the fact that this is a
          count of ten real projects rather than a percentage. */}
      <div className="flex gap-1.5" aria-hidden="true">
        {Array.from({ length: total }).map((_, index) => (
          <span
            key={index}
            className={`h-2 flex-1 rounded-full transition-colors ${
              known && index < claimed
                ? "bg-gradient-to-r from-primary to-accent shadow-[0_0_10px_rgba(59,130,246,0.55)]"
                : "border border-white/10 bg-white/5"
            }`}
          />
        ))}
      </div>

      <p className="sr-only">
        {known
          ? `${claimed} of ${total} ${dict.counterClaimed}`
          : dict.counterNote}
      </p>

      {known ? (
        soldOut ? (
          <p className="text-sm text-muted">{dict.counterClosed}</p>
        ) : (
          <p className="text-sm text-muted">
            <span className="inline-flex items-center gap-2 rounded-full border border-accent/30 bg-accent/10 px-3 py-1 font-semibold text-accent">
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-60" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-accent" />
              </span>
              {open} {dict.counterOpen}
            </span>
            {!compact && (
              <span className="mt-2 block text-xs leading-relaxed">{dict.counterNote}</span>
            )}
          </p>
        )
      ) : (
        <p className="text-sm text-muted">{dict.counterNote}</p>
      )}
    </div>
  );
}
