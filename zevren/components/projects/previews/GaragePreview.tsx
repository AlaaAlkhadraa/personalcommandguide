/**
 * Steenberg Autoservice, the garage concept.
 *
 * Built like the Tajex card: the brand colour, the wordmark, a headline, and
 * the one device the site exists for. Here that is the number plate field,
 * because looking a car up is how the booking starts in the demo.
 *
 * The name, the orange and the prices are the demo's own, so the card opens
 * onto the page it promised.
 */
const ORANGE = "#F4681F";

const SERVICES: [string, string][] = [
  ["APK", "€45"],
  ["Tyres", "from €60"],
  ["Brakes", "from €85"],
];

export function GaragePreview({ className = "" }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={`relative overflow-hidden bg-[#0E1116] transition-transform duration-500 group-hover:scale-[1.03] ${className}`}
    >
      <span
        className="pointer-events-none absolute -left-12 -top-14 h-36 w-36 rounded-full opacity-25 blur-2xl"
        style={{ backgroundColor: ORANGE }}
      />

      <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
        <span className="text-[11px] font-extrabold uppercase tracking-[0.12em] text-[#E7EAEE]">
          Steenberg <span style={{ color: ORANGE }}>Autoservice</span>
        </span>
        <span
          className="rounded-sm px-2.5 py-1 text-[8px] font-bold uppercase tracking-[0.14em] text-[#0E1116]"
          style={{ backgroundColor: ORANGE }}
        >
          Book
        </span>
      </div>

      <div className="relative px-4 py-3">
        <p className="text-[9px] uppercase tracking-[0.16em] text-[#6C7784]">
          APK &amp; maintenance &middot; Maastricht
        </p>
        <p className="mt-1.5 text-[15px] font-extrabold leading-tight tracking-[-0.02em] text-[#E7EAEE]">
          Book your car in,
          <br />
          <span style={{ color: ORANGE }}>online</span>
        </p>

        <div className="mt-3 flex items-center gap-2">
          <span className="flex items-stretch overflow-hidden rounded-[3px] ring-1 ring-black/50">
            <span className="w-3 bg-[#003399]" />
            <span className="bg-[#F3C300] px-2 py-1 font-mono text-[11px] font-bold leading-none tracking-[0.08em] text-[#101010]">
              82-KRV-4
            </span>
          </span>
          <span className="text-[8px] uppercase tracking-[0.14em] text-[#6C7784]">
            Look up vehicle
          </span>
        </div>

        <div className="mt-3 grid grid-cols-3 gap-1.5">
          {SERVICES.map(([label, price]) => (
            <div key={label} className="rounded-md border border-white/12 px-2 py-1.5">
              <p className="text-[8px] font-semibold uppercase tracking-[0.1em] text-[#C2C8D0]">
                {label}
              </p>
              <p className="mt-0.5 text-[8px]" style={{ color: ORANGE }}>
                {price}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
