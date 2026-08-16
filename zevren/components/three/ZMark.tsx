"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Edges, MeshReflectorMaterial } from "@react-three/drei";
import * as THREE from "three";
import type { Group } from "three";

interface ZMarkProps {
  reducedMotion: boolean;
  scrollProgressRef: React.RefObject<number>;
}

/**
 * Outline of the Z letterform, traced clockwise from the top-left corner.
 * Extruded with bevels this gives one solid sculpture rather than three
 * separate bars, so the diagonal reads as physically joined to the arms.
 */
function buildZShape() {
  const s = new THREE.Shape();
  s.moveTo(-1.1, 1.0);
  s.lineTo(1.12, 1.0);
  s.lineTo(1.12, 0.6);
  s.lineTo(-0.3, -0.62);
  s.lineTo(1.12, -0.62);
  s.lineTo(1.12, -1.0);
  s.lineTo(-1.12, -1.0);
  s.lineTo(-1.12, -0.6);
  s.lineTo(0.3, 0.62);
  s.lineTo(-1.1, 0.62);
  s.closePath();
  return s;
}

// Fixed layout so the scene is stable across re-renders.
const FRAGMENTS: {
  position: [number, number, number];
  scale: number;
  rotation: [number, number, number];
}[] = [
  { position: [1.95, 1.5, -0.5], scale: 0.15, rotation: [0.4, 0.3, 0.1] },
  { position: [-1.85, 1.25, 0.35], scale: 0.12, rotation: [0.1, 0.6, 0.4] },
  { position: [2.15, -0.15, 0.25], scale: 0.1, rotation: [0.5, 0.2, 0.3] },
  { position: [-2.05, -0.5, -0.35], scale: 0.14, rotation: [0.2, 0.5, 0.2] },
  { position: [1.65, -1.35, 0.15], scale: 0.11, rotation: [0.3, 0.1, 0.5] },
  { position: [-1.5, 1.85, -0.25], scale: 0.09, rotation: [0.6, 0.4, 0.1] },
  { position: [0.45, 2.05, 0.45], scale: 0.08, rotation: [0.2, 0.3, 0.6] },
  { position: [-0.65, -1.95, 0.35], scale: 0.12, rotation: [0.4, 0.2, 0.3] },
  { position: [2.4, 0.95, -0.3], scale: 0.09, rotation: [0.3, 0.7, 0.2] },
];

const PLATFORM_ROCKS: {
  position: [number, number, number];
  scale: [number, number, number];
  rotation: [number, number, number];
}[] = [
  { position: [0, -1.32, 0], scale: [1.15, 0.3, 0.62], rotation: [0.06, 0.4, 0.03] },
  { position: [-0.78, -1.36, 0.1], scale: [0.5, 0.24, 0.4], rotation: [0.15, 0.9, 0.08] },
  { position: [0.74, -1.35, -0.14], scale: [0.55, 0.26, 0.42], rotation: [0.1, 1.3, 0.15] },
  { position: [0.16, -1.42, 0.4], scale: [0.42, 0.22, 0.34], rotation: [0.22, 0.2, 0.08] },
  { position: [-0.36, -1.43, -0.36], scale: [0.4, 0.2, 0.33], rotation: [0.08, 2.1, 0.22] },
  { position: [1.15, -1.4, 0.18], scale: [0.34, 0.18, 0.3], rotation: [0.12, 0.6, 0.2] },
  { position: [-1.2, -1.41, -0.1], scale: [0.32, 0.17, 0.29], rotation: [0.18, 1.7, 0.1] },
];

function FloatingFragments({ reducedMotion }: { reducedMotion: boolean }) {
  const groupRef = useRef<Group>(null);

  useFrame((state) => {
    if (reducedMotion || !groupRef.current) return;
    const t = state.clock.elapsedTime;
    groupRef.current.children.forEach((child, i) => {
      child.position.y += Math.sin(t * 0.5 + i * 1.3) * 0.0007;
      child.rotation.x += 0.0016;
      child.rotation.y += 0.0011;
    });
  });

  return (
    <group ref={groupRef}>
      {FRAGMENTS.map((f, i) => (
        <mesh key={i} position={f.position} rotation={f.rotation} scale={f.scale}>
          <dodecahedronGeometry args={[1, 0]} />
          <meshStandardMaterial
            color="#0a0f1e"
            roughness={0.5}
            metalness={0.7}
            envMapIntensity={1.4}
            flatShading
          />
        </mesh>
      ))}
    </group>
  );
}

