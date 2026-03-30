"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

// ── 굴뚝 연기 ──────────────────────────────────────────────
function ChimneySmoke({ offset }: { offset: [number, number, number] }) {
  const COUNT   = 10;
  const meshRef = useRef<THREE.InstancedMesh>(null!);
  const dummy   = useMemo(() => new THREE.Object3D(), []);

  const data = useMemo(() =>
    Array.from({ length: COUNT }, (_, i) => ({
      phase: (i / COUNT) * Math.PI * 2,
      xd:   (Math.random() - 0.5) * 0.38,
      zd:   (Math.random() - 0.5) * 0.38,
    })), []);

  useFrame(({ clock }) => {
    if (!meshRef.current) return;
    const t = clock.elapsedTime * 0.20;
    data.forEach((p, i) => {
      const prog = ((p.phase / (Math.PI * 2) + t) % 1.0);
      dummy.position.set(
        offset[0] + p.xd * prog,
        offset[1] + prog * 1.6,
        offset[2] + p.zd * prog,
      );
      dummy.scale.setScalar(0.04 + prog * 0.14);
      dummy.updateMatrix();
      meshRef.current.setMatrixAt(i, dummy.matrix);
    });
    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, COUNT]}>
      <sphereGeometry args={[1, 4, 3]} />
      <meshStandardMaterial color="#C0C0C0" transparent opacity={0.35} depthWrite={false} />
    </instancedMesh>
  );
}

// ── 집 ────────────────────────────────────────────────────
export interface HouseProps {
  position:  [number, number, number];
  rotationY: number;
  wallColor: string;
  roofColor: string;
  scale?:    number;
}

export default function House({
  position, rotationY, wallColor, roofColor, scale = 1,
}: HouseProps) {
  const W  = 1.6  * scale; // 너비
  const D  = 1.4  * scale; // 깊이
  const BH = 1.0  * scale; // 몸체 높이
  const RH = 0.65 * scale; // 지붕 높이
  const CS = 0.13 * scale; // 굴뚝 단면

  // 박공 지붕 — 삼각형을 Z 방향으로 압출한 프리즘
  const roofGeo = useMemo(() => {
    const shape = new THREE.Shape();
    shape.moveTo(-W / 2, 0);
    shape.lineTo( W / 2, 0);
    shape.lineTo(0, RH);
    shape.closePath();
    const geo = new THREE.ExtrudeGeometry(shape, { depth: D, bevelEnabled: false });
    geo.computeVertexNormals();
    return geo;
  }, [W, D, RH]);

  // 지붕 눈 — 살짝 큰 흰 프리즘 (지붕 뒤에 렌더링)
  const snowRoofGeo = useMemo(() => {
    const ov = 0.07 * scale;
    const shape = new THREE.Shape();
    shape.moveTo(-W / 2 - ov, 0);
    shape.lineTo( W / 2 + ov, 0);
    shape.lineTo(0, RH + ov * 0.5);
    shape.closePath();
    const geo = new THREE.ExtrudeGeometry(shape, { depth: D + ov * 2, bevelEnabled: false });
    geo.computeVertexNormals();
    return geo;
  }, [W, D, RH, scale]);

  // 굴뚝 꼭대기 (local 좌표) — 연기 생성 기준점
  const chX        = W * 0.22;
  const chTopY     = BH + RH * 0.40 + CS * 1.55;
  const smokeOff: [number, number, number] = [chX, chTopY, 0];
  const ov = 0.07 * scale;

  return (
    <group position={position} rotation={[0, rotationY, 0]}>

      {/* 몸체 */}
      <mesh position={[0, BH / 2, 0]} castShadow receiveShadow>
        <boxGeometry args={[W, BH, D]} />
        <meshStandardMaterial color={wallColor} roughness={0.88} />
      </mesh>

      {/* 지붕 눈 (먼저 그려서 지붕 색으로 덮임 → 가장자리만 흰 테두리로 보임) */}
      <mesh position={[0, BH - 0.01 * scale, -(D / 2 + ov)]} geometry={snowRoofGeo}>
        <meshStandardMaterial color="#EDF3FF" roughness={1} side={THREE.DoubleSide} />
      </mesh>

      {/* 박공 지붕 */}
      <mesh position={[0, BH, -D / 2]} geometry={roofGeo} castShadow>
        <meshStandardMaterial color={roofColor} roughness={0.85} side={THREE.DoubleSide} />
      </mesh>

      {/* 굴뚝 몸체 */}
      <mesh position={[chX, BH + RH * 0.60, 0]} castShadow>
        <boxGeometry args={[CS, CS * 2.8, CS]} />
        <meshStandardMaterial color="#4A4438" roughness={1} />
      </mesh>
      {/* 굴뚝 캡 */}
      <mesh position={[chX, BH + RH * 0.59 + CS * 1.3, 0]}>
        <boxGeometry args={[CS * 1.5, CS * 0.15, CS * 1.5]} />
        <meshStandardMaterial color="#2E2C28" roughness={1} />
      </mesh>

      {/* 앞면 창문 ×2 (따뜻한 발광) */}
      <mesh position={[-W * 0.24, BH * 0.62, D / 2 + 0.002]}>
        <planeGeometry args={[0.21 * scale, 0.19 * scale]} />
        <meshStandardMaterial color="#FFE088" emissive="#FFAA22" emissiveIntensity={2.5} />
      </mesh>
      <mesh position={[ W * 0.24, BH * 0.62, D / 2 + 0.002]}>
        <planeGeometry args={[0.21 * scale, 0.19 * scale]} />
        <meshStandardMaterial color="#FFE088" emissive="#FFAA22" emissiveIntensity={2.5} />
      </mesh>

      {/* 문 */}
      <mesh position={[0, BH * 0.24, D / 2 + 0.002]}>
        <planeGeometry args={[0.24 * scale, 0.44 * scale]} />
        <meshStandardMaterial color="#3E2410" roughness={0.9} />
      </mesh>

      {/* 실내 따뜻한 포인트 라이트 */}
      <pointLight
        position={[0, BH * 0.5, D * 0.35]}
        color="#FFBB44"
        intensity={1.2 * scale}
        distance={5 * scale}
        decay={2}
      />

      {/* 굴뚝 연기 */}
      <ChimneySmoke offset={smokeOff} />
    </group>
  );
}
