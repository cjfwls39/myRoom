"use client";

import AnimatedWrapper from "../AnimatedWrapper";
import { COLOR, DELAY, WALL_HALF } from "../constants";

/**
 * 턱시도 고양이 — 식빵 자세 (loaf pose)
 * 입체감 개선:
 *  - 눈·코·입가 털 두께를 크게 늘려 얼굴에서 도드라지게
 *  - 가슴 흰털을 두껍게 + 앞으로 튀어나오게
 *  - 발을 하체에서 앞으로 별도로 튀어나오게
 *  - 콧등 볼록(muzzle) 추가해 얼굴 입체감 강화
 */
function TuxedoCat() {
  const LW = 0.44;  const LH = 0.16;  const LD = 0.38;
  const BW = 0.38;  const BH = 0.22;  const BD = 0.32;
  const HW = 0.34;  const HH = 0.32;  const HD = 0.30;

  const lowerTop  = LH;
  const bodyTop   = lowerTop + BH;
  const headCY    = bodyTop + HH / 2;
  const hf        = HD / 2;   // 머리 앞면 z (머리 group 기준)

  return (
    <group>
      {/* ── 하체 ── */}
      <mesh position={[0, LH / 2, 0]} castShadow>
        <boxGeometry args={[LW, LH, LD]} />
        <meshStandardMaterial color={COLOR.catBlack} />
      </mesh>

      {/* 앞발: 돌출량 0.10 → 0.05 */}
      <mesh position={[-LW * 0.17, LH * 0.5, LD / 2 + 0.025]} castShadow>
        <boxGeometry args={[0.11, LH * 0.85, 0.05]} />
        <meshStandardMaterial color={COLOR.catWhite} />
      </mesh>
      <mesh position={[ LW * 0.17, LH * 0.5, LD / 2 + 0.025]} castShadow>
        <boxGeometry args={[0.11, LH * 0.85, 0.05]} />
        <meshStandardMaterial color={COLOR.catWhite} />
      </mesh>

      {/* ── 몸통 ── */}
      <mesh position={[0, lowerTop + BH / 2, 0]} castShadow>
        <boxGeometry args={[BW, BH, BD]} />
        <meshStandardMaterial color={COLOR.catBlack} />
      </mesh>

      {/* 가슴 흰털: 돌출량 0.06 → 0.03 */}
      <mesh position={[0, lowerTop + BH * 0.52, BD / 2 + 0.015]}>
        <boxGeometry args={[BW * 0.42, BH * 0.70, 0.03]} />
        <meshStandardMaterial color={COLOR.catWhite} />
      </mesh>

      {/* ── 머리 ── */}
      <group position={[0, headCY, BD * 0.08]}>
        <mesh castShadow>
          <boxGeometry args={[HW, HH, HD]} />
          <meshStandardMaterial color={COLOR.catBlack} />
        </mesh>

        {/* 귀 */}
        <mesh position={[-HW * 0.28, HH / 2 + 0.05, -HD * 0.1]}>
          <boxGeometry args={[0.07, 0.12, 0.07]} />
          <meshStandardMaterial color={COLOR.catBlack} />
        </mesh>
        <mesh position={[ HW * 0.28, HH / 2 + 0.05, -HD * 0.1]}>
          <boxGeometry args={[0.07, 0.12, 0.07]} />
          <meshStandardMaterial color={COLOR.catBlack} />
        </mesh>

        {/* muzzle: 돌출량 0.08 → 0.04 */}
        <mesh position={[0, -HH * 0.08, hf + 0.02]}>
          <boxGeometry args={[HW * 0.48, HH * 0.38, 0.04]} />
          <meshStandardMaterial color={COLOR.catWhite} />
        </mesh>

        {/* 눈: 돌출량 0.06 → 0.03 */}
        <mesh position={[-HW * 0.24, HH * 0.10, hf + 0.02]}>
          <boxGeometry args={[0.09, 0.035, 0.03]} />
          <meshStandardMaterial color={COLOR.catEye} />
        </mesh>
        <mesh position={[ HW * 0.24, HH * 0.10, hf + 0.02]}>
          <boxGeometry args={[0.09, 0.035, 0.03]} />
          <meshStandardMaterial color={COLOR.catEye} />
        </mesh>

        {/* 코: muzzle 앞면에 붙음 */}
        <mesh position={[0, -HH * 0.06, hf + 0.04 + 0.007]}>
          <boxGeometry args={[0.055, 0.042, 0.014]} />
          <meshStandardMaterial color={COLOR.catNose} />
        </mesh>
      </group>

      {/* 꼬리 */}
      <mesh position={[LW / 2 + 0.04, LH * 0.6, 0]}>
        <boxGeometry args={[0.08, 0.08, LD * 0.8]} />
        <meshStandardMaterial color={COLOR.catBlack} />
      </mesh>
      <mesh position={[LW / 2 + 0.04, LH * 0.6, LD * 0.4 + 0.04]} rotation={[0, Math.PI / 2, 0]}>
        <boxGeometry args={[0.08, 0.08, 0.14]} />
        <meshStandardMaterial color={COLOR.catBlack} />
      </mesh>
    </group>
  );
}

/** 침대 + 고양이 */
export default function Bed() {
  return (
    <AnimatedWrapper
      delay={DELAY.bed}
      position={[2.5, 0, -WALL_HALF + 2.5]}
      liftHeight={0.06}
      hitbox={[2.6, 0.8, 4.6]}
      hitboxPos={[0, 0.4, 0]}
    >
      <group>
        {/* 침대 프레임 */}
        <mesh position={[0, 0.2, 0]} receiveShadow>
          <boxGeometry args={[2.5, 0.4, 4.5]} />
          <meshStandardMaterial color={COLOR.bedFrame} />
        </mesh>
        {/* 매트리스 */}
        <mesh position={[0, 0.6, 0]} castShadow>
          <boxGeometry args={[2.3, 0.4, 4.3]} />
          <meshStandardMaterial color={COLOR.mattress} />
        </mesh>
        {/* 베개 */}
        <mesh position={[0, 0.85, -1.5]} castShadow>
          <boxGeometry args={[1.5, 0.2, 0.8]} />
          <meshStandardMaterial color={COLOR.pillow} />
        </mesh>
        {/* 이불 */}
        <mesh position={[0, 0.85, 0.5]} castShadow>
          <boxGeometry args={[2.4, 0.1, 3.0]} />
          <meshStandardMaterial color={COLOR.blanket} />
        </mesh>

        {/* 고양이 — 식빵 자세, 매트리스 위(y=0.8)에 세워서 배치 */}
        <group position={[0.2, 0.80, 0.3]} rotation={[0, -0.5, 0]}>
          <TuxedoCat />
        </group>
      </group>
    </AnimatedWrapper>
  );
}