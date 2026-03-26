"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import AnimatedWrapper, { SceneItem } from "../AnimatedWrapper";
import { MAT } from "../materials";
import { COLOR, DELAY } from "../constants";
import { POS, SIZE } from "../layout";

// ─────────────────────────────────────────────────────
//  팬 블레이드 (회전 애니메이션)
// ─────────────────────────────────────────────────────
function Fan({
  r, speed, glowColor, position, rotation,
}: {
  r: number;
  speed: number;
  glowColor: string;
  position: [number, number, number];
  rotation: [number, number, number];
}) {
  const bladeRef = useRef<THREE.Group>(null!);
  useFrame((_, delta) => {
    if (bladeRef.current) bladeRef.current.rotation.z += delta * speed;
  });

  return (
    <group position={position} rotation={rotation}>
      {/* 팬 프레임 */}
      <mesh>
        <boxGeometry args={[r * 2.2, r * 2.2, 0.018]} />
        <meshStandardMaterial color="#0a0a0a" metalness={0.4} roughness={0.6} />
      </mesh>
      {/* 블레이드 그룹 */}
      <group ref={bladeRef}>
        {[0, 1, 2, 3, 4, 5].map((i) => {
          const angle = (i / 6) * Math.PI * 2;
          return (
            <mesh
              key={i}
              position={[
                Math.cos(angle) * r * 0.52,
                Math.sin(angle) * r * 0.52,
                0,
              ]}
              rotation={[0, 0, angle + 0.5]}
            >
              <boxGeometry args={[r * 0.42, r * 0.26, 0.004]} />
              <meshStandardMaterial
                color="#1a1a2a"
                emissive={glowColor}
                emissiveIntensity={0.35}
              />
            </mesh>
          );
        })}
        {/* 허브 */}
        <mesh>
          <cylinderGeometry args={[r * 0.11, r * 0.11, 0.006, 12]} />
          <meshStandardMaterial
            color="#111"
            emissive={glowColor}
            emissiveIntensity={1.0}
          />
        </mesh>
      </group>
      {/* 코너 나사 4개 */}
      {([[-1,-1],[-1,1],[1,-1],[1,1]] as [number,number][]).map(([sx,sy], i) => (
        <mesh key={i} position={[sx * r * 1.0, sy * r * 1.0, 0.010]}>
          <cylinderGeometry args={[0.004, 0.004, 0.003, 8]} />
          <meshStandardMaterial color="#2a2a2a" metalness={0.9} />
        </mesh>
      ))}
    </group>
  );
}

