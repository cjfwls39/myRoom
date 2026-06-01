"use client";

import * as THREE from "three";

// ── 갤러리 치수 ────────────────────────────────────────────────
export const GW = 16;  // 너비 (X)
export const GH = 6;   // 높이 (Y)
export const GD = 50;  // 길이 (Z) — 전시물이 늘면 이 값을 키워 통로를 늘리세요

/*
 * ════════════════════════════════════════════════════════════════
 *  전시물 배치 — 확장 가이드
 * ════════════════════════════════════════════════════════════════
 *
 *  ▌ 1. 대응 관계
 *    두 배열은 PROJECTS_DATA 와 "같은 인덱스"로 1:1 짝지어집니다.
 *      PROJECTS_DATA[i]  ←→  EXHIBIT_ZS[i] (위치) + SIDES[i] (벽)
 *    따라서 세 배열의 길이는 항상 같아야 합니다.
 *    (EXHIBIT_ZS 가 짧으면 `?? 0` 으로 z=0 에 겹쳐 표시됩니다)
 *
 *  ▌ 2. 좌표계 (위에서 내려다본 평면도)
 *
 *            입구 (z = -GD/2 = -25)  ◀ 플레이어 시작점, +Z 방향을 바라봄
 *        ┌──────────┴──────────┐
 *        │                     │
 *   left │   →  +Z 통로 진행  → │ right
 *   벽   │                     │  벽
 *  x=-8  │                     │ x=+8
 *        └──────────┬──────────┘
 *            출구 (z = +GD/2 = +25)
 *
 *      • Z 값:  음수 = 입구 쪽,  양수 = 출구 쪽   (작을수록 입구에 가까움)
 *      • SIDES: "left"  = 왼쪽 벽 (x = -GW/2 = -8)
 *               "right" = 오른쪽 벽 (x = +GW/2 = +8)
 *        (플레이어가 +Z 를 볼 때의 좌/우 기준 — 직관과 일치)
 *
 *  ▌ 3. EXHIBIT_ZS 값 정하는 공식
 *      N개를 통로 중앙(0) 기준으로 균등 배치:
 *
 *          EXHIBIT_ZS[i] = ( i - (N-1)/2 ) * 간격          (i = 0..N-1)
 *
 *      • 간격(d): 12~14 권장 (전시물이 시원하게 떨어져 보임)
 *      • 예시:
 *          N=3, d=14 →  [-14,  0, 14]                 (← 현재값)
 *          N=4, d=13 →  [-19.5, -6.5, 6.5, 19.5]
 *          N=5, d=12 →  [-24, -12, 0, 12, 24]
 *
 *  ▌ 4. 통로 길이(GD)와의 안전 조건
 *      가장 바깥 전시물이 벽(±GD/2)에 부딪히지 않도록:
 *
 *          GD / 2  ≥  max(|EXHIBIT_ZS|) + 5
 *
 *      • 현재: max=14 → 25 ≥ 19  ✅ (GD=50 으로 충분)
 *      • N=5, max=24 → 29 필요 → GD 를 58~60 으로 키울 것
 *
 *  ▌ 5. SIDES 배치 팁
 *      좌/우 번갈아(L,R,L,R…) 두면 동선이 지그재그가 되어
 *      한쪽 벽만 쓰는 것보다 관람 흐름이 자연스럽습니다.
 *
 *  ▌ 6. 자동 연동되는 것 (직접 안 건드려도 됨)
 *      • 전시물 강조 조명(pointLight): EXHIBIT_ZS/SIDES 를 그대로 따라감
 *      • 전시물 메시·상세 모달: PROJECTS_DATA[i] 내용으로 자동 생성
 *
 *  ──────────────────────────────────────────────────────────────
 *  요약 체크리스트 (프로젝트 1개 추가 시):
 *    □ portfolioData.ts 의 PROJECTS_DATA 에 항목 추가
 *    □ 아래 EXHIBIT_ZS 에 위치 1개 추가 (공식대로 전체 재계산 권장)
 *    □ 아래 SIDES 에 벽 1개 추가 (보통 직전과 반대쪽)
 *    □ max(|z|) + 5 > GD/2 면 위쪽 GD 값도 키우기
 * ════════════════════════════════════════════════════════════════
 */
export const EXHIBIT_ZS = [-14, 0, 14] as const;
export const SIDES: ("left" | "right")[] = ["left", "right", "left"];

