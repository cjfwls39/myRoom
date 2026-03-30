"use client";

import { Suspense, useMemo, useState, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { PerspectiveCamera, OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import SnowBackground from "@/components/snowBackground/SnowBackground";
import Room from "@/components/room/Room";
import { CAMERA, ORBIT } from "@/components/room/layout";
import { CANVAS_PERF } from "@/components/room/Performance";

// ── 카메라 인트로 ─────────────────────────────
const CAMERA_START  = new THREE.Vector3(...CAMERA.start);
const CAMERA_TARGET = new THREE.Vector3(...CAMERA.target);
const LOOK_AT       = new THREE.Vector3(...CAMERA.lookAt);
const ARRIVE_DIST   = 0.1;

function CameraManager({ isFinished, setIsFinished }: {
  isFinished: boolean;
  setIsFinished: (v: boolean) => void;
}) {
  const fovRef = useRef(CAMERA.fovStart);

  useFrame(({ camera }) => {
    if (isFinished) return;
    const dist = camera.position.distanceTo(CAMERA_TARGET);

    camera.position.lerp(CAMERA_TARGET, 0.03);
    camera.lookAt(LOOK_AT);

    fovRef.current += (CAMERA.fov - fovRef.current) * 0.04;
    (camera as THREE.PerspectiveCamera).fov = fovRef.current;
    (camera as THREE.PerspectiveCamera).updateProjectionMatrix();

    if (dist < ARRIVE_DIST) {
      camera.position.copy(CAMERA_TARGET);
      (camera as THREE.PerspectiveCamera).fov = CAMERA.fov;
      (camera as THREE.PerspectiveCamera).updateProjectionMatrix();
      setIsFinished(true);
    }
  });

  return (
    <PerspectiveCamera
      makeDefault
      position={CAMERA_START.toArray() as [number, number, number]}
      fov={CAMERA.fovStart}
      far={10000}
    />
  );
}

// ── 메인 ─────────────────────────────────────
export default function SceneContainer() {
  const [introFinished, setIntroFinished] = useState(false);
  const mouseButtons = useMemo(() => ({
    LEFT:   THREE.MOUSE.ROTATE,
    MIDDLE: THREE.MOUSE.DOLLY,
    RIGHT:  THREE.MOUSE.PAN,
  }), []);

  return (
    <Canvas
      shadows="soft"
      {...CANVAS_PERF}
      onCreated={({ gl }) => {
        gl.toneMapping        = THREE.ACESFilmicToneMapping;
        gl.toneMappingExposure = 1.1;
        gl.outputColorSpace   = THREE.SRGBColorSpace;
        // scene.background는 SkyBackground에서 관리
      }}
    >
      <CameraManager isFinished={introFinished} setIsFinished={setIntroFinished} />

      <Suspense fallback={null}>
        <SnowBackground />

        {/* 방: 구슬 내부 지면(Y=0.81)에 바닥 맞춤 */}
        <group position={[0, 0.90, 0]} scale={0.55}>
          <Room />
        </group>
      </Suspense>

      <OrbitControls
        makeDefault
        enabled={introFinished}
        target={CAMERA.lookAt}

        /* 시점 제한 — 바닥 뚫림 방지 */
        minPolarAngle={Math.PI / 6}
        maxPolarAngle={Math.PI / 2.2} 

        // minAzimuthAngle={ORBIT.minAzimuthAngle}
        // maxAzimuthAngle={ORBIT.maxAzimuthAngle}

        minDistance={ORBIT.minDistance}
        maxDistance={ORBIT.maxDistance}

        /* 줌 및 팬 설정 */
        zoomSpeed={1.2}
        enableDamping
        dampingFactor={0.05}
        enablePan
        mouseButtons={mouseButtons}
        onChange={(e: any) => {
          /* Pan 범위 제한 (방 이탈 방지) */
          const ctrl = e?.target;
          if (!ctrl?.target) return;
          const t = ctrl.target as THREE.Vector3;
          t.x = Math.max(ORBIT.panMin[0], Math.min(ORBIT.panMax[0], t.x));
          t.y = Math.max(ORBIT.panMin[1], Math.min(ORBIT.panMax[1], t.y));
          t.z = Math.max(ORBIT.panMin[2], Math.min(ORBIT.panMax[2], t.z));
        }}
      />
    </Canvas>
  );
}