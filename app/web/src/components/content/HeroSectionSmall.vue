<script setup lang="ts">
import { computed } from "vue";
import EditableContent from "./EditableContent.vue";
import MarkdownRenderer from "@/components/ui/MarkdownRenderer.vue";

interface Props {
  headline?: string;
  description?: string;
  subtitle?: string;
  iconUrl?: string;
  headlineUuid?: string;
  descriptionUuid?: string;
  subtitleUuid?: string;
  editableHeadline?: boolean;
  editableDescription?: boolean;
  primaryCtaLabel?: string;
  primaryCtaAnchor?: string;
  secondaryCtaLabel?: string;
  secondaryCtaAnchor?: string;
}

const props = withDefaults(defineProps<Props>(), {
  headline: "",
  description: undefined,
  subtitle: undefined,
  iconUrl: undefined,
  headlineUuid: "uuid-headline",
  descriptionUuid: "uuid-description",
  subtitleUuid: "uuid-subtitle",
  editableHeadline: true,
  editableDescription: true,
  primaryCtaLabel: undefined,
  primaryCtaAnchor: undefined,
  secondaryCtaLabel: undefined,
  secondaryCtaAnchor: undefined,
});

const hasCtaButtons = computed(() => {
  return (
    (props.primaryCtaLabel && props.primaryCtaAnchor) ||
    (props.secondaryCtaLabel && props.secondaryCtaAnchor)
  );
});

function handleAnchorClick(e: MouseEvent, anchor: string) {
  if (anchor.startsWith("#")) {
    const target = document.querySelector(anchor);
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: "smooth" });
      history.pushState(null, "", anchor);
    }
  }
}
</script>

<template>
  <section class="relative flex min-h-[70vh] items-center justify-center overflow-hidden pt-20">
    <div
      class="absolute inset-0 bg-linear-to-br from-vsg-blue-900 via-vsg-blue-800/50 to-transparent"
    />

    <div class="absolute right-0 top-1/4 h-96 w-96 rounded-full bg-vsg-gold-400/10 blur-3xl" />
    <div class="absolute bottom-1/4 left-0 h-80 w-80 rounded-full bg-vsg-blue-500/20 blur-3xl" />

    <div v-if="iconUrl" class="absolute right-10 top-1/2 -translate-y-1/2 opacity-7">
      <img :src="iconUrl" alt="" class="h-125 w-125 object-contain" />
    </div>

    <div class="relative z-10 mx-auto max-w-7xl px-6 py-20 text-center">
      <h1
        v-if="headline"
        class="animate-slide-up text-glow font-display text-7xl text-white delay-300 md:text-8xl lg:text-9xl"
        :class="{
          'text-[5rem] leading-[0.85] tracking-tight md:text-[8rem] lg:text-[10rem]': iconUrl,
        }"
      >
        <EditableContent v-if="editableHeadline" :uuid="headlineUuid" :content="headline" />
        <span v-else>{{ headline }}</span>
      </h1>

      <div v-if="description" class="animate-slide-up mx-auto mt-8 max-w-2xl delay-400">
        <EditableContent
          v-if="editableDescription"
          :uuid="descriptionUuid"
          :content="description"
          class="whitespace-pre-line font-body text-lg font-normal text-vsg-blue-300 md:text-xl"
        />
        <MarkdownRenderer
          v-else
          :content="description"
          content-class="whitespace-pre-line font-body text-lg font-normal text-vsg-blue-300 md:text-xl"
          :use-default-class="false"
        />
      </div>

      <div v-if="subtitle" class="animate-slide-up mx-auto mt-8 max-w-2xl delay-400">
        <EditableContent
          :uuid="subtitleUuid"
          :content="subtitle"
          class="font-body text-lg font-normal text-vsg-gold-400 md:text-xl"
        />
      </div>

      <div
        v-if="hasCtaButtons"
        class="animate-slide-up mt-12 flex flex-col items-center justify-center gap-6 delay-400 sm:flex-row"
      >
        <a
          v-if="primaryCtaLabel && primaryCtaAnchor"
          :href="primaryCtaAnchor"
          class="btn-primary gold-glow bg-vsg-gold-400 px-10 py-4 font-display text-2xl tracking-wider text-vsg-blue-900"
          @click="handleAnchorClick($event, primaryCtaAnchor)"
        >
          {{ primaryCtaLabel }}
        </a>
        <a
          v-if="secondaryCtaLabel && secondaryCtaAnchor"
          :href="secondaryCtaAnchor"
          class="border-2 border-vsg-gold-400/50 px-10 py-4 font-display text-2xl tracking-wider text-vsg-gold-400 transition-colors hover:bg-vsg-gold-400/10"
          @click="handleAnchorClick($event, secondaryCtaAnchor)"
        >
          {{ secondaryCtaLabel }}
        </a>
      </div>
    </div>
  </section>
</template>
