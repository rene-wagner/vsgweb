<script setup lang="ts">
import {
  watch,
  onMounted,
  onUnmounted,
  watchEffect,
  computed,
  nextTick,
  onUpdated,
  ref,
} from "vue";
import { useRoute, useRouter } from "vue-router";
import { storeToRefs } from "pinia";
import { useCategoriesStore } from "@/stores/categoriesStore";
import { useDepartmentsStore } from "../stores/departmentsStore";
import { usePostsStore } from "../stores/postsStore";
import ApiState from "@/components/ui/ApiState.vue";
import { departmentViewContent } from "@/content/department-view-content";
import HeroSectionSmall from "@/components/sections/HeroSectionSmall.vue";
import StatsSection from "@/components/sections/StatsSection.vue";
import ListSection from "@/components/sections/ListSection.vue";
import TrainingScheduleSection from "@/components/sections/TrainingScheduleSection.vue";
import LocationSection from "@/components/sections/LocationSection.vue";
import NewsSection from "@/components/sections/NewsSection.vue";
import GalerieSection from "@/components/sections/GalerieSection.vue";
import CtaSection from "@/components/sections/CtaSection.vue";
import WelcomeSection from "@/components/sections/WelcomeSection.vue";
import type { SectionBackground } from "@/composables/useSectionBackground";
import {
  Cta,
  DepartmentLocation,
  DepartmentResult,
  DepartmentTrainingGroup,
  Statistic,
} from "@vsg/types";
import { useMediaItemsStore } from "@/stores/mediaItemsStore";

const SCROLL_OFFSET = 120;

const route = useRoute();
const router = useRouter();
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
const lastScrolledHashKey = ref<string | null>(null);

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

async function scrollToRouteHash() {
  if (!route.hash) {
    return false;
  }

  await nextTick();

  const target = document.querySelector(route.hash);

  if (!(target instanceof HTMLElement)) {
    return false;
  }

  const top = target.getBoundingClientRect().top + window.scrollY - SCROLL_OFFSET;

  window.scrollTo({
    top,
    behavior: "smooth",
  });

  lastScrolledHashKey.value = `${String(route.params.slug)}:${route.hash}`;

  return true;
}

async function ensureRouteHashScroll() {
  if (!route.hash || currentDepartmentLoading.value || !currentDepartment.value?.id) {
    return;
  }

  const currentHashKey = `${String(route.params.slug)}:${route.hash}`;

  if (lastScrolledHashKey.value === currentHashKey) {
    return;
  }

  await scrollToRouteHash();
}

// Fetch on mount
onMounted(() => {
  fetchDepartment();

  void router.isReady().then(() => ensureRouteHashScroll());
});

// Watch for route param changes
watch(
  () => route.params.slug,
  () => {
    lastScrolledHashKey.value = null;
    fetchDepartment();
  },
);

watch(
  () => route.hash,
  () => {
    lastScrolledHashKey.value = null;
  },
);

watch(
  [() => route.hash, currentDepartmentLoading, () => currentDepartment.value?.id],
  () => {
    void ensureRouteHashScroll();
  },
  { flush: "post" },
);

onUpdated(() => {
  void ensureRouteHashScroll();
});

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

const departmentResults = computed<DepartmentResult[]>(() => {
  return currentDepartment.value?.departmentResults ?? [];
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
    secondaryCtaRoute: `${departmentViewContent.ctaSecondaryButtonLink}?abteilung=${currentDepartment.value?.slug ?? ""}`,
  };
});

const sectionBackgrounds = computed<{
  training: SectionBackground;
  locations: SectionBackground;
  news: SectionBackground;
  results: SectionBackground;
  gallery: SectionBackground;
}>(() => {
  let previousBackground: SectionBackground | null = null;

  if (currentDepartment.value?.welcomeText) {
    previousBackground = "white";
  }

  if (departmentStats.value.length > 0) {
    previousBackground = "gray";
  }

  const getNextBackground = (): SectionBackground => {
    const nextBackground = previousBackground === "white" ? "gray" : "white";
    previousBackground = nextBackground;
    return nextBackground;
  };

  const backgrounds = {
    training: "white" as SectionBackground,
    locations: "white" as SectionBackground,
    news: "white" as SectionBackground,
    results: "white" as SectionBackground,
    gallery: "white" as SectionBackground,
  };

  if (departmentTrainingGroups.value.length > 0) {
    backgrounds.training = getNextBackground();
  }

  if (departmentLocations.value.length > 0) {
    backgrounds.locations = getNextBackground();
  }

  backgrounds.news = getNextBackground();

  if (departmentResults.value.length > 0) {
    backgrounds.results = getNextBackground();
  }

  backgrounds.gallery = getNextBackground();

  return backgrounds;
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

      <div v-if="currentDepartment!.welcomeText" id="willkommen" class="scroll-mt-32">
        <WelcomeSection
          uuid="07fc79ce-148f-4c7b-9763-583873591ef1"
          :welcome-text="currentDepartment!.welcomeText"
        />
      </div>

      <div v-if="departmentStats.length > 0" id="zahlen-fakten" class="scroll-mt-32">
        <StatsSection :stats="departmentStats" />
      </div>

      <div v-if="departmentTrainingGroups.length > 0" id="trainingszeiten" class="scroll-mt-32">
        <TrainingScheduleSection
          :title="departmentViewContent.trainingScheduleTitle"
          :subtitle="departmentViewContent.trainingScheduleSubtitle"
          :description="departmentViewContent.trainingScheduleDescription"
          :groups="departmentTrainingGroups"
          :background="sectionBackgrounds.training"
        />
      </div>

      <div v-if="departmentLocations.length > 0" id="standorte" class="scroll-mt-32">
        <LocationSection
          :title="departmentViewContent.locationsTitle"
          :subtitle="departmentViewContent.locationsSubtitle"
          :description="departmentViewContent.locationsDescription"
          :background="sectionBackgrounds.locations"
          :locations="departmentLocations"
        />
      </div>

      <div id="neuigkeiten" class="scroll-mt-32">
        <NewsSection
          :headline="departmentViewContent.newsHeadline"
          :subtitle="departmentViewContent.newsSubtitle"
          :category-iri="departmentCategoryIri"
          :category-slug="currentDepartment?.slug ?? null"
          :background="sectionBackgrounds.news"
        />
      </div>

      <div v-if="departmentResults.length > 0" id="ergebnisse" class="scroll-mt-32">
        <ListSection
          :title="departmentViewContent.resultsTitle"
          :subtitle="departmentViewContent.resultsSubtitle"
          :description="departmentViewContent.resultsDescription"
          subtitle-uuid="30176e5c-9d3a-45f9-bec2-231ba2ec4f05"
          title-uuid="d6ea12ba-610f-480f-ba72-2850081bdf55"
          description-uuid="c5a28826-1c8a-4319-b259-4e90d6a208ef"
          :items="departmentResults"
          :background="sectionBackgrounds.results"
        />
      </div>

      <div id="galerie" class="scroll-mt-32">
        <GalerieSection
          :headline="departmentViewContent.galleryHeadline"
          :subtitle="departmentViewContent.gallerySubtitle"
          :description="departmentViewContent.galleryDescription"
          :background="sectionBackgrounds.gallery"
          :items-count="20"
          :category-id="departmentCategoryId"
        />
      </div>

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
