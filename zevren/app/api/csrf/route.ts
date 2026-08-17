import { issueCsrfToken } from "@/lib/server/csrf";
import { json, methodNotAllowed, withErrorHandling } from "@/lib/server/http";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Hands the browser a CSRF token and sets the paired secret cookie.
 *
 * Read-only and safe to call from any page on this origin. The token is
 * useless without the HttpOnly cookie, which another site cannot read.
 */
export const GET = withErrorHandling("csrf", async () => {
  const token = await issueCsrfToken();
  return json({ ok: true, token }, 200);
});

export const POST = async () => methodNotAllowed("GET");
export const PUT = POST;
export const PATCH = POST;
export const DELETE = POST;
export const OPTIONS = POST;
