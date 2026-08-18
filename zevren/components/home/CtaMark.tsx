"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { StaticZFallback } from "@/components/three/StaticZFallback";
import { SceneErrorBoundary } from "@/components/three/SceneErrorBoundary";
import { useWebGLSupport } from "@/lib/hooks/use-webgl-support";
import { useReducedMotion } from "@/lib/hooks/use-reduced-motion";

const Scene3D = dynamic(
  () => import("@/components/three/Scene3D").then((m) => m.Scene3D),
  { ssr: false, loading: () => <StaticZFallback /> }
);

/**
 * The live mark in the closing CTA, replacing what used to be a still of the
 * old model. It reuses the hero's scene and the already-downloaded GLB, but
 * only mounts once the section has actually been scrolled near: a second
 * WebGL context is cheap when it exists only while someone is looking at it,
 * and free for everyone who never reaches the end of the page.
 *
 * The ref passed as scroll progress stays at zero on purpose: that input
 * drives the hero's scroll-away shrink, and here the mark should just stand.
 */
export function CtaMark({ className = "" }: { className?: string }) {
  const holder = useRef<HTMLDivElement>(null);
  const zeroScroll = useRef(0);
  const [near, setNear] = useState(false);
  const webGLSupported = useWebGLSupport();
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    const el = holder.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setNear(true);
          io.disconnect();
        }
      },
      { rootMargin: "300px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={holder} className={className}>
      {webGLSupported === false && <StaticZFallback />}
      {webGLSupported === true && near && (
        <SceneErrorBoundary>
          <Suspense fallback={<StaticZFallback />}>
            <Scene3D
              reducedMotion={reducedMotion}
              scrollProgressRef={zeroScroll}
              lowPower
            />
          </Suspense>
        </SceneErrorBoundary>
      )}
    </div>
  );
}
