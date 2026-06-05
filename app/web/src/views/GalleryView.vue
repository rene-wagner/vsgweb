<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, watch, watchEffect } from "vue";
import { useRoute, useRouter } from "vue-router";
import { storeToRefs } from "pinia";
import type { MediaItem } from "@vsg/sdk";
import CtaSection from "@/components/sections/CtaSection.vue";
import HeroSectionSmall from "@/components/sections/HeroSectionSmall.vue";
import ApiState from "@/components/ui/ApiState.vue";
import { getMediaDisplayUrl, getMediaThumbnailUrl } from "@/services/media-items/media-item.service";
import { useCategoriesStore } from "@/stores/categoriesStore";
import { useMediaItemsStore } from "@/stores/mediaItemsStore";

const MEDIA_ITEMS_PER_PAGE = 12;

const route = useRoute();
const router = useRouter();
const categoriesStore = useCategoriesStore();
const mediaItemsStore = useMediaItemsStore();
const { categories } = storeToRefs(categoriesStore);
const {
  paginatedMediaItems,
  paginatedMediaItemsPage,
  paginatedMediaItemsItemsPerPage,
  paginatedMediaItemsTotalItems,
  paginatedMediaItemsLoading,
  paginatedMediaItemsError,
} = storeToRefs(mediaItemsStore);

const selectedIndex = ref<number | null>(null);

const currentPage = computed(() => {
  const page = Number.parseInt(String(route.query.page ?? "1"), 10);
  return Number.isNaN(page) || page < 1 ? 1 : page;
});

const selectedCategorySlug = computed(() => {
  const category = route.query.category;

  return typeof category === "string" && category.length > 0 ? category : null;
});

const categoryOptions = computed(() => {
  return categories.value
    .filter(
      (category) =>
        typeof category.id === "number" &&
        typeof category.slug === "string" &&
        category.slug.length > 0 &&
        typeof category.name === "string" &&
        category.name.length > 0,
    )
    .map((category) => ({
      id: category.id,
      slug: category.slug as string,
      name: category.name as string,
    }));
});

const selectedCategory = computed(() => {
  if (!selectedCategorySlug.value) {
    return null;
  }

  return categoryOptions.value.find((category) => category.slug === selectedCategorySlug.value) ?? null;
});

const selectedItem = computed(() => {
  if (selectedIndex.value === null) {
    return null;
  }

  return paginatedMediaItems.value[selectedIndex.value] ?? null;
});

const emptyMessage = computed(() => {
  return selectedCategory.value
    ? `Für die Kategorie ${selectedCategory.value.name} sind derzeit keine Bilder verfügbar.`
    : "Derzeit sind keine Bilder verfügbar.";
});

const totalPages = computed(() => {
  if (paginatedMediaItemsTotalItems.value === 0) {
    return 1;
  }

  return Math.max(
    1,
    Math.ceil(
      paginatedMediaItemsTotalItems.value / Math.max(1, paginatedMediaItemsItemsPerPage.value),
    ),
  );
});

const hasPreviousPage = computed(() => currentPage.value > 1);
const hasNextPage = computed(() => currentPage.value < totalPages.value);

function buildQuery(page: number, categorySlug = selectedCategorySlug.value) {
  return {
    ...(page > 1 ? { page: String(page) } : {}),
    ...(categorySlug ? { category: categorySlug } : {}),
  };
}

function updatePage(page: number): void {
  const nextPage = Math.min(Math.max(1, page), totalPages.value);

  void router.push({
    name: "gallery",
    query: buildQuery(nextPage),
  });
}

function updateCategory(categorySlug: string | null): void {
  void router.push({
    name: "gallery",
    query: buildQuery(1, categorySlug),
  });
}

function normalizeCategoryQuery(): boolean {
  if (selectedCategorySlug.value && !selectedCategory.value) {
    void router.replace({
      name: "gallery",
      query: buildQuery(currentPage.value, null),
    });

    return false;
  }

  return true;
}

function fetchPage(page: number): void {
  void mediaItemsStore
    .fetchMediaItemsPage(page, MEDIA_ITEMS_PER_PAGE, selectedCategory.value?.id)
    .catch(() => undefined);
}

