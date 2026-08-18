import Image from "next/image";
import { CtaMark } from "@/components/home/CtaMark";

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
        data-parallax="-10"
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

      <Container className="relative grid gap-12 lg:grid-cols-[1fr_1.2fr_auto] lg:gap-12">
        <div data-reveal className="flex flex-col gap-5">
          <span className="text-[11px] font-semibold uppercase tracking-[0.24em] text-accent">
            {dict.eyebrow}
          </span>
          <h2 data-reveal-words className="max-w-md font-heading text-3xl font-bold uppercase leading-[1.1] tracking-[-0.01em] text-white sm:text-4xl">
            {dict.title}
          </h2>
          <p className="max-w-md text-sm leading-relaxed text-muted">{dict.subtitle}</p>

          <div className="flex flex-col gap-3 pt-2 sm:flex-row">
            <ArrowButton href="/contact">{dict.ctaPrimary}</ArrowButton>
            <ArrowButton href="/projects" variant="outline">
              {dict.ctaSecondary}
            </ArrowButton>
          </div>

          {/* The mark again, live. It reuses the hero scene and the cached
              GLB, and only mounts when the section scrolls near. */}
          <CtaMark className="pointer-events-auto relative mt-6 hidden aspect-square w-full max-w-xs lg:block" />
        </div>

        <div data-reveal data-reveal-delay="0.1" className="rounded-2xl border border-white/10 bg-navy/70 p-6 sm:p-8">
          <h3 className="mb-6 text-[11px] font-semibold uppercase tracking-[0.2em] text-accent">
            {dict.formHeading}
          </h3>
          <ContactForm dict={contactDict.form} />
        </div>

        <div data-reveal data-reveal-delay="0.2" className="flex flex-col gap-5 lg:w-56">
          <h3 className="text-[11px] font-semibold uppercase tracking-[0.2em] text-accent">
            {contactDict.directContactTitle}
          </h3>
          <ul className="flex flex-col gap-4">
            <li className="flex items-start gap-3">
              <span className="mt-0.5 shrink-0 text-accent">
                <Icon name="globe" className="h-5 w-5" />
              </span>
              <span className="text-sm leading-relaxed text-muted">
                {SITE_CONFIG.address.city}, {SITE_CONFIG.address.country}
                <br />
                {dict.worldwide}
              </span>
            </li>
            <li className="flex items-center gap-3">
              <span className="shrink-0 text-accent">
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
              <span className="shrink-0 text-accent">
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

          <a
            href={SITE_CONFIG.social.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="flex h-11 w-11 items-center justify-center rounded-lg border border-white/10 text-muted transition-colors hover:border-accent/50 hover:text-accent"
            aria-label="ZEVREN on LinkedIn"
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor" aria-hidden="true">
              <path d="M6.94 8.5H3.56V20h3.38V8.5ZM5.25 3.5a1.96 1.96 0 1 0 0 3.92 1.96 1.96 0 0 0 0-3.92ZM20.44 20h-3.37v-5.6c0-1.34-.03-3.06-1.87-3.06-1.87 0-2.16 1.46-2.16 2.96V20H9.68V8.5h3.24v1.57h.05c.45-.85 1.56-1.75 3.2-1.75 3.42 0 4.05 2.25 4.05 5.18V20Z" />
            </svg>
          </a>
        </div>
      </Container>
    </section>
  );
}
