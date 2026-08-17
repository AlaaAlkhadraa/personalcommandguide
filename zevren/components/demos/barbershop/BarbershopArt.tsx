import Image from "next/image";

import { IMAGES, type ImageKey } from "@/lib/assets";

/**
 * Visual pieces for the Ironside concept. The interior photography supplied
 * with the concept carries the hero and the gallery; the mark and the icons
 * stay drawn so they scale and take the brass colour from one place.
 */

export const BRASS = "#C9A55F";

export function ShopLogo({ className = "" }: { className?: string }) {
  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      <svg viewBox="0 0 24 24" className="h-6 w-6" aria-hidden="true">
        <rect x="8" y="2" width="8" height="20" rx="4" fill="#141416" stroke={BRASS} strokeWidth="1.4" />
        <path d="M8 7l8-4M8 12l8-4M8 17l8-4M8 22l8-4" stroke={BRASS} strokeWidth="1.2" opacity="0.7" />
      </svg>
      <span className="font-heading text-[17px] font-bold uppercase tracking-[0.22em] text-[#F2EFE9]">
        Iron<span style={{ color: BRASS }}>side</span>
      </span>
    </span>
  );
}

export function ShopIcon({ name, className = "" }: { name: string; className?: string }) {
  const c = {
    viewBox: "0 0 24 24",
    fill: "none" as const,
    stroke: "currentColor",
    strokeWidth: 1.6,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    className,
  };
  if (name === "scissors")
    return (
      <svg {...c}>
        <circle cx="6" cy="18" r="2.6" />
        <circle cx="18" cy="18" r="2.6" />
        <path d="M8 16 19 4M16 16 5 4" />
      </svg>
    );
  if (name === "razor")
    return (
      <svg {...c}>
        <path d="M4 20 14 10l4 4L8 24" transform="translate(0 -4)" />
        <path d="M15 5.5 18.5 9" />
        <path d="M13 3.5 20.5 11" />
      </svg>
    );
  if (name === "clock")
    return (
      <svg {...c}>
        <circle cx="12" cy="12" r="8.5" />
        <path d="M12 7.5V12l3 2" />
      </svg>
    );
  if (name === "pin")
    return (
      <svg {...c}>
        <path d="M12 21s7-5.2 7-10.4A7 7 0 0 0 5 10.6C5 15.8 12 21 12 21Z" />
        <circle cx="12" cy="10.4" r="2.4" />
      </svg>
    );
  if (name === "phone")
    return (
      <svg {...c}>
        <path d="M6.5 3.5h3l1.5 4-2 1.4a12 12 0 0 0 6.1 6.1l1.4-2 4 1.5v3a2 2 0 0 1-2.2 2A17 17 0 0 1 4.5 5.7a2 2 0 0 1 2-2.2Z" />
      </svg>
    );
  if (name === "mail")
    return (
      <svg {...c}>
        <rect x="3" y="5.5" width="18" height="13" rx="2" />
        <path d="m3.5 7 8.5 6 8.5-6" />
      </svg>
    );
  return (
    <svg {...c}>
      <path d="M5 12h13M13 6.5 18.5 12 13 17.5" />
    </svg>
  );
}

export function Star({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 20 20" fill="currentColor" className={className} aria-hidden="true">
      <path d="M10 1.5 12.6 7l6 .9-4.3 4.2 1 6-5.3-2.8L4.7 18.1l1-6L1.4 7.9l6-.9Z" />
    </svg>
  );
}

/** Wide shot used behind the hero. */
/**
 * The room the concept is set in. This is the photograph supplied with the
 * concept rather than a drawing of one, so the hero carries the weight the
 * design intends. The caller positions this layer, which already gives the
 * fill image its containing block.
 */
export function ShopBackdrop({ className = "" }: { className?: string }) {
  const shot = IMAGES["barber-hero"];
  return (
    <div aria-hidden="true" className={className}>
      <Image
        src={shot.src}
        alt=""
        fill
        priority
        sizes="100vw"
        placeholder="blur"
        blurDataURL={shot.blurDataURL}
        className="object-cover object-[58%_center]"
      />
    </div>
  );
}

/**
 * The gallery. Every frame is a real photograph of the shop: four details
 * from the supplied interior and two from the second room, warmed to the
 * same light so the set reads as one place.
 */
export const GALLERY_SET = [
  "barber-chair",
  "barber-mirrors",
  "barber-sign",
  "barber-stations",
  "barber-shelf",
  "barber-lounge",
] as const satisfies readonly ImageKey[];

export type GalleryVariant = (typeof GALLERY_SET)[number];

/** Square tile used in the gallery grid. */
export function GalleryTile({ variant, className = "" }: { variant: GalleryVariant; className?: string }) {
  const shot = IMAGES[variant];
  return (
    <div aria-hidden="true" className={`${className} relative overflow-hidden bg-[#111113]`}>
      <Image
        src={shot.src}
        alt=""
        fill
        loading="lazy"
        sizes="(max-width: 640px) 50vw, 33vw"
        placeholder="blur"
        blurDataURL={shot.blurDataURL}
        className="object-cover transition-transform duration-700 hover:scale-105"
      />
    </div>
  );
}