function getImageAlt(item: MediaItem, index: number): string {
  return item.description || item.original_filename || item.name || `Galeriebild ${index + 1}`;
}

function openLightbox(index: number): void {
  selectedIndex.value = index;
  document.body.classList.add("overflow-hidden");
}

function closeLightbox(): void {
  selectedIndex.value = null;
  document.body.classList.remove("overflow-hidden");
}

function showPrevious(): void {
  if (selectedIndex.value === null || paginatedMediaItems.value.length === 0) {
    return;
  }

  selectedIndex.value =
    (selectedIndex.value - 1 + paginatedMediaItems.value.length) % paginatedMediaItems.value.length;
}

function showNext(): void {
  if (selectedIndex.value === null || paginatedMediaItems.value.length === 0) {
    return;
  }

  selectedIndex.value = (selectedIndex.value + 1) % paginatedMediaItems.value.length;
}

function handleKeydown(event: KeyboardEvent): void {
  if (selectedIndex.value === null) {
    return;
  }

  if (event.key === "Escape") {
    closeLightbox();
    return;
  }

  if (event.key === "ArrowLeft") {
    showPrevious();
    return;
  }

  if (event.key === "ArrowRight") {
    showNext();
  }
}

onMounted(() => {
  window.addEventListener("keydown", handleKeydown);

  if (!normalizeCategoryQuery()) {
    return;
  }

  fetchPage(currentPage.value);
});

watch([() => route.query.page, () => route.query.category, categoryOptions], () => {
  if (!normalizeCategoryQuery()) {
    return;
  }

  closeLightbox();
  fetchPage(currentPage.value);
});

watch(paginatedMediaItems, (items) => {
  if (items.length === 0) {
    selectedIndex.value = null;
    return;
  }

  if (selectedIndex.value !== null && selectedIndex.value >= items.length) {
    selectedIndex.value = items.length - 1;
  }
});

watch(totalPages, (pageCount) => {
  if (currentPage.value > pageCount && paginatedMediaItemsTotalItems.value > 0) {
    updatePage(pageCount);
  }
});

watchEffect(() => {
  document.title = "Galerie | VSG Kugelberg";
});

onUnmounted(() => {
  window.removeEventListener("keydown", handleKeydown);
  document.body.classList.remove("overflow-hidden");
  mediaItemsStore.clearPaginatedMediaItems();
});
</script>

