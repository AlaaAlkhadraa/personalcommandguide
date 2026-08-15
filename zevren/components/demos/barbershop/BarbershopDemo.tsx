"use client";

import { useState } from "react";
import {
  BARBERS,
  BARBER_DATES,
  BARBER_DATE_FULL_LABELS,
  BARBER_SERVICES,
  BARBER_TIME_SLOTS,
  isTimeSlotAvailable,
  type Barber,
  type BarberService,
} from "@/lib/demos/barbershop-data";
import type { Dictionary } from "@/lib/i18n/dictionary-type";

type Step = "service" | "barber" | "datetime" | "details" | "review" | "done";

const STEP_ORDER: Step[] = ["service", "barber", "datetime", "details", "review"];

interface BarbershopDemoProps {
  dict: Dictionary["demos"]["barbershop"];
  common: Dictionary["demoCommon"];
}

const GALLERY_SWATCHES = [
  "from-amber-400/40 to-neutral-900",
  "from-amber-900/50 to-neutral-950",
  "from-amber-300/30 to-neutral-900",
  "from-neutral-800 to-amber-950/40",
  "from-amber-500/30 to-neutral-950",
  "from-amber-900/40 to-neutral-900",
];

const DEMO_REVIEWS = [
  { name: "Tom V.", text: "Booked online in a minute, no waiting when I arrived." },
  { name: "Lucas B.", text: "Clean, sharp fade every time. Easy to book a slot that suits me." },
  { name: "Daan H.", text: "Good vibe, good cut, and the booking flow is dead simple." },
];

interface Details {
  name: string;
  email: string;
  phone: string;
}

