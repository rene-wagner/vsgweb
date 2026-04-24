<script setup lang="ts">
import Section from "@/components/sections/Section.vue";
import type { SectionBackground } from "@/composables/useSectionBackground";

interface Props {
  id?: string;
  subtitle?: string;
  title: string;
  description?: string;
  subtitleUuid?: string;
  titleUuid: string;
  descriptionUuid?: string;
  background?: SectionBackground;
}

const props = withDefaults(defineProps<Props>(), {
  id: undefined,
  subtitle: "",
  description: undefined,
  subtitleUuid: "card-section-subtitle",
  descriptionUuid: "card-section-description",
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
    description-class="font-body text-lg leading-relaxed text-vsg-blue-700"
    :background="props.background"
  >
    <slot />
  </Section>
</template>
