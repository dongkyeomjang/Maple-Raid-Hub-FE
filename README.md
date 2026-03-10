# 🍁 메-력소 Frontend

**메이플스토리 월드통합 보스 파티 매칭 플랫폼**

> 서버가 달라도 함께 보스를 잡을 수 있도록, 크로스 월드 파티 매칭 서비스

🔗 **https://www.mapleraid.com**

---

## 기술 스택

| 분류 | 기술 |
|------|------|
| **Framework** | Next.js 14.1.0 (App Router) |
| **Language** | TypeScript 5.3.3 |
| **UI** | React 18.2.0 |
| **상태 관리** | Zustand 4.5.0 (클라이언트) + React Query 5.17.19 (서버) |
| **스타일링** | Tailwind CSS 3.4.1 |
| **UI 컴포넌트** | shadcn/ui (Radix UI) |
| **실시간 통신** | STOMP WebSocket |
| **유효성 검사** | Zod 3.22.4 |
| **아이콘** | Lucide React 0.321.0 |
| **테마** | next-themes 0.4.6 (다크/라이트) |
| **날짜** | date-fns 3.3.1 |
| **폰트** | Pretendard (한국어 최적화) |

---

## 프로젝트 구조

```
src/
├── app/                             # Next.js App Router (페이지)
│   ├── page.tsx                     # 랜딩 페이지
│   ├── layout.tsx                   # 루트 레이아웃 (Providers)
│   ├── login/                       # 로그인
│   ├── onboarding/                  # 회원가입
│   ├── oauth/
│   │   ├── callback/                # OAuth 콜백
│   │   └── set-nickname/            # OAuth 닉네임 설정
│   ├── characters/
│   │   ├── page.tsx                 # 캐릭터 목록
│   │   ├── [id]/page.tsx            # 캐릭터 상세 (장비 포함)
│   │   └── [id]/verify/page.tsx     # 캐릭터 소유권 인증
│   ├── posts/
│   │   ├── page.tsx                 # 모집글 목록 (필터, 무한 스크롤)
│   │   ├── new/page.tsx             # 모집글 작성
│   │   ├── [id]/page.tsx            # 모집글 상세
│   │   ├── [id]/edit/page.tsx       # 모집글 수정
│   │   └── [id]/manage/page.tsx     # 파티 관리 (파티장)
│   ├── chat/
│   │   ├── page.tsx                 # 채팅 허브
│   │   └── [roomId]/page.tsx        # 채팅방
│   └── me/
│       ├── page.tsx                 # 내 프로필 & 평가
│       └── settings/page.tsx        # 알림 설정
│
├── components/
│   ├── ui/                          # shadcn/ui 기본 컴포넌트
│   │   ├── button.tsx, card.tsx, dialog.tsx, input.tsx
│   │   ├── tabs.tsx, select.tsx, avatar.tsx, badge.tsx
│   │   ├── checkbox.tsx, label.tsx, popover.tsx
│   │   ├── progress.tsx, skeleton.tsx, textarea.tsx
│   │   ├── tooltip.tsx, Logo.tsx, ThemeToggle.tsx
│   │   └── ...
│   ├── domain/                      # 도메인 비즈니스 컴포넌트
│   │   ├── PostCard.tsx             # 모집글 카드
│   │   ├── CharacterCard.tsx        # 캐릭터 카드
│   │   ├── EquipmentGrid.tsx        # 장비 그리드
│   │   ├── StarforceDisplay.tsx     # 스타포스 시각화
│   │   ├── BossFilterSelector.tsx   # 보스 필터
│   │   ├── TemperatureBadge.tsx     # 매너 온도 뱃지
│   │   ├── WorldGroupBadge.tsx      # 월드 그룹 뱃지
│   │   ├── VerificationBadge.tsx    # 인증 상태 뱃지
│   │   ├── ReadyCheck.tsx           # 레디체크 UI
│   │   ├── MannerEvaluationModal.tsx # 매너 평가 모달
│   │   └── ...
│   ├── chat/                        # 채팅 컴포넌트
│   │   ├── ChatMessages.tsx         # 메시지 표시 & 입력
│   │   ├── ChatRoomList.tsx         # 채팅방 목록
│   │   ├── ChatPanel.tsx            # 플로팅 채팅 패널
│   │   ├── FloatingChatButton.tsx   # 채팅 버튼 (읽지 않은 수)
│   │   └── DraftDmChat.tsx          # DM 초안 인터페이스
│   ├── schedule/                    # 일정 조율
│   │   ├── ScheduleSection.tsx      # When2Meet 스타일
│   │   ├── TimeGridSelector.tsx     # 시간 슬롯 선택
│   │   └── AvailabilityHeatmap.tsx  # 가용 시간 히트맵
│   ├── brand/                       # 브랜딩 & 마케팅
│   │   ├── BrandHero.tsx, Mascot.tsx
│   │   ├── FeatureCard.tsx, SocialProofSection.tsx
│   │   └── brand-constants.ts
│   ├── layout/                      # 레이아웃
│   │   ├── Header.tsx               # 네비게이션 바
│   │   └── PageContainer.tsx
│   ├── providers/                   # Context Providers
│   │   ├── AuthProvider.tsx
│   │   ├── QueryProvider.tsx
│   │   └── ThemeProvider.tsx
│   └── common/                      # 공통 UI 패턴
│       ├── EmptyState.tsx
│       ├── ErrorState.tsx
│       └── LoadingSpinner.tsx
│
├── lib/
│   ├── api/
│   │   ├── client.ts                # API 클라이언트 (fetch 래퍼)
│   │   ├── mock-handlers.ts         # MSW 목 핸들러
│   │   └── mock-data.ts             # 개발용 목 데이터
│   ├── hooks/                       # 커스텀 훅 (12개)
│   │   ├── use-auth.ts              # 인증 상태 & 액션
│   │   ├── use-characters.ts        # 캐릭터 데이터 쿼리
│   │   ├── use-posts.ts             # 모집글 (무한 스크롤)
│   │   ├── use-party-rooms.ts       # 파티룸 데이터
│   │   ├── use-chat.ts              # 채팅 오퍼레이션
│   │   ├── use-manner.ts            # 매너 평가
│   │   ├── use-discord.ts           # Discord 연동
│   │   ├── use-boss-names.ts        # 보스 설정 캐싱
│   │   ├── use-config.ts            # 월드그룹 & 보스 설정
│   │   ├── use-notifications.ts     # 알림 설정
│   │   ├── use-stats.ts             # 사이트 통계
│   │   └── use-require-auth.ts      # 인증 가드
│   ├── stores/
│   │   └── chat-store.ts            # Zustand 채팅 스토어
│   ├── websocket/
│   │   └── WebSocketProvider.tsx     # STOMP 클라이언트
│   └── utils/
│       ├── utils.ts                 # 유틸리티 함수
│       └── notification-sound.ts    # Web Audio API 알림음
│
├── types/
│   └── api.ts                       # API 타입 정의 (모든 DTO)
│
└── public/
    ├── og-image.png                 # Open Graph 이미지
    ├── mascot.gif                   # 마스코트 (근육 버섯)
    └── brand/                       # 브랜드 에셋
```

