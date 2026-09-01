import Image from "next/image";
import Link from "next/link";
import { FOOTER_LEGAL_LINKS, NAV_LINKS, SERVICES, SITE_CONFIG, WORK_ITEMS } from "@/lib/constants";
import { IMAGES } from "@/lib/assets";
import { Wordmark } from "@/components/layout/Wordmark";
import type { Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/dictionary-type";

const LEGAL_LABEL_KEYS = ["privacyPolicy", "termsAndConditions"] as const;

interface FooterProps {
  locale: Locale;
  dict: Dictionary["footer"];
  navDict: Dictionary["nav"];
  servicesDict: Dictionary["services"];
  workDict: Dictionary["work"];
}

export function Footer({ dict, navDict, servicesDict, workDict }: FooterProps) {
  const year = new Date().getFullYear();
  const map = IMAGES["env-map"];

  return (
    <footer className="relative overflow-hidden border-t border-white/10 bg-surface/40">
      <Image
        src={map.src}
        alt=""
        aria-hidden="true"
        fill
        loading="lazy"
        sizes="100vw"
        placeholder="blur"
        blurDataURL={map.blurDataURL}
        className="pointer-events-none select-none object-cover opacity-[0.10] [mask-image:radial-gradient(ellipse_at_70%_40%,black,transparent_75%)]"
      />

      <div className="container-page relative grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1fr_1fr]">
        <div className="flex flex-col gap-4">
          <Link href="/" className="group flex w-fit items-center">
            <Wordmark discipline={navDict.discipline} />
          </Link>
          <p className="max-w-sm text-sm leading-relaxed text-muted">
            {dict.description}
          </p>
          <div className="flex gap-4 pt-2">
            <a
              href={SITE_CONFIG.social.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted transition-colors hover:text-accent"
              aria-label="ZEVREN on LinkedIn"
            >
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor" aria-hidden="true">
                <path d="M6.94 8.5H3.56V20h3.38V8.5ZM5.25 3.5a1.96 1.96 0 1 0 0 3.92 1.96 1.96 0 0 0 0-3.92ZM20.44 20h-3.37v-5.6c0-1.34-.03-3.06-1.87-3.06-1.87 0-2.16 1.46-2.16 2.96V20H9.68V8.5h3.24v1.57h.05c.45-.85 1.56-1.75 3.2-1.75 3.42 0 4.05 2.25 4.05 5.18V20Z" />
              </svg>
            </a>
          </div>
        </div>

        <nav aria-label="Page navigation" className="flex flex-col gap-3">
          <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-white">
            {dict.navigationHeading}
          </span>
          {NAV_LINKS.filter((link) => link.href !== "/").map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm text-muted transition-colors hover:text-white"
            >
              {link.key ? navDict[link.key] : link.label}
            </Link>
          ))}
        </nav>

        <nav aria-label={dict.servicesHeading} className="flex flex-col gap-3">
          <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-white">
            {dict.servicesHeading}
          </span>
          {SERVICES.map((service) => (
            <Link
              key={service.slug}
              href={`/services#${service.slug}`}
              className="text-sm text-muted transition-colors hover:text-white"
            >
              {servicesDict.list[service.slug].title}
            </Link>
          ))}
          {/* Dutch on purpose in every locale: the anchor text is the Dutch
              search phrase the local landing pages target. */}
          <Link
            href="/website-laten-maken"
            className="text-sm text-muted transition-colors hover:text-white"
          >
            Website laten maken
          </Link>
          <Link
            href="/webshop-laten-maken"
            className="text-sm text-muted transition-colors hover:text-white"
          >
            Webshop laten maken
          </Link>
          <Link
            href="/webapplicatie-laten-maken"
            className="text-sm text-muted transition-colors hover:text-white"
          >
            Webapplicatie laten maken
          </Link>
        </nav>

        <nav aria-label={dict.projectsHeading} className="flex flex-col gap-3">
          <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-white">
            {dict.projectsHeading}
          </span>
          {WORK_ITEMS.map((item) => (
            <Link
              key={item.slug}
              href={`/projects/${item.slug}`}
              className="text-sm text-muted transition-colors hover:text-white"
            >
              {item.name}
              <span className="text-muted/60"> ({workDict.concept})</span>
            </Link>
          ))}
        </nav>

        <div className="flex flex-col gap-3">
          <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-white">
            {dict.contactHeading}
          </span>
          <a
            href={`mailto:${SITE_CONFIG.email}`}
            className="text-sm text-muted transition-colors hover:text-white"
          >
            {SITE_CONFIG.email}
          </a>
          <a
            href={`tel:${SITE_CONFIG.phone}`}
            className="text-sm text-muted transition-colors hover:text-white"
          >
            {SITE_CONFIG.phoneDisplay}
          </a>
          <address className="text-sm not-italic leading-relaxed text-muted">
            {SITE_CONFIG.address.city}
            <br />
            {SITE_CONFIG.address.country}
          </address>
        </div>

        <div className="flex flex-col gap-3">
          <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-white">
            {dict.companyHeading}
          </span>
          {FOOTER_LEGAL_LINKS.map((link, index) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm text-muted transition-colors hover:text-white"
            >
              {dict[LEGAL_LABEL_KEYS[index]!]}
            </Link>
          ))}
          <span className="pt-2 text-xs text-muted">
            KvK {SITE_CONFIG.kvk} · VAT {SITE_CONFIG.btw}
          </span>
        </div>
      </div>

      <div className="relative border-t border-white/10">
        <div className="container-page flex flex-col items-center justify-between gap-2 py-6 text-center text-xs text-muted sm:flex-row sm:text-start">
          <span>
            &copy; {year} {SITE_CONFIG.legalName}. {dict.allRightsReserved}
          </span>
          <span>{dict.languagesHeading}</span>
          <span>{dict.builtIn}</span>
        </div>
      </div>
    </footer>
  );
}
