"use client";

import { COLOR, ROOM, WALL_HALF } from "../constants";

/** 천장 몰딩 (뒷벽·왼쪽 벽 상단) */
export default function Moulding() {
  const { height, wallThickness: wt } = ROOM;

  return (
    <>
      {/* 뒷벽 몰딩 */}
      <mesh
        position={[
          0.05,
          height - 0.1,
          -WALL_HALF + wt / 2 + 0.005,
        ]}
      >
        <boxGeometry args={[ROOM.size + 0.1, 0.25, wt + 0.061]} />
        <meshStandardMaterial color={COLOR.moulding} />
      </mesh>

      {/* 왼쪽 벽 몰딩 */}
      <mesh
        position={[
          -WALL_HALF + wt / 2 + 0.004,
          height - 0.1,
          0.05,
        ]}
      >
        <boxGeometry args={[wt + 0.06, 0.25, ROOM.size + 0.1]} />
        <meshStandardMaterial color={COLOR.moulding} />
      </mesh>
    </>
  );
}