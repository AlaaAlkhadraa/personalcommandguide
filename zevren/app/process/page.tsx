import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { PageHero } from "@/components/ui/PageHero";
import { FAQ } from "@/components/home/FAQ";
import { Process } from "@/components/home/Process";
import { buildMetadata } from "@/lib/seo";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";

export const metadata = buildMetadata({
  title: "Process",
  description:
    "How a ZEVREN project runs, from discovery through design and development to launch.",
  path: "/process",
});

export default async function ProcessPage() {
  const locale = await getLocale();
  const dict = getDictionary(locale);

  return (
    <>
      <PageHero
        eyebrow={dict.home.process.eyebrow}
        title={dict.home.process.title}
        description={dict.home.process.subtitle}
      />

      <Process dict={dict.process} homeDict={dict.home.process} detailed />

      <FAQ dict={dict.faq} homeDict={dict.home.faq} />

      <section className="border-t border-white/5 py-20">
        <Container className="flex flex-col items-center gap-6 text-center">
          <h2 className="max-w-xl font-heading text-3xl font-semibold text-white">
            {dict.home.finalCta.title}
          </h2>
          <p className="max-w-lg text-muted">{dict.home.finalCta.subtitle}</p>
          <div className="flex flex-col gap-4 sm:flex-row">
            <Button href="/contact">{dict.home.finalCta.ctaPrimary}</Button>
            <Button href="/projects" variant="secondary">
              {dict.home.finalCta.ctaSecondary}
            </Button>
          </div>
        </Container>
      </section>
    </>
  );
}
