"use client";

import { useWeather } from "./WeatherContext";
import { useDayNight } from "./DayNightContext";
import { useState } from "react";

export default function WeatherButton() {
  const { isStorm, toggle } = useWeather();
  const { mode }            = useDayNight();
  const [hovered, setHovered] = useState(false);

  const isDark = mode === "night" || isStorm;

  const baseColor   = isDark ? "rgba(180,210,255,0.15)" : "rgba(255,255,255,0.18)";
  const borderColor = isDark ? "rgba(150,190,255,0.35)" : "rgba(200,230,255,0.45)";
  const hoverBg     = isDark ? "rgba(180,210,255,0.25)" : "rgba(255,255,255,0.30)";
  const textColor   = isDark ? "rgba(200,225,255,0.90)" : "rgba(60,80,120,0.90)";

  return (
    <button
      onClick={toggle}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        position:        "fixed",
        top:             "1.4rem",    // 우측 상단으로 이동
        right:           "1.4rem",    // 우측 상단으로 이동
        zIndex:          40,
        display:         "flex",
        alignItems:      "center",
        gap:             "0.55rem",
        padding:         "0.55rem 1rem",
        background:      hovered ? hoverBg : baseColor,
        border:          `1px solid ${borderColor}`,
        borderRadius:    "999px",
        backdropFilter:  "blur(10px)",
        WebkitBackdropFilter: "blur(10px)",
        cursor:          "pointer",
        transition:      "all 0.3s ease",
        transform:       hovered ? "translateY(2px)" : "translateY(0)", // 상단일 땐 아래로 살짝
        userSelect:      "none",
      }}
    >
      <span style={{
        fontSize:   "1.1rem",
        lineHeight: 1,
        transition: "transform 0.4s ease",
        display:    "inline-block",
        transform:  isStorm ? "rotate(-15deg)" : "rotate(0deg)",
      }}>
        {isStorm ? "🌨️" : "☀️"}
      </span>

      <span style={{
        fontSize:      "0.75rem",
        fontWeight:    600,
        color:         textColor,
        letterSpacing: "0.08em",
      }}>
        {isStorm ? "BLIZZARD" : "CLEAR"}
      </span>

      <span style={{
        width:      "5px",
        height:     "5px",
        borderRadius: "50%",
        background: isStorm ? "#88aaff" : "#ffcc44",
        boxShadow:  isStorm
          ? "0 0 8px rgba(120,160,255,1)"
          : "0 0 8px rgba(255,200,60,1)",
        transition: "all 0.5s ease",
      }} />
    </button>
  );
}