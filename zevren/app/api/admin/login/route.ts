import { NextResponse, type NextRequest } from "next/server";
import {
  authenticateAdmin,
  createAdminSession,
  SESSION_COOKIE_NAME,
  sessionCookieOptions,
} from "@/lib/auth";
import { adminLoginSchema } from "@/lib/validations/admin";

export const runtime = "nodejs";

const attemptsByIp = new Map<string, number[]>();
const LOGIN_WINDOW_MS = 15 * 60_000;
const LOGIN_MAX_ATTEMPTS = 10;

function getClientIp(request: NextRequest): string {
  return request.headers.get("x-forwarded-for")?.split(",")[0]?.trim()
    ?? request.headers.get("x-real-ip")
    ?? "unknown";
}

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const attempts = (attemptsByIp.get(ip) ?? []).filter(
    (timestamp) => now - timestamp < LOGIN_WINDOW_MS
  );
  attempts.push(now);
  attemptsByIp.set(ip, attempts);
  return attempts.length > LOGIN_MAX_ATTEMPTS;
}

export async function POST(request: NextRequest) {
  if (isRateLimited(getClientIp(request))) {
    return NextResponse.json(
      { message: "Too many sign-in attempts. Please try again later." },
      { status: 429 }
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ message: "Invalid request." }, { status: 400 });
  }

  const parsed = adminLoginSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { message: parsed.error.issues[0]?.message ?? "Invalid email or password." },
      { status: 400 }
    );
  }

  try {
    const admin = await authenticateAdmin(parsed.data.email, parsed.data.password);
    if (!admin) {
      return NextResponse.json({ message: "Invalid email or password." }, { status: 401 });
    }

    const session = await createAdminSession(admin.id);
    const response = NextResponse.json({ email: admin.email });
    response.cookies.set(
      SESSION_COOKIE_NAME,
      session.token,
      sessionCookieOptions(session.expiresAt)
    );
    return response;
  } catch (error) {
    console.error("[admin] sign-in failed", error);
    return NextResponse.json(
      { message: "Sign-in is temporarily unavailable. Please try again later." },
      { status: 503 }
    );
  }
}
