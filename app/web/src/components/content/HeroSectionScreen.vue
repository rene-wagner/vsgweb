<script setup lang="ts">
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import EditableContent from "./EditableContent.vue";
import Logo from "@/components/app/Logo.vue";

interface Props {
  tag?: string;
}

withDefaults(defineProps<Props>(), {
  tag: undefined,
});
</script>

<template>
  <section class="relative flex min-h-screen items-center justify-center overflow-hidden pt-20">
    <div
      class="absolute inset-0 bg-linear-to-br from-vsg-blue-900 via-vsg-blue-800/50 to-transparent"
    />

    <div class="absolute right-0 top-1/4 h-96 w-96 rounded-full bg-vsg-gold-400/10 blur-3xl" />
    <div class="absolute bottom-1/4 left-0 h-80 w-80 rounded-full bg-vsg-blue-500/20 blur-3xl" />

    <div class="relative z-10 mx-auto max-w-7xl px-6 py-20 text-center">
      <div class="animate-slide-up my-8 delay-100">
        <Logo class="mx-auto h-24 w-auto md:h-32 lg:h-42" />
      </div>

      <div v-if="tag" class="animate-slide-up my-8 delay-200">
        <span
          class="inline-block border border-vsg-gold-400/30 px-6 py-2 font-body font-normal uppercase tracking-widest text-vsg-gold-400"
        >
          <EditableContent uuid="uuid-tag" :content="tag" />
        </span>
      </div>

      <div class="absolute bottom-1 left-1/2 -translate-x-1/2 animate-bounce">
        <FontAwesomeIcon icon="arrow-down" class="text-vsg-gold-400" />
      </div>
    </div>
  </section>
</template>
