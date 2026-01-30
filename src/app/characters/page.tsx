"use client";

import {useState} from "react";
import {PageContainer, PageHeader} from "@/components/layout/PageContainer";
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {Label} from "@/components/ui/label";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {CharacterCard, CharacterCardSkeleton} from "@/components/domain/CharacterCard";
import {EmptyState} from "@/components/common/EmptyState";
import {ErrorState} from "@/components/common/ErrorState";
import {LoadingSpinner} from "@/components/common/LoadingSpinner";
import {useCharacters, useClaimCharacter} from "@/lib/hooks/use-characters";
import {useRequireAuth} from "@/lib/hooks/use-require-auth";
import {Plus, Users, Loader2} from "lucide-react";

// 메이플스토리 월드 목록
const WORLDS = [
    // 챌린저스
    {name: "챌린저스", group: "CHALLENGER"},
    {name: "챌린저스2", group: "CHALLENGER"},
    {name: "챌린저스3", group: "CHALLENGER"},
    {name: "챌린저스4", group: "CHALLENGER"},
    // 에오스/헬리오스
    {name: "에오스", group: "EOS_HELIOS"},
    {name: "헬리오스", group: "EOS_HELIOS"},
    // 일반 월드
    {name: "스카니아", group: "NORMAL"},
    {name: "베라", group: "NORMAL"},
    {name: "루나", group: "NORMAL"},
    {name: "제니스", group: "NORMAL"},
    {name: "크로아", group: "NORMAL"},
    {name: "유니온", group: "NORMAL"},
    {name: "엘리시움", group: "NORMAL"},
    {name: "이노시스", group: "NORMAL"},
    {name: "레드", group: "NORMAL"},
    {name: "오로라", group: "NORMAL"},
    {name: "아케인", group: "NORMAL"},
    {name: "노바", group: "NORMAL"},
];

export default function CharactersPage() {
    const {isAuthenticated, isLoading: authLoading} = useRequireAuth();
    const {data: characters, isLoading, error, refetch} = useCharacters();
    const claimMutation = useClaimCharacter();

    const [dialogOpen, setDialogOpen] = useState(false);
    const [characterName, setCharacterName] = useState("");
    const [worldName, setWorldName] = useState("");
    const [claimError, setClaimError] = useState<string | null>(null);

    const handleClaimCharacter = async () => {
        if (!characterName.trim() || !worldName) {
            setClaimError("캐릭터 이름과 월드를 입력해주세요.");
            return;
        }

        setClaimError(null);
        try {
            await claimMutation.mutateAsync({
                characterName: characterName.trim(),
                worldName,
            });
            setDialogOpen(false);
            setCharacterName("");
            setWorldName("");
        } catch (err) {
            setClaimError(err instanceof Error ? err.message : "캐릭터 등록에 실패했습니다.");
        }
    };

    // Show loading while checking auth
    if (authLoading) {
        return (
            <PageContainer className="flex items-center justify-center min-h-[50vh]">
                <LoadingSpinner size="lg"/>
            </PageContainer>
        );
    }

    // Don't render if not authenticated (will redirect)
    if (!isAuthenticated) {
        return null;
    }

    if (error) {
        return (
            <PageContainer>
                <ErrorState
                    title="캐릭터를 불러올 수 없습니다"
                    message={error.message}
                    onRetry={() => refetch()}
                />
            </PageContainer>
        );
    }

    return (
        <PageContainer>
            <PageHeader
                title="내 캐릭터"
                description="등록된 캐릭터 목록입니다. 캐릭터를 등록하고 소유권을 인증하세요."
                actions={
                    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                            <DialogTrigger asChild>
                                <Button>
                                    <Plus className="h-4 w-4 mr-2"/>
                                    캐릭터 등록
                                </Button>
                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>캐릭터 등록</DialogTitle>
                                    <DialogDescription>
                                        등록할 캐릭터 정보를 입력하세요. 등록 후 소유권 인증이 필요합니다.
                                    </DialogDescription>
                                </DialogHeader>
                                <div className="space-y-4 py-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="characterName">캐릭터 이름</Label>
                                        <Input
                                            id="characterName"
                                            value={characterName}
                                            onChange={(e) => setCharacterName(e.target.value)}
                                            placeholder="캐릭터 이름 입력"
                                            maxLength={12}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="worldName">월드</Label>
                                        <Select value={worldName} onValueChange={setWorldName}>
                                            <SelectTrigger>
                                                <SelectValue placeholder="월드 선택"/>
                                            </SelectTrigger>
                                            <SelectContent>
                                                {WORLDS.map((world) => (
                                                    <SelectItem key={world.name} value={world.name}>
                                                        {world.name}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="p-3 bg-muted rounded-lg text-xs text-muted-foreground space-y-1">
                                        <p>* 레벨 260 이상의 캐릭터만 등록할 수 있습니다.</p>
                                        <p>* 월드리프 시 자동으로 반영되지 않으니 재등록 부탁드립니다.</p>
                                    </div>
                                    {claimError && (
                                        <p className="text-sm text-destructive">{claimError}</p>
                                    )}
                                </div>
                                <DialogFooter>
                                    <Button
                                        variant="outline"
                                        onClick={() => setDialogOpen(false)}
                                    >
                                        취소
                                    </Button>
                                    <Button
                                        onClick={handleClaimCharacter}
                                        disabled={claimMutation.isPending}
                                    >
                                        {claimMutation.isPending ? (
                                            <>
                                                <Loader2 className="h-4 w-4 mr-2 animate-spin"/>
                                                등록 중...
                                            </>
                                        ) : (
                                            "등록하기"
                                        )}
                                    </Button>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>
                }
            />

            {isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {[...Array(3)].map((_, i) => (
                        <CharacterCardSkeleton key={i}/>
                    ))}
                </div>
            ) : !characters?.length ? (
                <EmptyState
                    icon={<Users className="h-8 w-8 text-muted-foreground"/>}
                    title="등록된 캐릭터가 없습니다"
                    description="캐릭터를 등록하고 소유권 인증을 진행하세요."
                    action={{
                        label: "캐릭터 등록",
                        onClick: () => setDialogOpen(true),
                    }}
                />
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {characters.map((character) => (
                        <CharacterCard key={character.id} character={character}/>
                    ))}
                </div>
            )}
        </PageContainer>
    );
}
