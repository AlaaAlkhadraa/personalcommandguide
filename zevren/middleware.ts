import { NextResponse, type NextRequest } from "next/server";

const isDev = process.env.NODE_ENV !== "production";

function generateNonce(): string {
  const bytes = new Uint8Array(16);
  crypto.getRandomValues(bytes);
  return Buffer.from(bytes).toString("base64");
}

export function middleware(request: NextRequest) {
  const nonce = generateNonce();

  // Nonce-based CSP: Next.js reads the nonce off this header and applies it
  // to the inline scripts it injects for hydration, so we can keep
  // script-src free of 'unsafe-inline' while React still boots correctly.
  //
  // connect-src allows blob: because three's GLTFLoader unpacks textures
  // embedded in the .glb into same-origin blob: URLs and fetches them back.
  // These are created by our own page, not fetched from anywhere external,
  // so this does not widen the origins the page can talk to.
  const csp = `
    default-src 'self';
    script-src 'self' 'nonce-${nonce}' 'strict-dynamic' ${isDev ? "'unsafe-eval'" : ""};
    style-src 'self' 'unsafe-inline';
    img-src 'self' data: blob:;
    font-src 'self' data:;
    connect-src 'self' blob:;
    frame-ancestors 'none';
    base-uri 'self';
    form-action 'self';
    object-src 'none';
    upgrade-insecure-requests;
  `
    .replace(/\s{2,}/g, " ")
    .trim();

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-nonce", nonce);
  requestHeaders.set("Content-Security-Policy", csp);

  const response = NextResponse.next({
    request: { headers: requestHeaders },
  });
  response.headers.set("Content-Security-Policy", csp);

  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
