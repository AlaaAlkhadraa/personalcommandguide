import Image from "next/image";

import { ArrowButton } from "@/components/ui/ArrowButton";
import { Container } from "@/components/ui/Container";
import { Icon } from "@/components/ui/Icon";
import { ContactForm } from "@/components/contact/ContactForm";
import { IMAGES } from "@/lib/assets";
import { SITE_CONFIG } from "@/lib/constants";
import type { Dictionary } from "@/lib/i18n/dictionary-type";

/**
 * The closing section: the invitation, the real form, and how to reach a
 * person directly.
 *
 * The form is the same component and the same validated endpoint the contact
 * page uses, not a decorative copy. A visitor who submits here gets a row in
 * the database exactly as they would there.
 */
export function FinalCTA({
  dict,
  contactDict,
}: {
  dict: Dictionary["home"]["finalCta"];
  contactDict: Dictionary["contact"];
}) {
  const glow = IMAGES["hero-horizon"];

  return (
    <section id="start" className="relative overflow-hidden border-b border-white/5 py-16 lg:py-20">
      <Image
        src={glow.src}
        alt=""
        aria-hidden="true"
        fill
        loading="lazy"
        sizes="100vw"
        placeholder="blur"
        blurDataURL={glow.blurDataURL}
        className="pointer-events-none select-none object-cover opacity-25 [mask-image:radial-gradient(ellipse_at_30%_50%,black,transparent_70%)]"
      />

      <Container className="relative grid gap-12 lg:grid-cols-[1fr_1.15fr] lg:gap-16">
        <div className="flex flex-col gap-5">
          <span className="text-[11px] font-semibold uppercase tracking-[0.24em] text-accent">
            {dict.eyebrow}
          </span>
          <h2 className="max-w-md font-heading text-3xl font-bold uppercase leading-[1.1] tracking-[-0.01em] text-white sm:text-4xl">
            {dict.title}
          </h2>
          <p className="max-w-md text-sm leading-relaxed text-muted">{dict.subtitle}</p>

          <div className="flex flex-col gap-3 pt-2 sm:flex-row">
            <ArrowButton href="/contact">{dict.ctaPrimary}</ArrowButton>
            <ArrowButton href="/projects" variant="outline">
              {dict.ctaSecondary}
            </ArrowButton>
          </div>

          <ul className="flex flex-col gap-4 pt-8">
            <li className="flex items-start gap-3">
              <span className="mt-0.5 text-accent">
                <Icon name="globe" className="h-5 w-5" />
              </span>
              <span className="text-sm leading-relaxed text-muted">
                {SITE_CONFIG.address.city}, {SITE_CONFIG.address.country}
                <br />
                {dict.worldwide}
              </span>
            </li>
            <li className="flex items-center gap-3">
              <span className="text-accent">
                <Icon name="search" className="h-5 w-5" />
              </span>
              <a
                href={`mailto:${SITE_CONFIG.email}`}
                className="text-sm text-muted transition-colors hover:text-white"
              >
                {SITE_CONFIG.email}
              </a>
            </li>
            <li className="flex items-center gap-3">
              <span className="text-accent">
                <Icon name="compass" className="h-5 w-5" />
              </span>
              <a
                href={`tel:${SITE_CONFIG.phone}`}
                className="text-sm text-muted transition-colors hover:text-white"
              >
                {SITE_CONFIG.phoneDisplay}
              </a>
            </li>
          </ul>
        </div>

        <div className="rounded-2xl border border-white/10 bg-navy/70 p-6 sm:p-8">
          <h3 className="mb-6 text-[11px] font-semibold uppercase tracking-[0.2em] text-accent">
            {dict.formHeading}
          </h3>
          <ContactForm dict={contactDict.form} />
        </div>
      </Container>
    </section>
  );
}
