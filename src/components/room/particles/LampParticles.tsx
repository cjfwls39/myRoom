"use client";

/**
 * LampParticles.tsx
 *
 * 무드등 파티클 시스템
 *
 * ── 설계 원칙 ──────────────────────────────────────────
 *  1. 모든 파티클 데이터를 Float32Array로 관리
 *     → 매 프레임 new 없이 배열만 수정 → GC 압박 없음
 *
 *  2. Points(BufferGeometry) 사용
 *     → 파티클 1개 = 버텍스 1개, draw call 1회로 전체 처리
 *     → 수백 개도 성능 영향 미미
 *
 *  3. 파티클 메타데이터(속도, 수명 등)도 Float32Array로 관리
 *     → 별도 객체 배열 없음
 *
 *  4. mode 전환 시 파티클 즉시 리셋하지 않고
 *     자연스럽게 페이드아웃 후 새 파티클 생성
 *
 * ── 파티클 종류 ────────────────────────────────────────
 *  SunParticles  : 구 표면에서 바깥으로 튀어나가는 코로나 파티클
 *  MoonParticles : 구 주변을 천천히 떠다니는 반짝임 파티클
 * ─────────────────────────────────────────────────────
 */

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

// ── 공통 유틸 ─────────────────────────────────────────
/** 구면 랜덤 방향 벡터 */
function randomOnSphere(radius: number, out: Float32Array, offset: number) {
  const u     = Math.random();
  const v     = Math.random();
  const theta = 2 * Math.PI * u;
  const phi   = Math.acos(2 * v - 1);
  out[offset]     = radius * Math.sin(phi) * Math.cos(theta);
  out[offset + 1] = radius * Math.sin(phi) * Math.sin(theta);
  out[offset + 2] = radius * Math.cos(phi);
}

// ══════════════════════════════════════════════════════
//  SunParticles — 태양풍 코로나 파티클
// ══════════════════════════════════════════════════════
const SUN_COUNT  = 120;
const SUN_RADIUS = 0.22;

interface SunParticlesProps {
  visible: boolean;
}

export function SunParticles({ visible }: SunParticlesProps) {
  const pointsRef = useRef<THREE.Points>(null!);
  const geoRef    = useRef<THREE.BufferGeometry>(null!);

  const positions = useMemo(() => new Float32Array(SUN_COUNT * 3), []);

  const meta = useMemo(() => {
    const arr = new Float32Array(SUN_COUNT * 6);
    for (let i = 0; i < SUN_COUNT; i++) {
      const base = i * 6;
      randomOnSphere(SUN_RADIUS, positions, i * 3);
      const nx = positions[i * 3]     / SUN_RADIUS;
      const ny = positions[i * 3 + 1] / SUN_RADIUS;
      const nz = positions[i * 3 + 2] / SUN_RADIUS;
      // 속도 대폭 상향 — 멀리서도 튀어나가는 게 보이도록
      const speed = 0.012 + Math.random() * 0.018;
      arr[base]     = nx * speed;
      arr[base + 1] = ny * speed;
      arr[base + 2] = nz * speed;
      arr[base + 3] = Math.random();
      arr[base + 4] = 0.5 + Math.random() * 0.8;
      arr[base + 5] = 1.0 + Math.random() * 1.5;
    }
    return arr;
  }, [positions]);

  const colors = useMemo(() => {
    const arr = new Float32Array(SUN_COUNT * 3);
    for (let i = 0; i < SUN_COUNT; i++) {
      arr[i * 3]     = 1.0;
      arr[i * 3 + 1] = 0.7;
      arr[i * 3 + 2] = 0.1;
    }
    return arr;
  }, []);

  useFrame((_, delta) => {
    if (!visible || !geoRef.current) return;

    for (let i = 0; i < SUN_COUNT; i++) {
      const pi   = i * 3;
      const mi   = i * 6;
      const life = meta[mi + 3];
      const maxL = meta[mi + 4];

      meta[mi + 3] += delta / maxL;

      if (meta[mi + 3] >= 1.0) {
        randomOnSphere(SUN_RADIUS, positions, pi);
        const nx = positions[pi]     / SUN_RADIUS;
        const ny = positions[pi + 1] / SUN_RADIUS;
        const nz = positions[pi + 2] / SUN_RADIUS;
        const speed = 0.012 + Math.random() * 0.018;
        meta[mi]     = nx * speed;
        meta[mi + 1] = ny * speed;
        meta[mi + 2] = nz * speed;
        meta[mi + 3] = 0;
        meta[mi + 4] = 0.5 + Math.random() * 0.8;
      } else {
        positions[pi]     += meta[mi];
        positions[pi + 1] += meta[mi + 1];
        positions[pi + 2] += meta[mi + 2];

        const bright = life < 0.3
          ? life / 0.3
          : 1.0 - (life - 0.3) / 0.7;
        colors[pi]     = 1.0;
        colors[pi + 1] = 0.5 + bright * 0.4;
        colors[pi + 2] = bright * 0.15;
      }
    }

    geoRef.current.attributes.position.needsUpdate = true;
    geoRef.current.attributes.color.needsUpdate    = true;
  });

  if (!visible) return null;

  return (
    <points ref={pointsRef}>
      <bufferGeometry ref={geoRef}>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-color"    args={[colors, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.055}
        vertexColors
        transparent
        opacity={0.95}
        sizeAttenuation
        depthWrite={false}
      />
    </points>
  );
}

