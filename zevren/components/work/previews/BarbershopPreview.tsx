export function BarbershopPreview({ className = "" }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={`relative overflow-hidden bg-neutral-950 transition-transform duration-500 group-hover:scale-[1.03] ${className}`}
    >
      <div className="flex items-center justify-between px-4 py-3">
        <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-amber-400">
          Zeven Cuts
        </span>
        <span className="rounded-full bg-amber-400 px-2.5 py-1 text-[9px] font-semibold uppercase tracking-wider text-neutral-950">
          Book now
        </span>
      </div>
      <div className="px-4 pb-4">
        <div className="h-3 w-2/3 rounded-full bg-white/10" />
        <div className="mt-2 h-2 w-1/2 rounded-full bg-white/5" />
        <div className="mt-4 grid grid-cols-4 gap-1.5">
          {["09:00", "09:30", "10:00", "10:30"].map((t, i) => (
            <div
              key={t}
              className={`rounded-md py-1.5 text-center text-[9px] ${
                i === 1
                  ? "bg-amber-400 text-neutral-950"
                  : "border border-white/10 text-white/40"
              }`}
            >
              {t}
            </div>
          ))}
        </div>
        <div className="mt-3 flex gap-1.5">
          {[0, 1, 2].map((i) => (
            <div key={i} className="h-8 w-8 rounded-full bg-gradient-to-br from-amber-400/40 to-amber-900/40" />
          ))}
        </div>
      </div>
    </div>
  );
}
