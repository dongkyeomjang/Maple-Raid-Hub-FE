"use client";

import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { PageContainer, PageHeader } from "@/components/layout/PageContainer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ApplicantCompareTable } from "@/components/domain/ApplicantCompareTable";
import { ErrorState } from "@/components/common/ErrorState";
import { LoadingPage } from "@/components/common/LoadingSpinner";
import {
  usePost,
  useRespondToApplication,
  useClosePost,
  usePostUpdates,
} from "@/lib/hooks/use-posts";
import { useBossNames } from "@/lib/hooks/use-boss-names";
import { ArrowLeft, Users, Settings, XCircle } from "lucide-react";

export default function ManagePostPage() {
  const params = useParams();
  const router = useRouter();
  const postId = params.id as string;

  const { data: postDetail, isLoading: postLoading, error: postError, refetch: refetchPost } = usePost(postId);
  usePostUpdates(postId);
  const { formatBossNames } = useBossNames();
  const respondMutation = useRespondToApplication();
  const closeMutation = useClosePost();

  const post = postDetail?.post;
  const applications = postDetail?.applications ?? [];

  const handleAccept = async (applicationId: string) => {
    await respondMutation.mutateAsync({ postId, applicationId, accept: true });
    refetchPost();
  };

  const handleReject = async (applicationId: string) => {
    await respondMutation.mutateAsync({ postId, applicationId, accept: false });
    refetchPost();
  };

  const handleClosePost = async () => {
    if (confirm("정말 이 모집글을 마감하시겠습니까?")) {
      await closeMutation.mutateAsync(postId);
      router.push(`/posts/${postId}`);
    }
  };

  if (postLoading) {
    return (
      <PageContainer>
        <LoadingPage message="모집글 정보를 불러오는 중..." />
      </PageContainer>
    );
  }

  if (postError || !post) {
    return (
      <PageContainer>
        <ErrorState
          title="모집글을 찾을 수 없습니다"
          message={postError?.message || "존재하지 않는 모집글입니다."}
        />
      </PageContainer>
    );
  }

  const bossIds = post?.bossIds ?? [];
  const displayName = formatBossNames(bossIds);
  const pendingApplications = applications.filter((a) => a.status === "APPLIED");
  const processedApplications = applications.filter((a) => a.status !== "APPLIED");

  return (
    <PageContainer>
      <div className="mb-6">
        <Button variant="ghost" size="sm" asChild>
          <Link href={`/posts/${postId}`}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            모집글로 돌아가기
          </Link>
        </Button>
      </div>

      <PageHeader
        title="모집글 관리"
        description={`${displayName} 파티 관리`}
        actions={
          post.status === "RECRUITING" && (
            <Button
              variant="destructive"
              onClick={handleClosePost}
              disabled={closeMutation.isPending}
            >
              <XCircle className="h-4 w-4 mr-2" />
              모집 마감
            </Button>
          )
        }
      />

      <Tabs defaultValue="pending">
        <TabsList className="mb-4">
          <TabsTrigger value="pending" className="gap-2">
            <Users className="h-4 w-4" />
            대기 중 ({pendingApplications.length})
          </TabsTrigger>
          <TabsTrigger value="processed" className="gap-2">
            <Settings className="h-4 w-4" />
            처리됨 ({processedApplications.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="pending">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">대기 중인 지원자</CardTitle>
            </CardHeader>
            <CardContent>
              <ApplicantCompareTable
                applications={pendingApplications}
                postId={postId}
                onAccept={handleAccept}
                onReject={handleReject}
                isProcessing={respondMutation.isPending}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="processed">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">처리된 지원자</CardTitle>
            </CardHeader>
            <CardContent>
              <ApplicantCompareTable
                applications={processedApplications}
                postId={postId}
                onAccept={handleAccept}
                onReject={handleReject}
                isProcessing={false}
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </PageContainer>
  );
}
