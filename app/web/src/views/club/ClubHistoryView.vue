<script setup lang="ts">
import { computed } from "vue";
import { storeToRefs } from "pinia";
import HeroSectionSmall from "@/components/sections/HeroSectionSmall.vue";
import Section from "@/components/sections/Section.vue";
import ApiState from "@/components/ui/ApiState.vue";
import ClubHistoryIntroSection from "@/components/club-history/ClubHistoryIntroSection.vue";
import ClubHistoryMilestonesSection from "@/components/club-history/ClubHistoryMilestonesSection.vue";
import ClubHistoryMembershipChartSection from "@/components/club-history/ClubHistoryMembershipChartSection.vue";
import ClubHistorySpecialEventsSection from "@/components/club-history/ClubHistorySpecialEventsSection.vue";
import ClubHistoryHallOfFameSection from "@/components/club-history/ClubHistoryHallOfFameSection.vue";
import { useClubHistoryStore } from "@/stores/clubHistoryStore";

const clubHistoryStore = useClubHistoryStore();
const { history, isLoading, error } = storeToRefs(clubHistoryStore);

void clubHistoryStore.ensureLoaded();

const sortedMilestones = computed(() =>
  [...(history.value?.milestones ?? [])].sort((a, b) => a.year - b.year),
);
const sortedMembershipStats = computed(() =>
  [...(history.value?.membershipStats ?? [])].sort((a, b) => a.year - b.year),
);
const sortedSpecialEvents = computed(() =>
  [...(history.value?.specialEvents ?? [])].sort((a, b) => a.date.localeCompare(b.date)),
);
const sortedHallOfFameEntries = computed(() =>
  [...(history.value?.hallOfFameEntries ?? [])].sort((a, b) => a.year - b.year),
);
</script>

<template>
  <div
    class="min-h-screen overflow-x-hidden text-white selection:bg-vsg-gold-500 selection:text-vsg-blue-900"
  >
    <HeroSectionSmall
      headline="Geschichte"
      description="Vier Jahrzehnte Vereinsleben: von der Gründung in Weißenfels über neue Abteilungen bis zu besonderen Erfolgen, die unsere Gemeinschaft geprägt haben."
      headline-uuid="club-history-hero-headline"
      description-uuid="club-history-hero-description"
      subtitle-uuid="club-history-hero-subtitle"
      :editable-headline="false"
      :editable-description="false"
      primary-cta-label="Mitgliederentwicklung"
      primary-cta-anchor="#mitgliederentwicklung"
      secondary-cta-label="Meilensteine"
      secondary-cta-anchor="#meilensteine"
    />

    <Section
      v-if="isLoading || error || !history"
      subtitle="Vereinsgeschichte"
      title="Wir laden die Chronik"
      subtitle-uuid="club-history-loading-subtitle"
      title-uuid="club-history-loading-title"
      description="Sobald die Daten verfügbar sind, erscheint hier die Geschichte unseres Vereins mit Zeitstrahl, Diagramm und besonderen Erfolgen."
      description-uuid="club-history-loading-description"
      background="white"
    >
      <ApiState
        class="mt-16"
        :is-loading="isLoading"
        :error="error"
        :empty="!history"
        empty-message="Zurzeit ist keine Vereinsgeschichte verfügbar."
      />
    </Section>

    <template v-else>
      <ClubHistoryIntroSection :history="history" />
      <ClubHistoryMilestonesSection :milestones="sortedMilestones" />
      <ClubHistoryMembershipChartSection :stats="sortedMembershipStats" />
      <ClubHistorySpecialEventsSection :events="sortedSpecialEvents" />
      <ClubHistoryHallOfFameSection :entries="sortedHallOfFameEntries" />
    </template>
  </div>
</template>
