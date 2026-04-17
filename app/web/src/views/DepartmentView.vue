<script setup lang="ts">
import { watch, onMounted, onUnmounted, watchEffect, computed } from "vue";
import { useRoute } from "vue-router";
import { storeToRefs } from "pinia";
import { getMediaUrl } from "@/services/media-items/media-item.service";
import { useDepartmentsStore } from "../stores/departmentsStore";
import { usePostsStore } from "../stores/postsStore";
import ApiState from "@/components/ui/ApiState.vue";
import HeroSection from "../components/content/HeroSection.vue";
import StatsSection from "../components/content/StatsSection.vue";
import TrainingScheduleSection from "../components/department/TrainingScheduleSection.vue";
import LocationSection from "../components/department/LocationSection.vue";
import NewsSection from "../components/content/NewsSection.vue";
import DepartmentCtaSection from "../components/department/DepartmentCtaSection.vue";
import WelcomeSection from "../components/content/WelcomeSection.vue";
import { Cta, DepartmentLocation, Statistic, TrainingGroup } from "@vsg/types";

const route = useRoute();
const departmentsStore = useDepartmentsStore();
const {
  currentDepartment,
  currentDepartmentLoading,
  currentDepartmentError,
  currentDepartmentNotFound,
} = storeToRefs(departmentsStore);

const postsStore = usePostsStore();

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
const departmentTrainingGroups = computed<TrainingGroup[]>(() => {
  if (!currentDepartment.value?.trainingGroups) return [];
  return currentDepartment.value.trainingGroups.map((group) => ({
    name: group.name,
    ageRange: group.ageRange || "",
    icon: group.icon as "youth" | "adults",
    variant: group.variant as "primary" | "secondary",
    sessions: group.sessions.map((session) => ({
      day: session.day,
      time: session.time,
      group: "Allgemein",
      level: "all" as const,
      locationName: session.location?.name,
    })),
  }));
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
    title: `LUST AUF<br/>${departmentName.toUpperCase()}?`,
    description:
      "Komm einfach zum Probetraining vorbei! Wir freuen uns auf dich - egal ob Anfänger oder erfahrener Sportfreund.",
    primaryCtaLabel: "Probetraining anfragen",
    primaryCtaRoute: "/kontakt",
    secondaryCtaLabel: "E-Mail schreiben",
    secondaryCtaRoute: `mailto:${departmentName.toLowerCase().replace(/\s+/g, "-")}@vsg-kugelberg.de`,
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
      <!-- Hero Section -->
      <HeroSection
        :headline="currentDepartment!.name.toUpperCase()"
        :description="currentDepartment!.shortDescription"
        :icon-url="currentDepartment!.icon ? getMediaUrl(currentDepartment!.icon) : undefined"
        :primary-cta-label="departmentTrainingGroups.length > 0 ? 'Trainingszeiten' : undefined"
        :primary-cta-anchor="departmentTrainingGroups.length > 0 ? '#trainingszeiten' : undefined"
        :secondary-cta-label="departmentLocations.length > 0 ? 'Unsere Standorte' : undefined"
        :secondary-cta-anchor="departmentLocations.length > 0 ? '#standorte' : undefined"
        min-height="70vh"
      />

      <!-- Stats Section -->
      <WelcomeSection
        v-if="currentDepartment!.welcomeText"
        :welcome-text="currentDepartment!.welcomeText"
      />

      <!-- Stats Section -->
      <StatsSection v-if="departmentStats.length > 0" :stats="departmentStats" />

      <!-- Training Schedule Section -->
      <TrainingScheduleSection
        v-if="departmentTrainingGroups.length > 0"
        id="trainingszeiten"
        title="TRAININGSZEITEN"
        subtitle="Wann wir trainieren"
        description="Regelmäßiges Training für alle Altersgruppen. Anfänger und Fortgeschrittene sind herzlich willkommen!"
        :groups="departmentTrainingGroups"
      />

      <!-- Locations Section -->
      <LocationSection
        v-if="departmentLocations.length > 0"
        id="standorte"
        title="UNSERE STANDORTE"
        subtitle="Wo wir spielen"
        description="Moderne Hallen mit professioneller Ausstattung für optimale Trainingsbedingungen."
        :locations="departmentLocations"
      />

      <!-- News Section -->
      <NewsSection
        headline="AKTUELLE NEUIGKEITEN"
        subtitle="Was bei uns los ist"
        :category-slug="currentDepartment!.slug"
      />

      <!-- CTA Section -->
      <DepartmentCtaSection
        :title="departmentCta.title"
        :description="departmentCta.description"
        :primary-cta-label="departmentCta.primaryCtaLabel"
        :primary-cta-route="departmentCta.primaryCtaRoute"
        :secondary-cta-label="departmentCta.secondaryCtaLabel"
        :secondary-cta-route="departmentCta.secondaryCtaRoute"
      />
    </ApiState>
  </div>
</template>
