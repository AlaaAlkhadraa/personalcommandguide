import type { Metadata } from "next";
import Image from "next/image";

import { PageHero } from "@/components/ui/PageHero";
import { Container } from "@/components/ui/Container";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { RevealGroup } from "@/components/ui/RevealGroup";
import { IMAGES } from "@/lib/assets";
import { buildMetadata } from "@/lib/seo";
import { getLocale } from "@/lib/i18n/get-locale";
import { getDictionary } from "@/lib/i18n/get-dictionary";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const meta = getDictionary(locale).meta.about;
  return buildMetadata({
    title: meta.title,
    description: meta.description,
    path: "/about",
    locale,
  });
}

export default async function AboutPage() {
  const locale = await getLocale();
  const { about: a } = getDictionary(locale);
  const backdrop = IMAGES["atmos-wave"];

  return (
    <>
      <PageHero eyebrow={a.eyebrow} title={a.title} description={a.subtitle} />
      <RevealGroup>
      <section className="relative overflow-hidden py-20">
        <Image
          data-parallax="-8"
          src={backdrop.src}
          alt=""
          aria-hidden="true"
          fill
          loading="lazy"
          sizes="100vw"
          placeholder="blur"
          blurDataURL={backdrop.blurDataURL}
          className="pointer-events-none select-none object-cover opacity-[0.15] [mask-image:linear-gradient(to_bottom,black,transparent)]"
        />
        <Container className="relative grid gap-16 lg:grid-cols-[1.1fr_1fr]">
          <div data-reveal className="flex flex-col gap-6">
            <h2 className="text-2xl font-semibold text-white sm:text-3xl">
              {a.howWeWorkTitle}
            </h2>
            <p className="leading-relaxed text-muted">{a.howWeWorkP1}</p>
            <p className="leading-relaxed text-muted">{a.howWeWorkP2}</p>
          </div>
          <div className="flex flex-col gap-4">
            <h2 data-reveal className="text-2xl font-semibold text-white sm:text-3xl">
              {a.valuesTitle}
            </h2>
            <div data-reveal-stagger className="grid gap-4">
              {a.values.map((value) => (
                <Card key={value.title} data-reveal-item className="flex flex-col gap-2 p-6">
                  <h3 className="text-base font-semibold text-white">{value.title}</h3>
                  <p className="text-sm leading-relaxed text-muted">{value.description}</p>
                </Card>
              ))}
            </div>
          </div>
        </Container>
      </section>
      <section className="border-t border-white/5 bg-surface/30 py-20">
        <Container data-reveal className="flex flex-col items-center gap-6 text-center">
          <h2 className="max-w-xl text-3xl font-semibold text-white">{a.ctaTitle}</h2>
          <p className="max-w-lg text-muted">{a.ctaBody}</p>
          <Button href="/contact">{a.ctaButton}</Button>
        </Container>
      </section>
      </RevealGroup>
    </>
  );
}
