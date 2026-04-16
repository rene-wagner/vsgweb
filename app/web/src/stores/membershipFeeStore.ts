import { ref } from "vue";
import { defineStore } from "pinia";
import type { MembershipFeeContent } from "../types/membership-fee.types";
import { getApiErrorMessage, vsg } from "@/lib/sdk";

export const useMembershipFeeStore = defineStore("membershipFee", () => {
  const membershipFee = ref<MembershipFeeContent | null>(null);
  const isLoading = ref(false);
  const error = ref<string | null>(null);

  async function fetchMembershipFee(): Promise<MembershipFeeContent | null> {
    isLoading.value = true;
    error.value = null;

    try {
      const data = await vsg.get<MembershipFeeContent>("/api/membership-fee");
      membershipFee.value = data;
      return data;
    } catch (e) {
      error.value = getApiErrorMessage(e);
      return null;
    } finally {
      isLoading.value = false;
    }
  }

  return {
    membershipFee,
    isLoading,
    error,
    fetchMembershipFee,
  };
});
