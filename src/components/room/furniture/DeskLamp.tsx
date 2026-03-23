"use client";

import { useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { AppearGroup } from "../AnimatedWrapper";
import { DELAY, WALL_HALF, COLOR } from "../constants";
import { useDayNight } from "../../canvas/DayNightContext";
import { SunParticles, MoonParticles } from "../particles/LampParticles";

export default function DeskLamp() {
  const { mode, toggle } = useDayNight();
  const isNight = mode === "night";

  const [pressed, setPressed]   = useState(false);
  const sphereRef  = useRef<THREE.Mesh>(null!);
  const glowRef    = useRef<THREE.PointLight>(null!);
  const pressY     = useRef(0);
  const curEmissive  = useRef(new THREE.Color("#FF7700"));
  const curColor     = useRef(new THREE.Color("#FFF8D0"));
  const tEmissiveDay = useRef(new THREE.Color("#FF7700"));
  const tEmissiveNight = useRef(new THREE.Color("#4060A8"));
  const tColorDay    = useRef(new THREE.Color("#FFF8D0"));
  const tColorNight  = useRef(new THREE.Color("#C0D0F0"));
  const tLightDay    = useRef(new THREE.Color("#FFD060"));
  const tLightNight  = useRef(new THREE.Color("#88AAFF"));
  const hovered      = useRef(false);
  const hoverY       = useRef(0);
  const groupRef     = useRef<THREE.Group>(null!);

  useFrame((_, delta) => {
    const tp = pressed ? -0.05 : 0;
    pressY.current += (tp - pressY.current) * (1 - Math.pow(0.001, delta * 10));
    if (sphereRef.current) {
      sphereRef.current.position.y = 0.30 + pressY.current;
    }

    if (sphereRef.current) {
      const mat = sphereRef.current.material as THREE.MeshStandardMaterial;
      const tE  = isNight ? tEmissiveNight.current : tEmissiveDay.current;
      const tC  = isNight ? tColorNight.current    : tColorDay.current;
      curEmissive.current.lerp(tE, 0.05);
      curColor.current.lerp(tC, 0.05);
      mat.emissive.copy(curEmissive.current);
      mat.color.copy(curColor.current);
      mat.emissiveIntensity += ((isNight ? 0.55 : 0.12) - mat.emissiveIntensity) * 0.05;
    }

    if (glowRef.current) {
      const tI = isNight ? 2.0 + Math.sin(Date.now() * 0.0015) * 0.1 : 0.15;
      const tC = isNight ? tLightNight.current : tLightDay.current;
      glowRef.current.intensity += (tI - glowRef.current.intensity) * 0.05;
      glowRef.current.color.lerp(tC, 0.05);
    }
    // hover lift
    if (groupRef.current) {
      const targetY = hovered.current ? 0.06 : 0;
      hoverY.current += (targetY - hoverY.current) * 0.12;
      groupRef.current.position.y = hoverY.current;
    }
  });

  // 드래그 vs 클릭 구분
  // mousedown 위치와 mouseup 위치 차이가 4px 이상이면 드래그로 판단
  const pointerDown = useRef<{ x: number; y: number } | null>(null);

  const handlePointerDown = (e: any) => {
    pointerDown.current = { x: e.clientX, y: e.clientY };
  };

  const handleClick = (e: any) => {
    if (!pointerDown.current) return;
    const dx = e.clientX - pointerDown.current.x;
    const dy = e.clientY - pointerDown.current.y;
    pointerDown.current = null;
    // 4px 이상 움직였으면 드래그 — 클릭 무시
    if (Math.sqrt(dx * dx + dy * dy) > 4) return;
    if (pressed) return;
    setPressed(true);
    setTimeout(() => toggle(),          180);
    setTimeout(() => setPressed(false), 420);
  };

  return (
    <AppearGroup delay={DELAY.drawer + 0.3} position={[-WALL_HALF + 0.8, 1.6, 1.5]}>
      <group ref={groupRef}>
        {/* 받침대 왼쪽 다리 */}
        <mesh position={[0, 0.10, -0.01]} rotation={[Math.PI * 0.22, 0, 0]}>
          <boxGeometry args={[0.06, 0.06, 0.26]} />
          <meshStandardMaterial color={COLOR.woodMid} roughness={0.85} />
        </mesh>
        {/* 받침대 오른쪽 다리 */}
        <mesh position={[0, 0.10, 0.01]} rotation={[-Math.PI * 0.22, 0, 0]}>
          <boxGeometry args={[0.06, 0.06, 0.26]} />
          <meshStandardMaterial color={COLOR.woodMid} roughness={0.85} />
        </mesh>
        {/* 바닥 가로대 */}
        <mesh position={[0, 0.022, 0]} receiveShadow>
          <boxGeometry args={[0.06, 0.022, 0.32]} />
          <meshStandardMaterial color={COLOR.woodLight} roughness={0.85} />
        </mesh>
        {/* 상단 가로대 */}
        <mesh position={[0, 0.21, 0]}>
          <boxGeometry args={[0.06, 0.022, 0.24]} />
          <meshStandardMaterial color={COLOR.woodLight} roughness={0.85} />
        </mesh>

        {/* 구 — 낮: 형태가 보이는 은은한 빛 / 밤: 충분히 빛남 */}
        <mesh
          ref={sphereRef}
          position={[0, 0.30, 0]}
          castShadow
          onPointerOver={(e) => { e.stopPropagation(); hovered.current = true; document.body.style.cursor = "pointer"; }}
          onPointerOut={(e)  => { e.stopPropagation(); hovered.current = false; document.body.style.cursor = "default"; }}
          onPointerDown={handlePointerDown}
          onClick={handleClick}
        >
          <sphereGeometry args={[0.22, 48, 48]} />
          <meshStandardMaterial
            color="#FFF8D0"
            emissive="#FF7700"
            emissiveIntensity={0.12}
            roughness={0.5}
          />
        </mesh>

        {/* 파티클 — 구와 같은 위치 기준 */}
        <group position={[0, 0.30, 0]}>
          <SunParticles  visible={!isNight} />
          <MoonParticles visible={isNight}  />
        </group>

        {/* 발광 */}
        <pointLight
          ref={glowRef}
          position={[0, 0.52, 0]}
          color="#FFD060"
          intensity={1.6}
          distance={6}
          decay={2}
        />
      </group>
    </AppearGroup>
  );
}