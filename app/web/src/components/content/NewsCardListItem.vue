<script setup lang="ts">
import { RouterLink } from "vue-router";

interface Props {
  category: string;
  date: string;
  title: string;
  to?: string;
}

withDefaults(defineProps<Props>(), {
  to: "/",
});
</script>

<template>
  <RouterLink :to="to" class="card-hover group block border-l-4 border-vsg-blue-600 bg-gray-50 p-6">
    <div class="mb-3 flex flex-wrap items-center gap-3">
      <span
        class="inline-block bg-vsg-blue-500 px-3 py-1 font-display text-sm tracking-wider text-white"
      >
        {{ category }}
      </span>
      <span class="font-body text-sm font-normal text-vsg-blue-500">
        {{ date }}
      </span>
    </div>
    <h5
      class="mt-1 font-display text-xl tracking-wider text-vsg-blue-900 transition-colors group-hover:text-vsg-blue-600"
    >
      {{ title }}
    </h5>
  </RouterLink>
</template>
