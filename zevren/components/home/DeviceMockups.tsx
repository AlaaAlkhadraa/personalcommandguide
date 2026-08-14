export function DeviceMockups() {
  return (
    <div className="relative mx-auto w-full max-w-xl" aria-hidden="true">
      <div className="animate-float rounded-xl border border-white/10 bg-surface shadow-card">
        <div className="flex items-center gap-1.5 border-b border-white/10 px-4 py-3">
          <span className="h-2.5 w-2.5 rounded-full bg-white/20" />
          <span className="h-2.5 w-2.5 rounded-full bg-white/20" />
          <span className="h-2.5 w-2.5 rounded-full bg-white/20" />
          <div className="ml-3 h-5 flex-1 rounded-md bg-white/5" />
        </div>
        <div className="grid grid-cols-3 gap-3 p-5">
          <div className="col-span-3 h-28 rounded-lg bg-gradient-to-br from-primary/30 to-accent/10" />
          <div className="h-16 rounded-lg bg-white/5" />
          <div className="h-16 rounded-lg bg-white/5" />
          <div className="h-16 rounded-lg bg-white/5" />
          <div className="col-span-2 h-10 rounded-lg bg-white/5" />
          <div className="h-10 rounded-lg bg-primary/40" />
        </div>
      </div>

      <div
        className="absolute -bottom-8 -right-6 w-32 animate-float rounded-2xl border border-white/10 bg-surface shadow-card sm:-right-10 sm:w-40"
        style={{ animationDelay: "1.2s" }}
      >
        <div className="flex items-center justify-center border-b border-white/10 py-2">
          <span className="h-1 w-8 rounded-full bg-white/20" />
        </div>
        <div className="flex flex-col gap-2 p-3">
          <div className="h-14 rounded-md bg-gradient-to-br from-accent/30 to-primary/20" />
          <div className="h-3 w-3/4 rounded-full bg-white/10" />
          <div className="h-3 w-1/2 rounded-full bg-white/10" />
          <div className="mt-1 h-8 rounded-md bg-primary/40" />
        </div>
      </div>

      <div className="absolute inset-0 -z-10 bg-hero-glow blur-2xl" />
    </div>
  );
}
