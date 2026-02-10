"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/api";
import type { NotificationPreferencesResponse, UpdateNotificationPreferencesRequest } from "@/types/api";

export const notificationKeys = {
  all: ["notifications"] as const,
  preferences: () => [...notificationKeys.all, "preferences"] as const,
};

export function useNotificationPreferences() {
  return useQuery({
    queryKey: notificationKeys.preferences(),
    queryFn: async () => {
      const result = await apiClient.notifications.getPreferences();
      if (result.success) return result.data as NotificationPreferencesResponse;
      throw new Error(result.error.message);
    },
  });
}

export function useUpdateNotificationPreferences() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: UpdateNotificationPreferencesRequest) => {
      const result = await apiClient.notifications.updatePreferences(data);
      if (result.success) return result.data as NotificationPreferencesResponse;
      throw new Error(result.error.message);
    },
    onSuccess: (data) => {
      queryClient.setQueryData(notificationKeys.preferences(), data);
    },
  });
}
