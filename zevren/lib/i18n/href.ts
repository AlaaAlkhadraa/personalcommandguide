import type { Locale } from "./config";

/**
 * Pages that exist in Dutch only: the landing cluster, the concept builder
 * and the legal pages. They have no /en twin, so links to them never get the
 * prefix and the middleware sends /en/<these> back to the one real URL.
 */
export const DUTCH_ONLY_PREFIXES = [
  "/website-laten-maken",
  "/website-voor",
  "/webshop-laten-maken",
  "/webapplicatie-laten-maken",
  "/concept-bouwer",
  "/privacy-policy",
  "/terms-and-conditions",
] as const;

const OUTSIDE_PREFIXES = ["/admin", "/api", "/demo", "/en"] as const;

function underAny(path: string, prefixes: readonly string[]): boolean {
  return prefixes.some((prefix) => path === prefix || path.startsWith(`${prefix}/`));
}

export function isDutchOnlyPath(path: string): boolean {
  return underAny(path, DUTCH_ONLY_PREFIXES);
}

/**
 * The address an internal link should point at for the given language.
 * English has its own URL space (/en/...), every other language lives on
 * the Dutch URL, so only English links change. External links, anchors,
 * admin, API, demo and Dutch-only pages pass through untouched.
 */
export function localizeHref(href: string, locale: Locale | undefined): string {
  if (locale !== "en") return href;
  if (!href.startsWith("/") || href.startsWith("//")) return href;
  const end = href.search(/[?#]/);
  const path = end === -1 ? href : href.slice(0, end);
  const rest = end === -1 ? "" : href.slice(end);
  if (underAny(path, OUTSIDE_PREFIXES) || isDutchOnlyPath(path)) return href;
  return `${path === "/" ? "/en" : `/en${path}`}${rest}`;
}
