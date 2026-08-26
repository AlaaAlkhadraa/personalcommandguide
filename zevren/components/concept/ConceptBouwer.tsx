"use client";

import { useMemo, useState } from "react";

import { SITE_CONFIG } from "@/lib/constants";

/**
 * The concept builder: a visitor picks a name, sector, style and palette,
 * watches a miniature homepage assemble itself, and sends the result as a
 * WhatsApp message or an email. Nothing is stored — the message IS the lead,
 * which is why both routes open the visitor's own apps.
 *
 * The chrome around the preview follows the site (navy, surface, primary);
 * the preview itself deliberately does not: it shows the visitor's palette,
 * not ours.
 */

const WHATSAPP_NUMMER = SITE_CONFIG.phone.replace(/[^0-9]/g, "");
const EMAIL_ADRES = SITE_CONFIG.email;

const PALETTES = [
  { name: "Oceaan", bg: "#f4f8fb", ink: "#0e2a3d", accent: "#1f7ac2", card: "#dcebf5", darkCta: false },
  { name: "Terra", bg: "#faf6f1", ink: "#3a2a1e", accent: "#c96f3a", card: "#f0e2d4", darkCta: false },
  { name: "Bos", bg: "#f3f7f3", ink: "#1d3326", accent: "#2f7d4f", card: "#ddeadd", darkCta: false },
  { name: "Nacht", bg: "#14161c", ink: "#f2f3f6", accent: "#e0b45c", card: "#22252e", darkCta: true },
  { name: "Roze", bg: "#fdf5f7", ink: "#3d2230", accent: "#c8567e", card: "#f5dfe7", darkCta: false },
  { name: "Grafiet", bg: "#f5f5f4", ink: "#1c1c1e", accent: "#4a5cf0", card: "#e7e7ea", darkCta: false },
] as const;

const SECTOR_TEXT: Record<
  string,
  { label: string; eyebrow: string; h: string; p: string; b1: string; cards: string[] }
> = {
  restaurant: {
    label: "Restaurant / horeca",
    eyebrow: "Restaurant",
    h: " — eerlijk eten, elke dag vers",
    p: "Bekijk ons menu, reserveer een tafel of bestel online. Wij staan voor je klaar.",
    b1: "Reserveer een tafel",
    cards: ["Ons menu", "Reserveren", "Route"],
  },
  kapper: {
    label: "Kapper / salon",
    eyebrow: "Salon",
    h: " — jouw stijl, onze passie",
    p: "Maak eenvoudig online een afspraak en ontdek onze behandelingen.",
    b1: "Maak een afspraak",
    cards: ["Behandelingen", "Prijzen", "Afspraak"],
  },
  garage: {
    label: "Garage / autobedrijf",
    eyebrow: "Autobedrijf",
    h: " — vakwerk waar je op rijdt",
    p: "Onderhoud, APK en reparatie. Transparant, snel en betrouwbaar.",
    b1: "Plan een afspraak",
    cards: ["APK", "Onderhoud", "Contact"],
  },
  bouw: {
    label: "Bouw / klusbedrijf",
    eyebrow: "Bouw & klus",
    h: " — vakmanschap van fundering tot dak",
    p: "Van kleine klus tot complete verbouwing. Vraag vrijblijvend een offerte aan.",
    b1: "Vraag offerte aan",
    cards: ["Projecten", "Diensten", "Offerte"],
  },
  winkel: {
    label: "Winkel / retail",
    eyebrow: "Winkel",
    h: " — alles wat je zoekt, dichtbij",
    p: "Bekijk ons assortiment en kom langs in de winkel of bestel online.",
    b1: "Bekijk assortiment",
    cards: ["Assortiment", "Openingstijden", "Route"],
  },
  zorg: {
    label: "Zorg / praktijk",
    eyebrow: "Praktijk",
    h: " — zorg met aandacht",
    p: "Maak eenvoudig een afspraak en lees meer over onze behandelingen.",
    b1: "Maak een afspraak",
    cards: ["Behandelingen", "Team", "Afspraak"],
  },
  zzp: {
    label: "ZZP / dienstverlening",
    eyebrow: "Dienstverlening",
    h: " — professioneel en persoonlijk",
    p: "Ontdek wat ik voor jou kan betekenen en neem vrijblijvend contact op.",
    b1: "Neem contact op",
    cards: ["Diensten", "Werkwijze", "Contact"],
  },
  anders: {
    label: "Iets anders",
    eyebrow: "Welkom",
    h: " — professioneel online",
    p: "Een website die past bij jouw bedrijf en nieuwe klanten oplevert.",
    b1: "Neem contact op",
    cards: ["Over ons", "Diensten", "Contact"],
  },
};

