/**
 * layout.ts — 씬 전체 수치 단일 관리 파일
 *
 * ┌──────────────────────────────────────────────────────┐
 * │  이 파일 하나만 수정하면 씬의 모든 요소가 바뀝니다          │
 * └──────────────────────────────────────────────────────┘
 *
 * 좌표계:
 * X축: 왼쪽(-) ↔ 오른쪽(+)
 * Y축: 아래(-) ↔ 위(+)
 * Z축: 뒤(-)  ↔ 앞(+)
 *
 * 방 기준 (6×6×5.5):
 * 왼쪽 벽: x = -3   오른쪽: x = +3
 * 뒷벽:   z = -3   앞쪽:   z = +3
 * 바닥:   y =  0   천장:   y = 5.5
 * 벽 내부 가동 한계: INNER = ±2.85 (WALL_HALF - wallThickness/2)
 */

import { WALL_HALF } from "./constants";

const INNER = 2.85; // 벽 두께(0.25) 제외 실내 한계선

// ═══════════════════════════════════════════════════════
//  카메라
// ═══════════════════════════════════════════════════════
export const CAMERA = {
  start:    [0, 6, 220]  as [number, number, number],  // 워프 시작 (멀리)
  target:   [10, 11, 10] as [number, number, number],  // 워프 도착
  lookAt:   [0, 1.8, 0]  as [number, number, number],  // 바라보는 중심
  fov:      34,                                         // 도착 FOV
  fovStart: 90,                                        // 시작 FOV (워프 강조)
} as const;

// ═══════════════════════════════════════════════════════
//  OrbitControls
// ═══════════════════════════════════════════════════════
export const ORBIT = {
  minPolarAngle:   Math.PI / 4,
  maxPolarAngle:   Math.PI / 2.4,
  minAzimuthAngle: 0,
  maxAzimuthAngle: Math.PI / 2,
  minDistance:     0.1, // 확대 제한은 유지 (원치 않으시면 이 부분도 수정 가능합니다)
  maxDistance:     20,
  panMin: [-1.2, 0.5, -1.2] as [number, number, number],
  panMax: [ 1.2, 3.5,  1.2] as [number, number, number],
} as const;

// ═══════════════════════════════════════════════════════
//  조명
// ═══════════════════════════════════════════════════════
export const LIGHTS = {
  dirPos:    [60, 45, 55] as [number, number, number],
  pointPos:  [1.5, 3.5, -3.5] as [number, number, number],
  pointDist: 15,
} as const;

// ═══════════════════════════════════════════════════════
//  가구 월드 좌표 (POS)
// ═══════════════════════════════════════════════════════
export const POS = {

  // ── 책상 ──────────────────────────────────────────────
  desk:       [-1.85, 0,    -1.39] as [number, number, number],

  // ── 침대 ──────────────────────────────────────────────
  bed:        [ 1.65, 0,    -0.75] as [number, number, number],

  // ── 협탁 ──────────────────────────────────────────────
  nightstand: [ 0.15, 0,    -2.60] as [number, number, number],

  // ── 서랍장 ────────────────────────────────────────────
  drawer:     [-2.25, 0,     0.65] as [number, number, number],

  // ── 무드등 (서랍장 위) ────────────────────────────────
  deskLamp:   [-2.25, 1.60,  0.65] as [number, number, number],

  // ── 냉장고 ────────────────────────────────────────────
  fridge:     [-2.25, 0,     1.90] as [number, number, number],

  // ── 쓰레기통 ──────────────────────────────────────────
  trashcan:   [-1.30, 0,     0.10] as [number, number, number],

  // ── 고양이 밥그릇 ─────────────────────────────────────
  catBowls:   [-2.25, 0,     2.65] as [number, number, number],

  // ── 햇빛 고양이 ───────────────────────────────────────
  sunCat:     [-0.30, 0,     1.50] as [number, number, number],

  // ── 러그 ──────────────────────────────────────────────
  rug:        [ 2.20, 0.005,  2.10] as [number, number, number],

  // ── 시계 (BackWall 로컬) ──────────────────────────────
  clock:      [-1.60, 3.80,  -INNER + 0.02] as [number, number, number],

  // ── 게시판 (LeftWall 로컬) ────────────────────────────
  noticeboard: [-INNER + 0.02, 3.10, -0.40] as [number, number, number],

  // ── 선반 그룹 기준점 (LeftWall 기준 z) ───────────────
  shelfGroup:  1.40,   // z 오프셋 (number only, LeftWall 기준)

  // ── 위 선반 y ──────────────────────────────────────────
  shelfUpperY: 3.55,

  // ── 아래 선반 y ────────────────────────────────────────
  shelfLowerY: 2.55,

} as const;

