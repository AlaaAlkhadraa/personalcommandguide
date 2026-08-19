"use client";

import { useState } from "react";

import { useCsrfToken } from "@/lib/use-csrf-token";

type State =
  | { status: "idle" }
  | { status: "sending" }
  | { status: "done"; sent: boolean; detail: string };

export function TestEmailButton({ csrfToken: initialToken }: { csrfToken: string | null }) {
  const csrfToken = useCsrfToken(initialToken);
  const [state, setState] = useState<State>({ status: "idle" });

  async function send() {
    setState({ status: "sending" });
    try {
      const response = await fetch("/api/admin/test-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(csrfToken ? { "x-csrf-token": csrfToken } : {}),
        },
        credentials: "same-origin",
        body: JSON.stringify({ csrfToken: csrfToken ?? undefined }),
      });
      const payload = (await response.json().catch(() => null)) as
        | { sent?: boolean; detail?: string; message?: string }
        | null;

      if (!response.ok) {
        setState({
          status: "done",
          sent: false,
          detail: payload?.message ?? `Request failed (${response.status}).`,
        });
        return;
      }
      setState({
        status: "done",
        sent: Boolean(payload?.sent),
        detail: payload?.detail ?? "No detail returned.",
      });
    } catch {
      setState({ status: "done", sent: false, detail: "Could not reach the server." });
    }
  }

  return (
    <div className="mt-4 flex flex-col gap-3">
      <button
        type="button"
        onClick={send}
        disabled={state.status === "sending"}
        className="w-fit rounded-full border border-white/15 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-white transition-colors hover:border-accent disabled:opacity-40"
      >
        {state.status === "sending" ? "Sending..." : "Send test email"}
      </button>

      {state.status === "done" && (
        <p
          className={`rounded-lg p-3 text-sm leading-relaxed ${
            state.sent ? "bg-emerald-500/15 text-emerald-200" : "bg-red-500/15 text-red-200"
          }`}
        >
          {/* The provider's own words, not a rewritten summary: the exact
              refusal is what tells the owner which setting to change. */}
          {state.sent ? "Sent. " : "Not sent. "}
          {state.detail}
        </p>
      )}
    </div>
  );
}
