/**
 * Visual building blocks for the Tajex concept.
 *
 * The real tajexlogistics.nl uses photography (a branded trailer, container
 * terminals, aerial port shots). This environment has no network access, so
 * those photos are drawn as flat SVG scenes instead. They occupy the same
 * slots and keep the same navy / crimson palette.
 */

export const TAJEX_NAVY = "#131B3E";
export const TAJEX_RED = "#E8264C";

export function TajexLogo({ dark = false, className = "" }: { dark?: boolean; className?: string }) {
  const word = dark ? "#FFFFFF" : "#131B3E";
  return (
    <span className={`inline-flex flex-col leading-none ${className}`}>
      <span
        className="text-[22px] font-extrabold tracking-[-0.03em]"
        style={{ color: word, fontStretch: "condensed" }}
      >
        <span style={{ display: "inline-block", transform: "skewX(-6deg)" }}>TAJE</span>
        <span style={{ color: TAJEX_RED, display: "inline-block", transform: "skewX(-6deg)" }}>X</span>
      </span>
      <span
        className="-mt-0.5 self-end text-[9px] font-semibold italic tracking-tight"
        style={{ color: TAJEX_RED }}
      >
        Logistics
      </span>
    </span>
  );
}

export function CargoIcon({ name, className = "" }: { name: string; className?: string }) {
  const common = {
    viewBox: "0 0 24 24",
    fill: "none" as const,
    stroke: "currentColor",
    strokeWidth: 1.7,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    className,
  };
  if (name === "car") {
    return (
      <svg {...common}>
        <path d="M4 15v2M20 15v2M3 14l1.6-4.3A2 2 0 0 1 6.5 8.4h11a2 2 0 0 1 1.9 1.3L21 14v1.5a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V14Z" />
        <path d="M6.5 12h11" />
      </svg>
    );
  }
  if (name === "truck") {
    return (
      <svg {...common}>
        <path d="M2 7.5h11v9H2z" />
        <path d="M13 10.5h4l3 3v3h-7z" />
        <circle cx="6.5" cy="17.5" r="1.6" />
        <circle cx="17" cy="17.5" r="1.6" />
      </svg>
    );
  }
  if (name === "container") {
    return (
      <svg {...common}>
        <rect x="3" y="7" width="18" height="10" rx="1" />
        <path d="M8 7v10M12 7v10M16 7v10" />
      </svg>
    );
  }
  return (
    <svg {...common}>
      <path d="M4 8h16v5H4z" />
      <path d="M6 13v4M12 13v4M18 13v4M4 17h16" />
    </svg>
  );
}

export function ContactIcon({ name, className = "" }: { name: string; className?: string }) {
  const common = {
    viewBox: "0 0 24 24",
    fill: "none" as const,
    stroke: "currentColor",
    strokeWidth: 1.7,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    className,
  };
  if (name === "pin") {
    return (
      <svg {...common}>
        <path d="M12 21s7-5.2 7-10.4A7 7 0 0 0 5 10.6C5 15.8 12 21 12 21Z" />
        <circle cx="12" cy="10.4" r="2.4" />
      </svg>
    );
  }
  if (name === "mail") {
    return (
      <svg {...common}>
        <rect x="3" y="5.5" width="18" height="13" rx="2" />
        <path d="m3.5 7 8.5 6 8.5-6" />
      </svg>
    );
  }
  if (name === "phone") {
    return (
      <svg {...common}>
        <path d="M6.5 3.5h3l1.5 4-2 1.4a12 12 0 0 0 6.1 6.1l1.4-2 4 1.5v3a2 2 0 0 1-2.2 2A17 17 0 0 1 4.5 5.7a2 2 0 0 1 2-2.2Z" />
      </svg>
    );
  }
  return (
    <svg {...common}>
      <circle cx="11" cy="11" r="6.5" />
      <path d="m16 16 4.5 4.5" />
    </svg>
  );
}

export function SearchIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2.2}
      strokeLinecap="round"
      className={className}
    >
      <circle cx="11" cy="11" r="6.5" />
      <path d="m16 16 4.5 4.5" />
    </svg>
  );
}

export function CheckIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2.4}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="m4 12.5 5 5L20 6.5" />
    </svg>
  );
}

export function ArrowIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M5 12h13M13 6.5 18.5 12 13 17.5" />
    </svg>
  );
}

export function ChevronIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="m6 9.5 6 6 6-6" />
    </svg>
  );
}

