"use client";

import AnimatedWrapper from "../AnimatedWrapper";
import { MAT } from "../materials";
import { COLOR, DELAY } from "../constants";
import { POS, SIZE } from "../layout";

function TuxedoCat() {
  const { LW, LH, LD, BW, BH, BD, HW, HH, HD } = SIZE.tuxedoCat;

  const lowerTop = LH;
  const bodyTop  = lowerTop + BH;
  const headCY   = bodyTop + HH / 2;
  const hf       = HD / 2;

  return (
    <group>
      {/* 하체 */}
      <mesh position={[0, LH / 2, 0]} castShadow>
        <boxGeometry args={[LW, LH, LD]} />
        <meshStandardMaterial color={COLOR.catBlack} {...MAT.catFur} />
      </mesh>
      {/* 앞발 */}
      <mesh position={[-LW * 0.17, LH * 0.5, LD / 2 + 0.025]} castShadow>
        <boxGeometry args={[0.11, LH * 0.85, 0.05]} />
        <meshStandardMaterial color={COLOR.catWhite} {...MAT.catFur} />
      </mesh>
      <mesh position={[ LW * 0.17, LH * 0.5, LD / 2 + 0.025]} castShadow>
        <boxGeometry args={[0.11, LH * 0.85, 0.05]} />
        <meshStandardMaterial color={COLOR.catWhite} {...MAT.catFur} />
      </mesh>
      {/* 몸통 */}
      <mesh position={[0, lowerTop + BH / 2, 0]} castShadow>
        <boxGeometry args={[BW, BH, BD]} />
        <meshStandardMaterial color={COLOR.catBlack} {...MAT.catFur} />
      </mesh>
      {/* 가슴 흰털 */}
      <mesh position={[0, lowerTop + BH * 0.52, BD / 2 + 0.015]}>
        <boxGeometry args={[BW * 0.42, BH * 0.70, 0.03]} />
        <meshStandardMaterial color={COLOR.catWhite} {...MAT.catFur} />
      </mesh>
      {/* 머리 */}
      <group position={[0, headCY, BD * 0.08]}>
        <mesh castShadow>
          <boxGeometry args={[HW, HH, HD]} />
          <meshStandardMaterial color={COLOR.catBlack} {...MAT.catFur} />
        </mesh>
        {/* 귀 */}
        <mesh position={[-HW * 0.28, HH / 2 + 0.05, -HD * 0.1]}>
          <boxGeometry args={[0.07, 0.12, 0.07]} />
          <meshStandardMaterial color={COLOR.catBlack} {...MAT.catFur} />
        </mesh>
        <mesh position={[ HW * 0.28, HH / 2 + 0.05, -HD * 0.1]}>
          <boxGeometry args={[0.07, 0.12, 0.07]} />
          <meshStandardMaterial color={COLOR.catBlack} {...MAT.catFur} />
        </mesh>
        {/* muzzle */}
        <mesh position={[0, -HH * 0.08, hf + 0.02]}>
          <boxGeometry args={[HW * 0.48, HH * 0.38, 0.04]} />
          <meshStandardMaterial color={COLOR.catWhite} {...MAT.catFur} />
        </mesh>
        {/* 눈 */}
        <mesh position={[-HW * 0.24, HH * 0.10, hf + 0.02]}>
          <boxGeometry args={[0.09, 0.035, 0.03]} />
          <meshStandardMaterial color={COLOR.catEye} {...MAT.catEye} />
        </mesh>
        <mesh position={[ HW * 0.24, HH * 0.10, hf + 0.02]}>
          <boxGeometry args={[0.09, 0.035, 0.03]} />
          <meshStandardMaterial color={COLOR.catEye} {...MAT.catEye} />
        </mesh>
        {/* 코 */}
        <mesh position={[0, -HH * 0.06, hf + 0.04 + 0.007]}>
          <boxGeometry args={[0.055, 0.042, 0.014]} />
          <meshStandardMaterial color={COLOR.catNose} {...MAT.catNose} />
        </mesh>
      </group>
      {/* 꼬리 */}
      <mesh position={[LW / 2 + 0.04, LH * 0.6, 0]}>
        <boxGeometry args={[0.08, 0.08, LD * 0.8]} />
        <meshStandardMaterial color={COLOR.catBlack} {...MAT.catFur} />
      </mesh>
      <mesh position={[LW / 2 + 0.04, LH * 0.6, LD * 0.4 + 0.04]} rotation={[0, Math.PI / 2, 0]}>
        <boxGeometry args={[0.08, 0.08, 0.14]} />
        <meshStandardMaterial color={COLOR.catBlack} {...MAT.catFur} />
      </mesh>
    </group>
  );
}

export default function Bed() {
  const { frameW, frameH, frameD, mattH,
          pillowW, pillowH, pillowD,
          blanketH, blanketRatioD,
          catOffsetX, catOffsetZ } = SIZE.bed;

  return (
    <AnimatedWrapper
      delay={DELAY.bed}
      position={POS.bed}
      liftHeight={0.06}
      hitbox={[frameW + 0.1, 0.7, frameD + 0.1]}
      hitboxPos={[0, 0.35, 0]}
    >
      <group>
        {/* 프레임 */}
        <mesh position={[0, frameH / 2, 0]} receiveShadow>
          <boxGeometry args={[frameW, frameH, frameD]} />
          <meshStandardMaterial color={COLOR.bedFrame} roughness={0.75} metalness={0} />
        </mesh>
        {/* 매트리스 */}
        <mesh position={[0, frameH + mattH / 2, 0]} castShadow>
          <boxGeometry args={[frameW - 0.18, mattH, frameD - 0.18]} />
          <meshStandardMaterial color={COLOR.mattress} roughness={1.0} />
        </mesh>
        {/* 베개 */}
        <mesh position={[0, frameH + mattH + 0.07, -frameD / 2 + 0.6]} castShadow>
          <boxGeometry args={[pillowW, pillowH, pillowD]} />
          <meshStandardMaterial color={COLOR.pillow} roughness={1.0} />
        </mesh>
        {/* 이불 */}
        <mesh position={[0, frameH + mattH + 0.04, 0.35]} castShadow>
          <boxGeometry args={[frameW - 0.08, blanketH, frameD * blanketRatioD]} />
          <meshStandardMaterial color={COLOR.blanket} roughness={1.0} />
        </mesh>
        {/* 고양이 */}
        <group position={[catOffsetX, frameH + mattH, catOffsetZ]} rotation={[0, -0.5, 0]}>
          <TuxedoCat />
        </group>
      </group>
    </AnimatedWrapper>
  );
}
