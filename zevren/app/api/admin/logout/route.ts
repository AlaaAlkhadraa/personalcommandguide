import { NextResponse, type NextRequest } from "next/server";
import { removeSession, SESSION_COOKIE_NAME, sessionCookieOptions } from "@/lib/auth";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  try {
    await removeSession(request.cookies.get(SESSION_COOKIE_NAME)?.value);
  } catch (error) {
    // Clear the browser cookie even if an already-expired or unavailable
    // database session could not be removed.
    console.error("[admin] sign-out cleanup failed", error);
  }

  const response = NextResponse.json({ message: "Signed out." });
  response.cookies.set(SESSION_COOKIE_NAME, "", sessionCookieOptions());
  return response;
}
