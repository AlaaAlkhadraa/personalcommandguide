import type { ReactNode } from "react";

export function Card({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`rounded-2xl border border-white/10 bg-surface/60 p-8 shadow-card backdrop-blur-sm transition-colors duration-200 hover:border-primary/40 ${className}`}
    >
      {children}
    </div>
  );
}
