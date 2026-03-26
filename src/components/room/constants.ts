// ─────────────────────────────────────────────
//  Room 전체에서 공유하는 상수
//  좌표·크기·색상을 한 곳에서 관리해
//  하나 바꿔도 연쇄 오차가 생기지 않도록 합니다.
// ─────────────────────────────────────────────

// ── 방 구조 ──────────────────────────────────
export const ROOM = {
  size:           6,      // 가로·깊이 (8 → 6)
  height:         5.5,    // 천장 높이 (7 → 5.5)
  wallThickness:  0.25,
  floorThickness: 0.4,
} as const;

// 자주 쓰는 파생값 (함수보다 상수가 더 예측 가능)
export const WALL_HALF  = ROOM.size / 2;                          //  3
export const WALL_LEFT  = -WALL_HALF + ROOM.wallThickness / 2;   // -2.875
export const WALL_BACK  = -WALL_HALF + ROOM.wallThickness / 2;   // -2.875

// ── 창문 ─────────────────────────────────────
export const WIN = {
  w:  1.8,   // 2.5 → 1.8
  h:  2.6,   // 3.5 → 2.6
  x:  0.9,   // 뒷벽 기준 X 오프셋
  y:  2.8,   // 높이 중심
} as const;

// ── 색상 팔레트 — 미드톤 브라운/웜베이지 단색계열 ───
//  5단계 명도 체계: #EDE0C8 → #C4A882 → #9C7B5A → #6B4C2E → #3A2510
//  색상은 브라운 단일계열, 명도차로만 공간감을 만듭니다.
export const COLOR = {
  // ── 공간 구조 (밝음 → 어두움) ──────────────────
  bg:           "#EDE0C8",   // 1단계 — 크림 베이지 (배경)
  wall:         "#F5EFE6",   // 오프화이트 — 따뜻한 흰색 (벽)
  floor:        "#6B4C2E",   // 4단계 — 딥 월넛 (바닥)
  moulding:     "#9C7B5A",   // 3단계 — 미드 탄 (몰딩)
  windowFrame:  "#9C7B5A",   // 3단계 — 미드 탄 (창문 프레임)

  // ── 가구 — 재질별 개별 색상 ───────────────────
  woodLight:    "#7C5C3A",   // 책상 — 미디엄 월넛
  woodMid:      "#8B6A4A",   // 선반 — 탠 우드
  woodDark:     "#6B4C2E",   // 4단계 — 딥 월넛 (바닥 포인트용)
  woodChair:    "#D4C4A8",   // 서랍장 — 페일 오크

  // ── 가구 — 다크 계열 ───────────────────────────
  darkBody:     "#2C1F14",   // 의자 — 에보니
  darkMid:      "#3A2A1C",   // 사이값
  darkDeep:     "#1E1410",   // 가장 어두운 포인트

  // ── 침구 ───────────────────────────────────────
  bedFrame:     "#A0785A",   // 침대 프레임 — 코퍼 브라운
  mattress:     "#C8B090",   // 매트리스 — 살짝 진한 웜 베이지
  pillow:       "#D8C8A8",   // 베개 — 매트리스보다 살짝 밝게
  blanket:      "#8C7B6A",   // 이불 — 그레이지

  // ── 고양이 ─────────────────────────────────────
  catBlack:  "#1A1A1A",   // 순수 검정에 가깝게
  catWhite:  "#F5F5F5",   // 순수 흰색에 가깝게
  catNose:   "#FFB6C1",   // 핑크 코
  catEye:    "#F5F5F5",   // 초록 눈 (턱시도 고양이 특유)

  // ── 소품 ───────────────────────────────────────
  rug:          "#8B4A3A",   // 러그 — 테라코타
  plant:        "#6A8A58",   // 식물 — 올리브 그린
  pot:          "#9C7B5A",   // 화분 — 미드 탄
  bookRed:      "#A04838",   // 책 — 번트 레드
  bookBlue:     "#4A6880",   // 책 — 스틸 블루
  curtain:      "#E8D8B8",   // 커튼 — 리넨
  curtainFold:  "#D4C4A0",   // 커튼 주름 — 리넨 쉐도우
  drawerBody:   "#D4C4A8",   // 서랍장 — 페일 오크
  drawerHandle: "#6B4C2E",   // 손잡이 — 딥 월넛
  fridgeBody:   "#B8C4B0",   // 냉장고 — 세이지 그레이
  fridgeHandle: "#8A9882",   // 냉장고 손잡이 — 딥 세이지
  catFrames:    "#6B4C2E",   // 액자 프레임 — 딥 월넛
  corkboard:    "#C4A882",   // 코르크 — 웜 샌드

  // ── PC (블루 RGB는 단색계열 내 유일한 포인트) ───
  pcBody:       "#3A2510",   // 5단계
  pcRgb:        "#60A5FA",   // 블루 포인트 유지
  screenBlue:   "#1A2A3A",
  screenGreen:  "#1A2A1A",
  textBlue:     "#7EC8F8",
  textGreen:    "#6AE898",
} as const;

// ── 애니메이션 딜레이 (초) ────────────────────
export const DELAY = {
  floor:        0,
  rug:          0.4,
  wallLeft:     0.2,
  wallBack:     0.3,
  desk:         0.5,
  bed:          0.7,
  catFrames:    0.8,
  shelfLower:   1.1,
  shelfUpper:   1.0,
  drawer:       1.1,
  fridge:       1.2,
  clock:        1.4,
  curtainL:     1.5,
  curtainR:     1.6,
  iconBase:     1.2,   // 아이콘 액자: base + i * 0.1
} as const;