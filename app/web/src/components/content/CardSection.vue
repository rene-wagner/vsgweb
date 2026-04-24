<script setup lang="ts">
import EditableContent from "@/components/content/EditableContent.vue";
import SectionHeader from "@/components/ui/SectionHeader.vue";
import { useSectionBackground, type SectionBackground } from "@/composables/useSectionBackground";

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

const sectionBackgroundClass = useSectionBackground(() => props.background);
</script>

<template>
  <section class="relative py-32" :class="sectionBackgroundClass">
    <div class="mx-auto flex max-w-7xl flex-col px-6">
      <div class="flex flex-col gap-6">
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
          content-class="font-body text-lg leading-relaxed text-vsg-blue-700"
        />
      </div>

      <div class="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-4">
        <slot />
      </div>
    </div>
  </section>
</template>
