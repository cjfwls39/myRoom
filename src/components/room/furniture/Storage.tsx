"use client";

import { useRef, useState, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { AppearGroup } from "../AnimatedWrapper";
import AnimatedWrapper from "../AnimatedWrapper";
import { COLOR, DELAY, WALL_HALF } from "../constants";

function createBeastTexture(): THREE.CanvasTexture {
  const size = 256;
  const cv   = document.createElement("canvas");
  cv.width = cv.height = size;
  const ctx = cv.getContext("2d")!;
  ctx.fillStyle = "#0A0A0A"; ctx.fillRect(0,0,size,size);
  ctx.fillStyle = "#009900";
  ctx.fillRect(0,0,14,size); ctx.fillRect(size-14,0,14,size);
  ctx.strokeStyle="#00EE00"; ctx.lineWidth=13; ctx.lineCap="butt";
  [[72,28,98,188],[120,18,128,188],[168,28,142,188]].forEach(([x1,y1,x2,y2])=>{
    ctx.beginPath(); ctx.moveTo(x1,y1); ctx.lineTo(x2,y2); ctx.stroke();
  });
  ctx.fillStyle="#00FF00"; ctx.font="bold 40px Impact,Arial Black"; ctx.textAlign="center";
  ctx.fillText("BEAST",size/2,220);
  ctx.fillStyle="#777"; ctx.font="bold 13px Arial";
  ctx.fillText("ENERGY DRINK",size/2,242);
  const tex = new THREE.CanvasTexture(cv);
  tex.needsUpdate = true;
  return tex;
}

function BeastCan({ position }: { position: [number,number,number] }) {
  const texture = useMemo(() => createBeastTexture(), []);
  const R = 0.052, H_CAN = 0.22;  // 캔 반지름, 높이
  const R2 = 0.052, H2 = 0.22;
  return (
    <group position={position}>
      <mesh>
        <cylinderGeometry args={[R2,R2,H2,16]} />
        <meshStandardMaterial map={texture} metalness={0.5} roughness={0.4} />
      </mesh>
      {[1,-1].map((s,i)=>(
        <mesh key={i} position={[0, s*(H2/2+0.004), 0]}>
          <cylinderGeometry args={[R2*0.86,R2,0.008,16]} />
          <meshStandardMaterial color="#CCCCCC" metalness={0.9} roughness={0.1} />
        </mesh>
      ))}
    </group>
  );
}

function MiniFridge() {
  const [open, setOpen] = useState(false);
  const doorRef     = useRef<THREE.Group>(null!);
  const doorAngle   = useRef(0);
  const pointerDown = useRef<{x:number;y:number}|null>(null);

  useFrame((_,delta) => {
    if (!doorRef.current) return;
    // 힌지: -Z 끝 (벽쪽)
    // 문은 +Z 방향에서 시작해서 +X 방향으로 열림 (Y축 양수 회전)
    const target = open ? Math.PI * 0.60 : 0;
    doorAngle.current += (target - doorAngle.current) * (1 - Math.pow(0.001, delta*5));
    doorRef.current.rotation.y = doorAngle.current;
  });

  const handlePointerDown = (e:any) => { pointerDown.current={x:e.clientX,y:e.clientY}; };
  const handleClick = (e:any) => {
    if (!pointerDown.current) return;
    const dx=e.clientX-pointerDown.current.x, dy=e.clientY-pointerDown.current.y;
    pointerDown.current=null;
    if (Math.sqrt(dx*dx+dy*dy)>4) return;
    e.stopPropagation();
    setOpen(p=>!p);
  };

  const W=1.20, H=1.80, D=1.10, T=0.055;

  // 냉장고는 왼쪽 벽(-X)에 붙어있고 카메라는 +X,+Z에서 봄
  // 문은 +X 면에 있어야 카메라에서 보임
  // 힌지: -Z 끝, 열리면 Z축 기준 +X 방향으로 스윙

  const shelfYs = [0.28, 0.78, 1.28];
  // 냉장고 가로(Z축, D=1.1): 4캔 촘촘하게
  // 냉장고 깊이(X축, W=1.2): 3캔
  const canZs = [-0.36, -0.12, 0.12, 0.36];   // Z축 가로 4열
  const canXs = [-0.28, 0, 0.28];              // X축 깊이 3줄

  return (
    <AnimatedWrapper
      delay={DELAY.fridge}
      position={[-WALL_HALF+0.8, 0, 2.8]}
      liftHeight={0.06}
      hitbox={[W+0.1, H+0.1, D+0.1]}
      hitboxPos={[0, H/2, 0]}
    >
      <group
        onPointerDown={handlePointerDown}
        onClick={handleClick}
        onPointerOver={()=>{document.body.style.cursor="pointer";}}
        onPointerOut={()=>{document.body.style.cursor="default";}}
      >
        {/* 본체 5면 — 앞면(+X)만 없음 */}
        {/* 뒷면(-X, 벽쪽) */}
        <mesh position={[-W/2+T/2, H/2, 0]} castShadow>
          <boxGeometry args={[T,H,D]} />
          <meshStandardMaterial color={COLOR.fridgeBody} />
        </mesh>
        {/* 앞면(+X, 카메라쪽) — 없음, 문이 대신 */}
        {/* 왼쪽(-Z) */}
        <mesh position={[0, H/2, -D/2+T/2]} castShadow>
          <boxGeometry args={[W,H,T]} />
          <meshStandardMaterial color={COLOR.fridgeBody} />
        </mesh>
        {/* 오른쪽(+Z) */}
        <mesh position={[0, H/2, D/2-T/2]} castShadow>
          <boxGeometry args={[W,H,T]} />
          <meshStandardMaterial color={COLOR.fridgeBody} />
        </mesh>
        {/* 바닥 */}
        <mesh position={[0, T/2, 0]} receiveShadow castShadow>
          <boxGeometry args={[W,T,D]} />
          <meshStandardMaterial color={COLOR.fridgeBody} />
        </mesh>
        {/* 천장 */}
        <mesh position={[0, H-T/2, 0]} castShadow>
          <boxGeometry args={[W,T,D]} />
          <meshStandardMaterial color={COLOR.fridgeBody} />
        </mesh>

        {/* 내부 벽 */}
        <mesh position={[-W/2+T+0.005, H/2, 0]}>
          <boxGeometry args={[0.008, H-T*2, D-T*2]} />
          <meshStandardMaterial color="#E0EEE0" />
        </mesh>
        <mesh position={[0, H/2, -D/2+T+0.005]}>
          <boxGeometry args={[W-T*2, H-T*2, 0.008]} />
          <meshStandardMaterial color="#E0EEE0" />
        </mesh>
        <mesh position={[0, H/2, D/2-T-0.005]}>
          <boxGeometry args={[W-T*2, H-T*2, 0.008]} />
          <meshStandardMaterial color="#E0EEE0" />
        </mesh>
        <mesh position={[0, T+0.005, 0]}>
          <boxGeometry args={[W-T*2, 0.008, D-T*2]} />
          <meshStandardMaterial color="#D8ECD8" />
        </mesh>
        <mesh position={[0, H-T-0.005, 0]}>
          <boxGeometry args={[W-T*2, 0.008, D-T*2]} />
          <meshStandardMaterial color="#E0EEE0" />
        </mesh>

        {/* 선반 */}
        {shelfYs.map((sy,i)=>(
          <mesh key={i} position={[0, sy, 0]}>
            <boxGeometry args={[W-T*2-0.01, 0.018, D-T*2-0.01]} />
            <meshStandardMaterial color="#B8D4B8" transparent opacity={0.85} roughness={0.3} />
          </mesh>
        ))}

        {/* 캔 — Z: 가로 4열, X: 깊이 3줄 */}
        {shelfYs.map((sy,si)=>
          canZs.map((cz,zi)=>
            canXs.map((cx,xi)=>(
              <BeastCan
                key={`${si}-${zi}-${xi}`}
                position={[cx, sy + 0.12, cz]}
              />
            ))
          )
        )}

        {/* 내부 조명 */}
        <pointLight position={[0, H*0.88, 0]} intensity={0.8} distance={1.8} color="#CCFFCC" />

        {/* 문 — 힌지: -Z 끝, 열리면 +X(카메라)방향으로 스윙 */}
        <group ref={doorRef} position={[W/2, H/2, -D/2]}>
          {/* 문 패널 — 힌지에서 +Z 방향으로 뻗음 */}
          <mesh position={[0, 0, D/2-T/2]} castShadow>
            <boxGeometry args={[T, H-T, D-T]} />
            <meshStandardMaterial color={COLOR.fridgeBody} />
          </mesh>
          {/* 손잡이 */}
          {/* 손잡이 — 문 바깥면(+X)에서 앞으로 돌출 */}
          <mesh position={[T + 0.04, 0, D/2 - T - -0.35]} castShadow>
            <boxGeometry args={[0.04, 0.42, 0.04]} />
            <meshStandardMaterial color={COLOR.fridgeHandle} roughness={0.5} />
          </mesh>
        </group>

      </group>
    </AnimatedWrapper>
  );
}

export function DrawerChest() {
  return (
    <AppearGroup delay={DELAY.drawer} position={[-WALL_HALF+0.8, 0, 1.5]}>
      <group>
        <mesh position={[0,0.8,0]} castShadow receiveShadow>
          <boxGeometry args={[1.2,1.6,1.2]} />
          <meshStandardMaterial color={COLOR.drawerBody} />
        </mesh>
        {([0.4,0.8,1.2] as number[]).map((h,i)=>(
          <group key={i} position={[0.61,h,0]}>
            <mesh>
              <boxGeometry args={[0.01,0.02,1.1]} />
              <meshStandardMaterial color={COLOR.curtainFold} />
            </mesh>
            <mesh position={[0,-0.1,0]}>
              <boxGeometry args={[0.05,0.1,0.3]} />
              <meshStandardMaterial color={COLOR.drawerHandle} />
            </mesh>
          </group>
        ))}
      </group>
    </AppearGroup>
  );
}

export default function Storage() {
  return <MiniFridge />;
}