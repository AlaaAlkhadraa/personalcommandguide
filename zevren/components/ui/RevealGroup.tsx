"use client";

import { useGsapReveal } from "@/lib/hooks/use-gsap-reveal";

/**
 * Wraps a section so anything inside carrying `data-reveal` animates in on
 * scroll. Kept as a thin client boundary on purpose: the sections themselves
 * stay server components and only this wrapper ships JS.
 *
 * Optional `data-reveal-delay` (seconds) on a child staggers it.
 */
export function RevealGroup({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const scope = useGsapReveal<HTMLDivElement>();
  return (
    <div ref={scope} className={className}>
      {children}
    </div>
  );
}
