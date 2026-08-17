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
import type { Dictionary } from "@/lib/i18n/dictionary-type";

type Area = "site" | "portal";
type PortalTab = "dashboard" | "invoices" | "documents" | "tasks" | "vat" | "financial" | "messages";

const INK = "#0E1A2B";
const GOLD = "#A67C2E";

const PORTAL_TAB_IDS: PortalTab[] = [
  "dashboard",
  "invoices",
  "documents",
  "tasks",
  "vat",
  "financial",
  "messages",
];

interface AppointmentForm {
  name: string;
  email: string;
  phone: string;
  reason: string;
}

const EMPTY_APPOINTMENT: AppointmentForm = { name: "", email: "", phone: "", reason: "" };

const FIRM = {
  address: ["Sint Pieterskade 26", "6212 AD Maastricht"],
  email: "kantoor@bergendal.nl",
  phone: "043 350 12 40",
};

/* ------------------------------ pieces ------------------------------ */

function Logo({ dark = false }: { dark?: boolean }) {
  return (
    <span className="flex items-center gap-3">
      <svg viewBox="0 0 32 32" className="h-9 w-9" aria-hidden="true">
        <rect width="32" height="32" rx="9" fill={dark ? "#16243A" : INK} />
        <rect x="8" y="18" width="4" height="7" rx="1.2" fill={GOLD} />
        <rect x="14" y="13" width="4" height="12" rx="1.2" fill={GOLD} opacity="0.85" />
        <rect x="20" y="8" width="4" height="17" rx="1.2" fill={GOLD} opacity="0.7" />
      </svg>
      <span className="leading-tight">
        <span
          className="block font-heading text-[15px] font-semibold tracking-[0.02em]"
          style={{ color: dark ? "#FFFFFF" : INK }}
        >
          Bergendal
        </span>
        <span className="mt-0.5 block font-mono text-[9px] uppercase tracking-[0.28em]" style={{ color: GOLD }}>
          Accountants
        </span>
      </span>
    </span>
  );
}

