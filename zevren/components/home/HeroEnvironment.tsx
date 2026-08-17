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
        className="absolute inset-x-0 bottom-0 h-[58%] w-full object-cover opacity-30 [mask-image:linear-gradient(to_bottom,transparent,black_40%,black_75%,transparent)] lg:inset-x-auto lg:end-0 lg:w-[72%]"
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
        className="absolute start-1/2 top-[6%] h-auto w-[min(115%,52rem)] -translate-x-1/2 object-contain opacity-45 mix-blend-screen [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_70%)] lg:start-[66%] lg:top-[-4%] lg:w-[46rem]"
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
        className="absolute inset-x-0 bottom-0 h-[38%] w-full object-cover object-top opacity-45 [mask-image:linear-gradient(to_bottom,black,transparent_88%)]"
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
        className="absolute inset-x-0 bottom-[6%] h-[34%] w-full object-cover opacity-25 mix-blend-screen [mask-image:linear-gradient(to_top,black,transparent)]"
      />

      {/* Glow behind the mark, so it reads as lit rather than pasted on. */}
      <div className="absolute start-[66%] top-1/2 hidden h-[34rem] w-[34rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/25 blur-[130px] lg:block" />

      {/* Floating rocks. Hidden below lg, where they only add clutter. */}
      {(
        [
          ["rock-a", "start-[45%] top-[16%] w-[7rem] xl:w-[9rem]"],
          ["rock-b", "end-[3%] top-[30%] w-[6rem] xl:w-[8rem]"],
          ["rock-c", "end-[26%] bottom-[16%] w-[5rem] xl:w-[6.5rem]"],
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
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_68%_50%,transparent_18%,rgba(5,8,22,0.7)_78%)]" />
      <div className="absolute inset-y-0 start-0 w-full bg-gradient-to-r from-navy via-navy/80 to-transparent lg:w-[58%] lg:via-navy/70" />
      <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-navy to-transparent" />
    </div>
  );
}