---

## 주요 기능

### 1. 파티 모집
- 캐릭터/보스(단일·묶음) 선택 후 모집글 작성
- 월드그룹, 보스별 필터링 및 무한 스크롤 브라우징
- 메시지와 함께 지원, 파티장이 수락/거절
- 모집글 수정, 마감, 취소, 파티 관리

### 2. 캐릭터 관리
- Nexon API 연동 캐릭터 등록 및 장비 동기화
- 장비 그리드: 스타포스, 잠재능력, 에디셔널 표시
- 심볼 장착 챌린지 기반 소유권 인증 (3회 시도)

### 3. 실시간 채팅
- **파티 채팅**: 지원 수락 시 자동 생성
- **1:1 DM**: 모집글 맥락 기반 다이렉트 메시지
- 플로팅 채팅 패널 + 전체 채팅 페이지 (반응형)
- 읽지 않은 메시지 카운트, 알림음
- 무한 스크롤 메시지 히스토리

### 4. 일정 조율
- When2Meet 스타일 타임 그리드 셀렉터
- 그룹 가용 시간 히트맵 시각화
- 일정 확정 투표
- 레디체크 (60초 카운트다운)

### 5. 매너 온도
- 파티 완료 후 태그 기반 상호 평가
- 온도 뱃지 (색상 그라데이션: 파랑 → 빨강)
- 프로필 페이지에서 평가 히스토리 확인

### 6. Discord 연동
- OAuth2 기반 Discord 계정 연결/해제
- 알림 설정 커스터마이징

---

## 상태 관리

### Zustand (클라이언트 상태)

**`useChatStore`** - 채팅 UI 상태 관리
- 채팅 패널 열기/닫기, 활성 탭 (파티/DM)
- 선택된 채팅방, 메시지 캐시
- 읽지 않은 메시지 카운트, 알림

**`useAuth`** - 인증 상태
- 현재 유저 정보, 인증 여부
- 로그인/회원가입/로그아웃 액션
- localStorage 영속화

### React Query (서버 상태)

```typescript
// 캐시 키 구조
postKeys.list(filters)        → ["posts", "list", {filters}]
postKeys.detail(id)           → ["posts", "detail", id]
partyRoomKeys.list(status)    → ["partyRooms", "list", {status}]
partyRoomKeys.detail(id)      → ["partyRooms", id]
```

- mutation `onSuccess`에서 관련 쿼리 자동 무효화
- prefix 기반 캐시 무효화
- WebSocket 수신 시 수동 refetch

---

## 인증 흐름

