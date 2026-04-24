<script setup lang="ts">
import EditableContent from "@/components/EditableContent.vue";
import { useSectionBackground, type SectionBackground } from "@/composables/useSectionBackground";
import SectionHeader from "./SectionHeader.vue";

interface Props {
  id?: string;
  subtitle?: string;
  title: string;
  subtitleUuid?: string;
  titleUuid: string;
  description?: string;
  descriptionUuid?: string;
  descriptionTag?: string;
  descriptionClass?: string;
  background?: SectionBackground;
}

const props = withDefaults(defineProps<Props>(), {
  id: undefined,
  subtitle: "",
  description: undefined,
  subtitleUuid: "section-subtitle",
  descriptionUuid: "section-description",
  descriptionTag: "div",
  descriptionClass: "mx-auto max-w-3xl text-center font-body text-lg text-gray-600",
  background: "white",
});

const sectionBackgroundClass = useSectionBackground(() => props.background);
</script>

<template>
  <section :id="props.id" class="relative py-32" :class="sectionBackgroundClass">
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
          :tag="props.descriptionTag"
          :content-class="props.descriptionClass"
        />
      </div>

      <slot />
    </div>
  </section>
</template>
