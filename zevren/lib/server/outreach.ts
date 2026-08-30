import "server-only";

import { promises as fs } from "node:fs";
import path from "node:path";

import { ARTICLES } from "@/lib/insights/articles";

/**
 * Reads the outreach pipeline the agents maintain in `marketing/outreach/`,
 * one directory above the app.
 *
 * The agents write plain markdown and push; every push redeploys this site,
 * so this parser reading the files at request time is always looking at the
 * latest agreed state. Nothing here writes: the board shows, the owner acts,
 * and the ledger stays the administration.
 */

export interface ProspectCard {
  n: number;
  name: string;
  city: string;
  meta: [string, string][];
  subject: string;
  message: string;
  email: string;
  /** Best link to reach the business when no email is published. */
  contactUrl: string;
  /** What that link opens: a site, an Instagram page, or a search. */
  contactLabel: string;
  status: "approved" | "confirmed" | "check" | "held" | "rejected";
  verdict?: string;
}

export interface OutreachBoardData {
  day: string;
  verifiedByAzzouz: boolean;
  /** Rejected cards never reach the board; only their count is reported. */
  rejected: number;
  stats: { drafted: number; sent: number; replied: number; afgevoerd: number };
  agents: { who: string; task: string; last: string }[];
  cards: ProspectCard[];
}

const OUTREACH_DIR = path.join(process.cwd(), "..", "marketing", "outreach");
const REPORTS_DIR = path.join(process.cwd(), "..", "marketing", "reports");

// The card number is usually "## N. Name", but one agent run wrote
// "## Kaart N — Name" instead — accept the optional "Kaart" word and any of
// ".", "-", "—" as the separator so that variant isn't silently dropped too.
const CARD_RE =
  /\n## (?:Kaart\s+)?(\d+)\s*[.—-]\s*(.+?)\n([\s\S]*?)(?=\n## (?:Kaart\s+)?\d+\s*[.—-]|$)/g;
// A domain-looking token in the card's metadata: `x.wixsite.com/y`,
// trimsalonwof.nl, https://... — the first hit becomes the contact link.
const URL_RE = /(?:https?:\/\/)?((?:[a-z0-9-]+\.)+[a-z]{2,}(?:\/[\w\-./]*)?)/gi;
const ADDRESS_RE = /[\w.+-]+@[\w-]+\.[\w.-]*[\w]/;
const IG_RE = /instagram[^@\n]{0,60}@([a-z0-9._]{2,30})/i;
// Guide entries a card happens to mention are no way to reach the owner;
// booking pages (Salonized, Treatwell, Fresha) very much are, so those stay.
const DIRECTORY_RE =
  /^(?:www\.)?(?:bottin|nicelocal|wheree|opendi|cylex|yelp|trustoo|telefoonboek|detelefoongids|goudengids|zoekbedrijf|kvk|maps\.google|google)\./i;
// A meta value may wrap over several indented lines, so the value runs until
// the next `- **key` or a blank line. `$` stays out of the lookahead: with
// the /m flag it would match at the first line break and cut every wrapped
// value off after one line. The separator between key and value drifts
// between agent runs — `**Key:**` and `**Key** —` both appear in the wild —
// so both are accepted rather than silently dropping a whole day's cards.
const META_RE = /^- \*\*(.+?):?\*\*\s*(?:[—-]\s*)?([\s\S]+?)(?=\n- \*\*|\n\n|(?![\s\S]))/gm;
const CODE_RE = /```\n([\s\S]*?)\n```/g;

function squash(text: string): string {
  return text.split(/\s+/).join(" ").trim();
}

/**
 * Every card needs one reachable link, also when the business publishes no
 * address at all: the owner still has to be able to open something. Own site
 * first, then the Instagram page the card names, and otherwise a search on
 * name plus city so the button is never missing.
 */
