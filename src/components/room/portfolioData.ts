/**
 * portfolioData.ts — 포트폴리오 콘텐츠 데이터
 *
 * 여기만 수정하면 팝업 내용이 바뀝니다.
 */

// ── About Me ──────────────────────────────────
export const ABOUT_DATA = {
  name:     "이름",
  role:     "Frontend Developer",
  intro:    "안녕하세요! 한 줄 자기소개를 여기에 작성하세요.",
  bio: [
    "자신에 대한 설명을 여기에 작성하세요.",
    "두 번째 단락을 여기에 작성하세요.",
  ],
  currently: [
    "현재 하고 있는 것 1",
    "현재 하고 있는 것 2",
  ],
};

// ── Skills ────────────────────────────────────
export const SKILLS_DATA = [
  {
    category: "Frontend",
    items: ["React", "Next.js", "TypeScript", "Three.js"],
  },
  {
    category: "Backend",
    items: ["Node.js", "항목 추가"],
  },
  {
    category: "Tools",
    items: ["Git", "항목 추가"],
  },
];

// ── Projects ──────────────────────────────────
export const PROJECTS_DATA = [
  {
    title:       "프로젝트 이름",
    description: "프로젝트 설명을 여기에 작성하세요.",
    skills:      ["React", "Three.js"],
    link:        "https://github.com",   // 링크 없으면 "" 로 비워두세요
  },
  {
    title:       "프로젝트 이름 2",
    description: "프로젝트 설명을 여기에 작성하세요.",
    skills:      ["Next.js", "TypeScript"],
    link:        "",
  },
];

// ── Contact ───────────────────────────────────
export const CONTACT_DATA = {
  email:    "your@email.com",
  phone:    "010-0000-0000",  // 없으면 "" 로 비워두세요
  github:   "https://github.com/yourname",
  linkedin: "",               // 없으면 "" 로 비워두세요
  twitter:  "",
  other:    [] as { label: string; url: string }[],
};