"use client";

import { Text } from "@react-three/drei";
import AnimatedWrapper, { AppearGroup, HoverLift, SceneItem } from "../AnimatedWrapper";
import IconFrames from "../decorations/IconFrames";
import WallClock from "../decorations/WallClock";
import { COLOR, DELAY, ROOM, WALL_HALF, WIN } from "../constants";
import { MAT } from "../materials";

// ── 창문 + 커튼 ──────────────────────────────
function WindowWithCurtains() {
  return (
    <group position={[WIN.x, WIN.y, 0]}>
      {/* 유리 */}
      <mesh position={[0, 0, 0.01]}>
        <planeGeometry args={[WIN.w, WIN.h]} />
        <meshStandardMaterial color="#E0F7FA" transparent opacity={0.1} metalness={0.9} />
      </mesh>

      {/* 십자 프레임 세로 */}
      <mesh position={[0, 0, 0.02]} castShadow>
        <boxGeometry args={[0.05, WIN.h, 0.06]} />
        <meshStandardMaterial color={COLOR.windowFrame} {...MAT.windowFrame} />
      </mesh>
      {/* 십자 프레임 가로 */}
      <mesh position={[0, 0, 0.02]} castShadow>
        <boxGeometry args={[WIN.w, 0.05, 0.06]} />
        <meshStandardMaterial color={COLOR.windowFrame} {...MAT.windowFrame} />
      </mesh>

      {/* 외곽 프레임 — 상/하/좌/우 */}
      {[
        { pos: [0,         WIN.h / 2,  0.01] as [number,number,number], size: [WIN.w + 0.2, 0.1,  0.15] as [number,number,number] },
        { pos: [0,        -WIN.h / 2,  0.01] as [number,number,number], size: [WIN.w + 0.2, 0.1,  0.15] as [number,number,number] },
        { pos: [ WIN.w/2,  0,          0.01] as [number,number,number], size: [0.1, WIN.h,         0.15] as [number,number,number] },
        { pos: [-WIN.w/2,  0,          0.01] as [number,number,number], size: [0.1, WIN.h,         0.15] as [number,number,number] },
      ].map(({ pos, size }, i) => (
        <mesh key={i} position={pos} castShadow>
          <boxGeometry args={size} />
          <meshStandardMaterial color={COLOR.windowFrame} {...MAT.windowFrame} />
        </mesh>
      ))}

      {/* 커튼봉 + 좌우 커튼 — 하나의 SceneItem으로 묶어서 함께 hover */}
      <SceneItem
        delay={DELAY.curtainL}
        liftHeight={0.06}
        hitbox={[2.2, 5.0, 0.5]}
        hitboxPos={[0, 0, 0.15]}
      >
        {/* 커튼봉 */}
        <mesh position={[0, WIN.h / 2 + 0.25, 0.2]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.025, 0.025, WIN.w + 1.6, 16]} />
          <meshStandardMaterial color={COLOR.woodDark} {...MAT.woodDark} />
        </mesh>

        {/* 왼쪽 커튼 */}
        <group position={[-WIN.w / 2 - 0.35, 0, 0.15]}>
          <mesh castShadow>
            <boxGeometry args={[0.75, WIN.h + 0.5, 0.04]} />
            <meshStandardMaterial color={COLOR.curtain} {...MAT.curtain} />
          </mesh>
          {([-0.18, 0.05, 0.25] as number[]).map((x, i) => (
            <mesh key={i} position={[x, 0, 0.04 + i * 0.01]} castShadow>
              <boxGeometry args={[0.15, WIN.h + 0.5, 0.05]} />
              <meshStandardMaterial color={COLOR.curtainFold} {...MAT.curtain} />
            </mesh>
          ))}
        </group>

        {/* 오른쪽 커튼 */}
        <group position={[WIN.w / 2 + 0.35, 0, 0.15]}>
          <mesh castShadow>
            <boxGeometry args={[0.75, WIN.h + 0.5, 0.04]} />
            <meshStandardMaterial color={COLOR.curtain} {...MAT.curtain} />
          </mesh>
          {([0.18, -0.05, -0.25] as number[]).map((x, i) => (
            <mesh key={i} position={[x, 0, 0.04 + i * 0.01]} castShadow>
              <boxGeometry args={[0.15, WIN.h + 0.5, 0.05]} />
              <meshStandardMaterial color={COLOR.curtainFold} {...MAT.curtain} />
            </mesh>
          ))}
        </group>
      </SceneItem>
    </group>
  );
}

// ── 뒷벽 ─────────────────────────────────────
function BackWall() {
  const wt = ROOM.wallThickness;
  const ht = ROOM.height;
  const z  = -WALL_HALF + wt / 2;

  return (
    <group position={[0, 0, z]}>
      {/* 벽 — hover 없음 */}
      <AppearGroup delay={DELAY.wallBack}>
        <group>
          <mesh position={[-1.875, ht / 2, 0]} receiveShadow>
            <boxGeometry args={[4.25, ht, wt]} />
            <meshStandardMaterial color={COLOR.wall} {...MAT.wall} />
          </mesh>
          <mesh position={[3.375, ht / 2, 0]} receiveShadow>
            <boxGeometry args={[1.25, ht, wt]} />
            <meshStandardMaterial color={COLOR.wall} {...MAT.wall} />
          </mesh>
          <mesh position={[WIN.x, 0.875, 0]} receiveShadow>
            <boxGeometry args={[WIN.w, 1.75, wt]} />
            <meshStandardMaterial color={COLOR.wall} {...MAT.wall} />
          </mesh>
          <mesh position={[WIN.x, ht - 0.875, 0]} receiveShadow>
            <boxGeometry args={[WIN.w, 1.75, wt]} />
            <meshStandardMaterial color={COLOR.wall} {...MAT.wall} />
          </mesh>
        </group>
      </AppearGroup>

      <WindowWithCurtains />
      <WallClock position={[-2.5, 4.8, wt / 2 + 0.03]} />
    </group>
  );
}

