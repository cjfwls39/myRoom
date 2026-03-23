"use client";

import { HoverLift } from "../AnimatedWrapper";
import { COLOR } from "../constants";
import { ICON_META, getIconTexture } from "./iconTextures";

export default function IconFrames() {
  const lean = 0.3;
  const half = 0.23;
  const px   = 0.08 + Math.sin(lean) * half;
  const py   = 0.12 + Math.cos(lean) * half;

  return (
    <>
      {ICON_META.map(({ key, bg }, i) => {
        const tex = getIconTexture(key);
        return (
          <group
            key={key}
            position={[px, py, (i - 1) * 0.68]}
            rotation={[0, Math.PI / 2, 0]}
          >
            <HoverLift liftHeight={0.05}>
              <group rotation={[-lean, 0, 0]}>
                <mesh castShadow>
                  <boxGeometry args={[0.46, 0.46, 0.022]} />
                  <meshStandardMaterial color={COLOR.woodDark} />
                </mesh>
                <mesh position={[0, 0, 0.012]}>
                  <boxGeometry args={[0.40, 0.40, 0.006]} />
                  <meshStandardMaterial color={bg} />
                </mesh>
                <mesh position={[0, 0, 0.016]}>
                  <planeGeometry args={[0.38, 0.38]} />
                  <meshStandardMaterial map={tex} transparent />
                </mesh>
              </group>
            </HoverLift>
          </group>
        );
      })}
    </>
  );
}