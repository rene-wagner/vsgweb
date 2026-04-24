<script setup lang="ts">
import { computed, ref } from "vue";
import EditableContent from "@/components/content/EditableContent.vue";
import Card from "@/components/cards/Card.vue";
import Section from "@/components/sections/Section.vue";
import Badge from "@/components/ui/Badge.vue";
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

function getCategoryIcon(categoryId: string): string {
  switch (categoryId) {
    case "badminton":
      return "trophy";
    case "table-tennis":
      return "medal";
    case "volleyball":
      return "people-group";
    default:
      return "users";
  }
}

function getItemImageSrc(categoryId: string, year: string): string | undefined {
  if (categoryId === "badminton" && year === "1997") {
    return "https://placehold.co/600x400/png";
  }

  return undefined;
}

function getItemImageAlt(title: string): string {
  return `${title} Platzhalterbild`;
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
      <Card
        v-for="(item, index) in filteredItems"
        :key="`${item.year}-${item.title}-${index}`"
        :icon="getCategoryIcon(item.category)"
        :image-src="getItemImageSrc(item.category, item.year)"
        :image-alt="getItemImageAlt(item.title)"
      >
        <template #meta-start>
          <span class="font-display text-2xl text-vsg-gold-600">{{ item.year }}</span>
        </template>
        <template #meta-end>
          <Badge :accent-class="getAccentClasses(item.category)">
            {{ getCategoryLabel(item.category) }}
          </Badge>
        </template>
        <template #title>
          <EditableContent
            :uuid="`${props.itemTitleUuidPrefix}-${index}`"
            :content="item.title"
            tag="span"
            content-class="font-display text-2xl tracking-widest text-vsg-blue-900 uppercase"
          />
        </template>
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
          content-class="mt-4 border-l-4 border-vsg-gold-500 pl-4 font-body text-base italic text-vsg-blue-600"
        />
      </Card>
    </div>
  </Section>
</template>