// ── 문 치수 ───────────────────────────────────────────────────
const DW = 2.4;   // 문 전체 너비
const DH = 3.5;   // 문 높이
const FT = 0.07;  // 프레임 두께

// ── 갤러리 문 ─────────────────────────────────────────────────
function GalleryDoor({ posZ, facingIn }: { posZ: number; facingIn: boolean }) {
  // facingIn=true → 안쪽(+Z 방향)을 향하는 면이 정면
  const rotY = facingIn ? 0 : Math.PI;
  const frameColor  = "#c8c4bc";
  const panelColor  = "#f2f0eb";
  const handleColor = "#b0a89e";

  return (
    <group position={[0, 0, posZ]} rotation={[0, rotY, 0]}>
      {/* ── 프레임 4면 ── */}
      {/* 상단 */}
      <mesh position={[0, DH + FT / 2, 0.02]}>
        <boxGeometry args={[DW + FT * 2, FT, 0.07]} />
        <meshStandardMaterial color={frameColor} roughness={0.7} />
      </mesh>
      {/* 좌측 */}
      <mesh position={[-(DW / 2 + FT / 2), DH / 2, 0.02]}>
        <boxGeometry args={[FT, DH, 0.07]} />
        <meshStandardMaterial color={frameColor} roughness={0.7} />
      </mesh>
      {/* 우측 */}
      <mesh position={[DW / 2 + FT / 2, DH / 2, 0.02]}>
        <boxGeometry args={[FT, DH, 0.07]} />
        <meshStandardMaterial color={frameColor} roughness={0.7} />
      </mesh>
      {/* 하단 (바닥선) */}
      <mesh position={[0, FT / 4, 0.02]}>
        <boxGeometry args={[DW + FT * 2, FT / 2, 0.07]} />
        <meshStandardMaterial color={frameColor} roughness={0.7} />
      </mesh>

      {/* ── 문 패널 (좌/우) ── */}
      <mesh position={[-DW / 4, DH / 2, 0.016]}>
        <boxGeometry args={[DW / 2 - 0.02, DH - 0.04, 0.045]} />
        <meshStandardMaterial color={panelColor} roughness={0.82} />
      </mesh>
      <mesh position={[DW / 4, DH / 2, 0.016]}>
        <boxGeometry args={[DW / 2 - 0.02, DH - 0.04, 0.045]} />
        <meshStandardMaterial color={panelColor} roughness={0.82} />
      </mesh>

      {/* ── 문 패널 내부 몰딩 (좌) ── */}
      <mesh position={[-DW / 4, DH / 2, 0.042]}>
        <boxGeometry args={[DW / 2 - 0.16, DH - 0.32, 0.01]} />
        <meshStandardMaterial color={frameColor} roughness={0.8} />
      </mesh>
      {/* 우 */}
      <mesh position={[DW / 4, DH / 2, 0.042]}>
        <boxGeometry args={[DW / 2 - 0.16, DH - 0.32, 0.01]} />
        <meshStandardMaterial color={frameColor} roughness={0.8} />
      </mesh>

      {/* ── 손잡이 (좌/우) ── */}
      {([-0.18, 0.18] as number[]).map((x, i) => (
        <group key={i} position={[x, DH / 2, 0.06]}>
          {/* 손잡이 봉 */}
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.018, 0.018, 0.10, 10]} />
            <meshStandardMaterial color={handleColor} metalness={0.55} roughness={0.3} />
          </mesh>
          {/* 받침 플레이트 */}
          <mesh position={[0, 0, -0.02]}>
            <boxGeometry args={[0.06, 0.20, 0.012]} />
            <meshStandardMaterial color={handleColor} metalness={0.4} roughness={0.4} />
          </mesh>
        </group>
      ))}

      {/* ── 상단 채광창 ── */}
      <mesh position={[0, DH + 0.38, 0.016]}>
        <planeGeometry args={[DW - 0.1, 0.60]} />
        <meshStandardMaterial
          color="#d8eaf8"
          transparent
          opacity={0.55}
          roughness={0.08}
          metalness={0.2}
          side={THREE.DoubleSide}
        />
      </mesh>
      {/* 채광창 프레임 */}
      <mesh position={[0, DH + 0.38, 0.018]}>
        <boxGeometry args={[DW + FT * 2, 0.64, 0.04]} />
        <meshStandardMaterial color={frameColor} roughness={0.7} />
      </mesh>
      {/* 채광창 중간 기둥 */}
      <mesh position={[0, DH + 0.38, 0.03]}>
        <boxGeometry args={[FT * 0.6, 0.60, 0.05]} />
        <meshStandardMaterial color={frameColor} roughness={0.7} />
      </mesh>
      <mesh position={[0, DH + 0.38, 0.016]}>
        <planeGeometry args={[DW - 0.1, 0.60]} />
        <meshStandardMaterial
          color="#d8eaf8"
          transparent
          opacity={0.55}
          roughness={0.08}
          metalness={0.2}
          side={THREE.DoubleSide}
        />
      </mesh>
    </group>
  );
}

