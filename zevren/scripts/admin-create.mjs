import { randomBytes, scryptSync } from "node:crypto";
import { neon } from "@neondatabase/serverless";

const connectionString = process.env.DATABASE_URL ?? process.env.POSTGRES_URL;
const email = process.env.ADMIN_EMAIL?.trim().toLowerCase();
const password = process.env.ADMIN_PASSWORD;

if (!connectionString) throw new Error("DATABASE_URL (or POSTGRES_URL) is required.");
if (!email || !password) {
  // Preview deployments use the same migration process but must never create
  // an admin account. Production gets these two variables separately.
  if (process.env.VERCEL) {
    console.log("Admin bootstrap skipped: ADMIN_EMAIL and ADMIN_PASSWORD are not configured.");
    process.exit(0);
  }
  throw new Error("ADMIN_EMAIL and ADMIN_PASSWORD are required.");
}
if (password.length < 12) {
  throw new Error("ADMIN_PASSWORD must contain at least 12 characters.");
}

const sql = neon(connectionString);
const existing = await sql.query("SELECT id FROM admin_users WHERE email = $1 LIMIT 1", [email]);
if (existing.length > 0) {
  console.log(`Admin account already exists for ${email}.`);
  process.exit(0);
}

const salt = randomBytes(16).toString("hex");
const passwordHash = scryptSync(password, salt, 64).toString("base64");
await sql.query(
  `INSERT INTO admin_users (email, password_hash, password_salt)
   VALUES ($1, $2, $3)`,
  [email, passwordHash, salt]
);

console.log(`Admin account created for ${email}.`);
