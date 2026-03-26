"use client";

/**
 * PortfolioModal.tsx — 우주 테마 포트폴리오 팝업
 *
 * 사용법:
 *   <PortfolioModal type="about" onClose={() => setOpen(false)} />
 *
 * type: "about" | "projects" | "skills" | "contact"
 */

import { useEffect, useRef } from "react";
import {
  ABOUT_DATA,
  SKILLS_DATA,
  PROJECTS_DATA,
  CONTACT_DATA,
} from "@/components/room/portfolioData";

export type ModalType = "about" | "projects" | "skills" | "contact";

interface Props {
  type:    ModalType;
  onClose: () => void;
}

// ── 섹션별 타이틀 ─────────────────────────────
const TITLES: Record<ModalType, string> = {
  about:    "✦ ABOUT ME",
  projects: "✦ PROJECTS",
  skills:   "✦ SKILLS",
  contact:  "✦ CONTACT",
};

// ── About Me 내용 ─────────────────────────────
function AboutContent() {
  return (
    <div style={styles.content}>
      <p style={styles.name}>{ABOUT_DATA.name}</p>
      <p style={styles.role}>{ABOUT_DATA.role}</p>
      <p style={styles.intro}>{ABOUT_DATA.intro}</p>
      <div style={styles.divider} />
      {ABOUT_DATA.bio.map((p, i) => (
        <p key={i} style={styles.body}>{p}</p>
      ))}
      {ABOUT_DATA.ps.length > 0 && (
        <>
          <p style={styles.subheading}>✦ PS.</p>
          <ul style={styles.list}>
            {ABOUT_DATA.ps.map((item, i) => (
              <li key={i} style={styles.listItem}>▸ {item}</li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}

// ── Skills 내용 ───────────────────────────────
function SkillsContent() {
  return (
    <div style={styles.content}>
      {SKILLS_DATA.map((group, i) => (
        <div key={i} style={{ marginBottom: "1.4rem" }}>
          <p style={styles.subheading}>✦ {group.category}</p>
          <div style={styles.tagRow}>
            {group.items.map((skill, j) => (
              <span key={j} style={styles.tag}>{skill}</span>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

// ── Projects 내용 ─────────────────────────────
function ProjectsContent() {
  return (
    <div style={styles.content}>
      {PROJECTS_DATA.map((proj, i) => (
        <div key={i} style={styles.projectCard}>
          <div style={styles.projectHeader}>
            <p style={styles.projectTitle}>{proj.title}</p>
            <div style={{ display: "flex", gap: "0.6rem" }}>
              {proj.github && (
                <a href={proj.github} target="_blank" rel="noreferrer" style={styles.link}>
                  ◈ GitHub
                </a>
              )}
              {proj.link && (
                <a href={proj.link} target="_blank" rel="noreferrer" style={styles.link}>
                  ↗ 링크
                </a>
              )}
            </div>
          </div>
          <p style={styles.body}>{proj.description.map((line, i) => (
            <span key={i}>
              {line}
              <br />
            </span>
          ))}</p>
          <div style={styles.tagRow}>
            {proj.skills.map((s, j) => (
              <span key={j} style={styles.tag}>{s}</span>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

// ── Contact 내용 ──────────────────────────────
function ContactContent() {
  const links = [
    { label: "✉ Email",    url: `mailto:${CONTACT_DATA.email}`,  show: !!CONTACT_DATA.email    },
    { label: "☏ Phone",    url: `tel:${CONTACT_DATA.phone}`,     show: !!CONTACT_DATA.phone    },
    { label: "◈ GitHub",   url: CONTACT_DATA.github,             show: !!CONTACT_DATA.github   },
    { label: "◈ LinkedIn", url: CONTACT_DATA.linkedin,           show: !!CONTACT_DATA.linkedin },
    { label: "◈ Twitter",  url: CONTACT_DATA.twitter,            show: !!CONTACT_DATA.twitter  },
    ...CONTACT_DATA.other.map(o => ({ label: o.label, url: o.url, show: true })),
  ].filter(l => l.show);

  return (
    <div style={styles.content}>
      <p style={{ ...styles.body, marginBottom: "1.8rem" }}>
        편하게 연락주세요 :)
      </p>
      <div style={{ display: "flex", flexDirection: "column", gap: "0.9rem" }}>
        {links.map((l, i) => (
          <a key={i} href={l.url} target="_blank" rel="noreferrer" style={styles.contactLink}>
            {l.label}
          </a>
        ))}
      </div>
    </div>
  );
}

// ── 메인 모달 ─────────────────────────────────
export default function PortfolioModal({ type, onClose }: Props) {
  const overlayRef = useRef<HTMLDivElement>(null);

  // ESC 키로 닫기
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  // 오버레이 클릭 시 닫기
  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === overlayRef.current) onClose();
  };

  const ContentMap: Record<ModalType, React.ReactNode> = {
    about:    <AboutContent />,
    projects: <ProjectsContent />,
    skills:   <SkillsContent />,
    contact:  <ContactContent />,
  };

  return (
    <div ref={overlayRef} style={styles.overlay} onClick={handleOverlayClick}>
      <div style={styles.modal}>

        {/* 별 파티클 배경 장식 */}
        <div style={styles.starsBg} aria-hidden />

        {/* 헤더 */}
        <div style={styles.header}>
          <span style={styles.title}>{TITLES[type]}</span>
          <button style={styles.closeBtn} onClick={onClose} aria-label="닫기">✕</button>
        </div>

        {/* 구분선 */}
        <div style={styles.headerDivider} />

        {/* 스크롤 콘텐츠 */}
        <div style={styles.scrollArea}>
          {ContentMap[type]}
        </div>

      </div>
    </div>
  );
}

// ── 스타일 ────────────────────────────────────
const styles: Record<string, React.CSSProperties> = {
  overlay: {
    position:       "fixed",
    inset:          0,
    zIndex:         100,
    display:        "flex",
    alignItems:     "center",
    justifyContent: "center",
    backgroundColor: "rgba(0, 0, 0, 0.65)",
    backdropFilter: "blur(4px)",
    WebkitBackdropFilter: "blur(4px)",
  },
  modal: {
    position:        "relative",
    width:           "min(560px, 90vw)",
    maxHeight:       "80vh",
    backgroundColor: "#08071A",
    border:          "1px solid rgba(140, 100, 255, 0.4)",
    borderRadius:    "16px",
    boxShadow:       "0 0 40px rgba(100, 60, 255, 0.25), 0 0 80px rgba(60, 20, 120, 0.15)",
    overflow:        "hidden",
    display:         "flex",
    flexDirection:   "column",
  },
  starsBg: {
    position:         "absolute",
    inset:            0,
    backgroundImage:  `
      radial-gradient(1px 1px at 15% 20%, rgba(255,255,255,0.5) 0%, transparent 100%),
      radial-gradient(1px 1px at 75% 15%, rgba(255,255,255,0.4) 0%, transparent 100%),
      radial-gradient(1px 1px at 45% 80%, rgba(255,255,255,0.3) 0%, transparent 100%),
      radial-gradient(1px 1px at 85% 60%, rgba(255,255,255,0.4) 0%, transparent 100%),
      radial-gradient(1px 1px at 25% 70%, rgba(255,255,255,0.3) 0%, transparent 100%),
      radial-gradient(1px 1px at 60% 40%, rgba(255,255,255,0.2) 0%, transparent 100%),
      radial-gradient(2px 2px at 90% 85%, rgba(180,140,255,0.4) 0%, transparent 100%),
      radial-gradient(2px 2px at 10% 90%, rgba(140,100,255,0.3) 0%, transparent 100%)
    `,
    pointerEvents:    "none",
    zIndex:           0,
  },
  header: {
    position:       "relative",
    zIndex:         1,
    display:        "flex",
    alignItems:     "center",
    justifyContent: "space-between",
    padding:        "1.4rem 1.6rem 1rem",
  },
  title: {
    color:       "#C8B0FF",
    fontSize:    "1rem",
    fontWeight:  700,
    letterSpacing: "0.12em",
    textShadow:  "0 0 12px rgba(180,140,255,0.6)",
  },
  closeBtn: {
    background:  "none",
    border:      "1px solid rgba(140,100,255,0.3)",
    borderRadius: "50%",
    width:       "2rem",
    height:      "2rem",
    color:       "rgba(200,180,255,0.7)",
    cursor:      "pointer",
    fontSize:    "0.85rem",
    display:     "flex",
    alignItems:  "center",
    justifyContent: "center",
    transition:  "all 0.2s",
  },
  headerDivider: {
    height:     "1px",
    margin:     "0 1.6rem",
    background: "linear-gradient(90deg, transparent, rgba(140,100,255,0.5), transparent)",
    zIndex:     1,
    position:   "relative",
  },
  scrollArea: {
    position:   "relative",
    zIndex:     1,
    overflowY:  "auto",
    padding:    "0 1.6rem 1.6rem",
    flex:       1,
    scrollbarWidth: "thin",
    scrollbarColor: "rgba(140,100,255,0.3) transparent",
  },
  content: {
    paddingTop: "1.2rem",
  },
  name: {
    color:      "#E8E0FF",
    fontSize:   "1.5rem",
    fontWeight: 700,
    margin:     "0 0 0.3rem",
  },
  role: {
    color:       "#A090D0",
    fontSize:    "0.9rem",
    letterSpacing: "0.08em",
    margin:      "0 0 1rem",
  },
  intro: {
    color:      "#C8C0E8",
    fontSize:   "0.95rem",
    lineHeight: 1.7,
    margin:     "0 0 1rem",
  },
  divider: {
    height:     "1px",
    margin:     "1rem 0",
    background: "linear-gradient(90deg, transparent, rgba(140,100,255,0.3), transparent)",
  },
  body: {
    color:      "rgba(200,195,225,0.85)",
    fontSize:   "0.9rem",
    lineHeight: 1.75,
    margin:     "0 0 0.8rem",
  },
  subheading: {
    color:       "#B0A0E0",
    fontSize:    "0.82rem",
    fontWeight:  600,
    letterSpacing: "0.1em",
    margin:      "0 0 0.7rem",
  },
  list: {
    listStyle:  "none",
    padding:    0,
    margin:     "0 0 1rem",
  },
  listItem: {
    color:      "rgba(200,195,225,0.8)",
    fontSize:   "0.88rem",
    lineHeight: 1.7,
    paddingLeft: "0.5rem",
    marginBottom: "0.3rem",
  },
  tagRow: {
    display:   "flex",
    flexWrap:  "wrap",
    gap:       "0.4rem",
  },
  tag: {
    backgroundColor: "rgba(100,60,200,0.25)",
    border:          "1px solid rgba(140,100,255,0.35)",
    borderRadius:    "4px",
    color:           "#C0B0F0",
    fontSize:        "0.78rem",
    padding:         "0.2rem 0.6rem",
    letterSpacing:   "0.04em",
  },
  projectCard: {
    backgroundColor: "rgba(255,255,255,0.03)",
    border:          "1px solid rgba(140,100,255,0.15)",
    borderRadius:    "10px",
    padding:         "1rem 1.1rem",
    marginBottom:    "1rem",
  },
  projectHeader: {
    display:        "flex",
    alignItems:     "center",
    justifyContent: "space-between",
    marginBottom:   "0.5rem",
  },
  projectTitle: {
    color:      "#D8D0FF",
    fontSize:   "1rem",
    fontWeight: 600,
    margin:     0,
  },
  link: {
    color:          "#A090FF",
    fontSize:       "0.8rem",
    textDecoration: "none",
    letterSpacing:  "0.04em",
  },
  contactLink: {
    display:         "block",
    color:           "#B8A8F0",
    fontSize:        "0.95rem",
    textDecoration:  "none",
    padding:         "0.7rem 1rem",
    border:          "1px solid rgba(140,100,255,0.2)",
    borderRadius:    "8px",
    backgroundColor: "rgba(100,60,200,0.12)",
    letterSpacing:   "0.04em",
    transition:      "all 0.2s",
  },
};