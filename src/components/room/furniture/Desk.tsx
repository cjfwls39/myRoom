"use client";

/**
 * Desk.tsx — 컴퓨터 책상 + 고퀄 PC 타워
 *
 * PcTower 내부 좌표계 (group rotation [0, Math.PI, 0] 적용 후):
 *   X: - = 메인보드 벽 / + = 아크릴 패널(카메라 방향)
 *   Y: 0 = 바닥 / sizeY = 천장
 *   Z: - = 뒷면 / + = 앞면(팬 설치)
 */

import { useRef } from "react";
import { Text } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import AnimatedWrapper from "../AnimatedWrapper";
import { MAT } from "../materials";
import { COLOR, DELAY } from "../constants";
import { POS, SIZE } from "../layout";

// ─────────────────────────────────────────────────────
//  유틸: 팬 블레이드 (회전 애니메이션 포함)
// ─────────────────────────────────────────────────────
function FanBlade({
  r, speed, color, glowColor,
}: {
  r: number; speed: number; color: string; glowColor: string;
}) {
  const ref = useRef<THREE.Group>(null!);
  useFrame((_, delta) => {
    if (ref.current) ref.current.rotation.z += delta * speed;
  });
  const bladeW = r * 0.38;
  return (
    <group ref={ref}>
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <mesh
          key={i}
          position={[
            Math.cos((i / 6) * Math.PI * 2) * r * 0.55,
            Math.sin((i / 6) * Math.PI * 2) * r * 0.55,
            0,
          ]}
          rotation={[0, 0, (i / 6) * Math.PI * 2 + 0.4]}
        >
          <boxGeometry args={[bladeW, r * 0.28, 0.003]} />
          <meshStandardMaterial color={color} emissive={glowColor} emissiveIntensity={0.4} />
        </mesh>
      ))}
      {/* 허브 */}
      <mesh>
        <cylinderGeometry args={[r * 0.12, r * 0.12, 0.005, 16]} />
        <meshStandardMaterial color="#111" emissive={glowColor} emissiveIntensity={0.8} />
      </mesh>
    </group>
  );
}

