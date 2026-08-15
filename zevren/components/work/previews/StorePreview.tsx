export function StorePreview({ className = "" }: { className?: string }) {
  const swatches = [
    "from-amber-200 via-stone-200 to-stone-300",
    "from-stone-100 via-stone-200 to-stone-300",
    "from-orange-100 via-stone-200 to-stone-300",
    "from-emerald-100 via-stone-200 to-stone-300",
  ];

  return (
    <div
      aria-hidden="true"
      className={`relative overflow-hidden bg-stone-50 transition-transform duration-500 group-hover:scale-[1.03] ${className}`}
    >
      <div className="flex items-center justify-between px-4 py-3">
        <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-stone-800">
          Maren Home
        </span>
        <span className="rounded-full border border-stone-300 px-2.5 py-1 text-[9px] font-semibold uppercase tracking-wider text-orange-800">
          Cart
        </span>
      </div>
      <div className="grid grid-cols-4 gap-1.5 px-4 pb-4">
        {swatches.map((s, i) => (
          <div key={i} className={`h-10 rounded-md bg-gradient-to-br ${s}`} />
        ))}
      </div>
    </div>
  );
}
