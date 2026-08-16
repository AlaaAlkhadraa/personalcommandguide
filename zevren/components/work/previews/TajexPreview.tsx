export function TajexPreview({ className = "" }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={`relative overflow-hidden bg-[#131B3E] transition-transform duration-500 group-hover:scale-[1.03] ${className}`}
    >
      <span className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-[#E8264C] opacity-25 blur-2xl" />

      <div className="flex items-center justify-between px-4 py-3">
        <span className="text-[11px] font-extrabold tracking-[-0.02em] text-white">
          TAJE<span className="text-[#E8264C]">X</span>
        </span>
        <span className="rounded-full bg-[#E8264C] px-2.5 py-1 text-[8px] font-bold uppercase tracking-[0.14em] text-white">
          Tracking
        </span>
      </div>

      <div className="relative px-4 pb-4">
        <p className="text-[9px] uppercase tracking-[0.16em] text-white/40">Rotterdam &rarr; Latakia</p>
        <p className="mt-1.5 text-[15px] font-extrabold leading-tight tracking-[-0.02em] text-white">
          Jouw zending,
          <br />
          <span className="text-[#E8264C]">betrouwbaar</span> geregeld
        </p>

        <div className="mt-3 flex items-center">
          {["NLRTM", "BEANR", "MED", "SYLTK"].map((code, i) => (
            <div key={code} className="flex flex-1 items-center">
              <span
                className={`h-1.5 w-1.5 shrink-0 rounded-full ${
                  i === 0 || i === 3 ? "bg-[#E8264C]" : "border border-white/40"
                }`}
              />
              {i < 3 && <span className="h-px flex-1 bg-white/20" />}
            </div>
          ))}
        </div>

        <div className="mt-3 grid grid-cols-3 gap-1.5">
          {["Douane", "Zee", "RoRo"].map((label) => (
            <div
              key={label}
              className="rounded-md border border-white/12 py-1.5 text-center text-[8px] font-semibold text-white/70"
            >
              {label}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
