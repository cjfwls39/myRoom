"use client";

/**
 * Desk.tsx
 *
 * ── 좌표계 가이드 (PcTower 내부) ──────────────────────────────
 * 본체가 180도 회전되어 있어 좌표 방향이 반대입니다:
 * - X축: -0.15 (메인보드 쪽) ↔ +0.15 (아크릴판 쪽)
 * - Y축: 0 (바닥) ↔ 0.45 (천장)
 * - Z축: -0.225 (뒷면) ↔ +0.225 (앞면 - 팬 설치 위치)
 * ──────────────────────────────────────────────────────────
 */

import { useRef } from "react";
import { Text } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import AnimatedWrapper from "../AnimatedWrapper";
import { MAT } from "../materials";
import { COLOR, DELAY } from "../constants";
import { POS, SIZE } from "../layout";

// ══════════════════════════════════════════════════════
//  1. PC 내부 조립 유닛 (좌표 및 디테일 보존)
// ══════════════════════════════════════════════════════

/**
 * PowerSupply: 하단 빨간색 영역 (바닥에 묵직하게 안착)
 */
function PowerSupply({ pc }: { pc: typeof SIZE.pc }) {
  const psuW = pc.sizeX * 0.8;
  const psuH = 0.12;
  const psuD = pc.sizeZ * 0.5;
  return (
    <group position={[0, psuH / 2 + 0.01, 0]}>
      <mesh castShadow receiveShadow>
        <boxGeometry args={[psuW, psuH, psuD]} />
        <meshStandardMaterial color="#0a0a0a" metalness={0.8} roughness={0.2} />
      </mesh>
      <mesh position={[0, 0, psuD / 2 + 0.002]}>
        <boxGeometry args={[psuW * 0.6, psuH * 0.5, 0.01]} />
        <meshStandardMaterial color="#1a1a1a" />
      </mesh>
    </group>
  );
}

/**
 * CaseFans: 초록색 영역 (큼직한 앞면 듀얼 팬)
 */
function CaseFans({ pc }: { pc: typeof SIZE.pc }) {
  const fanSize = 0.16;
  const fanT = 0.025;
  return (
    <group position={[0, pc.sizeY * 0.6, pc.sizeZ / 2 - fanT / 2 - 0.01]}>
      {/* 상단 팬 */}
      <group position={[0, 0.09, 0]}>
        <mesh castShadow>
          <boxGeometry args={[fanSize, fanSize, fanT]} />
          <meshStandardMaterial color="#111" />
        </mesh>
        <mesh position={[0, 0, -0.01]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.07, 0.07, 0.015, 16]} />
          <meshStandardMaterial
            color="#222"
            emissive="#00ffff"
            emissiveIntensity={0.3}
          />
        </mesh>
      </group>
      {/* 하단 팬 */}
      <group position={[0, -0.09, 0]}>
        <mesh castShadow>
          <boxGeometry args={[fanSize, fanSize, fanT]} />
          <meshStandardMaterial color="#111" />
        </mesh>
        <mesh position={[0, 0, -0.01]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.07, 0.07, 0.015, 16]} />
          <meshStandardMaterial
            color="#222"
            emissive="#00ffff"
            emissiveIntensity={0.3}
          />
        </mesh>
      </group>
    </group>
  );
}

/**
 * LcdWaterBlock: 본체 왼쪽 상단 대형 LCD
 */
function LcdWaterBlock({ pc }: { pc: typeof SIZE.pc }) {
  const blockPos: [number, number, number] = [
    -pc.sizeX * 0.22,
    pc.sizeY * 0.68,
    0,
  ];
  return (
    <group position={blockPos}>
      <mesh castShadow>
        <boxGeometry args={[0.1, 0.2, 0.22]} />
        <meshStandardMaterial color="#111" metalness={0.9} />
      </mesh>
      <mesh position={[0.051, 0, 0]} rotation={[0, Math.PI / 2, 0]}>
        <planeGeometry args={[0.18, 0.16]} />
        <meshStandardMaterial
          color="#000"
          emissive="#002233"
          emissiveIntensity={1.2}
        />
      </mesh>
      <group position={[0.052, 0, 0]} rotation={[0, Math.PI / 2, 0]}>
        <Text position={[0, 0.045, 0]} fontSize={0.018} color="#00ffff">
          {"SYSTEM ACTIVE"}
        </Text>
        <Text position={[0, -0.01, 0]} fontSize={0.038} color="#ffffff">
          {"32°C"}
        </Text>
        <Text position={[0, -0.055, 0]} fontSize={0.014} color="#ff00ff">
          {"LIQUID: 28°C"}
        </Text>
      </group>
    </group>
  );
}

