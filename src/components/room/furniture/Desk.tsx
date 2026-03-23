"use client";

import { useRef } from "react";
import { Text } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import AnimatedWrapper from "../AnimatedWrapper";
import { MAT } from "../materials";
import { COLOR, DELAY, WALL_HALF } from "../constants";

/** 컴퓨터 책상 — 상판, 듀얼 모니터, PC 본체(RGB), 의자 */
export default function Desk() {
  const pcLightRef = useRef<THREE.PointLight>(null!);

  // PC RGB 조명 깜빡임
  useFrame((state) => {
    if (pcLightRef.current) {
      pcLightRef.current.intensity =
        0.8 + Math.sin(state.clock.elapsedTime * 2) * 0.4;
    }
  });

  return (
    <AnimatedWrapper
      delay={DELAY.desk}
      position={[-WALL_HALF + 1.2, 0, -1.6]}
      liftHeight={0.06}
      hitbox={[2.2, 2.0, 5.2]}
      hitboxPos={[0, 1.0, 0]}
    >
      <group>
        {/* 상판 */}
        <mesh position={[0, 1.4, 0]} castShadow receiveShadow>
          <boxGeometry args={[2, 0.2, 4.8]} />
          <meshStandardMaterial color={COLOR.woodLight} {...MAT.woodLight} />
        </mesh>

        {/* 다리 4개 */}
        {(
          [
            [-0.8, 0.7, -2.2],
            [-0.8, 0.7,  2.2],
            [ 0.8, 0.7, -2.2],
            [ 0.8, 0.7,  2.2],
          ] as [number, number, number][]
        ).map((p, i) => (
          <mesh key={i} position={p} castShadow>
            <boxGeometry args={[0.15, 1.4, 0.15]} />
            <meshStandardMaterial color={COLOR.woodChair} {...MAT.woodChair} />
          </mesh>
        ))}

        {/* 모니터 1 (왼쪽) */}
        <group position={[0.2, 1.5, -1.1]} rotation={[0, -0.4, 0]}>
          <mesh position={[0, 0.8, 0]} castShadow>
            <boxGeometry args={[0.1, 1.2, 2.0]} />
            <meshStandardMaterial color={COLOR.darkBody} {...MAT.darkBody} />
          </mesh>
          <mesh position={[0.05, 0.8, 0]}>
            <boxGeometry args={[0.02, 1.1, 1.9]} />
            <meshStandardMaterial
              color="#000000"
              emissive={COLOR.screenBlue}
              emissiveIntensity={0.5}
            />
          </mesh>
          <Text
            position={[0.062, 0.8, 0]}
            rotation={[0, Math.PI / 2, 0]}
            fontSize={0.12}
            color={COLOR.textBlue}
            depthOffset={-1}
          >
            Programming Portfolio
          </Text>
          {/* 스탠드 */}
          <mesh position={[0, 0.4, 0]}>
            <boxGeometry args={[0.1, 0.8, 0.1]} />
            <meshStandardMaterial color={COLOR.darkMid} {...MAT.darkMid} />
          </mesh>
          <mesh position={[0, 0.025, 0]}>
            <boxGeometry args={[0.4, 0.05, 0.4]} />
            <meshStandardMaterial color={COLOR.darkBody} {...MAT.darkBody} />
          </mesh>
        </group>

        {/* 모니터 2 (오른쪽) */}
        <group position={[0.2, 1.5, 1.1]} rotation={[0, 0.4, 0]}>
          <mesh position={[0, 0.8, 0]} castShadow>
            <boxGeometry args={[0.1, 1.2, 2.0]} />
            <meshStandardMaterial color={COLOR.darkBody} {...MAT.darkBody} />
          </mesh>
          <mesh position={[0.05, 0.8, 0]}>
            <boxGeometry args={[0.02, 1.1, 1.9]} />
            <meshStandardMaterial
              color="#000000"
              emissive={COLOR.screenGreen}
              emissiveIntensity={0.3}
            />
          </mesh>
          <Text
            position={[0.062, 0.8, 0]}
            rotation={[0, Math.PI / 2, 0]}
            fontSize={0.08}
            color={COLOR.textGreen}
            depthOffset={-1}
          >
            {"const dev = 'Three.js';"}
          </Text>
          <mesh position={[0, 0.4, 0]}>
            <boxGeometry args={[0.1, 0.8, 0.1]} />
            <meshStandardMaterial color={COLOR.darkMid} {...MAT.darkMid} />
          </mesh>
          <mesh position={[0, 0.025, 0]}>
            <boxGeometry args={[0.4, 0.05, 0.4]} />
            <meshStandardMaterial color={COLOR.darkBody} {...MAT.darkBody} />
          </mesh>
        </group>

        {/* PC 본체 */}
        <group position={[0.4, 0, 1.6]}>
          <mesh position={[0, 0.5, 0]} castShadow receiveShadow>
            <boxGeometry args={[0.7, 1.0, 0.5]} />
            <meshStandardMaterial
              color={COLOR.pcBody}
              metalness={0.7}
              roughness={0.2}
            />
          </mesh>
          {/* 측면 패널 */}
          <mesh position={[0.355, 0.5, 0]}>
            <boxGeometry args={[0.02, 0.98, 0.48]} />
            <meshStandardMaterial color={COLOR.darkMid} {...MAT.darkMid} />
          </mesh>
          {/* 파워 버튼 */}
          <group
            position={[0.366, 0.85, 0.1]}
            rotation={[0, Math.PI / 2, 0]}
          >
            <mesh>
              <circleGeometry args={[0.02, 16]} />
              <meshBasicMaterial color={COLOR.pcRgb} />
            </mesh>
            <mesh position={[0.06, 0, 0]}>
              <boxGeometry args={[0.04, 0.01, 0.01]} />
              <meshStandardMaterial color={COLOR.darkMid} {...MAT.darkMid} />
            </mesh>
          </group>
          {/* 전면 강화유리 */}
          <mesh position={[0, 0.5, 0.255]}>
            <boxGeometry args={[0.66, 0.94, 0.01]} />
            <meshStandardMaterial color={COLOR.darkMid} transparent opacity={0.4} {...MAT.pcGlass} />
          </mesh>
          {/* RGB 조명 */}
          <pointLight
            ref={pcLightRef}
            position={[0, 0.6, 0.1]}
            color={COLOR.pcRgb}
            intensity={0.8}
            distance={1.2}
          />
          {/* 발 4개 */}
          {(
            [
              [-0.25, 0.02, -0.18],
              [ 0.25, 0.02, -0.18],
              [-0.25, 0.02,  0.18],
              [ 0.25, 0.02,  0.18],
            ] as [number, number, number][]
          ).map((pos, i) => (
            <mesh key={i} position={pos}>
              <boxGeometry args={[0.08, 0.04, 0.08]} />
              <meshStandardMaterial color={COLOR.darkBody} {...MAT.darkBody} />
            </mesh>
          ))}
        </group>

        {/* 의자 */}
        <group position={[1.5, 0.01, 0]} rotation={[0, Math.PI, 0]}>
          {/* 중심 기둥 */}
          <mesh position={[0, 0.25, 0]}>
            <boxGeometry args={[0.1, 0.5, 0.1]} />
            <meshStandardMaterial color={COLOR.darkMid} {...MAT.darkMid} />
          </mesh>
          {/* 방사형 다리 5개 */}
          {[0, 1, 2, 3, 4].map((i) => (
            <group key={i} rotation={[0, (i * Math.PI * 2) / 5, 0]}>
              <mesh position={[0.2, 0.05, 0]}>
                <boxGeometry args={[0.4, 0.05, 0.08]} />
                <meshStandardMaterial color={COLOR.darkMid} {...MAT.darkMid} />
              </mesh>
              <mesh position={[0.4, 0.05, 0]}>
                <boxGeometry args={[0.1, 0.1, 0.1]} />
                <meshStandardMaterial color={COLOR.darkBody} {...MAT.darkBody} />
              </mesh>
            </group>
          ))}
          {/* 시트 */}
          <mesh position={[0, 0.6, 0]} castShadow>
            <boxGeometry args={[0.9, 0.1, 0.9]} />
            <meshStandardMaterial color={COLOR.darkBody} {...MAT.darkBody} />
          </mesh>
          {/* 등받이 */}
          <mesh position={[-0.45, 1.45, 0]} castShadow>
            <boxGeometry args={[0.1, 1.1, 0.9]} />
            <meshStandardMaterial color={COLOR.darkBody} {...MAT.darkBody} />
          </mesh>
        </group>

        {/* 키보드 트레이 */}
        <mesh position={[0.6, 1.525, 0]} castShadow>
          <boxGeometry args={[0.4, 0.05, 1.2]} />
          <meshStandardMaterial color={COLOR.darkMid} {...MAT.darkMid} />
        </mesh>
        {/* 마우스 */}
        <mesh position={[0.6, 1.53, 0.8]} castShadow>
          <boxGeometry args={[0.15, 0.06, 0.1]} />
          <meshStandardMaterial color={COLOR.darkBody} {...MAT.darkBody} />
        </mesh>
      </group>
    </AnimatedWrapper>
  );
}