export function ZMark({ reducedMotion, scrollProgressRef }: ZMarkProps) {
  const groupRef = useRef<Group>(null);
  const targetRotation = useRef({ x: 0, y: 0 });

  const shape = useMemo(() => buildZShape(), []);

  // Main solid body: thick with sharp-ish bevels.
  const bodyGeometry = useMemo(
    () =>
      new THREE.ExtrudeGeometry(shape, {
        depth: 0.62,
        bevelEnabled: true,
        bevelThickness: 0.05,
        bevelSize: 0.045,
        bevelOffset: 0,
        bevelSegments: 2,
      }),
    [shape]
  );

  // Marginally larger copy sitting just behind the body. Only a thin sliver
  // peeks out around the silhouette, which reads as a neon rim rather than a
  // second slab. Kept slightly shallower so it never pokes through the face.
  const glowGeometry = useMemo(
    () =>
      new THREE.ExtrudeGeometry(shape, {
        depth: 0.56,
        bevelEnabled: true,
        bevelThickness: 0.02,
        bevelSize: 0.062,
        bevelOffset: 0,
        bevelSegments: 1,
      }),
    [shape]
  );

  useFrame((state, delta) => {
    const group = groupRef.current;
    if (!group) return;

    const scrollProgress = scrollProgressRef.current ?? 0;

    if (reducedMotion) {
      group.rotation.y = -0.32;
      group.rotation.x = 0.04;
      group.position.y = -scrollProgress * 0.6;
      return;
    }

    targetRotation.current.y = state.pointer.x * 0.28 - 0.32;
    targetRotation.current.x = -state.pointer.y * 0.18 + 0.04;

    group.rotation.y +=
      (targetRotation.current.y - group.rotation.y) * Math.min(delta * 2.5, 1);
    group.rotation.x +=
      (targetRotation.current.x - group.rotation.x) * Math.min(delta * 2.5, 1);
    group.position.y = -scrollProgress * 0.6;
    group.scale.setScalar(1.12 - scrollProgress * 0.12);
  });

  return (
    <group position={[0, 0.25, 0]}>
      {/* Reflective floor picking up the blue spill */}
      {/* A contained circular pool rather than an infinite plane: a large
          flat plane shows its horizon at camera eye level no matter how big
          it is, which reads as a hard rectangle across the hero. A disc has
          no straight edge and its near-black base blends into the
          background, leaving just the blue spill reflected under the Z. */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.54, 0]}>
        <circleGeometry args={[3.6, 64]} />
        <MeshReflectorMaterial
          blur={[400, 140]}
          resolution={512}
          mixBlur={1.5}
          mixStrength={45}
          roughness={0.88}
          depthScale={1.3}
          minDepthThreshold={0.3}
          maxDepthThreshold={1.4}
          color="#0a1020"
          metalness={0.8}
          mirror={0}
          transparent
          opacity={0.75}
        />
      </mesh>

      <group ref={groupRef}>
        {/* Neon shell: only a rim of this is visible around the silhouette */}
        <mesh geometry={glowGeometry} position={[0, 0, -0.03]}>
          <meshBasicMaterial color="#2f7df6" toneMapped={false} />
        </mesh>

        {/* Dark metallic body. envMapIntensity is deliberately low: the
            environment is almost entirely blue, so a high value floods the
            whole face with blue instead of leaving it dark with blue
            highlights. */}
        <mesh geometry={bodyGeometry} castShadow>
          <meshPhysicalMaterial
            color="#05080f"
            metalness={0.92}
            roughness={0.28}
            clearcoat={1}
            clearcoatRoughness={0.18}
            envMapIntensity={0.55}
            reflectivity={0.8}
          />
          <Edges threshold={35} scale={1.0015}>
            <lineBasicMaterial color="#4f9bff" toneMapped={false} transparent opacity={0.85} />
          </Edges>
        </mesh>

        <FloatingFragments reducedMotion={reducedMotion} />
      </group>

      {/* Rock platform */}
      <group>
        {PLATFORM_ROCKS.map((r, i) => (
          <mesh key={i} position={r.position} rotation={r.rotation} scale={r.scale} castShadow>
            <icosahedronGeometry args={[1, 0]} />
            <meshStandardMaterial
              color="#070b14"
              roughness={0.9}
              metalness={0.35}
              envMapIntensity={0.9}
              flatShading
            />
          </mesh>
        ))}
      </group>
    </group>
  );
}
