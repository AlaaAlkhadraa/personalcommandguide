import type { Metadata } from "next";
import { SITE_CONFIG } from "@/lib/constants";
import type { Locale } from "@/lib/i18n/config";

/** Open Graph wants a full locale, not the bare language code. */
export const OG_LOCALE: Record<Locale, string> = {
  en: "en_GB",
  nl: "nl_NL",
  de: "de_DE",
  fr: "fr_FR",
  es: "es_ES",
  ar: "ar_AR",
};

interface BuildMetadataOptions {
  title: string;
  description: string;
  path: string;
  noIndex?: boolean;
  /** The language actually being served, reported to Open Graph. */
  locale?: Locale;
  /** Set on article pages: switches og:type and carries the publish date. */
  article?: { publishedTime: string };
  /**
   * Pages that exist in one language only (the Dutch landing cluster, the
   * legal texts): no /en twin is announced and the canonical stays bare.
   */
  singleLocale?: boolean;
}

/**
 * The address of a page in a given language. Dutch lives at the root and is
 * what a cookieless crawler gets; English has its own /en prefix (see
 * middleware.ts). The other languages are cookie-only and have no address of
 * their own, so they canonicalise to the Dutch page.
 */
export function localizedUrl(path: string, locale: Locale | undefined): string {
  const base = SITE_CONFIG.url;
  if (locale === "en") return path === "/" ? `${base}/en` : `${base}/en${path}`;
  return path === "/" ? base : `${base}${path}`;
}

/**
 * Breadcrumb JSON-LD for a page. Home is always the first crumb; the rest
 * follow in the order given. Google shows these as the path under a search
 * result instead of the bare URL.
 */
export function breadcrumbJsonLd(
  homeName: string,
  items: Array<{ name: string; path: string }>,
  locale?: Locale
) {
  // On the English address space the crumbs point at /en/... too, so the
  // structured data names the same URLs as the canonical.
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: homeName, item: localizedUrl("/", locale) },
      ...items.map((item, index) => ({
        "@type": "ListItem",
        position: index + 2,
        name: item.name,
        item: localizedUrl(item.path, locale),
      })),
    ],
  };
}

/**
 * Google shows roughly 155 to 160 characters of a description and cuts the
 * rest mid-word. A longer text is trimmed here at the last full sentence
 * that fits, so what appears under the result reads as a whole thought.
 */
export function clampDescription(text: string): string {
  if (text.length <= 160) return text;
  const cut = text.slice(0, 158);
  const sentenceEnd = Math.max(cut.lastIndexOf(". "), cut.lastIndexOf("! "), cut.lastIndexOf("? "));
  if (sentenceEnd >= 90) return cut.slice(0, sentenceEnd + 1);
  return `${cut.slice(0, cut.lastIndexOf(" "))}…`;
}

export function buildMetadata({
  title,
  description: rawDescription,
  path,
  noIndex = false,
  locale,
  article,
  singleLocale = false,
}: BuildMetadataOptions): Metadata {
  const description = clampDescription(rawDescription);
  // The canonical follows the language: an English page, whether reached by
  // its /en address or by cookie, points at its /en address. Single-language
  // pages and the cookie-only languages canonicalise to the Dutch root URL.
  const url = singleLocale ? `${SITE_CONFIG.url}${path}` : localizedUrl(path, locale);
  const languages = singleLocale
    ? undefined
    : {
        nl: localizedUrl(path, "nl"),
        en: localizedUrl(path, "en"),
        "x-default": localizedUrl(path, "nl"),
      };
  const isHome = path === "/";
  // Open Graph/Twitter cards never inherit the root layout's title
  // template, so they need the " | ZEVREN" suffix spelled out here. The
  // document <title> must NOT repeat it — the root layout's title.template
  // already appends "| ZEVREN" to any plain string title, so passing the
  // suffixed string through as well produced "Services | ZEVREN | ZEVREN".
  // The home page wants a bespoke full title with no suffix at all, which
  // { absolute } achieves by opting out of the template entirely.
  const fullTitle = isHome ? title : `${title} | ${SITE_CONFIG.name}`;

  return {
    title: isHome ? { absolute: title } : title,
    description,
    alternates: {
      canonical: url,
      languages,
    },
    robots: noIndex
      ? { index: false, follow: false }
      : { index: true, follow: true },
    openGraph: article
      ? {
          title: fullTitle,
          description,
          url,
          siteName: SITE_CONFIG.name,
          locale: locale ? OG_LOCALE[locale] : undefined,
          type: "article",
          publishedTime: article.publishedTime,
        }
      : {
          title: fullTitle,
          description,
          url,
          siteName: SITE_CONFIG.name,
          locale: locale ? OG_LOCALE[locale] : undefined,
          type: "website",
        },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
    },
  };
}
