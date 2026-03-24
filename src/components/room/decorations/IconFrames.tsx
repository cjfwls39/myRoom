import { MAT } from "../materials";
"use client";

import { HoverLift } from "../AnimatedWrapper";
import { COLOR } from "../constants";
import { SIZE } from "../layout";
import { ICON_META, getIconTexture } from "./iconTextures";

export default function IconFrames() {
  const { size, gap, lean, half } = SIZE.icon;
  const px = 0.08 + Math.sin(lean) * half;
  const py = 0.12 + Math.cos(lean) * half;

  return (
    <>
      {ICON_META.map(({ key, bg }, i) => {
        const tex = getIconTexture(key);
        return (
          <group
            key={key}
            position={[px, py, (i - 1) * gap]}
            rotation={[0, Math.PI / 2, 0]}
          >
            <HoverLift liftHeight={0.05}>
              <group rotation={[-lean, 0, 0]}>
                <mesh castShadow>
                  <boxGeometry args={[size, size, 0.022]} />
                  <meshStandardMaterial color={COLOR.woodDark} {...MAT.woodDark} />
                </mesh>
                <mesh position={[0, 0, 0.012]}>
                  <boxGeometry args={[size * 0.87, size * 0.87, 0.006]} />
                  <meshStandardMaterial color={bg} />
                </mesh>
                <mesh position={[0, 0, 0.016]}>
                  <planeGeometry args={[size * 0.83, size * 0.83]} />
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
