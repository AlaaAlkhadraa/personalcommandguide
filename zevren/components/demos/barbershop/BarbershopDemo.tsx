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

type Step = "service" | "barber" | "datetime" | "details" | "review" | "done";

const STEP_ORDER: Step[] = ["service", "barber", "datetime", "details", "review"];
const STEP_LABELS: Record<Step, string> = {
  service: "Service",
  barber: "Barber",
  datetime: "Date & time",
  details: "Your details",
  review: "Confirm",
  done: "Done",
};

interface Details {
  name: string;
  email: string;
  phone: string;
}

export function BarbershopDemo() {
  const [step, setStep] = useState<Step>("service");
  const [service, setService] = useState<BarberService | null>(null);
  const [barber, setBarber] = useState<Barber | null>(null);
  const [dateId, setDateId] = useState<string | null>(null);
  const [time, setTime] = useState<string | null>(null);
  const [details, setDetails] = useState<Details>({ name: "", email: "", phone: "" });
  const [errors, setErrors] = useState<Partial<Details>>({});

  const stepIndex = STEP_ORDER.indexOf(step);

  function goTo(next: Step) {
    setStep(next);
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
    setStep("service");
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-amber-900/40 bg-neutral-950 text-neutral-100">
      {/* Navigation */}
      <nav className="flex items-center justify-between border-b border-amber-900/30 bg-neutral-950/95 px-5 py-4 sm:px-8">
        <span className="font-heading text-lg font-semibold tracking-wide text-amber-400">
          IRONSIDE <span className="text-neutral-100">BARBERSHOP</span>
        </span>
        <div className="hidden items-center gap-6 text-sm text-neutral-400 sm:flex">
          <span>Services</span>
          <span>Team</span>
          <span>Hours</span>
          <span>Contact</span>
        </div>
        <a
          href="#booking"
          className="rounded-full bg-amber-400 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-neutral-950 transition-colors hover:bg-amber-300"
        >
          Book now
        </a>
      </nav>

      {/* Hero */}
      <section className="border-b border-amber-900/30 bg-[radial-gradient(circle_at_20%_10%,rgba(251,191,36,0.12),transparent_55%)] px-5 py-14 sm:px-8 sm:py-20">
        <span className="text-xs font-semibold uppercase tracking-[0.3em] text-amber-400">
          Maastricht
        </span>
        <h2 className="mt-4 max-w-lg font-heading text-3xl font-semibold leading-tight text-white sm:text-4xl">
          Sharp cuts, no waiting around.
        </h2>
        <p className="mt-4 max-w-md text-sm leading-relaxed text-neutral-400">
          Book your appointment online in under a minute and walk in right on
          time.
        </p>
        <a
          href="#booking"
          className="mt-6 inline-flex w-fit items-center rounded-full border border-amber-400/60 px-5 py-2.5 text-sm font-semibold text-amber-400 transition-colors hover:bg-amber-400/10"
        >
          Book an appointment
        </a>
      </section>

      {/* Services / Prices */}
      <section className="border-b border-amber-900/30 px-5 py-12 sm:px-8">
        <h3 className="text-xs font-semibold uppercase tracking-[0.3em] text-amber-400">
          Services
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
          Our barbers
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

      {/* Booking */}
      <section id="booking" className="border-b border-amber-900/30 px-5 py-12 sm:px-8">
        <h3 className="text-xs font-semibold uppercase tracking-[0.3em] text-amber-400">
          Book an appointment
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
                &larr; Back
              </button>
            </div>
          )}

          {step === "datetime" && barber && (
            <div className="flex flex-col gap-6">
              <div>
                <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-neutral-500">
                  Select a date
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
                    Select a time
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
                  &larr; Back
                </button>
                <button
                  type="button"
                  disabled={!dateId || !time}
                  onClick={() => goTo("details")}
                  className="rounded-full bg-amber-400 px-5 py-2 text-xs font-semibold uppercase tracking-wider text-neutral-950 transition-colors hover:bg-amber-300 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Continue
                </button>
              </div>
            </div>
          )}

          {step === "details" && (
            <form onSubmit={handleDetailsSubmit} className="flex flex-col gap-4">
              <div>
                <label className="mb-1.5 block text-xs font-medium text-neutral-400">
                  Full name
                </label>
                <input
                  value={details.name}
                  onChange={(e) => setDetails({ ...details, name: e.target.value })}
                  className="w-full rounded-lg border border-white/10 bg-neutral-900 px-3 py-2.5 text-sm text-neutral-100 outline-none focus:border-amber-400"
                  placeholder="Jane Doe"
                />
                {errors.name && <p className="mt-1 text-xs text-red-400">{errors.name}</p>}
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-medium text-neutral-400">
                  Email address
                </label>
                <input
                  value={details.email}
                  onChange={(e) => setDetails({ ...details, email: e.target.value })}
                  className="w-full rounded-lg border border-white/10 bg-neutral-900 px-3 py-2.5 text-sm text-neutral-100 outline-none focus:border-amber-400"
                  placeholder="jane@example.com"
                />
                {errors.email && <p className="mt-1 text-xs text-red-400">{errors.email}</p>}
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-medium text-neutral-400">
                  Phone number
                </label>
                <input
                  value={details.phone}
                  onChange={(e) => setDetails({ ...details, phone: e.target.value })}
                  className="w-full rounded-lg border border-white/10 bg-neutral-900 px-3 py-2.5 text-sm text-neutral-100 outline-none focus:border-amber-400"
                  placeholder="06 12345678"
                />
                {errors.phone && <p className="mt-1 text-xs text-red-400">{errors.phone}</p>}
              </div>
              <div className="flex items-center justify-between pt-1">
                <button
                  type="button"
                  onClick={() => goTo("datetime")}
                  className="text-xs font-medium text-neutral-500 hover:text-amber-400"
                >
                  &larr; Back
                </button>
                <button
                  type="submit"
                  className="rounded-full bg-amber-400 px-5 py-2 text-xs font-semibold uppercase tracking-wider text-neutral-950 transition-colors hover:bg-amber-300"
                >
                  Continue
                </button>
              </div>
            </form>
          )}

          {step === "review" && service && barber && dateId && time && (
            <div className="flex flex-col gap-5">
              <p className="text-xs font-semibold uppercase tracking-wider text-neutral-500">
                Review your appointment
              </p>
              <dl className="grid gap-3 text-sm sm:grid-cols-2">
                <div>
                  <dt className="text-neutral-500">Service</dt>
                  <dd className="text-neutral-100">{service.name}</dd>
                </div>
                <div>
                  <dt className="text-neutral-500">Barber</dt>
                  <dd className="text-neutral-100">{barber.name}</dd>
                </div>
                <div>
                  <dt className="text-neutral-500">Date</dt>
                  <dd className="text-neutral-100">{BARBER_DATE_FULL_LABELS[dateId]}</dd>
                </div>
                <div>
                  <dt className="text-neutral-500">Time</dt>
                  <dd className="text-neutral-100">{time}</dd>
                </div>
                <div>
                  <dt className="text-neutral-500">Name</dt>
                  <dd className="text-neutral-100">{details.name}</dd>
                </div>
                <div>
                  <dt className="text-neutral-500">Contact</dt>
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
                  &larr; Back
                </button>
                <button
                  type="button"
                  onClick={confirmBooking}
                  className="rounded-full bg-amber-400 px-5 py-2 text-xs font-semibold uppercase tracking-wider text-neutral-950 transition-colors hover:bg-amber-300"
                >
                  Confirm appointment
                </button>
              </div>
            </div>
          )}

          {step === "done" && service && barber && dateId && time && (
            <div className="flex flex-col items-center gap-4 py-4 text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-amber-400/15 text-amber-400">
                <svg viewBox="0 0 20 20" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth={2}>
                  <path d="m4 10 4 4 8-8" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <p className="text-lg font-semibold text-white">Appointment confirmed</p>
              <div className="text-sm leading-relaxed text-neutral-300">
                <p>{service.name}</p>
                <p>{BARBER_DATE_FULL_LABELS[dateId]}</p>
                <p>{time}</p>
                <p>{barber.name}</p>
              </div>
              <button
                type="button"
                onClick={reset}
                className="mt-2 text-xs font-medium text-amber-400 hover:text-amber-300"
              >
                Book another appointment
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Hours / Location / Contact */}
      <section className="grid gap-8 border-b border-amber-900/30 px-5 py-12 sm:grid-cols-3 sm:px-8">
        <div>
          <h4 className="text-xs font-semibold uppercase tracking-[0.3em] text-amber-400">
            Opening hours
          </h4>
          <dl className="mt-4 flex flex-col gap-1.5 text-sm text-neutral-400">
            <div className="flex justify-between gap-4">
              <dt>Mon - Fri</dt>
              <dd>09:00 - 18:00</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt>Saturday</dt>
              <dd>09:00 - 17:00</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt>Sunday</dt>
              <dd>Closed</dd>
            </div>
          </dl>
        </div>
        <div>
          <h4 className="text-xs font-semibold uppercase tracking-[0.3em] text-amber-400">
            Location
          </h4>
          <p className="mt-4 text-sm leading-relaxed text-neutral-400">
            Maastricht, Netherlands
          </p>
        </div>
        <div>
          <h4 className="text-xs font-semibold uppercase tracking-[0.3em] text-amber-400">
            Contact
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
        Ironside Barbershop &middot; a website concept by ZEVREN
      </footer>
    </div>
  );
}
