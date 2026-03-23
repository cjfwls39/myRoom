"use client";

import { Suspense, useMemo, useState, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { PerspectiveCamera, Environment, OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import Room from "@/components/room/Room";
import { CANVAS_PERF, ENV_PERF } from "@/components/room/Performance";
import { useDayNight, PRESETS } from "./DayNightContext";

// ── 카메라 인트로 ─────────────────────────────
const CAMERA_TARGET = new THREE.Vector3(14, 16, 14);
const LOOK_AT       = new THREE.Vector3(0, 2.8, 0);
const ARRIVE_DIST   = 0.05;

function CameraManager({ isFinished, setIsFinished }: {
  isFinished: boolean;
  setIsFinished: (v: boolean) => void;
}) {
  useFrame(({ camera }) => {
    if (isFinished) return;
    (camera as THREE.PerspectiveCamera).position.lerp(CAMERA_TARGET, 0.05);
    camera.lookAt(LOOK_AT);
    if (camera.position.distanceTo(CAMERA_TARGET) < ARRIVE_DIST) {
      camera.position.copy(CAMERA_TARGET);
      setIsFinished(true);
    }
  });
  return <PerspectiveCamera makeDefault position={[40, 40, 40]} fov={32} />;
}

// ── Fog 전환 ──────────────────────────────────
const FOG_PRESETS = {
  day:   { color: new THREE.Color("#F2E0C8"), near: 28, far: 80 },
  night: { color: new THREE.Color("#08080F"), near: 14, far: 50 },
} as const;

function FogController() {
  const { mode }  = useDayNight();
  const curColor  = useRef(new THREE.Color("#F2E0C8"));
  const bgColor   = useRef(new THREE.Color("#F2E0C8"));
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

  return <fog attach="fog" args={["#F2E0C8", 28, 80]} />;
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
      <directionalLight
        ref={dirRef}
        position={[15, 20, -10]}
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
        shadow-camera-near={0.5}
        shadow-camera-far={60}
        shadow-camera-left={-7}
        shadow-camera-right={7}
        shadow-camera-top={7}
        shadow-camera-bottom={-7}
        shadow-bias={-0.0003}
        shadow-radius={3}
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
        gl.setClearColor("#F2E0C8", 1);
        scene.background = new THREE.Color("#F2E0C8");
      }}
    >
      <FogController />
      <CameraManager isFinished={introFinished} setIsFinished={setIntroFinished} />
      <LightRig />

      <Suspense fallback={null}>
        <Environment {...ENV_PERF} />
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
      />
    </Canvas>
  );
}