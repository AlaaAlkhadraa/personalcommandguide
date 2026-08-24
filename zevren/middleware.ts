import { NextResponse, type NextRequest } from "next/server";

const isDev = process.env.NODE_ENV !== "production";

function generateNonce(): string {
  const bytes = new Uint8Array(16);
  crypto.getRandomValues(bytes);
  return Buffer.from(bytes).toString("base64");
}

/**
 * The session cookie name mirrors lib/server/session.ts. It is duplicated here
 * on purpose: middleware runs on the Edge runtime and must not pull in the
 * database driver or node:crypto that module depends on.
 */
const SESSION_COOKIE = isDev ? "zvr_session" : "__Host-zvr_session";

export function middleware(request: NextRequest) {
  const nonce = generateNonce();
  const { pathname } = request.nextUrl;

  // ---------------------------------------------------------------------
  // Admin gate.
  //
  // This is a convenience redirect, not the authorization check: it only
  // looks at whether a session cookie is present, because verifying it needs
  // the database. The real check runs server-side in app/admin/page.tsx and
  // in every /api/admin route, so forging this cookie gains nothing.
  // ---------------------------------------------------------------------
  if (pathname === "/admin" || pathname.startsWith("/admin/")) {
    const hasSession = Boolean(request.cookies.get(SESSION_COOKIE)?.value);
    if (!hasSession && pathname !== "/admin/login") {
      // A fixed, relative destination. No part of the request decides where
      // the visitor is sent, so this cannot be turned into an open redirect.
      const url = request.nextUrl.clone();
      url.pathname = "/admin/login";
      url.search = "";
      return withSecurityHeaders(NextResponse.redirect(url), nonce, request);
    }
  }

  // Google's advertising measurement, named host by host rather than with a
  // wildcard. The tag itself is loaded by a nonced Next bundle, so
  // strict-dynamic already trusts it; these entries are what the tag then
  // needs to reach, and what browsers without strict-dynamic fall back to.
  const googleAds = [
    "https://www.googletagmanager.com",
    "https://www.googleadservices.com",
    "https://googleads.g.doubleclick.net",
    "https://www.google.com",
    "https://www.google.nl",
  ].join(" ");

  // The concept demos under /demo/ are self-contained pages that load their
  // typefaces from Google Fonts; only there are those two hosts admitted.
  const isDemo = request.nextUrl.pathname.startsWith("/demo/");
  const csp = [
    "default-src 'self'",
    `script-src 'self' 'nonce-${nonce}' 'strict-dynamic'${isDev ? " 'unsafe-eval'" : ""}`,
    `style-src 'self' 'unsafe-inline'${isDemo ? " https://fonts.googleapis.com" : ""}`,
    `img-src 'self' data: blob: ${googleAds}`,
    `font-src 'self' data:${isDemo ? " https://fonts.gstatic.com" : ""}`,
    // blob: is for three's GLTFLoader, which unpacks textures embedded in the
    // .glb into same-origin blob URLs and fetches them back. Created by our
    // own page, so this does not widen the set of reachable hosts.
    `connect-src 'self' blob: ${googleAds}`,
    // Google Maps for the Tajex concept's location embed, and doubleclick for
    // the conversion tag's iframe ping.
    "frame-src https://www.google.com https://maps.google.com https://td.doubleclick.net https://www.googletagmanager.com",
    // Nothing may frame us: clickjacking defence, alongside X-Frame-Options.
    "frame-ancestors 'none'",
    "base-uri 'self'",
    // Forms may only post back to this origin, so an injected form cannot
    // exfiltrate what a visitor types.
    "form-action 'self'",
    "object-src 'none'",
    "upgrade-insecure-requests",
  ].join("; ");

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-nonce", nonce);
  requestHeaders.set("Content-Security-Policy", csp);

  const response = NextResponse.next({ request: { headers: requestHeaders } });
  return withSecurityHeaders(response, nonce, request, csp);
}

function withSecurityHeaders(
  response: NextResponse,
  nonce: string,
  request: NextRequest,
  csp?: string
): NextResponse {
  if (csp) response.headers.set("Content-Security-Policy", csp);

  // Never sniff a response into a different type than declared.
  response.headers.set("X-Content-Type-Options", "nosniff");
  // Legacy companion to frame-ancestors, for browsers that predate CSP3.
  response.headers.set("X-Frame-Options", "DENY");
  // Do not leak the full URL of an admin page to third parties.
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  // Switch off device APIs the site never uses.
  response.headers.set(
    "Permissions-Policy",
    "camera=(), microphone=(), geolocation=(), payment=(), usb=(), interest-cohort=()"
  );
  // Keep this origin out of shared browsing contexts.
  response.headers.set("Cross-Origin-Opener-Policy", "same-origin");
  response.headers.set("Cross-Origin-Resource-Policy", "same-origin");
  response.headers.set("X-DNS-Prefetch-Control", "off");

  if (!isDev) {
    // Two years, subdomains included, preload-eligible. Only sent over https,
    // which is where it has meaning.
    response.headers.set(
      "Strict-Transport-Security",
      "max-age=63072000; includeSubDomains; preload"
    );
  }

  const { pathname } = request.nextUrl;
  if (pathname.startsWith("/api/") || pathname.startsWith("/admin")) {
    // Personal data: never stored by a shared cache or the browser's disk.
    response.headers.set("Cache-Control", "no-store, no-cache, must-revalidate, private");
    // Keep crawlers away from the admin area and the API entirely.
    response.headers.set("X-Robots-Tag", "noindex, nofollow, noarchive");
  }

  // No Access-Control-Allow-Origin is ever set, on any route. Browsers
  // therefore refuse to hand a cross-origin caller the response body, and the
  // API routes additionally reject the request with a same-origin check.
  response.headers.set("Vary", "Origin, Cookie");

  void nonce;
  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
