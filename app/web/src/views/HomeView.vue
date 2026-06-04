<script setup lang="ts">
import { computed } from "vue";
import { storeToRefs } from "pinia";
import type { DepartmentColor, Statistic } from "@vsg/types";
import ApiState from "@/components/ui/ApiState.vue";
import { getMediaUrl } from "@/services/media-items/media-item.service";
import { useDepartmentsStore } from "@/stores/departmentsStore";
import { useClubHistoryStore } from "@/stores/clubHistoryStore";
import CardSection from "@/components/sections/CardSection.vue";
import HeroSectionScreen from "@/components/sections/HeroSectionScreen.vue";
import WelcomeSection from "@/components/sections/WelcomeSection.vue";
import StatsSection from "@/components/sections/StatsSection.vue";
import NewsSection from "@/components/sections/NewsSection.vue";
import GalerieSection from "@/components/sections/GalerieSection.vue";
import CtaSection from "@/components/sections/CtaSection.vue";
import Card from "@/components/cards/Card.vue";
import { config } from "@/config";

const departmentsStore = useDepartmentsStore();
const clubHistoryStore = useClubHistoryStore();
const { departments, isLoading, error } = storeToRefs(departmentsStore);
const { history } = storeToRefs(clubHistoryStore);

void clubHistoryStore.ensureLoaded();

const homepageStats = computed<Statistic[]>(() => {
  return (history.value?.clubStatistics ?? []).map((stat) => ({
    label: stat.label,
    value: stat.value,
  }));
});

function getDepartmentIconBackgroundClass(color: DepartmentColor) {
  switch (color) {
    case "purple":
      return "bg-vsg-badminton-secondary";
    case "green":
      return "bg-vsg-gymnastik-secondary";
    case "red":
      return "bg-vsg-tischtennis-secondary";
    case "blue":
    default:
      return "bg-vsg-volleyball-secondary";
  }
}

function getDepartmentIconBorderClass(color: DepartmentColor) {
  switch (color) {
    case "purple":
      return "border-vsg-badminton-primary";
    case "green":
      return "border-vsg-gymnastik-primary";
    case "red":
      return "border-vsg-tischtennis-primary";
    case "blue":
    default:
      return "border-vsg-volleyball-primary";
  }
}
</script>

<template>
  <div
    class="min-h-screen text-white overflow-x-hidden selection:bg-vsg-gold-500 selection:text-vsg-blue-900"
  >
    <HeroSectionScreen tag="" />

    <WelcomeSection uuid="4856f6d8-4c6a-47cf-848f-550bbaf0b0d3" welcome-text="" />

    <StatsSection :stats="homepageStats" />

    <CardSection
      title=""
      description=""
      subtitle=""
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
        <Card
          v-for="department in departments"
          :key="department.id"
          :title="department.name"
          :description="department.shortDescription"
          :to="`/abteilung/${department.slug}`"
        >
          <template #icon>
            <div
              class="flex h-20 w-20 items-center justify-center rounded-full border-2 p-4 text-vsg-blue-600 transition-transform"
              :class="[
                getDepartmentIconBackgroundClass(department.color),
                getDepartmentIconBorderClass(department.color),
              ]"
            >
              <img
                v-if="department.icon"
                :src="getMediaUrl(department.icon)"
                :alt="department.name"
                class="h-full w-full object-contain"
              />
              <FontAwesomeIcon v-else icon="circle" class="text-2xl" />
            </div>
          </template>
          <template #link>
            <span
              class="inline-flex items-center gap-2 font-body text-sm font-bold uppercase tracking-wider text-vsg-blue-600 transition-colors group-hover:text-vsg-blue-800"
            >
              Mehr erfahren
              <FontAwesomeIcon icon="arrow-right" />
            </span>
          </template>
        </Card>
      </ApiState>
    </CardSection>

    <NewsSection
      headline=""
      description=""
      subtitle=""
      :posts-count="config.homepage.postsCount"
      background="gray"
    />

    <GalerieSection
      headline=""
      description=""
      subtitle=""
      :items-count="config.homepage.galleryCount"
    />

    <CtaSection
      headline=""
      description=""
      headline-uuid="f0da9902-792c-43d7-9f5c-b53bec8eea6c"
      description-uuid="bd911e4e-23ae-4062-a62a-99074ddb0076"
    />
  </div>
</template>
