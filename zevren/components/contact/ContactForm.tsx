"use client";

import { useState, type FormEvent } from "react";
import { SubmitButton } from "@/components/ui/Button";
import type { ContactFormValues } from "@/types";

type Status = "idle" | "loading" | "success" | "error";

const BUDGET_OPTIONS = [
  { value: "", label: "Maak een keuze (optioneel)" },
  { value: "onder-5k", label: "Onder €5.000" },
  { value: "5k-10k", label: "€5.000 – €10.000" },
  { value: "10k-25k", label: "€10.000 – €25.000" },
  { value: "boven-25k", label: "Boven €25.000" },
];

export function ContactForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [serverError, setServerError] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("loading");
    setErrors({});
    setServerError(null);

    const formData = new FormData(event.currentTarget);
    const payload: ContactFormValues = {
      name: String(formData.get("name") ?? ""),
      email: String(formData.get("email") ?? ""),
      company: String(formData.get("company") ?? ""),
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
            data?.message ?? "Er ging iets mis. Probeer het later opnieuw."
          );
        }
        setStatus("error");
        return;
      }

      setStatus("success");
      event.currentTarget.reset();
    } catch {
      setServerError(
        "Er kon geen verbinding worden gemaakt. Controleer je internetverbinding en probeer het opnieuw."
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
        <h2 className="text-xl font-semibold text-white">Bericht verstuurd</h2>
        <p className="text-sm text-muted">
          Bedankt voor je bericht. We reageren doorgaans binnen één werkdag.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-6">
      {/* Honeypot field — hidden from real visitors via off-screen
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
            Naam <span aria-hidden="true">*</span>
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
            placeholder="Jouw naam"
          />
          {errors.name && (
            <p id="name-error" className="text-sm text-red-400">
              {errors.name}
            </p>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="email" className="text-sm font-medium text-white">
            E-mailadres <span aria-hidden="true">*</span>
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
            placeholder="jij@bedrijf.nl"
          />
          {errors.email && (
            <p id="email-error" className="text-sm text-red-400">
              {errors.email}
            </p>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="company" className="text-sm font-medium text-white">
            Bedrijfsnaam
          </label>
          <input
            id="company"
            name="company"
            type="text"
            autoComplete="organization"
            className="rounded-lg border border-white/15 bg-surface px-4 py-3 text-sm text-white placeholder:text-muted/60 focus:border-accent"
            placeholder="Optioneel"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="budget" className="text-sm font-medium text-white">
            Indicatie budget
          </label>
          <select
            id="budget"
            name="budget"
            defaultValue=""
            className="rounded-lg border border-white/15 bg-surface px-4 py-3 text-sm text-white focus:border-accent"
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
          Vertel iets over je project <span aria-hidden="true">*</span>
        </label>
        <textarea
          id="message"
          name="message"
          required
          rows={6}
          aria-invalid={Boolean(errors.message)}
          aria-describedby={errors.message ? "message-error" : undefined}
          className="resize-none rounded-lg border border-white/15 bg-surface px-4 py-3 text-sm text-white placeholder:text-muted/60 focus:border-accent"
          placeholder="Waar loop je tegenaan, en wat wil je bereiken?"
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
        {status === "loading" ? "Bezig met versturen…" : "Verstuur bericht"}
      </SubmitButton>

      <p className="text-xs text-muted">
        Door dit formulier te versturen ga je akkoord met ons{" "}
        <a href="/privacy-policy" className="underline hover:text-white">
          privacybeleid
        </a>
        .
      </p>
    </form>
  );
}