// ── 갤러리 룸 ─────────────────────────────────────────────────
export default function GalleryRoom() {
  return (
    <group>
      {/* ── 바닥 ── */}
      <mesh rotation-x={-Math.PI / 2} receiveShadow>
        <planeGeometry args={[GW, GD]} />
        <meshStandardMaterial color="#eeece8" roughness={0.35} metalness={0.04} />
      </mesh>

      {/* ── 천장 ── */}
      <mesh position={[0, GH, 0]} rotation-x={Math.PI / 2}>
        <planeGeometry args={[GW, GD]} />
        <meshStandardMaterial color="#ffffff" roughness={0.9} />
      </mesh>

      {/* ── 왼쪽 벽 ── */}
      <mesh position={[-GW / 2, GH / 2, 0]} rotation-y={Math.PI / 2}>
        <planeGeometry args={[GD, GH]} />
        <meshStandardMaterial color="#f7f5f1" roughness={0.88} />
      </mesh>

      {/* ── 오른쪽 벽 ── */}
      <mesh position={[GW / 2, GH / 2, 0]} rotation-y={-Math.PI / 2}>
        <planeGeometry args={[GD, GH]} />
        <meshStandardMaterial color="#f7f5f1" roughness={0.88} />
      </mesh>

      {/* ── 입구 벽 (z=-GD/2, 안쪽(+Z)이 정면) ── */}
      <mesh position={[0, GH / 2, -GD / 2]}>
        <planeGeometry args={[GW, GH]} />
        <meshStandardMaterial color="#f5f3ef" roughness={0.88} side={THREE.DoubleSide} />
      </mesh>

      {/* ── 출구 벽 (z=+GD/2, 안쪽(-Z)이 정면) ── */}
      <mesh position={[0, GH / 2, GD / 2]} rotation-y={Math.PI}>
        <planeGeometry args={[GW, GH]} />
        <meshStandardMaterial color="#f5f3ef" roughness={0.88} side={THREE.DoubleSide} />
      </mesh>

      {/* ── 걸레받이 ── */}
      <mesh position={[-GW / 2 + 0.05, 0.12, 0]} rotation-y={Math.PI / 2}>
        <planeGeometry args={[GD, 0.22]} />
        <meshStandardMaterial color="#dedad4" roughness={0.7} />
      </mesh>
      <mesh position={[GW / 2 - 0.05, 0.12, 0]} rotation-y={-Math.PI / 2}>
        <planeGeometry args={[GD, 0.22]} />
        <meshStandardMaterial color="#dedad4" roughness={0.7} />
      </mesh>

      {/* ── 문 ── */}
      <GalleryDoor posZ={-GD / 2 + 0.01} facingIn />
      <GalleryDoor posZ={GD / 2 - 0.01}  facingIn={false} />

      {/* ── 베이스 조명 (밝기 보강) ── */}
      <ambientLight intensity={1.75} color="#fff8f0" />
      <directionalLight position={[0, GH - 0.5, 0]} intensity={1.05} color="#fff6ec" />

      {/* ── 전시물 강조 — 전시물 있는 벽쪽만 1개씩 (6→3) ── */}
      {EXHIBIT_ZS.map((z, i) => {
        const x = SIDES[i] === "left" ? -GW / 2 + 2 : GW / 2 - 2;
        return (
          <pointLight
            key={i}
            position={[x, GH - 0.4, z]}
            intensity={26}
            distance={12}
            color="#fff5e8"
            castShadow={false}
          />
        );
      })}

      {/* ── 천장 다운라이트 (발광면 — 실제 광원 아님, 비용 0) ── */}
      {([-20, -12, -4, 4, 12, 20] as number[]).map((z, i) => (
        <mesh key={i} position={[0, GH - 0.03, z]} rotation-x={Math.PI / 2}>
          <circleGeometry args={[0.55, 20]} />
          <meshBasicMaterial color="#fff6ea" />
        </mesh>
      ))}
    </group>
  );
}
