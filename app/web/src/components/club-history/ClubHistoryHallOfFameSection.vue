<script setup lang="ts">
import { computed } from "vue";
import type { ClubHistoryHallOfFameEntry } from "@vsg/types";
import SectionHeader from "@/components/sections/SectionHeader.vue";

interface Props {
  entries: ClubHistoryHallOfFameEntry[];
}

const props = defineProps<Props>();

const sortedEntries = computed(() => [...props.entries].sort((a, b) => a.year - b.year));
</script>

<template>
  <section class="relative overflow-hidden bg-vsg-blue-900 py-32 text-white">
    <div
      class="absolute inset-0 bg-linear-to-br from-vsg-blue-950 via-vsg-blue-900 to-vsg-blue-800"
    />
    <div class="absolute -left-20 top-10 h-64 w-64 rounded-full bg-vsg-gold-400/10 blur-3xl" />
    <div class="absolute bottom-0 right-0 h-80 w-80 rounded-full bg-vsg-blue-300/10 blur-3xl" />

    <div class="relative mx-auto max-w-7xl px-6">
      <SectionHeader
        subtitle="Hall of Fame"
        title="Momente für die Vereinsgalerie"
        subtitle-uuid="club-history-hall-of-fame-subtitle"
        title-uuid="club-history-hall-of-fame-title"
      />

      <p
        class="mx-auto mt-6 max-w-3xl text-center font-body text-lg leading-relaxed text-vsg-blue-100"
      >
        Sportliche Spitzenleistungen, außergewöhnliches Engagement und Premieren mit Strahlkraft:
        Diese Auswahl hebt besondere Kapitel hervor, die weit über den Alltag hinausreichen.
      </p>

      <div class="mt-16 grid gap-6 lg:grid-cols-2 xl:grid-cols-3">
        <article
          v-for="(entry, index) in sortedEntries"
          :key="entry.id"
          class="relative overflow-hidden rounded-3xl border border-white/10 bg-white/8 p-8 shadow-2xl backdrop-blur-sm"
          :class="index % 3 === 1 ? 'xl:translate-y-10' : index % 3 === 2 ? 'xl:translate-y-5' : ''"
        >
          <div class="absolute right-4 top-4 text-vsg-gold-300/20">
            <FontAwesomeIcon icon="trophy" class="text-7xl" />
          </div>

          <div class="relative z-10">
            <div
              class="inline-flex items-center gap-3 rounded-full border border-vsg-gold-400/30 bg-vsg-gold-400/10 px-4 py-2"
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
  </section>
</template>