const STIJLEN = [
  { key: "strak", label: "Strak & modern" },
  { key: "warm", label: "Warm & persoonlijk" },
  { key: "luxe", label: "Luxe & donker" },
] as const;

const PAGINAS = [
  "Home",
  "Over ons",
  "Contact",
  "Diensten",
  "Menu / prijzen",
  "Foto's",
  "Reviews",
  "Online afspraak",
];

type Stijl = (typeof STIJLEN)[number]["key"];

export function ConceptBouwer() {
  const [naam, setNaam] = useState("");
  const [sector, setSector] = useState("restaurant");
  const [stijl, setStijl] = useState<Stijl>("strak");
  const [palette, setPalette] = useState(0);
  const [pages, setPages] = useState<string[]>(["Home", "Over ons", "Contact"]);

  // Indexed access is checked in this codebase; both fall back to the first
  // entry so a stale key can never blank the preview.
  const p = PALETTES[palette] ?? PALETTES[0];
  const t = SECTOR_TEXT[sector] ?? SECTOR_TEXT.restaurant!;
  const bedrijf = naam.trim() || "Jouw bedrijf";
  const url = `www.${naam.trim() ? naam.trim().toLowerCase().replace(/[^a-z0-9]+/g, "") : "jouwbedrijf"}.nl`;

  const togglePage = (page: string) =>
    setPages((current) =>
      current.includes(page) ? current.filter((x) => x !== page) : [...current, page]
    );

  const bericht = useMemo(() => {
    const stijlLabel = STIJLEN.find((s) => s.key === stijl)?.label ?? stijl;
    return [
      "Hoi ZEVREN! Ik heb een concept gebouwd op jullie site:",
      "",
      `Bedrijf: ${naam.trim() || "(nog niet ingevuld)"}`,
      `Type: ${t.label}`,
      `Stijl: ${stijlLabel}`,
      `Kleuren: ${p.name}`,
      `Pagina's: ${pages.length ? pages.join(", ") : "(geen gekozen)"}`,
      "",
      "Ik ontvang graag een gratis voorstel!",
    ].join("\n");
  }, [naam, t.label, stijl, p.name, pages]);

  const waHref = `https://wa.me/${WHATSAPP_NUMMER}?text=${encodeURIComponent(bericht)}`;
  const mailHref = `mailto:${EMAIL_ADRES}?subject=${encodeURIComponent(
    `Concept-aanvraag: ${naam.trim() || "nieuw concept"}`
  )}&body=${encodeURIComponent(bericht)}`;

  // The preview is content, not chrome: its fonts and weights shift with the
  // chosen style the way the eventual site would.
  const previewFont =
    stijl === "warm" ? "Georgia, 'Times New Roman', serif" : "var(--font-inter), system-ui, sans-serif";
  const eyebrowTracking = stijl === "luxe" ? "0.28em" : "0.16em";
  const headingWeight = stijl === "luxe" ? 600 : stijl === "warm" ? 700 : 800;

  return (
    <div className="grid gap-8 lg:grid-cols-[420px_minmax(0,1fr)] lg:items-start">
      {/* ---------------- form ---------------- */}
      <div className="rounded-2xl border border-white/10 bg-surface/50 p-6 sm:p-7">
        <Step num="01" title="Hoe heet je bedrijf?">
          <input
            type="text"
            value={naam}
            maxLength={40}
            onChange={(e) => setNaam(e.target.value)}
            placeholder="Bijv. Bakkerij Janssen"
            className="w-full rounded-xl border border-white/15 bg-navy/60 px-4 py-3 text-[15px] text-white placeholder:text-muted focus:border-primary focus:outline-none"
          />
        </Step>

        <Step num="02" title="Wat voor bedrijf is het?">
          <select
            value={sector}
            onChange={(e) => setSector(e.target.value)}
            className="w-full appearance-none rounded-xl border border-white/15 bg-navy/60 bg-[url('data:image/svg+xml,%3Csvg%20xmlns=%27http://www.w3.org/2000/svg%27%20width=%2712%27%20height=%278%27%3E%3Cpath%20d=%27M1%201l5%205%205-5%27%20stroke=%27%2394a3b8%27%20stroke-width=%271.6%27%20fill=%27none%27/%3E%3C/svg%3E')] bg-[position:right_1rem_center] bg-no-repeat px-4 py-3 text-[15px] text-white focus:border-primary focus:outline-none"
          >
            {Object.entries(SECTOR_TEXT).map(([key, value]) => (
              <option key={key} value={key}>
                {value.label}
              </option>
            ))}
          </select>
        </Step>

        <Step num="03" title="Welke stijl past bij je?">
          <div className="grid grid-cols-3 gap-2">
            {STIJLEN.map((s) => (
              <button
                key={s.key}
                type="button"
                onClick={() => setStijl(s.key)}
                aria-pressed={stijl === s.key}
                className={`rounded-xl border px-2 py-2.5 text-[13px] font-semibold transition-colors ${
                  stijl === s.key
                    ? "border-primary bg-primary/15 text-accent"
                    : "border-white/15 text-white/80 hover:bg-white/5"
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>
        </Step>

        <Step num="04" title="Kies je kleuren">
          <div className="grid grid-cols-3 gap-2">
            {PALETTES.map((pal, i) => (
              <button
                key={pal.name}
                type="button"
                onClick={() => setPalette(i)}
                aria-pressed={palette === i}
                className={`overflow-hidden rounded-xl border-2 transition-colors ${
                  palette === i ? "border-white" : "border-transparent hover:border-white/30"
                }`}
              >
                <span className="flex h-9">
                  <span className="flex-1" style={{ background: pal.bg }} />
                  <span className="flex-1" style={{ background: pal.accent }} />
                  <span className="flex-1" style={{ background: pal.ink }} />
                </span>
                <span className="block bg-surface py-1 text-center text-[11px] font-semibold text-muted">
                  {pal.name}
                </span>
              </button>
            ))}
          </div>
        </Step>

        <Step num="05" title="Welke pagina's wil je?">
          <div className="grid grid-cols-2 gap-2">
            {PAGINAS.map((page) => {
              const active = pages.includes(page);
              return (
                <button
                  key={page}
                  type="button"
                  onClick={() => togglePage(page)}
                  aria-pressed={active}
                  className={`flex items-center gap-2 rounded-xl border px-3 py-2.5 text-left text-[13px] font-semibold transition-colors ${
                    active
                      ? "border-primary bg-primary/15 text-accent"
                      : "border-white/15 text-white/80 hover:bg-white/5"
                  }`}
                >
                  <span
                    className={`grid h-4 w-4 flex-shrink-0 place-items-center rounded border text-[10px] font-extrabold ${
                      active ? "border-primary bg-primary text-white" : "border-white/25 bg-navy/60"
                    }`}
                  >
                    {active ? "✓" : ""}
                  </span>
                  {page}
                </button>
              );
            })}
          </div>
        </Step>

        <a
          href={waHref}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-2 block w-full rounded-xl bg-primary px-6 py-4 text-center text-[15px] font-bold text-white transition-colors hover:bg-primary-light"
        >
          Vraag dit concept gratis aan via WhatsApp →
        </a>
        <a
          href={mailHref}
          className="mt-2 block w-full rounded-xl border border-white/15 px-6 py-3.5 text-center text-sm font-semibold text-white/85 transition-colors hover:bg-white/5"
        >
          Liever per e-mail
        </a>
        <p className="mt-3 text-center text-xs leading-relaxed text-muted">
          Je ontvangt binnen 48 uur een uitgewerkt voorstel. Gratis en vrijblijvend.
        </p>
      </div>

      {/* ---------------- preview ---------------- */}
      <div className="lg:sticky lg:top-24">
        <p className="mb-3 text-center text-[11px] font-semibold uppercase tracking-[0.2em] text-muted">
          Live voorbeeld van jouw homepage
        </p>
        <div className="overflow-hidden rounded-2xl border border-white/10 shadow-[0_24px_60px_-20px_rgba(0,0,0,0.6)]">
          <div className="flex items-center gap-1.5 bg-[#1b1f2a] px-4 py-2.5">
            <span className="h-2.5 w-2.5 rounded-full bg-[#f56]" />
            <span className="h-2.5 w-2.5 rounded-full bg-[#fb3]" />
            <span className="h-2.5 w-2.5 rounded-full bg-[#3c6]" />
            <span className="ml-2 flex-1 overflow-hidden text-ellipsis whitespace-nowrap rounded-md bg-navy/80 px-3 py-1 text-[11px] text-muted">
              {url}
            </span>
          </div>

          <div
            className="flex min-h-[430px] flex-col transition-colors duration-300"
            style={{ background: p.bg, color: p.ink, fontFamily: previewFont }}
          >
            <div className="flex items-center justify-between px-5 py-4 text-xs sm:px-6">
              <span className="text-sm font-extrabold">{bedrijf}</span>
              <span className="flex gap-3.5 opacity-75">
                {pages.slice(0, 4).map((page) => (
                  <span key={page} className="hidden first:inline sm:inline">
                    {page}
                  </span>
                ))}
              </span>
            </div>
            <div className="flex flex-1 flex-col justify-center px-5 pb-6 sm:px-6">
              <div
                className="mb-2.5 text-[10.5px] uppercase opacity-65"
                style={{ letterSpacing: eyebrowTracking }}
              >
                {t.eyebrow}
              </div>
              <div
                className="mb-2.5 max-w-[22ch] text-[clamp(22px,4vw,32px)] leading-[1.15] tracking-[-0.015em]"
                style={{ fontWeight: headingWeight }}
              >
                {bedrijf}
                {t.h}
              </div>
              <div className="mb-4 max-w-[40ch] text-[13px] opacity-80">{t.p}</div>
              <div className="flex flex-wrap gap-2.5">
                <span
                  className="rounded-lg px-4 py-2.5 text-[12.5px] font-bold"
                  style={{ background: p.accent, color: p.darkCta ? "#14161c" : "#ffffff" }}
                >
                  {t.b1}
                </span>
                <span className="rounded-lg border-[1.5px] border-current px-4 py-2.5 text-[12.5px] font-bold opacity-85">
                  Meer weten
                </span>
              </div>
            </div>
            <div className="flex gap-2.5 px-5 pb-5 sm:px-6">
              {t.cards.map((card) => (
                <div
                  key={card}
                  className="flex min-h-[56px] flex-1 items-end rounded-xl p-3 text-[11px] font-semibold"
                  style={{ background: p.card }}
                >
                  {card}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Step({ num, title, children }: { num: string; title: string; children: React.ReactNode }) {
  return (
    <div className="mb-6 last:mb-0">
      <div className="mb-2.5 flex items-baseline gap-2.5">
        <span className="text-xs font-bold text-accent">{num}</span>
        <span className="text-[15px] font-semibold text-white">{title}</span>
      </div>
      {children}
    </div>
  );
}
