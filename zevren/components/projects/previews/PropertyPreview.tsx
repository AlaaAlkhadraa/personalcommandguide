/**
 * Nestly, the property management concept.
 *
 * This one is an internal tool rather than a marketing site, so the card is
 * shaped like the dashboard itself: the dark nav rail down the side and the
 * light working area next to it. The counts and the guest names are the
 * dashboard's own data, so the card and the page agree.
 */
const TEAL = "#0F766E";

const STATS: [string, string][] = [
  ["Properties", "6"],
  ["Requests", "3"],
  ["August", "€5,700"],
];

const REQUESTS: { guest: string; nights: string; status: string; pending: boolean }[] = [
  { guest: "Sanne de Groot", nights: "12 – 20 Sep", status: "Pending", pending: true },
  { guest: "Marco Bianchi", nights: "5 – 12 Sep", status: "Confirmed", pending: false },
];

export function PropertyPreview({ className = "" }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={`relative flex overflow-hidden bg-[#F7F8FA] transition-transform duration-500 group-hover:scale-[1.03] ${className}`}
    >
      <div className="flex w-11 shrink-0 flex-col items-center gap-2 bg-[#0F1B21] py-3">
        <span
          className="flex h-6 w-6 items-center justify-center rounded-md text-[10px] font-extrabold text-white"
          style={{ backgroundColor: TEAL }}
        >
          N
        </span>
        {[true, false, false, false].map((active, i) => (
          <span
            key={i}
            className="h-1.5 w-5 rounded-full"
            style={{ backgroundColor: active ? TEAL : "rgba(255,255,255,0.14)" }}
          />
        ))}
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between border-b border-[#E2E6EC] px-3.5 py-2.5">
          <span className="text-[11px] font-extrabold tracking-[-0.02em] text-[#0F1B21]">
            Nest<span style={{ color: TEAL }}>ly</span>
          </span>
          <span
            className="rounded-full px-2.5 py-1 text-[8px] font-bold uppercase tracking-[0.12em] text-white"
            style={{ backgroundColor: TEAL }}
          >
            Dashboard
          </span>
        </div>

        <div className="px-3.5 py-3">
          <div className="grid grid-cols-3 gap-1.5">
            {STATS.map(([label, value]) => (
              <div key={label} className="rounded-md border border-[#E2E6EC] bg-white px-2 py-1.5">
                <p className="text-[8px] uppercase tracking-[0.12em] text-slate-400">{label}</p>
                <p className="mt-0.5 text-[12px] font-extrabold leading-none tracking-[-0.02em] text-[#0F1B21]">
                  {value}
                </p>
              </div>
            ))}
          </div>

          <p className="mt-3 text-[8px] uppercase tracking-[0.16em] text-slate-400">
            Booking requests
          </p>

          <div className="mt-1.5 space-y-1.5">
            {REQUESTS.map((row) => (
              <div
                key={row.guest}
                className="flex items-center gap-2 rounded-md border border-[#E2E6EC] bg-white px-2 py-1.5"
              >
                <span
                  className="h-1.5 w-1.5 shrink-0 rounded-full"
                  style={{ backgroundColor: row.pending ? "#D97706" : TEAL }}
                />
                <span className="truncate text-[9px] font-semibold text-[#0F1B21]">{row.guest}</span>
                <span className="shrink-0 text-[8px] text-slate-400">{row.nights}</span>
                <span
                  className="ms-auto shrink-0 text-[8px] font-semibold uppercase tracking-[0.1em]"
                  style={{ color: row.pending ? "#B45309" : TEAL }}
                >
                  {row.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
