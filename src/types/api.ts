// ============================================
// Enums (Backend 정렬)
// ============================================

export type WorldGroup = "CHALLENGER" | "EOS_HELIOS" | "NORMAL";

export type VerificationStatus = "UNVERIFIED_CLAIMED" | "VERIFIED_OWNER" | "DISPUTED" | "REVOKED";

export type ChallengeStatus = "PENDING" | "SUCCESS" | "FAILED" | "EXPIRED";

export type PostStatus = "RECRUITING" | "CLOSED" | "CANCELED" | "EXPIRED";

export type ApplicationStatus = "APPLIED" | "ACCEPTED" | "REJECTED" | "CANCELED" | "WITHDRAWN";

export type PartyRoomStatus = "ACTIVE" | "COMPLETED" | "CANCELED";

export type ReviewTag =
  | "SKILLED"
  | "PUNCTUAL"
  | "GOOD_COMM"
  | "FRIENDLY"
  | "LEADER_MATERIAL"
  | "UNSKILLED"
  | "LATE"
  | "BAD_COMM"
  | "RUDE"
  | "NO_SHOW";

// ============================================
// Generic Pagination Response
// ============================================

export interface PageResponse<T> {
  content: T[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  hasNext: boolean;
  hasPrevious: boolean;
}

// ============================================
// Auth DTOs
// ============================================

export interface SignupRequest {
  email: string;
  password: string;
  nickname: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthTokenResponse {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  tokenType: string;
}

export interface UserResponse {
  id: string;
  email: string;
  nickname: string;
  temperature: number;
  completedParties: number;
  createdAt: string;
}

export interface RefreshRequest {
  refreshToken: string;
}

// ============================================
// Character DTOs
// ============================================

export interface CharacterSyncRequest {
  nexonAccessToken: string;
}

export interface CharacterListResponse {
  characters: CharacterResponse[];
  lastSyncedAt: string | null;
}

export interface CharacterResponse {
  id: string;
  characterName: string;
  worldName: string;
  worldGroup: WorldGroup;
  characterClass: string;
  characterLevel: number;
  characterImageUrl: string | null;
  combatPower: number;
  equipmentJson: string | null;
  verificationStatus: VerificationStatus;
  claimedAt: string;
  verifiedAt: string | null;
  lastSyncedAt: string | null;
}

export interface EquipmentSlot {
  itemName: string;
  itemIcon: string | null;
  details: EquipmentDetails;
}

export interface EquipmentDetails {
  originalSlot: string;
  starforce: string;
  potentialOptionGrade?: string | null;
  potentialOption1?: string | null;
  potentialOption2?: string | null;
  potentialOption3?: string | null;
  additionalPotentialOptionGrade?: string | null;
  additionalPotentialOption1?: string | null;
  additionalPotentialOption2?: string | null;
  additionalPotentialOption3?: string | null;
  soulName?: string | null;
  soulOption?: string | null;
  scrollUpgrade: string;
  itemTotalOption?: Record<string, string>;
  itemBaseOption?: Record<string, string>;
  itemAddOption?: Record<string, string>;
  itemEtcOption?: Record<string, string>;
  itemStarforceOption?: Record<string, string>;
  itemDescription?: string | null;
  specialRingLevel?: string | null;
}

export interface EquipmentInfo {
  date: string | null;
  slots: Record<string, EquipmentSlot>;
}

// 잠재능력 등급 타입
export type PotentialGrade = "레어" | "에픽" | "유니크" | "레전드리";

// ============================================
// Verification DTOs
// ============================================

export interface ChallengeResponse {
  id: string;
  characterId: string;
  requiredSymbol1: string;
  requiredSymbol2: string;
  status: ChallengeStatus;
  checkCount: number;
  maxChecks: number;
  createdAt: string;
  expiresAt: string;
  lastCheckedAt: string | null;
  secondsUntilNextCheck: number;
}

export interface VerificationResultResponse {
  status: string;
  message: string;
  remainingChecks: number | null;
  remainingSeconds: number | null;
}

// ============================================
// Boss Config DTOs
// ============================================

export interface BossConfig {
  id: string;
  bossFamily: string;
  name: string;
  shortName: string;
  difficulty: string;
  partySize: number;
  resetType: string;
  iconUrl: string | null;
}

export interface BossBundleConfig {
  id: string;
  name: string;
  bossIds: string[];
  description: string | null;
}

export interface WorldGroupConfig {
  id: WorldGroup;
  displayName: string;
  worlds: string[];
}

// ============================================
// Post DTOs
// ============================================

export interface CreatePostRequest {
  characterId: string;
  bossIds: string[];
  requiredMembers: number;
  preferredTime: string;
  description: string | null;
}

export interface PostResponse {
  id: string;
  authorId: string;
  characterId: string;
  worldGroup: WorldGroup;
  bossIds: string[];
  requiredMembers: number;
  currentMembers: number;
  preferredTime: string;
  description: string | null;
  status: PostStatus;
  partyRoomId: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface ApplyRequest {
  characterId: string;
  message: string | null;
}

export interface ApplicationResponse {
  id: string;
  applicantId: string;
  characterId: string;
  message: string | null;
  status: ApplicationStatus;
  appliedAt: string;
  respondedAt: string | null;
}

export interface PublicCharacterResponse {
  id: string;
  characterName: string;
  worldName: string;
  worldGroup: WorldGroup;
  characterClass: string;
  characterLevel: number;
  characterImageUrl: string | null;
  combatPower: number;
  equipmentJson: string | null;
  verificationStatus: VerificationStatus;
  lastSyncedAt: string | null;
}

export interface ApplicationWithCharacterResponse extends ApplicationResponse {
  character: PublicCharacterResponse | null;
}

export interface PostDetailResponse {
  post: PostResponse;
  applications: ApplicationWithCharacterResponse[];
  authorCharacter: PublicCharacterResponse | null;
}

export interface RespondApplicationRequest {
  accept: boolean;
}

// ============================================
// Party Room DTOs
// ============================================

export interface PartyRoomResponse {
  id: string;
  postId: string | null;
  bossIds: string[];
  status: PartyRoomStatus;
  members: PartyMemberResponse[];
  readyCheckActive: boolean;
  allReady: boolean;
  scheduledTime: string | null;
  scheduleConfirmed: boolean;
  createdAt: string;
  completedAt: string | null;
  lastMessage: string | null;
  lastMessageAt: string | null;
}

export interface PartyMemberResponse {
  userId: string;
  characterId: string;
  characterName: string | null;
  characterImageUrl: string | null;
  isLeader: boolean;
  isReady: boolean;
  joinedAt: string;
  unreadCount: number;
}

// ============================================
// Review DTOs
// ============================================

export interface SubmitReviewRequest {
  targetMemberId: string;
  tags: ReviewTag[];
}

export interface ReviewResponse {
  id: string;
  partyRoomId: string;
  reviewerNickname: string;
  tags: ReviewTag[];
  temperatureChange: number;
  createdAt: string;
}

export interface ReviewListResponse {
  reviews: ReviewResponse[];
  canSubmitReviews: boolean;
  pendingReviews: PendingReview[];
}

export interface PendingReview {
  memberId: string;
  nickname: string;
  characterName: string;
}

// ============================================
// Chat DTOs
// ============================================

export interface ChatMessage {
  id: string;
  roomId: string;
  senderId: string;
  senderNickname: string;
  content: string;
  type: "CHAT" | "SYSTEM" | "READY_CHECK" | "SCHEDULE_POLL";
  createdAt: string;
}

export interface SendMessageRequest {
  content: string;
}

export interface ChatHistoryResponse {
  messages: ChatMessage[];
  nextCursor: string | null;
  hasMore: boolean;
}

// ============================================
// Schedule Poll DTOs
// ============================================

export interface CreatePollRequest {
  options: string[]; // ISO datetime strings
}

export interface PollResponse {
  id: string;
  roomId: string;
  options: PollOption[];
  createdAt: string;
  expiresAt: string;
  isActive: boolean;
}

export interface PollOption {
  datetime: string;
  votes: string[]; // user IDs
}

export interface VotePollRequest {
  optionIndex: number;
}

// ============================================
// Ready Check DTOs
// ============================================

export interface ReadyCheckResponse {
  isActive: boolean;
  startedAt: string | null;
  expiresAt: string | null;
  readyMembers: string[]; // member IDs
  allReady: boolean;
}

// ============================================
// Error Response
// ============================================

export interface ErrorResponse {
  code: string;
  message: string;
  details?: Record<string, string>;
}

// ============================================
// API Response Wrapper
// ============================================

export type ApiResponse<T> =
  | { success: true; data: T }
  | { success: false; error: ErrorResponse };
