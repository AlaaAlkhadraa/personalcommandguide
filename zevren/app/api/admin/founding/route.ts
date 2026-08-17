import { z } from "zod";
import type { NextRequest, NextResponse } from "next/server";

import { requireAdmin } from "@/lib/server/admin-auth";
import {
  claimFoundingSpot,
  getFoundingStatus,
  releaseFoundingSpot,
} from "@/lib/server/campaign";
import { verifyCsrf } from "@/lib/server/csrf";
import {
  fail,
  ipIdentity,
  isSameOrigin,
  methodNotAllowed,
  ok,
  readJson,
  withErrorHandling,
} from "@/lib/server/http";
import type { SessionUser } from "@/lib/server/session";
import { recordAudit } from "@/lib/server/submissions";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Founding 10 spots.
 *
 * Only a signed-in admin can move this number. Nothing on the public site
 * writes here, so no visitor, script or form submission can make the counter
 * climb: a spot is taken when a person decides a project has started.
 */

const bodySchema = z
  .object({
    submissionId: z.string().uuid(),
    businessName: z.string().trim().min(1).max(200),
    note: z.string().trim().max(500).optional(),
    csrfToken: z.string().max(200).optional(),
  })
  .strict();

const releaseSchema = z
  .object({
    submissionId: z.string().uuid(),
    csrfToken: z.string().max(200).optional(),
  })
  .strict();

type Guarded =
  | { response: NextResponse }
  | { user: SessionUser; body: unknown };

/** Guards shared by both mutating methods: origin, session, CSRF, body size. */
async function guard(request: NextRequest): Promise<Guarded> {
  if (!isSameOrigin(request)) return { response: fail(403, "forbidden", "Request blocked.") };

  const auth = await requireAdmin(request);
  if ("response" in auth) return { response: auth.response };

  const body = await readJson(request, 8 * 1024);
  if (body === null) return { response: fail(400, "invalid_body", "Invalid request.") };
  if (!(await verifyCsrf(request, body))) {
    return { response: fail(403, "csrf", "Please reload the page.") };
  }

  return { user: auth.user, body };
}

export const POST = withErrorHandling("admin.founding.claim", async (request: NextRequest) => {
  const checked = await guard(request);
  if ("response" in checked) return checked.response;

  const parsed = bodySchema.safeParse(checked.body);
  if (!parsed.success) return fail(400, "validation", "Invalid request.");

  const result = await claimFoundingSpot(parsed.data);
  if (!result.ok) {
    const message =
      result.reason === "full"
        ? "All ten founding spots are taken."
        : result.reason === "already_claimed"
          ? "This submission already holds a spot."
          : "Not found.";
    return fail(result.reason === "not_found" ? 404 : 409, result.reason, message);
  }

  await recordAudit("founding.claimed", {
    actor: checked.user.email,
    ipHash: ipIdentity(request),
    detail: parsed.data.submissionId,
  });

  return ok({ message: "Spot claimed.", status: await getFoundingStatus() });
});

export const DELETE = withErrorHandling("admin.founding.release", async (request: NextRequest) => {
  const checked = await guard(request);
  if ("response" in checked) return checked.response;

  const parsed = releaseSchema.safeParse(checked.body);
  if (!parsed.success) return fail(400, "validation", "Invalid request.");

  const released = await releaseFoundingSpot(parsed.data.submissionId);
  if (!released) return fail(404, "not_found", "Not found.");

  await recordAudit("founding.released", {
    actor: checked.user.email,
    ipHash: ipIdentity(request),
    detail: parsed.data.submissionId,
  });

  return ok({ message: "Spot released.", status: await getFoundingStatus() });
});

/** The count is public on the campaign page; there is no admin GET to add. */
export const GET = async () => methodNotAllowed("POST, DELETE");
export const PATCH = GET;
export const PUT = GET;
export const OPTIONS = GET;
