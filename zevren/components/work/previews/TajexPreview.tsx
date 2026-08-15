export function TajexPreview({ className = "" }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={`relative overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-emerald-950 transition-transform duration-500 group-hover:scale-[1.03] ${className}`}
    >
      <div className="flex items-center justify-between px-4 py-3">
        <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-white">
          Tajex Logistics
        </span>
        <span className="rounded-md bg-emerald-500 px-2.5 py-1 text-[9px] font-semibold uppercase tracking-wider text-slate-950">
          Live
        </span>
      </div>
      <div className="relative flex flex-1 items-center justify-center px-4 pb-4">
        <svg
          viewBox="0 0 64 64"
          className="h-16 w-16 text-emerald-400/70"
          fill="none"
          stroke="currentColor"
          strokeWidth={1.6}
        >
          <path
            d="M8 40h20V20H8v20Zm20 0h6l8-10h10a4 4 0 0 1 4 4v6h-4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <circle cx="16" cy="46" r="4" strokeLinecap="round" />
          <circle cx="42" cy="46" r="4" strokeLinecap="round" />
        </svg>
      </div>
      <div className="px-4 pb-4 text-center text-[10px] font-medium tracking-wide text-emerald-300/80">
        tajexlogistics.nl
      </div>
    </div>
  );
}
