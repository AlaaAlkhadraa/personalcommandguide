/**
 * The visitor's answer to the cookie question, and nothing else.
 *
 * Dutch law (Telecommunicatiewet 11.7a) allows a cookie to be read or written
 * for advertising only after the visitor has agreed. So the answer itself has
 * to be storable without asking: it is a functional cookie, it holds one of
 * two words, and it identifies nobody.
 *
 * "unknown" is a real state, not a default that leans one way. Until the
 * visitor picks, the Google tag runs with every consent signal denied, which
 * means no cookie is written and no identifier is read.
 */

export type ConsentChoice = "granted" | "denied";
export type ConsentState = ConsentChoice | "unknown";

export const CONSENT_COOKIE = "zevren_consent";

/** Six months. Long enough not to nag, short enough to re-ask in good faith. */
const MAX_AGE_SECONDS = 60 * 60 * 24 * 183;

/** Fired on the window after a choice, so the tag reacts without a reload. */
export const CONSENT_EVENT = "zevren:consent";

export function readConsent(): ConsentState {
  if (typeof document === "undefined") return "unknown";
  const match = document.cookie.match(
    new RegExp(`(?:^|;\\s*)${CONSENT_COOKIE}=(granted|denied)(?:;|$)`)
  );
  const value = match?.[1];
  return value === "granted" || value === "denied" ? value : "unknown";
}

export function writeConsent(choice: ConsentChoice): void {
  if (typeof document === "undefined") return;
  const secure = window.location.protocol === "https:" ? "; Secure" : "";
  document.cookie =
    `${CONSENT_COOKIE}=${choice}; Path=/; Max-Age=${MAX_AGE_SECONDS}; SameSite=Lax${secure}`;
  window.dispatchEvent(new CustomEvent<ConsentChoice>(CONSENT_EVENT, { detail: choice }));
}
