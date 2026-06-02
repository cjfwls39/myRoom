"use client";

import { useState } from "react";
import { useDayNight } from "@/components/canvas/DayNightContext";
import { useWeather } from "@/components/canvas/WeatherContext";

// 표지판과 동일한 4개 메뉴 — 화면에서 바로 접근 (빠른 정보용)
const MENU = [
  { id: "about",    icon: "👤", label: "ABOUT",    action: () => (window as any).__openPortfolioModal?.("about") },
  { id: "projects", icon: "💻", label: "PROJECTS", action: () => (window as any).__enterMuseum?.() },
  { id: "skills",   icon: "⚡", label: "SKILLS",   action: () => (window as any).__openPortfolioModal?.("skills") },
  { id: "contact",  icon: "✉️", label: "CONTACT",  action: () => (window as any).__openPortfolioModal?.("contact") },
] as const;

export default function NavMenu() {
  const { mode }    = useDayNight();
  const { isStorm } = useWeather();
  const isDark      = mode === "night" || isStorm;
  const [hovered, setHovered] = useState<string | null>(null);

  const bg          = isDark ? "rgba(30,40,70,0.82)"  : "rgba(255,245,220,0.88)";
  const hoverBg     = isDark ? "rgba(40,55,100,0.92)" : "rgba(255,252,235,0.95)";
  const borderColor = isDark ? "rgba(120,160,255,0.5)" : "rgba(220,180,80,0.6)";
  const textColor   = isDark ? "rgba(200,225,255,0.95)" : "rgba(80,55,20,0.95)";
  const shadow      = isDark
    ? "0 2px 12px rgba(0,0,0,0.5), 0 1px 3px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.08)"
    : "0 2px 12px rgba(0,0,0,0.18), 0 1px 3px rgba(0,0,0,0.12), inset 0 1px 0 rgba(255,255,255,0.6)";

  return (
    <div style={{
      position: "fixed", top: "1.4rem", left: "1.4rem",
      zIndex: 40,
      display: "flex", flexDirection: "column", gap: "0.5rem",
    }}>
      {MENU.map(item => {
        const isHover = hovered === item.id;
        return (
          <button
            key={item.id}
            onClick={item.action}
            onMouseEnter={() => setHovered(item.id)}
            onMouseLeave={() => setHovered(null)}
            style={{
              display: "flex", alignItems: "center", gap: "0.55rem",
              padding: "0.55rem 1.05rem",
              minWidth: "8.2rem",
              background:      isHover ? hoverBg : bg,
              border:         `1px solid ${borderColor}`,
              borderRadius:   "999px",
              backdropFilter: "blur(14px)",
              WebkitBackdropFilter: "blur(14px)",
              boxShadow:      shadow,
              cursor:         "pointer",
              transition:     "all 0.22s ease",
              transform:      isHover ? "translateX(3px)" : "translateX(0)",
              userSelect:     "none",
            }}
          >
            <span style={{ fontSize: "1rem", lineHeight: 1 }}>{item.icon}</span>
            <span style={{
              fontSize: "0.72rem", fontWeight: 700,
              color: textColor, letterSpacing: "0.1em",
            }}>
              {item.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}
