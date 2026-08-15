"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  LOCALES,
  LOCALE_LABELS,
  LOCALE_NAMES,
  LOCALE_COOKIE,
  type Locale,
} from "@/lib/i18n/config";

export function LanguageSwitcher({ locale }: { locale: Locale }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    if (!open) return;
    function handleClick(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open]);

  function selectLocale(next: Locale) {
    document.cookie = `${LOCALE_COOKIE}=${next}; path=/; max-age=31536000; SameSite=Lax`;
    setOpen(false);
    router.refresh();
  }

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        aria-expanded={open}
        aria-haspopup="listbox"
        aria-label="Change language"
        className="flex items-center gap-1.5 rounded-full border border-white/10 px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-muted transition-colors hover:border-accent/50 hover:text-white"
      >
        {LOCALE_LABELS[locale]}
        <svg viewBox="0 0 20 20" className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth={2}>
          <path d="m5 8 5 5 5-5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
      {open && (
        <div
          role="listbox"
          className="absolute end-0 z-50 mt-2 w-40 overflow-hidden rounded-xl border border-white/10 bg-navy shadow-card"
        >
          {LOCALES.map((code) => (
            <button
              key={code}
              type="button"
              role="option"
              aria-selected={code === locale}
              onClick={() => selectLocale(code)}
              className={`flex w-full items-center justify-between px-4 py-2.5 text-start text-sm transition-colors hover:bg-white/5 ${
                code === locale ? "text-white" : "text-muted"
              }`}
            >
              {LOCALE_NAMES[code]}
              <span className="text-xs uppercase tracking-wider text-muted">
                {LOCALE_LABELS[code]}
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
