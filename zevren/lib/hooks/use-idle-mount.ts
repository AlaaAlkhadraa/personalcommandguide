"use client";

import { useEffect, useState } from "react";

/**
 * True once the page has loaded and the browser has a spare moment.
 *
 * Used to hold back work that is heavy but not urgent, the 3D hero above all.
 * That scene costs seconds of main-thread time to parse a 1.1 MB model, build
 * an environment map and compile shaders. Mounting it during hydration made
 * the page unresponsive to scrolling and tapping for that whole stretch, while
 * the visitor was already looking at a finished hero: the static fallback
 * renders instantly and is what they see until the real thing is ready.
 *
 * The idle callback carries a timeout so a permanently busy main thread still
 * gets the scene rather than never showing it.
 */
export function useIdleMount(timeout = 2500): boolean {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;
    let release: (() => void) | undefined;

    function scheduleAfterLoad() {
      if (cancelled) return;
      const request = window.requestIdleCallback;
      if (typeof request === "function") {
        const handle = request(
          () => {
            if (!cancelled) setReady(true);
          },
          { timeout }
        );
        release = () => window.cancelIdleCallback?.(handle);
        return;
      }
      // Safari has no requestIdleCallback: a short timer after load is close
      // enough, since the point is only to clear the busy stretch.
      const handle = window.setTimeout(() => {
        if (!cancelled) setReady(true);
      }, 300);
      release = () => window.clearTimeout(handle);
    }

    if (document.readyState === "complete") {
      scheduleAfterLoad();
    } else {
      window.addEventListener("load", scheduleAfterLoad, { once: true });
      release = () => window.removeEventListener("load", scheduleAfterLoad);
    }

    return () => {
      cancelled = true;
      release?.();
    };
  }, [timeout]);

  return ready;
}
