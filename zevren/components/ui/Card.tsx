import type { ComponentPropsWithoutRef } from "react";

/**
 * Extends the plain div props rather than picking out `data-*` by hand, so
 * this stays usable as a target for the reveal system (`data-reveal-item`)
 * and anything else a caller needs to attach without Card knowing about it.
 */
export function Card({
  children,
  className = "",
  ...rest
}: ComponentPropsWithoutRef<"div">) {
  return (
    <div
      {...rest}
      className={`rounded-2xl border border-white/10 bg-surface/60 p-8 shadow-card backdrop-blur-sm transition-colors duration-200 hover:border-primary/40 ${className}`}
    >
      {children}
    </div>
  );
}
