"use client";

import React from "react";

export default function FrozenPond({
  position,
  radius = 3.0,
}: {
  position: [number, number, number];
  radius?: number;
}) {
  return (
    <group position={position}>
      {/* 눈 테두리 — 연못 가장자리를 두르는 살짝 높은 링 */}
      <mesh rotation-x={-Math.PI / 2} position={[0, 0.01, 0]}>
        <ringGeometry args={[radius * 0.88, radius, 10]} />
        <meshStandardMaterial color="#DDE8F0" roughness={1} />
      </mesh>

      {/* 얼음 메인 면 */}
      <mesh rotation-x={-Math.PI / 2} position={[0, 0.02, 0]}>
        <circleGeometry args={[radius * 0.88, 10]} />
        <meshStandardMaterial
          color="#A8CCD8"
          roughness={0.15}
          metalness={0.1}
          transparent
          opacity={0.82}
        />
      </mesh>

      {/* 얼음 균열 — 저폴리 평면 선형 조각들 */}
      {[
        { rx: 0.10, rz: 0.04, len: radius * 0.55, angle:  0.3 },
        { rx: 0.05, rz: 0.10, len: radius * 0.40, angle:  1.9 },
        { rx:-0.12, rz:-0.05, len: radius * 0.48, angle: -0.8 },
        { rx: 0.08, rz:-0.12, len: radius * 0.35, angle:  2.7 },
        { rx:-0.06, rz: 0.08, len: radius * 0.30, angle: -2.1 },
      ].map((c, i) => (
        <mesh
          key={i}
          position={[c.rx * radius, 0.025, c.rz * radius]}
          rotation={[-Math.PI / 2, 0, c.angle]}
        >
          <planeGeometry args={[0.018, c.len]} />
          <meshBasicMaterial color="#7AAFC0" transparent opacity={0.55} />
        </mesh>
      ))}

      {/* 표면 하이라이트 — 중앙 밝은 반사 */}
      <mesh rotation-x={-Math.PI / 2} position={[0.1 * radius, 0.026, -0.08 * radius]}>
        <circleGeometry args={[radius * 0.22, 7]} />
        <meshBasicMaterial color="#D8EEF8" transparent opacity={0.35} />
      </mesh>
    </group>
  );
}
