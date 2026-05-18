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
    subtitle-uuid="6dbdc07d-3f18-4be0-b7e0-48c6a65e7f53"
    title-uuid="a7217d6b-2e86-4a0f-b0c9-5200b1157b66"
    description="Sportliche Spitzenleistungen, außergewöhnliches Engagement und Premieren mit Strahlkraft: Diese Auswahl hebt besondere Kapitel hervor, die weit über den Alltag hinausreichen."
    description-uuid="d5f96e42-5e0d-4e0d-b274-66c1d43d6de4"
    background="white"
  >
    <div class="mt-16 grid gap-6 lg:grid-cols-2 xl:grid-cols-3">
      <article
        v-for="entry in sortedEntries"
        :key="entry.id"
        class="relative h-full rounded-md border border-vsg-blue-100 bg-vsg-blue-600 p-8 shadow-sm"
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

          <h3 class="mt-6 max-w-[14ch] font-display text-3xl tracking-wider text-white md:text-4xl">
            {{ entry.title }}
          </h3>

          <p class="mt-4 font-body text-lg leading-relaxed text-vsg-blue-100">
            {{ entry.description }}
          </p>
        </div>
      </article>
    </div>
  </Section>
</template>
