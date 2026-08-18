import { createHash, randomBytes, scrypt as scryptCallback, timingSafeEqual } from "node:crypto";
import { promisify } from "node:util";
import { cookies } from "next/headers";
import { getDatabase } from "@/lib/database";

const scrypt = promisify(scryptCallback);
export const SESSION_COOKIE_NAME = "zevren_admin_session";
const SESSION_DURATION_MS = 1000 * 60 * 60 * 24 * 7;

type AdminCredential = {
  id: number;
  email: string;
  password_hash: string;
  password_salt: string;
};

export type AdminUser = Pick<AdminCredential, "id" | "email">;

function tokenHash(token: string): string {
  return createHash("sha256").update(token).digest("hex");
}

export function normaliseEmail(email: string): string {
  return email.trim().toLowerCase();
}

export async function hashPassword(password: string, salt: string): Promise<string> {
  const derivedKey = (await scrypt(password, salt, 64)) as Buffer;
  return derivedKey.toString("base64");
}

export async function authenticateAdmin(email: string, password: string): Promise<AdminUser | null> {
  const sql = getDatabase();
  const rows = (await sql.query(
    `SELECT id, email, password_hash, password_salt
     FROM admin_users
     WHERE email = $1
     LIMIT 1`,
    [normaliseEmail(email)]
  )) as unknown as AdminCredential[];
  const admin = rows[0];
  if (!admin) return null;

  const passwordHash = await hashPassword(password, admin.password_salt);
  const expected = Buffer.from(admin.password_hash, "base64");
  const received = Buffer.from(passwordHash, "base64");

  if (expected.length !== received.length || !timingSafeEqual(expected, received)) {
    return null;
  }

  return { id: admin.id, email: admin.email };
}

export async function createAdminSession(adminId: number): Promise<{ token: string; expiresAt: Date }> {
  const token = randomBytes(32).toString("base64url");
  const expiresAt = new Date(Date.now() + SESSION_DURATION_MS);
  const sql = getDatabase();

  await sql.query(
    `INSERT INTO admin_sessions (admin_user_id, token_hash, expires_at)
     VALUES ($1, $2, $3)`,
    [adminId, tokenHash(token), expiresAt.toISOString()]
  );

  return { token, expiresAt };
}

export async function getCurrentAdmin(): Promise<AdminUser | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
  if (!token) return null;

  const sql = getDatabase();
  const rows = (await sql.query(
    `SELECT u.id, u.email
     FROM admin_sessions s
     INNER JOIN admin_users u ON u.id = s.admin_user_id
     WHERE s.token_hash = $1 AND s.expires_at > NOW()
     LIMIT 1`,
    [tokenHash(token)]
  )) as unknown as AdminUser[];

  return rows[0] ?? null;
}

export async function removeSession(token: string | undefined): Promise<void> {
  if (!token) return;
  const sql = getDatabase();
  await sql.query("DELETE FROM admin_sessions WHERE token_hash = $1", [tokenHash(token)]);
}

export function sessionCookieOptions(expiresAt?: Date) {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
    ...(expiresAt ? { expires: expiresAt } : { maxAge: 0 }),
  };
}
