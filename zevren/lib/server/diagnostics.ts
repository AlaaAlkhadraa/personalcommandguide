import "server-only";

import { count, isNotNull, sql } from "drizzle-orm";

import { env } from "@/lib/server/env";
import { databaseConfigured, getDb, schema } from "@/lib/server/db";
import { mailConfigured } from "@/lib/server/mail";
import { logError } from "@/lib/server/http";

/**
 * What the running deployment is actually configured to do.
 *
 * Every value here is either a boolean or something the signed-in owner
 * already knows (their own inbox address, their own domain). No secret is
 * read out, only whether it is present: an empty RESEND_API_KEY is the
 * difference between a lead landing in an inbox and a lead sitting in a
 * table nobody opens, and that difference should not require reading logs.
 */
export interface Diagnostics {
  database: { configured: boolean; reachable: boolean; error?: string };
  mail: {
    configured: boolean;
    apiKeySet: boolean;
    inbox?: string;
    from: string;
  };
  origin?: string;
  submissions: { total: number; notEmailed: number; latest?: string };
}

export async function getDiagnostics(): Promise<Diagnostics> {
  const e = env();

  const mail = {
    configured: mailConfigured(),
    apiKeySet: Boolean(e.RESEND_API_KEY),
    inbox: e.CONTACT_INBOX_EMAIL,
    from: e.MAIL_FROM,
  };

  const result: Diagnostics = {
    database: { configured: databaseConfigured(), reachable: false },
    mail,
    origin: e.APP_ORIGIN,
    submissions: { total: 0, notEmailed: 0 },
  };

  if (!result.database.configured) return result;

  try {
    const db = await getDb();
    const totals = await db
      .select({
        total: count(),
        // A row that was never emailed, either because mail is off or a send
        // failed. This is the number that explains "I get no emails".
        notEmailed: sql<number>`sum(case when ${isNotNull(schema.submissions.emailedAt)} and ${schema.submissions.emailError} is null then 0 else 1 end)::int`,
        latest: sql<string | null>`max(${schema.submissions.createdAt})`,
      })
      .from(schema.submissions);

    const row = totals[0];
    result.database.reachable = true;
    result.submissions = {
      total: Number(row?.total ?? 0),
      notEmailed: Number(row?.notEmailed ?? 0),
      latest: row?.latest ? new Date(row.latest).toISOString() : undefined,
    };
  } catch (error) {
    logError("diagnostics.failed", error);
    result.database.error = error instanceof Error ? error.message : "Unknown error";
  }

  return result;
}
