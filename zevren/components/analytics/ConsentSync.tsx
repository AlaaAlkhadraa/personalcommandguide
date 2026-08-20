"use client";

import { useEffect } from "react";

import { CONSENT_EVENT, readConsent, type ConsentChoice } from "@/lib/consent";

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

/**
 * Carries the visitor's answer into the Google tag, both the answer given just
 * now and the one given months ago.
 *
 * Renders nothing. It exists because the denied default in GoogleTag has to be
 * plain markup that runs during parsing, while reading a cookie and listening
 * for a click are things only a client component can do.
 */
export function ConsentSync() {
  useEffect(() => {
    function apply(choice: ConsentChoice) {
      const value = choice === "granted" ? "granted" : "denied";
      window.gtag?.("consent", "update", {
        ad_storage: value,
        ad_user_data: value,
        ad_personalization: value,
        analytics_storage: value,
      });
    }

    // A choice from an earlier visit lives in the cookie, so re-apply it once
    // on mount rather than waiting for an event that will never fire.
    const existing = readConsent();
    if (existing !== "unknown") apply(existing);

    function onChoice(event: Event) {
      const detail = (event as CustomEvent<ConsentChoice>).detail;
      if (detail === "granted" || detail === "denied") apply(detail);
    }

    window.addEventListener(CONSENT_EVENT, onChoice);
    return () => window.removeEventListener(CONSENT_EVENT, onChoice);
  }, []);

  return null;
}

/**
 * Reports one lead conversion. Safe to call unconditionally: without a tag,
 * without a label, or with consent denied, it is a no-op.
 */
export function reportLeadConversion(sendTo: string | null): void {
  if (!sendTo || typeof window === "undefined" || !window.gtag) return;
  window.gtag("event", "conversion", { send_to: sendTo });
}
