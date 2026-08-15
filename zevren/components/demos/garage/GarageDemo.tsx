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

type Step = "service" | "datetime" | "details" | "review" | "done";

const STEP_ORDER: Step[] = ["service", "datetime", "details", "review"];

interface GarageDemoProps {
  dict: Dictionary["demos"]["garage"];
  common: Dictionary["demoCommon"];
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

const EMPTY_FORM: FormState = {
  name: "",
  email: "",
  phone: "",
  kenteken: "",
  brand: "",
  model: "",
  mileage: "",
};

const GALLERY_SWATCHES = [
  "from-orange-500/30 to-slate-900",
  "from-slate-700 to-slate-950",
  "from-orange-600/20 to-slate-900",
  "from-slate-600 to-orange-950/30",
  "from-orange-500/25 to-slate-950",
  "from-slate-700 to-slate-900",
];

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

export function GarageDemo({ dict, common }: GarageDemoProps) {
  const STEP_LABELS: Record<Step, string> = dict.steps;
  const [step, setStep] = useState<Step>("service");
  const [service, setService] = useState<GarageService | null>(null);
  const [dateId, setDateId] = useState<string | null>(null);
  const [time, setTime] = useState<string | null>(null);
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [errors, setErrors] = useState<Partial<FormState>>({});
  const [cancelled, setCancelled] = useState(false);
  const [lookupResult, setLookupResult] = useState<{ brand: string; model: string; year: number } | null>(null);

  const stepIndex = STEP_ORDER.indexOf(step);

  function update<K extends keyof FormState>(key: K, value: string) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function lookupVehicle() {
    if (form.kenteken.trim().length < 5) return;
    const result = lookupVehicleByPlate(form.kenteken.trim());
    setLookupResult(result);
    setForm((f) => ({ ...f, brand: result.brand, model: result.model }));
  }

  function rescheduleAppointment() {
    setDateId(null);
    setTime(null);
    setCancelled(false);
    setStep("datetime");
  }

  function handleDetailsSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const nextErrors: Partial<FormState> = {};
    if (form.name.trim().length < 2) nextErrors.name = "Enter your full name.";
    if (!/^\S+@\S+\.\S+$/.test(form.email)) nextErrors.email = "Enter a valid email address.";
    if (form.phone.trim().length < 6) nextErrors.phone = "Enter a valid phone number.";
    if (form.kenteken.trim().length < 5) nextErrors.kenteken = "Enter a valid registration number.";
    if (!form.brand) nextErrors.brand = "Select a car brand.";
    if (form.model.trim().length < 1) nextErrors.model = "Enter the car model.";
    if (form.mileage.trim().length < 1) nextErrors.mileage = "Enter the current mileage.";
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length === 0) {
      setStep("review");
    }
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

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-700/60 bg-slate-900 text-slate-100">
      {/* Navigation */}
      <nav className="flex items-center justify-between border-b border-slate-700/60 bg-slate-900/95 px-5 py-4 sm:px-8">
        <span className="font-heading text-lg font-semibold tracking-wide text-white">
          STEENBERG <span className="text-orange-500">AUTOSERVICE</span>
        </span>
        <div className="hidden items-center gap-6 text-sm text-slate-400 sm:flex">
          <span>{dict.navServices}</span>
          <span>{dict.navAbout}</span>
          <span>{dict.navHours}</span>
          <span>{dict.navContact}</span>
        </div>
        <a
          href="#booking"
          className="rounded-md bg-orange-500 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-slate-950 transition-colors hover:bg-orange-400"
        >
          {dict.bookService}
        </a>
      </nav>

      {/* Hero */}
      <section className="border-b border-slate-700/60 bg-[radial-gradient(circle_at_80%_0%,rgba(249,115,22,0.12),transparent_50%)] px-5 py-14 sm:px-8 sm:py-20">
        <span className="text-xs font-semibold uppercase tracking-[0.3em] text-orange-500">
          {dict.heroLocation}
        </span>
        <h2 className="mt-4 max-w-lg font-heading text-3xl font-semibold leading-tight text-white sm:text-4xl">
          {dict.heroHeading}
        </h2>
        <p className="mt-4 max-w-md text-sm leading-relaxed text-slate-400">
          {dict.heroSubtitle}
        </p>
        <a
          href="#booking"
          className="mt-6 inline-flex w-fit items-center rounded-md border border-orange-500/60 px-5 py-2.5 text-sm font-semibold text-orange-500 transition-colors hover:bg-orange-500/10"
        >
          {dict.heroCta}
        </a>
      </section>

