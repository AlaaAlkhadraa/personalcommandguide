import Image from "next/image";

import { IMAGES } from "@/lib/assets";

/**
 * The scene behind the 3D mark.
 *
 * Flat layers, ordered back to front: world map, city skyline, fog,
 * reflective floor, then rock cutouts. Each is dimmed and masked so it reads
 * as depth rather than as a photograph competing with the headline, and the
 * whole thing is aria-hidden because it carries no information.
 *
 * The map and the glow are anchored to the right, where the mark sits, rather
 * than to the page centre: centred, they sat behind the headline and made it
 * harder to read while doing nothing for the mark.
 *
 * These are images on purpose. Only the Z is real geometry; adding the city
 * and the rocks to the WebGL scene would multiply draw calls for a backdrop
 * that never moves.
 */
export function HeroEnvironment() {
  const map = IMAGES["env-map"];
  const city = IMAGES["env-city"];
  const fog = IMAGES["env-fog"];
  const floor = IMAGES["env-floor"];

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 select-none overflow-hidden"
    >
      {/* City skyline, pushed to the right half and kept low so the mark has
          a horizon to stand on rather than a wall behind it. */}
      <Image
        src={city.src}
        alt=""
        width={city.width}
        height={city.height}
        priority
        sizes="(max-width: 1024px) 100vw, 70vw"
        placeholder="blur"
        blurDataURL={city.blurDataURL}
        className="absolute inset-x-0 bottom-0 h-[62%] w-full object-cover opacity-65 [mask-image:linear-gradient(to_bottom,transparent,black_35%,black_82%,transparent)] lg:inset-x-auto lg:end-0 lg:w-[76%]"
      />

      {/* World map with its connection arcs, centred on the mark. */}
      <Image
        src={map.src}
        alt=""
        width={map.width}
        height={map.height}
        priority
        sizes="(max-width: 1024px) 100vw, 60vw"
        placeholder="blur"
        blurDataURL={map.blurDataURL}
        className="absolute start-1/2 top-[2%] h-auto w-[min(125%,58rem)] -translate-x-1/2 object-contain opacity-80 mix-blend-screen [mask-image:radial-gradient(ellipse_at_center,black_38%,transparent_75%)] lg:start-[64%] lg:top-[-10%] lg:w-[54rem]"
      />

      {/* Reflective floor. */}
      <Image
        src={floor.src}
        alt=""
        width={floor.width}
        height={floor.height}
        sizes="100vw"
        placeholder="blur"
        blurDataURL={floor.blurDataURL}
        className="absolute inset-x-0 bottom-0 h-[40%] w-full object-cover object-top opacity-70 [mask-image:linear-gradient(to_bottom,black,transparent_90%)]"
      />

      {/* Ground fog, softening the join between floor and city. */}
      <Image
        src={fog.src}
        alt=""
        width={fog.width}
        height={fog.height}
        sizes="100vw"
        placeholder="blur"
        blurDataURL={fog.blurDataURL}
        className="absolute inset-x-0 bottom-[4%] h-[36%] w-full object-cover opacity-45 mix-blend-screen [mask-image:linear-gradient(to_top,black,transparent)]"
      />

      {/* Glow behind the mark, so it reads as lit rather than pasted on. */}
      <div className="absolute start-[64%] top-1/2 hidden h-[40rem] w-[40rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/40 blur-[140px] lg:block" />

      {/* Floating rocks. Hidden below lg, where they only add clutter. */}
      {(
        [
          ["rock-a", "start-[42%] top-[14%] w-[9rem] xl:w-[12rem]"],
          ["rock-b", "end-[2%] top-[26%] w-[8rem] xl:w-[10.5rem]"],
          ["rock-c", "end-[22%] bottom-[14%] w-[6.5rem] xl:w-[8.5rem]"],
        ] as const
      ).map(([key, position]) => {
        const rock = IMAGES[key];
        return (
          <Image
            key={key}
            src={rock.src}
            alt=""
            width={rock.width}
            height={rock.height}
            sizes="(max-width: 1024px) 0px, 9rem"
            placeholder="blur"
            blurDataURL={rock.blurDataURL}
            className={`absolute ${position} hidden h-auto opacity-90 lg:block`}
          />
        );
      })}

      {/* Vignette, then a left wash that guarantees the headline has ground
          under it whatever the imagery behind happens to be doing. */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_66%_48%,transparent_28%,rgba(5,8,22,0.6)_82%)]" />
      <div className="absolute inset-y-0 start-0 w-full bg-gradient-to-r from-navy via-navy/85 to-transparent lg:w-[52%] lg:via-navy/60" />
      <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-navy to-transparent" />
    </div>
  );
}
