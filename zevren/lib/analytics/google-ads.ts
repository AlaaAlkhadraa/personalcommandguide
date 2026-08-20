/**
 * Google Ads conversion tracking, as configuration rather than a hard-coded id.
 *
 * Both values are public by nature: they end up in the page source of every
 * site that advertises, and knowing them lets nobody write to the account.
 * They live in environment variables anyway so that a preview deployment or a
 * local run does not report test submissions as real leads.
 *
 * With neither set, every export here reports "off" and the tag is never
 * loaded, so the site behaves exactly as it did before this file existed.
 */

/** Measurement id of the Google tag, e.g. "AW-18398797818". */
export const GOOGLE_ADS_ID = process.env.NEXT_PUBLIC_GOOGLE_ADS_ID ?? "";

/** Conversion label of the lead action, e.g. "AbC-D_efGh12". */
export const GOOGLE_ADS_LEAD_LABEL = process.env.NEXT_PUBLIC_GOOGLE_ADS_LEAD_LABEL ?? "";

/** Whether the tag should be loaded at all. */
export function adsConfigured(): boolean {
  return GOOGLE_ADS_ID.startsWith("AW-");
}

/**
 * The `send_to` value for the lead conversion, or null when the label is
 * missing. Returning null rather than a half-formed string keeps a
 * misconfigured deployment from reporting conversions against the account
 * default, which would be counted but attributed to nothing.
 */
export function leadSendTo(): string | null {
  if (!adsConfigured() || !GOOGLE_ADS_LEAD_LABEL) return null;
  return `${GOOGLE_ADS_ID}/${GOOGLE_ADS_LEAD_LABEL}`;
}
