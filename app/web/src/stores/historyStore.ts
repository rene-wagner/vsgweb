import { ref } from "vue";
import { defineStore } from "pinia";
import type { HistoryContent } from "../types/history.types";
import { getApiErrorMessage, vsg } from "@/lib/sdk";

export const useHistoryStore = defineStore("history", () => {
  const history = ref<HistoryContent | null>(null);
  const isLoading = ref(false);
  const error = ref<string | null>(null);

  async function fetchHistory(): Promise<HistoryContent | null> {
    isLoading.value = true;
    error.value = null;

    try {
      const data = await vsg.get<HistoryContent>("/api/history");
      history.value = data;
      return data;
    } catch (e) {
      error.value = getApiErrorMessage(e);
      return null;
    } finally {
      isLoading.value = false;
    }
  }

  async function ensureLoaded(): Promise<HistoryContent | null> {
    if (history.value) {
      return history.value;
    }

    return fetchHistory();
  }

  return {
    history,
    isLoading,
    error,
    fetchHistory,
    ensureLoaded,
  };
});
