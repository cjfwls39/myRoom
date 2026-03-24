"use client";

import { SceneItem } from "../AnimatedWrapper";
import { COLOR, DELAY } from "../constants";
import { POS, SIZE } from "../layout";

function Bowl({
  position, rimColor, innerColor, waterColor, isWater = false,
}: {
  position: [number, number, number];
  rimColor: string; innerColor: string; waterColor?: string; isWater?: boolean;
}) {
  const { foodW, foodH, waterW, waterH } = SIZE.catBowl;
  const RW = isWater ? waterW : foodW;
  const RH = isWater ? waterH : foodH;
  const thickness = 0.015;

  return (
    <group position={position}>
      <mesh>
        <cylinderGeometry args={[RW / 2, (RW / 2) * 0.85, RH, 16]} />
        <meshStandardMaterial color={rimColor} roughness={0.4} metalness={0.2} />
      </mesh>
      <mesh position={[0, thickness, 0]}>
        <cylinderGeometry args={[RW / 2 - thickness, (RW / 2) * 0.85 - thickness, RH - thickness, 16]} />
        <meshStandardMaterial color={innerColor} roughness={0.8} />
      </mesh>
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
  const { matW, matH, matD, spacing } = SIZE.catBowl;
  const [posX, posY, posZ] = POS.catBowls;

  return (
    <SceneItem
      delay={DELAY.fridge + 0.2}
      position={[posX, posY + 0.02, posZ]}
      liftHeight={0.05}
      hitbox={[matW + 0.05, matH + 0.1, matD + 0.04]}
      hitboxPos={[0, 0.06, 0]}
    >
      {/* 그릇 매트 */}
      <mesh receiveShadow>
        <boxGeometry args={[matW, matH, matD]} />
        <meshStandardMaterial color={COLOR.rug} roughness={1} />
      </mesh>
      {/* 밥그릇 */}
      <Bowl
        position={[-spacing, matH, 0]}
        rimColor="#9C7B5A"
        innerColor="#3A2510"
        isWater={false}
      />
      {/* 물그릇 */}
      <Bowl
        position={[spacing, matH, 0]}
        rimColor="#7C9C8A"
        innerColor="#1A2A2A"
        waterColor="#A8D8E8"
        isWater={true}
      />
    </SceneItem>
  );
}
