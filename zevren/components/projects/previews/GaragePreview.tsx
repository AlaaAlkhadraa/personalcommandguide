export function GaragePreview({ className = "" }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={`relative overflow-hidden bg-slate-900 transition-transform duration-500 group-hover:scale-[1.03] ${className}`}
    >
      <div className="flex items-center justify-between px-4 py-3">
        <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-white">
          Steenberg
        </span>
        <span className="rounded-md bg-orange-500 px-2.5 py-1 text-[9px] font-semibold uppercase tracking-wider text-slate-950">
          Book service
        </span>
      </div>
      <div className="px-4 pb-4">
        <div className="rounded-md border border-slate-700 bg-slate-800/60 px-3 py-2">
          <div className="h-2 w-1/3 rounded-full bg-orange-500/60" />
          <div className="mt-1.5 h-2 w-2/3 rounded-full bg-white/10" />
        </div>
        <div className="mt-3 grid grid-cols-3 gap-1.5">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className={`rounded-md py-2 text-center text-[9px] ${
                i === 1
                  ? "bg-orange-500 text-slate-950"
                  : "border border-slate-700 text-slate-500"
              }`}
            >
              {["APK", "Tyres", "Brakes"][i]}
            </div>
          ))}
        </div>
        <div className="mt-3 h-2 w-1/2 rounded-full bg-white/10" />
      </div>
    </div>
  );
}
