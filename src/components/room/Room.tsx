"use client";

import { Float } from "@react-three/drei";
import { HoverLift } from "./AnimatedWrapper";

import Floor    from "./structure/Floor";
import Walls    from "./structure/Walls";
import Moulding from "./structure/Moulding";

import Desk           from "./furniture/Desk";
import Bed            from "./furniture/Bed";
import Storage, { DrawerChest } from "./furniture/Storage";
import SunbathingCat  from "./furniture/SunbathingCat";
import CatBowls       from "./furniture/CatBowls";
import DeskLamp       from "./furniture/DeskLamp";
import Nightstand     from "./furniture/Nightstand";
import Trashcan       from "./furniture/Trashcan";

export default function Room() {
  return (
    <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.3} floatingRange={[0, 0.1]}>
      <group>
        <Floor />
        <Walls />
        <Moulding />
        <Desk />
        <Bed />
        <Nightstand />
        <Trashcan />

        <HoverLift
          liftHeight={0.06}
          hitbox={[1.3, 2.2, 1.0]}
          hitboxPos={[-3.2, 1.1, 1.5]}
        >
          <DrawerChest />
          <DeskLamp />
        </HoverLift>

        <Storage />
        <SunbathingCat />
        <CatBowls />
      </group>
    </Float>
  );
}