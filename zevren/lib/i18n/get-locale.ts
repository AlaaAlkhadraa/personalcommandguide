import { cookies } from "next/headers";
import { DEFAULT_LOCALE, LOCALE_COOKIE, isValidLocale, type Locale } from "@/lib/i18n/config";

export async function getLocale(): Promise<Locale> {
  const store = await cookies();
  const value = store.get(LOCALE_COOKIE)?.value;
  if (value && isValidLocale(value)) {
    return value;
  }
  return DEFAULT_LOCALE;
}
