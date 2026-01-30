import { api, isMockMode, setTokens, getAccessToken, clearTokens } from "./client";

// Export the API client - always use real API
export const apiClient = api;

// Re-export token management
export { setTokens, getAccessToken, clearTokens, isMockMode };

// Re-export types
export type { ApiResponse, ErrorResponse } from "@/types/api";
