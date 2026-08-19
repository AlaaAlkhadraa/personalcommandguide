import "server-only";

import { env } from "@/lib/server/env";
import { logError, logEvent } from "@/lib/server/http";

/**
 * Transactional email through Resend's HTTP API.
 *
 * SSRF note: the destination is a compile-time constant and the recipient is
 * read from the environment. No part of a request body ever influences which
 * host is contacted or which address is mailed, so a submission cannot be used
 * to make the server talk to an attacker-chosen endpoint or to relay mail.
 */

const RESEND_ENDPOINT = "https://api.resend.com/emails";

export interface MailResult {
  sent: boolean;
  error?: string;
}

/** Strips anything that could smuggle extra headers into a subject line. */
function sanitizeHeaderValue(value: string, max = 200): string {
  return value.replace(/[\r\n\t]+/g, " ").slice(0, max).trim();
}

/**
 * Escapes text for inclusion in an HTML email body. The notification is sent
 * as plain text, but the subject and reply-to still pass through the checks
 * above, and this keeps the door shut if a body is ever added.
 */
export function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export function mailConfigured(): boolean {
  const e = env();
  return Boolean(e.RESEND_API_KEY && e.CONTACT_INBOX_EMAIL);
}

export async function sendNotification(options: {
  subject: string;
  text: string;
  replyTo?: string;
}): Promise<MailResult> {
  const e = env();

  if (!mailConfigured()) {
    // Not an error: the submission is already persisted, so nothing is lost.
    // The admin area is the source of truth either way.
    logEvent("mail.skipped", { reason: "not_configured" });
    return { sent: false, error: "mail_not_configured" };
  }

  const payload: Record<string, unknown> = {
    from: e.MAIL_FROM,
    to: [e.CONTACT_INBOX_EMAIL],
    subject: sanitizeHeaderValue(options.subject),
    text: options.text.slice(0, 20_000),
  };

  // Only set reply-to for an address that already passed schema validation and
  // contains nothing that could break out of the header.
  if (options.replyTo && /^[^\s@<>"',;\r\n]+@[^\s@<>"',;\r\n]+\.[a-z]{2,}$/i.test(options.replyTo)) {
    payload.reply_to = options.replyTo;
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 8000);

  try {
    const response = await fetch(RESEND_ENDPOINT, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${e.RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
      signal: controller.signal,
      // Never follow a redirect: it would be a way to send the bearer token
      // somewhere other than the intended host.
      redirect: "error",
      cache: "no-store",
    });

    if (!response.ok) {
      // Resend explains itself in the body: an unverified sending domain, a
      // revoked key, a rejected recipient. Throwing that away and keeping only
      // the status code is what made this impossible to diagnose, so the
      // message is carried through. It contains no credential.
      let detail = "";
      try {
        const body = (await response.text()).slice(0, 300);
        const parsed: unknown = JSON.parse(body);
        detail =
          typeof parsed === "object" && parsed !== null && "message" in parsed
            ? String((parsed as { message: unknown }).message)
            : body;
      } catch {
        // Body was not JSON or could not be read; the status still says something.
      }
      logError("mail.rejected", new Error(`status ${response.status}: ${detail}`));
      return {
        sent: false,
        error: detail ? `${response.status}: ${detail}` : `provider_status_${response.status}`,
      };
    }

    logEvent("mail.sent");
    return { sent: true };
  } catch (error) {
    logError("mail.failed", error);
    return { sent: false, error: "provider_unreachable" };
  } finally {
    clearTimeout(timeout);
  }
}
