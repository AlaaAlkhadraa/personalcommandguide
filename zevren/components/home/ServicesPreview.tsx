import Image from "next/image";
import Link from "next/link";

import { SERVICES } from "@/lib/constants";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Icon } from "@/components/ui/Icon";
import { Container } from "@/components/ui/Container";
import { IMAGES } from "@/lib/assets";
import type { Dictionary } from "@/lib/i18n/dictionary-type";

interface ServicesPreviewProps {
  dict: Dictionary["services"];
  homeDict: Dictionary["home"]["services"];
}

/**
 * Six service cards, each with its own image.
 *
 * The first card spans two columns on wide screens so the grid has a focal
 * point instead of six identical rectangles, which is what makes a card grid
 * read as a template.
 */
export function ServicesPreview({ dict, homeDict }: ServicesPreviewProps) {
  return (
    <section className="py-24">
      <Container className="flex flex-col gap-12">
        <SectionHeading
          eyebrow={homeDict.eyebrow}
          title={homeDict.title}
          description={homeDict.subtitle}
        />
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {SERVICES.map((service, index) => {
            const copy = dict.list[service.slug];
            const art = IMAGES[service.image];
            const wide = index === 0;

            return (
              <Link
                key={service.slug}
                href={`/services#${service.slug}`}
                className={`group relative flex min-h-[15rem] flex-col justify-end overflow-hidden rounded-2xl border border-white/10 bg-surface/60 p-6 transition-colors duration-300 hover:border-accent/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent ${
                  wide ? "lg:col-span-2 lg:min-h-[19rem]" : ""
                }`}
              >
                <Image
                  src={art.src}
                  alt=""
                  aria-hidden="true"
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  placeholder="blur"
                  blurDataURL={art.blurDataURL}
                  className="pointer-events-none select-none object-cover opacity-30 transition-[opacity,transform] duration-500 group-hover:scale-[1.04] group-hover:opacity-45"
                />
                {/* Text sits on a gradient rather than the raw photo, so the
                    contrast holds whatever the image behind it happens to be. */}
                <div
                  aria-hidden="true"
                  className="absolute inset-0 bg-gradient-to-t from-navy via-navy/85 to-navy/25"
                />

                <div className="relative flex flex-col gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/20 text-accent">
                    <Icon name={service.icon} className="h-5 w-5" />
                  </div>
                  <h3 className="font-heading text-xl font-semibold text-white">
                    {copy.title}
                  </h3>
                  <p
                    className={`text-sm leading-relaxed text-muted ${
                      wide ? "max-w-md" : ""
                    }`}
                  >
                    {copy.summary}
                  </p>
                  <span className="flex items-center gap-1.5 text-sm font-medium text-accent transition-transform duration-300 group-hover:translate-x-1">
                    {homeDict.learnMore}
                    <span aria-hidden="true">&rarr;</span>
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
