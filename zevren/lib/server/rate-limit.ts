import "server-only";

import { sql } from "drizzle-orm";

import { getDb } from "@/lib/server/db";
import { keyedHash } from "@/lib/server/crypto";
import { logError } from "@/lib/server/http";

/**
 * Fixed-window rate limiting backed by the database, so the counter is shared
 * across serverless instances instead of resetting on every cold start.
 *
 * The whole check is a single atomic UPSERT: two requests arriving at the same
 * moment cannot both read "0 so far" and both be allowed through.
 */

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  retryAfterSeconds: number;
}

export interface RateLimitOptions {
  /** Logical bucket, e.g. "contact" or "admin-login". */
  scope: string;
  /** Caller identity: an IP hash, an account identifier, or both joined. */
  identity: string;
  limit: number;
  windowSeconds: number;
  /** When set, exceeding the limit locks the bucket for this long. */
  blockSeconds?: number;
}

function bucketKey(scope: string, identity: string): string {
  // Hash the identity so the table never stores a raw address or email.
  return `${scope}:${keyedHash(identity, `ratelimit:${scope}`)}`;
}

function intervalSeconds(seconds: number) {
  // These options are server-side constants, nevertheless validate before
  // inserting the integer literal so a future caller cannot alter SQL.
  if (!Number.isSafeInteger(seconds) || seconds < 0) {
    throw new Error("Rate-limit interval must be a non-negative safe integer.");
  }
  // `make_interval(secs => $n)` is not portable through all Postgres
  // prepared-statement drivers. An explicitly validated interval expression
  // works consistently with Neon and PGlite.
  return sql.raw(`${seconds} * interval '1 second'`);
}

export async function rateLimit(options: RateLimitOptions): Promise<RateLimitResult> {
  const { scope, identity, limit, windowSeconds, blockSeconds = 0 } = options;
  const key = bucketKey(scope, identity);
  const window = intervalSeconds(windowSeconds);
  const block = intervalSeconds(blockSeconds);

  try {
    const db = await getDb();

    type Row = { count: number; blocked_seconds: number; window_seconds: number };

    const result: unknown = await db.execute(sql`
      INSERT INTO rate_limits ("key", "count", "window_start")
      VALUES (${key}, 1, now())
      ON CONFLICT ("key") DO UPDATE SET
        "count" = CASE
          WHEN rate_limits."blocked_until" IS NOT NULL AND rate_limits."blocked_until" > now()
            THEN rate_limits."count"
          WHEN rate_limits."window_start" < now() - (${window})
            THEN 1
          ELSE rate_limits."count" + 1
        END,
        "window_start" = CASE
          WHEN rate_limits."window_start" < now() - (${window})
            THEN now()
          ELSE rate_limits."window_start"
        END,
        "blocked_until" = CASE
          WHEN ${blockSeconds} > 0
           AND rate_limits."window_start" >= now() - (${window})
           AND rate_limits."count" + 1 > ${limit}
            THEN now() + (${block})
          WHEN rate_limits."blocked_until" > now() THEN rate_limits."blocked_until"
          ELSE NULL
        END
      RETURNING
        "count",
        GREATEST(0, EXTRACT(EPOCH FROM (COALESCE("blocked_until", now()) - now()))) AS blocked_seconds,
        GREATEST(0, ${windowSeconds} - EXTRACT(EPOCH FROM (now() - "window_start"))) AS window_seconds
    `);

    // postgres.js returns the rows directly; the pglite driver wraps them in
    // `{ rows }`. Normalise before reading, rather than trusting one shape.
    const rows: Row[] = Array.isArray(result)
      ? (result as Row[])
      : ((result as { rows?: Row[] })?.rows ?? []);
    const row = rows[0];

    if (!row) return { allowed: true, remaining: limit - 1, retryAfterSeconds: 0 };

    const count = Number(row.count);
    const blocked = Math.ceil(Number(row.blocked_seconds));
    if (blocked > 0) {
      return { allowed: false, remaining: 0, retryAfterSeconds: blocked };
    }

    const allowed = count <= limit;
    return {
      allowed,
      remaining: Math.max(0, limit - count),
      retryAfterSeconds: allowed ? 0 : Math.max(1, Math.ceil(Number(row.window_seconds))),
    };
  } catch (error) {
    // Fail closed. If the limiter cannot run, the endpoint it guards is not
    // safe to expose unmetered, so the request is refused rather than let
    // through unchecked.
    logError("ratelimit.error", error, { scope });
    return { allowed: false, remaining: 0, retryAfterSeconds: 30 };
  }
}

/** Clears a bucket, used after a successful login so one typo does not linger. */
export async function resetRateLimit(scope: string, identity: string): Promise<void> {
  try {
    const db = await getDb();
    await db.execute(sql`DELETE FROM rate_limits WHERE "key" = ${bucketKey(scope, identity)}`);
  } catch (error) {
    logError("ratelimit.reset_failed", error, { scope });
  }
}

export function rateLimitHeaders(result: RateLimitResult, limit: number): Record<string, string> {
  return {
    "RateLimit-Limit": String(limit),
    "RateLimit-Remaining": String(result.remaining),
    ...(result.allowed ? {} : { "Retry-After": String(result.retryAfterSeconds) }),
  };
}
