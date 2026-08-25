"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

import type { OutreachBoardData, ProspectCard } from "@/lib/server/outreach";

/**
 * The daily outreach board: today's prospects with their verdicts, the
 * pipeline counters, and per prospect the finished email plus an Open-in-Mail
 * button. Sending stays a human act; the "verzonden" ticks live only in this
 * browser as a memory aid, while contacted.md remains the administration.
 */

const STATUS: Record<ProspectCard["status"], { label: string; cls: string }> = {
  approved: { label: "Goedgekeurd", cls: "bg-emerald-500/15 text-emerald-300" },
  confirmed: { label: "Actief bevestigd", cls: "bg-emerald-500/15 text-emerald-300" },
  check: { label: "Te checken", cls: "bg-amber-500/15 text-amber-300" },
  held: { label: "Aangehouden", cls: "bg-sky-500/15 text-sky-300" },
  rejected: { label: "Afgekeurd", cls: "bg-red-500/15 text-red-300" },
};

const FILTERS = [
  { key: "all", label: "Alle" },
  { key: "approved", label: "Goedgekeurd" },
  { key: "confirmed", label: "Bevestigd" },
  { key: "check", label: "Te checken" },
  { key: "held", label: "Aangehouden" },
  { key: "rejected", label: "Afgekeurd" },
] as const;

type FilterKey = (typeof FILTERS)[number]["key"];

