"use client";

import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { PageContainer } from "@/components/layout/PageContainer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { WorldGroupBadge } from "@/components/domain/WorldGroupBadge";
import { VerificationBadge } from "@/components/domain/VerificationBadge";
import { EquipmentGrid } from "@/components/domain/EquipmentGrid";
import { ErrorState } from "@/components/common/ErrorState";
import { LoadingPage } from "@/components/common/LoadingSpinner";
import { useCharacter, useDeleteCharacter, useSyncCharacter } from "@/lib/hooks/use-characters";
import { formatDate, formatDateTime } from "@/lib/utils";
import { User, Shield, Trash2, ArrowLeft, Swords, RefreshCw } from "lucide-react";
import type { EquipmentInfo } from "@/types/api";

export default function CharacterDetailPage() {
  const params = useParams();
  const router = useRouter();
  const characterId = params.id as string;

  const { data: character, isLoading, error, refetch } = useCharacter(characterId);
  const deleteMutation = useDeleteCharacter();
  const syncMutation = useSyncCharacter();

  const handleSync = async () => {
    try {
      await syncMutation.mutateAsync(characterId);
      refetch();
    } catch (err) {
      // 에러는 mutation에서 처리됨
    }
  };

  const handleDelete = async () => {
    if (confirm("정말 이 캐릭터를 삭제하시겠습니까?")) {
      await deleteMutation.mutateAsync(characterId);
      router.push("/characters");
    }
  };

  if (isLoading) {
    return (
      <PageContainer>
        <LoadingPage message="캐릭터 정보를 불러오는 중..." />
      </PageContainer>
    );
  }

  if (error || !character) {
    return (
      <PageContainer>
        <ErrorState
          title="캐릭터를 찾을 수 없습니다"
          message={error?.message || "존재하지 않는 캐릭터입니다."}
          onRetry={() => refetch()}
        />
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <div className="mb-6">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/characters">
            <ArrowLeft className="h-4 w-4 mr-2" />
            캐릭터 목록
          </Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Info Card */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-start gap-4">
              <div className="h-20 w-20 rounded-full overflow-hidden bg-muted flex-shrink-0">
                {character.characterImageUrl ? (
                  <img
                    src={character.characterImageUrl}
                    alt={character.characterName}
                    className="w-full h-full object-cover scale-[2.5] object-[45%_35%]"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <User className="h-10 w-10 text-muted-foreground" />
                  </div>
                )}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <CardTitle className="text-2xl">{character.characterName}</CardTitle>
                  <VerificationBadge status={character.verificationStatus} />
                </div>
                <p className="text-lg text-muted-foreground">
                  Lv.{character.characterLevel} {character.characterClass}
                </p>
                {character.combatPower > 0 && (
                  <div className="flex items-center gap-2 mt-1">
                    <Swords className="h-5 w-5 text-orange-600" />
                    <span className="font-bold text-lg text-orange-600">{character.combatPower.toLocaleString()}</span>
                  </div>
                )}
                <div className="flex items-center gap-2 mt-2">
                  <WorldGroupBadge worldGroup={character.worldGroup} />
                  <span className="text-sm text-muted-foreground">
                    {character.worldName}
                  </span>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2 text-sm">
              <div className="flex justify-between py-2 border-b">
                <span className="text-muted-foreground">등록일</span>
                <span>{formatDate(character.claimedAt)}</span>
              </div>
              {character.verifiedAt && (
                <div className="flex justify-between py-2 border-b">
                  <span className="text-muted-foreground">인증일</span>
                  <span>{formatDate(character.verifiedAt)}</span>
                </div>
              )}
              {character.lastSyncedAt && (
                <div className="flex justify-between py-2 border-b">
                  <span className="text-muted-foreground">마지막 갱신</span>
                  <span>{formatDateTime(character.lastSyncedAt)}</span>
                </div>
              )}
            </div>

            {/* 전투력 안내 */}
            {character.combatPower > 0 && (
              <div className="p-3 bg-muted/50 rounded-lg text-xs text-muted-foreground space-y-1">
                <p>전투력은 갱신 당시 라이브 서버 기준입니다.</p>
                <p>자동 갱신 주기는 마지막 갱신으로부터 24시간입니다.</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Equipment Card */}
        {character.equipmentJson && (
          <EquipmentSection equipmentJson={character.equipmentJson} />
        )}

        {/* Actions Card */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">액션</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button
              variant="outline"
              className="w-full"
              onClick={handleSync}
              disabled={syncMutation.isPending}
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${syncMutation.isPending ? "animate-spin" : ""}`} />
              {syncMutation.isPending ? "갱신 중..." : "정보 갱신"}
            </Button>

            {character.verificationStatus !== "VERIFIED_OWNER" && (
              <Button className="w-full" asChild>
                <Link href={`/characters/${character.id}/verify`}>
                  <Shield className="h-4 w-4 mr-2" />
                  캐릭터 인증하기
                </Link>
              </Button>
            )}

            {character.verificationStatus === "VERIFIED_OWNER" && (
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-sm text-green-800">
                  이 캐릭터는 인증되었습니다. 파티 모집에 참여할 수 있습니다.
                </p>
              </div>
            )}

            <Button
              variant="destructive"
              className="w-full"
              onClick={handleDelete}
              disabled={deleteMutation.isPending}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              캐릭터 삭제
            </Button>
          </CardContent>
        </Card>
      </div>
    </PageContainer>
  );
}

function EquipmentSection({ equipmentJson }: { equipmentJson: string }) {
  let equipment: EquipmentInfo | null = null;

  try {
    equipment = JSON.parse(equipmentJson);
  } catch {
    return null;
  }

  if (!equipment || !equipment.slots || Object.keys(equipment.slots).length === 0) {
    return null;
  }

  return (
    <Card className="lg:col-span-2">
      <CardHeader>
        <CardTitle className="text-lg">장착 장비</CardTitle>
        <p className="text-sm text-muted-foreground">
          아이콘에 마우스를 올리면 간략 정보, 클릭하면 상세 정보를 확인할 수 있습니다.
        </p>
      </CardHeader>
      <CardContent>
        <EquipmentGrid equipment={equipment} />
      </CardContent>
    </Card>
  );
}
