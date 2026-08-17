import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import type { Dictionary } from "@/lib/i18n/dictionary-type";

export function FinalCTA({ dict }: { dict: Dictionary["home"]["finalCta"] }) {
  return (
    <section className="py-24">
      <Container>
        <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-hero-glow px-8 py-16 text-center sm:px-16">
          <h2 className="mx-auto max-w-2xl text-3xl font-semibold leading-tight text-white sm:text-4xl">
            {dict.title}
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-muted">
            {dict.subtitle}
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button href="/contact">{dict.ctaPrimary}</Button>
            <Button href="/services" variant="secondary">
              {dict.ctaSecondary}
            </Button>
          </div>
        </div>
      </Container>
    </section>
  );
}
