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
  status: "approved" | "confirmed" | "check" | "rejected";
  verdict?: string;
}

export interface OutreachBoardData {
  day: string;
  verifiedByAzzouz: boolean;
  stats: { drafted: number; sent: number; replied: number; afgevoerd: number };
  agents: { who: string; task: string; last: string }[];
  cards: ProspectCard[];
}

const OUTREACH_DIR = path.join(process.cwd(), "..", "marketing", "outreach");
const REPORTS_DIR = path.join(process.cwd(), "..", "marketing", "reports");

const CARD_RE = /\n## (\d+)\. (.+?)\n([\s\S]*?)(?=\n## \d+\. |$)/g;
// A domain-looking token in the card's metadata: `x.wixsite.com/y`,
// trimsalonwof.nl, https://... — the first hit becomes the contact link.
const URL_RE = /(?:https?:\/\/)?((?:[a-z0-9-]+\.)+[a-z]{2,}(?:\/[\w\-./]*)?)/i;
const META_RE = /^- \*\*(.+?):\*\*\s*([\s\S]+?)(?=\n- \*\*|\n\n|$)/gm;
const CODE_RE = /```\n([\s\S]*?)\n```/g;

function squash(text: string): string {
  return text.split(/\s+/).join(" ").trim();
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
    // Prefer the site/check lines for the contact link; fall back to any
    // meta value carrying a domain. mailto-able addresses are excluded.
    let contactUrl = "";
    const linkKeys = ["site nu", "current site", "check", "owner check", "reach"];
    const ordered = [...meta].sort(
      (a, b) =>
        (linkKeys.some((k) => a[0].toLowerCase().startsWith(k)) ? 0 : 1) -
        (linkKeys.some((k) => b[0].toLowerCase().startsWith(k)) ? 0 : 1)
    );
    for (const [, value] of ordered) {
      const hit = URL_RE.exec(value.replace(/[\w.+-]+@[\w.-]+/g, ""));
      if (hit?.[1] && hit[1].includes(".")) {
        contactUrl = `https://${hit[1].replace(/[).,;`]+$/, "")}`;
        break;
      }
    }
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
      email: emailRaw.includes("@") ? emailRaw : "",
      contactUrl,
      status: confirmed ? "confirmed" : "check",
    });
  }
  return cards;
}

/** Overlays Azzouz's verdicts onto Sam's cards, matched by business name. */
function mergeVerified(cards: ProspectCard[], text: string): void {
  const sections = ("\n" + text).split("\n## ");
  for (const card of cards) {
    const section = sections.find((s) =>
      (s.split("\n")[0] ?? "").toLowerCase().includes(card.name.toLowerCase())
    );
    if (!section) continue;
    if (section.includes("AFGEKEURD")) {
      card.status = "rejected";
      card.verdict = squash(/AFGEKEURD[:\s—-]*(.+)/.exec(section)?.[1] ?? "").slice(0, 300);
    } else if (section.includes("GOEDGEKEURD")) {
      card.status = "approved";
      card.verdict = squash(/GOEDGEKEURD[:\s—-]*(.+)/.exec(section)?.[1] ?? "").slice(0, 300);
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

  return { day: day || "geen", verifiedByAzzouz, stats: await ledgerStats(), agents, cards };
}
