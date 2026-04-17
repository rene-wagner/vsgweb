<script setup lang="ts">
import { computed, onMounted } from "vue";
import { storeToRefs } from "pinia";
import SectionHeader from "@/components/ui/SectionHeader.vue";
import ApiState from "@/components/ui/ApiState.vue";
import NewsCardFeatured from "./NewsCardFeatured.vue";
import NewsCardListItem from "./NewsCardListItem.vue";
import { usePostsStore } from "../../stores/postsStore";

interface Props {
  headline?: string;
  description?: string;
  subtitle?: string;
  postsCount?: number;
  categorySlug?: string;
}

const props = withDefaults(defineProps<Props>(), {
  postsCount: 5,
});

const postsStore = usePostsStore();
const { posts, isLoading, error, departmentPosts, isDepartmentPostsLoading, departmentPostsError } =
  storeToRefs(postsStore);

// Use separate state when filtering by category
const activePosts = computed(() => (props.categorySlug ? departmentPosts.value : posts.value));
const activeLoading = computed(() =>
  props.categorySlug ? isDepartmentPostsLoading.value : isLoading.value,
);
const activeError = computed(() => (props.categorySlug ? departmentPostsError.value : error.value));

onMounted(() => {
  if (props.categorySlug) {
    void postsStore
      .fetchPublishedPostsByCategory(props.categorySlug, props.postsCount)
      .catch(() => undefined);
    return;
  }

  if (posts.value.length >= props.postsCount && !error.value) {
    return;
  }

  void postsStore.fetchPublishedPosts(props.postsCount).catch(() => undefined);
});

// Format date to German locale
function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString("de-DE", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

// Get excerpt from content (first 150 chars)
function getExcerpt(content: string | null): string {
  if (!content) return "";
  const plainText = content.replace(/<[^>]*>/g, "");
  return plainText.length > 150 ? plainText.substring(0, 150) + "..." : plainText;
}

// Get category name from first category or default
function getCategoryName(categories: { name: string }[]): string {
  return categories.length > 0 ? categories[0].name.toUpperCase() : "ALLGEMEIN";
}

// Featured post is the first one
const featuredPost = computed(() => activePosts.value[0] || null);

// Remaining posts for the list (skip first)
const listPosts = computed(() => activePosts.value.slice(1));
</script>

<template>
  <section class="relative bg-gray-50 py-32">
    <div class="mx-auto max-w-7xl px-6">
      <SectionHeader :subtitle="props.subtitle || ''" :title="props.headline || ''" class="mb-6" />
      <p
        v-if="props.description"
        class="mx-auto mt-6 mb-16 max-w-3xl text-center font-body text-lg text-gray-600"
      >
        {{ props.description }}
      </p>

      <ApiState
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
            :excerpt="getExcerpt(featuredPost.content)"
            :href="`/beitrag/${featuredPost.slug}`"
          />

          <div v-if="listPosts.length > 0" class="space-y-6">
            <NewsCardListItem
              v-for="post in listPosts"
              :key="post.id"
              :date="formatDate(post.createdAt)"
              :title="post.title"
              :href="`/beitrag/${post.slug}`"
            />
          </div>
        </div>
      </ApiState>
    </div>
  </section>
</template>
