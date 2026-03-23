"use client";

/**
 * Nightstand.tsx — 침대 옆 협탁 + 스탠드 조명
 *
 * 협탁: 작은 서랍 2단
 * 스탠드: 얇은 기둥 + 갓
 * 낮/밤에 따라 스탠드 조명 on/off
 */

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { SceneItem } from "../AnimatedWrapper";
import { COLOR, DELAY, WALL_HALF } from "../constants";
import { MAT } from "../materials";
import { useDayNight } from "@/components/canvas/DayNightContext";

// ── 스탠드 조명 ───────────────────────────────
function StandLight() {
  const { mode }   = useDayNight();
  const lightRef   = useRef<THREE.PointLight>(null!);
  const shadeRef   = useRef<THREE.Mesh>(null!);
  const curI       = useRef(0);
  const curEmissive = useRef(0);

  useFrame((_, delta) => {
    const isNight   = mode === "night";
    const t         = 1 - Math.pow(0.001, delta * 3);
    const targetI   = isNight ? 1.8 : 0;
    const targetE   = isNight ? 0.6 : 0.05;

    curI.current       += (targetI - curI.current)       * t;
    curEmissive.current += (targetE - curEmissive.current) * t;

    if (lightRef.current) lightRef.current.intensity = curI.current;
    if (shadeRef.current)
      (shadeRef.current.material as THREE.MeshStandardMaterial).emissiveIntensity = curEmissive.current;
  });

  const POLE_H  = 0.55;
  const ARM_H   = 0.12;

  return (
    <group>
      {/* 받침대 */}
      <mesh position={[0, 0.015, 0]}>
        <cylinderGeometry args={[0.07, 0.08, 0.03, 16]} />
        <meshStandardMaterial color="#5A4030" {...MAT.woodDark} />
      </mesh>

      {/* 기둥 */}
      <mesh position={[0, POLE_H / 2 + 0.03, 0]}>
        <cylinderGeometry args={[0.012, 0.012, POLE_H, 8]} />
        <meshStandardMaterial color="#8A7060" {...MAT.metalHandle} />
      </mesh>

      {/* 갓 */}
      <mesh ref={shadeRef} position={[0, POLE_H + 0.03 + ARM_H, 0]}>
        <coneGeometry args={[0.14, 0.18, 16, 1, true]} />
        <meshStandardMaterial
          color="#E8D8A0"
          emissive="#FFD080"
          emissiveIntensity={0.05}
          roughness={0.9}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* 갓 윗면 막기 */}
      <mesh position={[0, POLE_H + 0.03 + ARM_H + 0.09, 0]}>
        <cylinderGeometry args={[0.02, 0.02, 0.01, 12]} />
        <meshStandardMaterial color="#8A7060" {...MAT.metalHandle} />
      </mesh>

      {/* 조명 */}
      <pointLight
        ref={lightRef}
        position={[0, POLE_H + 0.03 + ARM_H, 0]}
        intensity={0}
        distance={4.5}
        color="#FFD080"
        decay={2}
      />
    </group>
  );
}

// ── 협탁 ─────────────────────────────────────
function NightstandBody() {
  const W = 0.55, H = 0.52, D = 0.45;

  return (
    <group>
      {/* 본체 */}
      <mesh position={[0, H / 2, 0]} castShadow receiveShadow>
        <boxGeometry args={[W, H, D]} />
        <meshStandardMaterial color={COLOR.drawerBody} {...MAT.drawer} />
      </mesh>

      {/* 상판 — 살짝 돌출 */}
      <mesh position={[0, H + 0.01, 0]} castShadow>
        <boxGeometry args={[W + 0.03, 0.03, D + 0.03]} />
        <meshStandardMaterial color={COLOR.woodMid} {...MAT.woodMid} />
      </mesh>

      {/* 서랍 2개 */}
      {[0.18, 0.38].map((y, i) => (
        <group key={i}>
          {/* 서랍 구분선 */}
          <mesh position={[W / 2 + 0.001, y, 0]}>
            <boxGeometry args={[0.005, 0.02, D * 0.85]} />
            <meshStandardMaterial color={COLOR.curtainFold} {...MAT.fabric} />
          </mesh>
          {/* 손잡이 */}
          <mesh position={[W / 2 + 0.025, y, 0]} castShadow>
            <boxGeometry args={[0.04, 0.025, 0.008]} />
            <meshStandardMaterial color={COLOR.drawerHandle} {...MAT.metalHandle} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

// ── 메인 컴포넌트 ─────────────────────────────
export default function Nightstand() {
  // 침대: x=2.5, z=-WALL_HALF+2.5=-1.5, 침대 폭 2.5
  // 협탁은 침대 카메라 쪽 측면(+z)에 배치
  const H = 0.52;

  return (
    <SceneItem
      delay={DELAY.bed + 0.2}
      position={[0.95, 0, -3.4]}
      liftHeight={0.05}
      hitbox={[0.6, 0.6, 0.5]}
      hitboxPos={[0, 0.3, 0]}
      rotation={[0, -Math.PI / 2, 0]}
    >
      <group>
        <NightstandBody />
        {/* 스탠드는 협탁 상판 위 오른쪽 */}
        <group position={[0.1, H + 0.04, 0.05]}>
          <StandLight />
        </group>
      </group>
    </SceneItem>
  );
}
