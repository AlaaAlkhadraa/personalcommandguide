import Link from "next/link";
import { FOOTER_LEGAL_LINKS, NAV_LINKS, SITE_CONFIG } from "@/lib/constants";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-white/10 bg-surface/40">
      <div className="container-page grid gap-12 py-16 lg:grid-cols-[1.2fr_1fr_1fr_1fr]">
        <div className="flex flex-col gap-4">
          <Link
            href="/"
            className="font-logo text-xl font-bold tracking-wide text-white"
          >
            ZEVREN
          </Link>
          <p className="max-w-sm text-sm leading-relaxed text-muted">
            {SITE_CONFIG.description}
          </p>
          <div className="flex gap-4 pt-2">
            <a
              href={SITE_CONFIG.social.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted transition-colors hover:text-accent"
              aria-label="ZEVREN op LinkedIn"
            >
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor" aria-hidden="true">
                <path d="M6.94 8.5H3.56V20h3.38V8.5ZM5.25 3.5a1.96 1.96 0 1 0 0 3.92 1.96 1.96 0 0 0 0-3.92ZM20.44 20h-3.37v-5.6c0-1.34-.03-3.06-1.87-3.06-1.87 0-2.16 1.46-2.16 2.96V20H9.68V8.5h3.24v1.57h.05c.45-.85 1.56-1.75 3.2-1.75 3.42 0 4.05 2.25 4.05 5.18V20Z" />
              </svg>
            </a>
            <a
              href={SITE_CONFIG.social.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted transition-colors hover:text-accent"
              aria-label="ZEVREN op Instagram"
            >
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor" aria-hidden="true">
                <path d="M12 2c2.72 0 3.06.01 4.12.06 1.06.05 1.79.22 2.43.47.66.26 1.22.6 1.77 1.15.55.55.9 1.11 1.15 1.77.25.64.42 1.37.47 2.43.05 1.06.06 1.4.06 4.12s-.01 3.06-.06 4.12c-.05 1.06-.22 1.79-.47 2.43a4.9 4.9 0 0 1-1.15 1.77 4.9 4.9 0 0 1-1.77 1.15c-.64.25-1.37.42-2.43.47-1.06.05-1.4.06-4.12.06s-3.06-.01-4.12-.06c-1.06-.05-1.79-.22-2.43-.47a4.9 4.9 0 0 1-1.77-1.15 4.9 4.9 0 0 1-1.15-1.77c-.25-.64-.42-1.37-.47-2.43C2.01 15.06 2 14.72 2 12s.01-3.06.06-4.12c.05-1.06.22-1.79.47-2.43.26-.66.6-1.22 1.15-1.77A4.9 4.9 0 0 1 5.45.53c.64-.25 1.37-.42 2.43-.47C8.94.01 9.28 0 12 0Zm0 5a5 5 0 1 0 0 10 5 5 0 0 0 0-10Zm0 8.2a3.2 3.2 0 1 1 0-6.4 3.2 3.2 0 0 1 0 6.4Zm5.2-8.4a1.17 1.17 0 1 1-2.34 0 1.17 1.17 0 0 1 2.34 0Z" />
              </svg>
            </a>
          </div>
        </div>

        <nav aria-label="Paginanavigatie" className="flex flex-col gap-3">
          <span className="text-sm font-semibold text-white">Navigatie</span>
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm text-muted transition-colors hover:text-white"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex flex-col gap-3">
          <span className="text-sm font-semibold text-white">Contact</span>
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
            {SITE_CONFIG.address.street}
            <br />
            {SITE_CONFIG.address.postalCode} {SITE_CONFIG.address.city}
            <br />
            {SITE_CONFIG.address.country}
          </address>
        </div>

        <div className="flex flex-col gap-3">
          <span className="text-sm font-semibold text-white">Bedrijf</span>
          {FOOTER_LEGAL_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm text-muted transition-colors hover:text-white"
            >
              {link.label}
            </Link>
          ))}
          <span className="pt-2 text-xs text-muted">
            KvK {SITE_CONFIG.kvk} · BTW {SITE_CONFIG.btw}
          </span>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="container-page flex flex-col items-center justify-between gap-2 py-6 text-xs text-muted sm:flex-row">
          <span>
            &copy; {year} {SITE_CONFIG.legalName}. Alle rechten voorbehouden.
          </span>
          <span>Gebouwd in Amsterdam.</span>
        </div>
      </div>
    </footer>
  );
}
