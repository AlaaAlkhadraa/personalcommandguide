import type { ButtonHTMLAttributes, ReactNode } from "react";
import Link from "next/link";

type Variant = "primary" | "secondary" | "ghost";

const baseStyles =
  "inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-semibold transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-60";

const variantStyles: Record<Variant, string> = {
  primary:
    "bg-primary text-white hover:bg-primary-light hover:shadow-glow active:scale-[0.98]",
  secondary:
    "border border-white/15 text-white hover:border-accent/60 hover:bg-white/5 active:scale-[0.98]",
  ghost: "text-muted hover:text-white",
};

interface LinkButtonProps {
  href: string;
  external?: boolean;
  variant?: Variant;
  className?: string;
  children: ReactNode;
}

export function Button({
  href,
  external,
  variant = "primary",
  className = "",
  children,
}: LinkButtonProps) {
  const styles = `${baseStyles} ${variantStyles[variant]} ${className}`;

  if (external) {
    return (
      <a
        href={href}
        className={styles}
        target="_blank"
        rel="noopener noreferrer"
      >
        {children}
      </a>
    );
  }

  return (
    <Link href={href} className={styles}>
      {children}
    </Link>
  );
}

interface SubmitButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  children: ReactNode;
}

export function SubmitButton({
  variant = "primary",
  className = "",
  children,
  ...rest
}: SubmitButtonProps) {
  const styles = `${baseStyles} ${variantStyles[variant]} ${className}`;

  return (
    <button className={styles} {...rest}>
      {children}
    </button>
  );
}
