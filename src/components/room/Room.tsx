"use client";

import { Float } from "@react-three/drei";
import { HoverLift } from "./AnimatedWrapper";

// structure
import Floor    from "./structure/Floor";
import Walls    from "./structure/Walls";
import Moulding from "./structure/Moulding";

// furniture
import Desk           from "./furniture/Desk";
import Bed            from "./furniture/Bed";
import Storage, { DrawerChest } from "./furniture/Storage";
import SunbathingCat  from "./furniture/SunbathingCat";
import CatBowls       from "./furniture/CatBowls";
import DeskLamp       from "./furniture/DeskLamp";

export default function Room() {
  return (
    <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.3} floatingRange={[0, 0.1]}>
      <group>
        <Floor />
        <Walls />
        <Moulding />
        <Desk />
        <Bed />

        {/* 서랍장 + 무드등 — 함께 hover */}
        <HoverLift
          liftHeight={0.06}
          hitbox={[1.3, 2.4, 1.3]}
          hitboxPos={[-2.7, 1.2, 1.5]}
        >
          <DrawerChest />
          <DeskLamp />
        </HoverLift>

        {/* 냉장고 — 독립 hover */}
        <Storage />

        <SunbathingCat />
        <CatBowls />
      </group>
    </Float>
  );
}