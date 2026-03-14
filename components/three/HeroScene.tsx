"use client";

import { Canvas } from "@react-three/fiber";
import { Environment } from "@react-three/drei";
import { FloatingProduct } from "@/components/three/FloatingProduct";
import { ParticleField } from "@/components/three/ParticleField";

export function HeroScene() {
  return (
    <div className="h-[420px] w-full rounded-3xl">
      <Canvas camera={{ position: [0, 0, 3.8], fov: 48 }}>
        <ambientLight intensity={0.5} />
        <pointLight intensity={70} position={[2, 2, 3]} color="#ffffff" />
        <pointLight intensity={30} position={[-2, -2, -1]} color="#F5A623" />
        <Environment preset="city" />
        <ParticleField />
        <FloatingProduct />
      </Canvas>
    </div>
  );
}
