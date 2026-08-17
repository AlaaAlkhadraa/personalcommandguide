"use client";

import { useMemo, useState } from "react";
import { PROPERTIES, type Property } from "@/lib/demos/property-data";
import {
  DASHBOARD_BOOKINGS,
  DASHBOARD_MESSAGES,
  REVENUE_BY_MONTH,
  generateMonthDays,
  type DashboardBooking,
  type DashboardMessage,
} from "@/lib/demos/property-dashboard-data";
import type { Dictionary } from "@/lib/i18n/dictionary-type";

interface PropertyDemoProps {
  dict: Dictionary["demos"]["property"];
  common: Dictionary["demoCommon"];
}

type Tab = "overview" | "properties" | "property-detail" | "calendar" | "bookings" | "messages" | "settings";

const TAB_ORDER: Exclude<Tab, "property-detail">[] = [
  "overview",
  "properties",
  "calendar",
  "bookings",
  "messages",
  "settings",
];

export function PropertyDemo({ dict, common }: PropertyDemoProps) {
  const [tab, setTab] = useState<Tab>("overview");
  const [activeProperty, setActiveProperty] = useState<Property | null>(null);
  const [statuses, setStatuses] = useState<Record<string, "active" | "draft">>(
    () => Object.fromEntries(PROPERTIES.map((p) => [p.id, "active"]))
  );
  const [calendarPropertyId, setCalendarPropertyId] = useState(PROPERTIES[0]!.id);
  const [blockedDays, setBlockedDays] = useState<Record<string, number[]>>({});
  const [bookings, setBookings] = useState<DashboardBooking[]>(DASHBOARD_BOOKINGS);
  const [messages, setMessages] = useState<DashboardMessage[]>(DASHBOARD_MESSAGES);
  const [activeMessageId, setActiveMessageId] = useState<string | null>(DASHBOARD_MESSAGES[0]?.id ?? null);
  const [replyText, setReplyText] = useState("");
  const [businessName, setBusinessName] = useState("Nestly Property Management");
  const [saved, setSaved] = useState(false);

  const activeBookingsCount = bookings.filter((b) => b.status !== "declined").length;
  const revenueThisMonth = REVENUE_BY_MONTH[REVENUE_BY_MONTH.length - 1]!.revenue;
  const occupancy = useMemo(() => {
    const totals = PROPERTIES.map((p) => {
      const days = generateMonthDays(p.id, blockedDays[p.id] ?? []);
      return days.filter((d) => d.status !== "available").length / days.length;
    });
    return Math.round((totals.reduce((a, b) => a + b, 0) / totals.length) * 100);
  }, [blockedDays]);

  const recentActivity = useMemo(() => {
    const bookingEvents = bookings.slice(0, 3).map((b) => ({
      id: `activity-${b.id}`,
      text: `${b.guestName} — ${PROPERTIES.find((p) => p.id === b.propertyId)?.title ?? ""}`,
    }));
    const messageEvents = messages.filter((m) => m.unread).map((m) => ({
      id: `activity-${m.id}`,
      text: `${m.guestName} — ${PROPERTIES.find((p) => p.id === m.propertyId)?.title ?? ""}`,
    }));
    return [...messageEvents, ...bookingEvents].slice(0, 5);
  }, [bookings, messages]);

  function openProperty(p: Property) {
    setActiveProperty(p);
    setTab("property-detail");
  }

  function toggleStatus(id: string) {
    setStatuses((prev) => ({ ...prev, [id]: prev[id] === "active" ? "draft" : "active" }));
  }

  function toggleDay(day: number) {
    setBlockedDays((prev) => {
      const current = prev[calendarPropertyId] ?? [];
      const isBlocked = current.includes(day);
      return {
        ...prev,
        [calendarPropertyId]: isBlocked ? current.filter((d) => d !== day) : [...current, day],
      };
    });
  }

  function updateBookingStatus(id: string, status: "confirmed" | "declined") {
    setBookings((prev) => prev.map((b) => (b.id === id ? { ...b, status } : b)));
  }

  function sendReply() {
    if (!activeMessageId || !replyText.trim()) return;
    setMessages((prev) =>
      prev.map((m) =>
        m.id === activeMessageId
          ? { ...m, unread: false, thread: [...m.thread, { from: "host", text: replyText.trim(), time: "Now" }] }
          : m
      )
    );
    setReplyText("");
  }

  function selectMessage(id: string) {
    setActiveMessageId(id);
    setMessages((prev) => prev.map((m) => (m.id === id ? { ...m, unread: false } : m)));
  }

  const tabLabel: Record<Exclude<Tab, "property-detail">, string> = {
    overview: dict.navOverview,
    properties: dict.navProperties,
    calendar: dict.navCalendar,
    bookings: dict.navBookings,
    messages: dict.navMessages,
    settings: dict.navSettings,
  };

  const activeMessage = messages.find((m) => m.id === activeMessageId) ?? null;
  const calendarDays = generateMonthDays(calendarPropertyId, blockedDays[calendarPropertyId] ?? []);

  return (
    <div className="overflow-hidden rounded-2xl border border-[#E2E6EC] bg-[#F7F8FA] text-slate-900">
      <div className="flex flex-col lg:flex-row">
        <aside className="flex gap-2 overflow-x-auto border-b border-white/8 bg-[#0F1B21] p-3 lg:w-60 lg:flex-col lg:overflow-visible lg:border-b-0 lg:p-5">
          <div className="hidden items-center gap-2.5 px-2 pb-6 lg:flex">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#0F766E]">
              <svg viewBox="0 0 24 24" className="h-4.5 w-4.5" fill="none" stroke="#fff" strokeWidth={1.9} strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 11 12 4l8 7" />
                <path d="M6 10v9h12v-9" />
              </svg>
            </span>
            <span className="leading-tight">
              <span className="block font-heading text-[14px] font-semibold tracking-[0.16em] text-white">NESTLY</span>
              <span className="mt-0.5 block font-mono text-[8px] uppercase tracking-[0.2em] text-[#5F7A80]">
                {dict.conceptBadge}
              </span>
            </span>
          </div>
          {TAB_ORDER.map((id) => (
            <button
              key={id}
              type="button"
              onClick={() => setTab(id)}
              className={`shrink-0 rounded-lg px-3.5 py-2.5 text-left text-[14px] font-medium transition-colors ${
                tab === id || (id === "properties" && tab === "property-detail")
                  ? "bg-[#0F766E] text-white"
                  : "text-[#93A6AC] hover:bg-white/5 hover:text-white"
              }`}
            >
              {tabLabel[id]}
            </button>
          ))}
        </aside>

        <div className="flex-1 p-6 sm:p-9">
          <div className="mb-7 flex flex-wrap items-baseline justify-between gap-3 border-b border-[#E2E6EC] pb-5">
            <h2 className="font-heading text-[22px] font-semibold text-slate-900">
              {tab === "property-detail" ? dict.navProperties : tabLabel[tab as Exclude<Tab, "property-detail">]}
            </h2>
            <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-[#98A2B3]">
              {dict.conceptBadge}
            </span>
          </div>
          {tab === "overview" && (
            <div className="flex flex-col gap-6">
              <h2 className="text-lg font-semibold text-slate-900">{dict.overviewHeading}</h2>
              <div className="grid gap-4 sm:grid-cols-4">
                <div className="rounded-xl border border-[#E2E6EC] p-4">
                  <p className="text-xs text-slate-500">{dict.statProperties}</p>
                  <p className="mt-1 text-2xl font-semibold text-slate-900">{PROPERTIES.length}</p>
                </div>
                <div className="rounded-xl border border-[#E2E6EC] p-4">
                  <p className="text-xs text-slate-500">{dict.statActiveBookings}</p>
                  <p className="mt-1 text-2xl font-semibold text-slate-900">{activeBookingsCount}</p>
                </div>
                <div className="rounded-xl border border-[#E2E6EC] p-4">
                  <p className="text-xs text-slate-500">{dict.statRevenue}</p>
                  <p className="mt-1 text-2xl font-semibold text-slate-900">&euro;{revenueThisMonth.toLocaleString()}</p>
                </div>
                <div className="rounded-xl border border-[#E2E6EC] p-4">
                  <p className="text-xs text-slate-500">{dict.statOccupancy}</p>
                  <p className="mt-1 text-2xl font-semibold text-slate-900">{occupancy}%</p>
                </div>
              </div>

              <div className="flex flex-col gap-3">
                {REVENUE_BY_MONTH.map((m) => {
                  const max = Math.max(...REVENUE_BY_MONTH.map((x) => x.revenue));
                  return (
                    <div key={m.month} className="flex items-center gap-3">
                      <span className="w-10 text-xs text-slate-500">{m.month}</span>
                      <div className="h-3 flex-1 overflow-hidden rounded-full bg-slate-100">
                        <div
                          className="h-full rounded-full bg-[#0F766E]"
                          style={{ width: `${(m.revenue / max) * 100}%` }}
                        />
                      </div>
                      <span className="w-20 text-right text-xs text-slate-600">&euro;{m.revenue.toLocaleString()}</span>
                    </div>
                  );
                })}
              </div>

              <div>
                <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-500">
                  {dict.recentActivityHeading}
                </p>
                <div className="flex flex-col gap-2">
                  {recentActivity.map((a) => (
                    <div key={a.id} className="rounded-xl border border-[#E2E6EC] px-4 py-2.5 text-sm text-slate-700">
                      {a.text}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {tab === "properties" && (
            <div className="flex flex-col gap-4">
              <h2 className="text-lg font-semibold text-slate-900">{dict.propertiesHeading}</h2>
              <div className="grid gap-4 sm:grid-cols-2">
                {PROPERTIES.map((p) => (
                  <div key={p.id} className="flex flex-col overflow-hidden rounded-xl border border-[#E2E6EC]">
                    <button
                      type="button"
                      onClick={() => openProperty(p)}
                      className={`h-28 w-full bg-gradient-to-br text-left ${p.swatch}`}
                    />
                    <div className="flex flex-col gap-2 p-4">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-sm font-medium text-slate-900">{p.title}</span>
                        <span
                          className={`rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${
                            statuses[p.id] === "active"
                              ? "bg-emerald-100 text-emerald-700"
                              : "bg-slate-200 text-slate-600"
                          }`}
                        >
                          {statuses[p.id] === "active" ? dict.statusActive : dict.statusDraft}
                        </span>
                      </div>
                      <span className="text-xs text-slate-500">{p.location}</span>
                      <div className="mt-1 flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => openProperty(p)}
                          className="rounded-full border border-slate-300 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:border-[#0F766E]/60"
                        >
                          {common.continueLabel}
                        </button>
                        <button
                          type="button"
                          onClick={() => toggleStatus(p.id)}
                          className="rounded-full border border-slate-300 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:border-[#0F766E]/60"
                        >
                          {statuses[p.id] === "active" ? dict.markDraft : dict.markActive}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {tab === "property-detail" && activeProperty && (
            <div className="flex flex-col gap-4">
              <button
                type="button"
                onClick={() => setTab("properties")}
                className="w-fit text-xs font-medium text-slate-500 hover:text-[#0F766E]"
              >
                &larr; {dict.backToProperties}
              </button>
              <div className={`h-40 rounded-xl bg-gradient-to-br sm:h-56 ${activeProperty.swatch}`} />
              <h2 className="text-xl font-semibold text-slate-900">{activeProperty.title}</h2>
              <p className="text-sm text-slate-500">{activeProperty.location}</p>
              <div className="flex flex-wrap gap-6 text-sm text-slate-600">
                <span>{activeProperty.bedrooms} bed</span>
                <span>{activeProperty.bathrooms} bath</span>
                <span>{activeProperty.size} m&sup2;</span>
                <span>
                  &euro;{activeProperty.price} {dict.pricePerNight}
                </span>
              </div>
              <p className="text-sm leading-relaxed text-slate-600">{activeProperty.description}</p>
              <div className="flex flex-wrap gap-2">
                {activeProperty.amenities.map((a) => (
                  <span key={a} className="rounded-full border border-[#E2E6EC] px-3 py-1 text-xs text-slate-600">
                    {a}
                  </span>
                ))}
              </div>
              <button
                type="button"
                onClick={() => toggleStatus(activeProperty.id)}
                className="mt-2 w-fit rounded-full border border-slate-300 px-4 py-2 text-xs font-semibold text-slate-700 hover:border-[#0F766E]/60"
              >
                {statuses[activeProperty.id] === "active" ? dict.markDraft : dict.markActive}
              </button>
            </div>
          )}

          {tab === "calendar" && (
            <div className="flex flex-col gap-4">
              <h2 className="text-lg font-semibold text-slate-900">{dict.calendarHeading}</h2>
              <div>
                <label className="mb-1.5 block text-xs font-medium text-slate-500">{dict.selectProperty}</label>
                <select
                  value={calendarPropertyId}
                  onChange={(e) => setCalendarPropertyId(e.target.value)}
                  className="rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-[#0F766E]"
                >
                  {PROPERTIES.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.title}
                    </option>
                  ))}
                </select>
              </div>
              <p className="text-xs text-slate-500">{dict.blockDayHint}</p>
              <div className="grid grid-cols-6 gap-1.5 sm:grid-cols-10">
                {calendarDays.map(({ day, status }) => (
                  <button
                    key={day}
                    type="button"
                    disabled={status === "booked"}
                    onClick={() => toggleDay(day)}
                    className={`flex h-9 items-center justify-center rounded-md text-xs font-medium transition-colors ${
                      status === "booked"
                        ? "cursor-not-allowed bg-slate-200 text-slate-400"
                        : status === "blocked"
                          ? "bg-amber-200 text-amber-900 hover:bg-amber-300"
                          : "border border-[#E2E6EC] text-slate-700 hover:border-[#0F766E]/60"
                    }`}
                  >
                    {day}
                  </button>
                ))}
              </div>
              <div className="flex flex-wrap gap-4 text-xs text-slate-500">
                <span className="flex items-center gap-1.5">
                  <span className="h-2.5 w-2.5 rounded-sm border border-slate-300" /> {dict.legendAvailable}
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="h-2.5 w-2.5 rounded-sm bg-slate-200" /> {dict.legendBooked}
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="h-2.5 w-2.5 rounded-sm bg-amber-200" /> {dict.legendBlocked}
                </span>
              </div>
            </div>
          )}

          {tab === "bookings" && (
            <div className="flex flex-col gap-4">
              <h2 className="text-lg font-semibold text-slate-900">{dict.bookingsHeading}</h2>
              <div className="flex flex-col gap-2">
                {bookings.map((b) => (
                  <div
                    key={b.id}
                    className="flex flex-col gap-2 rounded-xl border border-[#E2E6EC] px-4 py-3 text-sm sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div>
                      <p className="font-medium text-slate-900">
                        {b.guestName} &middot; {PROPERTIES.find((p) => p.id === b.propertyId)?.title}
                      </p>
                      <p className="text-xs text-slate-500">
                        {b.checkIn} &ndash; {b.checkOut} &middot; &euro;{b.total.toLocaleString()}
                      </p>
                    </div>
                    {b.status === "pending" ? (
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => updateBookingStatus(b.id, "confirmed")}
                          className="rounded-full bg-[#0F766E] px-3 py-1.5 text-xs font-semibold text-white hover:bg-[#ECF6F4]0"
                        >
                          {dict.approve}
                        </button>
                        <button
                          type="button"
                          onClick={() => updateBookingStatus(b.id, "declined")}
                          className="rounded-full border border-slate-300 px-3 py-1.5 text-xs font-semibold text-slate-600 hover:border-red-400 hover:text-red-600"
                        >
                          {dict.decline}
                        </button>
                      </div>
                    ) : (
                      <span
                        className={`w-fit rounded-full px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${
                          b.status === "confirmed" ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-700"
                        }`}
                      >
                        {b.status === "confirmed" ? dict.statusConfirmed : dict.statusDeclined}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {tab === "messages" && (
            <div className="flex flex-col gap-4 sm:flex-row sm:gap-6">
              <div className="flex flex-col gap-2 sm:w-64">
                <h2 className="text-lg font-semibold text-slate-900">{dict.messagesHeading}</h2>
                {messages.map((m) => (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => selectMessage(m.id)}
                    className={`flex flex-col gap-0.5 rounded-lg border px-3 py-2.5 text-left text-sm transition-colors ${
                      activeMessageId === m.id
                        ? "border-[#0F766E] bg-[#ECF6F4]"
                        : "border-[#E2E6EC] hover:border-[#0F766E]/40"
                    }`}
                  >
                    <span className="flex items-center gap-1.5 font-medium text-slate-900">
                      {m.unread && <span className="h-1.5 w-1.5 rounded-full bg-[#0F766E]" />}
                      {m.guestName}
                    </span>
                    <span className="text-xs text-slate-500">
                      {PROPERTIES.find((p) => p.id === m.propertyId)?.title}
                    </span>
                  </button>
                ))}
              </div>
              <div className="flex flex-1 flex-col gap-3 rounded-xl border border-[#E2E6EC] p-4">
                {activeMessage ? (
                  <>
                    <div className="flex flex-1 flex-col gap-2 overflow-y-auto">
                      {activeMessage.thread.map((entry, i) => (
                        <div
                          key={i}
                          className={`max-w-[80%] rounded-lg px-3 py-2 text-sm ${
                            entry.from === "host"
                              ? "self-end bg-[#0F766E] text-white"
                              : "self-start bg-slate-100 text-slate-800"
                          }`}
                        >
                          {entry.text}
                        </div>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <input
                        value={replyText}
                        onChange={(e) => setReplyText(e.target.value)}
                        placeholder={dict.replyPlaceholder}
                        className="flex-1 rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-[#0F766E]"
                      />
                      <button
                        type="button"
                        onClick={sendReply}
                        className="rounded-md bg-[#0F766E] px-4 py-2 text-sm font-semibold text-white hover:bg-[#ECF6F4]0"
                      >
                        {dict.send}
                      </button>
                    </div>
                  </>
                ) : (
                  <p className="text-sm text-slate-500">{dict.noMessageSelected}</p>
                )}
              </div>
            </div>
          )}

          {tab === "settings" && (
            <div className="flex flex-col gap-4">
              <h2 className="text-lg font-semibold text-slate-900">{dict.settingsHeading}</h2>
              <div className="max-w-sm">
                <label className="mb-1.5 block text-xs font-medium text-slate-500">{dict.businessNameLabel}</label>
                <input
                  value={businessName}
                  onChange={(e) => {
                    setBusinessName(e.target.value);
                    setSaved(false);
                  }}
                  className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-[#0F766E]"
                />
              </div>
              <button
                type="button"
                onClick={() => setSaved(true)}
                className="w-fit rounded-full bg-[#0F766E] px-5 py-2 text-xs font-semibold text-white hover:bg-[#ECF6F4]0"
              >
                {dict.saveChanges}
              </button>
              {saved && <p className="text-xs text-emerald-600">{dict.savedConfirmation}</p>}
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-[#E2E6EC] px-5 py-6 text-center text-xs text-slate-400 sm:px-8">
        Nestly &middot; {common.footerTagline}
      </footer>
    </div>
  );
}
