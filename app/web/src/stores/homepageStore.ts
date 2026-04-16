import { ref } from "vue";
import { defineStore } from "pinia";
import type { HomepageContent } from "@/types/homepage-content.types";
import { getApiErrorMessage, vsg } from "@/lib/sdk";

export const useHomepageStore = defineStore("homepage", () => {
  const homepageContent = ref<HomepageContent | null>(null);
  const isLoading = ref(false);
  const error = ref<string | null>(null);

  async function fetchHomepageContent(): Promise<HomepageContent | null> {
    isLoading.value = true;
    error.value = null;

    try {
      const data = await vsg.get<HomepageContent>("/api/homepage-content");
      homepageContent.value = data;
      return data;
    } catch (e) {
      error.value = getApiErrorMessage(e);
      return null;
    } finally {
      isLoading.value = false;
    }
  }

  async function ensureLoaded(): Promise<HomepageContent | null> {
    if (homepageContent.value) {
      return homepageContent.value;
    }

    return fetchHomepageContent();
  }

  return {
    homepageContent,
    isLoading,
    error,
    fetchHomepageContent,
    ensureLoaded,
  };
});
