import { cookies, headers } from "next/headers";
import { DEFAULT_LOCALE, LOCALE_COOKIE, isValidLocale, type Locale } from "@/lib/i18n/config";

/**
 * The language being served, in order of authority: the URL (middleware
 * sets x-locale for /en/... requests), then the visitor's cookie, then the
 * Dutch default a cookieless crawler gets.
 */
export async function getLocale(): Promise<Locale> {
  const fromPath = (await headers()).get("x-locale");
  if (fromPath && isValidLocale(fromPath)) {
    return fromPath;
  }
  const store = await cookies();
  const value = store.get(LOCALE_COOKIE)?.value;
  if (value && isValidLocale(value)) {
    return value;
  }
  return DEFAULT_LOCALE;
}
