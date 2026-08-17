"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { ArrowButton } from "@/components/ui/ArrowButton";
import { Icon } from "@/components/ui/Icon";
import { useWebGLSupport } from "@/lib/hooks/use-webgl-support";
import { useReducedMotion } from "@/lib/hooks/use-reduced-motion";
import { StaticZFallback } from "@/components/three/StaticZFallback";
import { SceneErrorBoundary } from "@/components/three/SceneErrorBoundary";
import { HeroEnvironment } from "@/components/home/HeroEnvironment";
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
  // Which slot the mark renders into. Tracked in state rather than shown and
  // hidden with CSS, because two mounted <Canvas>es would mean two WebGL
  // contexts and two decodes of the same 1.25 MB model for one visible mark.
  const [isWide, setIsWide] = useState<boolean | null>(null);

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

  useEffect(() => {
    const query = window.matchMedia("(min-width: 1024px)");
    const update = () => setIsWide(query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);

  const mark = (
    <Mark
      webGLSupported={webGLSupported}
      reducedMotion={reducedMotion}
      scrollProgressRef={scrollProgressRef}
      lowPower={lowPower}
    />
  );

  return (
    <section className="relative isolate overflow-hidden bg-navy">
      <HeroEnvironment />

      {/* The mark sits behind the copy on wide screens and above it on
          narrow ones, so the headline never lands on top of the Z. */}
      {isWide === true && (
        <div className="pointer-events-none absolute inset-y-0 end-0 flex w-[62%] items-center justify-center">
          <div className="pointer-events-auto relative aspect-square w-full max-w-3xl">
            {mark}
          </div>
        </div>
      )}

      {/* pointer-events-none on the container, auto on the column that
          actually holds content: the container spans the full width and sits
          above the mark in paint order, so without this it swallowed every
          pointer move over the empty half and the model stopped responding. */}
      <div className="container-page pointer-events-none relative flex flex-col gap-10 pb-14 pt-16 lg:min-h-[42rem] lg:justify-center lg:pb-24 lg:pt-24">
        <div className="pointer-events-auto flex max-w-xl flex-col gap-6 lg:max-w-[34rem]">
          <span className="flex items-center gap-4">
            <span className="text-[11px] font-semibold uppercase tracking-[0.28em] text-accent">
              {dict.badge}
            </span>
            <span aria-hidden="true" className="h-px w-16 bg-gradient-to-r from-accent to-transparent" />
          </span>

          <h1 className="font-heading text-[2.6rem] font-bold uppercase leading-[0.95] tracking-[-0.02em] text-white sm:text-6xl lg:text-[4.25rem]">
            {dict.titleBefore}{" "}
            <span className="text-accent">{dict.titleHighlight}</span>
          </h1>

          <p className="max-w-lg text-base leading-relaxed text-muted sm:text-lg">
            {dict.subtitle}
          </p>

          <div className="flex flex-col gap-3 pt-2 sm:flex-row">
            <ArrowButton href="/contact">{dict.ctaPrimary}</ArrowButton>
            <ArrowButton href="/projects" variant="outline">
              {dict.ctaSecondary}
            </ArrowButton>
          </div>

          <div className="flex items-center gap-4 pt-6">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-primary/40 bg-primary/10 text-accent">
              <Icon name="globe" className="h-5 w-5" />
            </span>
            <span className="flex flex-col">
              <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-white">
                {dict.basedIn}
              </span>
              <span className="text-[11px] uppercase tracking-[0.14em] text-muted">
                {dict.worldwide}
              </span>
            </span>
            <span
              aria-hidden="true"
              className="hidden h-px flex-1 bg-gradient-to-r from-white/20 to-transparent sm:block"
            />
          </div>
        </div>

        {/* On narrow screens the mark moves into the flow, under the copy. */}
        {isWide === false && (
          <div className="pointer-events-auto relative mx-auto aspect-square w-full max-w-md">
            {mark}
          </div>
        )}
      </div>

      {webGLSupported === true && (
        <p className="pointer-events-none absolute bottom-8 end-6 hidden flex-col items-end gap-2 text-[10px] uppercase tracking-[0.22em] text-muted/70 xl:flex">
          <span>{dict.scroll}</span>
          <span aria-hidden="true" className="h-12 w-px bg-gradient-to-b from-muted/50 to-transparent" />
        </p>
      )}
    </section>
  );
}

function Mark({
  webGLSupported,
  reducedMotion,
  scrollProgressRef,
  lowPower,
}: {
  webGLSupported: boolean | null;
  reducedMotion: boolean;
  scrollProgressRef: React.RefObject<number>;
  lowPower: boolean;
}) {
  if (webGLSupported === false) return <StaticZFallback />;
  if (webGLSupported === null) return <div className="h-full w-full" />;

  return (
    <SceneErrorBoundary>
      <Suspense fallback={<StaticZFallback />}>
        <Scene3D
          reducedMotion={reducedMotion}
          scrollProgressRef={scrollProgressRef}
          lowPower={lowPower}
        />
      </Suspense>
    </SceneErrorBoundary>
  );
}
