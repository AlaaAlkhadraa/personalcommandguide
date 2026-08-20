import "server-only";

import { z } from "zod";

/**
 * Server-side configuration. Every secret lives here and nowhere else.
 *
 * Nothing in this file may ever be imported from a client component: the
 * `server-only` import above turns that into a build error rather than a
 * silent leak of secrets into the browser bundle. No value is prefixed with
 * NEXT_PUBLIC_, so Next will not inline any of it either.
 */

const bool = z
  .enum(["true", "false", "1", "0"])
  .transform((v) => v === "true" || v === "1");

const schema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),

  /**
   * Postgres connection string. Required in production; without it the app
   * still renders but every write endpoint fails closed with a 503 instead of
   * silently accepting and dropping submissions.
   *
   * POSTGRES_URL is the name Vercel's Postgres integration injects, so both
   * are accepted and DATABASE_URL wins when they disagree. Neither is ever
   * sent to the client or written to a log.
   */
  DATABASE_URL: z.string().min(1).optional(),
  POSTGRES_URL: z.string().min(1).optional(),

  /**
   * Local development and the test suite can run against an embedded Postgres
   * (PGlite) so no server is needed. Refused in production: see `assertProd`.
   */
  DATABASE_DRIVER: z.enum(["postgres", "pglite"]).default("postgres"),
  PGLITE_DATA_DIR: z.string().min(1).default("./.pglite"),

  /**
   * 32+ byte random string, used to derive the CSRF token HMAC key and to
   * pepper session token hashing. Rotating it invalidates all sessions.
   */
  AUTH_SECRET: z.string().min(32).optional(),

  /** Absolute session lifetime and idle timeout, in seconds. */
  SESSION_ABSOLUTE_TTL: z.coerce.number().int().positive().default(60 * 60 * 8),
  SESSION_IDLE_TTL: z.coerce.number().int().positive().default(60 * 30),

  /** Transactional email. When unset, submissions are stored but not mailed. */
  RESEND_API_KEY: z.string().min(1).optional(),
  CONTACT_INBOX_EMAIL: z.string().email().optional(),
  MAIL_FROM: z.string().min(3).default("ZEVREN website <noreply@zevren.nl>"),

  /**
   * Canonical origin. Used for the Origin/Referer check on state-changing
   * requests and to decide whether Secure cookies can be set.
   */
  APP_ORIGIN: z.string().url().optional(),

  /** Set to true only behind a trusted proxy that rewrites x-forwarded-for. */
  TRUST_PROXY: bool.default("true"),

  /**
   * Anthropic API key for the site assistant. Without it the assistant is
   * not rendered at all, so the site behaves exactly as it did before it
   * existed. Never reaches the browser: every message is proxied through
   * /api/chat.
   */
  ANTHROPIC_API_KEY: z.string().min(1).optional(),

  /** Model serving the assistant. Small and fast is right for this job. */
  CHAT_MODEL: z.string().min(1).default("claude-haiku-4-5-20251001"),

  /**
   * Hard ceilings, because this endpoint spends money on every call and it
   * is reachable by anyone who can open the site.
   */
  CHAT_MAX_TOKENS: z.coerce.number().int().positive().max(4096).default(700),
  CHAT_DAILY_BUDGET: z.coerce.number().int().positive().default(400),
});

export type ServerEnv = z.infer<typeof schema>;

function read(): ServerEnv {
  const parsed = schema.safeParse(process.env);
  if (!parsed.success) {
    // Never echo the offending values: they are secrets.
    const keys = Object.keys(parsed.error.flatten().fieldErrors).join(", ");
    throw new Error(`Invalid server environment. Check: ${keys}`);
  }
  return {
    ...parsed.data,
    DATABASE_URL: parsed.data.DATABASE_URL ?? parsed.data.POSTGRES_URL,
  };
}

let cached: ServerEnv | null = null;

export function env(): ServerEnv {
  if (!cached) cached = read();
  return cached;
}

/** True when the site assistant can run. */
export function chatConfigured(): boolean {
  return Boolean(env().ANTHROPIC_API_KEY);
}

/** True when the app has everything it needs to persist submissions. */
export function hasDatabase(): boolean {
  const e = env();
  return e.DATABASE_DRIVER === "pglite" || Boolean(e.DATABASE_URL);
}

export function isProduction(): boolean {
  return env().NODE_ENV === "production";
}

/**
 * Fails fast on a misconfigured production deployment rather than running in a
 * degraded, insecure state. Called from the server entrypoints that need it.
 */
export function assertProductionConfig(): void {
  const e = env();
  if (e.NODE_ENV !== "production") return;
  const missing: string[] = [];
  if (e.DATABASE_DRIVER !== "postgres") missing.push("DATABASE_DRIVER must be postgres");
  if (!e.DATABASE_URL) missing.push("DATABASE_URL or POSTGRES_URL");
  if (!e.AUTH_SECRET) missing.push("AUTH_SECRET");
  if (!e.APP_ORIGIN) missing.push("APP_ORIGIN");
  if (missing.length) {
    throw new Error(`Production configuration incomplete: ${missing.join(", ")}`);
  }
}

/** Secret used for keyed hashing. Falls back only outside production. */
export function authSecret(): string {
  const e = env();
  if (e.AUTH_SECRET) return e.AUTH_SECRET;
  if (e.NODE_ENV === "production") {
    throw new Error("AUTH_SECRET is required in production.");
  }
  return "development-only-insecure-secret-do-not-use-in-production";
}
