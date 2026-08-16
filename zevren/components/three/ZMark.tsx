"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { RoundedBox } from "@react-three/drei";
import type { Group } from "three";

interface ZMarkProps {
  reducedMotion: boolean;
  scrollProgressRef: React.RefObject<number>;
}

const ROCK_MATERIAL_PROPS = {
  color: "#0b1020",
  metalness: 0.85,
  roughness: 0.42,
  clearcoat: 0.6,
  clearcoatRoughness: 0.3,
  envMapIntensity: 1.6,
  flatShading: true,
} as const;

const EDGE_GLOW_PROPS = {
  color: "#0b1020",
  emissive: "#2563eb",
  emissiveIntensity: 2.2,
  roughness: 0.3,
  metalness: 0.2,
} as const;

// Fixed (non-random per render) fragment layout so the scene is stable
// across re-renders; values were hand placed to loosely ring the Z.
const FLOATING_FRAGMENTS: { position: [number, number, number]; scale: number; rotation: [number, number, number] }[] = [
  { position: [1.7, 1.35, -0.4], scale: 0.16, rotation: [0.4, 0.3, 0.1] },
  { position: [-1.6, 1.1, 0.3], scale: 0.13, rotation: [0.1, 0.6, 0.4] },
  { position: [1.9, -0.3, 0.2], scale: 0.11, rotation: [0.5, 0.2, 0.3] },
  { position: [-1.8, -0.6, -0.3], scale: 0.15, rotation: [0.2, 0.5, 0.2] },
  { position: [1.4, -1.5, 0.1], scale: 0.12, rotation: [0.3, 0.1, 0.5] },
  { position: [-1.3, 1.7, -0.2], scale: 0.1, rotation: [0.6, 0.4, 0.1] },
  { position: [0.3, 1.9, 0.4], scale: 0.09, rotation: [0.2, 0.3, 0.6] },
  { position: [-0.4, -1.9, 0.3], scale: 0.13, rotation: [0.4, 0.2, 0.3] },
];

const PEDESTAL_ROCKS: { position: [number, number, number]; scale: [number, number, number]; rotation: [number, number, number] }[] = [
  { position: [0, -1.42, 0], scale: [0.9, 0.32, 0.6], rotation: [0.1, 0.4, 0.05] },
  { position: [-0.55, -1.5, 0.1], scale: [0.4, 0.22, 0.35], rotation: [0.2, 0.9, 0.1] },
  { position: [0.5, -1.48, -0.15], scale: [0.45, 0.25, 0.38], rotation: [0.15, 1.3, 0.2] },
  { position: [0.1, -1.55, 0.35], scale: [0.35, 0.2, 0.3], rotation: [0.3, 0.2, 0.1] },
  { position: [-0.3, -1.55, -0.3], scale: [0.32, 0.18, 0.3], rotation: [0.1, 2.1, 0.3] },
];

function RockCluster({
  items,
}: {
  items: { position: [number, number, number]; scale: [number, number, number] | number; rotation: [number, number, number] }[];
}) {
  return (
    <>
      {items.map((item, i) => (
        <mesh
          key={i}
          position={item.position}
          rotation={item.rotation}
          scale={item.scale}
        >
          <icosahedronGeometry args={[1, 0]} />
          <meshStandardMaterial color="#080b16" roughness={0.85} metalness={0.3} flatShading />
        </mesh>
      ))}
    </>
  );
}

function FloatingFragments({ reducedMotion }: { reducedMotion: boolean }) {
  const groupRef = useRef<Group>(null);

  useFrame((state) => {
    if (reducedMotion || !groupRef.current) return;
    const t = state.clock.elapsedTime;
    groupRef.current.children.forEach((child, i) => {
      child.position.y += Math.sin(t * 0.6 + i) * 0.0006;
      child.rotation.x += 0.0015;
      child.rotation.y += 0.001;
    });
  });

  return (
    <group ref={groupRef}>
      {FLOATING_FRAGMENTS.map((f, i) => (
        <mesh key={i} position={f.position} rotation={f.rotation} scale={f.scale}>
          <icosahedronGeometry args={[1, 0]} />
          <meshStandardMaterial color="#0b1020" roughness={0.6} metalness={0.5} flatShading />
        </mesh>
      ))}
    </group>
  );
}

export function ZMark({ reducedMotion, scrollProgressRef }: ZMarkProps) {
  const groupRef = useRef<Group>(null);
  const targetRotation = useRef({ x: 0, y: 0 });

  const bars: { args: [number, number, number]; position: [number, number, number]; rotation: [number, number, number] }[] = useMemo(
    () => [
      { args: [2.3, 0.42, 0.42], position: [0, 0.79, 0], rotation: [0, 0, 0] },
      { args: [2.55, 0.42, 0.42], position: [0, 0, 0], rotation: [0, 0, -0.49] },
      { args: [2.3, 0.42, 0.42], position: [0, -0.79, 0], rotation: [0, 0, 0] },
    ],
    []
  );

  useFrame((state, delta) => {
    const group = groupRef.current;
    if (!group) return;

    const scrollProgress = scrollProgressRef.current ?? 0;

    if (reducedMotion) {
      group.rotation.y = 0.15;
      group.rotation.x = 0.05;
      group.position.y = -scrollProgress * 0.6;
      return;
    }

    targetRotation.current.y = state.pointer.x * 0.35 + 0.15;
    targetRotation.current.x = -state.pointer.y * 0.25 + 0.05;

    group.rotation.y +=
      (targetRotation.current.y - group.rotation.y) * Math.min(delta * 3, 1);
    group.rotation.x +=
      (targetRotation.current.x - group.rotation.x) * Math.min(delta * 3, 1);
    group.rotation.z = -scrollProgress * 0.5;
    group.position.y = -scrollProgress * 0.6;
    group.scale.setScalar((1 - scrollProgress * 0.15) * 1.15);
  });

  return (
    <group ref={groupRef}>
      {bars.map((bar, i) => (
        <group key={i} position={bar.position} rotation={bar.rotation}>
          <RoundedBox args={bar.args} radius={0.025} smoothness={2}>
            <meshPhysicalMaterial {...ROCK_MATERIAL_PROPS} />
          </RoundedBox>
          {/* thin emissive vein along the leading edge, like light through a crack */}
          <mesh position={[0, -bar.args[1] / 2 - 0.01, bar.args[2] / 2 - 0.02]}>
            <boxGeometry args={[bar.args[0] * 0.94, 0.02, 0.02]} />
            <meshStandardMaterial {...EDGE_GLOW_PROPS} />
          </mesh>
        </group>
      ))}

      <RockCluster items={PEDESTAL_ROCKS} />
      <FloatingFragments reducedMotion={reducedMotion} />
    </group>
  );
}
