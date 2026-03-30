"use client";

import React from "react";

export default function Woodpile({ position }: { position: [number, number, number] }) {
  const logMat = <meshStandardMaterial color="#2A1A0A" roughness={0.9} />;
  const endMat = <meshStandardMaterial color="#3D2510" roughness={0.85} />;

  return (
    <group position={position}>
      {/* ── 아래층 — Z축 방향 장작 3개 ── */}
      {[-0.28, 0, 0.28].map((x, i) => (
        <group key={i} position={[x, 0.07, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <mesh castShadow>
            <cylinderGeometry args={[0.08, 0.10, 1.0, 6]} />
            {logMat}
          </mesh>
          {/* 단면 원형 */}
          <mesh position={[0, 0.50, 0]} rotation={[Math.PI / 2, 0, 0]}>
            <circleGeometry args={[0.08, 6]} />
            {endMat}
          </mesh>
          <mesh position={[0, -0.50, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <circleGeometry args={[0.08, 6]} />
            {endMat}
          </mesh>
        </group>
      ))}

      {/* ── 중간층 — X축 방향 장작 2개 (엇갈리게) ── */}
      {[-0.14, 0.14].map((z, i) => (
        <group key={i} position={[0, 0.22, z]} rotation={[0, 0, Math.PI / 2]}>
          <mesh castShadow>
            <cylinderGeometry args={[0.08, 0.09, 0.80, 6]} />
            {logMat}
          </mesh>
          <mesh position={[0, 0.40, 0]} rotation={[Math.PI / 2, 0, 0]}>
            <circleGeometry args={[0.08, 6]} />
            {endMat}
          </mesh>
          <mesh position={[0, -0.40, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <circleGeometry args={[0.08, 6]} />
            {endMat}
          </mesh>
        </group>
      ))}

      {/* ── 위층 — Z축 방향 장작 2개 ── */}
      {[-0.14, 0.14].map((x, i) => (
        <group key={i} position={[x, 0.36, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <mesh castShadow>
            <cylinderGeometry args={[0.07, 0.08, 0.80, 6]} />
            {logMat}
          </mesh>
          <mesh position={[0, 0.40, 0]} rotation={[Math.PI / 2, 0, 0]}>
            <circleGeometry args={[0.07, 6]} />
            {endMat}
          </mesh>
          <mesh position={[0, -0.40, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <circleGeometry args={[0.07, 6]} />
            {endMat}
          </mesh>
        </group>
      ))}

      {/* 눈 쌓임 */}
      <mesh position={[0, 0.46, 0]} rotation-x={-Math.PI / 2} scale={[0.70, 1.0, 1.0]}>
        <circleGeometry args={[0.52, 8]} />
        <meshStandardMaterial color="#EEF4FF" roughness={1} />
      </mesh>
    </group>
  );
}
