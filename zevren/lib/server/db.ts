import "server-only";

import type { PostgresJsDatabase } from "drizzle-orm/postgres-js";

import { env, hasDatabase } from "@/lib/server/env";
import * as schema from "@/lib/server/schema";

/**
 * Database access. Two drivers:
 *
 * - postgres  : production, over TLS, through a pooled postgres.js client.
 * - pglite    : local development and the test suite, an embedded Postgres so
 *               contributors do not need a server. `assertProductionConfig`
 *               refuses this driver in production.
 *
 * The connection string is read from the environment only. It is never sent to
 * the client, never logged, and never interpolated into a query.
 */

/**
 * Both drivers expose the same Drizzle query builder; only the transport
 * differs. Typing the handle as one of them keeps call sites from having to
 * narrow a union on every query.
 */
type Db = PostgresJsDatabase<typeof schema>;

let instance: Promise<Db> | null = null;

async function create(): Promise<Db> {
  const e = env();

  // A real deployment must never fall back to the embedded database: it is
  // per-instance and not durable, so it would silently lose submissions and
  // reset rate limits. Fail loudly instead.
  if (e.NODE_ENV === "production" && e.DATABASE_DRIVER !== "postgres") {
    throw new Error("The embedded database driver is not allowed in production.");
  }

  if (e.DATABASE_DRIVER === "pglite") {
    const [{ PGlite }, { drizzle }] = await Promise.all([
      import("@electric-sql/pglite"),
      import("drizzle-orm/pglite"),
    ]);
    const client = new PGlite(e.PGLITE_DATA_DIR);
    return drizzle(client, { schema }) as unknown as Db;
  }

  if (!e.DATABASE_URL) {
    throw new DatabaseUnavailableError();
  }

  const [{ default: postgres }, { drizzle }] = await Promise.all([
    import("postgres"),
    import("drizzle-orm/postgres-js"),
  ]);

  const client = postgres(e.DATABASE_URL, {
    // Serverless: keep the pool small and let idle connections go.
    max: 3,
    idle_timeout: 20,
    connect_timeout: 10,
    // Neon requires TLS for runtime connections. Enforce it explicitly:
    // relying on a URL query parameter leaves postgres.js in insecure mode
    // in some serverless runtimes.
    ssl: "require",
    onnotice: () => {},
  });

  return drizzle(client, { schema });
}

export class DatabaseUnavailableError extends Error {
  constructor() {
    super("Database is not configured.");
    this.name = "DatabaseUnavailableError";
  }
}

export function databaseConfigured(): boolean {
  return hasDatabase();
}

export function getDb(): Promise<Db> {
  if (!hasDatabase()) return Promise.reject(new DatabaseUnavailableError());
  if (!instance) instance = create();
  return instance;
}

export { schema };
