import type { Locale } from "@/lib/i18n/config";

/**
 * Legal pages as content rather than markup.
 *
 * The terms and the privacy policy are the only pages a client is asked to
 * agree to, so they have to be readable in the language the visitor picked,
 * the same as the rest of the site. Keeping them as blocks per locale means
 * one renderer serves both documents in all six languages.
 */
export type LegalBlock =
  | { type: "p"; text: string }
  | { type: "h2"; text: string }
  | { type: "h3"; text: string }
  | { type: "ul"; items: string[] };

export interface LegalDocument {
  eyebrow: string;
  title: string;
  /** Rendered above the first section, e.g. "Last updated: 19 August 2026". */
  updated: string;
  metaTitle: string;
  metaDescription: string;
  blocks: LegalBlock[];
}

export type LegalContent = Record<Locale, LegalDocument>;
