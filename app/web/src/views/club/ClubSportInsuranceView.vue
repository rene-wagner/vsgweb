<script setup lang="ts">
import EditableContent from "@/components/content/EditableContent.vue";
import HeroSectionSmall from "@/components/sections/HeroSectionSmall.vue";
import { clubSportInsuranceContent } from "@/content/club-sport-insurance-content";
</script>

<template>
  <div
    class="min-h-screen overflow-x-hidden text-white selection:bg-vsg-gold-500 selection:text-vsg-blue-900"
  >
    <HeroSectionSmall
      :headline="clubSportInsuranceContent.headline"
      :description="clubSportInsuranceContent.description"
      headline-uuid="8bad0c8e-e6ed-4b3e-8325-4edde40b7d50"
      description-uuid="9b1e5e81-d0e3-4500-83f1-0227055e616b"
      subtitle-uuid="66dbde05-fcf9-40df-8524-93a310da6a06"
    />

    <section class="bg-white py-16">
      <div class="mx-auto max-w-7xl px-6">
        <div class="prose prose-lg max-w-none font-body text-vsg-blue-700">
          <EditableContent
            uuid="f27b7591-7196-4991-b181-20fb62912745"
            :content="clubSportInsuranceContent.content"
            content-class="prose prose-lg max-w-none font-body text-vsg-blue-700"
          />
        </div>
      </div>
    </section>
  </div>
</template>
