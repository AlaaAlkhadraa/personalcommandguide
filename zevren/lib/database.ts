import { neon } from "@neondatabase/serverless";

function getConnectionString(): string {
  const connectionString = process.env.DATABASE_URL ?? process.env.POSTGRES_URL;

  if (!connectionString) {
    throw new Error(
      "DATABASE_URL is not configured. Add the Neon connection string to your environment variables."
    );
  }

  return connectionString;
}

/**
 * Creates a Neon HTTP database client on demand. Creating the lightweight
 * client is safe in serverless functions and avoids keeping a TCP pool alive.
 */
export function getDatabase() {
  return neon(getConnectionString());
}
