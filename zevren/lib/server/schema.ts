import {
  boolean,
  index,
  integer,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  uuid,
} from "drizzle-orm/pg-core";

/**
 * Every table is written through Drizzle, which emits parameterised SQL. No
 * query in this codebase concatenates user input into a statement, so the
 * submission text can contain quotes, semicolons or SQL keywords without
 * being interpreted as anything but data.
 */

export const submissions = pgTable(
  "submissions",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    /** "contact" for a plain message, "project" for a project brief. */
    kind: text("kind").notNull(),
    name: text("name").notNull(),
    email: text("email").notNull(),
    company: text("company"),
    needs: text("needs"),
    budget: text("budget"),
    message: text("message").notNull(),
    /** sha256 of kind+email+message, used to collapse duplicate submits. */
    fingerprint: text("fingerprint").notNull(),
    /** Truncated / hashed client metadata, kept for abuse investigation. */
    ipHash: text("ip_hash"),
    userAgent: text("user_agent"),
    locale: text("locale"),
    /** Set when the submission arrived through a campaign, e.g. "founding-10". */
    campaign: text("campaign"),
    status: text("status").notNull().default("new"),
    emailedAt: timestamp("emailed_at", { withTimezone: true }),
    emailError: text("email_error"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => ({
    createdIdx: index("submissions_created_idx").on(t.createdAt),
    fingerprintIdx: index("submissions_fingerprint_idx").on(t.fingerprint, t.createdAt),
    campaignIdx: index("submissions_campaign_idx").on(t.campaign),
  })
);

/**
 * Founding 10 spots that have actually been taken. Only staff write here, so
 * the public counter cannot be moved by anyone filling in a form.
 */
export const foundingClaims = pgTable(
  "founding_claims",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    submissionId: uuid("submission_id").references(() => submissions.id, {
      onDelete: "set null",
    }),
    businessName: text("business_name").notNull(),
    note: text("note"),
    claimedAt: timestamp("claimed_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => ({
    claimedIdx: index("founding_claims_claimed_idx").on(t.claimedAt),
    submissionIdx: uniqueIndex("founding_claims_submission_idx").on(t.submissionId),
  })
);

export const adminUsers = pgTable(
  "admin_users",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    email: text("email").notNull(),
    /** scrypt derived key, stored as scrypt$N$r$p$salt$hash. Never the password. */
    passwordHash: text("password_hash").notNull(),
    role: text("role").notNull().default("admin"),
    disabled: boolean("disabled").notNull().default(false),
    lastLoginAt: timestamp("last_login_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => ({
    emailIdx: uniqueIndex("admin_users_email_idx").on(t.email),
  })
);

export const sessions = pgTable(
  "sessions",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    /** sha256(token + AUTH_SECRET). The raw token only ever lives in the cookie. */
    tokenHash: text("token_hash").notNull(),
    userId: uuid("user_id")
      .notNull()
      .references(() => adminUsers.id, { onDelete: "cascade" }),
    ipHash: text("ip_hash"),
    userAgentHash: text("user_agent_hash"),
    /** Hard cut-off regardless of activity. */
    expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
    /** Sliding window, refreshed on use. */
    idleExpiresAt: timestamp("idle_expires_at", { withTimezone: true }).notNull(),
    revokedAt: timestamp("revoked_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => ({
    tokenIdx: uniqueIndex("sessions_token_idx").on(t.tokenHash),
    userIdx: index("sessions_user_idx").on(t.userId),
  })
);

/** Fixed-window counters, shared across serverless instances via the database. */
export const rateLimits = pgTable(
  "rate_limits",
  {
    /** bucket key: scope + identity, already hashed. */
    key: text("key").primaryKey(),
    count: integer("count").notNull().default(0),
    windowStart: timestamp("window_start", { withTimezone: true }).notNull().defaultNow(),
    /** Set while a bucket is locked out, e.g. after repeated failed logins. */
    blockedUntil: timestamp("blocked_until", { withTimezone: true }),
  }
);

/** Append-only trail of security-relevant events. */
export const auditLog = pgTable(
  "audit_log",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    event: text("event").notNull(),
    actor: text("actor"),
    ipHash: text("ip_hash"),
    detail: text("detail"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => ({
    createdIdx: index("audit_log_created_idx").on(t.createdAt),
  })
);

export type Submission = typeof submissions.$inferSelect;
export type AdminUser = typeof adminUsers.$inferSelect;
export type Session = typeof sessions.$inferSelect;
