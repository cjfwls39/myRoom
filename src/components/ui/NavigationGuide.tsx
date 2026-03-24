"use client";

/**
 * NavigationGuide.tsx — 진입 시 조작 안내
 *
 * 워프 인트로가 끝난 후 등장
 * 5초 후 자동으로 페이드 아웃
 * 클릭하면 바로 닫힘
 */

import { useState, useEffect } from "react";

export default function NavigationGuide() {
  const [visible, setVisible] = useState(false);
  const [fading, setFading]   = useState(false);

  useEffect(() => {
    // 워프 인트로 시간(약 3초) 이후 등장
    const showTimer = setTimeout(() => setVisible(true), 3200);
    return () => clearTimeout(showTimer);
  }, []);

  useEffect(() => {
    if (!visible) return;
    // 5초 후 페이드 아웃 시작
    const fadeTimer = setTimeout(() => setFading(true), 5000);
    // 페이드 아웃 후 제거
    const hideTimer = setTimeout(() => setVisible(false), 6200);
    return () => { clearTimeout(fadeTimer); clearTimeout(hideTimer); };
  }, [visible]);

  if (!visible) return null;

  return (
    <div
      onClick={() => { setFading(true); setTimeout(() => setVisible(false), 1000); }}
      style={{
        position:   "fixed",
        inset:      0,
        zIndex:     50,
        display:    "flex",
        alignItems: "flex-end",
        justifyContent: "center",
        paddingBottom: "6vh",
        pointerEvents: "auto",
        opacity:    fading ? 0 : 1,
        transition: "opacity 1.2s ease",
      }}
    >
      <div style={styles.card}>
        {/* 별 장식 */}
        <div style={styles.starRow}>
          {["✦", "·", "✦", "·", "✦"].map((s, i) => (
            <span key={i} style={{ opacity: i % 2 === 0 ? 0.8 : 0.3 }}>{s}</span>
          ))}
        </div>

        {/* 조작 안내 */}
        <div style={styles.guides}>
          {/* 마우스 */}
          <div style={styles.guideItem}>
            <div style={styles.iconWrap}>
              <div style={styles.mouseBody}>
                <div style={styles.mouseScroll} />
                <div style={styles.mouseLeft} />
                <div style={styles.mouseRight} />
              </div>
            </div>
            <div style={styles.guideText}>
              <p style={styles.guideLabel}>좌클릭 드래그</p>
              <p style={styles.guideDesc}>시점 회전</p>
            </div>
          </div>

          <div style={styles.dividerV} />

          {/* 우클릭 */}
          <div style={styles.guideItem}>
            <div style={styles.iconWrap}>
              <div style={styles.mouseBody}>
                <div style={styles.mouseScrollEmpty} />
                <div style={styles.mouseLeftEmpty} />
                <div style={{ ...styles.mouseRight, background: "rgba(170,255,68,0.7)" }} />
              </div>
            </div>
            <div style={styles.guideText}>
              <p style={styles.guideLabel}>우클릭 드래그</p>
              <p style={styles.guideDesc}>시점 이동</p>
            </div>
          </div>

          <div style={styles.dividerV} />

          {/* 휠 */}
          <div style={styles.guideItem}>
            <div style={styles.iconWrap}>
              <div style={styles.mouseBody}>
                <div style={{ ...styles.mouseScroll, background: "rgba(170,255,68,0.7)" }} />
                <div style={styles.mouseLeftEmpty} />
                <div style={styles.mouseRightEmpty} />
              </div>
            </div>
            <div style={styles.guideText}>
              <p style={styles.guideLabel}>스크롤</p>
              <p style={styles.guideDesc}>줌 인/아웃</p>
            </div>
          </div>

          <div style={styles.dividerV} />

          {/* 클릭 */}
          <div style={styles.guideItem}>
            <div style={styles.iconWrap}>
              <span style={styles.clickIcon}>✦</span>
            </div>
            <div style={styles.guideText}>
              <p style={styles.guideLabel}>오브젝트 클릭</p>
              <p style={styles.guideDesc}>인터랙션</p>
            </div>
          </div>
        </div>

        <p style={styles.dismiss}>클릭하면 닫힙니다</p>
      </div>
    </div>
  );
}

