<script setup lang="ts">
import EditableContent from "@/components/content/EditableContent.vue";
import Section from "@/components/sections/Section.vue";
import type { SectionBackground } from "@/composables/useSectionBackground";

interface FestivalItem {
  headline: string;
  text: string;
}

interface Props {
  id?: string;
  subtitle: string;
  headline: string;
  description?: string;
  items: FestivalItem[];
  subtitleUuid: string;
  headlineUuid: string;
  descriptionUuid?: string;
  itemHeadlineUuidPrefix: string;
  itemTextUuidPrefix: string;
  background?: SectionBackground;
}

const props = withDefaults(defineProps<Props>(), {
  id: undefined,
  description: undefined,
  descriptionUuid: "festival-section-description",
  background: "white",
});
</script>

<template>
  <Section
    :id="props.id"
    :subtitle="props.subtitle"
    :title="props.headline"
    :subtitle-uuid="props.subtitleUuid"
    :title-uuid="props.headlineUuid"
    :description="props.description"
    :description-uuid="props.descriptionUuid"
    description-tag="p"
    :background="props.background"
  >
    <div class="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      <div
        v-for="(item, index) in props.items"
        :key="`${item.headline}-${index}`"
        class="group relative overflow-hidden border border-gray-200 bg-white p-8 shadow-sm transition-all hover:bg-gray-50"
      >
        <EditableContent
          :uuid="`${props.itemHeadlineUuidPrefix}-${index}`"
          :content="item.headline"
          tag="h4"
          content-class="font-display text-2xl tracking-widest text-vsg-blue-900 uppercase"
        />
        <EditableContent
          :uuid="`${props.itemTextUuidPrefix}-${index}`"
          :content="item.text"
          tag="p"
          content-class="mt-4 font-body text-base leading-relaxed text-vsg-blue-700"
        />
      </div>
    </div>
  </Section>
</template>
