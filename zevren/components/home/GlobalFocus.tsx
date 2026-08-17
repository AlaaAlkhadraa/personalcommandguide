import Image from "next/image";

import { Container } from "@/components/ui/Container";
import { IMAGES } from "@/lib/assets";
import { LOCALES, LOCALE_NAMES } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/dictionary-type";

/**
 * Where ZEVREN works from, and who it works with.
 *
 * The claim is deliberately narrow: one studio in Maastricht, clients
 * elsewhere. There is no office list, no country count and no "global
 * presence", because none of that would be true.
 */
export function GlobalFocus({ dict }: { dict: Dictionary["globalFocus"] }) {
  const globe = IMAGES["global-globe"];
  const map = IMAGES["global-map"];

  return (
    <section className="relative overflow-hidden border-t border-white/5 py-24">
      <Image
        src={map.src}
        alt=""
        aria-hidden="true"
        fill
        loading="lazy"
        sizes="100vw"
        placeholder="blur"
        blurDataURL={map.blurDataURL}
        className="pointer-events-none select-none object-cover opacity-[0.12] [mask-image:radial-gradient(ellipse_at_center,black,transparent_75%)]"
      />

      <Container className="relative grid items-center gap-14 lg:grid-cols-[1fr_1fr]">
        <div className="flex flex-col gap-6">
          <span className="w-fit rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-xs font-medium uppercase tracking-[0.2em] text-accent">
            {dict.eyebrow}
          </span>
          <h2 className="font-heading text-3xl font-semibold leading-tight text-white sm:text-4xl">
            {dict.title}
          </h2>
          <p className="max-w-xl text-base leading-relaxed text-muted">{dict.body}</p>

          <dl className="grid gap-6 pt-2 sm:grid-cols-2">
            <div className="flex flex-col gap-1 border-l border-primary/40 pl-4">
              <dt className="text-xs uppercase tracking-[0.18em] text-muted">
                {dict.basedLabel}
              </dt>
              <dd className="text-base font-medium text-white">{dict.basedValue}</dd>
            </div>
            <div className="flex flex-col gap-1 border-l border-primary/40 pl-4">
              <dt className="text-xs uppercase tracking-[0.18em] text-muted">
                {dict.languagesLabel}
              </dt>
              {/* Read off the locales the site actually ships, so this can
                  never claim a language that is not really available. */}
              <dd className="text-base font-medium text-white">
                {LOCALES.map((locale) => LOCALE_NAMES[locale]).join(", ")}
              </dd>
            </div>
          </dl>
        </div>

        <div className="relative mx-auto aspect-square w-full max-w-md overflow-hidden rounded-full">
          <Image
            src={globe.src}
            alt={dict.imageAlt}
            fill
            loading="lazy"
            sizes="(max-width: 1024px) 80vw, 32vw"
            placeholder="blur"
            blurDataURL={globe.blurDataURL}
            className="object-cover opacity-80"
          />
          <div
            aria-hidden="true"
            className="absolute inset-0 rounded-full bg-gradient-to-t from-navy via-transparent to-transparent"
          />
        </div>
      </Container>
    </section>
  );
}
