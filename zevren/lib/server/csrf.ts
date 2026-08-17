import "server-only";

import { cookies } from "next/headers";
import type { NextRequest } from "next/server";

import { keyedHash, randomToken, safeEqual } from "@/lib/server/crypto";
import { isProduction } from "@/lib/server/env";

/**
 * CSRF protection, signed double-submit.
 *
 * The browser gets a cookie holding a random secret and, separately, a token
 * that is HMAC(secret). A state-changing request must present both: the cookie
 * (sent automatically) and the token (sent in a header or field). A cross-site
 * attacker can make the browser send the cookie but cannot read it, so cannot
 * produce the matching token. The token is keyed with AUTH_SECRET, so it also
 * cannot be forged offline.
 *
 * The Origin/Referer check in `isSameOrigin` is the second, independent layer.
 */

/**
 * The __Host- prefix pins the cookie to this exact origin and is rejected by
 * browsers unless the cookie is Secure, path=/ and has no Domain. Over plain
 * http in local development that would mean the cookie is silently dropped,
 * so the prefix is only used where it can be honoured.
 */
export function csrfCookieName(): string {
  return isProduction() ? "__Host-zvr_csrf" : "zvr_csrf";
}

export const CSRF_HEADER = "x-csrf-token";

const MAX_AGE = 60 * 60 * 4;

function tokenFor(secret: string): string {
  return keyedHash(secret, "csrf");
}

/**
 * Reads the token for an existing secret cookie, without minting one.
 *
 * Next only permits a cookie to be written from a route handler or a server
 * action, so a page render must not try to create the secret. Pages call this
 * and hand the result to the client component, which asks /api/csrf for a
 * token when there is none yet.
 */
export async function readCsrfToken(): Promise<string | null> {
  const store = await cookies();
  const secret = store.get(csrfCookieName())?.value;
  if (!secret || secret.length < 32) return null;
  return tokenFor(secret);
}

/**
 * Issues (or reuses) the CSRF secret cookie and returns the token the client
 * should echo back. Only callable from a route handler or a server action.
 */
export async function issueCsrfToken(): Promise<string> {
  const store = await cookies();
  const name = csrfCookieName();
  let secret = store.get(name)?.value;

  if (!secret || secret.length < 32) {
    secret = randomToken(32);
    store.set(name, secret, {
      httpOnly: true,
      sameSite: "strict",
      secure: isProduction(),
      path: "/",
      maxAge: MAX_AGE,
    });
  }

  return tokenFor(secret);
}

/**
 * Verifies the token supplied with a state-changing request. Reads the header
 * first, then a `csrfToken` field in an already-parsed JSON body.
 */
export async function verifyCsrf(request: NextRequest, body?: unknown): Promise<boolean> {
  const store = await cookies();
  const secret = store.get(csrfCookieName())?.value;
  if (!secret || secret.length < 32) return false;

  const headerToken = request.headers.get(CSRF_HEADER);
  const bodyToken =
    body && typeof body === "object" && "csrfToken" in body
      ? (body as { csrfToken?: unknown }).csrfToken
      : undefined;

  const supplied = headerToken ?? (typeof bodyToken === "string" ? bodyToken : null);
  if (!supplied || supplied.length > 200) return false;

  return safeEqual(supplied, tokenFor(secret));
}
