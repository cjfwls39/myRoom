"use client";

import dynamic from "next/dynamic";
import { Component, useState } from "react";
import type { ReactNode } from "react";
import { DayNightProvider } from "@/components/canvas/DayNightContext";
import { WeatherProvider } from "@/components/canvas/WeatherContext";
import DayNightTransition from "@/components/canvas/DayNightButton";
import WeatherButton from "@/components/canvas/WeatherButton";
import PortfolioModal, { ModalType } from "@/components/ui/PortfolioModal";
import NavigationGuide from "@/components/ui/NavigationGuide";

class WebGLErrorBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  render() {
    if (!this.state.failed) return this.props.children;
    return (
      <div style={{
        width: "100vw", height: "100vh",
        background: "#000",
        display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center",
        gap: "1rem",
      }}>
        <p style={{ color: "rgba(180,160,255,0.9)", fontSize: "1rem", letterSpacing: "0.05em" }}>
          이 포트폴리오는 WebGL 환경이 필요합니다.
        </p>
        <p style={{ color: "rgba(140,120,200,0.6)", fontSize: "0.8rem", letterSpacing: "0.08em" }}>
          Chrome / Firefox / Edge 최신 버전에서 접속해주세요.
        </p>
      </div>
    );
  }
}

const SceneContainer = dynamic(() => import("@/components/canvas/SceneContainer"), {
  ssr: false,
  loading: () => (
    <div style={{ width:"100%", height:"100%", backgroundColor:"#000000", display:"flex", alignItems:"center", justifyContent:"center", flexDirection:"column", gap:"1rem" }}>
      <div style={{ width:"2.5rem", height:"2.5rem", border:"3px solid rgba(140,100,255,0.6)", borderTopColor:"transparent", borderRadius:"50%", animation:"spin 1s linear infinite" }} />
      <p style={{ color:"rgba(180,160,255,0.6)", fontSize:"0.85rem", letterSpacing:"0.1em" }}>LOADING...</p>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  ),
});

export default function Home() {
  const [modal, setModal] = useState<ModalType | null>(null);

  return (
    <DayNightProvider>
      <WeatherProvider>
        <OpenModalBridge onOpen={setModal} />

        <main style={{ width:"100vw", height:"100vh", overflow:"hidden", position:"relative", backgroundColor:"#000000" }}>
          <WebGLErrorBoundary>
            <SceneContainer />
          </WebGLErrorBoundary>
          <DayNightTransition />
          <WeatherButton />
          <NavigationGuide />
        </main>

        {modal && (
          <PortfolioModal type={modal} onClose={() => setModal(null)} />
        )}
      </WeatherProvider>
    </DayNightProvider>
  );
}

function OpenModalBridge({ onOpen }: { onOpen: (t: ModalType) => void }) {
  if (typeof window !== "undefined") {
    (window as any).__openPortfolioModal = onOpen;
  }
  return null;
}