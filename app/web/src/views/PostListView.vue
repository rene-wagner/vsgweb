<script setup lang="ts">
import { computed, onMounted, onUnmounted, watch, watchEffect } from "vue";
import { useRoute, useRouter } from "vue-router";
import { storeToRefs } from "pinia";
import HeroSection from "@/components/content/HeroSection.vue";
import ContentSection from "@/components/content/ContentSection.vue";
import NewsCardListItem from "@/components/content/NewsCardListItem.vue";
import ApiState from "@/components/ui/ApiState.vue";
import { usePostsStore } from "@/stores/postsStore";

const POSTS_PER_PAGE = 10;

const route = useRoute();
const router = useRouter();
const postsStore = usePostsStore();
const {
  paginatedPosts,
  paginatedPostsPage,
  paginatedPostsItemsPerPage,
  paginatedPostsTotalItems,
  paginatedPostsLoading,
  paginatedPostsError,
} = storeToRefs(postsStore);

const currentPage = computed(() => {
  const page = Number.parseInt(String(route.query.page ?? "1"), 10);
  return Number.isNaN(page) || page < 1 ? 1 : page;
});

const totalPages = computed(() => {
  if (paginatedPostsTotalItems.value === 0) {
    return 1;
  }

  return Math.max(
    1,
    Math.ceil(paginatedPostsTotalItems.value / Math.max(1, paginatedPostsItemsPerPage.value)),
  );
});

const hasPreviousPage = computed(() => currentPage.value > 1);
const hasNextPage = computed(() => currentPage.value < totalPages.value);

function formatDate(dateString: string): string {
  if (!dateString) {
    return "Datum unbekannt";
  }

  const date = new Date(dateString);

  if (Number.isNaN(date.getTime())) {
    return "Datum unbekannt";
  }

  return date.toLocaleDateString("de-DE", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function getCategoryName(categories: { name: string }[]): string {
  return categories.length > 0 ? categories[0].name.toUpperCase() : "ALLGEMEIN";
}

function updatePage(page: number) {
  const nextPage = Math.min(Math.max(1, page), totalPages.value);

  void router.push({
    name: "post-list",
    query: nextPage === 1 ? {} : { page: String(nextPage) },
  });
}

function fetchPage(page: number) {
  void postsStore.fetchPublishedPostsPage(page, POSTS_PER_PAGE).catch(() => undefined);
}

onMounted(() => {
  fetchPage(currentPage.value);
});

watch(
  () => route.query.page,
  () => {
    fetchPage(currentPage.value);
  },
);

watch(totalPages, (pageCount) => {
  if (currentPage.value > pageCount && paginatedPostsTotalItems.value > 0) {
    updatePage(pageCount);
  }
});

watchEffect(() => {
  document.title = "Beiträge | VSG Kugelberg";
});

onUnmounted(() => {
  postsStore.clearPaginatedPosts();
});
</script>

<template>
  <div
    class="min-h-screen overflow-x-hidden text-white selection:bg-vsg-gold-500 selection:text-vsg-blue-900"
  >
    <HeroSection
      headline="BEITRÄGE"
      description="Alle Beiträge auf einen Blick."
      min-height="70vh"
    />

    <ContentSection max-width="7xl">
      <ApiState
        :is-loading="paginatedPostsLoading"
        :error="paginatedPostsError"
        :empty="paginatedPosts.length === 0"
        empty-message="Derzeit sind keine Beiträge verfügbar."
      >
        <div class="space-y-6">
          <NewsCardListItem
            v-for="post in paginatedPosts"
            :key="post.id"
            :category="getCategoryName(post.categories)"
            :date="formatDate(post.createdAt)"
            :title="post.title"
            :to="`/beitrag/${post.slug}`"
          />
        </div>

        <div
          v-if="paginatedPosts.length > 0"
          class="mt-12 flex flex-col items-center justify-between gap-4 border-t border-vsg-blue-100 pt-8 md:flex-row"
        >
          <button
            type="button"
            class="border border-vsg-blue-200 px-6 py-3 font-display text-lg tracking-wider text-vsg-blue-900 transition-colors hover:border-vsg-blue-600 hover:text-vsg-blue-600 disabled:cursor-not-allowed disabled:border-vsg-blue-100 disabled:text-vsg-blue-300"
            :disabled="!hasPreviousPage"
            @click="updatePage(currentPage - 1)"
          >
            Vorherige
          </button>

          <p class="font-body text-base text-vsg-blue-700">
            Seite {{ paginatedPostsPage }} von {{ totalPages }}
          </p>

          <button
            type="button"
            class="border border-vsg-blue-200 px-6 py-3 font-display text-lg tracking-wider text-vsg-blue-900 transition-colors hover:border-vsg-blue-600 hover:text-vsg-blue-600 disabled:cursor-not-allowed disabled:border-vsg-blue-100 disabled:text-vsg-blue-300"
            :disabled="!hasNextPage"
            @click="updatePage(currentPage + 1)"
          >
            Nächste
          </button>
        </div>
      </ApiState>
    </ContentSection>
  </div>
</template>
