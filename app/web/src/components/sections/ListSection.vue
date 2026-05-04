<script setup lang="ts">
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import type { DepartmentResult } from "@vsg/types";
import Section from "@/components/sections/Section.vue";
import type { SectionBackground } from "@/composables/useSectionBackground";

interface Props {
  id?: string;
  title: string;
  subtitle: string;
  description?: string;
  subtitleUuid: string;
  titleUuid: string;
  descriptionUuid: string;
  items: DepartmentResult[];
  background?: SectionBackground;
}

const props = withDefaults(defineProps<Props>(), {
  id: undefined,
  description: undefined,
  background: "white",
});

const columnLabels = {
  title: "Mannschaft",
  league: "Liga",
  url: "Link",
};
</script>

<template>
  <Section
    :id="props.id"
    :subtitle="props.subtitle"
    :title="props.title"
    :subtitle-uuid="props.subtitleUuid"
    :title-uuid="props.titleUuid"
    :description="props.description"
    :description-uuid="props.descriptionUuid"
    description-tag="p"
    :background="props.background"
  >
    <div class="mt-16 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
      <div
        class="hidden grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)_auto] gap-6 border-b border-gray-200 bg-gray-50 px-6 py-4 lg:grid"
      >
        <span class="font-body text-sm font-bold uppercase tracking-widest text-vsg-blue-800">
          {{ columnLabels.title }}
        </span>
        <span class="font-body text-sm font-bold uppercase tracking-widest text-vsg-blue-800">
          {{ columnLabels.league }}
        </span>
        <span class="font-body text-sm font-bold uppercase tracking-widest text-vsg-blue-800">
          {{ columnLabels.url }}
        </span>
      </div>

      <div v-for="item in props.items" :key="item.id" class="border-b border-gray-200 last:border-b-0">
        <div class="grid gap-4 px-6 py-5 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)_auto] lg:gap-6">
          <div class="flex flex-col gap-1">
            <span class="font-body text-xs font-bold uppercase tracking-widest text-vsg-blue-600 lg:hidden">
              {{ columnLabels.title }}
            </span>
            <span class="font-body text-base font-semibold text-vsg-blue-900">
              {{ item.title }}
            </span>
          </div>

          <div class="flex flex-col gap-1">
            <span class="font-body text-xs font-bold uppercase tracking-widest text-vsg-blue-600 lg:hidden">
              {{ columnLabels.league }}
            </span>
            <span class="font-body text-base text-gray-700">
              {{ item.league }}
            </span>
          </div>

          <div class="flex flex-col gap-1 lg:items-start">
            <span class="font-body text-xs font-bold uppercase tracking-widest text-vsg-blue-600 lg:hidden">
              {{ columnLabels.url }}
            </span>
            <a
              :href="item.url"
              target="_blank"
              rel="noopener noreferrer"
              class="inline-flex items-center gap-2 font-body text-sm font-bold uppercase tracking-wider text-vsg-blue-600 transition-colors hover:text-vsg-blue-800"
            >
              Tabelle ansehen
              <FontAwesomeIcon icon="arrow-up-right-from-square" />
            </a>
          </div>
        </div>
      </div>
    </div>
  </Section>
</template>
