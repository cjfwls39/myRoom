"use client";

import { SceneItem } from "../AnimatedWrapper";
import { MAT } from "../materials";
import { COLOR, DELAY, WALL_HALF } from "../constants";

/**
 * 햇빛 패치 + 드러누운 고양이
 *
 * 창문 위치: 뒷벽(z = -WALL_HALF), x = 1.5
 * 햇빛이 비스듬히 들어와 바닥에 떨어지는 위치:
 *   x ≈ 1.5 (창문 중심 정렬)
 *   z ≈ -1.5 (뒷벽에서 약 2.5 앞)
 *
 * 고양이 자세: 옆으로 쭉 드러누운 자세 (side-lying)
 *   - 몸통을 Z축으로 길게 누임
 *   - 머리는 몸통 한쪽 끝에
 *   - 발은 앞으로 쭉 뻗음
 */

// ── 식빵 자세 고양이 ────────────────────────────
function SunCat() {
  const LW = 0.40;  const LH = 0.14;  const LD = 0.34;  // 하체(발 덩어리)
  const BW = 0.34;  const BH = 0.20;  const BD = 0.28;  // 몸통
  const HW = 0.30;  const HH = 0.28;  const HD = 0.26;  // 머리

  const lowerTop = LH;
  const bodyTop  = lowerTop + BH;
  const headCY   = bodyTop + HH / 2;
  const hf       = HD / 2;  // 머리 앞면

  return (
    <group>
      {/* 하체 */}
      <mesh position={[0, LH / 2, 0]} castShadow>
        <boxGeometry args={[LW, LH, LD]} />
        <meshStandardMaterial color={COLOR.catBlack} roughness={1.0} />
      </mesh>

      {/* 앞발 끝 — 하체 앞면에서 살짝 튀어나옴 */}
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

        {/* 눈 — 살짝 감긴 느낌 (졸린 햇빛 고양이) */}
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

// ── 외부 공개 ──────────────────────────────────
export default function SunbathingCat() {
  // 빨간 원 위치 기준: 책상과 침대 사이 바닥 중앙
  // x=0 (방 중앙), z=1.0 (앞쪽으로)
  const posX =  0.2;
  const posZ =  1.2;

  return (
    <SceneItem delay={DELAY.bed + 0.3} position={[posX, 0, posZ]} liftHeight={0.06} hitbox={[0.5, 0.5, 0.5]} hitboxPos={[0, 0.25, 0]}>
      <group rotation={[0, 0.5, 0]}>
        <SunCat />
      </group>
    </SceneItem>
  );
}