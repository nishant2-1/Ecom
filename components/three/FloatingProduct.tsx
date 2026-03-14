"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import type { Mesh } from "three";

export function FloatingProduct() {
  const meshRef = useRef<Mesh>(null);

  useFrame((state, delta) => {
    if (!meshRef.current) {
      return;
    }

    meshRef.current.rotation.y += delta * 0.25;
    meshRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.8) * 0.15;
  });

  return (
    <mesh ref={meshRef}>
      <icosahedronGeometry args={[1.05, 1]} />
      <meshPhysicalMaterial color="#F5A623" transmission={0.15} roughness={0.2} metalness={0.6} />
    </mesh>
  );
}
