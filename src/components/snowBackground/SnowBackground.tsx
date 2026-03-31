"use client";

import React, { useMemo, useRef, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import { Stars, MeshTransmissionMaterial } from "@react-three/drei";
import * as THREE from "three";

import Snow from "./Snow";
import Bonfire from "./Bonfire";
import Woodpile from "./Woodpile";
import Snowman from "./Snowman";
import FrozenPond from "./FrozenPond";
import Pedestal from "./Pedestal";
import House from "./House";
import LampPost from "./LampPost";
import ChristmasTree from "./ChristmasTree";
import { PhaseGroup } from "../room/AnimatedWrapper";
import { useDayNight, PRESETS } from "../canvas/DayNightContext";
import { useWeather } from "../canvas/WeatherContext";

// ── 좌표 기준 ──────────────────────────────────────────
// PEDESTAL_TOP(0.8) = 받침대 상단면 Y
// GLOBE_CENTER_Y    = 받침대 위에 구슬이 정확히 안착하는 구슬 중심 Y
const GLOBE_RADIUS   = 20;
const PEDESTAL_TOP   = 0.8;
const GLOBE_CENTER_Y = PEDESTAL_TOP; // 0.8 — 구슬이 받침대에 안착된 스노우글로브 구조

export default function SnowBackground() {
  const { mode }    = useDayNight();
  const { isStorm } = useWeather();
  const sunRef    = useRef<THREE.DirectionalLight>(null!);
  const ambRef    = useRef<THREE.AmbientLight>(null!);
  const ambColorRef = useRef(new THREE.Color());
  const sunColorRef = useRef(new THREE.Color());

  // 나무 instancedMesh refs
  const treeTrunkRef = useRef<THREE.InstancedMesh>(null!);
  const treeConeRef  = useRef<THREE.InstancedMesh>(null!);
  const treeSnowRef  = useRef<THREE.InstancedMesh>(null!);

  // 가로등 불빛 refs — 6개를 단일 useFrame에서 통합 처리
  const LAMP_COUNT = 6;
  const lampRefs = useRef<(THREE.PointLight | null)[]>(Array(LAMP_COUNT).fill(null));

  useFrame(({ clock }, delta) => {
    const isNight = mode === "night";
    const t = 1 - Math.pow(0.001, delta);

    if (ambRef.current) {
      const targetAmbI = isStorm ? 0.2 : (isNight ? 0.4 : 0.6);
      ambRef.current.intensity += (targetAmbI - ambRef.current.intensity) * t;
      ambColorRef.current.set(PRESETS[mode].ambientColor);
      ambRef.current.color.lerp(ambColorRef.current, t);
    }
    if (sunRef.current) {
      const targetSunI = isStorm ? 0.1 : (isNight ? 0.7 : 2.5);
      sunRef.current.intensity += (targetSunI - sunRef.current.intensity) * t;
      sunColorRef.current.set(PRESETS[mode].dirColor);
      sunRef.current.color.lerp(sunColorRef.current, t);
    }

    // 가로등 6개 — 단일 루프로 통합 처리
    const et   = clock.elapsedTime;
    const base = isNight ? 4.5 : 0.5;
    const flicker = Math.sin(et * 13) * 0.14 + Math.sin(et * 7.7) * 0.07;
    for (let i = 0; i < LAMP_COUNT; i++) {
      const l = lampRefs.current[i];
      if (l) l.intensity = base + flicker;
    }
  });

  // 집 색상 팔레트 — 비슷한 웜 톤이지만 미묘하게 차이
  const HOUSE_PALETTE = [
    { wall: "#C8935A", roof: "#7A3020" }, // 오렌지 브라운 + 다크 레드
    { wall: "#D4A878", roof: "#6B4020" }, // 라이트 탠 + 다크 브라운
    { wall: "#BB8A68", roof: "#703828" }, // 미디엄 브라운 + 버건디
  ];

  // 집 위치 고정 → 나머지 공간에 나무를 채움
  const { houses, trees } = useMemo(() => {
    // 고정 집 위치 (연못[-3.5,-7]·모닥불[4,0]·눈사람[-1.2,4.3] 회피, 120° 균등 배치)
    const houseList = [
      { position: [ 11,  0,  5 ] as [number, number, number], wallColor: HOUSE_PALETTE[0].wall, roofColor: HOUSE_PALETTE[0].roof, scale: 0.92 },
      { position: [-11,  0,  5 ] as [number, number, number], wallColor: HOUSE_PALETTE[1].wall, roofColor: HOUSE_PALETTE[1].roof, scale: 0.85 },
      { position: [  1,  0, -12] as [number, number, number], wallColor: HOUSE_PALETTE[2].wall, roofColor: HOUSE_PALETTE[2].roof, scale: 0.90 },
    ].map(h => ({
      ...h,
      rotationY: Math.atan2(-h.position[0], -h.position[2]),
    }));

    // 나무 제외 구역: 연못 + 크리스마스 트리 + 각 집 위치 + 가로등
    const excludeZones: [number, number, number][] = [
      [-3.5, -7.0, 4.5],   // 연못
      [-8.5, -10.5, 4.0],  // 크리스마스 트리
      ...houseList.map(h => [h.position[0], h.position[2], 4.0] as [number, number, number]),
      [  8.2,  3.2, 1.8 ], // 가로등 1
      [ -8.0,  2.8, 1.8 ], // 가로등 2
      [  1.5, -9.2, 1.8 ], // 가로등 3
      [ -5.5, -3.2, 1.8 ], // 가로등 4
      [  6.5, -2.0, 1.8 ], // 가로등 5
      [  2.2,  6.0, 1.8 ], // 가로등 6
    ];

    // 나무 생성
    const treeList: { pos: [number, number, number]; scale: number }[] = [];
    for (let i = 0; i < 100; i++) {
      const angle = (i / 40) * Math.PI * 2 + Math.random() * 0.4;
      const dist  = 7.5 + Math.random() * 10.0;
      const x     = Math.cos(angle) * dist;
      const z     = Math.sin(angle) * dist;

      const scale = 0.5 + Math.random() * 0.35;

      // 제외 구역(연못·집) 체크
      const blocked = excludeZones.some(([cx, cz, minDist]) => {
        const dx = x - cx, dz = z - cz;
        return Math.sqrt(dx * dx + dz * dz) < minDist;
      });
      if (blocked) continue;

      // 이미 배치된 나무와 너무 가까우면 건너뜀 (나무 반경 × 스케일 기반)
      const tooClose = treeList.some(t => {
        const dx = x - t.pos[0], dz = z - t.pos[2];
        return Math.sqrt(dx * dx + dz * dz) < (scale + t.scale) * 1.2;
      });
      if (tooClose) continue;

      treeList.push({
        pos: [x, 0, z] as [number, number, number],
        scale,
      });
    }

    return { houses: houseList, trees: treeList };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 나무 인스턴스 행렬 설정 (마운트 후 1회)
  useEffect(() => {
    if (!treeTrunkRef.current || !treeConeRef.current || !treeSnowRef.current) return;
    const dummy = new THREE.Object3D();
    trees.forEach(({ pos, scale: s }, i) => {
      dummy.position.set(pos[0], pos[1] + 0.5 * s, pos[2]);
      dummy.scale.setScalar(s);
      dummy.updateMatrix();
      treeTrunkRef.current.setMatrixAt(i, dummy.matrix);

      dummy.position.set(pos[0], pos[1] + 2.0 * s, pos[2]);
      dummy.updateMatrix();
      treeConeRef.current.setMatrixAt(i, dummy.matrix);

      dummy.position.set(pos[0], pos[1] + 2.6 * s, pos[2]);
      dummy.updateMatrix();
      treeSnowRef.current.setMatrixAt(i, dummy.matrix);
    });
    treeTrunkRef.current.instanceMatrix.needsUpdate = true;
    treeConeRef.current.instanceMatrix.needsUpdate  = true;
    treeSnowRef.current.instanceMatrix.needsUpdate  = true;
  }, [trees]);

  // 눈은 구슬 내부 범위로 제한: 직경 ≈ GLOBE_RADIUS * 1.8, 높이 = 구슬 상단까지
  const snowRange  = GLOBE_RADIUS * 1.8;
  const snowSpawnY = GLOBE_RADIUS * 1.85; // 구슬 내부 상단에서 시작

  return (
    <group name="snow-globe-root">
      <ambientLight ref={ambRef} />
      <directionalLight
        ref={sunRef}
        position={[20, 35, 20]}
        castShadow
        shadow-mapSize={[1024, 1024]}
        shadow-camera-left={-22}
        shadow-camera-right={22}
        shadow-camera-top={22}
        shadow-camera-bottom={-22}
      />

      {/* ── Phase 1 (0.3s): 스노우글로브 외형 ── */}
      <PhaseGroup delay={0.3}>
        <Pedestal radius={GLOBE_RADIUS} />

        <mesh position={[0, GLOBE_CENTER_Y, 0]}>
          <sphereGeometry args={[GLOBE_RADIUS, 32, 16, 0, Math.PI * 2, Math.PI / 2, Math.PI / 2]} />
          <meshStandardMaterial color="#1A0F05" roughness={1} side={2} />
        </mesh>

        <mesh renderOrder={1} position={[0, GLOBE_CENTER_Y, 0]}>
          <sphereGeometry args={[GLOBE_RADIUS - 0.3, 32, 32]} />
          <meshBasicMaterial
            colorWrite={false}
            depthWrite={false}
            stencilWrite={true}
            stencilFunc={THREE.AlwaysStencilFunc}
            stencilZPass={THREE.ReplaceStencilOp}
            stencilRef={1}
          />
        </mesh>

        <mesh position={[0, GLOBE_CENTER_Y, 0]}>
          <sphereGeometry args={[GLOBE_RADIUS, 32, 32]} />
          <MeshTransmissionMaterial
            backside
            samples={1}
            resolution={256}
            thickness={0.15}
            roughness={0.04}
            transmission={1}
            ior={1.08}
            distortion={0.03}
            color="#e0f0ff"
          />
        </mesh>
      </PhaseGroup>

      {/* 구슬 내부 콘텐츠 */}
      <group position={[0, PEDESTAL_TOP + 0.01, 0]}>
        {/* ── Phase 2 (0.6s): 지면 ── */}
        <PhaseGroup delay={0.6}>
          <mesh rotation-x={-Math.PI / 2} receiveShadow>
            <circleGeometry args={[GLOBE_RADIUS - 0.2, 48]} />
            <meshStandardMaterial color="#F0F5FF" roughness={1} />
          </mesh>
        </PhaseGroup>

        {/* ── Phase 3 (0.9s): 침엽수 (instancedMesh — 3 draw call) ── */}
        <PhaseGroup delay={0.9}>
          <instancedMesh ref={treeTrunkRef} args={[undefined, undefined, trees.length]} castShadow>
            <cylinderGeometry args={[0.15, 0.22, 1.0, 6]} />
            <meshStandardMaterial color="#3D2B1F" />
          </instancedMesh>
          <instancedMesh ref={treeConeRef} args={[undefined, undefined, trees.length]} castShadow>
            <coneGeometry args={[1.2, 3.0, 6]} />
            <meshStandardMaterial color="#1B3022" />
          </instancedMesh>
          <instancedMesh ref={treeSnowRef} args={[undefined, undefined, trees.length]}>
            <coneGeometry args={[0.95, 2.2, 6]} />
            <meshStandardMaterial color="#EEF4FF" roughness={1} />
          </instancedMesh>
        </PhaseGroup>

        {/* ── Phase 4 (1.3s): 모닥불 + 연못 ── */}
        <Bonfire position={[4.0, 0.1, 0.1]} baseDelay={1.3} />
        <FrozenPond position={[-3.5, 0, -7.0]} radius={3.2} baseDelay={1.3} />

        {/* ── Phase 5 (1.6s): 눈사람 + 장작더미 + 크리스마스 트리 ── */}
        <Woodpile position={[-1.2, 0, 3.2]} baseDelay={1.6} />
        <Snowman  position={[-1.2, 0, 4.3]} rotation={[0, 1.2, 0]} baseDelay={1.6} />
        <ChristmasTree position={[-8.5, 0, -10.5]} baseDelay={1.6} />

        {/* ── Phase 6 (1.9s~): 집들 (순차 등장) ── */}
        {houses.map((h, i) => (
          <House key={i} {...h} baseDelay={1.9 + i * 0.15} />
        ))}

        {/* ── Phase 6.5 (2.1s~): 가로등 ── */}
        {([
          [  8.2, 0,  3.2 ],  // 집1 [11,0,5] 앞쪽
          [ -8.0, 0,  2.8 ],  // 집2 [-11,0,5] 앞쪽
          [  1.5, 0, -9.2 ],  // 집3 [1,0,-12] 앞쪽
          [ -5.5, 0, -3.2 ],  // 연못 서쪽
          [  6.5, 0, -2.0 ],  // 모닥불 너머 동쪽
          [  2.2, 0,  6.0 ],  // 북쪽 숲 입구
        ] as [number, number, number][]).map((pos, i) => (
          <LampPost
            key={i}
            position={pos}
            baseDelay={2.1 + i * 0.10}
            ref={(el) => { lampRefs.current[i] = el; }}
          />
        ))}

        {/* ── Phase 7 (2.2s): 눈 ── */}
        <PhaseGroup delay={2.2}>
          <Snow
            isStorm={isStorm}
            spawnRadius={GLOBE_RADIUS * 0.85}
            spawnY={GLOBE_RADIUS * 1.8}
            count={700}
          />
        </PhaseGroup>
      </group>
      {mode === "night" && (
        <Stars radius={100} depth={50} count={1500} factor={4} saturation={0} fade />
      )}
      <fog attach="fog" args={[isStorm ? "#8AAFC8" : "#D0E0FF", isStorm ? 6 : 20, isStorm ? 38 : 80]} />
    </group>
  );
}
