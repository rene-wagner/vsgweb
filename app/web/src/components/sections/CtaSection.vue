<script setup lang="ts">
import { RouterLink } from "vue-router";
import EditableContent from "@/components/content/EditableContent.vue";

interface Props {
  headline?: string;
  description?: string;
  headlineUuid?: string;
  descriptionUuid?: string;
  primaryButtonText?: string;
  primaryButtonLink?: string;
  secondaryButtonText?: string;
  secondaryButtonLink?: string;
  theme?: "gold" | "white";
}

const props = withDefaults(defineProps<Props>(), {
  headlineUuid: "cta-headline",
  descriptionUuid: "cta-description",
  primaryButtonText: "Mitglied werden",
  primaryButtonLink: "/verein/mitgliedschaft",
  secondaryButtonText: "Kontakt",
  secondaryButtonLink: "/kontakt",
  theme: "gold",
});
</script>

<template>
  <section
    class="relative overflow-hidden py-32 text-center px-6"
    :class="props.theme === 'white' ? 'bg-white' : ''"
  >
    <div
      v-if="props.theme === 'gold'"
      class="absolute inset-0 bg-linear-to-r from-vsg-gold-600 via-vsg-gold-400 to-vsg-gold-300"
    />

    <div class="relative z-10 mx-auto flex max-w-4xl flex-col">
      <div class="flex flex-col gap-6">
        <EditableContent
          v-if="props.headline"
          :uuid="props.headlineUuid"
          :content="props.headline"
          tag="h3"
          :content-class="
            [
              'font-display leading-tight tracking-wider text-vsg-blue-900 uppercase',
              props.theme === 'white' ? 'text-4xl md:text-6xl' : 'text-5xl md:text-7xl lg:text-8xl',
            ].join(' ')
          "
          frame-class="border-vsg-blue-900"
          edit-button-class="text-vsg-blue-900"
        />
        <EditableContent
          v-if="props.description"
          :uuid="props.descriptionUuid"
          :content="props.description"
          tag="p"
          content-class="mx-auto max-w-2xl font-body text-xl font-normal text-vsg-blue-800"
          frame-class="border-vsg-blue-900"
          edit-button-class="text-vsg-blue-900"
        />
      </div>
      <div class="mt-10 flex flex-col items-center justify-center gap-6 sm:flex-row">
        <RouterLink
          :to="props.primaryButtonLink"
          class="gold-glow bg-vsg-blue-900 px-10 py-4 font-display text-2xl tracking-wider text-vsg-gold-400 transition-colors hover:bg-vsg-blue-800"
        >
          {{ props.primaryButtonText }}
        </RouterLink>
        <RouterLink
          v-if="props.secondaryButtonText && props.secondaryButtonLink"
          :to="props.secondaryButtonLink"
          class="border-2 border-vsg-blue-900/50 px-10 py-4 font-display text-2xl tracking-wider text-vsg-blue-900 transition-colors hover:bg-vsg-blue-900/10"
        >
          {{ props.secondaryButtonText }}
        </RouterLink>
      </div>
    </div>
  </section>
</template>
