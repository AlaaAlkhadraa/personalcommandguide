export const LOCALES = ["en", "nl", "de", "fr", "es", "ar"] as const;
export type Locale = (typeof LOCALES)[number];

/**
 * Dutch, not English. Googlebot arrives without the language cookie, so
 * whatever this says is the version that gets crawled, indexed and shown in
 * search results. The site sells to businesses in the Netherlands, so a Dutch
 * title and description in front of a Dutch searcher is worth more than an
 * English one.
 */
export const DEFAULT_LOCALE: Locale = "nl";

export const LOCALE_LABELS: Record<Locale, string> = {
  en: "EN",
  nl: "NL",
  de: "DE",
  fr: "FR",
  es: "ES",
  ar: "AR",
};

export const LOCALE_NAMES: Record<Locale, string> = {
  en: "English",
  nl: "Nederlands",
  de: "Deutsch",
  fr: "Français",
  es: "Español",
  ar: "العربية",
};

export const RTL_LOCALES: Locale[] = ["ar"];

export function isRtl(locale: Locale): boolean {
  return RTL_LOCALES.includes(locale);
}

export function isValidLocale(value: string): value is Locale {
  return (LOCALES as readonly string[]).includes(value);
}

export const LOCALE_COOKIE = "zevren_locale";
