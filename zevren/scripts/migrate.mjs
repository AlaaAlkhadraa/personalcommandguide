#!/usr/bin/env node
/**
 * Applies drizzle/*.sql in order, inside one transaction per file.
 *
 * Reads the connection string from the environment only; it is never passed
 * on the command line, where it would land in shell history and process lists.
 */
import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";

const dir = join(process.cwd(), "drizzle");
const files = readdirSync(dir).filter((f) => f.endsWith(".sql")).sort();
const driver = process.env.DATABASE_DRIVER ?? "postgres";

async function run(exec) {
  for (const file of files) {
    const sql = readFileSync(join(dir, file), "utf8");
    process.stdout.write(`applying ${file}\n`);
    await exec(sql);
  }
}

if (driver === "pglite") {
  const { PGlite } = await import("@electric-sql/pglite");
  const db = new PGlite(process.env.PGLITE_DATA_DIR ?? "./.pglite");
  await run((sql) => db.exec(sql));
  await db.close();
} else {
  const url = process.env.DATABASE_URL ?? process.env.POSTGRES_URL;
  if (!url) {
    console.error("Set DATABASE_URL (or POSTGRES_URL).");
    process.exit(1);
  }
  const { default: postgres } = await import("postgres");
  const client = postgres(url, { max: 1, onnotice: () => {} });
  await run((sql) => client.unsafe(sql));
  await client.end();
}

process.stdout.write("migrations applied\n");
