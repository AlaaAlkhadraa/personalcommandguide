import Image from "next/image";

import { ArrowButton } from "@/components/ui/ArrowButton";
import { Container } from "@/components/ui/Container";
import { Icon } from "@/components/ui/Icon";
import { IMAGES } from "@/lib/assets";
import type { ServiceIcon } from "@/types";
import type { Dictionary } from "@/lib/i18n/dictionary-type";

const POINT_ICONS: ServiceIcon[] = ["layers", "compass", "code", "cart"];

/**
 * Who ZEVREN is, on the home page.
 *
 * Four claims, all about how the studio works rather than what it has
 * achieved, because there are no delivered results to point at yet.
 */
export function AboutBand({ dict }: { dict: Dictionary["home"]["about"] }) {
  const art = IMAGES["service-web-apps"];

  return (
    <section className="relative overflow-hidden border-b border-white/5 py-16 lg:py-20">
      {/* Photograph anchored to the right, faded into the page rather than
          sitting in a hard-edged box. */}
      <Image
        src={art.src}
        alt=""
        aria-hidden="true"
        fill
        loading="lazy"
        sizes="100vw"
        placeholder="blur"
        blurDataURL={art.blurDataURL}
        className="pointer-events-none select-none object-cover opacity-25 [mask-image:linear-gradient(to_left,black,transparent_62%)]"
      />

      <Container className="relative grid gap-10 lg:grid-cols-[1.05fr_1fr] lg:gap-16">
        <div className="flex flex-col gap-4">
          <span className="text-[11px] font-semibold uppercase tracking-[0.24em] text-accent">
            {dict.eyebrow}
          </span>
          <h2 className="max-w-lg font-heading text-2xl font-bold uppercase leading-[1.15] tracking-[-0.01em] text-white sm:text-3xl lg:text-[2.1rem]">
            {dict.titleBefore}{" "}
            <span className="text-accent">{dict.titleHighlight}</span>
          </h2>
          <p className="max-w-lg text-sm leading-relaxed text-muted">{dict.body}</p>
          <div className="pt-2">
            <ArrowButton href="/about" variant="outline">
              {dict.cta}
            </ArrowButton>
          </div>
        </div>

        <ul className="grid gap-x-8 gap-y-6 sm:grid-cols-2 lg:self-center">
          {dict.points.map((point, index) => (
            <li key={point.title} className="flex gap-3">
              <span className="mt-0.5 shrink-0 text-accent">
                <Icon name={POINT_ICONS[index] ?? "layers"} className="h-6 w-6" />
              </span>
              <span className="flex flex-col gap-1">
                <span className="text-[13px] font-semibold leading-tight text-white">
                  {point.title}
                </span>
                <span className="text-[12px] leading-relaxed text-muted">
                  {point.description}
                </span>
              </span>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
