<script setup lang="ts">
import EditableContent from "@/components/content/EditableContent.vue";
import { dataPrivacyContent } from "@/content/data-privacy-content";
import HeroSectionSmall from "../components/content/HeroSectionSmall.vue";
</script>

<template>
  <div
    class="min-h-screen overflow-x-hidden text-white selection:bg-vsg-gold-500 selection:text-vsg-blue-900"
  >
    <HeroSectionSmall
      :headline="dataPrivacyContent.headline"
      :description="dataPrivacyContent.description"
      headline-uuid="data-privacy-hero-headline"
      description-uuid="data-privacy-hero-description"
    />

    <section class="bg-white py-16">
      <div class="mx-auto max-w-7xl px-6">
        <div class="prose prose-lg max-w-none font-body text-vsg-blue-700">
          <EditableContent
            uuid="data-privacy-content"
            :content="dataPrivacyContent.content"
            content-class="prose prose-lg max-w-none font-body text-vsg-blue-700"
          />
        </div>
      </div>
    </section>
  </div>
</template>
