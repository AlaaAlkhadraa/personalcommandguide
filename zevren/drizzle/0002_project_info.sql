-- Structured project detail, separate from the visitor's message.
--
-- Nullable and additive: existing rows keep working, and the column is only
-- written through the same validated pipeline as every other field.

ALTER TABLE "submissions" ADD COLUMN IF NOT EXISTS "project_info" text;
