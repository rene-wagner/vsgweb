<script setup lang="ts">
import { useSectionBackground, type SectionBackground } from "@/composables/useSectionBackground";
import EditableContent from "./EditableContent.vue";

interface Props {
  uuid: string;
  welcomeText: string;
  background?: SectionBackground;
}

const props = withDefaults(defineProps<Props>(), {
  background: "white",
});

const sectionBackgroundClass = useSectionBackground(() => props.background);
</script>

<template>
  <section class="py-20" :class="sectionBackgroundClass">
    <div class="mx-auto max-w-3xl px-6">
      <!-- Top gold divider -->
      <div class="flex items-center gap-4 mb-10">
        <div class="flex-1 h-px bg-vsg-gold-400"></div>
        <div class="flex gap-1.5">
          <span class="block w-1.5 h-1.5 rounded-full bg-vsg-gold-400"></span>
          <span class="block w-1.5 h-1.5 rounded-full bg-vsg-gold-500"></span>
          <span class="block w-1.5 h-1.5 rounded-full bg-vsg-gold-400"></span>
        </div>
        <div class="flex-1 h-px bg-vsg-gold-400"></div>
      </div>

        <EditableContent
          :uuid="props.uuid"
          :content="props.welcomeText"
          content-class="prose prose-lg mx-auto max-w-none text-center prose-headings:font-display prose-headings:text-vsg-blue-900 prose-p:font-body prose-p:text-gray-700 prose-a:text-vsg-blue-600 prose-a:no-underline prose-a:hover:text-vsg-gold-500 prose-strong:text-vsg-blue-900 prose-li:text-gray-700"
        />

      <!-- Bottom gold divider -->
      <div class="flex items-center gap-4 mt-10">
        <div class="flex-1 h-px bg-vsg-gold-400"></div>
        <div class="flex gap-1.5">
          <span class="block w-1.5 h-1.5 rounded-full bg-vsg-gold-400"></span>
          <span class="block w-1.5 h-1.5 rounded-full bg-vsg-gold-500"></span>
          <span class="block w-1.5 h-1.5 rounded-full bg-vsg-gold-400"></span>
        </div>
        <div class="flex-1 h-px bg-vsg-gold-400"></div>
      </div>
    </div>
  </section>
</template>
