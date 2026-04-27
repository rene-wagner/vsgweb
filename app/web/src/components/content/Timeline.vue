<script setup lang="ts">
import EditableContent from "@/components/content/EditableContent.vue";

defineProps<{
  content: string;
  contentUuid: string;
}>();
</script>

<template>
  <div
    class="timeline prose-li:text-vsg-blue-900 prose-li:mb-4 prose-strong:text-vsg-gold-600 prose-strong:font-display prose-p:first:flex prose-p:first:gap-4 prose-p:first:font-semibold prose-p:first:ml-0 prose-p:ml-11 prose-h3::font-display prose-h3:text-3xl prose-h3:uppercase prose-h3:text-vsg-blue-900 prose-h3:mb-8"
  >
    <EditableContent :uuid="contentUuid" :content="content" content-class="timeline" />
  </div>
</template>
