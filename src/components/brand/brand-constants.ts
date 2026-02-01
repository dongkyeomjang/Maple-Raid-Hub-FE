/**
 * 메-력소 브랜드 상수
 *
 * 브랜드명: 메-력소 (로고에는 한자 '力' 사용)
 *
 * 중의적 의미:
 * - 메이플 인력소(人力所): 파티원 매칭 서비스 → 근육 주황버섯의 힘!
 * - 메이플력(力): 메이플의 힘/파워 (당신의 메이플力!) → 바이킹 뿔의 강인함!
 * - 매력소(魅力所): 매력적인 장소 (매력 넘치는 파티원들) → 귀여운 버섯의 매력!
 *
 * 마스코트:
 * - 근육 주황버섯 (바이킹 뿔 + 쇠사슬 + 근육질)
 * - 메이플스토리의 상징적 몬스터 + 힘의 이미지 조합
 * - "인력(人力)" = 사람의 힘, "근력(筋力)" = 근육의 힘
 *
 * 로고 브랜딩:
 * - 단풍잎 + 한자 '力' (힘 력) 조합
 * - 한자 사용으로 강인함과 독특함 강조
 * - 폰트: Noto Serif KR (명조체 계열)
 *
 * 브랜드 톤앤매너: 따뜻하고 친근하며 귀여운 느낌 + 강인한 힘 + 유머
 * 주요 키워드: 연결, 소통, 함께, 따뜻함, 신뢰, 힘(力), 근육, 파워
 */

// 브랜드 슬로건 컬렉션
export const BRAND_SLOGANS = {
  // 메인 슬로건
  main: "서로 다른 월드, 하나의 파티",
  mainAlt: "월드의 경계를 넘어서",

  // 파워/힘 강조 (메이플력) - 근육 주황버섯 테마
  power: "당신의 메이플力을 보여주세요 💪",
  powerShort: "당신만을 위한 메이플 인력소",
  powerAction: "메이플力 충전 완료!",
  powerUp: "파티원들과 함께라면 더 강해져요",
  powerMuscle: "근육 주황버섯처럼 강해지자!",
  powerViking: "바이킹의 힘으로 보스를 쓰러뜨려요",

  // 매력 강조 (매력소 - 중의적)
  charm: "매력 넘치는 파티원을 만나보세요",
  charmShort: "매력적인 파티가 기다려요",
  charmPlace: "가장 매력적인 파티 매칭 플레이스",
  charmMuscle: "근육도 매력이다!",

  // 연결/함께 강조
  together: "월드를 넘어, 함께 도전",
  connect: "인게임에서 불가능했던 크로스 월드 소통!",
  connectShort: "다른 월드와 연결되다",
  bridge: "월드 간 다리를 놓다",

  // 서비스 설명
  find: "딱 맞는 보스 파티, 여기서 찾으세요",
  solution: "파티원 찾기, 이제 쉬워집니다",
  easy: "30초 만에 파티 매칭",

  // 짧은 버전
  short: "당신만을 위한 메이플 인력소",
  mini: "파티 매칭의 새로운 기준",
  tiny: "함께라서 강하다 💪",

  // 인력소 테마
  labor: "메이플 인력소에서 일손을 구해요",
  laborShort: "당신의 力이 필요해요",
  recruit: "강력한 파티원 모집 중!",

  // 감성적 문구
  emotional: {
    welcome: "반가워요, 모험가님! 💪",
    goodbye: "다음에 또 만나요!",
    success: "파티 결성 완료! 보스 잡으러 가자!",
    encourage: "좋은 파티원을 만날 거예요",
    wait: "근육 주황버섯이 열심히 찾는 중...",
    fighting: "파이팅! 메이플力 전개!",
  },
} as const;

