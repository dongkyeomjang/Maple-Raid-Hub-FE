// Mock handlers are no longer used - real backend integration
// This file is kept for reference only

import type { ApiResponse } from "@/types/api";

export function createMockHandlers(): Record<string, () => Promise<ApiResponse<unknown>>> {
  return {};
}
