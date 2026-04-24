"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { PageContainer } from "@/components/layout/PageContainer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { BossMultiSelector } from "@/components/domain/BossMultiSelector";
import { WorldGroupBadge } from "@/components/domain/WorldGroupBadge";
import { useCharacters } from "@/lib/hooks/use-characters";
import { useCreatePost } from "@/lib/hooks/use-posts";
import { useAuth } from "@/lib/hooks/use-auth";
import { useWorldGroups } from "@/lib/hooks/use-config";
import type { WorldGroup } from "@/types/api";
import { ArrowLeft, Clock, Loader2, UserCircle2 } from "lucide-react";

export default function NewPostPage() {
  const router = useRouter();
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const createMutation = useCreatePost();

  // 공통 필드
  const [selectedBossIds, setSelectedBossIds] = useState<string[]>([]);
  const [requiredMembers, setRequiredMembers] = useState(2);
  const [scheduledAt, setScheduledAt] = useState("");
  const [isScheduleTbd, setIsScheduleTbd] = useState(false);
  const [memo, setMemo] = useState("");
  const [error, setError] = useState<string | null>(null);

  // 회원 전용
  const { data: charactersData } = useCharacters();
  const [selectedCharacterId, setSelectedCharacterId] = useState("");

  // 비회원 전용
  const { data: worldGroups } = useWorldGroups();
  const [guestWorldGroup, setGuestWorldGroup] = useState<WorldGroup | "">("");
  const [guestWorldName, setGuestWorldName] = useState("");
  const [guestCharacterName, setGuestCharacterName] = useState("");
  const [contactLink, setContactLink] = useState("");
  const [guestPassword, setGuestPassword] = useState("");
  const [guestPasswordConfirm, setGuestPasswordConfirm] = useState("");

  const verifiedCharacters = useMemo(
    () => charactersData?.filter((c) => c.verificationStatus === "VERIFIED_OWNER") || [],
    [charactersData]
  );
  const selectedCharacter = verifiedCharacters.find((c) => c.id === selectedCharacterId);

  const availableWorlds = useMemo(() => {
    if (!worldGroups || !guestWorldGroup) return [];
    return worldGroups.find((g) => g.id === guestWorldGroup)?.worlds || [];
  }, [worldGroups, guestWorldGroup]);

  const sortedWorldGroups = useMemo(() => {
    if (!worldGroups) return [];
    const order: WorldGroup[] = ["NORMAL", "EOS_HELIOS", "CHALLENGER"];
    return [...worldGroups].sort((a, b) => order.indexOf(a.id) - order.indexOf(b.id));
  }, [worldGroups]);

  const validateCommon = () => {
    if (selectedBossIds.length === 0) return "최소 1개 이상의 보스를 선택해주세요.";
    if (!isScheduleTbd && !scheduledAt) return "예정 날짜를 입력하거나 '상의 후 결정'을 선택해주세요.";
    return null;
  };

  const handleMemberSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!selectedCharacterId) {
      setError("캐릭터를 선택해주세요.");
      return;
    }
    const commonError = validateCommon();
    if (commonError) {
      setError(commonError);
      return;
    }

    try {
      const result = await createMutation.mutateAsync({
        characterId: selectedCharacterId,
        bossIds: selectedBossIds,
        requiredMembers,
        preferredTime: isScheduleTbd ? null : new Date(scheduledAt).toISOString(),
        description: memo || null,
      });
      // 작성 직후 상세 페이지에서 뒤로가기 시 목록으로 돌아가도록 플래그 저장
      if (typeof window !== "undefined") {
        sessionStorage.setItem("postReturnToListId", result.id);
      }
      router.push(`/posts/${result.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "모집글 작성에 실패했습니다.");
    }
  };

  const handleGuestSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!guestWorldGroup) {
      setError("월드 그룹을 선택해주세요.");
      return;
    }
    if (!guestWorldName) {
      setError("월드를 선택해주세요.");
      return;
    }
    if (!guestCharacterName.trim()) {
      setError("캐릭터명을 입력해주세요.");
      return;
    }
    if (!contactLink.trim()) {
      setError("연락수단을 입력해주세요. (오픈카톡/디스코드 링크 또는 안내 문구)");
      return;
    }
    if (guestPassword.length < 4) {
      setError("비밀번호는 4자 이상 입력해주세요.");
      return;
    }
    if (guestPassword !== guestPasswordConfirm) {
      setError("비밀번호 확인이 일치하지 않습니다.");
      return;
    }
    const commonError = validateCommon();
    if (commonError) {
      setError(commonError);
      return;
    }

    try {
      const result = await createMutation.mutateAsync({
        guest: true,
        guestWorldGroup,
        guestWorldName,
        guestCharacterName: guestCharacterName.trim(),
        contactLink: contactLink.trim(),
        guestPassword,
        bossIds: selectedBossIds,
        requiredMembers,
        preferredTime: isScheduleTbd ? null : new Date(scheduledAt).toISOString(),
        description: memo || null,
      });
      // 작성 직후 상세 페이지에서 뒤로가기 시 목록으로 돌아가도록 플래그 저장
      if (typeof window !== "undefined") {
        sessionStorage.setItem("postReturnToListId", result.id);
      }
      router.push(`/posts/${result.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "모집글 작성에 실패했습니다.");
    }
  };

  if (authLoading) {
    return (
      <PageContainer className="max-w-2xl mx-auto">
        <div className="flex items-center justify-center py-16">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      </PageContainer>
    );
  }

  const isGuestMode = !isAuthenticated;

  return (
    <PageContainer className="max-w-2xl mx-auto">
      <div className="mb-6">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/posts">
            <ArrowLeft className="h-4 w-4 mr-2" />
            모집글 목록
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>파티 모집글 작성</CardTitle>
          <CardDescription>
            {isGuestMode
              ? "비회원으로 모집글을 작성합니다. 지원 기능은 사용할 수 없으며, 관심 있는 분은 연락수단을 통해 직접 연락해야 합니다."
              : "보스 레이드 파티를 모집합니다. 인증된 캐릭터만 사용할 수 있습니다."}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isGuestMode && (
            <div className="mb-6 p-3 rounded-lg border border-amber-200 bg-amber-50 text-amber-800 text-sm flex items-start gap-2">
              <UserCircle2 className="h-4 w-4 mt-0.5 flex-shrink-0" />
              <div>
                <div className="font-medium">비회원 모집글 안내</div>
                <div className="text-xs mt-1">
                  로그인한 캐릭터로 작성하고 지원 기능을 쓰려면{" "}
                  <Link href="/login" className="underline font-medium">
                    로그인
                  </Link>
                  해주세요.
                </div>
              </div>
            </div>
          )}

          <form
            onSubmit={isGuestMode ? handleGuestSubmit : handleMemberSubmit}
            className="space-y-6"
          >
            {isGuestMode ? (
              <>
                {/* Guest: World Group */}
                <div className="space-y-2">
                  <Label>월드 그룹</Label>
                  <Select
                    value={guestWorldGroup}
                    onValueChange={(v) => {
                      setGuestWorldGroup(v as WorldGroup);
                      setGuestWorldName("");
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="월드 그룹을 선택하세요" />
                    </SelectTrigger>
                    <SelectContent>
                      {sortedWorldGroups.map((g) => (
                        <SelectItem key={g.id} value={g.id}>
                          {g.displayName}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Guest: World */}
                <div className="space-y-2">
                  <Label>월드</Label>
                  <Select
                    value={guestWorldName}
                    onValueChange={setGuestWorldName}
                    disabled={!guestWorldGroup}
                  >
                    <SelectTrigger>
                      <SelectValue
                        placeholder={guestWorldGroup ? "월드를 선택하세요" : "먼저 월드 그룹을 선택하세요"}
                      />
                    </SelectTrigger>
                    <SelectContent>
                      {availableWorlds.map((w) => (
                        <SelectItem key={w} value={w}>
                          {w}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Guest: Character Name */}
                <div className="space-y-2">
                  <Label htmlFor="guestCharacterName">캐릭터명</Label>
                  <Input
                    id="guestCharacterName"
                    value={guestCharacterName}
                    onChange={(e) => setGuestCharacterName(e.target.value)}
                    placeholder="인게임 캐릭터명을 정확히 입력해주세요"
                    maxLength={20}
                  />
                  <p className="text-xs text-muted-foreground">
                    작성 시 넥슨 공식 API로 캐릭터 존재 여부를 확인합니다.
                  </p>
                </div>

                {/* Guest: Contact Link */}
                <div className="space-y-2">
                  <Label htmlFor="contactLink">연락수단</Label>
                  <Input
                    id="contactLink"
                    value={contactLink}
                    onChange={(e) => setContactLink(e.target.value)}
                    placeholder="오픈카톡 링크, 디스코드 ID 등"
                    maxLength={500}
                  />
                  <p className="text-xs text-muted-foreground">
                    이 글을 본 사람이 직접 연락할 수 있는 유일한 통로입니다.
                  </p>
                </div>

                {/* Guest: Password */}
                <div className="space-y-2">
                  <Label htmlFor="guestPassword">비밀번호</Label>
                  <Input
                    id="guestPassword"
                    type="password"
                    value={guestPassword}
                    onChange={(e) => setGuestPassword(e.target.value)}
                    placeholder="4자 이상"
                    maxLength={50}
                    autoComplete="new-password"
                  />
                  <Input
                    id="guestPasswordConfirm"
                    type="password"
                    value={guestPasswordConfirm}
                    onChange={(e) => setGuestPasswordConfirm(e.target.value)}
                    placeholder="비밀번호 확인"
                    maxLength={50}
                    autoComplete="new-password"
                  />
                  <p className="text-xs text-muted-foreground">
                    작성한 글을 수정하거나 모집 종료할 때 필요합니다. 분실 시 복구할 수 없으니 꼭 기억해주세요.
                  </p>
                </div>
              </>
            ) : (
              <>
                {/* Member: Character Selection */}
                <div className="space-y-2">
                  <Label>캐릭터 선택</Label>
                  {verifiedCharacters.length === 0 ? (
                    <div className="p-4 bg-muted rounded-lg text-sm text-muted-foreground">
                      인증된 캐릭터가 없습니다.{" "}
                      <Link href="/characters" className="text-primary hover:underline">
                        캐릭터를 인증
                      </Link>
                      해주세요.
                    </div>
                  ) : (
                    <Select value={selectedCharacterId} onValueChange={setSelectedCharacterId}>
                      <SelectTrigger>
                        <SelectValue placeholder="캐릭터를 선택하세요" />
                      </SelectTrigger>
                      <SelectContent>
                        {verifiedCharacters.map((char) => (
                          <SelectItem key={char.id} value={char.id}>
                            <div className="flex items-center gap-2">
                              <span>{char.characterName}</span>
                              <span className="text-xs text-muted-foreground">
                                (Lv.{char.characterLevel} {char.characterClass})
                              </span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                  {selectedCharacter && (
                    <div className="mt-2">
                      <WorldGroupBadge worldGroup={selectedCharacter.worldGroup} />
                      <span className="text-xs text-muted-foreground ml-2">
                        같은 월드 그룹의 캐릭터만 지원할 수 있습니다
                      </span>
                    </div>
                  )}
                </div>
              </>
            )}

            {/* Boss Selection */}
            <div className="space-y-2">
              <Label>보스 선택</Label>
              <BossMultiSelector value={selectedBossIds} onChange={setSelectedBossIds} />
            </div>

            {/* Required Members */}
            <div className="space-y-2">
              <Label htmlFor="requiredMembers">모집 인원</Label>
              <Select
                value={requiredMembers.toString()}
                onValueChange={(v) => setRequiredMembers(parseInt(v))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {[2, 3, 4, 5, 6].map((n) => (
                    <SelectItem key={n} value={n.toString()}>
                      {n}명
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Scheduled Date */}
            <div className="space-y-2">
              <Label htmlFor="scheduledAt">예정 날짜</Label>
              <div className="flex items-center space-x-2 mb-2">
                <Checkbox
                  id="scheduleTbd"
                  checked={isScheduleTbd}
                  onCheckedChange={(checked) => {
                    setIsScheduleTbd(checked === true);
                    if (checked) setScheduledAt("");
                  }}
                />
                <label
                  htmlFor="scheduleTbd"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  상의 후 결정
                </label>
              </div>
              {!isScheduleTbd && (
                <Input
                  id="scheduledAt"
                  type="date"
                  value={scheduledAt}
                  onChange={(e) => setScheduledAt(e.target.value)}
                  min={new Date().toISOString().slice(0, 10)}
                />
              )}
              <p className="text-xs text-muted-foreground">
                정확한 출발 시간은 파티방에서 일정 조율을 통해 확정합니다.
              </p>
            </div>

            {/* Memo */}
            <div className="space-y-2">
              <Label htmlFor="memo">메모 (선택사항)</Label>
              <Textarea
                id="memo"
                value={memo}
                onChange={(e) => setMemo(e.target.value)}
                placeholder="파티원에게 전달할 메시지를 입력하세요"
                rows={3}
              />
            </div>

            <div className="p-3 rounded-lg bg-muted text-sm text-muted-foreground flex items-center gap-2">
              <Clock className="h-4 w-4 flex-shrink-0" />
              모집글은 작성 후 7일이 지나면 자동으로 마감됩니다.
            </div>

            {error && (
              <div className="p-3 rounded-lg bg-error-bg text-error-text text-body-sm flex items-center gap-2">
                <span>😢</span>
                {error}
              </div>
            )}

            <Button
              type="submit"
              className="w-full h-12 text-body btn-maple"
              disabled={
                createMutation.isPending ||
                (!isGuestMode && verifiedCharacters.length === 0)
              }
            >
              {createMutation.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  작성 중...
                </>
              ) : isGuestMode ? (
                "비회원으로 모집글 올리기"
              ) : (
                "모집글 작성하기"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </PageContainer>
  );
}