// 기능별 카피
export const FEATURE_COPY = {
  chat: {
    title: "실시간 채팅",
    subtitle: "크로스 월드 소통",
    description: "서로 다른 월드의 유저들과 실시간으로 대화하세요. 인게임에서 불가능했던 소통이 여기선 가능해요.",
    shortDesc: "스카니아와 크로아가 만나는 곳",
    badge: "NEW",
    emoji: "💬",
  },
  schedule: {
    title: "일정 조율",
    subtitle: "스마트 매칭",
    description: "가능한 시간대를 입력하면 자동으로 최적의 시간을 찾아드려요. 바쁜 현대인을 위한 똑똑한 일정 관리.",
    shortDesc: "모두가 가능한 시간을 찾아요",
    badge: "SMART",
    emoji: "📅",
  },
  temperature: {
    title: "매너 온도",
    subtitle: "신뢰 지표",
    description: "파티 활동 후 서로 평가하여 매너 온도가 결정돼요. 따뜻한 파티원을 만나보세요.",
    shortDesc: "따뜻한 파티원을 만나요",
    badge: "HOT",
    emoji: "🌡️",
  },
  verification: {
    title: "캐릭터 인증",
    subtitle: "안전한 매칭",
    description: "넥슨 API 연동으로 캐릭터 정보를 실시간 검증해요. 사칭 걱정 없이 안전하게 매칭하세요.",
    shortDesc: "검증된 유저만 참여해요",
    badge: "SAFE",
    emoji: "🛡️",
  },
  party: {
    title: "파티 매칭",
    subtitle: "효율적인 구성",
    description: "보스별, 역할별로 딱 맞는 파티원을 찾으세요. 보스 묶음 모집으로 시간도 절약해요.",
    shortDesc: "딱 맞는 파티원을 찾아요",
    badge: "MATCH",
    emoji: "⚔️",
  },
  worldGroup: {
    title: "월드 그룹",
    subtitle: "자동 분류",
    description: "챌린저스, 에오스/헬리오스, 일반 서버별로 자동 분류되어 올바른 파티를 찾기 쉬워요.",
    shortDesc: "서버별 자동 필터링",
    badge: "AUTO",
    emoji: "🌍",
  },
} as const;

// CTA 버튼 텍스트
export const CTA_TEXTS = {
  primary: "파티 찾기 시작",
  secondary: "어떻게 작동하나요?",
  login: "시작하기",
  loginWelcome: "다시 만나서 반가워요!",
  signup: "무료로 시작하기",
  signupQuick: "30초 만에 가입하기",
  createPost: "파티 모집글 작성",
  viewPosts: "파티 둘러보기",
  learnMore: "자세히 알아보기",
  goToCharacters: "캐릭터 등록하러 가기",
  startMatching: "매칭 시작하기",
} as const;

// 소셜 증명 텍스트
export const SOCIAL_PROOF = {
  users: "1,000+ 유저가 함께해요",
  usersShort: "1,000+",
  parties: "500+ 파티가 매칭됐어요",
  partiesShort: "500+",
  rating: "평균 매너 온도 42.3°C",
  ratingShort: "42.3°C",
  satisfaction: "만족도 98%",
} as const;

// 에러/빈 상태 메시지
export const EMPTY_STATE_MESSAGES = {
  noParties: {
    title: "아직 파티가 없어요",
    description: "첫 번째 파티를 직접 모집해보는 건 어떨까요?",
    action: "파티 모집하기",
    emoji: "🎉",
  },
  noCharacters: {
    title: "등록된 캐릭터가 없어요",
    description: "캐릭터를 등록하고 파티에 참여해보세요!",
    action: "캐릭터 등록하기",
    emoji: "🧙",
  },
  noMessages: {
    title: "아직 메시지가 없어요",
    description: "파티원들과 대화를 시작해보세요!",
    action: "채팅 시작하기",
    emoji: "💬",
  },
  noApplications: {
    title: "신청자가 없어요",
    description: "조금만 기다려주세요. 곧 매력적인 파티원이 나타날 거예요!",
    action: null,
    emoji: "⏳",
  },
  noReviews: {
    title: "아직 리뷰가 없어요",
    description: "파티 활동 후 첫 번째 리뷰를 남겨보세요!",
    action: null,
    emoji: "⭐",
  },
  searchNoResults: {
    title: "검색 결과가 없어요",
    description: "다른 키워드로 검색해보세요!",
    action: null,
    emoji: "🔍",
  },
} as const;

