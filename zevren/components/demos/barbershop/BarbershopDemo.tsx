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
import {
  GALLERY_SET,
  GalleryTile,
  ShopBackdrop,
  ShopIcon,
  ShopLogo,
  Star,
} from "./BarbershopArt";

type View = "home" | "services" | "team" | "gallery" | "about" | "contact" | "book";
type Step = "service" | "barber" | "datetime" | "details" | "review" | "done";

const STEP_ORDER: Step[] = ["service", "barber", "datetime", "details", "review"];

const SHOP = {
  address: ["Grote Gracht 42", "6211 SW Maastricht"],
  email: "hello@ironsidebarbershop.nl",
  phone: "06 12 34 56 78",
};

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

interface Message {
  name: string;
  email: string;
  message: string;
}

interface BarbershopDemoProps {
  dict: Dictionary["demos"]["barbershop"];
  common: Dictionary["demoCommon"];
}

/* ---------------------------------------------------------------- */

function Shell({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <div className={`mx-auto w-full max-w-4xl px-6 sm:px-9 ${className}`}>{children}</div>;
}

function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <p className="flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.28em] text-[#C9A55F]">
      <span className="h-px w-6 bg-[#C9A55F]" />
      {children}
    </p>
  );
}

function Title({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="mt-4 max-w-xl font-heading text-[28px] font-bold uppercase leading-[1.06] tracking-[-0.01em] text-[#F2EFE9] sm:text-[38px]">
      {children}
    </h2>
  );
}

function BrassButton({
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
      className={`inline-flex items-center justify-center rounded-full bg-[#C9A55F] px-7 py-3 font-mono text-[11px] font-semibold uppercase tracking-[0.18em] text-[#0B0B0C] transition-colors hover:bg-[#DDBC77] disabled:cursor-not-allowed disabled:opacity-40 ${
        full ? "w-full" : ""
      }`}
    >
      {children}
    </button>
  );
}

function OutlineButton({ children, onClick }: { children: React.ReactNode; onClick?: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex items-center justify-center rounded-full border border-white/20 px-7 py-3 font-mono text-[11px] font-semibold uppercase tracking-[0.18em] text-[#F2EFE9] transition-colors hover:border-[#C9A55F] hover:text-[#C9A55F]"
    >
      {children}
    </button>
  );
}

function PageHead({ eyebrow, title, subtitle }: { eyebrow: string; title: string; subtitle: string }) {
  return (
    <section className="relative overflow-hidden border-b border-white/8 bg-[#0E0E10] py-14 sm:py-16">
      <span className="pointer-events-none absolute -right-20 -top-24 h-64 w-64 rounded-full bg-[#C9A55F] opacity-[0.10] blur-3xl" />
      <Shell className="relative">
        <Eyebrow>{eyebrow}</Eyebrow>
        <h2 className="mt-4 max-w-xl font-heading text-[30px] font-bold uppercase leading-[1.05] text-[#F2EFE9] sm:text-[42px]">
          {title}
        </h2>
        <p className="mt-4 max-w-lg text-[15px] leading-relaxed text-[#8E8A83]">{subtitle}</p>
      </Shell>
    </section>
  );
}

function PriceList({ onPick }: { onPick?: (service: BarberService) => void }) {
  return (
    <div className="mt-10 border-t border-white/8">
      {BARBER_SERVICES.map((s) => {
        const inner = (
          <>
            <span className="text-[17px] font-semibold text-[#F2EFE9]">{s.name}</span>
            <span className="font-mono text-[11px] uppercase tracking-[0.16em] text-[#6F6B65]">{s.duration}</span>
            <span className="font-heading text-[19px] font-bold text-[#C9A55F]">{s.price}</span>
          </>
        );
        const cls =
          "grid w-full grid-cols-[1fr_auto] items-center gap-x-6 gap-y-1 border-b border-white/8 py-5 text-left sm:grid-cols-[1fr_120px_90px]";
        return onPick ? (
          <button key={s.id} type="button" onClick={() => onPick(s)} className={`${cls} transition-colors hover:bg-white/[0.03]`}>
            {inner}
          </button>
        ) : (
          <div key={s.id} className={cls}>
            {inner}
          </div>
        );
      })}
    </div>
  );
}

function TeamGrid() {
  return (
    <div className="mt-10 grid gap-6 sm:grid-cols-3">
      {BARBERS.map((b) => (
        <div key={b.id} className="rounded-2xl border border-white/8 bg-[#111113] p-7 text-center">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full border border-[#C9A55F]/40 bg-[#17171a]">
            <span className="font-heading text-[22px] font-bold text-[#C9A55F]">{b.name.charAt(0)}</span>
          </div>
          <p className="mt-5 font-heading text-[17px] font-bold uppercase tracking-[0.08em] text-[#F2EFE9]">{b.name}</p>
          <p className="mt-1.5 font-mono text-[10px] uppercase tracking-[0.16em] text-[#C9A55F]">{b.role}</p>
        </div>
      ))}
    </div>
  );
}

function Gallery() {
  return (
    <div className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-3">
      {GALLERY_SET.map((variant) => (
        <div key={variant} className="overflow-hidden rounded-xl border border-white/8">
          <GalleryTile variant={variant} className="aspect-square w-full" />
        </div>
      ))}
    </div>
  );
}

function Reviews({ note }: { note: string }) {
  return (
    <>
      <div className="mt-10 grid gap-5 sm:grid-cols-3">
        {DEMO_REVIEWS.map((r) => (
          <div key={r.name} className="rounded-2xl border border-white/8 bg-[#111113] p-6">
            <div className="flex gap-0.5 text-[#C9A55F]">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className="h-3.5 w-3.5" />
              ))}
            </div>
            <p className="mt-4 text-[14px] leading-relaxed text-[#C9C5BE]">&ldquo;{r.text}&rdquo;</p>
            <p className="mt-4 font-mono text-[10px] uppercase tracking-[0.16em] text-[#6F6B65]">{r.name}</p>
          </div>
        ))}
      </div>
      <p className="mt-4 font-mono text-[10px] uppercase tracking-[0.14em] text-[#5C5852]">{note}</p>
    </>
  );
}

