"use client";

import { useState, type FormEvent } from "react";
import { SubmitButton } from "@/components/ui/Button";
import type { ContactFormValues } from "@/types";

type Status = "idle" | "loading" | "success" | "error";

const NEEDS_OPTIONS = [
  { value: "", label: "Select an option" },
  { value: "new-website", label: "New website" },
  { value: "redesign", label: "Website redesign" },
  { value: "online-store", label: "Online store" },
  { value: "web-application", label: "Web application" },
  { value: "maintenance", label: "Website maintenance" },
  { value: "not-sure", label: "Not sure yet" },
];

const BUDGET_OPTIONS = [
  { value: "", label: "Select an option (optional)" },
  { value: "under-1.5k", label: "Under €1,500" },
  { value: "1.5k-3k", label: "€1,500 to €3,000" },
  { value: "3k-5k", label: "€3,000 to €5,000" },
  { value: "5k-plus", label: "€5,000+" },
  { value: "not-sure", label: "Not sure yet" },
];

export function ContactForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [serverError, setServerError] = useState<string | null>(null);

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
    const payload: ContactFormValues = {
      name: String(formData.get("name") ?? ""),
      email: String(formData.get("email") ?? ""),
      company: String(formData.get("company") ?? ""),
      needs: String(formData.get("needs") ?? ""),
      budget: String(formData.get("budget") ?? ""),
      message: String(formData.get("message") ?? ""),
      website: String(formData.get("website") ?? ""),
    };

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        if (data?.fieldErrors) {
          setErrors(data.fieldErrors);
        } else {
          setServerError(
            data?.message ?? "Something went wrong. Please try again later."
          );
        }
        setStatus("error");
        return;
      }

      setStatus("success");
      form.reset();
    } catch {
      setServerError(
        "Couldn't connect. Check your internet connection and try again."
      );
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div
        role="status"
        className="flex flex-col gap-3 rounded-2xl border border-primary/30 bg-primary/10 p-8 text-center"
      >
        <h2 className="text-xl font-semibold text-white">Message sent</h2>
        <p className="text-sm text-muted">
          Thanks for reaching out. We typically reply within one business day.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-6">
      {/* Honeypot field, hidden from real visitors via off-screen
          positioning (not display:none, which some bots skip), and never
          reachable by keyboard. Any value here marks the submission spam. */}
      <div className="absolute left-[-9999px] top-auto" aria-hidden="true">
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
            Name <span aria-hidden="true">*</span>
          </label>
          <input
            id="name"
            name="name"
            type="text"
            required
            autoComplete="name"
            aria-invalid={Boolean(errors.name)}
            aria-describedby={errors.name ? "name-error" : undefined}
            className="rounded-lg border border-white/15 bg-surface px-4 py-3 text-sm text-white placeholder:text-muted/60 focus:border-accent"
            placeholder="Your name"
          />
          {errors.name && (
            <p id="name-error" className="text-sm text-red-400">
              {errors.name}
            </p>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="email" className="text-sm font-medium text-white">
            Email address <span aria-hidden="true">*</span>
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            autoComplete="email"
            aria-invalid={Boolean(errors.email)}
            aria-describedby={errors.email ? "email-error" : undefined}
            className="rounded-lg border border-white/15 bg-surface px-4 py-3 text-sm text-white placeholder:text-muted/60 focus:border-accent"
            placeholder="you@company.com"
          />
          {errors.email && (
            <p id="email-error" className="text-sm text-red-400">
              {errors.email}
            </p>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="company" className="text-sm font-medium text-white">
            Company
          </label>
          <input
            id="company"
            name="company"
            type="text"
            autoComplete="organization"
            className="rounded-lg border border-white/15 bg-surface px-4 py-3 text-sm text-white placeholder:text-muted/60 focus:border-accent"
            placeholder="Optional"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="needs" className="text-sm font-medium text-white">
            What do you need?
          </label>
          <select
            id="needs"
            name="needs"
            defaultValue=""
            className="rounded-lg border border-white/15 bg-surface px-4 py-3 text-sm text-white focus:border-accent"
          >
            {NEEDS_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-2 sm:col-span-2">
          <label htmlFor="budget" className="text-sm font-medium text-white">
            Budget
          </label>
          <select
            id="budget"
            name="budget"
            defaultValue=""
            className="rounded-lg border border-white/15 bg-surface px-4 py-3 text-sm text-white focus:border-accent sm:max-w-xs"
          >
            {BUDGET_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="message" className="text-sm font-medium text-white">
          Tell us about your project <span aria-hidden="true">*</span>
        </label>
        <textarea
          id="message"
          name="message"
          required
          rows={6}
          aria-invalid={Boolean(errors.message)}
          aria-describedby={errors.message ? "message-error" : undefined}
          className="resize-none rounded-lg border border-white/15 bg-surface px-4 py-3 text-sm text-white placeholder:text-muted/60 focus:border-accent"
          placeholder="What are you running into, and what do you want to achieve?"
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
        {status === "loading" ? "Sending…" : "Send message"}
      </SubmitButton>

      <p className="text-xs text-muted">
        By submitting this form you agree to our{" "}
        <a href="/privacy-policy" className="underline hover:text-white">
          privacy policy
        </a>
        .
      </p>
    </form>
  );
}
