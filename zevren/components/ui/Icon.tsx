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
  globe:
    "M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18ZM3 12h18M12 3a14 14 0 0 1 0 18 14 14 0 0 1 0-18Z",
  home: "M4 11 12 4l8 7M6 10v9h12v-9",
  grid: "M4 4h7v7H4zM13 4h7v7h-7zM4 13h7v7H4zM13 13h7v7h-7z",
  info: "M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18ZM12 11v5M12 8h.01",
  mail: "M3 6h18v12H3zM3 7l9 6 9-6",
  user: "M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8ZM4 20a8 8 0 0 1 16 0",
  building: "M4 20V6l7-3v17M11 20h9V10l-9-3M7 9h.01M7 13h.01M15 12h.01M15 16h.01",
  route: "M6 20V9a3 3 0 0 1 3-3h6a3 3 0 0 0 3-3M6 20a2 2 0 1 1 0-4 2 2 0 0 1 0 4Z",
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
