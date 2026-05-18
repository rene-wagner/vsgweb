<script setup lang="ts">
import { computed, ref } from "vue";
import type { ClubHistoryMilestone } from "@vsg/types";
import Section from "@/components/sections/Section.vue";

interface Props {
  milestones: ClubHistoryMilestone[];
}

const props = defineProps<Props>();

const currentPage = ref(0);
const itemsPerPage = 4;

const sortedMilestones = computed(() => [...props.milestones].sort((a, b) => a.year - b.year));
const totalPages = computed(() =>
  Math.max(1, Math.ceil(sortedMilestones.value.length / itemsPerPage)),
);
const canGoBack = computed(() => currentPage.value > 0);
const canGoForward = computed(() => currentPage.value < totalPages.value - 1);

function goPrevious(): void {
  if (canGoBack.value) {
    currentPage.value -= 1;
  }
}

function goNext(): void {
  if (canGoForward.value) {
    currentPage.value += 1;
  }
}
</script>

<template>
  <Section
    id="meilensteine"
    subtitle="Zeitstrahl"
    title="Stationen, die den Verein geprägt haben"
    subtitle-uuid="club-history-milestones-subtitle"
    title-uuid="club-history-milestones-title"
    description="Jede Etappe steht für Wachstum, Veränderung und neue Energie im Verein. Auf großen Bildschirmen lässt sich der Zeitstrahl durchblättern, mobil erzählen alle Meilensteine die Geschichte untereinander."
    description-uuid="club-history-milestones-description"
    background="white"
  >
    <div class="mt-16 lg:hidden">
      <div class="relative ml-4 border-l-2 border-vsg-gold-300/70 pl-8">
        <article
          v-for="milestone in sortedMilestones"
          :key="milestone.id"
          class="relative pb-10 last:pb-0"
        >
          <span
            class="absolute -left-[2.55rem] top-1 flex h-6 w-6 items-center justify-center rounded-full border-4 border-white bg-vsg-gold-400 shadow-sm"
          />
          <p class="font-display text-3xl text-vsg-blue-900">{{ milestone.year }}</p>
          <h3 class="mt-2 font-display text-4xl tracking-wider text-vsg-blue-800">
            {{ milestone.title }}
          </h3>
          <p class="mt-3 font-body text-lg leading-relaxed text-vsg-blue-700">
            {{ milestone.description }}
          </p>
        </article>
      </div>
    </div>

    <div class="mt-16 hidden lg:block">
      <div class="mb-8 flex items-center justify-between gap-6">
        <div>
          <p class="font-body text-sm uppercase tracking-[0.3em] text-vsg-blue-600">Ansicht</p>
          <p class="font-body text-lg text-vsg-blue-800">
            Seite {{ currentPage + 1 }} von {{ totalPages }}
          </p>
        </div>

        <div class="flex gap-3">
          <button
            type="button"
            class="flex h-12 w-12 items-center justify-center rounded-full border border-vsg-blue-200 bg-white text-vsg-blue-900 shadow-sm transition disabled:cursor-not-allowed disabled:opacity-40 hover:border-vsg-gold-400 hover:text-vsg-gold-500"
            :disabled="!canGoBack"
            aria-label="Vorherige Meilensteine"
            @click="goPrevious"
          >
            <FontAwesomeIcon icon="arrow-left" class="text-lg" />
          </button>
          <button
            type="button"
            class="flex h-12 w-12 items-center justify-center rounded-full border border-vsg-blue-200 bg-white text-vsg-blue-900 shadow-sm transition disabled:cursor-not-allowed disabled:opacity-40 hover:border-vsg-gold-400 hover:text-vsg-gold-500"
            :disabled="!canGoForward"
            aria-label="Nächste Meilensteine"
            @click="goNext"
          >
            <FontAwesomeIcon icon="arrow-right" class="text-lg" />
          </button>
        </div>
      </div>

      <div
        class="overflow-hidden rounded-[2rem] border border-vsg-blue-100 bg-vsg-blue-50/70 p-8 shadow-sm"
      >
        <div class="relative pb-8 pt-10">
          <div
            class="absolute left-0 right-0 top-7 h-0.5 bg-linear-to-r from-vsg-blue-200 via-vsg-gold-300 to-vsg-blue-200"
          />
          <div
            class="flex transition-transform duration-500 ease-out"
            :style="{ transform: `translateX(-${currentPage * 100}%)` }"
          >
            <article
              v-for="milestone in sortedMilestones"
              :key="milestone.id"
              class="w-1/4 shrink-0 px-3"
            >
              <div class="mb-6 flex items-center gap-4">
                <span
                  class="h-4 w-4 rounded-full border-4 border-vsg-blue-50 bg-vsg-gold-400 shadow-sm"
                />
                <p class="font-display text-3xl text-vsg-blue-900">{{ milestone.year }}</p>
              </div>
              <div class="h-full rounded-3xl border border-white bg-white p-6 shadow-sm">
                <h3 class="font-display text-3xl tracking-wider text-vsg-blue-800">
                  {{ milestone.title }}
                </h3>
                <p class="mt-4 font-body text-base leading-relaxed text-vsg-blue-700">
                  {{ milestone.description }}
                </p>
              </div>
            </article>
          </div>
        </div>
      </div>
    </div>
  </Section>
</template>
