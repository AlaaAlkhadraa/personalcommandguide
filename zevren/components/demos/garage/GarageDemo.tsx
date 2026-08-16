"use client";

import { useState } from "react";
import {
  CAR_BRANDS,
  GARAGE_DATES,
  GARAGE_DATE_FULL_LABELS,
  GARAGE_SERVICES,
  GARAGE_TIME_SLOTS,
  isGarageSlotAvailable,
  type GarageService,
} from "@/lib/demos/garage-data";
import type { Dictionary } from "@/lib/i18n/dictionary-type";

type View = "home" | "services" | "apk" | "about" | "contact" | "book";
type Step = "service" | "datetime" | "details" | "review" | "done";

const STEP_ORDER: Step[] = ["service", "datetime", "details", "review"];

const ORANGE = "#F4681F";

const GARAGE = {
  name: "Steenberg",
  suffix: "Autoservice",
  address: ["Beatrixhaven 18", "6222 NK Maastricht"],
  email: "werkplaats@steenbergautoservice.nl",
  phone: "043 123 45 67",
};

const DEMO_REVIEWS = [
  { name: "Marieke S.", text: "Booked my APK online, no phone calls needed. Straightforward." },
  { name: "Bram K.", text: "Clear pricing before I even arrived, no surprises on the invoice." },
  { name: "Youssef E.", text: "Easy to add my kenteken and details ahead of time." },
];

const LOOKUP_MODELS = ["3 Series", "A4", "Golf", "C-Class", "Corolla", "Model 3", "Civic", "Astra"];

function lookupVehicleByPlate(plate: string) {
  const seed = [...plate].reduce((sum, char) => sum + char.charCodeAt(0), 0);
  return {
    brand: CAR_BRANDS[seed % CAR_BRANDS.length]!,
    model: LOOKUP_MODELS[seed % LOOKUP_MODELS.length]!,
    year: 2014 + (seed % 10),
  };
}

interface FormState {
  name: string;
  email: string;
  phone: string;
  kenteken: string;
  brand: string;
  model: string;
  mileage: string;
}

const EMPTY_FORM: FormState = { name: "", email: "", phone: "", kenteken: "", brand: "", model: "", mileage: "" };

interface Message {
  name: string;
  email: string;
  message: string;
}

/* ------------------------------- art ------------------------------- */

function Wordmark({ className = "" }: { className?: string }) {
  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      <svg viewBox="0 0 28 28" className="h-7 w-7" aria-hidden="true">
        <rect width="28" height="28" rx="7" fill="#151A21" stroke={ORANGE} strokeWidth="1.5" />
        <path d="M6 18h16M8.5 18l1.5-5h8l1.5 5" stroke={ORANGE} strokeWidth="1.6" fill="none" strokeLinejoin="round" />
        <circle cx="10" cy="19.5" r="1.6" fill={ORANGE} />
        <circle cx="18" cy="19.5" r="1.6" fill={ORANGE} />
      </svg>
      <span className="font-heading text-[15px] font-bold uppercase tracking-[0.14em] text-[#E7EAEE]">
        {GARAGE.name} <span style={{ color: ORANGE }}>{GARAGE.suffix}</span>
      </span>
    </span>
  );
}

function Icon({ name, className = "" }: { name: string; className?: string }) {
  const c = {
    viewBox: "0 0 24 24",
    fill: "none" as const,
    stroke: "currentColor",
    strokeWidth: 1.6,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    className,
  };
  if (name === "wrench")
    return (
      <svg {...c}>
        <path d="M15.5 3.5a5 5 0 0 0-5.9 6.6L3.5 16.2a2 2 0 0 0 2.8 2.8l6.1-6.1a5 5 0 0 0 6.6-5.9l-2.9 2.9-2.6-.7-.7-2.6Z" />
      </svg>
    );
  if (name === "shield")
    return (
      <svg {...c}>
        <path d="M12 3 20 6v6c0 4.6-3.3 7.9-8 9-4.7-1.1-8-4.4-8-9V6Z" />
        <path d="m8.5 12 2.5 2.5 4.5-5" />
      </svg>
    );
  if (name === "clock")
    return (
      <svg {...c}>
        <circle cx="12" cy="12" r="8.5" />
        <path d="M12 7.5V12l3 2" />
      </svg>
    );
  if (name === "pin")
    return (
      <svg {...c}>
        <path d="M12 21s7-5.2 7-10.4A7 7 0 0 0 5 10.6C5 15.8 12 21 12 21Z" />
        <circle cx="12" cy="10.4" r="2.4" />
      </svg>
    );
  if (name === "phone")
    return (
      <svg {...c}>
        <path d="M6.5 3.5h3l1.5 4-2 1.4a12 12 0 0 0 6.1 6.1l1.4-2 4 1.5v3a2 2 0 0 1-2.2 2A17 17 0 0 1 4.5 5.7a2 2 0 0 1 2-2.2Z" />
      </svg>
    );
  if (name === "mail")
    return (
      <svg {...c}>
        <rect x="3" y="5.5" width="18" height="13" rx="2" />
        <path d="m3.5 7 8.5 6 8.5-6" />
      </svg>
    );
  return (
    <svg {...c}>
      <path d="M5 12h13M13 6.5 18.5 12 13 17.5" />
    </svg>
  );
}

