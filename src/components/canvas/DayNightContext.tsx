"use client";

import { createContext, useContext, useState, useCallback } from "react";

// ── 낮/밤 조명 프리셋 ─────────────────────────────────────
export const PRESETS = {
  day: {
    ambientColor:     "#FFF8F0",
    ambientIntensity: 0.35,
    dirColor:         "#FFE8C0",
    dirIntensity:     2.2,
    pointColor:       "#D4884A",
    pointIntensity:   1.2,
  },
  night: {
    ambientColor:     "#0A0A1A",
    ambientIntensity: 0.04,
    dirColor:         "#1A2040",
    dirIntensity:     0.08,
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