export function BarbershopDemo({ dict, common }: BarbershopDemoProps) {
  const STEP_LABELS: Record<Step, string> = dict.steps;
  const [step, setStep] = useState<Step>("service");
  const [service, setService] = useState<BarberService | null>(null);
  const [barber, setBarber] = useState<Barber | null>(null);
  const [dateId, setDateId] = useState<string | null>(null);
  const [time, setTime] = useState<string | null>(null);
  const [details, setDetails] = useState<Details>({ name: "", email: "", phone: "" });
  const [errors, setErrors] = useState<Partial<Details>>({});
  const [cancelled, setCancelled] = useState(false);

  const stepIndex = STEP_ORDER.indexOf(step);

  function goTo(next: Step) {
    setStep(next);
  }

  function rescheduleAppointment() {
    setDateId(null);
    setTime(null);
    setCancelled(false);
    goTo("datetime");
  }

  function handleDetailsSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const nextErrors: Partial<Details> = {};
    if (details.name.trim().length < 2) nextErrors.name = "Enter your full name.";
    if (!/^\S+@\S+\.\S+$/.test(details.email)) nextErrors.email = "Enter a valid email address.";
    if (details.phone.trim().length < 6) nextErrors.phone = "Enter a valid phone number.";
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length === 0) {
      goTo("review");
    }
  }

  function confirmBooking() {
    setStep("done");
  }

  function reset() {
    setService(null);
    setBarber(null);
    setDateId(null);
    setTime(null);
    setDetails({ name: "", email: "", phone: "" });
    setErrors({});
    setCancelled(false);
    setStep("service");
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-amber-900/40 bg-neutral-950 text-neutral-100">
      {/* Navigation */}
      <nav className="flex items-center justify-between border-b border-amber-900/30 bg-neutral-950/95 px-5 py-4 sm:px-8">
        <span className="font-heading text-lg font-semibold tracking-wide text-amber-400">
          ZEVEN <span className="text-neutral-100">CUTS</span>
        </span>
        <div className="hidden items-center gap-6 text-sm text-neutral-400 sm:flex">
          <span>{dict.navServices}</span>
          <span>{dict.navTeam}</span>
          <span>{dict.navHours}</span>
          <span>{dict.navContact}</span>
        </div>
        <a
          href="#booking"
          className="rounded-full bg-amber-400 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-neutral-950 transition-colors hover:bg-amber-300"
        >
          {dict.bookNow}
        </a>
      </nav>

      {/* Hero */}
      <section className="border-b border-amber-900/30 bg-[radial-gradient(circle_at_20%_10%,rgba(251,191,36,0.12),transparent_55%)] px-5 py-14 sm:px-8 sm:py-20">
        <span className="text-xs font-semibold uppercase tracking-[0.3em] text-amber-400">
          {dict.heroLocation}
        </span>
        <h2 className="mt-4 max-w-lg font-heading text-3xl font-semibold leading-tight text-white sm:text-4xl">
          {dict.heroHeading}
        </h2>
        <p className="mt-4 max-w-md text-sm leading-relaxed text-neutral-400">
          {dict.heroSubtitle}
        </p>
        <a
          href="#booking"
          className="mt-6 inline-flex w-fit items-center rounded-full border border-amber-400/60 px-5 py-2.5 text-sm font-semibold text-amber-400 transition-colors hover:bg-amber-400/10"
        >
          {dict.heroCta}
        </a>
      </section>

      {/* Services / Prices */}
      <section className="border-b border-amber-900/30 px-5 py-12 sm:px-8">
        <h3 className="text-xs font-semibold uppercase tracking-[0.3em] text-amber-400">
          {dict.servicesHeading}
        </h3>
        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          {BARBER_SERVICES.map((s) => (
            <div
              key={s.id}
              className="flex items-center justify-between gap-3 rounded-xl border border-white/5 bg-white/[0.02] px-4 py-3"
            >
              <div>
                <p className="text-sm font-medium text-neutral-100">{s.name}</p>
                <p className="text-xs text-neutral-500">{s.duration}</p>
              </div>
              <span className="text-sm font-semibold text-amber-400">{s.price}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Team */}
      <section className="border-b border-amber-900/30 px-5 py-12 sm:px-8">
        <h3 className="text-xs font-semibold uppercase tracking-[0.3em] text-amber-400">
          {dict.teamHeading}
        </h3>
        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          {BARBERS.map((b) => (
            <div
              key={b.id}
              className="rounded-xl border border-white/5 bg-white/[0.02] p-4 text-center"
            >
              <div className="mx-auto h-14 w-14 rounded-full bg-gradient-to-br from-amber-400/40 to-amber-900/40" />
              <p className="mt-3 text-sm font-medium text-neutral-100">{b.name}</p>
              <p className="text-xs text-neutral-500">{b.role}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Gallery */}
      <section className="border-b border-amber-900/30 px-5 py-12 sm:px-8">
        <h3 className="text-xs font-semibold uppercase tracking-[0.3em] text-amber-400">
          {dict.galleryHeading}
        </h3>
        <div className="mt-6 grid grid-cols-3 gap-2 sm:grid-cols-6">
          {GALLERY_SWATCHES.map((swatch, i) => (
            <div
              key={i}
              className={`aspect-square rounded-lg bg-gradient-to-br ${swatch}`}
            />
          ))}
        </div>
      </section>

      {/* Reviews */}
      <section className="border-b border-amber-900/30 px-5 py-12 sm:px-8">
        <h3 className="text-xs font-semibold uppercase tracking-[0.3em] text-amber-400">
          {dict.reviewsHeading}
        </h3>
        <p className="mt-1 text-xs text-neutral-600">{common.demoNote}</p>
        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          {DEMO_REVIEWS.map((review) => (
            <div
              key={review.name}
              className="rounded-xl border border-white/5 bg-white/[0.02] p-4"
            >
              <div className="flex gap-0.5 text-amber-400">
                {Array.from({ length: 5 }).map((_, i) => (
                  <svg key={i} viewBox="0 0 20 20" className="h-3.5 w-3.5" fill="currentColor">
                    <path d="M10 1.5 12.6 7l6 .9-4.3 4.2 1 6-5.3-2.8L4.7 18.1l1-6L1.4 7.9l6-.9Z" />
                  </svg>
                ))}
              </div>
              <p className="mt-2 text-sm leading-relaxed text-neutral-300">
                &ldquo;{review.text}&rdquo;
              </p>
              <p className="mt-2 text-xs font-medium text-neutral-500">{review.name}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Booking */}
      <section id="booking" className="border-b border-amber-900/30 px-5 py-12 sm:px-8">
        <h3 className="text-xs font-semibold uppercase tracking-[0.3em] text-amber-400">
          {dict.bookingHeading}
        </h3>

        {step !== "done" && (
          <div className="mt-6 flex flex-wrap gap-2">
            {STEP_ORDER.map((s, i) => (
              <span
                key={s}
                className={`rounded-full px-3 py-1 text-[11px] font-medium uppercase tracking-wider ${
                  i === stepIndex
                    ? "bg-amber-400 text-neutral-950"
                    : i < stepIndex
                      ? "bg-amber-400/20 text-amber-400"
                      : "bg-white/5 text-neutral-500"
                }`}
              >
                {STEP_LABELS[s]}
              </span>
            ))}
          </div>
        )}

        <div className="mt-6 rounded-2xl border border-white/5 bg-white/[0.02] p-5 sm:p-6">
          {step === "service" && (
            <div className="grid gap-3 sm:grid-cols-2">
              {BARBER_SERVICES.map((s) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => {
                    setService(s);
                    goTo("barber");
                  }}
                  className={`flex items-center justify-between rounded-xl border px-4 py-3 text-left text-sm transition-colors ${
                    service?.id === s.id
                      ? "border-amber-400 bg-amber-400/10"
                      : "border-white/10 hover:border-amber-400/50"
                  }`}
                >
                  <span>
                    <span className="block font-medium text-neutral-100">{s.name}</span>
                    <span className="block text-xs text-neutral-500">{s.duration}</span>
                  </span>
                  <span className="font-semibold text-amber-400">{s.price}</span>
                </button>
              ))}
            </div>
          )}

          {step === "barber" && (
            <div className="grid gap-3 sm:grid-cols-3">
              {BARBERS.map((b) => (
                <button
                  key={b.id}
                  type="button"
                  onClick={() => {
                    setBarber(b);
                    goTo("datetime");
                  }}
                  className={`rounded-xl border px-4 py-4 text-center text-sm transition-colors ${
                    barber?.id === b.id
                      ? "border-amber-400 bg-amber-400/10"
                      : "border-white/10 hover:border-amber-400/50"
                  }`}
                >
                  <span className="block font-medium text-neutral-100">{b.name}</span>
                  <span className="block text-xs text-neutral-500">{b.role}</span>
                </button>
              ))}
              <button
                type="button"
                onClick={() => goTo("service")}
                className="mt-1 text-xs font-medium text-neutral-500 hover:text-amber-400 sm:col-span-3 sm:text-left"
              >
                &larr; {common.back}
              </button>
            </div>
          )}

          {step === "datetime" && barber && (
            <div className="flex flex-col gap-6">
              <div>
                <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-neutral-500">
                  {dict.selectDate}
                </p>
                <div className="flex flex-wrap gap-2">
                  {BARBER_DATES.map((d) => (
                    <button
                      key={d.id}
                      type="button"
                      onClick={() => {
                        setDateId(d.id);
                        setTime(null);
                      }}
                      className={`rounded-full border px-4 py-2 text-sm transition-colors ${
                        dateId === d.id
                          ? "border-amber-400 bg-amber-400/10 text-amber-400"
                          : "border-white/10 text-neutral-300 hover:border-amber-400/50"
                      }`}
                    >
                      {d.label}
                    </button>
                  ))}
                </div>
              </div>

              {dateId && (
                <div>
                  <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-neutral-500">
                    {dict.selectTime}
                  </p>
                  <div className="grid grid-cols-3 gap-2 sm:grid-cols-5">
                    {BARBER_TIME_SLOTS.map((t, i) => {
                      const available = isTimeSlotAvailable(dateId, barber.id, i);
                      return (
                        <button
                          key={t}
                          type="button"
                          disabled={!available}
                          onClick={() => setTime(t)}
                          className={`rounded-lg border px-2 py-2 text-sm transition-colors ${
                            !available
                              ? "cursor-not-allowed border-white/5 text-neutral-700 line-through"
                              : time === t
                                ? "border-amber-400 bg-amber-400/10 text-amber-400"
                                : "border-white/10 text-neutral-300 hover:border-amber-400/50"
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
                  onClick={() => goTo("barber")}
                  className="text-xs font-medium text-neutral-500 hover:text-amber-400"
                >
                  &larr; {common.back}
                </button>
                <button
                  type="button"
                  disabled={!dateId || !time}
                  onClick={() => goTo("details")}
                  className="rounded-full bg-amber-400 px-5 py-2 text-xs font-semibold uppercase tracking-wider text-neutral-950 transition-colors hover:bg-amber-300 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  {common.continueLabel}
                </button>
              </div>
            </div>
          )}

          {step === "details" && (
            <form onSubmit={handleDetailsSubmit} className="flex flex-col gap-4">
              <div>
                <label className="mb-1.5 block text-xs font-medium text-neutral-400">
                  {common.fullName}
                </label>
                <input
                  value={details.name}
                  onChange={(e) => setDetails({ ...details, name: e.target.value })}
                  className="w-full rounded-lg border border-white/10 bg-neutral-900 px-3 py-2.5 text-sm text-neutral-100 outline-none focus:border-amber-400"
                  placeholder={common.namePlaceholder}
                />
                {errors.name && <p className="mt-1 text-xs text-red-400">{errors.name}</p>}
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-medium text-neutral-400">
                  {common.email}
                </label>
                <input
                  value={details.email}
                  onChange={(e) => setDetails({ ...details, email: e.target.value })}
                  className="w-full rounded-lg border border-white/10 bg-neutral-900 px-3 py-2.5 text-sm text-neutral-100 outline-none focus:border-amber-400"
                  placeholder={common.emailPlaceholder}
                />
                {errors.email && <p className="mt-1 text-xs text-red-400">{errors.email}</p>}
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-medium text-neutral-400">
                  {common.phone}
                </label>
                <input
                  value={details.phone}
                  onChange={(e) => setDetails({ ...details, phone: e.target.value })}
                  className="w-full rounded-lg border border-white/10 bg-neutral-900 px-3 py-2.5 text-sm text-neutral-100 outline-none focus:border-amber-400"
                  placeholder={common.phonePlaceholder}
                />
                {errors.phone && <p className="mt-1 text-xs text-red-400">{errors.phone}</p>}
              </div>
              <div className="flex items-center justify-between pt-1">
                <button
                  type="button"
                  onClick={() => goTo("datetime")}
                  className="text-xs font-medium text-neutral-500 hover:text-amber-400"
                >
                  &larr; {common.back}
                </button>
                <button
                  type="submit"
                  className="rounded-full bg-amber-400 px-5 py-2 text-xs font-semibold uppercase tracking-wider text-neutral-950 transition-colors hover:bg-amber-300"
                >
                  {common.continueLabel}
                </button>
              </div>
            </form>
          )}

          {step === "review" && service && barber && dateId && time && (
            <div className="flex flex-col gap-5">
              <p className="text-xs font-semibold uppercase tracking-wider text-neutral-500">
                {dict.reviewHeading}
              </p>
              <dl className="grid gap-3 text-sm sm:grid-cols-2">
                <div>
                  <dt className="text-neutral-500">{dict.summaryService}</dt>
                  <dd className="text-neutral-100">{service.name}</dd>
                </div>
                <div>
                  <dt className="text-neutral-500">{dict.summaryBarber}</dt>
                  <dd className="text-neutral-100">{barber.name}</dd>
                </div>
                <div>
                  <dt className="text-neutral-500">{dict.summaryDate}</dt>
                  <dd className="text-neutral-100">{BARBER_DATE_FULL_LABELS[dateId]}</dd>
                </div>
                <div>
                  <dt className="text-neutral-500">{dict.summaryTime}</dt>
                  <dd className="text-neutral-100">{time}</dd>
                </div>
                <div>
                  <dt className="text-neutral-500">{dict.summaryName}</dt>
                  <dd className="text-neutral-100">{details.name}</dd>
                </div>
                <div>
                  <dt className="text-neutral-500">{dict.summaryContact}</dt>
                  <dd className="text-neutral-100">
                    {details.email} &middot; {details.phone}
                  </dd>
                </div>
              </dl>
              <div className="flex items-center justify-between pt-1">
                <button
                  type="button"
                  onClick={() => goTo("details")}
                  className="text-xs font-medium text-neutral-500 hover:text-amber-400"
                >
                  &larr; {common.back}
                </button>
                <button
                  type="button"
                  onClick={confirmBooking}
                  className="rounded-full bg-amber-400 px-5 py-2 text-xs font-semibold uppercase tracking-wider text-neutral-950 transition-colors hover:bg-amber-300"
                >
                  {dict.confirmAppointment}
                </button>
              </div>
            </div>
          )}

          {step === "done" && service && barber && dateId && time && !cancelled && (
            <div className="flex flex-col items-center gap-4 py-4 text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-amber-400/15 text-amber-400">
                <svg viewBox="0 0 20 20" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth={2}>
                  <path d="m4 10 4 4 8-8" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <p className="text-lg font-semibold text-white">{dict.confirmedTitle}</p>
              <div className="text-sm leading-relaxed text-neutral-300">
                <p>{service.name}</p>
                <p>{BARBER_DATE_FULL_LABELS[dateId]}</p>
                <p>{time}</p>
                <p>{barber.name}</p>
              </div>
              <div className="mt-2 flex flex-wrap items-center justify-center gap-4">
                <button
                  type="button"
                  onClick={rescheduleAppointment}
                  className="text-xs font-medium text-neutral-400 hover:text-white"
                >
                  {common.reschedule}
                </button>
                <button
                  type="button"
                  onClick={() => setCancelled(true)}
                  className="text-xs font-medium text-neutral-400 hover:text-red-400"
                >
                  {common.cancelAppointment}
                </button>
                <button
                  type="button"
                  onClick={reset}
                  className="text-xs font-medium text-amber-400 hover:text-amber-300"
                >
                  {common.bookAnother}
                </button>
              </div>
            </div>
          )}

          {step === "done" && cancelled && (
            <div className="flex flex-col items-center gap-4 py-4 text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/5 text-neutral-400">
                <svg viewBox="0 0 20 20" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth={2}>
                  <path d="m5 5 10 10M15 5 5 15" strokeLinecap="round" />
                </svg>
              </div>
              <p className="text-lg font-semibold text-white">{common.cancelledTitle}</p>
              <p className="text-sm text-neutral-400">{common.cancelledBody}</p>
              <button
                type="button"
                onClick={reset}
                className="mt-2 text-xs font-medium text-amber-400 hover:text-amber-300"
              >
                {common.bookNew}
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Hours / Location / Contact */}
      <section className="grid gap-8 border-b border-amber-900/30 px-5 py-12 sm:grid-cols-3 sm:px-8">
        <div>
          <h4 className="text-xs font-semibold uppercase tracking-[0.3em] text-amber-400">
            {common.hoursHeading}
          </h4>
          <dl className="mt-4 flex flex-col gap-1.5 text-sm text-neutral-400">
            <div className="flex justify-between gap-4">
              <dt>{common.monFri}</dt>
              <dd>09:00 - 18:00</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt>{common.saturday}</dt>
              <dd>09:00 - 17:00</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt>{common.sunday}</dt>
              <dd>{common.closed}</dd>
            </div>
          </dl>
        </div>
        <div>
          <h4 className="text-xs font-semibold uppercase tracking-[0.3em] text-amber-400">
            {common.locationHeading}
          </h4>
          <p className="mt-4 text-sm leading-relaxed text-neutral-400">
            Maastricht, Netherlands
          </p>
        </div>
        <div>
          <h4 className="text-xs font-semibold uppercase tracking-[0.3em] text-amber-400">
            {common.contactHeading}
          </h4>
          <p className="mt-4 text-sm leading-relaxed text-neutral-400">
            hello@ironsidebarbershop.nl
            <br />
            06 12 34 56 78
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-5 py-6 text-center text-xs text-neutral-600 sm:px-8">
        Zeven Cuts &middot; {common.footerTagline}
      </footer>
    </div>
  );
}
