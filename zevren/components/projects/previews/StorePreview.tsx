import Image from "next/image";

import { IMAGES } from "@/lib/assets";

/**
 * Nordwave, the audio store concept.
 *
 * A product page rather than a grid of thumbnails: one product, its price
 * and the button that puts it in the basket. Light, because the store demo
 * is light and the card should look like the page it opens. The image is the
 * crafted lineup render, on the same ice backdrop the demo uses.
 *
 * Name, copy and price come from the store data. There is deliberately no
 * rating or review count here: those would be invented.
 */
const SWATCHES = ["#10151E", "#2E55CE"];

export function StorePreview({ className = "" }: { className?: string }) {
  const shot = IMAGES["store-lineup"];

  return (
    <div
      aria-hidden="true"
      className={`relative overflow-hidden bg-[#F5F7FA] transition-transform duration-500 group-hover:scale-[1.03] ${className}`}
    >
      <div className="flex items-center justify-between border-b border-slate-200 bg-white px-4 py-2.5">
        <span className="font-heading text-[11px] font-bold tracking-[0.08em] text-[#10151E]">
          NORD<span className="font-light text-[#2E55CE]">WAVE</span>
        </span>
        <div className="flex items-center gap-2.5">
          <span className="hidden text-[8px] font-medium uppercase tracking-[0.12em] text-slate-400 sm:inline">
            Headphones
          </span>
          <span className="hidden text-[8px] font-medium uppercase tracking-[0.12em] text-slate-400 sm:inline">
            Hi-Fi
          </span>
          <span className="rounded-full border border-slate-300 px-2.5 py-1 text-[8px] font-bold uppercase tracking-[0.12em] text-[#2E55CE]">
            Cart 1
          </span>
        </div>
      </div>

      <div className="grid grid-cols-[1fr_0.82fr] items-stretch gap-3 px-4 py-3">
        <div>
          <p className="text-[9px] uppercase tracking-[0.16em] text-[#2E55CE]">Headphones</p>
          <p className="mt-1 text-[15px] font-extrabold leading-tight tracking-[-0.03em] text-[#10151E]">
            Arc One
          </p>
          <p className="mt-1 text-[9px] leading-snug text-slate-500">
            Adaptive noise cancelling, 40 hour battery.
          </p>

          <div className="mt-2 flex items-center gap-1.5">
            {SWATCHES.map((colour) => (
              <span
                key={colour}
                className="h-3 w-3 rounded-full ring-1 ring-black/15"
                style={{ backgroundColor: colour }}
              />
            ))}
            <span className="text-[8px] uppercase tracking-[0.12em] text-slate-400">2 colours</span>
          </div>

          <div className="mt-2.5 flex items-center gap-2">
            <span className="rounded-full bg-[#2E55CE] px-3 py-1 text-[8px] font-bold uppercase tracking-[0.12em] text-white">
              Add to cart
            </span>
            <span className="text-[12px] font-extrabold tracking-[-0.02em] text-[#10151E]">
              &euro;329
            </span>
          </div>
        </div>

        <div className="relative min-h-[92px] overflow-hidden rounded-lg border border-slate-200 bg-white">
          <Image
            src={shot.src}
            alt=""
            fill
            loading="lazy"
            sizes="200px"
            placeholder="blur"
            blurDataURL={shot.blurDataURL}
            className="object-cover object-[50%_58%]"
          />
        </div>
      </div>
    </div>
  );
}
