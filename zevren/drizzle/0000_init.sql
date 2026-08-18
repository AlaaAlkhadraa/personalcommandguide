-- Initial schema for the ZEVREN backend.
-- Applied with `npm run db:migrate`, which runs each statement in one
-- transaction so a partial migration cannot be left behind.

-- Remove only the short-lived incompatible bootstrap table created before the
-- V2 source was restored. The old shape has password_salt; V2 never does.
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'admin_users'
      AND column_name = 'password_salt'
  ) THEN
    DROP TABLE IF EXISTS "admin_sessions";
    DROP TABLE IF EXISTS "contact_submissions";
    DROP TABLE IF EXISTS "admin_users" CASCADE;
    DROP TABLE IF EXISTS "schema_migrations";
  END IF;
END $$;

CREATE TABLE IF NOT EXISTS "admin_users" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "email" text NOT NULL,
  "password_hash" text NOT NULL,
  "role" text NOT NULL DEFAULT 'admin',
  "disabled" boolean NOT NULL DEFAULT false,
  "last_login_at" timestamptz,
  "created_at" timestamptz NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX IF NOT EXISTS "admin_users_email_idx" ON "admin_users" ("email");

CREATE TABLE IF NOT EXISTS "sessions" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "token_hash" text NOT NULL,
  "user_id" uuid NOT NULL REFERENCES "admin_users"("id") ON DELETE CASCADE,
  "ip_hash" text,
  "user_agent_hash" text,
  "expires_at" timestamptz NOT NULL,
  "idle_expires_at" timestamptz NOT NULL,
  "revoked_at" timestamptz,
  "created_at" timestamptz NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX IF NOT EXISTS "sessions_token_idx" ON "sessions" ("token_hash");
CREATE INDEX IF NOT EXISTS "sessions_user_idx" ON "sessions" ("user_id");

CREATE TABLE IF NOT EXISTS "submissions" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "kind" text NOT NULL,
  "name" text NOT NULL,
  "email" text NOT NULL,
  "company" text,
  "needs" text,
  "budget" text,
  "message" text NOT NULL,
  "fingerprint" text NOT NULL,
  "ip_hash" text,
  "user_agent" text,
  "locale" text,
  "status" text NOT NULL DEFAULT 'new',
  "emailed_at" timestamptz,
  "email_error" text,
  "created_at" timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS "submissions_created_idx" ON "submissions" ("created_at");
CREATE INDEX IF NOT EXISTS "submissions_fingerprint_idx" ON "submissions" ("fingerprint", "created_at");

CREATE TABLE IF NOT EXISTS "rate_limits" (
  "key" text PRIMARY KEY,
  "count" integer NOT NULL DEFAULT 0,
  "window_start" timestamptz NOT NULL DEFAULT now(),
  "blocked_until" timestamptz
);

CREATE TABLE IF NOT EXISTS "audit_log" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "event" text NOT NULL,
  "actor" text,
  "ip_hash" text,
  "detail" text,
  "created_at" timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS "audit_log_created_idx" ON "audit_log" ("created_at");
