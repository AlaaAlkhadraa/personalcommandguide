import "server-only";

import { and, eq, isNull, lt, or, sql } from "drizzle-orm";
import { cookies, headers } from "next/headers";
import type { NextRequest } from "next/server";

import { keyedHash, randomToken } from "@/lib/server/crypto";
import { getDb, schema } from "@/lib/server/db";
import { env, isProduction } from "@/lib/server/env";
import { ipIdentity, logError, userAgent } from "@/lib/server/http";

/**
 * Server-side sessions.
 *
 * The cookie holds an opaque random token and nothing else: no user id, no
 * role, no expiry the client could edit. The database holds a keyed hash of
 * that token, so a database dump does not yield usable session cookies.
 *
 * Every request re-reads the session from the database, so revoking a session
 * or disabling an account takes effect immediately rather than at the next
 * token expiry.
 */

export function sessionCookieName(): string {
  return isProduction() ? "__Host-zvr_session" : "zvr_session";
}

export interface SessionUser {
  id: string;
  email: string;
  role: string;
}

function hashToken(token: string): string {
  return keyedHash(token, "session");
}

export async function createSession(
  request: NextRequest,
  userId: string
): Promise<{ token: string; expiresAt: Date }> {
  const e = env();
  const db = await getDb();

  const token = randomToken(32);
  const now = Date.now();
  const expiresAt = new Date(now + e.SESSION_ABSOLUTE_TTL * 1000);
  const idleExpiresAt = new Date(now + e.SESSION_IDLE_TTL * 1000);

  await db.insert(schema.sessions).values({
    tokenHash: hashToken(token),
    userId,
    ipHash: ipIdentity(request),
    userAgentHash: keyedHash(userAgent(request), "ua"),
    expiresAt,
    idleExpiresAt,
  });

  const store = await cookies();
  store.set(sessionCookieName(), token, {
    httpOnly: true,
    secure: isProduction(),
    sameSite: "strict",
    path: "/",
    maxAge: e.SESSION_ABSOLUTE_TTL,
  });

  return { token, expiresAt };
}

/**
 * Resolves the current session. Returns null for anything that is not a live,
 * unexpired, unrevoked session belonging to an enabled account.
 *
 * The session is additionally pinned to the user agent it was created with.
 * That does not stop a determined attacker who replays both, but it does
 * invalidate a token lifted in isolation, which is the common case.
 */
export async function getSessionUser(request: NextRequest): Promise<SessionUser | null> {
  return resolveSession(keyedHash(userAgent(request), "ua"));
}

/**
 * Same check from a server component, where there is no NextRequest. Reading
 * the headers directly keeps the two paths on identical logic instead of
 * letting the page trust something the API route would reject.
 */
export async function getSessionUserFromHeaders(): Promise<SessionUser | null> {
  const h = await headers();
  return resolveSession(keyedHash((h.get("user-agent") ?? "").slice(0, 300), "ua"));
}

async function resolveSession(uaHash: string): Promise<SessionUser | null> {
  const store = await cookies();
  const token = store.get(sessionCookieName())?.value;
  if (!token || token.length < 32 || token.length > 200) return null;

  try {
    const db = await getDb();
    const rows = await db
      .select({
        sessionId: schema.sessions.id,
        expiresAt: schema.sessions.expiresAt,
        idleExpiresAt: schema.sessions.idleExpiresAt,
        revokedAt: schema.sessions.revokedAt,
        uaHash: schema.sessions.userAgentHash,
        userId: schema.adminUsers.id,
        email: schema.adminUsers.email,
        role: schema.adminUsers.role,
        disabled: schema.adminUsers.disabled,
      })
      .from(schema.sessions)
      .innerJoin(schema.adminUsers, eq(schema.sessions.userId, schema.adminUsers.id))
      .where(eq(schema.sessions.tokenHash, hashToken(token)))
      .limit(1);

    const row = rows[0];
    if (!row) return null;

    const now = new Date();
    if (row.revokedAt) return null;
    if (row.expiresAt <= now) return null;
    if (row.idleExpiresAt <= now) return null;
    if (row.disabled) return null;
    if (row.uaHash && row.uaHash !== uaHash) return null;

    // Slide the idle window forward, never past the absolute expiry.
    const e = env();
    const nextIdle = new Date(Math.min(now.getTime() + e.SESSION_IDLE_TTL * 1000, row.expiresAt.getTime()));
    await db
      .update(schema.sessions)
      .set({ idleExpiresAt: nextIdle })
      .where(eq(schema.sessions.id, row.sessionId));

    return { id: row.userId, email: row.email, role: row.role };
  } catch (error) {
    logError("session.lookup_failed", error);
    return null;
  }
}

/** Revokes the current session and clears the cookie. */
export async function destroySession(): Promise<void> {
  const store = await cookies();
  const name = sessionCookieName();
  const token = store.get(name)?.value;

  if (token) {
    try {
      const db = await getDb();
      await db
        .update(schema.sessions)
        .set({ revokedAt: new Date() })
        .where(eq(schema.sessions.tokenHash, hashToken(token)));
    } catch (error) {
      logError("session.revoke_failed", error);
    }
  }

  store.set(name, "", {
    httpOnly: true,
    secure: isProduction(),
    sameSite: "strict",
    path: "/",
    maxAge: 0,
  });
}

/** Revokes every session for a user, e.g. after a password change. */
export async function revokeAllSessions(userId: string): Promise<void> {
  const db = await getDb();
  await db
    .update(schema.sessions)
    .set({ revokedAt: new Date() })
    .where(and(eq(schema.sessions.userId, userId), isNull(schema.sessions.revokedAt)));
}

/** Housekeeping: drops rows that can no longer authenticate anyone. */
export async function pruneExpiredSessions(): Promise<void> {
  try {
    const db = await getDb();
    const now = new Date();
    await db
      .delete(schema.sessions)
      .where(
        or(
          lt(schema.sessions.expiresAt, now),
          lt(schema.sessions.idleExpiresAt, now),
          sql`${schema.sessions.revokedAt} < now() - interval '7 days'`
        )
      );
  } catch (error) {
    logError("session.prune_failed", error);
  }
}