// ─────────────────────────────────────────────────────
//  PC 타워
// ─────────────────────────────────────────────────────
function PcTower({ deskTopY, pcLightRef }: {
  deskTopY: number;
  pcLightRef: React.RefObject<THREE.PointLight>;
}) {
  const { sizeX, sizeY, sizeZ, wallT,
          acrylicOpacity, acrylicRoughness,
          mbX, mbY, mbH, mbD,
          gpuX, gpuY, gpuH, gpuD,
          fanSize, fanT, fanYs, fanR,
          topFanSize, topFanZs, topFanR,
          rgbColor, rgbColor2,
          offsetX, offsetZ } = SIZE.pc;

  const hY = sizeY / 2;
  const t  = wallT;

  return (
    <group position={[offsetX, deskTopY, offsetZ]} rotation={[0, Math.PI, 0]}>

      {/* ── 케이스 외벽 — 바닥/천장/앞/뒤/왼쪽 5면 ── */}
      {/* 바닥 */}
      <mesh position={[0, t / 2, 0]} castShadow>
        <boxGeometry args={[sizeX, t, sizeZ]} />
        <meshStandardMaterial color="#0d0d0d" metalness={0.6} roughness={0.4} />
      </mesh>
      {/* 천장 */}
      <mesh position={[0, sizeY - t / 2, 0]}>
        <boxGeometry args={[sizeX, t, sizeZ]} />
        <meshStandardMaterial color="#0d0d0d" metalness={0.6} roughness={0.4} />
      </mesh>
      {/* 뒷벽 */}
      <mesh position={[0, hY, -sizeZ / 2]}>
        <boxGeometry args={[sizeX, sizeY, t]} />
        <meshStandardMaterial color="#111" metalness={0.5} roughness={0.5} />
      </mesh>
      {/* 앞벽 */}
      <mesh position={[0, hY, sizeZ / 2]}>
        <boxGeometry args={[sizeX, sizeY, t]} />
        <meshStandardMaterial color="#0a0a0a" metalness={0.4} roughness={0.6} />
      </mesh>
      {/* 왼쪽 솔리드 패널 */}
      <mesh position={[-sizeX / 2, hY, 0]}>
        <boxGeometry args={[t, sizeY, sizeZ]} />
        <meshStandardMaterial color="#111" metalness={0.5} roughness={0.4} />
      </mesh>

      {/* ── 오른쪽 아크릴 패널 — 테두리 4줄 + 투명 유리 ── */}
      {/* 테두리: 위/아래/앞/뒤 얇은 바 4개 (가운데는 뻥 뚫림) */}
      {/* 위 */}
      <mesh position={[sizeX / 2, sizeY - t / 2, 0]}>
        <boxGeometry args={[t, t, sizeZ]} />
        <meshStandardMaterial color="#1a1a1a" metalness={0.8} roughness={0.2} />
      </mesh>
      {/* 아래 */}
      <mesh position={[sizeX / 2, t / 2, 0]}>
        <boxGeometry args={[t, t, sizeZ]} />
        <meshStandardMaterial color="#1a1a1a" metalness={0.8} roughness={0.2} />
      </mesh>
      {/* 앞 */}
      <mesh position={[sizeX / 2, hY, sizeZ / 2]}>
        <boxGeometry args={[t, sizeY, t]} />
        <meshStandardMaterial color="#1a1a1a" metalness={0.8} roughness={0.2} />
      </mesh>
      {/* 뒤 */}
      <mesh position={[sizeX / 2, hY, -sizeZ / 2]}>
        <boxGeometry args={[t, sizeY, t]} />
        <meshStandardMaterial color="#1a1a1a" metalness={0.8} roughness={0.2} />
      </mesh>
      {/* 아크릴 유리 — 테두리 안쪽 투명 패널 */}
      <mesh position={[sizeX / 2, hY, 0]}>
        <boxGeometry args={[t * 0.3, sizeY - t * 2, sizeZ - t * 2]} />
        <meshStandardMaterial
          color="#cce8ff"
          transparent
          opacity={acrylicOpacity}
          roughness={acrylicRoughness}
          metalness={0.0}
          side={THREE.DoubleSide}
          depthWrite={false}
        />
      </mesh>


      {/*
       * ════════════════════════════════════════════
       *  내부 레이아웃 (그림 기준, 180° 회전 보정)
       *  케이스 로컬 좌표 (rotation PI 적용 전 기준):
       *    X: -sizeX/2(아크릴쪽) ~ +sizeX/2(솔리드쪽)
       *    Y: 0(바닥) ~ sizeY(천장)
       *    Z: -sizeZ/2(뒤) ~ +sizeZ/2(앞)
       *  180° 회전 후 카메라에서 보면:
       *    그림 왼쪽 = +Z 방향
       *    그림 오른쪽 = -Z 방향
       * ════════════════════════════════════════════
       *
       *  [좌상단 파랑]  케이스팬 3개    z: +0.18~+0.42  y: 0.50~0.82
       *  [우상단 보라]  메인보드+RAM    z: -0.38~-0.05  y: 0.22~0.82
       *  [중단  초록]  GPU             z: -0.42~+0.42  y: 0.30~0.56
       *  [좌하단 빨강] SSD/HDD         z: +0.08~+0.42  y: 0.04~0.26
       *  [우하단 빨강] PSU             z: -0.42~-0.02  y: 0.04~0.26
       */}



      {/* ════ 우상단: 메인보드 ════ */}
      {/* 메인보드 기판 — 후면 왼쪽(-Z 방향)에 세워짐 */}
      <mesh position={[-sizeX * 0.30, 0.52, -0.20]}>
        <boxGeometry args={[0.006, 0.58, 0.34]} />
        <meshStandardMaterial color="#1a2510" roughness={0.85} metalness={0.15} />
      </mesh>
      {/* MB 회로 장식 라인 */}
      {([0.10, 0.25, 0.40, 0.55] as number[]).map((yR, i) => (
        <mesh key={i} position={[-sizeX * 0.28, 0.52 + (yR - 0.30) * 0.58, -0.20 + (i % 2 === 0 ? 0.06 : -0.06)]}>
          <boxGeometry args={[0.001, 0.003, 0.12]} />
          <meshStandardMaterial color="#2a4a1a" emissive="#003300" emissiveIntensity={1.2} />
        </mesh>
      ))}
      {/* MB 소켓 덩어리 (CPU 소켓) */}
      <mesh position={[-sizeX * 0.26, 0.62, -0.16]}>
        <boxGeometry args={[0.018, 0.09, 0.09]} />
        <meshStandardMaterial color="#222" metalness={0.6} roughness={0.4} />
      </mesh>

      {/* RAM 스틱 3장 — 메인보드 위에 꽂힘 */}
      {([-0.06, -0.12, -0.18] as number[]).map((zOff, i) => (
        <group key={i} position={[-sizeX * 0.25, 0.60, zOff]}>
          <mesh>
            <boxGeometry args={[0.005, 0.26, 0.038]} />
            <meshStandardMaterial color="#0d1520" metalness={0.25} roughness={0.75} />
          </mesh>
          {/* RAM RGB 상단 */}
          <mesh position={[0.004, 0.14, 0]}>
            <boxGeometry args={[0.003, 0.012, 0.034]} />
            <meshStandardMaterial
              color={i === 0 ? "#cc00ff" : i === 1 ? "#8800ff" : "#5500cc"}
              emissive={i === 0 ? "#cc00ff" : i === 1 ? "#8800ff" : "#5500cc"}
              emissiveIntensity={2.8}
            />
          </mesh>
        </group>
      ))}

      {/* ════ 중단: GPU (가로로 꽉 채움) ════ */}
      {/* GPU 본체 — Y 중간대, Z 전체 폭 */}
      <mesh position={[0, 0.42, 0]}>
        <boxGeometry args={[sizeX * 0.72, 0.22, sizeZ * 0.88]} />
        <meshStandardMaterial color="#0e0e14" metalness={0.80} roughness={0.20} />
      </mesh>
      {/* GPU 상단 RGB 스트립 */}
      <mesh position={[sizeX * 0.35, 0.54, 0]}>
        <boxGeometry args={[0.005, 0.007, sizeZ * 0.84]} />
        <meshStandardMaterial color="#ff00ff" emissive="#ff00ff" emissiveIntensity={3.8} />
      </mesh>
      {/* GPU 전면 RGB 스트립 */}
      <mesh position={[0, 0.43, sizeZ * 0.44]}>
        <boxGeometry args={[sizeX * 0.68, 0.006, 0.005]} />
        <meshStandardMaterial color="#ff00ff" emissive="#dd00ff" emissiveIntensity={2.5} />
      </mesh>
      {/* GPU 팬 3개 — 균등 배치 */}
      {([-0.28, 0.0, 0.28] as number[]).map((z, i) => (
        <Fan
          key={i}
          r={0.068}
          speed={7 + i}
          glowColor="#ee00ee"
          position={[sizeX * 0.35, 0.43, z]}
          rotation={[0, Math.PI / 2, 0]}
        />
      ))}
      {/* GPU 히트싱크 핀 (측면) */}
      {([0, 1, 2, 3, 4, 5, 6] as number[]).map((i) => (
        <mesh key={i} position={[sizeX * 0.10 + i * 0.022, 0.42, 0]}>
          <boxGeometry args={[0.006, 0.19, sizeZ * 0.82]} />
          <meshStandardMaterial color="#555" metalness={0.9} roughness={0.15} />
        </mesh>
      ))}

      {/* ════ 좌하단: SSD / HDD ════ */}
      {/* SSD 슬림 판 2개 */}
      <mesh position={[0, 0.14, 0.24]}>
        <boxGeometry args={[sizeX * 0.75, 0.04, 0.28]} />
        <meshStandardMaterial color="#111" metalness={0.7} roughness={0.35} />
      </mesh>
      <mesh position={[0, 0.20, 0.24]}>
        <boxGeometry args={[sizeX * 0.75, 0.025, 0.28]} />
        <meshStandardMaterial color="#0a0a12" metalness={0.6} roughness={0.4} />
      </mesh>
      {/* SSD 활동 LED */}
      <mesh position={[sizeX * 0.36, 0.215, 0.35]}>
        <boxGeometry args={[0.004, 0.004, 0.004]} />
        <meshStandardMaterial color="#00ff88" emissive="#00ff88" emissiveIntensity={4.0} />
      </mesh>

      {/* ════ 우하단: PSU ════ */}
      <mesh position={[0, 0.13, -0.22]}>
        <boxGeometry args={[sizeX * 0.78, 0.20, 0.36]} />
        <meshStandardMaterial color="#080808" metalness={0.75} roughness={0.30} />
      </mesh>
      {/* PSU 팬 그릴 (측면 패턴) */}
      <mesh position={[-sizeX * 0.38, 0.13, -0.22]}>
        <boxGeometry args={[0.004, 0.14, 0.30]} />
        <meshStandardMaterial color="#181818" metalness={0.5} roughness={0.6} />
      </mesh>
      {/* PSU 팬 */}
      <Fan
        r={0.050}
        speed={5}
        glowColor="#444444"
        position={[-sizeX * 0.36, 0.13, -0.22]}
        rotation={[0, Math.PI / 2, 0]}
      />
      {/* PSU 라벨 */}
      <mesh position={[sizeX * 0.36, 0.13, -0.22]}>
        <boxGeometry args={[0.003, 0.10, 0.28]} />
        <meshStandardMaterial color="#1a1a1a" roughness={0.9} />
      </mesh>

      {/* ════ 상단 배기 팬 2개 ════ */}
      {([-0.20, 0.20] as number[]).map((z, i) => (
        <Fan
          key={i}
          r={topFanR}
          speed={11 + i * 2}
          glowColor="#00ddff"
          position={[0, sizeY - fanT * 0.5 - 0.002, z]}
          rotation={[Math.PI / 2, 0, 0]}
        />
      ))}

      {/* ════ 바닥 RGB 스트립 ════ */}
      <mesh position={[0, t * 1.2, 0]}>
        <boxGeometry args={[0.004, 0.005, sizeZ * 0.85]} />
        <meshStandardMaterial color={rgbColor} emissive={rgbColor} emissiveIntensity={2.5} />
      </mesh>

      {/* ── 내부 조명 ── */}
      <pointLight
        ref={pcLightRef}
        position={[mbX + 0.06, hY * 0.6, 0]}
        color={rgbColor}
        intensity={1.6}
        distance={1.8}
      />
      <pointLight
        position={[mbX + 0.05, hY * 0.25, 0]}
        color={rgbColor2}
        intensity={0.7}
        distance={1.2}
      />

    </group>
  );
}

