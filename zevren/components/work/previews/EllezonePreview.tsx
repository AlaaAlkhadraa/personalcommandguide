import Image from "next/image";

export function EllezonePreview({ className = "" }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={`relative overflow-hidden bg-white transition-transform duration-500 group-hover:scale-[1.03] ${className}`}
    >
      <Image
        src="/ellezone/spice-jar-product-box.jpg"
        alt=""
        fill
        className="object-cover"
        sizes="(max-width: 640px) 100vw, 480px"
      />
      <div className="absolute inset-x-0 top-0 flex items-center justify-between bg-gradient-to-b from-black/40 to-transparent px-4 py-3">
        <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-white">
          ElleZone
        </span>
      </div>
    </div>
  );
}
