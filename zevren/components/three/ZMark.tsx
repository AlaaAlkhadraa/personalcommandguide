"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { RoundedBox } from "@react-three/drei";
import type { Group } from "three";

interface ZMarkProps {
  reducedMotion: boolean;
  scrollProgressRef: React.RefObject<number>;
}

const METAL_MATERIAL_PROPS = {
  color: "#0b1020",
  metalness: 0.9,
  roughness: 0.18,
  clearcoat: 1,
  clearcoatRoughness: 0.08,
  envMapIntensity: 1.6,
} as const;

export function ZMark({ reducedMotion, scrollProgressRef }: ZMarkProps) {
  const groupRef = useRef<Group>(null);
  const targetRotation = useRef({ x: 0, y: 0 });

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
    group.scale.setScalar(1 - scrollProgress * 0.15);
  });

  return (
    <group ref={groupRef}>
      <RoundedBox args={[2.3, 0.42, 0.42]} radius={0.06} position={[0, 0.79, 0]}>
        <meshPhysicalMaterial {...METAL_MATERIAL_PROPS} />
      </RoundedBox>
      <RoundedBox
        args={[2.55, 0.42, 0.42]}
        radius={0.06}
        rotation={[0, 0, -0.49]}
      >
        <meshPhysicalMaterial {...METAL_MATERIAL_PROPS} />
      </RoundedBox>
      <RoundedBox args={[2.3, 0.42, 0.42]} radius={0.06} position={[0, -0.79, 0]}>
        <meshPhysicalMaterial {...METAL_MATERIAL_PROPS} />
      </RoundedBox>
    </group>
  );
}