// ═══════════════════════════════════════════════════════
//  가구·오브젝트 크기 (SIZE)
// ═══════════════════════════════════════════════════════
export const SIZE = {

  // ── 책상 본체 ─────────────────────────────────────────
  //  좌표계 (책상 로컬 = AnimatedWrapper 내부)
  //    X: 왼쪽(-) ↔ 오른쪽(+)
  //    Z: 뒤(-)   ↔ 앞(+)
  //
  //  POS.desk = [-1.85, 0, -1.39] (방의 왼쪽 뒤 코너)
  //  카메라: [10,11,10] → lookAt [0,1.8,0]
  //  → 카메라는 방을 +X/+Z 대각선에서 바라봄
  //  → 모니터 화면(정면)은 +X 방향을 향해야 카메라에 보임
  //  → 책상은 왼쪽 벽(-X 벽) 앞에 있고, 모니터는 책상의 -Z쪽(뒤)에 붙어 +X를 향함
  //  → 의자는 +Z쪽(앞)에서 책상을 향해 앉음
  desk: {
    topW: 2.72,   // 상판 가로 (X축) - 수정됨
    topH: 0.10,   // 상판 두께
    topD: 1.50,   // 상판 깊이 (Z축) - 수정됨
    legH: 1.30,   // 다리 높이
    legW: 0.10,   // 다리 굵기
  },

  // ── 모니터 ────────────────────────────────────────────
  //  화면이 +X 방향을 향함 (카메라 쪽)
  //  frameX = 두께(X, 카메라 방향)
  //  frameH = 높이(Y)
  //  frameZ = 너비(Z, 책상 깊이 방향으로 퍼짐)
  //  모니터는 책상 상판의 -Z쪽(뒤) 중앙에 배치
  monitor: {
    frameX:  1.44,   // 화면 너비 (X) - 수정됨
    frameH:  0.63,   // 화면 높이 - 수정됨
    frameZ:  0.06,   // 프레임 두께 (Z)
    standH:  0.26,   // 스탠드 기둥 높이
    standW:  0.05,   // 스탠드 기둥 굵기
    baseZ:   0.26,   // 스탠드 받침 길이 (Z)
    offsetX:  0.00,  // 책상 중심 기준 X (중앙)
    offsetZ: -0.30,  // 책상 중심 기준 Z (수정됨)
    riseY:   0.03,   // 스탠드 위 화면 중심까지 추가 높이 - 수정됨
  },

  // ── PC 본체 (책상 상판 위, 모니터 옆) ────────────────
  //  모니터 오른쪽(+Z 방향, 책상 뒤 모서리)에 나란히 세워둠
  //  아크릴 패널이 +X(카메라 방향)을 향함
  //  X = 두께(카메라 방향), Y = 높이, Z = 폭
  pc: {
    sizeX:   0.37,   // 케이스 두께 (X) - 수정됨
    sizeY:   0.85,   // 케이스 높이 - 수정됨
    sizeZ:   0.90,   // 케이스 폭 (Z) - 수정됨
    offsetX:  1.10,  // 책상 중심 기준 X - 수정됨
    offsetZ: -0.10,  // 책상 중심 기준 Z - 수정됨
  },

  // ── 키보드 ────────────────────────────────────────────
  //  책상 앞쪽(+Z) 중앙에 배치
  //  sizeX = 두께(X 방향으로 얇음), sizeZ = 너비(Z 방향으로 넓음)
  keyboard: {
    sizeX:  0.68,   // 너비 (X) - 수정됨
    sizeY:  0.018,  // 높이
    sizeZ:  0.30,   // 깊이 (Z) - 수정됨
    offsetX:  0.00, // 중앙
    offsetZ:  0.25, // 앞쪽
  },

  // ── 마우스패드 ────────────────────────────────────────
  mousepad: {
    sizeX:  0.34,   // 너비 (X) - 수정됨
    sizeY:  0.005,  // 높이
    sizeZ:  0.25,   // 깊이 (Z) - 수정됨
    offsetX: 0.60,  // 키보드 오른쪽 (+X)
    offsetZ: 0.25,  // 앞쪽
  },

  // ── 마우스 ────────────────────────────────────────────
  mouse: {
    r:       0.026, // capsule 반지름
    len:     0.065, // capsule 길이
    offsetX: 0.60,  // 마우스패드 위
    offsetZ: 0.25,  // 앞쪽
  },

  // ── 의자 ──────────────────────────────────────────────
  //  책상 앞(+Z)에 배치, 등받이가 +Z를 향함 (앉으면 -X 방향 = 모니터를 봄)
  chair: {
    seatW:   0.65,   // 시트 가로 (X)
    seatD:   0.65,   // 시트 깊이 (Z)
    seatH:   0.08,   // 시트 두께
    seatY:   0.56,   // 바닥에서 시트 윗면까지
    poleH:   0.56,   // 기둥 높이
    poleR:   0.035,  // 기둥 반지름
    legLen:  0.40,   // 방사형 다리 길이
    wheelR:  0.036,  // 바퀴 반지름
    backW:   0.06,   // 등받이 두께
    backH:   0.72,   // 등받이 높이
    backD:   0.58,   // 등받이 너비
    backOffX:  0.00, // 등받이 X 오프셋
    backOffY:  0.42, // 등받이 Y 오프셋 (시트 윗면 기준)
    armR:    0.022,  // 팔걸이 기둥 반지름
    armH:    0.24,   // 팔걸이 높이
    armLen:  0.22,   // 팔걸이 길이 (Z)
    offsetX:  0.00,  // 책상 중심 기준 X
    offsetZ:  1.20,  // 책상 앞에서 약간 당겨진 위치 - 수정됨
  },

  // ── 침대 ──────────────────────────────────────────────
  bed: {
    frameW: 2.50,   // 프레임 가로
    frameD: 3.90,   // 프레임 깊이
    frameH: 0.40,   // 프레임 높이
    mattH:  0.28,   // 매트리스 두께
    pillowW: 1.20,  // 베개 가로
    pillowH: 0.16,  // 베개 두께
    pillowD: 0.64,  // 베개 깊이
    blanketH: 0.08, // 이불 두께
    blanketRatioD: 0.68, // 이불 깊이 비율 (frameD * 이 값)
    catOffsetX: 0.16,    // 침대 위 고양이 X 오프셋
    catOffsetZ: 0.24,    // 침대 위 고양이 Z 오프셋
  },

  // ── 턱시도 고양이 (침대 위) ───────────────────────────
  tuxedoCat: {
    LW: 0.44, LH: 0.16, LD: 0.38,  // 하체
    BW: 0.38, BH: 0.22, BD: 0.32,  // 몸통
    HW: 0.34, HH: 0.32, HD: 0.30,  // 머리
  },

  // ── 햇빛 고양이 (바닥) ────────────────────────────────
  sunCat: {
    LW: 0.40, LH: 0.14, LD: 0.34,  // 하체
    BW: 0.34, BH: 0.20, BD: 0.28,  // 몸통
    HW: 0.30, HH: 0.28, HD: 0.26,  // 머리
    rotation: 0.50,                  // Y축 회전값 (rad)
  },

  // ── 서랍장 ────────────────────────────────────────────
  drawer: {
    w: 1.20,
    h: 1.60,
    d: 1.20,
  },

  // ── 냉장고 ────────────────────────────────────────────
  fridge: {
    w:     1.20,
    h:     1.80,
    d:     1.10,
    wallT: 0.055,
    // 내부 선반 Y 위치
    shelfYs:  [0.22, 0.62, 1.02] as number[],
    // 캔 배열
    canR:     0.052,  // 캔 반지름
    canH:     0.22,   // 캔 높이
    canZs:    [-0.26, 0, 0.26] as number[],   // 가로 3열
    canXs:    [-0.18, 0.18]    as number[],   // 깊이 2줄
  },

  // ── 협탁 ──────────────────────────────────────────────
  nightstand: {
    w: 0.55,
    h: 0.52,
    d: 0.45,
    standOffsetX:  0.08,   // 스탠드 X 오프셋
    standOffsetY:  0.032,  // 스탠드 Y 오프셋 (상판 위)
    standOffsetZ:  0.04,   // 스탠드 Z 오프셋
  },

  // ── 협탁 스탠드 조명 ──────────────────────────────────
  standLight: {
    poleH:   0.55,   // 기둥 높이
    armH:    0.12,   // 갓까지 팔 높이
    shadeR:  0.14,   // 갓 반지름
    shadeH:  0.18,   // 갓 높이
    baseR:   0.08,   // 받침 반지름
    baseH:   0.03,   // 받침 높이
    poleR:   0.012,  // 기둥 반지름
  },

  // ── 쓰레기통 ──────────────────────────────────────────
  trashcan: {
    w: 0.22,
    h: 0.40,
    d: 0.20,
  },

  // ── 무드등 ────────────────────────────────────────────
  deskLamp: {
    legW:    0.05,   // 다리 굵기
    legD:    0.20,   // 다리 길이
    baseD:   0.26,   // 바닥 가로대 길이
    topD:    0.19,   // 상단 가로대 길이
    sphereR: 0.175,  // 구 반지름
    sphereY: 0.24,   // 구 Y 높이
    glowY:   0.42,   // 발광 포인트 Y
    glowDist: 5.0,   // 발광 거리
  },

  // ── 러그 ──────────────────────────────────────────────
  rug: {
    w:        1.20,
    h:        0.08,
    d:        1.50,
    fontSize: 0.28,
  },

  // ── 시계 ──────────────────────────────────────────────
  clock: {
    radius: 0.45,   // 시계 반지름
    faceZ:  0.05,   // 다이얼 Z 오프셋
  },

  // ── 아이콘 액자 ───────────────────────────────────────
  icon: {
    size:    0.46,   // 액자 한 변 크기
    gap:     0.68,   // 액자 간격 (Z축)
    lean:    0.30,   // 기울기 (rad)
    half:    0.23,   // 기울기 중심 거리
  },

  // ── 선반 ──────────────────────────────────────────────
  shelf: {
    w:      0.43,   // 선반판 가로 (X, 벽 두께방향)
    h:      0.05,   // 선반판 두께
    d:      1.95,   // 선반판 깊이 (Z)
    xOff:   0.215,  // 벽에서 선반 중심까지 X 오프셋
  },

  // ── 게시판 ────────────────────────────────────────────
  noticeboard: {
    w:      1.75,   // 가로
    h:      1.25,   // 높이
    d:      0.04,   // 두께
    corkW:  1.58,   // 코르크 가로
    corkH:  1.10,   // 코르크 높이
  },

  // ── 선반 소품 ─────────────────────────────────────────
  shelfProps: {
    potR:      0.055,   // 화분 상단 반지름
    potRBot:   0.040,   // 화분 하단 반지름
    potH:      0.11,    // 화분 높이
    plantR:    0.064,   // 식물 반지름
    bookW:     0.048,   // 책 두께
    bookH:     0.176,   // 책 높이
    potZ:     -0.44,    // 화분 Z 위치 (선반 기준)
    bookRedZ:  0.26,    // 빨간 책 Z
    bookBlueZ: 0.40,    // 파란 책 Z
    bookY:     0.11,    // 책 Y (선반 위)
  },

  // ── 고양이 밥그릇 ─────────────────────────────────────
  catBowl: {
    foodW:   0.18,   // 밥그릇 가로·깊이
    foodH:   0.04,   // 밥그릇 높이
    waterW:  0.14,   // 물그릇 가로·깊이
    waterH:  0.06,   // 물그릇 높이
    matW:    0.55,   // 매트 가로
    matH:    0.015,  // 매트 두께
    matD:    0.28,   // 매트 깊이
    spacing: 0.14,   // 두 그릇 사이 간격 (중심 기준)
  },

} as const;

