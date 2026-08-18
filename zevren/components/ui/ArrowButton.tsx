"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import type { ReactNode } from "react";

/**
 * The squared-off call to action used in the hero and the final CTA.
 *
 * Separate from Button rather than a variant of it, because the rounded pill
 * is still the right shape everywhere else on the site and mixing the two
 * inside one component would mean every caller picks a geometry.
 *
 * On a device with a real pointer, and only when the visitor has not asked
 * for reduced motion, the button pulls a few pixels toward the cursor as it
 * passes near, and settles back once it leaves. GSAP's quickTo builds one
 * interpolator per axis instead of starting a new tween on every mousemove,
 * which is what keeps this cheap enough to run at pointer frequency.
 */
export function ArrowButton({
  href,
  variant = "primary",
  className = "",
  children,
}: {
  href: string;
  variant?: "primary" | "outline";
  className?: string;
  children: ReactNode;
}) {
  const ref = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const canMagnet =
      window.matchMedia("(pointer: fine)").matches &&
      !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!canMagnet) return;

    let cancelled = false;
    let moveX: ((v: number) => void) | null = null;
    let moveY: ((v: number) => void) | null = null;

    (async () => {
      const { gsap } = await import("gsap");
      if (cancelled) return;
      moveX = gsap.quickTo(el, "x", { duration: 0.35, ease: "power3.out" });
      moveY = gsap.quickTo(el, "y", { duration: 0.35, ease: "power3.out" });
    })();

    function onMove(e: MouseEvent) {
      if (!el || !moveX || !moveY) return;
      const rect = el.getBoundingClientRect();
      const relX = e.clientX - (rect.left + rect.width / 2);
      const relY = e.clientY - (rect.top + rect.height / 2);
      // Clamped well short of the button's own size, so the pull reads as a
      // magnet rather than the button chasing the pointer around the page.
      moveX(Math.max(-6, Math.min(6, relX * 0.25)));
      moveY(Math.max(-4, Math.min(4, relY * 0.25)));
    }

    function onLeave() {
      moveX?.(0);
      moveY?.(0);
    }

    el.addEventListener("mousemove", onMove);
    el.addEventListener("mouseleave", onLeave);
    return () => {
      cancelled = true;
      el.removeEventListener("mousemove", onMove);
      el.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  const styles =
    variant === "primary"
      ? "bg-primary text-white hover:bg-primary-light hover:shadow-glow"
      : "border border-white/25 text-white hover:border-accent hover:bg-white/5";

  return (
    <Link
      ref={ref}
      href={href}
      className={`group inline-flex items-center justify-between gap-6 px-7 py-4 text-xs font-semibold uppercase tracking-[0.14em] transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-navy active:scale-[0.99] ${styles} ${className}`}
    >
      {children}
      <svg
        viewBox="0 0 16 16"
        aria-hidden="true"
        className="h-3.5 w-3.5 shrink-0 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.8}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M4 12 12 4M6 4h6v6" />
      </svg>
    </Link>
  );
}
