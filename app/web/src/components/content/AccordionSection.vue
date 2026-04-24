<script setup lang="ts">
import EditableContent from "@/components/content/EditableContent.vue";
import Accordion from "@/components/ui/Accordion.vue";
import SectionHeader from "@/components/ui/SectionHeader.vue";
import { useSectionBackground, type SectionBackground } from "@/composables/useSectionBackground";

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

      <div class="mt-16">
        <Accordion :items="props.items" />
      </div>
    </div>
  </section>
</template>
