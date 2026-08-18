"use client";

import { useEffect, useRef } from "react";

/**
 * The scroll-driven motion system for the marketing pages, powered by GSAP
 * ScrollTrigger. One hook drives four opt-in behaviours, all through data
 * attributes so the section components stay server components and only this
 * hook's host (`RevealGroup`) pays for the client boundary:
 *
 * - `data-reveal`            fade + rise, once, as the element nears the fold
 * - `data-reveal-stagger`    a container whose `data-reveal-item` children
 *                            fade + rise in sequence instead of together
 * - `data-count-to`          the element's own text is read once, its
 *                            leading number counted up from zero, and its
 *                            exact original text restored at the end
 * - `data-parallax="-18"`    a slow scroll-scrubbed drift, in yPercent, for
 *                            decorative background layers
 *
 * GSAP and ScrollTrigger are imported dynamically inside the effect so they
 * never land in the initial bundle: they arrive only once a page that
 * actually reveals something has mounted.
 *
 * Elements are hidden by a CSS rule, not by JS, so there is no flash of laid
 * out content before the effect runs, and a `.reveal-ready` class on the
 * root is what releases them if the chunk never arrives. Reduced motion
 * short-circuits everything: reveals and stagger items are simply shown,
 * counters jump straight to their final text, and parallax never registers a
 * single scroll-linked frame, because a background drift is exactly the kind
 * of motion that setting exists to remove.
 */
export function useGsapReveal<T extends HTMLElement = HTMLDivElement>() {
  const scope = useRef<T>(null);

  useEffect(() => {
    const root = scope.current;
    if (!root) return;

    const singles = root.querySelectorAll<HTMLElement>("[data-reveal]");
    const staggerGroups = root.querySelectorAll<HTMLElement>("[data-reveal-stagger]");
    const counters = root.querySelectorAll<HTMLElement>("[data-count-to]");
    const parallaxLayers = root.querySelectorAll<HTMLElement>("[data-parallax]");

    if (
      singles.length === 0 &&
      staggerGroups.length === 0 &&
      counters.length === 0 &&
      parallaxLayers.length === 0
    ) {
      return;
    }

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      root.classList.add("reveal-ready");
      singles.forEach((el) => el.classList.add("is-revealed"));
      staggerGroups.forEach((group) => {
        group
          .querySelectorAll<HTMLElement>("[data-reveal-item]")
          .forEach((el) => el.classList.add("is-revealed"));
      });
      // Counters keep their authored text; nothing to animate toward.
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
        singles.forEach((el) => {
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
              scrollTrigger: { trigger: el, start: "top 88%", once: true },
            }
          );
        });

        staggerGroups.forEach((group) => {
          const items = group.querySelectorAll<HTMLElement>("[data-reveal-item]");
          if (items.length === 0) return;
          gsap.fromTo(
            items,
            { autoAlpha: 0, y: 22 },
            {
              autoAlpha: 1,
              y: 0,
              duration: 0.6,
              ease: "power2.out",
              stagger: 0.08,
              scrollTrigger: { trigger: group, start: "top 88%", once: true },
            }
          );
        });

        counters.forEach((el) => {
          const raw = (el.textContent ?? "").trim();
          const match = raw.match(/^(\D*)(\d+)(.*)$/);
          if (!match) return; // "?" and other non-numeric values stay as authored.
          const [, prefix, digits, suffix] = match;
          const target = Number(digits);
          const proxy = { value: 0 };
          gsap.to(proxy, {
            value: target,
            duration: 1.1,
            ease: "power1.out",
            scrollTrigger: { trigger: el, start: "top 90%", once: true },
            onUpdate: () => {
              el.textContent = `${prefix}${Math.round(proxy.value)}${suffix}`;
            },
            onComplete: () => {
              // Restore the exact authored string in case rounding or the
              // digit-only regex dropped formatting (a leading zero, say).
              el.textContent = raw;
            },
          });
        });

        parallaxLayers.forEach((el) => {
          const distance = Number(el.dataset.parallax ?? -15);
          const section = el.closest("section") ?? el.parentElement ?? el;
          gsap.to(el, {
            yPercent: distance,
            ease: "none",
            scrollTrigger: {
              trigger: section,
              start: "top bottom",
              end: "bottom top",
              scrub: true,
            },
          });
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
