<script setup lang="ts">
import { computed, watch } from "vue";
import { storeToRefs } from "pinia";
import { RouterLink } from "vue-router";
import EditableContent from "@/components/content/EditableContent.vue";
import SectionHeader from "@/components/ui/SectionHeader.vue";
import ApiState from "@/components/ui/ApiState.vue";
import { useSectionBackground, type SectionBackground } from "@/composables/useSectionBackground";
import NewsCardFeatured from "./NewsCardFeatured.vue";
import NewsCardListItem from "./NewsCardListItem.vue";
import { usePostsStore } from "../../stores/postsStore";

interface Props {
  headline?: string;
  description?: string;
  subtitle?: string;
  postsCount?: number;
  categoryIri?: string | null;
  categorySlug?: string | null;
  background?: SectionBackground;
}

const props = withDefaults(defineProps<Props>(), {
  postsCount: 5,
  background: "white",
});

const postsStore = usePostsStore();
const { posts, isLoading, error, departmentPosts, isDepartmentPostsLoading, departmentPostsError } =
  storeToRefs(postsStore);

// Use separate state when filtering by category
const activePosts = computed(() => (props.categoryIri ? departmentPosts.value : posts.value));
const activeLoading = computed(() =>
  props.categoryIri ? isDepartmentPostsLoading.value : isLoading.value,
);
const activeError = computed(() => (props.categoryIri ? departmentPostsError.value : error.value));
const postsOverviewRoute = computed(() => {
  if (!props.categorySlug) {
    return { name: "post-list" };
  }

  return {
    name: "post-list",
    query: {
      category: props.categorySlug,
    },
  };
});

watch(
  [() => props.categoryIri, () => props.postsCount],
  ([categoryIri, postsCount]) => {
    if (categoryIri) {
      void postsStore.fetchPublishedPostsByCategory(categoryIri, postsCount).catch(() => undefined);
      return;
    }

    if (props.categoryIri === null) {
      postsStore.clearDepartmentPosts();
      return;
    }

    if (posts.value.length >= postsCount && !error.value) {
      return;
    }

    void postsStore.fetchPublishedPosts(postsCount).catch(() => undefined);
  },
  { immediate: true },
);

// Format date to German locale
function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString("de-DE", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

// Get category name from first category or default
function getCategoryName(categories: { name: string }[]): string {
  return categories.length > 0 ? categories[0].name.toUpperCase() : "ALLGEMEIN";
}

// Featured post is the first one
const featuredPost = computed(() => activePosts.value[0] || null);

// Remaining posts for the list (skip first)
const listPosts = computed(() => activePosts.value.slice(1));
const sectionBackgroundClass = useSectionBackground(() => props.background);
</script>

<template>
  <section class="relative py-32" :class="sectionBackgroundClass">
    <div class="mx-auto flex max-w-7xl flex-col px-6">
      <div class="flex flex-col gap-6">
        <SectionHeader
          :subtitle="props.subtitle || ''"
          :title="props.headline || ''"
          subtitle-uuid="news-subtitle"
          title-uuid="news-title"
        />
        <EditableContent
          v-if="props.description"
          uuid="news-description"
          :content="props.description"
          tag="p"
          content-class="mx-auto max-w-3xl text-center font-body text-lg text-gray-600"
        />
      </div>

      <ApiState
        class="mt-16"
        :is-loading="activeLoading"
        :error="activeError"
        :empty="activePosts.length === 0"
        empty-message="Derzeit sind keine Neuigkeiten verfugbar."
      >
        <div class="grid gap-8 md:grid-cols-2">
          <NewsCardFeatured
            v-if="featuredPost"
            :category="getCategoryName(featuredPost.categories)"
            :date="formatDate(featuredPost.createdAt)"
            :title="featuredPost.title.toUpperCase()"
            :to="`/beitrag/${featuredPost.slug}`"
          />

          <div v-if="listPosts.length > 0" class="space-y-6">
            <NewsCardListItem
              v-for="post in listPosts"
              :key="post.id"
              :category="getCategoryName(post.categories)"
              :date="formatDate(post.createdAt)"
              :title="post.title"
              :to="`/beitrag/${post.slug}`"
            />
          </div>
        </div>

        <div class="mt-10 flex justify-center">
          <RouterLink
            :to="postsOverviewRoute"
            class="inline-flex items-center gap-2 font-body text-sm font-bold uppercase tracking-wider text-vsg-blue-600 transition-colors hover:text-vsg-blue-800"
          >
            Weitere Beiträge ansehen
            <FontAwesomeIcon icon="arrow-right" />
          </RouterLink>
        </div>
      </ApiState>
    </div>
  </section>
</template>
