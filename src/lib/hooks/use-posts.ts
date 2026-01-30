"use client";

import { useQuery, useMutation, useQueryClient, useInfiniteQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api";
import { useAuth } from "@/lib/hooks/use-auth";
import { partyRoomKeys } from "@/lib/hooks/use-party-rooms";
import type {
  PageResponse,
  PostResponse,
  ApplicationResponse,
  ApplicationWithCharacterResponse,
  PostDetailResponse,
  PublicCharacterResponse,
  CreatePostRequest,
  ApplyRequest,
} from "@/types/api";

export const postKeys = {
  all: ["posts"] as const,
  lists: () => [...postKeys.all, "list"] as const,
  list: (filters: { worldGroup?: string }) => [...postKeys.lists(), filters] as const,
  detail: (id: string) => [...postKeys.all, "detail", id] as const,
  applications: (postId: string) => [...postKeys.all, "applications", postId] as const,
  myApplications: () => [...postKeys.all, "myApplications"] as const,
  myPosts: () => [...postKeys.all, "myPosts"] as const,
};

const DEFAULT_PAGE_SIZE = 10;

export function usePosts(filters?: { worldGroup?: string }) {
  return useInfiniteQuery({
    queryKey: postKeys.list(filters || {}),
    queryFn: async ({ pageParam = 0 }) => {
      const result = await apiClient.posts.list({
        worldGroup: filters?.worldGroup,
        page: pageParam as number,
        size: DEFAULT_PAGE_SIZE,
      });
      if (!result.success) throw new Error(result.error.message);
      return result.data as PageResponse<PostResponse>;
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage) => (lastPage.hasNext ? lastPage.page + 1 : undefined),
  });
}

export function usePost(id: string) {
  return useQuery({
    queryKey: postKeys.detail(id),
    queryFn: async () => {
      const result = await apiClient.posts.get(id);
      if (!result.success) throw new Error(result.error.message);
      return result.data as PostDetailResponse;
    },
    enabled: !!id,
  });
}

export function useCreatePost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreatePostRequest) => {
      const result = await apiClient.posts.create(data);
      if (!result.success) throw new Error(result.error.message);
      return result.data as { id: string };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: postKeys.lists() });
    },
  });
}

export function useClosePost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (postId: string) => {
      const result = await apiClient.posts.close(postId);
      if (!result.success) throw new Error(result.error.message);
      return { postId };
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: postKeys.detail(data.postId) });
      queryClient.invalidateQueries({ queryKey: postKeys.lists() });
    },
  });
}

export function useApplications(postId: string) {
  return useQuery({
    queryKey: postKeys.applications(postId),
    queryFn: async () => {
      const result = await apiClient.posts.getApplications(postId);
      if (!result.success) throw new Error(result.error.message);
      return result.data as ApplicationResponse[];
    },
    enabled: !!postId,
  });
}

export function useApplyToPost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ postId, data }: { postId: string; data: ApplyRequest }) => {
      const result = await apiClient.posts.apply(postId, data);
      if (!result.success) throw new Error(result.error.message);
      return result.data as ApplicationResponse;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: postKeys.detail(variables.postId) });
      queryClient.invalidateQueries({ queryKey: postKeys.myApplications() });
    },
  });
}

export function useRespondToApplication() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      postId,
      applicationId,
      accept,
    }: {
      postId: string;
      applicationId: string;
      accept: boolean;
    }) => {
      const result = await apiClient.posts.respondApplication(postId, applicationId, accept);
      if (!result.success) throw new Error(result.error.message);
      return { postId, accept };
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: postKeys.applications(data.postId) });
      queryClient.invalidateQueries({ queryKey: postKeys.detail(data.postId) });
      // 수락 시 파티방이 생성될 수 있으므로 파티 목록도 갱신
      if (data.accept) {
        queryClient.invalidateQueries({ queryKey: partyRoomKeys.list() });
      }
    },
  });
}

export function useWithdrawApplication() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ postId, applicationId }: { postId: string; applicationId: string }) => {
      const result = await apiClient.posts.withdrawApplication(postId, applicationId);
      if (!result.success) throw new Error(result.error.message);
      return { postId };
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: postKeys.detail(data.postId) });
      queryClient.invalidateQueries({ queryKey: postKeys.myApplications() });
    },
  });
}

export function useMyApplications() {
  const { user } = useAuth();
  return useQuery({
    queryKey: postKeys.myApplications(),
    queryFn: async () => {
      const result = await apiClient.posts.myApplications();
      if (!result.success) throw new Error(result.error.message);
      return result.data as ApplicationResponse[];
    },
    enabled: !!user,
  });
}

export function useMyPosts() {
  const { user } = useAuth();
  return useQuery({
    queryKey: postKeys.myPosts(),
    queryFn: async () => {
      const result = await apiClient.posts.myPosts();
      if (!result.success) throw new Error(result.error.message);
      return result.data as PostResponse[];
    },
    enabled: !!user,
  });
}
