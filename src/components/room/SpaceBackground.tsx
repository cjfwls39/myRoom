"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useDayNight } from "@/components/canvas/DayNightContext";

// ── 별 — InstancedMesh로 구 형태 ─────────────
function Stars() {
  const ref   = useRef<THREE.InstancedMesh>(null!);
  const COUNT = 3000;

  // 각 별의 위치/크기 행렬 계산
  const dummy = useMemo(() => new THREE.Object3D(), []);

  useMemo(() => {
    // ref가 아직 없으니 effect 대신 여기선 데이터만 준비
  }, []);

  useFrame((_, delta) => {
    if (!ref.current) return;
    ref.current.rotation.y += delta * 0.003;
  });

  // 행렬 배열 미리 계산
  const matrices = useMemo(() => {
    const mats = [];
    const d = new THREE.Object3D();
    for (let i = 0; i < COUNT; i++) {
      const r     = 25 + Math.random() * 35;
      const theta = Math.random() * Math.PI * 2;
      const phi   = Math.acos(2 * Math.random() - 1);
      d.position.set(
        r * Math.sin(phi) * Math.cos(theta),
        r * Math.sin(phi) * Math.sin(theta),
        r * Math.cos(phi)
      );
      const s = 0.06 + Math.random() * 0.18;
      d.scale.setScalar(s);
      d.updateMatrix();
      mats.push(d.matrix.clone());
    }
    return mats;
  }, []);

  // instancedMesh에 행렬 세팅
  const setRef = (mesh: THREE.InstancedMesh | null) => {
    if (!mesh) return;
    (ref as any).current = mesh;
    matrices.forEach((mat, i) => mesh.setMatrixAt(i, mat));
    mesh.instanceMatrix.needsUpdate = true;
  };

  return (
    <instancedMesh ref={setRef} args={[undefined, undefined, COUNT]}>
      <sphereGeometry args={[1, 5, 5]} />
      <meshBasicMaterial color="#FFFFFF" depthWrite={false} />
    </instancedMesh>
  );
}

// ── 태양 ─────────────────────────────────────
// 낮: 밝고 선명 / 밤: 서서히 사라짐
function Sun() {
  const { mode } = useDayNight();
  const lightRef = useRef<THREE.PointLight>(null!);

  const curIntensity  = useRef(0);

  useFrame((_, delta) => {
    const isDay = mode === "day";
    const t = 1 - Math.pow(0.001, delta * 2);

    const targetIntensity   = isDay ? 2.5 : 0;

    curIntensity.current   += (targetIntensity   - curIntensity.current)   * t;

    if (lightRef.current)
      lightRef.current.intensity = curIntensity.current;
  });

  // 태양 위치 — 창문 방향과 맞게 오른쪽 앞 위
  const SUN_POS: [number, number, number] = [60, 45, 55];

  return (
    <group position={SUN_POS}>
      {/* 태양 광원 */}
      <pointLight
        ref={lightRef}
        intensity={0}
        distance={200}
        color="#FFF5D0"
        decay={0.5}
      />


    </group>
  );
}

// ── 스카이박스 — 항상 검정 ────────────────────
function SpaceSkybox() {
  return (
    <mesh>
      <sphereGeometry args={[120, 32, 32]} />
      <meshBasicMaterial
        color="#000000"
        side={THREE.BackSide}
        depthWrite={false}
      />
    </mesh>
  );
}

export default function SpaceBackground() {
  return (
    <group>
      <SpaceSkybox />
      <Stars />
      <Sun />
    </group>
  );
}