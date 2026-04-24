<script setup lang="ts">
import Accordion from "@/components/Accordion.vue";
import Section from "@/components/Section.vue";
import type { SectionBackground } from "@/composables/useSectionBackground";

interface AccordionItem {
  id: string | number;
  title: string;
  content: {
    year?: string;
    text: string;
  }[];
}

interface Props {
  id?: string;
  title: string;
  titleUuid: string;
  subtitle?: string;
  subtitleUuid?: string;
  description?: string;
  descriptionUuid?: string;
  items: AccordionItem[];
  background?: SectionBackground;
}

const props = withDefaults(defineProps<Props>(), {
  id: undefined,
  subtitle: "",
  subtitleUuid: "accordion-section-subtitle",
  description: undefined,
  descriptionUuid: "accordion-section-description",
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
    <div class="mt-16">
      <Accordion :items="props.items" />
    </div>
  </Section>
</template>
