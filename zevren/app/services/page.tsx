import Image from "next/image";

import { PageHero } from "@/components/ui/PageHero";
import { Container } from "@/components/ui/Container";
import { Icon } from "@/components/ui/Icon";
import { Button } from "@/components/ui/Button";
import { PricingSection } from "@/components/services/PricingSection";
import { SERVICES } from "@/lib/constants";
import { IMAGES } from "@/lib/assets";
import { buildMetadata } from "@/lib/seo";
import { getLocale } from "@/lib/i18n/get-locale";
import { getDictionary } from "@/lib/i18n/get-dictionary";

export const metadata = buildMetadata({
  title: "Services",
  description:
    "Web design, e-commerce, web applications, UI/UX design and maintenance. See what ZEVREN can build for your business.",
  path: "/services",
});

export default async function ServicesPage() {
  const locale = await getLocale();
  const dict = getDictionary(locale);
  const s = dict.services;

  return (
    <>
      <PageHero eyebrow={s.eyebrow} title={s.title} description={s.subtitle} />
      <section className="py-20">
        <Container className="flex flex-col gap-20">
          {SERVICES.map((service, index) => {
            const copy = s.list[service.slug];
            const art = IMAGES[service.image];
            return (
              <div
                key={service.slug}
                id={service.slug}
                className="scroll-mt-28 grid gap-10 border-t border-white/10 pt-14 lg:grid-cols-[1fr_1.4fr] lg:gap-16"
              >
                <div className="flex flex-col gap-4">
                  <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl border border-white/10">
                    <Image
                      src={art.src}
                      alt=""
                      aria-hidden="true"
                      fill
                      loading="lazy"
                      sizes="(max-width: 1024px) 100vw, 30vw"
                      placeholder="blur"
                      blurDataURL={art.blurDataURL}
                      className="object-cover opacity-70"
                    />
                    <div
                      aria-hidden="true"
                      className="absolute inset-0 bg-gradient-to-t from-navy/90 to-transparent"
                    />
                    <div className="absolute bottom-4 left-4 flex h-11 w-11 items-center justify-center rounded-xl bg-primary/25 text-accent backdrop-blur-sm">
                      <Icon name={service.icon} className="h-5 w-5" />
                    </div>
                  </div>
                  <span className="text-xs font-semibold uppercase tracking-wider text-muted">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <h2 className="font-heading text-2xl font-semibold text-white sm:text-3xl">
                    {copy.title}
                  </h2>
                </div>
                <div className="flex flex-col gap-6">
                  <p className="text-base leading-relaxed text-muted">{copy.description}</p>
                  <ul className="grid gap-3 sm:grid-cols-2">
                    {copy.features.map((feature) => (
                      <li
                        key={feature}
                        className="flex items-start gap-2 text-sm text-white/85"
                      >
                        <svg
                          viewBox="0 0 20 20"
                          className="mt-0.5 h-4 w-4 shrink-0 text-accent"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth={2}
                          aria-hidden="true"
                        >
                          <path d="m4 10 4 4 8-8" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            );
          })}
        </Container>
      </section>
      <PricingSection dict={s} pricingDict={dict.pricing} />
      <section className="py-20">
        <Container className="flex flex-col items-center gap-6 text-center">
          <h2 className="max-w-xl text-3xl font-semibold text-white">{s.notSureTitle}</h2>
          <p className="max-w-lg text-muted">{s.notSureBody}</p>
          <Button href="/contact">{s.notSureCta}</Button>
        </Container>
      </section>
    </>
  );
}
