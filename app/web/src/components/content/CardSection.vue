<script setup lang="ts">
import Section from "@/components/ui/Section.vue";
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
  columns?: 2 | 3;
}

const props = withDefaults(defineProps<Props>(), {
  id: undefined,
  subtitle: "",
  description: undefined,
  subtitleUuid: "card-section-subtitle",
  descriptionUuid: "card-section-description",
  background: "white",
  columns: 3,
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
      <div class="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-4">
        <slot />
      </div>
  </Section>
</template>
