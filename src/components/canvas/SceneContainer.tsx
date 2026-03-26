"use client";

import { Suspense, useMemo, useState, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { PerspectiveCamera, OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import Room from "@/components/room/Room";
import { CAMERA, ORBIT, LIGHTS, FOG } from "@/components/room/layout";
import SpaceBackground from "@/components/room/SpaceBackground";
import SpaceObjects    from "@/components/room/SpaceObjects";
import { CANVAS_PERF } from "@/components/room/Performance";
import { useDayNight, PRESETS } from "./DayNightContext";

// ── 카메라 인트로 ─────────────────────────────
const CAMERA_START  = new THREE.Vector3(...CAMERA.start);
const CAMERA_TARGET = new THREE.Vector3(...CAMERA.target);
const LOOK_AT       = new THREE.Vector3(...CAMERA.lookAt);
const ARRIVE_DIST   = 0.08;

function CameraManager({ isFinished, setIsFinished }: {
  isFinished: boolean;
  setIsFinished: (v: boolean) => void;
}) {
  const fovRef     = useRef(90);
  const camRef     = useRef<THREE.PerspectiveCamera>(null!);

  useFrame(({ camera }) => {
    if (isFinished) return;
    const dist = camera.position.distanceTo(CAMERA_TARGET);
    const speed = dist > 100 ? 0.055 : dist > 30 ? 0.045 : 0.035;
    (camera as THREE.PerspectiveCamera).position.lerp(CAMERA_TARGET, speed);
    camera.lookAt(LOOK_AT);

    const targetFov = CAMERA.fov;
    fovRef.current += (targetFov - fovRef.current) * 0.04;
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
      ref={camRef}
      makeDefault
      position={CAMERA_START.toArray() as [number,number,number]}
      fov={CAMERA.fovStart}
      // near 설정은 제거되어 기본값(0.1)으로 작동합니다.
    />
  );
}

// ── Fog 전환 ──────────────────────────────────
const FOG_PRESETS = {
  day:   { color: new THREE.Color("#000000"), near: FOG.day.near,   far: FOG.day.far   },
  night: { color: new THREE.Color("#000000"), near: FOG.night.near, far: FOG.night.far },
} as const;

function FogController() {
  const { mode }  = useDayNight();
  const curColor  = useRef(new THREE.Color("#000000"));
  const bgColor   = useRef(new THREE.Color("#000000"));
  
  // 타입 에러 방지를 위해 number 타입을 명시했습니다.
  const curNear   = useRef<number>(FOG.day.near);
  const curFar    = useRef<number>(FOG.day.far);
  
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

    if (ambientRef.current) { ambientRef.current.intensity = curAmbientI.current; ambientRef.current.color.copy(curAmbientC.current); }
    if (dirRef.current) { dirRef.current.intensity = curDirI.current; dirRef.current.color.copy(curDirC.current); }
    if (pointRef.current) { pointRef.current.intensity = curPointI.current; pointRef.current.color.copy(curPointC.current); }
  });

  return (
    <>
      <ambientLight ref={ambientRef} />
      <hemisphereLight args={["#FFE8C0", "#3A2208", 0.6]} />
      <directionalLight ref={dirRef} position={LIGHTS.dirPos} castShadow shadow-mapSize={[2048, 2048]} shadow-bias={-0.0002} />
      <pointLight ref={pointRef} position={LIGHTS.pointPos} distance={LIGHTS.pointDist} />
    </>
  );
}

// ── 씬 루트 ──────────────────────────────────
export default function SceneContainer() {
  const [introFinished, setIntroFinished] = useState(false);
  const mouseButtons = useMemo(() => ({ LEFT: THREE.MOUSE.ROTATE, MIDDLE: THREE.MOUSE.DOLLY, RIGHT: THREE.MOUSE.PAN }), []);

  return (
    <Canvas shadows="soft" {...CANVAS_PERF} onCreated={({ gl, scene }) => {
        gl.toneMapping = THREE.ACESFilmicToneMapping;
        gl.outputColorSpace = THREE.SRGBColorSpace;
        scene.background = new THREE.Color("#000000");
    }}>
      <FogController />
      <CameraManager isFinished={introFinished} setIsFinished={setIntroFinished} />
      <LightRig />
      <Suspense fallback={null}><SpaceBackground /><SpaceObjects /><Room /></Suspense>
      
      <OrbitControls
        makeDefault
        enabled={introFinished}
        target={CAMERA.lookAt}
        minPolarAngle={ORBIT.minPolarAngle}
        maxPolarAngle={ORBIT.maxPolarAngle}
        minAzimuthAngle={ORBIT.minAzimuthAngle}
        maxAzimuthAngle={ORBIT.maxAzimuthAngle}
        minDistance={ORBIT.minDistance}
        maxDistance={ORBIT.maxDistance}
        zoomSpeed={1.5}
        mouseButtons={mouseButtons}
        onChange={(e) => {
          // pan 범위 제한 — 벽 뒤쪽 시점 방지
          const ctrl = e?.target as any;
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