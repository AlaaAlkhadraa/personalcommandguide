import Image from "next/image";

import { ArrowButton } from "@/components/ui/ArrowButton";
import { Container } from "@/components/ui/Container";
import { IMAGES } from "@/lib/assets";
import { LOCALES, LOCALE_NAMES } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/dictionary-type";

/**
 * Where ZEVREN works from, and who it works with.
 *
 * The claim is deliberately narrow: one studio in Maastricht, clients
 * elsewhere. There is no office list, no country count and no "global
 * presence", because none of that would be true. The language list is read
 * from the locales the site actually ships, so it cannot claim one that is
 * not really there.
 */
export function GlobalFocus({ dict }: { dict: Dictionary["globalFocus"] }) {
  const map = IMAGES["env-map"];

  return (
    <section className="relative overflow-hidden border-b border-white/5 py-16 lg:py-24">
      <Image
        src={map.src}
        alt={dict.imageAlt}
        fill
        loading="lazy"
        sizes="100vw"
        placeholder="blur"
        blurDataURL={map.blurDataURL}
        className="pointer-events-none select-none object-cover opacity-40 [mask-image:radial-gradient(ellipse_at_60%_50%,black_25%,transparent_78%)]"
      />
      <div
        aria-hidden="true"
        className="absolute inset-y-0 start-0 w-full bg-gradient-to-r from-navy via-navy/75 to-transparent lg:w-3/5"
      />

      <Container className="relative flex max-w-2xl flex-col gap-5">
        <span className="text-[11px] font-semibold uppercase tracking-[0.24em] text-accent">
          {dict.eyebrow}
        </span>
        <h2 className="max-w-lg font-heading text-2xl font-bold uppercase leading-[1.15] tracking-[-0.01em] text-white sm:text-3xl lg:text-[2.1rem]">
          {dict.title}
        </h2>
        <p className="max-w-xl text-sm leading-relaxed text-muted">{dict.body}</p>

        <dl className="grid grid-cols-2 gap-6 pt-2 sm:max-w-md">
          <div className="flex flex-col gap-1 border-s border-primary/40 ps-4">
            <dt className="text-[10px] uppercase tracking-[0.16em] text-muted">
              {dict.basedLabel}
            </dt>
            <dd className="text-sm font-medium text-white">{dict.basedValue}</dd>
          </div>
          <div className="flex flex-col gap-1 border-s border-primary/40 ps-4">
            <dt className="text-[10px] uppercase tracking-[0.16em] text-muted">
              {dict.languagesLabel}
            </dt>
            <dd className="text-sm font-medium text-white">
              {LOCALES.map((locale) => LOCALE_NAMES[locale]).join(", ")}
            </dd>
          </div>
        </dl>

        <div className="pt-3">
          <ArrowButton href="/contact">{dict.cta}</ArrowButton>
        </div>
      </Container>
    </section>
  );
}
