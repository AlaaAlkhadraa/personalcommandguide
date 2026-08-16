"use client";

import { useState } from "react";
import {
  TAJEX_SERVICES,
  TAJEX_ROUTE,
  TAJEX_STATS,
  TAJEX_CARGO_TYPES,
  TAJEX_DEMO_SHIPMENT,
  TAJEX_BLOG_POSTS,
  type TajexService,
} from "@/lib/demos/tajex-data";
import type { Dictionary } from "@/lib/i18n/dictionary-type";

type View = "home" | "about" | "services" | "service-detail" | "tracking" | "quote" | "contact" | "blog";

interface QuoteForm {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  cargoType: string;
  origin: string;
  destination: string;
  details: string;
  comments: string;
}

const EMPTY_QUOTE: QuoteForm = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  cargoType: "",
  origin: "",
  destination: "",
  details: "",
  comments: "",
};

interface TajexDemoProps {
  common: Dictionary["demoCommon"];
}

export function TajexDemo({ common }: TajexDemoProps) {
  const [view, setView] = useState<View>("home");
  const [activeService, setActiveService] = useState<TajexService | null>(null);
  const [trackingInput, setTrackingInput] = useState("");
  const [trackingResult, setTrackingResult] = useState<"idle" | "found" | "not-found">("idle");
  const [quoteForm, setQuoteForm] = useState<QuoteForm>(EMPTY_QUOTE);
  const [quoteErrors, setQuoteErrors] = useState<Partial<QuoteForm>>({});
  const [quoteSubmitted, setQuoteSubmitted] = useState(false);

  function openService(id: string) {
    const service = TAJEX_SERVICES.find((s) => s.id === id);
    if (service) {
      setActiveService(service);
      setView("service-detail");
    }
  }

  function handleTrackingSearch() {
    const ref = trackingInput.trim().toUpperCase();
    if (ref === TAJEX_DEMO_SHIPMENT.reference) {
      setTrackingResult("found");
    } else {
      setTrackingResult("not-found");
    }
  }

  function updateQuote<K extends keyof QuoteForm>(key: K, value: string) {
    setQuoteForm((f) => ({ ...f, [key]: value }));
  }

  function handleQuoteSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const errors: Partial<QuoteForm> = {};
    if (quoteForm.firstName.trim().length < 2) errors.firstName = "Vul je voornaam in.";
    if (!/^\S+@\S+\.\S+$/.test(quoteForm.email)) errors.email = "Vul een geldig e-mailadres in.";
    if (quoteForm.phone.trim().length < 6) errors.phone = "Vul een geldig telefoonnummer in.";
    if (!quoteForm.cargoType) errors.cargoType = "Kies een type lading.";
    if (quoteForm.origin.trim().length < 2) errors.origin = "Vul de herkomst in.";
    if (quoteForm.destination.trim().length < 2) errors.destination = "Vul de bestemming in.";
    setQuoteErrors(errors);
    if (Object.keys(errors).length === 0) {
      setQuoteSubmitted(true);
    }
  }

  function resetQuote() {
    setQuoteForm(EMPTY_QUOTE);
    setQuoteErrors({});
    setQuoteSubmitted(false);
    setView("home");
  }

  const NAV: { id: View; label: string }[] = [
    { id: "home", label: "Home" },
    { id: "about", label: "Over ons" },
    { id: "services", label: "Diensten" },
    { id: "blog", label: "Blog" },
    { id: "tracking", label: "Tracking" },
    { id: "contact", label: "Contact" },
  ];

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-950 text-slate-100">
      {/* Navigation */}
      <nav className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 bg-slate-950/95 px-5 py-4 sm:px-8">
        <button
          type="button"
          onClick={() => setView("home")}
          className="flex items-center gap-2 font-heading text-lg font-semibold tracking-wide text-white"
        >
          TAJEX <span className="text-emerald-400">LOGISTICS</span>
        </button>
        <div className="hidden flex-wrap items-center gap-5 text-sm text-slate-400 lg:flex">
          {NAV.map((n) => (
            <button
              key={n.id}
              type="button"
              onClick={() => setView(n.id)}
              className={`transition-colors hover:text-white ${
                view === n.id || (n.id === "services" && view === "service-detail")
                  ? "text-emerald-400"
                  : ""
              }`}
            >
              {n.label}
            </button>
          ))}
        </div>
        <button
          type="button"
          onClick={() => setView("quote")}
          className="rounded-md bg-emerald-500 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-slate-950 transition-colors hover:bg-emerald-400"
        >
          Offerte aanvragen
        </button>
      </nav>

      {/* Mobile nav */}
      <div className="flex flex-wrap gap-3 border-b border-slate-800 bg-slate-950 px-5 py-3 text-xs text-slate-400 lg:hidden">
        {NAV.map((n) => (
          <button
            key={n.id}
            type="button"
            onClick={() => setView(n.id)}
            className={`rounded-full border px-3 py-1.5 transition-colors ${
              view === n.id || (n.id === "services" && view === "service-detail")
                ? "border-emerald-400 text-emerald-400"
                : "border-slate-700 text-slate-400"
            }`}
          >
            {n.label}
          </button>
        ))}
      </div>

      {view === "home" && (
        <>
          {/* Hero */}
          <section className="border-b border-slate-800 bg-[radial-gradient(circle_at_85%_10%,rgba(16,185,129,0.10),transparent_50%)] px-5 py-14 sm:px-8 sm:py-20">
            <span className="text-xs font-semibold uppercase tracking-[0.3em] text-emerald-400">
              International logistics
            </span>
            <h2 className="mt-4 max-w-xl font-heading text-3xl font-semibold leading-tight text-white sm:text-4xl">
              Jouw zending, betrouwbaar geregeld.
            </h2>
            <p className="mt-4 max-w-lg text-sm leading-relaxed text-slate-400">
              RoRo transport, containers, forwarding en douaneformaliteiten
              tussen Europa en het Midden-Oosten.
            </p>

            <div className="mt-8 flex flex-wrap gap-8">
              {TAJEX_STATS.map((s) => (
                <div key={s.label}>
                  <p className="text-2xl font-semibold text-white">{s.value}</p>
                  <p className="text-xs text-slate-500">{s.label}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Route */}
          <section className="border-b border-slate-800 px-5 py-10 sm:px-8">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-emerald-400">
              Trade route
            </p>
            <div className="mt-6 flex items-center overflow-x-auto pb-2">
              {TAJEX_ROUTE.map((stop, i) => (
                <div key={stop} className="flex shrink-0 items-center">
                  <div className="flex flex-col items-center gap-2">
                    <span className="h-3 w-3 rounded-full bg-emerald-400" />
                    <span className="whitespace-nowrap text-xs font-medium text-slate-300">{stop}</span>
                  </div>
                  {i < TAJEX_ROUTE.length - 1 && (
                    <span className="mx-2 h-px w-12 shrink-0 bg-gradient-to-r from-emerald-400/60 to-emerald-400/10 sm:w-20" />
                  )}
                </div>
              ))}
            </div>
          </section>

          {/* Cargo type picker */}
          <section className="border-b border-slate-800 px-5 py-12 sm:px-8">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-emerald-400">
              Wat wil je verschepen?
            </p>
            <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {TAJEX_CARGO_TYPES.map((c) => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => openService(c.serviceId)}
                  className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 text-left transition-colors hover:border-emerald-400/50"
                >
                  <span className="text-sm font-medium text-white">{c.label}</span>
                </button>
              ))}
            </div>
          </section>

          {/* Services grid */}
          <section className="px-5 py-12 sm:px-8">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-emerald-400">
              Diensten
            </p>
            <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {TAJEX_SERVICES.map((s) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => openService(s.id)}
                  className="rounded-xl border border-slate-800 bg-slate-900/40 p-5 text-left transition-colors hover:border-emerald-400/50"
                >
                  <p className="text-sm font-semibold text-white">{s.name}</p>
                  <p className="mt-1.5 text-xs leading-relaxed text-slate-500">{s.tagline}</p>
                </button>
              ))}
            </div>
          </section>
        </>
      )}

      {view === "about" && (
        <section className="px-5 py-14 sm:px-8">
          <h2 className="font-heading text-2xl font-semibold text-white">Over ons</h2>
          <p className="mt-4 max-w-2xl text-sm leading-relaxed text-slate-400">
            Tajex Logistics regelt internationaal transport tussen Europa en
            het Midden-Oosten, met vertrekpunten in Rotterdam en Antwerpen.
            Van een enkele auto tot volledige containerladingen, wij
            coördineren het traject inclusief douaneformaliteiten.
          </p>
          <div className="mt-8 flex flex-wrap gap-8">
            {TAJEX_STATS.map((s) => (
              <div key={s.label}>
                <p className="text-2xl font-semibold text-white">{s.value}</p>
                <p className="text-xs text-slate-500">{s.label}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {view === "services" && (
        <section className="px-5 py-14 sm:px-8">
          <h2 className="font-heading text-2xl font-semibold text-white">Diensten</h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {TAJEX_SERVICES.map((s) => (
              <button
                key={s.id}
                type="button"
                onClick={() => openService(s.id)}
                className="rounded-xl border border-slate-800 bg-slate-900/40 p-5 text-left transition-colors hover:border-emerald-400/50"
              >
                <p className="text-sm font-semibold text-white">{s.name}</p>
                <p className="mt-1.5 text-xs leading-relaxed text-slate-500">{s.tagline}</p>
              </button>
            ))}
          </div>
        </section>
      )}

      {view === "service-detail" && activeService && (
        <section className="px-5 py-14 sm:px-8">
          <button
            type="button"
            onClick={() => setView("services")}
            className="mb-6 text-xs font-medium text-slate-500 hover:text-emerald-400"
          >
            &larr; {common.back}
          </button>
          <span className="text-xs font-semibold uppercase tracking-[0.3em] text-emerald-400">
            {activeService.tagline}
          </span>
          <h2 className="mt-3 font-heading text-2xl font-semibold text-white sm:text-3xl">
            {activeService.name}
          </h2>
          <p className="mt-4 max-w-2xl text-sm leading-relaxed text-slate-400">
            {activeService.description}
          </p>
          <ul className="mt-6 grid gap-2.5 sm:grid-cols-2">
            {activeService.details.map((d) => (
              <li key={d} className="flex items-start gap-2 text-sm text-slate-300">
                <svg viewBox="0 0 20 20" className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" fill="none" stroke="currentColor" strokeWidth={2}>
                  <path d="m4 10 4 4 8-8" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                {d}
              </li>
            ))}
          </ul>
          <button
            type="button"
            onClick={() => setView("quote")}
            className="mt-8 rounded-md bg-emerald-500 px-6 py-3 text-sm font-semibold text-slate-950 transition-colors hover:bg-emerald-400"
          >
            Offerte aanvragen
          </button>
        </section>
      )}

      {view === "blog" && (
        <section className="px-5 py-14 sm:px-8">
          <h2 className="font-heading text-2xl font-semibold text-white">Blog</h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            {TAJEX_BLOG_POSTS.map((post) => (
              <div key={post.title} className="rounded-xl border border-slate-800 bg-slate-900/40 p-5">
                <p className="text-sm font-semibold text-white">{post.title}</p>
                <p className="mt-2 text-xs leading-relaxed text-slate-500">{post.excerpt}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {view === "tracking" && (
        <section className="px-5 py-14 sm:px-8">
          <h2 className="font-heading text-2xl font-semibold text-white">Track & Trace</h2>
          <p className="mt-2 max-w-md text-sm text-slate-400">
            Voer je referentienummer in om de status van je zending te bekijken.
          </p>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <input
              value={trackingInput}
              onChange={(e) => setTrackingInput(e.target.value)}
              placeholder="TJX-0000-0000"
              className="w-full max-w-xs rounded-md border border-slate-700 bg-slate-900 px-3 py-2.5 text-sm text-slate-100 outline-none focus:border-emerald-400 sm:w-64"
            />
            <button
              type="button"
              onClick={handleTrackingSearch}
              className="w-fit rounded-md bg-emerald-500 px-5 py-2.5 text-sm font-semibold text-slate-950 transition-colors hover:bg-emerald-400"
            >
              Zoek zending
            </button>
          </div>
          <p className="mt-2 text-[11px] text-slate-600">
            Demo track &amp; trace, niet gekoppeld aan het echte Tajex-systeem. Probeer TJX-2025-0448.
          </p>

          {trackingResult === "not-found" && (
            <p className="mt-6 text-sm text-red-400">
              Geen zending gevonden. Controleer je referentienummer.
            </p>
          )}

          {trackingResult === "found" && (
            <div className="mt-8 flex flex-col gap-6">
              <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-5 text-sm text-slate-300">
                <p>
                  <span className="text-slate-500">Referentie:</span> {TAJEX_DEMO_SHIPMENT.reference}
                </p>
                <p className="mt-1">
                  <span className="text-slate-500">Route:</span> {TAJEX_DEMO_SHIPMENT.origin} &rarr; {TAJEX_DEMO_SHIPMENT.destination}
                </p>
                <p className="mt-1">
                  <span className="text-slate-500">Lading:</span> {TAJEX_DEMO_SHIPMENT.cargo}
                </p>
              </div>
              <div className="flex flex-col gap-4">
                {TAJEX_DEMO_SHIPMENT.events.map((ev, i) => (
                  <div key={ev.label} className="flex items-center gap-3">
                    <span
                      className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs ${
                        ev.done ? "bg-emerald-500 text-slate-950" : "border border-slate-700 text-slate-600"
                      }`}
                    >
                      {ev.done ? (
                        <svg viewBox="0 0 20 20" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth={3}>
                          <path d="m4 10 4 4 8-8" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      ) : (
                        i + 1
                      )}
                    </span>
                    <span className={`text-sm ${ev.done ? "text-white" : "text-slate-500"}`}>{ev.label}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </section>
      )}

      {view === "quote" && (
        <section className="px-5 py-14 sm:px-8">
          {!quoteSubmitted ? (
            <>
              <h2 className="font-heading text-2xl font-semibold text-white">Offerte aanvragen</h2>
              <form onSubmit={handleQuoteSubmit} className="mt-6 grid max-w-2xl gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-slate-500">Voornaam</label>
                  <input
                    value={quoteForm.firstName}
                    onChange={(e) => updateQuote("firstName", e.target.value)}
                    className="w-full rounded-md border border-slate-700 bg-slate-900 px-3 py-2.5 text-sm text-slate-100 outline-none focus:border-emerald-400"
                  />
                  {quoteErrors.firstName && <p className="mt-1 text-xs text-red-400">{quoteErrors.firstName}</p>}
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-slate-500">Achternaam</label>
                  <input
                    value={quoteForm.lastName}
                    onChange={(e) => updateQuote("lastName", e.target.value)}
                    className="w-full rounded-md border border-slate-700 bg-slate-900 px-3 py-2.5 text-sm text-slate-100 outline-none focus:border-emerald-400"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-slate-500">E-mail</label>
                  <input
                    value={quoteForm.email}
                    onChange={(e) => updateQuote("email", e.target.value)}
                    className="w-full rounded-md border border-slate-700 bg-slate-900 px-3 py-2.5 text-sm text-slate-100 outline-none focus:border-emerald-400"
                    placeholder="naam@bedrijf.nl"
                  />
                  {quoteErrors.email && <p className="mt-1 text-xs text-red-400">{quoteErrors.email}</p>}
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-slate-500">Telefoon</label>
                  <input
                    value={quoteForm.phone}
                    onChange={(e) => updateQuote("phone", e.target.value)}
                    className="w-full rounded-md border border-slate-700 bg-slate-900 px-3 py-2.5 text-sm text-slate-100 outline-none focus:border-emerald-400"
                    placeholder="06 12345678"
                  />
                  {quoteErrors.phone && <p className="mt-1 text-xs text-red-400">{quoteErrors.phone}</p>}
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-slate-500">Cargo type</label>
                  <select
                    value={quoteForm.cargoType}
                    onChange={(e) => updateQuote("cargoType", e.target.value)}
                    className="w-full rounded-md border border-slate-700 bg-slate-900 px-3 py-2.5 text-sm text-slate-100 outline-none focus:border-emerald-400"
                  >
                    <option value="">Kies een type</option>
                    {TAJEX_CARGO_TYPES.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.label}
                      </option>
                    ))}
                  </select>
                  {quoteErrors.cargoType && <p className="mt-1 text-xs text-red-400">{quoteErrors.cargoType}</p>}
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="mb-1.5 block text-xs font-medium text-slate-500">Origin</label>
                    <input
                      value={quoteForm.origin}
                      onChange={(e) => updateQuote("origin", e.target.value)}
                      className="w-full rounded-md border border-slate-700 bg-slate-900 px-3 py-2.5 text-sm text-slate-100 outline-none focus:border-emerald-400"
                      placeholder="Rotterdam"
                    />
                    {quoteErrors.origin && <p className="mt-1 text-xs text-red-400">{quoteErrors.origin}</p>}
                  </div>
                  <div>
                    <label className="mb-1.5 block text-xs font-medium text-slate-500">Destination</label>
                    <input
                      value={quoteForm.destination}
                      onChange={(e) => updateQuote("destination", e.target.value)}
                      className="w-full rounded-md border border-slate-700 bg-slate-900 px-3 py-2.5 text-sm text-slate-100 outline-none focus:border-emerald-400"
                      placeholder="Latakia"
                    />
                    {quoteErrors.destination && <p className="mt-1 text-xs text-red-400">{quoteErrors.destination}</p>}
                  </div>
                </div>
                <div className="sm:col-span-2">
                  <label className="mb-1.5 block text-xs font-medium text-slate-500">
                    Vehicle / cargo details
                  </label>
                  <textarea
                    value={quoteForm.details}
                    onChange={(e) => updateQuote("details", e.target.value)}
                    rows={2}
                    className="w-full rounded-md border border-slate-700 bg-slate-900 px-3 py-2.5 text-sm text-slate-100 outline-none focus:border-emerald-400"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="mb-1.5 block text-xs font-medium text-slate-500">Comments</label>
                  <textarea
                    value={quoteForm.comments}
                    onChange={(e) => updateQuote("comments", e.target.value)}
                    rows={2}
                    className="w-full rounded-md border border-slate-700 bg-slate-900 px-3 py-2.5 text-sm text-slate-100 outline-none focus:border-emerald-400"
                  />
                </div>
                <button
                  type="submit"
                  className="mt-2 w-fit rounded-md bg-emerald-500 px-6 py-3 text-sm font-semibold text-slate-950 transition-colors hover:bg-emerald-400 sm:col-span-2"
                >
                  Verstuur aanvraag
                </button>
              </form>
            </>
          ) : (
            <div className="flex flex-col items-start gap-3 rounded-xl border border-slate-800 bg-slate-900/40 p-8">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-400">
                <svg viewBox="0 0 20 20" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={2}>
                  <path d="m4 10 4 4 8-8" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <p className="text-base font-semibold text-white">Bedankt &mdash; je aanvraag is verstuurd.</p>
              <p className="text-sm text-slate-400">We nemen zo snel mogelijk contact met je op.</p>
              <button
                type="button"
                onClick={resetQuote}
                className="mt-2 rounded-full border border-slate-700 px-5 py-2 text-xs font-semibold uppercase tracking-wider text-slate-300 transition-colors hover:border-emerald-400/60"
              >
                {common.back}
              </button>
            </div>
          )}
        </section>
      )}

      {view === "contact" && (
        <section className="px-5 py-14 sm:px-8">
          <h2 className="font-heading text-2xl font-semibold text-white">Contact</h2>
          <div className="mt-6 flex flex-col gap-2 text-sm text-slate-400">
            <p>Rotterdam, Nederland</p>
            <p>info@tajexlogistics.nl</p>
            <p>+31 10 000 0000</p>
          </div>
          <button
            type="button"
            onClick={() => setView("quote")}
            className="mt-6 w-fit rounded-md bg-emerald-500 px-6 py-3 text-sm font-semibold text-slate-950 transition-colors hover:bg-emerald-400"
          >
            Offerte aanvragen
          </button>
        </section>
      )}

      {/* Footer */}
      <footer className="border-t border-slate-800 px-5 py-6 text-center text-xs text-slate-500 sm:px-8">
        Tajex Logistics &middot;{" "}
        <a
          href="https://tajexlogistics.nl"
          target="_blank"
          rel="noopener noreferrer"
          className="text-emerald-400 hover:underline"
        >
          tajexlogistics.nl
        </a>
      </footer>
    </div>
  );
}
