import { ArrowButton } from "@/components/ui/ArrowButton";
import { Container } from "@/components/ui/Container";
import type { Dictionary } from "@/lib/i18n/dictionary-type";

/**
 * One line and one button between the packages and the projects: the visitor
 * who cannot picture a package yet gets sent to the concept builder, where he
 * assembles that picture himself.
 */
export function ConceptCtaBand({ dict }: { dict: Dictionary["home"]["conceptCta"] }) {
  return (
    <section className="border-b border-white/5 py-12 sm:py-14">
      <Container>
        <div
          data-reveal
          className="flex flex-col items-start gap-5 rounded-2xl border border-white/10 bg-surface/50 p-7 sm:flex-row sm:items-center sm:justify-between sm:p-9"
        >
          <div>
            <h2 className="font-heading text-xl font-bold text-white sm:text-2xl">{dict.title}</h2>
            <p className="mt-1.5 max-w-xl text-sm text-muted">{dict.subtitle}</p>
          </div>
          <ArrowButton href="/concept-bouwer" className="flex-shrink-0">
            {dict.button}
          </ArrowButton>
        </div>
      </Container>
    </section>
  );
}
