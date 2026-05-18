import { ref } from "vue";
import { defineStore } from "pinia";
import type { ApiClubHistory } from "@vsg/types";
import { getApiErrorMessage, vsg } from "@/lib/sdk";

export const useClubHistoryStore = defineStore("club-history", () => {
  const history = ref<ApiClubHistory | null>(null);
  const isLoading = ref(false);
  const error = ref<string | null>(null);
  let request: Promise<void> | null = null;

  async function fetchClubHistory(): Promise<void> {
    isLoading.value = true;
    error.value = null;

    try {
      const result = await vsg.clubHistory.list({ query: { itemsPerPage: 1 } });
      history.value = result.member?.[0] ?? null;
    } catch (e) {
      error.value = getApiErrorMessage(e);
      throw e;
    } finally {
      isLoading.value = false;
    }
  }

  async function ensureLoaded(): Promise<void> {
    if (history.value) {
      return;
    }

    if (!request) {
      request = fetchClubHistory().finally(() => {
        request = null;
      });
    }

    await request;
  }

  return {
    history,
    isLoading,
    error,
    fetchClubHistory,
    ensureLoaded,
  };
});
