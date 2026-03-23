"use client";

import { Text } from "@react-three/drei";
import AnimatedWrapper from "../AnimatedWrapper";
import { MAT } from "../materials";
import { COLOR, DELAY, ROOM } from "../constants";

/** 바닥 + 웰컴 러그 */
export default function Floor() {
  return (
    <>
      {/* 바닥 — hover 없음 */}
      <AnimatedWrapper delay={DELAY.floor} liftHeight={0.06} hover={false}>
        <mesh
          position={[0, -ROOM.floorThickness / 2, 0]}
          receiveShadow
        >
          <boxGeometry args={[ROOM.size, ROOM.floorThickness, ROOM.size]} />
          <meshStandardMaterial color={COLOR.floor} roughness={0.9} />
        </mesh>
      </AnimatedWrapper>

      {/* 웰컴 러그 + 텍스트를 함께 묶어야 hover 시 같이 움직임 */}
      <AnimatedWrapper
        delay={DELAY.rug}
        position={[3.0, 0.06, 2.5]}
        liftHeight={0.06}
      >
        <mesh receiveShadow castShadow>
          <boxGeometry args={[1.5, 0.1, 2.5]} />
          <meshStandardMaterial color={COLOR.rug} roughness={1} />
        </mesh>
        {/* 텍스트를 러그 안에 포함 — scale 시 함께 움직임 */}
        <Text
          position={[0, 0.052, 0]}
          rotation={[-Math.PI / 2, 0, Math.PI / 2]}
          fontSize={0.35}
          color="white"
          depthOffset={-1}
        >
          WELCOME
        </Text>
      </AnimatedWrapper>
    </>
  );
}