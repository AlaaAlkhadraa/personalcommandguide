import type { NextRequest } from "next/server";

import { verifyCsrf } from "@/lib/server/csrf";
import { fail, isSameOrigin, methodNotAllowed, ok, readJson, withErrorHandling } from "@/lib/server/http";
import { destroySession } from "@/lib/server/session";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export const POST = withErrorHandling("admin.logout", async (request: NextRequest) => {
  if (!isSameOrigin(request)) return fail(403, "forbidden", "Request blocked.");
  const body = await readJson(request, 4 * 1024);
  if (!(await verifyCsrf(request, body ?? undefined))) {
    return fail(403, "csrf", "Please reload the page and try again.");
  }
  await destroySession();
  return ok({ message: "Signed out." });
});

export const GET = async () => methodNotAllowed("POST");
export const PUT = GET;
export const PATCH = GET;
export const DELETE = GET;
export const OPTIONS = GET;
