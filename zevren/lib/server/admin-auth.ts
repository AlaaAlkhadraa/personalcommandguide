import "server-only";

import { eq } from "drizzle-orm";
import type { NextRequest, NextResponse } from "next/server";

import { hashPassword, verifyPassword } from "@/lib/server/crypto";
import { getDb, schema } from "@/lib/server/db";
import { fail, ipIdentity, logEvent } from "@/lib/server/http";
import { rateLimit, resetRateLimit } from "@/lib/server/rate-limit";
import { getSessionUser, type SessionUser } from "@/lib/server/session";
import { recordAudit } from "@/lib/server/submissions";

/**
 * Authentication and authorization for the admin area.
 *
 * Authorization is checked on the server for every admin request, in the route
 * handler itself. The middleware only redirects visitors who obviously have no
 * session; it is a convenience, never the gate. Removing a cookie check in the
 * browser therefore gains an attacker nothing.
 */

/**
 * A hash of a value nobody knows, used to spend the same CPU time when the
 * account does not exist as when it does. Without it, a fast 401 would tell an
 * attacker which email addresses are real.
 */
let decoyHash: string | null = null;
async function decoy(): Promise<string> {
  if (!decoyHash) decoyHash = await hashPassword(`decoy-${Math.random()}-${Date.now()}`);
  return decoyHash;
}

export interface LoginOutcome {
  ok: boolean;
  userId?: string;
  reason?: "invalid" | "locked" | "disabled";
  retryAfterSeconds?: number;
}

const PER_IP = { limit: 10, windowSeconds: 900, blockSeconds: 900 };
const PER_ACCOUNT = { limit: 5, windowSeconds: 900, blockSeconds: 900 };

/**
 * Verifies credentials under two independent rate limits: one per client, so a
 * single source cannot spray many accounts, and one per account, so a
 * distributed attack still cannot grind a single password.
 */
export async function attemptLogin(
  request: NextRequest,
  email: string,
  password: string
): Promise<LoginOutcome> {
  const ipHash = ipIdentity(request);
  const account = email.trim().toLowerCase();

  const byIp = await rateLimit({ scope: "admin-login:ip", identity: ipHash, ...PER_IP });
  if (!byIp.allowed) {
    await recordAudit("admin.login_blocked", { ipHash, detail: "ip" });
    return { ok: false, reason: "locked", retryAfterSeconds: byIp.retryAfterSeconds };
  }

  const byAccount = await rateLimit({
    scope: "admin-login:account",
    identity: account,
    ...PER_ACCOUNT,
  });
  if (!byAccount.allowed) {
    await recordAudit("admin.login_blocked", { actor: account, ipHash, detail: "account" });
    return { ok: false, reason: "locked", retryAfterSeconds: byAccount.retryAfterSeconds };
  }

  const db = await getDb();
  const rows = await db
    .select({
      id: schema.adminUsers.id,
      passwordHash: schema.adminUsers.passwordHash,
      disabled: schema.adminUsers.disabled,
    })
    .from(schema.adminUsers)
    .where(eq(schema.adminUsers.email, account))
    .limit(1);

  const user = rows[0];

  // Always run a verification, even with no user, so both paths cost the same.
  const matches = await verifyPassword(password, user?.passwordHash ?? (await decoy()));

  if (!user || !matches) {
    await recordAudit("admin.login_failed", { actor: account, ipHash });
    logEvent("admin.login_failed");
    return { ok: false, reason: "invalid" };
  }

  if (user.disabled) {
    await recordAudit("admin.login_disabled", { actor: account, ipHash });
    // Reported as "invalid" so a disabled account is not distinguishable.
    return { ok: false, reason: "invalid" };
  }

  await Promise.all([
    resetRateLimit("admin-login:ip", ipHash),
    resetRateLimit("admin-login:account", account),
    db
      .update(schema.adminUsers)
      .set({ lastLoginAt: new Date() })
      .where(eq(schema.adminUsers.id, user.id)),
    recordAudit("admin.login_success", { actor: account, ipHash }),
  ]);

  return { ok: true, userId: user.id };
}

/**
 * Guard for admin API routes. Returns the user, or the response to send back.
 * Callers must return the response as-is; there is no "continue anyway" path.
 */
export async function requireAdmin(
  request: NextRequest
): Promise<{ user: SessionUser } | { response: NextResponse }> {
  const user = await getSessionUser(request);
  if (!user) {
    return { response: fail(401, "unauthenticated", "Please sign in.") };
  }
  if (user.role !== "admin") {
    await recordAudit("admin.forbidden", { actor: user.email, ipHash: ipIdentity(request) });
    return { response: fail(403, "forbidden", "You do not have access to this resource.") };
  }
  return { user };
}