export function SocialIcon({ name, className = "" }: { name: string; className?: string }) {
  if (name === "facebook") {
    return (
      <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
        <path d="M13.5 21v-8h2.7l.4-3.1h-3.1V7.9c0-.9.25-1.5 1.55-1.5H16.7V3.6c-.3-.04-1.3-.13-2.47-.13-2.44 0-4.11 1.49-4.11 4.23V9.9H7.4V13h2.72v8h3.38Z" />
      </svg>
    );
  }
  if (name === "linkedin") {
    return (
      <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
        <path d="M6.94 8.5H4V20h2.94V8.5ZM5.47 4a1.7 1.7 0 1 0 0 3.4 1.7 1.7 0 0 0 0-3.4ZM20 13.7c0-3.1-1.66-4.55-3.87-4.55-1.79 0-2.59.98-3.03 1.67V8.5H10.2V20h2.9v-6.13c0-1.36.26-2.68 1.94-2.68 1.66 0 1.68 1.55 1.68 2.77V20H20v-6.3Z" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M17.2 3.5h2.9l-6.35 7.26L21.5 20.5h-5.9l-4.6-6.02-5.27 6.02H2.8l6.8-7.77L2.6 3.5h6.05l4.17 5.51 4.38-5.51Zm-1.02 15.2h1.6L7.9 5.2H6.18l10 13.5Z" />
    </svg>
  );
}

/* --------------------------------------------------------------------- */
/* Generated scenes, standing in for the photography on the real site.     */
/* --------------------------------------------------------------------- */

/** Port skyline used behind the navy hero and page headers. */
export function PortBackdrop({ className = "" }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 1440 620"
      preserveAspectRatio="xMidYMax slice"
      className={className}
    >
      <g opacity="0.5" fill="none" stroke="#5b6a9c" strokeWidth="3">
        {/* gantry cranes */}
        {[120, 430, 760, 1090].map((x, i) => (
          <g key={x} transform={`translate(${x} ${330 + (i % 2) * 24})`}>
            <path d="M0 240V60h250v180" />
            <path d="M-60 60h370" />
            <path d="M60 60v90M190 60v90" />
            <path d="M125 60v40" />
          </g>
        ))}
      </g>
      {/* container stacks */}
      <g opacity="0.45">
        {Array.from({ length: 46 }).map((_, i) => {
          const col = i % 23;
          const row = Math.floor(i / 23);
          return (
            <rect
              key={i}
              x={30 + col * 62}
              y={548 - row * 26}
              width="54"
              height="22"
              rx="2"
              fill={["#2b3a6e", "#33427a", "#25325f"][i % 3]}
            />
          );
        })}
      </g>
    </svg>
  );
}

/** The branded trailer shot on the home page and contact page. */
export function TrailerScene({ label = "TAJEX", className = "" }: { label?: string; className?: string }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 720 380" preserveAspectRatio="xMidYMid slice" className={className}>
      <defs>
        <linearGradient id="tjx-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#16204a" />
          <stop offset="60%" stopColor="#37477c" />
          <stop offset="100%" stopColor="#7d8bb2" />
        </linearGradient>
        <linearGradient id="tjx-road" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#4d5773" />
          <stop offset="100%" stopColor="#1e2539" />
        </linearGradient>
        <linearGradient id="tjx-trailer" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#3149ad" />
          <stop offset="100%" stopColor="#182872" />
        </linearGradient>
      </defs>
      <rect width="720" height="380" fill="url(#tjx-sky)" />
      {/* low sun on the horizon */}
      <ellipse cx="540" cy="228" rx="250" ry="52" fill="#e8a24c" opacity="0.4" />
      <rect y="232" width="720" height="148" fill="url(#tjx-road)" />
      <path d="M0 232h720" stroke="#f0c58a" strokeOpacity="0.35" strokeWidth="3" />
      {/* motion streaks on the tarmac */}
      <g stroke="#ffffff" strokeOpacity="0.28" strokeWidth="4" strokeLinecap="round">
        <path d="M20 320h170M240 344h130M0 362h110M420 356h230M540 330h150" />
      </g>
      {/* truck, driving away from the viewer to the right */}
      <g>
        <rect x="60" y="96" width="400" height="132" rx="7" fill="url(#tjx-trailer)" />
        <rect x="60" y="96" width="400" height="132" rx="7" fill="none" stroke="#ffffff" strokeOpacity="0.2" />
        <g opacity="0.14" fill="#ffffff">
          {[0, 1, 2, 3, 4, 5, 6].map((i) => (
            <rect key={i} x={72 + i * 56} y="104" width="6" height="116" />
          ))}
        </g>
        <text
          x="255"
          y="180"
          textAnchor="middle"
          fill="#ffffff"
          fontSize="62"
          fontWeight="800"
          letterSpacing="3"
          transform="skewX(-7)"
          opacity="0.95"
        >
          {label}
        </text>
        {/* cab */}
        <path d="M462 126h56l44 52v50h-100z" fill="#1f2d78" />
        <path d="M474 136h40l32 42h-72z" fill="#a8bce2" opacity="0.8" />
        <rect x="462" y="220" width="104" height="10" rx="3" fill="#141d3a" />
        <circle cx="560" cy="196" r="5" fill="#ffd8a8" opacity="0.9" />
        {/* wheels */}
        {[124, 178, 386, 452, 530].map((x) => (
          <g key={x}>
            <ellipse cx={x} cy="238" rx="21" ry="21" fill="#0e1526" />
            <circle cx={x} cy="238" r="8" fill="#39445e" />
          </g>
        ))}
        {/* shadow */}
        <ellipse cx="300" cy="256" rx="270" ry="12" fill="#0b1020" opacity="0.35" />
      </g>
    </svg>
  );
}