// ─────────────────────────────────────────────────────
//  케이스 외벽 (5면 + 아크릴 패널)
// ─────────────────────────────────────────────────────
function Case({ pc }: { pc: typeof SIZE.pc }) {
  const { sizeX, sizeY, sizeZ, wallT, acrylicOpacity, acrylicRoughness } = pc;
  const hY = sizeY / 2;
  const panelMat = <meshStandardMaterial color="#0d0d0d" metalness={0.65} roughness={0.35} />;
  return (
    <group>
      {/* 바닥 */}
      <mesh position={[0, wallT / 2, 0]}>
        <boxGeometry args={[sizeX, wallT, sizeZ]} />
        {panelMat}
      </mesh>
      {/* 천장 */}
      <mesh position={[0, sizeY - wallT / 2, 0]}>
        <boxGeometry args={[sizeX, wallT, sizeZ]} />
        {panelMat}
      </mesh>
      {/* 뒷벽 */}
      <mesh position={[0, hY, -sizeZ / 2]}>
        <boxGeometry args={[sizeX, sizeY, wallT]} />
        <meshStandardMaterial color="#111" metalness={0.5} roughness={0.5} />
      </mesh>
      {/* 앞면 */}
      <mesh position={[0, hY, sizeZ / 2]}>
        <boxGeometry args={[sizeX, sizeY, wallT]} />
        <meshStandardMaterial color="#0a0a0a" metalness={0.4} roughness={0.6} />
      </mesh>
      {/* 왼쪽 솔리드 패널 */}
      <mesh position={[-sizeX / 2, hY, 0]}>
        <boxGeometry args={[wallT, sizeY, sizeZ]} />
        <meshStandardMaterial color="#111" metalness={0.5} roughness={0.4} />
      </mesh>
      {/* 오른쪽 아크릴 패널 */}
      <mesh position={[sizeX / 2 - wallT * 0.3, hY, 0]}>
        <boxGeometry args={[wallT * 0.8, sizeY * 0.94, sizeZ * 0.94]} />
        <meshStandardMaterial
          color="#aaccff"
          transparent
          opacity={acrylicOpacity}
          roughness={acrylicRoughness}
          metalness={0.05}
          side={THREE.DoubleSide}
        />
      </mesh>
      {/* 아크릴 테두리 (4변 — 얇은 바) */}
      {/* 상단 바 */}
      <mesh position={[sizeX / 2 - wallT * 0.3, sizeY * 0.97, 0]}>
        <boxGeometry args={[wallT * 1.5, wallT * 1.5, sizeZ * 0.94]} />
        <meshStandardMaterial color="#1c1c1c" metalness={0.8} roughness={0.2} />
      </mesh>
      {/* 하단 바 */}
      <mesh position={[sizeX / 2 - wallT * 0.3, sizeY * 0.03, 0]}>
        <boxGeometry args={[wallT * 1.5, wallT * 1.5, sizeZ * 0.94]} />
        <meshStandardMaterial color="#1c1c1c" metalness={0.8} roughness={0.2} />
      </mesh>
      {/* 앞면 세로 바 */}
      <mesh position={[sizeX / 2 - wallT * 0.3, hY, sizeZ * 0.47]}>
        <boxGeometry args={[wallT * 1.5, sizeY * 0.94, wallT * 1.5]} />
        <meshStandardMaterial color="#1c1c1c" metalness={0.8} roughness={0.2} />
      </mesh>
      {/* 뒷면 세로 바 */}
      <mesh position={[sizeX / 2 - wallT * 0.3, hY, -sizeZ * 0.47]}>
        <boxGeometry args={[wallT * 1.5, sizeY * 0.94, wallT * 1.5]} />
        <meshStandardMaterial color="#1c1c1c" metalness={0.8} roughness={0.2} />
      </mesh>
    </group>
  );
}

// ─────────────────────────────────────────────────────
//  메인보드
// ─────────────────────────────────────────────────────
function Motherboard({ pc }: { pc: typeof SIZE.pc }) {
  const { mbOffX, mbH, mbD, mbBaseY, wallT } = pc;
  return (
    <group position={[mbOffX, mbBaseY, 0]}>
      {/* PCB 기판 */}
      <mesh position={[0, mbH / 2, 0]}>
        <boxGeometry args={[wallT * 0.7, mbH, mbD]} />
        <meshStandardMaterial color="#1a2a1a" roughness={0.9} metalness={0.1} />
      </mesh>
      {/* 회로 트레이스 패턴 */}
      {([0.15, 0.30, 0.48, 0.62, 0.75] as number[]).map((yR, i) => (
        <mesh key={i} position={[wallT * 0.38, mbH * yR, (i % 2 === 0 ? 0.12 : -0.08)]}>
          <boxGeometry args={[0.001, 0.002, 0.06 + i * 0.025]} />
          <meshStandardMaterial color="#2a4a2a" emissive="#004400" emissiveIntensity={0.6} />
        </mesh>
      ))}
      {/* 슬롯 구분선 (PCIe / RAM 영역 표시) */}
      {([0.30, 0.55] as number[]).map((yR, i) => (
        <mesh key={i} position={[wallT * 0.38, mbH * yR, 0]}>
          <boxGeometry args={[0.001, 0.003, mbD * 0.85]} />
          <meshStandardMaterial color="#223322" emissive="#002200" emissiveIntensity={0.3} />
        </mesh>
      ))}
      {/* I/O 실드 (뒷벽) */}
      <mesh position={[wallT * 0.1, mbH * 0.22, -mbD / 2 + 0.008]}>
        <boxGeometry args={[wallT * 0.5, mbH * 0.30, 0.008]} />
        <meshStandardMaterial color="#1a1a1a" metalness={0.85} roughness={0.2} />
      </mesh>
    </group>
  );
}

