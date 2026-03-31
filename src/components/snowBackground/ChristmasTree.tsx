"use client";

import { useMemo } from "react";
import * as THREE from "three";
import { PhaseGroup } from "../room/AnimatedWrapper";

// 오너먼트: 각 단의 콘 표면 반지름에서 살짝 안쪽(×0.88)에 배치
// 하단 콘: center=2.4, h=3.2, maxR=3.0  →  apex=4.0, base=0.8
// 중단 콘: center=4.2, h=2.8, maxR=2.1  →  apex=5.6, base=2.8
// 상단 콘: center=5.9, h=2.2, maxR=1.3  →  apex=7.0, base=4.8
const ORNAMENTS = [
  // 하단 — y=1.6 (r_surf≈2.25×0.88≈1.98), y=2.1 (r_surf≈1.78×0.88≈1.57)
  { r: 1.98, a: 0.3,  y: 1.6, color: "#FF3333", em: "#FF0000" },
  { r: 1.98, a: 2.4,  y: 1.6, color: "#FFD700", em: "#FFA500" },
  { r: 1.98, a: 4.5,  y: 1.6, color: "#44AAFF", em: "#0055FF" },
  { r: 1.57, a: 1.3,  y: 2.1, color: "#FF44CC", em: "#FF0088" },
  { r: 1.57, a: 3.4,  y: 2.1, color: "#44FF88", em: "#00CC44" },
  { r: 1.57, a: 5.5,  y: 2.1, color: "#BB44FF", em: "#8800FF" },
  // 중단 — y=3.3 (r_surf≈1.73×0.88≈1.52), y=3.8 (r_surf≈1.35×0.88≈1.19)
  { r: 1.52, a: 0.8,  y: 3.3, color: "#FF3333", em: "#FF0000" },
  { r: 1.52, a: 3.0,  y: 3.3, color: "#FFD700", em: "#FFA500" },
  { r: 1.52, a: 5.2,  y: 3.3, color: "#44AAFF", em: "#0055FF" },
  { r: 1.19, a: 1.9,  y: 3.8, color: "#44FF88", em: "#00CC44" },
  { r: 1.19, a: 4.1,  y: 3.8, color: "#FF44CC", em: "#FF0088" },
  // 상단 — y=5.1 (r_surf≈1.06×0.88≈0.93), y=5.5 (r_surf≈0.82×0.88≈0.72)
  { r: 0.93, a: 0.6,  y: 5.1, color: "#FFD700", em: "#FFA500" },
  { r: 0.93, a: 2.7,  y: 5.1, color: "#FF3333", em: "#FF0000" },
  { r: 0.93, a: 4.8,  y: 5.1, color: "#44AAFF", em: "#0055FF" },
  { r: 0.72, a: 1.8,  y: 5.5, color: "#44FF88", em: "#00CC44" },
];

interface Props {
  position: [number, number, number];
  baseDelay?: number;
}

export default function ChristmasTree({ position, baseDelay = 0 }: Props) {
  const starGeo = useMemo(() => {
    const shape = new THREE.Shape();
    const pts = 5;
    const outer = 0.42;
    const inner = 0.17;
    for (let i = 0; i < pts * 2; i++) {
      const angle = (i / (pts * 2)) * Math.PI * 2 - Math.PI / 2;
      const r = i % 2 === 0 ? outer : inner;
      if (i === 0) shape.moveTo(Math.cos(angle) * r, Math.sin(angle) * r);
      else shape.lineTo(Math.cos(angle) * r, Math.sin(angle) * r);
    }
    shape.closePath();
    const geo = new THREE.ExtrudeGeometry(shape, { depth: 0.18, bevelEnabled: false });
    geo.computeVertexNormals();
    return geo;
  }, []);

  return (
    <group position={position}>
      {/* ── Phase 1: 기둥 ── */}
      <PhaseGroup delay={baseDelay}>
        <mesh position={[0, 0.65, 0]} castShadow>
          <cylinderGeometry args={[0.28, 0.38, 1.3, 6]} />
          <meshStandardMaterial color="#3D2B1F" />
        </mesh>
      </PhaseGroup>

      {/* ── Phase 2: 하단 단 ── */}
      <PhaseGroup delay={baseDelay + 0.2}>
        <mesh position={[0, 2.4, 0]} castShadow>
          <coneGeometry args={[3.0, 3.2, 7]} />
          <meshStandardMaterial color="#1A3D1E" roughness={0.9} />
        </mesh>
        <mesh position={[0, 2.8, 0]}>
          <coneGeometry args={[2.4, 2.3, 7]} />
          <meshStandardMaterial color="#EEF4FF" roughness={1} />
        </mesh>
      </PhaseGroup>

      {/* ── Phase 3: 중단 단 ── */}
      <PhaseGroup delay={baseDelay + 0.38}>
        <mesh position={[0, 4.2, 0]} castShadow>
          <coneGeometry args={[2.1, 2.8, 7]} />
          <meshStandardMaterial color="#1B4520" roughness={0.9} />
        </mesh>
        <mesh position={[0, 4.6, 0]}>
          <coneGeometry args={[1.6, 2.0, 7]} />
          <meshStandardMaterial color="#EEF4FF" roughness={1} />
        </mesh>
      </PhaseGroup>

      {/* ── Phase 4: 상단 단 ── */}
      <PhaseGroup delay={baseDelay + 0.54}>
        <mesh position={[0, 5.9, 0]} castShadow>
          <coneGeometry args={[1.3, 2.2, 7]} />
          <meshStandardMaterial color="#1C4D22" roughness={0.9} />
        </mesh>
        <mesh position={[0, 6.3, 0]}>
          <coneGeometry args={[0.95, 1.6, 7]} />
          <meshStandardMaterial color="#EEF4FF" roughness={1} />
        </mesh>
      </PhaseGroup>

      {/* ── Phase 5: 별 + 라이트 ── */}
      <PhaseGroup delay={baseDelay + 0.68}>
        <mesh position={[0, 7.50, -0.08]} geometry={starGeo}>
          <meshStandardMaterial
            color="#FFE066"
            emissive="#FFCC00"
            emissiveIntensity={4.0}
            side={THREE.DoubleSide}
          />
        </mesh>
        <pointLight position={[0, 7.6, 0]} color="#FFFFAA" intensity={2.5} distance={8} decay={2} />
      </PhaseGroup>

      {/* ── Phase 6+: 오너먼트 (하나씩) ── */}
      {ORNAMENTS.map((o, i) => (
        <PhaseGroup key={i} delay={baseDelay + 0.80 + i * 0.04}>
          <mesh position={[Math.cos(o.a) * o.r, o.y, Math.sin(o.a) * o.r]}>
            <sphereGeometry args={[0.20, 6, 5]} />
            <meshStandardMaterial
              color={o.color}
              emissive={o.em}
              emissiveIntensity={2.2}
              roughness={0.1}
              metalness={0.5}
            />
          </mesh>
        </PhaseGroup>
      ))}
    </group>
  );
}
