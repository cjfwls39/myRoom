"use client";

import React, { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useDayNight } from "../canvas/DayNightContext";
import { PhaseGroup } from "../room/AnimatedWrapper";

const SPARK_COUNT = 60;

interface SparkData {
  x: number; y: number; z: number;
  vx: number; vy: number; vz: number;
  life: number;
  maxLife: number;
  size: number;
}

export default function Bonfire({ position, baseDelay = 0 }: { position: [number, number, number]; baseDelay?: number }) {
  const lightRef = useRef<THREE.PointLight>(null!);
  const sparkRef = useRef<THREE.InstancedMesh>(null!);
  const fireRef  = useRef<THREE.Group>(null!);
  const { mode } = useDayNight();

  const sparks = useMemo<SparkData[]>(() => (
    Array.from({ length: SPARK_COUNT }, () => ({
      x: (Math.random() - 0.5) * 0.2,
      y: 0.1 + Math.random() * 0.3,
      z: (Math.random() - 0.5) * 0.2,
      vx: (Math.random() - 0.5) * 0.8,
      vy: 1.0 + Math.random() * 1.5,
      vz: (Math.random() - 0.5) * 0.8,
      life: Math.random() * 2.0,
      maxLife: 1.2 + Math.random() * 1.2,
      size: 0.020 + Math.random() * 0.020,
    }))
  ), []);

  const dummy = useMemo(() => new THREE.Object3D(), []);

  useFrame((state, delta) => {
    const t = state.clock.elapsedTime;

    // 불빛 플리커
    if (lightRef.current) {
      const base = mode === "day" ? 2 : 6;
      lightRef.current.intensity =
        base + Math.sin(t * 17) * 0.9 + Math.sin(t * 6.5) * 0.4;
    }

    // 불꽃 흔들림
    if (fireRef.current) {
      fireRef.current.scale.set(
        1 + Math.sin(t * 11)       * 0.05,
        1 + Math.sin(t * 8  + 0.5) * 0.09,
        1 + Math.sin(t * 9  + 1.2) * 0.05,
      );
    }

    // 스파크 업데이트
    if (!sparkRef.current) return;
    for (let i = 0; i < SPARK_COUNT; i++) {
      const s = sparks[i];
      s.life += delta;

      if (s.life > s.maxLife) {
        s.x = (Math.random() - 0.5) * 0.2;
        s.y = 0.1 + Math.random() * 0.3;
        s.z = (Math.random() - 0.5) * 0.2;
        s.vx = (Math.random() - 0.5) * 0.8;
        s.vy = 1.0 + Math.random() * 1.5;
        s.vz = (Math.random() - 0.5) * 0.8;
        s.life = 0;
        s.maxLife = 1.2 + Math.random() * 1.2;
        s.size = 0.020 + Math.random() * 0.020;
      }

      const p    = s.life / s.maxLife;
      const drag = 1 - p * 0.6;
      s.x += s.vx * delta * drag;
      s.y += s.vy * delta * (1 - p) - 0.4 * delta;
      s.z += s.vz * delta * drag;

      dummy.position.set(s.x, s.y, s.z);
      dummy.scale.setScalar(s.size * Math.max(0, 1 - p * 0.85));
      dummy.updateMatrix();
      sparkRef.current.setMatrixAt(i, dummy.matrix);
    }
    sparkRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <group position={position}>
      {/* ── Phase 1: 장작 ── */}
      <PhaseGroup delay={baseDelay}>
        <mesh position={[0, 0.06,  0.18]} rotation={[0, 0, Math.PI / 2]} castShadow>
          <cylinderGeometry args={[0.07, 0.09, 0.90, 6]} />
          <meshStandardMaterial color="#2A1A0A" roughness={0.9} />
        </mesh>
        <mesh position={[0, 0.06, -0.18]} rotation={[0, 0, Math.PI / 2]} castShadow>
          <cylinderGeometry args={[0.07, 0.09, 0.90, 6]} />
          <meshStandardMaterial color="#2A1A0A" roughness={0.9} />
        </mesh>
        <mesh position={[ 0.18, 0.16, 0]} rotation={[Math.PI / 2, 0, 0]} castShadow>
          <cylinderGeometry args={[0.07, 0.09, 0.90, 6]} />
          <meshStandardMaterial color="#2A1A0A" roughness={0.9} />
        </mesh>
        <mesh position={[-0.18, 0.16, 0]} rotation={[Math.PI / 2, 0, 0]} castShadow>
          <cylinderGeometry args={[0.07, 0.09, 0.90, 6]} />
          <meshStandardMaterial color="#2A1A0A" roughness={0.9} />
        </mesh>
        <mesh rotation-x={-Math.PI / 2} position={[0, 0.01, 0]}>
          <circleGeometry args={[0.22, 6]} />
          <meshBasicMaterial color="#FF2200" transparent opacity={0.5} depthWrite={false} />
        </mesh>
      </PhaseGroup>

      {/* ── Phase 2: 불꽃 ── */}
      <PhaseGroup delay={baseDelay + 0.3}>
      <group ref={fireRef} position={[0, 0.18, 0]}>
        {/* 베이스 */}
        <mesh position={[0, 0.10, 0]}>
          <coneGeometry args={[0.30, 0.22, 6]} />
          <meshBasicMaterial color="#CC2200" />
        </mesh>

        {/* 베이스 내부 밝은 층 */}
        <mesh position={[0, 0.15, 0]}>
          <coneGeometry args={[0.20, 0.18, 5]} />
          <meshBasicMaterial color="#FF6600" />
        </mesh>

        {/* 중앙 주불꽃 */}
        <mesh position={[0, 0.40, 0]}>
          <coneGeometry args={[0.10, 0.52, 5]} />
          <meshBasicMaterial color="#FF7700" />
        </mesh>

        {/* 좌측 혀 */}
        <mesh position={[-0.10, 0.32, 0]} rotation={[0, 0.4, 0.28]}>
          <coneGeometry args={[0.07, 0.42, 4]} />
          <meshBasicMaterial color="#FF4400" />
        </mesh>

        {/* 우측 혀 */}
        <mesh position={[0.10, 0.32, 0]} rotation={[0, -0.4, -0.28]}>
          <coneGeometry args={[0.07, 0.42, 4]} />
          <meshBasicMaterial color="#FF4400" />
        </mesh>

        {/* 앞쪽 혀 */}
        <mesh position={[0, 0.29, 0.09]} rotation={[-0.28, 0, 0]}>
          <coneGeometry args={[0.06, 0.36, 4]} />
          <meshBasicMaterial color="#FF3300" />
        </mesh>

        {/* 뒤쪽 혀 */}
        <mesh position={[0, 0.29, -0.09]} rotation={[0.28, 0, 0]}>
          <coneGeometry args={[0.06, 0.36, 4]} />
          <meshBasicMaterial color="#FF3300" />
        </mesh>

        {/* 중앙 노란 심지 */}
        <mesh position={[0, 0.62, 0]}>
          <coneGeometry args={[0.04, 0.20, 4]} />
          <meshBasicMaterial color="#FFD200" />
        </mesh>

        {/* 내부 밝은 코어 */}
        <mesh position={[0, 0.24, 0]}>
          <coneGeometry args={[0.07, 0.26, 5]} />
          <meshBasicMaterial color="#FFE566" />
        </mesh>
      </group>
      </PhaseGroup>

      {/* ── Phase 3: 스파크 + 불빛 ── */}
      <PhaseGroup delay={baseDelay + 0.55}>
        <pointLight ref={lightRef} color="#FF5500" distance={15} decay={2} />
        <instancedMesh ref={sparkRef} args={[null as any, null as any, SPARK_COUNT]}>
          <octahedronGeometry args={[1, 0]} />
          <meshBasicMaterial color="#FFB700" />
        </instancedMesh>
      </PhaseGroup>
    </group>
  );
}
