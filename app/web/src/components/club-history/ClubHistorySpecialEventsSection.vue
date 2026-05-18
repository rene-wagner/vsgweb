<script setup lang="ts">
import { computed } from "vue";
import type { ClubHistorySpecialEvent } from "@vsg/types";
import Section from "@/components/sections/Section.vue";

interface Props {
  events: ClubHistorySpecialEvent[];
}

const props = defineProps<Props>();

const sortedEvents = computed(() => [...props.events].sort((a, b) => a.date.localeCompare(b.date)));

function formatDate(date: string): string {
  return new Intl.DateTimeFormat("de-DE", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(new Date(date));
}
</script>

<template>
  <Section
    subtitle="Besondere Momente"
    title="Ereignisse, an die man sich erinnert"
    subtitle-uuid="5b3709ff-f5a8-4d5f-9697-246eb3c2f1f8"
    title-uuid="8f720fa4-6982-4e3a-bd19-cf6f04d7c697"
    description="Neben sportlichen Erfolgen prägen Jubiläen, Umbrüche und gemeinsame Erlebnisse das Vereinsleben. Diese Momente zeigen, wie eng Sport und Gemeinschaft zusammengehören."
    description-uuid="2cc24e8f-9f58-4236-b4af-153657bb68c7"
    background="gray"
  >
    <div class="mt-16 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
      <article
        v-for="event in sortedEvents"
        :key="event.id"
        class="group border border-vsg-blue-100 bg-white p-7 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
      >
        <div class="flex items-center gap-3 text-vsg-gold-500">
          <FontAwesomeIcon icon="calendar" class="text-lg" />
          <p class="font-body text-sm font-semibold uppercase tracking-[0.25em] text-vsg-blue-600">
            {{ formatDate(event.date) }}
          </p>
        </div>
        <h3 class="mt-5 font-display text-3xl tracking-wider text-vsg-blue-900 md:text-4xl">
          {{ event.title }}
        </h3>
        <p class="mt-4 font-body text-lg leading-relaxed text-vsg-blue-700">
          {{ event.description }}
        </p>
      </article>
    </div>
  </Section>
</template>
