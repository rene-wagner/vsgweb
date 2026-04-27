<script setup lang="ts">
import EditableContent from "@/components/content/EditableContent.vue";
import HeroSectionSmall from "@/components/sections/HeroSectionSmall.vue";
import { clubMembershipContent } from "@/content/club-membership-content";
</script>

<template>
  <div
    class="min-h-screen overflow-x-hidden text-white selection:bg-vsg-gold-500 selection:text-vsg-blue-900"
  >
    <HeroSectionSmall
      :headline="clubMembershipContent.headline"
      :description="clubMembershipContent.description"
      headline-uuid="362d915d-4e9e-4d81-8f68-17f47c6ea23c"
      description-uuid="17c89b19-1216-454a-bbe5-d38bd318545a"
      subtitle-uuid="439f0469-041a-4662-b416-c8309f703e28"
    />

    <section class="bg-white py-16">
      <div class="mx-auto max-w-7xl px-6">
        <div class="prose prose-lg max-w-none font-body text-vsg-blue-700">
          <EditableContent
            uuid="8dd7e048-6eb9-4d82-a607-e3ac4a18e9b9"
            :content="clubMembershipContent.content"
            content-class="prose prose-lg max-w-none font-body text-vsg-blue-700"
          />
        </div>
      </div>
    </section>
  </div>
</template>