/**
 * CoolingTubes: 파란색 선 영역 (상단 연결 튜브)
 */
function CoolingTubes({ pc }: { pc: typeof SIZE.pc }) {
  return (
    <group position={[-pc.sizeX * 0.12, pc.sizeY * 0.85, 0]}>
      <mesh position={[0, 0, 0.06]}>
        <cylinderGeometry args={[0.012, 0.012, 0.15, 12]} />
        <meshStandardMaterial color="#55aaff" transparent opacity={0.5} />
      </mesh>
      <mesh position={[0, 0, -0.06]}>
        <cylinderGeometry args={[0.012, 0.012, 0.15, 12]} />
        <meshStandardMaterial color="#55aaff" transparent opacity={0.5} />
      </mesh>
    </group>
  );
}

function Gpu({ pc }: { pc: typeof SIZE.pc }) {
  return (
    <group position={[0, pc.sizeY * 0.38, 0]}>
      <mesh position={[0, 0.065, 0]}>
        <boxGeometry args={[pc.sizeX * 0.55, 0.01, pc.sizeZ * 0.8]} />
        <meshStandardMaterial color="#111" metalness={0.8} />
      </mesh>
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[pc.sizeX * 0.5, 0.1, pc.sizeZ * 0.75]} />
        <meshStandardMaterial color="#888" metalness={0.9} />
      </mesh>
      <mesh position={[pc.sizeX * 0.3, 0.02, 0]} rotation={[0, Math.PI / 2, 0]}>
        <planeGeometry args={[pc.sizeZ * 0.5, 0.02]} />
        <meshStandardMaterial
          color="#ff00ff"
          emissive="#ff00ff"
          emissiveIntensity={2.5}
        />
      </mesh>
    </group>
  );
}

function Ram({ pc }: { pc: typeof SIZE.pc }) {
  return (
    <group position={[-pc.sizeX * 0.28, pc.sizeY * 0.65, -pc.sizeZ * 0.25]}>
      {[0.04, 0.07, 0.1, 0.13].map((z, i) => (
        <mesh key={i} position={[0, 0, z]}>
          <boxGeometry args={[0.009, 0.14, 0.009]} />
          <meshStandardMaterial emissive="#ff00ff" emissiveIntensity={2} />
        </mesh>
      ))}
    </group>
  );
}

function SmallSsd({ pc }: { pc: typeof SIZE.pc }) {
  return (
    <mesh position={[-pc.sizeX * 0.35, pc.sizeY * 0.35, 0.12]}>
      <boxGeometry args={[0.01, 0.02, 0.08]} />
      <meshStandardMaterial
        color="#222"
        emissive="#00ffff"
        emissiveIntensity={0.8}
      />
    </mesh>
  );
}

function Case({ pc }: { pc: typeof SIZE.pc }) {
  const halfY = pc.sizeY / 2;
  const t = 0.01;
  return (
    <group>
      <mesh position={[0, t / 2, 0]}>
        <boxGeometry args={[pc.sizeX, t, pc.sizeZ]} />
        <meshStandardMaterial color="#0d0d0d" />
      </mesh>
      <mesh position={[0, pc.sizeY - t / 2, 0]}>
        <boxGeometry args={[pc.sizeX, t, pc.sizeZ]} />
        <meshStandardMaterial color="#0d0d0d" />
      </mesh>
      <mesh position={[0, halfY, -pc.sizeZ / 2]}>
        <boxGeometry args={[pc.sizeX, pc.sizeY, t]} />
        <meshStandardMaterial color="#0d0d0d" />
      </mesh>
      <mesh position={[0, halfY, pc.sizeZ / 2]}>
        <boxGeometry args={[pc.sizeX, pc.sizeY, t]} />
        <meshStandardMaterial color="#0d0d0d" />
      </mesh>
      <mesh position={[-pc.sizeX / 2, halfY, 0]}>
        <boxGeometry args={[t, pc.sizeY, pc.sizeZ]} />
        <meshStandardMaterial color="#0d0d0d" />
      </mesh>
    </group>
  );
}

