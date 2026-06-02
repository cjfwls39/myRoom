/**
 * portfolioData.ts — 포트폴리오 콘텐츠 데이터
 * 여기만 수정하면 모달 내용이 전부 바뀝니다.
 * 
 * 줄바꿈은 텍스트 중간 \n 로 가능
 * 
 * 이미지는 고해상도로 정해진 경로에 정확히 저장할것
 * 프로필 사진 = /public/images/
 * 프로젝트 사진 = /public/images/projects/
 */

// ── About Me ──────────────────────────────────────────────────
export const ABOUT_DATA = {
  name:   "정철진",
  role:   "WEB DEVELOPER",
  tagline: "아이디어를 실천으로 만드는 주니어 개발자",
  avatar: "/images/profile.jpg",   // /public/images/ 에 사진 넣으면 표시됩니다. 없으면 이니셜 표시

  intro:
    "안녕하세요! 웹이 가진 접근성과 가능성에 매력을 느껴 개발을 시작했습니다.\n " +
    "아이디어와 디자인, 개발이 만나는 지점에서 큰 흥미를 느끼며\n" +
    "새로운 것을 빠르게 배우고 주저없이 적용해보는 것을 좋아합니다.",

  experience: [
    // 신입일때는 어차피 없을꺼라 비워도도 상관 없을거지만
    // 나중에 이 사이트를 이직할때도 쓰겠다 하면 이부분 사용 고려
    // {
    //   role:    "Frontend Developer",
    //   company: "회사명",
    //   period:  "2024.03 — 현재",
    //   desc:    "담당한 주요 업무나 성과를 간략히 작성하세요.",
    // },
  ] as { role: string; company: string; period: string; desc: string }[],

  education: [
    {
      school: "안산대학교",
      major:  "컴퓨터정보학과",
      period: "2021.03 — 2026.02",
    },
    {
      school: "경기모바일과학고등학교",
      major:  "모바일컨텐츠과",
      period: "2017.03 — 2020.01",
    }
  ] as { school: string; major: string; period: string }[],

  ps: [
    "자유롭게 탐험해 보세요! 즐거운 시간 되시길 바랍니다 :)",
    "PROJECT 탭에서 제 작품들을 확인하실 수 있습니다!",
    "방문해 주셔서 감사드립니다!"
  ],
};

// ── Skills ────────────────────────────────────────────────────
// 카테고리별 기술명만 배열로 나열하면 모달에 배지(로고+색)로 표시됩니다.
// 기술 추가/삭제는 items 배열에 문자열만 넣고 빼면 됩니다.
// (로고·색은 PortfolioModal.tsx 의 SKILL_META 에서 관리)
export const SKILLS_DATA = [
  {
    category: "Frontend",
    items: ["HTML5", "CSS3", "Tailwind", "JavaScript", "TypeScript"],
  },
  {
    category: "Frameworks & Libraries",
    items: ["React", "Next.js", "Three.js", "Electron", "Tauri"],
  },
  {
    category: "DevOps",
    items: ["AWS", "Render", "Git"],
  },
  {
    category: "Backend",
    items: ["Node.js", "Java", "Spring", "JSP"],
  },
  {
    category: "Database & BaaS",
    items: ["MySQL", "Supabase"],
  },
];

