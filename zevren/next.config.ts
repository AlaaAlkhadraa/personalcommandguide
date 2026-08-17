import type { NextConfig } from "next";

// Content-Security-Policy is set per-request in middleware.ts, where it
// gets a per-request nonce that Next.js applies to its own hydration
// scripts. Everything else that doesn't need a nonce lives here.
const securityHeaders = [
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value:
      "camera=(), microphone=(), geolocation=(), interest-cohort=(), payment=()",
  },
  { key: "X-DNS-Prefetch-Control", value: "off" },
  { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
  { key: "Cross-Origin-Resource-Policy", value: "same-origin" },
];

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // Do not advertise the framework version to anyone fingerprinting the site.
  poweredByHeader: false,
  // Database drivers must not be bundled: they load native/wasm pieces at
  // runtime. Keeping them external also keeps them out of any client graph.
  serverExternalPackages: ["postgres", "@electric-sql/pglite"],
  images: {
    formats: ["image/avif", "image/webp"],
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: securityHeaders,
      },
    ];
  },
  async redirects() {
    return [
      // The section was called Portfolio, then Work, and is now Projects.
      // Both old paths keep working so nothing that was linked or indexed
      // under them turns into a 404.
      { source: "/portfolio", destination: "/projects", permanent: true },
      {
        source: "/portfolio/:slug",
        destination: "/projects/:slug",
        permanent: true,
      },
      { source: "/work", destination: "/projects", permanent: true },
      { source: "/work/:slug", destination: "/projects/:slug", permanent: true },
      { source: "/reviews", destination: "/", permanent: true },
    ];
  },
};

export default nextConfig;