// ─────────────────────────────────────────────────────
//  모니터
// ─────────────────────────────────────────────────────
function Monitor({ deskTopY }: { deskTopY: number }) {
  const m = SIZE.monitor;
  const screenCY = deskTopY + m.standH + m.riseY + m.frameH / 2;
  const sZ = m.frameZ * 0.5 + 0.004;

  const W = m.frameX;  // 1.44
  const H = m.frameH;  // 0.63

  // 별 위치 (화면 로컬 좌표 — 화면 중심 기준)
  const stars = [
    [-0.55,  0.22], [-0.38,  0.08], [-0.20,  0.25], [ 0.02,  0.18],
    [ 0.18,  0.27], [ 0.35,  0.10], [ 0.52,  0.20], [ 0.60, -0.05],
    [-0.62, -0.10], [-0.45, -0.20], [-0.28, -0.08], [-0.10, -0.22],
    [ 0.12, -0.14], [ 0.28, -0.24], [ 0.48, -0.18], [ 0.64,  0.22],
    [-0.50,  0.01], [ 0.40, -0.06], [-0.15,  0.12], [ 0.22,  0.03],
    [-0.66,  0.15], [ 0.55, -0.25], [-0.32,  0.20], [ 0.08, -0.05],
  ] as [number, number][];

  return (
    <group position={[m.offsetX, 0, m.offsetZ]}>
      {/* 스탠드 받침 */}
      <mesh position={[0, deskTopY + 0.007, 0]} receiveShadow>
        <boxGeometry args={[m.frameX * 0.3, 0.014, m.baseZ]} />
        <meshStandardMaterial color="#222" />
      </mesh>
      {/* 스탠드 기둥 */}
      <mesh position={[0, deskTopY + m.standH / 2, 0]}>
        <boxGeometry args={[m.standW, m.standH, m.standW]} />
        <meshStandardMaterial color="#1a1a1a" />
      </mesh>
      {/* 모니터 프레임 */}
      <mesh position={[0, screenCY, 0]} castShadow>
        <boxGeometry args={[m.frameX + 0.05, m.frameH + 0.05, m.frameZ]} />
        <meshStandardMaterial color="#111" />
      </mesh>

      {/* ── 우주 배경 (검은 하늘) ── */}
      <mesh position={[0, screenCY, sZ]}>
        <boxGeometry args={[W, H, 0.001]} />
        <meshStandardMaterial color="#03020f" emissive="#03020f" emissiveIntensity={0.3} />
      </mesh>

      {/* ── 성운 글로우 — 보라/파랑 겹쳐서 안개 느낌 ── */}
      <mesh position={[-0.18, screenCY + 0.06, sZ + 0.001]}>
        <planeGeometry args={[0.55, 0.32]} />
        <meshStandardMaterial
          color="#2a0840" emissive="#5010a0" emissiveIntensity={0.28}
          transparent opacity={0.45} depthWrite={false}
        />
      </mesh>
      <mesh position={[0.22, screenCY - 0.08, sZ + 0.001]}>
        <planeGeometry args={[0.48, 0.26]} />
        <meshStandardMaterial
          color="#081428" emissive="#1040a0" emissiveIntensity={0.22}
          transparent opacity={0.40} depthWrite={false}
        />
      </mesh>
      <mesh position={[0.10, screenCY + 0.04, sZ + 0.0015]}>
        <planeGeometry args={[0.30, 0.20]} />
        <meshStandardMaterial
          color="#140828" emissive="#8020c0" emissiveIntensity={0.20}
          transparent opacity={0.30} depthWrite={false}
        />
      </mesh>

      {/* ── 별들 ── */}
      {stars.map(([sx, sy], i) => {
        const size = i % 5 === 0 ? 0.008 : i % 3 === 0 ? 0.006 : 0.004;
        const bright = i % 4 === 0 ? 4.0 : i % 3 === 0 ? 2.5 : 1.5;
        const col = i % 5 === 0 ? "#ffe8c0" : i % 3 === 0 ? "#c0d8ff" : "#ffffff";
        return (
          <mesh key={i} position={[sx, screenCY + sy, sZ + 0.002]}>
            <planeGeometry args={[size, size]} />
            <meshStandardMaterial color={col} emissive={col} emissiveIntensity={bright} depthWrite={false} />
          </mesh>
        );
      })}

      {/* ── 행성 1 — 보라빛 가스 행성 (중앙 우상단) ── */}
      <mesh position={[0.28, screenCY + 0.10, sZ + 0.002]}>
        <planeGeometry args={[0.18, 0.18]} />
        <meshStandardMaterial color="#4a2870" emissive="#7030c0" emissiveIntensity={0.55} roughness={0.6} transparent opacity={0.95} depthWrite={false} />
      </mesh>
      {/* 행성 1 고리 — 얇은 타원형 플레인 */}
      <mesh position={[0.28, screenCY + 0.08, sZ + 0.0025]}>
        <planeGeometry args={[0.34, 0.06]} />
        <meshStandardMaterial color="#9060d0" emissive="#a070e0" emissiveIntensity={0.6} transparent opacity={0.45} depthWrite={false} />
      </mesh>

      {/* ── 행성 2 — 파란 얼음 행성 (좌하단) ── */}
      <mesh position={[-0.38, screenCY - 0.14, sZ + 0.002]}>
        <planeGeometry args={[0.12, 0.12]} />
        <meshStandardMaterial color="#1a3a6a" emissive="#2060b0" emissiveIntensity={0.50} roughness={0.5} transparent opacity={0.95} depthWrite={false} />
      </mesh>

      {/* ── 행성 3 — 작은 붉은 행성 (우하단) ── */}
      <mesh position={[0.52, screenCY - 0.18, sZ + 0.002]}>
        <planeGeometry args={[0.07, 0.07]} />
        <meshStandardMaterial color="#6a1a10" emissive="#c04030" emissiveIntensity={0.55} roughness={0.7} transparent opacity={0.95} depthWrite={false} />
      </mesh>

      {/* ── 화면 발광 — 보라빛이 책상 앞으로 ── */}
      <pointLight
        position={[0, screenCY, sZ + 0.18]}
        color="#6030b0"
        intensity={0.40}
        distance={1.4}
      />
    </group>
  );
}

