import { z } from "zod";
import type { NextRequest } from "next/server";

import { attemptLogin } from "@/lib/server/admin-auth";
import { verifyCsrf } from "@/lib/server/csrf";
import { databaseConfigured } from "@/lib/server/db";
import { fail, isSameOrigin, methodNotAllowed, ok, readJson, withErrorHandling } from "@/lib/server/http";
import { createSession, pruneExpiredSessions } from "@/lib/server/session";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const loginSchema = z
  .object({
    email: z.string().trim().email().max(200),
    password: z.string().min(1).max(200),
    csrfToken: z.string().max(200).optional(),
  })
  .strict();

export const POST = withErrorHandling("admin.login", async (request: NextRequest) => {
  if (!isSameOrigin(request)) return fail(403, "forbidden", "Request blocked.");
  if (!databaseConfigured()) return fail(503, "unavailable", "Sign-in is unavailable.");

  const body = await readJson(request, 8 * 1024);
  if (body === null) return fail(400, "invalid_body", "Invalid request.");
  if (!(await verifyCsrf(request, body))) {
    return fail(403, "csrf", "Your session expired. Please reload the page and try again.");
  }

  const parsed = loginSchema.safeParse(body);
  // Deliberately one generic message: a field-level error would confirm which
  // half of the credentials was wrong.
  if (!parsed.success) return fail(400, "invalid_credentials", "Invalid email or password.");

  const outcome = await attemptLogin(request, parsed.data.email, parsed.data.password);

  if (!outcome.ok) {
    if (outcome.reason === "locked") {
      return fail(429, "locked", "Too many attempts. Please try again later.", {
        retryAfter: outcome.retryAfterSeconds,
      });
    }
    return fail(401, "invalid_credentials", "Invalid email or password.");
  }

  // New session id on every successful login: an attacker who fixed a session
  // value before sign-in does not end up holding an authenticated one.
  await createSession(request, outcome.userId!);
  void pruneExpiredSessions();

  return ok({ message: "Signed in." });
});

export const GET = async () => methodNotAllowed("POST");
export const PUT = GET;
export const PATCH = GET;
export const DELETE = GET;
export const OPTIONS = GET;
