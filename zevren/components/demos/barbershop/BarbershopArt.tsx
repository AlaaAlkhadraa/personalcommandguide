/**
 * Visual pieces for the barbershop concept. No photography is available in
 * this environment, so the shop shots are drawn as flat scenes in the same
 * black / brass palette.
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
export function ShopBackdrop({ className = "" }: { className?: string }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 1200 600" preserveAspectRatio="xMidYMid slice" className={className}>
      <defs>
        <linearGradient id="bs-wall" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#151517" />
          <stop offset="100%" stopColor="#0B0B0C" />
        </linearGradient>
      </defs>
      <rect width="1200" height="600" fill="url(#bs-wall)" />
      {/* mirrors */}
      {[160, 500, 840].map((x) => (
        <g key={x}>
          <rect x={x} y="90" width="220" height="270" rx="110" fill="#101012" stroke={BRASS} strokeOpacity="0.35" strokeWidth="3" />
          <rect x={x + 24} y="120" width="172" height="210" rx="86" fill="#17171a" />
        </g>
      ))}
      {/* counter */}
      <rect y="392" width="1200" height="18" fill="#1b1b1e" />
      <rect y="410" width="1200" height="190" fill="#0E0E10" />
      {/* chairs */}
      {[270, 610, 950].map((x) => (
        <g key={x} opacity="0.85">
          <rect x={x - 60} y="430" width="120" height="70" rx="14" fill="#1d1d21" />
          <rect x={x - 46} y="500" width="92" height="16" rx="8" fill="#151518" />
          <rect x={x - 10} y="516" width="20" height="60" fill="#151518" />
          <rect x={x - 52} y="576" width="104" height="12" rx="6" fill={BRASS} opacity="0.5" />
        </g>
      ))}
      {/* warm bulbs */}
      {[100, 380, 660, 940, 1150].map((x) => (
        <circle key={x} cx={x} cy="48" r="9" fill={BRASS} opacity="0.55" />
      ))}
    </svg>
  );
}

const GALLERY_VARIANTS = ["chair", "tools", "counter", "pole", "mirror", "sign"] as const;
export type GalleryVariant = (typeof GALLERY_VARIANTS)[number];
export const GALLERY_SET: GalleryVariant[] = [...GALLERY_VARIANTS];

/** Square tile used in the gallery grid. */
export function GalleryTile({ variant, className = "" }: { variant: GalleryVariant; className?: string }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 200 200" preserveAspectRatio="xMidYMid slice" className={className}>
      <rect width="200" height="200" fill="#111113" />
      {variant === "chair" && (
        <g>
          <rect x="45" y="70" width="110" height="60" rx="14" fill="#1e1e22" />
          <rect x="58" y="130" width="84" height="14" rx="7" fill="#17171a" />
          <rect x="92" y="144" width="16" height="40" fill="#17171a" />
          <rect x="60" y="184" width="80" height="10" rx="5" fill={BRASS} opacity="0.55" />
          <circle cx="100" cy="46" r="16" fill="#26262b" />
        </g>
      )}
      {variant === "tools" && (
        <g stroke={BRASS} strokeWidth="4" fill="none" opacity="0.8">
          <circle cx="62" cy="140" r="14" />
          <circle cx="112" cy="140" r="14" />
          <path d="M72 130 140 55M102 130 34 55" />
        </g>
      )}
      {variant === "counter" && (
        <g>
          <rect y="120" width="200" height="12" fill="#1d1d21" />
          <rect y="132" width="200" height="68" fill="#141416" />
          {[40, 75, 110, 145].map((x, i) => (
            <rect key={x} x={x} y={92 - i * 4} width="14" height="28" rx="4" fill={BRASS} opacity="0.45" />
          ))}
        </g>
      )}
      {variant === "pole" && (
        <g>
          <rect x="82" y="30" width="36" height="140" rx="18" fill="#1a1a1e" stroke={BRASS} strokeWidth="2" />
          {[0, 1, 2, 3, 4].map((i) => (
            <path key={i} d={`M82 ${50 + i * 26} 118 ${36 + i * 26}`} stroke={BRASS} strokeWidth="7" opacity="0.55" />
          ))}
        </g>
      )}
      {variant === "mirror" && (
        <g>
          <rect x="45" y="25" width="110" height="150" rx="55" fill="#17171a" stroke={BRASS} strokeOpacity="0.5" strokeWidth="3" />
          <rect x="63" y="45" width="74" height="110" rx="37" fill="#1f1f24" />
        </g>
      )}
      {variant === "sign" && (
        <g>
          <rect x="28" y="70" width="144" height="60" rx="8" fill="#17171a" stroke={BRASS} strokeOpacity="0.6" strokeWidth="2" />
          <path d="M52 100h96" stroke={BRASS} strokeWidth="6" opacity="0.7" />
          <path d="M62 86h76M62 114h60" stroke="#3a3a40" strokeWidth="4" />
        </g>
      )}
    </svg>
  );
}
