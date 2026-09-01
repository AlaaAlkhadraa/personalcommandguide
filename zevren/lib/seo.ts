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
}

/**
 * Breadcrumb JSON-LD for a page. Home is always the first crumb; the rest
 * follow in the order given. Google shows these as the path under a search
 * result instead of the bare URL.
 */
export function breadcrumbJsonLd(
  homeName: string,
  items: Array<{ name: string; path: string }>
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: homeName, item: SITE_CONFIG.url },
      ...items.map((item, index) => ({
        "@type": "ListItem",
        position: index + 2,
        name: item.name,
        item: `${SITE_CONFIG.url}${item.path}`,
      })),
    ],
  };
}

export function buildMetadata({
  title,
  description,
  path,
  noIndex = false,
  locale,
  article,
}: BuildMetadataOptions): Metadata {
  const url = `${SITE_CONFIG.url}${path}`;
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
