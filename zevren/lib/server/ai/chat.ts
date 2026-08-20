import "server-only";

import { env } from "@/lib/server/env";
import { logError } from "@/lib/server/http";

/**
 * One call to the model, with the ceilings that keep a public endpoint from
 * turning into an open tap on someone else's card.
 *
 * The key never leaves this process. The browser talks to /api/chat, which
 * talks here; nothing about the provider is reachable from the page, so the
 * site's Content-Security-Policy needs no third-party host.
 */

export interface ChatTurn {
  role: "user" | "assistant";
  content: string;
}

export interface ChatResult {
  ok: boolean;
  reply?: string;
  /** Provider's own words, for the server log. Never sent to the browser. */
  error?: string;
}

const API_URL = "https://api.anthropic.com/v1/messages";
const API_VERSION = "2023-06-01";

/** A slow provider must not hold a serverless function open indefinitely. */
const TIMEOUT_MS = 25_000;

export async function askAssistant(
  system: string,
  turns: ChatTurn[]
): Promise<ChatResult> {
  const e = env();
  if (!e.ANTHROPIC_API_KEY) return { ok: false, error: "ANTHROPIC_API_KEY is not set" };

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);

  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-api-key": e.ANTHROPIC_API_KEY,
        "anthropic-version": API_VERSION,
      },
      body: JSON.stringify({
        model: e.CHAT_MODEL,
        max_tokens: e.CHAT_MAX_TOKENS,
        system,
        messages: turns,
      }),
      signal: controller.signal,
    });

    if (!response.ok) {
      // Carry the provider's own message. A 401 and a 429 need different
      // fixes, and "request failed" tells the owner neither.
      const body = await response.text().catch(() => "");
      let detail = body.slice(0, 400);
      try {
        const parsed = JSON.parse(body) as { error?: { message?: string } };
        if (parsed.error?.message) detail = parsed.error.message;
      } catch {
        // Not JSON. The truncated body is the best detail available.
      }
      return { ok: false, error: `${response.status}: ${detail}` };
    }

    const data = (await response.json()) as {
      content?: { type: string; text?: string }[];
    };
    const reply = (data.content ?? [])
      .filter((block) => block.type === "text" && block.text)
      .map((block) => block.text as string)
      .join("")
      .trim();

    if (!reply) return { ok: false, error: "Empty completion" };
    return { ok: true, reply };
  } catch (error) {
    const aborted = error instanceof Error && error.name === "AbortError";
    logError("chat.request_failed", error);
    return { ok: false, error: aborted ? "Timed out" : "Network error" };
  } finally {
    clearTimeout(timer);
  }
}
