import Image from "next/image";
import Link from "next/link";
import { FOOTER_LEGAL_LINKS, NAV_LINKS, SITE_CONFIG } from "@/lib/constants";
import type { Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/dictionary-type";

const NAV_LABEL_KEYS = ["work", "services", "about", "contact"] as const;
const LEGAL_LABEL_KEYS = ["privacyPolicy", "termsAndConditions"] as const;

interface FooterProps {
  locale: Locale;
  dict: Dictionary["footer"];
  navDict: Dictionary["nav"];
}

export function Footer({ dict, navDict }: FooterProps) {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-white/10 bg-surface/40">
      <div className="container-page grid gap-12 py-16 lg:grid-cols-[1.2fr_1fr_1fr_1fr]">
        <div className="flex flex-col gap-4">
          <Link href="/" className="flex items-center gap-2.5">
            <Image
              src="/logo-mark.png"
              alt=""
              width={32}
              height={29}
              className="h-8 w-auto drop-shadow-[0_0_10px_rgba(37,99,235,0.55)]"
            />
            <span className="font-logo text-xl font-bold tracking-wide text-white">
              ZEVREN
            </span>
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
          <span className="text-sm font-semibold text-white">{dict.navigationHeading}</span>
          {NAV_LINKS.map((link, index) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm text-muted transition-colors hover:text-white"
            >
              {navDict[NAV_LABEL_KEYS[index]!]}
            </Link>
          ))}
        </nav>

        <div className="flex flex-col gap-3">
          <span className="text-sm font-semibold text-white">{dict.contactHeading}</span>
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
          <span className="text-sm font-semibold text-white">{dict.companyHeading}</span>
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

      <div className="border-t border-white/10">
        <div className="container-page flex flex-col items-center justify-between gap-2 py-6 text-xs text-muted sm:flex-row">
          <span>
            &copy; {year} {SITE_CONFIG.legalName}. {dict.allRightsReserved}
          </span>
          <span>{dict.builtIn}</span>
        </div>
      </div>
    </footer>
  );
}
