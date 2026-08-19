import "server-only";

import type { NextRequest } from "next/server";
import type { NextResponse } from "next/server";

import { verifyCsrf } from "@/lib/server/csrf";
import { databaseConfigured } from "@/lib/server/db";
import {
  fail,
  ipIdentity,
  isSameOrigin,
  logEvent,
  ok,
  readJson,
  userAgent,
} from "@/lib/server/http";
import { mailConfigured, sendNotification } from "@/lib/server/mail";
import { rateLimit, rateLimitHeaders } from "@/lib/server/rate-limit";
import {
  fingerprint,
  isDuplicate,
  markEmailed,
  recordAudit,
  storeSubmission,
  type SubmissionKind,
} from "@/lib/server/submissions";
import { MIN_FILL_MS, flattenFieldErrors, submissionSchema } from "@/lib/validations/submission";

/**
 * The shared pipeline behind both public write endpoints:
 *
 *   origin check -> rate limit -> CSRF -> schema validation -> bot heuristics
 *   -> duplicate check -> database insert -> email -> success response
 *
 * Nothing short-circuits to a success message. The 200 is returned only after
 * a row exists, so the confirmation the visitor sees corresponds to something
 * that is actually stored.
 */

const LIMIT = 5;
const WINDOW_SECONDS = 600;

export async function handlePublicSubmission(
  request: NextRequest,
  kind: SubmissionKind
): Promise<NextResponse> {
  // 1. Same-origin only. Combined with never emitting CORS headers, this
  //    keeps the endpoint unusable from another site.
  if (!isSameOrigin(request)) {
    logEvent("form.rejected", { kind, reason: "cross_origin" });
    return fail(403, "forbidden", "Request blocked.");
  }

  // 2. Rate limit before any parsing work, so a flood is cheap to refuse.
  const identity = ipIdentity(request);
  const limited = await rateLimit({
    scope: `form:${kind}`,
    identity,
    limit: LIMIT,
    windowSeconds: WINDOW_SECONDS,
  });
  if (!limited.allowed) {
    return fail(429, "rate_limited", "Too many requests. Please try again later.", {
      retryAfter: limited.retryAfterSeconds,
    });
  }

  const body = await readJson(request);
  if (body === null) {
    return fail(400, "invalid_body", "Invalid request.");
  }

  // 3. CSRF. Checked after parsing so the token may travel in the body.
  if (!(await verifyCsrf(request, body))) {
    logEvent("form.rejected", { kind, reason: "csrf" });
    return fail(403, "csrf", "Your session expired. Please reload the page and try again.");
  }

  // 4. Server-side validation. Strict schema: unknown fields are refused.
  const parsed = submissionSchema.safeParse(body);
  if (!parsed.success) {
    return fail(400, "validation", "Please check the fields below.", {
      fieldErrors: flattenFieldErrors(parsed.error),
    });
  }
  const data = parsed.data;

  // 5. Bot heuristics. The honeypot and the fill-time check both answer 200
  //    so a script cannot tell rejection from acceptance and tune itself,
  //    but nothing is written.
  const looksAutomated =
    Boolean(data.website) || (data.elapsedMs !== undefined && data.elapsedMs < MIN_FILL_MS);

  if (looksAutomated) {
    logEvent("form.spam", { kind, honeypot: Boolean(data.website) });
    return ok({ message: "Message sent." });
  }

  if (!databaseConfigured()) {
    // Refuse rather than pretend. A visitor who sees a confirmation should be
    // able to rely on it.
    logEvent("form.unavailable", { kind, reason: "no_database" });
    return fail(503, "unavailable", "We cannot accept messages right now. Please email us directly.");
  }

  const fp = fingerprint(kind, data.email, data.message);

  // 6. Duplicate suppression: report success, write once.
  if (await isDuplicate(fp)) {
    logEvent("form.duplicate", { kind });
    return ok({ message: "Message sent." });
  }

  // 7. Persist first: the row is the record of truth, email is best effort.
  let id: string;
  try {
    id = await storeSubmission({
      kind,
      data,
      fingerprint: fp,
      ipHash: identity,
      userAgent: userAgent(request),
    });
  } catch (error) {
    // Surfaced as a generic failure; the driver message stays server-side.
    logEvent("form.store_failed", { kind });
    throw error;
  }

  await recordAudit("submission.created", { ipHash: identity, detail: `${kind}:${id}` });

  // 8. Notify. A mail failure does not fail the request, because the
  //    submission is already safe; it is recorded on the row instead.
  if (!mailConfigured()) {
    // Previously this branch did nothing at all: the row was stored, the
    // visitor saw a confirmation, and the owner was never told that no
    // notification had gone out. A lead the owner never hears about is a lead
    // lost, so the reason is written to the row and logged loudly.
    logEvent("form.mail_unconfigured", { kind, id });
    await markEmailed(id, "Mail is not configured: set RESEND_API_KEY and CONTACT_INBOX_EMAIL.");
  } else {
    const result = await sendNotification({
      subject: `${kind === "project" ? "Project request" : "New enquiry"} from ${data.name}`,
      replyTo: data.email,
      text: [
        `Kind: ${kind}`,
        `Name: ${data.name}`,
        `Email: ${data.email}`,
        `Company: ${data.company || "-"}`,
        `Needs: ${data.needs || "-"}`,
        `Budget: ${data.budget || "-"}`,
        `Project information: ${data.projectInfo || "-"}`,
        `Locale: ${data.locale ?? "-"}`,
        "",
        data.message,
        "",
        `Reference: ${id}`,
      ].join("\n"),
    });
    await markEmailed(id, result.sent ? undefined : result.error);
    if (!result.sent) logEvent("form.mail_failed", { kind, id, error: result.error });
  }

  return ok({ message: "Message sent.", reference: id });
}

export const publicFormRateLimit = { LIMIT, WINDOW_SECONDS, rateLimitHeaders };
