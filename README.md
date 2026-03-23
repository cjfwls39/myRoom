```markdown
# 🏠 myRoom - 3D Interactive Portfolio

**myRoom**은 Three.js와 Next.js를 활용하여 구현한 3D 인터랙티브 포트폴리오 사이트입니다.  
단순한 텍스트 위주의 포트폴리오에서 벗어나, 사용자가 3D 공간을 직접 탐색하며 인터랙션할 수 있는 경험을 제공합니다.

## ✨ 주요 기능
- **3D 인터랙티브 룸**: 마우스 드래그와 휠을 통해 방 전체를 회전하고 확대/축소할 수 있습니다.
- **인트로 애니메이션**: 사이트 접속 시 카메라가 방 안으로 부드럽게 진입하는 연출이 적용되어 있습니다.
- **오브젝트 호버 효과**: 게시판, 모니터, 아이콘 명판 등에 마우스를 올리면 반응하는 애니메이션 효과를 제공합니다.
- **실시간 데이터 연동**: 방 안의 시계는 실제 사용자의 현재 시간에 맞춰 실시간으로 작동합니다.

## 🛠 Tech Stack
- **Framework**: Next.js (App Router)
- **3D Engine**: Three.js, React Three Fiber (@react-three/fiber)
- **Utilities**: React Three Drei (@react-three/drei)
- **Styling**: Tailwind CSS
- **Deployment**: Vercel / GitHub Pages

## 🚀 시작하기

1. 저장소 클론
```bash
git clone [https://github.com/cjfwls39/myRoom.git](https://github.com/cjfwls39/myRoom.git)

```

2. 의존성 설치

```bash
npm install

```

3. 로컬 서버 실행

```bash
npm run dev

```

---

## 🐙 Git & GitHub 가이드

원활한 협업과 버전 관리를 위한 명령어 정리입니다.

### 1. 개발을 시작하기 전 (전날 작업 이어하기 / 다른 PC)

항상 작업을 시작하기 전에 깃허브의 최신 내용을 가져오는 습관이 중요합니다.

```bash
# 원격 저장소의 최신 코드를 내 컴퓨터로 동기화
git pull origin main

```

### 2. 개발 종료 후 (오늘 작업 저장하기)

작업이 끝난 후에는 반드시 커밋하고 푸시하여 원격 저장소에 저장합니다.

```bash
git add .
git commit -m "오늘 수정 내용 요약 (예: 고양이 꼬리 복구 및 시계 배치 수정)"
git push origin main

```

### 3. 다른 컴퓨터에서 처음 작업을 시작할 때

해당 컴퓨터에 프로젝트 폴더가 없다면 '클론'을 먼저 해야 합니다.

```bash
git clone [https://github.com/cjfwls39/myRoom.git](https://github.com/cjfwls39/myRoom.git)
cd myRoom
npm install

```

### 4. 만약 "Rejected" 에러가 발생한다면?

깃허브 웹사이트에서 직접 파일을 수정했거나 리드미를 생성한 경우 발생합니다.

* **정석 방법 (권장)**: `git pull origin main` 후 충돌 해결 -> 다시 Push
* **강제 방법 (주의)**: `git push origin main --force` (내 로컬 코드로 원격 저장소를 완전히 덮어씌움)

---

© 2026 cjfwls39. All rights reserved.