<script setup lang="ts">
import { computed, watch } from "vue";
import { storeToRefs } from "pinia";
import { RouterLink } from "vue-router";
import Card from "@/components/cards/Card.vue";
import ApiState from "@/components/ui/ApiState.vue";
import Badge from "@/components/ui/Badge.vue";
import Section from "@/components/sections/Section.vue";
import type { SectionBackground } from "@/composables/useSectionBackground";
import { usePostsStore } from "@/stores/postsStore";

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
  return categories.length > 0 ? categories[0].name : "Allgemein";
}

// Featured post is the first one
const featuredPost = computed(() => activePosts.value[0] || null);

// Remaining posts for the list (skip first)
const listPosts = computed(() => activePosts.value.slice(1));
</script>

<template>
  <Section
    :subtitle="props.subtitle || ''"
    :title="props.headline || ''"
    subtitle-uuid="news-subtitle"
    title-uuid="news-title"
    :description="props.description"
    description-uuid="news-description"
    description-tag="p"
    :background="props.background"
  >
    <ApiState
      class="mt-16"
      :is-loading="activeLoading"
      :error="activeError"
      :empty="activePosts.length === 0"
      empty-message="Derzeit sind keine Neuigkeiten verfugbar."
    >
      <div class="grid gap-8 md:grid-cols-2">
        <Card v-if="featuredPost" :title="featuredPost.title" background="blue">
          <template #meta-start>
            <span class="font-body text-sm font-normal text-vsg-blue-200">
              {{ formatDate(featuredPost.createdAt) }}
            </span>
          </template>

          <template #meta-end>
            <Badge accent-class="border-vsg-gold-400 bg-vsg-gold-400 text-vsg-blue-900">
              {{ getCategoryName(featuredPost.categories) }}
            </Badge>
          </template>

          <template #title>
            <h4
              class="mb-4 mt-2 font-display text-3xl tracking-wider text-white transition-colors group-hover:text-vsg-gold-400"
            >
              {{ featuredPost.title }}
            </h4>
          </template>

          <template #link>
            <RouterLink
              :to="`/beitrag/${featuredPost.slug}`"
              class="inline-flex items-center gap-2 font-body text-sm font-bold uppercase tracking-wider text-vsg-gold-300 transition-colors hover:text-vsg-gold-400"
            >
              Beitrag lesen
              <FontAwesomeIcon icon="arrow-right" />
            </RouterLink>
          </template>
        </Card>

        <div v-if="listPosts.length > 0" class="space-y-6">
          <Card
            v-for="post in listPosts"
            :key="post.id"
            :title="post.title"
            :background="props.background === 'white' ? 'gray' : 'white'"
          >
            <template #meta-start>
              <span class="font-body text-sm font-normal text-vsg-blue-500">
                {{ formatDate(post.createdAt) }}
              </span>
            </template>
            <template #meta-end>
              <Badge accent-class="border-vsg-blue-500 bg-vsg-blue-500 text-white">
                {{ getCategoryName(post.categories) }}
              </Badge>
            </template>
            <template #title>
              <h5
                class="mt-1 font-display text-xl tracking-wider text-vsg-blue-900 transition-colors group-hover:text-vsg-blue-600"
              >
                {{ post.title }}
              </h5>
            </template>
            <template #link>
              <RouterLink
                :to="`/beitrag/${post.slug}`"
                class="inline-flex items-center gap-2 font-body text-sm font-bold uppercase tracking-wider text-vsg-blue-600 transition-colors hover:text-vsg-blue-800"
              >
                Beitrag lesen
                <FontAwesomeIcon icon="arrow-right" />
              </RouterLink>
            </template>
          </Card>
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
  </Section>
</template>
