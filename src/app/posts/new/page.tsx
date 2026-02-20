"use client";

import { useState } from "react";
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
import { ArrowLeft, Clock, Loader2 } from "lucide-react";

export default function NewPostPage() {
  const router = useRouter();
  const { data: charactersData } = useCharacters();
  const createMutation = useCreatePost();

  const [selectedCharacterId, setSelectedCharacterId] = useState("");
  const [selectedBossIds, setSelectedBossIds] = useState<string[]>([]);
  const [requiredMembers, setRequiredMembers] = useState(2);
  const [scheduledAt, setScheduledAt] = useState("");
  const [isScheduleTbd, setIsScheduleTbd] = useState(false);
  const [memo, setMemo] = useState("");
  const [error, setError] = useState<string | null>(null);

  // Only show verified characters
  const verifiedCharacters =
    charactersData?.filter((c) => c.verificationStatus === "VERIFIED_OWNER") || [];

  const selectedCharacter = verifiedCharacters.find((c) => c.id === selectedCharacterId);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!selectedCharacterId) {
      setError("캐릭터를 선택해주세요.");
      return;
    }

    if (selectedBossIds.length === 0) {
      setError("최소 1개 이상의 보스를 선택해주세요.");
      return;
    }

    if (!isScheduleTbd && !scheduledAt) {
      setError("예정 날짜를 입력하거나 '상의 후 결정'을 선택해주세요.");
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

      router.push(`/posts/${result.id}`);
    } catch (err) {
      setError("모집글 작성에 실패했습니다. 다시 시도해주세요.");
    }
  };

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
            보스 레이드 파티를 모집합니다. 인증된 캐릭터만 사용할 수 있습니다.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Character Selection */}
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
              disabled={createMutation.isPending || verifiedCharacters.length === 0}
            >
              {createMutation.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  작성 중...
                </>
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
