import type { SVGProps } from "react";
import type { ServiceIcon } from "@/types";

const paths: Record<ServiceIcon, string> = {
  code: "M9.5 6 4 12l5.5 6M14.5 6 20 12l-5.5 6",
  cart: "M3 4h2l2.4 12.2a2 2 0 0 0 2 1.6h7.6a2 2 0 0 0 2-1.6L21 8H6M9 21a1 1 0 1 0 0-2 1 1 0 0 0 0 2ZM17 21a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z",
  wrench:
    "M14.7 6.3a4 4 0 0 1-5.4 5.4L4 17v3h3l5.3-5.3a4 4 0 0 1 5.4-5.4L14.7 6.3Z",
  compass:
    "M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18ZM15 9l-2 6-6 2 2-6 6-2Z",
  layers: "M12 3 3 8l9 5 9-5-9-5ZM3 12l9 5 9-5M3 16l9 5 9-5",
  search: "M11 19a8 8 0 1 0 0-16 8 8 0 0 0 0 16ZM21 21l-4.35-4.35",
};

export function Icon({
  name,
  className = "h-6 w-6",
  ...props
}: { name: ServiceIcon } & SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
      {...props}
    >
      <path d={paths[name]} />
    </svg>
  );
}
