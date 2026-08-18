"use client";

import { useEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";
import type { Group } from "three";

import { Podium } from "@/components/three/Podium";

interface ZMarkProps {
  reducedMotion: boolean;
  scrollProgressRef: React.RefObject<number>;
  /** Phones get a larger mark: the canvas is the whole lower half there. */
  lowPower?: boolean;
}

export const Z_MODEL_URL = "/models/zevren-z.glb";

/**
 * The supplied GLB is a single mesh with the glow baked into its base colour
 * texture, so out of the box it is lit but inert. We reuse that same texture
 * as an emissive map and give the surface some metalness, which makes the
 * bright blue areas actually emit and the dark stone pick up the scene's
 * environment reflections, without altering the model itself.
 */
function useTunedModel(targetSize: number) {
  // Both decoders are disabled on purpose. The model uses neither, and each
  // would otherwise fight the site's CSP: Draco's default decoder path is a
  // CDN (blocked by script-src), and meshopt instantiates WebAssembly, which
  // needs 'wasm-unsafe-eval'. Turning them off keeps the CSP strict.
  const { scene } = useGLTF(Z_MODEL_URL, false, false);

  return useMemo(() => {
    const root = scene.clone(true);

    root.traverse((child) => {
      if (!(child instanceof THREE.Mesh)) return;
      child.castShadow = true;
      child.receiveShadow = true;

      const source = child.material as THREE.MeshStandardMaterial;
      const map = source.map ?? null;

      // The emissive colour is white, not blue: the texture already contains
      // the blue glow, so tinting the emissive channel blue stains the dark
      // stone as well and the whole monument turns flat blue. White at a low
      // intensity lifts only the areas that are already bright.
      const tuned = new THREE.MeshStandardMaterial({
        map,
        emissiveMap: map,
        emissive: new THREE.Color("#ffffff"),
        emissiveIntensity: 0.62,
        metalness: 0.3,
        roughness: 0.45,
        envMapIntensity: 0.9,
        side: THREE.FrontSide,
      });

      child.material = tuned;
    });

    // Normalise: centre on X/Z, sit the base near the origin, and scale to a
    // predictable size so the hero framing does not depend on how the model
    // happened to be exported.
    const box = new THREE.Box3().setFromObject(root);
    const size = new THREE.Vector3();
    const centre = new THREE.Vector3();
    box.getSize(size);
    box.getCenter(centre);

    // Sized off the longest axis, not the height: the mark is wider than it is
    // tall once it turns, and scaling by height alone let the corners swing
    // outside the canvas and clip.
    const longest = Math.max(size.x, size.y, size.z) || 1;
    const scale = targetSize / longest;

    root.scale.setScalar(scale);
    root.position.set(
      -centre.x * scale,
      -centre.y * scale,
      -centre.z * scale
    );

    // Where the underside of the mark ends up once it is centred, so the
    // podium can sit flush against it at any target size.
    const baseY = -(size.y * scale) / 2;

    return { root, baseY };
  }, [scene, targetSize]);
}

export function ZMark({ reducedMotion, scrollProgressRef, lowPower = false }: ZMarkProps) {
  const outerRef = useRef<Group>(null);
  const innerRef = useRef<Group>(null);
  const target = useRef({ x: 0, y: 0 });
  // Entrance progress, 0 → 1 over the first second or so: the mark rises,
  // scales up and swings a quarter turn into its resting pose instead of
  // popping in fully formed. Reduced motion starts at 1, so there is no
  // entrance at all.
  const intro = useRef(reducedMotion ? 1 : 0);
  // On a phone the canvas is the entire lower half of the hero, so the mark is
  // sized to fill it. On desktop it shares the frame with the headline.
  const targetSize = lowPower ? 3.9 : 3.15;
  const { root: model, baseY } = useTunedModel(targetSize);

  // Free the GPU-side texture/geometry copies when the hero unmounts.
  useEffect(() => {
    return () => {
      model.traverse((child: THREE.Object3D) => {
        if (child instanceof THREE.Mesh) {
          child.geometry?.dispose?.();
          const m = child.material as THREE.Material | THREE.Material[];
          if (Array.isArray(m)) m.forEach((mm) => mm.dispose());
          else m?.dispose?.();
        }
      });
    };
  }, [model]);

  useFrame((state, delta) => {
    const outer = outerRef.current;
    const inner = innerRef.current;
    if (!outer || !inner) return;

    const scrollProgress = scrollProgressRef.current ?? 0;

    if (intro.current < 1) {
      intro.current = Math.min(1, intro.current + delta / 1.15);
    }
    // Ease-out cubic: fast arrival, long settle.
    const settled = 1 - Math.pow(1 - intro.current, 3);

    // Mouse and touch parallax, eased so it never snaps. This is a direct
    // response to the visitor's own input, so it stays on under reduced
    // motion: what that setting asks us to drop is unsolicited animation,
    // and freezing the model entirely reads as a broken 3D scene. The
    // entrance borrows the same target so the swing-in and the pointer
    // response blend through one lerp instead of fighting.
    target.current.y = state.pointer.x * 0.3 - 0.35 - (1 - settled) * 0.85;
    target.current.x = -state.pointer.y * 0.16;

    outer.rotation.y += (target.current.y - outer.rotation.y) * Math.min(delta * 2.2, 1);
    outer.rotation.x += (target.current.x - outer.rotation.x) * Math.min(delta * 2.2, 1);

    if (reducedMotion) {
      // Drop everything that moves on its own: no idle drift, no float.
      inner.position.y = 0;
      outer.position.y = -scrollProgress * 0.6;
      return;
    }

    const t = state.clock.elapsedTime;

    // Slow idle drift plus a gentle float.
    outer.rotation.y += Math.sin(t * 0.18) * 0.0006;
    inner.position.y = Math.sin(t * 0.7) * 0.06;

    outer.position.y = -scrollProgress * 0.6 - (1 - settled) * 0.4;
    outer.scale.setScalar((1 - scrollProgress * 0.12) * (0.92 + settled * 0.08));
  });

  return (
    <group ref={outerRef} position={[0, -0.1, 0]}>
      <Podium y={baseY - 0.19} scale={targetSize / 3.9} lowPower={lowPower} />
      <group ref={innerRef}>
        <primitive object={model} />
      </group>
    </group>
  );
}

useGLTF.preload(Z_MODEL_URL, false, false);
