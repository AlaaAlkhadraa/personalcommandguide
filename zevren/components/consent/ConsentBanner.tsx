"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { adsConfigured } from "@/lib/analytics/google-ads";
import { readConsent, writeConsent } from "@/lib/consent";
import type { Dictionary } from "@/lib/i18n/dictionary-type";

/**
 * The cookie question, asked once.
 *
 * Two things here are deliberate and easy to get wrong. Refusing is one click,
 * in a button that looks like the other one, because a refusal buried behind a
 * second screen is not a free choice and Dutch supervisors have said so. And
 * the bar does not cover the page or block scrolling: a visitor who ignores it
 * is left alone, which is the same as refusing until they say otherwise.
 *
 * It renders only when there is a tag to consent to. With no Google Ads id
 * configured, no advertising cookie can be set and asking would be theatre.
 */
export function ConsentBanner({ dict }: { dict: Dictionary["consent"] }) {
  // Starts hidden and is only shown from an effect: the server does not know
  // whether the cookie is there, and rendering the bar for everyone first
  // would flash it at people who answered months ago.
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!adsConfigured()) return;
    if (readConsent() === "unknown") setVisible(true);
  }, []);

  if (!visible) return null;

  function choose(choice: "granted" | "denied") {
    writeConsent(choice);
    setVisible(false);
  }

  return (
    <div
      role="dialog"
      aria-modal="false"
      aria-labelledby="consent-title"
      className="fixed inset-x-0 bottom-0 z-[90] p-3 sm:p-4"
    >
      <div className="mx-auto flex max-w-3xl flex-col gap-4 rounded-2xl border border-white/10 bg-surface/95 p-5 shadow-2xl backdrop-blur sm:flex-row sm:items-center sm:gap-6">
        <div className="flex flex-col gap-1.5">
          <h2 id="consent-title" className="text-sm font-semibold text-white">
            {dict.title}
          </h2>
          <p className="text-sm leading-relaxed text-muted">
            {dict.body}{" "}
            <Link
              href="/privacy-policy"
              className="text-accent underline underline-offset-2 hover:text-primary-light"
            >
              {dict.readMore}
            </Link>
          </p>
        </div>

        <div className="flex shrink-0 gap-2.5">
          <button
            type="button"
            onClick={() => choose("denied")}
            className="flex-1 whitespace-nowrap rounded-full border border-white/20 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:border-white/40 sm:flex-none"
          >
            {dict.decline}
          </button>
          <button
            type="button"
            onClick={() => choose("granted")}
            className="flex-1 whitespace-nowrap rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-primary-light sm:flex-none"
          >
            {dict.accept}
          </button>
        </div>
      </div>
    </div>
  );
}
