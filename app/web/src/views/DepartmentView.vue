<script setup lang="ts">
import { watch, onMounted, onUnmounted, watchEffect, computed } from "vue";
import { useRoute } from "vue-router";
import { storeToRefs } from "pinia";
import { getMediaUrl } from "@/services/media-items/media-item.service";
import { useCategoriesStore } from "@/stores/categoriesStore";
import { useDepartmentsStore } from "../stores/departmentsStore";
import { usePostsStore } from "../stores/postsStore";
import ApiState from "@/components/ui/ApiState.vue";
import { departmentViewContent } from "@/content/department-view-content";
import HeroSectionSmall from "@/components/sections/HeroSectionSmall.vue";
import StatsSection from "@/components/sections/StatsSection.vue";
import TrainingScheduleSection from "@/components/sections/TrainingScheduleSection.vue";
import LocationSection from "@/components/sections/LocationSection.vue";
import NewsSection from "@/components/sections/NewsSection.vue";
import GalerieSection from "@/components/sections/GalerieSection.vue";
import CtaSection from "@/components/sections/CtaSection.vue";
import WelcomeSection from "@/components/sections/WelcomeSection.vue";
import { Cta, DepartmentLocation, DepartmentTrainingGroup, Statistic } from "@vsg/types";
import { useMediaItemsStore } from "@/stores/mediaItemsStore";

const route = useRoute();
const categoriesStore = useCategoriesStore();
const departmentsStore = useDepartmentsStore();
const { categories } = storeToRefs(categoriesStore);
const {
  currentDepartment,
  currentDepartmentLoading,
  currentDepartmentError,
  currentDepartmentNotFound,
} = storeToRefs(departmentsStore);

const postsStore = usePostsStore();
const mediaItemsStore = useMediaItemsStore();

const departmentCategoryIri = computed(() => {
  const slug = currentDepartment.value?.slug;

  if (!slug) {
    return undefined;
  }

  return categories.value.find((category) => category.slug === slug)?.["@id"] ?? null;
});

const departmentCategoryId = computed(() => {
  const slug = currentDepartment.value?.slug;

  if (!slug) {
    return undefined;
  }

  return categories.value.find((category) => category.slug === slug)?.id ?? null;
});

function fetchDepartment() {
  const slug = route.params.slug as string;
  if (slug) {
    departmentsStore.fetchDepartmentBySlug(slug);
  }
}

// Fetch on mount
onMounted(() => {
  fetchDepartment();
});

// Watch for route param changes
watch(
  () => route.params.slug,
  () => {
    fetchDepartment();
  },
);

// Set dynamic page title
watchEffect(() => {
  if (currentDepartment.value) {
    document.title = `${currentDepartment.value.name} | VSG Kugelberg`;
  } else if (currentDepartmentNotFound.value) {
    document.title = "Abteilung nicht gefunden | VSG Kugelberg";
  } else {
    document.title = "Abteilung | VSG Kugelberg";
  }
});

// Clear state on unmount
onUnmounted(() => {
  departmentsStore.clearCurrentDepartment();
  postsStore.clearDepartmentPosts();
  mediaItemsStore.clearDepartmentMediaItems();
});

// Transform API stats to component format
const departmentStats = computed<Statistic[]>(() => {
  if (!currentDepartment.value?.stats) return [];
  return currentDepartment.value.stats.map((stat) => ({
    value: stat.value,
    label: stat.label,
  }));
});

// Transform API training groups to component format
const departmentTrainingGroups = computed<DepartmentTrainingGroup[]>(() => {
  return currentDepartment.value?.trainingGroups ?? [];
});

// Transform API locations to component format
const departmentLocations = computed<DepartmentLocation[]>(() => {
  if (!currentDepartment.value?.locations) return [];
  return currentDepartment.value.locations.map((location) => ({
    id: location.id,
    name: location.name,
    street: location.street,
    city: location.city,
    mapsUrl: location.mapsUrl || "",
    picture: location.picture ?? null,
  }));
});