function WorkshopBackdrop({ className = "" }: { className?: string }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 1200 560" preserveAspectRatio="xMidYMid slice" className={className}>
      <rect width="1200" height="560" fill="#10141A" />
      {/* roller shutter */}
      <g opacity="0.5">
        {Array.from({ length: 16 }).map((_, i) => (
          <rect key={i} y={30 + i * 18} width="1200" height="12" fill={i % 2 ? "#161B23" : "#1B212B"} />
        ))}
      </g>
      {/* lift + car silhouette */}
      <g opacity="0.85">
        <rect x="330" y="470" width="520" height="16" rx="4" fill="#1E2530" />
        <rect x="560" y="386" width="24" height="84" fill="#1E2530" />
        <path d="M380 386h420l-46-70H426z" fill="#1A202A" />
        <rect x="368" y="330" width="444" height="58" rx="16" fill="#222A36" />
        <circle cx="452" cy="392" r="26" fill="#12161C" />
        <circle cx="728" cy="392" r="26" fill="#12161C" />
      </g>
      {/* hazard stripe */}
      <g opacity="0.35">
        {Array.from({ length: 40 }).map((_, i) => (
          <path key={i} d={`M${i * 34 - 20} 560 L${i * 34 + 6} 512 h20 L${i * 34} 560 Z`} fill={ORANGE} />
        ))}
      </g>
      {/* strip lights */}
      {[220, 600, 980].map((x) => (
        <rect key={x} x={x - 90} y="16" width="180" height="8" rx="4" fill="#E9F0FF" opacity="0.25" />
      ))}
    </svg>
  );
}

function BayTile({ variant, className = "" }: { variant: number; className?: string }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 200 200"
      preserveAspectRatio="xMidYMid slice"
      className={className}
      // The second row mirrors and re-tints the first so the six bays do not
      // read as the same three tiles printed twice.
      style={variant >= 3 ? { transform: "scaleX(-1)" } : undefined}
    >
      <rect width="200" height="200" fill={variant >= 3 ? "#171D25" : "#141920"} />
      {variant % 3 === 0 && (
        <g>
          <rect x="20" y="120" width="160" height="10" rx="3" fill="#1E2530" />
          <rect x="94" y="80" width="12" height="40" fill="#1E2530" />
          <rect x="46" y="52" width="108" height="30" rx="10" fill="#232B38" />
          <circle cx="70" cy="86" r="14" fill="#0F1319" />
          <circle cx="130" cy="86" r="14" fill="#0F1319" />
          <path d="M0 176h200" stroke={ORANGE} strokeWidth="8" opacity="0.5" />
        </g>
      )}
      {variant % 3 === 1 && (
        <g stroke={ORANGE} strokeWidth="5" fill="none" opacity="0.8">
          <circle cx="100" cy="100" r="46" />
          <circle cx="100" cy="100" r="16" />
          {[0, 60, 120, 180, 240, 300].map((a) => (
            <path key={a} d={`M100 100 ${100 + 40 * Math.cos((a * Math.PI) / 180)} ${100 + 40 * Math.sin((a * Math.PI) / 180)}`} />
          ))}
        </g>
      )}
      {variant % 3 === 2 && (
        <g>
          {Array.from({ length: 12 }).map((_, i) => (
            <rect
              key={i}
              x={22 + (i % 4) * 42}
              y={30 + Math.floor(i / 4) * 50}
              width="32"
              height="38"
              rx="4"
              fill={i % 5 === 0 ? ORANGE : "#1F2733"}
              opacity={i % 5 === 0 ? 0.7 : 1}
            />
          ))}
        </g>
      )}
    </svg>
  );
}

/* ---------------------------- primitives ---------------------------- */

function Shell({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <div className={`mx-auto w-full max-w-4xl px-6 sm:px-9 ${className}`}>{children}</div>;
}

function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <p className="flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.26em]" style={{ color: ORANGE }}>
      <span className="h-px w-6" style={{ background: ORANGE }} />
      {children}
    </p>
  );
}

function Title({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="mt-4 max-w-xl font-heading text-[27px] font-bold leading-[1.08] tracking-[-0.01em] text-[#E7EAEE] sm:text-[36px]">
      {children}
    </h2>
  );
}

function OrangeButton({
  children,
  onClick,
  type = "button",
  full = false,
  disabled = false,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  type?: "button" | "submit";
  full?: boolean;
  disabled?: boolean;
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      style={{ background: ORANGE }}
      className={`inline-flex items-center justify-center rounded-md px-6 py-3 font-mono text-[11px] font-semibold uppercase tracking-[0.16em] text-[#0E1116] transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40 ${
        full ? "w-full" : ""
      }`}
    >
      {children}
    </button>
  );
}