<template>
  <div
    class="min-h-screen overflow-x-hidden text-white selection:bg-vsg-gold-500 selection:text-vsg-blue-900"
  >
    <HeroSectionSmall
      headline="GALERIE"
      description="Bilder aus unserem Vereinsleben."
      headline-uuid="35e9c86a-3e22-4b21-bc84-03c1e1347520"
      description-uuid="d4370db1-e2fa-4d79-b4dc-c11c2e7fdb05"
      subtitle-uuid="9c15e09c-9659-4df5-8f6b-d341c1d8fe18"
    />

    <section class="bg-white py-16">
      <div class="mx-auto max-w-7xl px-6">
        <ApiState
          :is-loading="paginatedMediaItemsLoading"
          :error="paginatedMediaItemsError"
          :empty="paginatedMediaItems.length === 0"
          :empty-message="emptyMessage"
        >
          <div class="mb-10 flex flex-wrap gap-3 border-b border-vsg-blue-100 pb-6">
            <button
              type="button"
              class="rounded-md border px-4 py-2 font-body text-sm font-bold uppercase tracking-wider transition-colors"
              :class="
                selectedCategorySlug === null
                  ? 'border-vsg-blue-900 bg-vsg-blue-900 text-white'
                  : 'border-vsg-blue-200 text-vsg-blue-800 hover:border-vsg-blue-600 hover:text-vsg-blue-600'
              "
              @click="updateCategory(null)"
            >
              Alle
            </button>
            <button
              v-for="category in categoryOptions"
              :key="category.slug"
              type="button"
              class="rounded-md border px-4 py-2 font-body text-sm font-bold uppercase tracking-wider transition-colors"
              :class="
                selectedCategorySlug === category.slug
                  ? 'border-vsg-blue-900 bg-vsg-blue-900 text-white'
                  : 'border-vsg-blue-200 text-vsg-blue-800 hover:border-vsg-blue-600 hover:text-vsg-blue-600'
              "
              @click="updateCategory(category.slug)"
            >
              {{ category.name }}
            </button>
          </div>

          <div class="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-4">
            <button
              v-for="(item, index) in paginatedMediaItems"
              :key="item.id"
              type="button"
              class="group relative aspect-square overflow-hidden rounded-md bg-vsg-blue-950 shadow-lg shadow-vsg-blue-900/10"
              @click="openLightbox(index)"
            >
              <img
                :src="getMediaThumbnailUrl(item)"
                :alt="getImageAlt(item, index)"
                class="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                loading="lazy"
              />
              <div
                class="absolute inset-0 bg-linear-to-t from-vsg-blue-950/70 via-vsg-blue-950/10 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"
              />
              <div
                class="absolute bottom-4 right-4 flex h-11 w-11 items-center justify-center rounded-full bg-white/90 text-vsg-blue-900 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100"
              >
                <FontAwesomeIcon icon="image" />
              </div>
            </button>
          </div>

          <div
            v-if="paginatedMediaItems.length > 0"
            class="mt-12 flex flex-col items-center justify-between gap-4 border-t border-vsg-blue-100 pt-8 md:flex-row"
          >
            <button
              type="button"
              class="rounded-md border border-vsg-blue-200 px-6 py-3 font-display text-lg tracking-wider text-vsg-blue-900 transition-colors hover:border-vsg-blue-600 hover:text-vsg-blue-600 disabled:cursor-not-allowed disabled:border-vsg-blue-100 disabled:text-vsg-blue-300"
              :disabled="!hasPreviousPage"
              @click="updatePage(currentPage - 1)"
            >
              Vorherige
            </button>

            <p class="font-body text-base text-vsg-blue-700">
              Seite {{ paginatedMediaItemsPage }} von {{ totalPages }}
            </p>

            <button
              type="button"
              class="rounded-md border border-vsg-blue-200 px-6 py-3 font-display text-lg tracking-wider text-vsg-blue-900 transition-colors hover:border-vsg-blue-600 hover:text-vsg-blue-600 disabled:cursor-not-allowed disabled:border-vsg-blue-100 disabled:text-vsg-blue-300"
              :disabled="!hasNextPage"
              @click="updatePage(currentPage + 1)"
            >
              Nächste
            </button>
          </div>
        </ApiState>
      </div>
    </section>

    <CtaSection
      headline=""
      description=""
      headline-uuid="22913475-2d4e-4263-a57c-23f88ac7f4e4"
      description-uuid="214917f8-3523-4811-8421-23e16fc61730"
    />

    <div
      v-if="selectedItem"
      class="fixed inset-0 z-50 flex items-center justify-center bg-vsg-blue-950/90 p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-label="Galeriebild"
      @click.self="closeLightbox"
    >
      <button
        type="button"
        class="absolute right-4 top-4 z-10 flex h-12 w-12 items-center justify-center rounded-md bg-white/10 text-white transition-colors hover:bg-white/20"
        aria-label="Galerie schliessen"
        @click="closeLightbox"
      >
        <FontAwesomeIcon icon="xmark" class="text-xl" />
      </button>

      <button
        v-if="paginatedMediaItems.length > 1"
        type="button"
        class="absolute left-4 flex h-12 w-12 items-center justify-center rounded-md bg-white/10 text-white transition-colors hover:bg-white/20"
        aria-label="Vorheriges Bild"
        @click="showPrevious"
      >
        <FontAwesomeIcon icon="arrow-left" />
      </button>

      <img
        :src="getMediaDisplayUrl(selectedItem)"
        :alt="getImageAlt(selectedItem, selectedIndex ?? 0)"
        class="max-h-[90vh] max-w-full rounded-md object-contain shadow-2xl"
      />

      <button
        v-if="paginatedMediaItems.length > 1"
        type="button"
        class="absolute right-4 flex h-12 w-12 items-center justify-center rounded-md bg-white/10 text-white transition-colors hover:bg-white/20"
        aria-label="Naechstes Bild"
        @click="showNext"
      >
        <FontAwesomeIcon icon="arrow-right" />
      </button>
    </div>
  </div>
</template>
