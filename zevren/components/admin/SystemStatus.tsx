import type { Diagnostics } from "@/lib/server/diagnostics";

/**
 * Configuration health, at the top of the admin list.
 *
 * The failure this is here to catch is a quiet one: submissions arriving,
 * being stored, and never being mailed because a key is missing. Nothing on
 * the site says so, and the owner's only symptom is an inbox that stays
 * empty. This turns that into one line on the first screen they open.
 */
function Row({
  label,
  ok,
  detail,
}: {
  label: string;
  ok: boolean;
  detail: string;
}) {
  return (
    <div className="flex items-start justify-between gap-4 py-2">
      <span className="text-sm text-muted">{label}</span>
      <span className="flex items-center gap-2 text-end">
        <span className={`text-sm ${ok ? "text-white" : "text-red-300"}`}>{detail}</span>
        <span
          aria-hidden="true"
          className={`h-2 w-2 shrink-0 rounded-full ${ok ? "bg-emerald-400" : "bg-red-400"}`}
        />
      </span>
    </div>
  );
}

export function SystemStatus({ data }: { data: Diagnostics }) {
  const mailOk = data.mail.configured;
  const dbOk = data.database.configured && data.database.reachable;
  const allGood = mailOk && dbOk && data.submissions.notEmailed === 0;

  return (
    <section
      className={`rounded-2xl border p-5 ${
        allGood ? "border-white/10 bg-navy/50" : "border-red-500/40 bg-red-500/5"
      }`}
    >
      <h2 className="text-sm font-semibold uppercase tracking-[0.16em] text-white">
        System status
      </h2>

      <div className="mt-3 divide-y divide-white/5">
        <Row
          label="Database"
          ok={dbOk}
          detail={
            !data.database.configured
              ? "Not configured (DATABASE_URL missing)"
              : data.database.reachable
                ? "Connected"
                : `Unreachable: ${data.database.error ?? "unknown"}`
          }
        />
        <Row
          label="Email notifications"
          ok={mailOk}
          detail={
            mailOk
              ? `Sending to ${data.mail.inbox}`
              : !data.mail.apiKeySet
                ? "RESEND_API_KEY is not set"
                : "CONTACT_INBOX_EMAIL is not set"
          }
        />
        <Row label="Sender address" ok detail={data.mail.from} />
        <Row
          label="Submissions stored"
          ok
          detail={
            data.submissions.total === 0
              ? "None yet"
              : `${data.submissions.total} total, latest ${
                  data.submissions.latest
                    ? new Date(data.submissions.latest).toLocaleString("en-GB")
                    : "unknown"
                }`
          }
        />
        <Row
          label="Never emailed"
          ok={data.submissions.notEmailed === 0}
          detail={
            data.submissions.notEmailed === 0
              ? "None"
              : `${data.submissions.notEmailed} submission(s) reached nobody`
          }
        />
      </div>

      {!mailOk && (
        <p className="mt-4 rounded-lg bg-red-500/15 p-3 text-sm leading-relaxed text-red-200">
          Submissions are being stored but no email is being sent. Set the
          missing variable in the Vercel project settings, then redeploy.
          Nothing is lost in the meantime: every submission is in the list
          below.
        </p>
      )}
    </section>
  );
}
