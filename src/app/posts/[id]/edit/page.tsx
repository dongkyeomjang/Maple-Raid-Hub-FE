"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
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
import { usePost, useUpdatePost } from "@/lib/hooks/use-posts";
import { useAuth } from "@/lib/hooks/use-auth";
import { ArrowLeft, Loader2 } from "lucide-react";

export default function EditPostPage() {
  const router = useRouter();
  const params = useParams();
  const postId = params.id as string;

  const { user } = useAuth();
  const { data: postDetail, isLoading: isLoadingPost } = usePost(postId);
  const updateMutation = useUpdatePost();

  const [selectedBossIds, setSelectedBossIds] = useState<string[]>([]);
  const [requiredMembers, setRequiredMembers] = useState(2);
  const [scheduledAt, setScheduledAt] = useState("");
  const [isScheduleTbd, setIsScheduleTbd] = useState(false);
  const [memo, setMemo] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [initialized, setInitialized] = useState(false);

  const post = postDetail?.post;
  const currentMembers = post?.currentMembers ?? 1;

  // Initialize form with existing data
  useEffect(() => {
    if (post && !initialized) {
      setSelectedBossIds(post.bossIds);
      setRequiredMembers(post.requiredMembers);
      if (post.preferredTime) {
        // ISO string to date input format (YYYY-MM-DD)
        const date = new Date(post.preferredTime);
        setScheduledAt(date.toISOString().slice(0, 10));
        setIsScheduleTbd(false);
      } else {
        setScheduledAt("");
        setIsScheduleTbd(true);
      }
      setMemo(post.description || "");
      setInitialized(true);
    }
  }, [post, initialized]);

  // Check authorization
  if (postDetail && user && post?.authorId !== user.id) {
    router.replace(`/posts/${postId}`);
    return null;
  }

  if (isLoadingPost) {
    return (
      <PageContainer className="max-w-2xl mx-auto">
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </PageContainer>
    );
  }

  if (!post) {
    return (
      <PageContainer className="max-w-2xl mx-auto">
        <div className="text-center py-12 text-muted-foreground">
          모집글을 찾을 수 없습니다.
        </div>
      </PageContainer>
    );
  }

  if (post.status !== "RECRUITING") {
    return (
      <PageContainer className="max-w-2xl mx-auto">
        <div className="text-center py-12 text-muted-foreground">
          모집 중인 모집글만 수정할 수 있습니다.
        </div>
      </PageContainer>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (selectedBossIds.length === 0) {
      setError("최소 1개 이상의 보스를 선택해주세요.");
      return;
    }

    if (!isScheduleTbd && !scheduledAt) {
      setError("예정 날짜를 입력하거나 '상의 후 결정'을 선택해주세요.");
      return;
    }

    if (requiredMembers < currentMembers) {
      setError(`현재 파티원 수(${currentMembers}명)보다 적은 인원으로 변경할 수 없습니다.`);
      return;
    }

    try {
      await updateMutation.mutateAsync({
        postId,
        data: {
          bossIds: selectedBossIds,
          requiredMembers,
          ...(isScheduleTbd
            ? { clearPreferredTime: true }
            : { preferredTime: new Date(scheduledAt).toISOString() }),
          ...(memo ? { description: memo } : { clearDescription: true }),
        },
      });

      router.push(`/posts/${postId}`);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("모집글 수정에 실패했습니다. 다시 시도해주세요.");
      }
    }
  };

  // Generate available member count options (can't go below current members)
  const memberOptions = [2, 3, 4, 5, 6].filter((n) => n >= currentMembers);

  return (
    <PageContainer className="max-w-2xl mx-auto">
      <div className="mb-6">
        <Button variant="ghost" size="sm" asChild>
          <Link href={`/posts/${postId}`}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            모집글로 돌아가기
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>모집글 수정</CardTitle>
          <CardDescription>
            모집글 내용을 수정합니다. 현재 파티원 수({currentMembers}명)보다 적은 인원으로는 변경할 수 없습니다.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
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
                  {memberOptions.map((n) => (
                    <SelectItem key={n} value={n.toString()}>
                      {n}명
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {currentMembers > 1 && (
                <p className="text-xs text-muted-foreground">
                  현재 {currentMembers}명이 파티에 참여 중입니다.
                </p>
              )}
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

            {error && (
              <div className="p-3 rounded-lg bg-destructive/10 text-destructive text-sm flex items-center gap-2">
                <span>⚠️</span>
                {error}
              </div>
            )}

            <div className="flex gap-3">
              <Button
                type="button"
                variant="outline"
                className="flex-1"
                onClick={() => router.back()}
              >
                취소
              </Button>
              <Button
                type="submit"
                className="flex-1 btn-maple"
                disabled={updateMutation.isPending}
              >
                {updateMutation.isPending ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    수정 중...
                  </>
                ) : (
                  "수정하기"
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </PageContainer>
  );
}
