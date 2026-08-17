export function PropertyPreview({ className = "" }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={`relative overflow-hidden bg-white transition-transform duration-500 group-hover:scale-[1.03] ${className}`}
    >
      <div className="flex items-center justify-between px-4 py-3">
        <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-800">
          Nestly
        </span>
        <span className="rounded-full bg-teal-600 px-2.5 py-1 text-[9px] font-semibold uppercase tracking-wider text-white">
          Dashboard
        </span>
      </div>
      <div className="px-4 pb-4">
        <div className="grid grid-cols-3 gap-1.5">
          {[70, 45, 90].map((h, i) => (
            <div key={i} className="rounded-md border border-slate-200 p-1.5">
              <div className="h-1.5 w-2/3 rounded-full bg-slate-200" />
              <div className="mt-2 h-6 overflow-hidden rounded bg-slate-100">
                <div className="h-full rounded bg-teal-500/60" style={{ width: `${h}%` }} />
              </div>
            </div>
          ))}
        </div>
        <div className="mt-3 grid grid-cols-2 gap-1.5">
          <div className="h-10 rounded-md bg-gradient-to-br from-teal-500/30 via-slate-700 to-slate-900" />
          <div className="h-10 rounded-md bg-gradient-to-br from-indigo-500/30 via-slate-700 to-slate-900" />
        </div>
      </div>
    </div>
  );
}
