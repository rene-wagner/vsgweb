import { VsgApiError, createVsgClient } from "@vsg/vsg-sdk";

export const vsg = createVsgClient({
  baseUrl: import.meta.env.VITE_API_BASE_URL,
});

export function getApiErrorMessage(
  error: unknown,
  fallback = "Ein Fehler ist aufgetreten",
): string {
  if (error instanceof VsgApiError) {
    return error.message;
  }

  if (error instanceof Error && error.message.length > 0) {
    return error.message;
  }

  return fallback;
}
