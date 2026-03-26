// ── 고양이 액자 이미지 URL ────────────────────
// Unsplash CDN 직접 링크 (무료, 저작권 없음)
// w=512 파라미터로 적당한 해상도만 받아옴

export type CatFrameKey = "sitting" | "sleeping" | "looking";

export const CAT_URLS: Record<CatFrameKey, string> = {
  // 턱시도 고양이 (정면 앉은 자세)
  sitting:  "https://images.unsplash.com/photo-1561948955-570b270e7c36?w=512&q=80&auto=format&fit=crop",
  // 자는 고양이 (동그랗게 말린 자세)
  sleeping: "https://images.unsplash.com/photo-1574144611937-0df059b5ef3e?w=512&q=80&auto=format&fit=crop",
  // 위 쳐다보는 고양이 (옆모습)
  looking:  "https://images.unsplash.com/photo-1526336024174-e58f5cdd8e13?w=512&q=80&auto=format&fit=crop",
};

// 오류 해결을 위해 추가된 export 함수
export const getCatTexture = (key: CatFrameKey) => CAT_URLS[key];

export const CAT_FRAME_META: { key: CatFrameKey; frameColor: string; matColor: string }[] = [
  { key: "sitting",  frameColor: "#5D3A1A", matColor: "#F5EFE6" },
  { key: "sleeping", frameColor: "#2C1F14", matColor: "#1A1A2A" },
  { key: "looking",  frameColor: "#7C5C3A", matColor: "#FFF0DC" },
];