import { ref } from "vue";
import { defineStore } from "pinia";
import type { StatutesContent } from "../types/statutes.types";
import { getApiErrorMessage, vsg } from "@/lib/sdk";

export const useStatutesStore = defineStore("statutes", () => {
  const statutes = ref<StatutesContent | null>(null);
  const isLoading = ref(false);
  const error = ref<string | null>(null);

  async function fetchStatutes(): Promise<StatutesContent | null> {
    isLoading.value = true;
    error.value = null;

    try {
      const data = await vsg.get<StatutesContent>("/api/statutes");
      statutes.value = data;
      return data;
    } catch (e) {
      error.value = getApiErrorMessage(e);
      return null;
    } finally {
      isLoading.value = false;
    }
  }

  return {
    statutes,
    isLoading,
    error,
    fetchStatutes,
  };
});
