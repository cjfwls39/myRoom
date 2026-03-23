"use client";

import { createContext, useContext, useState, useCallback } from "react";

// ── 낮/밤 조명 프리셋 ─────────────────────────────────────
export const PRESETS = {
  day: {
    // ambient 낮게 → 그림자 살아남, 재질 차이 드러남
    // dir 강하게 + 따뜻한 색 → 햇살 느낌
    ambientColor:     "#FFE8D0",
    ambientIntensity: 0.10,
    dirColor:         "#FFF0D0",
    dirIntensity:     3.2,
    pointColor:       "#FF9944",
    pointIntensity:   1.8,
  },
  night: {
    ambientColor:     "#1A1525",
    ambientIntensity: 0.10,    // 완전 암흑 방지
    dirColor:         "#2A3060",
    dirIntensity:     0.15,
    pointColor:       "#FFD580",
    pointIntensity:   3.5,
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