"use client";

import { useEffect, useRef, useState } from "react";
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

const TITLES: Record<ModalType, string> = {
  about:    "ABOUT ME",
  projects: "PROJECTS",
  skills:   "SKILLS",
  contact:  "CONTACT",
};

// ── About ─────────────────────────────────────────────────────
function AboutContent() {
  const hasAvatar = !!ABOUT_DATA.avatar;
  const initials  = ABOUT_DATA.name.slice(0, 2);

  return (
    <div>
      {/* 프로필 헤더 */}
      <div style={{ display: "flex", gap: "1.4rem", alignItems: "flex-start", marginBottom: "1.6rem" }}>
        {/* 아바타 */}
        <div style={{
          width: "80px", height: "80px", borderRadius: "50%",
          flexShrink: 0, overflow: "hidden",
          border: "2px solid rgba(140,100,255,0.4)",
          background: "rgba(100,60,200,0.2)",
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          {hasAvatar ? (
            <img src={ABOUT_DATA.avatar} alt="profile"
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
              onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
            />
          ) : (
            <span style={{ color: "#C8B0FF", fontSize: "1.4rem", fontWeight: 700 }}>{initials}</span>
          )}
        </div>
        {/* 이름/역할 */}
        <div style={{ flex: 1 }}>
          <p style={{ color: "#E8E0FF", fontSize: "1.4rem", fontWeight: 700, margin: "0 0 0.3rem" }}>
            {ABOUT_DATA.name}
          </p>
          <p style={{ color: "#A090D0", fontSize: "0.82rem", letterSpacing: "0.1em", margin: "0 0 0.5rem" }}>
            {ABOUT_DATA.role}
          </p>
          <p style={{ color: "#8878C0", fontSize: "0.8rem", margin: 0 }}>{ABOUT_DATA.tagline}</p>
        </div>
      </div>

      {/* 소개 */}
      <p style={s.body}>{ABOUT_DATA.intro}</p>

      {/* 경력 */}
      {ABOUT_DATA.experience.length > 0 && (
        <>
          <SectionLabel>경력</SectionLabel>
          {ABOUT_DATA.experience.map((ex, i) => (
            <div key={i} style={s.timelineItem}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "0.25rem" }}>
                <span style={{ color: "#D0C8FF", fontWeight: 600, fontSize: "0.92rem" }}>{ex.role}</span>
                <span style={{ color: "#7868A8", fontSize: "0.75rem" }}>{ex.period}</span>
              </div>
              <p style={{ color: "#9888C8", fontSize: "0.8rem", margin: "0 0 0.3rem" }}>{ex.company}</p>
              <p style={{ color: "rgba(200,195,225,0.75)", fontSize: "0.85rem", lineHeight: 1.6, margin: 0, whiteSpace: "pre-line" }}>{ex.desc}</p>
            </div>
          ))}
        </>
      )}

      {/* 학력 */}
      {ABOUT_DATA.education.length > 0 && (
        <>
          <SectionLabel>학력</SectionLabel>
          {ABOUT_DATA.education.map((ed, i) => (
            <div key={i} style={s.timelineItem}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                <span style={{ color: "#D0C8FF", fontWeight: 600, fontSize: "0.92rem" }}>{ed.school}</span>
                <span style={{ color: "#7868A8", fontSize: "0.75rem" }}>{ed.period}</span>
              </div>
              <p style={{ color: "#9888C8", fontSize: "0.8rem", margin: "0.2rem 0 0" }}>{ed.major}</p>
            </div>
          ))}
        </>
      )}

      {/* PS */}
      {ABOUT_DATA.ps.length > 0 && (
        <>
          <div style={s.divider} />
          {ABOUT_DATA.ps.map((p, i) => (
            <p key={i} style={{ ...s.body, color: "rgba(180,170,220,0.65)", fontSize: "0.82rem" }}>
              ✦ {p}
            </p>
          ))}
        </>
      )}
    </div>
  );
}