// ══════════════════════════════════════════════════════
//  2. 가구 컴포넌트 (누락 없이 보존)
// ══════════════════════════════════════════════════════

function Monitor({ deskTopY }: { deskTopY: number }) {
  const m = SIZE.monitor;
  const screenCY = deskTopY + m.standH + m.riseY + m.frameH / 2;
  return (
    <group position={[m.offsetX, 0, m.offsetZ]}>
      <mesh position={[0, deskTopY + 0.007, 0]} receiveShadow>
        <boxGeometry args={[m.frameX * 0.3, 0.014, m.baseZ]} />
        <meshStandardMaterial color="#222" />
      </mesh>
      <mesh position={[0, deskTopY + m.standH / 2, 0]}>
        <boxGeometry args={[m.standW, m.standH, m.standW]} />
        <meshStandardMaterial color="#1a1a1a" />
      </mesh>
      <mesh position={[0, screenCY, 0]} castShadow>
        <boxGeometry args={[m.frameX + 0.05, m.frameH + 0.05, m.frameZ]} />
        <meshStandardMaterial color="#111" />
      </mesh>
      <mesh position={[0, screenCY, m.frameZ * 0.5 + 0.003]}>
        <boxGeometry args={[m.frameX, m.frameH, 0.007]} />
        <meshStandardMaterial
          emissive={COLOR.screenBlue}
          emissiveIntensity={1.5}
        />
      </mesh>
      <Text
        position={[0, screenCY + 0.06, m.frameZ * 0.5 + 0.01]}
        fontSize={0.06}
        color={COLOR.textBlue}
      >
        {"Portfolio"}
      </Text>
    </group>
  );
}

function Keyboard({ deskTopY }: { deskTopY: number }) {
  const kb = SIZE.keyboard;
  return (
    <group position={[kb.offsetX, deskTopY + kb.sizeY / 2, kb.offsetZ]}>
      <mesh castShadow receiveShadow>
        <boxGeometry args={[kb.sizeX, kb.sizeY, kb.sizeZ]} />
        <meshStandardMaterial color="#1a1a1a" />
      </mesh>
      {([-0.05, 0, 0.05] as number[]).map((z, i) => (
        <mesh key={i} position={[0, kb.sizeY * 0.5, z]}>
          <boxGeometry args={[kb.sizeX * 0.9, 0.005, 0.02]} />
          <meshStandardMaterial color="#2a2a2a" />
        </mesh>
      ))}
    </group>
  );
}

function MouseArea({ deskTopY }: { deskTopY: number }) {
  const mp = SIZE.mousepad;
  const ms = SIZE.mouse;
  return (
    <group position={[mp.offsetX, deskTopY + mp.sizeY / 2, mp.offsetZ]}>
      <mesh receiveShadow>
        <boxGeometry args={[mp.sizeX, mp.sizeY, mp.sizeZ]} />
        <meshStandardMaterial color="#111" />
      </mesh>
      <mesh position={[0, ms.r, 0]} rotation={[Math.PI / 2, 0, 0]} castShadow>
        <capsuleGeometry args={[ms.r, ms.len, 8, 16]} />
        <meshStandardMaterial color="#111" />
      </mesh>
    </group>
  );
}

function Chair() {
  const ch = SIZE.chair;
  return (
    <group position={[ch.offsetX, 0, ch.offsetZ]} rotation={[0, Math.PI, 0]}>
      {[0, 1, 2, 3, 4].map((i) => {
        const angle = (i * Math.PI * 2) / 5;
        return (
          <group key={i} rotation={[0, angle, 0]}>
            <mesh position={[ch.legLen / 2, 0.02, 0]}>
              <boxGeometry args={[ch.legLen, 0.03, 0.04]} />
              <meshStandardMaterial color="#1c1c1c" />
            </mesh>
            <mesh
              position={[ch.legLen, 0.02, 0]}
              rotation={[Math.PI / 2, 0, 0]}
            >
              <cylinderGeometry args={[ch.wheelR, ch.wheelR, 0.02]} />
              <meshStandardMaterial color="#111" />
            </mesh>
          </group>
        );
      })}
      <mesh position={[0, ch.poleH / 2, 0]}>
        <cylinderGeometry args={[ch.poleR, ch.poleR, ch.poleH]} />
        <meshStandardMaterial color="#222" />
      </mesh>
      <mesh position={[0, ch.seatY, 0]} castShadow>
        <boxGeometry args={[ch.seatW, ch.seatH, ch.seatD]} />
        <meshStandardMaterial color="#111" />
      </mesh>
      <mesh position={[0, ch.seatY + ch.backOffY, -ch.seatD / 2]} castShadow>
        <boxGeometry args={[ch.backD, ch.backH, ch.backW]} />
        <meshStandardMaterial color="#111" />
      </mesh>
    </group>
  );
}

