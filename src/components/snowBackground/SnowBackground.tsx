"use client";

import React, { useMemo, useRef } from "react";
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

  useFrame((_, delta) => {
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
  });

  // 나무 위치·스케일 — useMemo 안에서 한 번만 계산
  // 나무 생성 시 겹침을 피할 구역 목록 [cx, cz, 최소거리]
  const EXCLUDE_ZONES: [number, number, number][] = [
    [-3.5, -7.0, 4.5], // 얼어붙은 연못 (radius 3.2 + 여유)
  ];

  const trees = useMemo(() => {
    const arr = [];
    for (let i = 0; i < 40; i++) {
      const angle = (i / 24) * Math.PI * 2 + Math.random() * 0.25;
      const dist  = 8.0 + Math.random() * 9.0;
      const x     = Math.cos(angle) * dist;
      const z     = Math.sin(angle) * dist;

      // 제외 구역과 겹치면 건너뜀
      const blocked = EXCLUDE_ZONES.some(([cx, cz, minDist]) => {
        const dx = x - cx, dz = z - cz;
        return Math.sqrt(dx * dx + dz * dz) < minDist;
      });
      if (blocked) continue;

      arr.push({
        pos:   [x, 0, z] as [number, number, number],
        scale: 0.5 + Math.random() * 0.35,
      });
    }
    return arr;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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

      {/* 받침대 — Y=0 기준, 상단면이 Y=PEDESTAL_TOP(0.8)에 위치 */}
      <Pedestal radius={GLOBE_RADIUS} />

      {/* 하반구 — 구슬 아랫부분 채움 (thetaStart=PI/2 → 적도에서 하단까지) */}
      <mesh position={[0, GLOBE_CENTER_Y, 0]}>
        <sphereGeometry args={[GLOBE_RADIUS, 32, 16, 0, Math.PI * 2, Math.PI / 2, Math.PI / 2]} />
        <meshStandardMaterial color="#1A0F05" roughness={1} side={2} />
      </mesh>

      {/* 스텐실 마스크 — 구슬 실루엣을 stencil=1로 마킹 (눈 클리핑용, 화면에는 안 보임) */}
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

      {/* 유리구슬 — 중심을 GLOBE_CENTER_Y(10.8)에 배치해 받침대 위에 정확히 안착 */}
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

      {/* 구슬 내부 콘텐츠 — 받침대 상단면보다 살짝 위(+0.01)에서 시작해 Z-fighting 방지 */}
      <group position={[0, PEDESTAL_TOP + 0.01, 0]}>
        {/* 눈 쌓인 지면 */}
        <mesh rotation-x={-Math.PI / 2} receiveShadow>
          <circleGeometry args={[GLOBE_RADIUS - 0.2, 48]} />
          <meshStandardMaterial color="#F0F5FF" roughness={1} />
        </mesh>

        {/* 침엽수 — 방 외곽 링 */}
        {trees.map(({ pos, scale: s }, i) => (
          <group key={i} position={pos} scale={s}>
            {/* 기둥 */}
            <mesh position={[0, 0.5, 0]} castShadow>
              <cylinderGeometry args={[0.15, 0.22, 1.0, 6]} />
              <meshStandardMaterial color="#3D2B1F" />
            </mesh>
            {/* 침엽 */}
            <mesh position={[0, 2.0, 0]} castShadow>
              <coneGeometry args={[1.2, 3.0, 6]} />
              <meshStandardMaterial color="#1B3022" />
            </mesh>
            {/* 눈 쌓임 — 침엽 위에 살짝 작은 흰 콘 */}
            <mesh position={[0, 2.6, 0]}>
              <coneGeometry args={[0.95, 2.2, 6]} />
              <meshStandardMaterial color="#EEF4FF" roughness={1} />
            </mesh>
          </group>
        ))}

        {/* 모닥불 */}
        <Bonfire position={[4.0, 0.1, 0.1]} />

        {/* 얼어붙은 연못 */}
        <FrozenPond position={[-3.5, 0, -7.0]} radius={3.2} />

        {/* 장작더미 & 눈사람 */}
        <Woodpile position={[-1.2, 0, 3.2]} />
        <Snowman  position={[-1.2, 0, 4.3]} rotation={[0, 1.2, 0]} />

        {/* 눈 — 구슬 내부에서만 내림 */}
        <Snow
          isStorm={isStorm}
          spawnRadius={GLOBE_RADIUS * 0.85}
          spawnY={GLOBE_RADIUS * 1.8}
          count={700}
        />

        {/* 집 배치: 중앙에서 살짝 뒤쪽(-2)에 위치, 크기는 1.8배로 키움 */}
        <House
            position={[8.2, 0, -3]}
            rotationY={-Math.PI / 4}
            wallColor="#5a3d31"
            roofColor="#7a6d67"
            scale={1.8}
        />

      </group>
      {mode === "night" && (
        <Stars radius={100} depth={50} count={3000} factor={4} saturation={0} fade />
      )}
      <fog attach="fog" args={[isStorm ? "#8AAFC8" : "#D0E0FF", isStorm ? 6 : 20, isStorm ? 38 : 80]} />
    </group>
  );
}
