<script setup lang="ts">
import type { ChartData } from "chart.js";
import EditableContent from "@/components/content/EditableContent.vue";
import SectionHeader from "@/components/ui/SectionHeader.vue";
import Chart from "@/components/ui/Chart.vue";
import { useSectionBackground, type SectionBackground } from "@/composables/useSectionBackground";

interface Props {
  id?: string;
  title: string;
  titleUuid: string;
  subtitle?: string;
  subtitleUuid?: string;
  description?: string;
  descriptionUuid?: string;
  chartTitle: string;
  chartTitleUuid: string;
  chartLegendLabel: string;
  chartLegendLabelUuid: string;
  data: ChartData<"line">;
  background?: SectionBackground;
}

const props = withDefaults(defineProps<Props>(), {
  id: undefined,
  subtitle: "",
  subtitleUuid: "chart-section-subtitle",
  description: undefined,
  descriptionUuid: "chart-section-description",
  background: "white",
});

const sectionBackgroundClass = useSectionBackground(() => props.background);
</script>

<template>
  <section :id="props.id" class="relative py-32" :class="sectionBackgroundClass">
    <div class="mx-auto max-w-7xl px-6">
      <div class="flex flex-col gap-6 text-center">
        <SectionHeader
          :subtitle="props.subtitle"
          :title="props.title"
          :subtitle-uuid="props.subtitleUuid"
          :title-uuid="props.titleUuid"
        />
        <EditableContent
          v-if="props.description"
          :uuid="props.descriptionUuid"
          :content="props.description"
          tag="p"
          content-class="mx-auto max-w-3xl font-body text-lg text-gray-600"
        />
      </div>

      <div class="mt-16 rounded-xl border border-gray-200 bg-white p-8 shadow-sm">
        <div class="mb-8 flex items-center justify-between gap-6">
          <EditableContent
            :uuid="props.chartTitleUuid"
            :content="props.chartTitle"
            tag="h3"
            content-class="font-display text-2xl tracking-widest text-vsg-gold-600 uppercase"
          />
          <div class="flex items-center gap-4 text-xs tracking-tighter text-vsg-blue-600 uppercase">
            <span class="flex items-center gap-1">
              <div class="h-3 w-3 rounded-full bg-vsg-gold-500"></div>
              <EditableContent
                :uuid="props.chartLegendLabelUuid"
                :content="props.chartLegendLabel"
                tag="span"
                content-class="text-xs tracking-tighter text-vsg-blue-600 uppercase"
              />
            </span>
          </div>
        </div>

        <div class="h-100 w-full">
          <Chart :data="props.data" />
        </div>
      </div>
    </div>
  </section>
</template>
