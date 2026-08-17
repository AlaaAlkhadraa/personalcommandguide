/**
 * Bergendal Accountants, the professional services concept.
 *
 * The concept pairs a marketing site with a client portal, so the card shows
 * the portal side: the deadline that matters and the documents behind it.
 * Ink, gold and paper are the demo's palette, and the file names are its own
 * document list.
 */
const INK = "#0E1A2B";
const GOLD = "#A67C2E";

const DOCUMENTS: [string, string][] = [
  ["Q2 VAT return.pdf", "12 Jul"],
  ["Bank statement - July.pdf", "1 Aug"],
];

export function AccountingPreview({ className = "" }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={`relative overflow-hidden bg-[#F0ECE5] transition-transform duration-500 group-hover:scale-[1.03] ${className}`}
    >
      <div className="flex items-center justify-between border-b border-[#DFDAD2] px-4 py-2.5">
        <span className="flex items-center gap-1.5">
          <svg viewBox="0 0 28 28" className="h-4 w-4" aria-hidden="true">
            <rect x="8" y="18" width="4" height="7" rx="1.2" fill={GOLD} />
            <rect x="14" y="13" width="4" height="12" rx="1.2" fill={GOLD} opacity="0.85" />
            <rect x="20" y="8" width="4" height="17" rx="1.2" fill={GOLD} opacity="0.7" />
          </svg>
          <span className="leading-tight">
            <span className="block text-[11px] font-extrabold tracking-[0.02em]" style={{ color: INK }}>
              Bergendal
            </span>
            <span
              className="block font-mono text-[7px] uppercase tracking-[0.26em]"
              style={{ color: GOLD }}
            >
              Accountants
            </span>
          </span>
        </span>
        <span
          className="rounded-sm border px-2.5 py-1 text-[8px] font-bold uppercase tracking-[0.14em]"
          style={{ borderColor: GOLD, color: GOLD }}
        >
          Client portal
        </span>
      </div>

      <div className="px-4 py-3">
        <p className="text-[9px] uppercase tracking-[0.16em] text-[#8A857D]">
          Bookkeeping, VAT &amp; annual accounts
        </p>
        <p
          className="mt-1.5 text-[15px] font-extrabold leading-tight tracking-[-0.02em]"
          style={{ color: INK }}
        >
          Your figures,
          <br />
          <span style={{ color: GOLD }}>always current</span>
        </p>

        <div
          className="mt-3 flex items-center gap-2 rounded-md border px-2 py-1.5"
          style={{ borderColor: "rgba(166,124,46,0.35)", backgroundColor: "#FBFAF8" }}
        >
          <span className="h-1.5 w-1.5 shrink-0 rounded-full" style={{ backgroundColor: GOLD }} />
          <span className="text-[9px] font-semibold" style={{ color: INK }}>
            Q3 VAT return
          </span>
          <span
            className="ms-auto text-[8px] font-semibold uppercase tracking-[0.1em]"
            style={{ color: GOLD }}
          >
            Due 31 Oct
          </span>
        </div>

        <div className="mt-1.5 space-y-1">
          {DOCUMENTS.map(([file, date]) => (
            <div key={file} className="flex items-center gap-2 px-0.5">
              <span className="h-2.5 w-2 shrink-0 rounded-[1px] border border-[#A5A099]" />
              <span className="truncate text-[8px] text-[#6D6A64]">{file}</span>
              <span className="ms-auto shrink-0 text-[8px] text-[#A5A099]">{date}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