// 브랜드 컬러 (CSS 변수와 동기화)
export const BRAND_COLORS = {
  primary: {
    main: "#F97316",
    light: "#FFEDD5",
    lighter: "#FFF7ED",
    dark: "#C2410C",
    darker: "#9A3412",
  },
  accent: {
    main: "#F59E0B",
    light: "#FEF3C7",
    lighter: "#FFFBEB",
    dark: "#B45309",
    darker: "#92400E",
  },
  gradient: {
    maple: "linear-gradient(135deg, #FF6B35 0%, #F97316 35%, #F59E0B 70%, #FBBF24 100%)",
    mapleSubtle: "linear-gradient(135deg, #F97316 0%, #F59E0B 50%, #FBBF24 100%)",
    warm: "linear-gradient(135deg, #FFF7ED 0%, #FFEDD5 100%)",
    warmAlt: "linear-gradient(145deg, #FFF7ED 0%, #FFEDD5 50%, #FEF3C7 100%)",
    glow: "radial-gradient(circle, rgba(249, 115, 22, 0.3) 0%, transparent 70%)",
  },
  semantic: {
    success: "#10B981",
    warning: "#F59E0B",
    error: "#EF4444",
    info: "#0EA5E9",
  },
} as const;

// 이스터에그 문구 (로딩, 404 등에 사용) - 근육 주황버섯 테마
export const EASTER_EGGS = {
  loading: [
    "메이플力 충전 중... 💪",
    "근육 주황버섯이 팔굽혀펴기 중...",
    "파티원을 소환하는 중...",
    "보스를 깨우는 중...",
    "매력 포인트 계산 중...",
    "월드 간 연결 중...",
    "최적의 파티 구성 중...",
    "바이킹 뿔을 닦는 중...",
    "쇠사슬 광택 내는 중...",
  ],
  notFound: [
    "여긴 없는 맵이에요!",
    "길을 잃으셨나요?",
    "이 맵은 아직 업데이트되지 않았어요.",
    "근육 주황버섯도 못 찾겠어요...",
    "포탈이 고장났어요!",
    "바이킹 뿔로 길을 찾아볼게요!",
  ],
  error: [
    "이런! 뭔가 잘못됐어요.",
    "버그 몬스터가 나타났어요!",
    "잠시 후 다시 시도해주세요.",
    "서버가 쉬는 중이에요...",
    "근육 주황버섯이 수리 중!",
    "쇠사슬이 끊어졌어요...",
  ],
  success: [
    "완료! 대단해요! 💪",
    "성공이에요!",
    "잘했어요! 메이플力 전개!",
    "파티 결성 완료!",
    "근육 주황버섯도 기뻐해요!",
  ],
  encourage: [
    "화이팅! 💪",
    "좋은 파티원을 만날 거예요!",
    "오늘도 좋은 하루 되세요!",
    "함께라서 더 즐거워요!",
    "당신의 메이플力을 믿어요!",
    "근육 주황버섯이 응원해요!",
  ],
} as const;

// 마케팅 뱃지 텍스트
export const MARKETING_BADGES = {
  new: "NEW",
  hot: "HOT",
  popular: "인기",
  recommended: "추천",
  verified: "인증됨",
  safe: "안전",
  smart: "스마트",
  fast: "빠른",
  free: "무료",
  beta: "BETA",
} as const;

// 페이지별 메타 정보
export const PAGE_META = {
  home: {
    title: "메-력소 | 당신만을 위한 메이플 인력소 💪",
    description: "서로 다른 월드의 유저들과 실시간 채팅, 일정 조율로 보스 파티를 구성하세요. 근육 주황버섯과 함께하는 크로스 월드 파티 매칭!",
  },
  posts: {
    title: "파티 모집 | 메-력소",
    description: "보스 레이드 파티를 모집하거나 참여하세요. 당신의 메이플力이 필요해요!",
  },
  characters: {
    title: "캐릭터 관리 | 메-력소",
    description: "내 캐릭터를 등록하고 인증받으세요. 넥슨 API 연동으로 실시간 장비 조회.",
  },
  login: {
    title: "로그인 | 메-력소",
    description: "메-력소에 로그인하고 파티원들과 소통하세요. 당신의 메이플力을 보여주세요!",
  },
  onboarding: {
    title: "시작하기 | 메-력소",
    description: "30초 만에 가입하고 크로스 월드 파티 매칭을 시작하세요. 근육 주황버섯이 기다려요!",
  },
} as const;

// 마스코트 관련 상수
export const MASCOT = {
  name: "근육 주황버섯",
  nickname: "근버",
  description: "바이킹 뿔과 쇠사슬로 무장한 메이플스토리의 힘센 주황버섯",
  imagePath: "/mascot.gif",
  quotes: [
    "당신의 메이플力을 보여주세요!",
    "함께라면 어떤 보스도 잡을 수 있어요!",
    "인력이 필요하면 메-력소로!",
    "근육도 매력이다!",
    "파티원 모집? 내가 도와줄게!",
  ],
} as const;
