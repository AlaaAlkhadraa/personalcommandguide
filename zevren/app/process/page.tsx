import type { Metadata } from "next";
import { headers } from "next/headers";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { PageHero } from "@/components/ui/PageHero";
import { FAQ } from "@/components/home/FAQ";
import { Process } from "@/components/home/Process";
import { RevealGroup } from "@/components/ui/RevealGroup";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbJsonLd, buildMetadata } from "@/lib/seo";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const meta = getDictionary(locale).meta.process;
  return buildMetadata({
    title: meta.title,
    description: meta.description,
    path: "/process",
    locale,
  });
}

export default async function ProcessPage() {
  const locale = await getLocale();
  const dict = getDictionary(locale);

  const nonce = (await headers()).get("x-nonce") ?? undefined;

  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd(dict.nav.home, [{ name: dict.nav.process, path: "/process" }])}
        nonce={nonce}
      />
      <PageHero
        eyebrow={dict.home.process.eyebrow}
        title={dict.home.process.title}
        description={dict.home.process.subtitle}
      />

      <RevealGroup>
      <Process dict={dict.process} homeDict={dict.home.process} detailed />

      <FAQ dict={dict.faq} homeDict={dict.home.faq} />

      <section className="border-t border-white/5 py-20">
        <Container data-reveal className="flex flex-col items-center gap-6 text-center">
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
      </RevealGroup>
    </>
  );
}
