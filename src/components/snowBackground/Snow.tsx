"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface SnowProps {
  isStorm:      boolean;
  spawnRadius?: number; // 수평 스폰 반지름 (원통 범위)
  spawnY?:      number; // 스폰 최대 높이
  count?:       number;
}

export default function Snow({
  isStorm,
  spawnRadius = 30,
  spawnY      = 40,
  count       = 700,
}: SnowProps) {
  const meshRef = useRef<THREE.InstancedMesh>(null!);

  // 원형 균등 분포 XZ
  const randomXZ = (r: number) => {
    const a    = Math.random() * Math.PI * 2;
    const dist = Math.sqrt(Math.random()) * r;
    return { x: Math.cos(a) * dist, z: Math.sin(a) * dist };
  };

  const snowData = useMemo(() => {
    return Array.from({ length: count }, () => {
      const { x, z } = randomXZ(spawnRadius);
      return {
        x,
        y:     Math.random() * spawnY,
        z,
        speed: 0.6 + Math.random() * 1.2,
        sway:  Math.random() * 2,
      };
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [count, spawnY, spawnRadius]);

  const dummy = useMemo(() => new THREE.Object3D(), []);

  useFrame((state, delta) => {
    if (!meshRef.current) return;
    const time = state.clock.elapsedTime;

    for (let i = 0; i < count; i++) {
      const s = snowData[i];
      s.y -= s.speed * delta * (isStorm ? 2.5 : 1);
      s.x += Math.sin(time + s.sway) * 0.012;

      if (s.y < 0) {
        s.y = spawnY;
        const { x, z } = randomXZ(spawnRadius);
        s.x = x;
        s.z = z;
      }

      dummy.position.set(s.x, s.y, s.z);
      dummy.scale.setScalar(0.07);
      dummy.updateMatrix();
      meshRef.current.setMatrixAt(i, dummy.matrix);
    }
    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    // renderOrder=2 — 스텐실 마스크(1) 이후에 렌더링
    <instancedMesh ref={meshRef} args={[null as any, null as any, count]} renderOrder={2}>
      <sphereGeometry args={[1, 4, 4]} />
      <meshBasicMaterial
        color="#ffffff"
        transparent
        opacity={0.75}
        depthWrite={false}
        stencilWrite={false}
        stencilFunc={THREE.EqualStencilFunc}
        stencilRef={1}
        stencilFail={THREE.KeepStencilOp}
        stencilZFail={THREE.KeepStencilOp}
        stencilZPass={THREE.KeepStencilOp}
      />
    </instancedMesh>
  );
}
