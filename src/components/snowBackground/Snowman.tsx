"use client";

import React from "react";

export default function Snowman({ position, rotation = [0, 0, 0] }: {
  position: [number, number, number];
  rotation?: [number, number, number];
}) {
  const snowMat  = <meshStandardMaterial color="#EEF4FF" roughness={0.9} />;
  const darkMat  = <meshStandardMaterial color="#1A1A1A" roughness={0.8} />;

  return (
    <group position={position} rotation={rotation}>
      {/* ── 하체 ── */}
      <mesh position={[0, 0.28, 0]} castShadow>
        <sphereGeometry args={[0.28, 8, 7]} />
        {snowMat}
      </mesh>

      {/* ── 몸통 ── */}
      <mesh position={[0, 0.68, 0]} castShadow>
        <sphereGeometry args={[0.20, 8, 7]} />
        {snowMat}
      </mesh>

      {/* ── 머리 ── */}
      <mesh position={[0, 0.98, 0]} castShadow>
        <sphereGeometry args={[0.14, 8, 7]} />
        {snowMat}
      </mesh>

      {/* ── 당근 코 ── */}
      <mesh position={[0, 0.98, 0.14]} rotation={[Math.PI / 2, 0, 0]}>
        <coneGeometry args={[0.025, 0.10, 5]} />
        <meshStandardMaterial color="#E8621A" roughness={0.7} />
      </mesh>

      {/* ── 눈 (2개) ── */}
      <mesh position={[-0.055, 1.01, 0.12]}>
        <sphereGeometry args={[0.018, 5, 5]} />
        {darkMat}
      </mesh>
      <mesh position={[0.055, 1.01, 0.12]}>
        <sphereGeometry args={[0.018, 5, 5]} />
        {darkMat}
      </mesh>

      {/* ── 입 (3개 작은 구) ── */}
      {[-0.05, 0, 0.05].map((x, i) => (
        <mesh key={i} position={[x, 0.93, 0.133]}>
          <sphereGeometry args={[0.013, 5, 5]} />
          {darkMat}
        </mesh>
      ))}

      {/* ── 단추 (몸통 2개) ── */}
      {[0.62, 0.70].map((y, i) => (
        <mesh key={i} position={[0, y, 0.195]}>
          <sphereGeometry args={[0.015, 5, 5]} />
          {darkMat}
        </mesh>
      ))}

      {/* ── 팔 (나뭇가지) ── */}
      <mesh position={[-0.28, 0.70, 0]} rotation={[0, 0, 0.5]}>
        <cylinderGeometry args={[0.012, 0.018, 0.36, 4]} />
        <meshStandardMaterial color="#3D2B1F" roughness={0.9} />
      </mesh>
      <mesh position={[0.28, 0.70, 0]} rotation={[0, 0, -0.5]}>
        <cylinderGeometry args={[0.012, 0.018, 0.36, 4]} />
        <meshStandardMaterial color="#3D2B1F" roughness={0.9} />
      </mesh>

      {/* ── 머플러 ── */}
      <mesh position={[0, 0.82, 0]}>
        <torusGeometry args={[0.18, 0.035, 6, 10]} />
        <meshStandardMaterial color="#CC2244" roughness={0.8} />
      </mesh>

      {/* ── 모자 ── */}
      <mesh position={[0, 1.115, 0]}>
        <cylinderGeometry args={[0.10, 0.13, 0.04, 8]} />
        <meshStandardMaterial color="#1A1A1A" roughness={0.8} />
      </mesh>
      <mesh position={[0, 1.16, 0]}>
        <cylinderGeometry args={[0.09, 0.09, 0.16, 8]} />
        <meshStandardMaterial color="#1A1A1A" roughness={0.8} />
      </mesh>
    </group>
  );
}