// ── 스타일 ────────────────────────────────────
const C = {
  bg:      "#08071A",
  border:  "rgba(140,100,255,0.35)",
  glow:    "rgba(100,60,255,0.2)",
  text:    "rgba(200,195,225,0.85)",
  accent:  "#AAFF44",
  dim:     "rgba(160,150,200,0.5)",
};

const styles: Record<string, React.CSSProperties> = {
  card: {
    backgroundColor: C.bg,
    border:          `1px solid ${C.border}`,
    borderRadius:    "16px",
    boxShadow:       `0 0 40px ${C.glow}, 0 0 80px rgba(60,20,120,0.1)`,
    padding:         "1.4rem 2rem",
    display:         "flex",
    flexDirection:   "column",
    alignItems:      "center",
    gap:             "1rem",
    backdropFilter:  "blur(8px)",
    cursor:          "pointer",
  },
  starRow: {
    display:        "flex",
    gap:            "0.5rem",
    color:          C.accent,
    fontSize:       "0.7rem",
    letterSpacing:  "0.2em",
  },
  guides: {
    display:    "flex",
    alignItems: "center",
    gap:        "1.4rem",
  },
  guideItem: {
    display:        "flex",
    flexDirection:  "column",
    alignItems:     "center",
    gap:            "0.6rem",
  },
  iconWrap: {
    display:        "flex",
    alignItems:     "center",
    justifyContent: "center",
    width:          "2.4rem",
    height:         "2.4rem",
  },
  mouseBody: {
    width:        "1.4rem",
    height:       "2rem",
    border:       `1.5px solid ${C.border}`,
    borderRadius: "0.7rem",
    position:     "relative",
    display:      "flex",
    overflow:     "hidden",
  },
  mouseScroll: {
    position:     "absolute",
    top:          "0.28rem",
    left:         "50%",
    transform:    "translateX(-50%)",
    width:        "0.22rem",
    height:       "0.45rem",
    borderRadius: "2px",
    background:   "rgba(170,255,68,0.7)",
  },
  mouseScrollEmpty: {
    position:     "absolute",
    top:          "0.28rem",
    left:         "50%",
    transform:    "translateX(-50%)",
    width:        "0.22rem",
    height:       "0.45rem",
    borderRadius: "2px",
    background:   "rgba(140,100,255,0.3)",
  },
  mouseLeft: {
    flex:            1,
    background:      "rgba(170,255,68,0.2)",
    borderRight:     `0.5px solid ${C.border}`,
    marginTop:       "0.7rem",
    borderRadius:    "0 0 0 0.5rem",
  },
  mouseLeftEmpty: {
    flex:            1,
    borderRight:     `0.5px solid ${C.border}`,
    marginTop:       "0.7rem",
    borderRadius:    "0 0 0 0.5rem",
  },
  mouseRight: {
    flex:            1,
    background:      "rgba(140,100,255,0.2)",
    marginTop:       "0.7rem",
    borderRadius:    "0 0 0.5rem 0",
  },
  mouseRightEmpty: {
    flex:            1,
    marginTop:       "0.7rem",
    borderRadius:    "0 0 0.5rem 0",
  },
  clickIcon: {
    fontSize:   "1.6rem",
    color:      C.accent,
    filter:     "drop-shadow(0 0 6px rgba(170,255,68,0.6))",
  },
  guideText: {
    textAlign: "center",
  },
  guideLabel: {
    color:         C.accent,
    fontSize:      "0.72rem",
    fontWeight:    600,
    letterSpacing: "0.06em",
    margin:        0,
  },
  guideDesc: {
    color:    C.dim,
    fontSize: "0.65rem",
    margin:   "0.15rem 0 0",
  },
  dividerV: {
    width:      "1px",
    height:     "3.5rem",
    background: `linear-gradient(to bottom, transparent, ${C.border}, transparent)`,
  },
  dismiss: {
    color:         C.dim,
    fontSize:      "0.62rem",
    letterSpacing: "0.08em",
    margin:        0,
  },
};
