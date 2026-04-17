import { ref } from "vue";
import { defineStore } from "pinia";
import { type Category as ApiCategory } from "@vsg/sdk";
import { getApiErrorMessage, vsg } from "@/lib/sdk";

export const useCategoriesStore = defineStore("categories", () => {
  const categories = ref<ApiCategory[]>([]);
  const isLoading = ref(false);
  const error = ref<string | null>(null);

  async function fetchCategories(): Promise<void> {
    isLoading.value = true;
    error.value = null;

    try {
      const result = await vsg.categories.list();
      categories.value = (result.member ?? []) as ApiCategory[];
    } catch (e) {
      error.value = getApiErrorMessage(e);
      throw e;
    } finally {
      isLoading.value = false;
    }
  }

  return {
    categories,
    isLoading,
    error,
    fetchCategories,
  };
});
