import Image from "next/image";

import { Container } from "@/components/ui/Container";
import { IMAGES } from "@/lib/assets";
import { WORK_ITEMS } from "@/lib/constants";
import { LOCALES } from "@/lib/i18n/config";
import { getFoundingStatus } from "@/lib/server/campaign";
import type { Dictionary } from "@/lib/i18n/dictionary-type";

/**
 * The mission band: a statement on the left, figures on the right.
 *
 * The figures are the studio's own, derived from the codebase and the
 * database, not client outcomes. ZEVREN has no delivered client work yet, so
 * "projects completed", "happy clients" and "average rating" would all be
 * invented, and inventing them is the one thing this site must not do. The
 * shape of the band is ready for real numbers the day there are some.
 */
export async function Mission({ dict }: { dict: Dictionary["mission"] }) {
  const status = await getFoundingStatus();
  const backdrop = IMAGES["atmos-network"];

  const figures = [
    { value: String(WORK_ITEMS.length), label: dict.conceptsLabel },
    { value: String(LOCALES.length), label: dict.languagesLabel },
    {
      // A plain count, not "x/10". The founding block further down the page
      // shows a "claimed out of ten" counter, and two x/10 figures meaning
      // opposite things on one page is just confusing.
      value: status.known ? String(status.open) : "?",
      label: dict.spotsLabel,
    },
    { value: dict.responseValue, label: dict.responseLabel },
  ];

  return (
    <section className="relative overflow-hidden border-b border-white/5 py-16 lg:py-20">
      <Image
        data-parallax="-10"
        src={backdrop.src}
        alt=""
        aria-hidden="true"
        fill
        loading="lazy"
        sizes="100vw"
        placeholder="blur"
        blurDataURL={backdrop.blurDataURL}
        className="pointer-events-none select-none object-cover opacity-[0.16] [mask-image:linear-gradient(to_right,black,transparent_75%)]"
      />
      {/* Hairlines top and bottom, as in the design. */}
      <span
        aria-hidden="true"
        className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/60 to-transparent"
      />
      <span
        aria-hidden="true"
        className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-primary/60 to-transparent"
      />

      <Container className="relative grid items-center gap-10 lg:grid-cols-[1.15fr_1fr] lg:gap-16">
        <div data-reveal className="flex flex-col gap-3">
          <span className="text-[11px] font-semibold uppercase tracking-[0.24em] text-accent">
            {dict.eyebrow}
          </span>
          <h2 data-reveal-words className="font-heading text-2xl font-bold uppercase leading-[1.15] tracking-[-0.01em] text-white sm:text-3xl lg:text-[2.1rem]">
            {dict.titleBefore}{" "}
            <span className="text-accent">{dict.titleHighlight}</span>
          </h2>
        </div>

        <dl data-reveal-stagger className="grid grid-cols-2 gap-x-6 gap-y-7 sm:grid-cols-4">
          {figures.map((figure) => (
            <div key={figure.label} data-reveal-item className="flex flex-col gap-1 text-center sm:text-start">
              <dd data-count-to className="font-heading text-3xl font-bold tabular-nums text-accent lg:text-[2.25rem]">
                {figure.value}
              </dd>
              <dt className="text-[10px] uppercase leading-tight tracking-[0.14em] text-muted">
                {figure.label}
              </dt>
            </div>
          ))}
        </dl>
      </Container>
    </section>
  );
}
