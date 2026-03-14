"use client";

import { useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, Float, OrbitControls, Sparkles } from "@react-three/drei";
import type { Group, Mesh } from "three";

function CommandCore() {
  const coreRef = useRef<Mesh>(null);
  const haloRef = useRef<Mesh>(null);

  useFrame((state, delta) => {
    if (coreRef.current) {
      coreRef.current.rotation.y += delta * 0.4;
      coreRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.45) * 0.18;
      coreRef.current.position.y = Math.sin(state.clock.elapsedTime) * 0.08;
    }

    if (haloRef.current) {
      haloRef.current.rotation.x += delta * 0.18;
      haloRef.current.rotation.y -= delta * 0.32;
    }
  });

  return (
    <group>
      <mesh ref={coreRef}>
        <octahedronGeometry args={[0.82, 2]} />
        <meshPhysicalMaterial
          color="#f5a623"
          emissive="#f5a623"
          emissiveIntensity={0.42}
          roughness={0.14}
          metalness={0.86}
          transmission={0.08}
        />
      </mesh>

      <mesh ref={haloRef} rotation={[0.6, 0.3, 0]}>
        <torusGeometry args={[1.45, 0.04, 18, 120]} />
        <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={0.2} roughness={0.35} metalness={0.65} />
      </mesh>
    </group>
  );
}

type SatelliteGridProps = {
  color: string;
  radius: number;
  count: number;
  y: number;
  speed: number;
};

function SatelliteGrid({ color, radius, count, y, speed }: SatelliteGridProps) {
  const groupRef = useRef<Group>(null);

  const nodes = useMemo(
    () =>
      Array.from({ length: count }, (_, index) => {
        const angle = (index / count) * Math.PI * 2;
        return {
          x: Math.cos(angle) * radius,
          z: Math.sin(angle) * radius,
          rotation: angle
        };
      }),
    [count, radius]
  );

  useFrame((_state, delta) => {
    if (!groupRef.current) {
      return;
    }

    groupRef.current.rotation.y += delta * speed;
  });

  return (
    <group ref={groupRef} position={[0, y, 0]}>
      {nodes.map((node, index) => (
        <Float key={`${radius}-${index}`} speed={1 + index * 0.08} rotationIntensity={0.7} floatIntensity={0.55}>
          <mesh position={[node.x, 0, node.z]} rotation={[0.2, node.rotation, 0]}>
            <boxGeometry args={[0.18, 0.18, 0.28]} />
            <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.24} roughness={0.28} metalness={0.8} />
          </mesh>
        </Float>
      ))}
    </group>
  );
}

export function AdminCommandScene() {
  return (
    <div className="h-[320px] w-full overflow-hidden rounded-[26px] bg-[radial-gradient(circle_at_18%_20%,rgba(245,166,35,0.24),transparent_38%),radial-gradient(circle_at_84%_75%,rgba(255,255,255,0.16),transparent_34%),#090909]">
      <Canvas camera={{ position: [0, 0.1, 4.8], fov: 42 }}>
        <ambientLight intensity={0.35} />
        <directionalLight position={[2.2, 2.5, 3]} intensity={1.35} color="#fff7e7" />
        <pointLight position={[-2, -2, -2]} intensity={26} color="#f5a623" />
        <Sparkles count={120} scale={[8, 4, 8]} size={2.1} speed={0.45} opacity={0.5} color="#ffffff" />
        <Environment preset="night" />

        <CommandCore />
        <SatelliteGrid color="#f5a623" radius={1.7} count={12} y={0.15} speed={0.24} />
        <SatelliteGrid color="#ffffff" radius={2.35} count={16} y={-0.22} speed={-0.12} />

        <OrbitControls
          enablePan={false}
          enableZoom={false}
          autoRotate
          autoRotateSpeed={0.45}
          minPolarAngle={Math.PI * 0.4}
          maxPolarAngle={Math.PI * 0.62}
        />
      </Canvas>
    </div>
  );
}