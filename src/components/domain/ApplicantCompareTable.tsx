"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { CharacterDetailDialog } from "./CharacterDetailDialog";
import { useCharacters } from "@/lib/hooks/use-characters";
import { useChatStore } from "@/lib/stores/chat-store";
import type { ApplicationWithCharacterResponse, PublicCharacterResponse } from "@/types/api";
import { User, Check, X, Clock, Swords, Shield, Eye, MessageCircle, CheckCircle } from "lucide-react";

interface ApplicantCompareTableProps {
  applications: ApplicationWithCharacterResponse[];
  postId: string;
  onAccept: (applicationId: string) => void;
  onReject: (applicationId: string) => void;
  isProcessing: boolean;
}

interface SelectedCharacterInfo {
  character: PublicCharacterResponse;
}

interface DMTargetInfo {
  userId: string;
  name: string;
  characterId: string | null;
  characterImageUrl: string | null;
}

export function ApplicantCompareTable({
  applications,
  postId,
  onAccept,
  onReject,
  isProcessing,
}: ApplicantCompareTableProps) {
  const [selectedInfo, setSelectedInfo] = useState<SelectedCharacterInfo | null>(null);
  const [dmTarget, setDmTarget] = useState<DMTargetInfo | null>(null);
  const [dmCharacterSelectOpen, setDmCharacterSelectOpen] = useState(false);
  const [selectedDmCharacterId, setSelectedDmCharacterId] = useState("");

  const { data: charactersData } = useCharacters();
  const setDraftDm = useChatStore((s) => s.setDraftDm);

  // 인증된 캐릭터 목록
  const verifiedCharacters = charactersData?.filter(
    (c) => c.verificationStatus === "VERIFIED_OWNER"
  ) ?? [];

  if (applications.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        아직 지원자가 없습니다
      </div>
    );
  }

  const formatCombatPower = (power: number) => {
    if (power >= 100000000) {
      return `${(power / 100000000).toFixed(1)}억`;
    }
    if (power >= 10000) {
      return `${Math.floor(power / 10000)}만`;
    }
    return power.toLocaleString();
  };

  return (
    <>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b">
              <th className="py-3 px-4 text-left font-medium text-sm">캐릭터</th>
              <th className="py-3 px-4 text-left font-medium text-sm">스펙</th>
              <th className="py-3 px-4 text-left font-medium text-sm">메시지</th>
              <th className="py-3 px-4 text-center font-medium text-sm">상태</th>
              <th className="py-3 px-4 text-center font-medium text-sm">액션</th>
            </tr>
          </thead>
          <tbody>
            {applications.map((app) => {
              const char = app.character;
              return (
                <tr key={app.id} className="border-b hover:bg-muted/50">
                  <td className="py-3 px-4">
                    <button
                      className="flex items-center gap-3 text-left hover:opacity-80 transition-opacity"
                      onClick={() => char && setSelectedInfo({ character: char })}
                      disabled={!char}
                    >
                      <div className="h-12 w-12 rounded-full overflow-hidden bg-muted flex-shrink-0">
                        {char?.characterImageUrl ? (
                          <img
                            src={char.characterImageUrl}
                            alt={char.characterName}
                            className="w-full h-full object-cover scale-[2.5] object-[45%_35%]"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <User className="h-5 w-5 text-muted-foreground" />
                          </div>
                        )}
                      </div>
                      <div>
                        <p className="font-medium">{char?.characterName ?? "알 수 없음"}</p>
                        <p className="text-xs text-muted-foreground">
                          {char?.characterClass ?? "-"} · {char?.worldName ?? "-"}
                        </p>
                        {char?.verificationStatus === "VERIFIED_OWNER" && (
                          <Badge variant="success" className="text-xs mt-1">
                            <Shield className="h-3 w-3 mr-1" />
                            인증됨
                          </Badge>
                        )}
                      </div>
                    </button>
                  </td>
                  <td className="py-3 px-4">
                    {char ? (
                      <div className="space-y-1">
                        <p className="text-sm font-medium">Lv.{char.characterLevel}</p>
                        <p className="text-xs text-muted-foreground flex items-center gap-1">
                          <Swords className="h-3 w-3 text-orange-500" />
                          <span className="text-orange-600 font-medium">
                            {formatCombatPower(char.combatPower)}
                          </span>
                        </p>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-6 px-2 text-xs"
                          onClick={() => setSelectedInfo({ character: char })}
                        >
                          <Eye className="h-3 w-3 mr-1" />
                          상세 보기
                        </Button>
                      </div>
                    ) : (
                      <span className="text-muted-foreground text-sm">-</span>
                    )}
                  </td>
                  <td className="py-3 px-4">
                    {app.message ? (
                      <p className="text-sm max-w-xs truncate" title={app.message}>
                        {app.message}
                      </p>
                    ) : (
                      <span className="text-muted-foreground text-sm">-</span>
                    )}
                  </td>
                  <td className="py-3 px-4 text-center">
                    <ApplicationStatusBadge status={app.status} />
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center justify-center gap-2">
                      {verifiedCharacters.length > 0 && (
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => {
                            setDmTarget({
                              userId: app.applicantId,
                              name: char?.characterName ?? "지원자",
                              characterId: char?.id ?? null,
                              characterImageUrl: char?.characterImageUrl ?? null,
                            });
                            setDmCharacterSelectOpen(true);
                          }}
                          title="메시지 보내기"
                        >
                          <MessageCircle className="h-4 w-4" />
                        </Button>
                      )}
                      {app.status === "APPLIED" && (
                        <>
                          <Button
                            size="sm"
                            variant="default"
                            onClick={() => onAccept(app.id)}
                            disabled={isProcessing}
                          >
                            <Check className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => onReject(app.id)}
                            disabled={isProcessing}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <CharacterDetailDialog
        character={selectedInfo?.character ?? null}
        open={!!selectedInfo}
        onOpenChange={(open) => !open && setSelectedInfo(null)}
      />

      {/* DM 캐릭터 선택 다이얼로그 */}
      <Dialog
        open={dmCharacterSelectOpen}
        onOpenChange={(open) => {
          setDmCharacterSelectOpen(open);
          if (!open) {
            setDmTarget(null);
            setSelectedDmCharacterId("");
          }
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>메시지 보내기</DialogTitle>
            <DialogDescription>
              어떤 캐릭터로 {dmTarget?.name}님에게 메시지를 보낼까요?
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3 py-4">
            {verifiedCharacters.map((char) => (
              <button
                key={char.id}
                className={`w-full flex items-center gap-3 p-3 rounded-lg border transition-colors ${
                  selectedDmCharacterId === char.id
                    ? "border-primary bg-primary/5"
                    : "border-muted hover:bg-muted/50"
                }`}
                onClick={() => setSelectedDmCharacterId(char.id)}
              >
                <div className="h-10 w-10 rounded-full overflow-hidden bg-muted flex-shrink-0">
                  {char.characterImageUrl ? (
                    <img
                      src={char.characterImageUrl}
                      alt={char.characterName}
                      className="w-full h-full object-cover scale-[2.5] object-[45%_35%]"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <User className="h-5 w-5 text-muted-foreground" />
                    </div>
                  )}
                </div>
                <div className="flex-1 text-left">
                  <div className="font-medium">{char.characterName}</div>
                  <div className="text-sm text-muted-foreground">
                    Lv.{char.characterLevel} {char.characterClass}
                  </div>
                </div>
                {selectedDmCharacterId === char.id && (
                  <CheckCircle className="h-5 w-5 text-primary" />
                )}
              </button>
            ))}
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setDmCharacterSelectOpen(false);
                setDmTarget(null);
                setSelectedDmCharacterId("");
              }}
            >
              취소
            </Button>
            <Button
              disabled={!selectedDmCharacterId || !dmTarget}
              onClick={() => {
                const selectedChar = verifiedCharacters.find(
                  (c) => c.id === selectedDmCharacterId
                );
                if (selectedChar && dmTarget) {
                  setDraftDm({
                    targetUserId: dmTarget.userId,
                    targetName: dmTarget.name,
                    targetCharacterId: dmTarget.characterId,
                    targetCharacterImageUrl: dmTarget.characterImageUrl,
                    postId: postId,
                    senderCharacterId: selectedChar.id,
                    senderCharacterName: selectedChar.characterName,
                    senderCharacterImageUrl: selectedChar.characterImageUrl,
                  });
                  setDmCharacterSelectOpen(false);
                  setDmTarget(null);
                  setSelectedDmCharacterId("");
                }
              }}
            >
              <MessageCircle className="h-4 w-4 mr-2" />
              메시지 보내기
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

function ApplicationStatusBadge({ status }: { status: string }) {
  const config: Record<
    string,
    { label: string; variant: "default" | "secondary" | "success" | "destructive" | "warning"; icon: React.ElementType }
  > = {
    APPLIED: { label: "대기 중", variant: "warning", icon: Clock },
    ACCEPTED: { label: "수락됨", variant: "success", icon: Check },
    REJECTED: { label: "거절됨", variant: "destructive", icon: X },
    CANCELED: { label: "취소됨", variant: "secondary", icon: X },
    WITHDRAWN: { label: "철회됨", variant: "secondary", icon: X },
  };

  const { label, variant, icon: Icon } = config[status] || config.APPLIED;

  return (
    <Badge variant={variant} className="gap-1">
      <Icon className="h-3 w-3" />
      {label}
    </Badge>
  );
}
