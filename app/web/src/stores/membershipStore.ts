import { ref } from "vue";
import { defineStore } from "pinia";
import type { MembershipContent } from "../types/membership.types";
import { getApiErrorMessage, vsg } from "@/lib/sdk";

export const useMembershipStore = defineStore("membership", () => {
  const membership = ref<MembershipContent | null>(null);
  const isLoading = ref(false);
  const error = ref<string | null>(null);

  async function fetchMembership(): Promise<MembershipContent | null> {
    isLoading.value = true;
    error.value = null;

    try {
      const data = await vsg.get<MembershipContent>("/api/membership");
      membership.value = data;
      return data;
    } catch (e) {
      error.value = getApiErrorMessage(e);
      return null;
    } finally {
      isLoading.value = false;
    }
  }

  return {
    membership,
    isLoading,
    error,
    fetchMembership,
  };
});
