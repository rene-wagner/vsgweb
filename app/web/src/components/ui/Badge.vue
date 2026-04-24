<script setup lang="ts">
interface Props {
  accentClass?: string;
}

const props = withDefaults(defineProps<Props>(), {
  accentClass: "",
});
</script>

<template>
  <span
    class="rounded-full border px-3 py-1 text-xs font-body uppercase tracking-widest"
    :class="props.accentClass"
  >
    <slot />
  </span>
</template>
