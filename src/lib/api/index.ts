import { api, isMockMode } from "./client";

// Export the API client - always use real API
export const apiClient = api;

// Re-export
export { isMockMode };

// Re-export types
export type { ApiResponse, ErrorResponse } from "@/types/api";
