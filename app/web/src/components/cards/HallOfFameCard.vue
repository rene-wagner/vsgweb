<script setup lang="ts">
import EditableContent from "@/components/content/EditableContent.vue";

interface Props {
  year?: string;
  categoryLabel?: string;
  categoryAccentClass?: string;
  title: string;
  description: string;
  titleUuid: string;
  descriptionUuid: string;
  icon?: string;
  imageSrc?: string;
  imageAlt?: string;
}

const props = withDefaults(defineProps<Props>(), {
  year: undefined,
  categoryLabel: undefined,
  categoryAccentClass: "",
  icon: undefined,
  imageSrc: undefined,
  imageAlt: undefined,
});
</script>

<template>
  <div
    class="flex flex-col gap-4 border border-gray-200 bg-white p-8 shadow-sm transition-transform duration-200 hover:-translate-y-1"
  >
    <div
      v-if="$slots['meta-start'] || $slots['meta-end'] || props.year || props.categoryLabel"
      class="mb-5 flex items-start justify-between gap-4"
    >
      <div v-if="$slots['meta-start'] || props.year">
        <slot name="meta-start" />
      </div>

      <div v-if="$slots['meta-end'] || props.categoryLabel">
        <slot name="meta-end" />
      </div>
    </div>

    <div v-if="props.imageSrc || props.icon" class="mb-2">
      <div v-if="props.imageSrc" class="overflow-hidden rounded-lg bg-gray-100">
        <img
          :src="props.imageSrc"
          :alt="props.imageAlt || props.title"
          class="aspect-video w-full object-cover"
        />
      </div>
      <div
        v-else
        class="flex h-16 w-16 items-center justify-center rounded-lg bg-vsg-blue-600/10 text-vsg-blue-600"
      >
        <FontAwesomeIcon :icon="props.icon!" class="text-2xl" />
      </div>
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
  </div>
</template>