// ─────────────────────────────────────────────────────
//  CPU + 수냉 쿨러
// ─────────────────────────────────────────────────────
function CpuAndCooler({ pc }: { pc: typeof SIZE.pc }) {
  const { mbOffX, mbBaseY, cpuOffY, cpuOffZ, cpuSize,
          wcHeadW, wcHeadH, wcHeadD,
          radOffY, radW, radH, radFinCount,
          tubeR, tubeZOff, sizeX } = pc;

  return (
    <group>
      {/* CPU IHS */}
      <mesh position={[mbOffX + 0.008, cpuOffY, cpuOffZ]}>
        <boxGeometry args={[0.008, cpuSize, cpuSize]} />
        <meshStandardMaterial color="#bbbbbb" metalness={0.95} roughness={0.05} />
      </mesh>
      {/* 수냉 헤드 (CPU 바로 위) */}
      <group position={[mbOffX + 0.025, cpuOffY, cpuOffZ]}>
        <mesh>
          <boxGeometry args={[wcHeadW, wcHeadH, wcHeadD]} />
          <meshStandardMaterial color="#0f0f0f" metalness={0.85} roughness={0.15} />
        </mesh>
        {/* LCD 면 */}
        <mesh position={[wcHeadW / 2 + 0.001, 0, 0]} rotation={[0, Math.PI / 2, 0]}>
          <planeGeometry args={[wcHeadD * 0.78, wcHeadH * 0.72]} />
          <meshStandardMaterial color="#000010" emissive="#001a2a" emissiveIntensity={2.5} />
        </mesh>
        <group position={[wcHeadW / 2 + 0.003, 0, 0]} rotation={[0, Math.PI / 2, 0]}>
          <Text position={[0,  0.016, 0]} fontSize={0.009}  color="#00ddff">SYSTEM</Text>
          <Text position={[0,  0.001, 0]} fontSize={0.016}  color="#ffffff">28°C</Text>
          <Text position={[0, -0.014, 0]} fontSize={0.007}  color="#ff44ff">LIQUID</Text>
        </group>
        {/* 헤드 RGB 테두리 */}
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[wcHeadW * 1.06, wcHeadH * 1.06, wcHeadD * 1.06]} />
          <meshStandardMaterial color="#00ffff" emissive="#00ffff" emissiveIntensity={0.4} transparent opacity={0.15} />
        </mesh>
      </group>

      {/* 라디에이터 — 케이스 상단 내부 */}
      <group position={[0, radOffY, 0]}>
        {/* 라디에이터 본체 */}
        <mesh>
          <boxGeometry args={[sizeX * 0.72, radH, radW]} />
          <meshStandardMaterial color="#181818" metalness={0.65} roughness={0.4} />
        </mesh>
        {/* 방열 핀 */}
        {Array.from({ length: radFinCount }, (_, i) => (
          <mesh key={i} position={[0, 0, -radW / 2 + (i + 0.5) * (radW / radFinCount)]}>
            <boxGeometry args={[sizeX * 0.68, radH * 2.8, 0.0025]} />
            <meshStandardMaterial color="#252525" metalness={0.7} />
          </mesh>
        ))}
        {/* 상단 팬 2개 */}
        {pc.topFanZs.map((z, i) => (
          <group key={i} position={[0, radH + 0.012, z]} rotation={[Math.PI / 2, 0, 0]}>
            <mesh>
              <boxGeometry args={[pc.topFanSize, pc.topFanSize, 0.016]} />
              <meshStandardMaterial color="#0a0a0a" />
            </mesh>
            <FanBlade r={pc.topFanSize * 0.43} speed={14 + i * 2} color="#181828" glowColor="#00ddff" />
          </group>
        ))}
      </group>

      {/* 수냉 튜브 — 헤드에서 라디에이터로 */}
      {([tubeZOff, -tubeZOff] as number[]).map((z, i) => (
        <mesh
          key={i}
          position={[
            mbOffX + 0.025,
            (cpuOffY + radOffY) / 2,
            cpuOffZ + z,
          ]}
          rotation={[0.15, 0, 0.05]}
        >
          <cylinderGeometry args={[tubeR, tubeR, radOffY - cpuOffY + 0.05, 8]} />
          <meshStandardMaterial color="#2255aa" transparent opacity={0.75} roughness={0.25} />
        </mesh>
      ))}
    </group>
  );
}

