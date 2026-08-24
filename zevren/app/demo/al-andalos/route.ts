import type { NextRequest } from "next/server";

import { AL_ANDALOS_HTML } from "./content";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Serves the Al Andalos concept demo. The page is plain HTML with one
 * inline script; the site's CSP only runs scripts that carry the
 * per-request nonce, so it is stamped in here. Unlisted on purpose: not
 * in the projects grid, not in the sitemap, and never indexed -- it is a
 * link the owner sends to one prospect.
 */
export async function GET(request: NextRequest) {
  const nonce = request.headers.get("x-nonce") ?? "";
  const html = AL_ANDALOS_HTML.replace("<script>", `<script nonce="${nonce}">`);
  return new Response(html, {
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "X-Robots-Tag": "noindex, nofollow",
      "Cache-Control": "no-store",
    },
  });
}
