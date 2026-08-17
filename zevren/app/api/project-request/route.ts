import type { NextRequest } from "next/server";

import { handlePublicSubmission } from "@/lib/server/public-form";
import { methodNotAllowed, withErrorHandling } from "@/lib/server/http";

// Node runtime: the pipeline needs node:crypto and a database driver.
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export const POST = withErrorHandling("project-request", (request: NextRequest) =>
  handlePublicSubmission(request, "project")
);

// Every other verb, including the CORS preflight, is refused. The endpoint is
// same-origin only, so there is no preflight to answer.
export const GET = async () => methodNotAllowed("POST");
export const PUT = GET;
export const PATCH = GET;
export const DELETE = GET;
export const OPTIONS = GET;