// ─────────────────────────────────────────────────────
//  GPU
// ─────────────────────────────────────────────────────
function Gpu({ pc }: { pc: typeof SIZE.pc }) {
  const { mbOffX, gpuOffY, gpuThick, gpuH, gpuD, gpuShiftX, gpuFanR, gpuFanZs } = pc;
  // GPU는 메인보드에서 +X 방향으로 돌출된 카드
  const gpuX = mbOffX + gpuShiftX;

  return (
    <group position={[gpuX, gpuOffY, 0]}>
      {/* PCB — 메인보드에 수직으로 꽂힌 얇은 판 */}
      <mesh position={[0, gpuH * 0.28, 0]}>
        <boxGeometry args={[gpuThick, gpuH * 0.55, gpuD]} />
        <meshStandardMaterial color="#0f1a0f" roughness={0.9} metalness={0.1} />
      </mesh>
      {/* 쿨러 덮개 — PCB 위에 얹힘 */}
      <mesh position={[gpuThick * 3, gpuH * 0.62, 0]}>
        <boxGeometry args={[gpuThick * 7, gpuH * 0.78, gpuD * 0.92]} />
        <meshStandardMaterial color="#101010" metalness={0.75} roughness={0.25} />
      </mesh>
      {/* 쿨러 상단 커버 (로고판) */}
      <mesh position={[gpuThick * 3, gpuH * 1.01, 0]}>
        <boxGeometry args={[gpuThick * 6.5, gpuThick * 2, gpuD * 0.88]} />
        <meshStandardMaterial color="#181818" metalness={0.8} roughness={0.2} />
      </mesh>
      {/* GPU 팬 3개 */}
      {gpuFanZs.map((z, i) => (
        <group key={i} position={[gpuThick * 3, gpuH * 0.62, z]} rotation={[0, Math.PI / 2, 0]}>
          <mesh>
            <cylinderGeometry args={[gpuFanR + 0.004, gpuFanR + 0.004, 0.010, 20]} />
            <meshStandardMaterial color="#0a0a0a" />
          </mesh>
          <FanBlade r={gpuFanR} speed={8 + i * 1.2} color="#181818" glowColor="#ee00ee" />
        </group>
      ))}
      {/* RGB 스트립 — 쿨러 앞면 */}
      <mesh position={[gpuThick * 3, gpuH * 1.0, gpuD * 0.44]}>
        <boxGeometry args={[gpuThick * 5.5, 0.005, 0.006]} />
        <meshStandardMaterial color="#ff00ff" emissive="#ff00ff" emissiveIntensity={3.5} />
      </mesh>
      {/* 백플레이트 */}
      <mesh position={[-gpuThick * 0.5, gpuH * 0.28, 0]}>
        <boxGeometry args={[gpuThick * 0.8, gpuH * 0.52, gpuD * 0.96]} />
        <meshStandardMaterial color="#1a1a1a" metalness={0.7} roughness={0.3} />
      </mesh>
      {/* I/O 브래킷 (케이스 뒷벽 슬롯) */}
      <mesh position={[gpuThick * 3, gpuH * 0.18, -gpuD * 0.47]}>
        <boxGeometry args={[gpuThick * 6, gpuH * 0.35, gpuThick * 2]} />
        <meshStandardMaterial color="#222" metalness={0.8} />
      </mesh>
    </group>
  );
}

