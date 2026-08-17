"use client";

import { useEffect, useState } from "react";
import {
  TAJEX_COPY,
  TAJEX_MAP_QUERY,
  TAJEX_SHIPMENT,
  type TajexLang,
  type TajexService,
} from "@/lib/demos/tajex-data";
import {
  ArrowIcon,
  CargoIcon,
  CheckIcon,
  ChevronIcon,
  ContactIcon,
  PortBackdrop,
  PostScene,
  SearchIcon,
  SocialIcon,
  TajexLogo,
  TrailerScene,
  VesselScene,
} from "./TajexArt";

type View = "home" | "about" | "services" | "service-detail" | "blog" | "contact";

interface ContactForm {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  comments: string;
}

const EMPTY_FORM: ContactForm = { firstName: "", lastName: "", email: "", phone: "", comments: "" };

/* ------------------------------------------------------------------ */
/* Shared presentational pieces                                        */
/* ------------------------------------------------------------------ */

function Eyebrow({ children, light = false }: { children: React.ReactNode; light?: boolean }) {
  return (
    <p className="flex items-center gap-2.5 font-tajex-mono text-[11px] font-medium uppercase tracking-[0.18em] text-[#E8264C]">
      <span className={`h-px w-5 ${light ? "bg-[#E8264C]" : "bg-[#E8264C]"}`} />
      {children}
    </p>
  );
}

function SectionTitle({ children, light = false }: { children: React.ReactNode; light?: boolean }) {
  return (
    <h2
      className={`mt-4 max-w-2xl text-[30px] font-extrabold leading-[1.1] tracking-[-0.02em] sm:text-[40px] ${
        light ? "text-white" : "text-[#0F1729]"
      }`}
    >
      {children}
    </h2>
  );
}

function Shell({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <div className={`mx-auto w-full max-w-5xl px-6 sm:px-10 ${className}`}>{children}</div>;
}

function RedButton({
  children,
  onClick,
  full = false,
  type = "button",
}: {
  children: React.ReactNode;
  onClick?: () => void;
  full?: boolean;
  type?: "button" | "submit";
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      className={`group inline-flex items-center justify-center gap-2 rounded-full bg-[#E8264C] px-7 py-3.5 text-sm font-bold text-white transition-colors hover:bg-[#cf1d41] ${
        full ? "w-full" : ""
      }`}
    >
      {children}
      <ArrowIcon className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
    </button>
  );
}

function GhostButton({
  children,
  onClick,
  light = false,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  light?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`group inline-flex items-center justify-center gap-2 rounded-full border px-7 py-3.5 text-sm font-bold transition-colors ${
        light
          ? "border-white/35 text-white hover:border-white"
          : "border-[#DCE2ED] text-[#0F1729] hover:border-[#0F1729]"
      }`}
    >
      {children}
      <ArrowIcon className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
    </button>
  );
}

function PageHeader({
  crumb,
  title,
  subtitle,
  chips,
  homeLabel,
  onHome,
}: {
  crumb: string;
  title: string;
  subtitle: string;
  chips?: string[];
  homeLabel: string;
  onHome: () => void;
}) {
  return (
    <section className="relative overflow-hidden bg-[#131B3E] py-16 sm:py-20">
      <div className="pointer-events-none absolute -right-24 -top-24 h-80 w-80 rounded-full bg-[#E8264C] opacity-[0.14] blur-3xl" />
      <Shell className="relative">
        <p className="font-tajex-mono text-[11px] uppercase tracking-[0.2em] text-white/45">
          <button type="button" onClick={onHome} className="transition-colors hover:text-white">
            {homeLabel}
          </button>{" "}
          / {crumb}
        </p>
        <h1 className="mt-5 max-w-2xl text-[34px] font-extrabold leading-[1.08] tracking-[-0.025em] text-white sm:text-[46px]">
          {title}
        </h1>
        <p className="mt-5 max-w-xl text-[15px] leading-relaxed text-white/65">{subtitle}</p>
        {chips && (
          <div className="mt-7 flex flex-wrap gap-3">
            {chips.map((chip) => (
              <span
                key={chip}
                className="rounded-full border border-white/20 px-4 py-2 font-tajex-mono text-[11px] uppercase tracking-[0.14em] text-white/75"
              >
                {chip}
              </span>
            ))}
          </div>
        )}
      </Shell>
    </section>
  );
}

/* ------------------------------------------------------------------ */

