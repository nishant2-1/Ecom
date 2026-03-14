"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, OrbitControls } from "@react-three/drei";
import { useRef } from "react";
import type { Mesh } from "three";

function FallbackProduct() {
  const meshRef = useRef<Mesh>(null);

  useFrame((_state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.4;
    }
  });

  return (
    <mesh ref={meshRef}>
      <torusKnotGeometry args={[1, 0.3, 128, 32]} />
      <meshStandardMaterial color="#F5A623" metalness={0.6} roughness={0.25} />
    </mesh>
  );
}

export function Product3DViewer() {
  return (
    <div className="h-[460px] w-full rounded-2xl">
      <Canvas camera={{ position: [0, 0, 4], fov: 50 }}>
        <ambientLight intensity={0.45} />
        <pointLight position={[2, 3, 4]} intensity={80} />
        <Environment preset="warehouse" />
        <FallbackProduct />
        <OrbitControls enablePan={false} />
      </Canvas>
    </div>
  );
}
