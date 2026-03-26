"use client";

import { useRef, useState, useEffect, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

const LERP_APPEAR = 0.08;
const LERP_HOVER  = 0.12;
const DONE_THRESH = 0.0005;

// ── AppearGroup ──────────────────────────────────────────────
interface AppearGroupProps {
  children:   React.ReactNode;
  delay?:     number;
  position?:  [number, number, number];
  rotation?:  [number, number, number];
}

export function AppearGroup({ children, delay = 0, position, rotation }: AppearGroupProps) {
  const ref      = useRef<THREE.Group>(null!);
  const [active, setActive] = useState(false);
  const [done,   setDone]   = useState(false);
  const scaleVec = useMemo(() => new THREE.Vector3(0, 0, 0), []);

  useEffect(() => {
    const t = setTimeout(() => setActive(true), delay * 1000);
    return () => clearTimeout(t);
  }, [delay]);

  useFrame(() => {
    if (done || !ref.current) return;
    const target = active ? 1 : 0;
    scaleVec.setScalar(target);
    ref.current.scale.lerp(scaleVec, LERP_APPEAR);
    if (Math.abs(ref.current.scale.x - target) < DONE_THRESH) {
      ref.current.scale.setScalar(target);
      if (active) setDone(true);
    }
  });

  return (
    <group ref={ref} position={position} rotation={rotation}>
      {children}
    </group>
  );
}

// ── HoverLift ────────────────────────────────────────────────
interface HoverLiftProps {
  children:    React.ReactNode;
  liftHeight?: number;
  onClick?:    () => void;
  rotation?:   [number, number, number];
  disabled?:   boolean;
  hitbox?:     [number, number, number];
  hitboxPos?:  [number, number, number];
}

export function HoverLift({
  children,
  liftHeight = 0.07,
  onClick,
  rotation,
  disabled   = false,
  hitbox,
  hitboxPos  = [0, 0, 0],
}: HoverLiftProps) {
  const ref      = useRef<THREE.Group>(null!);
  const hovered  = useRef(false);
  const currentY = useRef(0);
  const moving   = useRef(false);

  const currentScale = useRef(1);

  useFrame(() => {
    if (!ref.current || !moving.current) return;
    const targetY     = (!disabled && hovered.current) ? liftHeight * 0.4 : 0;
    const targetScale = (!disabled && hovered.current) ? 1.03 : 1.0;
    const diffY       = targetY     - currentY.current;
    const diffS       = targetScale - currentScale.current;

    if (Math.abs(diffY) < DONE_THRESH && Math.abs(diffS) < DONE_THRESH) {
      currentY.current        = targetY;
      currentScale.current    = targetScale;
      ref.current.position.y  = targetY;
      ref.current.scale.setScalar(targetScale);
      moving.current          = false;
      return;
    }
    currentY.current       += diffY * LERP_HOVER;
    currentScale.current   += diffS * LERP_HOVER;
    ref.current.position.y  = currentY.current;
    ref.current.scale.setScalar(currentScale.current);
  });

  const handleOver = (e: any) => {
    if (disabled) return;
    e.stopPropagation();
    hovered.current = true;
    moving.current  = true;
    document.body.style.cursor = onClick ? "pointer" : "default";
  };

  const handleOut = () => {
    hovered.current = false;
    moving.current  = true;
    document.body.style.cursor = "default";
  };

  return (
    <group ref={ref} rotation={rotation}>
      {hitbox ? (
        // 투명 히트박스로 raycaster 범위 명확히 정의
        <>
          <mesh
            position={hitboxPos}
            onPointerOver={handleOver}
            onPointerOut={handleOut}
            onClick={onClick}
          >
            <boxGeometry args={hitbox} />
            <meshBasicMaterial transparent opacity={0} depthWrite={false} />
          </mesh>
          {children}
        </>
      ) : (
        // 히트박스 없으면 group 이벤트로 처리
        <group
          onPointerOver={handleOver}
          onPointerOut={handleOut}
          onClick={onClick}
        >
          {children}
        </group>
      )}
    </group>
  );
}

// ── SceneItem ────────────────────────────────────────────────
interface SceneItemProps {
  children:    React.ReactNode;
  delay?:      number;
  liftHeight?: number;
  position?:   [number, number, number];
  rotation?:   [number, number, number];
  onClick?:    () => void;
  hover?:      boolean;
  hitbox?:     [number, number, number];
  hitboxPos?:  [number, number, number];
}

export function SceneItem({
  children,
  delay      = 0,
  liftHeight = 0.07,
  position,
  rotation,
  onClick,
  hover      = true,
  hitbox,
  hitboxPos,
}: SceneItemProps) {
  return (
    <AppearGroup delay={delay} position={position} rotation={rotation}>
      {hover ? (
        <HoverLift liftHeight={liftHeight} onClick={onClick} hitbox={hitbox} hitboxPos={hitboxPos}>
          {children}
        </HoverLift>
      ) : (
        children
      )}
    </AppearGroup>
  );
}

// ── AnimatedWrapper (하위 호환) ──────────────────────────────
interface AnimatedWrapperProps {
  children:     React.ReactNode;
  delay?:       number;
  scaleFactor?: number;
  liftHeight?:  number;
  position?:    [number, number, number];
  rotation?:    [number, number, number];
  onClick?:     () => void;
  hover?:       boolean;
  hitbox?:      [number, number, number];
  hitboxPos?:   [number, number, number];
}

export default function AnimatedWrapper({
  children,
  delay      = 0,
  liftHeight = 0.07,
  position,
  rotation,
  onClick,
  hover      = true,
  hitbox,
  hitboxPos,
}: AnimatedWrapperProps) {
  return (
    <SceneItem
      delay={delay}
      liftHeight={liftHeight}
      position={position}
      rotation={rotation}
      onClick={onClick}
      hover={hover}
      hitbox={hitbox}
      hitboxPos={hitboxPos}
    >
      {children}
    </SceneItem>
  );
}