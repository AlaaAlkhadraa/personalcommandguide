import { z } from "zod";
import type { NextRequest } from "next/server";

import { requireAdmin } from "@/lib/server/admin-auth";
import { verifyCsrf } from "@/lib/server/csrf";
import { fail, ipIdentity, isSameOrigin, json, methodNotAllowed, ok, readJson, withErrorHandling } from "@/lib/server/http";
import {
  deleteSubmission,
  listSubmissions,
  recordAudit,
  setSubmissionStatus,
} from "@/lib/server/submissions";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** Admin-only listing. Unauthenticated callers never see a row. */
export const GET = withErrorHandling("admin.submissions.list", async (request: NextRequest) => {
  const auth = await requireAdmin(request);
  if ("response" in auth) return auth.response;

  const url = request.nextUrl;
  const limit = Number(url.searchParams.get("limit") ?? 25);
  const offset = Number(url.searchParams.get("offset") ?? 0);
  const status = url.searchParams.get("status") ?? "all";

  // Query parameters are numbers and a fixed enum, never interpolated text.
  const safeStatus = ["all", "new", "read", "archived"].includes(status) ? status : "all";

  const { items, total } = await listSubmissions({
    limit: Number.isFinite(limit) ? limit : 25,
    offset: Number.isFinite(offset) ? offset : 0,
    status: safeStatus,
  });

  return json({ ok: true, total, items }, 200);
});

const patchSchema = z
  .object({
    id: z.string().uuid(),
    status: z.enum(["new", "read", "archived"]),
    csrfToken: z.string().max(200).optional(),
  })
  .strict();

export const PATCH = withErrorHandling("admin.submissions.update", async (request: NextRequest) => {
  if (!isSameOrigin(request)) return fail(403, "forbidden", "Request blocked.");

  const auth = await requireAdmin(request);
  if ("response" in auth) return auth.response;

  const body = await readJson(request, 8 * 1024);
  if (body === null) return fail(400, "invalid_body", "Invalid request.");
  if (!(await verifyCsrf(request, body))) return fail(403, "csrf", "Please reload the page.");

  const parsed = patchSchema.safeParse(body);
  if (!parsed.success) return fail(400, "validation", "Invalid request.");

  const updated = await setSubmissionStatus(parsed.data.id, parsed.data.status);
  if (!updated) return fail(404, "not_found", "Not found.");

  await recordAudit("submission.status_changed", {
    actor: auth.user.email,
    ipHash: ipIdentity(request),
    detail: `${parsed.data.id}:${parsed.data.status}`,
  });

  return ok({ message: "Updated." });
});

const deleteSchema = z
  .object({
    id: z.string().uuid(),
    csrfToken: z.string().max(200).optional(),
  })
  .strict();

/**
 * Deletes one submission for good. Guarded the same way the status change is,
 * plus an audit entry: this is the only destructive action in the panel, so
 * there should always be a record of who ran it.
 */
export const DELETE = withErrorHandling("admin.submissions.delete", async (request: NextRequest) => {
  if (!isSameOrigin(request)) return fail(403, "forbidden", "Request blocked.");

  const auth = await requireAdmin(request);
  if ("response" in auth) return auth.response;

  const body = await readJson(request, 8 * 1024);
  if (body === null) return fail(400, "invalid_body", "Invalid request.");
  if (!(await verifyCsrf(request, body))) return fail(403, "csrf", "Please reload the page.");

  const parsed = deleteSchema.safeParse(body);
  if (!parsed.success) return fail(400, "validation", "Invalid request.");

  const removed = await deleteSubmission(parsed.data.id);
  if (!removed) return fail(404, "not_found", "Not found.");

  await recordAudit("submission.deleted", {
    actor: auth.user.email,
    ipHash: ipIdentity(request),
    detail: parsed.data.id,
  });

  return ok({ message: "Deleted." });
});

export const POST = async () => methodNotAllowed("GET, PATCH, DELETE");
export const PUT = POST;
export const OPTIONS = POST;