// ── 왼쪽 벽 ──────────────────────────────────
function LeftWall() {
  const wt = ROOM.wallThickness;
  const ht = ROOM.height;
  const x  = -WALL_HALF + wt / 2;

  return (
    <group>
      {/* 벽 — hover 없음 */}
      <AppearGroup delay={DELAY.wallLeft}>
        <mesh position={[x, ht / 2, 0]} receiveShadow castShadow>
          <boxGeometry args={[wt, ht, ROOM.size]} />
          <meshStandardMaterial color={COLOR.wall} {...MAT.wall} />
        </mesh>
      </AppearGroup>

      {/* 게시판 — hover 있음 */}
      <AnimatedWrapper
        delay={DELAY.noticeboard}
        position={[-WALL_HALF + wt + 0.01, 4.2, -0.5]}
        liftHeight={0.06}
        hitbox={[0.1, 1.7, 2.3]}
        hitboxPos={[0.03, 0, 0]}
      >
        <group>
          <mesh rotation={[0, Math.PI / 2, 0]} castShadow>
            <boxGeometry args={[2.2, 1.6, 0.05]} />
            <meshStandardMaterial color={COLOR.noticeboard} {...MAT.woodDark} />
          </mesh>
          <mesh position={[0.03, 0, 0]} rotation={[0, Math.PI / 2, 0]}>
            <planeGeometry args={[2.0, 1.4]} />
            <meshStandardMaterial color={COLOR.corkboard} roughness={1} />
          </mesh>
          <mesh position={[0.035, 0.3, 0.4]} rotation={[0, Math.PI / 2, 0]}>
            <planeGeometry args={[0.3, 0.4]} />
            <meshStandardMaterial color="#FFF9C4" roughness={0.9} />
          </mesh>
          <group position={[0.04, 0, -0.4]} rotation={[0, Math.PI / 2, 0.08]}>
            <mesh castShadow>
              <boxGeometry args={[0.6, 0.8, 0.02]} />
              <meshStandardMaterial color="#D7B588" roughness={0.8} />
            </mesh>
            <Text position={[0, 0, 0.014]} fontSize={0.07} color="#3A2208" anchorX="center" anchorY="middle">
              RESUME
            </Text>
            <mesh position={[0, 0.35, 0.015]}>
              <sphereGeometry args={[0.015, 16, 16]} />
              <meshStandardMaterial color="#E91E63" roughness={0.4} metalness={0.3} />
            </mesh>
          </group>
        </group>
      </AnimatedWrapper>

      {/* 선반 세트 */}
      <group position={[-WALL_HALF + wt, 0, 1.8]}>

        {/* 위 선반 — 선반판 hover + 아이콘 개별 hover */}
        <AppearGroup delay={DELAY.shelfUpper} position={[0, 4.55, 0]}>
          {/* 선반판 개별 hover */}
          <group position={[0.275, 0, 0]}>
            <HoverLift liftHeight={0.04}>
              <mesh castShadow receiveShadow>
                <boxGeometry args={[0.55, 0.06, 2.1]} />
                <meshStandardMaterial color={COLOR.woodMid} {...MAT.woodMid} />
              </mesh>
            </HoverLift>
          </group>
          {/* 아이콘 액자 — 각각 개별 hover (IconFrames 내부에서 HoverLift 사용) */}
          <IconFrames />
        </AppearGroup>

        {/* 아래 선반 — 선반판 + 소품 각각 개별 hover */}
        <AppearGroup delay={DELAY.shelfLower} position={[0, 3.25, 0]}>
          {/* 선반판 */}
          <group position={[0.275, 0, 0]}>
            <HoverLift liftHeight={0.04}>
              <mesh castShadow receiveShadow>
                <boxGeometry args={[0.55, 0.06, 2.1]} />
                <meshStandardMaterial color={COLOR.woodMid} {...MAT.woodMid} />
              </mesh>
            </HoverLift>
          </group>
          {/* 화분 */}
          <group position={[0.275, 0, -0.55]}>
            <HoverLift liftHeight={0.05}>
              <mesh position={[0, 0.12, 0]} castShadow>
                <cylinderGeometry args={[0.07, 0.05, 0.14, 16]} />
                <meshStandardMaterial color={COLOR.pot} {...MAT.pot} />
              </mesh>
              <mesh position={[0, 0.22, 0]} castShadow>
                <sphereGeometry args={[0.08, 16, 16]} />
                <meshStandardMaterial color={COLOR.plant} {...MAT.plant} />
              </mesh>
            </HoverLift>
          </group>
          {/* 책 빨강 */}
          <group position={[0.275, 0.14, 0.32]}>
            <HoverLift liftHeight={0.05}>
              <mesh rotation={[0, 0.1, 0]} castShadow>
                <boxGeometry args={[0.06, 0.22, 0.14]} />
                <meshStandardMaterial color={COLOR.bookRed} {...MAT.book} />
              </mesh>
            </HoverLift>
          </group>
          {/* 책 파랑 */}
          <group position={[0.275, 0.14, 0.50]}>
            <HoverLift liftHeight={0.05}>
              <mesh rotation={[0, -0.05, 0]} castShadow>
                <boxGeometry args={[0.06, 0.22, 0.15]} />
                <meshStandardMaterial color={COLOR.bookBlue} {...MAT.book} />
              </mesh>
            </HoverLift>
          </group>
        </AppearGroup>

      </group>
    </group>
  );
}

export default function Walls() {
  return (
    <>
      <BackWall />
      <LeftWall />
    </>
  );
}