<script setup lang="ts">
import { computed, onMounted, onUnmounted, watch, watchEffect } from "vue";
import { useRoute, useRouter } from "vue-router";
import { storeToRefs } from "pinia";
import { useCategoriesStore } from "@/stores/categoriesStore";
import HeroSectionSmall from "@/components/content/HeroSectionSmall.vue";
import ContentSection from "@/components/content/ContentSection.vue";
import NewsCardListItem from "@/components/content/NewsCardListItem.vue";
import ApiState from "@/components/ui/ApiState.vue";
import { usePostsStore } from "@/stores/postsStore";

const POSTS_PER_PAGE = 10;

const route = useRoute();
const router = useRouter();
const categoriesStore = useCategoriesStore();
const postsStore = usePostsStore();
const { categories } = storeToRefs(categoriesStore);
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

const selectedCategorySlug = computed(() => {
  const category = route.query.category;

  return typeof category === "string" && category.length > 0 ? category : null;
});

const categoryOptions = computed(() => {
  return categories.value
    .filter(
      (category) =>
        typeof category.slug === "string" &&
        category.slug.length > 0 &&
        typeof category.name === "string" &&
        category.name.length > 0 &&
        typeof category["@id"] === "string" &&
        category["@id"]?.length > 0,
    )
    .map((category) => ({
      slug: category.slug as string,
      name: category.name as string,
      iri: category["@id"] as string,
    }));
});

const selectedCategory = computed(() => {
  if (!selectedCategorySlug.value) {
    return null;
  }

  return (
    categoryOptions.value.find((category) => category.slug === selectedCategorySlug.value) ?? null
  );
});

const emptyMessage = computed(() => {
  return selectedCategory.value
    ? `Fuer die Kategorie ${selectedCategory.value.name} sind derzeit keine Beitraege verfuegbar.`
    : "Derzeit sind keine Beiträge verfügbar.";
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
  return categories.length > 0 ? categories[0].name : "Allgemein";
}

function buildQuery(page: number, categorySlug = selectedCategorySlug.value) {
  return {
    ...(page > 1 ? { page: String(page) } : {}),
    ...(categorySlug ? { category: categorySlug } : {}),
  };
}

function updatePage(page: number) {
  const nextPage = Math.min(Math.max(1, page), totalPages.value);

  void router.push({
    name: "post-list",
    query: buildQuery(nextPage),
  });
}

function updateCategory(categorySlug: string | null) {
  void router.push({
    name: "post-list",
    query: buildQuery(1, categorySlug),
  });
}

function normalizeCategoryQuery() {
  if (selectedCategorySlug.value && !selectedCategory.value) {
    void router.replace({
      name: "post-list",
      query: buildQuery(currentPage.value, null),
    });

    return false;
  }

  return true;
}

function fetchPage(page: number) {
  void postsStore
    .fetchPublishedPostsPage(page, POSTS_PER_PAGE, selectedCategory.value?.iri)
    .catch(() => undefined);
}

onMounted(() => {
  if (!normalizeCategoryQuery()) {
    return;
  }

  fetchPage(currentPage.value);
});

watch([() => route.query.page, () => route.query.category, categoryOptions], () => {
  if (!normalizeCategoryQuery()) {
    return;
  }

  fetchPage(currentPage.value);
});

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
    <HeroSectionSmall headline="BEITRÄGE" description="Alle Beiträge auf einen Blick." />

    <ContentSection max-width="7xl">
      <ApiState
        :is-loading="paginatedPostsLoading"
        :error="paginatedPostsError"
        :empty="paginatedPosts.length === 0"
        :empty-message="emptyMessage"
      >
        <div class="mb-10 flex flex-wrap gap-3 border-b border-vsg-blue-100 pb-6">
          <button
            type="button"
            class="rounded-full border px-4 py-2 font-body text-sm font-bold uppercase tracking-wider transition-colors"
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
            class="rounded-full border px-4 py-2 font-body text-sm font-bold uppercase tracking-wider transition-colors"
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
