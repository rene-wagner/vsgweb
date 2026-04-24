<script setup lang="ts">
import EditableContent from "@/components/content/EditableContent.vue";

interface Props {
  year: string;
  categoryLabel: string;
  categoryAccentClass: string;
  title: string;
  description: string;
  highlight?: string;
  titleUuid: string;
  descriptionUuid: string;
  highlightUuid: string;
}

const props = withDefaults(defineProps<Props>(), {
  highlight: undefined,
});
</script>

<template>
  <div
    class="flex flex-col gap-4 rounded-xl border border-gray-200 bg-white p-8 shadow-sm transition-transform duration-200 hover:-translate-y-1"
  >
    <div class="mb-5 flex items-start justify-between gap-4">
      <span class="font-display text-2xl text-vsg-gold-600">{{ props.year }}</span>
      <span
        class="rounded-full border px-3 py-1 text-xs font-body uppercase tracking-widest"
        :class="props.categoryAccentClass"
      >
        {{ props.categoryLabel }}
      </span>
    </div>

    <EditableContent
      :uuid="props.titleUuid"
      :content="props.title"
      tag="h4"
      content-class="font-display text-2xl tracking-widest text-vsg-blue-900 uppercase"
    />

    <EditableContent
      :uuid="props.descriptionUuid"
      :content="props.description"
      tag="div"
      content-class="font-body text-base leading-relaxed text-vsg-blue-700"
    />

    <EditableContent
      v-if="props.highlight"
      :uuid="props.highlightUuid"
      :content="props.highlight"
      tag="blockquote"
      content-class="border-l-4 border-vsg-gold-500 pl-4 font-body text-base italic text-vsg-blue-600"
    />
  </div>
</template>
