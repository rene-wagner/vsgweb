<script setup lang="ts">
import type { ChartData } from "chart.js";
import EditableContent from "@/components/content/EditableContent.vue";
import Chart from "@/components/ui/Chart.vue";
import Section from "@/components/ui/Section.vue";
import type { SectionBackground } from "@/composables/useSectionBackground";

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
    description-class="mx-auto max-w-3xl font-body text-lg text-gray-600"
    :background="props.background"
  >
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
  </Section>
</template>
