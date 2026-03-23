"use client";

import { Suspense, useMemo, useState, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { PerspectiveCamera, OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import Room from "@/components/room/Room";
import SpaceBackground from "@/components/room/SpaceBackground";
import SpaceObjects    from "@/components/room/SpaceObjects";
import { CANVAS_PERF } from "@/components/room/Performance";
import { useDayNight, PRESETS } from "./DayNightContext";

// ── 카메라 인트로 ─────────────────────────────
const CAMERA_START  = new THREE.Vector3(0, 8, 280);   // 정면 아주 멀리 — 워프 시작점
const CAMERA_TARGET = new THREE.Vector3(14, 16, 14);   // 최종 도착 위치
const LOOK_AT       = new THREE.Vector3(0, 2.8, 0);
const ARRIVE_DIST   = 0.08;

function CameraManager({ isFinished, setIsFinished }: {
  isFinished: boolean;
  setIsFinished: (v: boolean) => void;
}) {
  const fovRef     = useRef(90);  // 시작 fov 넓게 — 워프 느낌 강조
  const camRef     = useRef<THREE.PerspectiveCamera>(null!);

  useFrame(({ camera }, delta) => {
    if (isFinished) return;

    const dist     = camera.position.distanceTo(CAMERA_TARGET);

    // 거리에 따라 lerp 속도 동적 조절
    //   멀리 있을 때: 빠르게 돌진 (0.06)
    //   가까워질수록: 서서히 감속 (0.03)
    const speed    = dist > 100 ? 0.055 : dist > 30 ? 0.045 : 0.035;
    (camera as THREE.PerspectiveCamera).position.lerp(CAMERA_TARGET, speed);
    camera.lookAt(LOOK_AT);

    // fov: 시작 90 → 도착 32 으로 좁혀짐 (줌인 + 워프 강조)
    const targetFov = 32;
    fovRef.current += (targetFov - fovRef.current) * 0.04;
    (camera as THREE.PerspectiveCamera).fov = fovRef.current;
    (camera as THREE.PerspectiveCamera).updateProjectionMatrix();

    if (dist < ARRIVE_DIST) {
      camera.position.copy(CAMERA_TARGET);
      (camera as THREE.PerspectiveCamera).fov = 32;
      (camera as THREE.PerspectiveCamera).updateProjectionMatrix();
      setIsFinished(true);
    }
  });

  return (
    <PerspectiveCamera
      ref={camRef}
      makeDefault
      position={CAMERA_START.toArray() as [number,number,number]}
      fov={90}
    />
  );
}

// ── Fog 전환 ──────────────────────────────────
const FOG_PRESETS = {
  day:   { color: new THREE.Color("#000000"), near: 35, far: 95 },
  night: { color: new THREE.Color("#000000"), near: 20, far: 60 },
} as const;

function FogController() {
  const { mode }  = useDayNight();
  const curColor  = useRef(new THREE.Color("#000000"));
  const bgColor   = useRef(new THREE.Color("#000000"));
  const curNear   = useRef(28);
  const curFar    = useRef(80);
  const tmpColor  = useRef(new THREE.Color());
  const isSettled = useRef(false);
  const prevMode  = useRef(mode);

  if (prevMode.current !== mode) {
    prevMode.current  = mode;
    isSettled.current = false;
  }

  useFrame(({ scene }, delta) => {
    if (isSettled.current) return;
    const target = FOG_PRESETS[mode];
    const t = 1 - Math.pow(0.0008, delta);

    tmpColor.current.copy(target.color);
    curColor.current.lerp(tmpColor.current, t);
    curNear.current += (target.near - curNear.current) * t;
    curFar.current  += (target.far  - curFar.current)  * t;

    const fog = scene.fog as THREE.Fog;
    if (fog) {
      fog.color.copy(curColor.current);
      fog.near = curNear.current;
      fog.far  = curFar.current;
    }
    bgColor.current.copy(curColor.current);
    scene.background = bgColor.current;

    if (
      Math.abs(curColor.current.r - target.color.r) < 0.002 &&
      Math.abs(curNear.current - target.near) < 0.05 &&
      Math.abs(curFar.current  - target.far)  < 0.05
    ) {
      curColor.current.copy(target.color);
      curNear.current = target.near;
      curFar.current  = target.far;
      if (fog) { fog.color.copy(target.color); fog.near = target.near; fog.far = target.far; }
      scene.background = bgColor.current.copy(target.color);
      isSettled.current = true;
    }
  });

  return <fog attach="fog" args={["#000000", 35, 95]} />;
}

// ── 조명 리그 ─────────────────────────────────
const _tmpColor = new THREE.Color();

function LightRig() {
  const { mode } = useDayNight();

  const ambientRef = useRef<THREE.AmbientLight>(null!);
  const dirRef     = useRef<THREE.DirectionalLight>(null!);
  const pointRef   = useRef<THREE.PointLight>(null!);

  const curAmbientI = useRef(PRESETS.day.ambientIntensity);
  const curDirI     = useRef(PRESETS.day.dirIntensity);
  const curPointI   = useRef(PRESETS.day.pointIntensity);
  const curAmbientC = useRef(new THREE.Color(PRESETS.day.ambientColor));
  const curDirC     = useRef(new THREE.Color(PRESETS.day.dirColor));
  const curPointC   = useRef(new THREE.Color(PRESETS.day.pointColor));

  useFrame((_, delta) => {
    const target = PRESETS[mode];
    const t = 1 - Math.pow(0.0012, delta);

    curAmbientI.current += (target.ambientIntensity - curAmbientI.current) * t;
    curDirI.current     += (target.dirIntensity - curDirI.current) * t;
    curPointI.current   += (target.pointIntensity - curPointI.current) * t;

    _tmpColor.set(target.ambientColor); curAmbientC.current.lerp(_tmpColor, t);
    _tmpColor.set(target.dirColor);     curDirC.current.lerp(_tmpColor, t);
    _tmpColor.set(target.pointColor);   curPointC.current.lerp(_tmpColor, t);

    if (ambientRef.current) {
      ambientRef.current.intensity = curAmbientI.current;
      ambientRef.current.color.copy(curAmbientC.current);
    }
    if (dirRef.current) {
      dirRef.current.intensity = curDirI.current;
      dirRef.current.color.copy(curDirC.current);
    }
    if (pointRef.current) {
      pointRef.current.intensity = curPointI.current;
      pointRef.current.color.copy(curPointC.current);
    }
  });

  return (
    <>
      <ambientLight ref={ambientRef} />
      {/* hemisphere — 하늘(따뜻)과 바닥(어두운) 분리로 공간감 향상 */}
      <hemisphereLight
        args={["#FFE8C0", "#3A2208", 0.6]}
      />
      <directionalLight
        ref={dirRef}
        position={[60, 45, 55]}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-near={0.5}
        shadow-camera-far={60}
        shadow-camera-left={-8}
        shadow-camera-right={8}
        shadow-camera-top={8}
        shadow-camera-bottom={-8}
        shadow-bias={-0.0002}
        shadow-radius={4}
      />
      <pointLight ref={pointRef} position={[1.5, 3.5, -3.5]} distance={18} />
    </>
  );
}

// ── 씬 루트 ──────────────────────────────────
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
      style={{ background: "#F2E0C8" }}
      onCreated={({ gl, scene }) => {
        // 톤매핑 — ACES Filmic: 색 대비 자연스럽게
        gl.toneMapping        = THREE.ACESFilmicToneMapping;
        gl.toneMappingExposure = 1.0;
        // sRGB 출력 — 색 정확도
        gl.outputColorSpace   = THREE.SRGBColorSpace;
        gl.setClearColor("#000000", 1);
        scene.background = new THREE.Color("#000000");
      }}
    >
      <FogController />
      <CameraManager isFinished={introFinished} setIsFinished={setIntroFinished} />
      <LightRig />

      <Suspense fallback={null}>
        <SpaceBackground />
        <SpaceObjects />
        <Room />
      </Suspense>

      <OrbitControls
        makeDefault
        enabled={introFinished}
        target={[0, 2.8, 0]}
        minPolarAngle={Math.PI / 4}
        maxPolarAngle={Math.PI / 2.5}
        minAzimuthAngle={0}
        maxAzimuthAngle={Math.PI / 2}
        enableDamping
        dampingFactor={0.05}
        enablePan
        mouseButtons={mouseButtons}
        onChange={(e) => {
          // pan target 범위 제한 — 방 밖으로 못 나가게
          const ctrl = e?.target as any;
          if (!ctrl?.target) return;
          const t = ctrl.target as THREE.Vector3;
          t.x = Math.max(-2, Math.min(3, t.x));
          t.y = Math.max(1,  Math.min(5, t.y));
          t.z = Math.max(-2, Math.min(3, t.z));
        }}
      />
    </Canvas>
  );
}