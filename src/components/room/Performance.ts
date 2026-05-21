/**
 * Performance.ts
 */

function isLowEndDevice(): boolean {
  if (typeof navigator === "undefined") return false;
  return (navigator.hardwareConcurrency ?? 4) <= 4;
}

const LOW_END = isLowEndDevice();
export const LOW_END_DEVICE = LOW_END;

export const CANVAS_PERF = {
  dpr: [1, LOW_END ? 1 : 2] as [number, number],
  gl: {
    antialias:       !LOW_END,
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
