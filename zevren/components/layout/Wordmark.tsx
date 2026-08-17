import Image from "next/image";

/**
 * The ZEVREN lockup.
 *
 * The wordmark is the supplied logo artwork, cropped to the letters alone.
 * The discipline line underneath is live text rather than part of the image:
 * the supplied file carries a "Creative Solutions" strapline, the site says
 * "Web design & development", and keeping it as text means it also
 * translates and stays crisp at any size.
 *
 * The image is decorative because the accessible name comes from the text
 * that wraps it, so screen readers hear the brand once, not twice.
 */
export function Wordmark({
  discipline,
  size = "md",
  priority = false,
}: {
  discipline: string;
  /** `sm` is the footer and mobile menu, `md` the header. */
  size?: "sm" | "md";
  priority?: boolean;
}) {
  const markHeight = size === "sm" ? "h-4" : "h-5";
  const disciplineSize = size === "sm" ? "text-[8px]" : "text-[9px]";

  return (
    <span className="flex flex-col gap-1.5 leading-none">
      <Image
        src="/zevren-wordmark.png"
        alt=""
        aria-hidden="true"
        width={1200}
        height={155}
        priority={priority}
        sizes="220px"
        className={`${markHeight} w-auto drop-shadow-[0_0_14px_rgba(37,99,235,0.45)] transition-[filter] duration-300 group-hover:drop-shadow-[0_0_20px_rgba(96,165,250,0.65)]`}
      />
      <span className="sr-only">ZEVREN</span>
      <span
        aria-hidden="true"
        className={`${disciplineSize} font-medium uppercase tracking-[0.26em] text-accent`}
      >
        {discipline}
      </span>
    </span>
  );
}
