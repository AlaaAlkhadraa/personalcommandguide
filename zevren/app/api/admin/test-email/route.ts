import type { NextRequest } from "next/server";

import { verifyCsrf } from "@/lib/server/csrf";
import {
  fail,
  isSameOrigin,
  methodNotAllowed,
  ok,
  readJson,
  withErrorHandling,
} from "@/lib/server/http";
import { mailConfigured, sendNotification } from "@/lib/server/mail";
import { getSessionUserFromHeaders } from "@/lib/server/session";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Sends one notification to the configured inbox and reports exactly what the
 * mail provider said.
 *
 * Diagnosing "no email arrives" otherwise means submitting the public form,
 * waiting, and reading server logs. This closes that loop to a single click:
 * the provider's own refusal, an unverified sending domain or a revoked key,
 * comes straight back to the screen.
 */
export const POST = withErrorHandling("admin.test-email", async (request: NextRequest) => {
  if (!isSameOrigin(request)) return fail(403, "forbidden", "Request blocked.");

  const user = await getSessionUserFromHeaders();
  if (!user || user.role !== "admin") {
    return fail(401, "unauthorized", "Sign in first.");
  }

  const body = await readJson(request, 4 * 1024);
  if (!(await verifyCsrf(request, body ?? undefined))) {
    return fail(403, "csrf", "Please reload the page and try again.");
  }

  if (!mailConfigured()) {
    return ok({
      sent: false,
      detail:
        "Mail is not configured. RESEND_API_KEY or CONTACT_INBOX_EMAIL is missing in this deployment.",
    });
  }

  const result = await sendNotification({
    subject: "ZEVREN test notification",
    text: [
      "This is a test notification sent from the ZEVREN admin panel.",
      "",
      "If this arrived, notifications for real project requests work too.",
      `Requested by: ${user.email}`,
      `Time: ${new Date().toISOString()}`,
    ].join("\n"),
  });

  return ok({
    sent: result.sent,
    detail: result.sent ? "Sent. Check the inbox, including the spam folder." : result.error,
  });
});

export const GET = async () => methodNotAllowed("POST");
export const PUT = GET;
export const PATCH = GET;
export const DELETE = GET;
export const OPTIONS = GET;
