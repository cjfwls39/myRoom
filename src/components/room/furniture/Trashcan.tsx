"use client";

import { SceneItem } from "../AnimatedWrapper";
import { DELAY } from "../constants";
import { MAT } from "../materials";

function TrashcanBody() {
  const BW = 0.22, BH = 0.40, BD = 0.20; // 직사각형 본체

  return (
    <group>
      {/* 본체 */}
      <mesh castShadow receiveShadow position={[0, BH / 2, 0]}>
        <boxGeometry args={[BW, BH, BD]} />
        <meshStandardMaterial color="#2A2A2A" {...MAT.darkBody} />
      </mesh>

      {/* 뚜껑 */}
      <mesh castShadow position={[0, BH + 0.018, 0]}>
        <boxGeometry args={[BW + 0.01, 0.035, BD + 0.01]} />
        <meshStandardMaterial color="#1E1E1E" {...MAT.darkMid} />
      </mesh>
      {/* 뚜껑 위 볼록한 버튼 */}
      <mesh position={[0, BH + 0.04, 0]}>
        <boxGeometry args={[BW * 0.4, 0.018, BD * 0.3]} />
        <meshStandardMaterial color="#333333" {...MAT.darkBody} />
      </mesh>

      {/* 페달 — 앞면 하단 */}
      <mesh position={[0, 0.025, BD / 2 + 0.025]} castShadow>
        <boxGeometry args={[BW * 0.55, 0.018, 0.06]} />
        <meshStandardMaterial color="#1A1A1A" {...MAT.darkMid} />
      </mesh>

      {/* 앞면 세로 라인 디테일 */}
      {[-BW * 0.28, BW * 0.28].map((x, i) => (
        <mesh key={i} position={[x, BH * 0.5, BD / 2 + 0.001]}>
          <boxGeometry args={[0.006, BH * 0.75, 0.002]} />
          <meshStandardMaterial color="#1A1A1A" roughness={0.3} />
        </mesh>
      ))}

      {/* 손잡이 — 뒤쪽 상단 */}
      <mesh position={[0, BH * 0.82, -BD / 2 - 0.012]} castShadow>
        <boxGeometry args={[BW * 0.35, 0.022, 0.018]} />
        <meshStandardMaterial color="#333333" {...MAT.darkMid} />
      </mesh>
    </group>
  );
}

export default function Trashcan() {
  return (
    <SceneItem
      delay={DELAY.desk + 0.5}
      position={[-2.0, 0, 0.85]}
      liftHeight={0.04}
      hitbox={[0.30, 0.48, 0.28]}
      hitboxPos={[0, 0.24, 0]}
    >
      <TrashcanBody />
    </SceneItem>
  );
}