// ── Projects ──────────────────────────────────────────────────
//
//  이 배열이 두 곳에서 동시에 쓰입니다:
//    1) 박물관(3D 갤러리)에 전시물(액자)로 자동 전시됨
//    2) 전시물 클릭 시 뜨는 상세 패널 내용
//
//  ▶ 프로젝트 추가/삭제는 이 배열만 수정하면 됩니다.
//  ▶ 단, 전시물 "개수"를 바꾸면 박물관 전시 위치도 맞춰야 합니다:
//     → src/components/museum/GalleryRoom.tsx 의 EXHIBIT_ZS / SIDES
//       (자세한 규칙은 그 파일 상단 주석 참고)
//
//  필드 설명:
//    title    : 프로젝트명 (한글 포함 시 자동으로 한글 폰트 적용)
//    period   : 기간 표기
//    status   : "completed"(완료) | "inprogress"(진행중) — 뱃지 색 결정
//    images   : /public/images/projects/ 경로. 여러 장이면 캐러셀, 없으면 placeholder
//    summary  : 요약 (줄바꿈은 \n)
//    features : 주요 기능 목록 (▸ 불릿으로 표시)
//    skills   : 기술 스택 태그
//    link     : 배포 사이트 URL (없으면 버튼 숨김)
//    github   : 저장소 URL (없으면 버튼 숨김)
//
export const PROJECTS_DATA = [
  {
    title:    "ShieldBox.io: Security Simulator",
    period:   "2026",
    status:   "completed" as "completed" | "inprogress",

    // /public/images/projects/ 에 이미지를 넣으세요
    // 여러 장 넣으면 캐러셀로 표시됩니다. 없으면 placeholder 표시
    images: [
      "/images/projects/shieldBox.io_1.png",
      "/images/projects/shieldBox.io_2.png",
    ] as string[],

    summary:
      "비밀번호를 무작위로 길게 만들면 안전하다! 대체 왜그럴까요?\n" +
      "추상적인 암호학 개념을 직접 체험할 수 있는 인터랙티브 보안 교육 플랫폼입니다.",

    features: [
      "다양한 공격 기법 실시간 시뮬레이션",
      "4개 섹션으로 구성된 인터랙티브 학습 콘텐츠",
      "비밀번호 강도 시각화 및 해시 함수 체험",
    ],

    skills:  ["React", "Tailwind CSS", "Node.js", "Socket.io", "Render"],
    link:    "https://shieldbox-io.onrender.com/",
    github:  "https://github.com/cjfwls39/ShieldBox.io.git",
  },

  {
    title:    "약방 (YackBang)",
    period:   "2026",
    status:   "completed" as "completed" | "inprogress",

    // /public/images/projects/ 에 이미지를 넣으세요
    // 여러 장 넣으면 캐러셀로 표시됩니다. 없으면 placeholder 표시
    images: [
      "/images/projects/YackBang1.png",
      "/images/projects/YackBang2.png",
    ] as string[],

    summary:
      "복용 중인 약이 함께 먹어도 되는지, 전문 용어 없이 쉽게 확인하세요.\n" +
      "식약처 DUR(의약품 사용 재검토) 데이터를 기반으로 의약품 병용금기 정보를\n" +
      "일반인도 이해할 수 있는 언어로 제공하는 서비스입니다.",

    features: [
      "의약품 검색 & 병용금기 조회",
      "실생활 위험 조합 가이드",
      "URL 공유 & 최근 기록",
      "모바일 최적화 & PWA",
    ],

    skills:  ["React", "Tailwind CSS", "Node.js", "Next", "Vercel", "Supabase","TypeScript"],
    link:    "https://yack-bang.vercel.app/",
    github:  "https://github.com/cjfwls39/YackBang.git",
  },

  {
    title:    "Cleanse",
    period:   "2026",
    status:   "completed" as "completed" | "inprogress",

    // /public/images/projects/ 에 이미지를 넣으세요
    // 여러 장 넣으면 캐러셀로 표시됩니다. 없으면 placeholder 표시
    images: [
      "/images/projects/cleanse_1.png",
      "/images/projects/cleanse_2.png",
    ] as string[],

    summary:
      "프로젝트를 오래 운영하다 보면 어느새 쌓이는 것들이 많습니다.\n" +
      "일일이 찾는건 힘들고 귀찮고, AI는 비싸고 그래서 만들었습니다.",

    features: [
      "미사용 파일 탐지 / 데드 Export 탐지 / 순환 참조 탐지",
      "미사용 패키지 탐지 / 반복 값 정리 / AI 판정",
      "Cleanse는 TypeScript / JavaScript 프로젝트의 코드 품질을 자동으로 점검하고,",
      "안전하게 정리할 수 있도록 돕는 데스크톱 애플리케이션입니다."
    ],

    skills:  ["Electron","React","TypeScript","Tailwind CSS","Zustand","ts-morph","Ollama (Qwen3:4b)"],
    link:    "https://github.com/cjfwls39/cleanse/releases/tag/v1.0.0",
    github:  "https://github.com/cjfwls39/cleanse.git",
  }
];

// ── Contact ───────────────────────────────────────────────────
export const CONTACT_DATA = {
  email:    "cjfwls39@naver.com",
  phone:    "010-8464-6539",
  github:   "https://github.com/cjfwls39",
  linkedin: "",
  twitter:  "",
  other:    [] as { label: string; url: string }[],
};
