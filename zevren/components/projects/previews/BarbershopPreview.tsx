/**
 * Ironside, the barbershop concept.
 *
 * The brand, the brass and the barbers are the ones in the booking demo, so
 * the card is a view of that page rather than a second, competing identity.
 * The device is the part the site exists for: pick a barber, pick a slot.
 */
const BRASS = "#C9A55F";
const BARBERS = ["Lucas", "Daan", "Milan"];
const SLOTS = ["09:30", "10:00", "10:30", "11:00"];

export function BarbershopPreview({ className = "" }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={`relative overflow-hidden bg-[#0B0B0C] transition-transform duration-500 group-hover:scale-[1.03] ${className}`}
    >
      <span
        className="pointer-events-none absolute -right-12 -top-14 h-36 w-36 rounded-full opacity-20 blur-2xl"
        style={{ backgroundColor: BRASS }}
      />

      <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
        <span className="flex items-center gap-1.5">
          <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" aria-hidden="true">
            <rect x="8" y="2" width="8" height="20" rx="4" fill="#141416" stroke={BRASS} strokeWidth="1.6" />
            <path d="M8 7l8-4M8 12l8-4M8 17l8-4M8 22l8-4" stroke={BRASS} strokeWidth="1.3" opacity="0.7" />
          </svg>
          <span className="text-[11px] font-extrabold uppercase tracking-[0.18em] text-[#F2EFE9]">
            Iron<span style={{ color: BRASS }}>side</span>
          </span>
        </span>
        <span
          className="rounded-full px-2.5 py-1 text-[8px] font-bold uppercase tracking-[0.14em] text-[#0B0B0C]"
          style={{ backgroundColor: BRASS }}
        >
          Book now
        </span>
      </div>

      <div className="relative px-4 py-3">
        <p className="text-[9px] uppercase tracking-[0.16em] text-[#6F6B65]">
          Cuts, fades &amp; beard work
        </p>
        <p className="mt-1.5 text-[15px] font-extrabold leading-tight tracking-[-0.02em] text-[#F2EFE9]">
          Pick your barber,
          <br />
          <span style={{ color: BRASS }}>pick your time</span>
        </p>

        <div className="mt-3 flex items-center gap-1.5">
          {BARBERS.map((barber, i) => (
            <span
              key={barber}
              className="rounded-full px-2 py-1 text-[8px] font-semibold uppercase tracking-[0.1em]"
              style={
                i === 0
                  ? { backgroundColor: BRASS, color: "#0B0B0C" }
                  : { border: "1px solid rgba(242,239,233,0.18)", color: "#8B857C" }
              }
            >
              {barber}
            </span>
          ))}
          <span className="ms-auto text-[8px] uppercase tracking-[0.12em] text-[#6F6B65]">
            Skin fade &middot; &euro;30
          </span>
        </div>

        <div className="mt-2.5 grid grid-cols-4 gap-1.5">
          {SLOTS.map((slot, i) => (
            <div
              key={slot}
              className={`rounded-md py-1.5 text-center text-[8px] font-semibold ${
                i === 1
                  ? "bg-[#F2EFE9] text-[#0B0B0C]"
                  : i === 2
                    ? "border border-white/10 text-white/20 line-through"
                    : "border border-white/15 text-[#8B857C]"
              }`}
            >
              {slot}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
