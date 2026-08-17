import Image from "next/image";

import { IMAGES } from "@/lib/assets";

const TILES = [
  "product-headphones",
  "product-earbuds",
  "product-speaker",
  "product-watch",
] as const;

export function StorePreview({ className = "" }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={`relative overflow-hidden bg-slate-50 transition-transform duration-500 group-hover:scale-[1.03] ${className}`}
    >
      <div className="flex items-center justify-between px-4 py-3">
        <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-900">
          Nordwave
        </span>
        <span className="rounded-full border border-slate-300 px-2.5 py-1 text-[9px] font-semibold uppercase tracking-wider text-blue-700">
          Cart
        </span>
      </div>
      <div className="grid grid-cols-4 gap-1.5 px-4 pb-4">
        {TILES.map((key) => (
          <div key={key} className="relative h-12 overflow-hidden rounded-md bg-slate-200">
            <Image
              src={IMAGES[key].src}
              alt=""
              fill
              loading="lazy"
              sizes="90px"
              className="object-cover"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