// ─────────────────────────────────────────────────────
//  키보드
// ─────────────────────────────────────────────────────
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

// ─────────────────────────────────────────────────────
//  마우스 + 패드
// ─────────────────────────────────────────────────────
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

// ─────────────────────────────────────────────────────
//  의자
// ─────────────────────────────────────────────────────
function Chair() {
  const ch = SIZE.chair;
  return (
    <group position={[ch.offsetX, 0, ch.offsetZ]} rotation={[0, Math.PI, 0]}>
      {[0,1,2,3,4].map((i) => {
        const angle = (i * Math.PI * 2) / 5;
        return (
          <group key={i} rotation={[0, angle, 0]}>
            <mesh position={[ch.legLen / 2, 0.02, 0]}>
              <boxGeometry args={[ch.legLen, 0.03, 0.04]} />
              <meshStandardMaterial color="#1c1c1c" />
            </mesh>
            <mesh position={[ch.legLen, 0.02, 0]} rotation={[Math.PI / 2, 0, 0]}>
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

// ─────────────────────────────────────────────────────
//  책상 본체
// ─────────────────────────────────────────────────────
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
      {([ [-legX, d.legH/2, -legZ], [-legX, d.legH/2,  legZ],
           [ legX, d.legH/2, -legZ], [ legX, d.legH/2,  legZ] ] as [number,number,number][])
        .map((p, i) => (
        <mesh key={i} position={p} castShadow>
          <boxGeometry args={[d.legW, d.legH, d.legW]} />
          <meshStandardMaterial color={COLOR.woodMid} {...MAT.woodMid} />
        </mesh>
      ))}
    </>
  );
}

// ─────────────────────────────────────────────────────
//  메인 export
// ─────────────────────────────────────────────────────
export default function Desk() {
  const pcLightRef = useRef<THREE.PointLight>(null!);
  const { legH, topH, topW, topD } = SIZE.desk;
  const deskTopY = legH + topH;

  // 히트박스: 책상 상판 + 의자까지 포함한 영역
  const hitW = topW + 0.1;
  const hitH = legH + topH + 0.1;
  const hitD = topD + 1.4;

  useFrame((state) => {
    if (pcLightRef.current) {
      pcLightRef.current.intensity =
        1.4 + Math.sin(state.clock.elapsedTime * 2.0) * 0.45;
    }
  });

  return (
    <SceneItem
      delay={DELAY.desk}
      position={POS.desk as [number, number, number]}
      liftHeight={0.05}
      hitbox={[hitW, hitH, hitD] as [number, number, number]}
      hitboxPos={[0, hitH / 2, 0.6] as [number, number, number]}
    >
      <group rotation={[0, Math.PI / 2, 0]}>
        <DeskBody deskTopY={deskTopY} />
        <Monitor deskTopY={deskTopY} />
        <PcTower deskTopY={deskTopY} pcLightRef={pcLightRef} />
        <Keyboard deskTopY={deskTopY} />
        <MouseArea deskTopY={deskTopY} />
        <Chair />
      </group>
    </SceneItem>
  );
}