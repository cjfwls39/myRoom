"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useDayNight, PRESETS } from "../canvas/DayNightContext";
import { useWeather } from "../canvas/WeatherContext";

export default function ForestLights() {
  const { mode }    = useDayNight();
  const { isStorm } = useWeather();

  const sunRef = useRef<THREE.DirectionalLight>(null!);
  const ambRef = useRef<THREE.AmbientLight>(null!);

  useFrame((_, delta) => {
    const isNight = mode === "night";
    const t = 1 - Math.pow(0.001, delta); // 부드러운 조명 전환 효과

    // ── 겨울 숲 최적화 강도 ──
    // 눈 지형은 빛을 많이 반사하므로 기존 0.1보다 높은 수치를 권장합니다.
    const targetAmbI = isNight ? 0.4 : 0.6; 
    const targetSunI = isStorm ? 0.1 : (isNight ? 0.5 : 2.5);
    
    const targetAmbC = new THREE.Color(PRESETS[mode].ambientColor);
    const targetSunC = new THREE.Color(PRESETS[mode].dirColor);

    // 조명 상태 부드럽게 보간 (lerp)
    if (ambRef.current) {
      ambRef.current.intensity += (targetAmbI - ambRef.current.intensity) * t;
      ambRef.current.color.lerp(targetAmbC, t);
    }
    if (sunRef.current) {
      sunRef.current.intensity += (targetSunI - sunRef.current.intensity) * t;
      sunRef.current.color.lerp(targetSunC, t);
    }
  });

  return (
    <>
      {/* 씬 전체의 기본 밝기를 담당하는 환경광 */}
      <ambientLight ref={ambRef} />
      
      {/* 그림자를 만들고 방향성을 주는 직사광 (태양/달) */}
      <directionalLight
        ref={sunRef}
        position={[20, 50, 20]}
        castShadow
        shadow-mapSize={[2048, 2048]} // 그림자 품질 유지
        shadow-camera-left={-20}
        shadow-camera-right={20}
        shadow-camera-top={20}
        shadow-camera-bottom={-20}
      />
    </>
  );
}