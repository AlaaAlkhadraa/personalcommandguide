export function TajexPreview({ className = "" }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={`relative overflow-hidden bg-slate-950 transition-transform duration-500 group-hover:scale-[1.03] ${className}`}
    >
      <div className="flex items-center justify-between px-4 py-3">
        <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-white">
          Tajex <span className="text-emerald-400">Logistics</span>
        </span>
        <span className="rounded-md bg-emerald-500 px-2.5 py-1 text-[9px] font-semibold uppercase tracking-wider text-slate-950">
          Track
        </span>
      </div>
      <div className="px-4 pb-4">
        <div className="flex items-center gap-1.5">
          {["Rotterdam", "Antwerp", "Latakia"].map((stop, i) => (
            <div key={stop} className="flex shrink-0 items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
              {i < 2 && <span className="h-px w-6 bg-emerald-400/30" />}
            </div>
          ))}
        </div>
        <div className="mt-3 rounded-md border border-slate-800 bg-slate-900/60 px-3 py-2">
          <div className="h-2 w-2/3 rounded-full bg-white/10" />
          <div className="mt-1.5 h-2 w-1/3 rounded-full bg-emerald-400/30" />
        </div>
        <div className="mt-3 grid grid-cols-3 gap-1.5">
          {["Customs", "Transport", "RoRo"].map((s) => (
            <div key={s} className="rounded-md border border-slate-800 py-1.5 text-center text-[8px] text-slate-400">
              {s}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
