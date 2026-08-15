"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { NAV_LINKS, SITE_CONFIG } from "@/lib/constants";
import { Button } from "@/components/ui/Button";

export function Navbar() {
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
    <header
      className={`sticky top-0 z-50 w-full border-b transition-colors duration-300 ${
        isScrolled
          ? "border-white/10 bg-navy/85 backdrop-blur-md"
          : "border-transparent bg-transparent"
      }`}
    >
      <div className="container-page flex h-20 items-center justify-between">
        <Link
          href="/"
          className="group flex items-center gap-2.5 py-2 -my-2"
        >
          <Image
            src="/logo-mark.png"
            alt=""
            width={32}
            height={29}
            priority
            className="h-8 w-auto drop-shadow-[0_0_10px_rgba(37,99,235,0.55)] transition-[filter] duration-300 group-hover:drop-shadow-[0_0_14px_rgba(96,165,250,0.7)]"
          />
          <span className="font-logo text-xl font-bold tracking-wide text-white">
            ZEVREN
          </span>
        </Link>

        <nav
          aria-label="Main navigation"
          className="hidden items-center gap-8 lg:flex"
        >
          {NAV_LINKS.map((link) => {
            const isActive =
              link.href === "/" ? pathname === "/" : pathname.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                aria-current={isActive ? "page" : undefined}
                className={`text-sm font-medium transition-colors duration-200 ${
                  isActive ? "text-white" : "text-muted hover:text-white"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="hidden lg:block">
          <Button href="/contact" className="text-sm">
            Start a project
          </Button>
        </div>

        <button
          type="button"
          onClick={() => setIsOpen((prev) => !prev)}
          aria-expanded={isOpen}
          aria-controls="mobile-menu"
          aria-label={isOpen ? "Close menu" : "Open menu"}
          className="-mr-1 flex h-11 w-11 items-center justify-center rounded-lg text-white lg:hidden"
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

      <div
        id="mobile-menu"
        className={`grid overflow-hidden border-t border-white/10 bg-navy transition-[grid-template-rows] duration-300 ease-in-out lg:hidden ${
          isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr] border-t-0"
        }`}
      >
        <div className="overflow-hidden">
          <nav
            aria-label="Mobile navigation"
            className="container-page flex flex-col gap-1 py-4"
          >
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="rounded-lg px-3 py-3 text-base font-medium text-white/90 transition-colors hover:bg-white/5"
              >
                {link.label}
              </Link>
            ))}
            <div className="mt-2 flex flex-col gap-3 py-2">
              <Button href="/contact">Start a project</Button>
              <a
                href={`tel:${SITE_CONFIG.phone}`}
                className="text-center text-sm text-muted hover:text-white"
              >
                or call {SITE_CONFIG.phoneDisplay}
              </a>
            </div>
          </nav>
        </div>
      </div>
    </header>
  );
}
