"use client";

import Floor    from "./structure/Floor";
import Walls    from "./structure/Walls";
import Moulding from "./structure/Moulding";

import Desk           from "./furniture/Desk";
import Bed            from "./furniture/Bed";
import Storage, { DrawerChest } from "./furniture/Storage";
import SunbathingCat  from "./furniture/SunbathingCat";
import CatBowls       from "./furniture/CatBowls";
import Nightstand     from "./furniture/Nightstand";
import Trashcan       from "./furniture/Trashcan";

export default function Room() {
  return (
    <group>
      <Floor />
      <Walls />
      <Moulding />
      <Desk />
      <Bed />
      <Nightstand />
      <Trashcan />
      <DrawerChest />
      <Storage />
      <SunbathingCat />
      <CatBowls />
    </group>
  );
}