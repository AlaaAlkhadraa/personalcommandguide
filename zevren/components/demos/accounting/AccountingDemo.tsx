"use client";

import { useState } from "react";
import {
  ACCOUNTING_PLANS,
  ACCOUNTING_SERVICES,
  APPOINTMENT_REASONS,
  FINANCIAL_OVERVIEW,
  PORTAL_DOCUMENTS,
  PORTAL_INVOICES,
  PORTAL_MESSAGES,
  PORTAL_TASKS,
  VAT_OVERVIEW,
} from "@/lib/demos/accounting-data";

type Area = "site" | "portal";
type PortalTab = "dashboard" | "invoices" | "documents" | "tasks" | "vat" | "financial" | "messages";

interface AppointmentForm {
  name: string;
  email: string;
  phone: string;
  reason: string;
}

const EMPTY_APPOINTMENT: AppointmentForm = { name: "", email: "", phone: "", reason: "" };

const PORTAL_TABS: { id: PortalTab; label: string }[] = [
  { id: "dashboard", label: "Dashboard" },
  { id: "invoices", label: "Invoices" },
  { id: "documents", label: "Documents" },
  { id: "tasks", label: "Tasks" },
  { id: "vat", label: "VAT overview" },
  { id: "financial", label: "Financial overview" },
  { id: "messages", label: "Messages" },
];

function Logo() {
  return (
    <div className="flex items-center gap-2.5">
      <svg viewBox="0 0 32 32" className="h-8 w-8" aria-hidden="true">
        <rect width="32" height="32" rx="8" fill="#0f1b2d" />
        <rect x="8" y="18" width="4" height="7" rx="1" fill="#b8860b" />
        <rect x="14" y="13" width="4" height="12" rx="1" fill="#b8860b" />
        <rect x="20" y="8" width="4" height="17" rx="1" fill="#b8860b" />
      </svg>
      <div className="leading-tight">
        <p className="font-heading text-sm font-semibold tracking-wide text-[#0f1b2d]">
          Bergendal
        </p>
        <p className="text-[9px] font-semibold uppercase tracking-[0.25em] text-stone-500">
          Accountants
        </p>
      </div>
    </div>
  );
}

