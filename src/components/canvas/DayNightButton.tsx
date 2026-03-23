"use client";

import { useDayNight } from "./DayNightContext";

// 오버레이 제거 — 전환 연출은 100% 3D 씬 내부에서 처리
// (fog 전환 + 조명 lerp + bloom)
export default function DayNightTransition() {
  const { mode } = useDayNight();

  return (
    <div
      style={{
        position:      "fixed",
        bottom:        "1.2rem",
        right:         "1.2rem",
        zIndex:        40,
        fontSize:      "11px",
        color:         mode === "day"
          ? "rgba(90,60,30,0.40)"
          : "rgba(200,180,120,0.40)",
        transition:    "color 2s ease",
        userSelect:    "none",
        pointerEvents: "none",
        letterSpacing: "0.03em",
      }}
    >
    </div>
  );
}