/** Container vessel seen from above, used on the about page and in the blog. */
export function VesselScene({ className = "" }: { className?: string }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 520 700" preserveAspectRatio="xMidYMid slice" className={className}>
      <defs>
        <linearGradient id="tjx-sea" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#0f4c73" />
          <stop offset="60%" stopColor="#14688f" />
          <stop offset="100%" stopColor="#0b3a5c" />
        </linearGradient>
      </defs>
      <rect width="520" height="700" fill="#125f86" />
      <rect width="520" height="700" fill="url(#tjx-sea)" opacity="0.8" />
      {/* swell */}
      <g stroke="#ffffff" strokeOpacity="0.12" strokeWidth="2" fill="none">
        {Array.from({ length: 14 }).map((_, i) => (
          <path key={i} d={`M-20 ${40 + i * 50} q 70 -18 140 0 t 140 0 t 140 0 t 140 0`} />
        ))}
      </g>
      {/* hull */}
      <g transform="translate(150 120) rotate(12)">
        <path d="M0 0h150v380l-75 70L0 380z" fill="#1d2842" />
        <path d="M8 12h134v352l-67 60L8 364z" fill="#2b3a5c" />
        {/* container rows */}
        {Array.from({ length: 26 }).map((_, i) => {
          const col = i % 4;
          const row = Math.floor(i / 4);
          const palette = ["#d8552f", "#e0a03a", "#2f6fae", "#c9422f", "#3c7d5a", "#c7ccd6"];
          return (
            <rect
              key={i}
              x={18 + col * 30}
              y={30 + row * 42}
              width="26"
              height="36"
              rx="2"
              fill={palette[(i * 3) % palette.length]}
              opacity="0.92"
            />
          );
        })}
        <path d="M20 336h110v34H20z" fill="#e9ecf2" opacity="0.85" />
      </g>
      {/* wake */}
      <path d="M120 520q60 60 30 170" stroke="#ffffff" strokeOpacity="0.25" strokeWidth="16" fill="none" />
    </svg>
  );
}

