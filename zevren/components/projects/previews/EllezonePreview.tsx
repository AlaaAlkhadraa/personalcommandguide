import Image from "next/image";

/**
 * ElleZone, the single-product webshop concept.
 *
 * The card used to be the product photograph with a label dropped on top,
 * which told you nothing about the site. It is now the product page itself:
 * the variant swatches, the price and the button, with the photograph doing
 * the work it does on a real webshop. Palette, name and price are the
 * webshop demo's own.
 */
const INK = "#241F2E";
const PLUM = "#5B4A93";

const COLOURS = ["#FFFFFF", "#3A3A3A"];

export function EllezonePreview({ className = "" }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={`relative overflow-hidden bg-white transition-transform duration-500 group-hover:scale-[1.03] ${className}`}
    >
      <div className="flex items-center justify-between border-b border-[#E4DFF0] px-4 py-2.5">
        <span
          className="text-[11px] font-extrabold uppercase tracking-[0.16em]"
          style={{ color: INK }}
        >
          Elle<span className="font-light" style={{ color: PLUM }}>Zone</span>
        </span>
        <span
          className="rounded-full border px-2.5 py-1 text-[8px] font-bold uppercase tracking-[0.12em]"
          style={{ borderColor: "#E4DFF0", color: PLUM }}
        >
          Cart
        </span>
      </div>

      <div className="grid grid-cols-[1fr_0.78fr] items-stretch gap-3 px-4 py-3">
        <div>
          <p className="text-[9px] uppercase tracking-[0.16em]" style={{ color: PLUM }}>
            Kitchen storage
          </p>
          <p
            className="mt-1 text-[14px] font-extrabold leading-tight tracking-[-0.02em]"
            style={{ color: INK }}
          >
            Spice jar with a
            <br />
            built-in scoop
          </p>

          <div className="mt-2 flex items-center gap-1.5">
            {COLOURS.map((hex) => (
              <span
                key={hex}
                className="h-3 w-3 rounded-full ring-1 ring-black/20"
                style={{ backgroundColor: hex }}
              />
            ))}
            <span className="text-[8px] uppercase tracking-[0.12em] text-[#6B6577]">2 colours</span>
          </div>

          <div className="mt-2.5 flex items-center gap-2">
            <span
              className="rounded-full px-3 py-1 text-[8px] font-bold uppercase tracking-[0.12em] text-white"
              style={{ backgroundColor: PLUM }}
            >
              Add to cart
            </span>
            <span
              className="text-[12px] font-extrabold tracking-[-0.02em]"
              style={{ color: INK }}
            >
              &euro;12,95
            </span>
          </div>
        </div>

        <div className="relative min-h-[92px] overflow-hidden rounded-lg bg-[#EFEBF7]">
          <Image
            src="/ellezone/spice-jar-lifestyle.jpg"
            alt=""
            fill
            loading="lazy"
            sizes="200px"
            className="object-cover object-[50%_62%]"
          />
        </div>
      </div>
    </div>
  );
}
