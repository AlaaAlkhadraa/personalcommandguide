"use client";

import { Suspense, useEffect, useRef } from "react";
import Link from "next/link";
import { useWebGLSupport } from "@/lib/hooks/use-webgl-support";
import { useReducedMotion } from "@/lib/hooks/use-reduced-motion";
import { StaticZFallback } from "@/components/three/StaticZFallback";
import { Reveal } from "@/components/three/Reveal";
import { Scene3D } from "@/components/three/Scene3D";

const CAPABILITIES = [
  {
    title: "Websites",
    body: "Modern, fast websites designed around your business and your customers.",
  },
  {
    title: "Online stores",
    body: "Ecommerce built for a clear path from browsing to checkout.",
  },
  {
    title: "Web applications",
    body: "Dashboards, portals and tools built around your specific process.",
  },
];

export function Hero3D() {
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
    <div className="bg-[#040611] text-white">
      <section className="relative min-h-[92svh] overflow-hidden">
        <div className="absolute inset-0">
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

        <div className="pointer-events-none absolute inset-0 z-10 flex flex-col items-center justify-center px-6 py-24 text-center">
          <span className="rounded-full border border-white/15 bg-white/5 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.25em] text-blue-300">
            Experimental
          </span>
          <h1 className="mt-4 max-w-2xl text-4xl font-semibold leading-[1.1] sm:text-6xl">
            Websites, built like objects.
          </h1>
          <p className="mt-5 max-w-lg text-base leading-relaxed text-white/60 sm:text-lg">
            An independent web studio based in Maastricht, working with
            businesses worldwide.
          </p>
          <div className="pointer-events-auto mt-8 flex flex-col gap-4 sm:flex-row">
            <Link
              href="/contact"
              className="rounded-full bg-blue-500 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-blue-400"
            >
              Start a project
            </Link>
            <Link
              href="/projects"
              className="rounded-full border border-white/20 px-6 py-3 text-sm font-semibold text-white transition-colors hover:border-white/40"
            >
              See our work
            </Link>
          </div>
        </div>

        <div className="pointer-events-none absolute inset-x-0 bottom-6 z-10 flex justify-center">
          <span className="text-[11px] uppercase tracking-[0.3em] text-white/30">
            Scroll
          </span>
        </div>
      </section>

      <section className="border-t border-white/10 px-6 py-24 sm:px-10">
        <Reveal className="mx-auto max-w-3xl text-center">
          <span className="text-xs font-semibold uppercase tracking-[0.3em] text-blue-300">
            What we build
          </span>
          <h2 className="mt-4 text-3xl font-semibold sm:text-4xl">
            One studio, a small set of things done properly.
          </h2>
        </Reveal>
        <div className="mx-auto mt-14 grid max-w-4xl gap-6 sm:grid-cols-3">
          {CAPABILITIES.map((item, index) => (
            <Reveal key={item.title} className={`delay-${index * 100}`}>
              <div className="h-full rounded-2xl border border-white/10 bg-white/[0.03] p-6">
                <h3 className="text-base font-semibold text-white">
                  {item.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-white/55">
                  {item.body}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="border-t border-white/10 px-6 py-24 text-center sm:px-10">
        <Reveal className="mx-auto max-w-xl">
          <h2 className="text-3xl font-semibold sm:text-4xl">
            This is an experiment.
          </h2>
          <p className="mt-4 text-white/55">
            The main ZEVREN website is what&apos;s live today. This page is a
            preview of a more cinematic direction we&apos;re exploring.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href="/"
              className="rounded-full bg-blue-500 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-blue-400"
            >
              Back to the current site
            </Link>
            <Link
              href="/contact"
              className="rounded-full border border-white/20 px-6 py-3 text-sm font-semibold text-white transition-colors hover:border-white/40"
            >
              Tell us what you think
            </Link>
          </div>
        </Reveal>
      </section>
    </div>
  );
}