export function TajexDemo() {
  const [lang, setLang] = useState<TajexLang>("nl");
  const [view, setView] = useState<View>("home");
  const [activeService, setActiveService] = useState<TajexService | null>(null);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const [trackOpen, setTrackOpen] = useState(false);
  const [trackInput, setTrackInput] = useState("");
  const [trackResult, setTrackResult] = useState<"idle" | "found" | "not-found">("idle");

  const [form, setForm] = useState<ContactForm>(EMPTY_FORM);
  const [errors, setErrors] = useState<Partial<Record<keyof ContactForm, string>>>({});
  const [sent, setSent] = useState(false);

  const t = TAJEX_COPY[lang];

  useEffect(() => {
    if (!trackOpen) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setTrackOpen(false);
    }
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKey);
    };
  }, [trackOpen]);

  function go(next: View) {
    setView(next);
    setActiveService(null);
    setOpenFaq(null);
  }

  function openService(id: string) {
    const service = t.services.list.find((s) => s.id === id);
    if (!service) return;
    setActiveService(service);
    setView("service-detail");
  }

  function runTracking() {
    const ref = trackInput.trim().toUpperCase();
    setTrackResult(ref === TAJEX_SHIPMENT.reference ? "found" : "not-found");
  }

  function submitForm(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const next: Partial<Record<keyof ContactForm, string>> = {};
    if (form.firstName.trim().length < 2) next.firstName = t.quote.errors.firstName;
    if (form.lastName.trim().length < 2) next.lastName = t.quote.errors.lastName;
    if (!/^\S+@\S+\.\S+$/.test(form.email)) next.email = t.quote.errors.email;
    if (form.comments.trim().length < 5) next.comments = t.quote.errors.comments;
    setErrors(next);
    if (Object.keys(next).length === 0) setSent(true);
  }

  const NAV: { id: View; label: string }[] = [
    { id: "home", label: t.nav.home },
    { id: "about", label: t.nav.about },
    { id: "services", label: t.nav.services },
    { id: "blog", label: t.nav.blog },
    { id: "contact", label: t.nav.contact },
  ];

  function isActive(id: View) {
    return id === view || (id === "services" && view === "service-detail");
  }

  return (
    <div className="relative overflow-hidden rounded-2xl border border-[#E3E8F0] bg-white font-tajex text-[#0F1729]">
      {/* ---------------- Header ---------------- */}
      <header className="border-b border-[#EDF0F5] bg-white">
        <div className="mx-auto flex w-full max-w-5xl items-center justify-between gap-4 px-6 py-4 sm:px-10">
          <button type="button" onClick={() => go("home")} aria-label="Tajex Logistics">
            <TajexLogo />
          </button>

          <nav className="hidden items-center gap-1 lg:flex">
            {NAV.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => go(item.id)}
                className={`relative rounded-lg px-3 py-2 text-[15px] font-semibold transition-colors ${
                  isActive(item.id) ? "bg-[#F3F5FA] text-[#131B3E]" : "text-[#0F1729] hover:text-[#131B3E]"
                }`}
              >
                {item.label}
                {isActive(item.id) && (
                  <span className="absolute inset-x-3 -bottom-0.5 h-0.5 rounded-full bg-[#E8264C]" />
                )}
              </button>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setTrackOpen(true)}
              className="inline-flex items-center gap-2 rounded-full bg-[#131B3E] px-5 py-2.5 font-tajex-mono text-[11px] font-semibold uppercase tracking-[0.14em] text-white transition-colors hover:bg-[#1d2857]"
            >
              <SearchIcon className="h-3.5 w-3.5" />
              {t.trackingBtn}
            </button>
            <div className="flex items-center gap-1">
              {(["nl", "en"] as TajexLang[]).map((code) => (
                <button
                  key={code}
                  type="button"
                  onClick={() => setLang(code)}
                  aria-pressed={lang === code}
                  className={`rounded-md px-2 py-1 font-tajex-mono text-[11px] font-semibold transition-colors ${
                    lang === code ? "bg-[#F3F5FA] text-[#131B3E]" : "text-[#98A2B8] hover:text-[#131B3E]"
                  }`}
                >
                  {code.toUpperCase()}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* mobile nav */}
        <div className="flex gap-1 overflow-x-auto border-t border-[#EDF0F5] px-6 py-2 lg:hidden">
          {NAV.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => go(item.id)}
              className={`shrink-0 rounded-lg px-3 py-1.5 text-sm font-semibold ${
                isActive(item.id) ? "bg-[#F3F5FA] text-[#131B3E]" : "text-[#6B7793]"
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </header>

      {/* ---------------- Home ---------------- */}
      {view === "home" && (
        <>
          <section className="relative overflow-hidden bg-[#131B3E] py-16 sm:py-24">
            <PortBackdrop className="pointer-events-none absolute inset-0 h-full w-full opacity-30" />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-[#131B3E] via-[#131B3E]/90 to-[#131B3E]/40" />
            <Shell className="relative">
              <p className="flex flex-wrap gap-x-7 gap-y-2 font-tajex-mono text-[11px] uppercase tracking-[0.16em] text-white/55">
                <span>{t.hero.since}</span>
                <span>{t.hero.departure}</span>
                <span>{t.hero.arrival}</span>
              </p>
              <h1 className="mt-6 max-w-2xl text-[36px] font-extrabold leading-[1.05] tracking-[-0.03em] text-white sm:text-[52px]">
                {t.hero.titleStart}
                <br />
                <span className="text-[#E8264C]">{t.hero.titleAccent}</span> {t.hero.titleEnd}
              </h1>
              <p className="mt-6 max-w-xl text-[15px] leading-relaxed text-white/70">{t.hero.intro}</p>

              <div className="mt-9 flex flex-wrap gap-4">
                <RedButton onClick={() => go("contact")}>{t.hero.ctaQuote}</RedButton>
                <GhostButton light onClick={() => setTrackOpen(true)}>
                  {t.hero.ctaTrack}
                </GhostButton>
              </div>

              <ul className="mt-9 flex flex-wrap gap-x-9 gap-y-3">
                {t.hero.checks.map((check) => (
                  <li key={check} className="flex items-center gap-2 text-[13px] text-white/80">
                    <CheckIcon className="h-3.5 w-3.5 text-[#E8264C]" />
                    {check}
                  </li>
                ))}
              </ul>

              <div className="mt-12 border-t border-white/15 pt-7">
                <div className="flex flex-wrap items-baseline justify-between gap-3">
                  <p className="text-sm font-bold text-white">{t.hero.corridorLabel}</p>
                  <p className="font-tajex-mono text-[11px] uppercase tracking-[0.16em] text-white/55">
                    {t.hero.corridorNote}
                  </p>
                </div>
                <div className="mt-6 grid grid-cols-2 gap-y-7 sm:grid-cols-4">
                  {t.hero.stops.map((stop, i) => (
                    <div key={stop.code} className="relative pr-4">
                      <div className="flex items-center">
                        <span
                          className={`h-2.5 w-2.5 shrink-0 rounded-full ${
                            i === 0 || i === t.hero.stops.length - 1
                              ? "bg-[#E8264C]"
                              : "border border-white/50 bg-transparent"
                          }`}
                        />
                        <span className="ml-1 h-px flex-1 bg-white/20" />
                      </div>
                      <p className="mt-3 font-tajex-mono text-[11px] uppercase tracking-[0.14em] text-white/50">
                        {stop.code}
                      </p>
                      <p className="mt-1 text-sm font-bold text-white">{stop.name}</p>
                      <p className="mt-1 font-tajex-mono text-[10px] uppercase tracking-[0.16em] text-white/40">
                        {stop.role}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </Shell>
          </section>

          {/* Sailing schedule */}
          <section className="bg-white py-16 sm:py-20">
            <Shell>
              <div className="flex flex-wrap items-end justify-between gap-5">
                <div>
                  <Eyebrow>{t.schedule.eyebrow}</Eyebrow>
                  <SectionTitle>{t.schedule.title}</SectionTitle>
                </div>
                <GhostButton onClick={() => go("contact")}>{t.schedule.bookBtn}</GhostButton>
              </div>
              <div className="mt-10 grid gap-5 sm:grid-cols-3">
                {t.schedule.sailings.map((sailing, i) => (
                  <div
                    key={sailing.date}
                    className={`rounded-2xl border p-6 ${
                      i === 0
                        ? "relative overflow-hidden border-transparent bg-[#131B3E] text-white"
                        : "border-[#E6EAF2] bg-white"
                    }`}
                  >
                    {i === 0 && (
                      <span className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-[#E8264C] opacity-25 blur-2xl" />
                    )}
                    <p
                      className={`relative font-tajex-mono text-[10px] uppercase tracking-[0.18em] ${
                        i === 0 ? "text-white/60" : "text-[#E8264C]"
                      }`}
                    >
                      {i === 0 ? t.schedule.nextLabel : t.schedule.thenLabel}
                    </p>
                    <p className="relative mt-4 text-2xl font-extrabold tracking-[-0.02em]">{sailing.date}</p>
                    <p className={`relative mt-1.5 text-sm ${i === 0 ? "text-white/70" : "text-[#6B7793]"}`}>
                      {sailing.weekday}
                    </p>
                    <p
                      className={`relative mt-6 border-t pt-4 font-tajex-mono text-[10px] uppercase tracking-[0.14em] ${
                        i === 0 ? "border-white/15 text-white/55" : "border-[#EDF0F5] text-[#98A2B8]"
                      }`}
                    >
                      {sailing.cutoff}
                    </p>
                  </div>
                ))}
              </div>
            </Shell>
          </section>

          {/* Cargo picker */}
          <section className="bg-white pb-16 sm:pb-20">
            <Shell>
              <Eyebrow>{t.cargo.eyebrow}</Eyebrow>
              <SectionTitle>{t.cargo.title}</SectionTitle>
              <p className="mt-4 max-w-xl text-[15px] text-[#6B7793]">{t.cargo.subtitle}</p>
              <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
                {t.cargo.items.map((item, i) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => openService(item.serviceId)}
                    className={`group flex flex-col rounded-2xl border p-6 text-left transition-all ${
                      i === 0
                        ? "border-transparent bg-white shadow-[0_18px_40px_-24px_rgba(15,23,41,0.45)]"
                        : "border-[#E6EAF2] bg-white hover:-translate-y-0.5 hover:shadow-[0_18px_40px_-24px_rgba(15,23,41,0.35)]"
                    }`}
                  >
                    <span
                      className={`flex h-11 w-11 items-center justify-center rounded-xl ${
                        i === 0 ? "bg-[#E8264C] text-white" : "bg-[#F3F5FA] text-[#131B3E]"
                      }`}
                    >
                      <CargoIcon name={item.icon} className="h-5 w-5" />
                    </span>
                    <p className="mt-5 text-[17px] font-bold tracking-[-0.01em]">{item.title}</p>
                    <p className="mt-2 flex-1 text-[13px] leading-relaxed text-[#6B7793]">{item.description}</p>
                    <span className="mt-6 inline-flex items-center gap-1.5 font-tajex-mono text-[11px] uppercase tracking-[0.14em] text-[#E8264C]">
                      {item.link}
                      <ArrowIcon className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                    </span>
                  </button>
                ))}
              </div>
            </Shell>
          </section>

          {/* About block */}
          <section className="bg-white pb-16 sm:pb-24">
            <Shell>
              <div className="grid items-center gap-12 lg:grid-cols-2">
                <div className="relative">
                  <div className="overflow-hidden rounded-2xl">
                    <TrailerScene label={t.about.badgeLabel ? "TAJEX" : "TAJEX"} className="h-[300px] w-full" />
                  </div>
                  <div className="absolute -bottom-6 -left-2 rounded-2xl border border-[#EDF0F5] bg-white px-6 py-5 shadow-[0_18px_40px_-24px_rgba(15,23,41,0.4)]">
                    <p className="text-2xl font-extrabold text-[#131B3E]">{t.about.badgeValue}</p>
                    <p className="mt-1 font-tajex-mono text-[10px] uppercase tracking-[0.16em] text-[#98A2B8]">
                      {t.about.badgeLabel}
                    </p>
                  </div>
                </div>
                <div>
                  <Eyebrow>{t.about.eyebrow}</Eyebrow>
                  <SectionTitle>{t.about.title}</SectionTitle>
                  {t.about.paragraphs.map((p) => (
                    <p key={p} className="mt-5 text-[15px] leading-relaxed text-[#6B7793]">
                      {p}
                    </p>
                  ))}
                  <ul className="mt-7 flex flex-col gap-3">
                    {t.about.checks.map((check) => (
                      <li key={check} className="flex items-start gap-3 text-[14px] text-[#0F1729]">
                        <CheckIcon className="mt-0.5 h-4 w-4 shrink-0 text-[#E8264C]" />
                        {check}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </Shell>
          </section>

          <StatsBand copy={t} />
          <ProcessSection copy={t} />
          <WhySection copy={t} />

          {/* Blog teaser */}
          <section className="bg-white py-16 sm:py-20">
            <Shell>
              <div className="flex flex-col items-center text-center">
                <Eyebrow>{t.blog.eyebrow}</Eyebrow>
                <SectionTitle>{t.blog.title}</SectionTitle>
              </div>
              <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {t.blog.posts.slice(0, 3).map((post) => (
                  <PostCard key={post.title} post={post} onClick={() => go("blog")} />
                ))}
              </div>
              <div className="mt-10 flex justify-center">
                <GhostButton onClick={() => go("blog")}>{t.blog.allBtn}</GhostButton>
              </div>
            </Shell>
          </section>

          <FaqSection copy={t} open={openFaq} setOpen={setOpenFaq} />

          <section className="bg-white py-16 sm:py-20">
            <Shell>
              <Eyebrow>{t.contact.eyebrow}</Eyebrow>
              <SectionTitle>{t.contact.title}</SectionTitle>
              <p className="mt-4 max-w-xl text-[15px] text-[#6B7793]">{t.contact.subtitle}</p>
              <div className="mt-8">
                <RedButton onClick={() => go("contact")}>{t.hero.ctaQuote}</RedButton>
              </div>
            </Shell>
          </section>
        </>
      )}

      {/* ---------------- About ---------------- */}
      {view === "about" && (
        <>
          <PageHeader
            crumb={t.nav.about}
            title={t.about.heroTitle}
            subtitle={t.about.heroSubtitle}
            chips={t.about.chips}
            homeLabel={t.breadcrumbHome}
            onHome={() => go("home")}
          />
          <section className="bg-white py-16 sm:py-20">
            <Shell>
              <div className="grid items-center gap-12 lg:grid-cols-2">
                <div className="overflow-hidden rounded-2xl">
                  <VesselScene className="h-[420px] w-full" />
                </div>
                <div>
                  <Eyebrow>{t.about.storyEyebrow}</Eyebrow>
                  <SectionTitle>{t.about.storyTitle}</SectionTitle>
                  {t.about.storyParagraphs.map((p) => (
                    <p key={p} className="mt-5 text-[15px] leading-relaxed text-[#6B7793]">
                      {p}
                    </p>
                  ))}
                  <ul className="mt-7 flex flex-col gap-3">
                    {t.about.storyChecks.map((check) => (
                      <li key={check} className="flex items-start gap-3 text-[14px] text-[#0F1729]">
                        <CheckIcon className="mt-0.5 h-4 w-4 shrink-0 text-[#E8264C]" />
                        {check}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </Shell>
          </section>
          <StatsBand copy={t} />
          <WhySection copy={t} />
          <FaqSection copy={t} open={openFaq} setOpen={setOpenFaq} />
          <CtaBanner copy={t} onClick={() => go("contact")} />
        </>
      )}

      {/* ---------------- Services ---------------- */}
      {view === "services" && (
        <>
          <PageHeader
            crumb={t.nav.services}
            title={t.services.heroTitle}
            subtitle={t.services.heroSubtitle}
            homeLabel={t.breadcrumbHome}
            onHome={() => go("home")}
          />
          <section className="bg-white py-16 sm:py-20">
            <Shell>
              <div className="border-t border-[#EDF0F5]">
                {t.services.list.map((service) => (
                  <button
                    key={service.id}
                    type="button"
                    onClick={() => openService(service.id)}
                    className="group grid w-full items-center gap-4 border-b border-[#EDF0F5] py-7 text-left md:grid-cols-[130px_1fr_320px_auto]"
                  >
                    <span className="font-tajex-mono text-[11px] uppercase tracking-[0.16em] text-[#E8264C]">
                      {service.category}
                    </span>
                    <span className="text-[19px] font-bold tracking-[-0.01em] text-[#0F1729]">{service.name}</span>
                    <span className="text-[14px] leading-relaxed text-[#6B7793]">{service.summary}</span>
                    <span className="flex h-9 w-9 items-center justify-center justify-self-start rounded-full border border-[#DCE2ED] text-[#0F1729] transition-colors group-hover:border-[#E8264C] group-hover:bg-[#E8264C] group-hover:text-white md:justify-self-end">
                      <ArrowIcon className="h-4 w-4" />
                    </span>
                  </button>
                ))}
              </div>
            </Shell>
          </section>
          <CtaBanner copy={t} onClick={() => go("contact")} />
        </>
      )}

      {/* ---------------- Service detail ---------------- */}
      {view === "service-detail" && activeService && (
        <>
          <PageHeader
            crumb={activeService.category}
            title={activeService.name}
            subtitle={activeService.tagline}
            homeLabel={t.breadcrumbHome}
            onHome={() => go("home")}
          />
          <section className="bg-white py-16 sm:py-20">
            <Shell>
              <button
                type="button"
                onClick={() => go("services")}
                className="font-tajex-mono text-[11px] uppercase tracking-[0.16em] text-[#98A2B8] transition-colors hover:text-[#E8264C]"
              >
                &larr; {t.services.backBtn}
              </button>
              <p className="mt-8 max-w-2xl text-[17px] leading-relaxed text-[#4A5568]">
                {activeService.description}
              </p>
              <p className="mt-12 font-tajex-mono text-[11px] uppercase tracking-[0.18em] text-[#E8264C]">
                {t.services.whatYouGet}
              </p>
              <ul className="mt-6 grid gap-4 sm:grid-cols-2">
                {activeService.details.map((detail) => (
                  <li
                    key={detail}
                    className="flex items-start gap-3 rounded-2xl border border-[#E6EAF2] p-5 text-[14px] text-[#0F1729]"
                  >
                    <CheckIcon className="mt-0.5 h-4 w-4 shrink-0 text-[#E8264C]" />
                    {detail}
                  </li>
                ))}
              </ul>
              <div className="mt-10">
                <RedButton onClick={() => go("contact")}>{t.services.quoteBtn}</RedButton>
              </div>
            </Shell>
          </section>
        </>
      )}

      {/* ---------------- Blog ---------------- */}
      {view === "blog" && (
        <>
          <PageHeader
            crumb={t.nav.blog}
            title={t.blog.title}
            subtitle={t.blog.heroSubtitle}
            homeLabel={t.breadcrumbHome}
            onHome={() => go("home")}
          />
          <section className="bg-white py-16 sm:py-20">
            <Shell>
              <p className="max-w-2xl text-[15px] leading-relaxed text-[#6B7793]">{t.blog.intro}</p>
              <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {t.blog.posts.map((post) => (
                  <PostCard key={post.title} post={post} />
                ))}
              </div>
            </Shell>
          </section>
          <CtaBanner copy={t} onClick={() => go("contact")} />
        </>
      )}

      {/* ---------------- Contact ---------------- */}
      {view === "contact" && (
        <>
          <section className="bg-white py-16 sm:py-20">
            <Shell>
              <Eyebrow>{t.contact.eyebrow}</Eyebrow>
              <SectionTitle>{t.contact.title}</SectionTitle>
              <p className="mt-5 max-w-xl text-[15px] text-[#6B7793]">{t.contact.subtitle}</p>

              <div className="mt-12 grid gap-10 lg:grid-cols-2">
                <div>
                  <div className="overflow-hidden rounded-2xl">
                    <TrailerScene className="h-[280px] w-full" />
                  </div>
                  <dl className="mt-8 flex flex-col gap-6">
                    <ContactRow icon="pin" label={t.contact.addressLabel}>
                      {t.contact.addressLines.map((line) => (
                        <span key={line} className="block">
                          {line}
                        </span>
                      ))}
                    </ContactRow>
                    <ContactRow icon="mail" label={t.contact.emailLabel}>
                      {t.contact.email}
                    </ContactRow>
                    <ContactRow icon="phone" label={t.contact.phoneLabel}>
                      {t.contact.phone}
                    </ContactRow>
                    <ContactRow icon="search" label={t.contact.trackLabel}>
                      <button
                        type="button"
                        onClick={() => setTrackOpen(true)}
                        className="text-[#0F1729] underline-offset-4 hover:text-[#E8264C] hover:underline"
                      >
                        {t.contact.trackValue}
                      </button>
                    </ContactRow>
                  </dl>
                </div>

                <div className="rounded-2xl bg-[#F5F7FB] p-7 sm:p-9">
                  {sent ? (
                    <div className="flex flex-col items-start">
                      <span className="flex h-12 w-12 items-center justify-center rounded-full bg-[#E8264C]/10 text-[#E8264C]">
                        <CheckIcon className="h-6 w-6" />
                      </span>
                      <p className="mt-5 text-[19px] font-bold">{t.quote.successTitle}</p>
                      <p className="mt-2 text-[14px] leading-relaxed text-[#6B7793]">{t.quote.successBody}</p>
                      <button
                        type="button"
                        onClick={() => {
                          setForm(EMPTY_FORM);
                          setErrors({});
                          setSent(false);
                        }}
                        className="mt-7 rounded-full border border-[#DCE2ED] px-6 py-2.5 text-sm font-bold text-[#0F1729] transition-colors hover:border-[#0F1729]"
                      >
                        {t.quote.another}
                      </button>
                    </div>
                  ) : (
                    <form onSubmit={submitForm} noValidate className="grid gap-5 sm:grid-cols-2">
                      <Field
                        label={t.quote.firstName}
                        required
                        value={form.firstName}
                        error={errors.firstName}
                        onChange={(v) => setForm((f) => ({ ...f, firstName: v }))}
                      />
                      <Field
                        label={t.quote.lastName}
                        required
                        value={form.lastName}
                        error={errors.lastName}
                        onChange={(v) => setForm((f) => ({ ...f, lastName: v }))}
                      />
                      <Field
                        label={t.quote.email}
                        required
                        type="email"
                        value={form.email}
                        error={errors.email}
                        onChange={(v) => setForm((f) => ({ ...f, email: v }))}
                      />
                      <Field
                        label={t.quote.phone}
                        type="tel"
                        value={form.phone}
                        onChange={(v) => setForm((f) => ({ ...f, phone: v }))}
                      />
                      <div className="sm:col-span-2">
                        <FieldLabel required>{t.quote.comments}</FieldLabel>
                        <textarea
                          rows={4}
                          value={form.comments}
                          onChange={(e) => setForm((f) => ({ ...f, comments: e.target.value }))}
                          placeholder={t.quote.commentsPlaceholder}
                          className="w-full rounded-xl border border-[#DCE2ED] bg-white px-4 py-3 text-[14px] text-[#0F1729] outline-none transition-colors placeholder:text-[#A6B0C3] focus:border-[#131B3E]"
                        />
                        {errors.comments && <FieldError>{errors.comments}</FieldError>}
                      </div>
                      <div className="sm:col-span-2">
                        <RedButton type="submit" full>
                          {t.quote.submit}
                        </RedButton>
                      </div>
                    </form>
                  )}
                </div>
              </div>

              {/* Real Google Maps embed. The keyless output=embed form is used
                  on purpose so no API key ends up in the client bundle. */}
              <div className="mt-12 overflow-hidden rounded-2xl border border-[#E6EAF2]">
                <iframe
                  title={`${t.contact.addressLines.join(", ")}`}
                  src={`https://www.google.com/maps?q=${encodeURIComponent(TAJEX_MAP_QUERY)}&z=15&output=embed`}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="h-64 w-full border-0 sm:h-80"
                />
              </div>
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(TAJEX_MAP_QUERY)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 inline-flex items-center gap-1.5 font-tajex-mono text-[11px] uppercase tracking-[0.14em] text-[#E8264C] hover:underline"
              >
                {t.contact.openInMaps}
                <ArrowIcon className="h-3.5 w-3.5" />
              </a>
            </Shell>
          </section>

          <section className="bg-[#F5F7FB] py-16 sm:py-20">
            <Shell>
              <Eyebrow>{t.contact.checklistEyebrow}</Eyebrow>
              <SectionTitle>{t.contact.checklistTitle}</SectionTitle>
              <p className="mt-5 max-w-2xl text-[15px] leading-relaxed text-[#6B7793]">
                {t.contact.checklistSubtitle}
              </p>
              <div className="mt-10 border-t border-[#E2E7F0]">
                {t.contact.checklist.map((item) => (
                  <div
                    key={item.number}
                    className="grid gap-2 border-b border-[#E2E7F0] py-7 md:grid-cols-[90px_1fr]"
                  >
                    <span className="font-tajex-mono text-[11px] text-[#E8264C]">{item.number}</span>
                    <div>
                      <p className="text-[16px] font-bold">{item.title}</p>
                      <p className="mt-2 max-w-2xl text-[14px] leading-relaxed text-[#6B7793]">
                        {item.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </Shell>
          </section>

          <section className="bg-white py-16 sm:py-20">
            <Shell>
              <Eyebrow>{t.contact.afterEyebrow}</Eyebrow>
              <SectionTitle>{t.contact.afterTitle}</SectionTitle>
              <p className="mt-5 max-w-2xl text-[15px] leading-relaxed text-[#6B7793]">{t.contact.afterBody}</p>
            </Shell>
          </section>
        </>
      )}

      {/* ---------------- Footer ---------------- */}
      <footer className="bg-[#131B3E] pt-14 text-white">
        <Shell>
          <div className="grid gap-10 md:grid-cols-[1.4fr_1fr_1fr_1.2fr]">
            <div>
              <TajexLogo dark />
              <p className="mt-5 max-w-xs text-[13px] leading-relaxed text-white/55">{t.footer.tagline}</p>
              <div className="mt-6 flex gap-2.5">
                {["facebook", "linkedin", "x"].map((name) => (
                  <span
                    key={name}
                    className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/10 text-white/80"
                  >
                    <SocialIcon name={name} className="h-4 w-4" />
                  </span>
                ))}
              </div>
            </div>

            <div>
              <p className="font-tajex-mono text-[11px] uppercase tracking-[0.16em] text-white/45">
                {t.footer.navTitle}
              </p>
              <ul className="mt-5 flex flex-col gap-3">
                {NAV.map((item) => (
                  <li key={item.id}>
                    <button
                      type="button"
                      onClick={() => go(item.id)}
                      className="text-[14px] text-white/70 transition-colors hover:text-white"
                    >
                      {item.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <p className="font-tajex-mono text-[11px] uppercase tracking-[0.16em] text-white/45">
                {t.footer.servicesTitle}
              </p>
              <ul className="mt-5 flex flex-col gap-3">
                {t.services.list.map((service) => (
                  <li key={service.id}>
                    <button
                      type="button"
                      onClick={() => openService(service.id)}
                      className="text-left text-[14px] text-white/70 transition-colors hover:text-white"
                    >
                      {service.name}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <p className="font-tajex-mono text-[11px] uppercase tracking-[0.16em] text-white/45">
                {t.footer.contactTitle}
              </p>
              <div className="mt-5 flex flex-col gap-4 text-[14px] text-white/70">
                <p className="flex gap-3">
                  <ContactIcon name="pin" className="mt-0.5 h-4 w-4 shrink-0 text-[#E8264C]" />
                  <span>
                    {t.contact.addressLines.map((line) => (
                      <span key={line} className="block">
                        {line}
                      </span>
                    ))}
                  </span>
                </p>
                <p className="flex gap-3">
                  <ContactIcon name="mail" className="h-4 w-4 shrink-0 text-[#E8264C]" />
                  {t.contact.email}
                </p>
                <p className="flex gap-3">
                  <ContactIcon name="phone" className="h-4 w-4 shrink-0 text-[#E8264C]" />
                  {t.contact.phone}
                </p>
              </div>
            </div>
          </div>

          <div className="mt-12 flex flex-wrap items-center justify-between gap-3 border-t border-white/10 py-6 font-tajex-mono text-[11px] uppercase tracking-[0.14em] text-white/40">
            <span>{t.footer.copyright}</span>
            <span>{t.footer.location}</span>
          </div>
        </Shell>
      </footer>

      <p className="border-t border-[#EDF0F5] bg-white px-6 py-4 text-center text-[11px] text-[#98A2B8]">
        {t.demoNote}
      </p>

      {/* ---------------- Track & trace slide-over ---------------- */}
      {trackOpen && (
        <div className="fixed inset-0 z-[100] flex justify-end">
          <button
            type="button"
            aria-label={t.tracking.close}
            onClick={() => setTrackOpen(false)}
            className="absolute inset-0 bg-[#0F1729]/45"
          />
          <aside className="relative flex h-full w-full max-w-md flex-col overflow-y-auto bg-[#131B3E] p-7 text-white shadow-2xl sm:p-9">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-[19px] font-bold">{t.tracking.panelTitle}</p>
                <p className="mt-1 font-tajex-mono text-[10px] uppercase tracking-[0.18em] text-white/45">
                  {t.tracking.panelEyebrow}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setTrackOpen(false)}
                aria-label={t.tracking.close}
                className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-white/80 transition-colors hover:bg-white/20"
              >
                <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2}>
                  <path d="m6 6 12 12M18 6 6 18" strokeLinecap="round" />
                </svg>
              </button>
            </div>

            <label
              htmlFor="tjx-track"
              className="mt-8 block font-tajex-mono text-[10px] uppercase tracking-[0.18em] text-white/50"
            >
              {t.tracking.inputLabel}
            </label>
            <input
              id="tjx-track"
              value={trackInput}
              onChange={(e) => setTrackInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") runTracking();
              }}
              placeholder={t.tracking.placeholder}
              className="mt-3 w-full rounded-xl border border-white/20 bg-white px-4 py-3 text-[14px] text-[#0F1729] outline-none transition-colors placeholder:text-[#A6B0C3] focus:border-[#E8264C]"
            />
            <button
              type="button"
              onClick={runTracking}
              className="mt-4 w-full rounded-full bg-[#E8264C] py-3.5 text-sm font-bold text-white transition-colors hover:bg-[#cf1d41]"
            >
              {t.tracking.searchBtn}
            </button>
            <p className="mt-4 text-[12px] leading-relaxed text-white/55">
              {t.tracking.helper}{" "}
              <button
                type="button"
                onClick={() => setTrackInput(TAJEX_SHIPMENT.reference)}
                className="rounded bg-white/10 px-1.5 py-0.5 font-tajex-mono text-[11px] text-white transition-colors hover:bg-white/20"
              >
                {TAJEX_SHIPMENT.reference}
              </button>{" "}
              {t.tracking.helperTry}
            </p>

            {trackResult === "not-found" && (
              <p className="mt-6 rounded-xl border border-[#E8264C]/40 bg-[#E8264C]/10 px-4 py-3 text-[13px] text-[#ffb3c2]">
                {t.tracking.notFound}
              </p>
            )}

            {trackResult === "found" && (
              <div className="mt-8">
                <dl className="grid grid-cols-2 gap-y-4 rounded-xl border border-white/12 bg-white/[0.04] p-5 text-[13px]">
                  <div>
                    <dt className="font-tajex-mono text-[10px] uppercase tracking-[0.16em] text-white/40">
                      {t.tracking.referenceLabel}
                    </dt>
                    <dd className="mt-1 font-semibold">{TAJEX_SHIPMENT.reference}</dd>
                  </div>
                  <div>
                    <dt className="font-tajex-mono text-[10px] uppercase tracking-[0.16em] text-white/40">
                      {t.tracking.statusLabel}
                    </dt>
                    <dd className="mt-1 font-semibold text-[#E8264C]">{t.tracking.statusValue}</dd>
                  </div>
                  <div>
                    <dt className="font-tajex-mono text-[10px] uppercase tracking-[0.16em] text-white/40">
                      {t.tracking.routeLabel}
                    </dt>
                    <dd className="mt-1 font-semibold">
                      {TAJEX_SHIPMENT.origin} &rarr; {TAJEX_SHIPMENT.destination}
                    </dd>
                  </div>
                  <div>
                    <dt className="font-tajex-mono text-[10px] uppercase tracking-[0.16em] text-white/40">
                      {t.tracking.cargoLabel}
                    </dt>
                    <dd className="mt-1 font-semibold">{TAJEX_SHIPMENT.cargo}</dd>
                  </div>
                </dl>

                <ol className="mt-7 flex flex-col">
                  {t.tracking.events.map((event, i) => {
                    const done = i < t.tracking.doneCount;
                    const last = i === t.tracking.events.length - 1;
                    return (
                      <li key={event} className="flex gap-4">
                        <div className="flex flex-col items-center">
                          <span
                            className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full ${
                              done ? "bg-[#E8264C] text-white" : "border border-white/25 text-white/35"
                            }`}
                          >
                            {done ? (
                              <CheckIcon className="h-3 w-3" />
                            ) : (
                              <span className="text-[10px]">{i + 1}</span>
                            )}
                          </span>
                          {!last && (
                            <span className={`h-8 w-px ${done ? "bg-[#E8264C]/50" : "bg-white/15"}`} />
                          )}
                        </div>
                        <span className={`pb-3 text-[13px] ${done ? "text-white" : "text-white/40"}`}>
                          {event}
                        </span>
                      </li>
                    );
                  })}
                </ol>
              </div>
            )}
          </aside>
        </div>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Section helpers                                                     */
/* ------------------------------------------------------------------ */

function StatsBand({ copy }: { copy: (typeof TAJEX_COPY)["nl"] }) {
  return (
    <section className="relative overflow-hidden bg-[#131B3E] py-16 sm:py-20">
      <div className="pointer-events-none absolute -right-24 top-0 h-72 w-72 rounded-full bg-[#E8264C] opacity-[0.12] blur-3xl" />
      <Shell className="relative">
        <Eyebrow light>{copy.stats.eyebrow}</Eyebrow>
        <SectionTitle light>{copy.stats.title}</SectionTitle>
        <div className="mt-10 grid rounded-2xl border border-white/12 sm:grid-cols-2 lg:grid-cols-4">
          {copy.stats.items.map((stat, i) => (
            <div
              key={stat.title}
              className={`p-7 ${i > 0 ? "border-white/12 sm:border-l" : ""} ${
                i > 1 ? "border-t sm:border-t-0 lg:border-t-0" : ""
              }`}
            >
              <p className="text-[34px] font-extrabold leading-none text-[#E8264C]">{stat.value}</p>
              <p className="mt-4 text-[15px] font-bold text-white">{stat.title}</p>
              <p className="mt-2 text-[13px] leading-relaxed text-white/50">{stat.description}</p>
            </div>
          ))}
        </div>
      </Shell>
    </section>
  );
}

function ProcessSection({ copy }: { copy: (typeof TAJEX_COPY)["nl"] }) {
  return (
    <section className="bg-white py-16 sm:py-20">
      <Shell>
        <Eyebrow>{copy.process.eyebrow}</Eyebrow>
        <SectionTitle>{copy.process.title}</SectionTitle>
        <p className="mt-4 max-w-xl text-[15px] text-[#6B7793]">{copy.process.subtitle}</p>
        <div className="mt-10 border-t border-[#EDF0F5]">
          {copy.process.steps.map((step) => (
            <div key={step.number} className="grid gap-2 border-b border-[#EDF0F5] py-7 md:grid-cols-[90px_1fr]">
              <span className="font-tajex-mono text-[11px] text-[#E8264C]">{step.number}</span>
              <div>
                <p className="text-[16px] font-bold">{step.title}</p>
                <p className="mt-2 max-w-2xl text-[14px] leading-relaxed text-[#6B7793]">{step.description}</p>
                <p className="mt-3 font-tajex-mono text-[10px] uppercase tracking-[0.16em] text-[#98A2B8]">
                  {step.meta}
                </p>
              </div>
            </div>
          ))}
        </div>
      </Shell>
    </section>
  );
}

function WhySection({ copy }: { copy: (typeof TAJEX_COPY)["nl"] }) {
  return (
    <section className="bg-[#F5F7FB] py-16 sm:py-20">
      <Shell>
        <Eyebrow>{copy.why.eyebrow}</Eyebrow>
        <SectionTitle>{copy.why.title}</SectionTitle>
        <div className="mt-10 grid gap-6 sm:grid-cols-3">
          {copy.why.cards.map((card) => (
            <div key={card.title} className="rounded-2xl border border-[#E6EAF2] bg-white p-7">
              <p className="text-[18px] font-bold tracking-[-0.01em]">{card.title}</p>
              <p className="mt-3 text-[14px] leading-relaxed text-[#6B7793]">{card.description}</p>
              <p className="mt-6 border-t border-[#EDF0F5] pt-4 font-tajex-mono text-[10px] uppercase tracking-[0.14em] text-[#E8264C]">
                {card.meta}
              </p>
            </div>
          ))}
        </div>
      </Shell>
    </section>
  );
}

function FaqSection({
  copy,
  open,
  setOpen,
}: {
  copy: (typeof TAJEX_COPY)["nl"];
  open: number | null;
  setOpen: (i: number | null) => void;
}) {
  return (
    <section className="bg-[#F5F7FB] py-16 sm:py-20">
      <Shell>
        <div className="flex flex-col items-center text-center">
          <Eyebrow>{copy.faq.eyebrow}</Eyebrow>
          <SectionTitle>{copy.faq.title}</SectionTitle>
          <p className="mt-4 max-w-xl text-[15px] text-[#6B7793]">{copy.faq.subtitle}</p>
        </div>
        <div className="mx-auto mt-10 max-w-3xl border-t border-[#E2E7F0]">
          {copy.faq.items.map((item, i) => (
            <div key={item.question} className="border-b border-[#E2E7F0]">
              <button
                type="button"
                onClick={() => setOpen(open === i ? null : i)}
                aria-expanded={open === i}
                className="flex w-full items-center justify-between gap-4 py-5 text-left"
              >
                <span className="text-[16px] font-bold">{item.question}</span>
                <ChevronIcon
                  className={`h-5 w-5 shrink-0 text-[#E8264C] transition-transform ${
                    open === i ? "rotate-180" : ""
                  }`}
                />
              </button>
              {open === i && (
                <p className="-mt-1 pb-5 pr-10 text-[14px] leading-relaxed text-[#6B7793]">{item.answer}</p>
              )}
            </div>
          ))}
        </div>
      </Shell>
    </section>
  );
}

function CtaBanner({ copy, onClick }: { copy: (typeof TAJEX_COPY)["nl"]; onClick: () => void }) {
  return (
    <section className="bg-white pb-16 sm:pb-20">
      <Shell>
        <div className="relative flex flex-col items-start justify-between gap-6 overflow-hidden rounded-2xl bg-[#131B3E] p-9 sm:p-11 lg:flex-row lg:items-center">
          <span className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full bg-[#E8264C] opacity-25 blur-3xl" />
          <div className="relative">
            <p className="text-[24px] font-extrabold leading-tight tracking-[-0.02em] text-white sm:text-[28px]">
              {copy.ctaBanner.title}
            </p>
            <p className="mt-2 text-[14px] text-white/60">{copy.ctaBanner.body}</p>
          </div>
          <div className="relative">
            <RedButton onClick={onClick}>{copy.ctaBanner.button}</RedButton>
          </div>
        </div>
      </Shell>
    </section>
  );
}

function PostCard({
  post,
  onClick,
}: {
  post: (typeof TAJEX_COPY)["nl"]["blog"]["posts"][number];
  onClick?: () => void;
}) {
  const Wrapper = onClick ? "button" : "div";
  return (
    <Wrapper
      {...(onClick ? { type: "button" as const, onClick } : {})}
      className="group flex flex-col overflow-hidden rounded-2xl border border-[#E6EAF2] bg-white text-left transition-shadow hover:shadow-[0_18px_40px_-24px_rgba(15,23,41,0.35)]"
    >
      <div className="h-40 overflow-hidden">
        <PostScene variant={post.art} className="h-full w-full transition-transform duration-500 group-hover:scale-105" />
      </div>
      <div className="flex flex-1 flex-col p-6">
        <p className="font-tajex-mono text-[10px] uppercase tracking-[0.16em] text-[#E8264C]">
          {post.date} · {post.read}
        </p>
        <p className="mt-3 text-[15px] font-bold leading-snug tracking-[-0.01em]">{post.title}</p>
        <p className="mt-3 text-[13px] leading-relaxed text-[#6B7793]">{post.excerpt}</p>
      </div>
    </Wrapper>
  );
}

function ContactRow({
  icon,
  label,
  children,
}: {
  icon: string;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex gap-4">
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#F3F5FA] text-[#131B3E]">
        <ContactIcon name={icon} className="h-4 w-4" />
      </span>
      <div>
        <dt className="font-tajex-mono text-[10px] uppercase tracking-[0.16em] text-[#98A2B8]">{label}</dt>
        <dd className="mt-1.5 text-[15px] leading-relaxed text-[#0F1729]">{children}</dd>
      </div>
    </div>
  );
}

function FieldLabel({ children, required }: { children: React.ReactNode; required?: boolean }) {
  return (
    <label className="mb-2 block font-tajex-mono text-[10px] uppercase tracking-[0.16em] text-[#8B96AC]">
      {children}
      {required && <span className="ml-1 text-[#E8264C]">*</span>}
    </label>
  );
}

function FieldError({ children }: { children: React.ReactNode }) {
  return <p className="mt-1.5 text-[12px] text-[#E8264C]">{children}</p>;
}

function Field({
  label,
  value,
  onChange,
  error,
  required,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  required?: boolean;
  type?: string;
}) {
  return (
    <div>
      <FieldLabel required={required}>{label}</FieldLabel>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-xl border border-[#DCE2ED] bg-white px-4 py-3 text-[14px] text-[#0F1729] outline-none transition-colors focus:border-[#131B3E]"
      />
      {error && <FieldError>{error}</FieldError>}
    </div>
  );
}
