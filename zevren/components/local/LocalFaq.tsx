import { Container } from "@/components/ui/Container";
import { JsonLd } from "@/components/seo/JsonLd";

export interface FaqItem {
  question: string;
  answer: string;
}

/**
 * A short, page-specific FAQ for the landing pages: the three or four
 * questions a visitor with this exact intent actually has, answered with
 * facts the rest of the site already states. Carries FAQPage JSON-LD in
 * Dutch, since the pages are Dutch-only.
 */
export function LocalFaq({
  title,
  items,
  nonce,
}: {
  title: string;
  items: FaqItem[];
  nonce?: string;
}) {
  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    inLanguage: "nl",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: { "@type": "Answer", text: item.answer },
    })),
  };

  return (
    <section className="border-y border-slate-200 bg-white py-14 sm:py-20">
      <JsonLd data={faqJsonLd} nonce={nonce} />
      <Container className="flex flex-col gap-8">
        <h2 className="font-heading text-2xl font-bold text-navy sm:text-3xl">{title}</h2>
        <div className="mx-auto flex w-full max-w-3xl flex-col gap-3">
          {items.map((item) => (
            <details
              key={item.question}
              className="group rounded-xl border border-slate-200 bg-slate-50 px-6 py-4 open:border-primary/40 open:bg-white"
            >
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-base font-medium text-navy marker:content-none">
                {item.question}
                <span
                  aria-hidden="true"
                  className="shrink-0 text-xl text-primary transition-transform duration-200 group-open:rotate-45"
                >
                  +
                </span>
              </summary>
              <p className="pt-3 text-sm leading-relaxed text-slate-600">{item.answer}</p>
            </details>
          ))}
        </div>
      </Container>
    </section>
  );
}
