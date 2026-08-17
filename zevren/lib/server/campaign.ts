import "server-only";

import { eq, isNotNull, sql } from "drizzle-orm";

import { FOUNDING_TOTAL } from "@/lib/campaign";
import { databaseConfigured, getDb, schema } from "@/lib/server/db";
import { logError } from "@/lib/server/http";

/**
 * How many founding spots are actually taken.
 *
 * The number comes from rows in founding_claims, which only staff create. It
 * is never a countdown, never seeded with a head start, and never guessed: if
 * the database cannot be reached the count is reported as unknown rather than
 * invented, and the UI says so instead of showing a made-up figure.
 */

export interface FoundingStatus {
  claimed: number;
  total: number;
  open: number;
  soldOut: boolean;
  /** False when the count could not be read, so the UI can stay honest. */
  known: boolean;
}

export async function getFoundingStatus(): Promise<FoundingStatus> {
  const total = FOUNDING_TOTAL;

  if (!databaseConfigured()) {
    // Nothing has been claimed yet because there is nowhere to record a claim.
    return { claimed: 0, total, open: total, soldOut: false, known: true };
  }

  try {
    const db = await getDb();
    const rows = await db
      .select({ count: sql<number>`count(*)::int` })
      .from(schema.foundingClaims);

    const claimed = Math.min(Math.max(Number(rows[0]?.count ?? 0), 0), total);
    return {
      claimed,
      total,
      open: total - claimed,
      soldOut: claimed >= total,
      known: true,
    };
  } catch (error) {
    logError("campaign.count_failed", error);
    return { claimed: 0, total, open: total, soldOut: false, known: false };
  }
}

/** Submissions that already hold a spot, so the admin list can show it. */
export async function claimedSubmissionIds(): Promise<string[]> {
  if (!databaseConfigured()) return [];
  try {
    const db = await getDb();
    const rows = await db
      .select({ submissionId: schema.foundingClaims.submissionId })
      .from(schema.foundingClaims)
      .where(isNotNull(schema.foundingClaims.submissionId));
    return rows.map((row) => row.submissionId).filter((id): id is string => id !== null);
  } catch (error) {
    logError("campaign.claimed_ids_failed", error);
    return [];
  }
}

export type ClaimResult =
  | { ok: true }
  | { ok: false; reason: "full" | "already_claimed" | "not_found" };

/**
 * Takes one of the ten spots for a submission.
 *
 * The limit is enforced in the INSERT itself rather than by reading a count and
 * then writing, so an ordinary double click cannot produce an eleventh row. Two
 * separate transactions committing at the exact same instant could still both
 * pass the check under READ COMMITTED; the counter clamps at ten, and with a
 * two-person admin that race is not worth a table lock.
 */
export async function claimFoundingSpot(input: {
  submissionId: string;
  businessName: string;
  note?: string;
}): Promise<ClaimResult> {
  const db = await getDb();

  const submission = await db
    .select({ id: schema.submissions.id })
    .from(schema.submissions)
    .where(eq(schema.submissions.id, input.submissionId))
    .limit(1);
  if (submission.length === 0) return { ok: false, reason: "not_found" };

  const existing = await db
    .select({ id: schema.foundingClaims.id })
    .from(schema.foundingClaims)
    .where(eq(schema.foundingClaims.submissionId, input.submissionId))
    .limit(1);
  if (existing.length > 0) return { ok: false, reason: "already_claimed" };

  // Every value below is a bound parameter, not interpolated text.
  const result = await db.execute(sql`
    insert into founding_claims (submission_id, business_name, note)
    select ${input.submissionId}::uuid,
           ${input.businessName.slice(0, 200)}::text,
           ${input.note?.slice(0, 500) ?? null}::text
    where (select count(*) from founding_claims) < ${FOUNDING_TOTAL}
    returning id
  `);

  const rows: unknown[] = Array.isArray(result)
    ? result
    : ((result as { rows?: unknown[] })?.rows ?? []);

  return rows.length > 0 ? { ok: true } : { ok: false, reason: "full" };
}

/** Gives a spot back. Used when a project falls through before it starts. */
export async function releaseFoundingSpot(submissionId: string): Promise<boolean> {
  const db = await getDb();
  const rows = await db
    .delete(schema.foundingClaims)
    .where(eq(schema.foundingClaims.submissionId, submissionId))
    .returning({ id: schema.foundingClaims.id });
  return rows.length > 0;
}
