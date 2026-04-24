<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, watch } from "vue";
import { storeToRefs } from "pinia";
import type { MediaItem } from "@vsg/sdk";
import ApiState from "@/components/ui/ApiState.vue";
import Section from "@/components/ui/Section.vue";
import type { SectionBackground } from "@/composables/useSectionBackground";
import {
  getMediaDisplayUrl,
  getMediaThumbnailUrl,
} from "@/services/media-items/media-item.service";
import { useMediaItemsStore } from "@/stores/mediaItemsStore";

interface Props {
  headline?: string;
  description?: string;
  subtitle?: string;
  itemsCount?: number;
  categoryId?: number | null;
  background?: SectionBackground;
}

const props = withDefaults(defineProps<Props>(), {
  itemsCount: 20,
  background: "white",
});

const mediaItemsStore = useMediaItemsStore();
const {
  mediaItems,
  isLoading,
  error,
  departmentMediaItems,
  isDepartmentMediaItemsLoading,
  departmentMediaItemsError,
} = storeToRefs(mediaItemsStore);

const selectedIndex = ref<number | null>(null);

const activeMediaItems = computed(() =>
  props.categoryId !== undefined ? departmentMediaItems.value : mediaItems.value,
);
const activeLoading = computed(() =>
  props.categoryId !== undefined ? isDepartmentMediaItemsLoading.value : isLoading.value,
);
const activeError = computed(() =>
  props.categoryId !== undefined ? departmentMediaItemsError.value : error.value,
);
const selectedItem = computed(() => {
  if (selectedIndex.value === null) {
    return null;
  }

  return activeMediaItems.value[selectedIndex.value] ?? null;
});

watch(
  [() => props.categoryId, () => props.itemsCount],
  ([categoryId, itemsCount]) => {
    if (typeof categoryId === "number") {
      void mediaItemsStore.fetchMediaItemsByCategory(categoryId, itemsCount).catch(() => undefined);
      return;
    }

    if (categoryId === null) {
      mediaItemsStore.clearDepartmentMediaItems();
      return;
    }

    if (mediaItems.value.length >= itemsCount && !error.value) {
      return;
    }

    void mediaItemsStore.fetchMediaItems(itemsCount).catch(() => undefined);
  },
  { immediate: true },
);

watch(activeMediaItems, (items) => {
  if (items.length === 0) {
    selectedIndex.value = null;
    return;
  }

  if (selectedIndex.value !== null && selectedIndex.value >= items.length) {
    selectedIndex.value = items.length - 1;
  }
});

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
  if (selectedIndex.value === null || activeMediaItems.value.length === 0) {
    return;
  }

  selectedIndex.value =
    (selectedIndex.value - 1 + activeMediaItems.value.length) % activeMediaItems.value.length;
}

function showNext(): void {
  if (selectedIndex.value === null || activeMediaItems.value.length === 0) {
    return;
  }

  selectedIndex.value = (selectedIndex.value + 1) % activeMediaItems.value.length;
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
});

onUnmounted(() => {
  window.removeEventListener("keydown", handleKeydown);
  document.body.classList.remove("overflow-hidden");
});
</script>

<template>
  <Section
    :subtitle="props.subtitle || ''"
    :title="props.headline || ''"
    subtitle-uuid="gallery-subtitle"
    title-uuid="gallery-title"
    :description="props.description"
    description-uuid="gallery-description"
    description-tag="p"
    :background="props.background"
  >
    <ApiState
      class="mt-16"
      :is-loading="activeLoading"
      :error="activeError"
      :empty="activeMediaItems.length === 0"
      empty-message="Derzeit sind keine Bilder verfuegbar."
    >
      <div class="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-4">
        <button
          v-for="(item, index) in activeMediaItems"
          :key="item.id"
          type="button"
          class="group relative aspect-square overflow-hidden rounded-2xl bg-vsg-blue-950 shadow-lg shadow-vsg-blue-900/10"
          @click="openLightbox(index)"
        >
          <img
            :src="getMediaThumbnailUrl(item)"
            :alt="getImageAlt(item, index)"
            class="h-full w-full object-cover transition duration-300 group-hover:scale-105"
            loading="lazy"
          />
          <div
            class="absolute inset-0 bg-gradient-to-t from-vsg-blue-950/70 via-vsg-blue-950/10 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"
          />
          <div
            class="absolute right-4 bottom-4 flex h-11 w-11 items-center justify-center rounded-full bg-white/90 text-vsg-blue-900 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100"
          >
            <FontAwesomeIcon icon="image" />
          </div>
        </button>
      </div>
    </ApiState>
  </Section>

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
      class="absolute top-4 right-4 z-10 flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20"
      aria-label="Galerie schliessen"
      @click="closeLightbox"
    >
      <FontAwesomeIcon icon="xmark" class="text-xl" />
    </button>

    <button
      v-if="activeMediaItems.length > 1"
      type="button"
      class="absolute left-4 flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20"
      aria-label="Vorheriges Bild"
      @click="showPrevious"
    >
      <FontAwesomeIcon icon="arrow-left" />
    </button>

    <img
      :src="getMediaDisplayUrl(selectedItem)"
      :alt="getImageAlt(selectedItem, selectedIndex ?? 0)"
      class="max-h-[90vh] max-w-full rounded-2xl object-contain shadow-2xl"
    />

    <button
      v-if="activeMediaItems.length > 1"
      type="button"
      class="absolute right-4 flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20"
      aria-label="Naechstes Bild"
      @click="showNext"
    >
      <FontAwesomeIcon icon="arrow-right" />
    </button>
  </div>
</template>
