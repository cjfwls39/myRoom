"use client";

import React from "react";
import { MeshTransmissionMaterial } from "@react-three/drei";

export default function GlassSphere({ radius = 4.0 }: { radius?: number }) {
  return (
    <mesh position={[0, 0.8, 0]} castShadow>
      <sphereGeometry args={[radius, 64, 64]} />
      {/* 고사양 유리 재질: 내부 물체가 굴절되어 보입니다. */}
      <MeshTransmissionMaterial
        backside={true}       // 뒷면 굴절 표현
        thickness={0.15}      // 유리 두께
        roughness={0.02}      // 표면 거칠기 (매우 투명)
        transmission={1.0}    // 빛 투과율
        ior={1.45}            // 굴절률 (유리 표준)
        distortion={0.15}     // 가장자리 왜곡 정도
        color="#E0F7FA"       // 은은한 푸른빛
        attenuationDistance={1}
        attenuationColor="#ffffff"
      />
    </mesh>
  );
}