// ─────────────────────────────────────────────────────
//  RAM 4개
// ─────────────────────────────────────────────────────
function Ram({ pc }: { pc: typeof SIZE.pc }) {
  const { mbOffX, mbBaseY, ramOffY, ramOffZ, ramW, ramH, ramGap } = pc;
  return (
    // mbOffX + 약간 앞으로(+X), mbBaseY + ramOffY 절대 Y
    <group position={[mbOffX + 0.012, mbBaseY + ramOffY - mbBaseY, ramOffZ]}>
      {[0, 1, 2, 3].map((i) => (
        <group key={i} position={[0, 0, i * ramGap]}>
          {/* PCB */}
          <mesh position={[0, ramH / 2, 0]}>
            <boxGeometry args={[ramW, ramH, 0.005]} />
            <meshStandardMaterial color="#120a18" roughness={0.9} />
          </mesh>
          {/* 히트스프레더 */}
          <mesh position={[ramW * 0.3, ramH / 2, 0]}>
            <boxGeometry args={[ramW * 2.2, ramH * 0.95, 0.007]} />
            <meshStandardMaterial
              color={i % 2 === 0 ? "#0f0f14" : "#14140f"}
              metalness={0.72} roughness={0.28}
            />
          </mesh>
          {/* RGB 상단 라인 */}
          <mesh position={[ramW * 0.3, ramH * 0.95, 0]}>
            <boxGeometry args={[ramW * 2.0, 0.005, 0.008]} />
            <meshStandardMaterial
              color="#ff00ff" emissive="#ff00ff"
              emissiveIntensity={2.2 + i * 0.4}
            />
          </mesh>
        </group>
      ))}
    </group>
  );
}

// ─────────────────────────────────────────────────────
//  NVMe SSD
// ─────────────────────────────────────────────────────
function NvmeSsd({ pc }: { pc: typeof SIZE.pc }) {
  const { mbOffX, mbBaseY, ssdOffY, ssdOffZ, ssdW, ssdH, ssdD } = pc;
  // 메인보드 표면에 평평하게 누워있는 형태
  return (
    <group position={[mbOffX + 0.010, ssdOffY, ssdOffZ]} rotation={[0, 0, 0]}>
      {/* NVMe 기판 — X방향으로 얇게 누워있음 */}
      <mesh>
        <boxGeometry args={[ssdW, ssdH, ssdD]} />
        <meshStandardMaterial color="#0a0a16" roughness={0.8} metalness={0.25} />
      </mesh>
      {/* 컨트롤러 칩 */}
      <mesh position={[ssdW * 0.7, 0, ssdD * 0.15]}>
        <boxGeometry args={[0.003, ssdH * 0.7, 0.014]} />
        <meshStandardMaterial color="#111" metalness={0.9} roughness={0.1} />
      </mesh>
      {/* 낸드 칩 */}
      <mesh position={[ssdW * 0.7, 0, -ssdD * 0.15]}>
        <boxGeometry args={[0.003, ssdH * 0.7, 0.020]} />
        <meshStandardMaterial color="#0f0f0f" metalness={0.85} roughness={0.15} />
      </mesh>
      {/* 액티비티 LED */}
      <mesh position={[ssdW * 0.7, ssdH * 0.35, ssdD * 0.44]}>
        <boxGeometry args={[0.0025, 0.0025, 0.0025]} />
        <meshStandardMaterial color="#00ffff" emissive="#00ffff" emissiveIntensity={4} />
      </mesh>
    </group>
  );
}

