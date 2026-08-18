import { SectionHeading } from "@/components/ui/SectionHeading";
import { Container } from "@/components/ui/Container";
import type { Dictionary } from "@/lib/i18n/dictionary-type";

interface FAQProps {
  dict: Dictionary["faq"];
  homeDict: Dictionary["home"]["faq"];
}

export function FAQ({ dict, homeDict }: FAQProps) {
  return (
    <section className="py-24">
      <Container className="flex flex-col gap-12">
        <div data-reveal>
          <SectionHeading eyebrow={homeDict.eyebrow} title={homeDict.title} />
        </div>
        <div data-reveal-stagger className="mx-auto flex w-full max-w-3xl flex-col gap-3">
          {dict.items.map((item) => (
            <details
              key={item.question}
              data-reveal-item
              className="group rounded-xl border border-white/10 bg-surface/50 px-6 py-4 open:border-primary/40"
            >
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-base font-medium text-white marker:content-none">
                {item.question}
                <span
                  aria-hidden="true"
                  className="shrink-0 text-xl text-accent transition-transform duration-200 group-open:rotate-45"
                >
                  +
                </span>
              </summary>
              <p className="pt-3 text-sm leading-relaxed text-muted">{item.answer}</p>
            </details>
          ))}
        </div>
      </Container>
    </section>
  );
}