function Shell({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <div className={`mx-auto w-full max-w-4xl px-6 sm:px-9 ${className}`}>{children}</div>;
}

function Eyebrow({ children, light = false }: { children: React.ReactNode; light?: boolean }) {
  return (
    <p className="flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.26em]" style={{ color: GOLD }}>
      <span className="h-px w-6" style={{ background: light ? "rgba(166,124,46,0.8)" : GOLD }} />
      {children}
    </p>
  );
}

function Title({ children, light = false }: { children: React.ReactNode; light?: boolean }) {
  return (
    <h2
      className="mt-4 max-w-2xl font-heading text-[27px] font-semibold leading-[1.12] tracking-[-0.015em] sm:text-[36px]"
      style={{ color: light ? "#FFFFFF" : INK }}
    >
      {children}
    </h2>
  );
}

function Check({ className = "", style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <svg viewBox="0 0 20 20" className={className} style={style} fill="none" stroke="currentColor" strokeWidth={2}>
      <path d="m4 10 4 4 8-8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function InkButton({
  children,
  onClick,
  type = "button",
}: {
  children: React.ReactNode;
  onClick?: () => void;
  type?: "button" | "submit";
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      style={{ background: INK }}
      className="inline-flex items-center justify-center rounded-md px-7 py-3.5 text-[14px] font-semibold text-white transition-opacity hover:opacity-90"
    >
      {children}
    </button>
  );
}

function Field({
  label,
  value,
  onChange,
  error,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  error?: string;
  placeholder?: string;
}) {
  return (
    <div>
      <label className="mb-2 block font-mono text-[10px] uppercase tracking-[0.16em] text-[#8A857D]">{label}</label>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-md border border-[#DFDAD2] bg-white px-4 py-3 text-[14px] text-[#1B2430] outline-none transition-colors focus:border-[#A67C2E]"
      />
      {error && <p className="mt-1.5 text-[12px] text-red-600">{error}</p>}
    </div>
  );
}

function StatusPill({ status }: { status: string }) {
  const tone =
    status === "Paid"
      ? "bg-emerald-50 text-emerald-700 ring-emerald-200"
      : status === "Overdue"
        ? "bg-red-50 text-red-700 ring-red-200"
        : "bg-amber-50 text-amber-700 ring-amber-200";
  return (
    <span className={`rounded-full px-2.5 py-1 font-mono text-[9px] uppercase tracking-[0.14em] ring-1 ${tone}`}>
      {status}
    </span>
  );
}

/* ------------------------------- demo ------------------------------- */

interface AccountingDemoProps {
  dict: Dictionary["demos"]["accounting"];
  common: Dictionary["demoCommon"];
}

export function AccountingDemo({ dict, common }: AccountingDemoProps) {
  const [area, setArea] = useState<Area>("site");
  const [portalTab, setPortalTab] = useState<PortalTab>("dashboard");
  const [tasks, setTasks] = useState(PORTAL_TASKS);
  const [appointment, setAppointment] = useState<AppointmentForm>(EMPTY_APPOINTMENT);
  const [errors, setErrors] = useState<Partial<AppointmentForm>>({});
  const [submitted, setSubmitted] = useState(false);

  const portalTabLabel: Record<PortalTab, string> = {
    dashboard: dict.dashboard,
    invoices: dict.invoices,
    documents: dict.documents,
    tasks: dict.tasks,
    vat: dict.vatOverview,
    financial: dict.financialOverview,
    messages: dict.messages,
  };

  function toggleTask(id: string) {
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t)));
  }

  function handleAppointmentSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const n: Partial<AppointmentForm> = {};
    if (appointment.name.trim().length < 2) n.name = dict.fullName;
    if (!/^\S+@\S+\.\S+$/.test(appointment.email)) n.email = common.email;
    if (appointment.phone.trim().length < 6) n.phone = dict.phone;
    if (!appointment.reason) n.reason = dict.selectReason;
    setErrors(n);
    if (Object.keys(n).length === 0) setSubmitted(true);
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-[#E7E3DC] bg-[#FBFAF8] text-[#1B2430]">
      {/* Header */}
      <header className="border-b border-[#E7E3DC] bg-white">
        <div className="mx-auto flex w-full max-w-4xl items-center justify-between gap-4 px-6 py-4 sm:px-9">
          <button type="button" onClick={() => setArea("site")} aria-label="Bergendal Accountants">
            <Logo />
          </button>
          <nav className="hidden items-center gap-7 lg:flex">
            {[dict.navServices, dict.navPricing, dict.navAbout, dict.navContact].map((label) => (
              <span key={label} className="text-[14px] font-medium text-[#6D6A64]">
                {label}
              </span>
            ))}
          </nav>
          <button
            type="button"
            onClick={() => setArea(area === "portal" ? "site" : "portal")}
            className="rounded-md border px-5 py-2.5 font-mono text-[10px] font-semibold uppercase tracking-[0.16em] transition-colors"
            style={{ borderColor: "rgba(166,124,46,0.45)", color: INK }}
          >
            {area === "portal" ? dict.backToWebsite : dict.portalDemo}
          </button>
        </div>
      </header>

      {area === "site" && (
        <>
          {/* Hero */}
          <section className="relative overflow-hidden py-20 sm:py-24" style={{ background: INK }}>
            <svg
              aria-hidden="true"
              viewBox="0 0 800 400"
              preserveAspectRatio="xMidYMid slice"
              className="pointer-events-none absolute inset-0 h-full w-full opacity-[0.16]"
            >
              {Array.from({ length: 22 }).map((_, i) => (
                <rect key={i} x={40 + i * 34} y={400 - (40 + ((i * 37) % 240))} width="16" height={40 + ((i * 37) % 240)} fill={GOLD} />
              ))}
            </svg>
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-[#0E1A2B] via-[#0E1A2B]/94 to-[#0E1A2B]/55" />
            <Shell className="relative">
              <Eyebrow light>Accountants</Eyebrow>
              <h2 className="mt-5 max-w-2xl font-heading text-[32px] font-semibold leading-[1.08] tracking-[-0.02em] text-white sm:text-[44px]">
                {dict.heroHeading}
              </h2>
              <p className="mt-5 max-w-lg text-[15px] leading-relaxed text-white/65">{dict.heroSubtitle}</p>
              <div className="mt-9 flex flex-wrap gap-4">
                <button
                  type="button"
                  onClick={() => setArea("portal")}
                  className="rounded-md bg-white px-7 py-3.5 text-[14px] font-semibold transition-opacity hover:opacity-90"
                  style={{ color: INK }}
                >
                  {dict.portalDemo}
                </button>
                <span className="inline-flex items-center rounded-md border border-white/25 px-7 py-3.5 text-[14px] font-semibold text-white/85">
                  {dict.requestAppointment}
                </span>
              </div>
              <div className="mt-12 grid gap-6 border-t border-white/12 pt-8 sm:grid-cols-3">
                {ACCOUNTING_PLANS.slice(0, 3).map((p) => (
                  <div key={p.name}>
                    <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-white/45">{p.name}</p>
                    <p className="mt-1.5 font-heading text-[19px] font-semibold text-white">{p.price}</p>
                  </div>
                ))}
              </div>
            </Shell>
          </section>

          {/* Services */}
          <section className="bg-white py-16">
            <Shell>
              <Eyebrow>{dict.servicesHeading}</Eyebrow>
              <Title>{dict.aboutHeading}</Title>
              <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {ACCOUNTING_SERVICES.map((s, i) => (
                  <div key={s.id} className="rounded-xl border border-[#E7E3DC] bg-[#FBFAF8] p-6">
                    <span
                      className="flex h-9 w-9 items-center justify-center rounded-md font-mono text-[11px] font-semibold"
                      style={{ background: "rgba(166,124,46,0.12)", color: GOLD }}
                    >
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <p className="mt-5 text-[16px] font-semibold" style={{ color: INK }}>
                      {s.title}
                    </p>
                    <p className="mt-2.5 text-[14px] leading-relaxed text-[#6D6A64]">{s.description}</p>
                  </div>
                ))}
              </div>
            </Shell>
          </section>

          {/* Pricing */}
          <section className="border-t border-[#E7E3DC] py-16">
            <Shell>
              <Eyebrow>{dict.pricingHeading}</Eyebrow>
              <div className="mt-10 grid gap-5 sm:grid-cols-3">
                {ACCOUNTING_PLANS.map((plan, i) => {
                  const featured = i === 1;
                  return (
                    <div
                      key={plan.name}
                      className="flex flex-col rounded-xl border p-7"
                      style={
                        featured
                          ? { background: INK, borderColor: INK }
                          : { background: "#FFFFFF", borderColor: "#E7E3DC" }
                      }
                    >
                      <p
                        className="font-mono text-[10px] uppercase tracking-[0.18em]"
                        style={{ color: featured ? "rgba(255,255,255,0.55)" : GOLD }}
                      >
                        {plan.audience}
                      </p>
                      <p
                        className="mt-3 font-heading text-[19px] font-semibold"
                        style={{ color: featured ? "#FFFFFF" : INK }}
                      >
                        {plan.name}
                      </p>
                      <p
                        className="mt-4 font-heading text-[30px] font-semibold leading-none"
                        style={{ color: featured ? GOLD : INK }}
                      >
                        {plan.price}
                      </p>
                      <p
                        className="mt-4 text-[13px] leading-relaxed"
                        style={{ color: featured ? "rgba(255,255,255,0.6)" : "#6D6A64" }}
                      >
                        {plan.description}
                      </p>
                      <ul className="mt-6 flex flex-1 flex-col gap-2.5 border-t pt-5" style={{ borderColor: featured ? "rgba(255,255,255,0.12)" : "#EFEBE4" }}>
                        {plan.features.map((f) => (
                          <li
                            key={f}
                            className="flex items-start gap-2.5 text-[13px]"
                            style={{ color: featured ? "rgba(255,255,255,0.8)" : "#4A4741" }}
                          >
                            <Check className="mt-0.5 h-3.5 w-3.5 shrink-0" style={{ color: GOLD }} />
                            {f}
                          </li>
                        ))}
                      </ul>
                    </div>
                  );
                })}
              </div>
            </Shell>
          </section>

          {/* About */}
          <section className="border-t border-[#E7E3DC] bg-white py-16">
            <Shell>
              <div className="grid gap-10 lg:grid-cols-2">
                <div>
                  <Eyebrow>{dict.aboutHeading}</Eyebrow>
                  <p className="mt-6 text-[15px] leading-relaxed text-[#4A4741]">{dict.aboutBody}</p>
                </div>
                <div className="grid grid-cols-2 gap-px overflow-hidden rounded-xl bg-[#E7E3DC]">
                  {[
                    ["1998", dict.navAbout],
                    ["120+", dict.navServices],
                    ["4", dict.navPricing],
                    ["24u", dict.navContact],
                  ].map(([value, label]) => (
                    <div key={label} className="bg-[#FBFAF8] p-7">
                      <p className="font-heading text-[26px] font-semibold" style={{ color: INK }}>
                        {value}
                      </p>
                      <p className="mt-1.5 font-mono text-[10px] uppercase tracking-[0.16em] text-[#8A857D]">{label}</p>
                    </div>
                  ))}
                </div>
              </div>
            </Shell>
          </section>

          {/* Contact */}
          <section className="border-t border-[#E7E3DC] py-16">
            <Shell>
              <Eyebrow>{dict.contactHeading}</Eyebrow>
              <div className="mt-10 grid gap-10 lg:grid-cols-2">
                <div className="flex flex-col gap-6">
                  {[
                    [dict.navContact, FIRM.address.join(", ")],
                    [common.email, FIRM.email],
                    [dict.phone, FIRM.phone],
                  ].map(([label, value]) => (
                    <div key={label} className="border-b border-[#E7E3DC] pb-5">
                      <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#8A857D]">{label}</p>
                      <p className="mt-1.5 text-[15px]" style={{ color: INK }}>
                        {value}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="rounded-xl border border-[#E7E3DC] bg-white p-7">
                  {!submitted ? (
                    <form onSubmit={handleAppointmentSubmit} noValidate className="flex flex-col gap-5">
                      <Field
                        label={dict.fullName}
                        value={appointment.name}
                        onChange={(v) => setAppointment({ ...appointment, name: v })}
                        error={errors.name}
                        placeholder={common.namePlaceholder}
                      />
                      <Field
                        label={common.email}
                        value={appointment.email}
                        onChange={(v) => setAppointment({ ...appointment, email: v })}
                        error={errors.email}
                        placeholder={common.emailPlaceholder}
                      />
                      <Field
                        label={dict.phone}
                        value={appointment.phone}
                        onChange={(v) => setAppointment({ ...appointment, phone: v })}
                        error={errors.phone}
                        placeholder={common.phonePlaceholder}
                      />
                      <div>
                        <label className="mb-2 block font-mono text-[10px] uppercase tracking-[0.16em] text-[#8A857D]">
                          {dict.reason}
                        </label>
                        <select
                          value={appointment.reason}
                          onChange={(e) => setAppointment({ ...appointment, reason: e.target.value })}
                          className="w-full rounded-md border border-[#DFDAD2] bg-white px-4 py-3 text-[14px] text-[#1B2430] outline-none focus:border-[#A67C2E]"
                        >
                          <option value="">{dict.selectReason}</option>
                          {APPOINTMENT_REASONS.map((r) => (
                            <option key={r} value={r}>
                              {r}
                            </option>
                          ))}
                        </select>
                        {errors.reason && <p className="mt-1.5 text-[12px] text-red-600">{errors.reason}</p>}
                      </div>
                      <InkButton type="submit">{dict.requestAppointment}</InkButton>
                    </form>
                  ) : (
                    <div className="flex flex-col items-start gap-3">
                      <span
                        className="flex h-12 w-12 items-center justify-center rounded-full"
                        style={{ background: "rgba(166,124,46,0.14)", color: GOLD }}
                      >
                        <Check className="h-6 w-6" />
                      </span>
                      <p className="mt-2 text-[18px] font-semibold" style={{ color: INK }}>
                        {dict.appointmentReceivedTitle}
                      </p>
                      <p className="text-[14px] leading-relaxed text-[#6D6A64]">{dict.appointmentReceivedBody}</p>
                    </div>
                  )}
                </div>
              </div>
            </Shell>
          </section>

          <footer className="border-t border-[#E7E3DC] bg-white py-8">
            <Shell className="flex flex-wrap items-center justify-between gap-4">
              <Logo />
              <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-[#A5A099]">{common.footerTagline}</p>
            </Shell>
          </footer>
        </>
      )}

      {/* ------------------------------ Portal ------------------------------ */}
      {area === "portal" && (
        <div className="flex flex-col lg:flex-row">
          <aside className="flex gap-2 overflow-x-auto border-b border-[#E7E3DC] bg-white p-3 lg:w-56 lg:flex-col lg:overflow-visible lg:border-b-0 lg:border-r lg:p-5">
            <p className="hidden px-3 pb-3 font-mono text-[9px] uppercase tracking-[0.2em] text-[#A5A099] lg:block">
              {dict.portalDemo}
            </p>
            {PORTAL_TAB_IDS.map((id) => (
              <button
                key={id}
                type="button"
                onClick={() => setPortalTab(id)}
                className="shrink-0 rounded-md px-3.5 py-2.5 text-left text-[14px] font-medium transition-colors"
                style={
                  portalTab === id
                    ? { background: INK, color: "#FFFFFF" }
                    : { color: "#6D6A64" }
                }
              >
                {portalTabLabel[id]}
              </button>
            ))}
          </aside>

          <div className="flex-1 bg-[#FBFAF8] p-6 sm:p-9">
            <div className="flex flex-wrap items-baseline justify-between gap-3 border-b border-[#E7E3DC] pb-5">
              <h2 className="font-heading text-[22px] font-semibold" style={{ color: INK }}>
                {portalTabLabel[portalTab]}
              </h2>
              <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-[#A5A099]">{dict.portalNote}</p>
            </div>

            <div className="mt-7">
              {portalTab === "dashboard" && (
                <div className="grid gap-4 sm:grid-cols-3">
                  {[
                    [dict.openInvoices, PORTAL_INVOICES.filter((i) => i.status !== "Paid").length],
                    [dict.openTasks, tasks.filter((t) => !t.done).length],
                    [dict.unreadMessages, PORTAL_MESSAGES.length],
                  ].map(([label, value]) => (
                    <div key={String(label)} className="rounded-xl border border-[#E7E3DC] bg-white p-6">
                      <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-[#8A857D]">{label}</p>
                      <p className="mt-3 font-heading text-[32px] font-semibold leading-none" style={{ color: INK }}>
                        {value}
                      </p>
                    </div>
                  ))}
                </div>
              )}

              {portalTab === "invoices" && (
                <div className="overflow-hidden rounded-xl border border-[#E7E3DC] bg-white">
                  {PORTAL_INVOICES.map((inv, i) => (
                    <div
                      key={inv.id}
                      className={`flex items-center justify-between gap-4 px-5 py-4 text-[14px] ${
                        i > 0 ? "border-t border-[#EFEBE4]" : ""
                      }`}
                    >
                      <div>
                        <p className="font-medium" style={{ color: INK }}>
                          {inv.id} · {inv.client}
                        </p>
                        <p className="mt-0.5 font-mono text-[10px] uppercase tracking-[0.14em] text-[#A5A099]">
                          {inv.date}
                        </p>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="font-heading font-semibold" style={{ color: INK }}>
                          &euro;{inv.amount.toLocaleString()}
                        </span>
                        <StatusPill status={inv.status} />
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {portalTab === "documents" && (
                <div className="overflow-hidden rounded-xl border border-[#E7E3DC] bg-white">
                  {PORTAL_DOCUMENTS.map((doc, i) => (
                    <div
                      key={doc.id}
                      className={`flex items-center justify-between gap-4 px-5 py-4 text-[14px] ${
                        i > 0 ? "border-t border-[#EFEBE4]" : ""
                      }`}
                    >
                      <div className="flex items-center gap-3.5">
                        <span
                          className="flex h-9 w-9 items-center justify-center rounded-md"
                          style={{ background: "rgba(166,124,46,0.12)", color: GOLD }}
                        >
                          <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={1.7}>
                            <path d="M14 3v5h5" />
                            <path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8Z" />
                          </svg>
                        </span>
                        <div>
                          <p className="font-medium" style={{ color: INK }}>
                            {doc.name}
                          </p>
                          <p className="mt-0.5 font-mono text-[10px] uppercase tracking-[0.14em] text-[#A5A099]">
                            {doc.category}
                          </p>
                        </div>
                      </div>
                      <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-[#A5A099]">{doc.date}</span>
                    </div>
                  ))}
                </div>
              )}

              {portalTab === "tasks" && (
                <div className="overflow-hidden rounded-xl border border-[#E7E3DC] bg-white">
                  {tasks.map((t, i) => (
                    <label
                      key={t.id}
                      className={`flex cursor-pointer items-center justify-between gap-4 px-5 py-4 text-[14px] ${
                        i > 0 ? "border-t border-[#EFEBE4]" : ""
                      }`}
                    >
                      <span className="flex items-center gap-3.5">
                        <input
                          type="checkbox"
                          checked={t.done}
                          onChange={() => toggleTask(t.id)}
                          className="h-4 w-4 accent-[#0E1A2B]"
                        />
                        <span className={t.done ? "text-[#A5A099] line-through" : ""} style={t.done ? {} : { color: INK }}>
                          {t.label}
                        </span>
                      </span>
                      <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-[#A5A099]">{t.due}</span>
                    </label>
                  ))}
                </div>
              )}

              {portalTab === "vat" && (
                <div className="grid gap-4 sm:grid-cols-3">
                  {VAT_OVERVIEW.map((v) => (
                    <div key={v.quarter} className="rounded-xl border border-[#E7E3DC] bg-white p-6">
                      <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-[#8A857D]">
                        {v.quarter} BTW
                      </p>
                      <p className="mt-3 font-heading text-[26px] font-semibold leading-none" style={{ color: INK }}>
                        &euro;{v.amount.toLocaleString()}
                      </p>
                    </div>
                  ))}
                </div>
              )}

              {portalTab === "financial" && (
                <div className="rounded-xl border border-[#E7E3DC] bg-white p-6">
                  <div className="flex flex-col gap-4">
                    {FINANCIAL_OVERVIEW.map((m) => {
                      const max = Math.max(...FINANCIAL_OVERVIEW.map((x) => x.revenue));
                      return (
                        <div key={m.month} className="flex items-center gap-4">
                          <span className="w-10 font-mono text-[10px] uppercase tracking-[0.14em] text-[#A5A099]">
                            {m.month}
                          </span>
                          <div className="h-2.5 flex-1 overflow-hidden rounded-full bg-[#F0ECE5]">
                            <div
                              className="h-full rounded-full"
                              style={{ width: `${(m.revenue / max) * 100}%`, background: GOLD }}
                            />
                          </div>
                          <span className="w-24 text-right text-[13px]" style={{ color: INK }}>
                            &euro;{m.revenue.toLocaleString()}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {portalTab === "messages" && (
                <div className="overflow-hidden rounded-xl border border-[#E7E3DC] bg-white">
                  {PORTAL_MESSAGES.map((msg, i) => (
                    <div key={i} className={`px-5 py-4 ${i > 0 ? "border-t border-[#EFEBE4]" : ""}`}>
                      <p className="text-[14px] font-medium" style={{ color: INK }}>
                        {msg.subject}
                      </p>
                      <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.14em] text-[#A5A099]">
                        {msg.from} · {msg.date}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
