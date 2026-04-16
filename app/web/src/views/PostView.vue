<script setup lang="ts">
import { watch, onMounted, onUnmounted, watchEffect } from 'vue';
import { useRoute } from 'vue-router';
import { storeToRefs } from 'pinia';
import { usePostsStore } from '../stores/postsStore';
import ApiState from '@/components/ui/ApiState.vue';
import HeroSection from '../components/content/HeroSection.vue';
import ContentSection from '../components/content/ContentSection.vue';

const route = useRoute();
const postsStore = usePostsStore();
const { currentPost, currentPostLoading, currentPostError, currentPostNotFound } = storeToRefs(postsStore);

function fetchPost() {
  const slug = route.params.slug as string;
  if (slug) {
    postsStore.fetchPostBySlug(slug);
  }
}

// Fetch on mount
onMounted(() => {
  fetchPost();
});

// Re-fetch when slug changes without a full page reload
watch(
  () => route.params.slug,
  () => {
    fetchPost();
  },
);

// Set dynamic page title
watchEffect(() => {
  if (currentPost.value) {
    document.title = `${currentPost.value.title} | VSG Kugelberg`;
  } else if (currentPostNotFound.value) {
    document.title = 'Beitrag nicht gefunden | VSG Kugelberg';
  } else {
    document.title = 'Beitrag | VSG Kugelberg';
  }
});

// Clear state on unmount
onUnmounted(() => {
  postsStore.clearCurrentPost();
});
</script>

<template>
  <div class="min-h-screen text-white overflow-x-hidden selection:bg-vsg-gold-500 selection:text-vsg-blue-900">
    <ApiState
      :is-loading="currentPostLoading"
      :error="currentPostError"
      :empty="!currentPost"
      empty-message="Beitrag nicht gefunden"
    >
      <!-- Hero Section -->
      <HeroSection
        :headline="currentPost!.title.toUpperCase()"
        min-height="70vh"
      />

      <!-- Content Section -->
      <ContentSection v-if="currentPost!.content">
        <div
          class="prose prose-lg max-w-none font-body text-vsg-blue-700"
          v-html="currentPost!.content"
        />
      </ContentSection>
    </ApiState>
  </div>
</template>
