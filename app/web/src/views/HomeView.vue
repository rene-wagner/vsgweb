<script setup lang="ts">
import HeroSectionScreen from "@/components/content/HeroSectionScreen.vue";
import WelcomeSection from "@/components/content/WelcomeSection.vue";
import StatsSection from "@/components/content/StatsSection.vue";
import DepartmentsSection from "@/components/department/DepartmentsSection.vue";
import NewsSection from "@/components/content/NewsSection.vue";
import GalerieSection from "@/components/content/GalerieSection.vue";
import CtaSection from "@/components/content/CtaSection.vue";
import { homepageContent } from "@/content/homepage-content";
</script>

<template>
  <div
    class="min-h-screen text-white overflow-x-hidden selection:bg-vsg-gold-500 selection:text-vsg-blue-900"
  >
    <HeroSectionScreen tag="Sportverein seit 1985" />

    <WelcomeSection
      v-if="homepageContent.welcomeText"
      uuid="homepage-welcome-text"
      :welcome-text="homepageContent.welcomeText"
    />

    <StatsSection :stats="homepageContent.stats" />

    <DepartmentsSection
      :headline="homepageContent.departmentsHeadline"
      :description="homepageContent.departmentsDescription"
      :subtitle="homepageContent.departmentsSubtitle"
    />

    <NewsSection
      :headline="homepageContent.postsHeadline"
      :description="homepageContent.postsDescription"
      :subtitle="homepageContent.postsSubtitle"
      :posts-count="homepageContent.postsCount"
      background="gray"
    />

    <GalerieSection
      :headline="homepageContent.galleryHeadline"
      :description="homepageContent.galleryDescription"
      :subtitle="homepageContent.gallerySubtitle"
      :items-count="homepageContent.galleryCount"
    />

    <CtaSection
      :headline="homepageContent.ctaHeadline"
      :description="homepageContent.ctaDescription"
    />
  </div>
</template>
