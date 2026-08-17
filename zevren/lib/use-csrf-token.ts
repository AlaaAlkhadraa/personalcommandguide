"use client";

import { useEffect, useState } from "react";

/**
 * Keeps a CSRF token in state.
 *
 * A page render cannot set the paired secret cookie (Next only allows that
 * from a route handler or a server action), so when the server had no token to
 * pass down the browser asks /api/csrf for one. The token is not a secret on
 * its own: without the HttpOnly cookie it verifies against, it is useless, and
 * another origin cannot read that cookie.
 */
export function useCsrfToken(initial: string | null): string | null {
  const [token, setToken] = useState<string | null>(initial);

  useEffect(() => {
    if (token) return;
    let cancelled = false;

    fetch("/api/csrf", { credentials: "same-origin" })
      .then((response) => (response.ok ? response.json() : null))
      .then((data: { token?: string } | null) => {
        if (!cancelled && data?.token) setToken(data.token);
      })
      .catch(() => null);

    return () => {
      cancelled = true;
    };
  }, [token]);

  return token;
}
