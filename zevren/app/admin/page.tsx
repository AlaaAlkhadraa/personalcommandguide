import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { LogoutButton } from "@/components/admin/LogoutButton";
import { getCurrentAdmin } from "@/lib/auth";
import { getRecentContactSubmissions } from "@/lib/contact-submissions";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Admin dashboard", robots: { index: false, follow: false } };

function displayValue(value: string | null): string {
  return value?.replaceAll("-", " ") || "—";
}

export default async function AdminDashboardPage() {
  const admin = await getCurrentAdmin();
  if (!admin) redirect("/admin/login");

  const submissions = await getRecentContactSubmissions();
  const dateFormatter = new Intl.DateTimeFormat("en-NL", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "Europe/Amsterdam",
  });

  return (
    <section className="container-page py-14 sm:py-20">
      <div className="flex flex-col gap-5 border-b border-white/10 pb-8 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="font-mono text-xs uppercase tracking-[0.18em] text-accent">Admin dashboard</p>
          <h1 className="mt-3 text-3xl font-semibold text-white">Contact enquiries</h1>
          <p className="mt-2 text-sm text-muted">Signed in as {admin.email}</p>
        </div>
        <LogoutButton />
      </div>

      {submissions.length === 0 ? (
        <p className="py-12 text-muted">No contact enquiries have been received yet.</p>
      ) : (
        <div className="mt-8 grid gap-5">
          {submissions.map((submission) => (
            <article key={submission.id} className="rounded-2xl border border-white/10 bg-surface/60 p-6">
              <div className="flex flex-col gap-3 border-b border-white/10 pb-4 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-white">{submission.name}</h2>
                  <a className="text-sm text-accent hover:underline" href={`mailto:${submission.email}`}>
                    {submission.email}
                  </a>
                </div>
                <time className="text-sm text-muted" dateTime={submission.created_at}>
                  {dateFormatter.format(new Date(submission.created_at))}
                </time>
              </div>
              <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-3">
                <div><dt className="text-muted">Company</dt><dd className="mt-1 text-white">{submission.company || "—"}</dd></div>
                <div><dt className="text-muted">Project</dt><dd className="mt-1 capitalize text-white">{displayValue(submission.needs)}</dd></div>
                <div><dt className="text-muted">Budget</dt><dd className="mt-1 capitalize text-white">{displayValue(submission.budget)}</dd></div>
              </dl>
              <p className="mt-5 whitespace-pre-wrap text-sm leading-7 text-white/90">{submission.message}</p>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
