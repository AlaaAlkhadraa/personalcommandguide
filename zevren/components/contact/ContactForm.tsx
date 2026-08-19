"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { Icon } from "@/components/ui/Icon";
import { SubmitButton } from "@/components/ui/Button";
import type { ContactFormValues } from "@/types";
import type { Dictionary } from "@/lib/i18n/dictionary-type";

type Status = "idle" | "loading" | "success" | "error";

const NEEDS_VALUES = [
  "",
  "new-website",
  "redesign",
  "online-store",
  "web-application",
  "maintenance",
  "not-sure",
];

const BUDGET_VALUES = ["", "under-800", "800-1.5k", "1.5k-3k", "3k-plus", "not-sure"];

/** Reads the locale cookie so the submission is stored with its language. */
function readLocale(): string | undefined {
  if (typeof document === "undefined") return undefined;
  const match = document.cookie.match(/(?:^|;\s*)zevren_locale=([a-z]{2})(?:;|$)/);
  return match?.[1];
}

export function ContactForm({ dict }: { dict: Dictionary["contact"]["form"] }) {
  const [status, setStatus] = useState<Status>("idle");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [serverError, setServerError] = useState<string | null>(null);
  // CSRF token paired with an HttpOnly cookie the server sets. It is not a
  // secret on its own: without the cookie it cannot authorise anything.
  const [csrfToken, setCsrfToken] = useState<string | null>(null);
  // Preselected from the campaign links. Validated against the option list
  // below before it is used, so a crafted URL cannot inject a value.
  const [needs, setNeeds] = useState("");
  const [campaign, setCampaign] = useState<string | null>(null);
  const mountedAt = useRef<number>(Date.now());

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const type = params.get("type");
    if (type && NEEDS_VALUES.includes(type)) setNeeds(type);
    if (params.get("campaign") === "founding-10") setCampaign("founding-10");
  }, []);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/csrf", { credentials: "same-origin" })
      .then((response) => (response.ok ? response.json() : null))
      .then((data: { token?: string } | null) => {
        if (!cancelled && data?.token) setCsrfToken(data.token);
      })
      .catch(() => {
        // Leave the token unset: the submit below surfaces a reload prompt
        // rather than silently posting something the server will refuse.
      });
    return () => {
      cancelled = true;
    };
  }, []);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    // The DOM nulls event.currentTarget once synchronous dispatch finishes,
    // so it must be captured now. Reading it after the awaits below would
    // throw when calling form.reset() and get mistaken for a network error.
    const form = event.currentTarget;
    setStatus("loading");
    setErrors({});
    setServerError(null);

    const formData = new FormData(form);
    const payload: ContactFormValues & {
      csrfToken?: string;
      elapsedMs: number;
      locale?: string;
      campaign?: string;
    } = {
      name: String(formData.get("name") ?? ""),
      email: String(formData.get("email") ?? ""),
      company: String(formData.get("company") ?? ""),
      needs: String(formData.get("needs") ?? ""),
      budget: String(formData.get("budget") ?? ""),
      projectInfo: String(formData.get("projectInfo") ?? ""),
      message: String(formData.get("message") ?? ""),
      website: String(formData.get("website") ?? ""),
      csrfToken: csrfToken ?? undefined,
      elapsedMs: Date.now() - mountedAt.current,
      locale: readLocale(),
      ...(campaign ? { campaign } : {}),
    };

    // A filled needs or budget makes this a project brief rather than a plain
    // message, so it goes to the endpoint that records it as one.
    const endpoint =
      payload.needs || payload.budget || payload.projectInfo
        ? "/api/project-request"
        : "/api/contact";

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(csrfToken ? { "x-csrf-token": csrfToken } : {}),
        },
        credentials: "same-origin",
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        if (data?.fieldErrors) {
          setErrors(data.fieldErrors);
        } else {
          setServerError(data?.message ?? dict.genericError);
        }
        setStatus("error");
        return;
      }

      setStatus("success");
      form.reset();
    } catch {
      setServerError(dict.connectError);
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div
        role="status"
        className="flex flex-col gap-3 rounded-2xl border border-primary/30 bg-primary/10 p-8 text-center"
      >
        <h2 className="text-xl font-semibold text-white">{dict.successTitle}</h2>
        <p className="text-sm text-muted">{dict.successBody}</p>
      </div>
    );
  }

  // Submitting runs in JavaScript, but a click landing before hydration falls
  // back to a native submit; method="post" keeps the message out of the URL.
  return (
    <form onSubmit={handleSubmit} method="post" noValidate className="flex flex-col gap-6">
      {/* Honeypot field, hidden from real visitors via the clip pattern
          (not display:none, which some bots skip), and never reachable by
          keyboard. Any value here marks the submission spam. Clip rather
          than off-screen positioning: left:-9999px extends the scrollable
          area in RTL documents and gave the Arabic page a 9999px
          horizontal scroll. */}
      <div className="sr-only" aria-hidden="true">
        <label htmlFor="website">Website</label>
        <input
          type="text"
          id="website"
          name="website"
          tabIndex={-1}
          autoComplete="off"
        />
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <div className="flex flex-col gap-2">
          <label htmlFor="name" className="text-sm font-medium text-white">
            {dict.nameLabel} <span aria-hidden="true">*</span>
          </label>
          <span className="relative block">
            <span className="pointer-events-none absolute inset-y-0 start-0 flex w-11 items-center justify-center text-muted/70">
              <Icon name="user" className="h-4 w-4" />
            </span>
            <input
            id="name"
            name="name"
            type="text"
            required
            autoComplete="name"
            aria-invalid={Boolean(errors.name)}
            aria-describedby={errors.name ? "name-error" : undefined}
            className="w-full rounded-lg border border-white/15 bg-surface px-4 ps-11 py-3 text-sm text-white placeholder:text-muted/60 focus:border-accent"
            placeholder={dict.namePlaceholder}
          />
          </span>
          {errors.name && (
            <p id="name-error" className="text-sm text-red-400">
              {errors.name}
            </p>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="email" className="text-sm font-medium text-white">
            {dict.emailLabel} <span aria-hidden="true">*</span>
          </label>
          <span className="relative block">
            <span className="pointer-events-none absolute inset-y-0 start-0 flex w-11 items-center justify-center text-muted/70">
              <Icon name="mail" className="h-4 w-4" />
            </span>
            <input
            id="email"
            name="email"
            type="email"
            required
            autoComplete="email"
            aria-invalid={Boolean(errors.email)}
            aria-describedby={errors.email ? "email-error" : undefined}
            className="w-full rounded-lg border border-white/15 bg-surface px-4 ps-11 py-3 text-sm text-white placeholder:text-muted/60 focus:border-accent"
            placeholder={dict.emailPlaceholder}
          />
          </span>
          {errors.email && (
            <p id="email-error" className="text-sm text-red-400">
              {errors.email}
            </p>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="company" className="text-sm font-medium text-white">
            {dict.companyLabel}
          </label>
          <span className="relative block">
            <span className="pointer-events-none absolute inset-y-0 start-0 flex w-11 items-center justify-center text-muted/70">
              <Icon name="building" className="h-4 w-4" />
            </span>
            <input
            id="company"
            name="company"
            type="text"
            autoComplete="organization"
            className="w-full rounded-lg border border-white/15 bg-surface px-4 ps-11 py-3 text-sm text-white placeholder:text-muted/60 focus:border-accent"
            placeholder={dict.companyPlaceholder}
          />
          </span>
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="needs" className="text-sm font-medium text-white">
            {dict.needsLabel}
          </label>
          <select
            id="needs"
            name="needs"
            value={needs}
            onChange={(event) => setNeeds(event.target.value)}
            className="rounded-lg border border-white/15 bg-surface px-4 py-3 text-sm text-white focus:border-accent"
          >
            {dict.needsOptions.map((label, index) => (
              <option key={NEEDS_VALUES[index]} value={NEEDS_VALUES[index]}>
                {label}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-2 sm:col-span-2">
          <label htmlFor="budget" className="text-sm font-medium text-white">
            {dict.budgetLabel}
          </label>
          <select
            id="budget"
            name="budget"
            defaultValue=""
            className="rounded-lg border border-white/15 bg-surface px-4 py-3 text-sm text-white focus:border-accent sm:max-w-xs"
          >
            {dict.budgetOptions.map((label, index) => (
              <option key={BUDGET_VALUES[index]} value={BUDGET_VALUES[index]}>
                {label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="projectInfo" className="text-sm font-medium text-white">
          {dict.projectInfoLabel}
        </label>
        <textarea
          id="projectInfo"
          name="projectInfo"
          rows={4}
          aria-invalid={Boolean(errors.projectInfo)}
          aria-describedby={
            errors.projectInfo ? "projectInfo-error" : "projectInfo-hint"
          }
          className="resize-none rounded-lg border border-white/15 bg-surface px-4 py-3 text-sm text-white placeholder:text-muted/60 focus:border-accent"
          placeholder={dict.projectInfoPlaceholder}
        />
        <p id="projectInfo-hint" className="text-xs text-muted">
          {dict.projectInfoHint}
        </p>
        {errors.projectInfo && (
          <p id="projectInfo-error" className="text-sm text-red-400">
            {errors.projectInfo}
          </p>
        )}
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="message" className="text-sm font-medium text-white">
          {dict.messageLabel} <span aria-hidden="true">*</span>
        </label>
        <textarea
          id="message"
          name="message"
          required
          rows={6}
          aria-invalid={Boolean(errors.message)}
          aria-describedby={errors.message ? "message-error" : undefined}
          className="resize-none rounded-lg border border-white/15 bg-surface px-4 py-3 text-sm text-white placeholder:text-muted/60 focus:border-accent"
          placeholder={dict.messagePlaceholder}
        />
        {errors.message && (
          <p id="message-error" className="text-sm text-red-400">
            {errors.message}
          </p>
        )}
      </div>

      {serverError && (
        <p role="alert" className="text-sm text-red-400">
          {serverError}
        </p>
      )}

      <SubmitButton
        type="submit"
        disabled={status === "loading"}
        className="w-full sm:w-fit"
      >
        {status === "loading" ? dict.sendingButton : dict.sendButton}
      </SubmitButton>

      <p className="text-xs text-muted">
        {dict.privacyPrefix}{" "}
        <a href="/privacy-policy" className="underline hover:text-white">
          {dict.privacyLink}
        </a>
        .
      </p>
    </form>
  );
}
