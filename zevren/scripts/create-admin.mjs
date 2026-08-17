#!/usr/bin/env node
/**
 * Creates or updates an admin account.
 *
 * The password is read from the ADMIN_PASSWORD environment variable, never
 * from an argument: arguments show up in `ps` output and shell history. No
 * credential is ever written into the repository.
 *
 *   ADMIN_EMAIL=you@example.com ADMIN_PASSWORD='...' npm run admin:create
 */
import { randomBytes, scrypt as scryptCb } from "node:crypto";
import { promisify } from "node:util";

const scrypt = promisify(scryptCb);
const SCRYPT = { N: 1 << 16, r: 8, p: 1, keylen: 64, maxmem: 128 * 1024 * 1024 };

const email = (process.env.ADMIN_EMAIL ?? "").trim().toLowerCase();
const password = process.env.ADMIN_PASSWORD ?? "";

if (!/^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i.test(email)) {
  console.error("Set ADMIN_EMAIL to a valid email address.");
  process.exit(1);
}
if (password.length < 12) {
  console.error("Set ADMIN_PASSWORD to at least 12 characters.");
  process.exit(1);
}

const salt = randomBytes(16);
const derived = await scrypt(password.normalize("NFKC"), salt, SCRYPT.keylen, {
  N: SCRYPT.N,
  r: SCRYPT.r,
  p: SCRYPT.p,
  maxmem: SCRYPT.maxmem,
});
const hash = ["scrypt", SCRYPT.N, SCRYPT.r, SCRYPT.p, salt.toString("base64"), derived.toString("base64")].join("$");

const driver = process.env.DATABASE_DRIVER ?? "postgres";
const statement = `
  INSERT INTO admin_users ("email", "password_hash", "role")
  VALUES ($1, $2, 'admin')
  ON CONFLICT ("email") DO UPDATE SET "password_hash" = EXCLUDED."password_hash", "disabled" = false
`;

if (driver === "pglite") {
  const { PGlite } = await import("@electric-sql/pglite");
  const db = new PGlite(process.env.PGLITE_DATA_DIR ?? "./.pglite");
  await db.query(statement, [email, hash]);
  await db.close();
} else {
  if (!process.env.DATABASE_URL) {
    console.error("DATABASE_URL is not set.");
    process.exit(1);
  }
  const { default: postgres } = await import("postgres");
  const client = postgres(process.env.DATABASE_URL, { max: 1, onnotice: () => {} });
  await client.unsafe(statement, [email, hash]);
  await client.end();
}

process.stdout.write(`admin account ready for ${email}\n`);
