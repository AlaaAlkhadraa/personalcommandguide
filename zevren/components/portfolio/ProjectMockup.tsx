const GRADIENTS = [
  "from-primary/35 via-surface to-navy",
  "from-accent/30 via-surface to-navy",
  "from-primary/25 via-accent/10 to-navy",
  "from-accent/25 via-primary/15 to-navy",
  "from-primary/30 via-navy to-surface",
  "from-accent/35 via-navy to-surface",
];

function LayoutBlocks({ variant }: { variant: number }) {
  switch (variant % 6) {
    case 0:
      // Logistics: map/tracking style
      return (
        <div className="flex flex-col gap-2">
          <div className="h-16 rounded-lg bg-white/10" />
          <div className="grid grid-cols-3 gap-2">
            <div className="h-8 rounded-md bg-primary/40" />
            <div className="h-8 rounded-md bg-white/10" />
            <div className="h-8 rounded-md bg-white/10" />
          </div>
        </div>
      );
    case 1:
      // Accounting: dashboard / document rows
      return (
        <div className="grid grid-cols-[28px_1fr] gap-2">
          <div className="flex flex-col gap-2">
            <div className="h-4 w-4 rounded bg-accent/50" />
            <div className="h-4 w-4 rounded bg-white/10" />
            <div className="h-4 w-4 rounded bg-white/10" />
          </div>
          <div className="flex flex-col gap-2">
            <div className="h-4 rounded bg-white/10" />
            <div className="h-4 w-4/5 rounded bg-white/10" />
            <div className="h-4 w-3/5 rounded bg-primary/40" />
          </div>
        </div>
      );
    case 2:
      // Automotive: booking calendar grid
      return (
        <div className="grid grid-cols-6 gap-1.5">
          {Array.from({ length: 12 }).map((_, i) => (
            <div
              key={i}
              className={`h-5 rounded ${
                i === 6 ? "bg-primary/50" : "bg-white/10"
              }`}
            />
          ))}
        </div>
      );
    case 3:
      // Restaurant: menu rows with price aligned right
      return (
        <div className="flex flex-col gap-2.5">
          <div className="h-14 rounded-lg bg-gradient-to-br from-accent/25 to-transparent" />
          {[0, 1, 2].map((i) => (
            <div key={i} className="flex items-center justify-between gap-2">
              <div className="h-3 w-3/5 rounded bg-white/10" />
              <div className="h-3 w-8 rounded bg-primary/40" />
            </div>
          ))}
        </div>
      );
    case 4:
      // Construction: before/after gallery grid
      return (
        <div className="grid grid-cols-2 gap-2">
          <div className="h-20 rounded-lg bg-white/10" />
          <div className="h-20 rounded-lg bg-gradient-to-br from-primary/35 to-transparent" />
        </div>
      );
    default:
      // Healthcare: profile + booking rows
      return (
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 shrink-0 rounded-full bg-accent/40" />
            <div className="flex-1 space-y-1.5">
              <div className="h-2.5 w-2/3 rounded bg-white/10" />
              <div className="h-2.5 w-1/3 rounded bg-white/10" />
            </div>
          </div>
          <div className="h-8 rounded-md bg-primary/40" />
        </div>
      );
  }
}

export function ProjectMockup({
  variant = 0,
  className = "",
}: {
  variant?: number;
  className?: string;
}) {
  const gradient = GRADIENTS[variant % GRADIENTS.length];

  return (
    <div
      aria-hidden="true"
      className={`relative overflow-hidden rounded-t-2xl border-b border-white/10 bg-gradient-to-br ${gradient} transition-transform duration-500 group-hover:scale-[1.03] ${className}`}
    >
      <div className="flex items-center gap-1.5 border-b border-white/10 bg-navy/50 px-4 py-2.5 backdrop-blur-sm">
        <span className="h-2 w-2 rounded-full bg-white/20" />
        <span className="h-2 w-2 rounded-full bg-white/20" />
        <span className="h-2 w-2 rounded-full bg-white/20" />
        <div className="ml-3 h-3 flex-1 max-w-[140px] rounded-full bg-white/10" />
      </div>
      <div className="p-5">
        <LayoutBlocks variant={variant} />
      </div>
    </div>
  );
}