// ─────────────────────────────────────────────────────
//  PSU (파워 서플라이) — 하단
// ─────────────────────────────────────────────────────
function Psu({ pc }: { pc: typeof SIZE.pc }) {
  const { sizeX, sizeZ, psuH, psuD, wallT } = pc;
  return (
    <group position={[0, psuH / 2 + wallT, 0]}>
      <mesh castShadow>
        <boxGeometry args={[sizeX * 0.82, psuH, psuD]} />
        <meshStandardMaterial color="#0a0a0a" metalness={0.7} roughness={0.3} />
      </mesh>
      {/* 팬 그릴 */}
      <mesh position={[0, -psuH / 2 + 0.001, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[psuH * 0.35, psuH * 0.35, 0.003, 16]} />
        <meshStandardMaterial color="#1a1a1a" />
      </mesh>
      {/* 모듈형 커넥터 패널 */}
      <mesh position={[0, 0, -psuD / 2 + 0.005]}>
        <boxGeometry args={[sizeX * 0.7, psuH * 0.7, 0.008]} />
        <meshStandardMaterial color="#1a1a1a" metalness={0.6} />
      </mesh>
      {/* 브랜드 스티커 */}
      <mesh position={[sizeX * 0.1, 0, psuD / 2 - 0.002]}>
        <boxGeometry args={[sizeX * 0.55, psuH * 0.45, 0.002]} />
        <meshStandardMaterial color="#cc0000" emissive="#440000" emissiveIntensity={0.5} />
      </mesh>
    </group>
  );
}

// ─────────────────────────────────────────────────────
//  앞면 흡기 팬 3개
// ─────────────────────────────────────────────────────
function FrontFans({ pc }: { pc: typeof SIZE.pc }) {
  const { sizeZ, fanSize, fanT, fanYs } = pc;
  return (
    <group position={[0, 0, sizeZ / 2 - fanT * 0.5 - 0.003]}>
      {(fanYs as readonly number[]).map((y, i) => (
        <group key={i} position={[0, y, 0]}>
          {/* 팬 프레임 */}
          <mesh>
            <boxGeometry args={[fanSize + 0.008, fanSize + 0.008, fanT]} />
            <meshStandardMaterial color="#090909" metalness={0.3} roughness={0.7} />
          </mesh>
          {/* 팬 블레이드 */}
          <group rotation={[Math.PI / 2, 0, 0]}>
            <FanBlade
              r={fanSize * 0.43}
              speed={9 + i * 1.8}
              color="#181828"
              glowColor="#00ddff"
            />
          </group>
          {/* 코너 나사 4개 */}
          {([[-1,-1],[-1,1],[1,-1],[1,1]] as [number,number][]).map(([sx, sy], j) => (
            <mesh key={j} position={[sx * fanSize * 0.43, sy * fanSize * 0.43, fanT * 0.5 + 0.001]}>
              <cylinderGeometry args={[0.0035, 0.0035, 0.003, 8]} />
              <meshStandardMaterial color="#2a2a2a" metalness={0.85} />
            </mesh>
          ))}
        </group>
      ))}
    </group>
  );
}

// ─────────────────────────────────────────────────────
//  케이블 다발
// ─────────────────────────────────────────────────────
function Cables({ pc }: { pc: typeof SIZE.pc }) {
  const { sizeX, mbOffX, cableOffY, psuH } = pc;
  const baseY = psuH + cableOffY;
  return (
    <group position={[mbOffX + sizeX * 0.25, baseY, 0]}>
      {([0.06, 0.12, 0.18, -0.04, -0.10] as number[]).map((z, i) => (
        <mesh key={i} position={[0, 0.02, z]} rotation={[0.15 + i * 0.08, 0, 0.05]}>
          <cylinderGeometry args={[0.0038, 0.0038, 0.14, 6]} />
          <meshStandardMaterial
            color={["#2a2a2a", "#151520", "#201515", "#152015", "#1e1e1e"][i]}
          />
        </mesh>
      ))}
    </group>
  );
}

// ─────────────────────────────────────────────────────
//  RGB 스트립 (케이스 내부)
// ─────────────────────────────────────────────────────
function RgbStrip({ pc }: { pc: typeof SIZE.pc }) {
  const { sizeY, sizeZ, mbOffX, psuH, wallT } = pc;
  const stripRef = useRef<THREE.Mesh>(null!);
  useFrame((state) => {
    if (!stripRef.current) return;
    const mat = stripRef.current.material as THREE.MeshStandardMaterial;
    const t = state.clock.elapsedTime;
    const r = Math.sin(t * 0.7) * 0.5 + 0.5;
    const b = Math.cos(t * 0.7) * 0.5 + 0.5;
    mat.emissive.setRGB(r, 0, b);
    mat.emissiveIntensity = 1.8 + Math.sin(t * 1.2) * 0.6;
  });
  return (
    <group>
      {/* PSU 위 바닥면 RGB 바 */}
      <mesh ref={stripRef} position={[mbOffX + 0.008, psuH + wallT + 0.005, 0]}>
        <boxGeometry args={[0.004, 0.006, sizeZ * 0.80]} />
        <meshStandardMaterial color="#ff00ff" emissive="#ff00ff" emissiveIntensity={2} />
      </mesh>
      {/* 뒷벽 세로 RGB 라인 */}
      <mesh position={[mbOffX + 0.006, sizeY * 0.48, -sizeZ * 0.43]}>
        <boxGeometry args={[0.004, sizeY * 0.70, 0.006]} />
        <meshStandardMaterial color="#00ffff" emissive="#00ffff" emissiveIntensity={1.6} />
      </mesh>
    </group>
  );
}

// ─────────────────────────────────────────────────────
//  PC 타워 조립
// ─────────────────────────────────────────────────────
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
    <group position={[pc.offsetX, deskTopY, pc.offsetZ]} rotation={[0, Math.PI, 0]}>

      {/* 케이스 외벽 */}
      <Case pc={pc} />

      {/* 메인 RGB 조명 — 케이스 중앙 */}
      <pointLight
        ref={pcLightRef}
        position={[pc.mbOffX + 0.05, halfY * 0.55, 0]}
        color="#bb00ff"
        intensity={1.8}
        distance={1.8}
      />
      {/* 보조 시안 조명 — 하단 */}
      <pointLight
        position={[pc.mbOffX + 0.04, halfY * 0.22, 0]}
        color="#00eeff"
        intensity={0.7}
        distance={1.2}
      />

      {/* 내부 부품 */}
      <Motherboard pc={pc} />
      <CpuAndCooler pc={pc} />
      <Gpu pc={pc} />
      <Ram pc={pc} />
      <NvmeSsd pc={pc} />
      <Psu pc={pc} />
      <FrontFans pc={pc} />
      <Cables pc={pc} />
      <RgbStrip pc={pc} />

    </group>
  );
}

