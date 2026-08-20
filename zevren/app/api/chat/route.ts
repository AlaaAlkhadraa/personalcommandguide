import type { NextRequest } from "next/server";
import { z } from "zod";

import { LOCALES } from "@/lib/i18n/config";
import { askAssistant, type ChatTurn } from "@/lib/server/ai/chat";
import { buildSystemPrompt } from "@/lib/server/ai/knowledge";
import { verifyCsrf } from "@/lib/server/csrf";
import { chatConfigured } from "@/lib/server/env";
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

const turnSchema = z.object({
  role: z.enum(["user", "assistant"]),
  content: z.string().min(1).max(MAX_MESSAGE_CHARS),
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

  const body = await readJson(request, 32 * 1024);
  if (body === null) return fail(400, "invalid_body", "Invalid request.");

  if (!(await verifyCsrf(request, body))) {
    return fail(403, "csrf", "Please reload the page and try again.");
  }

  const parsed = bodySchema.safeParse(body);
  if (!parsed.success) return fail(400, "invalid_body", "Invalid request.");

  const { message, history = [], locale = "nl" } = parsed.data;

  // The client sends the history back, so it is visitor-controlled and cannot
  // be trusted as a record of what was said. That is acceptable: the system
  // prompt is authoritative, the model is told that message text is not
  // instruction, and nothing here reads or writes anyone's data. Trimming to
  // the last few turns keeps the cost bounded either way.
  const turns: ChatTurn[] = [...history.slice(-MAX_TURNS), { role: "user", content: message }];

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