// ═══════════════════════════════════════════════════════
//  회전값 (ROT) — 반복 사용되는 회전 상수
// ═══════════════════════════════════════════════════════
export const ROT = {
  nightstand: [0, -Math.PI / 2, 0] as [number, number, number],  // 협탁
  wallClock:  [0,  0,           0] as [number, number, number],  // 시계
  sunCat:     [0,  0.5,         0] as [number, number, number],  // 햇빛 고양이
} as const;

// ═══════════════════════════════════════════════════════
//  표지판 (SIZE.sign)
// ═══════════════════════════════════════════════════════
// layout.ts 하단에 추가 — SIZE 블록 밖에 별도 export로 분리
export const SIGN = {
  w:         1.40,   // 표지판 가로
  h:         0.32,   // 표지판 높이
  d:         0.05,   // 표지판 두께
  rodOffset: 0.22,   // 걸이봉 Y 오프셋 (H/2 + 이 값)
  chainXRatio: 0.32, // 사슬 X 위치 비율 (W * 이 값)
  chainStep:  0.06,  // 사슬 링 간격
  gap:        0.48,  // 표지판 간 수직 간격
} as const;

// ═══════════════════════════════════════════════════════
//  포그 프리셋 (FOG)
// ═══════════════════════════════════════════════════════
export const FOG = {
  day:   { near: 26, far: 72 },
  night: { near: 16, far: 46 },
} as const;

