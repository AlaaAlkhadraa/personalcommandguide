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
            className={`h-1.5 flex-1 rounded-full transition-colors ${
              known && index < claimed ? "bg-primary" : "bg-white/10"
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
            <span className="font-medium text-accent">
              {open} {dict.counterOpen}
            </span>
            {!compact && (
              <>
                {" "}
                &middot; {dict.counterNote}
              </>
            )}
          </p>
        )
      ) : (
        <p className="text-sm text-muted">{dict.counterNote}</p>
      )}
    </div>
  );
}
