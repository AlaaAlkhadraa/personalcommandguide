import { Button } from "@/components/ui/Button";
import { WebsitePreview } from "@/components/home/WebsitePreview";
import type { Dictionary } from "@/lib/i18n/dictionary-type";

export function Hero({ dict }: { dict: Dictionary["home"]["hero"] }) {
  return (
    <section className="relative overflow-hidden bg-grid-glow">
      <div className="container-page grid items-center gap-16 py-20 lg:grid-cols-2 lg:py-28">
        <div className="flex animate-fade-up flex-col gap-6">
          <span className="w-fit rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs font-medium uppercase tracking-[0.2em] text-accent">
            {dict.badge}
          </span>
          <h1 className="text-4xl font-semibold leading-[1.1] text-white sm:text-5xl lg:text-6xl">
            {dict.titleBefore}{" "}
            <span className="text-gradient">{dict.titleHighlight}</span>.
          </h1>
          <p className="max-w-lg text-lg leading-relaxed text-muted">
            {dict.subtitle}
          </p>
          <div className="flex flex-col gap-4 pt-2 sm:flex-row">
            <Button href="/contact">{dict.ctaPrimary}</Button>
            <Button href="/work" variant="secondary">
              {dict.ctaSecondary}
            </Button>
          </div>
          <p className="pt-6 text-sm text-muted">{dict.trustLine}</p>
        </div>
        <WebsitePreview />
      </div>
    </section>
  );
}