// ── Skills ────────────────────────────────────────────────────
function SkillsContent() {
  return (
    <div>
      {SKILLS_DATA.map((group, i) => (
        <div key={i} style={{ marginBottom: "1.6rem" }}>
          <SectionLabel>{group.category}</SectionLabel>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.65rem" }}>
            {group.items.map((skill, j) => (
              <div key={j}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.3rem" }}>
                  <span style={{ color: "#D0C8F8", fontSize: "0.88rem" }}>{skill.name}</span>
                  <span style={{ color: "#7868A8", fontSize: "0.75rem" }}>
                    {"●".repeat(skill.level)}{"○".repeat(5 - skill.level)}
                  </span>
                </div>
                <div style={{ height: "4px", borderRadius: "2px", background: "rgba(140,100,255,0.15)", overflow: "hidden" }}>
                  <div style={{
                    height: "100%",
                    width:  `${skill.level / 5 * 100}%`,
                    borderRadius: "2px",
                    background: "linear-gradient(90deg, #7040CC, #A080FF)",
                    transition: "width 0.6s ease",
                  }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

// ── Projects ──────────────────────────────────────────────────
function ImageCarousel({ images }: { images: string[] }) {
  const [idx, setIdx] = useState(0);

  if (images.length === 0) {
    return (
      <div style={{
        height: "180px", borderRadius: "8px",
        background: "rgba(100,60,200,0.12)",
        border: "1px dashed rgba(140,100,255,0.25)",
        display: "flex", alignItems: "center", justifyContent: "center",
        marginBottom: "1rem",
      }}>
        <span style={{ color: "rgba(140,100,255,0.4)", fontSize: "0.8rem", letterSpacing: "0.1em" }}>
          NO PREVIEW
        </span>
      </div>
    );
  }

  return (
    <div style={{ position: "relative", marginBottom: "1rem" }}>
      <img
        src={images[idx]} alt={`screenshot-${idx}`}
        style={{ width: "100%", height: "180px", objectFit: "cover", borderRadius: "8px", display: "block" }}
      />
      {images.length > 1 && (
        <>
          <button onClick={() => setIdx(p => (p - 1 + images.length) % images.length)} style={s.carouselBtn("left")}>‹</button>
          <button onClick={() => setIdx(p => (p + 1) % images.length)} style={s.carouselBtn("right")}>›</button>
          <div style={{ position: "absolute", bottom: "0.5rem", left: "50%", transform: "translateX(-50%)", display: "flex", gap: "0.3rem" }}>
            {images.map((_, i) => (
              <div key={i} onClick={() => setIdx(i)} style={{
                width: "6px", height: "6px", borderRadius: "50%",
                background: i === idx ? "#A080FF" : "rgba(140,100,255,0.3)",
                cursor: "pointer",
              }} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

function ProjectsContent() {
  return (
    <div>
      {PROJECTS_DATA.map((proj, i) => (
        <div key={i} style={s.projectCard}>
          <ImageCarousel images={proj.images} />

          {/* 헤더 */}
          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "0.5rem", marginBottom: "0.6rem" }}>
            <div style={{ flex: 1 }}>
              <p style={{ color: "#D8D0FF", fontSize: "1rem", fontWeight: 700, margin: "0 0 0.2rem" }}>{proj.title}</p>
              <span style={{
                fontSize: "0.72rem", letterSpacing: "0.08em",
                color:  proj.status === "completed" ? "#70D0A0" : "#F0B040",
                background: proj.status === "completed" ? "rgba(70,200,120,0.12)" : "rgba(240,180,40,0.12)",
                border: `1px solid ${proj.status === "completed" ? "rgba(70,200,120,0.25)" : "rgba(240,180,40,0.25)"}`,
                borderRadius: "4px", padding: "0.15rem 0.5rem",
              }}>
                {proj.status === "completed" ? "✓ 완료" : "⟳ 진행중"}
              </span>
            </div>
            <span style={{ color: "#7868A8", fontSize: "0.78rem", flexShrink: 0 }}>{proj.period}</span>
          </div>

          {/* 요약 */}
          <p style={{ ...s.body, marginBottom: "0.8rem" }}>{proj.summary}</p>

          {/* 주요 기능 */}
          {proj.features.length > 0 && (
            <ul style={{ listStyle: "none", padding: 0, margin: "0 0 0.9rem" }}>
              {proj.features.map((f, j) => (
                <li key={j} style={{ color: "rgba(200,195,225,0.8)", fontSize: "0.85rem", lineHeight: 1.6, paddingLeft: "1rem", position: "relative" }}>
                  <span style={{ position: "absolute", left: 0, color: "#8060C0" }}>▸</span>
                  {f}
                </li>
              ))}
            </ul>
          )}

          {/* 태그 */}
          <div style={{ ...s.tagRow, marginBottom: "0.9rem" }}>
            {proj.skills.map((sk, j) => (
              <span key={j} style={s.tag}>{sk}</span>
            ))}
          </div>

          {/* 링크 */}
          <div style={{ display: "flex", gap: "0.6rem" }}>
            {proj.github && (
              <a href={proj.github} target="_blank" rel="noreferrer" style={s.linkBtn}>◈ GitHub</a>
            )}
            {proj.link && (
              <a href={proj.link} target="_blank" rel="noreferrer" style={{ ...s.linkBtn, background: "rgba(100,60,200,0.25)", borderColor: "rgba(140,100,255,0.4)" }}>↗ 사이트</a>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

// ── Contact ───────────────────────────────────────────────────
function ContactContent() {
  const [copied, setCopied] = useState<string | null>(null);

  const items = [
    { label: "✉  Email",    value: CONTACT_DATA.email,    show: !!CONTACT_DATA.email,    link: false },
    { label: "☏  Phone",    value: CONTACT_DATA.phone,    show: !!CONTACT_DATA.phone,    link: false },
    { label: "◈  GitHub",   value: CONTACT_DATA.github,   show: !!CONTACT_DATA.github,   link: true  },
    { label: "◈  LinkedIn", value: CONTACT_DATA.linkedin, show: !!CONTACT_DATA.linkedin, link: false },
    { label: "◈  Twitter",  value: CONTACT_DATA.twitter,  show: !!CONTACT_DATA.twitter,  link: false },
    ...CONTACT_DATA.other.map(o => ({ label: o.label, value: o.url, show: true, link: false })),
  ].filter(l => l.show);

  const handleCopy = (value: string) => {
    navigator.clipboard.writeText(value).then(() => {
      setCopied(value);
      setTimeout(() => setCopied(null), 2000);
    });
  };

  return (
    <div>
      <p style={{ ...s.body, marginBottom: "1.6rem", color: "rgba(200,195,225,0.7)" }}>
        편하게 연락주세요 :)
      </p>
      <div style={{ display: "flex", flexDirection: "column", gap: "0.7rem" }}>
        {items.map((l, i) => l.link ? (
          <a key={i} href={l.value} target="_blank" rel="noreferrer"
            style={{ ...s.contactLink, cursor: "pointer" }}
          >
            <span style={{ color: "#C8B8FF", fontWeight: 600, fontSize: "0.9rem" }}>{l.label}</span>
            <span style={{ color: "#7868A8", fontSize: "0.78rem", marginTop: "0.15rem", display: "block", wordBreak: "break-all" }}>
              {l.value}
            </span>
          </a>
        ) : (
          <div key={i} onClick={() => handleCopy(l.value)}
            style={{ ...s.contactLink, cursor: "pointer", position: "relative" }}
          >
            <span style={{ color: "#C8B8FF", fontWeight: 600, fontSize: "0.9rem" }}>{l.label}</span>
            <span style={{ color: "#7868A8", fontSize: "0.78rem", marginTop: "0.15rem", display: "block", wordBreak: "break-all" }}>
              {l.value}
            </span>
            {copied === l.value && (
              <span style={{
                position: "absolute", right: "1rem", top: "50%", transform: "translateY(-50%)",
                color: "#70D0A0", fontSize: "0.75rem", letterSpacing: "0.08em",
              }}>
                복사됨 ✓
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// ── 공통 섹션 레이블 ──────────────────────────────────────────
function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", margin: "1.2rem 0 0.8rem" }}>
      <span style={{ color: "#8060C0", fontSize: "0.72rem", letterSpacing: "0.12em", fontWeight: 700 }}>
        ✦ {children}
      </span>
      <div style={{ flex: 1, height: "1px", background: "linear-gradient(90deg, rgba(140,100,255,0.3), transparent)" }} />
    </div>
  );
}

// ── 메인 모달 ─────────────────────────────────────────────────
export default function PortfolioModal({ type, onClose }: Props) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const [closing, setClosing] = useState(false);

  const handleClose = () => {
    setClosing(true);
    setTimeout(onClose, 350);
  };

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") handleClose(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === overlayRef.current) handleClose();
  };

  const ContentMap: Record<ModalType, React.ReactNode> = {
    about:    <AboutContent />,
    projects: <ProjectsContent />,
    skills:   <SkillsContent />,
    contact:  <ContactContent />,
  };

  return (
    <div ref={overlayRef} style={s.overlay} onClick={handleOverlayClick}>
      <style>{`
        @keyframes modalIn {
          from { opacity: 0; transform: scale(0.92) translateY(12px); }
          to   { opacity: 1; transform: scale(1)    translateY(0);     }
        }
        @keyframes modalOut {
          from { opacity: 1; transform: scale(1)    translateY(0);     }
          to   { opacity: 0; transform: scale(0.92) translateY(12px);  }
        }
      `}</style>
      <div style={{
        ...s.modal,
        animation: closing
          ? "modalOut 0.32s cubic-bezier(0.22, 1, 0.36, 1) both"
          : "modalIn  0.45s cubic-bezier(0.22, 1, 0.36, 1) both",
      }}>
        <div style={s.starsBg} aria-hidden />

        {/* 헤더 */}
        <div style={s.header}>
          <div>
            <span style={s.title}>{TITLES[type]}</span>
          </div>
          <button style={s.closeBtn} onClick={handleClose} aria-label="닫기">✕</button>
        </div>
        <div style={s.headerDivider} />

        {/* 콘텐츠 */}
        <div style={s.scrollArea}>
          <div style={{ padding: "1.2rem 0 0.4rem" }}>
            {ContentMap[type]}
          </div>
        </div>
      </div>
    </div>
  );
}

// ── 스타일 ────────────────────────────────────────────────────
const s: Record<string, any> = {
  overlay: {
    position: "fixed", inset: 0, zIndex: 100,
    display: "flex", alignItems: "center", justifyContent: "center",
    backgroundColor: "rgba(0,0,0,0.7)",
    backdropFilter: "blur(5px)",
    WebkitBackdropFilter: "blur(5px)",
  },
  modal: {
    position: "relative",
    width: "min(660px, 92vw)",
    maxHeight: "85vh",
    backgroundColor: "#09071C",
    border: "1px solid rgba(140,100,255,0.35)",
    borderRadius: "18px",
    boxShadow: "0 0 50px rgba(100,60,255,0.2), 0 0 100px rgba(60,20,120,0.12)",
    overflow: "hidden",
    display: "flex",
    flexDirection: "column",
  },
  starsBg: {
    position: "absolute", inset: 0,
    backgroundImage: `
      radial-gradient(1px 1px at 15% 20%, rgba(255,255,255,0.45) 0%, transparent 100%),
      radial-gradient(1px 1px at 75% 15%, rgba(255,255,255,0.35) 0%, transparent 100%),
      radial-gradient(1px 1px at 45% 80%, rgba(255,255,255,0.25) 0%, transparent 100%),
      radial-gradient(1px 1px at 85% 60%, rgba(255,255,255,0.35) 0%, transparent 100%),
      radial-gradient(1px 1px at 25% 70%, rgba(255,255,255,0.25) 0%, transparent 100%),
      radial-gradient(2px 2px at 90% 85%, rgba(180,140,255,0.35) 0%, transparent 100%),
      radial-gradient(2px 2px at 10% 90%, rgba(140,100,255,0.25) 0%, transparent 100%)
    `,
    pointerEvents: "none", zIndex: 0,
  },
  header: {
    position: "relative", zIndex: 1,
    display: "flex", alignItems: "center", justifyContent: "space-between",
    padding: "1.3rem 1.6rem 0.9rem",
  },
  title: {
    color: "#C8B0FF", fontSize: "0.85rem", fontWeight: 700,
    letterSpacing: "0.2em",
    textShadow: "0 0 12px rgba(180,140,255,0.5)",
  },
  closeBtn: {
    background: "none",
    border: "1px solid rgba(140,100,255,0.3)",
    borderRadius: "50%",
    width: "2rem", height: "2rem",
    color: "rgba(200,180,255,0.7)",
    cursor: "pointer", fontSize: "0.85rem",
    display: "flex", alignItems: "center", justifyContent: "center",
    transition: "all 0.2s",
  },
  headerDivider: {
    height: "1px", margin: "0 1.6rem",
    background: "linear-gradient(90deg, transparent, rgba(140,100,255,0.45), transparent)",
    position: "relative", zIndex: 1,
  },
  scrollArea: {
    position: "relative", zIndex: 1,
    overflowY: "auto", padding: "0 1.6rem 1.6rem",
    flex: 1,
    scrollbarWidth: "thin",
    scrollbarColor: "rgba(140,100,255,0.3) transparent",
  },
  body: {
    color: "rgba(200,195,225,0.82)", fontSize: "0.9rem",
    lineHeight: 1.75, margin: "0 0 0.8rem",
    whiteSpace: "pre-line",
  },
  divider: {
    height: "1px", margin: "1.2rem 0",
    background: "linear-gradient(90deg, transparent, rgba(140,100,255,0.25), transparent)",
  },
  tagRow: { display: "flex", flexWrap: "wrap", gap: "0.4rem" },
  tag: {
    backgroundColor: "rgba(100,60,200,0.22)",
    border: "1px solid rgba(140,100,255,0.3)",
    borderRadius: "4px", color: "#C0B0F0",
    fontSize: "0.75rem", padding: "0.18rem 0.55rem",
    letterSpacing: "0.04em",
  },
  timelineItem: {
    borderLeft: "2px solid rgba(140,100,255,0.25)",
    paddingLeft: "1rem", marginBottom: "1rem",
  },
  projectCard: {
    backgroundColor: "rgba(255,255,255,0.025)",
    border: "1px solid rgba(140,100,255,0.15)",
    borderRadius: "12px", padding: "1.1rem",
    marginBottom: "1.2rem",
  },
  linkBtn: {
    display: "inline-block",
    color: "#A090FF", fontSize: "0.78rem",
    textDecoration: "none", letterSpacing: "0.04em",
    padding: "0.35rem 0.8rem",
    border: "1px solid rgba(140,100,255,0.3)",
    borderRadius: "6px",
    background: "rgba(100,60,200,0.12)",
    transition: "all 0.2s",
  },
  contactLink: {
    display: "block", textDecoration: "none",
    padding: "0.8rem 1rem",
    border: "1px solid rgba(140,100,255,0.18)",
    borderRadius: "10px",
    backgroundColor: "rgba(100,60,200,0.1)",
    transition: "all 0.2s",
  },
  carouselBtn: (side: "left" | "right") => ({
    position: "absolute", top: "50%", transform: "translateY(-50%)",
    [side]: "0.5rem",
    background: "rgba(0,0,0,0.55)", border: "none",
    color: "#fff", fontSize: "1.4rem", cursor: "pointer",
    width: "2rem", height: "2rem", borderRadius: "50%",
    display: "flex", alignItems: "center", justifyContent: "center",
    lineHeight: 1,
  }),
};
