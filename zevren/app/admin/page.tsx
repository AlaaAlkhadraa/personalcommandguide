import { redirect } from "next/navigation";

import { SubmissionsTable } from "@/components/admin/SubmissionsTable";
import { claimedSubmissionIds, getFoundingStatus } from "@/lib/server/campaign";
import { readCsrfToken } from "@/lib/server/csrf";
import { databaseConfigured } from "@/lib/server/db";
import { getSessionUserFromHeaders } from "@/lib/server/session";
import { listSubmissions } from "@/lib/server/submissions";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export default async function AdminPage() {
  // Authorization happens here, on the server, before any data is read.
  // The middleware redirect is only a convenience for the common case.
  const user = await getSessionUserFromHeaders();
  if (!user || user.role !== "admin") redirect("/admin/login");

  const csrfToken = await readCsrfToken();

  if (!databaseConfigured()) {
    return (
      <div className="rounded-2xl border border-white/10 bg-surface/50 p-8">
        <h1 className="text-2xl font-semibold text-white">Admin</h1>
        <p className="mt-3 text-sm text-muted">
          No database is configured for this deployment, so there is nothing to show.
        </p>
      </div>
    );
  }

  const [{ items, total }, status, claimedIds] = await Promise.all([
    listSubmissions({ limit: 50 }),
    getFoundingStatus(),
    claimedSubmissionIds(),
  ]);
  const claimed = new Set(claimedIds);

  return (
    <SubmissionsTable
      csrfToken={csrfToken}
      email={user.email}
      total={total}
      founding={{ claimed: status.claimed, total: status.total, open: status.open }}
      items={items.map((item) => ({
        ...item,
        createdAt: item.createdAt.toISOString(),
        emailedAt: item.emailedAt ? item.emailedAt.toISOString() : null,
        founding: claimed.has(item.id),
      }))}
    />
  );
}
