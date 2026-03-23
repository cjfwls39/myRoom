"use client";

import dynamic from 'next/dynamic';
import { Suspense } from 'react';
import { DayNightProvider } from '@/components/canvas/DayNightContext';
import DayNightTransition from '@/components/canvas/DayNightButton';

const SceneContainer = dynamic(() => import("@/components/canvas/SceneContainer"), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center w-full h-full" style={{ backgroundColor: "#F2E0C8" }}>
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-4 border-t-transparent rounded-full animate-spin" style={{ borderColor: "#8B5E3C", borderTopColor: "transparent" }} />
        <p className="font-medium animate-pulse" style={{ color: "#8B5E3C" }}>불러오는중...</p>
      </div>
    </div>
  )
});

export default function Home() {
  return (
    <DayNightProvider>
      <main className="w-full h-full overflow-hidden relative" style={{ backgroundColor: "#F2E0C8" }}>
        <h1 className="sr-only">3D Interactive Portfolio</h1>

        <Suspense fallback={null}>
          <SceneContainer />
        </Suspense>

        {/* 전환 오버레이 — 실제 토글은 3D 씬 안 DeskLamp에서 */}
        <DayNightTransition />
      </main>
    </DayNightProvider>
  );
}