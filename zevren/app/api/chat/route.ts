import type { NextRequest } from "next/server";
import { z } from "zod";

import { LOCALES } from "@/lib/i18n/config";
import { askAssistant, type ChatTurn } from "@/lib/server/ai/chat";
import { buildSystemPrompt } from "@/lib/server/ai/knowledge";
import { verifyCsrf } from "@/lib/server/csrf";
import { chatConfigured, env } from "@/lib/server/env";
import {
  fail,
  ipIdentity,
  isSameOrigin,
  logError,
  logEvent,
  methodNotAllowed,
  ok,
  readJson,
  withErrorHandling,
} from "@/lib/server/http";
import { rateLimit } from "@/lib/server/rate-limit";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * The site assistant.
 *
 * Unlike the contact form, every call to this endpoint costs money, and it is
 * reachable by anyone who can load the page. So the ceilings here are not
 * politeness, they are the difference between a helpful widget and a bill:
 * a per-visitor burst limit, a much slower per-visitor hourly limit, a cap on
 * how much of a conversation is replayed, and a hard cap on message length.
 *
 * The API key is never sent to the browser and the browser never reaches the
 * provider: this route is the only thing that does, which is also why the
 * site's CSP still allows no third-party host.
 */

const MAX_MESSAGE_CHARS = 1500;
const MAX_TURNS = 12;

// History turns get a looser ceiling than the visitor's own message: the
// assistant's previous replies travel back through this schema, and a reply
// can legitimately be longer than what a visitor may type. Anything over the
// wire limit is truncated below rather than rejected, because rejecting the
// server's own earlier output would wedge the conversation for good.
const turnSchema = z.object({
  role: z.enum(["user", "assistant"]),
  content: z.string().min(1).max(8000),
});

const bodySchema = z.object({
  message: z.string().trim().min(1).max(MAX_MESSAGE_CHARS),
  history: z.array(turnSchema).max(MAX_TURNS).optional(),
  locale: z.enum(LOCALES).optional(),
  csrfToken: z.string().optional(),
});

export const POST = withErrorHandling("api.chat", async (request: NextRequest) => {
  if (!isSameOrigin(request)) return fail(403, "forbidden", "Request blocked.");

  if (!chatConfigured()) {
    return fail(503, "unavailable", "The assistant is not available right now.");
  }

  const identity = ipIdentity(request);

  // Two windows on purpose. The first stops a page from being hammered; the
  // second stops a patient script from spending all day on the budget.
  const burst = await rateLimit({
    scope: "chat:burst",
    identity,
    limit: 8,
    windowSeconds: 60,
  });
  if (!burst.allowed) {
    return fail(429, "rate_limited", "One moment, then try again.", {
      retryAfter: burst.retryAfterSeconds,
    });
  }

  const hourly = await rateLimit({
    scope: "chat:hourly",
    identity,
    limit: 40,
    windowSeconds: 3600,
  });
  if (!hourly.allowed) {
    return fail(429, "rate_limited", "You have reached the limit for now.", {
      retryAfter: hourly.retryAfterSeconds,
    });
  }

  // 12 turns plus a message at full length is ~20k characters, and Arabic
  // encodes at two bytes per character, so 32KB would reject an honest long
  // conversation in one of the site's own languages.
  const body = await readJson(request, 96 * 1024);
  if (body === null) return fail(400, "invalid_body", "Invalid request.");

  if (!(await verifyCsrf(request, body))) {
    return fail(403, "csrf", "Please reload the page and try again.");
  }

  const parsed = bodySchema.safeParse(body);
  if (!parsed.success) return fail(400, "invalid_body", "Invalid request.");

  const { message, history = [], locale = "nl" } = parsed.data;

  // Everything the provider spends here is real money, and per-visitor
  // buckets do not stop a caller who rotates addresses. One shared bucket
  // over the whole site is the actual ceiling on a day's bill.
  const daily = await rateLimit({
    scope: "chat:daily",
    identity: "site",
    limit: env().CHAT_DAILY_BUDGET,
    windowSeconds: 86400,
  });
  if (!daily.allowed) {
    return fail(503, "unavailable", "The assistant is not available right now.", {
      retryAfter: daily.retryAfterSeconds,
    });
  }

  // The client sends the history back, so it is visitor-controlled and cannot
  // be trusted as a record of what was said. That is acceptable: the system
  // prompt is authoritative, the model is told that message text is not
  // instruction, and nothing here reads or writes anyone's data.
  //
  // It also cannot be trusted to be well-formed. The provider rejects a
  // conversation whose roles do not alternate or that opens with an
  // assistant turn, and a failed send or a truncation produces exactly
  // those shapes. Repairing here means one bad round can never wedge the
  // conversation: keep the last turn of any same-role run, cap each turn's
  // length, and drop a leading assistant turn.
  const trimmed = history
    .slice(-MAX_TURNS)
    .map((turn) => ({ ...turn, content: turn.content.slice(0, MAX_MESSAGE_CHARS) }));
  const alternating: ChatTurn[] = [];
  for (const turn of trimmed) {
    if (alternating.length > 0 && alternating[alternating.length - 1]?.role === turn.role) {
      alternating[alternating.length - 1] = turn;
    } else {
      alternating.push(turn);
    }
  }
  while (alternating[0]?.role === "assistant") alternating.shift();
  if (alternating[alternating.length - 1]?.role === "user") alternating.pop();

  const turns: ChatTurn[] = [...alternating, { role: "user", content: message }];

  const result = await askAssistant(buildSystemPrompt(locale), turns);

  if (!result.ok) {
    // The provider's words go to the log, never to the visitor: a 401 tells
    // them nothing useful and tells an attacker something.
    logError("chat.failed", new Error(result.error ?? "unknown"));
    return fail(502, "upstream", "The assistant could not answer just now.");
  }

  logEvent("chat.answered", { locale, turns: turns.length });
  return ok({ reply: result.reply });
});

export const GET = async () => methodNotAllowed("POST");
export const PUT = GET;
export const PATCH = GET;
export const DELETE = GET;
export const OPTIONS = GET;
