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
//    title      : 프로젝트명 (한글 포함 시 자동으로 한글 폰트 적용)
//    period     : 기간 표기
//    status     : "completed"(완료) | "inprogress"(진행중) — 뱃지 색 결정
//    images     : /public/images/projects/ 경로. 여러 장이면 캐러셀, 없으면 placeholder
//    summary    : 한 줄 요약 (줄바꿈은 \n)
//    background : 💡 왜 만들었나 — 문제의식·동기 (선택, 비우면 섹션 숨김)
//    approach   : 🛠 어떻게 만들었나 — 기술 선택 이유·구현 포인트·고민 (선택, 비우면 숨김)
//    features   : 주요 기능 목록 (▸ 불릿으로 표시)
//    skills     : 기술 스택 태그
//    link       : 배포 사이트 URL (없으면 버튼 숨김)
//    github     : 저장소 URL (없으면 버튼 숨김)
//
//  ※ background / approach 는 면접관에게 "사고 과정"을 보여주는 핵심 항목입니다.
//    링크를 안 타고도 읽을 수 있도록 채워두면 좋습니다.
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

    background:
      "\"왜 비밀번호를 길고 무작위로 만들면 안전한 걸까?\"\n" +
      "이 단순한 질문에서 시작된 프로젝트입니다. 모두가 그렇게 권하지만,\n" +
      "정작 그것이 왜, 그리고 얼마나 안전한지는 직접 체감할 방법이 없었습니다.",

    approach:
      "처음에는 서버(Node.js)에서 해싱을 직접 수행했지만, scrypt를 고비용 파라미터로 돌리면\n" +
      "수 GB의 메모리가 필요해 Render 무료 플랜(512MB)에서 서버가 다운됐습니다. 그렇다고\n" +
      "메모리를 지키려 파라미터를 강제로 낮추면 '내가 설정한 값이 실제로 얼마나 안전한지\n" +
      "체험한다'는 핵심 목적이 사라졌습니다.\n\n" +
      "그래서 해싱 연산을 브라우저(hash-wasm · WebAssembly)로 옮기고, 서버는 해시 포맷 검증과\n" +
      "공격 시뮬레이션만 담당하는 Hybrid Client-Server 구조로 재설계했습니다. hash-wasm은\n" +
      "C 레퍼런스 구현을 WASM으로 컴파일한 것이라 서버 결과와 수학적으로 동일해, 성능 한계를\n" +
      "해결하면서도 정확성을 그대로 유지할 수 있었습니다.",

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

    background:
      "감기로 고생하던 어느 날, 타이레놀이 잘 듣지 않는 듯하여 다른 감기약을\n" +
      "함께 복용하려 했습니다. 그러다 우연히 약 뒷면의 병용금기 안내를 발견했습니다.\n" +
      "약을 함께 먹어도 되는지조차 일반인이 알기 어렵다는 사실을 그때 깨달았고,\n" +
      "누구나 쉽게 확인할 수 있는 서비스가 필요하다고 생각해 만들게 되었습니다.",

    approach:
      "식약처 공공데이터 API를 활용하려 했지만, 공식 문서만으로는 실제 동작을 신뢰하기\n" +
      "어려웠습니다. 그래서 응답값을 직접 호출하며 하나씩 검증했고, 그 과정에서 문서와\n" +
      "다른 동작들을 발견했습니다.\n\n" +
      "대표적으로 약품명·성분명 같은 텍스트 파라미터로는 필터링이 동작하지 않아, 어떤\n" +
      "값을 넣어도 전체 데이터가 그대로 반환됐습니다. 또한 허가정보와 DUR 두 서비스의\n" +
      "ITEM_SEQ 체계가 서로 달라, 같은 키로 매칭하면 실패했습니다.\n\n" +
      "결국 API에서 필터링하는 대신, 전체 데이터를 적재해 직접 조회하는 방식으로\n" +
      "전환했습니다. 저장소로는 DuckDB도 검토했지만 파일을 그대로 서버에 올리기에는\n" +
      "용량 부담이 커 Supabase(PostgreSQL)로 일원화했습니다. 약품 매칭은 성분 코드\n" +
      "(INGR_CODE) 기준으로 처리했고, 검색은 pg_trgm 인덱스로 50~150ms 안에 응답하도록\n" +
      "만들어 누구나 빠르게 조회할 수 있게 했습니다.",

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
      "TypeScript / JavaScript 프로젝트에 쌓인 미사용 코드·패키지와 반복 값을\n" +
      "자동으로 점검하고, 안전하게 정리하도록 돕는 데스크톱 앱입니다.",

    background:
      "비슷한 도구가 이미 여럿 있다는 건 알고 있었지만, 직접 만들어보고 싶었습니다.\n" +
      "주로 웹 개발을 하다 보니 그 환경에 특화된 정리 도구를, 이왕이면 AI까지 더해\n" +
      "고도화해보자는 생각으로 시작했습니다.",

    approach:
      "가장 큰 고민은 AI였습니다. 거대 LLM API는 토큰 비용이 부담스러워, 무료로 쓸 수\n" +
      "있는 로컬 AI(Ollama + Qwen3:4b)를 탑재하기로 했습니다.\n\n" +
      "처음에는 웹사이트로 호스팅하려 했지만, 용량이 큰 로컬 AI 모델을 서버에 그대로\n" +
      "올려야 해서 현실적으로 불가능했습니다. 그래서 발상을 바꿔, 사용자의 컴퓨터 자원을\n" +
      "직접 활용하는 데스크톱 앱(Electron)으로 만들었습니다.\n\n" +
      "코드 분석은 ts-morph로 AST를 정적 분석해 미사용 파일·export·순환 참조 등을 찾아냅니다.\n" +
      "다만 코드 정리는 잘못 지우면 치명적이기 때문에, AI와 분석은 '제안'만 하고 최종 판단과\n" +
      "before/after 미리보기는 개발자에게 맡기도록 설계했습니다.",

    features: [
      "미사용 파일 탐지 / 데드 Export 탐지 / 순환 참조 탐지",
      "미사용 패키지 탐지 / 반복 값 정리",
      "로컬 AI(Ollama + Qwen3:4b) 기반 반복 값 추출 판정",
      "모든 정리 작업 적용 전 before / after 미리보기 제공",
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
