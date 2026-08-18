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
 * - `data-reveal-words`      a heading whose words rise out of their own
 *                            overflow masks in a cascade; nested elements
 *                            (an accent span, say) travel as one word
 * - `data-draw-line`         an accent rule that draws itself in from its
 *                            reading-direction end
 * - `data-tilt`              a card that tips a few degrees toward the
 *                            pointer; mouse only, so touch scrolling is
 *                            never hijacked
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
    const wordHeadings = root.querySelectorAll<HTMLElement>("[data-reveal-words]");
    const drawLines = root.querySelectorAll<HTMLElement>("[data-draw-line]");
    const tiltCards = root.querySelectorAll<HTMLElement>("[data-tilt]");

    if (
      singles.length === 0 &&
      staggerGroups.length === 0 &&
      counters.length === 0 &&
      parallaxLayers.length === 0 &&
      wordHeadings.length === 0 &&
      drawLines.length === 0 &&
      tiltCards.length === 0
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
    const listenerCleanups: Array<() => void> = [];

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

        wordHeadings.forEach((el) => {
          // Guard against a second pass (dev strict mode remounts) re-wrapping
          // the spans of the first.
          if (el.dataset.wordsSplit === "true") return;
          el.dataset.wordsSplit = "true";

          // Split into word-sized mask/inner span pairs. Text nodes split on
          // whitespace; an element child (the accent span) stays whole and
          // rides in its own mask, so its markup and styling survive. The
          // mask hides the word until its inner span rises into place; the
          // small padding/negative-margin pair keeps descenders from being
          // shaved while the word is still moving.
          const inners: HTMLElement[] = [];
          const fragment = document.createDocumentFragment();

          const wrapUnit = (unit: Node): void => {
            const mask = document.createElement("span");
            mask.style.display = "inline-block";
            mask.style.overflow = "hidden";
            mask.style.verticalAlign = "top";
            mask.style.paddingBottom = "0.12em";
            mask.style.marginBottom = "-0.12em";
            const inner = document.createElement("span");
            inner.style.display = "inline-block";
            inner.appendChild(unit);
            mask.appendChild(inner);
            fragment.appendChild(mask);
            inners.push(inner);
          };

          Array.from(el.childNodes).forEach((node) => {
            if (node.nodeType === Node.TEXT_NODE) {
              const parts = (node.textContent ?? "").split(/(\s+)/);
              parts.forEach((part) => {
                if (part.length === 0) return;
                if (/^\s+$/.test(part)) {
                  fragment.appendChild(document.createTextNode(part));
                } else {
                  wrapUnit(document.createTextNode(part));
                }
              });
            } else {
              wrapUnit(node);
            }
          });

          el.replaceChildren(fragment);
          if (inners.length === 0) return;

          gsap.fromTo(
            inners,
            { yPercent: 112 },
            {
              yPercent: 0,
              duration: 0.85,
              ease: "power3.out",
              stagger: 0.05,
              delay: 0.08,
              scrollTrigger: { trigger: el, start: "top 88%", once: true },
            }
          );
        });

        const rtl = document.documentElement.dir === "rtl";
        drawLines.forEach((el) => {
          gsap.fromTo(
            el,
            { scaleX: 0, transformOrigin: rtl ? "right center" : "left center" },
            {
              scaleX: 1,
              duration: 0.9,
              delay: 0.25,
              ease: "power2.inOut",
              scrollTrigger: { trigger: el, start: "top 92%", once: true },
            }
          );
        });

        // Tilt is pointer-driven, not scroll-driven, and a direct response to
        // the visitor's own input; it is still skipped under reduced motion
        // because the whole hook already returned above in that case.
        if (window.matchMedia("(pointer: fine)").matches) {
          tiltCards.forEach((el) => {
            gsap.set(el, { transformPerspective: 900 });
            const toRotX = gsap.quickTo(el, "rotationX", { duration: 0.5, ease: "power3.out" });
            const toRotY = gsap.quickTo(el, "rotationY", { duration: 0.5, ease: "power3.out" });

            const move = (event: MouseEvent) => {
              const rect = el.getBoundingClientRect();
              const px = (event.clientX - rect.left) / rect.width - 0.5;
              const py = (event.clientY - rect.top) / rect.height - 0.5;
              toRotY(px * 6);
              toRotX(-py * 5);
            };
            const leave = () => {
              toRotX(0);
              toRotY(0);
            };

            el.addEventListener("mousemove", move);
            el.addEventListener("mouseleave", leave);
            listenerCleanups.push(() => {
              el.removeEventListener("mousemove", move);
              el.removeEventListener("mouseleave", leave);
            });
          });
        }
      }, root);
    })();

    return () => {
      cancelled = true;
      listenerCleanups.forEach((fn) => fn());
      ctx?.revert();
    };
  }, []);

  return scope;
}