### 일반 로그인
1. 아이디/비밀번호 입력 → 서버가 HttpOnly 쿠키 발급
2. Zustand + localStorage에 유저 정보 저장
3. API 요청 시 `credentials: "include"`로 쿠키 자동 전송
4. 401 응답 시 자동 로그아웃

### 카카오 OAuth
1. "카카오로 시작하기" 클릭
2. `/oauth2/authorization/kakao`로 리다이렉트
3. 서버에서 OAuth 처리 후 `/oauth/callback?oauth=success`
4. `/oauth/set-nickname`에서 닉네임 설정
5. 회원가입 완료

---

## WebSocket 채팅

STOMP over WebSocket으로 실시간 통신을 구현합니다.

```typescript
// 구독
ws.subscribe('/topic/party-rooms/{roomId}', onMessage)   // 파티 채팅
ws.subscribe('/topic/dm-rooms/{roomId}', onMessage)       // DM
ws.subscribe('/user/queue/notifications', onNotification) // 알림

// 전송
ws.send('/app/chat/{partyRoomId}', message)               // 파티 메시지
ws.send('/app/dm/{dmRoomId}', message)                     // DM 메시지
```

- 자동 재연결 (5초 backoff)
- 10초 heartbeat
- 컴포넌트 언마운트 시 구독 해제

---

## 스타일링 & 테마

### 디자인 시스템

| 구분 | 값 |
|------|-----|
| **Primary** | Maple Orange (`#F97316`) |
| **월드 그룹** | Challenger(빨강), Eos/Helios(보라), Normal(초록) |
| **매너 온도** | freezing(파랑) → cold → cool → warm(초록) → hot → burning(빨강) |
| **폰트** | Pretendard (한국어 최적화 sans-serif) |

### 다크 모드
- `next-themes` 기반 class 방식
- 시스템 설정 자동 감지
- 토글 버튼으로 수동 전환

### 반응형
- Mobile-first 접근
- 채팅: 모바일 단일 컬럼 / 데스크탑 2컬럼 레이아웃
- Safe Area 대응 (노치, 하단 바)

---

## 페이지 라우팅

### 공개 페이지
| 경로 | 설명 |
|------|------|
| `/` | 랜딩 페이지 |
| `/login` | 로그인 |
| `/onboarding` | 회원가입 |
| `/oauth/callback` | OAuth 콜백 |

### 인증 필요 페이지
| 경로 | 설명 |
|------|------|
| `/characters` | 캐릭터 관리 |
| `/characters/[id]` | 캐릭터 상세 (장비) |
| `/characters/[id]/verify` | 소유권 인증 |
| `/posts` | 모집글 목록 (메인) |
| `/posts/new` | 모집글 작성 |
| `/posts/[id]` | 모집글 상세 |
| `/posts/[id]/edit` | 모집글 수정 |
| `/posts/[id]/manage` | 파티 관리 |
| `/chat` | 채팅 허브 |
| `/chat/[roomId]` | 채팅방 |
| `/me` | 내 프로필 |
| `/me/settings` | 알림 설정 |

---

## SEO & 메타데이터

- **Title**: `메-력소 | 월드통합 보스 파티 매칭`
- **Description**: 크로스 월드 메이플스토리 레이드 파티 매칭
- **Open Graph**: 소셜 공유용 이미지
- **Keywords**: 메이플스토리, 보스, 파티, 매칭, 레이드, 월드통합
- **네이버 사이트 인증**: 메타 태그 포함
- `robots.ts`, `sitemap.ts` 포함

---

## 환경 설정

### 환경변수

```bash
# 필수
NEXT_PUBLIC_API_URL=https://api.dev.mapleraid.com

# 선택
NEXT_PUBLIC_MOCK_MODE=false  # 목 데이터 모드
```

### Next.js 설정
- Nexon Open API 이미지 도메인 허용 (`open.api.nexon.com`)
- Strict Mode 활성화

---

## 실행 방법

### 사전 요구사항
- Node.js 18+
- npm

### 개발 서버

```bash
# 의존성 설치
npm install

# 개발 서버 시작 (http://localhost:3000)
npm run dev
```

### 프로덕션 빌드

```bash
# 빌드
npm run build

# 프로덕션 서버 시작
npm start
```

### 기타 스크립트

```bash
npm run lint         # ESLint 검사
npm run type-check   # TypeScript 타입 체크
```

---

## 프로젝트 통계

| 항목 | 수치 |
|------|------|
| TypeScript/TSX 파일 | 110개 |
| 컴포넌트 | 61개 |
| 커스텀 훅 | 12개 |
| 페이지 | 20개+ |

---

## 브라우저 지원

- Chrome / Edge (최신)
- Firefox (최신)
- Safari (최신)
- iOS Safari / Chrome Mobile

---

## 라이선스

이 프로젝트는 비공개 프로젝트입니다. 무단 복제 및 배포를 금합니다.
