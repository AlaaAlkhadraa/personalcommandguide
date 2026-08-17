"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";

import { useCsrfToken } from "@/lib/use-csrf-token";

/**
 * Admin sign-in. The form holds no secrets: the CSRF token it carries is
 * useless without the paired HttpOnly cookie, and the session cookie the
 * server sets is never readable from JavaScript.
 */
export function LoginForm({ csrfToken: initialToken }: { csrfToken: string | null }) {
  const csrfToken = useCsrfToken(initialToken);
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);

    setBusy(true);
    setError(null);

    try {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(csrfToken ? { "x-csrf-token": csrfToken } : {}),
        },
        credentials: "same-origin",
        body: JSON.stringify({
          email: String(data.get("email") ?? ""),
          password: String(data.get("password") ?? ""),
          csrfToken: csrfToken ?? undefined,
        }),
      });

      const payload = (await response.json().catch(() => null)) as { message?: string } | null;

      if (!response.ok) {
        setError(payload?.message ?? "Sign-in failed.");
        setBusy(false);
        return;
      }

      form.reset();
      router.replace("/admin");
      router.refresh();
    } catch {
      setError("Could not reach the server. Please try again.");
      setBusy(false);
    }
  }

  return (
    <div className="mx-auto flex w-full max-w-sm flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold text-white">Sign in</h1>
        <p className="mt-2 text-sm text-muted">This area is restricted to ZEVREN staff.</p>
      </div>

      {/* method="post" matters even though submitting is handled in JavaScript:
          if a click lands before hydration, the browser falls back to a native
          submit, and a GET would put the password in the URL, the history and
          the Referer header. */}
      <form onSubmit={onSubmit} method="post" noValidate className="flex flex-col gap-5">
        <div className="flex flex-col gap-2">
          <label htmlFor="admin-email" className="text-sm font-medium text-white">
            Email
          </label>
          <input
            id="admin-email"
            name="email"
            type="email"
            required
            autoComplete="username"
            className="rounded-lg border border-white/15 bg-surface px-4 py-3 text-sm text-white placeholder:text-muted/60 focus:border-accent"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="admin-password" className="text-sm font-medium text-white">
            Password
          </label>
          <input
            id="admin-password"
            name="password"
            type="password"
            required
            autoComplete="current-password"
            className="rounded-lg border border-white/15 bg-surface px-4 py-3 text-sm text-white focus:border-accent"
          />
        </div>

        {error && (
          <p role="alert" className="text-sm text-red-400">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={busy}
          className="rounded-full bg-primary px-6 py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-50"
        >
          {busy ? "Signing in..." : "Sign in"}
        </button>
      </form>
    </div>
  );
}