// ═══════════════════════════════════════════════════════
//  행성 설정 (PLANETS)
// ═══════════════════════════════════════════════════════
export interface PlanetConfig {
  orbitRadius: number;
  orbitY:      number;
  orbitSpeed:  number;
  spinSpeed:   number;
  initAngle:   number;
  radius:      number;
  color:       string;
  hasRing:     boolean;
  ringColor?:  string;
  ringTilt?:   number;
}

export const PLANETS: PlanetConfig[] = [
  // 토성 느낌 — 고리 있는 갈색
  { orbitRadius: 11, orbitY:  5.5, orbitSpeed: 0.18, spinSpeed: 0.50,
    initAngle: 0,                  radius: 0.55, color: "#9B8060",
    hasRing: true,  ringColor: "#C4A882", ringTilt: Math.PI / 2.2 },
  // 파란 얼음 행성
  { orbitRadius: 14, orbitY:  7.0, orbitSpeed: 0.11, spinSpeed: 0.30,
    initAngle: Math.PI * 0.35,    radius: 0.40, color: "#4A7AAA",
    hasRing: true,  ringColor: "#88AACC", ringTilt: Math.PI / 2.4 },
  // 붉은 사막 행성
  { orbitRadius:  9, orbitY:  4.0, orbitSpeed: 0.27, spinSpeed: 0.70,
    initAngle: Math.PI * 0.70,    radius: 0.30, color: "#AA5533",
    hasRing: true,  ringColor: "#CC8866", ringTilt: Math.PI / 1.6 },
  // 보라 가스 행성
  { orbitRadius: 16, orbitY:  6.0, orbitSpeed: 0.07, spinSpeed: 0.25,
    initAngle: Math.PI * 1.05,    radius: 0.65, color: "#6A5080",
    hasRing: true,  ringColor: "#9A80BB", ringTilt: Math.PI / 1.8 },
  // 초록 이끼 행성
  { orbitRadius: 12, orbitY:  8.5, orbitSpeed: 0.22, spinSpeed: 0.45,
    initAngle: Math.PI * 1.40,    radius: 0.35, color: "#4A7A55",
    hasRing: false },
  // 황금 사막 — 고리 있는
  { orbitRadius: 18, orbitY:  3.5, orbitSpeed: 0.05, spinSpeed: 0.20,
    initAngle: Math.PI * 1.75,    radius: 0.50, color: "#C4922A",
    hasRing: true,  ringColor: "#E0B860", ringTilt: Math.PI / 2.6 },
  // 청록 수증기 행성
  { orbitRadius:  8, orbitY:  9.5, orbitSpeed: 0.45, spinSpeed: 0.80,
    initAngle: Math.PI * 0.20,    radius: 0.25, color: "#3A9A8A",
    hasRing: true,  ringColor: "#60C4B4", ringTilt: Math.PI / 2.0 },
  // 분홍 구름 행성
  { orbitRadius: 13, orbitY:  2.5, orbitSpeed: 0.14, spinSpeed: 0.40,
    initAngle: Math.PI * 0.55,    radius: 0.38, color: "#C47090",
    hasRing: false },
  // 은빛 얼음 — 고리 있는
  { orbitRadius: 20, orbitY:  8.0, orbitSpeed: 0.04, spinSpeed: 0.15,
    initAngle: Math.PI * 0.90,    radius: 0.70, color: "#A0B8CC",
    hasRing: true,  ringColor: "#D0E4F0", ringTilt: Math.PI / 2.0 },
  // 자주 용암 행성
  { orbitRadius: 10, orbitY: 11.0, orbitSpeed: 0.33, spinSpeed: 0.60,
    initAngle: Math.PI * 1.25,    radius: 0.28, color: "#883030",
    hasRing: true,  ringColor: "#CC5544", ringTilt: Math.PI / 1.4 },
];

// ═══════════════════════════════════════════════════════
//  우주 배경 (SPACE)
// ═══════════════════════════════════════════════════════
export const SPACE = {
  starCount:   3000,         // 별 개수
  starMinDist: 25,           // 별 최소 거리
  starMaxDist: 60,           // 별 최대 거리 (min + 이 값)
  starMinSize: 0.02,         // 별 최소 크기
  starMaxSize: 0.12,         // 별 최대 크기
  skyboxR:     120,          // 스카이박스 반경
  sunPos:      [60, 45, 55] as [number, number, number], // 태양 위치
  sunDist:     200,          // 태양 광원 거리
} as const;