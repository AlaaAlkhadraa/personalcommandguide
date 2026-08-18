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
    <section className="relative isolate flex min-h-[calc(100svh-5rem)] flex-col overflow-hidden bg-navy lg:block lg:min-h-0">
      <HeroEnvironment />

      {/* Two slots, one canvas. The slots are laid out with CSS so the space is
          reserved from the first paint, but only the one matching the current
          breakpoint receives the mark: two mounted canvases would mean two
          WebGL contexts and two decodes of the same model for one visible Z. */}
      <div className="pointer-events-none absolute inset-y-0 end-0 hidden w-[62%] items-center justify-center lg:flex">
        <div className="pointer-events-auto relative aspect-square w-full max-w-3xl">
          {isWide === true && mark}
        </div>
      </div>

      {/* pointer-events-none on the container, auto on the column that
          actually holds content: the container spans the full width and sits
          above the mark in paint order, so without this it swallowed every
          pointer move over the empty half and the model stopped responding. */}
      <div className="container-page pointer-events-none relative flex flex-1 flex-col gap-4 pb-7 pt-5 [@media(max-width:1023px)_and_(max-height:820px)]:gap-2.5 [@media(max-width:1023px)_and_(max-height:820px)]:pb-4 [@media(max-width:1023px)_and_(max-height:820px)]:pt-3 lg:min-h-[42rem] lg:flex-none lg:justify-center lg:gap-10 lg:pb-24 lg:pt-24">
        <div className="pointer-events-auto flex max-w-xl flex-col gap-4 [@media(max-width:1023px)_and_(max-height:820px)]:gap-2.5 lg:max-w-[34rem] lg:gap-6">
          <span className="flex items-center gap-4">
            <span className="text-[11px] font-semibold uppercase tracking-[0.28em] text-accent">
              {dict.badge}
            </span>
            <span aria-hidden="true" className="h-px w-16 bg-gradient-to-r from-accent to-transparent" />
          </span>

          <h1 className="font-heading text-[2.1rem] [@media(max-width:1023px)_and_(max-height:820px)]:text-[1.7rem] font-bold uppercase leading-[0.95] tracking-[-0.02em] text-white sm:text-6xl lg:text-[4.25rem]">
            {dict.titleBefore}{" "}
            <span className="text-accent">{dict.titleHighlight}</span>
          </h1>

          <p className="max-w-[36ch] text-[15px] [@media(max-width:1023px)_and_(max-height:820px)]:text-[13px] [@media(max-width:1023px)_and_(max-height:820px)]:max-w-[34ch] leading-snug text-muted sm:max-w-lg sm:text-lg sm:leading-relaxed">
            {dict.subtitle}
          </p>

          <div className="flex flex-col gap-2.5 pt-0.5 sm:flex-row sm:gap-3 sm:pt-2">
            <ArrowButton href="/contact">{dict.ctaPrimary}</ArrowButton>
            <ArrowButton href="/projects" variant="outline">
              {dict.ctaSecondary}
            </ArrowButton>
          </div>

          {/* Desktop keeps the location line inside the copy column. On a
              phone it belongs under the Z, so it is rendered there instead. */}
          <div className="hidden items-center gap-4 pt-6 lg:flex">
            <LocationBadge dict={dict} />
            <span
              aria-hidden="true"
              className="h-px flex-1 bg-gradient-to-r from-white/20 to-transparent"
            />
          </div>
        </div>

        {/* On a phone the mark is the lower half of the hero: full bleed to the
            screen edges, with the copy above it and the location line below. */}
        <div className="pointer-events-auto relative -mx-6 min-h-[180px] [@media(max-width:1023px)_and_(max-height:820px)]:min-h-[104px] w-[calc(100%+3rem)] flex-1 lg:hidden">
          {/* The canvas asks for height:100%, and a flex-sized parent gives it
              nothing to resolve against, so it fell back to a canvas element's
              intrinsic 150px. Absolute inset-0 makes the box definite. */}
          <div className="absolute inset-0">{isWide === false && mark}</div>
        </div>

        <div className="flex shrink-0 items-center gap-4 lg:hidden">
          <LocationBadge dict={dict} />
        </div>
      </div>


    </section>
  );
}

/** "Based in Maastricht / working with businesses worldwide". */
function LocationBadge({ dict }: { dict: Dictionary["home"]["hero"] }) {
  return (
    <>
      <span className="flex h-11 w-11 [@media(max-width:1023px)_and_(max-height:820px)]:h-9 [@media(max-width:1023px)_and_(max-height:820px)]:w-9 shrink-0 items-center justify-center rounded-full border border-primary/40 bg-primary/10 text-accent">
        <Icon name="globe" className="h-5 w-5" />
      </span>
      <span className="flex flex-col">
        <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-white">
          {dict.basedIn}
        </span>
        <span className="text-[11px] uppercase tracking-[0.14em] text-accent">
          {dict.worldwide}
        </span>
      </span>
    </>
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
