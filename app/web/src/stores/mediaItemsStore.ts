import { ref } from "vue";
import { defineStore } from "pinia";
import type { MediaItem } from "@vsg/sdk";
import { getApiErrorMessage, vsg } from "@/lib/sdk";

export const useMediaItemsStore = defineStore("mediaItems", () => {
  const mediaItems = ref<MediaItem[]>([]);
  const isLoading = ref(false);
  const error = ref<string | null>(null);

  const departmentMediaItems = ref<MediaItem[]>([]);
  const isDepartmentMediaItemsLoading = ref(false);
  const departmentMediaItemsError = ref<string | null>(null);

  async function fetchMediaItems(itemsPerPage = 20): Promise<void> {
    isLoading.value = true;
    error.value = null;

    try {
      const result = await vsg.gallery.list({
        query: {
          itemsPerPage,
        },
      });
      mediaItems.value = result.member ?? [];
    } catch (e) {
      error.value = getApiErrorMessage(e);
      throw e;
    } finally {
      isLoading.value = false;
    }
  }

  async function fetchMediaItemsByCategory(categoryId: number, itemsPerPage = 20): Promise<void> {
    isDepartmentMediaItemsLoading.value = true;
    departmentMediaItemsError.value = null;

    try {
      const result = await vsg.gallery.list({
        query: {
          itemsPerPage,
          category: categoryId,
        },
      });
      departmentMediaItems.value = result.member ?? [];
    } catch (e) {
      departmentMediaItemsError.value = getApiErrorMessage(e);
      throw e;
    } finally {
      isDepartmentMediaItemsLoading.value = false;
    }
  }

  function clearDepartmentMediaItems(): void {
    departmentMediaItems.value = [];
    isDepartmentMediaItemsLoading.value = false;
    departmentMediaItemsError.value = null;
  }

  return {
    mediaItems,
    isLoading,
    error,
    departmentMediaItems,
    isDepartmentMediaItemsLoading,
    departmentMediaItemsError,
    fetchMediaItems,
    fetchMediaItemsByCategory,
    clearDepartmentMediaItems,
  };
});
