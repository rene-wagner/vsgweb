import { ref } from "vue";
import { defineStore } from "pinia";
import type { SportInsuranceContent } from "../types/sport-insurance.types";
import { getApiErrorMessage, vsg } from "@/lib/sdk";

export const useSportInsuranceStore = defineStore("sportInsurance", () => {
  const sportInsurance = ref<SportInsuranceContent | null>(null);
  const isLoading = ref(false);
  const error = ref<string | null>(null);

  async function fetchSportInsurance(): Promise<SportInsuranceContent | null> {
    isLoading.value = true;
    error.value = null;

    try {
      const data = await vsg.get<SportInsuranceContent>("/api/sport-insurance");
      sportInsurance.value = data;
      return data;
    } catch (e) {
      error.value = getApiErrorMessage(e);
      return null;
    } finally {
      isLoading.value = false;
    }
  }

  return {
    sportInsurance,
    isLoading,
    error,
    fetchSportInsurance,
  };
});