function contactLink(
  name: string,
  city: string,
  meta: [string, string][]
): { url: string; label: string } {
  const linkKeys = ["site nu", "current site", "signaalklasse", "check", "owner check", "reach"];
  const weight = (key: string) =>
    linkKeys.some((k) => key.toLowerCase().startsWith(k)) ? 0 : 1;
  const ordered = [...meta].sort((a, b) => weight(a[0]) - weight(b[0]));

  for (const [, value] of ordered) {
    // mailto-able addresses would otherwise be read as a domain.
    for (const hit of value.replace(/[\w.+-]+@[\w.-]+/g, "").matchAll(URL_RE)) {
      const domain = (hit[1] ?? "").replace(/[).,;`]+$/, "");
      if (!domain.includes(".") || DIRECTORY_RE.test(domain)) continue;
      return { url: `https://${domain}`, label: "Contactpagina" };
    }
  }
  for (const [, value] of ordered) {
    const handle = IG_RE.exec(value)?.[1];
    if (handle) {
      return { url: `https://www.instagram.com/${handle}/`, label: "Instagram" };
    }
  }
  const query = encodeURIComponent(`${name} ${city} contact`.trim());
  return { url: `https://www.google.com/search?q=${query}`, label: "Zoek contact" };
}

function parseCards(text: string): ProspectCard[] {
  const cards: ProspectCard[] = [];
  for (const m of ("\n" + text).matchAll(CARD_RE)) {
    const body = m[3] ?? "";
    const title = (m[2] ?? "").trim();
    const [name, city = ""] = title.split(" — ");
    const meta: [string, string][] = [];
    for (const mm of body.matchAll(META_RE)) {
      meta.push([squash(mm[1] ?? ""), squash(mm[2] ?? "")]);
    }
    const codes = [...body.matchAll(CODE_RE)].map((c) => (c[1] ?? "").trim());
    if (codes.length < 2) continue;
    const emailRaw = meta.find(([k]) => k.toLowerCase().startsWith("e-mail"))?.[1] ?? "";
    // The line reads `info@salon.nl (uit de bedrijfsvermelding)`; only the
    // address itself may reach the mailto, or the mail app opens a recipient
    // with the source note glued to it.
    const email = (ADDRESS_RE.exec(emailRaw)?.[0] ?? "").replace(/[).,;]+$/, "");
    // The board exists to send from. A card without a published address
    // costs the owner a search instead of saving him one, so it does not
    // belong here: the agents park those in `geen-emailadres.md`.
    if (!email) continue;
    const contact = contactLink((name ?? "").trim(), city.trim(), meta);
    const confirmed = meta.some(
      ([k]) => k.toLowerCase() === "actief" || k.toLowerCase().startsWith("actief bevestigd")
    );
    cards.push({
      n: Number(m[1]),
      name: (name ?? "").trim(),
      city: city.trim(),
      meta,
      subject: codes[0] ?? "",
      message: codes[1] ?? "",
      email,
      contactUrl: contact.url,
      contactLabel: contact.label,
      status: confirmed ? "confirmed" : "check",
    });
  }
  return cards;
}

// Azzouz opens a verdict with one of these words. "AANGEPAST — daarna
// goedgekeurd" counts as approved: the rewritten copy below it is the point.
const VERDICT_RE = /\b(afgekeurd|goedgekeurd|aangehouden)\b/i;

/**
 * Overlays Azzouz's verdicts onto Sam's cards, matched by business name.
 *
 * Only the head of a section decides: his file ends with a summary table that
 * repeats every AFGEKEURD row, and that table falls inside the last card's
 * section. Reading the whole section would stamp the final approved card as
 * rejected.
 */
function mergeVerified(cards: ProspectCard[], text: string): void {
  const sections = ("\n" + text).split("\n## ");
  for (const card of cards) {
    const section = sections.find((s) =>
      (s.split("\n")[0] ?? "").toLowerCase().includes(card.name.toLowerCase())
    );
    if (!section) continue;
    const head = section.slice(0, 700);
    const verdict = VERDICT_RE.exec(head)?.[1]?.toLowerCase();
    if (!verdict) continue;
    const after = head.slice((VERDICT_RE.exec(head)?.index ?? 0) + verdict.length);
    // Trims the leftovers of "**GOEDGEKEURD, zonder wijziging.**" down to the
    // sentence the owner actually needs to read.
    card.verdict = squash(after.replace(/\*\*/g, "").replace(/^[.,:;\s—-]+/, "")).slice(0, 300);
    if (verdict === "afgekeurd") {
      card.status = "rejected";
    } else if (verdict === "aangehouden") {
      card.status = "held";
    } else {
      card.status = "approved";
      const codes = [...section.matchAll(CODE_RE)].map((c) => (c[1] ?? "").trim());
      if (codes.length >= 2) {
        card.subject = codes[0] ?? card.subject;
        card.message = codes[1] ?? card.message;
      }
    }
  }
}

