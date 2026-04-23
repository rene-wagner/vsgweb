<script setup lang="ts">
import EditableContent from "@/components/content/EditableContent.vue";

interface Props {
  subtitle: string;
  title: string;
  subtitleUuid: string;
  titleUuid: string;
  centered?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  centered: true,
});
</script>

<template>
  <div :class="{ 'text-center': centered }">
    <EditableContent
      :uuid="props.subtitleUuid"
      :content="props.subtitle"
      tag="span"
      content-class="font-body font-normal uppercase tracking-widest text-vsg-blue-600"
    />
    <EditableContent
      :uuid="props.titleUuid"
      :content="props.title"
      tag="h3"
      content-class="mt-4 font-display text-6xl text-vsg-blue-900 md:text-7xl"
    />
  </div>
</template>