/** Small scene used as a blog thumbnail. */
export function PostScene({ variant, className = "" }: { variant: string; className?: string }) {
  const palettes: Record<string, [string, string]> = {
    aerial: ["#0d4f79", "#1b78a8"],
    crane: ["#12617f", "#2f93b5"],
    stack: ["#154b74", "#3f7fae"],
    roro: ["#3d4457", "#767f92"],
    network: ["#0a3d63", "#12658d"],
    control: ["#0e2a4d", "#1c5b8f"],
  };
  const pair = palettes[variant] ?? palettes.aerial!;
  const [from, to] = pair;
  const gid = `tjx-post-${variant}`;

  return (
    <svg aria-hidden="true" viewBox="0 0 420 260" preserveAspectRatio="xMidYMid slice" className={className}>
      <defs>
        <linearGradient id={gid} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={from} />
          <stop offset="100%" stopColor={to} />
        </linearGradient>
      </defs>
      <rect width="420" height="260" fill={`url(#${gid})`} />

      {variant === "aerial" && (
        <g>
          <path d="M40 40h250l60 90-60 90H40z" fill="#1f2b45" opacity="0.9" />
          {Array.from({ length: 24 }).map((_, i) => (
            <rect
              key={i}
              x={60 + (i % 8) * 30}
              y={70 + Math.floor(i / 8) * 42}
              width="26"
              height="34"
              rx="2"
              fill={["#d8552f", "#e0a03a", "#2f6fae", "#c7ccd6"][i % 4]}
              opacity="0.9"
            />
          ))}
        </g>
      )}

      {variant === "crane" && (
        <g fill="none" stroke="#6fd0e8" strokeWidth="7" opacity="0.85">
          <path d="M60 230V70h180v160" />
          <path d="M20 70h280" />
          <path d="M110 70v70M210 70v70" />
          <path d="M300 150h100v80H300z" stroke="none" fill="#12324f" />
        </g>
      )}

      {variant === "stack" && (
        <g>
          {Array.from({ length: 30 }).map((_, i) => (
            <rect
              key={i}
              x={20 + (i % 6) * 66}
              y={40 + Math.floor(i / 6) * 44}
              width="60"
              height="38"
              rx="3"
              fill={["#c9422f", "#e0a03a", "#2f6fae", "#3c7d5a", "#b8bfcc"][i % 5]}
              opacity="0.92"
            />
          ))}
        </g>
      )}

      {variant === "roro" && (
        <g>
          <rect y="150" width="420" height="110" fill="#2b3247" />
          <path d="M60 150h300l-40 -60H100z" fill="#1d2333" />
          {Array.from({ length: 10 }).map((_, i) => (
            <rect
              key={i}
              x={40 + (i % 5) * 72}
              y={i < 5 ? 60 : 105}
              width="52"
              height="26"
              rx="6"
              fill={["#d4d8e0", "#8f97a8", "#c2c8d4", "#6f7789", "#a8b0bf"][i % 5]}
            />
          ))}
        </g>
      )}

      {variant === "network" && (
        <g stroke="#8fd8f0" strokeWidth="2" fill="none" opacity="0.85">
          {[
            [70, 70],
            [190, 40],
            [320, 90],
            [120, 170],
            [260, 200],
            [370, 170],
          ].map(([cx, cy], i) => (
            <circle key={i} cx={cx} cy={cy} r="26" />
          ))}
          <path d="M70 70 190 40 320 90 260 200 120 170Z" />
          <path d="M320 90 370 170 260 200" />
        </g>
      )}

      {variant === "control" && (
        <g>
          <rect x="30" y="40" width="360" height="130" rx="6" fill="#0b2440" />
          {Array.from({ length: 6 }).map((_, i) => (
            <rect
              key={i}
              x={46 + (i % 3) * 118}
              y={56 + Math.floor(i / 3) * 58}
              width="102"
              height="44"
              rx="3"
              fill="#1e7fb0"
              opacity="0.75"
            />
          ))}
          <path d="M170 170h80v60h-80z" fill="#132c48" />
        </g>
      )}
    </svg>
  );
}

/** Flat map card standing in for the embedded map on the contact page. */
export function MapScene({ pinLabel, className = "" }: { pinLabel: string; className?: string }) {
  return (
    <div className={`relative overflow-hidden ${className}`} aria-hidden="true">
      <svg viewBox="0 0 900 300" preserveAspectRatio="none" className="h-full w-full">
        <rect width="900" height="300" fill="#eef3ea" />
        <path d="M0 0h330v300H0z" fill="#e3ecf6" />
        <path d="M330 0h570v300H330z" fill="#dceadb" />
        <g stroke="#ffffff" strokeWidth="10" fill="none">
          <path d="M0 190h900M470 0v300M180 0l60 300M700 0l-40 300" />
        </g>
        <g stroke="#c9d6c6" strokeWidth="2" fill="none">
          <path d="M0 90h900M0 250h900M300 0v300M620 0v300" />
        </g>
        {[
          [150, 70],
          [640, 60],
          [770, 120],
          [250, 240],
          [560, 250],
          [820, 220],
        ].map(([x, y], i) => (
          <circle key={i} cx={x} cy={y} r="6" fill="#98a4b5" />
        ))}
        <g transform="translate(455 120)">
          <path d="M0 40c0 0 16-16 16-26A16 16 0 0 0-16 14c0 10 16 26 16 26Z" fill="#e03a2f" />
          <circle cy="13" r="6" fill="#ffffff" />
        </g>
      </svg>
      <div className="absolute left-3 top-3 rounded-md bg-white px-3 py-2 text-[11px] leading-tight text-slate-600 shadow-sm">
        <p className="font-semibold text-slate-800">{pinLabel}</p>
        <p>Europalaan 35-12, 6199 AB</p>
        <p>Maastricht Airport</p>
      </div>
    </div>
  );
}
