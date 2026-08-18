"use client";

import { useMemo } from "react";
import * as THREE from "three";

/**
 * The lit platform the Z stands on.
 *
 * The supplied GLB is the mark and its rock base only, so the stepped,
 * glowing podium from the design reference does not exist in the file. It is
 * built here instead: three shallow tiers in dark metal, a bright ring on the
 * lip of each, and a soft pool of light on the top face.
 *
 * Kept deliberately cheap. Radial segments are low because the rings read as
 * light rather than as geometry, and the whole thing is static, so it costs a
 * handful of draw calls and no per-frame work.
 */
const TIERS = [
  { radius: 2.05, height: 0.075, y: 0.0 },
  { radius: 1.74, height: 0.075, y: 0.075 },
  { radius: 1.46, height: 0.06, y: 0.15 },
];

export function Podium({
  y,
  scale = 1,
  lowPower = false,
}: {
  y: number;
  /** Tied to the mark's target size so the platform never outgrows the Z. */
  scale?: number;
  lowPower?: boolean;
}) {
  const segments = lowPower ? 48 : 72;

  const materials = useMemo(() => {
    const body = new THREE.MeshStandardMaterial({
      color: "#0b1020",
      metalness: 0.85,
      roughness: 0.28,
      envMapIntensity: 1.1,
    });
    // The rings are the light source of the composition, so they are pushed
    // well past 1: anything lower reads as painted-on blue rather than neon.
    const ring = new THREE.MeshStandardMaterial({
      color: "#1d4ed8",
      emissive: new THREE.Color("#2f6ef0"),
      emissiveIntensity: 1.9,
      metalness: 0.2,
      roughness: 0.35,
      toneMapped: false,
    });
    const pool = new THREE.MeshBasicMaterial({
      color: "#2563eb",
      transparent: true,
      opacity: 0.3,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      side: THREE.DoubleSide,
    });
    return { body, ring, pool };
  }, []);

  return (
    <group position={[0, y, 0]} scale={scale}>
      {TIERS.map((tier) => (
        <group key={tier.radius} position={[0, tier.y, 0]}>
          <mesh material={materials.body} castShadow receiveShadow>
            <cylinderGeometry args={[tier.radius, tier.radius, tier.height, segments]} />
          </mesh>
          {/* Light on the lip, sunk a hair into the tier so it hugs the edge. */}
          <mesh
            material={materials.ring}
            rotation={[-Math.PI / 2, 0, 0]}
            position={[0, tier.height / 2 - 0.012, 0]}
          >
            <torusGeometry args={[tier.radius - 0.012, 0.019, 6, segments]} />
          </mesh>
        </group>
      ))}

      {/* Pool of light on the top face, under the mark. */}
      <mesh
        material={materials.pool}
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, 0.185, 0]}
      >
        <circleGeometry args={[1.36, segments]} />
      </mesh>
    </group>
  );
}
