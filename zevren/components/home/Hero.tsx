import { Button } from "@/components/ui/Button";
import { WebsitePreview } from "@/components/home/WebsitePreview";

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-grid-glow">
      <div className="container-page grid items-center gap-16 py-20 lg:grid-cols-2 lg:py-28">
        <div className="flex animate-fade-up flex-col gap-6">
          <span className="w-fit rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs font-medium uppercase tracking-[0.2em] text-accent">
            Web studio in Maastricht
          </span>
          <h1 className="text-4xl font-semibold leading-[1.1] text-white sm:text-5xl lg:text-6xl">
            Websites that make your{" "}
            <span className="text-gradient">business easier to choose</span>.
          </h1>
          <p className="max-w-lg text-lg leading-relaxed text-muted">
            We design and build modern websites for businesses that want a
            clear, professional presence online.
          </p>
          <div className="flex flex-col gap-4 pt-2 sm:flex-row">
            <Button href="/contact">Start a project</Button>
            <Button href="/work" variant="secondary">
              See our work
            </Button>
          </div>
          <p className="pt-6 text-sm text-muted">
            Based in Maastricht. Working with businesses worldwide.
          </p>
        </div>
        <WebsitePreview />
      </div>
    </section>
  );
}
