"use client";

import { SceneItem } from "../AnimatedWrapper";
import { MAT } from "../materials";
import { COLOR, DELAY } from "../constants";
import { POS, SIZE, ROT } from "../layout";

function SunCat() {
  const { LW, LH, LD, BW, BH, BD, HW, HH, HD } = SIZE.sunCat;

  const lowerTop = LH;
  const bodyTop  = lowerTop + BH;
  const headCY   = bodyTop + HH / 2;
  const hf       = HD / 2;

  return (
    <group>
      {/* 하체 */}
      <mesh position={[0, LH / 2, 0]} castShadow>
        <boxGeometry args={[LW, LH, LD]} />
        <meshStandardMaterial color={COLOR.catBlack} roughness={1.0} />
      </mesh>
      {/* 앞발 */}
      <mesh position={[-LW * 0.17, LH * 0.5, LD / 2 + 0.025]}>
        <boxGeometry args={[0.10, LH * 0.85, 0.05]} />
        <meshStandardMaterial color={COLOR.catWhite} roughness={1.0} />
      </mesh>
      <mesh position={[ LW * 0.17, LH * 0.5, LD / 2 + 0.025]}>
        <boxGeometry args={[0.10, LH * 0.85, 0.05]} />
        <meshStandardMaterial color={COLOR.catWhite} roughness={1.0} />
      </mesh>
      {/* 몸통 */}
      <mesh position={[0, lowerTop + BH / 2, 0]} castShadow>
        <boxGeometry args={[BW, BH, BD]} />
        <meshStandardMaterial color={COLOR.catBlack} roughness={1.0} />
      </mesh>
      {/* 가슴 흰털 */}
      <mesh position={[0, lowerTop + BH * 0.52, BD / 2 + 0.015]}>
        <boxGeometry args={[BW * 0.42, BH * 0.70, 0.03]} />
        <meshStandardMaterial color={COLOR.catWhite} roughness={1.0} />
      </mesh>
      {/* 머리 */}
      <group position={[0, headCY, BD * 0.08]}>
        <mesh castShadow>
          <boxGeometry args={[HW, HH, HD]} />
          <meshStandardMaterial color={COLOR.catBlack} roughness={1.0} />
        </mesh>
        {/* 귀 */}
        <mesh position={[-HW * 0.28, HH / 2 + 0.04, -HD * 0.1]}>
          <boxGeometry args={[0.06, 0.10, 0.06]} />
          <meshStandardMaterial color={COLOR.catBlack} roughness={1.0} />
        </mesh>
        <mesh position={[ HW * 0.28, HH / 2 + 0.04, -HD * 0.1]}>
          <boxGeometry args={[0.06, 0.10, 0.06]} />
          <meshStandardMaterial color={COLOR.catBlack} roughness={1.0} />
        </mesh>
        {/* muzzle */}
        <mesh position={[0, -HH * 0.08, hf + 0.02]}>
          <boxGeometry args={[HW * 0.48, HH * 0.36, 0.04]} />
          <meshStandardMaterial color={COLOR.catWhite} roughness={1.0} />
        </mesh>
        {/* 눈 (졸린) */}
        <mesh position={[-HW * 0.24, HH * 0.10, hf + 0.02]}>
          <boxGeometry args={[0.08, 0.018, 0.02]} />
          <meshStandardMaterial color={COLOR.catEye} roughness={0.3} />
        </mesh>
        <mesh position={[ HW * 0.24, HH * 0.10, hf + 0.02]}>
          <boxGeometry args={[0.08, 0.018, 0.02]} />
          <meshStandardMaterial color={COLOR.catEye} roughness={0.3} />
        </mesh>
        {/* 코 */}
        <mesh position={[0, -HH * 0.08, hf + 0.042]}>
          <boxGeometry args={[0.044, 0.034, 0.012]} />
          <meshStandardMaterial color={COLOR.catNose} roughness={0.8} />
        </mesh>
      </group>
      {/* 꼬리 */}
      <mesh position={[LW / 2 + 0.04, LH * 0.6, 0]}>
        <boxGeometry args={[0.07, 0.07, LD * 0.8]} />
        <meshStandardMaterial color={COLOR.catBlack} roughness={1.0} />
      </mesh>
      <mesh position={[LW / 2 + 0.04, LH * 0.6, LD * 0.4 + 0.035]} rotation={[0, Math.PI / 2, 0]}>
        <boxGeometry args={[0.07, 0.07, 0.12]} />
        <meshStandardMaterial color={COLOR.catBlack} roughness={1.0} />
      </mesh>
    </group>
  );
}

export default function SunbathingCat() {
  const [posX, , posZ] = POS.sunCat;

  return (
    <SceneItem
      delay={DELAY.bed + 0.3}
      position={[posX, 0, posZ]}
      liftHeight={0.06}
      hitbox={[0.5, 0.5, 0.5]}
      hitboxPos={[0, 0.25, 0]}
    >
      <group rotation={ROT.sunCat}>
        <SunCat />
      </group>
    </SceneItem>
  );
}
