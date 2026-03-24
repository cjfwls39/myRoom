"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { PLANETS, PlanetConfig } from "@/components/room/layout";

function Planet({ config }: { config: PlanetConfig }) {
  const orbitRef  = useRef<THREE.Group>(null!);
  const planetRef = useRef<THREE.Group>(null!);

  useFrame((_, delta) => {
    if (orbitRef.current)  orbitRef.current.rotation.y  += delta * config.orbitSpeed;
    if (planetRef.current) planetRef.current.rotation.y += delta * config.spinSpeed;
  });

  const R = config.radius;

  return (
    <group
      ref={orbitRef}
      position={[0, config.orbitY, 0]}
      rotation={[0, config.initAngle, 0]}
    >
      <group position={[config.orbitRadius, 0, 0]}>
        <group ref={planetRef}>
          {/* 행성 본체 */}
          <mesh>
            <sphereGeometry args={[R, 20, 20]} />
            <meshStandardMaterial
              color={config.color}
              roughness={0.85}
              metalness={0.05}
            />
          </mesh>

          {/* 고리 */}
          {config.hasRing && (
            <>
              <mesh rotation={[config.ringTilt!, 0, 0]}>
                <ringGeometry args={[R * 1.45, R * 2.4, 48]} />
                <meshStandardMaterial
                  color={config.ringColor}
                  side={THREE.DoubleSide}
                  transparent opacity={0.80}
                  roughness={0.9}
                />
              </mesh>
              <mesh rotation={[config.ringTilt!, 0, 0]}>
                <ringGeometry args={[R * 1.50, R * 2.1, 48]} />
                <meshStandardMaterial
                  color={config.ringColor}
                  side={THREE.DoubleSide}
                  transparent opacity={0.30}
                  roughness={0.9}
                />
              </mesh>
            </>
          )}
        </group>
      </group>
    </group>
  );
}

export default function SpaceObjects() {
  return (
    <group>
      {PLANETS.map((config, i) => (
        <Planet key={i} config={config} />
      ))}
    </group>
  );
}