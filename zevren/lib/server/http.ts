import "server-only";

import { NextResponse, type NextRequest } from "next/server";

import { env } from "@/lib/server/env";
import { keyedHash } from "@/lib/server/crypto";

/**
 * Shared request/response helpers for the API routes.
 *
 * Two rules hold everywhere in this file:
 * 1. Responses to the client carry a fixed set of messages. Internal detail
 *    (stack traces, driver errors, which field of a credential was wrong)
 *    never crosses the boundary.
 * 2. Anything derived from the request is treated as hostile until validated.
 */

export const JSON_HEADERS = {
  "Content-Type": "application/json; charset=utf-8",
  // Responses are per-request and may contain personal data: never cached by
  // a shared cache, never stored on disk by the browser.
  "Cache-Control": "no-store, no-cache, must-revalidate, private",
  "X-Content-Type-Options": "nosniff",
  Vary: "Origin, Cookie",
} as const;

export function json(body: unknown, status = 200, extra?: HeadersInit): NextResponse {
  return NextResponse.json(body, {
    status,
    headers: { ...JSON_HEADERS, ...(extra ?? {}) },
  });
}

/** Client-safe error payload. The `code` is a stable identifier, not a detail leak. */
export function fail(status: number, code: string, message: string, extra?: Record<string, unknown>) {
  return json({ ok: false, code, message, ...(extra ?? {}) }, status);
}

export function ok(body: Record<string, unknown> = {}) {
  return json({ ok: true, ...body }, 200);
}

/**
 * Client IP. x-forwarded-for is attacker-controlled unless a trusted proxy
 * overwrites it, so it is only honoured when TRUST_PROXY is set, and only the
 * left-most entry is used. The value is never returned to a client; it is
 * hashed before it touches the database.
 */
export function clientIp(request: NextRequest): string {
  const e = env();
  if (e.TRUST_PROXY) {
    const xff = request.headers.get("x-forwarded-for");
    if (xff) {
      const first = xff.split(",")[0]?.trim();
      if (first && first.length <= 45) return first;
    }
    const real = request.headers.get("x-real-ip")?.trim();
    if (real && real.length <= 45) return real;
  }
  return "unknown";
}

export function ipIdentity(request: NextRequest): string {
  return keyedHash(clientIp(request), "ip");
}

/** Truncated user agent. Bounded so a huge header cannot bloat a row. */
export function userAgent(request: NextRequest): string {
  return (request.headers.get("user-agent") ?? "").slice(0, 300);
}

/**
 * Same-origin enforcement for state-changing requests. This is the second
 * half of CSRF defence (the token is the first) and also the thing that keeps
 * the API from being callable cross-origin at all: no endpoint ever emits
 * Access-Control-Allow-Origin, so a browser blocks the response, and this
 * check rejects the request outright.
 */
export function isSameOrigin(request: NextRequest): boolean {
  const allowed = allowedOrigins(request);
  const origin = request.headers.get("origin");

  if (origin) return allowed.has(origin);

  // No Origin header: fall back to Referer. A request with neither is not a
  // browser form post, so it is refused rather than trusted.
  const referer = request.headers.get("referer");
  if (!referer) return false;
  try {
    return allowed.has(new URL(referer).origin);
  } catch {
    return false;
  }
}

function allowedOrigins(request: NextRequest): Set<string> {
  const e = env();
  const set = new Set<string>();
  if (e.APP_ORIGIN) set.add(new URL(e.APP_ORIGIN).origin);
  // The deployment's own origin, so preview URLs work without extra config.
  set.add(request.nextUrl.origin);
  const host = request.headers.get("host");
  if (host && /^[a-z0-9.:-]+$/i.test(host)) {
    set.add(`https://${host}`);
    if (e.NODE_ENV !== "production") set.add(`http://${host}`);
  }
  return set;
}

/**
 * Reads and size-caps a JSON body. An oversized or non-JSON body is rejected
 * before it reaches a parser, so a large payload cannot be used to exhaust
 * memory on a serverless instance.
 */
export async function readJson(request: NextRequest, maxBytes = 32 * 1024): Promise<unknown | null> {
  const type = request.headers.get("content-type") ?? "";
  if (!type.toLowerCase().startsWith("application/json")) return null;

  const declared = Number(request.headers.get("content-length") ?? "0");
  if (Number.isFinite(declared) && declared > maxBytes) return null;

  let text: string;
  try {
    text = await request.text();
  } catch {
    return null;
  }
  if (Buffer.byteLength(text, "utf8") > maxBytes) return null;

  try {
    return JSON.parse(text) as unknown;
  } catch {
    return null;
  }
}

/**
 * Server-side logging. Never called with raw secrets or full personal data:
 * callers pass identifiers, not payloads. Output goes to the platform log,
 * which is not reachable from the client.
 */
export function logEvent(event: string, detail: Record<string, unknown> = {}): void {
  const safe: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(detail)) {
    safe[k] = typeof v === "string" ? v.slice(0, 200) : v;
  }
  console.info(JSON.stringify({ at: new Date().toISOString(), event, ...safe }));
}

export function logError(event: string, error: unknown, detail: Record<string, unknown> = {}): void {
  const message = error instanceof Error ? error.message : "unknown error";
  // Drizzle wraps the database driver's concise error as `cause`; log it
  // separately so the long SQL query text cannot hide the actionable reason.
  // Neither value includes request payloads or configured connection strings.
  const cause =
    error instanceof Error && error.cause instanceof Error
      ? error.cause.message.slice(0, 200)
      : undefined;
  console.error(
    JSON.stringify({ at: new Date().toISOString(), event, error: message.slice(0, 300), cause, ...detail })
  );
}

/**
 * Wraps a handler so an unexpected throw becomes a generic 500 instead of a
 * Next error page containing a stack trace.
 */
export function withErrorHandling(
  name: string,
  handler: (request: NextRequest) => Promise<NextResponse>
) {
  return async (request: NextRequest): Promise<NextResponse> => {
    try {
      return await handler(request);
    } catch (error) {
      logError(`${name}.unhandled`, error);
      return fail(500, "server_error", "Something went wrong. Please try again later.");
    }
  };
}

/** Rejects methods a route does not implement, without echoing anything back. */
export function methodNotAllowed(allow: string) {
  return json({ ok: false, code: "method_not_allowed", message: "Method not allowed." }, 405, {
    Allow: allow,
  });
}
