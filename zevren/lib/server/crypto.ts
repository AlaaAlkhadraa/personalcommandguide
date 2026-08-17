import "server-only";

import {
  createHmac,
  randomBytes,
  scrypt as scryptCb,
  timingSafeEqual,
} from "node:crypto";
import { promisify } from "node:util";

import { authSecret } from "@/lib/server/env";

const scrypt = promisify(scryptCb) as (
  password: string | Buffer,
  salt: string | Buffer,
  keylen: number,
  options: { N: number; r: number; p: number; maxmem: number }
) => Promise<Buffer>;

/**
 * scrypt parameters. N=2^16 with r=8 costs roughly 100ms and 64MB per hash on
 * a small serverless instance, which is the point: it makes offline cracking
 * of a stolen hash expensive. Stored alongside every hash so the cost can be
 * raised later without invalidating existing passwords.
 */
const SCRYPT = { N: 1 << 16, r: 8, p: 1, keylen: 64, maxmem: 128 * 1024 * 1024 };

/** Constant-time comparison that tolerates different lengths. */
export function safeEqual(a: string, b: string): boolean {
  const bufA = Buffer.from(a, "utf8");
  const bufB = Buffer.from(b, "utf8");
  if (bufA.length !== bufB.length) {
    // Still burn a comparison so the failure takes the same time.
    timingSafeEqual(bufA, bufA);
    return false;
  }
  return timingSafeEqual(bufA, bufB);
}

export async function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(16);
  const derived = await scrypt(password.normalize("NFKC"), salt, SCRYPT.keylen, {
    N: SCRYPT.N,
    r: SCRYPT.r,
    p: SCRYPT.p,
    maxmem: SCRYPT.maxmem,
  });
  return [
    "scrypt",
    SCRYPT.N,
    SCRYPT.r,
    SCRYPT.p,
    salt.toString("base64"),
    derived.toString("base64"),
  ].join("$");
}

/**
 * Verifies a password against a stored hash. Returns false for malformed
 * records rather than throwing, so a corrupted row cannot be used to
 * distinguish "user exists" from "user does not exist" through an error.
 */
export async function verifyPassword(password: string, stored: string): Promise<boolean> {
  const parts = stored.split("$");
  if (parts.length !== 6 || parts[0] !== "scrypt") return false;

  const N = Number(parts[1]);
  const r = Number(parts[2]);
  const p = Number(parts[3]);
  if (!Number.isInteger(N) || !Number.isInteger(r) || !Number.isInteger(p)) return false;
  // Refuse absurd parameters from a tampered row: they would be a memory
  // exhaustion vector rather than a valid hash.
  if (N < 1 << 12 || N > 1 << 20 || r < 1 || r > 16 || p < 1 || p > 16) return false;

  let expected: Buffer;
  let actual: Buffer;
  try {
    expected = Buffer.from(parts[5]!, "base64");
    actual = await scrypt(password.normalize("NFKC"), Buffer.from(parts[4]!, "base64"), expected.length, {
      N,
      r,
      p,
      maxmem: 256 * 1024 * 1024,
    });
  } catch {
    return false;
  }

  if (expected.length !== actual.length) return false;
  return timingSafeEqual(expected, actual);
}

/** URL-safe random token with 256 bits of entropy. */
export function randomToken(bytes = 32): string {
  return randomBytes(bytes).toString("base64url");
}

/**
 * Keyed hash used for anything derived from a secret: session tokens, CSRF
 * tokens and the pseudonymous IP identifiers stored with submissions. Keying
 * it means a database dump alone does not let an attacker replay a session or
 * reverse an IP by brute-forcing the small IPv4 space.
 */
export function keyedHash(value: string, scope: string): string {
  return createHmac("sha256", `${authSecret()}:${scope}`).update(value).digest("base64url");
}
