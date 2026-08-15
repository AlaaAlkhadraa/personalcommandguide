"use client";

import { Canvas } from "@react-three/fiber";
import { Environment, Lightformer, Sparkles } from "@react-three/drei";
import { ZMark } from "@/components/three/ZMark";

interface Scene3DProps {
  reducedMotion: boolean;
  scrollProgressRef: React.RefObject<number>;
}

export function Scene3D({ reducedMotion, scrollProgressRef }: Scene3DProps) {
  return (
    <Canvas
      camera={{ position: [0, 0, 6], fov: 40 }}
      dpr={[1, 1.75]}
      gl={{ antialias: true, alpha: true }}
    >
      <ambientLight intensity={0.25} />
      <pointLight position={[3, 2, 4]} intensity={40} color="#60a5fa" />
      <pointLight position={[-3, -2, 3]} intensity={25} color="#2563eb" />
      <pointLight position={[0, 3, -2]} intensity={15} color="#ffffff" />

      <Environment resolution={256}>
        <Lightformer
          intensity={3}
          color="#3b82f6"
          position={[0, 2, -3]}
          scale={[6, 2, 1]}
        />
        <Lightformer
          intensity={2}
          color="#ffffff"
          position={[3, 1, 3]}
          scale={[4, 4, 1]}
        />
        <Lightformer
          intensity={2.5}
          color="#1d4ed8"
          position={[-3, -1, 3]}
          scale={[4, 4, 1]}
        />
      </Environment>

      <ZMark reducedMotion={reducedMotion} scrollProgressRef={scrollProgressRef} />

      {!reducedMotion && (
        <Sparkles
          count={70}
          scale={7}
          size={2}
          speed={0.25}
          opacity={0.5}
          color="#60a5fa"
        />
      )}
    </Canvas>
  );
}
