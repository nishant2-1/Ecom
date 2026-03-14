"use client";

import { useMemo } from "react";
import { Points } from "@react-three/drei";

export function ParticleField() {
  const particles = useMemo(() => {
    const positions = new Float32Array(900);

    for (let index = 0; index < positions.length; index += 3) {
      positions[index] = (Math.random() - 0.5) * 10;
      positions[index + 1] = (Math.random() - 0.5) * 6;
      positions[index + 2] = (Math.random() - 0.5) * 8;
    }

    return positions;
  }, []);

  return (
    <Points positions={particles} stride={3} frustumCulled>
      <pointsMaterial color="#FFFFFF" size={0.02} sizeAttenuation transparent opacity={0.45} />
    </Points>
  );
}
