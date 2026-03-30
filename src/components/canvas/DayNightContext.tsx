"use client";

import { createContext, useContext, useState, useCallback } from "react";

// ── 낮/밤 조명 프리셋 ─────────────────────────────────────
// DayNightContext.tsx 수정
export const PRESETS = {
  day: {
    ambientColor:     "#D0E0FF", // 차가운 겨울 조명
    ambientIntensity: 0.5,       // 눈 반사를 고려해 상향
    dirColor:         "#FFFAD0", 
    dirIntensity:     2.5,
    pointColor:       "#FF9944",
    pointIntensity:   1.8,
  },
  night: {
    ambientColor:     "#1A1A30", // 푸른빛이 도는 밤
    ambientIntensity: 0.4,       // 0.1에서 0.4로 상향 (이게 핵심!)
    dirColor:         "#405090", 
    dirIntensity:     0.8,       // 달빛 강도 강화
    pointColor:       "#FFD580",
    pointIntensity:   4.5,       // 밤에 모닥불이 더 밝게 보이도록
  },
} as const;

export type Mode = "day" | "night";

interface DayNightCtx {
  mode:            Mode;
  toggle:          () => void;
  isTransitioning: boolean;
}

const DayNightContext = createContext<DayNightCtx>({
  mode:            "day",
  toggle:          () => {},
  isTransitioning: false,
});

export function useDayNight() {
  return useContext(DayNightContext);
}

export function DayNightProvider({ children }: { children: React.ReactNode }) {
  const [mode, setMode] = useState<Mode>("day");

  const toggle = useCallback(() => {
    setMode(prev => prev === "day" ? "night" : "day");
  }, []);

  return (
    <DayNightContext.Provider value={{ mode, toggle, isTransitioning: false }}>
      {children}
    </DayNightContext.Provider>
  );
}