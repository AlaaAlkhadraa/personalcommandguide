"use client";

import { useMemo, useState } from "react";
import {
  PROPERTIES,
  PROPERTY_LOCATIONS,
  PROPERTY_TYPES,
  VIEWING_DATES,
  VIEWING_TIME_SLOTS,
  type Property,
} from "@/lib/demos/property-data";
import type { Dictionary } from "@/lib/i18n/dictionary-type";

type View = "search" | "detail";

interface ViewingForm {
  name: string;
  email: string;
  phone: string;
  date: string;
  time: string;
}

const EMPTY_VIEWING: ViewingForm = { name: "", email: "", phone: "", date: "", time: "" };

const PRICE_CEILINGS = [
  { label: "Any price", value: Infinity },
  { label: "Up to €1,000", value: 1000 },
  { label: "Up to €1,500", value: 1500 },
  { label: "Up to €2,000", value: 2000 },
];

interface PropertyDemoProps {
  dict: Dictionary["demos"]["property"];
  common: Dictionary["demoCommon"];
}

export function PropertyDemo({ dict, common }: PropertyDemoProps) {
  const [view, setView] = useState<View>("search");
  const [query, setQuery] = useState("");
  const [location, setLocation] = useState("Any location");
  const [type, setType] = useState("Any type");
  const [maxPrice, setMaxPrice] = useState(Infinity);
  const [saved, setSaved] = useState<string[]>([]);
  const [activeProperty, setActiveProperty] = useState<Property | null>(null);
  const [viewingForm, setViewingForm] = useState<ViewingForm>(EMPTY_VIEWING);
  const [viewingErrors, setViewingErrors] = useState<Partial<ViewingForm>>({});
  const [viewingSent, setViewingSent] = useState(false);

  const results = useMemo(() => {
    return PROPERTIES.filter((p) => {
      if (location !== "Any location" && p.location !== location) return false;
      if (type !== "Any type" && p.type !== type) return false;
      if (p.price > maxPrice) return false;
      if (query.trim()) {
        const q = query.trim().toLowerCase();
        if (!p.title.toLowerCase().includes(q) && !p.location.toLowerCase().includes(q)) {
          return false;
        }
      }
      return true;
    });
  }, [location, type, maxPrice, query]);

  function toggleSave(id: string) {
    setSaved((prev) => (prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]));
  }

  function openProperty(p: Property) {
    setActiveProperty(p);
    setViewingSent(false);
    setViewingForm(EMPTY_VIEWING);
    setViewingErrors({});
    setView("detail");
  }

  function handleViewingSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const nextErrors: Partial<ViewingForm> = {};
    if (viewingForm.name.trim().length < 2) nextErrors.name = "Enter your full name.";
    if (!/^\S+@\S+\.\S+$/.test(viewingForm.email)) nextErrors.email = "Enter a valid email address.";
    if (viewingForm.phone.trim().length < 6) nextErrors.phone = "Enter a valid phone number.";
    if (!viewingForm.date) nextErrors.date = "Select a preferred date.";
    if (!viewingForm.time) nextErrors.time = "Select a preferred time.";
    setViewingErrors(nextErrors);
    if (Object.keys(nextErrors).length === 0) {
      setViewingSent(true);
    }
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white text-slate-900">
      {/* Navigation */}
      <nav className="flex items-center justify-between border-b border-slate-200 bg-white/95 px-5 py-4 sm:px-8">
        <button
          type="button"
          onClick={() => setView("search")}
          className="font-heading text-lg font-semibold tracking-wide text-slate-900"
        >
          NESTLY
        </button>
        <div className="hidden items-center gap-6 text-sm text-slate-500 sm:flex">
          <span>{dict.navRent}</span>
          <span>
            {dict.navSaved} ({saved.length})
          </span>
          <span>{dict.navHowItWorks}</span>
        </div>
        <span className="rounded-full bg-teal-600 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-white">
          {dict.listProperty}
        </span>
      </nav>

      {view === "search" && (
        <>
          {/* Hero search */}
          <section className="border-b border-slate-200 bg-[radial-gradient(circle_at_15%_0%,rgba(13,148,136,0.10),transparent_50%),radial-gradient(circle_at_85%_20%,rgba(79,70,229,0.10),transparent_50%)] px-5 py-14 sm:px-8 sm:py-20">
            <span className="text-xs font-semibold uppercase tracking-[0.3em] text-teal-700">
              {dict.heroBadge}
            </span>
            <h2 className="mt-4 max-w-xl font-heading text-3xl font-semibold leading-tight text-slate-900 sm:text-4xl">
              {dict.heroHeading}
            </h2>
            <p className="mt-4 max-w-lg text-sm leading-relaxed text-slate-500">
              {dict.heroSubtitle}
            </p>
            <div className="mt-6 flex flex-col gap-3 rounded-xl border border-slate-200 bg-white p-3 shadow-sm sm:flex-row sm:items-center">
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={dict.searchPlaceholder}
                className="flex-1 rounded-lg border border-slate-200 px-3 py-2.5 text-sm text-slate-900 outline-none focus:border-teal-600"
              />
              <button
                type="button"
                onClick={() => document.getElementById("results")?.scrollIntoView({ block: "nearest" })}
                className="rounded-lg bg-teal-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-teal-500"
              >
                {dict.searchButton}
              </button>
            </div>
          </section>

          {/* Filters */}
          <section className="border-b border-slate-200 px-5 py-8 sm:px-8">
            <div className="flex flex-wrap gap-3">
              <select
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 outline-none focus:border-teal-600"
              >
                <option value="Any location">{dict.anyLocation}</option>
                {PROPERTY_LOCATIONS.map((l) => (
                  <option key={l} value={l}>
                    {l}
                  </option>
                ))}
              </select>
              <select
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 outline-none focus:border-teal-600"
              >
                <option value="Any type">{dict.anyType}</option>
                {PROPERTY_TYPES.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
              <select
                value={maxPrice === Infinity ? "Any price" : String(maxPrice)}
                onChange={(e) => {
                  const found = PRICE_CEILINGS.find((c) => c.label === e.target.value);
                  setMaxPrice(found ? found.value : Infinity);
                }}
                className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 outline-none focus:border-teal-600"
              >
                <option value="Any price">{dict.anyPrice}</option>
                {PRICE_CEILINGS.slice(1).map((c) => (
                  <option key={c.label} value={c.label}>
                    {c.label}
                  </option>
                ))}
              </select>
            </div>
          </section>

          {/* Property grid */}
          <section id="results" className="px-5 py-12 sm:px-8">
            <p className="mb-6 text-xs font-semibold uppercase tracking-[0.3em] text-teal-700">
              {results.length} {dict.resultsFound}
            </p>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {results.map((p) => (
                <div
                  key={p.id}
                  className="group relative flex flex-col overflow-hidden rounded-xl border border-slate-200 bg-white transition-shadow hover:shadow-lg"
                >
                  <button
                    type="button"
                    onClick={() => openProperty(p)}
                    className={`relative h-40 w-full bg-gradient-to-br text-left ${p.swatch}`}
                  >
                    <span className="absolute left-3 top-3 rounded-full bg-white/90 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-slate-700">
                      {p.type}
                    </span>
                  </button>
                  <button
                    type="button"
                    onClick={() => toggleSave(p.id)}
                    aria-label={saved.includes(p.id) ? "Remove from saved" : "Save property"}
                    className={`absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 ${
                      saved.includes(p.id) ? "text-red-500" : "text-slate-400"
                    }`}
                  >
                    <svg viewBox="0 0 20 20" className="h-4 w-4" fill={saved.includes(p.id) ? "currentColor" : "none"} stroke="currentColor" strokeWidth={1.6}>
                      <path d="M10 17s-6-4-6-8.5A3.5 3.5 0 0 1 10 6a3.5 3.5 0 0 1 6 2.5C16 13 10 17 10 17Z" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </button>
                  <div className="flex flex-1 flex-col gap-2 p-4">
                    <span className="text-sm font-medium text-slate-900">{p.title}</span>
                    <span className="text-xs text-slate-500">{p.location}</span>
                    <div className="flex items-center gap-3 text-xs text-slate-500">
                      <span>
                        {p.bedrooms} {dict.bedrooms}
                      </span>
                      <span>
                        {p.bathrooms} {dict.bathrooms}
                      </span>
                      <span>{p.size} m&sup2;</span>
                    </div>
                    <div className="mt-1 flex items-center justify-between">
                      <span className="text-sm font-semibold text-slate-900">
                        &euro;{p.price.toLocaleString()} / month
                      </span>
                      <button
                        type="button"
                        onClick={() => openProperty(p)}
                        className="text-xs font-semibold text-teal-700 hover:text-teal-600"
                      >
                        {dict.viewDetails}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
              {results.length === 0 && (
                <p className="col-span-full text-sm text-slate-500">
                  No properties match these filters. Try widening your search.
                </p>
              )}
            </div>
          </section>

          {/* How it works */}
          <section className="border-t border-slate-200 bg-slate-50 px-5 py-14 sm:px-8">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-teal-700">
              {dict.howItWorksHeading}
            </p>
            <div className="mt-6 grid gap-6 sm:grid-cols-3">
              {[
                { title: "Search", body: "Filter by location, price and property type." },
                { title: "Compare", body: "Save properties and compare details side by side." },
                { title: "Request a viewing", body: "Pick a time that works and we confirm the rest." },
              ].map((s) => (
                <div key={s.title} className="rounded-xl border border-slate-200 bg-white p-5">
                  <p className="text-sm font-semibold text-slate-900">{s.title}</p>
                  <p className="mt-1.5 text-sm leading-relaxed text-slate-500">{s.body}</p>
                </div>
              ))}
            </div>
          </section>

          {/* CTA */}
          <section className="border-t border-slate-200 px-5 py-14 text-center sm:px-8">
            <p className="text-lg font-semibold text-slate-900">
              Have a property to list?
            </p>
            <p className="mt-2 text-sm text-slate-500">
              Reach renters actively searching in your area.
            </p>
          </section>
        </>
      )}

      {view === "detail" && activeProperty && (
        <section className="px-5 py-12 sm:px-8">
          <button
            type="button"
            onClick={() => setView("search")}
            className="mb-6 text-xs font-medium text-slate-500 hover:text-teal-700"
          >
            &larr; {dict.backToSearch}
          </button>

          <div className="grid gap-3 sm:grid-cols-3">
            <div className={`h-56 rounded-xl bg-gradient-to-br sm:col-span-2 sm:h-72 ${activeProperty.swatch}`} />
            <div className="grid grid-rows-2 gap-3">
              <div className={`rounded-xl bg-gradient-to-br ${activeProperty.swatch} opacity-80`} />
              <div className={`rounded-xl bg-gradient-to-br ${activeProperty.swatch} opacity-60`} />
            </div>
          </div>

          <div className="mt-8 grid gap-10 sm:grid-cols-[1.3fr_1fr]">
            <div className="flex flex-col gap-6">
              <div>
                <div className="flex items-center justify-between gap-3">
                  <h2 className="font-heading text-2xl font-semibold text-slate-900">
                    {activeProperty.title}
                  </h2>
                  <button
                    type="button"
                    onClick={() => toggleSave(activeProperty.id)}
                    className={`flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium ${
                      saved.includes(activeProperty.id)
                        ? "border-red-300 text-red-500"
                        : "border-slate-200 text-slate-500"
                    }`}
                  >
                    {saved.includes(activeProperty.id) ? dict.saved : dict.save}
                  </button>
                </div>
                <p className="mt-1 text-sm text-slate-500">{activeProperty.location}</p>
                <p className="mt-3 text-xl font-semibold text-slate-900">
                  &euro;{activeProperty.price.toLocaleString()} / month
                </p>
              </div>

              <div className="flex flex-wrap gap-6 text-sm text-slate-600">
                <span>
                  {activeProperty.bedrooms} {dict.bedrooms}
                </span>
                <span>
                  {activeProperty.bathrooms} {dict.bathrooms}
                </span>
                <span>{activeProperty.size} m&sup2;</span>
              </div>

              <p className="text-sm leading-relaxed text-slate-600">
                {activeProperty.description}
              </p>

              <div>
                <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Amenities
                </p>
                <div className="flex flex-wrap gap-2">
                  {activeProperty.amenities.map((a) => (
                    <span
                      key={a}
                      className="rounded-full border border-slate-200 px-3 py-1 text-xs text-slate-600"
                    >
                      {a}
                    </span>
                  ))}
                </div>
              </div>

              <p className="text-sm font-medium text-teal-700">{activeProperty.available}</p>
            </div>

            <div className="h-fit rounded-xl border border-slate-200 bg-slate-50 p-5">
              {!viewingSent ? (
                <>
                  <p className="text-sm font-semibold text-slate-900">{dict.requestViewing}</p>
                  <form onSubmit={handleViewingSubmit} className="mt-4 flex flex-col gap-3">
                    <div>
                      <label className="mb-1 block text-xs font-medium text-slate-500">
                        {common.fullName}
                      </label>
                      <input
                        value={viewingForm.name}
                        onChange={(e) => setViewingForm({ ...viewingForm, name: e.target.value })}
                        className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-teal-600"
                        placeholder={common.namePlaceholder}
                      />
                      {viewingErrors.name && (
                        <p className="mt-1 text-xs text-red-600">{viewingErrors.name}</p>
                      )}
                    </div>
                    <div>
                      <label className="mb-1 block text-xs font-medium text-slate-500">
                        {common.email}
                      </label>
                      <input
                        value={viewingForm.email}
                        onChange={(e) => setViewingForm({ ...viewingForm, email: e.target.value })}
                        className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-teal-600"
                        placeholder={common.emailPlaceholder}
                      />
                      {viewingErrors.email && (
                        <p className="mt-1 text-xs text-red-600">{viewingErrors.email}</p>
                      )}
                    </div>
                    <div>
                      <label className="mb-1 block text-xs font-medium text-slate-500">
                        {common.phone}
                      </label>
                      <input
                        value={viewingForm.phone}
                        onChange={(e) => setViewingForm({ ...viewingForm, phone: e.target.value })}
                        className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-teal-600"
                        placeholder={common.phonePlaceholder}
                      />
                      {viewingErrors.phone && (
                        <p className="mt-1 text-xs text-red-600">{viewingErrors.phone}</p>
                      )}
                    </div>
                    <div>
                      <label className="mb-1 block text-xs font-medium text-slate-500">
                        {dict.preferredDate}
                      </label>
                      <select
                        value={viewingForm.date}
                        onChange={(e) => setViewingForm({ ...viewingForm, date: e.target.value })}
                        className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-teal-600"
                      >
                        <option value="">{dict.selectDate}</option>
                        {VIEWING_DATES.map((d) => (
                          <option key={d.id} value={d.label}>
                            {d.label}
                          </option>
                        ))}
                      </select>
                      {viewingErrors.date && (
                        <p className="mt-1 text-xs text-red-600">{viewingErrors.date}</p>
                      )}
                    </div>
                    <div>
                      <label className="mb-1 block text-xs font-medium text-slate-500">
                        {dict.preferredTime}
                      </label>
                      <select
                        value={viewingForm.time}
                        onChange={(e) => setViewingForm({ ...viewingForm, time: e.target.value })}
                        className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-teal-600"
                      >
                        <option value="">{dict.selectTime}</option>
                        {VIEWING_TIME_SLOTS.map((t) => (
                          <option key={t} value={t}>
                            {t}
                          </option>
                        ))}
                      </select>
                      {viewingErrors.time && (
                        <p className="mt-1 text-xs text-red-600">{viewingErrors.time}</p>
                      )}
                    </div>
                    <button
                      type="submit"
                      className="mt-2 rounded-full bg-teal-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-teal-500"
                    >
                      {dict.requestViewingButton}
                    </button>
                  </form>
                </>
              ) : (
                <div className="flex flex-col items-center gap-3 py-4 text-center">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-teal-600/10 text-teal-600">
                    <svg viewBox="0 0 20 20" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth={2}>
                      <path d="m4 10 4 4 8-8" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                  <p className="text-base font-semibold text-slate-900">
                    {dict.viewingReceivedTitle}
                  </p>
                  <p className="text-sm leading-relaxed text-slate-500">
                    {dict.viewingReceivedBody}
                  </p>
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="border-t border-slate-200 px-5 py-6 text-center text-xs text-slate-400 sm:px-8">
        Nestly &middot; {common.footerTagline}
      </footer>
    </div>
  );
}
