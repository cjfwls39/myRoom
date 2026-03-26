/**
 * portfolioData.ts — 포트폴리오 콘텐츠 데이터
 *
 * 여기만 수정하면 팝업 내용이 바뀝니다.
 */

// ── About Me ──────────────────────────────────
export const ABOUT_DATA = {
  name:     "정철진",
  role:     "항상 흥미로운 일거리를 찾아다니는 개발자",
  intro:    "안녕하세요! 아이디어를 실천으로 만드는 주니어 개발자 정철진 입니다!",
  bio: [
    "저는 웹이 정말 좋습니다.",
    "기기와 인터넷만 있으면 누구든 제 작업물에 즉시 접근할 수 있기 때문입니다.",
    "또한 작업물을 게시하고 공유하는 것도 아주 간단합니다",
    "시간이 남으면 항상 흥미로운 아이디어를 찾아 나섭니다. 그 아이디어를 기반으로",
    "웹 프로젝트를 많이 작업하고 있습니다. 아이디어와 디자인, 개발이 만나는 지점에서",
    "큰 흥미를 느끼고 새로운 것을 배우고 주저없이 적용해 보는것을 좋아합니다.",
  ],
  ps: [
    "자유롭게 탐험해 보세요! 즐거운 시간 되시길 바랍니다!",
    "PROJECT 탭에서는 제 멋진 결과물을 보실 수 있습니다!",
    "방문해 주셔서 감사합니다!"
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
    description: [
    //3줄가면 너무 길어지니 딱 2줄까지만 입력하는게 가장 적당
    "비밀번호를 왜 무작위로 길게 만들어야 안전한걸까?",
    "추상적인 암호학 개념을 체험할 수 있는 인터랙티브 보안 교육 플랫폼입니다."
    ],  
    skills:      ["React", "Tailwind CSS","Node.js","Socket.io","Render"],
    link:        "https://shieldbox-io.onrender.com/",  // 호스팅 링크, 없으면 "" 로 비워두세요
    github:      "https://github.com/cjfwls39/ShieldBox.io.git",  // 깃허브 링크, 없으면 "" 로 비워두세요
  }
];

// ── Contact ───────────────────────────────────
export const CONTACT_DATA = {
  email:    "cjfwls39@naver.com",
  phone:    "010-8464-6539",  // 없으면 "" 로 비워두세요
  github:   "https://github.com/cjfwls39",
  linkedin: "",               // 없으면 "" 로 비워두세요
  twitter:  "",               // 없으면 "" 로 비워두세요
  other:    [] as { label: string; url: string }[],
};