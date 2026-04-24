<script setup lang="ts">
import { watch, onMounted, onUnmounted, watchEffect, computed } from "vue";
import { useRoute } from "vue-router";
import { storeToRefs } from "pinia";
import { getMediaUrl } from "@/services/media-items/media-item.service";
import { useCategoriesStore } from "@/stores/categoriesStore";
import { useDepartmentsStore } from "../stores/departmentsStore";
import { usePostsStore } from "../stores/postsStore";
import ApiState from "@/components/ui/ApiState.vue";
import HeroSectionSmall from "../components/content/HeroSectionSmall.vue";
import StatsSection from "../components/content/StatsSection.vue";
import TrainingScheduleSection from "../components/department/TrainingScheduleSection.vue";
import LocationSection from "../components/department/LocationSection.vue";
import NewsSection from "../components/content/NewsSection.vue";
import GalerieSection from "../components/content/GalerieSection.vue";
import CtaSection from "../components/content/CtaSection.vue";
import WelcomeSection from "../components/content/WelcomeSection.vue";
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
    description:
      "Komm einfach zum Probetraining vorbei! Wir freuen uns auf dich - egal ob Anfänger oder erfahrener Sportfreund.",
    primaryCtaLabel: "Probetraining anfragen",
    primaryCtaRoute: "/kontakt",
    secondaryCtaLabel: "Mitglied werden",
    secondaryCtaRoute: "/verein/mitgliedschaft",
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
        :headline="currentDepartment!.name.toUpperCase()"
        :description="currentDepartment!.shortDescription"
        :icon-url="currentDepartment!.icon ? getMediaUrl(currentDepartment!.icon) : undefined"
        :primary-cta-label="departmentTrainingGroups.length > 0 ? 'Trainingszeiten' : undefined"
        :primary-cta-anchor="departmentTrainingGroups.length > 0 ? '#trainingszeiten' : undefined"
        :secondary-cta-label="departmentLocations.length > 0 ? 'Unsere Standorte' : undefined"
        :secondary-cta-anchor="departmentLocations.length > 0 ? '#standorte' : undefined"
      />

      <WelcomeSection
        v-if="currentDepartment!.welcomeText"
        uuid="department-welcome-text"
        :welcome-text="currentDepartment!.welcomeText"
      />

      <StatsSection v-if="departmentStats.length > 0" :stats="departmentStats" />

      <TrainingScheduleSection
        v-if="departmentTrainingGroups.length > 0"
        id="trainingszeiten"
        title="TRAININGSZEITEN"
        subtitle="Wann wir trainieren"
        description="Regelmäßiges Training für alle Altersgruppen. Anfänger und Fortgeschrittene sind herzlich willkommen!"
        :groups="departmentTrainingGroups"
      />

      <LocationSection
        v-if="departmentLocations.length > 0"
        id="standorte"
        title="UNSERE STANDORTE"
        subtitle="Wo wir spielen"
        description="Moderne Hallen mit professioneller Ausstattung für optimale Trainingsbedingungen."
        background="gray"
        :locations="departmentLocations"
      />

      <NewsSection
        headline="AKTUELLE NEUIGKEITEN"
        subtitle="Was bei uns los ist"
        :category-iri="departmentCategoryIri"
        :category-slug="currentDepartment?.slug ?? null"
      />

      <GalerieSection
        headline="GALERIE"
        subtitle="Bilder aus der Abteilung"
        description="Aktuelle Einblicke aus Training, Spielbetrieb und Vereinsleben dieser Abteilung."
        background="gray"
        :items-count="20"
        :category-id="departmentCategoryId"
      />

      <CtaSection
        :headline="departmentCta.title"
        :description="departmentCta.description"
        headline-uuid="department-cta-headline"
        description-uuid="department-cta-description"
        :primary-button-text="departmentCta.primaryCtaLabel"
        :primary-button-link="departmentCta.primaryCtaRoute"
        :secondary-button-text="departmentCta.secondaryCtaLabel"
        :secondary-button-link="departmentCta.secondaryCtaRoute"
      />
    </ApiState>
  </div>
</template>
