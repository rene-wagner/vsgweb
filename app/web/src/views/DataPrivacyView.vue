<script setup lang="ts">
import EditableContent from "@/components/content/EditableContent.vue";
import { dataPrivacyContent } from "@/content/data-privacy-content";
import HeroSectionSmall from "@/components/sections/HeroSectionSmall.vue";
</script>

<template>
  <div
    class="min-h-screen overflow-x-hidden text-white selection:bg-vsg-gold-500 selection:text-vsg-blue-900"
  >
    <HeroSectionSmall
      :headline="dataPrivacyContent.headline"
      :description="dataPrivacyContent.description"
      headline-uuid="fc2c3d20-8447-4aca-98f6-e219334bfbe3"
      description-uuid="887f2db2-2f8f-43d4-8013-c832e104fbaf"
      subtitle-uuid="dce41cdf-c437-4059-87e9-76c8a28ab2a0"
    />

    <section class="bg-white py-16">
      <div class="mx-auto max-w-7xl px-6">
        <div class="prose prose-lg max-w-none font-body text-vsg-blue-700">
          <EditableContent
            uuid="29aab20b-586b-4727-b451-b36d3e86ddb6"
            :content="dataPrivacyContent.content"
            content-class="prose prose-lg max-w-none font-body text-vsg-blue-700"
          />
        </div>
      </div>
    </section>
  </div>
</template>
