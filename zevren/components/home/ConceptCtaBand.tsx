import { ArrowButton } from "@/components/ui/ArrowButton";
import { Container } from "@/components/ui/Container";
import type { Dictionary } from "@/lib/i18n/dictionary-type";

/**
 * One line and one button between the packages and the projects: the visitor
 * who cannot picture a package yet gets sent to the concept builder, where he
 * assembles that picture himself.
 *
 * Continues the white pricing band above it, so the two read as one page of
 * paper before the dark projects section takes over.
 */
export function ConceptCtaBand({ dict }: { dict: Dictionary["home"]["conceptCta"] }) {
  return (
    <section className="border-b border-slate-200 bg-white pb-14 pt-2 sm:pb-16">
      <Container>
        <div
          data-reveal
          className="flex flex-col items-start gap-5 rounded-2xl border border-slate-200 bg-slate-50 p-7 sm:flex-row sm:items-center sm:justify-between sm:p-9"
        >
          <div>
            <h2 className="font-heading text-xl font-bold text-navy sm:text-2xl">{dict.title}</h2>
            <p className="mt-1.5 max-w-xl text-sm text-slate-600">{dict.subtitle}</p>
          </div>
          <ArrowButton href="/concept-bouwer" className="flex-shrink-0">
            {dict.button}
          </ArrowButton>
        </div>
      </Container>
    </section>
  );
}
