"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { useCsrfToken } from "@/lib/use-csrf-token";

export interface AdminSubmission {
  id: string;
  kind: string;
  name: string;
  email: string;
  company: string | null;
  needs: string | null;
  budget: string | null;
  projectInfo: string | null;
  message: string;
  status: string;
  locale: string | null;
  campaign: string | null;
  emailedAt: string | null;
  createdAt: string;
}

const STATUSES = ["new", "read", "archived"] as const;

/**
 * Every value below is rendered as a text child, so React escapes it. Nothing
 * here uses dangerouslySetInnerHTML, which is what keeps a submission
 * containing markup or a script tag from executing when staff read it.
 */
export function SubmissionsTable({
  csrfToken: initialToken,
  email,
  items,
  total,
}: {
  csrfToken: string | null;
  email: string;
  items: AdminSubmission[];
  total: number;
}) {
  const csrfToken = useCsrfToken(initialToken);
  const router = useRouter();
  const [busyId, setBusyId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [openId, setOpenId] = useState<string | null>(null);

  async function updateStatus(id: string, status: string) {
    setBusyId(id);
    setError(null);
    try {
      const response = await fetch("/api/admin/submissions", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          ...(csrfToken ? { "x-csrf-token": csrfToken } : {}),
        },
        credentials: "same-origin",
        body: JSON.stringify({ id, status, csrfToken: csrfToken ?? undefined }),
      });
      if (!response.ok) {
        const payload = (await response.json().catch(() => null)) as { message?: string } | null;
        setError(payload?.message ?? "Could not update.");
        return;
      }
      router.refresh();
    } catch {
      setError("Could not reach the server.");
    } finally {
      setBusyId(null);
    }
  }

  async function signOut() {
    await fetch("/api/admin/logout", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(csrfToken ? { "x-csrf-token": csrfToken } : {}),
      },
      credentials: "same-origin",
      body: JSON.stringify({ csrfToken: csrfToken ?? undefined }),
    }).catch(() => null);
    router.replace("/admin/login");
    router.refresh();
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-white">Submissions</h1>
          <p className="mt-1 text-sm text-muted">
            {total} total. Signed in as {email}.
          </p>
        </div>
        <button
          type="button"
          onClick={signOut}
          className="rounded-full border border-white/15 px-5 py-2.5 text-xs font-semibold uppercase tracking-wider text-white transition-colors hover:border-accent"
        >
          Sign out
        </button>
      </div>

      {error && (
        <p role="alert" className="text-sm text-red-400">
          {error}
        </p>
      )}

      {items.length === 0 ? (
        <p className="rounded-2xl border border-white/10 bg-surface/50 p-8 text-sm text-muted">
          No submissions yet.
        </p>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-white/10">
          {items.map((item, index) => (
            <div key={item.id} className={index > 0 ? "border-t border-white/10" : ""}>
              <button
                type="button"
                onClick={() => setOpenId(openId === item.id ? null : item.id)}
                aria-expanded={openId === item.id}
                className="flex w-full flex-wrap items-center justify-between gap-3 bg-surface/40 px-5 py-4 text-left transition-colors hover:bg-surface/70"
              >
                <span className="flex flex-col">
                  <span className="text-sm font-medium text-white">
                    {item.name} <span className="text-muted">&middot; {item.email}</span>
                  </span>
                  <span className="mt-0.5 text-xs text-muted">
                    {item.kind} &middot; {new Date(item.createdAt).toLocaleString("en-GB")}
                    {item.emailedAt ? " · emailed" : ""}
                  </span>
                </span>
                <span className="flex items-center gap-2">
                  <span
                    className={`rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider ${
                      item.status === "new"
                        ? "bg-primary/20 text-accent"
                        : item.status === "read"
                          ? "bg-white/10 text-muted"
                          : "bg-white/5 text-muted"
                    }`}
                  >
                    {item.status}
                  </span>
                </span>
              </button>

              {openId === item.id && (
                <div className="flex flex-col gap-4 bg-navy px-5 py-5">
                  <dl className="grid gap-3 text-sm sm:grid-cols-2">
                    <div>
                      <dt className="text-xs uppercase tracking-wider text-muted">Company</dt>
                      <dd className="text-white">{item.company || "-"}</dd>
                    </div>
                    <div>
                      <dt className="text-xs uppercase tracking-wider text-muted">Needs</dt>
                      <dd className="text-white">{item.needs || "-"}</dd>
                    </div>
                    <div>
                      <dt className="text-xs uppercase tracking-wider text-muted">Budget</dt>
                      <dd className="text-white">{item.budget || "-"}</dd>
                    </div>
                    <div>
                      <dt className="text-xs uppercase tracking-wider text-muted">Locale</dt>
                      <dd className="text-white">{item.locale || "-"}</dd>
                    </div>
                    <div>
                      <dt className="text-xs uppercase tracking-wider text-muted">Campaign</dt>
                      <dd className="text-white">{item.campaign || "-"}</dd>
                    </div>
                  </dl>

                  {item.projectInfo && (
                    <div className="flex flex-col gap-1">
                      <span className="text-xs uppercase tracking-wider text-muted">
                        Project information
                      </span>
                      <p className="whitespace-pre-wrap rounded-xl border border-white/10 bg-surface/50 p-4 text-sm leading-relaxed text-white">
                        {item.projectInfo}
                      </p>
                    </div>
                  )}

                  <p className="whitespace-pre-wrap rounded-xl border border-white/10 bg-surface/50 p-4 text-sm leading-relaxed text-white">
                    {item.message}
                  </p>

                  <div className="flex flex-wrap gap-2">
                    {STATUSES.map((status) => (
                      <button
                        key={status}
                        type="button"
                        disabled={busyId === item.id || item.status === status}
                        onClick={() => updateStatus(item.id, status)}
                        className="rounded-full border border-white/15 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-white transition-colors hover:border-accent disabled:opacity-40"
                      >
                        {status}
                      </button>
                    ))}
                    <a
                      href={`mailto:${encodeURIComponent(item.email)}`}
                      className="rounded-full border border-white/15 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-white transition-colors hover:border-accent"
                    >
                      Reply
                    </a>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
