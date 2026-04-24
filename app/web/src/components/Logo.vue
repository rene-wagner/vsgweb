<script setup lang="ts">
import { useAttrs } from "vue";

defineOptions({ inheritAttrs: false });

const attrs = useAttrs();
</script>

<template>
  <img src="/logo.png" alt="VSG Kugelberg Logo" title="VSG Kugelberg Logo" v-bind="attrs" />
</template>