export function AccountingDemo() {
  const [area, setArea] = useState<Area>("site");
  const [portalTab, setPortalTab] = useState<PortalTab>("dashboard");
  const [tasks, setTasks] = useState(PORTAL_TASKS);
  const [appointment, setAppointment] = useState<AppointmentForm>(EMPTY_APPOINTMENT);
  const [errors, setErrors] = useState<Partial<AppointmentForm>>({});
  const [submitted, setSubmitted] = useState(false);

  function toggleTask(id: string) {
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t)));
  }

  function handleAppointmentSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const nextErrors: Partial<AppointmentForm> = {};
    if (appointment.name.trim().length < 2) nextErrors.name = "Enter your full name.";
    if (!/^\S+@\S+\.\S+$/.test(appointment.email)) nextErrors.email = "Enter a valid email address.";
    if (appointment.phone.trim().length < 6) nextErrors.phone = "Enter a valid phone number.";
    if (!appointment.reason) nextErrors.reason = "Select a reason.";
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length === 0) {
      setSubmitted(true);
    }
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-stone-200 bg-white text-stone-900">
      {/* Navigation */}
      <nav className="flex items-center justify-between border-b border-stone-200 bg-white/95 px-5 py-4 sm:px-8">
        <button type="button" onClick={() => setArea("site")}>
          <Logo />
        </button>
        <div className="hidden items-center gap-6 text-sm text-stone-500 sm:flex">
          <a href="#services" className="hover:text-[#0f1b2d]">Services</a>
          <a href="#pricing" className="hover:text-[#0f1b2d]">Pricing</a>
          <a href="#about" className="hover:text-[#0f1b2d]">About</a>
          <a href="#contact" className="hover:text-[#0f1b2d]">Contact</a>
        </div>
        <button
          type="button"
          onClick={() => setArea(area === "portal" ? "site" : "portal")}
          className="rounded-md border border-[#b8860b]/40 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-[#0f1b2d] transition-colors hover:bg-[#b8860b]/10"
        >
          {area === "portal" ? "Back to website" : "Client Portal (Demo)"}
        </button>
      </nav>

      {area === "site" && (
        <>
          {/* Hero */}
          <section className="border-b border-stone-200 bg-gradient-to-br from-stone-50 to-white px-5 py-14 sm:px-8 sm:py-20">
            <span className="text-xs font-semibold uppercase tracking-[0.3em] text-[#b8860b]">
              Accountants
            </span>
            <h2 className="mt-4 max-w-lg font-heading text-3xl font-semibold leading-tight text-[#0f1b2d] sm:text-4xl">
              Clear bookkeeping, without the jargon.
            </h2>
            <p className="mt-4 max-w-md text-sm leading-relaxed text-stone-600">
              Bergendal Accountants handles your bookkeeping, BTW and jaarrekening,
              so you can stay focused on running your business.
            </p>
            <a
              href="#contact"
              className="mt-6 inline-flex w-fit items-center rounded-md bg-[#0f1b2d] px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#1c2e47]"
            >
              Request an appointment
            </a>
          </section>

          {/* Services */}
          <section id="services" className="border-b border-stone-200 px-5 py-12 sm:px-8">
            <h3 className="text-xs font-semibold uppercase tracking-[0.3em] text-[#b8860b]">
              Services
            </h3>
            <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {ACCOUNTING_SERVICES.map((s) => (
                <div key={s.id} className="rounded-lg border border-stone-200 bg-stone-50/60 p-4">
                  <p className="text-sm font-semibold text-[#0f1b2d]">{s.title}</p>
                  <p className="mt-1.5 text-sm leading-relaxed text-stone-600">{s.description}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Pricing */}
          <section id="pricing" className="border-b border-stone-200 px-5 py-12 sm:px-8">
            <h3 className="text-xs font-semibold uppercase tracking-[0.3em] text-[#b8860b]">
              Pricing
            </h3>
            <div className="mt-6 grid gap-4 sm:grid-cols-3">
              {ACCOUNTING_PLANS.map((plan) => (
                <div key={plan.name} className="flex flex-col gap-2 rounded-lg border border-stone-200 p-5">
                  <p className="text-sm font-semibold text-[#0f1b2d]">{plan.name}</p>
                  <p className="text-xs text-stone-500">{plan.audience}</p>
                  <p className="text-lg font-semibold text-[#0f1b2d]">{plan.price}</p>
                  <p className="text-xs leading-relaxed text-stone-600">{plan.description}</p>
                  <ul className="mt-2 flex flex-col gap-1.5">
                    {plan.features.map((f) => (
                      <li key={f} className="flex items-start gap-1.5 text-xs text-stone-600">
                        <svg viewBox="0 0 20 20" className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#b8860b]" fill="none" stroke="currentColor" strokeWidth={2}>
                          <path d="m4 10 4 4 8-8" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        {f}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </section>

          {/* About */}
          <section id="about" className="border-b border-stone-200 px-5 py-12 sm:px-8">
            <h3 className="text-xs font-semibold uppercase tracking-[0.3em] text-[#b8860b]">
              About
            </h3>
            <p className="mt-4 max-w-xl text-sm leading-relaxed text-stone-600">
              Bergendal Accountants works with freelancers and small businesses
              across the Netherlands, handling bookkeeping, VAT and annual
              accounts with clear, direct communication and no unnecessary
              paperwork.
            </p>
          </section>

          {/* Contact / Appointment request */}
          <section id="contact" className="px-5 py-12 sm:px-8">
            <h3 className="text-xs font-semibold uppercase tracking-[0.3em] text-[#b8860b]">
              Request an appointment
            </h3>
            {!submitted ? (
              <form onSubmit={handleAppointmentSubmit} className="mt-6 grid max-w-xl gap-4">
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-stone-500">
                    Full name
                  </label>
                  <input
                    value={appointment.name}
                    onChange={(e) => setAppointment({ ...appointment, name: e.target.value })}
                    className="w-full rounded-md border border-stone-300 bg-white px-3 py-2.5 text-sm text-stone-900 outline-none focus:border-[#b8860b]"
                    placeholder="Jan de Vries"
                  />
                  {errors.name && <p className="mt-1 text-xs text-red-600">{errors.name}</p>}
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-stone-500">
                    Email address
                  </label>
                  <input
                    value={appointment.email}
                    onChange={(e) => setAppointment({ ...appointment, email: e.target.value })}
                    className="w-full rounded-md border border-stone-300 bg-white px-3 py-2.5 text-sm text-stone-900 outline-none focus:border-[#b8860b]"
                    placeholder="jan@example.com"
                  />
                  {errors.email && <p className="mt-1 text-xs text-red-600">{errors.email}</p>}
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-stone-500">
                    Phone number
                  </label>
                  <input
                    value={appointment.phone}
                    onChange={(e) => setAppointment({ ...appointment, phone: e.target.value })}
                    className="w-full rounded-md border border-stone-300 bg-white px-3 py-2.5 text-sm text-stone-900 outline-none focus:border-[#b8860b]"
                    placeholder="06 12345678"
                  />
                  {errors.phone && <p className="mt-1 text-xs text-red-600">{errors.phone}</p>}
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-stone-500">
                    Reason for the appointment
                  </label>
                  <select
                    value={appointment.reason}
                    onChange={(e) => setAppointment({ ...appointment, reason: e.target.value })}
                    className="w-full rounded-md border border-stone-300 bg-white px-3 py-2.5 text-sm text-stone-900 outline-none focus:border-[#b8860b]"
                  >
                    <option value="">Select a reason</option>
                    {APPOINTMENT_REASONS.map((r) => (
                      <option key={r} value={r}>{r}</option>
                    ))}
                  </select>
                  {errors.reason && <p className="mt-1 text-xs text-red-600">{errors.reason}</p>}
                </div>
                <button
                  type="submit"
                  className="mt-2 w-fit rounded-md bg-[#0f1b2d] px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#1c2e47]"
                >
                  Request appointment
                </button>
              </form>
            ) : (
              <div className="mt-6 flex max-w-xl flex-col items-start gap-3 rounded-lg border border-stone-200 bg-stone-50 p-6">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#b8860b]/15 text-[#b8860b]">
                  <svg viewBox="0 0 20 20" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={2}>
                    <path d="m4 10 4 4 8-8" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <p className="text-base font-semibold text-[#0f1b2d]">Appointment request received</p>
                <p className="text-sm text-stone-600">
                  Thank you, {appointment.name}. We will get back to you to
                  schedule your appointment.
                </p>
              </div>
            )}
          </section>

          <footer className="border-t border-stone-200 px-5 py-6 text-center text-xs text-stone-400 sm:px-8">
            Bergendal Accountants &middot; a website concept by ZEVREN
          </footer>
        </>
      )}

      {area === "portal" && (
        <div className="flex flex-col sm:flex-row">
          <aside className="flex gap-2 overflow-x-auto border-b border-stone-200 bg-stone-50 p-3 sm:w-48 sm:flex-col sm:overflow-visible sm:border-b-0 sm:border-r sm:p-4">
            {PORTAL_TABS.map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setPortalTab(tab.id)}
                className={`shrink-0 rounded-md px-3 py-2 text-left text-sm font-medium transition-colors ${
                  portalTab === tab.id
                    ? "bg-[#0f1b2d] text-white"
                    : "text-stone-600 hover:bg-stone-200/60"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </aside>

          <div className="flex-1 p-5 sm:p-8">
            <p className="mb-6 text-xs text-stone-400">
              Demo client portal, not connected to a real login system.
            </p>

            {portalTab === "dashboard" && (
              <div className="grid gap-4 sm:grid-cols-3">
                <div className="rounded-lg border border-stone-200 p-4">
                  <p className="text-xs text-stone-500">Open invoices</p>
                  <p className="mt-1 text-2xl font-semibold text-[#0f1b2d]">
                    {PORTAL_INVOICES.filter((i) => i.status !== "Paid").length}
                  </p>
                </div>
                <div className="rounded-lg border border-stone-200 p-4">
                  <p className="text-xs text-stone-500">Open tasks</p>
                  <p className="mt-1 text-2xl font-semibold text-[#0f1b2d]">
                    {tasks.filter((t) => !t.done).length}
                  </p>
                </div>
                <div className="rounded-lg border border-stone-200 p-4">
                  <p className="text-xs text-stone-500">Unread messages</p>
                  <p className="mt-1 text-2xl font-semibold text-[#0f1b2d]">
                    {PORTAL_MESSAGES.length}
                  </p>
                </div>
              </div>
            )}

            {portalTab === "invoices" && (
              <div className="flex flex-col gap-2">
                {PORTAL_INVOICES.map((inv) => (
                  <div key={inv.id} className="flex items-center justify-between rounded-lg border border-stone-200 px-4 py-3 text-sm">
                    <div>
                      <p className="font-medium text-[#0f1b2d]">{inv.id} &middot; {inv.client}</p>
                      <p className="text-xs text-stone-500">{inv.date}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span>&euro;{inv.amount.toLocaleString()}</span>
                      <span
                        className={`rounded-full px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${
                          inv.status === "Paid"
                            ? "bg-emerald-100 text-emerald-700"
                            : inv.status === "Overdue"
                              ? "bg-red-100 text-red-700"
                              : "bg-amber-100 text-amber-700"
                        }`}
                      >
                        {inv.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {portalTab === "documents" && (
              <div className="flex flex-col gap-2">
                {PORTAL_DOCUMENTS.map((doc) => (
                  <div key={doc.id} className="flex items-center justify-between rounded-lg border border-stone-200 px-4 py-3 text-sm">
                    <div>
                      <p className="font-medium text-[#0f1b2d]">{doc.name}</p>
                      <p className="text-xs text-stone-500">{doc.category}</p>
                    </div>
                    <span className="text-xs text-stone-500">{doc.date}</span>
                  </div>
                ))}
              </div>
            )}

            {portalTab === "tasks" && (
              <div className="flex flex-col gap-2">
                {tasks.map((t) => (
                  <label
                    key={t.id}
                    className="flex items-center justify-between rounded-lg border border-stone-200 px-4 py-3 text-sm"
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={t.done}
                        onChange={() => toggleTask(t.id)}
                        className="h-4 w-4 accent-[#0f1b2d]"
                      />
                      <span className={t.done ? "text-stone-400 line-through" : "text-[#0f1b2d]"}>
                        {t.label}
                      </span>
                    </div>
                    <span className="text-xs text-stone-500">Due {t.due}</span>
                  </label>
                ))}
              </div>
            )}

            {portalTab === "vat" && (
              <div className="grid gap-3 sm:grid-cols-3">
                {VAT_OVERVIEW.map((v) => (
                  <div key={v.quarter} className="rounded-lg border border-stone-200 p-4">
                    <p className="text-xs text-stone-500">{v.quarter} BTW</p>
                    <p className="mt-1 text-xl font-semibold text-[#0f1b2d]">
                      &euro;{v.amount.toLocaleString()}
                    </p>
                  </div>
                ))}
              </div>
            )}

            {portalTab === "financial" && (
              <div className="flex flex-col gap-3">
                {FINANCIAL_OVERVIEW.map((m) => {
                  const max = Math.max(...FINANCIAL_OVERVIEW.map((x) => x.revenue));
                  return (
                    <div key={m.month} className="flex items-center gap-3">
                      <span className="w-10 text-xs text-stone-500">{m.month}</span>
                      <div className="h-3 flex-1 overflow-hidden rounded-full bg-stone-100">
                        <div
                          className="h-full rounded-full bg-[#b8860b]"
                          style={{ width: `${(m.revenue / max) * 100}%` }}
                        />
                      </div>
                      <span className="w-20 text-right text-xs text-stone-600">
                        &euro;{m.revenue.toLocaleString()}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}

            {portalTab === "messages" && (
              <div className="flex flex-col gap-2">
                {PORTAL_MESSAGES.map((msg, i) => (
                  <div key={i} className="rounded-lg border border-stone-200 px-4 py-3 text-sm">
                    <p className="font-medium text-[#0f1b2d]">{msg.subject}</p>
                    <p className="text-xs text-stone-500">{msg.from} &middot; {msg.date}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