// Generate CTA based on department name
const departmentCta = computed<Cta>(() => {
  const departmentName = currentDepartment.value?.name || "";
  return {
    title: `Lust auf ${departmentName}?`,
    description: departmentViewContent.ctaDescription,
    primaryCtaLabel: departmentViewContent.ctaPrimaryButtonText,
    primaryCtaRoute: departmentViewContent.ctaPrimaryButtonLink,
    secondaryCtaLabel: departmentViewContent.ctaSecondaryButtonText,
    secondaryCtaRoute: departmentViewContent.ctaSecondaryButtonLink,
  };
});
</script>

<template>
  <div
    class="min-h-screen text-white overflow-x-hidden selection:bg-vsg-gold-500 selection:text-vsg-blue-900"
  >
    <ApiState
      :is-loading="currentDepartmentLoading"
      :error="currentDepartmentError"
      :empty="!currentDepartment"
      empty-message="Abteilung nicht gefunden"
    >
      <HeroSectionSmall
        :headline="currentDepartment!.name"
        :description="currentDepartment!.shortDescription"
        :icon-url="currentDepartment!.icon ? getMediaUrl(currentDepartment!.icon) : undefined"
        headline-uuid="1647fd06-761f-4038-8539-9bc98790faf3"
        description-uuid="062f3a4b-d164-45f6-8577-01b4484a2a8c"
        subtitle-uuid="3c1aeba6-99b8-4729-93b0-4623ecb770c8"
        :editable-headline="false"
        :editable-description="false"
        :primary-cta-label="departmentTrainingGroups.length > 0 ? 'Trainingszeiten' : undefined"
        :primary-cta-anchor="departmentTrainingGroups.length > 0 ? '#trainingszeiten' : undefined"
        :secondary-cta-label="departmentLocations.length > 0 ? 'Unsere Standorte' : undefined"
        :secondary-cta-anchor="departmentLocations.length > 0 ? '#standorte' : undefined"
      />

      <WelcomeSection
        v-if="currentDepartment!.welcomeText"
        uuid="07fc79ce-148f-4c7b-9763-583873591ef1"
        :welcome-text="currentDepartment!.welcomeText"
      />

      <StatsSection v-if="departmentStats.length > 0" :stats="departmentStats" />

      <TrainingScheduleSection
        v-if="departmentTrainingGroups.length > 0"
        id="trainingszeiten"
        :title="departmentViewContent.trainingScheduleTitle"
        :subtitle="departmentViewContent.trainingScheduleSubtitle"
        :description="departmentViewContent.trainingScheduleDescription"
        :groups="departmentTrainingGroups"
      />

      <LocationSection
        v-if="departmentLocations.length > 0"
        id="standorte"
        :title="departmentViewContent.locationsTitle"
        :subtitle="departmentViewContent.locationsSubtitle"
        :description="departmentViewContent.locationsDescription"
        background="gray"
        :locations="departmentLocations"
      />

      <NewsSection
        :headline="departmentViewContent.newsHeadline"
        :subtitle="departmentViewContent.newsSubtitle"
        :category-iri="departmentCategoryIri"
        :category-slug="currentDepartment?.slug ?? null"
      />

      <GalerieSection
        :headline="departmentViewContent.galleryHeadline"
        :subtitle="departmentViewContent.gallerySubtitle"
        :description="departmentViewContent.galleryDescription"
        background="gray"
        :items-count="20"
        :category-id="departmentCategoryId"
      />

      <CtaSection
        :headline="departmentCta.title"
        :description="departmentCta.description"
        headline-uuid="97796941-76b9-4311-848f-3be2438b8a04"
        description-uuid="d3486e32-9298-46ef-b03f-a844e3869564"
        :primary-button-text="departmentCta.primaryCtaLabel"
        :primary-button-link="departmentCta.primaryCtaRoute"
        :secondary-button-text="departmentCta.secondaryCtaLabel"
        :secondary-button-link="departmentCta.secondaryCtaRoute"
      />
    </ApiState>
  </div>
</template>