      {/* Services */}
      <section className="border-b border-slate-700/60 px-5 py-12 sm:px-8">
        <h3 className="text-xs font-semibold uppercase tracking-[0.3em] text-orange-500">
          {dict.servicesHeading}
        </h3>
        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          {GARAGE_SERVICES.map((s) => (
            <div
              key={s.id}
              className="rounded-lg border border-slate-700/60 bg-slate-800/40 px-4 py-3"
            >
              <div className="flex items-center justify-between gap-3">
                <p className="text-sm font-medium text-slate-100">{s.name}</p>
                <span className="text-sm font-semibold text-orange-500">{s.price}</span>
              </div>
              <p className="mt-1 text-xs text-slate-500">{s.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* About */}
      <section className="border-b border-slate-700/60 px-5 py-12 sm:px-8">
        <h3 className="text-xs font-semibold uppercase tracking-[0.3em] text-orange-500">
          {dict.aboutHeading}
        </h3>
        <p className="mt-4 max-w-xl text-sm leading-relaxed text-slate-400">
          Steenberg Autoservice is an independent garage handling maintenance,
          APK inspections and repairs for all makes and models, with clear
          pricing and no surprises on the invoice.
        </p>
      </section>

      {/* Gallery */}
      <section className="border-b border-slate-700/60 px-5 py-12 sm:px-8">
        <h3 className="text-xs font-semibold uppercase tracking-[0.3em] text-orange-500">
          {dict.galleryHeading}
        </h3>
        <div className="mt-6 grid grid-cols-3 gap-2 sm:grid-cols-6">
          {GALLERY_SWATCHES.map((swatch, i) => (
            <div
              key={i}
              className={`aspect-square rounded-md bg-gradient-to-br ${swatch}`}
            />
          ))}
        </div>
      </section>

      {/* Reviews */}
      <section className="border-b border-slate-700/60 px-5 py-12 sm:px-8">
        <h3 className="text-xs font-semibold uppercase tracking-[0.3em] text-orange-500">
          {dict.reviewsHeading}
        </h3>
        <p className="mt-1 text-xs text-slate-600">{common.demoNote}</p>
        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          {DEMO_REVIEWS.map((review) => (
            <div
              key={review.name}
              className="rounded-lg border border-slate-700/60 bg-slate-800/40 p-4"
            >
              <div className="flex gap-0.5 text-orange-500">
                {Array.from({ length: 5 }).map((_, i) => (
                  <svg key={i} viewBox="0 0 20 20" className="h-3.5 w-3.5" fill="currentColor">
                    <path d="M10 1.5 12.6 7l6 .9-4.3 4.2 1 6-5.3-2.8L4.7 18.1l1-6L1.4 7.9l6-.9Z" />
                  </svg>
                ))}
              </div>
              <p className="mt-2 text-sm leading-relaxed text-slate-300">
                &ldquo;{review.text}&rdquo;
              </p>
              <p className="mt-2 text-xs font-medium text-slate-500">{review.name}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Booking */}
      <section id="booking" className="border-b border-slate-700/60 px-5 py-12 sm:px-8">
        <h3 className="text-xs font-semibold uppercase tracking-[0.3em] text-orange-500">
          {dict.bookingHeading}
        </h3>

        {step !== "done" && (
          <div className="mt-6 flex flex-wrap gap-2">
            {STEP_ORDER.map((s, i) => (
              <span
                key={s}
                className={`rounded-md px-3 py-1 text-[11px] font-medium uppercase tracking-wider ${
                  i === stepIndex
                    ? "bg-orange-500 text-slate-950"
                    : i < stepIndex
                      ? "bg-orange-500/20 text-orange-400"
                      : "bg-slate-800 text-slate-500"
                }`}
              >
                {STEP_LABELS[s]}
              </span>
            ))}
          </div>
        )}

        <div className="mt-6 rounded-xl border border-slate-700/60 bg-slate-800/40 p-5 sm:p-6">
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
                  className={`flex items-center justify-between rounded-lg border px-4 py-3 text-left text-sm transition-colors ${
                    service?.id === s.id
                      ? "border-orange-500 bg-orange-500/10"
                      : "border-slate-700 hover:border-orange-500/50"
                  }`}
                >
                  <span>
                    <span className="block font-medium text-slate-100">{s.name}</span>
                    <span className="block text-xs text-slate-500">{s.duration}</span>
                  </span>
                  <span className="font-semibold text-orange-500">{s.price}</span>
                </button>
              ))}
            </div>
          )}

