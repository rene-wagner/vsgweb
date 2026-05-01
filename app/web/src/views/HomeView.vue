<script setup lang="ts">
import { storeToRefs } from "pinia";
import ApiState from "@/components/ui/ApiState.vue";
import DepartmentCard from "@/components/cards/DepartmentCard.vue";
import { getMediaUrl } from "@/services/media-items/media-item.service";
import { useDepartmentsStore } from "@/stores/departmentsStore";
import CardSection from "@/components/sections/CardSection.vue";
import HeroSectionScreen from "@/components/sections/HeroSectionScreen.vue";
import WelcomeSection from "@/components/sections/WelcomeSection.vue";
import StatsSection from "@/components/sections/StatsSection.vue";
import NewsSection from "@/components/sections/NewsSection.vue";
import GalerieSection from "@/components/sections/GalerieSection.vue";
import CtaSection from "@/components/sections/CtaSection.vue";
import { homepageContent } from "@/content/homepage-content";

const departmentsStore = useDepartmentsStore();
const { departments, isLoading, error } = storeToRefs(departmentsStore);
</script>

<template>
  <div
    class="min-h-screen text-white overflow-x-hidden selection:bg-vsg-gold-500 selection:text-vsg-blue-900"
  >
    <HeroSectionScreen tag="Sportverein seit 1985" />

    <WelcomeSection
      v-if="homepageContent.welcomeText"
      uuid="4856f6d8-4c6a-47cf-848f-550bbaf0b0d3"
      :welcome-text="homepageContent.welcomeText"
    />

    <StatsSection :stats="homepageContent.stats" />

    <CardSection
      :title="homepageContent.departmentsHeadline"
      :description="homepageContent.departmentsDescription"
      :subtitle="homepageContent.departmentsSubtitle"
      title-uuid="60eca3af-5954-4517-b203-9f968512d5d5"
      description-uuid="86f731ce-1d12-46a8-a9b0-55e09909cc64"
      subtitle-uuid="cf092f5b-b28e-4bb8-9b36-d930caaa6770"
    >
      <ApiState
        class="mt-16 grid grid-cols-1 md:grid-cols-2 gap-4"
        :is-loading="isLoading"
        :error="error"
        :empty="departments.length === 0"
        empty-message="Derzeit sind keine Abteilungen verfugbar."
      >
        <DepartmentCard
          v-for="department in departments"
          :key="department.id"
          :title="department.name"
          :description="department.shortDescription"
          :href="`/abteilung/${department.slug}`"
          :icon-url="department.icon ? getMediaUrl(department.icon) : undefined"
          :icon-alt="department.name"
          :color="department.color"
        />
      </ApiState>
    </CardSection>

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
      headline-uuid="f0da9902-792c-43d7-9f5c-b53bec8eea6c"
      description-uuid="bd911e4e-23ae-4062-a62a-99074ddb0076"
    />
  </div>
</template>
