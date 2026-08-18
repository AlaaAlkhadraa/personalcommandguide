import type { ComponentPropsWithoutRef } from "react";

/**
 * Extends the plain div props rather than a fixed { children, className }
 * pair, so callers can also attach `data-reveal` and friends without
 * Container needing to know the reveal system exists.
 */
export function Container({
  children,
  className = "",
  ...rest
}: ComponentPropsWithoutRef<"div">) {
  return (
    <div {...rest} className={`container-page ${className}`}>
      {children}
    </div>
  );
}
