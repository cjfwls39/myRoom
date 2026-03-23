"use client";

import { SceneItem } from "../AnimatedWrapper";
import { COLOR, DELAY, WALL_HALF } from "../constants";

/**
 * 고양이 밥그릇 + 물그릇
 *
 * 위치: 왼쪽 벽 냉장고 옆 바닥
 * 냉장고 position: [-WALL_HALF + 0.8, 0, 2.8]
 * 그릇 매트 → 냉장고 앞(z+방향)으로 살짝 나와서 배치
 *
 * 구조:
 *  - 매트(얇은 판) 위에 그릇 두 개
 *  - 밥그릇: 약간 더 넓고 납작 (사료용)
 *  - 물그릇: 조금 더 깊고 좁음 + 물 표면 표현
 */

function Bowl({
  position,
  rimColor,
  innerColor,
  waterColor,
  isWater = false,
}: {
  position: [number, number, number];
  rimColor: string;
  innerColor: string;
  waterColor?: string;
  isWater?: boolean;
}) {
  const RW = isWater ? 0.14 : 0.18;   // 그릇 가로
  const RD = isWater ? 0.14 : 0.18;   // 그릇 깊이
  const RH = isWater ? 0.06 : 0.04;   // 그릇 높이
  const thickness = 0.015;

  return (
    <group position={position}>
      {/* 그릇 외벽 */}
      <mesh>
        <cylinderGeometry args={[RW / 2, RW / 2 * 0.85, RH, 16]} />
        <meshStandardMaterial color={rimColor} roughness={0.4} metalness={0.2} />
      </mesh>
      {/* 그릇 내부 (살짝 작고 낮게) */}
      <mesh position={[0, thickness, 0]}>
        <cylinderGeometry args={[RW / 2 - thickness, RW / 2 * 0.85 - thickness, RH - thickness, 16]} />
        <meshStandardMaterial color={innerColor} roughness={0.8} />
      </mesh>
      {/* 물그릇: 수면 표현 */}
      {isWater && waterColor && (
        <mesh position={[0, RH * 0.42, 0]}>
          <cylinderGeometry args={[RW / 2 - thickness - 0.005, RW / 2 - thickness - 0.005, 0.004, 16]} />
          <meshStandardMaterial color={waterColor} transparent opacity={0.7} roughness={0} metalness={0.3} />
        </mesh>
      )}
    </group>
  );
}

export default function CatBowls() {
  // 냉장고 z=2.8, 그릇은 냉장고 앞(z+방향) + 왼쪽 벽 쪽
  const baseX = -WALL_HALF + 1.0;
  const baseZ = 3.5;
  const groundY = 0.02;  // 바닥 위 살짝

  return (
    <SceneItem delay={DELAY.fridge + 0.2} position={[baseX, groundY, baseZ]} liftHeight={0.05} hitbox={[0.6, 0.12, 0.32]} hitboxPos={[0, 0.06, 0]}>
      {/* 그릇 매트 */}
      <mesh position={[0, 0, 0]} receiveShadow>
        <boxGeometry args={[0.55, 0.015, 0.28]} />
        <meshStandardMaterial color="#8B4A3A" roughness={1} />
      </mesh>

      {/* 밥그릇 — 왼쪽, 넓고 납작 */}
      <Bowl
        position={[-0.14, 0.015, 0]}
        rimColor="#9C7B5A"
        innerColor="#3A2510"
        isWater={false}
      />

      {/* 물그릇 — 오른쪽, 좁고 깊음 */}
      <Bowl
        position={[0.14, 0.015, 0]}
        rimColor="#7C9C8A"
        innerColor="#1A2A2A"
        waterColor="#A8D8E8"
        isWater={true}
      />
    </SceneItem>
  );
}