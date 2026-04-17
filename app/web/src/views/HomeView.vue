<script setup lang="ts">
import { onMounted } from "vue";
import { storeToRefs } from "pinia";
import HeroSection from "@/components/content/HeroSection.vue";
import WelcomeSection from "@/components/content/WelcomeSection.vue";
import StatsSection from "@/components/content/StatsSection.vue";
import DepartmentsSection from "@/components/department/DepartmentsSection.vue";
import NewsSection from "@/components/content/NewsSection.vue";
import CtaSection from "@/components/content/CtaSection.vue";
import { useHomepageStore } from "@/stores/homepageStore";

const homepageStore = useHomepageStore();
const { homepageContent } = storeToRefs(homepageStore);

onMounted(() => {
  homepageStore.ensureLoaded();
});
</script>

<template>
  <div
    class="min-h-screen text-white overflow-x-hidden selection:bg-vsg-gold-500 selection:text-vsg-blue-900"
  >
    <HeroSection
      tag="Sportverein seit 1985"
      logo="/public/logo.png"
      min-height="screen"
      :show-scroll-indicator="true"
    />

    <WelcomeSection
      v-if="homepageContent?.welcomeText"
      :welcome-text="homepageContent.welcomeText"
    />

    <StatsSection :stats="homepageContent?.stats" />

    <DepartmentsSection
      :headline="homepageContent?.departmentsHeadline"
      :description="homepageContent?.departmentsDescription"
      :subtitle="homepageContent?.departmentsSubtitle"
    />

    <NewsSection
      :headline="homepageContent?.postsHeadline"
      :description="homepageContent?.postsDescription"
      :subtitle="homepageContent?.postsSubtitle"
      :posts-count="homepageContent?.postsCount ?? 5"
    />

    <CtaSection
      :headline="homepageContent?.ctaHeadline"
      :description="homepageContent?.ctaDescription"
    />
  </div>
</template>