function DeskBody({ deskTopY }: { deskTopY: number }) {
  const d = SIZE.desk;
  const legX = d.topW / 2 - d.legW;
  const legZ = d.topD / 2 - d.legW;
  return (
    <>
      <mesh position={[0, deskTopY - d.topH / 2, 0]} castShadow receiveShadow>
        <boxGeometry args={[d.topW, d.topH, d.topD]} />
        <meshStandardMaterial color={COLOR.woodLight} {...MAT.woodLight} />
      </mesh>
      {[
        [-legX, d.legH / 2, -legZ],
        [-legX, d.legH / 2, legZ],
        [legX, d.legH / 2, -legZ],
        [legX, d.legH / 2, legZ],
      ].map((p, i) => (
        <mesh key={i} position={p as [number, number, number]} castShadow>
          <boxGeometry args={[d.legW, d.legH, d.legW]} />
          <meshStandardMaterial color={COLOR.woodMid} {...MAT.woodMid} />
        </mesh>
      ))}
    </>
  );
}

// ══════════════════════════════════════════════════════
//  3. 메인 조립 (PcTower - 아크릴 투명도 수정)
// ══════════════════════════════════════════════════════

function PcTower({
  deskTopY,
  pcLightRef,
}: {
  deskTopY: number;
  pcLightRef: React.RefObject<THREE.PointLight>;
}) {
  const pc = SIZE.pc;
  const halfY = pc.sizeY / 2;

  return (
    <group
      position={[pc.offsetX, deskTopY, pc.offsetZ]}
      rotation={[0, Math.PI, 0]}
    >
      <Case pc={pc} />

      {/* ── 아크릴판 재질 수정 (투명도 조절 및 흐림 효과) ── */}
      <mesh position={[pc.sizeX / 2, halfY, 0]} rotation={[0, Math.PI / 2, 0]}>
        <planeGeometry args={[pc.sizeZ, pc.sizeY]} />
        <meshStandardMaterial
          color="#ffffff"
          transparent
          opacity={0.15} /* 기존 0.03에서 0.15로 높여 더 불투명하게 조정 */
          roughness={0.6} /* 표면을 거칠게 만들어 '흐린' 느낌 부여 */
          metalness={0.1}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* 내부 조명 */}
      <pointLight
        ref={pcLightRef}
        position={[0, halfY, 0]}
        color="#f700ff"
        intensity={1.5}
        distance={2.5}
      />

      {/* 부품 조립 */}
      <PowerSupply pc={pc} />
      <CaseFans pc={pc} />
      <CoolingTubes pc={pc} />
      <Gpu pc={pc} />
      <Ram pc={pc} />
      <LcdWaterBlock pc={pc} />
      <SmallSsd pc={pc} />
    </group>
  );
}

export default function Desk() {
  const pcLightRef = useRef<THREE.PointLight>(null!);
  const { legH, topH } = SIZE.desk;
  const deskTopY = legH + topH;

  useFrame((state) => {
    if (pcLightRef.current) {
      pcLightRef.current.intensity =
        1.2 + Math.sin(state.clock.elapsedTime * 2.2) * 0.4;
    }
  });

  return (
    <AnimatedWrapper
      delay={DELAY.desk}
      position={POS.desk as [number, number, number]}
      liftHeight={0.05}
      hover={false}
    >
      <group rotation={[0, Math.PI / 2, 0]}>
        <DeskBody deskTopY={deskTopY} />
        <Monitor deskTopY={deskTopY} />
        <PcTower deskTopY={deskTopY} pcLightRef={pcLightRef} />
        <Keyboard deskTopY={deskTopY} />
        <MouseArea deskTopY={deskTopY} />
        <Chair />
      </group>
    </AnimatedWrapper>
  );
}
