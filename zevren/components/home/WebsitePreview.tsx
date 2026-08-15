export function WebsitePreview() {
  return (
    <div className="relative mx-auto w-full max-w-xl" aria-hidden="true">
      <div className="animate-float overflow-hidden rounded-xl border border-white/10 bg-surface shadow-card">
        <div className="flex items-center gap-2 border-b border-white/10 px-4 py-3">
          <span className="h-2.5 w-2.5 rounded-full bg-white/20" />
          <span className="h-2.5 w-2.5 rounded-full bg-white/20" />
          <span className="h-2.5 w-2.5 rounded-full bg-white/20" />
          <div className="ml-3 h-5 w-40 rounded-md bg-white/5" />
        </div>

        <div className="flex items-center justify-between border-b border-white/10 px-5 py-3.5">
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-sm bg-accent" />
            <div className="h-2.5 w-16 rounded-full bg-white/25" />
          </div>
          <div className="hidden items-center gap-4 sm:flex">
            <div className="h-2 w-10 rounded-full bg-white/15" />
            <div className="h-2 w-10 rounded-full bg-white/15" />
            <div className="h-2 w-10 rounded-full bg-white/15" />
          </div>
          <div className="h-6 w-16 rounded-full bg-primary/70" />
        </div>

        <div className="flex flex-col gap-3 px-6 py-7">
          <div className="h-2 w-24 rounded-full bg-accent/60" />
          <div className="h-4 w-4/5 rounded-full bg-white/30" />
          <div className="h-4 w-3/5 rounded-full bg-white/30" />
          <div className="mt-1 h-2.5 w-2/3 rounded-full bg-white/10" />
          <div className="mt-2 flex gap-3">
            <div className="h-7 w-24 rounded-full bg-primary" />
            <div className="h-7 w-24 rounded-full border border-white/15" />
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3 px-6 pb-7">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="flex flex-col gap-2 rounded-lg border border-white/10 bg-white/5 p-3"
            >
              <div className="h-5 w-5 rounded bg-accent/50" />
              <div className="h-2 w-full rounded-full bg-white/20" />
              <div className="h-2 w-2/3 rounded-full bg-white/10" />
            </div>
          ))}
        </div>
      </div>

      <div
        className="absolute -bottom-8 -right-6 w-28 animate-float overflow-hidden rounded-2xl border border-white/10 bg-surface shadow-card sm:-right-10 sm:w-36"
        style={{ animationDelay: "1.2s" }}
      >
        <div className="flex items-center justify-center border-b border-white/10 py-2">
          <span className="h-1 w-8 rounded-full bg-white/20" />
        </div>
        <div className="flex flex-col gap-2 p-3">
          <div className="h-2 w-1/2 rounded-full bg-accent/50" />
          <div className="h-3 w-full rounded-full bg-white/25" />
          <div className="h-3 w-2/3 rounded-full bg-white/25" />
          <div className="mt-1 h-6 rounded-md bg-primary" />
        </div>
      </div>

      <div className="absolute inset-0 -z-10 bg-hero-glow blur-2xl" />
    </div>
  );
}
