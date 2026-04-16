<script setup lang="ts">
import { RouterLink } from "vue-router";

interface Props {
  headline?: string;
  description?: string;
  primaryButtonText?: string;
  primaryButtonLink?: string;
  secondaryButtonText?: string;
  secondaryButtonLink?: string;
  theme?: "gold" | "white";
}

const props = withDefaults(defineProps<Props>(), {
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

    <div class="relative z-10 mx-auto max-w-4xl">
      <!-- eslint-disable vue/no-v-html -->
      <h3
        class="font-display leading-tight tracking-wider text-vsg-blue-900 uppercase mb-8"
        :class="
          props.theme === 'white' ? 'text-4xl md:text-6xl' : 'text-5xl md:text-7xl lg:text-8xl'
        "
        v-html="props.headline"
      ></h3>
      <!-- eslint-enable vue/no-v-html -->
      <p
        v-if="props.description"
        class="mx-auto mt-6 max-w-2xl font-body text-xl font-normal text-vsg-blue-800"
      >
        {{ props.description }}
      </p>
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