          {step === "datetime" && (
            <div className="flex flex-col gap-6">
              <div>
                <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-500">
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
                      className={`rounded-md border px-4 py-2 text-sm transition-colors ${
                        dateId === d.id
                          ? "border-orange-500 bg-orange-500/10 text-orange-400"
                          : "border-slate-700 text-slate-300 hover:border-orange-500/50"
                      }`}
                    >
                      {d.label}
                    </button>
                  ))}
                </div>
              </div>

              {dateId && (
                <div>
                  <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-500">
                    {dict.selectTime}
                  </p>
                  <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
                    {GARAGE_TIME_SLOTS.map((t, i) => {
                      const available = isGarageSlotAvailable(dateId, i);
                      return (
                        <button
                          key={t}
                          type="button"
                          disabled={!available}
                          onClick={() => setTime(t)}
                          className={`rounded-md border px-2 py-2 text-sm transition-colors ${
                            !available
                              ? "cursor-not-allowed border-slate-800 text-slate-700 line-through"
                              : time === t
                                ? "border-orange-500 bg-orange-500/10 text-orange-400"
                                : "border-slate-700 text-slate-300 hover:border-orange-500/50"
                          }`}
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
                  className="text-xs font-medium text-slate-500 hover:text-orange-400"
                >
                  &larr; {common.back}
                </button>
                <button
                  type="button"
                  disabled={!dateId || !time}
                  onClick={() => setStep("details")}
                  className="rounded-md bg-orange-500 px-5 py-2 text-xs font-semibold uppercase tracking-wider text-slate-950 transition-colors hover:bg-orange-400 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  {common.continueLabel}
                </button>
              </div>
            </div>
          )}

          {step === "details" && (
            <form onSubmit={handleDetailsSubmit} className="flex flex-col gap-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-slate-400">
                    {common.fullName}
                  </label>
                  <input
                    value={form.name}
                    onChange={(e) => update("name", e.target.value)}
                    className="w-full rounded-md border border-slate-700 bg-slate-900 px-3 py-2.5 text-sm text-slate-100 outline-none focus:border-orange-500"
                    placeholder={common.namePlaceholder}
                  />
                  {errors.name && <p className="mt-1 text-xs text-red-400">{errors.name}</p>}
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-slate-400">
                    {common.email}
                  </label>
                  <input
                    value={form.email}
                    onChange={(e) => update("email", e.target.value)}
                    className="w-full rounded-md border border-slate-700 bg-slate-900 px-3 py-2.5 text-sm text-slate-100 outline-none focus:border-orange-500"
                    placeholder={common.emailPlaceholder}
                  />
                  {errors.email && <p className="mt-1 text-xs text-red-400">{errors.email}</p>}
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-slate-400">
                    {common.phone}
                  </label>
                  <input
                    value={form.phone}
                    onChange={(e) => update("phone", e.target.value)}
                    className="w-full rounded-md border border-slate-700 bg-slate-900 px-3 py-2.5 text-sm text-slate-100 outline-none focus:border-orange-500"
                    placeholder={common.phonePlaceholder}
                  />
                  {errors.phone && <p className="mt-1 text-xs text-red-400">{errors.phone}</p>}
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-slate-400">
                    {dict.kenteken}
                  </label>
                  <div className="flex gap-2">
                    <input
                      value={form.kenteken}
                      onChange={(e) => {
                        update("kenteken", e.target.value.toUpperCase());
                        setLookupResult(null);
                      }}
                      className="w-full rounded-md border border-slate-700 bg-slate-900 px-3 py-2.5 text-sm uppercase text-slate-100 outline-none focus:border-orange-500"
                      placeholder="12-ABC-3"
                    />
                    <button
                      type="button"
                      onClick={lookupVehicle}
                      disabled={form.kenteken.trim().length < 5}
                      className="shrink-0 rounded-md border border-orange-500/60 px-3 py-2.5 text-xs font-semibold uppercase tracking-wide text-orange-500 transition-colors hover:bg-orange-500/10 disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      {dict.lookupButton}
                    </button>
                  </div>
                  {errors.kenteken && (
                    <p className="mt-1 text-xs text-red-400">{errors.kenteken}</p>
                  )}
                  {lookupResult && (
                    <p className="mt-1.5 text-xs text-slate-400">
                      {dict.vehicleFoundLabel} {lookupResult.brand} {lookupResult.model} ({lookupResult.year})
                    </p>
                  )}
                  <p className="mt-1 text-[11px] text-slate-500">{dict.lookupNote}</p>
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-slate-400">
                    {dict.carBrand}
                  </label>
                  <select
                    value={form.brand}
                    onChange={(e) => update("brand", e.target.value)}
                    className="w-full rounded-md border border-slate-700 bg-slate-900 px-3 py-2.5 text-sm text-slate-100 outline-none focus:border-orange-500"
                  >
                    <option value="">{dict.selectBrand}</option>
                    {CAR_BRANDS.map((b) => (
                      <option key={b} value={b}>
                        {b}
                      </option>
                    ))}
                  </select>
                  {errors.brand && <p className="mt-1 text-xs text-red-400">{errors.brand}</p>}
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-slate-400">
                    {dict.model}
                  </label>
                  <input
                    value={form.model}
                    onChange={(e) => update("model", e.target.value)}
                    className="w-full rounded-md border border-slate-700 bg-slate-900 px-3 py-2.5 text-sm text-slate-100 outline-none focus:border-orange-500"
                    placeholder="3 Series"
                  />
                  {errors.model && <p className="mt-1 text-xs text-red-400">{errors.model}</p>}
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-slate-400">
                    {dict.mileage}
                  </label>
                  <input
                    value={form.mileage}
                    onChange={(e) => update("mileage", e.target.value)}
                    className="w-full rounded-md border border-slate-700 bg-slate-900 px-3 py-2.5 text-sm text-slate-100 outline-none focus:border-orange-500"
                    placeholder="124,000"
                  />
                  {errors.mileage && (
                    <p className="mt-1 text-xs text-red-400">{errors.mileage}</p>
                  )}
                </div>
              </div>
              <div className="flex items-center justify-between pt-1">
                <button
                  type="button"
                  onClick={() => setStep("datetime")}
                  className="text-xs font-medium text-slate-500 hover:text-orange-400"
                >
                  &larr; {common.back}
                </button>
                <button
                  type="submit"
                  className="rounded-md bg-orange-500 px-5 py-2 text-xs font-semibold uppercase tracking-wider text-slate-950 transition-colors hover:bg-orange-400"
                >
                  {common.continueLabel}
                </button>
              </div>
            </form>
          )}

          {step === "review" && service && dateId && time && (
            <div className="flex flex-col gap-5">
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                {dict.reviewHeading}
              </p>
              <dl className="grid gap-3 text-sm sm:grid-cols-2">
                <div>
                  <dt className="text-slate-500">{dict.summaryService}</dt>
                  <dd className="text-slate-100">{service.name}</dd>
                </div>
                <div>
                  <dt className="text-slate-500">{dict.summaryDate}</dt>
                  <dd className="text-slate-100">{GARAGE_DATE_FULL_LABELS[dateId]}</dd>
                </div>
                <div>
                  <dt className="text-slate-500">{dict.summaryTime}</dt>
                  <dd className="text-slate-100">{time}</dd>
                </div>
                <div>
                  <dt className="text-slate-500">{dict.summaryVehicle}</dt>
                  <dd className="text-slate-100">
                    {form.brand} {form.model} &middot; {form.kenteken}
                  </dd>
                </div>
                <div>
                  <dt className="text-slate-500">{dict.summaryMileage}</dt>
                  <dd className="text-slate-100">{form.mileage} km</dd>
                </div>
                <div>
                  <dt className="text-slate-500">{dict.summaryContact}</dt>
                  <dd className="text-slate-100">
                    {form.name} &middot; {form.email}
                  </dd>
                </div>
              </dl>
              <div className="flex items-center justify-between pt-1">
                <button
                  type="button"
                  onClick={() => setStep("details")}
                  className="text-xs font-medium text-slate-500 hover:text-orange-400"
                >
                  &larr; {common.back}
                </button>
                <button
                  type="button"
                  onClick={() => setStep("done")}
                  className="rounded-md bg-orange-500 px-5 py-2 text-xs font-semibold uppercase tracking-wider text-slate-950 transition-colors hover:bg-orange-400"
                >
                  {dict.confirmAppointment}
                </button>
              </div>
            </div>
          )}

          {step === "done" && service && dateId && time && !cancelled && (
            <div className="flex flex-col items-center gap-4 py-4 text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-orange-500/15 text-orange-500">
                <svg viewBox="0 0 20 20" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth={2}>
                  <path d="m4 10 4 4 8-8" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <p className="text-lg font-semibold text-white">{dict.confirmedTitle}</p>
              <div className="text-sm leading-relaxed text-slate-300">
                <p>{service.name}</p>
                <p>{GARAGE_DATE_FULL_LABELS[dateId]}</p>
                <p>{time}</p>
                <p className="pt-2 text-slate-500">{dict.vehicleLabel}</p>
                <p>
                  {form.brand} {form.model}
                </p>
                <p>{form.kenteken}</p>
              </div>
              <div className="mt-2 flex flex-wrap items-center justify-center gap-4">
                <button
                  type="button"
                  onClick={rescheduleAppointment}
                  className="text-xs font-medium text-slate-400 hover:text-white"
                >
                  {common.reschedule}
                </button>
                <button
                  type="button"
                  onClick={() => setCancelled(true)}
                  className="text-xs font-medium text-slate-400 hover:text-red-400"
                >
                  {common.cancelAppointment}
                </button>
                <button
                  type="button"
                  onClick={reset}
                  className="text-xs font-medium text-orange-500 hover:text-orange-400"
                >
                  {common.bookAnother}
                </button>
              </div>
            </div>
          )}

          {step === "done" && cancelled && (
            <div className="flex flex-col items-center gap-4 py-4 text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/5 text-slate-400">
                <svg viewBox="0 0 20 20" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth={2}>
                  <path d="m5 5 10 10M15 5 5 15" strokeLinecap="round" />
                </svg>
              </div>
              <p className="text-lg font-semibold text-white">{common.cancelledTitle}</p>
              <p className="text-sm text-slate-400">{common.cancelledBody}</p>
              <button
                type="button"
                onClick={reset}
                className="mt-2 text-xs font-medium text-orange-500 hover:text-orange-400"
              >
                {common.bookNew}
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Hours / Contact */}
      <section className="grid gap-8 border-b border-slate-700/60 px-5 py-12 sm:grid-cols-3 sm:px-8">
        <div>
          <h4 className="text-xs font-semibold uppercase tracking-[0.3em] text-orange-500">
            {common.hoursHeading}
          </h4>
          <dl className="mt-4 flex flex-col gap-1.5 text-sm text-slate-400">
            <div className="flex justify-between gap-4">
              <dt>{common.monFri}</dt>
              <dd>08:00 - 17:30</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt>{common.saturday}</dt>
              <dd>09:00 - 13:00</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt>{common.sunday}</dt>
              <dd>{common.closed}</dd>
            </div>
          </dl>
        </div>
        <div>
          <h4 className="text-xs font-semibold uppercase tracking-[0.3em] text-orange-500">
            {common.locationHeading}
          </h4>
          <p className="mt-4 text-sm leading-relaxed text-slate-400">
            Maastricht, Netherlands
          </p>
        </div>
        <div>
          <h4 className="text-xs font-semibold uppercase tracking-[0.3em] text-orange-500">
            {common.contactHeading}
          </h4>
          <p className="mt-4 text-sm leading-relaxed text-slate-400">
            info@steenbergautoservice.nl
            <br />
            043 123 45 67
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-5 py-6 text-center text-xs text-slate-600 sm:px-8">
        Steenberg Autoservice &middot; {common.footerTagline}
      </footer>
    </div>
  );
}