function GhostButton({ children, onClick }: { children: React.ReactNode; onClick?: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex items-center justify-center rounded-md border border-white/18 px-6 py-3 font-mono text-[11px] font-semibold uppercase tracking-[0.16em] text-[#E7EAEE] transition-colors hover:border-[#F4681F] hover:text-[#F4681F]"
    >
      {children}
    </button>
  );
}

function PageHead({ eyebrow, title, subtitle }: { eyebrow: string; title: string; subtitle: string }) {
  return (
    <section className="relative overflow-hidden border-b border-white/8 bg-[#10141A] py-14 sm:py-16">
      <span className="pointer-events-none absolute -right-20 -top-24 h-64 w-64 rounded-full opacity-[0.12] blur-3xl" style={{ background: ORANGE }} />
      <Shell className="relative">
        <Eyebrow>{eyebrow}</Eyebrow>
        <h1 className="mt-4 max-w-xl font-heading text-[29px] font-bold leading-[1.06] text-[#E7EAEE] sm:text-[40px]">
          {title}
        </h1>
        <p className="mt-4 max-w-lg text-[15px] leading-relaxed text-[#8A93A0]">{subtitle}</p>
      </Shell>
    </section>
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
      <label className="mb-2 block font-mono text-[10px] uppercase tracking-[0.16em] text-[#6C7784]">{label}</label>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-md border border-white/12 bg-[#0E1116] px-4 py-3 text-[14px] text-[#E7EAEE] outline-none focus:border-[#F4681F]"
      />
      {error && <p className="mt-1.5 text-[12px] text-red-400">{error}</p>}
    </div>
  );
}

function ServiceRows({ onPick }: { onPick?: (s: GarageService) => void }) {
  return (
    <div className="mt-9 border-t border-white/8">
      {GARAGE_SERVICES.map((s) => {
        const body = (
          <>
            <div>
              <p className="text-[17px] font-semibold text-[#E7EAEE]">{s.name}</p>
              <p className="mt-1.5 text-[13px] leading-relaxed text-[#8A93A0]">{s.description}</p>
            </div>
            <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-[#6C7784]">{s.duration}</span>
            <span className="font-heading text-[18px] font-bold" style={{ color: ORANGE }}>
              {s.price}
            </span>
          </>
        );
        const cls =
          "grid w-full grid-cols-[1fr_auto] items-center gap-x-6 gap-y-2 border-b border-white/8 py-6 text-left sm:grid-cols-[1fr_110px_110px]";
        return onPick ? (
          <button key={s.id} type="button" onClick={() => onPick(s)} className={`${cls} transition-colors hover:bg-white/[0.03]`}>
            {body}
          </button>
        ) : (
          <div key={s.id} className={cls}>
            {body}
          </div>
        );
      })}
    </div>
  );
}

function HoursBlock({ common, note }: { common: Dictionary["demoCommon"]; note: string }) {
  const rows: [string, string][] = [
    [common.monFri, "07:30 - 18:00"],
    [common.saturday, "08:00 - 13:00"],
    [common.sunday, common.closed],
  ];
  return (
    <div>
      <p className="font-mono text-[10px] uppercase tracking-[0.2em]" style={{ color: ORANGE }}>
        {common.hoursHeading}
      </p>
      <dl className="mt-5 flex flex-col gap-3">
        {rows.map(([d, v]) => (
          <div key={d} className="flex justify-between gap-6 border-b border-white/8 pb-3 text-[14px]">
            <dt className="text-[#8A93A0]">{d}</dt>
            <dd className="text-[#E7EAEE]">{v}</dd>
          </div>
        ))}
      </dl>
      <p className="mt-4 text-[13px] leading-relaxed text-[#6C7784]">{note}</p>
    </div>
  );
}

/* ------------------------------ demo ------------------------------ */

interface GarageDemoProps {
  dict: Dictionary["demos"]["garage"];
  common: Dictionary["demoCommon"];
}

export function GarageDemo({ dict, common }: GarageDemoProps) {
  const site = dict.site;
  const [view, setView] = useState<View>("home");

  const [step, setStep] = useState<Step>("service");
  const [service, setService] = useState<GarageService | null>(null);
  const [dateId, setDateId] = useState<string | null>(null);
  const [time, setTime] = useState<string | null>(null);
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [errors, setErrors] = useState<Partial<FormState>>({});
  const [cancelled, setCancelled] = useState(false);
  const [lookupResult, setLookupResult] = useState<{ brand: string; model: string; year: number } | null>(null);

  const [message, setMessage] = useState<Message>({ name: "", email: "", message: "" });
  const [messageErrors, setMessageErrors] = useState<Partial<Message>>({});
  const [messageSent, setMessageSent] = useState(false);

  const stepIndex = STEP_ORDER.indexOf(step);

  function update<K extends keyof FormState>(key: K, value: string) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function bookWith(preset?: GarageService) {
    if (preset) {
      setService(preset);
      setStep("datetime");
    }
    setView("book");
  }

  function lookupVehicle() {
    if (form.kenteken.trim().length < 5) return;
    const result = lookupVehicleByPlate(form.kenteken.trim());
    setLookupResult(result);
    setForm((f) => ({ ...f, brand: result.brand, model: result.model }));
  }

  function handleDetailsSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const n: Partial<FormState> = {};
    if (form.name.trim().length < 2) n.name = site.formErrors.name;
    if (!/^\S+@\S+\.\S+$/.test(form.email)) n.email = site.formErrors.email;
    if (form.phone.trim().length < 6) n.phone = common.phone;
    if (form.kenteken.trim().length < 5) n.kenteken = dict.kenteken;
    if (!form.brand) n.brand = dict.selectBrand;
    if (form.model.trim().length < 1) n.model = dict.model;
    if (form.mileage.trim().length < 1) n.mileage = dict.mileage;
    setErrors(n);
    if (Object.keys(n).length === 0) setStep("review");
  }

  function handleMessageSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const n: Partial<Message> = {};
    if (message.name.trim().length < 2) n.name = site.formErrors.name;
    if (!/^\S+@\S+\.\S+$/.test(message.email)) n.email = site.formErrors.email;
    if (message.message.trim().length < 5) n.message = site.formErrors.message;
    setMessageErrors(n);
    if (Object.keys(n).length === 0) setMessageSent(true);
  }

  function reset() {
    setService(null);
    setDateId(null);
    setTime(null);
    setForm(EMPTY_FORM);
    setErrors({});
    setCancelled(false);
    setLookupResult(null);
    setStep("service");
  }

  const NAV: { id: View; label: string }[] = [
    { id: "home", label: site.navHome },
    { id: "services", label: dict.navServices },
    { id: "apk", label: "APK" },
    { id: "about", label: dict.navAbout },
    { id: "contact", label: dict.navContact },
  ];

  return (
    <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#0E1116] text-[#E7EAEE]">
      {/* Header */}
      <header className="border-b border-white/8 bg-[#0E1116]">
        <div className="mx-auto flex w-full max-w-4xl items-center justify-between gap-4 px-6 py-4 sm:px-9">
          <button type="button" onClick={() => setView("home")} aria-label={`${GARAGE.name} ${GARAGE.suffix}`}>
            <Wordmark />
          </button>
          <nav className="hidden items-center gap-6 lg:flex">
            {NAV.map((n) => (
              <button
                key={n.id}
                type="button"
                onClick={() => setView(n.id)}
                className="font-mono text-[11px] uppercase tracking-[0.16em] transition-colors"
                style={{ color: view === n.id ? ORANGE : "#8A93A0" }}
              >
                {n.label}
              </button>
            ))}
          </nav>
          <OrangeButton onClick={() => bookWith()}>{dict.bookService}</OrangeButton>
        </div>
        <div className="flex gap-2 overflow-x-auto border-t border-white/8 px-6 py-2.5 lg:hidden">
          {NAV.map((n) => (
            <button
              key={n.id}
              type="button"
              onClick={() => setView(n.id)}
              className="shrink-0 rounded-md border px-3.5 py-1.5 font-mono text-[10px] uppercase tracking-[0.14em]"
              style={{
                borderColor: view === n.id ? ORANGE : "rgba(255,255,255,0.12)",
                color: view === n.id ? ORANGE : "#8A93A0",
              }}
            >
              {n.label}
            </button>
          ))}
        </div>
      </header>

      {/* ---------------- Home ---------------- */}
      {view === "home" && (
        <>
          <section className="relative overflow-hidden py-20 sm:py-28">
            <WorkshopBackdrop className="pointer-events-none absolute inset-0 h-full w-full opacity-70" />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-[#0E1116] via-[#0E1116]/93 to-[#0E1116]/45" />
            <Shell className="relative">
              <Eyebrow>{dict.heroLocation}</Eyebrow>
              <h1 className="mt-5 max-w-xl font-heading text-[34px] font-bold leading-[1.04] tracking-[-0.015em] text-[#E7EAEE] sm:text-[48px]">
                {dict.heroHeading}
              </h1>
              <p className="mt-5 max-w-md text-[15px] leading-relaxed text-[#8A93A0]">{dict.heroSubtitle}</p>
              <div className="mt-9 flex flex-wrap gap-4">
                <OrangeButton onClick={() => bookWith()}>{dict.heroCta}</OrangeButton>
                <GhostButton onClick={() => setView("services")}>{site.heroCtaSecondary}</GhostButton>
              </div>
              <div className="mt-12 flex flex-wrap gap-x-10 gap-y-4 border-t border-white/10 pt-7">
                {[
                  { icon: "clock", text: "07:30 - 18:00" },
                  { icon: "pin", text: GARAGE.address[0]! },
                  { icon: "phone", text: GARAGE.phone },
                ].map((i) => (
                  <span key={i.text} className="flex items-center gap-2.5 text-[13px] text-[#8A93A0]">
                    <Icon name={i.icon} className="h-4 w-4" />
                    {i.text}
                  </span>
                ))}
              </div>
            </Shell>
          </section>

          <section className="border-t border-white/8 py-16">
            <Shell>
              <Eyebrow>{site.whyHeading}</Eyebrow>
              <div className="mt-9 grid gap-5 sm:grid-cols-3">
                {site.why.map((card, i) => (
                  <div key={card.title} className="rounded-xl border border-white/8 bg-[#151A21] p-7">
                    <span className="flex h-10 w-10 items-center justify-center rounded-md border border-white/12" style={{ color: ORANGE }}>
                      <Icon name={["wrench", "shield", "clock"][i] ?? "wrench"} className="h-4.5 w-4.5" />
                    </span>
                    <p className="mt-5 font-heading text-[17px] font-bold text-[#E7EAEE]">{card.title}</p>
                    <p className="mt-3 text-[14px] leading-relaxed text-[#8A93A0]">{card.description}</p>
                  </div>
                ))}
              </div>
            </Shell>
          </section>

          <section className="border-t border-white/8 py-16">
            <Shell>
              <Eyebrow>{dict.servicesHeading}</Eyebrow>
              <Title>{site.servicesSubtitle}</Title>
              <ServiceRows onPick={(s) => bookWith(s)} />
            </Shell>
          </section>

          <section className="border-t border-white/8 bg-[#10141A] py-16">
            <Shell>
              <Eyebrow>{dict.galleryHeading}</Eyebrow>
              <div className="mt-9 grid grid-cols-2 gap-3 sm:grid-cols-3">
                {[0, 1, 2, 3, 4, 5].map((v) => (
                  <div key={v} className="overflow-hidden rounded-lg border border-white/8">
                    <BayTile variant={v} className="aspect-[4/3] w-full" />
                  </div>
                ))}
              </div>
            </Shell>
          </section>

          <section className="border-t border-white/8 py-16">
            <Shell>
              <Eyebrow>{dict.reviewsHeading}</Eyebrow>
              <div className="mt-9 grid gap-5 sm:grid-cols-3">
                {DEMO_REVIEWS.map((r) => (
                  <div key={r.name} className="rounded-xl border border-white/8 bg-[#151A21] p-6">
                    <div className="flex gap-0.5" style={{ color: ORANGE }}>
                      {Array.from({ length: 5 }).map((_, i) => (
                        <svg key={i} viewBox="0 0 20 20" className="h-3.5 w-3.5" fill="currentColor">
                          <path d="M10 1.5 12.6 7l6 .9-4.3 4.2 1 6-5.3-2.8L4.7 18.1l1-6L1.4 7.9l6-.9Z" />
                        </svg>
                      ))}
                    </div>
                    <p className="mt-4 text-[14px] leading-relaxed text-[#C2C8D0]">&ldquo;{r.text}&rdquo;</p>
                    <p className="mt-4 font-mono text-[10px] uppercase tracking-[0.16em] text-[#6C7784]">{r.name}</p>
                  </div>
                ))}
              </div>
              <p className="mt-4 font-mono text-[10px] uppercase tracking-[0.14em] text-[#5A6470]">{common.demoNote}</p>
            </Shell>
          </section>

          <section className="border-t border-white/8 py-16">
            <Shell className="flex flex-col items-start gap-6 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="font-heading text-[23px] font-bold leading-tight text-[#E7EAEE] sm:text-[29px]">
                  {site.ctaTitle}
                </p>
                <p className="mt-2 text-[14px] text-[#8A93A0]">{site.ctaBody}</p>
              </div>
              <OrangeButton onClick={() => bookWith()}>{site.navBook}</OrangeButton>
            </Shell>
          </section>
        </>
      )}

      {/* ---------------- Services ---------------- */}
      {view === "services" && (
        <>
          <PageHead eyebrow={dict.navServices} title={dict.servicesHeading} subtitle={site.servicesSubtitle} />
          <section className="py-14">
            <Shell>
              <ServiceRows onPick={(s) => bookWith(s)} />
              <div className="mt-10">
                <OrangeButton onClick={() => bookWith()}>{dict.bookService}</OrangeButton>
              </div>
            </Shell>
          </section>
        </>
      )}

      {/* ---------------- APK ---------------- */}
      {view === "apk" && (
        <>
          <PageHead eyebrow="APK" title={site.apkHeading} subtitle={site.apkBody} />
          <section className="py-14">
            <Shell>
              <ul className="flex flex-col gap-4">
                {site.apkPoints.map((p) => (
                  <li key={p} className="flex items-start gap-3 rounded-xl border border-white/8 bg-[#151A21] p-5 text-[14px]">
                    <span className="mt-0.5" style={{ color: ORANGE }}>
                      <Icon name="shield" className="h-4 w-4" />
                    </span>
                    {p}
                  </li>
                ))}
              </ul>
              <div className="mt-10">
                <OrangeButton onClick={() => bookWith(GARAGE_SERVICES[0])}>{dict.bookService}</OrangeButton>
              </div>
            </Shell>
          </section>
        </>
      )}

      {/* ---------------- About ---------------- */}
      {view === "about" && (
        <>
          <PageHead eyebrow={dict.navAbout} title={dict.aboutHeading} subtitle={site.aboutSubtitle} />
          <section className="py-14">
            <Shell>
              <div className="grid gap-10 lg:grid-cols-2">
                <div>
                  {site.aboutParagraphs.map((p) => (
                    <p key={p} className="mb-5 text-[15px] leading-relaxed text-[#8A93A0]">
                      {p}
                    </p>
                  ))}
                </div>
                <HoursBlock common={common} note={site.hoursNote} />
              </div>
            </Shell>
          </section>
        </>
      )}

      {/* ---------------- Contact ---------------- */}
      {view === "contact" && (
        <>
          <PageHead eyebrow={dict.navContact} title={common.contactHeading} subtitle={site.contactSubtitle} />
          <section className="py-14">
            <Shell>
              <div className="grid gap-10 lg:grid-cols-2">
                <div className="flex flex-col gap-7">
                  {[
                    { icon: "pin", label: site.addressLabel, value: GARAGE.address.join(", ") },
                    { icon: "mail", label: common.email, value: GARAGE.email },
                    { icon: "phone", label: common.phone, value: GARAGE.phone },
                  ].map((r) => (
                    <div key={r.label} className="flex gap-4">
                      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md border border-white/10" style={{ color: ORANGE }}>
                        <Icon name={r.icon} className="h-4 w-4" />
                      </span>
                      <div>
                        <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#6C7784]">{r.label}</p>
                        <p className="mt-1.5 text-[15px] text-[#E7EAEE]">{r.value}</p>
                      </div>
                    </div>
                  ))}
                  <HoursBlock common={common} note={site.hoursNote} />
                </div>

                <div className="rounded-xl border border-white/8 bg-[#151A21] p-7">
                  {messageSent ? (
                    <div>
                      <span className="flex h-12 w-12 items-center justify-center rounded-full" style={{ background: "rgba(244,104,31,0.15)", color: ORANGE }}>
                        <svg viewBox="0 0 20 20" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth={2}>
                          <path d="m4 10 4 4 8-8" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </span>
                      <p className="mt-5 font-heading text-[19px] font-bold text-[#E7EAEE]">{site.formSuccessTitle}</p>
                      <p className="mt-2 text-[14px] text-[#8A93A0]">{site.formSuccessBody}</p>
                    </div>
                  ) : (
                    <form onSubmit={handleMessageSubmit} noValidate className="flex flex-col gap-5">
                      <p className="font-mono text-[10px] uppercase tracking-[0.2em]" style={{ color: ORANGE }}>
                        {site.formHeading}
                      </p>
                      <Field
                        label={common.fullName}
                        value={message.name}
                        onChange={(v) => setMessage({ ...message, name: v })}
                        error={messageErrors.name}
                      />
                      <Field
                        label={common.email}
                        value={message.email}
                        onChange={(v) => setMessage({ ...message, email: v })}
                        error={messageErrors.email}
                      />
                      <div>
                        <label className="mb-2 block font-mono text-[10px] uppercase tracking-[0.16em] text-[#6C7784]">
                          {site.formMessage}
                        </label>
                        <textarea
                          rows={4}
                          value={message.message}
                          onChange={(e) => setMessage({ ...message, message: e.target.value })}
                          className="w-full rounded-md border border-white/12 bg-[#0E1116] px-4 py-3 text-[14px] text-[#E7EAEE] outline-none focus:border-[#F4681F]"
                        />
                        {messageErrors.message && <p className="mt-1.5 text-[12px] text-red-400">{messageErrors.message}</p>}
                      </div>
                      <OrangeButton type="submit" full>
                        {site.formSubmit}
                      </OrangeButton>
                    </form>
                  )}
                </div>
              </div>
            </Shell>
          </section>
        </>
      )}

      {/* ---------------- Booking ---------------- */}
      {view === "book" && (
        <>
          <PageHead eyebrow={site.navBook} title={dict.bookingHeading} subtitle={site.ctaBody} />
          <section className="py-14">
            <Shell>
              {step !== "done" && (
                <div className="flex flex-wrap gap-2">
                  {STEP_ORDER.map((s, i) => (
                    <span
                      key={s}
                      className="rounded-md px-3.5 py-1.5 font-mono text-[10px] uppercase tracking-[0.14em]"
                      style={
                        i === stepIndex
                          ? { background: ORANGE, color: "#0E1116" }
                          : i < stepIndex
                            ? { background: "rgba(244,104,31,0.18)", color: ORANGE }
                            : { background: "rgba(255,255,255,0.05)", color: "#6C7784" }
                      }
                    >
                      {dict.steps[s]}
                    </span>
                  ))}
                </div>
              )}

              <div className="mt-8 rounded-xl border border-white/8 bg-[#151A21] p-6 sm:p-8">
                {step === "service" && (
                  <div className="grid gap-3 sm:grid-cols-2">
                    {GARAGE_SERVICES.map((s) => (
                      <button
                        key={s.id}
                        type="button"
                        onClick={() => {
                          setService(s);
                          setStep("datetime");
                        }}
                        className="rounded-lg border px-5 py-4 text-left transition-colors"
                        style={{
                          borderColor: service?.id === s.id ? ORANGE : "rgba(255,255,255,0.10)",
                          background: service?.id === s.id ? "rgba(244,104,31,0.08)" : "transparent",
                        }}
                      >
                        <span className="flex items-center justify-between gap-3">
                          <span className="text-[15px] font-semibold text-[#E7EAEE]">{s.name}</span>
                          <span className="font-heading text-[16px] font-bold" style={{ color: ORANGE }}>
                            {s.price}
                          </span>
                        </span>
                        <span className="mt-1.5 block text-[12px] text-[#8A93A0]">{s.description}</span>
                      </button>
                    ))}
                  </div>
                )}

                {step === "datetime" && (
                  <div className="flex flex-col gap-8">
                    <div>
                      <p className="mb-4 font-mono text-[10px] uppercase tracking-[0.18em] text-[#6C7784]">
                        {dict.selectDate}
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {GARAGE_DATES.map((d) => (
                          <button
                            key={d.id}
                            type="button"
                            onClick={() => {
                              setDateId(d.id);
                              setTime(null);
                            }}
                            className="rounded-md border px-4 py-2 text-[13px] transition-colors"
                            style={{
                              borderColor: dateId === d.id ? ORANGE : "rgba(255,255,255,0.10)",
                              color: dateId === d.id ? ORANGE : "#C2C8D0",
                            }}
                          >
                            {d.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    {dateId && (
                      <div>
                        <p className="mb-4 font-mono text-[10px] uppercase tracking-[0.18em] text-[#6C7784]">
                          {dict.selectTime}
                        </p>
                        <div className="grid grid-cols-3 gap-2 sm:grid-cols-6">
                          {GARAGE_TIME_SLOTS.map((t, i) => {
                            const available = isGarageSlotAvailable(dateId, i);
                            return (
                              <button
                                key={t}
                                type="button"
                                disabled={!available}
                                onClick={() => setTime(t)}
                                className={`rounded-md border px-2 py-2.5 text-[13px] transition-colors ${
                                  !available ? "cursor-not-allowed line-through" : ""
                                }`}
                                style={{
                                  borderColor: !available
                                    ? "rgba(255,255,255,0.05)"
                                    : time === t
                                      ? ORANGE
                                      : "rgba(255,255,255,0.10)",
                                  color: !available ? "#3A424D" : time === t ? ORANGE : "#C2C8D0",
                                }}
                              >
                                {t}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    <div className="flex items-center justify-between">
                      <button
                        type="button"
                        onClick={() => setStep("service")}
                        className="font-mono text-[10px] uppercase tracking-[0.16em] text-[#6C7784] hover:text-[#F4681F]"
                      >
                        &larr; {common.back}
                      </button>
                      <OrangeButton disabled={!dateId || !time} onClick={() => setStep("details")}>
                        {common.continueLabel}
                      </OrangeButton>
                    </div>
                  </div>
                )}

                {step === "details" && (
                  <form onSubmit={handleDetailsSubmit} noValidate className="grid gap-5 sm:grid-cols-2">
                    <Field
                      label={common.fullName}
                      value={form.name}
                      onChange={(v) => update("name", v)}
                      error={errors.name}
                      placeholder={common.namePlaceholder}
                    />
                    <Field
                      label={common.email}
                      value={form.email}
                      onChange={(v) => update("email", v)}
                      error={errors.email}
                      placeholder={common.emailPlaceholder}
                    />
                    <Field
                      label={common.phone}
                      value={form.phone}
                      onChange={(v) => update("phone", v)}
                      error={errors.phone}
                      placeholder={common.phonePlaceholder}
                    />
                    <div>
                      <label className="mb-2 block font-mono text-[10px] uppercase tracking-[0.16em] text-[#6C7784]">
                        {dict.kenteken}
                      </label>
                      <div className="flex gap-2">
                        <input
                          value={form.kenteken}
                          onChange={(e) => update("kenteken", e.target.value.toUpperCase())}
                          placeholder="12-ABC-3"
                          className="w-full rounded-md border border-white/12 bg-[#0E1116] px-4 py-3 font-mono text-[14px] uppercase tracking-[0.1em] text-[#E7EAEE] outline-none focus:border-[#F4681F]"
                        />
                        <button
                          type="button"
                          onClick={lookupVehicle}
                          className="shrink-0 rounded-md border border-white/15 px-4 font-mono text-[10px] uppercase tracking-[0.14em] text-[#C2C8D0] hover:border-[#F4681F] hover:text-[#F4681F]"
                        >
                          {dict.lookupButton}
                        </button>
                      </div>
                      {errors.kenteken && <p className="mt-1.5 text-[12px] text-red-400">{errors.kenteken}</p>}
                      {lookupResult && (
                        <p className="mt-2 text-[12px]" style={{ color: ORANGE }}>
                          {dict.vehicleFoundLabel} {lookupResult.brand} {lookupResult.model} ({lookupResult.year})
                        </p>
                      )}
                      <p className="mt-1.5 text-[11px] text-[#5A6470]">{dict.lookupNote}</p>
                    </div>
                    <div>
                      <label className="mb-2 block font-mono text-[10px] uppercase tracking-[0.16em] text-[#6C7784]">
                        {dict.carBrand}
                      </label>
                      <select
                        value={form.brand}
                        onChange={(e) => update("brand", e.target.value)}
                        className="w-full rounded-md border border-white/12 bg-[#0E1116] px-4 py-3 text-[14px] text-[#E7EAEE] outline-none focus:border-[#F4681F]"
                      >
                        <option value="">{dict.selectBrand}</option>
                        {CAR_BRANDS.map((b) => (
                          <option key={b} value={b}>
                            {b}
                          </option>
                        ))}
                      </select>
                      {errors.brand && <p className="mt-1.5 text-[12px] text-red-400">{errors.brand}</p>}
                    </div>
                    <Field
                      label={dict.model}
                      value={form.model}
                      onChange={(v) => update("model", v)}
                      error={errors.model}
                      placeholder="3 Series"
                    />
                    <Field
                      label={dict.mileage}
                      value={form.mileage}
                      onChange={(v) => update("mileage", v)}
                      error={errors.mileage}
                      placeholder="124,000"
                    />
                    <div className="flex items-center justify-between pt-1 sm:col-span-2">
                      <button
                        type="button"
                        onClick={() => setStep("datetime")}
                        className="font-mono text-[10px] uppercase tracking-[0.16em] text-[#6C7784] hover:text-[#F4681F]"
                      >
                        &larr; {common.back}
                      </button>
                      <OrangeButton type="submit">{common.continueLabel}</OrangeButton>
                    </div>
                  </form>
                )}

                {step === "review" && service && dateId && time && (
                  <div className="flex flex-col gap-6">
                    <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#6C7784]">
                      {dict.reviewHeading}
                    </p>
                    <dl className="grid gap-4 sm:grid-cols-2">
                      {[
                        [dict.summaryService, service.name],
                        [dict.summaryDate, GARAGE_DATE_FULL_LABELS[dateId] ?? ""],
                        [dict.summaryTime, time],
                        [dict.summaryVehicle, `${form.brand} ${form.model} · ${form.kenteken}`],
                        [dict.summaryMileage, `${form.mileage} km`],
                        [dict.summaryContact, `${form.email} · ${form.phone}`],
                      ].map(([label, value]) => (
                        <div key={label}>
                          <dt className="font-mono text-[10px] uppercase tracking-[0.16em] text-[#6C7784]">{label}</dt>
                          <dd className="mt-1.5 text-[14px] text-[#E7EAEE]">{value}</dd>
                        </div>
                      ))}
                    </dl>
                    <div className="flex items-center justify-between pt-1">
                      <button
                        type="button"
                        onClick={() => setStep("details")}
                        className="font-mono text-[10px] uppercase tracking-[0.16em] text-[#6C7784] hover:text-[#F4681F]"
                      >
                        &larr; {common.back}
                      </button>
                      <OrangeButton onClick={() => setStep("done")}>{dict.confirmAppointment}</OrangeButton>
                    </div>
                  </div>
                )}

                {step === "done" && service && dateId && time && !cancelled && (
                  <div className="flex flex-col items-center gap-5 py-6 text-center">
                    <span className="flex h-14 w-14 items-center justify-center rounded-full" style={{ background: "rgba(244,104,31,0.15)", color: ORANGE }}>
                      <svg viewBox="0 0 20 20" className="h-7 w-7" fill="none" stroke="currentColor" strokeWidth={2}>
                        <path d="m4 10 4 4 8-8" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </span>
                    <p className="font-heading text-[21px] font-bold text-[#E7EAEE]">{dict.confirmedTitle}</p>
                    <div className="text-[14px] leading-relaxed text-[#C2C8D0]">
                      <p>{service.name}</p>
                      <p>{GARAGE_DATE_FULL_LABELS[dateId]}</p>
                      <p>{time}</p>
                      <p>
                        {dict.vehicleLabel} {form.brand} {form.model} ({form.kenteken})
                      </p>
                    </div>
                    <div className="mt-2 flex flex-wrap items-center justify-center gap-5">
                      <button
                        type="button"
                        onClick={() => {
                          setDateId(null);
                          setTime(null);
                          setCancelled(false);
                          setStep("datetime");
                        }}
                        className="font-mono text-[10px] uppercase tracking-[0.16em] text-[#8A93A0] hover:text-white"
                      >
                        {common.reschedule}
                      </button>
                      <button
                        type="button"
                        onClick={() => setCancelled(true)}
                        className="font-mono text-[10px] uppercase tracking-[0.16em] text-[#8A93A0] hover:text-red-400"
                      >
                        {common.cancelAppointment}
                      </button>
                      <button
                        type="button"
                        onClick={reset}
                        className="font-mono text-[10px] uppercase tracking-[0.16em]"
                        style={{ color: ORANGE }}
                      >
                        {common.bookAnother}
                      </button>
                    </div>
                  </div>
                )}

                {step === "done" && cancelled && (
                  <div className="flex flex-col items-center gap-4 py-6 text-center">
                    <span className="flex h-14 w-14 items-center justify-center rounded-full bg-white/5 text-[#8A93A0]">
                      <svg viewBox="0 0 20 20" className="h-7 w-7" fill="none" stroke="currentColor" strokeWidth={2}>
                        <path d="m5 5 10 10M15 5 5 15" strokeLinecap="round" />
                      </svg>
                    </span>
                    <p className="font-heading text-[19px] font-bold text-[#E7EAEE]">{common.cancelledTitle}</p>
                    <p className="text-[14px] text-[#8A93A0]">{common.cancelledBody}</p>
                    <button
                      type="button"
                      onClick={reset}
                      className="mt-2 font-mono text-[10px] uppercase tracking-[0.16em]"
                      style={{ color: ORANGE }}
                    >
                      {common.bookNew}
                    </button>
                  </div>
                )}
              </div>
            </Shell>
          </section>
        </>
      )}

      {/* Footer */}
      <footer className="border-t border-white/8 bg-[#10141A] pt-12">
        <Shell>
          <div className="grid gap-9 sm:grid-cols-3">
            <div>
              <Wordmark />
              <p className="mt-4 max-w-xs text-[13px] leading-relaxed text-[#6C7784]">{dict.heroSubtitle}</p>
            </div>
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.18em]" style={{ color: ORANGE }}>
                {common.hoursHeading}
              </p>
              <dl className="mt-4 flex flex-col gap-2 text-[13px] text-[#8A93A0]">
                <div className="flex justify-between gap-4">
                  <dt>{common.monFri}</dt>
                  <dd>07:30 - 18:00</dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt>{common.saturday}</dt>
                  <dd>08:00 - 13:00</dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt>{common.sunday}</dt>
                  <dd>{common.closed}</dd>
                </div>
              </dl>
            </div>
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.18em]" style={{ color: ORANGE }}>
                {common.contactHeading}
              </p>
              <div className="mt-4 flex flex-col gap-2 text-[13px] text-[#8A93A0]">
                <p>{GARAGE.address.join(", ")}</p>
                <p>{GARAGE.email}</p>
                <p>{GARAGE.phone}</p>
              </div>
            </div>
          </div>
          <p className="mt-10 border-t border-white/8 py-6 font-mono text-[10px] uppercase tracking-[0.16em] text-[#4A5361]">
            {common.footerTagline}
          </p>
        </Shell>
      </footer>
    </div>
  );
}
