<script setup lang="ts">
import { computed } from "vue";
import type { ClubHistoryHallOfFameEntry } from "@vsg/types";
import Section from "@/components/sections/Section.vue";

interface Props {
  entries: ClubHistoryHallOfFameEntry[];
}

const props = defineProps<Props>();

const sortedEntries = computed(() => [...props.entries].sort((a, b) => a.year - b.year));
</script>

<template>
  <Section
    subtitle="Hall of Fame"
    title="Momente für die Vereinsgalerie"
    subtitle-uuid="club-history-hall-of-fame-subtitle"
    title-uuid="club-history-hall-of-fame-title"
    description="Sportliche Spitzenleistungen, außergewöhnliches Engagement und Premieren mit Strahlkraft: Diese Auswahl hebt besondere Kapitel hervor, die weit über den Alltag hinausreichen."
    description-uuid="club-history-hall-of-fame-description"
    background="white"
  >
    <div class="mt-16 border border-vsg-blue-100 bg-vsg-blue-900 p-8 md:p-10">
      <div class="grid gap-6 lg:grid-cols-2 xl:grid-cols-3">
        <article
          v-for="(entry, index) in sortedEntries"
          :key="entry.id"
          class="relative border border-white/10 bg-white/5 p-8 shadow-sm"
          :class="index % 3 === 1 ? 'xl:translate-y-8' : index % 3 === 2 ? 'xl:translate-y-4' : ''"
        >
          <div class="absolute right-4 top-4 text-vsg-gold-300/20">
            <FontAwesomeIcon icon="trophy" class="text-7xl" />
          </div>

          <div class="relative z-10">
            <div
              class="inline-flex items-center gap-3 border border-vsg-gold-400/30 bg-vsg-gold-400/10 px-4 py-2"
            >
              <FontAwesomeIcon icon="medal" class="text-vsg-gold-300" />
              <span class="font-body text-sm uppercase tracking-[0.3em] text-vsg-gold-200">
                {{ entry.year }}
              </span>
            </div>

            <h3 class="mt-6 max-w-[14ch] font-display text-4xl tracking-wider text-white">
              {{ entry.title }}
            </h3>

            <p class="mt-4 font-body text-lg leading-relaxed text-vsg-blue-100">
              {{ entry.description }}
            </p>
          </div>
        </article>
      </div>
    </div>
  </Section>
</template>
