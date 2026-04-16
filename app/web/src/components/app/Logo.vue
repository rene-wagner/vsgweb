<script setup lang="ts">
import { onMounted, useAttrs } from "vue";
import { storeToRefs } from "pinia";
import { useHomepageStore } from "@/stores/homepageStore";
import logoFallback from "@/assets/logo.svg";

defineOptions({ inheritAttrs: false });

const attrs = useAttrs();

const homepageStore = useHomepageStore();
const { homepageContent } = storeToRefs(homepageStore);

onMounted(() => {
  if (!homepageContent.value) {
    homepageStore.fetchHomepageContent();
  }
});
</script>

<template>
  <img
    v-if="homepageContent?.heroLogo?.path"
    :src="homepageContent.heroLogo.path"
    alt="VSG Kugelberg Logo"
    title="VSG Kugelberg Logo"
    v-bind="attrs"
  />
  <img
    v-else
    :src="logoFallback"
    alt="VSG Kugelberg Logo"
    title="VSG Kugelberg Logo"
    v-bind="attrs"
  />
</template>
