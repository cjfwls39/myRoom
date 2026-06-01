// ── 갤러리 폰트 경로 (/public/fonts/ 기준) ───────────────────

const BASE_EN = "/fonts/Josefin_Sans/static";
const BASE_KR = "/fonts/Josefin_Sans,Noto_Sans_KR/Noto_Sans_KR/static";

export const FONT_EN_LIGHT   = `${BASE_EN}/JosefinSans-Light.ttf`;
export const FONT_EN_REGULAR = `${BASE_EN}/JosefinSans-Regular.ttf`;
export const FONT_EN_SEMI    = `${BASE_EN}/JosefinSans-SemiBold.ttf`;
export const FONT_KR         = `${BASE_KR}/NotoSansKR-Regular.ttf`;

/** 텍스트에 한글이 포함되면 KR 폰트, 아니면 EN 폰트 반환 */
export function pickFont(text: string, weight: "light" | "regular" | "semi" = "regular"): string {
  if (/[가-힯]/.test(text)) return FONT_KR;
  return weight === "light" ? FONT_EN_LIGHT
       : weight === "semi"  ? FONT_EN_SEMI
       : FONT_EN_REGULAR;
}