export function OutreachBoard({ data }: { data: OutreachBoardData }) {
  const [filter, setFilter] = useState<FilterKey>("all");
  const [sent, setSent] = useState<Record<number, boolean>>({});

  const storageKey = useCallback((n: number) => `zvo.${data.day}.${n}`, [data.day]);

  useEffect(() => {
    const restored: Record<number, boolean> = {};
    try {
      for (const card of data.cards) {
        if (localStorage.getItem(storageKey(card.n)) === "1") restored[card.n] = true;
      }
    } catch {
      // Storage unavailable; ticks simply start empty.
    }
    setSent(restored);
  }, [data.cards, storageKey]);

  const toggleSent = (n: number) => {
    setSent((current) => {
      const next = { ...current, [n]: !current[n] };
      try {
        localStorage.setItem(storageKey(n), next[n] ? "1" : "0");
      } catch {
        // Memory-only fallback is fine.
      }
      return next;
    });
  };

  const visible = useMemo(
    () => data.cards.filter((c) => filter === "all" || c.status === filter),
    [data.cards, filter]
  );
  const ready = data.cards.filter((c) => c.status !== "rejected").length;
  const sentToday = data.cards.filter((c) => sent[c.n]).length;

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-heading text-2xl font-semibold text-white">Outreach</h1>
        <p className="mt-1 text-sm text-muted">
          Dag {data.day} ·{" "}
          {data.verifiedByAzzouz ? "door Azzouz geverifieerd" : "nog niet door Azzouz geverifieerd"}
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
        <Tile value={ready} label="vandaag klaar" />
        <Tile value={sentToday} label="vandaag verzonden" />
        <Tile value={data.stats.drafted} label="pipeline drafted" />
        <Tile value={data.stats.sent} label="totaal verzonden" />
        <Tile value={data.stats.replied} label="reacties" />
      </div>

      <div className="overflow-x-auto rounded-2xl border border-white/10 bg-surface/50">
        <table className="w-full min-w-[28rem] text-sm">
          <thead>
            <tr className="text-left text-xs uppercase tracking-wide text-muted">
              <th className="px-4 py-3">Agent</th>
              <th className="px-4 py-3">Taak</th>
              <th className="px-4 py-3">Laatste levering</th>
            </tr>
          </thead>
          <tbody>
            {data.agents.map((agent) => (
              <tr key={agent.who} className="border-t border-white/5 text-white/90">
                <td className="px-4 py-2.5">{agent.who}</td>
                <td className="px-4 py-2.5 text-muted">{agent.task}</td>
                <td className="px-4 py-2.5 tabular-nums">{agent.last}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="sticky top-0 z-10 -mx-2 flex flex-wrap gap-2 bg-navy/95 px-2 py-3 backdrop-blur">
        {FILTERS.map((f) => (
          <button
            key={f.key}
            type="button"
            onClick={() => setFilter(f.key)}
            aria-pressed={filter === f.key}
            className={`rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors ${
              filter === f.key
                ? "border-white bg-white text-navy"
                : "border-white/15 text-white/80 hover:bg-white/5"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {data.cards.length === 0 && (
        <p className="rounded-2xl border border-white/10 bg-surface/50 p-8 text-sm text-muted">
          Geen prospectbestanden gevonden in deze deployment.
        </p>
      )}

      <div className="flex flex-col gap-4">
        {visible.map((card) => (
          <Card
            key={card.n}
            card={card}
            isSent={Boolean(sent[card.n])}
            onToggleSent={() => toggleSent(card.n)}
          />
        ))}
      </div>

      <p className="text-xs leading-relaxed text-muted">
        Elke kaart hier heeft een geverifieerd e-mailadres; prospects zonder openbaar adres
        komen niet op het bord. “Open in Mail” vult uw mailapp met onderwerp en bericht en
        zet de kaart meteen op verzonden; versturen doet u zelf, gespreid over de dag. Het
        vinkje is een geheugensteun op dit apparaat — de administratie blijft contacted.md.
      </p>
    </div>
  );
}

function Tile({ value, label }: { value: number; label: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-surface/50 px-4 py-3">
      <div className="font-heading text-2xl font-semibold tabular-nums text-white">{value}</div>
      <div className="mt-0.5 text-[11px] uppercase tracking-wide text-muted">{label}</div>
    </div>
  );
}

function Card({
  card,
  isSent,
  onToggleSent,
}: {
  card: ProspectCard;
  isSent: boolean;
  onToggleSent: () => void;
}) {
  const status = STATUS[card.status];
  const mailHref = card.email
    ? `mailto:${encodeURIComponent(card.email)}?subject=${encodeURIComponent(card.subject)}&body=${encodeURIComponent(card.message)}`
    : null;

  return (
    <article
      className={`rounded-2xl border bg-surface/50 p-5 ${
        card.status === "rejected" ? "border-dashed border-white/15" : "border-white/10"
      } ${isSent ? "opacity-55" : ""}`}
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="font-heading text-lg font-semibold text-white">
            <span className="mr-2 tabular-nums text-muted">{card.n}</span>
            {card.name}
          </h2>
          <p className="mt-0.5 text-sm text-muted">{card.city}</p>
        </div>
        <span className={`rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-wide ${status.cls}`}>
          {status.label}
        </span>
      </div>

      {card.verdict && (
        <p className="mt-3 border-s-2 border-white/20 ps-3 text-sm text-muted">{card.verdict}</p>
      )}

      <dl className="mt-4 grid grid-cols-1 gap-x-4 gap-y-1 text-sm sm:grid-cols-[auto_minmax(0,1fr)]">
        <dt className="text-muted sm:whitespace-nowrap">E-mail</dt>
        <dd className="min-w-0 break-all font-mono text-[13px] text-white/90">
          {card.email || "niet gevonden"}
        </dd>
        {card.meta
          .filter(([k]) => !k.toLowerCase().startsWith("e-mail"))
          .map(([k, v]) => (
            <FragmentRow key={k} k={k} v={v} />
          ))}
      </dl>

      <CopyBlock label="Onderwerp" text={card.subject} />
      <CopyBlock label="Bericht" text={card.message} />

      <div className="mt-4 flex flex-wrap gap-2">
        {mailHref && (
          <a
            href={mailHref}
            // One press does both: the mail app opens filled in, and the card
            // ticks itself off. The tick stays a toggle for the rare misfire.
            onClick={() => {
              if (!isSent) onToggleSent();
            }}
            className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-primary-light"
          >
            Open in Mail
          </a>
        )}
        {card.contactUrl && (
          <a
            href={card.contactUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={`rounded-lg px-4 py-2 text-sm font-semibold transition-colors ${
              mailHref
                ? "border border-white/15 text-white/80 hover:bg-white/5"
                : "bg-primary text-white hover:bg-primary-light"
            }`}
          >
            {card.contactLabel} ↗
          </a>
        )}
        <button
          type="button"
          onClick={onToggleSent}
          aria-pressed={isSent}
          className={`rounded-lg border px-4 py-2 text-sm font-semibold transition-colors ${
            isSent
              ? "border-emerald-400 bg-emerald-500/20 text-emerald-300"
              : "border-white/15 text-white/80 hover:bg-white/5"
          }`}
        >
          Verzonden ✓
        </button>
      </div>
    </article>
  );
}

function FragmentRow({ k, v }: { k: string; v: string }) {
  return (
    <>
      <dt className="mt-2 text-muted first:mt-0 sm:mt-0 sm:whitespace-nowrap">{k}</dt>
      <dd className="min-w-0 break-words text-white/90">{v}</dd>
    </>
  );
}

function CopyBlock({ label, text }: { label: string; text: string }) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      const area = document.createElement("textarea");
      area.value = text;
      document.body.appendChild(area);
      area.select();
      try {
        document.execCommand("copy");
      } catch {
        // Nothing else to fall back to.
      }
      area.remove();
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="mt-4">
      <div className="mb-1.5 flex items-center justify-between gap-3">
        <span className="text-[11px] font-semibold uppercase tracking-wide text-muted">{label}</span>
        <button
          type="button"
          onClick={() => void copy()}
          className={`rounded-md border px-2.5 py-1 text-xs font-semibold transition-colors ${
            copied
              ? "border-emerald-400 text-emerald-300"
              : "border-white/15 text-accent hover:bg-white/5"
          }`}
        >
          {copied ? "Gekopieerd" : "Kopieer"}
        </button>
      </div>
      <pre className="overflow-x-auto whitespace-pre-wrap break-words rounded-xl border border-white/10 bg-navy/70 p-3.5 font-mono text-[13px] leading-relaxed text-white/90">
        {text}
      </pre>
    </div>
  );
}
