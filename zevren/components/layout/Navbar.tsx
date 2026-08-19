"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { NAV_LINKS, SITE_CONFIG } from "@/lib/constants";
import { ArrowButton } from "@/components/ui/ArrowButton";
import { Icon } from "@/components/ui/Icon";
import { LanguageSwitcher } from "@/components/layout/LanguageSwitcher";
import { Wordmark } from "@/components/layout/Wordmark";
import type { Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/dictionary-type";

interface NavbarProps {
  locale: Locale;
  dict: Dictionary["nav"];
}

export function Navbar({ locale, dict }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isOpen]);

  return (
    <>
    <header
      className={`sticky top-0 z-50 w-full border-b transition-colors duration-300 ${
        isScrolled
          ? "border-white/10 bg-navy/85 backdrop-blur-md"
          : "border-transparent bg-transparent"
      }`}
    >
      <div className="container-page flex h-20 items-center justify-between">
        <Link href="/" className="group -my-2 flex items-center py-2">
          <Wordmark discipline={dict.discipline} priority />
        </Link>

        <nav
          aria-label="Main navigation"
          className="hidden items-center gap-7 lg:flex"
        >
          {NAV_LINKS.map((link) => {
            const isActive =
              link.href === "/" ? pathname === "/" : pathname.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                aria-current={isActive ? "page" : undefined}
                className={`relative py-1 text-[11px] font-semibold uppercase tracking-[0.16em] transition-colors duration-200 ${
                  isActive ? "text-accent" : "text-white/70 hover:text-white"
                }`}
              >
                {link.key ? dict[link.key] : link.label}
                {/* Underline marks the current section. It grows from the
                    centre on hover so the whole item reads as one target. */}
                <span
                  aria-hidden="true"
                  className={`absolute -bottom-1.5 left-0 h-px w-full origin-center bg-accent shadow-[0_0_8px_rgba(96,165,250,0.8)] transition-transform duration-300 ${
                    isActive ? "scale-x-100" : "scale-x-0"
                  }`}
                />
              </Link>
            );
          })}
        </nav>

        <div className="hidden items-center gap-4 lg:flex">
          <LanguageSwitcher locale={locale} />
          <ArrowButton href="/contact" variant="outline" className="px-5 py-3">
            {dict.startProject}
          </ArrowButton>
        </div>

        <button
          type="button"
          onClick={() => setIsOpen((prev) => !prev)}
          aria-expanded={isOpen}
          aria-controls="mobile-menu"
          aria-label={isOpen ? "Close menu" : "Open menu"}
          className="-me-1 flex h-11 w-11 items-center justify-center rounded-lg text-white lg:hidden"
        >
          <span className="relative flex h-4 w-6 flex-col justify-between">
            <span
              className={`h-0.5 w-full bg-white transition-transform duration-200 ${
                isOpen ? "translate-y-[7px] rotate-45" : ""
              }`}
            />
            <span
              className={`h-0.5 w-full bg-white transition-opacity duration-200 ${
                isOpen ? "opacity-0" : "opacity-100"
              }`}
            />
            <span
              className={`h-0.5 w-full bg-white transition-transform duration-200 ${
                isOpen ? "-translate-y-[7px] -rotate-45" : ""
              }`}
            />
          </span>
        </button>
      </div>
    </header>

      {/* Full-height overlay rather than a collapsing strip: with six items,
          a CTA, the language switcher and the social row, an accordion left
          half the menu below the fold on a short phone.

          A sibling of the header, not a child: once the header picks up
          backdrop-blur on scroll it becomes the containing block for fixed
          descendants on iOS Safari, and the "viewport" overlay was suddenly
          positioned against an 80px-tall bar instead of the screen. */}
      <div
        id="mobile-menu"
        className={`fixed inset-x-0 bottom-0 top-20 z-40 flex flex-col overflow-y-auto bg-navy transition-[opacity,transform] duration-300 ease-out lg:hidden ${
          isOpen
            ? "translate-y-0 opacity-100"
            : "pointer-events-none -translate-y-2 opacity-0"
        }`}
        // Not just aria-hidden: that hides the menu from assistive tech while
        // leaving its links focusable, so tabbing landed inside a menu nobody
        // could see. inert takes them out of the tab order too.
        inert={!isOpen}
      >
        <nav
          aria-label="Mobile navigation"
          className="container-page flex flex-1 flex-col gap-1 py-6"
        >
          {NAV_LINKS.map((link) => {
            const isActive =
              link.href === "/" ? pathname === "/" : pathname.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                tabIndex={isOpen ? undefined : -1}
                aria-current={isActive ? "page" : undefined}
                className={`flex items-center gap-4 border-b border-white/[0.07] px-1 py-4 text-sm font-semibold uppercase tracking-[0.12em] transition-colors ${
                  isActive ? "text-accent" : "text-white hover:text-accent"
                }`}
              >
                {link.icon && (
                  <span className={isActive ? "text-accent" : "text-muted"}>
                    <Icon name={link.icon} className="h-5 w-5" />
                  </span>
                )}
                {link.key ? dict[link.key] : link.label}
                <svg
                  viewBox="0 0 16 16"
                  aria-hidden="true"
                  className="ms-auto h-3.5 w-3.5 text-muted/60"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={1.8}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M6 3l5 5-5 5" />
                </svg>
              </Link>
            );
          })}

          <div className="mt-8 flex flex-col gap-5">
            <ArrowButton
              href="/contact"
              className="w-full justify-between"
            >
              {dict.startProject}
            </ArrowButton>

            <div className="flex items-center justify-between gap-4">
              <LanguageSwitcher locale={locale} />
              <a
                href={`tel:${SITE_CONFIG.phone}`}
                tabIndex={isOpen ? undefined : -1}
                className="text-sm text-muted transition-colors hover:text-white"
              >
                {dict.orCall} {SITE_CONFIG.phoneDisplay}
              </a>
            </div>

            <div className="flex items-center gap-3">
              {/* Only the accounts that actually exist. Placeholder icons for
                  networks ZEVREN is not on would be links to nowhere. */}
              <a
                href={SITE_CONFIG.social.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                tabIndex={isOpen ? undefined : -1}
                className="flex h-11 w-11 items-center justify-center rounded-lg border border-white/10 text-muted transition-colors hover:border-accent/50 hover:text-accent"
                aria-label="ZEVREN on LinkedIn"
              >
                <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor" aria-hidden="true">
                  <path d="M6.94 8.5H3.56V20h3.38V8.5ZM5.25 3.5a1.96 1.96 0 1 0 0 3.92 1.96 1.96 0 0 0 0-3.92ZM20.44 20h-3.37v-5.6c0-1.34-.03-3.06-1.87-3.06-1.87 0-2.16 1.46-2.16 2.96V20H9.68V8.5h3.24v1.57h.05c.45-.85 1.56-1.75 3.2-1.75 3.42 0 4.05 2.25 4.05 5.18V20Z" />
                </svg>
              </a>
              <a
                href={`mailto:${SITE_CONFIG.email}`}
                tabIndex={isOpen ? undefined : -1}
                className="flex h-11 w-11 items-center justify-center rounded-lg border border-white/10 text-muted transition-colors hover:border-accent/50 hover:text-accent"
                aria-label={SITE_CONFIG.email}
              >
                <Icon name="mail" className="h-5 w-5" />
              </a>
            </div>

            <p className="pt-4 text-[10px] uppercase tracking-[0.16em] text-muted/70">
              &copy; {new Date().getFullYear()} {SITE_CONFIG.legalName}
              <span className="block pt-1">{dict.madeIn}</span>
            </p>
          </div>
        </nav>
      </div>
    </>
  );
}
