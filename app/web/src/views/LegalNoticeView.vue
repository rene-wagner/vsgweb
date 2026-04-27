<script setup lang="ts">
import EditableContent from "@/components/content/EditableContent.vue";
import { legalNoticeContent } from "@/content/legal-notice-content";
import HeroSectionSmall from "@/components/sections/HeroSectionSmall.vue";
</script>

<template>
  <div
    class="min-h-screen overflow-x-hidden text-white selection:bg-vsg-gold-500 selection:text-vsg-blue-900"
  >
    <HeroSectionSmall
      :headline="legalNoticeContent.headline"
      :description="legalNoticeContent.description"
      headline-uuid="2bfc91db-6000-4d34-8c5e-a8035e76a8fa"
      description-uuid="37150228-b4d0-4129-808c-88b0ce907d41"
      subtitle-uuid="67dbecc0-fe4e-4e4f-9fe7-013266da92e1"
    />

    <section class="bg-white py-16">
      <div class="mx-auto max-w-7xl px-6">
        <div class="prose prose-lg max-w-none font-body text-vsg-blue-700">
          <EditableContent
            uuid="3ee4918f-1343-41bf-96ec-97c33f2f2390"
            :content="legalNoticeContent.content"
            content-class="prose prose-lg max-w-none font-body text-vsg-blue-700"
          />
        </div>
      </div>
    </section>
  </div>
</template>
