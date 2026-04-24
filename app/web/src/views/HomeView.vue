<script setup lang="ts">
import { storeToRefs } from "pinia";
import ApiState from "@/components/ui/ApiState.vue";
import Card from "@/components/cards/Card.vue";
import LinkArrow from "@/components/ui/LinkArrow.vue";
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
      uuid="homepage-welcome-text"
      :welcome-text="homepageContent.welcomeText"
    />

    <StatsSection :stats="homepageContent.stats" />

    <CardSection
      :title="homepageContent.departmentsHeadline"
      :description="homepageContent.departmentsDescription"
      :subtitle="homepageContent.departmentsSubtitle"
      title-uuid="departments-title"
      description-uuid="departments-description"
      subtitle-uuid="departments-subtitle"
    >
      <ApiState
        class="mt-16 grid grid-cols-1 md:grid-cols-2 gap-4"
        :is-loading="isLoading"
        :error="error"
        :empty="departments.length === 0"
        empty-message="Derzeit sind keine Abteilungen verfugbar."
      >
        <Card
          v-for="department in departments"
          :key="department.id"
          :title="department.name"
          :description="department.shortDescription"
        >
          <template #icon>
            <img
              v-if="department.icon"
              :src="getMediaUrl(department.icon)"
              :alt="department.name"
              class="h-16 w-16 object-contain"
              style="
                filter: invert(27%) sepia(51%) saturate(2878%) hue-rotate(200deg) brightness(89%)
                  contrast(91%);
               "
             />
            <FontAwesomeIcon v-else icon="circle" class="text-vsg-blue-600" />
          </template>
          <template #link>
            <LinkArrow :href="`/abteilung/${department.slug}`">Mehr erfahren</LinkArrow>
          </template>
        </Card>
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
    />
  </div>
</template>
