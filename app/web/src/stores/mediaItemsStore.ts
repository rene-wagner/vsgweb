import { ref } from "vue";
import { defineStore } from "pinia";
import type { GalleryYear, MediaItem } from "@vsg/sdk";
import { getApiErrorMessage, vsg } from "@/lib/sdk";

const DEFAULT_GALLERY_PAGE_SIZE = 12;

export const useMediaItemsStore = defineStore("mediaItems", () => {
  const mediaItems = ref<MediaItem[]>([]);
  const isLoading = ref(false);
  const error = ref<string | null>(null);

  const departmentMediaItems = ref<MediaItem[]>([]);
  const isDepartmentMediaItemsLoading = ref(false);
  const departmentMediaItemsError = ref<string | null>(null);

  const paginatedMediaItems = ref<MediaItem[]>([]);
  const paginatedMediaItemsPage = ref(1);
  const paginatedMediaItemsItemsPerPage = ref(DEFAULT_GALLERY_PAGE_SIZE);
  const paginatedMediaItemsTotalItems = ref(0);
  const paginatedMediaItemsLoading = ref(false);
  const paginatedMediaItemsError = ref<string | null>(null);

  const galleryYears = ref<GalleryYear[]>([]);
  const galleryYearsLoading = ref(false);
  const galleryYearsError = ref<string | null>(null);

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

  async function fetchMediaItemsPage(
    page = 1,
    itemsPerPage = DEFAULT_GALLERY_PAGE_SIZE,
    categoryId?: number | null,
    year?: number | null,
  ): Promise<void> {
    paginatedMediaItemsLoading.value = true;
    paginatedMediaItemsError.value = null;

    try {
      const result = await vsg.gallery.list({
        query: {
          page,
          itemsPerPage,
          ...(typeof categoryId === "number" ? { category: categoryId } : {}),
          ...(typeof year === "number" ? { year } : {}),
        },
      });

      paginatedMediaItems.value = result.member ?? [];
      paginatedMediaItemsPage.value = page;
      paginatedMediaItemsItemsPerPage.value = itemsPerPage;
      paginatedMediaItemsTotalItems.value = result.totalItems ?? paginatedMediaItems.value.length;
    } catch (e) {
      paginatedMediaItemsError.value = getApiErrorMessage(e);
      throw e;
    } finally {
      paginatedMediaItemsLoading.value = false;
    }
  }

  async function fetchGalleryYears(): Promise<void> {
    galleryYearsLoading.value = true;
    galleryYearsError.value = null;

    try {
      galleryYears.value = await vsg.gallery.years();
    } catch (e) {
      galleryYearsError.value = getApiErrorMessage(e);
      throw e;
    } finally {
      galleryYearsLoading.value = false;
    }
  }

  function clearDepartmentMediaItems(): void {
    departmentMediaItems.value = [];
    isDepartmentMediaItemsLoading.value = false;
    departmentMediaItemsError.value = null;
  }

  function clearPaginatedMediaItems(): void {
    paginatedMediaItems.value = [];
    paginatedMediaItemsPage.value = 1;
    paginatedMediaItemsItemsPerPage.value = DEFAULT_GALLERY_PAGE_SIZE;
    paginatedMediaItemsTotalItems.value = 0;
    paginatedMediaItemsLoading.value = false;
    paginatedMediaItemsError.value = null;
  }

  return {
    mediaItems,
    isLoading,
    error,
    departmentMediaItems,
    isDepartmentMediaItemsLoading,
    departmentMediaItemsError,
    paginatedMediaItems,
    paginatedMediaItemsPage,
    paginatedMediaItemsItemsPerPage,
    paginatedMediaItemsTotalItems,
    paginatedMediaItemsLoading,
    paginatedMediaItemsError,
    galleryYears,
    galleryYearsLoading,
    galleryYearsError,
    fetchMediaItems,
    fetchMediaItemsByCategory,
    fetchMediaItemsPage,
    fetchGalleryYears,
    clearDepartmentMediaItems,
    clearPaginatedMediaItems,
  };
});
