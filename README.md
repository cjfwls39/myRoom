# 🏠 myRoom

> **3D 인터랙티브 포트폴리오** · **3D Interactive Portfolio**

[![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)](https://nextjs.org)
[![Three.js](https://img.shields.io/badge/Three.js-r183-black?logo=three.js)](https://threejs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![License: CC BY-NC 4.0](https://img.shields.io/badge/License-CC%20BY--NC%204.0-lightgrey)](./LICENSE)

<br/>

단순한 이력서 형식에서 벗어나, 3D 공간을 직접 탐색하며 포트폴리오를 경험할 수 있는 인터랙티브 사이트입니다.
아늑한 방에서 컴퓨터에 앉으면, 모니터 화면 속 **가상 갤러리**를 1인칭으로 거닐며 작품을 감상할 수 있습니다.

*A portfolio you don't just read — you explore.
Sit at the desk, and step into a virtual gallery rendered inside the monitor to walk through the work.*

**🔗 Live Demo** → `[배포 후 링크 추가]`

---

## 📸 Preview

> *`[스크린샷 또는 GIF 추가]`*

---

## ✨ Features

| 기능 | 설명 |
|------|------|
| 🏠 **3D 인터랙티브 룸** | 마우스 드래그·휠로 아늑한 방을 자유롭게 탐색 |
| 🎬 **카메라 인트로** | 접속 시 카메라가 방 안으로 부드럽게 진입하는 연출 |
| 🌙 **낮/밤 · 날씨 전환** | 조명·색상이 실시간 전환, 스노우글로브 겨울 배경 |
| 🖥️ **모니터 속 갤러리** | 컴퓨터 클릭 시 모니터 화면 안에서 1인칭 갤러리가 열림 |
| 🚶 **1인칭 탐험** | WASD 이동 + 마우스 시점으로 전시관을 직접 걸어다님 |
| 🖼️ **프로젝트 전시** | 벽에 걸린 작품을 클릭하면 상세 정보 패널이 펼쳐짐 |
| 🏆 **숨겨진 업적** | 갤러리 곳곳에 숨은 업적을 발견하는 재미 요소 |
| 🕐 **실시간 시계** | 방 안 벽시계가 실제 현재 시각을 표시 |

---

## 🎮 How to Explore

1. 방을 둘러보다 **책상/모니터** 또는 **PROJECTS 표지판**을 클릭
2. 카메라가 모니터로 줌인되며 화면 안에 **갤러리**가 열립니다
3. 화면을 클릭해 시점을 고정하고 **WASD + 마우스**로 탐험
4. 벽의 **작품을 조준해 클릭**하면 프로젝트 상세가 열립니다
5. **E 키** 또는 출구 문으로 방에 돌아올 수 있습니다

> 💡 갤러리 곳곳에 숨겨진 **업적**이 있습니다. 가만히 있어 보거나, 천장을 올려다보거나, 만지지 말라는 걸 만져보세요.

---

## 🛠 Tech Stack

| Category | Stack |
|----------|-------|
| **Framework** | Next.js 16 (App Router) |
| **Language** | TypeScript 5 |
| **3D Engine** | Three.js r183 + React Three Fiber |
| **3D Utilities** | React Three Drei, React Three Postprocessing |
| **Styling** | Tailwind CSS v4 |
| **Deployment** | Vercel |

---

## 🗂 Structure

```
src/components/
├── canvas/        # Canvas, 카메라, 씬 상태머신, 낮밤·날씨 컨텍스트
├── room/          # 방 — 가구/구조/장식 + portfolioData.ts (콘텐츠)
├── snowBackground/# 스노우글로브 겨울 배경
├── museum/        # 모니터 속 갤러리 — 1인칭, 전시물, 업적 트리거
├── achievements/  # 업적 시스템
└── ui/            # 모달, 프로젝트 상세 패널, 안내 UI
```

> 📌 **콘텐츠 수정은 `src/components/room/portfolioData.ts` 한 곳**에서 이뤄집니다.
> 프로젝트를 추가하면 갤러리에 자동 전시됩니다. (전시 개수 변경 시 `museum/GalleryRoom.tsx` 참고)

---

## 🚀 Getting Started

```bash
# 1. 저장소 클론 / Clone
git clone https://github.com/cjfwls39/myRoom.git
cd myRoom

# 2. 의존성 설치 / Install
npm install

# 3. 로컬 서버 실행 / Run dev server
npm run dev
```

> ⚠️ WebGL을 지원하는 최신 브라우저(Chrome / Firefox / Edge)에서 접속을 권장합니다.
> ⚠️ A WebGL-compatible modern browser is required.

---

## 📄 License

[CC BY-NC 4.0](./LICENSE) · © 2026 JCJ (cjfwls39)
*AI 코딩 도구(Claude by Anthropic) 사용 · Developed with AI coding tools*
