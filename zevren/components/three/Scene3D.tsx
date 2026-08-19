"use client";

import { Canvas } from "@react-three/fiber";
import { Environment, Lightformer, Sparkles } from "@react-three/drei";
import { ZMark } from "@/components/three/ZMark";

interface Scene3DProps {
  reducedMotion: boolean;
  scrollProgressRef: React.RefObject<number>;
  /** Mobile gets a lighter scene: fewer particles, no floor reflection, lower dpr. */
  lowPower?: boolean;
  /** False once the hero has scrolled away. */
  onScreen?: boolean;
}

export function Scene3D({
  reducedMotion,
  scrollProgressRef,
  lowPower = false,
  onScreen = true,
}: Scene3DProps) {
  return (
    <Canvas
      /* A WebGL canvas keeps redrawing at 60fps for as long as it is mounted,
         even after the hero has scrolled out of sight, which costs GPU time
         and battery for something nobody is looking at. Rendering stops when
         the hero leaves the viewport and resumes when it comes back. */
      frameloop={onScreen ? "always" : "never"}
      camera={
        lowPower
          ? { position: [0, -0.05, 5.75], fov: 42 }
          : { position: [0.4, 0.35, 5.6], fov: 42 }
      }
      dpr={lowPower ? [1, 1.25] : [1, 1.75]}
      gl={{ antialias: !lowPower, alpha: true }}
    >
      <ambientLight intensity={0.5} />

      {/* Key light, cool and front-right */}
      <spotLight position={[4, 4, 5]} angle={0.6} penumbra={1} intensity={95} color="#dbeafe" />
      {/* Rim light from behind-left to separate the Z from the dark background */}
      <pointLight position={[-4, 1.5, -3]} intensity={70} color="#2563eb" />
      {/* Blue spill low and in front, grazing the base */}
      <pointLight position={[0, -2.1, 2.4]} intensity={38} color="#3b82f6" />
      <pointLight position={[0, 4, 1]} intensity={14} color="#ffffff" />

      {/* Procedural environment: no external HDR fetch, so it works under the
          site's strict connect-src CSP. */}
      <Environment resolution={128}>
        <Lightformer intensity={3} color="#ffffff" position={[3.5, 2.5, 3]} scale={[1.6, 4, 1]} />
        <Lightformer intensity={2.2} color="#60a5fa" position={[-3.5, 1, 2.5]} scale={[1.2, 3.5, 1]} />
        <Lightformer intensity={1.6} color="#1d4ed8" position={[0, 3.5, -2]} scale={[5, 1.2, 1]} />
      </Environment>

      <ZMark
        reducedMotion={reducedMotion}
        scrollProgressRef={scrollProgressRef}
        lowPower={lowPower}
      />

      {/* Still no full ground plane: it renders darker than the page and
          shows as a slab behind the hero. The podium is bounded, so it reads
          as an object rather than as a floor. */}

      {!reducedMotion && (
        <Sparkles
          count={lowPower ? 35 : 80}
          scale={9}
          size={1.6}
          speed={0.22}
          opacity={0.45}
          color="#93c5fd"
        />
      )}
    </Canvas>
  );
}
