<script setup lang="ts">
import EditableContent from "@/components/content/EditableContent.vue";
import SectionHeader from "@/components/ui/SectionHeader.vue";
import { useSectionBackground, type SectionBackground } from "@/composables/useSectionBackground";

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

const sectionBackgroundClass = useSectionBackground(() => props.background);
</script>

<template>
  <section :id="props.id" class="relative py-32" :class="sectionBackgroundClass">
    <div class="mx-auto flex max-w-7xl flex-col px-6">
      <div class="flex flex-col gap-6">
        <SectionHeader
          :subtitle="props.subtitle"
          :title="props.headline"
          :subtitle-uuid="props.subtitleUuid"
          :title-uuid="props.headlineUuid"
        />
        <EditableContent
          v-if="props.description"
          :uuid="props.descriptionUuid"
          :content="props.description"
          tag="p"
          content-class="mx-auto max-w-3xl text-center font-body text-lg text-gray-600"
        />
      </div>

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
    </div>
  </section>
</template>
