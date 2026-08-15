import { Button } from "@/components/ui/Button";
import { WebsitePreview } from "@/components/home/WebsitePreview";

const TRUST_POINTS = [
  "Based in Maastricht",
  "Custom built websites",
  "Direct communication",
  "Fast and responsive",
];

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-grid-glow">
      <div className="container-page grid items-center gap-16 py-20 lg:grid-cols-2 lg:py-28">
        <div className="flex animate-fade-up flex-col gap-6">
          <span className="w-fit rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs font-medium uppercase tracking-[0.2em] text-accent">
            Web studio in Maastricht
          </span>
          <h1 className="text-4xl font-semibold leading-[1.1] text-white sm:text-5xl lg:text-6xl">
            Websites built to make your{" "}
            <span className="text-gradient">business look serious</span>.
          </h1>
          <p className="max-w-lg text-lg leading-relaxed text-muted">
            ZEVREN creates modern, fast and user friendly websites for
            businesses that want a stronger online presence.
          </p>
          <div className="flex flex-col gap-4 pt-2 sm:flex-row">
            <Button href="/contact">Start a project</Button>
            <Button href="/work" variant="secondary">
              See our work
            </Button>
          </div>
          <ul className="flex flex-wrap gap-x-6 gap-y-3 pt-8">
            {TRUST_POINTS.map((point) => (
              <li
                key={point}
                className="flex items-center gap-2 text-sm text-muted"
              >
                <svg
                  viewBox="0 0 20 20"
                  className="h-4 w-4 shrink-0 text-accent"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  aria-hidden="true"
                >
                  <path
                    d="m4 10 4 4 8-8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                {point}
              </li>
            ))}
          </ul>
        </div>
        <WebsitePreview />
      </div>
    </section>
  );
}
