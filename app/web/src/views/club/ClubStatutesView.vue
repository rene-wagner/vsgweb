<script setup lang="ts">
import EditableContent from "@/components/content/EditableContent.vue";
import HeroSectionSmall from "@/components/sections/HeroSectionSmall.vue";
import { clubStatutesContent } from "@/content/club-statutes-content";
</script>

<template>
  <div
    class="min-h-screen overflow-x-hidden text-white selection:bg-vsg-gold-500 selection:text-vsg-blue-900"
  >
    <HeroSectionSmall
      :headline="clubStatutesContent.headline"
      :description="clubStatutesContent.description"
      headline-uuid="68a337ed-4cd5-4af0-ba64-f34f84267ea1"
      description-uuid="f7e9112f-7026-4e23-8d05-03152736d181"
      subtitle-uuid="7f30159a-d80d-477a-abde-acd45a4f8a9b"
    />

    <section class="bg-white py-16">
      <div class="mx-auto max-w-7xl px-6">
        <div class="prose prose-lg max-w-none font-body text-vsg-blue-700">
          <EditableContent
            uuid="1b0be559-805a-410e-a80f-cf422f653c88"
            :content="clubStatutesContent.content"
            content-class="prose prose-lg max-w-none font-body text-vsg-blue-700"
          />
        </div>
      </div>
    </section>
  </div>
</template>
