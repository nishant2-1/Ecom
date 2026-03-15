"use client";

import { useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import {
  Environment,
  Float,
  MeshDistortMaterial,
  OrbitControls,
  Sparkles
} from "@react-three/drei";
import type { Group, Mesh } from "three";

function CoreMesh() {
  const ref = useRef<Mesh>(null);

  useFrame((state, delta) => {
    if (!ref.current) {
      return;
    }

    ref.current.rotation.y += delta * 0.28;
    ref.current.rotation.x += delta * 0.12;
    ref.current.position.y = Math.sin(state.clock.elapsedTime * 0.9) * 0.12;
  });

  return (
    <mesh ref={ref} position={[0, 0, 0]}>
      <icosahedronGeometry args={[0.85, 2]} />
      <MeshDistortMaterial
        color="#f5a623"
        emissive="#f5a623"
        emissiveIntensity={0.35}
        metalness={0.62}
        roughness={0.2}
        distort={0.24}
        speed={2.1}
      />
    </mesh>
  );
}

type OrbitRingProps = {
  radius: number;
  count: number;
  color: string;
  speed: number;
  y: number;
};

function OrbitRing({ radius, count, color, speed, y }: OrbitRingProps) {
  const groupRef = useRef<Group>(null);

  const nodes = useMemo(() => {
    return Array.from({ length: count }, (_, index) => {
      const angle = (index / count) * Math.PI * 2;
      return {
        x: Math.cos(angle) * radius,
        z: Math.sin(angle) * radius,
        rot: angle
      };
    });
  }, [count, radius]);

  useFrame((_state, delta) => {
    if (!groupRef.current) {
      return;
    }

    groupRef.current.rotation.y += delta * speed;
  });

  return (
    <group ref={groupRef} position={[0, y, 0]}>
      {nodes.map((node, index) => (
        <Float
          key={`${radius}-${index}`}
          speed={1.3 + index * 0.07}
          rotationIntensity={0.55}
          floatIntensity={0.5}
        >
          <mesh position={[node.x, 0, node.z]} rotation={[0, node.rot, 0]}>
            <boxGeometry args={[0.22, 0.12, 0.32]} />
            <meshStandardMaterial
              color={color}
              emissive={color}
              emissiveIntensity={0.35}
              roughness={0.35}
              metalness={0.75}
            />
          </mesh>
        </Float>
      ))}
    </group>
  );
}

export function AntigravityShowcase() {
  return (
    <div className="h-[340px] w-full overflow-hidden rounded-[26px] bg-[radial-gradient(circle_at_20%_10%,rgba(245,166,35,0.22),transparent_55%),radial-gradient(circle_at_80%_85%,rgba(255,255,255,0.14),transparent_45%),#080808]">
      <Canvas camera={{ position: [0, 0.15, 4.5], fov: 45 }}>
        <ambientLight intensity={0.35} />
        <directionalLight position={[2, 2, 2]} intensity={1.2} color="#fff6df" />
        <pointLight position={[-2, -1, -2]} intensity={22} color="#f5a623" />
        <Sparkles
          count={90}
          scale={[7, 4, 7]}
          size={2.2}
          speed={0.4}
          opacity={0.55}
          color="#ffffff"
        />
        <Environment preset="city" />

        <CoreMesh />
        <OrbitRing radius={1.45} count={10} color="#f5a623" speed={0.28} y={0.15} />
        <OrbitRing radius={2.15} count={14} color="#ffffff" speed={-0.16} y={-0.3} />

        <OrbitControls
          enablePan={false}
          enableZoom={false}
          maxPolarAngle={Math.PI * 0.62}
          minPolarAngle={Math.PI * 0.38}
          autoRotate
          autoRotateSpeed={0.55}
        />
      </Canvas>
    </div>
  );
}
