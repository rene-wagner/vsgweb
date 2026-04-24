<script setup lang="ts">
import { computed, ref } from "vue";
import EditableContent from "@/components/content/EditableContent.vue";
import Section from "@/components/ui/Section.vue";
import type { SectionBackground } from "@/composables/useSectionBackground";

interface HallOfFameCategory {
  id: string;
  label: string;
}

interface HallOfFameItem {
  year: string;
  category: string;
  title: string;
  description: string;
  highlight?: string;
}

interface Props {
  id?: string;
  subtitle: string;
  headline: string;
  description?: string;
  categories: HallOfFameCategory[];
  items: HallOfFameItem[];
  subtitleUuid: string;
  headlineUuid: string;
  descriptionUuid?: string;
  itemTitleUuidPrefix: string;
  itemDescriptionUuidPrefix: string;
  itemHighlightUuidPrefix: string;
  background?: SectionBackground;
}

const props = withDefaults(defineProps<Props>(), {
  id: undefined,
  description: undefined,
  descriptionUuid: "hall-of-fame-description",
  background: "white",
});

const currentFilter = ref("all");

const filteredItems = computed(() => {
  if (currentFilter.value === "all") {
    return props.items;
  }

  return props.items.filter((item) => item.category === currentFilter.value);
});

function setFilter(id: string): void {
  currentFilter.value = id;
}

function getCategoryLabel(categoryId: string): string {
  return props.categories.find((category) => category.id === categoryId)?.label ?? categoryId;
}

function getAccentClasses(categoryId: string): string {
  switch (categoryId) {
    case "badminton":
      return "border-vsg-gold-500 bg-vsg-gold-50 text-vsg-gold-700";
    case "table-tennis":
      return "border-vsg-blue-400 bg-vsg-blue-50 text-vsg-blue-700";
    case "volleyball":
      return "border-vsg-blue-700 bg-vsg-blue-100 text-vsg-blue-800";
    default:
      return "border-vsg-blue-200 bg-gray-100 text-vsg-blue-700";
  }
}
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
      <div class="mt-16 flex flex-wrap justify-center gap-4">
        <button
          type="button"
          class="font-display text-lg tracking-widest border-2 px-6 py-2 transition-all"
          :class="[
            currentFilter === 'all'
              ? 'border-vsg-gold-600 bg-vsg-gold-600 text-white'
              : 'border-vsg-gold-600/30 text-vsg-gold-600 hover:bg-vsg-gold-600 hover:text-white',
          ]"
          @click="setFilter('all')"
        >
          Alle
        </button>
        <button
          v-for="category in props.categories"
          :key="category.id"
          type="button"
          class="font-display text-lg tracking-widest border-2 px-6 py-2 transition-all"
          :class="[
            currentFilter === category.id
              ? 'border-vsg-gold-600 bg-vsg-gold-600 text-white'
              : 'border-vsg-gold-600/30 text-vsg-gold-600 hover:bg-vsg-gold-600 hover:text-white',
          ]"
          @click="setFilter(category.id)"
        >
          {{ category.label }}
        </button>
      </div>

      <div class="mt-12 grid gap-6 md:grid-cols-2">
        <div
          v-for="(item, index) in filteredItems"
          :key="`${item.year}-${item.title}-${index}`"
          class="flex flex-col gap-4 rounded-xl border border-gray-200 bg-white p-8 shadow-sm transition-transform duration-200 hover:-translate-y-1"
        >
          <div class="mb-5 flex items-start justify-between gap-4">
            <span class="font-display text-2xl text-vsg-gold-600">{{ item.year }}</span>
            <span
              class="rounded-full border px-3 py-1 text-xs font-body uppercase tracking-widest"
              :class="getAccentClasses(item.category)"
            >
              {{ getCategoryLabel(item.category) }}
            </span>
          </div>

          <EditableContent
            :uuid="`${props.itemTitleUuidPrefix}-${index}`"
            :content="item.title"
            tag="h4"
            content-class="font-display text-2xl tracking-widest text-vsg-blue-900 uppercase"
          />

          <EditableContent
            :uuid="`${props.itemDescriptionUuidPrefix}-${index}`"
            :content="item.description"
            tag="div"
            content-class="font-body text-base leading-relaxed text-vsg-blue-700"
          />

          <EditableContent
            v-if="item.highlight"
            :uuid="`${props.itemHighlightUuidPrefix}-${index}`"
            :content="item.highlight"
            tag="blockquote"
            content-class="border-l-4 border-vsg-gold-500 pl-4 font-body text-base italic text-vsg-blue-600"
          />
        </div>
      </div>
  </Section>
</template>
