"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { useWebGLSupport } from "@/lib/hooks/use-webgl-support";
import { useReducedMotion } from "@/lib/hooks/use-reduced-motion";
import { StaticZFallback } from "@/components/three/StaticZFallback";
import { SceneErrorBoundary } from "@/components/three/SceneErrorBoundary";
import { IMAGES } from "@/lib/assets";
import type { Dictionary } from "@/lib/i18n/dictionary-type";

// The 3D scene is its own chunk and never lands in the initial bundle. A
// visitor who bounces before it loads pays nothing for it.
const Scene3D = dynamic(
  () => import("@/components/three/Scene3D").then((m) => m.Scene3D),
  { ssr: false, loading: () => <StaticZFallback /> }
);

export function Hero({ dict }: { dict: Dictionary["home"]["hero"] }) {
  const webGLSupported = useWebGLSupport();
  const reducedMotion = useReducedMotion();
  const scrollProgressRef = useRef(0);
  const [lowPower, setLowPower] = useState(false);

  useEffect(() => {
    function handleScroll() {
      const heroHeight = window.innerHeight;
      const progress = Math.min(Math.max(window.scrollY / heroHeight, 0), 1);
      scrollProgressRef.current = progress;
    }

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Narrow viewports get the lighter scene (fewer particles, lower dpr) so the
  // hero stays smooth on phones.
  useEffect(() => {
    const query = window.matchMedia("(max-width: 767px)");
    const update = () => setLowPower(query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);

  const horizon = IMAGES["hero-horizon"];
  const floor = IMAGES["hero-floor"];

  return (
    <section className="relative overflow-hidden bg-navy">
      {/* Environment, in three quiet layers. Each one is dimmed hard and
          masked at the edges: the point is depth behind the Z, not a picture
          competing with the headline. */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 select-none">
        <Image
          src={floor.src}
          alt=""
          fill
          priority
          sizes="100vw"
          placeholder="blur"
          blurDataURL={floor.blurDataURL}
          className="object-cover object-bottom opacity-[0.28] [mask-image:linear-gradient(to_top,black,transparent_75%)]"
        />
        <div className="absolute inset-0 bg-hero-glow" />
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-navy to-transparent" />
      </div>

      <div className="container-page relative grid items-center gap-12 py-20 lg:grid-cols-2 lg:gap-16 lg:py-28">
        <div className="flex animate-fade-up flex-col gap-6">
          <span className="w-fit rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-xs font-medium uppercase tracking-[0.2em] text-accent">
            {dict.badge}
          </span>
          <h1 className="font-heading text-4xl font-semibold leading-[1.08] text-white sm:text-5xl lg:text-6xl">
            {dict.titleBefore}{" "}
            <span className="text-gradient">{dict.titleHighlight}</span>.
          </h1>
          <p className="max-w-lg text-lg leading-relaxed text-muted">
            {dict.subtitle}
          </p>
          <div className="flex flex-col gap-4 pt-2 sm:flex-row">
            <Button href="/contact">{dict.ctaPrimary}</Button>
            <Button href="/projects" variant="secondary">
              {dict.ctaSecondary}
            </Button>
          </div>
          <p className="pt-6 text-sm text-muted">{dict.trustLine}</p>
        </div>

        <div className="relative mx-auto w-full max-w-xl">
          {/* Glow behind the model, so it sits in the scene instead of on top
              of a flat panel. */}
          <Image
            src={horizon.src}
            alt=""
            aria-hidden="true"
            width={horizon.width}
            height={horizon.height}
            priority
            sizes="(max-width: 1024px) 90vw, 40vw"
            placeholder="blur"
            blurDataURL={horizon.blurDataURL}
            className="pointer-events-none absolute inset-0 h-full w-full select-none rounded-full object-cover opacity-40 blur-2xl"
          />

          <div className="relative aspect-square w-full">
            {webGLSupported === false ? (
              <StaticZFallback />
            ) : webGLSupported === true ? (
              <SceneErrorBoundary>
                <Suspense fallback={<StaticZFallback />}>
                  <Scene3D
                    reducedMotion={reducedMotion}
                    scrollProgressRef={scrollProgressRef}
                    lowPower={lowPower}
                  />
                </Suspense>
              </SceneErrorBoundary>
            ) : (
              <div className="h-full w-full" />
            )}
          </div>

          {/* The model responds to the pointer, which is invisible until you
              try it. One quiet line is enough of a hint. */}
          {webGLSupported === true && (
            <p className="pointer-events-none absolute inset-x-0 bottom-0 text-center text-[11px] uppercase tracking-[0.25em] text-muted/60">
              {dict.interactHint}
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