// ══════════════════════════════════════════════════════
//  MoonParticles — 달빛 반짝임 파티클
// ══════════════════════════════════════════════════════
const MOON_COUNT  = 80;
const MOON_RADIUS = 0.22;
const MOON_FIELD  = 0.90;  // 더 넓게 퍼지도록

interface MoonParticlesProps {
  visible: boolean;
}

export function MoonParticles({ visible }: MoonParticlesProps) {
  const geoRef = useRef<THREE.BufferGeometry>(null!);

  const positions = useMemo(() => {
    const arr = new Float32Array(MOON_COUNT * 3);
    for (let i = 0; i < MOON_COUNT; i++) {
      randomOnSphere(
        MOON_RADIUS + Math.random() * (MOON_FIELD - MOON_RADIUS),
        arr,
        i * 3,
      );
    }
    return arr;
  }, []);

  const meta = useMemo(() => {
    const arr = new Float32Array(MOON_COUNT * 6);
    for (let i = 0; i < MOON_COUNT; i++) {
      const base = i * 6;
      arr[base]     = positions[i * 3];
      arr[base + 1] = positions[i * 3 + 1];
      arr[base + 2] = positions[i * 3 + 2];
      arr[base + 3] = Math.random();
      arr[base + 4] = 0.25 + Math.random() * 0.35;  // 명멸 더 빠르게
      arr[base + 5] = Math.random() * Math.PI * 2;
    }
    return arr;
  }, [positions]);

  const colors = useMemo(() => {
    const arr = new Float32Array(MOON_COUNT * 3);
    for (let i = 0; i < MOON_COUNT; i++) {
      arr[i * 3]     = 0.7;
      arr[i * 3 + 1] = 0.85;
      arr[i * 3 + 2] = 1.0;
    }
    return arr;
  }, []);

  useFrame(({ clock }) => {
    if (!visible || !geoRef.current) return;
    const t = clock.elapsedTime;

    for (let i = 0; i < MOON_COUNT; i++) {
      const pi    = i * 3;
      const mi    = i * 6;
      const phase = meta[mi + 5];
      const speed = meta[mi + 4];

      const bright = (Math.sin(t * speed * Math.PI * 2 + phase) + 1) / 2;

      // 부유 범위도 넓게
      positions[pi]     = meta[mi]     + Math.sin(t * 0.22 + phase) * 0.025;
      positions[pi + 1] = meta[mi + 1] + Math.cos(t * 0.17 + phase) * 0.025;
      positions[pi + 2] = meta[mi + 2] + Math.sin(t * 0.20 + phase + 1) * 0.025;

      colors[pi]     = 0.55 + bright * 0.45;
      colors[pi + 1] = 0.75 + bright * 0.25;
      colors[pi + 2] = 1.0;
    }

    geoRef.current.attributes.position.needsUpdate = true;
    geoRef.current.attributes.color.needsUpdate    = true;
  });

  if (!visible) return null;

  return (
    <points>
      <bufferGeometry ref={geoRef}>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-color"    args={[colors, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.048}
        vertexColors
        transparent
        opacity={0.95}
        sizeAttenuation
        depthWrite={false}
      />
    </points>
  );
}