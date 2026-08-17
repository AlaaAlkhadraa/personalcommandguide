-- Founding 10 launch campaign.
--
-- A spot is claimed when a project actually starts, which is a decision a
-- person makes, so claims are their own rows rather than a counter derived
-- from incoming form submissions. Nothing on the public site can increment it.

ALTER TABLE "submissions" ADD COLUMN IF NOT EXISTS "campaign" text;

CREATE INDEX IF NOT EXISTS "submissions_campaign_idx" ON "submissions" ("campaign");

CREATE TABLE IF NOT EXISTS "founding_claims" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  -- The submission the claim came from, when there is one. Kept nullable so a
  -- project agreed by phone can still take a spot.
  "submission_id" uuid REFERENCES "submissions"("id") ON DELETE SET NULL,
  "business_name" text NOT NULL,
  "note" text,
  "claimed_at" timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS "founding_claims_claimed_idx" ON "founding_claims" ("claimed_at");

-- One spot per submission. Postgres allows repeated NULLs in a unique index,
-- so off-site projects can still each take a row.
CREATE UNIQUE INDEX IF NOT EXISTS "founding_claims_submission_idx"
  ON "founding_claims" ("submission_id");