// ─────────────────────────────────────────────────────
//  모니터
// ─────────────────────────────────────────────────────
function Monitor({ deskTopY }: { deskTopY: number }) {
  const m = SIZE.monitor;
  const screenCY = deskTopY + m.standH + m.riseY + m.frameH / 2;
  return (
    <group position={[m.offsetX, 0, m.offsetZ]}>
      {/* 받침대 */}
      <mesh position={[0, deskTopY + 0.007, 0]} receiveShadow>
        <boxGeometry args={[m.frameX * 0.3, 0.014, m.baseZ]} />
        <meshStandardMaterial color="#222" />
      </mesh>
      {/* 기둥 */}
      <mesh position={[0, deskTopY + m.standH / 2, 0]}>
        <boxGeometry args={[m.standW, m.standH, m.standW]} />
        <meshStandardMaterial color="#1a1a1a" />
      </mesh>
      {/* 프레임 */}
      <mesh position={[0, screenCY, 0]} castShadow>
        <boxGeometry args={[m.frameX + 0.05, m.frameH + 0.05, m.frameZ]} />
        <meshStandardMaterial color="#111" />
      </mesh>
      {/* 화면 */}
      <mesh position={[0, screenCY, m.frameZ * 0.5 + 0.003]}>
        <boxGeometry args={[m.frameX, m.frameH, 0.007]} />
        <meshStandardMaterial emissive={COLOR.screenBlue} emissiveIntensity={1.5} />
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
      {[0, 1, 2, 3, 4].map((i) => {
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
      {([ [-legX, d.legH/2, -legZ], [-legX, d.legH/2, legZ],
           [ legX, d.legH/2, -legZ], [ legX, d.legH/2, legZ] ] as [number,number,number][])
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
