/**
 * performance.ts
 *
 * AA 전략: EffectComposer 없이 WebGL 기본 MSAA 사용
 *
 *  antialias: true  → WebGL 드라이버 레벨 MSAA 활성화
 *                     EffectComposer가 없으면 이게 제대로 작동함
 *
 *  dpr 상향         → 픽셀 밀도로 추가 보완
 *                     고사양: devicePixelRatio 최대 2.0까지
 *                     저사양: 1.0 고정
 *
 *  shadows="soft"   → PCF soft shadow — 그림자 경계 부드럽게
 */

function isLowEndDevice(): boolean {
  if (typeof navigator === "undefined") return false;
  return (navigator.hardwareConcurrency ?? 4) <= 4;
}

const LOW_END = isLowEndDevice();

export const CANVAS_PERF = {
  // EffectComposer 제거 → antialias: true 활성화
  // WebGL MSAA + dpr 조합으로 계단현상 제거
  dpr: [1, LOW_END ? 1 : 2] as [number, number],

  gl: {
    antialias:       !LOW_END,  // 고사양: WebGL MSAA 풀 활성화
    powerPreference: "high-performance" as const,
    stencil:         false,
    depth:           true,
  },
} as const;

export const ENV_PERF = {
  preset:     "sunset" as const,
  background: false,
  blur:       0.5,
  resolution: LOW_END ? 64 : 128,
} as const;

export const FRAMELOOP_ALWAYS = "always" as const;
export const FRAMELOOP_DEMAND = "demand" as const;