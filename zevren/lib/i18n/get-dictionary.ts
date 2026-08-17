import type { Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/dictionary-type";
import en from "@/lib/i18n/dictionaries/en";
import nl from "@/lib/i18n/dictionaries/nl";
import de from "@/lib/i18n/dictionaries/de";
import fr from "@/lib/i18n/dictionaries/fr";
import es from "@/lib/i18n/dictionaries/es";
import ar from "@/lib/i18n/dictionaries/ar";

const dictionaries: Record<Locale, Dictionary> = { en, nl, de, fr, es, ar };

export function getDictionary(locale: Locale): Dictionary {
  return dictionaries[locale];
}
