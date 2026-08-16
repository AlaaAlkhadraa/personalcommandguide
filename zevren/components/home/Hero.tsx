"use client";

import { Suspense, useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import { Button } from "@/components/ui/Button";
import { useWebGLSupport } from "@/lib/hooks/use-webgl-support";
import { useReducedMotion } from "@/lib/hooks/use-reduced-motion";
import { StaticZFallback } from "@/components/three/StaticZFallback";
import type { Dictionary } from "@/lib/i18n/dictionary-type";

const Scene3D = dynamic(
  () => import("@/components/three/Scene3D").then((m) => m.Scene3D),
  { ssr: false, loading: () => <StaticZFallback /> }
);

export function Hero({ dict }: { dict: Dictionary["home"]["hero"] }) {
  const webGLSupported = useWebGLSupport();
  const reducedMotion = useReducedMotion();
  const scrollProgressRef = useRef(0);

  useEffect(() => {
    function handleScroll() {
      const heroHeight = window.innerHeight;
      const progress = Math.min(Math.max(window.scrollY / heroHeight, 0), 1);
      scrollProgressRef.current = progress;
    }

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <section className="relative overflow-hidden bg-grid-glow">
      <div className="container-page grid items-center gap-16 py-20 lg:grid-cols-2 lg:py-28">
        <div className="flex animate-fade-up flex-col gap-6">
          <span className="w-fit rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs font-medium uppercase tracking-[0.2em] text-accent">
            {dict.badge}
          </span>
          <h1 className="text-4xl font-semibold leading-[1.1] text-white sm:text-5xl lg:text-6xl">
            {dict.titleBefore}{" "}
            <span className="text-gradient">{dict.titleHighlight}</span>.
          </h1>
          <p className="max-w-lg text-lg leading-relaxed text-muted">
            {dict.subtitle}
          </p>
          <div className="flex flex-col gap-4 pt-2 sm:flex-row">
            <Button href="/contact">{dict.ctaPrimary}</Button>
            <Button href="/work" variant="secondary">
              {dict.ctaSecondary}
            </Button>
          </div>
          <p className="pt-6 text-sm text-muted">{dict.trustLine}</p>
        </div>

        <div
          className="relative mx-auto aspect-square w-full max-w-xl"
          aria-hidden="true"
        >
          {webGLSupported === false ? (
            <StaticZFallback />
          ) : webGLSupported === true ? (
            <Suspense fallback={<StaticZFallback />}>
              <Scene3D
                reducedMotion={reducedMotion}
                scrollProgressRef={scrollProgressRef}
              />
            </Suspense>
          ) : (
            <div className="h-full w-full" />
          )}
        </div>
      </div>
    </section>
  );
}
