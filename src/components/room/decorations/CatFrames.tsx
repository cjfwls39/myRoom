"use client";

/**
 * CatFrames.tsx
 *
 * 왼쪽 벽에 걸리는 고양이 그림 액자 3개
 * 벽 로컬 좌표 기준:
 * X: 벽에서 돌출 방향 (+X = 방 안쪽)
 * Y: 위아래
 * Z: 벽을 따라 좌우
 */

import { HoverLift } from "../AnimatedWrapper";
import { DELAY } from "../constants";
import { POS, SIZE } from "../layout";
import { MAT } from "../materials";
import { CAT_FRAME_META, CAT_URLS } from "./catTextures"; // getCatTexture 대신 직접 URL 객체 참조
import { AppearGroup } from "../AnimatedWrapper";
import { WALL_HALF, ROOM } from "../constants";
import { useTexture } from "@react-three/drei"; // 텍스처 로더 추가

export default function CatFrames() {
  const { frameD, matD, borderW, sizes, zOffsets, yOffsets } = SIZE.catFrames;
  const wt = ROOM.wallThickness;
  const wallX = -WALL_HALF + wt + 0.005; // 벽 안쪽 면 X 위치

  // 모든 고양이 이미지를 텍스처 객체로 한 번에 로드합니다.
  const textures = useTexture(CAT_URLS);

  return (
    <group position={[wallX, POS.catFrames[1], POS.catFrames[2]]}>
      {CAT_FRAME_META.map(({ key, frameColor, matColor }, i) => {
        const [frameH, frameW] = sizes[i]; // [너비Y, 높이Z] → 벽에서 Y=높이, Z=너비
        const zOff = zOffsets[i];
        const yOff = yOffsets[i];
        
        // 로드된 텍스처 맵에서 해당 키의 텍스처를 가져옵니다.
        const tex = textures[key];

        return (
        <group key={key}>
          <AppearGroup
            delay={DELAY.catFrames + i * 0.15}
            position={[0, yOff, zOff]}
          >
            <HoverLift liftHeight={0.04}>
              <group rotation={[0, Math.PI / 2, 0]}>

                {/* ── 액자 외곽 프레임 ── */}
                {/* 상단 */}
                <mesh position={[0, frameH / 2 + borderW / 2, 0]} castShadow>
                  <boxGeometry args={[frameW + borderW * 2, borderW, frameD]} />
                  <meshStandardMaterial color={frameColor} {...MAT.woodDark} />
                </mesh>
                {/* 하단 */}
                <mesh position={[0, -frameH / 2 - borderW / 2, 0]} castShadow>
                  <boxGeometry args={[frameW + borderW * 2, borderW, frameD]} />
                  <meshStandardMaterial color={frameColor} {...MAT.woodDark} />
                </mesh>
                {/* 왼쪽 */}
                <mesh position={[-frameW / 2 - borderW / 2, 0, 0]} castShadow>
                  <boxGeometry args={[borderW, frameH, frameD]} />
                  <meshStandardMaterial color={frameColor} {...MAT.woodDark} />
                </mesh>
                {/* 오른쪽 */}
                <mesh position={[frameW / 2 + borderW / 2, 0, 0]} castShadow>
                  <boxGeometry args={[borderW, frameH, frameD]} />
                  <meshStandardMaterial color={frameColor} {...MAT.woodDark} />
                </mesh>

                {/* ── 매트 (테두리 안쪽 배경) ── */}
                <mesh position={[0, 0, frameD / 2 - matD]}>
                  <planeGeometry args={[frameW, frameH]} />
                  <meshStandardMaterial color={matColor} roughness={0.95} />
                </mesh>

                {/* ── 고양이 이미지 ── */}
                <mesh position={[0, 0, frameD / 2 - matD + 0.001]}>
                  <planeGeometry args={[frameW * 0.90, frameH * 0.90]} />
                  {/* 로드된 텍스처(tex)를 map 속성에 적용합니다. */}
                  <meshStandardMaterial map={tex} transparent roughness={0.9} />
                </mesh>

                {/* ── 유리 반사 (살짝 투명) ── */}
                <mesh position={[0, 0, frameD / 2 + 0.001]}>
                  <planeGeometry args={[frameW, frameH]} />
                  <meshStandardMaterial
                    transparent
                    opacity={0.06}
                    color="#FFFFFF"
                    roughness={0.05}
                    metalness={0.2}
                  />
                </mesh>

                {/* ── 걸이 (상단 중앙) ── */}
                <mesh position={[0, frameH / 2 + borderW + 0.02, 0]}>
                  <cylinderGeometry args={[0.008, 0.008, 0.04, 8]} />
                  <meshStandardMaterial color="#888" {...MAT.metalHandle} />
                </mesh>

              </group>
            </HoverLift>
          </AppearGroup>
        </group>
        );
      })}
    </group>
  );
}