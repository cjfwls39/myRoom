"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface PlanetConfig {
  orbitRadius: number;   // 공전 반경
  orbitY:      number;   // 공전 높이
  orbitSpeed:  number;   // 공전 속도
  spinSpeed:   number;   // 자전 속도
  initAngle:   number;   // 초기 각도
  radius:      number;   // 행성 크기
  color:       string;   // 행성 색
  hasRing:     boolean;
  ringColor?:  string;
  ringTilt?:   number;
}

const PLANETS: PlanetConfig[] = [
  // ── 기존 5개 ──────────────────────────────
  {
    // 토성 느낌 — 고리 있는 갈색
    orbitRadius: 11, orbitY: 5.5, orbitSpeed: 0.18, spinSpeed: 0.5,
    initAngle: 0, radius: 0.55, color: "#9B8060",
    hasRing: true,   ringColor: "#C4A882", ringTilt: Math.PI / 2.2,
  },
  {
    // 파란 얼음 행성
    orbitRadius: 14, orbitY: 7.0, orbitSpeed: 0.11, spinSpeed: 0.3,
    initAngle: Math.PI * 0.35, radius: 0.40, color: "#4A7AAA",
    hasRing: true, ringColor: "#88AACC", ringTilt: Math.PI / 2.4,
  },
  {
    // 붉은 사막 행성
    orbitRadius: 9,  orbitY: 4.0, orbitSpeed: 0.27, spinSpeed: 0.7,
    initAngle: Math.PI * 0.70, radius: 0.30, color: "#AA5533",
    hasRing: true, ringColor: "#CC8866", ringTilt: Math.PI / 1.6,
  },
  {
    // 보라 가스 행성 — 고리 있는
    orbitRadius: 16, orbitY: 6.0, orbitSpeed: 0.07, spinSpeed: 0.25,
    initAngle: Math.PI * 1.05, radius: 0.65, color: "#6A5080",
    hasRing: true,   ringColor: "#9A80BB", ringTilt: Math.PI / 1.8,
  },
  {
    // 초록 이끼 행성
    orbitRadius: 12, orbitY: 8.5, orbitSpeed: 0.22, spinSpeed: 0.45,
    initAngle: Math.PI * 1.40, radius: 0.35, color: "#4A7A55",
    hasRing: false,
  },

  // ── 추가 5개 ──────────────────────────────
  {
    // 황금 사막 — 고리 있는
    orbitRadius: 18, orbitY: 3.5, orbitSpeed: 0.05, spinSpeed: 0.2,
    initAngle: Math.PI * 1.75, radius: 0.50, color: "#C4922A",
    hasRing: true,   ringColor: "#E0B860", ringTilt: Math.PI / 2.6,
  },
  {
    // 청록 수증기 행성
    orbitRadius: 8,  orbitY: 9.5, orbitSpeed: 0.45, spinSpeed: 0.8,
    initAngle: Math.PI * 0.20, radius: 0.25, color: "#3A9A8A",
    hasRing: true, ringColor: "#60C4B4", ringTilt: Math.PI / 2.0,
  },
  {
    // 분홍 구름 행성
    orbitRadius: 13, orbitY: 2.5, orbitSpeed: 0.14, spinSpeed: 0.4,
    initAngle: Math.PI * 0.55, radius: 0.38, color: "#C47090",
    hasRing: false,
  },
  {
    // 은빛 얼음 — 고리 있는
    orbitRadius: 20, orbitY: 8.0, orbitSpeed: 0.04, spinSpeed: 0.15,
    initAngle: Math.PI * 0.90, radius: 0.70, color: "#A0B8CC",
    hasRing: true,   ringColor: "#D0E4F0", ringTilt: Math.PI / 2.0,
  },
  {
    // 자주 용암 행성
    orbitRadius: 10, orbitY: 11.0, orbitSpeed: 0.33, spinSpeed: 0.6,
    initAngle: Math.PI * 1.25, radius: 0.28, color: "#883030",
    hasRing: true, ringColor: "#CC5544", ringTilt: Math.PI / 1.4,
  },
];

function Planet({ config }: { config: PlanetConfig }) {
  const orbitRef  = useRef<THREE.Group>(null!);
  const planetRef = useRef<THREE.Group>(null!);

  useFrame((_, delta) => {
    if (orbitRef.current)  orbitRef.current.rotation.y  += delta * config.orbitSpeed;
    if (planetRef.current) planetRef.current.rotation.y += delta * config.spinSpeed;
  });

  const R = config.radius;

  return (
    <group
      ref={orbitRef}
      position={[0, config.orbitY, 0]}
      rotation={[0, config.initAngle, 0]}
    >
      <group position={[config.orbitRadius, 0, 0]}>
        <group ref={planetRef}>
          {/* 행성 본체 */}
          <mesh>
            <sphereGeometry args={[R, 20, 20]} />
            <meshStandardMaterial
              color={config.color}
              roughness={0.85}
              metalness={0.05}
            />
          </mesh>

          {/* 고리 */}
          {config.hasRing && (
            <>
              <mesh rotation={[config.ringTilt!, 0, 0]}>
                <ringGeometry args={[R * 1.45, R * 2.4, 48]} />
                <meshStandardMaterial
                  color={config.ringColor}
                  side={THREE.DoubleSide}
                  transparent opacity={0.80}
                  roughness={0.9}
                />
              </mesh>
              <mesh rotation={[config.ringTilt!, 0, 0]}>
                <ringGeometry args={[R * 1.50, R * 2.1, 48]} />
                <meshStandardMaterial
                  color={config.ringColor}
                  side={THREE.DoubleSide}
                  transparent opacity={0.30}
                  roughness={0.9}
                />
              </mesh>
            </>
          )}
        </group>
      </group>
    </group>
  );
}

export default function SpaceObjects() {
  return (
    <group>
      {PLANETS.map((config, i) => (
        <Planet key={i} config={config} />
      ))}
    </group>
  );
}