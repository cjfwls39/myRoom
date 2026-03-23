/**
 * portfolioData.ts — 포트폴리오 콘텐츠 데이터
 *
 * 여기만 수정하면 팝업 내용이 바뀝니다.
 */

// ── About Me ──────────────────────────────────
export const ABOUT_DATA = {
  name:     "정철진",
  role:     "Full Stack Developer",
  intro:    "안녕하세요! 아이디어를 실천으로 만드는 주니어 개발자 정철진 입니다!",
  bio: [
    "어떤 아이디어를 가지고 사이트를 만들어야 모두에게 도움이 될까",
    "어떻게 만들어야 사이트를 이용하는 모두가 불편하지 않을까",
    "항상 생각하며 웹 개발에 임하고 있습니다",
    "저는 이러한 생각이 회사에, 개발에, 그리고 모두에 도움이 된다고 생각됩니다."
  ],
  ps: [
    "PROJECTS탭 에서는 지금까지의 제 발자취를 볼 수 있습니다.",
    "편하게 보시고 마음에 드신다면 연락 주세요!",
  ],
};

// ── Skills ────────────────────────────────────
export const SKILLS_DATA = [
  {
    category: "Frontend",
    items: ["JavaScript","React", "Next.js", "TypeScript", "Three.js"],
  },
  {
    category: "Backend",
    items: ["Node.js", "Java"],
  },
  {
    category: "DevOps",
    items: ["AWS","Render","Git",],
  },
];

// ── Projects ──────────────────────────────────
export const PROJECTS_DATA = [
  {
    title:       "ShieldBox.io: Security Simulator",
    description: "추상적인 암호학 개념을 직접 체험할 수 있는 인터랙티브 보안 교육 플랫폼입니다.",
    skills:      ["React", "Tailwind CSS","Node.js","Socket.io","Render"],
    link:        "https://shieldbox-io.onrender.com/",  // 호스팅 링크, 없으면 "" 로 비워두세요
    github:      "https://github.com/cjfwls39/ShieldBox.io.git",  // 깃허브 링크, 없으면 "" 로 비워두세요
  },
  {
    title:       "프로젝트 이름 2",
    description: "프로젝트 설명을 여기에 작성하세요.",
    skills:      ["Next.js", "TypeScript"],
    link:        "",
    github:      "",
  },
];

// ── Contact ───────────────────────────────────
export const CONTACT_DATA = {
  email:    "cjfwls39@naver.com",
  phone:    "010-8464-6539",  // 없으면 "" 로 비워두세요
  github:   "https://github.com/cjfwls39",
  linkedin: "",               // 없으면 "" 로 비워두세요
  twitter:  "",
  other:    [] as { label: string; url: string }[],
};