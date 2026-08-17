export function AccountingPreview({ className = "" }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={`relative overflow-hidden bg-white transition-transform duration-500 group-hover:scale-[1.03] ${className}`}
    >
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-1.5">
          <div className="h-5 w-5 rounded-md bg-[#0f1b2d]" />
          <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#0f1b2d]">
            Bergendal
          </span>
        </div>
        <span className="rounded-md border border-[#b8860b]/40 px-2.5 py-1 text-[9px] font-semibold uppercase tracking-wider text-[#0f1b2d]">
          Portal
        </span>
      </div>
      <div className="px-4 pb-4">
        <div className="h-3 w-2/3 rounded-full bg-stone-200" />
        <div className="mt-2 h-2 w-1/2 rounded-full bg-stone-100" />
        <div className="mt-4 grid grid-cols-3 gap-1.5">
          {[0, 1, 2].map((i) => (
            <div key={i} className="rounded-md border border-stone-200 py-3 text-center">
              <div className="mx-auto h-2 w-6 rounded-full bg-[#b8860b]/60" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