function Hours({ common, note }: { common: Dictionary["demoCommon"]; note: string }) {
  const rows = [
    [common.monFri, "09:00 - 18:00"],
    [common.saturday, "09:00 - 17:00"],
    [common.sunday, common.closed],
  ];
  return (
    <div>
      <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#C9A55F]">{common.hoursHeading}</p>
      <dl className="mt-5 flex flex-col gap-3">
        {rows.map(([day, value]) => (
          <div key={day} className="flex justify-between gap-6 border-b border-white/8 pb-3 text-[14px]">
            <dt className="text-[#8E8A83]">{day}</dt>
            <dd className="text-[#F2EFE9]">{value}</dd>
          </div>
        ))}
      </dl>
      <p className="mt-4 text-[13px] leading-relaxed text-[#6F6B65]">{note}</p>
    </div>
  );
}

/* ---------------------------------------------------------------- */

export function BarbershopDemo({ dict, common }: BarbershopDemoProps) {
  const site = dict.site;
  const [view, setView] = useState<View>("home");

  const [step, setStep] = useState<Step>("service");
  const [service, setService] = useState<BarberService | null>(null);
  const [barber, setBarber] = useState<Barber | null>(null);
  const [dateId, setDateId] = useState<string | null>(null);
  const [time, setTime] = useState<string | null>(null);
  const [details, setDetails] = useState<Details>({ name: "", email: "", phone: "" });
  const [errors, setErrors] = useState<Partial<Details>>({});
  const [cancelled, setCancelled] = useState(false);

  const [message, setMessage] = useState<Message>({ name: "", email: "", message: "" });
  const [messageErrors, setMessageErrors] = useState<Partial<Message>>({});
  const [messageSent, setMessageSent] = useState(false);

  const stepIndex = STEP_ORDER.indexOf(step);

  function bookWith(preset?: BarberService) {
    if (preset) {
      setService(preset);
      setStep("barber");
    }
    setView("book");
  }

  function handleDetailsSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const next: Partial<Details> = {};
    if (details.name.trim().length < 2) next.name = site.formErrors.name;
    if (!/^\S+@\S+\.\S+$/.test(details.email)) next.email = site.formErrors.email;
    if (details.phone.trim().length < 6) next.phone = common.phone;
    setErrors(next);
    if (Object.keys(next).length === 0) setStep("review");
  }

  function handleMessageSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const next: Partial<Message> = {};
    if (message.name.trim().length < 2) next.name = site.formErrors.name;
    if (!/^\S+@\S+\.\S+$/.test(message.email)) next.email = site.formErrors.email;
    if (message.message.trim().length < 5) next.message = site.formErrors.message;
    setMessageErrors(next);
    if (Object.keys(next).length === 0) setMessageSent(true);
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

  const NAV: { id: View; label: string }[] = [
    { id: "home", label: site.navHome },
    { id: "services", label: dict.navServices },
    { id: "team", label: dict.navTeam },
    { id: "gallery", label: site.navGallery },
    { id: "about", label: site.navAbout },
    { id: "contact", label: dict.navContact },
  ];

  return (
    <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#0B0B0C] text-[#F2EFE9]">
      {/* Header */}
      <header className="border-b border-white/8 bg-[#0B0B0C]">
        <div className="mx-auto flex w-full max-w-4xl items-center justify-between gap-4 px-6 py-4 sm:px-9">
          <button type="button" onClick={() => setView("home")} aria-label="Ironside Barbershop">
            <ShopLogo />
          </button>
          <nav className="hidden items-center gap-6 lg:flex">
            {NAV.map((n) => (
              <button
                key={n.id}
                type="button"
                onClick={() => setView(n.id)}
                className={`font-mono text-[11px] uppercase tracking-[0.16em] transition-colors ${
                  view === n.id ? "text-[#C9A55F]" : "text-[#8E8A83] hover:text-[#F2EFE9]"
                }`}
              >
                {n.label}
              </button>
            ))}
          </nav>
          <BrassButton onClick={() => bookWith()}>{dict.bookNow}</BrassButton>
        </div>
        <div className="flex gap-2 overflow-x-auto border-t border-white/8 px-6 py-2.5 lg:hidden">
          {NAV.map((n) => (
            <button
              key={n.id}
              type="button"
              onClick={() => setView(n.id)}
              className={`shrink-0 rounded-full border px-3.5 py-1.5 font-mono text-[10px] uppercase tracking-[0.14em] ${
                view === n.id ? "border-[#C9A55F] text-[#C9A55F]" : "border-white/12 text-[#8E8A83]"
              }`}
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
            <ShopBackdrop className="pointer-events-none absolute inset-0 h-full w-full opacity-60" />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-[#0B0B0C] via-[#0B0B0C]/92 to-[#0B0B0C]/45" />
            <Shell className="relative">
              <Eyebrow>{dict.heroLocation}</Eyebrow>
              <h2 className="mt-5 max-w-lg font-heading text-[36px] font-bold uppercase leading-[1.02] tracking-[-0.01em] text-[#F2EFE9] sm:text-[52px]">
                {dict.heroHeading}
              </h2>
              <p className="mt-5 max-w-md text-[15px] leading-relaxed text-[#8E8A83]">{dict.heroSubtitle}</p>
              <div className="mt-9 flex flex-wrap gap-4">
                <BrassButton onClick={() => bookWith()}>{dict.heroCta}</BrassButton>
                <OutlineButton onClick={() => setView("services")}>{site.heroCtaSecondary}</OutlineButton>
              </div>
              <div className="mt-12 flex flex-wrap gap-x-10 gap-y-4 border-t border-white/10 pt-7">
                {[
                  { icon: "clock", text: "09:00 - 18:00" },
                  { icon: "pin", text: SHOP.address[0]! },
                  { icon: "phone", text: SHOP.phone },
                ].map((item) => (
                  <span key={item.text} className="flex items-center gap-2.5 text-[13px] text-[#8E8A83]">
                    <ShopIcon name={item.icon} className="h-4 w-4 text-[#C9A55F]" />
                    {item.text}
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
                  <div key={card.title} className="rounded-2xl border border-white/8 bg-[#111113] p-7">
                    <span className="flex h-10 w-10 items-center justify-center rounded-full border border-[#C9A55F]/40 text-[#C9A55F]">
                      <ShopIcon name={["clock", "scissors", "razor"][i] ?? "scissors"} className="h-4.5 w-4.5" />
                    </span>
                    <p className="mt-5 font-heading text-[17px] font-bold uppercase tracking-[0.06em] text-[#F2EFE9]">
                      {card.title}
                    </p>
                    <p className="mt-3 text-[14px] leading-relaxed text-[#8E8A83]">{card.description}</p>
                  </div>
                ))}
              </div>
            </Shell>
          </section>

          <section className="border-t border-white/8 py-16">
            <Shell>
              <Eyebrow>{dict.servicesHeading}</Eyebrow>
              <Title>{site.servicesSubtitle}</Title>
              <PriceList onPick={(s) => bookWith(s)} />
            </Shell>
          </section>

          <section className="border-t border-white/8 bg-[#0E0E10] py-16">
            <Shell>
              <Eyebrow>{dict.teamHeading}</Eyebrow>
              <Title>{site.teamSubtitle}</Title>
              <TeamGrid />
            </Shell>
          </section>

          <section className="border-t border-white/8 py-16">
            <Shell>
              <Eyebrow>{dict.galleryHeading}</Eyebrow>
              <Title>{site.gallerySubtitle}</Title>
              <Gallery />
            </Shell>
          </section>

          <section className="border-t border-white/8 bg-[#0E0E10] py-16">
            <Shell>
              <Eyebrow>{dict.reviewsHeading}</Eyebrow>
              <Title>{site.reviewsSubtitle}</Title>
              <Reviews note={common.demoNote} />
            </Shell>
          </section>

          <section className="border-t border-white/8 py-16">
            <Shell className="flex flex-col items-start gap-6 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="font-heading text-[24px] font-bold uppercase leading-tight text-[#F2EFE9] sm:text-[30px]">
                  {site.ctaTitle}
                </p>
                <p className="mt-2 text-[14px] text-[#8E8A83]">{site.ctaBody}</p>
              </div>
              <BrassButton onClick={() => bookWith()}>{site.navBook}</BrassButton>
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
              <PriceList onPick={(s) => bookWith(s)} />
              <div className="mt-10">
                <BrassButton onClick={() => bookWith()}>{dict.bookNow}</BrassButton>
              </div>
            </Shell>
          </section>
        </>
      )}

      {/* ---------------- Team ---------------- */}
      {view === "team" && (
        <>
          <PageHead eyebrow={dict.navTeam} title={dict.teamHeading} subtitle={site.teamSubtitle} />
          <section className="py-14">
            <Shell>
              <TeamGrid />
              <div className="mt-10">
                <BrassButton onClick={() => bookWith()}>{dict.bookNow}</BrassButton>
              </div>
            </Shell>
          </section>
        </>
      )}

      {/* ---------------- Gallery ---------------- */}
      {view === "gallery" && (
        <>
          <PageHead eyebrow={site.navGallery} title={dict.galleryHeading} subtitle={site.gallerySubtitle} />
          <section className="py-14">
            <Shell>
              <Gallery />
            </Shell>
          </section>
        </>
      )}

      {/* ---------------- About ---------------- */}
      {view === "about" && (
        <>
          <PageHead eyebrow={site.navAbout} title={site.aboutHeading} subtitle={site.aboutSubtitle} />
          <section className="py-14">
            <Shell>
              <div className="grid gap-10 lg:grid-cols-2">
                <div>
                  {site.aboutParagraphs.map((p) => (
                    <p key={p} className="mb-5 text-[15px] leading-relaxed text-[#8E8A83]">
                      {p}
                    </p>
                  ))}
                </div>
                <Hours common={common} note={site.hoursNote} />
              </div>
            </Shell>
          </section>
          <section className="border-t border-white/8 bg-[#0E0E10] py-14">
            <Shell>
              <Eyebrow>{dict.reviewsHeading}</Eyebrow>
              <Reviews note={common.demoNote} />
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
                    { icon: "pin", label: site.addressLabel, value: SHOP.address.join(", ") },
                    { icon: "mail", label: common.email, value: SHOP.email },
                    { icon: "phone", label: common.phone, value: SHOP.phone },
                  ].map((row) => (
                    <div key={row.label} className="flex gap-4">
                      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-white/10 text-[#C9A55F]">
                        <ShopIcon name={row.icon} className="h-4 w-4" />
                      </span>
                      <div>
                        <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#6F6B65]">{row.label}</p>
                        <p className="mt-1.5 text-[15px] text-[#F2EFE9]">{row.value}</p>
                      </div>
                    </div>
                  ))}
                  <Hours common={common} note={site.hoursNote} />
                </div>

                <div className="rounded-2xl border border-white/8 bg-[#111113] p-7">
                  {messageSent ? (
                    <div>
                      <span className="flex h-12 w-12 items-center justify-center rounded-full bg-[#C9A55F]/15 text-[#C9A55F]">
                        <svg viewBox="0 0 20 20" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth={2}>
                          <path d="m4 10 4 4 8-8" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </span>
                      <p className="mt-5 font-heading text-[19px] font-bold uppercase text-[#F2EFE9]">
                        {site.formSuccessTitle}
                      </p>
                      <p className="mt-2 text-[14px] text-[#8E8A83]">{site.formSuccessBody}</p>
                    </div>
                  ) : (
                    <form onSubmit={handleMessageSubmit} noValidate className="flex flex-col gap-5">
                      <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#C9A55F]">
                        {site.formHeading}
                      </p>
                      <div>
                        <label className="mb-2 block font-mono text-[10px] uppercase tracking-[0.16em] text-[#6F6B65]">
                          {common.fullName}
                        </label>
                        <input
                          value={message.name}
                          onChange={(e) => setMessage({ ...message, name: e.target.value })}
                          className="w-full rounded-lg border border-white/12 bg-[#0B0B0C] px-4 py-3 text-[14px] text-[#F2EFE9] outline-none focus:border-[#C9A55F]"
                        />
                        {messageErrors.name && <p className="mt-1.5 text-[12px] text-red-400">{messageErrors.name}</p>}
                      </div>
                      <div>
                        <label className="mb-2 block font-mono text-[10px] uppercase tracking-[0.16em] text-[#6F6B65]">
                          {common.email}
                        </label>
                        <input
                          value={message.email}
                          onChange={(e) => setMessage({ ...message, email: e.target.value })}
                          className="w-full rounded-lg border border-white/12 bg-[#0B0B0C] px-4 py-3 text-[14px] text-[#F2EFE9] outline-none focus:border-[#C9A55F]"
                        />
                        {messageErrors.email && <p className="mt-1.5 text-[12px] text-red-400">{messageErrors.email}</p>}
                      </div>
                      <div>
                        <label className="mb-2 block font-mono text-[10px] uppercase tracking-[0.16em] text-[#6F6B65]">
                          {site.formMessage}
                        </label>
                        <textarea
                          rows={4}
                          value={message.message}
                          onChange={(e) => setMessage({ ...message, message: e.target.value })}
                          className="w-full rounded-lg border border-white/12 bg-[#0B0B0C] px-4 py-3 text-[14px] text-[#F2EFE9] outline-none focus:border-[#C9A55F]"
                        />
                        {messageErrors.message && (
                          <p className="mt-1.5 text-[12px] text-red-400">{messageErrors.message}</p>
                        )}
                      </div>
                      <BrassButton type="submit" full>
                        {site.formSubmit}
                      </BrassButton>
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
                      className={`rounded-full px-3.5 py-1.5 font-mono text-[10px] uppercase tracking-[0.14em] ${
                        i === stepIndex
                          ? "bg-[#C9A55F] text-[#0B0B0C]"
                          : i < stepIndex
                            ? "bg-[#C9A55F]/20 text-[#C9A55F]"
                            : "bg-white/5 text-[#6F6B65]"
                      }`}
                    >
                      {dict.steps[s]}
                    </span>
                  ))}
                </div>
              )}

              <div className="mt-8 rounded-2xl border border-white/8 bg-[#111113] p-6 sm:p-8">
                {step === "service" && (
                  <div className="grid gap-3 sm:grid-cols-2">
                    {BARBER_SERVICES.map((s) => (
                      <button
                        key={s.id}
                        type="button"
                        onClick={() => {
                          setService(s);
                          setStep("barber");
                        }}
                        className={`flex items-center justify-between rounded-xl border px-5 py-4 text-left transition-colors ${
                          service?.id === s.id
                            ? "border-[#C9A55F] bg-[#C9A55F]/10"
                            : "border-white/10 hover:border-[#C9A55F]/50"
                        }`}
                      >
                        <span>
                          <span className="block text-[15px] font-semibold text-[#F2EFE9]">{s.name}</span>
                          <span className="mt-0.5 block font-mono text-[10px] uppercase tracking-[0.14em] text-[#6F6B65]">
                            {s.duration}
                          </span>
                        </span>
                        <span className="font-heading text-[17px] font-bold text-[#C9A55F]">{s.price}</span>
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
                          setStep("datetime");
                        }}
                        className={`rounded-xl border px-4 py-5 text-center transition-colors ${
                          barber?.id === b.id
                            ? "border-[#C9A55F] bg-[#C9A55F]/10"
                            : "border-white/10 hover:border-[#C9A55F]/50"
                        }`}
                      >
                        <span className="block text-[15px] font-semibold text-[#F2EFE9]">{b.name}</span>
                        <span className="mt-1 block font-mono text-[10px] uppercase tracking-[0.14em] text-[#6F6B65]">
                          {b.role}
                        </span>
                      </button>
                    ))}
                    <button
                      type="button"
                      onClick={() => setStep("service")}
                      className="mt-1 font-mono text-[10px] uppercase tracking-[0.16em] text-[#6F6B65] hover:text-[#C9A55F] sm:col-span-3 sm:text-left"
                    >
                      &larr; {common.back}
                    </button>
                  </div>
                )}

                {step === "datetime" && barber && (
                  <div className="flex flex-col gap-8">
                    <div>
                      <p className="mb-4 font-mono text-[10px] uppercase tracking-[0.18em] text-[#6F6B65]">
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
                            className={`rounded-full border px-4 py-2 text-[13px] transition-colors ${
                              dateId === d.id
                                ? "border-[#C9A55F] bg-[#C9A55F]/10 text-[#C9A55F]"
                                : "border-white/10 text-[#C9C5BE] hover:border-[#C9A55F]/50"
                            }`}
                          >
                            {d.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    {dateId && (
                      <div>
                        <p className="mb-4 font-mono text-[10px] uppercase tracking-[0.18em] text-[#6F6B65]">
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
                                className={`rounded-lg border px-2 py-2.5 text-[13px] transition-colors ${
                                  !available
                                    ? "cursor-not-allowed border-white/5 text-[#3B3833] line-through"
                                    : time === t
                                      ? "border-[#C9A55F] bg-[#C9A55F]/10 text-[#C9A55F]"
                                      : "border-white/10 text-[#C9C5BE] hover:border-[#C9A55F]/50"
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
                        onClick={() => setStep("barber")}
                        className="font-mono text-[10px] uppercase tracking-[0.16em] text-[#6F6B65] hover:text-[#C9A55F]"
                      >
                        &larr; {common.back}
                      </button>
                      <BrassButton disabled={!dateId || !time} onClick={() => setStep("details")}>
                        {common.continueLabel}
                      </BrassButton>
                    </div>
                  </div>
                )}

                {step === "details" && (
                  <form onSubmit={handleDetailsSubmit} noValidate className="flex flex-col gap-5">
                    {[
                      { key: "name" as const, label: common.fullName, placeholder: common.namePlaceholder },
                      { key: "email" as const, label: common.email, placeholder: common.emailPlaceholder },
                      { key: "phone" as const, label: common.phone, placeholder: common.phonePlaceholder },
                    ].map((f) => (
                      <div key={f.key}>
                        <label className="mb-2 block font-mono text-[10px] uppercase tracking-[0.16em] text-[#6F6B65]">
                          {f.label}
                        </label>
                        <input
                          value={details[f.key]}
                          onChange={(e) => setDetails({ ...details, [f.key]: e.target.value })}
                          placeholder={f.placeholder}
                          className="w-full rounded-lg border border-white/12 bg-[#0B0B0C] px-4 py-3 text-[14px] text-[#F2EFE9] outline-none focus:border-[#C9A55F]"
                        />
                        {errors[f.key] && <p className="mt-1.5 text-[12px] text-red-400">{errors[f.key]}</p>}
                      </div>
                    ))}
                    <div className="flex items-center justify-between pt-1">
                      <button
                        type="button"
                        onClick={() => setStep("datetime")}
                        className="font-mono text-[10px] uppercase tracking-[0.16em] text-[#6F6B65] hover:text-[#C9A55F]"
                      >
                        &larr; {common.back}
                      </button>
                      <BrassButton type="submit">{common.continueLabel}</BrassButton>
                    </div>
                  </form>
                )}

                {step === "review" && service && barber && dateId && time && (
                  <div className="flex flex-col gap-6">
                    <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#6F6B65]">
                      {dict.reviewHeading}
                    </p>
                    <dl className="grid gap-4 sm:grid-cols-2">
                      {[
                        [dict.summaryService, service.name],
                        [dict.summaryBarber, barber.name],
                        [dict.summaryDate, BARBER_DATE_FULL_LABELS[dateId] ?? ""],
                        [dict.summaryTime, time],
                        [dict.summaryName, details.name],
                        [dict.summaryContact, `${details.email} · ${details.phone}`],
                      ].map(([label, value]) => (
                        <div key={label}>
                          <dt className="font-mono text-[10px] uppercase tracking-[0.16em] text-[#6F6B65]">{label}</dt>
                          <dd className="mt-1.5 text-[14px] text-[#F2EFE9]">{value}</dd>
                        </div>
                      ))}
                    </dl>
                    <div className="flex items-center justify-between pt-1">
                      <button
                        type="button"
                        onClick={() => setStep("details")}
                        className="font-mono text-[10px] uppercase tracking-[0.16em] text-[#6F6B65] hover:text-[#C9A55F]"
                      >
                        &larr; {common.back}
                      </button>
                      <BrassButton onClick={() => setStep("done")}>{dict.confirmAppointment}</BrassButton>
                    </div>
                  </div>
                )}

                {step === "done" && service && barber && dateId && time && !cancelled && (
                  <div className="flex flex-col items-center gap-5 py-6 text-center">
                    <span className="flex h-14 w-14 items-center justify-center rounded-full bg-[#C9A55F]/15 text-[#C9A55F]">
                      <svg viewBox="0 0 20 20" className="h-7 w-7" fill="none" stroke="currentColor" strokeWidth={2}>
                        <path d="m4 10 4 4 8-8" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </span>
                    <p className="font-heading text-[22px] font-bold uppercase text-[#F2EFE9]">{dict.confirmedTitle}</p>
                    <div className="text-[14px] leading-relaxed text-[#C9C5BE]">
                      <p>{service.name}</p>
                      <p>{BARBER_DATE_FULL_LABELS[dateId]}</p>
                      <p>{time}</p>
                      <p>{barber.name}</p>
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
                        className="font-mono text-[10px] uppercase tracking-[0.16em] text-[#8E8A83] hover:text-[#F2EFE9]"
                      >
                        {common.reschedule}
                      </button>
                      <button
                        type="button"
                        onClick={() => setCancelled(true)}
                        className="font-mono text-[10px] uppercase tracking-[0.16em] text-[#8E8A83] hover:text-red-400"
                      >
                        {common.cancelAppointment}
                      </button>
                      <button
                        type="button"
                        onClick={reset}
                        className="font-mono text-[10px] uppercase tracking-[0.16em] text-[#C9A55F] hover:text-[#DDBC77]"
                      >
                        {common.bookAnother}
                      </button>
                    </div>
                  </div>
                )}

                {step === "done" && cancelled && (
                  <div className="flex flex-col items-center gap-4 py-6 text-center">
                    <span className="flex h-14 w-14 items-center justify-center rounded-full bg-white/5 text-[#8E8A83]">
                      <svg viewBox="0 0 20 20" className="h-7 w-7" fill="none" stroke="currentColor" strokeWidth={2}>
                        <path d="m5 5 10 10M15 5 5 15" strokeLinecap="round" />
                      </svg>
                    </span>
                    <p className="font-heading text-[20px] font-bold uppercase text-[#F2EFE9]">{common.cancelledTitle}</p>
                    <p className="text-[14px] text-[#8E8A83]">{common.cancelledBody}</p>
                    <button
                      type="button"
                      onClick={reset}
                      className="mt-2 font-mono text-[10px] uppercase tracking-[0.16em] text-[#C9A55F] hover:text-[#DDBC77]"
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
      <footer className="border-t border-white/8 bg-[#0E0E10] pt-12">
        <Shell>
          <div className="grid gap-9 sm:grid-cols-3">
            <div>
              <ShopLogo />
              <p className="mt-4 max-w-xs text-[13px] leading-relaxed text-[#6F6B65]">{dict.heroSubtitle}</p>
            </div>
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#C9A55F]">{common.hoursHeading}</p>
              <dl className="mt-4 flex flex-col gap-2 text-[13px] text-[#8E8A83]">
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
              <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#C9A55F]">{common.contactHeading}</p>
              <div className="mt-4 flex flex-col gap-2 text-[13px] text-[#8E8A83]">
                <p>{SHOP.address.join(", ")}</p>
                <p>{SHOP.email}</p>
                <p>{SHOP.phone}</p>
              </div>
            </div>
          </div>
          <p className="mt-10 border-t border-white/8 py-6 font-mono text-[10px] uppercase tracking-[0.16em] text-[#4F4C48]">
            {common.footerTagline}
          </p>
        </Shell>
      </footer>
    </div>
  );
}
