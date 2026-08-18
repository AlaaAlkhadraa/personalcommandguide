import { readdir, readFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { neon } from "@neondatabase/serverless";

const connectionString = process.env.DATABASE_URL ?? process.env.POSTGRES_URL;
if (!connectionString) {
  throw new Error("DATABASE_URL (or POSTGRES_URL) is required before running migrations.");
}

const sql = neon(connectionString);
const scriptDirectory = dirname(fileURLToPath(import.meta.url));
const migrationsDirectory = join(scriptDirectory, "..", "db", "migrations");

function splitStatements(source) {
  return source
    .split(/;\s*(?:\r?\n|$)/)
    .map((statement) => statement.trim())
    .filter(Boolean);
}

await sql.query(`CREATE TABLE IF NOT EXISTS schema_migrations (
  filename TEXT PRIMARY KEY,
  applied_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
)`);

const appliedRows = await sql.query("SELECT filename FROM schema_migrations");
const applied = new Set(appliedRows.map((row) => row.filename));
const filenames = (await readdir(migrationsDirectory))
  .filter((filename) => filename.endsWith(".sql"))
  .sort();

for (const filename of filenames) {
  if (applied.has(filename)) continue;

  console.log(`Applying ${filename}`);
  const source = await readFile(join(migrationsDirectory, filename), "utf8");
  for (const statement of splitStatements(source)) {
    await sql.query(statement);
  }
  await sql.query("INSERT INTO schema_migrations (filename) VALUES ($1)", [filename]);
}

console.log("Database is up to date.");
