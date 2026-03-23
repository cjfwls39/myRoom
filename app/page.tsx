"use client";

import dynamic from "next/dynamic";
import { useState } from "react";
import { DayNightProvider } from "@/components/canvas/DayNightContext";
import DayNightTransition from "@/components/canvas/DayNightButton";
import PortfolioModal, { ModalType } from "@/components/ui/PortfolioModal";

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
      {/* 모달을 전역으로 열 수 있도록 window에 등록 */}
      <OpenModalBridge onOpen={setModal} />

      <main style={{ width:"100vw", height:"100vh", overflow:"hidden", position:"relative", backgroundColor:"#000000" }}>
        <SceneContainer />
        <DayNightTransition />
      </main>

      {/* 팝업 */}
      {modal && (
        <PortfolioModal type={modal} onClose={() => setModal(null)} />
      )}
    </DayNightProvider>
  );
}

// 3D씬(Moulding)에서 모달을 열기 위한 브릿지
// window.__openPortfolioModal 을 통해 호출
function OpenModalBridge({ onOpen }: { onOpen: (t: ModalType) => void }) {
  if (typeof window !== "undefined") {
    (window as any).__openPortfolioModal = onOpen;
  }
  return null;
}