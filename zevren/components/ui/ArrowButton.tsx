import Link from "next/link";
import type { ReactNode } from "react";

/**
 * The squared-off call to action used in the hero and the final CTA.
 *
 * Separate from Button rather than a variant of it, because the rounded pill
 * is still the right shape everywhere else on the site and mixing the two
 * inside one component would mean every caller picks a geometry.
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
  const styles =
    variant === "primary"
      ? "bg-primary text-white hover:bg-primary-light hover:shadow-glow"
      : "border border-white/25 text-white hover:border-accent hover:bg-white/5";

  return (
    <Link
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