async function ledgerStats(): Promise<OutreachBoardData["stats"]> {
  const stats = { drafted: 0, sent: 0, replied: 0, afgevoerd: 0 };
  try {
    const text = await fs.readFile(path.join(OUTREACH_DIR, "contacted.md"), "utf8");
    for (const line of text.split("\n")) {
      if (!line.startsWith("|") || line.startsWith("| Business") || line.startsWith("|---")) continue;
      const status = (line.split("|")[3] ?? "").trim().toLowerCase();
      if (status.startsWith("drafted")) stats.drafted += 1;
      else if (status.startsWith("sent")) stats.sent += 1;
      else if (status.startsWith("replied")) stats.replied += 1;
      else if (status) stats.afgevoerd += 1;
    }
  } catch {
    // No ledger reachable in this deployment; the board shows zeros.
  }
  return stats;
}

async function newestDate(dir: string, filter: (name: string) => boolean): Promise<string> {
  try {
    const names = (await fs.readdir(dir)).filter((n) => /^20\d\d-\d\d-\d\d/.test(n) && filter(n));
    return names.sort().at(-1)?.slice(0, 10) ?? "nooit";
  } catch {
    return "nooit";
  }
}

export async function readOutreachBoard(): Promise<OutreachBoardData> {
  let names: string[] = [];
  try {
    names = (await fs.readdir(OUTREACH_DIR)).filter(
      (n) => /^20\d\d-\d\d-\d\d/.test(n) && n.endsWith(".md")
    );
  } catch {
    // Directory not shipped with this deployment; render the empty state.
  }

  const dailyNames = names.filter((n) => !n.includes("verified"));
  let day = "";
  let cards: ProspectCard[] = [];
  for (const date of [...new Set(dailyNames.map((n) => n.slice(0, 10)))].sort().reverse()) {
    const files = dailyNames.filter((n) => n.startsWith(date)).sort();
    const collected: ProspectCard[] = [];
    for (const file of files) {
      collected.push(...parseCards(await fs.readFile(path.join(OUTREACH_DIR, file), "utf8")));
    }
    if (collected.length > 0) {
      day = date;
      cards = collected.map((card, index) => ({ ...card, n: index + 1 }));
      break;
    }
  }

  let verifiedByAzzouz = false;
  if (day) {
    for (const file of names.filter((n) => n.startsWith(day) && n.includes("verified")).sort()) {
      mergeVerified(cards, await fs.readFile(path.join(OUTREACH_DIR, file), "utf8"));
      verifiedByAzzouz = true;
    }
  }

  // A rejected card is work the owner must not do: Azzouz found a false claim,
  // a business that already solved the problem, or one outside the profile.
  // Showing it costs him the reading time the board exists to save, so it is
  // dropped here and only counted. The reason stays in the verdict file.
  const rejected = cards.filter((c) => c.status === "rejected").length;
  cards = cards.filter((c) => c.status !== "rejected").map((card, index) => ({
    ...card,
    n: index + 1,
  }));

  const newestArticle = [...ARTICLES].sort((a, b) => a.date.localeCompare(b.date)).at(-1);
  const agents = [
    { who: "Sam", task: "dagelijks 10+ prospects (07:03)", last: day || "nooit" },
    {
      who: "Azzouz — verificatie",
      task: "dagelijkse controle (08:30)",
      last: await newestDate(OUTREACH_DIR, (n) => n.includes("verified")),
    },
    { who: "John", task: "weekpack + artikel (ma)", last: newestArticle?.date ?? "nooit" },
    {
      who: "Azzouz — weekrapport",
      task: "zondag 17:00",
      last: await newestDate(REPORTS_DIR, () => true),
    },
  ];

  return { day: day || "geen", verifiedByAzzouz, rejected, stats: await ledgerStats(), agents, cards };
}
