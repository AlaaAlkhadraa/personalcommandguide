"use client";

import { useEffect, useRef } from "react";

/**
 * Scroll-driven reveal, powered by GSAP ScrollTrigger.
 *
 * Everything is imported dynamically inside the effect so GSAP and
 * ScrollTrigger stay out of the initial bundle: they are only fetched once a
 * component that reveals actually mounts.
 *
 * Elements opt in with `data-reveal` inside the returned ref. They are hidden
 * by a CSS rule rather than by JS, so there is no flash of laid-out content
 * before the effect runs, and a `.reveal-ready` class on the root is what
 * releases them if JS never arrives.
 *
 * Under `prefers-reduced-motion` nothing animates: the elements are simply
 * shown. That is the whole point of the setting, and a reveal is exactly the
 * unsolicited motion it asks us to drop.
 */
export function useGsapReveal<T extends HTMLElement = HTMLDivElement>() {
  const scope = useRef<T>(null);

  useEffect(() => {
    const root = scope.current;
    if (!root) return;

    const targets = root.querySelectorAll<HTMLElement>("[data-reveal]");
    if (targets.length === 0) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      root.classList.add("reveal-ready");
      targets.forEach((el) => el.classList.add("is-revealed"));
      return;
    }

    let ctx: { revert: () => void } | null = null;
    let cancelled = false;

    (async () => {
      const [{ gsap }, { ScrollTrigger }] = await Promise.all([
        import("gsap"),
        import("gsap/ScrollTrigger"),
      ]);
      if (cancelled) return;

      gsap.registerPlugin(ScrollTrigger);
      root.classList.add("reveal-ready");

      ctx = gsap.context(() => {
        targets.forEach((el) => {
          const delay = Number(el.dataset.revealDelay ?? 0);
          gsap.fromTo(
            el,
            { autoAlpha: 0, y: 26 },
            {
              autoAlpha: 1,
              y: 0,
              duration: 0.7,
              delay,
              ease: "power2.out",
              scrollTrigger: {
                trigger: el,
                // Fire a little before the element reaches the fold, so it is
                // finished by the time the reader gets to it.
                start: "top 88%",
                once: true,
              },
            }
          );
        });
      }, root);
    })();

    return () => {
      cancelled = true;
      ctx?.revert();
    };
  }, []);

  return scope;
}
